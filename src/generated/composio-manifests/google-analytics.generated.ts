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
    integration: "google-analytics",
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
      toolkit: "google_analytics",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleAnalyticsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "google_analytics_archive_custom_dimension",
    description: "Tool to archive a CustomDimension on a property. Use when you need to remove a custom dimension from active use without permanently deleting it. Archived dimensions cannot be used in new reports.",
    toolSlug: "GOOGLE_ANALYTICS_ARCHIVE_CUSTOM_DIMENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the CustomDimension to archive. Must be in the exact format: properties/{property_id}/customDimensions/{dimension_id} where property_id and dimension_id are numeric identifiers. IMPORTANT: Must start with 'properties/' prefix, contain '/customDimensions/' in the middle, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273/customDimensions/13661259421'. Invalid examples: '489591273/13661259421' (missing prefix), 'properties/489591273/customDimensions/13661259421/' (trailing slash), 'properties/489591273/customDimensions/13661259421/extra' (extra segments)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "custom_definitions_metrics",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive Custom Dimension.",
    ],
  }),
  composioTool({
    name: "google_analytics_batch_run_pivot_reports",
    description: "Tool to return multiple pivot reports in a batch for a GA4 property. Use when you need to fetch multiple pivot table reports with multi-dimensional analysis in a single request.",
    toolSlug: "GOOGLE_ANALYTICS_BATCH_RUN_PIVOT_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        property: {
          type: "string",
          description: "Required. The GA4 property resource name. Format: properties/{property_id}",
        },
        requests: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Required. Up to 5 individual RunPivotReportRequest objects. Each request can have dimensions, metrics, dateRanges, pivots, dimensionFilter, metricFilter, currencyCode, cohortSpec, keepEmptyRows, returnPropertyQuota, and comparisons fields. CRITICAL CONSTRAINT: Every dimension defined in 'dimensions' MUST be used in at least one of: pivots (fieldNames), dimensionFilter, or orderBys. Dimensions not used anywhere will cause a 400 error. The only exception is 'dateRange' dimensions. Additionally, all fieldNames in pivots must reference dimensions defined in the request's 'dimensions' array, and no two pivots can share the same dimension.",
        },
      },
      required: [
        "property",
        "requests",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_batch_run_reports",
    description: "Tool to return multiple analytics data reports in a batch. Use when you need to fetch multiple reports for one GA4 property in a single request.",
    toolSlug: "GOOGLE_ANALYTICS_BATCH_RUN_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        property: {
          type: "string",
          description: "Required. The property resource name. Format: properties/{property_id}",
        },
        requests: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Required. Up to 5 individual RunReportRequest objects (minimum 1, maximum 5). CRITICAL: Non-cohort requests MUST contain 'dateRanges' (list of {startDate, endDate}); cohort requests (containing 'cohortSpec') must NOT include 'dateRanges'. Key fields per request: dateRanges, dimensions (list of {name}), metrics (list of {name}), dimensionFilter/metricFilter (FilterExpression: use andGroup/orGroup/notExpression/filter at top level), cohortSpec, offset, limit, orderBys, keepEmptyRows. NOTE: Do NOT include 'pivots' field - use batchRunPivotReports action for pivot reports.",
        },
        unwrapped_filters: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal field to track which filters were unwrapped during validation",
        },
      },
      required: [
        "property",
        "requests",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_check_compatibility",
    description: "Tool to list dimensions and metrics compatible with a GA4 report request. Use when you need to validate compatibility of chosen dimensions or metrics before running a report.",
    toolSlug: "GOOGLE_ANALYTICS_CHECK_COMPATIBILITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        metrics: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The GA4 API name of the metric. MUST use exact API names from the official documentation at https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema. Common valid metric names: Users: 'activeUsers', 'totalUsers', 'newUsers'. Sessions: 'sessions', 'engagedSessions', 'bounceRate', 'engagementRate', 'averageSessionDuration'. Events: 'eventCount', 'eventCountPerUser', 'keyEvents', 'eventValue'. Page/Screen: 'screenPageViews', 'screenPageViewsPerSession'. E-commerce: 'purchaseRevenue', 'totalRevenue', 'transactions', 'itemRevenue'. Conversions: 'conversions', 'userConversionRate' (NOTE: 'conversionRate' is NOT valid - use 'sessionConversionRate' or 'userConversionRate' instead). Custom metrics use format 'customEvent:parameter_name'.",
              },
            },
            description: "Model for a metric in a compatibility check request.",
          },
          description: "Optional. List of metrics to check compatibility for. Maximum of 10 metrics allowed per request.",
        },
        property: {
          type: "string",
          description: "Required. GA4 property resource name. Format: properties/{property_id}.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The GA4 API name of the dimension. MUST use exact API names from the official documentation at https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema. Common valid dimension names include: User/Session: 'newVsReturning', 'firstSessionDate'. Time: 'date', 'dateHour', 'day', 'dayOfWeek', 'hour', 'month', 'week', 'year'. Geography: 'country', 'countryId', 'region', 'city', 'continent'. Technology: 'browser', 'operatingSystem', 'deviceCategory', 'platform', 'language', 'screenResolution'. Page/Content: 'pagePath', 'pageTitle', 'pageLocation', 'landingPage', 'hostName'. Traffic Source: 'source', 'medium', 'campaignName', 'defaultChannelGroup', 'manualSource', 'manualMedium' (NOTE: 'trafficSource' is NOT valid - use 'source' or 'medium' instead). Events: 'eventName', 'isKeyEvent'. E-commerce: 'itemId', 'itemName', 'itemBrand', 'itemCategory', 'currencyCode'. Custom dimensions use format 'customUser:parameter_name' or 'customEvent:parameter_name'.",
              },
            },
            description: "Model for a dimension in a compatibility check request.",
          },
          description: "Optional. List of dimensions to check compatibility for.",
        },
        metricFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. A FilterExpression for metrics; must follow GA4 FilterExpression JSON schema.",
        },
        dimensionFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. A FilterExpression for dimensions; must follow GA4 FilterExpression JSON schema.",
        },
        compatibilityFilter: {
          type: "string",
          description: "Compatibility status for dimensions or metrics per Google Analytics Data API v1beta.\nValid values: COMPATIBILITY_UNSPECIFIED, COMPATIBLE, INCOMPATIBLE.\nNote: Values like 'REPORT_COMPATIBLE' are NOT valid - use 'COMPATIBLE' instead.",
          enum: [
            "COMPATIBILITY_UNSPECIFIED",
            "COMPATIBLE",
            "INCOMPATIBLE",
          ],
        },
      },
      required: [
        "property",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "metadata_and_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_create_audience_export",
    description: "Tool to create an audience export for Google Analytics. Use when you need to export a snapshot of users in an audience at a specific point in time. This initiates a long-running asynchronous request that returns an operation resource name immediately. The export begins in CREATING state with rowCount=0; the operation must complete before export data is accessible for querying.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_AUDIENCE_EXPORT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Parent property resource name where the audience export will be created. Format: properties/{property_id}.",
        },
        audience: {
          type: "string",
          description: "Audience resource name identifying the audience to export. Format: properties/{property_id}/audiences/{audience_id}.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              dimensionName: {
                type: "string",
                description: "API name of the dimension. Available values: deviceId, userId, isAdsPersonalizationAllowed, isLimitedAdTracking.",
              },
            },
            description: "Model for an audience dimension.",
          },
          description: "Optional list of dimensions requested and displayed in the export. Each dimension is specified by dimensionName.",
        },
      },
      required: [
        "parent",
        "audience",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "audiences",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Audience Export.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_audience_list",
    description: "Tool to create an audience list for later retrieval by initiating a long-running asynchronous request. Use when you need to create a snapshot of users currently in an audience. The method returns quickly with an Operation resource while processing occurs in the background.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_AUDIENCE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The parent property resource name. Format: 'properties/{property_id}'. Example: 'properties/489591273'",
        },
        audience: {
          type: "string",
          description: "Required. The audience resource name identifying the audience being listed. Format: 'properties/{property_id}/audiences/{audience_id}'. Example: 'properties/489591273/audiences/11228260226'",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              dimensionName: {
                type: "string",
                description: "API name of the dimension. Common values include 'deviceId', 'userId', 'city', 'country', etc.",
              },
            },
            description: "An audience dimension is a user attribute to be included in the audience list query response.",
          },
          description: "Required. The dimensions requested and displayed in the query response. At least one dimension is required. Each entry must be an object with a `dimensionName` key (e.g., `[{'dimensionName': 'deviceId'}]`). Only dimensions supported for audience lists on that property are valid; unsupported values return a 400 INVALID_ARGUMENT error. Use GOOGLE_ANALYTICS_GET_METADATA to retrieve valid dimension names.",
        },
        webhookNotification: {
          type: "object",
          additionalProperties: true,
          properties: {
            uri: {
              type: "string",
              description: "HTTPS endpoint URL to receive POST notifications. Must have valid SSL certificate and respond with HTTP 200 within 5 seconds. Max 128 characters.",
            },
            channelToken: {
              type: "string",
              description: "Optional token (max 64 chars) sent in X-Goog-Channel-Token header to verify webhook authenticity and prevent spoofing.",
            },
          },
          description: "Webhook notification configuration for audience list operation updates.",
        },
      },
      required: [
        "parent",
        "audience",
        "dimensions",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "audiences",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Audience List.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_custom_dimension",
    description: "Tool to create a CustomDimension for a Google Analytics property. Use when you need to add a new custom dimension to track specific user properties, event parameters, or eCommerce item parameters.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_CUSTOM_DIMENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        scope: {
          type: "string",
          description: "Required. Immutable. The scope of this dimension. Must be one of: EVENT, USER, or ITEM",
          enum: [
            "DIMENSION_SCOPE_UNSPECIFIED",
            "EVENT",
            "USER",
            "ITEM",
          ],
        },
        parent: {
          type: "string",
          description: "Required. The property in which to create the CustomDimension. Format: properties/{property_id}",
        },
        description: {
          type: "string",
          description: "Optional. Description for this custom dimension. Max length of 150 characters",
        },
        displayName: {
          type: "string",
          description: "Required. Display name for this custom dimension as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter",
        },
        parameterName: {
          type: "string",
          description: "Required. Immutable. Tagging parameter name for this custom dimension. For user-scoped dimensions, this is the user property name. For event-scoped dimensions, this is the event parameter name. For item-scoped dimensions, this is the parameter name in the eCommerce items array. May only contain alphanumeric and underscore characters, starting with a letter. Max length of 24 characters for user-scoped dimensions, 40 characters for event-scoped dimensions",
        },
        disallowAdsPersonalization: {
          type: "boolean",
          description: "Optional. If set to true, sets this dimension as NPA and excludes it from ads personalization. This is currently only supported by user-scoped custom dimensions",
        },
      },
      required: [
        "parent",
        "displayName",
        "parameterName",
        "scope",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "custom_definitions_metrics",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Custom Dimension.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_custom_metric",
    description: "Tool to create a custom metric in Google Analytics. Use when you need to define a new custom metric for tracking specific event parameters.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_CUSTOM_METRIC",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        scope: {
          type: "string",
          description: "Required. Immutable. The scope of this custom metric.",
          enum: [
            "METRIC_SCOPE_UNSPECIFIED",
            "EVENT",
          ],
        },
        parent: {
          type: "string",
          description: "Required. The property where the custom metric will be created. Format: properties/{property_id}",
        },
        description: {
          type: "string",
          description: "Optional. Description for this custom metric. Max length of 150 characters.",
        },
        displayName: {
          type: "string",
          description: "Required. Display name for this custom metric as shown in the Analytics UI. Max length of 82 characters, alphanumeric plus space and underscore starting with a letter.",
        },
        parameterName: {
          type: "string",
          description: "Required. Immutable. Tagging name for this custom metric. If this is an event-scoped metric, then this is the event parameter name. May only contain alphanumeric and underscore characters, starting with a letter. Max length of 40 characters for event-scoped metrics.",
        },
        measurementUnit: {
          type: "string",
          description: "Required. The type for the custom metric's value.",
          enum: [
            "MEASUREMENT_UNIT_UNSPECIFIED",
            "STANDARD",
            "CURRENCY",
            "FEET",
            "METERS",
            "KILOMETERS",
            "MILES",
            "MILLISECONDS",
            "SECONDS",
            "MINUTES",
            "HOURS",
          ],
        },
        restrictedMetricType: {
          type: "array",
          items: {
            type: "string",
            description: "Enum for restricted metric types.",
            enum: [
              "RESTRICTED_METRIC_TYPE_UNSPECIFIED",
              "COST_DATA",
              "REVENUE_DATA",
            ],
          },
          description: "Optional. Types of restricted data that this metric may contain. Required for metrics with CURRENCY measurement unit. Must be empty for metrics with a non-CURRENCY measurement unit.",
        },
      },
      required: [
        "parent",
        "displayName",
        "parameterName",
        "measurementUnit",
        "scope",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "custom_definitions_metrics",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Custom Metric.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_expanded_data_set",
    description: "Tool to create an expanded data set for a property. Use when you need to combine specific dimensions and metrics into a custom dataset after property creation.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_EXPANDED_DATA_SET",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Parent property resource name. Format: properties/{propertyId}",
        },
        expandedDataSet: {
          type: "object",
          additionalProperties: true,
          properties: {
            description: {
              type: "string",
              description: "Optional. Description of the expanded data set.",
            },
            displayName: {
              type: "string",
              description: "Required. Human-readable display name for the expanded data set.",
            },
            metricNames: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Required. List of metric names to include in the expanded data set.",
            },
            dimensionNames: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Required. List of dimension names to include in the expanded data set.",
            },
          },
          description: "Definition of the ExpandedDataSet to create.",
        },
      },
      required: [
        "parent",
        "expandedDataSet",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Expanded Data Set.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_recurring_audience_list",
    description: "Tool to create a recurring audience list that automatically generates new audience lists daily based on the latest data. Use when you need to automate audience list creation and reduce quota token consumption.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_RECURRING_AUDIENCE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Parent property resource name where the recurring audience list will be created. Format: properties/{property_id}.",
        },
        audience: {
          type: "string",
          description: "Audience resource name identifying the audience being listed. Format: properties/{property_id}/audiences/{audience_id}.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              dimensionName: {
                type: "string",
                description: "API name of the dimension (e.g., deviceId, userId, isAdsPersonalizationAllowed).",
              },
            },
            description: "Model for an audience dimension.",
          },
          description: "List of dimensions requested and displayed in the audience list response.",
        },
        activeDaysRemaining: {
          type: "integer",
          description: "Counter decreasing daily. Defaults to 180 days for Analytics 360 properties (max 365) and 14 days for standard properties (max 30).",
        },
        webhookNotification: {
          type: "object",
          additionalProperties: true,
          properties: {
            uri: {
              type: "string",
              description: "HTTPS endpoint URL to receive POST notifications. Must have valid SSL certificate and reply with HTTP 200 within 5 seconds. Max length: 128 characters.",
            },
            channelToken: {
              type: "string",
              description: "Optional token for source verification, included in X-Goog-Channel-Token header. Max length: 64 characters.",
            },
          },
          description: "Configuration for receiving webhook notifications about recurring audience list status.",
        },
      },
      required: [
        "parent",
        "audience",
        "dimensions",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "audiences",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Recurring Audience List.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_report_task",
    description: "Tool to create a report task as a long-running asynchronous request for customized Google Analytics event data reports. Use when you need to generate large or complex reports that process asynchronously.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_REPORT_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Property identifier in format 'properties/{propertyId}'. The Google Analytics property for which to create the report task.",
        },
        reportDefinition: {
          type: "object",
          additionalProperties: true,
          properties: {
            limit: {
              type: "string",
              description: "Max rows to return (default 10000, max 250000).",
            },
            offset: {
              type: "string",
              description: "Row offset for pagination.",
            },
            metrics: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the metric.",
                  },
                  invisible: {
                    type: "boolean",
                    description: "Whether the metric is invisible in the report.",
                  },
                  expression: {
                    type: "string",
                    description: "Expression for the metric calculation.",
                  },
                },
                description: "Represents a metric in the report definition.",
              },
              description: "Report metrics with name, expression, and invisible flag.",
            },
            orderBys: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  desc: {
                    type: "boolean",
                    description: "Whether to sort in descending order (default: false for ascending).",
                  },
                  pivot: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      metricName: {
                        type: "string",
                        description: "Metric name from the request to order by (e.g., 'sessions').",
                      },
                      pivotSelections: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            dimensionName: {
                              type: "string",
                              description: "Dimension name from the request (e.g., 'browser').",
                            },
                            dimensionValue: {
                              type: "string",
                              description: "Order by only when the named dimension is this value (e.g., 'Chrome').",
                            },
                          },
                          description: "A dimension name and value pair for selecting rows in pivot ordering.",
                        },
                        description: "Dimension name-value pairs identifying the pivot group. Sorting applies to rows matching all pairs.",
                      },
                    },
                    description: "Arranges results by metric values within a pivot column group.",
                  },
                  metric: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      metricName: {
                        type: "string",
                        description: "Metric name from the request to order by (e.g., 'screenPageViews').",
                      },
                    },
                    description: "Arranges results by metric values.",
                  },
                  dimension: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      orderType: {
                        type: "string",
                        description: "Controls dimension value ordering rule.",
                        enum: [
                          "ORDER_TYPE_UNSPECIFIED",
                          "ALPHANUMERIC",
                          "CASE_INSENSITIVE_ALPHANUMERIC",
                          "NUMERIC",
                        ],
                      },
                      dimensionName: {
                        type: "string",
                        description: "Dimension name from the request to order by (e.g., 'pagePath').",
                      },
                    },
                    description: "Arranges results by dimension values.",
                  },
                },
                description: "Sort specification for report results. Must specify exactly one of: metric, dimension, or pivot.",
              },
              description: "Sort specifications with desc, metric, or dimension ordering.",
            },
            cohortSpec: {
              type: "object",
              additionalProperties: true,
              description: "Cohort analysis configuration.",
            },
            dateRanges: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Optional name for this date range.",
                  },
                  endDate: {
                    type: "string",
                    description: "End date in YYYY-MM-DD format.",
                  },
                  startDate: {
                    type: "string",
                    description: "Start date in YYYY-MM-DD format.",
                  },
                },
                description: "Represents a date range for the report.",
              },
              description: "Date ranges (max 4) with startDate, endDate (YYYY-MM-DD), and optional name.",
            },
            dimensions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the dimension.",
                  },
                  dimensionExpression: {
                    type: "object",
                    additionalProperties: true,
                    description: "Dimension expression for custom dimensions.",
                  },
                },
                description: "Represents a dimension in the report definition.",
              },
              description: "Report dimensions with name and optional dimensionExpression.",
            },
            currencyCode: {
              type: "string",
              description: "ISO 4217 currency code.",
            },
            metricFilter: {
              type: "object",
              additionalProperties: true,
              description: "Metric filters.",
            },
            keepEmptyRows: {
              type: "boolean",
              description: "Include empty rows flag.",
            },
            samplingLevel: {
              type: "string",
              description: "Sample size (LOW, MEDIUM, UNSAMPLED).",
            },
            dimensionFilter: {
              type: "object",
              additionalProperties: true,
              description: "Dimension filters (andGroup, orGroup, notExpression, or filter).",
            },
            metricAggregations: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Aggregations (TOTAL, MINIMUM, MAXIMUM, COUNT).",
            },
          },
          description: "Defines how the report executes.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "reporting",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Report Task.",
    ],
  }),
  composioTool({
    name: "google_analytics_create_rollup_property",
    description: "Tool to create a roll-up property. Use when consolidating multiple GA4 properties into one aggregated view.",
    toolSlug: "GOOGLE_ANALYTICS_CREATE_ROLLUP_PROPERTY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account: {
          type: "string",
          description: "Required. Parent account resource. Format: accounts/{account_id}",
        },
        timeZone: {
          type: "string",
          description: "Required. IANA time zone for the roll-up property.",
        },
        displayName: {
          type: "string",
          description: "Required. Display name for the roll-up property.",
        },
        sourceProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional. List of source property resource names to link. Format: properties/{property_id}.",
        },
      },
      required: [
        "account",
        "displayName",
        "timeZone",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "rollup_property_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Rollup Property.",
    ],
  }),
  composioTool({
    name: "google_analytics_get_account",
    description: "Tool to retrieve a single Account by its resource name. Use when you need detailed account info after confirming the account resource name (e.g., accounts/100).",
    toolSlug: "GOOGLE_ANALYTICS_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the Account to retrieve. Must be in the exact format: accounts/{account_id} where account_id is a numeric identifier. IMPORTANT: Must start with 'accounts/' prefix, contain no forward slashes in the account_id, have no trailing slashes, and no additional path segments. Valid example: 'accounts/100'. Invalid examples: '100' (missing prefix), 'accounts/100/' (trailing slash), 'accounts/100/extra' (extra segments)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
    ],
  }),
  composioTool({
    name: "google_analytics_get_attribution_settings",
    description: "Tool to retrieve attribution configuration for a Google Analytics property. Use when you need to check attribution models, lookback windows, and conversion export settings.",
    toolSlug: "GOOGLE_ANALYTICS_GET_ATTRIBUTION_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the attribution settings to retrieve. Must be in the exact format: properties/{property_id}/attributionSettings where property_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property_id, have no trailing slashes, and must end with '/attributionSettings'. Valid example: 'properties/489591273/attributionSettings'. Invalid examples: '489591273' (missing prefix), 'properties/489591273' (missing suffix), 'properties/489591273/attributionSettings/' (trailing slash)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "attribution_skan",
    ],
  }),
  composioTool({
    name: "google_analytics_get_audience",
    description: "Tool to retrieve a single Audience configuration from a Google Analytics property. Use when you need detailed audience information including membership criteria and filter clauses.",
    toolSlug: "GOOGLE_ANALYTICS_GET_AUDIENCE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        audienceId: {
          type: "string",
          description: "Required. The audience identifier to retrieve. Provide the numeric audience ID (e.g., '11228260226').",
        },
        propertyId: {
          type: "string",
          description: "Required. The Google Analytics property identifier. Can be provided as just the numeric ID (e.g., '123456789') or as full resource name (e.g., 'properties/123456789').",
        },
      },
      required: [
        "propertyId",
        "audienceId",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_get_audience_export",
    description: "Tool to get configuration metadata about a specific audience export. Use when you need to understand an audience export after it has been created or check its status.",
    toolSlug: "GOOGLE_ANALYTICS_GET_AUDIENCE_EXPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The audience export resource name. Format: properties/{property}/audienceExports/{audience_export}. Example: properties/489591273/audienceExports/19298228",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_get_audience_list",
    description: "Tool to get configuration metadata about a specific audience list. Use after confirming the audience list resource name.",
    toolSlug: "GOOGLE_ANALYTICS_GET_AUDIENCE_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the Audience List to retrieve. Format: properties/{property}/audienceLists/{audienceList}.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audience_management",
    ],
  }),
  composioTool({
    name: "google_analytics_get_custom_dimension",
    description: "Tool to retrieve a single CustomDimension by its resource name. Use when you need detailed information about a specific custom dimension including its display name, scope, and parameter name.",
    toolSlug: "GOOGLE_ANALYTICS_GET_CUSTOM_DIMENSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the CustomDimension to retrieve. Must be in the exact format: properties/{property_id}/customDimensions/{customDimension_id} where both property_id and customDimension_id are numeric identifiers. IMPORTANT: Must start with 'properties/' prefix, contain exactly one '/customDimensions/' segment, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273/customDimensions/13661238280'. Invalid examples: '489591273/13661238280' (missing prefix), 'properties/489591273/customDimensions/13661238280/' (trailing slash), 'properties/489591273/customDimensions/13661238280/extra' (extra segments)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "custom_definitions_metrics",
    ],
  }),
  composioTool({
    name: "google_analytics_get_data_retention_settings",
    description: "Tool to retrieve data retention configuration for a Google Analytics property. Use when you need to check event-level and user-level data retention durations and reset settings.",
    toolSlug: "GOOGLE_ANALYTICS_GET_DATA_RETENTION_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the data retention settings to retrieve. Must be in the exact format: properties/{property_id}/dataRetentionSettings where property_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property_id, have no trailing slashes, and must end with '/dataRetentionSettings'. Valid example: 'properties/489591273/dataRetentionSettings'. Invalid examples: '489591273' (missing prefix), 'properties/489591273' (missing suffix), 'properties/489591273/dataRetentionSettings/' (trailing slash)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "property_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_get_data_sharing_settings",
    description: "Tool to retrieve data sharing configuration for a Google Analytics account. Use when you need to check which data sharing settings are enabled for an account, including sharing with Google support, sales teams, products, and benchmarking.",
    toolSlug: "GOOGLE_ANALYTICS_GET_DATA_SHARING_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the data sharing settings to retrieve. Must be in the exact format: accounts/{account_id}/dataSharingSettings where account_id is a numeric identifier. IMPORTANT: Must start with 'accounts/' prefix, contain no forward slashes in the account_id, have no trailing slashes, and must end with '/dataSharingSettings'. Valid example: 'accounts/1000/dataSharingSettings'. Invalid examples: '1000' (missing prefix), 'accounts/1000' (missing suffix), 'accounts/1000/dataSharingSettings/' (trailing slash)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "account_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_get_google_signals_settings",
    description: "Tool to retrieve Google Signals configuration settings for a GA4 property. Use when you need to check whether Google Signals is enabled and the consent status for a property.",
    toolSlug: "GOOGLE_ANALYTICS_GET_GOOGLE_SIGNALS_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the Google Signals settings to retrieve. Must be in the exact format: properties/{property_id}/googleSignalsSettings where property_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property_id, have no trailing slashes, and must end with '/googleSignalsSettings'. Valid example: 'properties/1000/googleSignalsSettings'. Invalid examples: '1000' (missing prefix), 'properties/1000' (missing suffix), 'properties/1000/googleSignalsSettings/' (trailing slash)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "property_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_get_key_event",
    description: "Tool to retrieve a Key Event. Use after confirming the key event resource name. Read-only; create, update, or delete operations require the Google Analytics UI.",
    toolSlug: "GOOGLE_ANALYTICS_GET_KEY_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. Resource name of the Key Event to retrieve. Format: properties/{property}/keyEvents/{keyEvent}.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "event_management",
    ],
  }),
  composioTool({
    name: "google_analytics_get_metadata",
    description: "Tool to get metadata for dimensions, metrics, and comparisons for a GA4 property. Use to discover available fields before building a report — always derive dimension/metric apiNames from this output rather than hardcoding from GA4 UI labels, which differ. Available fields vary per property; skip validation and downstream report tools like GOOGLE_ANALYTICS_RUN_REPORT return 400 INVALID_ARGUMENT on incompatible or invalid field combinations. Response can contain hundreds of fields; filter to relevant subset before passing to downstream logic.",
    toolSlug: "GOOGLE_ANALYTICS_GET_METADATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Resource name of the metadata to retrieve. Format: properties/{property_id}/metadata. Use property_id=0 to return only universal (non-custom) metadata.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "metadata_and_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_get_property",
    description: "Tool to retrieve a single GA4 Property by its resource name. Use when you need detailed property configuration including display name, time zone, currency, and other settings.",
    toolSlug: "GOOGLE_ANALYTICS_GET_PROPERTY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the Property to retrieve. Must be in the exact format: properties/{property_id} where property_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property_id, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273'. Invalid examples: '489591273' (missing prefix), 'properties/489591273/' (trailing slash), 'properties/489591273/extra' (extra segments)",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "property_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_get_property_quotas_snapshot",
    description: "Tool to retrieve all property quotas organized by category (corePropertyQuota, funnelPropertyQuota, realtimePropertyQuota) for a given GA4 property. Use when you need to check current quota usage. Snapshot data can lag real consumption by several minutes; treat reported values as approximate and avoid scheduling high-volume jobs at full apparent capacity.",
    toolSlug: "GOOGLE_ANALYTICS_GET_PROPERTY_QUOTAS_SNAPSHOT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        property: {
          type: "string",
          description: "Required. The property resource. Format: properties/{property_id}.",
        },
      },
      required: [
        "property",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "metadata_and_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_get_recurring_audience_list",
    description: "Tool to get configuration metadata about a specific recurring audience list. Use when you need to understand a recurring audience list's state after it has been created or to get the resource name of the most recent audience list instance.",
    toolSlug: "GOOGLE_ANALYTICS_GET_RECURRING_AUDIENCE_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The recurring audience list resource name. Format: properties/{property}/recurringAudienceLists/{recurring_audience_list}",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_get_report_task",
    description: "Tool to get report metadata about a specific report task. Use after creating a report task to check its processing state or inspect its report definition.",
    toolSlug: "GOOGLE_ANALYTICS_GET_REPORT_TASK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The report task resource name. Format: properties/{property}/reportTasks/{reportTask}",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_list_account_summaries",
    description: "Tool to retrieve summaries of all Google Analytics accounts accessible by the caller. Use when you need a high-level overview of accounts and their properties without fetching full account details.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_ACCOUNT_SUMMARIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        pageSize: {
          type: "integer",
          description: "Maximum number of account summaries to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. Maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Page token received from a previous ListAccountSummaries call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListAccountSummaries must match the call that provided the page token.",
        },
      },
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "account_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_list_accounts_v1_beta",
    description: "Tool to list all Google Analytics accounts accessible by the caller using v1beta API. Use when you need to enumerate accounts. Note that these accounts might not have GA properties yet. Soft-deleted accounts are excluded by default.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_ACCOUNTS_V1_BETA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        pageSize: {
          type: "integer",
          description: "The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "A page token, received from a previous `ListAccounts` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAccounts` must match the call that provided the page token.",
        },
        showDeleted: {
          type: "boolean",
          description: "Whether to include soft-deleted (ie: 'trashed') Accounts in the results. Accounts can be inspected to determine whether they are deleted or not. Defaults to false (soft-deleted accounts are excluded).",
        },
      },
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "account_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_list_adsense_links",
    description: "Tool to list all AdSenseLinks on a property. Use when you need to fetch all AdSense links for a given Google Analytics property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_ADSENSE_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the property. Format: properties/{propertyId} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of results to return. Must be between 1 and 200. Defaults to 50.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token for retrieving the next page of results.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_audience_exports",
    description: "Tool to list all audience exports for a property. Use when you need to find and reuse existing audience exports rather than creating new ones.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_AUDIENCE_EXPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/489591273'",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of audience exports to return. Default: 200, Maximum: 1000",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token from a previous response for pagination to retrieve the next page of results",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_list_audience_lists",
    description: "Tool to list all audience lists for a specified property to help find and reuse existing lists. Use when you need to retrieve a property's configured audience lists after confirming the property ID.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_AUDIENCE_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the parent property. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of audience lists to return. Defaults to 200; maximum is 1000.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token for retrieving the next page of results. All other parameters must match original request.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audience_management",
    ],
  }),
  composioTool({
    name: "google_analytics_list_audiences",
    description: "Tool to list Audiences on a property. Use when you need to retrieve audience configurations for a Google Analytics property. Audiences created before 2020 may not be supported.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_AUDIENCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property for which to list Audiences. Format: properties/{propertyId} Scoped to a single property per call; invoke separately for each property to list audiences across multiple GA4 properties.",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListAudiences call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_list_bigquery_links",
    description: "Tool to list BigQuery Links on a property. Use when you need to retrieve BigQuery link resources associated with a Google Analytics property. Results support pagination for large datasets.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_BIGQUERY_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The name of the property to list BigQuery links under. Format: properties/{property_id} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListBigQueryLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListBigQueryLinks must match the call that provided the page token.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_calculated_metrics",
    description: "List Calculated Metrics",
    toolSlug: "GOOGLE_ANALYTICS_LIST_CALCULATED_METRICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/1234'",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of results to return per request. Default: 50, Maximum: 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token from a previous response for pagination to retrieve the next page of results",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "custom_definitions_metrics",
    ],
  }),
  composioTool({
    name: "google_analytics_list_channel_groups",
    description: "Tool to list ChannelGroups on a property. Use when you need to retrieve channel groups that categorize traffic sources in Analytics reports.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_CHANNEL_GROUPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property for which to list ChannelGroups. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListChannelGroups call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_list_conversion_events",
    description: "Tool to list conversion events on a property. Use when you need to retrieve conversion events configured for a given property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_CONVERSION_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The resource name of the parent property. Format: 'properties/{propertyId}'",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListConversionEvents call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "events_conversions",
    ],
  }),
  composioTool({
    name: "google_analytics_list_custom_dimensions",
    description: "List Custom Dimensions",
    toolSlug: "GOOGLE_ANALYTICS_LIST_CUSTOM_DIMENSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property for which to list CustomDimensions. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListCustomDimensions call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "custom_definitions_metrics",
    ],
  }),
  composioTool({
    name: "google_analytics_list_custom_metrics",
    description: "Tool to list CustomMetrics on a property. Use when you need to retrieve all custom metrics configured for a given property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_CUSTOM_METRICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Property identifier in format 'properties/{propertyId}'. Example: 'properties/1234'",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. Maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token from a previous ListCustomMetrics call for pagination to retrieve the next page of results",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "custom_definitions_metrics",
    ],
  }),
  composioTool({
    name: "google_analytics_list_data_streams",
    description: "Tool to list DataStreams on a property. Use when you need to retrieve data stream configurations for a Google Analytics property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_DATA_STREAMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The Google Analytics property identifier. Must be in format 'properties/NUMERIC_ID' where NUMERIC_ID is your actual property ID (e.g., 'properties/489591273'). Do NOT use placeholder syntax like 'properties/{propertyId}' - replace the placeholder with a real numeric property ID.",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListDataStreams call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "data_streams_ingestion",
    ],
  }),
  composioTool({
    name: "google_analytics_list_dv360_ad_links",
    description: "Tool to list Display & Video 360 advertiser links on a property. Use when you need to retrieve DisplayVideo360AdvertiserLink resources associated with a Google Analytics property. Results support pagination for large datasets.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_DV360_AD_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The name of the property to list DisplayVideo360AdvertiserLinks under. Format: properties/{property_id} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. The service may return fewer than this value. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListDisplayVideo360AdvertiserLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided must match the call that provided the page token.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_dv360_link_proposals",
    description: "Tool to list DisplayVideo360AdvertiserLinkProposals on a property. Use when you need to retrieve Display & Video 360 advertiser link proposals associated with a Google Analytics property. Results support pagination for large datasets.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_DV360_LINK_PROPOSALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The name of the property to list DisplayVideo360AdvertiserLinkProposals under. Format: properties/{property_id} (e.g., properties/489591273).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListDisplayVideo360AdvertiserLinkProposals call. Provide this to retrieve the subsequent page. When paginating, all other parameters must match the call that provided the page token.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_event_create_rules",
    description: "Tool to list EventCreateRules configured on a web data stream. Use when you need to retrieve event create rules for a specific GA4 property data stream.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_EVENT_CREATE_RULES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the parent data stream. Format: properties/{propertyId}/dataStreams/{dataStreamId}.",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of event create rules to return. Default is 50, maximum allowed is 200.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous list call. Provide this to retrieve the next page of results.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "events_conversions",
    ],
  }),
  composioTool({
    name: "google_analytics_list_expanded_data_sets",
    description: "Tool to list ExpandedDataSets on a property. Use when you need to retrieve expanded data set configurations for a Google Analytics 360 property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_EXPANDED_DATA_SETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The name of the property to list ExpandedDataSets for. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListExpandedDataSets call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_list_firebase_links",
    description: "Tool to list FirebaseLinks on a property. Use when you need to retrieve Firebase connections associated with a Google Analytics property. Each property can have at most one FirebaseLink.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_FIREBASE_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property for which to list FirebaseLinks. Format: properties/{property_id} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. The service may return fewer than this value, even if there are additional pages. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListFirebaseLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to ListFirebaseLinks must match the call that provided the page token.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_google_ads_links",
    description: "Tool to list GoogleAdsLinks on a property. Use when you need to retrieve Google Ads account links configured for a Google Analytics property. Supports pagination for large result sets.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_GOOGLE_ADS_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property resource name. Format: properties/{propertyId} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. If unspecified, at most 50 resources will be returned. The maximum value is 200; higher values will be coerced to the maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListGoogleAdsLinks call. Provide this to retrieve the subsequent page. When paginating, all other parameters must match the call that provided the page token.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_key_events",
    description: "Tool to list Key Events. Use when you need to retrieve all key event definitions for a given property. Key events are read-only via API; creation, updates, and deletion require the Google Analytics UI. An empty results list means no key events are configured, not a failure. Do not infer key-event status from report data (e.g., eventCount); use this tool to confirm.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_KEY_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the parent property. Format: properties/{property_id}.",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of results to return. Must be between 1 and 200. If not specified or 0, the API uses its default page size.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token for retrieving the next page of results.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "event_management",
    ],
  }),
  composioTool({
    name: "google_analytics_list_measurement_protocol_secrets",
    description: "Tool to list MeasurementProtocolSecrets under a data stream. Use when you need to retrieve measurement protocol secrets for server-side event tracking.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_MEASUREMENT_PROTOCOL_SECRETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The resource name of the parent data stream. Format: properties/{property}/dataStreams/{dataStream}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. If unspecified, at most 10 resources will be returned. The maximum value is 10",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListMeasurementProtocolSecrets call. Provide this to retrieve the subsequent page",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "data_streams_ingestion",
    ],
  }),
  composioTool({
    name: "google_analytics_list_properties_filtered",
    description: "Tool to list GA4 properties based on filter criteria. Use when you need to find properties under a specific parent account or with specific firebase projects. Supports pagination and including soft-deleted properties.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_PROPERTIES_FILTERED",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "Required. Expression for filtering the results. Fields eligible for filtering: `parent:` (resource name of parent account/property), `ancestor:` (resource name of parent account), or `firebase_project:` (id or number of linked firebase project). Examples: 'parent:accounts/123' (account with id 123), 'parent:properties/123' (property with id 123), 'ancestor:accounts/123' (account with id 123), 'firebase_project:project-id' (firebase project with id project-id), 'firebase_project:123' (firebase project with number 123).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of properties to return (1-200). Default is 50.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token from previous ListProperties call to retrieve the next page.",
        },
        showDeleted: {
          type: "boolean",
          description: "Optional. Whether to include soft-deleted (trashed) properties. Default is false.",
        },
      },
      required: [
        "filter",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "properties_and_configuration",
    ],
  }),
  composioTool({
    name: "google_analytics_list_recurring_audience_lists",
    description: "Tool to list all recurring audience lists for a GA4 property. Use when you need to find and reuse existing recurring audience lists.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_RECURRING_AUDIENCE_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the parent property. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of recurring audience lists to return. Defaults to 200; maximum is 1000.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token for retrieving the next page of results.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audiences",
    ],
  }),
  composioTool({
    name: "google_analytics_list_report_tasks",
    description: "Tool to list all report tasks for a Google Analytics property. Use when you need to retrieve report task definitions and their execution status.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_REPORT_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Property identifier in format 'properties/{propertyId}'. The Google Analytics property whose report tasks should be listed.",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of report tasks to return per page. If unspecified, server determines page size.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Pagination token from previous list response for retrieving next page of results. Omit for first page.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_list_reporting_data_annotations",
    description: "Tool to list all Reporting Data Annotations for a specific property. Use when you need to retrieve annotations that document important events or periods in GA4 reporting data.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_REPORTING_DATA_ANNOTATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "Optional. Expression to refine results. Supported fields: name, title, description, annotationDate, annotationDateRange, color. Helper functions: annotation_duration(), is_annotation_in_range(). Operators: =, !=, <, >, <=, >=, :, =~, !~, NOT, AND, OR.",
        },
        parent: {
          type: "string",
          description: "Required. Resource name of the property. Format: properties/{property_id}. Example: properties/123456789",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources per response. Default: 50, Max: 200.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Pagination token from previous response to retrieve next page.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_list_search_ads360_links",
    description: "Tool to list all SearchAds360Links on a property. Use when you need to retrieve all Search Ads 360 links for a given Google Analytics property. Supports pagination for large result sets.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_SEARCH_ADS360_LINKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The property resource name. Format: properties/{propertyId} (e.g., properties/1234).",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return. Default is 50, maximum is 200. Values exceeding 200 are capped at maximum.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous list call. Use this to retrieve the next page. All other parameters must match the original request.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "integrations_links",
    ],
  }),
  composioTool({
    name: "google_analytics_list_sk_ad_network_conversion_value_schemas",
    description: "Tool to list SKAdNetworkConversionValueSchema configurations for an iOS data stream. Use when you need to retrieve conversion value schemas for iOS app tracking. Maximum one schema per property is supported.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_SK_AD_NETWORK_CONVERSION_VALUE_SCHEMAS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. The DataStream resource to list schemas for. Format: properties/{property_id}/dataStreams/{dataStream}. Example: 'properties/123456789/dataStreams/1234567890'",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources per response. Default: 50, Maximum: 200.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Token from previous call for pagination to retrieve next page of results.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "attribution_skan",
    ],
  }),
  composioTool({
    name: "google_analytics_list_subproperty_event_filters",
    description: "Tool to list all subproperty event filters on a property. Use when you need to retrieve event filters that route events to subproperties.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_SUBPROPERTY_EVENT_FILTERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the ordinary property. Format: properties/{property_id}",
        },
        pageSize: {
          type: "integer",
          description: "Optional. Maximum number of resources to return; at most 50 by default, maximum 200.",
        },
        pageToken: {
          type: "string",
          description: "Optional. Page token received from a previous call to retrieve the next page.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "property_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_list_subproperty_sync_configs",
    description: "Tool to list SubpropertySyncConfig resources for managing subproperty synchronization configurations. Use when you need to fetch subproperty sync configs for a GA4 property.",
    toolSlug: "GOOGLE_ANALYTICS_LIST_SUBPROPERTY_SYNC_CONFIGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Required. Resource name of the property. Format: properties/{property_id}. Example: properties/123",
        },
        pageSize: {
          type: "integer",
          description: "Optional. The maximum number of resources to return. May return fewer. If unspecified, at most 50 resources will be returned. Maximum value is 200.",
        },
        pageToken: {
          type: "string",
          description: "Optional. A page token received from a previous ListSubpropertySyncConfig call. Provide this to retrieve the subsequent page.",
        },
      },
      required: [
        "parent",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "property_settings",
    ],
  }),
  composioTool({
    name: "google_analytics_provision_account_ticket",
    description: "Tool to request a ticket for creating a Google Analytics account. Use when you need to initiate the account creation flow that requires user acceptance of Terms of Service.",
    toolSlug: "GOOGLE_ANALYTICS_PROVISION_ACCOUNT_TICKET",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account: {
          type: "object",
          additionalProperties: true,
          properties: {
            regionCode: {
              type: "string",
              description: "Required. Country of business. Must be a valid Unicode CLDR region code (e.g., 'US', 'GB', 'CA').",
            },
            displayName: {
              type: "string",
              description: "Required. Human-readable display name for the account to be created.",
            },
          },
          description: "Required. Account details including display name and region code.",
        },
        redirectUri: {
          type: "string",
          description: "Required. Redirect URI where the user will be sent after accepting Terms of Service. Must be configured in Cloud Console as a Redirect URI.",
        },
      },
      required: [
        "account",
        "redirectUri",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "account_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Provision Account Ticket.",
    ],
  }),
  composioTool({
    name: "google_analytics_query_audience_export",
    description: "Tool to query a completed audience export. Use when you need to fetch user rows with pagination.",
    toolSlug: "GOOGLE_ANALYTICS_QUERY_AUDIENCE_EXPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. Resource name of the audience export. Format: properties/{property}/audienceExports/{audienceExport}, where {property} and {audienceExport} must be integers.",
        },
        limit: {
          type: "integer",
          description: "Optional. Number of rows to return. Must be between 1 and 250000. Defaults to 10000.",
        },
        offset: {
          type: "integer",
          description: "Optional. Zero-based start row index for pagination. Defaults to 0.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audience_management",
    ],
  }),
  composioTool({
    name: "google_analytics_query_audience_list",
    description: "Tool to query an audience list. Use when you need to retrieve user rows from a GA4 audience list with pagination.",
    toolSlug: "GOOGLE_ANALYTICS_QUERY_AUDIENCE_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. Audience list resource to query. Format: properties/{property}/audienceLists/{audienceList}.",
        },
        limit: {
          type: "integer",
          description: "Optional. Number of rows to return; default 10,000; maximum 250,000.",
        },
        offset: {
          type: "integer",
          description: "Optional. Zero-based row offset for pagination.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "audience_management",
    ],
  }),
  composioTool({
    name: "google_analytics_query_report_task",
    description: "Tool to retrieve a report task's content. Use this after creating a report task with CreateReportTask and confirming it is in ACTIVE state. This method returns an error if the report task's state is not ACTIVE.",
    toolSlug: "GOOGLE_ANALYTICS_QUERY_REPORT_TASK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. Report task name in format 'properties/{propertyId}/reportTasks/{reportTaskId}'. The report task must be in ACTIVE state.",
        },
        limit: {
          type: "integer",
          description: "Optional. Number of rows to return (max 250,000). If unspecified, 10,000 rows are returned. Must be positive. Limited by the ReportTask's own limit.",
        },
        offset: {
          type: "integer",
          description: "Optional. Row offset for pagination (0-indexed). First request omits offset or sets to 0. For subsequent pages, set to the previous limit value.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_run_funnel_report",
    description: "Tool to run a GA4 funnel report. Use when you need a customized funnel analysis report for a given property. Funnel step sequence is determined by step attributes in the response, not row order.",
    toolSlug: "GOOGLE_ANALYTICS_RUN_FUNNEL_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of rows to return. Default 10000; max 250000.",
        },
        funnel: {
          type: "object",
          additionalProperties: true,
          description: "Funnel configuration object. Must include a 'steps' key with at least one step. Each step requires a 'name' and optionally a 'filterExpression'. Use 'funnelEventFilter' for event filters and 'funnelFieldFilter' for field filters. Filter expressions with 'fieldName' + 'stringFilter' are auto-wrapped in 'funnelFieldFilter'. Example: {\"steps\": [{\"name\": \"First visit\", \"filterExpression\": {\"funnelEventFilter\": {\"eventName\": \"first_visit\"}}}]}",
        },
        property: {
          type: "string",
          description: "GA4 property resource name, format: properties/{property_id}.",
        },
        segments: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Up to 4 segments; each yields its own row in the report.",
        },
        dateRanges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Optional user-defined name for this date range.",
              },
              endDate: {
                type: "string",
                description: "End date of the report range. Format YYYY-MM-DD or relative (e.g., 'today', '1daysAgo').",
              },
              startDate: {
                type: "string",
                description: "Start date of the report range. Format YYYY-MM-DD or relative (e.g., '7daysAgo', 'today').",
              },
            },
          },
          description: "List of date ranges to read; overlapping ranges duplicate days across ranges.",
        },
        dimensionFilter: {
          type: "object",
          additionalProperties: true,
          description: "Dimension-only filter expression.",
        },
        funnelBreakdown: {
          type: "object",
          additionalProperties: true,
          description: "Breakdown dimension configuration for the funnel table sub-report.",
        },
        funnelNextAction: {
          type: "object",
          additionalProperties: true,
          description: "Next-action dimension configuration for the funnel visualization sub-report.",
        },
        returnPropertyQuota: {
          type: "boolean",
          description: "If true, includes the property's current quota state.",
        },
        funnelVisualizationType: {
          type: "string",
          description: "Visualization type: STANDARD_FUNNEL (default) or TRENDED_FUNNEL.",
          enum: [
            "STANDARD_FUNNEL",
            "TRENDED_FUNNEL",
          ],
        },
      },
      required: [
        "property",
        "funnel",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_run_pivot_report",
    description: "Tool to run a customized pivot report of Google Analytics event data. Use when you need a pivot table view with advanced segmentation and multi-dimensional analysis of GA4 data.",
    toolSlug: "GOOGLE_ANALYTICS_RUN_PIVOT_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        pivots: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. Visual format configuration for dimensions. Each pivot has 'fieldNames' (required string array), 'limit' (required), optional 'orderBys', 'offset', and 'metricAggregations'.",
        },
        metrics: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Required. At least one metric is required. Each metric has a 'name' field, optional 'expression', and optional 'invisible' boolean.",
        },
        property: {
          type: "string",
          description: "Required. The GA4 property resource name. Format: properties/{property_id}",
        },
        cohortSpec: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Cohort configuration with 'cohorts' (required), optional 'cohortsRange' and 'cohortReportSettings'.",
        },
        dateRanges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. Date ranges for event data retrieval. Each range has 'startDate' and 'endDate' (YYYY-MM-DD format or relative like 'NdaysAgo', 'yesterday', 'today'), and optional 'name'.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. Dimensions to request. Each dimension has a 'name' field and optional 'dimensionExpression'. Dimensions must be used in pivots, filters, or orderBys.",
        },
        comparisons: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. Comparison configurations. Each comparison has optional 'name' and required 'dimensionFilter' or 'comparison'.",
        },
        currencyCode: {
          type: "string",
          description: "Optional. ISO4217 currency code (e.g., 'USD', 'EUR').",
        },
        metricFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Post-aggregation filter (SQL HAVING clause equivalent).",
        },
        keepEmptyRows: {
          type: "boolean",
          description: "Optional. If true, includes rows where all metrics equal 0.",
        },
        dimensionFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Filter clause for dimensions only. Can use andGroup, orGroup, notExpression, or filter.",
        },
        returnPropertyQuota: {
          type: "boolean",
          description: "Optional. If true, returns current quota state in PropertyQuota.",
        },
      },
      required: [
        "property",
        "metrics",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_run_realtime_report",
    description: "Tool to run a customized realtime report of Google Analytics event data. Use when you need realtime data (last 30-60 minutes) with dimensions and metrics for a GA4 property.",
    toolSlug: "GOOGLE_ANALYTICS_RUN_REALTIME_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Max rows to return (default 10000, max 250000).",
        },
        metrics: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The metric name. Valid realtime metrics: activeUsers, eventCount, keyEvents, screenPageViews.",
              },
              invisible: {
                type: "boolean",
                description: "If true, the metric is excluded from the response but can be used in filters/ordering.",
              },
              expression: {
                type: "string",
                description: "Optional mathematical expression for a derived metric.",
              },
            },
            description: "Metric configuration for realtime reports.",
          },
          description: "Metrics to measure (max 10). At least one dimension or metric is required. Valid names: activeUsers, eventCount, keyEvents, screenPageViews.",
        },
        orderBys: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Sorting specification. Example: [{'metric': {'metricName': 'activeUsers'}, 'desc': true}] or [{'dimension': {'dimensionName': 'country'}}].",
        },
        property: {
          type: "string",
          description: "Required. The GA4 property resource name. Format: properties/{property_id}. Get property IDs from GOOGLE_ANALYTICS_LIST_PROPERTIES.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The dimension name. Valid realtime dimensions: appVersion, audienceId, audienceName, audienceResourceName, city, cityId, country, countryId, deviceCategory, eventName, minutesAgo, platform, streamId, streamName, unifiedScreenName. Custom dimensions use 'customUser:parameter_name'.",
              },
            },
            description: "Dimension configuration for realtime reports.",
          },
          description: "Dimensions to group by (max 9). At least one dimension or metric is required. Valid names: appVersion, audienceId, audienceName, city, cityId, country, countryId, deviceCategory, eventName, minutesAgo, platform, streamId, streamName, unifiedScreenName. Custom: 'customUser:param_name'.",
        },
        metricFilter: {
          type: "object",
          additionalProperties: true,
          description: "Post-aggregation filter on metric values. Applied after row aggregation.",
        },
        minuteRanges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Optional name for this minute range.",
              },
              endMinutesAgo: {
                type: "integer",
                description: "End of the range in minutes ago (default 0 = now).",
              },
              startMinutesAgo: {
                type: "integer",
                description: "Start of the range in minutes ago (default 29, max 30 for standard or 60 for GA 360).",
              },
            },
            description: "Time range specification for realtime reports.",
          },
          description: "Time ranges to report on. Default is last 30 minutes. Each range has startMinutesAgo (default 29) and endMinutesAgo (default 0).",
        },
        dimensionFilter: {
          type: "object",
          additionalProperties: true,
          description: "Filter to restrict data by dimension values. Structure: {'filter': {'fieldName': 'country', 'stringFilter': {'value': 'United States'}}} or use andGroup/orGroup/notExpression for complex filters.",
        },
        metricAggregations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Request aggregated metric values. Values: 'TOTAL', 'MINIMUM', 'MAXIMUM', 'COUNT'.",
        },
        returnPropertyQuota: {
          type: "boolean",
          description: "If true, includes API quota usage info in the response.",
        },
      },
      required: [
        "property",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_run_report",
    description: "Tool to run a customized GA4 data report. Use when you need event data after specifying dimensions, metrics, and date ranges. IMPORTANT - DIMENSION/METRIC COMPATIBILITY: The Google Analytics Data API has strict compatibility rules between dimensions and metrics. Not all combinations are valid. If you receive a 400 error with a message about incompatible dimensions/metrics, use the GOOGLE_ANALYTICS_CHECK_COMPATIBILITY action first to validate your dimension/metric combinations before running reports. Common incompatibilities include: - Demographic dimensions (userAgeBracket, userGender) with session-scoped dimensions/filters (sessionCampaignName, sessionSource) - Certain user-scoped dimensions with event-scoped metrics For complex queries, consider starting with simpler dimension/metric combinations or use CHECK_COMPATIBILITY to pre-validate your request.",
    toolSlug: "GOOGLE_ANALYTICS_RUN_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Optional. Number of rows to return. Must be between 1 and 250000.",
        },
        offset: {
          type: "integer",
          description: "Optional. 0-based start row for pagination. Must be >= 0.",
        },
        metrics: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. The metrics to request and display. Maximum 10 metrics per request. Each metric MUST be an object with a required non-empty 'name' field. Common valid metric names: activeUsers, totalUsers, newUsers, sessions, engagedSessions, screenPageViews, eventCount, conversions, userEngagementDuration, engagementRate, bounceRate, averageSessionDuration, sessionsPerUser, screenPageViewsPerSession, purchaseRevenue, totalRevenue, transactions, ecommercePurchases. Custom metrics use format 'customEvent:parameter_name'. CRITICAL: 'averageEngagementTime' is NOT a valid metric - use 'userEngagementDuration' or 'averageSessionDuration' instead. 'exits' is NOT a valid metric in GA4.",
        },
        orderBys: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. Specify how rows are ordered. Each OrderBy object must have 'desc' (boolean) at the top level and exactly one of: 'metric' (with 'metricName' string), 'dimension' (with 'dimensionName' string and optional 'orderType': 'ALPHANUMERIC', 'CASE_INSENSITIVE_ALPHANUMERIC', or 'NUMERIC'), or 'pivot'. Example for metric ordering: {'desc': true, 'metric': {'metricName': 'activeUsers'}}. Example for dimension ordering: {'desc': false, 'dimension': {'dimensionName': 'country', 'orderType': 'ALPHANUMERIC'}}.",
        },
        property: {
          type: "string",
          description: "Required. The property resource on which to run the report. Format: properties/{property_id} where property_id must be a numeric ID (e.g., 'properties/123456789').",
        },
        cohortSpec: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Cohort specification. Requires requesting the cohort dimension.",
        },
        dateRanges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. The date ranges to read. Each range MUST be an object with required 'startDate' and 'endDate' fields (both must be non-empty). Dates can be in YYYY-MM-DD format or special values like 'today', 'yesterday', '7daysAgo', '30daysAgo'.",
        },
        dimensions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. The dimensions to request and display. Maximum 9 dimensions per request. Each dimension MUST be an object with a required non-empty 'name' field. Common valid dimension names: date, dateHour, dateHourMinute, year, month, week, day, dayOfWeek, hour, city, cityId, country, countryId, continent, continentId, region, subContinent, deviceCategory, browser, operatingSystem, platform, platformDeviceCategory, screenResolution, sessionSource, sessionMedium, sessionSourceMedium, sessionCampaignName, sessionDefaultChannelGroup, firstUserSource, firstUserMedium, firstUserCampaignName, firstUserDefaultChannelGroup, pagePath, pagePathPlusQueryString, pageTitle, landingPage, hostname, eventName, streamName, userAgeBracket, userGender, language, newVsReturning. Custom dimensions: 'customEvent:parameter_name' or 'customUser:parameter_name'. 'dateRange' is NOT a valid dimension — use date dimensions (date, dateHour, year, month, etc.) instead. 'exits' is NOT a valid dimension in GA4. COMPATIBILITY: Not all dimensions can be combined with each other or with certain metrics/filters. If you receive a compatibility error, use GOOGLE_ANALYTICS_CHECK_COMPATIBILITY to validate combinations, or see https://developers.google.com/analytics/devguides/reporting/data/v1/compatibility",
        },
        comparisons: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional. The comparison configuration. Adds a comparison column to the response.",
        },
        currencyCode: {
          type: "string",
          description: "Optional. The currency code to apply, in ISO 4217 format. Defaults to property currency.",
        },
        metricFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Filter expression to restrict rows by metric values. Applied after aggregation. IMPORTANT: Only use metric field names here (e.g., 'activeUsers', 'sessions', 'ecommercePurchases', 'purchaseRevenue'). Do NOT use dimension names in metricFilter - if you need to filter by a dimension (e.g., 'country', 'city', 'pagePath'), use dimensionFilter instead. The action validates that only metric names are used in metricFilter and will reject dimension names with a clear error. Structure: {'filter': {'fieldName': '<metric_name>', 'numericFilter': {'operation': 'GREATER_THAN', 'value': {'int64Value': '0'}}}} or use 'andGroup'/'orGroup' for multiple conditions.",
        },
        keepEmptyRows: {
          type: "boolean",
          description: "Optional. If true, rows with all zero metrics will be returned; otherwise omitted.",
        },
        dimensionFilter: {
          type: "object",
          additionalProperties: true,
          description: "Optional. Filter expression to restrict rows by dimension values. IMPORTANT: Only use dimension field names here (e.g., 'country', 'city', 'date', 'deviceCategory', 'pagePath'). Do NOT use metric names in dimensionFilter - if you need to filter by a metric (e.g., 'activeUsers', 'sessions', 'ecommercePurchases'), use metricFilter instead. Structure: {'filter': {'fieldName': '<dimension_name>', 'stringFilter': {...}}} or use 'andGroup'/'orGroup' for multiple conditions. COMPATIBILITY WARNING: Dimension filters must be compatible with the dimensions in your request. For example, filtering on 'sessionCampaignName' while using demographic dimensions (userAgeBracket, userGender) will fail. The filter field creates an implicit dimension that must be compatible with all other dimensions and metrics. Use GOOGLE_ANALYTICS_CHECK_COMPATIBILITY to verify your filter dimensions work with your requested dimensions/metrics.",
        },
        metricAggregations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional. Aggregation types to include over metrics, e.g., 'TOTAL', 'MINIMUM', 'MAXIMUM'.",
        },
        returnPropertyQuota: {
          type: "boolean",
          description: "Optional. If true, include the property's current quota state in the response.",
        },
        removed_dimensions_internal: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal field to store filtered dimension names for execution message. Not sent to API.",
        },
      },
      required: [
        "property",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "google_analytics_send_events",
    description: "Tool to send event data to Google Analytics 4 using the Measurement Protocol. Use when you need to track server-side events that supplement client-side gtag.js or Firebase tracking. The Measurement Protocol allows sending event data directly to GA4 from servers, applications, or other devices. Events are processed asynchronously and typically appear in reports within 24-48 hours. For validation, use the validation server endpoint first (mp/collect/validate).",
    toolSlug: "GOOGLE_ANALYTICS_SEND_EVENTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        events: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Required. Name of the event. Can be up to 40 characters. Use recommended event names from GA4 documentation (e.g., 'purchase', 'login', 'sign_up', 'page_view') or custom event names.",
              },
              params: {
                type: "object",
                additionalProperties: true,
                description: "Optional. Event parameters as key-value pairs. Common parameters include 'currency', 'value', 'transaction_id', 'items', 'engagement_time_msec'. Can include custom parameters.",
              },
            },
            description: "Event object for Google Analytics 4 Measurement Protocol.",
          },
          description: "Required. Array of event objects to send. Maximum 25 events per request. Each event must have a 'name' and can optionally include 'params'.",
        },
        consent: {
          type: "object",
          additionalProperties: true,
          properties: {
            ad_user_data: {
              type: "string",
              description: "Consent status for ad user data. Valid values: 'GRANTED', 'DENIED'",
            },
            ad_personalization: {
              type: "string",
              description: "Consent status for ad personalization. Valid values: 'GRANTED', 'DENIED'",
            },
          },
          description: "Consent settings for Google Analytics 4.",
        },
        user_id: {
          type: "string",
          description: "Optional. A unique identifier for a logged-in user. This should be a non-PII identifier that you use internally to identify a user. Maximum 256 characters.",
        },
        client_id: {
          type: "string",
          description: "Required. A unique identifier for a user/client. This should be a UUID or similar unique string that identifies a specific user across sessions. Maximum 256 characters.",
        },
        api_secret: {
          type: "string",
          description: "Required. The API secret generated in the Google Analytics UI under Admin > Data Streams > Measurement Protocol API secrets. Used to authenticate requests.",
        },
        measurement_id: {
          type: "string",
          description: "Required. The measurement ID for the web stream in the format G-XXXXXXX. This is found in the Google Analytics UI under Admin > Data Streams > Web Stream Details.",
        },
        user_properties: {
          type: "object",
          additionalProperties: true,
          description: "Optional. User properties to set for this measurement. Each property must have a 'value' field. User properties persist across events.",
        },
        timestamp_micros: {
          type: "integer",
          description: "Optional. Unix timestamp in microseconds for when the event occurred. If not provided, the current time is used. Can be up to 72 hours in the past.",
        },
      },
      required: [
        "measurement_id",
        "api_secret",
        "client_id",
        "events",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "measurement_protocol",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Events.",
    ],
  }),
  composioTool({
    name: "google_analytics_update_property",
    description: "Tool to update an existing GA4 Property. Use when you need to modify property settings such as display name, time zone, currency code, or industry category.",
    toolSlug: "GOOGLE_ANALYTICS_UPDATE_PROPERTY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Required. The resource name of the Property to update. Must be in the exact format: properties/{property_id} where property_id is a numeric identifier. IMPORTANT: Must start with 'properties/' prefix, contain no forward slashes in the property_id, have no trailing slashes, and no additional path segments. Valid example: 'properties/489591273'. Invalid examples: '489591273' (missing prefix), 'properties/489591273/' (trailing slash), 'properties/489591273/extra' (extra segments)",
        },
        parent: {
          type: "string",
          description: "Immutable. Resource name of this property's logical parent. Format: accounts/{account}, properties/{property}. Example: 'accounts/100', 'properties/101'",
        },
        timeZone: {
          type: "string",
          description: "Required. Reporting Time Zone, used as the day boundary for reports. Format: IANA time zone. Example: 'America/Los_Angeles'",
        },
        updateMask: {
          type: "string",
          description: "Required. The list of fields to be updated. Field names must be in snake case (e.g., 'display_name', 'time_zone', 'currency_code'). Omitted fields will not be updated. To replace the entire entity, use one path with the string '*' to match all fields. Common fields: 'display_name', 'time_zone', 'currency_code', 'industry_category'",
        },
        displayName: {
          type: "string",
          description: "Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units.",
        },
        currencyCode: {
          type: "string",
          description: "The currency type used in reports involving monetary values. Format: ISO 4217. Examples: 'USD', 'EUR', 'JPY'",
        },
        propertyType: {
          type: "string",
          description: "Property type for a property.",
          enum: [
            "PROPERTY_TYPE_UNSPECIFIED",
            "PROPERTY_TYPE_ORDINARY",
            "PROPERTY_TYPE_SUBPROPERTY",
            "PROPERTY_TYPE_ROLLUP",
          ],
        },
        industryCategory: {
          type: "string",
          description: "Industry category for a property.",
          enum: [
            "INDUSTRY_CATEGORY_UNSPECIFIED",
            "AUTOMOTIVE",
            "BUSINESS_AND_INDUSTRIAL_MARKETS",
            "FINANCE",
            "HEALTHCARE",
            "TECHNOLOGY",
            "TRAVEL",
            "OTHER",
            "ARTS_AND_ENTERTAINMENT",
            "BEAUTY_AND_FITNESS",
            "BOOKS_AND_LITERATURE",
            "FOOD_AND_DRINK",
            "GAMES",
            "HOBBIES_AND_LEISURE",
            "HOME_AND_GARDEN",
            "INTERNET_AND_TELECOM",
            "LAW_AND_GOVERNMENT",
            "NEWS",
            "ONLINE_COMMUNITIES",
            "PEOPLE_AND_SOCIETY",
            "PETS_AND_ANIMALS",
            "REAL_ESTATE",
            "REFERENCE",
            "SCIENCE",
            "SPORTS",
            "JOBS_AND_EDUCATION",
            "SHOPPING",
          ],
        },
      },
      required: [
        "name",
        "updateMask",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "write",
      "property_settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Property.",
    ],
  }),
  composioTool({
    name: "google_analytics_validate_events",
    description: "Tool to validate Measurement Protocol events before sending them to production. Use when you need to verify event structure and parameters are correct before sending real data.",
    toolSlug: "GOOGLE_ANALYTICS_VALIDATE_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        events: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Required. Array of events to validate. Each event must have a 'name' field and optional 'params' object.",
        },
        consent: {
          type: "object",
          additionalProperties: true,
          description: "Optional. The consent state for the user.",
        },
        user_id: {
          type: "string",
          description: "Optional. A unique identifier for a user.",
        },
        client_id: {
          type: "string",
          description: "Required. Unique client identifier. This uniquely identifies a user instance of a web client.",
        },
        api_secret: {
          type: "string",
          description: "Required. The API secret from Google Analytics for the Measurement Protocol.",
        },
        measurement_id: {
          type: "string",
          description: "Required. The measurement ID for web streams. Format: G-XXXXXXXXXX where X is alphanumeric.",
        },
        user_properties: {
          type: "object",
          additionalProperties: true,
          description: "Optional. The user properties for the measurement.",
        },
        timestamp_micros: {
          type: "string",
          description: "Optional. A Unix timestamp (in microseconds) for the time to associate with the event.",
        },
      },
      required: [
        "measurement_id",
        "api_secret",
        "client_id",
        "events",
      ],
    },
    tags: [
      "composio",
      "google-analytics",
      "read",
      "measurement_protocol",
    ],
  }),
];
