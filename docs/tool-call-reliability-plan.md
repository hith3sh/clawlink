# Tool Call Reliability Plan

A staged plan to drive the Composio-backed tool call failure rate from "common and confusing" to "rare and self-recoverable." Each tier is independently shippable; sequence matches expected impact-per-effort.

## Background

The OpenClaw plugin exposes ClawLink tools via MCP. When the LLM invokes a Composio-backed tool, we currently see two failure shapes:

1. **Empty schema served to the LLM.** Tools shipped with `inputSchema: { type: "object", properties: {} }` because the runtime hydration layer was failing silently in production. The LLM had to guess field names from training data — sometimes correct (e.g. `googledrive_create_file`), sometimes not (`googledrive_create_file_from_text` missing `text_content` / `file_name`; `instagram_get_ig_user_media` missing `ig_user_id`).
2. **LLM judgment errors that better schemas can't fully prevent.** Wrong field types, skipped discovery steps, conditional rules buried in prose, transient Composio errors.

The hydration fix lands tier 0. The remaining tiers compound on top of it.

## Tier 0 — Hydration fix (shipped 2026-05-08)

Two bugs were fixed in tandem. Either alone would have left hydration broken.

### Bug 1 — env not propagated to the schema fetcher

**Files:**
- `src/lib/server/integration-store.ts` — added `getRuntimeEnv()` that merges `getCloudflareContext().env` with `process.env`.
- `src/lib/server/tool-registry.ts` — `hydrateToolSchemas` now passes `getRuntimeEnv()` instead of `undefined`.

**Why it broke:** `COMPOSIO_API_KEY` is a Cloudflare secret, not a `[vars]` entry, so it lives only on `getCloudflareContext().env` — not on `process.env`. The web runtime's `hydrateToolSchemas` was passing `undefined` for env, causing `fetchComposioToolSchemas` to throw `"COMPOSIO_API_KEY is not configured"`. The `try/catch` in `hydrateComposioToolSchemas` swallowed the error, tools silently kept the stub schema.

### Bug 2 — URL double-prefix in the tools-list call

**File:** `src/lib/composio/backend-client.ts` — `fetchComposioToolSchemas` rewritten to use `URLSearchParams` and a relative `/tools?...` path.

**Why it broke:** The old code did `new URL(`${baseUrl}/tools`)` then passed `url.pathname + url.search` to `composioFetch`, which prepends `baseUrl` itself. The result: `https://backend.composio.dev/api/v3.1/api/v3.1/tools?...` → 404. This was latent — only surfaced once Bug 1 was fixed and the call actually reached Composio. Worker tail showed `"Failed to fetch Composio schemas for google-drive: 404 Not Found"` after the first deploy of Bug 1's fix, which is how this was caught.

### Combined effect

`fetchComposioToolSchemas` now successfully calls `GET /tools?toolkit_slug=<slug>&toolkit_versions=<v>&...`. Schemas populate KV (`composio-schema:<slug>`, 24h TTL) on first request per integration. All ~50 Composio integrations benefit at once — no per-tool work needed.

### Free side-effects worth noting

- `src/lib/server/executor.ts:282` runs `prepareToolArguments` against the hydrated `decision.tool.inputSchema` after `await tool;` (which triggers hydration via `describeRoutedTool`). Missing required fields are now caught **locally**, returning `missingFields` + `inputSchema` + `hint` in the response — the LLM sees what it got wrong without a Composio round-trip.
- Validation errors from Composio also include the real schema in the error payload, so the LLM has the recipe card *with* the rejection.

### Verification (post-deploy, 2026-05-08)

- `GET /api/tools/googledrive_create_file_from_text` → `required: ['file_name', 'text_content']`, `properties: ['file_name', 'mime_type', 'parent_id', 'text_content']` ✅
- `GET /api/tools/instagram_get_ig_user_media` → `required: ['ig_user_id']`, with field description: *"Instagram Business or Creator Account ID. Use 'me' for the authenticated user, or provide the numeric…"* ✅
- Bulk hydration counts: google-drive 76/76, instagram 29/29, gmail 61/61, facebook 39/39, google-docs 33/33, linkedin 20/22 (the 2 unhydrated are no-arg tools — `linkedin_get_my_info`, `linkedin_get_ad_targeting_facets` — empty schema is correct).
- KV cache populated: `composio-schema:gmail`, `composio-schema:instagram`, etc. New entries appear as new integrations are hit.

### Diagnostic playbook for future regressions

If hydration breaks again, this is the loop that found it:

1. `curl -sS -H "X-ClawLink-API-Key: $KEY" https://claw-link.dev/api/tools/<tool> | jq '.tool.inputSchema'` — empty `properties` means hydration didn't run or failed.
2. `npx wrangler kv key list --binding=CREDENTIALS --remote --prefix="composio-schema:"` — should list one entry per integration that's been hit. Empty means hydration has never succeeded in production.
3. `npx wrangler tail clawlink-web --format=json` while making the same curl — look for `"Failed to fetch Composio schemas for <slug>:"` logs. The trailing message tells you whether it's an auth issue ("not configured"), a URL issue (404), or a Composio outage (5xx).

---

## Tier 1 — Cache hygiene

Small, high-leverage changes to the schema cache.

### 1.1 Version-keyed cache (~5 lines)

**File:** `src/lib/composio/schema-cache.ts:26`

Change cache key from `composio-schema:<slug>` to `composio-schema:<slug>:<version>`, reading `version` from `COMPOSIO_TOOLKIT_VERSION_MAP` in `wrangler.toml`. When you bump a toolkit version, stale entries fall off automatically — no manual flush.

### 1.2 Stale-while-revalidate

**File:** `src/lib/composio/schema-cache.ts`

When a cache entry is older than e.g. 6h but younger than 24h, serve it immediately and fire an async refresh in the background (via `ctx.waitUntil` or a fire-and-forget promise). Hides the cache-miss latency.

### 1.3 Lower miss-prone TTL

If 24h feels too long, drop to 6h. Trade extra KV reads for freshness. Trivial change.

---

## Tier 2 — Composio overrides layer

The biggest qualitative jump. Mirrors the existing `config/pipedream-action-overrides.mjs` pattern for Composio.

### 2.1 Build the overrides infrastructure

**New file:** `config/composio-tool-overrides.mjs`
**Wire into:** `src/lib/composio/backend-client.ts:577` (`convertInputSchema`) — apply overrides after schema conversion, before caching.

Override schema (per-tool):
```js
{
  "GOOGLEDRIVE_CREATE_FILE_FROM_TEXT": {
    descriptionPrefix: "REQUIRED: text_content (the file body) and file_name.",
    fieldDescriptions: {
      mime_type: "Optional. Defaults to text/plain. Use 'application/vnd.google-apps.document' to auto-convert to Google Docs.",
    },
    prerequisites: [],
    examples: [
      { args: { text_content: "Hello world", file_name: "greeting.txt" }, label: "Plain text file" }
    ],
  },
  "INSTAGRAM_GET_IG_USER_MEDIA": {
    fieldDescriptions: {
      ig_user_id: "Numeric IG Business Account ID (e.g. 17841401234567890), NOT a username. Get this from instagram_list_ig_user_accounts first.",
    },
    prerequisites: ["instagram_list_ig_user_accounts"],
  },
}
```

### 2.2 Extend `IntegrationTool` type

**File:** `worker/integrations/base.ts`

Add `prerequisites?: string[]` to the type. Plugin's `clawlink_describe_tool` already serializes the full tool object, so this surfaces to the LLM for free.

### 2.3 Populate overrides for top tools

Pull the top N most-called tools from `tool_execution_log`:

```sql
SELECT tool_name, COUNT(*) as calls, SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errors
FROM tool_execution_log
WHERE integration IN (SELECT slug FROM ... where backend = 'composio')
GROUP BY tool_name
ORDER BY errors DESC, calls DESC
LIMIT 20;
```

Hand-curate descriptions for those 20. Long-tail tools fall back to Composio's own description plus auto-discovery (Tier 3).

### 2.4 Surface guidance fields to the LLM

The existing `whenToUse`, `askBefore`, `examples`, `safeDefaults` fields on `IntegrationTool` are already populated by some Composio manifests but underused. Audit `src/generated/composio-manifests/*.generated.ts` for tools where these are empty and either:
- Populate from overrides (preferred — versioned with code), or
- Generate at hydration time from heuristics.

---

## Tier 3 — Auto-derived intelligence

Cheap heuristics that improve long-tail tools without manual curation.

### 3.1 Discovery-tool linking

**File:** `src/lib/composio/manifest-registry.ts` (in `hydrateComposioToolSchemas`)

For each required field matching `*_id`, `*_uuid`, `*_slug`, scan the same toolkit's manifest for tools matching `*_list_*`, `*_search_*`, `*_get_*`, `*_find_*`. If a match exists, append to the field description: *"Try `<discovery_tool>` first to obtain this value."*

Effective for the entire ID-shaped field surface. Implementation is pure string manipulation on the hydrated schema.

### 3.2 Conditional-field flattener

**File:** `src/lib/composio/backend-client.ts:577` (`convertInputSchema`)

When Composio's schema uses `oneOf` / `anyOf` / `dependentRequired`, detect at hydration time and append a plain-prose "**Notes:**" block to the tool description: e.g. *"If `post_type` is `video`, also pass `video_url`."* Small LLMs read prose more reliably than nested JSON Schema logic.

### 3.3 Format hints from examples

When Composio returns an example value in `input_parameters`, copy it onto the field schema's `examples` array. JSON Schema validators ignore it; LLMs latch onto it.

---

## Tier 4 — Operational hardening

### 4.1 Better Composio error categorization

**File:** `src/lib/composio/backend-client.ts:187` (`parseComposioValidationError`)

Extend beyond `validation`. Categorize:
- `rate_limit` (429, "rateLimitExceeded")
- `scope_missing` ("insufficient permissions", "scope")
- `account_inactive` ("connected account not active", "reauth required")
- `not_found` (404 from upstream)
- `transient` (5xx, network)

Map each to the appropriate `IntegrationRequestError` `kind`. The plugin already shows distinct UX for `reauth_required` / `missing_scopes` / `validation` — this just routes more errors into those buckets.

### 4.2 Pre-flight scope check for Composio tools

**File:** `src/lib/server/router.ts:90` (`findMissingScopes`)

Already implemented for Pipedream/Nango. Make sure the override layer (Tier 2) populates `tool.requiresScopes` for Composio tools. Then pre-flight catches scope mismatches before the Composio call.

### 4.3 Auto-retry on transient errors

**File:** `src/lib/server/executor.ts:442`

Auth-failure retry with credential refresh already exists. Add a separate retry branch for `kind === "transient"` and 429 (with exponential backoff, max 2 retries). The plugin's existing error path will surface a clean message if retries exhaust.

---

## Tier 5 — Steal the Composio CLI philosophy

The substance, not the form factor. All inside the existing MCP plugin.

### 5.1 Action-biased plugin copy

**File:** `packages/openclaw-clawlink/index.js` (tool descriptions for `clawlink_call_tool`, `clawlink_search_tools`, etc.)

Rewrite descriptions in this voice:
- *"Bias toward action. Don't ask the user what fields to use — call with your best guess."*
- *"If ClawLink rejects the arguments, the error includes `missingFields` and the full `inputSchema`. Just retry with corrections."*
- *"Don't preemptively ask the user to connect accounts. Try the call. If auth is missing, the error tells you exactly which integration to connect."*

The current copy is closer to MCP-formal ("Execute an action on a connected external app"). Composio's voice is more imperative ("Run a tool. Use aggressively."). Adopt the latter.

### 5.2 `clawlink_run_script` — multi-step composition

The genuinely powerful idea worth copying from Composio's `composio run`.

**New tool:** `clawlink_run_script` in the plugin.

Accepts a JS/TS snippet. Server runs it in a sandboxed worker context with these helpers injected:
- `execute(toolName, args, opts?)` — direct tool call
- `search(query, opts?)` — tool search
- `describe(toolName)` — schema fetch
- `preview(toolName, args)` — dry run

Lets the LLM do this in **one round trip**:

```js
const accts = await search("list instagram accounts");
const id = (await execute(accts[0].name)).accounts[0].id;
return await execute("instagram_get_ig_user_media", { ig_user_id: id });
```

Instead of three separate model turns. This is a big latency and reliability win for anything requiring discovery → action chaining.

**Server implementation note:** can be implemented as a Next API route that loops over the same `executeToolForUser` / `searchToolsForUser` functions. No new infrastructure. Sandboxing concern: limit to ClawLink tool calls only — no arbitrary `fetch`, no filesystem, no `process`. Use a strict QuickJS / V8 isolate or just regex-validate the snippet to only call our injected helpers.

### 5.3 More aggressive `clawlink_preview_tool` framing

In the plugin description, surface preview as *"if you're unsure of arguments for a write tool, call preview first — it returns the same validation as a real call without side effects."* Already exists, just under-marketed.

---

## Sequencing recommendation

| When | What | Effort | Expected impact |
|------|------|--------|-----------------|
| Now (post-deploy) | Verify Tier 0 fix in production | 5 min | Unblocks 80% of broken cases |
| Week 1 | Tier 1.1 (version-keyed cache) | Half day | Eliminates stale-schema complaints |
| Week 1 | Tier 2.1–2.2 (overrides infra) | 1 day | Foundation for Tier 2.3 |
| Week 2 | Tier 2.3 (top-20 overrides) | 1–2 days | Halves residual error rate |
| Week 2 | Tier 3.1 (auto-discovery) | Half day | Long-tail coverage |
| Week 3 | Tier 5.1 (copy rewrite) | 2 hours | Free LLM behavior improvement |
| Week 3 | Tier 4.1 (error categorization) | 1 day | Cleaner UX for ops failures |
| Week 4+ | Tier 5.2 (`run_script`) | 3–4 days | Big multi-step win, optional |
| Later | Tier 1.2, 1.3, 3.2, 3.3, 4.2, 4.3 | Various | Polish |

---

## Success metrics

Pull from `tool_execution_log` weekly:

- **Composio validation error rate** (`status = 'error'` AND `error.code = 'invalid_arguments'`) → should drop ≥80% after Tier 0, another ≥50% after Tier 2.3.
- **Time-to-first-success** per integration: from first `clawlink_call_tool` to first `status = 'success'`. Should approach 1 round trip after Tier 5.1.
- **Multi-turn flow length** for known multi-step tasks (e.g. "post to Instagram"): drops from N model turns to 1 with `run_script`.
- **% of tool calls that include all required fields on first attempt.** Direct measure of schema-quality impact.

---

## What we're explicitly not building

- **A standalone CLI.** Composio's CLI is for distribution to non-MCP agents (Claude Code, Cursor, custom). ClawLink's distribution is OpenClaw. A CLI would be a tangent. Revisit if/when there's demand from a non-OpenClaw market.
- **Per-tool hand-written manifests with full input schemas baked in.** That's the path we explicitly avoided with lazy hydration. Don't undo it.
- **A custom Composio replacement.** Composio handles the long tail; we layer reliability on top. Building our own would 10x the maintenance burden for a marginal UX gain.

---

## Files to know

- `src/lib/composio/manifest-registry.ts` — hydration entry point, applies fetched schemas to in-memory tools.
- `src/lib/composio/schema-cache.ts` — KV cache layer.
- `src/lib/composio/backend-client.ts` — Composio API client, schema conversion, error parsing.
- `src/lib/composio/tool-executor.ts` — runtime execution of composio_tool kind.
- `src/lib/server/tool-registry.ts` — orchestrates hydration for the web runtime; wires KV + env.
- `src/lib/server/executor.ts` — the main `executeToolForUser` flow; pre-flight validation lives here.
- `src/lib/server/router.ts` — connection selection + scope/auth pre-flight.
- `src/lib/tool-arguments.ts` — `prepareToolArguments` (the local validator that benefits from hydrated schemas).
- `worker/integrations/base.ts` — `IntegrationTool` type; extend here for `prerequisites`.
- `packages/openclaw-clawlink/index.js` — MCP plugin; tool descriptions and the `clawlink_*` surface.
- `wrangler.toml` — `COMPOSIO_TOOLKIT_MAP`, `COMPOSIO_TOOLKIT_VERSION_MAP`, `COMPOSIO_ENABLED_SLUGS`.
