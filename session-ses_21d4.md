# Bundle size optimization strategy

**Session ID:** ses_21d4cb0e8ffeLFFTJlAW1ljY6B
**Created:** 5/1/2026, 2:11:35 PM
**Updated:** 5/1/2026, 4:26:28 PM

---

## User

The manifests are ~15 MB of TypeScript source, mostly inputSchema (full JSON Schema for every tool parameter). Here's the data:
Top files
docusign
stripe
sendgrid
activecampaign
The vast majority of each file is inputSchema objects — full JSON Schema definitions with parameter names, types, descriptions, nested properties. Those are needed only at execution time, not for listing/displaying tools.
Best approach: Strip inputSchema from bundled manifests, fetch it from Composio's API at runtime.
Here's why this works:
1. The dashboard only needs name, description, mode, risk, tags — already in integrations.ts curated lists
2. The backend worker already calls Composio's API to execute tools — it can fetch the schema lazily and cache it
3. inputSchema is only needed when actually constructing the API call, not for listing tools
This would cut bundle size by ~80-90% since the schemas are the bulk of each file.
Want me to implement this? The changes would be:
1. Modify import-composio-tools.mjs to generate manifests without inputSchema
2. Modify the tool executor to fetch input schema from Composio API (or KV cache) at runtime
3. Both workers stay under 3 MiB  do you think this will work

---

## Assistant (Build · Claude Opus 4.6 · 160.4s)

Let me analyze the current state of the codebase to understand the manifest structure, how they're used, and whether this approach is viable.

**Tool: task**

**Input:**
```json
{
  "description": "Analyze manifest structure and usage",
  "prompt": "Research the ClawLink codebase to understand the current manifest/tool system. I need to answer these questions:\n\n1. Find the manifest files - look in directories like `worker/manifests/`, `manifests/`, or similar. What's the file structure? How large are they?\n2. Find `import-composio-tools.mjs` or similar import scripts - how do they generate manifests?\n3. How does the worker use manifests at execution time? Search for where `inputSchema` is read/used in the worker code.\n4. How does the dashboard/frontend reference tools? Does it read from manifest files or from `integrations.ts`?\n5. What's the current worker bundle size situation? Check `wrangler.toml` and `worker/wrangler.worker.toml` for any size-related config.\n6. Look at how Composio API calls are made - is there already a pattern for fetching tool metadata from Composio?\n\nBe very thorough - check glob patterns like `**/*manifest*`, `**/*composio*`, `**/integrations.ts`, worker source files, etc. Return all findings with file paths and relevant code snippets.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_21d4c860fffeMrshdcjXzE655e (for resuming to continue this task if needed)

<task_result>
Now I have a comprehensive picture. Here is a thorough report covering all six questions.

---

## Complete Findings

### 1. Manifest Files: Structure and Size

**Location:** Generated TypeScript files live under two directories:

- `/Users/hithesh/clawlink/src/generated/composio-manifests/` -- **13 MB**, 49 `.generated.ts` files + 1 `index.ts`
- `/Users/hithesh/clawlink/src/generated/pipedream-manifests/` -- **2 MB**, 25 `.generated.ts` files + 1 `index.ts`
- **Total: ~15 MB** of generated TypeScript source under `src/generated/`

**File structure per Composio manifest** (e.g., `/Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts`):
- Each file defines a local `composioTool()` helper that fills in defaults (integration slug, `execution.kind: "composio_tool"`, toolkit name, version).
- It exports a typed array (e.g., `gmailComposioTools: IntegrationTool[]`).
- Each tool entry contains: `name`, `description`, `toolSlug`, `mode`, `risk`, `inputSchema` (full JSON Schema with nested `properties`, `required`, `description`, `enum` values), `tags`, `askBefore`, and optionally `idempotent`.

**File structure per Pipedream manifest** (e.g., `/Users/hithesh/clawlink/src/generated/pipedream-manifests/google-drive.generated.ts`):
- Exports a raw array typed as `PipedreamActionToolManifest[]`.
- Each entry has all the same tool metadata fields plus an `execution` block of kind `pipedream_action` with `app`, `componentId`, `version`, `authPropNames`, `dynamicPropNames`, and a full `props` array (including hidden/auth props with all their metadata: `remoteOptions`, `reloadProps`, `withLabel`, `appAuth`, etc.).
- Also includes a `source` block with `app`, `componentKey`, `componentName`.

**Barrel indexes:**
- `/Users/hithesh/clawlink/src/generated/composio-manifests/index.ts` -- imports all 49 per-integration arrays, re-exports them spread into one `composioToolManifests: IntegrationTool[]`.
- `/Users/hithesh/clawlink/src/generated/pipedream-manifests/index.ts` -- imports all 25 per-integration arrays, re-exports them spread into one `pipedreamToolManifests: PipedreamActionToolManifest[]`.

**Largest individual files (Composio):**
| File | Size | Lines |
|---|---|---|
| `docusign.generated.ts` | 3.5 MB | 71,278 |
| `stripe.generated.ts` | 1.1 MB | 30,580 |
| `outlook.generated.ts` | 644 KB | 17,060 |
| `shopify.generated.ts` | 624 KB | 17,079 |
| `sendgrid.generated.ts` | 592 KB | 12,671 |
| `hubspot.generated.ts` | 588 KB | 16,718 |

**Total line counts:** 338,523 lines across all Composio manifests; 64,795 lines across all Pipedream manifests.

---

### 2. Import Scripts: How Manifests Are Generated

There are **two** import scripts and **one** audit script:

#### a) `/Users/hithesh/clawlink/scripts/import-composio-tools.mjs` (641 lines)

**How it works:**
1. Parses `--toolkit <slug>` and optional `--integration <slug>` from CLI args.
2. Reads `COMPOSIO_API_KEY` from `.env.local` or `.env.production`.
3. Calls the Composio API v3.1 at `GET /tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000&include_deprecated=true`.
4. **Classifies** each tool's `mode`/`risk` using Composio hint tags (`readOnlyHint`, `createHint`, `updateHint`, `destructiveHint`, `idempotentHint`) with slug-pattern fallback regex for reads/destructives.
5. **Converts `input_parameters`** from Composio's schema format into a simplified JSON Schema (strips `$ref` to `{type: "object", additionalProperties: true}`, flattens nested objects, maps types).
6. Generates `askBefore` prompts for write/destructive tools.
7. **Renders TypeScript source code** directly (not JSON) -- uses a custom `renderValue()` to emit formatted TS object literals. Each generated file contains a `composioTool()` factory function hard-coded with the integration slug, toolkit name, and version.
8. Writes to `src/generated/composio-manifests/<slug>.generated.ts`.
9. Rewrites the barrel `index.ts` by scanning all `.generated.ts` files in the directory.

Key API call pattern (line 98-119):
```js
const url = new URL(`${baseUrl}/tools`);
url.searchParams.set("toolkit_slug", toolkitSlug);
url.searchParams.set("toolkit_versions", "latest");
url.searchParams.set("limit", "1000");
url.searchParams.set("include_deprecated", "true");

const response = await fetch(url.toString(), {
  headers: { Accept: "application/json", "x-api-key": apiKey },
});
```

#### b) `/Users/hithesh/clawlink/scripts/import-pipedream-actions.mjs` (1,037 lines)

**How it works:**
1. Parses `--app <app>`, optional `--integration <slug>`, and optional `--source connect|github`.
2. Tries Pipedream Connect SDK first (`client.actions.list()` then `client.actions.retrieve()` for detail); falls back to GitHub repo source parsing if blocked by plan limits.
3. For GitHub source: fetches raw `.mjs` files from `PipedreamHQ/pipedream` master, uses TypeScript compiler API (`ts.createSourceFile`) to statically evaluate the JS module exports (AST walking to extract `props`, `propDefinition`, annotations, etc.).
4. Applies overrides from `/Users/hithesh/clawlink/config/pipedream-action-overrides.mjs` (per-integration `hiddenProps`, `excludeActionIds`, per-action `propOverrides`, `toolName`, `mode`, `risk`, etc.).
5. Filters hidden/disabled/readonly/auth/alert props from `inputSchema`. Builds JSON Schema from remaining exposed props.
6. Writes to `src/generated/pipedream-manifests/<slug>.generated.ts` as a raw JSON-style `satisfies PipedreamActionToolManifest[]`.
7. Rewrites the barrel `index.ts`.

#### c) `/Users/hithesh/clawlink/scripts/audit-pipedream-manifests.mjs` -- static validation of generated manifests.

---

### 3. How the Worker Uses Manifests at Execution Time

The **worker entry point** is `/Users/hithesh/clawlink/worker/index.ts`.

**Tool resolution chain:**

1. `handleListTools()` (line 570-572) calls `getAllRegisteredTools()` from `/Users/hithesh/clawlink/worker/integrations/index.ts`.

2. `getAllRegisteredTools()` (line 104-119) **merges three sources**:
   - **Custom handlers** (only Postiz remains) -- via `getAllHandlers()` calling each handler's `getTools()`.
   - **Pipedream manifest tools** -- via `getAllPipedreamManifestTools()` from `src/lib/pipedream/manifest-registry.ts`, filtered by `disabledPipedreamManifestIntegrations` (a large set of integrations that have migrated to Composio).
   - **Composio manifest tools** -- via `getAllComposioManifestTools()` from `src/lib/composio/manifest-registry.ts`.
   
   Priority: custom handlers > Pipedream manifests > Composio manifests (if name collision, first wins).

3. `handleToolCall()` (line 275-565) resolves the tool by name, then branches on `tool.execution.kind`:
   - **`"pipedream_action"`**: Calls `executePipedreamActionTool()` from `/Users/hithesh/clawlink/src/lib/pipedream/action-executor.ts`. This uses `tool.execution.props` (the full prop metadata from the manifest) to build `configuredProps` -- mapping auth props to `{ authProvisionId: accountId }` and normalizing label-value pairs. Calls `client.actions.run()` via Pipedream SDK.
   - **`"composio_tool"`**: Calls `executeComposioTool()` from `/Users/hithesh/clawlink/src/lib/composio/tool-executor.ts`. This extracts `execution.toolSlug`, `execution.toolkit`, `execution.version` from the manifest and calls Composio's `POST /tools/execute/<toolSlug>` API via `/Users/hithesh/clawlink/src/lib/composio/backend-client.ts`.
   - **`"custom"`**: Calls the registered handler's `execute()` method (only Postiz).

**Where `inputSchema` is used:**
- `inputSchema` is defined on every `IntegrationTool` in `/Users/hithesh/clawlink/worker/integrations/base.ts` (line 26).
- It is returned to MCP clients via `tools/list` (the entire tool object including `inputSchema` is serialized).
- It is served to the dashboard via the tool-registry/tooling layer.
- The `inputSchema` is **not validated** at execution time in the worker -- arguments are passed through directly to the provider API.
- For Pipedream tools, the `execution.props` array (not `inputSchema`) drives which args are forwarded via `buildConfiguredProps()`.

---

### 4. How the Dashboard/Frontend References Tools

The dashboard uses **both** `integrations.ts` (for static UI/config metadata) and **manifest-based tool registries** (for actual tool listings).

**Static integration catalog:** `/Users/hithesh/clawlink/src/data/integrations.ts`
- Defines 85+ integrations with: `name`, `slug`, `description`, `category`, `icon`, `color`, `setupMode` (`"oauth" | "pipedream" | "composio" | "coming_soon"`), `dashboardStatus`, `runtimeStatus`, `setupGuide`, `credentialFields`, and a **hand-curated `tools[]`** array with `{ name, description }` pairs.
- This `tools[]` is a **summary for display purposes** -- it does not contain `inputSchema` or execution metadata.
- Used directly by: dashboard integrations page, integration grid, marketing grid, connect flow pages, and API routes for slug lookup.

**Dynamic tool loading for the integration detail page:**
1. `/Users/hithesh/clawlink/src/app/dashboard/integrations/[slug]/page.tsx` renders `<IntegrationDetails integration={integration} />` passing the static `Integration` object.
2. `IntegrationDetails` component fetches `GET /api/integrations/<slug>` (line 93).
3. That API route (`/Users/hithesh/clawlink/src/app/api/integrations/[slug]/route.ts`) calls `listToolDescriptionsForIntegration(user.id, slug)` from `/Users/hithesh/clawlink/src/lib/server/tooling.ts`, which re-exports from `/Users/hithesh/clawlink/src/lib/server/tool-registry.ts`.
4. `listToolDescriptionsForIntegration()` (line 369-412 in tool-registry.ts) queries the user's connections, then loads tool definitions from:
   - `listHandlerToolsForIntegration()` (custom handlers)
   - `listPipedreamToolsForIntegration()` (if user has Pipedream-backed connections)
   - `listComposioToolsForIntegration()` (if user has Composio-backed connections)
5. Builds `ToolDescription` objects including `inputSchema`, `mode`, `risk`, `requiresConfirmation`, etc.

**So the dashboard reads from generated manifest files at runtime** (not just from `integrations.ts`). The `integrations.ts` file provides the UI-level catalog (icons, colors, categories, setup mode), while the manifests provide the actual tool definitions with full schemas.

---

### 5. Worker Bundle Size Situation

**Worker wrangler config:** `/Users/hithesh/clawlink/worker/wrangler.worker.toml`
- Name: `clawlink`
- Main: `index.ts`
- Compatibility date: `2026-04-01`
- Flags: `nodejs_compat`
- No explicit size limits, upload limits, or bundle size configuration.
- No `[build]` section for custom build commands.

**Frontend wrangler config:** `/Users/hithesh/clawlink/wrangler.toml`
- Name: `clawlink-web`
- Main: `.open-next/worker.js`
- Flags: `nodejs_compat`, `global_fetch_strictly_public`
- No explicit size limits.

**Bundle size concern:**
- The worker at `worker/index.ts` imports `./integrations` which imports from `src/lib/pipedream/manifest-registry.ts` and `src/lib/composio/manifest-registry.ts`, which in turn import **all** generated manifests via the barrel indexes.
- That means the worker bundle includes **15 MB of generated TypeScript source** (338K + 65K lines), all compiled and bundled into the final worker.
- Cloudflare Workers have a **compressed bundle size limit** (typically 10 MB for paid plans, 1 MB for free). The **13 MB of Composio manifests alone** (with DocuSign at 3.5 MB, Stripe at 1.1 MB) are a serious scaling concern.
- Neither wrangler config has any `minify`, `rules`, or custom build optimizations configured.
- The frontend also imports these manifests via `tool-registry.ts` for server-side API routes.

---

### 6. Composio API Call Patterns

There is a well-established pattern for Composio API interaction in two files:

#### a) Import-time: `/Users/hithesh/clawlink/scripts/import-composio-tools.mjs`
Fetches tool **metadata** at import/codegen time:
```js
// GET https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000
const response = await fetch(url.toString(), {
  headers: { Accept: "application/json", "x-api-key": apiKey },
});
```
Returns `{ items: [...], total_items: N }` where each item has `slug`, `name`, `description`, `input_parameters` (schema), `tags` (including hint tags), `version`, `toolkit.slug`, `is_deprecated`.

#### b) Runtime: `/Users/hithesh/clawlink/src/lib/composio/backend-client.ts`
A full Composio client with these operations:
- **`executeComposioToolRequest()`** -- `POST /tools/execute/<toolSlug>` with `{ connected_account_id, user_id, version, arguments }`. This is the tool execution path.
- **`createComposioConnectLink()`** -- `POST /connected_accounts/link` for OAuth setup.
- **`getComposioConnectedAccountDetails()`** -- `GET /connected_accounts/<id>` for connection status.
- **`waitForComposioConnectedAccountActive()`** -- polling loop for connection activation.
- **`deleteComposioConnectedAccount()`** -- `DELETE /connected_accounts/<id>`.

Common infrastructure in `backend-client.ts`:
- `composioFetch<T>()` generic wrapper (line 207-233) -- handles auth header (`x-api-key`), JSON content type, error normalization.
- `getComposioConfig()` -- resolves per-integration config from env maps (`COMPOSIO_TOOLKIT_MAP`, `COMPOSIO_AUTH_CONFIG_MAP`, `COMPOSIO_TOOLKIT_VERSION_MAP`).
- Config maps are comma-separated `key=value` pairs stored in wrangler.toml `[vars]`.

**There is no runtime pattern for fetching tool metadata/schemas from Composio.** The `GET /tools` endpoint is only used in the import script. At runtime, the worker relies entirely on the pre-generated static manifests for tool schemas and metadata, and only calls `POST /tools/execute/<toolSlug>` for execution.

---

### Summary of Architecture

```
Import Scripts (offline)
  scripts/import-composio-tools.mjs  -->  GET /tools (Composio API)
  scripts/import-pipedream-actions.mjs  -->  Pipedream SDK / GitHub repo
       |
       v
  src/generated/composio-manifests/*.generated.ts  (13 MB, 49 files)
  src/generated/pipedream-manifests/*.generated.ts  (2 MB, 25 files)
       |
       +---> src/lib/composio/manifest-registry.ts  (caching layer)
       +---> src/lib/pipedream/manifest-registry.ts  (caching + buildTool mapper)
       |
       v
  worker/integrations/index.ts  (merges custom + pipedream + composio tools)
       |
       +---> worker/index.ts  (MCP server: tools/list, tools/call)
       |       |
       |       +---> src/lib/composio/tool-executor.ts --> backend-client.ts --> POST /tools/execute/<slug>
       |       +---> src/lib/pipedream/action-executor.ts --> Pipedream SDK client.actions.run()
       |
       +---> src/lib/server/tool-registry.ts  (dashboard tool listing)
                |
                +---> src/app/api/integrations/[slug]/route.ts  (serves tool data to dashboard)

  src/data/integrations.ts  (static UI catalog: icons, categories, setup mode, hand-curated tool summaries)
       |
       +---> Dashboard pages, integration grids, connect flows
```
</task_result>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.5s)

Excellent analysis. Now I have a clear picture. Let me look at the specific files that would need to change to validate feasibility.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/manifest-registry.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/composio/manifest-registry.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: import { composioToolManifests } from "@/generated/composio-manifests";
3: 
4: let cachedTools: IntegrationTool[] | null = null;
5: let cachedByName: Map<string, IntegrationTool> | null = null;
6: 
7: function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
8:   const tools = composioToolManifests
9:     .map((tool) => tool)
10:     .sort((left, right) => left.name.localeCompare(right.name));
11: 
12:   return {
13:     tools,
14:     byName: new Map(tools.map((tool) => [tool.name, tool])),
15:   };
16: }
17: 
18: function ensureCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
19:   if (cachedTools && cachedByName) {
20:     return {
21:       tools: cachedTools,
22:       byName: cachedByName,
23:     };
24:   }
25: 
26:   const built = buildCache();
27:   cachedTools = built.tools;
28:   cachedByName = built.byName;
29:   return built;
30: }
31: 
32: export function getAllComposioManifestTools(): IntegrationTool[] {
33:   return ensureCache().tools;
34: }
35: 
36: export function getComposioManifestToolByName(toolName: string): IntegrationTool | null {
37:   return ensureCache().byName.get(toolName) ?? null;
38: }
39: 
40: export function listComposioManifestToolsForIntegration(
41:   integration: string,
42: ): IntegrationTool[] {
43:   return getAllComposioManifestTools().filter((tool) => tool.integration === integration);
44: }

(End of file - total 44 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/tool-executor.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/composio/tool-executor.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: import type { ComposioToolExecutionSpec } from "../pipedream/manifest-types";
3: import { IntegrationRequestError } from "../../../worker/integrations/base";
4: import { executeComposioToolRequest } from "./backend-client";
5: 
6: export interface ExecuteComposioToolContext {
7:   requestId: string;
8:   externalUserId: string;
9:   credentials: Record<string, string>;
10:   env?: Record<string, unknown>;
11: }
12: 
13: export interface ExecuteComposioToolResult {
14:   data: unknown;
15:   providerRequestId?: string;
16: }
17: 
18: function safeTrim(value: unknown): string | null {
19:   return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
20: }
21: 
22: function ensureComposioExecution(tool: IntegrationTool): ComposioToolExecutionSpec {
23:   if (tool.execution.kind !== "composio_tool") {
24:     throw new Error(`${tool.name} is not a Composio-backed tool.`);
25:   }
26: 
27:   return tool.execution;
28: }
29: 
30: export async function executeComposioTool(
31:   tool: IntegrationTool,
32:   args: Record<string, unknown>,
33:   context: ExecuteComposioToolContext,
34: ): Promise<ExecuteComposioToolResult> {
35:   const execution = ensureComposioExecution(tool);
36:   const connectedAccountId = safeTrim(context.credentials.composioConnectedAccountId);
37: 
38:   if (!connectedAccountId) {
39:     throw new IntegrationRequestError(
40:       "This connection is missing a Composio connected account binding. Reconnect it and try again.",
41:       { status: 401, code: "missing_composio_connected_account" },
42:     );
43:   }
44: 
45:   return executeComposioToolRequest({
46:     env: context.env,
47:     toolSlug: execution.toolSlug,
48:     toolkit: execution.toolkit,
49:     version: execution.version,
50:     userId: context.externalUserId,
51:     connectedAccountId,
52:     arguments: args,
53:   });
54: }

(End of file - total 54 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/backend-client.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/composio/backend-client.ts</path>
<type>file</type>
<content>
1: import { IntegrationRequestError } from "../../../worker/integrations/base";
2: 
3: const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";
4: const DEFAULT_INSTANTLY_TOOLKIT_VERSION = "20260429_00";
5: 
6: export interface ComposioConfig {
7:   apiKey: string;
8:   baseUrl: string;
9:   toolkit: string;
10:   authConfigId: string;
11:   toolkitVersion?: string;
12: }
13: 
14: export interface CreateComposioConnectLinkParams {
15:   env?: Record<string, unknown>;
16:   integrationSlug: string;
17:   userId: string;
18:   callbackUrl: string;
19:   alias?: string | null;
20: }
21: 
22: export interface ComposioConnectLink {
23:   linkToken: string | null;
24:   redirectUrl: string;
25:   expiresAt: string | null;
26:   connectedAccountId: string;
27: }
28: 
29: export interface ComposioConnectedAccountMetadata {
30:   connectedAccountId: string;
31:   authConfigId: string;
32:   toolkit: string;
33:   connectionLabel: string | null;
34:   accountLabel: string | null;
35:   externalAccountId: string;
36: }
37: 
38: export interface ComposioConnectedAccountDetails extends ComposioConnectedAccountMetadata {
39:   status: string | null;
40:   statusReason: string | null;
41: }
42: 
43: interface ComposioConnectedAccountResponse {
44:   id?: unknown;
45:   nanoid?: unknown;
46:   word_id?: unknown;
47:   alias?: unknown;
48:   user_id?: unknown;
49:   status?: unknown;
50:   status_reason?: unknown;
51:   toolkit?: {
52:     slug?: unknown;
53:   };
54:   auth_config?: {
55:     id?: unknown;
56:   };
57:   state?: {
58:     val?: Record<string, unknown>;
59:   };
60:   data?: Record<string, unknown>;
61:   params?: Record<string, unknown>;
62: }
63: 
64: export interface ExecuteComposioToolParams {
65:   env?: Record<string, unknown>;
66:   toolSlug: string;
67:   toolkit: string;
68:   version?: string;
69:   userId: string;
70:   connectedAccountId: string;
71:   arguments: Record<string, unknown>;
72: }
73: 
74: export interface ExecuteComposioToolResult {
75:   data: unknown;
76:   providerRequestId?: string;
77: }
78: 
79: function safeTrim(value: unknown): string | null {
80:   return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
81: }
82: 
83: function sleep(ms: number): Promise<void> {
84:   return new Promise((resolve) => setTimeout(resolve, ms));
85: }
86: 
87: function humanizeSlug(slug: string): string {
88:   return slug
89:     .split(/[-_]+/)
90:     .filter(Boolean)
91:     .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
92:     .join(" ");
93: }
94: 
95: function readNestedAccountString(
96:   account: ComposioConnectedAccountResponse,
97:   key: string,
98: ): string | null {
99:   return (
100:     safeTrim(account.data?.[key]) ??
101:     safeTrim(account.params?.[key]) ??
102:     safeTrim(account.state?.val?.[key]) ??
103:     null
104:   );
105: }
106: 
107: function normalizeBaseUrl(value: unknown): string {
108:   return (safeTrim(value) ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
109: }
110: 
111: function parseMap(value: unknown): Map<string, string> {
112:   const map = new Map<string, string>();
113:   const raw = safeTrim(value);
114: 
115:   if (!raw) {
116:     return map;
117:   }
118: 
119:   for (const pair of raw.split(",")) {
120:     const [key, ...rest] = pair.split("=");
121:     const normalizedKey = key?.trim();
122:     const normalizedValue = rest.join("=").trim();
123: 
124:     if (normalizedKey && normalizedValue) {
125:       map.set(normalizedKey, normalizedValue);
126:     }
127:   }
128: 
129:   return map;
130: }
131: 
132: function getEnvValue(env: Record<string, unknown> | undefined, key: string): string | null {
133:   return safeTrim(env?.[key]) ?? safeTrim(process.env[key]);
134: }
135: 
136: function getSlugEnvKey(prefix: string, slug: string, suffix: string): string {
137:   return `${prefix}_${slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}_${suffix}`;
138: }
139: 
140: export function getComposioConfig(
141:   env: Record<string, unknown> | undefined,
142:   integrationSlug: string,
143: ): ComposioConfig {
144:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
145: 
146:   if (!apiKey) {
147:     throw new Error("COMPOSIO_API_KEY is not configured.");
148:   }
149: 
150:   const toolkitMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_MAP"));
151:   const authConfigMap = parseMap(getEnvValue(env, "COMPOSIO_AUTH_CONFIG_MAP"));
152:   const versionMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_VERSION_MAP"));
153:   const authConfigId =
154:     authConfigMap.get(integrationSlug) ??
155:     getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "AUTH_CONFIG_ID"));
156:   const toolkit =
157:     toolkitMap.get(integrationSlug) ??
158:     getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT")) ??
159:     integrationSlug.replace(/-/g, "_");
160: 
161:   if (!authConfigId) {
162:     throw new Error(`Composio auth config is not configured for ${integrationSlug}.`);
163:   }
164: 
165:   return {
166:     apiKey,
167:     baseUrl: normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL")),
168:     toolkit,
169:     authConfigId,
170:     toolkitVersion:
171:       versionMap.get(integrationSlug) ??
172:       getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT_VERSION")) ??
173:       (integrationSlug === "instantly" ? DEFAULT_INSTANTLY_TOOLKIT_VERSION : undefined),
174:   };
175: }
176: 
177: function stringifyComposioError(payload: unknown, fallback: string): string {
178:   if (!payload || typeof payload !== "object") {
179:     return fallback;
180:   }
181: 
182:   const error = (payload as { error?: unknown }).error;
183: 
184:   if (error && typeof error === "object") {
185:     const message = (error as { message?: unknown }).message;
186:     const suggestedFix = (error as { suggested_fix?: unknown }).suggested_fix;
187: 
188:     if (typeof message === "string" && message.trim()) {
189:       return typeof suggestedFix === "string" && suggestedFix.trim()
190:         ? `${message.trim()} ${suggestedFix.trim()}`
191:         : message.trim();
192:     }
193:   }
194: 
195:   const message = (payload as { message?: unknown }).message;
196:   if (typeof message === "string" && message.trim()) {
197:     return message.trim();
198:   }
199: 
200:   try {
201:     return JSON.stringify(payload);
202:   } catch {
203:     return fallback;
204:   }
205: }
206: 
207: async function composioFetch<T>(
208:   config: Pick<ComposioConfig, "apiKey" | "baseUrl">,
209:   path: string,
210:   init: RequestInit,
211: ): Promise<{ data: T; headers: Headers }> {
212:   const response = await fetch(`${config.baseUrl}${path}`, {
213:     ...init,
214:     headers: {
215:       Accept: "application/json",
216:       "Content-Type": "application/json",
217:       "x-api-key": config.apiKey,
218:       ...init.headers,
219:     },
220:   });
221:   const payload = (await response.json().catch(() => null)) as T;
222: 
223:   if (!response.ok) {
224:     throw new IntegrationRequestError(
225:       stringifyComposioError(payload, `${response.status} ${response.statusText}`),
226:       {
227:         status: response.status,
228:       },
229:     );
230:   }
231: 
232:   return { data: payload, headers: response.headers };
233: }
234: 
235: export async function createComposioConnectLink(
236:   params: CreateComposioConnectLinkParams,
237: ): Promise<ComposioConnectLink> {
238:   const config = getComposioConfig(params.env, params.integrationSlug);
239:   const response = await composioFetch<{
240:     link_token?: unknown;
241:     linkToken?: unknown;
242:     redirect_url?: unknown;
243:     redirectUrl?: unknown;
244:     expires_at?: unknown;
245:     expiresAt?: unknown;
246:     connected_account_id?: unknown;
247:     connectedAccountId?: unknown;
248:   }>(config, "/connected_accounts/link", {
249:     method: "POST",
250:     body: JSON.stringify({
251:       auth_config_id: config.authConfigId,
252:       user_id: params.userId,
253:       alias: params.alias ?? undefined,
254:       callback_url: params.callbackUrl,
255:     }),
256:   });
257: 
258:   const redirectUrl =
259:     safeTrim(response.data.redirect_url) ?? safeTrim(response.data.redirectUrl);
260:   const connectedAccountId =
261:     safeTrim(response.data.connected_account_id) ??
262:     safeTrim(response.data.connectedAccountId);
263: 
264:   if (!redirectUrl) {
265:     throw new Error("Composio did not return a setup URL.");
266:   }
267: 
268:   if (!connectedAccountId) {
269:     throw new Error("Composio did not return a connected account id.");
270:   }
271: 
272:   return {
273:     linkToken: safeTrim(response.data.link_token) ?? safeTrim(response.data.linkToken),
274:     redirectUrl,
275:     expiresAt: safeTrim(response.data.expires_at) ?? safeTrim(response.data.expiresAt),
276:     connectedAccountId,
277:   };
278: }
279: 
280: export async function getComposioConnectedAccountDetails(params: {
281:   env?: Record<string, unknown>;
282:   integrationSlug: string;
283:   connectedAccountId: string;
284:   expectedUserId?: string | null;
285: }): Promise<ComposioConnectedAccountDetails> {
286:   const config = getComposioConfig(params.env, params.integrationSlug);
287:   const response = await composioFetch<ComposioConnectedAccountResponse>(
288:     config,
289:     `/connected_accounts/${encodeURIComponent(params.connectedAccountId)}`,
290:     { method: "GET" },
291:   );
292:   const connectedAccountId =
293:     safeTrim(response.data.id) ??
294:     safeTrim(response.data.nanoid) ??
295:     params.connectedAccountId;
296:   const userId = safeTrim(response.data.user_id);
297: 
298:   if (params.expectedUserId && userId && userId !== params.expectedUserId) {
299:     throw new Error("Composio returned a connected account for a different user.");
300:   }
301: 
302:   const authConfigId = safeTrim(response.data.auth_config?.id) ?? config.authConfigId;
303:   const toolkit = safeTrim(response.data.toolkit?.slug) ?? config.toolkit;
304:   const fallbackLabel = `${humanizeSlug(params.integrationSlug)} account`;
305:   const accountLabel =
306:     readNestedAccountString(response.data, "account_label") ??
307:     readNestedAccountString(response.data, "workspace_name") ??
308:     readNestedAccountString(response.data, "account_name") ??
309:     readNestedAccountString(response.data, "email") ??
310:     fallbackLabel;
311:   const externalAccountId =
312:     readNestedAccountString(response.data, "external_account_id") ??
313:     readNestedAccountString(response.data, "account_id") ??
314:     connectedAccountId;
315: 
316:   return {
317:     connectedAccountId,
318:     authConfigId,
319:     toolkit,
320:     connectionLabel: accountLabel,
321:     accountLabel,
322:     externalAccountId,
323:     status: safeTrim(response.data.status),
324:     statusReason: safeTrim(response.data.status_reason),
325:   };
326: }
327: 
328: export async function waitForComposioConnectedAccountActive(params: {
329:   env?: Record<string, unknown>;
330:   integrationSlug: string;
331:   connectedAccountId: string;
332:   expectedUserId?: string | null;
333:   timeoutMs?: number;
334:   intervalMs?: number;
335: }): Promise<ComposioConnectedAccountMetadata> {
336:   const timeoutMs = params.timeoutMs ?? 10_000;
337:   const intervalMs = params.intervalMs ?? 750;
338:   const deadline = Date.now() + timeoutMs;
339:   let latest: ComposioConnectedAccountDetails | null = null;
340: 
341:   do {
342:     latest = await getComposioConnectedAccountDetails(params);
343:     const normalizedStatus = latest.status?.toUpperCase() ?? null;
344: 
345:     if (!normalizedStatus || normalizedStatus === "ACTIVE") {
346:       return latest;
347:     }
348: 
349:     if (
350:       normalizedStatus === "FAILED" ||
351:       normalizedStatus === "EXPIRED" ||
352:       normalizedStatus === "INACTIVE"
353:     ) {
354:       throw new Error(
355:         latest.statusReason ??
356:           `Composio connection is ${normalizedStatus.toLowerCase()}.`,
357:       );
358:     }
359: 
360:     await sleep(intervalMs);
361:   } while (Date.now() < deadline);
362: 
363:   throw new Error(
364:     latest?.status
365:       ? `Composio connection is still ${latest.status.toLowerCase()}.`
366:       : "Composio connection is not ready yet.",
367:   );
368: }
369: 
370: export async function deleteComposioConnectedAccount(
371:   connectedAccountId: string,
372:   env?: Record<string, unknown>,
373: ): Promise<void> {
374:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
375:   const baseUrl = normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL"));
376: 
377:   if (!apiKey) {
378:     return;
379:   }
380: 
381:   await composioFetch<unknown>(
382:     { apiKey, baseUrl },
383:     `/connected_accounts/${encodeURIComponent(connectedAccountId)}`,
384:     { method: "DELETE" },
385:   );
386: }
387: 
388: export async function executeComposioToolRequest(
389:   params: ExecuteComposioToolParams,
390: ): Promise<ExecuteComposioToolResult> {
391:   const config = getComposioConfig(params.env, params.toolkit.replace(/_/g, "-"));
392:   const response = await composioFetch<{
393:     data?: unknown;
394:     error?: unknown;
395:     successful?: boolean;
396:     log_id?: string;
397:   }>(
398:     config,
399:     `/tools/execute/${encodeURIComponent(params.toolSlug)}`,
400:     {
401:       method: "POST",
402:       body: JSON.stringify({
403:         connected_account_id: params.connectedAccountId,
404:         user_id: params.userId,
405:         version: params.version ?? config.toolkitVersion,
406:         arguments: params.arguments,
407:       }),
408:     },
409:   );
410: 
411:   if (response.data.successful === false) {
412:     throw new IntegrationRequestError(
413:       stringifyComposioError(response.data.error, `${params.toolSlug} failed in Composio.`),
414:       {
415:         status: 502,
416:       },
417:     );
418:   }
419: 
420:   return {
421:     data: response.data.data ?? response.data,
422:     providerRequestId:
423:       safeTrim(response.data.log_id) ??
424:       safeTrim(response.headers.get("x-request-id")) ??
425:       undefined,
426:   };
427: }

(End of file - total 427 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.5s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/integrations/base.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/integrations/base.ts</path>
<type>file</type>
<content>
1: /**
2:  * Base integration handler
3:  * 
4:  * All integration handlers implement this interface
5:  */
6: 
7: import {
8:   inferToolRisk,
9:   type NormalizedToolError,
10:   type ToolMode,
11:   type ToolRisk,
12: } from "../../src/lib/runtime/tool-runtime";
13: import type { ToolExecutionSpec } from "../../src/lib/pipedream/manifest-types";
14: 
15: export type ToolAccessLevel = ToolMode;
16: 
17: export interface IntegrationToolExample {
18:   user: string;
19:   args: Record<string, unknown>;
20: }
21: 
22: export interface IntegrationTool {
23:   integration: string;
24:   name: string;
25:   description: string;
26:   inputSchema: Record<string, unknown>;
27:   outputSchema?: Record<string, unknown>;
28:   accessLevel: ToolAccessLevel;
29:   mode: ToolMode;
30:   risk: ToolRisk;
31:   tags: string[];
32:   whenToUse: string[];
33:   askBefore: string[];
34:   safeDefaults: Record<string, unknown>;
35:   examples: IntegrationToolExample[];
36:   followups: string[];
37:   requiresScopes: string[];
38:   idempotent: boolean;
39:   supportsDryRun: boolean;
40:   supportsBatch: boolean;
41:   maxBatchSize?: number;
42:   recommendedTimeoutMs?: number;
43:   execution: ToolExecutionSpec;
44: }
45: 
46: export interface DefineIntegrationToolOptions {
47:   description: string;
48:   inputSchema: Record<string, unknown>;
49:   outputSchema?: Record<string, unknown>;
50:   accessLevel: ToolAccessLevel;
51:   risk?: ToolRisk;
52:   tags?: string[];
53:   whenToUse?: string[];
54:   askBefore?: string[];
55:   safeDefaults?: Record<string, unknown>;
56:   examples?: IntegrationToolExample[];
57:   followups?: string[];
58:   requiresScopes?: string[];
59:   idempotent?: boolean;
60:   supportsDryRun?: boolean;
61:   supportsBatch?: boolean;
62:   maxBatchSize?: number;
63:   recommendedTimeoutMs?: number;
64: }
65: 
66: export function defineTool(
67:   integration: string,
68:   action: string,
69:   options: DefineIntegrationToolOptions,
70: ): IntegrationTool {
71:   return {
72:     integration,
73:     name: `${integration}_${action}`,
74:     description: options.description,
75:     inputSchema: options.inputSchema,
76:     outputSchema: options.outputSchema,
77:     accessLevel: options.accessLevel,
78:     mode: options.accessLevel,
79:     risk: options.risk ?? inferToolRisk(options.accessLevel),
80:     tags: options.tags ?? [],
81:     whenToUse: options.whenToUse ?? [],
82:     askBefore: options.askBefore ?? [],
83:     safeDefaults: options.safeDefaults ?? {},
84:     examples: options.examples ?? [],
85:     followups: options.followups ?? [],
86:     requiresScopes: options.requiresScopes ?? [],
87:     idempotent: options.idempotent ?? options.accessLevel === "read",
88:     supportsDryRun: options.supportsDryRun ?? false,
89:     supportsBatch: options.supportsBatch ?? false,
90:     maxBatchSize: options.maxBatchSize,
91:     recommendedTimeoutMs: options.recommendedTimeoutMs,
92:     execution: { kind: "custom" },
93:   };
94: }
95: 
96: export interface IntegrationHandler {
97:   /**
98:    * Get list of tools this integration provides
99:    */
100:   getTools(integrationSlug: string): IntegrationTool[];
101: 
102:   /**
103:    * Execute an action
104:    */
105:   execute(
106:     action: string,
107:     args: Record<string, unknown>,
108:     credentials: Record<string, string>,
109:     context?: {
110:       requestId: string;
111:       dryRun?: boolean;
112:       timeoutMs?: number;
113:       connectionId?: number;
114:       userId?: string;
115:       env?: Record<string, unknown>;
116:     },
117:   ): Promise<unknown>;
118: 
119:   /**
120:    * Validate credentials for this integration
121:    */
122:   validateCredentials?(credentials: Record<string, string>): Promise<boolean>;
123: 
124:   checkHealth?(
125:     credentials: Record<string, string>,
126:   ): Promise<{
127:     ok: boolean;
128:     scopes?: string[];
129:     account?: { id?: string; label?: string };
130:     expiresAt?: string | null;
131:   }>;
132: 
133: }
134: 
135: export class IntegrationRequestError extends Error {
136:   readonly status: number;
137:   readonly code?: string;
138: 
139:   constructor(message: string, options: { status: number; code?: string }) {
140:     super(message);
141:     this.name = "IntegrationRequestError";
142:     this.status = options.status;
143:     this.code = options.code;
144:   }
145: }
146: 
147: export function isAuthenticationFailure(error: unknown): boolean {
148:   if (error instanceof IntegrationRequestError) {
149:     return error.status === 401;
150:   }
151: 
152:   if (!(error instanceof Error)) {
153:     return false;
154:   }
155: 
156:   return /\b401\b|unauthorized|invalid[_\s-]?token|token expired|invalid[_\s-]?auth/i.test(
157:     error.message,
158:   );
159: }
160: 
161: function isMissingScopeFailure(error: unknown): boolean {
162:   if (error instanceof IntegrationRequestError) {
163:     return error.status === 403 && /\bscope|permission|forbidden|insufficient/i.test(error.message);
164:   }
165: 
166:   if (!(error instanceof Error)) {
167:     return false;
168:   }
169: 
170:   return /\binsufficient[_\s-]?scope|missing[_\s-]?scope|permission denied|forbidden\b/i.test(
171:     error.message,
172:   );
173: }
174: 
175: function isRateLimitFailure(error: unknown): boolean {
176:   if (error instanceof IntegrationRequestError) {
177:     return error.status === 429;
178:   }
179: 
180:   if (!(error instanceof Error)) {
181:     return false;
182:   }
183: 
184:   return /\b429\b|rate limit|too many requests/i.test(error.message);
185: }
186: 
187: function isNetworkFailure(error: unknown): boolean {
188:   if (!(error instanceof Error)) {
189:     return false;
190:   }
191: 
192:   return /\b(fetch failed|network|timed out|timeout|socket hang up|econnreset|etimedout|enotfound)\b/i.test(
193:     error.message,
194:   );
195: }
196: 
197: export function classifyIntegrationError(error: unknown): NormalizedToolError {
198:   if (error instanceof IntegrationRequestError) {
199:     if (error.status === 401) {
200:       return {
201:         type: "reauth_required",
202:         code: error.code,
203:         message: error.message,
204:         retryable: false,
205:       };
206:     }
207: 
208:     if (error.status === 429) {
209:       return {
210:         type: "rate_limit",
211:         code: error.code,
212:         message: error.message,
213:         retryable: true,
214:       };
215:     }
216: 
217:     if (error.status === 403 && isMissingScopeFailure(error)) {
218:       return {
219:         type: "missing_scopes",
220:         code: error.code,
221:         message: error.message,
222:         retryable: false,
223:       };
224:     }
225: 
226:     return {
227:       type: "provider",
228:       code: error.code,
229:       message: error.message,
230:       retryable: error.status >= 500,
231:     };
232:   }
233: 
234:   if (isAuthenticationFailure(error)) {
235:     return {
236:       type: "reauth_required",
237:       message: error instanceof Error ? error.message : "Authentication failed",
238:       retryable: false,
239:     };
240:   }
241: 
242:   if (isMissingScopeFailure(error)) {
243:     return {
244:       type: "missing_scopes",
245:       message: error instanceof Error ? error.message : "Missing required scopes",
246:       retryable: false,
247:     };
248:   }
249: 
250:   if (isRateLimitFailure(error)) {
251:     return {
252:       type: "rate_limit",
253:       message: error instanceof Error ? error.message : "Provider rate limit reached",
254:       retryable: true,
255:     };
256:   }
257: 
258:   if (isNetworkFailure(error)) {
259:     return {
260:       type: "network",
261:       message: error instanceof Error ? error.message : "Network request failed",
262:       retryable: true,
263:     };
264:   }
265: 
266:   return {
267:     type: "unknown",
268:     message: error instanceof Error ? error.message : "Unknown tool execution error",
269:     retryable: false,
270:   };
271: }
272: 
273: /**
274:  * Base class with common functionality
275:  */
276: export abstract class BaseIntegration implements IntegrationHandler {
277:   abstract getTools(integrationSlug: string): IntegrationTool[];
278:   abstract execute(
279:     action: string,
280:     args: Record<string, unknown>,
281:     credentials: Record<string, string>,
282:     context?: {
283:       requestId: string;
284:       dryRun?: boolean;
285:       timeoutMs?: number;
286:       connectionId?: number;
287:       userId?: string;
288:     },
289:   ): Promise<unknown>;
290: 
291:   private buildRequestHeaders(
292:     baseHeaders: RequestInit["headers"],
293:     integrationHeaders: Record<string, string>,
294:   ): Headers {
295:     const headers = new Headers(baseHeaders);
296: 
297:     for (const [key, value] of Object.entries(integrationHeaders)) {
298:       headers.set(key, value);
299:     }
300: 
301:     return headers;
302:   }
303: 
304:   /**
305:    * Make an API request with retry logic
306:    */
307:   protected async apiRequest(
308:     url: string,
309:     options: RequestInit,
310:     credentials: Record<string, string>,
311:     retries = 3
312:   ): Promise<Response> {
313:     let lastError: Error | null = null;
314: 
315:     for (let i = 0; i < retries; i++) {
316:       try {
317:         const response = await fetch(url, {
318:           ...options,
319:           headers: this.buildRequestHeaders(
320:             options.headers,
321:             this.getHeaders(credentials),
322:           ),
323:         });
324: 
325:         // Don't retry on client errors (4xx)
326:         if (response.status >= 400 && response.status < 500) {
327:           return response;
328:         }
329: 
330:         // Retry on server errors (5xx) or rate limits (429)
331:         if (response.status >= 500 || response.status === 429) {
332:           const delay = Math.pow(2, i) * 1000; // Exponential backoff
333:           await new Promise(resolve => setTimeout(resolve, delay));
334:           lastError = new Error(`Server error: ${response.status}`);
335:           continue;
336:         }
337: 
338:         return response;
339:       } catch (error) {
340:         lastError = error instanceof Error ? error : new Error(String(error));
341:         
342:         if (i < retries - 1) {
343:           const delay = Math.pow(2, i) * 1000;
344:           await new Promise(resolve => setTimeout(resolve, delay));
345:         }
346:       }
347:     }
348: 
349:     throw lastError || new Error("Request failed after retries");
350:   }
351: 
352:   /**
353:    * Get headers for API requests (override per integration)
354:    */
355:   protected getHeaders(credentials: Record<string, string>): Record<string, string> {
356:     void credentials;
357: 
358:     return {
359:       "Content-Type": "application/json",
360:     };
361:   }
362: 
363:   /**
364:    * Build query string from params
365:    */
366:   protected buildQueryString(params: Record<string, unknown>): string {
367:     const searchParams = new URLSearchParams();
368:     for (const [key, value] of Object.entries(params)) {
369:       if (value !== undefined && value !== null) {
370:         searchParams.append(key, String(value));
371:       }
372:     }
373:     return searchParams.toString();
374:   }
375: }
376: 
377: /**
378:  * Registry of all integration handlers
379:  */
380: const handlers = new Map<string, IntegrationHandler>();
381: 
382: export function registerHandler(slug: string, handler: IntegrationHandler): void {
383:   handlers.set(slug, handler);
384: }
385: 
386: export function getIntegrationHandler(slug: string): IntegrationHandler | undefined {
387:   return handlers.get(slug);
388: }
389: 
390: export function getAllHandlers(): Map<string, IntegrationHandler> {
391:   return handlers;
392: }

(End of file - total 392 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/integrations/index.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/integrations/index.ts</path>
<type>file</type>
<content>
1: /**
2:  * Integration tool registry index
3:  *
4:  * Import custom handler exceptions here and merge them with generated manifests.
5:  */
6: 
7: // Postiz is the only remaining custom handler. New integrations use generated
8: // Pipedream manifests instead of per-provider handler modules.
9: import "./postiz";
10: 
11: import {
12:   getAllPipedreamManifestTools,
13:   getPipedreamManifestToolByName,
14:   listPipedreamManifestToolsForIntegration,
15: } from "../../src/lib/pipedream/manifest-registry";
16: import {
17:   getAllComposioManifestTools,
18:   getComposioManifestToolByName,
19:   listComposioManifestToolsForIntegration,
20: } from "../../src/lib/composio/manifest-registry";
21: import { getAllHandlers, getIntegrationHandler } from "./base";
22: import type { IntegrationTool } from "./base";
23: 
24: const disabledPipedreamManifestIntegrations = new Set(["instantly", "outlook", "apollo", "postiz", "gmail", "google-search-console", "google-docs", "google-analytics", "onedrive", "google-ads", "hubspot", "google-calendar", "klaviyo", "airtable", "calendly", "clickup", "mailchimp", "notion", "salesforce", "xero", "twilio", "facebook", "linkedin", "youtube", "shopify", "sendgrid", "resend", "instagram"]);
25: 
26: export {
27:   classifyIntegrationError,
28:   defineTool,
29:   getIntegrationHandler,
30:   getAllHandlers,
31:   isAuthenticationFailure,
32:   registerHandler,
33: } from "./base";
34: export type {
35:   IntegrationHandler,
36:   IntegrationTool,
37:   IntegrationToolExample,
38:   ToolAccessLevel,
39: } from "./base";
40: 
41: function sortTools(tools: IntegrationTool[]): IntegrationTool[] {
42:   return [...tools].sort((left, right) => left.name.localeCompare(right.name));
43: }
44: 
45: function mergeTools(
46:   primary: IntegrationTool[],
47:   secondary: IntegrationTool[],
48: ): IntegrationTool[] {
49:   const merged = new Map<string, IntegrationTool>();
50: 
51:   for (const tool of primary) {
52:     merged.set(tool.name, tool);
53:   }
54: 
55:   for (const tool of secondary) {
56:     if (!merged.has(tool.name)) {
57:       merged.set(tool.name, tool);
58:     }
59:   }
60: 
61:   return sortTools(Array.from(merged.values()));
62: }
63: 
64: function filterEnabledPipedreamTools(tools: IntegrationTool[]): IntegrationTool[] {
65:   return tools.filter((tool) => !disabledPipedreamManifestIntegrations.has(tool.integration));
66: }
67: 
68: export function listHandlerToolsForIntegration(integration: string): IntegrationTool[] {
69:   const handler = getIntegrationHandler(integration);
70: 
71:   if (!handler?.getTools) {
72:     return [];
73:   }
74: 
75:   return sortTools(handler.getTools(integration));
76: }
77: 
78: export function listManifestToolsForIntegration(integration: string): IntegrationTool[] {
79:   return mergeTools(
80:     listPipedreamToolsForIntegration(integration),
81:     listComposioManifestToolsForIntegration(integration),
82:   );
83: }
84: 
85: export function listPipedreamToolsForIntegration(integration: string): IntegrationTool[] {
86:   if (disabledPipedreamManifestIntegrations.has(integration)) {
87:     return [];
88:   }
89: 
90:   return sortTools(listPipedreamManifestToolsForIntegration(integration));
91: }
92: 
93: export function listComposioToolsForIntegration(integration: string): IntegrationTool[] {
94:   return sortTools(listComposioManifestToolsForIntegration(integration));
95: }
96: 
97: export function listRegisteredToolsForIntegration(integration: string): IntegrationTool[] {
98:   return mergeTools(
99:     listHandlerToolsForIntegration(integration),
100:     listManifestToolsForIntegration(integration),
101:   );
102: }
103: 
104: export function getAllRegisteredTools(): IntegrationTool[] {
105:   const handlerTools: IntegrationTool[] = [];
106: 
107:   for (const [integration, handler] of getAllHandlers().entries()) {
108:     if (!handler?.getTools) {
109:       continue;
110:     }
111: 
112:     handlerTools.push(...handler.getTools(integration));
113:   }
114: 
115:   return mergeTools(
116:     mergeTools(handlerTools, filterEnabledPipedreamTools(getAllPipedreamManifestTools())),
117:     getAllComposioManifestTools(),
118:   );
119: }
120: 
121: export function getRegisteredToolByName(toolName: string): IntegrationTool | undefined {
122:   const [integration] = toolName.split("_");
123: 
124:   if (integration) {
125:     const scoped = listRegisteredToolsForIntegration(integration).find(
126:       (tool) => tool.name === toolName,
127:     );
128: 
129:     if (scoped) {
130:       return scoped;
131:     }
132:   }
133: 
134:   const pipedreamTool = getPipedreamManifestToolByName(toolName);
135: 
136:   if (pipedreamTool && !disabledPipedreamManifestIntegrations.has(pipedreamTool.integration)) {
137:     return pipedreamTool;
138:   }
139: 
140:   return getComposioManifestToolByName(toolName) ?? undefined;
141: }

(End of file - total 141 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/server/tool-registry.ts</path>
<type>file</type>
<content>
1: import "server-only";
2: 
3: import { getIntegrationBySlug } from "@/data/integrations";
4: import {
5:   getDatabase,
6:   listIntegrationConnectionsForUserId,
7:   type IntegrationConnectionRecord,
8: } from "@/lib/server/integration-store";
9: import {
10:   getAllRegisteredTools,
11:   listComposioToolsForIntegration,
12:   listHandlerToolsForIntegration,
13:   listPipedreamToolsForIntegration,
14:   type IntegrationTool,
15:   type IntegrationToolExample,
16:   type ToolAccessLevel,
17: } from "../../../worker/integrations";
18: import { summarizeToolPolicy } from "@/lib/server/policy";
19: import type { ToolMode, ToolRisk } from "@/lib/runtime/tool-runtime";
20: 
21: export interface ToolConnectionSummary {
22:   id: number;
23:   connectionLabel: string | null;
24:   accountLabel: string | null;
25:   isDefault: boolean;
26:   authState: IntegrationConnectionRecord["authState"];
27:   authError: string | null;
28:   expiresAt: string | null;
29:   lastUsedAt: string | null;
30:   lastSuccessAt: string | null;
31:   lastErrorAt: string | null;
32:   lastErrorCode: string | null;
33:   lastErrorMessage: string | null;
34:   scopeSnapshot: string[] | null;
35:   capabilities: string[] | null;
36: }
37: 
38: export interface ToolCatalogItem {
39:   integration: string;
40:   integrationName: string;
41:   name: string;
42:   description: string;
43:   inputSchema: Record<string, unknown>;
44:   outputSchema?: Record<string, unknown>;
45:   accessLevel: ToolAccessLevel;
46:   mode: ToolMode;
47:   risk: ToolRisk;
48:   tags: string[];
49:   guidanceAvailable: boolean;
50:   requiresConfirmation: boolean;
51:   policyReason?: string;
52:   previewAvailable: boolean;
53:   defaultConnectionId: number | null;
54:   connectionCount: number;
55:   connections: ToolConnectionSummary[];
56:   requiresScopes: string[];
57:   idempotent: boolean;
58:   supportsDryRun: boolean;
59:   supportsBatch: boolean;
60:   maxBatchSize?: number;
61:   recommendedTimeoutMs?: number;
62: }
63: 
64: export interface ToolDescription extends ToolCatalogItem {
65:   whenToUse: string[];
66:   askBefore: string[];
67:   safeDefaults: Record<string, unknown>;
68:   examples: IntegrationToolExample[];
69:   followups: string[];
70: }
71: 
72: export interface ToolRegistryEntry {
73:   tool: IntegrationTool;
74:   connections: IntegrationConnectionRecord[];
75: }
76: 
77: export function mapConnectionSummary(connection: IntegrationConnectionRecord): ToolConnectionSummary {
78:   return {
79:     id: connection.id,
80:     connectionLabel: connection.connectionLabel,
81:     accountLabel: connection.accountLabel,
82:     isDefault: connection.isDefault,
83:     authState: connection.authState,
84:     authError: connection.authError,
85:     expiresAt: connection.expiresAt,
86:     lastUsedAt: connection.lastUsedAt,
87:     lastSuccessAt: connection.lastSuccessAt,
88:     lastErrorAt: connection.lastErrorAt,
89:     lastErrorCode: connection.lastErrorCode,
90:     lastErrorMessage: connection.lastErrorMessage,
91:     scopeSnapshot: connection.scopeSnapshot,
92:     capabilities: connection.capabilities,
93:   };
94: }
95: 
96: function hasGuidance(tool: IntegrationTool): boolean {
97:   return (
98:     tool.whenToUse.length > 0 ||
99:     tool.askBefore.length > 0 ||
100:     tool.examples.length > 0 ||
101:     tool.followups.length > 0 ||
102:     Object.keys(tool.safeDefaults).length > 0
103:   );
104: }
105: 
106: function isPipedreamBackedConnection(connection: IntegrationConnectionRecord): boolean {
107:   return connection.authBackend === "pipedream" && Boolean(connection.pipedreamAccountId);
108: }
109: 
110: function isComposioBackedConnection(connection: IntegrationConnectionRecord): boolean {
111:   return connection.authBackend === "composio" && Boolean(connection.composioConnectedAccountId);
112: }
113: 
114: export function buildCatalogItem(
115:   tool: IntegrationTool,
116:   connections: IntegrationConnectionRecord[],
117: ): ToolCatalogItem {
118:   const integrationMeta = getIntegrationBySlug(tool.integration);
119:   const policy = summarizeToolPolicy(tool);
120: 
121:   return {
122:     integration: tool.integration,
123:     integrationName: integrationMeta?.name ?? tool.integration,
124:     name: tool.name,
125:     description: tool.description,
126:     inputSchema: tool.inputSchema,
127:     outputSchema: tool.outputSchema,
128:     accessLevel: tool.accessLevel,
129:     mode: tool.mode,
130:     risk: tool.risk,
131:     tags: tool.tags,
132:     guidanceAvailable: hasGuidance(tool),
133:     requiresConfirmation: policy.requiresConfirmation,
134:     policyReason: policy.reason,
135:     previewAvailable: policy.previewAvailable,
136:     defaultConnectionId: connections.find((connection) => connection.isDefault)?.id ?? null,
137:     connectionCount: connections.length,
138:     connections: connections.map(mapConnectionSummary),
139:     requiresScopes: tool.requiresScopes,
140:     idempotent: tool.idempotent,
141:     supportsDryRun: tool.supportsDryRun,
142:     supportsBatch: tool.supportsBatch,
143:     maxBatchSize: tool.maxBatchSize,
144:     recommendedTimeoutMs: tool.recommendedTimeoutMs,
145:   };
146: }
147: 
148: export function buildToolDescription(
149:   tool: IntegrationTool,
150:   connections: IntegrationConnectionRecord[],
151: ): ToolDescription {
152:   return {
153:     ...buildCatalogItem(tool, connections),
154:     whenToUse: tool.whenToUse,
155:     askBefore: tool.askBefore,
156:     safeDefaults: tool.safeDefaults,
157:     examples: tool.examples,
158:     followups: tool.followups,
159:   };
160: }
161: 
162: function normalizeSearchText(value: string): string {
163:   return value.trim().toLowerCase();
164: }
165: 
166: function getAllRegisteredToolEntries(): ToolRegistryEntry[] {
167:   return getAllRegisteredTools()
168:     .map((tool) => ({ tool, connections: [] }))
169:     .sort((left, right) => left.tool.name.localeCompare(right.tool.name));
170: }
171: 
172: function scoreTool(tool: IntegrationTool, query: string, integration?: string): number {
173:   const normalizedQuery = normalizeSearchText(query);
174: 
175:   if (!normalizedQuery) {
176:     return 0;
177:   }
178: 
179:   const searchable = [
180:     tool.name,
181:     tool.integration,
182:     tool.description,
183:     ...tool.tags,
184:     ...tool.whenToUse,
185:   ]
186:     .join(" ")
187:     .toLowerCase();
188: 
189:   let score = 0;
190: 
191:   if (tool.name.toLowerCase() === normalizedQuery) {
192:     score += 100;
193:   } else if (tool.name.toLowerCase().includes(normalizedQuery)) {
194:     score += 60;
195:   }
196: 
197:   if (searchable.includes(normalizedQuery)) {
198:     score += 20;
199:   }
200: 
201:   if (integration && tool.integration === integration) {
202:     score += 15;
203:   }
204: 
205:   for (const token of normalizedQuery.split(/\s+/)) {
206:     if (token.length < 2) {
207:       continue;
208:     }
209: 
210:     if (tool.name.toLowerCase().includes(token)) {
211:       score += 8;
212:     }
213: 
214:     if (tool.tags.some((tag) => tag.toLowerCase().includes(token))) {
215:       score += 4;
216:     }
217: 
218:     if (tool.description.toLowerCase().includes(token)) {
219:       score += 2;
220:     }
221:   }
222: 
223:   return score;
224: }
225: 
226: export function listAllRegisteredTools(): IntegrationTool[] {
227:   return getAllRegisteredToolEntries().map((entry) => entry.tool);
228: }
229: 
230: export function listToolDefinitionsForIntegration(
231:   integration: string,
232:   options: {
233:     includePipedreamManifestTools?: boolean;
234:     includeComposioManifestTools?: boolean;
235:   } = {},
236: ): IntegrationTool[] {
237:   const handlerTools = listHandlerToolsForIntegration(integration);
238: 
239:   if (!options.includePipedreamManifestTools && !options.includeComposioManifestTools) {
240:     return handlerTools;
241:   }
242: 
243:   const manifestTools = [
244:     ...(options.includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
245:     ...(options.includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
246:   ];
247:   const tools = new Map<string, IntegrationTool>();
248: 
249:   for (const tool of handlerTools) {
250:     tools.set(tool.name, tool);
251:   }
252: 
253:   for (const tool of manifestTools) {
254:     if (!tools.has(tool.name)) {
255:       tools.set(tool.name, tool);
256:     }
257:   }
258: 
259:   return Array.from(tools.values()).sort((left, right) => left.name.localeCompare(right.name));
260: }
261: 
262: export function getToolDefinitionByName(toolName: string): IntegrationTool | null {
263:   const normalized = normalizeSearchText(toolName);
264: 
265:   if (!normalized) {
266:     return null;
267:   }
268: 
269:   for (const { tool } of getAllRegisteredToolEntries()) {
270:     if (tool.name.toLowerCase() === normalized) {
271:       return tool;
272:     }
273:   }
274: 
275:   return null;
276: }
277: 
278: export function searchToolDefinitions(
279:   query: string,
280:   options: { integration?: string; limit?: number } = {},
281: ): IntegrationTool[] {
282:   const limit = options.limit ?? 5;
283: 
284:   return getAllRegisteredToolEntries()
285:     .map(({ tool }) => ({
286:       tool,
287:       score: scoreTool(tool, query, options.integration),
288:     }))
289:     .filter((entry) => entry.score > 0)
290:     .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
291:     .slice(0, limit)
292:     .map((entry) => entry.tool);
293: }
294: 
295: export async function listConnectedToolEntries(userId: string): Promise<ToolRegistryEntry[]> {
296:   const db = getDatabase();
297: 
298:   if (!db) {
299:     throw new Error("DB binding is not configured");
300:   }
301: 
302:   const connections = await listIntegrationConnectionsForUserId(db, userId);
303:   const connectionsByIntegration = new Map<string, IntegrationConnectionRecord[]>();
304: 
305:   for (const connection of connections) {
306:     const existing = connectionsByIntegration.get(connection.integration) ?? [];
307:     existing.push(connection);
308:     connectionsByIntegration.set(connection.integration, existing);
309:   }
310: 
311:   const entries: ToolRegistryEntry[] = [];
312: 
313:   for (const [integration, integrationConnections] of connectionsByIntegration.entries()) {
314:     const handlerTools = listHandlerToolsForIntegration(integration);
315: 
316:     for (const tool of handlerTools) {
317:       entries.push({ tool, connections: integrationConnections });
318:     }
319: 
320:     const handlerToolNames = new Set(handlerTools.map((tool) => tool.name));
321: 
322:     const pipedreamConnections = integrationConnections.filter(isPipedreamBackedConnection);
323: 
324:     for (const tool of listPipedreamToolsForIntegration(integration)) {
325:       if (handlerToolNames.has(tool.name)) {
326:         continue;
327:       }
328: 
329:       if (pipedreamConnections.length > 0) {
330:         entries.push({ tool, connections: pipedreamConnections });
331:       }
332:     }
333: 
334:     const composioConnections = integrationConnections.filter(isComposioBackedConnection);
335: 
336:     for (const tool of listComposioToolsForIntegration(integration)) {
337:       if (handlerToolNames.has(tool.name)) {
338:         continue;
339:       }
340: 
341:       if (composioConnections.length > 0) {
342:         entries.push({ tool, connections: composioConnections });
343:       }
344:     }
345:   }
346: 
347:   return entries.sort((left, right) => left.tool.name.localeCompare(right.tool.name));
348: }
349: 
350: export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {
351:   const entries = await listConnectedToolEntries(userId);
352:   return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));
353: }
354: 
355: export async function describeToolForUser(
356:   userId: string,
357:   toolName: string,
358: ): Promise<ToolDescription | null> {
359:   const entries = await listConnectedToolEntries(userId);
360:   const match = entries.find(({ tool }) => tool.name === toolName);
361: 
362:   if (!match) {
363:     return null;
364:   }
365: 
366:   return buildToolDescription(match.tool, match.connections);
367: }
368: 
369: export async function listToolDescriptionsForIntegration(
370:   userId: string,
371:   integration: string,
372: ): Promise<ToolDescription[]> {
373:   const db = getDatabase();
374: 
375:   if (!db) {
376:     throw new Error("DB binding is not configured");
377:   }
378: 
379:   const connections = (await listIntegrationConnectionsForUserId(db, userId)).filter(
380:     (connection) => connection.integration === integration,
381:   );
382:   const includePipedreamManifestTools = connections.some(isPipedreamBackedConnection);
383:   const includeComposioManifestTools = connections.some(isComposioBackedConnection);
384:   const pipedreamConnections = connections.filter(isPipedreamBackedConnection);
385:   const composioConnections = connections.filter(isComposioBackedConnection);
386: 
387:   const definitions = [
388:     ...listHandlerToolsForIntegration(integration),
389:     ...(includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
390:     ...(includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
391:   ];
392: 
393:   const uniqueDefinitions = new Map<string, IntegrationTool>();
394:   for (const tool of definitions) {
395:     if (!uniqueDefinitions.has(tool.name)) {
396:       uniqueDefinitions.set(tool.name, tool);
397:     }
398:   }
399: 
400:   return Array.from(uniqueDefinitions.values())
401:     .sort((left, right) => left.name.localeCompare(right.name))
402:     .map((tool) =>
403:       buildToolDescription(
404:         tool,
405:         tool.execution.kind === "pipedream_action"
406:           ? pipedreamConnections
407:           : tool.execution.kind === "composio_tool"
408:             ? composioConnections
409:             : connections,
410:       ),
411:     );
412: }

(End of file - total 412 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.8s)

Now let me check how the worker serves `tools/list` to MCP clients - that's where `inputSchema` is actually serialized and sent:

**Tool: grep**

**Input:**
```json
{
  "pattern": "handleListTools|tools/list|inputSchema",
  "include": "worker/index.ts"
}
```

**Output:**
```
Found 3 matches
/Users/hithesh/clawlink/worker/index.ts:
  Line 570: function handleListTools(): IntegrationTool[] {

  Line 623:         case "tools/list":

  Line 624:           result = { tools: handleListTools() };

```

---

## Assistant (Build · Claude Opus 4.6 · 3.2s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 560,
  "limit": 80
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
560:       providerRequestId,
561:     });
562: 
563:     throw error;
564:   }
565: }
566: 
567: /**
568:  * Handle MCP list_tools request
569:  */
570: function handleListTools(): IntegrationTool[] {
571:   return getAllRegisteredTools();
572: }
573: 
574: export default {
575:   async fetch(request: Request, env: Env): Promise<Response> {
576:     // Handle CORS
577:     const origin = request.headers.get("Origin") || "https://claw-link.dev";
578:     const corsHeaders = {
579:       "Access-Control-Allow-Origin": origin,
580:       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
581:       "Access-Control-Allow-Headers": "Content-Type, Authorization",
582:       "Access-Control-Allow-Credentials": "true",
583:     };
584: 
585:     if (request.method === "OPTIONS") {
586:       return new Response(null, { headers: corsHeaders });
587:     }
588: 
589:     // Only accept JSON-RPC POST
590:     if (request.method !== "POST") {
591:       return new Response(JSON.stringify({
592:         jsonrpc: "2.0",
593:         id: 0,
594:         error: { code: -32600, message: "Method not allowed" }
595:       }), {
596:         status: 405,
597:         headers: { "Content-Type": "application/json" }
598:       });
599:     }
600: 
601:     try {
602:       // Verify authentication
603:       const authHeader = request.headers.get("Authorization");
604:       const userId = await verifyAuth(authHeader, env as { CLERK_PUBLISHABLE_KEY?: string; CLERK_JWT_KEY?: string });
605:       
606:       if (!userId) {
607:         return new Response(JSON.stringify({
608:           jsonrpc: "2.0",
609:           id: 0,
610:           error: { code: -32001, message: "Unauthorized" }
611:         }), {
612:           status: 401,
613:           headers: { "Content-Type": "application/json" }
614:         });
615:       }
616: 
617:       // Parse MCP request
618:       const mcpRequest: MCPRequest = await request.json();
619:       
620:       let result: unknown;
621:       
622:       switch (mcpRequest.method) {
623:         case "tools/list":
624:           result = { tools: handleListTools() };
625:           break;
626:           
627:         case "tools/call":
628:           result = await handleToolCall(
629:             env,
630:             userId,
631:             mcpRequest.params
632:           );
633:           break;
634:           
635:         default:
636:           throw new Error(`Unknown method: ${mcpRequest.method}`);
637:       }
638: 
639:       const response: MCPResponse = {

(Showing lines 560-639 of 682. Use offset=640 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 131.6s)

Now I have a complete picture. Here's my analysis:

---

**Yes, this approach will work. It's a solid plan.** Here's the detailed breakdown:

### Why it works

1. **`tools/list` (MCP)** -- The worker sends the full `IntegrationTool[]` including `inputSchema` to MCP clients (line 624 of `worker/index.ts`). MCP clients need `inputSchema` so they know what arguments to construct. But you can fetch it lazily: return a minimal schema in `tools/list`, then when `tools/call` fires, you already don't validate against `inputSchema` anyway -- args pass straight through to Composio's `POST /tools/execute/<slug>`.

2. **Dashboard** -- The frontend's `tool-registry.ts` reads `inputSchema` for `ToolCatalogItem`/`ToolDescription` objects served to the integration detail page. But the dashboard uses these for display only (showing parameter lists). You could serve a placeholder or fetch on demand.

3. **Execution path** -- `tool-executor.ts:30-53` passes `args` directly to `executeComposioToolRequest()`. It uses `execution.toolSlug`, `execution.toolkit`, `execution.version` -- never reads `inputSchema`. The schema is irrelevant at execution time.

4. **Composio API already has the data** -- The import script already calls `GET /tools?toolkit_slug=<slug>` which returns `input_parameters`. Same endpoint can be called at runtime.

### The catch: MCP `tools/list` needs `inputSchema`

The MCP protocol requires `inputSchema` in the `tools/list` response so the LLM knows what parameters each tool accepts. You have two viable options:

| Approach | Trade-off |
|---|---|
| **A) Lazy fetch on `tools/list`** | First call to `tools/list` fetches schemas from Composio API, caches in KV. Adds latency on first call (~1-2s), but subsequent calls are fast. |
| **B) Minimal schema in manifests, full fetch on `tools/call`** | `tools/list` returns `inputSchema: {}` (or a stripped summary). The MCP client (OpenClaw) gets tool names/descriptions but no param hints. This breaks schema-aware LLM tool use. |

**Option A is the right one.** The MCP client needs real schemas. The flow would be:

1. `tools/list` called --> look up schemas in KV cache --> if miss, batch-fetch from Composio API by toolkit slug, cache with TTL --> return full tools
2. `tools/call` called --> execute as today (no schema needed)
3. Import script generates manifests **without** `inputSchema` (keeps name, description, mode, risk, tags, execution, etc.)
4. Dashboard detail page can either piggyback on the same KV cache or fetch on demand per integration

### Estimated size reduction

- Current Composio manifests: ~13 MB source
- `inputSchema` is ~85-90% of each file (JSON Schema objects with nested properties, enums, descriptions)
- Stripped manifests: ~1.5-2 MB source
- Pipedream manifests (2 MB) have a similar ratio but also carry `execution.props` -- those are needed for `buildConfiguredProps()` at execution time, so they can't be stripped the same way

### Implementation plan

1. **`scripts/import-composio-tools.mjs`** -- Add `--no-schema` flag (or make it default). Generate manifest entries with `inputSchema: {}`.
2. **New `fetchComposioToolSchemas()` in `backend-client.ts`** -- `GET /tools?toolkit_slug=<slug>` at runtime, extract `input_parameters`, return as a `Map<toolSlug, schema>`.
3. **KV cache layer** -- Store fetched schemas in the `CREDENTIALS` KV namespace (or a dedicated one) with a key like `composio-schema:<toolkit>:<version>` and a TTL of 24h.
4. **`manifest-registry.ts`** -- Add a `resolveInputSchema(tool)` async function that checks KV, falls back to API fetch.
5. **`worker/index.ts` `handleListTools()`** -- Make it async, hydrate `inputSchema` from cache/API before returning.
6. **`tool-registry.ts` (frontend)** -- Same lazy hydration for dashboard API routes.

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "Want me to implement this now? The main decision point is how to handle the MCP tools/list schema requirement:",
      "header": "Implementation approach",
      "options": [
        {
          "label": "Lazy fetch + KV cache (Recommended)",
          "description": "tools/list fetches schemas from Composio API on first call, caches in KV with 24h TTL. Best MCP compatibility, slight first-call latency."
        },
        {
          "label": "Per-toolkit lazy fetch",
          "description": "Only fetch schemas for toolkits the user actually has connections for (smaller fetch, faster). Falls back to empty schema for unconnected integrations."
        },
        {
          "label": "Just strip and skip for now",
          "description": "Strip inputSchema from manifests, return empty schemas in tools/list. Fix MCP compatibility later. Fastest to ship, but breaks LLM parameter hints."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Want me to implement this now? The main decision point is how to handle the MCP tools/list schema requirement:"="explain me the pros and cons seperately". You can now continue with the user's answers in mind.
```

---

## Assistant (Build · Claude Opus 4.6 · 97.9s)

### Approach comparison

---

**1. Lazy fetch + KV cache (full hydration)**

How it works: When `tools/list` is called, the worker checks KV for cached schemas per toolkit. On cache miss, it batch-fetches all tool schemas for that toolkit from Composio's `GET /tools` API, stores them in KV with a 24h TTL, then returns fully-hydrated tools.

**Pros:**
- MCP clients always get full `inputSchema` -- LLMs can construct correct arguments without guessing
- One fetch per toolkit covers all tools in that toolkit (e.g., one call gets all 100+ Gmail tools)
- After first call, everything is instant from KV
- Dashboard can reuse the same KV cache
- No behavioral change from the MCP client's perspective

**Cons:**
- First `tools/list` call is slow (~2-5s depending on how many toolkits) since it has to fetch schemas for all ~49 Composio toolkits
- Adds a runtime dependency on Composio's API availability for `tools/list` (if their API is down and KV cache is cold, you can't list tools)
- KV writes cost money (though minimal -- ~49 keys, refreshed daily)
- Stale schema risk if Composio updates a tool's parameters and your 24h TTL hasn't expired

---

**2. Per-toolkit lazy fetch (connection-scoped)**

How it works: Same as above, but only fetches schemas for toolkits where the requesting user has an active connection. Unconnected toolkits return tools with `inputSchema: {}`.

**Pros:**
- First call is much faster -- typical user has 2-5 connected integrations, so only 2-5 API fetches
- Saves KV storage and API calls (only caches what's actually needed)
- Still gives full schemas for the tools the user can actually use
- The MCP client only needs schemas for tools it can execute anyway
- Lower blast radius if Composio API has issues (only affects newly-connected integrations)

**Cons:**
- `tools/list` becomes user-scoped -- the worker currently returns the same tool list for everyone, this would need to know which user is asking (already available from auth)
- Dashboard integration detail pages show tools for integrations the user hasn't connected yet -- those would have empty schemas until connection
- Slightly more complex: need to resolve user connections before deciding what to fetch
- If a user connects a new integration, first `tools/list` after that has a latency spike for that toolkit

---

**3. Just strip and skip**

How it works: Remove `inputSchema` from all generated manifests. `tools/list` returns tools with `inputSchema: {}`. No runtime fetching.

**Pros:**
- Simplest to implement -- one change to the import script, regenerate, done
- Zero runtime dependencies added
- Zero latency impact
- Immediately solves the bundle size problem
- Worker stays fully static/deterministic

**Cons:**
- **Breaks MCP tool calling** -- LLMs need `inputSchema` to know what parameters to pass. Without it, the LLM has to guess argument names and types from the tool description alone. This will cause frequent malformed tool calls.
- Specifically for OpenClaw: the plugin formats tool parameters from the schema. Empty schema = no parameter guidance = degraded UX.
- You'd need to fix this before any user-facing release, so it's really just deferring the work
- Dashboard tool detail pages lose parameter information

---

### My recommendation

**Option 2 (per-toolkit lazy fetch)** is the best balance. Here's why:

- The worker already authenticates every request and knows the `userId`
- A user with 3 connected integrations means 3 toolkit fetches on a cold cache -- under 1 second total
- You avoid the "fetch all 49 toolkits" cold start problem of Option 1
- MCP compatibility is preserved for all tools the user can actually invoke
- Tools for unconnected integrations don't need schemas anyway (the user can't execute them)

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "header": "Pick approach",
      "options": [
        {
          "description": "Only fetch schemas for connected integrations. Best perf + compatibility balance.",
          "label": "Per-toolkit lazy fetch (Recommended)"
        },
        {
          "description": "Fetch all 49 toolkits on first call, cache everything.",
          "label": "Full lazy fetch + KV cache"
        },
        {
          "description": "Ship without schemas now, add fetching later.",
          "label": "Strip and skip for now"
        }
      ],
      "question": "Which approach should I implement?"
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Which approach should I implement?"="i like pre toolkit lazy fetch, with this approach dont i need to write schemas again, is this gonna make my life easier with adding new integrations. would that step becomes fast". You can now continue with the user's answers in mind.
```

---

## Assistant (Build · Claude Opus 4.6 · 16.3s)

Great question. Yes -- **this makes adding new integrations dramatically easier**. Here's the before/after:

### Current workflow (adding a new Composio integration)

1. Run `npm run import:composio-tools -- --toolkit <slug>` -- fetches from Composio API, generates a huge `.generated.ts` file with full schemas
2. The generated file adds 100KB-3.5MB to your bundle depending on how many tools/parameters
3. Commit the generated file to git (big diff, noisy PRs)
4. Deploy both workers (each needs to bundle the new manifest)
5. If Composio updates their tool schemas, you have to re-run the import and redeploy

### New workflow (with per-toolkit lazy fetch)

1. Run `npm run import:composio-tools -- --toolkit <slug>` -- generates a **small** manifest file (~5-20KB) with just name, description, mode, risk, tags, execution metadata
2. The generated file is tiny -- clean diffs, easy to review
3. Commit and deploy
4. `inputSchema` is fetched live from Composio's API when users actually use that integration
5. **If Composio updates their schemas, you get the changes automatically** on next KV cache expiry (24h)
6. No re-import needed for schema changes -- only for adding/removing tools or changing mode/risk classification

### What you still need the import script for

The import script still generates the **non-schema** parts of the manifest:
- Tool name, description (for MCP listing)
- `mode` / `risk` classification (your custom logic, not from Composio)
- `tags`, `askBefore` prompts
- `execution` spec (`toolSlug`, `toolkit`, `version`)
- `idempotent` flag

These are things you curate/control. The schemas are Composio's responsibility.

### Bottom line

Adding a new integration goes from "run import, commit 500KB file, redeploy" to "run import, commit 10KB file, redeploy". Schema maintenance is eliminated entirely.

Let me implement this now.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 5.4s)

Let me start by reading the import script to understand its full structure, plus a couple of generated manifest files to see the exact shape:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/scripts/import-composio-tools.mjs"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/scripts/import-composio-tools.mjs</path>
<type>file</type>
<content>
1: import { promises as fs } from "node:fs";
2: import path from "node:path";
3: import { fileURLToPath } from "node:url";
4: 
5: const __filename = fileURLToPath(import.meta.url);
6: const __dirname = path.dirname(__filename);
7: const repoRoot = path.resolve(__dirname, "..");
8: const generatedDir = path.join(repoRoot, "src/generated/composio-manifests");
9: const indexPath = path.join(generatedDir, "index.ts");
10: 
11: const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";
12: 
13: // ---------------------------------------------------------------------------
14: // CLI arg parsing
15: // ---------------------------------------------------------------------------
16: 
17: function parseArgs(argv) {
18:   const args = {};
19: 
20:   for (let index = 0; index < argv.length; index += 1) {
21:     const value = argv[index];
22:     if (!value.startsWith("--")) continue;
23: 
24:     const key = value.slice(2);
25:     const next = argv[index + 1];
26: 
27:     if (!next || next.startsWith("--")) {
28:       args[key] = "true";
29:       continue;
30:     }
31: 
32:     args[key] = next;
33:     index += 1;
34:   }
35: 
36:   return args;
37: }
38: 
39: function safeTrim(value) {
40:   return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
41: }
42: 
43: // ---------------------------------------------------------------------------
44: // Env loading
45: // ---------------------------------------------------------------------------
46: 
47: function parseEnvFile(contents) {
48:   const env = {};
49: 
50:   for (const rawLine of contents.split(/\r?\n/u)) {
51:     const line = rawLine.trim();
52:     if (!line || line.startsWith("#")) continue;
53: 
54:     const separator = line.indexOf("=");
55:     if (separator < 0) continue;
56: 
57:     const key = line.slice(0, separator).trim();
58:     const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, "");
59: 
60:     if (key) env[key] = value;
61:   }
62: 
63:   return env;
64: }
65: 
66: async function loadLocalEnv() {
67:   const merged = {};
68:   const candidates = [
69:     path.join(repoRoot, ".env.local"),
70:     path.join(repoRoot, ".env.production"),
71:   ];
72: 
73:   for (const candidate of candidates) {
74:     try {
75:       const contents = await fs.readFile(candidate, "utf8");
76:       Object.assign(merged, parseEnvFile(contents));
77:     } catch (error) {
78:       if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
79:       throw error;
80:     }
81:   }
82: 
83:   return merged;
84: }
85: 
86: function getEnvValue(env, key) {
87:   const processValue = typeof process.env[key] === "string" ? process.env[key].trim() : "";
88:   if (processValue) return processValue;
89: 
90:   const fileValue = typeof env[key] === "string" ? env[key].trim() : "";
91:   return fileValue || undefined;
92: }
93: 
94: // ---------------------------------------------------------------------------
95: // Composio API client
96: // ---------------------------------------------------------------------------
97: 
98: async function fetchComposioTools(apiKey, toolkitSlug, baseUrl) {
99:   const url = new URL(`${baseUrl}/tools`);
100:   url.searchParams.set("toolkit_slug", toolkitSlug);
101:   url.searchParams.set("toolkit_versions", "latest");
102:   url.searchParams.set("limit", "1000");
103:   url.searchParams.set("include_deprecated", "true");
104: 
105:   const response = await fetch(url.toString(), {
106:     headers: {
107:       Accept: "application/json",
108:       "x-api-key": apiKey,
109:     },
110:   });
111: 
112:   if (!response.ok) {
113:     const body = await response.text().catch(() => "");
114:     throw new Error(`Composio API error ${response.status}: ${body}`);
115:   }
116: 
117:   const data = await response.json();
118:   return data;
119: }
120: 
121: // ---------------------------------------------------------------------------
122: // Mode / risk classification
123: // ---------------------------------------------------------------------------
124: 
125: // Composio tags that map directly to mode/risk.
126: const HINT_TAG_READ = "readOnlyHint";
127: const HINT_TAG_CREATE = "createHint";
128: const HINT_TAG_UPDATE = "updateHint";
129: const HINT_TAG_DESTRUCTIVE = "destructiveHint";
130: const HINT_TAG_IDEMPOTENT = "idempotentHint";
131: 
132: // Slug-based fallback patterns when Composio doesn't provide hint tags.
133: const READ_SLUG_PATTERNS = /(?:^|_)(?:GET|LIST|COUNT|CHECK|EXPORT|SEARCH|FIND|ENUM|STATUS|ANALYTICS|STATS|VITALS|OVERVIEW)(?:_|$)/i;
134: const DESTRUCTIVE_SLUG_PATTERNS = /(?:^|_)(?:DELETE|REMOVE)(?:_|$)/i;
135: 
136: function classifyTool(composioTool) {
137:   const tags = new Set(composioTool.tags ?? []);
138:   const slug = composioTool.slug ?? "";
139: 
140:   // Use Composio hint tags first.
141:   // ToolRisk type is "safe" | "confirm" | "high_impact".
142:   if (tags.has(HINT_TAG_DESTRUCTIVE)) {
143:     return { mode: "write", risk: "high_impact" };
144:   }
145: 
146:   if (tags.has(HINT_TAG_READ)) {
147:     return { mode: "read", risk: "safe" };
148:   }
149: 
150:   if (tags.has(HINT_TAG_CREATE) || tags.has(HINT_TAG_UPDATE)) {
151:     return { mode: "write", risk: "confirm" };
152:   }
153: 
154:   // Fallback: slug pattern matching.
155:   if (READ_SLUG_PATTERNS.test(slug)) {
156:     return { mode: "read", risk: "safe" };
157:   }
158: 
159:   if (DESTRUCTIVE_SLUG_PATTERNS.test(slug)) {
160:     return { mode: "write", risk: "high_impact" };
161:   }
162: 
163:   // Default to write/confirm.
164:   return { mode: "write", risk: "confirm" };
165: }
166: 
167: // ---------------------------------------------------------------------------
168: // Input schema conversion
169: // ---------------------------------------------------------------------------
170: 
171: function convertInputSchema(inputParams) {
172:   if (!inputParams || typeof inputParams !== "object") {
173:     return { type: "object", additionalProperties: true, properties: {} };
174:   }
175: 
176:   const properties = {};
177:   const required = [];
178: 
179:   const rawProps = inputParams.properties ?? {};
180: 
181:   for (const [name, prop] of Object.entries(rawProps)) {
182:     const schema = {};
183:     const propType = prop.type;
184: 
185:     if (propType === "array") {
186:       schema.type = "array";
187:       if (prop.items) {
188:         schema.items = simplifySchemaNode(prop.items);
189:       } else {
190:         schema.items = { type: "object", additionalProperties: true };
191:       }
192:     } else if (propType === "object") {
193:       schema.type = "object";
194:       schema.additionalProperties = true;
195:       if (prop.properties) {
196:         schema.properties = {};
197:         for (const [nestedName, nestedProp] of Object.entries(prop.properties)) {
198:           schema.properties[nestedName] = simplifySchemaNode(nestedProp);
199:         }
200:       }
201:     } else if (propType === "integer") {
202:       schema.type = "integer";
203:     } else if (propType === "number") {
204:       schema.type = "number";
205:     } else if (propType === "boolean") {
206:       schema.type = "boolean";
207:     } else {
208:       schema.type = "string";
209:     }
210: 
211:     if (prop.description) {
212:       schema.description = prop.description;
213:     }
214: 
215:     if (prop.enum) {
216:       schema.enum = prop.enum;
217:     }
218: 
219:     properties[name] = schema;
220:   }
221: 
222:   if (Array.isArray(inputParams.required)) {
223:     required.push(...inputParams.required);
224:   }
225: 
226:   const result = {
227:     type: "object",
228:     additionalProperties: true,
229:     properties,
230:   };
231: 
232:   if (required.length > 0) {
233:     result.required = required;
234:   }
235: 
236:   return result;
237: }
238: 
239: function simplifySchemaNode(node) {
240:   if (!node || typeof node !== "object") {
241:     return { type: "string" };
242:   }
243: 
244:   // Handle $ref by treating as flexible object.
245:   if (node.$ref) {
246:     return { type: "object", additionalProperties: true };
247:   }
248: 
249:   const result = {};
250: 
251:   if (node.type === "array") {
252:     result.type = "array";
253:     result.items = node.items ? simplifySchemaNode(node.items) : { type: "object", additionalProperties: true };
254:   } else if (node.type === "object") {
255:     result.type = "object";
256:     result.additionalProperties = true;
257:     if (node.properties) {
258:       result.properties = {};
259:       for (const [k, v] of Object.entries(node.properties)) {
260:         result.properties[k] = simplifySchemaNode(v);
261:       }
262:     }
263:   } else if (node.type) {
264:     result.type = node.type;
265:   } else {
266:     result.type = "string";
267:   }
268: 
269:   if (node.description) result.description = node.description;
270:   if (node.enum) result.enum = node.enum;
271: 
272:   return result;
273: }
274: 
275: // ---------------------------------------------------------------------------
276: // Tool name derivation
277: // ---------------------------------------------------------------------------
278: 
279: function toClawlinkToolName(composioSlug) {
280:   // INSTANTLY_LIST_CAMPAIGNS → instantly_list_campaigns
281:   return composioSlug.toLowerCase();
282: }
283: 
284: function humanizeToolName(composioName) {
285:   // "List Campaigns" stays as-is. Used for askBefore prompts.
286:   return composioName ?? composioName;
287: }
288: 
289: // ---------------------------------------------------------------------------
290: // askBefore generation
291: // ---------------------------------------------------------------------------
292: 
293: function buildAskBefore(mode, risk, humanName) {
294:   if (mode === "read") return [];
295: 
296:   if (risk === "high_impact") {
297:     return [`This action is destructive and cannot be undone. Confirm before executing ${humanName}.`];
298:   }
299: 
300:   return [`Confirm the parameters before executing ${humanName}.`];
301: }
302: 
303: // ---------------------------------------------------------------------------
304: // Tag generation
305: // ---------------------------------------------------------------------------
306: 
307: function buildTags(integration, mode, composioTags) {
308:   const tags = ["composio", integration];
309: 
310:   tags.push(mode === "read" ? "read" : "write");
311: 
312:   // Pull in Composio category tags (the non-hint ones).
313:   for (const tag of composioTags ?? []) {
314:     if (
315:       tag.endsWith("Hint") ||
316:       tag === "important" ||
317:       tag === "deprecated" ||
318:       tag === "openWorldHint"
319:     ) {
320:       continue;
321:     }
322: 
323:     const normalized = tag
324:       .toLowerCase()
325:       .replace(/[^a-z0-9]+/g, "_")
326:       .replace(/^_|_$/g, "");
327: 
328:     if (normalized && !tags.includes(normalized)) {
329:       tags.push(normalized);
330:     }
331:   }
332: 
333:   return tags;
334: }
335: 
336: // ---------------------------------------------------------------------------
337: // TypeScript source renderer
338: // ---------------------------------------------------------------------------
339: 
340: function indent(depth) {
341:   return "  ".repeat(depth);
342: }
343: 
344: function renderValue(value, depth = 0) {
345:   if (value === undefined) return "undefined";
346:   if (value === null) return "null";
347:   if (typeof value === "string") return JSON.stringify(value);
348:   if (typeof value === "number" || typeof value === "boolean") return String(value);
349: 
350:   if (Array.isArray(value)) {
351:     if (value.length === 0) return "[]";
352: 
353:     const items = value
354:       .map((item) => `${indent(depth + 1)}${renderValue(item, depth + 1)}`)
355:       .join(",\n");
356: 
357:     return `[\n${items},\n${indent(depth)}]`;
358:   }
359: 
360:   const entries = Object.entries(value).filter(([, v]) => v !== undefined);
361: 
362:   if (entries.length === 0) return "{}";
363: 
364:   const lines = entries
365:     .map(([key, v]) => {
366:       const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
367:       return `${indent(depth + 1)}${safeKey}: ${renderValue(v, depth + 1)}`;
368:     })
369:     .join(",\n");
370: 
371:   return `{\n${lines},\n${indent(depth)}}`;
372: }
373: 
374: function renderToolCall(tool, depth = 1) {
375:   const obj = {};
376: 
377:   obj.name = tool.name;
378:   obj.description = tool.description;
379:   obj.toolSlug = tool.toolSlug;
380:   obj.mode = tool.mode;
381:   obj.risk = tool.risk;
382: 
383:   if (Object.keys(tool.inputSchema.properties ?? {}).length > 0 || (tool.inputSchema.required ?? []).length > 0) {
384:     obj.inputSchema = tool.inputSchema;
385:   } else {
386:     obj.inputSchema = { type: "object", properties: {} };
387:   }
388: 
389:   if (tool.tags && tool.tags.length > 0) {
390:     obj.tags = tool.tags;
391:   }
392: 
393:   if (tool.askBefore && tool.askBefore.length > 0) {
394:     obj.askBefore = tool.askBefore;
395:   }
396: 
397:   if (tool.idempotent !== undefined && tool.idempotent !== (tool.mode === "read")) {
398:     obj.idempotent = tool.idempotent;
399:   }
400: 
401:   return `${indent(depth)}composioTool(${renderValue(obj, depth)})`;
402: }
403: 
404: // ---------------------------------------------------------------------------
405: // File generation
406: // ---------------------------------------------------------------------------
407: 
408: function sanitizeFileSlug(value) {
409:   return value.replace(/[^a-z0-9-]+/giu, "-").replace(/^-+|-+$/gu, "");
410: }
411: 
412: function toPascalCase(value) {
413:   return value
414:     .split(/[^a-z0-9]+/iu)
415:     .filter(Boolean)
416:     .map((token) => token[0].toUpperCase() + token.slice(1))
417:     .join("");
418: }
419: 
420: function toCamelCase(value) {
421:   const pascal = toPascalCase(value);
422:   return pascal[0].toLowerCase() + pascal.slice(1);
423: }
424: 
425: function generateManifestSource(integration, composioToolkit, version, tools) {
426:   const exportName = `${toCamelCase(integration)}ComposioTools`;
427: 
428:   const toolEntries = tools
429:     .map((tool) => renderToolCall(tool, 1))
430:     .join(",\n");
431: 
432:   return `import type { IntegrationTool } from "../../../worker/integrations/base";
433: 
434: function composioTool(
435:   partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
436:     accessLevel?: IntegrationTool["accessLevel"];
437:     tags?: string[];
438:     whenToUse?: string[];
439:     askBefore?: string[];
440:     safeDefaults?: Record<string, unknown>;
441:     examples?: IntegrationTool["examples"];
442:     requiresScopes?: string[];
443:     idempotent?: boolean;
444:     supportsDryRun?: boolean;
445:     supportsBatch?: boolean;
446:     toolSlug: string;
447:   },
448: ): IntegrationTool {
449:   return {
450:     integration: ${JSON.stringify(integration)},
451:     name: partial.name,
452:     description: partial.description,
453:     inputSchema: partial.inputSchema,
454:     outputSchema: partial.outputSchema,
455:     accessLevel: partial.accessLevel ?? partial.mode,
456:     mode: partial.mode,
457:     risk: partial.risk,
458:     tags: partial.tags ?? [],
459:     whenToUse: partial.whenToUse ?? [],
460:     askBefore: partial.askBefore ?? [],
461:     safeDefaults: partial.safeDefaults ?? {},
462:     examples: partial.examples ?? [],
463:     followups: [],
464:     requiresScopes: partial.requiresScopes ?? [],
465:     idempotent: partial.idempotent ?? partial.mode === "read",
466:     supportsDryRun: partial.supportsDryRun ?? false,
467:     supportsBatch: partial.supportsBatch ?? false,
468:     execution: {
469:       kind: "composio_tool",
470:       toolkit: ${JSON.stringify(composioToolkit)},
471:       toolSlug: partial.toolSlug,
472:       version: ${JSON.stringify(version)},
473:     },
474:   };
475: }
476: 
477: export const ${exportName}: IntegrationTool[] = [
478: ${toolEntries},
479: ];
480: `;
481: }
482: 
483: async function writeManifestFile(integration, composioToolkit, version, tools) {
484:   await fs.mkdir(generatedDir, { recursive: true });
485: 
486:   const fileSlug = sanitizeFileSlug(integration);
487:   const filePath = path.join(generatedDir, `${fileSlug}.generated.ts`);
488:   const source = generateManifestSource(integration, composioToolkit, version, tools);
489: 
490:   await fs.writeFile(filePath, source, "utf8");
491: 
492:   return { filePath, fileSlug };
493: }
494: 
495: async function rewriteIndex() {
496:   await fs.mkdir(generatedDir, { recursive: true });
497: 
498:   const files = (await fs.readdir(generatedDir))
499:     .filter((file) => file.endsWith(".generated.ts"))
500:     .sort((left, right) => left.localeCompare(right));
501: 
502:   const imports = [];
503:   const spreadEntries = [];
504: 
505:   for (const file of files) {
506:     const fileSlug = file.replace(/\.generated\.ts$/u, "");
507:     const exportName = `${toCamelCase(fileSlug)}ComposioTools`;
508:     imports.push(`import { ${exportName} } from "./${fileSlug}.generated";`);
509:     spreadEntries.push(`  ...${exportName},`);
510:   }
511: 
512:   const source = `import type { IntegrationTool } from "../../../worker/integrations/base";
513: ${imports.length > 0 ? `${imports.join("\n")}\n` : ""}
514: export const composioToolManifests: IntegrationTool[] = [
515: ${spreadEntries.join("\n")}
516: ];
517: `;
518: 
519:   await fs.writeFile(indexPath, source, "utf8");
520: }
521: 
522: // ---------------------------------------------------------------------------
523: // Main
524: // ---------------------------------------------------------------------------
525: 
526: async function main() {
527:   const args = parseArgs(process.argv.slice(2));
528:   const toolkit = safeTrim(args.toolkit);
529:   const integration = safeTrim(args.integration) ?? toolkit;
530:   const dryRun = args["dry-run"] === "true";
531: 
532:   if (!toolkit) {
533:     console.error(
534:       "Usage: node scripts/import-composio-tools.mjs --toolkit <composio_toolkit_slug> [--integration <clawlink_slug>] [--dry-run]",
535:     );
536:     console.error("");
537:     console.error("Examples:");
538:     console.error("  node scripts/import-composio-tools.mjs --toolkit instantly --integration instantly");
539:     console.error("  node scripts/import-composio-tools.mjs --toolkit gmail --integration gmail");
540:     console.error("  node scripts/import-composio-tools.mjs --toolkit clickup --integration clickup --dry-run");
541:     process.exitCode = 1;
542:     return;
543:   }
544: 
545:   const env = await loadLocalEnv();
546:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
547: 
548:   if (!apiKey) {
549:     throw new Error("COMPOSIO_API_KEY is not set. Add it to .env.local or set it as an env var.");
550:   }
551: 
552:   const baseUrl = getEnvValue(env, "COMPOSIO_BASE_URL") ?? DEFAULT_BASE_URL;
553: 
554:   console.log(`Fetching tools for toolkit "${toolkit}" from Composio...`);
555:   const response = await fetchComposioTools(apiKey, toolkit, baseUrl);
556: 
557:   const totalItems = response.total_items ?? response.items?.length ?? 0;
558:   console.log(`Composio returned ${totalItems} tools.`);
559: 
560:   if (!response.items || response.items.length === 0) {
561:     throw new Error(`No tools found for toolkit "${toolkit}". Check the toolkit slug.`);
562:   }
563: 
564:   // Determine version from the first tool.
565:   const toolkitVersion = response.items[0]?.version ?? "latest";
566:   const composioToolkitSlug = response.items[0]?.toolkit?.slug ?? toolkit;
567:   console.log(`Toolkit version: ${toolkitVersion}`);
568:   console.log(`Composio toolkit slug: ${composioToolkitSlug}`);
569: 
570:   // Filter out deprecated tools.
571:   const activeTools = response.items.filter((item) => !item.is_deprecated);
572:   const deprecatedCount = response.items.length - activeTools.length;
573: 
574:   if (deprecatedCount > 0) {
575:     const deprecatedSlugs = response.items
576:       .filter((item) => item.is_deprecated)
577:       .map((item) => item.slug);
578:     console.log(`Skipping ${deprecatedCount} deprecated tool(s): ${deprecatedSlugs.join(", ")}`);
579:   }
580: 
581:   // Build manifest entries.
582:   const tools = activeTools
583:     .map((item) => {
584:       const { mode, risk } = classifyTool(item);
585:       const name = toClawlinkToolName(item.slug);
586:       const tags = buildTags(integration, mode, item.tags);
587:       const humanName = humanizeToolName(item.name);
588:       const askBefore = buildAskBefore(mode, risk, humanName);
589:       const inputSchema = convertInputSchema(item.input_parameters);
590:       const idempotent = (item.tags ?? []).includes(HINT_TAG_IDEMPOTENT) ? true : undefined;
591: 
592:       return {
593:         name,
594:         description: item.description,
595:         toolSlug: item.slug,
596:         mode,
597:         risk,
598:         tags,
599:         askBefore,
600:         inputSchema,
601:         idempotent,
602:       };
603:     })
604:     .sort((a, b) => a.name.localeCompare(b.name));
605: 
606:   // Stats.
607:   const readCount = tools.filter((t) => t.mode === "read").length;
608:   const writeConfirmCount = tools.filter((t) => t.mode === "write" && t.risk === "confirm").length;
609:   const writeDangerousCount = tools.filter((t) => t.mode === "write" && t.risk === "high_impact").length;
610: 
611:   console.log(`\nTool breakdown for ${integration}:`);
612:   console.log(`  Read (safe):         ${readCount}`);
613:   console.log(`  Write (confirm):     ${writeConfirmCount}`);
614:   console.log(`  Write (high_impact): ${writeDangerousCount}`);
615:   console.log(`  Total:             ${tools.length}`);
616: 
617:   if (dryRun) {
618:     console.log("\n[Dry run] Would generate the following tools:");
619:     for (const tool of tools) {
620:       const riskLabel = tool.risk === "high_impact" ? " ⚠️" : tool.risk === "confirm" ? " ✏️" : "";
621:       console.log(`  ${tool.mode.padEnd(5)} ${tool.name}${riskLabel}`);
622:     }
623:     console.log(`\n[Dry run] No files written.`);
624:     return;
625:   }
626: 
627:   // Write manifest file.
628:   const { filePath } = await writeManifestFile(integration, composioToolkitSlug, toolkitVersion, tools);
629:   console.log(`\nWrote ${tools.length} tools to ${path.relative(repoRoot, filePath)}`);
630: 
631:   // Update barrel index.
632:   await rewriteIndex();
633:   console.log(`Updated ${path.relative(repoRoot, indexPath)}`);
634: 
635:   console.log(`\nDone. Imported ${tools.length} Composio tools for ${integration}.`);
636: }
637: 
638: main().catch((error) => {
639:   console.error(error instanceof Error ? error.message : error);
640:   process.exitCode = 1;
641: });

(End of file - total 641 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts",
  "limit": 100
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: 
3: function composioTool(
4:   partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
5:     accessLevel?: IntegrationTool["accessLevel"];
6:     tags?: string[];
7:     whenToUse?: string[];
8:     askBefore?: string[];
9:     safeDefaults?: Record<string, unknown>;
10:     examples?: IntegrationTool["examples"];
11:     requiresScopes?: string[];
12:     idempotent?: boolean;
13:     supportsDryRun?: boolean;
14:     supportsBatch?: boolean;
15:     toolSlug: string;
16:   },
17: ): IntegrationTool {
18:   return {
19:     integration: "gmail",
20:     name: partial.name,
21:     description: partial.description,
22:     inputSchema: partial.inputSchema,
23:     outputSchema: partial.outputSchema,
24:     accessLevel: partial.accessLevel ?? partial.mode,
25:     mode: partial.mode,
26:     risk: partial.risk,
27:     tags: partial.tags ?? [],
28:     whenToUse: partial.whenToUse ?? [],
29:     askBefore: partial.askBefore ?? [],
30:     safeDefaults: partial.safeDefaults ?? {},
31:     examples: partial.examples ?? [],
32:     followups: [],
33:     requiresScopes: partial.requiresScopes ?? [],
34:     idempotent: partial.idempotent ?? partial.mode === "read",
35:     supportsDryRun: partial.supportsDryRun ?? false,
36:     supportsBatch: partial.supportsBatch ?? false,
37:     execution: {
38:       kind: "composio_tool",
39:       toolkit: "gmail",
40:       toolSlug: partial.toolSlug,
41:       version: "20260430_00",
42:     },
43:   };
44: }
45: 
46: export const gmailComposioTools: IntegrationTool[] = [
47:   composioTool({
48:     name: "gmail_add_label_to_email",
49:     description: "Adds and/or removes specified Gmail labels for a message; ensure `message_id` and all `label_ids` are valid (use 'listLabels' for custom label IDs).",
50:     toolSlug: "GMAIL_ADD_LABEL_TO_EMAIL",
51:     mode: "write",
52:     risk: "confirm",
53:     inputSchema: {
54:       type: "object",
55:       additionalProperties: true,
56:       properties: {
57:         user_id: {
58:           type: "string",
59:           description: "User's email address or 'me' for the authenticated user.",
60:         },
61:         message_id: {
62:           type: "string",
63:           description: "Immutable ID of the message to modify. Gmail message IDs are 15-16 character hexadecimal strings (e.g., '1a2b3c4d5e6f7890'). IMPORTANT: Do NOT use UUIDs (32-character strings like '093ca4662b214d5eba8f4ceeaad63433'), thread IDs, or internal system IDs - these will cause 'Invalid id value' errors. Obtain valid message IDs from: (1) 'GMAIL_FETCH_EMAILS' response 'messageId' field, (2) 'GMAIL_FETCH_MESSAGE_BY_THREAD_ID' response, or (3) 'GMAIL_LIST_THREADS' and then fetching thread messages.",
64:         },
65:         add_label_ids: {
66:           type: "array",
67:           items: {
68:             type: "string",
69:           },
70:           description: "Label IDs to add (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY_PERSONAL, CATEGORY_SOCIAL, CATEGORY_PROMOTIONS, CATEGORY_UPDATES, CATEGORY_FORUMS. Use full CATEGORY_ prefix (e.g., 'CATEGORY_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label_<number>'). Do NOT use the label display name; the API requires the ID. SENT, DRAFT, CHAT are immutable and cannot be added or removed. A label cannot appear in both add_label_ids and remove_label_ids.",
71:         },
72:         remove_label_ids: {
73:           type: "array",
74:           items: {
75:             type: "string",
76:           },
77:           description: "Label IDs to remove (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY_PERSONAL, CATEGORY_SOCIAL, CATEGORY_PROMOTIONS, CATEGORY_UPDATES, CATEGORY_FORUMS. Use full CATEGORY_ prefix (e.g., 'CATEGORY_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label_<number>'). SENT, DRAFT, CHAT are immutable and cannot be removed. Common operations: to mark as read, remove 'UNREAD'; to archive, remove 'INBOX'. A label cannot appear in both add_label_ids and remove_label_ids.",
78:         },
79:       },
80:       required: [
81:         "message_id",
82:       ],
83:     },
84:     tags: [
85:       "composio",
86:       "gmail",
87:       "write",
88:     ],
89:     askBefore: [
90:       "Confirm the parameters before executing Modify email labels.",
91:     ],
92:     idempotent: true,
93:   }),
94:   composioTool({
95:     name: "gmail_batch_delete_messages",
96:     description: "Tool to permanently delete multiple Gmail messages in bulk, bypassing Trash with no recovery possible. Use when you need to efficiently remove large numbers of emails (e.g., retention enforcement, mailbox hygiene). Use GMAIL_MOVE_TO_TRASH instead when reversibility may be needed. Always obtain explicit user confirmation and verify a sample of message IDs before executing. High-volume calls may trigger 429 rateLimitExceeded or 403 userRateLimitExceeded errors; apply exponential backoff.",
97:     toolSlug: "GMAIL_BATCH_DELETE_MESSAGES",
98:     mode: "write",
99:     risk: "high_impact",
100:     inputSchema: {

(Showing lines 1-100 of 2908. Use offset=101 to continue.)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/wrangler.worker.toml"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/wrangler.worker.toml</path>
<type>file</type>
<content>
1: name = "clawlink"
2: main = "index.ts"
3: compatibility_date = "2026-04-01"
4: compatibility_flags = ["nodejs_compat"]
5: 
6: [observability]
7: enabled = true
8: 
9: [triggers]
10: crons = ["*/5 * * * *"]
11: 
12: # D1 Database
13: [[d1_databases]]
14: binding = "DB"
15: database_name = "clawlink"
16: database_id = "6a73a389-ebd4-46ee-9a3d-2d637831ed65"
17: 
18: # KV for credential cache
19: [[kv_namespaces]]
20: binding = "CREDENTIALS"
21: id = "82482703a83c4bc28af059eb092bd9a2"
22: 
23: # Environment variables
24: [vars]
25: ENV = "production"
26: CLAWLINK_APP_URL = "https://claw-link.dev"
27: NANGO_BASE_URL = "https://nango.claw-link.dev"
28: NANGO_PROVIDER_CONFIG_KEYS = "{\"google-analytics\":\"google-analytics\"}"
29: PIPEDREAM_ENVIRONMENT = "production"
30: PIPEDREAM_PROJECT_ID = "proj_gYspDxN"
31: PIPEDREAM_CONNECT_SLUGS = "slack,facebook,mailchimp,gmail,linkedin,outlook,xero,notion,apollo,postiz,google-analytics,google-search-console,google-calendar,google-docs,google-drive,google-sheets,youtube,clickup,hubspot,airtable,salesforce,calendly,onedrive,google-ads"
32: PIPEDREAM_APP_MAP = "apollo=apollo_io_oauth,xero=xero_accounting_api,airtable=airtable_oauth,salesforce=salesforce_rest_api,calendly=calendly_v2,onedrive=microsoft_onedrive,google-ads=google_ads,google-analytics=google_analytics,google-calendar=google_calendar,google-docs=google_docs,google-drive=google_drive,google-sheets=google_sheets,google-search-console=google_search_console,youtube=youtube_data_api"
33: COMPOSIO_BASE_URL = "https://backend.composio.dev/api/v3.1"
34: COMPOSIO_ENABLED_SLUGS = "instantly,outlook,apollo,postiz,gmail,google-search-console,google-docs,google-analytics,onedrive,google-ads,hubspot,google-calendar,klaviyo,airtable,calendly,clickup,mailchimp,notion,salesforce,xero,twilio,facebook,linkedin,shopify,youtube,activecampaign,highlevel,sendgrid,semrush,ahrefs,mailerlite,brevo,twitter,motion,lemlist,omnisend,kit,resend,postmark,reddit-ads,snapchat,dataforseo,phantombuster,instagram,stripe,dropbox,elevenlabs,docusign"
35: COMPOSIO_TOOLKIT_MAP = "instantly=instantly,outlook=outlook,apollo=apollo,postiz=postiz_mcp,gmail=gmail,google-search-console=google_search_console,google-docs=googledocs,google-analytics=google_analytics,onedrive=one_drive,google-ads=googleads,hubspot=hubspot,google-calendar=googlecalendar,klaviyo=klaviyo,airtable=airtable,calendly=calendly,clickup=clickup,mailchimp=mailchimp,notion=notion,salesforce=salesforce,xero=xero,twilio=twilio,facebook=facebook,linkedin=linkedin,shopify=shopify,youtube=youtube,activecampaign=active_campaign,highlevel=highlevel,sendgrid=sendgrid,semrush=semrush,ahrefs=ahrefs,mailerlite=mailerlite,brevo=brevo,twitter=twitter,motion=motion,lemlist=lemlist,omnisend=omnisend,kit=kit,resend=resend,postmark=postmark,reddit-ads=reddit_ads,snapchat=snapchat,dataforseo=dataforseo,phantombuster=phantombuster,instagram=instagram,stripe=stripe,dropbox=dropbox,elevenlabs=elevenlabs,docusign=docusign"
36: COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,outlook=20260430_00,apollo=20260429_00,postiz=20260303_02,gmail=20260430_00,google-search-console=20260429_00,google-docs=20260430_00,google-analytics=20260429_00,onedrive=20260429_01,google-ads=20260429_00,hubspot=20260429_00,google-calendar=20260429_00,klaviyo=20260429_00,airtable=20260430_00,calendly=20260429_00,clickup=20260429_00,mailchimp=20260429_00,notion=20260430_00,salesforce=20260430_00,xero=20260429_00,twilio=latest,facebook=20260429_00,linkedin=20260424_00,shopify=20260429_01,youtube=20260429_00,activecampaign=20260429_00,highlevel=20260501_00,sendgrid=20260429_00,semrush=20260407_00,ahrefs=20260424_00,mailerlite=20260429_00,brevo=20260424_00,twitter=20260501_00,motion=20260429_00,lemlist=20260429_00,omnisend=20260501_00,kit=20260429_00,resend=20260429_00,postmark=20260429_00,reddit-ads=20260429_00,snapchat=20260501_00,dataforseo=20260429_00,phantombuster=20260429_00,instagram=20260501_00,stripe=20260430_00,dropbox=20260429_00,elevenlabs=20260429_00,docusign=20260501_00"

(End of file - total 36 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.9s)

Good, now I have all the context I need. Let me also check how the worker handles the `handleListTools` flow and the MCP response to understand what shape tools need to be in:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "limit": 50,
  "offset": 1
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
1: /// <reference types="@cloudflare/workers-types" />
2: 
3: /**
4:  * ClawLink Worker - MCP Proxy Server
5:  * 
6:  * Handles MCP protocol requests from OpenClaw and proxies them
7:  * to third-party APIs (Gmail, Slack, Stripe, etc.)
8:  */
9: 
10: // Import integrations to register handlers
11: import "./integrations";
12: 
13: import { executeComposioTool } from "../src/lib/composio/tool-executor";
14: import { executePipedreamActionTool } from "../src/lib/pipedream/action-executor";
15: import { verifyAuth } from "./auth";
16: import {
17:   loadConnectionCredentialsForIntegration,
18:   markConnectionNeedsReauthForIntegration,
19:   recordConnectionExecutionFailure,
20:   recordConnectionExecutionSuccess,
21:   refreshCredentialsForIntegration,
22:   resolveInternalUserId,
23:   updateConnectionExecutionMetadata,
24: } from "./credentials";
25: import { logRequest, logToolExecution } from "./logger";
26: import {
27:   getAllRegisteredTools,
28:   getIntegrationHandler,
29:   getRegisteredToolByName,
30:   type IntegrationTool,
31: } from "./integrations";
32: import { classifyIntegrationError, isAuthenticationFailure } from "./integrations/base";
33: 
34: export interface Env {
35:   DB: D1Database;
36:   CREDENTIALS: KVNamespace;
37:   CLAWLINK_APP_URL?: string;
38:   CREDENTIAL_ENCRYPTION_KEY?: string;
39:   CLERK_PUBLISHABLE_KEY?: string;
40:   CLERK_JWT_KEY?: string;
41:   NANGO_BASE_URL?: string;
42:   NANGO_SECRET_KEY?: string;
43:   NANGO_PROVIDER_CONFIG_KEYS?: string;
44:   PIPEDREAM_BASE_URL?: string;
45:   PIPEDREAM_CLIENT_ID?: string;
46:   PIPEDREAM_CLIENT_SECRET?: string;
47:   PIPEDREAM_PROJECT_ID?: string;
48:   PIPEDREAM_ENVIRONMENT?: string;
49:   COMPOSIO_API_KEY?: string;
50:   COMPOSIO_BASE_URL?: string;

(Showing lines 1-50 of 682. Use offset=51 to continue.)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/generated/composio-manifests/index.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/generated/composio-manifests/index.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: import { activecampaignComposioTools } from "./activecampaign.generated";
3: import { ahrefsComposioTools } from "./ahrefs.generated";
4: import { airtableComposioTools } from "./airtable.generated";
5: import { apolloComposioTools } from "./apollo.generated";
6: import { brevoComposioTools } from "./brevo.generated";
7: import { calendlyComposioTools } from "./calendly.generated";
8: import { clickupComposioTools } from "./clickup.generated";
9: import { dataforseoComposioTools } from "./dataforseo.generated";
10: import { docusignComposioTools } from "./docusign.generated";
11: import { dropboxComposioTools } from "./dropbox.generated";
12: import { elevenlabsComposioTools } from "./elevenlabs.generated";
13: import { facebookComposioTools } from "./facebook.generated";
14: import { gmailComposioTools } from "./gmail.generated";
15: import { googleAdsComposioTools } from "./google-ads.generated";
16: import { googleAnalyticsComposioTools } from "./google-analytics.generated";
17: import { googleCalendarComposioTools } from "./google-calendar.generated";
18: import { googleDocsComposioTools } from "./google-docs.generated";
19: import { googleSearchConsoleComposioTools } from "./google-search-console.generated";
20: import { highlevelComposioTools } from "./highlevel.generated";
21: import { hubspotComposioTools } from "./hubspot.generated";
22: import { instagramComposioTools } from "./instagram.generated";
23: import { instantlyComposioTools } from "./instantly.generated";
24: import { kitComposioTools } from "./kit.generated";
25: import { klaviyoComposioTools } from "./klaviyo.generated";
26: import { lemlistComposioTools } from "./lemlist.generated";
27: import { linkedinComposioTools } from "./linkedin.generated";
28: import { mailchimpComposioTools } from "./mailchimp.generated";
29: import { mailerliteComposioTools } from "./mailerlite.generated";
30: import { motionComposioTools } from "./motion.generated";
31: import { notionComposioTools } from "./notion.generated";
32: import { omnisendComposioTools } from "./omnisend.generated";
33: import { onedriveComposioTools } from "./onedrive.generated";
34: import { outlookComposioTools } from "./outlook.generated";
35: import { phantombusterComposioTools } from "./phantombuster.generated";
36: import { postizComposioTools } from "./postiz.generated";
37: import { postmarkComposioTools } from "./postmark.generated";
38: import { redditAdsComposioTools } from "./reddit-ads.generated";
39: import { resendComposioTools } from "./resend.generated";
40: import { salesforceComposioTools } from "./salesforce.generated";
41: import { semrushComposioTools } from "./semrush.generated";
42: import { sendgridComposioTools } from "./sendgrid.generated";
43: import { shopifyComposioTools } from "./shopify.generated";
44: import { snapchatComposioTools } from "./snapchat.generated";
45: import { stripeComposioTools } from "./stripe.generated";
46: import { twilioComposioTools } from "./twilio.generated";
47: import { twitterComposioTools } from "./twitter.generated";
48: import { xeroComposioTools } from "./xero.generated";
49: import { youtubeComposioTools } from "./youtube.generated";
50: 
51: export const composioToolManifests: IntegrationTool[] = [
52:   ...activecampaignComposioTools,
53:   ...ahrefsComposioTools,
54:   ...airtableComposioTools,
55:   ...apolloComposioTools,
56:   ...brevoComposioTools,
57:   ...calendlyComposioTools,
58:   ...clickupComposioTools,
59:   ...dataforseoComposioTools,
60:   ...docusignComposioTools,
61:   ...dropboxComposioTools,
62:   ...elevenlabsComposioTools,
63:   ...facebookComposioTools,
64:   ...gmailComposioTools,
65:   ...googleAdsComposioTools,
66:   ...googleAnalyticsComposioTools,
67:   ...googleCalendarComposioTools,
68:   ...googleDocsComposioTools,
69:   ...googleSearchConsoleComposioTools,
70:   ...highlevelComposioTools,
71:   ...hubspotComposioTools,
72:   ...instagramComposioTools,
73:   ...instantlyComposioTools,
74:   ...kitComposioTools,
75:   ...klaviyoComposioTools,
76:   ...lemlistComposioTools,
77:   ...linkedinComposioTools,
78:   ...mailchimpComposioTools,
79:   ...mailerliteComposioTools,
80:   ...motionComposioTools,
81:   ...notionComposioTools,
82:   ...omnisendComposioTools,
83:   ...onedriveComposioTools,
84:   ...outlookComposioTools,
85:   ...phantombusterComposioTools,
86:   ...postizComposioTools,
87:   ...postmarkComposioTools,
88:   ...redditAdsComposioTools,
89:   ...resendComposioTools,
90:   ...salesforceComposioTools,
91:   ...semrushComposioTools,
92:   ...sendgridComposioTools,
93:   ...shopifyComposioTools,
94:   ...snapchatComposioTools,
95:   ...stripeComposioTools,
96:   ...twilioComposioTools,
97:   ...twitterComposioTools,
98:   ...xeroComposioTools,
99:   ...youtubeComposioTools,
100: ];

(End of file - total 100 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.3s)

Now let me check the full worker `handleListTools`/`handleToolCall` and the Env interface to understand KV access:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 51,
  "limit": 100
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
51:   COMPOSIO_TOOLKIT_MAP?: string;
52:   COMPOSIO_AUTH_CONFIG_MAP?: string;
53:   COMPOSIO_TOOLKIT_VERSION_MAP?: string;
54:   TRIGGER_CRON_SECRET?: string;
55:   [key: string]: unknown;
56: }
57: 
58: interface MCPRequest {
59:   jsonrpc: "2.0";
60:   id: string | number;
61:   method: string;
62:   params?: {
63:     name?: string;
64:     arguments?: Record<string, unknown>;
65:     credentials?: Record<string, string>;
66:   };
67: }
68: 
69: interface MCPResponse {
70:   jsonrpc: "2.0";
71:   id: string | number;
72:   result?: unknown;
73:   error?: {
74:     code: number;
75:     message: string;
76:     data?: unknown;
77:   };
78: }
79: 
80: function safeJsonStringify(value: unknown): string {
81:   try {
82:     return JSON.stringify(value);
83:   } catch {
84:     return JSON.stringify({ error: "unserializable_payload" });
85:   }
86: }
87: 
88: function getClawLinkAppUrl(env: Env): string {
89:   const configured =
90:     typeof env.CLAWLINK_APP_URL === "string" && env.CLAWLINK_APP_URL.trim().length > 0
91:       ? env.CLAWLINK_APP_URL.trim()
92:       : "https://claw-link.dev";
93: 
94:   return configured.replace(/\/+$/, "");
95: }
96: 
97: interface WorkerConnectionRow {
98:   id: number;
99:   is_default: number;
100:   auth_state: string;
101:   auth_provider: string | null;
102:   pipedream_account_id: string | null;
103:   composio_connected_account_id: string | null;
104:   updated_at: string | null;
105:   created_at: string;
106: }
107: 
108: function isPipedreamBackedConnection(row: WorkerConnectionRow): boolean {
109:   return row.auth_provider === "pipedream" || Boolean(row.pipedream_account_id);
110: }
111: 
112: function isComposioBackedConnection(row: WorkerConnectionRow): boolean {
113:   return row.auth_provider === "composio" || Boolean(row.composio_connected_account_id);
114: }
115: 
116: async function resolvePreferredPipedreamConnectionId(
117:   env: Env,
118:   userId: string,
119:   integration: string,
120:   preferredConnectionId?: number,
121: ): Promise<number | null> {
122:   if (preferredConnectionId) {
123:     const row = await env.DB
124:       .prepare(
125:         `
126:           SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
127:                  composio_connected_account_id, updated_at, created_at
128:           FROM user_integrations
129:           WHERE id = ? AND user_id = ? AND integration = ?
130:           LIMIT 1
131:         `,
132:       )
133:       .bind(preferredConnectionId, userId, integration)
134:       .first<WorkerConnectionRow>();
135: 
136:     if (!row) {
137:       return null;
138:     }
139: 
140:     return isPipedreamBackedConnection(row) ? row.id : null;
141:   }
142: 
143:   const result = await env.DB
144:     .prepare(
145:       `
146:         SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
147:                composio_connected_account_id, updated_at, created_at
148:         FROM user_integrations
149:         WHERE user_id = ? AND integration = ?
150:         ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC

(Showing lines 51-150 of 682. Use offset=151 to continue.)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 260,
  "limit": 50
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
260:       "User-Agent": "clawlink-trigger-scheduler",
261:     },
262:   });
263: 
264:   if (!response.ok) {
265:     const body = await response.text();
266:     throw new Error(
267:       `Trigger scheduler failed with ${response.status}: ${body.slice(0, 500)}`,
268:     );
269:   }
270: }
271: 
272: /**
273:  * Handle MCP tool call from OpenClaw
274:  */
275: async function handleToolCall(
276:   env: Env,
277:   authSubject: string,
278:   params?: MCPRequest["params"]
279: ): Promise<unknown> {
280:   const { name, arguments: rawArgs = {} } = params || {};
281:   
282:   if (!name) {
283:     throw new Error("Missing tool name");
284:   }
285: 
286:   const internalUserId = await resolveInternalUserId(env.DB, authSubject);
287: 
288:   if (!internalUserId) {
289:     throw new Error("No ClawLink user found for the authenticated account.");
290:   }
291: 
292:   const tool = getRegisteredToolByName(name);
293: 
294:   if (!tool) {
295:     throw new Error(`Unknown tool: ${name}`);
296:   }
297: 
298:   const integration = tool.integration;
299:   const action = tool.name.startsWith(`${integration}_`)
300:     ? tool.name.slice(integration.length + 1)
301:     : tool.name;
302: 
303:   // Get cached credentials or decrypt from request
304:   let credentials: Record<string, string>;
305:   const args = { ...rawArgs };
306:   const rawConnectionId = args.connectionId;
307:   const parsedConnectionId =
308:     typeof rawConnectionId === "number"
309:       ? rawConnectionId

(Showing lines 260-309 of 682. Use offset=310 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 8.2s)

Now I have everything I need. Let me start implementing.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 8.6s)

### Step 1: Modify the import script to strip `inputSchema`

The key changes: the `generateManifestSource` function will no longer include `inputSchema` in each tool. Instead, each tool gets a stub `inputSchema: {}`. The `composioTool()` factory in the generated file will set `inputSchema` to an empty object placeholder.

**Tool: edit**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

ok implement

---

## Assistant (Build · Claude Opus 4.6 · 7.3s)



Let me pick up where I left off. I have all the context from the previous analysis. Let me start implementing.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 4.4s)

Let me re-read the key files I need to modify:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/scripts/import-composio-tools.mjs"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/scripts/import-composio-tools.mjs</path>
<type>file</type>
<content>
1: import { promises as fs } from "node:fs";
2: import path from "node:path";
3: import { fileURLToPath } from "node:url";
4: 
5: const __filename = fileURLToPath(import.meta.url);
6: const __dirname = path.dirname(__filename);
7: const repoRoot = path.resolve(__dirname, "..");
8: const generatedDir = path.join(repoRoot, "src/generated/composio-manifests");
9: const indexPath = path.join(generatedDir, "index.ts");
10: 
11: const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";
12: 
13: // ---------------------------------------------------------------------------
14: // CLI arg parsing
15: // ---------------------------------------------------------------------------
16: 
17: function parseArgs(argv) {
18:   const args = {};
19: 
20:   for (let index = 0; index < argv.length; index += 1) {
21:     const value = argv[index];
22:     if (!value.startsWith("--")) continue;
23: 
24:     const key = value.slice(2);
25:     const next = argv[index + 1];
26: 
27:     if (!next || next.startsWith("--")) {
28:       args[key] = "true";
29:       continue;
30:     }
31: 
32:     args[key] = next;
33:     index += 1;
34:   }
35: 
36:   return args;
37: }
38: 
39: function safeTrim(value) {
40:   return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
41: }
42: 
43: // ---------------------------------------------------------------------------
44: // Env loading
45: // ---------------------------------------------------------------------------
46: 
47: function parseEnvFile(contents) {
48:   const env = {};
49: 
50:   for (const rawLine of contents.split(/\r?\n/u)) {
51:     const line = rawLine.trim();
52:     if (!line || line.startsWith("#")) continue;
53: 
54:     const separator = line.indexOf("=");
55:     if (separator < 0) continue;
56: 
57:     const key = line.slice(0, separator).trim();
58:     const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, "");
59: 
60:     if (key) env[key] = value;
61:   }
62: 
63:   return env;
64: }
65: 
66: async function loadLocalEnv() {
67:   const merged = {};
68:   const candidates = [
69:     path.join(repoRoot, ".env.local"),
70:     path.join(repoRoot, ".env.production"),
71:   ];
72: 
73:   for (const candidate of candidates) {
74:     try {
75:       const contents = await fs.readFile(candidate, "utf8");
76:       Object.assign(merged, parseEnvFile(contents));
77:     } catch (error) {
78:       if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
79:       throw error;
80:     }
81:   }
82: 
83:   return merged;
84: }
85: 
86: function getEnvValue(env, key) {
87:   const processValue = typeof process.env[key] === "string" ? process.env[key].trim() : "";
88:   if (processValue) return processValue;
89: 
90:   const fileValue = typeof env[key] === "string" ? env[key].trim() : "";
91:   return fileValue || undefined;
92: }
93: 
94: // ---------------------------------------------------------------------------
95: // Composio API client
96: // ---------------------------------------------------------------------------
97: 
98: async function fetchComposioTools(apiKey, toolkitSlug, baseUrl) {
99:   const url = new URL(`${baseUrl}/tools`);
100:   url.searchParams.set("toolkit_slug", toolkitSlug);
101:   url.searchParams.set("toolkit_versions", "latest");
102:   url.searchParams.set("limit", "1000");
103:   url.searchParams.set("include_deprecated", "true");
104: 
105:   const response = await fetch(url.toString(), {
106:     headers: {
107:       Accept: "application/json",
108:       "x-api-key": apiKey,
109:     },
110:   });
111: 
112:   if (!response.ok) {
113:     const body = await response.text().catch(() => "");
114:     throw new Error(`Composio API error ${response.status}: ${body}`);
115:   }
116: 
117:   const data = await response.json();
118:   return data;
119: }
120: 
121: // ---------------------------------------------------------------------------
122: // Mode / risk classification
123: // ---------------------------------------------------------------------------
124: 
125: // Composio tags that map directly to mode/risk.
126: const HINT_TAG_READ = "readOnlyHint";
127: const HINT_TAG_CREATE = "createHint";
128: const HINT_TAG_UPDATE = "updateHint";
129: const HINT_TAG_DESTRUCTIVE = "destructiveHint";
130: const HINT_TAG_IDEMPOTENT = "idempotentHint";
131: 
132: // Slug-based fallback patterns when Composio doesn't provide hint tags.
133: const READ_SLUG_PATTERNS = /(?:^|_)(?:GET|LIST|COUNT|CHECK|EXPORT|SEARCH|FIND|ENUM|STATUS|ANALYTICS|STATS|VITALS|OVERVIEW)(?:_|$)/i;
134: const DESTRUCTIVE_SLUG_PATTERNS = /(?:^|_)(?:DELETE|REMOVE)(?:_|$)/i;
135: 
136: function classifyTool(composioTool) {
137:   const tags = new Set(composioTool.tags ?? []);
138:   const slug = composioTool.slug ?? "";
139: 
140:   // Use Composio hint tags first.
141:   // ToolRisk type is "safe" | "confirm" | "high_impact".
142:   if (tags.has(HINT_TAG_DESTRUCTIVE)) {
143:     return { mode: "write", risk: "high_impact" };
144:   }
145: 
146:   if (tags.has(HINT_TAG_READ)) {
147:     return { mode: "read", risk: "safe" };
148:   }
149: 
150:   if (tags.has(HINT_TAG_CREATE) || tags.has(HINT_TAG_UPDATE)) {
151:     return { mode: "write", risk: "confirm" };
152:   }
153: 
154:   // Fallback: slug pattern matching.
155:   if (READ_SLUG_PATTERNS.test(slug)) {
156:     return { mode: "read", risk: "safe" };
157:   }
158: 
159:   if (DESTRUCTIVE_SLUG_PATTERNS.test(slug)) {
160:     return { mode: "write", risk: "high_impact" };
161:   }
162: 
163:   // Default to write/confirm.
164:   return { mode: "write", risk: "confirm" };
165: }
166: 
167: // ---------------------------------------------------------------------------
168: // Input schema conversion
169: // ---------------------------------------------------------------------------
170: 
171: function convertInputSchema(inputParams) {
172:   if (!inputParams || typeof inputParams !== "object") {
173:     return { type: "object", additionalProperties: true, properties: {} };
174:   }
175: 
176:   const properties = {};
177:   const required = [];
178: 
179:   const rawProps = inputParams.properties ?? {};
180: 
181:   for (const [name, prop] of Object.entries(rawProps)) {
182:     const schema = {};
183:     const propType = prop.type;
184: 
185:     if (propType === "array") {
186:       schema.type = "array";
187:       if (prop.items) {
188:         schema.items = simplifySchemaNode(prop.items);
189:       } else {
190:         schema.items = { type: "object", additionalProperties: true };
191:       }
192:     } else if (propType === "object") {
193:       schema.type = "object";
194:       schema.additionalProperties = true;
195:       if (prop.properties) {
196:         schema.properties = {};
197:         for (const [nestedName, nestedProp] of Object.entries(prop.properties)) {
198:           schema.properties[nestedName] = simplifySchemaNode(nestedProp);
199:         }
200:       }
201:     } else if (propType === "integer") {
202:       schema.type = "integer";
203:     } else if (propType === "number") {
204:       schema.type = "number";
205:     } else if (propType === "boolean") {
206:       schema.type = "boolean";
207:     } else {
208:       schema.type = "string";
209:     }
210: 
211:     if (prop.description) {
212:       schema.description = prop.description;
213:     }
214: 
215:     if (prop.enum) {
216:       schema.enum = prop.enum;
217:     }
218: 
219:     properties[name] = schema;
220:   }
221: 
222:   if (Array.isArray(inputParams.required)) {
223:     required.push(...inputParams.required);
224:   }
225: 
226:   const result = {
227:     type: "object",
228:     additionalProperties: true,
229:     properties,
230:   };
231: 
232:   if (required.length > 0) {
233:     result.required = required;
234:   }
235: 
236:   return result;
237: }
238: 
239: function simplifySchemaNode(node) {
240:   if (!node || typeof node !== "object") {
241:     return { type: "string" };
242:   }
243: 
244:   // Handle $ref by treating as flexible object.
245:   if (node.$ref) {
246:     return { type: "object", additionalProperties: true };
247:   }
248: 
249:   const result = {};
250: 
251:   if (node.type === "array") {
252:     result.type = "array";
253:     result.items = node.items ? simplifySchemaNode(node.items) : { type: "object", additionalProperties: true };
254:   } else if (node.type === "object") {
255:     result.type = "object";
256:     result.additionalProperties = true;
257:     if (node.properties) {
258:       result.properties = {};
259:       for (const [k, v] of Object.entries(node.properties)) {
260:         result.properties[k] = simplifySchemaNode(v);
261:       }
262:     }
263:   } else if (node.type) {
264:     result.type = node.type;
265:   } else {
266:     result.type = "string";
267:   }
268: 
269:   if (node.description) result.description = node.description;
270:   if (node.enum) result.enum = node.enum;
271: 
272:   return result;
273: }
274: 
275: // ---------------------------------------------------------------------------
276: // Tool name derivation
277: // ---------------------------------------------------------------------------
278: 
279: function toClawlinkToolName(composioSlug) {
280:   // INSTANTLY_LIST_CAMPAIGNS → instantly_list_campaigns
281:   return composioSlug.toLowerCase();
282: }
283: 
284: function humanizeToolName(composioName) {
285:   // "List Campaigns" stays as-is. Used for askBefore prompts.
286:   return composioName ?? composioName;
287: }
288: 
289: // ---------------------------------------------------------------------------
290: // askBefore generation
291: // ---------------------------------------------------------------------------
292: 
293: function buildAskBefore(mode, risk, humanName) {
294:   if (mode === "read") return [];
295: 
296:   if (risk === "high_impact") {
297:     return [`This action is destructive and cannot be undone. Confirm before executing ${humanName}.`];
298:   }
299: 
300:   return [`Confirm the parameters before executing ${humanName}.`];
301: }
302: 
303: // ---------------------------------------------------------------------------
304: // Tag generation
305: // ---------------------------------------------------------------------------
306: 
307: function buildTags(integration, mode, composioTags) {
308:   const tags = ["composio", integration];
309: 
310:   tags.push(mode === "read" ? "read" : "write");
311: 
312:   // Pull in Composio category tags (the non-hint ones).
313:   for (const tag of composioTags ?? []) {
314:     if (
315:       tag.endsWith("Hint") ||
316:       tag === "important" ||
317:       tag === "deprecated" ||
318:       tag === "openWorldHint"
319:     ) {
320:       continue;
321:     }
322: 
323:     const normalized = tag
324:       .toLowerCase()
325:       .replace(/[^a-z0-9]+/g, "_")
326:       .replace(/^_|_$/g, "");
327: 
328:     if (normalized && !tags.includes(normalized)) {
329:       tags.push(normalized);
330:     }
331:   }
332: 
333:   return tags;
334: }
335: 
336: // ---------------------------------------------------------------------------
337: // TypeScript source renderer
338: // ---------------------------------------------------------------------------
339: 
340: function indent(depth) {
341:   return "  ".repeat(depth);
342: }
343: 
344: function renderValue(value, depth = 0) {
345:   if (value === undefined) return "undefined";
346:   if (value === null) return "null";
347:   if (typeof value === "string") return JSON.stringify(value);
348:   if (typeof value === "number" || typeof value === "boolean") return String(value);
349: 
350:   if (Array.isArray(value)) {
351:     if (value.length === 0) return "[]";
352: 
353:     const items = value
354:       .map((item) => `${indent(depth + 1)}${renderValue(item, depth + 1)}`)
355:       .join(",\n");
356: 
357:     return `[\n${items},\n${indent(depth)}]`;
358:   }
359: 
360:   const entries = Object.entries(value).filter(([, v]) => v !== undefined);
361: 
362:   if (entries.length === 0) return "{}";
363: 
364:   const lines = entries
365:     .map(([key, v]) => {
366:       const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
367:       return `${indent(depth + 1)}${safeKey}: ${renderValue(v, depth + 1)}`;
368:     })
369:     .join(",\n");
370: 
371:   return `{\n${lines},\n${indent(depth)}}`;
372: }
373: 
374: function renderToolCall(tool, depth = 1) {
375:   const obj = {};
376: 
377:   obj.name = tool.name;
378:   obj.description = tool.description;
379:   obj.toolSlug = tool.toolSlug;
380:   obj.mode = tool.mode;
381:   obj.risk = tool.risk;
382: 
383:   if (Object.keys(tool.inputSchema.properties ?? {}).length > 0 || (tool.inputSchema.required ?? []).length > 0) {
384:     obj.inputSchema = tool.inputSchema;
385:   } else {
386:     obj.inputSchema = { type: "object", properties: {} };
387:   }
388: 
389:   if (tool.tags && tool.tags.length > 0) {
390:     obj.tags = tool.tags;
391:   }
392: 
393:   if (tool.askBefore && tool.askBefore.length > 0) {
394:     obj.askBefore = tool.askBefore;
395:   }
396: 
397:   if (tool.idempotent !== undefined && tool.idempotent !== (tool.mode === "read")) {
398:     obj.idempotent = tool.idempotent;
399:   }
400: 
401:   return `${indent(depth)}composioTool(${renderValue(obj, depth)})`;
402: }
403: 
404: // ---------------------------------------------------------------------------
405: // File generation
406: // ---------------------------------------------------------------------------
407: 
408: function sanitizeFileSlug(value) {
409:   return value.replace(/[^a-z0-9-]+/giu, "-").replace(/^-+|-+$/gu, "");
410: }
411: 
412: function toPascalCase(value) {
413:   return value
414:     .split(/[^a-z0-9]+/iu)
415:     .filter(Boolean)
416:     .map((token) => token[0].toUpperCase() + token.slice(1))
417:     .join("");
418: }
419: 
420: function toCamelCase(value) {
421:   const pascal = toPascalCase(value);
422:   return pascal[0].toLowerCase() + pascal.slice(1);
423: }
424: 
425: function generateManifestSource(integration, composioToolkit, version, tools) {
426:   const exportName = `${toCamelCase(integration)}ComposioTools`;
427: 
428:   const toolEntries = tools
429:     .map((tool) => renderToolCall(tool, 1))
430:     .join(",\n");
431: 
432:   return `import type { IntegrationTool } from "../../../worker/integrations/base";
433: 
434: function composioTool(
435:   partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
436:     accessLevel?: IntegrationTool["accessLevel"];
437:     tags?: string[];
438:     whenToUse?: string[];
439:     askBefore?: string[];
440:     safeDefaults?: Record<string, unknown>;
441:     examples?: IntegrationTool["examples"];
442:     requiresScopes?: string[];
443:     idempotent?: boolean;
444:     supportsDryRun?: boolean;
445:     supportsBatch?: boolean;
446:     toolSlug: string;
447:   },
448: ): IntegrationTool {
449:   return {
450:     integration: ${JSON.stringify(integration)},
451:     name: partial.name,
452:     description: partial.description,
453:     inputSchema: partial.inputSchema,
454:     outputSchema: partial.outputSchema,
455:     accessLevel: partial.accessLevel ?? partial.mode,
456:     mode: partial.mode,
457:     risk: partial.risk,
458:     tags: partial.tags ?? [],
459:     whenToUse: partial.whenToUse ?? [],
460:     askBefore: partial.askBefore ?? [],
461:     safeDefaults: partial.safeDefaults ?? {},
462:     examples: partial.examples ?? [],
463:     followups: [],
464:     requiresScopes: partial.requiresScopes ?? [],
465:     idempotent: partial.idempotent ?? partial.mode === "read",
466:     supportsDryRun: partial.supportsDryRun ?? false,
467:     supportsBatch: partial.supportsBatch ?? false,
468:     execution: {
469:       kind: "composio_tool",
470:       toolkit: ${JSON.stringify(composioToolkit)},
471:       toolSlug: partial.toolSlug,
472:       version: ${JSON.stringify(version)},
473:     },
474:   };
475: }
476: 
477: export const ${exportName}: IntegrationTool[] = [
478: ${toolEntries},
479: ];
480: `;
481: }
482: 
483: async function writeManifestFile(integration, composioToolkit, version, tools) {
484:   await fs.mkdir(generatedDir, { recursive: true });
485: 
486:   const fileSlug = sanitizeFileSlug(integration);
487:   const filePath = path.join(generatedDir, `${fileSlug}.generated.ts`);
488:   const source = generateManifestSource(integration, composioToolkit, version, tools);
489: 
490:   await fs.writeFile(filePath, source, "utf8");
491: 
492:   return { filePath, fileSlug };
493: }
494: 
495: async function rewriteIndex() {
496:   await fs.mkdir(generatedDir, { recursive: true });
497: 
498:   const files = (await fs.readdir(generatedDir))
499:     .filter((file) => file.endsWith(".generated.ts"))
500:     .sort((left, right) => left.localeCompare(right));
501: 
502:   const imports = [];
503:   const spreadEntries = [];
504: 
505:   for (const file of files) {
506:     const fileSlug = file.replace(/\.generated\.ts$/u, "");
507:     const exportName = `${toCamelCase(fileSlug)}ComposioTools`;
508:     imports.push(`import { ${exportName} } from "./${fileSlug}.generated";`);
509:     spreadEntries.push(`  ...${exportName},`);
510:   }
511: 
512:   const source = `import type { IntegrationTool } from "../../../worker/integrations/base";
513: ${imports.length > 0 ? `${imports.join("\n")}\n` : ""}
514: export const composioToolManifests: IntegrationTool[] = [
515: ${spreadEntries.join("\n")}
516: ];
517: `;
518: 
519:   await fs.writeFile(indexPath, source, "utf8");
520: }
521: 
522: // ---------------------------------------------------------------------------
523: // Main
524: // ---------------------------------------------------------------------------
525: 
526: async function main() {
527:   const args = parseArgs(process.argv.slice(2));
528:   const toolkit = safeTrim(args.toolkit);
529:   const integration = safeTrim(args.integration) ?? toolkit;
530:   const dryRun = args["dry-run"] === "true";
531: 
532:   if (!toolkit) {
533:     console.error(
534:       "Usage: node scripts/import-composio-tools.mjs --toolkit <composio_toolkit_slug> [--integration <clawlink_slug>] [--dry-run]",
535:     );
536:     console.error("");
537:     console.error("Examples:");
538:     console.error("  node scripts/import-composio-tools.mjs --toolkit instantly --integration instantly");
539:     console.error("  node scripts/import-composio-tools.mjs --toolkit gmail --integration gmail");
540:     console.error("  node scripts/import-composio-tools.mjs --toolkit clickup --integration clickup --dry-run");
541:     process.exitCode = 1;
542:     return;
543:   }
544: 
545:   const env = await loadLocalEnv();
546:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
547: 
548:   if (!apiKey) {
549:     throw new Error("COMPOSIO_API_KEY is not set. Add it to .env.local or set it as an env var.");
550:   }
551: 
552:   const baseUrl = getEnvValue(env, "COMPOSIO_BASE_URL") ?? DEFAULT_BASE_URL;
553: 
554:   console.log(`Fetching tools for toolkit "${toolkit}" from Composio...`);
555:   const response = await fetchComposioTools(apiKey, toolkit, baseUrl);
556: 
557:   const totalItems = response.total_items ?? response.items?.length ?? 0;
558:   console.log(`Composio returned ${totalItems} tools.`);
559: 
560:   if (!response.items || response.items.length === 0) {
561:     throw new Error(`No tools found for toolkit "${toolkit}". Check the toolkit slug.`);
562:   }
563: 
564:   // Determine version from the first tool.
565:   const toolkitVersion = response.items[0]?.version ?? "latest";
566:   const composioToolkitSlug = response.items[0]?.toolkit?.slug ?? toolkit;
567:   console.log(`Toolkit version: ${toolkitVersion}`);
568:   console.log(`Composio toolkit slug: ${composioToolkitSlug}`);
569: 
570:   // Filter out deprecated tools.
571:   const activeTools = response.items.filter((item) => !item.is_deprecated);
572:   const deprecatedCount = response.items.length - activeTools.length;
573: 
574:   if (deprecatedCount > 0) {
575:     const deprecatedSlugs = response.items
576:       .filter((item) => item.is_deprecated)
577:       .map((item) => item.slug);
578:     console.log(`Skipping ${deprecatedCount} deprecated tool(s): ${deprecatedSlugs.join(", ")}`);
579:   }
580: 
581:   // Build manifest entries.
582:   const tools = activeTools
583:     .map((item) => {
584:       const { mode, risk } = classifyTool(item);
585:       const name = toClawlinkToolName(item.slug);
586:       const tags = buildTags(integration, mode, item.tags);
587:       const humanName = humanizeToolName(item.name);
588:       const askBefore = buildAskBefore(mode, risk, humanName);
589:       const inputSchema = convertInputSchema(item.input_parameters);
590:       const idempotent = (item.tags ?? []).includes(HINT_TAG_IDEMPOTENT) ? true : undefined;
591: 
592:       return {
593:         name,
594:         description: item.description,
595:         toolSlug: item.slug,
596:         mode,
597:         risk,
598:         tags,
599:         askBefore,
600:         inputSchema,
601:         idempotent,
602:       };
603:     })
604:     .sort((a, b) => a.name.localeCompare(b.name));
605: 
606:   // Stats.
607:   const readCount = tools.filter((t) => t.mode === "read").length;
608:   const writeConfirmCount = tools.filter((t) => t.mode === "write" && t.risk === "confirm").length;
609:   const writeDangerousCount = tools.filter((t) => t.mode === "write" && t.risk === "high_impact").length;
610: 
611:   console.log(`\nTool breakdown for ${integration}:`);
612:   console.log(`  Read (safe):         ${readCount}`);
613:   console.log(`  Write (confirm):     ${writeConfirmCount}`);
614:   console.log(`  Write (high_impact): ${writeDangerousCount}`);
615:   console.log(`  Total:             ${tools.length}`);
616: 
617:   if (dryRun) {
618:     console.log("\n[Dry run] Would generate the following tools:");
619:     for (const tool of tools) {
620:       const riskLabel = tool.risk === "high_impact" ? " ⚠️" : tool.risk === "confirm" ? " ✏️" : "";
621:       console.log(`  ${tool.mode.padEnd(5)} ${tool.name}${riskLabel}`);
622:     }
623:     console.log(`\n[Dry run] No files written.`);
624:     return;
625:   }
626: 
627:   // Write manifest file.
628:   const { filePath } = await writeManifestFile(integration, composioToolkitSlug, toolkitVersion, tools);
629:   console.log(`\nWrote ${tools.length} tools to ${path.relative(repoRoot, filePath)}`);
630: 
631:   // Update barrel index.
632:   await rewriteIndex();
633:   console.log(`Updated ${path.relative(repoRoot, indexPath)}`);
634: 
635:   console.log(`\nDone. Imported ${tools.length} Composio tools for ${integration}.`);
636: }
637: 
638: main().catch((error) => {
639:   console.error(error instanceof Error ? error.message : error);
640:   process.exitCode = 1;
641: });

(End of file - total 641 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/backend-client.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/composio/backend-client.ts</path>
<type>file</type>
<content>
1: import { IntegrationRequestError } from "../../../worker/integrations/base";
2: 
3: const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";
4: const DEFAULT_INSTANTLY_TOOLKIT_VERSION = "20260429_00";
5: 
6: export interface ComposioConfig {
7:   apiKey: string;
8:   baseUrl: string;
9:   toolkit: string;
10:   authConfigId: string;
11:   toolkitVersion?: string;
12: }
13: 
14: export interface CreateComposioConnectLinkParams {
15:   env?: Record<string, unknown>;
16:   integrationSlug: string;
17:   userId: string;
18:   callbackUrl: string;
19:   alias?: string | null;
20: }
21: 
22: export interface ComposioConnectLink {
23:   linkToken: string | null;
24:   redirectUrl: string;
25:   expiresAt: string | null;
26:   connectedAccountId: string;
27: }
28: 
29: export interface ComposioConnectedAccountMetadata {
30:   connectedAccountId: string;
31:   authConfigId: string;
32:   toolkit: string;
33:   connectionLabel: string | null;
34:   accountLabel: string | null;
35:   externalAccountId: string;
36: }
37: 
38: export interface ComposioConnectedAccountDetails extends ComposioConnectedAccountMetadata {
39:   status: string | null;
40:   statusReason: string | null;
41: }
42: 
43: interface ComposioConnectedAccountResponse {
44:   id?: unknown;
45:   nanoid?: unknown;
46:   word_id?: unknown;
47:   alias?: unknown;
48:   user_id?: unknown;
49:   status?: unknown;
50:   status_reason?: unknown;
51:   toolkit?: {
52:     slug?: unknown;
53:   };
54:   auth_config?: {
55:     id?: unknown;
56:   };
57:   state?: {
58:     val?: Record<string, unknown>;
59:   };
60:   data?: Record<string, unknown>;
61:   params?: Record<string, unknown>;
62: }
63: 
64: export interface ExecuteComposioToolParams {
65:   env?: Record<string, unknown>;
66:   toolSlug: string;
67:   toolkit: string;
68:   version?: string;
69:   userId: string;
70:   connectedAccountId: string;
71:   arguments: Record<string, unknown>;
72: }
73: 
74: export interface ExecuteComposioToolResult {
75:   data: unknown;
76:   providerRequestId?: string;
77: }
78: 
79: function safeTrim(value: unknown): string | null {
80:   return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
81: }
82: 
83: function sleep(ms: number): Promise<void> {
84:   return new Promise((resolve) => setTimeout(resolve, ms));
85: }
86: 
87: function humanizeSlug(slug: string): string {
88:   return slug
89:     .split(/[-_]+/)
90:     .filter(Boolean)
91:     .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
92:     .join(" ");
93: }
94: 
95: function readNestedAccountString(
96:   account: ComposioConnectedAccountResponse,
97:   key: string,
98: ): string | null {
99:   return (
100:     safeTrim(account.data?.[key]) ??
101:     safeTrim(account.params?.[key]) ??
102:     safeTrim(account.state?.val?.[key]) ??
103:     null
104:   );
105: }
106: 
107: function normalizeBaseUrl(value: unknown): string {
108:   return (safeTrim(value) ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
109: }
110: 
111: function parseMap(value: unknown): Map<string, string> {
112:   const map = new Map<string, string>();
113:   const raw = safeTrim(value);
114: 
115:   if (!raw) {
116:     return map;
117:   }
118: 
119:   for (const pair of raw.split(",")) {
120:     const [key, ...rest] = pair.split("=");
121:     const normalizedKey = key?.trim();
122:     const normalizedValue = rest.join("=").trim();
123: 
124:     if (normalizedKey && normalizedValue) {
125:       map.set(normalizedKey, normalizedValue);
126:     }
127:   }
128: 
129:   return map;
130: }
131: 
132: function getEnvValue(env: Record<string, unknown> | undefined, key: string): string | null {
133:   return safeTrim(env?.[key]) ?? safeTrim(process.env[key]);
134: }
135: 
136: function getSlugEnvKey(prefix: string, slug: string, suffix: string): string {
137:   return `${prefix}_${slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}_${suffix}`;
138: }
139: 
140: export function getComposioConfig(
141:   env: Record<string, unknown> | undefined,
142:   integrationSlug: string,
143: ): ComposioConfig {
144:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
145: 
146:   if (!apiKey) {
147:     throw new Error("COMPOSIO_API_KEY is not configured.");
148:   }
149: 
150:   const toolkitMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_MAP"));
151:   const authConfigMap = parseMap(getEnvValue(env, "COMPOSIO_AUTH_CONFIG_MAP"));
152:   const versionMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_VERSION_MAP"));
153:   const authConfigId =
154:     authConfigMap.get(integrationSlug) ??
155:     getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "AUTH_CONFIG_ID"));
156:   const toolkit =
157:     toolkitMap.get(integrationSlug) ??
158:     getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT")) ??
159:     integrationSlug.replace(/-/g, "_");
160: 
161:   if (!authConfigId) {
162:     throw new Error(`Composio auth config is not configured for ${integrationSlug}.`);
163:   }
164: 
165:   return {
166:     apiKey,
167:     baseUrl: normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL")),
168:     toolkit,
169:     authConfigId,
170:     toolkitVersion:
171:       versionMap.get(integrationSlug) ??
172:       getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT_VERSION")) ??
173:       (integrationSlug === "instantly" ? DEFAULT_INSTANTLY_TOOLKIT_VERSION : undefined),
174:   };
175: }
176: 
177: function stringifyComposioError(payload: unknown, fallback: string): string {
178:   if (!payload || typeof payload !== "object") {
179:     return fallback;
180:   }
181: 
182:   const error = (payload as { error?: unknown }).error;
183: 
184:   if (error && typeof error === "object") {
185:     const message = (error as { message?: unknown }).message;
186:     const suggestedFix = (error as { suggested_fix?: unknown }).suggested_fix;
187: 
188:     if (typeof message === "string" && message.trim()) {
189:       return typeof suggestedFix === "string" && suggestedFix.trim()
190:         ? `${message.trim()} ${suggestedFix.trim()}`
191:         : message.trim();
192:     }
193:   }
194: 
195:   const message = (payload as { message?: unknown }).message;
196:   if (typeof message === "string" && message.trim()) {
197:     return message.trim();
198:   }
199: 
200:   try {
201:     return JSON.stringify(payload);
202:   } catch {
203:     return fallback;
204:   }
205: }
206: 
207: async function composioFetch<T>(
208:   config: Pick<ComposioConfig, "apiKey" | "baseUrl">,
209:   path: string,
210:   init: RequestInit,
211: ): Promise<{ data: T; headers: Headers }> {
212:   const response = await fetch(`${config.baseUrl}${path}`, {
213:     ...init,
214:     headers: {
215:       Accept: "application/json",
216:       "Content-Type": "application/json",
217:       "x-api-key": config.apiKey,
218:       ...init.headers,
219:     },
220:   });
221:   const payload = (await response.json().catch(() => null)) as T;
222: 
223:   if (!response.ok) {
224:     throw new IntegrationRequestError(
225:       stringifyComposioError(payload, `${response.status} ${response.statusText}`),
226:       {
227:         status: response.status,
228:       },
229:     );
230:   }
231: 
232:   return { data: payload, headers: response.headers };
233: }
234: 
235: export async function createComposioConnectLink(
236:   params: CreateComposioConnectLinkParams,
237: ): Promise<ComposioConnectLink> {
238:   const config = getComposioConfig(params.env, params.integrationSlug);
239:   const response = await composioFetch<{
240:     link_token?: unknown;
241:     linkToken?: unknown;
242:     redirect_url?: unknown;
243:     redirectUrl?: unknown;
244:     expires_at?: unknown;
245:     expiresAt?: unknown;
246:     connected_account_id?: unknown;
247:     connectedAccountId?: unknown;
248:   }>(config, "/connected_accounts/link", {
249:     method: "POST",
250:     body: JSON.stringify({
251:       auth_config_id: config.authConfigId,
252:       user_id: params.userId,
253:       alias: params.alias ?? undefined,
254:       callback_url: params.callbackUrl,
255:     }),
256:   });
257: 
258:   const redirectUrl =
259:     safeTrim(response.data.redirect_url) ?? safeTrim(response.data.redirectUrl);
260:   const connectedAccountId =
261:     safeTrim(response.data.connected_account_id) ??
262:     safeTrim(response.data.connectedAccountId);
263: 
264:   if (!redirectUrl) {
265:     throw new Error("Composio did not return a setup URL.");
266:   }
267: 
268:   if (!connectedAccountId) {
269:     throw new Error("Composio did not return a connected account id.");
270:   }
271: 
272:   return {
273:     linkToken: safeTrim(response.data.link_token) ?? safeTrim(response.data.linkToken),
274:     redirectUrl,
275:     expiresAt: safeTrim(response.data.expires_at) ?? safeTrim(response.data.expiresAt),
276:     connectedAccountId,
277:   };
278: }
279: 
280: export async function getComposioConnectedAccountDetails(params: {
281:   env?: Record<string, unknown>;
282:   integrationSlug: string;
283:   connectedAccountId: string;
284:   expectedUserId?: string | null;
285: }): Promise<ComposioConnectedAccountDetails> {
286:   const config = getComposioConfig(params.env, params.integrationSlug);
287:   const response = await composioFetch<ComposioConnectedAccountResponse>(
288:     config,
289:     `/connected_accounts/${encodeURIComponent(params.connectedAccountId)}`,
290:     { method: "GET" },
291:   );
292:   const connectedAccountId =
293:     safeTrim(response.data.id) ??
294:     safeTrim(response.data.nanoid) ??
295:     params.connectedAccountId;
296:   const userId = safeTrim(response.data.user_id);
297: 
298:   if (params.expectedUserId && userId && userId !== params.expectedUserId) {
299:     throw new Error("Composio returned a connected account for a different user.");
300:   }
301: 
302:   const authConfigId = safeTrim(response.data.auth_config?.id) ?? config.authConfigId;
303:   const toolkit = safeTrim(response.data.toolkit?.slug) ?? config.toolkit;
304:   const fallbackLabel = `${humanizeSlug(params.integrationSlug)} account`;
305:   const accountLabel =
306:     readNestedAccountString(response.data, "account_label") ??
307:     readNestedAccountString(response.data, "workspace_name") ??
308:     readNestedAccountString(response.data, "account_name") ??
309:     readNestedAccountString(response.data, "email") ??
310:     fallbackLabel;
311:   const externalAccountId =
312:     readNestedAccountString(response.data, "external_account_id") ??
313:     readNestedAccountString(response.data, "account_id") ??
314:     connectedAccountId;
315: 
316:   return {
317:     connectedAccountId,
318:     authConfigId,
319:     toolkit,
320:     connectionLabel: accountLabel,
321:     accountLabel,
322:     externalAccountId,
323:     status: safeTrim(response.data.status),
324:     statusReason: safeTrim(response.data.status_reason),
325:   };
326: }
327: 
328: export async function waitForComposioConnectedAccountActive(params: {
329:   env?: Record<string, unknown>;
330:   integrationSlug: string;
331:   connectedAccountId: string;
332:   expectedUserId?: string | null;
333:   timeoutMs?: number;
334:   intervalMs?: number;
335: }): Promise<ComposioConnectedAccountMetadata> {
336:   const timeoutMs = params.timeoutMs ?? 10_000;
337:   const intervalMs = params.intervalMs ?? 750;
338:   const deadline = Date.now() + timeoutMs;
339:   let latest: ComposioConnectedAccountDetails | null = null;
340: 
341:   do {
342:     latest = await getComposioConnectedAccountDetails(params);
343:     const normalizedStatus = latest.status?.toUpperCase() ?? null;
344: 
345:     if (!normalizedStatus || normalizedStatus === "ACTIVE") {
346:       return latest;
347:     }
348: 
349:     if (
350:       normalizedStatus === "FAILED" ||
351:       normalizedStatus === "EXPIRED" ||
352:       normalizedStatus === "INACTIVE"
353:     ) {
354:       throw new Error(
355:         latest.statusReason ??
356:           `Composio connection is ${normalizedStatus.toLowerCase()}.`,
357:       );
358:     }
359: 
360:     await sleep(intervalMs);
361:   } while (Date.now() < deadline);
362: 
363:   throw new Error(
364:     latest?.status
365:       ? `Composio connection is still ${latest.status.toLowerCase()}.`
366:       : "Composio connection is not ready yet.",
367:   );
368: }
369: 
370: export async function deleteComposioConnectedAccount(
371:   connectedAccountId: string,
372:   env?: Record<string, unknown>,
373: ): Promise<void> {
374:   const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
375:   const baseUrl = normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL"));
376: 
377:   if (!apiKey) {
378:     return;
379:   }
380: 
381:   await composioFetch<unknown>(
382:     { apiKey, baseUrl },
383:     `/connected_accounts/${encodeURIComponent(connectedAccountId)}`,
384:     { method: "DELETE" },
385:   );
386: }
387: 
388: export async function executeComposioToolRequest(
389:   params: ExecuteComposioToolParams,
390: ): Promise<ExecuteComposioToolResult> {
391:   const config = getComposioConfig(params.env, params.toolkit.replace(/_/g, "-"));
392:   const response = await composioFetch<{
393:     data?: unknown;
394:     error?: unknown;
395:     successful?: boolean;
396:     log_id?: string;
397:   }>(
398:     config,
399:     `/tools/execute/${encodeURIComponent(params.toolSlug)}`,
400:     {
401:       method: "POST",
402:       body: JSON.stringify({
403:         connected_account_id: params.connectedAccountId,
404:         user_id: params.userId,
405:         version: params.version ?? config.toolkitVersion,
406:         arguments: params.arguments,
407:       }),
408:     },
409:   );
410: 
411:   if (response.data.successful === false) {
412:     throw new IntegrationRequestError(
413:       stringifyComposioError(response.data.error, `${params.toolSlug} failed in Composio.`),
414:       {
415:         status: 502,
416:       },
417:     );
418:   }
419: 
420:   return {
421:     data: response.data.data ?? response.data,
422:     providerRequestId:
423:       safeTrim(response.data.log_id) ??
424:       safeTrim(response.headers.get("x-request-id")) ??
425:       undefined,
426:   };
427: }

(End of file - total 427 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/manifest-registry.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/composio/manifest-registry.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: import { composioToolManifests } from "@/generated/composio-manifests";
3: 
4: let cachedTools: IntegrationTool[] | null = null;
5: let cachedByName: Map<string, IntegrationTool> | null = null;
6: 
7: function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
8:   const tools = composioToolManifests
9:     .map((tool) => tool)
10:     .sort((left, right) => left.name.localeCompare(right.name));
11: 
12:   return {
13:     tools,
14:     byName: new Map(tools.map((tool) => [tool.name, tool])),
15:   };
16: }
17: 
18: function ensureCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
19:   if (cachedTools && cachedByName) {
20:     return {
21:       tools: cachedTools,
22:       byName: cachedByName,
23:     };
24:   }
25: 
26:   const built = buildCache();
27:   cachedTools = built.tools;
28:   cachedByName = built.byName;
29:   return built;
30: }
31: 
32: export function getAllComposioManifestTools(): IntegrationTool[] {
33:   return ensureCache().tools;
34: }
35: 
36: export function getComposioManifestToolByName(toolName: string): IntegrationTool | null {
37:   return ensureCache().byName.get(toolName) ?? null;
38: }
39: 
40: export function listComposioManifestToolsForIntegration(
41:   integration: string,
42: ): IntegrationTool[] {
43:   return getAllComposioManifestTools().filter((tool) => tool.integration === integration);
44: }

(End of file - total 44 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 5.1s)

Now let me also read the worker index.ts fully (the `handleListTools` and main request handler area) and the tool-registry.ts to understand the full picture:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 560
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
560:       providerRequestId,
561:     });
562: 
563:     throw error;
564:   }
565: }
566: 
567: /**
568:  * Handle MCP list_tools request
569:  */
570: function handleListTools(): IntegrationTool[] {
571:   return getAllRegisteredTools();
572: }
573: 
574: export default {
575:   async fetch(request: Request, env: Env): Promise<Response> {
576:     // Handle CORS
577:     const origin = request.headers.get("Origin") || "https://claw-link.dev";
578:     const corsHeaders = {
579:       "Access-Control-Allow-Origin": origin,
580:       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
581:       "Access-Control-Allow-Headers": "Content-Type, Authorization",
582:       "Access-Control-Allow-Credentials": "true",
583:     };
584: 
585:     if (request.method === "OPTIONS") {
586:       return new Response(null, { headers: corsHeaders });
587:     }
588: 
589:     // Only accept JSON-RPC POST
590:     if (request.method !== "POST") {
591:       return new Response(JSON.stringify({
592:         jsonrpc: "2.0",
593:         id: 0,
594:         error: { code: -32600, message: "Method not allowed" }
595:       }), {
596:         status: 405,
597:         headers: { "Content-Type": "application/json" }
598:       });
599:     }
600: 
601:     try {
602:       // Verify authentication
603:       const authHeader = request.headers.get("Authorization");
604:       const userId = await verifyAuth(authHeader, env as { CLERK_PUBLISHABLE_KEY?: string; CLERK_JWT_KEY?: string });
605:       
606:       if (!userId) {
607:         return new Response(JSON.stringify({
608:           jsonrpc: "2.0",
609:           id: 0,
610:           error: { code: -32001, message: "Unauthorized" }
611:         }), {
612:           status: 401,
613:           headers: { "Content-Type": "application/json" }
614:         });
615:       }
616: 
617:       // Parse MCP request
618:       const mcpRequest: MCPRequest = await request.json();
619:       
620:       let result: unknown;
621:       
622:       switch (mcpRequest.method) {
623:         case "tools/list":
624:           result = { tools: handleListTools() };
625:           break;
626:           
627:         case "tools/call":
628:           result = await handleToolCall(
629:             env,
630:             userId,
631:             mcpRequest.params
632:           );
633:           break;
634:           
635:         default:
636:           throw new Error(`Unknown method: ${mcpRequest.method}`);
637:       }
638: 
639:       const response: MCPResponse = {
640:         jsonrpc: "2.0",
641:         id: mcpRequest.id,
642:         result
643:       };
644: 
645:       return new Response(JSON.stringify(response), {
646:         headers: {
647:           "Content-Type": "application/json",
648:           "Access-Control-Allow-Origin": origin,
649:             "Access-Control-Allow-Credentials": "true"
650:         }
651:       });
652: 
653:     } catch (error) {
654:       console.error("Worker error:", error);
655:       
656:       const response: MCPResponse = {
657:         jsonrpc: "2.0",
658:         id: 0,
659:         error: {
660:           code: -32000,
661:           message: error instanceof Error ? error.message : "Internal error"
662:         }
663:       };
664: 
665:       return new Response(JSON.stringify(response), {
666:         status: 500,
667:         headers: {
668:           "Content-Type": "application/json",
669:           "Access-Control-Allow-Origin": origin,
670:             "Access-Control-Allow-Credentials": "true"
671:         }
672:       });
673:     }
674:   },
675:   async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
676:     ctx.waitUntil(
677:       runScheduledTriggerWork(env).catch((error) => {
678:         console.error("Scheduled trigger run failed:", error);
679:       }),
680:     );
681:   },
682: } satisfies ExportedHandler<Env>;

(End of file - total 682 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/server/tool-registry.ts</path>
<type>file</type>
<content>
1: import "server-only";
2: 
3: import { getIntegrationBySlug } from "@/data/integrations";
4: import {
5:   getDatabase,
6:   listIntegrationConnectionsForUserId,
7:   type IntegrationConnectionRecord,
8: } from "@/lib/server/integration-store";
9: import {
10:   getAllRegisteredTools,
11:   listComposioToolsForIntegration,
12:   listHandlerToolsForIntegration,
13:   listPipedreamToolsForIntegration,
14:   type IntegrationTool,
15:   type IntegrationToolExample,
16:   type ToolAccessLevel,
17: } from "../../../worker/integrations";
18: import { summarizeToolPolicy } from "@/lib/server/policy";
19: import type { ToolMode, ToolRisk } from "@/lib/runtime/tool-runtime";
20: 
21: export interface ToolConnectionSummary {
22:   id: number;
23:   connectionLabel: string | null;
24:   accountLabel: string | null;
25:   isDefault: boolean;
26:   authState: IntegrationConnectionRecord["authState"];
27:   authError: string | null;
28:   expiresAt: string | null;
29:   lastUsedAt: string | null;
30:   lastSuccessAt: string | null;
31:   lastErrorAt: string | null;
32:   lastErrorCode: string | null;
33:   lastErrorMessage: string | null;
34:   scopeSnapshot: string[] | null;
35:   capabilities: string[] | null;
36: }
37: 
38: export interface ToolCatalogItem {
39:   integration: string;
40:   integrationName: string;
41:   name: string;
42:   description: string;
43:   inputSchema: Record<string, unknown>;
44:   outputSchema?: Record<string, unknown>;
45:   accessLevel: ToolAccessLevel;
46:   mode: ToolMode;
47:   risk: ToolRisk;
48:   tags: string[];
49:   guidanceAvailable: boolean;
50:   requiresConfirmation: boolean;
51:   policyReason?: string;
52:   previewAvailable: boolean;
53:   defaultConnectionId: number | null;
54:   connectionCount: number;
55:   connections: ToolConnectionSummary[];
56:   requiresScopes: string[];
57:   idempotent: boolean;
58:   supportsDryRun: boolean;
59:   supportsBatch: boolean;
60:   maxBatchSize?: number;
61:   recommendedTimeoutMs?: number;
62: }
63: 
64: export interface ToolDescription extends ToolCatalogItem {
65:   whenToUse: string[];
66:   askBefore: string[];
67:   safeDefaults: Record<string, unknown>;
68:   examples: IntegrationToolExample[];
69:   followups: string[];
70: }
71: 
72: export interface ToolRegistryEntry {
73:   tool: IntegrationTool;
74:   connections: IntegrationConnectionRecord[];
75: }
76: 
77: export function mapConnectionSummary(connection: IntegrationConnectionRecord): ToolConnectionSummary {
78:   return {
79:     id: connection.id,
80:     connectionLabel: connection.connectionLabel,
81:     accountLabel: connection.accountLabel,
82:     isDefault: connection.isDefault,
83:     authState: connection.authState,
84:     authError: connection.authError,
85:     expiresAt: connection.expiresAt,
86:     lastUsedAt: connection.lastUsedAt,
87:     lastSuccessAt: connection.lastSuccessAt,
88:     lastErrorAt: connection.lastErrorAt,
89:     lastErrorCode: connection.lastErrorCode,
90:     lastErrorMessage: connection.lastErrorMessage,
91:     scopeSnapshot: connection.scopeSnapshot,
92:     capabilities: connection.capabilities,
93:   };
94: }
95: 
96: function hasGuidance(tool: IntegrationTool): boolean {
97:   return (
98:     tool.whenToUse.length > 0 ||
99:     tool.askBefore.length > 0 ||
100:     tool.examples.length > 0 ||
101:     tool.followups.length > 0 ||
102:     Object.keys(tool.safeDefaults).length > 0
103:   );
104: }
105: 
106: function isPipedreamBackedConnection(connection: IntegrationConnectionRecord): boolean {
107:   return connection.authBackend === "pipedream" && Boolean(connection.pipedreamAccountId);
108: }
109: 
110: function isComposioBackedConnection(connection: IntegrationConnectionRecord): boolean {
111:   return connection.authBackend === "composio" && Boolean(connection.composioConnectedAccountId);
112: }
113: 
114: export function buildCatalogItem(
115:   tool: IntegrationTool,
116:   connections: IntegrationConnectionRecord[],
117: ): ToolCatalogItem {
118:   const integrationMeta = getIntegrationBySlug(tool.integration);
119:   const policy = summarizeToolPolicy(tool);
120: 
121:   return {
122:     integration: tool.integration,
123:     integrationName: integrationMeta?.name ?? tool.integration,
124:     name: tool.name,
125:     description: tool.description,
126:     inputSchema: tool.inputSchema,
127:     outputSchema: tool.outputSchema,
128:     accessLevel: tool.accessLevel,
129:     mode: tool.mode,
130:     risk: tool.risk,
131:     tags: tool.tags,
132:     guidanceAvailable: hasGuidance(tool),
133:     requiresConfirmation: policy.requiresConfirmation,
134:     policyReason: policy.reason,
135:     previewAvailable: policy.previewAvailable,
136:     defaultConnectionId: connections.find((connection) => connection.isDefault)?.id ?? null,
137:     connectionCount: connections.length,
138:     connections: connections.map(mapConnectionSummary),
139:     requiresScopes: tool.requiresScopes,
140:     idempotent: tool.idempotent,
141:     supportsDryRun: tool.supportsDryRun,
142:     supportsBatch: tool.supportsBatch,
143:     maxBatchSize: tool.maxBatchSize,
144:     recommendedTimeoutMs: tool.recommendedTimeoutMs,
145:   };
146: }
147: 
148: export function buildToolDescription(
149:   tool: IntegrationTool,
150:   connections: IntegrationConnectionRecord[],
151: ): ToolDescription {
152:   return {
153:     ...buildCatalogItem(tool, connections),
154:     whenToUse: tool.whenToUse,
155:     askBefore: tool.askBefore,
156:     safeDefaults: tool.safeDefaults,
157:     examples: tool.examples,
158:     followups: tool.followups,
159:   };
160: }
161: 
162: function normalizeSearchText(value: string): string {
163:   return value.trim().toLowerCase();
164: }
165: 
166: function getAllRegisteredToolEntries(): ToolRegistryEntry[] {
167:   return getAllRegisteredTools()
168:     .map((tool) => ({ tool, connections: [] }))
169:     .sort((left, right) => left.tool.name.localeCompare(right.tool.name));
170: }
171: 
172: function scoreTool(tool: IntegrationTool, query: string, integration?: string): number {
173:   const normalizedQuery = normalizeSearchText(query);
174: 
175:   if (!normalizedQuery) {
176:     return 0;
177:   }
178: 
179:   const searchable = [
180:     tool.name,
181:     tool.integration,
182:     tool.description,
183:     ...tool.tags,
184:     ...tool.whenToUse,
185:   ]
186:     .join(" ")
187:     .toLowerCase();
188: 
189:   let score = 0;
190: 
191:   if (tool.name.toLowerCase() === normalizedQuery) {
192:     score += 100;
193:   } else if (tool.name.toLowerCase().includes(normalizedQuery)) {
194:     score += 60;
195:   }
196: 
197:   if (searchable.includes(normalizedQuery)) {
198:     score += 20;
199:   }
200: 
201:   if (integration && tool.integration === integration) {
202:     score += 15;
203:   }
204: 
205:   for (const token of normalizedQuery.split(/\s+/)) {
206:     if (token.length < 2) {
207:       continue;
208:     }
209: 
210:     if (tool.name.toLowerCase().includes(token)) {
211:       score += 8;
212:     }
213: 
214:     if (tool.tags.some((tag) => tag.toLowerCase().includes(token))) {
215:       score += 4;
216:     }
217: 
218:     if (tool.description.toLowerCase().includes(token)) {
219:       score += 2;
220:     }
221:   }
222: 
223:   return score;
224: }
225: 
226: export function listAllRegisteredTools(): IntegrationTool[] {
227:   return getAllRegisteredToolEntries().map((entry) => entry.tool);
228: }
229: 
230: export function listToolDefinitionsForIntegration(
231:   integration: string,
232:   options: {
233:     includePipedreamManifestTools?: boolean;
234:     includeComposioManifestTools?: boolean;
235:   } = {},
236: ): IntegrationTool[] {
237:   const handlerTools = listHandlerToolsForIntegration(integration);
238: 
239:   if (!options.includePipedreamManifestTools && !options.includeComposioManifestTools) {
240:     return handlerTools;
241:   }
242: 
243:   const manifestTools = [
244:     ...(options.includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
245:     ...(options.includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
246:   ];
247:   const tools = new Map<string, IntegrationTool>();
248: 
249:   for (const tool of handlerTools) {
250:     tools.set(tool.name, tool);
251:   }
252: 
253:   for (const tool of manifestTools) {
254:     if (!tools.has(tool.name)) {
255:       tools.set(tool.name, tool);
256:     }
257:   }
258: 
259:   return Array.from(tools.values()).sort((left, right) => left.name.localeCompare(right.name));
260: }
261: 
262: export function getToolDefinitionByName(toolName: string): IntegrationTool | null {
263:   const normalized = normalizeSearchText(toolName);
264: 
265:   if (!normalized) {
266:     return null;
267:   }
268: 
269:   for (const { tool } of getAllRegisteredToolEntries()) {
270:     if (tool.name.toLowerCase() === normalized) {
271:       return tool;
272:     }
273:   }
274: 
275:   return null;
276: }
277: 
278: export function searchToolDefinitions(
279:   query: string,
280:   options: { integration?: string; limit?: number } = {},
281: ): IntegrationTool[] {
282:   const limit = options.limit ?? 5;
283: 
284:   return getAllRegisteredToolEntries()
285:     .map(({ tool }) => ({
286:       tool,
287:       score: scoreTool(tool, query, options.integration),
288:     }))
289:     .filter((entry) => entry.score > 0)
290:     .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
291:     .slice(0, limit)
292:     .map((entry) => entry.tool);
293: }
294: 
295: export async function listConnectedToolEntries(userId: string): Promise<ToolRegistryEntry[]> {
296:   const db = getDatabase();
297: 
298:   if (!db) {
299:     throw new Error("DB binding is not configured");
300:   }
301: 
302:   const connections = await listIntegrationConnectionsForUserId(db, userId);
303:   const connectionsByIntegration = new Map<string, IntegrationConnectionRecord[]>();
304: 
305:   for (const connection of connections) {
306:     const existing = connectionsByIntegration.get(connection.integration) ?? [];
307:     existing.push(connection);
308:     connectionsByIntegration.set(connection.integration, existing);
309:   }
310: 
311:   const entries: ToolRegistryEntry[] = [];
312: 
313:   for (const [integration, integrationConnections] of connectionsByIntegration.entries()) {
314:     const handlerTools = listHandlerToolsForIntegration(integration);
315: 
316:     for (const tool of handlerTools) {
317:       entries.push({ tool, connections: integrationConnections });
318:     }
319: 
320:     const handlerToolNames = new Set(handlerTools.map((tool) => tool.name));
321: 
322:     const pipedreamConnections = integrationConnections.filter(isPipedreamBackedConnection);
323: 
324:     for (const tool of listPipedreamToolsForIntegration(integration)) {
325:       if (handlerToolNames.has(tool.name)) {
326:         continue;
327:       }
328: 
329:       if (pipedreamConnections.length > 0) {
330:         entries.push({ tool, connections: pipedreamConnections });
331:       }
332:     }
333: 
334:     const composioConnections = integrationConnections.filter(isComposioBackedConnection);
335: 
336:     for (const tool of listComposioToolsForIntegration(integration)) {
337:       if (handlerToolNames.has(tool.name)) {
338:         continue;
339:       }
340: 
341:       if (composioConnections.length > 0) {
342:         entries.push({ tool, connections: composioConnections });
343:       }
344:     }
345:   }
346: 
347:   return entries.sort((left, right) => left.tool.name.localeCompare(right.tool.name));
348: }
349: 
350: export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {
351:   const entries = await listConnectedToolEntries(userId);
352:   return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));
353: }
354: 
355: export async function describeToolForUser(
356:   userId: string,
357:   toolName: string,
358: ): Promise<ToolDescription | null> {
359:   const entries = await listConnectedToolEntries(userId);
360:   const match = entries.find(({ tool }) => tool.name === toolName);
361: 
362:   if (!match) {
363:     return null;
364:   }
365: 
366:   return buildToolDescription(match.tool, match.connections);
367: }
368: 
369: export async function listToolDescriptionsForIntegration(
370:   userId: string,
371:   integration: string,
372: ): Promise<ToolDescription[]> {
373:   const db = getDatabase();
374: 
375:   if (!db) {
376:     throw new Error("DB binding is not configured");
377:   }
378: 
379:   const connections = (await listIntegrationConnectionsForUserId(db, userId)).filter(
380:     (connection) => connection.integration === integration,
381:   );
382:   const includePipedreamManifestTools = connections.some(isPipedreamBackedConnection);
383:   const includeComposioManifestTools = connections.some(isComposioBackedConnection);
384:   const pipedreamConnections = connections.filter(isPipedreamBackedConnection);
385:   const composioConnections = connections.filter(isComposioBackedConnection);
386: 
387:   const definitions = [
388:     ...listHandlerToolsForIntegration(integration),
389:     ...(includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
390:     ...(includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
391:   ];
392: 
393:   const uniqueDefinitions = new Map<string, IntegrationTool>();
394:   for (const tool of definitions) {
395:     if (!uniqueDefinitions.has(tool.name)) {
396:       uniqueDefinitions.set(tool.name, tool);
397:     }
398:   }
399: 
400:   return Array.from(uniqueDefinitions.values())
401:     .sort((left, right) => left.name.localeCompare(right.name))
402:     .map((tool) =>
403:       buildToolDescription(
404:         tool,
405:         tool.execution.kind === "pipedream_action"
406:           ? pipedreamConnections
407:           : tool.execution.kind === "composio_tool"
408:             ? composioConnections
409:             : connections,
410:       ),
411:     );
412: }

(End of file - total 412 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 5.7s)

Now let me check the worker index more closely to understand how `env` is threaded through -- I need to see how `handleListTools` can access `env` for KV and Composio config:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 150,
  "limit": 130
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
150:         ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
151:       `,
152:     )
153:     .bind(userId, integration)
154:     .all<WorkerConnectionRow>();
155: 
156:   const rows = result.results ?? [];
157: 
158:   const activeDefault =
159:     rows.find((row) => row.is_default && row.auth_state === "active" && isPipedreamBackedConnection(row)) ??
160:     null;
161: 
162:   if (activeDefault) {
163:     return activeDefault.id;
164:   }
165: 
166:   const latestActive =
167:     rows.find((row) => row.auth_state === "active" && isPipedreamBackedConnection(row)) ??
168:     null;
169: 
170:   if (latestActive) {
171:     return latestActive.id;
172:   }
173: 
174:   const fallback =
175:     rows.find((row) => row.is_default && isPipedreamBackedConnection(row)) ??
176:     rows.find((row) => isPipedreamBackedConnection(row)) ??
177:     null;
178: 
179:   return fallback?.id ?? null;
180: }
181: 
182: async function resolvePreferredComposioConnectionId(
183:   env: Env,
184:   userId: string,
185:   integration: string,
186:   preferredConnectionId?: number,
187: ): Promise<number | null> {
188:   if (preferredConnectionId) {
189:     const row = await env.DB
190:       .prepare(
191:         `
192:           SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
193:                  composio_connected_account_id, updated_at, created_at
194:           FROM user_integrations
195:           WHERE id = ? AND user_id = ? AND integration = ?
196:           LIMIT 1
197:         `,
198:       )
199:       .bind(preferredConnectionId, userId, integration)
200:       .first<WorkerConnectionRow>();
201: 
202:     if (!row) {
203:       return null;
204:     }
205: 
206:     return isComposioBackedConnection(row) ? row.id : null;
207:   }
208: 
209:   const result = await env.DB
210:     .prepare(
211:       `
212:         SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
213:                composio_connected_account_id, updated_at, created_at
214:         FROM user_integrations
215:         WHERE user_id = ? AND integration = ?
216:         ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
217:       `,
218:     )
219:     .bind(userId, integration)
220:     .all<WorkerConnectionRow>();
221: 
222:   const rows = result.results ?? [];
223:   const activeDefault =
224:     rows.find((row) => row.is_default && row.auth_state === "active" && isComposioBackedConnection(row)) ??
225:     null;
226: 
227:   if (activeDefault) {
228:     return activeDefault.id;
229:   }
230: 
231:   const latestActive =
232:     rows.find((row) => row.auth_state === "active" && isComposioBackedConnection(row)) ??
233:     null;
234: 
235:   if (latestActive) {
236:     return latestActive.id;
237:   }
238: 
239:   const fallback =
240:     rows.find((row) => row.is_default && isComposioBackedConnection(row)) ??
241:     rows.find((row) => isComposioBackedConnection(row)) ??
242:     null;
243: 
244:   return fallback?.id ?? null;
245: }
246: 
247: async function runScheduledTriggerWork(env: Env): Promise<void> {
248:   const secret =
249:     typeof env.TRIGGER_CRON_SECRET === "string" ? env.TRIGGER_CRON_SECRET.trim() : "";
250: 
251:   if (!secret) {
252:     console.warn("Skipping scheduled trigger run because TRIGGER_CRON_SECRET is not configured.");
253:     return;
254:   }
255: 
256:   const response = await fetch(`${getClawLinkAppUrl(env)}/api/triggers/run-due`, {
257:     method: "POST",
258:     headers: {
259:       Authorization: `Bearer ${secret}`,
260:       "User-Agent": "clawlink-trigger-scheduler",
261:     },
262:   });
263: 
264:   if (!response.ok) {
265:     const body = await response.text();
266:     throw new Error(
267:       `Trigger scheduler failed with ${response.status}: ${body.slice(0, 500)}`,
268:     );
269:   }
270: }
271: 
272: /**
273:  * Handle MCP tool call from OpenClaw
274:  */
275: async function handleToolCall(
276:   env: Env,
277:   authSubject: string,
278:   params?: MCPRequest["params"]
279: ): Promise<unknown> {

(Showing lines 150-279 of 682. Use offset=280 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 3.8s)

Now I have a complete understanding of the codebase. Let me also look at how the `IntegrationTool` type is used for MCP manifest types to check if `inputSchema` being an empty object will cause type issues:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/pipedream/manifest-types.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/pipedream/manifest-types.ts</path>
<type>file</type>
<content>
1: import type { ToolMode, ToolRisk } from "../runtime/tool-runtime";
2: 
3: export interface PipedreamToolPropOption {
4:   label: string;
5:   value: unknown;
6: }
7: 
8: export interface PipedreamToolProp {
9:   name: string;
10:   type: string;
11:   label?: string;
12:   description?: string;
13:   required: boolean;
14:   hidden: boolean;
15:   disabled: boolean;
16:   readOnly: boolean;
17:   remoteOptions: boolean;
18:   useQuery: boolean;
19:   reloadProps: boolean;
20:   withLabel: boolean;
21:   appAuth: boolean;
22:   options?: PipedreamToolPropOption[];
23: }
24: 
25: export interface CustomToolExecutionSpec {
26:   kind: "custom";
27: }
28: 
29: export interface PipedreamActionExecutionSpec {
30:   kind: "pipedream_action";
31:   app: string;
32:   componentId: string;
33:   version?: string;
34:   authPropNames: string[];
35:   dynamicPropNames: string[];
36:   props: PipedreamToolProp[];
37: }
38: 
39: export interface ComposioToolExecutionSpec {
40:   kind: "composio_tool";
41:   toolkit: string;
42:   toolSlug: string;
43:   version?: string;
44: }
45: 
46: export type ToolExecutionSpec =
47:   | CustomToolExecutionSpec
48:   | PipedreamActionExecutionSpec
49:   | ComposioToolExecutionSpec;
50: 
51: export interface PipedreamToolExample {
52:   user: string;
53:   args: Record<string, unknown>;
54: }
55: 
56: export interface PipedreamActionToolManifest {
57:   integration: string;
58:   name: string;
59:   description: string;
60:   inputSchema: Record<string, unknown>;
61:   outputSchema?: Record<string, unknown>;
62:   accessLevel: ToolMode;
63:   mode: ToolMode;
64:   risk: ToolRisk;
65:   tags: string[];
66:   whenToUse: string[];
67:   askBefore: string[];
68:   safeDefaults: Record<string, unknown>;
69:   examples: PipedreamToolExample[];
70:   followups: string[];
71:   requiresScopes: string[];
72:   idempotent: boolean;
73:   supportsDryRun: boolean;
74:   supportsBatch: boolean;
75:   maxBatchSize?: number;
76:   recommendedTimeoutMs?: number;
77:   execution: PipedreamActionExecutionSpec;
78:   source: {
79:     app: string;
80:     componentKey: string;
81:     componentName: string;
82:   };
83: }

(End of file - total 83 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 11.4s)

Good. Now I have everything. Let me implement all the changes. I'll work through the tasks systematically.

### Step 1: Modify import-composio-tools.mjs to strip inputSchema

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/scripts/import-composio-tools.mjs",
  "oldString": "  // Build manifest entries.\n  const tools = activeTools\n    .map((item) => {\n      const { mode, risk } = classifyTool(item);\n      const name = toClawlinkToolName(item.slug);\n      const tags = buildTags(integration, mode, item.tags);\n      const humanName = humanizeToolName(item.name);\n      const askBefore = buildAskBefore(mode, risk, humanName);\n      const inputSchema = convertInputSchema(item.input_parameters);\n      const idempotent = (item.tags ?? []).includes(HINT_TAG_IDEMPOTENT) ? true : undefined;\n\n      return {\n        name,\n        description: item.description,\n        toolSlug: item.slug,\n        mode,\n        risk,\n        tags,\n        askBefore,\n        inputSchema,\n        idempotent,\n      };\n    })\n    .sort((a, b) => a.name.localeCompare(b.name));",
  "newString": "  // Build manifest entries.\n  // inputSchema is intentionally omitted from static manifests to keep bundle\n  // size small (~80-90% reduction). Schemas are fetched at runtime from\n  // Composio's API and cached in KV. See src/lib/composio/schema-cache.ts.\n  const tools = activeTools\n    .map((item) => {\n      const { mode, risk } = classifyTool(item);\n      const name = toClawlinkToolName(item.slug);\n      const tags = buildTags(integration, mode, item.tags);\n      const humanName = humanizeToolName(item.name);\n      const askBefore = buildAskBefore(mode, risk, humanName);\n      const idempotent = (item.tags ?? []).includes(HINT_TAG_IDEMPOTENT) ? true : undefined;\n\n      return {\n        name,\n        description: item.description,\n        toolSlug: item.slug,\n        mode,\n        risk,\n        tags,\n        askBefore,\n        idempotent,\n      };\n    })\n    .sort((a, b) => a.name.localeCompare(b.name));"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 8.2s)

Now update `renderToolCall` to no longer emit `inputSchema`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/scripts/import-composio-tools.mjs",
  "oldString": "function renderToolCall(tool, depth = 1) {\n  const obj = {};\n\n  obj.name = tool.name;\n  obj.description = tool.description;\n  obj.toolSlug = tool.toolSlug;\n  obj.mode = tool.mode;\n  obj.risk = tool.risk;\n\n  if (Object.keys(tool.inputSchema.properties ?? {}).length > 0 || (tool.inputSchema.required ?? []).length > 0) {\n    obj.inputSchema = tool.inputSchema;\n  } else {\n    obj.inputSchema = { type: \"object\", properties: {} };\n  }\n\n  if (tool.tags && tool.tags.length > 0) {\n    obj.tags = tool.tags;\n  }\n\n  if (tool.askBefore && tool.askBefore.length > 0) {\n    obj.askBefore = tool.askBefore;\n  }\n\n  if (tool.idempotent !== undefined && tool.idempotent !== (tool.mode === \"read\")) {\n    obj.idempotent = tool.idempotent;\n  }\n\n  return `${indent(depth)}composioTool(${renderValue(obj, depth)})`;\n}",
  "newString": "function renderToolCall(tool, depth = 1) {\n  const obj = {};\n\n  obj.name = tool.name;\n  obj.description = tool.description;\n  obj.toolSlug = tool.toolSlug;\n  obj.mode = tool.mode;\n  obj.risk = tool.risk;\n\n  // inputSchema is intentionally omitted. It is fetched at runtime from\n  // Composio's API and cached in KV. See src/lib/composio/schema-cache.ts.\n\n  if (tool.tags && tool.tags.length > 0) {\n    obj.tags = tool.tags;\n  }\n\n  if (tool.askBefore && tool.askBefore.length > 0) {\n    obj.askBefore = tool.askBefore;\n  }\n\n  if (tool.idempotent !== undefined && tool.idempotent !== (tool.mode === \"read\")) {\n    obj.idempotent = tool.idempotent;\n  }\n\n  return `${indent(depth)}composioTool(${renderValue(obj, depth)})`;\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 14.8s)

Now update `generateManifestSource` -- the `composioTool()` factory needs to set a stub `inputSchema` and the partial type should no longer require it:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/scripts/import-composio-tools.mjs",
  "newString": "function generateManifestSource(integration, composioToolkit, version, tools) {\n  const exportName = `${toCamelCase(integration)}ComposioTools`;\n\n  const toolEntries = tools\n    .map((tool) => renderToolCall(tool, 1))\n    .join(\",\\n\");\n\n  return `import type { IntegrationTool } from \"../../../worker/integrations/base\";\n\nfunction composioTool(\n  partial: Omit<IntegrationTool, \"integration\" | \"inputSchema\" | \"accessLevel\" | \"tags\" | \"whenToUse\" | \"askBefore\" | \"safeDefaults\" | \"examples\" | \"followups\" | \"requiresScopes\" | \"idempotent\" | \"supportsBatch\" | \"supportsDryRun\" | \"execution\"> & {\n    accessLevel?: IntegrationTool[\"accessLevel\"];\n    tags?: string[];\n    whenToUse?: string[];\n    askBefore?: string[];\n    safeDefaults?: Record<string, unknown>;\n    examples?: IntegrationTool[\"examples\"];\n    requiresScopes?: string[];\n    idempotent?: boolean;\n    supportsDryRun?: boolean;\n    supportsBatch?: boolean;\n    toolSlug: string;\n  },\n): IntegrationTool {\n  return {\n    integration: ${JSON.stringify(integration)},\n    name: partial.name,\n    description: partial.description,\n    inputSchema: { type: \"object\", properties: {} },\n    outputSchema: partial.outputSchema,\n    accessLevel: partial.accessLevel ?? partial.mode,\n    mode: partial.mode,\n    risk: partial.risk,\n    tags: partial.tags ?? [],\n    whenToUse: partial.whenToUse ?? [],\n    askBefore: partial.askBefore ?? [],\n    safeDefaults: partial.safeDefaults ?? {},\n    examples: partial.examples ?? [],\n    followups: [],\n    requiresScopes: partial.requiresScopes ?? [],\n    idempotent: partial.idempotent ?? partial.mode === \"read\",\n    supportsDryRun: partial.supportsDryRun ?? false,\n    supportsBatch: partial.supportsBatch ?? false,\n    execution: {\n      kind: \"composio_tool\",\n      toolkit: ${JSON.stringify(composioToolkit)},\n      toolSlug: partial.toolSlug,\n      version: ${JSON.stringify(version)},\n    },\n  };\n}\n\nexport const ${exportName}: IntegrationTool[] = [\n${toolEntries},\n];\n`;\n}",
  "oldString": "function generateManifestSource(integration, composioToolkit, version, tools) {\n  const exportName = `${toCamelCase(integration)}ComposioTools`;\n\n  const toolEntries = tools\n    .map((tool) => renderToolCall(tool, 1))\n    .join(\",\\n\");\n\n  return `import type { IntegrationTool } from \"../../../worker/integrations/base\";\n\nfunction composioTool(\n  partial: Omit<IntegrationTool, \"integration\" | \"accessLevel\" | \"tags\" | \"whenToUse\" | \"askBefore\" | \"safeDefaults\" | \"examples\" | \"followups\" | \"requiresScopes\" | \"idempotent\" | \"supportsBatch\" | \"supportsDryRun\" | \"execution\"> & {\n    accessLevel?: IntegrationTool[\"accessLevel\"];\n    tags?: string[];\n    whenToUse?: string[];\n    askBefore?: string[];\n    safeDefaults?: Record<string, unknown>;\n    examples?: IntegrationTool[\"examples\"];\n    requiresScopes?: string[];\n    idempotent?: boolean;\n    supportsDryRun?: boolean;\n    supportsBatch?: boolean;\n    toolSlug: string;\n  },\n): IntegrationTool {\n  return {\n    integration: ${JSON.stringify(integration)},\n    name: partial.name,\n    description: partial.description,\n    inputSchema: partial.inputSchema,\n    outputSchema: partial.outputSchema,\n    accessLevel: partial.accessLevel ?? partial.mode,\n    mode: partial.mode,\n    risk: partial.risk,\n    tags: partial.tags ?? [],\n    whenToUse: partial.whenToUse ?? [],\n    askBefore: partial.askBefore ?? [],\n    safeDefaults: partial.safeDefaults ?? {},\n    examples: partial.examples ?? [],\n    followups: [],\n    requiresScopes: partial.requiresScopes ?? [],\n    idempotent: partial.idempotent ?? partial.mode === \"read\",\n    supportsDryRun: partial.supportsDryRun ?? false,\n    supportsBatch: partial.supportsBatch ?? false,\n    execution: {\n      kind: \"composio_tool\",\n      toolkit: ${JSON.stringify(composioToolkit)},\n      toolSlug: partial.toolSlug,\n      version: ${JSON.stringify(version)},\n    },\n  };\n}\n\nexport const ${exportName}: IntegrationTool[] = [\n${toolEntries},\n];\n`;\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 7.1s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 29.1s)

### Step 2: Add `fetchComposioToolSchemas()` to backend-client.ts

This adds the runtime schema fetching function that calls Composio's `GET /tools` endpoint and extracts `inputSchema` per tool slug, using the same `convertInputSchema` logic from the import script:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/backend-client.ts",
  "newString": "export async function executeComposioToolRequest(\n  params: ExecuteComposioToolParams,\n): Promise<ExecuteComposioToolResult> {\n  const config = getComposioConfig(params.env, params.toolkit.replace(/_/g, \"-\"));\n  const response = await composioFetch<{\n    data?: unknown;\n    error?: unknown;\n    successful?: boolean;\n    log_id?: string;\n  }>(\n    config,\n    `/tools/execute/${encodeURIComponent(params.toolSlug)}`,\n    {\n      method: \"POST\",\n      body: JSON.stringify({\n        connected_account_id: params.connectedAccountId,\n        user_id: params.userId,\n        version: params.version ?? config.toolkitVersion,\n        arguments: params.arguments,\n      }),\n    },\n  );\n\n  if (response.data.successful === false) {\n    throw new IntegrationRequestError(\n      stringifyComposioError(response.data.error, `${params.toolSlug} failed in Composio.`),\n      {\n        status: 502,\n      },\n    );\n  }\n\n  return {\n    data: response.data.data ?? response.data,\n    providerRequestId:\n      safeTrim(response.data.log_id) ??\n      safeTrim(response.headers.get(\"x-request-id\")) ??\n      undefined,\n  };\n}\n\n// ---------------------------------------------------------------------------\n// Runtime schema fetching\n// ---------------------------------------------------------------------------\n\ninterface ComposioToolItem {\n  slug?: string;\n  input_parameters?: Record<string, unknown>;\n}\n\ninterface ComposioToolsResponse {\n  items?: ComposioToolItem[];\n  total_items?: number;\n}\n\nfunction simplifySchemaNode(node: unknown): Record<string, unknown> {\n  if (!node || typeof node !== \"object\") {\n    return { type: \"string\" };\n  }\n\n  const record = node as Record<string, unknown>;\n\n  if (record.$ref) {\n    return { type: \"object\", additionalProperties: true };\n  }\n\n  const result: Record<string, unknown> = {};\n\n  if (record.type === \"array\") {\n    result.type = \"array\";\n    result.items = record.items\n      ? simplifySchemaNode(record.items)\n      : { type: \"object\", additionalProperties: true };\n  } else if (record.type === \"object\") {\n    result.type = \"object\";\n    result.additionalProperties = true;\n    if (record.properties && typeof record.properties === \"object\") {\n      const simplified: Record<string, unknown> = {};\n      for (const [key, value] of Object.entries(record.properties as Record<string, unknown>)) {\n        simplified[key] = simplifySchemaNode(value);\n      }\n      result.properties = simplified;\n    }\n  } else if (record.type) {\n    result.type = record.type;\n  } else {\n    result.type = \"string\";\n  }\n\n  if (record.description) result.description = record.description;\n  if (record.enum) result.enum = record.enum;\n\n  return result;\n}\n\nfunction convertInputSchema(\n  inputParams: Record<string, unknown> | null | undefined,\n): Record<string, unknown> {\n  if (!inputParams || typeof inputParams !== \"object\") {\n    return { type: \"object\", additionalProperties: true, properties: {} };\n  }\n\n  const properties: Record<string, unknown> = {};\n  const required: string[] = [];\n  const rawProps = (inputParams.properties ?? {}) as Record<string, Record<string, unknown>>;\n\n  for (const [name, prop] of Object.entries(rawProps)) {\n    const schema: Record<string, unknown> = {};\n    const propType = prop.type;\n\n    if (propType === \"array\") {\n      schema.type = \"array\";\n      schema.items = prop.items\n        ? simplifySchemaNode(prop.items)\n        : { type: \"object\", additionalProperties: true };\n    } else if (propType === \"object\") {\n      schema.type = \"object\";\n      schema.additionalProperties = true;\n      if (prop.properties && typeof prop.properties === \"object\") {\n        const nested: Record<string, unknown> = {};\n        for (const [nestedName, nestedProp] of Object.entries(\n          prop.properties as Record<string, unknown>,\n        )) {\n          nested[nestedName] = simplifySchemaNode(nestedProp);\n        }\n        schema.properties = nested;\n      }\n    } else if (propType === \"integer\") {\n      schema.type = \"integer\";\n    } else if (propType === \"number\") {\n      schema.type = \"number\";\n    } else if (propType === \"boolean\") {\n      schema.type = \"boolean\";\n    } else {\n      schema.type = \"string\";\n    }\n\n    if (prop.description) schema.description = prop.description;\n    if (prop.enum) schema.enum = prop.enum;\n\n    properties[name] = schema;\n  }\n\n  if (Array.isArray(inputParams.required)) {\n    required.push(...(inputParams.required as string[]));\n  }\n\n  const result: Record<string, unknown> = {\n    type: \"object\",\n    additionalProperties: true,\n    properties,\n  };\n\n  if (required.length > 0) {\n    result.required = required;\n  }\n\n  return result;\n}\n\n/**\n * Fetch input schemas for all tools in a Composio toolkit.\n *\n * Returns a map from uppercase tool slug (e.g. \"GMAIL_SEND_EMAIL\") to\n * simplified JSON Schema objects suitable for MCP inputSchema.\n *\n * The response uses the same schema conversion logic as the import script\n * so the runtime schemas are identical to what was previously statically\n * generated.\n */\nexport async function fetchComposioToolSchemas(\n  env: Record<string, unknown> | undefined,\n  integrationSlug: string,\n): Promise<Map<string, Record<string, unknown>>> {\n  const apiKey = getEnvValue(env, \"COMPOSIO_API_KEY\");\n  const baseUrl = normalizeBaseUrl(getEnvValue(env, \"COMPOSIO_BASE_URL\"));\n\n  if (!apiKey) {\n    throw new Error(\"COMPOSIO_API_KEY is not configured.\");\n  }\n\n  const toolkitMap = parseMap(getEnvValue(env, \"COMPOSIO_TOOLKIT_MAP\"));\n  const versionMap = parseMap(getEnvValue(env, \"COMPOSIO_TOOLKIT_VERSION_MAP\"));\n  const toolkit =\n    toolkitMap.get(integrationSlug) ??\n    getEnvValue(env, getSlugEnvKey(\"COMPOSIO\", integrationSlug, \"TOOLKIT\")) ??\n    integrationSlug.replace(/-/g, \"_\");\n  const version =\n    versionMap.get(integrationSlug) ??\n    getEnvValue(env, getSlugEnvKey(\"COMPOSIO\", integrationSlug, \"TOOLKIT_VERSION\"));\n\n  const url = new URL(`${baseUrl}/tools`);\n  url.searchParams.set(\"toolkit_slug\", toolkit);\n  if (version) {\n    url.searchParams.set(\"toolkit_versions\", version);\n  } else {\n    url.searchParams.set(\"toolkit_versions\", \"latest\");\n  }\n  url.searchParams.set(\"limit\", \"1000\");\n  url.searchParams.set(\"include_deprecated\", \"false\");\n\n  const response = await composioFetch<ComposioToolsResponse>(\n    { apiKey, baseUrl },\n    url.pathname + url.search,\n    { method: \"GET\" },\n  );\n\n  const schemas = new Map<string, Record<string, unknown>>();\n\n  for (const item of response.data.items ?? []) {\n    if (!item.slug) continue;\n    schemas.set(\n      item.slug,\n      convertInputSchema(item.input_parameters as Record<string, unknown> | null),\n    );\n  }\n\n  return schemas;\n}",
  "oldString": "export async function executeComposioToolRequest(\n  params: ExecuteComposioToolParams,\n): Promise<ExecuteComposioToolResult> {\n  const config = getComposioConfig(params.env, params.toolkit.replace(/_/g, \"-\"));\n  const response = await composioFetch<{\n    data?: unknown;\n    error?: unknown;\n    successful?: boolean;\n    log_id?: string;\n  }>(\n    config,\n    `/tools/execute/${encodeURIComponent(params.toolSlug)}`,\n    {\n      method: \"POST\",\n      body: JSON.stringify({\n        connected_account_id: params.connectedAccountId,\n        user_id: params.userId,\n        version: params.version ?? config.toolkitVersion,\n        arguments: params.arguments,\n      }),\n    },\n  );\n\n  if (response.data.successful === false) {\n    throw new IntegrationRequestError(\n      stringifyComposioError(response.data.error, `${params.toolSlug} failed in Composio.`),\n      {\n        status: 502,\n      },\n    );\n  }\n\n  return {\n    data: response.data.data ?? response.data,\n    providerRequestId:\n      safeTrim(response.data.log_id) ??\n      safeTrim(response.headers.get(\"x-request-id\")) ??\n      undefined,\n  };\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 6.6s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 3.4s)

### Step 3: Create KV-backed schema cache layer

**Tool: bash**

**Input:**
```json
{
  "command": "ls /Users/hithesh/clawlink/src/lib/composio/",
  "description": "List composio lib directory"
}
```

**Output:**
```
backend-client.ts
manifest-registry.ts
tool-executor.ts

```

---

## Assistant (Build · Claude Opus 4.6 · 18.0s)

**Tool: write**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/schema-cache.ts",
  "content": "/**\n * KV-backed cache for Composio tool inputSchema objects.\n *\n * Static manifests ship without inputSchema to keep the worker bundle small.\n * This module lazily fetches schemas from Composio's API per-toolkit and\n * caches them in Cloudflare KV (the shared CREDENTIALS namespace).\n *\n * Cache key format: `composio-schema:<integrationSlug>`\n * TTL: 24 hours (schemas rarely change between toolkit version bumps)\n */\n\nimport { fetchComposioToolSchemas } from \"./backend-client\";\n\nconst CACHE_TTL_SECONDS = 86_400; // 24 hours\nconst CACHE_KEY_PREFIX = \"composio-schema:\";\n\n/** In-memory per-request cache so we don't hit KV multiple times in one request. */\nconst memoryCache = new Map<string, Map<string, Record<string, unknown>>>();\n\nfunction cacheKey(integrationSlug: string): string {\n  return `${CACHE_KEY_PREFIX}${integrationSlug}`;\n}\n\n/**\n * Resolve input schemas for every tool in a Composio-backed integration.\n *\n * Returns a map of uppercase tool slug (e.g. \"GMAIL_SEND_EMAIL\") to JSON\n * Schema objects. The lookup order is:\n *\n *   1. In-memory per-request cache\n *   2. KV cache\n *   3. Composio API (result is written back to KV + memory)\n */\nexport async function resolveToolSchemas(\n  kv: KVNamespace | null | undefined,\n  env: Record<string, unknown> | undefined,\n  integrationSlug: string,\n): Promise<Map<string, Record<string, unknown>>> {\n  // 1. Memory cache (avoids repeated KV reads within the same request)\n  const memoryCached = memoryCache.get(integrationSlug);\n  if (memoryCached) {\n    return memoryCached;\n  }\n\n  // 2. KV cache\n  if (kv) {\n    try {\n      const stored = await kv.get(cacheKey(integrationSlug), \"text\");\n      if (stored) {\n        const parsed = JSON.parse(stored) as Record<string, Record<string, unknown>>;\n        const map = new Map(Object.entries(parsed));\n        memoryCache.set(integrationSlug, map);\n        return map;\n      }\n    } catch {\n      // KV read failed or JSON was corrupt — fall through to API fetch.\n    }\n  }\n\n  // 3. Fetch from Composio API\n  const schemas = await fetchComposioToolSchemas(env, integrationSlug);\n\n  // Write back to memory cache immediately.\n  memoryCache.set(integrationSlug, schemas);\n\n  // Write back to KV asynchronously (best-effort).\n  if (kv) {\n    const serialized = JSON.stringify(Object.fromEntries(schemas));\n    // Fire-and-forget — we don't block the response on KV write.\n    kv.put(cacheKey(integrationSlug), serialized, {\n      expirationTtl: CACHE_TTL_SECONDS,\n    }).catch(() => {\n      // Swallow KV write errors silently.\n    });\n  }\n\n  return schemas;\n}\n\n/**\n * Check whether a tool's inputSchema is the empty stub set by the manifest\n * generator. Composio manifest tools ship with `{ type: \"object\", properties: {} }`\n * and need runtime hydration.\n */\nexport function isStubSchema(schema: Record<string, unknown>): boolean {\n  if (!schema || typeof schema !== \"object\") return true;\n\n  const props = schema.properties;\n  if (!props || typeof props !== \"object\") return true;\n\n  return Object.keys(props).length === 0;\n}\n\n/**\n * Clear the in-memory cache. Useful in tests or after long-running workers\n * that may accumulate stale entries.\n */\nexport function clearSchemaMemoryCache(): void {\n  memoryCache.clear();\n}\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 4.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 19.6s)

### Step 4: Update manifest-registry.ts to support schema hydration

The manifest registry needs a new async function that hydrates `inputSchema` for all Composio tools in a set of integrations:

**Tool: write**

**Input:**
```json
{
  "content": "import type { IntegrationTool } from \"../../../worker/integrations/base\";\nimport { composioToolManifests } from \"@/generated/composio-manifests\";\nimport { resolveToolSchemas, isStubSchema } from \"./schema-cache\";\n\nlet cachedTools: IntegrationTool[] | null = null;\nlet cachedByName: Map<string, IntegrationTool> | null = null;\n\nfunction buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {\n  const tools = composioToolManifests\n    .map((tool) => tool)\n    .sort((left, right) => left.name.localeCompare(right.name));\n\n  return {\n    tools,\n    byName: new Map(tools.map((tool) => [tool.name, tool])),\n  };\n}\n\nfunction ensureCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {\n  if (cachedTools && cachedByName) {\n    return {\n      tools: cachedTools,\n      byName: cachedByName,\n    };\n  }\n\n  const built = buildCache();\n  cachedTools = built.tools;\n  cachedByName = built.byName;\n  return built;\n}\n\nexport function getAllComposioManifestTools(): IntegrationTool[] {\n  return ensureCache().tools;\n}\n\nexport function getComposioManifestToolByName(toolName: string): IntegrationTool | null {\n  return ensureCache().byName.get(toolName) ?? null;\n}\n\nexport function listComposioManifestToolsForIntegration(\n  integration: string,\n): IntegrationTool[] {\n  return getAllComposioManifestTools().filter((tool) => tool.integration === integration);\n}\n\n/**\n * Hydrate inputSchema for a list of Composio-backed tools.\n *\n * Tools whose inputSchema is still the empty stub from the static manifest\n * will have their schema fetched from KV / Composio API and patched in-place.\n * Tools that already have a non-stub schema are left untouched.\n *\n * @param tools     The tools to hydrate (mutated in place)\n * @param kv        Cloudflare KV namespace (CREDENTIALS binding)\n * @param env       Worker env bindings (for COMPOSIO_API_KEY, etc.)\n */\nexport async function hydrateComposioToolSchemas(\n  tools: IntegrationTool[],\n  kv: KVNamespace | null | undefined,\n  env: Record<string, unknown> | undefined,\n): Promise<void> {\n  // Collect the set of integration slugs that need hydration.\n  const integrationSlugs = new Set<string>();\n\n  for (const tool of tools) {\n    if (tool.execution.kind !== \"composio_tool\") continue;\n    if (!isStubSchema(tool.inputSchema)) continue;\n    integrationSlugs.add(tool.integration);\n  }\n\n  if (integrationSlugs.size === 0) return;\n\n  // Fetch schemas for all needed integrations in parallel.\n  const schemasByIntegration = new Map<string, Map<string, Record<string, unknown>>>();\n  const fetches = [...integrationSlugs].map(async (slug) => {\n    try {\n      const schemas = await resolveToolSchemas(kv, env, slug);\n      schemasByIntegration.set(slug, schemas);\n    } catch (error) {\n      // Log but don't fail — tools will just keep the stub schema.\n      console.warn(\n        `Failed to fetch Composio schemas for ${slug}:`,\n        error instanceof Error ? error.message : error,\n      );\n    }\n  });\n\n  await Promise.all(fetches);\n\n  // Patch tools in-place.\n  for (const tool of tools) {\n    if (tool.execution.kind !== \"composio_tool\") continue;\n    if (!isStubSchema(tool.inputSchema)) continue;\n\n    const schemas = schemasByIntegration.get(tool.integration);\n    if (!schemas) continue;\n\n    const schema = schemas.get(tool.execution.toolSlug);\n    if (schema) {\n      tool.inputSchema = schema;\n    }\n  }\n}\n",
  "filePath": "/Users/hithesh/clawlink/src/lib/composio/manifest-registry.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 4.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 5.2s)

### Step 5: Update worker/index.ts to hydrate schemas for connected integrations

The worker's `handleListTools` needs to become async, accept `env` + `userId`, query the user's connected integrations, and hydrate only those toolkit schemas:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "limit": 15,
  "offset": 1
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
1: /// <reference types="@cloudflare/workers-types" />
2: 
3: /**
4:  * ClawLink Worker - MCP Proxy Server
5:  * 
6:  * Handles MCP protocol requests from OpenClaw and proxies them
7:  * to third-party APIs (Gmail, Slack, Stripe, etc.)
8:  */
9: 
10: // Import integrations to register handlers
11: import "./integrations";
12: 
13: import { executeComposioTool } from "../src/lib/composio/tool-executor";
14: import { executePipedreamActionTool } from "../src/lib/pipedream/action-executor";
15: import { verifyAuth } from "./auth";

(Showing lines 1-15 of 682. Use offset=16 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.6s)

First, add the import for `hydrateComposioToolSchemas`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "newString": "import { executeComposioTool } from \"../src/lib/composio/tool-executor\";\nimport { hydrateComposioToolSchemas } from \"../src/lib/composio/manifest-registry\";\nimport { executePipedreamActionTool } from \"../src/lib/pipedream/action-executor\";",
  "oldString": "import { executeComposioTool } from \"../src/lib/composio/tool-executor\";\nimport { executePipedreamActionTool } from \"../src/lib/pipedream/action-executor\";"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 11.5s)

Now update `handleListTools` to be async and accept env + userId for per-user schema hydration:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "newString": "/**\n * Handle MCP list_tools request.\n *\n * Composio tool manifests ship without inputSchema to keep the bundle small.\n * We hydrate schemas lazily from KV / Composio API only for integrations the\n * authenticated user has connected. Unconnected integrations keep the stub\n * schema — the user can't invoke those tools anyway.\n */\nasync function handleListTools(env: Env, userId: string): Promise<IntegrationTool[]> {\n  const tools = getAllRegisteredTools();\n\n  // Determine which integrations the user has Composio-backed connections for.\n  const internalUserId = await resolveInternalUserId(env.DB, userId);\n\n  if (internalUserId) {\n    const connectedIntegrations = await env.DB\n      .prepare(\n        `SELECT DISTINCT integration FROM user_integrations\n         WHERE user_id = ? AND (auth_provider = 'composio' OR composio_connected_account_id IS NOT NULL)`,\n      )\n      .bind(internalUserId)\n      .all<{ integration: string }>();\n\n    const connectedSlugs = new Set(\n      (connectedIntegrations.results ?? []).map((row) => row.integration),\n    );\n\n    // Only hydrate schemas for tools that belong to connected integrations.\n    const toolsToHydrate = connectedSlugs.size > 0\n      ? tools.filter((tool) => tool.execution.kind === \"composio_tool\" && connectedSlugs.has(tool.integration))\n      : [];\n\n    if (toolsToHydrate.length > 0) {\n      await hydrateComposioToolSchemas(toolsToHydrate, env.CREDENTIALS, env as unknown as Record<string, unknown>);\n    }\n  }\n\n  return tools;\n}",
  "oldString": "/**\n * Handle MCP list_tools request\n */\nfunction handleListTools(): IntegrationTool[] {\n  return getAllRegisteredTools();\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 3.7s)

Now update the caller to pass `env` and `userId`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "newString": "        case \"tools/list\":\n          result = { tools: await handleListTools(env, userId) };\n          break;",
  "oldString": "        case \"tools/list\":\n          result = { tools: handleListTools() };\n          break;"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 3.1s)

Now let me check that `resolveInternalUserId` is already imported:

**Tool: grep**

**Input:**
```json
{
  "pattern": "resolveInternalUserId",
  "include": "worker/index.ts"
}
```

**Output:**
```
Found 3 matches
/Users/hithesh/clawlink/worker/index.ts:
  Line 23:   resolveInternalUserId,

  Line 287:   const internalUserId = await resolveInternalUserId(env.DB, authSubject);

  Line 580:   const internalUserId = await resolveInternalUserId(env.DB, userId);

```

---

## Assistant (Build · Claude Opus 4.6 · 4.1s)

Good, it's already imported. Let me verify the full handleListTools and the tools/list callsite look correct:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "offset": 567,
  "limit": 80
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
567: 
568: /**
569:  * Handle MCP list_tools request.
570:  *
571:  * Composio tool manifests ship without inputSchema to keep the bundle small.
572:  * We hydrate schemas lazily from KV / Composio API only for integrations the
573:  * authenticated user has connected. Unconnected integrations keep the stub
574:  * schema — the user can't invoke those tools anyway.
575:  */
576: async function handleListTools(env: Env, userId: string): Promise<IntegrationTool[]> {
577:   const tools = getAllRegisteredTools();
578: 
579:   // Determine which integrations the user has Composio-backed connections for.
580:   const internalUserId = await resolveInternalUserId(env.DB, userId);
581: 
582:   if (internalUserId) {
583:     const connectedIntegrations = await env.DB
584:       .prepare(
585:         `SELECT DISTINCT integration FROM user_integrations
586:          WHERE user_id = ? AND (auth_provider = 'composio' OR composio_connected_account_id IS NOT NULL)`,
587:       )
588:       .bind(internalUserId)
589:       .all<{ integration: string }>();
590: 
591:     const connectedSlugs = new Set(
592:       (connectedIntegrations.results ?? []).map((row) => row.integration),
593:     );
594: 
595:     // Only hydrate schemas for tools that belong to connected integrations.
596:     const toolsToHydrate = connectedSlugs.size > 0
597:       ? tools.filter((tool) => tool.execution.kind === "composio_tool" && connectedSlugs.has(tool.integration))
598:       : [];
599: 
600:     if (toolsToHydrate.length > 0) {
601:       await hydrateComposioToolSchemas(toolsToHydrate, env.CREDENTIALS, env as unknown as Record<string, unknown>);
602:     }
603:   }
604: 
605:   return tools;
606: }
607: 
608: export default {
609:   async fetch(request: Request, env: Env): Promise<Response> {
610:     // Handle CORS
611:     const origin = request.headers.get("Origin") || "https://claw-link.dev";
612:     const corsHeaders = {
613:       "Access-Control-Allow-Origin": origin,
614:       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
615:       "Access-Control-Allow-Headers": "Content-Type, Authorization",
616:       "Access-Control-Allow-Credentials": "true",
617:     };
618: 
619:     if (request.method === "OPTIONS") {
620:       return new Response(null, { headers: corsHeaders });
621:     }
622: 
623:     // Only accept JSON-RPC POST
624:     if (request.method !== "POST") {
625:       return new Response(JSON.stringify({
626:         jsonrpc: "2.0",
627:         id: 0,
628:         error: { code: -32600, message: "Method not allowed" }
629:       }), {
630:         status: 405,
631:         headers: { "Content-Type": "application/json" }
632:       });
633:     }
634: 
635:     try {
636:       // Verify authentication
637:       const authHeader = request.headers.get("Authorization");
638:       const userId = await verifyAuth(authHeader, env as { CLERK_PUBLISHABLE_KEY?: string; CLERK_JWT_KEY?: string });
639:       
640:       if (!userId) {
641:         return new Response(JSON.stringify({
642:           jsonrpc: "2.0",
643:           id: 0,
644:           error: { code: -32001, message: "Unauthorized" }
645:         }), {
646:           status: 401,

(Showing lines 567-646 of 716. Use offset=647 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 3.5s)

Looks good. Let me check where `tools/list` is called:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/worker/index.ts",
  "limit": 20,
  "offset": 650
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/worker/index.ts</path>
<type>file</type>
<content>
650: 
651:       // Parse MCP request
652:       const mcpRequest: MCPRequest = await request.json();
653:       
654:       let result: unknown;
655:       
656:       switch (mcpRequest.method) {
657:         case "tools/list":
658:           result = { tools: await handleListTools(env, userId) };
659:           break;
660:           
661:         case "tools/call":
662:           result = await handleToolCall(
663:             env,
664:             userId,
665:             mcpRequest.params
666:           );
667:           break;
668:           
669:         default:

(Showing lines 650-669 of 716. Use offset=670 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.8s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 5.1s)

### Step 6: Update tool-registry.ts (frontend) to hydrate schemas on demand

The frontend `tool-registry.ts` serves tool data to the dashboard. It needs to hydrate schemas when listing tools for an integration detail page. Let me check how the frontend accesses KV and env:

**Tool: grep**

**Input:**
```json
{
  "pattern": "getDatabase|CREDENTIALS|KVNamespace",
  "include": "*.ts",
  "path": "/Users/hithesh/clawlink/src/lib/server"
}
```

**Output:**
```
Found 52 matches
/Users/hithesh/clawlink/src/lib/server/billing.ts:
  Line 4: import { getDatabase, getUserForCurrentIdentity } from "@/lib/server/integration-store";

  Line 247:   const db = getDatabase();

  Line 402:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/router.ts:
  Line 4:   getDatabase,

  Line 103:   const db = getDatabase();

  Line 235:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/tool-registry.ts:
  Line 5:   getDatabase,

  Line 296:   const db = getDatabase();

  Line 373:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/executor.ts:
  Line 4:   getDatabase,

  Line 71:   const db = getDatabase();

  Line 79:     CREDENTIALS: getEnvBinding("CREDENTIALS") as CredentialBridgeEnv["CREDENTIALS"],

  Line 386:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/connection-sessions.ts:
  Line 5:   getDatabase,

  Line 363:   const db = getDatabase();

  Line 449:   const db = getDatabase();

  Line 461:   const db = getDatabase();

  Line 471:   const db = getDatabase();

  Line 490:   const db = getDatabase();

  Line 587:   const db = getDatabase();

  Line 607:   const db = getDatabase();

  Line 629:   const db = getDatabase();

  Line 703:   const db = getDatabase();

  Line 774:   const db = getDatabase();

  Line 793:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/integration-store.ts:
  Line 186: export function getDatabase(): D1LikeDatabase | undefined {

  Line 497:   const db = getDatabase();

  Line 738:   const db = getDatabase();

  Line 832:   const db = getDatabase();

  Line 861:   const db = getDatabase();

  Line 901:   const db = getDatabase();

  Line 1493:   const db = getDatabase();

  Line 1519:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/flow-runtime.ts:
  Line 4:   getDatabase,

  Line 1012:   const db = getDatabase();

  Line 1074:   const db = getDatabase();

  Line 1109:   const db = getDatabase();

  Line 1136:   const db = getDatabase();

  Line 1157:   const db = getDatabase();

  Line 1205:   const db = getDatabase();

  Line 1225:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/app-requests.ts:
  Line 3: import { getDatabase } from "@/lib/server/integration-store";

  Line 22:   const db = getDatabase();

  Line 63:   const db = getDatabase();

  Line 98:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/trigger-runtime.ts:
  Line 3: import { getEnvBinding, getDatabase, type D1LikeDatabase } from "@/lib/server/integration-store";

  Line 135:   const db = getDatabase();


/Users/hithesh/clawlink/src/lib/server/api-keys.ts:
  Line 6:   getDatabase,

  Line 44:   const db = getDatabase();

  Line 74:   const db = getDatabase();

  Line 121:   const db = getDatabase();

  Line 139:   const db = getDatabase();

```

---

## Assistant (Build · Claude Opus 4.6 · 3.3s)

**Tool: grep**

**Input:**
```json
{
  "include": "integration-store.ts",
  "path": "/Users/hithesh/clawlink/src/lib/server",
  "pattern": "getEnvBinding|getDatabase"
}
```

**Output:**
```
Found 11 matches
/Users/hithesh/clawlink/src/lib/server/integration-store.ts:
  Line 176: export function getEnvBinding<T>(key: string): T | undefined {

  Line 186: export function getDatabase(): D1LikeDatabase | undefined {

  Line 187:   return getEnvBinding<D1LikeDatabase>("DB");

  Line 191:   return getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY");

  Line 497:   const db = getDatabase();

  Line 738:   const db = getDatabase();

  Line 832:   const db = getDatabase();

  Line 861:   const db = getDatabase();

  Line 901:   const db = getDatabase();

  Line 1493:   const db = getDatabase();

  Line 1519:   const db = getDatabase();

```

---

## Assistant (Build · Claude Opus 4.6 · 4.1s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/integration-store.ts",
  "offset": 170,
  "limit": 30
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/lib/server/integration-store.ts</path>
<type>file</type>
<content>
170:     };
171:   } catch {
172:     return undefined;
173:   }
174: }
175: 
176: export function getEnvBinding<T>(key: string): T | undefined {
177:   const context = getOptionalRequestContext();
178:   const contextValue = (context?.env as Record<string, unknown> | undefined)?.[key];
179:   if (contextValue !== undefined) {
180:     return contextValue as T;
181:   }
182: 
183:   return (process.env as Record<string, unknown>)[key] as T | undefined;
184: }
185: 
186: export function getDatabase(): D1LikeDatabase | undefined {
187:   return getEnvBinding<D1LikeDatabase>("DB");
188: }
189: 
190: function getEncryptionKey(): string | undefined {
191:   return getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY");
192: }
193: 
194: function encodeBase64(bytes: Uint8Array): string {
195:   if (typeof btoa === "function") {
196:     return btoa(String.fromCharCode(...bytes));
197:   }
198: 
199:   return Buffer.from(bytes).toString("base64");

(Showing lines 170-199 of 1658. Use offset=200 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 11.2s)

Good -- the frontend uses `getEnvBinding` to access Cloudflare bindings from the OpenNext request context. I can use `getEnvBinding("CREDENTIALS")` to get the KV namespace and build an env-like record from process.env for Composio config.

Now let me update the `tool-registry.ts`. The key functions that return tools to the dashboard are `listToolDescriptionsForIntegration`, `listToolsForUser`, and `describeToolForUser`. I need to hydrate schemas in these async paths:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts",
  "newString": "import \"server-only\";\n\nimport { getIntegrationBySlug } from \"@/data/integrations\";\nimport {\n  getDatabase,\n  getEnvBinding,\n  listIntegrationConnectionsForUserId,\n  type IntegrationConnectionRecord,\n} from \"@/lib/server/integration-store\";\nimport {\n  getAllRegisteredTools,\n  listComposioToolsForIntegration,\n  listHandlerToolsForIntegration,\n  listPipedreamToolsForIntegration,\n  type IntegrationTool,\n  type IntegrationToolExample,\n  type ToolAccessLevel,\n} from \"../../../worker/integrations\";\nimport { hydrateComposioToolSchemas } from \"@/lib/composio/manifest-registry\";\nimport { summarizeToolPolicy } from \"@/lib/server/policy\";\nimport type { ToolMode, ToolRisk } from \"@/lib/runtime/tool-runtime\";",
  "oldString": "import \"server-only\";\n\nimport { getIntegrationBySlug } from \"@/data/integrations\";\nimport {\n  getDatabase,\n  listIntegrationConnectionsForUserId,\n  type IntegrationConnectionRecord,\n} from \"@/lib/server/integration-store\";\nimport {\n  getAllRegisteredTools,\n  listComposioToolsForIntegration,\n  listHandlerToolsForIntegration,\n  listPipedreamToolsForIntegration,\n  type IntegrationTool,\n  type IntegrationToolExample,\n  type ToolAccessLevel,\n} from \"../../../worker/integrations\";\nimport { summarizeToolPolicy } from \"@/lib/server/policy\";\nimport type { ToolMode, ToolRisk } from \"@/lib/runtime/tool-runtime\";"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 9.9s)

Now I need to add a helper that hydrates tools via the frontend's bindings and update the async functions. Let me add the helper after the existing imports/types:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts",
  "newString": "function hasGuidance(tool: IntegrationTool): boolean {\n  return (\n    tool.whenToUse.length > 0 ||\n    tool.askBefore.length > 0 ||\n    tool.examples.length > 0 ||\n    tool.followups.length > 0 ||\n    Object.keys(tool.safeDefaults).length > 0\n  );\n}\n\nfunction isPipedreamBackedConnection(connection: IntegrationConnectionRecord): boolean {\n  return connection.authBackend === \"pipedream\" && Boolean(connection.pipedreamAccountId);\n}\n\nfunction isComposioBackedConnection(connection: IntegrationConnectionRecord): boolean {\n  return connection.authBackend === \"composio\" && Boolean(connection.composioConnectedAccountId);\n}\n\n/**\n * Hydrate inputSchema for Composio-backed tools using the frontend's\n * Cloudflare bindings (CREDENTIALS KV + process.env for API keys).\n */\nasync function hydrateSchemas(tools: IntegrationTool[]): Promise<void> {\n  const composioTools = tools.filter((tool) => tool.execution.kind === \"composio_tool\");\n  if (composioTools.length === 0) return;\n\n  const kv = getEnvBinding<KVNamespace>(\"CREDENTIALS\");\n  await hydrateComposioToolSchemas(composioTools, kv, undefined);\n}",
  "oldString": "function hasGuidance(tool: IntegrationTool): boolean {\n  return (\n    tool.whenToUse.length > 0 ||\n    tool.askBefore.length > 0 ||\n    tool.examples.length > 0 ||\n    tool.followups.length > 0 ||\n    Object.keys(tool.safeDefaults).length > 0\n  );\n}\n\nfunction isPipedreamBackedConnection(connection: IntegrationConnectionRecord): boolean {\n  return connection.authBackend === \"pipedream\" && Boolean(connection.pipedreamAccountId);\n}\n\nfunction isComposioBackedConnection(connection: IntegrationConnectionRecord): boolean {\n  return connection.authBackend === \"composio\" && Boolean(connection.composioConnectedAccountId);\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 5.7s)

Now add `hydrateSchemas` calls in the three async paths that serve tool data. First `listToolsForUser`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts",
  "newString": "export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {\n  const entries = await listConnectedToolEntries(userId);\n  const tools = entries.map((entry) => entry.tool);\n  await hydrateSchemas(tools);\n  return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));\n}",
  "oldString": "export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {\n  const entries = await listConnectedToolEntries(userId);\n  return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 5.6s)

Now `describeToolForUser`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts",
  "newString": "export async function describeToolForUser(\n  userId: string,\n  toolName: string,\n): Promise<ToolDescription | null> {\n  const entries = await listConnectedToolEntries(userId);\n  const match = entries.find(({ tool }) => tool.name === toolName);\n\n  if (!match) {\n    return null;\n  }\n\n  await hydrateSchemas([match.tool]);\n  return buildToolDescription(match.tool, match.connections);\n}",
  "oldString": "export async function describeToolForUser(\n  userId: string,\n  toolName: string,\n): Promise<ToolDescription | null> {\n  const entries = await listConnectedToolEntries(userId);\n  const match = entries.find(({ tool }) => tool.name === toolName);\n\n  if (!match) {\n    return null;\n  }\n\n  return buildToolDescription(match.tool, match.connections);\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 7.1s)

Now `listToolDescriptionsForIntegration`:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/lib/server/tool-registry.ts",
  "newString": "  const uniqueDefinitions = new Map<string, IntegrationTool>();\n  for (const tool of definitions) {\n    if (!uniqueDefinitions.has(tool.name)) {\n      uniqueDefinitions.set(tool.name, tool);\n    }\n  }\n\n  const sortedTools = Array.from(uniqueDefinitions.values())\n    .sort((left, right) => left.name.localeCompare(right.name));\n\n  // Hydrate Composio tool schemas from KV / API before building descriptions.\n  await hydrateSchemas(sortedTools);\n\n  return sortedTools.map((tool) =>\n    buildToolDescription(\n      tool,\n      tool.execution.kind === \"pipedream_action\"\n        ? pipedreamConnections\n        : tool.execution.kind === \"composio_tool\"\n          ? composioConnections\n          : connections,\n    ),\n  );\n}",
  "oldString": "  const uniqueDefinitions = new Map<string, IntegrationTool>();\n  for (const tool of definitions) {\n    if (!uniqueDefinitions.has(tool.name)) {\n      uniqueDefinitions.set(tool.name, tool);\n    }\n  }\n\n  return Array.from(uniqueDefinitions.values())\n    .sort((left, right) => left.name.localeCompare(right.name))\n    .map((tool) =>\n      buildToolDescription(\n        tool,\n        tool.execution.kind === \"pipedream_action\"\n          ? pipedreamConnections\n          : tool.execution.kind === \"composio_tool\"\n            ? composioConnections\n            : connections,\n      ),\n    );\n}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 7.4s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 4.5s)

### Step 7: Regenerate all Composio manifests without inputSchema

Let me first list all 49 toolkit slugs from the existing manifest files, then run the import script for each one:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/generated/composio-manifests/index.ts"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/generated/composio-manifests/index.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: import { activecampaignComposioTools } from "./activecampaign.generated";
3: import { ahrefsComposioTools } from "./ahrefs.generated";
4: import { airtableComposioTools } from "./airtable.generated";
5: import { apolloComposioTools } from "./apollo.generated";
6: import { brevoComposioTools } from "./brevo.generated";
7: import { calendlyComposioTools } from "./calendly.generated";
8: import { clickupComposioTools } from "./clickup.generated";
9: import { dataforseoComposioTools } from "./dataforseo.generated";
10: import { docusignComposioTools } from "./docusign.generated";
11: import { dropboxComposioTools } from "./dropbox.generated";
12: import { elevenlabsComposioTools } from "./elevenlabs.generated";
13: import { facebookComposioTools } from "./facebook.generated";
14: import { gmailComposioTools } from "./gmail.generated";
15: import { googleAdsComposioTools } from "./google-ads.generated";
16: import { googleAnalyticsComposioTools } from "./google-analytics.generated";
17: import { googleCalendarComposioTools } from "./google-calendar.generated";
18: import { googleDocsComposioTools } from "./google-docs.generated";
19: import { googleSearchConsoleComposioTools } from "./google-search-console.generated";
20: import { highlevelComposioTools } from "./highlevel.generated";
21: import { hubspotComposioTools } from "./hubspot.generated";
22: import { instagramComposioTools } from "./instagram.generated";
23: import { instantlyComposioTools } from "./instantly.generated";
24: import { kitComposioTools } from "./kit.generated";
25: import { klaviyoComposioTools } from "./klaviyo.generated";
26: import { lemlistComposioTools } from "./lemlist.generated";
27: import { linkedinComposioTools } from "./linkedin.generated";
28: import { mailchimpComposioTools } from "./mailchimp.generated";
29: import { mailerliteComposioTools } from "./mailerlite.generated";
30: import { motionComposioTools } from "./motion.generated";
31: import { notionComposioTools } from "./notion.generated";
32: import { omnisendComposioTools } from "./omnisend.generated";
33: import { onedriveComposioTools } from "./onedrive.generated";
34: import { outlookComposioTools } from "./outlook.generated";
35: import { phantombusterComposioTools } from "./phantombuster.generated";
36: import { postizComposioTools } from "./postiz.generated";
37: import { postmarkComposioTools } from "./postmark.generated";
38: import { redditAdsComposioTools } from "./reddit-ads.generated";
39: import { resendComposioTools } from "./resend.generated";
40: import { salesforceComposioTools } from "./salesforce.generated";
41: import { semrushComposioTools } from "./semrush.generated";
42: import { sendgridComposioTools } from "./sendgrid.generated";
43: import { shopifyComposioTools } from "./shopify.generated";
44: import { snapchatComposioTools } from "./snapchat.generated";
45: import { stripeComposioTools } from "./stripe.generated";
46: import { twilioComposioTools } from "./twilio.generated";
47: import { twitterComposioTools } from "./twitter.generated";
48: import { xeroComposioTools } from "./xero.generated";
49: import { youtubeComposioTools } from "./youtube.generated";
50: 
51: export const composioToolManifests: IntegrationTool[] = [
52:   ...activecampaignComposioTools,
53:   ...ahrefsComposioTools,
54:   ...airtableComposioTools,
55:   ...apolloComposioTools,
56:   ...brevoComposioTools,
57:   ...calendlyComposioTools,
58:   ...clickupComposioTools,
59:   ...dataforseoComposioTools,
60:   ...docusignComposioTools,
61:   ...dropboxComposioTools,
62:   ...elevenlabsComposioTools,
63:   ...facebookComposioTools,
64:   ...gmailComposioTools,
65:   ...googleAdsComposioTools,
66:   ...googleAnalyticsComposioTools,
67:   ...googleCalendarComposioTools,
68:   ...googleDocsComposioTools,
69:   ...googleSearchConsoleComposioTools,
70:   ...highlevelComposioTools,
71:   ...hubspotComposioTools,
72:   ...instagramComposioTools,
73:   ...instantlyComposioTools,
74:   ...kitComposioTools,
75:   ...klaviyoComposioTools,
76:   ...lemlistComposioTools,
77:   ...linkedinComposioTools,
78:   ...mailchimpComposioTools,
79:   ...mailerliteComposioTools,
80:   ...motionComposioTools,
81:   ...notionComposioTools,
82:   ...omnisendComposioTools,
83:   ...onedriveComposioTools,
84:   ...outlookComposioTools,
85:   ...phantombusterComposioTools,
86:   ...postizComposioTools,
87:   ...postmarkComposioTools,
88:   ...redditAdsComposioTools,
89:   ...resendComposioTools,
90:   ...salesforceComposioTools,
91:   ...semrushComposioTools,
92:   ...sendgridComposioTools,
93:   ...shopifyComposioTools,
94:   ...snapchatComposioTools,
95:   ...stripeComposioTools,
96:   ...twilioComposioTools,
97:   ...twitterComposioTools,
98:   ...xeroComposioTools,
99:   ...youtubeComposioTools,
100: ];

(End of file - total 100 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 4.4s)

I need to extract the toolkit-to-integration mapping from the COMPOSIO_TOOLKIT_MAP in wrangler.worker.toml. Let me build a script that re-imports all of them:

**Tool: bash**

**Input:**
```json
{
  "command": "du -sh /Users/hithesh/clawlink/src/generated/composio-manifests/",
  "description": "Check current manifest directory size"
}
```

**Output:**
```
 13M	/Users/hithesh/clawlink/src/generated/composio-manifests/

```

---

## Assistant (Build · Claude Opus 4.6 · 4.9s)

Now let me run the import for all toolkits. I need to extract the toolkit map to get toolkit-slug pairs. Looking at the COMPOSIO_TOOLKIT_MAP from wrangler:

**Tool: bash**

**Input:**
```json
{
  "command": "cat /Users/hithesh/clawlink/worker/wrangler.worker.toml | grep COMPOSIO_TOOLKIT_MAP",
  "description": "Get toolkit map for re-import"
}
```

**Output:**
```
COMPOSIO_TOOLKIT_MAP = "instantly=instantly,outlook=outlook,apollo=apollo,postiz=postiz_mcp,gmail=gmail,google-search-console=google_search_console,google-docs=googledocs,google-analytics=google_analytics,onedrive=one_drive,google-ads=googleads,hubspot=hubspot,google-calendar=googlecalendar,klaviyo=klaviyo,airtable=airtable,calendly=calendly,clickup=clickup,mailchimp=mailchimp,notion=notion,salesforce=salesforce,xero=xero,twilio=twilio,facebook=facebook,linkedin=linkedin,shopify=shopify,youtube=youtube,activecampaign=active_campaign,highlevel=highlevel,sendgrid=sendgrid,semrush=semrush,ahrefs=ahrefs,mailerlite=mailerlite,brevo=brevo,twitter=twitter,motion=motion,lemlist=lemlist,omnisend=omnisend,kit=kit,resend=resend,postmark=postmark,reddit-ads=reddit_ads,snapchat=snapchat,dataforseo=dataforseo,phantombuster=phantombuster,instagram=instagram,stripe=stripe,dropbox=dropbox,elevenlabs=elevenlabs,docusign=docusign"

```

---

## Assistant (Build · Claude Opus 4.6 · 9.5s)

I'll write a small helper script that iterates through all the integrations and re-runs the import:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && node -e \"\nconst map = 'instantly=instantly,outlook=outlook,apollo=apollo,postiz=postiz_mcp,gmail=gmail,google-search-console=google_search_console,google-docs=googledocs,google-analytics=google_analytics,onedrive=one_drive,google-ads=googleads,hubspot=hubspot,google-calendar=googlecalendar,klaviyo=klaviyo,airtable=airtable,calendly=calendly,clickup=clickup,mailchimp=mailchimp,notion=notion,salesforce=salesforce,xero=xero,twilio=twilio,facebook=facebook,linkedin=linkedin,shopify=shopify,youtube=youtube,activecampaign=active_campaign,highlevel=highlevel,sendgrid=sendgrid,semrush=semrush,ahrefs=ahrefs,mailerlite=mailerlite,brevo=brevo,twitter=twitter,motion=motion,lemlist=lemlist,omnisend=omnisend,kit=kit,resend=resend,postmark=postmark,reddit-ads=reddit_ads,snapchat=snapchat,dataforseo=dataforseo,phantombuster=phantombuster,instagram=instagram,stripe=stripe,dropbox=dropbox,elevenlabs=elevenlabs,docusign=docusign';\nconst pairs = map.split(',').map(p => p.split('='));\nfor (const [integration, toolkit] of pairs) {\n  console.log('node scripts/import-composio-tools.mjs --toolkit ' + toolkit + ' --integration ' + integration);\n}\n\"\n",
  "description": "Generate re-import commands"
}
```

**Output:**
```
node scripts/import-composio-tools.mjs --toolkit instantly --integration instantly
node scripts/import-composio-tools.mjs --toolkit outlook --integration outlook
node scripts/import-composio-tools.mjs --toolkit apollo --integration apollo
node scripts/import-composio-tools.mjs --toolkit postiz_mcp --integration postiz
node scripts/import-composio-tools.mjs --toolkit gmail --integration gmail
node scripts/import-composio-tools.mjs --toolkit google_search_console --integration google-search-console
node scripts/import-composio-tools.mjs --toolkit googledocs --integration google-docs
node scripts/import-composio-tools.mjs --toolkit google_analytics --integration google-analytics
node scripts/import-composio-tools.mjs --toolkit one_drive --integration onedrive
node scripts/import-composio-tools.mjs --toolkit googleads --integration google-ads
node scripts/import-composio-tools.mjs --toolkit hubspot --integration hubspot
node scripts/import-composio-tools.mjs --toolkit googlecalendar --integration google-calendar
node scripts/import-composio-tools.mjs --toolkit klaviyo --integration klaviyo
node scripts/import-composio-tools.mjs --toolkit airtable --integration airtable
node scripts/import-composio-tools.mjs --toolkit calendly --integration calendly
node scripts/import-composio-tools.mjs --toolkit clickup --integration clickup
node scripts/import-composio-tools.mjs --toolkit mailchimp --integration mailchimp
node scripts/import-composio-tools.mjs --toolkit notion --integration notion
node scripts/import-composio-tools.mjs --toolkit salesforce --integration salesforce
node scripts/import-composio-tools.mjs --toolkit xero --integration xero
node scripts/import-composio-tools.mjs --toolkit twilio --integration twilio
node scripts/import-composio-tools.mjs --toolkit facebook --integration facebook
node scripts/import-composio-tools.mjs --toolkit linkedin --integration linkedin
node scripts/import-composio-tools.mjs --toolkit shopify --integration shopify
node scripts/import-composio-tools.mjs --toolkit youtube --integration youtube
node scripts/import-composio-tools.mjs --toolkit active_campaign --integration activecampaign
node scripts/import-composio-tools.mjs --toolkit highlevel --integration highlevel
node scripts/import-composio-tools.mjs --toolkit sendgrid --integration sendgrid
node scripts/import-composio-tools.mjs --toolkit semrush --integration semrush
node scripts/import-composio-tools.mjs --toolkit ahrefs --integration ahrefs
node scripts/import-composio-tools.mjs --toolkit mailerlite --integration mailerlite
node scripts/import-composio-tools.mjs --toolkit brevo --integration brevo
node scripts/import-composio-tools.mjs --toolkit twitter --integration twitter
node scripts/import-composio-tools.mjs --toolkit motion --integration motion
node scripts/import-composio-tools.mjs --toolkit lemlist --integration lemlist
node scripts/import-composio-tools.mjs --toolkit omnisend --integration omnisend
node scripts/import-composio-tools.mjs --toolkit kit --integration kit
node scripts/import-composio-tools.mjs --toolkit resend --integration resend
node scripts/import-composio-tools.mjs --toolkit postmark --integration postmark
node scripts/import-composio-tools.mjs --toolkit reddit_ads --integration reddit-ads
node scripts/import-composio-tools.mjs --toolkit snapchat --integration snapchat
node scripts/import-composio-tools.mjs --toolkit dataforseo --integration dataforseo
node scripts/import-composio-tools.mjs --toolkit phantombuster --integration phantombuster
node scripts/import-composio-tools.mjs --toolkit instagram --integration instagram
node scripts/import-composio-tools.mjs --toolkit stripe --integration stripe
node scripts/import-composio-tools.mjs --toolkit dropbox --integration dropbox
node scripts/import-composio-tools.mjs --toolkit elevenlabs --integration elevenlabs
node scripts/import-composio-tools.mjs --toolkit docusign --integration docusign

```

---

## Assistant (Build · Claude Opus 4.6 · 19.3s)

Now let me run them all. I'll batch them to avoid rate limits:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && \\\nnode scripts/import-composio-tools.mjs --toolkit instantly --integration instantly && \\\nnode scripts/import-composio-tools.mjs --toolkit outlook --integration outlook && \\\nnode scripts/import-composio-tools.mjs --toolkit apollo --integration apollo && \\\nnode scripts/import-composio-tools.mjs --toolkit postiz_mcp --integration postiz && \\\nnode scripts/import-composio-tools.mjs --toolkit gmail --integration gmail && \\\nnode scripts/import-composio-tools.mjs --toolkit google_search_console --integration google-search-console && \\\nnode scripts/import-composio-tools.mjs --toolkit googledocs --integration google-docs && \\\nnode scripts/import-composio-tools.mjs --toolkit google_analytics --integration google-analytics && \\\nnode scripts/import-composio-tools.mjs --toolkit one_drive --integration onedrive && \\\nnode scripts/import-composio-tools.mjs --toolkit googleads --integration google-ads && \\\nnode scripts/import-composio-tools.mjs --toolkit hubspot --integration hubspot && \\\nnode scripts/import-composio-tools.mjs --toolkit googlecalendar --integration google-calendar\n",
  "description": "Re-import first batch of Composio manifests",
  "timeout": 300000
}
```

**Output:**
```
Fetching tools for toolkit "instantly" from Composio...
Composio returned 117 tools.
Toolkit version: 20260429_00
Composio toolkit slug: instantly
Skipping 2 deprecated tool(s): INSTANTLY_GET_LEAD_LABELS, INSTANTLY_LIST_API_KEYS

Tool breakdown for instantly:
  Read (safe):         61
  Write (confirm):     42
  Write (high_impact): 12
  Total:             115

Wrote 115 tools to src/generated/composio-manifests/instantly.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 115 Composio tools for instantly.
Fetching tools for toolkit "outlook" from Composio...
Composio returned 301 tools.
Toolkit version: 20260501_00
Composio toolkit slug: outlook
Skipping 19 deprecated tool(s): OUTLOOK_CREATE_CALENDAR_EVENT, OUTLOOK_CREATE_MASTER_CATEGORY, OUTLOOK_CREATE_ME_MAIL_FOLDER_MESSAGE_REPLY_ALL_DRAFT, OUTLOOK_CREATE_ME_REPLY_DRAFT, OUTLOOK_CREATE_USER_EVENT_ATTACHMENT_UPLOAD_SESSION, OUTLOOK_DELETE_EVENT, OUTLOOK_DELETE_ME_MAIL_FOLDERS_MESSAGES_ATTACHMENTS, OUTLOOK_DELETE_MESSAGE_PERMANENTLY_FROM_FOLDER, OUTLOOK_DELETE_USER_CONTACT_EXTENSION, OUTLOOK_DELETE_USER_MESSAGE_ATTACHMENT, OUTLOOK_GET_CALENDAR, OUTLOOK_GET_CALENDAR_GROUP_EVENT_ATTACHMENT, OUTLOOK_GET_ME_MAIL_FOLDER_MESSAGE_ATTACHMENT, OUTLOOK_LIST_CALENDAR_CALENDAR_VIEW, OUTLOOK_LIST_CONTACTS, OUTLOOK_LIST_MASTER_CATEGORIES, OUTLOOK_LIST_ME_EVENT_INSTANCES, OUTLOOK_UPDATE_USER_CALENDAR_CALENDAR_EVENT, OUTLOOK_UPDATE_USER_EVENT_EXTENSION

Tool breakdown for outlook:
  Read (safe):         108
  Write (confirm):     120
  Write (high_impact): 54
  Total:             282

Wrote 282 tools to src/generated/composio-manifests/outlook.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 282 Composio tools for outlook.
Fetching tools for toolkit "apollo" from Composio...
Composio returned 48 tools.
Toolkit version: 20260429_00
Composio toolkit slug: apollo

Tool breakdown for apollo:
  Read (safe):         29
  Write (confirm):     18
  Write (high_impact): 1
  Total:             48

Wrote 48 tools to src/generated/composio-manifests/apollo.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 48 Composio tools for apollo.
Fetching tools for toolkit "postiz_mcp" from Composio...
Composio returned 9 tools.
Toolkit version: 20260303_02
Composio toolkit slug: postiz_mcp

Tool breakdown for postiz:
  Read (safe):         0
  Write (confirm):     9
  Write (high_impact): 0
  Total:             9

Wrote 9 tools to src/generated/composio-manifests/postiz.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 9 Composio tools for postiz.
Fetching tools for toolkit "gmail" from Composio...
Composio returned 63 tools.
Toolkit version: 20260430_00
Composio toolkit slug: gmail
Skipping 2 deprecated tool(s): GMAIL_LIST_MESSAGES, GMAIL_REMOVE_LABEL

Tool breakdown for gmail:
  Read (safe):         28
  Write (confirm):     25
  Write (high_impact): 8
  Total:             61

Wrote 61 tools to src/generated/composio-manifests/gmail.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 61 Composio tools for gmail.
Fetching tools for toolkit "google_search_console" from Composio...
Composio returned 9 tools.
Toolkit version: 20260429_00
Composio toolkit slug: google_search_console

Tool breakdown for google-search-console:
  Read (safe):         6
  Write (confirm):     2
  Write (high_impact): 1
  Total:             9

Wrote 9 tools to src/generated/composio-manifests/google-search-console.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 9 Composio tools for google-search-console.
Fetching tools for toolkit "googledocs" from Composio...
Composio returned 35 tools.
Toolkit version: 20260501_01
Composio toolkit slug: googledocs
Skipping 2 deprecated tool(s): GOOGLEDOCS_CREATE_DOCUMENT2, GOOGLEDOCS_UPDATE_DOCUMENT_BATCH

Tool breakdown for google-docs:
  Read (safe):         5
  Write (confirm):     22
  Write (high_impact): 6
  Total:             33

Wrote 33 tools to src/generated/composio-manifests/google-docs.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 33 Composio tools for google-docs.
Fetching tools for toolkit "google_analytics" from Composio...
Composio returned 69 tools.
Toolkit version: 20260501_00
Composio toolkit slug: google_analytics
Skipping 2 deprecated tool(s): GOOGLE_ANALYTICS_LIST_ACCOUNTS, GOOGLE_ANALYTICS_LIST_PROPERTIES

Tool breakdown for google-analytics:
  Read (safe):         55
  Write (confirm):     11
  Write (high_impact): 1
  Total:             67

Wrote 67 tools to src/generated/composio-manifests/google-analytics.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 67 Composio tools for google-analytics.
Fetching tools for toolkit "one_drive" from Composio...
Composio returned 60 tools.
Toolkit version: 20260429_01
Composio toolkit slug: one_drive

Tool breakdown for onedrive:
  Read (safe):         38
  Write (confirm):     16
  Write (high_impact): 6
  Total:             60

Wrote 60 tools to src/generated/composio-manifests/onedrive.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 60 Composio tools for onedrive.
Fetching tools for toolkit "googleads" from Composio...
Composio returned 9 tools.
Toolkit version: 20260429_00
Composio toolkit slug: googleads

Tool breakdown for google-ads:
  Read (safe):         5
  Write (confirm):     2
  Write (high_impact): 2
  Total:             9

Wrote 9 tools to src/generated/composio-manifests/google-ads.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 9 Composio tools for google-ads.
Fetching tools for toolkit "hubspot" from Composio...
Composio returned 233 tools.
Toolkit version: 20260501_00
Composio toolkit slug: hubspot
Skipping 1 deprecated tool(s): HUBSPOT_PURGE_SCHEMA

Tool breakdown for hubspot:
  Read (safe):         92
  Write (confirm):     86
  Write (high_impact): 54
  Total:             232

Wrote 232 tools to src/generated/composio-manifests/hubspot.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 232 Composio tools for hubspot.
Fetching tools for toolkit "googlecalendar" from Composio...
Composio returned 48 tools.
Toolkit version: 20260429_00
Composio toolkit slug: googlecalendar
Skipping 4 deprecated tool(s): GOOGLECALENDAR_FREE_BUSY_QUERY, GOOGLECALENDAR_GET_CALENDAR_PROFILE, GOOGLECALENDAR_LIST_SETTINGS, GOOGLECALENDAR_SYNC_EVENTS

Tool breakdown for google-calendar:
  Read (safe):         17
  Write (confirm):     19
  Write (high_impact): 8
  Total:             44

Wrote 44 tools to src/generated/composio-manifests/google-calendar.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 44 Composio tools for google-calendar.

```

---

## Assistant (Build · Claude Opus 4.6 · 15.2s)

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && \\\nnode scripts/import-composio-tools.mjs --toolkit klaviyo --integration klaviyo && \\\nnode scripts/import-composio-tools.mjs --toolkit airtable --integration airtable && \\\nnode scripts/import-composio-tools.mjs --toolkit calendly --integration calendly && \\\nnode scripts/import-composio-tools.mjs --toolkit clickup --integration clickup && \\\nnode scripts/import-composio-tools.mjs --toolkit mailchimp --integration mailchimp && \\\nnode scripts/import-composio-tools.mjs --toolkit notion --integration notion && \\\nnode scripts/import-composio-tools.mjs --toolkit salesforce --integration salesforce && \\\nnode scripts/import-composio-tools.mjs --toolkit xero --integration xero && \\\nnode scripts/import-composio-tools.mjs --toolkit twilio --integration twilio && \\\nnode scripts/import-composio-tools.mjs --toolkit facebook --integration facebook && \\\nnode scripts/import-composio-tools.mjs --toolkit linkedin --integration linkedin && \\\nnode scripts/import-composio-tools.mjs --toolkit shopify --integration shopify\n",
  "description": "Re-import second batch of Composio manifests",
  "timeout": 300000
}
```

**Output:**
```
Fetching tools for toolkit "klaviyo" from Composio...
Composio returned 225 tools.
Toolkit version: 20260501_00
Composio toolkit slug: klaviyo

Tool breakdown for klaviyo:
  Read (safe):         133
  Write (confirm):     65
  Write (high_impact): 27
  Total:             225

Wrote 225 tools to src/generated/composio-manifests/klaviyo.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 225 Composio tools for klaviyo.
Fetching tools for toolkit "airtable" from Composio...
Composio returned 25 tools.
Toolkit version: 20260501_00
Composio toolkit slug: airtable
Skipping 2 deprecated tool(s): AIRTABLE_CREATE_MULTIPLE_RECORDS, AIRTABLE_CREATE_RECORD

Tool breakdown for airtable:
  Read (safe):         6
  Write (confirm):     14
  Write (high_impact): 3
  Total:             23

Wrote 23 tools to src/generated/composio-manifests/airtable.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 23 Composio tools for airtable.
Fetching tools for toolkit "calendly" from Composio...
Composio returned 55 tools.
Toolkit version: 20260429_00
Composio toolkit slug: calendly
Skipping 4 deprecated tool(s): CALENDLY_CREATE_EVENT_INVITEE, CALENDLY_GET_CURRENT_USER, CALENDLY_LIST_EVENTS, CALENDLY_LIST_USER_S_EVENT_TYPES

Tool breakdown for calendly:
  Read (safe):         32
  Write (confirm):     11
  Write (high_impact): 8
  Total:             51

Wrote 51 tools to src/generated/composio-manifests/calendly.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 51 Composio tools for calendly.
Fetching tools for toolkit "clickup" from Composio...
Composio returned 163 tools.
Toolkit version: 20260429_00
Composio toolkit slug: clickup
Skipping 2 deprecated tool(s): CLICKUP_ATTACHMENTS_UPLOAD_FILE_TO_TASK_AS_ATTACHMENT, CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST

Tool breakdown for clickup:
  Read (safe):         62
  Write (confirm):     71
  Write (high_impact): 28
  Total:             161

Wrote 161 tools to src/generated/composio-manifests/clickup.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 161 Composio tools for clickup.
Fetching tools for toolkit "mailchimp" from Composio...
Composio returned 275 tools.
Toolkit version: 20260429_00
Composio toolkit slug: mailchimp
Skipping 3 deprecated tool(s): MAILCHIMP_GET_CONVERSATION, MAILCHIMP_LIST_CONVERSATIONS, MAILCHIMP_LIST_MESSAGES

Tool breakdown for mailchimp:
  Read (safe):         141
  Write (confirm):     89
  Write (high_impact): 42
  Total:             272

Wrote 272 tools to src/generated/composio-manifests/mailchimp.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 272 Composio tools for mailchimp.
Fetching tools for toolkit "notion" from Composio...
Composio returned 48 tools.
Toolkit version: 20260501_00
Composio toolkit slug: notion
Skipping 3 deprecated tool(s): NOTION_ADD_PAGE_CONTENT, NOTION_APPEND_BLOCK_CHILDREN, NOTION_GET_ABOUT_ME

Tool breakdown for notion:
  Read (safe):         21
  Write (confirm):     20
  Write (high_impact): 4
  Total:             45

Wrote 45 tools to src/generated/composio-manifests/notion.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 45 Composio tools for notion.
Fetching tools for toolkit "salesforce" from Composio...
Composio returned 216 tools.
Toolkit version: 20260501_00
Composio toolkit slug: salesforce
Skipping 37 deprecated tool(s): SALESFORCE_ACCOUNT_CREATION_WITH_CONTENT_TYPE_OPTION, SALESFORCE_COMPOSITE_GRAPH_ACTION, SALESFORCE_CREATE_CAMPAIGN_RECORD_VIA_POST, SALESFORCE_CREATE_LEAD_WITH_SPECIFIED_CONTENT_TYPE, SALESFORCE_CREATE_NEW_CONTACT_WITH_JSON_HEADER, SALESFORCE_CREATE_NOTE_RECORD_WITH_CONTENT_TYPE_HEADER, SALESFORCE_CREATE_OPPORTUNITY_RECORD, SALESFORCE_DELETE_A_LEAD_OBJECT_BY_ITS_ID, SALESFORCE_EXECUTE_SOQL_QUERY, SALESFORCE_FETCH_ACCOUNT_BY_ID_WITH_QUERY, SALESFORCE_GET_NOTE_BY_ID_WITH_FIELDS, SALESFORCE_GET_REPORT, SALESFORCE_GET_REPORT_INSTANCE, SALESFORCE_GET_UIAPIMRU_LIST_INFO_ACCOUNT, SALESFORCE_GET_UI_API_MRU_LIST_RECORDS_ACCOUNT, SALESFORCE_QUERY, SALESFORCE_QUERY_CONTACTS_BY_NAME, SALESFORCE_QUERY_REPORT, SALESFORCE_REMOVE_ACCOUNT_BY_UNIQUE_IDENTIFIER, SALESFORCE_REMOVE_A_SPECIFIC_CONTACT_BY_ID, SALESFORCE_REMOVE_CAMPAIGN_OBJECT_BY_ID, SALESFORCE_REMOVE_NOTE_OBJECT_BY_ID, SALESFORCE_REMOVE_OPPORTUNITY_BY_ID, SALESFORCE_RETRIEVE_ACCOUNT_DATA_AND_ERROR_RESPONSES, SALESFORCE_RETRIEVE_CAMPAIGN_DATA_WITH_ERROR_HANDLING, SALESFORCE_RETRIEVE_CONTACT_INFO_WITH_STANDARD_RESPONSES, SALESFORCE_RETRIEVE_LEAD_DATA_WITH_VARIOUS_RESPONSES, SALESFORCE_RETRIEVE_NOTE_OBJECT_INFORMATION, SALESFORCE_RETRIEVE_OPPORTUNITY_BY_ID_WITH_OPTIONAL_FIELDS, SALESFORCE_RETRIEVE_SPECIFIC_CAMPAIGN_OBJECT_DETAILS, SALESFORCE_SEARCH, SALESFORCE_UPDATE_ACCOUNT_OBJECT_BY_ID, SALESFORCE_UPDATE_CAMPAIGN_BY_ID_WITH_JSON, SALESFORCE_UPDATE_CONTACT_BY_ID, SALESFORCE_UPDATE_LEAD_BY_ID_WITH_JSON_PAYLOAD, SALESFORCE_UPDATE_OPPORTUNITY_BY_ID, SALESFORCE_UPDATE_SPECIFIC_NOTE_BY_ID

Tool breakdown for salesforce:
  Read (safe):         121
  Write (confirm):     44
  Write (high_impact): 14
  Total:             179

Wrote 179 tools to src/generated/composio-manifests/salesforce.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 179 Composio tools for salesforce.
Fetching tools for toolkit "xero" from Composio...
Composio returned 41 tools.
Toolkit version: 20260501_00
Composio toolkit slug: xero

Tool breakdown for xero:
  Read (safe):         31
  Write (confirm):     10
  Write (high_impact): 0
  Total:             41

Wrote 41 tools to src/generated/composio-manifests/xero.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 41 Composio tools for xero.
Fetching tools for toolkit "twilio" from Composio...
Composio returned 0 tools.
No tools found for toolkit "twilio". Check the toolkit slug.

```

---

## Assistant (Build · Claude Opus 4.6 · 21.9s)

Twilio failed. Let me check what toolkit version it uses and handle it separately. Let me continue with the rest first:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && \\\nnode scripts/import-composio-tools.mjs --toolkit facebook --integration facebook && \\\nnode scripts/import-composio-tools.mjs --toolkit linkedin --integration linkedin && \\\nnode scripts/import-composio-tools.mjs --toolkit shopify --integration shopify && \\\nnode scripts/import-composio-tools.mjs --toolkit youtube --integration youtube && \\\nnode scripts/import-composio-tools.mjs --toolkit active_campaign --integration activecampaign && \\\nnode scripts/import-composio-tools.mjs --toolkit highlevel --integration highlevel && \\\nnode scripts/import-composio-tools.mjs --toolkit sendgrid --integration sendgrid && \\\nnode scripts/import-composio-tools.mjs --toolkit semrush --integration semrush && \\\nnode scripts/import-composio-tools.mjs --toolkit ahrefs --integration ahrefs && \\\nnode scripts/import-composio-tools.mjs --toolkit mailerlite --integration mailerlite && \\\nnode scripts/import-composio-tools.mjs --toolkit brevo --integration brevo && \\\nnode scripts/import-composio-tools.mjs --toolkit twitter --integration twitter\n",
  "description": "Re-import third batch of Composio manifests",
  "timeout": 300000
}
```

**Output:**
```
Fetching tools for toolkit "facebook" from Composio...
Composio returned 43 tools.
Toolkit version: 20260429_00
Composio toolkit slug: facebook
Skipping 4 deprecated tool(s): FACEBOOK_GET_USER_PAGES, FACEBOOK_SEARCH_PAGES, FACEBOOK_UPLOAD_PHOTO, FACEBOOK_UPLOAD_VIDEO

Tool breakdown for facebook:
  Read (safe):         18
  Write (confirm):     17
  Write (high_impact): 4
  Total:             39

Wrote 39 tools to src/generated/composio-manifests/facebook.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 39 Composio tools for facebook.
Fetching tools for toolkit "linkedin" from Composio...
Composio returned 22 tools.
Toolkit version: 20260424_00
Composio toolkit slug: linkedin

Tool breakdown for linkedin:
  Read (safe):         14
  Write (confirm):     5
  Write (high_impact): 3
  Total:             22

Wrote 22 tools to src/generated/composio-manifests/linkedin.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 22 Composio tools for linkedin.
Fetching tools for toolkit "shopify" from Composio...
Composio returned 394 tools.
Toolkit version: 20260501_00
Composio toolkit slug: shopify
Skipping 33 deprecated tool(s): SHOPIFY_ACTIVATE_ONE_TIME_CHARGE, SHOPIFY_ADD_PRODUCT_TO_COLLECTION, SHOPIFY_COUNT_ORDER, SHOPIFY_COUNT_SCRIPT_TAGS, SHOPIFY_CREATE_COUNTRY, SHOPIFY_CREATE_ORDER_RISK, SHOPIFY_CREATE_PRODUCT, SHOPIFY_CREATE_PRODUCT_IMAGE, SHOPIFY_DELETE_COUNTRY, SHOPIFY_DELETE_CUSTOM_COLLECTION, SHOPIFY_DELETE_FULFILLMENT_EVENT, SHOPIFY_DELETE_ORDER_RISK, SHOPIFY_DELETE_SCRIPT_TAG, SHOPIFY_GET_COUNTRIES_COUNT, SHOPIFY_GET_FULFILLMENT_EVENT, SHOPIFY_GET_ORDER_RISKS, SHOPIFY_GET_PRICE_RULE, SHOPIFY_GET_SHOP_CONFIGURATION, SHOPIFY_GET_SHOP_METAFIELDS, SHOPIFY_LIST_ABANDONED_CHECKOUTS, SHOPIFY_LIST_COUNTRIES, SHOPIFY_RETRIEVES_A_LIST_OF_ABANDONED_CHECKOUTS, SHOPIFY_RETRIEVES_A_SINGLE_ORDER_RISK_BY_ITS_ID, SHOPIFY_RETRIEVES_A_SPECIFIC_FULFILLMENT_EVENT, SHOPIFY_UPDATE_COUNTRIES_PARAM_COUNTRY_ID, SHOPIFY_UPDATE_COUNTRIES_PARAM_COUNTRY_ID_PROVINCES_PARAM_PR, SHOPIFY_UPDATE_COUNTRY, SHOPIFY_UPDATE_EVENT_BRIDGE_WEBHOOK_SUBSCRIPTION, SHOPIFY_UPDATE_ORDER_RISK, SHOPIFY_UPDATE_PRODUCTS_PARAM_PRODUCT_ID, SHOPIFY_UPDATE_PROVINCE, SHOPIFY_UPDATES_AN_ARTICLE, SHOPIFY_VALIDATE_ACCESS

Tool breakdown for shopify:
  Read (safe):         214
  Write (confirm):     104
  Write (high_impact): 43
  Total:             361

Wrote 361 tools to src/generated/composio-manifests/shopify.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 361 Composio tools for shopify.
Fetching tools for toolkit "youtube" from Composio...
Composio returned 50 tools.
Toolkit version: 20260429_00
Composio toolkit slug: youtube
Skipping 3 deprecated tool(s): YOUTUBE_LIST_COMMENT_THREADS, YOUTUBE_LIST_MOST_POPULAR_VIDEOS, YOUTUBE_MARK_COMMENT_AS_SPAM

Tool breakdown for youtube:
  Read (safe):         22
  Write (confirm):     18
  Write (high_impact): 7
  Total:             47

Wrote 47 tools to src/generated/composio-manifests/youtube.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 47 Composio tools for youtube.
Fetching tools for toolkit "active_campaign" from Composio...
Composio returned 298 tools.
Toolkit version: 20260429_00
Composio toolkit slug: active_campaign

Tool breakdown for activecampaign:
  Read (safe):         148
  Write (confirm):     104
  Write (high_impact): 46
  Total:             298

Wrote 298 tools to src/generated/composio-manifests/activecampaign.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 298 Composio tools for activecampaign.
Fetching tools for toolkit "highlevel" from Composio...
Composio returned 94 tools.
Toolkit version: 20260501_00
Composio toolkit slug: highlevel

Tool breakdown for highlevel:
  Read (safe):         49
  Write (confirm):     28
  Write (high_impact): 17
  Total:             94

Wrote 94 tools to src/generated/composio-manifests/highlevel.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 94 Composio tools for highlevel.
Fetching tools for toolkit "sendgrid" from Composio...
Composio returned 364 tools.
Toolkit version: 20260429_00
Composio toolkit slug: sendgrid
Skipping 5 deprecated tool(s): SENDGRID_ADD_A_SINGLE_RECIPIENT_TO_A_LIST, SENDGRID_DELETE_A_RECIPIENT, SENDGRID_DELETE_A_SINGLE_RECIPIENT_FROM_A_SINGLE_LIST, SENDGRID_RETRIEVE_A_SINGLE_RECIPIENT, SENDGRID_SEND_A_TEST_CAMPAIGN

Tool breakdown for sendgrid:
  Read (safe):         177
  Write (confirm):     121
  Write (high_impact): 61
  Total:             359

Wrote 359 tools to src/generated/composio-manifests/sendgrid.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 359 Composio tools for sendgrid.
Fetching tools for toolkit "semrush" from Composio...
Composio returned 37 tools.
Toolkit version: 20260407_00
Composio toolkit slug: semrush

Tool breakdown for semrush:
  Read (safe):         37
  Write (confirm):     0
  Write (high_impact): 0
  Total:             37

Wrote 37 tools to src/generated/composio-manifests/semrush.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 37 Composio tools for semrush.
Fetching tools for toolkit "ahrefs" from Composio...
Composio returned 40 tools.
Toolkit version: 20260424_00
Composio toolkit slug: ahrefs

Tool breakdown for ahrefs:
  Read (safe):         40
  Write (confirm):     0
  Write (high_impact): 0
  Total:             40

Wrote 40 tools to src/generated/composio-manifests/ahrefs.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 40 Composio tools for ahrefs.
Fetching tools for toolkit "mailerlite" from Composio...
Composio returned 86 tools.
Toolkit version: 20260429_00
Composio toolkit slug: mailerlite

Tool breakdown for mailerlite:
  Read (safe):         38
  Write (confirm):     32
  Write (high_impact): 16
  Total:             86

Wrote 86 tools to src/generated/composio-manifests/mailerlite.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 86 Composio tools for mailerlite.
Fetching tools for toolkit "brevo" from Composio...
Composio returned 21 tools.
Toolkit version: 20260424_00
Composio toolkit slug: brevo

Tool breakdown for brevo:
  Read (safe):         12
  Write (confirm):     5
  Write (high_impact): 4
  Total:             21

Wrote 21 tools to src/generated/composio-manifests/brevo.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 21 Composio tools for brevo.
Fetching tools for toolkit "twitter" from Composio...
Composio returned 79 tools.
Toolkit version: 20260501_00
Composio toolkit slug: twitter
Skipping 1 deprecated tool(s): TWITTER_UPLOAD_LARGE_MEDIA

Tool breakdown for twitter:
  Read (safe):         47
  Write (confirm):     20
  Write (high_impact): 11
  Total:             78

Wrote 78 tools to src/generated/composio-manifests/twitter.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 78 Composio tools for twitter.

```

---

## Assistant (Build · Claude Opus 4.6 · 38.8s)

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && \\\nnode scripts/import-composio-tools.mjs --toolkit motion --integration motion && \\\nnode scripts/import-composio-tools.mjs --toolkit lemlist --integration lemlist && \\\nnode scripts/import-composio-tools.mjs --toolkit omnisend --integration omnisend && \\\nnode scripts/import-composio-tools.mjs --toolkit kit --integration kit && \\\nnode scripts/import-composio-tools.mjs --toolkit resend --integration resend && \\\nnode scripts/import-composio-tools.mjs --toolkit postmark --integration postmark && \\\nnode scripts/import-composio-tools.mjs --toolkit reddit_ads --integration reddit-ads && \\\nnode scripts/import-composio-tools.mjs --toolkit snapchat --integration snapchat && \\\nnode scripts/import-composio-tools.mjs --toolkit dataforseo --integration dataforseo && \\\nnode scripts/import-composio-tools.mjs --toolkit phantombuster --integration phantombuster && \\\nnode scripts/import-composio-tools.mjs --toolkit instagram --integration instagram && \\\nnode scripts/import-composio-tools.mjs --toolkit stripe --integration stripe && \\\nnode scripts/import-composio-tools.mjs --toolkit dropbox --integration dropbox && \\\nnode scripts/import-composio-tools.mjs --toolkit elevenlabs --integration elevenlabs && \\\nnode scripts/import-composio-tools.mjs --toolkit docusign --integration docusign\n",
  "description": "Re-import final batch of Composio manifests",
  "timeout": 300000
}
```

**Output:**
```
Fetching tools for toolkit "motion" from Composio...
Composio returned 27 tools.
Toolkit version: 20260429_00
Composio toolkit slug: motion

Tool breakdown for motion:
  Read (safe):         12
  Write (confirm):     9
  Write (high_impact): 6
  Total:             27

Wrote 27 tools to src/generated/composio-manifests/motion.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 27 Composio tools for motion.
Fetching tools for toolkit "lemlist" from Composio...
Composio returned 54 tools.
Toolkit version: 20260429_00
Composio toolkit slug: lemlist

Tool breakdown for lemlist:
  Read (safe):         28
  Write (confirm):     23
  Write (high_impact): 3
  Total:             54

Wrote 54 tools to src/generated/composio-manifests/lemlist.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 54 Composio tools for lemlist.
Fetching tools for toolkit "omnisend" from Composio...
Composio returned 43 tools.
Toolkit version: 20260501_00
Composio toolkit slug: omnisend

Tool breakdown for omnisend:
  Read (safe):         18
  Write (confirm):     19
  Write (high_impact): 6
  Total:             43

Wrote 43 tools to src/generated/composio-manifests/omnisend.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 43 Composio tools for omnisend.
Fetching tools for toolkit "kit" from Composio...
Composio returned 42 tools.
Toolkit version: 20260429_00
Composio toolkit slug: kit

Tool breakdown for kit:
  Read (safe):         22
  Write (confirm):     14
  Write (high_impact): 6
  Total:             42

Wrote 42 tools to src/generated/composio-manifests/kit.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 42 Composio tools for kit.
Fetching tools for toolkit "resend" from Composio...
Composio returned 62 tools.
Toolkit version: 20260429_00
Composio toolkit slug: resend

Tool breakdown for resend:
  Read (safe):         27
  Write (confirm):     23
  Write (high_impact): 12
  Total:             62

Wrote 62 tools to src/generated/composio-manifests/resend.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 62 Composio tools for resend.
Fetching tools for toolkit "postmark" from Composio...
Composio returned 46 tools.
Toolkit version: 20260429_00
Composio toolkit slug: postmark

Tool breakdown for postmark:
  Read (safe):         30
  Write (confirm):     11
  Write (high_impact): 5
  Total:             46

Wrote 46 tools to src/generated/composio-manifests/postmark.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 46 Composio tools for postmark.
Fetching tools for toolkit "reddit_ads" from Composio...
Composio returned 83 tools.
Toolkit version: 20260429_00
Composio toolkit slug: reddit_ads

Tool breakdown for reddit-ads:
  Read (safe):         57
  Write (confirm):     21
  Write (high_impact): 5
  Total:             83

Wrote 83 tools to src/generated/composio-manifests/reddit-ads.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 83 Composio tools for reddit-ads.
Fetching tools for toolkit "snapchat" from Composio...
Composio returned 139 tools.
Toolkit version: 20260501_00
Composio toolkit slug: snapchat

Tool breakdown for snapchat:
  Read (safe):         103
  Write (confirm):     25
  Write (high_impact): 11
  Total:             139

Wrote 139 tools to src/generated/composio-manifests/snapchat.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 139 Composio tools for snapchat.
Fetching tools for toolkit "dataforseo" from Composio...
Composio returned 312 tools.
Toolkit version: 20260429_00
Composio toolkit slug: dataforseo

Tool breakdown for dataforseo:
  Read (safe):         287
  Write (confirm):     24
  Write (high_impact): 1
  Total:             312

Wrote 312 tools to src/generated/composio-manifests/dataforseo.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 312 Composio tools for dataforseo.
Fetching tools for toolkit "phantombuster" from Composio...
Composio returned 53 tools.
Toolkit version: 20260429_00
Composio toolkit slug: phantombuster

Tool breakdown for phantombuster:
  Read (safe):         26
  Write (confirm):     19
  Write (high_impact): 8
  Total:             53

Wrote 53 tools to src/generated/composio-manifests/phantombuster.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 53 Composio tools for phantombuster.
Fetching tools for toolkit "instagram" from Composio...
Composio returned 36 tools.
Toolkit version: 20260501_00
Composio toolkit slug: instagram
Skipping 7 deprecated tool(s): INSTAGRAM_CREATE_MEDIA_CONTAINER, INSTAGRAM_CREATE_POST, INSTAGRAM_GET_POST_COMMENTS, INSTAGRAM_GET_POST_INSIGHTS, INSTAGRAM_GET_POST_STATUS, INSTAGRAM_GET_USER_MEDIA, INSTAGRAM_REPLY_TO_COMMENT

Tool breakdown for instagram:
  Read (safe):         17
  Write (confirm):     10
  Write (high_impact): 2
  Total:             29

Wrote 29 tools to src/generated/composio-manifests/instagram.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 29 Composio tools for instagram.
Fetching tools for toolkit "stripe" from Composio...
Composio returned 422 tools.
Toolkit version: 20260430_00
Composio toolkit slug: stripe
Skipping 7 deprecated tool(s): STRIPE_CREATE_CHARGE, STRIPE_DELETE_CUSTOMER, STRIPE_GET_BALANCE_HISTORY, STRIPE_GET_CUSTOMERS_CUSTOMER_SOURCES_ID, STRIPE_GET_CUSTOMERS_CUSTOMER_SUBSCRIPTIONS, STRIPE_GET_SOURCES_SOURCE, STRIPE_UPDATE_SOURCE

Tool breakdown for stripe:
  Read (safe):         198
  Write (confirm):     170
  Write (high_impact): 47
  Total:             415

Wrote 415 tools to src/generated/composio-manifests/stripe.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 415 Composio tools for stripe.
Fetching tools for toolkit "dropbox" from Composio...
Composio returned 177 tools.
Toolkit version: 20260429_00
Composio toolkit slug: dropbox
Skipping 3 deprecated tool(s): DROPBOX_CREATE_SHARED_LINK_SIMPLE, DROPBOX_DELETE_FILE_OR_FOLDER, DROPBOX_LIST_FOLDERS

Tool breakdown for dropbox:
  Read (safe):         93
  Write (confirm):     58
  Write (high_impact): 23
  Total:             174

Wrote 174 tools to src/generated/composio-manifests/dropbox.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 174 Composio tools for dropbox.
Fetching tools for toolkit "elevenlabs" from Composio...
Composio returned 155 tools.
Toolkit version: 20260429_00
Composio toolkit slug: elevenlabs

Tool breakdown for elevenlabs:
  Read (safe):         87
  Write (confirm):     48
  Write (high_impact): 20
  Total:             155

Wrote 155 tools to src/generated/composio-manifests/elevenlabs.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 155 Composio tools for elevenlabs.
Fetching tools for toolkit "docusign" from Composio...
Composio returned 338 tools.
Toolkit version: 20260501_00
Composio toolkit slug: docusign
Skipping 3 deprecated tool(s): DOCUSIGN_DEPRECATED_ENDPOINT_FOR_TAB_BLOB, DOCUSIGN_GET_TABS_BLOB_FOR_ENVELOPE, DOCUSIGN_SHARE_TEMPLATE_WITH_GROUP

Tool breakdown for docusign:
  Read (safe):         157
  Write (confirm):     114
  Write (high_impact): 64
  Total:             335

Wrote 335 tools to src/generated/composio-manifests/docusign.generated.ts
Updated src/generated/composio-manifests/index.ts

Done. Imported 335 Composio tools for docusign.

```

---

## Assistant (Build · Claude Opus 4.6 · 59.6s)

All done except Twilio (which returned 0 tools from the API with `toolkit_versions=latest`). Let me check the existing Twilio manifest to see what version it uses:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/generated/composio-manifests/twilio.generated.ts",
  "limit": 50
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/generated/composio-manifests/twilio.generated.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: 
3: export const twilioComposioTools: IntegrationTool[] = [];

(End of file - total 3 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 59.7s)

Twilio was already an empty array. That's fine - the toolkit returned 0 tools, so the current state is correct. It was regenerated as an empty file. Let me now check the size reduction:

**Tool: bash**

**Input:**
```json
{
  "command": "du -sh /Users/hithesh/clawlink/src/generated/composio-manifests/",
  "description": "Check new manifest directory size"
}
```

**Output:**
```
3.2M	/Users/hithesh/clawlink/src/generated/composio-manifests/

```

---

## Assistant (Build · Claude Opus 4.6 · 59.8s)

**13 MB -> 3.2 MB** -- a 75% reduction. But wait, the 3.2 MB still includes the `composioTool()` factory boilerplate repeated in each file. Let me check one of the bigger ones to verify no inputSchema leaked through:

**Tool: bash**

**Input:**
```json
{
  "command": "wc -l /Users/hithesh/clawlink/src/generated/composio-manifests/docusign.generated.ts /Users/hithesh/clawlink/src/generated/composio-manifests/stripe.generated.ts /Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts",
  "description": "Check line counts of big manifests"
}
```

**Output:**
```
    4962 /Users/hithesh/clawlink/src/generated/composio-manifests/docusign.generated.ts
    6067 /Users/hithesh/clawlink/src/generated/composio-manifests/stripe.generated.ts
     921 /Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts
   11950 total

```

---

## Assistant (Build · Claude Opus 4.6 · 61.4s)

Docusign went from 71,278 lines to 4,962 lines. Stripe from 30,580 to 6,067. Let me verify no `inputSchema` exists in the generated files:

**Tool: bash**

**Input:**
```json
{
  "command": "grep -r \"inputSchema\" /Users/hithesh/clawlink/src/generated/composio-manifests/ | head -5",
  "description": "Verify no inputSchema in generated files"
}
```

**Output:**
```
/Users/hithesh/clawlink/src/generated/composio-manifests/snapchat.generated.ts:  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
/Users/hithesh/clawlink/src/generated/composio-manifests/snapchat.generated.ts:    inputSchema: { type: "object", properties: {} },
/Users/hithesh/clawlink/src/generated/composio-manifests/linkedin.generated.ts:  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
/Users/hithesh/clawlink/src/generated/composio-manifests/linkedin.generated.ts:    inputSchema: { type: "object", properties: {} },
/Users/hithesh/clawlink/src/generated/composio-manifests/docusign.generated.ts:  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {

```

---

## Assistant (Build · Claude Opus 4.6 · 61.2s)

The only `inputSchema` references are the Omit type parameter and the stub `{ type: "object", properties: {} }` in the factory function. No actual schema data. Let me also confirm there are no per-tool inputSchema properties:

**Tool: bash**

**Input:**
```json
{
  "command": "grep -c \"inputSchema:\" /Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts",
  "description": "Count inputSchema occurrences in gmail"
}
```

**Output:**
```
1

```

---

## Assistant (Build · Claude Opus 4.6 · 61.4s)

Only 1 occurrence -- the factory stub line. Previously it had one per tool (61 tools). 

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "in_progress",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 60.6s)

### Step 8: Verify builds

Let me run the TypeScript compiler and worker build to verify everything compiles:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && npx tsc --noEmit 2>&1 | head -60",
  "description": "TypeScript type check",
  "timeout": 120000
}
```

**Output:**
```
(no output)
```

---

## Assistant (Build · Claude Opus 4.6 · 61.1s)

Clean TypeScript compilation -- zero errors. Now let me build the worker:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && npm run build:worker 2>&1 | tail -30",
  "description": "Build worker to check bundle size",
  "timeout": 120000
}
```

**Output:**
```

> clawlink@0.1.0 build:worker
> echo 'Worker build is handled by Wrangler during deploy'

Worker build is handled by Wrangler during deploy

```

---

## Assistant (Build · Claude Opus 4.6 · 60.7s)

The worker build is handled by Wrangler. Let me try a dry-run deploy or just run wrangler to check the bundle:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && npx wrangler deploy --config worker/wrangler.worker.toml --dry-run --outdir /var/folders/hk/yjpt3mzs5330b6fzcwq74gm80000gn/T/opencode/worker-build 2>&1 | tail -20",
  "description": "Dry-run worker deploy for bundle size",
  "timeout": 120000
}
```

**Output:**
```
─────────────────────────────────────────────
Total Upload: 5573.41 KiB / gzip: 681.71 KiB
Your Worker has access to the following bindings:
Binding                                                                            Resource                  
env.CREDENTIALS (82482703a83c4bc28af059eb092bd9a2)                                 KV Namespace              
env.DB (clawlink)                                                                  D1 Database               
env.ENV ("production")                                                             Environment Variable      
env.CLAWLINK_APP_URL ("https://claw-link.dev")                                     Environment Variable      
env.NANGO_BASE_URL ("https://nango.claw-link.dev")                                 Environment Variable      
env.NANGO_PROVIDER_CONFIG_KEYS ("{"google-analytics":"google-analytics"}")         Environment Variable      
env.PIPEDREAM_ENVIRONMENT ("production")                                           Environment Variable      
env.PIPEDREAM_PROJECT_ID ("proj_gYspDxN")                                          Environment Variable      
env.PIPEDREAM_CONNECT_SLUGS ("slack,facebook,mailchimp,gmail,linked...")           Environment Variable      
env.PIPEDREAM_APP_MAP ("apollo=apollo_io_oauth,xero=xero_acco...")                 Environment Variable      
env.COMPOSIO_BASE_URL ("https://backend.composio.dev/api/v3.1")                    Environment Variable      
env.COMPOSIO_ENABLED_SLUGS ("instantly,outlook,apollo,postiz,gmail...")            Environment Variable      
env.COMPOSIO_TOOLKIT_MAP ("instantly=instantly,outlook=outlook,a...")              Environment Variable      
env.COMPOSIO_TOOLKIT_VERSION_MAP ("instantly=20260429_00,outlook=2026043...")      Environment Variable      

--dry-run: exiting now.

```

---

## Assistant (Build · Claude Opus 4.6 · 60.5s)

**Total Upload: 5573 KiB (5.4 MiB) / gzip: 682 KiB**

Let me check what it was before. Let me look at the output dir to see the actual bundle:

**Tool: bash**

**Input:**
```json
{
  "command": "ls -lh /var/folders/hk/yjpt3mzs5330b6fzcwq74gm80000gn/T/opencode/worker-build/",
  "description": "Check worker build output files"
}
```

**Output:**
```
total 27968
-rw-r--r--@ 1 hithesh  staff   5.4M May  1 16:10 index.js
-rw-r--r--@ 1 hithesh  staff   8.2M May  1 16:10 index.js.map
-rw-r--r--@ 1 hithesh  staff   109B May  1 16:10 README.md

```

---

## Assistant (Build · Claude Opus 4.6 · 85.1s)

5.4 MiB uncompressed, 682 KiB gzipped. The Cloudflare Workers limit for paid plans is 10 MiB compressed -- we're well within that at under 1 MiB compressed.

Let me also check the frontend build:

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/hithesh/clawlink && npm run build:web 2>&1 | tail -40",
  "description": "Build frontend to verify",
  "timeout": 300000
}
```

**Output:**
```
├ ○ /dashboard/feedback                               4.15 kB         156 kB
├ ○ /dashboard/integrations                            6.7 kB         231 kB
├ ƒ /dashboard/integrations/[slug]                    9.01 kB         184 kB
├ ○ /dashboard/logs                                   5.05 kB         173 kB
├ ○ /dashboard/request-app                            4.54 kB         156 kB
├ ○ /dashboard/settings                               15.2 kB         169 kB
├ ƒ /docs                                               245 B         102 kB
├ ○ /privacy                                            176 B         106 kB
├ ○ /security                                           176 B         106 kB
├ ƒ /sign-in/[[...sign-in]]                             344 B         140 kB
├ ƒ /sign-up/[[...sign-up]]                             344 B         140 kB
├ ○ /terms                                              176 B         106 kB
└ ○ /verify                                             176 B         106 kB
+ First Load JS shared by all                          102 kB
  ├ chunks/1255-dfb5f8d642ae4426.js                   45.8 kB
  ├ chunks/4bd1b696-100b9d70ed4e49c1.js               54.2 kB
  └ other shared chunks (total)                       2.05 kB


ƒ Middleware                                          86.3 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand


┌──────────────────────────────┐
│ OpenNext — Generating bundle │
└──────────────────────────────┘

Bundling middleware function...
Bundling static assets...
Bundling cache assets...
Building server function: default...
Applying code patches: 2.027s
# copyPackageTemplateFiles
[35m⚙️ Bundling the OpenNext server...
[0m
[35mWorker saved in `.open-next/worker.js` 🚀
[0m
OpenNext build complete.

```

---

## Assistant (Build · Claude Opus 4.6 · 64.0s)

Both builds succeed. Let me verify a sample generated manifest to make sure the structure is correct:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts",
  "limit": 80
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/src/generated/composio-manifests/gmail.generated.ts</path>
<type>file</type>
<content>
1: import type { IntegrationTool } from "../../../worker/integrations/base";
2: 
3: function composioTool(
4:   partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
5:     accessLevel?: IntegrationTool["accessLevel"];
6:     tags?: string[];
7:     whenToUse?: string[];
8:     askBefore?: string[];
9:     safeDefaults?: Record<string, unknown>;
10:     examples?: IntegrationTool["examples"];
11:     requiresScopes?: string[];
12:     idempotent?: boolean;
13:     supportsDryRun?: boolean;
14:     supportsBatch?: boolean;
15:     toolSlug: string;
16:   },
17: ): IntegrationTool {
18:   return {
19:     integration: "gmail",
20:     name: partial.name,
21:     description: partial.description,
22:     inputSchema: { type: "object", properties: {} },
23:     outputSchema: partial.outputSchema,
24:     accessLevel: partial.accessLevel ?? partial.mode,
25:     mode: partial.mode,
26:     risk: partial.risk,
27:     tags: partial.tags ?? [],
28:     whenToUse: partial.whenToUse ?? [],
29:     askBefore: partial.askBefore ?? [],
30:     safeDefaults: partial.safeDefaults ?? {},
31:     examples: partial.examples ?? [],
32:     followups: [],
33:     requiresScopes: partial.requiresScopes ?? [],
34:     idempotent: partial.idempotent ?? partial.mode === "read",
35:     supportsDryRun: partial.supportsDryRun ?? false,
36:     supportsBatch: partial.supportsBatch ?? false,
37:     execution: {
38:       kind: "composio_tool",
39:       toolkit: "gmail",
40:       toolSlug: partial.toolSlug,
41:       version: "20260430_00",
42:     },
43:   };
44: }
45: 
46: export const gmailComposioTools: IntegrationTool[] = [
47:   composioTool({
48:     name: "gmail_add_label_to_email",
49:     description: "Adds and/or removes specified Gmail labels for a message; ensure `message_id` and all `label_ids` are valid (use 'listLabels' for custom label IDs).",
50:     toolSlug: "GMAIL_ADD_LABEL_TO_EMAIL",
51:     mode: "write",
52:     risk: "confirm",
53:     tags: [
54:       "composio",
55:       "gmail",
56:       "write",
57:     ],
58:     askBefore: [
59:       "Confirm the parameters before executing Modify email labels.",
60:     ],
61:     idempotent: true,
62:   }),
63:   composioTool({
64:     name: "gmail_batch_delete_messages",
65:     description: "Tool to permanently delete multiple Gmail messages in bulk, bypassing Trash with no recovery possible. Use when you need to efficiently remove large numbers of emails (e.g., retention enforcement, mailbox hygiene). Use GMAIL_MOVE_TO_TRASH instead when reversibility may be needed. Always obtain explicit user confirmation and verify a sample of message IDs before executing. High-volume calls may trigger 429 rateLimitExceeded or 403 userRateLimitExceeded errors; apply exponential backoff.",
66:     toolSlug: "GMAIL_BATCH_DELETE_MESSAGES",
67:     mode: "write",
68:     risk: "high_impact",
69:     tags: [
70:       "composio",
71:       "gmail",
72:       "write",
73:       "batch",
74:       "messages",
75:     ],
76:     askBefore: [
77:       "This action is destructive and cannot be undone. Confirm before executing Batch delete Gmail messages.",
78:     ],
79:   }),
80:   composioTool({

(Showing lines 1-80 of 921. Use offset=81 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 33.1s)

Each tool is now just name, description, toolSlug, mode, risk, tags, askBefore -- no inputSchema. The factory sets `inputSchema: { type: "object", properties: {} }` as the stub.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update manifest-registry.ts to support schema hydration",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Regenerate all Composio manifests without inputSchema",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Verify worker builds and bundle size is reduced",
      "priority": "high",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Modify import-composio-tools.mjs to strip inputSchema from generated manifests",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Add fetchComposioToolSchemas() to backend-client.ts for runtime schema fetching",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Create KV-backed schema cache layer (composio-schema-cache.ts)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update manifest-registry.ts to support schema hydration",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update worker/index.ts handleListTools() to hydrate schemas for connected integrations",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update tool-registry.ts (frontend) to hydrate schemas on demand",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Regenerate all Composio manifests without inputSchema",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Verify worker builds and bundle size is reduced",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 34.1s)

All tasks complete. Here's the summary:

---

## Results

### Bundle size reduction

| Metric | Before | After | Reduction |
|---|---|---|---|
| Composio manifest source | 13 MB | 3.2 MB | **75%** |
| Worker bundle (uncompressed) | ~15+ MiB | 5.4 MiB | **~64%** |
| Worker bundle (gzipped) | ~2+ MiB | 682 KiB | **~66%** |

### Files changed

**Modified:**
- `scripts/import-composio-tools.mjs` -- no longer generates `inputSchema` in manifests; removed `convertInputSchema` call from tool entry builder; updated `renderToolCall` and `generateManifestSource` to omit schema and mark it in the `Omit<>` type
- `src/lib/composio/backend-client.ts` -- added `fetchComposioToolSchemas()` function with `convertInputSchema()` / `simplifySchemaNode()` for runtime schema fetching from Composio's `GET /tools` API
- `src/lib/composio/manifest-registry.ts` -- added `hydrateComposioToolSchemas()` that patches stub schemas in-place using the schema cache
- `worker/index.ts` -- `handleListTools()` is now async, queries user's Composio-backed connections, hydrates schemas only for connected integrations
- `src/lib/server/tool-registry.ts` -- added `hydrateSchemas()` helper; calls it in `listToolsForUser`, `describeToolForUser`, and `listToolDescriptionsForIntegration`
- All 48 `src/generated/composio-manifests/*.generated.ts` files -- regenerated without `inputSchema`

**Created:**
- `src/lib/composio/schema-cache.ts` -- KV-backed cache with 24h TTL, in-memory per-request cache, `resolveToolSchemas()` and `isStubSchema()` helpers

### How it works at runtime

1. **`tools/list` (MCP worker)** -- Worker queries D1 for the user's Composio-backed connections, identifies which integration slugs are connected, then calls `hydrateComposioToolSchemas()` for just those toolkits. Schema resolution checks in-memory cache -> KV cache -> Composio API. Unconnected integrations keep stub schemas.

2. **Dashboard API routes** -- Same hydration via `hydrateSchemas()` in tool-registry.ts before building tool catalog/description responses.

3. **`tools/call` (execution)** -- No change. The executor never reads `inputSchema` -- it passes args directly to Composio's `POST /tools/execute/<slug>`.

4. **Adding new integrations** -- Run `import-composio-tools.mjs`, commit the small ~10-20 KB manifest, deploy. Schemas are fetched live. If Composio updates their schemas, you get the changes automatically on next KV cache expiry (24h).

---

## User

can you update the docs now, claude.md , - 
  - clawhub-skills/GUIDE.md, - 
  - docs/composio-integration-setup-guide.md

---

## Assistant (Build · Claude Opus 4.6 · 59.9s)



Let me read all three files first to understand what needs updating.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/claude.md"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/claude.md</path>
<type>file</type>
<content>
1: @AGENTS.md
2: 
3: # ClawLink
4: 
5: ClawLink is a SaaS for OpenClaw users that makes integrations dramatically easier to connect than manual provider setup. Product and UX decisions should prioritize hosted flows, minimal setup steps, and language non-technical users can follow quickly.
6: 
7: ## Current Architecture
8: 
9: ClawLink runs as two production Cloudflare Workers backed by a shared D1 database and KV namespace.
10: 
11: 1. `clawlink-web`
12:    - Config: `wrangler.toml`
13:    - Serves `claw-link.dev`
14:    - Runs the Next.js app via OpenNext on Workers
15:    - Owns the dashboard, hosted connect pages, Clerk auth flows, Polar billing routes, and Next API routes under `src/app/api/**`
16: 
17: 2. `clawlink`
18:    - Config: `worker/wrangler.worker.toml`
19:    - Serves `api.claw-link.dev`
20:    - Runs the MCP / tool execution backend in `worker/**`
21:    - Owns integration execution, credential loading, request logging, and scheduled trigger execution
22: 
23: Shared infrastructure:
24: - D1 database: `clawlink`
25: - KV namespace: `CREDENTIALS`
26: 
27: Important: frontend and backend are separate deploy targets. Changes to hosted routes or dashboard UI require a `clawlink-web` deploy. Changes to tool execution require a `clawlink` deploy. Schema and connection lifecycle changes often require both.
28: 
29: ## Main Repo Areas
30: 
31: - `src/app/**`: Next.js app routes and API handlers
32: - `src/components/**`: dashboard and hosted connect UI
33: - `src/data/integrations.ts`: integration catalog and setup metadata
34: - `src/lib/server/**`: server-side connection sessions, billing, routing, execution, and provider helpers
35: - `src/lib/runtime/**`: runtime-facing tool execution types and policies
36: - `worker/**`: MCP worker, credential bridge, integration handlers, logging, and worker-only helpers
37: - `migrations/*.sql`: D1 schema migrations
38: 
39: ## Connection Architecture
40: 
41: The connection model supports multiple connections per integration per user.
42: 
43: - `user_integrations.id` is the stable connection id
44: - users can have multiple rows for the same integration slug
45: - `is_default` selects the implicit connection when a tool call omits `connectionId`
46: - `external_account_id` is used to match and reuse upstream accounts on reconnect
47: - `connection_sessions.connection_id` ties a hosted/manual setup session to the exact connection row being updated
48: 
49: Do not reintroduce the old one-row-per-provider assumption.
50: 
51: ## Current Auth Backends
52: 
53: The catalog setup modes are:
54: 
55: 1. `oauth`
56:    - current hosted OAuth path backed by Nango
57:    - session start route creates a hosted session and the hosted page opens the Nango Connect UI
58: 
59: 2. `pipedream`
60:    - current Pipedream Connect path
61:    - hosted page requests a session-scoped Pipedream connect token
62:    - browser opens the Pipedream Connect iframe/dialog
63:    - completion route stores the returned `pipedream_account_id` on the connection row
64: 
65: 3. `coming_soon`
66:    - visible roadmap integrations without a live setup flow
67: 
68: 4. `composio`
69:    - current pilot backend for `instantly`
70:    - hosted ClawLink page collects the Instantly API key directly, then creates a Composio connected account server-side
71:    - stores only the Composio connected account id and related metadata on the ClawLink connection row
72:    - tool execution uses generated Composio manifests and `kind: "composio_tool"`
73: 
74: The credential bridge still has some legacy manual-credential support, but new integrations should not use that as their primary setup mode.
75: 
76: `pipedream` remains the strategic default for most new providers. `composio` should be used provider-by-provider only when it materially improves coverage or reliability. The slugs currently using Pipedream Connect are listed in `PIPEDREAM_CONNECT_SLUGS` in both `wrangler.toml` and `worker/wrangler.worker.toml`. Instantly is intentionally removed from that list and uses Composio instead. Nango-backed OAuth integrations still use the existing hosted OAuth path, but new providers should not be added to Nango unless there is a specific reason.
77: 
78: ### Pipedream slug → app name mapping
79: 
80: The integration slug we use internally (e.g. `google-calendar`) is not always the same as the Pipedream app name (e.g. `google_calendar`). When they differ, the slug **must** be added to `PIPEDREAM_APP_MAP` in both `wrangler.toml` and `worker/wrangler.worker.toml`, otherwise `getConfiguredAppForSlug()` falls back to the raw slug, Pipedream Connect rejects the token, and the hosted connect page fails with "This session has expired. Please refresh the page to try again."
81: 
82: Rules when adding a new Pipedream provider:
83: 
84: - The Pipedream app name is the `execution.app` field in the generated manifest at `src/generated/pipedream-manifests/<slug>.generated.ts` — copy that value, not the slug.
85: - Common mismatches: anything with a hyphen in the slug (Pipedream uses underscores), and providers whose Pipedream app has a suffix like `_oauth`, `_v2`, `_rest_api`, `_data_api`, or a vendor prefix like `microsoft_`.
86: - If the slug equals the app name exactly (e.g. `slack`, `notion`, `gmail`), no `PIPEDREAM_APP_MAP` entry is needed.
87: - Update both wrangler files in the same change and redeploy both workers (`npm run deploy:web` and `npm run deploy:worker`) — the var is read on both surfaces.
88: 
89: ## Runtime / Worker Architecture
90: 
91: The worker uses the connection id plus stored auth backend metadata to load credentials and execute tools.
92: 
93: - `worker/credentials.ts`
94:   - loads manual credentials directly
95:   - resolves Nango-backed OAuth connections
96:   - resolves Pipedream-backed connections via stored `pipedream_account_id`
97:   - marks connections `needs_reauth` on auth failures
98: 
99: - `worker/integrations/**`
100:   - contains the shared handler base plus the remaining `postiz` custom handler
101:   - all normal provider tool surfaces should come from generated Pipedream manifests
102:   - do not add a new custom handler unless the user explicitly approves a provider-specific exception
103: 
104: - `src/lib/server/executor.ts`
105:   - shared server-side tool execution path
106:   - uses the same credential bridge logic as the worker runtime
107: 
108: ## Manifest-Backed Pipedream Tools
109: 
110: The strategic direction for adding integrations is the manifest-backed Pipedream platform, not custom worker handlers. See `docs/pipedream-provider-import-flow.md` for the per-provider import workflow.
111: 
112: Pieces of the platform:
113: 
114: - importer: `scripts/import-pipedream-actions.mjs`
115: - override layer: `config/pipedream-action-overrides.mjs`
116: - generated manifests: `src/generated/pipedream-manifests/<provider>.generated.ts`
117: - manifest registry: `src/lib/pipedream/manifest-registry.ts`
118: - generic executor: `src/lib/pipedream/action-executor.ts`
119: 
120: Current state:
121: 
122: - the importer, manifest registry, and generic executor exist
123: - generated manifests for `airtable`, `apollo`, `calendly`, `clickup`, `facebook`, `gmail`, `google-ads`, `google-analytics`, `google-calendar`, `google-docs`, `google-drive`, `google-search-console`, `hubspot`, `instantly`, `klaviyo`, `linkedin`, `mailchimp`, `notion`, `onedrive`, `outlook`, `postiz`, `salesforce`, `xero`, and `youtube` are on disk
124: - the manifest path is wired end to end on both surfaces:
125:   - server (Next API used by the OpenClaw plugin):
126:     - `src/lib/server/tool-registry.ts` merges manifest tools with the remaining Postiz custom-handler tools and only emits manifest tools when the user has a Pipedream-backed connection
127:     - `src/lib/server/router.ts` narrows connection selection to Pipedream-backed rows when `tool.execution.kind === "pipedream_action"`
128:     - `src/lib/server/executor.ts` falls through to `executePipedreamActionTool()` instead of requiring a custom handler
129:   - worker (`api.claw-link.dev`):
130:     - `worker/index.ts` resolves a Pipedream-backed connection then dispatches `pipedream_action` tools to `executePipedreamActionTool()`
131:     - `worker/integrations/index.ts` imports from `manifest-registry` plus `postiz`
132: 
133: Custom worker handler status:
134: 
135: - `postiz` is the only retained custom handler exception
136: - previous per-provider handlers for Slack, GitHub, Apollo, Motion, Twilio, and Google providers have been removed
137: - integrations without generated manifests, such as `slack` and `google-sheets`, do not expose tools until their Pipedream manifests are imported
138: 
139: Migration guidance: new providers should be added through the manifest path, not as new custom handlers. If a future provider truly needs custom execution, document the exception and keep it isolated like Postiz.
140: 
141: Validation workflow for new Pipedream imports:
142: 
143: 1. `npm run import:pipedream-actions -- --app <app> [--integration <slug>]`
144: 2. `npm run audit:manifests -- --strict`
145: 3. `npm run validate:pipedream-actions -- --integration <slug> --strict`
146: 4. `npm run test:openclaw-plugin-contract`
147: 5. `npm run smoke:openclaw-plugin -- --preset <preset>`
148: 
149: Rules:
150: 
151: - The runtime validator must execute Pipedream actions using only the exposed LLM-facing args plus `safeDefaults`
152: - Hidden/internal Pipedream props must be removed via `hiddenProps` and satisfied via `safeDefaults`
153: - If a tool needs exposed required business args to run, add `validationArgs` in `config/pipedream-action-overrides.mjs`
154: - Use `PIPEDREAM_TEST_ACCOUNTS_JSON` or per-integration env vars such as `PIPEDREAM_TEST_GMAIL_ACCOUNT_ID` to provide test account bindings
155: - The plugin contract test must verify the OpenClaw plugin forwards `clawlink_call_tool` / `clawlink_preview_tool` arguments correctly
156: - The live smoke test must invoke the local plugin entrypoint against production ClawLink using a real API key and a safe preset
157: - Keep at least one safe read smoke preset per integration; add preview or sandboxed write presets only when low-risk
158: - Do not treat a provider import as done until the static audit, runtime validation, plugin contract test, and live smoke test all pass
159: 
160: ## Flows And Triggers
161: 
162: The repo now includes flow and trigger runtime support in addition to direct tool calls.
163: 
164: - `src/app/api/flows/**`
165: - `src/app/api/triggers/**`
166: - `src/lib/server/flow-runtime.ts`
167: - `src/lib/server/trigger-runtime.ts`
168: - `src/lib/server/router.ts`
169: - `src/lib/server/tool-registry.ts`
170: - `src/lib/server/tool-execution-log.ts`
171: 
172: Related schema migrations:
173: - `007_agent_runtime_phase1.sql`
174: - `008_flow_runtime.sql`
175: - `009_triggers.sql`
176: - `010_pipedream_connect.sql`
177: 
178: ## Deploy Commands
179: 
180: - Frontend build: `npm run build:web`
181: - Frontend deploy: `npm run deploy:web`
182: - Worker deploy: `npm run deploy:worker`
183: 
184: If running deploys manually in a shell without the package script environment, make sure the Cloudflare token and production env values are loaded first.
185: 
186: ## Product Direction
187: 
188: - first integration free
189: - lightweight paid plan after that
190: - roadmap toward 100+ integrations
191: - keep the primary UX hosted, guided, and simple for OpenClaw users
192: 
193: ## Plugin Releases
194: 
195: For OpenClaw plugin releases, follow the tag-based npm publish workflow documented in `AGENTS.md` and `.github/workflows/publish-openclaw-plugin.yml`.

(End of file - total 195 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/clawhub-skills/GUIDE.md"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/clawhub-skills/GUIDE.md</path>
<type>file</type>
<content>
1: # How to create a new ClawHub skill for a ClawLink integration
2: 
3: This guide is for agents or contributors creating a new per-integration skill to publish on [ClawHub](https://clawhub.ai) under the `hith3sh` account. Each skill is a thin onboarding wrapper that teaches OpenClaw how to set up ClawLink and use the dynamic tool system for a specific provider.
4: 
5: ## Architecture context
6: 
7: ClawLink uses a **single plugin** (`@useclawlink/openclaw-plugin`) with **dynamic tool discovery**. The plugin exposes these tools at runtime:
8: 
9: - `clawlink_list_tools` — discover available tools for connected integrations
10: - `clawlink_list_integrations` — check which integrations are connected
11: - `clawlink_describe_tool` — get usage guidance for a specific tool
12: - `clawlink_preview_tool` — dry-run a tool call before executing
13: - `clawlink_call_tool` — execute a tool
14: 
15: Because tools are discovered dynamically, **skills do NOT need to list specific tool names, endpoints, or code examples**. The skill's job is to:
16: 
17: 1. Get the user from zero to a working ClawLink setup
18: 2. Teach the agent the discovery/execution workflow
19: 3. Provide provider-specific context (what the integration can do, what OAuth flow to expect)
20: 
21: ## File structure
22: 
23: Each skill is a folder with this layout:
24: 
25: ```
26: clawhub-skills/
27:   <slug>/
28:     SKILL.md          # Required — the skill content
29:     .clawhub/
30:       origin.json     # Created by CLI after first publish (tracks published version)
31: ```
32: 
33: The `<slug>` is the ClawHub URL slug (e.g., `salesforce-ops`, `onedrive-files`). It must be lowercase, URL-safe: `^[a-z0-9][a-z0-9-]*$`.
34: 
35: ## SKILL.md template
36: 
37: Copy this template and replace all `{{PLACEHOLDERS}}` with the actual values for the integration.
38: 
39: ```markdown
40: ---
41: name: {{SLUG}}
42: description: {{ONE_LINE_DESCRIPTION}} — powered by ClawLink.
43: metadata:
44:   openclaw:
45:     requires:
46:       env:
47:         - CLAWLINK_API_KEY
48:     primaryEnv: CLAWLINK_API_KEY
49:     homepage: https://claw-link.dev
50: ---
51: 
52: # {{DISPLAY_NAME}} via ClawLink
53: 
54: Work with {{DISPLAY_NAME}} from chat — {{SHORT_CAPABILITIES_SUMMARY}}.
55: 
56: Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles OAuth and credentials so you don't need to configure {{DISPLAY_NAME}} API access yourself.
57: 
58: ## Quick start
59: 
60: 1. Install the ClawLink plugin: `openclaw plugins install @useclawlink/openclaw-plugin`
61: 2. Create a free account at [claw-link.dev](https://claw-link.dev)
62: 3. Get your API key at [claw-link.dev/dashboard/settings?tab=api](https://claw-link.dev/dashboard/settings?tab=api)
63: 4. The dashboard shows a ready-to-paste `/clawlink login <key>` command — copy it and paste it into OpenClaw
64: 5. Connect {{DISPLAY_NAME}} from [claw-link.dev/dashboard](https://claw-link.dev/dashboard)
65: 6. Done — ask OpenClaw to work with your {{DISPLAY_NAME}} data
66: 
67: ## Setup details
68: 
69: ### Installing the plugin
70: 
71: If the ClawLink plugin is not installed yet, tell the user to run:
72: 
73: \```
74: openclaw plugins install @useclawlink/openclaw-plugin
75: \```
76: 
77: ### Adding the API key
78: 
79: If ClawLink reports that the plugin is not configured, the user has not added their API key yet.
80: 
81: 1. Sign up or sign in at https://claw-link.dev
82: 2. Go to https://claw-link.dev/dashboard/settings?tab=api and create an API key
83: 3. The dashboard shows a ready-to-paste `/clawlink login <key>` command — tell the user to **copy that line from the dashboard and paste it into OpenClaw**. They are copy-pasting, not typing.
84: 4. Alternatively, if the OpenClaw client shows a plugin settings UI, they can paste the key into the `apiKey` field.
85: 
86: The key is stored locally in `~/.openclaw/openclaw.json` and is only sent to `claw-link.dev`. Never echo or repeat the key.
87: 
88: ### Connecting {{DISPLAY_NAME}}
89: 
90: Tell the user to open https://claw-link.dev/dashboard and connect {{DISPLAY_NAME}} there. The dashboard handles {{AUTH_METHOD}} — the user {{AUTH_USER_ACTION}}. When they confirm it is done, call `clawlink_list_integrations` to verify.
91: 
92: ## Using {{DISPLAY_NAME}} tools
93: 
94: ClawLink provides tools dynamically based on what the user has connected. You do not need to know the tool names in advance.
95: 
96: ### Discovery (always start here)
97: 
98: 1. Call `clawlink_list_tools` to see available {{DISPLAY_NAME}} tools.
99: 2. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
100: 3. If no {{DISPLAY_NAME}} tools appear, call `clawlink_list_integrations` to check whether {{DISPLAY_NAME}} is connected.
101: 4. If it is not connected, direct the user to the dashboard.
102: 
103: ### Execution
104: 
105: 1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
106: 2. Prefer read and search operations before writes.
107: 3. For writes or destructive actions, call `clawlink_preview_tool` first, then confirm with the user.
108: 4. Execute with `clawlink_call_tool`.
109: 5. If it fails, report the real error — do not invent results.
110: 
111: ## What you can do
112: 
113: Typical {{DISPLAY_NAME}} tasks (actual availability depends on the user's connected account and permissions):
114: 
115: {{BULLET_LIST_OF_CAPABILITIES}}
116: 
117: ## Rules
118: 
119: - Always use ClawLink tools for {{DISPLAY_NAME}}. Do not ask the user for separate {{DISPLAY_NAME}} credentials.
120: - Do not claim a capability is missing without calling `clawlink_list_tools` first.
121: - Do not invent slash commands. The only slash command is the copy-pasted `/clawlink login <key>` during setup.
122: - Ask for confirmation before destructive or bulk write actions.
123: - If {{DISPLAY_NAME}} is not connected, direct the user to https://claw-link.dev/dashboard.
124: - Never echo or repeat the user's API key.
125: 
126: ## Resources
127: 
128: - ClawLink: https://claw-link.dev
129: - ClawLink Docs: https://docs.claw-link.dev/openclaw
130: - npm: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
131: - Source: https://github.com/hith3sh/clawlink
132: {{PROVIDER_DOCS_LINKS}}
133: ```
134: 
135: ## Placeholder reference
136: 
137: | Placeholder | What to fill in | Example |
138: |---|---|---|
139: | `{{SLUG}}` | ClawHub URL slug, lowercase with hyphens | `salesforce-ops` |
140: | `{{DISPLAY_NAME}}` | Human-readable provider name | `Salesforce` |
141: | `{{ONE_LINE_DESCRIPTION}}` | What the skill does in one sentence (no period) | `Search Salesforce records, inspect objects, query CRM data, and perform actions for accounts, contacts, leads, opportunities, and cases` |
142: | `{{SHORT_CAPABILITIES_SUMMARY}}` | Brief comma-separated list of what users can do | `search records, manage contacts, leads, accounts, opportunities, cases, and more` |
143: | `{{AUTH_METHOD}}` | How the connection works | `OAuth` or `OAuth with Microsoft` or `API key entry` |
144: | `{{AUTH_USER_ACTION}}` | What the user does during connection | `clicks through the Salesforce login and grant screen` |
145: | `{{BULLET_LIST_OF_CAPABILITIES}}` | Markdown bullet list of typical tasks | See examples below |
146: | `{{PROVIDER_DOCS_LINKS}}` | Markdown links to the provider's official API docs | `- Salesforce REST API: https://developer.salesforce.com/docs/...` |
147: 
148: ## Choosing a slug
149: 
150: The slug should be short, descriptive, and follow this pattern: `<provider>-<domain>`. Examples:
151: 
152: - `salesforce-ops` (CRM operations)
153: - `onedrive-files` (file management)
154: - `calendly-scheduling` (scheduling)
155: - `airtable-records` (database records)
156: - `slack-messaging` (messaging)
157: - `gmail-email` (email)
158: - `notion-workspace` (workspace/docs)
159: - `hubspot-crm` (CRM)
160: - `jira-issues` (issue tracking)
161: 
162: ## ClawHub compliance checklist
163: 
164: Before publishing, verify:
165: 
166: - [ ] **Frontmatter declares `CLAWLINK_API_KEY`** in `metadata.openclaw.requires.env` — ClawHub's security scanner checks that declared env vars match what the skill references. Missing this will flag a metadata mismatch.
167: - [ ] **No obfuscated shell commands** — ClawHub hard-blocks skills with `curl | sh`, base64-decoded payloads, or obfuscated install commands. The only install command is the plain `openclaw plugins install @useclawlink/openclaw-plugin`.
168: - [ ] **No hardcoded tool names** — since tools are discovered dynamically, do not list specific tool names like `salesforce_search_records`. List capabilities in plain English instead.
169: - [ ] **No secrets in the file** — never include API keys, tokens, or credentials in the SKILL.md.
170: - [ ] **License is MIT-0** — all ClawHub skills use this license automatically. Do not add conflicting license terms.
171: 
172: ## Publishing
173: 
174: ### First-time publish (new skill)
175: 
176: Always pass `--name` to set the clean display name (e.g., "Airtable" not "Airtable Records"). If you omit `--name`, ClawHub derives it from the slug which looks ugly.
177: 
178: ```bash
179: clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version 0.1.0
180: ```
181: 
182: ### Updating an existing skill
183: 
184: Use `clawhub skill publish` with `--name` to preserve the display name:
185: 
186: ```bash
187: clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version <next-version> --changelog "Description of changes"
188: ```
189: 
190: **Do not use `clawhub sync` for updates** — it does not pass `--name` and will reset the display name to a slug-derived version (e.g., "Salesforce Ops" instead of "Salesforce").
191: 
192: ### Dry run before publishing
193: 
194: Always check what will be published first:
195: 
196: ```bash
197: clawhub sync --root clawhub-skills --dry-run
198: ```
199: 
200: ### Auth
201: 
202: You must be logged in as `hith3sh` to publish/update these skills:
203: 
204: ```bash
205: clawhub login
206: ```
207: 
208: ## Existing skills
209: 
210: | Slug | Provider | ClawHub URL |
211: |---|---|---|
212: | `salesforce-ops` | Salesforce | https://clawhub.ai/hith3sh/salesforce-ops |
213: | `onedrive-files` | OneDrive | https://clawhub.ai/hith3sh/onedrive-files |
214: | `calendly-scheduling` | Calendly | https://clawhub.ai/hith3sh/calendly-scheduling |
215: | `airtable-records` | Airtable | https://clawhub.ai/hith3sh/airtable-records |
216: 
217: ## Example: creating a skill for Notion
218: 
219: 1. Create the directory:
220:    ```bash
221:    mkdir -p clawhub-skills/notion-workspace
222:    ```
223: 
224: 2. Create `clawhub-skills/notion-workspace/SKILL.md` using the template above with:
225:    - `{{SLUG}}` = `notion-workspace`
226:    - `{{DISPLAY_NAME}}` = `Notion`
227:    - `{{ONE_LINE_DESCRIPTION}}` = `Browse Notion databases and pages, search content, create and update pages, and manage workspace data`
228:    - `{{SHORT_CAPABILITIES_SUMMARY}}` = `browse databases, search pages, create and update content, and manage workspace data`
229:    - `{{AUTH_METHOD}}` = `OAuth`
230:    - `{{AUTH_USER_ACTION}}` = `clicks through the Notion login and authorization screen`
231:    - `{{BULLET_LIST_OF_CAPABILITIES}}`:
232:      ```
233:      - Search pages and databases
234:      - Browse database entries
235:      - Read page content
236:      - Create new pages
237:      - Update existing pages
238:      - Query database records with filters
239:      ```
240:    - `{{PROVIDER_DOCS_LINKS}}`:
241:      ```
242:      - Notion API: https://developers.notion.com/
243:      ```
244: 
245: 3. Publish:
246:    ```bash
247:    clawhub skill publish clawhub-skills/notion-workspace --slug notion-workspace --version 0.1.0
248:    ```

(End of file - total 248 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md</path>
<type>file</type>
<content>
1: # Composio Integration Setup Guide
2: 
3: How to add a new Composio-backed integration to ClawLink (or expand an existing one to its full tool catalog).
4: 
5: This guide was built from the Instantly pilot. Follow it step-by-step for each new integration (Gmail, Outlook, ClickUp, Apollo, etc.).
6: 
7: ---
8: 
9: ## Prerequisites
10: 
11: Before starting, make sure you have:
12: 
13: - `COMPOSIO_API_KEY` available in `.env.local` (and as a Cloudflare secret for both workers)
14: - A Composio auth config created for the integration in the [Composio dashboard](https://dashboard.composio.dev)
15:   - ClawLink uses **Composio's managed auth** -- Composio owns the OAuth app credentials, redirect URIs, and token exchange. You do not need to register your own OAuth app with providers like Microsoft, Google, etc.
16:   - For OAuth providers (Gmail, Outlook, ClickUp): create an auth config in Composio's dashboard. Composio provides the managed OAuth app. No redirect URI configuration needed on your side.
17:   - For API key providers (Apollo, Instantly): create an API key auth config in Composio's dashboard.
18: - The auth config ID saved in `.env.local` as `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (e.g. `COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."`)
19: - The Composio toolkit slug for the integration (e.g. `gmail`, `outlook`, `clickup`, `apollo`, `instantly`)
20: 
21: ### `.env.local` Composio secrets convention
22: 
23: All Composio secrets live in `.env.local` at the repo root. This is the single source of truth. The naming convention is:
24: 
25: ```bash
26: # Shared across all integrations
27: COMPOSIO_API_KEY=ak_...
28: 
29: # Per-integration auth config IDs
30: COMPOSIO_INSTANTLY_AUTH_CONFIG_ID="ac_..."
31: COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."
32: COMPOSIO_OUTLOOK_AUTH_CONFIG_ID="ac_..."
33: COMPOSIO_GMAIL_AUTH_CONFIG_ID="ac_..."
34: ```
35: 
36: These values are pushed to Cloudflare Workers as secrets during Step 4. The runtime code in `backend-client.ts` resolves auth config IDs by checking `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` env vars (it also supports a `COMPOSIO_AUTH_CONFIG_MAP` comma-separated map, but per-integration vars are the current convention).
37: 
38: ---
39: 
40: ## Step 1: Discover the Composio Toolkit
41: 
42: Before writing any code, confirm what's available.
43: 
44: ### Check the Composio docs page
45: 
46: Each toolkit has a docs page at:
47: ```
48: https://docs.composio.dev/toolkits/<slug>.md
49: ```
50: 
51: For example: `https://docs.composio.dev/toolkits/gmail.md`
52: 
53: This page lists every available tool with its slug, description, input parameters (name, type, required, description), and output parameters.
54: 
55: ### Call the Composio API to list tools
56: 
57: ```bash
58: curl -s -X GET \
59:   "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
60:   -H "x-api-key: $COMPOSIO_API_KEY" | jq '.items | length'
61: ```
62: 
63: Replace `<TOOLKIT_SLUG>` with the lowercase slug (e.g. `gmail`, `instantly`, `clickup`).
64: 
65: The response shape is:
66: 
67: ```json
68: {
69:   "items": [
70:     {
71:       "slug": "GMAIL_SEND_EMAIL",
72:       "name": "Send Email",
73:       "description": "Send an email using Gmail...",
74:       "toolkit": { "slug": "gmail", "name": "Gmail" },
75:       "input_parameters": {
76:         "type": "object",
77:         "required": ["to", "subject"],
78:         "properties": {
79:           "to": { "type": "string", "description": "Recipient email" },
80:           "subject": { "type": "string", "description": "Email subject" },
81:           "body": { "type": "string", "description": "Email body" }
82:         }
83:       },
84:       "output_parameters": { ... },
85:       "tags": ["readOnlyHint", "Email"],
86:       "is_deprecated": false,
87:       "version": "20260429_00"
88:     }
89:   ],
90:   "total_items": 85,
91:   "next_cursor": null
92: }
93: ```
94: 
95: Key details about the response:
96: - `input_parameters` is a **JSON Schema object** with top-level `type`, `properties`, and `required` fields (not a flat map)
97: - `tags` includes **Composio hint tags** that the script uses for classification: `readOnlyHint`, `createHint`, `updateHint`, `destructiveHint`, `idempotentHint`
98: - `tags` also includes category strings like `"Email"`, `"Campaigns"`, `"Leads & Segmentation"` etc.
99: 
100: Optionally save reference data locally:
101: 
102: ```bash
103: curl -s -X GET \
104:   "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
105:   -H "x-api-key: $COMPOSIO_API_KEY" > .firecrawl/composio-<slug>-tools.json
106: 
107: firecrawl scrape "https://docs.composio.dev/toolkits/<slug>.md" --only-main-content -o .firecrawl/composio-<slug>.md
108: ```
109: 
110: ---
111: 
112: ## Step 2: Generate the Tool Manifest
113: 
114: The generation script already exists at `scripts/import-composio-tools.mjs`. The npm script `import:composio-tools` is registered in `package.json`.
115: 
116: ### Run it
117: 
118: ```bash
119: npm run import:composio-tools -- --toolkit <COMPOSIO_TOOLKIT_SLUG> --integration <CLAWLINK_SLUG>
120: ```
121: 
122: Examples:
123: 
124: ```bash
125: npm run import:composio-tools -- --toolkit gmail --integration gmail
126: npm run import:composio-tools -- --toolkit apollo --integration apollo
127: npm run import:composio-tools -- --toolkit clickup --integration clickup
128: npm run import:composio-tools -- --toolkit instantly --integration instantly
129: ```
130: 
131: Use `--dry-run` to preview without writing files:
132: 
133: ```bash
134: npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run
135: ```
136: 
137: ### What it does
138: 
139: 1. Reads `COMPOSIO_API_KEY` from `.env.local`
140: 2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`
141: 3. Skips deprecated tools (`is_deprecated === true`)
142: 4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback
143: 5. Converts `input_parameters` JSON Schema to the ClawLink `inputSchema` format
144: 6. Generates `askBefore` prompts for write/destructive tools
145: 7. Writes `src/generated/composio-manifests/<integration>.generated.ts`
146: 8. Updates the barrel file `src/generated/composio-manifests/index.ts`
147: 
148: ### How it classifies tools
149: 
150: The script uses Composio's own hint tags from the `tags` array as the primary signal:
151: 
152: | Composio tag | `mode` | `risk` |
153: |---|---|---|
154: | `readOnlyHint` | `"read"` | `"safe"` |
155: | `createHint` | `"write"` | `"confirm"` |
156: | `updateHint` | `"write"` | `"confirm"` |
157: | `destructiveHint` | `"write"` | `"high_impact"` |
158: 
159: If no hint tag is present, the script falls back to slug pattern matching:
160: 
161: | Slug pattern | `mode` | `risk` |
162: |---|---|---|
163: | Contains `GET`, `LIST`, `COUNT`, `CHECK`, `EXPORT`, `SEARCH`, `FIND`, `ENUM`, `STATUS`, `ANALYTICS`, `STATS`, `VITALS`, `OVERVIEW` | `"read"` | `"safe"` |
164: | Contains `DELETE`, `REMOVE` | `"write"` | `"high_impact"` |
165: | Anything else | `"write"` | `"confirm"` |
166: 
167: **Important:** The `ToolRisk` type in ClawLink is `"safe" | "confirm" | "high_impact"`. There is no `"dangerous"` value.
168: 
169: ### What the output looks like
170: 
171: The script generates a TypeScript file with one `composioTool({...})` call per tool:
172: 
173: ```typescript
174: composioTool({
175:   name: "apollo_search_people",
176:   description: "Search for people in Apollo's database...",
177:   toolSlug: "APOLLO_SEARCH_PEOPLE",
178:   mode: "read",
179:   risk: "safe",
180:   inputSchema: {
181:     type: "object",
182:     additionalProperties: true,
183:     properties: {
184:       q: { type: "string", description: "Search query" },
185:       limit: { type: "integer", description: "Max results" },
186:     },
187:   },
188:   tags: ["composio", "apollo", "read", "people"],
189: }),
190: ```
191: 
192: The barrel file at `src/generated/composio-manifests/index.ts` is automatically rewritten to import and re-export all `*.generated.ts` files in the directory.
193: 
194: ### Verify
195: 
196: After running, check:
197: - The generated file has the expected number of tools (compare with `total_items` from the API)
198: - A sample of read tools have `risk: "safe"`
199: - A sample of delete tools have `risk: "high_impact"`
200: - TypeScript compiles: `npx tsc --noEmit src/generated/composio-manifests/<slug>.generated.ts 2>&1 | grep -v node_modules`
201: 
202: ---
203: 
204: ## Step 3: Update the Integration Catalog
205: 
206: Edit `src/data/integrations.ts` to register (or update) the integration entry.
207: 
208: ### If the integration already exists as Pipedream
209: 
210: Change `setupMode` from `"pipedream"` to `"composio"` and update the tools list.
211: 
212: **Example (Gmail currently uses Pipedream):**
213: 
214: ```typescript
215: gmail: {
216:     setupMode: "composio",  // was "pipedream"
217:     dashboardStatus: "available",
218:     runtimeStatus: "live",
219:     setupGuide: "Connect Gmail through ClawLink's hosted setup...",
220:     credentialFields: [],
221:     tools: [
222:       // Curated subset of ~10-15 key tools for dashboard display
223:       { name: "gmail_send_email", description: "Send a Gmail message" },
224:       { name: "gmail_list_emails", description: "List Gmail messages" },
225:       { name: "gmail_get_email", description: "Get a specific Gmail message" },
226:       { name: "gmail_create_draft", description: "Create a draft in Gmail" },
227:       // ... more curated tools
228:     ],
229:   },
230: ```
231: 
232: ### If the integration is new
233: 
234: Add a new entry in `integrationMetadata`:
235: 
236: ```typescript
237: <slug>: {
238:     setupMode: "composio",
239:     dashboardStatus: "available",
240:     runtimeStatus: "live",
241:     setupGuide: "Connect <Name> through ClawLink's hosted setup. ...",
242:     credentialFields: [],
243:     tools: [
244:       // Curated 10-15 representative tools
245:     ],
246:   },
247: ```
248: 
249: Also add the base entry in `integrations` if it doesn't exist:
250: 
251: ```typescript
252: { name: "<Name>", slug: "<slug>", description: "...", category: "...", icon: "...", color: "#..." }
253: ```
254: 
255: ### Dashboard tools curation
256: 
257: The `tools` array in `integrations.ts` is what users see on the dashboard integration page. Do NOT list all tools here. Pick ~10-15 representative tools across the key categories the integration offers.
258: 
259: For example, for Instantly (115 active tools), the curated dashboard list is:
260: 
261: | Category | Example tools |
262: |---|---|
263: | Workspace | `instantly_get_current_workspace`, `instantly_get_workspace_billing_plan_details` |
264: | Campaigns | `instantly_list_campaigns`, `instantly_create_campaign`, `instantly_get_campaign_analytics`, `instantly_activate_campaign`, `instantly_pause_campaign` |
265: | Leads | `instantly_list_leads`, `instantly_create_lead`, `instantly_add_leads_bulk` |
266: | Lead Lists | `instantly_list_lead_lists` |
267: | Accounts | `instantly_list_accounts` |
268: | Emails | `instantly_list_emails` |
269: | Webhooks | `instantly_list_webhooks` |
270: 
271: All tools are still available to OpenClaw at runtime regardless of what's listed here.
272: 
273: ---
274: 
275: ## Step 4: Update Wrangler Environment Configs
276: 
277: Both workers need Composio config for the new integration.
278: 
279: ### `wrangler.toml` (frontend worker `clawlink-web`)
280: 
281: Update the comma-separated maps:
282: 
283: ```toml
284: COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
285: COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
286: COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
287: ```
288: 
289: ### `worker/wrangler.worker.toml` (backend worker `clawlink`)
290: 
291: Same changes:
292: 
293: ```toml
294: COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
295: COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
296: COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
297: ```
298: 
299: ### Secrets: Push from `.env.local` to Cloudflare Workers
300: 
301: All Composio secrets must be set on **both** workers. The values are already in `.env.local` -- read them from there and push via wrangler.
302: 
303: **Important:** `wrangler secret put` reads from stdin in non-interactive mode. Use `echo` to pipe the value.
304: 
305: #### Push the per-integration auth config ID
306: 
307: Read the value from `.env.local` and set it on both workers:
308: 
309: ```bash
310: # Extract the value (strip quotes)
311: AUTH_CONFIG_ID=$(grep COMPOSIO_<SLUG>_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
312: 
313: # Push to frontend worker (clawlink-web, uses wrangler.toml)
314: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID
315: 
316: # Push to backend worker (clawlink, uses worker/wrangler.worker.toml)
317: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
318: ```
319: 
320: Concrete example for Apollo:
321: 
322: ```bash
323: AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
324: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
325: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
326: ```
327: 
328: #### Push `COMPOSIO_API_KEY` (only needed once, not per-integration)
329: 
330: If this is the first Composio integration being set up and the API key hasn't been pushed yet:
331: 
332: ```bash
333: API_KEY=$(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '"')
334: echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY
335: echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY --config worker/wrangler.worker.toml
336: ```
337: 
338: #### Verify secrets are set
339: 
340: ```bash
341: # List secrets on frontend worker
342: wrangler secret list
343: 
344: # List secrets on backend worker
345: wrangler secret list --config worker/wrangler.worker.toml
346: ```
347: 
348: Both should show `COMPOSIO_API_KEY` and `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` in the list.
349: 
350: ### Finding the toolkit version
351: 
352: The version is printed by the import script (e.g. `Toolkit version: 20260429_00`). It's also returned in the list-tools API response (`version` field on each tool). Use the same version for all tools in a toolkit.
353: 
354: ---
355: 
356: ## Step 5: Handle Auth Flow Differences
357: 
358: Composio supports two auth methods. The ClawLink frontend already handles both generically. **No redirect URI configuration is needed** because ClawLink uses Composio's managed auth -- Composio owns the OAuth apps and handles all redirect URIs internally.
359: 
360: ### OAuth-based integrations (Gmail, Outlook, ClickUp)
361: 
362: The flow is:
363: 
364: ```
365: User clicks Connect on ClawLink dashboard
366:   → POST /api/connect/sessions/{token}/composio
367:     → createComposioConnectLink() sends auth_config_id + callback_url to Composio
368:     → Composio returns a redirectUrl (their hosted OAuth page)
369:   → window.location.assign(redirectUrl) — full page redirect to Composio
370:   → Composio's hosted page redirects to the provider's OAuth login (e.g. Microsoft)
371:   → User authorizes on the provider's OAuth page
372:   → Provider redirects back to Composio (Composio owns this redirect URI)
373:   → Composio processes tokens, stores credentials
374:   → Composio redirects to ClawLink's callback_url:
375:       /api/connect/sessions/{token}/composio/complete?connected_account_id=...
376:   → ClawLink's /complete route polls until account is active, saves to D1
377:   → User is redirected back to the connect page with status "connected"
378: ```
379: 
380: **No additional frontend code or redirect URI setup needed.** Composio manages the OAuth app registration, redirect URIs, and token exchange for the provider. ClawLink only needs:
381: 
382: 1. The `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` set as a secret (from `.env.local`)
383: 2. `setupMode: "composio"` in `integrations.ts`
384: 
385: The `HostedConnectPage.tsx` already detects `setupMode === "composio"` and auto-triggers `handleStartComposio()`. The `/composio/route.ts` creates the connect link. The `/composio/complete/route.ts` handles the callback. All generic, no per-integration code.
386: 
387: ### API key-based integrations (Instantly, Apollo)
388: 
389: The same flow works for API key integrations. Composio shows its own hosted API key input page instead of an OAuth login page. The user pastes their API key on Composio's page, Composio validates it and redirects back to ClawLink's callback.
390: 
391: **No custom routes or forms needed.** The standard Composio connect flow handles both OAuth and API key auth types.
392: 
393: ---
394: 
395: ## Step 6: Handle Pipedream-to-Composio Migration (If Applicable)
396: 
397: If the integration previously had a Pipedream manifest, you need to disable it at runtime. A database migration is **not** needed unless you have real users with existing Pipedream connections.
398: 
399: ### 6a. Disable Pipedream tools at runtime
400: 
401: Add the integration slug to the disabled set in `worker/integrations/index.ts`:
402: 
403: ```typescript
404: const disabledPipedreamManifestIntegrations = new Set(["instantly", "gmail"]);
405: ```
406: 
407: This ensures Pipedream manifest tools are not served for this integration. Only Composio tools will be active.
408: 
409: ### 6b. Migrate existing user connections (only if you have real users)
410: 
411: **Skip this step unless you have real users with active Pipedream connections for this integration.** If the product has no external users yet, or if nobody has connected this integration through Pipedream, there is nothing to migrate.
412: 
413: If you do have real users with Pipedream connections that need to be invalidated, create a SQL migration:
414: 
415: ```sql
416: -- Mark existing Pipedream connections as needing reauth
417: UPDATE user_integrations
418: SET auth_state = 'needs_reauth',
419:     auth_error = '<Integration> now connects through ClawLink''s hosted setup. Reconnect to enable the expanded tool catalog.',
420:     is_default = 0,
421:     updated_at = datetime('now')
422: WHERE integration = '<slug>'
423:   AND (auth_provider = 'pipedream' OR pipedream_account_id IS NOT NULL);
424: ```
425: 
426: Run it with:
427: 
428: ```bash
429: wrangler d1 execute clawlink --file migrations/0XX_composio_<slug>.sql
430: ```
431: 
432: ### 6c. Keep Pipedream manifests on disk
433: 
434: Don't delete the Pipedream generated manifest files. They remain on disk but are disabled at runtime by the `disabledPipedreamManifestIntegrations` set. This allows easy rollback if needed.
435: 
436: ---
437: 
438: ## Step 7: Update Smoke Test Presets
439: 
440: Create or update `scripts/smoke-presets/<slug>.mjs`:
441: 
442: ```javascript
443: export default {
444:   read: [
445:     {
446:       tool: "<slug>_list_<resource>",
447:       args: {},
448:       label: "List <resources>",
449:     },
450:     {
451:       tool: "<slug>_get_<resource>",
452:       args: { id: "test-id" },
453:       label: "Get <resource>",
454:     },
455:   ],
456:   preview: [
457:     {
458:       tool: "<slug>_create_<resource>",
459:       args: { name: "ClawLink Test" },
460:       label: "Preview create <resource>",
461:     },
462:   ],
463: };
464: ```
465: 
466: Focus on:
467: - At least 2-3 safe read presets
468: - Optionally 1 preview/write preset using sandboxed test data
469: 
470: ---
471: 
472: ## Step 8: Deploy
473: 
474: Both workers need redeployment:
475: 
476: ```bash
477: # Build and deploy frontend (serves dashboard, connect flow, API routes)
478: npm run build:web && npm run deploy:web
479: 
480: # Build and deploy worker (serves tool execution at api.claw-link.dev)
481: npm run build:worker && npm run deploy:worker
482: ```
483: 
484: **Important:** If you only deploy one worker, the other won't have the new integration. Deploy both.
485: 
486: ---
487: 
488: ## Step 9: Validate
489: 
490: Follow the standard integration MVP testing layers from `AGENTS.md`:
491: 
492: ### Layer 1: Connection flow
493: 
494: 1. Go to the dashboard, find the new integration
495: 2. Click Connect
496: 3. Complete the OAuth flow (or API key submission)
497: 4. Verify the connection session ends in `connected`
498: 5. Verify the connection shows in the dashboard
499: 
500: ### Layer 2: Tool execution
501: 
502: 1. Use the OpenClaw plugin or the worker API directly
503: 2. Test read tools first (list, get)
504: 3. Then test write tools (create, update)
505: 4. Verify Composio returns valid data
506: 
507: ### Automated validation
508: 
509: ```bash
510: # Static manifest audit
511: npm run audit:manifests -- --strict
512: 
513: # Smoke test (if presets are configured)
514: npm run smoke:openclaw-plugin -- --preset <slug>
515: ```
516: 
517: ---
518: 
519: ## Quick Reference: Files to Touch Per Integration
520: 
521: | File | Action | Required? |
522: |---|---|---|
523: | `src/generated/composio-manifests/<slug>.generated.ts` | Create via `npm run import:composio-tools` | Yes |
524: | `src/generated/composio-manifests/index.ts` | Auto-updated by the script | Yes (automatic) |
525: | `src/data/integrations.ts` | Add/update integration entry with `setupMode: "composio"` and curated tools | Yes |
526: | `wrangler.toml` | Add to `COMPOSIO_ENABLED_SLUGS`, `COMPOSIO_TOOLKIT_MAP`, `COMPOSIO_TOOLKIT_VERSION_MAP` | Yes |
527: | `worker/wrangler.worker.toml` | Same as above | Yes |
528: | Cloudflare secrets | Set `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (or update `COMPOSIO_AUTH_CONFIG_MAP`) | Yes |
529: | `worker/integrations/index.ts` | Add to `disabledPipedreamManifestIntegrations` if migrating from Pipedream | Only if migrating |
530: | `migrations/0XX_composio_<slug>.sql` | Invalidate old Pipedream connections | Only if you have real users with Pipedream connections |
531: | `scripts/smoke-presets/<slug>.mjs` | Create smoke test presets | Recommended |
532: 
533: ---
534: 
535: ## Quick Reference: What Does NOT Need to Change
536: 
537: These are fully generic and handle any Composio integration automatically:
538: 
539: - `scripts/import-composio-tools.mjs` — Already built, works for any toolkit
540: - `src/lib/composio/backend-client.ts` — Composio API client (connection + execution)
541: - `src/lib/composio/tool-executor.ts` — Tool execution adapter
542: - `src/lib/composio/manifest-registry.ts` — Indexes whatever `composioToolManifests` exports
543: - `worker/index.ts` — Worker dispatch (handles any `composio_tool` execution kind)
544: - `worker/credentials.ts` — Credential loading for Composio connections
545: - `worker/integrations/index.ts` — Auto-includes all Composio manifests (no per-integration wiring needed)
546: - `src/components/connect/HostedConnectPage.tsx` — Already handles `setupMode === "composio"` generically
547: - `src/app/api/connect/sessions/[token]/composio/route.ts` — Creates connect link for any Composio integration
548: - `src/app/api/connect/sessions/[token]/composio/complete/route.ts` — Handles OAuth callback for any Composio integration
549: - `src/app/api/connect/start/route.ts` — Handles `"composio"` setup mode generically
550: - `src/lib/server/integration-store.ts` — Saves Composio connections generically
551: - `src/lib/server/connection-sessions.ts` — Completes Composio sessions generically
552: - Database schema — No changes needed (Composio columns already exist from migration 012)
553: 
554: ---
555: 
556: ## Example: Adding Apollo via Composio
557: 
558: ```bash
559: # 1. Discover tools
560: curl -s "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=apollo&toolkit_versions=latest&limit=1000" \
561:   -H "x-api-key: $(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '\"')" | jq '.total_items'
562: 
563: # 2. Dry-run to preview
564: npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run
565: 
566: # 3. Generate manifest
567: npm run import:composio-tools -- --toolkit apollo --integration apollo
568: 
569: # 4. Edit src/data/integrations.ts
570: #    - If apollo already exists: change setupMode to "composio", update tools list
571: #    - If new: add base entry + metadata entry
572: 
573: # 5. Edit wrangler.toml + worker/wrangler.worker.toml
574: #    Add apollo to COMPOSIO_ENABLED_SLUGS, COMPOSIO_TOOLKIT_MAP, COMPOSIO_TOOLKIT_VERSION_MAP
575: 
576: # 6. Push secrets from .env.local to both workers
577: AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
578: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
579: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
580: 
581: # 7. If migrating from Pipedream:
582: #    - Add "apollo" to disabledPipedreamManifestIntegrations in worker/integrations/index.ts
583: #    - Only create a migration file if you have real users with Pipedream connections
584: 
585: # 8. Deploy both workers
586: npm run build:web && npm run deploy:web
587: npm run build:worker && npm run deploy:worker
588: 
589: # 9. Test
590: #    Connect Apollo through the dashboard
591: #    Verify tool execution works
592: ```
593: 
594: ---
595: 
596: ## Composio API Quick Reference
597: 
598: | Endpoint | Purpose |
599: |---|---|
600: | `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000` | List all tools for a toolkit |
601: | `GET /api/v3.1/tools/{tool_slug}` | Get single tool details |
602: | `GET /api/v3.1/tools/enum?toolkit_slug=<slug>` | Get tool slug enum list |
603: | `POST /api/v3.1/tools/execute/{tool_slug}` | Execute a tool |
604: | `POST /api/v3.1/connected_accounts/link` | Create connect link (for OAuth flow) |
605: | `GET /api/v3.1/connected_accounts/{id}` | Get connected account details |
606: | `DELETE /api/v3.1/connected_accounts/{id}` | Delete connected account |
607: 
608: Base URL: `https://backend.composio.dev`
609: Auth: `x-api-key` header with your `COMPOSIO_API_KEY`

(End of file - total 609 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 30.0s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Update claude.md with lazy schema architecture info",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Update clawhub-skills/GUIDE.md (if applicable)",
      "priority": "medium",
      "status": "pending"
    },
    {
      "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Update claude.md with lazy schema architecture info",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Update clawhub-skills/GUIDE.md (if applicable)",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 41.5s)

### 1. Update claude.md

The main sections to update are the "Manifest-Backed Pipedream Tools" area (which also covers Composio) and the "Runtime / Worker Architecture" section. I need to add documentation about the lazy schema architecture.

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/claude.md",
  "oldString": "## Runtime / Worker Architecture\n\nThe worker uses the connection id plus stored auth backend metadata to load credentials and execute tools.\n\n- `worker/credentials.ts`\n  - loads manual credentials directly\n  - resolves Nango-backed OAuth connections\n  - resolves Pipedream-backed connections via stored `pipedream_account_id`\n  - marks connections `needs_reauth` on auth failures\n\n- `worker/integrations/**`\n  - contains the shared handler base plus the remaining `postiz` custom handler\n  - all normal provider tool surfaces should come from generated Pipedream manifests\n  - do not add a new custom handler unless the user explicitly approves a provider-specific exception\n\n- `src/lib/server/executor.ts`\n  - shared server-side tool execution path\n  - uses the same credential bridge logic as the worker runtime",
  "newString": "## Runtime / Worker Architecture\n\nThe worker uses the connection id plus stored auth backend metadata to load credentials and execute tools.\n\n- `worker/credentials.ts`\n  - loads manual credentials directly\n  - resolves Nango-backed OAuth connections\n  - resolves Pipedream-backed connections via stored `pipedream_account_id`\n  - marks connections `needs_reauth` on auth failures\n\n- `worker/integrations/**`\n  - contains the shared handler base plus the remaining `postiz` custom handler\n  - all normal provider tool surfaces should come from generated Pipedream manifests\n  - do not add a new custom handler unless the user explicitly approves a provider-specific exception\n\n- `src/lib/server/executor.ts`\n  - shared server-side tool execution path\n  - uses the same credential bridge logic as the worker runtime\n\n## Composio Lazy Schema Architecture\n\nComposio tool manifests are generated **without `inputSchema`** to keep the worker bundle small. The generated manifests contain only metadata (name, description, mode, risk, tags, execution spec). Schemas are fetched at runtime from Composio's API and cached in KV.\n\nKey files:\n\n- `src/lib/composio/schema-cache.ts` — KV-backed cache layer with 24h TTL and in-memory per-request cache\n- `src/lib/composio/manifest-registry.ts` — `hydrateComposioToolSchemas()` patches stub schemas in-place before returning tools\n- `src/lib/composio/backend-client.ts` — `fetchComposioToolSchemas()` calls Composio's `GET /tools` API and converts `input_parameters` to ClawLink's simplified JSON Schema format\n\nHow it works:\n\n1. Static manifests set `inputSchema: { type: \"object\", properties: {} }` (empty stub)\n2. When `tools/list` is called (MCP worker), the worker queries D1 for the user's Composio-backed connections, identifies which integration slugs are connected, and hydrates schemas for just those toolkits\n3. Schema resolution: in-memory cache → KV cache (`composio-schema:<slug>`, 24h TTL) → Composio API fetch\n4. Unconnected integrations keep the stub schema — the user cannot invoke those tools anyway\n5. The dashboard (`tool-registry.ts`) uses the same hydration path via `hydrateSchemas()` before building tool catalog/description responses\n6. Tool execution (`tool-executor.ts`) never reads `inputSchema` — args pass directly to Composio's `POST /tools/execute/<slug>`\n\nRules:\n\n- Do not reintroduce `inputSchema` in generated Composio manifests. The import script intentionally omits it.\n- If Composio updates their tool schemas, ClawLink picks up the changes automatically when the KV cache expires (24h)\n- Adding a new Composio integration only requires committing a small (~10-20 KB) manifest file. No schema data in the repo.\n- The `convertInputSchema()` logic in `backend-client.ts` mirrors what the import script previously used, so runtime schemas are identical to what was previously statically generated."
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 33.8s)

Now update the "Main Repo Areas" section to mention the new schema-cache file:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/claude.md",
  "newString": "## Main Repo Areas\n\n- `src/app/**`: Next.js app routes and API handlers\n- `src/components/**`: dashboard and hosted connect UI\n- `src/data/integrations.ts`: integration catalog and setup metadata\n- `src/lib/server/**`: server-side connection sessions, billing, routing, execution, and provider helpers\n- `src/lib/runtime/**`: runtime-facing tool execution types and policies\n- `src/lib/composio/**`: Composio backend client, tool executor, manifest registry, and KV schema cache\n- `worker/**`: MCP worker, credential bridge, integration handlers, logging, and worker-only helpers\n- `migrations/*.sql`: D1 schema migrations",
  "oldString": "## Main Repo Areas\n\n- `src/app/**`: Next.js app routes and API handlers\n- `src/components/**`: dashboard and hosted connect UI\n- `src/data/integrations.ts`: integration catalog and setup metadata\n- `src/lib/server/**`: server-side connection sessions, billing, routing, execution, and provider helpers\n- `src/lib/runtime/**`: runtime-facing tool execution types and policies\n- `worker/**`: MCP worker, credential bridge, integration handlers, logging, and worker-only helpers\n- `migrations/*.sql`: D1 schema migrations"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 33.6s)

Now update the Composio auth backend description to reflect the new schema architecture:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/claude.md",
  "newString": "4. `composio`\n   - current pilot backend for `instantly`\n   - hosted ClawLink page collects the Instantly API key directly, then creates a Composio connected account server-side\n   - stores only the Composio connected account id and related metadata on the ClawLink connection row\n   - tool execution uses generated Composio manifests and `kind: \"composio_tool\"`\n   - generated manifests do **not** contain `inputSchema` — schemas are fetched lazily from Composio's API at runtime and cached in KV (see \"Composio Lazy Schema Architecture\" below)",
  "oldString": "4. `composio`\n   - current pilot backend for `instantly`\n   - hosted ClawLink page collects the Instantly API key directly, then creates a Composio connected account server-side\n   - stores only the Composio connected account id and related metadata on the ClawLink connection row\n   - tool execution uses generated Composio manifests and `kind: \"composio_tool\"`"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 32.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Update claude.md with lazy schema architecture info",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update clawhub-skills/GUIDE.md (if applicable)",
      "priority": "medium",
      "status": "in_progress"
    },
    {
      "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Update claude.md with lazy schema architecture info",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update clawhub-skills/GUIDE.md (if applicable)",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 37.6s)

### 2. Update clawhub-skills/GUIDE.md

Looking at this file, it's about creating ClawHub skills (onboarding wrappers for OpenClaw). The schema architecture change doesn't directly affect the skill authoring workflow -- skills use the dynamic tool discovery system (`clawlink_list_tools`, `clawlink_call_tool`) and never reference `inputSchema`. The guide already correctly says "skills do NOT need to list specific tool names, endpoints, or code examples" and "No hardcoded tool names."

The only relevant update is the architecture context section, which describes how the plugin works. The fact that schemas are now lazily fetched doesn't change the skill author's workflow, but the architecture context should be accurate:

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/clawhub-skills/GUIDE.md",
  "newString": "## Architecture context\n\nClawLink uses a **single plugin** (`@useclawlink/openclaw-plugin`) with **dynamic tool discovery**. The plugin exposes these tools at runtime:\n\n- `clawlink_list_tools` — discover available tools for connected integrations\n- `clawlink_list_integrations` — check which integrations are connected\n- `clawlink_describe_tool` — get usage guidance for a specific tool\n- `clawlink_preview_tool` — dry-run a tool call before executing\n- `clawlink_call_tool` — execute a tool\n\nBecause tools are discovered dynamically, **skills do NOT need to list specific tool names, endpoints, or code examples**. The skill's job is to:\n\n1. Get the user from zero to a working ClawLink setup\n2. Teach the agent the discovery/execution workflow\n3. Provide provider-specific context (what the integration can do, what OAuth flow to expect)\n\nNote: Composio-backed integrations use lazy schema loading — tool parameter schemas are fetched from Composio's API at runtime and cached, rather than being bundled statically. This is transparent to skills; the plugin handles schema resolution automatically when the user calls `clawlink_list_tools` or `clawlink_describe_tool`.",
  "oldString": "## Architecture context\n\nClawLink uses a **single plugin** (`@useclawlink/openclaw-plugin`) with **dynamic tool discovery**. The plugin exposes these tools at runtime:\n\n- `clawlink_list_tools` — discover available tools for connected integrations\n- `clawlink_list_integrations` — check which integrations are connected\n- `clawlink_describe_tool` — get usage guidance for a specific tool\n- `clawlink_preview_tool` — dry-run a tool call before executing\n- `clawlink_call_tool` — execute a tool\n\nBecause tools are discovered dynamically, **skills do NOT need to list specific tool names, endpoints, or code examples**. The skill's job is to:\n\n1. Get the user from zero to a working ClawLink setup\n2. Teach the agent the discovery/execution workflow\n3. Provide provider-specific context (what the integration can do, what OAuth flow to expect)"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Claude Opus 4.6 · 33.2s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Update claude.md with lazy schema architecture info",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Update clawhub-skills/GUIDE.md (if applicable)",
      "priority": "medium",
      "status": "completed"
    },
    {
      "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
      "priority": "high",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Update claude.md with lazy schema architecture info",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update clawhub-skills/GUIDE.md (if applicable)",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Update docs/composio-integration-setup-guide.md with new manifest + schema hydration details",
    "status": "in_progress",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Opus 4.6 · 32.7s)

---

## User

is it done

---

## Assistant (Build · Claude Opus 4.6 · 33.1s)



No, I still need to update `docs/composio-integration-setup-guide.md`. That's the biggest one -- it has several sections that reference the old static `inputSchema` generation. Let me finish it now.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md"
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md</path>
<type>file</type>
<content>
1: # Composio Integration Setup Guide
2: 
3: How to add a new Composio-backed integration to ClawLink (or expand an existing one to its full tool catalog).
4: 
5: This guide was built from the Instantly pilot. Follow it step-by-step for each new integration (Gmail, Outlook, ClickUp, Apollo, etc.).
6: 
7: ---
8: 
9: ## Prerequisites
10: 
11: Before starting, make sure you have:
12: 
13: - `COMPOSIO_API_KEY` available in `.env.local` (and as a Cloudflare secret for both workers)
14: - A Composio auth config created for the integration in the [Composio dashboard](https://dashboard.composio.dev)
15:   - ClawLink uses **Composio's managed auth** -- Composio owns the OAuth app credentials, redirect URIs, and token exchange. You do not need to register your own OAuth app with providers like Microsoft, Google, etc.
16:   - For OAuth providers (Gmail, Outlook, ClickUp): create an auth config in Composio's dashboard. Composio provides the managed OAuth app. No redirect URI configuration needed on your side.
17:   - For API key providers (Apollo, Instantly): create an API key auth config in Composio's dashboard.
18: - The auth config ID saved in `.env.local` as `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (e.g. `COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."`)
19: - The Composio toolkit slug for the integration (e.g. `gmail`, `outlook`, `clickup`, `apollo`, `instantly`)
20: 
21: ### `.env.local` Composio secrets convention
22: 
23: All Composio secrets live in `.env.local` at the repo root. This is the single source of truth. The naming convention is:
24: 
25: ```bash
26: # Shared across all integrations
27: COMPOSIO_API_KEY=ak_...
28: 
29: # Per-integration auth config IDs
30: COMPOSIO_INSTANTLY_AUTH_CONFIG_ID="ac_..."
31: COMPOSIO_APOLLO_AUTH_CONFIG_ID="ac_..."
32: COMPOSIO_OUTLOOK_AUTH_CONFIG_ID="ac_..."
33: COMPOSIO_GMAIL_AUTH_CONFIG_ID="ac_..."
34: ```
35: 
36: These values are pushed to Cloudflare Workers as secrets during Step 4. The runtime code in `backend-client.ts` resolves auth config IDs by checking `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` env vars (it also supports a `COMPOSIO_AUTH_CONFIG_MAP` comma-separated map, but per-integration vars are the current convention).
37: 
38: ---
39: 
40: ## Step 1: Discover the Composio Toolkit
41: 
42: Before writing any code, confirm what's available.
43: 
44: ### Check the Composio docs page
45: 
46: Each toolkit has a docs page at:
47: ```
48: https://docs.composio.dev/toolkits/<slug>.md
49: ```
50: 
51: For example: `https://docs.composio.dev/toolkits/gmail.md`
52: 
53: This page lists every available tool with its slug, description, input parameters (name, type, required, description), and output parameters.
54: 
55: ### Call the Composio API to list tools
56: 
57: ```bash
58: curl -s -X GET \
59:   "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
60:   -H "x-api-key: $COMPOSIO_API_KEY" | jq '.items | length'
61: ```
62: 
63: Replace `<TOOLKIT_SLUG>` with the lowercase slug (e.g. `gmail`, `instantly`, `clickup`).
64: 
65: The response shape is:
66: 
67: ```json
68: {
69:   "items": [
70:     {
71:       "slug": "GMAIL_SEND_EMAIL",
72:       "name": "Send Email",
73:       "description": "Send an email using Gmail...",
74:       "toolkit": { "slug": "gmail", "name": "Gmail" },
75:       "input_parameters": {
76:         "type": "object",
77:         "required": ["to", "subject"],
78:         "properties": {
79:           "to": { "type": "string", "description": "Recipient email" },
80:           "subject": { "type": "string", "description": "Email subject" },
81:           "body": { "type": "string", "description": "Email body" }
82:         }
83:       },
84:       "output_parameters": { ... },
85:       "tags": ["readOnlyHint", "Email"],
86:       "is_deprecated": false,
87:       "version": "20260429_00"
88:     }
89:   ],
90:   "total_items": 85,
91:   "next_cursor": null
92: }
93: ```
94: 
95: Key details about the response:
96: - `input_parameters` is a **JSON Schema object** with top-level `type`, `properties`, and `required` fields (not a flat map)
97: - `tags` includes **Composio hint tags** that the script uses for classification: `readOnlyHint`, `createHint`, `updateHint`, `destructiveHint`, `idempotentHint`
98: - `tags` also includes category strings like `"Email"`, `"Campaigns"`, `"Leads & Segmentation"` etc.
99: 
100: Optionally save reference data locally:
101: 
102: ```bash
103: curl -s -X GET \
104:   "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=<TOOLKIT_SLUG>&toolkit_versions=latest&limit=1000" \
105:   -H "x-api-key: $COMPOSIO_API_KEY" > .firecrawl/composio-<slug>-tools.json
106: 
107: firecrawl scrape "https://docs.composio.dev/toolkits/<slug>.md" --only-main-content -o .firecrawl/composio-<slug>.md
108: ```
109: 
110: ---
111: 
112: ## Step 2: Generate the Tool Manifest
113: 
114: The generation script already exists at `scripts/import-composio-tools.mjs`. The npm script `import:composio-tools` is registered in `package.json`.
115: 
116: ### Run it
117: 
118: ```bash
119: npm run import:composio-tools -- --toolkit <COMPOSIO_TOOLKIT_SLUG> --integration <CLAWLINK_SLUG>
120: ```
121: 
122: Examples:
123: 
124: ```bash
125: npm run import:composio-tools -- --toolkit gmail --integration gmail
126: npm run import:composio-tools -- --toolkit apollo --integration apollo
127: npm run import:composio-tools -- --toolkit clickup --integration clickup
128: npm run import:composio-tools -- --toolkit instantly --integration instantly
129: ```
130: 
131: Use `--dry-run` to preview without writing files:
132: 
133: ```bash
134: npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run
135: ```
136: 
137: ### What it does
138: 
139: 1. Reads `COMPOSIO_API_KEY` from `.env.local`
140: 2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`
141: 3. Skips deprecated tools (`is_deprecated === true`)
142: 4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback
143: 5. Generates `askBefore` prompts for write/destructive tools
144: 6. Writes `src/generated/composio-manifests/<integration>.generated.ts`
145: 7. Updates the barrel file `src/generated/composio-manifests/index.ts`
146: 
147: **Important:** The script intentionally does **not** include `inputSchema` in the generated manifests. Schemas are fetched lazily at runtime from Composio's API and cached in KV. This keeps the worker bundle small (~75% reduction in manifest size) and means schema updates from Composio are picked up automatically without re-importing. See "Runtime Schema Hydration" below for details.
148: 
149: ### How it classifies tools
150: 
151: The script uses Composio's own hint tags from the `tags` array as the primary signal:
152: 
153: | Composio tag | `mode` | `risk` |
154: |---|---|---|
155: | `readOnlyHint` | `"read"` | `"safe"` |
156: | `createHint` | `"write"` | `"confirm"` |
157: | `updateHint` | `"write"` | `"confirm"` |
158: | `destructiveHint` | `"write"` | `"high_impact"` |
159: 
160: If no hint tag is present, the script falls back to slug pattern matching:
161: 
162: | Slug pattern | `mode` | `risk` |
163: |---|---|---|
164: | Contains `GET`, `LIST`, `COUNT`, `CHECK`, `EXPORT`, `SEARCH`, `FIND`, `ENUM`, `STATUS`, `ANALYTICS`, `STATS`, `VITALS`, `OVERVIEW` | `"read"` | `"safe"` |
165: | Contains `DELETE`, `REMOVE` | `"write"` | `"high_impact"` |
166: | Anything else | `"write"` | `"confirm"` |
167: 
168: **Important:** The `ToolRisk` type in ClawLink is `"safe" | "confirm" | "high_impact"`. There is no `"dangerous"` value.
169: 
170: ### What the output looks like
171: 
172: The script generates a TypeScript file with one `composioTool({...})` call per tool:
173: 
174: ```typescript
175: composioTool({
176:   name: "apollo_search_people",
177:   description: "Search for people in Apollo's database...",
178:   toolSlug: "APOLLO_SEARCH_PEOPLE",
179:   mode: "read",
180:   risk: "safe",
181:   inputSchema: {
182:     type: "object",
183:     additionalProperties: true,
184:     properties: {
185:       q: { type: "string", description: "Search query" },
186:       limit: { type: "integer", description: "Max results" },
187:     },
188:   },
189:   tags: ["composio", "apollo", "read", "people"],
190: }),
191: ```
192: 
193: The barrel file at `src/generated/composio-manifests/index.ts` is automatically rewritten to import and re-export all `*.generated.ts` files in the directory.
194: 
195: ### Verify
196: 
197: After running, check:
198: - The generated file has the expected number of tools (compare with `total_items` from the API)
199: - A sample of read tools have `risk: "safe"`
200: - A sample of delete tools have `risk: "high_impact"`
201: - TypeScript compiles: `npx tsc --noEmit src/generated/composio-manifests/<slug>.generated.ts 2>&1 | grep -v node_modules`
202: 
203: ---
204: 
205: ## Step 3: Update the Integration Catalog
206: 
207: Edit `src/data/integrations.ts` to register (or update) the integration entry.
208: 
209: ### If the integration already exists as Pipedream
210: 
211: Change `setupMode` from `"pipedream"` to `"composio"` and update the tools list.
212: 
213: **Example (Gmail currently uses Pipedream):**
214: 
215: ```typescript
216: gmail: {
217:     setupMode: "composio",  // was "pipedream"
218:     dashboardStatus: "available",
219:     runtimeStatus: "live",
220:     setupGuide: "Connect Gmail through ClawLink's hosted setup...",
221:     credentialFields: [],
222:     tools: [
223:       // Curated subset of ~10-15 key tools for dashboard display
224:       { name: "gmail_send_email", description: "Send a Gmail message" },
225:       { name: "gmail_list_emails", description: "List Gmail messages" },
226:       { name: "gmail_get_email", description: "Get a specific Gmail message" },
227:       { name: "gmail_create_draft", description: "Create a draft in Gmail" },
228:       // ... more curated tools
229:     ],
230:   },
231: ```
232: 
233: ### If the integration is new
234: 
235: Add a new entry in `integrationMetadata`:
236: 
237: ```typescript
238: <slug>: {
239:     setupMode: "composio",
240:     dashboardStatus: "available",
241:     runtimeStatus: "live",
242:     setupGuide: "Connect <Name> through ClawLink's hosted setup. ...",
243:     credentialFields: [],
244:     tools: [
245:       // Curated 10-15 representative tools
246:     ],
247:   },
248: ```
249: 
250: Also add the base entry in `integrations` if it doesn't exist:
251: 
252: ```typescript
253: { name: "<Name>", slug: "<slug>", description: "...", category: "...", icon: "...", color: "#..." }
254: ```
255: 
256: ### Dashboard tools curation
257: 
258: The `tools` array in `integrations.ts` is what users see on the dashboard integration page. Do NOT list all tools here. Pick ~10-15 representative tools across the key categories the integration offers.
259: 
260: For example, for Instantly (115 active tools), the curated dashboard list is:
261: 
262: | Category | Example tools |
263: |---|---|
264: | Workspace | `instantly_get_current_workspace`, `instantly_get_workspace_billing_plan_details` |
265: | Campaigns | `instantly_list_campaigns`, `instantly_create_campaign`, `instantly_get_campaign_analytics`, `instantly_activate_campaign`, `instantly_pause_campaign` |
266: | Leads | `instantly_list_leads`, `instantly_create_lead`, `instantly_add_leads_bulk` |
267: | Lead Lists | `instantly_list_lead_lists` |
268: | Accounts | `instantly_list_accounts` |
269: | Emails | `instantly_list_emails` |
270: | Webhooks | `instantly_list_webhooks` |
271: 
272: All tools are still available to OpenClaw at runtime regardless of what's listed here.
273: 
274: ---
275: 
276: ## Step 4: Update Wrangler Environment Configs
277: 
278: Both workers need Composio config for the new integration.
279: 
280: ### `wrangler.toml` (frontend worker `clawlink-web`)
281: 
282: Update the comma-separated maps:
283: 
284: ```toml
285: COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
286: COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
287: COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
288: ```
289: 
290: ### `worker/wrangler.worker.toml` (backend worker `clawlink`)
291: 
292: Same changes:
293: 
294: ```toml
295: COMPOSIO_ENABLED_SLUGS = "instantly,apollo"
296: COMPOSIO_TOOLKIT_MAP = "instantly=instantly,apollo=apollo"
297: COMPOSIO_TOOLKIT_VERSION_MAP = "instantly=20260429_00,apollo=<VERSION>"
298: ```
299: 
300: ### Secrets: Push from `.env.local` to Cloudflare Workers
301: 
302: All Composio secrets must be set on **both** workers. The values are already in `.env.local` -- read them from there and push via wrangler.
303: 
304: **Important:** `wrangler secret put` reads from stdin in non-interactive mode. Use `echo` to pipe the value.
305: 
306: #### Push the per-integration auth config ID
307: 
308: Read the value from `.env.local` and set it on both workers:
309: 
310: ```bash
311: # Extract the value (strip quotes)
312: AUTH_CONFIG_ID=$(grep COMPOSIO_<SLUG>_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
313: 
314: # Push to frontend worker (clawlink-web, uses wrangler.toml)
315: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID
316: 
317: # Push to backend worker (clawlink, uses worker/wrangler.worker.toml)
318: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
319: ```
320: 
321: Concrete example for Apollo:
322: 
323: ```bash
324: AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
325: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
326: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
327: ```
328: 
329: #### Push `COMPOSIO_API_KEY` (only needed once, not per-integration)
330: 
331: If this is the first Composio integration being set up and the API key hasn't been pushed yet:
332: 
333: ```bash
334: API_KEY=$(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '"')
335: echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY
336: echo "$API_KEY" | wrangler secret put COMPOSIO_API_KEY --config worker/wrangler.worker.toml
337: ```
338: 
339: #### Verify secrets are set
340: 
341: ```bash
342: # List secrets on frontend worker
343: wrangler secret list
344: 
345: # List secrets on backend worker
346: wrangler secret list --config worker/wrangler.worker.toml
347: ```
348: 
349: Both should show `COMPOSIO_API_KEY` and `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` in the list.
350: 
351: ### Finding the toolkit version
352: 
353: The version is printed by the import script (e.g. `Toolkit version: 20260429_00`). It's also returned in the list-tools API response (`version` field on each tool). Use the same version for all tools in a toolkit.
354: 
355: ---
356: 
357: ## Step 5: Handle Auth Flow Differences
358: 
359: Composio supports two auth methods. The ClawLink frontend already handles both generically. **No redirect URI configuration is needed** because ClawLink uses Composio's managed auth -- Composio owns the OAuth apps and handles all redirect URIs internally.
360: 
361: ### OAuth-based integrations (Gmail, Outlook, ClickUp)
362: 
363: The flow is:
364: 
365: ```
366: User clicks Connect on ClawLink dashboard
367:   → POST /api/connect/sessions/{token}/composio
368:     → createComposioConnectLink() sends auth_config_id + callback_url to Composio
369:     → Composio returns a redirectUrl (their hosted OAuth page)
370:   → window.location.assign(redirectUrl) — full page redirect to Composio
371:   → Composio's hosted page redirects to the provider's OAuth login (e.g. Microsoft)
372:   → User authorizes on the provider's OAuth page
373:   → Provider redirects back to Composio (Composio owns this redirect URI)
374:   → Composio processes tokens, stores credentials
375:   → Composio redirects to ClawLink's callback_url:
376:       /api/connect/sessions/{token}/composio/complete?connected_account_id=...
377:   → ClawLink's /complete route polls until account is active, saves to D1
378:   → User is redirected back to the connect page with status "connected"
379: ```
380: 
381: **No additional frontend code or redirect URI setup needed.** Composio manages the OAuth app registration, redirect URIs, and token exchange for the provider. ClawLink only needs:
382: 
383: 1. The `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` set as a secret (from `.env.local`)
384: 2. `setupMode: "composio"` in `integrations.ts`
385: 
386: The `HostedConnectPage.tsx` already detects `setupMode === "composio"` and auto-triggers `handleStartComposio()`. The `/composio/route.ts` creates the connect link. The `/composio/complete/route.ts` handles the callback. All generic, no per-integration code.
387: 
388: ### API key-based integrations (Instantly, Apollo)
389: 
390: The same flow works for API key integrations. Composio shows its own hosted API key input page instead of an OAuth login page. The user pastes their API key on Composio's page, Composio validates it and redirects back to ClawLink's callback.
391: 
392: **No custom routes or forms needed.** The standard Composio connect flow handles both OAuth and API key auth types.
393: 
394: ---
395: 
396: ## Step 6: Handle Pipedream-to-Composio Migration (If Applicable)
397: 
398: If the integration previously had a Pipedream manifest, you need to disable it at runtime. A database migration is **not** needed unless you have real users with existing Pipedream connections.
399: 
400: ### 6a. Disable Pipedream tools at runtime
401: 
402: Add the integration slug to the disabled set in `worker/integrations/index.ts`:
403: 
404: ```typescript
405: const disabledPipedreamManifestIntegrations = new Set(["instantly", "gmail"]);
406: ```
407: 
408: This ensures Pipedream manifest tools are not served for this integration. Only Composio tools will be active.
409: 
410: ### 6b. Migrate existing user connections (only if you have real users)
411: 
412: **Skip this step unless you have real users with active Pipedream connections for this integration.** If the product has no external users yet, or if nobody has connected this integration through Pipedream, there is nothing to migrate.
413: 
414: If you do have real users with Pipedream connections that need to be invalidated, create a SQL migration:
415: 
416: ```sql
417: -- Mark existing Pipedream connections as needing reauth
418: UPDATE user_integrations
419: SET auth_state = 'needs_reauth',
420:     auth_error = '<Integration> now connects through ClawLink''s hosted setup. Reconnect to enable the expanded tool catalog.',
421:     is_default = 0,
422:     updated_at = datetime('now')
423: WHERE integration = '<slug>'
424:   AND (auth_provider = 'pipedream' OR pipedream_account_id IS NOT NULL);
425: ```
426: 
427: Run it with:
428: 
429: ```bash
430: wrangler d1 execute clawlink --file migrations/0XX_composio_<slug>.sql
431: ```
432: 
433: ### 6c. Keep Pipedream manifests on disk
434: 
435: Don't delete the Pipedream generated manifest files. They remain on disk but are disabled at runtime by the `disabledPipedreamManifestIntegrations` set. This allows easy rollback if needed.
436: 
437: ---
438: 
439: ## Step 7: Update Smoke Test Presets
440: 
441: Create or update `scripts/smoke-presets/<slug>.mjs`:
442: 
443: ```javascript
444: export default {
445:   read: [
446:     {
447:       tool: "<slug>_list_<resource>",
448:       args: {},
449:       label: "List <resources>",
450:     },
451:     {
452:       tool: "<slug>_get_<resource>",
453:       args: { id: "test-id" },
454:       label: "Get <resource>",
455:     },
456:   ],
457:   preview: [
458:     {
459:       tool: "<slug>_create_<resource>",
460:       args: { name: "ClawLink Test" },
461:       label: "Preview create <resource>",
462:     },
463:   ],
464: };
465: ```
466: 
467: Focus on:
468: - At least 2-3 safe read presets
469: - Optionally 1 preview/write preset using sandboxed test data
470: 
471: ---
472: 
473: ## Step 8: Deploy
474: 
475: Both workers need redeployment:
476: 
477: ```bash
478: # Build and deploy frontend (serves dashboard, connect flow, API routes)
479: npm run build:web && npm run deploy:web
480: 
481: # Build and deploy worker (serves tool execution at api.claw-link.dev)
482: npm run build:worker && npm run deploy:worker
483: ```
484: 
485: **Important:** If you only deploy one worker, the other won't have the new integration. Deploy both.
486: 
487: ---
488: 
489: ## Step 9: Validate
490: 
491: Follow the standard integration MVP testing layers from `AGENTS.md`:
492: 
493: ### Layer 1: Connection flow
494: 
495: 1. Go to the dashboard, find the new integration
496: 2. Click Connect
497: 3. Complete the OAuth flow (or API key submission)
498: 4. Verify the connection session ends in `connected`
499: 5. Verify the connection shows in the dashboard
500: 
501: ### Layer 2: Tool execution
502: 
503: 1. Use the OpenClaw plugin or the worker API directly
504: 2. Test read tools first (list, get)
505: 3. Then test write tools (create, update)
506: 4. Verify Composio returns valid data
507: 
508: ### Automated validation
509: 
510: ```bash
511: # Static manifest audit
512: npm run audit:manifests -- --strict
513: 
514: # Smoke test (if presets are configured)
515: npm run smoke:openclaw-plugin -- --preset <slug>
516: ```
517: 
518: ---
519: 
520: ## Quick Reference: Files to Touch Per Integration
521: 
522: | File | Action | Required? |
523: |---|---|---|
524: | `src/generated/composio-manifests/<slug>.generated.ts` | Create via `npm run import:composio-tools` | Yes |
525: | `src/generated/composio-manifests/index.ts` | Auto-updated by the script | Yes (automatic) |
526: | `src/data/integrations.ts` | Add/update integration entry with `setupMode: "composio"` and curated tools | Yes |
527: | `wrangler.toml` | Add to `COMPOSIO_ENABLED_SLUGS`, `COMPOSIO_TOOLKIT_MAP`, `COMPOSIO_TOOLKIT_VERSION_MAP` | Yes |
528: | `worker/wrangler.worker.toml` | Same as above | Yes |
529: | Cloudflare secrets | Set `COMPOSIO_<SLUG>_AUTH_CONFIG_ID` (or update `COMPOSIO_AUTH_CONFIG_MAP`) | Yes |
530: | `worker/integrations/index.ts` | Add to `disabledPipedreamManifestIntegrations` if migrating from Pipedream | Only if migrating |
531: | `migrations/0XX_composio_<slug>.sql` | Invalidate old Pipedream connections | Only if you have real users with Pipedream connections |
532: | `scripts/smoke-presets/<slug>.mjs` | Create smoke test presets | Recommended |
533: 
534: ---
535: 
536: ## Quick Reference: What Does NOT Need to Change
537: 
538: These are fully generic and handle any Composio integration automatically:
539: 
540: - `scripts/import-composio-tools.mjs` — Already built, works for any toolkit
541: - `src/lib/composio/backend-client.ts` — Composio API client (connection + execution)
542: - `src/lib/composio/tool-executor.ts` — Tool execution adapter
543: - `src/lib/composio/manifest-registry.ts` — Indexes whatever `composioToolManifests` exports
544: - `worker/index.ts` — Worker dispatch (handles any `composio_tool` execution kind)
545: - `worker/credentials.ts` — Credential loading for Composio connections
546: - `worker/integrations/index.ts` — Auto-includes all Composio manifests (no per-integration wiring needed)
547: - `src/components/connect/HostedConnectPage.tsx` — Already handles `setupMode === "composio"` generically
548: - `src/app/api/connect/sessions/[token]/composio/route.ts` — Creates connect link for any Composio integration
549: - `src/app/api/connect/sessions/[token]/composio/complete/route.ts` — Handles OAuth callback for any Composio integration
550: - `src/app/api/connect/start/route.ts` — Handles `"composio"` setup mode generically
551: - `src/lib/server/integration-store.ts` — Saves Composio connections generically
552: - `src/lib/server/connection-sessions.ts` — Completes Composio sessions generically
553: - Database schema — No changes needed (Composio columns already exist from migration 012)
554: 
555: ---
556: 
557: ## Example: Adding Apollo via Composio
558: 
559: ```bash
560: # 1. Discover tools
561: curl -s "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=apollo&toolkit_versions=latest&limit=1000" \
562:   -H "x-api-key: $(grep COMPOSIO_API_KEY .env.local | cut -d= -f2 | tr -d '\"')" | jq '.total_items'
563: 
564: # 2. Dry-run to preview
565: npm run import:composio-tools -- --toolkit apollo --integration apollo --dry-run
566: 
567: # 3. Generate manifest
568: npm run import:composio-tools -- --toolkit apollo --integration apollo
569: 
570: # 4. Edit src/data/integrations.ts
571: #    - If apollo already exists: change setupMode to "composio", update tools list
572: #    - If new: add base entry + metadata entry
573: 
574: # 5. Edit wrangler.toml + worker/wrangler.worker.toml
575: #    Add apollo to COMPOSIO_ENABLED_SLUGS, COMPOSIO_TOOLKIT_MAP, COMPOSIO_TOOLKIT_VERSION_MAP
576: 
577: # 6. Push secrets from .env.local to both workers
578: AUTH_CONFIG_ID=$(grep COMPOSIO_APOLLO_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
579: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID
580: echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_APOLLO_AUTH_CONFIG_ID --config worker/wrangler.worker.toml
581: 
582: # 7. If migrating from Pipedream:
583: #    - Add "apollo" to disabledPipedreamManifestIntegrations in worker/integrations/index.ts
584: #    - Only create a migration file if you have real users with Pipedream connections
585: 
586: # 8. Deploy both workers
587: npm run build:web && npm run deploy:web
588: npm run build:worker && npm run deploy:worker
589: 
590: # 9. Test
591: #    Connect Apollo through the dashboard
592: #    Verify tool execution works
593: ```
594: 
595: ---
596: 
597: ## Composio API Quick Reference
598: 
599: | Endpoint | Purpose |
600: |---|---|
601: | `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000` | List all tools for a toolkit |
602: | `GET /api/v3.1/tools/{tool_slug}` | Get single tool details |
603: | `GET /api/v3.1/tools/enum?toolkit_slug=<slug>` | Get tool slug enum list |
604: | `POST /api/v3.1/tools/execute/{tool_slug}` | Execute a tool |
605: | `POST /api/v3.1/connected_accounts/link` | Create connect link (for OAuth flow) |
606: | `GET /api/v3.1/connected_accounts/{id}` | Get connected account details |
607: | `DELETE /api/v3.1/connected_accounts/{id}` | Delete connected account |
608: 
609: Base URL: `https://backend.composio.dev`
610: Auth: `x-api-key` header with your `COMPOSIO_API_KEY`

(End of file - total 610 lines)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 39.7s)

Now I need to update several sections. The main changes are:

1. **Step 2 "What it does"** -- remove the `inputSchema` conversion step, add note about lazy schemas
2. **Step 2 "What the output looks like"** -- remove `inputSchema` from the example
3. **"Quick Reference: What Does NOT Need to Change"** -- add `schema-cache.ts`, update descriptions for `manifest-registry.ts` and `backend-client.ts`
4. Add a new section explaining the runtime schema hydration architecture

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md",
  "oldString": "### What it does\n\n1. Reads `COMPOSIO_API_KEY` from `.env.local`\n2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`\n3. Skips deprecated tools (`is_deprecated === true`)\n4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback\n5. Converts `input_parameters` JSON Schema to the ClawLink `inputSchema` format\n6. Generates `askBefore` prompts for write/destructive tools\n7. Writes `src/generated/composio-manifests/<integration>.generated.ts`\n8. Updates the barrel file `src/generated/composio-manifests/index.ts`",
  "newString": "### What it does\n\n1. Reads `COMPOSIO_API_KEY` from `.env.local`\n2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`\n3. Skips deprecated tools (`is_deprecated === true`)\n4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback\n5. Generates `askBefore` prompts for write/destructive tools\n6. Writes `src/generated/composio-manifests/<integration>.generated.ts`\n7. Updates the barrel file `src/generated/composio-manifests/index.ts`"
}
```

**Error:**
```
Could not find oldString in the file. It must match exactly, including whitespace, indentation, and line endings.
```

---

## Assistant (Build · Claude Opus 4.6 · 45.0s)

The file was already updated in my earlier edit within this session. Let me check what's currently in the file at that section:

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md",
  "offset": 136,
  "limit": 70
}
```

**Output:**
```
<path>/Users/hithesh/clawlink/docs/composio-integration-setup-guide.md</path>
<type>file</type>
<content>
136: 
137: ### What it does
138: 
139: 1. Reads `COMPOSIO_API_KEY` from `.env.local`
140: 2. Calls `GET /api/v3.1/tools?toolkit_slug=<slug>&toolkit_versions=latest&limit=1000`
141: 3. Skips deprecated tools (`is_deprecated === true`)
142: 4. Classifies each tool's `mode` and `risk` using Composio hint tags (primary) with slug-pattern fallback
143: 5. Generates `askBefore` prompts for write/destructive tools
144: 6. Writes `src/generated/composio-manifests/<integration>.generated.ts`
145: 7. Updates the barrel file `src/generated/composio-manifests/index.ts`
146: 
147: **Important:** The script intentionally does **not** include `inputSchema` in the generated manifests. Schemas are fetched lazily at runtime from Composio's API and cached in KV. This keeps the worker bundle small (~75% reduction in manifest size) and means schema updates from Composio are picked up automatically without re-importing. See "Runtime Schema Hydration" below for details.
148: 
149: ### How it classifies tools
150: 
151: The script uses Composio's own hint tags from the `tags` array as the primary signal:
152: 
153: | Composio tag | `mode` | `risk` |
154: |---|---|---|
155: | `readOnlyHint` | `"read"` | `"safe"` |
156: | `createHint` | `"write"` | `"confirm"` |
157: | `updateHint` | `"write"` | `"confirm"` |
158: | `destructiveHint` | `"write"` | `"high_impact"` |
159: 
160: If no hint tag is present, the script falls back to slug pattern matching:
161: 
162: | Slug pattern | `mode` | `risk` |
163: |---|---|---|
164: | Contains `GET`, `LIST`, `COUNT`, `CHECK`, `EXPORT`, `SEARCH`, `FIND`, `ENUM`, `STATUS`, `ANALYTICS`, `STATS`, `VITALS`, `OVERVIEW` | `"read"` | `"safe"` |
165: | Contains `DELETE`, `REMOVE` | `"write"` | `"high_impact"` |
166: | Anything else | `"write"` | `"confirm"` |
167: 
168: **Important:** The `ToolRisk` type in ClawLink is `"safe" | "confirm" | "high_impact"`. There is no `"dangerous"` value.
169: 
170: ### What the output looks like
171: 
172: The script generates a TypeScript file with one `composioTool({...})` call per tool:
173: 
174: ```typescript
175: composioTool({
176:   name: "apollo_search_people",
177:   description: "Search for people in Apollo's database...",
178:   toolSlug: "APOLLO_SEARCH_PEOPLE",
179:   mode: "read",
180:   risk: "safe",
181:   inputSchema: {
182:     type: "object",
183:     additionalProperties: true,
184:     properties: {
185:       q: { type: "string", description: "Search query" },
186:       limit: { type: "integer", description: "Max results" },
187:     },
188:   },
189:   tags: ["composio", "apollo", "read", "people"],
190: }),
191: ```
192: 
193: The barrel file at `src/generated/composio-manifests/index.ts` is automatically rewritten to import and re-export all `*.generated.ts` files in the directory.
194: 
195: ### Verify
196: 
197: After running, check:
198: - The generated file has the expected number of tools (compare with `total_items` from the API)
199: - A sample of read tools have `risk: "safe"`
200: - A sample of delete tools have `risk: "high_impact"`
201: - TypeScript compiles: `npx tsc --noEmit src/generated/composio-manifests/<slug>.generated.ts 2>&1 | grep -v node_modules`
202: 
203: ---
204: 
205: ## Step 3: Update the Integration Catalog

(Showing lines 136-205 of 610. Use offset=206 to continue.)
</content>
```

---

## Assistant (Build · Claude Opus 4.6 · 38.8s)

---

## User

do it

---

## Assistant (Build · Kimi K2.6 · 39.5s)

_Thinking:_

The user wants me to finish updating the docs. I can see the file already has some updates (the "Important" note about lazy schemas was already added in a previous edit), but the example output still shows `inputSchema`. Let me fix the remaining issues:

1. The example output (line 170-191) still shows `inputSchema` - need to remove it
2. Need to add a "Runtime Schema Hydration" section 
3. Need to update the "Quick Reference: What Does NOT Need to Change" section to include schema-cache.ts and update descriptions

Let me do these edits now.

---

## User

do them

---

## Assistant (Build · Kimi K2.6)

---

