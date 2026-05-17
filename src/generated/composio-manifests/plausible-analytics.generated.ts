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
    integration: "plausible-analytics",
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
      toolkit: "plausible_analytics",
      toolSlug: partial.toolSlug,
      version: "20260422_01",
    },
  };
}

export const plausibleAnalyticsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "plausible_analytics_check_health",
    description: "Tool to check the health status of the Plausible Analytics API. Use when verifying API connectivity and service availability before making other API calls.",
    toolSlug: "PLAUSIBLE_ANALYTICS_CHECK_HEALTH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "health",
    ],
  }),
  composioTool({
    name: "plausible_analytics_get_breakdown_stats",
    description: "Tool to retrieve breakdown statistics for a specific property (dimension) from Plausible Analytics. Use when you need to analyze top sources, top pages, device breakdown, geographic distribution, or any other dimensional breakdown of your site traffic. This is a legacy Stats API v1 endpoint used for Top Sources, Top Pages and similar reports.",
    toolSlug: "PLAUSIBLE_ANALYTICS_GET_BREAKDOWN_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "plausible_analytics_get_plugin_capabilities",
    description: "Tool to retrieve available capabilities for the Plausible Analytics Plugins API. Use this to check which features are enabled for the authenticated account, such as Goals, Funnels, Stats API, and more.",
    toolSlug: "PLAUSIBLE_ANALYTICS_GET_PLUGIN_CAPABILITIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "plausible_analytics_get_realtime_visitors",
    description: "Tool to retrieve the number of current visitors on your site in the last 5 minutes. Use this to get real-time visitor counts from the Plausible Analytics Stats API v1.",
    toolSlug: "PLAUSIBLE_ANALYTICS_GET_REALTIME_VISITORS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "plausible_analytics_get_site",
    description: "Tool to retrieve details for a specific Plausible Analytics site. Use when you need site configuration including domain, timezone, custom properties, and tracker script settings.",
    toolSlug: "PLAUSIBLE_ANALYTICS_GET_SITE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "sites",
    ],
  }),
  composioTool({
    name: "plausible_analytics_get_timeseries_stats",
    description: "Tool to retrieve timeseries visitor data from Plausible Analytics over a specified time period. Use this to get historical trends for metrics like visitors, pageviews, bounce rate, and visit duration. This is the legacy Stats API v1 endpoint typically used for the main visitor graph.",
    toolSlug: "PLAUSIBLE_ANALYTICS_GET_TIMESERIES_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "plausible_analytics_list_custom_props",
    description: "Tool to list all custom properties configured for a site. Use when you need to retrieve custom property configurations for a Plausible Analytics site. Enterprise feature only.",
    toolSlug: "PLAUSIBLE_ANALYTICS_LIST_CUSTOM_PROPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "plausible_analytics_list_goals",
    description: "Tool to list all goals configured for a site. Use when you need to retrieve conversion goals and custom action tracking configured for a Plausible Analytics site.",
    toolSlug: "PLAUSIBLE_ANALYTICS_LIST_GOALS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "plausible_analytics_list_guests",
    description: "Tool to list all guest users who have access to a site's dashboard in Plausible Analytics. Use when you need to see which guests have been granted access to view a specific site's analytics. This is an Enterprise feature.",
    toolSlug: "PLAUSIBLE_ANALYTICS_LIST_GUESTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "user_management",
    ],
  }),
  composioTool({
    name: "plausible_analytics_list_sites",
    description: "Tool to list all sites the API key owner's Plausible account can access. Returns domain, timezone, and creation info with pagination support. Use when you need to retrieve all sites or paginate through large site lists.",
    toolSlug: "PLAUSIBLE_ANALYTICS_LIST_SITES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "sites",
    ],
  }),
  composioTool({
    name: "plausible_analytics_list_teams",
    description: "Tool to list all teams available for the API key owner. Use when you need to retrieve teams for site provisioning to a specific team.",
    toolSlug: "PLAUSIBLE_ANALYTICS_LIST_TEAMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "user_management",
    ],
  }),
  composioTool({
    name: "plausible_analytics_query_stats",
    description: "Tool to query analytics stats for a site using the Stats API v2. Use when you need to retrieve historical or real-time statistics such as visitors, pageviews, bounce rate, visit duration, and more. Supports filtering, grouping by dimensions, and custom date ranges.",
    toolSlug: "PLAUSIBLE_ANALYTICS_QUERY_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "plausible-analytics",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "plausible_analytics_record_event",
    description: "Tool to record a pageview or custom event via the Plausible Events API. Use when tracking Android/iOS mobile apps or server-side tracking. Requires proper User-Agent and optionally X-Forwarded-For headers for unique visitor counting.",
    toolSlug: "PLAUSIBLE_ANALYTICS_RECORD_EVENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "plausible-analytics",
      "write",
      "tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Record Event.",
    ],
  }),
];
