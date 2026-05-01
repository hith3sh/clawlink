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
    integration: "google-ads",
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of emails of the contacts to be added to the customer list. Emails must be valid, normalized strings (lowercase, trimmed); malformed addresses reduce match rates.",
        },
        operation: {
          type: "string",
          description: "Operation to be performed on the customer list. Either create or remove.",
          enum: [
            "create",
            "remove",
          ],
        },
        resource_name: {
          type: "string",
          description: "Resource name of the customer list. For example: customers/1234567890/userLists/1234567890",
        },
      },
      required: [
        "resource_name",
        "emails",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name of the customer list.",
        },
        description: {
          type: "string",
          description: "Description of the customer list.",
        },
      },
      required: [
        "name",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "id of the campaign to search on GoogleAds.",
        },
      },
      required: [
        "id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "name of the campaign to search on GoogleAds. Matched using exact SQL equality; paused or inactive campaigns may return no results — an empty result means no matching active campaign was found.",
        },
      },
      required: [
        "name",
      ],
    },
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
    inputSchema: {
      type: "object",
      properties: {},
    },
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
    inputSchema: {
      type: "object",
      properties: {},
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        operations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              create: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the ad group. Must be unique within the campaign.",
                  },
                  type: {
                    type: "string",
                    description: "Type of ad group.",
                    enum: [
                      "SEARCH_STANDARD",
                      "DISPLAY_STANDARD",
                      "SHOPPING_PRODUCT_ADS",
                      "VIDEO_BUMPER",
                      "VIDEO_TRUEVIEW_IN_STREAM",
                      "VIDEO_TRUEVIEW_IN_DISPLAY",
                      "VIDEO_NON_SKIPPABLE_IN_STREAM",
                      "SEARCH_DYNAMIC",
                      "SHOPPING_COMPARISON_LISTING",
                      "SMART_DISPLAY",
                      "VIDEO_EFFICIENT_REACH",
                      "PERFORMANCE_MAX",
                      "SEARCH_AS_MUCH_AS_POSSIBLE",
                      "SEARCH_TARGET_OUTCOME",
                      "DISPLAY_CUSTOM",
                      "SEARCH_UNIFORM",
                      "DISPLAY_AUTO",
                    ],
                  },
                  status: {
                    type: "string",
                    description: "Status of an ad group.",
                    enum: [
                      "ENABLED",
                      "PAUSED",
                      "REMOVED",
                    ],
                  },
                  campaign: {
                    type: "string",
                    description: "Resource name of the campaign that owns the ad group. Example: customers/1234567890/campaigns/9876543210",
                  },
                },
                description: "Fields for creating a new ad group.",
              },
              remove: {
                type: "string",
                description: "Resource name of the ad group to remove. Example: customers/1234567890/adGroups/9876543210",
              },
              update: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the ad group.",
                  },
                  status: {
                    type: "string",
                    description: "Status of an ad group.",
                    enum: [
                      "ENABLED",
                      "PAUSED",
                      "REMOVED",
                    ],
                  },
                  resource_name: {
                    type: "string",
                    description: "Resource name of the ad group to update. Example: customers/1234567890/adGroups/9876543210",
                  },
                },
                description: "Fields for updating an existing ad group (only include fields to update).",
              },
            },
            description: "A single ad group operation.",
          },
          description: "List of ad group operations (create, update, or remove). At least one operation is required.",
        },
        validate_only: {
          type: "boolean",
          description: "If true, validates the request without executing. Useful for testing before making actual changes.",
        },
        partial_failure: {
          type: "boolean",
          description: "If true, valid operations succeed even if other operations fail. Defaults to false.",
        },
      },
      required: [
        "operations",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        operations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              create: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the campaign. Must be unique within the customer account. Required for create.",
                  },
                  status: {
                    type: "string",
                    description: "Status of the campaign.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "enabled",
                      "paused",
                      "removed",
                    ],
                  },
                  end_date: {
                    type: "string",
                    description: "End date of the campaign in YYYY-MM-DD format.",
                  },
                  manual_cpc: {
                    type: "object",
                    additionalProperties: true,
                    description: "Manual CPC bidding strategy. Provide an empty object {} to use manual CPC without a bidding strategy.",
                  },
                  start_date: {
                    type: "string",
                    description: "Start date of the campaign in YYYY-MM-DD format.",
                  },
                  daily_budget: {
                    type: "number",
                    description: "Daily budget amount in the account's currency.",
                  },
                  network_type: {
                    type: "string",
                    description: "Network settings for the campaign (e.g., 'google_search', 'youtube').",
                  },
                  resource_name: {
                    type: "string",
                    description: "Resource name of the campaign for update operations. Format: customers/{customer_id}/campaigns/{campaign_id}",
                  },
                  campaign_budget: {
                    type: "string",
                    description: "Resource name of the campaign budget to associate with the campaign. Required for create.",
                  },
                  final_url_suffix: {
                    type: "string",
                    description: "Suffix appended to landing page URLs served with parallel tracking. Use for adding tracking parameters (e.g., 'gclid={gclid}&campaign={campaignid}').",
                  },
                  network_settings: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      target_youtube: {
                        type: "boolean",
                        description: "Whether ads will be served on YouTube.",
                      },
                      target_google_search: {
                        type: "boolean",
                        description: "Whether ads will be served with google.com search results.",
                      },
                      target_search_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the Google Search Partners Network (requires target_google_search to be true).",
                      },
                      target_content_network: {
                        type: "boolean",
                        description: "Whether ads will be served on specified placements in the Google Display Network.",
                      },
                      target_google_tv_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the Google TV network.",
                      },
                      target_partner_search_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the partner network. Only available for select partner accounts.",
                      },
                    },
                    description: "Network settings for the campaign controlling where ads are served.",
                  },
                  targeted_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Geo target criteria IDs for location targeting.",
                  },
                  exclusion_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Geo target criteria IDs for location exclusions.",
                  },
                  bidding_strategy_type: {
                    type: "string",
                    description: "Type of bidding strategy.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "manual_cpc",
                      "manual_cpm",
                      "pageone_promoted",
                      "target_spend",
                      "target_cpa",
                      "target_roas",
                      "maximize_conversions",
                      "maximize_conversion_value",
                      "target_impression_share",
                    ],
                  },
                  tracking_url_template: {
                    type: "string",
                    description: "The URL template for constructing a tracking URL. Use ValueTrack parameters like {lpurl} for the landing page URL.",
                  },
                  url_custom_parameters: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        key: {
                          type: "string",
                          description: "The key of the custom parameter. Max 16 bytes.",
                        },
                        value: {
                          type: "string",
                          description: "The value of the custom parameter. Max 200 bytes.",
                        },
                      },
                      description: "A custom parameter tag for tracking URLs.",
                    },
                    description: "Custom parameter tags for substitution in tracking_url_template, final_urls, or mobile_final_urls. Max 8 parameters, key max 16 bytes, value max 200 bytes.",
                  },
                  geo_target_type_setting: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      negative_geo_target_type: {
                        type: "string",
                        description: "Negative geo target type for geotargeting.",
                        enum: [
                          "UNSPECIFIED",
                          "UNKNOWN",
                          "PRESENCE_OR_INTEREST",
                          "PRESENCE",
                        ],
                      },
                      positive_geo_target_type: {
                        type: "string",
                        description: "Positive geo target type for geotargeting.",
                        enum: [
                          "UNSPECIFIED",
                          "UNKNOWN",
                          "PRESENCE_OR_INTEREST",
                          "SEARCH_INTEREST",
                          "PRESENCE",
                        ],
                      },
                    },
                    description: "Settings for ads geotargeting.",
                  },
                  advertising_channel_type: {
                    type: "string",
                    description: "Type of advertising channel for the campaign.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "search",
                      "display",
                      "shopping",
                      "video",
                      "multi_channel",
                      "local",
                      "smart",
                      "video_reach",
                    ],
                  },
                  campaign_bidding_strategy: {
                    type: "string",
                    description: "Resource name of the bidding strategy to use. Format: customers/{customer_id}/biddingStrategies/{bidding_strategy_id}",
                  },
                  contains_eu_political_advertising: {
                    type: "string",
                    description: "EU political advertising status.",
                    enum: [
                      "UNSPECIFIED",
                      "UNKNOWN",
                      "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
                      "CONTAINS_EU_POLITICAL_ADVERTISING",
                    ],
                  },
                },
                description: "Campaign data for create or update operations.",
              },
              remove: {
                type: "string",
                description: "Resource name of the campaign to remove. Required when operation_type is 'remove'.",
              },
              update: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the campaign. Must be unique within the customer account. Required for create.",
                  },
                  status: {
                    type: "string",
                    description: "Status of the campaign.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "enabled",
                      "paused",
                      "removed",
                    ],
                  },
                  end_date: {
                    type: "string",
                    description: "End date of the campaign in YYYY-MM-DD format.",
                  },
                  manual_cpc: {
                    type: "object",
                    additionalProperties: true,
                    description: "Manual CPC bidding strategy. Provide an empty object {} to use manual CPC without a bidding strategy.",
                  },
                  start_date: {
                    type: "string",
                    description: "Start date of the campaign in YYYY-MM-DD format.",
                  },
                  daily_budget: {
                    type: "number",
                    description: "Daily budget amount in the account's currency.",
                  },
                  network_type: {
                    type: "string",
                    description: "Network settings for the campaign (e.g., 'google_search', 'youtube').",
                  },
                  resource_name: {
                    type: "string",
                    description: "Resource name of the campaign for update operations. Format: customers/{customer_id}/campaigns/{campaign_id}",
                  },
                  campaign_budget: {
                    type: "string",
                    description: "Resource name of the campaign budget to associate with the campaign. Required for create.",
                  },
                  final_url_suffix: {
                    type: "string",
                    description: "Suffix appended to landing page URLs served with parallel tracking. Use for adding tracking parameters (e.g., 'gclid={gclid}&campaign={campaignid}').",
                  },
                  network_settings: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      target_youtube: {
                        type: "boolean",
                        description: "Whether ads will be served on YouTube.",
                      },
                      target_google_search: {
                        type: "boolean",
                        description: "Whether ads will be served with google.com search results.",
                      },
                      target_search_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the Google Search Partners Network (requires target_google_search to be true).",
                      },
                      target_content_network: {
                        type: "boolean",
                        description: "Whether ads will be served on specified placements in the Google Display Network.",
                      },
                      target_google_tv_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the Google TV network.",
                      },
                      target_partner_search_network: {
                        type: "boolean",
                        description: "Whether ads will be served on the partner network. Only available for select partner accounts.",
                      },
                    },
                    description: "Network settings for the campaign controlling where ads are served.",
                  },
                  targeted_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Geo target criteria IDs for location targeting.",
                  },
                  exclusion_locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Geo target criteria IDs for location exclusions.",
                  },
                  bidding_strategy_type: {
                    type: "string",
                    description: "Type of bidding strategy.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "manual_cpc",
                      "manual_cpm",
                      "pageone_promoted",
                      "target_spend",
                      "target_cpa",
                      "target_roas",
                      "maximize_conversions",
                      "maximize_conversion_value",
                      "target_impression_share",
                    ],
                  },
                  tracking_url_template: {
                    type: "string",
                    description: "The URL template for constructing a tracking URL. Use ValueTrack parameters like {lpurl} for the landing page URL.",
                  },
                  url_custom_parameters: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        key: {
                          type: "string",
                          description: "The key of the custom parameter. Max 16 bytes.",
                        },
                        value: {
                          type: "string",
                          description: "The value of the custom parameter. Max 200 bytes.",
                        },
                      },
                      description: "A custom parameter tag for tracking URLs.",
                    },
                    description: "Custom parameter tags for substitution in tracking_url_template, final_urls, or mobile_final_urls. Max 8 parameters, key max 16 bytes, value max 200 bytes.",
                  },
                  geo_target_type_setting: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      negative_geo_target_type: {
                        type: "string",
                        description: "Negative geo target type for geotargeting.",
                        enum: [
                          "UNSPECIFIED",
                          "UNKNOWN",
                          "PRESENCE_OR_INTEREST",
                          "PRESENCE",
                        ],
                      },
                      positive_geo_target_type: {
                        type: "string",
                        description: "Positive geo target type for geotargeting.",
                        enum: [
                          "UNSPECIFIED",
                          "UNKNOWN",
                          "PRESENCE_OR_INTEREST",
                          "SEARCH_INTEREST",
                          "PRESENCE",
                        ],
                      },
                    },
                    description: "Settings for ads geotargeting.",
                  },
                  advertising_channel_type: {
                    type: "string",
                    description: "Type of advertising channel for the campaign.",
                    enum: [
                      "unspecified",
                      "unknown",
                      "search",
                      "display",
                      "shopping",
                      "video",
                      "multi_channel",
                      "local",
                      "smart",
                      "video_reach",
                    ],
                  },
                  campaign_bidding_strategy: {
                    type: "string",
                    description: "Resource name of the bidding strategy to use. Format: customers/{customer_id}/biddingStrategies/{bidding_strategy_id}",
                  },
                  contains_eu_political_advertising: {
                    type: "string",
                    description: "EU political advertising status.",
                    enum: [
                      "UNSPECIFIED",
                      "UNKNOWN",
                      "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
                      "CONTAINS_EU_POLITICAL_ADVERTISING",
                    ],
                  },
                },
                description: "Campaign data for create or update operations.",
              },
              operation_type: {
                type: "string",
                description: "Type of operation: create, update, or remove.",
                enum: [
                  "create",
                  "update",
                  "remove",
                ],
              },
            },
            description: "A single campaign operation (create, update, or remove).",
          },
          description: "List of campaign operations to perform. Each operation can be create, update, or remove. At least one operation is required.",
        },
        validate_only: {
          type: "boolean",
          description: "If true, validates the request without executing. Useful for testing before making actual changes.",
        },
        partial_failure: {
          type: "boolean",
          description: "If true, valid operations succeed even if others fail. Partial failures will be reported in the response.",
        },
        response_content_type: {
          type: "string",
          description: "Whether to return full resource or just resource name. Options: 'RESOURCE_NAME_ONLY' or 'MUTABLE_RESOURCE'.",
        },
      },
      required: [
        "operations",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "The Google Ads Query Language (GAQL) query string. Must follow SELECT ... FROM ... WHERE ... format. Example: SELECT campaign.name, campaign.id, metrics.impressions FROM campaign WHERE campaign.status = 'ENABLED'",
        },
        summary_row_setting: {
          type: "string",
          description: "Whether to include a summary row with aggregated metrics. Use 'UNSPECIFIED' for default, 'DONOT_POST' to skip summary, or 'GENERATE' to include it.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "google-ads",
      "read",
      "reporting",
    ],
  }),
];
