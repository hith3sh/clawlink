import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  registerHandler,
} from "./base";

function joinRichText(richText: unknown): string {
  if (!Array.isArray(richText)) return "";
  return richText
    .map((rt: any) => (typeof rt?.plain_text === "string" ? rt.plain_text : ""))
    .join("");
}

function extractPageTitle(properties: any): string | null {
  if (!properties || typeof properties !== "object") return null;
  for (const value of Object.values(properties)) {
    const prop: any = value;
    if (prop?.type === "title" && Array.isArray(prop.title)) {
      const title = joinRichText(prop.title);
      if (title) return title;
    }
  }
  return null;
}

function summarizeSearchItem(item: any) {
  const type = item?.object === "database" ? "database" : "page";
  const title =
    type === "database"
      ? joinRichText(item?.title) || null
      : extractPageTitle(item?.properties);
  return {
    id: item?.id ?? null,
    type,
    title,
    url: item?.url ?? null,
    lastEditedTime: item?.last_edited_time ?? null,
    parent: item?.parent ?? null,
  };
}

function summarizeBlock(block: any) {
  const type: string = block?.type ?? "unknown";
  const content = block?.[type] ?? {};
  let text: string | null = null;
  if (Array.isArray(content?.rich_text)) {
    text = joinRichText(content.rich_text) || null;
  } else if (type === "child_page" || type === "child_database") {
    text = typeof content?.title === "string" ? content.title : null;
  }
  const summary: Record<string, unknown> = {
    id: block?.id ?? null,
    type,
    text,
    hasChildren: Boolean(block?.has_children),
  };
  if (type === "to_do") {
    summary.checked = Boolean(content?.checked);
  }
  return summary;
}

class NotionHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "search", {
        description: "Search pages and databases in Notion. Returns a compact list with { id, type, title, url } — use the id directly with notion_get_blocks or notion_query_database.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (use empty string to list recent items)" },
            objectType: {
              type: "string",
              enum: ["page", "database"],
              description: "Optional: restrict results to pages or databases only",
            },
            pageSize: { type: "number", description: "Number of results (default 10, max 100)" },
          },
          required: ["query"],
        },
        accessLevel: "read",
        tags: ["search", "pages", "databases"],
        whenToUse: [
          "User asks what pages or databases are available in Notion.",
          "User wants to find a page or database before reading or updating it.",
        ],
        askBefore: [
          "Ask which workspace or object they mean if the request is vague and multiple matches are likely.",
        ],
        safeDefaults: { pageSize: 10 },
        examples: [
          { user: "what pages can you see in notion", args: { query: "", objectType: "page", pageSize: 10 } },
        ],
        followups: [
          "Use the returned id with notion_get_blocks to read content.",
          "Use the returned id with notion_query_database if it is a database.",
        ],
      }),
      defineTool(integrationSlug, "get_page", {
        description: "Get page metadata and properties by ID (use get_blocks to read the actual page content)",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID (32 characters)" },
          },
          required: ["pageId"],
        },
        accessLevel: "read",
        tags: ["page", "lookup", "content"],
        whenToUse: [
          "User wants the contents or metadata of a specific Notion page.",
          "A prior search returned a page id and the next step is to inspect it.",
        ],
        askBefore: [
          "Ask which page they mean if they have not identified a specific page yet.",
        ],
        examples: [
          { user: "open the onboarding page in notion", args: { pageId: "32-character-page-id" } },
        ],
        followups: [
          "Offer to append content to the page.",
          "Offer to search for related pages or databases.",
        ],
      }),
      defineTool(integrationSlug, "get_blocks", {
        description: "Get the content blocks of a page or block. Returns a compact list with { id, type, text, hasChildren, checked? } — use the id with notion_update_block or recurse into children.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Page ID or block ID to retrieve children from" },
            pageSize: { type: "number", description: "Number of blocks to return (default 50, max 100)" },
            startCursor: { type: "string", description: "Cursor for pagination (from previous response)" },
          },
          required: ["blockId"],
        },
        accessLevel: "read",
        tags: ["page", "blocks", "content", "read"],
        whenToUse: [
          "User wants to read the actual content of a Notion page.",
          "A prior search or get_page call identified a page and the user wants to see what is inside it.",
        ],
        askBefore: [
          "Ask which page they mean if they have not identified a specific page yet.",
        ],
        safeDefaults: { pageSize: 50 },
        examples: [
          { user: "show me what's on the onboarding page", args: { blockId: "page-id-from-search", pageSize: 50 } },
        ],
        followups: [
          "Offer to fetch nested blocks if a block has children.",
          "Offer to use notion_update_block to check off a to_do item.",
          "Offer to append new content to the page.",
        ],
      }),
      defineTool(integrationSlug, "update_block", {
        description: "Update an existing Notion block — mark a to-do as done/undone, or rewrite its text. Use this to check off to-do items.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Block ID from notion_get_blocks" },
            checked: { type: "boolean", description: "For to_do blocks: true to mark done, false to un-check" },
            text: { type: "string", description: "Replace the block's text content" },
          },
          required: ["blockId"],
        },
        accessLevel: "write",
        tags: ["block", "update", "checkbox", "edit"],
        whenToUse: [
          "User wants to mark a to-do item as complete or incomplete.",
          "User wants to rewrite the text of an existing block.",
        ],
        askBefore: [
          "Confirm before editing text in a shared document if the change is substantive.",
        ],
        examples: [
          { user: "mark Norway as done", args: { blockId: "block-id-from-get-blocks", checked: true } },
          { user: "rename that heading to Q2 goals", args: { blockId: "heading-block-id", text: "Q2 goals" } },
        ],
        followups: [
          "Offer to fetch the block's parent page again to confirm the change.",
        ],
      }),
      defineTool(integrationSlug, "update_page_properties", {
        description: "Update properties of a Notion page, typically a database row — e.g. change a Status select, Date, or title.",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID" },
            properties: {
              type: "object",
              description: "Notion properties object keyed by property name, e.g. { Status: { select: { name: 'Done' } } }",
            },
          },
          required: ["pageId", "properties"],
        },
        accessLevel: "write",
        tags: ["page", "properties", "update", "database-row"],
        whenToUse: [
          "User wants to change a status, date, title, or other property on a database row.",
        ],
        askBefore: [
          "Ask which property to change if the user's wording is ambiguous.",
        ],
        examples: [
          {
            user: "set the status of that task to Done",
            args: { pageId: "page-id", properties: { Status: { select: { name: "Done" } } } },
          },
        ],
        followups: ["Offer to fetch the page again so the user can verify."],
      }),
      defineTool(integrationSlug, "delete_block", {
        description: "Delete (archive) a Notion block. Notion moves deleted blocks to the trash.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Block ID to delete" },
          },
          required: ["blockId"],
        },
        accessLevel: "write",
        tags: ["block", "delete", "archive"],
        whenToUse: ["User explicitly asks to delete or remove a specific block."],
        askBefore: ["Always confirm before deleting, especially in shared documents."],
        examples: [
          { user: "delete that block", args: { blockId: "block-id" } },
        ],
        followups: ["Offer to fetch the parent page so the user can confirm removal."],
      }),
      defineTool(integrationSlug, "create_page", {
        description: "Create a new page",
        inputSchema: {
          type: "object",
          properties: {
            parent: { type: "string", description: "Parent page ID or database ID" },
            title: { type: "string", description: "Page title (for database pages)" },
            content: { type: "string", description: "Page content (markdown)" },
            properties: { type: "object", description: "Page properties (for database pages)" },
          },
          required: ["parent"],
        },
        accessLevel: "write",
        tags: ["page", "create", "content"],
        whenToUse: [
          "User explicitly asks to create a page in Notion.",
          "User wants a new database row-like page created under a parent database or page.",
        ],
        askBefore: [
          "Ask which parent page or database should own the new page if it is not explicit.",
          "Ask for missing title or content details before creating the page.",
        ],
        examples: [
          {
            user: "create a notion page called Weekly recap under the team wiki",
            args: { parent: "parent-page-or-database-id", title: "Weekly recap", content: "## Highlights\n- Launch shipped" },
          },
        ],
        followups: [
          "Offer to append more content.",
          "Offer to create a related database if they need structured records.",
        ],
      }),
      defineTool(integrationSlug, "query_database", {
        description: "Query a database",
        inputSchema: {
          type: "object",
          properties: {
            databaseId: { type: "string", description: "Database ID" },
            filter: { type: "object", description: "Notion filter object" },
            sorts: { type: "array", description: "Sort options" },
            pageSize: { type: "number", description: "Number of results (default 10, max 100)" },
          },
          required: ["databaseId"],
        },
        accessLevel: "read",
        tags: ["database", "query", "records"],
        whenToUse: [
          "User wants rows or records from a specific Notion database.",
          "A previous search identified the database and the next step is to inspect entries.",
        ],
        askBefore: [
          "Ask which database they mean if they have not picked one yet.",
          "Ask for filters or sorting only when the user needs something more specific than a short recent list.",
        ],
        safeDefaults: { pageSize: 10 },
        examples: [
          { user: "show the latest tasks in my notion project tracker", args: { databaseId: "database-id", pageSize: 10 } },
        ],
        followups: [
          "Offer to fetch or update a selected record page.",
          "Offer to refine with filters or sorts.",
        ],
      }),
      defineTool(integrationSlug, "create_database", {
        description: "Create a new database",
        inputSchema: {
          type: "object",
          properties: {
            parentPageId: { type: "string", description: "Parent page ID" },
            title: { type: "string", description: "Database title" },
            properties: { type: "object", description: "Database properties schema" },
          },
          required: ["parentPageId", "title"],
        },
        accessLevel: "write",
        tags: ["database", "create", "schema"],
        whenToUse: [
          "User explicitly asks to create a new Notion database.",
          "User needs a structured table-like workspace under a parent page.",
        ],
        askBefore: [
          "Ask which parent page should contain the database if it is not explicit.",
          "Ask for the properties schema if the user has not described the columns yet.",
        ],
        examples: [
          {
            user: "create a notion database for interview candidates under recruiting",
            args: { parentPageId: "parent-page-id", title: "Interview candidates", properties: { Name: { title: {} } } },
          },
        ],
        followups: [
          "Offer to add an initial page or record.",
          "Offer to query the database once it exists.",
        ],
      }),
      defineTool(integrationSlug, "append_blocks", {
        description: "Append blocks to a page",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID" },
            content: { type: "string", description: "Content to append (markdown)" },
          },
          required: ["pageId", "content"],
        },
        accessLevel: "write",
        tags: ["page", "append", "content"],
        whenToUse: [
          "User wants to add notes, checklist items, or other content to an existing Notion page.",
          "A previous read step identified the page and the next step is to extend it.",
        ],
        askBefore: [
          "Ask which page to update if they have not named it clearly.",
          "Confirm before appending if the content might modify an important shared document unexpectedly.",
        ],
        examples: [
          {
            user: "append today's meeting notes to the launch page",
            args: { pageId: "page-id", content: "## Meeting notes\n- Confirmed launch checklist" },
          },
        ],
        followups: [
          "Offer to fetch the page again so the user can verify the new content.",
          "Offer to create a related follow-up page if the notes need their own document.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      "Authorization": `Bearer ${credentials.integrationToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "search":
        return this.search(args, credentials);
      case "get_page":
        return this.getPage(args, credentials);
      case "get_blocks":
        return this.getBlocks(args, credentials);
      case "update_block":
        return this.updateBlock(args, credentials);
      case "update_page_properties":
        return this.updatePageProperties(args, credentials);
      case "delete_block":
        return this.deleteBlock(args, credentials);
      case "create_page":
        return this.createPage(args, credentials);
      case "query_database":
        return this.queryDatabase(args, credentials);
      case "create_database":
        return this.createDatabase(args, credentials);
      case "append_blocks":
        return this.appendBlocks(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        "https://api.notion.com/v1/users/me",
        { method: "GET" },
        credentials,
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  private async search(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const body: Record<string, unknown> = {
      query: args.query ?? "",
      page_size: Math.min(Number(args.pageSize) || 10, 100),
    };
    const objectType = args.objectType;
    if (objectType === "page" || objectType === "database") {
      body.filter = { property: "object", value: objectType };
    }

    const response = await this.apiRequest(
      "https://api.notion.com/v1/search",
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to search", response);

    const raw: any = await response.json();
    return {
      results: Array.isArray(raw?.results) ? raw.results.map(summarizeSearchItem) : [],
      nextCursor: raw?.next_cursor ?? null,
      hasMore: Boolean(raw?.has_more),
    };
  }

  private async getPage(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const pageId = args.pageId as string;
    const response = await this.apiRequest(
      `https://api.notion.com/v1/pages/${pageId}`,
      { method: "GET" },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to get page", response);
    return response.json();
  }

  private async getBlocks(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const blockId = args.blockId as string;
    const pageSize = Math.min(Number(args.pageSize) || 50, 100);
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set("page_size", String(pageSize));
    if (args.startCursor) url.searchParams.set("start_cursor", args.startCursor as string);

    const response = await this.apiRequest(url.toString(), { method: "GET" }, credentials);
    if (!response.ok) throw await this.createApiError("Failed to get blocks", response);

    const raw: any = await response.json();
    return {
      blocks: Array.isArray(raw?.results) ? raw.results.map(summarizeBlock) : [],
      nextCursor: raw?.next_cursor ?? null,
      hasMore: Boolean(raw?.has_more),
    };
  }

  private async updateBlock(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const blockId = args.blockId as string;
    const checked = args.checked;
    const text = args.text;

    if (!blockId) throw new Error("blockId is required");
    if (typeof checked !== "boolean" && typeof text !== "string") {
      throw new Error("Provide at least one of: checked (boolean), text (string)");
    }

    // Fetch the block to discover its type — PATCH body must be keyed by it
    const getResponse = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "GET" },
      credentials,
    );
    if (!getResponse.ok) throw await this.createApiError("Failed to fetch block", getResponse);
    const block: any = await getResponse.json();
    const type: string = block?.type;
    if (!type) throw new Error("Could not determine block type from Notion response");

    const typeBody: Record<string, unknown> = {};
    if (typeof checked === "boolean") {
      if (type !== "to_do") throw new Error(`checked can only be set on to_do blocks (this block is ${type})`);
      typeBody.checked = checked;
    }
    if (typeof text === "string") {
      typeBody.rich_text = [{ type: "text", text: { content: text } }];
    }

    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "PATCH", body: JSON.stringify({ [type]: typeBody }) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to update block", response);
    return summarizeBlock(await response.json());
  }

  private async updatePageProperties(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const pageId = args.pageId as string;
    const properties = args.properties;
    if (!pageId) throw new Error("pageId is required");
    if (!properties || typeof properties !== "object") throw new Error("properties must be an object");

    const response = await this.apiRequest(
      `https://api.notion.com/v1/pages/${pageId}`,
      { method: "PATCH", body: JSON.stringify({ properties }) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to update page properties", response);
    const raw: any = await response.json();
    return {
      id: raw?.id ?? pageId,
      url: raw?.url ?? null,
      lastEditedTime: raw?.last_edited_time ?? null,
      title: extractPageTitle(raw?.properties),
    };
  }

  private async deleteBlock(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const blockId = args.blockId as string;
    if (!blockId) throw new Error("blockId is required");

    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "DELETE" },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to delete block", response);
    return { id: blockId, archived: true };
  }

  private async createPage(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const parent = args.parent as string;
    const body: Record<string, unknown> = {};

    if (parent.length === 32) {
      body.parent = { database_id: parent };
    } else {
      body.parent = { page_id: parent };
    }

    if (args.title) {
      body.properties = {
        Name: { title: [{ text: { content: args.title } }] },
      };
    }

    if (args.content) {
      body.children = this.markdownToBlocks(args.content as string);
    }

    const response = await this.apiRequest(
      "https://api.notion.com/v1/pages",
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to create page", response);
    return response.json();
  }

  private async queryDatabase(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const databaseId = args.databaseId as string;
    const body: Record<string, unknown> = {};

    if (args.filter) body.filter = args.filter;
    if (args.sorts) body.sorts = args.sorts;
    body.page_size = Math.min(Number(args.pageSize) || 10, 100);

    const response = await this.apiRequest(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to query database", response);
    return response.json();
  }

  private async createDatabase(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const body = {
      parent: { page_id: args.parentPageId },
      title: [{ type: "text", text: { content: args.title as string } }],
      properties: args.properties || {},
    };

    const response = await this.apiRequest(
      "https://api.notion.com/v1/databases",
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to create database", response);
    return response.json();
  }

  private async appendBlocks(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const pageId = args.pageId as string;
    const content = args.content as string;
    const body = { children: this.markdownToBlocks(content) };

    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );
    if (!response.ok) throw await this.createApiError("Failed to append blocks", response);
    return response.json();
  }

  private markdownToBlocks(markdown: string): unknown[] {
    const lines = markdown.split("\n");
    const blocks: unknown[] = [];

    for (const line of lines) {
      if (line.startsWith("### ")) {
        blocks.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] } });
      } else if (line.startsWith("## ")) {
        blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } });
      } else if (line.startsWith("# ")) {
        blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      } else if (line.startsWith("- ")) {
        blocks.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      } else if (line.trim()) {
        blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: line } }] } });
      }
    }

    return blocks;
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    const error = new Error(`${prefix}: ${response.status} ${body?.message ?? response.statusText}`);
    (error as unknown as Record<string, unknown>).status = response.status;
    return error;
  }
}

registerHandler("notion", new NotionHandler());
