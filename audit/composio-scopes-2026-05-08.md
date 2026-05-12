# Composio scope-coverage audit

Generated: 2026-05-08T19:56:50.476Z

## How to read this report

- **scope_gap** — Composio's tool metadata claims this tool needs scopes that aren't enabled on the auth config. Likely fails at runtime. Verify by calling `POST /tools/execute/<slug>` directly with the Composio API key before acting.
- **likely_provider_tier_gate** — the missing scope appears Enterprise/Org/admin-only. A BYO OAuth app probably won't help unless app owner + connecting user are both on the higher tier. Most often: drop.
- **composio_managed_scope_gap** — the missing scope exists on the provider but Composio's managed OAuth client doesn't request it. BYO migration unlocks the tool.
- **possibly_stale_metadata** — Composio claims a deprecated scope name (e.g. `files:read`). Tool often works fine on the modern scope we already have. Verify before dropping.
- **no_scopes_declared** — Composio metadata lists no scopes for this specific tool. Usually means the tool either uses no OAuth scope, or Composio hasn't documented it. Treat as needs-verification.
- **not_scope_modeled** — the integration's auth config declares zero OAuth scopes overall. The provider doesn't authorize via OAuth scopes (e.g. Notion grants per-page/database access on share; many API-key integrations have no scope concept at all). Composio's per-tool `scopes` metadata is descriptive only and should be ignored for this provider.
- **not_in_catalog** — we imported a toolSlug that Composio's `/tools` endpoint no longer returns for `latest`. Likely renamed or removed upstream — drop or re-import.

## Summary

Integrations audited: 1
Total imported tools: 145
Total scope-gap tools: 51

| Integration | Imported | Catalog | Auth configs | Scope gaps | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `slack` | 145 | 145 | 1 | 51 | — |

## Per-integration detail

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

