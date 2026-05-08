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
