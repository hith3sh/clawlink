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
    integration: "tally",
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
      toolkit: "tally",
      toolSlug: partial.toolSlug,
      version: "20260413_00",
    },
  };
}

export const tallyComposioTools: IntegrationTool[] = [
  composioTool({
    name: "tally_create_form",
    description: "Tool to create a new form. Use after preparing block definitions and optional settings.",
    toolSlug: "TALLY_CREATE_FORM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Form.",
    ],
  }),
  composioTool({
    name: "tally_create_webhook",
    description: "Tool to create a new webhook for a form. Use after confirming you have the form ID and the callback URL.",
    toolSlug: "TALLY_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Webhook.",
    ],
  }),
  composioTool({
    name: "tally_delete_form",
    description: "Tool to delete a specific form identified by its ID. Use after confirming the form should be permanently removed.",
    toolSlug: "TALLY_DELETE_FORM",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Form.",
    ],
  }),
  composioTool({
    name: "tally_delete_webhook",
    description: "Tool to delete a specific webhook. Use after confirming the webhook ID.",
    toolSlug: "TALLY_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Webhook.",
    ],
  }),
  composioTool({
    name: "tally_get_form_details",
    description: "Tool to retrieve details of a specific form. Use when you need comprehensive form metadata by ID. Use after confirming the form ID to fetch its full configuration, blocks, and stats.",
    toolSlug: "TALLY_GET_FORM_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_get_form_responses",
    description: "Tool to retrieve the responses of a specific form. Use after confirming the form ID and when paginated data is needed.",
    toolSlug: "TALLY_GET_FORM_RESPONSES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_get_user_info",
    description: "Tool to retrieve information about the authenticated user. Use when you need to confirm account-level details before proceeding. Returns account/workspace context only — not form-level access; follow up with TALLY_LIST_FORMS to verify form access. Confirm the returned workspace and user context match the intended account before creating or modifying resources, as acting on the wrong context places resources in an unintended account. Do not expose sensitive response fields (e.g., tokens) in user-visible output.",
    toolSlug: "TALLY_GET_USER_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_get_webhook_events",
    description: "Tool to list events associated with a specific webhook. Use when you need to inspect delivery history after creating or listing a webhook.",
    toolSlug: "TALLY_GET_WEBHOOK_EVENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_get_workspace",
    description: "Tool to retrieve a single workspace by its ID with associated members. Use when you need to get detailed information about a specific workspace.",
    toolSlug: "TALLY_GET_WORKSPACE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
      "workspaces",
    ],
  }),
  composioTool({
    name: "tally_list_form_questions",
    description: "Tool to retrieve all questions from a specific form. Use when you need to list all questions and their structure after obtaining the form ID.",
    toolSlug: "TALLY_LIST_FORM_QUESTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "tally_list_forms",
    description: "Tool to retrieve a paginated list of forms. Use when you need to list all forms accessible to the authenticated user.",
    toolSlug: "TALLY_LIST_FORMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_list_organization_invites",
    description: "Tool to retrieve all pending invites in your organization. Use when you need to view or manage organization invitation status.",
    toolSlug: "TALLY_LIST_ORGANIZATION_INVITES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "tally_list_organization_users",
    description: "Tool to retrieve all users in an organization. Use when you need to list organization members or check user permissions.",
    toolSlug: "TALLY_LIST_ORGANIZATION_USERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "tally_list_webhooks",
    description: "Tool to retrieve a paginated list of configured webhooks. Use when you need a full listing of webhooks across your accessible forms and workspaces.",
    toolSlug: "TALLY_LIST_WEBHOOKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_list_workspaces",
    description: "Tool to retrieve a paginated list of workspaces. Use when you need to browse workspaces accessible to the authenticated user.",
    toolSlug: "TALLY_LIST_WORKSPACES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tally",
      "read",
    ],
  }),
  composioTool({
    name: "tally_update_form",
    description: "Tool to update form details. Use after confirming the form exists and obtaining its ID.",
    toolSlug: "TALLY_UPDATE_FORM",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Form.",
    ],
  }),
  composioTool({
    name: "tally_update_webhook",
    description: "Tool to update an existing webhook configuration. Use when you need to modify webhook settings such as URL, event types, or enable/disable status.",
    toolSlug: "TALLY_UPDATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tally",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "tally_update_workspace",
    description: "Tool to update the details of a specific workspace identified by its ID. Use when you need to rename a workspace after confirming the workspace ID.",
    toolSlug: "TALLY_UPDATE_WORKSPACE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tally",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Workspace.",
    ],
  }),
];
