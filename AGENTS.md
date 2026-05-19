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
- Current pricing direction is roughly `$4.99/month` for integrations access.
- Monetization and upgrade prompts should be implemented in a way that feels lightweight and understandable.

Roadmap context:

- ClawLink now supports 100+ integrations.
- Future agents should favor reusable connection architecture that scales across many providers.
- OpenClaw compatibility is a primary focus.
- ClawLink should help users attach useful external skills/services to OpenClaw so they can do real work.

Agent guidance:

- When making product or UX decisions, prioritize simplicity, clarity, and fewer user steps.
- When in doubt, choose the flow that is easier for non-technical users to understand.
- Keep developer-oriented escape hatches out of primary UX unless the user explicitly asks for them.

# Deployment Architecture

ClawLink now runs as a single production Cloudflare Worker.

1. Hosted app / Next routes / tool execution
   - Cloudflare Worker: `clawlink-web`
   - Config file: `wrangler.toml`
   - Build/deploy commands: `npm run build:web` and `npm run deploy:web`
   - This project serves `claw-link.dev`, including the Next.js app, dashboard, hosted connect flow, Polar billing routes, OAuth callbacks, Next API routes under `src/app/api/**`, and the tool execution runtime used by the OpenClaw plugin.

Shared infrastructure:

- D1 database: `clawlink`
- KV namespace: `CREDENTIALS`

Important deployment rules:

- A tool execution change and a hosted-route change now ship through the same `clawlink-web` deploy.
- If a change touches schema, credential lookup, OAuth contracts, billing state, or connection lifecycle behavior, expect to update database migrations and redeploy `clawlink-web`.
- `clawlink-web` uses OpenNext on Workers. Do not reintroduce the old Pages-specific `runtime = "edge"` requirement across App Router files unless the frontend is intentionally moved back to Pages.
- The production custom domain is `claw-link.dev`.
- The Polar webhook endpoint is `https://claw-link.dev/api/billing/webhooks`.
- A `clawlink-web` Pages project may still exist for previews/history, but it is not the production frontend surface anymore.

## Clerk Redirect And Env Rules

- Clerk sign-in/sign-up redirect defaults must be configured with the current Clerk keys:
  - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
  - and, when required, the force variants `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`
- Do not rely on the old `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` names for new changes. Treat them as obsolete.
- Prefer setting the redirect defaults in `ClerkProvider` as well as env so the frontend keeps working even if a manual build misses one env binding.
- If users sign in successfully but land on `/` instead of `/dashboard`, check Clerk redirect config before debugging secrets.
- Frontend auth fixes require `npm run deploy:web`.
- Manual frontend deploys must use the repo’s `npm run deploy:web` flow so the OpenNext build and Wrangler deploy use the intended production env values together.

# Integration Data Model

The old single-row-per-provider assumption is no longer valid. The integration model now supports multiple connections per provider per user.

Rules:

- `user_integrations.id` is the stable connection id.
- A user can have multiple rows for the same integration slug.
- `is_default` determines the default connection for a provider when a tool call does not specify a `connectionId`.
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

2. Hosted runtime tool execution
   - After connection succeeds, confirm the stored credentials work in the worker.
   - Preferred test order:
     1. read/list/get actions
     2. then write/create/send/update actions
   - For MVP verification, prioritize simple low-risk reads first, then higher-impact writes.

Troubleshooting guidance:

- If the connect flow fails, check redirect URIs, provider app registration/config, callback handling, and credential storage first.
- If connection succeeds but tools fail, check provider permissions/scopes, token handling/refresh, and server request formatting.
- Separate “connection flow works” from “tool execution works”; both layers must pass before treating an integration as working.

# Integration MVP Testing

For any integration MVP, validate in two layers:

1. Hosted connect / OAuth / credential capture flow
   - Confirm the user can complete the dashboard connection flow end to end.
   - For OAuth providers, verify login, consent, callback, session completion, and stored credentials.
   - For manual providers, verify credential submission, validation, and stored credentials.
   - Typical check: start from the integration page, complete the connection flow, and verify the connection session ends in `connected`.

2. Hosted runtime tool execution
   - After connection succeeds, confirm the stored credentials work in the worker.
   - Preferred test order:
     1. read/list/get actions
     2. then write/create/send/update actions
   - For MVP verification, prioritize simple low-risk reads first, then higher-impact writes.

Troubleshooting guidance:

- If the connect flow fails, check redirect URIs, provider app registration/config, callback handling, and credential storage first.
- If connection succeeds but tools fail, check provider permissions/scopes, token handling/refresh, and server request formatting.
- Separate "connection flow works" from "tool execution works"; both layers must pass before treating an integration as working.

Automated validation:

```bash
npm run test:openclaw-plugin-contract
npm run smoke:openclaw-plugin -- --preset <preset>
```

# Composio OAuth Scope Coverage

Most of our Composio-backed integrations currently use **Composio Managed** OAuth — Composio's shared upstream OAuth client. That client typically requests only a minimal scope subset, while Composio's tool catalog publishes every tool they have ever built for the toolkit. The catalog is **not** intersected with the auth config's granted scopes, so a portion of imported tools will fail at runtime with "Missing required scope" / "permission denied" / "insufficient permissions" even when the OAuth connection itself is healthy.

See `CLAUDE.md` "Composio Managed OAuth Scope Limits" for the architectural background and worked Figma example (May 2026: 13 of 35 imported Figma tools fail because the Managed Figma OAuth client lacks `file_variables:*`, `file_dev_resources:*`, and `library_analytics:read`).

Rules for agents:

- When introducing a new Composio integration, **default to Bring-Your-Own OAuth credentials, not Managed mode**. Register our own OAuth app at the provider, request the full scope set, then configure Composio's auth config with "Use your own developer credentials" + our `client_id`/`client_secret`. Store the resulting auth config id in `COMPOSIO_AUTH_CONFIG_MAP`. Composio's docs explicitly recommend BYO for production usage.
- When users report a specific Composio tool fails with a missing-scope or permission error and the connection itself is healthy, **suspect a Composio Managed scope gap before assuming a ClawLink bug**. Verify by calling the same tool directly through Composio with `curl -H "x-api-key: $COMPOSIO_API_KEY" -X POST https://backend.composio.dev/api/v3.1/tools/execute/<TOOL_SLUG> -d '{"connected_account_id":"<id>","user_id":"<uid>","arguments":{...}}'`. Same error there confirms the limitation is upstream of us.
- For existing Managed-mode integrations whose tools fail, prefer BYO migration over deleting tools from the manifest. Only trim `*.generated.ts` (and matching `config/composio-tool-overrides.mjs` entries) as a stopgap when BYO migration is blocked or paused.
- BYO migration does not break existing connections. Old Managed-config connections continue to work on the old auth config. Affected users reconnect Figma/Slack/etc. in the dashboard to receive the new scopes.
- Audit existing integrations periodically. For each Managed-mode integration, list (a) the scopes Composio's Managed client requests, (b) the tools we import, (c) which imports require scopes outside that set. Promote integrations with significant gaps to BYO. Keep a running audit list so the technical debt is visible.
- **Placeholder/format traps are NOT scope errors.** When a user reports a confusing provider 4xx — especially text like "Forbidden", "permission denied", "you don't have access" — and the connection is healthy, check the request args before assuming a scope gap. LLMs frequently substitute placeholders for structured identifiers (e.g. `urn:li:person:self`, `<user_id>`, `YOUR_API_KEY`, `me`). Confirm by calling the same tool through Composio with the real id; if it works, the issue is the agent's args, not scopes. Mitigations in priority order: (1) tighten `descriptionPrefix` + `fieldDescriptions` in `config/composio-tool-overrides.mjs` so the LLM avoids the trap on the first call; (2) once the boundary-guard lands in `src/lib/server/executor.ts`, register a `fieldValidators` rule for the specific field so the LLM gets a `type: "validation"` error with an actionable hint instead of the upstream's misleading text. See `CLAUDE.md` "LLM Placeholder-Argument Traps" for the architectural background and the LinkedIn `urn:li:person:self` worked example (2026-05-18).

Audit log (extend as we go, most recent first):

- **2026-05-18 — LinkedIn placeholder-URN trap (followup to 2026-05-09 entry).** User reported `LINKEDIN_CREATE_LINKED_IN_POST` and `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE` failing in Composio logs with `403 "Forbidden. You don't have permission to create posts."` Confirmed by direct Composio call (`POST /tools/execute/LINKEDIN_CREATE_LINKED_IN_POST`) against an active connection on `ac_cbilq2TPjvjU` with the connection's own `w_member_social` scope: `author: "urn:li:person:self"` → 403; same call with the real `urn:li:person:<id>` from `LINKEDIN_GET_MY_INFO` → 201 (post created, then deleted via `LINKEDIN_DELETE_POST`). Not a scope bug — LLM was hallucinating `self` as a placeholder. Resolution part 1 (shipped): tightened `LINKEDIN_CREATE_LINKED_IN_POST` and `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE` in `config/composio-tool-overrides.mjs` with explicit `descriptionPrefix` warnings naming the failure mode + `fieldDescriptions.author` forbidding `self`/`me`/placeholders. Takes effect on the next `npm run deploy:web`. Resolution part 2 (planned): generic boundary-guard in `src/lib/server/executor.ts` — see `CLAUDE.md` "LLM Placeholder-Argument Traps". Once landed, register a `fieldValidators.author` rule for both tools so the LLM gets a `type: "validation"` error with an actionable hint instead of the upstream's misleading 403.

- **2026-05-09 — Apollo** (`ac_cDyLdMYZKclS`): BYO; 0 OAuth scopes (Apollo uses API-key auth, so the audit correctly classifies all 48 imports as `not_scope_modeled`). Verified with a fresh test connection (`ca_-Cy_EixxuE0Z`): `APOLLO_PEOPLE_SEARCH` returned a real person; `APOLLO_BULK_PEOPLE_ENRICHMENT` returned the expected enrichment payload (`credits_consumed`, `matches`, `missing_records`). `not_in_catalog` check shows all 48 imported slugs still published by Composio's catalog (0 stale). Resolution: no tools dropped, all 48 imports kept. Apollo is already on the production-recommended path (BYO credentials, not Composio managed).

- **2026-05-09 — Canva** (`ac_5aVm70GBulBw`): Managed; 18 granular scopes (`design:content:read/write`, `design:meta:read`, `design:permission:read/write`, `asset:read/write`, `brandtemplate:*`, `folder:*`, `comment:*`, `app:*`, `profile:read`). Audit flagged 1 tool: `CANVA_GET_DESIGN_EXPORT_JOB_RESULT` claims `design:read`, which is the deprecated pre-split scope name (Canva replaced it with the granular `design:content:read` / `design:meta:read` / `design:permission:read` we already have). Spot-check confirmed the tool works on our granular scopes — returned `permission_denied` for a fake export job ID, which is resource-not-found language, not a scope error. Resolution: no tools dropped, all 46 imports kept. The 6 `no_scopes_declared` tools are Composio OAuth plumbing (`CANVA_EXCHANGE_OAUTH20_ACCESS_OR_REFRESH_TOKEN`, `CANVA_FETCH_CANVA_CONNECT_SIGNING_PUBLIC_KEYS`, etc.) — not user-facing, harmless to keep. Same stale-metadata pattern as Figma's `files:read` and Instagram's pre-2024 scope names.

- **2026-05-09 — Facebook** (`ac_rrK7_9ggxQP7`): Managed; 11 scopes (Pages-flow scopes for Facebook Pages management). Audit reported 0 scope_gap, 0 no_scopes_declared, 0 not_in_catalog — fully covered. No spot-checks performed because there's nothing to verify; all 39 imported tools' required scopes are within the enabled set. Resolution: no action.

- **2026-05-09 — LinkedIn** (`ac_cbilq2TPjvjU`): Managed; only 4 OAuth scopes (`openid`, `profile`, `email`, `w_member_social` — the basic free-tier set). LinkedIn gates most APIs behind separate developer-approval programs (Marketing Developer Platform for `r_ads`/`rw_ads`, Community Management API for `w_organization_social`/`r_organization_admin`, Compliance API for `w_compliance` — all partner-only). Audit flagged 20 of 22 imported tools. Spot-checks confirmed several work despite metadata claiming missing scopes (`LINKEDIN_GET_MY_INFO`, `LINKEDIN_GET_IMAGES`, `LINKEDIN_GET_AD_TARGETING_FACETS`, and `LINKEDIN_CREATE_LINKED_IN_POST` works on `w_member_social` once you pass the real `urn:li:person:<id>` author URN — a fake URN gives 403 that looks like a scope error but is actually a URN-mismatch). Real failures (4 confirmed by 403 with explicit scope name in error): `LINKEDIN_GET_PERSON` (deprecated `r_liteprofile`), `LINKEDIN_GET_COMPANY_INFO` (`r_organization_admin`), `LINKEDIN_GET_ORG_PAGE_STATS` (Administrator role required), `LINKEDIN_GET_POST_CONTENT`. Plus 8 more dropped on the strength of LinkedIn's documented tier-access (Marketing API tools, organization-admin tools, image upload tools that need `rw_ads`/`w_organization_social`/`w_compliance`, Compliance API delete). Resolution: dropped 12 tools (22→10 imported). Kept: `LINKEDIN_GET_MY_INFO`, `LINKEDIN_GET_IMAGES`, `LINKEDIN_GET_IMAGE`, `LINKEDIN_GET_AD_TARGETING_FACETS`, `LINKEDIN_CREATE_LINKED_IN_POST`, `LINKEDIN_DELETE_LINKED_IN_POST`, `LINKEDIN_DELETE_POST`, `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE`, `LINKEDIN_CREATE_COMMENT_ON_POST`, `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES`. Deployed Version `b25eb265-f2fb-43fa-9a7f-f0e3fc7d0723`. Note for future audit work: LinkedIn's URN-mismatch 403 looks identical to a scope-permission 403, so always re-test posting tools with the user's actual URN before declaring them broken. The remaining `linkedin_create_*`/`linkedin_delete_post` tools may also fail for non-personal content but were kept since they could legitimately work on member-level posts; revisit if customers report failures. BYO migration not viable — LinkedIn's higher-tier scopes require app review and partnership approval, not just a different OAuth client.

- **2026-05-09 — Instagram** (`ac_jyeeVOjFAuB2`): Managed; 5 scopes from the **new Instagram Business Login API** (`instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments`, `instagram_business_content_publish`, `instagram_business_manage_insights`). Audit flagged 14 tools because Composio's tool metadata still lists the **old Facebook Graph API scope names** (pre-Nov-2024 Meta migration: `instagram_basic`, `pages_*`, `ads_*`, `business_management`, etc.). Spot-checks of `INSTAGRAM_GET_USER_INFO`, `INSTAGRAM_GET_IG_USER_MEDIA`, `INSTAGRAM_GET_IG_MEDIA_INSIGHTS`, `INSTAGRAM_GET_PAGE_CONVERSATIONS`, `INSTAGRAM_LIST_ALL_CONVERSATIONS` all confirmed Composio's tool implementations have been updated to use the new Instagram Business API endpoints — they work fine on `instagram_business_*` scopes despite the stale metadata. Resolution: no tools dropped, all 23 imports kept. Note: when Meta deprecated the old Instagram Graph API → Pages flow in 2024, Composio updated their connectors but did not refresh the per-tool `scopes` metadata. Same staleness pattern as Figma's `files:read` claim.

- **2026-05-09 — Shopify** (`ac_L2CDirqQivx_`): BYO (self-registered Shopify app). Auth config metadata shows only 4 scopes, but the actual OAuth token contains a comprehensive comma-separated list covering virtually all Shopify Admin API permissions (`read_all_orders`, `write_customers`, `write_products`, `write_inventory`, `write_content`, `write_themes`, `write_markets`, `write_fulfillments`, `write_draft_orders`, etc.). Audit flagged 119 `scope_gap` + 161 `not_in_catalog` + 16 `no_scopes_declared`. Spot-checks of `SHOPIFY_GET_CUSTOMER` (scope_gap), `SHOPIFY_ADJUST_INVENTORY_LEVEL` (scope_gap), `SHOPIFY_GET_ORDER` (scope_gap), `SHOPIFY_CREATE_ARTICLE` (scope_gap), `SHOPIFY_COUNT_BLOGS` (scope_gap), `SHOPIFY_GET_SHOP_DETAILS` (not_in_catalog), `SHOPIFY_GRAPH_QL_QUERY` (not_in_catalog), `SHOPIFY_CREATE_CUSTOMER` (no_scopes_declared), `SHOPIFY_LIST_CUSTOMERS` (not_in_catalog), and `SHOPIFY_LIST_ORDERS` (not_in_catalog) all returned successful executions or 404s (resource not found), never scope errors. All 296 flagged tools are false positives. Resolution: no tools dropped. 361→361 imported. No deploy needed. Note for future: the audit script reads scope counts from Composio's auth_config metadata, which under-reports BYO tokens that use comma-separated scope strings. This makes the scope-gap report unreliable for BYO integrations — spot-checking is mandatory. The 161 `not_in_catalog` tools still execute fine through Composio even though they no longer appear in the `/tools` catalog endpoint.

- **2026-05-08 — Outlook** (`ac_r5dUM0i6COQO`): Managed; 12 OAuth scopes (`Mail.ReadWrite`, `Mail.Send`, `Calendars.ReadWrite`, `Calendars.ReadWrite.Shared`, `Contacts.ReadWrite`, `Chat.ReadWrite`, `MailboxSettings.ReadWrite`, `User.Read`, `offline_access`, etc.). Audit flagged 65 scope_gap + 7 not_in_catalog. Spot-checks across 7 patterns showed Composio's Microsoft Graph metadata systematically over-declares — claims `Mail.ReadBasic` / `Calendars.ReadBasic` / `Contacts.Read` / `Chat.ReadBasic` even when our `*.ReadWrite` superset works fine, and claims admin-only `User.Read.All` / `Directory.Read.All` for tools that work fine on `User.Read`. Most flagged tools work. Real failures: `OUTLOOK_CREATE_TASK` (401 — `Tasks.ReadWrite` genuinely missing from auth config), `OUTLOOK_LIST_CHATS` and `OUTLOOK_LIST_CHAT_MESSAGES` (403 "No authorization information present" — Microsoft Teams chat requires admin consent on top of `Chat.ReadWrite`, which Composio's managed app doesn't have). Resolution: dropped 10 tools (3 confirmed-broken + 7 not_in_catalog). 282→272 imported. Deployed Version `c4bfcb8c-9bcd-4485-bbd7-24c045eeb41f`. Note for future audit-script work: do NOT add Microsoft Graph supersets to `SUPERSET_RULES` blindly — Chat.ReadWrite implying Chat.Read* would mask the Teams admin-consent gate. Mail/Calendar/Contacts supersets would be safe but the audit's value is producing candidate lists; spot-checks remain mandatory.

- **2026-05-08 — Dropbox** (`ac_fJxHgS6kBTDS`): Managed; 15 OAuth scopes (user-level: `files.content.read/write`, `files.metadata.read`, `account_info.read`, `sharing.read/write`, etc.). Audit flagged 63 tools in `scope_gap`; spot-checks of `DROPBOX_GET_TEAM_INFO`, `DROPBOX_LIST_TEAM_MEMBERS`, `DROPBOX_LIST_TEAM_GROUPS`, `DROPBOX_GET_TEAM_LOG_EVENTS` all returned the same Dropbox API error: `"This token is not associated with a team" error_type: USER_AUTH_NOT_ALLOWED`. Confirmed pattern: every flagged tool is a `DROPBOX_*_TEAM_*` / admin operation that requires a Dropbox Business **team-admin** OAuth token. Personal Dropbox accounts fail; even Business non-admin accounts fail. Composio's managed client requests user-level scopes only, so it physically cannot grant team-admin scopes. Resolution: dropped all 63 team/admin tools from `dropbox.generated.ts` (174→111 imported). Deployed Version `c6af6c99-258b-466d-a18d-8890cec8e623`. Note for future: Dropbox's "team admin" scope set is structurally similar to Figma's Enterprise gate — both fail without a tier-elevated token. Don't reintroduce these tools unless we add a separate "Dropbox Business" auth config that registers team-admin scopes against a BYO Dropbox app and surfaces it to users explicitly as "for Dropbox Business team admins only."

- **2026-05-08 — Notion** (`ac_yocwOszFqop6`): Managed; **0 OAuth scopes declared**. Notion does not authorize via OAuth scopes — access is granted per-page/database when the user adds the integration to a Notion workspace. Composio's per-tool `scopes` metadata for Notion is descriptive only and contains made-up labels (`Insert content`, `read_content`, `databases.read`, `comment:write`) that are not real Notion scopes. Audit flagged 17 tools but spot-checks of `NOTION_LIST_USERS`, `NOTION_SEARCH_NOTION_PAGE`, `NOTION_QUERY_DATABASE`, and `NOTION_FETCH_BLOCK_CONTENTS` all confirmed the connection works fine — only failures were 404s from fake resource IDs (with Notion's actual error message: "Make sure the relevant pages and databases are shared with your integration"). Resolution: no tools dropped, all 45 imports kept. Audit script enhanced with a `not_scope_modeled` status that recognises auth configs declaring zero OAuth scopes (covers Notion, Asana, Box, Calendly, Instantly, Monday, and similar resource-share / API-key providers — dropped 460 false positives from the global audit total).

- **2026-05-08 — Zoom** (`ac_xJRzOCEepQEL`): Managed; 26 scopes (user-level: `user:read:user`, `meeting:read/write/update:*`, `webinar:read/write:*`, `contact:read:list_contacts`, `cloud_recording:read/delete:meeting_transcript`, `archiving:read:list_archived_files`, etc.). Audit flagged 87 of 89 imported tools as `scope_gap`. Spot-checks revealed that Composio's per-tool `scopes` metadata massively over-declares `:admin` and `:master` suffixes for operations that work fine with the equivalent user-level scope. Verified working: `ZOOM_LIST_MEETINGS`, `ZOOM_GET_A_MEETING`, `ZOOM_CREATE_A_MEETING`, `ZOOM_LIST_WEBINARS`, `ZOOM_GET_USER`, `ZOOM_GET_A_WEBINAR`, `ZOOM_LIST_ZRA_CONVERSATIONS`, `ZOOM_GET_PAST_MEETING_PARTICIPANTS` (paid-plan gate, not scope), `ZOOM_GET_IQ_DEAL`, `ZOOM_CREATE_ZRA_CONVERSATION`. All returned successful executions or 404s (resource not found), never scope errors. Real failures confirmed: all `whiteboard:*` tools (30 tools — no whiteboard scopes in token), all `marketplace:*` tools (4 tools), `ZOOM_LIST_DEVICES` (1 tool — missing `device:read:list_zdm_devices:admin`), `ZOOM_DELETE_A_MEETING` (missing `meeting:delete:meeting`), `ZOOM_DELETE_MEETING_RECORDINGS` (missing `cloud_recording:delete:meeting_recording`), `ZOOM_GET_DAILY_USAGE_REPORT` (missing `report:read:daily_usage:admin`). Resolution: dropped 38 genuinely broken tools from `zoom.generated.ts` (89→51 imported). Deployed Version `282c29c1-e2e3-46df-a083-44e32b4ffcac`. No new SUPERSET_RULES added — Zoom's `:admin`/`:master` suffixes are not supersets; they are distinct admin-only scopes. Adding a blanket rule would hide real admin-gated failures. BYO migration note: the vast majority of dropped tools require `:admin` or `:master` scopes that need the connecting user to be a Zoom account admin and the BYO app to be account-approved. Only 3 non-admin tools are missing (`meeting:delete:meeting`, `cloud_recording:delete:meeting_recording`, `report:read:daily_usage:admin`), so BYO is not recommended for Zoom at this time.

- **2026-05-08 — Figma** (`ac_2Ktp_uQWykTF`): Managed; 12 scopes (`file_comments:*`, `webhooks:*`, `current_user:read`, `file_content:read`, `projects:read`, `library_assets:read`, `library_content:read`, `team_library_content:read`, `file_metadata:read`, `file_versions:read`). Resolution: dropped 15 unsupported tools from the manifest rather than migrating to BYO. Decision drivers: (a) `file_variables:*` (3 tools), `library_analytics:read` (6 tools), and `org:activity_log_read` (1 tool) are all documented Figma-Enterprise-only — a BYO app can't register those scopes unless the app owner is on Enterprise *and* the connecting end-user is also on Enterprise; (b) `file_dev_resources:*` (4 tools) is the only category that BYO would actually unblock for non-Enterprise users; (c) `figma_get_payments` uses a different auth model entirely and consistently returns "Missing credentials". The 22 remaining Figma tools are all verified callable with the 12 Managed scopes. Note for future: Composio's per-tool `scopes` metadata sometimes claims a deprecated scope name like `files:read` even when the tool runs fine on the modern `file_content:read` we have — always verify with a direct `/tools/execute/<slug>` call before assuming a scope gap is real.

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

## ClawHub Publishing (Required In Addition To npm)

The plugin is distributed through TWO registries with DIFFERENT names:

- **npm**: `@useclawlink/openclaw-plugin` (kept for the existing scope)
- **ClawHub**: `clawlink-plugin` (so OpenClaw users can install via `clawhub:clawlink-plugin`)
- **Plugin id** (in `openclaw.plugin.json`): `clawlink-plugin` — must match the ClawHub name. The legacy id `clawlink` is preserved in `LEGACY_PLUGIN_IDS` inside `index.js` so old local config still resolves.

ClawHub and npm are **separate registries** — publishing to one does NOT push to the other. OpenClaw clients verify plugins against ClawHub, so a stale ClawHub version means OpenClaw users will refuse to install the plugin or get the old version.

ClawHub enforces that `package.json` `name` equals the published name. Since our npm name and ClawHub name differ, the publish helper at `scripts/publish-clawhub-plugin.mjs` swaps the name to `clawlink-plugin` in place, runs the ClawHub publish, then restores `@useclawlink/openclaw-plugin` regardless of outcome (try/finally). Do NOT commit the swapped name.

**Tag pushes now publish to BOTH registries automatically** via `.github/workflows/publish-openclaw-plugin.yml`. The workflow runs npm publish (with provenance) followed by `node scripts/publish-clawhub-plugin.mjs`, both attested through GitHub Actions Trusted Publishing (OIDC). ClawHub trusted publisher is registered for `hith3sh/clawlink` + `publish-openclaw-plugin.yml`. The direct helper publish is the supported ClawHub path; GitHub Actions is the tag-triggered automation wrapper around it, not a separate manual publish route.

Rules for agents:

- Every plugin version bump must be published to BOTH npm AND ClawHub. The CI workflow handles this on tag push — do not run manual publish steps after tagging.
- Use the helper script — do not hand-roll `clawhub package publish` calls. Hand-rolled calls will fail with `package.json name must match published package name` because of the npm/ClawHub naming split.
- Required release sequence for plugin changes:
  1. bump version in `packages/openclaw-clawlink/package.json`, `packages/openclaw-clawlink/openclaw.plugin.json`, `public/skill.md`, and the `USER_AGENT` constant in `packages/openclaw-clawlink/index.js`
  2. update the `User-Agent` assertion in `packages/openclaw-clawlink/index.test.mjs` to match
  3. run `npm run test:openclaw-plugin-contract`
  4. commit and push to `main`
  5. create and push the `openclaw-plugin-v<version>` tag — CI publishes to BOTH npm and ClawHub automatically
  6. confirm both registries received the new version with `npx clawhub package inspect clawlink-plugin --json` and `npm view @useclawlink/openclaw-plugin@<version>`
- **Do NOT run `npm run publish:clawhub-plugin` after a tag push.** CI publishes to ClawHub automatically. Running it manually after the tag push will fail with "version already exists" because ClawHub releases are immutable. The npm script is reserved for recovery cases only — for example, if the CI ClawHub step fails for an infrastructure reason and you need to retry from a developer machine before bumping the version.
- **Direct/manual ClawHub publish is allowed only as a recovery path when the tag-triggered CI ClawHub publish fails but the version still needs to go live.** In that case, use the helper with an explicit override reason, for example:

```bash
npm run publish:clawhub-plugin -- --manual-override-reason "Recovery publish for clawlink-plugin <version> after GitHub Actions ClawHub step failed on openclaw-plugin-v<version>"
```

- ClawHub blocks manual publishes for packages configured with trusted publishing unless `--manual-override-reason` is provided. Do not omit it during recovery publishes.
- After a recovery publish, verify the live ClawHub version with `npx clawhub package inspect clawlink-plugin --json` and confirm `latestVersion` / `tags.latest` match the intended version.
- Before a real publish, you can still dry-run locally with `npm run publish:clawhub-plugin -- --dry-run` to preview the file list. Dry runs do not push and are safe.
- ClawHub does NOT respect npm's `package.json` `files` allowlist — it uploads everything in the plugin folder. Keep stale tarballs (`*.tgz`), local build artifacts, and unwanted files out of `packages/openclaw-clawlink/`. The publish helper already stashes test files (`*.test.mjs`, `*.test.js`, `*.spec.*`) before publishing so the static scanner does not flag fixture strings.
- ClawHub releases are immutable per version, same as npm. Fixing a bad ClawHub release requires a new version bump.
- Never edit the `name` field in `packages/openclaw-clawlink/package.json` to `clawlink-plugin` and commit it — that breaks npm publishing under the `@useclawlink` scope. The swap only lives inside the publish script's runtime.
- If the user asks "how do I release the plugin," the answer is: bump versions, commit, push, tag, and CI handles both registries. There is no manual ClawHub publish step in the normal flow.
