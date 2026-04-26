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
- Current pricing direction is roughly `$14.99/month` for integrations access.
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

ClawLink runs as two production Cloudflare Workers. Do not treat them as one deploy target.

1. Frontend / hosted app / Next routes
   - Cloudflare Worker: `clawlink-web`
   - Config file: `wrangler.toml`
   - Build/deploy commands: `npm run build:web` and `npm run deploy:web`
   - This project serves `claw-link.dev`, including the Next.js app, dashboard, hosted connect flow, Polar billing routes, OAuth callbacks, and Next API routes under `src/app/api/**`.

2. Worker / tool execution backend
   - Cloudflare Worker: `clawlink`
   - Config file: `worker/wrangler.worker.toml`
   - Build/deploy commands: `npm run build:worker` and `npm run deploy:worker`
   - This project serves `api.claw-link.dev` and runs the MCP/tool execution layer in `worker/**`.

Shared infrastructure:

- Both Workers use the same D1 database: `clawlink`
- Both Workers use the same KV namespace: `CREDENTIALS`
- The frontend points to the tool/API worker via `NEXT_PUBLIC_API_URL`, currently `https://api.claw-link.dev`

Important deployment rules:

- A frontend/Next API change is not deployed by pushing only the `clawlink` worker.
- A tool execution/backend change is not deployed by pushing only the `clawlink-web` worker.
- If a change touches schema, credential lookup, OAuth contracts, billing state, or connection lifecycle behavior, expect to update database migrations and often deploy both Workers.
- Do not assume a successful `clawlink` Worker deploy means dashboard routes or hosted API routes are live.
- Do not assume a successful `clawlink-web` Worker deploy updates `api.claw-link.dev`.
- `clawlink-web` uses OpenNext on Workers. Do not reintroduce the old Pages-specific `runtime = "edge"` requirement across App Router files unless the frontend is intentionally moved back to Pages.
- The `clawlink` git-based Worker build runs from the repo root. Keep the worker deploy command isolated with `wrangler --cwd worker ... --experimental-autoconfig=false` so Wrangler does not auto-detect the root Next/OpenNext app.
- The frontend custom domain is `claw-link.dev`.
- The backend custom domain is `api.claw-link.dev`.
- The Polar webhook endpoint for the frontend app is `https://claw-link.dev/api/billing/webhooks`.
- A `clawlink-web` Pages project may still exist for previews/history, but it is not the production frontend surface anymore.

## Clerk Redirect And Env Rules

- Clerk sign-in/sign-up redirect defaults must be configured with the current Clerk keys:
  - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
  - and, when required, the force variants `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`
- Do not rely on the old `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` names for new changes. Treat them as obsolete.
- Prefer setting the redirect defaults in `ClerkProvider` as well as env so the frontend keeps working even if a manual build misses one env binding.
- If users sign in successfully but land on `/` instead of `/dashboard`, check Clerk redirect config before debugging secrets.
- Frontend auth fixes require `npm run deploy:web`. Deploying only `npm run deploy:worker` will not update the hosted sign-in flow on `claw-link.dev`.
- Manual frontend deploys must use the repo’s `npm run deploy:web` flow so the OpenNext build and Wrangler deploy use the intended production env values together.

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

# Pipedream Integration Validation

For every newly imported Pipedream integration, do not stop at static manifest import. The required validation flow is:

1. Import the provider actions with `npm run import:pipedream-actions -- --app <app> [--integration <slug>]`
2. Run the static manifest audit with `npm run audit:manifests -- --strict`
3. Run the runtime validator with `npm run validate:pipedream-actions -- --integration <slug> --strict`
4. Run the OpenClaw plugin contract tests with `npm run test:openclaw-plugin-contract`
5. Run the live OpenClaw-plugin smoke test with `npm run smoke:openclaw-plugin -- --preset <preset>`

Validation rules:

- The runtime validator must build action args from only the exposed LLM-facing schema plus `safeDefaults`
- Hidden or Pipedream-internal props must not be passed from validation samples
- If Pipedream returns a 400 because a hidden/internal prop is still required, treat that as a blocking failure and fix it in `config/pipedream-action-overrides.mjs`
- Fixes should generally use `hiddenProps` plus `safeDefaults`
- If a tool still needs exposed required business args to run, add `validationArgs` under that action override so the runtime validator can exercise it without OpenClaw in the loop
- The plugin contract test must verify how `clawlink_call_tool` and `clawlink_preview_tool` serialize and forward arguments to ClawLink
- The live smoke test must exercise the local OpenClaw plugin entrypoint against production ClawLink using a real API key and a safe preset

Environment for runtime validation:

- Provide a test account binding per integration via `PIPEDREAM_TEST_ACCOUNTS_JSON` or per-integration env vars such as `PIPEDREAM_TEST_GMAIL_ACCOUNT_ID`
- The runtime validator defaults to read tools only; use `--all` only when write-path validation is intentional and safe
- The live smoke test reads the ClawLink API key from `CLAWLINK_API_KEY` or `~/.openclaw/openclaw.json`
- For each integration, keep at least one safe read smoke preset. Add preview or sandboxed write presets only when they are low-risk and repeatable.

Do not mark a new Pipedream integration as ready until all four validation layers pass:
- static manifest audit
- Pipedream runtime validation
- OpenClaw plugin contract tests
- live OpenClaw-plugin smoke test

# OpenClaw Plugin Release Workflow

This repo contains a publish workflow for the npm package `@useclawlink/openclaw-plugin` at:

- `.github/workflows/publish-openclaw-plugin.yml`

Rules for agents:

- Do not suggest or implement npm publish on every commit or push. npm package versions are immutable, so repeated publishes require a new version each time.
- The supported release flow is tag-based publishing through GitHub Actions.
- When changing the OpenClaw plugin package in `packages/openclaw-clawlink`, keep these versions in sync:
  - `packages/openclaw-clawlink/package.json`
  - `packages/openclaw-clawlink/openclaw.plugin.json`
  - `public/skill.md` frontmatter `version:` field
- The publish tag format is:
  - `openclaw-plugin-v<version>`
  - example: `openclaw-plugin-v0.1.2`
- Before telling the user to publish, prefer this sequence:
  1. bump both plugin version files
  2. commit and push to `main`
  3. create and push the matching git tag
- The workflow is designed for npm Trusted Publishing with GitHub Actions. Prefer that over long-lived npm tokens.
- If the user asks how to release the plugin, point them to the workflow above and the tag-based release flow.
