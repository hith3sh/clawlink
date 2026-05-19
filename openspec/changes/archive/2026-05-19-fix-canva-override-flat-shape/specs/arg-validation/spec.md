## ADDED Requirements

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
