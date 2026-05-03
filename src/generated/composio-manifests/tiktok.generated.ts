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
    integration: "tiktok",
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
      toolkit: "tiktok",
      toolSlug: partial.toolSlug,
      version: "20260413_00",
    },
  };
}

export const tiktokComposioTools: IntegrationTool[] = [
  composioTool({
    name: "tiktok_fetch_publish_status",
    description: "Check the processing status of a TikTok video or photo post using its publish_id. Use this action to poll the status of content after initiating an upload or post. The API returns detailed information about processing stages (upload, download, moderation) and any errors that occurred. Non-terminal statuses mean processing is still pending — never re-initiate TIKTOK_PUBLISH_VIDEO for the same publish_id. Use exponential backoff when polling (e.g., 5s→10s→20s) to avoid the 30 requests/minute per access token rate limit.",
    toolSlug: "TIKTOK_FETCH_PUBLISH_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
    ],
  }),
  composioTool({
    name: "tiktok_get_action_categories",
    description: "Tool to retrieve available action categories from TikTok Marketing API. Use when you need to get the list of conversion event categories for creating or managing TikTok ad campaigns with conversion tracking.",
    toolSlug: "TIKTOK_GET_ACTION_CATEGORIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
      "categories",
      "advertising",
    ],
  }),
  composioTool({
    name: "tiktok_get_term",
    description: "Tool to retrieve terms from TikTok Business API. Use when you need to fetch advertiser or agency terms for a specific advertiser ID.",
    toolSlug: "TIKTOK_GET_TERM",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
      "advertising",
    ],
  }),
  composioTool({
    name: "tiktok_get_user_stats",
    description: "Fetches TikTok user information and statistics for the authenticated user. Retrieves user stats (follower_count, following_count, likes_count, video_count) and can optionally fetch profile fields (display_name, username, bio_description, etc.) and basic info (open_id, union_id, avatar URLs). Returns only the fields requested in the fields parameter. Only works for the authenticated account; cannot fetch arbitrary public profiles. Stats may be delayed and not reflect the most recent activity.",
    toolSlug: "TIKTOK_GET_USER_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
    ],
  }),
  composioTool({
    name: "tiktok_list_gmv_max_occupied_custom_shop_ads",
    description: "Tool to get GMV Max occupied custom shop ads list for a TikTok advertiser. Use this action when you need to retrieve information about which custom shop ads are currently occupied for GMV Max campaigns. This is part of the TikTok Business API and requires appropriate advertiser access.",
    toolSlug: "TIKTOK_LIST_GMV_MAX_OCCUPIED_CUSTOM_SHOP_ADS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
      "advertising",
    ],
  }),
  composioTool({
    name: "tiktok_list_videos",
    description: "Lists videos for the authenticated user (or specified creator). Does not provide a global TikTok-wide feed.",
    toolSlug: "TIKTOK_LIST_VIDEOS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tiktok",
      "read",
    ],
  }),
  composioTool({
    name: "tiktok_post_photo",
    description: "Create a photo post (1-35 images) on TikTok via Content Posting API. Supports two modes: - MEDIA_UPLOAD: Uploads photos to user's inbox for review/editing before posting - DIRECT_POST: Immediately posts photos to user's TikTok account IMPORTANT: Photo URLs must be from your TikTok-verified domain. Unverified domains will return 403 Forbidden. Unaudited apps can only post with privacy='SELF_ONLY'. Rate limit: 6 requests per minute per user access token. Reference: https://developers.tiktok.com/doc/content-posting-api-reference-photo-post",
    toolSlug: "TIKTOK_POST_PHOTO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tiktok",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Post photo.",
    ],
  }),
  composioTool({
    name: "tiktok_publish_video",
    description: "Publishes a video to TikTok by pulling it from a public URL. TikTok downloads the video from the provided URL and publishes it directly to the creator's profile. Publishing is asynchronous — after calling this action, poll TIKTOK_FETCH_PUBLISH_STATUS with the returned publish_id to check completion. For uploading video files instead of URLs, use TIKTOK_UPLOAD_VIDEO.",
    toolSlug: "TIKTOK_PUBLISH_VIDEO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tiktok",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish video.",
    ],
  }),
  composioTool({
    name: "tiktok_upload_video",
    description: "Uploads a video to TikTok via the Content Posting API (init + single-part upload). This action initializes an upload session to obtain a presigned upload URL, then uploads the entire file with a single PUT request. Use a subsequent action to publish the post. Ensure the video file is fully generated and available before calling this action.",
    toolSlug: "TIKTOK_UPLOAD_VIDEO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tiktok",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload video.",
    ],
  }),
  composioTool({
    name: "tiktok_upload_videos",
    description: "Uploads multiple videos to TikTok concurrently (init + single-part upload per file).",
    toolSlug: "TIKTOK_UPLOAD_VIDEOS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tiktok",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload videos (batch).",
    ],
  }),
];
