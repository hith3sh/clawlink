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
    integration: "googlephotos",
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
      toolkit: "googlephotos",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googlephotosComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googlephotos_add_enrichment",
    description: "Adds an enrichment at a specified position in a defined album.",
    toolSlug: "GOOGLEPHOTOS_ADD_ENRICHMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Enrichment.",
    ],
  }),
  composioTool({
    name: "googlephotos_batch_add_media_items",
    description: "Adds one or more media items to an album in Google Photos.",
    toolSlug: "GOOGLEPHOTOS_BATCH_ADD_MEDIA_ITEMS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch Add Media Items.",
    ],
  }),
  composioTool({
    name: "googlephotos_batch_create_media_items",
    description: "Batch upload and create media items in Google Photos. Supports three input methods: 1. 'urls': Simple list of public URLs (file names extracted automatically) 2. 'media_files': List of objects with url/file, file_name, and description 3. 'files': List of FileUploadable objects for pre-uploaded files Media items can optionally be added to an album at a specific position. Maximum 50 items per request.",
    toolSlug: "GOOGLEPHOTOS_BATCH_CREATE_MEDIA_ITEMS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch Create Media Items.",
    ],
  }),
  composioTool({
    name: "googlephotos_batch_get_media_items",
    description: "Returns the list of media items for the specified media item identifiers.",
    toolSlug: "GOOGLEPHOTOS_BATCH_GET_MEDIA_ITEMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_create_album",
    description: "Creates a new album in Google Photos.",
    toolSlug: "GOOGLEPHOTOS_CREATE_ALBUM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Album.",
    ],
  }),
  composioTool({
    name: "googlephotos_get_album",
    description: "Returns the album based on the specified albumId.",
    toolSlug: "GOOGLEPHOTOS_GET_ALBUM",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_get_media_item_download",
    description: "Downloads a media item from Google Photos and returns it as a file.",
    toolSlug: "GOOGLEPHOTOS_GET_MEDIA_ITEM_DOWNLOAD",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_list_albums",
    description: "Lists all albums shown to a user in the Albums tab of Google Photos.",
    toolSlug: "GOOGLEPHOTOS_LIST_ALBUMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_list_media_items",
    description: "Lists media items created by this application from Google Photos. DEPRECATION NOTICE: As of March 31, 2025, the Google Photos Library API ONLY returns media items that were uploaded/created by your application. This action CANNOT access the user's full photo library. Use cases this action SUPPORTS: - Listing photos/videos your app previously uploaded to the user's library - Managing app-created content in Google Photos Use cases this action DOES NOT SUPPORT: - Accessing photos taken by the user's camera - Viewing photos from other apps or web uploads - Listing the user's entire photo library For accessing a user's full library, use the Google Photos Picker API instead: https://developers.google.com/photos/picker",
    toolSlug: "GOOGLEPHOTOS_LIST_MEDIA_ITEMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_search_media_items",
    description: "Searches for media items in a user's Google Photos library.",
    toolSlug: "GOOGLEPHOTOS_SEARCH_MEDIA_ITEMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "googlephotos",
      "read",
    ],
  }),
  composioTool({
    name: "googlephotos_update_album",
    description: "Updates an album's title or cover photo in Google Photos.",
    toolSlug: "GOOGLEPHOTOS_UPDATE_ALBUM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Album.",
    ],
  }),
  composioTool({
    name: "googlephotos_update_media_item",
    description: "Updates a media item's description in Google Photos.",
    toolSlug: "GOOGLEPHOTOS_UPDATE_MEDIA_ITEM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Media Item.",
    ],
  }),
  composioTool({
    name: "googlephotos_upload_media",
    description: "Upload a media file to Google Photos. Supports images (up to 200MB) and videos (up to 20GB).",
    toolSlug: "GOOGLEPHOTOS_UPLOAD_MEDIA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "googlephotos",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload Media.",
    ],
  }),
];
