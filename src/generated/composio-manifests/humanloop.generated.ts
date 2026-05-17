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
    integration: "humanloop",
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
      toolkit: "humanloop",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const humanloopComposioTools: IntegrationTool[] = [
  composioTool({
    name: "humanloop_create_project",
    description: "This tool creates a new project in Humanloop. It is an independent action that generates a project by accepting a project's name (required), an optional description, and an optional organization_id. Upon execution, it returns details of the created project, including the project's id, name, description, created_at timestamp, and organization_id.",
    toolSlug: "HUMANLOOP_CREATE_PROJECT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "humanloop",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Project.",
    ],
  }),
  composioTool({
    name: "humanloop_delete_project",
    description: "This tool allows you to delete a specific project from your Humanloop organization. The deletion is permanent and cannot be undone. All associated data, including sessions, datapoints, and evaluations linked to the project, will be permanently removed.",
    toolSlug: "HUMANLOOP_DELETE_PROJECT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "humanloop",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Project.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "humanloop_list_experiments",
    description: "This tool retrieves an array of experiments associated with a specific project in Humanloop. It requires a project_id (starting with 'pr_') and returns details including experiment_id, name, description, creation timestamp, status, configuration details, and metrics/results. It is useful for monitoring experiments, analyzing results, tracking model configurations, and comparing experimental setups.",
    toolSlug: "HUMANLOOP_LIST_EXPERIMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "humanloop",
      "read",
    ],
  }),
  composioTool({
    name: "humanloop_list_sessions",
    description: "This tool retrieves a paginated list of sessions for a specific project in Humanloop. It requires a project_id (and optionally, page and size for pagination) and returns session details such as id, reference_id, project information, datapoints_count, first_inputs, last_output, created_at, and updated_at. This enables users to monitor and analyze historical project interactions.",
    toolSlug: "HUMANLOOP_LIST_SESSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "humanloop",
      "read",
    ],
  }),
];
