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

There are now three connection modes in the app:

1. `manual`
   - user enters credentials directly in the hosted page

2. `oauth`
   - current hosted OAuth path backed by Nango
   - session start route creates a hosted session and the hosted page opens the Nango Connect UI

3. `pipedream`
   - current Pipedream Connect path
   - hosted page requests a session-scoped Pipedream connect token
   - browser opens the Pipedream Connect iframe/dialog
   - completion route stores the returned `pipedream_account_id` on the connection row

`pipedream` is the strategic default for new providers. The slugs currently using Pipedream Connect are listed in `PIPEDREAM_CONNECT_SLUGS` in both `wrangler.toml` and `worker/wrangler.worker.toml`. Nango-backed OAuth integrations still use the existing hosted OAuth path, but new providers should not be added to Nango unless there is a specific reason.

## Runtime / Worker Architecture

The worker uses the connection id plus stored auth backend metadata to load credentials and execute tools.

- `worker/credentials.ts`
  - loads manual credentials directly
  - resolves Nango-backed OAuth connections
  - resolves Pipedream-backed connections via stored `pipedream_account_id`
  - marks connections `needs_reauth` on auth failures

- `worker/integrations/**`
  - legacy per-provider custom handlers (Slack, Notion, GitHub, Google\*, Apollo, Motion, Postiz, Twilio, ...)
  - this pattern is being phased out in favor of manifest-backed Pipedream tools
  - do not add a new custom handler for a provider that can be served by an imported Pipedream manifest
  - on tool-name collision the custom handler currently wins over the manifest — see the Manifest-Backed Pipedream Tools section for the full state

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
- generated manifests for `facebook`, `gmail`, `linkedin`, `mailchimp`, `notion`, `outlook`, `xero` are on disk
- the manifest path is wired end to end on both surfaces:
  - server (Next API used by the OpenClaw plugin):
    - `src/lib/server/tool-registry.ts` merges manifest tools with custom-handler tools and only emits manifest tools when the user has a Pipedream-backed connection
    - `src/lib/server/router.ts` narrows connection selection to Pipedream-backed rows when `tool.execution.kind === "pipedream_action"`
    - `src/lib/server/executor.ts` falls through to `executePipedreamActionTool()` instead of requiring a custom handler
  - worker (`api.claw-link.dev`):
    - `worker/index.ts` resolves a Pipedream-backed connection then dispatches `pipedream_action` tools to `executePipedreamActionTool()`
    - `worker/integrations/index.ts` imports from `manifest-registry`; legacy custom handlers continue to run via the existing path
- collision rule: when a custom handler and a generated manifest expose the same tool name, the custom handler wins. Retire the custom handler if the manifest version is preferred.

Custom worker handler status (as of this writing):

- already replaced by manifests (custom handler removed): `facebook`, `gmail`, `linkedin`, `mailchimp`, `outlook`
- has both a custom handler and a generated manifest (collision; custom handler currently wins): `notion`, `slack`
- custom handler only, no manifest yet: `apollo`, `github`, `motion`, `postiz`, `twilio`, all `google-*`

Migration guidance: before deleting a custom handler with a manifest counterpart, validate the manifest tools cover the actions the handler exposed today. Before deleting a custom handler with no manifest yet, run the importer and confirm Pipedream coverage. New providers should be added through the manifest path, not as new custom handlers.

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
