# Composio scope-coverage audit

Generated: 2026-05-08T19:33:25.390Z

## How to read this report

- **scope_gap** — Composio's tool metadata claims this tool needs scopes that aren't enabled on the auth config. Likely fails at runtime. Verify by calling `POST /tools/execute/<slug>` directly with the Composio API key before acting.
- **likely_provider_tier_gate** — the missing scope appears Enterprise/Org/admin-only. A BYO OAuth app probably won't help unless app owner + connecting user are both on the higher tier. Most often: drop.
- **composio_managed_scope_gap** — the missing scope exists on the provider but Composio's managed OAuth client doesn't request it. BYO migration unlocks the tool.
- **possibly_stale_metadata** — Composio claims a deprecated scope name (e.g. `files:read`). Tool often works fine on the modern scope we already have. Verify before dropping.
- **no_scopes_declared** — Composio metadata lists no scopes for this specific tool. Usually means the tool either uses no OAuth scope, or Composio hasn't documented it. Treat as needs-verification.
- **not_scope_modeled** — the integration's auth config declares zero OAuth scopes overall. The provider doesn't authorize via OAuth scopes (e.g. Notion grants per-page/database access on share; many API-key integrations have no scope concept at all). Composio's per-tool `scopes` metadata is descriptive only and should be ignored for this provider.
- **not_in_catalog** — we imported a toolSlug that Composio's `/tools` endpoint no longer returns for `latest`. Likely renamed or removed upstream — drop or re-import.

## Summary

Integrations audited: 76
Total imported tools: 8159
Total scope-gap tools: 1665

| Integration | Imported | Catalog | Auth configs | Scope gaps | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `activecampaign` | 298 | 0 | 0 | 0 | 298 not in catalog; no auth config found |
| `ahrefs` | 40 | 40 | 1 | 0 | — |
| `airtable` | 23 | 23 | 1 | 0 | — |
| `apollo` | 48 | 48 | 1 | 0 | — |
| `asana` | 153 | 153 | 1 | 0 | — |
| `bamboohr` | 41 | 41 | 0 | 8 | no auth config found |
| `bitbucket` | 105 | 105 | 1 | 86 | — |
| `box` | 284 | 200 | 1 | 0 | 84 not in catalog |
| `brevo` | 21 | 21 | 0 | 1 | no auth config found |
| `calendly` | 51 | 51 | 1 | 0 | — |
| `canva` | 46 | 46 | 1 | 1 | — |
| `clickup` | 161 | 162 | 1 | 0 | — |
| `dataforseo` | 312 | 200 | 1 | 0 | 112 not in catalog |
| `docusign` | 335 | 200 | 0 | 193 | 135 not in catalog; no auth config found |
| `dropbox` | 111 | 174 | 1 | 0 | — |
| `elevenlabs` | 155 | 155 | 1 | 0 | — |
| `facebook` | 39 | 39 | 1 | 0 | — |
| `figma` | 37 | 52 | 3 | 10 | — |
| `freeagent` | 76 | 76 | 0 | 35 | no auth config found |
| `freshbooks` | 10 | 10 | 1 | 6 | — |
| `freshdesk` | 178 | 178 | 1 | 0 | — |
| `gmail` | 61 | 61 | 1 | 2 | — |
| `google-ads` | 9 | 0 | 0 | 0 | 9 not in catalog; no auth config found |
| `google-analytics` | 67 | 0 | 0 | 0 | 67 not in catalog; no auth config found |
| `google-calendar` | 44 | 0 | 0 | 0 | 44 not in catalog; no auth config found |
| `google-docs` | 33 | 0 | 0 | 0 | 33 not in catalog; no auth config found |
| `google-drive` | 76 | 0 | 0 | 0 | 76 not in catalog; no auth config found |
| `google-forms` | 10 | 0 | 0 | 0 | 10 not in catalog; no auth config found |
| `google-meet` | 15 | 0 | 0 | 0 | 15 not in catalog; no auth config found |
| `google-search-console` | 9 | 0 | 0 | 0 | 9 not in catalog; no auth config found |
| `google-sheets` | 40 | 0 | 0 | 0 | 40 not in catalog; no auth config found |
| `google-slides` | 7 | 0 | 0 | 0 | 7 not in catalog; no auth config found |
| `gumroad` | 7 | 7 | 1 | 0 | — |
| `highlevel` | 94 | 94 | 0 | 86 | no auth config found |
| `hubspot` | 224 | 200 | 1 | 121 | 32 not in catalog |
| `instagram` | 29 | 29 | 1 | 14 | — |
| `instantly` | 115 | 115 | 1 | 0 | — |
| `intercom` | 133 | 133 | 1 | 46 | — |
| `kit` | 42 | 42 | 1 | 13 | — |
| `klaviyo` | 225 | 200 | 0 | 189 | 25 not in catalog; no auth config found |
| `lemlist` | 54 | 54 | 1 | 0 | — |
| `linkedin` | 10 | 22 | 1 | 9 | — |
| `mailchimp` | 272 | 200 | 1 | 0 | 72 not in catalog |
| `mailerlite` | 86 | 86 | 1 | 0 | — |
| `meta-ads` | 50 | 0 | 0 | 0 | 50 not in catalog; no auth config found |
| `monday` | 121 | 121 | 1 | 0 | — |
| `motion` | 27 | 27 | 1 | 0 | — |
| `notion` | 45 | 45 | 1 | 0 | — |
| `omnisend` | 43 | 43 | 1 | 12 | — |
| `onedrive` | 60 | 0 | 0 | 0 | 60 not in catalog; no auth config found |
| `outlook` | 272 | 200 | 1 | 62 | 75 not in catalog |
| `pandadoc` | 14 | 14 | 1 | 0 | — |
| `phantombuster` | 53 | 53 | 1 | 0 | — |
| `postiz` | 9 | 0 | 0 | 0 | 9 not in catalog; no auth config found |
| `postmark` | 46 | 46 | 1 | 0 | — |
| `quickbooks` | 105 | 105 | 1 | 6 | — |
| `reddit-ads` | 83 | 0 | 0 | 0 | 83 not in catalog; no auth config found |
| `replicate` | 31 | 31 | 1 | 0 | — |
| `resend` | 62 | 62 | 1 | 0 | — |
| `salesforce` | 179 | 179 | 1 | 119 | — |
| `semrush` | 37 | 37 | 1 | 0 | — |
| `sendgrid` | 359 | 200 | 1 | 0 | 159 not in catalog |
| `shopify` | 361 | 200 | 1 | 119 | 161 not in catalog |
| `slack` | 145 | 145 | 1 | 51 | — |
| `snapchat` | 139 | 139 | 0 | 137 | no auth config found |
| `stripe` | 415 | 200 | 0 | 131 | 215 not in catalog; no auth config found |
| `tiktok` | 10 | 10 | 0 | 7 | no auth config found |
| `trello` | 322 | 200 | 1 | 0 | 122 not in catalog |
| `twilio` | 0 | 0 | 0 | 0 | no auth config found |
| `twitter` | 78 | 78 | 1 | 1 | — |
| `webflow` | 51 | 51 | 0 | 30 | no auth config found |
| `xero` | 41 | 41 | 1 | 21 | — |
| `youtube` | 47 | 47 | 1 | 0 | — |
| `zendesk` | 452 | 200 | 1 | 99 | 252 not in catalog |
| `zoho-books` | 265 | 0 | 0 | 0 | 265 not in catalog; no auth config found |
| `zoom` | 51 | 89 | 1 | 50 | — |

## Per-integration detail

### `activecampaign`

Manifest: `src/generated/composio-manifests/activecampaign.generated.ts`

No Composio auth_config found for toolkit `activecampaign`. Tools cannot be audited until an auth config exists.

### `ahrefs`

Manifest: `src/generated/composio-manifests/ahrefs.generated.ts`

Auth configs (most-used first):
- `ac_ItWzHypFxUyt` "ahrefs-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_ItWzHypFxUyt` (0 scopes).

Status: 40 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `airtable`

Manifest: `src/generated/composio-manifests/airtable.generated.ts`

Auth configs (most-used first):
- `ac_fPStdpu7RjqJ` "airtable-clawlink" — Managed, 2 connections, 7 scopes

Audited against primary auth config `ac_fPStdpu7RjqJ` (7 scopes).

Status: 22 ok, 0 scope_gap, 1 no_scopes_declared, 0 not_in_catalog

**No scopes declared in metadata** (1 tools — verify with a real call before assuming OK):

- `AIRTABLE_GET_USER_INFO`

### `apollo`

Manifest: `src/generated/composio-manifests/apollo.generated.ts`

Auth configs (most-used first):
- `ac_cDyLdMYZKclS` "apollo-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_cDyLdMYZKclS` (0 scopes).

Status: 48 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `asana`

Manifest: `src/generated/composio-manifests/asana.generated.ts`

Auth configs (most-used first):
- `ac_naeG5JAzTsXb` "asana-clawlink" — Managed, 0 connections, 0 scopes

Audited against primary auth config `ac_naeG5JAzTsXb` (0 scopes).

Status: 153 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `bamboohr`

Manifest: `src/generated/composio-manifests/bamboohr.generated.ts`

No Composio auth_config found for toolkit `bamboohr`. Tools cannot be audited until an auth config exists.

### `bitbucket`

Manifest: `src/generated/composio-manifests/bitbucket.generated.ts`

Auth configs (most-used first):
- `ac_7EPMncK_FDvT` "bitbucket-clawlink" — Managed, 1 connections, 13 scopes

Audited against primary auth config `ac_7EPMncK_FDvT` (13 scopes).

Status: 13 ok, 86 scope_gap, 6 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `BITBUCKET_APPROVE_PULL_REQUEST` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_BROWSE_REPOSITORY_PATH` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_CREATE_BRANCH` | `repository:write` | composio_managed_scope_gap |
| `BITBUCKET_CREATE_PULL_REQUEST_COMMENT` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_CREATE_REPOSITORIES_COMMIT_REPORTS_ANNOTATIONS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_CREATE_REPOSITORIES_COMMITS2` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_CREATE_SNIPPET_COMMENT` | `snippet` | composio_managed_scope_gap |
| `BITBUCKET_DELETE_COMMIT_COMMENT` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_DELETE_PULL_REQUEST_COMMENT` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_DELETE_REPOSITORIES_COMMIT_REPORTS_ANNOTATIONS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_DELETE_SNIPPETS_WATCH` | `snippet` | composio_managed_scope_gap |
| `BITBUCKET_GET_BRANCH` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_COMMIT_BUILD_STATUS` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_COMMIT_CHANGES` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_COMMIT_COMMENT` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_COMMIT_DIFF` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_CURRENT_USER2` | `account` | composio_managed_scope_gap |
| `BITBUCKET_GET_DEPLOYMENT_ENVIRONMENT_VARIABLES` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_GET_FILE_FROM_REPOSITORY` | `read` | composio_managed_scope_gap |
| `BITBUCKET_GET_PULL_REQUEST` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_PULL_REQUEST_COMMENT` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_PULL_REQUEST_COMMITS` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_PULL_REQUEST_DIFF` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_PULL_REQUEST_DIFFSTAT` | `pullrequest`, `read:pullrequest:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_BRANCHING_MODEL` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT_COMMENTS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT_REPORT` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT_REPORTS` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT_REPORTS_ANNOTATIONS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_COMMIT_STATUSES` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_EFFECTIVE_BRANCHING_MODEL` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_ENVIRONMENTS2` | `pipeline`, `read:pipeline:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_FILEHISTORY` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_ISSUES_VOTE` | `issue` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_MERGE_BASE` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_CONFIG_CACHES` | `pipeline`, `read:pipeline:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_CONFIG_RUNNERS` | `runner` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_CONFIG_SCHEDULES` | `pipeline`, `read:pipeline:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_CONFIG_SSH_KNOWN_HOSTS` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_CONFIG_VARIABLES` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES_STEPS` | `pipeline`, `read:pipeline:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PIPELINES2` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PULLREQUESTS_ACTIVITY` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PULLREQUESTS_COMMENTS` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_PULLREQUESTS_STATUSES` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_REFS` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_REFS_TAGS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_SRC` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORIES_WATCHERS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORY` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_REPOSITORY_PATCH` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_SNIPPET` | `snippet` | composio_managed_scope_gap |
| `BITBUCKET_GET_SNIPPETS_WATCH` | `snippet` | composio_managed_scope_gap |
| `BITBUCKET_GET_SSH_LATEST_KEYS` | `account` | composio_managed_scope_gap |
| `BITBUCKET_GET_USER_EMAILS` | `email`, `account` | composio_managed_scope_gap |
| `BITBUCKET_GET_USER_EMAILS2` | `email` | composio_managed_scope_gap |
| `BITBUCKET_GET_USER_PERMISSIONS_REPOSITORIES` | `account`, `repository` | composio_managed_scope_gap |
| `BITBUCKET_GET_USER_PERMISSIONS_WORKSPACES` | `account` | composio_managed_scope_gap |
| `BITBUCKET_GET_USER_WORKSPACES` | `account`, `read:workspace:bitbucket`, `read:user:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_GET_WORKSPACES_PULLREQUESTS` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_GET_WORKSPACES_SEARCH_CODE` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_LIST_BRANCHES` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_COMMITS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_COMMITS_FROM_REVISION` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_COMMITS_ON_MASTER` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_DEPLOYMENTS` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_LIST_ISSUES` | `issue`, `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_PIPELINES` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_LIST_PULL_REQUEST_TASKS` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_LIST_PULL_REQUESTS` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_LIST_REPOSITORIES` | `repository`, `read:repository:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_LIST_REPOSITORIES_ENVIRONMENTS` | `pipeline` | composio_managed_scope_gap |
| `BITBUCKET_LIST_REPOSITORIES_IN_WORKSPACE` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_REPOSITORY_PATHS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_SNIPPETS` | `snippet` | composio_managed_scope_gap |
| `BITBUCKET_LIST_TAGS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_LIST_VERSIONS` | `issue` | composio_managed_scope_gap |
| `BITBUCKET_LIST_WORKSPACE_MEMBERS` | `read:workspace` | composio_managed_scope_gap |
| `BITBUCKET_LIST_WORKSPACE_PROJECTS` | `project` | composio_managed_scope_gap |
| `BITBUCKET_MERGE_PULL_REQUEST` | `read:pullrequest:bitbucket`, `write:pullrequest:bitbucket` | composio_managed_scope_gap |
| `BITBUCKET_RESOLVE_PULL_REQUEST_COMMENT` | `pullrequest` | composio_managed_scope_gap |
| `BITBUCKET_SEARCH_USER_REPOSITORIES_CODE` | `repository`, `project` | composio_managed_scope_gap |
| `BITBUCKET_UPDATE_INSIGHTS_PROJECTS_REPOS_COMMITS_REPORTS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_UPDATE_REPOSITORIES_COMMIT_COMMENTS` | `repository` | composio_managed_scope_gap |
| `BITBUCKET_UPDATE_REPOSITORIES_COMMIT_REPORTS_ANNOTATIONS` | `repository` | composio_managed_scope_gap |

**No scopes declared in metadata** (6 tools — verify with a real call before assuming OK):

- `BITBUCKET_CREATE_REPOSITORY`
- `BITBUCKET_GET_HOOK_EVENTS`
- `BITBUCKET_GET_OPENID_CONFIGURATION`
- `BITBUCKET_GET_USER`
- `BITBUCKET_GET_WORKSPACE`
- `BITBUCKET_LIST_WORKSPACES`

### `box`

Manifest: `src/generated/composio-manifests/box.generated.ts`

Auth configs (most-used first):
- `ac_yUx5AwW7ALG4` "box-clawlink" — Managed, 1 connections, 0 scopes

Audited against primary auth config `ac_yUx5AwW7ALG4` (0 scopes).

Status: 200 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `brevo`

Manifest: `src/generated/composio-manifests/brevo.generated.ts`

No Composio auth_config found for toolkit `brevo`. Tools cannot be audited until an auth config exists.

### `calendly`

Manifest: `src/generated/composio-manifests/calendly.generated.ts`

Auth configs (most-used first):
- `ac_lJZ2jSuZRjJr` "calendly-clawlink" — Managed, 1 connections, 0 scopes

Audited against primary auth config `ac_lJZ2jSuZRjJr` (0 scopes).

Status: 51 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `canva`

Manifest: `src/generated/composio-manifests/canva.generated.ts`

Auth configs (most-used first):
- `ac_5aVm70GBulBw` "canva-clawlink" — Managed, 4 connections, 18 scopes

Audited against primary auth config `ac_5aVm70GBulBw` (18 scopes).

Status: 39 ok, 1 scope_gap, 6 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `CANVA_GET_DESIGN_EXPORT_JOB_RESULT` | `design:read` | composio_managed_scope_gap |

**No scopes declared in metadata** (6 tools — verify with a real call before assuming OK):

- `CANVA_EXCHANGE_OAUTH20_ACCESS_OR_REFRESH_TOKEN`
- `CANVA_FETCH_CANVA_CONNECT_SIGNING_PUBLIC_KEYS`
- `CANVA_FETCH_CURRENT_USER_DETAILS`
- `CANVA_RETRIEVE_APP_PUBLIC_KEY_SET`
- `CANVA_REVOKE_OAUTH_TOKENS`
- `CANVA_VALIDATE_OAUTH_TOKEN_PROPERTIES`

### `clickup`

Manifest: `src/generated/composio-manifests/clickup.generated.ts`

Auth configs (most-used first):
- `ac_VDh7hg-_y9kk` "clickup-clawlink" — Managed, 5 connections, 0 scopes

Audited against primary auth config `ac_VDh7hg-_y9kk` (0 scopes).

Status: 161 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `dataforseo`

Manifest: `src/generated/composio-manifests/dataforseo.generated.ts`

Auth configs (most-used first):
- `ac_Y_VF8HCFpbb_` "dataforseo-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_Y_VF8HCFpbb_` (0 scopes).

Status: 200 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `docusign`

Manifest: `src/generated/composio-manifests/docusign.generated.ts`

No Composio auth_config found for toolkit `docusign`. Tools cannot be audited until an auth config exists.

### `dropbox`

Manifest: `src/generated/composio-manifests/dropbox.generated.ts`

Auth configs (most-used first):
- `ac_fJxHgS6kBTDS` "dropbox-clawlink" — Managed, 1 connections, 15 scopes

Audited against primary auth config `ac_fJxHgS6kBTDS` (15 scopes).

Status: 109 ok, 0 scope_gap, 2 no_scopes_declared, 0 not_in_catalog

**No scopes declared in metadata** (2 tools — verify with a real call before assuming OK):

- `DROPBOX_GET_JWKS`
- `DROPBOX_GET_OPENID_CONFIG`

### `elevenlabs`

Manifest: `src/generated/composio-manifests/elevenlabs.generated.ts`

Auth configs (most-used first):
- `ac_IwjGCBNaY-ij` "elevenlabs-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_IwjGCBNaY-ij` (0 scopes).

Status: 155 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `facebook`

Manifest: `src/generated/composio-manifests/facebook.generated.ts`

Auth configs (most-used first):
- `ac_rrK7_9ggxQP7` "facebook-clawlink" — Managed, 7 connections, 11 scopes

Audited against primary auth config `ac_rrK7_9ggxQP7` (11 scopes).

Status: 39 ok, 0 scope_gap, 0 no_scopes_declared, 0 not_in_catalog

### `figma`

Manifest: `src/generated/composio-manifests/figma.generated.ts`

Auth configs (most-used first):
- `ac_2Ktp_uQWykTF` "figma-clawlink" — Managed, 8 connections, 12 scopes
- `ac_UwX1J25mLjT9` "auth_config_figma_1778242293055" — Managed, 1 connections, scopes not fetched (non-primary)
- `ac_MoLFt3rAyr_t` "figma-clawlink" — Managed, 0 connections, scopes not fetched (non-primary)

Audited against primary auth config `ac_2Ktp_uQWykTF` (12 scopes).

Status: 24 ok, 10 scope_gap, 3 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `FIGMA_EXTRACT_DESIGN_TOKENS` | `file_read`, `file_variables:read` | possibly_stale_metadata, likely_provider_tier_gate |
| `FIGMA_EXTRACT_PROTOTYPE_INTERACTIONS` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_COMMENTS_IN_A_FILE` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_COMPONENT_SET` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_FILE_STYLES` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_FILES_IN_A_PROJECT` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_IMAGE_FILLS` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_STYLE` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_TEAM_COMPONENTS` | `files:read` | possibly_stale_metadata |
| `FIGMA_GET_TEAM_STYLES` | `files:read` | possibly_stale_metadata |

**No scopes declared in metadata** (3 tools — verify with a real call before assuming OK):

- `FIGMA_DESIGN_TOKENS_TO_TAILWIND`
- `FIGMA_GET_CURRENT_USER`
- `FIGMA_GET_SCIM_SERVICE_PROVIDER_CONFIG`

### `freeagent`

Manifest: `src/generated/composio-manifests/freeagent.generated.ts`

No Composio auth_config found for toolkit `freeagent`. Tools cannot be audited until an auth config exists.

### `freshbooks`

Manifest: `src/generated/composio-manifests/freshbooks.generated.ts`

Auth configs (most-used first):
- `ac_QG4L5FVyPr4q` "freshbooks-clawlink" — Managed, 1 connections, 3 scopes

Audited against primary auth config `ac_QG4L5FVyPr4q` (3 scopes).

Status: 3 ok, 6 scope_gap, 1 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `FRESHBOOKS_CREATE_WEBHOOK` | `user:notifications:write` | composio_managed_scope_gap |
| `FRESHBOOKS_DELETE_WEBHOOK` | `user:notifications:write` | composio_managed_scope_gap |
| `FRESHBOOKS_LIST_BUSINESSES` | `user:businesses:read` | composio_managed_scope_gap |
| `FRESHBOOKS_LIST_JOURNAL_ENTRIES2` | `user:journal_entries:read` | composio_managed_scope_gap |
| `FRESHBOOKS_LIST_WEBHOOKS` | `user:notifications:read` | composio_managed_scope_gap |
| `FRESHBOOKS_UPDATE_WEBHOOK` | `user:notifications:write` | composio_managed_scope_gap |

**No scopes declared in metadata** (1 tools — verify with a real call before assuming OK):

- `FRESHBOOKS_REGISTER_AS_A_NEW_USER`

### `freshdesk`

Manifest: `src/generated/composio-manifests/freshdesk.generated.ts`

Auth configs (most-used first):
- `ac_HcVU7S27X246` "freshdesk-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_HcVU7S27X246` (0 scopes).

Status: 178 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `gmail`

Manifest: `src/generated/composio-manifests/gmail.generated.ts`

Auth configs (most-used first):
- `ac_T2phpv5hfYLZ` "gmail-clawlink" — Managed, 9 connections, 11 scopes

Audited against primary auth config `ac_T2phpv5hfYLZ` (21 scopes).

Status: 57 ok, 2 scope_gap, 2 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `GMAIL_GET_CONTACTS` | `https://www.googleapis.com/auth/contacts` | composio_managed_scope_gap |
| `GMAIL_SEARCH_PEOPLE` | `https://www.googleapis.com/auth/contacts` | composio_managed_scope_gap |

**No scopes declared in metadata** (2 tools — verify with a real call before assuming OK):

- `GMAIL_CREATE_PROMPT_POST`
- `GMAIL_UPDATE_USER_ATTRIBUTES_VALUES`

### `google-ads`

Manifest: `src/generated/composio-manifests/google-ads.generated.ts`

No Composio auth_config found for toolkit `google-ads`. Tools cannot be audited until an auth config exists.

### `google-analytics`

Manifest: `src/generated/composio-manifests/google-analytics.generated.ts`

No Composio auth_config found for toolkit `google-analytics`. Tools cannot be audited until an auth config exists.

### `google-calendar`

Manifest: `src/generated/composio-manifests/google-calendar.generated.ts`

No Composio auth_config found for toolkit `google-calendar`. Tools cannot be audited until an auth config exists.

### `google-docs`

Manifest: `src/generated/composio-manifests/google-docs.generated.ts`

No Composio auth_config found for toolkit `google-docs`. Tools cannot be audited until an auth config exists.

### `google-drive`

Manifest: `src/generated/composio-manifests/google-drive.generated.ts`

No Composio auth_config found for toolkit `google-drive`. Tools cannot be audited until an auth config exists.

### `google-forms`

Manifest: `src/generated/composio-manifests/google-forms.generated.ts`

No Composio auth_config found for toolkit `google-forms`. Tools cannot be audited until an auth config exists.

### `google-meet`

Manifest: `src/generated/composio-manifests/google-meet.generated.ts`

No Composio auth_config found for toolkit `google-meet`. Tools cannot be audited until an auth config exists.

### `google-search-console`

Manifest: `src/generated/composio-manifests/google-search-console.generated.ts`

No Composio auth_config found for toolkit `google-search-console`. Tools cannot be audited until an auth config exists.

### `google-sheets`

Manifest: `src/generated/composio-manifests/google-sheets.generated.ts`

No Composio auth_config found for toolkit `google-sheets`. Tools cannot be audited until an auth config exists.

### `google-slides`

Manifest: `src/generated/composio-manifests/google-slides.generated.ts`

No Composio auth_config found for toolkit `google-slides`. Tools cannot be audited until an auth config exists.

### `gumroad`

Manifest: `src/generated/composio-manifests/gumroad.generated.ts`

Auth configs (most-used first):
- `ac_T5SbTYpJSUs_` "gumroad-clawlink" — Managed, 1 connections, 4 scopes

Audited against primary auth config `ac_T5SbTYpJSUs_` (4 scopes).

Status: 5 ok, 0 scope_gap, 2 no_scopes_declared, 0 not_in_catalog

**No scopes declared in metadata** (2 tools — verify with a real call before assuming OK):

- `GUMROAD_UNSUBSCRIBE_FROM_RESOURCE`
- `GUMROAD_VERIFY_LICENSE`

### `highlevel`

Manifest: `src/generated/composio-manifests/highlevel.generated.ts`

No Composio auth_config found for toolkit `highlevel`. Tools cannot be audited until an auth config exists.

### `hubspot`

Manifest: `src/generated/composio-manifests/hubspot.generated.ts`

Auth configs (most-used first):
- `ac_eW238hW-IAFx` "hubspot-clawlink" — Managed, 4 connections, 33 scopes

Audited against primary auth config `ac_eW238hW-IAFx` (33 scopes).

Status: 68 ok, 121 scope_gap, 3 no_scopes_declared, 32 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `HUBSPOT_ADD_ASSET_ASSOCIATION` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_BATCH_OF_LINE_ITEMS` | `crm.objects.line_items.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_BATCH_OF_OBJECTS` | `crm.objects.{objectType}.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_BATCH_OF_PROPERTIES` | `crm.schemas.invoices.write`, `crm.schemas.orders.write`, `crm.schemas.commercepayments.write`, `crm.objects.orders.write`, `tickets.sensitive.v2`, `crm.schemas.appointments.write`, `crm.schemas.courses.write`, `crm.schemas.carts.write`, `tickets.highly_sensitive.v2`, `crm.schemas.services.write`, `crm.schemas.deals.write`, `crm.pipelines.orders.write`, `crm.objects.users.write`, `crm.schemas.subscriptions.write`, `crm.schemas.listings.write`, `crm.objects.carts.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_CONTACT` | `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_CRM_OBJECT_BY_ID` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_EMAIL` | `crm.objects.emails.read` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_EMAILS` | `crm.objects.emails.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_FEEDBACK_SUBMISSION` | `crm.objects.feedback_submissions.read` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_LINE_ITEM` | `crm.objects.line_items.read`, `crm.objects.line_items.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_PRODUCT` | `crm.objects.products.read`, `crm.objects.products.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_PRODUCTS` | `crm.objects.products.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_PROPERTY_BY_OBJECT_TYPE_AND_NAME` | `crm.schemas.invoices.write`, `crm.schemas.orders.write`, `crm.schemas.commercepayments.write`, `crm.objects.orders.write`, `tickets.sensitive.v2`, `crm.schemas.appointments.write`, `crm.schemas.courses.write`, `crm.schemas.carts.write`, `tickets.highly_sensitive.v2`, `crm.schemas.services.write`, `crm.schemas.deals.write`, `crm.pipelines.orders.write`, `crm.objects.users.write`, `crm.schemas.subscriptions.write`, `crm.schemas.listings.write`, `crm.objects.carts.write` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_PROPERTY_GROUP` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.schemas.listings.read`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.schemas.carts.read`, `automation`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.schemas.appointments.read`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.schemas.courses.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.schemas.commercepayments.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.write.v2`, `crm.schemas.quotes.read`, `crm.objects.custom.sensitive.write.v2`, `crm.schemas.services.read`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.schemas.subscriptions.read`, `crm.schemas.line_items.read`, `crm.objects.services.write`, `crm.objects.subscriptions.write`, `crm.objects.products.write`, `crm.objects.feedback_submissions.read`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `crm.schemas.deals.read`, `crm.schemas.orders.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.goals.read`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.courses.read`, `crm.pipelines.orders.read`, `crm.schemas.invoices.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_QUOTE` | `crm.objects.line_items.write`, `crm.objects.line_items.read`, `crm.schemas.quotes.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_TICKET` | `tickets.sensitive` | composio_managed_scope_gap |
| `HUBSPOT_ARCHIVE_TICKETS` | `tickets.sensitive.v2`, `tickets.highly_sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_AUDIT_PIPELINE_CHANGES` | `crm.pipelines.read` | composio_managed_scope_gap |
| `HUBSPOT_BATCH_UPDATE_QUOTES` | `crm.objects.line_items.write`, `crm.objects.line_items.read`, `crm.schemas.quote.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_CONFIGURE_CALLING_EXTENSION_SETTINGS` | `contacts` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_AND_RETURN_A_NEW_PROPERTY_GROUP` | `crm.schemas.{objectType}.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_ASSOCIATION` | `crm.schemas.custom.write`, `crm.objects.custom.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_BATCH_OF_FEEDBACK_SUBMISSIONS` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_BATCH_OF_OBJECTS` | `crm.objects.create` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_BATCH_OF_PROPERTIES` | `crm.schemas.invoices.write`, `crm.schemas.orders.write`, `crm.schemas.commercepayments.write`, `crm.objects.orders.write`, `tickets.sensitive.v2`, `crm.schemas.appointments.write`, `crm.schemas.courses.write`, `crm.schemas.carts.write`, `tickets.highly_sensitive.v2`, `crm.schemas.services.write`, `crm.schemas.deals.write`, `crm.pipelines.orders.write`, `crm.objects.users.write`, `crm.schemas.subscriptions.write`, `crm.schemas.listings.write`, `crm.objects.carts.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_BATCH_OF_QUOTES` | `crm.objects.line_items.write`, `crm.objects.line_items.read`, `crm.schemas.quote.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_CAMPAIGN` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_CAMPAIGNS` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_CRM_OBJECT_FROM_NL` | `automation`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.appointments.sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.calls.read`, `crm.objects.carts.read`, `crm.objects.commercepayments.write`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.courses.read`, `crm.objects.courses.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.custom.write`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.emails.read`, `crm.objects.feedback_submissions.read`, `crm.objects.goals.read`, `crm.objects.goals.write`, `crm.objects.invoices.read`, `crm.objects.invoices.write`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.objects.listings.read`, `crm.objects.listings.write`, `crm.objects.meetings.read`, `crm.objects.notes.read`, `crm.objects.orders.read`, `crm.objects.products.write`, `crm.objects.projects.highly_sensitive.read`, `crm.objects.projects.highly_sensitive.write`, `crm.objects.projects.read`, `crm.objects.projects.sensitive.read`, `crm.objects.projects.sensitive.write`, `crm.objects.projects.write`, `crm.objects.services.read`, `crm.objects.services.write`, `crm.objects.subscriptions.read`, `crm.objects.subscriptions.write`, `crm.objects.tasks.read`, `crm.objects.users.read`, `crm.pipelines.orders.read`, `crm.schemas.appointments.read`, `crm.schemas.calls.read`, `crm.schemas.carts.read`, `crm.schemas.commercepayments.read`, `crm.schemas.courses.read`, `crm.schemas.deals.read`, `crm.schemas.emails.read`, `crm.schemas.invoices.read`, `crm.schemas.line_items.read`, `crm.schemas.listings.read`, `crm.schemas.meetings.read`, `crm.schemas.notes.read`, `crm.schemas.orders.read`, `crm.schemas.projects.read`, `crm.schemas.quotes.read`, `crm.schemas.services.read`, `crm.schemas.subscriptions.read`, `crm.schemas.tasks.read`, `media_bridge.read`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_CRM_OBJECT_WITH_PROPERTIES` | `crm.objects.{objectType}.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_DEAL_FROM_NL` | `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_EMAIL` | `crm.objects.emails.read`, `crm.objects.emails.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_EMAILS` | `crm.objects.emails.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_FEEDBACK_SUBMISSION` | `crm.objects.feedback_submissions.read` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_LINE_ITEM` | `crm.objects.line_items.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_OBJECT_ASSOCIATION` | `crm.objects.tickets.write`, `crm.objects.custom.write`, `crm.objects.appointments.write`, `crm.objects.carts.write`, `crm.objects.leads.write`, `crm.objects.line_items.write`, `crm.objects.orders.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_OBJECT_SCHEMA` | `crm.schemas.custom.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_OR_UPDATE_DRAFT_VERSION` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_PIPELINE` | `crm.objects.carts.write`, `crm.objects.orders.write`, `crm.objects.users.write`, `crm.pipelines.orders.write`, `crm.schemas.appointments.write`, `crm.schemas.carts.write`, `crm.schemas.commercepayments.write`, `crm.schemas.courses.write`, `crm.schemas.custom.write`, `crm.schemas.deals.write`, `crm.schemas.invoices.write`, `crm.schemas.listings.write`, `crm.schemas.orders.write`, `crm.schemas.projects.write`, `crm.schemas.quotes.write`, `crm.schemas.services.write`, `crm.schemas.subscriptions.write`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_PIPELINE_STAGE` | `crm.schemas.pipelines.read`, `crm.schemas.pipelines.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_PRODUCT` | `crm.objects.products.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_PRODUCTS` | `crm.objects.products.write` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_PROPERTY_FOR_SPECIFIED_OBJECT_TYPE` | `crm.objects.carts.write`, `crm.objects.orders.write`, `crm.objects.users.write`, `crm.pipelines.orders.write`, `crm.schemas.appointments.write`, `crm.schemas.carts.write`, `crm.schemas.commercepayments.write`, `crm.schemas.courses.write`, `crm.schemas.custom.write`, `crm.schemas.deals.write`, `crm.schemas.invoices.write`, `crm.schemas.listings.write`, `crm.schemas.orders.write`, `crm.schemas.projects.write`, `crm.schemas.quotes.write`, `crm.schemas.services.write`, `crm.schemas.subscriptions.write`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_QUOTE_OBJECT` | `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.schemas.quotes.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_CREATE_WORKFLOW` | `automation`, `crm.objects.contacts.sensitive.write`, `crm.objects.companies.sensitive.write`, `crm.objects.deals.sensitive.write`, `crm.objects.custom.sensitive.write` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_CALLING_EXTENSION_SETTINGS` | `contacts` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_CAMPAIGN` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_CAMPAIGNS_BATCH` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_CONTACT_GDPR` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_LINE_ITEMS_GDPR` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_MARKETING_EMAIL` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_PIPELINE` | `crm.objects.carts.write`, `crm.objects.orders.write`, `crm.objects.users.write`, `crm.pipelines.orders.write`, `crm.schemas.appointments.write`, `crm.schemas.carts.write`, `crm.schemas.commercepayments.write`, `crm.schemas.courses.write`, `crm.schemas.custom.write`, `crm.schemas.deals.write`, `crm.schemas.invoices.write`, `crm.schemas.listings.write`, `crm.schemas.orders.write`, `crm.schemas.projects.write`, `crm.schemas.quotes.write`, `crm.schemas.services.write`, `crm.schemas.subscriptions.write`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_PIPELINE_STAGE` | `crm.schemas.quotes.write`, `crm.schemas.deals.write`, `crm.objects.users.write`, `crm.schemas.custom.write`, `crm.schemas.subscriptions.write`, `crm.objects.carts.write`, `crm.schemas.invoices.write`, `crm.schemas.orders.write`, `crm.schemas.commercepayments.write`, `crm.objects.orders.write`, `tickets.sensitive.v2`, `crm.schemas.appointments.write`, `crm.schemas.courses.write`, `crm.schemas.carts.write`, `tickets.highly_sensitive.v2`, `crm.schemas.services.write`, `crm.pipelines.orders.write`, `crm.schemas.listings.write`, `crm.schemas.projects.write` | composio_managed_scope_gap |
| `HUBSPOT_DELETE_WORKFLOW` | `automation` | composio_managed_scope_gap |
| `HUBSPOT_GET_ALL_MARKETING_EMAILS_FOR_A_HUB_SPOT_ACCOUNT` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_GET_CONTACT_IDS` | `marketing.campaigns.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_EMAILS` | `crm.objects.emails.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_MARKETING_EMAIL_DRAFT` | `marketing-email` | composio_managed_scope_gap |
| `HUBSPOT_GET_MARKETING_EMAIL_REVISIONS` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_GET_PIPELINE_BY_ID` | `crm.objects.tickets.read`, `crm.schemas.deals.read`, `crm.schemas.tickets.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_PIPELINE_STAGE_AUDIT` | `crm.pipelines.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_PRODUCT` | `crm.objects.products.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_QUOTE` | `crm.schemas.quotes.read` | composio_managed_scope_gap |
| `HUBSPOT_GET_THE_DETAILS_OF_A_SPECIFIED_MARKETING_EMAIL` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_GET_TICKET` | `tickets.sensitive.v2`, `tickets.highly_sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_GET_TICKETS` | `tickets.sensitive.v2`, `tickets.highly_sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_GET_WORKFLOW_BY_ID` | `automation` | composio_managed_scope_gap |
| `HUBSPOT_GET_WORKFLOWS` | `automation`, `crm.objects.contacts.sensitive.read`, `crm.objects.companies.sensitive.read`, `crm.objects.deals.sensitive.read`, `crm.objects.custom.sensitive.read`, `crm.objects.contacts.sensitive.write`, `crm.objects.companies.sensitive.write`, `crm.objects.deals.sensitive.write`, `crm.objects.custom.sensitive.write` | composio_managed_scope_gap |
| `HUBSPOT_LIST_ASSETS` | `marketing.campaigns.read` | composio_managed_scope_gap |
| `HUBSPOT_LIST_ASSOCIATION_TYPES` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_LIST_EMAILS` | `crm.objects.emails.read`, `crm.objects.emails.write` | composio_managed_scope_gap |
| `HUBSPOT_LIST_EVENT_TEMPLATES` | `developers-read`, `developers-write` | composio_managed_scope_gap |
| `HUBSPOT_LIST_OBJECT_ASSOCIATIONS` | `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.appointments.sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.calls.read`, `crm.objects.carts.read`, `crm.objects.carts.write`, `crm.objects.commercepayments.read`, `crm.objects.commercepayments.write`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.courses.read`, `crm.objects.courses.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.custom.write`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.emails.read`, `crm.objects.goals.read`, `crm.objects.goals.write`, `crm.objects.invoices.read`, `crm.objects.invoices.write`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.objects.listings.read`, `crm.objects.listings.write`, `crm.objects.meetings.read`, `crm.objects.notes.read`, `crm.objects.orders.read`, `crm.objects.orders.write`, `crm.objects.partner-clients.read`, `crm.objects.partner-clients.write`, `crm.objects.partner-services.read`, `crm.objects.partner-services.write`, `crm.objects.products.read`, `crm.objects.products.write`, `crm.objects.projects.highly_sensitive.read`, `crm.objects.projects.highly_sensitive.write`, `crm.objects.projects.read`, `crm.objects.projects.sensitive.read`, `crm.objects.projects.sensitive.write`, `crm.objects.projects.write`, `crm.objects.services.read`, `crm.objects.services.write`, `crm.objects.subscriptions.read`, `crm.objects.subscriptions.write`, `crm.objects.tasks.read`, `crm.objects.users.read`, `crm.objects.users.write`, `media_bridge.read`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_LIST_QUOTES` | `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.schemas.quotes.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_EMAILS` | `crm.objects.emails.write` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_FEEDBACK_SUBMISSIONS` | `crm.objects.feedback_submissions.write` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_LINE_ITEMS` | `crm.objects.line_items.write` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_OBJECTS` | `crm.objects.{objectType}.write` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_QUOTES` | `crm.objects.line_items.write`, `crm.objects.line_items.read`, `crm.schemas.quote.read`, `crm.schemas.line_items.read`, `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_MERGE_TICKETS` | `crm.objects.tickets.write`, `crm.objects.tickets.read` | composio_managed_scope_gap |
| `HUBSPOT_PARTIALLY_UPDATE_CRM_OBJECT_BY_ID` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_PERMANENTLY_DELETE_CONTACT_VIA_GDPR` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_PUBLISH_MARKETING_EMAIL` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_READ_A_CRM_PROPERTY_BY_NAME` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.schemas.listings.read`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.schemas.carts.read`, `automation`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.schemas.appointments.read`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.schemas.courses.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.schemas.commercepayments.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.schemas.quotes.read`, `crm.objects.custom.sensitive.write.v2`, `crm.schemas.services.read`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.schemas.subscriptions.read`, `crm.schemas.line_items.read`, `crm.objects.services.write`, `crm.objects.subscriptions.write`, `crm.objects.products.write`, `crm.objects.feedback_submissions.read`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `crm.schemas.deals.read`, `crm.schemas.orders.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.courses.read`, `crm.pipelines.orders.read`, `crm.schemas.invoices.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_ALL_PROPERTIES_FOR_OBJECT_TYPE` | `automation`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.appointments.sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.calls.read`, `crm.objects.carts.read`, `crm.objects.commercepayments.write`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.courses.read`, `crm.objects.courses.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.custom.write`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.emails.read`, `crm.objects.feedback_submissions.read`, `crm.objects.goals.read`, `crm.objects.goals.write`, `crm.objects.invoices.read`, `crm.objects.invoices.write`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.objects.listings.read`, `crm.objects.listings.write`, `crm.objects.meetings.read`, `crm.objects.notes.read`, `crm.objects.orders.read`, `crm.objects.products.write`, `crm.objects.projects.highly_sensitive.read`, `crm.objects.projects.highly_sensitive.write`, `crm.objects.projects.read`, `crm.objects.projects.sensitive.read`, `crm.objects.projects.sensitive.write`, `crm.objects.projects.write`, `crm.objects.services.read`, `crm.objects.services.write`, `crm.objects.subscriptions.read`, `crm.objects.subscriptions.write`, `crm.objects.tasks.read`, `crm.objects.users.read`, `crm.pipelines.orders.read`, `crm.schemas.appointments.read`, `crm.schemas.calls.read`, `crm.schemas.carts.read`, `crm.schemas.commercepayments.read`, `crm.schemas.courses.read`, `crm.schemas.deals.read`, `crm.schemas.emails.read`, `crm.schemas.invoices.read`, `crm.schemas.line_items.read`, `crm.schemas.listings.read`, `crm.schemas.meetings.read`, `crm.schemas.notes.read`, `crm.schemas.orders.read`, `crm.schemas.projects.read`, `crm.schemas.quotes.read`, `crm.schemas.services.read`, `crm.schemas.subscriptions.read`, `crm.schemas.tasks.read`, `media_bridge.read`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_READ_APAGE_OF_OBJECTS_BY_TYPE` | `crm.objects.{objectType}.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_ASSOCIATIONS_BATCH` | `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.appointments.sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.calls.read`, `crm.objects.carts.read`, `crm.objects.carts.write`, `crm.objects.commercepayments.read`, `crm.objects.commercepayments.write`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.courses.read`, `crm.objects.courses.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.custom.write`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.emails.read`, `crm.objects.goals.read`, `crm.objects.goals.write`, `crm.objects.invoices.read`, `crm.objects.invoices.write`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.objects.listings.read`, `crm.objects.listings.write`, `crm.objects.meetings.read`, `crm.objects.notes.read`, `crm.objects.orders.read`, `crm.objects.orders.write`, `crm.objects.partner-clients.read`, `crm.objects.partner-clients.write`, `crm.objects.partner-services.read`, `crm.objects.partner-services.write`, `crm.objects.products.read`, `crm.objects.products.write`, `crm.objects.projects.highly_sensitive.read`, `crm.objects.projects.highly_sensitive.write`, `crm.objects.projects.read`, `crm.objects.projects.sensitive.read`, `crm.objects.projects.sensitive.write`, `crm.objects.projects.write`, `crm.objects.services.read`, `crm.objects.services.write`, `crm.objects.subscriptions.read`, `crm.objects.subscriptions.write`, `crm.objects.tasks.read`, `crm.objects.users.read`, `crm.objects.users.write`, `media_bridge.read`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_READ_BATCH_CRM_OBJECT_PROPERTIES` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.schemas.listings.read`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.schemas.carts.read`, `automation`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.schemas.appointments.read`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.schemas.courses.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.schemas.commercepayments.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.schemas.quotes.read`, `crm.objects.custom.sensitive.write.v2`, `crm.schemas.services.read`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.schemas.subscriptions.read`, `crm.schemas.line_items.read`, `crm.objects.services.write`, `crm.objects.subscriptions.write`, `crm.objects.products.write`, `crm.objects.feedback_submissions.read`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `crm.schemas.deals.read`, `crm.schemas.orders.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.courses.read`, `crm.pipelines.orders.read`, `crm.schemas.invoices.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_BATCH_FEEDBACK_SUBMISSIONS_BY_ID_OR_PROPERTY` | `crm.objects.feedback_submissions.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_BATCH_OF_CRM_OBJECTS_BY_ID_OR_PROPERTY_VALUES` | `crm.objects.{objectType}.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_BATCH_OF_LINE_ITEMS_BY_ID_OR_PROPERTY_VALUES` | `crm.objects.line_items.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_BUDGET` | `marketing.campaigns.read`, `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_READ_CRM_OBJECT_BY_ID` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_EMAIL` | `crm.objects.emails.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_FEEDBACK_SUBMISSION_BY_ID` | `crm.objects.feedback_submissions.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_PROPERTY_GROUP` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.schemas.listings.read`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.schemas.carts.read`, `automation`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.schemas.appointments.read`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.schemas.courses.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.schemas.commercepayments.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.schemas.quotes.read`, `crm.objects.custom.sensitive.write.v2`, `crm.schemas.services.read`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.schemas.subscriptions.read`, `crm.schemas.line_items.read`, `crm.objects.services.write`, `crm.objects.subscriptions.write`, `crm.objects.products.write`, `crm.objects.feedback_submissions.read`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `crm.schemas.deals.read`, `crm.schemas.orders.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.courses.read`, `crm.pipelines.orders.read`, `crm.schemas.invoices.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_READ_PROPERTY_GROUPS_FOR_OBJECT_TYPE` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.schemas.listings.read`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.schemas.carts.read`, `automation`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.schemas.appointments.read`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.schemas.courses.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.schemas.commercepayments.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.schemas.quotes.read`, `crm.objects.custom.sensitive.write.v2`, `crm.schemas.services.read`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.schemas.subscriptions.read`, `crm.schemas.line_items.read`, `crm.objects.services.write`, `crm.objects.subscriptions.write`, `crm.objects.products.write`, `crm.objects.feedback_submissions.read`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `crm.schemas.deals.read`, `crm.schemas.orders.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.courses.read`, `crm.pipelines.orders.read`, `crm.schemas.invoices.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_REMOVE_ASSET_ASSOCIATION` | `marketing.campaigns.write` | composio_managed_scope_gap |
| `HUBSPOT_REMOVE_ASSOCIATION` | `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.appointments.sensitive.write.v2`, `crm.objects.appointments.write`, `crm.objects.calls.read`, `crm.objects.carts.read`, `crm.objects.carts.write`, `crm.objects.commercepayments.read`, `crm.objects.commercepayments.write`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.courses.read`, `crm.objects.courses.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.custom.write`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.emails.read`, `crm.objects.goals.read`, `crm.objects.goals.write`, `crm.objects.invoices.read`, `crm.objects.invoices.write`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.line_items.read`, `crm.objects.line_items.write`, `crm.objects.listings.read`, `crm.objects.listings.write`, `crm.objects.meetings.read`, `crm.objects.notes.read`, `crm.objects.orders.read`, `crm.objects.orders.write`, `crm.objects.partner-clients.read`, `crm.objects.partner-clients.write`, `crm.objects.partner-services.read`, `crm.objects.partner-services.write`, `crm.objects.products.read`, `crm.objects.products.write`, `crm.objects.projects.highly_sensitive.read`, `crm.objects.projects.highly_sensitive.write`, `crm.objects.projects.read`, `crm.objects.projects.sensitive.read`, `crm.objects.projects.sensitive.write`, `crm.objects.projects.write`, `crm.objects.services.read`, `crm.objects.services.write`, `crm.objects.subscriptions.read`, `crm.objects.subscriptions.write`, `crm.objects.tasks.read`, `crm.objects.users.read`, `crm.objects.users.write`, `media_bridge.read`, `tickets.highly_sensitive.v2`, `tickets.sensitive.v2` | composio_managed_scope_gap |
| `HUBSPOT_REMOVE_ASSOCIATION_FROM_SCHEMA` | `crm.schemas.deals.write`, `crm.schemas.quotes.write`, `crm.schemas.custom.write` | composio_managed_scope_gap |
| `HUBSPOT_RENDER_EVENT_DETAIL_TEMPLATE` | `event-detail-read`, `web-analytics-api-access` | composio_managed_scope_gap |
| `HUBSPOT_REPLACE_ALL_PROPERTIES_OF_PIPELINE` | `crm.schemas.pipelines.read`, `crm.schemas.pipelines.write` | composio_managed_scope_gap |
| `HUBSPOT_REPLACE_PIPELINE_STAGE_PROPERTIES` | `crm.pipelines.deals.write`, `crm.pipelines.tickets.write`, `crm.pipelines.custom.write` | composio_managed_scope_gap |
| `HUBSPOT_RESTORE_EMAIL_REVISION` | `marketing-email`, `transactional-email` | composio_managed_scope_gap |
| `HUBSPOT_RESTORE_MARKETING_EMAIL_REVISION` | `automation` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_ALL_OBJECT_SCHEMAS` | `crm.schemas.deals.read` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_ALL_PIPELINES_FOR_SPECIFIED_OBJECT_TYPE` | `crm.pipelines.read`, `crm.pipelines.write` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_CALLING_SETTINGS_FOR_APP` | `contacts` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_LINE_ITEM_BY_ID` | `crm.objects.line_items.read` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_LINE_ITEMS` | `crm.objects.line_items.read` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_OBJECT_SCHEMA` | `crm.schemas.{objectType}.read`, `crm.objects.{objectType}.read` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_PIPELINE_STAGE_BY_ID` | `crm.objects.tickets.read` | composio_managed_scope_gap |
| `HUBSPOT_RETRIEVE_PIPELINE_STAGES` | `crm.pipelines.read`, `crm.pipelines.write` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_CAMPAIGNS` | `marketing.campaigns.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA` | `crm.objects.orders.read`, `crm.objects.appointments.sensitive.read.v2`, `crm.objects.contacts.highly_sensitive.read.v2`, `crm.objects.custom.sensitive.read.v2`, `crm.objects.users.read`, `crm.objects.users.write`, `crm.objects.commercepayments.write`, `crm.objects.invoices.write`, `crm.objects.contacts.highly_sensitive.write.v2`, `crm.objects.carts.write`, `crm.objects.appointments.write`, `crm.objects.partner-services.read`, `crm.objects.custom.write`, `crm.objects.deals.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.write.v2`, `crm.objects.companies.highly_sensitive.write.v2`, `tickets.sensitive.v2`, `crm.objects.appointments.read`, `crm.objects.appointments.sensitive.write.v2`, `media_bridge.read`, `crm.objects.listings.read`, `crm.objects.courses.write`, `crm.objects.carts.read`, `crm.objects.listings.write`, `crm.objects.subscriptions.read`, `crm.objects.companies.sensitive.read.v2`, `crm.objects.custom.sensitive.write.v2`, `crm.objects.deals.highly_sensitive.read.v2`, `crm.objects.contacts.sensitive.write.v2`, `crm.objects.companies.highly_sensitive.read.v2`, `crm.objects.partner-services.write`, `crm.objects.services.write`, `crm.objects.orders.write`, `crm.objects.subscriptions.write`, `crm.objects.commercepayments.read`, `crm.objects.products.write`, `crm.objects.custom.highly_sensitive.read.v2`, `crm.objects.invoices.read`, `tickets.highly_sensitive.v2`, `crm.objects.leads.read`, `crm.objects.leads.write`, `crm.objects.custom.highly_sensitive.write.v2`, `crm.objects.deals.sensitive.read.v2`, `crm.objects.goals.write`, `crm.objects.companies.sensitive.write.v2`, `crm.objects.goals.read`, `crm.objects.partner-clients.write`, `crm.objects.line_items.read`, `crm.objects.contacts.sensitive.read.v2`, `crm.objects.line_items.write`, `crm.objects.products.read`, `crm.objects.courses.read`, `crm.objects.partner-clients.read`, `crm.objects.services.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_EMAILS` | `crm.objects.emails.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_FEEDBACK_SUBMISSIONS` | `crm.objects.feedback_submissions.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_LINE_ITEMS_BY_CRITERIA` | `crm.objects.line_items.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_PRODUCTS` | `crm.objects.products.read` | composio_managed_scope_gap |
| `HUBSPOT_SEARCH_QUOTES_BY_CRITERIA` | `crm.schemas.quotes.read` | composio_managed_scope_gap |
| `HUBSPOT_SET_CALL_RECORDING_SETTINGS` | `crm.objects.calls.read`, `crm.objects.calls.write` | composio_managed_scope_gap |

**Imported but not in current Composio catalog:**

- `HUBSPOT_START_IMPORT`
- `HUBSPOT_UPDATE_A_MARKETING_EMAIL`
- `HUBSPOT_UPDATE_BATCH_FEEDBACK_SUBMISSIONS`
- `HUBSPOT_UPDATE_BATCH_OF_OBJECTS_BY_IDOR_PROPERTY_VALUES`
- `HUBSPOT_UPDATE_CALLING_APP_RECORDING_SETTINGS`
- `HUBSPOT_UPDATE_CALLING_EXTENSION_SETTINGS`
- `HUBSPOT_UPDATE_CAMPAIGN`
- `HUBSPOT_UPDATE_CAMPAIGNS`
- `HUBSPOT_UPDATE_COMPANIES`
- `HUBSPOT_UPDATE_COMPANY`
- `HUBSPOT_UPDATE_CONTACT`
- `HUBSPOT_UPDATE_CONTACTS`
- `HUBSPOT_UPDATE_CRM_PROPERTY`
- `HUBSPOT_UPDATE_DEAL`
- `HUBSPOT_UPDATE_DEALS`
- `HUBSPOT_UPDATE_EMAIL`
- `HUBSPOT_UPDATE_EMAILS`
- `HUBSPOT_UPDATE_EVENT_TEMPLATE`
- `HUBSPOT_UPDATE_FEEDBACK_SUBMISSION`
- `HUBSPOT_UPDATE_LINE_ITEM`
- `HUBSPOT_UPDATE_LINE_ITEMS`
- `HUBSPOT_UPDATE_OBJECT_SCHEMA`
- `HUBSPOT_UPDATE_PIPELINE`
- `HUBSPOT_UPDATE_PIPELINE_STAGE`
- `HUBSPOT_UPDATE_PRODUCT`
- `HUBSPOT_UPDATE_PRODUCTS`
- `HUBSPOT_UPDATE_PROPERTY_GROUP`
- `HUBSPOT_UPDATE_QUOTE`
- `HUBSPOT_UPDATE_TICKET`
- `HUBSPOT_UPDATE_TICKETS`
- `HUBSPOT_UPDATE_TOKEN_ON_EVENT_TEMPLATE`
- `HUBSPOT_UPDATE_VIDEO_CONFERENCE_APP_SETTINGS`

**No scopes declared in metadata** (3 tools — verify with a real call before assuming OK):

- `HUBSPOT_DELETE_VIDEO_CONFERENCING_APP_SETTINGS`
- `HUBSPOT_FETCH_RECORDING_SETTINGS`
- `HUBSPOT_RETRIEVE_VIDEO_CONFERENCE_SETTINGS_BY_ID`

### `instagram`

Manifest: `src/generated/composio-manifests/instagram.generated.ts`

Auth configs (most-used first):
- `ac_jyeeVOjFAuB2` "instagram-clawlink" — Managed, 5 connections, 5 scopes

Audited against primary auth config `ac_jyeeVOjFAuB2` (5 scopes).

Status: 6 ok, 14 scope_gap, 9 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `INSTAGRAM_DELETE_COMMENT` | `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_DELETE_MESSENGER_PROFILE` | `pages_messaging` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_MEDIA` | `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata`, `pages_messaging` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_MEDIA_CHILDREN` | `instagram_basic`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_MEDIA_COMMENTS` | `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_MEDIA_INSIGHTS` | `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT` | `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_USER_LIVE_MEDIA` | `instagram_basic`, `pages_read_engagement` | composio_managed_scope_gap |
| `INSTAGRAM_GET_IG_USER_MEDIA` | `instagram_basic`, `pages_read_engagement`, `pages_show_list`, `ads_management`, `business_management` | composio_managed_scope_gap |
| `INSTAGRAM_GET_MESSENGER_PROFILE` | `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata`, `pages_show_list` | composio_managed_scope_gap |
| `INSTAGRAM_GET_PAGE_CONVERSATIONS` | `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata` | composio_managed_scope_gap |
| `INSTAGRAM_POST_IG_COMMENT_REPLIES` | `instagram_basic`, `instagram_manage_comments`, `pages_show_list`, `pages_read_engagement`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_POST_IG_USER_MENTIONS` | `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`, `pages_show_list`, `ads_management`, `ads_read` | composio_managed_scope_gap |
| `INSTAGRAM_UPDATE_MESSENGER_PROFILE` | `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata`, `pages_show_list`, `pages_messaging` | composio_managed_scope_gap |

**No scopes declared in metadata** (9 tools — verify with a real call before assuming OK):

- `INSTAGRAM_CREATE_CAROUSEL_CONTAINER`
- `INSTAGRAM_GET_CONVERSATION`
- `INSTAGRAM_GET_USER_INFO`
- `INSTAGRAM_GET_USER_INSIGHTS`
- `INSTAGRAM_LIST_ALL_CONVERSATIONS`
- `INSTAGRAM_LIST_ALL_MESSAGES`
- `INSTAGRAM_MARK_SEEN`
- `INSTAGRAM_SEND_IMAGE`
- `INSTAGRAM_SEND_TEXT_MESSAGE`

### `instantly`

Manifest: `src/generated/composio-manifests/instantly.generated.ts`

Auth configs (most-used first):
- `ac_E81KeI9aFb8N` "instantly-clawlink" — BYO, 4 connections, 0 scopes

Audited against primary auth config `ac_E81KeI9aFb8N` (0 scopes).

Status: 115 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `intercom`

Manifest: `src/generated/composio-manifests/intercom.generated.ts`

Auth configs (most-used first):
- `ac_Yx_a9Nh34AnD` "intercom-clawlink" — Managed, 1 connections, 31 scopes

Audited against primary auth config `ac_Yx_a9Nh34AnD` (31 scopes).

Status: 0 ok, 46 scope_gap, 87 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `INTERCOM_ADD_SUBSCRIPTION_TO_A_CONTACT` | `contacts` | composio_managed_scope_gap |
| `INTERCOM_CREATE_A_COLLECTION` | `read_and_write_articles` | composio_managed_scope_gap |
| `INTERCOM_CREATE_A_NOTE` | `write_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_CREATE_AN_ARTICLE` | `Read and Write Articles` | composio_managed_scope_gap |
| `INTERCOM_CREATE_HELP_CENTER_SECTION` | `Read and Write Articles` | composio_managed_scope_gap |
| `INTERCOM_CREATE_OR_UPDATE_A_COMPANY` | `Write users and companies` | composio_managed_scope_gap |
| `INTERCOM_DELETE_A_COLLECTION` | `Read and Write Articles` | composio_managed_scope_gap |
| `INTERCOM_DELETE_A_COMPANY` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_DELETE_AN_ARTICLE` | `Read and Write Articles` | composio_managed_scope_gap |
| `INTERCOM_GET_A_CONTACT` | `Read one user and one company` | composio_managed_scope_gap |
| `INTERCOM_IDENTIFY_AN_ADMIN` | `read_admins` | likely_provider_tier_gate |
| `INTERCOM_LIST_ALL_ACTIVITY_LOGS` | `Read admin activity logs` | likely_provider_tier_gate |
| `INTERCOM_LIST_ALL_ADMINS` | `read_admins` | likely_provider_tier_gate |
| `INTERCOM_LIST_ALL_ARTICLES` | `Read and List Articles` | composio_managed_scope_gap |
| `INTERCOM_LIST_ALL_COLLECTIONS` | `read_and_list_articles` | composio_managed_scope_gap |
| `INTERCOM_LIST_ALL_COMPANIES` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_ALL_HELP_CENTERS` | `read_and_list_articles` | composio_managed_scope_gap |
| `INTERCOM_LIST_ALL_NOTES` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_ATTACHED_COMPANIES_FOR_CONTACT` | `read_and_list_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_ATTACHED_CONTACTS` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_ATTACHED_SEGMENTS_FOR_COMPANIES` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_ATTACHED_SEGMENTS_FOR_CONTACT` | `read_and_list_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_COMPANY_NOTES` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_DATA_ATTRIBUTES` | `Write data attributes` | composio_managed_scope_gap |
| `INTERCOM_LIST_DATA_EVENTS` | `Read events` | composio_managed_scope_gap |
| `INTERCOM_LIST_HELP_CENTER_SECTIONS` | `Read and List articles` | composio_managed_scope_gap |
| `INTERCOM_LIST_INTERNAL_ARTICLES` | `Read and List articles` | composio_managed_scope_gap |
| `INTERCOM_LIST_SUBSCRIPTIONS_FOR_A_CONTACT` | `read_and_list_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_LIST_TAGS_ATTACHED_TO_A_CONTACT` | `tags` | composio_managed_scope_gap |
| `INTERCOM_MERGE_A_LEAD_AND_A_USER` | `Write users and companies` | composio_managed_scope_gap |
| `INTERCOM_REGISTER_FIN_VOICE_CALL` | `Create phone call redirects` | composio_managed_scope_gap |
| `INTERCOM_REMOVE_SUBSCRIPTION_FROM_A_CONTACT` | `write_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_REMOVE_TAG_FROM_A_CONTACT` | `write_tags` | composio_managed_scope_gap |
| `INTERCOM_RETRIEVE_A_COLLECTION` | `read_and_list_articles` | composio_managed_scope_gap |
| `INTERCOM_RETRIEVE_A_COMPANY_BY_ID` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_RETRIEVE_A_HELP_CENTER` | `read_and_list_articles` | composio_managed_scope_gap |
| `INTERCOM_RETRIEVE_AN_ADMIN` | `read:admins` | likely_provider_tier_gate |
| `INTERCOM_RETRIEVE_AN_ARTICLE` | `Read and List Articles` | composio_managed_scope_gap |
| `INTERCOM_RETRIEVE_COMPANIES` | `read:users`, `read:companies` | composio_managed_scope_gap |
| `INTERCOM_SCROLL_OVER_ALL_COMPANIES` | `Read and list users and companies` | composio_managed_scope_gap |
| `INTERCOM_SEARCH_FOR_ARTICLES` | `read:articles` | composio_managed_scope_gap |
| `INTERCOM_SET_AN_ADMIN_TO_AWAY` | `update_admins` | likely_provider_tier_gate |
| `INTERCOM_UPDATE_A_COLLECTION` | `read_and_write_articles` | composio_managed_scope_gap |
| `INTERCOM_UPDATE_A_COMPANY` | `Write users and companies` | composio_managed_scope_gap |
| `INTERCOM_UPDATE_A_CONTACT` | `write_users_and_companies` | composio_managed_scope_gap |
| `INTERCOM_UPDATE_AN_ARTICLE` | `Read and Write Articles` | composio_managed_scope_gap |

**No scopes declared in metadata** (87 tools — verify with a real call before assuming OK):

- `INTERCOM_ADD_TAG_TO_CONTACT`
- `INTERCOM_ARCHIVE_CONTACT`
- `INTERCOM_ASSIGN_CONVERSATION`
- `INTERCOM_ATTACH_CONTACT_TO_COMPANY`
- `INTERCOM_ATTACH_CONTACT_TO_CONVERSATION`
- `INTERCOM_ATTACH_TAG_TO_CONVERSATION`
- `INTERCOM_ATTACH_TAG_TO_TICKET`
- `INTERCOM_BLOCK_CONTACT`
- `INTERCOM_CANCEL_DATA_EXPORT`
- `INTERCOM_CLOSE_CONVERSATION`
- `INTERCOM_CREATE_CONTACT`
- `INTERCOM_CREATE_CONTENT_IMPORT_SOURCE`
- `INTERCOM_CREATE_CONVERSATION`
- `INTERCOM_CREATE_DATA_ATTRIBUTE`
- `INTERCOM_CREATE_DATA_EVENT`
- `INTERCOM_CREATE_DATA_EXPORT`
- `INTERCOM_CREATE_EXTERNAL_PAGE`
- `INTERCOM_CREATE_INTERNAL_ARTICLE`
- `INTERCOM_CREATE_TAG`
- `INTERCOM_CREATE_TICKET`
- `INTERCOM_CREATE_TICKET_TYPE`
- `INTERCOM_CREATE_TICKET_TYPE_ATTRIBUTE`
- `INTERCOM_DATA_EVENT_SUMMARIES`
- `INTERCOM_DELETE_A_TAG_DELETE_TAG`
- `INTERCOM_DELETE_A_VISITOR`
- `INTERCOM_DELETE_CONTACT`
- `INTERCOM_DELETE_CONTENT_IMPORT_SOURCE`
- `INTERCOM_DELETE_EXTERNAL_PAGE`
- `INTERCOM_DELETE_INTERNAL_ARTICLE`
- `INTERCOM_DELETE_TICKET`
- `INTERCOM_DETACH_A_CONTACT`
- `INTERCOM_DETACH_CONTACT_FROM_COMPANY`
- `INTERCOM_DETACH_TAG_FROM_CONVERSATION`
- `INTERCOM_DETACH_TAG_FROM_TICKET`
- `INTERCOM_DOWNLOAD_DATA_EXPORT`
- `INTERCOM_ENQUEUE_CREATE_TICKET`
- `INTERCOM_FIND_TAG`
- `INTERCOM_GET_CONTENT_IMPORT_SOURCE`
- `INTERCOM_GET_CONVERSATION`
- `INTERCOM_GET_COUNTS`
- `INTERCOM_GET_CUSTOM_OBJECT_INSTANCE_BY_EXTERNAL_ID`
- `INTERCOM_GET_EXTERNAL_PAGE`
- `INTERCOM_GET_TICKET`
- `INTERCOM_GET_TICKET_TYPE`
- `INTERCOM_JOBS_STATUS`
- `INTERCOM_LIST_ALL_MACROS`
- `INTERCOM_LIST_AWAY_STATUS_REASONS`
- `INTERCOM_LIST_CALLS`
- `INTERCOM_LIST_CALLS_WITH_TRANSCRIPTS`
- `INTERCOM_LIST_CONTACTS`
- `INTERCOM_LIST_CONTENT_IMPORT_SOURCES`
- `INTERCOM_LIST_CONVERSATIONS`
- `INTERCOM_LIST_EXTERNAL_PAGES`
- `INTERCOM_LIST_NEWS_ITEMS`
- `INTERCOM_LIST_SEGMENTS`
- `INTERCOM_LIST_SUBSCRIPTION_TYPES`
- `INTERCOM_LIST_TAGS`
- `INTERCOM_LIST_TEAMS`
- `INTERCOM_LIST_TICKET_STATES`
- `INTERCOM_LIST_TICKET_TYPES`
- `INTERCOM_REOPEN_CONVERSATION`
- `INTERCOM_REPLY_TICKET`
- `INTERCOM_REPLY_TO_CONVERSATION`
- `INTERCOM_RETRIEVE_A_JOB_STATUS`
- `INTERCOM_RETRIEVE_A_MACRO`
- `INTERCOM_RETRIEVE_A_SEGMENT`
- `INTERCOM_RETRIEVE_INTERNAL_ARTICLE`
- `INTERCOM_RETRIEVE_NOTE`
- `INTERCOM_RETRIEVE_TEAM`
- `INTERCOM_RETRIEVE_VISITOR_WITH_USER_ID`
- `INTERCOM_SEARCH_CONTACTS`
- `INTERCOM_SEARCH_CONVERSATIONS`
- `INTERCOM_SEARCH_INTERNAL_ARTICLES`
- `INTERCOM_SEARCH_TICKETS`
- `INTERCOM_SET_ADMIN_TO_AWAY`
- `INTERCOM_SHOW_CALL`
- `INTERCOM_SHOW_CALL_TRANSCRIPT`
- `INTERCOM_SHOW_CONTACT_BY_EXTERNAL_ID`
- `INTERCOM_UNARCHIVE_CONTACT`
- `INTERCOM_UPDATE_CONTACT`
- `INTERCOM_UPDATE_CONTENT_IMPORT_SOURCE`
- `INTERCOM_UPDATE_DATA_ATTRIBUTE`
- `INTERCOM_UPDATE_EXTERNAL_PAGE`
- `INTERCOM_UPDATE_INTERNAL_ARTICLE`
- `INTERCOM_UPDATE_TICKET`
- `INTERCOM_UPDATE_TICKET_TYPE`
- `INTERCOM_UPDATE_TICKET_TYPE_ATTRIBUTE`

### `kit`

Manifest: `src/generated/composio-manifests/kit.generated.ts`

Auth configs (most-used first):
- `ac_l-_u3jZS3-aR` "kit-clawlink" — Managed, 3 connections, 1 scopes

Audited against primary auth config `ac_l-_u3jZS3-aR` (1 scopes).

Status: 0 ok, 13 scope_gap, 29 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `KIT_ADD_SUBSCRIBER_TO_FORM_BY_EMAIL` | `public` | composio_managed_scope_gap |
| `KIT_CREATE_BROADCAST` | `public` | composio_managed_scope_gap |
| `KIT_CREATE_SUBSCRIBER` | `public` | composio_managed_scope_gap |
| `KIT_FILTER_SUBSCRIBERS` | `public` | composio_managed_scope_gap |
| `KIT_GET_BROADCAST_CLICKS` | `public` | composio_managed_scope_gap |
| `KIT_GET_GROWTH_STATS` | `public` | composio_managed_scope_gap |
| `KIT_GET_SUBSCRIBER` | `public` | composio_managed_scope_gap |
| `KIT_GET_SUBSCRIBER_STATS` | `public` | composio_managed_scope_gap |
| `KIT_LIST_EMAIL_TEMPLATES` | `public` | composio_managed_scope_gap |
| `KIT_LIST_WEBHOOKS` | `public` | composio_managed_scope_gap |
| `KIT_REMOVE_TAG_FROM_SUBSCRIBER` | `public` | composio_managed_scope_gap |
| `KIT_UNTAG_SUBSCRIBER_BY_EMAIL` | `public` | composio_managed_scope_gap |
| `KIT_UPDATE_SUBSCRIBER` | `public` | composio_managed_scope_gap |

**No scopes declared in metadata** (29 tools — verify with a real call before assuming OK):

- `KIT_ADD_SUBSCRIBER_TO_FORM`
- `KIT_CREATE_CUSTOM_FIELD`
- `KIT_CREATE_TAG`
- `KIT_CREATE_WEBHOOK`
- `KIT_DELETE_BROADCAST`
- `KIT_DELETE_CUSTOM_FIELD`
- `KIT_DELETE_SUBSCRIBER`
- `KIT_DELETE_TAG`
- `KIT_DELETE_WEBHOOK`
- `KIT_GET_ACCOUNT`
- `KIT_GET_ACCOUNT_COLORS`
- `KIT_GET_BROADCAST`
- `KIT_GET_BROADCAST_STATS`
- `KIT_GET_CREATOR_PROFILE`
- `KIT_GET_EMAIL_STATS`
- `KIT_LIST_BROADCASTS`
- `KIT_LIST_CUSTOM_FIELDS`
- `KIT_LIST_FORMS`
- `KIT_LIST_SEGMENTS`
- `KIT_LIST_SEQUENCES`
- `KIT_LIST_SUBSCRIBERS`
- `KIT_LIST_SUBSCRIBERS_FOR_FORM`
- `KIT_LIST_TAG_SUBSCRIBERS`
- `KIT_LIST_TAGS`
- `KIT_TAG_SUBSCRIBER`
- `KIT_TAG_SUBSCRIBER_BY_EMAIL`
- `KIT_UPDATE_ACCOUNT_COLORS`
- `KIT_UPDATE_CUSTOM_FIELD`
- `KIT_UPDATE_TAG`

### `klaviyo`

Manifest: `src/generated/composio-manifests/klaviyo.generated.ts`

No Composio auth_config found for toolkit `klaviyo`. Tools cannot be audited until an auth config exists.

### `lemlist`

Manifest: `src/generated/composio-manifests/lemlist.generated.ts`

Auth configs (most-used first):
- `ac_gMBjLxhrIiot` "lemlist-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_gMBjLxhrIiot` (0 scopes).

Status: 54 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `linkedin`

Manifest: `src/generated/composio-manifests/linkedin.generated.ts`

Auth configs (most-used first):
- `ac_cbilq2TPjvjU` "linkedin-clawlink" — Managed, 6 connections, 4 scopes

Audited against primary auth config `ac_cbilq2TPjvjU` (4 scopes).

Status: 1 ok, 9 scope_gap, 0 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE` | `w_organization_social` | composio_managed_scope_gap |
| `LINKEDIN_CREATE_COMMENT_ON_POST` | `w_organization_social` | composio_managed_scope_gap |
| `LINKEDIN_CREATE_LINKED_IN_POST` | `w_organization_social` | composio_managed_scope_gap |
| `LINKEDIN_DELETE_POST` | `w_organization_social` | composio_managed_scope_gap |
| `LINKEDIN_GET_AD_TARGETING_FACETS` | `No additional OAuth scope required beyond any approved Marketing API access token` | composio_managed_scope_gap |
| `LINKEDIN_GET_IMAGE` | `r_organization_social`, `rw_ads` | composio_managed_scope_gap |
| `LINKEDIN_GET_IMAGES` | `r_organization_social`, `rw_ads` | composio_managed_scope_gap |
| `LINKEDIN_GET_MY_INFO` | `r_liteprofile`, `r_basicprofile` | composio_managed_scope_gap |
| `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES` | `r_ads`, `rw_ads` | composio_managed_scope_gap |

### `mailchimp`

Manifest: `src/generated/composio-manifests/mailchimp.generated.ts`

Auth configs (most-used first):
- `ac_sLMo_nntsZ4a` "mailchimp-clawlink" — Managed, 2 connections, 1 scopes

Audited against primary auth config `ac_sLMo_nntsZ4a` (1 scopes).

Status: 0 ok, 0 scope_gap, 200 no_scopes_declared, 72 not_in_catalog

**Imported but not in current Composio catalog:**

- `MAILCHIMP_LIST_SURVEY_QUESTION_REPORTS`
- `MAILCHIMP_LIST_SURVEY_REPORTS`
- `MAILCHIMP_LIST_SURVEY_RESPONSES`
- `MAILCHIMP_LIST_TEMPLATE_FOLDERS`
- `MAILCHIMP_LIST_TEMPLATES`
- `MAILCHIMP_LIST_TOP_EMAIL_CLIENTS`
- `MAILCHIMP_LIST_TOP_OPEN_ACTIVITIES`
- `MAILCHIMP_LIST_UNSUBSCRIBED_MEMBERS`
- `MAILCHIMP_LIST_WEBHOOKS`
- `MAILCHIMP_PAUSE_AUTOMATED_EMAIL`
- `MAILCHIMP_PAUSE_AUTOMATION_EMAILS`
- `MAILCHIMP_PAUSE_RSS_CAMPAIGN`
- `MAILCHIMP_PING`
- `MAILCHIMP_PUBLISH_A_SURVEY`
- `MAILCHIMP_PUBLISH_LANDING_PAGE`
- `MAILCHIMP_REMOVE_LIST_MEMBER_FROM_SEGMENT`
- `MAILCHIMP_REMOVE_SUBSCRIBER_FROM_WORKFLOW`
- `MAILCHIMP_REPLICATE_CAMPAIGN`
- `MAILCHIMP_RESEND_CAMPAIGN`
- `MAILCHIMP_RESUME_RSS_CAMPAIGN`
- `MAILCHIMP_RETRIEVE_CAMPAIGN_ABUSE_COMPLAINTS`
- `MAILCHIMP_RETRIEVE_FOLDER_CONTENTS`
- `MAILCHIMP_SCHEDULE_CAMPAIGN`
- `MAILCHIMP_SEARCH_CAMPAIGNS`
- `MAILCHIMP_SEARCH_FOR_TAGS_ON_A_LIST_BY_NAME`
- `MAILCHIMP_SEARCH_MEMBERS`
- `MAILCHIMP_SEND_CAMPAIGN`
- `MAILCHIMP_SEND_TEST_EMAIL`
- `MAILCHIMP_SET_CAMPAIGN_CONTENT`
- `MAILCHIMP_START_AUTOMATED_EMAIL`
- `MAILCHIMP_START_AUTOMATION_EMAILS`
- `MAILCHIMP_START_BATCH_OPERATION`
- `MAILCHIMP_UNPUBLISH_A_SURVEY`
- `MAILCHIMP_UNPUBLISH_LANDING_PAGE`
- `MAILCHIMP_UNSCHEDULE_CAMPAIGN`
- `MAILCHIMP_UPDATE_AUDIENCES_CONTACTS`
- `MAILCHIMP_UPDATE_BATCH_WEBHOOK`
- `MAILCHIMP_UPDATE_CAMPAIGN_FEEDBACK_MESSAGE`
- `MAILCHIMP_UPDATE_CAMPAIGN_FOLDER`
- `MAILCHIMP_UPDATE_CAMPAIGN_SETTINGS`
- `MAILCHIMP_UPDATE_CART`
- `MAILCHIMP_UPDATE_CART_LINE_ITEM`
- `MAILCHIMP_UPDATE_CUSTOMER`
- `MAILCHIMP_UPDATE_FILE`
- `MAILCHIMP_UPDATE_FOLDER`
- `MAILCHIMP_UPDATE_INTEREST_CATEGORY`
- `MAILCHIMP_UPDATE_INTEREST_IN_CATEGORY`
- `MAILCHIMP_UPDATE_LANDING_PAGE`
- `MAILCHIMP_UPDATE_LIST_MEMBER`
- `MAILCHIMP_UPDATE_LISTS`
- `MAILCHIMP_UPDATE_LISTS_SEGMENTS`
- `MAILCHIMP_UPDATE_MERGE_FIELD`
- `MAILCHIMP_UPDATE_NOTE`
- `MAILCHIMP_UPDATE_ORDER`
- `MAILCHIMP_UPDATE_ORDER_LINE_ITEM`
- `MAILCHIMP_UPDATE_PRODUCT`
- `MAILCHIMP_UPDATE_PRODUCT_IMAGE`
- `MAILCHIMP_UPDATE_PRODUCT_VARIANT`
- `MAILCHIMP_UPDATE_PROMO_CODE`
- `MAILCHIMP_UPDATE_PROMO_RULE`
- `MAILCHIMP_UPDATE_STORE`
- `MAILCHIMP_UPDATE_TEMPLATE`
- `MAILCHIMP_UPDATE_TEMPLATE_FOLDER`
- `MAILCHIMP_UPDATE_WEBHOOK`
- `MAILCHIMP_UPDATE_WORKFLOW_EMAIL`
- `MAILCHIMP_UPSERT_ECOMMERCE_STORES_ORDERS`
- `MAILCHIMP_UPSERT_ECOMMERCE_STORES_PRODUCTS`
- `MAILCHIMP_VERIFY_CONNECTED_SITE_SCRIPT`
- `MAILCHIMP_VERIFY_DOMAIN`
- `MAILCHIMP_VIEW_DEFAULT_CONTENT`
- `MAILCHIMP_VIEW_RECENT_ACTIVITY`
- `MAILCHIMP_VIEW_RECENT_ACTIVITY50`

**No scopes declared in metadata** (200 tools — verify with a real call before assuming OK):

- `MAILCHIMP_ADD_AUTOMATION`
- `MAILCHIMP_ADD_BATCH_WEBHOOK`
- `MAILCHIMP_ADD_CAMPAIGN`
- `MAILCHIMP_ADD_CAMPAIGN_FEEDBACK`
- `MAILCHIMP_ADD_CAMPAIGN_FOLDER`
- `MAILCHIMP_ADD_CART`
- `MAILCHIMP_ADD_CART_LINE_ITEM`
- `MAILCHIMP_ADD_CONNECTED_SITE`
- `MAILCHIMP_ADD_CONTACT_TO_AUDIENCE`
- `MAILCHIMP_ADD_DOMAIN_TO_ACCOUNT`
- `MAILCHIMP_ADD_EVENT`
- `MAILCHIMP_ADD_EXPORT`
- `MAILCHIMP_ADD_FILE`
- `MAILCHIMP_ADD_FOLDER`
- `MAILCHIMP_ADD_INTEREST_CATEGORY`
- `MAILCHIMP_ADD_INTEREST_IN_CATEGORY`
- `MAILCHIMP_ADD_LANDING_PAGE`
- `MAILCHIMP_ADD_LIST`
- `MAILCHIMP_ADD_MEMBER_NOTE`
- `MAILCHIMP_ADD_MEMBER_TO_SEGMENT`
- `MAILCHIMP_ADD_MERGE_FIELD`
- `MAILCHIMP_ADD_OR_REMOVE_MEMBER_TAGS`
- `MAILCHIMP_ADD_OR_UPDATE_CUSTOMER`
- `MAILCHIMP_ADD_OR_UPDATE_LIST_MEMBER`
- `MAILCHIMP_ADD_OR_UPDATE_PRODUCT_VARIANT`
- `MAILCHIMP_ADD_ORDER_LINE_ITEM`
- `MAILCHIMP_ADD_PRODUCT`
- `MAILCHIMP_ADD_PRODUCT_IMAGE`
- `MAILCHIMP_ADD_PROMO_CODE`
- `MAILCHIMP_ADD_PROMO_RULE`
- `MAILCHIMP_ADD_SEGMENT`
- `MAILCHIMP_ADD_STORE`
- `MAILCHIMP_ADD_SUBSCRIBER_TO_WORKFLOW_EMAIL`
- `MAILCHIMP_ADD_TEMPLATE`
- `MAILCHIMP_ADD_TEMPLATE_FOLDER`
- `MAILCHIMP_ADD_WEBHOOK`
- `MAILCHIMP_ARCHIVE_AUTOMATION`
- `MAILCHIMP_ARCHIVE_CONTACT`
- `MAILCHIMP_ARCHIVE_LIST_MEMBER`
- `MAILCHIMP_BATCH_ADD_OR_REMOVE_MEMBERS`
- `MAILCHIMP_BATCH_SUBSCRIBE_OR_UNSUBSCRIBE`
- `MAILCHIMP_CAMPAIGN_ABUSE_REPORT_DETAILS`
- `MAILCHIMP_CAMPAIGN_STATISTICS_FEEDBACK`
- `MAILCHIMP_CANCEL_CAMPAIGN`
- `MAILCHIMP_CREATE_A_SURVEY_CAMPAIGN`
- `MAILCHIMP_CUSTOMER_JOURNEYS_API_TRIGGER_FOR_A_CONTACT`
- `MAILCHIMP_CUSTOMIZE_SIGNUP_FORM`
- `MAILCHIMP_DELETE_BATCH_REQUEST`
- `MAILCHIMP_DELETE_BATCH_WEBHOOK`
- `MAILCHIMP_DELETE_CAMPAIGN`
- `MAILCHIMP_DELETE_CAMPAIGN_FEEDBACK_MESSAGE`
- `MAILCHIMP_DELETE_CAMPAIGN_FOLDER`
- `MAILCHIMP_DELETE_CART`
- `MAILCHIMP_DELETE_CART_LINE_ITEM`
- `MAILCHIMP_DELETE_CONNECTED_SITE`
- `MAILCHIMP_DELETE_CUSTOMER`
- `MAILCHIMP_DELETE_DOMAIN`
- `MAILCHIMP_DELETE_FILE`
- `MAILCHIMP_DELETE_FOLDER`
- `MAILCHIMP_DELETE_INTEREST_CATEGORY`
- `MAILCHIMP_DELETE_INTEREST_IN_CATEGORY`
- `MAILCHIMP_DELETE_LANDING_PAGE`
- `MAILCHIMP_DELETE_LIST`
- `MAILCHIMP_DELETE_LIST_MEMBER`
- `MAILCHIMP_DELETE_MERGE_FIELD`
- `MAILCHIMP_DELETE_NOTE`
- `MAILCHIMP_DELETE_ORDER`
- `MAILCHIMP_DELETE_ORDER_LINE_ITEM`
- `MAILCHIMP_DELETE_PRODUCT`
- `MAILCHIMP_DELETE_PRODUCT_IMAGE`
- `MAILCHIMP_DELETE_PRODUCT_VARIANT`
- `MAILCHIMP_DELETE_PROMO_CODE`
- `MAILCHIMP_DELETE_PROMO_RULE`
- `MAILCHIMP_DELETE_SEGMENT`
- `MAILCHIMP_DELETE_STORE`
- `MAILCHIMP_DELETE_TEMPLATE`
- `MAILCHIMP_DELETE_TEMPLATE_FOLDER`
- `MAILCHIMP_DELETE_WEBHOOK`
- `MAILCHIMP_DELETE_WORKFLOW_EMAIL`
- `MAILCHIMP_FORGET_CONTACT`
- `MAILCHIMP_GET_ABUSE_REPORT`
- `MAILCHIMP_GET_ACCOUNT_EXPORT_INFO`
- `MAILCHIMP_GET_AUDIENCES_CONTACTS`
- `MAILCHIMP_GET_AUDIENCES_CONTACTS_DETAIL`
- `MAILCHIMP_GET_AUTHORIZED_APP_INFO`
- `MAILCHIMP_GET_AUTOMATED_EMAIL_SUBSCRIBER`
- `MAILCHIMP_GET_AUTOMATION_INFO`
- `MAILCHIMP_GET_BATCH_OPERATION_STATUS`
- `MAILCHIMP_GET_BATCH_WEBHOOK_INFO`
- `MAILCHIMP_GET_CAMPAIGN_CONTENT`
- `MAILCHIMP_GET_CAMPAIGN_FEEDBACK_MESSAGE`
- `MAILCHIMP_GET_CAMPAIGN_FOLDER`
- `MAILCHIMP_GET_CAMPAIGN_INFO`
- `MAILCHIMP_GET_CAMPAIGN_LINK_DETAILS`
- `MAILCHIMP_GET_CAMPAIGN_RECIPIENT_INFO`
- `MAILCHIMP_GET_CAMPAIGN_REPORT`
- `MAILCHIMP_GET_CAMPAIGN_SEND_CHECKLIST`
- `MAILCHIMP_GET_CART_INFO`
- `MAILCHIMP_GET_CART_LINE_ITEM`
- `MAILCHIMP_GET_CLICKED_LINK_SUBSCRIBER`
- `MAILCHIMP_GET_CONNECTED_SITE`
- `MAILCHIMP_GET_CUSTOMER_INFO`
- `MAILCHIMP_GET_DOMAIN_INFO`
- `MAILCHIMP_GET_FACEBOOK_AD_INFO`
- `MAILCHIMP_GET_FACEBOOK_AD_REPORT`
- `MAILCHIMP_GET_FILE`
- `MAILCHIMP_GET_FOLDER`
- `MAILCHIMP_GET_GROWTH_HISTORY_BY_MONTH`
- `MAILCHIMP_GET_INFORMATION_ABOUT_ALL_SURVEYS_FOR_A_LIST`
- `MAILCHIMP_GET_INTEREST_CATEGORY_INFO`
- `MAILCHIMP_GET_INTEREST_IN_CATEGORY`
- `MAILCHIMP_GET_LANDING_PAGE_CONTENT`
- `MAILCHIMP_GET_LANDING_PAGE_INFO`
- `MAILCHIMP_GET_LANDING_PAGE_REPORT`
- `MAILCHIMP_GET_LATEST_CHIMP_CHATTER`
- `MAILCHIMP_GET_LIST_INFO`
- `MAILCHIMP_GET_LISTS_INFO`
- `MAILCHIMP_GET_MEMBER_INFO`
- `MAILCHIMP_GET_MEMBER_NOTE`
- `MAILCHIMP_GET_MERGE_FIELD`
- `MAILCHIMP_GET_MESSAGE`
- `MAILCHIMP_GET_OPENED_CAMPAIGN_SUBSCRIBER`
- `MAILCHIMP_GET_ORDER_INFO`
- `MAILCHIMP_GET_ORDER_LINE_ITEM`
- `MAILCHIMP_GET_PRODUCT_IMAGE_INFO`
- `MAILCHIMP_GET_PRODUCT_INFO`
- `MAILCHIMP_GET_PRODUCT_VARIANT_INFO`
- `MAILCHIMP_GET_PROMO_CODE`
- `MAILCHIMP_GET_PROMO_RULE`
- `MAILCHIMP_GET_SEGMENT_INFO`
- `MAILCHIMP_GET_STORE_INFO`
- `MAILCHIMP_GET_SUBSCRIBER_EMAIL_ACTIVITY`
- `MAILCHIMP_GET_SUBSCRIBER_REMOVED_FROM_WORKFLOW`
- `MAILCHIMP_GET_SURVEY`
- `MAILCHIMP_GET_SURVEY_QUESTION_REPORT`
- `MAILCHIMP_GET_SURVEY_REPORT`
- `MAILCHIMP_GET_SURVEY_RESPONSE`
- `MAILCHIMP_GET_TEMPLATE_FOLDER`
- `MAILCHIMP_GET_TEMPLATE_INFO`
- `MAILCHIMP_GET_UNSUBSCRIBED_MEMBER`
- `MAILCHIMP_GET_WEBHOOK_INFO`
- `MAILCHIMP_GET_WORKFLOW_EMAIL_INFO`
- `MAILCHIMP_LIST_ABUSE_REPORTS`
- `MAILCHIMP_LIST_ACCOUNT_EXPORTS`
- `MAILCHIMP_LIST_ACCOUNT_ORDERS`
- `MAILCHIMP_LIST_ANSWERS_FOR_QUESTION`
- `MAILCHIMP_LIST_API_ROOT_RESOURCES`
- `MAILCHIMP_LIST_AUTHORIZED_APPS`
- `MAILCHIMP_LIST_AUTOMATED_EMAIL_SUBSCRIBERS`
- `MAILCHIMP_LIST_AUTOMATED_EMAILS`
- `MAILCHIMP_LIST_AUTOMATIONS`
- `MAILCHIMP_LIST_BATCH_REQUESTS`
- `MAILCHIMP_LIST_BATCH_WEBHOOKS`
- `MAILCHIMP_LIST_CAMPAIGN_FEEDBACK`
- `MAILCHIMP_LIST_CAMPAIGN_FOLDERS`
- `MAILCHIMP_LIST_CAMPAIGN_OPEN_DETAILS`
- `MAILCHIMP_LIST_CAMPAIGN_PRODUCT_ACTIVITY`
- `MAILCHIMP_LIST_CAMPAIGN_RECIPIENTS`
- `MAILCHIMP_LIST_CAMPAIGN_REPORTS`
- `MAILCHIMP_LIST_CAMPAIGNS`
- `MAILCHIMP_LIST_CART_LINE_ITEMS`
- `MAILCHIMP_LIST_CARTS`
- `MAILCHIMP_LIST_CHILD_CAMPAIGN_REPORTS`
- `MAILCHIMP_LIST_CLICKED_LINK_SUBSCRIBERS`
- `MAILCHIMP_LIST_CONNECTED_SITES`
- `MAILCHIMP_LIST_CUSTOMERS`
- `MAILCHIMP_LIST_DOMAIN_PERFORMANCE_STATS`
- `MAILCHIMP_LIST_EEP_URL_ACTIVITY`
- `MAILCHIMP_LIST_EMAIL_ACTIVITY`
- `MAILCHIMP_LIST_FACEBOOK_ADS`
- `MAILCHIMP_LIST_FACEBOOK_ADS_REPORTS`
- `MAILCHIMP_LIST_FACEBOOK_ECOMMERCE_REPORT`
- `MAILCHIMP_LIST_FOLDERS`
- `MAILCHIMP_LIST_GROWTH_HISTORY_DATA`
- `MAILCHIMP_LIST_INTEREST_CATEGORIES`
- `MAILCHIMP_LIST_INTERESTS_IN_CATEGORY`
- `MAILCHIMP_LIST_LANDING_PAGES`
- `MAILCHIMP_LIST_LANDING_PAGES_REPORTS`
- `MAILCHIMP_LIST_LOCATIONS`
- `MAILCHIMP_LIST_MEMBER_EVENTS`
- `MAILCHIMP_LIST_MEMBER_GOAL_EVENTS`
- `MAILCHIMP_LIST_MEMBER_TAGS`
- `MAILCHIMP_LIST_MEMBERS_IN_SEGMENT`
- `MAILCHIMP_LIST_MEMBERS_INFO`
- `MAILCHIMP_LIST_MERGE_FIELDS`
- `MAILCHIMP_LIST_ORDER_LINE_ITEMS`
- `MAILCHIMP_LIST_ORDERS`
- `MAILCHIMP_LIST_PRODUCT`
- `MAILCHIMP_LIST_PRODUCT_IMAGES`
- `MAILCHIMP_LIST_PRODUCT_VARIANTS`
- `MAILCHIMP_LIST_PROMO_CODES`
- `MAILCHIMP_LIST_PROMO_RULES`
- `MAILCHIMP_LIST_RECENT_ACTIVITY`
- `MAILCHIMP_LIST_RECENT_MEMBER_NOTES`
- `MAILCHIMP_LIST_SEGMENTS`
- `MAILCHIMP_LIST_SENDING_DOMAINS`
- `MAILCHIMP_LIST_SIGNUP_FORMS`
- `MAILCHIMP_LIST_STORED_FILES`
- `MAILCHIMP_LIST_STORES`
- `MAILCHIMP_LIST_SUBSCRIBERS_REMOVED_FROM_WORKFLOW`

### `mailerlite`

Manifest: `src/generated/composio-manifests/mailerlite.generated.ts`

Auth configs (most-used first):
- `ac_JS261sHcVUDI` "mailerlite-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_JS261sHcVUDI` (0 scopes).

Status: 86 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `meta-ads`

Manifest: `src/generated/composio-manifests/meta-ads.generated.ts`

No Composio auth_config found for toolkit `meta-ads`. Tools cannot be audited until an auth config exists.

### `monday`

Manifest: `src/generated/composio-manifests/monday.generated.ts`

Auth configs (most-used first):
- `ac_ionglG6X4GtZ` "monday-clawlink" — Managed, 0 connections, 0 scopes

Audited against primary auth config `ac_ionglG6X4GtZ` (0 scopes).

Status: 121 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `motion`

Manifest: `src/generated/composio-manifests/motion.generated.ts`

Auth configs (most-used first):
- `ac_01QhSEWAojYa` "motion-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_01QhSEWAojYa` (0 scopes).

Status: 27 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `notion`

Manifest: `src/generated/composio-manifests/notion.generated.ts`

Auth configs (most-used first):
- `ac_yocwOszFqop6` "notion-clawlink" — Managed, 9 connections, 0 scopes

Audited against primary auth config `ac_yocwOszFqop6` (0 scopes).

Status: 45 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `omnisend`

Manifest: `src/generated/composio-manifests/omnisend.generated.ts`

Auth configs (most-used first):
- `ac_TG-fDBGgv6t0` "omnisend-clawlink" — Managed, 1 connections, 10 scopes

Audited against primary auth config `ac_TG-fDBGgv6t0` (10 scopes).

Status: 17 ok, 12 scope_gap, 14 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `OMNISEND_CREATE_CART` | `Carts` | composio_managed_scope_gap |
| `OMNISEND_CREATE_OR_UPDATE_CONTACT` | `Contacts` | composio_managed_scope_gap |
| `OMNISEND_CREATE_ORDER` | `Orders` | composio_managed_scope_gap |
| `OMNISEND_DELETE_ORDER` | `orders` | composio_managed_scope_gap |
| `OMNISEND_GET_CART` | `Carts` | composio_managed_scope_gap |
| `OMNISEND_LIST_CARTS` | `Carts` | composio_managed_scope_gap |
| `OMNISEND_LIST_CONTACTS` | `Contacts` | composio_managed_scope_gap |
| `OMNISEND_LIST_PRODUCTS` | `Products` | composio_managed_scope_gap |
| `OMNISEND_REPLACE_CART_PRODUCT` | `Carts` | composio_managed_scope_gap |
| `OMNISEND_UPDATE_CART_PRODUCT` | `Carts` | composio_managed_scope_gap |
| `OMNISEND_UPDATE_CONTACT` | `Contacts` | composio_managed_scope_gap |
| `OMNISEND_UPDATE_ORDER_STATUS` | `all` | composio_managed_scope_gap |

**No scopes declared in metadata** (14 tools — verify with a real call before assuming OK):

- `OMNISEND_ADD_CART_PRODUCT`
- `OMNISEND_CREATE_BATCH`
- `OMNISEND_DELETE_CART`
- `OMNISEND_DELETE_PRODUCT`
- `OMNISEND_GET_BATCH_INFORMATION`
- `OMNISEND_GET_BATCH_ITEMS`
- `OMNISEND_GET_BATCHES`
- `OMNISEND_GET_CONTACT`
- `OMNISEND_GET_ORDER`
- `OMNISEND_LIST_CATEGORIES`
- `OMNISEND_REMOVE_CART_PRODUCT`
- `OMNISEND_REPLACE_CART`
- `OMNISEND_REPLACE_ORDER`
- `OMNISEND_UPDATE_CART`

### `onedrive`

Manifest: `src/generated/composio-manifests/onedrive.generated.ts`

No Composio auth_config found for toolkit `onedrive`. Tools cannot be audited until an auth config exists.

### `outlook`

Manifest: `src/generated/composio-manifests/outlook.generated.ts`

Auth configs (most-used first):
- `ac_r5dUM0i6COQO` "outlook-clawlink" — Managed, 6 connections, 12 scopes

Audited against primary auth config `ac_r5dUM0i6COQO` (12 scopes).

Status: 135 ok, 62 scope_gap, 0 no_scopes_declared, 75 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `OUTLOOK_ADD_MAIL_ATTACHMENT` | `Mail.Read.Shared`, `Mail.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_CREATE_ATTACHMENT_UPLOAD_SESSION` | `Mail.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_CREATE_CONTACT` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_CREATE_EMAIL_RULE` | `Mail.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_CREATE_MAIL_FOLDER_MESSAGE_ATTACHMENT` | `Mail.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_CREATE_MESSAGE_ATTACHMENT` | `Mail.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_FIND_MEETING_TIMES` | `Calendars.Read.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_EVENT` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_EVENT_ATTACHMENT` | `Calendars.Read.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_FROM_EVENT` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_FROM_GROUP` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_GROUP` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_GROUP_SCHEDULE` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_PERMISSION` | `Calendars.ReadBasic`, `Group.Read.All`, `Group.ReadWrite.All` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_PERMISSION_FROM_CALENDAR` | `Calendars.ReadBasic`, `Group.Read.All`, `Group.ReadWrite.All` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_SCHEDULE` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CALENDAR_VIEW` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CHILD_FOLDER_MESSAGE` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CHILD_FOLDER_MESSAGE_CONTENT` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CHILD_MAIL_FOLDER` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_CONTACT_EXTENSION` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_CONTACT_FOLDER` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_CONTACT_FOLDERS` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_CONTACT_FROM_FOLDER` | `Contacts.Read`, `Contacts.Read.Shared`, `Contacts.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_DRAFTS_MAIL_FOLDER` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_EVENT` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_EVENT_CALENDAR_FROM_GROUP` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_MAIL_DELTA` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_MAIL_FOLDER` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_MAIL_FOLDER_MESSAGE` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_MAIL_TIPS` | `Mail.Read.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CALENDAR` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CONTACT_FOLDERS_CHILD_FOLDER` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CONTACT_FROM_CHILD_FOLDER` | `Contacts.Read`, `Contacts.Read.Shared`, `Contacts.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CONTACT_PHOTO` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CONTACTS` | `Contacts.Read`, `Contacts.Read.Shared`, `Contacts.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_CONTACTS_EXTENSIONS` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_EVENT_CALENDAR` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_ME_MESSAGE_MIME_CONTENT` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_MESSAGE` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_PROFILE` | `User.ReadWrite`, `User.ReadBasic.All`, `User.Read.All`, `User.ReadWrite.All`, `Directory.Read.All`, `Directory.ReadWrite.All` | composio_managed_scope_gap |
| `OUTLOOK_GET_SCHEDULE` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_SUPPORTED_LANGUAGES` | `User.Read.All`, `User.ReadBasic.All` | composio_managed_scope_gap |
| `OUTLOOK_GET_SUPPORTED_TIME_ZONES` | `User.Read.All`, `User.ReadBasic.All` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CALENDAR` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CALENDAR_ALLOWED_SHARING_ROLES` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CALENDAR_EVENT` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CALENDAR_GROUP_CALENDAR_PERMISSION` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CALENDAR_GROUP_EVENT` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_GET_USER_CHILD_FOLDER_MESSAGE` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDAR_GROUP_CALENDAR_EVENTS` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDAR_GROUP_CALENDARS` | `Calendars.ReadBasic`, `Calendars.Read.Shared` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDAR_GROUPS` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDAR_PERMISSIONS` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDAR_VIEW_DELTA` | `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CALENDARS` | `Calendars.Read.Shared`, `Calendars.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CHILD_FOLDER_CONTACTS` | `Contacts.Read`, `Contacts.Read.Shared`, `Contacts.ReadWrite.Shared` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CHILD_FOLDER_MESSAGES` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CHILD_MAIL_FOLDERS` | `Mail.ReadBasic` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CONTACT_FOLDER_CHILD_FOLDERS` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CONTACT_FOLDERS_DELTA` | `Contacts.Read` | composio_managed_scope_gap |
| `OUTLOOK_LIST_CONTACTS_DELTA` | `Contacts.Read` | composio_managed_scope_gap |

**Imported but not in current Composio catalog:**

- `OUTLOOK_LIST_MAIL_FOLDER_MESSAGE_RULES`
- `OUTLOOK_LIST_MAIL_FOLDER_MESSAGES`
- `OUTLOOK_LIST_MAIL_FOLDERS`
- `OUTLOOK_LIST_MAIL_FOLDERS_DELTA`
- `OUTLOOK_LIST_ME_CALENDAR_PERMISSIONS`
- `OUTLOOK_LIST_MESSAGE_ATTACHMENTS_FROM_CHILD_FOLDER`
- `OUTLOOK_LIST_MESSAGES`
- `OUTLOOK_LIST_OUTLOOK_ATTACHMENTS`
- `OUTLOOK_LIST_PLACES`
- `OUTLOOK_LIST_PRIMARY_CALENDAR_PERMISSIONS`
- `OUTLOOK_LIST_REMINDERS`
- `OUTLOOK_LIST_SENT_ITEMS_MESSAGES`
- `OUTLOOK_LIST_TO_DO_LISTS`
- `OUTLOOK_LIST_TODO_TASKS`
- `OUTLOOK_LIST_USER_CALENDAR_EVENT_INSTANCES`
- `OUTLOOK_LIST_USER_CALENDAR_EVENTS_ATTACHMENTS`
- `OUTLOOK_LIST_USER_CALENDAR_GROUP_EVENT_INSTANCES`
- `OUTLOOK_LIST_USER_CALENDAR_GROUPS_CALENDAR_VIEW`
- `OUTLOOK_LIST_USER_CALENDAR_VIEW`
- `OUTLOOK_LIST_USER_CALENDARS_CALENDAR_PERMISSIONS`
- `OUTLOOK_LIST_USER_CALENDARS_EVENTS`
- `OUTLOOK_LIST_USER_CONTACTS`
- `OUTLOOK_LIST_USERS`
- `OUTLOOK_MOVE_MAIL_FOLDER`
- `OUTLOOK_MOVE_ME_MAIL_FOLDER`
- `OUTLOOK_MOVE_MESSAGE`
- `OUTLOOK_MOVE_MESSAGE_FROM_CHILD_FOLDER`
- `OUTLOOK_MOVE_MESSAGE_FROM_FOLDER`
- `OUTLOOK_PERMANENT_DELETE_MESSAGE`
- `OUTLOOK_PIN_MESSAGE`
- `OUTLOOK_QUERY_EMAILS`
- `OUTLOOK_REPLY_EMAIL`
- `OUTLOOK_SEARCH_MESSAGES`
- `OUTLOOK_SEND_DRAFT`
- `OUTLOOK_SEND_EMAIL`
- `OUTLOOK_SNOOZE_CALENDAR_GROUP_EVENT_REMINDER`
- `OUTLOOK_SNOOZE_EVENT_REMINDER`
- `OUTLOOK_SNOOZE_USER_CALENDAR_EVENT_REMINDER`
- `OUTLOOK_SNOOZE_USER_EVENT_REMINDER`
- `OUTLOOK_UPDATE_CALENDAR_EVENT`
- `OUTLOOK_UPDATE_CALENDAR_EVENT_IN_CALENDAR`
- `OUTLOOK_UPDATE_CALENDAR_GROUP`
- `OUTLOOK_UPDATE_CALENDAR_GROUP_CALENDAR_PERMISSION`
- `OUTLOOK_UPDATE_CALENDAR_GROUPS_CALENDARS`
- `OUTLOOK_UPDATE_CALENDAR_GROUPS_CALENDARS_EVENTS`
- `OUTLOOK_UPDATE_CALENDAR_PERMISSION`
- `OUTLOOK_UPDATE_CHILD_FOLDER_CONTACT`
- `OUTLOOK_UPDATE_CONTACT`
- `OUTLOOK_UPDATE_CONTACT_FOLDER`
- `OUTLOOK_UPDATE_CONTACT_FOLDER_CHILD_FOLDER`
- `OUTLOOK_UPDATE_CONTACT_FOLDERS_CONTACTS`
- `OUTLOOK_UPDATE_EMAIL`
- `OUTLOOK_UPDATE_EMAIL_RULE`
- `OUTLOOK_UPDATE_EVENT_EXTENSION`
- `OUTLOOK_UPDATE_EVENT_EXTENSION_IN_CALENDAR_GROUP`
- `OUTLOOK_UPDATE_INFERENCE_CLASSIFICATION`
- `OUTLOOK_UPDATE_MAIL_FOLDER`
- `OUTLOOK_UPDATE_MAILBOX_SETTINGS`
- `OUTLOOK_UPDATE_MASTER_CATEGORY`
- `OUTLOOK_UPDATE_ME_CONTACTS_EXTENSIONS`
- `OUTLOOK_UPDATE_USER_CALENDAR`
- `OUTLOOK_UPDATE_USER_CALENDAR_EVENT`
- `OUTLOOK_UPDATE_USER_CALENDAR_PERMISSION`
- `OUTLOOK_UPDATE_USER_CALENDARS`
- `OUTLOOK_UPDATE_USER_CHILD_FOLDER_MESSAGE`
- `OUTLOOK_UPDATE_USER_CONTACT_EXTENSION`
- `OUTLOOK_UPDATE_USER_CONTACTS_EXTENSIONS`
- `OUTLOOK_UPDATE_USER_CONTACTS_EXTENSIONS_DIRECT`
- `OUTLOOK_UPDATE_USER_EVENTS_EXTENSIONS`
- `OUTLOOK_UPDATE_USER_INFERENCE_CLASSIFICATION_OVERRIDE`
- `OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE`
- `OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE_EXTENSION`
- `OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE_RULE`
- `OUTLOOK_UPDATE_USER_MAIL_FOLDERS_CHILD_FOLDERS`
- `OUTLOOK_UPDATE_USER_MESSAGE_EXTENSION`

### `pandadoc`

Manifest: `src/generated/composio-manifests/pandadoc.generated.ts`

Auth configs (most-used first):
- `ac_TxEe2BLhX20P` "pandadoc-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_TxEe2BLhX20P` (0 scopes).

Status: 14 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `phantombuster`

Manifest: `src/generated/composio-manifests/phantombuster.generated.ts`

Auth configs (most-used first):
- `ac_RdI226U1f88P` "phantombuster-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_RdI226U1f88P` (0 scopes).

Status: 53 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `postiz`

Manifest: `src/generated/composio-manifests/postiz.generated.ts`

No Composio auth_config found for toolkit `postiz`. Tools cannot be audited until an auth config exists.

### `postmark`

Manifest: `src/generated/composio-manifests/postmark.generated.ts`

Auth configs (most-used first):
- `ac_EDp35eWqObnx` "postmark-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_EDp35eWqObnx` (0 scopes).

Status: 46 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `quickbooks`

Manifest: `src/generated/composio-manifests/quickbooks.generated.ts`

Auth configs (most-used first):
- `ac_i9NsTF7D0Opn` "quickbooks-clawlink" — Managed, 1 connections, 6 scopes

Audited against primary auth config `ac_i9NsTF7D0Opn` (6 scopes).

Status: 99 ok, 6 scope_gap, 0 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `QUICKBOOKS_CAPTURE_CHARGE` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |
| `QUICKBOOKS_CREATE_BANK_ACCOUNT` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |
| `QUICKBOOKS_CREATE_ECHECK_PAYMENT` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |
| `QUICKBOOKS_DELETE_BANK_ACCOUNT` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |
| `QUICKBOOKS_GET_BANK_ACCOUNT` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |
| `QUICKBOOKS_LIST_CARDS` | `com.intuit.quickbooks.payment` | composio_managed_scope_gap |

### `reddit-ads`

Manifest: `src/generated/composio-manifests/reddit-ads.generated.ts`

No Composio auth_config found for toolkit `reddit-ads`. Tools cannot be audited until an auth config exists.

### `replicate`

Manifest: `src/generated/composio-manifests/replicate.generated.ts`

Auth configs (most-used first):
- `ac_-42SAF9S3vkM` "replicate-clawlink" — BYO, 0 connections, 0 scopes

Audited against primary auth config `ac_-42SAF9S3vkM` (0 scopes).

Status: 31 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `resend`

Manifest: `src/generated/composio-manifests/resend.generated.ts`

Auth configs (most-used first):
- `ac_jPHWPSutkOX1` "resend-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_jPHWPSutkOX1` (0 scopes).

Status: 62 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `salesforce`

Manifest: `src/generated/composio-manifests/salesforce.generated.ts`

Auth configs (most-used first):
- `ac_dkxcI5zojFOo` "salesforce-clawlink" — Managed, 4 connections, 3 scopes

Audited against primary auth config `ac_dkxcI5zojFOo` (3 scopes).

Status: 60 ok, 119 scope_gap, 0 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `SALESFORCE_APPLY_LEAD_ASSIGNMENT_RULES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CLOSE_OR_ABORT_JOB` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CREATE_A_RECORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CREATE_CUSTOM_FIELD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CREATE_CUSTOM_OBJECT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CREATE_S_OBJECT_RECORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_CREATE_SOBJECT_TREE` | `api` | composio_managed_scope_gap |
| `SALESFORCE_DELETE_FILE` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_DELETE_JOB_QUERY` | `api` | composio_managed_scope_gap |
| `SALESFORCE_DELETE_SOBJECT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_DELETE_SOBJECT_COLLECTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_EXECUTE_SOBJECT_QUICK_ACTION` | `api` | composio_managed_scope_gap |
| `SALESFORCE_EXECUTE_SOSL_SEARCH` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_A_BATCH_OF_RECORDS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_ALL_NAVIGATION_ITEMS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_API` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_APP` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_APPS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_CHATTER_RESOURCES` | `chatter_api`, `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_CHILD_RECORDS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_COMPACT_LAYOUTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_COMPOSITE_RESOURCES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_COMPOSITE_SOBJECTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_CONSENT_ACTION` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_CONTACT_BY_ID` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_FILE_CONTENT` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_GET_FILE_INFORMATION` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_GET_FILE_SHARES` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_GET_GLOBAL_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_JOB_FAILED_RECORD_RESULTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_JOB_SUCCESSFUL_RECORD_RESULTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_JOB_UNPROCESSED_RECORD_RESULTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LAST_SELECTED_APP` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_METADATA_BATCH` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_METADATA_BY_NAME` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_RECORDS_BY_ID` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_RECORDS_BY_NAME` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LIST_VIEW_RESULTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LOOKUP_FIELD_SUGGESTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_LOOKUP_SUGGESTIONS_CASE_CONTACT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_MRU_LIST_VIEW_METADATA` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_MRU_LIST_VIEW_RECORDS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_OBJECT_LIST_VIEWS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_ORG_LIMITS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_PHOTO_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_PICKLIST_VALUES_BY_RECORD_TYPE` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_QUERY_JOB_INFO` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_QUERY_JOB_RESULTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_QUICK_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_RECORD_COUNTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_RECORD_EDIT_PAGE_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_RELATED_LIST_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_RELATED_LIST_PREFERENCES_BATCH` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_RELATED_LIST_RECORDS_CONTACTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_S_OBJECT_RECORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_S_OBJECTS_DESCRIBE_LAYOUTS_RECORD_TYPE_ID` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_S_OBJECTS_UPDATED` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SEARCH_LAYOUT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SEARCH_SUGGESTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_BY_EXTERNAL_ID` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_COLLECTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_LIST_VIEW` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_LIST_VIEWS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_PLATFORMACTION` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_QUICK_ACTION_DEFAULT_VALUES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECT_RELATIONSHIP` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SOBJECTS_SOBJECT_DESCRIBE_APPROVALLAYOUTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SUPPORT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SUPPORT_KNOWLEDGE_ARTICLES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_SUPPORTED_OBJECTS_DIRECTORY` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_THEME` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UI_API_ACTIONS_LOOKUP_ACCOUNT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UI_API_ACTIONS_RECORD_RELATED_LIST` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UI_API_APPS_USER_NAV_ITEMS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UI_API_LIST_INFO_RECENT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UI_API_RECORD_UI` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UIAPI_ACTIONS_MRU_LIST_ACCOUNT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_ALL_ACCOUNTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_RECENT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_SEARCH_RESULT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_GET_UIAPI_RELATED_LIST_PREFERENCES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_ACTIONS_CUSTOM` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_ACTIONS_STANDARD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_APPMENU_SALESFORCE1` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_PROCESS_RULES_S_OBJECT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_QUICK_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_SOBJECT_QUICK_ACTION_DEFAULT_VALUES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_SOBJECTS_GLOBAL_DESCRIBE_LAYOUTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_SOBJECTS_QUICK_ACTION` | `api` | composio_managed_scope_gap |
| `SALESFORCE_HEAD_SOBJECTS_USER_PASSWORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LIST_ANALYTICS_TEMPLATES` | `api`, `wave_api` | composio_managed_scope_gap |
| `SALESFORCE_LIST_CUSTOM_INVOCABLE_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LIST_DASHBOARDS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LIST_REPORTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LIST_STANDARD_INVOCABLE_ACTIONS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LOG_CALL` | `api` | composio_managed_scope_gap |
| `SALESFORCE_LOG_EMAIL_ACTIVITY` | `api` | composio_managed_scope_gap |
| `SALESFORCE_PARAMETERIZED_SEARCH` | `api` | composio_managed_scope_gap |
| `SALESFORCE_PATCH_COMPOSITE_SOBJECTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_POST_COMPOSITE_SOBJECTS` | `api` | composio_managed_scope_gap |
| `SALESFORCE_POST_PARAMETERIZED_SEARCH` | `api` | composio_managed_scope_gap |
| `SALESFORCE_QUERY_ALL` | `api` | composio_managed_scope_gap |
| `SALESFORCE_RETRIEVE_OPPORTUNITIES_DATA` | `api` | composio_managed_scope_gap |
| `SALESFORCE_RUN_REPORT` | `api` | composio_managed_scope_gap |
| `SALESFORCE_SEARCH_KNOWLEDGE_ARTICLES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_SET_USER_PASSWORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_SOBJECT_ROWS_UPDATE` | `api` | composio_managed_scope_gap |
| `SALESFORCE_SOBJECT_USER_PASSWORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_TOOLING_QUERY` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPDATE_FAVORITE` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPDATE_LIST_VIEW_PREFERENCES` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_UPDATE_RECORD` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPDATE_RELATED_LIST_PREFERENCES` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPDATE_TASK` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPLOAD_FILE` | `api`, `chatter_api` | composio_managed_scope_gap |
| `SALESFORCE_UPLOAD_JOB_DATA` | `api` | composio_managed_scope_gap |
| `SALESFORCE_UPSERT_SOBJECT_BY_EXTERNAL_ID` | `api`, `web` | composio_managed_scope_gap |

### `semrush`

Manifest: `src/generated/composio-manifests/semrush.generated.ts`

Auth configs (most-used first):
- `ac_ykUTrP7llDMI` "semrush-clawlink" — BYO, 1 connections, 0 scopes

Audited against primary auth config `ac_ykUTrP7llDMI` (0 scopes).

Status: 37 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `sendgrid`

Manifest: `src/generated/composio-manifests/sendgrid.generated.ts`

Auth configs (most-used first):
- `ac_tQ0YpfJjxVZ0` "sendgrid-clawlink" — BYO, 0 connections, 0 scopes

Audited against primary auth config `ac_tQ0YpfJjxVZ0` (0 scopes).

Status: 200 not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)

### `shopify`

Manifest: `src/generated/composio-manifests/shopify.generated.ts`

Auth configs (most-used first):
- `ac_L2CDirqQivx_` "shopify-clawlink" — BYO, 4 connections, 4 scopes

Audited against primary auth config `ac_L2CDirqQivx_` (4 scopes).

Status: 65 ok, 119 scope_gap, 16 no_scopes_declared, 161 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `SHOPIFY_ADJUST_INVENTORY_LEVEL` | `write_inventory` | composio_managed_scope_gap |
| `SHOPIFY_APPLY_FULFILLMENT_HOLD` | `write_assigned_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_APPROVE_COMMENT` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_BULK_DELETE_CUSTOMER_ADDRESSES` | `write_customers` | composio_managed_scope_gap |
| `SHOPIFY_BULK_DELETE_METAFIELDS` | `write_customers`, `write_draft_orders`, `write_locations`, `write_inventory`, `write_content`, `write_themes`, `write_markets`, `write_price_rules`, `write_discounts`, `write_gift_cards`, `write_fulfillments`, `write_shipping`, `write_translations`, `write_metaobjects` | composio_managed_scope_gap |
| `SHOPIFY_BULK_DELETE_METAOBJECTS` | `write_metaobjects` | composio_managed_scope_gap |
| `SHOPIFY_BULK_QUERY_OPERATION` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_CANCEL_APP_SUBSCRIPTION` | `write_own_subscription_contracts` | composio_managed_scope_gap |
| `SHOPIFY_CANCEL_FULFILLMENT_ORDER` | `read_assigned_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_CANCEL_ORDER` | `write_marketplace_orders` | composio_managed_scope_gap |
| `SHOPIFY_COMPLETE_DRAFT_ORDER` | `write_draft_orders` | composio_managed_scope_gap |
| `SHOPIFY_CONNECT_INVENTORY_LEVEL` | `write_inventory` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_ARTICLES` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_BLOGS` | `read_content`, `write_content` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_DRAFT_ORDERS` | `read_draft_orders` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_LOCATION` | `read_locations` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_PAGES` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_COUNT_PRICE_RULES` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_APP_SUBSCRIPTION` | `write_app_subscriptions` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_ARTICLE` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_ARTICLE_COMMENT` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_BLOG` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_CUSTOM_COLLECTION` | `read_custom_collections`, `write_custom_collections` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_CUSTOMER_ACCOUNT_ACTIVATION_URL` | `write_customers` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_DISCOUNT_CODE_BATCH` | `write_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_DRAFT_ORDER` | `write_shopify_payments_dispute_evidences` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_EVENT_BRIDGE_WEBHOOK_SUBSCRIPTION` | `write_webhooks` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_GIFT_CARD` | `read_assigned_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_MARKETING_ENGAGEMENTS` | `write_marketing_events` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_MARKETING_EVENT` | `read_locations` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_ONE_TIME_APPLICATION_CHARGE` | `write_application_charges` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_ORDER_TRANSACTION` | `marketplace_orders` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_PAGE` | `write_content`, `read_content` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_PRICE_RULE` | `write_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_PRODUCT_VARIANT` | `write_product_listings` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_PUB_SUB_WEBHOOK_SUBSCRIPTION` | `write_webhooks` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_REDIRECT` | `write_online_store_navigation` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_RESOURCE_FEEDBACK` | `write_resource_feedbacks` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_SCRIPT_TAG` | `read_resource_feedbacks` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_STOREFRONT_ACCESS_TOKEN` | `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`, `unauthenticated_read_customers`, `unauthenticated_write_customers`, `unauthenticated_read_customer_tags`, `unauthenticated_read_content`, `unauthenticated_read_metaobjects`, `unauthenticated_read_product_inventory`, `unauthenticated_read_product_pickup_locations`, `unauthenticated_read_product_tags`, `unauthenticated_read_selling_plans` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_THEME` | `write_themes` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_WEBHOOK` | `write_webhooks` | composio_managed_scope_gap |
| `SHOPIFY_CREATE_WEBHOOK_SUBSCRIPTION` | `write_webhooks` | composio_managed_scope_gap |
| `SHOPIFY_CREATES_OR_UPDATES_AN_ASSET_FOR_A_THEME` | `write_themes` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_ARTICLE` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_BLOG` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_COMMENT` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_CUSTOMER` | `write_customers` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_DRAFT_ORDER` | `write_draft_orders` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_FULFILLMENT_SERVICE` | `write_fulfillments` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_INVENTORY_LEVEL` | `write_inventory` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_MARKETING_EVENT` | `write_marketing_events` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_METAOBJECT` | `write_metaobjects` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_METAOBJECT_DEFINITION` | `write_metaobject_definitions` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_PAGE` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_PRICE_RULE` | `write_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_REDIRECT` | `write_content` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_SAVED_SEARCH` | `write_customers`, `write_draft_orders`, `write_discounts`, `write_files`, `write_online_store_navigation` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_STOREFRONT_ACCESS_TOKEN` | `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`, `unauthenticated_read_customers`, `unauthenticated_write_customers`, `unauthenticated_read_customer_tags`, `unauthenticated_read_content`, `unauthenticated_read_product_tags`, `unauthenticated_read_product_inventory`, `unauthenticated_read_product_pickup_locations`, `unauthenticated_read_selling_plans`, `unauthenticated_read_metaobjects` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_THEME` | `write_themes` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_THEME_ASSET` | `write_themes`, `read_themes` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_WEB_PRESENCE` | `read_markets`, `write_markets` | composio_managed_scope_gap |
| `SHOPIFY_DELETE_WEBHOOK_SUBSCRIPTION` | `write_webhooks` | composio_managed_scope_gap |
| `SHOPIFY_DISABLE_GIFT_CARD` | `write_gift_cards` | composio_managed_scope_gap |
| `SHOPIFY_ENABLE_STANDARD_METAOBJECT_DEFINITION` | `write_metaobject_definitions`, `read_metaobject_definitions` | composio_managed_scope_gap |
| `SHOPIFY_GET_APP_BY_HANDLE` | `read_apps` | composio_managed_scope_gap |
| `SHOPIFY_GET_APP_INSTALLATION` | `read_apps` | composio_managed_scope_gap |
| `SHOPIFY_GET_ARTICLE` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_BATCH_DISCOUNT_CODES` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_BLOG` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_BLOG_ARTICLE_TAGS` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_BULK_OPERATION` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_GET_CARRIER_SERVICES` | `read_shipping`, `write_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_CATALOGS_COUNT` | `read_product_listings` | composio_managed_scope_gap |
| `SHOPIFY_GET_CHECKOUT_PROFILE` | `read_checkouts` | composio_managed_scope_gap |
| `SHOPIFY_GET_CHECKOUTS_COUNT` | `read_checkouts` | composio_managed_scope_gap |
| `SHOPIFY_GET_COLLECTION_BY_ID` | `read_checkouts` | composio_managed_scope_gap |
| `SHOPIFY_GET_COMMENTS_COUNT` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_CONSENT_POLICY` | `read_privacy_settings` | composio_managed_scope_gap |
| `SHOPIFY_GET_COUNTRIES` | `read_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_COUNTRIES_PARAM_COUNTRY_ID_PROVINCES_COUNT` | `read_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_COUNTRIES_PARAM_COUNTRY_ID_PROVINCES_PARAM_PROVI` | `read_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_COUNTRY` | `read_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_COUNTRY_PROVINCES` | `read_shipping` | composio_managed_scope_gap |
| `SHOPIFY_GET_CURRENCIES` | `read_shop` | composio_managed_scope_gap |
| `SHOPIFY_GET_CUSTOMER` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_GET_CUSTOMER_ADDRESS` | `read_shop` | composio_managed_scope_gap |
| `SHOPIFY_GET_CUSTOMER_ADDRESSES` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_GET_CUSTOMERS_COUNT` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_GET_CUSTOMERS_SEARCH` | `read_customers` | composio_managed_scope_gap |
| `SHOPIFY_GET_DISCOUNT_CODE` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_DISCOUNT_CODES_COUNT` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_DISCOUNT_CODES_LOOKUP` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_DRAFT_ORDER` | `read_draft_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT` | `read_assigned_fulfillment_orders`, `read_merchant_managed_fulfillment_orders`, `read_third_party_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_ORDER` | `write_assigned_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_ORDER_FULFILLMENTS` | `read_marketplace_orders`, `read_assigned_fulfillment_orders`, `read_merchant_managed_fulfillment_orders`, `read_third_party_fulfillment_orders`, `read_marketplace_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_ORDER_LOCATIONS_FOR_MOVE` | `read_merchant_managed_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_ORDER_MOVE_LOCATIONS` | `read_merchant_managed_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_ORDERS_FOR_ORDER` | `write_assigned_fulfillment_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_FULFILLMENT_SERVICES` | `write_fulfillments` | composio_managed_scope_gap |
| `SHOPIFY_GET_GIFT_CARD_BY_ID` | `read_gift_cards` | composio_managed_scope_gap |
| `SHOPIFY_GET_GIFT_CARDS` | `read_gift_cards`, `write_gift_cards` | composio_managed_scope_gap |
| `SHOPIFY_GET_GIFT_CARDS_COUNT` | `read_gift_cards` | composio_managed_scope_gap |
| `SHOPIFY_GET_INVENTORY_ITEM` | `read_inventory` | composio_managed_scope_gap |
| `SHOPIFY_GET_INVENTORY_ITEMS` | `read_inventory` | composio_managed_scope_gap |
| `SHOPIFY_GET_INVENTORY_LEVELS` | `read_inventory` | composio_managed_scope_gap |
| `SHOPIFY_GET_INVENTORY_LEVELS_FOR_LOCATION` | `read_inventory` | composio_managed_scope_gap |
| `SHOPIFY_GET_LOCATION` | `read_locations` | composio_managed_scope_gap |
| `SHOPIFY_GET_LOCATIONS_COUNT` | `read_locations`, `read_inventory`, `read_markets_home` | composio_managed_scope_gap |
| `SHOPIFY_GET_MARKETING_EVENT` | `read_marketing_events` | composio_managed_scope_gap |
| `SHOPIFY_GET_MARKETING_EVENTS_COUNT` | `read_marketing_events` | composio_managed_scope_gap |
| `SHOPIFY_GET_METAFIELD` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_ORDER` | `read_all_orders` | composio_managed_scope_gap |
| `SHOPIFY_GET_PAGE_BY_ID` | `read_content` | composio_managed_scope_gap |
| `SHOPIFY_GET_PRICE_RULE_BATCH_INFO` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_PRICE_RULE_DISCOUNT_CODES` | `read_price_rules` | composio_managed_scope_gap |
| `SHOPIFY_GET_REDIRECT` | `content` | composio_managed_scope_gap |
| `SHOPIFY_GET_REDIRECT_BY_ID` | `read_content` | composio_managed_scope_gap |

**Imported but not in current Composio catalog:**

- `SHOPIFY_GET_REDIRECTS`
- `SHOPIFY_GET_REDIRECTS_COUNT`
- `SHOPIFY_GET_REFUND`
- `SHOPIFY_GET_SCRIPTTAG`
- `SHOPIFY_GET_SEGMENTS_COUNT`
- `SHOPIFY_GET_SHIPPING_ZONES`
- `SHOPIFY_GET_SHOP_BILLING_ADDRESS`
- `SHOPIFY_GET_SHOP_DETAILS`
- `SHOPIFY_GET_SHOP_METAFIELD`
- `SHOPIFY_GET_SMART_COLLECTION`
- `SHOPIFY_GET_SMART_COLLECTION_BY_ID`
- `SHOPIFY_GET_SMART_COLLECTIONS`
- `SHOPIFY_GET_SMART_COLLECTIONS_COUNT`
- `SHOPIFY_GET_STOREFRONT_ACCESS_TOKENS`
- `SHOPIFY_GET_TENDER_TRANSACTIONS`
- `SHOPIFY_GET_THEME`
- `SHOPIFY_GET_THEMES`
- `SHOPIFY_GET_THEMES_PARAM_THEME_ID_ASSETS`
- `SHOPIFY_GET_TRANSACTION`
- `SHOPIFY_GET_WEBHOOK`
- `SHOPIFY_GET_WEBHOOK_SUBSCRIPTIONS_COUNT`
- `SHOPIFY_GRAPH_QL_QUERY`
- `SHOPIFY_LIST_APPLICATION_CREDITS`
- `SHOPIFY_LIST_ARTICLE_AUTHORS`
- `SHOPIFY_LIST_ARTICLE_TAGS`
- `SHOPIFY_LIST_AVAILABLE_LOCALES`
- `SHOPIFY_LIST_BLOG_ARTICLES`
- `SHOPIFY_LIST_BLOGS`
- `SHOPIFY_LIST_BULK_OPERATIONS`
- `SHOPIFY_LIST_CHANNELS`
- `SHOPIFY_LIST_CHECKOUT_PROFILES`
- `SHOPIFY_LIST_COLLECTION_PRODUCTS`
- `SHOPIFY_LIST_COLLECTS`
- `SHOPIFY_LIST_COMMENTS`
- `SHOPIFY_LIST_CURRENCIES`
- `SHOPIFY_LIST_CUSTOM_COLLECTIONS`
- `SHOPIFY_LIST_CUSTOMER_ORDERS`
- `SHOPIFY_LIST_CUSTOMERS`
- `SHOPIFY_LIST_DRAFT_ORDERS`
- `SHOPIFY_LIST_INVENTORY_LEVELS`
- `SHOPIFY_LIST_LOCATIONS`
- `SHOPIFY_LIST_MARKETING_EVENTS`
- `SHOPIFY_LIST_ORDER`
- `SHOPIFY_LIST_ORDER_REFUNDS`
- `SHOPIFY_LIST_ORDERS`
- `SHOPIFY_LIST_PAGES`
- `SHOPIFY_LIST_PAYMENT_TERMS_TEMPLATES`
- `SHOPIFY_LIST_PRODUCT_IMAGES`
- `SHOPIFY_LIST_PRODUCT_VARIANTS`
- `SHOPIFY_LIST_RESOURCE_FEEDBACKS`
- `SHOPIFY_LIST_SCRIPT_TAGS`
- `SHOPIFY_LIST_THEME_ASSETS`
- `SHOPIFY_LIST_TRANSACTIONS`
- `SHOPIFY_MARK_COMMENT_AS_NOT_SPAM`
- `SHOPIFY_MARK_COMMENT_AS_SPAM`
- `SHOPIFY_MODIFY_AN_EXISTING_PRODUCT_VARIANT`
- `SHOPIFY_MODIFY_EXISTING_WEBHOOK`
- `SHOPIFY_MOVE_FULFILLMENT_ORDER`
- `SHOPIFY_PIN_METAFIELD_DEFINITION`
- `SHOPIFY_QUERY_APP_BY_KEY`
- `SHOPIFY_QUERY_BUSINESS_ENTITIES`
- `SHOPIFY_QUERY_BUSINESS_ENTITY`
- `SHOPIFY_QUERY_CATALOGS`
- `SHOPIFY_QUERY_CHANNEL`
- `SHOPIFY_QUERY_CONSENT_POLICY_REGIONS`
- `SHOPIFY_QUERY_CURRENT_APP_INSTALLATION`
- `SHOPIFY_QUERY_CURRENT_BULK_OPERATION`
- `SHOPIFY_QUERY_CUSTOMER_ACCOUNT_PAGES`
- `SHOPIFY_QUERY_DELETION_EVENTS`
- `SHOPIFY_QUERY_DISPUTES`
- `SHOPIFY_QUERY_DOMAIN`
- `SHOPIFY_QUERY_EVENTS`
- `SHOPIFY_QUERY_EVENTS_COUNT`
- `SHOPIFY_QUERY_JOB`
- `SHOPIFY_QUERY_METAFIELD_DEFINITION`
- `SHOPIFY_QUERY_METAFIELD_DEFINITION_TYPES`
- `SHOPIFY_QUERY_METAFIELD_DEFINITIONS`
- `SHOPIFY_QUERY_NODE`
- `SHOPIFY_QUERY_NODES`
- `SHOPIFY_QUERY_ONLINE_STORE`
- `SHOPIFY_QUERY_PRODUCT_DUPLICATE_JOB`
- `SHOPIFY_QUERY_PUBLIC_API_VERSIONS`
- `SHOPIFY_QUERY_PUBLICATION`
- `SHOPIFY_QUERY_SERVER_PIXEL`
- `SHOPIFY_QUERY_SHOP`
- `SHOPIFY_QUERY_SHOP_BILLING_PREFERENCES`
- `SHOPIFY_QUERY_SHOP_PAY_PAYMENT_REQUEST_RECEIPTS`
- `SHOPIFY_QUERY_SHOPIFY_FUNCTIONS`
- `SHOPIFY_QUERY_STANDARD_METAFIELD_DEFINITION_TEMPLATES`
- `SHOPIFY_QUERY_TAXONOMY`
- `SHOPIFY_QUERY_WEBHOOK_SUBSCRIPTION`
- `SHOPIFY_QUERY_WEBHOOK_SUBSCRIPTIONS`
- `SHOPIFY_RECEIVE_A_COUNT_OF_ALL_PRODUCT_IMAGES`
- `SHOPIFY_RECEIVE_A_SINGLE_FULFILLMENT`
- `SHOPIFY_RECEIVE_A_SINGLE_WEBHOOK`
- `SHOPIFY_RELEASE_FULFILLMENT_HOLD`
- `SHOPIFY_RELEASE_FULFILLMENT_ORDER_HOLD`
- `SHOPIFY_REOPEN_CLOSED_ORDER`
- `SHOPIFY_RESTORE_COMMENT`
- `SHOPIFY_RETRIEVE_A_SPECIFIC_METAFIELD`
- `SHOPIFY_RETRIEVE_LIST_METAFIELDS_RESOURCE_S_ENDPOINT`
- `SHOPIFY_RETRIEVE_SPECIFIC_FULFILLMENT_ORDER`
- `SHOPIFY_RETRIEVES_A_LIST_OF_ALL_ARTICLE_TAGS`
- `SHOPIFY_RETRIEVES_A_LIST_OF_PRICE_RULES`
- `SHOPIFY_RETRIEVES_A_LIST_OF_PRODUCTS`
- `SHOPIFY_RETRIEVES_A_LIST_OF_WEBHOOKS`
- `SHOPIFY_RETRIEVES_A_SINGLE_LOCATION_BY_ITS_ID`
- `SHOPIFY_RETRIEVES_A_SINGLE_PRICE_RULE`
- `SHOPIFY_RETRIEVES_A_SINGLE_PRODUCT`
- `SHOPIFY_RETRIEVES_AN_ORDER_COUNT`
- `SHOPIFY_RETRIEVES_LIST_ALL_ARTICLE_TAGS_SPECIFIC_BLOG`
- `SHOPIFY_RETRIEVES_LIST_DISCOUNT_CODES_DISCOUNT_CODE`
- `SHOPIFY_RETRIEVES_LIST_STOREFRONT_ACCESS_TOKENS_THAT_HAVE`
- `SHOPIFY_RETRIEVES_THE_SHOP_S_CONFIGURATION`
- `SHOPIFY_REVOKE_APP_ACCESS_SCOPES`
- `SHOPIFY_RUN_BULK_MUTATION_OPERATION`
- `SHOPIFY_RUN_BULK_OPERATION_QUERY`
- `SHOPIFY_SEARCHES_FOR_GIFT_CARDS`
- `SHOPIFY_SEND_CUSTOMER_ACCOUNT_INVITE`
- `SHOPIFY_SEND_CUSTOMER_INVITE`
- `SHOPIFY_SEND_INVOICE`
- `SHOPIFY_SET_DEFAULT_CUSTOMER_ADDRESS`
- `SHOPIFY_SET_FULFILLMENT_ORDERS_DEADLINE`
- `SHOPIFY_SET_INVENTORY_LEVEL`
- `SHOPIFY_SET_METAFIELDS`
- `SHOPIFY_TRIGGER_SHOPIFY_FLOW`
- `SHOPIFY_UPDATE_APP_SUBSCRIPTION_LINE_ITEM`
- `SHOPIFY_UPDATE_ARTICLE`
- `SHOPIFY_UPDATE_BLOG`
- `SHOPIFY_UPDATE_COMMENT`
- `SHOPIFY_UPDATE_CUSTOM_COLLECTION`
- `SHOPIFY_UPDATE_CUSTOMER`
- `SHOPIFY_UPDATE_CUSTOMER_ADDRESS`
- `SHOPIFY_UPDATE_CUSTOMERS_PARAM_CUSTOMER_ID_ADDRESSES_SET`
- `SHOPIFY_UPDATE_DRAFT_ORDER`
- `SHOPIFY_UPDATE_FULFILLMENT_TRACKING`
- `SHOPIFY_UPDATE_GIFT_CARD`
- `SHOPIFY_UPDATE_INVENTORY_ITEM`
- `SHOPIFY_UPDATE_MARKETING_EVENT`
- `SHOPIFY_UPDATE_METAFIELD`
- `SHOPIFY_UPDATE_METAFIELD_BY_ID`
- `SHOPIFY_UPDATE_METAFIELD_DEFINITION`
- `SHOPIFY_UPDATE_METAFIELD_GENERIC`
- `SHOPIFY_UPDATE_METAFIELD_RESOURCE`
- `SHOPIFY_UPDATE_ORDER`
- `SHOPIFY_UPDATE_PAGE`
- `SHOPIFY_UPDATE_PRICE_RULE`
- `SHOPIFY_UPDATE_PRODUCT_IMAGE`
- `SHOPIFY_UPDATE_PRODUCT_METAFIELD`
- `SHOPIFY_UPDATE_PUB_SUB_WEBHOOK_SUBSCRIPTION`
- `SHOPIFY_UPDATE_REDIRECT`
- `SHOPIFY_UPDATE_REDIRECT_ALT`
- `SHOPIFY_UPDATE_SCRIPT_TAG`
- `SHOPIFY_UPDATE_SHOP_METAFIELD`
- `SHOPIFY_UPDATE_SMART_COLLECTION`
- `SHOPIFY_UPDATE_SMART_COLLECTION_ALT`
- `SHOPIFY_UPDATE_SMART_COLLECTION_ORDER`
- `SHOPIFY_UPDATE_THEME`
- `SHOPIFY_UPDATE_WEBHOOK_SUBSCRIPTION`
- `SHOPIFY_UPDATES_A_PRODUCT`
- `SHOPIFY_UPDATES_AN_EXISTING_DISCOUNT_CODE`

**No scopes declared in metadata** (16 tools — verify with a real call before assuming OK):

- `SHOPIFY_COUNT_EVENTS`
- `SHOPIFY_COUNT_WEBHOOKS`
- `SHOPIFY_CREATE_CUSTOMER`
- `SHOPIFY_CREATE_DELEGATE_ACCESS_TOKEN`
- `SHOPIFY_CREATE_DISCOUNT_CODE`
- `SHOPIFY_DELETE_WEBHOOK`
- `SHOPIFY_GET_ACCESS_SCOPES`
- `SHOPIFY_GET_APP`
- `SHOPIFY_GET_APPLICATION_CHARGE_BY_ID`
- `SHOPIFY_GET_APPLICATION_CHARGES`
- `SHOPIFY_GET_APPLICATION_CREDITS`
- `SHOPIFY_GET_CUSTOM_COLLECTIONS_COUNT`
- `SHOPIFY_GET_EVENT`
- `SHOPIFY_GET_EVENTS`
- `SHOPIFY_GET_FULFILLMENT_EVENTS`
- `SHOPIFY_GET_RECURRING_APPLICATION_CHARGES`

### `slack`

Manifest: `src/generated/composio-manifests/slack.generated.ts`

Auth configs (most-used first):
- `ac_uz1lOBpfgGJf` "slack-clawlink" — Managed, 0 connections, 45 scopes

Audited against primary auth config `ac_uz1lOBpfgGJf` (45 scopes).

Status: 83 ok, 51 scope_gap, 11 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `SLACK_ADD_EMOJI` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_ADD_EMOJI_ALIAS` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_ADD_ENTERPRISE_USER_TO_WORKSPACE` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_ADD_STAR` | `stars:write` | composio_managed_scope_gap |
| `SLACK_ADMIN_CONVERSATIONS_SEARCH` | `admin.conversations:read` | likely_provider_tier_gate |
| `SLACK_CONVERT_CHANNEL_TO_PRIVATE` | `admin.conversations:write` | likely_provider_tier_gate |
| `SLACK_CREATE_CANVAS` | `canvases:write` | composio_managed_scope_gap |
| `SLACK_CREATE_CHANNEL_BASED_CONVERSATION` | `admin.conversations:write` | likely_provider_tier_gate |
| `SLACK_CREATE_ENTERPRISE_TEAM` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_DELETE_CANVAS` | `canvases:write` | composio_managed_scope_gap |
| `SLACK_DELETE_CHANNEL` | `admin.conversations:write` | likely_provider_tier_gate |
| `SLACK_EDIT_CANVAS` | `canvases:write` | composio_managed_scope_gap |
| `SLACK_GET_AUDIT_ACTION_TYPES` | `auditlogs:read` | composio_managed_scope_gap |
| `SLACK_GET_CHANNEL_CONVERSATION_PREFERENCES` | `admin.conversations:read` | likely_provider_tier_gate |
| `SLACK_GET_WORKSPACE_CONNECTIONS_FOR_CHANNEL` | `admin.conversations:read` | likely_provider_tier_gate |
| `SLACK_GET_WORKSPACE_SETTINGS` | `admin.teams:read` | likely_provider_tier_gate |
| `SLACK_INVITE_USER_TO_CHANNEL` | `admin.conversations:write` | likely_provider_tier_gate |
| `SLACK_INVITE_USER_TO_WORKSPACE` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_INVITE_USERS_TO_A_SLACK_CHANNEL` | `channels:write.invites`, `groups:write.invites` | composio_managed_scope_gap |
| `SLACK_LIST_ADMIN_APPS_APPROVED` | `admin.apps:read` | likely_provider_tier_gate |
| `SLACK_LIST_ADMIN_APPS_REQUESTS` | `admin.apps:read` | likely_provider_tier_gate |
| `SLACK_LIST_ADMIN_EMOJI` | `admin.teams:read` | likely_provider_tier_gate |
| `SLACK_LIST_APPROVED_WORKSPACE_INVITE_REQUESTS` | `admin.invites:read` | likely_provider_tier_gate |
| `SLACK_LIST_DENIED_WORKSPACE_INVITE_REQUESTS` | `admin.invites:read` | likely_provider_tier_gate |
| `SLACK_LIST_ENTERPRISE_TEAMS` | `admin.teams:read` | likely_provider_tier_gate |
| `SLACK_LIST_IDP_GROUPS_LINKED_TO_CHANNEL` | `admin.conversations:read` | likely_provider_tier_gate |
| `SLACK_LIST_PENDING_WORKSPACE_INVITE_REQUESTS` | `admin.invites:read` | likely_provider_tier_gate |
| `SLACK_LIST_RESTRICTED_APPS` | `admin.apps:read` | likely_provider_tier_gate |
| `SLACK_LIST_STARRED_ITEMS` | `stars:read` | composio_managed_scope_gap |
| `SLACK_LIST_WORKSPACE_ADMINS` | `admin.teams:read` | likely_provider_tier_gate |
| `SLACK_LIST_WORKSPACE_OWNERS` | `admin.teams:read` | likely_provider_tier_gate |
| `SLACK_LIST_WORKSPACE_USERS` | `admin.users:read` | likely_provider_tier_gate |
| `SLACK_LOOKUP_CANVAS_SECTIONS` | `canvases:read` | composio_managed_scope_gap |
| `SLACK_READ_AUDIT_LOGS` | `auditlogs:read` | composio_managed_scope_gap |
| `SLACK_REMOVE_EMOJI` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_REMOVE_STAR` | `stars:write` | composio_managed_scope_gap |
| `SLACK_REMOVE_USER_FROM_WORKSPACE` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_RENAME_EMOJI` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_RESET_USER_SESSIONS` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_RESTRICT_APP_INSTALLATION` | `admin.apps:write` | likely_provider_tier_gate |
| `SLACK_SCIM_GET_CONFIG` | `admin` | likely_provider_tier_gate |
| `SLACK_SET_ADMIN_USER` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_SET_CONVERSATION_PREFS` | `admin.conversations:write` | likely_provider_tier_gate |
| `SLACK_SET_CONVERSATION_PURPOSE` | `channels:write.topic`, `groups:write.topic`, `im:write.topic`, `mpim:write.topic` | composio_managed_scope_gap |
| `SLACK_SET_DEFAULT_CHANNELS` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_SET_THE_TOPIC_OF_A_CONVERSATION` | `channels:write.topic`, `groups:write.topic`, `im:write.topic`, `mpim:write.topic` | composio_managed_scope_gap |
| `SLACK_SET_WORKSPACE_DESCRIPTION` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_SET_WORKSPACE_ICON` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_SET_WORKSPACE_NAME` | `admin.teams:write` | likely_provider_tier_gate |
| `SLACK_SET_WORKSPACE_OWNER` | `admin.users:write` | likely_provider_tier_gate |
| `SLACK_SET_WORKSPACES_FOR_CHANNEL` | `admin.conversations:write` | likely_provider_tier_gate |

**No scopes declared in metadata** (11 tools — verify with a real call before assuming OK):

- `SLACK_ADD_REMOTE_FILE`
- `SLACK_API_TEST`
- `SLACK_GET_AUDIT_SCHEMAS`
- `SLACK_LIST_AUTH_TEAMS`
- `SLACK_LIST_SCHEDULED_MESSAGES`
- `SLACK_REMOVE_REMOTE_FILE`
- `SLACK_RETRIEVE_A_USER_S_IDENTITY_DETAILS`
- `SLACK_RETRIEVE_MESSAGE_PERMALINK_URL`
- `SLACK_RTM_CONNECT`
- `SLACK_TEST_AUTH`
- `SLACK_UPDATE_REMOTE_FILE`

### `snapchat`

Manifest: `src/generated/composio-manifests/snapchat.generated.ts`

No Composio auth_config found for toolkit `snapchat`. Tools cannot be audited until an auth config exists.

### `stripe`

Manifest: `src/generated/composio-manifests/stripe.generated.ts`

No Composio auth_config found for toolkit `stripe`. Tools cannot be audited until an auth config exists.

### `tiktok`

Manifest: `src/generated/composio-manifests/tiktok.generated.ts`

No Composio auth_config found for toolkit `tiktok`. Tools cannot be audited until an auth config exists.

### `trello`

Manifest: `src/generated/composio-manifests/trello.generated.ts`

Auth configs (most-used first):
- `ac_vw3OlJfCHUpo` "trello-clawlink" — Managed, 4 connections, 3 scopes

Audited against primary auth config `ac_vw3OlJfCHUpo` (3 scopes).

Status: 15 ok, 0 scope_gap, 185 no_scopes_declared, 122 not_in_catalog

**Imported but not in current Composio catalog:**

- `TRELLO_GET_WEBHOOKS_BY_ID_WEBHOOK_BY_FIELD`
- `TRELLO_LIST_EMOJI`
- `TRELLO_MARK_ALL_NOTIFICATIONS_READ`
- `TRELLO_MARK_BOARD_AS_VIEWED`
- `TRELLO_MARK_CARD_NOTIFICATIONS_READ`
- `TRELLO_MOVE_ALL_LIST_CARDS`
- `TRELLO_REMOVE_BOARD_MEMBER`
- `TRELLO_REMOVE_BOARD_STAR`
- `TRELLO_REMOVE_CARD_LABEL_BY_COLOR`
- `TRELLO_REMOVE_LABEL_FROM_CARD`
- `TRELLO_REMOVE_MEMBER_FROM_CARD`
- `TRELLO_REMOVE_MEMBER_FROM_ORG`
- `TRELLO_UPDATE_ACTIONS_BY_ID_ACTION`
- `TRELLO_UPDATE_ACTIONS_TEXT_BY_ID_ACTION`
- `TRELLO_UPDATE_BOARD_MEMBERSHIP`
- `TRELLO_UPDATE_BOARD_SIDEBAR_ACTIONS_PREFS`
- `TRELLO_UPDATE_BOARD_SIDEBAR_ACTIVITY_PREFS`
- `TRELLO_UPDATE_BOARD_SIDEBAR_MEMBERS_PREF`
- `TRELLO_UPDATE_BOARD_STARS_POSITION_BY_ID_MEMBER_BY_ID_BOARD_`
- `TRELLO_UPDATE_BOARDS_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_CLOSED_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_DESC_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_ID_ORGANIZATION_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_BLUE_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_GREEN_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_ORANGE_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_PURPLE_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_RED_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_LABEL_NAMES_YELLOW_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_MEMBERS_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_MEMBERS_BY_ID_BOARD_BY_ID_MEMBER`
- `TRELLO_UPDATE_BOARDS_MY_PREFS_EMAIL_POSITION_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_MY_PREFS_ID_EMAIL_LIST_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_MY_PREFS_SHOW_SIDEBAR_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_NAME_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_BACKGROUND_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_CALENDAR_FEED_ENABLED_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_CARD_AGING_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_CARD_COVERS_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_COMMENTS_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_INVITATIONS_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_PERMISSION_LEVEL_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_SELF_JOIN_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_PREFS_VOTING_BY_ID_BOARD`
- `TRELLO_UPDATE_BOARDS_SUBSCRIBED_BY_ID_BOARD`
- `TRELLO_UPDATE_CARDS_ACTIONS_COMMENTS_BY_ID_CARD_BY_ID_ACTION`
- `TRELLO_UPDATE_CARDS_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_CHECKLIST_ITEMS_BY_ID_CARD_BY_ID_CHECKLI`
- `TRELLO_UPDATE_CARDS_CHECKLIST_ITEMS_POSITION_BY_ID_CARD_BY_I`
- `TRELLO_UPDATE_CARDS_CHECKLIST_ITEMS_STATE_BY_ID_CARD_BY_ID_C`
- `TRELLO_UPDATE_CARDS_CHECKLISTS_CHECK_ITEMS_NAME_BY_ID_CARD_B`
- `TRELLO_UPDATE_CARDS_CLOSED_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_DESC_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_DUE_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_ID_ATTACHMENT_COVER_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_ID_BOARD_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_ID_LIST_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_ID_MEMBERS_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_LABELS_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_NAME_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_POS_BY_ID_CARD`
- `TRELLO_UPDATE_CARDS_STICKERS_BY_ID_CARD_BY_ID_STICKER`
- `TRELLO_UPDATE_CARDS_SUBSCRIBED_BY_ID_CARD`
- `TRELLO_UPDATE_CHECKLIST_ITEM_BY_IDS`
- `TRELLO_UPDATE_CHECKLISTS_BY_ID_CHECKLIST`
- `TRELLO_UPDATE_CHECKLISTS_BY_ID_CHECKLIST_BY_FIELD`
- `TRELLO_UPDATE_CHECKLISTS_ID_CARD_BY_ID_CHECKLIST`
- `TRELLO_UPDATE_CHECKLISTS_NAME_BY_ID_CHECKLIST`
- `TRELLO_UPDATE_CHECKLISTS_POS_BY_ID_CHECKLIST`
- `TRELLO_UPDATE_LABELS_BY_ID_LABEL`
- `TRELLO_UPDATE_LABELS_BY_ID_LABEL_BY_FIELD`
- `TRELLO_UPDATE_LABELS_COLOR_BY_ID_LABEL`
- `TRELLO_UPDATE_LABELS_NAME_BY_ID_LABEL`
- `TRELLO_UPDATE_LISTS_BY_ID_LIST`
- `TRELLO_UPDATE_LISTS_CLOSED_BY_ID_LIST`
- `TRELLO_UPDATE_LISTS_ID_BOARD_BY_ID_LIST`
- `TRELLO_UPDATE_LISTS_NAME_BY_ID_LIST`
- `TRELLO_UPDATE_LISTS_POS_BY_ID_LIST`
- `TRELLO_UPDATE_LISTS_SUBSCRIBED_BY_ID_LIST`
- `TRELLO_UPDATE_MEMBER_AVATAR`
- `TRELLO_UPDATE_MEMBERS_AVATAR_SOURCE_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_BIO_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_BOARD_BACKGROUNDS_BY_ID_MEMBER_BY_ID_B`
- `TRELLO_UPDATE_MEMBERS_BOARD_STARS_BY_ID_MEMBER_BY_ID_BOARD_S`
- `TRELLO_UPDATE_MEMBERS_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_CUSTOM_BOARD_BACKGROUNDS_BY_ID_MEMBER_`
- `TRELLO_UPDATE_MEMBERS_FULL_NAME_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_INITIALS_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_PREFS_COLOR_BLIND_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_PREFS_LOCALE_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_PREFS_SUMMARY_INTERVAL_BY_ID_MEMBER`
- `TRELLO_UPDATE_MEMBERS_SAVED_SEARCHES_BY_ID_MEMBER_BY_ID_SAVE`
- `TRELLO_UPDATE_MEMBERS_SAVED_SEARCHES_NAME_BY_ID_MEMBER_BY_ID`
- `TRELLO_UPDATE_MEMBERS_SAVED_SEARCHES_POS_BY_ID_MEMBER_BY_ID_`
- `TRELLO_UPDATE_MEMBERS_SAVED_SEARCHES_QUERY_BY_ID_MEMBER_BY_I`
- `TRELLO_UPDATE_MEMBERS_USERNAME_BY_ID_MEMBER`
- `TRELLO_UPDATE_NOTIFICATIONS_BY_ID_NOTIFICATION`
- `TRELLO_UPDATE_NOTIFICATIONS_UNREAD_BY_ID_NOTIFICATION`
- `TRELLO_UPDATE_ORG_GOOGLE_APPS_VERSION`
- `TRELLO_UPDATE_ORG_INVITE_RESTRICTIONS`
- `TRELLO_UPDATE_ORGANIZATION_LOGO`
- `TRELLO_UPDATE_ORGANIZATIONS_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_DESC_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_DISPLAY_NAME_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_MEMBERS_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_MEMBERS_BY_ID_ORG_BY_ID_MEMBER`
- `TRELLO_UPDATE_ORGANIZATIONS_MEMBERS_DEACTIVATION_BY_ID_ORG_B`
- `TRELLO_UPDATE_ORGANIZATIONS_MEMBERSHIPS_BY_ID_ORG_BY_ID_MEMB`
- `TRELLO_UPDATE_ORGANIZATIONS_NAME_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_ASSOCIATED_DOMAIN_BY_ID_OR`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_BOARD_VISIBILITY_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_EXTERNAL_MEMBERS_ACCESS_BY`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_PERMISSION_LEVEL_BY_ID_ORG`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_PRIVATE_BOARD_VISIBILITY_B`
- `TRELLO_UPDATE_ORGANIZATIONS_PREFS_PUBLIC_BOARD_VISIBILITY_BY`
- `TRELLO_UPDATE_ORGANIZATIONS_WEBSITE_BY_ID_ORG`
- `TRELLO_UPDATE_SESSIONS_BY_ID_SESSION`
- `TRELLO_UPDATE_WEBHOOKS_ACTIVE_BY_ID_WEBHOOK`
- `TRELLO_UPDATE_WEBHOOKS_BY_ID_WEBHOOK`
- `TRELLO_UPDATE_WEBHOOKS_CALLBACK_URL_BY_ID_WEBHOOK`
- `TRELLO_UPDATE_WEBHOOKS_DESCRIPTION_BY_ID_WEBHOOK`
- `TRELLO_UPDATE_WEBHOOKS_ID_MODEL_BY_ID_WEBHOOK`

**No scopes declared in metadata** (185 tools — verify with a real call before assuming OK):

- `TRELLO_ADD_BOARDS`
- `TRELLO_ADD_CARD_VOTE`
- `TRELLO_ADD_CARDS`
- `TRELLO_ADD_CARDS_ACTIONS_COMMENTS_BY_ID_CARD`
- `TRELLO_ADD_CARDS_ATTACHMENTS_BY_ID_CARD`
- `TRELLO_ADD_CARDS_CHECKLISTS_BY_ID_CARD`
- `TRELLO_ADD_CARDS_ID_LABELS_BY_ID_CARD`
- `TRELLO_ADD_CHECKLISTS`
- `TRELLO_ADD_CHECKLISTS_CHECK_ITEMS_BY_ID_CHECKLIST`
- `TRELLO_ADD_LABELS`
- `TRELLO_ADD_LISTS`
- `TRELLO_ADD_MEMBER_TO_CARD`
- `TRELLO_ARCHIVE_ALL_LIST_CARDS`
- `TRELLO_CONVERT_CHECKLIST_ITEM_TO_CARD`
- `TRELLO_CREATE_BOARD_LABEL`
- `TRELLO_CREATE_CARD_LABEL`
- `TRELLO_CREATE_CARD_STICKER`
- `TRELLO_CREATE_MEMBER_BOARD_BACKGROUND`
- `TRELLO_CREATE_MEMBER_BOARD_STAR`
- `TRELLO_CREATE_MEMBER_CUSTOM_BOARD_BACKGROUND`
- `TRELLO_CREATE_MEMBER_CUSTOM_EMOJI`
- `TRELLO_CREATE_MEMBER_CUSTOM_STICKER`
- `TRELLO_CREATE_MEMBER_SAVED_SEARCH`
- `TRELLO_CREATE_ORGANIZATION`
- `TRELLO_CREATE_SESSION`
- `TRELLO_DELETE_ACTION`
- `TRELLO_DELETE_CARD_ATTACHMENT`
- `TRELLO_DELETE_CARD_CHECKLIST`
- `TRELLO_DELETE_CARD_COMMENT`
- `TRELLO_DELETE_CARDS_BY_ID_CARD`
- `TRELLO_DELETE_CARDS_MEMBERS_VOTED_BY_ID_CARD_BY_ID_MEMBER`
- `TRELLO_DELETE_CARDS_STICKERS_BY_ID_CARD_BY_ID_STICKER`
- `TRELLO_DELETE_CHECKLIST_ITEM`
- `TRELLO_DELETE_CHECKLISTS_BY_ID_CHECKLIST`
- `TRELLO_DELETE_LABELS_BY_ID_LABEL`
- `TRELLO_DELETE_MEMBER_BOARD_BACKGROUND`
- `TRELLO_DELETE_MEMBER_CUSTOM_STICKER`
- `TRELLO_DELETE_MEMBER_SAVED_SEARCH`
- `TRELLO_DELETE_ORG_ASSOCIATED_DOMAIN`
- `TRELLO_DELETE_ORG_INVITE_RESTRICT`
- `TRELLO_DELETE_ORGANIZATIONS_BY_ID_ORG`
- `TRELLO_DELETE_ORGANIZATIONS_LOGO_BY_ID_ORG`
- `TRELLO_DELETE_ORGANIZATIONS_MEMBERS_BY_ID_ORG_BY_ID_MEMBER`
- `TRELLO_DELETE_TOKENS_BY_TOKEN`
- `TRELLO_DELETE_TOKENS_WEBHOOKS_BY_TOKEN_BY_ID_WEBHOOK`
- `TRELLO_DELETE_WEBHOOKS_BY_ID_WEBHOOK`
- `TRELLO_DISABLE_BOARD_POWER_UP`
- `TRELLO_DISMISS_MEMBER_MESSAGE`
- `TRELLO_ENABLE_BOARD_POWER_UP`
- `TRELLO_GENERATE_BOARD_CALENDAR_KEY`
- `TRELLO_GENERATE_BOARD_EMAIL_KEY`
- `TRELLO_GET_ACTIONS_BOARD_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_BOARD_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_CARD_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_CARD_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_DISPLAY_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_ENTITIES_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_LIST_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_LIST_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_MEMBER_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_MEMBER_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_MEMBER_CREATOR_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_MEMBER_CREATOR_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_ACTIONS_ORGANIZATION_BY_ID_ACTION`
- `TRELLO_GET_ACTIONS_ORGANIZATION_BY_ID_ACTION_BY_FIELD`
- `TRELLO_GET_BATCH`
- `TRELLO_GET_BOARDS_ACTIONS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_BOARD_STARS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_BY_ID_BOARD_BY_FIELD`
- `TRELLO_GET_BOARDS_CARDS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_CARDS_BY_ID_BOARD_BY_FILTER`
- `TRELLO_GET_BOARDS_CARDS_BY_ID_BOARD_BY_ID_CARD`
- `TRELLO_GET_BOARDS_CHECKLISTS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_DELTAS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_LABELS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_LABELS_BY_ID_BOARD_BY_ID_LABEL`
- `TRELLO_GET_BOARDS_LISTS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_MEMBERS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_MEMBERS_CARDS_BY_ID_BOARD_BY_ID_MEMBER`
- `TRELLO_GET_BOARDS_MEMBERS_INVITED_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_MEMBERS_INVITED_BY_ID_BOARD_BY_FIELD`
- `TRELLO_GET_BOARDS_MEMBERSHIPS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_MEMBERSHIPS_BY_ID_BOARD_BY_ID_MEMBERSHIP`
- `TRELLO_GET_BOARDS_MY_PREFS_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_ORGANIZATION_BY_ID_BOARD`
- `TRELLO_GET_BOARDS_ORGANIZATION_BY_ID_BOARD_BY_FIELD`
- `TRELLO_GET_CARDS_ACTIONS_BY_ID_CARD`
- `TRELLO_GET_CARDS_ATTACHMENTS_BY_ID_CARD`
- `TRELLO_GET_CARDS_ATTACHMENTS_BY_ID_CARD_BY_ID_ATTACHMENT`
- `TRELLO_GET_CARDS_BOARD_BY_ID_CARD`
- `TRELLO_GET_CARDS_BOARD_BY_ID_CARD_BY_FIELD`
- `TRELLO_GET_CARDS_BY_ID_CARD`
- `TRELLO_GET_CARDS_BY_ID_CARD_BY_FIELD`
- `TRELLO_GET_CARDS_CHECK_ITEM_STATES_BY_ID_CARD`
- `TRELLO_GET_CARDS_CHECKLISTS_BY_ID_CARD`
- `TRELLO_GET_CARDS_CUSTOM_FIELD_ITEMS_BY_ID_CARD`
- `TRELLO_GET_CARDS_LIST_BY_ID_CARD`
- `TRELLO_GET_CARDS_LIST_BY_ID_CARD_BY_FIELD`
- `TRELLO_GET_CARDS_MEMBERS_BY_ID_CARD`
- `TRELLO_GET_CARDS_MEMBERS_VOTED_BY_ID_CARD`
- `TRELLO_GET_CARDS_STICKERS_BY_ID_CARD`
- `TRELLO_GET_CARDS_STICKERS_BY_ID_CARD_BY_ID_STICKER`
- `TRELLO_GET_CHECK_ITEM_BY_ID`
- `TRELLO_GET_CHECKLISTS_BOARD_BY_ID_CHECKLIST`
- `TRELLO_GET_CHECKLISTS_BOARD_BY_ID_CHECKLIST_BY_FIELD`
- `TRELLO_GET_CHECKLISTS_BY_ID_CHECKLIST`
- `TRELLO_GET_CHECKLISTS_BY_ID_CHECKLIST_BY_FIELD`
- `TRELLO_GET_CHECKLISTS_CARDS_BY_ID_CHECKLIST`
- `TRELLO_GET_CHECKLISTS_CHECK_ITEMS_BY_ID_CHECKLIST`
- `TRELLO_GET_LABELS_BOARD_BY_ID_LABEL`
- `TRELLO_GET_LABELS_BOARD_BY_ID_LABEL_BY_FIELD`
- `TRELLO_GET_LABELS_BY_ID_LABEL`
- `TRELLO_GET_LISTS_ACTIONS_BY_ID_LIST`
- `TRELLO_GET_LISTS_BOARD_BY_ID_LIST`
- `TRELLO_GET_LISTS_BOARD_BY_ID_LIST_BY_FIELD`
- `TRELLO_GET_LISTS_BY_ID_LIST`
- `TRELLO_GET_LISTS_BY_ID_LIST_BY_FIELD`
- `TRELLO_GET_LISTS_CARDS_BY_ID_LIST`
- `TRELLO_GET_MEMBER_BOARD_BACKGROUND`
- `TRELLO_GET_MEMBER_CUSTOM_BG`
- `TRELLO_GET_MEMBER_CUSTOM_EMOJI`
- `TRELLO_GET_MEMBER_INVITED_ORG`
- `TRELLO_GET_MEMBER_ORG_CARDS`
- `TRELLO_GET_MEMBERS_ACTIONS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BOARD_BACKGROUNDS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BOARD_STARS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BOARD_STARS_BY_ID_MEMBER_BY_ID_BOARD_STAR`
- `TRELLO_GET_MEMBERS_BOARDS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BOARDS_BY_ID_MEMBER_BY_FILTER`
- `TRELLO_GET_MEMBERS_BOARDS_INVITED_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BOARDS_INVITED_BY_ID_MEMBER_BY_FIELD`
- `TRELLO_GET_MEMBERS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_BY_ID_MEMBER_BY_FIELD`
- `TRELLO_GET_MEMBERS_CARDS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_CUSTOM_BOARD_BACKGROUNDS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_CUSTOM_EMOJI_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_CUSTOM_STICKERS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_CUSTOM_STICKERS_BY_ID_MEMBER_BY_ID_STICKE`
- `TRELLO_GET_MEMBERS_DELTAS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_NOTIFICATIONS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_ORGANIZATIONS_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_ORGANIZATIONS_INVITED_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_SAVED_SEARCHES_BY_ID_MEMBER`
- `TRELLO_GET_MEMBERS_SAVED_SEARCHES_BY_ID_MEMBER_BY_ID_SAVED_S`
- `TRELLO_GET_MEMBERS_TOKENS_BY_ID_MEMBER`
- `TRELLO_GET_NOTIFICATIONS_BOARD_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_BOARD_BY_ID_NOTIFICATION_BY_FIELD`
- `TRELLO_GET_NOTIFICATIONS_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_BY_ID_NOTIFICATION_BY_FIELD`
- `TRELLO_GET_NOTIFICATIONS_CARD_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_CARD_BY_ID_NOTIFICATION_BY_FIELD`
- `TRELLO_GET_NOTIFICATIONS_DISPLAY_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_ENTITIES_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_LIST_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_LIST_BY_ID_NOTIFICATION_BY_FIELD`
- `TRELLO_GET_NOTIFICATIONS_MEMBER_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_MEMBER_BY_ID_NOTIFICATION_BY_FIELD`
- `TRELLO_GET_NOTIFICATIONS_MEMBER_CREATOR_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_MEMBER_CREATOR_BY_ID_NOTIFICATION_B`
- `TRELLO_GET_NOTIFICATIONS_ORGANIZATION_BY_ID_NOTIFICATION`
- `TRELLO_GET_NOTIFICATIONS_ORGANIZATION_BY_ID_NOTIFICATION_BY_`
- `TRELLO_GET_ORG_MEMBERSHIP`
- `TRELLO_GET_ORGANIZATIONS_ACTIONS_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_BOARDS_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_BY_ID_ORG_BY_FIELD`
- `TRELLO_GET_ORGANIZATIONS_DELTAS_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_MEMBERS_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_MEMBERS_INVITED_BY_ID_ORG`
- `TRELLO_GET_ORGANIZATIONS_MEMBERS_INVITED_BY_ID_ORG_BY_FIELD`
- `TRELLO_GET_ORGANIZATIONS_MEMBERSHIPS_BY_ID_ORG`
- `TRELLO_GET_SEARCH`
- `TRELLO_GET_SEARCH_MEMBERS`
- `TRELLO_GET_SESSIONS_SOCKET`
- `TRELLO_GET_TOKENS_BY_TOKEN`
- `TRELLO_GET_TOKENS_BY_TOKEN_BY_FIELD`
- `TRELLO_GET_TOKENS_MEMBER_BY_TOKEN`
- `TRELLO_GET_TOKENS_MEMBER_BY_TOKEN_BY_FIELD`
- `TRELLO_GET_TOKENS_WEBHOOKS_BY_TOKEN`
- `TRELLO_GET_TOKENS_WEBHOOKS_BY_TOKEN_BY_ID_WEBHOOK`
- `TRELLO_GET_TYPES_BY_ID`
- `TRELLO_GET_WEBHOOKS_BY_ID_WEBHOOK`

### `twilio`

Manifest: `src/generated/composio-manifests/twilio.generated.ts`

No Composio auth_config found for toolkit `twilio`. Tools cannot be audited until an auth config exists.

### `twitter`

Manifest: `src/generated/composio-manifests/twitter.generated.ts`

Auth configs (most-used first):
- `ac_ydMsPuaQ86U9` "twitter-clawlink" — BYO, 0 connections, 21 scopes

Audited against primary auth config `ac_ydMsPuaQ86U9` (21 scopes).

Status: 69 ok, 1 scope_gap, 8 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `TWITTER_GET_DM_CONVERSATION_EVENTS` | `user.read` | composio_managed_scope_gap |

**No scopes declared in metadata** (8 tools — verify with a real call before assuming OK):

- `TWITTER_CREATE_COMPLIANCE_JOB`
- `TWITTER_GET_COMPLIANCE_JOB`
- `TWITTER_GET_COMPLIANCE_JOBS`
- `TWITTER_GET_MEDIA_UPLOAD_STATUS`
- `TWITTER_GET_OPENAPI_SPEC`
- `TWITTER_GET_POST_USAGE`
- `TWITTER_STREAM_POST_LABELS`
- `TWITTER_UPLOAD_MEDIA`

### `webflow`

Manifest: `src/generated/composio-manifests/webflow.generated.ts`

No Composio auth_config found for toolkit `webflow`. Tools cannot be audited until an auth config exists.

### `xero`

Manifest: `src/generated/composio-manifests/xero.generated.ts`

Auth configs (most-used first):
- `ac_VHWOdEDCPoIB` "xero-clawlink" — BYO, 2 connections, 31 scopes

Audited against primary auth config `ac_VHWOdEDCPoIB` (31 scopes).

Status: 18 ok, 21 scope_gap, 2 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `XERO_CREATE_BANK_TRANSACTION` | `accounting.transactions` | composio_managed_scope_gap |
| `XERO_CREATE_INVOICE` | `accounting.transactions` | composio_managed_scope_gap |
| `XERO_CREATE_MANUAL_JOURNAL` | `accounting.transactions.read` | composio_managed_scope_gap |
| `XERO_CREATE_PAYMENT` | `accounting.transactions.read` | composio_managed_scope_gap |
| `XERO_CREATE_PURCHASE_ORDER` | `accounting.transactions.read` | composio_managed_scope_gap |
| `XERO_GET_ASSET` | `assets.read`, `assets` | composio_managed_scope_gap |
| `XERO_GET_BALANCE_SHEET_REPORT` | `accounting.reports.read` | composio_managed_scope_gap |
| `XERO_GET_INVOICE` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_GET_MANUAL_JOURNAL` | `accounting.journals.read` | composio_managed_scope_gap |
| `XERO_GET_PROFIT_LOSS_REPORT` | `accounting.reports.read` | composio_managed_scope_gap |
| `XERO_GET_PURCHASE_ORDER` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_GET_QUOTES` | `accounting.transactions`, `accounting.transactions.read` | composio_managed_scope_gap |
| `XERO_GET_TRIAL_BALANCE_REPORT` | `accounting.reports.read` | composio_managed_scope_gap |
| `XERO_LIST_ASSETS` | `assets.read`, `assets` | composio_managed_scope_gap |
| `XERO_LIST_BANK_TRANSACTIONS` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_LIST_CREDIT_NOTES` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_LIST_INVOICES` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_LIST_JOURNALS` | `accounting.journals.read` | composio_managed_scope_gap |
| `XERO_LIST_MANUAL_JOURNALS` | `accounting.journals.read` | composio_managed_scope_gap |
| `XERO_LIST_PAYMENTS` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |
| `XERO_LIST_PURCHASE_ORDERS` | `accounting.transactions.read`, `accounting.transactions` | composio_managed_scope_gap |

**No scopes declared in metadata** (2 tools — verify with a real call before assuming OK):

- `XERO_GET_CONNECTIONS`
- `XERO_POST_INVOICE_UPDATE`

### `youtube`

Manifest: `src/generated/composio-manifests/youtube.generated.ts`

Auth configs (most-used first):
- `ac_7MRxBS8AZaqP` "youtube-clawlink" — Managed, 4 connections, 7 scopes

Audited against primary auth config `ac_7MRxBS8AZaqP` (7 scopes).

Status: 47 ok, 0 scope_gap, 0 no_scopes_declared, 0 not_in_catalog

### `zendesk`

Manifest: `src/generated/composio-manifests/zendesk.generated.ts`

Auth configs (most-used first):
- `ac_fTJUNoDwG9j0` "zendesk-clawlink" — Managed, 1 connections, 10 scopes

Audited against primary auth config `ac_fTJUNoDwG9j0` (10 scopes).

Status: 93 ok, 99 scope_gap, 8 no_scopes_declared, 252 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `ZENDESK_COUNT_ZENDESK_CUSTOM_OBJECT_RECORDS` | `custom_objects:read` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ACCESS_RULE` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_APPS_INSTALLATION` | `apps:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_AUTOMATION` | `policies:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_CUSTOM_OBJECT_BULK_JOB` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_CUSTOM_OBJECT_RECORD` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_CUSTOM_OBJECT_RECORD_ATTACHMENT` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_DELETION_SCHEDULE` | `policies:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_DYNAMIC_CONTENT_ITEMS` | `dynamic_content:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_DYNAMIC_CONTENT_ITEMS_VARIANTS` | `dynamic_content:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_GROUP_MEMBERSHIPS` | `groups:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_MANY_DYNAMIC_CONTENT_ITEMS_VARIANTS` | `dynamic_content:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_OBJECT_TRIGGER` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ORGANIZATION_MEMBERSHIPS_CREATE_MANY` | `organization_memberships:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_PUSH_NOTIFICATION_DEVICES_DESTROY_MANY` | `push_notification_devices:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_SUPPORT_ADDRESS` | `channels:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_TRIGGER` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_TRIGGER_CATEGORIES_JOB` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_TRIGGER_CATEGORY` | `triggers:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_VIEW` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_VIEWS_PREVIEW` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_CREATE_VIEWS_PREVIEW_COUNT` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ZENDESK_CUSTOM_OBJECT` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ZENDESK_CUSTOM_OBJECT_FIELD` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ZENDESK_GROUP` | `groups:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ZENDESK_REQUEST` | `requests:write` | composio_managed_scope_gap |
| `ZENDESK_CREATE_ZENDESK_TARGET` | `targets:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ACCESS_RULE` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_AUTOMATION` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_BUSINESS_HOURS_SCHEDULE` | `business_hours:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_CUSTOM_OBJECT_RECORD_ATTACHMENT` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_CUSTOM_OBJECT_RECORD_BY_EXTERNAL_ID_OR_NAME` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_DELETION_SCHEDULE` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_GROUP_MEMBERSHIP` | `groups:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_GROUP_MEMBERSHIPS_DESTROY_MANY` | `groups:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MACRO` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MACROS_DESTROY_MANY` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MANY_AUTOMATIONS` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MANY_OBJECT_TRIGGERS` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MANY_ORGANIZATION_MEMBERSHIPS` | `organization_memberships:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_MANY_VIEWS` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ORGANIZATION_FIELD` | `organization_fields:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ORGANIZATION_MEMBERSHIP` | `organization_memberships:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_RESOURCE_COLLECTIONS` | `resource_collections:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_TARGET` | `targets:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_TICKET_FIELD` | `ticket_fields:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_TICKET_FIELD_OPTION` | `ticket_fields:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_TRIGGER` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_TRIGGER_CATEGORY` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_USERS_GROUP_MEMBERSHIPS` | `groups:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_USERS_ME_LOGOUT` | `sessions:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_USERS_ORGANIZATION_MEMBERSHIPS` | `organization_memberships:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_USERS_SESSIONS` | `sessions:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_VIEW` | `business_rules:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_APP_INSTALLATION` | `apps:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_BOOKMARK` | `bookmarks:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_CUSTOM_OBJECT` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_CUSTOM_OBJECT_FIELD` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_CUSTOM_OBJECT_RECORD` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_DYNAMIC_CONTENT_ITEM` | `dynamic_content:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_DYNAMIC_CONTENT_ITEM_VARIANT` | `dynamic_content:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_OBJECT_TRIGGER` | `custom_objects:write` | composio_managed_scope_gap |
| `ZENDESK_DELETE_ZENDESK_SUPPORT_ADDRESS` | `support_addresses:write` | composio_managed_scope_gap |
| `ZENDESK_DETECT_BEST_LOCALE` | `locales:read` | composio_managed_scope_gap |
| `ZENDESK_DOWNLOAD_CUSTOM_OBJECT_RECORD_ATTACHMENT` | `custom_objects:read` | composio_managed_scope_gap |
| `ZENDESK_GET_ACTIVE_TRIGGERS` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_APP` | `apps:read` | composio_managed_scope_gap |
| `ZENDESK_GET_APPS_INSTALLATIONS_REQUIREMENTS` | `apps:read` | composio_managed_scope_gap |
| `ZENDESK_GET_APPS_LOCATION` | `apps:read` | composio_managed_scope_gap |
| `ZENDESK_GET_APPS_LOCATION_INSTALLATIONS` | `apps_management:read`, `admin` | likely_provider_tier_gate |
| `ZENDESK_GET_APPS_PUBLIC_KEY` | `apps:read` | composio_managed_scope_gap |
| `ZENDESK_GET_AUTOMATION` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_AUTOMATIONS` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_AUTOMATIONS_SEARCH` | `automation:read` | composio_managed_scope_gap |
| `ZENDESK_GET_BRANDS2` | `brands:read` | composio_managed_scope_gap |
| `ZENDESK_GET_CUSTOM_OBJECTS_LIMIT` | `custom_objects:read` | composio_managed_scope_gap |
| `ZENDESK_GET_DELETION_SCHEDULE` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_DELETION_SCHEDULES` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_DYNAMIC_CONTENT_ITEMS_SHOW_MANY` | `dynamic_content:read` | composio_managed_scope_gap |
| `ZENDESK_GET_DYNAMIC_CONTENT_ITEMS_VARIANTS` | `dynamic_content:read` | composio_managed_scope_gap |
| `ZENDESK_GET_GROUP_MEMBERSHIPS` | `groups:read` | composio_managed_scope_gap |
| `ZENDESK_GET_GROUP_MEMBERSHIPS_BY_GROUP` | `groups:read` | composio_managed_scope_gap |
| `ZENDESK_GET_GROUP_USERS` | `groups:read` | composio_managed_scope_gap |
| `ZENDESK_GET_GROUPS_COUNT` | `groups:read` | composio_managed_scope_gap |
| `ZENDESK_GET_GROUPS_USERS_COUNT` | `groups:read` | composio_managed_scope_gap |
| `ZENDESK_GET_INCREMENTAL_ROUTING_ATTRIBUTE_VALUES` | `routing_attributes:read` | composio_managed_scope_gap |
| `ZENDESK_GET_INCREMENTAL_ROUTING_ATTRIBUTES` | `routing_attributes:read` | composio_managed_scope_gap |
| `ZENDESK_GET_INCREMENTAL_ROUTING_INSTANCE_VALUES` | `routing:read` | composio_managed_scope_gap |
| `ZENDESK_GET_LOCALE` | `locales:read` | composio_managed_scope_gap |
| `ZENDESK_GET_LOCALES_CURRENT` | `locale:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACRO_ATTACHMENTS` | `macros:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACRO_CATEGORIES` | `macros:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACRO_DEFINITIONS` | `macros:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACRO_REPLICA` | `macros:read`, `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACRO2` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACROS` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACROS_ACTIONS` | `macros:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACROS_ACTIVE` | `business_rules:read` | composio_managed_scope_gap |
| `ZENDESK_GET_MACROS_APPLY` | `macros:read`, `business_rules:read` | composio_managed_scope_gap |

**Imported but not in current Composio catalog:**

- `ZENDESK_GET_MACROS_SEARCH`
- `ZENDESK_GET_OBJECT_TRIGGER`
- `ZENDESK_GET_OPEN_REQUESTS`
- `ZENDESK_GET_ORGANIZATION_FIELD2`
- `ZENDESK_GET_ORGANIZATION_FIELDS`
- `ZENDESK_GET_ORGANIZATION_MEMBERSHIP2`
- `ZENDESK_GET_ORGANIZATION_RELATED`
- `ZENDESK_GET_ORGANIZATION_REQUESTS`
- `ZENDESK_GET_ORGANIZATION_SUBSCRIPTION`
- `ZENDESK_GET_ORGANIZATION_SUBSCRIPTIONS`
- `ZENDESK_GET_ORGANIZATION_TAGS`
- `ZENDESK_GET_ORGANIZATION_TICKETS`
- `ZENDESK_GET_ORGANIZATION_USERS`
- `ZENDESK_GET_ORGANIZATION_USERS_COUNT`
- `ZENDESK_GET_ORGANIZATIONS_AUTOCOMPLETE`
- `ZENDESK_GET_ORGANIZATIONS_MERGES`
- `ZENDESK_GET_ORGANIZATIONS_SHOW_MANY`
- `ZENDESK_GET_ORGANIZATIONS_TICKETS_COUNT`
- `ZENDESK_GET_OWNED_APPS`
- `ZENDESK_GET_PROBLEMS`
- `ZENDESK_GET_PUBLIC_LOCALES`
- `ZENDESK_GET_RECENT_TICKETS`
- `ZENDESK_GET_REMOTE_AUTHENTICATIONS`
- `ZENDESK_GET_REQUEST_COMMENTS`
- `ZENDESK_GET_REQUESTS_CCDB`
- `ZENDESK_GET_REQUESTS_COMMENT`
- `ZENDESK_GET_REQUESTS_SEARCH`
- `ZENDESK_GET_REQUESTS_SOLVED`
- `ZENDESK_GET_ROUTING_AGENTS_INSTANCE_VALUES`
- `ZENDESK_GET_SATISFACTION_RATINGS`
- `ZENDESK_GET_SATISFACTION_RATINGS_COUNT`
- `ZENDESK_GET_SEARCH_COUNT`
- `ZENDESK_GET_SEARCH_EXPORT`
- `ZENDESK_GET_SECURITY_SETTINGS`
- `ZENDESK_GET_SIDE_CONVERSATIONS_EVENTS`
- `ZENDESK_GET_SUPPORT_ADDRESS`
- `ZENDESK_GET_TAGS`
- `ZENDESK_GET_TAGS_COUNT`
- `ZENDESK_GET_TARGET`
- `ZENDESK_GET_TARGET_FAILURE`
- `ZENDESK_GET_TARGET_FAILURES`
- `ZENDESK_GET_TARGETS`
- `ZENDESK_GET_TICKET_AUDIT_BY_ID`
- `ZENDESK_GET_TICKET_COLLABORATORS`
- `ZENDESK_GET_TICKET_COMMENTS`
- `ZENDESK_GET_TICKET_EMAIL_C_CS`
- `ZENDESK_GET_TICKET_FIELD2`
- `ZENDESK_GET_TICKET_FIELDS`
- `ZENDESK_GET_TICKET_FIELDS_COUNT`
- `ZENDESK_GET_TICKET_FIELDS_SHOW_MANY`
- `ZENDESK_GET_TICKET_FOLLOWERS`
- `ZENDESK_GET_TICKET_FORMS`
- `ZENDESK_GET_TICKET_FORMS_SHOW_MANY`
- `ZENDESK_GET_TICKET_INCIDENTS`
- `ZENDESK_GET_TICKET_METRIC`
- `ZENDESK_GET_TICKET_METRICS`
- `ZENDESK_GET_TICKET_SKIPS`
- `ZENDESK_GET_TICKETS_AUDITS`
- `ZENDESK_GET_TICKETS_AUDITS_COUNT`
- `ZENDESK_GET_TICKETS_COMMENTS_COUNT`
- `ZENDESK_GET_TICKETS_CONVERSATION_LOG`
- `ZENDESK_GET_TICKETS_COUNT`
- `ZENDESK_GET_TICKETS_METRICS`
- `ZENDESK_GET_TICKETS_SIDE_CONVERSATIONS_EVENTS`
- `ZENDESK_GET_TRIGGER`
- `ZENDESK_GET_TRIGGER_CATEGORIES`
- `ZENDESK_GET_TRIGGER_CATEGORIES2`
- `ZENDESK_GET_TRIGGERS`
- `ZENDESK_GET_TRIGGERS_DEFINITIONS`
- `ZENDESK_GET_TRIGGERS_SEARCH`
- `ZENDESK_GET_USER`
- `ZENDESK_GET_USER_ENTITLEMENTS_FULL`
- `ZENDESK_GET_USER_EVENTS`
- `ZENDESK_GET_USER_FIELD_BY_ID`
- `ZENDESK_GET_USER_FIELD_OPTIONS`
- `ZENDESK_GET_USER_FIELDS`
- `ZENDESK_GET_USER_FIELDS_SHOW_MANY`
- `ZENDESK_GET_USER_PROFILES_EVENTS2`
- `ZENDESK_GET_USER_PROFILES2`
- `ZENDESK_GET_USER_SESSIONS`
- `ZENDESK_GET_USER_TICKETS_ASSIGNED_COUNT`
- `ZENDESK_GET_USERS_ASSIGNED_TICKETS`
- `ZENDESK_GET_USERS_AUTOCOMPLETE`
- `ZENDESK_GET_USERS_BRAND_AGENTS`
- `ZENDESK_GET_USERS_CCD_TICKETS`
- `ZENDESK_GET_USERS_COMPLIANCE_DELETION_STATUSES`
- `ZENDESK_GET_USERS_COUNT`
- `ZENDESK_GET_USERS_FOLLOWED_TICKETS`
- `ZENDESK_GET_USERS_GROUP_MEMBERSHIPS`
- `ZENDESK_GET_USERS_GROUP_MEMBERSHIPS_BY_ID`
- `ZENDESK_GET_USERS_GROUPS`
- `ZENDESK_GET_USERS_GROUPS_COUNT`
- `ZENDESK_GET_USERS_IDENTITIES2`
- `ZENDESK_GET_USERS_ME_SESSION`
- `ZENDESK_GET_USERS_ME_SETTINGS`
- `ZENDESK_GET_USERS_ORGANIZATION_MEMBERSHIPS`
- `ZENDESK_GET_USERS_ORGANIZATION_MEMBERSHIPS2`
- `ZENDESK_GET_USERS_ORGANIZATION_SUBSCRIPTIONS`
- `ZENDESK_GET_USERS_ORGANIZATIONS`
- `ZENDESK_GET_USERS_ORGANIZATIONS_COUNT`
- `ZENDESK_GET_USERS_PASSWORD_REQUIREMENTS`
- `ZENDESK_GET_USERS_PROFILES`
- `ZENDESK_GET_USERS_RELATED`
- `ZENDESK_GET_USERS_REQUESTED_TICKETS`
- `ZENDESK_GET_USERS_REQUESTS`
- `ZENDESK_GET_USERS_SKIPS`
- `ZENDESK_GET_USERS_TAGS`
- `ZENDESK_GET_VIEW_DEFINITIONS`
- `ZENDESK_GET_VIEW_TICKET_COUNT`
- `ZENDESK_GET_VIEWS`
- `ZENDESK_GET_VIEWS_ACTIVE`
- `ZENDESK_GET_VIEWS_COMPACT`
- `ZENDESK_GET_VIEWS_COUNT`
- `ZENDESK_GET_VIEWS_COUNT_MANY`
- `ZENDESK_GET_VIEWS_EXECUTE`
- `ZENDESK_GET_VIEWS_EXPORT`
- `ZENDESK_GET_VIEWS_SEARCH`
- `ZENDESK_GET_VIEWS_SHOW_MANY`
- `ZENDESK_GET_VIEWS_TICKETS`
- `ZENDESK_GET_ZENDESK_ACTIVITIES`
- `ZENDESK_GET_ZENDESK_CUSTOM_ROLES`
- `ZENDESK_GET_ZENDESK_ORGANIZATION`
- `ZENDESK_GET_ZENDESK_ORGANIZATION_MERGE`
- `ZENDESK_GET_ZENDESK_ORGANIZATIONS_SUBSCRIPTIONS`
- `ZENDESK_GET_ZENDESK_REQUESTS`
- `ZENDESK_GET_ZENDESK_SESSIONS`
- `ZENDESK_GET_ZENDESK_SHARING_AGREEMENTS`
- `ZENDESK_GET_ZENDESK_SUSPENDED_TICKETS`
- `ZENDESK_GET_ZENDESK_TICKET_BY_ID`
- `ZENDESK_GET_ZENDESK_TICKET_FIELDS_OPTIONS`
- `ZENDESK_GET_ZENDESK_TICKET_FIELDS_OPTIONS2`
- `ZENDESK_GET_ZENDESK_TICKET_FORM`
- `ZENDESK_GET_ZENDESK_TICKET_RELATED`
- `ZENDESK_GET_ZENDESK_TICKETS_SIDE_CONVERSATION_ID`
- `ZENDESK_GET_ZENDESK_TICKETS_TAGS`
- `ZENDESK_LIST_ACTIVE_AUTOMATIONS`
- `ZENDESK_LIST_APP_INSTALLATIONS`
- `ZENDESK_LIST_APP_LOCATIONS`
- `ZENDESK_LIST_ASSIGNABLE_GROUP_MEMBERSHIPS`
- `ZENDESK_LIST_ASSIGNABLE_GROUP_MEMBERSHIPS_BY_GROUP`
- `ZENDESK_LIST_BOOKMARKS`
- `ZENDESK_LIST_BRAND_AGENTS`
- `ZENDESK_LIST_CUSTOM_OBJECT_RECORD_ATTACHMENTS`
- `ZENDESK_LIST_CUSTOM_OBJECT_RECORDS`
- `ZENDESK_LIST_DELETED_USERS`
- `ZENDESK_LIST_INCREMENTAL_CUSTOM_OBJECT_RECORDS`
- `ZENDESK_LIST_MONITORED_TWITTER_HANDLES`
- `ZENDESK_LIST_OBJECT_TRIGGERS`
- `ZENDESK_LIST_OBJECT_TRIGGERS_DEFINITIONS`
- `ZENDESK_LIST_ORGANIZATION_MEMBERSHIPS`
- `ZENDESK_LIST_ORGANIZATION_MEMBERSHIPS_BY_ORGANIZATION`
- `ZENDESK_LIST_RESOURCE_COLLECTIONS`
- `ZENDESK_LIST_SKIPS`
- `ZENDESK_LIST_SUPPORT_ADDRESSES`
- `ZENDESK_LIST_TICKET_AUDITS`
- `ZENDESK_LIST_TICKET_CONTENT_PINS`
- `ZENDESK_LIST_USER_IDENTITIES`
- `ZENDESK_LIST_ZENDESK_ACCESS_RULES`
- `ZENDESK_LIST_ZENDESK_CUSTOM_OBJECT_FIELDS`
- `ZENDESK_LIST_ZENDESK_CUSTOM_OBJECTS`
- `ZENDESK_LIST_ZENDESK_PERMISSION_POLICIES`
- `ZENDESK_LIST_ZENDESK_TICKETS`
- `ZENDESK_LIST_ZENDESK_USERS`
- `ZENDESK_MAKE_COMMENT_PRIVATE`
- `ZENDESK_MAKE_DEFAULT_ORGANIZATION_MEMBERSHIP`
- `ZENDESK_MAKE_END_USER_IDENTITY_PRIMARY`
- `ZENDESK_MAKE_TICKET_COMMENT_PRIVATE`
- `ZENDESK_MAKE_USER_IDENTITY_PRIMARY`
- `ZENDESK_MARK_MANY_TICKETS_AS_SPAM`
- `ZENDESK_MERGE_USERS`
- `ZENDESK_MERGE_ZENDESK_TICKETS`
- `ZENDESK_OPEN_USERS_PROFILE_IN_AGENT_BROWSER`
- `ZENDESK_RECOVER_MANY_SUSPENDED_TICKETS`
- `ZENDESK_RENEW_SESSION`
- `ZENDESK_REORDER_CUSTOM_OBJECT_FIELDS`
- `ZENDESK_REORDER_LOCATION_INSTALLATIONS`
- `ZENDESK_REORDER_ORGANIZATION_FIELDS`
- `ZENDESK_REORDER_TICKET_FIELDS`
- `ZENDESK_REORDER_TRIGGERS`
- `ZENDESK_REORDER_USER_FIELDS`
- `ZENDESK_REPLY_ZENDESK_TICKET`
- `ZENDESK_REQUEST_END_USER_VERIFICATION`
- `ZENDESK_REQUEST_USER_CREATE`
- `ZENDESK_REQUEST_USER_VERIFICATION`
- `ZENDESK_RESTORE_MANY_TICKETS`
- `ZENDESK_RESTORE_ZENDESK_TICKET`
- `ZENDESK_SEARCH_CUSTOM_OBJECT_RECORDS`
- `ZENDESK_SEARCH_OBJECT_TRIGGERS`
- `ZENDESK_SEARCH_ZENDESK`
- `ZENDESK_SEARCH_ZENDESK_ORGANIZATIONS`
- `ZENDESK_SEARCH_ZENDESK_USERS`
- `ZENDESK_SET_DEFAULT_CUSTOM_STATUS`
- `ZENDESK_SET_GROUP_MEMBERSHIP_AS_DEFAULT`
- `ZENDESK_SET_USERS_ORGANIZATION_AS_DEFAULT`
- `ZENDESK_SHOW_ACCESS_RULE`
- `ZENDESK_SHOW_CUSTOM_OBJECT`
- `ZENDESK_SHOW_CUSTOM_OBJECT_RECORD`
- `ZENDESK_SHOW_MANY_JOB_STATUSES`
- `ZENDESK_SHOW_MANY_TICKETS`
- `ZENDESK_SHOW_MANY_USERS`
- `ZENDESK_SHOW_PERMISSION_POLICY`
- `ZENDESK_SHOW_REQUEST`
- `ZENDESK_UNASSIGN_USER_ORGANIZATION`
- `ZENDESK_UPDATE_ACCESS_RULE`
- `ZENDESK_UPDATE_APPS_INSTALLATION`
- `ZENDESK_UPDATE_AUTOMATION`
- `ZENDESK_UPDATE_CUSTOM_OBJECT`
- `ZENDESK_UPDATE_CUSTOM_OBJECT_RECORD`
- `ZENDESK_UPDATE_CUSTOM_STATUS`
- `ZENDESK_UPDATE_DELETION_SCHEDULE`
- `ZENDESK_UPDATE_DYNAMIC_CONTENT_ITEMS_VARIANT`
- `ZENDESK_UPDATE_DYNAMIC_CONTENT_ITEMS_VARIANTS`
- `ZENDESK_UPDATE_MACRO`
- `ZENDESK_UPDATE_MANY_AUTOMATIONS`
- `ZENDESK_UPDATE_MANY_MACROS`
- `ZENDESK_UPDATE_MANY_OBJECT_TRIGGERS`
- `ZENDESK_UPDATE_MANY_ORGANIZATIONS`
- `ZENDESK_UPDATE_MANY_TICKETS`
- `ZENDESK_UPDATE_MANY_TRIGGERS`
- `ZENDESK_UPDATE_MANY_USERS`
- `ZENDESK_UPDATE_MANY_VIEWS`
- `ZENDESK_UPDATE_OBJECT_TRIGGER`
- `ZENDESK_UPDATE_ORGANIZATION_FIELD`
- `ZENDESK_UPDATE_ORGANIZATIONS_TAGS`
- `ZENDESK_UPDATE_PERMISSION_POLICY`
- `ZENDESK_UPDATE_RESOURCE_COLLECTION`
- `ZENDESK_UPDATE_SIDE_CONVERSATION`
- `ZENDESK_UPDATE_SUPPORT_ADDRESS`
- `ZENDESK_UPDATE_TARGET`
- `ZENDESK_UPDATE_TICKET_FIELD`
- `ZENDESK_UPDATE_TICKET_TRIGGER`
- `ZENDESK_UPDATE_TICKETS_TAGS`
- `ZENDESK_UPDATE_TRIGGER_CATEGORY`
- `ZENDESK_UPDATE_USER_FIELD`
- `ZENDESK_UPDATE_USER_PROFILE`
- `ZENDESK_UPDATE_USER_PROFILE_BY_ID`
- `ZENDESK_UPDATE_USERS_IDENTITY`
- `ZENDESK_UPDATE_USERS_ME_SETTINGS`
- `ZENDESK_UPDATE_USERS_PROFILES`
- `ZENDESK_UPDATE_USERS_TAGS`
- `ZENDESK_UPDATE_VIEW`
- `ZENDESK_UPDATE_ZENDESK_ACCOUNT_SETTINGS`
- `ZENDESK_UPDATE_ZENDESK_ATTACHMENT`
- `ZENDESK_UPDATE_ZENDESK_CUSTOM_OBJECT_FIELD`
- `ZENDESK_UPDATE_ZENDESK_DYNAMIC_CONTENT_ITEM`
- `ZENDESK_UPDATE_ZENDESK_ORGANIZATION`
- `ZENDESK_UPDATE_ZENDESK_REQUESTS`
- `ZENDESK_UPDATE_ZENDESK_TICKET`
- `ZENDESK_UPSERT_CUSTOM_OBJECT_RECORD_BY_EXTERNAL_ID_OR_NAME`
- `ZENDESK_VERIFY_SUBDOMAIN_AVAILABILITY`
- `ZENDESK_VERIFY_SUPPORT_ADDRESS`
- `ZENDESK_VERIFY_USER_IDENTITY`

**No scopes declared in metadata** (8 tools — verify with a real call before assuming OK):

- `ZENDESK_CHECK_HOST_MAPPING_VALIDITY_FOR_EXISTING_BRAND`
- `ZENDESK_CREATE_APPS_NOTIFY`
- `ZENDESK_CREATE_CUSTOM_STATUSES`
- `ZENDESK_GET_APPS_PUBLIC_KEY_PEM`
- `ZENDESK_GET_CUSTOM_OBJECT_FIELDS_LIMIT`
- `ZENDESK_GET_CUSTOM_OBJECT_RECORDS_LIMIT`
- `ZENDESK_GET_GROUP_MEMBERSHIP`
- `ZENDESK_GET_GUIDE_SURVEYS`

### `zoho-books`

Manifest: `src/generated/composio-manifests/zoho-books.generated.ts`

No Composio auth_config found for toolkit `zoho-books`. Tools cannot be audited until an auth config exists.

### `zoom`

Manifest: `src/generated/composio-manifests/zoom.generated.ts`

Auth configs (most-used first):
- `ac_xJRzOCEepQEL` "zoom-clawlink" — Managed, 3 connections, 26 scopes

Audited against primary auth config `ac_xJRzOCEepQEL` (26 scopes).

Status: 0 ok, 50 scope_gap, 1 no_scopes_declared, 0 not_in_catalog

**Scope gaps (likely fail at runtime):**

| Tool | Missing scopes | Category |
| --- | --- | --- |
| `ZOOM_ADD_A_MEETING_REGISTRANT` | `meeting:write:registrant:admin` | likely_provider_tier_gate |
| `ZOOM_ADD_A_WEBINAR_REGISTRANT` | `webinar:write:registrant:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_A_MEETING` | `meeting:write:meeting:admin`, `meeting:write:meeting:master` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CONVERSATION` | `zra:write:conversation`, `zra:write:conversation:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CONVERSATION_COMMENT` | `zra:write:conversation_comment`, `zra:write:conversation_comment:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CRM_ACCOUNTS` | `zra:write:crm_accounts:admin`, `iq_crm:write` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CRM_CONTACTS` | `zra:write:crm_contact:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CRM_DEALS` | `iq_crm:write`, `zra:write:crm_deal:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CRM_LEADS` | `zra:write:crm_lead:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_CRM_SETTINGS` | `iq_crm:write`, `zra:write:crm_registration:admin` | likely_provider_tier_gate |
| `ZOOM_CREATE_ZRA_USER_CONVERSATION` | `zra:write:conversation`, `zra:write:conversation:admin` | likely_provider_tier_gate |
| `ZOOM_DELETE_ZRA_CONVERSATION` | `zra:delete:conversations`, `zra:delete:conversations:admin` | likely_provider_tier_gate |
| `ZOOM_DELETE_ZRA_CONVERSATION_COMMENT` | `zra:delete:conversation_comment`, `zra:delete:conversation_comment:admin` | likely_provider_tier_gate |
| `ZOOM_DELETE_ZRA_CRM_SETTINGS` | `zra:delete:crm_registration:admin` | likely_provider_tier_gate |
| `ZOOM_DELETE_ZRA_DEAL_ACTIVITIES` | `zra:delete:deal_activity`, `zra:delete:deal_activity:admin` | likely_provider_tier_gate |
| `ZOOM_GET_A_MEETING` | `meeting:read:meeting:admin`, `meeting:read:meeting:master` | likely_provider_tier_gate |
| `ZOOM_GET_A_MEETING_SUMMARY` | `meeting:read:summary:admin` | likely_provider_tier_gate |
| `ZOOM_GET_IQ_CONVERSATION_CONTENT_ANALYSIS` | `zra:read:conversation_analysis`, `zra:read:conversation_analysis:admin` | likely_provider_tier_gate |
| `ZOOM_GET_IQ_DEAL` | `zra:read:deal`, `zra:read:deal:admin` | likely_provider_tier_gate |
| `ZOOM_GET_MEETING_RECORDINGS` | `cloud_recording:read:list_recording_files:admin`, `cloud_recording:read:list_recording_files:master` | likely_provider_tier_gate |
| `ZOOM_GET_PAST_MEETING_PARTICIPANTS` | `meeting:read:list_past_participants:admin` | likely_provider_tier_gate |
| `ZOOM_GET_USER` | `user_profile`, `user:read:user:admin` | likely_provider_tier_gate |
| `ZOOM_GET_ZRA_CONVERSATION_COMMENTS` | `zra:read:list_conversation_comments`, `zra:read:list_conversation_comments:admin` | likely_provider_tier_gate |
| `ZOOM_GET_ZRA_CONVERSATION_INTERACTIONS` | `zra:read:conversation_participants`, `zra:read:conversation_participants:admin` | likely_provider_tier_gate |
| `ZOOM_GET_ZRA_CONVERSATION_SCORECARDS` | `zra:read:conversation_scorecards`, `zra:read:conversation_scorecards:admin` | likely_provider_tier_gate |
| `ZOOM_GET_ZRA_DEAL_ACTIVITIES` | `zra:read:list_deal_activities`, `zra:read:list_deal_activities:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ALL_RECORDINGS` | `cloud_recording:read:list_user_recordings:admin`, `cloud_recording:read:list_user_recordings:master` | likely_provider_tier_gate |
| `ZOOM_LIST_ARCHIVED_FILES` | `archiving:read:list_archived_files:admin`, `archiving:read:list_archived_files:master` | likely_provider_tier_gate |
| `ZOOM_LIST_MEETING_SUMMARY_TEMPLATES` | `user:read:settings:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_MEETINGS` | `meeting:read:list_meetings:admin`, `meeting:read:list_meetings:master` | likely_provider_tier_gate |
| `ZOOM_LIST_PAST_MEETING_INSTANCES` | `meeting:read:list_past_instances:admin`, `meeting:read:list_past_instances`, `meeting:read:list_past_instances:master` | likely_provider_tier_gate |
| `ZOOM_LIST_USERS_COLLABORATION_DEVICES` | `user:read:list_collaboration_devices:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_USERS_SETTINGS` | `user:read:settings:admin`, `user:read:settings:master` | likely_provider_tier_gate |
| `ZOOM_LIST_WEBINAR_PARTICIPANTS` | `webinar:read:list_past_participants:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_WEBINAR_REGISTRANTS` | `webinar:read:list_registrants:admin`, `webinar:read:list_registrants:master` | likely_provider_tier_gate |
| `ZOOM_LIST_WEBINARS` | `webinar:read:list_webinars:admin`, `webinar:read:list_webinars:master` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CONVERSATIONS` | `zra:read:list_conversations`, `zra:read:list_conversations:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CRM_ACCOUNTS` | `iq_crm:read`, `zra:read:crm_account:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CRM_CONTACTS` | `zra:read:crm_contact:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CRM_DEALS` | `zra:read:crm_deal:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CRM_LEADS` | `zra:read:crm_lead:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_CRM_SETTINGS` | `zra:read:crm_registration:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_DEALS` | `zra:read:list_deals`, `zra:read:list_deals:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_SCHEDULED` | `zra:read:list_conversations`, `zra:read:list_conversations:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_SETTINGS_INDICATORS` | `zra:read:indicator`, `zra:read:indicator:admin` | likely_provider_tier_gate |
| `ZOOM_LIST_ZRA_USER_CONVERSATION_PLAYLISTS` | `zra:read:list_conversation_playlists` | composio_managed_scope_gap |
| `ZOOM_SEARCH_COMPANY_CONTACTS` | `contact:read:list_contacts:admin` | likely_provider_tier_gate |
| `ZOOM_UPDATE_A_MEETING` | `meeting:update:meeting:admin`, `meeting:update:meeting:master` | likely_provider_tier_gate |
| `ZOOM_UPDATE_ZRA_CONVERSATION_COMMENT` | `zra:update:conversation_comment`, `zra:update:conversation_comment:admin` | likely_provider_tier_gate |
| `ZOOM_UPDATE_ZRA_CONVERSATION_HOST` | `zra:update:conversation_host`, `zra:update:conversation_host:admin` | likely_provider_tier_gate |

**No scopes declared in metadata** (1 tools — verify with a real call before assuming OK):

- `ZOOM_GET_A_WEBINAR`

