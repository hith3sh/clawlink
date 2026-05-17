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
    integration: "linear",
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
      toolkit: "linear",
      toolSlug: partial.toolSlug,
      version: "20260512_00",
    },
  };
}

export const linearComposioTools: IntegrationTool[] = [
  composioTool({
    name: "linear_create_attachment",
    description: "Creates a new attachment and associates it with a specific, existing Linear issue.",
    toolSlug: "LINEAR_CREATE_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create attachment.",
    ],
  }),
  composioTool({
    name: "linear_create_comment_reaction",
    description: "Tool to add a reaction to an existing Linear comment. Use when you want to programmatically react to a comment on an issue.",
    toolSlug: "LINEAR_CREATE_COMMENT_REACTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add reaction to comment.",
    ],
  }),
  composioTool({
    name: "linear_create_linear_comment",
    description: "Creates a new comment on a specified Linear issue. This action modifies shared workspace data and is not reversible — confirm the target issue and comment content before executing.",
    toolSlug: "LINEAR_CREATE_LINEAR_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a comment.",
    ],
  }),
  composioTool({
    name: "linear_create_linear_issue",
    description: "Creates a new issue in a specified Linear project and team, requiring team_id and title, and allowing optional properties like description, assignee, state, priority, cycle, and due date. All UUID parameters (state_id, assignee_id, cycle_id, label_ids, project_id) must belong to the same team as team_id. The created issue's id is returned in data.id — capture it for use as parent_id in sub-issues or follow-up operations. No template_id field exists; expand templates manually into title and description before calling.",
    toolSlug: "LINEAR_CREATE_LINEAR_ISSUE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create linear issue.",
    ],
  }),
  composioTool({
    name: "linear_create_linear_issue_relation",
    description: "Create a relationship between two Linear issues using the issueRelationCreate mutation. Use this to establish connections like 'blocks', 'duplicate', or 'related' between issues.",
    toolSlug: "LINEAR_CREATE_LINEAR_ISSUE_RELATION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
      "issues",
    ],
    askBefore: [
      "Confirm the parameters before executing Create issue relation.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "linear_create_linear_label",
    description: "Creates a new label in Linear for a specified team, used to categorize and organize issues. Label names must be unique within each team. If a label with the same name already exists, the existing label will be returned. Both new and existing labels return the same object structure; check the label's `createdAt` or compare IDs to determine if creation occurred.",
    toolSlug: "LINEAR_CREATE_LINEAR_LABEL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a label.",
    ],
  }),
  composioTool({
    name: "linear_create_linear_project",
    description: "Creates a new Linear project with specified name and team associations.",
    toolSlug: "LINEAR_CREATE_LINEAR_PROJECT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Project.",
    ],
  }),
  composioTool({
    name: "linear_create_project_milestone",
    description: "Tool to create a project milestone in Linear with a name and optional target date and sort order. Use when you need to add milestones to track progress within a project.",
    toolSlug: "LINEAR_CREATE_PROJECT_MILESTONE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
      "projects",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Project Milestone.",
    ],
  }),
  composioTool({
    name: "linear_create_project_update",
    description: "Tool to create a project status update post for a Linear project. Use when you need to post progress updates, status reports, or announcements for a project.",
    toolSlug: "LINEAR_CREATE_PROJECT_UPDATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
      "projects",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Project Update.",
    ],
  }),
  composioTool({
    name: "linear_delete_linear_issue",
    description: "Archives an existing Linear issue by its ID, which is Linear's standard way of deleting issues; the operation is idempotent. Archiving is permanent with no built-in undo — confirm the issue identifier and title with the user before executing, especially in bulk operations.",
    toolSlug: "LINEAR_DELETE_LINEAR_ISSUE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete issue.",
    ],
  }),
  composioTool({
    name: "linear_get_attachment",
    description: "Downloads a specific attachment from a Linear issue; the `file_name` must include the correct file extension.",
    toolSlug: "LINEAR_GET_ATTACHMENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_get_current_user",
    description: "Gets the currently authenticated user's ID, name, email, and other profile information — this is the account behind the API token, which may be a bot or service account rather than a human user. Use the returned `id` field (nested under `data.viewer`) for downstream Linear operations requiring user ID filtering. To search or compare other workspace members, use LINEAR_LIST_LINEAR_USERS instead.",
    toolSlug: "LINEAR_GET_CURRENT_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_get_cycles_by_team_id",
    description: "Retrieves all cycles for a specified Linear team ID; cycles are time-boxed work periods (like sprints). Results are team-scoped to the given team_id. To identify the active cycle, check that the current date (in UTC) falls between a cycle's startAt and endAt fields; either field may be null. Results may be paginated — follow page_info cursors to retrieve all cycles.",
    toolSlug: "LINEAR_GET_CYCLES_BY_TEAM_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_get_issue_defaults",
    description: "Fetches a Linear team's default issue estimate and state, useful for pre-filling new issue forms.",
    toolSlug: "LINEAR_GET_ISSUE_DEFAULTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_get_linear_issue",
    description: "Retrieves an existing Linear issue's comprehensive details, including id, identifier, title, description, timestamps, state, team, creator, attachments, comments (with user info and timestamps, use issue.comments.nodes for comment IDs), subscribers, and due date. Does not include parent, milestone, cycle, or relation graphs—use LINEAR_RUN_QUERY_OR_MUTATION for those. Optional fields (labels, project, state, assignee, cycle) may be null; guard against null when accessing nested properties. Returns null or 'Entity not found' for invalid IDs, cross-workspace IDs, or restricted teams. Rate limit: ~60 req/min; HTTP 429 on excess—apply exponential backoff and respect Retry-After headers.",
    toolSlug: "LINEAR_GET_LINEAR_ISSUE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_get_linear_project",
    description: "Retrieves a single Linear project by its unique identifier. Use when verifying a newly created or updated project, or when fetching detailed project information by ID.",
    toolSlug: "LINEAR_GET_LINEAR_PROJECT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_issue_drafts",
    description: "Tool to list issue drafts. Use when you need to fetch draft issues for review or further editing. Check `pageInfo.hasNextPage` in the response to determine if additional drafts exist beyond the current page.",
    toolSlug: "LINEAR_LIST_ISSUE_DRAFTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_issues_by_team_id",
    description: "Tool to list all issues for a specific Linear team, scoped by team ID. Use when you need to retrieve issues belonging to a particular team without fetching workspace-wide issues. This is more efficient than workspace-wide listing followed by client-side filtering.",
    toolSlug: "LINEAR_LIST_ISSUES_BY_TEAM_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_cycles",
    description: "Retrieves all cycles (time-boxed sprint iterations) org-wide from the Linear account; no filters applied. In large multi-team workspaces this produces heavy responses — filter client-side by team ID and date range using each cycle's startsAt/endsAt fields. Cycles are team-scoped; always group by team ID to avoid mixing sprints across teams. To identify the active sprint, verify the current UTC timestamp falls between startsAt and endsAt, and handle null startsAt/endsAt defensively. Timestamps are UTC. Results may be paginated; follow pageInfo.endCursor and hasNextPage until hasNextPage is false to avoid truncated lists.",
    toolSlug: "LINEAR_LIST_LINEAR_CYCLES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_issues",
    description: "Lists non-archived Linear issues; if project_id is not specified, issues from all accessible projects are returned. Can filter by assignee_id. Only project_id and assignee_id server-side filters are supported; label, state, team, cycle, or date filters must be done client-side or via LINEAR_RUN_QUERY_OR_MUTATION. Response is a flat issues array plus page_info object (not GraphQL nodes/pageInfo). Fields like cycle membership, dueDate, completedAt, comments, and attachments are absent; use LINEAR_GET_LINEAR_ISSUE for enrichment. state and labels are nested objects (labels as labels.nodes array). Response order is not guaranteed; sort client-side after collecting all pages. No team_id filter; scope by project_id or use LINEAR_RUN_QUERY_OR_MUTATION.",
    toolSlug: "LINEAR_LIST_LINEAR_ISSUES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_labels",
    description: "Retrieves labels from Linear. If team_id is provided, returns labels for that specific team; if omitted, returns all labels across the workspace. Label names are not unique across teams — always use returned IDs, not names, and track each label ID with its team ID. In large workspaces, results may paginate; follow pageInfo.hasNextPage and pageInfo.endCursor to retrieve all labels.",
    toolSlug: "LINEAR_LIST_LINEAR_LABELS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_projects",
    description: "Retrieves all projects from the Linear account. Returns a flat array (not a GraphQL connection) with fields id and name; use LINEAR_RUN_QUERY_OR_MUTATION for progress, state, issues, or team linkage. No server-side filtering: all workspace projects are returned regardless of team or name — filter client-side. Multiple projects can share identical names; always confirm project_id before downstream use. Results are permission-scoped to the connected user. Pagination: loop while page_info.hasNextPage is true, passing page_info.endCursor as after, or results will be silently truncated. HTTP 429 may occur in large workspaces; apply exponential backoff between calls.",
    toolSlug: "LINEAR_LIST_LINEAR_PROJECTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_states",
    description: "Retrieves all workflow states for a specified team in Linear, representing the stages an issue progresses through in that team's workflow. Returned state IDs are team-scoped — never reuse a stateId across different teams, as this causes validation errors or 'Entity not found' failures in tools like LINEAR_UPDATE_ISSUE. State names (e.g., 'Done', 'In Progress') are non-unique across teams; always resolve names to IDs via this tool for the specific team_id before using them in filters or mutations. Uses cursor-based pagination via pageInfo.hasNextPage and endCursor; iterate until hasNextPage is false to avoid missing states in large workspaces. Always fetch fresh state IDs rather than hardcoding or reusing stale values.",
    toolSlug: "LINEAR_LIST_LINEAR_STATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_teams",
    description: "Retrieves all teams with their members and projects. Use stable team IDs or keys (not display names) for subsequent operations — names are non-unique. Results reflect only teams visible to the authenticated token scope; missing teams or members indicate permission limits. Large workspaces paginate via pageInfo.hasNextPage/endCursor — incomplete pagination silently drops teams or members. Members may belong to multiple teams; deduplicate user IDs when aggregating. Use LINEAR_GET_ALL_LINEAR_TEAMS instead when only identifiers are needed.",
    toolSlug: "LINEAR_LIST_LINEAR_TEAMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_list_linear_users",
    description: "Lists all workspace users (not team-scoped) with their IDs, names, emails, and active status. Display names are non-unique — use email to disambiguate before extracting an ID. Only assign users with `active: true`. Returned IDs are UUID strings; pass them as-is to fields like `assignee_id` — never substitute names, emails, or tokens. When joining with other tools, always join on IDs.",
    toolSlug: "LINEAR_LIST_LINEAR_USERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
    ],
  }),
  composioTool({
    name: "linear_remove_issue_label",
    description: "Removes a specified label from an existing Linear issue using their IDs; successful even if the label isn't on the issue. Operation is irreversible — obtain explicit user approval before executing. Use this tool instead of LINEAR_UPDATE_ISSUE to avoid replacing the entire label set.",
    toolSlug: "LINEAR_REMOVE_ISSUE_LABEL",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove label from Linear issue.",
    ],
  }),
  composioTool({
    name: "linear_remove_reaction",
    description: "Tool to remove a reaction on a comment. Use when you have a reaction ID and need to delete it.",
    toolSlug: "LINEAR_REMOVE_REACTION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove reaction from comment.",
    ],
  }),
  composioTool({
    name: "linear_run_query_or_mutation",
    description: "Execute any GraphQL query or mutation against Linear's API. USE WHEN: No dedicated action exists, need complex filtering, custom fields, or schema discovery. *** INTROSPECTION FIRST - NEVER GUESS FIELD NAMES *** Run introspection before unknown operations: - query { __type(name: \"Issue\") { fields { name } } } - query { __type(name: \"Mutation\") { fields { name } } } Linear uses nested objects (project { id }), NOT scalar IDs (projectId). KEY: All IDs are UUIDs. Filter: { field: { eq: value } }. Pagination: nodes[] + pageInfo.",
    toolSlug: "LINEAR_RUN_QUERY_OR_MUTATION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Run Query or Mutation.",
    ],
  }),
  composioTool({
    name: "linear_search_issues",
    description: "Search Linear issues using full-text search across identifier, title, and description. Use when you need to find issues by keywords or specific identifiers. Note: This endpoint only supports full-text search; for structured filtering by team, project, assignee, state, or labels, use LIST_ISSUES_BY_TEAM_ID instead.",
    toolSlug: "LINEAR_SEARCH_ISSUES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "linear",
      "read",
      "issues",
    ],
  }),
  composioTool({
    name: "linear_update_issue",
    description: "Updates an existing Linear issue using its `issue_id`; requires at least one other attribute for modification, and all provided entity IDs (for state, assignee, labels, etc.) must be valid UUIDs — only `issueId` accepts key format (e.g., 'ENG-123'). All updated fields are fully overwritten, not merged; omit any field you do not intend to change.",
    toolSlug: "LINEAR_UPDATE_ISSUE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update issue.",
    ],
  }),
  composioTool({
    name: "linear_update_linear_comment",
    description: "Tool to update an existing Linear comment's body text. Use when you need to edit or modify the content of a previously created comment.",
    toolSlug: "LINEAR_UPDATE_LINEAR_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a comment.",
    ],
  }),
  composioTool({
    name: "linear_update_linear_project",
    description: "Tool to update an existing Linear project. Use when you need to modify project properties like name, description, state, dates, or lead. All fields except project_id are optional - only provide the fields you want to update.",
    toolSlug: "LINEAR_UPDATE_LINEAR_PROJECT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "linear",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Project.",
    ],
  }),
];
