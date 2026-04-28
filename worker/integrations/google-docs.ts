import {
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";
import { GoogleBaseIntegration, type GoogleExecutionContext } from "./google-base";

const GOOGLE_DOCS_BASE_URL = "https://docs.googleapis.com/v1/documents";
const GOOGLE_DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3";
const GOOGLE_DOCS_MIME_TYPE = "application/vnd.google-apps.document";

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

function requiredString(value: unknown, fieldName: string): string {
  const normalized = safeTrim(value);

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function optionalString(value: unknown): string | undefined {
  return safeTrim(value) ?? undefined;
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

function optionalObject(value: unknown, fieldName: string): UnknownRecord {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isRecordObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return { ...value };
}

function extractTextFromStructuralElements(elements: unknown): string {
  if (!Array.isArray(elements)) {
    return "";
  }

  let text = "";

  for (const element of elements) {
    if (!isRecordObject(element)) {
      continue;
    }

    const textRun = isRecordObject(element.textRun) ? element.textRun : null;
    const content = textRun ? optionalString(textRun.content) : undefined;
    if (content) {
      text += content;
    }
  }

  return text;
}

function documentBodyToPlainText(document: UnknownRecord): string {
  const body = isRecordObject(document.body) ? document.body : null;
  const content = Array.isArray(body?.content) ? body.content : [];

  let text = "";

  for (const item of content) {
    if (!isRecordObject(item)) {
      continue;
    }

    const paragraph = isRecordObject(item.paragraph) ? item.paragraph : null;
    if (paragraph) {
      text += extractTextFromStructuralElements(paragraph.elements);
      continue;
    }

    const table = isRecordObject(item.table) ? item.table : null;
    if (table && Array.isArray(table.tableRows)) {
      for (const row of table.tableRows) {
        if (!isRecordObject(row) || !Array.isArray(row.tableCells)) {
          continue;
        }

        for (const cell of row.tableCells) {
          if (!isRecordObject(cell) || !Array.isArray(cell.content)) {
            continue;
          }

          for (const block of cell.content) {
            if (!isRecordObject(block)) {
              continue;
            }

            const cellParagraph = isRecordObject(block.paragraph) ? block.paragraph : null;
            if (cellParagraph) {
              text += extractTextFromStructuralElements(cellParagraph.elements);
            }
          }
        }
      }
    }
  }

  return text;
}

function getDocumentEndIndex(document: UnknownRecord): number {
  const body = isRecordObject(document.body) ? document.body : null;
  const content = Array.isArray(body?.content) ? body.content : [];

  for (let i = content.length - 1; i >= 0; i -= 1) {
    const item = content[i];
    if (isRecordObject(item) && typeof item.endIndex === "number") {
      return item.endIndex;
    }
  }

  return 1;
}

function summarizeDocument(document: UnknownRecord): UnknownRecord {
  const documentId = optionalString(document.documentId) ?? null;
  const title = optionalString(document.title) ?? null;
  const revisionId = optionalString(document.revisionId) ?? null;
  const text = documentBodyToPlainText(document);

  return {
    documentId,
    title,
    revisionId,
    text,
    textLength: text.length,
    endIndex: getDocumentEndIndex(document),
  };
}

class GoogleDocsHandler extends GoogleBaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "create_document", {
        description: "Create a new Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Document title" },
            content: { type: "string", description: "Optional initial plain text content to insert" },
            parentFolderId: { type: "string", description: "Optional Drive folder id to move the new document into" },
          },
          required: ["title"],
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "create"],
      }),
      defineTool(integrationSlug, "get_document", {
        description: "Get Google Docs document metadata and structure by document id",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
          },
          required: ["documentId"],
        },
        accessLevel: "read",
        tags: ["google-docs", "documents", "lookup"],
      }),
      defineTool(integrationSlug, "read_document", {
        description: "Read a Google Docs document as plain text with compact metadata",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
          },
          required: ["documentId"],
        },
        accessLevel: "read",
        tags: ["google-docs", "documents", "read", "text"],
      }),
      defineTool(integrationSlug, "replace_text", {
        description: "Replace matching text everywhere in a Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
            searchText: { type: "string", description: "Exact text to find" },
            replaceText: { type: "string", description: "Replacement text" },
          },
          required: ["documentId", "searchText", "replaceText"],
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "replace", "template"],
      }),
      defineTool(integrationSlug, "append_text", {
        description: "Append plain text to the end of a Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
            text: { type: "string", description: "Plain text to append" },
            prependNewline: { type: "boolean", description: "Whether to prepend a newline before the appended text when the document already has content" },
          },
          required: ["documentId", "text"],
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "append", "write"],
      }),
    ];
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    switch (action) {
      case "create_document":
        return this.createDocument(args, credentials, context);
      case "get_document":
        return this.getDocument(args, credentials, context);
      case "read_document":
        return this.readDocument(args, credentials, context);
      case "replace_text":
        return this.replaceText(args, credentials, context);
      case "append_text":
        return this.appendText(args, credentials, context);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    if (this.getPipedreamAccountId(credentials)) {
      return true;
    }

    try {
      const response = await this.googleApiRequest(
        `${GOOGLE_DRIVE_BASE_URL}/files?pageSize=1&q=${encodeURIComponent(`mimeType='${GOOGLE_DOCS_MIME_TYPE}'`)}&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
        { method: "GET" },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private async createDocument(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const title = requiredString(args.title, "title");
    const content = optionalString(args.content);
    const parentFolderId = optionalString(args.parentFolderId);

    const createResponse = await this.googleApiRequest(
      GOOGLE_DOCS_BASE_URL,
      {
        method: "POST",
        body: JSON.stringify({ title }),
      },
      credentials,
      context,
    );

    if (!createResponse.ok) {
      throw await this.createApiError("Failed to create Google Docs document", createResponse);
    }

    const created = (await createResponse.json()) as UnknownRecord;
    const documentId = requiredString(created.documentId, "documentId");

    if (content) {
      await this.batchUpdateDocument(
        documentId,
        {
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: content,
              },
            },
          ],
        },
        credentials,
        context,
      );
    }

    if (parentFolderId) {
      await this.moveFileToFolder(documentId, parentFolderId, credentials, context);
    }

    const fresh = await this.getDocument({ documentId }, credentials, context) as UnknownRecord;
    return summarizeDocument(fresh);
  }

  private async getDocument(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const documentId = requiredString(args.documentId, "documentId");
    const response = await this.googleApiRequest(
      `${GOOGLE_DOCS_BASE_URL}/${encodeURIComponent(documentId)}`,
      { method: "GET" },
      credentials,
      context,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Docs document", response);
    }

    return response.json();
  }

  private async readDocument(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const document = await this.getDocument(args, credentials, context) as UnknownRecord;
    return summarizeDocument(document);
  }

  private async replaceText(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const documentId = requiredString(args.documentId, "documentId");
    const searchText = requiredString(args.searchText, "searchText");
    const replaceText = requiredString(args.replaceText, "replaceText");

    const result = await this.batchUpdateDocument(
      documentId,
      {
        requests: [
          {
            replaceAllText: {
              containsText: {
                text: searchText,
                matchCase: true,
              },
              replaceText,
            },
          },
        ],
      },
      credentials,
      context,
    );

    const body = optionalObject(result, "batchUpdateResponse");
    const replies = Array.isArray(body.replies) ? body.replies : [];
    const firstReply = replies[0];
    const occurrencesChanged = isRecordObject(firstReply) && isRecordObject(firstReply.replaceAllText)
      ? optionalNumber(firstReply.replaceAllText.occurrencesChanged) ?? 0
      : 0;

    return {
      ok: true,
      documentId,
      searchText,
      replaceText,
      occurrencesChanged,
    };
  }

  private async appendText(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const documentId = requiredString(args.documentId, "documentId");
    const text = requiredString(args.text, "text");
    const document = await this.getDocument({ documentId }, credentials, context) as UnknownRecord;
    const existingText = documentBodyToPlainText(document);
    const endIndex = Math.max(1, getDocumentEndIndex(document) - 1);
    const prependNewline = args.prependNewline === true && existingText.length > 0;
    const textToInsert = `${prependNewline ? "\n" : ""}${text}`;

    await this.batchUpdateDocument(
      documentId,
      {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: textToInsert,
            },
          },
        ],
      },
      credentials,
      context,
    );

    return {
      ok: true,
      documentId,
      appendedTextLength: text.length,
      insertedLength: textToInsert.length,
      usedEndIndexHint: endIndex,
    };
  }

  private async batchUpdateDocument(
    documentId: string,
    payload: UnknownRecord,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<unknown> {
    const response = await this.googleApiRequest(
      `${GOOGLE_DOCS_BASE_URL}/${encodeURIComponent(documentId)}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
      context,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Docs document", response);
    }

    return response.json();
  }

  private async moveFileToFolder(
    fileId: string,
    folderId: string,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<void> {
    const metadataResponse = await this.googleApiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?fields=parents&supportsAllDrives=true`,
      { method: "GET" },
      credentials,
      context,
    );

    if (!metadataResponse.ok) {
      throw await this.createApiError("Failed to fetch Google Docs file parents", metadataResponse);
    }

    const metadata = (await metadataResponse.json()) as UnknownRecord;
    const parents = Array.isArray(metadata.parents)
      ? metadata.parents.map((parent) => requiredString(parent, "parentId"))
      : [];

    const query = new URLSearchParams({
      addParents: folderId,
      supportsAllDrives: "true",
      fields: "id,parents",
    });

    if (parents.length > 0) {
      query.set("removeParents", parents.join(","));
    }

    const moveResponse = await this.googleApiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?${query.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({}),
      },
      credentials,
      context,
    );

    if (!moveResponse.ok) {
      throw await this.createApiError("Failed to move Google Docs document into folder", moveResponse);
    }
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

registerHandler("google-docs", new GoogleDocsHandler());
