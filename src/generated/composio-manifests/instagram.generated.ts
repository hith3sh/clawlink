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
    integration: "instagram",
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
      toolkit: "instagram",
      toolSlug: partial.toolSlug,
      version: "20260501_00",
    },
  };
}

export const instagramComposioTools: IntegrationTool[] = [
  composioTool({
    name: "instagram_create_carousel_container",
    description: "Create a draft carousel post with multiple images/videos before publishing. Instagram requires carousels to have between 2 and 10 media items. Container creation_ids expire in under 24 hours, so publish promptly after creation.",
    toolSlug: "INSTAGRAM_CREATE_CAROUSEL_CONTAINER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "content",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Carousel Container.",
    ],
  }),
  composioTool({
    name: "instagram_delete_comment",
    description: "Tool to delete a comment on Instagram media. Use when you need to remove a comment that was created by your Instagram Business or Creator Account. Note: You can only delete comments that your account created - you cannot delete other users' comments unless they are on your own media.",
    toolSlug: "INSTAGRAM_DELETE_COMMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "instagram",
      "write",
      "comments_and_replies",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Comment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instagram_delete_messenger_profile",
    description: "Tool to delete messenger profile settings for an Instagram account. Use when you need to remove ice breakers, persistent menu, greeting messages, or other messaging configuration from the messenger profile.",
    toolSlug: "INSTAGRAM_DELETE_MESSENGER_PROFILE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "instagram",
      "write",
      "messages",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Messenger Profile.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instagram_get_conversation",
    description: "Get details about a specific Instagram DM conversation (participants, etc). Requires a Business or Creator account with Instagram messaging permissions; personal accounts will return permission errors. Newly sent/received messages may take a few seconds to appear in results.",
    toolSlug: "INSTAGRAM_GET_CONVERSATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "conversations",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_comment_replies",
    description: "Get replies to a specific Instagram comment. Returns a list of comment replies with details like text, username, timestamp, and like count. Use when you need to retrieve child comments (replies) for a specific parent comment.",
    toolSlug: "INSTAGRAM_GET_IG_COMMENT_REPLIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "comments_and_replies",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_media",
    description: "Get a published Instagram Media object (photo, video, story, reel, or carousel). Use when you need to retrieve detailed information about a specific Instagram post including engagement metrics, caption, media URLs, and metadata. NOTE: This action is for published media only. For unpublished container IDs (from INSTAGRAM_CREATE_MEDIA_CONTAINER), use INSTAGRAM_GET_POST_STATUS to check status instead.",
    toolSlug: "INSTAGRAM_GET_IG_MEDIA",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "media_retrieval_and_analytics",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_media_children",
    description: "Tool to get media objects (images/videos) that are children of an Instagram carousel/album post. Use when you need to retrieve individual media items from a carousel album post. Note: Carousel children media do not support insights queries - for analytics, query metrics at the parent carousel level.",
    toolSlug: "INSTAGRAM_GET_IG_MEDIA_CHILDREN",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "media_retrieval_and_analytics",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_media_comments",
    description: "Tool to retrieve comments on an Instagram media object. Use when you need to fetch comments from a specific Instagram post, photo, video, or carousel owned by the connected Business/Creator account. Supports cursor-based pagination for navigating through large comment lists. An empty data array in the response indicates the post has no comments and is not an error. Bulk-fetching across many media objects may trigger API rate limits.",
    toolSlug: "INSTAGRAM_GET_IG_MEDIA_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "comments_and_replies",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_media_insights",
    description: "Tool to get insights and metrics for Instagram media objects (photos, videos, reels, carousel albums). Use when you need to retrieve performance data such as views, reach, likes, comments, saves, and shares for specific media. Note: Insights data is only available for media published within the last 2 years, and the account must have at least 1,000 followers. Requires a Business or Creator account; personal Instagram profiles are not supported.",
    toolSlug: "INSTAGRAM_GET_IG_MEDIA_INSIGHTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "media_retrieval_and_analytics",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_user_content_publishing_limit",
    description: "Get an Instagram Business Account's current content publishing usage. Use this to monitor quota usage before publishing; exceeding the daily cap blocks new posts until the quota resets (no partial failure — new publish calls are rejected until reset). IMPORTANT: This endpoint requires an IG User ID (Instagram Business Account ID), NOT an IGSID (Instagram Scoped ID). IGSID is only used for messaging-related endpoints. Content publishing endpoints require a proper IG User ID. Excessive polling of this endpoint may trigger Graph error 613 (rate limit); space calls several seconds apart.",
    toolSlug: "INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "media_publishing_and_limits",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_user_live_media",
    description: "Get live media objects during an active Instagram broadcast. Returns the live video media ID and metadata when a live broadcast is in progress on an Instagram Business or Creator account. Use this to monitor active live streams and access real-time engagement data.",
    toolSlug: "INSTAGRAM_GET_IG_USER_LIVE_MEDIA",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "stories_and_live",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_user_media",
    description: "Get Instagram user's media collection (posts, photos, videos, reels, carousels). Use when you need to retrieve all media published by an Instagram Business or Creator account with support for pagination and time-based filtering.",
    toolSlug: "INSTAGRAM_GET_IG_USER_MEDIA",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "media_retrieval_and_analytics",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_user_stories",
    description: "Get active story media objects for an Instagram Business or Creator account. Stories are retrieved via the /stories endpoint. Returns stories that are currently active within the 24-hour window. Use this to retrieve story content, metadata, and engagement metrics for monitoring or analytics purposes.",
    toolSlug: "INSTAGRAM_GET_IG_USER_STORIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "stories_and_live",
    ],
  }),
  composioTool({
    name: "instagram_get_ig_user_tags",
    description: "Get Instagram media where the user has been tagged by other users. Use when you need to retrieve all media in which an Instagram Business or Creator account has been tagged, including tags in captions, comments, or on the media itself.",
    toolSlug: "INSTAGRAM_GET_IG_USER_TAGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "mentions_and_tags",
    ],
  }),
  composioTool({
    name: "instagram_get_messenger_profile",
    description: "Get the messenger profile settings for an Instagram account. Returns ice breakers and other messaging configuration. Use when you need to retrieve messaging settings, ice breaker questions, or messenger configuration for an Instagram Business account.",
    toolSlug: "INSTAGRAM_GET_MESSENGER_PROFILE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "messaging",
    ],
  }),
  composioTool({
    name: "instagram_get_page_conversations",
    description: "Get Instagram conversations for a Page connected to an Instagram Business account. Use platform=instagram parameter to filter for Instagram conversations only.",
    toolSlug: "INSTAGRAM_GET_PAGE_CONVERSATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "conversations",
    ],
  }),
  composioTool({
    name: "instagram_get_user_info",
    description: "Get Instagram Business Account info including profile details and statistics. IMPORTANT: Only works for Business/Creator accounts you manage through Facebook Business Manager. Cannot query arbitrary public Instagram accounts. Use \"me\" to query your own authenticated account. NOTE: followers_count and follows_count are ONLY available when querying your own profile with ig_user_id=\"me\" - these fields return null for specific user IDs due to Instagram Graph API limitations.",
    toolSlug: "INSTAGRAM_GET_USER_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "stats",
    ],
  }),
  composioTool({
    name: "instagram_get_user_insights",
    description: "Get Instagram account-level insights and analytics (profile views, reach, follower count, etc.). Requires a Business or Creator account; personal accounts are not supported. Returned timestamps are in UTC. metric_type (time_series or total_value): When set to total_value, the API returns a total_value object instead of values. breakdown: Only applicable when metric_type=total_value and only for supported metrics. timeframe: Required for demographics-related metrics and overrides since/until for those metrics.",
    toolSlug: "INSTAGRAM_GET_USER_INSIGHTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "insights",
      "analytics",
    ],
  }),
  composioTool({
    name: "instagram_list_all_conversations",
    description: "List all Instagram DM conversations for the authenticated user. Requires a Business/Creator account with messaging permissions; personal accounts return empty results. Response conversations are nested under `data.data` — accessing top-level `data` as the final list returns zero items. An empty `data` list is a valid non-error outcome meaning no conversations exist in scope.",
    toolSlug: "INSTAGRAM_LIST_ALL_CONVERSATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "conversations",
    ],
  }),
  composioTool({
    name: "instagram_list_all_messages",
    description: "List all messages from a specific Instagram DM conversation. Requires a Business or Creator account with messaging permissions; personal accounts return empty results. Response data is nested under data.data (double-wrapped); attachment-only messages may have empty text fields.",
    toolSlug: "INSTAGRAM_LIST_ALL_MESSAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "instagram",
      "read",
      "messages",
    ],
  }),
  composioTool({
    name: "instagram_mark_seen",
    description: "Mark Instagram DM messages as read/seen for a specific user. Sends a 'mark_seen' sender action to indicate messages from the specified recipient have been read. Marking as seen is visible to the other party and changes inbox read state — use with explicit user approval in automated or bulk flows. IMPORTANT LIMITATIONS: - The sender_action API feature may have limited support on Instagram - The recipient must have an active 24-hour messaging window open - Requires instagram_manage_messages permission - Only works with Instagram Business or Creator accounts If this action fails with a 500 error, it may indicate that the sender_action feature is not supported for your Instagram account or the specific recipient.",
    toolSlug: "INSTAGRAM_MARK_SEEN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Mark Seen.",
    ],
  }),
  composioTool({
    name: "instagram_post_ig_comment_replies",
    description: "Tool to create a reply to an Instagram comment. Use when you need to reply to a specific comment on an Instagram post owned by a Business or Creator account. The reply must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.",
    toolSlug: "INSTAGRAM_POST_IG_COMMENT_REPLIES",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "comments_and_replies",
    ],
    askBefore: [
      "Confirm the parameters before executing Post IG Comment Replies.",
    ],
  }),
  composioTool({
    name: "instagram_post_ig_media_comments",
    description: "Tool to create a comment on an Instagram media object. Use when you need to post a comment on a specific Instagram post, photo, video, or carousel. The comment must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.",
    toolSlug: "INSTAGRAM_POST_IG_MEDIA_COMMENTS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "comments_and_replies",
    ],
    askBefore: [
      "Confirm the parameters before executing Post IG Media Comments.",
    ],
  }),
  composioTool({
    name: "instagram_post_ig_user_media",
    description: "Tool to create a media container for Instagram posts. Use this to create a container for images, videos, Reels, or carousels. This is the first step in Instagram's two-step publishing process - after creating the container, use the media_publish endpoint to publish it.",
    toolSlug: "INSTAGRAM_POST_IG_USER_MEDIA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "media_publishing_and_limits",
    ],
    askBefore: [
      "Confirm the parameters before executing Post IG User Media.",
    ],
  }),
  composioTool({
    name: "instagram_post_ig_user_media_publish",
    description: "Tool to publish a media container to an Instagram Business account. This action automatically waits for the container to finish processing before publishing. Rate limited to 25 API-published posts per 24-hour moving window. The publishing process: 1. First, create a media container using INSTAGRAM_CREATE_MEDIA_CONTAINER 2. Call this action with the creation_id - it will automatically poll for FINISHED status 3. Once ready, the media is published and the published media ID is returned For videos/reels, processing may take 30-120 seconds. Images are typically instant.",
    toolSlug: "INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "media_publishing_and_limits",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish IG User Media.",
    ],
  }),
  composioTool({
    name: "instagram_post_ig_user_mentions",
    description: "Tool to reply to a mention of your Instagram Business or Creator account. Use when you need to respond to comments or media captions where your account has been @mentioned by another Instagram user. This creates a comment on the media or comment containing the mention.",
    toolSlug: "INSTAGRAM_POST_IG_USER_MENTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "mentions_and_tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Reply to IG User Mentions.",
    ],
  }),
  composioTool({
    name: "instagram_send_image",
    description: "Send an image via Instagram DM to a specific user. Each send modifies inbox state; avoid bulk or automated sends without explicit user approval.",
    toolSlug: "INSTAGRAM_SEND_IMAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Image.",
    ],
  }),
  composioTool({
    name: "instagram_send_text_message",
    description: "Send a text message to an Instagram user via DM in an existing conversation. Cannot initiate new DM threads — a prior conversation must exist. Requires an Instagram Business or Creator account with messaging permissions. Fails with error_subcode 2534022 if outside the messaging window; do not retry these failures.",
    toolSlug: "INSTAGRAM_SEND_TEXT_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Text Message.",
    ],
  }),
  composioTool({
    name: "instagram_update_messenger_profile",
    description: "Tool to update the messenger profile settings for an Instagram account. Use when you need to configure ice breakers and messaging options. Ice breakers are suggested questions that help users start conversations with your Instagram Business account.",
    toolSlug: "INSTAGRAM_UPDATE_MESSENGER_PROFILE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "instagram",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Messenger Profile.",
    ],
  }),
];
