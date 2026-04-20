import {
  BaseIntegration,
  IntegrationRequestError,
  defineTool,
  type IntegrationTool,
  registerHandler,
} from "./base";

const MOTION_BASE_URL = "https://api.usemotion.com/v1";

interface MotionErrorPayload {
  message?: string;
  error?: string;
  statusCode?: number;
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return value;
}

function optionalStringArray(value: unknown, fieldName: string): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of strings`);
  }

  const normalized = value
    .map((entry) => safeTrim(entry))
    .filter((entry): entry is string => Boolean(entry));

  return normalized.length > 0 ? normalized : undefined;
}

class MotionHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "get_me", {
        description: "List Motion users for a workspace or team so you can identify the current account and available assignees",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Optional Motion workspace id",
            },
            teamId: {
              type: "string",
              description: "Optional Motion team id",
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response",
            },
          },
        },
        accessLevel: "read",
        tags: ["motion", "users", "assignees"],
        whenToUse: [
          "User wants to know which Motion account members are available.",
          "You need a user id before assigning a task.",
        ],
        examples: [
          {
            user: "show motion users in workspace ws_123",
            args: { workspaceId: "ws_123" },
          },
        ],
        followups: [
          "Offer to use one of the returned user ids for task assignment.",
        ],
      }),
      defineTool(integrationSlug, "list_workspaces", {
        description: "List Motion workspaces available to the connected account",
        inputSchema: {
          type: "object",
          properties: {
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response",
            },
          },
        },
        accessLevel: "read",
        tags: ["motion", "workspaces", "projects"],
        whenToUse: [
          "User wants to see which Motion workspace(s) are available.",
          "You need a workspace id before listing projects or creating tasks.",
        ],
        examples: [
          {
            user: "what motion workspaces can you access",
            args: {},
          },
        ],
        followups: [
          "Offer to list projects for a selected workspace.",
        ],
      }),
      defineTool(integrationSlug, "list_projects", {
        description: "List Motion projects for a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id",
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response",
            },
          },
          required: ["workspaceId"],
        },
        accessLevel: "read",
        tags: ["motion", "projects", "workspace"],
        whenToUse: [
          "User wants to browse Motion projects.",
          "You need a project id before creating or filtering tasks.",
        ],
        askBefore: [
          "Ask which workspace to use if there are multiple workspaces and none is specified.",
        ],
        examples: [
          {
            user: "show motion projects in workspace abc123",
            args: { workspaceId: "abc123" },
          },
        ],
        followups: [
          "Offer to list tasks for one of the returned projects.",
        ],
      }),
      defineTool(integrationSlug, "list_tasks", {
        description: "List Motion tasks with optional workspace, project, assignee, status, label, or name filters",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Optional Motion workspace id. If omitted, Motion returns tasks across accessible workspaces.",
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id",
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id",
            },
            status: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of task statuses to include",
            },
            includeAllStatuses: {
              type: "boolean",
              description: "Include all statuses instead of filtering to active ones",
            },
            label: {
              type: "string",
              description: "Optional label filter",
            },
            name: {
              type: "string",
              description: "Optional case-insensitive text search against task names",
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response",
            },
          },
        },
        accessLevel: "read",
        tags: ["motion", "tasks", "projects"],
        whenToUse: [
          "User wants to review Motion tasks.",
          "You need to identify a task before opening or updating it elsewhere.",
        ],
        safeDefaults: {
          includeAllStatuses: false,
        },
        examples: [
          {
            user: "show my motion tasks for project proj_123",
            args: { projectId: "proj_123" },
          },
        ],
        followups: [
          "Offer to fetch a specific task by id.",
          "Offer to create a new task in a project or workspace.",
        ],
      }),
      defineTool(integrationSlug, "get_task", {
        description: "Get a single Motion task by id",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id",
            },
          },
          required: ["taskId"],
        },
        accessLevel: "read",
        tags: ["motion", "task", "lookup"],
        whenToUse: [
          "User wants the details of a specific Motion task.",
          "A prior list step returned a task id and the next step is to inspect it.",
        ],
        askBefore: [
          "Ask which task they mean if multiple tasks could match.",
        ],
        examples: [
          {
            user: "open that motion task",
            args: { taskId: "task_123" },
          },
        ],
        followups: [
          "Offer to summarize the task or create a related task.",
        ],
      }),
      defineTool(integrationSlug, "update_task", {
        description: "Update a Motion task",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id",
            },
            workspaceId: {
              type: "string",
              description: "Motion workspace id",
            },
            name: {
              type: "string",
              description: "Optional updated task title",
            },
            description: {
              type: "string",
              description: "Optional updated markdown description",
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id",
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime",
            },
            duration: {
              type: "string",
              description: 'Optional duration in minutes as a string or values like "NONE" or "REMINDER"',
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion task priority",
            },
            status: {
              type: "string",
              description: "Optional Motion status name or id depending on workspace config",
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id",
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names",
            },
            startOn: {
              type: "string",
              description: "Optional YYYY-MM-DD date when the task should start",
            },
            deadlineType: {
              type: "string",
              enum: ["HARD", "SOFT", "NONE"],
              description: "Optional Motion deadline type",
            },
            autoScheduled: {
              type: ["object", "null"] as unknown as object,
              description: "Optional Motion autoScheduled object, or null to disable auto scheduling",
            },
          },
          required: ["taskId", "workspaceId"],
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "update"],
        whenToUse: [
          "User explicitly asks to update a Motion task.",
          "User wants to rename, reschedule, reassign, or reprioritize a task.",
        ],
        askBefore: [
          "Ask which task to update if there is any ambiguity.",
        ],
        examples: [
          {
            user: "move that task to tomorrow and assign it to me",
            args: {
              taskId: "task_123",
              workspaceId: "ws_123",
              dueDate: "2026-04-21T17:00:00Z",
              assigneeId: "user_123",
            },
          },
        ],
      }),
      defineTool(integrationSlug, "move_task", {
        description: "Move a Motion task to another project or status",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id",
            },
            workspaceId: {
              type: "string",
              description: "Motion workspace id",
            },
            projectId: {
              type: "string",
              description: "Destination Motion project id",
            },
            status: {
              type: "string",
              description: "Destination Motion status name or id",
            },
          },
          required: ["taskId", "workspaceId"],
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "move"],
        whenToUse: [
          "User explicitly asks to move a task to another project or workflow status.",
        ],
        askBefore: [
          "Ask for the destination project or status if neither is provided.",
        ],
      }),
      defineTool(integrationSlug, "delete_task", {
        description: "Delete a Motion task by id",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id",
            },
          },
          required: ["taskId"],
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "delete"],
        whenToUse: [
          "User explicitly asks to delete a Motion task.",
        ],
        askBefore: [
          "Confirm before deleting a task unless the user was already explicit.",
        ],
      }),
      defineTool(integrationSlug, "get_project", {
        description: "Get a single Motion project by id",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "Motion project id",
            },
          },
          required: ["projectId"],
        },
        accessLevel: "read",
        tags: ["motion", "project", "lookup"],
      }),
      defineTool(integrationSlug, "create_project", {
        description: "Create a Motion project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id",
            },
            name: {
              type: "string",
              description: "Project name",
            },
            description: {
              type: "string",
              description: "Optional HTML or rich text description",
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime",
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion project priority",
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names",
            },
            projectDefinitionId: {
              type: "string",
              description: "Optional Motion project definition/template id",
            },
            stages: {
              type: "array",
              items: { type: "object" },
              description: "Optional raw Motion stages array; required if projectDefinitionId is provided",
            },
          },
          required: ["workspaceId", "name"],
        },
        accessLevel: "write",
        tags: ["motion", "projects", "create"],
      }),
      defineTool(integrationSlug, "create_task", {
        description: "Create a Motion task",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id",
            },
            name: {
              type: "string",
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Optional markdown description",
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id",
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime",
            },
            duration: {
              type: "string",
              description: 'Optional duration in minutes as a string or values like "NONE" or "REMINDER"',
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion task priority",
            },
            status: {
              type: "string",
              description: "Optional Motion status name or id depending on workspace config",
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id",
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names",
            },
            startOn: {
              type: "string",
              description: "Optional YYYY-MM-DD date when the task should start",
            },
            deadlineType: {
              type: "string",
              enum: ["HARD", "SOFT", "NONE"],
              description: "Optional Motion deadline type",
            },
            autoScheduled: {
              type: "object",
              description: "Optional raw Motion autoScheduled object",
            },
          },
          required: ["workspaceId", "name"],
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "create"],
        whenToUse: [
          "User explicitly asks to create a Motion task.",
        ],
        askBefore: [
          "Ask for missing workspace or title before creating the task.",
          "Confirm due date or scheduling details if the request sounds ambiguous.",
        ],
        examples: [
          {
            user: "create a motion task to review the api docs tomorrow",
            args: {
              workspaceId: "ws_123",
              name: "Review the API docs",
              dueDate: "2026-04-21T17:00:00Z",
              priority: "HIGH",
            },
          },
        ],
        followups: [
          "Offer to list tasks in the same project or workspace to confirm where it landed.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const apiKey = safeTrim(credentials.apiKey);

    if (!apiKey) {
      throw new Error("Motion credentials are missing apiKey");
    }

    return {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "get_me":
        return this.getMe(args, credentials);
      case "list_workspaces":
        return this.listWorkspaces(args, credentials);
      case "list_projects":
        return this.listProjects(args, credentials);
      case "list_tasks":
        return this.listTasks(args, credentials);
      case "get_task":
        return this.getTask(args, credentials);
      case "update_task":
        return this.updateTask(args, credentials);
      case "move_task":
        return this.moveTask(args, credentials);
      case "delete_task":
        return this.deleteTask(args, credentials);
      case "get_project":
        return this.getProject(args, credentials);
      case "create_project":
        return this.createProject(args, credentials);
      case "create_task":
        return this.createTask(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(`${MOTION_BASE_URL}/workspaces`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async getMe(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = this.buildQueryString({
      workspaceId: safeTrim(args.workspaceId),
      teamId: safeTrim(args.teamId),
      cursor: safeTrim(args.cursor),
    });

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/users${query ? `?${query}` : ""}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion users", response);
    }

    return response.json();
  }

  private async listWorkspaces(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = this.buildQueryString({
      cursor: safeTrim(args.cursor),
    });

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/workspaces${query ? `?${query}` : ""}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion workspaces", response);
    }

    return response.json();
  }

  private async listProjects(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const workspaceId = safeTrim(args.workspaceId);

    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    const query = this.buildQueryString({
      workspaceId,
      cursor: safeTrim(args.cursor),
    });

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects?${query}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion projects", response);
    }

    return response.json();
  }

  private async listTasks(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const status = optionalStringArray(args.status, "status");
    const includeAllStatuses = optionalBoolean(args.includeAllStatuses);

    if (status && includeAllStatuses) {
      throw new Error("Use either status or includeAllStatuses, not both");
    }

    const queryParams = new URLSearchParams();
    const maybeSet = (key: string, value: string | null) => {
      if (value) {
        queryParams.set(key, value);
      }
    };

    maybeSet("workspaceId", safeTrim(args.workspaceId));
    maybeSet("projectId", safeTrim(args.projectId));
    maybeSet("assigneeId", safeTrim(args.assigneeId));
    maybeSet("label", safeTrim(args.label));
    maybeSet("name", safeTrim(args.name));
    maybeSet("cursor", safeTrim(args.cursor));

    if (status) {
      for (const entry of status) {
        queryParams.append("status", entry);
      }
    }

    if (includeAllStatuses !== undefined) {
      queryParams.set("includeAllStatuses", String(includeAllStatuses));
    }

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks${queryParams.size > 0 ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion tasks", response);
    }

    return response.json();
  }

  private async getTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const taskId = safeTrim(args.taskId);

    if (!taskId) {
      throw new Error("taskId is required");
    }

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Motion task", response);
    }

    return response.json();
  }

  private async updateTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const taskId = safeTrim(args.taskId);
    const workspaceId = safeTrim(args.workspaceId);

    if (!taskId) {
      throw new Error("taskId is required");
    }

    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    const payload = this.buildTaskPayload(args, { workspaceId, requireName: false });

    if (Object.keys(payload).length <= 1) {
      throw new Error("At least one task field must be provided to update");
    }

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Motion task", response);
    }

    return response.json();
  }

  private async moveTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const taskId = safeTrim(args.taskId);
    const workspaceId = safeTrim(args.workspaceId);
    const projectId = safeTrim(args.projectId);
    const status = safeTrim(args.status);

    if (!taskId) {
      throw new Error("taskId is required");
    }

    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    if (!projectId && !status) {
      throw new Error("Provide projectId or status to move the task");
    }

    const payload: Record<string, unknown> = { workspaceId };
    if (projectId) payload.projectId = projectId;
    if (status) payload.status = status;

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to move Motion task", response);
    }

    return response.json();
  }

  private async deleteTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const taskId = safeTrim(args.taskId);

    if (!taskId) {
      throw new Error("taskId is required");
    }

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Motion task", response);
    }

    return {
      success: true,
      deleted: true,
      taskId,
      status: response.status,
    };
  }

  private async getProject(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const projectId = safeTrim(args.projectId);

    if (!projectId) {
      throw new Error("projectId is required");
    }

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Motion project", response);
    }

    return response.json();
  }

  private async createProject(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const workspaceId = safeTrim(args.workspaceId);
    const name = safeTrim(args.name);

    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    if (!name) {
      throw new Error("name is required");
    }

    const payload: Record<string, unknown> = { workspaceId, name };
    const description = safeTrim(args.description);
    const dueDate = safeTrim(args.dueDate);
    const priority = safeTrim(args.priority);
    const projectDefinitionId = safeTrim(args.projectDefinitionId);
    const labels = optionalStringArray(args.labels, "labels");

    if (description) payload.description = description;
    if (dueDate) payload.dueDate = dueDate;
    if (priority) payload.priority = priority;
    if (labels) payload.labels = labels;
    if (projectDefinitionId) payload.projectDefinitionId = projectDefinitionId;
    if (Array.isArray(args.stages)) payload.stages = args.stages;

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Motion project", response);
    }

    return response.json();
  }

  private async createTask(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const workspaceId = safeTrim(args.workspaceId);
    const name = safeTrim(args.name);

    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }

    if (!name) {
      throw new Error("name is required");
    }

    const payload = this.buildTaskPayload(args, { workspaceId, requireName: true });

    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Motion task", response);
    }

    return response.json();
  }

  private buildTaskPayload(
    args: Record<string, unknown>,
    options: { workspaceId: string; requireName: boolean },
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      workspaceId: options.workspaceId,
    };

    const name = safeTrim(args.name);
    if (options.requireName && !name) {
      throw new Error("name is required");
    }
    if (name) payload.name = name;

    const description = safeTrim(args.description);
    const projectId = safeTrim(args.projectId);
    const dueDate = safeTrim(args.dueDate);
    const duration = safeTrim(args.duration);
    const priority = safeTrim(args.priority);
    const status = safeTrim(args.status);
    const assigneeId = safeTrim(args.assigneeId);
    const startOn = safeTrim(args.startOn);
    const deadlineType = safeTrim(args.deadlineType);
    const labels = optionalStringArray(args.labels, "labels");

    if (description) payload.description = description;
    if (projectId) payload.projectId = projectId;
    if (dueDate) payload.dueDate = dueDate;
    if (duration) payload.duration = /^\d+$/.test(duration) ? Number.parseInt(duration, 10) : duration;
    if (priority) payload.priority = priority;
    if (status) payload.status = status;
    if (assigneeId) payload.assigneeId = assigneeId;
    if (labels) payload.labels = labels;
    if (startOn) payload.startOn = startOn;
    if (deadlineType) payload.deadlineType = deadlineType;
    if (args.autoScheduled === null) {
      payload.autoScheduled = null;
    } else if (args.autoScheduled && typeof args.autoScheduled === "object" && !Array.isArray(args.autoScheduled)) {
      payload.autoScheduled = args.autoScheduled;
    }

    return payload;
  }

  private async createApiError(prefix: string, response: Response): Promise<IntegrationRequestError> {
    const payload = (await response.json().catch(() => null)) as MotionErrorPayload | null;
    const message = payload?.message ?? payload?.error ?? response.statusText;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code: response.statusText,
    });
  }
}

registerHandler("motion", new MotionHandler());
