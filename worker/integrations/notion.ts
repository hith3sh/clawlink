/**
 * Notion integration handler
 */

import { BaseIntegration, type IntegrationTool, registerHandler } from "./base";

class NotionHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    const prefix = `${integrationSlug}_`;

    return [
      {
        name: `${prefix}search`,
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
      },
      {
        name: `${prefix}get_page`,
        description: "Get a page by ID",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID (32 characters)" },
          },
          required: ["pageId"],
        },
      },
      {
        name: `${prefix}create_page`,
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
      },
      {
        name: `${prefix}query_database`,
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
      },
      {
        name: `${prefix}create_database`,
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
      },
      {
        name: `${prefix}append_blocks`,
        description: "Append blocks to a page",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID" },
            content: { type: "string", description: "Content to append (markdown)" },
          },
          required: ["pageId", "content"],
        },
      },
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