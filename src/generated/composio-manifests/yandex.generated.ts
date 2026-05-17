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
    integration: "yandex",
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
      toolkit: "yandex",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const yandexComposioTools: IntegrationTool[] = [
  composioTool({
    name: "yandex_geocoder_reverse",
    description: "Tool to convert geographic coordinates to a human-readable address (reverse geocoding). Returns address information including street, city, country, and other location details. Use this when you have latitude/longitude coordinates and need to find the corresponding address.",
    toolSlug: "YANDEX_GEOCODER_REVERSE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "geocoding",
    ],
  }),
  composioTool({
    name: "yandex_get_account_experiments",
    description: "Tool to retrieve Yandex Music account experimental features and A/B testing flags. Use when you need to check which experimental features are enabled for an account.",
    toolSlug: "YANDEX_GET_ACCOUNT_EXPERIMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "account",
    ],
  }),
  composioTool({
    name: "yandex_get_account_status",
    description: "Tool to retrieve Yandex Music account status and permissions. Use when you need to check account availability, region, subscription status, and granted permissions.",
    toolSlug: "YANDEX_GET_ACCOUNT_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "account",
    ],
  }),
  composioTool({
    name: "yandex_get_genres",
    description: "Tool to retrieve the list of music genres from Yandex Music. Use when you need to get available music genres for browsing or categorization.",
    toolSlug: "YANDEX_GET_GENRES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "music",
    ],
  }),
  composioTool({
    name: "yandex_get_permission_alerts",
    description: "Tool to retrieve permission alerts and notifications from Yandex Music API. Use this to check for system notifications about subscription status, permissions, or other user alerts.",
    toolSlug: "YANDEX_GET_PERMISSION_ALERTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "alerts",
    ],
  }),
  composioTool({
    name: "yandex_get_playlists_ids_by_tag",
    description: "Tool to retrieve playlist IDs associated with a specific tag. Use when you need to find playlists categorized under a tag like 'rock', 'pop', or 'jazz'.",
    toolSlug: "YANDEX_GET_PLAYLISTS_IDS_BY_TAG",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "playlists",
    ],
  }),
  composioTool({
    name: "yandex_get_public_resource",
    description: "Tool to retrieve metadata for a public file or folder on Yandex Disk. Use when you need to get information about publicly shared resources including their properties, nested items, and download URLs.",
    toolSlug: "YANDEX_GET_PUBLIC_RESOURCE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "storage",
    ],
  }),
  composioTool({
    name: "yandex_get_public_resource_download_link",
    description: "Tool to get a direct download link for a publicly shared Yandex Disk resource. Use when you need to download a file or folder that has been shared publicly.",
    toolSlug: "YANDEX_GET_PUBLIC_RESOURCE_DOWNLOAD_LINK",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "storage",
    ],
  }),
  composioTool({
    name: "yandex_get_rotor_account_status",
    description: "Tool to retrieve authenticated user's rotor account status with supplementary fields. Use to check user subscription status, permissions, and radio-specific settings like skips_per_hour.",
    toolSlug: "YANDEX_GET_ROTOR_ACCOUNT_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "account",
    ],
  }),
  composioTool({
    name: "yandex_get_rotor_stations_dashboard",
    description: "Tool to retrieve recommended radio stations for the current user. Use when you need to get the user's personalized station dashboard.",
    toolSlug: "YANDEX_GET_ROTOR_STATIONS_DASHBOARD",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "music",
    ],
  }),
  composioTool({
    name: "yandex_get_settings",
    description: "Tool to retrieve Yandex Music settings including available purchase products and payment configuration. Use when you need to check available subscription options, pricing, or payment methods.",
    toolSlug: "YANDEX_GET_SETTINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "music",
    ],
  }),
  composioTool({
    name: "yandex_get_stations_list",
    description: "Tool to retrieve all radio stations with user settings from Yandex Music. Use when you need to get the list of available radio stations and their configurations.",
    toolSlug: "YANDEX_GET_STATIONS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "music",
    ],
  }),
  composioTool({
    name: "yandex_get_track_download_info",
    description: "Tool to retrieve available download options for a Yandex Music track. Returns a list of download variants with different codecs (MP3/AAC) and bitrates. Use this when you need to get download links for a specific track ID.",
    toolSlug: "YANDEX_GET_TRACK_DOWNLOAD_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "music",
    ],
  }),
  composioTool({
    name: "yandex_list_filters",
    description: "Tool to retrieve all filters configured for a Yandex Metrica counter. Use when you need to view existing filters for data filtering or analysis.",
    toolSlug: "YANDEX_LIST_FILTERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "filters",
    ],
  }),
  composioTool({
    name: "yandex_list_goals",
    description: "Tool to retrieve all goals configured for a Yandex Metrica counter. Use when you need to list or inspect goals for analytics tracking.",
    toolSlug: "YANDEX_LIST_GOALS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "yandex_metrica",
    ],
  }),
  composioTool({
    name: "yandex_list_grants",
    description: "Tool to retrieve the list of permissions (grants) for a Yandex Metrica counter. Use when you need to check who has access to view or manage a counter and their permission levels.",
    toolSlug: "YANDEX_LIST_GRANTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "permissions",
    ],
  }),
  composioTool({
    name: "yandex_list_log_requests",
    description: "Tool to retrieve a list of log requests for a Yandex Metrica counter. Use when you need to view all log requests associated with a specific counter ID.",
    toolSlug: "YANDEX_LIST_LOG_REQUESTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "yandex_metrica",
    ],
  }),
  composioTool({
    name: "yandex_list_storage_buckets",
    description: "Tool to list all Yandex Object Storage buckets owned by the authenticated user. Use when you need to retrieve a list of available S3-compatible storage buckets.",
    toolSlug: "YANDEX_LIST_STORAGE_BUCKETS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "storage",
    ],
  }),
  composioTool({
    name: "yandex_organization_search",
    description: "Tool to find businesses and organizations by name, address, or TIN. Use when you need to search for companies in a specific region or text query.",
    toolSlug: "YANDEX_ORGANIZATION_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "yandex_route",
    description: "Tool to generate detailed route for driving, walking, or public transport. Use when planning a route between specified geographic points.",
    toolSlug: "YANDEX_ROUTE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "mapping",
    ],
  }),
  composioTool({
    name: "yandex_tiles",
    description: "Tool to fetch individual map tile images by x/y coordinates and zoom level. Use after calculating tile indices for custom map rendering.",
    toolSlug: "YANDEX_TILES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "yandex",
      "read",
      "mapping",
    ],
  }),
];
