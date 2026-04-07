/**
 * Outlook integration handler
 */

import {
  BaseIntegration,
  IntegrationRequestError,
  defineTool,
  type IntegrationTool,
  registerHandler,
} from "./base";

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

interface GraphErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

class OutlookHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_messages", {
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
        accessLevel: "read",
        tags: ["email", "messages", "outlook"],
        whenToUse: [
          "User wants to review recent Outlook messages.",
          "You need to identify a message before opening or acting on it.",
        ],
        safeDefaults: {
          top: 10,
          unreadOnly: false,
          includeBody: false,
        },
        examples: [
          {
            user: "show my latest outlook emails",
            args: {
              top: 10,
            },
          },
        ],
        followups: [
          "Offer to fetch a specific message by id.",
          "Offer to narrow to unread messages or a folder.",
        ],
      }),
      defineTool(integrationSlug, "get_message", {
        description: "Get a single Outlook message by id",
        inputSchema: {
          type: "object",
          properties: {
            messageId: { type: "string", description: "Outlook message id" },
          },
          required: ["messageId"],
        },
        accessLevel: "read",
        tags: ["email", "message", "lookup"],
        whenToUse: [
          "User wants the contents of a specific Outlook message.",
          "A prior list step returned the message id and the next step is to inspect it.",
        ],
        askBefore: [
          "Ask which message they mean if the selection is still ambiguous.",
        ],
        examples: [
          {
            user: "open that outlook email from Sarah",
            args: {
              messageId: "outlook-message-id",
            },
          },
        ],
        followups: [
          "Offer to summarize the message or draft a reply.",
        ],
      }),
      defineTool(integrationSlug, "send_email", {
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
        accessLevel: "write",
        tags: ["email", "send", "outlook"],
        whenToUse: [
          "User explicitly asks to send an email from Outlook.",
          "Recipients and message content are known and the action is ready to send.",
        ],
        askBefore: [
          "Confirm recipients if there is any ambiguity.",
          "Ask before sending if the user may have intended a draft or review step.",
        ],
        examples: [
          {
            user: "send an outlook email to ops that maintenance starts tonight",
            args: {
              to: "ops@example.com",
              subject: "Maintenance tonight",
              body: "Maintenance starts tonight at 10pm UTC.",
              bodyType: "Text",
            },
          },
        ],
        followups: [
          "Offer to list recent sent or inbox messages if the user wants to verify context.",
        ],
      }),
      defineTool(integrationSlug, "list_events", {
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
        accessLevel: "read",
        tags: ["calendar", "events", "outlook"],
        whenToUse: [
          "User wants to see upcoming Outlook calendar events.",
          "You need to inspect existing events before creating or updating one.",
        ],
        safeDefaults: {
          top: 10,
          timeZone: "UTC",
        },
        askBefore: [
          "Ask for a date window only if the user needs something more specific than a short upcoming list.",
        ],
        examples: [
          {
            user: "what's on my outlook calendar this week",
            args: {
              top: 10,
              timeZone: "UTC",
            },
          },
        ],
        followups: [
          "Offer to create a new event if the user needs one scheduled.",
        ],
      }),
      defineTool(integrationSlug, "create_event", {
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
        accessLevel: "write",
        tags: ["calendar", "events", "create"],
        whenToUse: [
          "User explicitly asks to schedule a calendar event in Outlook.",
        ],
        askBefore: [
          "Ask for missing start, end, timezone, or attendees before creating the event.",
          "Confirm if the request could conflict with other calendar events and the user has not asked you to proceed anyway.",
        ],
        examples: [
          {
            user: "schedule a 30 minute outlook meeting with Priya tomorrow at 2pm UTC",
            args: {
              subject: "Meeting with Priya",
              start: "2026-04-06T14:00:00Z",
              end: "2026-04-06T14:30:00Z",
              timeZone: "UTC",
              attendees: ["priya@example.com"],
            },
          },
        ],
        followups: [
          "Offer to list upcoming events to verify the calendar.",
        ],
      }),
      defineTool(integrationSlug, "list_contacts", {
        description: "List Outlook contacts",
        inputSchema: {
          type: "object",
          properties: {
            top: { type: "number", description: "Maximum contacts to return (default 25, max 100)" },
          },
        },
        accessLevel: "read",
        tags: ["contacts", "people", "outlook"],
        whenToUse: [
          "User wants to see Outlook contacts.",
          "You need to find a contact before sending email or scheduling an event.",
        ],
        safeDefaults: {
          top: 25,
        },
        examples: [
          {
            user: "show my outlook contacts",
            args: {
              top: 25,
            },
          },
        ],
        followups: [
          "Offer to send an email or create an event with one of the contacts.",
        ],
      }),
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
    return new IntegrationRequestError(
      code ? `${prefix}: ${code} (${message})` : `${prefix}: ${message}`,
      {
        status: response.status,
        code,
      },
    );
  }
}

registerHandler("outlook", new OutlookHandler());
