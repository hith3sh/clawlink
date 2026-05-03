# Nango To Pipedream Execution Workflow

This document is a historical execution playbook for migrating ClawLink's existing Nango-backed OAuth integrations to Pipedream.

Current policy: new and migrated integrations should use generated Pipedream manifests. The old custom worker handlers referenced below have been removed except for `postiz`.

It is written for another agent to execute incrementally without breaking live users.

Read this together with:

- [docs/pipedream-migration.md](/Users/hithesh/clawlink/docs/pipedream-migration.md)
- [CLAUDE.md](/Users/hithesh/clawlink/CLAUDE.md:70)
- [AGENTS.md](/Users/hithesh/clawlink/AGENTS.md:114)

## Goal

Move every live Nango-backed integration to Pipedream in a safe rollout, while keeping existing Nango connections working until the final cutover.

The migration should:

- keep OpenClaw tool names stable
- keep current users working during rollout
- make new connections use Pipedream
- preserve multi-connection behavior
- remove Nango only after no live integration still depends on it

## Non-Goals

Do not do these in the same change unless explicitly requested:

- redesign the public OpenClaw tool contract
- replace every custom handler with Pipedream components immediately
- remove Nango before all live migrations are verified
- migrate planned / coming-soon providers before live ones

## Current State

### Live Nango-backed integrations

These are the live + available OAuth integrations that still use Nango:

- `outlook`
- `apollo`
- `google-sheets`
- `google-calendar`
- `google-analytics`
- `google-search-console`
- `google-docs`
- `mailchimp`
- `postiz`
- `linkedin`
- `facebook`

### Pipedream examples already in repo

Use these as references:

- Slack Pipedream connect + proxy path
- Notion Pipedream connect + proxy path

Relevant files:

- [src/app/api/connect/start/route.ts](/Users/hithesh/clawlink/src/app/api/connect/start/route.ts:1)
- [src/app/api/connect/sessions/[token]/pipedream/route.ts](/Users/hithesh/clawlink/src/app/api/connect/sessions/%5Btoken%5D/pipedream/route.ts:1)
- [src/app/api/connect/sessions/[token]/pipedream/complete/route.ts](/Users/hithesh/clawlink/src/app/api/connect/sessions/%5Btoken%5D/pipedream/complete/route.ts:1)
- [src/components/connect/HostedConnectPage.tsx](/Users/hithesh/clawlink/src/components/connect/HostedConnectPage.tsx:1)
- [src/lib/server/pipedream.ts](/Users/hithesh/clawlink/src/lib/server/pipedream.ts:1)
- [worker/lib/pipedream-proxy.ts](/Users/hithesh/clawlink/worker/lib/pipedream-proxy.ts:1)
- `worker/integrations/postiz.ts` for the remaining custom-handler exception
- [worker/credentials.ts](/Users/hithesh/clawlink/worker/credentials.ts:1)

## Strategy

Use a compatibility rollout.

Rules:

- existing Nango-backed rows must continue to work while migration is in progress
- new connections for a migrated slug should use Pipedream
- backend selection must come from stored connection metadata, not from slug alone
- Nango code stays until the last live provider is migrated and verified

## Recommended Batch Order

### Batch 1: easiest live providers

Do these first:

- `linkedin`
- `facebook`
- `outlook`
- `apollo`
- `postiz`

Reason:

- these are mostly straightforward bearer-token HTTP APIs
- lower coupling than Mailchimp
- good batch to validate the repeatable migration pattern

### Batch 2: Google family

Do these together:

- `google-sheets`
- `google-calendar`
- `google-docs`
- `google-search-console`
- `google-analytics`

Optional later:

- `gmail`
- `google-drive`
- `google-slides`
- `google-meet`

Reason:

- shared auth style
- shared Google API patterns
- can reuse helper patterns across handlers

### Batch 3: special-case provider

- `mailchimp`

Reason:

- handler does metadata lookup before building the final API base URL
- more likely to need custom proxy handling

### Batch 4: planned providers

Only after live providers are done:

- `microsoft-teams`
- `salesforce`
- `quickbooks`
- `xero`
- `youtube`
- `instagram`
- `vimeo`
- `dropbox`

## Per-Provider Workflow

Follow this exact sequence for each integration slug.

### 1. Research Pipedream capability first

Check:

- `components/<slug>/actions`
- `components/<slug>/sources`

Then compare against the provider's official API docs.

Output required before implementation:

- which Pipedream actions already exist
- which ClawLink tools already exist
- which tools can stay custom but use Pipedream proxy
- which tools should be wrapped around Pipedream actions instead
- what is missing and must remain custom

Do not start by coding from memory.

### 2. Add explicit Pipedream app mapping

Do not rely on generic slug fallback forever.

Use one of:

- `PIPEDREAM_APP_MAP`
- `PIPEDREAM_APP_<SLUG>`

Files / env surfaces:

- [wrangler.toml](/Users/hithesh/clawlink/wrangler.toml:1)
- Cloudflare secrets / vars for `clawlink-web`
- Cloudflare secrets / vars for `clawlink`

Notes:

- frontend needs the mapping to mint connect tokens
- worker needs Pipedream server config for proxy calls and account operations

### 3. Switch integration metadata

Update [src/data/integrations.ts](/Users/hithesh/clawlink/src/data/integrations.ts:1):

- change `setupMode` from `"oauth"` to `"pipedream"`
- update the setup guide copy
- keep tool names stable unless a tool contract change is explicitly intended

### 4. Update the worker handler

Update `worker/integrations/<slug>.ts`.

Minimum requirement:

- keep current tool names
- keep current input/output expectations
- add a Pipedream-backed execution path
- continue supporting legacy direct-token / Nango-shaped credentials if old rows still exist

Preferred pattern:

- add a helper like `providerApiRequest(...)`
- if `credentials.pipedreamAccountId` exists, route through [worker/lib/pipedream-proxy.ts](/Users/hithesh/clawlink/worker/lib/pipedream-proxy.ts:1)
- otherwise keep the old direct provider request path as compatibility fallback

Do not break existing Nango-backed rows during rollout.

### 5. Verify credential backend routing

Check [worker/credentials.ts](/Users/hithesh/clawlink/worker/credentials.ts:1).

Important rule:

- credential loading must choose backend based on stored connection row metadata
- not purely by integration slug

For a migrated provider:

- new Pipedream rows should load via stored encrypted placeholder credentials + `pipedreamAccountId`
- old Nango rows should still load via Nango until cutover is complete

If the file still treats the slug as always-Nango, fix it before shipping the provider.

### 6. Verify hosted connect flow

Check:

- [src/app/api/connect/start/route.ts](/Users/hithesh/clawlink/src/app/api/connect/start/route.ts:1)
- [src/components/connect/HostedConnectPage.tsx](/Users/hithesh/clawlink/src/components/connect/HostedConnectPage.tsx:1)
- [src/app/connect/[slug]/page.tsx](/Users/hithesh/clawlink/src/app/connect/%5Bslug%5D/page.tsx:1)

Make sure:

- the slug now takes the Pipedream path
- the old Nango iframe does not appear
- reconnect behavior works for `needs_reauth` rows
- session completion stores the exact `connection_id`

### 7. Verify server-side save/delete behavior

Check:

- [src/lib/server/integration-store.ts](/Users/hithesh/clawlink/src/lib/server/integration-store.ts:1)
- [src/lib/server/connection-sessions.ts](/Users/hithesh/clawlink/src/lib/server/connection-sessions.ts:1)

Make sure:

- the provider stores `auth_provider = 'pipedream'`
- `pipedream_account_id` is saved on the row
- reconnect updates the existing row when appropriate
- delete removes the Pipedream account when deleting a Pipedream-backed connection
- delete still removes Nango connection for legacy rows until Nango is retired

### 8. Test both layers

For each provider, validate:

1. Hosted connect flow
   - start from dashboard
   - complete hosted flow
   - session becomes `connected`
   - row has `auth_provider = 'pipedream'`

2. Worker tool execution
   - run one or two low-risk reads first
   - then run a write if the provider supports writes in MVP
   - verify auth failure correctly marks `needs_reauth`

### 9. Deploy

For migrated providers, deploy `clawlink-web`:

- `npm run deploy:web`

## Definition Of Done For One Provider

A provider is considered migrated only when all of these are true:

- `setupMode` is `pipedream`
- new hosted connections use Pipedream Connect
- live tool execution works for a Pipedream-backed row
- reconnect works
- delete works
- legacy Nango-backed rows still work during transition
- targeted tests or manual verification were performed

## Batch-Level Deliverables

For each batch, the agent should produce:

1. migrated slugs
2. files changed
3. env/config that must be added in Cloudflare
4. deploy commands run
5. verification summary
6. unresolved provider-specific gaps

## Final Nango Removal Phase

Do not do this until every live provider is migrated and verified.

### Preconditions

Before removing Nango, verify:

- no live integration still has `setupMode: "oauth"` because of Nango
- all live user connections are either already Pipedream-backed or have been intentionally sunset / forced to reconnect
- there is no critical production dependency on [src/lib/server/nango.ts](/Users/hithesh/clawlink/src/lib/server/nango.ts:1)

### Removal targets

Only in the final cleanup PR:

- [src/lib/server/nango.ts](/Users/hithesh/clawlink/src/lib/server/nango.ts:1)
- [src/app/api/connect/sessions/[token]/nango/route.ts](/Users/hithesh/clawlink/src/app/api/connect/sessions/%5Btoken%5D/nango/route.ts:1)
- [src/lib/nango/credentials.ts](/Users/hithesh/clawlink/src/lib/nango/credentials.ts:1)
- Nango env/config in [wrangler.toml](/Users/hithesh/clawlink/wrangler.toml:1)
- Nango-specific save/reconcile/delete paths in:
  - [src/lib/server/integration-store.ts](/Users/hithesh/clawlink/src/lib/server/integration-store.ts:1)
  - [src/lib/server/connection-sessions.ts](/Users/hithesh/clawlink/src/lib/server/connection-sessions.ts:1)
  - [worker/credentials.ts](/Users/hithesh/clawlink/worker/credentials.ts:1)

### Final cleanup order

1. migrate the last live provider
2. confirm production has no remaining required Nango connections
3. remove Nango runtime paths
4. remove Nango UI paths
5. remove Nango env/config
6. deploy both workers
7. verify hosted connect and tool execution still work across migrated providers

## Provider Notes

### Google family

Expect similar execution patterns:

- access token bearer auth
- multiple Google API base URLs
- shared helper opportunities

Do these together when possible.

### Mailchimp

Expect extra work because the handler may need an account-metadata lookup before choosing the final API host.

Do not use Mailchimp as the first migration template.

### LinkedIn / Facebook / Outlook / Apollo / Postiz

These are the best first templates for repeated migration work.

## Suggested First Task For Another Agent

Start with Batch 1 and migrate only these five:

- `linkedin`
- `facebook`
- `outlook`
- `apollo`
- `postiz`

For each slug:

1. audit `components/<slug>/actions` and `sources` in Pipedream
2. add explicit Pipedream app mapping
3. switch `setupMode` to `pipedream`
4. add Pipedream proxy execution path in the worker handler
5. verify hosted connect flow
6. test one read + one write if available
7. deploy both workers

Do not touch Nango removal in that batch.
