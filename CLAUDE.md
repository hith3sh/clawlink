@AGENTS.md

# ClawLink

ClawLink is a SaaS for OpenClaw users that makes integrations dramatically easier to connect than manual provider setup. Product and UX decisions should prioritize hosted flows, minimal setup steps, and language non-technical users can follow quickly.

## Current Architecture

ClawLink runs as two production Cloudflare Workers backed by a shared D1 database and KV namespace.

1. `clawlink-web`
   - Config: `wrangler.toml`
   - Serves `claw-link.dev`
   - Runs the Next.js app via OpenNext on Workers
   - Owns the dashboard, hosted connect pages, Clerk auth flows, Polar billing routes, and Next API routes under `src/app/api/**`

2. `clawlink`
   - Config: `worker/wrangler.worker.toml`
   - Serves `api.claw-link.dev`
   - Runs the MCP / tool execution backend in `worker/**`
   - Owns integration execution, credential loading, request logging, and scheduled trigger execution

Shared infrastructure:
- D1 database: `clawlink`
- KV namespace: `CREDENTIALS`

Important: frontend and backend are separate deploy targets. Changes to hosted routes or dashboard UI require a `clawlink-web` deploy. Changes to tool execution require a `clawlink` deploy. Schema and connection lifecycle changes often require both.

## Main Repo Areas

- `src/app/**`: Next.js app routes and API handlers
- `src/components/**`: dashboard and hosted connect UI
- `src/data/integrations.ts`: integration catalog and setup metadata
- `src/lib/server/**`: server-side connection sessions, billing, routing, execution, and provider helpers
- `src/lib/runtime/**`: runtime-facing tool execution types and policies
- `worker/**`: MCP worker, credential bridge, integration handlers, logging, and worker-only helpers
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

The credential bridge still has some legacy manual-credential support, but new integrations should not use that as their primary setup mode.

`pipedream` remains the strategic default for most new providers. `composio` should be used provider-by-provider only when it materially improves coverage or reliability. The slugs currently using Pipedream Connect are listed in `PIPEDREAM_CONNECT_SLUGS` in both `wrangler.toml` and `worker/wrangler.worker.toml`. Instantly is intentionally removed from that list and uses Composio instead. Nango-backed OAuth integrations still use the existing hosted OAuth path, but new providers should not be added to Nango unless there is a specific reason.

### Pipedream slug → app name mapping

The integration slug we use internally (e.g. `google-calendar`) is not always the same as the Pipedream app name (e.g. `google_calendar`). When they differ, the slug **must** be added to `PIPEDREAM_APP_MAP` in both `wrangler.toml` and `worker/wrangler.worker.toml`, otherwise `getConfiguredAppForSlug()` falls back to the raw slug, Pipedream Connect rejects the token, and the hosted connect page fails with "This session has expired. Please refresh the page to try again."

Rules when adding a new Pipedream provider:

- The Pipedream app name is the `execution.app` field in the generated manifest at `src/generated/pipedream-manifests/<slug>.generated.ts` — copy that value, not the slug.
- Common mismatches: anything with a hyphen in the slug (Pipedream uses underscores), and providers whose Pipedream app has a suffix like `_oauth`, `_v2`, `_rest_api`, `_data_api`, or a vendor prefix like `microsoft_`.
- If the slug equals the app name exactly (e.g. `slack`, `notion`, `gmail`), no `PIPEDREAM_APP_MAP` entry is needed.
- Update both wrangler files in the same change and redeploy both workers (`npm run deploy:web` and `npm run deploy:worker`) — the var is read on both surfaces.

## Runtime / Worker Architecture

The worker uses the connection id plus stored auth backend metadata to load credentials and execute tools.

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
  - uses the same credential bridge logic as the worker runtime

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
- the manifest path is wired end to end on both surfaces:
  - server (Next API used by the OpenClaw plugin):
    - `src/lib/server/tool-registry.ts` merges manifest tools with the remaining Postiz custom-handler tools and only emits manifest tools when the user has a Pipedream-backed connection
    - `src/lib/server/router.ts` narrows connection selection to Pipedream-backed rows when `tool.execution.kind === "pipedream_action"`
    - `src/lib/server/executor.ts` falls through to `executePipedreamActionTool()` instead of requiring a custom handler
  - worker (`api.claw-link.dev`):
    - `worker/index.ts` resolves a Pipedream-backed connection then dispatches `pipedream_action` tools to `executePipedreamActionTool()`
    - `worker/integrations/index.ts` imports from `manifest-registry` plus `postiz`

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
- Worker deploy: `npm run deploy:worker`

If running deploys manually in a shell without the package script environment, make sure the Cloudflare token and production env values are loaded first.

## Product Direction

- first integration free
- lightweight paid plan after that
- roadmap toward 40+ integrations
- keep the primary UX hosted, guided, and simple for OpenClaw users

## Plugin Releases

For OpenClaw plugin releases, follow the tag-based npm publish workflow documented in `AGENTS.md` and `.github/workflows/publish-openclaw-plugin.yml`.
