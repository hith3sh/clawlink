import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const FACEBOOK_GRAPH_BASE = "https://graph.facebook.com/v21.0";

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

class FacebookHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "get_page", {
        description: "Get Facebook Page info for the connected account",
        inputSchema: { type: "object", properties: {} },
        accessLevel: "read",
        tags: ["facebook", "page", "info"],
        whenToUse: [
          "User wants to see their Facebook Page details.",
          "You need the page ID before creating or listing posts.",
        ],
        followups: [
          "Offer to list posts or create a new post.",
        ],
      }),
      defineTool(integrationSlug, "list_posts", {
        description: "List posts from the connected Facebook Page",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of posts to return (max 100)" },
          },
        },
        accessLevel: "read",
        tags: ["facebook", "post", "list", "history"],
        safeDefaults: { limit: 10 },
        whenToUse: [
          "User wants to see recent posts on their Facebook Page.",
        ],
        followups: [
          "Offer to delete a post or create a new one.",
        ],
      }),
      defineTool(integrationSlug, "create_post", {
        description: "Publish a post on the connected Facebook Page",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Post text content" },
            link: { type: "string", description: "Optional URL to attach to the post" },
          },
          required: ["message"],
        },
        accessLevel: "write",
        tags: ["facebook", "post", "publish"],
        whenToUse: [
          "User wants to publish a post to their Facebook Page.",
        ],
        askBefore: [
          "Confirm the post content before publishing if the user drafted it conversationally.",
        ],
        examples: [
          {
            user: "post this to Facebook: Check out our new product!",
            args: { message: "Check out our new product!" },
          },
        ],
        followups: [
          "Offer to list recent posts to verify it was published.",
        ],
      }),
      defineTool(integrationSlug, "delete_post", {
        description: "Delete a post from the connected Facebook Page",
        inputSchema: {
          type: "object",
          properties: {
            postId: { type: "string", description: "Facebook post ID to delete" },
          },
          required: ["postId"],
        },
        accessLevel: "destructive",
        tags: ["facebook", "post", "delete"],
        whenToUse: [
          "User explicitly asks to delete a Facebook Page post.",
        ],
        askBefore: [
          "Confirm the exact post before deleting, since this cannot be undone.",
        ],
      }),
      defineTool(integrationSlug, "get_post_insights", {
        description: "Get engagement insights for a Facebook Page post",
        inputSchema: {
          type: "object",
          properties: {
            postId: { type: "string", description: "Facebook post ID" },
            metrics: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of specific metrics to request (e.g. post_impressions, post_engaged_users)",
            },
          },
          required: ["postId"],
        },
        accessLevel: "read",
        tags: ["facebook", "post", "insights", "analytics"],
        whenToUse: [
          "User wants to see how a Facebook post is performing.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token ?? "";
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "get_page":
        return this.getPage(credentials);
      case "list_posts":
        return this.listPosts(args, credentials);
      case "create_post":
        return this.createPost(args, credentials);
      case "delete_post":
        return this.deletePost(args, credentials);
      case "get_post_insights":
        return this.getPostInsights(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const token = credentials.accessToken ?? credentials.access_token ?? credentials.token ?? "";
      const response = await fetch(`${FACEBOOK_GRAPH_BASE}/me?access_token=${encodeURIComponent(token)}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  private getToken(credentials: Record<string, string>): string {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token;
    if (!token) {
      throw new Error("Facebook access token is required");
    }
    return String(token);
  }

  private async getPage(credentials: Record<string, string>): Promise<unknown> {
    const token = this.getToken(credentials);
    const fields = "id,name,category,category_list,fan_count,link,picture,about,description,website,emails,phone";
    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/me?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Facebook Page", response);
    }

    return response.json();
  }

  private async listPosts(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const token = this.getToken(credentials);
    const limit = Math.min(typeof args.limit === "number" ? args.limit : 10, 100);
    const fields = "id,message,created_time,full_picture,permalink_url,attachments,status_type,likes.summary(true),comments.summary(true),shares";
    const pageId = await this.resolvePageId(credentials);

    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/${pageId}/posts?fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${encodeURIComponent(token)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Facebook posts", response);
    }

    return response.json();
  }

  private async createPost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const token = this.getToken(credentials);
    const message = requireString(args.message, "message");
    const pageId = await this.resolvePageId(credentials);

    const payload: Record<string, string> = {
      message,
      access_token: token,
    };

    const link = safeTrim(args.link);
    if (link) {
      payload.link = link;
    }

    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/${pageId}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Facebook post", response);
    }

    return response.json();
  }

  private async deletePost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const token = this.getToken(credentials);
    const postId = requireString(args.postId, "postId");

    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/${encodeURIComponent(postId)}?access_token=${encodeURIComponent(token)}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Facebook post", response);
    }

    return response.json();
  }

  private async getPostInsights(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const token = this.getToken(credentials);
    const postId = requireString(args.postId, "postId");

    const defaultMetrics = [
      "post_impressions",
      "post_impressions_unique",
      "post_engaged_users",
      "post_clicks",
      "post_clicks_unique",
      "post_reactions_by_type_total",
    ];

    const metrics = Array.isArray(args.metrics) && args.metrics.length > 0
      ? args.metrics.map(String).join(",")
      : defaultMetrics.join(",");

    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/${encodeURIComponent(postId)}/insights?metric=${encodeURIComponent(metrics)}&access_token=${encodeURIComponent(token)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Facebook post insights", response);
    }

    return response.json();
  }

  private cachedPageId: string | null = null;

  private async resolvePageId(credentials: Record<string, string>): Promise<string> {
    if (this.cachedPageId) return this.cachedPageId;

    const token = this.getToken(credentials);
    const response = await this.apiRequest(
      `${FACEBOOK_GRAPH_BASE}/me?fields=id&access_token=${encodeURIComponent(token)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to resolve Facebook Page ID", response);
    }

    const body = (await response.json()) as { id?: string };
    if (!body.id) {
      throw new Error("Could not determine Facebook Page ID");
    }

    this.cachedPageId = body.id;
    return body.id;
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as {
      error?: { message?: string; type?: string; code?: number };
    } | null;

    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== undefined ? String(body.error.code) : undefined;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("facebook", new FacebookHandler());
