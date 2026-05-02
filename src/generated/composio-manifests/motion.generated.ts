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
    integration: "motion",
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
      toolkit: "motion",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const motionComposioTools: IntegrationTool[] = [
  composioTool({
    name: "motion_add_custom_field_to_project",
    description: "Tool to add a custom field value to a project in Motion. Use when you need to set or update custom field data on an existing project.",
    toolSlug: "MOTION_ADD_CUSTOM_FIELD_TO_PROJECT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Custom Field to Project.",
    ],
  }),
  composioTool({
    name: "motion_add_custom_field_to_task",
    description: "Tool to add a custom field value to a task in Motion. Use when you need to set or update custom field data on an existing task.",
    toolSlug: "MOTION_ADD_CUSTOM_FIELD_TO_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Custom Field to Task.",
    ],
  }),
  composioTool({
    name: "motion_create_comment",
    description: "Tool to create a new comment on a Motion task. Use when you need to add a comment to an existing task.",
    toolSlug: "MOTION_CREATE_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Comment.",
    ],
  }),
  composioTool({
    name: "motion_create_custom_field",
    description: "Tool to create a new custom field in a Motion workspace. Use when you need to add custom fields like text, select options, dates, or other field types to customize your workspace. For select/multiSelect types, provide options in metadata.",
    toolSlug: "MOTION_CREATE_CUSTOM_FIELD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Custom Field.",
    ],
  }),
  composioTool({
    name: "motion_create_project",
    description: "Tool to create a new project in Motion. Use when you need to create a project within a specific workspace. Projects can have optional due dates, descriptions (HTML supported), labels, and priority levels.",
    toolSlug: "MOTION_CREATE_PROJECT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "projects",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Project.",
    ],
  }),
  composioTool({
    name: "motion_create_recurring_task",
    description: "Tool to create a new recurring task in Motion. Use when you need to set up tasks that repeat on a schedule (daily, weekly, monthly, etc.). Recurring tasks automatically generate task instances based on the specified frequency pattern.",
    toolSlug: "MOTION_CREATE_RECURRING_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "task_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Recurring Task.",
    ],
  }),
  composioTool({
    name: "motion_create_task",
    description: "Tool to create a new task in Motion. Use when you need to add a task to a workspace with specified properties like name, priority, due date, and assignee.",
    toolSlug: "MOTION_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "create",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Task.",
    ],
  }),
  composioTool({
    name: "motion_delete_custom_field",
    description: "Tool to delete a custom field from Motion workspace. Use when you need to remove a custom field that is no longer needed. This operation is permanent and cannot be undone.",
    toolSlug: "MOTION_DELETE_CUSTOM_FIELD",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Custom Field.",
    ],
  }),
  composioTool({
    name: "motion_delete_custom_field_from_project",
    description: "Tool to delete a custom field value from a project in Motion. Use when you need to remove a custom field value from a specific project.",
    toolSlug: "MOTION_DELETE_CUSTOM_FIELD_FROM_PROJECT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Custom Field From Project.",
    ],
  }),
  composioTool({
    name: "motion_delete_custom_field_from_task",
    description: "Tool to delete a custom field value from a task in Motion. Use when you need to remove a custom field value from a specific task by providing the task ID and custom field value ID.",
    toolSlug: "MOTION_DELETE_CUSTOM_FIELD_FROM_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Custom Field From Task.",
    ],
  }),
  composioTool({
    name: "motion_delete_recurring_task",
    description: "Tool to delete a recurring task from Motion based on the ID supplied. Use when you need to remove a recurring task permanently from the system.",
    toolSlug: "MOTION_DELETE_RECURRING_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "tasks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Recurring Task.",
    ],
  }),
  composioTool({
    name: "motion_delete_task",
    description: "Tool to delete a task from Motion based on task ID. Use when you need to permanently remove a task from the Motion workspace.",
    toolSlug: "MOTION_DELETE_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "tasks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Task.",
    ],
  }),
  composioTool({
    name: "motion_get_my_user",
    description: "Tool to get information on the owner of the API key. Use when you need to retrieve the current user's profile details including their ID, name, and email address.",
    toolSlug: "MOTION_GET_MY_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
    ],
  }),
  composioTool({
    name: "motion_get_project",
    description: "Tool to retrieve a single project by its ID. Use when you need to get detailed information about a specific project including its name, description, status, and custom field values.",
    toolSlug: "MOTION_GET_PROJECT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "projects",
    ],
  }),
  composioTool({
    name: "motion_get_task",
    description: "Tool to retrieve a task by its ID from Motion. Returns complete task details including title, description, due date, priority, assignees, scheduling information, and custom fields.",
    toolSlug: "MOTION_GET_TASK",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "task_management",
    ],
  }),
  composioTool({
    name: "motion_list_comments",
    description: "Tool to get all comments on a specific task. Use when you need to retrieve comment history for a task. Supports cursor-based pagination for tasks with many comments.",
    toolSlug: "MOTION_LIST_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "motion_list_custom_fields",
    description: "Tool to retrieve all custom fields for a given Motion workspace. Use when you need to see what custom fields are available in a workspace.",
    toolSlug: "MOTION_LIST_CUSTOM_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "custom_fields",
    ],
  }),
  composioTool({
    name: "motion_list_projects",
    description: "Tool to get all projects for a workspace. Use when you need to retrieve all projects accessible to the API key, optionally filtered by workspace.",
    toolSlug: "MOTION_LIST_PROJECTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "projects",
    ],
  }),
  composioTool({
    name: "motion_list_recurring_tasks",
    description: "Tool to get all recurring tasks for a workspace. Use when you need to retrieve recurring task information from Motion.",
    toolSlug: "MOTION_LIST_RECURRING_TASKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "motion_list_schedules",
    description: "Tool to get a list of schedules for your user. Use when you need to retrieve the user's scheduling configuration including work hours and timezone settings.",
    toolSlug: "MOTION_LIST_SCHEDULES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "schedules",
    ],
  }),
  composioTool({
    name: "motion_list_statuses",
    description: "Tool to get a list of statuses for a Motion workspace. Use when you need to retrieve available task statuses for a workspace.",
    toolSlug: "MOTION_LIST_STATUSES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "statuses",
    ],
  }),
  composioTool({
    name: "motion_list_tasks",
    description: "Tool to get all tasks for a given query with optional filtering. Use when you need to retrieve tasks from Motion, optionally filtered by assignee, project, workspace, status, label, or name.",
    toolSlug: "MOTION_LIST_TASKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "motion_list_users",
    description: "Tool to get a list of users for a given workspace or team. Use when you need to retrieve user information from Motion. Supports pagination via cursor and filtering by workspaceId or teamId.",
    toolSlug: "MOTION_LIST_USERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
    ],
  }),
  composioTool({
    name: "motion_list_workspaces",
    description: "Tool to retrieve all workspaces a user has access to. Use when you need to discover available workspaces, filter for specific workspace IDs, or paginate through workspace results. Returns workspace details including type, team, labels, and statuses.",
    toolSlug: "MOTION_LIST_WORKSPACES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "motion",
      "read",
      "workspace_management",
    ],
  }),
  composioTool({
    name: "motion_move_task",
    description: "Tool to move a task to a different workspace in Motion. Use when you need to relocate a task from one workspace to another.",
    toolSlug: "MOTION_MOVE_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "move",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Task to Workspace.",
    ],
  }),
  composioTool({
    name: "motion_unassign_task",
    description: "Tool to unassign a task from its current assignee. Use when you need to remove the assignee from a task, leaving the task unassigned.",
    toolSlug: "MOTION_UNASSIGN_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "motion",
      "write",
      "task_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unassign Task.",
    ],
  }),
  composioTool({
    name: "motion_update_task",
    description: "Tool to update an existing task in Motion. Use when you need to modify task properties like name, priority, due date, status, or assignee. Only provide the fields you want to update.",
    toolSlug: "MOTION_UPDATE_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "motion",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Task.",
    ],
  }),
];
