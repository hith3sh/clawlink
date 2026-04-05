<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Product Context

ClawLink is a SaaS for OpenClaw users who want to skip the hassle of manually wiring integrations.

Core product direction:

- Make integration setup dramatically easier than manual provider setup inside OpenClaw.
- The product should feel simple enough that even a non-technical user can understand it quickly.
- Favor clear language, obvious actions, minimal steps, and low-friction connection flows.
- Hosted setup, OAuth, and connection-session UX should be optimized for simplicity over flexibility.
- Avoid exposing unnecessary staging, base URL, or developer-only setup concepts in normal user flows.

Target user experience:

- Install the OpenClaw plugin once.
- Connect apps with as few steps as possible.
- Use hosted flows, dialogs, popups, and guided copy to reduce confusion.
- Prefer UX patterns that keep the user oriented while waiting for OAuth/session completion.
- Future product education will include short videos and simple onboarding content.

Business context:

- Users get their first integration free.
- After the first integration, the user should be prompted toward a paid subscription.
- Current pricing direction is roughly `$5/month` for integrations access.
- Monetization and upgrade prompts should be implemented in a way that feels lightweight and understandable.

Roadmap context:

- The near-term goal is to support at least 40 integrations.
- Future agents should favor reusable connection architecture that scales across many providers.
- OpenClaw compatibility is a primary focus.
- ClawLink should help users attach useful external skills/services to OpenClaw so they can do real work.

Agent guidance:

- When making product or UX decisions, prioritize simplicity, clarity, and fewer user steps.
- When in doubt, choose the flow that is easier for non-technical users to understand.
- Keep developer-oriented escape hatches out of primary UX unless the user explicitly asks for them.

# Deployment Architecture

ClawLink currently runs as two separate Cloudflare projects. Do not treat them as one deploy target.

1. Frontend / hosted app / Next routes
   - Cloudflare Pages project: `clawlink-web`
   - Config file: `wrangler.toml`
   - Current build output: `.vercel/output/static`
   - This project serves the Next.js app, dashboard, hosted connect flow, and Next API routes under `src/app/api/**`.

2. Worker / tool execution backend
   - Cloudflare Worker project: `clawlink`
   - Config file: `worker/wrangler.worker.toml`
   - This project runs the MCP/tool execution layer in `worker/**`.

Shared infrastructure:

- Both projects use the same D1 database: `clawlink`
- Both projects use the same KV namespace: `CREDENTIALS`
- The frontend points to the worker/API base via `NEXT_PUBLIC_API_URL`, currently `https://api.claw-link.dev`

Important deployment rules:

- A frontend/Next API change is not deployed by pushing only the worker.
- A worker change is not deployed by pushing only the Pages app.
- If a change touches schema, credential lookup, OAuth contracts, or connection lifecycle behavior, expect to update database migrations and often deploy both projects.
- Do not assume a successful Worker deploy means dashboard routes or hosted API routes are live.
- The current frontend deployment path is Pages-based. Be careful with stale `.vercel/output` artifacts when deploying.
- There is no active `clawlink-web` OpenNext Worker anymore. The live frontend stays on the Pages project `clawlink-web`.
- `api.claw-link.dev` is a custom domain on the separate Worker `clawlink`.
- The Cloudflare dashboard may still show a failed build card for `clawlink`, but the live `clawlink` service is deployed from Wrangler versions. Check the Worker deployment/version APIs before assuming the active runtime is broken.
- The Polar webhook endpoint for the frontend app is `https://claw-link.dev/api/billing/webhooks`.
- While the frontend remains on Cloudflare Pages with `npx @cloudflare/next-on-pages`, every non-static App Router page/route used at runtime must keep `export const runtime = "edge";`. Removing that will break the Pages build even if local `next build` succeeds.

# Integration Data Model

The old single-row-per-provider assumption is no longer valid. The integration model now supports multiple connections per provider per user.

Rules:

- `user_integrations.id` is the stable connection id.
- A user can have multiple rows for the same integration slug.
- `is_default` determines the default connection for a provider when a worker call does not specify a `connectionId`.
- `external_account_id` is used to match/reuse the same upstream account on reconnect.
- `connection_sessions.connection_id` links an OAuth/manual setup session to the exact connection row being created or updated.
- Row deletion should happen by connection id, not by integration slug.
- Do not reintroduce logic that assumes “one integration slug = one record”.

Current API expectation:

- Row-level delete lives at `DELETE /api/connections/[id]`
- Slug-scoped routes can still exist for provider-level actions, but not for deleting the only assumed row

# Integration MVP Testing

For any integration MVP, validate in two layers:

1. Hosted connect / OAuth / credential capture flow
   - Confirm the user can complete the dashboard connection flow end to end.
   - For OAuth providers, verify login, consent, callback, session completion, and stored credentials.
   - For manual providers, verify credential submission, validation, and stored credentials.
   - Typical check: start from the integration page, complete the connection flow, and verify the connection session ends in `connected`.

2. Worker tool execution
   - After connection succeeds, confirm the stored credentials work in the worker.
   - Preferred test order:
     1. read/list/get actions
     2. then write/create/send/update actions
   - For MVP verification, prioritize simple low-risk reads first, then higher-impact writes.

Troubleshooting guidance:

- If the connect flow fails, check redirect URIs, provider app registration/config, callback handling, and credential storage first.
- If connection succeeds but tools fail, check provider permissions/scopes, token handling/refresh, and worker request formatting.
- Separate “connection flow works” from “tool execution works”; both layers must pass before treating an integration as working.

# OpenClaw Plugin Release Workflow

This repo contains a publish workflow for the npm package `@useclawlink/openclaw-plugin` at:

- `.github/workflows/publish-openclaw-plugin.yml`

Rules for agents:

- Do not suggest or implement npm publish on every commit or push. npm package versions are immutable, so repeated publishes require a new version each time.
- The supported release flow is tag-based publishing through GitHub Actions.
- When changing the OpenClaw plugin package in `packages/openclaw-clawlink`, keep these versions in sync:
  - `packages/openclaw-clawlink/package.json`
  - `packages/openclaw-clawlink/openclaw.plugin.json`
- The publish tag format is:
  - `openclaw-plugin-v<version>`
  - example: `openclaw-plugin-v0.1.2`
- Before telling the user to publish, prefer this sequence:
  1. bump both plugin version files
  2. commit and push to `main`
  3. create and push the matching git tag
- The workflow is designed for npm Trusted Publishing with GitHub Actions. Prefer that over long-lived npm tokens.
- If the user asks how to release the plugin, point them to the workflow above and the tag-based release flow.
