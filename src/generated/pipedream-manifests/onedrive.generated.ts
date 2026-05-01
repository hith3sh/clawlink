import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const OnedrivePipedreamToolManifests = [
  {
    "integration": "onedrive",
    "name": "onedrive_create_folder",
    "description": "Create a new folder in a drive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parentFolderType": {
          "type": "string",
          "title": "Parent Folder Type",
          "description": "Whether to nest the new folder within a folder in your drive (`default`) or a shared folder (`shared`)"
        },
        "folderName": {
          "type": "string",
          "title": "Folder Name",
          "description": "The name of the new folder to be created. e.g. `New Folder`"
        }
      },
      "required": [
        "folderName"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-create-folder",
      "version": "0.1.3",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [
        "parentFolderType"
      ],
      "props": [
        {
          "name": "onedrive",
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
          "name": "parentFolderType",
          "type": "string",
          "label": "Parent Folder Type",
          "description": "Whether to nest the new folder within a folder in your drive (`default`) or a shared folder (`shared`)",
          "required": false,
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
          "name": "parentFolderId",
          "type": "string",
          "label": "Parent Folder ID",
          "description": "The ID of the folder which the the new folder should be created. Use the \"Load More\" button to load subfolders.",
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
          "name": "sharedFolderReference",
          "type": "string",
          "label": "Shared Folder Reference",
          "description": "The reference of the shared folder which the the new folder should be created.\n\nE.g. `/drives/{driveId}/items/{folderId}/children`",
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
          "name": "folderName",
          "type": "string",
          "label": "Folder Name",
          "description": "The name of the new folder to be created. e.g. `New Folder`",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-create-folder",
      "componentName": "Create Folder"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_create_link",
    "description": "Create a sharing link for a DriveItem. [See the documentation](https://docs.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=http)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "driveItemId": {
          "type": "string",
          "title": "Drive Item ID",
          "description": "The ID of the DriveItem to create a sharing link for. **Search for the file/folder by name.**"
        },
        "type": {
          "type": "string",
          "title": "Type",
          "description": "The type of sharing link to create. Either `view`, `edit`, or `embed`.",
          "enum": [
            "view",
            "edit",
            "embed"
          ]
        },
        "scope": {
          "type": "string",
          "title": "Scope",
          "description": "The scope of link to create. Either `anonymous` or `organization`.",
          "enum": [
            "anonymous",
            "organization"
          ]
        }
      },
      "required": [
        "driveItemId",
        "type"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-create-link",
      "version": "0.0.5",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "driveItemId",
          "type": "string",
          "label": "Drive Item ID",
          "description": "The ID of the DriveItem to create a sharing link for. **Search for the file/folder by name.**",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "type",
          "type": "string",
          "label": "Type",
          "description": "The type of sharing link to create. Either `view`, `edit`, or `embed`.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "Create a read-only link to the DriveItem",
              "value": "view"
            },
            {
              "label": "Create a read-write link to the DriveItem",
              "value": "edit"
            },
            {
              "label": "Create an embeddable link to the DriveItem. Only available for files in OneDrive personal.",
              "value": "embed"
            }
          ]
        },
        {
          "name": "scope",
          "type": "string",
          "label": "Scope",
          "description": "The scope of link to create. Either `anonymous` or `organization`.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "Anyone with the link has access, without needing to sign in",
              "value": "anonymous"
            },
            {
              "label": "Anyone signed into your organization can use the link. Only available in OneDrive for Business and SharePoint.",
              "value": "organization"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-create-link",
      "componentName": "Create Link"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_download_file",
    "description": "Download a file stored in OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get_content?view=odsp-graph-online)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fileId": {
          "type": "string",
          "title": "File ID",
          "description": "The file to download. You can either search for the file here, provide a custom *File ID*, or use the `File Path` prop to specify the path directly."
        },
        "filePath": {
          "type": "string",
          "title": "File Path",
          "description": "The path to the file from the root folder, e.g., `Documents/My Subfolder/File 1.docx`. You can either provide this, or search for an existing file with the `File ID` prop."
        },
        "convertToFormat": {
          "type": "string",
          "title": "Convert To Format",
          "description": "The format to convert the file to. See the [Format Options](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content-format?view=graph-rest-1.0&tabs=http#format-options) for supported source formats"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "newFileName": "clawlink-download.bin"
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-download-file",
      "version": "0.0.10",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "fileId",
          "type": "string",
          "label": "File ID",
          "description": "The file to download. You can either search for the file here, provide a custom *File ID*, or use the `File Path` prop to specify the path directly.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "filePath",
          "type": "string",
          "label": "File Path",
          "description": "The path to the file from the root folder, e.g., `Documents/My Subfolder/File 1.docx`. You can either provide this, or search for an existing file with the `File ID` prop.",
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
          "name": "newFileName",
          "type": "string",
          "label": "New File Name",
          "description": "The file name to save the downloaded content as, under the `/tmp` folder. Make sure to include the file extension.",
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
          "name": "convertToFormat",
          "type": "string",
          "label": "Convert To Format",
          "description": "The format to convert the file to. See the [Format Options](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content-format?view=graph-rest-1.0&tabs=http#format-options) for supported source formats",
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
          "name": "syncDir",
          "type": "dir",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-download-file",
      "componentName": "Download File"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_find_file_by_name",
    "description": "Search for a file or folder by name. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "File Name",
          "description": "The name of the file or folder to search for"
        },
        "excludeFolders": {
          "type": "boolean",
          "title": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`"
        }
      },
      "required": [
        "name"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-find-file-by-name",
      "version": "0.0.3",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "label": "File Name",
          "description": "The name of the file or folder to search for",
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
          "name": "excludeFolders",
          "type": "boolean",
          "label": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-find-file-by-name",
      "componentName": "Find File by Name"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_get_excel_table",
    "description": "Retrieve a table from an Excel spreadsheet stored in OneDrive [See the documentation](https://learn.microsoft.com/en-us/graph/api/table-range?view=graph-rest-1.0&tabs=http)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "itemId": {
          "type": "string",
          "title": "Spreadsheet",
          "description": "**Search for the file by name.** Only xlsx files are supported."
        },
        "tableName": {
          "type": "string",
          "title": "Table name",
          "description": "This is set in the **Table Design** tab of the ribbon."
        },
        "removeHeaders": {
          "type": "boolean",
          "title": "Remove headers?",
          "description": "By default, The headers are included as the first row."
        },
        "numberOfRows": {
          "type": "number",
          "title": "Number of rows to return",
          "description": "Leave blank to return all rows."
        }
      },
      "required": [
        "itemId",
        "tableName"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-get-excel-table",
      "version": "0.0.7",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "alert",
          "type": "alert",
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
          "name": "itemId",
          "type": "string",
          "label": "Spreadsheet",
          "description": "**Search for the file by name.** Only xlsx files are supported.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tableName",
          "type": "string",
          "label": "Table name",
          "description": "This is set in the **Table Design** tab of the ribbon.",
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
          "name": "removeHeaders",
          "type": "boolean",
          "label": "Remove headers?",
          "description": "By default, The headers are included as the first row.",
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
          "name": "numberOfRows",
          "type": "integer",
          "label": "Number of rows to return",
          "description": "Leave blank to return all rows.",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-get-excel-table",
      "componentName": "Get Table"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_get_file_by_id",
    "description": "Retrieves a file by ID. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fileId": {
          "type": "string",
          "title": "File ID",
          "description": "The file to retrieve. You can either search for the file here, provide a custom *File ID*."
        }
      },
      "required": [
        "fileId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-get-file-by-id",
      "version": "0.0.4",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "fileId",
          "type": "string",
          "label": "File ID",
          "description": "The file to retrieve. You can either search for the file here, provide a custom *File ID*.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-get-file-by-id",
      "componentName": "Get File by ID"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_list_files_in_folder",
    "description": "Retrieves a list of the files and/or folders directly within a folder. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_children)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of the folder. Use the \"Load More\" button to load subfolders."
        },
        "excludeFolders": {
          "type": "boolean",
          "title": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`"
        }
      },
      "required": [
        "folderId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-list-files-in-folder",
      "version": "0.0.3",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of the folder. Use the \"Load More\" button to load subfolders.",
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
          "name": "excludeFolders",
          "type": "boolean",
          "label": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-list-files-in-folder",
      "componentName": "List Files in Folder"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_list_my_drives",
    "description": "Get the signed-in user's drives. Returns a list of all the drives the user has access to, including the personal OneDrive. [See the documentation](https://learn.microsoft.com/en-us/graph/api/drive-list)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-list-my-drives",
      "version": "0.0.1",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-list-my-drives",
      "componentName": "List My Drives"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_search_files",
    "description": "Search for files and folders in Microsoft OneDrive. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "q": {
          "type": "string",
          "title": "Search Query",
          "description": "The query text used to search for items. Values may be matched across several fields including filename, metadata, and file content"
        },
        "excludeFolders": {
          "type": "boolean",
          "title": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`"
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
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-search-files",
      "version": "0.0.1",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "description": "The query text used to search for items. Values may be matched across several fields including filename, metadata, and file content",
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
          "name": "excludeFolders",
          "type": "boolean",
          "label": "Exclude Folders?",
          "description": "Set to `true` to return only files in the response. Defaults to `false`",
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-search-files",
      "componentName": "Search Files"
    }
  },
  {
    "integration": "onedrive",
    "name": "onedrive_upload_file",
    "description": "Upload a file to OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "uploadFolderId": {
          "type": "string",
          "title": "Upload Folder ID",
          "description": "The ID of the folder where you want to upload the file. Use the \"Load More\" button to load subfolders."
        },
        "filePath": {
          "type": "string",
          "title": "File Path or URL",
          "description": "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)"
        },
        "filename": {
          "type": "string",
          "title": "Name",
          "description": "Name of the new uploaded file"
        }
      },
      "required": [
        "uploadFolderId",
        "filePath",
        "filename"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "onedrive",
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
      "app": "microsoft_onedrive",
      "componentId": "microsoft_onedrive-upload-file",
      "version": "0.2.4",
      "authPropNames": [
        "onedrive"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "onedrive",
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
          "name": "uploadFolderId",
          "type": "string",
          "label": "Upload Folder ID",
          "description": "The ID of the folder where you want to upload the file. Use the \"Load More\" button to load subfolders.",
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
          "name": "filePath",
          "type": "string",
          "label": "File Path or URL",
          "description": "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
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
          "name": "filename",
          "type": "string",
          "label": "Name",
          "description": "Name of the new uploaded file",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
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
      "app": "microsoft_onedrive",
      "componentKey": "microsoft_onedrive-upload-file",
      "componentName": "Upload File"
    }
  }
] satisfies PipedreamActionToolManifest[];
