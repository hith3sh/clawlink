import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
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
    integration: "clickup",
    name: partial.name,
    description: partial.description,
    inputSchema: partial.inputSchema,
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
      toolkit: "clickup",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const clickupComposioTools: IntegrationTool[] = [
  composioTool({
    name: "clickup_add_dependency",
    description: "Adds a 'waiting on' or 'blocking' dependency to a task, requiring either `depends_on` (task becomes waiting on) or `dependency_of` (task becomes blocking), but not both; `team_id` is required if `custom_task_ids` is true.",
    toolSlug: "CLICKUP_ADD_DEPENDENCY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Unique identifier of the task to which a dependency relationship will be added.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true to look up tasks by custom IDs (unique per team).",
        },
        depends_on: {
          type: "string",
          description: "ID of the task that `task_id` will depend on ('waiting on' relationship). Use this or `dependency_of`, not both.",
        },
        dependency_of: {
          type: "string",
          description: "ID of the task that will depend on `task_id` ('blocking' relationship). Use this or `depends_on`, not both.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` and related task IDs are custom (text-based), requiring `team_id`.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_relationships",
    ],
    askBefore: [
      "Confirm the parameters before executing Add dependency.",
    ],
  }),
  composioTool({
    name: "clickup_add_guest_to_folder",
    description: "Adds a guest to a folder with specified permissions; requires a ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_ADD_GUEST_TO_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        guest_id: {
          type: "string",
          description: "The unique identifier of the guest user to be added to the folder.",
        },
        folder_id: {
          type: "string",
          description: "The unique identifier of the folder to which the guest will be added.",
        },
        include_shared: {
          type: "boolean",
          description: "If `true`, include shared item details (API default if parameter is omitted); if `false`, exclude them.",
        },
        permission_level: {
          type: "string",
          description: "Permission level for the guest. Options are 'read' (view only), 'comment', 'edit', or 'create' (full access).",
        },
      },
      required: [
        "folder_id",
        "guest_id",
        "permission_level",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "Confirm the parameters before executing Add guest to folder.",
    ],
  }),
  composioTool({
    name: "clickup_add_guest_to_list",
    description: "Shares a ClickUp List with an existing guest user, granting them specified permissions; requires the Workspace to be on the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_ADD_GUEST_TO_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique identifier of the List to which the guest will be added.",
        },
        guest_id: {
          type: "string",
          description: "The unique identifier of the guest user to be added to the List.",
        },
        include_shared: {
          type: "boolean",
          description: "A boolean indicating whether to include details of items shared with the guest in the response. Set to `false` to exclude these details. If not provided or set to `true` (the API default), shared item details are included.",
        },
        permission_level: {
          type: "string",
          description: "The permission level to be granted to the guest on this List. Accepted values are: `read` (view-only), `comment` (can add comments), `edit` (can edit existing items), or `create` (full access, including creating new items).",
        },
      },
      required: [
        "list_id",
        "guest_id",
        "permission_level",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "Confirm the parameters before executing Add guest to list.",
    ],
  }),
  composioTool({
    name: "clickup_add_guest_to_task",
    description: "Assigns a guest to a task with specified permissions; requires ClickUp Enterprise Plan, and `team_id` if `custom_task_ids` is true.",
    toolSlug: "CLICKUP_ADD_GUEST_TO_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The unique identifier of the task to which the guest will be added.",
        },
        team_id: {
          type: "string",
          description: "Required if `custom_task_ids` is `true` to correctly identify the task when using a custom task ID.",
        },
        guest_id: {
          type: "string",
          description: "The unique identifier of the guest user to be added to the task.",
        },
        include_shared: {
          type: "boolean",
          description: "Optional. If set to `false`, details of items already shared with the guest will be excluded. The API defaults to `true` if this parameter is not explicitly set to `false`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Optional. Set to `true` if you are referencing the task by its custom task ID. If `true`, `team_id` must also be provided.",
        },
        permission_level: {
          type: "string",
          description: "Permission level for the guest on this task. Must be one of: `read` (view only), `comment` (view and comment), `edit` (view, comment, and edit), or `create` (full permissions).",
        },
      },
      required: [
        "task_id",
        "guest_id",
        "permission_level",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "Confirm the parameters before executing Add guest to task.",
    ],
  }),
  composioTool({
    name: "clickup_add_tag_to_task",
    description: "Adds an existing tag to a specified task; team_id is required if custom_task_ids is true.",
    toolSlug: "CLICKUP_ADD_TAG_TO_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the task to which the tag will be added. This can be the standard task ID or a custom task ID if `custom_task_ids` is set to `true`.",
        },
        team_id: {
          type: "integer",
          description: "The ID of the team (formerly Workspace) to which the task belongs. This is required only if `custom_task_ids` is set to `true`. For example: `custom_task_ids=true&team_id=123`.",
        },
        tag_name: {
          type: "string",
          description: "The name of the tag to add to the task. The tag must already exist in the workspace.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "A boolean flag indicating whether the `task_id` provided is a custom task ID. If `true`, the `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "tag_name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Add tag to task.",
    ],
  }),
  composioTool({
    name: "clickup_add_tags_to_time_entries",
    description: "Associates a list of specified tags with one or more time entries within a given Team (Workspace).",
    toolSlug: "CLICKUP_ADD_TAGS_TO_TIME_ENTRIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "A list of tag objects to add to the time entries. Each object should define the tag, typically including a 'name', and optionally 'tag_fg' (foreground color hex code) and 'tag_bg' (background color hex code).",
        },
        team_id: {
          type: "integer",
          description: "The ID of the Team (Workspace) where the time entries are located.",
        },
        time_entry_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of unique string identifiers for the time entries to which the tags will be added.",
        },
      },
      required: [
        "team_id",
        "tags",
        "time_entry_ids",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Add tags from time entries.",
    ],
  }),
  composioTool({
    name: "clickup_add_task_link",
    description: "Links two existing and accessible ClickUp tasks, identified by `task_id` (source) and `links_to` (target).",
    toolSlug: "CLICKUP_ADD_TASK_LINK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the source task.",
        },
        team_id: {
          type: "integer",
          description: "The ID of the team, used when `custom_task_ids` is true to identify tasks by custom IDs. For example: `custom_task_ids=true&team_id=123`.",
        },
        links_to: {
          type: "string",
          description: "The ID of the target task.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` to indicate that `task_id` and `links_to` are custom task IDs rather than standard numerical IDs. If `true`, `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "links_to",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_relationships",
    ],
    askBefore: [
      "Confirm the parameters before executing Add task link.",
    ],
  }),
  composioTool({
    name: "clickup_add_task_to_list",
    description: "Adds an existing task to an additional ClickUp List; the \"Tasks in Multiple Lists\" ClickApp must be enabled in the Workspace for this.",
    toolSlug: "CLICKUP_ADD_TASK_TO_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "integer",
          description: "Unique identifier of the List to which the task will be added.",
        },
        task_id: {
          type: "string",
          description: "Unique identifier of the task to add to the List (actual task ID, not Custom Task ID).",
        },
      },
      required: [
        "list_id",
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add task to list.",
    ],
  }),
  composioTool({
    name: "clickup_click_up_update_doc_page",
    description: "Tool to update/edit a ClickUp Doc page's title and/or content via the v3 Docs API. Use when you need to modify a Doc page's name or content programmatically.",
    toolSlug: "CLICKUP_CLICK_UP_UPDATE_DOC_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new title/name for the page. If not provided, the page name will not be changed.",
        },
        doc_id: {
          type: "string",
          description: "The unique identifier for the document containing the page.",
        },
        content: {
          type: "string",
          description: "The new content for the page in markdown format. If not provided, the page content will not be changed. Use this field to update, replace, or append to the page content.",
        },
        page_id: {
          type: "string",
          description: "The unique identifier for the page to update.",
        },
        workspace_id: {
          type: "string",
          description: "The workspace ID containing the document.",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
        "page_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "docs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Doc Page.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_create_a_time_entry",
    description: "Creates a new time entry for a specified team.",
    toolSlug: "CLICKUP_CREATE_A_TIME_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "integer",
          description: "Alias for `stop`. The end time of the time entry, as a Unix timestamp in milliseconds. If both `start` and `end` are provided, the API will use these to determine the entry's actual duration, potentially overriding the `duration` field sent in the request.",
        },
        tid: {
          type: "string",
          description: "The ID of the task to associate this time entry with. If `custom_task_ids` is `true`, this should be the custom task ID.",
        },
        stop: {
          type: "integer",
          description: "The stop time of the time entry, as a Unix timestamp in milliseconds. If both `start` and `stop` are provided, the API will use these to determine the entry's actual duration, potentially overriding the `duration` field sent in the request.",
        },
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of Tag objects to apply to the time entry. Each Tag object should define 'name' (string), 'tag_fg' (hex color string for foreground), and 'tag_bg' (hex color string for background). This feature is available for users on the ClickUp Business Plan and above.",
        },
        start: {
          type: "integer",
          description: "The start time of the time entry, as a Unix timestamp in milliseconds.",
        },
        team_Id: {
          type: "string",
          description: "The Workspace ID (also called Team ID in ClickUp API) where the time entry will be added. This goes in the URL path.",
        },
        team_id: {
          type: "string",
          description: "The ID of the Team, required only if `custom_task_ids` is set to `true`. This specifies the team context for the custom task ID. Example: `custom_task_ids=true&team_id=123`.",
        },
        assignee: {
          type: "integer",
          description: "The user ID of the person to assign this time entry to. Workspace owners and admins can assign to any user ID. Workspace members can only assign to their own user ID.",
        },
        billable: {
          type: "boolean",
          description: "Indicates whether the time entry is billable. Set to `true` if billable, `false` or omit if not.",
        },
        duration: {
          type: "integer",
          description: "The duration of the time entry in milliseconds. Note: If `start` and `end` (or `stop`) times are also provided in the request, the ClickUp API will calculate the duration based on `start` and `end`/`stop`, and this `duration` field's value might be ignored or overridden by the server.",
        },
        description: {
          type: "string",
          description: "An optional description for the time entry.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If `true`, the `tid` parameter will be interpreted as a custom task ID. If this is `true`, the `team_id` query parameter must also be provided to specify the team context for the custom task ID.",
        },
      },
      required: [
        "team_Id",
        "start",
        "duration",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a time entry.",
    ],
  }),
  composioTool({
    name: "clickup_create_chat_channel",
    description: "Tool to create a chat channel in a ClickUp workspace. Use when you need to set up a new communication channel for team collaboration with configurable visibility.",
    toolSlug: "CLICKUP_CREATE_CHAT_CHANNEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for the chat channel being created.",
        },
        topic: {
          type: "string",
          description: "The topic of the chat channel being created.",
        },
        user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optionally specify unique user IDs to add to the channel, up to 100.",
        },
        visibility: {
          type: "string",
          description: "Visibility level for the chat channel.",
          enum: [
            "PUBLIC",
            "PRIVATE",
          ],
        },
        description: {
          type: "string",
          description: "The description for the chat channel being created.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace where the chat channel will be created.",
        },
      },
      required: [
        "workspace_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "channels",
    ],
    askBefore: [
      "Confirm the parameters before executing Create chat channel.",
    ],
  }),
  composioTool({
    name: "clickup_create_chat_message",
    description: "Tool to send a message in a ClickUp chat channel. Use when you need to post messages to team chat channels. Supports both regular messages and structured posts with optional assignments, followers, and reactions.",
    toolSlug: "CLICKUP_CREATE_CHAT_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The type of message: 'message' for regular text messages, 'post' for structured posts.",
          enum: [
            "message",
            "post",
          ],
        },
        content: {
          type: "string",
          description: "The full content of the message to be created. Supports markdown formatting.",
        },
        assignee: {
          type: "string",
          description: "The user ID of the person to assign this message to.",
        },
        followers: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user IDs to follow this message (max 10).",
        },
        post_data: {
          type: "object",
          additionalProperties: true,
          properties: {
            title: {
              type: "string",
              description: "The title of the post.",
            },
            subtype: {
              type: "string",
              description: "The subtype of the post.",
            },
          },
          description: "Data for post-type messages.",
        },
        reactions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              date: {
                type: "number",
                description: "Unix timestamp in milliseconds when the reaction was added.",
              },
              user_id: {
                type: "string",
                description: "The ID of the user who added the reaction.",
              },
              reaction: {
                type: "string",
                description: "The reaction emoji or identifier.",
              },
            },
            description: "Reaction data for a message.",
          },
          description: "Reactions to add to the message at creation time (max 10).",
        },
        channel_id: {
          type: "string",
          description: "The ID of the Channel where the message will be sent.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        content_format: {
          type: "string",
          description: "Format of the message content.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        group_assignee: {
          type: "string",
          description: "The group ID to assign this message to.",
        },
        triaged_action: {
          type: "integer",
          description: "The triaged action applied to the message: 1 or 2.",
        },
        triaged_object_id: {
          type: "string",
          description: "The message triaged action object ID.",
        },
        triaged_object_type: {
          type: "integer",
          description: "The message triaged action object type.",
        },
      },
      required: [
        "workspace_id",
        "channel_id",
        "type",
        "content",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Create chat message.",
    ],
  }),
  composioTool({
    name: "clickup_create_chat_reaction",
    description: "Tool to add a reaction to a ClickUp chat message. Use when you need to react to a message with an emoji.",
    toolSlug: "CLICKUP_CREATE_CHAT_REACTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        reaction: {
          type: "string",
          description: "The emoji reaction to add, in shortcode format (e.g., '+1', '-1', 'thumbsup', 'heart', 'smile'). Use GitHub-style shortcodes without colons.",
        },
        message_id: {
          type: "string",
          description: "The ID of the chat message to react to.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace containing the chat message.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
        "reaction",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "reactions",
    ],
    askBefore: [
      "Confirm the parameters before executing Create chat reaction.",
    ],
  }),
  composioTool({
    name: "clickup_create_chat_view_comment",
    description: "Posts a new comment to a specified ClickUp Chat view; the 'view_id' must correspond to an existing and accessible Chat view.",
    toolSlug: "CLICKUP_CREATE_CHAT_VIEW_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        view_id: {
          type: "string",
          description: "The unique identifier of the Chat view where the comment will be posted.",
        },
        notify_all: {
          type: "boolean",
          description: "If `True`, notifications for this comment will be sent to all members of the Chat view, including the comment creator. If `False`, notifications will follow standard ClickUp behavior.",
        },
        comment_text: {
          type: "string",
          description: "The text content of the comment to be added.",
        },
      },
      required: [
        "view_id",
        "comment_text",
        "notify_all",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create chat view comment.",
    ],
  }),
  composioTool({
    name: "clickup_create_checklist",
    description: "Creates a new checklist with a specified name within an existing task, which can be identified by its standard ID or a custom task ID (if `custom_task_ids` is true, `team_id` is also required).",
    toolSlug: "CLICKUP_CREATE_CHECKLIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new checklist.",
        },
        task_id: {
          type: "string",
          description: "Unique identifier of the task for the new checklist; can be a standard or custom task ID (if `custom_task_ids` is true).",
        },
        team_id: {
          type: "string",
          description: "Team's unique identifier; required only if `custom_task_ids` is true.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` is treated as a custom task ID, requiring `team_id`.",
        },
      },
      required: [
        "task_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create checklist.",
    ],
  }),
  composioTool({
    name: "clickup_create_checklist_item",
    description: "Creates a new checklist item within a specified, existing checklist, optionally setting the item's name and assigning it to a user.",
    toolSlug: "CLICKUP_CREATE_CHECKLIST_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new checklist item.",
        },
        assignee: {
          type: "integer",
          description: "User ID of the ClickUp user to whom this item will be assigned. If omitted, the item will be unassigned.",
        },
        checklist_id: {
          type: "string",
          description: "UUID of the parent checklist where the new item will be created; this checklist must already exist.",
        },
      },
      required: [
        "checklist_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create checklist item.",
    ],
  }),
  composioTool({
    name: "clickup_create_direct_message_channel",
    description: "Tool to create a direct message channel in ClickUp. Use when you need to start a direct message conversation with up to 15 users. A Self DM is created when no user IDs are provided.",
    toolSlug: "CLICKUP_CREATE_DIRECT_MESSAGE_CHANNEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The unique user IDs of participants in the direct message chat, up to 15. A Self DM is created when no user IDs are provided.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace where the direct message channel will be created.",
        },
      },
      required: [
        "workspace_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
    ],
    askBefore: [
      "Confirm the parameters before executing Create direct message channel.",
    ],
  }),
  composioTool({
    name: "clickup_create_doc",
    description: "Tool to create a new ClickUp Doc in a Workspace (v3 Docs API) and return the new doc_id for follow-up page/content operations. Use when you need to create a new document in ClickUp.",
    toolSlug: "CLICKUP_CREATE_DOC",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name/title for the new document.",
        },
        parent_id: {
          type: "string",
          description: "Optional parent location ID (space, folder, or list ID) where the doc should be created. If omitted, the doc will be created at the workspace level.",
        },
        parent_type: {
          type: "string",
          description: "Type of parent location. Required if parent_id is provided. Must be 'space', 'folder', or 'list'.",
          enum: [
            "space",
            "folder",
            "list",
          ],
        },
        workspace_id: {
          type: "string",
          description: "The workspace ID where the document will be created.",
        },
      },
      required: [
        "workspace_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "docs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Doc.",
    ],
  }),
  composioTool({
    name: "clickup_create_doc_page",
    description: "Tool to create a page in a ClickUp Doc (v3 Docs API). Use when you need to add a new page to an existing document, either as a root page or as a sub-page under a parent page.",
    toolSlug: "CLICKUP_CREATE_DOC_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the new page. If not provided, page will be created with an empty name.",
        },
        doc_id: {
          type: "string",
          description: "The ID of the doc in format '{alphanumeric_prefix}-{number}' (e.g., '2kz0k9bp-1096'). To get a valid doc_id, use CLICKUP_CLICK_UP_SEARCH_DOCS or extract from a ClickUp Doc URL.",
        },
        content: {
          type: "string",
          description: "The content of the new page. Supports markdown or plain text based on content_format.",
        },
        sub_title: {
          type: "string",
          description: "The subtitle of the new page.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace. Obtain this from the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST or CLICKUP_CLICK_UP_SEARCH_DOCS action.",
        },
        content_format: {
          type: "string",
          description: "The format the page content is in. Defaults to 'text/md' for markdown.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        parent_page_id: {
          type: "string",
          description: "The ID of the parent page. If provided, the new page will be created as a sub-page. If omitted, this will be a root page in the Doc.",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "docs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Doc Page.",
    ],
  }),
  composioTool({
    name: "clickup_create_folder",
    description: "Creates a new ClickUp Folder within the specified Space, which must exist and be accessible.",
    toolSlug: "CLICKUP_CREATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the Folder to be created.",
        },
        space_id: {
          type: "string",
          description: "Numerical ID of the Space in which to create the Folder.",
        },
      },
      required: [
        "space_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "folders",
    ],
    askBefore: [
      "Confirm the parameters before executing Create folder.",
    ],
  }),
  composioTool({
    name: "clickup_create_folder_view",
    description: "Creates a new, highly customizable view within a specific ClickUp folder using its `folder_id`.",
    toolSlug: "CLICKUP_CREATE_FOLDER_VIEW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new view.",
        },
        type: {
          type: "string",
          description: "The type of view to create. Options include: `list`, `board`, `calendar`, `table`, `timeline`, `workload`, `activity`, `map`, `conversation`, or `gantt`. ",
        },
        folder_id: {
          type: "string",
          description: "Numeric ID of the folder where the new view will be created.",
        },
        divide__dir: {
          type: "string",
          description: "This field must be `null` (None). It is intended for specifying sort direction within divided sections, but its configuration is not fully detailed.",
        },
        filters__op: {
          type: "string",
          description: "Operator for combining filters. The available operator (`op`) values are `AND` and `OR`. Required when any filter parameter is provided.",
        },
        divide__field: {
          type: "string",
          description: "This field must be `null` (None). It is intended for view division features (e.g., swimlanes) whose specific configuration via this parameter is not fully detailed.",
        },
        grouping__dir: {
          type: "integer",
          description: "Set a group sort order. Use `1` for ascending (e.g., urgent priority at top of the view, and tasks with no priority at the bottom) or `-1` to reverse the order (e.g., tasks with no priority at the top). Required when any grouping parameter is provided.",
        },
        columns__fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of field objects to display as columns in the view. Each element must be an object. Custom Fields require the `_cf` prefix followed by the Custom Field ID (e.g., `_cf_xxxxxxxx`).",
        },
        filters__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to filter by. Each element represents a filter condition. View the list of available fields in ClickUp's API documentation. Required when any filter parameter is provided.",
        },
        filters__search: {
          type: "string",
          description: "Text string to search for within tasks, comments, and subtasks in the view. Required when any filter parameter is provided.",
        },
        grouping__field: {
          type: "string",
          description: "Field to group tasks by. Options include: `none`, `status`, `priority`, `assignee`, `tag`, or `dueDate`. When any grouping parameter is provided, `grouping__field`, `grouping__dir`, `grouping__collapsed`, and `grouping__ignore` are all required.",
        },
        sorting__fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Fields to sort tasks by. Each element must be an object with 'field' and 'dir' properties. 'dir' should be 1 for ascending or -1 for descending. Refer to ClickUp API for the exact structure.",
        },
        grouping__ignore: {
          type: "boolean",
          description: "If `true`, tasks with no value for the `grouping__field` will not be grouped and will appear in a separate 'Ungrouped' section. Required when any grouping parameter is provided.",
        },
        divide__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of identifiers for divided sections to collapse by default, or null if no sections should be collapsed.",
        },
        grouping__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of group identifiers (e.g., status names like 'Open', assignee IDs as strings like '123') that should be initially collapsed in the view. These identifiers depend on the `grouping__field` used. Required when any grouping parameter is provided.",
        },
        filters__show__closed: {
          type: "boolean",
          description: "If `true`, tasks with a closed status are included in the view.",
        },
        settings__me__comments: {
          type: "boolean",
          description: "In 'Me Mode', if `true`, show only comments where the current user is mentioned or assigned.",
        },
        settings__me__subtasks: {
          type: "boolean",
          description: "In 'Me Mode', if `true`, show only subtasks assigned to the current user.",
        },
        settings__show__images: {
          type: "boolean",
          description: "If `true`, display task cover images or image attachments.",
        },
        settings__me__checklists: {
          type: "boolean",
          description: "In 'Me Mode', if `true`, show only checklists assigned to the current user.",
        },
        settings__show__subtasks: {
          type: "integer",
          description: "Controls subtask visibility. Acceptable integer values are `1` (show subtasks as separate tasks), `2` (expand subtasks under parent tasks), or `3` (collapse subtasks under parent tasks). ",
        },
        team__sidebar__assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user IDs (as strings). Tasks assigned to these users will appear in the 'Assignees' section of the team sidebar.",
        },
        settings__show__assignees: {
          type: "boolean",
          description: "If `true`, display task assignees.",
        },
        settings__show__task__locations: {
          type: "boolean",
          description: "If `true`, display the List, Folder, and Space location for tasks. When any settings parameter is provided, a complete settings object with all settings keys is required.",
        },
        settings__show__closed__subtasks: {
          type: "boolean",
          description: "If `true`, include closed subtasks in the view.",
        },
        team__sidebar__unassigned__tasks: {
          type: "boolean",
          description: "If `true`, unassigned tasks will be shown in the team sidebar.",
        },
        team__sidebar__assigned__comments: {
          type: "boolean",
          description: "If `true`, comments assigned to users will be shown in the team sidebar.",
        },
        settings__collapse__empty__columns: {
          type: "string",
          description: "Specifies whether to collapse columns with no tasks (e.g., in Board view). Common string values are 'true' or 'false'.",
        },
        settings__show__subtask__parent__names: {
          type: "boolean",
          description: "If `true`, display parent task names for subtasks.",
        },
      },
      required: [
        "folder_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "Confirm the parameters before executing Create folder view.",
    ],
  }),
  composioTool({
    name: "clickup_create_folderless_list",
    description: "Creates a new folderless list (a list not part of any Folder) directly within a specified ClickUp Space.",
    toolSlug: "CLICKUP_CREATE_FOLDERLESS_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new folderless list.",
        },
        status: {
          type: "string",
          description: "List color (e.g., 'red', 'blue_blended'), distinct from task statuses within the list. Null for no color.",
        },
        content: {
          type: "string",
          description: "Description for the list (plain text or markdown).",
        },
        assignee: {
          type: "integer",
          description: "`user_id` of the list owner. Null for no specific owner.",
        },
        due_date: {
          type: "integer",
          description: "Due date for the list (POSIX timestamp in milliseconds).",
        },
        priority: {
          type: "integer",
          description: "Priority level: `1` (Urgent), `2` (High), `3` (Normal), `4` (Low). Null to remove priority.",
        },
        space_id: {
          type: "string",
          description: "Identifier of the Space for the new folderless list.",
        },
        due_date_time: {
          type: "boolean",
          description: "Indicates if `due_date` includes time (`true`) or is all-day (`false`). Required if `due_date` is set.",
        },
      },
      required: [
        "space_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create folderless list.",
    ],
  }),
  composioTool({
    name: "clickup_create_goal",
    description: "Creates a new goal in a ClickUp Team (Workspace).",
    toolSlug: "CLICKUP_CREATE_GOAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the goal.",
        },
        color: {
          type: "string",
          description: "Hex color string to associate with the goal.",
        },
        owners: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "List of user IDs to be assigned as owners of the goal.",
        },
        team_id: {
          type: "string",
          description: "Numeric ID of the ClickUp Team (Workspace) where the goal will be created.",
        },
        due_date: {
          type: "integer",
          description: "Due date for the goal, as a Unix timestamp in milliseconds.",
        },
        description: {
          type: "string",
          description: "Detailed description for the goal.",
        },
        multiple_owners: {
          type: "boolean",
          description: "Set to `true` if the goal will have multiple owners; `false` for a single owner.",
        },
      },
      required: [
        "team_id",
        "description",
        "name",
        "due_date",
        "multiple_owners",
        "owners",
        "color",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "Confirm the parameters before executing Create goal.",
    ],
  }),
  composioTool({
    name: "clickup_create_key_result",
    description: "Creates a new Key Result (Target) for a specified Goal in ClickUp to define and track measurable objectives towards achieving that Goal.",
    toolSlug: "CLICKUP_CREATE_KEY_RESULT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for the new Key Result.",
        },
        type: {
          type: "string",
          description: "Specifies the type of the Key Result, which determines how progress is tracked. Supported types: 'number', 'currency', 'boolean', 'percentage', 'automatic'.",
        },
        unit: {
          type: "string",
          description: "The unit of measurement for Key Results of type 'number', 'currency', or 'percentage' (e.g., '$', '%', 'items'). This may not be applicable for 'boolean' or 'automatic' types where progress is count-based.",
        },
        owners: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "A list of numerical user IDs to be assigned as owners of this Key Result.",
        },
        goal_id: {
          type: "string",
          description: "The unique identifier (UUID) of the parent Goal for which this Key Result is being created.",
        },
        list_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of List UUIDs to link to this Key Result. Can be used with 'automatic' type Key Results to track progress based on tasks within these lists.",
        },
        task_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of task UUIDs to link to this Key Result. Often used when `type` is 'automatic' to track progress via the completion status of these linked tasks.",
        },
        steps_end: {
          type: "integer",
          description: "The target value indicating Key Result completion. For 'boolean' type, use 1 for true/complete. For 'automatic' type, this is often the total count of items to complete (e.g., number of linked tasks).",
        },
        steps_start: {
          type: "integer",
          description: "The initial value for tracking Key Result progress. For 'boolean' type, use 0 for false/incomplete, 1 for true/complete. For 'automatic' type, this is often the initial count (e.g., 0).",
        },
      },
      required: [
        "goal_id",
        "name",
        "owners",
        "type",
        "steps_start",
        "steps_end",
        "unit",
        "task_ids",
        "list_ids",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "Confirm the parameters before executing Create key result.",
    ],
  }),
  composioTool({
    name: "clickup_create_list",
    description: "Creates a new list in ClickUp within an existing folder. This action requires a folder_id - lists cannot be created directly in a Space using this action. If you need to create a list directly in a Space (without placing it in a folder), use the 'CLICKUP_CREATE_FOLDERLESS_LIST' action with space_id instead.",
    toolSlug: "CLICKUP_CREATE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name to be assigned to the new list.",
        },
        status: {
          type: "string",
          description: "Optional. Defines the list's color in the ClickUp UI (e.g., 'red', 'blue'). **Important:** This 'status' refers to the visual color of the list itself, not the workflow statuses (like 'To Do', 'In Progress') of tasks within the list.",
        },
        content: {
          type: "string",
          description: "Optional descriptive content or notes for the list.",
        },
        assignee: {
          type: "integer",
          description: "Optional. Numerical user ID of the assignee.",
        },
        due_date: {
          type: "integer",
          description: "Optional due date for the list, represented as a POSIX timestamp in milliseconds. For example, `1695110307000` for September 19, 2023, 07:58:27 AM GMT.",
        },
        priority: {
          type: "integer",
          description: "Optional priority level for the list. Integer values map to: 1 (Urgent), 2 (High), 3 (Normal), 4 (Low).",
        },
        folder_id: {
          type: "string",
          description: "The unique numerical identifier of the folder where the new list will be created. Note: This action creates a list within an existing folder. A folder_id is required and space_id cannot be used. If you want to create a list directly in a Space (without a folder), use the 'CLICKUP_CREATE_FOLDERLESS_LIST' action instead.",
        },
        due_date_time: {
          type: "boolean",
          description: "Optional. A boolean flag indicating whether the `due_date` includes a specific time. If `True`, the time component of `due_date` is respected. If `False` or not provided, the list is considered due on the entire day specified by `due_date`.",
        },
      },
      required: [
        "folder_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create list.",
    ],
  }),
  composioTool({
    name: "clickup_create_list_comment",
    description: "Adds a new comment with specific text to an existing and accessible ClickUp List, assigns it to a user, and sets notification preferences for all list members.",
    toolSlug: "CLICKUP_CREATE_LIST_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Unique identifier of the ClickUp list where the comment will be posted.",
        },
        assignee: {
          type: "integer",
          description: "User ID to assign this comment to, converting it into an actionable item. If omitted, creates an unassigned comment.",
        },
        notify_all: {
          type: "boolean",
          description: "If true, notifications are sent to everyone including the creator. If false or omitted, default notification rules apply.",
        },
        comment_text: {
          type: "string",
          description: "Text content of the comment. Supports ClickUp formatting (mentions, markdown).",
        },
      },
      required: [
        "list_id",
        "comment_text",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create list comment.",
    ],
  }),
  composioTool({
    name: "clickup_create_list_from_template",
    description: "Creates a new list from a template in a specified ClickUp folder. Use this when you need to instantiate a list based on an existing template within a folder structure.",
    toolSlug: "CLICKUP_CREATE_LIST_FROM_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new list created from the template.",
        },
        folder_id: {
          type: "integer",
          description: "The ID of the folder where the list will be created.",
        },
        template_id: {
          type: "string",
          description: "The ID of the template to use for creating the list.",
        },
      },
      required: [
        "folder_id",
        "template_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create list from template in folder.",
    ],
  }),
  composioTool({
    name: "clickup_create_list_view",
    description: "Creates a new, customizable view (e.g., list, board, calendar) within a specified ClickUp List, requiring an existing list_id accessible by the user.",
    toolSlug: "CLICKUP_CREATE_LIST_VIEW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new view.",
        },
        type: {
          type: "string",
          description: "View type (e.g., `list`, `board`, `calendar`, `table`, `timeline`, `workload`, `activity`, `map`, `conversation`, `gantt`).",
        },
        list_id: {
          type: "string",
          description: "Numeric ID of the List where the new view will be created.",
        },
        divide__dir: {
          type: "integer",
          description: "Direction for secondary grouping: `1` for ascending, `-1` for descending.",
        },
        filters__op: {
          type: "string",
          description: "Logical operator for combining filters: `AND` for all conditions, `OR` for any condition.",
        },
        divide__field: {
          type: "string",
          description: "Field for secondary grouping (dividing tasks within primary groups).",
        },
        grouping__dir: {
          type: "integer",
          description: "Group sort order: `1` for ascending (e.g., urgent priority top), `-1` for descending (e.g., no priority top).",
        },
        columns__fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              field: {
                type: "string",
                description: "Field identifier for the column (e.g., 'name', 'status', 'assignee', 'dueDate', or '_cf_FIELD_ID' for Custom Fields).",
              },
            },
            description: "Input model for column field configuration.",
          },
          description: "Array of column field objects. Each object must have 'field' (e.g., 'name', 'status', 'assignee', 'dueDate', or '_cf_FIELD_ID' for Custom Fields).",
        },
        filters__fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              op: {
                type: "string",
                description: "Filter operator (e.g., 'EQ', 'NOT', 'IN', 'ANY', 'ALL', 'NOT ANY', 'NOT ALL', 'IS SET', 'IS NOT SET').",
              },
              field: {
                type: "string",
                description: "Field to filter on (e.g., 'assignee', 'status', 'priority', 'tags').",
              },
              values: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Values to filter against.",
              },
            },
            description: "Input model for filter field configuration.",
          },
          description: "Array of filter field objects. Each object must have 'field' (e.g., 'assignee', 'status', 'priority', 'tags'), 'op' (e.g., 'EQ', 'NOT', 'IN', 'ANY'), and 'values' (array of filter values). Required when any filter parameter is provided.",
        },
        filters__search: {
          type: "string",
          description: "Search string to filter tasks by name or content.",
        },
        grouping__field: {
          type: "string",
          description: "Field for grouping tasks (e.g., `none`, `status`, `priority`, `assignee`, `tag`, `dueDate`).",
        },
        sorting__fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              dir: {
                type: "integer",
                description: "Sort direction: 1 for ascending, -1 for descending.",
              },
              field: {
                type: "string",
                description: "Field to sort by (e.g., 'dateCreated', 'name', 'dueDate', 'priority').",
              },
            },
            description: "Input model for sort field configuration.",
          },
          description: "Array of sort field objects. Each object must have 'field' (e.g., 'dateCreated', 'name', 'dueDate', 'priority') and optionally 'dir' (1 for ascending, -1 for descending).",
        },
        grouping__ignore: {
          type: "boolean",
          description: "If `true`, hides tasks not falling into any specified group.",
        },
        divide__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of identifiers for divided sections to collapse by default, or null if no sections should be collapsed.",
        },
        grouping__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of group identifiers (e.g., status names, assignee IDs) to collapse by default.",
        },
        filters__show__closed: {
          type: "boolean",
          description: "If `true`, includes closed tasks in the view.",
        },
        settings__me__comments: {
          type: "boolean",
          description: "If `true`, enables 'Me Mode' for comments, filtering to tasks where the current user is involved in comments.",
        },
        settings__me__subtasks: {
          type: "boolean",
          description: "If `true`, enables 'Me Mode' for subtasks, filtering to subtasks assigned to the current user.",
        },
        settings__show__images: {
          type: "boolean",
          description: "If `true`, displays cover images or image attachments for tasks.",
        },
        settings__me__checklists: {
          type: "boolean",
          description: "If `true`, enables 'Me Mode' for checklists, filtering to tasks with checklists assigned to the current user.",
        },
        settings__show__subtasks: {
          type: "integer",
          description: "Subtask visibility: `1` (separate tasks), `2` (expanded under parent), `3` (collapsed under parent).",
        },
        team__sidebar__assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user IDs for quick assignee filtering in the team sidebar.",
        },
        settings__show__assignees: {
          type: "boolean",
          description: "If `true`, shows assignees' avatars or names on tasks.",
        },
        settings__show__task__locations: {
          type: "boolean",
          description: "If `true`, displays task's location (e.g., List, Folder, Space) in the view.",
        },
        settings__show__closed__subtasks: {
          type: "boolean",
          description: "If `true`, displays closed subtasks in the view.",
        },
        team__sidebar__unassigned__tasks: {
          type: "boolean",
          description: "If `true`, team sidebar includes filter for unassigned tasks.",
        },
        team__sidebar__assigned__comments: {
          type: "boolean",
          description: "If `true`, team sidebar includes filter for tasks with assigned comments.",
        },
        settings__collapse__empty__columns: {
          type: "string",
          description: "Controls collapsing of empty columns. Values like 'true', 'false', or specific keywords (see ClickUp API).",
        },
        settings__show__subtask__parent__names: {
          type: "boolean",
          description: "If `true`, displays parent task names alongside subtasks.",
        },
      },
      required: [
        "list_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "Confirm the parameters before executing Create list view.",
    ],
  }),
  composioTool({
    name: "clickup_create_location_chat_channel",
    description: "Tool to create a Channel on a Space, Folder, or List in ClickUp. Use when you need to create a location-based chat channel.",
    toolSlug: "CLICKUP_CREATE_LOCATION_CHAT_CHANNEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        topic: {
          type: "string",
          description: "The topic/name of the chat channel being created.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              description: "The ID of the location (space, folder, or list) where the channel will be created.",
            },
            type: {
              type: "string",
              description: "The type of location: 'space', 'folder', or 'list'.",
              enum: [
                "space",
                "folder",
                "list",
              ],
            },
          },
          description: "The location (space, folder, or list) where the channel will be created.",
        },
        user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optionally specify unique user IDs to add to the channel, up to 100.",
        },
        visibility: {
          type: "string",
          description: "Visibility setting for the chat channel.",
          enum: [
            "PUBLIC",
            "PRIVATE",
          ],
        },
        description: {
          type: "string",
          description: "The description for the chat channel being created.",
        },
        workspace_id: {
          type: "string",
          description: "The ID of the Workspace where the channel will be created.",
        },
      },
      required: [
        "workspace_id",
        "location",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "channels",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Location Chat Channel.",
    ],
  }),
  composioTool({
    name: "clickup_create_reply_message",
    description: "Tool to create a reply to a chat message in ClickUp. Use when replying to an existing chat message. Requires workspace_id, message_id, type, and content.",
    toolSlug: "CLICKUP_CREATE_REPLY_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The type of message.",
          enum: [
            "message",
            "post",
          ],
        },
        content: {
          type: "string",
          description: "The full content of the message to be created.",
        },
        assignee: {
          type: "string",
          description: "The possible assignee of the message.",
        },
        followers: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The ids of the followers of the message.",
        },
        post_data: {
          type: "object",
          additionalProperties: true,
          properties: {
            title: {
              type: "string",
              description: "The title of the post message.",
            },
            subtype: {
              type: "string",
              description: "The subtype of the post message.",
            },
          },
          description: "Data for post-type messages.",
        },
        reactions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              date: {
                type: "number",
                description: "Unix timestamp in milliseconds when the reaction was created.",
              },
              user_id: {
                type: "string",
                description: "The ID of the user who created the reaction.",
              },
              reaction: {
                type: "string",
                description: "The reaction emoji or identifier.",
              },
            },
            description: "Individual reaction to a message.",
          },
          description: "The reactions to the message that exist at creation time.",
        },
        message_id: {
          type: "string",
          description: "The ID of the specified message to reply to.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        content_format: {
          type: "string",
          description: "Format of the message content.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        group_assignee: {
          type: "string",
          description: "The possible group assignee of the message.",
        },
        triaged_action: {
          type: "integer",
          description: "The triaged action applied to the message. 1 or 2.",
        },
        triaged_object_id: {
          type: "string",
          description: "The message triaged action object id.",
        },
        triaged_object_type: {
          type: "integer",
          description: "The message triaged action object type.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
        "type",
        "content",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Create reply message.",
    ],
  }),
  composioTool({
    name: "clickup_create_space",
    description: "Creates a new ClickUp Space within a specified Workspace, allowing feature configuration which defaults to Workspace settings if unspecified.",
    toolSlug: "CLICKUP_CREATE_SPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new Space.",
        },
        team_id: {
          type: "string",
          description: "Numeric ID of the Workspace (Team) for the new Space.",
        },
        multiple_assignees: {
          type: "boolean",
          description: "Enable/disable multiple assignees for tasks in this Space.",
        },
        features__tags__enabled: {
          type: "boolean",
          description: "Enable/disable Tags. Defaults to Workspace setting if `None`.",
        },
        features__checklists__enabled: {
          type: "boolean",
          description: "Enable/disable Checklists. Defaults to Workspace setting if `None`.",
        },
        features__due__dates__enabled: {
          type: "boolean",
          description: "Enable/disable Due Dates. Defaults to Workspace setting if `None`.",
        },
        features__portfolios__enabled: {
          type: "boolean",
          description: "Enable/disable Portfolios. Defaults to Workspace setting if `None`.",
        },
        features__custom__fields__enabled: {
          type: "boolean",
          description: "Enable/disable Custom Fields. Defaults to Workspace setting if `None`.",
        },
        features__due__dates__start__date: {
          type: "boolean",
          description: "Enable/disable Start Date for Due Dates (if Due Dates enabled). Defaults to Workspace setting if `None`.",
        },
        features__time__tracking__enabled: {
          type: "boolean",
          description: "Enable/disable Time Tracking. Defaults to Workspace setting if `None`.",
        },
        features__time__estimates__enabled: {
          type: "boolean",
          description: "Enable/disable Time Estimates. Defaults to Workspace setting if `None`.",
        },
        features__dependency__warning__enabled: {
          type: "boolean",
          description: "Enable/disable Dependency Warning (shows conflict warnings). Defaults to Workspace setting if `None`.",
        },
        features__remap__dependencies__enabled: {
          type: "boolean",
          description: "Enable/disable Remap Dependencies (auto-adjusts task dates). Defaults to Workspace setting if `None`.",
        },
        features__due__dates__remap__due__dates: {
          type: "boolean",
          description: "Enable/disable subtask due date remapping (if Due Dates enabled). Defaults to Workspace setting if `None`.",
        },
        features__due__dates__remap__closed__due__date: {
          type: "boolean",
          description: "Enable/disable closed subtask due date remapping (if Due Dates & subtask remapping enabled). Defaults to Workspace setting if `None`.",
        },
      },
      required: [
        "team_id",
        "name",
        "multiple_assignees",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "spaces",
    ],
    askBefore: [
      "Confirm the parameters before executing Create space.",
    ],
  }),
  composioTool({
    name: "clickup_create_space_tag",
    description: "Creates a new tag (name, foreground color, background color) in an existing ClickUp Space.",
    toolSlug: "CLICKUP_CREATE_SPACE_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "Numeric ID of the Space to create the tag in.",
        },
        tag__name: {
          type: "string",
          description: "Name for the new tag. This parameter maps to the nested `tag.name` field in the API request.",
        },
        tag__tag_bg: {
          type: "string",
          description: "Hexadecimal background color for the tag. This parameter maps to the nested `tag.tag_bg` field in the API request.",
        },
        tag__tag_fg: {
          type: "string",
          description: "Hexadecimal foreground (text) color for the tag. This parameter maps to the nested `tag.tag_fg` field in the API request.",
        },
      },
      required: [
        "space_id",
        "tag__name",
        "tag__tag_fg",
        "tag__tag_bg",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Create space tag.",
    ],
  }),
  composioTool({
    name: "clickup_create_space_view",
    description: "Creates a customizable view (e.g., List, Board, Gantt) within a specified ClickUp Space, allowing configuration of grouping, sorting, filtering, and display settings.",
    toolSlug: "CLICKUP_CREATE_SPACE_VIEW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for the new view.",
        },
        type: {
          type: "string",
          description: "The type of view to create. Valid options include: `list`, `board`, `calendar`, `table`, `timeline`, `workload`, `activity`, `map`, `conversation`, or `gantt`.",
        },
        space_id: {
          type: "string",
          description: "The unique identifier of the Space where the new view will be created.",
        },
        divide__dir: {
          type: "string",
          description: "Sort order for divided sections. Must be `None` if included, as sort direction for divisions may not be applicable here.",
        },
        filters__op: {
          type: "string",
          description: "Logical operator (`AND` or `OR`) for combining filters. When ANY filter parameter is provided, ALL filter fields (op, fields, search, show_closed) are required. Defaults to 'AND' if not specified when other filter fields are present.",
        },
        divide__field: {
          type: "string",
          description: "Field to divide tasks by. Must be `None` if included, as division by field may not be applicable for Space views via this action.",
        },
        grouping__dir: {
          type: "integer",
          description: "Group sort order: `1` for ascending, `-1` for descending. Required when any grouping parameter is provided.",
        },
        columns__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Field identifiers for columns. Use standard field names (e.g., 'status') or Custom Field IDs with `_cf` prefix (e.g., 'ID_cf').",
        },
        filters__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to apply filters on. When ANY filter parameter is provided, ALL filter fields (op, fields, search, show_closed) are required. Defaults to empty array if not specified when other filter fields are present. Refer to ClickUp API documentation for available filterable fields and their syntax.",
        },
        filters__search: {
          type: "string",
          description: "A search string to filter tasks by keywords or specific criteria within the view. When ANY filter parameter is provided, ALL filter fields (op, fields, search, show_closed) are required. Defaults to empty string if not specified when other filter fields are present.",
        },
        grouping__field: {
          type: "string",
          description: "The field to group tasks by. Options include: `none`, `status`, `priority`, `assignee`, `tag`, or `dueDate`. When any grouping parameter is provided, `grouping__field`, `grouping__dir`, `grouping__collapsed`, and `grouping__ignore` are all required.",
        },
        sorting__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to sort tasks by (e.g., `dueDate`, `priority`). Refer to ClickUp API documentation for a complete list of sortable fields.",
        },
        grouping__ignore: {
          type: "boolean",
          description: "If `True`, tasks not matching grouping criteria are hidden; otherwise, they are shown in a default group. Required when any grouping parameter is provided.",
        },
        divide__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of identifiers for divided sections to collapse by default, or null if no sections should be collapsed.",
        },
        grouping__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of string identifiers for groups that should be collapsed by default (e.g., status names like 'Closed', or assignee user IDs if grouping by assignee). Required when any grouping parameter is provided.",
        },
        filters__show__closed: {
          type: "boolean",
          description: "If `True`, closed tasks are included in the view. When ANY filter parameter is provided, ALL filter fields (op, fields, search, show_closed) are required. Defaults to false if not specified when other filter fields are present.",
        },
        settings__me__comments: {
          type: "boolean",
          description: "If `True`, in 'Me Mode', this setting filters for or highlights tasks where the current user has made comments. When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
        settings__me__subtasks: {
          type: "boolean",
          description: "If `True`, in 'Me Mode', this setting filters for or highlights subtasks assigned to the current user. When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
        settings__show__images: {
          type: "boolean",
          description: "If `True`, displays cover images or image attachments directly on task cards in the view. When ANY settings parameter is provided, ALL settings fields are required. Defaults to true if not specified when other settings fields are present.",
        },
        settings__me__checklists: {
          type: "boolean",
          description: "If `True`, in 'Me Mode', this setting filters for or highlights tasks with checklist items assigned to the current user. When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
        settings__show__subtasks: {
          type: "integer",
          description: "How subtasks are displayed: `1` (show as separate tasks), `2` (show expanded under parent task), or `3` (show collapsed under parent task). When ANY settings parameter is provided, ALL settings fields are required. Defaults to 1 if not specified when other settings fields are present.",
        },
        team__sidebar__assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of user IDs (as strings) to filter by in the team sidebar.",
        },
        settings__show__assignees: {
          type: "boolean",
          description: "If `True`, displays task assignees in the view (e.g., on task cards). When ANY settings parameter is provided, ALL settings fields are required. Defaults to true if not specified when other settings fields are present.",
        },
        settings__show__task__locations: {
          type: "boolean",
          description: "If `True`, displays the task's location (List, Folder, Space). When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
        settings__show__closed__subtasks: {
          type: "boolean",
          description: "If `True`, includes closed subtasks in the view according to other filter criteria. When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
        team__sidebar__unassigned__tasks: {
          type: "boolean",
          description: "If `True`, shows unassigned tasks in the team sidebar.",
        },
        team__sidebar__assigned__comments: {
          type: "boolean",
          description: "If `True`, shows tasks with comments assigned to the current user in the team sidebar.",
        },
        settings__collapse__empty__columns: {
          type: "string",
          description: "If 'true', collapses empty columns (e.g., status columns with no tasks). Use string 'true' or 'false'. When ANY settings parameter is provided, ALL settings fields are required. Defaults to 'false' if not specified when other settings fields are present.",
        },
        settings__show__subtask__parent__names: {
          type: "boolean",
          description: "If `True`, displays the parent task name next to subtasks for clarity. When ANY settings parameter is provided, ALL settings fields are required. Defaults to false if not specified when other settings fields are present.",
        },
      },
      required: [
        "space_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "Confirm the parameters before executing Create space view.",
    ],
  }),
  composioTool({
    name: "clickup_create_task",
    description: "Creates a new ClickUp task in a specific list, optionally as a subtask if a `parent` task ID (which cannot be a subtask itself and must be in the same list) is provided.",
    toolSlug: "CLICKUP_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the new task.",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Tag names to apply.",
        },
        parent: {
          type: "string",
          description: "ID of an existing task to be the parent (creating a subtask). Parent must not be a subtask and must be in the same list.",
        },
        status: {
          type: "string",
          description: "Status name for the task. IMPORTANT: Each ClickUp list has its own unique status configuration. Common names like 'todo', 'done', or 'in progress' often do NOT exist - you must use the exact status names (case-sensitive) configured in the target list. To get valid statuses, call GET /list/{list_id} and check the 'statuses' array in the response for available status names. If omitted, uses the list's default status (recommended when valid statuses are unknown).",
        },
        list_id: {
          type: "string",
          description: "The ID of the list where the task will be created.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required only if `custom_task_ids` is `true`.",
        },
        due_date: {
          type: "integer",
          description: "Due date as a Unix timestamp in milliseconds.",
        },
        links_to: {
          type: "string",
          description: "ID of an existing task to link as a dependency.",
        },
        priority: {
          type: "integer",
          description: "Priority level: 1 (Urgent), 2 (High), 3 (Normal), 4 (Low).",
        },
        assignees: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "User IDs to assign to the task.",
        },
        notify_all: {
          type: "boolean",
          description: "`True` to send notifications to all task watchers, including the creator.",
        },
        start_date: {
          type: "integer",
          description: "Start date as a Unix timestamp in milliseconds.",
        },
        description: {
          type: "string",
          description: "Task's detailed description.",
        },
        custom_fields: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Custom fields to apply. See ClickUp API for structure.",
        },
        due_date_time: {
          type: "boolean",
          description: "`True` if `due_date` includes a specific time, `false` if it's an all-day task.",
        },
        time_estimate: {
          type: "integer",
          description: "Estimated time to complete, in milliseconds.",
        },
        custom_item_id: {
          type: "integer",
          description: "Custom task type ID. Omit or use `null` for standard tasks (recommended). Custom task types including Milestones (ID `1`) are subject to workspace plan quotas. Only specify a custom_item_id if you have confirmed the workspace has available quota for that task type. Use GET /team/{team_id}/custom_item to check available custom task types and their quotas.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Enables referencing tasks by custom task ID; requires `team_id` if `true`.",
        },
        start_date_time: {
          type: "boolean",
          description: "`True` if `start_date` includes a specific time, `false` if it's an all-day task.",
        },
        check_required_custom_fields: {
          type: "boolean",
          description: "`True` to enforce filling all required Custom Fields upon creation.",
        },
      },
      required: [
        "list_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a task.",
    ],
  }),
  composioTool({
    name: "clickup_create_task_attachment",
    description: "Uploads a file as an attachment to a specified ClickUp task using multipart/form-data.",
    toolSlug: "CLICKUP_CREATE_TASK_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The unique identifier of the task to which the attachment will be added.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team. This is required and used only if `custom_task_ids` is `true` to help locate the task by its custom ID. For example: `custom_task_ids=true&team_id=123`.",
        },
        attachment: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "The file to be uploaded as an attachment. Note: Files stored in the cloud (URLs) cannot be used - actual file content must be provided.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If `true`, indicates that `task_id` should be interpreted as a custom task ID instead of the default ClickUp task ID. If this is `true`, `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "attachment",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "attachments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create task attachment.",
    ],
  }),
  composioTool({
    name: "clickup_create_task_comment",
    description: "Adds a comment to a ClickUp task; `team_id` is required if `custom_task_ids` is true.",
    toolSlug: "CLICKUP_CREATE_TASK_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Unique task identifier for the comment. Can be standard or custom if `custom_task_ids` is true.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true to locate the task by its custom ID.",
        },
        assignee: {
          type: "integer",
          description: "The user ID of the person to whom this specific comment should be assigned or mentioned. This assigns the comment, not the task.",
        },
        notify_all: {
          type: "boolean",
          description: "If `true`, notifications for this comment will be sent to all users watching the task, including the comment's creator. If `false`, notifications will be sent according to standard ClickUp notification rules (e.g., to mentioned users, comment assignee).",
        },
        comment_text: {
          type: "string",
          description: "The text content for the comment. Supports ClickUp's comment formatting (e.g., mentions, markdown).",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` to indicate that the `task_id` provided is a custom task ID. If `true`, the `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "comment_text",
        "assignee",
        "notify_all",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create task comment.",
    ],
  }),
  composioTool({
    name: "clickup_create_task_from_template",
    description: "Creates a new task in a specified ClickUp list from a task template, using the provided name for the new task.",
    toolSlug: "CLICKUP_CREATE_TASK_FROM_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new task created from the template.",
        },
        list_id: {
          type: "string",
          description: "Numeric ID of the ClickUp list for task creation, found in the list's URL.",
        },
        template_id: {
          type: "string",
          description: "Unique string ID of the task template to use.",
        },
      },
      required: [
        "list_id",
        "template_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create task from template.",
    ],
  }),
  composioTool({
    name: "clickup_create_team",
    description: "Creates a new team (user group) with specified members in a Workspace; member IDs must be for existing users, and be aware that adding view-only guests as paid members may incur extra charges.",
    toolSlug: "CLICKUP_CREATE_TEAM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new team (user group).",
        },
        members: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "User IDs to be initial members of the new team (user group).",
        },
        team_id: {
          type: "string",
          description: "Workspace ID where the team (user group) will be created (this is referred to as 'Team ID' in the ClickUp API).",
        },
      },
      required: [
        "team_id",
        "name",
        "members",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "teams_user_groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Create team.",
    ],
  }),
  composioTool({
    name: "clickup_create_threaded_comment",
    description: "Tool to create a threaded reply to a comment in ClickUp. Use when you need to respond to an existing comment with context.",
    toolSlug: "CLICKUP_CREATE_THREADED_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        assignee: {
          type: "integer",
          description: "The user ID of the person to assign this reply to.",
        },
        comment_id: {
          type: "string",
          description: "The ID of the parent comment to reply to.",
        },
        notify_all: {
          type: "boolean",
          description: "If true, notifications for this reply will be sent to all users watching the parent comment or task. If false, notifications will be sent according to standard ClickUp notification rules.",
        },
        comment_text: {
          type: "string",
          description: "The text content of the reply. Supports ClickUp's comment formatting (e.g., mentions, markdown).",
        },
        group_assignee: {
          type: "string",
          description: "The group ID to assign this reply to.",
        },
      },
      required: [
        "comment_id",
        "comment_text",
        "notify_all",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create threaded comment.",
    ],
  }),
  composioTool({
    name: "clickup_create_webhook",
    description: "Creates a ClickUp webhook for a Team (Workspace) to notify a public URL on specified events (at least one, or '*' for all), optionally scoped to a Space, Folder, List, or Task; the endpoint must accept requests from dynamic IPs.",
    toolSlug: "CLICKUP_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        events: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Event types to subscribe to; use '*' for all events on the resource. Examples: 'taskCreated', 'taskUpdated'.",
        },
        list_id: {
          type: "string",
          description: "Optional. ID of the List to scope the webhook; triggers only for events in this List.",
        },
        task_id: {
          type: "string",
          description: "Optional. ID of the Task to scope the webhook; triggers only for events for this Task.",
        },
        team_id: {
          type: "string",
          description: "ID of the Team (Workspace) for the webhook.",
        },
        endpoint: {
          type: "string",
          description: "Publicly accessible URL for ClickUp to send POST notifications for subscribed events.",
        },
        space_id: {
          type: "string",
          description: "Optional. ID of the Space to scope the webhook; triggers only for events in this Space.",
        },
        folder_id: {
          type: "string",
          description: "Optional. ID of the Folder to scope the webhook; triggers only for events in this Folder.",
        },
      },
      required: [
        "team_id",
        "endpoint",
        "events",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create webhook.",
    ],
  }),
  composioTool({
    name: "clickup_create_workspace_everything_level_view",
    description: "Creates a new, customizable view (e.g., List, Board) at the 'Everything' level for a specified Team (Workspace ID), encompassing all tasks within that Workspace.",
    toolSlug: "CLICKUP_CREATE_WORKSPACE_EVERYTHING_LEVEL_VIEW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name for the new view.",
        },
        type: {
          type: "string",
          description: "Type of view to create (e.g., list, board, calendar).",
        },
        team_id: {
          type: "string",
          description: "Team (Workspace) ID where the 'Everything' level view will be created.",
        },
        divide__dir: {
          type: "string",
          description: "Sort direction for divided sections: `1` for ascending, `-1` for descending.",
        },
        filters__op: {
          type: "string",
          description: "Logical operator for combining filters (`AND` or `OR`).",
        },
        divide__field: {
          type: "string",
          description: "Field to divide the view by, creating separate sections (e.g., 'priority', 'status').",
        },
        grouping__dir: {
          type: "integer",
          description: "Sort order for grouped tasks: `1` for ascending, `-1` for descending.",
        },
        columns__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Columns to display and their order. Prefix Custom Fields with `_cf`. For specific configurations, use a JSON object string.",
        },
        filters__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to apply filters on. See ClickUp API docs for filterable fields.",
        },
        filters__search: {
          type: "string",
          description: "Search term to filter tasks by name, description, etc.",
        },
        grouping__field: {
          type: "string",
          description: "Field to group tasks by (e.g., status, priority).",
        },
        sorting__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to sort tasks by. See ClickUp API docs for sortable fields.",
        },
        grouping__ignore: {
          type: "boolean",
          description: "If true, tasks in closed statuses are excluded from grouping.",
        },
        divide__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of division identifiers to be collapsed by default. Must be an array (e.g., []) or null, not a boolean.",
        },
        grouping__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of group identifiers (e.g., status names, assignee IDs) to be collapsed by default.",
        },
        filters__show__closed: {
          type: "boolean",
          description: "If true, include tasks with 'Closed' status in the view.",
        },
        settings__me__comments: {
          type: "boolean",
          description: "If true, 'Me Mode' filters for tasks commented on by the current user.",
        },
        settings__me__subtasks: {
          type: "boolean",
          description: "If true, 'Me Mode' filters for subtasks assigned to the current user.",
        },
        settings__show__images: {
          type: "boolean",
          description: "If true, show task cover images or attachment previews.",
        },
        settings__me__checklists: {
          type: "boolean",
          description: "If true, 'Me Mode' filters for tasks where current user is assigned to checklist items.",
        },
        settings__show__subtasks: {
          type: "integer",
          description: "Subtask display mode: `1` (separate), `2` (expand), `3` (collapse).",
        },
        team__sidebar__assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user IDs to filter tasks by in the team sidebar.",
        },
        settings__show__assignees: {
          type: "boolean",
          description: "If true, display task assignees.",
        },
        settings__show__task__locations: {
          type: "boolean",
          description: "If true, display breadcrumb path (Space > Folder > List) for each task.",
        },
        settings__show__closed__subtasks: {
          type: "boolean",
          description: "If true, show closed subtasks according to `settings_show_subtasks`.",
        },
        team__sidebar__unassigned__tasks: {
          type: "boolean",
          description: "If true, team sidebar includes filter for unassigned tasks.",
        },
        team__sidebar__assigned__comments: {
          type: "boolean",
          description: "If true, team sidebar includes filter for tasks with assigned comments.",
        },
        settings__collapse__empty__columns: {
          type: "string",
          description: "If true, collapse or hide empty columns.",
        },
        settings__show__subtask__parent__names: {
          type: "boolean",
          description: "If true, display parent task name next to subtasks.",
        },
      },
      required: [
        "team_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "Confirm the parameters before executing Create workspace Everything level view.",
    ],
  }),
  composioTool({
    name: "clickup_delete_chat_channel",
    description: "Tool to delete a chat channel in ClickUp. Use when you need to permanently remove a chat channel from a workspace.",
    toolSlug: "CLICKUP_DELETE_CHAT_CHANNEL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        channel_id: {
          type: "string",
          description: "The ID of the chat channel to delete.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace containing the chat channel.",
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete chat channel.",
    ],
  }),
  composioTool({
    name: "clickup_delete_chat_message",
    description: "Tool to delete a chat message in ClickUp. Use when you need to permanently remove a specific message from a workspace chat.",
    toolSlug: "CLICKUP_DELETE_CHAT_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        message_id: {
          type: "string",
          description: "The ID of the specified message.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete chat message.",
    ],
  }),
  composioTool({
    name: "clickup_delete_chat_reaction",
    description: "Tool to delete a reaction from a chat message in ClickUp. Use when you need to remove an emoji reaction that was previously added to a chat message.",
    toolSlug: "CLICKUP_DELETE_CHAT_REACTION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        reaction: {
          type: "string",
          description: "The name of the reaction emoji to remove from the message (e.g., 'heart', 'thumbsup', 'smile'). Use the exact emoji name as it appears in ClickUp.",
        },
        message_id: {
          type: "string",
          description: "The ID of the chat message from which to remove the reaction.",
        },
        workspace_id: {
          type: "string",
          description: "The ID of the Workspace containing the chat message.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
        "reaction",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete chat reaction.",
    ],
  }),
  composioTool({
    name: "clickup_delete_checklist",
    description: "Permanently deletes an existing checklist identified by its `checklist_id`.",
    toolSlug: "CLICKUP_DELETE_CHECKLIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        checklist_id: {
          type: "string",
          description: "The unique identifier (UUID) of the checklist to be deleted.",
        },
      },
      required: [
        "checklist_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete checklist.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_delete_checklist_item",
    description: "Permanently deletes an existing item, identified by `checklist_item_id`, from an existing checklist, identified by `checklist_id`.",
    toolSlug: "CLICKUP_DELETE_CHECKLIST_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        checklist_id: {
          type: "string",
          description: "Unique identifier (UUID) of the checklist containing the item to be deleted.",
        },
        checklist_item_id: {
          type: "string",
          description: "Unique identifier (UUID) of the specific checklist item to be deleted.",
        },
      },
      required: [
        "checklist_id",
        "checklist_item_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete checklist item.",
    ],
  }),
  composioTool({
    name: "clickup_delete_comment",
    description: "Deletes an existing comment from a task using its `comment_id`.",
    toolSlug: "CLICKUP_DELETE_COMMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment_id: {
          type: "string",
          description: "The unique identifier of the comment to be deleted.",
        },
      },
      required: [
        "comment_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete comment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_delete_dependency",
    description: "Removes a dependency relationship for a task. Provide exactly one of: `depends_on` to remove a 'waiting on' dependency (task_id is blocked by another task), or `dependency_of` to remove a 'blocking' dependency (another task is blocked by task_id). `team_id` is required if `custom_task_ids` is true.",
    toolSlug: "CLICKUP_DELETE_DEPENDENCY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Identifier of the task from which the dependency relationship will be removed.",
        },
        team_id: {
          type: "string",
          description: "Numeric team ID, required only when `custom_task_ids` is true to scope custom task IDs.",
        },
        depends_on: {
          type: "string",
          description: "Identifier of the task that `task_id` depends on (i.e., `task_id` is waiting on this task). Provide this to remove a 'waiting on' dependency. Mutually exclusive with `dependency_of` - exactly one must be provided.",
        },
        dependency_of: {
          type: "string",
          description: "Identifier of the task that depends on `task_id` (i.e., this task is blocked by `task_id`). Provide this to remove a 'blocking' dependency. Mutually exclusive with `depends_on` - exactly one must be provided.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, interprets `task_id` and the dependency task ID as custom task IDs; `team_id` also required.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_relationships",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete dependency.",
    ],
  }),
  composioTool({
    name: "clickup_delete_folder",
    description: "Permanently and irreversibly deletes a specified folder and all its contents (Lists, Tasks) if the folder_id exists.",
    toolSlug: "CLICKUP_DELETE_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The unique numerical identifier of the folder to be deleted.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "folders",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete folder.",
    ],
  }),
  composioTool({
    name: "clickup_delete_goal",
    description: "Permanently removes an existing Goal, identified by its `goal_id`, from the Workspace.",
    toolSlug: "CLICKUP_DELETE_GOAL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        goal_id: {
          type: "string",
          description: "The unique identifier (UUID) of the Goal to be deleted.",
        },
      },
      required: [
        "goal_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete goal.",
    ],
  }),
  composioTool({
    name: "clickup_delete_key_result",
    description: "Deletes an existing Key Result, also referred to as a Target within a Goal, identified by its `key_result_id`.",
    toolSlug: "CLICKUP_DELETE_KEY_RESULT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        key_result_id: {
          type: "string",
          description: "The unique identifier (UUID) of the Key Result to be deleted. This is often referred to as a 'Target' in the context of Goals.",
        },
      },
      required: [
        "key_result_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete key result.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_delete_list",
    description: "Permanently deletes an existing List and all its contents; this action is destructive and irreversible via the API.",
    toolSlug: "CLICKUP_DELETE_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique numerical identifier of the List to be deleted. This ID can be found by navigating to the List in ClickUp; the ID is often present in the URL.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete list.",
    ],
  }),
  composioTool({
    name: "clickup_delete_space",
    description: "Permanently deletes a specified Space in ClickUp; this action is irreversible as the Space cannot be recovered via the API.",
    toolSlug: "CLICKUP_DELETE_SPACE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "Unique numerical ID of the Space to be deleted.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "spaces",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete space.",
    ],
  }),
  composioTool({
    name: "clickup_delete_space_tag",
    description: "Deletes a Tag from a Space, identified by `tag_name` in path; precise matching of Tag details in the request body (`tag_name_1`, `tag_tag_fg`, `tag_tag_bg`) is generally required for successful deletion.",
    toolSlug: "CLICKUP_DELETE_SPACE_TAG",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "Numeric identifier of the Space from which the Tag will be deleted.",
        },
        tag_name: {
          type: "string",
          description: "Name of the Tag to be deleted, used in the URL path to identify it.",
        },
        tag__name: {
          type: "string",
          description: "Name of the Tag in the request body. Though schema-optional, generally required by the API to match the Tag's actual name for successful deletion.",
        },
        tag__tag__bg: {
          type: "string",
          description: "Background color of the Tag in HEX format (e.g., '#FF5733') in the request body. Though schema-optional, generally required by the API for successful deletion.",
        },
        tag__tag__fg: {
          type: "string",
          description: "Foreground (text) color of the Tag in HEX format (e.g., '#FFFFFF') in the request body. Though schema-optional, generally required by the API for successful deletion.",
        },
      },
      required: [
        "space_id",
        "tag_name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tags",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete space tag.",
    ],
  }),
  composioTool({
    name: "clickup_delete_task",
    description: "Permanently deletes a task, using its standard ID or a custom task ID (requires `custom_task_ids=true` and `team_id`).",
    toolSlug: "CLICKUP_DELETE_TASK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Unique ID of the task to delete. Can be a standard ID or a custom task ID (if custom, `custom_task_ids` must be `true`).",
        },
        team_id: {
          type: "string",
          description: "Team ID. Required only if `custom_task_ids` is `true` to identify the team for the custom task ID.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if `task_id` is a custom ID (requires `team_id` if `true`).",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tasks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete task.",
    ],
  }),
  composioTool({
    name: "clickup_delete_task_link",
    description: "Deletes an existing link, effectively a dependency or relationship, between two ClickUp tasks; set `custom_task_ids=true` and provide `team_id` if using custom task IDs.",
    toolSlug: "CLICKUP_DELETE_TASK_LINK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the first task involved in the link. If `custom_task_ids` is `true`, this should be its custom task ID.",
        },
        team_id: {
          type: "string",
          description: "The numerical ID of the team. This parameter is required and used only when `custom_task_ids` is set to `true` to correctly scope the custom task IDs. For example: `custom_task_ids=true&team_id=123`.",
        },
        links_to: {
          type: "string",
          description: "The ID of the second task involved in the link. If `custom_task_ids` is `true`, this should be its custom task ID.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If `task_id` and `links_to` refer to custom task IDs (rather than standard ClickUp task IDs), this parameter must be set to `true`. Setting this to `true` also requires `team_id` to be provided. Defaults to `false` if not specified.",
        },
      },
      required: [
        "task_id",
        "links_to",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_relationships",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete task link.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_delete_team",
    description: "Permanently deletes an existing Team (user group) from the Workspace using its `group_id`.",
    toolSlug: "CLICKUP_DELETE_TEAM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        group_id: {
          type: "string",
          description: "The unique string identifier for the Team (user group) to be deleted.",
        },
      },
      required: [
        "group_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "teams_user_groups",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete team.",
    ],
  }),
  composioTool({
    name: "clickup_delete_time_entry",
    description: "Deletes an existing time entry, specified by `timer_id`, from a Workspace identified by `team_id`.",
    toolSlug: "CLICKUP_DELETE_TIME_ENTRY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Unique identifier of the Workspace from which the time entry will be deleted.",
        },
        timer_id: {
          type: "string",
          description: "Unique identifier of the time entry to be deleted.",
        },
      },
      required: [
        "team_id",
        "timer_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete a time entry.",
    ],
  }),
  composioTool({
    name: "clickup_delete_time_tracked",
    description: "Deletes a time-tracked interval from a task; use this legacy endpoint for older time tracking systems.",
    toolSlug: "CLICKUP_DELETE_TIME_TRACKED",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Task ID; can be standard or custom if `custom_task_ids` is set to true.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team. This is required only if `custom_task_ids` is set to `true` to correctly identify the task using its custom ID. For example: `custom_task_ids=true&team_id=123`.",
        },
        interval_id: {
          type: "string",
          description: "ID of the time tracking interval (entry) to be deleted.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if `task_id` refers to a custom task ID. If `true`, `team_id` must also be provided. If omitted or `false`, `task_id` is treated as a standard ID.",
        },
      },
      required: [
        "task_id",
        "interval_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking_legacy",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete time tracked.",
    ],
  }),
  composioTool({
    name: "clickup_delete_view",
    description: "Permanently and irreversibly deletes an existing View in ClickUp, identified by its `view_id`.",
    toolSlug: "CLICKUP_DELETE_VIEW",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        view_id: {
          type: "string",
          description: "The unique identifier of the View to be deleted.",
        },
      },
      required: [
        "view_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete view.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_delete_webhook",
    description: "Permanently removes an existing webhook, specified by its ID, thereby ceasing all its event monitoring and notifications.",
    toolSlug: "CLICKUP_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        webhook_id: {
          type: "string",
          description: "The unique identifier (UUID) of the webhook to be deleted.",
        },
      },
      required: [
        "webhook_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "webhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete webhook.",
    ],
  }),
  composioTool({
    name: "clickup_get_access_token",
    description: "Exchanges a ClickUp OAuth 2.0 authorization code (obtained after user consent) for an access token.",
    toolSlug: "CLICKUP_GET_ACCESS_TOKEN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        code: {
          type: "string",
          description: "Authorization code from ClickUp's authorization server, typically a query parameter to your redirect URI after user consent.",
        },
        client_id: {
          type: "string",
          description: "Client ID for your registered ClickUp OAuth application.",
        },
        client_secret: {
          type: "string",
          description: "Client Secret for your registered ClickUp OAuth application.",
        },
      },
      required: [
        "client_id",
        "client_secret",
        "code",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "authorization",
    ],
    askBefore: [
      "Confirm the parameters before executing Get access token.",
    ],
  }),
  composioTool({
    name: "clickup_get_accessible_custom_fields",
    description: "Retrieves all accessible Custom Field definitions for a specified ClickUp List using its `list_id`.",
    toolSlug: "CLICKUP_GET_ACCESSIBLE_CUSTOM_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Numeric ID of the specific ClickUp List.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "custom_fields",
    ],
  }),
  composioTool({
    name: "clickup_get_all_tags_from_time_entries",
    description: "Retrieves all unique tags applied to time entries within a specified ClickUp Team (Workspace).",
    toolSlug: "CLICKUP_GET_ALL_TAGS_FROM_TIME_ENTRIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique numerical identifier of the ClickUp Team (Workspace) for which to retrieve time entry tags.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking",
    ],
  }),
  composioTool({
    name: "clickup_get_authorized_user",
    description: "Retrieves the details of the currently authenticated ClickUp user.",
    toolSlug: "CLICKUP_GET_AUTHORIZED_USER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "authorization",
    ],
  }),
  composioTool({
    name: "clickup_get_bulk_tasks_time_in_status",
    description: "Retrieves the time spent in each status for multiple tasks; requires the 'Total time in Status' ClickApp to be enabled in the Workspace.",
    toolSlug: "CLICKUP_GET_BULK_TASKS_TIME_IN_STATUS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The ID of the team to which the custom task IDs belong. This field is required and used only when the `custom_task_ids` parameter is set to `true`.",
        },
        task_ids: {
          type: "string",
          description: "A comma-separated string of task IDs (e.g., 'taskID1,taskID2') for which to retrieve time in status data. You can include up to 100 task IDs per request.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if `task_ids` refer to custom task IDs instead of standard task IDs. If `true`, `team_id` must also be provided.",
        },
      },
      required: [
        "task_ids",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_channel",
    description: "Retrieves details for a specific chat channel in a ClickUp Workspace. Use when you need information about a particular chat channel.",
    toolSlug: "CLICKUP_GET_CHAT_CHANNEL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        channel_id: {
          type: "string",
          description: "The ID of the specified Channel.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        description_format: {
          type: "string",
          description: "Format options for the channel description.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
      "channels",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_channel_followers",
    description: "Tool to retrieve followers of a ClickUp chat channel. Use when you need to list users following a specific channel in a workspace.",
    toolSlug: "CLICKUP_GET_CHAT_CHANNEL_FOLLOWERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page. Default is 50, max is 100.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results. Use the next_cursor value from the previous response.",
        },
        channel_id: {
          type: "string",
          description: "The ID of the chat channel. Format example: '4-90165816748-8'.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace containing the chat channel.",
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_channel_members",
    description: "Tool to get members of a chat channel. Use when you need to retrieve the list of members in a specific ClickUp chat channel.",
    toolSlug: "CLICKUP_GET_CHAT_CHANNEL_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page. Default is 50, max is 100.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results.",
        },
        channel_id: {
          type: "string",
          description: "The ID of the specified Channel.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_channels",
    description: "Tool to retrieve chat channels in a ClickUp workspace. Use when you need to list available chat channels, DMs, or group chats in a workspace. Supports pagination via cursor and filtering by follower status, closed channels, and recent activity.",
    toolSlug: "CLICKUP_GET_CHAT_CHANNELS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page.",
        },
        cursor: {
          type: "string",
          description: "Used to request the next page of results.",
        },
        is_follower: {
          type: "boolean",
          description: "Only return Channels the user is following.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        channel_types: {
          type: "string",
          description: "Specify the types of Channels to return from the request.",
        },
        include_closed: {
          type: "boolean",
          description: "Include DMs/Group DMs that have been explicitly closed.",
        },
        description_format: {
          type: "string",
          description: "Format options for channel descriptions.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        with_message_since: {
          type: "integer",
          description: "Only return Channels with at least one message since the given timestamp (Unix milliseconds).",
        },
      },
      required: [
        "workspace_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
      "channels",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_message_reactions",
    description: "Tool to retrieve reactions on a ClickUp chat message. Use when you need to see who reacted to a message and with what emoji.",
    toolSlug: "CLICKUP_GET_CHAT_MESSAGE_REACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page. Defaults to 50.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results. Use the `next_cursor` from the previous response to paginate through reactions.",
        },
        message_id: {
          type: "string",
          description: "The ID of the specified chat message.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace containing the chat message.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_message_replies",
    description: "Retrieves replies to a chat message in ClickUp. Use when you need to fetch responses to a specific message in a workspace chat.",
    toolSlug: "CLICKUP_GET_CHAT_MESSAGE_REPLIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results.",
        },
        message_id: {
          type: "string",
          description: "The ID of the specified message.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        content_format: {
          type: "string",
          description: "Content format for message replies.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
      },
      required: [
        "workspace_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_message_tagged_users",
    description: "Tool to retrieve users tagged in a ClickUp chat message. Use when you need to get a list of users mentioned in a specific chat message.",
    toolSlug: "CLICKUP_GET_CHAT_MESSAGE_TAGGED_USERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results.",
        },
        message_id: {
          type: "string",
          description: "The ID of the specified message.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
      "messages",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_messages",
    description: "Tool to retrieve messages from a ClickUp chat channel. Use when you need to fetch chat messages for a specific channel within a workspace.",
    toolSlug: "CLICKUP_GET_CHAT_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "The maximum number of results to fetch for this page.",
        },
        cursor: {
          type: "string",
          description: "The cursor to use to fetch the next page of results.",
        },
        channel_id: {
          type: "string",
          description: "The ID of the Channel where the messages live.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        content_format: {
          type: "string",
          description: "Format options for message content.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "clickup_get_chat_view_comments",
    description: "Retrieves comments from a specified Chat view in ClickUp, supporting pagination via `start` and `start_id` to fetch comments older than the default 25 most recent.",
    toolSlug: "CLICKUP_GET_CHAT_VIEW_COMMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        start: {
          type: "integer",
          description: "Unix timestamp (milliseconds) to filter comments created at or after this time. For pagination, typically used with `start_id`.",
        },
        view_id: {
          type: "string",
          description: "Unique identifier of the Chat view from which to retrieve comments.",
        },
        start_id: {
          type: "string",
          description: "Comment ID to act as a cursor for pagination, used with `start` to retrieve comments after this ID that also meet the `start` time condition.",
        },
      },
      required: [
        "view_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "clickup_get_custom_roles",
    description: "Retrieves all Custom Roles, which allow granular permission configurations, for a specified Workspace (Team).",
    toolSlug: "CLICKUP_GET_CUSTOM_ROLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique identifier of the Workspace (Team) for which to retrieve custom roles.",
        },
        include_members: {
          type: "boolean",
          description: "If true, includes members assigned to each custom role in the response.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "roles",
    ],
  }),
  composioTool({
    name: "clickup_get_custom_task_types",
    description: "Retrieves all custom task types available within a specified Workspace (team_id).",
    toolSlug: "CLICKUP_GET_CUSTOM_TASK_TYPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Numeric ID of the Workspace (formerly Team) for which to retrieve custom task types.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "custom_task_types",
    ],
  }),
  composioTool({
    name: "clickup_get_doc_content",
    description: "Tool to fetch the full content of a ClickUp Doc including metadata and all page contents in markdown format. Use when you need to read or summarize a Doc's content given workspace_id and doc_id.",
    toolSlug: "CLICKUP_GET_DOC_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        doc_id: {
          type: "string",
          description: "The unique ClickUp Doc ID in format '{alphanumeric_prefix}-{number}' (e.g., '2kz0k9bp-1376'). IMPORTANT: Numeric-only IDs (e.g., '4017245840171325375') are View IDs, NOT Doc IDs, and will fail. To get a valid doc_id, use CLICKUP_CLICK_UP_SEARCH_DOCS or extract from a ClickUp Doc URL (format: app.clickup.com/{workspace_id}/v/dc/{doc_id}).",
        },
        page_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of specific page IDs to fetch. If provided, only these pages will be retrieved. If omitted, all pages in the doc will be fetched. Page IDs follow the same format as doc_id (e.g., '2kz0k9bp-416').",
        },
        workspace_id: {
          type: "string",
          description: "The numeric workspace ID containing the document. Obtain this from the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST or CLICKUP_CLICK_UP_SEARCH_DOCS action.",
        },
        include_page_listing_only: {
          type: "boolean",
          description: "If true, only fetch the list of pages without their content. Useful for discovering page structure without the full content retrieval overhead.",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "docs",
      "content",
    ],
  }),
  composioTool({
    name: "clickup_get_doc_page_content",
    description: "Tool to fetch a single ClickUp Doc page's content and metadata by workspace_id + doc_id + page_id (v3 Docs API). Use when you need to read the content of a specific page without fetching the entire Doc.",
    toolSlug: "CLICKUP_GET_DOC_PAGE_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        doc_id: {
          type: "string",
          description: "The unique ClickUp Doc ID in format '{alphanumeric_prefix}-{number}' (e.g., '2kz0k9bp-1376'). To get a valid doc_id, use CLICKUP_CLICK_UP_SEARCH_DOCS or extract from a ClickUp Doc URL.",
        },
        page_id: {
          type: "string",
          description: "The unique page ID to retrieve, following the same format as doc_id (e.g., '2kz0k9bp-416'). Obtain from CLICKUP_CLICK_UP_GET_DOC_CONTENT with include_page_listing_only=true or from the Doc's page structure.",
        },
        workspace_id: {
          type: "string",
          description: "The numeric workspace ID containing the document. Obtain this from the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST or CLICKUP_CLICK_UP_SEARCH_DOCS action.",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
        "page_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "docs",
    ],
  }),
  composioTool({
    name: "clickup_get_doc_page_listing",
    description: "Tool to fetch the page listing structure of a ClickUp Doc by workspace_id and doc_id. Use when you need to discover the hierarchical structure of pages and subpages within a Doc without fetching the actual content.",
    toolSlug: "CLICKUP_GET_DOC_PAGE_LISTING",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        doc_id: {
          type: "string",
          description: "The unique ClickUp Doc ID in format '{alphanumeric_prefix}-{number}' (e.g., '2kz0k9bp-1096'). To get a valid doc_id, use CLICKUP_CLICK_UP_SEARCH_DOCS or extract from a ClickUp Doc URL.",
        },
        workspace_id: {
          type: "string",
          description: "The numeric workspace ID containing the document. Obtain this from the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST or CLICKUP_CLICK_UP_SEARCH_DOCS action.",
        },
        max_page_depth: {
          type: "integer",
          description: "The maximum depth to fetch pages/subpages. A value less than 0 does not limit the depth. Defaults to -1 (unlimited depth).",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "docs",
    ],
  }),
  composioTool({
    name: "clickup_get_doc_pages_public",
    description: "Tool to fetch pages belonging to a ClickUp Doc. Use when you need to list all pages in a doc with their content and structure.",
    toolSlug: "CLICKUP_GET_DOC_PAGES_PUBLIC",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        doc_id: {
          type: "string",
          description: "The ID of the doc in format '{alphanumeric_prefix}-{number}' (e.g., '2kz0k9bp-1096'). To get a valid doc_id, use CLICKUP_CLICK_UP_SEARCH_DOCS or extract from a ClickUp Doc URL.",
        },
        workspace_id: {
          type: "string",
          description: "The ID of the Workspace. Obtain this from the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST or CLICKUP_CLICK_UP_SEARCH_DOCS action.",
        },
        content_format: {
          type: "string",
          description: "Content format options for page content.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        max_page_depth: {
          type: "integer",
          description: "The maximum depth to fetch pages/subpages. A value less than 0 does not limit the depth.",
        },
      },
      required: [
        "workspace_id",
        "doc_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "docs",
    ],
  }),
  composioTool({
    name: "clickup_get_filtered_team_tasks",
    description: "Retrieves a paginated list of tasks (up to 100 per page) from a specified workspace based on various filter criteria, respecting user access permissions. Unexpectedly missing tasks may indicate permission restrictions rather than filter issues. Task comments are not included; use CLICKUP_GET_TASK_COMMENTS for complete context. No keyword/text search is supported; filter client-side on returned results.",
    toolSlug: "CLICKUP_GET_FILTERED_TEAM_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page to fetch (starts at 0). Increment until the response's `last_page` field is true or the returned tasks list is empty to avoid silently missing tasks.",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by tag names.",
        },
        parent: {
          type: "string",
          description: "Filter by parent task ID to retrieve its subtasks.",
        },
        reverse: {
          type: "boolean",
          description: "If true, tasks are displayed in reverse order.",
        },
        team_Id: {
          type: "string",
          description: "The Workspace ID (called 'team_id' in ClickUp API v2). This is a numeric string. To find your Workspace ID, use the 'Get Authorized Teams (Workspaces)' endpoint or check Settings > Workspace Settings in the ClickUp UI.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true, for custom task ID context. Distinct from the required `team_Id` path parameter (Workspace ID); do not confuse these — this optional numeric string is only used for custom task ID resolution. Example: '9001'.",
        },
        list_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by List IDs. Must be numeric IDs (e.g., '123456789'). You can get numeric List IDs from the Get Lists endpoint.",
        },
        order_by: {
          type: "string",
          description: "Order tasks by this field. Default: `created`.",
          enum: [
            "id",
            "created",
            "updated",
            "due_date",
          ],
        },
        statuses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by task statuses (e.g., 'to do', 'in progress'). Values must exactly match workspace-configured status strings; mismatches silently return empty results.",
        },
        subtasks: {
          type: "boolean",
          description: "If true, include subtasks. Excluded by default.",
        },
        assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by assignee User IDs. Must be numeric IDs (e.g., '123456789'). You can get numeric User IDs from endpoints like Get List Members or Get Task Members.",
        },
        space_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by Space IDs. Must be numeric IDs (e.g., '123456789'). You can get numeric Space IDs from the Get Spaces endpoint.",
        },
        due_date_gt: {
          type: "integer",
          description: "Filter by due date greater than this Unix timestamp (milliseconds).",
        },
        due_date_lt: {
          type: "integer",
          description: "Filter by due date less than this Unix timestamp (milliseconds).",
        },
        project_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by Folder (Project) IDs. Must be numeric IDs (e.g., '123456789'). You can get numeric Folder IDs from the Get Folders endpoint.",
        },
        custom_items: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by custom item types (e.g., 0 for tasks, 1 for Milestones, other numbers for custom types defined in Workspace).",
        },
        date_done_gt: {
          type: "integer",
          description: "Filter by completion date greater than this Unix timestamp (milliseconds).",
        },
        date_done_lt: {
          type: "integer",
          description: "Filter by completion date less than this Unix timestamp (milliseconds).",
        },
        custom_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by custom fields. Each string in the list is a JSON object defining a single filter condition. Example for one string in the list: '''{\"field_id\": \"unique_field_id\", \"operator\": \"=\", \"value\": \"desired_value\"}'''. Incorrect `field_id` values or unsupported operator strings produce 400 errors or silently empty results; retrieve valid `field_id`s from workspace custom field configuration.",
        },
        include_closed: {
          type: "boolean",
          description: "If true, include closed tasks. Excluded by default.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to true to use custom task IDs in filters instead of global task IDs. Requires `team_id` for context.",
        },
        date_created_gt: {
          type: "integer",
          description: "Filter by creation date greater than this Unix timestamp (milliseconds).",
        },
        date_created_lt: {
          type: "integer",
          description: "Filter by creation date less than this Unix timestamp (milliseconds).",
        },
        date_updated_gt: {
          type: "integer",
          description: "Filter by update date greater than this Unix timestamp (milliseconds).",
        },
        date_updated_lt: {
          type: "integer",
          description: "Filter by update date less than this Unix timestamp (milliseconds).",
        },
        include_markdown_description: {
          type: "boolean",
          description: "If true, return task descriptions in Markdown format.",
        },
      },
      required: [
        "team_Id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "clickup_get_folder",
    description: "Retrieves detailed information about a specific folder in ClickUp.",
    toolSlug: "CLICKUP_GET_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The unique identifier of the folder.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "folders",
    ],
  }),
  composioTool({
    name: "clickup_get_folder_available_fields",
    description: "Tool to view custom fields available in a ClickUp folder. Use to discover what custom fields can be used when working with tasks in this folder. Only returns folder-level custom fields, not list-level fields.",
    toolSlug: "CLICKUP_GET_FOLDER_AVAILABLE_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The ID of the folder to retrieve available custom fields from.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "custom_fields",
      "folders",
    ],
  }),
  composioTool({
    name: "clickup_get_folder_views",
    description: "Retrieves all configured views (like List, Board, Calendar) for a specified, existing Folder in ClickUp.",
    toolSlug: "CLICKUP_GET_FOLDER_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "integer",
          description: "ID of the Folder.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_folderless_lists",
    description: "Retrieves all Lists within a specified Space that are not located in any Folder.",
    toolSlug: "CLICKUP_GET_FOLDERLESS_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter by archived status. Set to `true` to retrieve archived Lists, `false` or omit to retrieve unarchived Lists.",
        },
        space_id: {
          type: "string",
          description: "The ID of the Space from which to retrieve folderless Lists.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "clickup_get_folders",
    description: "Retrieves Folders within a specified ClickUp Space, ensuring `space_id` is valid, with an option to filter by archived status.",
    toolSlug: "CLICKUP_GET_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter Folders by archived status. `True` for archived, `False` for unarchived. Omit to return both.",
        },
        space_id: {
          type: "string",
          description: "The unique numeric identifier of the Space from which to retrieve Folders.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "folders",
    ],
  }),
  composioTool({
    name: "clickup_get_goal",
    description: "Retrieves detailed information for an existing ClickUp Goal, specified by its unique `goal_id`.",
    toolSlug: "CLICKUP_GET_GOAL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        goal_id: {
          type: "string",
          description: "The unique identifier (UUID) of the Goal to retrieve.",
        },
      },
      required: [
        "goal_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "goals",
    ],
  }),
  composioTool({
    name: "clickup_get_goals",
    description: "Retrieves goals for a specified ClickUp Workspace (Team); the `team_id` must be valid and accessible.",
    toolSlug: "CLICKUP_GET_GOALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique numerical identifier of the Workspace (Team) for which to retrieve goals.",
        },
        include_completed: {
          type: "boolean",
          description: "If true, include completed goals in the response.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "goals",
    ],
  }),
  composioTool({
    name: "clickup_get_guest",
    description: "Call this to retrieve detailed information for a specific guest within a Team (Workspace), ensuring the `guest_id` is valid for the given `team_id`; this action requires the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_GET_GUEST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique identifier for the Team (Workspace) to which the guest belongs.",
        },
        guest_id: {
          type: "string",
          description: "The unique identifier for the guest whose information is to be retrieved.",
        },
      },
      required: [
        "team_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "guests",
    ],
  }),
  composioTool({
    name: "clickup_get_list",
    description: "Retrieves detailed information for an existing List in ClickUp, identified by its unique `list_id`.",
    toolSlug: "CLICKUP_GET_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique identifier for the List to retrieve. This ID can be found by right-clicking a List in the ClickUp sidebar, selecting 'Copy link', and the ID is the last part of the URL after '/l/' or '/li/'.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "clickup_get_list_comments",
    description: "Retrieves comments for a specific ClickUp List, supporting pagination using `start` (timestamp) and `start_id` (comment ID) to fetch earlier comments; omits them for the latest 25.",
    toolSlug: "CLICKUP_GET_LIST_COMMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        start: {
          type: "integer",
          description: "Unix timestamp (milliseconds) of a comment's creation date.",
        },
        list_id: {
          type: "string",
          description: "The unique identifier for the list from which to retrieve comments.",
        },
        start_id: {
          type: "string",
          description: "ID of a specific comment.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "clickup_get_list_members",
    description: "Retrieves all members of a specific, existing ClickUp List by its ID.",
    toolSlug: "CLICKUP_GET_LIST_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Unique identifier of the ClickUp List. Found by extracting the numerical ID from the List's URL in ClickUp.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "members",
    ],
  }),
  composioTool({
    name: "clickup_get_list_views",
    description: "Retrieves all task and page views for a specified and accessible ClickUp List.",
    toolSlug: "CLICKUP_GET_LIST_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The ID of the List for which to retrieve views. This is the numeric ID of the list, often found at the end of the list's URL.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_lists",
    description: "Retrieves all lists within a specified, existing ClickUp folder, optionally filtering by archived status.",
    toolSlug: "CLICKUP_GET_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter lists by archived status. If `true`, returns archived lists; if `false` or omitted, returns unarchived lists.",
        },
        folder_id: {
          type: "string",
          description: "The unique identifier of the Folder from which to retrieve lists.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "clickup_get_running_time_entry",
    description: "Retrieves the currently active time entry for a user in a Workspace; a negative 'duration' in its data indicates it's running, and the response may be empty if no entry is active.",
    toolSlug: "CLICKUP_GET_RUNNING_TIME_ENTRY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "integer",
          description: "Unique identifier for the Workspace (Team).",
        },
        assignee: {
          type: "integer",
          description: "Identifier of the user for the time entry; defaults to the authenticated user if not provided.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking",
    ],
  }),
  composioTool({
    name: "clickup_get_shared_hierarchy",
    description: "Retrieves the hierarchy of tasks, Lists, and Folders shared with the authenticated user within an existing ClickUp Team (Workspace), identified by its `team_id`.",
    toolSlug: "CLICKUP_GET_SHARED_HIERARCHY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Unique numerical ID of the ClickUp Team (Workspace) for which to fetch the shared hierarchy.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "shared_hierarchy",
    ],
  }),
  composioTool({
    name: "clickup_get_space",
    description: "Retrieves detailed information for an existing Space in a ClickUp Workspace, identified by its unique space_id.",
    toolSlug: "CLICKUP_GET_SPACE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "Unique ID of the Space to retrieve.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "spaces",
    ],
  }),
  composioTool({
    name: "clickup_get_space_available_fields",
    description: "Retrieves all custom fields available in a ClickUp Space, identified by space_id. Returns Space-level custom fields only.",
    toolSlug: "CLICKUP_GET_SPACE_AVAILABLE_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "integer",
          description: "The unique numerical identifier of the Space for which custom fields are to be retrieved.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "custom_fields",
    ],
  }),
  composioTool({
    name: "clickup_get_space_tags",
    description: "Retrieves all tags for tasks within a specified ClickUp Space, requiring a valid `space_id`.",
    toolSlug: "CLICKUP_GET_SPACE_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "The unique numerical identifier of the Space for which tags are to be retrieved.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "clickup_get_space_views",
    description: "Retrieves all task and page views for a specified Space ID in ClickUp.",
    toolSlug: "CLICKUP_GET_SPACE_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "ID of the Space to retrieve views from.",
        },
      },
      required: [
        "space_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_spaces",
    description: "Retrieves Spaces for a Team ID; member information for private Spaces is returned only if the authenticated user is a member.",
    toolSlug: "CLICKUP_GET_SPACES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Identifier for the Team (Workspace). Obtain valid workspace IDs using the GET /team endpoint.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status (`true` for archived, `false` for active); API default if omitted.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "spaces",
    ],
  }),
  composioTool({
    name: "clickup_get_subtypes",
    description: "Tool to retrieve post subtype IDs (Announcement, Discussion, Idea, Update) for a ClickUp Workspace. Use when you need subtype IDs to send messages with type: post.",
    toolSlug: "CLICKUP_GET_SUBTYPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment_type: {
          type: "string",
          description: "The type of comment to retrieve subtypes for. Use 'post' to get subtype IDs for Announcement, Discussion, Idea, and Update post types.",
          enum: [
            "post",
            "ai",
            "syncup",
            "ai_via_brain",
          ],
        },
        workspace_id: {
          type: "integer",
          description: "ID of the logged-in user's Workspace. Obtain this from the get_authorized_teams_workspaces action or similar workspace listing endpoints.",
        },
      },
      required: [
        "workspace_id",
        "comment_type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "clickup_get_task",
    description: "Retrieves comprehensive details for a ClickUp task by its ID, supporting standard or custom task IDs (requires `team_id` for custom IDs).",
    toolSlug: "CLICKUP_GET_TASK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The unique identifier of the task to retrieve. This can be the standard ClickUp task ID or a custom task ID if `custom_task_ids` is set to `true` (in which case `team_id` is also required).",
        },
        team_id: {
          type: "integer",
          description: "The ID of the team. This parameter is required and used only when `custom_task_ids` is set to `true` to identify the custom task ID within that specific team. For example: `custom_task_ids=true&team_id=123`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` to indicate that the `task_id` provided is a custom task ID. If `true`, `team_id` must also be provided. If omitted or `false` (default), `task_id` is treated as a standard task ID.",
        },
        include_subtasks: {
          type: "boolean",
          description: "Set to `true` to include subtasks in the task details response. If omitted or `false` (default), subtasks are not included.",
        },
        include_markdown_description: {
          type: "boolean",
          description: "Set to `true` to return the task description in Markdown format. If omitted or `false` (default), the description is returned in plain text. For example: `?include_markdown_description=true`.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "clickup_get_task_comments",
    description: "Retrieves up to 25 comments for a specified task, supporting pagination using `start` and `start_id` to fetch older comments.",
    toolSlug: "CLICKUP_GET_TASK_COMMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        start: {
          type: "integer",
          description: "Unix timestamp (in milliseconds) of the oldest visible comment, used with `start_id` for paginating older comments.",
        },
        task_id: {
          type: "string",
          description: "Unique identifier of the task. Can be a standard or custom task ID (if `custom_task_ids` is true).",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true.",
        },
        start_id: {
          type: "string",
          description: "ID of the oldest visible comment, used with `start` for paginating older comments.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Indicates if `task_id` is a custom task ID; if true, `team_id` is required.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "clickup_get_task_members",
    description: "Retrieves users with explicit access (directly assigned or shared) to a specific existing task, excluding users with inherited permissions.",
    toolSlug: "CLICKUP_GET_TASK_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The unique identifier of the task for which to retrieve members.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "members",
    ],
  }),
  composioTool({
    name: "clickup_get_task_templates",
    description: "Retrieves task templates for a specified Workspace (Team ID), supporting pagination.",
    toolSlug: "CLICKUP_GET_TASK_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginating through templates (starts from 0).",
        },
        team_id: {
          type: "string",
          description: "Unique identifier of the Workspace (Team) to retrieve task templates from.",
        },
      },
      required: [
        "team_id",
        "page",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "task_templates",
    ],
  }),
  composioTool({
    name: "clickup_get_task_time_in_status",
    description: "Retrieves the duration a task has spent in each status, provided the 'Total time in Status' ClickApp is enabled for the Workspace.",
    toolSlug: "CLICKUP_GET_TASK_TIME_IN_STATUS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The unique identifier of the task. This can be the standard task ID or a custom task ID if `custom_task_ids` is true.",
        },
        team_id: {
          type: "integer",
          description: "The ID of the team (Workspace) to which the task belongs. This is required only when `custom_task_ids` is set to `true`. For example: `custom_task_ids=true&team_id=1234567`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If set to `true`, the `task_id` parameter will be interpreted as a custom task ID. When using custom task IDs, the `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "clickup_get_tasks",
    description: "Retrieves tasks from a specified ClickUp list; only tasks whose home is the given list_id are returned. Closed and archived tasks are excluded by default. Key task attributes may appear only in the response `custom_fields` array, not top-level fields. Fields like `space`, `folder`, `list`, and `custom_type` may be absent; apply null checks. High-volume paginated calls may return HTTP 429; honor the `Retry-After` header.",
    toolSlug: "CLICKUP_GET_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "The page number of results to fetch, starting at 0. Each page can contain up to 100 tasks. Iterate pages until the response `last_page` flag is true or the returned tasks list is empty to avoid silently missing tasks.",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter tasks by a list of tag names. Use URL encoding for tags with spaces (e.g., 'this%20tag').",
        },
        list_id: {
          type: "string",
          description: "The ID of the list to retrieve tasks from. To find the list_id, copy the link to the list from the ClickUp UI; the list_id is the number following '/li' in the URL. Pass as a numeric string (e.g., '123456789').",
        },
        reverse: {
          type: "boolean",
          description: "Display tasks in reverse order based on the 'order_by' field.",
        },
        archived: {
          type: "boolean",
          description: "Include or exclude archived tasks.",
        },
        order_by: {
          type: "string",
          description: "Field to order tasks by. Valid options are: 'id', 'created', 'updated', and 'due_date'.",
        },
        statuses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter tasks by their status. Pass a list of status strings. Use URL encoding for statuses with spaces (e.g., 'to%20do'). To include closed tasks, use the `include_closed` parameter. Values must match workspace configuration exactly (case-sensitive, including spacing); mismatches return empty results silently.",
        },
        subtasks: {
          type: "boolean",
          description: "Include subtasks in the results.",
        },
        assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter tasks by assignee user IDs. Accepts a single ID or a list of IDs. IDs can be numeric (e.g., 212519251) or strings (e.g., '212519251').",
        },
        due_date_gt: {
          type: "integer",
          description: "Filter tasks with a due date greater than the provided Unix timestamp in milliseconds.",
        },
        due_date_lt: {
          type: "integer",
          description: "Filter tasks with a due date less than the provided Unix timestamp in milliseconds.",
        },
        custom_items: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by custom task types. For example: `?custom_items[]=0&custom_items[]=1300`. Including `0` returns tasks. Including `1` returns Milestones. Including any other number returns the custom task type as defined in your Workspace.",
        },
        date_done_gt: {
          type: "integer",
          description: "Filter tasks with a completion date greater than the provided Unix timestamp in milliseconds.",
        },
        date_done_lt: {
          type: "integer",
          description: "Filter tasks with a completion date less than the provided Unix timestamp in milliseconds.",
        },
        custom_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter tasks by custom field values. Provide a list of JSON strings, each defining a custom field filter. Example for a single filter: '[{\"field_id\":\"field_id_1\",\"operator\":\"=\",\"value\":\"field_value_1\"}]'. For multiple filters: '[{\"field_id\":\"field_id_1\",\"operator\":\"=\",\"value\":\"field_value_1\"}, {\"field_id\":\"field_id_2\",\"operator\":\"<\",\"value\":5}]'. See ClickUp API documentation for more on filtering with Custom Fields.",
        },
        include_closed: {
          type: "boolean",
          description: "Include tasks with a closed status. Closed tasks are excluded by default; set to true to include them.",
        },
        date_created_gt: {
          type: "integer",
          description: "Filter tasks with a creation date greater than the provided Unix timestamp in milliseconds.",
        },
        date_created_lt: {
          type: "integer",
          description: "Filter tasks with a creation date less than the provided Unix timestamp in milliseconds.",
        },
        date_updated_gt: {
          type: "integer",
          description: "Filter tasks with an update date greater than the provided Unix timestamp in milliseconds.",
        },
        date_updated_lt: {
          type: "integer",
          description: "Filter tasks with an update date less than the provided Unix timestamp in milliseconds.",
        },
        include_markdown_description: {
          type: "boolean",
          description: "Return task descriptions in Markdown format. Use the response `text_content` field instead when plain text is needed.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "clickup_get_team_available_fields",
    description: "Retrieves all custom fields available in a ClickUp Workspace (Team), identified by team_id. Returns Workspace-level custom fields only.",
    toolSlug: "CLICKUP_GET_TEAM_AVAILABLE_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "integer",
          description: "The unique numerical identifier of the Workspace (Team) for which custom fields are to be retrieved.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "custom_fields",
    ],
  }),
  composioTool({
    name: "clickup_get_teams",
    description: "Retrieves user groups (Teams) from a ClickUp Workspace, typically requiring `team_id` (Workspace ID), with an option to filter by `group_ids`.",
    toolSlug: "CLICKUP_GET_TEAMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "integer",
          description: "ID of the ClickUp Workspace (Team ID) from which to retrieve user groups. Must be a positive integer greater than 0. Use the CLICKUP_AUTHORIZATION_GET_WORK_SPACE_LIST action to retrieve available workspace IDs.",
        },
        group_ids: {
          type: "string",
          description: "Comma-separated string of user group IDs to filter results; if omitted, all user groups in the Workspace are returned.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "teams_user_groups",
    ],
  }),
  composioTool({
    name: "clickup_get_threaded_comments",
    description: "Retrieves threaded replies to a parent comment. Use when you need to fetch conversation threads under a specific comment.",
    toolSlug: "CLICKUP_GET_THREADED_COMMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment_id: {
          type: "string",
          description: "Unique identifier of the parent comment to retrieve replies for.",
        },
      },
      required: [
        "comment_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "clickup_get_time_entries_in_date_range",
    description: "Retrieves time entries for a specified Team (Workspace ID) within a date range (defaults to the last 30 days for the authenticated user if dates are omitted); active timers are indicated by negative durations in the response.",
    toolSlug: "CLICKUP_GET_TIME_ENTRIES_IN_DATE_RANGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Filter time entries to include only those associated with tasks in a specific List ID.",
        },
        task_id: {
          type: "string",
          description: "Filter time entries to include only those associated with a specific task ID. Use with `custom_task_ids` if referring to a custom ID.",
        },
        team_Id: {
          type: "string",
          description: "The Workspace ID (also called Team ID in ClickUp API) for which to retrieve time entries. This goes in the URL path.",
        },
        team_id: {
          type: "string",
          description: "The ID of the Team (Workspace) to use for context when `custom_task_ids` is `true`. This helps resolve custom task IDs. Example: `custom_task_ids=true&team_id=123`.",
        },
        assignee: {
          type: "string",
          description: "Filter time entries by user ID(s). For multiple assignees, provide a comma-separated string of user IDs. Example: `1234,9876`. Note: Access to other users' time entries typically requires Workspace Owner/Admin privileges.",
        },
        end_date: {
          type: "integer",
          description: "The end date of the date range for filtering time entries, specified as a Unix timestamp in milliseconds. If omitted, defaults to the current date.",
        },
        space_id: {
          type: "string",
          description: "Filter time entries to include only those associated with tasks in a specific Space ID.",
        },
        folder_id: {
          type: "string",
          description: "Filter time entries to include only those associated with tasks in a specific Folder ID.",
        },
        start_date: {
          type: "integer",
          description: "The start date of the date range for filtering time entries, specified as a Unix timestamp in milliseconds. If omitted, defaults to 30 days prior to the current date.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if the `task_id` parameter refers to a custom task ID. If `true`, the `team_id` query parameter must also be provided for context.",
        },
        include_task_tags: {
          type: "boolean",
          description: "If true, includes task tags in the response for time entries associated with tasks.",
        },
        include_location_names: {
          type: "boolean",
          description: "If true, includes the names of the List, Folder, and Space in the response, along with their respective IDs (`list_id`, `folder_id`, `space_id`).",
        },
      },
      required: [
        "team_Id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking",
    ],
  }),
  composioTool({
    name: "clickup_get_time_entry",
    description: "Fetches a specific time entry by its ID for a given team; a negative duration in the response indicates an active timer.",
    toolSlug: "CLICKUP_GET_TIME_ENTRY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "integer",
          description: "Unique identifier for the Team (Workspace).",
        },
        timer_id: {
          type: "string",
          description: "Unique identifier of the time entry. Can be obtained from the 'Get Time Entries Within a Date Range' action.",
        },
        include__task: {
          type: "boolean",
          description: "If true and the time entry is associated with a task, includes task details in the response.",
        },
        include_location_names: {
          type: "boolean",
          description: "If true, includes names of the List, Folder, and Space associated with the time entry, alongside their IDs.",
        },
      },
      required: [
        "team_id",
        "timer_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking",
    ],
  }),
  composioTool({
    name: "clickup_get_time_entry_history",
    description: "Retrieves the modification history for an existing time entry within a specific ClickUp Team (Workspace).",
    toolSlug: "CLICKUP_GET_TIME_ENTRY_HISTORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Unique identifier for the Team (Workspace) containing the time entry.",
        },
        timer_id: {
          type: "string",
          description: "Unique identifier of the time entry for which to retrieve history.",
        },
      },
      required: [
        "team_id",
        "timer_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking",
    ],
  }),
  composioTool({
    name: "clickup_get_tracked_time",
    description: "Retrieves tracked time for a task using a legacy endpoint; prefer newer Time Tracking API endpoints for managing time entries.",
    toolSlug: "CLICKUP_GET_TRACKED_TIME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the task for which to retrieve tracked time. This can be the standard task ID or a custom task ID if `custom_task_ids` is set to `true`.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team. This is required and used only when the `custom_task_ids` parameter is set to `true`. For example: `custom_task_ids=true&team_id=123`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if the `task_id` provided is a custom task ID. If `true`, the `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "time_tracking_legacy",
    ],
  }),
  composioTool({
    name: "clickup_get_user",
    description: "Retrieves detailed information for a specific user within a ClickUp Workspace (Team), available only for Workspaces on the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_GET_USER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "ID of the Team (Workspace) containing the user.",
        },
        user_id: {
          type: "string",
          description: "ID of the user whose details are to be retrieved.",
        },
      },
      required: [
        "team_id",
        "user_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "users",
    ],
  }),
  composioTool({
    name: "clickup_get_view",
    description: "Fetches details for a specific ClickUp view, identified by its `view_id`, which must exist.",
    toolSlug: "CLICKUP_GET_VIEW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        view_id: {
          type: "string",
          description: "The unique identifier for the ClickUp view to retrieve.",
        },
      },
      required: [
        "view_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_view_tasks",
    description: "Retrieves all tasks visible in a specified ClickUp view, respecting its applied filters, sorting, and grouping.",
    toolSlug: "CLICKUP_GET_VIEW_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "The page number of the results to retrieve. Used for pagination if the number of tasks exceeds the limit per page. Starts at 0.",
        },
        view_id: {
          type: "string",
          description: "The unique identifier for a task view from which to retrieve tasks. Only task views are supported: list, board, calendar, table, timeline, workload, activity, map, or gantt. Page views (such as Docs, Whiteboards, and Chat) are not supported and will return an error. To find valid task views, use the Get Space Views, Get Folder Views, or Get List Views actions and filter by view type.",
        },
      },
      required: [
        "view_id",
        "page",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_webhooks",
    description: "Fetches webhooks for a Team (Workspace), returning only those created by the authenticated user via API, for a `team_id` they can access.",
    toolSlug: "CLICKUP_GET_WEBHOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Unique ID of the Team (Workspace) to retrieve webhooks for. Obtain valid workspace IDs using the 'get_authorized_teams_workspaces' action.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "clickup_get_workspace_everything_level_views",
    description: "Retrieves all task and page views at the 'Everything Level' (a comprehensive overview of all tasks across all Spaces) for a specified ClickUp Workspace.",
    toolSlug: "CLICKUP_GET_WORKSPACE_EVERYTHING_LEVEL_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "integer",
          description: "Numeric ID of the Workspace (often referred to as Team ID) for which to retrieve Everything Level views.",
        },
        archived: {
          type: "boolean",
          description: "Filter for archived views. Set to true to include only archived views, false to exclude archived views, or omit to include all views.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "views",
    ],
  }),
  composioTool({
    name: "clickup_get_workspace_plan",
    description: "Retrieves the details of the current subscription plan for a specified ClickUp Workspace.",
    toolSlug: "CLICKUP_GET_WORKSPACE_PLAN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique identifier for the Workspace (formerly known as Team).",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "teams_workspaces",
    ],
  }),
  composioTool({
    name: "clickup_get_workspace_seats",
    description: "Retrieves seat utilization (used, total, available for members/guests) for a ClickUp Workspace (Team) ID, which must be for an existing Workspace.",
    toolSlug: "CLICKUP_GET_WORKSPACE_SEATS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Numeric ID of the Workspace (Team).",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "teams_workspaces",
    ],
  }),
  composioTool({
    name: "clickup_invite_guest_to_workspace",
    description: "Invites a guest by email to a ClickUp Workspace (Team) on an Enterprise Plan, setting initial permissions and optionally a custom role; further access configuration for specific items may require separate actions.",
    toolSlug: "CLICKUP_INVITE_GUEST_TO_WORKSPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Email address of the guest to invite to the Workspace.",
        },
        team_id: {
          type: "string",
          description: "Unique identifier for the Workspace (Team) to which the guest will be invited.",
        },
        can_edit_tags: {
          type: "boolean",
          description: "If `true`, the guest has permission to edit tags.",
        },
        custom_role_id: {
          type: "integer",
          description: "Optional ID of a custom role to assign to the guest, for granular permission control beyond default guest permissions. Only available on Business Plus Plan (one custom role) or Enterprise Plan (unlimited custom roles).",
        },
        can_create_views: {
          type: "boolean",
          description: "If `true`, the guest has permission to create views.",
        },
        can_see_time_spent: {
          type: "boolean",
          description: "If `true`, the guest has permission to see time spent on tasks.",
        },
        can_see_time_estimated: {
          type: "boolean",
          description: "If `true`, the guest has permission to see time estimated for tasks.",
        },
      },
      required: [
        "team_id",
        "email",
        "can_edit_tags",
        "can_see_time_spent",
        "can_see_time_estimated",
        "can_create_views",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "Confirm the parameters before executing Invite guest to workspace.",
    ],
  }),
  composioTool({
    name: "clickup_invite_user_to_workspace",
    description: "Invites a user via email to a ClickUp Workspace (Team), optionally granting admin rights or a custom role; requires an Enterprise Plan for the Workspace.",
    toolSlug: "CLICKUP_INVITE_USER_TO_WORKSPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        admin: {
          type: "boolean",
          description: "Grant administrative privileges to the invited user.",
        },
        email: {
          type: "string",
          description: "Email address of the user to invite.",
        },
        team_id: {
          type: "string",
          description: "Unique identifier of the Workspace (Team) to which the user will be invited.",
        },
        custom_role_id: {
          type: "integer",
          description: "Optional custom role ID to assign; if omitted and custom roles are enabled, the default member role is used.",
        },
      },
      required: [
        "team_id",
        "email",
        "admin",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "users",
    ],
    askBefore: [
      "Confirm the parameters before executing Invite user to workspace.",
    ],
  }),
  composioTool({
    name: "clickup_move_task_to_home_list",
    description: "Tool to move a task to a new home List using ClickUp Public API v3. Use when you need to change a task's home list (not just add to additional lists).",
    toolSlug: "CLICKUP_MOVE_TASK_TO_HOME_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The destination list ID to move the task to. This will become the task's new home list.",
        },
        task_id: {
          type: "string",
          description: "The task ID to move. Use actual task ID, not custom task ID.",
        },
        workspace_id: {
          type: "string",
          description: "The workspace ID containing the task. Required for v3 endpoint.",
        },
        status_mappings: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of status mapping objects to map the task's status from source list to destination list. Each object should contain 'source_status' and 'destination_status' keys. Required when the task's current status doesn't exist in the new list.",
        },
        move_custom_fields: {
          type: "boolean",
          description: "If true, transfer all custom fields from the current list to the destination list. If false or omitted, custom fields are not moved.",
        },
        custom_fields_to_move: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific custom field IDs to transfer when moving the task. Only applies when move_custom_fields is true. If omitted, all custom fields are moved when move_custom_fields is true.",
        },
      },
      required: [
        "workspace_id",
        "task_id",
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Move task to new home list.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_remove_custom_field_value",
    description: "Removes an existing value from a Custom Field on a specific task; this does not delete the Custom Field definition or its predefined options.",
    toolSlug: "CLICKUP_REMOVE_CUSTOM_FIELD_VALUE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "Identifier of the task. If `custom_task_ids` is true, this is the custom task ID; otherwise, it's the standard task ID.",
        },
        team_id: {
          type: "integer",
          description: "Numeric ID of the team, required only if `custom_task_ids` is true to identify the task by its custom ID.",
        },
        field_id: {
          type: "string",
          description: "UUID of the Custom Field whose value will be removed from the task.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` is a custom task ID, and `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "field_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove custom field value.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_remove_guest_from_folder",
    description: "Revokes a guest's access to a specific ClickUp Folder, optionally unsharing items explicitly shared with them within it; requires an Enterprise Plan.",
    toolSlug: "CLICKUP_REMOVE_GUEST_FROM_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        guest_id: {
          type: "string",
          description: "Unique identifier of the guest to remove from the Folder.",
        },
        folder_id: {
          type: "string",
          description: "Unique identifier of the Folder from which to remove the guest.",
        },
        include_shared: {
          type: "boolean",
          description: "If `true`, items explicitly shared with the guest within this Folder are also unshared.",
        },
      },
      required: [
        "folder_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove guest from folder.",
    ],
  }),
  composioTool({
    name: "clickup_remove_guest_from_list",
    description: "Revokes a guest's access to a specific List, provided the guest currently has access to this List and the Workspace is on the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_REMOVE_GUEST_FROM_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique identifier of the List from which the guest will be removed.",
        },
        guest_id: {
          type: "string",
          description: "The unique identifier of the guest to be removed from the List.",
        },
        include_shared: {
          type: "boolean",
          description: "If `false`, may alter how items shared with the guest are handled or reported during removal.",
        },
      },
      required: [
        "list_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove guest from list.",
    ],
  }),
  composioTool({
    name: "clickup_remove_guest_from_task",
    description: "Revokes a guest's access to a specific task; only available for Workspaces on the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_REMOVE_GUEST_FROM_TASK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the task from which the guest will be removed. This can be the standard task ID or a custom task ID if `custom_task_ids` is set to `true`.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team. This is required only when `custom_task_ids` is set to `true` and you are using a custom task ID. For example: `custom_task_ids=true&team_id=123`.",
        },
        guest_id: {
          type: "string",
          description: "The numeric ID of the guest to be removed from the task.",
        },
        include_shared: {
          type: "boolean",
          description: "Determines whether to include details of items shared with the guest. Set to `false` to exclude these details. Defaults to `true`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if you are using a custom task ID for the `task_id` parameter. If `true`, `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove guest from task.",
    ],
  }),
  composioTool({
    name: "clickup_remove_guest_from_workspace",
    description: "Permanently removes a guest from a specified Workspace, revoking all their access; this destructive operation requires the Workspace to be on the ClickUp Enterprise Plan.",
    toolSlug: "CLICKUP_REMOVE_GUEST_FROM_WORKSPACE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "Unique numerical identifier for the Workspace (often referred to as 'Team' in the ClickUp API) from which the guest is to be removed. This ID specifies the scope of the removal operation.",
        },
        guest_id: {
          type: "string",
          description: "Unique numerical identifier for the guest user whose access to the specified Workspace will be revoked. This ID targets the specific guest for removal.",
        },
      },
      required: [
        "team_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove guest from workspace.",
    ],
  }),
  composioTool({
    name: "clickup_remove_tag_from_task",
    description: "Removes a tag from a specified task by disassociating it (does not delete the tag from Workspace), succeeding even if the tag is not on the task.",
    toolSlug: "CLICKUP_REMOVE_TAG_FROM_TASK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The ID of the task from which the tag will be removed. This can be the standard task ID or a custom task ID if `custom_task_ids` is set to `true`.",
        },
        team_id: {
          type: "string",
          description: "The Workspace (Team) ID associated with the task.",
        },
        tag_name: {
          type: "string",
          description: "The name of the tag to remove from the task. Tag names are case-sensitive.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "Set to `true` if you are using a custom task ID (instead of the default task ID) to identify the task. If `true`, the `team_id` must also be provided.",
        },
      },
      required: [
        "task_id",
        "tag_name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tags",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove tag from task.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_remove_tags_from_time_entries",
    description: "Removes tags from specified time entries in a team, without deleting the tags from the workspace.",
    toolSlug: "CLICKUP_REMOVE_TAGS_FROM_TIME_ENTRIES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of tags to remove, typically identified by name (e.g., `{'name': 'tag_name'}`).",
        },
        team_id: {
          type: "string",
          description: "The unique identifier for the Team (Workspace) that owns the time entries.",
        },
        time_entry_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of time entry IDs from which to remove tags.",
        },
      },
      required: [
        "team_id",
        "tags",
        "time_entry_ids",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove tags from time entries.",
    ],
  }),
  composioTool({
    name: "clickup_remove_task_from_list",
    description: "Removes a task from an extra list (not its home list); the 'Tasks in Multiple Lists' ClickApp must be enabled.",
    toolSlug: "CLICKUP_REMOVE_TASK_FROM_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Unique numerical identifier of the list from which the task will be removed. This must be an extra list for the task, not its home list.",
        },
        task_id: {
          type: "string",
          description: "Unique identifier of the task to be removed from the specified list.",
        },
      },
      required: [
        "list_id",
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove task from list.",
    ],
  }),
  composioTool({
    name: "clickup_remove_user_from_workspace",
    description: "Deactivates a user from a specified ClickUp Workspace, revoking their access (user can be reactivated later); requires the Workspace to be on an Enterprise Plan.",
    toolSlug: "CLICKUP_REMOVE_USER_FROM_WORKSPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique numeric identifier of the Workspace (Team) from which the user will be deactivated.",
        },
        user_id: {
          type: "string",
          description: "The unique numeric identifier of the user to be deactivated from the Workspace.",
        },
      },
      required: [
        "team_id",
        "user_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "users",
    ],
    askBefore: [
      "Confirm the parameters before executing Remove user from workspace.",
    ],
  }),
  composioTool({
    name: "clickup_search_docs",
    description: "Tool to search and list Docs metadata in a ClickUp workspace. Use after confirming the workspace ID to quickly locate relevant meeting notes before fetching pages.",
    toolSlug: "CLICKUP_SEARCH_DOCS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum results per page. Default: 50, max: 100.",
        },
        cursor: {
          type: "string",
          description: "Cursor from previous response to fetch next page.",
        },
        workspace_id: {
          type: "string",
          description: "ID of the ClickUp Workspace to list Docs from.",
        },
      },
      required: [
        "workspace_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "read",
      "docs",
      "search",
    ],
  }),
  composioTool({
    name: "clickup_set_custom_field_value",
    description: "Sets or updates a Custom Field's value for a task; the new value (with type-dependent structure, e.g., `{\"value\": \"text\"}` or `{\"value\": 123, \"value_options\": {\"currency_type\":\"USD\"}}`) is provided in the JSON request body.",
    toolSlug: "CLICKUP_SET_CUSTOM_FIELD_VALUE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        value: {
          type: "string",
          description: "The value to set for the Custom Field. Structure depends on field type: Text/Short Text: string (e.g., 'Hello'). Number/Currency/Emoji(Rating): number (e.g., 42). Checkbox: boolean (true/false). Dropdown: option UUID string from type_config.options (e.g., '7a4e5845-8496-4b9f-9097-843b9c737692'). Date: Unix timestamp in milliseconds (e.g., 1645502400000). Email: valid email string. Phone: string with country code (e.g., '+1 123 456 7890'). URL: valid URL string. Labels: array of label UUIDs from type_config (e.g., ['label_id_1', 'label_id_2']). Users/Tasks: object with 'add' and/or 'rem' arrays of IDs (e.g., {'add': ['id1'], 'rem': ['id2']}). Location: object with 'location' (lat/lng) and 'formatted_address' (e.g., {'location': {'lat': -28.0, 'lng': 153.4}, 'formatted_address': 'Gold Coast, Australia'}). Manual Progress: object with 'current' value (e.g., {'current': 50}).",
        },
        task_id: {
          type: "string",
          description: "Task ID to update. Standard ID, or Custom Task ID if `custom_task_ids` is true.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true.",
        },
        field_id: {
          type: "string",
          description: "UUID of the Custom Field to update (must be in standard UUID format with hyphens, e.g., '0f079e26-feef-410d-8e8d-2a21a057ee5e'). Obtainable via 'Get Accessible Custom Fields' or 'Get Task' endpoints.",
        },
        value_options: {
          type: "object",
          additionalProperties: true,
          description: "Optional settings for certain field types. For Date fields: {'time': true} to display time in ClickUp UI. For Currency fields: {'currency_type': 'USD'} to specify currency.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` is treated as a Custom Task ID, and `team_id` is required.",
        },
      },
      required: [
        "task_id",
        "field_id",
        "value",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Set custom field value.",
    ],
  }),
  composioTool({
    name: "clickup_start_time_entry",
    description: "Starts a new time entry (timer) in the specified Team (Workspace), optionally associating it with a task, adding a description, setting billable status, or applying tags (tags feature requires Business Plan or higher).",
    toolSlug: "CLICKUP_START_TIME_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tid: {
          type: "string",
          description: "The ID of the task to associate with this time entry. If `custom_task_ids` is true, this should be the custom task ID.",
        },
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of tag objects (each with \"name\", optionally \"tag_bg\", \"tag_fg\" for colors) to apply. This feature requires Business Plan or higher. E.g., `[{\"name\": \"Urgent\", \"tag_bg\": \"#FF0000\"}]`.",
        },
        team_Id: {
          type: "string",
          description: "The Workspace ID (also called Team ID in ClickUp API) for this time entry. This goes in the URL path.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team for resolving custom task IDs. Required only if `custom_task_ids` is set to `true`. For example: `custom_task_ids=true&team_id=123`.",
        },
        billable: {
          type: "boolean",
          description: "Specifies if the time entry is billable.",
        },
        description: {
          type: "string",
          description: "Description for the time entry.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If set to `true`, the `tid` field will be interpreted as a custom task ID. Requires `team_id` query parameter to be set for custom task ID resolution.",
        },
      },
      required: [
        "team_Id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Start a time entry.",
    ],
  }),
  composioTool({
    name: "clickup_stop_time_entry",
    description: "Stops the authenticated user's currently active time entry in the specified Team (Workspace), which requires an existing time entry to be running.",
    toolSlug: "CLICKUP_STOP_TIME_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique numeric identifier of the Team (Workspace) where the time entry is being tracked.",
        },
      },
      required: [
        "team_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Stop a time entry.",
    ],
  }),
  composioTool({
    name: "clickup_track_time",
    description: "Records a time entry for a task using ClickUp's legacy time tracking system; newer endpoints are generally recommended.",
    toolSlug: "CLICKUP_TRACK_TIME",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "integer",
          description: "The end time of the time entry, as a Unix timestamp in milliseconds.",
        },
        time: {
          type: "integer",
          description: "The duration of the time entry, in milliseconds. If `start` and `end` are both provided, this `time` field is ignored. If `time` is passed with `start` but no `end`, then `end` will be calculated. If `time` is passed with `end` but no `start`, then `start` will be calculated.",
        },
        start: {
          type: "integer",
          description: "The start time of the time entry, as a Unix timestamp in milliseconds.",
        },
        task_id: {
          type: "string",
          description: "The unique identifier of the task to track time for.",
        },
        team_id: {
          type: "string",
          description: "The ID of the team. Required and used only if `custom_task_ids` is set to `true` to identify the task by its custom ID. For example: `custom_task_ids=true&team_id=123`.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If `true`, the `task_id` is treated as a custom task ID. Requires `team_id` to be provided.",
        },
      },
      required: [
        "task_id",
        "start",
        "end",
        "time",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking_legacy",
    ],
    askBefore: [
      "Confirm the parameters before executing Track time.",
    ],
  }),
  composioTool({
    name: "clickup_update_chat_channel",
    description: "Tool to update a ClickUp chat channel's properties including name, topic, description, visibility, and location. Use when you need to modify an existing chat channel's settings. The endpoint requires both workspace_id and channel_id.",
    toolSlug: "CLICKUP_UPDATE_CHAT_CHANNEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The updated name of the Chat channel.",
        },
        topic: {
          type: "string",
          description: "The updated topic of the Chat channel.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              description: "The ID of the location (space, folder, or list).",
            },
            type: {
              type: "string",
              description: "The type of location (e.g., 'space', 'folder', 'list').",
            },
          },
          description: "Location information for the chat channel.",
        },
        channel_id: {
          type: "string",
          description: "The ID of the specified Channel.",
        },
        visibility: {
          type: "string",
          description: "Visibility setting for chat channel.",
          enum: [
            "PUBLIC",
            "PRIVATE",
          ],
        },
        description: {
          type: "string",
          description: "The updated description of the Chat channel.",
        },
        workspace_id: {
          type: "integer",
          description: "The ID of the Workspace.",
        },
        content_format: {
          type: "string",
          description: "Content format for channel messages.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
      },
      required: [
        "workspace_id",
        "channel_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
      "channels",
    ],
    askBefore: [
      "Confirm the parameters before executing Update chat channel.",
    ],
  }),
  composioTool({
    name: "clickup_update_chat_message",
    description: "Tool to update a ClickUp chat message's content, assignee, or resolved status via the v3 API. Use when you need to edit an existing chat message.",
    toolSlug: "CLICKUP_UPDATE_CHAT_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        content: {
          type: "string",
          description: "The full content of the message to be updated. Maximum 40,000 characters. If not provided, message content will not be changed.",
        },
        assignee: {
          type: "string",
          description: "The possible assignee of the message. User ID as string.",
        },
        resolved: {
          type: "boolean",
          description: "The resolved status of the message. Set to true to mark as resolved, false to mark as unresolved.",
        },
        post_data: {
          type: "object",
          additionalProperties: true,
          properties: {
            title: {
              type: "string",
              description: "Title of the post message.",
            },
            subtype: {
              type: "string",
              description: "Subtype of the post message.",
            },
          },
          description: "Post data subtype information.",
        },
        message_id: {
          type: "string",
          description: "The ID of the message to update.",
        },
        workspace_id: {
          type: "string",
          description: "The ID of the Workspace containing the chat message. Numeric string.",
        },
        content_format: {
          type: "string",
          description: "Content format enum for chat messages.",
          enum: [
            "text/md",
            "text/plain",
          ],
        },
        group_assignee: {
          type: "string",
          description: "The possible group assignee of the message. Team/group ID as string.",
        },
      },
      required: [
        "workspace_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "chat",
    ],
    askBefore: [
      "Confirm the parameters before executing Update chat message.",
    ],
  }),
  composioTool({
    name: "clickup_update_checklist",
    description: "Updates an existing checklist's name or position, identified by its `checklist_id`.",
    toolSlug: "CLICKUP_UPDATE_CHECKLIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "New name for the checklist.",
        },
        position: {
          type: "integer",
          description: "New 0-indexed display order for the checklist on a task (e.g., 0 for top).",
        },
        checklist_id: {
          type: "string",
          description: "The unique identifier (UUID) of the checklist to be edited.",
        },
      },
      required: [
        "checklist_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit checklist.",
    ],
  }),
  composioTool({
    name: "clickup_update_checklist_item",
    description: "Updates an existing checklist item, allowing modification of its name, assignee, resolution status, or parent item for nesting.",
    toolSlug: "CLICKUP_UPDATE_CHECKLIST_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the checklist item.",
        },
        parent: {
          type: "string",
          description: "The `checklist_item_id` of an existing item within the same checklist to nest this item under.",
        },
        assignee: {
          type: "string",
          description: "The integer user ID to assign to this checklist item. To unassign, consult ClickUp API documentation for the appropriate value (e.g., 0 or null).",
        },
        resolved: {
          type: "boolean",
          description: "Set to `true` to mark the item as resolved, or `false` to mark it as unresolved.",
        },
        checklist_id: {
          type: "string",
          description: "The unique identifier (UUID) of the checklist containing the item to be edited.",
        },
        checklist_item_id: {
          type: "string",
          description: "The unique identifier (UUID) of the checklist item to be edited.",
        },
      },
      required: [
        "checklist_id",
        "checklist_item_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "task_checklists",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit checklist item.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_update_comment",
    description: "Updates an existing task comment's text, assignee (who must be a valid workspace member), or resolution status, requiring a valid existing comment_id.",
    toolSlug: "CLICKUP_UPDATE_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        assignee: {
          type: "integer",
          description: "User ID of the assignee for the comment.",
        },
        resolved: {
          type: "boolean",
          description: "Set to `true` to mark the comment as resolved, or `false` to mark it as unresolved.",
        },
        comment_id: {
          type: "string",
          description: "The unique identifier of the comment to be updated.",
        },
        comment_text: {
          type: "string",
          description: "The new text content for the comment.",
        },
      },
      required: [
        "comment_id",
        "comment_text",
        "assignee",
        "resolved",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Update comment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_update_folder",
    description: "Updates the name of an existing folder in ClickUp.",
    toolSlug: "CLICKUP_UPDATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "New name for the folder.",
        },
        folder_id: {
          type: "string",
          description: "Unique identifier of the folder to update.",
        },
      },
      required: [
        "folder_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "folders",
    ],
    askBefore: [
      "Confirm the parameters before executing Update folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "clickup_update_goal",
    description: "Updates attributes of an existing ClickUp goal, identified by its `goal_id`.",
    toolSlug: "CLICKUP_UPDATE_GOAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "New name for the goal.",
        },
        color: {
          type: "string",
          description: "New color (hex code).",
        },
        goal_id: {
          type: "string",
          description: "Unique identifier (UUID) of the goal to update.",
        },
        due_date: {
          type: "integer",
          description: "New due date (Unix timestamp in milliseconds).",
        },
        add_owners: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "User IDs to add as owners.",
        },
        rem_owners: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "User IDs to remove as owners.",
        },
        description: {
          type: "string",
          description: "New description for the goal.",
        },
      },
      required: [
        "goal_id",
        "description",
        "name",
        "due_date",
        "rem_owners",
        "add_owners",
        "color",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "Confirm the parameters before executing Update goal.",
    ],
  }),
  composioTool({
    name: "clickup_update_guest_on_workspace",
    description: "Modifies the details and permissions of an existing guest user within a specific Workspace.",
    toolSlug: "CLICKUP_UPDATE_GUEST_ON_WORKSPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        team_id: {
          type: "string",
          description: "The unique identifier of the Workspace (Team) where the guest belongs. Example: 123456.",
        },
        guest_id: {
          type: "string",
          description: "The unique identifier of the guest user to be edited. Example: 98765.",
        },
        username: {
          type: "string",
          description: "The new username to assign to the guest. Optional - only include if you want to change the guest's username.",
        },
        can_edit_tags: {
          type: "boolean",
          description: "Boolean flag to allow or disallow the guest to edit tags. Optional - only include if you want to change this permission.",
        },
        custom_role_id: {
          type: "integer",
          description: "Identifier of a custom role for the guest. Ensure this ID is valid within the workspace. Optional - only include if you want to assign/change the custom role. (Note: Business Plus Plan supports one custom role; Enterprise Plan supports unlimited).",
        },
        can_create_views: {
          type: "boolean",
          description: "Boolean flag to allow or disallow the guest to create views. Optional - only include if you want to change this permission.",
        },
        can_see_time_spent: {
          type: "boolean",
          description: "Boolean flag to allow or disallow the guest to see time spent on tasks. Optional - only include if you want to change this permission.",
        },
        can_see_time_estimated: {
          type: "boolean",
          description: "Boolean flag to allow or disallow the guest to see time estimated for tasks. Optional - only include if you want to change this permission.",
        },
      },
      required: [
        "team_id",
        "guest_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "guests",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit guest on workspace.",
    ],
  }),
  composioTool({
    name: "clickup_update_key_result",
    description: "Updates an existing key result's progress or note in ClickUp, where the key result measures progress towards a goal.",
    toolSlug: "CLICKUP_UPDATE_KEY_RESULT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note: {
          type: "string",
          description: "A note or comment to add or update for the key result.",
        },
        key_result_id: {
          type: "string",
          description: "The unique identifier (UUID) of the key result to be edited.",
        },
        steps_current: {
          type: "integer",
          description: "The current progress of steps for the key result.",
        },
      },
      required: [
        "key_result_id",
        "steps_current",
        "note",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "goals",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit key result.",
    ],
  }),
  composioTool({
    name: "clickup_update_list",
    description: "Updates attributes of an existing ClickUp list, such as its name, content, due date, priority, assignee, or color status, identified by its `list_id`.",
    toolSlug: "CLICKUP_UPDATE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "New name for the list.",
        },
        status: {
          type: "string",
          description: "Color for the list (e.g., 'red' or '#FF0000'), visually representing its status (not task status).",
        },
        content: {
          type: "string",
          description: "New description or informational content for the list.",
        },
        list_id: {
          type: "string",
          description: "ID of the list to be updated.",
        },
        assignee: {
          type: "string",
          description: "User ID to be set as the assignee for the list, replacing any existing assignee.",
        },
        due_date: {
          type: "integer",
          description: "New due date for the list, as a Unix timestamp in milliseconds (e.g., `1672531199000` for Dec 31, 2022, 11:59:59 PM UTC).",
        },
        priority: {
          type: "integer",
          description: "Priority level: `1` (Urgent), `2` (High), `3` (Normal), `4` (Low), or `0` to unset.",
        },
        unset_status: {
          type: "boolean",
          description: "Set to `true` to remove the list's color, overriding `status`; if `false`, `status` updates or maintains current color.",
        },
        due_date_time: {
          type: "boolean",
          description: "Indicates if `due_date` includes a specific time; if `false`, it's an all-day event.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update list.",
    ],
  }),
  composioTool({
    name: "clickup_update_space",
    description: "Updates an existing ClickUp Space, allowing modification of its name, color, privacy, and feature settings (ClickApps).",
    toolSlug: "CLICKUP_UPDATE_SPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the Space.",
        },
        color: {
          type: "string",
          description: "The new color for the Space, in hexadecimal format.",
        },
        private: {
          type: "boolean",
          description: "Whether the Space should be private.",
        },
        space_id: {
          type: "string",
          description: "The ID of the Space to update.",
        },
        admin_can_manage: {
          type: "boolean",
          description: "Whether admins can manage this private Space. This is an Enterprise Plan feature. Must be omitted for non-Enterprise workspaces.",
        },
        multiple_assignees: {
          type: "boolean",
          description: "Whether tasks in this Space can have multiple assignees.",
        },
        features__tags__enabled: {
          type: "boolean",
          description: "Enable or disable the Tags ClickApp. When any feature parameter is provided, all feature keys must be included (due_dates, time_estimates, time_tracking, remap_dependencies, custom_fields, dependency_warning, tags, checklists, portfolios).",
        },
        features__due_dates__enabled: {
          type: "boolean",
          description: "Enable or disable the Due Dates ClickApp.",
        },
        features__checklists__enabled: {
          type: "boolean",
          description: "Enable or disable the Checklists ClickApp.",
        },
        features__portfolios__enabled: {
          type: "boolean",
          description: "Enable or disable the Portfolios ClickApp.",
        },
        features__due_dates__start_date: {
          type: "boolean",
          description: "Enable or disable Start Dates for the Due Dates ClickApp.",
        },
        features__custom_fields__enabled: {
          type: "boolean",
          description: "Enable or disable the Custom Fields ClickApp.",
        },
        features__time_tracking__enabled: {
          type: "boolean",
          description: "Enable or disable the Time Tracking ClickApp.",
        },
        features__time_estimates__enabled: {
          type: "boolean",
          description: "Enable or disable the Time Estimates ClickApp.",
        },
        features__due_dates__remap_due_dates: {
          type: "boolean",
          description: "Enable or disable remapping of due dates for the Due Dates ClickApp.",
        },
        features__dependency_warning__enabled: {
          type: "boolean",
          description: "Enable or disable Dependency Warning for the Task Dependencies ClickApp.",
        },
        features__remap_dependencies__enabled: {
          type: "boolean",
          description: "Enable or disable Remap Dependencies for the Task Dependencies ClickApp.",
        },
        features__due_dates__remap_closed_due_date: {
          type: "boolean",
          description: "Enable or disable remapping of closed due dates for the Due Dates ClickApp.",
        },
      },
      required: [
        "space_id",
        "name",
        "color",
        "private",
        "multiple_assignees",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "spaces",
    ],
    askBefore: [
      "Confirm the parameters before executing Update space.",
    ],
  }),
  composioTool({
    name: "clickup_update_space_tag",
    description: "Updates an existing tag's name and colors in a ClickUp Space; requires current tag name for identification, and new values for tag name, foreground color, and background color, all of which are mandatory for the update.",
    toolSlug: "CLICKUP_UPDATE_SPACE_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        space_id: {
          type: "string",
          description: "Unique identifier of the Space containing the tag.",
        },
        tag_name: {
          type: "string",
          description: "Current name of the tag to edit. This tag must exist within the specified Space.",
        },
        tag__name: {
          type: "string",
          description: "New name to assign to the tag.",
        },
        tag__bg__color: {
          type: "string",
          description: "New background color for the tag, specified as a hexadecimal string (e.g., '#000000').",
        },
        tag__fg__color: {
          type: "string",
          description: "New foreground color for the tag, specified as a hexadecimal string (e.g., '#FFFFFF').",
        },
      },
      required: [
        "space_id",
        "tag_name",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit space tag.",
    ],
  }),
  composioTool({
    name: "clickup_update_task",
    description: "Updates attributes of an existing task; `team_id` is required if `custom_task_ids` is true, use a single space (\" \") for `description` to clear it, and provide at least one modifiable field.",
    toolSlug: "CLICKUP_UPDATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "New task name.",
        },
        parent: {
          type: "string",
          description: "ID of new parent task to make this a subtask; cannot convert subtask to regular task this way.",
        },
        status: {
          type: "string",
          description: "New task status (case-sensitive, must be valid in Workspace).",
        },
        task_id: {
          type: "string",
          description: "Unique task identifier; use custom task ID if `custom_task_ids` is true.",
        },
        team_id: {
          type: "string",
          description: "Team ID, required if `custom_task_ids` is true.",
        },
        archived: {
          type: "boolean",
          description: "True to archive, false to unarchive.",
        },
        due_date: {
          type: "integer",
          description: "New due date (Unix timestamp in milliseconds).",
        },
        priority: {
          type: "integer",
          description: "Priority: 1 (Urgent), 2 (High), 3 (Normal), 4 (Low). Omit or `None` to remove.",
        },
        start_date: {
          type: "integer",
          description: "New start date (Unix timestamp in milliseconds).",
        },
        description: {
          type: "string",
          description: "New task description; use a single space (\" \") to clear.",
        },
        due_date_time: {
          type: "boolean",
          description: "True if `due_date` includes time, false if all-day.",
        },
        time_estimate: {
          type: "integer",
          description: "New time estimate in milliseconds.",
        },
        assignees__add: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "List of user IDs to add as assignees.",
        },
        assignees__rem: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "List of user IDs to remove as assignees.",
        },
        custom_item_id: {
          type: "integer",
          description: "Custom task type ID. Use `1` for Milestone, its ID for custom type. Omit/`None` to make regular task (API's 'null' equivalent).",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` is a custom ID and `team_id` is required.",
        },
        start_date_time: {
          type: "boolean",
          description: "True if `start_date` includes time, false if all-day.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update task.",
    ],
  }),
  composioTool({
    name: "clickup_update_team",
    description: "Updates an existing ClickUp User Group (Team) using its `group_id`; note that adding a view-only guest as a paid member may incur charges.",
    toolSlug: "CLICKUP_UPDATE_TEAM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the User Group (Team).",
        },
        handle: {
          type: "string",
          description: "The new handle for the User Group (Team), used for @mentions (e.g., '@developers').",
        },
        group_id: {
          type: "string",
          description: "The ID of the User Group (Team) to update.",
        },
        members__add: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "A list of user IDs to add to the User Group (Team).",
        },
        members__rem: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "A list of user IDs to remove from the User Group (Team).",
        },
      },
      required: [
        "group_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "teams_user_groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Update team.",
    ],
  }),
  composioTool({
    name: "clickup_update_time_entry",
    description: "Updates an existing ClickUp time entry. Requires team_id (workspace ID) and timer_id (time entry ID). Optional fields: description, tags, tag_action, start/end times, duration, tid (task ID), billable status. Note: start and end times should be provided together. This is an Advanced Time Tracking feature that may require a Business Plan or higher.",
    toolSlug: "CLICKUP_UPDATE_TIME_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "integer",
          description: "New end time (Unix timestamp in milliseconds). If provided, `start` must also be provided.",
        },
        tid: {
          type: "string",
          description: "The ID of the task for this time entry; if `custom_task_ids` is `true`, this should be the custom task ID.",
        },
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of tag objects (e.g., `{'name': 'your-tag'}`) for the time entry. Time tracking labels are for Business Plan and above users.",
        },
        start: {
          type: "integer",
          description: "New start time (Unix timestamp in milliseconds). If provided, `end` must also be provided.",
        },
        team_id: {
          type: "string",
          description: "The ID of the Team (Workspace) for the time entry. Path parameter.",
        },
        billable: {
          type: "boolean",
          description: "Indicates whether the time entry is billable.",
        },
        duration: {
          type: "integer",
          description: "New duration of the time entry in milliseconds; can be an alternative to `start` and `end` times.",
        },
        timer_id: {
          type: "string",
          description: "The unique identifier of the time entry to update. Path parameter.",
        },
        tag_action: {
          type: "string",
          description: "Specifies how to handle `tags` (e.g., 'add', 'remove').",
        },
        description: {
          type: "string",
          description: "A new description for the time entry.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If `true`, `tid` is interpreted as a custom task ID. When true, the team_id path parameter value will also be used as a query parameter.",
        },
      },
      required: [
        "team_id",
        "timer_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a time entry.",
    ],
  }),
  composioTool({
    name: "clickup_update_time_entry_tag",
    description: "Updates the name, background color, and/or foreground color for an existing time entry tag, identified by its current `name` and `team_id`.",
    toolSlug: "CLICKUP_UPDATE_TIME_ENTRY_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The current name of the time entry tag to be modified.",
        },
        tag_bg: {
          type: "string",
          description: "The new background color for the tag, specified as a hexadecimal color code.",
        },
        tag_fg: {
          type: "string",
          description: "The new foreground (text) color for the tag, specified as a hexadecimal color code.",
        },
        team_id: {
          type: "string",
          description: "The unique identifier of the Team (Workspace) where the time entry tag exists.",
        },
        new_name: {
          type: "string",
          description: "The new name to be assigned to the time entry tag.",
        },
      },
      required: [
        "team_id",
        "name",
        "new_name",
        "tag_bg",
        "tag_fg",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Change tag names from time entries.",
    ],
  }),
  composioTool({
    name: "clickup_update_time_tracked",
    description: "Edits a legacy time-tracked interval for a task (identified by `task_id` and `interval_id`) to update its start/end times and duration; `team_id` is required if `custom_task_ids` is true.",
    toolSlug: "CLICKUP_UPDATE_TIME_TRACKED",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "integer",
          description: "New end date and time for the interval as a Unix timestamp in milliseconds.",
        },
        time: {
          type: "integer",
          description: "New total duration of the time interval in milliseconds; typically the difference between `end` and `start`.",
        },
        start: {
          type: "integer",
          description: "New start date and time for the interval as a Unix timestamp in milliseconds.",
        },
        task_id: {
          type: "string",
          description: "Unique task identifier; refers to custom task ID if `custom_task_ids` is true.",
        },
        team_id: {
          type: "integer",
          description: "Team ID, required if `custom_task_ids` is true.",
        },
        interval_id: {
          type: "string",
          description: "Unique identifier of the time interval record to edit.",
        },
        custom_task_ids: {
          type: "boolean",
          description: "If true, `task_id` is treated as a custom task ID, and `team_id` must be provided.",
        },
      },
      required: [
        "task_id",
        "interval_id",
        "start",
        "end",
        "time",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "time_tracking_legacy",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit time tracked.",
    ],
  }),
  composioTool({
    name: "clickup_update_user_on_workspace",
    description: "Updates a user's username, admin status, or custom role in a Workspace; requires the Workspace to be on an Enterprise Plan.",
    toolSlug: "CLICKUP_UPDATE_USER_ON_WORKSPACE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        admin: {
          type: "boolean",
          description: "Set `true` to make user an admin, `false` to revoke admin privileges. Optional - only include if you want to change admin status.",
        },
        team_id: {
          type: "string",
          description: "Workspace (formerly Team) ID where the user resides.",
        },
        user_id: {
          type: "string",
          description: "ID of the user whose details are to be edited.",
        },
        username: {
          type: "string",
          description: "New username to assign. Optional - only include if you want to change the username.",
        },
        custom_role_id: {
          type: "integer",
          description: "ID of the custom role to assign, defining their permissions. Optional - only include if you want to change the custom role.",
        },
      },
      required: [
        "team_id",
        "user_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "users",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit user on workspace.",
    ],
  }),
  composioTool({
    name: "clickup_update_view",
    description: "Updates an existing ClickUp view's settings such as name, type, grouping, or filters; ensure `parent_id` and `parent_type` define a valid hierarchy, and that specified field names (e.g. for sorting, columns) are valid within the ClickUp workspace.",
    toolSlug: "CLICKUP_UPDATE_VIEW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the view.",
        },
        type: {
          type: "string",
          description: "The type of the view.",
        },
        view_id: {
          type: "string",
          description: "The unique identifier of the view to be updated.",
        },
        parent__id: {
          type: "string",
          description: "The ID of the Workspace, Space, Folder, or List where the view is located. ",
        },
        divide__dir: {
          type: "string",
          description: "The direction for dividing the view. Currently, this field may not be actively used or may be deprecated.",
        },
        filters__op: {
          type: "string",
          description: "The operator for combining filters. Available values are `AND` and `OR`.",
        },
        parent__type: {
          type: "integer",
          description: "The level of the Hierarchy where the view is created. Options include: Workspace (Everything Level): `7`, Space: `4`, Folder: `5`, List: `6`.",
        },
        divide__field: {
          type: "string",
          description: "The field to divide the view by (e.g., to create swimlanes in a board view). Currently, this field may not be actively used or may be deprecated.",
        },
        grouping__dir: {
          type: "integer",
          description: "The sort order for grouping. Use `1` for ascending (e.g., urgent priority at the top) or `-1` for descending (e.g., no priority at the top).",
        },
        columns__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to display as columns in the view. Custom Fields require the `_cf` prefix and their ID (e.g., `_cf_custom_field_id`).",
        },
        filters__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to apply filters on; refer to ClickUp API documentation for available fields.",
        },
        filters__search: {
          type: "string",
          description: "A search string to filter tasks by name or content.",
        },
        grouping__field: {
          type: "string",
          description: "The field to group tasks by. Options include: `none`, `status`, `priority`, `assignee`, `tag`, or `dueDate`.",
        },
        sorting__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Fields to sort tasks by; refer to ClickUp API documentation for available filter fields.",
        },
        grouping__ignore: {
          type: "boolean",
          description: "If true, tasks with no value for the `grouping_field` will not be grouped.",
        },
        divide__collapsed: {
          type: "boolean",
          description: "Indicates if divided sections should be collapsed. Currently, this field may not be actively used or may be deprecated.",
        },
        grouping__collapsed: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of group identifiers (e.g., status names or assignee IDs) that should be collapsed by default in the view.",
        },
        filters__show__closed: {
          type: "boolean",
          description: "If true, closed tasks will be included in the view.",
        },
        settings__me__comments: {
          type: "boolean",
          description: "If true, in 'Me Mode', only comments where the current user is mentioned or involved will be shown.",
        },
        settings__me__subtasks: {
          type: "boolean",
          description: "If true, in 'Me Mode', only subtasks assigned to the current user will be shown.",
        },
        settings__show__images: {
          type: "boolean",
          description: "If true, images attached to tasks will be displayed in the view (e.g. cover images in card view).",
        },
        settings__me__checklists: {
          type: "boolean",
          description: "If true, in 'Me Mode', only checklists assigned to the current user will be shown.",
        },
        settings__show__subtasks: {
          type: "integer",
          description: "Controls how subtasks are displayed. Acceptable values are `1` (show subtasks as separate tasks), `2` (show subtasks expanded under parent task), or `3` (show subtasks collapsed under parent task).",
        },
        team__sidebar__assignees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of assignee user IDs to feature in the team sidebar.",
        },
        settings__show__assignees: {
          type: "boolean",
          description: "If true, assignees will be displayed on tasks.",
        },
        settings__show__task__locations: {
          type: "boolean",
          description: "If true, task locations (List, Folder, Space) will be displayed.",
        },
        settings__show__closed__subtasks: {
          type: "boolean",
          description: "If true, closed subtasks will be included in the view.",
        },
        team__sidebar__unassigned__tasks: {
          type: "boolean",
          description: "If true, unassigned tasks will be shown in the team sidebar.",
        },
        team__sidebar__assigned__comments: {
          type: "boolean",
          description: "If true, assigned comments will be shown in the team sidebar.",
        },
        settings__collapse__empty__columns: {
          type: "string",
          description: "If true, columns with no tasks will be collapsed (e.g., in Board view). This might accept boolean as a string like 'true' or 'false'.",
        },
        settings__show__subtask__parent__names: {
          type: "boolean",
          description: "If true, parent task names will be displayed for subtasks.",
        },
      },
      required: [
        "view_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "views",
    ],
    askBefore: [
      "Confirm the parameters before executing Update view.",
    ],
  }),
  composioTool({
    name: "clickup_update_webhook",
    description: "Updates the endpoint URL, monitored events, and status of an existing webhook, identified by its `webhook_id`.",
    toolSlug: "CLICKUP_UPDATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        events: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of event types to monitor. Use [\"*\"] to subscribe to all events. Common events include: taskCreated, taskUpdated, taskDeleted, taskStatusUpdated, taskAssigneeUpdated, taskDueDateUpdated, taskTagUpdated, taskMoved, taskCommentPosted, taskCommentUpdated, listCreated, listUpdated, listDeleted, folderCreated, folderUpdated, folderDeleted, spaceCreated, spaceUpdated, spaceDeleted, goalCreated, goalUpdated, goalDeleted, keyResultCreated, keyResultUpdated, keyResultDeleted.",
        },
        status: {
          type: "string",
          description: "The desired status of the webhook after the update.",
        },
        endpoint: {
          type: "string",
          description: "The new URL where the webhook payloads will be sent.",
        },
        webhook_id: {
          type: "string",
          description: "The unique identifier of the webhook to be updated. Example: 'e506-4a29-9d42-26e504e3435e'.",
        },
      },
      required: [
        "webhook_id",
        "endpoint",
        "events",
        "status",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update webhook.",
    ],
  }),
  composioTool({
    name: "clickup_update_workspace_acl",
    description: "Updates privacy and access control list (ACL) permissions for a workspace object or location. Use this to make objects private/public or manage user/team permissions for spaces, folders, lists, tasks, and other ClickUp objects.",
    toolSlug: "CLICKUP_UPDATE_WORKSPACE_ACL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The ID of the user or user group (Team).",
              },
              kind: {
                type: "string",
                description: "The type of entity. Use 'user' for individual users or 'user_group' for teams.",
              },
              calculated: {
                type: "boolean",
                description: "Whether the permission is calculated from parent permissions.",
              },
              from_group_id: {
                type: "string",
                description: "The user group ID from which this permission is inherited.",
              },
              from_parent_id: {
                type: "string",
                description: "The parent object ID from which this permission is inherited.",
              },
              from_parent_type: {
                type: "string",
                description: "The parent object type from which this permission is inherited.",
              },
              permission_level: {
                type: "integer",
                description: "The permission level to assign. The specific values depend on the object type and workspace configuration. Common values include different access levels (e.g., view, edit, admin). Omit to remove permissions.",
              },
            },
            description: "ACL entry for a user or user group (Team).",
          },
          description: "The user or user group (Team) entries to give, remove, or edit permissions. Each entry must include 'kind' (user or user_group) and 'id'. Optionally include 'permission_level' to set specific permissions.",
        },
        private: {
          type: "boolean",
          description: "Set the privacy of the object or location. True for private, false for public.",
        },
        object_id: {
          type: "string",
          description: "The ID of the specific object to update ACL permissions for.",
        },
        object_type: {
          type: "string",
          description: "The type of object to update ACL permissions for.",
          enum: [
            "attachment",
            "attachmentAccess",
            "approval",
            "banWorkspace",
            "checklist",
            "checklistItem",
            "checklistTemplateAccess",
            "comment",
            "commentsLastReadAt",
            "customField",
            "customFieldAccess",
            "customItem",
            "customPermissionLevel",
            "dashboard",
            "dashboardAccess",
            "doc",
            "docAccess",
            "folder",
            "folderDescendantsSet",
            "folderTemplateAccess",
            "form",
            "formulaValue",
            "foundationalJob",
            "goal",
            "goalAccess",
            "goalFolder",
            "goalFolderAccess",
            "hierarchy",
            "list",
            "listDescendantsSet",
            "listDescendantsPoints",
            "listDescendantsTimeEstimates",
            "listTemplateAccess",
            "notepad",
            "page",
            "pageAccess",
            "post",
            "reminder",
            "reminderAccess",
            "rolledUpFieldValue",
            "scheduledComment",
            "space",
            "spaceDescendantsSet",
            "spaceTemplateAccess",
            "task",
            "taskAccess",
            "taskHistory",
            "taskProperty",
            "taskTemplateAccess",
            "template",
            "user",
            "userAccess",
            "userGroup",
            "userHierarchy",
            "userPresence",
            "view",
            "viewAccess",
            "viewTemplateAccess",
            "whiteboard",
            "whiteboardAccess",
            "widget",
            "workspace",
            "workspaceDescendantsSet",
            "workscheduleWorkweekSchedule",
            "workscheduleScheduleExceptions",
          ],
        },
        workspace_id: {
          type: "string",
          description: "The ID of the Workspace. Numeric string.",
        },
      },
      required: [
        "workspace_id",
        "object_type",
        "object_id",
      ],
    },
    tags: [
      "composio",
      "clickup",
      "write",
      "workspaces",
      "acl",
      "permissions",
    ],
    askBefore: [
      "Confirm the parameters before executing Update workspace ACL.",
    ],
  }),
];
