import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
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
    inputSchema: partial.inputSchema,
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        site_url: {
          type: "string",
          description: "The site URL to add to Google Search Console. For URL-prefix properties, use the full URL with protocol (e.g., 'https://www.example.com/'). For domain properties, use the sc-domain format (e.g., 'sc-domain:example.com'). The site will need to be verified after being added.",
        },
      },
      required: [
        "site_url",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        site_url: {
          type: "string",
          description: "The site URL to remove from Google Search Console. For URL-prefix properties, use the full URL with protocol (e.g., 'http://www.example.com/'). For domain properties, use the sc-domain format (e.g., 'sc-domain:example.com'). The site must be currently registered in Search Console for the authenticated user.",
        },
      },
      required: [
        "site_url",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        site_url: {
          type: "string",
          description: "The URL of the property to retrieve, as defined by Search Console. Examples: http://www.example.com/ (for a URL-prefix property) or sc-domain:example.com (for a Domain property).",
        },
      },
      required: [
        "site_url",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        feedpath: {
          type: "string",
          description: "The URL of the sitemap to retrieve. For example: https://www.example.com/sitemap.xml",
        },
        site_url: {
          type: "string",
          description: "The site's URL, including protocol. For example: https://www.example.com/ For domain properties, use `sc-domain:example.com` format instead.",
        },
      },
      required: [
        "site_url",
        "feedpath",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        site_url: {
          type: "string",
          description: "The URL of the property as defined in Search Console. URL-prefix properties must include a trailing slash. For example: https://www.example.com/",
        },
        language_code: {
          type: "string",
          description: "IETF BCP-47 language code for localizing the inspection results. For example: en-US, es-ES, fr-FR",
        },
        inspection_url: {
          type: "string",
          description: "The fully-qualified URL to inspect. Must be a page under the site specified in site_url. For example: https://www.example.com/page",
        },
      },
      required: [
        "inspection_url",
        "site_url",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        site_url: {
          type: "string",
          description: "The site's URL, including protocol. For example: https://www.example.com/ Must exactly match the Search Console property string — include trailing slash for URL-prefix properties or use `sc-domain:example.com` format for domain properties. An inexact match silently returns no data.",
        },
        sitemap_index: {
          type: "string",
          description: "A URL of a site's sitemap index file (e.g., http://www.example.com/sitemapindex.xml). When specified, lists the sitemaps contained within this sitemap index file instead of all sitemaps for the site.",
        },
      },
      required: [
        "site_url",
      ],
    },
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
    inputSchema: {
      type: "object",
      properties: {},
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_date: {
          type: "string",
          description: "The end date of the date range for the query, in YYYY-MM-DD format.",
        },
        site_url: {
          type: "string",
          description: "The site's URL, including protocol (e.g., https://www.example.com/) or a domain property (e.g., sc-domain:example.com). URL-prefix properties specify exact protocol and path, while domain properties aggregate data across all subdomains and protocols.",
        },
        row_limit: {
          type: "integer",
          description: "The maximum number of rows to return. Must be between 1 and 25,000. Note: The API returns top results sorted by clicks (or date when grouping by date). Must be between 1 and 5000. Use start_row to paginate; stop when response rows < row_limit.",
        },
        start_row: {
          type: "integer",
          description: "The first row to return from the result set. Used for pagination.",
        },
        data_state: {
          type: "string",
          description: "The data state to return.",
          enum: [
            "final",
            "all",
            "hourly_all",
          ],
        },
        dimensions: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "query",
              "page",
              "country",
              "device",
              "date",
              "searchAppearance",
              "hour",
            ],
          },
          description: "The dimensions to group the data by. Results are sorted by clicks descending, except when grouping by date (sorted by date ascending).",
        },
        start_date: {
          type: "string",
          description: "The start date of the date range for the query, in YYYY-MM-DD format. Data lags 2–3 days (UTC); most recent 1–2 days may be incomplete. Data retention is ~16 months; older ranges return zero rows.",
        },
        search_type: {
          type: "string",
          description: "The search type to filter results by.",
          enum: [
            "web",
            "image",
            "video",
            "news",
            "discover",
            "googleNews",
          ],
        },
        aggregation_type: {
          type: "string",
          description: "How data is aggregated.",
          enum: [
            "auto",
            "byPage",
            "byProperty",
            "byNewsShowcasePanel",
          ],
        },
        dimension_filter_groups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional filters to apply to dimensions. Each filter group contains an array of filters with structure: [{'filters': [{'dimension': 'country', 'operator': 'equals', 'expression': 'USA'}]}]. Operators: equals, notEquals, contains, notContains, includingRegex, excludingRegex. Invalid dimension names, unsupported operators, or mismatched expressions return zero rows without an error — verify each filter before trusting empty results.",
        },
      },
      required: [
        "site_url",
        "start_date",
        "end_date",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        feedpath: {
          type: "string",
          description: "The full URL of the sitemap to submit (e.g., 'https://www.example.com/sitemap.xml'). Must be accessible and properly formatted as a valid sitemap XML file. Can also be a sitemap index file or RSS/Atom feed URL. Must exactly match the registered sitemap URL including protocol, host, path, and trailing slash; mismatches return notFound or invalid errors.",
        },
        site_url: {
          type: "string",
          description: "The site URL as registered in Google Search Console. For URL-prefix properties, use the full URL with protocol (e.g., 'https://www.example.com/'). For domain properties, use the sc-domain format (e.g., 'sc-domain:example.com'). The site must be verified and owned by the authenticated user.",
        },
      },
      required: [
        "site_url",
        "feedpath",
      ],
    },
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
