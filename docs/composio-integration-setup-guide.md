# Composio Integration Setup Guide

How to add a new Composio-backed integration to ClawLink (or expand an existing one to its full tool catalog).

This guide was built from the Instantly pilot. Follow it step-by-step for each new integration (Gmail, Outlook, ClickUp, Apollo, etc.).

---

## Prerequisites

Before starting, make sure you have:

- `COMPOSIO_API_KEY` available in `.env.local` (and as a Cloudflare secret for both workers)
- A Composio auth config created for the integration in the [Composio dashboard](https://dashboard.composio.dev)
  - ClawLink uses **Composio's managed auth** -- Composio owns the OAuth app credentials, redirect URIs, and token exchange. You do not need to register your own OAuth app with providers like Microsoft, Google, etc.
  - For OAuth providers (Gmail, Outlook, ClickUp): create an auth config in Composio's dashboard. Composio provides the managed OAuth app. No redirect URI configuration needed on your side.
  - For API key providers (Apollo, Instantly): create an API key auth config in Composio's dashboard.
- The auth config ID saved in `.env.local` as `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (e.g. `COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."`)
- The Composio toolkit slug for the integration (e.g. `gmail`, `outlook`, `clickup`, `apollo`, `instantly`)

### `.env.local` Composio secrets convention

All Composio secrets live in `.env.local` at the repo root. This is the single source of truth. The naming convention is:

```bash
# Shared across all integrations
COMPOSIO_API_KEY=ak_...

# Per-integration auth config IDs
COMPOSIO_INSTANTLY_AUTH_CONFIG_ID="ac_..."
COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."
COMPOSIO_OUTLOOK_AUTH_CONFIG_ID="ac_..."
COMPOSIO_GMAIL_AUTH_CONFIG_ID="ac_..."
```

These values are pushed to Cloudflare Workers as secrets during Step 4. The runtime code in `backend-client.ts` resolves auth config IDs by checking `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` env vars (it also supports a `COMPOSIO_AUTH_CONFIG_MAP` comma-separated map, but per-integration vars are the current convention).

---

## Step 1: Discover the Composio Toolkit

Before writing any code, confirm what's available.

### Check the Composio docs page

Each toolkit has a docs page at:
```
https://docs.composio.dev/toolkits/<slug>.md
```

For example: `https://docs.composio.dev/toolkits/gmail.md`

This page lists every available tool with its slug, description, input parameters (name, type, required, description), and output parameters.

### Call the Composio API to list tools

```bash
curl -s -X GET \
  "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
  -H "x-api-key: $COMPOSIO_API_KEY" | jq '.items | length'
```

Replace `<TOOLKIT_SLUG>` with the lowercase slug (e.g. `gmail`, `instantly`, `clickup`).

The response shape is:

```json
{
  "items": [
    {
      "slug": "GMAIL_SEND_EMAIL",
      "name": "Send Email",
      "description": "Send an email using Gmail...",
      "toolkit": { "slug": "gmail", "name": "Gmail" },
      "input_parameters": {
        "type": "object",
        "required": ["to", "subject"],
        "properties": {
          "to": { "type": "string", "description": "Recipient email" },
          "subject": { "type": "string", "description": "Email subject" },
          "body": { "type": "string", "description": "Email body" }
        }
      },
      "output_parameters": { ... },
      "tags": ["readOnlyHint", "Email"],
      "is_deprecated": false,
      "version": "20260429_00"
    }
  ],
  "total_items": 85,
  "next_cursor": null
}
```

Key details about the response:
- `input_parameters` is a **JSON Schema object** with top-level `type`, `properties`, and `required` fields (not a flat map)
- `tags` includes **Composio hint tags** that the script uses for classification: `readOnlyHint`, `createHint`, `updateHint`, `destructiveHint`, `idempotentHint`
- `tags` also includes category strings like `"Email"`, `"Campaigns"`, `"Leads & Segmentation"` etc.

Optionally save reference data locally:

```bash
curl -s -X GET \
  "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
  -H "x-api-key: $COMPOSIO_API_KEY" > .firecrawl/composio-<slug>-tools.json

firecrawl scrape "https://docs.composio.dev/toolkits/<slug>.md" --only-main-content -o .firecrawl/composio-<slug>.md
```

---

## Step 2: Generate the Tool Manifest

The generation script already exists at `scripts/import-composio-tools.mjs`. The npm script `import:composio-tools` is registered in `package.json`.

### Run it

```bash
npm run import:composio-tools -- --toolkit <COMPOSIO_TOOLKIT_SLUG> --integration <CLAWLINK_SLUG>
```

Examples:

```bash
npm run import:composio-tools -- --toolkit gmail --integration gmail
npm run import:composio-tools -- --toolkit apollo --integration apollo
npm run import:composio-tools -- --toolkit clickup --integration clickup
npm run import:composio-tools -- --toolkit instantly --integration instantly
```

Use `--dry-run` to preview without writing files:

```bash
npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run
```

### What it does

1. Reads `COMPOSIO_API_KEY` from `.env.local`
2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`
3. Skips deprecated tools (`is_deprecated === true`)
4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback
5. Generates `askBefore` prompts for write/destructive tools
6. Writes `src/generated/composio-manifests/<integration>.generated.ts`
7. Updates the barrel file `src/generated/composio-manifests/index.ts`

**Important:** The script intentionally does **not** include `inputSchema` in the generated manifests. Schemas are fetched lazily at runtime from Composio's API and cached in KV. This keeps the worker bundle small (~75% reduction in manifest size) and means schema updates from Composio are picked up automatically without re-importing. See "Runtime Schema Hydration" below for details.

### How it classifies tools

The script uses Composio's own hint tags from the `tags` array as the primary signal:

| Composio tag | `mode` | `risk` |
|---|---|---|
| `readOnlyHint` | `"read"` | `"safe"` |
| `createHint` | `"write"` | `"confirm"` |
| `updateHint` | `"write"` | `"confirm"` |
| `destructiveHint` | `"write"` | `"high_impact"` |

If no hint tag is present, the script falls back to slug pattern matching:

| Slug pattern | `mode` | `risk` |
|---|---|---|
| Contains `GET`, `LIST`, `COUNT`, `CHECK`, `EXPORT`, `SEARCH`, `FIND`, `ENUM`, `STATUS`, `ANALYTICS`, `STATS`, `VITALS`, `OVERVIEW` | `"read"` | `"safe"` |
| Contains `DELETE`, `REMOVE` | `"write"` | `"high_impact"` |
| Anything else | `"write"` | `"confirm"` |

**Important:** The `ToolRisk` type in ClawLink is `"safe" | "confirm" | "high_impact"`. There is no `"dangerous"` value.

### What the output looks like

The script generates a TypeScript file with one `composioTool({...})` call per tool. Note that `inputSchema` is **not** included — the factory function sets an empty stub, and real schemas are hydrated at runtime:

```typescript
composioTool({
  name: "apollo_search_people",
  description: "Search for people in Apollo's database...",
  toolSlug: "APOLLO_SEARCH_PEOPLE",
  mode: "read",
  risk: "safe",
  tags: ["composio", "apollo", "read", "people"],
}),
```

The `composioTool()` factory inside each generated file fills in defaults including `inputSchema: { type: "object", properties: {} }` (the empty stub), `execution: { kind: "composio_tool", toolkit, toolSlug, version }`, and other fields like `integration`, `accessLevel`, `idempotent`, etc.

The barrel file at `src/generated/composio-manifests/index.ts` is automatically rewritten to import and re-export all `*.generated.ts` files in the directory.

### Runtime Schema Hydration

ClawLink resolves real Composio schemas lazily at runtime instead of bundling them into the generated manifest files:

1. `scripts/import-composio-tools.mjs` generates lean static manifests with metadata, `execution`, and a stub `inputSchema: { type: "object", properties: {} }`.
2. `src/lib/composio/manifest-registry.ts` loads those static manifests and exposes `hydrateComposioToolSchemas()` to patch stub schemas in place.
3. `src/lib/composio/schema-cache.ts` resolves schemas in this order:
   - in-memory cache for the current worker instance
   - Cloudflare KV in the shared `CREDENTIALS` namespace under `composio-schema:<integrationSlug>`
   - Composio API fetch as fallback
4. `src/lib/composio/backend-client.ts` fetches `GET /api/v3.1/tools?...` and converts each tool's `input_parameters` into the same simplified JSON Schema shape ClawLink exposes to MCP clients.
5. `worker/index.ts` hydrates schemas during `tools/list`, but only for Composio integrations the authenticated user has actually connected.
6. `src/lib/server/tool-registry.ts` uses the same hydration path for dashboard/API tool descriptions.

This means schema fetches are paid only when they are actually needed, and most requests reuse memory or KV cache. If hydration fails, the tool keeps the stub schema, but the manifest metadata and execution wiring still remain intact.

### Verify

After running, check:
- The generated file has the expected number of tools (compare with `total_items` from the API)
- A sample of read tools have `risk: "safe"`
- A sample of delete tools have `risk: "high_impact"`
- TypeScript compiles: `npx tsc --noEmit src/generated/composio-manifests/<slug>.generated.ts 2>&1 | grep -v node_modules`

---

## Step 3: Update the Integration Catalog

Edit `src/data/integrations.ts` to register (or update) the integration entry.

### If the integration already exists as Pipedream

Change `setupMode` from `"pipedream"` to `"composio"` and update the tools list.

**Example (Gmail currently uses Pipedream):**

```typescript
gmail: {
    setupMode: "composio",  // was "pipedream"
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Gmail through ClawLink's hosted setup...",
    credentialFields: [],
    tools: [
      // Curated subset of ~10-15 key tools for dashboard display
      { name: "gmail_send_email", description: "Send a Gmail message" },
      { name: "gmail_list_emails", description: "List Gmail messages" },
      { name: "gmail_get_email", description: "Get a specific Gmail message" },
      { name: "gmail_create_draft", description: "Create a draft in Gmail" },
      // ... more curated tools
    ],
  },
```

### If the integration is new

Add a new entry in `integrationMetadata`:

```typescript
<slug>: {
    setupMode: "composio",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect <Name> through ClawLink's hosted setup. ...",
    credentialFields: [],
    tools: [
      // Curated 10-15 representative tools
    ],
  },
```

Also add the base entry in `integrations` if it doesn't exist:

```typescript
{ name: "<Name>", slug: "<slug>", description: "...", category: "...", icon: "...", color: "#..." }
```

### Dashboard tools curation

The `tools` array in `integrations.ts` is what users see on the dashboard integration page. Do NOT list all tools here. Pick ~10-15 representative tools across the key categories the integration offers.

For example, for Instantly (115 active tools), the curated dashboard list is:

| Category | Example tools |
|---|---|
| Workspace | `instantly_get_current_workspace`, `instantly_get_workspace_billing_plan_details` |
| Campaigns | `instantly_list_campaigns`, `instantly_create_campaign`, `instantly_get_campaign_analytics`, `instantly_activate_campaign`, `instantly_pause_campaign` |
| Leads | `instantly_list_leads`, `instantly_create_lead`, `instantly_add_leads_bulk` |
| Lead Lists | `instantly_list_lead_lists` |
| Accounts | `instantly_list_accounts` |
| Emails | `instantly_list_emails` |
| Webhooks | `instantly_list_webhooks` |

All tools are still available to OpenClaw at runtime regardless of what's listed here.

---

## Step 4: Update Wrangler Environment Configs

Both workers need Composio config for the new integration.

### `wrangler.toml` (frontend worker `clawlink-web`)

Update the comma-separated maps:

```toml
COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
```

### `worker/wrangler.worker.toml` (backend worker `clawlink`)

Same changes:

```toml
COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
```

### Secrets: Push from `.env.local` to Cloudflare Workers

All Composio secrets must be set on **both** workers. The values are already in `.env.local` -- read them from there and push via wrangler.

**Important:** `wrangler secret put` reads from stdin in non-interactive mode. Use `echo` to pipe the value.

#### Push the per-integration auth config ID

Read the value from `.env.local` and set it on both workers:

```bash
# Extract the value (strip quotes)
AUTH_CONFIG_ID=$(grep COMPOSIO_<SLUG>_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')

# Push to frontend worker (clawlink-web, uses wrangler.toml)
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID

# Push to backend worker (clawlink, uses worker/wrangler.worker.toml)
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
```

Concrete example for Apollo:

```bash
AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
```

#### Push `COMPOSIO_API_KEY` (only needed once, not per-integration)

If this is the first Composio integration being set up and the API key hasn't been pushed yet:

```bash
API_KEY=$(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '"')
echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY
echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY --config worker/wrangler.worker.toml
```

#### Verify secrets are set

```bash
# List secrets on frontend worker
wrangler secret list

# List secrets on backend worker
wrangler secret list --config worker/wrangler.worker.toml
```

Both should show `COMPOSIO_API_KEY` and `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` in the list.

### Finding the toolkit version

The version is printed by the import script (e.g. `Toolkit version: 20260429_00`). It's also returned in the list-tools API response (`version` field on each tool). Use the same version for all tools in a toolkit.

---

## Step 5: Handle Auth Flow Differences

Composio supports two auth methods. The ClawLink frontend already handles both generically. **No redirect URI configuration is needed** because ClawLink uses Composio's managed auth -- Composio owns the OAuth apps and handles all redirect URIs internally.

### OAuth-based integrations (Gmail, Outlook, ClickUp)

The flow is:

```
User clicks Connect on ClawLink dashboard
  → POST /api/connect/sessions/{token}/composio
    → createComposioConnectLink() sends auth_config_id + callback_url to Composio
    → Composio returns a redirectUrl (their hosted OAuth page)
  → window.location.assign(redirectUrl) — full page redirect to Composio
  → Composio's hosted page redirects to the provider's OAuth login (e.g. Microsoft)
  → User authorizes on the provider's OAuth page
  → Provider redirects back to Composio (Composio owns this redirect URI)
  → Composio processes tokens, stores credentials
  → Composio redirects to ClawLink's callback_url:
      /api/connect/sessions/{token}/composio/complete?connected_account_id=...
  → ClawLink's /complete route polls until account is active, saves to D1
  → User is redirected back to the connect page with status "connected"
```

**No additional frontend code or redirect URI setup needed.** Composio manages the OAuth app registration, redirect URIs, and token exchange for the provider. ClawLink only needs:

1. The `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` set as a secret (from `.env.local`)
2. `setupMode: "composio"` in `integrations.ts`

The `HostedConnectPage.tsx` already detects `setupMode === "composio"` and auto-triggers `handleStartComposio()`. The `/composio/route.ts` creates the connect link. The `/composio/complete/route.ts` handles the callback. All generic, no per-integration code.

### API key-based integrations (Instantly, Apollo)

The same flow works for API key integrations. Composio shows its own hosted API key input page instead of an OAuth login page. The user pastes their API key on Composio's page, Composio validates it and redirects back to ClawLink's callback.

**No custom routes or forms needed.** The standard Composio connect flow handles both OAuth and API key auth types.

---

## Step 6: Handle Pipedream-to-Composio Migration (If Applicable)

If the integration previously had a Pipedream manifest, you need to disable it at runtime. A database migration is **not** needed unless you have real users with existing Pipedream connections.

### 6a. Disable Pipedream tools at runtime

Add the integration slug to the disabled set in `worker/integrations/index.ts`:

```typescript
const disabledPipedreamManifestIntegrations = new Set(["instantly", "gmail"]);
```

This ensures Pipedream manifest tools are not served for this integration. Only Composio tools will be active.

### 6b. Migrate existing user connections (only if you have real users)

**Skip this step unless you have real users with active Pipedream connections for this integration.** If the product has no external users yet, or if nobody has connected this integration through Pipedream, there is nothing to migrate.

If you do have real users with Pipedream connections that need to be invalidated, create a SQL migration:

```sql
-- Mark existing Pipedream connections as needing reauth
UPDATE user_integrations
SET auth_state = 'needs_reauth',
    auth_error = '<Integration> now connects through ClawLink''s hosted setup. Reconnect to enable the expanded tool catalog.',
    is_default = 0,
    updated_at = datetime('now')
WHERE integration = '<slug>'
  AND (auth_provider = 'pipedream' OR pipedream_account_id IS NOT NULL);
```

Run it with:

```bash
wrangler d1 execute clawlink --file migrations/0XX_composio_<slug>.sql
```

### 6c. Keep Pipedream manifests on disk

Don't delete the Pipedream generated manifest files. They remain on disk but are disabled at runtime by the `disabledPipedreamManifestIntegrations` set. This allows easy rollback if needed.

---

## Step 7: Update Smoke Test Presets

Create or update `scripts/smoke-presets/<slug>.mjs`:

```javascript
export default {
  read: [
    {
      tool: "<slug>_list_<resource>",
      args: {},
      label: "List <resources>",
    },
    {
      tool: "<slug>_get_<resource>",
      args: { id: "test-id" },
      label: "Get <resource>",
    },
  ],
  preview: [
    {
      tool: "<slug>_create_<resource>",
      args: { name: "ClawLink Test" },
      label: "Preview create <resource>",
    },
  ],
};
```

Focus on:
- At least 2-3 safe read presets
- Optionally 1 preview/write preset using sandboxed test data

---

## Step 8: Deploy

Both workers need redeployment:

```bash
# Build and deploy frontend (serves dashboard, connect flow, API routes)
npm run build:web && npm run deploy:web

# Build and deploy worker (serves tool execution at api.claw-link.dev)
npm run build:worker && npm run deploy:worker
```

**Important:** If you only deploy one worker, the other won't have the new integration. Deploy both.

---

## Step 9: Validate

Follow the standard integration MVP testing layers from `AGENTS.md`:

### Layer 1: Connection flow

1. Go to the dashboard, find the new integration
2. Click Connect
3. Complete the OAuth flow (or API key submission)
4. Verify the connection session ends in `connected`
5. Verify the connection shows in the dashboard

### Layer 2: Tool execution

1. Use the OpenClaw plugin or the worker API directly
2. Test read tools first (list, get)
3. Then test write tools (create, update)
4. Verify Composio returns valid data

### Automated validation

```bash
# Static manifest audit
npm run audit:manifests -- --strict

# Smoke test (if presets are configured)
npm run smoke:openclaw-plugin -- --preset <slug>
```

---

## Quick Reference: Files to Touch Per Integration

| File | Action | Required? |
|---|---|---|
| `src/generated/composio-manifests/<slug>.generated.ts` | Create via `npm run import:composio-tools` | Yes |
| `src/generated/composio-manifests/index.ts` | Auto-updated by the script | Yes (automatic) |
| `src/data/integrations.ts` | Add/update integration entry with `setupMode: "composio"` and curated tools | Yes |
| `wrangler.toml` | Add to `COMPOSIO_ENABLED_SLUGS`, `COMPOSIO_TOOLKIT_MAP`, `COMPOSIO_TOOLKIT_VERSION_MAP` | Yes |
| `worker/wrangler.worker.toml` | Same as above | Yes |
| Cloudflare secrets | Set `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (or update `COMPOSIO_AUTH_CONFIG_MAP`) | Yes |
| `worker/integrations/index.ts` | Add to `disabledPipedreamManifestIntegrations` if migrating from Pipedream | Only if migrating |
| `migrations/0XX_composio_<slug>.sql` | Invalidate old Pipedream connections | Only if you have real users with Pipedream connections |
| `scripts/smoke-presets/<slug>.mjs` | Create smoke test presets | Recommended |

---

## Quick Reference: What Does NOT Need to Change

These are fully generic and handle any Composio integration automatically:

- `scripts/import-composio-tools.mjs` — Already built, works for any toolkit unless you are changing manifest generation behavior itself
- `src/lib/composio/backend-client.ts` — Composio API client for connection setup, tool execution, and runtime schema fetches
- `src/lib/composio/schema-cache.ts` — Generic lazy-schema cache layer (memory + KV + Composio fallback)
- `src/lib/composio/tool-executor.ts` — Tool execution adapter
- `src/lib/composio/manifest-registry.ts` — Indexes generated manifests and hydrates stub schemas in place
- `worker/index.ts` — Worker dispatch (handles any `composio_tool` execution kind)
- `worker/credentials.ts` — Credential loading for Composio connections
- `worker/integrations/index.ts` — Auto-includes all Composio manifests (no per-integration wiring needed)
- `src/components/connect/HostedConnectPage.tsx` — Already handles `setupMode === "composio"` generically
- `src/app/api/connect/sessions/[token]/composio/route.ts` — Creates connect link for any Composio integration
- `src/app/api/connect/sessions/[token]/composio/complete/route.ts` — Handles OAuth callback for any Composio integration
- `src/app/api/connect/start/route.ts` — Handles `"composio"` setup mode generically
- `src/lib/server/tool-registry.ts` — Dashboard/API tool listing already hydrates Composio schemas generically
- `src/lib/server/integration-store.ts` — Saves Composio connections generically
- `src/lib/server/connection-sessions.ts` — Completes Composio sessions generically
- Database schema — No changes needed (Composio columns already exist from migration 012)

---

## Example: Adding Apollo via Composio

```bash
# 1. Discover tools
curl -s "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=apollo&toolkit_versions=latest&limit=1000" \
  -H "x-api-key: $(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '\"')" | jq '.total_items'

# 2. Dry-run to preview
npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run

# 3. Generate manifest
npm run import:composio-tools -- --toolkit apollo --integration apollo

# 4. Edit src/data/integrations.ts
#    - If apollo already exists: change setupMode to "composio", update tools list
#    - If new: add base entry + metadata entry

# 5. Edit wrangler.toml + worker/wrangler.worker.toml
#    Add apollo to COMPOSIO_ENABLED_SLUGS, COMPOSIO_TOOLKIT_MAP, COMPOSIO_TOOLKIT_VERSION_MAP

# 6. Push secrets from .env.local to both workers
AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml

# 7. If migrating from Pipedream:
#    - Add "apollo" to disabledPipedreamManifestIntegrations in worker/integrations/index.ts
#    - Only create a migration file if you have real users with Pipedream connections

# 8. Deploy both workers
npm run build:web && npm run deploy:web
npm run build:worker && npm run deploy:worker

# 9. Test
#    Connect Apollo through the dashboard
#    Verify tool execution works
```

---

## Composio API Quick Reference

| Endpoint | Purpose |
|---|---|
| `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000` | List all tools for a toolkit |
| `GET /api/v3.1/tools/{tool_slug}` | Get single tool details |
| `GET /api/v3.1/tools/enum?toolkit_slug=<slug>` | Get tool slug enum list |
| `POST /api/v3.1/tools/execute/{tool_slug}` | Execute a tool |
| `POST /api/v3.1/connected_accounts/link` | Create connect link (for OAuth flow) |
| `GET /api/v3.1/connected_accounts/{id}` | Get connected account details |
| `DELETE /api/v3.1/connected_accounts/{id}` | Delete connected account |

Base URL: `https://backend.composio.dev`
Auth: `x-api-key` header with your `COMPOSIO_API_KEY`
