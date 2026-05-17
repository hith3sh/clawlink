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
    integration: "google-admin",
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
      toolkit: "google_admin",
      toolSlug: partial.toolSlug,
      version: "20260413_00",
    },
  };
}

export const googleAdminComposioTools: IntegrationTool[] = [
  composioTool({
    name: "google_admin_add_user_alias",
    description: "Adds an email alias to a Google Workspace user.",
    toolSlug: "GOOGLE_ADMIN_ADD_USER_ALIAS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "users",
      "aliases",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Alias to Google Workspace User.",
    ],
  }),
  composioTool({
    name: "google_admin_add_user_to_group",
    description: "Adds a user to a Google Workspace group with the specified role.",
    toolSlug: "GOOGLE_ADMIN_ADD_USER_TO_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "groups",
      "user_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Add User to Google Workspace Group.",
    ],
  }),
  composioTool({
    name: "google_admin_create_group",
    description: "Creates a new Google Workspace group with the specified details.",
    toolSlug: "GOOGLE_ADMIN_CREATE_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "groups",
      "group_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Google Workspace Group.",
    ],
  }),
  composioTool({
    name: "google_admin_create_user",
    description: "Creates a new Google Workspace user with the specified details. Fails if `primary_email` already exists; cannot update existing accounts.",
    toolSlug: "GOOGLE_ADMIN_CREATE_USER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "users",
      "user_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Google Workspace User.",
    ],
  }),
  composioTool({
    name: "google_admin_delete_user",
    description: "Deletes a Google Workspace user permanently. This action cannot be undone.",
    toolSlug: "GOOGLE_ADMIN_DELETE_USER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-admin",
      "write",
      "users",
      "user_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Google Workspace User.",
    ],
  }),
  composioTool({
    name: "google_admin_get_group",
    description: "Retrieves detailed information about a Google Workspace group.",
    toolSlug: "GOOGLE_ADMIN_GET_GROUP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-admin",
      "read",
      "groups",
      "group_management",
    ],
  }),
  composioTool({
    name: "google_admin_get_user",
    description: "Retrieves detailed information about a Google Workspace user.",
    toolSlug: "GOOGLE_ADMIN_GET_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-admin",
      "read",
      "users",
      "user_management",
    ],
  }),
  composioTool({
    name: "google_admin_list_group_members",
    description: "Lists all members of a Google Workspace group with optional filtering and pagination.",
    toolSlug: "GOOGLE_ADMIN_LIST_GROUP_MEMBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-admin",
      "read",
      "groups",
      "group_management",
    ],
  }),
  composioTool({
    name: "google_admin_list_groups",
    description: "Lists Google Workspace groups with optional filtering and pagination.",
    toolSlug: "GOOGLE_ADMIN_LIST_GROUPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-admin",
      "read",
      "groups",
      "group_management",
    ],
  }),
  composioTool({
    name: "google_admin_list_users",
    description: "Lists Google Workspace users with optional filtering and pagination.",
    toolSlug: "GOOGLE_ADMIN_LIST_USERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-admin",
      "read",
      "users",
      "user_management",
    ],
  }),
  composioTool({
    name: "google_admin_remove_user_alias",
    description: "Removes an email alias from a Google Workspace user.",
    toolSlug: "GOOGLE_ADMIN_REMOVE_USER_ALIAS",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-admin",
      "write",
      "users",
      "aliases",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Alias from Google Workspace User.",
    ],
  }),
  composioTool({
    name: "google_admin_remove_user_from_group",
    description: "Removes a user from a Google Workspace group, revoking their group access.",
    toolSlug: "GOOGLE_ADMIN_REMOVE_USER_FROM_GROUP",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-admin",
      "write",
      "groups",
      "user_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove User from Google Workspace Group.",
    ],
  }),
  composioTool({
    name: "google_admin_suspend_user",
    description: "Suspends or unsuspends a Google Workspace user account.",
    toolSlug: "GOOGLE_ADMIN_SUSPEND_USER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "users",
      "user_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Suspend/Unsuspend Google Workspace User.",
    ],
  }),
  composioTool({
    name: "google_admin_update_group_settings",
    description: "Updates settings for a Google Workspace group.",
    toolSlug: "GOOGLE_ADMIN_UPDATE_GROUP_SETTINGS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-admin",
      "write",
      "groups",
      "group_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Google Workspace Group Settings.",
    ],
  }),
];
