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
    integration: "notion",
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
      toolkit: "notion",
      toolSlug: partial.toolSlug,
      version: "20260501_00",
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
