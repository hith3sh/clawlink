/**
 * Slack integration handler
 */

import { pipedreamProxyRequest } from "../lib/pipedream-proxy";
import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const SLACK_API_BASE_URL = "https://slack.com/api";
const SLACK_RECONNECT_ERRORS = new Set([
  "account_inactive",
  "invalid_auth",
  "not_authed",
  "token_revoked",
]);

type SlackExecutionContext = {
  requestId: string;
  dryRun?: boolean;
  timeoutMs?: number;
  connectionId?: number;
  userId?: string;
  env?: Record<string, unknown>;
};

type SlackApiPayload = {
  ok?: boolean;
  error?: string;
  [key: string]: unknown;
};

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

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
    const botToken = safeTrim(credentials.botToken);
    if (!botToken) {
      throw new Error("Slack credentials are missing botToken.");
    }

    return {
      Authorization: `Bearer ${botToken}`,
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: SlackExecutionContext,
  ): Promise<unknown> {
    switch (action) {
      case "send_message":
        return this.sendMessage(args, credentials, context);
      case "list_channels":
        return this.listChannels(args, credentials, context);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    if (this.getPipedreamAccountId(credentials)) {
      return true;
    }

    try {
      const response = await this.apiRequest(`${SLACK_API_BASE_URL}/auth.test`, {
        method: "POST",
      }, credentials);
      const payload = await this.readSlackPayload(response);
      return Boolean(response.ok && payload?.ok);
    } catch {
      return false;
    }
  }

  private async sendMessage(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: SlackExecutionContext,
  ): Promise<unknown> {
    const response = await this.slackApiRequest(
      "/chat.postMessage",
      {
        method: "POST",
        body: {
          channel: args.channel,
          text: args.text,
        },
      },
      credentials,
      context,
    );
    const payload = await this.readSlackPayload(response);

    if (!response.ok || !payload?.ok) {
      throw this.createSlackApiError("Failed to send message", response.status, payload?.error);
    }

    return payload;
  }

  private async listChannels(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: SlackExecutionContext,
  ): Promise<unknown> {
    const response = await this.slackApiRequest(
      "/conversations.list",
      {
        method: "GET",
        params: {
          limit: String(args.limit ?? 100),
          exclude_archived: "true",
          types: "public_channel",
        },
      },
      credentials,
      context,
    );
    const payload = await this.readSlackPayload(response);

    if (!response.ok || !payload?.ok) {
      throw this.createSlackApiError("Failed to list channels", response.status, payload?.error);
    }

    return payload;
  }

  private getPipedreamAccountId(credentials: Record<string, string>): string | null {
    return safeTrim(credentials.pipedreamAccountId);
  }

  private async slackApiRequest(
    path: string,
    options: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      params?: Record<string, unknown>;
      body?: Record<string, unknown>;
    },
    credentials: Record<string, string>,
    context?: SlackExecutionContext,
  ): Promise<Response> {
    const pipedreamAccountId = this.getPipedreamAccountId(credentials);

    if (pipedreamAccountId) {
      const externalUserId = safeTrim(context?.userId);
      if (!externalUserId) {
        throw new Error("Slack Pipedream requests require the current ClawLink user id.");
      }

      return pipedreamProxyRequest({
        accountId: pipedreamAccountId,
        externalUserId,
        env: context?.env,
        baseUrl: SLACK_API_BASE_URL,
        path,
        method: options.method,
        params: options.params,
        body: options.body,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        timeoutInSeconds:
          typeof context?.timeoutMs === "number" && Number.isFinite(context.timeoutMs)
            ? Math.max(1, Math.ceil(context.timeoutMs / 1000))
            : undefined,
      });
    }

    const url = new URL(path, `${SLACK_API_BASE_URL}/`);
    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return this.apiRequest(
      url.toString(),
      {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : undefined,
      },
      credentials,
    );
  }

  private async readSlackPayload(response: Response): Promise<SlackApiPayload | null> {
    return (await response.json().catch(() => null)) as SlackApiPayload | null;
  }

  private createSlackApiError(
    prefix: string,
    status: number,
    slackError?: string,
  ): Error {
    if (slackError && SLACK_RECONNECT_ERRORS.has(slackError)) {
      return new IntegrationRequestError(`${prefix}: Slack connection must be reconnected.`, {
        status: 400,
        code: slackError,
      });
    }

    if (slackError === "missing_scope") {
      return new IntegrationRequestError(`${prefix}: Missing required Slack scopes.`, {
        status: 403,
        code: slackError,
      });
    }

    if (slackError === "ratelimited" || status === 429) {
      return new IntegrationRequestError(`${prefix}: Slack rate limit reached.`, {
        status: 429,
        code: slackError ?? "ratelimited",
      });
    }

    const detail = slackError ? slackError.replaceAll("_", " ") : "Request failed";

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: status >= 400 ? status : 400,
      code: slackError,
    });
  }
}

registerHandler("slack", new SlackHandler());
