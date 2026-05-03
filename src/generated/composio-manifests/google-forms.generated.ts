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
    integration: "google-forms",
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
      toolkit: "googleforms",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleFormsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googleforms_batch_update_form",
    description: "Applies a batch of update operations to a Google Form in a single atomic transaction. Use when you need to modify form content after creation, including: - Adding, updating, or deleting questions and other items - Modifying form metadata (title, description) - Updating form settings (quiz mode, email collection) - Reorganizing item order within the form All updates in the batch are applied together atomically. If any update fails, the entire batch is rolled back. Use writeControl for optimistic concurrency to ensure updates are applied to the expected form version. Note: The form must have the appropriate sharing settings for the authenticated user to modify it.",
    toolSlug: "GOOGLEFORMS_BATCH_UPDATE_FORM",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-forms",
      "write",
      "batch",
      "forms",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch Update Form.",
    ],
  }),
  composioTool({
    name: "googleforms_create_form",
    description: "Creates a new Google Form with the specified title. This action initializes an empty form that can be later populated with items (questions, sections, images, videos) using the batchUpdate endpoint. When a form is created, it is assigned a unique formId that is required for all subsequent operations on that form. As of June 30, 2026, forms created via API will default to an unpublished state, giving creators control over responder access before making the form publicly available. Use this action when you need to create a new form for collecting information, surveys, quizzes, or feedback. After creation, use the batchUpdate action to add questions and other items to the form.",
    toolSlug: "GOOGLEFORMS_CREATE_FORM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-forms",
      "write",
      "forms",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a Google Form.",
    ],
  }),
  composioTool({
    name: "googleforms_create_watch",
    description: "Creates a watch on a Google Form to receive push notifications via Cloud Pub/Sub when specified events occur. Watches notify via Cloud Pub/Sub when the form or its responses are changed. Each watch has a one-week duration after which it automatically expires and must be renewed. The calling project can have a maximum of 2 watches per form (one for SCHEMA and one for RESPONSES). Use this action when you need to set up real-time notifications for form changes or new submissions. The Pub/Sub topic must be in the same project where the form is located, and the topic must have permissions configured to allow the Forms API to publish messages.",
    toolSlug: "GOOGLEFORMS_CREATE_WATCH",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-forms",
      "write",
      "watches",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Form Watch.",
    ],
  }),
  composioTool({
    name: "googleforms_delete_watch",
    description: "Deletes a watch from a Google Form, stopping push notifications for that watch. Use when you no longer want to receive notifications for a specific watch on a form. This action is irreversible — once deleted, the watch cannot be recovered and notifications will stop immediately. If you need to resume notifications, you must create a new watch using the CreateWatch action.",
    toolSlug: "GOOGLEFORMS_DELETE_WATCH",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-forms",
      "write",
      "watches",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Form Watch.",
    ],
  }),
  composioTool({
    name: "googleforms_get_form",
    description: "Retrieves the complete structure and metadata of a Google Form. Returns the full form definition including its title, description, all items (questions, sections, page breaks, images, videos, and display text), form settings (quiz mode, email collection), publishing state, and output-only fields such as the responder submission URL and revision ID. This action is read-only and does not modify the form. Use this action when you need to read the current configuration of a form, display its structure to users, inspect its settings, or check its publishing state before making updates.",
    toolSlug: "GOOGLEFORMS_GET_FORM",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-forms",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "googleforms_get_response",
    description: "Retrieves a single form response by its unique response ID. Returns complete response data including all answers provided by the respondent, their email (if collected), timestamps, and quiz scores (if applicable). Use this action when you need to fetch detailed information about a specific submission, such as viewing individual submissions, verifying response data, or building response detail views.",
    toolSlug: "GOOGLEFORMS_GET_RESPONSE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-forms",
      "read",
      "responses",
    ],
  }),
  composioTool({
    name: "googleforms_list_responses",
    description: "Lists all responses submitted to a Google Form with optional filtering and pagination. Use this action to retrieve multiple form submissions at once, export response data, or monitor new submissions. Supports filtering by timestamp to fetch only responses submitted after a specific time, which is useful for incremental data synchronization.",
    toolSlug: "GOOGLEFORMS_LIST_RESPONSES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-forms",
      "read",
      "responses",
    ],
  }),
  composioTool({
    name: "googleforms_list_watches",
    description: "Lists all watches owned by the calling project for a specific Google Form. Use this action to discover existing watches, check their status and expiration times, or audit which notifications are configured for a form. Each project can have a maximum of 2 watches per form (one for each event type: SCHEMA and RESPONSES). The SCHEMA event type monitors changes to form content or settings, while RESPONSES monitors new form submissions.",
    toolSlug: "GOOGLEFORMS_LIST_WATCHES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-forms",
      "read",
      "watches",
    ],
  }),
  composioTool({
    name: "googleforms_renew_watch",
    description: "Renews a watch on a Google Form, extending its expiration by one week from the time of renewal. Google Forms watches automatically expire after one week. Use this action to extend a watch before it expires, maintaining continuous push notifications. If a watch has already expired, you must create a new one instead. The renewed watch keeps the same ID, event type, and Pub/Sub topic configuration. Only the expiration time is updated.",
    toolSlug: "GOOGLEFORMS_RENEW_WATCH",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-forms",
      "write",
      "watches",
    ],
    askBefore: [
      "Confirm the parameters before executing Renew Form Watch.",
    ],
  }),
  composioTool({
    name: "googleforms_set_publish_settings",
    description: "Updates the publishing settings of a Google Form, controlling whether the form is published (visible to others) and whether it accepts responses. Use this action to publish a draft form, unpublish a form to prevent access, or toggle response collection on/off without changing the form's visibility. Note that legacy forms created before the publish settings feature was introduced cannot use this endpoint and will return an error.",
    toolSlug: "GOOGLEFORMS_SET_PUBLISH_SETTINGS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-forms",
      "write",
      "publishing",
    ],
    askBefore: [
      "Confirm the parameters before executing Set Form Publish Settings.",
    ],
    idempotent: true,
  }),
];
