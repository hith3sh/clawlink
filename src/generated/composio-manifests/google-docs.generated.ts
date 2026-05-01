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
    integration: "google-docs",
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
      toolkit: "googledocs",
      toolSlug: partial.toolSlug,
      version: "20260430_00",
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "The title for the new copied document. If not provided, the title will be 'Copy of [original document's title]'.",
        },
        document_id: {
          type: "string",
          description: "The ID of the Google Document to be copied.",
        },
        include_shared_drives: {
          type: "boolean",
          description: "Whether to support copying documents from shared drives. Defaults to True.",
        },
      },
      required: [
        "document_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        text: {
          type: "string",
          description: "Optional initial text content to insert at the beginning of the new document. If not provided, an empty document will be created. For very large text (over 50,000 characters), the text will be inserted in chunks to avoid API limits.",
        },
        title: {
          type: "string",
          description: "Title for the new document, used as its filename in Google Drive.",
        },
      },
      required: [
        "title",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "The title for the new Google Docs document.",
        },
        markdown_text: {
          type: "string",
          description: "The initial content for the document, formatted as Markdown. Also accepts 'content' as an alias. CRITICAL TABLE LIMITATION: Only ONE table is allowed per call - multiple tables will be rejected due to a Google Docs API nesting limitation where subsequent tables become nested inside previous tables. To include multiple tables: create the document with the first table using this action, then use GOOGLEDOCS_UPDATE_DOCUMENT_SECTION_MARKDOWN to append each additional table separately. Supports: headings, lists (nested lists not supported), single table per call, images (via publicly accessible URLs, max 2KB URL length; formats: JPEG, PNG, GIF; SVG not supported), blockquotes, code blocks, hyperlinks (e.g., [text](url)), text formatting (bold, italic, etc.). If empty or omitted, creates document with title only.",
        },
      },
      required: [
        "title",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The type of footer to create.",
          enum: [
            "DEFAULT",
          ],
        },
        document_id: {
          type: "string",
          description: "The ID of the document to create the footer in.",
        },
        section_break_location: {
          type: "object",
          additionalProperties: true,
          properties: {
            index: {
              type: "integer",
              description: "The zero-based index, in UTF-16 code units, relative to the beginning of the segment.",
            },
            tabId: {
              type: "string",
              description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
            },
          },
          description: "The location of the SectionBreak immediately preceding the section whose SectionStyle this footer should belong to. If this is unset or refers to the first section break in the document, the footer applies to the document style.",
        },
      },
      required: [
        "document_id",
        "type",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            index: {
              type: "integer",
              description: "The zero-based index, in UTF-16 code units. The index is relative to the beginning of the segment specified by segment_id.",
            },
            tabId: {
              type: "string",
              description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
            },
          },
          description: "Inserts the footnote reference at a specific index in the document. The segmentId within this Location object must be empty as footnotes can only be inserted in the document body.",
        },
        documentId: {
          type: "string",
          description: "The ID of the document to create the footnote in.",
        },
        endOfSegmentLocation: {
          type: "object",
          additionalProperties: true,
          properties: {
            tabId: {
              type: "string",
              description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
            },
          },
          description: "Inserts the footnote reference at the end of the document body. The segmentId within this EndOfSegmentLocation object must be empty.",
        },
      },
      required: [
        "documentId",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        text: {
          type: "string",
          description: "Optional text content to add to the header after creation. If provided, the text will be inserted into the header at index 0.",
        },
        type: {
          type: "string",
          description: "The type of header to create. Use 'DEFAULT' for the standard document header. Only one DEFAULT header can exist per document; if one already exists, the existing header ID will be returned.",
          enum: [
            "HEADER_FOOTER_TYPE_UNSPECIFIED",
            "DEFAULT",
          ],
        },
        documentId: {
          type: "string",
          description: "The ID of the document to create the header in.",
        },
        sectionBreakLocation: {
          type: "object",
          additionalProperties: true,
          properties: {
            index: {
              type: "integer",
              description: "The zero-based index, in UTF-16 code units.",
            },
            tabId: {
              type: "string",
              description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
            },
          },
          description: "The location of the SectionBreak which begins the section this header should belong to. Only needed for section-specific headers.",
        },
      },
      required: [
        "documentId",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for the new named range. Must be 1-256 characters.",
        },
        documentId: {
          type: "string",
          description: "The ID of the document where the named range will be created.",
        },
        rangeEndIndex: {
          type: "integer",
          description: "The zero-based end index of the range.",
        },
        rangeSegmentId: {
          type: "string",
          description: "Optional. The ID of the header, footer, or footnote. Empty for document body.",
        },
        rangeStartIndex: {
          type: "integer",
          description: "The zero-based start index of the range.",
        },
      },
      required: [
        "documentId",
        "name",
        "rangeStartIndex",
        "rangeEndIndex",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        document_id: {
          type: "string",
          description: "The ID of the document to update.",
        },
        createParagraphBullets: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                endIndex: {
                  type: "integer",
                  description: "The zero-based end index of the range, exclusive.",
                },
                segmentId: {
                  type: "string",
                  description: "The ID of the header, footer, or footnote that this range is contained in. An empty segment ID signifies the document's body.",
                },
                startIndex: {
                  type: "integer",
                  description: "The zero-based start index of the range, inclusive.",
                },
              },
              description: "The range to apply the bullet preset to.",
            },
            bulletPreset: {
              type: "string",
              description: "The kinds of bullet glyphs to be used.",
              enum: [
                "BULLET_GLYPH_PRESET_UNSPECIFIED",
                "BULLET_DISC_CIRCLE_SQUARE",
                "BULLET_DIAMONDX_ARROW3D_SQUARE",
                "BULLET_CHECKBOX",
                "BULLET_ARROW_DIAMOND_DISC",
                "BULLET_STAR_CIRCLE_SQUARE",
                "BULLET_ARROW3D_CIRCLE_SQUARE",
                "BULLET_LEFTTRIANGLE_DIAMOND_DISC",
                "BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE",
                "BULLET_DIAMOND_CIRCLE_SQUARE",
                "NUMBERED_DECIMAL_ALPHA_ROMAN",
                "NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS",
                "NUMBERED_DECIMAL_NESTED",
                "NUMBERED_UPPERALPHA_ALPHA_ROMAN",
                "NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL",
                "NUMBERED_ZERODECIMAL_ALPHA_ROMAN",
              ],
            },
          },
          description: "The request body for creating paragraph bullets in the document.",
        },
      },
      required: [
        "document_id",
        "createParagraphBullets",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        range: {
          type: "object",
          additionalProperties: true,
          properties: {
            tabId: {
              type: "string",
              description: "The ID of the tab the range is in. When omitted, the request is applied to the first tab. In a document with a single tab, if provided, it must match the singular tab's ID; if omitted, it applies to the singular tab. In a multi-tab document, if provided, it applies to the specified tab; if omitted, it applies to the first tab.",
            },
            endIndex: {
              type: "integer",
              description: "The zero-based end index of the range, in UTF-16 code units, relative to the beginning of the segment. IMPORTANT: Every segment in Google Docs (body, header, footer, footnote) ends with a newline character ('\\n') that cannot be deleted. The endIndex must not include this final newline. For example, if the segment's last index is 368, set endIndex to 367 to avoid including the trailing newline.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer, or footnote the range is in. An empty segment ID or omitting this field signifies the document's body.",
            },
            startIndex: {
              type: "integer",
              description: "The zero-based start index of the range, in UTF-16 code units, relative to the beginning of the segment.",
            },
          },
          description: "The range of content to delete. Deleting text across paragraph boundaries may merge paragraphs and affect styles. Certain deletions can invalidate document structure (e.g., part of a surrogate pair, last newline of critical elements, incomplete deletion of tables/equations). IMPORTANT: The endIndex must not include the final newline character at the end of a segment (body, header, footer, footnote), as this newline cannot be deleted.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document from which to delete content. This ID can be found in the URL of the Google Doc.",
        },
      },
      required: [
        "document_id",
        "range",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tab_id: {
          type: "string",
          description: "The tab that contains the footer to delete. When omitted, the request is applied to the first tab.",
        },
        footer_id: {
          type: "string",
          description: "The ID of the footer to delete. Footer IDs are system-generated strings created by Google Docs. Obtain a valid footer ID from: (1) GOOGLEDOCS_CREATE_FOOTER response (footer_id field), or (2) GOOGLEDOCS_GET_DOCUMENT_BY_ID (footers dictionary keys). Do not use made-up or placeholder values. If this footer is defined on DocumentStyle, the reference to this footer is removed, resulting in no footer of that type for the first section of the document. If this footer is defined on a SectionStyle, the reference to this footer is removed and the footer of that type is now continued from the previous section.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to delete the footer from.",
        },
      },
      required: [
        "document_id",
        "footer_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tab_id: {
          type: "string",
          description: "The tab containing the header to delete. When omitted, the request is applied to the first tab.",
        },
        header_id: {
          type: "string",
          description: "The ID of the header to delete. If this header is defined on `DocumentStyle`, the reference to this header is removed, resulting in no header of that type for the first section of the document. If this header is defined on a `SectionStyle`, the reference to this header is removed and the header of that type is now continued from the previous section.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document from which to delete the header.",
        },
      },
      required: [
        "document_id",
        "header_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        document_id: {
          type: "string",
          description: "The ID of the document.",
        },
        deleteNamedRange: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The name of the range(s) to delete. All named ranges with the given name will be deleted.",
            },
            namedRangeId: {
              type: "string",
              description: "The ID of the named range to delete.",
            },
            tabsCriteria: {
              type: "object",
              additionalProperties: true,
              properties: {
                tabIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "The list of tab IDs in which the request executes.",
                },
              },
              description: "Optional. The criteria used to specify which tab(s) the range deletion should occur in. When omitted, the range deletion is applied to all tabs.",
            },
          },
          description: "Specifies the named range to delete.",
        },
      },
      required: [
        "document_id",
        "deleteNamedRange",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        range: {
          type: "object",
          additionalProperties: true,
          properties: {
            tabId: {
              type: "string",
              description: "The ID of the tab the range is in. If omitted, it applies to the first tab or the singular tab in a single-tab document.",
            },
            endIndex: {
              type: "integer",
              description: "The zero-based end index of the range, in UTF-16 code units, relative to the start of the segment.",
            },
            segmentId: {
              type: "string",
              description: "The ID of the header, footer, or footnote the range is in. An empty segment ID signifies the document's body.",
            },
            startIndex: {
              type: "integer",
              description: "The zero-based start index of the range, in UTF-16 code units, relative to the start of the segment.",
            },
          },
          description: "The range of the document from which to delete paragraph bullets. The range is applied to the document body by default. To specify a different segment (e.g. header, footer), include segment_id in the range object.",
        },
        tab_id: {
          type: "string",
          description: "The ID of the tab the range is in. If omitted, it applies to the first tab or the singular tab in a single-tab document.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to update.",
        },
      },
      required: [
        "document_id",
        "range",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        requests: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              deleteTableColumn: {
                type: "object",
                additionalProperties: true,
                properties: {
                  tableCellLocation: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      rowIndex: {
                        type: "integer",
                        description: "The zero-based row index. For example, the second row in the table has a row index of 1.",
                      },
                      columnIndex: {
                        type: "integer",
                        description: "The zero-based column index. For example, the second column in the table has a column index of 1.",
                      },
                      tableStartLocation: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          index: {
                            type: "integer",
                            description: "The zero-based index, in UTF-16 code units.",
                          },
                          tabId: {
                            type: "string",
                            description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
                          },
                          segmentId: {
                            type: "string",
                            description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
                          },
                        },
                        description: "The location where the table starts in the document.",
                      },
                    },
                    description: "The reference table cell location from which the column will be deleted.",
                  },
                },
                description: "The request to delete a table column from the document.",
              },
            },
          },
          description: "A list of requests to be applied to the document.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to delete the table column from.",
        },
      },
      required: [
        "document_id",
        "requests",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        documentId: {
          type: "string",
          description: "The ID of the document.",
        },
        tableCellLocation: {
          type: "object",
          additionalProperties: true,
          properties: {
            rowIndex: {
              type: "integer",
              description: "The zero-based row index. For example, the second row in the table has a row index of 1.",
            },
            columnIndex: {
              type: "integer",
              description: "The zero-based column index. For example, the second column in the table has a column index of 1.",
            },
            tableStartLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                index: {
                  type: "integer",
                  description: "The zero-based index, in UTF-16 code units. The index is relative to the beginning of the segment specified by segment_id.",
                },
                tabId: {
                  type: "string",
                  description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
                },
                segmentId: {
                  type: "string",
                  description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
                },
              },
              description: "The location where the table starts in the document.",
            },
          },
          description: "The reference table cell location from which the row will be deleted.",
        },
      },
      required: [
        "documentId",
        "tableCellLocation",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The ID of the Google Docs file to export as PDF. This is the same as the document ID for Google Docs files - typically a 44-character alphanumeric string. Extract it from a Google Docs URL: https://docs.google.com/document/d/{FILE_ID}/edit",
        },
        filename: {
          type: "string",
          description: "Optional suggested filename for the exported PDF (e.g., 'report.pdf'). If not provided, a default filename will be generated.",
        },
      },
      required: [
        "file_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier for a native Google Docs document (typically a 44-character alphanumeric string). Accepts either a document ID or a full Google Docs URL (e.g., https://docs.google.com/document/d/{DOCUMENT_ID}/edit). When a URL is provided, the document ID will be automatically extracted. IMPORTANT: This tool only works with native Google Docs documents (mimeType application/vnd.google-apps.document), not uploaded Office files (DOCX, XLSX, etc.) stored in Google Drive. Use GOOGLEDOCS_SEARCH_DOCUMENTS to find available documents.",
        },
      },
      required: [
        "id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        document_id: {
          type: "string",
          description: "The unique identifier for the Google Document. Accepts either a document ID (typically a 44-character alphanumeric string) or a full Google Docs URL. When a URL is provided, the document ID will be automatically extracted. Note: This parameter also accepts 'id' as an alias for consistency with other GOOGLEDOCS tools.",
        },
        include_tables: {
          type: "boolean",
          description: "Whether to include table content in the plain text output. Tables are rendered with configurable cell and row delimiters.",
        },
        include_footers: {
          type: "boolean",
          description: "Whether to include footer text in the plain text output. Footers are appended with a clear section separator.",
        },
        include_headers: {
          type: "boolean",
          description: "Whether to include header text in the plain text output. Headers are appended with a clear section separator.",
        },
        include_footnotes: {
          type: "boolean",
          description: "Whether to include footnote text in the plain text output. Footnotes are appended with a clear section separator.",
        },
        table_row_delimiter: {
          type: "string",
          description: "The delimiter to use between table rows (default: newline character).",
        },
        include_tabs_content: {
          type: "boolean",
          description: "When true, fetch the document using includeTabsContent=true query parameter to render all tabs. When false, only the main body content is rendered.",
        },
        table_cell_delimiter: {
          type: "string",
          description: "The delimiter to use between table cells (default: tab character).",
        },
      },
      required: [
        "document_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uri: {
          type: "string",
          description: "The URI of the image. Must be a publicly accessible direct image URL (no redirects or viewer links like Google Drive preview pages). Images must be less than 50MB, not exceed 25 megapixels, and be in PNG, JPEG, or GIF format (SVG not supported). The URI can be at most 2 kB in length.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            index: {
              type: "integer",
              description: "The zero-based index within the segment where the image will be inserted (required). Must be less than the current segment's end index. Use 1 to insert at the beginning of the document body. To insert at the end of a document, first retrieve the document to find its length, then use an index less than that length (e.g., if the document ends at index 720, use 719 or less).",
            },
            segmentId: {
              type: "string",
              description: "The ID of the segment where the image will be inserted. If not provided, the image is inserted in the document body.",
            },
          },
          description: "The location in the document to insert the image. The index field is required to specify the insertion point.",
        },
        documentId: {
          type: "string",
          description: "The ID of the document to update.",
        },
        objectSize: {
          type: "object",
          additionalProperties: true,
          properties: {
            width: {
              type: "object",
              additionalProperties: true,
              properties: {
                unit: {
                  type: "string",
                  description: "The units for magnitude. Supported units: EMU, PT (PX is not supported by the API).",
                  enum: [
                    "EMU",
                    "PT",
                  ],
                },
                magnitude: {
                  type: "number",
                  description: "The magnitude of the size.",
                },
              },
              description: "The width of the image.",
            },
            height: {
              type: "object",
              additionalProperties: true,
              properties: {
                unit: {
                  type: "string",
                  description: "The units for magnitude. Supported units: EMU, PT (PX is not supported by the API).",
                  enum: [
                    "EMU",
                    "PT",
                  ],
                },
                magnitude: {
                  type: "number",
                  description: "The magnitude of the size.",
                },
              },
              description: "The height of the image.",
            },
          },
          description: "The size of the image. If not specified, the image is rendered at its intrinsic size.",
        },
      },
      required: [
        "documentId",
        "uri",
        "location",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        documentId: {
          type: "string",
          description: "The ID of the document to update.",
        },
        insertPageBreak: {
          type: "object",
          additionalProperties: true,
          properties: {
            location: {
              type: "object",
              additionalProperties: true,
              properties: {
                index: {
                  type: "integer",
                  description: "The zero-based index, in UTF-16 code units. The page break is inserted before this index.",
                },
                segmentId: {
                  type: "string",
                  description: "The ID of the segment where the page break is to be inserted. For page breaks, this should typically be null or empty, indicating the main document body, as page breaks are not allowed in headers, footers, or footnotes.",
                },
              },
              description: "Insert the page break at a specific zero-based index. Provide EXACTLY ONE of `location` or `endOfSegmentLocation` — NEVER both, and NEVER neither. If you set this field, you MUST omit `endOfSegmentLocation` entirely (do not include the key).",
            },
            endOfSegmentLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                segmentId: {
                  type: "string",
                  description: "The ID of the segment where the page break is to be inserted. For page breaks, this must be null or an empty string, indicating the end of the main document body.",
                },
              },
              description: "Insert the page break at the end of the document body. Provide EXACTLY ONE of `location` or `endOfSegmentLocation` — NEVER both, and NEVER neither. If you set this field, you MUST omit `location` entirely (do not include the key).",
            },
          },
          description: "Where to insert the page break. This object MUST contain EXACTLY ONE of the keys `location` (insert at a specific index) or `endOfSegmentLocation` (insert at end of document body) — never both keys, and never neither. Including both keys will cause the request to fail validation.",
        },
      },
      required: [
        "documentId",
        "insertPageBreak",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rows: {
          type: "integer",
          description: "The number of rows in the table.",
        },
        index: {
          type: "integer",
          description: "The zero-based index where the table will be inserted, in UTF-16 code units. IMPORTANT: The index must be strictly less than the segment's end index (you cannot insert at the exact end position using an index). To insert at the end of a segment, omit this parameter and set 'insertAtEndOfSegment' to true instead. If provided, 'location' will be used. If omitted and 'insertAtEndOfSegment' is false or omitted, 'endOfSegmentLocation' will be used for the document body.",
        },
        tabId: {
          type: "string",
          description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
        },
        columns: {
          type: "integer",
          description: "The number of columns in the table.",
        },
        segmentId: {
          type: "string",
          description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
        },
        documentId: {
          type: "string",
          description: "The ID of the document to update.",
        },
        insertAtEndOfSegment: {
          type: "boolean",
          description: "If true, inserts the table at the end of the segment (document body, header, or footer specified by segment_id). This is the recommended way to append content to the end of a segment, as using an index equal to the segment's end position will fail. If false or omitted, and 'index' is not provided, it defaults to inserting at the end of the document body. If 'index' is provided, this field is ignored.",
        },
      },
      required: [
        "documentId",
        "rows",
        "columns",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        requests: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              insertTableColumn: {
                type: "object",
                additionalProperties: true,
                properties: {
                  insertRight: {
                    type: "boolean",
                    description: "Whether to insert new column to the right of the reference cell location. True: insert to the right. False: insert to the left.",
                  },
                  tableCellLocation: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      rowIndex: {
                        type: "integer",
                        description: "The zero-based row index of the reference cell.",
                      },
                      columnIndex: {
                        type: "integer",
                        description: "The zero-based column index of the reference cell.",
                      },
                      tableStartLocation: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          index: {
                            type: "integer",
                            description: "The zero-based index where the table starts in the document, in UTF-16 code units. This is required to identify which table to modify. You can find this value by using GOOGLEDOCS_GET_DOCUMENT_BY_ID and locating the 'startIndex' of the table element.",
                          },
                          tabId: {
                            type: "string",
                            description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
                          },
                          segmentId: {
                            type: "string",
                            description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
                          },
                        },
                        description: "The location where the table starts in the document. This is required and must include the index of where the table begins.",
                      },
                    },
                    description: "The reference table cell location from which columns will be inserted.",
                  },
                },
                description: "The request to insert a table column in the document.",
              },
            },
          },
          description: "A list of insert table column requests. Multiple requests can be sent in a single call to insert columns at different locations in the document.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to update.",
        },
      },
      required: [
        "document_id",
        "requests",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        segment_id: {
          type: "string",
          description: "The ID of the header, footer or footnote to insert text into. Leave empty or omit to insert into the document body. Works with both append_to_end and insertion_index modes.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to insert text into.",
        },
        append_to_end: {
          type: "boolean",
          description: "Set to true to append text to the end of the document body. When true, the 'insertion_index' parameter is ignored. This is the recommended way to add text at the end of a document as it avoids index boundary issues.",
        },
        text_to_insert: {
          type: "string",
          description: "The string of text to insert. Alternatively, you can provide this as 'text'.",
        },
        insertion_index: {
          type: "integer",
          description: "The zero-based UTF-16 code unit index where text will be inserted. Alternatively, you can provide this as 'index'. CRITICAL CONSTRAINTS: (1) The index MUST fall within the bounds of an EXISTING paragraph - you cannot insert at arbitrary indices or at structural boundaries like table starts. (2) The index MUST be strictly less than the document's end index. Index 1 is the minimum valid index and is safe for inserting at the document start. To determine valid indices, first retrieve the document structure using GOOGLEDOCS_GET_DOCUMENT_BY_ID to identify paragraph boundaries. For safely adding text without index concerns, set 'append_to_end' to true instead. Either 'insertion_index' or 'append_to_end' must be provided.",
        },
      },
      required: [
        "document_id",
        "text_to_insert",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        spreadsheet_id: {
          type: "string",
          description: "The ID of the Google Sheets spreadsheet from which to retrieve charts.",
        },
      },
      required: [
        "spreadsheet_id",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tab_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional. A list of specific tab IDs to perform the replacement on. If not provided, replacement occurs on all tabs.",
        },
        find_text: {
          type: "string",
          description: "The text to search for in the document. Cannot be empty.",
        },
        match_case: {
          type: "boolean",
          description: "Indicates whether the search should be case sensitive. Defaults to False (case insensitive).",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to update.",
        },
        replace_text: {
          type: "string",
          description: "The text that will replace the matched text.",
        },
        search_by_regex: {
          type: "boolean",
          description: "Optional. If True, the find_text is treated as a regular expression. Defaults to False.",
        },
      },
      required: [
        "document_id",
        "find_text",
        "replace_text",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        document_id: {
          type: "string",
          description: "The ID of the document containing the image to replace.",
        },
        replace_image: {
          type: "object",
          additionalProperties: true,
          properties: {
            uri: {
              type: "string",
              description: "The URI of the new image. The image is fetched once at insertion time and a copy is stored for display inside the document. Images must be less than 50MB in size, cannot exceed 25 megapixels, and must be in one of PNG, JPEG, or GIF format. The provided URI must be publicly accessible and at most 2 kB in length. The URI itself is saved with the image, and exposed via the ImageProperties.content_uri field.",
            },
            tab_id: {
              type: "string",
              description: "The tab that the image to be replaced is in. When omitted, the request is applied to the first tab.",
            },
            image_object_id: {
              type: "string",
              description: "The ID of the existing image that will be replaced. The ID can be retrieved from the response of a get request.",
            },
            image_replace_method: {
              type: "string",
              description: "The replacement method. Defaults to CENTER_CROP if not specified.",
              enum: [
                "CENTER_CROP",
                "IMAGE_REPLACE_METHOD_UNSPECIFIED",
              ],
            },
          },
          description: "The details of the image replacement request.",
        },
      },
      required: [
        "document_id",
        "replace_image",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Search query to filter documents. Provide either: (1) Plain text to search in document content (e.g., 'quarterly report'), which will search fullText, or (2) Drive API query syntax with operators like 'name contains', 'fullText contains', combined with 'and', 'or', 'not'. Leave empty to get all documents.",
        },
        order_by: {
          type: "string",
          description: "Order results by field. Common options: 'modifiedTime desc', 'modifiedTime asc', 'name', 'createdTime desc'",
        },
        page_token: {
          type: "string",
          description: "Token for continuing a previous search request on the next page. Use the next_page_token from the previous response to retrieve additional results.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of documents to return per page (1-100). Defaults to 10. Use page_token for pagination when more results are available.",
        },
        starred_only: {
          type: "boolean",
          description: "Whether to return only starred documents. Defaults to False.",
        },
        created_after: {
          type: "string",
          description: "Return documents created after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'.",
        },
        modified_after: {
          type: "string",
          description: "Return documents modified after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'.",
        },
        shared_with_me: {
          type: "boolean",
          description: "Whether to return only documents shared with the current user. Defaults to False.",
        },
        include_trashed: {
          type: "boolean",
          description: "Whether to include documents in trash. Defaults to False.",
        },
        include_shared_drives: {
          type: "boolean",
          description: "Whether to include documents from shared drives you have access to. Defaults to True.",
        },
      },
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        documentId: {
          type: "string",
          description: "The ID of the document to unmerge table cells in.",
        },
        tableRange: {
          type: "object",
          additionalProperties: true,
          properties: {
            rowSpan: {
              type: "integer",
              description: "The row span of the table range.",
            },
            columnSpan: {
              type: "integer",
              description: "The column span of the table range.",
            },
            tableCellLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                rowIndex: {
                  type: "integer",
                  description: "The zero-based row index. For example, the second row in the table has a row index of 1.",
                },
                columnIndex: {
                  type: "integer",
                  description: "The zero-based column index. For example, the second column in the table has a column index of 1.",
                },
                tableStartLocation: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    index: {
                      type: "integer",
                      description: "The zero-based index, in UTF-16 code units.",
                    },
                    tabId: {
                      type: "string",
                      description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
                    },
                    segmentId: {
                      type: "string",
                      description: "The ID of the header, footer or footnote the table is in. An empty segment ID signifies the document's body.",
                    },
                  },
                  description: "The location where the table starts in the document. Required to identify which table contains the cells to unmerge.",
                },
              },
              description: "The cell location where the table range starts.",
            },
          },
          description: "The table range specifying which cells of the table to unmerge.",
        },
      },
      required: [
        "documentId",
        "tableRange",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier for the Google Docs document to update. Accepts either a document ID (alphanumeric string, length varies by document age - newer documents typically have 44-character IDs) or a full Google Docs URL (e.g., https://docs.google.com/document/d/{DOCUMENT_ID}/edit). When a URL is provided, the document ID will be automatically extracted.",
        },
        markdown: {
          type: "string",
          description: "Markdown content that will replace the document's entire existing content. Supports standard Markdown features.",
        },
      },
      required: [
        "id",
        "markdown",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_index: {
          type: "integer",
          description: "Optional one-based end index of the content to replace (exclusive); must be greater than or equal to start_index. If end_index is not provided, the content is inserted at the start_index without replacing existing content. Requires start_index to be provided - if start_index is omitted (append mode), end_index is ignored. Important: Use the exact indices from GOOGLEDOCS_GET_DOCUMENT_BY_ID without modification. The Google Docs API does not allow deleting the last newline character of a document segment (body, header, footer, etc.), so ensure end_index does not include the final segment newline.",
        },
        document_id: {
          type: "string",
          description: "The unique ID of the Google Docs document to update. This is the alphanumeric string found in the document URL: https://docs.google.com/document/d/{DOCUMENT_ID}/edit. Valid IDs are typically 44 characters long and contain only letters, numbers, hyphens, and underscores (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). To get a document ID: create a new document using GOOGLEDOCS_CREATE_DOCUMENT, or extract it from an existing document's URL. Also accepts parameter aliases: 'id', 'doc_id', 'documentId', or 'docId'.",
        },
        start_index: {
          type: "integer",
          description: "One-based UTF-16 code unit index where to insert or start replacement. If not provided, content will be appended to the end of the document. Use 1 to insert at the very beginning of the document. To insert at a specific position, first use GOOGLEDOCS_GET_DOCUMENT_BY_ID to retrieve the document structure and find the desired index from the body.content elements' start_index/end_index values. If the provided index equals or exceeds the document segment's end index, it will be automatically adjusted to the last valid position (end_index - 1) and a message will be included in the response.",
        },
        markdown_text: {
          type: "string",
          description: "Markdown content to insert or replace in the document section. Large content is automatically split into smaller batches to avoid API limits. Also accepts 'markdown', 'content', 'text', 'body', 'markdownText', or 'markdown_content'.",
        },
      },
      required: [
        "document_id",
        "markdown_text",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "A comma-separated list of fields to update (using camelCase API names like 'marginTop', 'pageSize'). Use '*' to automatically update only fields that have values set in document_style. For example: \"pageSize,marginTop,marginBottom\". When '*' is specified, the action automatically computes the field mask from the provided document_style fields.",
        },
        tab_id: {
          type: "string",
          description: "The ID of the tab to update the style for. If not provided, the first tab is used.",
        },
        document_id: {
          type: "string",
          description: "The ID of the document to update.",
        },
        document_style: {
          type: "object",
          additionalProperties: true,
          properties: {
            pageSize: {
              type: "object",
              additionalProperties: true,
              description: "The size of a page in the document.",
            },
            marginTop: {
              type: "object",
              additionalProperties: true,
              description: "The top margin of the page.",
            },
            background: {
              type: "object",
              additionalProperties: true,
              description: "The background of the document. Documents cannot have a transparent background color. Structure: {'color': {'color': {'rgbColor': {'red': float, 'green': float, 'blue': float}}}}. RGB values should be between 0.0 and 1.0.",
            },
            marginLeft: {
              type: "object",
              additionalProperties: true,
              description: "The left margin of the page.",
            },
            marginRight: {
              type: "object",
              additionalProperties: true,
              description: "The right margin of the page.",
            },
            marginBottom: {
              type: "object",
              additionalProperties: true,
              description: "The bottom margin of the page.",
            },
            marginFooter: {
              type: "object",
              additionalProperties: true,
              description: "The footer margin of the page (distance from bottom of page to footer content).",
            },
            marginHeader: {
              type: "object",
              additionalProperties: true,
              description: "The header margin of the page (distance from top of page to header content).",
            },
            documentFormat: {
              type: "object",
              additionalProperties: true,
              properties: {
                documentMode: {
                  type: "string",
                  description: "Document mode enum for Google Docs API.",
                  enum: [
                    "PAGES",
                    "PAGELESS",
                  ],
                },
              },
              description: "Document-level format settings.",
            },
            defaultFooterId: {
              type: "string",
              description: "The ID of the default footer. If unset, the document inherits the default footer from the parent document. This property is read-only.",
            },
            defaultHeaderId: {
              type: "string",
              description: "The ID of the default header. If unset, the document inherits the default header from the parent document. This property is read-only.",
            },
            oddPageFooterId: {
              type: "string",
              description: "The ID of the footer for odd pages. If unset, the document inherits the odd page footer from the parent document. This property is read-only.",
            },
            oddPageHeaderId: {
              type: "string",
              description: "The ID of the header for odd pages. If unset, the document inherits the odd page header from the parent document. This property is read-only.",
            },
            pageNumberStart: {
              type: "integer",
              description: "The page number from which to start counting the number of pages.",
            },
            evenPageFooterId: {
              type: "string",
              description: "The ID of the footer for even pages. If unset, the document inherits the even page footer from the parent document. This property is read-only.",
            },
            evenPageHeaderId: {
              type: "string",
              description: "The ID of the header for even pages. If unset, the document inherits the even page header from the parent document. This property is read-only.",
            },
            useEvenPageHeaderFooter: {
              type: "boolean",
              description: "Indicates whether to use the even page header / footer, used in conjunction with use_first_page_header_footer.",
            },
            useFirstPageHeaderFooter: {
              type: "boolean",
              description: "Indicates whether to use the first page header / footer.",
            },
          },
          description: "The DocumentStyle object with the new style settings.",
        },
      },
      required: [
        "document_id",
        "document_style",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        edit_docs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "(Required) A list of requests to execute on the document. Each request must be a dict containing exactly ONE of the valid request types listed below.\n\nCommon request types:\nreplaceAllText, insertText, updateTextStyle, createParagraphBullets, deleteParagraphBullets, createNamedRange, deleteNamedRange, updateParagraphStyle, deleteContentRange, insertInlineImage, insertTable, insertTableRow, insertTableColumn, deleteTableRow, deleteTableColumn, insertPageBreak, deletePositionedObject, updateTableColumnProperties, updateTableCellStyle, updateTableRowStyle, replaceImage, updateDocumentStyle, mergeTableCells, unmergeTableCells, createHeader, createFooter, createFootnote, replaceNamedRangeContent, updateSectionStyle, insertSectionBreak, deleteHeader, deleteFooter, pinTableHeaderRows, addDocumentTab, deleteTab, updateDocumentTabProperties, insertPerson.\n\nDo NOT use request types from other Google APIs (Slides, Sheets, etc.).\nFor full request schemas, see https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate.\n\nSEGMENT IDs: Use empty string \"\" for document body, or a header/footer/footnote ID from the document. Internal 'kix.' IDs are NOT valid segment IDs and will cause \"Segment with ID ... was not found\" errors. Call GOOGLEDOCS_GET_DOCUMENT_BY_ID to get valid IDs.\n\nTAB IDs: When omitted, operations target the first tab. Invalid tab IDs cause errors. Get valid tab IDs from GOOGLEDOCS_GET_DOCUMENT_BY_ID at tabs[].tabProperties.tabId.\n\nBATCH INSERT OPERATIONS: Operations execute sequentially. Each insertText shifts subsequent indices. For multiple inserts at specific positions, process in REVERSE index order (highest first). For appending, use endOfSegmentLocation for each insert. Auto-correction: insertText without location/endOfSegmentLocation automatically appends to document body.\n\nINDEX BOUNDARIES: location.index must be LESS than the segment end index (valid: 1 to N-1). To insert at the end, use endOfSegmentLocation instead.\n\nPARAGRAPH BOUNDARIES: Text can only be inserted inside existing paragraphs, not at structural boundaries (e.g., a table's start index). For table cells, add +1 or +2 to the cell's startIndex.\n\ndeleteContentRange: The range CANNOT include the trailing newline at segment end. If segment ends at N, use endIndex: N-1.\n\ndeleteTableRow: Requires tableCellLocation object (NOT top-level rowIndex/tableStartLocation). Structure: { tableCellLocation: { tableStartLocation: { index: N }, rowIndex: R, columnIndex: C } }.\n\nupdateTableCellStyle: Use EITHER tableStartLocation (all cells) OR tableRange (specific cells), not both.\n\nStyle updates (updateParagraphStyle, updateTextStyle, updateTableCellStyle, updateDocumentStyle): The 'fields' parameter is auto-populated from style keys if omitted.\n\nDocument title CANNOT be updated via batchUpdate - use Google Drive API instead.\n\nupdateDocumentStyle valid fields: background, marginTop, marginBottom, marginLeft, marginRight, marginHeader, marginFooter, pageSize, pageNumberStart, useEvenPageHeaderFooter, useFirstPageHeaderFooter, flipPageOrientation (NOT \"title\").",
        },
        document_id: {
          type: "string",
          description: "(Required) The unique identifier of the Google Docs document to be updated.",
        },
      },
      required: [
        "document_id",
        "edit_docs",
      ],
    },
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
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        documentId: {
          type: "string",
          description: "The ID of the document to update.",
        },
        updateTableRowStyle: {
          type: "object",
          additionalProperties: true,
          properties: {
            fields: {
              type: "string",
              description: "The fields that should be updated. At least one field must be specified. The root tableRowStyle is implied and should not be specified. A single \"*\" can be used as short-hand for listing every field. For example to update the minimum row height, set fields to \"minRowHeight\".",
            },
            rowIndices: {
              type: "array",
              items: {
                type: "integer",
              },
              description: "The list of zero-based row indices whose style should be updated. If no indices are specified, all rows will be updated.",
            },
            tableRowStyle: {
              type: "object",
              additionalProperties: true,
              properties: {
                minRowHeight: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    unit: {
                      type: "string",
                      description: "The units for magnitude.",
                      enum: [
                        "PT",
                        "UNIT_UNSPECIFIED",
                      ],
                    },
                    magnitude: {
                      type: "number",
                      description: "The magnitude.",
                    },
                  },
                  description: "The minimum height of the row. The row will be rendered in the Docs editor at a height equal to or greater than this value in order to show all the content in the row's cells.",
                },
                preventOverflow: {
                  type: "boolean",
                  description: "Whether the row cannot overflow across page or column boundaries.",
                },
              },
              description: "The styles to be set on the rows.",
            },
            tableStartLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                index: {
                  type: "integer",
                  description: "The zero-based index, in UTF-16 code units.",
                },
                tabId: {
                  type: "string",
                  description: "The tab that the location is in. When omitted, the request is applied to the first tab.",
                },
                segmentId: {
                  type: "string",
                  description: "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
                },
              },
              description: "The location where the table starts in the document.",
            },
          },
          description: "The request body for updating the table row style.",
        },
      },
      required: [
        "documentId",
        "updateTableRowStyle",
      ],
    },
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
