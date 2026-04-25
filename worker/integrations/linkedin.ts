import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

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

class LinkedInHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "get_profile", {
        description: "Get the authenticated user's LinkedIn profile including name, headline, and profile URL",
        inputSchema: { type: "object", properties: {} },
        accessLevel: "read",
        tags: ["linkedin", "profile", "user"],
        whenToUse: [
          "User wants to see their LinkedIn profile information.",
          "You need the author URN before creating or listing posts.",
        ],
        followups: [
          "Offer to create a post or list recent posts.",
        ],
      }),
      defineTool(integrationSlug, "create_post", {
        description: "Create a post on LinkedIn",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Post text content" },
            visibility: { type: "string", enum: ["PUBLIC", "CONNECTIONS"], description: "Post visibility (default: PUBLIC)" },
          },
          required: ["text"],
        },
        accessLevel: "write",
        tags: ["linkedin", "post", "publish", "share"],
        whenToUse: [
          "User wants to post or share something on LinkedIn.",
        ],
        askBefore: [
          "Confirm the post content before publishing if the user drafted it conversationally.",
        ],
        examples: [
          {
            user: "post this to LinkedIn: Excited to announce our new feature!",
            args: { text: "Excited to announce our new feature!" },
          },
        ],
        followups: [
          "Offer to list recent posts to verify it was created.",
        ],
      }),
      defineTool(integrationSlug, "list_posts", {
        description: "List recent posts by the authenticated LinkedIn user",
        inputSchema: {
          type: "object",
          properties: {
            count: { type: "number", description: "Number of posts to return (max 100)" },
          },
        },
        accessLevel: "read",
        tags: ["linkedin", "post", "list", "history"],
        safeDefaults: { count: 10 },
        whenToUse: [
          "User wants to see their recent LinkedIn posts.",
        ],
        followups: [
          "Offer to delete a post or create a new one.",
        ],
      }),
      defineTool(integrationSlug, "delete_post", {
        description: "Delete a LinkedIn post by URN",
        inputSchema: {
          type: "object",
          properties: {
            postUrn: { type: "string", description: "The URN of the LinkedIn post to delete (e.g. urn:li:share:12345)" },
          },
          required: ["postUrn"],
        },
        accessLevel: "destructive",
        tags: ["linkedin", "post", "delete"],
        whenToUse: [
          "User explicitly asks to delete a LinkedIn post.",
        ],
        askBefore: [
          "Confirm the exact post before deleting, since this cannot be undone.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token ?? "";
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "get_profile":
        return this.getProfile(credentials);
      case "create_post":
        return this.createPost(args, credentials);
      case "list_posts":
        return this.listPosts(args, credentials);
      case "delete_post":
        return this.deletePost(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${LINKEDIN_API_BASE}/userinfo`,
        { method: "GET" },
        credentials,
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  private async getProfile(credentials: Record<string, string>): Promise<unknown> {
    const response = await this.apiRequest(
      `${LINKEDIN_API_BASE}/userinfo`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch LinkedIn profile", response);
    }

    return response.json();
  }

  private async createPost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const text = requireString(args.text, "text");
    const visibility = safeTrim(args.visibility) ?? "PUBLIC";

    // First get the user's profile to obtain the author URN
    const profileResponse = await this.apiRequest(
      `${LINKEDIN_API_BASE}/userinfo`,
      { method: "GET" },
      credentials,
    );

    if (!profileResponse.ok) {
      throw await this.createApiError("Failed to fetch LinkedIn profile for post creation", profileResponse);
    }

    const profile = (await profileResponse.json()) as { sub?: string };
    const personUrn = profile.sub;

    if (!personUrn) {
      throw new Error("Could not determine LinkedIn user ID for post author");
    }

    const payload = {
      author: `urn:li:person:${personUrn}`,
      commentary: text,
      visibility: visibility === "CONNECTIONS" ? "CONNECTIONS" : "PUBLIC",
      lifecycleState: "PUBLISHED",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
    };

    const response = await this.apiRequest(
      `${LINKEDIN_API_BASE}/posts`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create LinkedIn post", response);
    }

    return response.json();
  }

  private async listPosts(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const profileResponse = await this.apiRequest(
      `${LINKEDIN_API_BASE}/userinfo`,
      { method: "GET" },
      credentials,
    );

    if (!profileResponse.ok) {
      throw await this.createApiError("Failed to fetch LinkedIn profile for listing posts", profileResponse);
    }

    const profile = (await profileResponse.json()) as { sub?: string };
    const personUrn = profile.sub;

    if (!personUrn) {
      throw new Error("Could not determine LinkedIn user ID");
    }

    const count = Math.min(
      typeof args.count === "number" ? args.count : 10,
      100,
    );

    const params = new URLSearchParams({
      q: "author",
      author: `urn:li:person:${personUrn}`,
      count: String(count),
    });

    const response = await this.apiRequest(
      `${LINKEDIN_API_BASE}/posts?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list LinkedIn posts", response);
    }

    return response.json();
  }

  private async deletePost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const postUrn = requireString(args.postUrn, "postUrn");

    const response = await this.apiRequest(
      `${LINKEDIN_API_BASE}/posts/${encodeURIComponent(postUrn)}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete LinkedIn post", response);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { deleted: true, postUrn };
    }

    return response.json().catch(() => ({ deleted: true, postUrn }));
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
    const message = body?.message ?? body?.error ?? response.statusText;
    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
    });
  }
}

registerHandler("linkedin", new LinkedInHandler());
