/**
 * Slack integration handler
 */

import { BaseIntegration, type IntegrationTool, registerHandler } from "./base";

class SlackHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    const prefix = `${integrationSlug}_`;

    return [
      {
        name: `${prefix}send_message`,
        description: "Post a Slack message to a channel",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "string", description: "Channel ID or channel name" },
            text: { type: "string", description: "Message body" },
          },
          required: ["channel", "text"],
        },
      },
      {
        name: `${prefix}list_channels`,
        description: "List public Slack channels available to the bot",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Maximum channels to return (default 100)" },
          },
        },
      },
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
