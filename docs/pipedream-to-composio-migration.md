# Pipedream to Composio Migration Plan

This document describes how ClawLink can add Composio as an auth/tool backend and gradually move selected integrations away from Pipedream.

The goal is not a big-bang replacement. The safe path is:

1. add `composio` as a fourth auth backend
2. prove the path on one provider where Pipedream is weak, starting with `instantly`
3. keep the OpenClaw plugin protocol unchanged
4. migrate providers only when Composio has better tool coverage, reliability, or UX
5. retire Pipedream only after migrated providers have equivalent live smoke coverage

## Why consider Composio

Pipedream is already wired end to end and should remain the default until Composio proves better provider by provider.

Composio is worth adding for providers where:

- Pipedream has too few useful actions
- Composio has a larger, agent-oriented tool catalog
- Composio handles a provider's auth and request formatting better
- we can white-label the user-facing authentication flow enough that users see ClawLink, not Composio

`instantly` is the first candidate because Pipedream currently exposes only a small action set, while Composio exposes a much larger Instantly toolkit.

## Product requirements

The user-facing flow must still feel like ClawLink.

- Dashboard cards should say `Connect`, open a hosted ClawLink flow, then update to `Connected` immediately.
- Users should not need to understand Pipedream, Composio, auth configs, base URLs, staging modes, or provider-specific developer concepts.
- OpenClaw users should continue using `clawlink_list_tools`, `clawlink_describe_tool`, `clawlink_preview_tool`, and `clawlink_call_tool`.
- The `@useclawlink/openclaw-plugin` package should not call Composio directly and should not hold a Composio API key.
- ClawLink should remain the system of record for billing, defaults, connection ids, connection state, reauth state, tool visibility, and smoke validation.

## White-labeling requirements

Composio can be white-labeled, but it is not automatic. Production Composio auth must use the checklist below.

Reference docs:

- Composio white-labeling: https://docs.composio.dev/docs/white-labeling-authentication
- Composio hosted auth / Connect Link: https://docs.composio.dev/docs/tools-direct/authenticating-tools
- Composio connected account links: https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink
- Composio custom auth configs: https://docs.composio.dev/docs/custom-auth-configs
- Composio custom auth params: https://docs.composio.dev/docs/auth-configuration/custom-auth-params

### 1. Brand the Composio Connect Link

In the Composio dashboard:

1. Open Project Settings.
2. Open Auth Screen / Auth Links settings.
3. Upload the ClawLink logo.
4. Set the app title to `ClawLink`.

This changes the hosted Connect Link page. It does not by itself change third-party OAuth consent screens.

### 2. Use ClawLink-owned OAuth apps for OAuth providers

For OAuth providers such as Google, GitHub, Slack, HubSpot, and similar providers:

1. Create a provider developer app owned by ClawLink.
2. Put ClawLink branding on the provider consent screen.
3. Configure the OAuth redirect URI required by Composio or the ClawLink proxy route.
4. Create a Composio custom auth config with the ClawLink client id and client secret.
5. Store the Composio `auth_config_id` for that integration.
6. Always pass that auth config when creating sessions or connection links.

Do not use Composio-managed OAuth in production for user-visible providers unless we are comfortable with users seeing Composio on the OAuth consent screen.

### 3. Proxy OAuth callback URLs through ClawLink when needed

Composio's docs note that `backend.composio.dev` can appear during OAuth redirect-back. If we need to hide that, add a ClawLink route such as:

- `src/app/api/composio/oauth-callback/route.ts`

That route should preserve the full query string and immediately return a `302` redirect to Composio's toolkit callback URL. Do not exchange tokens in this route and do not follow the redirect server-side. The browser must continue the OAuth redirect chain.

This route exists only to keep the visible redirect URI under `claw-link.dev`.

### 4. Use Composio hosted setup when acceptable

Composio Connect Links can host the whole setup screen, including API-key collection for providers like Instantly. Use this when the Composio-hosted screen is branded well enough for production and keeps the flow simpler than maintaining a ClawLink-specific credential form.

Flow:

1. create a Composio Connect Link from ClawLink
2. redirect the hosted connect popup to Composio's `redirect_url`
3. let Composio collect OAuth consent, API keys, or provider-specific fields
4. receive the callback at ClawLink
5. verify the returned connected account and store only the Composio account id

For providers where the Composio screen leaks implementation details or cannot be branded enough, consider adding a ClawLink-native API-key route as a provider-specific escape hatch. It should not be the default Instantly flow.

### 5. Do not use Composio in-chat auth prompts

Composio's Tool Router can prompt users to connect accounts during chat. ClawLink should not use that for production UX.

Reasons:

- it may expose Composio Connect Links directly to the user
- it bypasses ClawLink's billing and connection-session state
- it makes dashboard state harder to keep accurate
- it is less predictable for non-technical OpenClaw users

ClawLink should pre-authenticate users through the dashboard and hosted connect pages, then expose only already-connected tools to OpenClaw.

## Target architecture

Add Composio beside Pipedream.

Current backends:

- `clawlink` / local manual credentials
- `nango`
- `pipedream`

New backend:

- `composio`

The package and OpenClaw-facing API stay unchanged:

- `GET /api/tools`
- `GET /api/tools/:name`
- `POST /api/tools/:name/preview`
- `POST /api/tools/:name/execute`

The server chooses the provider-specific executor based on the selected tool and connection.

## Data model changes

Add a D1 migration under `migrations/`.

Minimum new columns on `user_integrations`:

```sql
ALTER TABLE user_integrations
  ADD COLUMN composio_connected_account_id TEXT;

ALTER TABLE user_integrations
  ADD COLUMN composio_auth_config_id TEXT;

ALTER TABLE user_integrations
  ADD COLUMN composio_toolkit TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_composio_connected_account
  ON user_integrations(composio_connected_account_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_composio_connected_account_unique
  ON user_integrations(composio_connected_account_id)
  WHERE composio_connected_account_id IS NOT NULL;
```

Extend auth backend types:

- `IntegrationAuthProvider = "clawlink" | "nango" | "pipedream" | "composio"`
- connection summaries should map Composio rows to `authBackend: "composio"`

Keep these rules:

- `user_integrations.id` remains the stable ClawLink connection id.
- Users can have multiple rows for the same integration slug.
- `is_default` still decides the implicit connection.
- `external_account_id` can store provider account identity if Composio exposes a useful upstream account id.
- `composio_connected_account_id` stores the Composio account id used for execution.

## Env and configuration

Add Composio config to both deploy targets:

- `wrangler.toml`
- `worker/wrangler.worker.toml`

Expected values:

```toml
COMPOSIO_API_KEY = "..."
COMPOSIO_ENABLED_SLUGS = "instantly"
COMPOSIO_TOOLKIT_MAP = "instantly=instantly"
COMPOSIO_AUTH_CONFIG_MAP = "instantly=ac_..."
```

Why both workers:

- `clawlink-web` needs Composio config for hosted connect routes and callback handling.
- `clawlink` needs Composio config for worker-side tool execution.

Schema/auth/execution changes usually require:

```bash
npm run deploy:web
npm run deploy:worker
```

## Hosted connect flow

### OAuth providers

Use Composio Connect Links, but only through ClawLink-owned auth configs.

Flow:

1. User clicks `Connect` in the dashboard.
2. `POST /api/connect/start` creates or reuses a ClawLink connection session.
3. Hosted connect page opens for the session token.
4. Hosted page requests a Composio auth link from:
   - `src/app/api/connect/sessions/[token]/composio/route.ts`
5. ClawLink validates the session and creates a Composio Connect Link using:
   - ClawLink user id as `user_id`
   - integration's Composio `auth_config_id`
   - ClawLink callback URL
   - optional user-friendly `alias`
6. Browser opens the returned `redirect_url`.
7. User completes provider auth.
8. Composio redirects to:
   - `src/app/api/connect/sessions/[token]/composio/complete/route.ts`
9. ClawLink verifies the returned `connected_account_id`.
10. ClawLink stores:
    - `auth_provider = "composio"`
    - `composio_connected_account_id`
    - `composio_auth_config_id`
    - `composio_toolkit`
    - `auth_state = "active"`
11. Hosted window posts the same `clawlink:connection-connected` dashboard message used by the existing hosted flow.
12. Dashboard updates immediately.

### API-key providers

Use the same Composio Connect Link path when the hosted setup screen is acceptable.

Flow:

1. User clicks `Connect`.
2. Hosted connect page requests a Composio Connect Link from:
   - `src/app/api/connect/sessions/[token]/composio/route.ts`
3. Browser opens Composio's returned setup URL.
4. User enters the provider API key or required setup fields in the hosted Composio screen.
5. Composio redirects back to:
   - `src/app/api/connect/sessions/[token]/composio/complete/route.ts`
6. ClawLink verifies the connected account is active.
7. ClawLink stores the resulting `composio_connected_account_id`.
8. Session completes and dashboard receives the immediate connected message.

The API key should never be stored in ClawLink D1 or KV unless we intentionally choose to own credential storage. In the hosted setup model, Composio collects and stores it, while ClawLink stores only the Composio connected account id.

## Manifest-backed Composio tools

Do not expose Composio tools directly from the Tool Router at runtime. Keep a ClawLink manifest layer, like Pipedream.

Add:

- `src/lib/composio/manifest-types.ts`
- `src/lib/composio/manifest-registry.ts`
- `src/lib/composio/backend-client.ts`
- `src/lib/composio/tool-executor.ts`
- `src/generated/composio-manifests/index.ts`
- `config/composio-tool-overrides.mjs`
- `scripts/import-composio-tools.mjs`

Tool execution kind:

```ts
kind: "composio_tool"
```

Each generated tool should include:

- ClawLink tool name
- ClawLink integration slug
- Composio toolkit slug
- Composio tool slug
- input schema exposed to OpenClaw
- mode: `read`, `write`, or `destructive`
- risk metadata
- confirmation requirement
- validation args for runtime tests
- output summary hints

Use overrides to:

- disable dangerous or noisy tools
- rename tools into ClawLink naming conventions
- hide fields that should not be LLM-facing
- mark destructive tools as high impact
- provide safe validation args

## Execution model

The executor should support both server and worker surfaces.

Update:

- `src/lib/server/tool-registry.ts`
- `src/lib/server/router.ts`
- `src/lib/server/executor.ts`
- `worker/index.ts`
- `worker/credentials.ts`
- `worker/integrations/index.ts`

Rules:

- If `tool.execution.kind === "pipedream_action"`, use the Pipedream executor.
- If `tool.execution.kind === "composio_tool"`, select a Composio-backed connection and use the Composio executor.
- If a caller passes `connectionId`, use that exact ClawLink connection row.
- If no `connectionId` is passed, use the default active Composio connection for that integration.
- For users with multiple Composio accounts, pass the exact `composio_connected_account_id` into the Composio session or execution request so the most recent account is not selected accidentally.

Prefer one of these execution paths:

1. Create a short-lived Composio session with `connectedAccounts` pinned to the selected account, then execute the tool.
2. Use direct `tools.execute` if the SDK/API supports exact connected-account selection for that call.

Do not pass a raw Composio MCP URL to OpenClaw as the first version. That would move auth and tool visibility outside ClawLink's control.

## OpenClaw plugin impact

Phase 1 should require no protocol changes to `@useclawlink/openclaw-plugin`.

The existing package should keep calling ClawLink:

- `clawlink_list_integrations`
- `clawlink_list_tools`
- `clawlink_describe_tool`
- `clawlink_preview_tool`
- `clawlink_call_tool`

Composio is an implementation detail behind ClawLink's API.

Only update plugin docs/skill copy if needed to say that ClawLink tools may be backed by multiple managed providers. Do not mention Composio to users unless we intentionally expose that detail.

## First provider: Instantly

Use Instantly as the pilot.

Implementation status:

- Instantly uses `setupMode: "composio"` instead of `pipedream`.
- The hosted connect page redirects to Composio Connect Link setup instead of rendering a ClawLink-native Instantly API key form.
- ClawLink verifies the Composio callback and stores the Composio account id on `user_integrations`.
- Instantly Pipedream manifest tools are intentionally disabled in the runtime registry so the tool surface comes from Composio only.
- The OpenClaw plugin contract remains unchanged.

Recommended first pass:

1. Add `instantly` to `COMPOSIO_ENABLED_SLUGS`.
2. Configure Composio Instantly auth config.
3. Use Composio Connect Link hosted setup.
4. Generate a curated Instantly Composio manifest.
5. Expose safe reads first.
6. Add preview-gated writes after reads pass.

Do not expose all Instantly tools in one shot. A huge tool catalog can make OpenClaw harder to use.

Suggested first read tools:

- list campaigns
- get campaign
- campaign analytics overview
- count unread emails, if available and safe
- list leads or get lead, if schema is clear

Suggested first write-preview tools:

- create lead
- update lead
- add leads to campaign
- create campaign only if validation args and preview are clean

Avoid first:

- delete tools
- API key create/delete tools
- webhook create/delete tools
- bulk mutation tools unless preview behavior is excellent
- account/domain/deliverability tools with unclear side effects

## Validation workflow

Add a Composio equivalent of the Pipedream validation flow.

Required for every Composio-backed integration:

```bash
npm run import:composio-tools -- --toolkit <toolkit> --integration <slug>
npm run audit:composio-manifests -- --strict
npm run validate:composio-tools -- --integration <slug> --strict
npm run test:openclaw-plugin-contract
npm run smoke:openclaw-plugin -- --integration <slug>
```

Runtime validation should:

- use only LLM-facing schema args plus safe defaults
- run safe reads by default
- run writes only in explicit preview or write mode
- require `COMPOSIO_TEST_ACCOUNTS_JSON` or per-integration env vars such as `COMPOSIO_TEST_INSTANTLY_CONNECTED_ACCOUNT_ID`

Live smoke remains the final gate because it exercises:

OpenClaw plugin -> ClawLink API -> ClawLink registry/router/executor -> Composio -> provider

## Rollout phases

### Phase 0 - Composio project setup

- Create production and development Composio projects.
- Configure ClawLink logo and app title.
- Decide which providers need ClawLink-owned OAuth apps.
- Create the Instantly auth config.
- Add secrets/env vars to both Workers.

### Phase 1 - Backend scaffolding

- Add DB migration.
- Extend auth backend types.
- Add Composio backend client.
- Add Composio connection creation helpers.
- Add Composio delete/disable helper for connection deletion.
- Add `needs_reauth` marking for Composio auth failures.

### Phase 2 - Hosted connect UX

- Add `setupMode: "composio"`.
- Add hosted Composio connect session route.
- Add Composio completion route.
- Redirect API-key providers through Composio Connect Link when the hosted setup screen is acceptable.
- Reuse the immediate dashboard postMessage completion behavior.

### Phase 3 - Instantly pilot

- Build Composio importer and manifest registry.
- Generate and curate Instantly tools.
- Wire `composio_tool` into server and worker executors.
- Add Instantly smoke preset.
- Validate hosted connect, list, describe, read, and preview.

### Phase 4 - Side-by-side production release

- Keep Pipedream active for existing providers.
- Enable Composio only for Instantly.
- Log provider backend in tool execution logs.
- Monitor auth failures, Composio API errors, latency, and tool result quality.

### Phase 5 - Provider-by-provider migration

For each candidate provider:

1. compare Pipedream tool coverage against Composio tool coverage
2. decide whether Composio is materially better
3. configure white-labeling
4. generate a curated manifest
5. validate with the Composio workflow
6. migrate new connections first
7. decide whether existing Pipedream users must reconnect

Do not silently swap existing Pipedream connections. A Pipedream account id cannot execute Composio tools. Users need either a dual-tool transition or a reconnect flow.

### Phase 6 - Pipedream retirement

Only start this after all desired providers have Composio equivalents and smoke coverage.

Steps:

- remove migrated slugs from `PIPEDREAM_CONNECT_SLUGS`
- leave old Pipedream rows readable until users reconnect or retention ends
- remove Pipedream manifests only after no active users depend on them
- delete Pipedream env vars only after no Pipedream-backed tools remain

## Rollback plan

Rollback should be provider-scoped.

If Composio Instantly fails in production:

1. set `instantly` back to `setupMode: "pipedream"` or `coming_soon`
2. stop listing `composio_tool` Instantly tools
3. leave Composio connection rows in place for debugging
4. keep Pipedream tools untouched
5. redeploy the affected worker surfaces

Do not delete user connections as part of an emergency rollback unless they are corrupt or actively harmful.

## Files likely touched

Frontend / hosted app:

- `src/data/integrations.ts`
- `src/components/connect/HostedConnectPage.tsx`
- `src/components/dashboard/useOAuthConnect.ts`
- `src/app/api/connect/start/route.ts`
- `src/app/api/connect/sessions/[token]/composio/route.ts`
- `src/app/api/connect/sessions/[token]/composio/complete/route.ts`

Server/runtime:

- `src/lib/server/integration-store.ts`
- `src/lib/server/connection-sessions.ts`
- `src/lib/server/tool-registry.ts`
- `src/lib/server/router.ts`
- `src/lib/server/executor.ts`
- `src/lib/composio/*`
- `src/generated/composio-manifests/*`

Worker:

- `worker/index.ts`
- `worker/credentials.ts`
- `worker/integrations/index.ts`
- `worker/wrangler.worker.toml`

Scripts/config:

- `scripts/import-composio-tools.mjs`
- `scripts/validate-composio-tools.mjs`
- `scripts/audit-composio-manifests.mjs`
- `scripts/smoke-presets/instantly.mjs`
- `config/composio-tool-overrides.mjs`
- `wrangler.toml`
- `migrations/*.sql`

Docs:

- `docs/adding-an-integration.md`
- `docs/tool-call-testing-plan.md`
- `CLAUDE.md`
- `AGENTS.md`

## Open questions before implementation

- Does the current Composio plan allow full Auth Screen branding in production?
- Does Composio support custom domains for the initial Connect Link, or only logo/title customization?
- Can direct `tools.execute` pin `connected_account_id` for every needed toolkit, or do we need session-based execution for account selection?
- For API-key providers, should ClawLink always collect keys directly, or only for providers where hiding Composio is important?
- Which OAuth providers are worth creating ClawLink-owned OAuth apps for first?
- What is the acceptable fallback if Composio has more tools but weaker execution reliability for a provider?

## Decision

Proceed with a Composio pilot only as a dual-backend addition.

Start with `instantly`, use Composio Connect Link hosted setup, store only the Composio connected account id, and keep the OpenClaw plugin contract unchanged. If Instantly passes hosted connect, manifest audit, runtime validation, plugin contract tests, and live smoke tests, then evaluate the next provider.
