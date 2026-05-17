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
    integration: "jotform",
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
      toolkit: "jotform",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const jotformComposioTools: IntegrationTool[] = [
  composioTool({
    name: "jotform_clone_form",
    description: "Tool to clone a single form in Jotform. Creates a complete copy of the form with all its questions and settings. Use when you need to duplicate an existing form.",
    toolSlug: "JOTFORM_CLONE_FORM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "jotform",
      "write",
      "forms",
    ],
    askBefore: [
      "Confirm the parameters before executing Clone Form.",
    ],
  }),
  composioTool({
    name: "jotform_create_label",
    description: "Tool to create a new label for organizing forms in Jotform. Use when you need to categorize or group forms with a named label.",
    toolSlug: "JOTFORM_CREATE_LABEL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "jotform",
      "write",
      "labels",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Label.",
    ],
  }),
  composioTool({
    name: "jotform_delete_label",
    description: "Tool to delete a label along with all its sublabels. Use when you need to remove a label from the account.",
    toolSlug: "JOTFORM_DELETE_LABEL",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "jotform",
      "write",
      "labels",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Label.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "jotform_get_label",
    description: "Tool to retrieve details of a label by its ID, including name and color. Use when you need to fetch information about a specific label.",
    toolSlug: "JOTFORM_GET_LABEL",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "labels",
    ],
  }),
  composioTool({
    name: "jotform_get_label_resources",
    description: "Tool to get a list of assets (forms) in a label and their associated information. Use when you need to retrieve forms organized under a specific label.",
    toolSlug: "JOTFORM_GET_LABEL_RESOURCES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "labels",
    ],
  }),
  composioTool({
    name: "jotform_get_system_plan",
    description: "Tool to retrieve details of a specific system plan. Use when you need to check limits and pricing of a plan.",
    toolSlug: "JOTFORM_GET_SYSTEM_PLAN",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_details",
    description: "Tool to retrieve details of the authenticated user, including account and usage info. Use after confirming valid API key.",
    toolSlug: "JOTFORM_GET_USER_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_folders",
    description: "Tool to retrieve a list of labels (folders replacement) for the authenticated user. Uses the GET /user/labels endpoint per Jotform's migration from folders to labels.",
    toolSlug: "JOTFORM_GET_USER_FOLDERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_forms",
    description: "Tool to retrieve a list of forms created by the authenticated user. Use after setting up API key authentication.",
    toolSlug: "JOTFORM_GET_USER_FORMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_history",
    description: "Tool to fetch user activity history records. Use when auditing or filtering user actions by type or date.",
    toolSlug: "JOTFORM_GET_USER_HISTORY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_reports",
    description: "Tool to retrieve list of report URLs for all forms in the account. Includes Excel, CSV, printable charts, and embeddable HTML tables.",
    toolSlug: "JOTFORM_GET_USER_REPORTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "jotform_get_user_settings",
    description: "Tool to retrieve the settings of the authenticated user. Use after confirming a valid API key.",
    toolSlug: "JOTFORM_GET_USER_SETTINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
    ],
  }),
  composioTool({
    name: "jotform_get_user_settings_by_key",
    description: "Tool to retrieve a specific user setting by key. Use when you need a single setting value like email, timezone, language, or website.",
    toolSlug: "JOTFORM_GET_USER_SETTINGS_BY_KEY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "user_settings",
    ],
  }),
  composioTool({
    name: "jotform_get_user_submissions",
    description: "Tool to retrieve all submissions for all forms on the account. The answers dictionary contains submission data with question IDs as keys. Use when you need to access submission data across multiple forms.",
    toolSlug: "JOTFORM_GET_USER_SUBMISSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "submissions",
    ],
  }),
  composioTool({
    name: "jotform_get_user_usage",
    description: "Tool to retrieve monthly usage statistics for the authenticated user. Use to check form submissions, payment forms, SSL submissions, and storage used.",
    toolSlug: "JOTFORM_GET_USER_USAGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "jotform",
      "read",
      "usage",
    ],
  }),
  composioTool({
    name: "jotform_remove_label_resources",
    description: "Tool to remove specified resources (forms) from a label by their IDs and types. Use when you need to unassign forms from a specific label.",
    toolSlug: "JOTFORM_REMOVE_LABEL_RESOURCES",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "jotform",
      "write",
      "labels",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Resources from Label.",
    ],
  }),
  composioTool({
    name: "jotform_update_label",
    description: "Tool to update an existing label with new name or color settings. Use when you need to modify label properties.",
    toolSlug: "JOTFORM_UPDATE_LABEL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "jotform",
      "write",
      "labels",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Label.",
    ],
  }),
  composioTool({
    name: "jotform_update_user_settings",
    description: "Tool to update user's settings like time zone, language, email, and website. Use when you need to modify user account settings.",
    toolSlug: "JOTFORM_UPDATE_USER_SETTINGS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "jotform",
      "write",
      "user_settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Update User Settings.",
    ],
  }),
];
