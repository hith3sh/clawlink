/**
 * Gmail integration handler
 */

import { BaseIntegration, IntegrationTool, registerHandler } from "./base";

class GmailHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    const prefix = `${integrationSlug}_`;
    
    return [
      {
        name: `${prefix}send_email`,
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
      },
      {
        name: `${prefix}list_emails`,
        description: "List recent emails from Gmail",
        inputSchema: {
          type: "object",
          properties: {
            maxResults: { type: "number", description: "Maximum number of emails to return (default 10)" },
            query: { type: "string", description: "Gmail search query" },
            labelIds: { type: "array", items: { type: "string" }, description: "Filter by label IDs" },
          },
        },
      },
      {
        name: `${prefix}get_email`,
        description: "Get a specific email by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Email ID" },
          },
          required: ["id"],
        },
      },
      {
        name: `${prefix}create_draft`,
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
      },
      {
        name: `${prefix}delete_email`,
        description: "Move an email to trash",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Email ID to delete" },
          },
          required: ["id"],
        },
      },
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${credentials.access_token}`,
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
      
      case "delete_email":
        return this.deleteEmail(baseUrl, args, credentials);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
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
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Failed to send email: ${(error as {error?:{message?:string}})?.error?.message || response.statusText}`);
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
      params.set("labelIds", labelIds.join(","));
    }

    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages?${params}`,
      { method: "GET" },
      credentials
    );

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Failed to list emails: ${(error as {error?:{message?:string}})?.error?.message || response.statusText}`);
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
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Failed to get email: ${(error as {error?:{message?:string}})?.error?.message || response.statusText}`);
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
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Failed to create draft: ${(error as {error?:{message?:string}})?.error?.message || response.statusText}`);
    }

    return response.json();
  }

  private async deleteEmail(
    baseUrl: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>
  ): Promise<unknown> {
    const { id } = args;

    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages/${id}/trash`,
      { method: "POST" },
      credentials
    );

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Failed to delete email: ${(error as {error?:{message?:string}})?.error?.message || response.statusText}`);
    }

    return response.json();
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
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
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.drafts",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientId || "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent",
      state: userId,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }
}

// Register the handler
registerHandler("gmail", new GmailHandler());