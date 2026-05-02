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
    integration: "facebook",
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
      toolkit: "facebook",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const facebookComposioTools: IntegrationTool[] = [
  composioTool({
    name: "facebook_assign_page_task",
    description: "Assigns tasks/roles to a business-scoped user or system user for a specific Facebook Page. Important: This action requires a business-scoped user ID or system user ID from Facebook Business Manager. Regular Facebook user IDs cannot be used. The page must also be managed through Facebook Business Manager for this action to work. Required permissions: business_management, pages_manage_metadata",
    toolSlug: "FACEBOOK_ASSIGN_PAGE_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Assign Page Task.",
    ],
  }),
  composioTool({
    name: "facebook_create_comment",
    description: "Creates a comment on a Facebook post or replies to an existing comment.",
    toolSlug: "FACEBOOK_CREATE_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Comment.",
    ],
  }),
  composioTool({
    name: "facebook_create_photo_album",
    description: "Creates a new photo album on a Facebook Page. Note: This endpoint requires the 'pages_manage_posts' permission or equivalent permissions to be granted to your Facebook application. This action is publicly visible on the Page; confirm with the user before calling.",
    toolSlug: "FACEBOOK_CREATE_PHOTO_ALBUM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Photo Album.",
    ],
  }),
  composioTool({
    name: "facebook_create_photo_post",
    description: "Creates a photo post on a Facebook Page. Requires an image to be provided via either 'url' (publicly accessible image URL) or 'photo' (local image file upload). This action is specifically for posting images with optional captions, not text-only posts. Returns a composite post_id (PageID_PostID); use this for follow-up operations, not the photo/media id alone.",
    toolSlug: "FACEBOOK_CREATE_PHOTO_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Photo Post.",
    ],
  }),
  composioTool({
    name: "facebook_create_post",
    description: "Creates a new text or link post on a Facebook Page. Requires `pages_manage_posts` permission and manage-level Page role on the target Page. For image posts use FACEBOOK_CREATE_PHOTO_POST; for video posts use FACEBOOK_CREATE_VIDEO_POST — media fields are not supported here. Returns a composite post ID in `PageID_PostID` format, required for FACEBOOK_GET_POST retrieval.",
    toolSlug: "FACEBOOK_CREATE_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Post.",
    ],
  }),
  composioTool({
    name: "facebook_create_video_post",
    description: "Creates a video post on a Facebook Page. Requires a Page access token with `pages_manage_posts` scope and manage-level permissions on the target page.",
    toolSlug: "FACEBOOK_CREATE_VIDEO_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Video Post.",
    ],
  }),
  composioTool({
    name: "facebook_delete_comment",
    description: "Deletes a Facebook comment. Requires a Page Access Token with appropriate permissions for comments on Page-owned content. The page_id parameter helps ensure the correct page token is used for authentication.",
    toolSlug: "FACEBOOK_DELETE_COMMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Comment.",
    ],
  }),
  composioTool({
    name: "facebook_delete_post",
    description: "Permanently deletes a Facebook Page post. Deletion is irreversible — deleted posts cannot be recovered. For bulk deletions, keep throughput to ~1 delete/second to avoid Graph API rate limits.",
    toolSlug: "FACEBOOK_DELETE_POST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Post.",
    ],
  }),
  composioTool({
    name: "facebook_get_comment",
    description: "Retrieves details of a specific Facebook comment.",
    toolSlug: "FACEBOOK_GET_COMMENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_comments",
    description: "Retrieves comments from a Facebook post or comment (for replies). This endpoint requires appropriate permissions: - For page-owned posts: A Page Access Token with 'pages_read_engagement' permission - The API automatically swaps user tokens for page tokens when available API Version: Uses v23.0 which was released May 2025.",
    toolSlug: "FACEBOOK_GET_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_conversation_messages",
    description: "Retrieves messages from a specific conversation.",
    toolSlug: "FACEBOOK_GET_CONVERSATION_MESSAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_current_user",
    description: "Validates the access token and retrieves the authenticated user's own profile via /me. Cannot fetch arbitrary users by name or ID.",
    toolSlug: "FACEBOOK_GET_CURRENT_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_message_details",
    description: "Retrieves details of a specific message sent or received by the Page.",
    toolSlug: "FACEBOOK_GET_MESSAGE_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_conversations",
    description: "Retrieves a list of conversations between users and the Page.",
    toolSlug: "FACEBOOK_GET_PAGE_CONVERSATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_details",
    description: "Fetches details about a specific Facebook Page.",
    toolSlug: "FACEBOOK_GET_PAGE_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_insights",
    description: "Retrieves analytics and insights for a Facebook Page. Returns metrics like impressions, page views, fan counts, and engagement data. Empty objects (`{}`) in results indicate missing data, not zero values. High-volume calls risk Graph API rate limits (error codes 4/613).",
    toolSlug: "FACEBOOK_GET_PAGE_INSIGHTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_photos",
    description: "Retrieves photos from a Facebook Page. CDN-based URLs (including `source`) are time-limited and expire; download and persist images promptly if long-term access is needed.",
    toolSlug: "FACEBOOK_GET_PAGE_PHOTOS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_posts",
    description: "Retrieves posts from a Facebook Page. Endpoint choice: Uses /{page_id}/feed instead of /posts or /published_posts because: - /feed returns all content on page timeline (page's posts + visitor posts + tagged posts) - /posts returns only posts created by the page itself - /published_posts returns only published posts by the page (excludes scheduled/unpublished) The /feed endpoint provides the most comprehensive view of page activity. Pagination: follow paging.cursors.after or paging.next across multiple calls until no next cursor exists. Throttling: high-volume pagination can trigger Graph API errors 4 and 613; use backoff between requests. API Version: Uses v23.0 (released May 2025). v20.0 and earlier will be deprecated by Meta. See: https://developers.facebook.com/docs/graph-api/changelog",
    toolSlug: "FACEBOOK_GET_PAGE_POSTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_roles",
    description: "Retrieves a list of people and their tasks/roles on a Facebook Page. The connected account must have management access to the target Page; otherwise the response may be empty or incomplete. Returned role types include MANAGE and CREATE_CONTENT — verify these before calling tools like FACEBOOK_UPDATE_PAGE_SETTINGS. Recently changed roles may take time to propagate; retry if role data appears stale after an update.",
    toolSlug: "FACEBOOK_GET_PAGE_ROLES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_page_tagged_posts",
    description: "Retrieves posts where a Facebook Page is tagged or mentioned. Use when monitoring brand mentions or tracking posts that tag your Page but don't appear on your Page's own feed.",
    toolSlug: "FACEBOOK_GET_PAGE_TAGGED_POSTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
      "page_posts",
    ],
  }),
  composioTool({
    name: "facebook_get_page_videos",
    description: "Retrieves videos from a Facebook Page.",
    toolSlug: "FACEBOOK_GET_PAGE_VIDEOS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_post",
    description: "Retrieves details of a specific Facebook post.",
    toolSlug: "FACEBOOK_GET_POST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_post_insights",
    description: "Retrieves analytics and insights for a specific Facebook post. Returns metrics like impressions, clicks, and engagement data. Very new posts may return empty metric values; allow a short delay before querying and treat absent fields as partial data.",
    toolSlug: "FACEBOOK_GET_POST_INSIGHTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_post_reactions",
    description: "Retrieves reactions (like, love, wow, etc.) for a Facebook post. Very recent posts may return empty or partial reactions data; treat missing fields as incomplete coverage, not an error.",
    toolSlug: "FACEBOOK_GET_POST_REACTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_get_scheduled_posts",
    description: "Retrieves scheduled and unpublished posts for a Facebook Page. Results are cursor-paginated; follow pagination cursors to retrieve all results beyond the limit. When searching for posts near a specific time, filter to a narrow (~±5 minutes) window. Use this tool to check for existing entries before scheduling new posts to avoid duplicates.",
    toolSlug: "FACEBOOK_GET_SCHEDULED_POSTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_like_post_or_comment",
    description: "Adds a LIKE reaction to a Facebook post or comment. Note: Due to API limitations, only LIKE reactions can be added programmatically. This action is user-visible and irreversible — confirm with the user before calling.",
    toolSlug: "FACEBOOK_LIKE_POST_OR_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Reaction.",
    ],
  }),
  composioTool({
    name: "facebook_list_managed_pages",
    description: "Retrieves a list of Facebook Pages that the user manages (not personal profiles), including page details, access tokens, and tasks. Requires `pages_show_list` or `pages_read_engagement` OAuth scopes; missing scopes silently return empty results rather than an error. An empty `data` array means the user manages no Pages. Results are paginated via `paging.cursors`; follow `paging.next` until absent to retrieve all Pages when count exceeds `limit`. Graph API throttling (error codes 4, 17, 613) can occur during pagination — use exponential backoff.",
    toolSlug: "FACEBOOK_LIST_MANAGED_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "facebook",
      "read",
    ],
  }),
  composioTool({
    name: "facebook_mark_message_seen",
    description: "Marks a user's message as seen by the Page, visibly updating the read status in the user's conversation. Note: This action requires an active messaging session with the user. Facebook's messaging policy requires that users have messaged the Page within the last 24 hours for sender actions to work.",
    toolSlug: "FACEBOOK_MARK_MESSAGE_SEEN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Mark Message Seen.",
    ],
  }),
  composioTool({
    name: "facebook_publish_scheduled_post",
    description: "Publishes a previously scheduled or unpublished Facebook post immediately. This action takes a scheduled or unpublished post and publishes it immediately by setting is_published to true. The post must have been previously created with published=false or with a scheduled_publish_time. Requirements: - The post must exist and be in an unpublished/scheduled state - The user must have admin access to the page that owns the post - The app must have pages_manage_posts permission",
    toolSlug: "FACEBOOK_PUBLISH_SCHEDULED_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish Scheduled Post.",
    ],
  }),
  composioTool({
    name: "facebook_remove_page_task",
    description: "Removes a user's tasks/access from a specific Facebook Page. Caller must have admin-level rights on the Page. Operates on one page_id at a time; repeat for each page if removing from multiple pages. Partial access may remain if only some tasks are revoked.",
    toolSlug: "FACEBOOK_REMOVE_PAGE_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Page Task.",
    ],
  }),
  composioTool({
    name: "facebook_reschedule_post",
    description: "Changes the scheduled publish time of an unpublished Facebook post. This action updates the scheduled_publish_time of a previously scheduled post. The post must have been created with published=false and a scheduled_publish_time.",
    toolSlug: "FACEBOOK_RESCHEDULE_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Reschedule Post.",
    ],
  }),
  composioTool({
    name: "facebook_send_media_message",
    description: "Sends a media message (image, video, audio, or file) from the Page to a user.",
    toolSlug: "FACEBOOK_SEND_MEDIA_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Media Message.",
    ],
  }),
  composioTool({
    name: "facebook_send_message",
    description: "Sends a text message from a Facebook Page (not personal profiles) to a user via Messenger. Requires explicit user confirmation before calling, as this action delivers a message to a real end user.",
    toolSlug: "FACEBOOK_SEND_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Message.",
    ],
  }),
  composioTool({
    name: "facebook_toggle_typing_indicator",
    description: "Shows or hides the typing indicator for a user in Messenger.",
    toolSlug: "FACEBOOK_TOGGLE_TYPING_INDICATOR",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Toggle Typing Indicator.",
    ],
  }),
  composioTool({
    name: "facebook_unlike_post_or_comment",
    description: "Removes a like from a Facebook post or comment.",
    toolSlug: "FACEBOOK_UNLIKE_POST_OR_COMMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unlike Post or Comment.",
    ],
  }),
  composioTool({
    name: "facebook_update_comment",
    description: "Updates an existing Facebook comment. IMPORTANT: This action requires a Page Access Token. The comment must belong to a post on a Page that you manage. Use the page_id parameter to ensure the correct page token is used, especially if you manage multiple pages.",
    toolSlug: "FACEBOOK_UPDATE_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Comment.",
    ],
  }),
  composioTool({
    name: "facebook_update_page_settings",
    description: "Updates settings for a specific Facebook Page. Requires the authenticated user to have MANAGE and CREATE_CONTENT tasks for the target page; verify roles via FACEBOOK_GET_PAGE_ROLES. Not all fields (about, description, general_info, etc.) are available for every Page category.",
    toolSlug: "FACEBOOK_UPDATE_PAGE_SETTINGS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Page Settings.",
    ],
  }),
  composioTool({
    name: "facebook_update_post",
    description: "Updates an existing Facebook Page post.",
    toolSlug: "FACEBOOK_UPDATE_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Post.",
    ],
  }),
  composioTool({
    name: "facebook_upload_photos_batch",
    description: "Uploads multiple photo files in batch to a Facebook Page or Album. Uses Facebook's batch API for efficient multi-photo upload. Maximum 50 photos per batch.",
    toolSlug: "FACEBOOK_UPLOAD_PHOTOS_BATCH",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "facebook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload Photos Batch.",
    ],
  }),
];
