import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const ClickupPipedreamToolManifests = [
  {
    "integration": "clickup",
    "name": "clickup_create_checklist",
    "description": "Creates a new checklist in a task. [See the documentation](https://clickup.com/api) in **Checklists / Create Checklist** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of checklist"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "The ID of a task"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId",
        "taskId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-checklist",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of checklist",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "The ID of a task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-checklist",
      "componentName": "Create Checklist"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_checklist_item",
    "description": "Creates a new item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Create Checklist Item** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of item"
        },
        "assignee": {
          "type": "string",
          "title": "Assignee",
          "description": "Select the assignees"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "The ID of a task"
        },
        "checklistId": {
          "type": "string",
          "title": "Checklist ID",
          "description": "To show options please select a **Task** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId",
        "taskId",
        "checklistId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-checklist-item",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of item",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignee",
          "type": "string",
          "label": "Assignee",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "The ID of a task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistId",
          "type": "string",
          "label": "Checklist ID",
          "description": "To show options please select a **Task** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-checklist-item",
      "componentName": "Create Checklist Item"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_folder",
    "description": "Creates a new folder. [See the documentation](https://clickup.com/api) in **Folders / Create Folder** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of folder"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "hidden": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-folder",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of folder",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "hidden",
          "type": "boolean",
          "label": "Hidden",
          "description": "Folder will be set hidden",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-folder",
      "componentName": "Create Folder"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_list",
    "description": "Creates a new list. [See the documentation](https://clickup.com/api) in **Lists / Create List** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "folderId": {
          "type": "string",
          "title": "Folder",
          "description": "The id of a folder"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of list"
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "The content of list"
        },
        "priority": {
          "type": "string",
          "title": "Priority",
          "description": "The level of priority"
        },
        "assignee": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        }
      },
      "required": [
        "workspaceId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-list",
      "version": "0.0.17",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder",
          "description": "The id of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "content",
          "type": "string",
          "label": "Content",
          "description": "The content of list",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "priority",
          "type": "string",
          "label": "Priority",
          "description": "The level of priority",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignee",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-list",
      "componentName": "Create List"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_list_comment",
    "description": "Creates a list comment. [See the documentation](https://clickup.com/api) in **Comments / Create List Comment** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "commentText": {
          "type": "string",
          "title": "Comment Text",
          "description": "The text of the comment"
        },
        "notifyAll": {
          "type": "boolean",
          "title": "Notify All",
          "description": "Will notify all"
        },
        "assignees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "commentText",
        "listId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-list-comment",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "commentText",
          "type": "string",
          "label": "Comment Text",
          "description": "The text of the comment",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "notifyAll",
          "type": "boolean",
          "label": "Notify All",
          "description": "Will notify all",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignees",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-list-comment",
      "componentName": "Create List Comment"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_space",
    "description": "Creates a new space. [See the documentation](https://clickup.com/api) in **Spaces / Create Space** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of space"
        }
      },
      "required": [
        "workspaceId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "_private": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-space",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "_private",
          "type": "boolean",
          "label": "Private",
          "description": "Space will be privated",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-space",
      "componentName": "Create Space"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_task",
    "description": "Creates a new task. [See the documentation](https://clickup.com/api) in **Tasks / Create Task** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of task"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The description of task"
        },
        "priority": {
          "type": "string",
          "title": "Priority",
          "description": "The level of priority"
        },
        "assignees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "Select the tags"
        },
        "dueDate": {
          "type": "string",
          "title": "Due Date",
          "description": "Due date of the task in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). e.g. `2023-05-13T23:45:44Z`"
        },
        "dueDateTime": {
          "type": "boolean",
          "title": "Due Date Time",
          "description": "If set `true`, due date will be given with time. If not it will only be the closest date"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "Select a status"
        },
        "parent": {
          "type": "string",
          "title": "Parent Task ID",
          "description": "The ID of a task"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-task",
      "version": "0.0.17",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "The description of task",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "markdownDescription",
          "type": "string",
          "label": "Markdown Description",
          "description": "The description of task with markdown formatting",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "priority",
          "type": "string",
          "label": "Priority",
          "description": "The level of priority",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignees",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "Select the tags",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDate",
          "type": "string",
          "label": "Due Date",
          "description": "Due date of the task in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). e.g. `2023-05-13T23:45:44Z`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDateTime",
          "type": "boolean",
          "label": "Due Date Time",
          "description": "If set `true`, due date will be given with time. If not it will only be the closest date",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "Select a status",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "parent",
          "type": "string",
          "label": "Parent Task ID",
          "description": "The ID of a task",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-task",
      "componentName": "Create Task"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_task_comment",
    "description": "Creates a task comment. [See the documentation](https://clickup.com/api) in **Comments / Create Task Comment** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "commentText": {
          "type": "string",
          "title": "Comment Text",
          "description": "The text of the comment"
        },
        "notifyAll": {
          "type": "boolean",
          "title": "Notify All",
          "description": "Will notify all"
        },
        "assignees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "The ID of a task"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "commentText",
        "listId",
        "taskId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-task-comment",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "commentText",
          "type": "string",
          "label": "Comment Text",
          "description": "The text of the comment",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "notifyAll",
          "type": "boolean",
          "label": "Notify All",
          "description": "Will notify all",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignees",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "The ID of a task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-task-comment",
      "componentName": "Create Task Comment"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_create_time_entry",
    "description": "Create a new time entry. [See the documentation](https://developer.clickup.com/reference/createatimeentry)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "Select the tags"
        },
        "start": {
          "type": "string",
          "title": "Start Time",
          "description": "The Start Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)"
        },
        "end": {
          "type": "string",
          "title": "End Time",
          "description": "The End Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "Description of the time entry"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "start",
        "end",
        "description"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-create-time-entry",
      "version": "0.0.2",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "Select the tags",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "start",
          "type": "string",
          "label": "Start Time",
          "description": "The Start Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "end",
          "type": "string",
          "label": "End Time",
          "description": "The End Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "Description of the time entry",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-create-time-entry",
      "componentName": "Create Time Entry"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_checklist",
    "description": "Deletes a checklist in a task. [See the documentation](https://clickup.com/api) in **Checklists / Delete Checklist** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "The ID of a task"
        },
        "checklistId": {
          "type": "string",
          "title": "Checklist ID",
          "description": "To show options please select a **Task** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId",
        "checklistId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-checklist",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "The ID of a task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistId",
          "type": "string",
          "label": "Checklist ID",
          "description": "To show options please select a **Task** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-checklist",
      "componentName": "Delete Checklist"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_checklist_item",
    "description": "Deletes item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Delete Checklist Item** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "checklistId": {
          "type": "string",
          "title": "Checklist ID",
          "description": "To show options please select a **Task** first"
        },
        "checklistItemId": {
          "type": "string",
          "title": "Checklist Item ID",
          "description": "To show options please select a **Task and Checklist** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId",
        "checklistId",
        "checklistItemId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-checklist-item",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistId",
          "type": "string",
          "label": "Checklist ID",
          "description": "To show options please select a **Task** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistItemId",
          "type": "string",
          "label": "Checklist Item ID",
          "description": "To show options please select a **Task and Checklist** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-checklist-item",
      "componentName": "Delete Checklist Item"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_comment",
    "description": "Deletes a comment. [See the documentation](https://clickup.com/api) in **Comments / Deleet Comment** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-comment",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-comment",
      "componentName": "Delete Comment"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_folder",
    "description": "Delete a folder. [See the documentation](https://clickup.com/api) in **Folders / Delete Folder** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-folder",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-folder",
      "componentName": "Delete Folder"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_list",
    "description": "Delete a list. [See the documentation](https://clickup.com/api) in **Lists / Delete List** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-list",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-list",
      "componentName": "Delete List"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_space",
    "description": "Delete a space. [See the documentation](https://clickup.com/api) in **Spaces / Delete Space** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-space",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-space",
      "componentName": "Delete Space"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_delete_task",
    "description": "Delete a task. [See the documentation](https://clickup.com/api) in **Tasks / Delete Task** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-delete-task",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-delete-task",
      "componentName": "Delete Task"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_custom_fields",
    "description": "Get a list of custom fields. [See the documentation](https://clickup.com/api) in **Custom Fields / Get Accessible Custom Fields** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-custom-fields",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-custom-fields",
      "componentName": "Get Custom Fields"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_folder",
    "description": "Get a folder in a workplace. [See the documentation](https://clickup.com/api) in **Folders / Get Folder** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-folder",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-folder",
      "componentName": "Get Folder"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_folder_views",
    "description": "Get all views of a folder. [See the documentation](https://clickup.com/api) in **Views / Get Folder Views** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-folder-views",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-folder-views",
      "componentName": "Get Folder Views"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_folders",
    "description": "Get a list of folders in a workplace. [See the documentation](https://clickup.com/api) in **Folders / Get Folders** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Filter for archived folders"
        }
      },
      "required": [
        "workspaceId",
        "spaceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-folders",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Filter for archived folders",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-folders",
      "componentName": "Get Folders"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_list",
    "description": "Get a list. [See the documentation](https://clickup.com/api) in **Lists / Get List** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-list",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-list",
      "componentName": "Get List"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_list_comments",
    "description": "Get a list comments. [See the documentation](https://clickup.com/api) in **Comments / Get List Comments** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-list-comments",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-list-comments",
      "componentName": "Get List Comments"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_list_views",
    "description": "Get all views of a list. [See the documentation](https://clickup.com/api) in **Views / Get List Views** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-list-views",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-list-views",
      "componentName": "Get List Views"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_lists",
    "description": "Get a list of lists. [See the documentation](https://clickup.com/api) in **Lists / Get Lists** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "folderId": {
          "type": "string",
          "title": "Folder",
          "description": "The id of a folder"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Filter for archived lists"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "folderId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-lists",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder",
          "description": "The id of a folder",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Filter for archived lists",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-lists",
      "componentName": "Get Lists"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_space",
    "description": "Get a space in a workplace. [See the documentation](https://clickup.com/api) in **Spaces / Get Space** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-space",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-space",
      "componentName": "Get Space"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_space_views",
    "description": "Get all views of a space. [See the documentation](https://clickup.com/api) in **Views / Get Space Views** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-space-views",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-space-views",
      "componentName": "Get Space Views"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_spaces",
    "description": "Get a list of spaces in a workplace. [See the documentation](https://clickup.com/api) in **Spaces / Get Spaces** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Filter for archived spaces"
        }
      },
      "required": [
        "workspaceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-spaces",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Filter for archived spaces",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-spaces",
      "componentName": "Get Spaces"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_task",
    "description": "Get a task. [See the documentation](https://clickup.com/api) in **Tasks / Get Task** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-task",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-task",
      "componentName": "Get Task"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_task_comments",
    "description": "Get a task comments. [See the documentation](https://clickup.com/api) in **Comments / Get Task Comments** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "taskId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-task-comments",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-task-comments",
      "componentName": "Get Task Comments"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_task_templates",
    "description": "Get a list of templates. [See the documentation](https://clickup.com/api) in **Task Templates / Get Task Templates** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "page": {
          "type": "number",
          "title": "page",
          "description": "Page to return templates"
        }
      },
      "required": [
        "workspaceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-task-templates",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "integer",
          "label": "page",
          "description": "Page to return templates",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-task-templates",
      "componentName": "Get Task Templates"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_tasks",
    "description": "Get a list of tasks. [See the documentation](https://clickup.com/api) in **Tasks / Get Tasks** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Filter for archived tasks"
        },
        "page": {
          "type": "number",
          "title": "Page",
          "description": "The page number to be returned"
        },
        "orderBy": {
          "type": "string",
          "title": "Order By",
          "description": "Order to return tasks"
        },
        "assignees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "statuses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Statuses",
          "description": "Filter tasks by one or more statuses"
        },
        "includeMarkdownDescription": {
          "type": "boolean",
          "title": "Include Markdown Description",
          "description": "Return task descriptions in Markdown format"
        },
        "subtasks": {
          "type": "boolean",
          "title": "Include Subtasks",
          "description": "Include subtasks in the response"
        },
        "includeClosed": {
          "type": "boolean",
          "title": "Include Closed",
          "description": "Include tasks with a Closed status. By default, closed tasks are not returned"
        },
        "includeTiml": {
          "type": "boolean",
          "title": "Include Tasks in Multiple Lists (TIML)",
          "description": "Include tasks that exist in multiple lists"
        },
        "watchers": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Watchers",
          "description": "Filter tasks by watchers"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "Select the tags"
        },
        "dueDateGt": {
          "type": "number",
          "title": "Due Date Greater Than",
          "description": "Filter tasks with a due date greater than the Unix timestamp (in milliseconds) provided"
        },
        "dueDateLt": {
          "type": "number",
          "title": "Due Date Less Than",
          "description": "Filter tasks with a due date less than the Unix timestamp (in milliseconds) provided"
        },
        "dateCreatedGt": {
          "type": "number",
          "title": "Date Created Greater Than",
          "description": "Filter tasks created after the Unix timestamp (in milliseconds) provided"
        },
        "dateCreatedLt": {
          "type": "number",
          "title": "Date Created Less Than",
          "description": "Filter tasks created before the Unix timestamp (in milliseconds) provided"
        },
        "dateUpdatedGt": {
          "type": "number",
          "title": "Date Updated Greater Than",
          "description": "Filter tasks updated after the Unix timestamp (in milliseconds) provided"
        },
        "dateDoneGt": {
          "type": "number",
          "title": "Date Done Greater Than",
          "description": "Filter tasks completed after the Unix timestamp (in milliseconds) provided"
        },
        "dateDoneLt": {
          "type": "number",
          "title": "Date Done Less Than",
          "description": "Filter tasks completed before the Unix timestamp (in milliseconds) provided"
        },
        "customItems": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Custom Items",
          "description": "Filter by custom task types. Use `0` for Tasks and `1` for Milestones"
        },
        "customFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Custom Fields",
          "description": "Filter tasks by custom field values. Use the **Get Custom Fields** action to retrieve valid `field_id` values for your list. Provide a JSON array of filter objects, e.g. `[{\"field_id\": \"abc\", \"operator\": \"=\", \"value\": \"foo\"}]`"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-tasks",
      "version": "0.0.13",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Filter for archived tasks",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "integer",
          "label": "Page",
          "description": "The page number to be returned",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "orderBy",
          "type": "string",
          "label": "Order By",
          "description": "Order to return tasks",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "assignees",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "statuses",
          "type": "string[]",
          "label": "Statuses",
          "description": "Filter tasks by one or more statuses",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "includeMarkdownDescription",
          "type": "boolean",
          "label": "Include Markdown Description",
          "description": "Return task descriptions in Markdown format",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subtasks",
          "type": "boolean",
          "label": "Include Subtasks",
          "description": "Include subtasks in the response",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "includeClosed",
          "type": "boolean",
          "label": "Include Closed",
          "description": "Include tasks with a Closed status. By default, closed tasks are not returned",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "includeTiml",
          "type": "boolean",
          "label": "Include Tasks in Multiple Lists (TIML)",
          "description": "Include tasks that exist in multiple lists",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "watchers",
          "type": "string[]",
          "label": "Watchers",
          "description": "Filter tasks by watchers",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "Select the tags",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDateGt",
          "type": "integer",
          "label": "Due Date Greater Than",
          "description": "Filter tasks with a due date greater than the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDateLt",
          "type": "integer",
          "label": "Due Date Less Than",
          "description": "Filter tasks with a due date less than the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dateCreatedGt",
          "type": "integer",
          "label": "Date Created Greater Than",
          "description": "Filter tasks created after the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dateCreatedLt",
          "type": "integer",
          "label": "Date Created Less Than",
          "description": "Filter tasks created before the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dateUpdatedGt",
          "type": "integer",
          "label": "Date Updated Greater Than",
          "description": "Filter tasks updated after the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dateDoneGt",
          "type": "integer",
          "label": "Date Done Greater Than",
          "description": "Filter tasks completed after the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dateDoneLt",
          "type": "integer",
          "label": "Date Done Less Than",
          "description": "Filter tasks completed before the Unix timestamp (in milliseconds) provided",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "customItems",
          "type": "string[]",
          "label": "Custom Items",
          "description": "Filter by custom task types. Use `0` for Tasks and `1` for Milestones",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "customFields",
          "type": "string[]",
          "label": "Custom Fields",
          "description": "Filter tasks by custom field values. Use the **Get Custom Fields** action to retrieve valid `field_id` values for your list. Provide a JSON array of filter objects, e.g. `[{\"field_id\": \"abc\", \"operator\": \"=\", \"value\": \"foo\"}]`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-tasks",
      "componentName": "Get Tasks"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_team_views",
    "description": "Get all views of a team. [See the documentation](https://clickup.com/api) in **Views / Get Team Views** section.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-team-views",
      "version": "0.0.12",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-team-views",
      "componentName": "Get Team Views"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_view",
    "description": "Get a view. [See the documentation](https://clickup.com/api) in **Views / Get View** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "viewId": {
          "type": "string",
          "title": "View ID",
          "description": "The ID of a view"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "viewId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-view",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "viewId",
          "type": "string",
          "label": "View ID",
          "description": "The ID of a view",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-view",
      "componentName": "Get View"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_view_comments",
    "description": "Get a view comments. [See the documentation](https://clickup.com/api) in **Comments / Get Chat View Comments** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "viewId": {
          "type": "string",
          "title": "View ID",
          "description": "The ID of a view"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "viewId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-view-comments",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "viewId",
          "type": "string",
          "label": "View ID",
          "description": "The ID of a view",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-view-comments",
      "componentName": "Get View Comments"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_get_view_tasks",
    "description": "Get all tasks of a view. [See the documentation](https://clickup.com/api) in **Views / Get View Tasks** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "page": {
          "type": "number",
          "title": "Page",
          "description": "The page number to be returned"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "viewId": {
          "type": "string",
          "title": "View ID",
          "description": "The ID of a view"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "viewId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-get-view-tasks",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "integer",
          "label": "Page",
          "description": "The page number to be returned",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "viewId",
          "type": "string",
          "label": "View ID",
          "description": "The ID of a view",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-get-view-tasks",
      "componentName": "Get View Tasks"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_remove_task_custom_field",
    "description": "Remove custom field from a task. [See the documentation](https://clickup.com/api) in **Custom Fields / Remove Custom Field Value** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "customFieldId": {
          "type": "string",
          "title": "Custom Field ID",
          "description": "Select a custom field"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId",
        "customFieldId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-remove-task-custom-field",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "customFieldId",
          "type": "string",
          "label": "Custom Field ID",
          "description": "Select a custom field",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-remove-task-custom-field",
      "componentName": "Remove Task Custom Field"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_start_time_entry",
    "description": "Start time entry. [See the documentation](https://clickup.com/api/clickupreference/operation/StartatimeEntry)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "Description of the time entry"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "description",
        "taskId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-start-time-entry",
      "version": "0.0.6",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "Description of the time entry",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-start-time-entry",
      "componentName": "Start Time Entry"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_stop_time_entry",
    "description": "Stop time entry. [See the documentation](https://clickup.com/api/clickupreference/operation/StopatimeEntry)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-stop-time-entry",
      "version": "0.0.7",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-stop-time-entry",
      "componentName": "Stop Time Entry"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_checklist",
    "description": "Updates a checklist in a task. [See the documentation](https://clickup.com/api) in **Checklists / Edit Checklist** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of checklist"
        },
        "position": {
          "type": "number",
          "title": "Position",
          "description": "The position of checklist"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "checklistId": {
          "type": "string",
          "title": "Checklist ID",
          "description": "To show options please select a **Task** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId",
        "taskId",
        "checklistId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-checklist",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of checklist",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "position",
          "type": "integer",
          "label": "Position",
          "description": "The position of checklist",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistId",
          "type": "string",
          "label": "Checklist ID",
          "description": "To show options please select a **Task** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-checklist",
      "componentName": "Update Checklist"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_checklist_item",
    "description": "Updates item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Edit Checklist Item** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of item"
        },
        "assignee": {
          "type": "string",
          "title": "Assignee",
          "description": "Select the assignees"
        },
        "resolved": {
          "type": "boolean",
          "title": "Resolved",
          "description": "Set the item as resolved"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "checklistId": {
          "type": "string",
          "title": "Checklist ID",
          "description": "To show options please select a **Task** first"
        },
        "checklistItemId": {
          "type": "string",
          "title": "Checklist Item ID",
          "description": "To show options please select a **Task and Checklist** first"
        },
        "parent": {
          "type": "string",
          "title": "Checklist Parent ID",
          "description": "Set another checklist item as parent"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId",
        "taskId",
        "checklistId",
        "checklistItemId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-checklist-item",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of item",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignee",
          "type": "string",
          "label": "Assignee",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "resolved",
          "type": "boolean",
          "label": "Resolved",
          "description": "Set the item as resolved",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistId",
          "type": "string",
          "label": "Checklist ID",
          "description": "To show options please select a **Task** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "checklistItemId",
          "type": "string",
          "label": "Checklist Item ID",
          "description": "To show options please select a **Task and Checklist** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "parent",
          "type": "string",
          "label": "Checklist Parent ID",
          "description": "Set another checklist item as parent",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-checklist-item",
      "componentName": "Update Checklist Item"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_comment",
    "description": "Updates a comment. [See the documentation](https://clickup.com/api) in **Comments / Update Comment** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "The ID of a task"
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The ID of a comment"
        },
        "commentText": {
          "type": "string",
          "title": "Comment Text",
          "description": "The text of the comment"
        },
        "assignee": {
          "type": "string",
          "title": "Assignees",
          "description": "Select the assignee"
        },
        "resolved": {
          "type": "boolean",
          "title": "Resolved",
          "description": "Set the comment as resolved"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "listId",
        "taskId",
        "commentId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-comment",
      "version": "0.0.14",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "The ID of a task",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "commentId",
          "type": "string",
          "label": "Comment ID",
          "description": "The ID of a comment",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "commentText",
          "type": "string",
          "label": "Comment Text",
          "description": "The text of the comment",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignee",
          "type": "string",
          "label": "Assignees",
          "description": "Select the assignee",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "resolved",
          "type": "boolean",
          "label": "Resolved",
          "description": "Set the comment as resolved",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-comment",
      "componentName": "Update Comment"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_folder",
    "description": "Update a folder. [See the documentation](https://clickup.com/api) in **Folders / Update Folder** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "folderId": {
          "type": "string",
          "title": "Folder",
          "description": "The id of a folder"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of folder"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "folderId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "hidden": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-folder",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder",
          "description": "The id of a folder",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of folder",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "hidden",
          "type": "boolean",
          "label": "Hidden",
          "description": "Folder will be set hidden",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-folder",
      "componentName": "Update Folder"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_list",
    "description": "Update a list. [See the documentation](https://clickup.com/api) in **Lists / Update List** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of list"
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "The content of list"
        },
        "priority": {
          "type": "string",
          "title": "Priority",
          "description": "The level of priority"
        },
        "assignee": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name",
        "listId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-list",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "content",
          "type": "string",
          "label": "Content",
          "description": "The content of list",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "priority",
          "type": "string",
          "label": "Priority",
          "description": "The level of priority",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignee",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-list",
      "componentName": "Update List"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_space",
    "description": "Update a space. [See the documentation](https://clickup.com/api) in **Spaces / Update Space** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "The id of a space"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of space"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "_private": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-space",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "The id of a space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of space",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "_private",
          "type": "boolean",
          "label": "Private",
          "description": "Space will be privated",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-space",
      "componentName": "Update Space"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_task",
    "description": "Update a task. [See the documentation](https://clickup.com/api) in **Tasks / Update Task** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of task"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The description of task"
        },
        "priority": {
          "type": "string",
          "title": "Priority",
          "description": "The level of priority"
        },
        "assignees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Assignees",
          "description": "Select the assignees"
        },
        "dueDate": {
          "type": "string",
          "title": "Due Date",
          "description": "The due date of task, please use `YYYY-MM-DD` format"
        },
        "startDate": {
          "type": "string",
          "title": "Start Date",
          "description": "The start date of task, please use `YYYY-MM-DD` format"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "Select a status"
        },
        "parent": {
          "type": "string",
          "title": "Parent Task ID",
          "description": "The ID of a task"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "taskId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-task",
      "version": "0.0.14",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of task",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "The description of task",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "priority",
          "type": "string",
          "label": "Priority",
          "description": "The level of priority",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "assignees",
          "type": "string[]",
          "label": "Assignees",
          "description": "Select the assignees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDate",
          "type": "string",
          "label": "Due Date",
          "description": "The due date of task, please use `YYYY-MM-DD` format",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "startDate",
          "type": "string",
          "label": "Start Date",
          "description": "The start date of task, please use `YYYY-MM-DD` format",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "Select a status",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "parent",
          "type": "string",
          "label": "Parent Task ID",
          "description": "The ID of a task",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-task",
      "componentName": "Update Task"
    }
  },
  {
    "integration": "clickup",
    "name": "clickup_update_task_custom_field",
    "description": "Update custom field value of a task. [See the documentation](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspaceId": {
          "type": "string",
          "title": "Workspace",
          "description": "The id of a workspace"
        },
        "spaceId": {
          "type": "string",
          "title": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID"
        },
        "useCustomTaskIds": {
          "type": "boolean",
          "title": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`"
        },
        "authorizedTeamId": {
          "type": "string",
          "title": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`"
        },
        "value": {
          "type": "object",
          "title": "Value",
          "description": "The value of custom field"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of a folder"
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first"
        },
        "taskId": {
          "type": "string",
          "title": "Task ID",
          "description": "To show options please select a **List** first"
        },
        "customFieldId": {
          "type": "string",
          "title": "Custom Field ID",
          "description": "Select a custom field"
        }
      },
      "required": [
        "workspaceId",
        "spaceId",
        "value",
        "listId",
        "taskId",
        "customFieldId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "clickup",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "clickup",
      "componentId": "clickup-update-task-custom-field",
      "version": "0.0.12",
      "authPropNames": [
        "clickup"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "clickup",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "workspaceId",
          "type": "string",
          "label": "Workspace",
          "description": "The id of a workspace",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "spaceId",
          "type": "string",
          "label": "Space",
          "description": "If selected, the **Lists** will be filtered by this Space ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "useCustomTaskIds",
          "type": "boolean",
          "label": "Use custom task IDs",
          "description": "Whether it should use custom task id instead of the ClickUp task ID. Should be used with `Authorized Team`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "authorizedTeamId",
          "type": "string",
          "label": "Authorized Team",
          "description": "The id of the authorized team. should be used with `Custom Task Id`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "value",
          "type": "any",
          "label": "Value",
          "description": "The value of custom field",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of a folder",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The ID of a list. To show lists within a folder, please select a **Folder** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taskId",
          "type": "string",
          "label": "Task ID",
          "description": "To show options please select a **List** first",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "customFieldId",
          "type": "string",
          "label": "Custom Field ID",
          "description": "Select a custom field",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "clickup",
      "componentKey": "clickup-update-task-custom-field",
      "componentName": "Update Task Custom Field"
    }
  }
] satisfies PipedreamActionToolManifest[];
