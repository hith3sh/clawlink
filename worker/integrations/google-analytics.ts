import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const ANALYTICS_DATA_BASE_URL = "https://analyticsdata.googleapis.com";
const ANALYTICS_ADMIN_BASE_URL = "https://analyticsadmin.googleapis.com";

interface GoogleApiErrorPayload {
  error?: {
    code?: number | string;
    status?: string;
    message?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

function isRecordObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePropertyId(value: unknown): string {
  const raw = safeTrim(value);

  if (!raw) {
    throw new Error("propertyId is required");
  }

  if (raw.startsWith("properties/")) {
    return raw;
  }

  return `properties/${raw}`;
}

function requiredResourceName(
  value: unknown,
  fieldName: string,
  expectedSegment?: string,
): string {
  const name = safeTrim(value);

  if (!name) {
    throw new Error(`${fieldName} is required`);
  }

  if (expectedSegment && !name.includes(`/${expectedSegment}/`)) {
    throw new Error(`${fieldName} must be a ${expectedSegment} resource name`);
  }

  return name;
}

function optionalObject(value: unknown, fieldName: string): UnknownRecord {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isRecordObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return { ...value };
}

function normalizeNamedResourceList(
  value: unknown,
  fieldName: string,
): UnknownRecord[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((entry, index) => {
    const name = safeTrim(entry);

    if (name) {
      return { name };
    }

    if (!isRecordObject(entry)) {
      throw new Error(`${fieldName}[${index}] must be a string or object`);
    }

    return { ...entry };
  });
}

function normalizeObjectList(
  value: unknown,
  fieldName: string,
): UnknownRecord[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((entry, index) => {
    if (!isRecordObject(entry)) {
      throw new Error(`${fieldName}[${index}] must be an object`);
    }

    return { ...entry };
  });
}

function normalizeStringList(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((entry, index) => {
    const normalized = safeTrim(entry);

    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }

    return normalized;
  });
}

function setIfProvided(
  payload: UnknownRecord,
  key: string,
  value: unknown,
): void {
  if (value !== undefined) {
    payload[key] = value;
  }
}

function toPositiveIntString(
  value: unknown,
  fieldName: string,
  options: { min?: number; max?: number } = {},
): string {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a finite number`);
  }

  const integer = Math.trunc(parsed);

  if (options.min !== undefined && integer < options.min) {
    throw new Error(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && integer > options.max) {
    throw new Error(`${fieldName} must be at most ${options.max}`);
  }

  return String(integer);
}

function getAccessToken(credentials: Record<string, string>): string {
  const token = safeTrim(
    credentials.accessToken ?? credentials.access_token ?? credentials.token,
  );

  if (!token) {
    throw new Error("Google Analytics credentials are missing an access token.");
  }

  return token;
}

class GoogleAnalyticsHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "run_report", {
        description: "Run a customized GA4 core report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name, for example 123456789 or properties/123456789",
            },
            metrics: {
              type: "array",
              description: "Metrics to request. You can pass metric names like activeUsers or objects like { name: 'activeUsers' }.",
              items: {},
            },
            dimensions: {
              type: "array",
              description: "Dimensions to request. You can pass dimension names like country or objects like { name: 'country' }.",
              items: {},
            },
            dateRanges: {
              type: "array",
              description: "Date ranges such as [{ startDate: '7daysAgo', endDate: 'yesterday' }]",
              items: {},
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression applied before aggregation" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            metricAggregations: { type: "array", items: {}, description: "Metric aggregation enum values" },
            comparisons: { type: "array", items: {}, description: "GA comparison objects" },
            cohortSpec: { type: "object", description: "GA cohort spec" },
            currencyCode: { type: "string", description: "ISO currency code such as USD" },
            keepEmptyRows: { type: "boolean", description: "Keep rows where all metrics are zero" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            offset: { type: "number", description: "Row offset for pagination" },
            request: { type: "object", description: "Optional raw GA runReport request body to merge with the top-level arguments" },
          },
          required: ["propertyId", "metrics"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "reporting", "google-analytics"],
        whenToUse: [
          "User wants a standard GA4 report for one property.",
          "You need event, session, or user metrics by one or more dimensions over one or more date ranges.",
        ],
        askBefore: [
          "Ask which GA4 property to use if the property id is not already known.",
          "If a report fails due to incompatible dimensions and metrics, run google-analytics_check_compatibility first.",
        ],
        safeDefaults: {
          dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
          limit: 100,
        },
        examples: [
          {
            user: "show active users and sessions by country for the last 7 days",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["country"],
              metrics: ["activeUsers", "sessions"],
              dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
              limit: 100,
            },
          },
        ],
        followups: [
          "Offer to check compatibility if the user wants a more complex dimension and metric combination.",
          "Offer a realtime or pivot report when the user wants a live view or pivot-table layout.",
        ],
      }),
      defineTool(integrationSlug, "provision_account_ticket", {
        description: "Request a Google Analytics account provisioning ticket that redirects the user to Terms of Service acceptance",
        inputSchema: {
          type: "object",
          properties: {
            account: {
              type: "object",
              description: "Account object to provision, for example { displayName: 'Example Account', regionCode: 'US' }",
            },
            redirectUri: {
              type: "string",
              description: "Redirect URI that Google should send the user back to after Terms acceptance",
            },
          },
          required: ["account", "redirectUri"],
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "account", "provisioning", "google-analytics"],
        whenToUse: [
          "You need to start the Google Analytics account creation flow that requires Terms of Service acceptance.",
        ],
        askBefore: [
          "Confirm the desired account display name, region, and redirect URI before requesting the ticket.",
        ],
      }),
      defineTool(integrationSlug, "run_realtime_report", {
        description: "Run a customized GA4 realtime report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            metrics: {
              type: "array",
              description: "Realtime metrics to request",
              items: {},
            },
            dimensions: {
              type: "array",
              description: "Realtime dimensions to request",
              items: {},
            },
            minuteRanges: {
              type: "array",
              description: "Minute ranges such as [{ startMinutesAgo: 29, endMinutesAgo: 0 }]",
              items: {},
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            comparisons: { type: "array", items: {}, description: "GA comparison objects" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            offset: { type: "number", description: "Row offset for pagination" },
            request: { type: "object", description: "Optional raw GA runRealtimeReport request body to merge with top-level arguments" },
          },
          required: ["propertyId", "metrics"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "realtime", "google-analytics"],
        whenToUse: [
          "User wants a live view of recent GA4 activity.",
          "You need a last-30-minutes or last-60-minutes view of traffic or events.",
        ],
        askBefore: [
          "Ask which property to query if the property id is not already known.",
        ],
        safeDefaults: {
          minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }],
          limit: 100,
        },
        examples: [
          {
            user: "show realtime users by country",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["country"],
              metrics: ["activeUsers"],
              minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }],
              limit: 100,
            },
          },
        ],
        followups: [
          "Offer a standard report if the user wants historical rather than realtime data.",
        ],
      }),
      defineTool(integrationSlug, "create_audience_export", {
        description: "Create a GA4 audience export for later retrieval",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            audienceExport: {
              type: "object",
              description: "Audience export definition, for example { audience: 'properties/123/audiences/456', dimensions: [{ name: 'deviceId' }] }",
            },
          },
          required: ["propertyId", "audienceExport"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "google-analytics"],
        whenToUse: [
          "You need to start an asynchronous audience export before querying the exported user rows.",
        ],
        followups: [
          "Use google-analytics_get_audience_export to check readiness, then google-analytics_query_audience_export to retrieve rows.",
        ],
      }),
      defineTool(integrationSlug, "get_audience_export", {
        description: "Get metadata and readiness state for a GA4 audience export",
        inputSchema: {
          type: "object",
          properties: {
            audienceExportName: {
              type: "string",
              description: "Full audience export resource name, for example properties/123/audienceExports/456",
            },
          },
          required: ["audienceExportName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "status", "google-analytics"],
      }),
      defineTool(integrationSlug, "query_audience_export", {
        description: "Query a completed GA4 audience export with pagination",
        inputSchema: {
          type: "object",
          properties: {
            audienceExportName: {
              type: "string",
              description: "Full audience export resource name",
            },
            offset: {
              type: "number",
              description: "Row offset for pagination",
            },
            limit: {
              type: "number",
              description: "Maximum rows to return",
            },
          },
          required: ["audienceExportName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "query", "google-analytics"],
        whenToUse: [
          "You need user rows from a completed audience export.",
        ],
        askBefore: [
          "If the export may still be processing, check it with google-analytics_get_audience_export first.",
        ],
      }),
      defineTool(integrationSlug, "check_compatibility", {
        description: "Check whether GA4 dimensions and metrics are compatible for a core report request",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            metrics: {
              type: "array",
              description: "Metrics you want to validate",
              items: {},
            },
            dimensions: {
              type: "array",
              description: "Dimensions you want to validate",
              items: {},
            },
            dateRanges: {
              type: "array",
              description: "Optional date ranges for compatibility context",
              items: {},
            },
            dimensionFilter: { type: "object", description: "Optional FilterExpression" },
            metricFilter: { type: "object", description: "Optional post-aggregation FilterExpression" },
            compatibilityFilter: {
              type: "string",
              description: "Optional compatibility filter enum such as COMPATIBLE or INCOMPATIBLE",
            },
            request: { type: "object", description: "Optional raw GA checkCompatibility request body to merge with top-level arguments" },
          },
          required: ["propertyId"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "compatibility", "google-analytics"],
        whenToUse: [
          "A planned GA4 report may fail because dimensions and metrics might be incompatible.",
          "You want to validate a report shape before calling run_report.",
        ],
        followups: [
          "Use the response to simplify the report request and rerun google-analytics_run_report.",
        ],
      }),
      defineTool(integrationSlug, "create_audience_list", {
        description: "Create a GA4 audience list for later retrieval",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            audienceList: {
              type: "object",
              description: "Audience list definition, for example { audience: 'properties/123/audiences/456', dimensions: [{ name: 'deviceId' }] }",
            },
          },
          required: ["propertyId", "audienceList"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "google-analytics"],
        whenToUse: [
          "You need to start an asynchronous audience list before querying its user rows.",
        ],
        followups: [
          "Use google-analytics_get_audience_list to check readiness, then google-analytics_query_audience_list to retrieve rows.",
        ],
      }),
      defineTool(integrationSlug, "get_audience_list", {
        description: "Get metadata and readiness state for a GA4 audience list",
        inputSchema: {
          type: "object",
          properties: {
            audienceListName: {
              type: "string",
              description: "Full audience list resource name, for example properties/123/audienceLists/456",
            },
          },
          required: ["audienceListName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "status", "google-analytics"],
      }),
      defineTool(integrationSlug, "query_audience_list", {
        description: "Query a completed GA4 audience list with pagination",
        inputSchema: {
          type: "object",
          properties: {
            audienceListName: {
              type: "string",
              description: "Full audience list resource name",
            },
            offset: {
              type: "number",
              description: "Row offset for pagination",
            },
            limit: {
              type: "number",
              description: "Maximum rows to return",
            },
          },
          required: ["audienceListName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "query", "google-analytics"],
        whenToUse: [
          "You need user rows from a completed audience list.",
        ],
        askBefore: [
          "If the audience list may still be processing, check it with google-analytics_get_audience_list first.",
        ],
      }),
      defineTool(integrationSlug, "run_pivot_report", {
        description: "Run a customized GA4 pivot report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            metrics: {
              type: "array",
              description: "Metrics to request",
              items: {},
            },
            dimensions: {
              type: "array",
              description: "Dimensions to request",
              items: {},
            },
            pivots: {
              type: "array",
              description: "GA pivot definitions. Dimensions are only visible if referenced by a pivot.",
              items: {},
            },
            dateRanges: {
              type: "array",
              description: "Date ranges such as [{ startDate: '28daysAgo', endDate: 'yesterday' }]",
              items: {},
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            currencyCode: { type: "string", description: "ISO currency code such as USD" },
            keepEmptyRows: { type: "boolean", description: "Keep rows where all metrics are zero" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            request: { type: "object", description: "Optional raw GA runPivotReport request body to merge with top-level arguments" },
          },
          required: ["propertyId", "metrics", "pivots"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "pivot", "google-analytics"],
        whenToUse: [
          "User wants a pivot-table style GA4 report.",
          "You need multi-dimensional analysis where the visible dimensions are defined by pivots.",
        ],
        askBefore: [
          "Ask which pivot layout the user wants if rows and columns are not clear yet.",
        ],
        examples: [
          {
            user: "show sessions by device category and country as a pivot",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["deviceCategory", "country"],
              metrics: ["sessions"],
              pivots: [
                {
                  fieldNames: ["deviceCategory"],
                  limit: "10",
                },
                {
                  fieldNames: ["country"],
                  limit: "25",
                },
              ],
              dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
            },
          },
        ],
        followups: [
          "Offer a simpler run_report if the user no longer needs a pivot layout.",
        ],
      }),
      defineTool(integrationSlug, "create_report_task", {
        description: "Create an asynchronous GA4 report task for later querying",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            reportTask: {
              type: "object",
              description: "Report task definition",
            },
          },
          required: ["propertyId", "reportTask"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "async", "google-analytics"],
        whenToUse: [
          "You need an asynchronous report task instead of an immediate run_report response.",
        ],
        followups: [
          "Use google-analytics_get_report_task to inspect status, then google-analytics_query_report_task when it reaches ACTIVE.",
        ],
      }),
      defineTool(integrationSlug, "get_report_task", {
        description: "Get metadata and processing state for a GA4 report task",
        inputSchema: {
          type: "object",
          properties: {
            reportTaskName: {
              type: "string",
              description: "Full report task resource name, for example properties/123/reportTasks/456",
            },
          },
          required: ["reportTaskName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "status", "google-analytics"],
      }),
      defineTool(integrationSlug, "query_report_task", {
        description: "Query a completed GA4 report task with pagination",
        inputSchema: {
          type: "object",
          properties: {
            reportTaskName: {
              type: "string",
              description: "Full report task resource name",
            },
            offset: {
              type: "number",
              description: "Row offset for pagination",
            },
            limit: {
              type: "number",
              description: "Maximum rows to return",
            },
          },
          required: ["reportTaskName"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "query", "google-analytics"],
        whenToUse: [
          "You need the rows and columns of an ACTIVE report task.",
        ],
        askBefore: [
          "If the report task may still be processing, check it with google-analytics_get_report_task first.",
        ],
      }),
      defineTool(integrationSlug, "run_funnel_report", {
        description: "Run a customized GA4 funnel report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            funnel: {
              type: "object",
              description: "Required GA funnel definition",
            },
            dateRanges: {
              type: "array",
              description: "Optional date ranges for the funnel report",
              items: {},
            },
            funnelBreakdown: { type: "object", description: "Optional funnel breakdown config" },
            funnelNextAction: { type: "object", description: "Optional next action config" },
            funnelVisualizationType: { type: "string", description: "Optional funnel visualization enum" },
            segments: { type: "array", items: {}, description: "Optional GA segments" },
            dimensionFilter: { type: "object", description: "Optional GA FilterExpression" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            request: { type: "object", description: "Optional raw GA runFunnelReport request body to merge with top-level arguments" },
          },
          required: ["propertyId", "funnel"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "funnel", "google-analytics"],
        whenToUse: [
          "User wants funnel analysis for a GA4 property.",
          "You need step-by-step conversion data instead of a flat report.",
        ],
        askBefore: [
          "Ask for the funnel steps or stage definitions if they are not already known.",
        ],
        followups: [
          "Offer a standard or pivot report if the user wants supporting metrics outside the funnel.",
        ],
      }),
      defineTool(integrationSlug, "update_property", {
        description: "Update an existing GA4 property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name",
            },
            updateMask: {
              type: "string",
              description: "Required FieldMask in snake_case, for example display_name,time_zone,currency_code",
            },
            property: {
              type: "object",
              description: "Property fields to update, for example { displayName: 'New Name', timeZone: 'America/New_York' }",
            },
          },
          required: ["propertyId", "updateMask", "property"],
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "property", "admin", "google-analytics"],
        whenToUse: [
          "User explicitly asks to update a GA4 property setting.",
        ],
        askBefore: [
          "Confirm the exact property id and the fields to change before updating settings.",
        ],
        followups: [
          "Offer to rerun a report after the property change if the user needs to verify the new configuration context.",
        ],
      }),
      defineTool(integrationSlug, "validate_events", {
        description: "Validate GA4 Measurement Protocol events before sending them to production",
        inputSchema: {
          type: "object",
          properties: {
            apiSecret: {
              type: "string",
              description: "Measurement Protocol API secret for the target data stream",
            },
            measurementId: {
              type: "string",
              description: "Web stream measurement id such as G-XXXXXXXXXX",
            },
            firebaseAppId: {
              type: "string",
              description: "App stream Firebase app id if validating app events instead of web events",
            },
            events: {
              type: "array",
              description: "Measurement Protocol events to validate",
              items: {},
            },
            clientId: {
              type: "string",
              description: "Client identifier for web streams",
            },
            appInstanceId: {
              type: "string",
              description: "App instance identifier for app streams",
            },
            userId: {
              type: "string",
              description: "Optional user id",
            },
            timestampMicros: {
              type: "string",
              description: "Optional event timestamp in microseconds",
            },
            validationBehavior: {
              type: "string",
              description: "Optional validation behavior such as ENFORCE_RECOMMENDATIONS",
            },
            payload: {
              type: "object",
              description: "Optional raw Measurement Protocol request body to merge with the top-level arguments",
            },
          },
          required: ["apiSecret", "events"],
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "measurement-protocol", "validation", "google-analytics"],
        whenToUse: [
          "You want to verify the structure of Measurement Protocol events before sending them to production.",
        ],
        askBefore: [
          "Ask for the target stream secret and the right stream identifier if they are not already known.",
        ],
        safeDefaults: {
          validationBehavior: "ENFORCE_RECOMMENDATIONS",
        },
        followups: [
          "Use google-analytics_send_events after the validation response looks clean.",
        ],
      }),
      defineTool(integrationSlug, "send_events", {
        description: "Send GA4 Measurement Protocol events to Google Analytics",
        inputSchema: {
          type: "object",
          properties: {
            apiSecret: {
              type: "string",
              description: "Measurement Protocol API secret for the target data stream",
            },
            measurementId: {
              type: "string",
              description: "Web stream measurement id such as G-XXXXXXXXXX",
            },
            firebaseAppId: {
              type: "string",
              description: "App stream Firebase app id if sending app events instead of web events",
            },
            events: {
              type: "array",
              description: "Measurement Protocol events to send",
              items: {},
            },
            clientId: {
              type: "string",
              description: "Client identifier for web streams",
            },
            appInstanceId: {
              type: "string",
              description: "App instance identifier for app streams",
            },
            userId: {
              type: "string",
              description: "Optional user id",
            },
            timestampMicros: {
              type: "string",
              description: "Optional event timestamp in microseconds",
            },
            payload: {
              type: "object",
              description: "Optional raw Measurement Protocol request body to merge with the top-level arguments",
            },
          },
          required: ["apiSecret", "events"],
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "measurement-protocol", "events", "google-analytics"],
        whenToUse: [
          "You need to send server-side events to GA4.",
        ],
        askBefore: [
          "Validate the payload first unless the event contract is already well tested.",
          "Ask for the correct stream secret and identifier if they are not already known.",
        ],
        followups: [
          "Offer to validate a changed payload first if the sent event does not behave as expected.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${getAccessToken(credentials)}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "run_report":
        return this.runReport(args, credentials);
      case "provision_account_ticket":
        return this.provisionAccountTicket(args, credentials);
      case "run_realtime_report":
        return this.runRealtimeReport(args, credentials);
      case "create_audience_export":
        return this.createAudienceExport(args, credentials);
      case "get_audience_export":
        return this.getAudienceExport(args, credentials);
      case "query_audience_export":
        return this.queryAudienceExport(args, credentials);
      case "check_compatibility":
        return this.checkCompatibility(args, credentials);
      case "create_audience_list":
        return this.createAudienceList(args, credentials);
      case "get_audience_list":
        return this.getAudienceList(args, credentials);
      case "query_audience_list":
        return this.queryAudienceList(args, credentials);
      case "run_pivot_report":
        return this.runPivotReport(args, credentials);
      case "create_report_task":
        return this.createReportTask(args, credentials);
      case "get_report_task":
        return this.getReportTask(args, credentials);
      case "query_report_task":
        return this.queryReportTask(args, credentials);
      case "run_funnel_report":
        return this.runFunnelReport(args, credentials);
      case "update_property":
        return this.updateProperty(args, credentials);
      case "validate_events":
        return this.validateEvents(args);
      case "send_events":
        return this.sendEvents(args);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${ANALYTICS_ADMIN_BASE_URL}/v1beta/accountSummaries?pageSize=1`,
        { method: "GET" },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private async runReport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildCoreReportPayload(args, {
      defaultDateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      defaultLimit: "100",
    });

    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }

    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runReport`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics report", response);
    }

    return response.json();
  }

  private async provisionAccountTicket(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const account = optionalObject(args.account, "account");
    const redirectUri = safeTrim(args.redirectUri);

    if (!redirectUri) {
      throw new Error("redirectUri is required");
    }

    const response = await this.apiRequest(
      `${ANALYTICS_ADMIN_BASE_URL}/v1beta/accounts:provisionAccountTicket`,
      {
        method: "POST",
        body: JSON.stringify({
          account,
          redirectUri,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to provision Google Analytics account ticket",
        response,
      );
    }

    return response.json();
  }

  private async runRealtimeReport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildRealtimeReportPayload(args);

    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }

    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runRealtimeReport`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics realtime report", response);
    }

    return response.json();
  }

  private async createAudienceExport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const audienceExport = optionalObject(args.audienceExport, "audienceExport");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}/audienceExports`,
      {
        method: "POST",
        body: JSON.stringify(audienceExport),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics audience export",
        response,
      );
    }

    return response.json();
  }

  private async getAudienceExport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.audienceExportName,
      "audienceExportName",
      "audienceExports",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${name}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics audience export",
        response,
      );
    }

    return response.json();
  }

  private async queryAudienceExport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.audienceExportName,
      "audienceExportName",
      "audienceExports",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args)),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics audience export",
        response,
      );
    }

    return response.json();
  }

  private async checkCompatibility(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const payload = optionalObject(args.request, "request");

    if (args.dimensions !== undefined) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }

    if (args.metrics !== undefined) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }

    if (args.dateRanges !== undefined) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }

    if (args.dimensionFilter !== undefined) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }

    if (args.metricFilter !== undefined) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }

    if (args.compatibilityFilter !== undefined) {
      payload.compatibilityFilter = safeTrim(args.compatibilityFilter);
    }

    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:checkCompatibility`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to check Google Analytics compatibility", response);
    }

    return response.json();
  }

  private async createAudienceList(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const audienceList = optionalObject(args.audienceList, "audienceList");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}/audienceLists`,
      {
        method: "POST",
        body: JSON.stringify(audienceList),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics audience list",
        response,
      );
    }

    return response.json();
  }

  private async getAudienceList(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.audienceListName,
      "audienceListName",
      "audienceLists",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics audience list",
        response,
      );
    }

    return response.json();
  }

  private async queryAudienceList(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.audienceListName,
      "audienceListName",
      "audienceLists",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args)),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics audience list",
        response,
      );
    }

    return response.json();
  }

  private async runPivotReport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildCoreReportPayload(args, {
      defaultDateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
    });

    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }

    if (args.pivots !== undefined) {
      payload.pivots = normalizeObjectList(args.pivots, "pivots");
    }

    if (!Array.isArray(payload.pivots) || payload.pivots.length === 0) {
      throw new Error("pivots is required");
    }

    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runPivotReport`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics pivot report", response);
    }

    return response.json();
  }

  private async createReportTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const reportTask = optionalObject(args.reportTask, "reportTask");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}/reportTasks`,
      {
        method: "POST",
        body: JSON.stringify(reportTask),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics report task",
        response,
      );
    }

    return response.json();
  }

  private async getReportTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.reportTaskName,
      "reportTaskName",
      "reportTasks",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics report task",
        response,
      );
    }

    return response.json();
  }

  private async queryReportTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const name = requiredResourceName(
      args.reportTaskName,
      "reportTaskName",
      "reportTasks",
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args)),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics report task",
        response,
      );
    }

    return response.json();
  }

  private async runFunnelReport(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const payload = optionalObject(args.request, "request");

    if (args.dateRanges !== undefined) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }

    if (!payload.dateRanges) {
      payload.dateRanges = [{ startDate: "28daysAgo", endDate: "yesterday" }];
    }

    if (args.funnel !== undefined) {
      payload.funnel = optionalObject(args.funnel, "funnel");
    }

    if (!isRecordObject(payload.funnel)) {
      throw new Error("funnel is required");
    }

    if (args.funnelBreakdown !== undefined) {
      payload.funnelBreakdown = optionalObject(args.funnelBreakdown, "funnelBreakdown");
    }

    if (args.funnelNextAction !== undefined) {
      payload.funnelNextAction = optionalObject(args.funnelNextAction, "funnelNextAction");
    }

    if (args.funnelVisualizationType !== undefined) {
      payload.funnelVisualizationType = safeTrim(args.funnelVisualizationType);
    }

    if (args.segments !== undefined) {
      payload.segments = normalizeObjectList(args.segments, "segments");
    }

    if (args.dimensionFilter !== undefined) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }

    if (args.limit !== undefined) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    }

    if (args.returnPropertyQuota !== undefined) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }

    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}:runFunnelReport`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics funnel report", response);
    }

    return response.json();
  }

  private async updateProperty(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const property = normalizePropertyId(args.propertyId);
    const updateMask = safeTrim(args.updateMask);

    if (!updateMask) {
      throw new Error("updateMask is required");
    }

    const propertyBody = optionalObject(args.property, "property");
    const response = await this.apiRequest(
      `${ANALYTICS_ADMIN_BASE_URL}/v1beta/${property}?${new URLSearchParams({
        updateMask,
      }).toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...propertyBody,
          name: property,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Analytics property", response);
    }

    return response.json();
  }

  private async validateEvents(
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const query = this.buildMeasurementProtocolQuery(args);
    const payload = this.buildMeasurementProtocolPayload(args);

    if (!payload.validation_behavior) {
      payload.validation_behavior =
        safeTrim(args.validationBehavior) ?? "ENFORCE_RECOMMENDATIONS";
    }

    const response = await fetch(
      `https://www.google-analytics.com/debug/mp/collect?${query.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw await this.createGenericApiError(
        "Failed to validate Google Analytics Measurement Protocol events",
        response,
      );
    }

    return response.json();
  }

  private async sendEvents(
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const query = this.buildMeasurementProtocolQuery(args);
    const payload = this.buildMeasurementProtocolPayload(args);
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?${query.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw await this.createGenericApiError(
        "Failed to send Google Analytics Measurement Protocol events",
        response,
      );
    }

    return {
      ok: true,
      status: response.status,
      message: "Google Analytics accepted the Measurement Protocol request.",
    };
  }

  private buildCoreReportPayload(
    args: Record<string, unknown>,
    options: {
      defaultDateRanges?: UnknownRecord[];
      defaultLimit?: string;
    } = {},
  ): UnknownRecord {
    const payload = optionalObject(args.request, "request");

    if (args.dimensions !== undefined) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }

    if (args.metrics !== undefined) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }

    if (args.dateRanges !== undefined) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }

    if (!payload.dateRanges && options.defaultDateRanges) {
      payload.dateRanges = options.defaultDateRanges;
    }

    if (args.dimensionFilter !== undefined) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }

    if (args.metricFilter !== undefined) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }

    if (args.orderBys !== undefined) {
      payload.orderBys = normalizeObjectList(args.orderBys, "orderBys");
    }

    if (args.metricAggregations !== undefined) {
      payload.metricAggregations = normalizeStringList(args.metricAggregations, "metricAggregations");
    }

    if (args.comparisons !== undefined) {
      payload.comparisons = normalizeObjectList(args.comparisons, "comparisons");
    }

    if (args.cohortSpec !== undefined) {
      payload.cohortSpec = optionalObject(args.cohortSpec, "cohortSpec");
    }

    setIfProvided(payload, "currencyCode", safeTrim(args.currencyCode) ?? undefined);

    if (args.keepEmptyRows !== undefined) {
      payload.keepEmptyRows = Boolean(args.keepEmptyRows);
    }

    if (args.returnPropertyQuota !== undefined) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }

    if (args.limit !== undefined) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    } else if (!payload.limit && options.defaultLimit) {
      payload.limit = options.defaultLimit;
    }

    if (args.offset !== undefined) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }

    return payload;
  }

  private buildRealtimeReportPayload(
    args: Record<string, unknown>,
  ): UnknownRecord {
    const payload = optionalObject(args.request, "request");

    if (args.dimensions !== undefined) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }

    if (args.metrics !== undefined) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }

    if (args.minuteRanges !== undefined) {
      payload.minuteRanges = normalizeObjectList(args.minuteRanges, "minuteRanges");
    }

    if (!payload.minuteRanges) {
      payload.minuteRanges = [{ startMinutesAgo: 29, endMinutesAgo: 0 }];
    }

    if (args.dimensionFilter !== undefined) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }

    if (args.metricFilter !== undefined) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }

    if (args.orderBys !== undefined) {
      payload.orderBys = normalizeObjectList(args.orderBys, "orderBys");
    }

    if (args.comparisons !== undefined) {
      payload.comparisons = normalizeObjectList(args.comparisons, "comparisons");
    }

    if (args.returnPropertyQuota !== undefined) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }

    if (args.limit !== undefined) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    } else if (!payload.limit) {
      payload.limit = "100";
    }

    if (args.offset !== undefined) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }

    return payload;
  }

  private buildPagingPayload(
    args: Record<string, unknown>,
  ): UnknownRecord {
    const payload: UnknownRecord = {};

    if (args.offset !== undefined) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }

    if (args.limit !== undefined) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    }

    return payload;
  }

  private buildMeasurementProtocolQuery(
    args: Record<string, unknown>,
  ): URLSearchParams {
    const apiSecret = safeTrim(args.apiSecret);
    const measurementId = safeTrim(args.measurementId);
    const firebaseAppId = safeTrim(args.firebaseAppId);

    if (!apiSecret) {
      throw new Error("apiSecret is required");
    }

    if (!measurementId && !firebaseAppId) {
      throw new Error("measurementId or firebaseAppId is required");
    }

    const query = new URLSearchParams({
      api_secret: apiSecret,
    });

    if (measurementId) {
      query.set("measurement_id", measurementId);
    }

    if (firebaseAppId) {
      query.set("firebase_app_id", firebaseAppId);
    }

    return query;
  }

  private buildMeasurementProtocolPayload(
    args: Record<string, unknown>,
  ): UnknownRecord {
    const payload = optionalObject(args.payload, "payload");

    if (args.events !== undefined) {
      payload.events = normalizeObjectList(args.events, "events");
    }

    if (!Array.isArray(payload.events) || payload.events.length === 0) {
      throw new Error("events is required");
    }

    setIfProvided(payload, "client_id", safeTrim(args.clientId) ?? undefined);
    setIfProvided(
      payload,
      "app_instance_id",
      safeTrim(args.appInstanceId) ?? undefined,
    );
    setIfProvided(payload, "user_id", safeTrim(args.userId) ?? undefined);
    setIfProvided(
      payload,
      "timestamp_micros",
      safeTrim(args.timestampMicros) ?? undefined,
    );

    if (!payload.client_id && !payload.app_instance_id) {
      throw new Error("clientId or appInstanceId is required");
    }

    return payload;
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as
      | GoogleApiErrorPayload
      | null;
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code =
      body?.error?.code !== undefined ? String(body.error.code) : undefined;
    const detail = status ? `${status}: ${message}` : message;

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code,
    });
  }

  private async createGenericApiError(
    prefix: string,
    response: Response,
  ): Promise<Error> {
    const bodyText = (await response.text().catch(() => "")).trim();
    const message = bodyText || response.statusText;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
    });
  }
}

registerHandler("google-analytics", new GoogleAnalyticsHandler());
