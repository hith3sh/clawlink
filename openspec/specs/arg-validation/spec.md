# arg-validation Specification

## Purpose
TBD - created by archiving change add-arg-trap-guards-and-recovery. Update Purpose after archive.
## Requirements
### Requirement: Generic placeholder detection at the executor boundary

The system SHALL inspect every string field in a tool's incoming arguments before forwarding to the upstream provider and reject calls whose argument values match any of the following placeholder patterns: angle-bracket templates matching `^<[a-zA-Z_][\w.-]*>$`, URL-embedded angle-bracket templates whose placeholder name starts with `your` or contains a hyphen, whole-string curly-brace templates matching `^\{[a-zA-Z_][\w.-]*\}$`, and whole-string keyword placeholders matching `your_*`, `replace_me`, `replace_with_*`, `placeholder*`, `insert_*`, `paste_*_here`, `fixme`, or six-or-more `x` characters. The check SHALL deliberately NOT reject bare values like `me`, `self`, `null`, `TODO`, or `TBD` because those are context-dependent and may be legitimate for some fields. Rejections SHALL produce a `type: "validation"` error with `code: "placeholder_argument"`, populate `invalidFields` with the offending argument paths, and include a `hint` that names every offending field plus an instruction to look up the real identifier via the relevant `*_get_*` / `*_list_*` tool.

#### Scenario: Reject angle-bracket placeholder
- **WHEN** an agent calls any tool with an argument whose string value equals `<user_id>`
- **THEN** the executor SHALL respond with `error.type === "validation"`, `error.code === "placeholder_argument"`, and SHALL NOT forward the request to the upstream provider

#### Scenario: Reject `YOUR_*` keyword placeholder
- **WHEN** an agent calls any tool with an argument whose string value equals `YOUR_API_KEY` (case-insensitive)
- **THEN** the executor SHALL respond with `error.type === "validation"` and `error.code === "placeholder_argument"` and SHALL include the offending field path in `invalidFields`

#### Scenario: Allow context-dependent values to pass through
- **WHEN** an agent calls any tool with an argument whose string value equals `me`, `self`, `null`, `TODO`, or `TBD`
- **THEN** the generic placeholder detector SHALL NOT reject the call (per-tool `fieldValidators` may still reject the value if a rule is registered)

#### Scenario: Walk nested object/array arguments
- **WHEN** an agent calls a tool with `{ filter: { ids: ["<id>"] } }` as its arguments
- **THEN** the executor SHALL detect the placeholder at the nested path and SHALL include `arguments.filter.ids[0]` in `invalidFields`

### Requirement: Per-tool field validator rules expressed as data

The system SHALL allow each Composio tool override entry in `config/composio-tool-overrides.mjs` to declare a `fieldValidators` property of shape `Record<fieldName, { allow?: string[], allowPatterns?: RegExp[], deny?: string[], denyPatterns?: RegExp[], message: string, hint?: string }>`. A field's string value SHALL be rejected when it matches any `deny` entry, when it matches any `denyPattern`, OR when an allowlist (`allow` or `allowPatterns`) is declared and the value matches none of its entries. Rejections SHALL produce a `type: "validation"` error with `code: "invalid_field_value"`, populate `invalidFields` with the offending field path, set `error.message` to the rule's `message`, and set the response `hint` to the rule's `hint` (or a generic retry hint when the rule omits one). The check SHALL be invoked from the executor immediately after the generic placeholder detector and before any upstream call.

#### Scenario: Reject a denied exact value
- **WHEN** a tool's `fieldValidators.foo` declares `deny: ["bad"]` and an agent calls it with `{ foo: "bad" }`
- **THEN** the executor SHALL respond with `error.code === "invalid_field_value"`, `error.message` matching the rule's `message`, and a `hint` matching the rule's `hint`

#### Scenario: Reject a value outside an allowlist
- **WHEN** a tool's `fieldValidators.foo` declares `allow: ["a", "b"]` and an agent calls it with `{ foo: "c" }`
- **THEN** the executor SHALL reject the call with `error.code === "invalid_field_value"`

#### Scenario: Allow a value matching an allowPattern
- **WHEN** a tool's `fieldValidators.foo` declares `allowPatterns: [/^valid-[a-z]+$/]` and an agent calls it with `{ foo: "valid-thing" }`
- **THEN** the executor SHALL forward the call to the upstream provider

#### Scenario: Skip rules for undefined/null/non-string values
- **WHEN** a tool's `fieldValidators.foo` exists and an agent omits `foo` from the arguments (or passes a number or null)
- **THEN** the executor SHALL NOT raise a validator rejection for that field (schema-level required-field validation handles missing fields separately)

### Requirement: LinkedIn post-author validator denies placeholder URNs and organization URNs

The `LINKEDIN_CREATE_LINKED_IN_POST.author` and `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE.author` fields SHALL be configured with a validator that denies both placeholder URNs and organization URNs. Specifically, the validator SHALL deny any value matching `/^urn:li:person:(self|me|user|current[_-]?user)$/i` or `/^urn:li:organization:/i`, and SHALL allow only values matching `/^urn:li:person:[A-Za-z0-9_-]+$/`. The rejection hint SHALL direct the agent to call `linkedin_get_my_info` first and use the returned `id` field to construct a `urn:li:person:<id>` author URN. The rejection message SHALL explain that organization-author posting requires LinkedIn's Community Management API partner approval (scope `w_organization_social`) which the default Composio managed OAuth client does not grant.

#### Scenario: Reject `urn:li:person:self`
- **WHEN** an agent calls `LINKEDIN_CREATE_LINKED_IN_POST` with `author: "urn:li:person:self"`
- **THEN** the executor SHALL respond with `error.code === "invalid_field_value"` and SHALL NOT issue an HTTP POST to LinkedIn

#### Scenario: Reject organization URN
- **WHEN** an agent calls `LINKEDIN_CREATE_LINKED_IN_POST` with `author: "urn:li:organization:107798709"`
- **THEN** the executor SHALL reject the call with `error.code === "invalid_field_value"` and a hint that mentions the missing Community Management partner scope

#### Scenario: Accept a real person URN
- **WHEN** an agent calls `LINKEDIN_CREATE_LINKED_IN_POST` with `author: "urn:li:person:noZndceJjn"` and the rest of the schema is satisfied
- **THEN** the executor SHALL forward the call to LinkedIn

### Requirement: LinkedIn typeahead ad-targeting facet validator

The `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES.facet` field SHALL be configured with a validator that denies `urn:li:adTargetingFacet:companies` and `urn:li:adTargetingFacet:company`, and accepts any value matching `/^urn:li:adTargetingFacet:[A-Za-z][A-Za-z0-9]*$/`. The rejection hint SHALL recommend `urn:li:adTargetingFacet:employers` when the agent's intent appears to be searching for companies as ad-targeting entities.

#### Scenario: Reject the `companies` facet against typeahead finder
- **WHEN** an agent calls `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES` with `facet: "urn:li:adTargetingFacet:companies"`
- **THEN** the executor SHALL respond with `error.code === "invalid_field_value"` and `hint` mentioning `urn:li:adTargetingFacet:employers`

#### Scenario: Accept `employers` and other supported typeahead facets
- **WHEN** an agent calls `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES` with `facet: "urn:li:adTargetingFacet:employers"` (or `locations`, `industries`, `titles`, etc.)
- **THEN** the executor SHALL forward the call to LinkedIn

### Requirement: Gmail `user_id` validator allows only `"me"`

Every Gmail tool that accepts a `user_id` argument SHALL be configured with a validator that allows only the literal string `"me"`. The rejection message SHALL explain that Gmail requires Google Workspace domain-wide delegation to read other mailboxes, which the default Composio-backed connection does not have, and that Gmail will return `403 "Delegation denied"` for any other value (including the connected account's own email address).

#### Scenario: Accept `"me"`
- **WHEN** an agent calls `GMAIL_FETCH_EMAILS` with `user_id: "me"`
- **THEN** the executor SHALL forward the call to Gmail

#### Scenario: Reject an arbitrary email address
- **WHEN** an agent calls `GMAIL_FETCH_EMAILS` with `user_id: "kamarendra087@gmail.com"`
- **THEN** the executor SHALL reject the call with `error.code === "invalid_field_value"` and a hint instructing the agent to retry with `user_id: "me"`

#### Scenario: Reject `"self"`
- **WHEN** an agent calls any Gmail tool with `user_id: "self"`
- **THEN** the executor SHALL reject the call with `error.code === "invalid_field_value"`

### Requirement: Discriminated-union override documentation uses real field shapes

When a Composio tool's `inputSchema` declares a field whose type is `anyOf: [...]` with multiple object variants, the tool's override entry in `config/composio-tool-overrides.mjs` SHALL document each variant using the variant's actual property names from the Composio schema. The override SHALL NOT introduce synthesized envelope keys derived from the JSON-Schema `title` annotation of each `anyOf` branch (e.g. `DesignTypeCustom`, `PngFormat`); those titles are documentation metadata, not data field names. The override's `examples[]` SHALL include at least one entry per concrete variant the agent is expected to use, and each example SHALL match the shape Composio's published `examples` field for that schema. The override SHALL also state explicitly that exactly ONE variant must be sent per call (sending two variants causes Pydantic to run every variant's required-field check and surface a confusing aggregated error).

#### Scenario: Override example matches Composio's published example shape
- **WHEN** a developer writes an override for a tool whose schema field is `anyOf: [{title: "DesignTypePreset", required: ["type", "name"], ...}, {title: "DesignTypeCustom", required: ["type", "width", "height"], ...}]`
- **THEN** the override `examples[]` SHALL use shapes like `{design_type: {type: "preset", name: "presentation"}}` and `{design_type: {type: "custom", width: 1080, height: 1920}}` — flat objects matching the variant's `properties` directly — and SHALL NOT wrap them in `DesignTypePreset`/`DesignTypeCustom` envelope keys

#### Scenario: Override description warns against sending multiple variants
- **WHEN** a developer writes a `descriptionPrefix` for a discriminated-union field
- **THEN** the prefix SHALL explicitly state that exactly one variant object must be sent per call, naming the failure mode if both are sent (aggregated Pydantic missing-field errors)

#### Scenario: Invented field names are forbidden
- **WHEN** writing `fieldDescriptions.<field>` for a discriminated-union field
- **THEN** the description SHALL reference only field names that appear in the Composio schema's `properties` for some variant; it SHALL NOT mention invented helper fields (e.g. `units` on a Canva custom dimension variant whose Composio schema declares only `type`, `width`, `height`)

