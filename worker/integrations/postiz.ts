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
          "You need an integration id before scheduling a post.",
        ],
        followups: [
          "Offer to schedule a post for a chosen integration.",
          "Offer to list recent posts after identifying the right channel.",
        ],
      }),
      defineTool(integrationSlug, "schedule_post", {
        description: "Publish now or schedule a Postiz post using a simpler agent-friendly input shape",
        inputSchema: {
          type: "object",
          properties: {
            integrationId: {
              type: "string",
              description: "Postiz integration/channel id to publish to",
            },
            content: {
              type: "string",
              description: "Main post content",
            },
            platformType: {
              type: "string",
              description: "Target platform type for Postiz settings.__type, for example linkedin, twitter, instagram, facebook, tiktok, youtube, or threads",
            },
            publishAt: {
              type: "string",
              description: "UTC ISO date-time. If omitted, the post is published immediately.",
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
            media: {
              type: "array",
              description: "Uploaded media objects or public URLs. Use upload_media first when needed.",
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
              description: "Optional provider-specific Postiz settings object. If platformType is provided, it will be merged into settings.__type.",
            },
          },
          required: ["integrationId", "content"],
        },
        accessLevel: "write",
        tags: ["postiz", "social", "publish", "schedule"],
        whenToUse: [
          "User wants to publish or schedule a social post via Postiz.",
        ],
        askBefore: [
          "Ask which connected channel should receive the post if integrationId is missing.",
          "Ask which platform type to use if it cannot be inferred from the selected Postiz integration and settings.__type is missing.",
        ],
        safeDefaults: {
          shortLink: false,
          tags: [],
          media: [],
        },
        examples: [
          {
            user: "post this to my LinkedIn via Postiz right now",
            args: {
              integrationId: "your-linkedin-id",
              content: "Excited to ship this today.",
              platformType: "linkedin",
            },
          },
          {
            user: "schedule this Postiz post for tomorrow morning",
            args: {
              integrationId: "your-linkedin-id",
              content: "Launching tomorrow.",
              platformType: "linkedin",
              publishAt: "2026-04-18T09:00:00.000Z",
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
          "Offer to schedule a post using the uploaded media result.",
        ],
      }),
      defineTool(integrationSlug, "get_requirements", {
        description: "Return the expected Postiz posting requirements, required identifiers, and platform settings hints before scheduling a post",
        inputSchema: {
          type: "object",
          properties: {
            platformType: {
              type: "string",
              description: "Optional platform type hint such as linkedin, twitter, instagram, facebook, tiktok, youtube, or threads",
            },
          },
        },
        accessLevel: "read",
        tags: ["postiz", "social", "requirements", "schema"],
        whenToUse: [
          "You need to know which fields are required before calling schedule_post.",
          "You need a reminder about integrationId, platformType, media expectations, or scheduling format.",
        ],
        followups: [
          "Offer to list integrations next if the user still needs a channel id.",
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
      case "schedule_post":
        return this.schedulePost(args, credentials);
      case "list_posts":
        return this.listPosts(args, credentials);
      case "delete_post":
        return this.deletePost(args, credentials);
      case "upload_media":
        return this.uploadMedia(args, credentials);
      case "get_requirements":
        return this.getRequirements(args);
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

  private async schedulePost(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const integrationId = String(args.integrationId ?? "").trim();
    const content = String(args.content ?? "").trim();
    const publishAt = typeof args.publishAt === "string" ? args.publishAt.trim() : "";
    const platformType = typeof args.platformType === "string" ? args.platformType.trim() : "";
    const settings = this.mergeSettings(args.settings, platformType);

    if (!integrationId) {
      throw new Error("integrationId is required");
    }

    if (!content) {
      throw new Error("content is required");
    }

    if (!settings.__type || typeof settings.__type !== "string" || !String(settings.__type).trim()) {
      throw new Error("platformType or settings.__type is required");
    }

    const payload = {
      type: publishAt ? "schedule" : "now",
      date: publishAt || new Date().toISOString(),
      shortLink: Boolean(args.shortLink ?? false),
      tags: Array.isArray(args.tags) ? args.tags.map((value) => String(value)) : [],
      posts: [
        {
          integration: { id: integrationId },
          value: [
            {
              content,
              image: this.normalizeImages(args.media),
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
      throw await this.createApiError("Failed to schedule Postiz post", response);
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

  private mergeSettings(settings: unknown, platformType: string): PostizSettings {
    const baseSettings = this.optionalObject(settings, "settings");

    if (platformType) {
      return {
        ...baseSettings,
        __type: platformType,
      };
    }

    return baseSettings;
  }

  private optionalObject(value: unknown, fieldName: string): PostizSettings {
    if (value === undefined || value === null) {
      return {};
    }

    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${fieldName} must be an object`);
    }

    return value as PostizSettings;
  }

  private getRequirements(args: Record<string, unknown>): unknown {
    const platformType = typeof args.platformType === "string" ? args.platformType.trim() : "";

    return {
      integration: "postiz",
      recommendedTools: [
        "postiz_list_integrations",
        "postiz_schedule_post",
        "postiz_list_posts",
        "postiz_delete_post",
        "postiz_upload_media",
      ],
      requiredFields: ["integrationId", "content"],
      conditionalFields: [
        {
          field: "platformType",
          requiredWhen: "settings.__type is not already provided",
          description: "Sets Postiz settings.__type for the target social platform.",
        },
        {
          field: "publishAt",
          requiredWhen: "the post should be scheduled for later instead of publishing immediately",
          description: "Must be a UTC ISO date-time string.",
        },
        {
          field: "media",
          requiredWhen: "the target post should include media",
          description: "Provide uploaded Postiz media objects or public URLs. Use postiz_upload_media first when needed.",
        },
      ],
      settings: {
        mustBeObject: true,
        requiredKey: "__type unless platformType is supplied",
        platformTypeHint: platformType || null,
        commonPlatformTypes: ["linkedin", "twitter", "instagram", "facebook", "tiktok", "youtube", "threads"],
      },
      notes: [
        "Use postiz_list_integrations to discover the correct integrationId before scheduling.",
        "If both platformType and settings.__type are supplied, platformType wins.",
        "publishAt omitted means publish now.",
      ],
    };
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
