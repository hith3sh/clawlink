# composio-schema-cache Specification

## Purpose
TBD - created by archiving change add-arg-trap-guards-and-recovery. Update Purpose after archive.
## Requirements
### Requirement: Composio tool input schemas are hydrated lazily at runtime

Composio-backed tool manifests SHALL ship with `inputSchema: { type: "object", properties: {} }` (empty stub) in the static bundle and SHALL be hydrated at runtime from Composio's `GET /tools?toolkit_slug=<slug>&toolkit_versions=<version>` API before the tool is exposed to the LLM or executed. Schema resolution SHALL follow this order: in-memory per-process cache → Cloudflare KV cache (key `composio-schema:v2:<slug>:<version>`, 24-hour TTL) → Composio API fetch. After a successful API fetch, the result SHALL be written to both the in-memory cache and the KV cache. The system SHALL deduplicate concurrent refresh attempts via an in-flight Promise map so that two simultaneous requests for the same toolkit issue only one API call.

#### Scenario: First request after cold start fetches from Composio
- **WHEN** the worker process has no in-memory or KV cache entry for a toolkit and an agent calls a tool from that toolkit
- **THEN** the system SHALL fetch the toolkit's schemas from Composio's `/tools` API, write the result to KV with `expirationTtl: 86400`, populate the in-memory cache, and apply the matching schema to the routed tool

#### Scenario: KV cache hit avoids the API call
- **WHEN** the worker process has no in-memory cache entry for a toolkit but the KV namespace holds a valid entry for the integration slug + toolkit version
- **THEN** the system SHALL read from KV, populate the in-memory cache, and SHALL NOT call Composio's API for that lookup

#### Scenario: Concurrent refreshes share one in-flight fetch
- **WHEN** two requests in the same worker instance trigger schema hydration for the same integration slug before either completes
- **THEN** the system SHALL issue at most one Composio `/tools` API call and both requests SHALL receive the result

### Requirement: `schemaHydrated` flag distinguishes hydrated-empty schemas from un-hydrated stubs

The `IntegrationTool` type SHALL include an optional `schemaHydrated: boolean` property that the schema-hydration code path sets to `true` after a successful schema apply. Both hydration loops in `hydrateComposioToolSchemas` SHALL gate on this flag (skipping tools where `schemaHydrated === true`) rather than on `isStubSchema(tool.inputSchema)`. The flag SHALL be set to `true` even when the hydrated schema has no `properties` (i.e. for parameterless Composio tools whose `input_parameters` is `{type: "object", properties: {}}`), so that subsequent hydration passes do not re-fetch and the executor's stub guard does not refuse the call.

#### Scenario: Hydrated parameterless tool is marked hydrated
- **WHEN** `hydrateComposioToolSchemas` runs against `LINKEDIN_GET_MY_INFO` (whose Composio `input_parameters` is `{type: "object", properties: {}}`)
- **THEN** the function SHALL set `tool.schemaHydrated = true` on the mutated tool object

#### Scenario: Failed-to-fetch tool stays un-hydrated
- **WHEN** Composio's `/tools` response does not contain a tool with the slug `tool.execution.toolSlug` (e.g. the stale `GOOGLE_SEARCH_CONSOLE_LIST_SITES` entry)
- **THEN** the function SHALL leave `tool.schemaHydrated` undefined/false and SHALL NOT mutate `tool.inputSchema`

#### Scenario: Second hydration pass on an already-hydrated tool is a no-op
- **WHEN** `hydrateComposioToolSchemas` is invoked with a tool whose `schemaHydrated === true`
- **THEN** the function SHALL NOT include that integration in the next schema-fetch set on behalf of this tool, and SHALL NOT mutate `tool.inputSchema`

### Requirement: Executor refuses Composio tools only when un-hydrated AND stub-shaped

The executor's pre-flight schema guard SHALL emit `error.code === "schema_unavailable"` and refuse to forward the request to Composio if and only if BOTH of the following are true: (1) `tool.schemaHydrated` is falsy AND (2) `isStubSchema(tool.inputSchema)` returns true. A tool that has been hydrated SHALL be allowed to execute even when its schema's `properties` is empty, because Composio returns empty `properties` for genuinely parameterless tools. The refusal error SHALL be marked `retryable: true` so the OpenClaw runtime can retry after the cache populates.

#### Scenario: Refuse never-hydrated tool
- **WHEN** a Composio-backed tool reaches the executor with `schemaHydrated` undefined and `inputSchema` shaped as the static stub
- **THEN** the executor SHALL respond with `error.code === "schema_unavailable"` and `retryable: true`, and SHALL NOT forward the request to Composio

#### Scenario: Execute parameterless tool after hydration
- **WHEN** an agent calls `LINKEDIN_GET_MY_INFO` and `schemaHydrated === true` on the routed tool (even though its hydrated `inputSchema` has empty `properties`)
- **THEN** the executor SHALL forward the request to Composio without emitting `schema_unavailable`

#### Scenario: Execute fully-described tool after hydration
- **WHEN** an agent calls `LINKEDIN_CREATE_LINKED_IN_POST` and `schemaHydrated === true` on the routed tool with a populated `inputSchema.properties`
- **THEN** the executor SHALL forward the request to Composio

### Requirement: Background refresh keeps the cache warm

If an in-memory or KV cache entry's `fetchedAt` timestamp is older than the stale threshold (6 hours) but younger than the TTL (24 hours), the system SHALL serve the cached schemas immediately AND trigger a best-effort background refresh against Composio's API. A failed background refresh SHALL NOT propagate as an error to the live request — the stale cache remains valid until TTL expiry.

#### Scenario: Stale-but-valid entry serves immediately and refreshes in background
- **WHEN** a cache entry has `fetchedAt` 7 hours ago and a request triggers schema resolution
- **THEN** the system SHALL return the cached schemas synchronously AND SHALL invoke a background refresh against Composio's API

#### Scenario: Background refresh failure does not break the request
- **WHEN** a background refresh fails (network error, Composio outage)
- **THEN** the cached schemas SHALL continue to be served until the TTL elapses, and the live request that triggered the background refresh SHALL NOT receive an error

