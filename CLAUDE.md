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
   - current hosted OAuth path backed by Nango
   - session start route creates a hosted session and the hosted page opens the Nango Connect UI

2. `pipedream`
   - current Pipedream Connect path
   - hosted page requests a session-scoped Pipedream connect token
   - browser opens the Pipedream Connect iframe/dialog
   - completion route stores the returned `pipedream_account_id` on the connection row

3. `coming_soon`
   - visible roadmap integrations without a live setup flow

4. `composio`
   - current pilot backend for `instantly`
   - hosted ClawLink page collects the Instantly API key directly, then creates a Composio connected account server-side
   - stores only the Composio connected account id and related metadata on the ClawLink connection row
   - tool execution uses generated Composio manifests and `kind: "composio_tool"`
   - generated manifests do **not** contain `inputSchema` — schemas are fetched lazily from Composio's API at runtime and cached in KV (see "Composio Lazy Schema Architecture" below)

The credential bridge still has some legacy manual-credential support, but new integrations should not use that as their primary setup mode.

`pipedream` remains the strategic default for most new providers. `composio` should be used provider-by-provider only when it materially improves coverage or reliability. The slugs currently using Pipedream Connect are listed in `PIPEDREAM_CONNECT_SLUGS` in `wrangler.toml`. Instantly is intentionally removed from that list and uses Composio instead. Nango-backed OAuth integrations still use the existing hosted OAuth path, but new providers should not be added to Nango unless there is a specific reason.

### Pipedream slug → app name mapping

The integration slug we use internally (e.g. `google-calendar`) is not always the same as the Pipedream app name (e.g. `google_calendar`). When they differ, the slug **must** be added to `PIPEDREAM_APP_MAP` in `wrangler.toml`, otherwise `getConfiguredAppForSlug()` falls back to the raw slug, Pipedream Connect rejects the token, and the hosted connect page fails with "This session has expired. Please refresh the page to try again."

Rules when adding a new Pipedream provider:

- The Pipedream app name is the `execution.app` field in the generated manifest at `src/generated/pipedream-manifests/<slug>.generated.ts` — copy that value, not the slug.
- Common mismatches: anything with a hyphen in the slug (Pipedream uses underscores), and providers whose Pipedream app has a suffix like `_oauth`, `_v2`, `_rest_api`, `_data_api`, or a vendor prefix like `microsoft_`.
- If the slug equals the app name exactly (e.g. `slack`, `notion`, `gmail`), no `PIPEDREAM_APP_MAP` entry is needed.
- Update `wrangler.toml` in the same change and redeploy `clawlink-web` — the hosted connect flow and runtime execution both read the same env surface now.

## Runtime Architecture

The web runtime uses the connection id plus stored auth backend metadata to load credentials and execute tools.

- `worker/credentials.ts`
  - loads manual credentials directly
  - resolves Nango-backed OAuth connections
  - resolves Pipedream-backed connections via stored `pipedream_account_id`
  - marks connections `needs_reauth` on auth failures

- `worker/integrations/**`
  - contains the shared handler base plus the remaining `postiz` custom handler
  - all normal provider tool surfaces should come from generated Pipedream manifests
  - do not add a new custom handler unless the user explicitly approves a provider-specific exception

- `src/lib/server/executor.ts`
  - shared server-side tool execution path
  - uses the same credential bridge logic and shared handler registry the old worker used

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

## Manifest-Backed Pipedream Tools

The strategic direction for adding integrations is the manifest-backed Pipedream platform, not custom worker handlers. See `docs/pipedream-provider-import-flow.md` for the per-provider import workflow.

Pieces of the platform:

- importer: `scripts/import-pipedream-actions.mjs`
- override layer: `config/pipedream-action-overrides.mjs`
- generated manifests: `src/generated/pipedream-manifests/<provider>.generated.ts`
- manifest registry: `src/lib/pipedream/manifest-registry.ts`
- generic executor: `src/lib/pipedream/action-executor.ts`

Current state:

- the importer, manifest registry, and generic executor exist
- generated manifests for `airtable`, `apollo`, `calendly`, `clickup`, `facebook`, `gmail`, `google-ads`, `google-analytics`, `google-calendar`, `google-docs`, `google-drive`, `google-search-console`, `hubspot`, `instantly`, `klaviyo`, `linkedin`, `mailchimp`, `notion`, `onedrive`, `outlook`, `postiz`, `salesforce`, `xero`, and `youtube` are on disk
- the manifest path is wired end to end in the web runtime:
  - `src/lib/server/tool-registry.ts` merges manifest tools with the remaining Postiz custom-handler tools and only emits manifest tools when the user has a Pipedream-backed connection
  - `src/lib/server/router.ts` narrows connection selection to Pipedream-backed rows when `tool.execution.kind === "pipedream_action"`
  - `src/lib/server/executor.ts` falls through to `executePipedreamActionTool()` instead of requiring a custom handler
  - `worker/integrations/index.ts` remains the shared registry module imported by the web runtime

Custom worker handler status:

- `postiz` is the only retained custom handler exception
- previous per-provider handlers for Slack, GitHub, Apollo, Motion, Twilio, and Google providers have been removed
- integrations without generated manifests, such as `slack` and `google-sheets`, do not expose tools until their Pipedream manifests are imported

Migration guidance: new providers should be added through the manifest path, not as new custom handlers. If a future provider truly needs custom execution, document the exception and keep it isolated like Postiz.

Validation workflow for new Pipedream imports:

1. `npm run import:pipedream-actions -- --app <app> [--integration <slug>]`
2. `npm run audit:manifests -- --strict`
3. `npm run validate:pipedream-actions -- --integration <slug> --strict`
4. `npm run test:openclaw-plugin-contract`
5. `npm run smoke:openclaw-plugin -- --preset <preset>`

Rules:

- The runtime validator must execute Pipedream actions using only the exposed LLM-facing args plus `safeDefaults`
- Hidden/internal Pipedream props must be removed via `hiddenProps` and satisfied via `safeDefaults`
- If a tool needs exposed required business args to run, add `validationArgs` in `config/pipedream-action-overrides.mjs`
- Use `PIPEDREAM_TEST_ACCOUNTS_JSON` or per-integration env vars such as `PIPEDREAM_TEST_GMAIL_ACCOUNT_ID` to provide test account bindings
- The plugin contract test must verify the OpenClaw plugin forwards `clawlink_call_tool` / `clawlink_preview_tool` arguments correctly
- The live smoke test must invoke the local plugin entrypoint against production ClawLink using a real API key and a safe preset
- Keep at least one safe read smoke preset per integration; add preview or sandboxed write presets only when low-risk
- Do not treat a provider import as done until the static audit, runtime validation, plugin contract test, and live smoke test all pass

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
- `010_pipedream_connect.sql`

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
