import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const GOOGLE_DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_UPLOAD_BASE_URL = "https://www.googleapis.com/upload/drive/v3";

const GOOGLE_WORKSPACE_EXPORT_MIME_TYPES: Record<string, string> = {
  "application/vnd.google-apps.document": "text/markdown",
  "application/vnd.google-apps.spreadsheet": "text/csv",
  "application/vnd.google-apps.presentation": "application/pdf",
  "application/vnd.google-apps.drawing": "image/png",
  "application/vnd.google-apps.script": "application/vnd.google-apps.script+json",
};

type UnknownRecord = Record<string, unknown>;

interface GoogleApiErrorPayload {
  error?: {
    code?: number | string;
    status?: string;
    message?: string;
  };
}

function isRecordObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getAccessToken(credentials: Record<string, string>): string {
  const token = safeTrim(
    credentials.accessToken ?? credentials.access_token ?? credentials.token,
  );

  if (!token) {
    throw new Error("Google Drive credentials are missing an access token.");
  }

  return token;
}

function requiredString(value: unknown, fieldName: string): string {
  const normalized = safeTrim(value);

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function normalizeStringList(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((entry, index) => {
    const normalized = safeTrim(entry);

    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }

    return normalized;
  });
}

function optionalObject(value: unknown, fieldName: string): UnknownRecord {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isRecordObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return { ...value };
}

function setIfDefined(payload: UnknownRecord, key: string, value: unknown): void {
  if (value !== undefined) {
    payload[key] = value;
  }
}

function inferDownloadFormat(body: string, contentType: string | null): "json" | "text" | "base64" {
  if (contentType?.includes("application/json")) {
    return "json";
  }

  if (contentType) {
    const textualPrefixes = ["text/", "application/xml", "application/javascript", "application/x-javascript"];
    if (textualPrefixes.some((prefix) => contentType.includes(prefix))) {
      return "text";
    }
  }

  if (/^[\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]*$/.test(body)) {
    return "text";
  }

  return "base64";
}

class GoogleDriveHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_files", {
        description: "List recent Google Drive files",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: { type: "number", description: "Maximum files to return" },
            orderBy: { type: "string", description: "Drive orderBy expression such as modifiedTime desc" },
            corpora: { type: "string", description: "Drive corpora value such as user or drive" },
            driveId: { type: "string", description: "Shared drive id when applicable" },
          },
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "list"],
        safeDefaults: {
          pageSize: 25,
          orderBy: "modifiedTime desc",
        },
      }),
      defineTool(integrationSlug, "search_files", {
        description: "Search Google Drive files with text, mime type, and folder filters",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Free-text name/fullText query" },
            parentId: { type: "string", description: "Optional folder id to search within" },
            mimeType: { type: "string", description: "Optional mime type filter" },
            trashed: { type: "boolean", description: "Include trashed state in query, default false" },
            pageSize: { type: "number", description: "Maximum files to return" },
            orderBy: { type: "string", description: "Drive orderBy expression" },
            rawQuery: { type: "string", description: "Optional raw Drive q string to use directly" },
          },
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "search"],
        safeDefaults: {
          pageSize: 25,
          trashed: false,
          orderBy: "modifiedTime desc",
        },
      }),
      defineTool(integrationSlug, "get_file", {
        description: "Get Google Drive file metadata by file id",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            fields: { type: "string", description: "Optional Drive fields selector" },
          },
          required: ["fileId"],
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "lookup"],
      }),
      defineTool(integrationSlug, "list_children", {
        description: "List files inside a Google Drive folder",
        inputSchema: {
          type: "object",
          properties: {
            folderId: { type: "string", description: "Parent folder id" },
            pageSize: { type: "number", description: "Maximum children to return" },
            orderBy: { type: "string", description: "Drive orderBy expression" },
          },
          required: ["folderId"],
        },
        accessLevel: "read",
        tags: ["google-drive", "folders", "children"],
        safeDefaults: {
          pageSize: 50,
          orderBy: "folder,name",
        },
      }),
      defineTool(integrationSlug, "create_folder", {
        description: "Create a folder in Google Drive",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Folder name" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids" },
            description: { type: "string", description: "Optional folder description via appProperties hint or user metadata pattern" },
          },
          required: ["name"],
        },
        accessLevel: "write",
        tags: ["google-drive", "folders", "create"],
      }),
      defineTool(integrationSlug, "upload_file", {
        description: "Upload a text file to Google Drive",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "File name" },
            content: { type: "string", description: "Text content to upload" },
            mimeType: { type: "string", description: "Mime type, default text/plain" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids" },
            description: { type: "string", description: "Optional Drive file description" },
          },
          required: ["name", "content"],
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "upload"],
        askBefore: [
          "Use this text upload path for lightweight files first. Binary uploads can come in a later pass.",
        ],
      }),
      defineTool(integrationSlug, "update_file", {
        description: "Update Google Drive file metadata or replace text content",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            name: { type: "string", description: "Updated file name" },
            description: { type: "string", description: "Updated file description" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional full parent set to add" },
            removeParentIds: { type: "array", items: { type: "string" }, description: "Optional parent ids to remove" },
            content: { type: "string", description: "Optional replacement text content" },
            mimeType: { type: "string", description: "Mime type to use when replacing content" },
          },
          required: ["fileId"],
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "update"],
      }),
      defineTool(integrationSlug, "download_file", {
        description: "Download raw Google Drive file content when supported",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            acknowledgeBinary: { type: "boolean", description: "Set true to allow binary/base64 responses" },
          },
          required: ["fileId"],
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "download"],
      }),
      defineTool(integrationSlug, "export_file", {
        description: "Export a Google Docs-format file to a chosen mime type",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            mimeType: { type: "string", description: "Target export mime type, e.g. text/markdown or application/pdf" },
            acknowledgeBinary: { type: "boolean", description: "Set true to allow binary/base64 responses" },
          },
          required: ["fileId"],
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "export"],
      }),
      defineTool(integrationSlug, "copy_file", {
        description: "Copy a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Source Google Drive file id" },
            name: { type: "string", description: "Optional name for the copied file" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids for the copy" },
            description: { type: "string", description: "Optional description for the copied file" },
          },
          required: ["fileId"],
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "copy"],
      }),
      defineTool(integrationSlug, "list_permissions", {
        description: "List sharing permissions on a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            pageSize: { type: "number", description: "Maximum permissions to return" },
          },
          required: ["fileId"],
        },
        accessLevel: "read",
        tags: ["google-drive", "permissions", "list"],
      }),
      defineTool(integrationSlug, "create_permission", {
        description: "Create a sharing permission on a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            type: { type: "string", description: "Permission type such as user, group, domain, or anyone" },
            role: { type: "string", description: "Permission role such as reader, commenter, or writer" },
            emailAddress: { type: "string", description: "Email for user/group permissions" },
            domain: { type: "string", description: "Domain for domain permissions" },
            allowFileDiscovery: { type: "boolean", description: "Whether the file is discoverable for domain/anyone permissions" },
            sendNotificationEmail: { type: "boolean", description: "Whether Drive should send a share email" },
          },
          required: ["fileId", "type", "role"],
        },
        accessLevel: "write",
        tags: ["google-drive", "permissions", "create"],
      }),
      defineTool(integrationSlug, "delete_permission", {
        description: "Delete a sharing permission from a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            permissionId: { type: "string", description: "Permission id to delete" },
          },
          required: ["fileId", "permissionId"],
        },
        accessLevel: "destructive",
        tags: ["google-drive", "permissions", "delete"],
        askBefore: [
          "Confirm before removing an existing Google Drive share permission unless the user was already explicit.",
        ],
      }),
      defineTool(integrationSlug, "delete_file", {
        description: "Delete a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
          },
          required: ["fileId"],
        },
        accessLevel: "destructive",
        tags: ["google-drive", "files", "delete"],
        askBefore: [
          "Confirm before deleting a Google Drive file unless the user was already explicit.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${getAccessToken(credentials)}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_files":
        return this.listFiles(args, credentials);
      case "search_files":
        return this.searchFiles(args, credentials);
      case "get_file":
        return this.getFile(args, credentials);
      case "list_children":
        return this.listChildren(args, credentials);
      case "create_folder":
        return this.createFolder(args, credentials);
      case "upload_file":
        return this.uploadFile(args, credentials);
      case "update_file":
        return this.updateFile(args, credentials);
      case "download_file":
        return this.downloadFile(args, credentials);
      case "export_file":
        return this.exportFile(args, credentials);
      case "copy_file":
        return this.copyFile(args, credentials);
      case "list_permissions":
        return this.listPermissions(args, credentials);
      case "create_permission":
        return this.createPermission(args, credentials);
      case "delete_permission":
        return this.deletePermission(args, credentials);
      case "delete_file":
        return this.deleteFile(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_DRIVE_BASE_URL}/files?pageSize=1&fields=files(id)`,
        { method: "GET" },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private async listFiles(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = new URLSearchParams({
      pageSize: String(optionalNumber(args.pageSize) ?? 25),
      orderBy: safeTrim(args.orderBy) ?? "modifiedTime desc",
      fields: "nextPageToken, files(id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,driveId,owners(displayName,emailAddress))",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

    const corpora = safeTrim(args.corpora);
    if (corpora) {
      query.set("corpora", corpora);
    }

    const driveId = safeTrim(args.driveId);
    if (driveId) {
      query.set("driveId", driveId);
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?${query.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Drive files", response);
    }

    return response.json();
  }

  private async searchFiles(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const rawQuery = safeTrim(args.rawQuery);
    const clauses: string[] = [];

    if (rawQuery) {
      clauses.push(rawQuery);
    } else {
      const query = safeTrim(args.query);
      const escapedQuery = query?.replace(/'/g, "\\'");
      if (escapedQuery) {
        clauses.push(`(name contains '${escapedQuery}' or fullText contains '${escapedQuery}')`);
      }

      const parentId = safeTrim(args.parentId);
      if (parentId) {
        clauses.push(`'${parentId.replace(/'/g, "\\'")}' in parents`);
      }

      const mimeType = safeTrim(args.mimeType);
      if (mimeType) {
        clauses.push(`mimeType = '${mimeType.replace(/'/g, "\\'")}'`);
      }

      const trashed = optionalBoolean(args.trashed) ?? false;
      clauses.push(`trashed = ${trashed ? "true" : "false"}`);
    }

    const q = clauses.join(" and ");
    const query = new URLSearchParams({
      pageSize: String(optionalNumber(args.pageSize) ?? 25),
      orderBy: safeTrim(args.orderBy) ?? "modifiedTime desc",
      fields: "nextPageToken, files(id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,driveId)",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

    if (q) {
      query.set("q", q);
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?${query.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to search Google Drive files", response);
    }

    return response.json();
  }

  private async getFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const fields = safeTrim(args.fields) ?? "id,name,mimeType,parents,description,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,owners(displayName,emailAddress),lastModifyingUser(displayName,emailAddress)";

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?${new URLSearchParams({ fields, supportsAllDrives: "true" }).toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Drive file", response);
    }

    return response.json();
  }

  private async listChildren(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const folderId = requiredString(args.folderId, "folderId");
    return this.searchFiles(
      {
        rawQuery: `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false`,
        pageSize: optionalNumber(args.pageSize) ?? 50,
        orderBy: safeTrim(args.orderBy) ?? "folder,name",
      },
      credentials,
    );
  }

  private async createFolder(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const payload: UnknownRecord = {
      name: requiredString(args.name, "name"),
      mimeType: "application/vnd.google-apps.folder",
    };

    const parentIds = normalizeStringList(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }

    const description = safeTrim(args.description);
    if (description) {
      payload.description = description;
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?supportsAllDrives=true&fields=id,name,mimeType,parents,webViewLink,createdTime`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Drive folder", response);
    }

    return response.json();
  }

  private async uploadFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const metadata: UnknownRecord = {
      name: requiredString(args.name, "name"),
    };

    const parentIds = normalizeStringList(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      metadata.parents = parentIds;
    }

    const description = safeTrim(args.description);
    if (description) {
      metadata.description = description;
    }

    const mimeType = safeTrim(args.mimeType) ?? "text/plain";
    const content = requiredString(args.content, "content");
    const boundary = `clawlink-${crypto.randomUUID()}`;

    const multipartBody = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${content}\r\n`,
      `--${boundary}--`,
    ].join("");

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size`,
      {
        method: "POST",
        headers: {
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to upload Google Drive file", response);
    }

    return response.json();
  }

  private async updateFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const name = safeTrim(args.name);
    const description = safeTrim(args.description);
    const parentIds = normalizeStringList(args.parentIds, "parentIds");
    const removeParentIds = normalizeStringList(args.removeParentIds, "removeParentIds");
    const content = safeTrim(args.content);
    const mimeType = safeTrim(args.mimeType) ?? "text/plain";

    if (!name && !description && parentIds.length === 0 && removeParentIds.length === 0 && content === null) {
      throw new Error("Provide at least one metadata field or content to update the Google Drive file");
    }

    if (content !== null) {
      const metadata: UnknownRecord = {};
      setIfDefined(metadata, "name", name ?? undefined);
      setIfDefined(metadata, "description", description ?? undefined);
      if (parentIds.length > 0) {
        metadata.parents = parentIds;
      }

      const boundary = `clawlink-${crypto.randomUUID()}`;
      const query = new URLSearchParams({
        uploadType: "multipart",
        supportsAllDrives: "true",
        fields: "id,name,mimeType,parents,description,webViewLink,modifiedTime,size",
      });

      if (removeParentIds.length > 0) {
        query.set("removeParents", removeParentIds.join(","));
      }

      const multipartBody = [
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
        `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${content}\r\n`,
        `--${boundary}--`,
      ].join("");

      const response = await this.apiRequest(
        `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files/${encodeURIComponent(fileId)}?${query.toString()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: multipartBody,
        },
        credentials,
      );

      if (!response.ok) {
        throw await this.createApiError("Failed to update Google Drive file", response);
      }

      return response.json();
    }

    const payload = optionalObject({}, "payload");
    setIfDefined(payload, "name", name ?? undefined);
    setIfDefined(payload, "description", description ?? undefined);
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }

    const query = new URLSearchParams({
      supportsAllDrives: "true",
      fields: "id,name,mimeType,parents,description,webViewLink,modifiedTime,size",
    });

    if (removeParentIds.length > 0) {
      query.set("removeParents", removeParentIds.join(","));
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?${query.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Drive file", response);
    }

    return response.json();
  }

  private async downloadFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to download Google Drive file", response);
    }

    const contentType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const utf8 = body.toString("utf8");
    const format = inferDownloadFormat(utf8, contentType);

    if (format === "base64" && optionalBoolean(args.acknowledgeBinary) !== true) {
      throw new Error("This file appears binary. Re-run with acknowledgeBinary=true to receive base64 content.");
    }

    return {
      ok: true,
      fileId,
      contentType,
      encoding: format === "base64" ? "base64" : "utf8",
      content:
        format === "base64"
          ? body.toString("base64")
          : format === "json"
            ? JSON.parse(utf8)
            : utf8,
    };
  }

  private async exportFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const metadata = await this.getFile({ fileId, fields: "id,name,mimeType" }, credentials) as UnknownRecord;
    const sourceMimeType = safeTrim(metadata.mimeType);
    const mimeType =
      safeTrim(args.mimeType) ??
      (sourceMimeType ? GOOGLE_WORKSPACE_EXPORT_MIME_TYPES[sourceMimeType] : null);

    if (!mimeType) {
      throw new Error("mimeType is required for export when the source Google Workspace file type has no default export mapping");
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/export?${new URLSearchParams({ mimeType }).toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to export Google Drive file", response);
    }

    const contentType = response.headers.get("content-type") ?? mimeType;
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const utf8 = body.toString("utf8");
    const format = inferDownloadFormat(utf8, contentType);

    if (format === "base64" && optionalBoolean(args.acknowledgeBinary) !== true) {
      throw new Error("This export appears binary. Re-run with acknowledgeBinary=true to receive base64 content.");
    }

    return {
      ok: true,
      fileId,
      sourceMimeType,
      exportMimeType: mimeType,
      contentType,
      encoding: format === "base64" ? "base64" : "utf8",
      content:
        format === "base64"
          ? body.toString("base64")
          : format === "json"
            ? JSON.parse(utf8)
            : utf8,
    };
  }

  private async copyFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const payload: UnknownRecord = {};
    setIfDefined(payload, "name", safeTrim(args.name) ?? undefined);
    setIfDefined(payload, "description", safeTrim(args.description) ?? undefined);

    const parentIds = normalizeStringList(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/copy?supportsAllDrives=true&fields=id,name,mimeType,parents,description,webViewLink,createdTime,modifiedTime`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to copy Google Drive file", response);
    }

    return response.json();
  }

  private async listPermissions(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const query = new URLSearchParams({
      supportsAllDrives: "true",
      fields: "nextPageToken,permissions(id,type,role,emailAddress,domain,allowFileDiscovery,displayName,photoLink,deleted,pendingOwner)",
      pageSize: String(optionalNumber(args.pageSize) ?? 100),
    });

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions?${query.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Drive permissions", response);
    }

    return response.json();
  }

  private async createPermission(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const type = requiredString(args.type, "type");
    const role = requiredString(args.role, "role");
    const payload: UnknownRecord = { type, role };

    const emailAddress = safeTrim(args.emailAddress);
    if (emailAddress) {
      payload.emailAddress = emailAddress;
    }

    const domain = safeTrim(args.domain);
    if (domain) {
      payload.domain = domain;
    }

    const allowFileDiscovery = optionalBoolean(args.allowFileDiscovery);
    if (allowFileDiscovery !== undefined) {
      payload.allowFileDiscovery = allowFileDiscovery;
    }

    const query = new URLSearchParams({
      supportsAllDrives: "true",
      sendNotificationEmail: String(optionalBoolean(args.sendNotificationEmail) ?? false),
      fields: "id,type,role,emailAddress,domain,allowFileDiscovery,pendingOwner",
    });

    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions?${query.toString()}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Drive permission", response);
    }

    return response.json();
  }

  private async deletePermission(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const permissionId = requiredString(args.permissionId, "permissionId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions/${encodeURIComponent(permissionId)}?supportsAllDrives=true`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Drive permission", response);
    }

    return {
      ok: true,
      fileId,
      permissionId,
      deleted: true,
    };
  }

  private async deleteFile(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const fileId = requiredString(args.fileId, "fileId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Drive file", response);
    }

    return {
      ok: true,
      fileId,
      deleted: true,
    };
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as GoogleApiErrorPayload | null;
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== undefined ? String(body.error.code) : undefined;
    const detail = status ? `${status}: ${message}` : message;

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("google-drive", new GoogleDriveHandler());
