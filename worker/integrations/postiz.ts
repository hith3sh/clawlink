import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const POSTIZ_BASE_URL = "https://api.postiz.com/public/v1";

type PostizSettings = Record<string, unknown>;

interface PostizErrorPayload {
  message?: string;
  error?: string | { message?: string };
}

class PostizHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_integrations", {
        description: "List connected Postiz channels/integrations available to the authenticated account",
        inputSchema: {
          type: "object",
          properties: {},
        },
        accessLevel: "read",
        tags: ["postiz", "social", "channels", "integrations"],
        whenToUse: [
          "User wants to know which Postiz channels/accounts are connected.",
          "You need an integration id before creating a post.",
        ],
        followups: [
          "Offer to create a post for a chosen integration.",
          "Offer to list recent posts after identifying the right channel.",
        ],
      }),
      defineTool(integrationSlug, "create_post", {
        description: "Create or schedule a post in Postiz",
        inputSchema: {
          type: "object",
          properties: {
            postType: {
              type: "string",
              enum: ["now", "schedule"],
              description: "Whether to publish immediately or schedule for later",
            },
            date: {
              type: "string",
              description: "UTC ISO date-time. Required for scheduled posts and accepted for immediate posts too.",
            },
            shortLink: {
              type: "boolean",
              description: "Whether Postiz should shorten links",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Optional tags to attach to the post",
            },
            integrationId: {
              type: "string",
              description: "Postiz integration/channel id to publish to",
            },
            content: {
              type: "string",
              description: "Main post content",
            },
            images: {
              type: "array",
              description: "Uploaded media objects or URLs. Use upload_media first when needed.",
              items: {
                anyOf: [
                  { type: "string" },
                  {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      path: { type: "string" },
                    },
                  },
                ],
              },
            },
            settings: {
              type: "object",
              description: "Provider-specific Postiz settings object. Must include __type.",
            },
          },
          required: ["postType", "integrationId", "content", "settings"],
        },
        accessLevel: "write",
        tags: ["postiz", "social", "publish", "schedule"],
        whenToUse: [
          "User wants to publish or schedule a social post via Postiz.",
        ],
        askBefore: [
          "Ask which connected channel should receive the post if integrationId is missing.",
          "Ask for provider-specific settings if the target platform requires them and they are not obvious.",
        ],
        safeDefaults: {
          postType: "now",
          shortLink: false,
          tags: [],
          images: [],
        },
        examples: [
          {
            user: "post this to my LinkedIn via Postiz right now",
            args: {
              postType: "now",
              integrationId: "your-linkedin-id",
              content: "Excited to ship this today.",
              settings: {
                __type: "linkedin",
              },
            },
          },
        ],
        followups: [
          "Offer to list recent posts so the user can verify it was created.",
        ],
      }),
      defineTool(integrationSlug, "list_posts", {
        description: "List Postiz posts within a date range",
        inputSchema: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description: "UTC ISO start date-time",
            },
            endDate: {
              type: "string",
              description: "UTC ISO end date-time",
            },
            customer: {
              type: "string",
              description: "Optional Postiz customer ID filter",
            },
          },
          required: ["startDate", "endDate"],
        },
        accessLevel: "read",
        tags: ["postiz", "social", "posts", "history"],
        whenToUse: [
          "User wants to inspect recent or scheduled posts in Postiz.",
        ],
        examples: [
          {
            user: "show my Postiz posts from this week",
            args: {
              startDate: "2026-04-13T00:00:00.000Z",
              endDate: "2026-04-20T00:00:00.000Z",
            },
          },
        ],
        followups: [
          "Offer to delete a selected post if the user wants to remove it.",
        ],
      }),
      defineTool(integrationSlug, "delete_post", {
        description: "Delete a Postiz post by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Postiz post ID to delete",
            },
          },
          required: ["id"],
        },
        accessLevel: "destructive",
        tags: ["postiz", "social", "delete", "posts"],
        whenToUse: [
          "User explicitly asks to delete a Postiz post.",
        ],
        askBefore: [
          "Confirm the exact post if there is any ambiguity, because deleting one post removes the full grouped post set.",
        ],
        examples: [
          {
            user: "delete that scheduled Postiz post",
            args: {
              id: "post-id",
            },
          },
        ],
      }),
      defineTool(integrationSlug, "upload_media", {
        description: "Upload media to Postiz from a public URL",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Public URL of the image or media file",
            },
          },
          required: ["url"],
        },
        accessLevel: "write",
        tags: ["postiz", "social", "media", "upload"],
        whenToUse: [
          "User needs a Postiz media object before creating a post with images.",
        ],
        examples: [
          {
            user: "upload this image to Postiz",
            args: {
              url: "https://example.com/image.png",
            },
          },
        ],
        followups: [
          "Offer to create a post using the uploaded media result.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token;

    return {
      Authorization: String(token ?? ""),
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_integrations":
        return this.listIntegrations(credentials);
      case "create_post":
        return this.createPost(args, credentials);
      case "list_posts":
        return this.listPosts(args, credentials);
      case "delete_post":
        return this.deletePost(args, credentials);
      case "upload_media":
        return this.uploadMedia(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(`${POSTIZ_BASE_URL}/integrations`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async listIntegrations(credentials: Record<string, string>): Promise<unknown> {
    const response = await this.apiRequest(`${POSTIZ_BASE_URL}/integrations`, { method: "GET" }, credentials);

    if (!response.ok) {
      throw await this.createApiError("Failed to list Postiz integrations", response);
    }

    return response.json();
  }

  private async createPost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const settings = this.requireObject(args.settings, "settings");
    const payload = {
      type: String(args.postType ?? "now"),
      date: typeof args.date === "string" && args.date.trim() ? args.date : new Date().toISOString(),
      shortLink: Boolean(args.shortLink ?? false),
      tags: Array.isArray(args.tags) ? args.tags.map((value) => String(value)) : [],
      posts: [
        {
          integration: { id: String(args.integrationId ?? "") },
          value: [
            {
              content: String(args.content ?? ""),
              image: this.normalizeImages(args.images),
            },
          ],
          settings,
        },
      ],
    };

    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Postiz post", response);
    }

    return response.json();
  }

  private async listPosts(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      startDate: String(args.startDate ?? ""),
      endDate: String(args.endDate ?? ""),
    });

    if (typeof args.customer === "string" && args.customer.trim()) {
      params.set("customer", args.customer);
    }

    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Postiz posts", response);
    }

    return response.json();
  }

  private async deletePost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const id = String(args.id ?? "").trim();
    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Postiz post", response);
    }

    return response.json();
  }

  private async uploadMedia(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const response = await fetch(`${POSTIZ_BASE_URL}/upload-from-url`, {
      method: "POST",
      headers: this.getHeaders(credentials),
      body: JSON.stringify({
        url: String(args.url ?? ""),
      }),
    });

    if (!response.ok) {
      throw await this.createApiError("Failed to upload media to Postiz", response);
    }

    return response.json();
  }

  private normalizeImages(images: unknown): Array<{ id?: string; path: string }> {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .map((entry) => {
        if (typeof entry === "string") {
          const path = entry.trim();
          return path ? { path } : null;
        }

        if (entry && typeof entry === "object") {
          const id = typeof (entry as { id?: unknown }).id === "string" ? (entry as { id: string }).id.trim() : undefined;
          const path = typeof (entry as { path?: unknown }).path === "string" ? (entry as { path: string }).path.trim() : "";

          if (!path) {
            return null;
          }

          return id ? { id, path } : { path };
        }

        return null;
      })
      .filter((value): value is { id?: string; path: string } => Boolean(value));
  }

  private requireObject(value: unknown, fieldName: string): PostizSettings {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${fieldName} must be an object`);
    }

    return value as PostizSettings;
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as PostizErrorPayload | null;
    const nestedMessage = typeof body?.error === "object" ? body.error?.message : undefined;
    const inlineError = typeof body?.error === "string" ? body.error : undefined;
    const message = nestedMessage ?? body?.message ?? inlineError ?? response.statusText;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
    });
  }
}

registerHandler("postiz", new PostizHandler());
