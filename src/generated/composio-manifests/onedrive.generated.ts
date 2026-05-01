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
    integration: "onedrive",
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
      toolkit: "one_drive",
      toolSlug: partial.toolSlug,
      version: "20260429_01",
    },
  };
}

export const onedriveComposioTools: IntegrationTool[] = [
  composioTool({
    name: "one_drive_checkin_item",
    description: "Tool to check in a checked out driveItem resource, making the version of the document available to others. Use when you need to check in a file that was previously checked out in OneDrive or SharePoint.",
    toolSlug: "ONE_DRIVE_CHECKIN_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "A check-in comment that is associated with the version.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the item to check in.",
        },
        check_in_as: {
          type: "string",
          description: "Optional. The status of the document after the check-in operation is complete. Can be 'published' or unspecified.",
        },
        drive_item_id: {
          type: "string",
          description: "The unique identifier of the driveItem to check in.",
        },
      },
      required: [
        "drive_id",
        "drive_item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Check In Drive Item.",
    ],
  }),
  composioTool({
    name: "one_drive_checkout_item",
    description: "Tool to check out a driveItem to prevent others from editing it and make your changes invisible until checked in. Use when you need to lock a file for exclusive editing in SharePoint or OneDrive.",
    toolSlug: "ONE_DRIVE_CHECKOUT_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the item to checkout.",
        },
        drive_item_id: {
          type: "string",
          description: "The unique identifier of the driveItem (file or folder) to checkout.",
        },
      },
      required: [
        "drive_id",
        "drive_item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Checkout Drive Item.",
    ],
  }),
  composioTool({
    name: "one_drive_copy_item",
    description: "Tool to copy a DriveItem (file or folder) to a new location asynchronously. Use when you need to duplicate an item, optionally renaming it or specifying a different parent folder. The operation is asynchronous; the response provides a URL to monitor the copy progress. Do not assume the copy is complete immediately; verify via ONE_DRIVE_GET_ITEM or by listing the destination, especially for large folder trees.",
    toolSlug: "ONE_DRIVE_COPY_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the copied item. If not provided, the same name as the original is used. Recommended to provide either 'name' or 'parent_reference' for reliable operation.",
        },
        item_id: {
          type: "string",
          description: "The ID of the DriveItem to be copied.",
        },
        site_id: {
          type: "string",
          description: "The ID of the site if the item is in a SharePoint site.",
        },
        user_id: {
          type: "string",
          description: "The ID of the user if accessing another user's drive.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive where the item is located. If not provided, 'me' (user's default drive) is assumed.",
        },
        group_id: {
          type: "string",
          description: "The ID of the group if the item is in a group drive.",
        },
        children_only: {
          type: "boolean",
          description: "If set to true, only the children of the source driveItem (if it's a folder) are copied, not the driveItem itself. Defaults to false. Cannot be used with name parameter.",
        },
        parent_reference: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              description: "The ID of the parent item.",
            },
            driveId: {
              type: "string",
              description: "The ID of the drive that contains the parent item.",
            },
          },
          description: "Reference to the parent item (folder) where the copy will be created. If not provided, the item is copied to the same location. Recommended to provide either 'name' or 'parent_reference' for reliable operation. Must use stable OneDrive item IDs (not paths or names), as paths break on rename/relocation. Resolve names/paths first using ONE_DRIVE_SEARCH_ITEMS or ONE_DRIVE_ONEDRIVE_FIND_FOLDER. Expected keys: `driveId` and `id`.",
        },
        conflict_behavior: {
          type: "string",
          description: "Specifies how to handle a naming conflict if an item with the same name already exists in the destination. 'fail' (default), 'replace', or 'rename'.",
          enum: [
            "fail",
            "replace",
            "rename",
          ],
        },
        include_all_version_history: {
          type: "boolean",
          description: "If set to true, the version history of the source file is copied to the destination. Defaults to false.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "one_drive",
      "item",
      "copy",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy Item.",
    ],
  }),
  composioTool({
    name: "one_drive_create_item_permission",
    description: "Tool to create a new permission on a OneDrive drive item. Use when you need to grant application or SharePoint group permissions to a file or folder. This endpoint supports creating application permissions and SharePoint site group permissions only.",
    toolSlug: "ONE_DRIVE_CREATE_ITEM_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        roles: {
          type: "array",
          items: {
            type: "string",
            description: "Valid permission roles for OneDrive items.",
            enum: [
              "read",
              "write",
              "owner",
            ],
          },
          description: "Array of roles to assign to the permission. Valid values: read, write, owner.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive.",
        },
        drive_item_id: {
          type: "string",
          description: "The unique identifier of the drive item.",
        },
        granted_to_v2: {
          type: "object",
          additionalProperties: true,
          properties: {
            siteGroup: {
              type: "object",
              additionalProperties: true,
              properties: {
                id: {
                  type: "string",
                  description: "The unique identifier of the SharePoint site group.",
                },
                displayName: {
                  type: "string",
                  description: "The display name of the SharePoint site group.",
                },
              },
              description: "Represents a SharePoint site group identity.",
            },
            application: {
              type: "object",
              additionalProperties: true,
              properties: {
                id: {
                  type: "string",
                  description: "The unique identifier of the application.",
                },
                displayName: {
                  type: "string",
                  description: "The display name of the application.",
                },
              },
              description: "Represents an application identity.",
            },
          },
          description: "The identity to grant permission to. Must contain either application or siteGroup property.",
        },
      },
      required: [
        "drive_id",
        "drive_item_id",
        "granted_to_v2",
        "roles",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "driveitem",
      "permission",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Drive Item Permission.",
    ],
  }),
  composioTool({
    name: "one_drive_create_link",
    description: "Tool to create a sharing link for a DriveItem (file or folder) by its unique ID. Use when you need to generate a shareable link for an item in OneDrive or SharePoint.",
    toolSlug: "ONE_DRIVE_CREATE_LINK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The type of sharing link to create. Valid values: `view`, `edit`, `embed`.",
          enum: [
            "view",
            "edit",
            "embed",
          ],
        },
        scope: {
          type: "string",
          description: "The scope of the link to create. If not specified, the default link type for the organization is created. Valid values: `view`, `edit`, `organization`, `anonymous`. Use `organization` to restrict to internal users; `anonymous` exposes content to anyone with the link. Tenant policies may block or downgrade certain scopes (e.g., `anonymous`), resulting in errors or more restrictive links than requested.",
          enum: [
            "anonymous",
            "organization",
            "users",
          ],
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file or folder) for which to create the link. Note: Some item types cannot be shared, including embedded objects, certain system files, and items with restricted permissions. If sharing fails with 'notSupported' error, verify the item type supports sharing.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the site. Use this if the item is in a SharePoint site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use this if the item is in another user's drive.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. If not provided, the link will be created in the current user's drive (me/drive).",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the group. Use this if the item is in a group's drive.",
        },
        password: {
          type: "string",
          description: "The password for the sharing link. Optional and OneDrive Personal only.",
        },
        recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "A list of recipients for the sharing link. Required when scope is 'users'. Each recipient should be a dict with an 'email' key, e.g. [{'email': 'user@example.com'}].",
        },
        expiration_date_time: {
          type: "string",
          description: "The expiration date and time for the permission, in yyyy-MM-ddTHH:mm:ssZ format. Example: 2023-12-31T23:59:59Z Must be a future UTC timestamp; past values will cause the call to fail.",
        },
        retain_inherited_permissions: {
          type: "boolean",
          description: "If true (default), existing inherited permissions are retained. If false, all existing permissions are removed when sharing for the first time.",
        },
      },
      required: [
        "item_id",
        "type",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
      "sharing",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Sharing Link.",
    ],
  }),
  composioTool({
    name: "one_drive_delete_item",
    description: "Tool to delete a DriveItem (file or folder) by its unique ID from the authenticated user's OneDrive. Use when you need to remove an item from OneDrive. This action moves the item to the recycle bin, not permanently deleting it; storage quota is not freed until the recycle bin is emptied. Bulk deletions can trigger 429 (rate limit) or 5xx responses — limit concurrency and use exponential backoff.",
    toolSlug: "ONE_DRIVE_DELETE_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the DriveItem (file or folder) to be deleted.",
        },
        user_id: {
          type: "string",
          description: "The user's ID, email, or 'me'. Defaults to 'me' (authenticated user). Required for S2S (app-only) auth.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the Drive where the item is located. If not provided, the action will target the user's personal OneDrive (me/drive). Always specify drive_id explicitly for group drives, SharePoint site drives, or shared libraries to avoid silently querying the wrong drive.",
        },
        if_match: {
          type: "string",
          description: "(Optional) If this request header is included and the eTag (or cTag) provided doesn't match the current tag on the item, a `412 Precondition Failed` response is returned, and the item won't be deleted.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Item.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "one_drive_delete_item_permanently",
    description: "Tool to permanently delete a driveItem by its ID without moving it to the recycle bin. Use when you need to irreversibly remove a file or folder from OneDrive or SharePoint. This action cannot be undone.",
    toolSlug: "ONE_DRIVE_DELETE_ITEM_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file or folder) to permanently delete. This action deletes the item without moving it to the recycle bin and cannot be undone.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the item to permanently delete.",
        },
      },
      required: [
        "drive_id",
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Drive Item.",
    ],
  }),
  composioTool({
    name: "one_drive_delete_item_permission",
    description: "Tool to delete a permission from a drive item. Use when you need to revoke sharing access to a file or folder. Only non-inherited sharing permissions can be deleted.",
    toolSlug: "ONE_DRIVE_DELETE_ITEM_PERMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file or folder).",
        },
        perm_id: {
          type: "string",
          description: "The unique identifier of the permission to delete. Only non-inherited sharing permissions can be deleted.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of a SharePoint site. Use this if the item is in a SharePoint site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of a user. Use this if the item is in a specific user's drive (other than 'me').",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. If not provided, the action will target the user's personal OneDrive (me/drive).",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the group. Use this if the item is in a group's drive.",
        },
      },
      required: [
        "item_id",
        "perm_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
      "permission",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Drive Item Permission.",
    ],
  }),
  composioTool({
    name: "one_drive_delete_share_permission",
    description: "Tool to delete the permission navigation property for a shared drive item. Use when you need to remove a sharing link permission. This effectively revokes access via the specific share link.",
    toolSlug: "ONE_DRIVE_DELETE_SHARE_PERMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        shared_drive_item_id: {
          type: "string",
          description: "The share ID or base64-encoded sharing URL. This is the shareId returned from the createLink API response. Example format: u!aHR0cHM6Ly9jb21wb3NpbzIwMjQtbXkuc2hhcmVwb2ludC5jb20vOng6L2cvcGVyc29uYWwva2FyYW52YWlkeWFfYXV0aGtpdF9haS9JUURPT2NCVEx5RTFSWktVQkJGZ0YzZVZBUmI4Zk5XVjdhMUJidGQ1NDF2SEdXUQ",
        },
      },
      required: [
        "shared_drive_item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
      "permission",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Shares Permission.",
    ],
  }),
  composioTool({
    name: "one_drive_discard_checkout",
    description: "Tool to discard the checkout of a driveItem, releasing it and discarding any changes made while checked out. Use when you need to cancel a checkout and revert changes on a file in SharePoint or OneDrive.",
    toolSlug: "ONE_DRIVE_DISCARD_CHECKOUT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the item to discard checkout.",
        },
        drive_item_id: {
          type: "string",
          description: "The unique identifier of the driveItem (file or folder) to discard checkout.",
        },
      },
      required: [
        "drive_id",
        "drive_item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Discard Checkout.",
    ],
  }),
  composioTool({
    name: "one_drive_download_file",
    description: "Downloads a file from a user's OneDrive using its item ID, which must refer to a file and not a folder. Response contains a content object with fields: s3url (URL to fetch raw file bytes), mimetype, and name; raw file data is not returned directly. Parsing content from Excel, Word, PDF, or other formats requires additional tooling. The response also includes attachment.s3key, required when passing this file to downstream tools such as OUTLOOK_SEND_EMAIL or OUTLOOK_CREATE_DRAFT.",
    toolSlug: "ONE_DRIVE_DOWNLOAD_FILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        format: {
          type: "string",
          description: "Optional format for file conversion during download. 'pdf' converts supported source files (doc, docx, dot, dotx, dotm, dsn, dwg, eml, epub, fluidframework, form, htm, html, loop, loot, markdown, md, msg, note, odp, ods, odt, page, pps, ppsx, ppt, pptx, pulse, rtf, task, tif, tiff, wbtx, whiteboard, xls, xlsm, xlsx) to PDF. 'html' converts Loop/Fluid files (loop, fluid, wbtx) to HTML. Leave empty to download the file in its original format without conversion. Do NOT use this parameter if the file is already in the target format (e.g., don't convert PDF to PDF or HTML to HTML), as this will result in an error.",
          enum: [
            "pdf",
            "html",
          ],
        },
        item_id: {
          type: "string",
          description: "Raw item ID only (e.g., '1234567890ABC'). Do not include URL fragments or query parameters like '&cid=...' or '?param=...' from sharing links.",
        },
        user_id: {
          type: "string",
          description: "User's ID or User Principal Name (UPN), or 'me' for the authenticated user's OneDrive. Ignored when drive_id is provided.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive containing the file. Required for SharePoint or OneDrive for Business drives. When provided, user_id is ignored.",
        },
        file_name: {
          type: "string",
          description: "Desired filename (including extension) for the downloaded content.",
        },
        if_none_match: {
          type: "string",
          description: "Optional ETag or cTag value for conditional download. If the provided tag matches the current file's tag, the API returns HTTP 304 Not Modified without downloading the file, saving bandwidth. Useful for caching scenarios.",
        },
      },
      required: [
        "item_id",
        "file_name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_download_file_by_path",
    description: "Downloads the contents of a file from OneDrive by its path. The API returns a 302 redirect to a pre-authenticated download URL. Use when you know the file path but not the item ID.",
    toolSlug: "ONE_DRIVE_DOWNLOAD_FILE_BY_PATH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's ID, email, or 'me'. Defaults to 'me' (authenticated user). Required for S2S (app-only) auth.",
        },
        file_name: {
          type: "string",
          description: "Desired filename (including extension) for the downloaded content.",
        },
        item_path: {
          type: "string",
          description: "The path to the file in OneDrive, relative to the drive root (e.g., 'document.txt' or 'folder/subfolder/file.pdf'). Do not include leading slash.",
        },
      },
      required: [
        "item_path",
        "file_name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_download_item_as_format",
    description: "Tool to download the contents of a driveItem converted to a specific format (e.g., PDF or HTML). Use when you need to convert Office documents to PDF or Loop/Fluid files to HTML before downloading. Supports accessing items by item_id or by path, and can target specific drives via drive_id.",
    toolSlug: "ONE_DRIVE_DOWNLOAD_ITEM_AS_FORMAT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        format: {
          type: "string",
          description: "Format to convert the item to. Use 'pdf' for Office documents (doc, docx, ppt, pptx, xls, xlsx, etc.) or 'html' for Loop/Fluid files (loop, fluid, wbtx).",
          enum: [
            "pdf",
            "html",
          ],
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the driveItem to convert. If provided, this takes precedence over path_and_filename.",
        },
        user_id: {
          type: "string",
          description: "User's ID or User Principal Name (UPN), or 'me' for the authenticated user's OneDrive. Ignored when drive_id is provided.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. Optional - use for SharePoint document libraries. If not provided, uses the default drive.",
        },
        file_name: {
          type: "string",
          description: "Desired filename (including extension) for the downloaded converted content.",
        },
        path_and_filename: {
          type: "string",
          description: "Path and filename of the driveItem under root (e.g., 'Documents/report.docx' or 'presentation.pptx'). Do not include leading slash. Either item_id or path_and_filename must be provided.",
        },
      },
      required: [
        "format",
        "file_name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_download_item_version",
    description: "Tool to download the contents of a specific previous version of a drive item (file). Returns the actual file content. Note: You cannot download the current version using this endpoint - it only works for previous versions.",
    toolSlug: "ONE_DRIVE_DOWNLOAD_ITEM_VERSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file). Cannot be a folder ID.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the file. If not provided, defaults to the user's personal OneDrive (me/drive).",
        },
        file_name: {
          type: "string",
          description: "Desired filename (including extension) for the downloaded version content.",
        },
        version_id: {
          type: "string",
          description: "The ID of the specific version to download (e.g., '1.0', '2.0'). Cannot be the current version - only previous versions can be downloaded using this endpoint.",
        },
      },
      required: [
        "item_id",
        "version_id",
        "file_name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "file_management",
      "versions",
    ],
  }),
  composioTool({
    name: "one_drive_follow_item",
    description: "Tool to follow a driveItem (file or folder) in OneDrive or SharePoint. Use when you need to add an item to the user's followed items list for tracking updates.",
    toolSlug: "ONE_DRIVE_FOLLOW_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive containing the item to follow. This can be the ID of a personal OneDrive, a group's document library, or a SharePoint site's drive.",
        },
        driveItem_id: {
          type: "string",
          description: "The unique identifier of the driveItem (file or folder) to follow. DriveItem IDs are case-sensitive and must be used exactly as returned from Microsoft Graph API operations like list, search, or folder children queries.",
        },
      },
      required: [
        "drive_id",
        "driveItem_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "drive",
      "following",
    ],
    askBefore: [
      "Confirm the parameters before executing Follow Drive Item.",
    ],
  }),
  composioTool({
    name: "one_drive_get_drive",
    description: "Retrieves the properties and relationships of a Drive resource by its unique ID. Use this action when you need to get details about a specific OneDrive, user's OneDrive, group's document library, or a site's document library. Only drives accessible to the authenticated user are returned; missing drives indicate insufficient OAuth scope or tenant permissions.",
    toolSlug: "ONE_DRIVE_GET_DRIVE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. This can be the ID of the user's personal OneDrive, a group's document library, or a specific drive ID. Must be a valid, non-empty value; use ONE_DRIVE_LIST_DRIVES to obtain valid drive IDs.",
        },
        expand_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of relationships to expand and include in the response. For example, \"root,list\" to include the root folder and list information. This allows you to retrieve related resources in a single request.",
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of properties to include in the response. Use this to retrieve specific fields and reduce the response size. For example, \"id,name,driveType\". If not provided, all default properties are returned.",
        },
      },
      required: [
        "drive_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
    ],
  }),
  composioTool({
    name: "one_drive_get_drive_item_by_sharing_url",
    description: "Tool to resolve a OneDrive/SharePoint sharing URL (or shareId) to a DriveItem with driveId and itemId. Use when you have a sharing link from Teams, chat, or 1drv.ms and need the item's metadata or IDs for downstream actions like permissions or download.",
    toolSlug: "ONE_DRIVE_GET_DRIVE_ITEM_BY_SHARING_URL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sharing_url: {
          type: "string",
          description: "A OneDrive or SharePoint sharing URL (e.g., 1drv.ms link, SharePoint link, or Teams contentUrl). This will be automatically encoded to a sharing token. Mutually exclusive with share_id_or_encoded_url.",
        },
        prefer_redeem: {
          type: "string",
          description: "Controls access redemption. 'redeemSharingLink' grants durable access to the item. 'redeemSharingLinkIfNecessary' grants access only for this request. If not specified, no Prefer header is sent.",
          enum: [
            "redeemSharingLinkIfNecessary",
            "redeemSharingLink",
          ],
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of DriveItem properties to return. If not specified, a default set of properties is returned. Common fields: id, name, size, webUrl, file, folder, createdDateTime, lastModifiedDateTime, parentReference.",
        },
        expand_children: {
          type: "boolean",
          description: "If true and the item is a folder, expands the children collection to include child items in the response.",
        },
        share_id_or_encoded_url: {
          type: "string",
          description: "An already-encoded sharing token (prefixed with 'u!') or a shareId token from a previous API call. Mutually exclusive with sharing_url.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "file_management",
      "retrieval",
      "sharing",
    ],
  }),
  composioTool({
    name: "one_drive_get_followed_item",
    description: "Tool to retrieve a specific followed driveItem from a drive. Use when you need to get details about a file or folder that the user has marked to follow.",
    toolSlug: "ONE_DRIVE_GET_FOLLOWED_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. This can be the ID of the user's personal OneDrive, a group's document library, or a specific drive ID.",
        },
        driveItem_id: {
          type: "string",
          description: "The unique identifier of the followed driveItem to retrieve. This is the ID of a specific file or folder that has been followed.",
        },
      },
      required: [
        "drive_id",
        "driveItem_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "following",
    ],
  }),
  composioTool({
    name: "one_drive_get_group_drive",
    description: "Tool to retrieve the document library (drive) for a Microsoft 365 group. Use when you need to access the default document library associated with a specific group.",
    toolSlug: "ONE_DRIVE_GET_GROUP_DRIVE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        group_id: {
          type: "string",
          description: "The unique identifier of the group whose document library you want to retrieve.",
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of properties to include in the response. Use this to retrieve specific fields and reduce the response size. For example, [\"id\", \"name\", \"driveType\"]. If not provided, all default properties are returned.",
        },
      },
      required: [
        "group_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
    ],
  }),
  composioTool({
    name: "one_drive_get_item",
    description: "Retrieves the metadata of a DriveItem by its unique ID. Use this tool to get information about a specific file or folder in OneDrive when you have its ID. If a `drive_id` is not provided, it defaults to the user's main drive.",
    toolSlug: "ONE_DRIVE_GET_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the DriveItem (file or folder). DriveItem IDs vary by platform: OneDrive for Business/SharePoint uses '01...' prefix format (e.g., '01NKDM7HMOJTVYMDOSXFDK2QJDXCDI3WUK'), while OneDrive Personal uses 'HASH!NUMBER' format (e.g., 'D4648F06C91D9D3D!54927'). IDs are case-sensitive and must be used exactly as returned from Microsoft Graph API. Obtain IDs from ONE_DRIVE_LIST_FOLDER_CHILDREN, ONE_DRIVE_SEARCH_ITEMS, ONE_DRIVE_GET_RECENT_ITEMS, or similar operations. Do NOT use: web URLs, sharing links, SharePoint listItem IDs, or manually constructed identifiers. IDs become stale after move, rename, or delete; refresh via ONE_DRIVE_SEARCH_ITEMS or ONE_DRIVE_LIST_FOLDER_CHILDREN instead of retrying a stale ID.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the Drive where the item is located. If not provided, the action will target the user's personal OneDrive (me/drive). Always specify drive_id explicitly for group drives, SharePoint site drives, or shared libraries to avoid silently querying the wrong drive.",
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of DriveItem properties to return. If not specified, a default set of properties is returned. Refer to the DriveItem resource documentation for available fields.",
        },
        expand_relations: {
          type: "array",
          items: {
            type: "string",
            description: "Valid navigation properties that can be expanded for a driveItem.",
            enum: [
              "activities",
              "analytics",
              "children",
              "createdByUser",
              "lastModifiedByUser",
              "listItem",
              "permissions",
              "retentionLabel",
              "subscriptions",
              "thumbnails",
              "versions",
              "workbook",
            ],
          },
          description: "Navigation properties to expand in the response. Valid values: 'children' (folder contents), 'thumbnails' (image previews), 'versions' (version history), 'permissions' (sharing permissions), 'listItem' (SharePoint list item data), 'activities' (recent activities), 'analytics' (usage analytics), 'createdByUser' (creator user details), 'lastModifiedByUser' (last modifier user details), 'retentionLabel' (retention policy), 'subscriptions' (webhooks), 'workbook' (Excel workbook data). Note: 'content' is NOT expandable - use ONE_DRIVE_DOWNLOAD_FILE to retrieve file content; 'listItem' requires SharePoint drives; some properties have regional/license restrictions. When expanding 'children': the array may be empty or absent; check for its presence and branch on 'file' vs 'folder' facets before processing. Expansion is non-recursive — call this tool separately for each child folder to traverse nested trees.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "file_management",
      "retrieval",
    ],
  }),
  composioTool({
    name: "one_drive_get_item_permissions",
    description: "Retrieves the permissions of a DriveItem by its unique ID within a specific Drive. Use when you need to check who has access to a file or folder and what level of access they have. Response nests permission entries under `data.value`; check top-level `success`/`error` flags before processing results. Results include inherited permissions, owner entries, and anonymous link entries — not just explicitly granted permissions. Sharing links may have differing scopes (org-only vs. anonymous); verify `link.scope` before treating a permission as externally accessible.",
    toolSlug: "ONE_DRIVE_GET_ITEM_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "A comma-separated list of properties to include in the response. For example, 'id,roles,link'.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item. Verify the correct item before calling — disambiguate similarly named files using folder path, timestamps, or file size. Required unless item_path is provided.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of a SharePoint site. Use this if the item is in a SharePoint site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of a user. Use this if the item is in a specific user's drive (other than 'me').",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. Required if not using other identifiers like group_id, site_id, or user_id in the path.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of a group. Use this if the item is in a group's drive.",
        },
        item_path: {
          type: "string",
          description: "The path to the item relative to the drive's root. Use this if item_id is not known. Must start with ':/' and end with ':/'. Example: ':/FolderA/FileB.txt:/'. Only applicable when accessing items in the current user's drive (me/drive/root). Does NOT substitute `item_id` (which is required); use only as supplemental path context for items in the current user's drive.",
        },
        if_none_match: {
          type: "string",
          description: "If this request header value (etag) matches the current etag on the item, an HTTP 304 Not Modified response is returned.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "permission",
    ],
  }),
  composioTool({
    name: "one_drive_get_item_thumbnails",
    description: "Tool to retrieve the thumbnails associated with a DriveItem. Use when you need to display visual previews of files. Response contains a `value` array with size keys (`small`, `medium`, `large`); thumbnails may not be generated for all file types or newly uploaded items, so handle an empty or missing `value` array. Returned thumbnail URLs are external HTTP endpoints with independent availability.",
    toolSlug: "ONE_DRIVE_GET_ITEM_THUMBNAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "A comma-separated list of thumbnail sizes to retrieve (e.g., \"small,medium,large\", or \"c300x400_crop\"). If not specified, all available thumbnails for the first thumbnailSet (id: \"0\") are returned.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the DriveItem.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of a Site. Provide either drive_id, group_id, site_id, or user_id.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of a User. Provide either drive_id, group_id, site_id, or user_id.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the Drive. If not provided, 'me' will be used for the current user's drive.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of a Group. Provide either drive_id, group_id, site_id, or user_id.",
        },
        original_orientation: {
          type: "boolean",
          description: "If true, retrieves the thumbnail with its original EXIF orientation. This is only supported on OneDrive Personal. Defaults to false.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "files",
    ],
  }),
  composioTool({
    name: "one_drive_get_item_versions",
    description: "Tool to retrieve the version history of a DriveItem by its unique ID. Use when you need to access or list previous versions of a file. Version history may be unavailable or empty for folders or items in drives without versioning enabled.",
    toolSlug: "ONE_DRIVE_GET_ITEM_VERSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "The unique identifier of the item (file or folder).",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the site. Mutually exclusive with drive_id, group_id, and user_id.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Mutually exclusive with drive_id, group_id, and site_id.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. Mutually exclusive with group_id, site_id, and user_id. One of these must be provided if not using the /me path.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the group. Mutually exclusive with drive_id, site_id, and user_id.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "items",
      "versions",
    ],
  }),
  composioTool({
    name: "one_drive_get_recent_items",
    description: "Get files and folders recently accessed by the user. Returns items based on activity history (opened, edited, viewed), sorted by most recent first — NOT by modification time; use ONE_DRIVE_ONEDRIVE_LIST_ITEMS or ONE_DRIVE_LIST_ROOT_DRIVE_CHANGES for strictly modification-based queries. Use when you need to see what the user worked on recently (e.g., 'Show me files I worked on today'). Different from search - this tracks activity, not content. Results may contain duplicate names; disambiguate using lastModifiedDateTime, parentReference.path, and the file/folder property before acting on a specific item.",
    toolSlug: "ONE_DRIVE_GET_RECENT_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of recent items to return (1-200). Controls response size for better performance. Use pagination with @odata.nextLink for larger datasets.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Significantly reduces payload size by returning only specified fields. Common properties: id, name, webUrl, size, lastModifiedDateTime, lastAccessedDateTime, file, folder, parentReference. If not specified, all properties are returned (large payload). Always include id in select and use returned id values directly — never reconstruct or hardcode IDs, as stale or manually constructed IDs will fail in tools like ONE_DRIVE_GET_ITEM.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "files",
    ],
  }),
  composioTool({
    name: "one_drive_get_root",
    description: "Tool to retrieve metadata for the root folder of the signed-in user's OneDrive. Use when you need information about the user's OneDrive root directory, such as size, child count, or web URL.",
    toolSlug: "ONE_DRIVE_GET_ROOT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's ID, email, or 'me'. Defaults to 'me' (authenticated user). Required for S2S (app-only) auth.",
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of properties to include in the response. Use this to retrieve specific fields and reduce the response size. Common fields include: id, name, size, createdDateTime, lastModifiedDateTime, webUrl, folder, root. If not provided, all default properties are returned.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
    ],
  }),
  composioTool({
    name: "one_drive_get_share",
    description: "Tool to access a shared DriveItem or collection of shared items using a shareId or encoded sharing URL. Returns the sharedDriveItem resource with metadata about the shared item and its owner. Use when you have a shareId or sharing token and need information about what was shared.",
    toolSlug: "ONE_DRIVE_GET_SHARE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        prefer_redeem: {
          type: "string",
          description: "Controls access redemption. 'redeemSharingLink' grants durable access to the item (permanent permission). 'redeemSharingLinkIfNecessary' grants access only for this request (temporary, no lasting permission). If not specified, no Prefer header is sent and no redemption occurs.",
          enum: [
            "redeemSharingLinkIfNecessary",
            "redeemSharingLink",
          ],
        },
        expand_children: {
          type: "boolean",
          description: "If true and the shared item is a folder, expands the children collection to include child items in the response. Only applicable for folders.",
        },
        share_id_or_encoded_sharing_url: {
          type: "string",
          description: "A sharing token (shareId) as returned by the API or a properly encoded sharing URL. To encode a URL: base64 encode it, convert to unpadded base64url format (remove '=' padding, replace '/' with '_', '+' with '-'), and prepend 'u!'. Example: 'u!aHR0cHM6Ly9jb21wb3NpbzIwMjQtbXkuc2hhcmVwb2ludC5jb20vOng6L2cvcGVyc29uYWwva2FyYW52YWlkeWFfYXV0aGtpdF9haS9JUURPT2NCVEx5RTFSWktVQkJGZ0YzZVZBVEliM2JmcUhzNFNqaVp5S1E1UTVSOA'",
        },
      },
      required: [
        "share_id_or_encoded_sharing_url",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "file_management",
      "sharing",
      "retrieval",
    ],
  }),
  composioTool({
    name: "one_drive_get_shared_items",
    description: "Tool to retrieve items shared with the authenticated user (not items the user has shared with others). Returns files and folders shared with the current user; response value array may be empty if no items exist. Use webUrl field from results for clickable links to items.",
    toolSlug: "ONE_DRIVE_GET_SHARED_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        allow_external: {
          type: "boolean",
          description: "Set to true to include items shared from external tenants. Defaults to false, which only returns items shared within the user's own tenant.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "sharing",
    ],
  }),
  composioTool({
    name: "one_drive_get_sharepoint_list_items",
    description: "Tool to get the items (list items) within a specific SharePoint list on a site. Use when you need to retrieve data from a SharePoint list.",
    toolSlug: "ONE_DRIVE_GET_SHAREPOINT_LIST_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return in a single response. Used for pagination.",
        },
        skip: {
          type: "integer",
          description: "The number of items to skip in the result set. Used for pagination.",
        },
        count: {
          type: "boolean",
          description: "If true, returns the total count of items in the @odata.count property.",
        },
        expand: {
          type: "string",
          description: "A comma-separated list of relationships to expand, or 'fields($select=columnName1,columnName2)' to retrieve specific fields. For example, to get specific columns 'Name' and 'Color', use 'fields($select=Name,Color)'. SharePoint internal field names may differ from display names; call without expand first (or use 'fields' alone) to discover actual internal names before filtering or selecting specific fields.",
        },
        filter: {
          type: "string",
          description: "An OData filter query to restrict the results. For example, to filter items where 'Quantity' is less than 600, use 'fields/Quantity lt 600'.",
        },
        select: {
          type: "string",
          description: "A comma-separated list of properties to include in the response. Often used in conjunction with '$expand=fields(select=...)'. For example, 'id,name,fields'.",
        },
        list_id: {
          type: "string",
          description: "The unique identifier of the list within the SharePoint site.",
        },
        orderby: {
          type: "string",
          description: "OData order by expression to sort results. For example, 'fields/Name asc' or 'fields/Quantity desc'.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site.",
        },
      },
      required: [
        "site_id",
        "list_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sharepoint",
      "listitem",
    ],
  }),
  composioTool({
    name: "one_drive_get_site",
    description: "Retrieves metadata for a specific SharePoint site by its ID. Use this action when you need to get details like display name, web URL, and creation/modification dates for a known SharePoint site.",
    toolSlug: "ONE_DRIVE_GET_SITE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response. Example: columns,lists,drives",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Example: id,displayName,webUrl",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site. This is the id property of the site resource.",
        },
      },
      required: [
        "site_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "site",
    ],
  }),
  composioTool({
    name: "one_drive_get_site_page_content",
    description: "Gets the content of a modern SharePoint site page. Use when you need to retrieve the details and content of a specific page within a SharePoint site.",
    toolSlug: "ONE_DRIVE_GET_SITE_PAGE_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        expand: {
          type: "string",
          description: "Expands related entities. For example, use 'canvasLayout' to include the page's layout and web part content.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Example: id,name,title",
        },
        page_id: {
          type: "string",
          description: "The unique identifier of the site page.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site.",
        },
      },
      required: [
        "site_id",
        "page_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sharepoint",
      "sitepage",
    ],
  }),
  composioTool({
    name: "one_drive_get_special_folder",
    description: "Tool to retrieve a special folder in OneDrive by name. Use when you need to access well-known folders (documents, photos, approot, etc.) without looking up by path or ID.",
    toolSlug: "ONE_DRIVE_GET_SPECIAL_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's ID, email, or 'me'. Defaults to 'me' (authenticated user). Required for S2S (app-only) auth.",
        },
        select_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of properties to include in the response. Use this to retrieve specific fields and reduce the response size. For example, ['id', 'name', 'size']. If not provided, all default properties are returned.",
        },
        expand_relations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Navigation properties to expand in the response. Common values: 'children' (folder contents), 'thumbnails' (image previews). Other options: 'permissions', 'versions', 'activities', 'analytics', 'createdByUser', 'lastModifiedByUser', 'retentionLabel', 'subscriptions', 'workbook'.",
        },
        special_folder_name: {
          type: "string",
          description: "The name of the special folder to retrieve. Valid values: 'documents' (Documents folder), 'photos' (Photos folder), 'cameraroll' (Camera Roll Backup folder), 'approot' (application's personal folder), 'music' (Music folder), 'recordings' (Recordings folder - only available in OneDrive for Business/SharePoint). Special folders provide simple aliases to access well-known folders without needing the folder path or ID.",
          enum: [
            "documents",
            "photos",
            "cameraroll",
            "approot",
            "music",
            "recordings",
          ],
        },
      },
      required: [
        "special_folder_name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
    ],
  }),
  composioTool({
    name: "one_drive_grant_share_permission",
    description: "Tool to grant users access to a link represented by a permission using an encoded sharing URL. Use when you need to give specific users access to a shared OneDrive or SharePoint resource.",
    toolSlug: "ONE_DRIVE_GRANT_SHARE_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        roles: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "read",
              "write",
            ],
          },
          description: "Array of role strings specifying the access level to grant: 'read' for view-only access or 'write' for edit access.",
        },
        recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              email: {
                type: "string",
                description: "The email address of the recipient to grant access.",
              },
            },
          },
          description: "Array of recipient objects with email addresses who will receive access to the shared link.",
        },
        encoded_sharing_url: {
          type: "string",
          description: "Base64url encoded sharing URL (must be prefixed with u!). Encode the sharing URL using base64url format and prefix with 'u!' to create the encoded sharing URL.",
        },
      },
      required: [
        "encoded_sharing_url",
        "recipients",
        "roles",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "sharing",
      "permission",
    ],
    askBefore: [
      "Confirm the parameters before executing Grant Shares Permission.",
    ],
  }),
  composioTool({
    name: "one_drive_invite_user_to_item",
    description: "Tool to invite users or grant permissions to a specific item in a OneDrive drive. Use when you need to share a file or folder with other users and define their access level (e.g., read or write).",
    toolSlug: "ONE_DRIVE_INVITE_USER_TO_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        roles: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "read",
              "write",
              "owner",
            ],
          },
          description: "Specifies the roles to be granted to the recipients. Options: 'read' (view-only), 'write' (edit), 'owner' (full control).",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file or folder).",
        },
        message: {
          type: "string",
          description: "A plain text formatted message that is included in the sharing invitation. Maximum length 2000 characters.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of a SharePoint site. Use this if the item is in a SharePoint site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of a user. Use this if the item is in another user's drive that you have access to.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. If not provided, the authenticated user's personal drive (me/drive) will be used.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of a Microsoft 365 group. Use this if the item is in a group's drive.",
        },
        password: {
          type: "string",
          description: "The password set on the invite by the creator. Optional and OneDrive Personal only.",
        },
        recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              alias: {
                type: "string",
                description: "The alias of the recipient, if a personal Microsoft Account.",
              },
              email: {
                type: "string",
                description: "The email address of the recipient.",
              },
              object_id: {
                type: "string",
                description: "The object ID of the recipient, if a user or group in Azure AD.",
              },
            },
          },
          description: "A collection of recipients who will receive access and the sharing invitation.",
        },
        require_sign_in: {
          type: "boolean",
          description: "Specifies whether the recipient of the invitation is required to sign-in to view the shared item. At least one of require_sign_in or send_invitation must be true.",
        },
        send_invitation: {
          type: "boolean",
          description: "If true, a sharing link is sent to the recipient. Otherwise, a permission is granted directly without sending a notification.",
        },
        expiration_date_time: {
          type: "string",
          description: "Specifies the dateTime after which the permission expires. ISO 8601 format. Example: \"2023-12-31T23:59:59.000Z\"",
        },
        retain_inherited_permissions: {
          type: "boolean",
          description: "Optional. If true (default), any existing inherited permissions are retained on the shared item when sharing this item for the first time. If false, all existing permissions are removed when sharing for the first time.",
        },
      },
      required: [
        "item_id",
        "recipients",
        "roles",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "driveitem",
      "sharing",
      "permission",
    ],
    askBefore: [
      "Confirm the parameters before executing Invite User to Drive Item.",
    ],
  }),
  composioTool({
    name: "one_drive_list_activities",
    description: "Tool to retrieve recent activities on the authenticated user's OneDrive. Use when you need to track recent changes or actions performed across the drive.",
    toolSlug: "ONE_DRIVE_LIST_ACTIVITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of activities to return. Must be between 1 and 999.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive to list activities for. If not provided, the default drive of the authenticated user (/me/drive) will be used.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "activity",
    ],
  }),
  composioTool({
    name: "one_drive_list_bundles",
    description: "Tool to retrieve a list of bundle resources from a specified drive. Bundles are collections of files (e.g., photo albums). Use when you need to list bundles in a drive.",
    toolSlug: "ONE_DRIVE_LIST_BUNDLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return in a single page. Must be between 1 and 999.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand (e.g., 'children'). Note: expand=children is not supported for listing bundles.",
        },
        filter: {
          type: "string",
          description: "OData filter query to filter bundles. For example, 'bundle/album ne null' to list only photo albums.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response (e.g., 'id,name,bundle').",
        },
        orderby: {
          type: "string",
          description: "A comma-separated list of properties to order the results by, optionally followed by 'asc' or 'desc' (e.g., 'name desc').",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive to list bundles from.",
        },
        skip_token: {
          type: "string",
          description: "A token used to retrieve the next page of results.",
        },
      },
      required: [
        "drive_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "bundle",
    ],
  }),
  composioTool({
    name: "one_drive_list_drives",
    description: "Tool to retrieve a list of Drive resources available to the authenticated user, or for a specific user, group, or site. Use when you need to find out what drives are accessible. Returns only drives within the signed-in account's permission scope; missing drives indicate insufficient permissions or different tenant scope. Results are paginated — follow skip_token across all pages to avoid missing drives. Returned drives represent document libraries and may not reflect full SharePoint site structure; use SHARE_POINT_GET_SITE_COLLECTION_INFO or SHARE_POINT_SEARCH_QUERY for broader coverage. Use driveType and webUrl to distinguish personal, system, and SharePoint-backed drives.",
    toolSlug: "ONE_DRIVE_LIST_DRIVES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return in a single page. Must be between 1 and 999.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand (e.g., \"root,list\").",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response (e.g., \"id,name,driveType\").",
        },
        orderby: {
          type: "string",
          description: "A comma-separated list of properties to order the results by, optionally followed by \"asc\" or \"desc\" (e.g., \"name desc\").",
        },
        site_id: {
          type: "string",
          description: "The ID of the site to list drives for. If provided, group_id and user_id should not be used.",
        },
        user_id: {
          type: "string",
          description: "The ID of the user to list drives for. If provided, group_id and site_id should not be used. If none of group_id, site_id, or user_id are provided, the drives for the current authenticated user (/me/drives) will be listed.",
        },
        group_id: {
          type: "string",
          description: "The ID of the group to list drives for. If provided, site_id and user_id should not be used.",
        },
        skip_token: {
          type: "string",
          description: "A token used to retrieve the next page of results. Results may be paginated; retrieve and pass this token repeatedly until no token is returned to ensure all drives are fetched.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
    ],
  }),
  composioTool({
    name: "one_drive_list_folder_children",
    description: "List the direct children (files/folders) of a OneDrive/SharePoint folder by DriveItem ID or path. Returns reliable pagination tokens/nextLink for large folders. Use when you need to enumerate folder contents deterministically, find companion artifacts (e.g., .vtt/.docx files), or browse within a known folder.",
    toolSlug: "ONE_DRIVE_LIST_FOLDER_CHILDREN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return per page. Default is 200.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of relationships to expand in the response (e.g., ['thumbnails', 'permissions']). Use this to include related resources inline.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Comma-separated list of properties to include in the response (e.g., ['id', 'name', 'size']).",
        },
        orderby: {
          type: "string",
          description: "Sort results by specified properties (e.g., 'name', 'lastModifiedDateTime desc').",
        },
        site_id: {
          type: "string",
          description: "If provided, uses /sites/{site-id}/drive/... route for SharePoint sites.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive. Required unless using 'use_me_drive' or 'site_id' is provided.",
        },
        next_link: {
          type: "string",
          description: "Full @odata.nextLink URL from a previous response for pagination continuation.",
        },
        skip_token: {
          type: "string",
          description: "A $skipToken value from a previous response for pagination continuation. Alternative to 'next_link'.",
        },
        folder_path: {
          type: "string",
          description: "Path relative to the drive root (e.g., '/', '/Recordings', '/Documents/Project'). Use '/' to list the root folder's children. Alternative to 'folder_item_id'.",
        },
        use_me_drive: {
          type: "boolean",
          description: "If true, uses /me/drive/... route for the authenticated user's personal OneDrive.",
        },
        folder_item_id: {
          type: "string",
          description: "The ID of the folder (DriveItem) to list children from. Supports both simple item IDs (e.g., '01BYE5RZ6QN3ZWBTUFOFD3GSPGOHDJD36K') and drive-qualified item IDs with '!' separator (e.g., 'driveId!itemId' format commonly returned from search results or shared item listings). When a drive-qualified ID is detected, the drive portion is automatically extracted and used in the API request. Note: The 'driveId!itemId' pattern is based on observed OneDrive API behavior and may not be explicitly documented. Required unless 'folder_path' is provided.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "folder",
    ],
  }),
  composioTool({
    name: "one_drive_list_item_activities",
    description: "Tool to list recent activities for a specific item in a OneDrive drive. Use when you need to track changes or actions performed on a file or folder.",
    toolSlug: "ONE_DRIVE_LIST_ITEM_ACTIVITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Show only the first n items.",
        },
        skip: {
          type: "integer",
          description: "Skip the first n items for pagination.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of relationships to expand in the response (e.g., ['driveItem', 'listItem']). Use this to include related resources inline.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter activities (e.g., \"activityDateTime gt 2023-01-01T00:00:00Z\"). Allows filtering by date ranges or other criteria.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Comma-separated list of properties to include in the response (e.g., ['id', 'activityDateTime', 'actor']). Reduces payload size by returning only specified properties.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the driveItem.",
        },
        orderby: {
          type: "string",
          description: "Sort results by specified properties (e.g., 'activityDateTime desc' to show newest first, 'activityDateTime' for oldest first).",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive.",
        },
      },
      required: [
        "drive_id",
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "activity",
    ],
  }),
  composioTool({
    name: "one_drive_list_root_drive_changes",
    description: "Tool to list changes in the root of the user's primary drive using a delta token. Use when you need to track file and folder modifications, additions, or deletions in the main OneDrive directory. First call without `token` returns all current items plus an `@odata.deltaLink`; store that token and pass it on subsequent calls to retrieve only incremental changes. Losing the deltaLink token forces a full resync. Responses include deleted items (check `deleted` property) and the root item itself alongside files and folders.",
    toolSlug: "ONE_DRIVE_LIST_ROOT_DRIVE_CHANGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return in a single response. Useful for pagination and controlling response size.",
        },
        token: {
          type: "string",
          description: "Either a raw token string or a full URL from @odata.nextLink/@odata.deltaLink. Accepts: raw token value, full pagination URL, or 'latest' to get a token for future calls. Omit to get all current items. Loop until `@odata.nextLink` is absent to get complete results; default page size is ~200 items.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of DriveItem properties to include in the response. Use this to retrieve specific fields and reduce response size.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive to track changes for. If not provided, will attempt to use the authenticated user's default drive (requires delegated auth). For application auth, this parameter is required.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "drive",
      "changes",
      "delta",
    ],
  }),
  composioTool({
    name: "one_drive_list_share_permissions",
    description: "Tool to retrieve permission details for a shared OneDrive or SharePoint item using a share ID. Use when you have an encoded sharing URL and need to check the permission level, password protection, and access details.",
    toolSlug: "ONE_DRIVE_LIST_SHARE_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        shared_drive_item_id: {
          type: "string",
          description: "The share ID (encoded sharing URL in format u!<base64url> or share token) to retrieve permission for. This is typically an encoded sharing URL prefixed with 'u!' or a shareId token from a previous API call.",
        },
      },
      required: [
        "shared_drive_item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sharing",
      "permission",
    ],
  }),
  composioTool({
    name: "one_drive_list_sharepoint_list_items_delta",
    description: "Tool to track changes to items in a SharePoint list using a delta query. Use when you need to get newly created, updated, or deleted list items without performing a full read of the entire item collection.",
    toolSlug: "ONE_DRIVE_LIST_SHAREPOINT_LIST_ITEMS_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return in a single response.",
        },
        token: {
          type: "string",
          description: "If unspecified or empty, enumerates the current state. If 'latest', returns an empty response with the latest delta token. If a previous delta token, returns changes since that token.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand. Use 'fields($select=ColumnA,ColumnB)' format for field selection.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of listItem properties to return.",
        },
        list_id: {
          type: "string",
          description: "The unique identifier of the list within the site.",
        },
        site_id: {
          type: "string",
          description: "SharePoint site ID in composite format: hostname,site-collection-guid,site-guid (three comma-separated parts).",
        },
      },
      required: [
        "site_id",
        "list_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sharepoint",
      "listitem",
    ],
  }),
  composioTool({
    name: "one_drive_list_site_columns",
    description: "Tool to list all column definitions for a SharePoint site. Use this when you need to retrieve the schema or structure of columns within a specific SharePoint site.",
    toolSlug: "ONE_DRIVE_LIST_SITE_COLUMNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return.",
        },
        skip: {
          type: "integer",
          description: "The number of items to skip in the result set. Used for pagination.",
        },
        count: {
          type: "boolean",
          description: "If true, returns the total count of items in the @odata.count property.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of related resources to expand in the response.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to apply to the results.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response.",
        },
        orderby: {
          type: "string",
          description: "Comma-separated list of properties used to sort the results.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site. Example: `contoso.sharepoint.com,2C712604-133D-4A7C-9194-F53CE4C952A2,A704AEF5-C2C0-43C3-A3D8-9F55A73A02E2`",
        },
      },
      required: [
        "site_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sites",
      "columns",
    ],
  }),
  composioTool({
    name: "one_drive_list_site_items_delta",
    description: "Tool to track changes to DriveItems in the default document library of a SharePoint site. Use when you need to get a list of items that have been added, modified, or deleted since a previous state or to get an initial enumeration of all items.",
    toolSlug: "ONE_DRIVE_LIST_SITE_ITEMS_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return in a single response. Useful for pagination and controlling response size.",
        },
        token: {
          type: "string",
          description: "A token used to retrieve a specific page of results or to get changes since a previous state. Can be 'latest' to get the most recent delta token without items, a deltaLink URL, or a timestamp (YYYY-MM-DDTHH:MM:SSZ).",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of DriveItem properties to include in the response. Use this to retrieve specific fields and reduce response size.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site.",
        },
      },
      required: [
        "site_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "delta",
      "sharepoint",
    ],
  }),
  composioTool({
    name: "one_drive_list_site_lists",
    description: "Tool to list all lists under a specific SharePoint site. Use when you need to enumerate lists within a known site. Returns only Microsoft Graph-supported lists — internal/system lists are excluded, so results may be a strict subset of all site lists (e.g., 13 returned where 108 exist). Results are in the `data.value` array. IMPORTANT: Only works with organizational Microsoft 365 accounts (Azure AD/Entra ID). NOT supported for personal Microsoft accounts (MSA/Outlook.com/Hotmail). Personal OneDrive users cannot access SharePoint sites through this endpoint.",
    toolSlug: "ONE_DRIVE_LIST_SITE_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response. Example: columns,items",
        },
        filter: {
          type: "string",
          description: "OData filter expression. Example: startswith(name,'Doc')",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Example: id,name,list",
        },
        orderby: {
          type: "string",
          description: "OData order by expression. Example: name asc",
        },
        site_id: {
          type: "string",
          description: "SharePoint site ID in the required composite format: 'hostname,site-collection-id,web-id' (e.g., 'contoso.sharepoint.com,2C712604-1370-44E7-A1F5-426573FDA80A,2D4B0860-D7DE-419B-88E6-5866AF240000'). Must contain exactly two commas separating three parts: (1) SharePoint hostname, (2) site collection GUID, (3) web GUID. Only works with organizational Microsoft 365 accounts.",
        },
      },
      required: [
        "site_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "sharepoint",
      "site",
      "list",
    ],
  }),
  composioTool({
    name: "one_drive_list_site_subsites",
    description: "Tool to list all subsites of a SharePoint site. Use when you need to retrieve a collection of subsites for a given parent site. IMPORTANT: This action only works with organizational Microsoft 365 accounts (Azure AD/Entra ID accounts). It is NOT supported for personal Microsoft accounts (MSA/Outlook.com/Hotmail accounts). Personal OneDrive users cannot access SharePoint sites through this endpoint. An empty `value` array in the response means the site has no subsites, not a failure.",
    toolSlug: "ONE_DRIVE_LIST_SITE_SUBSITES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "The maximum number of items to return.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response.",
        },
        filter: {
          type: "string",
          description: "OData filter expression. Example: startswith(name,'Project')",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Example: id,name,webUrl",
        },
        orderby: {
          type: "string",
          description: "OData order by expression. Example: name asc, createdDateTime desc",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site for which to list subsites. Must be the full composite Graph ID in the format `hostname,siteCollectionId,siteId`; partial or malformed IDs may silently return empty results rather than an error.",
        },
      },
      required: [
        "site_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "site",
    ],
  }),
  composioTool({
    name: "one_drive_list_subscriptions",
    description: "Tool to list the current subscriptions for the authenticated user or app. Use this to retrieve details of existing webhook subscriptions. Results may span multiple drives and resources; filter client-side by resource URL or type to narrow to a specific scope. An empty `value` array means no subscriptions exist, not a failed call.",
    toolSlug: "ONE_DRIVE_LIST_SUBSCRIPTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "subscription",
    ],
  }),
  composioTool({
    name: "one_drive_move_item",
    description: "Tool to move a file or folder to a new parent folder in OneDrive. Use when you need to reorganize your files or folders by changing their location. You can optionally rename the item during the move. If a file with the same name exists at the destination, the API returns `nameAlreadyExists`; use the `name` parameter to provide a unique name or resolve the conflict beforehand.",
    toolSlug: "ONE_DRIVE_MOVE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the DriveItem. If not provided, the item retains its original name. Must not contain illegal filename characters; invalid characters cause an `invalidRequest` error.",
        },
        itemId: {
          type: "string",
          description: "The unique identifier of the file or folder (DriveItem) to be moved.",
        },
        siteId: {
          type: "string",
          description: "The unique identifier of the site if the item is in a SharePoint site. Mutually exclusive with drive_id, group_id, and user_id.",
        },
        userId: {
          type: "string",
          description: "The unique identifier of the user if accessing another user's drive. Mutually exclusive with drive_id, group_id, and site_id.",
        },
        driveId: {
          type: "string",
          description: "The unique identifier of the Drive that contains the item. If not specified, it defaults to the user's personal drive (`/me/drive`).",
        },
        groupId: {
          type: "string",
          description: "The unique identifier of the group if the item is in a group drive. Mutually exclusive with drive_id, site_id, and user_id.",
        },
        description: {
          type: "string",
          description: "The new description for the drive item. If not provided, the item's description is not changed.",
        },
        parentReference: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              description: "The unique identifier (ID) of the destination parent folder. This must be the folder's unique ID string (e.g., '01BYE5RZZ272Y2AM3L22L22Z2Y2Y2Y2Y2Y'), not the folder's display name. You can obtain the folder ID by listing folder contents or searching for items.",
            },
            driveId: {
              type: "string",
              description: "The unique identifier of the Drive containing the destination folder. Typically not needed as the API assumes the same drive. Note: The move operation does not support moving items between different drives - use the copy operation for cross-drive transfers.",
            },
          },
          description: "An object specifying the destination folder. Must be provided as an object/dictionary with an 'id' field containing the folder's unique identifier. Format: {\"id\": \"<folder-id>\", \"driveId\": \"<drive-id>\"} (driveId is optional). Example: {\"id\": \"01BYE5RZZ272Y2AM3L22L22Z2Y2Y2Y2Y2Y\"}. Note: Folder names are not accepted - use the folder's unique ID obtained from listing or searching items.",
        },
      },
      required: [
        "itemId",
        "parentReference",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Item.",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_create_folder",
    description: "Creates a new folder in the user's OneDrive, automatically renaming on conflict, optionally within a specified parent_folder (by ID or full path from root) which, if not the root, must exist and be accessible.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_CREATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The desired name for the new folder (also accepts 'folder_name' as an alias). If a folder with this name already exists in the specified parent_folder, the new folder will be automatically renamed (e.g., 'New Folder' might become 'New Folder 1'). Examples: ['Annual Reports', 'Client Meeting Notes']",
        },
        user_id: {
          type: "string",
          description: "The user's ID, email, or 'me'. Defaults to 'me' (authenticated user). Required for S2S (app-only) auth.",
        },
        description: {
          type: "string",
          description: "Optional description for the folder. Provides a user-visible description of the folder. Examples: ['Project documents for Q1 2024', 'Meeting notes archive']",
        },
        parent_folder: {
          type: "string",
          description: "ID or full path of the parent folder for the new folder. Paths must start from the root (e.g., '/Documents/Reports'). If an ID is provided, it refers to an existing folder's unique ID. Examples: ['/Projects/Alpha', 'folder_id_12345ABC', '/']",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create folder.",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_create_text_file",
    description: "Creates a new plain-text file with specified content in the authenticated user's personal OneDrive, using either the folder's unique ID or its absolute path relative to the user's OneDrive root (paths are automatically resolved to IDs); note that OneDrive may rename or create a new version if the filename already exists. All files are written as plain text regardless of extension — specifying .docx or .xlsx does not produce a true Office document. This action only works with the user's personal OneDrive (/me/drive) and does not support SharePoint document libraries or shared drives.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_CREATE_TEXT_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The desired name for the new text file, including its extension (e.g., 'report.txt', 'notes.log'). Also accepts 'file_name' as an alias.",
        },
        folder: {
          type: "string",
          description: "The folder within the user's personal OneDrive where the new text file will be created. Use '/' for root, a path like '/Documents/Projects' (relative to OneDrive root), a folder name like 'MyFolder' (treated as '/MyFolder'), or a valid folder ID. Note: Paths are resolved against the user's personal OneDrive (/me/drive/root) only and cannot target SharePoint document libraries or shared drives.",
        },
        content: {
          type: "string",
          description: "The plain text content to be written into the new file. For very large text bodies, the request may fail or truncate; split large content across multiple files if needed.",
        },
        user_id: {
          type: "string",
          description: "The user's ID or the literal 'me' to represent the currently authenticated user.",
        },
        conflict_behavior: {
          type: "string",
          description: "How to handle conflicts when a file with the same name already exists. 'fail' (default) returns an error if the file exists, 'replace' overwrites the existing file, 'rename' creates a new file with an incremented name (e.g., 'file 1.txt').",
          enum: [
            "fail",
            "replace",
            "rename",
          ],
        },
      },
      required: [
        "name",
        "content",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a new text file.",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_find_file",
    description: "Non-recursively finds an item (file or folder) in a specified OneDrive folder; if `folder` is provided as a path, it must actually exist. Results in large folders may be paginated via `@odata.nextLink`; iterate all pages to avoid missing files. For searches where the subfolder is unknown, use ONE_DRIVE_SEARCH_ITEMS instead.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_FIND_FILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The exact name of the file or folder to find within the specified `folder`. Multiple items may match common names; use `response_detail='full'` and disambiguate by path, size, or last-modified timestamp.",
        },
        folder: {
          type: "string",
          description: "The unique identifier (ID) or absolute path of the OneDrive folder for the search. For the root folder, use '/'. Paths must start with '/'. A non-existent folder silently returns no results rather than an error.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user (e.g., a GUID) or the alias 'me' to represent the currently authenticated user. This determines whose OneDrive will be accessed.",
        },
        response_detail: {
          type: "string",
          description: "Level of detail in the response. 'minimal' (default) returns only essential properties (id, name, webUrl). 'full' returns complete metadata for each found item.",
          enum: [
            "minimal",
            "full",
          ],
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_find_folder",
    description: "Finds folders by name within an accessible parent folder in OneDrive, or lists all its direct child folders if no name is specified. Search is non-recursive: only immediate children of `folder` are checked, not deeper hierarchy levels.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_FIND_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return in a single request. When specified, auto-pagination is disabled and only one page is returned. Use with skip_token to manually paginate through results.",
        },
        name: {
          type: "string",
          description: "Exact name of the folder to find. If omitted, all direct child folders of the parent `folder` are returned.",
        },
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand in the response (e.g., 'thumbnails', 'children'). See Microsoft Graph API documentation for supported expand properties.",
        },
        folder: {
          type: "string",
          description: "Path (e.g., '/My Files/Work', '/' for root) or unique ID of the parent folder where child folders are searched.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to include in the response (e.g., ['id', 'name', 'size']). Supports standard driveItem properties like id, name, webUrl, size, createdDateTime, lastModifiedDateTime, folder, etc. Note: 'folder' field is automatically included to enable folder identification, and 'name' is auto-included when filtering by folder name.",
        },
        orderby: {
          type: "string",
          description: "Sort results by specified properties (e.g., 'name', 'lastModifiedDateTime desc').",
        },
        user_id: {
          type: "string",
          description: "User's unique identifier (e.g., email, UPN) or 'me' for the authenticated user, specifying the OneDrive account.",
        },
        skip_token: {
          type: "string",
          description: "A $skipToken value from a previous response for pagination continuation. When specified, auto-pagination is disabled and only the requested page is returned.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_list_items",
    description: "Retrieves all files and folders as `driveItem` resources from the root of a specified user's OneDrive, automatically handling pagination. Non-recursive: returns only root-level items; subfolder contents require separate calls. Results may include `remoteItem` pointers (shared items from other drives) — use `remoteItem.driveId` and `remoteItem.id` for those in downstream calls. Distinguish files from folders by presence of `file` or `folder` property. Always use `id` values returned by this tool directly; never construct item IDs manually. Items may be absent from results due to permission restrictions, not drive absence.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_LIST_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum items per API request, setting the batch size; the action automatically handles pagination to fetch all items. The Microsoft Graph API may limit this (e.g., to 999).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specifies `driveItem` properties to return. If omitted or empty, default properties are returned. Refer to Microsoft Graph API documentation for a complete list of `driveItem` properties.",
        },
        user_id: {
          type: "string",
          description: "User's unique identifier (e.g., 'user@example.com', object ID) or 'me' for the authenticated user's OneDrive.",
        },
      },
    },
    tags: [
      "composio",
      "onedrive",
      "read",
    ],
  }),
  composioTool({
    name: "one_drive_onedrive_upload_file",
    description: "Uploads a file to a specified OneDrive folder, automatically creating the destination folder if it doesn't exist, renaming on conflict, and supporting large files via chunking.",
    toolSlug: "ONE_DRIVE_ONEDRIVE_UPLOAD_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file: {
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
          description: "The file to be uploaded, including its name and access to its binary content.",
        },
        folder: {
          type: "string",
          description: "Destination folder path from root (e.g., '/Documents/Reports') or a unique folder ID. If the folder path doesn't exist, it will be created automatically (including any intermediate folders in the path).",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site to upload to. If provided, uses /sites/{siteId}/drive. Mutually exclusive with drive_id.",
        },
        user_id: {
          type: "string",
          description: "User ID (e.g., user_principal_name, unique GUID) or 'me' for the authenticated user, determining the target OneDrive.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive to upload to. If not provided, uses the default drive of the user_id. Mutually exclusive with site_id.",
        },
        description: {
          type: "string",
          description: "A user-visible description of the file. Only supported on OneDrive Personal.",
        },
        defer_commit: {
          type: "boolean",
          description: "If true, the final file creation is deferred until an explicit completion request is made. Useful for large files where you want to control when the upload is finalized.",
        },
        if_match_etag: {
          type: "string",
          description: "An ETag value to prevent lost updates. If provided, the upload will only proceed if the folder/parent's ETag matches this value. Returns 412 error if it doesn't match.",
        },
        file_system_info: {
          type: "object",
          additionalProperties: true,
          properties: {
            createdDateTime: {
              type: "string",
              description: "The UTC date and time the file was created on a client. ISO 8601 format.",
            },
            lastAccessedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last accessed. ISO 8601 format.",
            },
            lastModifiedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last modified on a client. ISO 8601 format.",
            },
          },
          description: "File system information on client.",
        },
        conflict_behavior: {
          type: "string",
          description: "How to handle file name conflicts. 'rename' automatically renames the file if it exists (default), 'fail' returns an error, 'replace' overwrites the existing file. When renamed, the actual filename in the response may differ (e.g., suffixed with a number); use the response `id` or `webUrl` for follow-up operations.",
          enum: [
            "rename",
            "fail",
            "replace",
          ],
        },
      },
      required: [
        "file",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload file.",
    ],
  }),
  composioTool({
    name: "one_drive_preview_drive_item",
    description: "Generates or retrieves a short-lived, permission-bound embeddable URL for a preview of a specific item. URLs expire and must be regenerated per session — do not cache. Use when you need to display a temporary preview of a file.",
    toolSlug: "ONE_DRIVE_PREVIEW_DRIVE_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "string",
          description: "Optional. Page number of document to start at, if applicable. Specified as string for future use cases around file types such as ZIP.",
        },
        zoom: {
          type: "number",
          description: "Optional. Zoom level to start at, if applicable.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the DriveItem.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the Site. Provide if the item is in a SharePoint site.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the User. Provide if the item is in another user's drive.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the Drive. If not provided, the request will be made to the current user's drive.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the Group. Provide if the item is in a group drive.",
        },
        share_id: {
          type: "string",
          description: "The unique identifier of the shared item. Provide if the item is accessed via a share link.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
    ],
  }),
  composioTool({
    name: "one_drive_restore_drive_item",
    description: "Tool to restore a deleted OneDrive driveItem (file or folder) from the recycle bin. Use when you need to recover a deleted item to its original location or to a specified parent folder, optionally renaming it during restoration. IMPORTANT LIMITATION: This API is ONLY available for OneDrive Personal accounts. It does NOT work with OneDrive for Business or SharePoint. For Business/SharePoint accounts, use the SharePoint REST API endpoints (/_api/web/recyclebin) instead.",
    toolSlug: "ONE_DRIVE_RESTORE_DRIVE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "(Optional) The new name for the restored item. If not provided, the item will be restored with its original name. This is useful if you want to rename the item during the restore process or if an item with the same name already exists in the destination.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the deleted DriveItem (file or folder) to restore. This item must currently be in the OneDrive recycle bin. The ID can be obtained from deleted items listing or from the item before deletion.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the Drive containing the deleted item. Required when using application authentication. If not provided with delegated authentication, uses the authenticated user's default drive.",
        },
        parent_reference_id: {
          type: "string",
          description: "(Optional) The unique identifier of the parent folder where the item should be restored. If not provided, the item will be restored to its original parent location. This is useful when you want to restore the item to a different folder than where it was originally located.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "recovery",
    ],
    askBefore: [
      "Confirm the parameters before executing Restore Deleted Item.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "one_drive_search_items",
    description: "Search OneDrive for files and folders by keyword. Searches filenames, metadata, and file content to find matching items. Use when you need to find specific files based on keywords, file types, or content. Supports filtering, sorting, and pagination. Results are mixed files and folders — filter client-side using file vs folder properties. Disambiguate similarly named items using parentReference.path, lastModifiedDateTime, and size before passing item IDs downstream. Newly created or recently moved files may not appear due to indexing delays; fall back to ONE_DRIVE_LIST_FOLDER_CHILDREN if expected items are missing. No server-side date filtering — apply lastModifiedDateTime/createdDateTime filtering in your own logic. HTTP 429 responses include a Retry-After header; use exponential backoff.",
    toolSlug: "ONE_DRIVE_SEARCH_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The query text used to search for items. Values are matched across filenames, metadata, and file content. This is a simple keyword-based search only - NOT KQL (Keyword Query Language). IMPORTANT: (1) KQL operators like 'folder:', 'file:', 'content:', 'filetype:' are NOT supported by this endpoint and will be treated as literal text search. Use plain keywords instead (e.g., 'shared documents' not 'folder:shared'). (2) Path-based filtering syntax (e.g., 'path:/folder') is NOT supported and will be transformed to a keyword search. (3) Wildcard characters (* and ?) are NOT supported and will be automatically removed - use file extension keywords instead (e.g., 'mp4' instead of '*.mp4'). To search within a specific folder, use ONE_DRIVE_LIST_FOLDER_CHILDREN.",
        },
        top: {
          type: "integer",
          description: "The maximum number of items to return in a single page. Default is 200.",
        },
        expand: {
          type: "string",
          description: "A comma-separated list of relationship names to expand and include in the response. For driveItem resources, you can expand relationships like 'children' to get child items, 'thumbnails' to get thumbnail metadata, or 'permissions' to get sharing permissions. For example, use 'children' to include the child items of folders in search results, or 'thumbnails' to include thumbnail URLs. Note: Not all relationships may be expandable in search results. Refer to the Microsoft Graph API documentation for supported expansions.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of driveItem properties to include in the response. Valid properties include: id, name, webUrl, size, createdDateTime, lastModifiedDateTime, file, folder, parentReference, createdBy, lastModifiedBy, fileSystemInfo, searchResult, remoteItem, etc. Note: @-prefixed annotations (e.g., @microsoft.graph.downloadUrl) are automatically stripped as they are not valid in $select queries for search endpoints.",
        },
        orderby: {
          type: "string",
          description: "A comma-separated list of properties used to sort the order of the items in the response. Use 'asc' or 'desc' for ascending or descending order, e.g., 'name asc'.",
        },
        drive_id: {
          type: "string",
          description: "The ID of the drive to search within. If not provided, the user's personal drive (me/drive) will be searched. Use ONE_DRIVE_LIST_DRIVES to get valid drive IDs. Note: Some drive ID formats (e.g., secondary personal drives or special SharePoint IDs) may return 'ObjectHandle is Invalid' errors due to Microsoft Graph API limitations.",
        },
        skip_token: {
          type: "string",
          description: "A token to retrieve the next page of results, obtained from the @odata.nextLink in a previous response.",
        },
        search_scope: {
          type: "string",
          description: "Specifies the scope of the search. 'root' searches within the folder hierarchy starting from root (uses /drives/{drive_id}/root/search or /me/drive/root/search). 'drive' broadens the search to include items shared with the current user (uses /drives/{drive_id}/search or /me/drive/search). This parameter is respected both with and without a drive_id.",
          enum: [
            "drive",
            "root",
          ],
        },
        stripped_annotations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal field to track stripped annotations. Not exposed to API.",
        },
        transformed_path_query: {
          type: "string",
          description: "Internal field to track if path-based query was transformed. Not exposed to API.",
        },
        transformed_kql_operator: {
          type: "string",
          description: "Internal field to track if a KQL operator was transformed. Not exposed to API.",
        },
        transformed_parent_query: {
          type: "string",
          description: "Internal field to track if parent: filter was stripped from query. Not exposed to API.",
        },
        transformed_wildcard_query: {
          type: "string",
          description: "Internal field to track if wildcard characters were removed from query. Not exposed to API.",
        },
      },
      required: [
        "q",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "read",
      "driveitem",
      "search",
    ],
  }),
  composioTool({
    name: "one_drive_unfollow_item",
    description: "Tool to unfollow a driveItem by removing it from the user's followed items collection. Use when you need to stop following a file or folder that was previously marked to follow.",
    toolSlug: "ONE_DRIVE_UNFOLLOW_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the driveItem to unfollow. This is the ID of an item in the user's followed items collection.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
      "drive",
      "following",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Drive Following.",
    ],
  }),
  composioTool({
    name: "one_drive_update_drive_item_metadata",
    description: "Tool to update the metadata of a specific item (file or folder) in OneDrive. Use this to rename items, change descriptions, or move items to a new parent folder.",
    toolSlug: "ONE_DRIVE_UPDATE_DRIVE_ITEM_METADATA",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the drive item. Must not contain illegal characters: `\\`, `/`, `:`, `*`, `?`, `'`, `<`, `>`, `|`; these trigger an `invalidRequest` error.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item (file or folder) to update.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the site. Used when updating an item within a site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Used when updating an item within a specific user's drive.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. Required if not using other specific paths like /me, /groups/{group-id}, /sites/{site-id}, or /users/{user-id}.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the group. Used when updating an item within a group's drive.",
        },
        if_match: {
          type: "string",
          description: "The eTag or cTag value for conditional update. If this header is included and the eTag provided doesn't match the current eTag on the item, a 412 Precondition Failed response is returned. Use this to prevent conflicts when multiple users update the same item.",
        },
        description: {
          type: "string",
          description: "The new description for the drive item.",
        },
        file_system_info: {
          type: "object",
          additionalProperties: true,
          properties: {
            createdDateTime: {
              type: "string",
              description: "The UTC date and time the file was created on a client. ISO 8601 format.",
            },
            lastAccessedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last accessed. ISO 8601 format.",
            },
            lastModifiedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last modified on a client. ISO 8601 format.",
            },
          },
          description: "File system information on client.",
        },
        parent_reference_id: {
          type: "string",
          description: "The ID of the new parent item. Use this to move the item. The driveId of the parentReference can also be specified if moving between drives. For cross-drive moves, `parent_reference_drive_id` is required alongside this field. Omit both fields when only renaming or updating metadata to avoid unintended moves.",
        },
        parent_reference_drive_id: {
          type: "string",
          description: "The drive ID of the new parent item, if moving to a different drive.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "driveitem",
      "metadata",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Drive Item Metadata.",
    ],
  }),
  composioTool({
    name: "one_drive_update_drive_items_permissions",
    description: "Tool to update the roles of an existing permission on a OneDrive drive item. Use when you need to change the access level (read, write, owner) for a specific permission on a file or folder.",
    toolSlug: "ONE_DRIVE_UPDATE_DRIVE_ITEMS_PERMISSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        roles: {
          type: "array",
          items: {
            type: "string",
            description: "Valid permission roles for OneDrive items.",
            enum: [
              "read",
              "write",
              "owner",
            ],
          },
          description: "Array of roles to assign to the permission. Valid values: read, write, owner.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the drive item.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of a SharePoint site. Use this if the item is in a SharePoint site's drive.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of a user. Use this if the item is in a specific user's drive (other than 'me').",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. Required if not using other identifiers like group_id, site_id, or user_id.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of a group. Use this if the item is in a group's drive.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the permission to update.",
        },
      },
      required: [
        "item_id",
        "permission_id",
        "roles",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "driveitem",
      "permission",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Drive Item Permissions.",
    ],
  }),
  composioTool({
    name: "one_drive_update_file_content",
    description: "Tool to create an upload session for updating an existing file's content in OneDrive. Use when you need to overwrite/update an existing DriveItem's content while preserving its item ID, avoiding duplicate copies and maintaining existing share links.",
    toolSlug: "ONE_DRIVE_UPDATE_FILE_CONTENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the item (filename and extension). Use this to override the filename during the upload session.",
        },
        item_id: {
          type: "string",
          description: "The unique identifier of the DriveItem (file) to update.",
        },
        site_id: {
          type: "string",
          description: "The unique identifier of the SharePoint site. If provided, uses /sites/{siteId}/drive. Mutually exclusive with drive_id, group_id, and user_id.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. If provided, uses /users/{userId}/drive. Mutually exclusive with drive_id, site_id, and group_id.",
        },
        drive_id: {
          type: "string",
          description: "The unique identifier of the drive. If not provided, uses /me/drive. Mutually exclusive with site_id, group_id, and user_id.",
        },
        group_id: {
          type: "string",
          description: "The unique identifier of the group. If provided, uses /groups/{groupId}/drive. Mutually exclusive with drive_id, site_id, and user_id.",
        },
        file_size: {
          type: "integer",
          description: "Provides an expected file size to perform a quota check before uploading. Only supported on OneDrive Personal.",
        },
        description: {
          type: "string",
          description: "Provides a user-visible description of the item. Only supported on OneDrive Personal.",
        },
        defer_commit: {
          type: "boolean",
          description: "If true, the file creation is deferred until an explicit completion request is made. Useful for very large files where you want to control when the upload is finalized.",
        },
        media_source: {
          type: "object",
          additionalProperties: true,
          properties: {
            contentCategory: {
              type: "string",
              description: "Enumeration value that indicates the media content category.",
            },
          },
          description: "Media source information. Only on OneDrive for Business and SharePoint.",
        },
        if_match_etag: {
          type: "string",
          description: "An ETag value to prevent lost updates. If provided, the update will only proceed if the current file's ETag matches this value. Returns 412 error if it doesn't match.",
        },
        file_system_info: {
          type: "object",
          additionalProperties: true,
          properties: {
            createdDateTime: {
              type: "string",
              description: "The UTC date and time the file was created on a client. ISO 8601 format.",
            },
            lastAccessedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last accessed. ISO 8601 format.",
            },
            lastModifiedDateTime: {
              type: "string",
              description: "The UTC date and time the file was last modified on a client. ISO 8601 format.",
            },
          },
          description: "File system information on client.",
        },
        conflict_behavior: {
          type: "string",
          description: "How to handle conflicts when updating the file. 'replace' overwrites the existing content (default), 'fail' returns an error if conflict occurs, 'rename' creates a new file with a different name.",
          enum: [
            "replace",
            "fail",
            "rename",
          ],
        },
        drive_item_source: {
          type: "object",
          additionalProperties: true,
          properties: {
            externalId: {
              type: "string",
              description: "The external identifier for the drive item from the source.",
            },
            application: {
              type: "string",
              description: "Enumeration value that indicates the source application.",
            },
          },
          description: "Information about the drive item source. Only on OneDrive for Business and SharePoint.",
        },
        if_none_match_etag: {
          type: "string",
          description: "An ETag value to prevent updates if the item already exists. If provided and the ETag matches, returns 412 error. Used to detect if the item has changed.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "onedrive",
      "write",
      "file_management",
      "upload",
    ],
    askBefore: [
      "Confirm the parameters before executing Update File Content.",
    ],
  }),
];
