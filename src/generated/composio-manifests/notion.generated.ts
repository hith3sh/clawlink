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
    integration: "notion",
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
      toolkit: "notion",
      toolSlug: partial.toolSlug,
      version: "20260430_00",
    },
  };
}

export const notionComposioTools: IntegrationTool[] = [
  composioTool({
    name: "notion_add_multiple_page_content",
    description: "Bulk-add content blocks to Notion. Text >2000 chars auto-splits. Parses markdown formatting. ⚠️ PARENT BLOCK TYPES: Content is added AS CHILDREN of parent_block_id. - To add content AFTER a heading, use PAGE ID as parent + heading ID in 'after' param. - Headings CANNOT have children unless is_toggleable=True. Simplified format: {'content': 'text', 'block_property': 'paragraph'} Full format for code: {'type': 'code', 'code': {'rich_text': [...], 'language': 'python'}} Array format also supported (auto-normalized): [{\"parent_block_id\": \"...\"}, {block1}, {block2}] => proper request structure",
    toolSlug: "NOTION_ADD_MULTIPLE_PAGE_CONTENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Block ID to insert content AFTER (as siblings). Use this to add content after a heading: set parent_block_id to the PAGE ID and 'after' to the HEADING block ID. The new blocks appear immediately after this block at the same nesting level. If omitted, blocks are appended to the end of the parent's children list.",
        },
        content_blocks: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              content_block: {
                type: "string",
                description: "Flattened NotionRichText schema with 'content' (required for text blocks) and 'block_property' (block type), OR a full Notion block dict with 'type' and properties, OR a hybrid format with 'content' as Notion rich_text array and 'block_property' for block type. For code blocks, use the full Notion format: {'type': 'code', 'code': {...}}.",
              },
            },
            description: "Represents a single content block that can be added to a Notion page.",
          },
          description: "⚠️ CRITICAL: Notion API enforces 2000 char limit per text.content field. Content >2000 chars auto-splits.\nList of blocks to add (max 100). Each item can be in EITHER format:\nA) Unwrapped (recommended): {'content': 'text', 'block_property': 'paragraph'}\nB) Wrapped: {'content_block': {'content': 'text', 'block_property': 'paragraph'}}\nBlock content formats:\n1) Simplified: {'content': 'text (REQUIRED for text blocks)', 'block_property': 'type'}\n2) Full Notion: {'type': 'code', 'code': {...}} for complex blocks.\nAuto-features: Markdown parsing (**bold** *italic* ~~strike~~ `code` [link](url)).\nValid block_property values: paragraph, heading_1-3, callout, to_do, toggle, quote, bulleted/numbered_list_item, divider.\nNOTE: 'code' and 'table' blocks require full Notion format with nested children/properties. 'divider' blocks don't require content.\n⚠️ UNSUPPORTED: child_database (use NOTION_CREATE_DATABASE), child_page (use NOTION_CREATE_NOTION_PAGE), link_preview (read-only).",
        },
        parent_block_id: {
          type: "string",
          description: "The UUID of the parent page or block where content will be added AS CHILDREN (nested inside). ⚠️ COMMON MISTAKE: To add content AFTER a block (as siblings), use the page ID as parent_block_id and specify the block ID in the 'after' parameter. Using a heading block ID here will fail because headings cannot have children unless they are toggleable. CONTAINER BLOCKS that support children: pages, paragraph, toggle, callout, quote, bulleted_list_item, numbered_list_item, to_do, column, column_list, table, synced_block, and heading_1/2/3 ONLY if is_toggleable=True. NON-CONTAINER blocks that CANNOT have children: heading_1/2/3 (unless toggleable), divider, image, video, file, embed, bookmark, equation, breadcrumb, table_of_contents, code, and child_database (databases don't support block children - use database entry actions instead). Accepts 32 hex chars with/without hyphens. Example: '4b5f6e87-123a-456b-789c-9de8f7a9e4c1'. Get valid IDs from create_page, search_pages, or other Notion actions.",
        },
      },
      required: [
        "parent_block_id",
        "content_blocks",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add multiple content blocks (bulk, user-friendly).",
    ],
  }),
  composioTool({
    name: "notion_append_code_blocks",
    description: "Append code and technical blocks (code, quote, equation) to a Notion page. Use for: - Code snippets and programming examples (code) - Citations and highlighted quotes (quote) - Mathematical formulas and equations (equation) Supported block types: - code: Code with syntax highlighting (70+ languages including Python, JavaScript, Go, Rust, etc.) - quote: Block quotes for citations - equation: LaTeX/KaTeX mathematical expressions ⚠️ Code content is limited to 2000 characters per text.content field. For longer code, split into multiple code blocks. For other block types, use specialized actions: - append_text_blocks: paragraphs, headings, lists - append_task_blocks: to-do, toggle, callout - append_media_blocks: image, video, audio, files - append_layout_blocks: divider, columns, TOC - append_table_blocks: tables",
    toolSlug: "NOTION_APPEND_CODE_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent block or page to append children to.",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of code/technical block objects to append. Supported types:\n- code: Code snippet with syntax highlighting (supports 70+ languages)\n- quote: Block quote for citations or highlighted text\n- equation: Mathematical equation using LaTeX/KaTeX syntax\n\n⚠️ Code content limited to 2000 characters per rich_text text.content field.\nFor longer code, split into multiple code blocks.\nMax 100 blocks per request.",
        },
      },
      required: [
        "block_id",
        "children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "code",
    ],
    askBefore: [
      "Confirm the parameters before executing Append code blocks (code, quote, equation).",
    ],
  }),
  composioTool({
    name: "notion_append_layout_blocks",
    description: "Append layout blocks (divider, TOC, breadcrumb, columns) to a Notion page. Supported types: - divider: Horizontal line separator - table_of_contents: Auto-generated from headings - breadcrumb: Page hierarchy navigation - column_list: Multi-column layout (requires 2+ columns, each with 1+ child block) For multi-column layouts, create column_list with column children in one request. Each column must contain at least 1 child block. For other blocks, use: append_text_blocks, append_task_blocks, append_code_blocks, append_media_blocks, or append_table_blocks.",
    toolSlug: "NOTION_APPEND_LAYOUT_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent block or page to append children to.",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of layout/structural block objects to append. Supported types:\n- divider: Horizontal line separator\n- table_of_contents: Auto-generated TOC from headings\n- breadcrumb: Navigation breadcrumb (auto-generated)\n- column_list: Container with at least 2 columns, each column must have at least 1 child block\n- column: Individual column (must be child of column_list)\n\nNote: column_list blocks must include their column children in the same request. Each column must contain at least one child block.\nMax 100 blocks per request.",
        },
      },
      required: [
        "block_id",
        "children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "layout",
    ],
    askBefore: [
      "Confirm the parameters before executing Append layout blocks (divider, TOC, columns).",
    ],
  }),
  composioTool({
    name: "notion_append_media_blocks",
    description: "Append media blocks (image, video, audio, file, pdf, embed, bookmark) to a Notion page. Use for: - Images and screenshots (image) - YouTube/Vimeo videos or direct video URLs (video) - Audio files and podcasts (audio) - File downloads (file) - PDF documents (pdf) - Embedded content from Twitter, Figma, CodePen, etc. (embed) - Link previews with metadata (bookmark) All media blocks require external URLs. For other block types, use specialized actions: - append_text_blocks: paragraphs, headings, lists - append_task_blocks: to-do, toggle, callout - append_code_blocks: code, quote, equation - append_layout_blocks: divider, columns, TOC - append_table_blocks: tables",
    toolSlug: "NOTION_APPEND_MEDIA_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent block or page to append children to.",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of media block objects to append. Supported types:\n- image: Image from external URL\n- video: Video from YouTube, Vimeo, or direct URL\n- audio: Audio file from external URL\n- file: Generic file download link\n- pdf: PDF document (rendered inline)\n- embed: Embed from supported services (Twitter, Figma, CodePen, etc.)\n- bookmark: Link preview with title and description\n\nAll media types require an external URL.\nMax 100 blocks per request.",
        },
      },
      required: [
        "block_id",
        "children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "media",
    ],
    askBefore: [
      "Confirm the parameters before executing Append media blocks (image, video, audio, files).",
    ],
  }),
  composioTool({
    name: "notion_append_table_blocks",
    description: "Append table blocks to a Notion page. Use for structured tabular data like spreadsheets, comparison charts, and status trackers. Example: { \"table_width\": 3, \"has_column_header\": true, \"rows\": [ {\"cells\": [[{\"type\": \"text\", \"text\": {\"content\": \"Col1\"}}], [...], [...]]} ] } ⚠️ Cell content limited to 2000 chars per text.content field.",
    toolSlug: "NOTION_APPEND_TABLE_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        tables: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              rows: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    cells: {
                      type: "array",
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            text: {
                              type: "object",
                              additionalProperties: true,
                              properties: {
                                link: {
                                  type: "string",
                                  description: "Optional link for the text.",
                                },
                                content: {
                                  type: "string",
                                  description: "The actual text content. CRITICAL: Maximum 2000 characters per text object.",
                                },
                              },
                              description: "The text content object.",
                            },
                            type: {
                              type: "string",
                              description: "Type of rich text. Currently only 'text' is supported for input.",
                            },
                            annotations: {
                              type: "string",
                              description: "Optional text styling annotations (bold, italic, etc.).",
                            },
                          },
                          description: "Rich text object for creating text content in blocks.",
                        },
                      },
                      description: "Array of cells, where each cell is an array of rich text objects. Number of cells must match table_width.",
                    },
                  },
                  description: "A single table row with cell data.",
                },
                description: "Array of table rows. At least one row is required. Each row's cells array must have exactly table_width elements.",
              },
              table_width: {
                type: "integer",
                description: "Number of columns in the table. Cannot be changed after creation.",
              },
              has_row_header: {
                type: "boolean",
                description: "Whether the first column is styled as a header.",
              },
              has_column_header: {
                type: "boolean",
                description: "Whether the first row is styled as a header.",
              },
            },
            description: "A table block with its rows.",
          },
          description: "Array of tables to append. Each table includes:\n- table_width: Number of columns (1-100)\n- has_column_header: Style first row as header (optional, default false)\n- has_row_header: Style first column as header (optional, default false)\n- rows: Array of row objects (at least one required)\n\nEach row contains a 'cells' array where each cell is an array of rich text objects.\nThe number of cells in each row MUST match table_width.\n\n⚠️ Cell content limited to 2000 characters per rich_text text.content field.\nMax 100 tables per request.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent block or page to append children to.",
        },
      },
      required: [
        "block_id",
        "tables",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "tables",
    ],
    askBefore: [
      "Confirm the parameters before executing Append table blocks.",
    ],
  }),
  composioTool({
    name: "notion_append_task_blocks",
    description: "Append task blocks (to-do, toggle, callout) to a Notion page or block. Supported block types: - to_do: Checkbox items (checkable/uncheckable) - toggle: Collapsible sections - callout: Highlighted boxes with emoji icons All three types support nested children (up to 2 levels of nesting). block_id must be a page or block that supports children (e.g., page, toggle, paragraph, list items, quote, callout, to_do). Blocks like divider, breadcrumb, equation do NOT support children. Limits: 2000 chars per text.content, max 100 blocks per request. For other blocks: append_text_blocks, append_code_blocks, append_media_blocks, append_layout_blocks, append_table_blocks.",
    toolSlug: "NOTION_APPEND_TASK_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent page or block to append children to. Must be a page_id or a block type that supports children (e.g., toggle, paragraph, bulleted_list_item, numbered_list_item, quote, callout, to_do). Some block types like divider, breadcrumb, equation do NOT support children.",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of task/interactive block objects to append. Supported types:\n- to_do: Checkbox task item (can be checked/unchecked)\n- toggle: Collapsible section (click to expand/collapse)\n- callout: Highlighted box with emoji icon (for important notes)\n\n⚠️ Text content limited to 2000 characters per rich_text text.content field.\nMax 100 blocks per request. Max 2 levels of nesting allowed.",
        },
      },
      required: [
        "block_id",
        "children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Append task blocks (to-do, toggle, callout).",
    ],
  }),
  composioTool({
    name: "notion_append_text_blocks",
    description: "Append text blocks (paragraphs, headings, lists) to a Notion page. This is the most commonly used action for adding content to Notion. Use for: documentation, notes, articles, outlines, lists. Supported block types: - paragraph: Regular text - heading_1, heading_2, heading_3: Section headers - bulleted_list_item: Bullet points - numbered_list_item: Numbered lists ⚠️ Text content is limited to 2000 characters per text.content field. For other block types, use specialized actions: - append_task_blocks: to-do, toggle, callout - append_code_blocks: code, quote, equation - append_media_blocks: image, video, audio, files - append_layout_blocks: divider, columns, TOC - append_table_blocks: tables",
    toolSlug: "NOTION_APPEND_TEXT_BLOCKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional UUID of an existing child block. New blocks will be inserted after this block.",
        },
        block_id: {
          type: "string",
          description: "The UUID of the parent block or page to append children to.",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of text block objects to append (also accepts 'blocks' as parameter name). Supported types:\n- paragraph: Regular text paragraph\n- heading_1, heading_2, heading_3: Section headings\n- bulleted_list_item: Bullet point\n- numbered_list_item: Numbered list item\n\n⚠️ Text content limited to 2000 characters per rich_text text.content field.\nMax 100 blocks per request.",
        },
      },
      required: [
        "block_id",
        "children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "blocks",
      "text",
    ],
    askBefore: [
      "Confirm the parameters before executing Append text blocks (paragraphs, headings, lists).",
    ],
  }),
  composioTool({
    name: "notion_archive_notion_page",
    description: "Archives (moves to trash) or unarchives (restores from trash) a specified Notion page. Limitation: Workspace-level pages (top-level pages with no parent page or database) cannot be archived via the API and must be archived manually in the Notion UI.",
    toolSlug: "NOTION_ARCHIVE_NOTION_PAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archive: {
          type: "boolean",
          description: "Set to `true` to move the page to trash (archive), or `false` to restore it from trash (unarchive). Defaults to `true`.",
        },
        page_id: {
          type: "string",
          description: "The unique identifier (UUID) of the Notion page to be archived or unarchived. Must be a page ID, not a database ID. Note: Workspace-level pages (pages that sit at the root of your workspace with no parent page or database) cannot be archived via the API - only pages nested under other pages or databases can be archived programmatically. Page IDs can be obtained using NOTION_SEARCH_NOTION_PAGE with filter_value='page' or from the 'id' field of page objects returned by other Notion actions.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive Notion Page.",
    ],
  }),
  composioTool({
    name: "notion_create_comment",
    description: "Adds a comment to a Notion page (via `parent_page_id`) OR to an existing discussion thread (via `discussion_id`); cannot create new discussion threads on specific blocks (inline comments).",
    toolSlug: "NOTION_CREATE_COMMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "object",
          additionalProperties: true,
          properties: {
            bold: {
              type: "boolean",
              description: "Indicates if the text is bold.",
            },
            code: {
              type: "boolean",
              description: "Indicates if the text is formatted as code.",
            },
            link: {
              type: "string",
              description: "URL for hyperlinks or media blocks. For TEXT blocks: optional URL to make text clickable. For MEDIA blocks (image, video, file): REQUIRED - must be a valid external URL (http/https). Do not pass placeholder text in 'content' for media blocks.",
            },
            color: {
              type: "string",
              description: "The color of the text background or text itself.",
            },
            italic: {
              type: "boolean",
              description: "Indicates if the text is italic.",
            },
            content: {
              type: "string",
              description: "The textual content for TEXT blocks only. ENHANCED: Automatically parses markdown formatting including bold (**text**), italic (*text*), strikethrough (~~text~~), inline code (`code`), and links ([text](url)). Required for: paragraph, heading_1, heading_2, heading_3, callout, to_do, toggle, quote. NOT USED for media blocks (image, video, file) - use 'link' field instead.",
            },
            underline: {
              type: "boolean",
              description: "Indicates if the text is underlined.",
            },
            strikethrough: {
              type: "boolean",
              description: "Indicates if the text has strikethrough.",
            },
            block_property: {
              type: "string",
              description: "The block property of the block to be added. **Common text blocks:** `paragraph`, `heading_1`, `heading_2`, `heading_3`, `callout`, `to_do`, `toggle`, `quote`, `bulleted_list_item`, `numbered_list_item`. **Special blocks:** `divider` (creates a horizontal divider line, no content required). **Media/embed blocks:** `file`, `image`, `video` (requires `link` field with external URL - direct file uploads not supported). \n\n**NOTE:** Notion API only supports heading levels 1-3. heading_4, heading_5, etc. are automatically converted to heading_3.",
              enum: [
                "paragraph",
                "heading_1",
                "heading_2",
                "heading_3",
                "callout",
                "to_do",
                "toggle",
                "quote",
                "bulleted_list_item",
                "numbered_list_item",
                "file",
                "image",
                "video",
                "divider",
              ],
            },
          },
          description: "Content of the comment as a NotionRichText object or a JSON string. Simplest form: {'content': 'Looks good!'} or {'text': 'Looks good!'} (both 'content' and 'text' are accepted as the field name). Can also be passed as a JSON string: '{\"content\": \"Looks good!\"}'. Optional styling fields: bold, italic, etc. The 'link' field is for external URLs only (e.g., 'https://example.com'), NOT for page IDs. Do NOT wrap this in a list or use Notion API block JSON.",
        },
        discussion_id: {
          type: "string",
          description: "The ID of an existing discussion thread to which the comment will be added. This is required if `parent_page_id` is not provided. Must be a valid UUID (32 hex characters with or without hyphens).",
        },
        parent_page_id: {
          type: "string",
          description: "The ID of the Notion page where the comment will be added. This is required if `discussion_id` is not provided. Must be a valid UUID (32 hex characters with or without hyphens). Page IDs can be obtained using other Notion actions that fetch page details or list pages.",
        },
      },
      required: [
        "comment",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create comment.",
    ],
  }),
  composioTool({
    name: "notion_create_database",
    description: "Creates a new Notion database as a subpage under a specified parent page with a defined properties schema. IMPORTANT NOTES: - The parent page MUST be shared with your integration, otherwise you'll get a 404 error - If you encounter conflict errors (409), retry the request as Notion may experience temporary save conflicts - For relation properties, you MUST provide the database_id of the related database - Parent ID must be a valid UUID format (with or without hyphens), not a template variable Use this action exclusively for creating new databases.",
    toolSlug: "NOTION_CREATE_DATABASE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "The desired title for the new database. This text will be automatically converted into Notion's rich text format when the database is created.",
        },
        parent_id: {
          type: "string",
          description: "**CRITICAL: MUST BE A PAGE ID, NOT A DATABASE ID.** Databases can only be created as children of pages, not as children of other databases. Using a database ID will result in an API error: 'Can't create databases parented by a database.' HOW TO IDENTIFY PAGE vs DATABASE: Use NOTION_SEARCH_NOTION_PAGE with filter_value='page' to find pages (object='page') - only these IDs can be used here. Database IDs (object='database') are NOT valid as parent_id for this action. FORMAT: Valid 32-character UUID with hyphens (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) or without hyphens (32 alphanumeric characters). Additional text after the UUID (e.g., 'uuid: Page Title') is automatically cleaned. The page must be shared with your integration, otherwise you'll receive a 404 error.",
        },
        properties: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Name of the property",
              },
              type: {
                type: "string",
                description: "The type of the property, which determines the kind of data it will store. Valid types are defined by the PropertyType enum.",
                enum: [
                  "title",
                  "rich_text",
                  "number",
                  "select",
                  "multi_select",
                  "date",
                  "people",
                  "files",
                  "checkbox",
                  "url",
                  "email",
                  "phone_number",
                  "formula",
                  "relation",
                  "rollup",
                  "status",
                  "created_time",
                  "created_by",
                  "last_edited_time",
                  "last_edited_by",
                  "place",
                  "unique_id",
                ],
              },
              database_id: {
                type: "string",
                description: "UUID of the database to relate to. Required when type is 'relation'. Must be a valid UUID format (32 hex characters, with or without hyphens). Placeholder values like 'PLACEHOLDER_PROJECT' are not allowed.",
              },
              relation_type: {
                type: "string",
                description: "Relationship type, either 'single_property' or 'dual_property'.",
              },
            },
          },
          description: "Optional list defining the schema (columns) for the new database. Each item is an object with 'name' and 'type'. If not provided, Notion creates a default database with a single 'Name' column of type 'title'. When provided, the list must include at least one property of type 'title'. Common supported property types include: 'title', 'rich_text', 'number', 'select', 'multi_select', 'status', 'date', 'people', 'files', 'checkbox', 'url', 'email', 'phone_number'. Other types like 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by' might also be supported. IMPORTANT: For 'relation' type properties, you MUST also provide the 'database_id' field with the UUID of the related database. The related database must be shared with your integration.",
        },
      },
      required: [
        "parent_id",
        "title",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Notion Database.",
    ],
  }),
  composioTool({
    name: "notion_create_file_upload",
    description: "Tool to create a Notion FileUpload object and retrieve an upload URL. Use when you need to automate attaching local or external files directly into Notion without external hosting.",
    toolSlug: "NOTION_CREATE_FILE_UPLOAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        mode: {
          type: "string",
          description: "Upload mode: 'single_part' for direct upload (default, up to 20 MB), 'multi_part' for chunked uploads (requires paid Notion workspace), or 'external_url' to import from a public URL. Note: Free workspaces are limited to 5 MB files and cannot use multi_part mode.",
          enum: [
            "single_part",
            "multi_part",
            "external_url",
          ],
        },
        filename: {
          type: "string",
          description: "Human-readable file name with extension. Required for external_url; for multi_part, supply to infer extension or pair with content_type; optional for single-part. Supported extensions: Audio (.aac, .adts, .mid, .midi, .mp3, .mpga, .m4a, .m4b, .mp4, .oga, .ogg, .wav, .wma); Document (.pdf, .txt, .json, .doc, .dot, .docx, .dotx, .xls, .xlt, .xla, .xlsx, .xltx, .ppt, .pot, .pps, .ppa, .pptx, .potx); Image (.gif, .heic, .jpeg, .jpg, .png, .svg, .tif, .tiff, .webp, .ico); Video (.amv, .asf, .wmv, .avi, .f4v, .flv, .gifv, .m4v, .mp4, .mkv, .webm, .mov, .qt, .mpeg).",
        },
        content_type: {
          type: "string",
          description: "MIME type of the file. Required in multi_part if filename lacks extension; optional for single-part.",
        },
        external_url: {
          type: "string",
          description: "Public HTTPS URL to import. Required when mode='external_url'. Must expose Content-Type and Content-Length.",
        },
        number_of_parts: {
          type: "integer",
          description: "Total parts for a multi-part upload; required when mode='multi_part'.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "write",
      "file",
      "upload",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Notion file upload.",
    ],
  }),
  composioTool({
    name: "notion_create_notion_page",
    description: "Creates a new page in a Notion workspace under a specified parent page or database. Supports creating pages with markdown content using the native markdown parameter, or as an empty page that can be populated later. PREREQUISITES: - Parent page/database must exist and be accessible in your Notion workspace - Use search_pages or list_databases first to obtain valid parent IDs LIMITATIONS: - Cannot create root-level pages (must have a parent) - May encounter conflicts if creating pages too quickly - Title-based parent search is less reliable than using UUIDs - The markdown parameter is mutually exclusive with children/content parameters",
    toolSlug: "NOTION_CREATE_NOTION_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        icon: {
          type: "string",
          description: "An emoji to be used as the icon for the new page. Must be a single emoji character. If the title starts with this emoji, it will be stripped from the title text to prevent duplication.",
        },
        cover: {
          type: "string",
          description: "The URL of an image to be used as the cover for the new page. The URL must be publicly accessible.",
        },
        title: {
          type: "string",
          description: "The title of the new page to be created. If an icon emoji is provided and the title starts with the same emoji, it will be automatically removed from the title to avoid duplication.",
        },
        markdown: {
          type: "string",
          description: "Page content as Notion-flavored Markdown. When provided, the page will be created from this markdown string. If properties.title is omitted, the first # h1 heading will be extracted as the page title. This parameter is mutually exclusive with children and content parameters.",
        },
        parent_id: {
          type: "string",
          description: "CRITICAL: Must be either: 1) A valid Notion UUID in dashed format (8-4-4-4-12 hex characters like '59833787-2cf9-4fdf-8782-e53db20768a5') or dashless format (32 hex characters like '598337872cf94fdf8782e53db20768a5') of an existing Notion page or database. 2) The exact title of an existing page/database (less reliable - UUID strongly preferred). IMPORTANT: Always use search_pages or list_databases actions FIRST to obtain valid parent IDs. Common errors: Using malformed UUIDs, non-existent IDs, or IDs from different workspaces. Note: Root-level pages cannot be created - you must specify a parent. Also accepts 'parent_page_id' as an alias.",
        },
      },
      required: [
        "parent_id",
        "title",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Notion page.",
    ],
  }),
  composioTool({
    name: "notion_delete_block",
    description: "Archives a Notion block, page, or database using its ID, which sets its 'archived' property to true (like moving to \"Trash\" in the UI) and allows it to be restored later. Note: This operation will fail if the block has an archived parent or ancestor in the hierarchy. You must unarchive the ancestor before archiving/deleting its descendants. IMPORTANT LIMITATION: Workspace-level pages (top-level pages that are direct children of the workspace, not contained within other pages or databases) cannot be archived via the Notion API. This is a documented Notion API restriction. Only pages that are children of other pages or databases can be deleted through this action.",
    toolSlug: "NOTION_DELETE_BLOCK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        block_id: {
          type: "string",
          description: "Identifier of the block, page, or database to be deleted (archived). Must be a valid Notion block/page/database ID in UUID format (with or without hyphens). IMPORTANT: Workspace-level pages (top-level pages not contained within other pages or databases) cannot be archived via the API - only pages that are children of other pages or databases can be deleted. To find page IDs and their titles, consider using an action like `NOTION_FETCH_DATA`.",
        },
      },
      required: [
        "block_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete a block.",
    ],
  }),
  composioTool({
    name: "notion_duplicate_page",
    description: "Duplicates a Notion page, including all its content, properties, and nested blocks, under a specified parent page or workspace.",
    toolSlug: "NOTION_DUPLICATE_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "An optional new title for the duplicated page. If not provided, the title of the original page will be used, prefixed with 'Copy of'.",
        },
        page_id: {
          type: "string",
          description: "The unique identifier (UUID v4) of the Notion page to be duplicated. Ensure this page exists and is accessible.",
        },
        parent_id: {
          type: "string",
          description: "The unique identifier (UUID v4) of the Notion page or database that will serve as the parent for the duplicated page. If a database ID is provided, the new page is created as a row in that database with properties preserved. If a page ID is provided, the new page is created as a child page with only the title. This ID cannot be the same as `page_id`.",
        },
      },
      required: [
        "page_id",
        "parent_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Duplicate page.",
    ],
  }),
  composioTool({
    name: "notion_fetch_all_block_contents",
    description: "Tool to fetch all child blocks for a given Notion block. Use when you need a complete listing of a block's children beyond a single page; supports optional recursive expansion of nested blocks.",
    toolSlug: "NOTION_FETCH_ALL_BLOCK_CONTENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        block_id: {
          type: "string",
          description: "Identifier (UUID) of the parent Notion block or page whose children to list. Pages are blocks in Notion. Accepts UUIDs with or without hyphens (e.g., 'c02fc1d3-db8b-45c5-a222-27595b15aea7' or 'c02fc1d3db8b45c5a22227595b15aea7'). Either block_id or page_url must be provided. The block must be shared with your integration.",
        },
        page_url: {
          type: "string",
          description: "Notion page URL from which to extract the page/block ID. Either block_id or page_url must be provided. NOTE: Database view URLs (those containing '?v=' parameter) are NOT supported. Database views are filtered views of a database and do not have block children. To access database content, use the NOTION_QUERY_DATABASE action instead.",
        },
        max_depth: {
          type: "integer",
          description: "Maximum recursion depth when recursive=true. Prevents excessive nesting traversal. Defaults to 10. Set higher for deeply nested structures, lower for faster results.",
        },
        page_size: {
          type: "integer",
          description: "Maximum number of child blocks to return per request. Defaults to 100, with a maximum of 100 as per Notion API limits.",
        },
        recursive: {
          type: "boolean",
          description: "If true, fetches nested children for blocks with 'has_children' set to true, appending all descendants to the output list. Subject to max_depth and max_blocks limits.",
        },
        max_blocks: {
          type: "integer",
          description: "Maximum total blocks to return when recursive=true. Prevents runaway fetches on extremely large block trees. Defaults to 5000. When limit is reached, blocks fetched so far are returned with a warning in the response.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_fetch_block_contents",
    description: "Retrieves a paginated list of direct, first-level child block objects along with contents for a given parent Notion block or page ID; use block IDs from the response for subsequent calls to access deeply nested content.",
    toolSlug: "NOTION_FETCH_BLOCK_CONTENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        block_id: {
          type: "string",
          description: "UUID of the parent Notion block or page whose children are to be fetched. Accepts both hyphenated (e.g., 'c02fc1d3-db8b-45c5-a222-27595b15aea7') and non-hyphenated (e.g., 'c02fc1d3db8b45c5a22227595b15aea7') UUID formats. Notion's API does not support special identifiers like 'root' or 'top-level' - you must always provide an actual page or block UUID. To discover valid page/block IDs, first use 'NOTION_SEARCH_NOTION_PAGE' to find pages or 'NOTION_QUERY_DATABASE' to query databases.",
        },
        page_size: {
          type: "integer",
          description: "The maximum number of child blocks to return in a single response. The actual number of results may be lower if there are fewer child blocks available or if the end of the list is reached. Maximum allowed value is 100. If unspecified, Notion's default page size will be used.",
        },
        start_cursor: {
          type: "string",
          description: "Pagination cursor from next_cursor in a previous API response. When paginating through results, pass the next_cursor value from the previous response here to fetch the next page. Must be a valid UUID format or cursor string returned by Notion's API. If omitted, returns the first page of results.",
        },
      },
      required: [
        "block_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_fetch_block_metadata",
    description: "Fetches metadata for a Notion block (including pages, which are special blocks) using its UUID. Returns block type, properties, and basic info but not child content. Prerequisites: 1) Block/page must be shared with your integration, 2) Use valid block_id from API responses (not URLs). For child blocks, use fetch_block_contents instead. Common 404 errors mean the block isn't accessible to your integration.",
    toolSlug: "NOTION_FETCH_BLOCK_METADATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        block_id: {
          type: "string",
          description: "The unique UUID identifier for the Notion block to be retrieved. Must be a valid 32-character UUID (with or without hyphens). Pages in Notion are also blocks, so page IDs work here too. Important: The block/page must be shared with your integration. To find valid block IDs, use actions like search_pages, list_databases, or fetch_block_contents. Common error: Ensure you're using the actual block_id from API responses, not URLs or other identifiers.",
        },
      },
      required: [
        "block_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_fetch_comments",
    description: "Fetches unresolved comments for a specified Notion block or page ID. The block/page must be shared with your Notion integration and the integration must have 'Read comments' capability enabled, otherwise a 404 error will be returned.",
    toolSlug: "NOTION_FETCH_COMMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "Identifier for a Notion page from which to fetch comments. This is an alias for block_id since pages are blocks in Notion. Provide either page_id or block_id, but not both. IMPORTANT: The page must be shared with your Notion integration - if not shared, you will receive a 404 error. To find IDs, use the `NOTION_SEARCH_NOTION_PAGE` action.",
        },
        block_id: {
          type: "string",
          description: "Identifier for a Notion block from which to fetch comments. In Notion, pages are technically blocks, so you can pass a page ID here as well. Provide either block_id or page_id, but not both. IMPORTANT: The block/page must be shared with your Notion integration - if not shared, you will receive a 404 error. To find IDs, use the `NOTION_FETCH_DATA` action.",
        },
        page_size: {
          type: "integer",
          description: "The number of comments to return in a single response page. Must be between 1 and 100, inclusive. Default is 100.",
        },
        start_cursor: {
          type: "string",
          description: "A pagination cursor. If provided, the response will contain the page of results starting after this cursor. If omitted, the first page of results is returned.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "read",
      "comment",
    ],
  }),
  composioTool({
    name: "notion_fetch_data",
    description: "Fetches Notion items (pages and/or databases) from the Notion workspace, use this to get minimal data about the items in the workspace with a query or list all items in the workspace with minimal data",
    toolSlug: "NOTION_FETCH_DATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "An optional search query to filter pages and/or databases by their title or content. If not provided (None or empty string), all accessible items matching the selected type (pages, databases, or both) are returned.",
        },
        page_size: {
          type: "integer",
          description: "The maximum number of items per page (1-100). IMPORTANT: Notion API enforces a hard maximum of 100 items per request - values above 100 will be automatically capped to 100. To retrieve more than 100 items, use pagination by passing the returned 'next_cursor' value in subsequent requests. Defaults to 100.",
        },
        fetch_type: {
          type: "string",
          description: "Specifies what type of Notion data to fetch. Use 'pages' to fetch only pages, 'databases' to fetch only databases, or 'all' to fetch both pages and databases.",
          enum: [
            "pages",
            "databases",
            "all",
          ],
        },
        start_cursor: {
          type: "string",
          description: "Pagination cursor to fetch the next page of results. Pass the 'next_cursor' value from a previous response to retrieve the next page. When null or not provided, the first page is returned.",
        },
        original_page_size: {
          type: "integer",
          description: "The original page size value before it was capped.",
        },
        page_size_was_capped: {
          type: "boolean",
          description: "Indicates whether the page size was capped to the maximum allowed value.",
        },
      },
      required: [
        "fetch_type",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "data",
      "utility",
    ],
  }),
  composioTool({
    name: "notion_fetch_database",
    description: "Fetches a Notion database's structural metadata (properties, title, etc.) via its `database_id`, not the data entries; `database_id` must reference an existing database.",
    toolSlug: "NOTION_FETCH_DATABASE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        database_id: {
          type: "string",
          description: "Required. The unique identifier of the Notion database in UUID format (e.g., '2ec43c10-7ecd-8159-a8f4-ff16630df66c') or unhyphenated 32-char hex (e.g., '2ec43c107ecd8159a8f4ff16630df66c'). Must be a DATABASE ID, not a page ID. Linked databases are NOT supported - use the original source database ID. To find database IDs: use NOTION_SEARCH_NOTION_PAGE with filter_value='database', or extract from database URLs (notion.so/{database_id}).",
        },
      },
      required: [
        "database_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_fetch_row",
    description: "Retrieves a Notion database row's properties and metadata; use fetch_block_contents for page content blocks.",
    toolSlug: "NOTION_FETCH_ROW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The UUID of the Notion page (which represents a row in a database) to retrieve. Must be a page ID, not a database ID. Each row in a Notion database is a page. Use actions like NOTION_FETCH_DATA or NOTION_QUERY_DATABASE to get page IDs from databases.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_get_about_user",
    description: "Retrieves detailed information about a specific Notion user, such as their name, avatar, and email, based on their unique user ID.",
    toolSlug: "NOTION_GET_ABOUT_USER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the Notion user whose details are to be retrieved. This ID is used to fetch specific user information.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_get_page_markdown",
    description: "Retrieve a Notion page's full content rendered as Notion-flavored Markdown in a single API call. Use when you need the readable content of a page without recursive block-children fetching.",
    toolSlug: "NOTION_GET_PAGE_MARKDOWN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The UUID of the Notion page to retrieve as markdown. Accepts both hyphenated (8-4-4-4-12) and unhyphenated (32 characters) UUID formats. This endpoint retrieves the full page content rendered as Notion-flavored Markdown in a single API call, avoiding the need for recursive block-children fetching. IMPORTANT: Only page IDs are accepted - database IDs will be rejected. To retrieve database content, use the 'Fetch Database' or 'Query Database' actions instead.",
        },
        include_transcript: {
          type: "boolean",
          description: "Set to true to include meeting note transcripts in the markdown response. Defaults to false if not specified.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "page",
    ],
  }),
  composioTool({
    name: "notion_get_page_property_action",
    description: "Call this to get a specific property from a Notion page when you have a valid `page_id` and `property_id`; handles pagination for properties returning multiple items.",
    toolSlug: "NOTION_GET_PAGE_PROPERTY_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "Identifier of the Notion page (e.g., '067dd719-a912-471e-a9a3-ac10710e78b4') from which to retrieve the property. Use the 'NOTION_FETCH_DATA' action or similar to discover available page IDs and their titles.",
        },
        page_size: {
          type: "integer",
          description: "For paginated property types (e.g., 'relation', 'rollup', 'rich_text' if content is extensive), this specifies the number of items to return per request. If omitted, Notion's default page size for the property is used.",
        },
        property_id: {
          type: "string",
          description: "Identifier or name of the property to retrieve. For 'title' properties, the ID is always 'title'. For other properties, this can be the property's name as displayed in Notion (e.g., 'Status', 'Assignee') or its unique programmatic ID (e.g., 'N%3A%5B%7C', 'prop_id_example'). Property IDs/names can be found by inspecting the page object or database schema.",
        },
        start_cursor: {
          type: "string",
          description: "For paginated properties, if a previous request's response indicated `has_more: true`, provide the `next_cursor` value here to fetch the subsequent set of items. Omit if fetching the first page.",
        },
      },
      required: [
        "page_id",
        "property_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_insert_row_database",
    description: "Creates a new page (row) in a specified Notion database. Prerequisites: - Database must be shared with your integration - Property names AND types must match schema exactly (case-sensitive) - Use NOTION_FETCH_DATA with fetch_type='databases' first to get exact property names and types - Each database has ONE 'title' property; other text fields are 'rich_text' - Database must NOT have multiple data sources (synced databases are not supported) Common Errors: - 404: Database not shared with integration - 400 \"not a property\": Wrong property name - 400 \"expected to be X\": Wrong property type - 400 \"multiple_data_sources\": Database uses multiple data sources (not supported) Note: Rich text content in child_blocks is automatically truncated to 2000 characters per Notion API limits.",
    toolSlug: "NOTION_INSERT_ROW_DATABASE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        icon: {
          type: "string",
          description: "Emoji to be used as the page icon. Must be a single emoji character.",
        },
        cover: {
          type: "string",
          description: "URL of an external image to set as the page cover. The URL must point to a publicly accessible image.",
        },
        properties: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Name of the property",
              },
              type: {
                type: "string",
                description: "Type of the property. Common types: title (ONE per database), rich_text, number, select (for dropdowns), multi_select, date, people, files, checkbox, url, email, phone_number, relation. ⚠️ IMPORTANT: Use 'select' for dropdown properties - NOT 'status'. The 'status' type is a SPECIAL Notion property type (with 'To-do', 'In progress', 'Complete' groups) that most databases do NOT have. If your property shows a simple dropdown list, use 'select' even if the property is NAMED 'Status'. Read-only/unsupported types (auto-skipped): created_time, created_by, last_edited_time, last_edited_by, formula, rollup, unique_id, place.",
                enum: [
                  "title",
                  "rich_text",
                  "number",
                  "select",
                  "multi_select",
                  "date",
                  "people",
                  "files",
                  "checkbox",
                  "url",
                  "email",
                  "phone_number",
                  "formula",
                  "relation",
                  "rollup",
                  "status",
                  "created_time",
                  "created_by",
                  "last_edited_time",
                  "last_edited_by",
                  "place",
                  "unique_id",
                ],
              },
              value: {
                type: "string",
                description: "Value formatted according to the property type:\n- title, rich_text - text string (max 2000 chars, truncated if longer)\n- number - numeric string ex. \"23.4\"\n- select - single option name (no commas). For multiple values, use multi_select.\n- multi_select - comma separated values ex. \"India,USA\"\n- date - ISO 8601. Single: \"2021-05-11\". Range: \"2021-05-11/2021-05-15\" (slash-separated).\n- people - comma separated USER UUIDs (not names). Use NOTION_LIST_USERS to find UUIDs.\n- relation - comma separated PAGE UUIDs (not titles). Use NOTION_QUERY_DATABASE to find UUIDs.\n- url - a URL string.\n- files - comma separated HTTPS URLs only (no file:// or http://).\n- checkbox - \"True\" or \"False\"\n",
              },
            },
          },
          description: "Property values for the new page. Accepts a LIST of objects or a JSON-encoded string. Each object must include: `name` (exact property name, case-sensitive), `type` (property data type), and `value` (string-formatted value).\n\nProperty names AND types are CASE-SENSITIVE and must match your Notion database schema exactly. Each database has exactly ONE 'title' type property; all other text properties use 'rich_text'. Use NOTION_FETCH_DATA with fetch_type='databases' to find exact property names and types.\n\nCORRECT FORMAT (list of property objects):\n[\n  {\"name\": \"Task Name\", \"type\": \"title\", \"value\": \"Finalize Q3 report\"},\n  {\"name\": \"Priority\", \"type\": \"select\", \"value\": \"High\"},\n  {\"name\": \"Tags\", \"type\": \"multi_select\", \"value\": \"Work,Personal\"},\n  {\"name\": \"Due Date\", \"type\": \"date\", \"value\": \"2024-06-01T12:00:00.000-04:00\"},\n  {\"name\": \"Completed\", \"type\": \"checkbox\", \"value\": \"False\"}\n]\n\nINCORRECT FORMAT (dict - causes validation error): {\"Task Name\": \"value\", \"Priority\": \"High\"}\n\n'status' vs 'select' TYPE CONFUSION:\n- Dropdown lists use type='select' - even if the property is NAMED 'Status'.\n- The 'status' type is a special Notion property with workflow groups ('To-do', 'In progress', 'Complete').\n- Use NOTION_FETCH_DATA to verify the actual type in your database schema.\n\nPROPERTY TYPE ERRORS:\n- 'X is not a property that exists': Check schema - wrong property name or wrong type.\n- 'X is expected to be Y': Wrong type specified - use the type shown in the error.\n\nValue formatting rules by type:\n- `title` / `rich_text`: Plain text string (max 2000 chars).\n- `number`: String of a number (e.g., \"23.4\").\n- `select`: Single option name. Commas NOT allowed - use 'multi_select' for multiple values.\n- `multi_select`: Comma-separated option names (e.g., \"Work,Personal\"). Options must exist in schema.\n- `date`: ISO 8601. Single: \"2024-06-01T12:00:00.000-04:00\". Range: \"start/end\" separated by \"/\".\n- `people`: Comma-separated Notion user IDs.\n- `relation`: Comma-separated page UUIDs (NOT text/titles). Use NOTION_QUERY_DATABASE to get page IDs.\n- `checkbox`: \"True\" or \"False\".\n- `url`: Valid URL string.\n- `files`: Comma-separated URLs.\n- `email`: Valid email string.\n- `phone_number`: Phone number string. Only use if database property type is 'Phone'.",
        },
        database_id: {
          type: "string",
          description: "Identifier (UUID) of the Notion database where the new page (row) will be inserted. Can be provided with or without hyphens (e.g., '59833787-2cf9-4fdf-8782-e53db20768a5' or '598337872cf94fdf8782e53db20768a5'). This ID must correspond to an existing database that has been explicitly shared with your integration. IMPORTANT: The database must be shared with your integration in Notion settings, otherwise you will get a 404 error. NOTE: Databases with multiple data sources (synced databases or combined views) are not supported by this integration. Use the `NOTION_FETCH_DATA` action to find available database IDs that are already shared with your integration.",
        },
        child_blocks: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              bold: {
                type: "boolean",
                description: "Indicates if the text is bold.",
              },
              code: {
                type: "boolean",
                description: "Indicates if the text is formatted as code.",
              },
              link: {
                type: "string",
                description: "URL for hyperlinks or media blocks. For TEXT blocks: optional URL to make text clickable. For MEDIA blocks (image, video, file): REQUIRED - must be a valid external URL (http/https). Do not pass placeholder text in 'content' for media blocks.",
              },
              color: {
                type: "string",
                description: "The color of the text background or text itself.",
              },
              italic: {
                type: "boolean",
                description: "Indicates if the text is italic.",
              },
              content: {
                type: "string",
                description: "The textual content for TEXT blocks only. ENHANCED: Automatically parses markdown formatting including bold (**text**), italic (*text*), strikethrough (~~text~~), inline code (`code`), and links ([text](url)). Required for: paragraph, heading_1, heading_2, heading_3, callout, to_do, toggle, quote. NOT USED for media blocks (image, video, file) - use 'link' field instead.",
              },
              underline: {
                type: "boolean",
                description: "Indicates if the text is underlined.",
              },
              strikethrough: {
                type: "boolean",
                description: "Indicates if the text has strikethrough.",
              },
              block_property: {
                type: "string",
                description: "The block property of the block to be added. **Common text blocks:** `paragraph`, `heading_1`, `heading_2`, `heading_3`, `callout`, `to_do`, `toggle`, `quote`, `bulleted_list_item`, `numbered_list_item`. **Special blocks:** `divider` (creates a horizontal divider line, no content required). **Media/embed blocks:** `file`, `image`, `video` (requires `link` field with external URL - direct file uploads not supported). \n\n**NOTE:** Notion API only supports heading levels 1-3. heading_4, heading_5, etc. are automatically converted to heading_3.",
                enum: [
                  "paragraph",
                  "heading_1",
                  "heading_2",
                  "heading_3",
                  "callout",
                  "to_do",
                  "toggle",
                  "quote",
                  "bulleted_list_item",
                  "numbered_list_item",
                  "file",
                  "image",
                  "video",
                  "divider",
                ],
              },
            },
            description: "Include these fields in the json: {'content': 'Some words', 'link': 'https://random-link.com'. For content styling, refer to https://developers.notion.com/reference/rich-text.\n\nENHANCED: The 'content' field now automatically detects and parses markdown formatting - supports bold (**text**), italic (*text*), strikethrough (~~text~~), inline code (`code`), and links ([text](url)). Headers (# ## ###) are handled via block_property.",
          },
          description: "A list of `NotionRichText` objects defining content blocks (e.g., paragraphs, headings, media) to append to the new page's body. Accepts either a list of objects OR a JSON-encoded string representing a list. If omitted, the page body will be empty. \n\n**Supported block types:** paragraph, heading_1, heading_2, heading_3, callout, to_do, toggle, quote, bulleted_list_item, numbered_list_item, divider, image, video, file. \n\n**Media blocks (image, video, file):** Require the `link` field with an external URL. The Notion API does not support uploading files directly - you must provide publicly accessible URLs.\n\n**Note:** Notion API limits children to 100 blocks per request. If more than 100 blocks are provided, the action will automatically create the page with the first 100 blocks and then append remaining blocks in subsequent API calls.",
        },
      },
      required: [
        "database_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert row database.",
    ],
  }),
  composioTool({
    name: "notion_insert_row_from_nl",
    description: "Creates a new row (page) in a Notion database from a natural language description. Fetches the database schema at runtime, uses an LLM to generate the correctly-formatted property payload, and creates the page.",
    toolSlug: "NOTION_INSERT_ROW_FROM_NL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        icon: {
          type: "string",
          description: "Optional emoji icon for the page.",
        },
        cover: {
          type: "string",
          description: "Optional cover image URL for the page.",
        },
        nl_query: {
          type: "string",
          description: "Natural language description of the row to create. Example: 'Add task: Review PR #14143, priority High, status In Progress, due tomorrow'.",
        },
        database_id: {
          type: "string",
          description: "Notion database UUID where the new row will be inserted. Can be provided with or without hyphens.",
        },
      },
      required: [
        "database_id",
        "nl_query",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Row From Natural Language.",
    ],
  }),
  composioTool({
    name: "notion_list_data_source_templates",
    description: "Tool to list all templates for a Notion data source. Use when needing to discover template IDs/names for bulk page creation. Use after confirming the data_source_id.",
    toolSlug: "NOTION_LIST_DATA_SOURCE_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_size: {
          type: "integer",
          description: "Number of templates to return per page (1–100). Defaults to 100 if omitted.",
        },
        start_cursor: {
          type: "string",
          description: "Cursor for pagination. Use the `next_cursor` value from a previous response to retrieve the next page.",
        },
        data_source_id: {
          type: "string",
          description: "Data source ID (UUIDv4). Path parameter identifying the data source to list templates from.",
        },
      },
      required: [
        "data_source_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_list_file_uploads",
    description: "Tool to retrieve file uploads for the current bot integration, sorted by most recent first. Use when you need to list all file uploads or paginate through file upload history.",
    toolSlug: "NOTION_LIST_FILE_UPLOADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_size: {
          type: "integer",
          description: "Controls how many items the response includes from the complete list. Maximum 100, default 100. The actual response may contain fewer results than requested.",
        },
        start_cursor: {
          type: "string",
          description: "Accepts a next_cursor value from a previous response. Treat as an opaque value to retrieve subsequent result pages. If omitted, begins from the list's start.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "read",
      "file_uploads",
    ],
  }),
  composioTool({
    name: "notion_list_users",
    description: "Retrieves a paginated list of users (excluding guests) from the Notion workspace; the number of users returned per page may be less than the requested `page_size`.",
    toolSlug: "NOTION_LIST_USERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_size: {
          type: "integer",
          description: "The desired number of users to retrieve per page. The maximum value is 100.",
        },
        start_cursor: {
          type: "string",
          description: "If omitted, retrieves the first page of users. Use the 'next_cursor' value from a previous response to get the next page.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_move_page",
    description: "Tool to move a Notion page to a new parent (page or database). Use when you need to reorganize page hierarchy. Important: To move to a database, use data_source_id (NOT database_id). Get the data source ID from the database object using NOTION_FETCH_DATABASE.",
    toolSlug: "NOTION_MOVE_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        parent: {
          type: "string",
          description: "Parent destination for the page. Use type='page_id' with page_id to move under another page (the page_id must reference a page, not a database). Use type='data_source_id' with data_source_id to move into a database. Common mistake: Using type='page_id' with a database ID will fail - databases require type='data_source_id'.",
        },
        page_id: {
          type: "string",
          description: "The ID of the page to move. UUID format with or without dashes is supported.",
        },
      },
      required: [
        "page_id",
        "parent",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "page",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Page.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "notion_query_data_source",
    description: "Tool to query a Notion data source. Use when you need to retrieve pages or child data sources with filters, sorts, and pagination. Make paginated requests using cursors and optional property filters for efficient data retrieval.",
    toolSlug: "NOTION_QUERY_DATA_SOURCE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of sort criteria in order of precedence. Use PropertySort for property fields or TimestampSort for creation/edit times.",
        },
        filter: {
          type: "object",
          additionalProperties: true,
          description: "Filter object to limit returned entries. Supports single-property filters or compound filters using 'and'/'or'.",
        },
        page_size: {
          type: "integer",
          description: "Maximum number of items to return (1-100). Defaults to 100 if omitted.",
        },
        start_cursor: {
          type: "string",
          description: "Cursor from a prior response's `next_cursor` for fetching the next page.",
        },
        data_source_id: {
          type: "string",
          description: "UUID of the Notion data source to query (with or without hyphens). URI prefixes like 'collection://' are automatically stripped.",
        },
        filter_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property IDs to include in each returned item; maps to the `filter_properties[]` query parameter.",
        },
      },
      required: [
        "data_source_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_query_database",
    description: "Queries a Notion database to retrieve pages (rows). In Notion, databases are collections where each row is a page and columns are properties. Returns paginated results with metadata. Important requirements: - The database must be shared with your integration - Property names in sorts must match existing database properties exactly (case-sensitive) - For timestamp sorting, use 'created_time' or 'last_edited_time' (case-insensitive) - The start_cursor must be a valid UUID from a previous response's next_cursor field - Database IDs must be valid 32-character UUIDs (with or without hyphens) Use this action to: - Retrieve all or filtered database entries - Sort results by database properties or page timestamps - Paginate through large result sets - Get database content for processing or display",
    toolSlug: "NOTION_QUERY_DATABASE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              ascending: {
                type: "boolean",
                description: "Sort direction: True for ascending (A→Z, oldest→newest), False for descending (Z→A, newest→oldest).",
              },
              property_name: {
                type: "string",
                description: "The name of a database property/column to sort by, or a timestamp field. For database properties: Must match an EXISTING property name in the database EXACTLY (case-sensitive). For page timestamps: Use 'created_time' or 'last_edited_time' to sort by page creation/modification times. Common timestamp aliases are auto-detected (e.g., 'created time', 'creation time', '创建时间', 'last edited', etc.). IMPORTANT: If sorting by a database property (not a timestamp), the property name must exist in that specific database.",
              },
            },
          },
          description: "List of sort rules to order the database query results. Each sort rule must specify: 'property_name' (name of database property or timestamp field) and 'ascending' (True/False). For database properties: names must match exactly (case-sensitive). For timestamps: use 'created_time' or 'last_edited_time' (case-insensitive). Multiple sorts are applied in the order specified.",
        },
        page_size: {
          type: "integer",
          description: "Number of items (database rows/pages) to return per request. Valid range: 1-100. Default is 100. The API may return fewer items than requested if that's all that's available.",
        },
        database_id: {
          type: "string",
          description: "The UUID of the Notion DATABASE to query (32-character hex string, optionally with hyphens). Query parameters (e.g., ?v=viewid) from Notion URLs are automatically stripped. IMPORTANT: This must be a DATABASE ID, not a page ID. Pages and databases are different object types in Notion. A database is a collection/table that contains pages as rows. If you have a page ID, you cannot use it here. How to obtain a database ID: Use NOTION_SEARCH_NOTION_PAGE with filter_value='database' to list accessible databases, or find it in the Notion URL of a database view (the 32-char ID after the workspace name). Common error: If you receive 'validation_error' with message 'Provided ID is a page, not a database', you have passed a page ID instead of a database ID. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        start_cursor: {
          type: "string",
          description: "A pagination cursor for fetching the next page of results. Must be a valid UUID string (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) obtained from the 'next_cursor' field of a previous query response. Do not use placeholder values. If omitted, returns the first page.",
        },
      },
      required: [
        "database_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_query_database_with_filter",
    description: "Tool to query a Notion database with server-side filtering, sorting, and pagination. Use when you need to retrieve a subset of rows by property, date, status, or other conditions.",
    toolSlug: "NOTION_QUERY_DATABASE_WITH_FILTER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of sort criteria in order of precedence. Use PropertySort for database properties (with property field) and TimestampSort for system timestamps (with timestamp='created_time' or 'last_edited_time'). IMPORTANT: To sort by page creation or last edited time, you MUST use the TimestampSort format with timestamp='created_time' or timestamp='last_edited_time', NOT property names like 'Created' or 'Last Edited'. Common timestamp field name variations (Created, creation time, Last Edited, etc.) will be automatically converted to the correct format.",
        },
        filter: {
          type: "object",
          additionalProperties: true,
          description: "PREREQUISITE: Call NOTION_FETCH_DATABASE first to discover property names and types. Filter type keys MUST match the property's actual type in the schema. Each filter object MUST contain exactly ONE filter type key. For multiple conditions, use compound filters: {\"and\": [{\"property\": \"Name\", \"title\": {...}}, {\"property\": \"Description\", \"rich_text\": {...}}]}. 'title' IS A RESERVED PROPERTY NAME: 'title' always refers to the database's built-in primary title column (type 'title', NOT 'select' or 'rich_text'). Even custom properties named 'title' are treated as the built-in title column. FILTER TYPE MUST MATCH SCHEMA TYPE: Property names are NOT reliable indicators of type. A property named 'Status' could be type 'select' in one database but type 'status' in another. 'select' is for dropdowns; 'status' is ONLY for Notion's built-in Status property with workflow groups. SELECT/STATUS OPTION NAMES MUST MATCH EXACTLY, including emoji prefixes (e.g., '✅ Done' not 'Done'). Valid filter type keys: title, rich_text, number, checkbox, select, multi_select, status, date, people, files, url, email, phone_number, relation, created_by, created_time, last_edited_by, last_edited_time, formula, unique_id, rollup, verification, timestamp. FORMULA FILTERS: Structure: {'property': '<name>', 'formula': {<result_type>: {<condition>: <value>}}}. Result types: 'string' (rich_text conditions), 'number' (numeric conditions), 'date' (date conditions), 'checkbox' (boolean conditions). The result type MUST match the formula's actual output type. If the formula property value shows type 'boolean', use 'checkbox' in the filter (API naming mismatch). Some complex formulas are unfilterable ('Unable to filter based on a formula of unknown type') - use client-side filtering instead. NOTE: 'text' is NOT valid - use 'rich_text' for text properties or 'title' for title properties. SYSTEM TIMESTAMP FILTERS: Use simplified format: {\"created_time\": {\"on_or_after\": \"2024-01-01\"}} - auto-transformed to correct API format. Filter structure for database properties: {\"property\": \"<property_name>\", \"<filter_type>\": {\"<condition>\": \"<value>\"}}. Common conditions by type: title/rich_text: equals, contains, starts_with, ends_with, is_empty, is_not_empty; select/status: equals, does_not_equal, is_empty, is_not_empty; number: equals, does_not_equal, greater_than, less_than, greater_than_or_equal_to, less_than_or_equal_to, is_empty, is_not_empty; checkbox: equals (true/false); date: equals, before, after, on_or_before, on_or_after, is_empty, is_not_empty, past_week, past_month, past_year, next_week, next_month, next_year; relation: contains, does_not_contain (both require a valid page UUID), is_empty, is_not_empty. ROLLUP FILTERS: Require a nested aggregation type wrapper. Do NOT use flat filters like {\"rollup\": {\"contains\": \"value\"}}. Instead use one of: (1) {\"rollup\": {\"any\": {<condition>}}} - matches if ANY related item satisfies condition; (2) {\"rollup\": {\"every\": {<condition>}}} - matches if ALL related items satisfy condition; (3) {\"rollup\": {\"none\": {<condition>}}} - matches if NO related items satisfy condition; (4) {\"rollup\": {\"number\": {<number_condition>}}} - for number rollup aggregations (count, sum, avg, etc.); (5) {\"rollup\": {\"date\": {<date_condition>}}} - for date rollup aggregations (earliest, latest). Inside rollup.any/every/none, use the filter type matching the underlying property type. Compound filters use 'and' or 'or' arrays: {\"and\": [<filter1>, <filter2>]} or {\"or\": [<filter1>, <filter2>]}.",
        },
        page_size: {
          type: "integer",
          description: "Maximum number of items to return (1–100). Defaults to 100 if omitted.",
        },
        database_id: {
          type: "string",
          description: "The UUID of the Notion database to query (32 character hex string, with hyphens or without). IMPORTANT: This must be a DATABASE ID, not a page ID. Page IDs and database IDs are different things. If you have a page URL/ID, that is NOT the same as the database ID - inline databases within pages have their own separate database IDs distinct from the parent page ID. Use NOTION_SEARCH_NOTION_PAGE or NOTION_FETCH_DATABASE to discover the correct database ID. The database must be shared with your integration.",
        },
        start_cursor: {
          type: "string",
          description: "Cursor from a prior response's `next_cursor` for fetching the next page. Must be a valid UUID format (32-character hex string with hyphens or without).",
        },
        composio_execution_message: {
          type: "string",
          description: "Internal message about any automatic conversions made during execution.",
        },
      },
      required: [
        "database_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_replace_page_content",
    description: "Safely replaces a page's child blocks by optionally backing up current content, deleting existing children, then appending new children in batches. Use when you need to rebuild a page without leaving partial states. Notion does not provide atomic transactions; this tool orchestrates a multi-step workflow with optional backup to reduce risk.",
    toolSlug: "NOTION_REPLACE_PAGE_CONTENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dry_run: {
          type: "boolean",
          description: "If True, returns what would be deleted and appended without making any changes. Use to preview the operation.",
        },
        page_id: {
          type: "string",
          description: "The unique identifier (UUID) of the page whose content will be replaced. Must be a valid Notion page ID in UUID format (with or without hyphens).",
        },
        new_children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of block objects to append to the page after clearing existing content. Supported types: paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, to_do, toggle, callout, code, quote, equation, image, video, audio, file, pdf, embed, bookmark, divider, table_of_contents, breadcrumb, column_list, column, table, table_row. Each block MUST include 'type' field and type-specific content. Text blocks must use 'rich_text' array structure with max 2000 chars per text.content. Will be appended in batches of up to 100 blocks to respect Notion API limits.",
        },
        backup_parent: {
          type: "object",
          additionalProperties: true,
          properties: {
            page_id: {
              type: "string",
              description: "UUID of the parent page for the backup. If both page_id and data_source_id are None, the original page's parent will be used.",
            },
            data_source_id: {
              type: "string",
              description: "UUID of the parent data source (database) for the backup. Takes precedence over page_id if both are provided.",
            },
          },
          description: "Parent specification for backup page creation.",
        },
        create_backup: {
          type: "boolean",
          description: "Whether to create a backup page with the current content before replacing it. Strongly recommended when replacing important content.",
        },
        backup_title_suffix: {
          type: "string",
          description: "Suffix to append to the original page title when creating a backup page.",
        },
        archive_existing_children: {
          type: "boolean",
          description: "Whether to delete (archive) existing child blocks before appending new content. Set to False to keep existing content and only append new blocks.",
        },
      },
      required: [
        "page_id",
        "new_children",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Replace page content (with backup).",
    ],
  }),
  composioTool({
    name: "notion_retrieve_comment",
    description: "Tool to retrieve a specific comment by its ID. Use when you have a comment ID and need to fetch its details.",
    toolSlug: "NOTION_RETRIEVE_COMMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment_id: {
          type: "string",
          description: "Identifier for the comment to retrieve.",
        },
      },
      required: [
        "comment_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "comment",
    ],
  }),
  composioTool({
    name: "notion_retrieve_database_property",
    description: "Tool to retrieve a specific property object of a Notion database. Use when you need to get details about a single database column/property.",
    toolSlug: "NOTION_RETRIEVE_DATABASE_PROPERTY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        database_id: {
          type: "string",
          description: "Identifier for the database.",
        },
        property_id: {
          type: "string",
          description: "Identifier for the property. This can be the property ID (e.g., 'GZtn') or the property name (e.g., 'Status'). Supports URL-encoded values (e.g., 'kD%5ER' decodes to 'kD^R'). Property name matching is case-sensitive but supports Unicode normalization for characters that can be represented in multiple ways.",
        },
      },
      required: [
        "database_id",
        "property_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "database",
      "property",
    ],
  }),
  composioTool({
    name: "notion_retrieve_file_upload",
    description: "Tool to retrieve details of a Notion File Upload object by its identifier. Use when you need to check the status or details of an existing file upload.",
    toolSlug: "NOTION_RETRIEVE_FILE_UPLOAD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_upload_id: {
          type: "string",
          description: "The unique identifier (UUID) of the file upload to retrieve.",
        },
      },
      required: [
        "file_upload_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "file_uploads",
    ],
  }),
  composioTool({
    name: "notion_retrieve_page",
    description: "Retrieve a Notion page's properties/metadata (not block content) by page_id. Use when you have a page URL/ID and need to access its properties; for page content use block-children tools.",
    toolSlug: "NOTION_RETRIEVE_PAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The UUID of the Notion page to retrieve. Accepts both hyphenated (8-4-4-4-12) and unhyphenated (32 characters) UUID formats. IMPORTANT: Must be a PAGE ID, not a database ID. If you have a database ID, use NOTION_FETCH_DATABASE instead. This endpoint returns page properties and metadata, not page content (use block-children tools for content). For pages with properties containing more than 25 references, use NOTION_GET_PAGE_PROPERTY_ACTION to retrieve complete property values.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "read",
      "page",
    ],
  }),
  composioTool({
    name: "notion_search_notion_page",
    description: "Searches Notion pages and databases by title. Use specific search terms to find items by title (primary approach). KNOWN LIMITATIONS: (1) Search indexing is not immediate - recently shared items may not appear. (2) Search is not exhaustive - results may be incomplete. (3) Database pages return all custom properties with full nested structures, which can create large responses for databases with many properties - use filter_properties to reduce response size. FALLBACK STRATEGY: If a specific title search returns empty results despite knowing items exist, try an empty query to list all accessible items and filter client-side.",
    toolSlug: "NOTION_SEARCH_NOTION_PAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Text to search for in page and database titles. Use specific search terms to find items by title (primary approach). Note: Notion's search has known limitations - indexing is not immediate and recently shared items may not appear. If a specific query returns empty results, try an empty query as a fallback to list all accessible items and filter client-side.",
        },
        direction: {
          type: "string",
          description: "Specifies the sort direction for the results. Required if `timestamp` is provided. Valid values are `ascending` or `descending`.",
        },
        page_size: {
          type: "integer",
          description: "The number of items to include in the response. Must be an integer between 1 and 100, inclusive. Defaults to 25.",
        },
        timestamp: {
          type: "string",
          description: "The timestamp field to sort the results by. Currently, the only supported value is `last_edited_time`. If provided, `direction` must also be specified.",
        },
        filter_value: {
          type: "string",
          description: "Filters results by object type: 'page' or 'database'. Note: When searching databases, Notion's search may not find recently shared or newly created databases due to indexing delays. If specific database searches return empty results, try an empty query with filter_value='database' as a fallback to list all accessible databases.",
          enum: [
            "page",
            "database",
          ],
        },
        start_cursor: {
          type: "string",
          description: "An opaque cursor value from a previous response's `next_cursor` field. Must be exactly as returned by the API - do not pass page IDs, database IDs, or any other identifiers. If `None`, empty, or invalid, results start from the beginning.",
        },
        filter_property: {
          type: "string",
          description: "The property to filter the search results by. Currently, the only supported value is `object`, which filters by the type specified in `filter_value`. Defaults to `object`.",
        },
        filter_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names to include in the response for page results. When specified, only these properties will be returned in each page's 'properties' object, reducing response size. Useful for database pages with many custom properties. If not specified, all properties are returned. Note: This filter is applied client-side after receiving the API response.",
        },
      },
    },
    tags: [
      "composio",
      "notion",
      "read",
    ],
  }),
  composioTool({
    name: "notion_send_file_upload",
    description: "Tool to transmit file contents to Notion for a file upload object. Use after creating a file upload object to send the actual file data.",
    toolSlug: "NOTION_SEND_FILE_UPLOAD",
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
              description: "The filename that will be used when uploading the file (e.g., 'document.pdf', 'image.jpg').",
            },
            s3key: {
              type: "string",
              description: "A file reference key. Required only when NOT using file_content_base64 or file_path.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file.",
            },
          },
          description: "File information including name and mimetype. FileInfo object where 'name' is the filename (e.g., 'document.pdf', 'test.txt').",
        },
        part_number: {
          type: "integer",
          description: "Required when the file upload mode is 'multi_part'. Indicates which part is being sent (parts are numbered starting from 1). For single-part uploads, omit this parameter.",
        },
        file_upload_id: {
          type: "string",
          description: "Identifier of the file upload object to send data for. This ID is obtained from the Create File Upload action.",
        },
        file_content_base64: {
          type: "string",
          description: "Optional base64-encoded file content. If provided, this will be used instead of downloading from S3 or reading from file_path. Useful for direct file content submission.",
        },
      },
      required: [
        "file_upload_id",
        "file",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "file_uploads",
    ],
    askBefore: [
      "Confirm the parameters before executing Send file upload.",
    ],
  }),
  composioTool({
    name: "notion_update_block",
    description: "Updates existing Notion block's text content. ⚠️ CRITICAL: Content limited to 2000 chars. Cannot change block type or archive blocks. Content exceeding 2000 chars will fail with validation error. For longer content, split across multiple blocks using add_multiple_page_content.",
    toolSlug: "NOTION_UPDATE_BLOCK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        content: {
          type: "string",
          description: "The new text content for the block. Replaces existing text content entirely. ⚠️ CRITICAL: Notion API enforces a HARD LIMIT of 2000 characters per text.content field. Content exceeding 2000 chars will cause a validation error. For longer content, split across multiple blocks using append_block_children or add_multiple_page_content.",
        },
        block_id: {
          type: "string",
          description: "Identifier of the Notion block to be updated. Must be a valid UUID (with or without dashes). To find a block's ID, other Notion actions that list or retrieve blocks can be used. For updating content within a page (which is also a block), its ID can be obtained using actions like `NOTION_FETCH_DATA` to get page IDs and titles.",
        },
        language: {
          type: "string",
          description: "Programming language for code blocks. Required when block_type='code'. Supported values include: 'abap', 'arduino', 'bash', 'basic', 'c', 'clojure', 'coffeescript', 'c++', 'c#', 'css', 'dart', 'diff', 'docker', 'elixir', 'elm', 'erlang', 'flow', 'fortran', 'f#', 'gherkin', 'glsl', 'go', 'graphql', 'groovy', 'haskell', 'html', 'java', 'javascript', 'json', 'julia', 'kotlin', 'latex', 'less', 'lisp', 'livescript', 'lua', 'makefile', 'markdown', 'markup', 'matlab', 'mermaid', 'nix', 'objective-c', 'ocaml', 'pascal', 'perl', 'php', 'plain text', 'powershell', 'prolog', 'protobuf', 'python', 'r', 'reason', 'ruby', 'rust', 'sass', 'scala', 'scheme', 'scss', 'shell', 'sql', 'swift', 'typescript', 'vb.net', 'verilog', 'vhdl', 'visual basic', 'webassembly', 'xml', 'yaml', 'java/c/c++/c#'. If not provided for a code block, the existing language will be preserved.",
        },
        block_type: {
          type: "string",
          description: "The type of the block being updated. If not provided, the action will automatically detect the block type by fetching the block first (adds 1 extra API call). If provided, it must match the EXISTING block's type - you cannot change a block's type. Supported types: 'paragraph', 'heading_1', 'heading_2', 'heading_3', 'bulleted_list_item', 'numbered_list_item', 'to_do', 'toggle', 'code', 'quote', 'callout'.",
        },
        additional_properties: {
          type: "object",
          additionalProperties: true,
          description: "Optional dictionary of type-specific properties. Common examples: 'checked' (boolean) for to_do blocks to mark complete/incomplete, 'color' (string like 'blue_background', 'gray', 'red') for text styling, 'is_toggleable' (boolean) for heading blocks to make them collapsible, 'icon' (object with 'type' and 'emoji' fields) for callout blocks. NOTE: Cannot use 'archived' here - use NOTION_DELETE_BLOCK to remove blocks instead. NOTE: Null/None values are automatically filtered out (omitting a property preserves its existing value).",
        },
      },
      required: [
        "block_id",
        "content",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update block.",
    ],
  }),
  composioTool({
    name: "notion_update_page",
    description: "Update page properties, icon, cover, or archive status. IMPORTANT: Property names are workspace-specific and case-sensitive. Use NOTION_FETCH_ROW or NOTION_FETCH_DATABASE first to discover exact property names and valid select/status options. Common errors: - \"X is not a property that exists\": Discover properties with NOTION_FETCH_ROW - \"Invalid status option\": Check valid options with NOTION_FETCH_DATABASE - \"should be defined\": Wrap values: {'Field': {'type': value}} Property formats: title/rich_text use {'text': {'content': 'value'}}, select/status use {'name': 'option'}",
    toolSlug: "NOTION_UPDATE_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        icon: {
          type: "object",
          additionalProperties: true,
          description: "Page icon object. At least one of properties, archived, icon, or cover is required.",
        },
        cover: {
          type: "object",
          additionalProperties: true,
          description: "Page cover image. Must contain either 'external' (with url) or 'file_upload' key. Empty dicts are treated as no-op. At least one of properties, archived, icon, or cover is required.",
        },
        page_id: {
          type: "string",
          description: "Identifier for the Notion page to be updated. Use 'page_id' as the parameter name (not 'id').",
        },
        archived: {
          type: "boolean",
          description: "Set to true to archive (trash) the page, false to restore. Note: Workspace-level pages (pages in the sidebar that are not inside a database or another page) may not be archivable via the API depending on workspace configuration. Setting archived=true on an already-archived page or a page with an archived ancestor will be handled gracefully (returns current state without error). At least one of properties, archived, icon, or cover is required.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary mapping property names to property value objects. IMPORTANT: Property names are workspace-specific and case-sensitive. Before updating, use NOTION_FETCH_ROW (for database pages) or NOTION_FETCH_DATABASE to discover the exact property names available in your database. Common properties like 'Status', 'Name', or 'Tags' may have different names in your workspace (e.g., 'Task Name', 'Priority'). For status/select properties, valid option values also vary by workspace - check the database schema for available options. Values must be wrapped in property type objects - never send plain values. Example: {'Status': {'select': {'name': 'Done'}}} not {'Status': 'Done'}. For relation properties, IDs must be valid UUIDs (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
      "page",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Page.",
    ],
  }),
  composioTool({
    name: "notion_update_row_database",
    description: "Updates a specific row/page within a Notion database by its page UUID (row_id). IMPORTANT CLARIFICATION: This action updates INDIVIDUAL ROWS (pages) in a database, NOT the database structure. - To update a ROW/PAGE: Use THIS action with `row_id` (the page UUID) - To update DATABASE SCHEMA (columns, properties, title): Use NOTION_UPDATE_SCHEMA_DATABASE with `database_id` REQUIRED: `row_id` is MANDATORY. This is the UUID of the specific page/row to update. Do NOT pass `database_id` to this action - that parameter does not exist here. Common issues: (1) Use UUID from page URL, not the full URL (2) Ensure page is shared with integration (3) Match property names exactly as in database (4) Use 'status' type for Status properties, not 'select' (5) Retry on 409 Conflict errors (concurrent updates) Supports updating properties, icon, cover, or archiving the row.",
    toolSlug: "NOTION_UPDATE_ROW_DATABASE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        icon: {
          type: "string",
          description: "The emoji to be used as the icon for the page. Must be a single emoji character (e.g., '😻', '🤔'). Empty strings or whitespace-only values are ignored.",
        },
        cover: {
          type: "string",
          description: "URL of an external image to be used as the cover for the page (e.g., 'https://google.com/image.png'). Empty strings or whitespace-only values are ignored.",
        },
        row_id: {
          type: "string",
          description: "REQUIRED: The page UUID of the database row to update. This is a PAGE ID (not a database ID). A database row in Notion is actually a page - use the page's UUID here. Format: 32-character UUID with hyphens (e.g., '59833787-2cf9-4fdf-8782-e53db20768a5'). NOT a URL or page title. Find this ID in the page URL or via 'Copy link' in Notion. NOTE: To update DATABASE structure/schema, use NOTION_UPDATE_SCHEMA_DATABASE instead. This action only updates individual rows/pages within a database.",
        },
        delete_row: {
          type: "boolean",
          description: "If true, the row (page) will be archived, effectively deleting it from the active view. If the page is already archived, the action will return success with the current page state. If false, the row will be updated with other provided data.",
        },
        properties: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Name of the property",
              },
              type: {
                type: "string",
                description: "Type of the property. Common types: title (ONE per database), rich_text, number, select (for dropdowns), multi_select, date, people, files, checkbox, url, email, phone_number, relation. ⚠️ IMPORTANT: Use 'select' for dropdown properties - NOT 'status'. The 'status' type is a SPECIAL Notion property type (with 'To-do', 'In progress', 'Complete' groups) that most databases do NOT have. If your property shows a simple dropdown list, use 'select' even if the property is NAMED 'Status'. Read-only/unsupported types (auto-skipped): created_time, created_by, last_edited_time, last_edited_by, formula, rollup, unique_id, place.",
                enum: [
                  "title",
                  "rich_text",
                  "number",
                  "select",
                  "multi_select",
                  "date",
                  "people",
                  "files",
                  "checkbox",
                  "url",
                  "email",
                  "phone_number",
                  "formula",
                  "relation",
                  "rollup",
                  "status",
                  "created_time",
                  "created_by",
                  "last_edited_time",
                  "last_edited_by",
                  "place",
                  "unique_id",
                ],
              },
              value: {
                type: "string",
                description: "Value formatted according to the property type:\n- title, rich_text - text string (max 2000 chars, truncated if longer)\n- number - numeric string ex. \"23.4\"\n- select - single option name (no commas). For multiple values, use multi_select.\n- multi_select - comma separated values ex. \"India,USA\"\n- date - ISO 8601. Single: \"2021-05-11\". Range: \"2021-05-11/2021-05-15\" (slash-separated).\n- people - comma separated USER UUIDs (not names). Use NOTION_LIST_USERS to find UUIDs.\n- relation - comma separated PAGE UUIDs (not titles). Use NOTION_QUERY_DATABASE to find UUIDs.\n- url - a URL string.\n- files - comma separated HTTPS URLs only (no file:// or http://).\n- checkbox - \"True\" or \"False\"\n",
              },
            },
          },
          description: "List of properties to update. Each property requires: (1) 'name' - exact property name as shown in Notion, (2) 'type' - the property type (title, rich_text, number, select, status, multi_select, date, people, relation, checkbox, url, email, phone_number, files), (3) 'value' - formatted according to type. IMPORTANT: Verify property names exist in the database and match the exact case. Use 'status' type for Status properties, NOT 'select'. Properties not listed will remain unchanged.",
        },
      },
      required: [
        "row_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Update Database Row (Page).",
    ],
  }),
  composioTool({
    name: "notion_update_schema_database",
    description: "Updates an existing Notion database's schema including title, description, and/or properties (columns). IMPORTANT NOTES: - At least one update (title, description, or properties) must be provided - The database must be shared with your integration - Property names are case-sensitive and must match exactly - When changing a property to 'relation' type, you MUST provide the database_id of the target database - Removing properties will permanently delete that column and its data - Use NOTION_FETCH_DATA first to get the exact property names and database structure Common errors: - 'database_id' missing: Ensure you're passing the database_id parameter (not page_id) - 'data_source_id' undefined: When changing to relation type, database_id is required in PropertySchemaUpdate - Property name mismatch: Names must match exactly including case and special characters",
    toolSlug: "NOTION_UPDATE_SCHEMA_DATABASE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "New title for the database. Leave as None or omit to keep the existing title unchanged. This updates the database name visible in Notion. At least one of (title, description, or properties) must be provided.",
        },
        properties: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Name of the existing property to update. This must match the exact case-sensitive name of the property in the database.",
              },
              remove: {
                type: "boolean",
                description: "Set to true to remove this property from the database. Cannot be combined with other updates.",
              },
              rename: {
                type: "string",
                description: "New name for the property. If None (default), the name remains unchanged.",
              },
              new_type: {
                type: "string",
                description: "New type for the property. If None (default), the type remains unchanged. IMPORTANT: When changing to 'relation' type, you MUST also provide 'database_id'. NOTE: Title properties CANNOT be changed to a different type - every Notion database must have exactly one title property. If you need to rename the title property, use 'rename' instead of 'new_type'.",
                enum: [
                  "title",
                  "rich_text",
                  "number",
                  "select",
                  "multi_select",
                  "date",
                  "people",
                  "files",
                  "checkbox",
                  "url",
                  "email",
                  "phone_number",
                  "formula",
                  "relation",
                  "rollup",
                  "status",
                  "created_time",
                  "created_by",
                  "last_edited_time",
                  "last_edited_by",
                  "place",
                  "unique_id",
                ],
              },
              database_id: {
                type: "string",
                description: "ID of the database to relate to. REQUIRED when new_type is 'relation'. This is the UUID of the target database that this relation property will link to. The target database must be shared with your integration.",
              },
              relation_type: {
                type: "string",
                description: "Type of relation when new_type is 'relation'. Either 'single_property' or 'dual_property'. Defaults to 'single_property'.",
              },
            },
          },
          description: "List of property (column) updates for the database schema. At least one of (title, description, or properties) must be provided. Each PropertySchemaUpdate must specify: \n1) 'name': The EXACT case-sensitive name of the existing property\n2) One of these actions:\n   - 'rename': Change the property name\n   - 'new_type': Change the property type (see PropertySchemaUpdate for valid types)\n   - 'remove': Set to true to delete the property\nIMPORTANT: When changing a property to 'relation' type, you MUST also provide 'database_id' with the UUID of the target database to link to.\nExample: [{'name': 'Status', 'new_type': 'select'}, {'name': 'Tasks', 'new_type': 'relation', 'database_id': 'abc123...'}]",
        },
        database_id: {
          type: "string",
          description: "REQUIRED: The UUID identifier of the Notion database to update. IMPORTANT: This must be a DATABASE ID, not a page ID. Page IDs and database IDs are both UUIDs but they are NOT interchangeable - passing a page ID will result in an error. Use NOTION_FETCH_DATA with get_databases=true to get available database IDs. Format: UUID with or without hyphens (e.g., 'd9824bdc-8445-4327-be8b-554d41f30b60'). The database must be shared with your integration. NOTE: At least one of (title, description, or properties) must also be provided to perform an update.",
        },
        description: {
          type: "string",
          description: "New description for the database. Leave as None or omit to keep the existing description unchanged. This updates the description text shown below the database title. At least one of (title, description, or properties) must be provided.",
        },
      },
      required: [
        "database_id",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update database schema.",
    ],
  }),
  composioTool({
    name: "notion_upsert_row_database",
    description: "Tool to upsert rows in a Notion database by querying for existing rows and creating or updating them. Use when you need to sync data to Notion without creating duplicates. Each item is matched by a filter, then either created (if no match) or updated (if match found). Supports bulk operations with per-item error handling.",
    toolSlug: "NOTION_UPSERT_ROW_DATABASE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              match: {
                type: "string",
                description: "Filter to find existing row. Can be simplified {'property': 'Email', 'equals': 'user@example.com'} or full Notion filter object.",
              },
              create: {
                type: "object",
                additionalProperties: true,
                properties: {
                  icon: {
                    type: "string",
                    description: "Icon for the page. Either emoji: {'type': 'emoji', 'emoji': '🎉'} or external image: {'type': 'external', 'external': {'url': 'https://...'}}",
                  },
                  cover: {
                    type: "string",
                    description: "Cover image for the page: {'type': 'external', 'external': {'url': 'https://...'}}",
                  },
                  children: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Array of block objects to add as page content. Each block has 'type' and a corresponding content object. Supported types: paragraph, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item, to_do, toggle, code, quote, callout, divider.",
                  },
                  properties: {
                    type: "object",
                    additionalProperties: true,
                    description: "Property values for the new page. Keys are property names, values are property value objects. Supported types: title, rich_text, number, select, multi_select, status, date, people, files, checkbox, url, email, phone_number, relation. Format: {'PropertyName': {'type_name': value}}. Example: {'Name': {'title': [{'text': {'content': 'Page Title'}}]}, 'Status': {'select': {'name': 'Done'}}, 'Count': {'number': 42}}",
                  },
                },
                description: "Payload to use when creating a new page if no match is found.",
              },
              update: {
                type: "object",
                additionalProperties: true,
                properties: {
                  icon: {
                    type: "string",
                    description: "Icon for the page. Either emoji: {'type': 'emoji', 'emoji': '🎉'} or external image: {'type': 'external', 'external': {'url': 'https://...'}}",
                  },
                  cover: {
                    type: "string",
                    description: "Cover image for the page: {'type': 'external', 'external': {'url': 'https://...'}}",
                  },
                  archived: {
                    type: "boolean",
                    description: "Set to true to archive the page, false to restore.",
                  },
                  properties: {
                    type: "object",
                    additionalProperties: true,
                    description: "Property values to update. Keys are property names, values are property value objects. Only properties specified will be updated; others remain unchanged. Format: {'PropertyName': {'type_name': value}}. Example: {'Status': {'select': {'name': 'Done'}}, 'Count': {'number': 42}}",
                  },
                },
                description: "Payload to use when updating an existing page if a match is found.",
              },
            },
            description: "Single upsert item containing match criteria and create/update payloads.",
          },
          description: "Array of items to upsert. Each item contains match criteria and create/update payloads.",
        },
        options: {
          type: "object",
          additionalProperties: true,
          properties: {
            continue_on_error: {
              type: "boolean",
              description: "If true, continue processing remaining items after an error; if false, stop on first error.",
            },
            if_multiple_matches: {
              type: "string",
              description: "Behavior when multiple matches are found: 'error' raises an error, 'update_first' updates the first result.",
              enum: [
                "error",
                "update_first",
              ],
            },
          },
          description: "Options controlling upsert behavior.",
        },
        database_id: {
          type: "string",
          description: "UUID of the Notion database (legacy). If provided without data_source_id, will attempt to resolve to data_source_id. Only safe for single-source databases.",
        },
        data_source_id: {
          type: "string",
          description: "UUID of the Notion data source (preferred). Required if database_id is not provided.",
        },
      },
      required: [
        "items",
      ],
    },
    tags: [
      "composio",
      "notion",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upsert database rows.",
    ],
  }),
];
