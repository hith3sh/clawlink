import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleDrivePipedreamToolManifests = [
  {
    "integration": "google-drive",
    "name": "google-drive_add_comment",
    "description": "Add an unanchored comment to a Google Doc (general feedback, no text highlighting). [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to add a comment to."
        },
        "content": {
          "type": "string",
          "title": "Comment Content",
          "description": "The text content of the comment to add"
        },
        "anchor": {
          "type": "string",
          "title": "Anchor",
          "description": "A region of the document represented as a JSON string. For details on defining anchor properties, refer to [Manage comments and replies](https://developers.google.com/workspace/drive/api/v3/manage-comments)."
        }
      },
      "required": [
        "drive",
        "fileId",
        "content"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-add-comment",
      "version": "0.1.5",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to add a comment to.",
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
          "label": "Comment Content",
          "description": "The text content of the comment to add",
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
          "name": "anchor",
          "type": "string",
          "label": "Anchor",
          "description": "A region of the document represented as a JSON string. For details on defining anchor properties, refer to [Manage comments and replies](https://developers.google.com/workspace/drive/api/v3/manage-comments).",
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
      "app": "google_drive",
      "componentKey": "google_drive-add-comment",
      "componentName": "Add Comment"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_add_file_sharing_preference",
    "description": "Add a [sharing permission](https://support.google.com/drive/answer/7166529) to the sharing preferences of a file or folder and provide a sharing URL. [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "useFileOrFolder": {
          "type": "string",
          "title": "Use File or Folder",
          "description": "Whether to use a file or a folder for this action"
        },
        "type": {
          "type": "string",
          "title": "Type",
          "description": "The type of the grantee. Sharing with a domain is only valid for G Suite users."
        }
      },
      "required": [
        "useFileOrFolder",
        "type"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-add-file-sharing-preference",
      "version": "0.2.13",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [
        "useFileOrFolder",
        "type"
      ],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "useFileOrFolder",
          "type": "string",
          "label": "Use File or Folder",
          "description": "Whether to use a file or a folder for this action",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to share. You must specify either a file or a folder.",
          "required": true,
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
          "name": "folderId",
          "type": "string",
          "label": "Folder",
          "description": "The folder to share. You must specify either a file or a folder.",
          "required": true,
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
          "name": "type",
          "type": "string",
          "label": "Type",
          "description": "The type of the grantee. Sharing with a domain is only valid for G Suite users.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_drive",
      "componentKey": "google_drive-add-file-sharing-preference",
      "componentName": "Share File or Folder"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_copy_file",
    "description": "Create a copy of the specified file. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/copy) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to copy"
        }
      },
      "required": [
        "fileId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-copy-file",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to copy",
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
      "app": "google_drive",
      "componentKey": "google_drive-copy-file",
      "componentName": "Copy File"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_create_file_from_template",
    "description": "Create a new Google Docs file from a template. Optionally include placeholders in the template document that will get replaced from this action. [See documentation](https://www.npmjs.com/package/google-docs-mustaches)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive Containing Template",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "templateId": {
          "type": "string",
          "title": "File",
          "description": "Select the template document you'd like to use as the template, or use a custom expression to reference a document ID from a previous step. Template documents should contain placeholders in the format `{{xyz}}`."
        },
        "destinationDrive": {
          "type": "string",
          "title": "Destination Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "folderId": {
          "type": "string",
          "title": "Folder",
          "description": "Select the folder of the newly created Google Doc and/or PDF, or use a custom expression to reference a folder ID from a previous step."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "Name of the file you want to create (eg. `myFile` will create a Google Doc called `myFile` and a pdf called `myFile.pdf`)"
        },
        "mode": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Mode",
          "description": "Specify if you want to create a Google Doc, PDF or both."
        }
      },
      "required": [
        "templateId",
        "name",
        "mode"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "replaceValues": "{}"
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_drive",
      "componentId": "google_drive-create-file-from-template",
      "version": "0.1.23",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive Containing Template",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "templateId",
          "type": "string",
          "label": "File",
          "description": "Select the template document you'd like to use as the template, or use a custom expression to reference a document ID from a previous step. Template documents should contain placeholders in the format `{{xyz}}`.",
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
          "name": "destinationDrive",
          "type": "string",
          "label": "Destination Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "description": "Select the folder of the newly created Google Doc and/or PDF, or use a custom expression to reference a folder ID from a previous step.",
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
          "description": "Name of the file you want to create (eg. `myFile` will create a Google Doc called `myFile` and a pdf called `myFile.pdf`)",
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
          "name": "mode",
          "type": "string[]",
          "label": "Mode",
          "description": "Specify if you want to create a Google Doc, PDF or both.",
          "required": true,
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
          "name": "replaceValues",
          "type": "object",
          "label": "Replace text placeholders",
          "description": "Replace text placeholders in the document. Use the format `{{xyz}}` in the document but exclude the curly braces in the key. (eg. `{{myPlaceholder}}` in the document will be replaced by the value of the key `myPlaceholder` in the action.",
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
      "app": "google_drive",
      "componentKey": "google_drive-create-file-from-template",
      "componentName": "Create New File From Template"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_create_shared_drive",
    "description": "Create a new shared drive. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/create) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the new shared drive"
        }
      },
      "required": [
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-create-shared-drive",
      "version": "0.1.21",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the new shared drive",
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
      "app": "google_drive",
      "componentKey": "google_drive-create-shared-drive",
      "componentName": "Create Shared Drive"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_delete_comment",
    "description": "Delete a specific comment (Requires ownership or permissions). [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/delete)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file containing the comment to delete."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The ID of the comment to delete."
        }
      },
      "required": [
        "drive",
        "fileId",
        "commentId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-delete-comment",
      "version": "0.0.9",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file containing the comment to delete.",
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
          "description": "The ID of the comment to delete.",
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
      "app": "google_drive",
      "componentKey": "google_drive-delete-comment",
      "componentName": "Delete Comment"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_delete_file",
    "description": "Permanently delete a file or folder without moving it to the trash. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/delete) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File or Folder",
          "description": "The file or folder to delete"
        }
      },
      "required": [
        "fileId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-delete-file",
      "version": "0.1.21",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "infoAlert",
          "type": "alert",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File or Folder",
          "description": "The file or folder to delete",
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
      "app": "google_drive",
      "componentKey": "google_drive-delete-file",
      "componentName": "Delete File"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_delete_reply",
    "description": "Delete a reply on a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/delete) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step."
        },
        "replyId": {
          "type": "string",
          "title": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step."
        }
      },
      "required": [
        "fileId",
        "commentId",
        "replyId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-delete-reply",
      "version": "0.0.6",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileIdTip",
          "type": "alert",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step.",
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
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
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
          "name": "replyId",
          "type": "string",
          "label": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step.",
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
      "app": "google_drive",
      "componentKey": "google_drive-delete-reply",
      "componentName": "Delete Reply"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_find_file",
    "description": "Search for a specific file by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "nameSearchTerm": {
          "type": "string",
          "title": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`)."
        },
        "searchQuery": {
          "type": "string",
          "title": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` will be ignored."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-find-file",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "nameSearchTerm",
          "type": "string",
          "label": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`).",
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
          "name": "searchQuery",
          "type": "string",
          "label": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` will be ignored.",
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
      "app": "google_drive",
      "componentKey": "google_drive-find-file",
      "componentName": "Find File"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_find_folder",
    "description": "Search for a specific folder by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "nameSearchTerm": {
          "type": "string",
          "title": "Search Name",
          "description": "The name of the folder to search for"
        },
        "includeTrashed": {
          "type": "boolean",
          "title": "Include Trashed",
          "description": "If set to true, returns all matches including items currently in the trash. Defaults to `false`."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-find-folder",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "nameSearchTerm",
          "type": "string",
          "label": "Search Name",
          "description": "The name of the folder to search for",
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
          "name": "includeTrashed",
          "type": "boolean",
          "label": "Include Trashed",
          "description": "If set to true, returns all matches including items currently in the trash. Defaults to `false`.",
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
      "app": "google_drive",
      "componentKey": "google_drive-find-folder",
      "componentName": "Find Folder"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_find_forms",
    "description": "List Google Form documents or search for a Form by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "folderId": {
          "type": "string",
          "title": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder."
        },
        "nameSearchTerm": {
          "type": "string",
          "title": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`)."
        },
        "searchQuery": {
          "type": "string",
          "title": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-find-forms",
      "version": "0.0.21",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "label": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder.",
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
          "name": "queryAlert",
          "type": "alert",
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
          "name": "nameSearchTerm",
          "type": "string",
          "label": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`).",
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
          "name": "searchQuery",
          "type": "string",
          "label": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored.",
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
      "app": "google_drive",
      "componentKey": "google_drive-find-forms",
      "componentName": "Find Forms"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_find_spreadsheets",
    "description": "Search for a specific spreadsheet by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "folderId": {
          "type": "string",
          "title": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder."
        },
        "nameSearchTerm": {
          "type": "string",
          "title": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`)."
        },
        "searchQuery": {
          "type": "string",
          "title": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-find-spreadsheets",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "label": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder.",
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
          "name": "queryAlert",
          "type": "alert",
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
          "name": "nameSearchTerm",
          "type": "string",
          "label": "Search Name",
          "description": "Search for a file by name (equivalent to the query `name contains [value]`).",
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
          "name": "searchQuery",
          "type": "string",
          "label": "Search Query",
          "description": "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored.",
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
      "app": "google_drive",
      "componentKey": "google_drive-find-spreadsheets",
      "componentName": "Find Spreadsheets"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_comment",
    "description": "Get comment by ID on a specific file. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/get) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step."
        },
        "includeDeleted": {
          "type": "boolean",
          "title": "Include Deleted",
          "description": "Whether to include deleted comments."
        }
      },
      "required": [
        "fileId",
        "commentId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-comment",
      "version": "0.0.6",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileIdTip",
          "type": "alert",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step.",
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
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
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
          "name": "includeDeleted",
          "type": "boolean",
          "label": "Include Deleted",
          "description": "Whether to include deleted comments.",
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
      "app": "google_drive",
      "componentKey": "google_drive-get-comment",
      "componentName": "Get Comment By ID"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_current_user",
    "description": "Retrieve Google Drive account metadata for the authenticated user via `about.get`, including display name, email, permission ID, and storage quota. Useful when flows or agents need to confirm the active Google identity or understand available storage. [See the documentation](https://developers.google.com/drive/api/v3/reference/about/get).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-current-user",
      "version": "0.0.7",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
        }
      ]
    },
    "source": {
      "app": "google_drive",
      "componentKey": "google_drive-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_file_by_id",
    "description": "get-file-by-id via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-file-by-id",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_drive",
      "componentKey": "google_drive-get-file-by-id",
      "componentName": "get-file-by-id"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_folder_id_for_path",
    "description": "Retrieve a folderId for a path. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "path": {
          "type": "string",
          "title": "Path",
          "description": "The path to the folder (e.g., `myFolder/mySubFolder1/mySubFolder2`)"
        }
      },
      "required": [
        "path"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-folder-id-for-path",
      "version": "0.1.22",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "path",
          "type": "string",
          "label": "Path",
          "description": "The path to the folder (e.g., `myFolder/mySubFolder1/mySubFolder2`)",
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
      "app": "google_drive",
      "componentKey": "google_drive-get-folder-id-for-path",
      "componentName": "Get Folder ID for a Path"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_reply",
    "description": "Get reply by ID on a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/get) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step."
        },
        "replyId": {
          "type": "string",
          "title": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step."
        }
      },
      "required": [
        "fileId",
        "commentId",
        "replyId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-reply",
      "version": "0.0.6",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileIdTip",
          "type": "alert",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step.",
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
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
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
          "name": "replyId",
          "type": "string",
          "label": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step.",
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
      "app": "google_drive",
      "componentKey": "google_drive-get-reply",
      "componentName": "Get Reply By ID"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_get_shared_drive",
    "description": "Get metadata for one or all shared drives. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/get) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Shared Drive",
          "description": "Select a [Shared Drive](https://support.google.com/a/users/answer/9310351) or leave blank to retrieve all available shared drives."
        },
        "useDomainAdminAccess": {
          "type": "boolean",
          "title": "Use Domain Admin Access",
          "description": "Issue the request as a domain administrator"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-get-shared-drive",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Shared Drive",
          "description": "Select a [Shared Drive](https://support.google.com/a/users/answer/9310351) or leave blank to retrieve all available shared drives.",
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
          "name": "useDomainAdminAccess",
          "type": "boolean",
          "label": "Use Domain Admin Access",
          "description": "Issue the request as a domain administrator",
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
      "app": "google_drive",
      "componentKey": "google_drive-get-shared-drive",
      "componentName": "Get Shared Drive"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_list_access_proposals",
    "description": "List access proposals for a file or folder. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/accessproposals/list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileOrFolderId": {
          "type": "string",
          "title": "File or Folder",
          "description": "The file or folder in the drive"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": [
        "fileOrFolderId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-list-access-proposals",
      "version": "0.0.13",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileOrFolderId",
          "type": "string",
          "label": "File or Folder",
          "description": "The file or folder in the drive",
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
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "The maximum number of results to return",
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
      "app": "google_drive",
      "componentKey": "google_drive-list-access-proposals",
      "componentName": "List Access Proposals"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_list_comments",
    "description": "List all comments on a file. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to list comments for."
        }
      },
      "required": [
        "drive",
        "fileId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-list-comments",
      "version": "0.0.9",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to list comments for.",
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
      "app": "google_drive",
      "componentKey": "google_drive-list-comments",
      "componentName": "List Comments"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_list_files",
    "description": "List files from a specific folder. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "includeItemsFromAllDrives": {
          "type": "boolean",
          "title": "Include Items From All Drives",
          "description": "If `true`, include items from all drives. If `false`, include items from the drive specified in the `drive` prop."
        },
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "folderId": {
          "type": "string",
          "title": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder."
        },
        "fields": {
          "type": "string",
          "title": "Fields",
          "description": "The fields you want included in the response [(see the documentation for available fields)](https://developers.google.com/drive/api/reference/rest/v3/files). If not specified, the response includes a default set of fields specific to this method. For development you can use the special value `*` to return all fields, but you'll achieve greater performance by only selecting the fields you need.\n\n**eg:** `files(id,mimeType,name,webContentLink,webViewLink)`"
        },
        "filterText": {
          "type": "string",
          "title": "Filter Text",
          "description": "Filter by file name that contains a specific text"
        },
        "trashed": {
          "type": "boolean",
          "title": "Trashed",
          "description": "If `true`, list **only** trashed files. If `false`, list **only** non-trashed files. Keep it empty to include both."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-list-files",
      "version": "0.2.2",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [
        "filterText"
      ],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "includeItemsFromAllDrives",
          "type": "boolean",
          "label": "Include Items From All Drives",
          "description": "If `true`, include items from all drives. If `false`, include items from the drive specified in the `drive` prop.",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "label": "Parent Folder",
          "description": "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder.",
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
          "name": "fields",
          "type": "string",
          "label": "Fields",
          "description": "The fields you want included in the response [(see the documentation for available fields)](https://developers.google.com/drive/api/reference/rest/v3/files). If not specified, the response includes a default set of fields specific to this method. For development you can use the special value `*` to return all fields, but you'll achieve greater performance by only selecting the fields you need.\n\n**eg:** `files(id,mimeType,name,webContentLink,webViewLink)`",
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
          "name": "filterText",
          "type": "string",
          "label": "Filter Text",
          "description": "Filter by file name that contains a specific text",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trashed",
          "type": "boolean",
          "label": "Trashed",
          "description": "If `true`, list **only** trashed files. If `false`, list **only** non-trashed files. Keep it empty to include both.",
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
      "app": "google_drive",
      "componentKey": "google_drive-list-files",
      "componentName": "List Files"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_list_replies",
    "description": "List replies to a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step."
        },
        "includeDeleted": {
          "type": "boolean",
          "title": "Include Deleted",
          "description": "Whether to include deleted replies."
        }
      },
      "required": [
        "fileId",
        "commentId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-list-replies",
      "version": "0.0.6",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileIdTip",
          "type": "alert",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step.",
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
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
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
          "name": "includeDeleted",
          "type": "boolean",
          "label": "Include Deleted",
          "description": "Whether to include deleted replies.",
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
      "app": "google_drive",
      "componentKey": "google_drive-list-replies",
      "componentName": "List Replies"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_move_file",
    "description": "Move a file from one folder to another. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to move"
        },
        "folderId": {
          "type": "string",
          "title": "Folder",
          "description": "The folder you want to move the file to"
        }
      },
      "required": [
        "fileId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-move-file",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to move",
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
          "description": "The folder you want to move the file to",
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
      "app": "google_drive",
      "componentKey": "google_drive-move-file",
      "componentName": "Move File"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_move_file_to_trash",
    "description": "Move a file or folder to trash. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File or Folder",
          "description": "The file or folder to move to trash"
        }
      },
      "required": [
        "fileId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-move-file-to-trash",
      "version": "0.1.20",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "infoAlert",
          "type": "alert",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File or Folder",
          "description": "The file or folder to move to trash",
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
      "app": "google_drive",
      "componentKey": "google_drive-move-file-to-trash",
      "componentName": "Move File to Trash"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_remove_file_sharing_permission",
    "description": "Remove a [sharing permission](https://support.google.com/drive/answer/7166529) from the sharing preferences of a file or folder. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/delete)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "useFileOrFolder": {
          "type": "string",
          "title": "Use File or Folder",
          "description": "Whether to use a file or a folder for this action"
        },
        "permissionId": {
          "type": "string",
          "title": "Permission ID",
          "description": "The ID of the permission to remove"
        }
      },
      "required": [
        "useFileOrFolder",
        "permissionId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-remove-file-sharing-permission",
      "version": "0.0.5",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [
        "useFileOrFolder"
      ],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "useFileOrFolder",
          "type": "string",
          "label": "Use File or Folder",
          "description": "Whether to use a file or a folder for this action",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to remove the sharing permission from. You must specify either a file or a folder.",
          "required": true,
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
          "name": "folderId",
          "type": "string",
          "label": "Folder",
          "description": "The folder to remove the sharing permission from. You must specify either a file or a folder.",
          "required": true,
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
          "name": "permissionId",
          "type": "string",
          "label": "Permission ID",
          "description": "The ID of the permission to remove",
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
      "app": "google_drive",
      "componentKey": "google_drive-remove-file-sharing-permission",
      "componentName": "Remove File Sharing Permission"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_reply_to_comment",
    "description": "Add a reply to an existing comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file containing the comment to reply to."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The ID of the comment to reply to."
        },
        "content": {
          "type": "string",
          "title": "Reply Content",
          "description": "The text content of the reply to add"
        }
      },
      "required": [
        "drive",
        "fileId",
        "commentId",
        "content"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-reply-to-comment",
      "version": "0.0.9",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file containing the comment to reply to.",
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
          "description": "The ID of the comment to reply to.",
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
          "label": "Reply Content",
          "description": "The text content of the reply to add",
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
      "app": "google_drive",
      "componentKey": "google_drive-reply-to-comment",
      "componentName": "Reply to Comment"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_resolve_access_proposal",
    "description": "Accept or deny a request for access to a file or folder in Google Drive. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/accessproposals/resolve)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileOrFolderId": {
          "type": "string",
          "title": "File or Folder",
          "description": "The file or folder in the drive"
        },
        "accessProposalId": {
          "type": "string",
          "title": "Access Proposal ID",
          "description": "The identifier of an access proposal (when a user requests access to a file/folder)"
        },
        "action": {
          "type": "string",
          "title": "Action",
          "description": "The action to take on the AccessProposal"
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Roles",
          "description": "The roles to allow. Note: This field is required for the `ACCEPT` action."
        },
        "sendNotification": {
          "type": "boolean",
          "title": "Send Notification",
          "description": "Whether to send an email to the requester when the AccessProposal is denied or accepted"
        }
      },
      "required": [
        "fileOrFolderId",
        "accessProposalId",
        "action"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-resolve-access-proposal",
      "version": "0.0.13",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileOrFolderId",
          "type": "string",
          "label": "File or Folder",
          "description": "The file or folder in the drive",
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
          "name": "accessProposalId",
          "type": "string",
          "label": "Access Proposal ID",
          "description": "The identifier of an access proposal (when a user requests access to a file/folder)",
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
          "name": "action",
          "type": "string",
          "label": "Action",
          "description": "The action to take on the AccessProposal",
          "required": true,
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
          "name": "roles",
          "type": "string[]",
          "label": "Roles",
          "description": "The roles to allow. Note: This field is required for the `ACCEPT` action.",
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
          "name": "sendNotification",
          "type": "boolean",
          "label": "Send Notification",
          "description": "Whether to send an email to the requester when the AccessProposal is denied or accepted",
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
      "app": "google_drive",
      "componentKey": "google_drive-resolve-access-proposal",
      "componentName": "Resolve Access Proposals"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_resolve_comment",
    "description": "Mark a comment as resolved. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file containing the comment to resolve."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The ID of the comment to resolve."
        }
      },
      "required": [
        "drive",
        "fileId",
        "commentId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-resolve-comment",
      "version": "0.0.9",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file containing the comment to resolve.",
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
          "description": "The ID of the comment to resolve.",
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
      "app": "google_drive",
      "componentKey": "google_drive-resolve-comment",
      "componentName": "Resolve Comment"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_search_shared_drives",
    "description": "Search for shared drives with query options. [See the documentation](https://developers.google.com/drive/api/v3/search-shareddrives) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "q": {
          "type": "string",
          "title": "Search Query",
          "description": "The [shared drives](https://support.google.com/a/users/answer/9310351) search query. See [query terms](https://developers.google.com/drive/api/v3/ref-search-terms#drive_properties) for a list of shard drive-specific query terms."
        },
        "useDomainAdminAccess": {
          "type": "boolean",
          "title": "Use Domain Admin Access",
          "description": "Issue the request as a domain administrator"
        }
      },
      "required": [
        "q"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-search-shared-drives",
      "version": "0.1.21",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "q",
          "type": "string",
          "label": "Search Query",
          "description": "The [shared drives](https://support.google.com/a/users/answer/9310351) search query. See [query terms](https://developers.google.com/drive/api/v3/ref-search-terms#drive_properties) for a list of shard drive-specific query terms.",
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
          "name": "useDomainAdminAccess",
          "type": "boolean",
          "label": "Use Domain Admin Access",
          "description": "Issue the request as a domain administrator",
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
      "app": "google_drive",
      "componentKey": "google_drive-search-shared-drives",
      "componentName": "Search for Shared Drives"
    }
  },
  {
    "integration": "google-drive",
    "name": "google-drive_update_reply",
    "description": "Update a reply on a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "drive": {
          "type": "string",
          "title": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list."
        },
        "fileId": {
          "type": "string",
          "title": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step."
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step."
        },
        "replyId": {
          "type": "string",
          "title": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step."
        },
        "action": {
          "type": "string",
          "title": "Action",
          "description": "The action the reply performed to the parent comment."
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "The plain text content of the reply."
        }
      },
      "required": [
        "fileId",
        "commentId",
        "replyId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-drive",
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
      "app": "google_drive",
      "componentId": "google_drive-update-reply",
      "version": "0.0.6",
      "authPropNames": [
        "googleDrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDrive",
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
          "name": "drive",
          "type": "string",
          "label": "Drive",
          "description": "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
          "name": "fileIdTip",
          "type": "alert",
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
          "name": "fileId",
          "type": "string",
          "label": "File",
          "description": "The file to obtain info for. You can select a file or use a file ID from a previous step.",
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
          "description": "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
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
          "name": "replyId",
          "type": "string",
          "label": "Reply ID",
          "description": "The reply to get info for. You can select a reply or use a reply ID from a previous step.",
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
          "name": "action",
          "type": "string",
          "label": "Action",
          "description": "The action the reply performed to the parent comment.",
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
          "name": "content",
          "type": "string",
          "label": "Content",
          "description": "The plain text content of the reply.",
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
      "app": "google_drive",
      "componentKey": "google_drive-update-reply",
      "componentName": "Update Reply"
    }
  }
] satisfies PipedreamActionToolManifest[];
