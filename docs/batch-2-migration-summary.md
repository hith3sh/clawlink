# Batch 2 Migration Summary: Google Family + Gmail

Historical note: the Google custom worker handlers described below have since been removed. Current Google tool execution should use generated Pipedream manifests.

## Migrated Slugs

- `google-sheets`
- `google-calendar`
- `google-docs`
- `google-search-console`
- `google-analytics`
- `gmail`

## Files Changed

### Integration metadata
- `src/data/integrations.ts`
  - Switched `setupMode` from `"oauth"` to `"pipedream"` for all 6 slugs
  - Updated `setupGuide` copy to mention Pipedream instead of Nango / generic Google OAuth
  - For `gmail`: changed `dashboardStatus` from `"coming-soon"` → `"available"` and `runtimeStatus` from `"planned"` → `"live"`

### Worker handlers
- `worker/integrations/google-base.ts` **(new)**
  - Shared `GoogleBaseIntegration` class extending `BaseIntegration`
  - `googleApiRequest()` helper that routes through `pipedreamProxyRequest` when `credentials.pipedreamAccountId` is present, otherwise falls back to direct `apiRequest()`
  - `getHeaders()` and `getAccessToken()` shared across all Google handlers
- `worker/integrations/google-sheets.ts`
- `worker/integrations/google-calendar.ts`
- `worker/integrations/google-docs.ts`
- `worker/integrations/google-search-console.ts`
- `worker/integrations/google-analytics.ts`
- `worker/integrations/gmail.ts`

All 6 handlers:
- Extend `GoogleBaseIntegration` instead of `BaseIntegration`
- Accept `context?: GoogleExecutionContext` in `execute()` and thread it through every private method
- Replace `this.apiRequest()` with `this.googleApiRequest()`
- Keep `validateCredentials()` working for both Pipedream-backed and legacy direct-token rows

### Hosted connect flow
- `src/app/api/connect/start/route.ts`
  - Extended the `reconnectConnectionId` logic so that `setupMode === "pipedream"` integrations also allow reconnect of legacy Nango rows during transition
  - This prevents orphaned Nango rows when a user reconnects a migrated provider

### Environment / config
- `wrangler.toml`
- `worker/wrangler.worker.toml`
  - Added `PIPEDREAM_APP_MAP` with explicit snake_case Pipedream app mappings for all 6 slugs
  - Added the 6 slugs to `PIPEDREAM_CONNECT_SLUGS`

## Env / Config to Add in Cloudflare

No additional secrets are required beyond what is already in the repo. The following **vars** must be present on both Workers (`clawlink-web` and `clawlink`):

```toml
PIPEDREAM_CONNECT_SLUGS = "slack,notion,google-sheets,google-calendar,google-docs,google-search-console,google-analytics,gmail"
PIPEDREAM_APP_MAP = "google-sheets=google_sheets,google-calendar=google_calendar,google-docs=google_docs,google-search-console=google_search_console,google-analytics=google_analytics,gmail=gmail"
```

Secrets (`PIPEDREAM_CLIENT_ID`, `PIPEDREAM_CLIENT_SECRET`) and existing vars (`PIPEDREAM_PROJECT_ID`, `PIPEDREAM_ENVIRONMENT`) remain unchanged.

## Deploy Commands

After this change ships:

```bash
npm run deploy:web
npm run deploy:worker
```

Both must be deployed because:
- `clawlink-web` serves the hosted connect flow and Next API routes
- `clawlink` serves the worker tool execution and Pipedream proxy calls

## Verification Plan

### 1. Hosted connect flow (per provider)

1. Start from the dashboard integration page
2. Click Connect for the provider
3. Complete the Pipedream hosted OAuth dialog
4. Poll the session endpoint until status becomes `connected`
5. Verify the `user_integrations` row has:
   - `auth_provider = 'pipedream'`
   - `pipedream_account_id` is populated
   - `auth_state = 'active'`

### 2. Worker tool execution (per provider)

Recommended test order:

**Google Sheets**
- `get_spreadsheet` (read)
- `append_rows` (write)

**Google Calendar**
- `list_calendars` (read)
- `create_event` (write)
- `delete_event` (cleanup)

**Google Docs**
- `get_document` (read)
- `append_text` (write)

**Google Search Console**
- `list_sites` (read)
- `search_analytics_query` (read)

**Google Analytics**
- `run_report` (read)

**Gmail**
- `list_emails` (read)
- `create_draft` (write)

For each:
- Confirm the worker routes the request through Pipedream proxy (no raw access token in handler logs)
- Confirm legacy Nango-backed rows (if any exist for `gmail` / `google-analytics`) still execute successfully using the direct-token fallback path

### 3. Reconnect and delete

- Mark a connection as `needs_reauth`, then reconnect it and confirm the same row is updated
- Delete a Pipedream-backed connection and confirm the Pipedream account is also deleted

## Credential Backend Routing

The existing `worker/credentials.ts` logic already supports this migration without changes:

- `usesNangoManagedCredentials(integration, record)` returns `true` only when the integration is in `isOAuthIntegration()` **and** the record is **not** Pipedream-backed
- For `gmail` and `google-analytics` (currently Nango-backed), old rows continue to load via Nango
- New Pipedream rows load via the encrypted placeholder credentials path and return `{ pipedreamAccountId: "..." }`
- For the other 4 Google providers (never Nango-backed), there are no legacy Nango rows to worry about

## Provider-Specific Gaps / Notes

1. **Google Analytics Measurement Protocol tools** (`validate_events`, `send_events`) intentionally use direct `fetch()` to `www.google-analytics.com` because they rely on API secrets, not OAuth tokens. These were left untouched.

2. **Google Docs** uses both the Docs API (`docs.googleapis.com`) and Drive API (`www.googleapis.com/drive/v3`) for folder moves. The Pipedream proxy path handles both because full URLs are passed to `googleApiRequest()`.

3. **Gmail** `validateCredentials` short-circuits to `true` for Pipedream-backed rows (same pattern as Slack/Notion), avoiding an unnecessary direct API call.

4. **No Pipedream action wrapping** was done in this batch. All tools continue to use custom handlers that call the Google APIs directly (via Pipedream proxy). Future work could evaluate replacing individual tools with Pipedream components, but that is out of scope for this migration.

5. **Nango removal** is NOT included in this batch. `NANGO_PROVIDER_CONFIG_KEYS` still includes `gmail` and `google-analytics` so legacy rows can continue to function until the final cleanup phase.
