/**
 * Outlook integration handler
 */

import { BaseIntegration, type IntegrationTool, registerHandler } from "./base";

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

interface GraphErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

class OutlookHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    const prefix = `${integrationSlug}_`;

    return [
      {
        name: `${prefix}list_messages`,
        description: "List recent Outlook messages",
        inputSchema: {
          type: "object",
          properties: {
            folder: {
              type: "string",
              description: "Optional mail folder id or well-known folder name like inbox or sentitems",
            },
            top: { type: "number", description: "Maximum messages to return (default 10, max 100)" },
            unreadOnly: { type: "boolean", description: "Only return unread messages" },
            includeBody: { type: "boolean", description: "Include the message body instead of bodyPreview only" },
          },
        },
      },
      {
        name: `${prefix}get_message`,
        description: "Get a single Outlook message by id",
        inputSchema: {
          type: "object",
          properties: {
            messageId: { type: "string", description: "Outlook message id" },
          },
          required: ["messageId"],
        },
      },
      {
        name: `${prefix}send_email`,
        description: "Send an email from Outlook",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email addresses, comma-separated" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body" },
            cc: { type: "string", description: "CC recipients, comma-separated" },
            bcc: { type: "string", description: "BCC recipients, comma-separated" },
            bodyType: {
              type: "string",
              enum: ["Text", "HTML"],
              description: "Body content type",
            },
            saveToSentItems: {
              type: "boolean",
              description: "Whether to save the message in Sent Items (default true)",
            },
          },
          required: ["to", "subject", "body"],
        },
      },
      {
        name: `${prefix}list_events`,
        description: "List Outlook calendar events",
        inputSchema: {
          type: "object",
          properties: {
            top: { type: "number", description: "Maximum events to return (default 10, max 100)" },
            startDateTime: {
              type: "string",
              description: "Start of the date window in ISO-8601 format. When provided, calendarView is used.",
            },
            endDateTime: {
              type: "string",
              description: "End of the date window in ISO-8601 format. Required with startDateTime.",
            },
            timeZone: {
              type: "string",
              description: "IANA or Windows timezone to prefer in the response, for example UTC",
            },
          },
        },
      },
      {
        name: `${prefix}create_event`,
        description: "Create an Outlook calendar event",
        inputSchema: {
          type: "object",
          properties: {
            subject: { type: "string", description: "Event title" },
            body: { type: "string", description: "Event description" },
            start: { type: "string", description: "Event start in ISO-8601 format" },
            end: { type: "string", description: "Event end in ISO-8601 format" },
            timeZone: { type: "string", description: "Timezone for start and end, default UTC" },
            location: { type: "string", description: "Optional event location display name" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Optional attendee email addresses",
            },
            isOnlineMeeting: {
              type: "boolean",
              description: "Create the event as an online meeting when supported",
            },
          },
          required: ["subject", "start", "end"],
        },
      },
      {
        name: `${prefix}list_contacts`,
        description: "List Outlook contacts",
        inputSchema: {
          type: "object",
          properties: {
            top: { type: "number", description: "Maximum contacts to return (default 25, max 100)" },
          },
        },
      },
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${credentials.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_messages":
        return this.listMessages(args, credentials);
      case "get_message":
        return this.getMessage(args, credentials);
      case "send_email":
        return this.sendEmail(args, credentials);
      case "list_events":
        return this.listEvents(args, credentials);
      case "create_event":
        return this.createEvent(args, credentials);
      case "list_contacts":
        return this.listContacts(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(`${GRAPH_BASE_URL}/me`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async listMessages(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const top = Math.min(Math.max(Number(args.top) || 10, 1), 100);
    const includeBody = Boolean(args.includeBody);
    const query = new URLSearchParams({
      $top: String(top),
      $orderby: "receivedDateTime DESC",
      $select: includeBody
        ? "id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,body,bodyPreview,webLink"
        : "id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,bodyPreview,webLink",
    });

    if (args.unreadOnly) {
      query.set("$filter", "isRead eq false");
    }

    const folder = typeof args.folder === "string" && args.folder.trim() ? args.folder.trim() : null;
    const path = folder
      ? `${GRAPH_BASE_URL}/me/mailFolders/${encodeURIComponent(folder)}/messages?${query.toString()}`
      : `${GRAPH_BASE_URL}/me/messages?${query.toString()}`;

    const response = await this.apiRequest(path, { method: "GET" }, credentials);

    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook messages", response);
    }

    return response.json();
  }

  private async getMessage(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const messageId = String(args.messageId ?? "").trim();
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/messages/${encodeURIComponent(messageId)}?$select=id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,body,bodyPreview,webLink`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Outlook message", response);
    }

    return response.json();
  }

  private async sendEmail(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const ccRecipients = this.parseRecipients(args.cc);
    const bccRecipients = this.parseRecipients(args.bcc);
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/sendMail`,
      {
        method: "POST",
        body: JSON.stringify({
          message: {
            subject: args.subject,
            body: {
              contentType: args.bodyType === "HTML" ? "HTML" : "Text",
              content: args.body,
            },
            toRecipients: this.parseRecipients(args.to),
            ...(ccRecipients.length > 0 ? { ccRecipients } : {}),
            ...(bccRecipients.length > 0 ? { bccRecipients } : {}),
          },
          saveToSentItems: args.saveToSentItems ?? true,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to send Outlook email", response);
    }

    return {
      ok: true,
      message: "Email sent successfully.",
    };
  }

  private async listEvents(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const top = Math.min(Math.max(Number(args.top) || 10, 1), 100);
    const timeZone = typeof args.timeZone === "string" && args.timeZone.trim() ? args.timeZone.trim() : null;
    const headers = timeZone ? { Prefer: `outlook.timezone="${timeZone}"` } : undefined;
    const startDateTime =
      typeof args.startDateTime === "string" && args.startDateTime.trim()
        ? args.startDateTime.trim()
        : null;
    const endDateTime =
      typeof args.endDateTime === "string" && args.endDateTime.trim() ? args.endDateTime.trim() : null;

    const response = startDateTime && endDateTime
      ? await this.apiRequest(
          `${GRAPH_BASE_URL}/me/calendarView?${new URLSearchParams({
            startDateTime,
            endDateTime,
            $top: String(top),
            $orderby: "start/dateTime",
          }).toString()}`,
          { method: "GET", headers },
          credentials,
        )
      : await this.apiRequest(
          `${GRAPH_BASE_URL}/me/events?${new URLSearchParams({
            $top: String(top),
            $orderby: "start/dateTime",
          }).toString()}`,
          { method: "GET", headers },
          credentials,
        );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook events", response);
    }

    return response.json();
  }

  private async createEvent(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const timeZone = typeof args.timeZone === "string" && args.timeZone.trim() ? args.timeZone.trim() : "UTC";
    const attendees = Array.isArray(args.attendees)
      ? args.attendees
          .map((value) => (typeof value === "string" ? value.trim() : ""))
          .filter(Boolean)
      : [];

    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/events`,
      {
        method: "POST",
        body: JSON.stringify({
          subject: args.subject,
          ...(typeof args.body === "string" && args.body.trim()
            ? {
                body: {
                  contentType: "Text",
                  content: args.body,
                },
              }
            : {}),
          start: {
            dateTime: args.start,
            timeZone,
          },
          end: {
            dateTime: args.end,
            timeZone,
          },
          ...(typeof args.location === "string" && args.location.trim()
            ? { location: { displayName: args.location.trim() } }
            : {}),
          ...(attendees.length > 0
            ? {
                attendees: attendees.map((email) => ({
                  emailAddress: { address: email },
                  type: "required",
                })),
              }
            : {}),
          ...(args.isOnlineMeeting
            ? { isOnlineMeeting: true, onlineMeetingProvider: "teamsForBusiness" }
            : {}),
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Outlook event", response);
    }

    return response.json();
  }

  private async listContacts(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const top = Math.min(Math.max(Number(args.top) || 25, 1), 100);
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/contacts?${new URLSearchParams({
        $top: String(top),
        $select: "id,displayName,givenName,surname,emailAddresses,businessPhones,mobilePhone,companyName",
      }).toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook contacts", response);
    }

    return response.json();
  }

  private parseRecipients(value: unknown): Array<{ emailAddress: { address: string } }> {
    if (typeof value !== "string") {
      return [];
    }

    return value
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
      .map((address) => ({
        emailAddress: { address },
      }));
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const payload = (await response.json().catch(() => null)) as GraphErrorPayload | null;
    const code = payload?.error?.code;
    const message = payload?.error?.message ?? response.statusText;
    return new Error(code ? `${prefix}: ${code} (${message})` : `${prefix}: ${message}`);
  }
}

registerHandler("outlook", new OutlookHandler());
