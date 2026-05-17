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
    integration: "segment",
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
      toolkit: "segment",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const segmentComposioTools: IntegrationTool[] = [
  composioTool({
    name: "segment_add_labels_to_source",
    description: "Tool to add existing labels to a Source. Use when you have the source ID and want to tag it with metadata labels.",
    toolSlug: "SEGMENT_ADD_LABELS_TO_SOURCE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "labels_keys",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Labels to Source.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "segment_alias",
    description: "Tool to alias a previous user ID to a new user ID. Use when merging anonymous and known identities.",
    toolSlug: "SEGMENT_ALIAS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Alias.",
    ],
  }),
  composioTool({
    name: "segment_batch",
    description: "Tool to send multiple analytics calls in a single batch request. Use when you want to reduce HTTP overhead by batching Identify/Track/Page/Screen/Group calls into one request.",
    toolSlug: "SEGMENT_BATCH",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch Segment Analytics Events.",
    ],
  }),
  composioTool({
    name: "segment_delete_source",
    description: "Tool to delete a Segment Source. Use when you need to permanently remove a Source by its ID after confirmation.",
    toolSlug: "SEGMENT_DELETE_SOURCE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "segment",
      "write",
      "sources",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Source.",
    ],
  }),
  composioTool({
    name: "segment_get_daily_per_source_api_calls_usage",
    description: "Tool to fetch daily API call counts per source for a given period. Use when you need daily breakdown of API usage by source after determining the reporting period.",
    toolSlug: "SEGMENT_GET_DAILY_PER_SOURCE_API_CALLS_USAGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "segment",
      "read",
      "usage",
    ],
  }),
  composioTool({
    name: "segment_get_destination",
    description: "Tool to retrieve a Destination by ID. Use when you need to fetch the full configuration of a Segment Destination instance by its unique identifier. Falls back US→EU public API and legacy app endpoint; returns minimal envelope on legacy HTML or parse errors.",
    toolSlug: "SEGMENT_GET_DESTINATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "segment",
      "read",
      "destinations",
    ],
  }),
  composioTool({
    name: "segment_group",
    description: "Tool to associate an identified user with a group via Segment HTTP Tracking API. Use when grouping users with traits.",
    toolSlug: "SEGMENT_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "user_identification",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Group.",
    ],
  }),
  composioTool({
    name: "segment_identify",
    description: "Tool to identify a user and set/update traits via Segment HTTP Tracking API.",
    toolSlug: "SEGMENT_IDENTIFY",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "user_identification",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Identify.",
    ],
  }),
  composioTool({
    name: "segment_import_historical_data",
    description: "Tool to import historical data in bulk with support for historical timestamps. Use when you need to backfill or import past events with their original timestamps into Segment.",
    toolSlug: "SEGMENT_IMPORT_HISTORICAL_DATA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Import Historical Data.",
    ],
  }),
  composioTool({
    name: "segment_list_connected_warehouses_from_source",
    description: "Tool to list warehouses connected to a Source. Use when you need to retrieve warehouses for a given source ID.",
    toolSlug: "SEGMENT_LIST_CONNECTED_WAREHOUSES_FROM_SOURCE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "segment",
      "read",
      "sources",
    ],
  }),
  composioTool({
    name: "segment_list_delivery_metrics_summary_from_destination",
    description: "Get an event delivery metrics summary from a Destination. Primary attempt uses Segment Public API; fallback to legacy app host if needed. On HTML fallback responses, returns a minimal valid envelope to maintain contract.",
    toolSlug: "SEGMENT_LIST_DELIVERY_METRICS_SUMMARY_FROM_DESTINATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "segment",
      "read",
      "destinations",
    ],
  }),
  composioTool({
    name: "segment_list_schema_settings_in_source",
    description: "Retrieve schema configuration settings for a Source.",
    toolSlug: "SEGMENT_LIST_SCHEMA_SETTINGS_IN_SOURCE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "segment",
      "read",
      "sources",
    ],
  }),
  composioTool({
    name: "segment_page",
    description: "Tool to record a page view via Segment HTTP Tracking API. Use when sending page views with optional page name and properties.",
    toolSlug: "SEGMENT_PAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Page View.",
    ],
  }),
  composioTool({
    name: "segment_remove_source_write_key",
    description: "Tool to remove a write key from a Source. Use when you need to revoke an existing write key for security or rotation.",
    toolSlug: "SEGMENT_REMOVE_SOURCE_WRITE_KEY",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "segment",
      "write",
      "labels_keys",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Source Write Key.",
    ],
  }),
  composioTool({
    name: "segment_screen",
    description: "Tool to record a mobile app screen view. Use when tracking screen views in a mobile app via Segment HTTP Tracking API.",
    toolSlug: "SEGMENT_SCREEN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Screen Event.",
    ],
  }),
  composioTool({
    name: "segment_track",
    description: "Tool to record a custom user event via Segment HTTP Tracking API. Use when sending events to Segment with valid identity.",
    toolSlug: "SEGMENT_TRACK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "data_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Segment Track Event.",
    ],
  }),
  composioTool({
    name: "segment_update_source",
    description: "Tool to update a Source's metadata and settings. Use when you need to modify an existing Source after confirming its ID.",
    toolSlug: "SEGMENT_UPDATE_SOURCE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "segment",
      "write",
      "sources",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Source.",
    ],
    idempotent: true,
  }),
];
