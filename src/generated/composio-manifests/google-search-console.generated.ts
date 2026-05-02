import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "google-search-console",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "google_search_console",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleSearchConsoleComposioTools: IntegrationTool[] = [
  composioTool({
    name: "google_search_console_add_site",
    description: "Adds a site to the set of the user's sites in Google Search Console. This action registers a new property (site) in Google Search Console for the authenticated user. After adding the site, you will need to verify ownership through one of the available verification methods. The site URL must be properly formatted as either a URL-prefix property (with protocol) or a domain property (with sc-domain prefix).",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_ADD_SITE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-search-console",
      "write",
      "sites",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Site.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "google_search_console_delete_site",
    description: "Removes a site from the user's Google Search Console sites. This action permanently removes a site property from the authenticated user's Search Console account. The site URL must be URL-encoded. Use this when you need to unregister a site from tracking in Search Console.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_DELETE_SITE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-search-console",
      "write",
      "sites",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Site.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "google_search_console_get_site",
    description: "Retrieves information about a specific Search Console site. Use when you need to get site details including permission level for a specific property.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_GET_SITE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
      "sites",
    ],
  }),
  composioTool({
    name: "google_search_console_get_sitemap",
    description: "Retrieves sitemap metadata (submitted/indexed counts, errors, warnings, last-submission timestamps) for a specific sitemap in Search Console. Returns metadata only, not raw XML content. Note: numeric fields like `errors`, `warnings`, `submitted`, and `indexed` may be returned as strings; cast to int before comparisons. Values such as `contents.indexed` can lag several days after submission.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_GET_SITEMAP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
    ],
  }),
  composioTool({
    name: "google_search_console_inspect_url",
    description: "Inspects a URL for indexing issues and status in Google Search Console. Results may reflect cached data lagging real changes by several days. High-volume use can trigger 429 quota errors; limit to priority URLs.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_INSPECT_URL",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
    ],
  }),
  composioTool({
    name: "google_search_console_list_sitemaps",
    description: "Lists all sitemaps for a site in Google Search Console. Response fields `errors`, `warnings`, `contents.submitted`, and `contents.indexed` may be returned as strings; cast to integers before numeric operations. Evaluate these fields alongside `isPending` for sitemap health.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_LIST_SITEMAPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
    ],
  }),
  composioTool({
    name: "google_search_console_list_sites",
    description: "Lists all verified sites (properties) owned by the authenticated user in Google Search Console. Response contains a siteEntry array — always iterate it, never assume a single object. Each entry includes permissionLevel, which varies per site; do not assume owner-level access for all returned properties. When calling downstream tools, use the site_url value exactly as returned, including protocol, subdomain, sc-domain: prefix, and trailing slash — any deviation causes empty results or permission errors. Empty siteEntry may indicate missing OAuth scopes or no verified properties. Newly added properties may not appear immediately due to propagation delay.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_LIST_SITES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
    ],
  }),
  composioTool({
    name: "google_search_console_search_analytics_query",
    description: "Queries Google Search Console for search analytics data including clicks, impressions, CTR, and position metrics. Only returns URLs with at least one impression; missing rows do not confirm non-indexing. Position is an impression-weighted average rank.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-search-console",
      "read",
    ],
  }),
  composioTool({
    name: "google_search_console_submit_sitemap",
    description: "Submits a sitemap to Google Search Console for indexing. This action registers or resubmits a sitemap for a verified property in Google Search Console. The sitemap file must be accessible at the specified URL and properly formatted as XML. Supported sitemap types include standard sitemaps, sitemap index files, RSS feeds, and Atom feeds. The authenticated user must have site owner or full user permissions for the property. After submission, Google will crawl and process the sitemap according to its standard indexing schedule.",
    toolSlug: "GOOGLE_SEARCH_CONSOLE_SUBMIT_SITEMAP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-search-console",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Submit Sitemap.",
    ],
  }),
];
