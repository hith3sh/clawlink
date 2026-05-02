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
    integration: "google-ads",
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
      toolkit: "googleads",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleAdsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googleads_add_or_remove_to_customer_list",
    description: "AddOrRemoveToCustomerList Tool will add a contact to a customer list in Google Ads. Note: It takes 6 to 12 hours for changes to be reflected in the customer list. Email addresses must comply with Google Ads policies and applicable privacy/consent laws.",
    toolSlug: "GOOGLEADS_ADD_OR_REMOVE_TO_CUSTOMER_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-ads",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add or remove to customer list.",
    ],
  }),
  composioTool({
    name: "googleads_create_customer_list",
    description: "Creates a customer list in Google Ads. Note: Requires an authenticated Google Ads connection with customer_id configured. Email-based lists must comply with Google Ads policies and applicable privacy/consent laws. Membership updates can take many hours to propagate; targeting eligibility is not immediate after creation.",
    toolSlug: "GOOGLEADS_CREATE_CUSTOMER_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-ads",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create customer list.",
    ],
  }),
  composioTool({
    name: "googleads_get_campaign_by_id",
    description: "GetCampaignById Tool returns details of a campaign in Google Ads. Requires an active Google Ads OAuth connection with the correct customer_id configured; missing or mismatched customer_id will cause empty results.",
    toolSlug: "GOOGLEADS_GET_CAMPAIGN_BY_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-ads",
      "read",
    ],
  }),
  composioTool({
    name: "googleads_get_campaign_by_name",
    description: "Queries Google Ads via SQL to retrieve a campaign by its exact name. Requires an active Google Ads connection with valid customer_id and appropriate OAuth scopes.",
    toolSlug: "GOOGLEADS_GET_CAMPAIGN_BY_NAME",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-ads",
      "read",
    ],
  }),
  composioTool({
    name: "googleads_get_customer_lists",
    description: "GetCustomerLists Tool lists all customer lists (audience/remarketing lists) in Google Ads. These are user segments for targeting, not Google Ads accounts — list IDs are distinct from account IDs. When multiple lists share similar names, review all returned results before selecting one for downstream operations.",
    toolSlug: "GOOGLEADS_GET_CUSTOMER_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-ads",
      "read",
    ],
  }),
  composioTool({
    name: "googleads_list_accessible_customers",
    description: "ListAccessibleCustomers retrieves all Google Ads customer accounts accessible to the authenticated user. Returns resource names of customers (e.g., customers/1234567890) that can be accessed with the current OAuth credentials. Use this action to discover which customer IDs are available before making other API calls. Use this action when you need to determine which customer accounts the authenticated user has access to, or when you want to populate a dropdown of available accounts for the user to select from.",
    toolSlug: "GOOGLEADS_LIST_ACCESSIBLE_CUSTOMERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-ads",
      "read",
      "accounts",
    ],
  }),
  composioTool({
    name: "googleads_mutate_ad_groups",
    description: "Create, update, or remove ad groups within Google Ads campaigns. Supports batch operations with multiple ad group changes in a single request. Use when you need to manage ad groups programmatically, such as creating new ad groups for campaigns, updating ad group settings or status, or removing ad groups that are no longer needed. This action is irreversible for remove operations — deleted ad groups cannot be recovered once removed.",
    toolSlug: "GOOGLEADS_MUTATE_AD_GROUPS",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-ads",
      "write",
      "ad_groups",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Mutate Ad Groups.",
    ],
  }),
  composioTool({
    name: "googleads_mutate_campaigns",
    description: "Create, update, or remove Google Ads campaigns in batch. Supports multiple operations (create, update, remove) in a single request. Use when managing campaign lifecycle, applying bulk changes, or automating campaign management workflows. This action is irreversible for remove operations — deleted campaigns cannot be recovered. Plan accordingly and consider using validate_only=true to test changes before applying them.",
    toolSlug: "GOOGLEADS_MUTATE_CAMPAIGNS",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-ads",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Mutate Campaigns.",
    ],
  }),
  composioTool({
    name: "googleads_search_stream_gaql",
    description: "Execute a Google Ads Query Language (GAQL) query and stream all results in a single response. This method is more efficient than paginated search for bulk data retrieval of campaigns, ad groups, and performance metrics (clicks, impressions, cost). Use this action when you need the entire result set without pagination. Results are returned as a single response containing all matching rows.",
    toolSlug: "GOOGLEADS_SEARCH_STREAM_GAQL",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-ads",
      "read",
      "reporting",
    ],
  }),
];
