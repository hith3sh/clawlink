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
    integration: "pandadoc",
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
      toolkit: "pandadoc",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const pandadocComposioTools: IntegrationTool[] = [
  composioTool({
    name: "pandadoc_create_document_attachment",
    description: "Creates and adds an attachment to a PandaDoc document. This tool allows you to attach downloadable files such as supplemental materials, Excel spreadsheets, or other content without embedding them directly into the document. Attachments can be added only to documents in 'document.draft' status, with a maximum of 10 files per document and a size limit of 50MB per file.",
    toolSlug: "PANDADOC_CREATE_DOCUMENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Document Attachment.",
    ],
  }),
  composioTool({
    name: "pandadoc_create_document_from_file",
    description: "Creates a new document in PandaDoc by uploading a file (PDF, DOCX, or RTF). Converts existing documents into PandaDoc documents for processing, signing, and tracking. Either `file` or `url` must be provided; omitting both will fail. Large files may time out during upload and conversion.",
    toolSlug: "PANDADOC_CREATE_DOCUMENT_FROM_FILE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Document from File Upload.",
    ],
  }),
  composioTool({
    name: "pandadoc_create_folder",
    description: "Creates a new folder in PandaDoc to organize documents. This action allows users to create a new folder with a specified name and optionally set a parent folder to create a nested folder structure.",
    toolSlug: "PANDADOC_CREATE_FOLDER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Document Folder.",
    ],
  }),
  composioTool({
    name: "pandadoc_create_or_update_contact",
    description: "This tool creates a new contact or updates an existing one in PandaDoc based on the email address. If a contact with the provided email exists, it will be updated; otherwise, a new contact will be created.",
    toolSlug: "PANDADOC_CREATE_OR_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or Update Contact.",
    ],
  }),
  composioTool({
    name: "pandadoc_create_template",
    description: "This tool allows users to create a new template in PandaDoc from a PDF file or from scratch. It handles file upload validation, parameter checks, proper error handling, and authentication with the PandaDoc API. The template can be created either by uploading a PDF file or by providing a structured content object that defines the template layout and elements.",
    toolSlug: "PANDADOC_CREATE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Template.",
    ],
  }),
  composioTool({
    name: "pandadoc_create_webhook",
    description: "Creates a new webhook subscription in PandaDoc to receive notifications about specific events. This action allows you to set up webhook notifications for various document-related events such as status changes, recipient completions, and updates. The webhook will send HTTP notifications to your specified endpoint when the configured events occur.",
    toolSlug: "PANDADOC_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create PandaDoc Webhook.",
    ],
  }),
  composioTool({
    name: "pandadoc_delete_contact",
    description: "This tool allows you to delete a contact from your PandaDoc account. The action is permanent and cannot be undone.",
    toolSlug: "PANDADOC_DELETE_CONTACT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "pandadoc_delete_template",
    description: "This tool deletes a specific template from PandaDoc. Once a template is deleted, it cannot be recovered. This action is permanent and should be used with caution.",
    toolSlug: "PANDADOC_DELETE_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Template.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "pandadoc_get_document_details",
    description: "Fetch detailed metadata for a specific PandaDoc document including recipients, fields/tokens values, pricing data, metadata, tags, and content-block names. Use this after discovering a document via list/search to inspect recipients/status/fields/metadata/content-block references for follow-up automation or reporting.",
    toolSlug: "PANDADOC_GET_DOCUMENT_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "pandadoc",
      "read",
      "documents",
    ],
  }),
  composioTool({
    name: "pandadoc_get_template_details",
    description: "This tool retrieves detailed information about a specific template by its ID. The endpoint returns comprehensive template details including metadata, content details, and sharing settings.",
    toolSlug: "PANDADOC_GET_TEMPLATE_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "pandadoc",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "pandadoc_list_contacts",
    description: "List all contacts in your PandaDoc workspace. Returns all contacts with their details including email, name, company, and contact information. Optionally filter by exact email address. Note: The API returns all contacts at once without pagination - filtering and pagination should be done client-side if needed.",
    toolSlug: "PANDADOC_LIST_CONTACTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "pandadoc",
      "read",
    ],
  }),
  composioTool({
    name: "pandadoc_list_document_folders",
    description: "This tool retrieves a list of all document folders in PandaDoc. It's a standalone action that doesn't require any external dependencies or resource IDs. The tool will return a list of folders containing documents, with each folder containing information about its ID, name, and parent folder relationship.",
    toolSlug: "PANDADOC_LIST_DOCUMENT_FOLDERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "pandadoc",
      "read",
    ],
  }),
  composioTool({
    name: "pandadoc_list_templates",
    description: "This tool retrieves a list of all templates available in the PandaDoc account. It supports parameters to filter templates by name, shared status, deleted status, pagination, and tag filtering, and returns detailed template information.",
    toolSlug: "PANDADOC_LIST_TEMPLATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "pandadoc",
      "read",
    ],
  }),
  composioTool({
    name: "pandadoc_move_document_to_folder",
    description: "This tool allows users to move a document to a specific folder within their PandaDoc account. It performs a POST request to move the document to the specified folder. Both the document and the destination folder must exist. Only documents in draft status can be moved; attempting to move documents in sent, completed, or other non-draft states will fail.",
    toolSlug: "PANDADOC_MOVE_DOCUMENT_TO_FOLDER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "pandadoc",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Document to Folder.",
    ],
  }),
];
