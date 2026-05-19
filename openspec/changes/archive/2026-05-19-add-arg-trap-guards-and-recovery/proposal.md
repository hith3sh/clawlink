## Why

D1 production logs (2026-04-26 → 2026-05-19) show 1,439 tool-execution errors out of 8,455 calls (~17%) clustering in three patterns that the existing self-correction loop cannot resolve:

1. **Provider 4xx errors caused by LLM arg traps that look like legitimate strings** — `urn:li:person:self`, `urn:li:organization:<id>` posted under a personal-only OAuth scope, Gmail `user_id: <email>` against a connection that lacks Workspace domain-wide delegation, `urn:li:adTargetingFacet:companies` against the typeahead finder. `prepareToolArguments` only catches JSON-schema violations; structurally-valid placeholders sail through and upstream 4xx text is misleading enough that agents retry blind.
2. **`schema_unavailable` failures on parameterless tools** — `LINKEDIN_GET_MY_INFO` (51 fails over 8 days), `GOOGLECALENDAR_COLORS_GET`, `FIGMA_GET_CURRENT_USER`, `INTERCOM_IDENTIFY_AN_ADMIN`, `HEYGEN_GET_CURRENT_USER_INFORMATION`. Composio returns `input_parameters: {properties: {}}` for these — identical to the static stub — and the executor's `isStubSchema` guard refuses them post-hydration. Critically, `linkedin_get_my_info` is the exact recovery tool the arg-trap mitigations need agents to call first.
3. **Hallucinated tool names with no recovery signal** — 672 calls to `googlecalendar_calendar_list_list` (a slug composed from the toolkit's dominant `<RESOURCE>_<VERB>` pattern; the real tool is `googlecalendar_list_calendars`). The executor returned `message: "Tool not found"` with suggestions buried in `details`; the LLM ignored them and retried with the same wrong name.

All three classes are deterministic — a single targeted fix per class converts each into a clean self-correction round-trip.

## What Changes

- Add a per-tool boundary-guard layer that rejects known-bad argument values *before* they reach the upstream provider, producing `type: "validation"` errors with actionable hints.
- Track schema hydration explicitly on each `IntegrationTool` so parameterless tools whose hydrated schema looks identical to the static stub stop being rejected as `schema_unavailable`.
- Improve `tool_not_found` recovery so the LLM gets the top suggestions in the error message itself, with a fuzzy ranker that handles separator variants and verb/resource inversion.

## Capabilities

### New Capabilities

- `arg-validation`: Generic placeholder detection plus per-tool `fieldValidators` rules (declared as data on each entry in `config/composio-tool-overrides.mjs`) that reject obviously-bad argument values at the boundary with a `type: "validation"` error and a self-correction hint.
- `composio-schema-cache`: Lazy schema hydration from Composio's `/tools` API with KV + in-memory caching, plus an explicit `schemaHydrated` flag that distinguishes hydrated-but-empty schemas from un-hydrated stubs so parameterless tools execute correctly.
- `tool-not-found-self-correction`: Token-aware fuzzy ranking of available tool names with separator-aware tokenization and a tool-token coverage penalty; the executor's `tool_not_found` response embeds the top 3 suggestions in the error `message` plus a `hint` with the explicit retry list.

### Modified Capabilities

_None — these are new capabilities; no existing spec requirements are being modified._

## Impact

- New code: `src/lib/server/arg-guards.ts` (`detectPlaceholderArgs`, `validateFieldArgs`, `FieldValidatorRule` shape).
- Modified code:
  - `src/lib/composio/manifest-registry.ts` (set `tool.schemaHydrated = true` after successful apply; both loops gate on the flag instead of `isStubSchema`).
  - `src/lib/server/executor.ts` (refusal guard now checks `!schemaHydrated && isStubSchema`; `validateFieldArgs` invoked after the placeholder check; `tool_not_found` message embeds suggestions + hint).
  - `src/lib/server/tool-registry.ts` (`scoreTool` tokenizes on `[\s_-]+`, scores exact-token alignment, penalizes uncovered tool-name tokens).
  - `worker/integrations/base.ts` (`IntegrationTool.schemaHydrated?: boolean`).
- Config: `config/composio-tool-overrides.mjs` gains a `fieldValidators` property per tool. Rules registered at landing: `LINKEDIN_CREATE_LINKED_IN_POST.author`, `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE.author` (deny placeholder + org URNs), `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES.facet` (deny `companies`), all 61 Gmail `user_id` (allow only `"me"`). Plus description-only overrides for `CANVA_POST_DESIGNS` and `CANVA_POST_EXPORTS` (discriminated-union shape that `fieldValidators` can't usefully express).
- No D1 migrations. No new env vars. No new dependencies.
- Deploy: takes effect on the next `npm run deploy:web`. No coordinated runtime/dashboard cut-over needed — same Worker.
