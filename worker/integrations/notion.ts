/**
 * Notion integration handler
 */

import { BaseIntegration, defineTool, type IntegrationTool, registerHandler } from "./base";

class NotionHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "search", {
        description: "Search pages and databases in Notion",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            filter: {
              type: "object",
              properties: {
                value: { type: "string", enum: ["page", "database"], description: "Filter by object type" },
                property: { type: "string", description: "Property to filter on" },
              },
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
        safeDefaults: {
          pageSize: 10,
        },
        examples: [
          {
            user: "what pages can you see in notion",
            args: {
              query: "",
              filter: { value: "page" },
              pageSize: 10,
            },
          },
        ],
        followups: [
          "Offer to fetch a selected page.",
          "Offer to query a selected database if the user wants records.",
        ],
      }),
      defineTool(integrationSlug, "get_page", {
        description: "Get a page by ID",
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
          {
            user: "open the onboarding page in notion",
            args: {
              pageId: "32-character-page-id",
            },
          },
        ],
        followups: [
          "Offer to append content to the page.",
          "Offer to search for related pages or databases.",
        ],
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
            args: {
              parent: "parent-page-or-database-id",
              title: "Weekly recap",
              content: "## Highlights\n- Launch shipped",
            },
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
        safeDefaults: {
          pageSize: 10,
        },
        examples: [
          {
            user: "show the latest tasks in my notion project tracker",
            args: {
              databaseId: "database-id",
              pageSize: 10,
            },
          },
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
            args: {
              parentPageId: "parent-page-id",
              title: "Interview candidates",
              properties: {
                Name: { title: {} },
              },
            },
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
            args: {
              pageId: "page-id",
              content: "## Meeting notes\n- Confirmed launch checklist",
            },
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
      query: args.query,
      page_size: Math.min(Number(args.pageSize) || 10, 100),
    };

    if (args.filter) {
      body.filter = args.filter;
    }

    const response = await this.apiRequest(
      "https://api.notion.com/v1/search",
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to search", response);
    }

    return response.json();
  }

  private async getPage(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const pageId = args.pageId as string;

    const response = await this.apiRequest(
      `https://api.notion.com/v1/pages/${pageId}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get page", response);
    }

    return response.json();
  }

  private async createPage(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const parent = args.parent as string;
    const body: Record<string, unknown> = {};

    // Determine if parent is a database or page
    if (parent.length === 32) {
      // Likely a database ID
      body.parent = { database_id: parent };
    } else {
      body.parent = { page_id: parent };
    }

    // Add title if provided (for database pages)
    if (args.title) {
      body.properties = {
        Name: {
          title: [{ text: { content: args.title } }],
        },
      };
    }

    // Add content as children if provided
    if (args.content) {
      body.children = this.markdownToBlocks(args.content as string);
    }

    const response = await this.apiRequest(
      "https://api.notion.com/v1/pages",
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create page", response);
    }

    return response.json();
  }

  private async queryDatabase(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const databaseId = args.databaseId as string;
    const body: Record<string, unknown> = {};

    if (args.filter) {
      body.filter = args.filter;
    }
    if (args.sorts) {
      body.sorts = args.sorts;
    }
    body.page_size = Math.min(Number(args.pageSize) || 10, 100);

    const response = await this.apiRequest(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to query database", response);
    }

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

    if (!response.ok) {
      throw await this.createApiError("Failed to create database", response);
    }

    return response.json();
  }

  private async appendBlocks(args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown> {
    const pageId = args.pageId as string;
    const content = args.content as string;

    const body = {
      children: this.markdownToBlocks(content),
    };

    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      { method: "POST", body: JSON.stringify(body) },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to append blocks", response);
    }

    return response.json();
  }

  private markdownToBlocks(markdown: string): unknown[] {
    const lines = markdown.split("\n");
    const blocks: unknown[] = [];

    for (const line of lines) {
      if (line.startsWith("### ")) {
        blocks.push({
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [{ type: "text", text: { content: line.slice(4) } }],
          },
        });
      } else if (line.startsWith("## ")) {
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: line.slice(3) } }],
          },
        });
      } else if (line.startsWith("# ")) {
        blocks.push({
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{ type: "text", text: { content: line.slice(2) } }],
          },
        });
      } else if (line.startsWith("- ")) {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: line.slice(2) } }],
          },
        });
      } else if (line.trim()) {
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: line } }],
          },
        });
      }
    }

    return blocks;
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    return new Error(`${prefix}: ${body?.message ?? response.statusText}`);
  }
}

registerHandler("notion", new NotionHandler());
