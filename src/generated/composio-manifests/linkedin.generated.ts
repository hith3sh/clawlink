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
    integration: "linkedin",
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
      toolkit: "linkedin",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const linkedinComposioTools: IntegrationTool[] = [
  composioTool({
    name: "linkedin_create_article_or_url_share",
    description: "Tool to create an article or URL share on LinkedIn using the UGC Posts API. Use when you need to share a link with optional commentary on LinkedIn. Supports sharing URLs as articles with customizable visibility settings.",
    toolSlug: "LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linkedin",
      "write",
      "ugc_posts_creation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create article or URL share.",
    ],
  }),
  composioTool({
    name: "linkedin_create_comment_on_post",
    description: "Tool to create a first-level or nested comment on a LinkedIn share, UGC post, or parent comment via the Social Actions Comments API. Use when you need to engage with posts by adding comments or replying to existing comments. Supports text comments with optional @-mentions and image attachments.",
    toolSlug: "LINKEDIN_CREATE_COMMENT_ON_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linkedin",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create comment on LinkedIn post.",
    ],
  }),
  composioTool({
    name: "linkedin_create_linked_in_post",
    description: "Creates a new post on LinkedIn for the authenticated user or an organization they manage. Requires w_member_social scope for posting as a person, and w_organization_social scope for posting as an organization (with ADMINISTRATOR, DIRECT_SPONSORED_CONTENT_POSTER, or CONTENT_ADMIN role).",
    toolSlug: "LINKEDIN_CREATE_LINKED_IN_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linkedin",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a LinkedIn post.",
    ],
  }),
  composioTool({
    name: "linkedin_delete_linked_in_post",
    description: "Deletes a specific LinkedIn post (share) by its unique `share_id`, which must correspond to an existing share.",
    toolSlug: "LINKEDIN_DELETE_LINKED_IN_POST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linkedin",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete LinkedIn Post.",
    ],
  }),
  composioTool({
    name: "linkedin_delete_post",
    description: "Delete a LinkedIn post using the Posts API REST endpoint. Supports both ugcPost and share URN formats. The endpoint is idempotent - previously deleted posts return success (204).",
    toolSlug: "LINKEDIN_DELETE_POST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linkedin",
      "write",
      "ugc_posts_deletion",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Post.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "linkedin_delete_ugc_post",
    description: "Delete a UGC post using the legacy UGC Post API endpoint. Use when you need to delete a post using the v2/ugcPosts endpoint. Deletion is idempotent - previously deleted posts also return success.",
    toolSlug: "LINKEDIN_DELETE_UGC_POST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linkedin",
      "write",
      "ugc_posts_deletion",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete UGC Post (Legacy).",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "linkedin_get_ad_targeting_facets",
    description: "Tool to retrieve available ad targeting facets from LinkedIn Marketing API. Use when you need to discover what targeting options are available for ad campaigns (e.g., locations, industries, job functions).",
    toolSlug: "LINKEDIN_GET_AD_TARGETING_FACETS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "advertising",
    ],
  }),
  composioTool({
    name: "linkedin_get_audience_counts",
    description: "Retrieves audience size counts for specified targeting criteria. Use when estimating reach for LinkedIn ad campaigns or targeted content.",
    toolSlug: "LINKEDIN_GET_AUDIENCE_COUNTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "advertising",
    ],
  }),
  composioTool({
    name: "linkedin_get_company_info",
    description: "Retrieves organizations where the authenticated user has specific roles (ACLs), to determine their management or content posting capabilities for LinkedIn company pages.",
    toolSlug: "LINKEDIN_GET_COMPANY_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
    ],
  }),
  composioTool({
    name: "linkedin_get_image",
    description: "Tool to retrieve details of a LinkedIn image using its URN. Use when you need to check image status, get download URLs, or access image metadata for a single image.",
    toolSlug: "LINKEDIN_GET_IMAGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "media_retrieval",
    ],
  }),
  composioTool({
    name: "linkedin_get_images",
    description: "Tool to retrieve image metadata including download URLs, status, and dimensions from LinkedIn's Images API. Use when you need to access image details for posts, profiles, or media library assets.",
    toolSlug: "LINKEDIN_GET_IMAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "media_retrieval",
    ],
  }),
  composioTool({
    name: "linkedin_get_my_info",
    description: "Fetches the authenticated LinkedIn user's profile information including name, headline, profile picture, and other profile details.",
    toolSlug: "LINKEDIN_GET_MY_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
    ],
  }),
  composioTool({
    name: "linkedin_get_network_size",
    description: "Tool to retrieve the follower count for a LinkedIn organization. Use when you need to get the number of members following a specific company or organization on LinkedIn.",
    toolSlug: "LINKEDIN_GET_NETWORK_SIZE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "linkedin_get_org_page_stats",
    description: "Tool to retrieve page statistics for a LinkedIn organization page. Use when you need engagement metrics like page views and custom button clicks. Supports both lifetime statistics (all-time data segmented by demographics) and time-bound statistics (aggregate data for specific time ranges). Requires rw_organization_admin permission with ADMINISTRATOR role for the organization.",
    toolSlug: "LINKEDIN_GET_ORG_PAGE_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "linkedin_get_person",
    description: "Retrieves a LinkedIn member's profile information by their person ID. Returns lite profile fields (name, profile picture) by default, or basic profile fields (including headline and vanity name) with appropriate permissions.",
    toolSlug: "LINKEDIN_GET_PERSON",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "content_retrieval",
    ],
  }),
  composioTool({
    name: "linkedin_get_post_content",
    description: "Tool to retrieve detailed post content including text, images, videos, and metadata from LinkedIn by post URN. Use when you need to fetch the full content and details of a specific LinkedIn post.",
    toolSlug: "LINKEDIN_GET_POST_CONTENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "content_retrieval",
    ],
  }),
  composioTool({
    name: "linkedin_get_share_stats",
    description: "Retrieves share statistics for a LinkedIn organization, including impressions, clicks, likes, comments, and shares. Use to analyze content performance for an organization page. Optionally filter by time intervals to get time-bound statistics.",
    toolSlug: "LINKEDIN_GET_SHARE_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "linkedin_get_videos",
    description: "Retrieves video metadata from LinkedIn Marketing API. Supports single video retrieval, batch retrieval (multiple videos), and finding videos by associated account with pagination. Use when you need to get video details including duration, dimensions, status, download URLs, and media library information.",
    toolSlug: "LINKEDIN_GET_VIDEOS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "media_retrieval",
    ],
  }),
  composioTool({
    name: "linkedin_initialize_image_upload",
    description: "Tool to initialize an image upload to LinkedIn and return a presigned upload URL plus the resulting image URN. Use when you need to prepare an image upload for LinkedIn posts. After calling this tool, upload the image bytes to the returned upload_url via PUT request, then use the image URN in CREATE_LINKED_IN_POST action.",
    toolSlug: "LINKEDIN_INITIALIZE_IMAGE_UPLOAD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linkedin",
      "write",
      "media_upload",
    ],
    askBefore: [
      "Confirm the parameters before executing Initialize image upload.",
    ],
  }),
  composioTool({
    name: "linkedin_list_reactions",
    description: "Retrieves reactions (likes, celebrations, etc.) on a LinkedIn entity such as a share, post, or comment. Use when you need to see who reacted to content and what type of reactions were used.",
    toolSlug: "LINKEDIN_LIST_REACTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "linkedin_register_image_upload",
    description: "Tool to initialize a native LinkedIn image upload for feed shares and return a presigned upload URL plus the resulting digital media asset URN. Use when you need to upload an image to attach to a LinkedIn post. After calling this tool, upload the image bytes to the returned upload_url, then use the asset_urn in LINKEDIN_CREATE_LINKED_IN_POST.",
    toolSlug: "LINKEDIN_REGISTER_IMAGE_UPLOAD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linkedin",
      "write",
      "media_upload",
    ],
    askBefore: [
      "Confirm the parameters before executing Register image upload.",
    ],
  }),
  composioTool({
    name: "linkedin_search_ad_targeting_entities",
    description: "Search for ad targeting entities using typeahead search. Use when you need to find targeting entities like geographic locations, job titles, industries, or other targeting criteria for LinkedIn ad campaigns.",
    toolSlug: "LINKEDIN_SEARCH_AD_TARGETING_ENTITIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linkedin",
      "read",
      "advertising",
    ],
  }),
];
