## Context

ClawLink runs as a single Cloudflare Worker (`clawlink-web`) that exposes ~100 Composio-backed tools to OpenClaw plugin users. Tool execution flows through `src/lib/server/executor.ts`. Composio tool manifests ship with empty `inputSchema` stubs that are hydrated at runtime from Composio's `/tools` API and cached in KV (`composio-schema:v2:<slug>:<version>`, 24h TTL). Static manifests + a per-tool override file (`config/composio-tool-overrides.mjs`) provide descriptions, examples, prerequisites, and field-level guidance to the LLM at catalog-build time.

Pre-existing self-correction layers:

- `prepareToolArguments` validates args against the (now-hydrated) JSON schema. Catches missing required fields and type mismatches.
- `classifyIntegrationError` maps upstream errors to `type: "auth" | "validation" | "provider" | "unknown"` so the OpenClaw runtime can route retries.
- Schema-cache stub guard in `executor.ts`: refused execution with `code: "schema_unavailable"` when `isStubSchema(tool.inputSchema)` returned true after hydration, on the theory that the schema fetch had failed.

Constraints carried into this change:

- The OpenClaw plugin is the consumer; the LLM driving it must be able to self-correct from a single round-trip error response. Long error messages are fine, but the actionable information must be in `error.message` and/or `hint` — not buried in `details` which most agents skip.
- All overrides for Composio-backed tools must remain declarative data in `config/composio-tool-overrides.mjs` so they ship with the static bundle and don't require D1/KV writes.
- No new runtime dependencies; this is configuration + light boundary logic only.

## Goals / Non-Goals

**Goals:**

- Turn three classes of D1-observed failure into deterministic self-correction round-trips:
  1. LLM substitutes a placeholder string (`urn:li:person:self`, Gmail `<email>`, etc.) for a structured id; provider responds with a 4xx that's indistinguishable from a real scope/auth error.
  2. Parameterless Composio tools (`LINKEDIN_GET_MY_INFO`, etc.) get rejected as `schema_unavailable` because their hydrated schema is identical to the static stub.
  3. Hallucinated tool slugs (`googlecalendar_calendar_list_list`) trigger `tool_not_found` with no usable recovery signal.
- Keep all configuration declarative and colocated with the existing description overrides — no new file proliferation.
- Cost of adding a new trap rule should be one entry in `config/composio-tool-overrides.mjs`, not new TypeScript files.

**Non-Goals:**

- Catching tool-shape errors that aren't placeholder-style (e.g. Canva's `oneOf`-discriminated `format` field needing both `type` and a `JpgFormat` envelope). Those still need `descriptionPrefix` + `fieldDescriptions` + `examples` because no `allow/deny` rule can cleanly express "match exactly one of N variant envelopes." This change deliberately writes overrides for those tools but leaves the validator system out of it.
- Auto-routing on a strong fuzzy match. Auto-routing creates risk that we silently execute a write tool when the LLM meant a different read tool. We surface suggestions and let the agent confirm via retry.
- General-purpose semantic search over the tool catalog. The fuzzy ranker is a tactical recovery improvement; product-level tool discovery flows through `clawlink_search_tools`.
- Production log mining infrastructure. We hand-mined D1 for this round; automation is a follow-up.

## Decisions

### 1. Per-tool validators as declarative data, not functions

The `fieldValidators` property on each tool override is a `Record<string, FieldValidatorRule>` where `FieldValidatorRule` is `{ allow?, allowPatterns?, deny?, denyPatterns?, message, hint? }`. A value is rejected if it matches any `deny`/`denyPattern`, or if an allowlist exists and the value matches none of its entries.

Alternative considered: validator functions `(value: unknown, args: Record<string, unknown>) => { ok: true } | { ok: false; message, hint }`. Rejected because:
- The override file already loads in the bundle; mixing functions with data complicates JSON-serialization scenarios (audits, doc generators).
- Data rules cover every empirical case we have (Linkedin URN deny + allow, Gmail user_id allow-only-me, LinkedIn facet deny).
- Function-based rules would tempt over-engineering: e.g. cross-field dependencies that should really live in the schema, not the boundary guard.

### 2. `schemaHydrated` boolean flag on `IntegrationTool` instead of schema-shape inspection

Composio returns `{type: "object", properties: {}}` for any parameterless tool (e.g. `LINKEDIN_GET_MY_INFO`). The static stub is `{type: "object", properties: {}}`. The two are structurally identical, so `isStubSchema(tool.inputSchema)` cannot distinguish them.

Decision: add `schemaHydrated?: boolean` to the `IntegrationTool` type (defaults to `undefined`/false). `hydrateComposioToolSchemas` sets it to `true` after a successful schema apply. Both loops in that function gate on `tool.schemaHydrated` instead of `isStubSchema`. The executor refusal guard fires only when `!schemaHydrated && isStubSchema`.

Alternatives considered:
- Sentinel property on the stub schema itself (`{__stub: true}`). Rejected — leaks an implementation marker into a JSON Schema that other consumers (validators, dashboards, docs) might serialize verbatim.
- Removing the stub guard entirely. Rejected — `prepareToolArguments` against an empty schema doesn't catch missing required args, so a schema-fetch outage during a KV miss + Composio API blip could send unvalidated args to a `*_CREATE_*` tool. The guard still earns its place; we just need to gate it correctly.

### 3. Token-aware fuzzy ranker with separator-aware tokenization and uncovered-token penalty

`scoreTool` previously tokenized only on whitespace. A hallucinated slug like `googlecalendar_calendar_list_list` was one token — and one token is a substring of nothing real, so the suggestions list came back empty.

Decision:
- Split both the query and each candidate's `tool.name` on `[\s_-]+`.
- Score exact-token-match high (+12), substring-only match lower (+8). Substring backoff catches plurals (`calendar` inside `calendars`).
- Subtract a small penalty (-3) per tool-name token that has no presence in the query at all — concise matches beat verbose ones. This is what lets `googlecalendar_list_calendars` outrank `googlecalendar_calendar_list_insert` for a `..._calendar_list_list` query: both have equal positive matches, but `_insert` is an uncovered token.
- Preserve plural/singular backoff in the penalty step (`toolToken.includes(q) || q.includes(toolToken)`) so we don't double-penalize legit plural forms.

Alternative considered: full edit-distance / Levenshtein. Rejected — overkill for slug-style names where the agent's error is almost always token reordering, not character drift.

### 4. `tool_not_found` response embeds suggestions in `message` + `hint`, not just `details`

Earlier code returned `error: { code: "tool_not_found", message: "Tool not found" }` with `details: <suggestions>`. The OpenClaw runtime treats `details` as supporting data, and many LLMs don't read it when self-correcting. Decision: the error `message` now reads `"Tool '<requested>' not found. Did you mean: '<sug1>', '<sug2>', '<sug3>'?"` and the payload also carries a `hint` field with the explicit retry list. `details` is preserved for downstream tooling.

## Risks / Trade-offs

- **[Risk] Over-restrictive validators reject legitimate values.** → Mitigation: each rule needs explicit `allow`/`allowPatterns` matching the real positive cases verified by `POST /tools/execute/<slug>` direct calls before landing. The LinkedIn `author` rule allows the full real-URN charset; the Gmail `user_id` rule allows `"me"` only because empirical testing showed any other value (including the connected account's own email) hits the same `Delegation denied` upstream error.
- **[Risk] Token-coverage penalty mis-ranks long real tool names against short queries.** → Mitigation: penalty is small (-3, vs +12 per exact token match), so a tool with several real token matches still beats a tool with no positive matches. Functional tests in the proposal-supporting work cover the worked D1 hallucinations and confirm the right tool ranks first.
- **[Risk] Surfacing suggestions in the error message increases payload size and could prompt the LLM to try every suggestion in sequence.** → Mitigation: top-3 cap is hard-coded; the hint phrasing is explicit ("Retry with one of: …") so the LLM picks one, not all.
- **[Trade-off] `schemaHydrated` flag is mutated in-place on tool objects.** Acceptable because the manifest registry already mutates `tool.inputSchema` in-place via the same path; the flag follows the same lifecycle. Worker instance lifetime caching is unchanged.

## Migration Plan

- Single deploy via `npm run deploy:web`. Same Worker; no D1 migration; no env changes.
- Hot path is the executor + arg-guards module; tool catalog hydration changes are backward-compatible (the new flag is optional on `IntegrationTool`).
- Rollback: revert the diff and redeploy. No data side-effects to clean up — D1's `tool_executions` table records the new error codes (`invalid_field_value`) but reads only ever consume them, never branch on them.

## Open Questions

- Should the placeholder detector (`detectPlaceholderArgs`) become catalog-wide aware so that obvious cross-integration placeholders (`<api_key>`, `YOUR_TOKEN`) get caught even when no per-tool rule is registered? It already does, but the keyword list is intentionally conservative (excludes `me`/`self`/`null`/`TODO` because those are legitimate values in some fields). A targeted expansion driven by log mining is the next iteration.
- Should `schemaHydrated` propagate to the dashboard catalog payload so the UI can show "loading…" badges? Out of scope for this change but worth considering once we add multi-environment hydration paths.
