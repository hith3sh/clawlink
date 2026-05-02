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
    integration: "kit",
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
      toolkit: "kit",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const kitComposioTools: IntegrationTool[] = [
  composioTool({
    name: "kit_add_subscriber_to_form",
    description: "Add an existing subscriber to a form by their IDs. This action associates a subscriber with a form in Kit. The subscriber must already exist in your Kit account (use KIT_LIST_SUBSCRIBERS to find them). The form must also exist (use KIT_LIST_FORMS to find valid form IDs). Returns HTTP 201 if the subscriber is newly added to the form, or HTTP 200 if they were already associated with the form. Both cases are considered successful operations. Important: This action requires both form_id and subscriber_id (aliased as 'id' in requests). An optional referrer URL can be provided for tracking purposes and will have its UTM parameters automatically parsed.",
    toolSlug: "KIT_ADD_SUBSCRIBER_TO_FORM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Subscriber to Form.",
    ],
  }),
  composioTool({
    name: "kit_add_subscriber_to_form_by_email",
    description: "Tool to add an existing subscriber to a form using their email address. Use when you know the subscriber's email but not their ID. The subscriber must already exist in your Kit account before adding them to a form. Returns HTTP 201 if the subscriber is newly added to the form, or HTTP 200 if they were already associated with the form.",
    toolSlug: "KIT_ADD_SUBSCRIBER_TO_FORM_BY_EMAIL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
      "subscribers",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Subscriber to Form by Email.",
    ],
  }),
  composioTool({
    name: "kit_create_broadcast",
    description: "Tool to create a new broadcast (email campaign) to send to subscribers. Use when you need to draft, schedule, or immediately publish an email broadcast. To save as draft, set send_at to null; to schedule, provide a future send_at timestamp; to publish to web, set public to true.",
    toolSlug: "KIT_CREATE_BROADCAST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
      "broadcasts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Broadcast.",
    ],
  }),
  composioTool({
    name: "kit_create_custom_field",
    description: "Tool to create a new custom field for subscriber data. Use when you need to store extra attributes for subscribers.",
    toolSlug: "KIT_CREATE_CUSTOM_FIELD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Custom Field.",
    ],
  }),
  composioTool({
    name: "kit_create_subscriber",
    description: "Tool to create a new subscriber or update an existing one (upsert). If a subscriber with the provided email address does not exist, creates one. If already exists, updates the first name.",
    toolSlug: "KIT_CREATE_SUBSCRIBER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
      "subscribers",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Subscriber.",
    ],
  }),
  composioTool({
    name: "kit_create_tag",
    description: "Tool to create a new tag in the account. Use when you need a custom label to segment subscribers. Use after confirming tag uniqueness to avoid duplicates. Example: \"Create a tag called 'VIP' for premium customers.\"",
    toolSlug: "KIT_CREATE_TAG",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Tag.",
    ],
  }),
  composioTool({
    name: "kit_create_webhook",
    description: "Creates a webhook subscription for real-time event notifications. Use this to receive HTTP POST notifications when subscriber events (activate, unsubscribe, form subscribe, tag add/remove, link clicks, etc.) or purchase events occur in your Kit account.",
    toolSlug: "KIT_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Webhook.",
    ],
  }),
  composioTool({
    name: "kit_delete_broadcast",
    description: "Tool to delete a specific broadcast. Use when you need to permanently remove a broadcast by ID (after confirming the ID). Example prompt: \"Delete broadcast with ID 123\"",
    toolSlug: "KIT_DELETE_BROADCAST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Broadcast.",
    ],
  }),
  composioTool({
    name: "kit_delete_custom_field",
    description: "Tool to delete a specific custom field. Use after confirming the custom field ID is correct. Deletes the field permanently.",
    toolSlug: "KIT_DELETE_CUSTOM_FIELD",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Custom Field.",
    ],
  }),
  composioTool({
    name: "kit_delete_subscriber",
    description: "Unsubscribe a subscriber from all email communications by their ID. This action permanently unsubscribes a subscriber, removing them from all sequences and forms. The subscriber's historical data is retained but they will no longer receive emails. This operation is idempotent - unsubscribing an already-unsubscribed subscriber succeeds without error. Use KIT_LIST_SUBSCRIBERS to find valid subscriber IDs before calling this action. Returns: Empty response on success (HTTP 204 No Content). Raises: ExecutionFailed: If the subscriber ID doesn't exist (404), authentication fails (401), or other API errors occur.",
    toolSlug: "KIT_DELETE_SUBSCRIBER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Subscriber.",
    ],
  }),
  composioTool({
    name: "kit_delete_tag",
    description: "Tool to delete a tag by ID. Use when you need to remove obsolete or incorrect tags after confirming the tag exists.",
    toolSlug: "KIT_DELETE_TAG",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Tag.",
    ],
  }),
  composioTool({
    name: "kit_delete_webhook",
    description: "Tool to delete a webhook by ID. Use when you want to permanently remove a webhook after confirming its ID.",
    toolSlug: "KIT_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Webhook.",
    ],
  }),
  composioTool({
    name: "kit_filter_subscribers",
    description: "Tool to filter subscribers based on engagement criteria such as email opens, clicks, or delivery status. Use when you need to segment subscribers by their engagement behavior with specific date ranges and count thresholds.",
    toolSlug: "KIT_FILTER_SUBSCRIBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "subscribers",
    ],
  }),
  composioTool({
    name: "kit_get_account",
    description: "Tool to retrieve current account information. Use after validating API key to fetch account ID, plan type, primary email, and timezone details.",
    toolSlug: "KIT_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_account_colors",
    description: "Tool to retrieve list of colors associated with the account. Use after confirming authentication to fetch account-specific color palette.",
    toolSlug: "KIT_GET_ACCOUNT_COLORS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_broadcast",
    description: "Tool to retrieve details of a specific broadcast by ID. Use when you have a valid broadcast ID and need its metadata.",
    toolSlug: "KIT_GET_BROADCAST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_broadcast_clicks",
    description: "Tool to retrieve link click data for a specific broadcast by ID. Use when you need to analyze which links were clicked and their engagement metrics.",
    toolSlug: "KIT_GET_BROADCAST_CLICKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "kit_get_broadcast_stats",
    description: "Tool to retrieve statistics for a specific broadcast by ID. Use after a broadcast has been sent to monitor performance.",
    toolSlug: "KIT_GET_BROADCAST_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_creator_profile",
    description: "Tool to retrieve the creator profile information for the account. Use when you need creator metadata (name, bio, avatar, profile URL) before publishing or customizing content.",
    toolSlug: "KIT_GET_CREATOR_PROFILE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_email_stats",
    description: "Tool to retrieve email statistics for the account. Use after confirming authentication to fetch metrics on emails (sent, opened, clicked) over the last 90 days.",
    toolSlug: "KIT_GET_EMAIL_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_get_growth_stats",
    description: "Tool to retrieve growth statistics for the account over a date range. Stats are returned in your sending time zone (not UTC). Defaults to last 90 days if no dates specified.",
    toolSlug: "KIT_GET_GROWTH_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "kit_get_subscriber",
    description: "Tool to retrieve a specific subscriber by their ID. Use when you need to fetch detailed information about a single subscriber.",
    toolSlug: "KIT_GET_SUBSCRIBER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "subscribers",
    ],
  }),
  composioTool({
    name: "kit_get_subscriber_stats",
    description: "Tool to retrieve email stats for a specific subscriber. Use when you need subscriber engagement metrics (opens, clicks, bounces, rates). Data only available for events from June 2025 onwards.",
    toolSlug: "KIT_GET_SUBSCRIBER_STATS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "kit_list_broadcasts",
    description: "Tool to retrieve a paginated list of all broadcasts. Use when you need to enumerate or review broadcast summaries with cursor-based pagination.",
    toolSlug: "KIT_LIST_BROADCASTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_custom_fields",
    description: "Tool to retrieve a paginated list of custom fields. Use after confirming you need to enumerate or inspect all custom fields with cursor-based pagination.",
    toolSlug: "KIT_LIST_CUSTOM_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_email_templates",
    description: "Retrieve a paginated list of all email templates in the Kit account. Returns template details including ID, name, default status, and category. Supports cursor-based pagination for navigating large template collections. Use this when you need to view or iterate through email templates.",
    toolSlug: "KIT_LIST_EMAIL_TEMPLATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "email_templates",
    ],
  }),
  composioTool({
    name: "kit_list_forms",
    description: "Lists all forms in your Kit account with optional filtering and cursor-based pagination. Use this to retrieve forms when you need to: - Get all available forms (landing pages and embedded forms) - Filter by status (active, archived, trashed) or type (embed, hosted) - Paginate through large collections of forms - Get form IDs and metadata for other operations",
    toolSlug: "KIT_LIST_FORMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_segments",
    description: "Tool to retrieve a paginated list of segments. Use when you need to enumerate segments with cursor-based pagination for further processing or display.",
    toolSlug: "KIT_LIST_SEGMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_sequences",
    description: "Tool to retrieve a paginated list of all sequences. Use when you need to enumerate sequences with pagination for further processing or display.",
    toolSlug: "KIT_LIST_SEQUENCES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_subscribers",
    description: "Tool to retrieve a list of subscribers. Use when you need to fetch subscriber records with optional filtering, sorting, and pagination.",
    toolSlug: "KIT_LIST_SUBSCRIBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_subscribers_for_form",
    description: "Retrieves subscribers for a specific form by ID with optional filtering and cursor-based pagination. Use this action to: - Get all subscribers who have joined a specific form - Filter subscribers by when they were added to the form (added_after/added_before) - Filter subscribers by when they were created (created_after/created_before) - Filter by subscriber status (e.g., 'active') - Navigate through results using cursor-based pagination (after/before cursors) - Control page size with per_page parameter - Optionally get total subscriber count with include_total_count='true' First use KIT_LIST_FORMS to get valid form_id values.",
    toolSlug: "KIT_LIST_SUBSCRIBERS_FOR_FORM",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_tag_subscribers",
    description: "Tool to retrieve subscribers for a specific tag. Use after confirming the tag ID when you need to list subscribers associated with a tag.",
    toolSlug: "KIT_LIST_TAG_SUBSCRIBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_tags",
    description: "Retrieve a paginated list of all tags in the Kit account. Returns tag details including ID, name, and creation date. Supports cursor-based pagination for navigating large tag collections. Use this when you need to view or iterate through tags.",
    toolSlug: "KIT_LIST_TAGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
    ],
  }),
  composioTool({
    name: "kit_list_webhooks",
    description: "Retrieve a paginated list of all webhooks configured in the Kit account. Returns webhook details including ID, event type, and target URL. Supports cursor-based pagination for navigating large webhook collections. Use this when you need to view or iterate through webhooks.",
    toolSlug: "KIT_LIST_WEBHOOKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "kit",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "kit_remove_tag_from_subscriber",
    description: "Tool to remove a tag from a subscriber using their subscriber ID. Use when you need to untag a subscriber from a specific tag after confirming both tag and subscriber IDs exist.",
    toolSlug: "KIT_REMOVE_TAG_FROM_SUBSCRIBER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "kit",
      "write",
      "subscribers",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Tag From Subscriber.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "kit_tag_subscriber",
    description: "Tool to associate a subscriber with a specific tag by ID. Use after confirming tag and subscriber IDs when tagging a subscriber.",
    toolSlug: "KIT_TAG_SUBSCRIBER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Tag Subscriber.",
    ],
  }),
  composioTool({
    name: "kit_tag_subscriber_by_email",
    description: "Assigns a tag to an existing subscriber using their email address. The subscriber must already exist in your Kit account. Returns the subscriber's details including the timestamp when they were tagged. Use when you have a valid tag ID and the subscriber's email address.",
    toolSlug: "KIT_TAG_SUBSCRIBER_BY_EMAIL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Tag Subscriber by Email.",
    ],
  }),
  composioTool({
    name: "kit_untag_subscriber_by_email",
    description: "Tool to remove a tag from a subscriber using their email address. Use when you need to untag an existing subscriber after confirming both the tag ID and subscriber's email address are valid.",
    toolSlug: "KIT_UNTAG_SUBSCRIBER_BY_EMAIL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
      "subscribers",
    ],
    askBefore: [
      "Confirm the parameters before executing Untag Subscriber by Email.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "kit_update_account_colors",
    description: "Tool to update the list of colors for the account. Use when customizing your Kit account's color palette for broadcasts and templates. Maximum 5 hex color codes allowed per account.",
    toolSlug: "KIT_UPDATE_ACCOUNT_COLORS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Account Colors.",
    ],
  }),
  composioTool({
    name: "kit_update_custom_field",
    description: "Tool to update a custom field's label. Use after listing or retrieving custom fields and confirming the field ID to rename.",
    toolSlug: "KIT_UPDATE_CUSTOM_FIELD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Custom Field.",
    ],
  }),
  composioTool({
    name: "kit_update_subscriber",
    description: "Tool to update an existing subscriber's information. Use when you need to modify a subscriber's first name, email address, or custom fields. Supports updating up to 140 custom fields at a time.",
    toolSlug: "KIT_UPDATE_SUBSCRIBER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
      "subscribers",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Subscriber.",
    ],
  }),
  composioTool({
    name: "kit_update_tag",
    description: "Tool to update a tag's name by ID. Use after retrieving tag ID and confirming the new name.",
    toolSlug: "KIT_UPDATE_TAG",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "kit",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Tag.",
    ],
  }),
];
