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
    integration: "google-docs",
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
      toolkit: "googledocs",
      toolSlug: partial.toolSlug,
      version: "20260501_01",
    },
  };
}

export const googleDocsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googledocs_copy_document",
    description: "Tool to create a copy of an existing Google Document. Use this to duplicate a document, for example, when using an existing document as a template. The copied document will have a default title (e.g., 'Copy of [original title]') if no new title is provided, and will be placed in the user's root Google Drive folder.",
    toolSlug: "GOOGLEDOCS_COPY_DOCUMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "documents",
      "copy",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy Google Document.",
    ],
  }),
  composioTool({
    name: "googledocs_create_document",
    description: "Creates a new Google Docs document using the provided title as filename and inserts the initial text at the beginning if non-empty, returning the document's ID and metadata (excluding body content).",
    toolSlug: "GOOGLEDOCS_CREATE_DOCUMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a document.",
    ],
  }),
  composioTool({
    name: "googledocs_create_document_markdown",
    description: "Creates a new Google Docs document, optionally initializing it with a title and content provided as Markdown text.",
    toolSlug: "GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Document Markdown.",
    ],
  }),
  composioTool({
    name: "googledocs_create_footer",
    description: "Tool to create a new footer in a Google Document. Use when you need to add a footer, optionally specifying its type and the section it applies to.",
    toolSlug: "GOOGLEDOCS_CREATE_FOOTER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
      "footer",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Footer.",
    ],
  }),
  composioTool({
    name: "googledocs_create_footnote",
    description: "Tool to create a new footnote in a Google Document. Use this when you need to add a footnote at a specific location or at the end of the document body.",
    toolSlug: "GOOGLEDOCS_CREATE_FOOTNOTE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Footnote.",
    ],
  }),
  composioTool({
    name: "googledocs_create_header",
    description: "Tool to create a new header in a Google Document, optionally with text content. Use this tool when you need to add a header to a document. You can provide: - document_id: The ID of the document (required) - type: The header type (DEFAULT is the standard header) - text: Optional text content to add to the header - section_break_location: Optional location for section-specific headers",
    toolSlug: "GOOGLEDOCS_CREATE_HEADER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Header.",
    ],
  }),
  composioTool({
    name: "googledocs_create_named_range",
    description: "Tool to create a new named range in a Google Document. Use this to assign a name to a specific part of the document for easier reference or programmatic manipulation.",
    toolSlug: "GOOGLEDOCS_CREATE_NAMED_RANGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "documents",
      "ranges",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Named Range.",
    ],
  }),
  composioTool({
    name: "googledocs_create_paragraph_bullets",
    description: "Tool to add bullets to paragraphs within a specified range in a Google Document. Use when you need to format a list or a set of paragraphs as bullet points.",
    toolSlug: "GOOGLEDOCS_CREATE_PARAGRAPH_BULLETS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Paragraph Bullets.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_content_range",
    description: "Tool to delete a range of content from a Google Document. Use when you need to remove a specific portion of text or other structural elements within a document. Note: Every segment (body, header, footer, footnote) in Google Docs ends with a final newline character that cannot be deleted. Ensure the endIndex does not include this trailing newline.",
    toolSlug: "GOOGLEDOCS_DELETE_CONTENT_RANGE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "document",
      "content",
      "delete",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Content Range in Document.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_footer",
    description: "Tool to delete a footer from a Google Document. Use when you need to remove a footer from a specific section or the default footer.",
    toolSlug: "GOOGLEDOCS_DELETE_FOOTER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
      "footer",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Footer.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_header",
    description: "Deletes the header from the specified section or the default header if no section is specified. Use this tool to remove a header from a Google Document.",
    toolSlug: "GOOGLEDOCS_DELETE_HEADER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
      "header",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Header.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_named_range",
    description: "Tool to delete a named range from a Google Document. Use when you need to remove a previously defined named range by its ID or name.",
    toolSlug: "GOOGLEDOCS_DELETE_NAMED_RANGE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
      "delete",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Named Range.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_paragraph_bullets",
    description: "Tool to remove bullets from paragraphs within a specified range in a Google Document. Use when you need to clear bullet formatting from a section of a document.",
    toolSlug: "GOOGLEDOCS_DELETE_PARAGRAPH_BULLETS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "document",
      "edit",
    ],
    askBefore: [
      "Confirm the parameters before executing Delete Paragraph Bullets.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_table_column",
    description: "Tool to delete a column from a table in a Google Document. Use this tool when you need to remove a specific column from an existing table within a document.",
    toolSlug: "GOOGLEDOCS_DELETE_TABLE_COLUMN",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "table",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Table Column.",
    ],
  }),
  composioTool({
    name: "googledocs_delete_table_row",
    description: "Tool to delete a row from a table in a Google Document. Use when you need to remove a specific row from an existing table.",
    toolSlug: "GOOGLEDOCS_DELETE_TABLE_ROW",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-docs",
      "write",
      "table",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Table Row.",
    ],
  }),
  composioTool({
    name: "googledocs_export_document_as_pdf",
    description: "Tool to export a Google Docs file as PDF using the Google Drive API. Use when you need to generate a PDF version of a Google Docs document for download or distribution. Note: Google Drive enforces a 10MB limit on export content.",
    toolSlug: "GOOGLEDOCS_EXPORT_DOCUMENT_AS_PDF",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-docs",
      "read",
      "export",
    ],
  }),
  composioTool({
    name: "googledocs_get_document_by_id",
    description: "Retrieves an existing Google Document by its ID; will error if the document is not found.",
    toolSlug: "GOOGLEDOCS_GET_DOCUMENT_BY_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-docs",
      "read",
    ],
  }),
  composioTool({
    name: "googledocs_get_document_plaintext",
    description: "Retrieve a Google Doc by ID and return a best-effort plain-text rendering. Converts document structure into plain text including paragraphs, lists, and tables without requiring clients to traverse complex Docs API JSON.",
    toolSlug: "GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-docs",
      "read",
      "document",
    ],
  }),
  composioTool({
    name: "googledocs_insert_inline_image",
    description: "Tool to insert an image from a given URI at a specified location in a Google Document as an inline image. Use when you need to add an image to a document programmatically.",
    toolSlug: "GOOGLEDOCS_INSERT_INLINE_IMAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "document",
      "image",
      "insert",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Inline Image.",
    ],
  }),
  composioTool({
    name: "googledocs_insert_page_break",
    description: "Tool to insert a page break into a Google Document. Use when you need to start new content on a fresh page, such as at the end of a chapter or section.",
    toolSlug: "GOOGLEDOCS_INSERT_PAGE_BREAK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "document",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Page Break.",
    ],
  }),
  composioTool({
    name: "googledocs_insert_table_action",
    description: "Tool to insert a table into a Google Document. Use when you need to add a new table at a specific location or at the end of a segment (like document body, header, or footer) in a document.",
    toolSlug: "GOOGLEDOCS_INSERT_TABLE_ACTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "table",
      "insert",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Table in Google Doc.",
    ],
  }),
  composioTool({
    name: "googledocs_insert_table_column",
    description: "Tool to insert a new column into a table in a Google Document. Use this tool when you need to add a column to an existing table at a specific location.",
    toolSlug: "GOOGLEDOCS_INSERT_TABLE_COLUMN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "table",
      "column",
      "insert",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Table Column.",
    ],
  }),
  composioTool({
    name: "googledocs_insert_text_action",
    description: "Tool to insert a string of text at a specified location within a Google Document. Use when you need to add new text content to an existing document. IMPORTANT: Two ways to specify insertion location: 1. Use 'insertion_index' to insert at a specific position (index 1 is safe for document start) 2. Use 'append_to_end=true' to append text to the end of the document (recommended for appending) CRITICAL CONSTRAINT: When using insertion_index, the index MUST fall within the bounds of an EXISTING paragraph. You cannot insert text at arbitrary indices or at structural boundaries (e.g., table starts). The index must also be strictly less than the document's end index. To safely append text without index concerns, use append_to_end=true.",
    toolSlug: "GOOGLEDOCS_INSERT_TEXT_ACTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "documents",
      "text",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Text into Document.",
    ],
  }),
  composioTool({
    name: "googledocs_list_spreadsheet_charts",
    description: "Tool to retrieve a list of all charts from a specified Google Sheets spreadsheet. Use when you need to get chart IDs and their specifications for embedding or referencing elsewhere, such as in Google Docs.",
    toolSlug: "GOOGLEDOCS_LIST_SPREADSHEET_CHARTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-docs",
      "read",
      "googlesheets",
      "charts",
    ],
  }),
  composioTool({
    name: "googledocs_replace_all_text",
    description: "Tool to replace all occurrences of a specified text string with another text string throughout a Google Document. Use when you need to perform a global find and replace operation within a document.",
    toolSlug: "GOOGLEDOCS_REPLACE_ALL_TEXT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "text",
    ],
    askBefore: [
      "Confirm the parameters before executing Replace All Text in Document.",
    ],
  }),
  composioTool({
    name: "googledocs_replace_image",
    description: "Tool to replace a specific image in a document with a new image from a URI. Use when you need to update an existing image within a Google Doc.",
    toolSlug: "GOOGLEDOCS_REPLACE_IMAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "document",
      "image",
    ],
    askBefore: [
      "Confirm the parameters before executing Replace Image in Document.",
    ],
  }),
  composioTool({
    name: "googledocs_search_documents",
    description: "Search for Google Documents using various filters including name, content, date ranges, and more.",
    toolSlug: "GOOGLEDOCS_SEARCH_DOCUMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-docs",
      "read",
      "find",
      "query",
      "search",
    ],
  }),
  composioTool({
    name: "googledocs_unmerge_table_cells",
    description: "Tool to unmerge previously merged cells in a table. Use this when you need to revert merged cells in a Google Document table back to their individual cell states.",
    toolSlug: "GOOGLEDOCS_UNMERGE_TABLE_CELLS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "table",
      "unmerge",
    ],
    askBefore: [
      "Confirm the parameters before executing Unmerge Table Cells.",
    ],
  }),
  composioTool({
    name: "googledocs_update_document_markdown",
    description: "Replaces the entire content of an existing Google Docs document with new Markdown text; requires edit permissions for the document.",
    toolSlug: "GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Document Markdown.",
    ],
  }),
  composioTool({
    name: "googledocs_update_document_section_markdown",
    description: "Tool to insert or replace a section of a Google Docs document with Markdown content. Use when you need to update only a section of a document by specifying start and optional end indices. Supports full Markdown formatting.",
    toolSlug: "GOOGLEDOCS_UPDATE_DOCUMENT_SECTION_MARKDOWN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Document Section Markdown.",
    ],
  }),
  composioTool({
    name: "googledocs_update_document_style",
    description: "Tool to update the overall document style, such as page size, margins, and default text direction. Use when you need to modify the global style settings of a Google Document.",
    toolSlug: "GOOGLEDOCS_UPDATE_DOCUMENT_STYLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
      "documents",
      "style",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Document Style.",
    ],
  }),
  composioTool({
    name: "googledocs_update_existing_document",
    description: "Applies programmatic edits, such as text insertion, deletion, or formatting, to a specified Google Doc using the `batchUpdate` API method.",
    toolSlug: "GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update existing document.",
    ],
  }),
  composioTool({
    name: "googledocs_update_table_row_style",
    description: "Tool to update the style of a table row in a Google Document. Use when you need to modify the appearance of specific rows within a table, such as setting minimum row height or marking rows as headers.",
    toolSlug: "GOOGLEDOCS_UPDATE_TABLE_ROW_STYLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-docs",
      "write",
      "googledocs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Table Row Style.",
    ],
  }),
];
