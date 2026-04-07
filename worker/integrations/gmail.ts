/**
 * Gmail integration handler
 */

import {
  BaseIntegration,
  IntegrationRequestError,
  defineTool,
  type IntegrationTool,
  registerHandler,
} from "./base";

interface GmailErrorPayload {
  error?: {
    code?: number;
    message?: string;
  };
}

function getAccessToken(credentials: Record<string, string>): string | undefined {
  return credentials.accessToken ?? credentials.access_token;
}

class GmailHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "send_email", {
        description: "Send an email via Gmail",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body (plain text or HTML)" },
            cc: { type: "string", description: "CC recipients (comma-separated)" },
            bcc: { type: "string", description: "BCC recipients (comma-separated)" },
          },
          required: ["to", "subject", "body"],
        },
        accessLevel: "write",
        tags: ["email", "send", "gmail"],
        whenToUse: [
          "User explicitly asks to send an email from Gmail.",
          "The recipients, subject, and message body are already known.",
        ],
        askBefore: [
          "Confirm recipients or draft details if they are ambiguous.",
          "Ask before sending if the user has only asked to draft or review the message.",
        ],
        examples: [
          {
            user: "email alex that the meeting is moved to 3pm",
            args: {
              to: "alex@example.com",
              subject: "Meeting update",
              body: "The meeting has moved to 3pm.",
            },
          },
        ],
        followups: [
          "Offer to create a draft instead if the user wants to review before sending.",
        ],
      }),
      defineTool(integrationSlug, "list_emails", {
        description: "List recent emails from Gmail",
        inputSchema: {
          type: "object",
          properties: {
            maxResults: { type: "number", description: "Maximum number of emails to return (default 10)" },
            query: { type: "string", description: "Gmail search query" },
            labelIds: { type: "array", items: { type: "string" }, description: "Filter by label IDs" },
          },
        },
        accessLevel: "read",
        tags: ["email", "list", "inbox"],
        whenToUse: [
          "User wants to see recent Gmail messages.",
          "You need to search or narrow down messages before opening one.",
        ],
        safeDefaults: {
          maxResults: 10,
        },
        examples: [
          {
            user: "show my latest gmail messages",
            args: {
              maxResults: 10,
            },
          },
        ],
        followups: [
          "Offer to fetch a specific message by id.",
          "Offer to refine with a Gmail search query.",
        ],
      }),
      defineTool(integrationSlug, "get_email", {
        description: "Get a specific email by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Email ID" },
          },
          required: ["id"],
        },
        accessLevel: "read",
        tags: ["email", "message", "lookup"],
        whenToUse: [
          "User wants the contents of a specific Gmail message.",
          "A previous list step returned the message id and you need the full details.",
        ],
        askBefore: [
          "Ask which message they mean if they have not identified one yet.",
        ],
        examples: [
          {
            user: "open that second gmail message",
            args: {
              id: "gmail-message-id",
            },
          },
        ],
        followups: [
          "Offer to draft a reply or summarize the message.",
        ],
      }),
      defineTool(integrationSlug, "create_draft", {
        description: "Create a new email draft",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body" },
          },
          required: ["to", "subject", "body"],
        },
        accessLevel: "write",
        tags: ["email", "draft", "gmail"],
        whenToUse: [
          "User wants a draft prepared but not sent yet.",
          "You should avoid sending immediately until the user reviews the message.",
        ],
        examples: [
          {
            user: "draft an email to finance asking for the invoice",
            args: {
              to: "finance@example.com",
              subject: "Invoice request",
              body: "Could you send over the latest invoice?",
            },
          },
        ],
        followups: [
          "Offer to send the email after the user reviews the draft.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const accessToken = getAccessToken(credentials);

    if (!accessToken) {
      throw new Error("Gmail credentials are missing an access token.");
    }

    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const baseUrl = "https://gmail.googleapis.com/gmail/v1";

    switch (action) {
      case "send_email":
        return this.sendEmail(baseUrl, args, credentials);
      
      case "list_emails":
        return this.listEmails(baseUrl, args, credentials);
      
      case "get_email":
        return this.getEmail(baseUrl, args, credentials);
      
      case "create_draft":
        return this.createDraft(baseUrl, args, credentials);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async readError(response: Response): Promise<never> {
    const payload = (await response.json().catch(() => null)) as GmailErrorPayload | null;
    const message = payload?.error?.message ?? response.statusText;

    throw new IntegrationRequestError(`Gmail request failed: ${message}`, {
      status: response.status,
      code: payload?.error?.code ? String(payload.error.code) : undefined,
    });
  }

  private async sendEmail(
    baseUrl: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const { to, subject, body, cc, bcc } = args;

    // Build the email payload
    const emailLines = [
      `To: ${to}`,
      subject ? `Subject: ${subject}` : "",
      cc ? `Cc: ${cc}` : "",
      bcc ? `Bcc: ${bcc}` : "",
      "",
      body as string,
    ];

    const email = emailLines.filter(Boolean).join("\n");
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages/send`,
      {
        method: "POST",
        body: JSON.stringify({ raw: encodedEmail }),
      },
      credentials
    );

    if (!response.ok) {
      await this.readError(response);
    }

    return response.json();
  }

  private async listEmails(
    baseUrl: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const { maxResults = 10, query, labelIds } = args;
    
    const params = new URLSearchParams();
    params.set("maxResults", String(maxResults));
    if (query) params.set("q", query as string);
    if (labelIds && Array.isArray(labelIds)) {
      for (const labelId of labelIds) {
        if (typeof labelId === "string" && labelId.trim().length > 0) {
          params.append("labelIds", labelId);
        }
      }
    }

    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages?${params}`,
      { method: "GET" },
      credentials
    );

    if (!response.ok) {
      await this.readError(response);
    }

    return response.json();
  }

  private async getEmail(
    baseUrl: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const { id } = args;

    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages/${id}`,
      { method: "GET" },
      credentials
    );

    if (!response.ok) {
      await this.readError(response);
    }

    return response.json();
  }

  private async createDraft(
    baseUrl: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const { to, subject, body } = args;

    const emailLines = [
      `To: ${to}`,
      subject ? `Subject: ${subject}` : "",
      "",
      body as string,
    ];

    const email = emailLines.filter(Boolean).join("\n");
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const response = await this.apiRequest(
      `${baseUrl}/users/me/drafts`,
      {
        method: "POST",
        body: JSON.stringify({
          message: { raw: encodedEmail },
        }),
      },
      credentials
    );

    if (!response.ok) {
      await this.readError(response);
    }

    return response.json();
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const accessToken = getAccessToken(credentials);

      if (!accessToken) {
        return false;
      }

      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.compose",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientId || "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
      state: userId,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }
}

// Register the handler
registerHandler("gmail", new GmailHandler());
