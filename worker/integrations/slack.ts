/**
 * Slack integration handler
 */

import { BaseIntegration, defineTool, type IntegrationTool, registerHandler } from "./base";

class SlackHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "send_message", {
        description: "Post a Slack message to a channel",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "string", description: "Channel ID or channel name" },
            text: { type: "string", description: "Message body" },
          },
          required: ["channel", "text"],
        },
        accessLevel: "write",
        tags: ["messaging", "channels", "slack"],
        whenToUse: [
          "User explicitly asks to send or post a Slack message.",
          "The destination channel is known and the task is to notify or update teammates.",
        ],
        askBefore: [
          "Ask which channel to use if the user did not name one clearly.",
          "Confirm before posting if the message could be sensitive or broadly visible.",
        ],
        examples: [
          {
            user: "send a slack message to #general saying deployment is live",
            args: {
              channel: "#general",
              text: "Deployment is live.",
            },
          },
        ],
        followups: [
          "Offer to list channels if the user is unsure where to post.",
        ],
      }),
      defineTool(integrationSlug, "list_channels", {
        description: "List public Slack channels available to the bot",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Maximum channels to return (default 100)" },
          },
        },
        accessLevel: "read",
        tags: ["channels", "discovery", "slack"],
        whenToUse: [
          "User wants to know which Slack channels are available.",
          "You need a channel before sending a message and the user has not specified one.",
        ],
        safeDefaults: {
          limit: 100,
        },
        examples: [
          {
            user: "what slack channels can you access",
            args: {
              limit: 100,
            },
          },
        ],
        followups: [
          "Offer to send a message to one of the returned channels.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${credentials.botToken}`,
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "send_message":
        return this.sendMessage(args, credentials);
      case "list_channels":
        return this.listChannels(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await fetch("https://slack.com/api/auth.test", {
        headers: this.getHeaders(credentials),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      return Boolean(response.ok && data?.ok);
    } catch {
      return false;
    }
  }

  private async sendMessage(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const response = await this.apiRequest(
      "https://slack.com/api/chat.postMessage",
      {
        method: "POST",
        body: JSON.stringify({
          channel: args.channel,
          text: args.text,
        }),
      },
      credentials,
    );

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      throw new Error(`Failed to send message: ${payload?.error ?? response.statusText}`);
    }

    return payload;
  }

  private async listChannels(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      limit: String(args.limit ?? 100),
      exclude_archived: "true",
      types: "public_channel",
    });

    const response = await this.apiRequest(
      `https://slack.com/api/conversations.list?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      throw new Error(`Failed to list channels: ${payload?.error ?? response.statusText}`);
    }

    return payload;
  }
}

registerHandler("slack", new SlackHandler());
