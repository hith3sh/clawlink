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
    integration: "reddit",
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
      toolkit: "reddit",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const redditComposioTools: IntegrationTool[] = [
  composioTool({
    name: "reddit_create_reddit_post",
    description: "Creates a new text or link post on a specified, existing Reddit subreddit, optionally applying a flair. Immediately publishes publicly visible content — confirm subreddit, title, and body with the user before executing. Posts may be silently removed post-submission by automoderator or subreddit rules (errors: SUBMIT_VALIDATION_BODY_BLACKLISTED_STRING, POST_GUIDANCE_VALIDATION_FAILED); verify visibility via the returned permalink. Rapid consecutive calls trigger RATELIMIT errors with cooldown hints.",
    toolSlug: "REDDIT_CREATE_REDDIT_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "reddit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a Reddit post.",
    ],
  }),
  composioTool({
    name: "reddit_delete_reddit_comment",
    description: "Deletes a Reddit comment, identified by its fullname ID, if it was authored by the authenticated user. Deletion is permanent and irreversible.",
    toolSlug: "REDDIT_DELETE_REDDIT_COMMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "reddit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Reddit comment.",
    ],
  }),
  composioTool({
    name: "reddit_delete_reddit_post",
    description: "Permanently and irreversibly deletes a Reddit post by its ID. Confirm with the user before calling. Only works on posts authored by the authenticated account; attempting to delete another user's post will fail.",
    toolSlug: "REDDIT_DELETE_REDDIT_POST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "reddit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete a Reddit post.",
    ],
  }),
  composioTool({
    name: "reddit_edit_reddit_comment_or_post",
    description: "Edits the body text of the authenticated user's own existing comment or self-post on Reddit; cannot edit link posts or titles.",
    toolSlug: "REDDIT_EDIT_REDDIT_COMMENT_OR_POST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "reddit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit comment or post.",
    ],
  }),
  composioTool({
    name: "reddit_get",
    description: "Tool to retrieve a listing of Reddit posts sorted by the specified criteria (hot, new, top, etc.). Use when you need to get posts from the Reddit front page or all of Reddit with a specific sort order. Supports pagination and time filtering for top/controversial sorts.",
    toolSlug: "REDDIT_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "browsing_and_discovery",
    ],
  }),
  composioTool({
    name: "reddit_get_controversial_posts",
    description: "Tool to retrieve controversial posts from all subreddits with time filters. Use when you need to find the most controversial posts across Reddit from a specific time period (hour, day, week, month, year, or all-time). Returns a paginated listing of posts ranked by controversy within the specified time frame.",
    toolSlug: "REDDIT_GET_CONTROVERSIAL_POSTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "browsing_and_discovery",
    ],
  }),
  composioTool({
    name: "reddit_get_me_prefs",
    description: "Tool to retrieve preference settings of the logged in user. Use when you need to check user preferences or settings.",
    toolSlug: "REDDIT_GET_ME_PREFS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "user_accounts_and_profiles",
    ],
  }),
  composioTool({
    name: "reddit_get_r_top",
    description: "Tool to retrieve top-rated posts from a subreddit with time filters. Use when you need to find the most popular posts from a specific time period (hour, day, week, month, year, or all-time). Returns a paginated listing of posts ranked by score within the specified time frame.",
    toolSlug: "REDDIT_GET_R_TOP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "browsing_and_discovery",
    ],
  }),
  composioTool({
    name: "reddit_get_random",
    description: "Tool to retrieve a random public Reddit post from any subreddit. Use when you want to discover serendipitous content or need a random post for testing or entertainment purposes.",
    toolSlug: "REDDIT_GET_RANDOM",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "browsing_and_discovery",
    ],
  }),
  composioTool({
    name: "reddit_get_reddit_user_about",
    description: "Retrieves information about a specified Reddit user account, including karma scores and gold status. Use when you need to get profile information for any public Reddit user.",
    toolSlug: "REDDIT_GET_REDDIT_USER_ABOUT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "user_accounts_and_profiles",
    ],
  }),
  composioTool({
    name: "reddit_get_scopes",
    description: "Tool to retrieve all available OAuth scopes supported by the Reddit API. Use when you need to understand what permissions are available or check scope definitions.",
    toolSlug: "REDDIT_GET_SCOPES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "authentication_and_authorization",
    ],
  }),
  composioTool({
    name: "reddit_get_subreddit_rules",
    description: "Fetch the explicit posting rules for a subreddit to ensure compliance before posting or commenting. Use when you need to verify content meets community guidelines or explain subreddit requirements to users.",
    toolSlug: "REDDIT_GET_SUBREDDIT_RULES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_get_subreddits_search",
    description: "Tool to search subreddits by title and description. Use when you need to find subreddits matching a specific topic or keyword. Returns a paginated listing of subreddits with their details including subscribers, descriptions, and other metadata.",
    toolSlug: "REDDIT_GET_SUBREDDITS_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "browsing_and_discovery",
    ],
  }),
  composioTool({
    name: "reddit_get_user_flair",
    description: "Fetches the list of user flair assignments for a given subreddit. Returns paginated results with user flair details. Returned flair_id values are scoped to the specific subreddit and must not be reused across different subreddits.",
    toolSlug: "REDDIT_GET_USER_FLAIR",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_get_username_available",
    description: "Tool to check whether a username is available for registration on Reddit. Use when you need to verify if a username can be used to create a new account.",
    toolSlug: "REDDIT_GET_USERNAME_AVAILABLE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
      "user_accounts_and_profiles",
    ],
  }),
  composioTool({
    name: "reddit_list_subreddit_post_flairs",
    description: "List available link/post flairs for a subreddit (including flair_template_id) so posts can satisfy flair-required validation. Use when you need to discover valid flair IDs before creating a post in a subreddit that requires flair. Note: Reddit may return empty or deny access if the authenticated user cannot set link flair and is not a moderator.",
    toolSlug: "REDDIT_LIST_SUBREDDIT_POST_FLAIRS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_post_reddit_comment",
    description: "Posts a comment on Reddit, replying to an existing submission (post) or another comment. Fails if the target thread is locked, archived, or restricted — verify thread state beforehand. Rapid successive calls trigger Reddit RATELIMIT errors with explicit cooldown hints (e.g., 'take a break for 9 minutes'); honor the specified wait before retrying. A successful API response does not guarantee public visibility — automod or spam filters may silently remove the comment. Publishes immediately and publicly; confirm target and text before executing.",
    toolSlug: "REDDIT_POST_REDDIT_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "reddit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Post a comment.",
    ],
  }),
  composioTool({
    name: "reddit_retrieve_post_comments",
    description: "Retrieves all comments for a Reddit post given its base-36 article ID. Response is a two-element listings array: post metadata in `listings[0]`; comments in `listings[1].data.children` with text at each `[].data.body` and nested replies under each comment's `replies` field. Replies require recursive traversal to capture full discussion. Large, locked, or archived threads may return truncated trees or `more` placeholders rather than full results. Filter out comments where `body` is `[deleted]` or `[removed]`; use `parent_id` to reconstruct conversation flow. No time-filter parameter — compare `created_utc` against a UTC cutoff to filter by date.",
    toolSlug: "REDDIT_RETRIEVE_POST_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_retrieve_reddit_post",
    description: "Retrieves posts from a specified, publicly accessible subreddit. Responses nest post data under `data.children[].data`; inspect the structure before parsing. Pagination uses a `data.after` cursor; deduplicate across pages by post `id`. No built-in date filtering; compare `created_utc` (Unix seconds, UTC) client-side. Rate limit: ~1–2 requests/second; back off on HTTP 429.",
    toolSlug: "REDDIT_RETRIEVE_REDDIT_POST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_retrieve_specific_comment",
    description: "Retrieves detailed information for a single Reddit comment or post using its fullname. Returns only the specified item, not surrounding thread context; use REDDIT_RETRIEVE_POST_COMMENTS for full discussion retrieval. Deleted, removed, or quarantined items may return empty or partial payloads.",
    toolSlug: "REDDIT_RETRIEVE_SPECIFIC_COMMENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_search_across_subreddits",
    description: "Searches Reddit for posts/comments using a query. Results nested under `data.children[i].data` (kind `t3` for posts); a `posts` array may also appear — inspect actual response path. No native time-range filter; compare `created_utc` (Unix epoch, UTC) client-side for recency filtering. Empty `children` is a valid no-results outcome. Key post fields: `score`, `num_comments`, `created_utc`, `permalink`. Rate limit: ~1–2 requests/sec; HTTP 429 indicates throttling.",
    toolSlug: "REDDIT_SEARCH_ACROSS_SUBREDDITS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "reddit",
      "read",
    ],
  }),
  composioTool({
    name: "reddit_toggle_inbox_replies",
    description: "Enable or disable inbox replies for a submission or comment. Use when you want to control whether you receive inbox notifications for replies to your own posts or comments.",
    toolSlug: "REDDIT_TOGGLE_INBOX_REPLIES",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "reddit",
      "write",
      "comments_and_replies",
    ],
    askBefore: [
      "Confirm the parameters before executing Enable or disable inbox replies.",
    ],
  }),
];
