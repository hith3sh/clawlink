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
