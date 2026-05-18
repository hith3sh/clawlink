@AGENTS.md

# ClawLink

ClawLink is a SaaS for OpenClaw users that makes integrations dramatically easier to connect than manual provider setup. Product and UX decisions should prioritize hosted flows, minimal setup steps, and language non-technical users can follow quickly.

## Current Architecture

ClawLink runs as one production Cloudflare Worker backed by a shared D1 database and KV namespace.

1. `clawlink-web`
   - Config: `wrangler.toml`
   - Serves `claw-link.dev`
   - Runs the Next.js app via OpenNext on Workers
   - Owns the dashboard, hosted connect pages, Clerk auth flows, Polar billing routes, Next API routes under `src/app/api/**`, and the tool execution runtime used by the OpenClaw plugin

Shared infrastructure:
- D1 database: `clawlink`
- KV namespace: `CREDENTIALS`

Important: hosted routes and tool execution now ship together through `clawlink-web`. Schema and connection lifecycle changes still often require a deploy plus migrations, but there is no second runtime at `api.claw-link.dev`.

## Main Repo Areas

- `src/app/**`: Next.js app routes and API handlers
- `src/components/**`: dashboard and hosted connect UI
- `src/data/integrations.ts`: integration catalog and setup metadata
- `src/lib/server/**`: server-side connection sessions, billing, routing, execution, and provider helpers
- `src/lib/runtime/**`: runtime-facing tool execution types and policies
- `src/lib/composio/**`: Composio backend client, tool executor, manifest registry, and KV schema cache
- `worker/**`: shared credential bridge and integration handler helpers still imported by the web runtime; no separate deploy target
- `migrations/*.sql`: D1 schema migrations

## Connection Architecture

The connection model supports multiple connections per integration per user.

- `user_integrations.id` is the stable connection id
- users can have multiple rows for the same integration slug
- `is_default` selects the implicit connection when a tool call omits `connectionId`
- `external_account_id` is used to match and reuse upstream accounts on reconnect
- `connection_sessions.connection_id` ties a hosted/manual setup session to the exact connection row being updated

Do not reintroduce the old one-row-per-provider assumption.

## Current Auth Backends

The catalog setup modes are:

1. `oauth`
    - legacy mode; should not be used for new integrations
    
2. `coming_soon`
    - visible roadmap integrations without a live setup flow

3. `composio`
    - current default backend for all active integrations
    - hosted ClawLink page initiates Composio Connect for OAuth or API key providers
    - stores only the Composio connected account id and related metadata on the ClawLink connection row
    - tool execution uses generated Composio manifests and `kind: "composio_tool"`
    - generated manifests do **not** contain `inputSchema` — schemas are fetched lazily from Composio's API at runtime and cached in KV (see "Composio Lazy Schema Architecture" below)

`composio` is the strategic default for all integrations. Do not add new providers to any other backend.

## Runtime Architecture

The web runtime uses the connection id plus stored auth backend metadata to load credentials and execute tools.

- `worker/credentials.ts`
  - loads manual credentials directly
  - resolves Composio-backed connections via stored `composio_account_id`
  - marks connections `needs_reauth` on auth failures

- `worker/integrations/**`
  - contains the shared handler base plus the remaining `postiz` custom handler
  - all normal provider tool surfaces should come from generated Composio manifests
  - do not add a new custom handler unless the user explicitly approves a provider-specific exception

- `src/lib/server/executor.ts`
  - shared server-side tool execution path
  - uses the same credential bridge logic and shared handler registry

## Composio Lazy Schema Architecture

Composio tool manifests are generated **without `inputSchema`** to keep the runtime bundle small. The generated manifests contain only metadata (name, description, mode, risk, tags, execution spec). Schemas are fetched at runtime from Composio's API and cached in KV.

Key files:

- `src/lib/composio/schema-cache.ts` — KV-backed cache layer with 24h TTL and in-memory per-request cache
- `src/lib/composio/manifest-registry.ts` — `hydrateComposioToolSchemas()` patches stub schemas in-place before returning tools
- `src/lib/composio/backend-client.ts` — `fetchComposioToolSchemas()` calls Composio's `GET /tools` API and converts `input_parameters` to ClawLink's simplified JSON Schema format

How it works:

1. Static manifests set `inputSchema: { type: "object", properties: {} }` (empty stub)
2. When tool catalog or execution routes need schemas, the web runtime queries D1 for the user's Composio-backed connections, identifies which integration slugs are connected, and hydrates schemas for just those toolkits
3. Schema resolution: in-memory cache → KV cache (`composio-schema:<slug>`, 24h TTL) → Composio API fetch
4. Unconnected integrations keep the stub schema — the user cannot invoke those tools anyway
5. The dashboard (`tool-registry.ts`) uses the same hydration path via `hydrateSchemas()` before building tool catalog/description responses
6. Tool execution (`tool-executor.ts`) never reads `inputSchema` — args pass directly to Composio's `POST /tools/execute/<slug>`

Rules:

- Do not reintroduce `inputSchema` in generated Composio manifests. The import script intentionally omits it.
- If Composio updates their tool schemas, ClawLink picks up the changes automatically when the KV cache expires (24h)
- Adding a new Composio integration only requires committing a small (~10-20 KB) manifest file. No schema data in the repo.
- The `convertInputSchema()` logic in `backend-client.ts` mirrors what the import script previously used, so runtime schemas are identical to what was previously statically generated.

## Composio Managed OAuth Scope Limits

Composio offers two OAuth modes per auth config: **Managed** (the default — Composio's shared OAuth client) and **Bring-Your-Own** ("Use your own developer credentials" — our `client_id` + `client_secret`). Composio's docs explicitly recommend BYO for production use.

The Managed client is registered with each provider for a fixed, minimal scope set, while Composio's tool catalog publishes every tool they have ever built for the toolkit regardless of which scopes the Managed client requests. The catalog is **not** intersected with the auth config's granted scopes — neither on Composio's side nor ours. So tools that need scopes the Managed client doesn't have appear in `clawlink_list_tools` and fail at runtime with a provider scope error like "Missing required scope: …".

Worked example (Figma, May 2026 — auth config `ac_2Ktp_uQWykTF` `figma-clawlink`):
- Composio publishes 53 Figma tools.
- Their Managed Figma OAuth client is registered for 12 scopes (file content/metadata/versions/comments, library content, projects, current user, webhooks).
- 15 tools fail at runtime even with a healthy connection: `file_variables:*` (3 tools — also Figma Enterprise-only), `file_dev_resources:*` (4 tools), `library_analytics:read` (6 tools — Figma Enterprise-only), `org:activity_log_read` (1 tool — Enterprise org admin only), and `figma_get_payments` (different auth model entirely).
- Confirmed by calling `POST https://backend.composio.dev/api/v3.1/tools/execute/FIGMA_GET_LOCAL_VARIABLES` directly with Composio's API key — same scope error, so the limitation is upstream of ClawLink.
- Composio's auth-config scope picker accepts arbitrary scope names typed in, but adding scopes the Managed client isn't registered for breaks the OAuth consent flow at connect time.
- Composio's per-tool `scopes` metadata is in places stale (e.g. claims `files:read` for tools that actually work fine with the modern `file_content:read`). Always verify by calling the tool directly through Composio's `/tools/execute/<slug>` before assuming a scope mismatch is real.

Important second source of scope mismatch: **provider tier-gates**. `file_variables:*`, `library_analytics:read`, and `org:activity_log_read` are documented Enterprise-plan-only by Figma. Even a BYO OAuth app cannot register those scopes unless the app owner's Figma account is on Enterprise — and the connecting user also needs Enterprise for the granted scope to actually return data. So those tools are effectively un-shippable to non-Enterprise customers, regardless of OAuth strategy.

Resolution committed 2026-05-08: 15 unsupported Figma tools dropped from `src/generated/composio-manifests/figma.generated.ts` and matching entries cleaned from `config/composio-tool-overrides.mjs`. Remaining 22-ish tools are all verified callable with the 12 Managed scopes. BYO migration deferred — minimal upside (only the 4 dev_resources tools become reachable; the rest are Enterprise-locked anyway).

Mitigations, in order of preference:

1. **BYO OAuth credentials (production answer).** Register our own OAuth app with the provider, request all needed scopes upfront, then create a Composio auth config with "Use your own developer credentials" + our `client_id`/`client_secret`. Update `COMPOSIO_AUTH_CONFIG_MAP` to point the integration slug at the new auth config id. Existing connected accounts on the old Managed config continue to work; affected users reconnect to pick up the new scopes.
2. **Trim the manifest (stopgap only).** Remove the unsupported tools from the integration's `*.generated.ts` and any matching entries in `config/composio-tool-overrides.mjs` so the LLM never sees them. Loses functionality, but better than runtime scope errors.
3. **Per-tool `requiresScopes` + per-connection `scopeSnapshot`.** Long-term: populate `requiresScopes` at import time from Composio's tool docs and read the granted scopes back from Composio per connection so `findMissingScopes` in `src/lib/server/router.ts` can filter tools at list time. Not implemented yet.

When adding a new Composio integration, default to (1) — BYO credentials from day one. Treat the Managed mode as a prototype convenience, not a production answer.

## LLM Placeholder-Argument Traps

Not every provider 4xx is a scope or auth bug. A common failure mode is an LLM substituting a placeholder string for a structured identifier the provider then rejects with a misleading error. Worked example (LinkedIn, May 2026): an agent sent `"author": "urn:li:person:self"` to `LINKEDIN_CREATE_LINKED_IN_POST`. LinkedIn rejected it with `403 "Forbidden. You don't have permission to create posts"` — text indistinguishable from a real scope error. Same connection, same `w_member_social` scope, posts fine once the real `urn:li:person:<id>` from `LINKEDIN_GET_MY_INFO` is passed.

Why ClawLink's existing self-correction loop misses these: `prepareToolArguments` only catches JSON-schema violations (missing fields, wrong types). `urn:li:person:self` is a structurally valid string, so it sails through and the upstream 403 lands in the generic `type: "provider"` branch of `classifyIntegrationError` — raw message passed through, no hint, no actionable guidance, agent retries blind.

Mitigations:

1. **Tighten tool descriptions in `config/composio-tool-overrides.mjs`.** Use `descriptionPrefix` to name the failure mode explicitly and `fieldDescriptions` to forbid known-bad values on the specific field. Helps the LLM avoid the trap on the first call. Already applied to `LINKEDIN_CREATE_LINKED_IN_POST` and `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE` (2026-05-18).
2. **Boundary-guard at the executor (planned).** Add `validateArgsAgainstGuards` in `src/lib/server/executor.ts` between `prepareToolArguments` and the upstream call. Two layers: a generic placeholder detector (catches `<id>`, `{user_id}`, `YOUR_*`, `REPLACE_ME`, etc. across all integrations with zero config), plus optional per-tool `fieldValidators` registered in `composio-tool-overrides.mjs` for sneaky traps like `urn:li:person:self` that the generic layer can't recognise. Failures are classified `type: "validation"` so the existing hint + invalidFields + inputSchema response path enables true self-correction on retry.
3. **Production log mining (planned).** `tool_execution_log` already records every failure. A small script can rank tools by repeat 4xx failures and surface common arg patterns, turning real user pain into a prioritised list of per-tool validators to write.

When a user reports a confusing provider 4xx and the connection looks healthy, suspect a placeholder/format trap before assuming scope, then verify by calling the same tool directly through Composio's `/tools/execute/<slug>` with the same args.

## Flows And Triggers

The repo now includes flow and trigger runtime support in addition to direct tool calls.

- `src/app/api/flows/**`
- `src/app/api/triggers/**`
- `src/lib/server/flow-runtime.ts`
- `src/lib/server/trigger-runtime.ts`
- `src/lib/server/router.ts`
- `src/lib/server/tool-registry.ts`
- `src/lib/server/tool-execution-log.ts`

Related schema migrations:
- `007_agent_runtime_phase1.sql`
- `008_flow_runtime.sql`
- `009_triggers.sql`

## Deploy Commands

- Frontend build: `npm run build:web`
- Frontend deploy: `npm run deploy:web`

If running deploys manually in a shell without the package script environment, make sure the Cloudflare token and production env values are loaded first.

## Product Direction

- first integration free
- lightweight paid plan after that
- roadmap toward 100+ integrations
- keep the primary UX hosted, guided, and simple for OpenClaw users

## Plugin Releases

For OpenClaw plugin releases, follow the tag-based npm publish workflow documented in `AGENTS.md` and `.github/workflows/publish-openclaw-plugin.yml`.

**Every plugin version must be published to BOTH npm AND ClawHub.** The plugin uses two different names by design: npm publishes as `@useclawlink/openclaw-plugin` (existing scope) and ClawHub publishes as `clawlink-plugin` (so OpenClaw users can install via `clawhub:clawlink-plugin`). The plugin id in `openclaw.plugin.json` is `clawlink-plugin` to match the ClawHub name.

The two registries do not sync, but a tag push now publishes to BOTH automatically via `.github/workflows/publish-openclaw-plugin.yml`. The workflow runs npm publish (with provenance) followed by `scripts/publish-clawhub-plugin.mjs`, both attested through GitHub Actions Trusted Publishing (OIDC). **Do NOT run `npm run publish:clawhub-plugin` manually after a tag push** — CI handles it, and re-running locally will fail with "version already exists" since ClawHub releases are immutable. The npm script is reserved for dry runs (`-- --dry-run`) and recovery scenarios. Full rules are in `AGENTS.md` under "ClawHub Publishing".

If the GitHub Actions ClawHub publish step fails but npm already released the version, the approved recovery path is a direct local publish through the helper script, not a hand-rolled `clawhub package publish` call:

```bash
npm run publish:clawhub-plugin -- --manual-override-reason "Recovery publish for clawlink-plugin <version> after GitHub Actions ClawHub step failed on openclaw-plugin-v<version>"
```

ClawHub requires `--manual-override-reason` for manual publishes when trusted publisher config exists. After the recovery publish, verify with `npx clawhub package inspect clawlink-plugin --json` and confirm `latestVersion` matches the intended release.
