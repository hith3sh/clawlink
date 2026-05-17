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
    integration: "google-tasks",
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
      toolkit: "googletasks",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleTasksComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googletasks_batch_execute",
    description: "Executes multiple Google Tasks API operations in a single HTTP batch request and returns structured per-item results. Use this to reduce LLM tool invocations when performing bulk operations like updating many tasks, moving tasks, or deleting multiple items. Note: Each sub-request still counts toward API quota; batching primarily reduces HTTP overhead and tool call count.",
    toolSlug: "GOOGLETASKS_BATCH_EXECUTE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch Execute Google Tasks Operations.",
    ],
  }),
  composioTool({
    name: "googletasks_clear_tasks",
    description: "Permanently and irreversibly clears all completed tasks from a specified Google Tasks list; this action is destructive, idempotent, and cannot be undone. Always require explicit user confirmation before invoking.",
    toolSlug: "GOOGLETASKS_CLEAR_TASKS",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Clear tasks.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googletasks_create_task_list",
    description: "Creates a new task list with the specified title and returns a tasklist_id. Use the returned tasklist_id (not the title) when calling GOOGLETASKS_INSERT_TASK or other task operations. Duplicate titles are permitted by the API, so verify existing lists before creating to avoid unintended duplicates.",
    toolSlug: "GOOGLETASKS_CREATE_TASK_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a task list.",
    ],
  }),
  composioTool({
    name: "googletasks_delete_task",
    description: "Deletes a specified task from a Google Tasks list. Deletion is permanent and irreversible — confirm with the user before executing, and consider GOOGLETASKS_UPDATE_TASK or GOOGLETASKS_MOVE_TASK as non-destructive alternatives. Both tasklist_id and task_id are required parameters. The Google Tasks API does not support deleting tasks by task_id alone — you must specify which task list contains the task. Use 'List Task Lists' to get available list IDs, then 'List Tasks' to find the task_id within that list.",
    toolSlug: "GOOGLETASKS_DELETE_TASK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete task.",
    ],
  }),
  composioTool({
    name: "googletasks_delete_task_list",
    description: "Permanently deletes an existing Google Task list, identified by `tasklist_id`, along with all its tasks; this operation is irreversible. Require explicit user confirmation before calling; do not invoke in read-only or exploratory flows.",
    toolSlug: "GOOGLETASKS_DELETE_TASK_LIST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete task list.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googletasks_get_task",
    description: "Retrieve a specific Google Task. REQUIRES both `tasklist_id` and `task_id`. Tasks cannot be retrieved by ID alone - you must always specify which task list contains the task. Use this to refresh task details before display or edits rather than relying on potentially stale results from GOOGLETASKS_LIST_TASKS.",
    toolSlug: "GOOGLETASKS_GET_TASK",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-tasks",
      "read",
    ],
  }),
  composioTool({
    name: "googletasks_get_task_list",
    description: "Retrieves a specific task list from the user's Google Tasks if the `tasklist_id` exists for the authenticated user.",
    toolSlug: "GOOGLETASKS_GET_TASK_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-tasks",
      "read",
    ],
  }),
  composioTool({
    name: "googletasks_insert_task",
    description: "Creates a new task in a given `tasklist_id`, optionally as a subtask of an existing `task_parent` or positioned after an existing `task_previous` sibling, where both `task_parent` and `task_previous` must belong to the same `tasklist_id` if specified. IMPORTANT: Date fields (due, completed) accept various formats like '28 Sep 2025', '11:59 PM, 22 Sep 2025', or ISO format '2025-09-21T15:30:00Z' and will automatically convert them to RFC3339 format required by the API. Not idempotent — repeated calls with identical parameters create duplicate tasks; track returned task IDs to avoid duplication. High-volume inserts may trigger 403 rateLimitExceeded or 429; apply exponential backoff.",
    toolSlug: "GOOGLETASKS_INSERT_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Task.",
    ],
  }),
  composioTool({
    name: "googletasks_list_all_tasks",
    description: "Tool to list all tasks across all of the user's task lists with optional filters. Use when the agent needs to see all tasks without knowing which list to query first. Each returned task is annotated with its tasklist_id and tasklist_title for context.",
    toolSlug: "GOOGLETASKS_LIST_ALL_TASKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-tasks",
      "read",
    ],
  }),
  composioTool({
    name: "googletasks_list_task_lists",
    description: "Fetches the authenticated user's task lists from Google Tasks; results may be paginated. Response contains task lists under the `items` key. Multiple lists may share similar names — confirm the correct list by ID before passing to other tools.",
    toolSlug: "GOOGLETASKS_LIST_TASK_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-tasks",
      "read",
    ],
  }),
  composioTool({
    name: "googletasks_list_tasks",
    description: "Retrieves tasks from a Google Tasks list; all date/time strings must be RFC3339 UTC, and `showCompleted` must be true if `completedMin` or `completedMax` are specified. Response key for tasks is `tasks` (not `items`). No full-text search; filter client-side by title/notes. Results ordered by position, not by date.",
    toolSlug: "GOOGLETASKS_LIST_TASKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-tasks",
      "read",
    ],
  }),
  composioTool({
    name: "googletasks_move_task",
    description: "Moves the specified task to another position in the task list or to a different task list. Use cases: - Reorder tasks within a list (use 'previous' parameter) - Create subtasks by moving a task under a parent (use 'parent' parameter) - Move tasks between different task lists (use 'destinationTasklist' parameter) - Move a subtask back to top-level (omit 'parent' parameter)",
    toolSlug: "GOOGLETASKS_MOVE_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Task.",
    ],
  }),
  composioTool({
    name: "googletasks_patch_task",
    description: "Partially updates an existing task (identified by `task_id`) within a specific Google Task list (identified by `tasklist_id`), modifying only the provided attributes from `TaskInput` (e.g., `title`, `notes`, `due` date, `status`) and requiring both the task and list to exist.",
    toolSlug: "GOOGLETASKS_PATCH_TASK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Task.",
    ],
  }),
  composioTool({
    name: "googletasks_patch_task_list",
    description: "Updates the title of an existing Google Tasks task list.",
    toolSlug: "GOOGLETASKS_PATCH_TASK_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch task list.",
    ],
  }),
  composioTool({
    name: "googletasks_update_task_full",
    description: "Tool to fully replace an existing Google Task using PUT method. Use when you need to update the entire task resource, not just specific fields. This method requires all required fields (id, title) and replaces the complete task, unlike PATCH which supports partial updates.",
    toolSlug: "GOOGLETASKS_UPDATE_TASK_FULL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Task (Full Replacement).",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googletasks_update_task_list",
    description: "Updates the authenticated user's specified task list.",
    toolSlug: "GOOGLETASKS_UPDATE_TASK_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-tasks",
      "write",
      "tasklist",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Task List.",
    ],
  }),
];
