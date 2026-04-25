# Pipedream Migration Guide

This document describes the correct way to add Pipedream Connect to ClawLink.

The goal is not to replace Nango in one shot. The safe rollout is:

1. add Pipedream as a third auth backend
2. ship one new integration on Pipedream
3. compare the developer and user experience with Nango
4. migrate existing OAuth integrations gradually
5. remove Nango only after the last Nango-backed integration is gone

## Current strategy

- Existing Nango integrations keep working.
- New Pipedream work should start with one net-new integration first.
- Do not try to rewrite every current OAuth integration in the same change.
- Treat this as an incremental auth-platform addition, not a drop-in swap.

---

## What Was Wrong In The Old Draft

The earlier draft was directionally useful, but several important details were wrong for the current repo and current Pipedream docs:

- Pipedream server auth is not based on a project secret alone. The current Connect setup uses a Pipedream OAuth client plus `PIPEDREAM_CLIENT_ID`, `PIPEDREAM_CLIENT_SECRET`, and `PIPEDREAM_PROJECT_ID`.
- The old draft used outdated SDK examples like `createBackendClient`. Current docs center the flow on `PipedreamClient`.
- Browser-based connect tokens need allowed origins when used from the frontend.
- For ClawLink, the connect-token route should be session-scoped, not actor-scoped. The hosted connect page is driven by a session token, not necessarily an active Clerk session.
- The old draft treated Pipedream like Nango credential retrieval. That is not the right mental model when using Pipedream's official OAuth client.
- The old draft hardcoded a fake provider base URL pattern for proxy requests. That is not safe for many apps, especially apps with dynamic domains or nonstandard API hosts.
- The old draft said "no wrangler file changes needed". That is false. This requires env bindings in both Workers and normally a deploy of both Workers because the auth contract changes across frontend routes and worker execution.
- The old draft said to add migrations under `src/db/migrations/`. This repo uses the top-level `migrations/` directory.

---

## Pipedream Model

Pipedream Connect gives ClawLink a managed way to let end users connect accounts.

For ClawLink, the important parts are:

- server-side Pipedream API access
- a short-lived connect token for the frontend
- an end-user identifier, which should be the ClawLink internal user ID
- a connected account ID, which Pipedream returns after a successful connection
- the API Proxy, which lets ClawLink make provider API requests without storing raw OAuth tokens

### Important constraint

When using Pipedream's official OAuth client, the intended execution model is:

- ClawLink stores the Pipedream account ID
- ClawLink calls provider APIs through Pipedream's API Proxy

Do not design the Pipedream path as "fetch OAuth access token from Pipedream, then call the provider directly" unless ClawLink intentionally switches to custom OAuth clients and takes on that extra complexity.

---

## What Stays The Same

- handler files still live in `worker/integrations/<slug>.ts`
- tool names, descriptions, schemas, and metadata stay under ClawLink control
- OpenClaw still sees the same ClawLink tool registry shape
- `connection_sessions` remains the source of truth for hosted connection progress
- `user_integrations.id` remains the stable connection ID
- multiple connections per provider still work the same way on the ClawLink side

---

## What Actually Changes

This is not just a new `setupMode`.

ClawLink currently has two auth backends:

- local/manual credentials
- Nango-managed OAuth

Pipedream adds a third backend:

- Pipedream-managed auth

That means the migration touches:

- integration metadata
- hosted connect session creation
- hosted connect UI behavior
- connection completion logic
- stored connection schema
- worker credential loading
- worker execution retry / reauth behavior
- connection deletion

---

## One-Time Infrastructure Work

### 1. Install the current SDK

```bash
npm install @pipedream/sdk
```

Use the current official SDK. Do not build the new path around the old `createBackendClient` examples.

### 2. Add env vars to both Workers

Frontend / hosted app worker: `wrangler.toml`

Worker / tool execution worker: `worker/wrangler.worker.toml`

Add:

```toml
PIPEDREAM_CLIENT_ID = "..."
PIPEDREAM_CLIENT_SECRET = "..."
PIPEDREAM_PROJECT_ID = "proj_..."
PIPEDREAM_ENVIRONMENT = "production"
```

Why both:

- the frontend worker needs them for Next API routes that mint connect tokens and process connect webhooks
- the tool worker needs them for API Proxy calls, account lookups if needed, and account deletion

### 3. Add a DB migration

Add a new migration file under `migrations/`.

Minimum schema addition:

```sql
ALTER TABLE user_integrations
  ADD COLUMN pipedream_account_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_pipedream_account_unique
  ON user_integrations(pipedream_account_id)
  WHERE pipedream_account_id IS NOT NULL;
```

Do not create this under `src/db/migrations/`. This repo uses the top-level `migrations/` directory.

### 4. Extend the auth backend model

Current state is effectively:

- `auth_provider = clawlink` for manual credentials
- `auth_provider = nango` for Nango connections

Add support for:

- `auth_provider = pipedream`

And extend the mapped runtime/backend enum everywhere it exists so the system can distinguish:

- local/manual
- nango
- pipedream

This affects at least:

- `src/lib/server/integration-store.ts`
- `worker/credentials.ts`
- any UI that renders connection method labels or reconnect behavior

---

## Recommended ClawLink Architecture

### Server-side Pipedream client

Create `src/lib/server/pipedream.ts`.

Responsibilities:

- create a Pipedream client using `PipedreamClient`
- mint connect tokens for a specific ClawLink user
- retrieve account details after connection succeeds
- delete a connected account when a ClawLink connection is deleted

Use the ClawLink internal user ID as Pipedream `externalUserId`.

### Session-scoped connect-token route

Create a route that fits ClawLink's current session architecture:

- `src/app/api/connect/sessions/[token]/pipedream/route.ts`

Do not use a generic actor-auth route like `/api/pipedream/token` as the primary path.

Reason:

- ClawLink's hosted connect page is driven by `connection_sessions`
- the session page can be opened in a popup or another device
- the route should validate the session token, not depend on an active Clerk browser session

That route should:

1. load the connection session by token
2. verify the session is still `awaiting_user_action`
3. mint a Pipedream connect token for `session.userId`
4. pass the current origin in `allowedOrigins`
5. attach a webhook URI that includes the current session ID so the webhook can finish the right session
6. return the connect token payload to the hosted connect page

### Webhook-driven completion

Create:

- `src/app/api/pipedream/webhooks/route.ts`

This route should be the source of truth for marking a connection session as connected or failed.

Recommended flow:

1. create the connect token with a `webhookUri` that includes the ClawLink session ID
2. Pipedream sends a webhook when the account is connected or the flow fails
3. the webhook route retrieves the account details from Pipedream using the returned account ID
4. ClawLink saves or updates the exact `user_integrations` row
5. ClawLink marks the `connection_sessions` row as `connected` or `failed`

This is better than treating a browser callback as authoritative.

### Hosted connect page

Update:

- `src/components/connect/HostedConnectPage.tsx`
- `src/app/connect/[slug]/page.tsx`

Add a `setupMode === "pipedream"` branch.

The Pipedream branch should:

1. call `/api/connect/sessions/[token]/pipedream`
2. start the connect flow using the current Pipedream browser SDK flow
3. keep polling `GET /api/connect/sessions/[token]`
4. show success or failure based on the session row, not just frontend events

### Worker-side API Proxy helper

Create:

- `worker/lib/pipedream-proxy.ts`

This helper should:

- call the Pipedream API Proxy
- authenticate the request with the server-side Pipedream client credentials flow
- send the Pipedream account ID
- send the external user ID
- support both full URLs and relative paths

Do not hardcode fake provider hostnames like `https://api.${appSlug}.com`.

Some apps use:

- nonstandard hosts
- multiple hosts
- dynamic domains
- relative-path proxying only

The helper should be generic enough for both:

- fixed-base apps
- dynamic-domain apps

---

## Worker Credential Model

Current Nango-backed OAuth handlers expect ClawLink to eventually hold a usable provider token in memory.

That is not the right model for the initial Pipedream path.

For a Pipedream-backed integration, `loadConnectionCredentialsForIntegration` should return a marker payload, not a raw provider token:

```ts
{
  connectionId: record.id,
  credentials: {
    pipedreamAccountId: record.pipedream_account_id,
  },
}
```

The worker already knows the ClawLink internal user ID during execution. That same user ID should be passed to the proxy helper as the Pipedream external user ID.

### Refresh and reauth behavior

Do not route Pipedream-backed connections through the current Nango refresh path.

Current code retries auth failures by calling `refreshCredentialsForIntegration()`. That behavior is Nango-shaped.

For Pipedream-backed integrations:

- there is no ClawLink-managed refresh token flow to run in the worker
- a 401 or equivalent auth failure should usually mark the connection `needs_reauth`
- reconnect should send the user back through the Pipedream connect flow

This part needs explicit handling in:

- `worker/credentials.ts`
- `worker/index.ts`
- `src/lib/server/executor.ts`

---

## Connection Storage Rules

Store Pipedream-backed connections in the existing multi-connection model.

Rules:

- `user_integrations.id` remains the stable connection ID
- `pipedream_account_id` is the foreign key to the Pipedream connected account
- `external_account_id` should still be used to match or reuse an upstream account when possible
- `is_default` still decides the default connection when `connectionId` is omitted
- row deletion still happens by ClawLink connection ID, not by slug

This should mirror how ClawLink already treats Nango-backed rows, but without pretending the account is a Nango connection.

### Recommended save helper

Create a helper parallel to `saveNangoIntegrationConnectionForUserId(...)`, for example:

- `savePipedreamIntegrationConnectionForUserId(...)`

That helper should:

- write `auth_provider = 'pipedream'`
- write `pipedream_account_id`
- store placeholder encrypted credentials only if the code path still expects a non-null encrypted payload
- derive `connection_label`, `account_label`, and `external_account_id` from the Pipedream account payload when available
- respect `create_or_match_account` and `setAsDefault`

---

## Connection Delete Rules

When ClawLink deletes a Pipedream-backed connection, it should also delete the corresponding Pipedream connected account.

That logic belongs next to the current Nango delete logic in the integration store layer.

Do not leave orphaned Pipedream accounts behind after a ClawLink connection is deleted.

---

## Integration Metadata Changes

### Add a new setup mode

Update `src/data/integrations.ts`:

```ts
export type IntegrationSetupMode = "manual" | "oauth" | "pipedream";
```

### Add a Pipedream app identifier

Add a field like:

```ts
pipedreamApp?: string;
```

This should be the Pipedream app key for the integration, for example the key used by Pipedream Connect for the account connect flow.

Do not assume the ClawLink slug and the Pipedream app key are always identical.

---

## Pilot Rollout Plan

Start with one new integration that is not already wired through Nango.

The pilot should satisfy all of these:

- available in Pipedream Connect
- simple auth shape
- one or two useful read actions
- little or no dynamic-domain complexity
- not currently live in ClawLink via Nango

For the pilot:

1. add `setupMode: "pipedream"` and the Pipedream app key in `src/data/integrations.ts`
2. add the hosted connect branch
3. add the session token route
4. add the webhook route
5. add the schema / auth backend storage support
6. add the proxy helper
7. add one small handler in `worker/integrations/<slug>.ts`
8. verify the connect flow ends in `connected`
9. verify at least one read tool works end to end
10. only then add one write tool if needed

Do not migrate an existing Nango-backed live integration as the pilot.

---

## Handler Design For Pipedream Integrations

Handler shape can stay familiar:

- same `BaseIntegration`
- same `defineTool(...)`
- same `execute(...)` switch

But execution changes:

- use `credentials.pipedreamAccountId`
- use the proxy helper instead of building `Authorization: Bearer <provider-token>`
- use provider-specific URLs or relative paths based on the app's proxy requirements

What does not stay the same:

- direct token extraction from `credentials.accessToken`
- token-refresh assumptions
- provider-specific OAuth metadata lookups that require a raw provider token

If a current handler depends on a raw OAuth token to discover tenant or datacenter info, expect a partial rewrite.

---

## Testing Requirements

Every Pipedream-backed integration MVP must pass both layers:

### 1. Hosted connect flow

- start from the dashboard or hosted connect route
- create a session
- start the Pipedream connect flow
- complete the auth flow
- confirm the webhook marks the session `connected`
- confirm the expected `user_integrations` row exists with `auth_provider = 'pipedream'`

### 2. Worker execution

- run one low-risk read tool first
- verify the worker uses the API Proxy successfully
- verify auth failures become `needs_reauth`
- verify delete removes both the ClawLink connection row and the Pipedream account

Do not consider the integration working until both layers pass.

---

## Deployment Notes

This work touches both production surfaces:

- `clawlink-web` for Next routes and hosted connect UX
- `clawlink` for worker execution and proxy calls

Expect to deploy both Workers for a real Pipedream integration rollout.

Typical commands:

```bash
npm run deploy:web
npm run deploy:worker
```

If the change touches schema, auth contract, credential loading, or connection lifecycle behavior, a frontend-only or worker-only deploy is usually incomplete.

---

## Things To Avoid

- Do not treat Pipedream as a drop-in Nango replacement.
- Do not add only `setupMode: "pipedream"` without adding a real auth backend concept.
- Do not use an actor-auth-only token route as the primary connect path.
- Do not trust a browser success event as the source of truth for session completion.
- Do not hardcode provider base URLs from the app slug.
- Do not assume proxy requests can always be expressed as `https://api.<slug>.com/...`.
- Do not keep the current Nango refresh logic unchanged for Pipedream connections.
- Do not migrate all Nango integrations before the pilot proves out.
- Do not forget to update both Workers' env bindings and deploy both Workers.

---

## Recommended Next Step

Implement the one-time shared plumbing first:

1. env vars
2. migration
3. `auth_provider = pipedream`
4. session-scoped token route
5. webhook completion route
6. worker proxy helper

Then pick one net-new integration and build only one or two tools on top of that path.
