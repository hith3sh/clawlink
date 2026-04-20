var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// integrations/base.ts
function defineTool(integration, action, options) {
  return {
    integration,
    name: `${integration}_${action}`,
    description: options.description,
    inputSchema: options.inputSchema,
    accessLevel: options.accessLevel,
    tags: options.tags ?? [],
    whenToUse: options.whenToUse ?? [],
    askBefore: options.askBefore ?? [],
    safeDefaults: options.safeDefaults ?? {},
    examples: options.examples ?? [],
    followups: options.followups ?? []
  };
}
__name(defineTool, "defineTool");
var IntegrationRequestError = class extends Error {
  static {
    __name(this, "IntegrationRequestError");
  }
  constructor(message, options) {
    super(message);
    this.name = "IntegrationRequestError";
    this.status = options.status;
    this.code = options.code;
  }
};
function isAuthenticationFailure(error) {
  if (error instanceof IntegrationRequestError) {
    return error.status === 401;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  return /\b401\b|unauthorized|invalid[_\s-]?token|token expired|invalid[_\s-]?auth/i.test(
    error.message
  );
}
__name(isAuthenticationFailure, "isAuthenticationFailure");
var BaseIntegration = class {
  static {
    __name(this, "BaseIntegration");
  }
  buildRequestHeaders(baseHeaders, integrationHeaders) {
    const headers = new Headers(baseHeaders);
    for (const [key, value] of Object.entries(integrationHeaders)) {
      headers.set(key, value);
    }
    return headers;
  }
  /**
   * Make an API request with retry logic
   */
  async apiRequest(url, options, credentials, retries = 3) {
    let lastError = null;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: this.buildRequestHeaders(
            options.headers,
            this.getHeaders(credentials)
          )
        });
        if (response.status >= 400 && response.status < 500) {
          return response;
        }
        if (response.status >= 500 || response.status === 429) {
          const delay = Math.pow(2, i) * 1e3;
          await new Promise((resolve) => setTimeout(resolve, delay));
          lastError = new Error(`Server error: ${response.status}`);
          continue;
        }
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (i < retries - 1) {
          const delay = Math.pow(2, i) * 1e3;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError || new Error("Request failed after retries");
  }
  /**
   * Get headers for API requests (override per integration)
   */
  getHeaders(credentials) {
    void credentials;
    return {
      "Content-Type": "application/json"
    };
  }
  /**
   * Build query string from params
   */
  buildQueryString(params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== void 0 && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    return searchParams.toString();
  }
};
var handlers = /* @__PURE__ */ new Map();
function registerHandler(slug, handler) {
  handlers.set(slug, handler);
}
__name(registerHandler, "registerHandler");
function getIntegrationHandler(slug) {
  return handlers.get(slug);
}
__name(getIntegrationHandler, "getIntegrationHandler");

// integrations/gmail.ts
function getAccessToken(credentials) {
  return credentials.accessToken ?? credentials.access_token;
}
__name(getAccessToken, "getAccessToken");
var GmailHandler = class extends BaseIntegration {
  static {
    __name(this, "GmailHandler");
  }
  getTools(integrationSlug) {
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
            bcc: { type: "string", description: "BCC recipients (comma-separated)" }
          },
          required: ["to", "subject", "body"]
        },
        accessLevel: "write",
        tags: ["email", "send", "gmail"],
        whenToUse: [
          "User explicitly asks to send an email from Gmail.",
          "The recipients, subject, and message body are already known."
        ],
        askBefore: [
          "Confirm recipients or draft details if they are ambiguous.",
          "Ask before sending if the user has only asked to draft or review the message."
        ],
        examples: [
          {
            user: "email alex that the meeting is moved to 3pm",
            args: {
              to: "alex@example.com",
              subject: "Meeting update",
              body: "The meeting has moved to 3pm."
            }
          }
        ],
        followups: [
          "Offer to create a draft instead if the user wants to review before sending."
        ]
      }),
      defineTool(integrationSlug, "list_emails", {
        description: "List recent emails from Gmail",
        inputSchema: {
          type: "object",
          properties: {
            maxResults: { type: "number", description: "Maximum number of emails to return (default 10)" },
            query: { type: "string", description: "Gmail search query" },
            labelIds: { type: "array", items: { type: "string" }, description: "Filter by label IDs" }
          }
        },
        accessLevel: "read",
        tags: ["email", "list", "inbox"],
        whenToUse: [
          "User wants to see recent Gmail messages.",
          "You need to search or narrow down messages before opening one."
        ],
        safeDefaults: {
          maxResults: 10
        },
        examples: [
          {
            user: "show my latest gmail messages",
            args: {
              maxResults: 10
            }
          }
        ],
        followups: [
          "Offer to fetch a specific message by id.",
          "Offer to refine with a Gmail search query."
        ]
      }),
      defineTool(integrationSlug, "get_email", {
        description: "Get a specific email by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Email ID" }
          },
          required: ["id"]
        },
        accessLevel: "read",
        tags: ["email", "message", "lookup"],
        whenToUse: [
          "User wants the contents of a specific Gmail message.",
          "A previous list step returned the message id and you need the full details."
        ],
        askBefore: [
          "Ask which message they mean if they have not identified one yet."
        ],
        examples: [
          {
            user: "open that second gmail message",
            args: {
              id: "gmail-message-id"
            }
          }
        ],
        followups: [
          "Offer to draft a reply or summarize the message."
        ]
      }),
      defineTool(integrationSlug, "create_draft", {
        description: "Create a new email draft",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body" }
          },
          required: ["to", "subject", "body"]
        },
        accessLevel: "write",
        tags: ["email", "draft", "gmail"],
        whenToUse: [
          "User wants a draft prepared but not sent yet.",
          "You should avoid sending immediately until the user reviews the message."
        ],
        examples: [
          {
            user: "draft an email to finance asking for the invoice",
            args: {
              to: "finance@example.com",
              subject: "Invoice request",
              body: "Could you send over the latest invoice?"
            }
          }
        ],
        followups: [
          "Offer to send the email after the user reviews the draft."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    const accessToken = getAccessToken(credentials);
    if (!accessToken) {
      throw new Error("Gmail credentials are missing an access token.");
    }
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    };
  }
  async execute(action, args, credentials) {
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
  async readError(response) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error?.message ?? response.statusText;
    throw new IntegrationRequestError(`Gmail request failed: ${message}`, {
      status: response.status,
      code: payload?.error?.code ? String(payload.error.code) : void 0
    });
  }
  async sendEmail(baseUrl, args, credentials) {
    const { to, subject, body, cc, bcc } = args;
    const emailLines = [
      `To: ${to}`,
      subject ? `Subject: ${subject}` : "",
      cc ? `Cc: ${cc}` : "",
      bcc ? `Bcc: ${bcc}` : "",
      "",
      body
    ];
    const email = emailLines.filter(Boolean).join("\n");
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const response = await this.apiRequest(
      `${baseUrl}/users/me/messages/send`,
      {
        method: "POST",
        body: JSON.stringify({ raw: encodedEmail })
      },
      credentials
    );
    if (!response.ok) {
      await this.readError(response);
    }
    return response.json();
  }
  async listEmails(baseUrl, args, credentials) {
    const { maxResults = 10, query, labelIds } = args;
    const params = new URLSearchParams();
    params.set("maxResults", String(maxResults));
    if (query) params.set("q", query);
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
  async getEmail(baseUrl, args, credentials) {
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
  async createDraft(baseUrl, args, credentials) {
    const { to, subject, body } = args;
    const emailLines = [
      `To: ${to}`,
      subject ? `Subject: ${subject}` : "",
      "",
      body
    ];
    const email = emailLines.filter(Boolean).join("\n");
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const response = await this.apiRequest(
      `${baseUrl}/users/me/drafts`,
      {
        method: "POST",
        body: JSON.stringify({
          message: { raw: encodedEmail }
        })
      },
      credentials
    );
    if (!response.ok) {
      await this.readError(response);
    }
    return response.json();
  }
  async validateCredentials(credentials) {
    try {
      const accessToken = getAccessToken(credentials);
      if (!accessToken) {
        return false;
      }
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};
registerHandler("gmail", new GmailHandler());

// integrations/outlook.ts
var GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";
var OutlookHandler = class extends BaseIntegration {
  static {
    __name(this, "OutlookHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "list_messages", {
        description: "List recent Outlook messages",
        inputSchema: {
          type: "object",
          properties: {
            folder: {
              type: "string",
              description: "Optional mail folder id or well-known folder name like inbox or sentitems"
            },
            top: { type: "number", description: "Maximum messages to return (default 10, max 100)" },
            unreadOnly: { type: "boolean", description: "Only return unread messages" },
            includeBody: { type: "boolean", description: "Include the message body instead of bodyPreview only" }
          }
        },
        accessLevel: "read",
        tags: ["email", "messages", "outlook"],
        whenToUse: [
          "User wants to review recent Outlook messages.",
          "You need to identify a message before opening or acting on it."
        ],
        safeDefaults: {
          top: 10,
          unreadOnly: false,
          includeBody: false
        },
        examples: [
          {
            user: "show my latest outlook emails",
            args: {
              top: 10
            }
          }
        ],
        followups: [
          "Offer to fetch a specific message by id.",
          "Offer to narrow to unread messages or a folder."
        ]
      }),
      defineTool(integrationSlug, "get_message", {
        description: "Get a single Outlook message by id",
        inputSchema: {
          type: "object",
          properties: {
            messageId: { type: "string", description: "Outlook message id" }
          },
          required: ["messageId"]
        },
        accessLevel: "read",
        tags: ["email", "message", "lookup"],
        whenToUse: [
          "User wants the contents of a specific Outlook message.",
          "A prior list step returned the message id and the next step is to inspect it."
        ],
        askBefore: [
          "Ask which message they mean if the selection is still ambiguous."
        ],
        examples: [
          {
            user: "open that outlook email from Sarah",
            args: {
              messageId: "outlook-message-id"
            }
          }
        ],
        followups: [
          "Offer to summarize the message or draft a reply."
        ]
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
              description: "Body content type"
            },
            saveToSentItems: {
              type: "boolean",
              description: "Whether to save the message in Sent Items (default true)"
            }
          },
          required: ["to", "subject", "body"]
        },
        accessLevel: "write",
        tags: ["email", "send", "outlook"],
        whenToUse: [
          "User explicitly asks to send an email from Outlook.",
          "Recipients and message content are known and the action is ready to send."
        ],
        askBefore: [
          "Confirm recipients if there is any ambiguity.",
          "Ask before sending if the user may have intended a draft or review step."
        ],
        examples: [
          {
            user: "send an outlook email to ops that maintenance starts tonight",
            args: {
              to: "ops@example.com",
              subject: "Maintenance tonight",
              body: "Maintenance starts tonight at 10pm UTC.",
              bodyType: "Text"
            }
          }
        ],
        followups: [
          "Offer to list recent sent or inbox messages if the user wants to verify context."
        ]
      }),
      defineTool(integrationSlug, "list_events", {
        description: "List Outlook calendar events",
        inputSchema: {
          type: "object",
          properties: {
            top: { type: "number", description: "Maximum events to return (default 10, max 100)" },
            startDateTime: {
              type: "string",
              description: "Start of the date window in ISO-8601 format. When provided, calendarView is used."
            },
            endDateTime: {
              type: "string",
              description: "End of the date window in ISO-8601 format. Required with startDateTime."
            },
            timeZone: {
              type: "string",
              description: "IANA or Windows timezone to prefer in the response, for example UTC"
            }
          }
        },
        accessLevel: "read",
        tags: ["calendar", "events", "outlook"],
        whenToUse: [
          "User wants to see upcoming Outlook calendar events.",
          "You need to inspect existing events before creating or updating one."
        ],
        safeDefaults: {
          top: 10,
          timeZone: "UTC"
        },
        askBefore: [
          "Ask for a date window only if the user needs something more specific than a short upcoming list."
        ],
        examples: [
          {
            user: "what's on my outlook calendar this week",
            args: {
              top: 10,
              timeZone: "UTC"
            }
          }
        ],
        followups: [
          "Offer to create a new event if the user needs one scheduled."
        ]
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
              description: "Optional attendee email addresses"
            },
            isOnlineMeeting: {
              type: "boolean",
              description: "Create the event as an online meeting when supported"
            }
          },
          required: ["subject", "start", "end"]
        },
        accessLevel: "write",
        tags: ["calendar", "events", "create"],
        whenToUse: [
          "User explicitly asks to schedule a calendar event in Outlook."
        ],
        askBefore: [
          "Ask for missing start, end, timezone, or attendees before creating the event.",
          "Confirm if the request could conflict with other calendar events and the user has not asked you to proceed anyway."
        ],
        examples: [
          {
            user: "schedule a 30 minute outlook meeting with Priya tomorrow at 2pm UTC",
            args: {
              subject: "Meeting with Priya",
              start: "2026-04-06T14:00:00Z",
              end: "2026-04-06T14:30:00Z",
              timeZone: "UTC",
              attendees: ["priya@example.com"]
            }
          }
        ],
        followups: [
          "Offer to list upcoming events to verify the calendar."
        ]
      }),
      defineTool(integrationSlug, "list_contacts", {
        description: "List Outlook contacts",
        inputSchema: {
          type: "object",
          properties: {
            top: { type: "number", description: "Maximum contacts to return (default 25, max 100)" }
          }
        },
        accessLevel: "read",
        tags: ["contacts", "people", "outlook"],
        whenToUse: [
          "User wants to see Outlook contacts.",
          "You need to find a contact before sending email or scheduling an event."
        ],
        safeDefaults: {
          top: 25
        },
        examples: [
          {
            user: "show my outlook contacts",
            args: {
              top: 25
            }
          }
        ],
        followups: [
          "Offer to send an email or create an event with one of the contacts."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${credentials.accessToken}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
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
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(`${GRAPH_BASE_URL}/me`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }
  async listMessages(args, credentials) {
    const top = Math.min(Math.max(Number(args.top) || 10, 1), 100);
    const includeBody = Boolean(args.includeBody);
    const query = new URLSearchParams({
      $top: String(top),
      $orderby: "receivedDateTime DESC",
      $select: includeBody ? "id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,body,bodyPreview,webLink" : "id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,bodyPreview,webLink"
    });
    if (args.unreadOnly) {
      query.set("$filter", "isRead eq false");
    }
    const folder = typeof args.folder === "string" && args.folder.trim() ? args.folder.trim() : null;
    const path = folder ? `${GRAPH_BASE_URL}/me/mailFolders/${encodeURIComponent(folder)}/messages?${query.toString()}` : `${GRAPH_BASE_URL}/me/messages?${query.toString()}`;
    const response = await this.apiRequest(path, { method: "GET" }, credentials);
    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook messages", response);
    }
    return response.json();
  }
  async getMessage(args, credentials) {
    const messageId = String(args.messageId ?? "").trim();
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/messages/${encodeURIComponent(messageId)}?$select=id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,isRead,body,bodyPreview,webLink`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Outlook message", response);
    }
    return response.json();
  }
  async sendEmail(args, credentials) {
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
              content: args.body
            },
            toRecipients: this.parseRecipients(args.to),
            ...ccRecipients.length > 0 ? { ccRecipients } : {},
            ...bccRecipients.length > 0 ? { bccRecipients } : {}
          },
          saveToSentItems: args.saveToSentItems ?? true
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to send Outlook email", response);
    }
    return {
      ok: true,
      message: "Email sent successfully."
    };
  }
  async listEvents(args, credentials) {
    const top = Math.min(Math.max(Number(args.top) || 10, 1), 100);
    const timeZone = typeof args.timeZone === "string" && args.timeZone.trim() ? args.timeZone.trim() : null;
    const headers = timeZone ? { Prefer: `outlook.timezone="${timeZone}"` } : void 0;
    const startDateTime = typeof args.startDateTime === "string" && args.startDateTime.trim() ? args.startDateTime.trim() : null;
    const endDateTime = typeof args.endDateTime === "string" && args.endDateTime.trim() ? args.endDateTime.trim() : null;
    const response = startDateTime && endDateTime ? await this.apiRequest(
      `${GRAPH_BASE_URL}/me/calendarView?${new URLSearchParams({
        startDateTime,
        endDateTime,
        $top: String(top),
        $orderby: "start/dateTime"
      }).toString()}`,
      { method: "GET", headers },
      credentials
    ) : await this.apiRequest(
      `${GRAPH_BASE_URL}/me/events?${new URLSearchParams({
        $top: String(top),
        $orderby: "start/dateTime"
      }).toString()}`,
      { method: "GET", headers },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook events", response);
    }
    return response.json();
  }
  async createEvent(args, credentials) {
    const timeZone = typeof args.timeZone === "string" && args.timeZone.trim() ? args.timeZone.trim() : "UTC";
    const attendees = Array.isArray(args.attendees) ? args.attendees.map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean) : [];
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/events`,
      {
        method: "POST",
        body: JSON.stringify({
          subject: args.subject,
          ...typeof args.body === "string" && args.body.trim() ? {
            body: {
              contentType: "Text",
              content: args.body
            }
          } : {},
          start: {
            dateTime: args.start,
            timeZone
          },
          end: {
            dateTime: args.end,
            timeZone
          },
          ...typeof args.location === "string" && args.location.trim() ? { location: { displayName: args.location.trim() } } : {},
          ...attendees.length > 0 ? {
            attendees: attendees.map((email) => ({
              emailAddress: { address: email },
              type: "required"
            }))
          } : {},
          ...args.isOnlineMeeting ? { isOnlineMeeting: true, onlineMeetingProvider: "teamsForBusiness" } : {}
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Outlook event", response);
    }
    return response.json();
  }
  async listContacts(args, credentials) {
    const top = Math.min(Math.max(Number(args.top) || 25, 1), 100);
    const response = await this.apiRequest(
      `${GRAPH_BASE_URL}/me/contacts?${new URLSearchParams({
        $top: String(top),
        $select: "id,displayName,givenName,surname,emailAddresses,businessPhones,mobilePhone,companyName"
      }).toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Outlook contacts", response);
    }
    return response.json();
  }
  parseRecipients(value) {
    if (typeof value !== "string") {
      return [];
    }
    return value.split(",").map((email) => email.trim()).filter(Boolean).map((address) => ({
      emailAddress: { address }
    }));
  }
  async createApiError(prefix, response) {
    const payload = await response.json().catch(() => null);
    const code = payload?.error?.code;
    const message = payload?.error?.message ?? response.statusText;
    return new IntegrationRequestError(
      code ? `${prefix}: ${code} (${message})` : `${prefix}: ${message}`,
      {
        status: response.status,
        code
      }
    );
  }
};
registerHandler("outlook", new OutlookHandler());

// integrations/slack.ts
var SlackHandler = class extends BaseIntegration {
  static {
    __name(this, "SlackHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "send_message", {
        description: "Post a Slack message to a channel",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "string", description: "Channel ID or channel name" },
            text: { type: "string", description: "Message body" }
          },
          required: ["channel", "text"]
        },
        accessLevel: "write",
        tags: ["messaging", "channels", "slack"],
        whenToUse: [
          "User explicitly asks to send or post a Slack message.",
          "The destination channel is known and the task is to notify or update teammates."
        ],
        askBefore: [
          "Ask which channel to use if the user did not name one clearly.",
          "Confirm before posting if the message could be sensitive or broadly visible."
        ],
        examples: [
          {
            user: "send a slack message to #general saying deployment is live",
            args: {
              channel: "#general",
              text: "Deployment is live."
            }
          }
        ],
        followups: [
          "Offer to list channels if the user is unsure where to post."
        ]
      }),
      defineTool(integrationSlug, "list_channels", {
        description: "List public Slack channels available to the bot",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Maximum channels to return (default 100)" }
          }
        },
        accessLevel: "read",
        tags: ["channels", "discovery", "slack"],
        whenToUse: [
          "User wants to know which Slack channels are available.",
          "You need a channel before sending a message and the user has not specified one."
        ],
        safeDefaults: {
          limit: 100
        },
        examples: [
          {
            user: "what slack channels can you access",
            args: {
              limit: 100
            }
          }
        ],
        followups: [
          "Offer to send a message to one of the returned channels."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${credentials.botToken}`,
      "Content-Type": "application/json; charset=utf-8"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "send_message":
        return this.sendMessage(args, credentials);
      case "list_channels":
        return this.listChannels(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await fetch("https://slack.com/api/auth.test", {
        headers: this.getHeaders(credentials)
      });
      const data = await response.json().catch(() => null);
      return Boolean(response.ok && data?.ok);
    } catch {
      return false;
    }
  }
  async sendMessage(args, credentials) {
    const response = await this.apiRequest(
      "https://slack.com/api/chat.postMessage",
      {
        method: "POST",
        body: JSON.stringify({
          channel: args.channel,
          text: args.text
        })
      },
      credentials
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      throw new Error(`Failed to send message: ${payload?.error ?? response.statusText}`);
    }
    return payload;
  }
  async listChannels(args, credentials) {
    const params = new URLSearchParams({
      limit: String(args.limit ?? 100),
      exclude_archived: "true",
      types: "public_channel"
    });
    const response = await this.apiRequest(
      `https://slack.com/api/conversations.list?${params.toString()}`,
      { method: "GET" },
      credentials
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      throw new Error(`Failed to list channels: ${payload?.error ?? response.statusText}`);
    }
    return payload;
  }
};
registerHandler("slack", new SlackHandler());

// integrations/github.ts
var GitHubHandler = class extends BaseIntegration {
  static {
    __name(this, "GitHubHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "list_repos", {
        description: "List repositories visible to the authenticated GitHub user",
        inputSchema: {
          type: "object",
          properties: {
            visibility: {
              type: "string",
              enum: ["all", "public", "private"],
              description: "Repository visibility filter"
            },
            affiliation: {
              type: "string",
              description: "Comma-separated affiliations such as owner,collaborator,organization_member"
            },
            perPage: { type: "number", description: "Maximum repositories to return (default 20)" }
          }
        },
        accessLevel: "read",
        tags: ["github", "repos", "discovery"],
        whenToUse: [
          "User wants to know which GitHub repositories are available.",
          "You need a repository before listing issues or creating one."
        ],
        safeDefaults: {
          visibility: "all",
          perPage: 20
        },
        examples: [
          {
            user: "what github repos can you access",
            args: {
              visibility: "all",
              perPage: 20
            }
          }
        ],
        followups: [
          "Offer to list issues for a selected repository."
        ]
      }),
      defineTool(integrationSlug, "list_issues", {
        description: "List issues from a GitHub repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "Repository owner" },
            repo: { type: "string", description: "Repository name" },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Issue state filter"
            },
            perPage: { type: "number", description: "Maximum issues to return (default 20)" }
          },
          required: ["owner", "repo"]
        },
        accessLevel: "read",
        tags: ["github", "issues", "repos"],
        whenToUse: [
          "User wants to see issues in a repository.",
          "You need to inspect existing issues before creating a new one."
        ],
        safeDefaults: {
          state: "open",
          perPage: 20
        },
        askBefore: [
          "Ask which repository they mean if owner or repo is missing."
        ],
        examples: [
          {
            user: "show open github issues in useclawlink/clawlink",
            args: {
              owner: "useclawlink",
              repo: "clawlink",
              state: "open",
              perPage: 20
            }
          }
        ],
        followups: [
          "Offer to create a new issue if nothing matches."
        ]
      }),
      defineTool(integrationSlug, "create_issue", {
        description: "Create an issue in a GitHub repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "Repository owner" },
            repo: { type: "string", description: "Repository name" },
            title: { type: "string", description: "Issue title" },
            body: { type: "string", description: "Issue body" }
          },
          required: ["owner", "repo", "title"]
        },
        accessLevel: "write",
        tags: ["github", "issues", "create"],
        whenToUse: [
          "User explicitly asks to open a GitHub issue."
        ],
        askBefore: [
          "Ask which repository to use if owner or repo is missing.",
          "Ask for the issue title or body if the request is underspecified."
        ],
        examples: [
          {
            user: "open a github issue in useclawlink/clawlink for the oauth timeout bug",
            args: {
              owner: "useclawlink",
              repo: "clawlink",
              title: "OAuth timeout bug",
              body: "Users are hitting a timeout during the OAuth callback flow."
            }
          }
        ],
        followups: [
          "Offer to list issues afterward so the user can verify it was created."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${credentials.accessToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "list_repos":
        return this.listRepos(args, credentials);
      case "list_issues":
        return this.listIssues(args, credentials);
      case "create_issue":
        return this.createIssue(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: this.getHeaders(credentials)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  async listRepos(args, credentials) {
    const params = new URLSearchParams({
      visibility: String(args.visibility ?? "all"),
      per_page: String(args.perPage ?? 20)
    });
    if (typeof args.affiliation === "string" && args.affiliation.trim()) {
      params.set("affiliation", args.affiliation);
    }
    const response = await this.apiRequest(
      `https://api.github.com/user/repos?${params.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list repositories", response);
    }
    return response.json();
  }
  async listIssues(args, credentials) {
    const owner = String(args.owner ?? "");
    const repo = String(args.repo ?? "");
    const params = new URLSearchParams({
      state: String(args.state ?? "open"),
      per_page: String(args.perPage ?? 20)
    });
    const response = await this.apiRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues?${params.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list issues", response);
    }
    return response.json();
  }
  async createIssue(args, credentials) {
    const owner = String(args.owner ?? "");
    const repo = String(args.repo ?? "");
    const response = await this.apiRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        body: JSON.stringify({
          title: args.title,
          body: args.body
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create issue", response);
    }
    return response.json();
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    return new Error(`${prefix}: ${body?.message ?? response.statusText}`);
  }
};
registerHandler("github", new GitHubHandler());

// integrations/notion.ts
function joinRichText(richText) {
  if (!Array.isArray(richText)) return "";
  return richText.map((rt) => typeof rt?.plain_text === "string" ? rt.plain_text : "").join("");
}
__name(joinRichText, "joinRichText");
function extractPageTitle(properties) {
  if (!properties || typeof properties !== "object") return null;
  for (const value of Object.values(properties)) {
    const prop = value;
    if (prop?.type === "title" && Array.isArray(prop.title)) {
      const title = joinRichText(prop.title);
      if (title) return title;
    }
  }
  return null;
}
__name(extractPageTitle, "extractPageTitle");
function summarizeSearchItem(item) {
  const type = item?.object === "database" ? "database" : "page";
  const title = type === "database" ? joinRichText(item?.title) || null : extractPageTitle(item?.properties);
  return {
    id: item?.id ?? null,
    type,
    title,
    url: item?.url ?? null,
    lastEditedTime: item?.last_edited_time ?? null,
    parent: item?.parent ?? null
  };
}
__name(summarizeSearchItem, "summarizeSearchItem");
function summarizeBlock(block) {
  const type = block?.type ?? "unknown";
  const content = block?.[type] ?? {};
  let text = null;
  if (Array.isArray(content?.rich_text)) {
    text = joinRichText(content.rich_text) || null;
  } else if (type === "child_page" || type === "child_database") {
    text = typeof content?.title === "string" ? content.title : null;
  }
  const summary = {
    id: block?.id ?? null,
    type,
    text,
    hasChildren: Boolean(block?.has_children)
  };
  if (type === "to_do") {
    summary.checked = Boolean(content?.checked);
  }
  return summary;
}
__name(summarizeBlock, "summarizeBlock");
var NotionHandler = class extends BaseIntegration {
  static {
    __name(this, "NotionHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "search", {
        description: "Search pages and databases in Notion. Returns a compact list with { id, type, title, url } \u2014 use the id directly with notion_get_blocks or notion_query_database.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (use empty string to list recent items)" },
            objectType: {
              type: "string",
              enum: ["page", "database"],
              description: "Optional: restrict results to pages or databases only"
            },
            pageSize: { type: "number", description: "Number of results (default 10, max 100)" }
          },
          required: ["query"]
        },
        accessLevel: "read",
        tags: ["search", "pages", "databases"],
        whenToUse: [
          "User asks what pages or databases are available in Notion.",
          "User wants to find a page or database before reading or updating it."
        ],
        askBefore: [
          "Ask which workspace or object they mean if the request is vague and multiple matches are likely."
        ],
        safeDefaults: { pageSize: 10 },
        examples: [
          { user: "what pages can you see in notion", args: { query: "", objectType: "page", pageSize: 10 } }
        ],
        followups: [
          "Use the returned id with notion_get_blocks to read content.",
          "Use the returned id with notion_query_database if it is a database."
        ]
      }),
      defineTool(integrationSlug, "get_page", {
        description: "Get page metadata and properties by ID (use get_blocks to read the actual page content)",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID (32 characters)" }
          },
          required: ["pageId"]
        },
        accessLevel: "read",
        tags: ["page", "lookup", "content"],
        whenToUse: [
          "User wants the contents or metadata of a specific Notion page.",
          "A prior search returned a page id and the next step is to inspect it."
        ],
        askBefore: [
          "Ask which page they mean if they have not identified a specific page yet."
        ],
        examples: [
          { user: "open the onboarding page in notion", args: { pageId: "32-character-page-id" } }
        ],
        followups: [
          "Offer to append content to the page.",
          "Offer to search for related pages or databases."
        ]
      }),
      defineTool(integrationSlug, "get_blocks", {
        description: "Get the content blocks of a page or block. Returns a compact list with { id, type, text, hasChildren, checked? } \u2014 use the id with notion_update_block or recurse into children.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Page ID or block ID to retrieve children from" },
            pageSize: { type: "number", description: "Number of blocks to return (default 50, max 100)" },
            startCursor: { type: "string", description: "Cursor for pagination (from previous response)" }
          },
          required: ["blockId"]
        },
        accessLevel: "read",
        tags: ["page", "blocks", "content", "read"],
        whenToUse: [
          "User wants to read the actual content of a Notion page.",
          "A prior search or get_page call identified a page and the user wants to see what is inside it."
        ],
        askBefore: [
          "Ask which page they mean if they have not identified a specific page yet."
        ],
        safeDefaults: { pageSize: 50 },
        examples: [
          { user: "show me what's on the onboarding page", args: { blockId: "page-id-from-search", pageSize: 50 } }
        ],
        followups: [
          "Offer to fetch nested blocks if a block has children.",
          "Offer to use notion_update_block to check off a to_do item.",
          "Offer to append new content to the page."
        ]
      }),
      defineTool(integrationSlug, "update_block", {
        description: "Update an existing Notion block \u2014 mark a to-do as done/undone, or rewrite its text. Use this to check off to-do items.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Block ID from notion_get_blocks" },
            checked: { type: "boolean", description: "For to_do blocks: true to mark done, false to un-check" },
            text: { type: "string", description: "Replace the block's text content" }
          },
          required: ["blockId"]
        },
        accessLevel: "write",
        tags: ["block", "update", "checkbox", "edit"],
        whenToUse: [
          "User wants to mark a to-do item as complete or incomplete.",
          "User wants to rewrite the text of an existing block."
        ],
        askBefore: [
          "Confirm before editing text in a shared document if the change is substantive."
        ],
        examples: [
          { user: "mark Norway as done", args: { blockId: "block-id-from-get-blocks", checked: true } },
          { user: "rename that heading to Q2 goals", args: { blockId: "heading-block-id", text: "Q2 goals" } }
        ],
        followups: [
          "Offer to fetch the block's parent page again to confirm the change."
        ]
      }),
      defineTool(integrationSlug, "update_page_properties", {
        description: "Update properties of a Notion page, typically a database row \u2014 e.g. change a Status select, Date, or title.",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID" },
            properties: {
              type: "object",
              description: "Notion properties object keyed by property name, e.g. { Status: { select: { name: 'Done' } } }"
            }
          },
          required: ["pageId", "properties"]
        },
        accessLevel: "write",
        tags: ["page", "properties", "update", "database-row"],
        whenToUse: [
          "User wants to change a status, date, title, or other property on a database row."
        ],
        askBefore: [
          "Ask which property to change if the user's wording is ambiguous."
        ],
        examples: [
          {
            user: "set the status of that task to Done",
            args: { pageId: "page-id", properties: { Status: { select: { name: "Done" } } } }
          }
        ],
        followups: ["Offer to fetch the page again so the user can verify."]
      }),
      defineTool(integrationSlug, "delete_block", {
        description: "Delete (archive) a Notion block. Notion moves deleted blocks to the trash.",
        inputSchema: {
          type: "object",
          properties: {
            blockId: { type: "string", description: "Block ID to delete" }
          },
          required: ["blockId"]
        },
        accessLevel: "write",
        tags: ["block", "delete", "archive"],
        whenToUse: ["User explicitly asks to delete or remove a specific block."],
        askBefore: ["Always confirm before deleting, especially in shared documents."],
        examples: [
          { user: "delete that block", args: { blockId: "block-id" } }
        ],
        followups: ["Offer to fetch the parent page so the user can confirm removal."]
      }),
      defineTool(integrationSlug, "create_page", {
        description: "Create a new page",
        inputSchema: {
          type: "object",
          properties: {
            parent: { type: "string", description: "Parent page ID or database ID" },
            title: { type: "string", description: "Page title (for database pages)" },
            content: { type: "string", description: "Page content (markdown)" },
            properties: { type: "object", description: "Page properties (for database pages)" }
          },
          required: ["parent"]
        },
        accessLevel: "write",
        tags: ["page", "create", "content"],
        whenToUse: [
          "User explicitly asks to create a page in Notion.",
          "User wants a new database row-like page created under a parent database or page."
        ],
        askBefore: [
          "Ask which parent page or database should own the new page if it is not explicit.",
          "Ask for missing title or content details before creating the page."
        ],
        examples: [
          {
            user: "create a notion page called Weekly recap under the team wiki",
            args: { parent: "parent-page-or-database-id", title: "Weekly recap", content: "## Highlights\n- Launch shipped" }
          }
        ],
        followups: [
          "Offer to append more content.",
          "Offer to create a related database if they need structured records."
        ]
      }),
      defineTool(integrationSlug, "query_database", {
        description: "Query a database",
        inputSchema: {
          type: "object",
          properties: {
            databaseId: { type: "string", description: "Database ID" },
            filter: { type: "object", description: "Notion filter object" },
            sorts: { type: "array", description: "Sort options" },
            pageSize: { type: "number", description: "Number of results (default 10, max 100)" }
          },
          required: ["databaseId"]
        },
        accessLevel: "read",
        tags: ["database", "query", "records"],
        whenToUse: [
          "User wants rows or records from a specific Notion database.",
          "A previous search identified the database and the next step is to inspect entries."
        ],
        askBefore: [
          "Ask which database they mean if they have not picked one yet.",
          "Ask for filters or sorting only when the user needs something more specific than a short recent list."
        ],
        safeDefaults: { pageSize: 10 },
        examples: [
          { user: "show the latest tasks in my notion project tracker", args: { databaseId: "database-id", pageSize: 10 } }
        ],
        followups: [
          "Offer to fetch or update a selected record page.",
          "Offer to refine with filters or sorts."
        ]
      }),
      defineTool(integrationSlug, "create_database", {
        description: "Create a new database",
        inputSchema: {
          type: "object",
          properties: {
            parentPageId: { type: "string", description: "Parent page ID" },
            title: { type: "string", description: "Database title" },
            properties: { type: "object", description: "Database properties schema" }
          },
          required: ["parentPageId", "title"]
        },
        accessLevel: "write",
        tags: ["database", "create", "schema"],
        whenToUse: [
          "User explicitly asks to create a new Notion database.",
          "User needs a structured table-like workspace under a parent page."
        ],
        askBefore: [
          "Ask which parent page should contain the database if it is not explicit.",
          "Ask for the properties schema if the user has not described the columns yet."
        ],
        examples: [
          {
            user: "create a notion database for interview candidates under recruiting",
            args: { parentPageId: "parent-page-id", title: "Interview candidates", properties: { Name: { title: {} } } }
          }
        ],
        followups: [
          "Offer to add an initial page or record.",
          "Offer to query the database once it exists."
        ]
      }),
      defineTool(integrationSlug, "append_blocks", {
        description: "Append blocks to a page",
        inputSchema: {
          type: "object",
          properties: {
            pageId: { type: "string", description: "Page ID" },
            content: { type: "string", description: "Content to append (markdown)" }
          },
          required: ["pageId", "content"]
        },
        accessLevel: "write",
        tags: ["page", "append", "content"],
        whenToUse: [
          "User wants to add notes, checklist items, or other content to an existing Notion page.",
          "A previous read step identified the page and the next step is to extend it."
        ],
        askBefore: [
          "Ask which page to update if they have not named it clearly.",
          "Confirm before appending if the content might modify an important shared document unexpectedly."
        ],
        examples: [
          {
            user: "append today's meeting notes to the launch page",
            args: { pageId: "page-id", content: "## Meeting notes\n- Confirmed launch checklist" }
          }
        ],
        followups: [
          "Offer to fetch the page again so the user can verify the new content.",
          "Offer to create a related follow-up page if the notes need their own document."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      "Authorization": `Bearer ${credentials.integrationToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "search":
        return this.search(args, credentials);
      case "get_page":
        return this.getPage(args, credentials);
      case "get_blocks":
        return this.getBlocks(args, credentials);
      case "update_block":
        return this.updateBlock(args, credentials);
      case "update_page_properties":
        return this.updatePageProperties(args, credentials);
      case "delete_block":
        return this.deleteBlock(args, credentials);
      case "create_page":
        return this.createPage(args, credentials);
      case "query_database":
        return this.queryDatabase(args, credentials);
      case "create_database":
        return this.createDatabase(args, credentials);
      case "append_blocks":
        return this.appendBlocks(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        "https://api.notion.com/v1/users/me",
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async search(args, credentials) {
    const body = {
      query: args.query ?? "",
      page_size: Math.min(Number(args.pageSize) || 10, 100)
    };
    const objectType = args.objectType;
    if (objectType === "page" || objectType === "database") {
      body.filter = { property: "object", value: objectType };
    }
    const response = await this.apiRequest(
      "https://api.notion.com/v1/search",
      { method: "POST", body: JSON.stringify(body) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to search", response);
    const raw = await response.json();
    return {
      results: Array.isArray(raw?.results) ? raw.results.map(summarizeSearchItem) : [],
      nextCursor: raw?.next_cursor ?? null,
      hasMore: Boolean(raw?.has_more)
    };
  }
  async getPage(args, credentials) {
    const pageId = args.pageId;
    const response = await this.apiRequest(
      `https://api.notion.com/v1/pages/${pageId}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to get page", response);
    return response.json();
  }
  async getBlocks(args, credentials) {
    const blockId = args.blockId;
    const pageSize = Math.min(Number(args.pageSize) || 50, 100);
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set("page_size", String(pageSize));
    if (args.startCursor) url.searchParams.set("start_cursor", args.startCursor);
    const response = await this.apiRequest(url.toString(), { method: "GET" }, credentials);
    if (!response.ok) throw await this.createApiError("Failed to get blocks", response);
    const raw = await response.json();
    return {
      blocks: Array.isArray(raw?.results) ? raw.results.map(summarizeBlock) : [],
      nextCursor: raw?.next_cursor ?? null,
      hasMore: Boolean(raw?.has_more)
    };
  }
  async updateBlock(args, credentials) {
    const blockId = args.blockId;
    const checked = args.checked;
    const text = args.text;
    if (!blockId) throw new Error("blockId is required");
    if (typeof checked !== "boolean" && typeof text !== "string") {
      throw new Error("Provide at least one of: checked (boolean), text (string)");
    }
    const getResponse = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "GET" },
      credentials
    );
    if (!getResponse.ok) throw await this.createApiError("Failed to fetch block", getResponse);
    const block = await getResponse.json();
    const type = block?.type;
    if (!type) throw new Error("Could not determine block type from Notion response");
    const typeBody = {};
    if (typeof checked === "boolean") {
      if (type !== "to_do") throw new Error(`checked can only be set on to_do blocks (this block is ${type})`);
      typeBody.checked = checked;
    }
    if (typeof text === "string") {
      typeBody.rich_text = [{ type: "text", text: { content: text } }];
    }
    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "PATCH", body: JSON.stringify({ [type]: typeBody }) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to update block", response);
    return summarizeBlock(await response.json());
  }
  async updatePageProperties(args, credentials) {
    const pageId = args.pageId;
    const properties = args.properties;
    if (!pageId) throw new Error("pageId is required");
    if (!properties || typeof properties !== "object") throw new Error("properties must be an object");
    const response = await this.apiRequest(
      `https://api.notion.com/v1/pages/${pageId}`,
      { method: "PATCH", body: JSON.stringify({ properties }) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to update page properties", response);
    const raw = await response.json();
    return {
      id: raw?.id ?? pageId,
      url: raw?.url ?? null,
      lastEditedTime: raw?.last_edited_time ?? null,
      title: extractPageTitle(raw?.properties)
    };
  }
  async deleteBlock(args, credentials) {
    const blockId = args.blockId;
    if (!blockId) throw new Error("blockId is required");
    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${blockId}`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to delete block", response);
    return { id: blockId, archived: true };
  }
  async createPage(args, credentials) {
    const parent = args.parent;
    const body = {};
    if (parent.length === 32) {
      body.parent = { database_id: parent };
    } else {
      body.parent = { page_id: parent };
    }
    if (args.title) {
      body.properties = {
        Name: { title: [{ text: { content: args.title } }] }
      };
    }
    if (args.content) {
      body.children = this.markdownToBlocks(args.content);
    }
    const response = await this.apiRequest(
      "https://api.notion.com/v1/pages",
      { method: "POST", body: JSON.stringify(body) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to create page", response);
    return response.json();
  }
  async queryDatabase(args, credentials) {
    const databaseId = args.databaseId;
    const body = {};
    if (args.filter) body.filter = args.filter;
    if (args.sorts) body.sorts = args.sorts;
    body.page_size = Math.min(Number(args.pageSize) || 10, 100);
    const response = await this.apiRequest(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      { method: "POST", body: JSON.stringify(body) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to query database", response);
    return response.json();
  }
  async createDatabase(args, credentials) {
    const body = {
      parent: { page_id: args.parentPageId },
      title: [{ type: "text", text: { content: args.title } }],
      properties: args.properties || {}
    };
    const response = await this.apiRequest(
      "https://api.notion.com/v1/databases",
      { method: "POST", body: JSON.stringify(body) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to create database", response);
    return response.json();
  }
  async appendBlocks(args, credentials) {
    const pageId = args.pageId;
    const content = args.content;
    const body = { children: this.markdownToBlocks(content) };
    const response = await this.apiRequest(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      { method: "POST", body: JSON.stringify(body) },
      credentials
    );
    if (!response.ok) throw await this.createApiError("Failed to append blocks", response);
    return response.json();
  }
  markdownToBlocks(markdown) {
    const lines = markdown.split("\n");
    const blocks = [];
    for (const line of lines) {
      if (line.startsWith("### ")) {
        blocks.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] } });
      } else if (line.startsWith("## ")) {
        blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } });
      } else if (line.startsWith("# ")) {
        blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      } else if (line.startsWith("- ")) {
        blocks.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      } else if (line.trim()) {
        blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: line } }] } });
      }
    }
    return blocks;
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const error = new Error(`${prefix}: ${response.status} ${body?.message ?? response.statusText}`);
    error.status = response.status;
    return error;
  }
};
registerHandler("notion", new NotionHandler());

// integrations/apollo.ts
var APOLLO_BASE_URL = "https://api.apollo.io/api/v1";
var ApolloHandler = class extends BaseIntegration {
  static {
    __name(this, "ApolloHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "search_people", {
        description: "Search Apollo's people database for leads that match role, company, geography, and seniority filters",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "General keyword query across names, titles, and employers"
            },
            personTitles: {
              type: "array",
              items: { type: "string" },
              description: "Job titles to match, for example sales director or founder"
            },
            includeSimilarTitles: {
              type: "boolean",
              description: "Whether Apollo should include similar job titles"
            },
            personLocations: {
              type: "array",
              items: { type: "string" },
              description: "Person locations, for example California, US"
            },
            personSeniorities: {
              type: "array",
              items: { type: "string" },
              description: "Apollo seniority filters such as founder, c_suite, vp, director, or manager"
            },
            organizationLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations for the current employer"
            },
            organizationDomains: {
              type: "array",
              items: { type: "string" },
              description: "Employer domains such as apollo.io or microsoft.com"
            },
            contactEmailStatus: {
              type: "array",
              items: { type: "string" },
              description: "Email-status filters such as verified or unverified"
            },
            organizationIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo organization ids to constrain the search"
            },
            organizationNumEmployeesRanges: {
              type: "array",
              items: { type: "string" },
              description: "Headcount ranges like 1,10 or 250,500"
            },
            page: {
              type: "number",
              description: "Results page number"
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100"
            },
            filters: {
              type: "object",
              description: "Additional Apollo query parameters to forward directly"
            }
          }
        },
        accessLevel: "read",
        tags: ["prospecting", "people", "search", "apollo"],
        whenToUse: [
          "User wants to find net-new prospects in Apollo's database.",
          "User asks for people matching job title, company, geography, or seniority filters."
        ],
        askBefore: [
          "Ask for tighter filters before running a broad search, because Apollo pages large result sets and encourages narrowing searches.",
          "If the user expects email addresses or phone numbers, explain that this search endpoint may require additional enrichment or Apollo credits."
        ],
        safeDefaults: {
          includeSimilarTitles: true,
          page: 1,
          perPage: 10
        },
        examples: [
          {
            user: "find sales directors in California and Oregon at microsoft.com",
            args: {
              personTitles: ["sales director", "director sales"],
              personLocations: ["California, US", "Oregon, US"],
              organizationDomains: ["microsoft.com"],
              perPage: 10
            }
          }
        ],
        followups: [
          "Offer to enrich a selected person to retrieve fuller profile details.",
          "Offer to create a contact after the user confirms the prospect they want to save."
        ]
      }),
      defineTool(integrationSlug, "search_organizations", {
        description: "Search companies in Apollo's organization database",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Company-name or keyword filter"
            },
            organizationDomains: {
              type: "array",
              items: { type: "string" },
              description: "Company domains such as apollo.io or microsoft.com"
            },
            organizationLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations such as Texas or Tokyo"
            },
            organizationNotLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations to exclude"
            },
            organizationIds: {
              type: "array",
              items: { type: "string" },
              description: "Specific Apollo organization IDs to look up"
            },
            organizationNumEmployeesRanges: {
              type: "array",
              items: { type: "string" },
              description: "Headcount ranges like 1,10 or 1000,5000"
            },
            keywordTags: {
              type: "array",
              items: { type: "string" },
              description: "Apollo keyword tags associated with companies"
            },
            page: {
              type: "number",
              description: "Results page number"
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100"
            },
            filters: {
              type: "object",
              description: "Additional Apollo query parameters to forward directly"
            }
          }
        },
        accessLevel: "read",
        tags: ["prospecting", "companies", "accounts", "apollo"],
        whenToUse: [
          "User wants to find companies before searching for people or enriching a company.",
          "User asks for organizations filtered by name, domain, size, or HQ location."
        ],
        askBefore: [
          "Ask for a company name, domain, or location if the request is too broad."
        ],
        safeDefaults: {
          page: 1,
          perPage: 10
        },
        examples: [
          {
            user: "find SaaS companies in California with 250 to 500 employees",
            args: {
              keywordTags: ["saas"],
              organizationLocations: ["California, US"],
              organizationNumEmployeesRanges: ["250,500"],
              perPage: 10
            }
          }
        ],
        followups: [
          "Offer to search people within a selected organization.",
          "Offer to enrich a selected organization by domain for fuller firmographic details."
        ]
      }),
      defineTool(integrationSlug, "enrich_person", {
        description: "Enrich a single person's profile in Apollo",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string", description: "Person's first name" },
            lastName: { type: "string", description: "Person's last name" },
            name: {
              type: "string",
              description: "Person's full name if you are not sending first and last separately"
            },
            email: { type: "string", description: "Work email address for the person" },
            organizationName: { type: "string", description: "Employer name" },
            domain: { type: "string", description: "Employer domain such as apollo.io" },
            id: { type: "string", description: "Apollo person id" },
            linkedinUrl: { type: "string", description: "LinkedIn profile URL" },
            revealPersonalEmails: {
              type: "boolean",
              description: "Request personal emails in addition to standard profile data"
            }
          }
        },
        accessLevel: "read",
        tags: ["enrichment", "people", "profile", "apollo"],
        whenToUse: [
          "User has identified a specific prospect and wants richer profile details.",
          "A previous people search returned an Apollo person id and the next step is to enrich it."
        ],
        askBefore: [
          "Ask for more identifying data if the user only provides a very generic name.",
          "Confirm before revealing personal emails because that can consume Apollo credits."
        ],
        safeDefaults: {
          revealPersonalEmails: false
        },
        examples: [
          {
            user: "enrich that Apollo prospect from microsoft.com",
            args: {
              id: "587cf802f65125cad923a266",
              revealPersonalEmails: false
            }
          }
        ],
        followups: [
          "Offer to create a contact from the enriched person once the user confirms."
        ]
      }),
      defineTool(integrationSlug, "enrich_organization", {
        description: "Enrich a single organization in Apollo by domain",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Company domain such as apollo.io or microsoft.com"
            }
          },
          required: ["domain"]
        },
        accessLevel: "read",
        tags: ["enrichment", "companies", "firmographics", "apollo"],
        whenToUse: [
          "User wants fuller firmographic data for a specific company.",
          "You already know the company domain and want revenue, size, industry, or location details."
        ],
        examples: [
          {
            user: "enrich apollo.io in Apollo",
            args: {
              domain: "apollo.io"
            }
          }
        ],
        followups: [
          "Offer to search people at the enriched company."
        ]
      }),
      defineTool(integrationSlug, "search_contacts", {
        description: "Search contacts already added to the team's Apollo account",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keywords across names, job titles, employers, and emails"
            },
            contactStageIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact stage ids to include"
            },
            contactLabelIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact label ids to include"
            },
            emailStatuses: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact email status values to filter on"
            },
            sortByField: {
              type: "string",
              description: "Sort field, for example contact_created_at or contact_last_activity_date"
            },
            sortAscending: {
              type: "boolean",
              description: "Whether to sort ascending"
            },
            page: {
              type: "number",
              description: "Results page number"
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100"
            },
            filters: {
              type: "object",
              description: "Additional Apollo body fields to merge into the search request"
            }
          }
        },
        accessLevel: "read",
        tags: ["contacts", "crm", "search", "apollo"],
        whenToUse: [
          "User wants to search people already saved in their Apollo workspace.",
          "You need to check whether a prospect is already a contact before creating one."
        ],
        askBefore: [
          "Use a keyword query or stage filter to avoid broad contact scans when possible."
        ],
        safeDefaults: {
          page: 1,
          perPage: 10
        },
        examples: [
          {
            user: "search Apollo contacts for Tim Zheng",
            args: {
              query: "Tim Zheng",
              perPage: 10
            }
          }
        ],
        followups: [
          "Offer to create a contact if nothing relevant exists.",
          "Offer to list contact stages if they want to organize results."
        ]
      }),
      defineTool(integrationSlug, "list_contact_stages", {
        description: "List the contact stages available in Apollo",
        inputSchema: {
          type: "object",
          properties: {}
        },
        accessLevel: "read",
        tags: ["apollo", "contacts", "stages", "metadata"],
        whenToUse: [
          "You need Apollo contact stage IDs before assigning or filtering contacts by stage."
        ],
        examples: [
          {
            user: "what contact stages are available in apollo",
            args: {}
          }
        ],
        followups: [
          "Offer to search contacts in a chosen stage.",
          "Offer to create a contact using one of the returned stage ids."
        ]
      }),
      defineTool(integrationSlug, "create_contact", {
        description: "Create a contact in the team's Apollo account",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string", description: "Contact first name" },
            lastName: { type: "string", description: "Contact last name" },
            organizationName: { type: "string", description: "Employer name" },
            title: { type: "string", description: "Current job title" },
            accountId: {
              type: "string",
              description: "Apollo account id if you already have it"
            },
            email: { type: "string", description: "Work email address" },
            websiteUrl: { type: "string", description: "Corporate website URL" },
            linkedinUrl: { type: "string", description: "LinkedIn profile URL" },
            ownerId: { type: "string", description: "Apollo user ID to assign as owner" },
            listIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo list ids to attach"
            },
            contactStageId: { type: "string", description: "Apollo contact stage id" },
            presentRawAddress: {
              type: "string",
              description: "Location text for the contact"
            },
            phone: { type: "string", description: "Primary phone number" },
            directPhone: { type: "string", description: "Primary direct phone number" },
            workPhone: { type: "string", description: "Office phone number" },
            mobilePhone: { type: "string", description: "Mobile phone number" },
            homePhone: { type: "string", description: "Home phone number" },
            otherPhone: { type: "string", description: "Alternative phone number" },
            typedCustomFields: {
              type: "object",
              description: "Apollo custom-field payload keyed by custom field id"
            },
            runDedupe: {
              type: "boolean",
              description: "Whether Apollo should deduplicate instead of always creating a new row"
            },
            extra: {
              type: "object",
              description: "Additional Apollo body fields to merge into the create request"
            }
          }
        },
        accessLevel: "write",
        tags: ["contacts", "crm", "create", "apollo"],
        whenToUse: [
          "User explicitly asks to save a person as an Apollo contact.",
          "A previous Apollo search or enrichment step identified the person to add."
        ],
        askBefore: [
          "Check for an existing Apollo contact first when duplicates are likely.",
          "Confirm before creating the contact if the person selection is still ambiguous."
        ],
        safeDefaults: {
          runDedupe: true
        },
        examples: [
          {
            user: "create an Apollo contact for Mark Twain at Great American Writers",
            args: {
              firstName: "Mark",
              lastName: "Twain",
              organizationName: "Great American Writers Co.",
              email: "mark@greatamericanwriters.com",
              websiteUrl: "https://www.greatamericanwriters.com",
              runDedupe: true
            }
          }
        ],
        followups: [
          "Offer to search Apollo contacts afterward to verify the saved record."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": credentials.apiKey
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "search_people":
        return this.searchPeople(args, credentials);
      case "search_organizations":
        return this.searchOrganizations(args, credentials);
      case "enrich_person":
        return this.enrichPerson(args, credentials);
      case "enrich_organization":
        return this.enrichOrganization(args, credentials);
      case "search_contacts":
        return this.searchContacts(args, credentials);
      case "list_contact_stages":
        return this.listContactStages(credentials);
      case "create_contact":
        return this.createContact(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${APOLLO_BASE_URL}/contacts/search?page=1&per_page=1`,
        {
          method: "POST",
          body: JSON.stringify({})
        },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  buildApolloQuery(params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === void 0 || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.trim()) {
            searchParams.append(key, item.trim());
          }
        }
        continue;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) {
          searchParams.append(key, trimmed);
        }
        continue;
      }
      searchParams.append(key, String(value));
    }
    return searchParams.toString();
  }
  async searchPeople(args, credentials) {
    const query = this.buildApolloQuery({
      "person_titles[]": this.toStringArray(args.personTitles),
      include_similar_titles: this.toOptionalBoolean(args.includeSimilarTitles),
      q_keywords: this.toOptionalString(args.query),
      "person_locations[]": this.toStringArray(args.personLocations),
      "person_seniorities[]": this.toStringArray(args.personSeniorities),
      "organization_locations[]": this.toStringArray(args.organizationLocations),
      "q_organization_domains_list[]": this.toStringArray(args.organizationDomains),
      "contact_email_status[]": this.toStringArray(args.contactEmailStatus),
      "organization_ids[]": this.toStringArray(args.organizationIds),
      "organization_num_employees_ranges[]": this.toStringArray(args.organizationNumEmployeesRanges),
      ...this.recordQueryParams(args.filters),
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10)
    });
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/mixed_people/api_search?${query}`,
      {
        method: "POST",
        body: JSON.stringify({})
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo people", response);
    }
    return response.json();
  }
  async searchOrganizations(args, credentials) {
    const query = this.buildApolloQuery({
      q_organization_name: this.toOptionalString(args.query),
      "q_organization_domains_list[]": this.toStringArray(args.organizationDomains),
      "organization_locations[]": this.toStringArray(args.organizationLocations),
      "organization_not_locations[]": this.toStringArray(args.organizationNotLocations),
      "organization_ids[]": this.toStringArray(args.organizationIds),
      "organization_num_employees_ranges[]": this.toStringArray(args.organizationNumEmployeesRanges),
      "q_organization_keyword_tags[]": this.toStringArray(args.keywordTags),
      ...this.recordQueryParams(args.filters),
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10)
    });
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/mixed_companies/search?${query}`,
      {
        method: "POST",
        body: JSON.stringify({})
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo organizations", response);
    }
    return response.json();
  }
  async enrichPerson(args, credentials) {
    const query = this.buildApolloQuery({
      first_name: this.toOptionalString(args.firstName),
      last_name: this.toOptionalString(args.lastName),
      name: this.toOptionalString(args.name),
      email: this.toOptionalString(args.email),
      organization_name: this.toOptionalString(args.organizationName),
      domain: this.toOptionalString(args.domain),
      id: this.toOptionalString(args.id),
      linkedin_url: this.toOptionalString(args.linkedinUrl),
      reveal_personal_emails: this.toOptionalBoolean(args.revealPersonalEmails) ?? false
    });
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/people/match?${query}`,
      { method: "POST" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to enrich Apollo person", response);
    }
    return response.json();
  }
  async enrichOrganization(args, credentials) {
    const domain = this.toOptionalString(args.domain);
    if (!domain) {
      throw new Error("domain is required");
    }
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/organizations/enrich?${this.buildApolloQuery({ domain })}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to enrich Apollo organization", response);
    }
    return response.json();
  }
  async searchContacts(args, credentials) {
    const body = {
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10)
    };
    if (this.toOptionalString(args.query)) {
      body.q_keywords = this.toOptionalString(args.query);
    }
    if (this.toStringArray(args.contactStageIds).length > 0) {
      body.contact_stage_ids = this.toStringArray(args.contactStageIds);
    }
    if (this.toStringArray(args.contactLabelIds).length > 0) {
      body.contact_label_ids = this.toStringArray(args.contactLabelIds);
    }
    if (this.toStringArray(args.emailStatuses).length > 0) {
      body.contact_email_status = this.toStringArray(args.emailStatuses);
    }
    if (this.toOptionalString(args.sortByField)) {
      body.sort_by_field = this.toOptionalString(args.sortByField);
    }
    if (this.toOptionalBoolean(args.sortAscending) !== void 0) {
      body.sort_ascending = this.toOptionalBoolean(args.sortAscending);
    }
    if (this.isRecord(args.filters)) {
      for (const [key, value] of Object.entries(args.filters)) {
        body[key] = value;
      }
    }
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contacts/search`,
      {
        method: "POST",
        body: JSON.stringify(body)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo contacts", response);
    }
    return response.json();
  }
  async listContactStages(credentials) {
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contact_stages`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Apollo contact stages", response);
    }
    return response.json();
  }
  async createContact(args, credentials) {
    const hasIdentity = this.toOptionalString(args.email) || this.toOptionalString(args.firstName) || this.toOptionalString(args.lastName) || this.toOptionalString(args.organizationName);
    if (!hasIdentity) {
      throw new Error(
        "Provide at least one identifying field such as email, firstName, lastName, or organizationName."
      );
    }
    const query = this.buildApolloQuery({
      first_name: this.toOptionalString(args.firstName),
      last_name: this.toOptionalString(args.lastName),
      organization_name: this.toOptionalString(args.organizationName),
      title: this.toOptionalString(args.title),
      account_id: this.toOptionalString(args.accountId),
      email: this.toOptionalString(args.email),
      website_url: this.toOptionalString(args.websiteUrl),
      linkedin_url: this.toOptionalString(args.linkedinUrl),
      owner_id: this.toOptionalString(args.ownerId),
      list_ids: this.toStringArray(args.listIds),
      contact_stage_id: this.toOptionalString(args.contactStageId),
      present_raw_address: this.toOptionalString(args.presentRawAddress),
      phone_number: this.toOptionalString(args.phone),
      direct_phone: this.toOptionalString(args.directPhone),
      work_phone: this.toOptionalString(args.workPhone),
      mobile_phone: this.toOptionalString(args.mobilePhone),
      home_phone: this.toOptionalString(args.homePhone),
      other_phone: this.toOptionalString(args.otherPhone),
      run_dedupe: this.toOptionalBoolean(args.runDedupe) ?? true
    });
    const body = {};
    if (this.isRecord(args.typedCustomFields)) {
      body.typed_custom_fields = args.typedCustomFields;
    }
    if (this.isRecord(args.extra)) {
      for (const [key, value] of Object.entries(args.extra)) {
        body[key] = value;
      }
    }
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contacts?${query}`,
      {
        method: "POST",
        ...Object.keys(body).length > 0 ? { body: JSON.stringify(body) } : {}
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Apollo contact", response);
    }
    return response.json();
  }
  recordQueryParams(value) {
    if (!this.isRecord(value)) {
      return {};
    }
    const entries = [];
    for (const [key, rawValue] of Object.entries(value)) {
      if (rawValue === null || rawValue === void 0 || typeof rawValue === "string" || typeof rawValue === "number" || typeof rawValue === "boolean") {
        entries.push([key, rawValue]);
        continue;
      }
      if (Array.isArray(rawValue)) {
        const values = rawValue.filter(
          (item) => typeof item === "string" && item.trim().length > 0
        );
        entries.push([key, values]);
      }
    }
    return Object.fromEntries(entries);
  }
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  toOptionalString(value) {
    if (typeof value !== "string") {
      return void 0;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : void 0;
  }
  toStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter((item) => item.length > 0);
  }
  toOptionalBoolean(value) {
    return typeof value === "boolean" ? value : void 0;
  }
  toPositiveInteger(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return void 0;
    }
    const rounded = Math.trunc(value);
    return rounded > 0 ? rounded : void 0;
  }
  clampPerPage(value, fallback) {
    const parsed = this.toPositiveInteger(value);
    if (!parsed) {
      return fallback;
    }
    return Math.min(parsed, 100);
  }
  async createApiError(prefix, response) {
    const payload = await response.json().catch(() => null);
    const nestedErrors = Array.isArray(payload?.errors) ? payload.errors.map((entry) => entry && typeof entry === "object" && "message" in entry ? String(entry.message) : "").filter(Boolean).join("; ") : payload?.errors && typeof payload.errors === "object" ? JSON.stringify(payload.errors) : void 0;
    const message = payload?.message ?? (typeof payload?.error === "string" ? payload.error : payload?.error?.message) ?? nestedErrors ?? response.statusText;
    if (response.status === 403) {
      return new Error(`${prefix}: ${message}. Apollo may require a master API key for this endpoint.`);
    }
    return new Error(`${prefix}: ${message}`);
  }
};
registerHandler("apollo", new ApolloHandler());

// integrations/postiz.ts
var POSTIZ_BASE_URL = "https://api.postiz.com/public/v1";
var PostizHandler = class extends BaseIntegration {
  static {
    __name(this, "PostizHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "list_integrations", {
        description: "List connected Postiz channels/integrations available to the authenticated account",
        inputSchema: {
          type: "object",
          properties: {}
        },
        accessLevel: "read",
        tags: ["postiz", "social", "channels", "integrations"],
        whenToUse: [
          "User wants to know which Postiz channels/accounts are connected.",
          "You need an integration id before scheduling a post."
        ],
        followups: [
          "Offer to schedule a post for a chosen integration.",
          "Offer to list recent posts after identifying the right channel."
        ]
      }),
      defineTool(integrationSlug, "schedule_post", {
        description: "Publish now or schedule a Postiz post using a simpler agent-friendly input shape",
        inputSchema: {
          type: "object",
          properties: {
            integrationId: {
              type: "string",
              description: "Postiz integration/channel id to publish to"
            },
            content: {
              type: "string",
              description: "Main post content"
            },
            platformType: {
              type: "string",
              description: "Target platform type for Postiz settings.__type, for example linkedin, twitter, instagram, facebook, tiktok, youtube, or threads"
            },
            publishAt: {
              type: "string",
              description: "UTC ISO date-time. If omitted, the post is published immediately."
            },
            shortLink: {
              type: "boolean",
              description: "Whether Postiz should shorten links"
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Optional tags to attach to the post"
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
                      path: { type: "string" }
                    }
                  }
                ]
              }
            },
            settings: {
              type: "object",
              description: "Optional provider-specific Postiz settings object. If platformType is provided, it will be merged into settings.__type."
            }
          },
          required: ["integrationId", "content"]
        },
        accessLevel: "write",
        tags: ["postiz", "social", "publish", "schedule"],
        whenToUse: [
          "User wants to publish or schedule a social post via Postiz."
        ],
        askBefore: [
          "Ask which connected channel should receive the post if integrationId is missing.",
          "Ask which platform type to use if it cannot be inferred from the selected Postiz integration and settings.__type is missing."
        ],
        safeDefaults: {
          shortLink: false,
          tags: [],
          media: []
        },
        examples: [
          {
            user: "post this to my LinkedIn via Postiz right now",
            args: {
              integrationId: "your-linkedin-id",
              content: "Excited to ship this today.",
              platformType: "linkedin"
            }
          },
          {
            user: "schedule this Postiz post for tomorrow morning",
            args: {
              integrationId: "your-linkedin-id",
              content: "Launching tomorrow.",
              platformType: "linkedin",
              publishAt: "2026-04-18T09:00:00.000Z"
            }
          }
        ],
        followups: [
          "Offer to list recent posts so the user can verify it was created."
        ]
      }),
      defineTool(integrationSlug, "list_posts", {
        description: "List Postiz posts within a date range",
        inputSchema: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description: "UTC ISO start date-time"
            },
            endDate: {
              type: "string",
              description: "UTC ISO end date-time"
            },
            customer: {
              type: "string",
              description: "Optional Postiz customer ID filter"
            }
          },
          required: ["startDate", "endDate"]
        },
        accessLevel: "read",
        tags: ["postiz", "social", "posts", "history"],
        whenToUse: [
          "User wants to inspect recent or scheduled posts in Postiz."
        ],
        examples: [
          {
            user: "show my Postiz posts from this week",
            args: {
              startDate: "2026-04-13T00:00:00.000Z",
              endDate: "2026-04-20T00:00:00.000Z"
            }
          }
        ],
        followups: [
          "Offer to delete a selected post if the user wants to remove it."
        ]
      }),
      defineTool(integrationSlug, "delete_post", {
        description: "Delete a Postiz post by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Postiz post ID to delete"
            }
          },
          required: ["id"]
        },
        accessLevel: "destructive",
        tags: ["postiz", "social", "delete", "posts"],
        whenToUse: [
          "User explicitly asks to delete a Postiz post."
        ],
        askBefore: [
          "Confirm the exact post if there is any ambiguity, because deleting one post removes the full grouped post set."
        ],
        examples: [
          {
            user: "delete that scheduled Postiz post",
            args: {
              id: "post-id"
            }
          }
        ]
      }),
      defineTool(integrationSlug, "upload_media", {
        description: "Upload media to Postiz from a public URL",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Public URL of the image or media file"
            }
          },
          required: ["url"]
        },
        accessLevel: "write",
        tags: ["postiz", "social", "media", "upload"],
        whenToUse: [
          "User needs a Postiz media object before creating a post with images."
        ],
        examples: [
          {
            user: "upload this image to Postiz",
            args: {
              url: "https://example.com/image.png"
            }
          }
        ],
        followups: [
          "Offer to schedule a post using the uploaded media result."
        ]
      }),
      defineTool(integrationSlug, "get_requirements", {
        description: "Return the expected Postiz posting requirements, required identifiers, and platform settings hints before scheduling a post",
        inputSchema: {
          type: "object",
          properties: {
            platformType: {
              type: "string",
              description: "Optional platform type hint such as linkedin, twitter, instagram, facebook, tiktok, youtube, or threads"
            }
          }
        },
        accessLevel: "read",
        tags: ["postiz", "social", "requirements", "schema"],
        whenToUse: [
          "You need to know which fields are required before calling schedule_post.",
          "You need a reminder about integrationId, platformType, media expectations, or scheduling format."
        ],
        followups: [
          "Offer to list integrations next if the user still needs a channel id."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token;
    return {
      Authorization: String(token ?? ""),
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
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
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(`${POSTIZ_BASE_URL}/integrations`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }
  async listIntegrations(credentials) {
    const response = await this.apiRequest(`${POSTIZ_BASE_URL}/integrations`, { method: "GET" }, credentials);
    if (!response.ok) {
      throw await this.createApiError("Failed to list Postiz integrations", response);
    }
    return response.json();
  }
  async schedulePost(args, credentials) {
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
      date: publishAt || (/* @__PURE__ */ new Date()).toISOString(),
      shortLink: Boolean(args.shortLink ?? false),
      tags: Array.isArray(args.tags) ? args.tags.map((value) => String(value)) : [],
      posts: [
        {
          integration: { id: integrationId },
          value: [
            {
              content,
              image: this.normalizeImages(args.media)
            }
          ],
          settings
        }
      ]
    };
    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to schedule Postiz post", response);
    }
    return response.json();
  }
  async listPosts(args, credentials) {
    const params = new URLSearchParams({
      startDate: String(args.startDate ?? ""),
      endDate: String(args.endDate ?? "")
    });
    if (typeof args.customer === "string" && args.customer.trim()) {
      params.set("customer", args.customer);
    }
    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts?${params.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Postiz posts", response);
    }
    return response.json();
  }
  async deletePost(args, credentials) {
    const id = String(args.id ?? "").trim();
    const response = await this.apiRequest(
      `${POSTIZ_BASE_URL}/posts/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Postiz post", response);
    }
    return response.json();
  }
  async uploadMedia(args, credentials) {
    const response = await fetch(`${POSTIZ_BASE_URL}/upload-from-url`, {
      method: "POST",
      headers: this.getHeaders(credentials),
      body: JSON.stringify({
        url: String(args.url ?? "")
      })
    });
    if (!response.ok) {
      throw await this.createApiError("Failed to upload media to Postiz", response);
    }
    return response.json();
  }
  normalizeImages(images) {
    if (!Array.isArray(images)) {
      return [];
    }
    return images.map((entry) => {
      if (typeof entry === "string") {
        const path = entry.trim();
        return path ? { path } : null;
      }
      if (entry && typeof entry === "object") {
        const id = typeof entry.id === "string" ? entry.id.trim() : void 0;
        const path = typeof entry.path === "string" ? entry.path.trim() : "";
        if (!path) {
          return null;
        }
        return id ? { id, path } : { path };
      }
      return null;
    }).filter((value) => Boolean(value));
  }
  mergeSettings(settings, platformType) {
    const baseSettings = this.optionalObject(settings, "settings");
    if (platformType) {
      return {
        ...baseSettings,
        __type: platformType
      };
    }
    return baseSettings;
  }
  optionalObject(value, fieldName) {
    if (value === void 0 || value === null) {
      return {};
    }
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${fieldName} must be an object`);
    }
    return value;
  }
  getRequirements(args) {
    const platformType = typeof args.platformType === "string" ? args.platformType.trim() : "";
    return {
      integration: "postiz",
      recommendedTools: [
        "postiz_list_integrations",
        "postiz_schedule_post",
        "postiz_list_posts",
        "postiz_delete_post",
        "postiz_upload_media"
      ],
      requiredFields: ["integrationId", "content"],
      conditionalFields: [
        {
          field: "platformType",
          requiredWhen: "settings.__type is not already provided",
          description: "Sets Postiz settings.__type for the target social platform."
        },
        {
          field: "publishAt",
          requiredWhen: "the post should be scheduled for later instead of publishing immediately",
          description: "Must be a UTC ISO date-time string."
        },
        {
          field: "media",
          requiredWhen: "the target post should include media",
          description: "Provide uploaded Postiz media objects or public URLs. Use postiz_upload_media first when needed."
        }
      ],
      settings: {
        mustBeObject: true,
        requiredKey: "__type unless platformType is supplied",
        platformTypeHint: platformType || null,
        commonPlatformTypes: ["linkedin", "twitter", "instagram", "facebook", "tiktok", "youtube", "threads"]
      },
      notes: [
        "Use postiz_list_integrations to discover the correct integrationId before scheduling.",
        "If both platformType and settings.__type are supplied, platformType wins.",
        "publishAt omitted means publish now."
      ]
    };
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const nestedMessage = typeof body?.error === "object" ? body.error?.message : void 0;
    const inlineError = typeof body?.error === "string" ? body.error : void 0;
    const message = nestedMessage ?? body?.message ?? inlineError ?? response.statusText;
    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status
    });
  }
};
registerHandler("postiz", new PostizHandler());

// integrations/google-analytics.ts
var ANALYTICS_DATA_BASE_URL = "https://analyticsdata.googleapis.com";
var ANALYTICS_ADMIN_BASE_URL = "https://analyticsadmin.googleapis.com";
function isRecordObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject, "isRecordObject");
function safeTrim(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim, "safeTrim");
function normalizePropertyId(value) {
  const raw = safeTrim(value);
  if (!raw) {
    throw new Error("propertyId is required");
  }
  if (raw.startsWith("properties/")) {
    return raw;
  }
  return `properties/${raw}`;
}
__name(normalizePropertyId, "normalizePropertyId");
function requiredResourceName(value, fieldName, expectedSegment) {
  const name = safeTrim(value);
  if (!name) {
    throw new Error(`${fieldName} is required`);
  }
  if (expectedSegment && !name.includes(`/${expectedSegment}/`)) {
    throw new Error(`${fieldName} must be a ${expectedSegment} resource name`);
  }
  return name;
}
__name(requiredResourceName, "requiredResourceName");
function optionalObject(value, fieldName) {
  if (value === void 0 || value === null) {
    return {};
  }
  if (!isRecordObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return { ...value };
}
__name(optionalObject, "optionalObject");
function normalizeNamedResourceList(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    const name = safeTrim(entry);
    if (name) {
      return { name };
    }
    if (!isRecordObject(entry)) {
      throw new Error(`${fieldName}[${index}] must be a string or object`);
    }
    return { ...entry };
  });
}
__name(normalizeNamedResourceList, "normalizeNamedResourceList");
function normalizeObjectList(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    if (!isRecordObject(entry)) {
      throw new Error(`${fieldName}[${index}] must be an object`);
    }
    return { ...entry };
  });
}
__name(normalizeObjectList, "normalizeObjectList");
function normalizeStringList(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    const normalized = safeTrim(entry);
    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }
    return normalized;
  });
}
__name(normalizeStringList, "normalizeStringList");
function setIfProvided(payload, key, value) {
  if (value !== void 0) {
    payload[key] = value;
  }
}
__name(setIfProvided, "setIfProvided");
function toPositiveIntString(value, fieldName, options = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  const integer = Math.trunc(parsed);
  if (options.min !== void 0 && integer < options.min) {
    throw new Error(`${fieldName} must be at least ${options.min}`);
  }
  if (options.max !== void 0 && integer > options.max) {
    throw new Error(`${fieldName} must be at most ${options.max}`);
  }
  return String(integer);
}
__name(toPositiveIntString, "toPositiveIntString");
function getAccessToken2(credentials) {
  const token = safeTrim(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Analytics credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken2, "getAccessToken");
var GoogleAnalyticsHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleAnalyticsHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "run_report", {
        description: "Run a customized GA4 core report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name, for example 123456789 or properties/123456789"
            },
            metrics: {
              type: "array",
              description: "Metrics to request. You can pass metric names like activeUsers or objects like { name: 'activeUsers' }.",
              items: {}
            },
            dimensions: {
              type: "array",
              description: "Dimensions to request. You can pass dimension names like country or objects like { name: 'country' }.",
              items: {}
            },
            dateRanges: {
              type: "array",
              description: "Date ranges such as [{ startDate: '7daysAgo', endDate: 'yesterday' }]",
              items: {}
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression applied before aggregation" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            metricAggregations: { type: "array", items: {}, description: "Metric aggregation enum values" },
            comparisons: { type: "array", items: {}, description: "GA comparison objects" },
            cohortSpec: { type: "object", description: "GA cohort spec" },
            currencyCode: { type: "string", description: "ISO currency code such as USD" },
            keepEmptyRows: { type: "boolean", description: "Keep rows where all metrics are zero" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            offset: { type: "number", description: "Row offset for pagination" },
            request: { type: "object", description: "Optional raw GA runReport request body to merge with the top-level arguments" }
          },
          required: ["propertyId", "metrics"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "reporting", "google-analytics"],
        whenToUse: [
          "User wants a standard GA4 report for one property.",
          "You need event, session, or user metrics by one or more dimensions over one or more date ranges."
        ],
        askBefore: [
          "Ask which GA4 property to use if the property id is not already known.",
          "If a report fails due to incompatible dimensions and metrics, run google-analytics_check_compatibility first."
        ],
        safeDefaults: {
          dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
          limit: 100
        },
        examples: [
          {
            user: "show active users and sessions by country for the last 7 days",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["country"],
              metrics: ["activeUsers", "sessions"],
              dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
              limit: 100
            }
          }
        ],
        followups: [
          "Offer to check compatibility if the user wants a more complex dimension and metric combination.",
          "Offer a realtime or pivot report when the user wants a live view or pivot-table layout."
        ]
      }),
      defineTool(integrationSlug, "provision_account_ticket", {
        description: "Request a Google Analytics account provisioning ticket that redirects the user to Terms of Service acceptance",
        inputSchema: {
          type: "object",
          properties: {
            account: {
              type: "object",
              description: "Account object to provision, for example { displayName: 'Example Account', regionCode: 'US' }"
            },
            redirectUri: {
              type: "string",
              description: "Redirect URI that Google should send the user back to after Terms acceptance"
            }
          },
          required: ["account", "redirectUri"]
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "account", "provisioning", "google-analytics"],
        whenToUse: [
          "You need to start the Google Analytics account creation flow that requires Terms of Service acceptance."
        ],
        askBefore: [
          "Confirm the desired account display name, region, and redirect URI before requesting the ticket."
        ]
      }),
      defineTool(integrationSlug, "run_realtime_report", {
        description: "Run a customized GA4 realtime report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            metrics: {
              type: "array",
              description: "Realtime metrics to request",
              items: {}
            },
            dimensions: {
              type: "array",
              description: "Realtime dimensions to request",
              items: {}
            },
            minuteRanges: {
              type: "array",
              description: "Minute ranges such as [{ startMinutesAgo: 29, endMinutesAgo: 0 }]",
              items: {}
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            comparisons: { type: "array", items: {}, description: "GA comparison objects" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            offset: { type: "number", description: "Row offset for pagination" },
            request: { type: "object", description: "Optional raw GA runRealtimeReport request body to merge with top-level arguments" }
          },
          required: ["propertyId", "metrics"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "realtime", "google-analytics"],
        whenToUse: [
          "User wants a live view of recent GA4 activity.",
          "You need a last-30-minutes or last-60-minutes view of traffic or events."
        ],
        askBefore: [
          "Ask which property to query if the property id is not already known."
        ],
        safeDefaults: {
          minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }],
          limit: 100
        },
        examples: [
          {
            user: "show realtime users by country",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["country"],
              metrics: ["activeUsers"],
              minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }],
              limit: 100
            }
          }
        ],
        followups: [
          "Offer a standard report if the user wants historical rather than realtime data."
        ]
      }),
      defineTool(integrationSlug, "create_audience_export", {
        description: "Create a GA4 audience export for later retrieval",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            audienceExport: {
              type: "object",
              description: "Audience export definition, for example { audience: 'properties/123/audiences/456', dimensions: [{ name: 'deviceId' }] }"
            }
          },
          required: ["propertyId", "audienceExport"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "google-analytics"],
        whenToUse: [
          "You need to start an asynchronous audience export before querying the exported user rows."
        ],
        followups: [
          "Use google-analytics_get_audience_export to check readiness, then google-analytics_query_audience_export to retrieve rows."
        ]
      }),
      defineTool(integrationSlug, "get_audience_export", {
        description: "Get metadata and readiness state for a GA4 audience export",
        inputSchema: {
          type: "object",
          properties: {
            audienceExportName: {
              type: "string",
              description: "Full audience export resource name, for example properties/123/audienceExports/456"
            }
          },
          required: ["audienceExportName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "status", "google-analytics"]
      }),
      defineTool(integrationSlug, "query_audience_export", {
        description: "Query a completed GA4 audience export with pagination",
        inputSchema: {
          type: "object",
          properties: {
            audienceExportName: {
              type: "string",
              description: "Full audience export resource name"
            },
            offset: {
              type: "number",
              description: "Row offset for pagination"
            },
            limit: {
              type: "number",
              description: "Maximum rows to return"
            }
          },
          required: ["audienceExportName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "export", "query", "google-analytics"],
        whenToUse: [
          "You need user rows from a completed audience export."
        ],
        askBefore: [
          "If the export may still be processing, check it with google-analytics_get_audience_export first."
        ]
      }),
      defineTool(integrationSlug, "check_compatibility", {
        description: "Check whether GA4 dimensions and metrics are compatible for a core report request",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            metrics: {
              type: "array",
              description: "Metrics you want to validate",
              items: {}
            },
            dimensions: {
              type: "array",
              description: "Dimensions you want to validate",
              items: {}
            },
            dateRanges: {
              type: "array",
              description: "Optional date ranges for compatibility context",
              items: {}
            },
            dimensionFilter: { type: "object", description: "Optional FilterExpression" },
            metricFilter: { type: "object", description: "Optional post-aggregation FilterExpression" },
            compatibilityFilter: {
              type: "string",
              description: "Optional compatibility filter enum such as COMPATIBLE or INCOMPATIBLE"
            },
            request: { type: "object", description: "Optional raw GA checkCompatibility request body to merge with top-level arguments" }
          },
          required: ["propertyId"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "compatibility", "google-analytics"],
        whenToUse: [
          "A planned GA4 report may fail because dimensions and metrics might be incompatible.",
          "You want to validate a report shape before calling run_report."
        ],
        followups: [
          "Use the response to simplify the report request and rerun google-analytics_run_report."
        ]
      }),
      defineTool(integrationSlug, "create_audience_list", {
        description: "Create a GA4 audience list for later retrieval",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            audienceList: {
              type: "object",
              description: "Audience list definition, for example { audience: 'properties/123/audiences/456', dimensions: [{ name: 'deviceId' }] }"
            }
          },
          required: ["propertyId", "audienceList"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "google-analytics"],
        whenToUse: [
          "You need to start an asynchronous audience list before querying its user rows."
        ],
        followups: [
          "Use google-analytics_get_audience_list to check readiness, then google-analytics_query_audience_list to retrieve rows."
        ]
      }),
      defineTool(integrationSlug, "get_audience_list", {
        description: "Get metadata and readiness state for a GA4 audience list",
        inputSchema: {
          type: "object",
          properties: {
            audienceListName: {
              type: "string",
              description: "Full audience list resource name, for example properties/123/audienceLists/456"
            }
          },
          required: ["audienceListName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "status", "google-analytics"]
      }),
      defineTool(integrationSlug, "query_audience_list", {
        description: "Query a completed GA4 audience list with pagination",
        inputSchema: {
          type: "object",
          properties: {
            audienceListName: {
              type: "string",
              description: "Full audience list resource name"
            },
            offset: {
              type: "number",
              description: "Row offset for pagination"
            },
            limit: {
              type: "number",
              description: "Maximum rows to return"
            }
          },
          required: ["audienceListName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "audience", "list", "query", "google-analytics"],
        whenToUse: [
          "You need user rows from a completed audience list."
        ],
        askBefore: [
          "If the audience list may still be processing, check it with google-analytics_get_audience_list first."
        ]
      }),
      defineTool(integrationSlug, "run_pivot_report", {
        description: "Run a customized GA4 pivot report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            metrics: {
              type: "array",
              description: "Metrics to request",
              items: {}
            },
            dimensions: {
              type: "array",
              description: "Dimensions to request",
              items: {}
            },
            pivots: {
              type: "array",
              description: "GA pivot definitions. Dimensions are only visible if referenced by a pivot.",
              items: {}
            },
            dateRanges: {
              type: "array",
              description: "Date ranges such as [{ startDate: '28daysAgo', endDate: 'yesterday' }]",
              items: {}
            },
            dimensionFilter: { type: "object", description: "GA FilterExpression" },
            metricFilter: { type: "object", description: "GA FilterExpression applied after aggregation" },
            orderBys: { type: "array", items: {}, description: "GA order by objects" },
            currencyCode: { type: "string", description: "ISO currency code such as USD" },
            keepEmptyRows: { type: "boolean", description: "Keep rows where all metrics are zero" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            request: { type: "object", description: "Optional raw GA runPivotReport request body to merge with top-level arguments" }
          },
          required: ["propertyId", "metrics", "pivots"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "pivot", "google-analytics"],
        whenToUse: [
          "User wants a pivot-table style GA4 report.",
          "You need multi-dimensional analysis where the visible dimensions are defined by pivots."
        ],
        askBefore: [
          "Ask which pivot layout the user wants if rows and columns are not clear yet."
        ],
        examples: [
          {
            user: "show sessions by device category and country as a pivot",
            args: {
              propertyId: "properties/123456789",
              dimensions: ["deviceCategory", "country"],
              metrics: ["sessions"],
              pivots: [
                {
                  fieldNames: ["deviceCategory"],
                  limit: "10"
                },
                {
                  fieldNames: ["country"],
                  limit: "25"
                }
              ],
              dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }]
            }
          }
        ],
        followups: [
          "Offer a simpler run_report if the user no longer needs a pivot layout."
        ]
      }),
      defineTool(integrationSlug, "create_report_task", {
        description: "Create an asynchronous GA4 report task for later querying",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            reportTask: {
              type: "object",
              description: "Report task definition"
            }
          },
          required: ["propertyId", "reportTask"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "async", "google-analytics"],
        whenToUse: [
          "You need an asynchronous report task instead of an immediate run_report response."
        ],
        followups: [
          "Use google-analytics_get_report_task to inspect status, then google-analytics_query_report_task when it reaches ACTIVE."
        ]
      }),
      defineTool(integrationSlug, "get_report_task", {
        description: "Get metadata and processing state for a GA4 report task",
        inputSchema: {
          type: "object",
          properties: {
            reportTaskName: {
              type: "string",
              description: "Full report task resource name, for example properties/123/reportTasks/456"
            }
          },
          required: ["reportTaskName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "status", "google-analytics"]
      }),
      defineTool(integrationSlug, "query_report_task", {
        description: "Query a completed GA4 report task with pagination",
        inputSchema: {
          type: "object",
          properties: {
            reportTaskName: {
              type: "string",
              description: "Full report task resource name"
            },
            offset: {
              type: "number",
              description: "Row offset for pagination"
            },
            limit: {
              type: "number",
              description: "Maximum rows to return"
            }
          },
          required: ["reportTaskName"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "report-task", "query", "google-analytics"],
        whenToUse: [
          "You need the rows and columns of an ACTIVE report task."
        ],
        askBefore: [
          "If the report task may still be processing, check it with google-analytics_get_report_task first."
        ]
      }),
      defineTool(integrationSlug, "run_funnel_report", {
        description: "Run a customized GA4 funnel report for a property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            funnel: {
              type: "object",
              description: "Required GA funnel definition"
            },
            dateRanges: {
              type: "array",
              description: "Optional date ranges for the funnel report",
              items: {}
            },
            funnelBreakdown: { type: "object", description: "Optional funnel breakdown config" },
            funnelNextAction: { type: "object", description: "Optional next action config" },
            funnelVisualizationType: { type: "string", description: "Optional funnel visualization enum" },
            segments: { type: "array", items: {}, description: "Optional GA segments" },
            dimensionFilter: { type: "object", description: "Optional GA FilterExpression" },
            returnPropertyQuota: { type: "boolean", description: "Return quota usage details" },
            limit: { type: "number", description: "Maximum rows to return" },
            request: { type: "object", description: "Optional raw GA runFunnelReport request body to merge with top-level arguments" }
          },
          required: ["propertyId", "funnel"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "funnel", "google-analytics"],
        whenToUse: [
          "User wants funnel analysis for a GA4 property.",
          "You need step-by-step conversion data instead of a flat report."
        ],
        askBefore: [
          "Ask for the funnel steps or stage definitions if they are not already known."
        ],
        followups: [
          "Offer a standard or pivot report if the user wants supporting metrics outside the funnel."
        ]
      }),
      defineTool(integrationSlug, "update_property", {
        description: "Update an existing GA4 property",
        inputSchema: {
          type: "object",
          properties: {
            propertyId: {
              type: "string",
              description: "GA4 property id or resource name"
            },
            updateMask: {
              type: "string",
              description: "Required FieldMask in snake_case, for example display_name,time_zone,currency_code"
            },
            property: {
              type: "object",
              description: "Property fields to update, for example { displayName: 'New Name', timeZone: 'America/New_York' }"
            }
          },
          required: ["propertyId", "updateMask", "property"]
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "property", "admin", "google-analytics"],
        whenToUse: [
          "User explicitly asks to update a GA4 property setting."
        ],
        askBefore: [
          "Confirm the exact property id and the fields to change before updating settings."
        ],
        followups: [
          "Offer to rerun a report after the property change if the user needs to verify the new configuration context."
        ]
      }),
      defineTool(integrationSlug, "validate_events", {
        description: "Validate GA4 Measurement Protocol events before sending them to production",
        inputSchema: {
          type: "object",
          properties: {
            apiSecret: {
              type: "string",
              description: "Measurement Protocol API secret for the target data stream"
            },
            measurementId: {
              type: "string",
              description: "Web stream measurement id such as G-XXXXXXXXXX"
            },
            firebaseAppId: {
              type: "string",
              description: "App stream Firebase app id if validating app events instead of web events"
            },
            events: {
              type: "array",
              description: "Measurement Protocol events to validate",
              items: {}
            },
            clientId: {
              type: "string",
              description: "Client identifier for web streams"
            },
            appInstanceId: {
              type: "string",
              description: "App instance identifier for app streams"
            },
            userId: {
              type: "string",
              description: "Optional user id"
            },
            timestampMicros: {
              type: "string",
              description: "Optional event timestamp in microseconds"
            },
            validationBehavior: {
              type: "string",
              description: "Optional validation behavior such as ENFORCE_RECOMMENDATIONS"
            },
            payload: {
              type: "object",
              description: "Optional raw Measurement Protocol request body to merge with the top-level arguments"
            }
          },
          required: ["apiSecret", "events"]
        },
        accessLevel: "read",
        tags: ["analytics", "ga4", "measurement-protocol", "validation", "google-analytics"],
        whenToUse: [
          "You want to verify the structure of Measurement Protocol events before sending them to production."
        ],
        askBefore: [
          "Ask for the target stream secret and the right stream identifier if they are not already known."
        ],
        safeDefaults: {
          validationBehavior: "ENFORCE_RECOMMENDATIONS"
        },
        followups: [
          "Use google-analytics_send_events after the validation response looks clean."
        ]
      }),
      defineTool(integrationSlug, "send_events", {
        description: "Send GA4 Measurement Protocol events to Google Analytics",
        inputSchema: {
          type: "object",
          properties: {
            apiSecret: {
              type: "string",
              description: "Measurement Protocol API secret for the target data stream"
            },
            measurementId: {
              type: "string",
              description: "Web stream measurement id such as G-XXXXXXXXXX"
            },
            firebaseAppId: {
              type: "string",
              description: "App stream Firebase app id if sending app events instead of web events"
            },
            events: {
              type: "array",
              description: "Measurement Protocol events to send",
              items: {}
            },
            clientId: {
              type: "string",
              description: "Client identifier for web streams"
            },
            appInstanceId: {
              type: "string",
              description: "App instance identifier for app streams"
            },
            userId: {
              type: "string",
              description: "Optional user id"
            },
            timestampMicros: {
              type: "string",
              description: "Optional event timestamp in microseconds"
            },
            payload: {
              type: "object",
              description: "Optional raw Measurement Protocol request body to merge with the top-level arguments"
            }
          },
          required: ["apiSecret", "events"]
        },
        accessLevel: "write",
        tags: ["analytics", "ga4", "measurement-protocol", "events", "google-analytics"],
        whenToUse: [
          "You need to send server-side events to GA4."
        ],
        askBefore: [
          "Validate the payload first unless the event contract is already well tested.",
          "Ask for the correct stream secret and identifier if they are not already known."
        ],
        followups: [
          "Offer to validate a changed payload first if the sent event does not behave as expected."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken2(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "run_report":
        return this.runReport(args, credentials);
      case "provision_account_ticket":
        return this.provisionAccountTicket(args, credentials);
      case "run_realtime_report":
        return this.runRealtimeReport(args, credentials);
      case "create_audience_export":
        return this.createAudienceExport(args, credentials);
      case "get_audience_export":
        return this.getAudienceExport(args, credentials);
      case "query_audience_export":
        return this.queryAudienceExport(args, credentials);
      case "check_compatibility":
        return this.checkCompatibility(args, credentials);
      case "create_audience_list":
        return this.createAudienceList(args, credentials);
      case "get_audience_list":
        return this.getAudienceList(args, credentials);
      case "query_audience_list":
        return this.queryAudienceList(args, credentials);
      case "run_pivot_report":
        return this.runPivotReport(args, credentials);
      case "create_report_task":
        return this.createReportTask(args, credentials);
      case "get_report_task":
        return this.getReportTask(args, credentials);
      case "query_report_task":
        return this.queryReportTask(args, credentials);
      case "run_funnel_report":
        return this.runFunnelReport(args, credentials);
      case "update_property":
        return this.updateProperty(args, credentials);
      case "validate_events":
        return this.validateEvents(args);
      case "send_events":
        return this.sendEvents(args);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${ANALYTICS_ADMIN_BASE_URL}/v1beta/accountSummaries?pageSize=1`,
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async runReport(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildCoreReportPayload(args, {
      defaultDateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      defaultLimit: "100"
    });
    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runReport`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics report", response);
    }
    return response.json();
  }
  async provisionAccountTicket(args, credentials) {
    const account = optionalObject(args.account, "account");
    const redirectUri = safeTrim(args.redirectUri);
    if (!redirectUri) {
      throw new Error("redirectUri is required");
    }
    const response = await this.apiRequest(
      `${ANALYTICS_ADMIN_BASE_URL}/v1beta/accounts:provisionAccountTicket`,
      {
        method: "POST",
        body: JSON.stringify({
          account,
          redirectUri
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to provision Google Analytics account ticket",
        response
      );
    }
    return response.json();
  }
  async runRealtimeReport(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildRealtimeReportPayload(args);
    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runRealtimeReport`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics realtime report", response);
    }
    return response.json();
  }
  async createAudienceExport(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const audienceExport = optionalObject(args.audienceExport, "audienceExport");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}/audienceExports`,
      {
        method: "POST",
        body: JSON.stringify(audienceExport)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics audience export",
        response
      );
    }
    return response.json();
  }
  async getAudienceExport(args, credentials) {
    const name = requiredResourceName(
      args.audienceExportName,
      "audienceExportName",
      "audienceExports"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${name}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics audience export",
        response
      );
    }
    return response.json();
  }
  async queryAudienceExport(args, credentials) {
    const name = requiredResourceName(
      args.audienceExportName,
      "audienceExportName",
      "audienceExports"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args))
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics audience export",
        response
      );
    }
    return response.json();
  }
  async checkCompatibility(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const payload = optionalObject(args.request, "request");
    if (args.dimensions !== void 0) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }
    if (args.metrics !== void 0) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }
    if (args.dateRanges !== void 0) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }
    if (args.dimensionFilter !== void 0) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }
    if (args.metricFilter !== void 0) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }
    if (args.compatibilityFilter !== void 0) {
      payload.compatibilityFilter = safeTrim(args.compatibilityFilter);
    }
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:checkCompatibility`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to check Google Analytics compatibility", response);
    }
    return response.json();
  }
  async createAudienceList(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const audienceList = optionalObject(args.audienceList, "audienceList");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}/audienceLists`,
      {
        method: "POST",
        body: JSON.stringify(audienceList)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics audience list",
        response
      );
    }
    return response.json();
  }
  async getAudienceList(args, credentials) {
    const name = requiredResourceName(
      args.audienceListName,
      "audienceListName",
      "audienceLists"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics audience list",
        response
      );
    }
    return response.json();
  }
  async queryAudienceList(args, credentials) {
    const name = requiredResourceName(
      args.audienceListName,
      "audienceListName",
      "audienceLists"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args))
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics audience list",
        response
      );
    }
    return response.json();
  }
  async runPivotReport(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const payload = this.buildCoreReportPayload(args, {
      defaultDateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }]
    });
    if (!Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      throw new Error("metrics is required");
    }
    if (args.pivots !== void 0) {
      payload.pivots = normalizeObjectList(args.pivots, "pivots");
    }
    if (!Array.isArray(payload.pivots) || payload.pivots.length === 0) {
      throw new Error("pivots is required");
    }
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1beta/${property}:runPivotReport`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics pivot report", response);
    }
    return response.json();
  }
  async createReportTask(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const reportTask = optionalObject(args.reportTask, "reportTask");
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}/reportTasks`,
      {
        method: "POST",
        body: JSON.stringify(reportTask)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to create Google Analytics report task",
        response
      );
    }
    return response.json();
  }
  async getReportTask(args, credentials) {
    const name = requiredResourceName(
      args.reportTaskName,
      "reportTaskName",
      "reportTasks"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to get Google Analytics report task",
        response
      );
    }
    return response.json();
  }
  async queryReportTask(args, credentials) {
    const name = requiredResourceName(
      args.reportTaskName,
      "reportTaskName",
      "reportTasks"
    );
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${name}:query`,
      {
        method: "POST",
        body: JSON.stringify(this.buildPagingPayload(args))
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError(
        "Failed to query Google Analytics report task",
        response
      );
    }
    return response.json();
  }
  async runFunnelReport(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const payload = optionalObject(args.request, "request");
    if (args.dateRanges !== void 0) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }
    if (!payload.dateRanges) {
      payload.dateRanges = [{ startDate: "28daysAgo", endDate: "yesterday" }];
    }
    if (args.funnel !== void 0) {
      payload.funnel = optionalObject(args.funnel, "funnel");
    }
    if (!isRecordObject(payload.funnel)) {
      throw new Error("funnel is required");
    }
    if (args.funnelBreakdown !== void 0) {
      payload.funnelBreakdown = optionalObject(args.funnelBreakdown, "funnelBreakdown");
    }
    if (args.funnelNextAction !== void 0) {
      payload.funnelNextAction = optionalObject(args.funnelNextAction, "funnelNextAction");
    }
    if (args.funnelVisualizationType !== void 0) {
      payload.funnelVisualizationType = safeTrim(args.funnelVisualizationType);
    }
    if (args.segments !== void 0) {
      payload.segments = normalizeObjectList(args.segments, "segments");
    }
    if (args.dimensionFilter !== void 0) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }
    if (args.limit !== void 0) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    }
    if (args.returnPropertyQuota !== void 0) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }
    const response = await this.apiRequest(
      `${ANALYTICS_DATA_BASE_URL}/v1alpha/${property}:runFunnelReport`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to run Google Analytics funnel report", response);
    }
    return response.json();
  }
  async updateProperty(args, credentials) {
    const property = normalizePropertyId(args.propertyId);
    const updateMask = safeTrim(args.updateMask);
    if (!updateMask) {
      throw new Error("updateMask is required");
    }
    const propertyBody = optionalObject(args.property, "property");
    const response = await this.apiRequest(
      `${ANALYTICS_ADMIN_BASE_URL}/v1beta/${property}?${new URLSearchParams({
        updateMask
      }).toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...propertyBody,
          name: property
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Analytics property", response);
    }
    return response.json();
  }
  async validateEvents(args) {
    const query = this.buildMeasurementProtocolQuery(args);
    const payload = this.buildMeasurementProtocolPayload(args);
    if (!payload.validation_behavior) {
      payload.validation_behavior = safeTrim(args.validationBehavior) ?? "ENFORCE_RECOMMENDATIONS";
    }
    const response = await fetch(
      `https://www.google-analytics.com/debug/mp/collect?${query.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      throw await this.createGenericApiError(
        "Failed to validate Google Analytics Measurement Protocol events",
        response
      );
    }
    return response.json();
  }
  async sendEvents(args) {
    const query = this.buildMeasurementProtocolQuery(args);
    const payload = this.buildMeasurementProtocolPayload(args);
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?${query.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      throw await this.createGenericApiError(
        "Failed to send Google Analytics Measurement Protocol events",
        response
      );
    }
    return {
      ok: true,
      status: response.status,
      message: "Google Analytics accepted the Measurement Protocol request."
    };
  }
  buildCoreReportPayload(args, options = {}) {
    const payload = optionalObject(args.request, "request");
    if (args.dimensions !== void 0) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }
    if (args.metrics !== void 0) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }
    if (args.dateRanges !== void 0) {
      payload.dateRanges = normalizeObjectList(args.dateRanges, "dateRanges");
    }
    if (!payload.dateRanges && options.defaultDateRanges) {
      payload.dateRanges = options.defaultDateRanges;
    }
    if (args.dimensionFilter !== void 0) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }
    if (args.metricFilter !== void 0) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }
    if (args.orderBys !== void 0) {
      payload.orderBys = normalizeObjectList(args.orderBys, "orderBys");
    }
    if (args.metricAggregations !== void 0) {
      payload.metricAggregations = normalizeStringList(args.metricAggregations, "metricAggregations");
    }
    if (args.comparisons !== void 0) {
      payload.comparisons = normalizeObjectList(args.comparisons, "comparisons");
    }
    if (args.cohortSpec !== void 0) {
      payload.cohortSpec = optionalObject(args.cohortSpec, "cohortSpec");
    }
    setIfProvided(payload, "currencyCode", safeTrim(args.currencyCode) ?? void 0);
    if (args.keepEmptyRows !== void 0) {
      payload.keepEmptyRows = Boolean(args.keepEmptyRows);
    }
    if (args.returnPropertyQuota !== void 0) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }
    if (args.limit !== void 0) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    } else if (!payload.limit && options.defaultLimit) {
      payload.limit = options.defaultLimit;
    }
    if (args.offset !== void 0) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }
    return payload;
  }
  buildRealtimeReportPayload(args) {
    const payload = optionalObject(args.request, "request");
    if (args.dimensions !== void 0) {
      payload.dimensions = normalizeNamedResourceList(args.dimensions, "dimensions");
    }
    if (args.metrics !== void 0) {
      payload.metrics = normalizeNamedResourceList(args.metrics, "metrics");
    }
    if (args.minuteRanges !== void 0) {
      payload.minuteRanges = normalizeObjectList(args.minuteRanges, "minuteRanges");
    }
    if (!payload.minuteRanges) {
      payload.minuteRanges = [{ startMinutesAgo: 29, endMinutesAgo: 0 }];
    }
    if (args.dimensionFilter !== void 0) {
      payload.dimensionFilter = optionalObject(args.dimensionFilter, "dimensionFilter");
    }
    if (args.metricFilter !== void 0) {
      payload.metricFilter = optionalObject(args.metricFilter, "metricFilter");
    }
    if (args.orderBys !== void 0) {
      payload.orderBys = normalizeObjectList(args.orderBys, "orderBys");
    }
    if (args.comparisons !== void 0) {
      payload.comparisons = normalizeObjectList(args.comparisons, "comparisons");
    }
    if (args.returnPropertyQuota !== void 0) {
      payload.returnPropertyQuota = Boolean(args.returnPropertyQuota);
    }
    if (args.limit !== void 0) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    } else if (!payload.limit) {
      payload.limit = "100";
    }
    if (args.offset !== void 0) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }
    return payload;
  }
  buildPagingPayload(args) {
    const payload = {};
    if (args.offset !== void 0) {
      payload.offset = toPositiveIntString(args.offset, "offset", { min: 0 });
    }
    if (args.limit !== void 0) {
      payload.limit = toPositiveIntString(args.limit, "limit", { min: 1 });
    }
    return payload;
  }
  buildMeasurementProtocolQuery(args) {
    const apiSecret = safeTrim(args.apiSecret);
    const measurementId = safeTrim(args.measurementId);
    const firebaseAppId = safeTrim(args.firebaseAppId);
    if (!apiSecret) {
      throw new Error("apiSecret is required");
    }
    if (!measurementId && !firebaseAppId) {
      throw new Error("measurementId or firebaseAppId is required");
    }
    const query = new URLSearchParams({
      api_secret: apiSecret
    });
    if (measurementId) {
      query.set("measurement_id", measurementId);
    }
    if (firebaseAppId) {
      query.set("firebase_app_id", firebaseAppId);
    }
    return query;
  }
  buildMeasurementProtocolPayload(args) {
    const payload = optionalObject(args.payload, "payload");
    if (args.events !== void 0) {
      payload.events = normalizeObjectList(args.events, "events");
    }
    if (!Array.isArray(payload.events) || payload.events.length === 0) {
      throw new Error("events is required");
    }
    setIfProvided(payload, "client_id", safeTrim(args.clientId) ?? void 0);
    setIfProvided(
      payload,
      "app_instance_id",
      safeTrim(args.appInstanceId) ?? void 0
    );
    setIfProvided(payload, "user_id", safeTrim(args.userId) ?? void 0);
    setIfProvided(
      payload,
      "timestamp_micros",
      safeTrim(args.timestampMicros) ?? void 0
    );
    if (!payload.client_id && !payload.app_instance_id) {
      throw new Error("clientId or appInstanceId is required");
    }
    return payload;
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
  async createGenericApiError(prefix, response) {
    const bodyText = (await response.text().catch(() => "")).trim();
    const message = bodyText || response.statusText;
    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status
    });
  }
};
registerHandler("google-analytics", new GoogleAnalyticsHandler());

// integrations/google-search-console.ts
var WEBMASTERS_BASE_URL = "https://www.googleapis.com/webmasters/v3";
var URL_INSPECTION_BASE_URL = "https://searchconsole.googleapis.com/v1";
function isRecordObject2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject2, "isRecordObject");
function safeTrim2(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim2, "safeTrim");
function getAccessToken3(credentials) {
  const token = safeTrim2(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Search Console credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken3, "getAccessToken");
function optionalObject2(value, fieldName) {
  if (value === void 0 || value === null) {
    return {};
  }
  if (!isRecordObject2(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return { ...value };
}
__name(optionalObject2, "optionalObject");
function normalizeStringList2(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    const normalized = safeTrim2(entry);
    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }
    return normalized;
  });
}
__name(normalizeStringList2, "normalizeStringList");
function encodePathSegment(value) {
  return encodeURIComponent(value);
}
__name(encodePathSegment, "encodePathSegment");
function requiredSiteUrl(value) {
  const siteUrl = safeTrim2(value);
  if (!siteUrl) {
    throw new Error("siteUrl is required");
  }
  return siteUrl;
}
__name(requiredSiteUrl, "requiredSiteUrl");
function requiredFeedPath(value) {
  const feedpath = safeTrim2(value);
  if (!feedpath) {
    throw new Error("feedpath is required");
  }
  return feedpath;
}
__name(requiredFeedPath, "requiredFeedPath");
var GoogleSearchConsoleHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleSearchConsoleHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "add_site", {
        description: "Add a Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as Search Console expects, such as https://example.com/ or sc-domain:example.com"
            }
          },
          required: ["siteUrl"]
        },
        accessLevel: "write",
        tags: ["google-search-console", "sites", "property", "create"],
        whenToUse: [
          "User explicitly wants to add a Search Console property."
        ],
        askBefore: [
          "Confirm the exact property format because URL-prefix properties need protocol and trailing slash, while domain properties must use sc-domain:."
        ]
      }),
      defineTool(integrationSlug, "delete_site", {
        description: "Delete a Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as stored in Search Console"
            }
          },
          required: ["siteUrl"]
        },
        accessLevel: "destructive",
        tags: ["google-search-console", "sites", "property", "delete"],
        whenToUse: [
          "User explicitly wants to remove a Search Console property."
        ],
        askBefore: [
          "Confirm before deleting a Search Console property unless the user was already explicit."
        ]
      }),
      defineTool(integrationSlug, "get_site", {
        description: "Get a specific Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console"
            }
          },
          required: ["siteUrl"]
        },
        accessLevel: "read",
        tags: ["google-search-console", "sites", "property", "lookup"]
      }),
      defineTool(integrationSlug, "list_sites", {
        description: "List Google Search Console site properties for the connected account",
        inputSchema: {
          type: "object",
          properties: {}
        },
        accessLevel: "read",
        tags: ["google-search-console", "sites", "property", "list"],
        whenToUse: [
          "User wants to see verified Search Console properties.",
          "You need the exact siteUrl value before calling downstream Search Console tools."
        ],
        followups: [
          "Use the returned siteUrl exactly as-is when fetching sitemaps, analytics, or URL inspection."
        ]
      }),
      defineTool(integrationSlug, "get_sitemap", {
        description: "Get metadata for a Search Console sitemap",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by list_sites"
            },
            feedpath: {
              type: "string",
              description: "Full sitemap URL, for example https://example.com/sitemap.xml"
            }
          },
          required: ["siteUrl", "feedpath"]
        },
        accessLevel: "read",
        tags: ["google-search-console", "sitemaps", "lookup"]
      }),
      defineTool(integrationSlug, "inspect_url", {
        description: "Inspect a URL in Google Search Console for index coverage and related issues",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console"
            },
            inspectionUrl: {
              type: "string",
              description: "Fully-qualified URL to inspect. It must belong to the property."
            },
            languageCode: {
              type: "string",
              description: "Optional BCP-47 language code such as en-US"
            }
          },
          required: ["siteUrl", "inspectionUrl"]
        },
        accessLevel: "read",
        tags: ["google-search-console", "url-inspection", "indexing"],
        whenToUse: [
          "User wants to check whether a page is indexed or has inspection issues."
        ],
        askBefore: [
          "Prefer targeted inspection for priority URLs because the endpoint is quota-sensitive."
        ]
      }),
      defineTool(integrationSlug, "list_sitemaps", {
        description: "List sitemaps for a Search Console property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console"
            },
            sitemapIndex: {
              type: "string",
              description: "Optional sitemap index URL to filter by"
            }
          },
          required: ["siteUrl"]
        },
        accessLevel: "read",
        tags: ["google-search-console", "sitemaps", "list"]
      }),
      defineTool(integrationSlug, "search_analytics_query", {
        description: "Query Google Search Console search analytics data",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console"
            },
            startDate: {
              type: "string",
              description: "Required start date in YYYY-MM-DD format"
            },
            endDate: {
              type: "string",
              description: "Required end date in YYYY-MM-DD format"
            },
            dimensions: {
              type: "array",
              items: { type: "string" },
              description: "Optional dimensions such as query, page, country, device, searchAppearance, date, or hour"
            },
            type: {
              type: "string",
              enum: ["web", "image", "video", "discover", "googleNews", "news"],
              description: "Optional search type filter"
            },
            dimensionFilterGroups: {
              type: "array",
              items: { type: "object" },
              description: "Optional Search Console dimension filter groups"
            },
            aggregationType: {
              type: "string",
              description: "Optional aggregation type"
            },
            rowLimit: {
              type: "number",
              description: "Optional maximum rows to return"
            },
            startRow: {
              type: "number",
              description: "Optional row offset"
            },
            dataState: {
              type: "string",
              description: "Optional data state such as final or all"
            },
            request: {
              type: "object",
              description: "Optional raw request body to merge with top-level arguments"
            }
          },
          required: ["siteUrl", "startDate", "endDate"]
        },
        accessLevel: "read",
        tags: ["google-search-console", "analytics", "search-performance"],
        whenToUse: [
          "User wants clicks, impressions, CTR, or average position from Search Console."
        ],
        safeDefaults: {
          type: "web",
          rowLimit: 100
        }
      }),
      defineTool(integrationSlug, "submit_sitemap", {
        description: "Submit a sitemap to Google Search Console",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console"
            },
            feedpath: {
              type: "string",
              description: "Full sitemap URL to submit"
            }
          },
          required: ["siteUrl", "feedpath"]
        },
        accessLevel: "write",
        tags: ["google-search-console", "sitemaps", "submit"],
        whenToUse: [
          "User explicitly wants to submit or resubmit a sitemap."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken3(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "add_site":
        return this.addSite(args, credentials);
      case "delete_site":
        return this.deleteSite(args, credentials);
      case "get_site":
        return this.getSite(args, credentials);
      case "list_sites":
        return this.listSites(credentials);
      case "get_sitemap":
        return this.getSitemap(args, credentials);
      case "inspect_url":
        return this.inspectUrl(args, credentials);
      case "list_sitemaps":
        return this.listSitemaps(args, credentials);
      case "search_analytics_query":
        return this.searchAnalyticsQuery(args, credentials);
      case "submit_sitemap":
        return this.submitSitemap(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${WEBMASTERS_BASE_URL}/sites`,
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async addSite(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "PUT" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to add Google Search Console site", response);
    }
    return {
      ok: true,
      siteUrl,
      added: true,
      message: "Site added to Search Console. Ownership verification may still be required."
    };
  }
  async deleteSite(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Search Console site", response);
    }
    return {
      ok: true,
      siteUrl,
      deleted: true
    };
  }
  async getSite(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Search Console site", response);
    }
    return response.json();
  }
  async listSites(credentials) {
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Search Console sites", response);
    }
    return response.json();
  }
  async getSitemap(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const feedpath = requiredFeedPath(args.feedpath);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps/${encodePathSegment(feedpath)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Search Console sitemap", response);
    }
    return response.json();
  }
  async inspectUrl(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const inspectionUrl = safeTrim2(args.inspectionUrl);
    if (!inspectionUrl) {
      throw new Error("inspectionUrl is required");
    }
    const payload = {
      inspectionUrl,
      siteUrl
    };
    const languageCode = safeTrim2(args.languageCode);
    if (languageCode) {
      payload.languageCode = languageCode;
    }
    const response = await this.apiRequest(
      `${URL_INSPECTION_BASE_URL}/urlInspection/index:inspect`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to inspect URL in Google Search Console", response);
    }
    return response.json();
  }
  async listSitemaps(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const query = new URLSearchParams();
    const sitemapIndex = safeTrim2(args.sitemapIndex);
    if (sitemapIndex) {
      query.set("sitemapIndex", sitemapIndex);
    }
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps${query.size > 0 ? `?${query.toString()}` : ""}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Search Console sitemaps", response);
    }
    return response.json();
  }
  async searchAnalyticsQuery(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const startDate = safeTrim2(args.startDate);
    const endDate = safeTrim2(args.endDate);
    if (!startDate) {
      throw new Error("startDate is required");
    }
    if (!endDate) {
      throw new Error("endDate is required");
    }
    const payload = optionalObject2(args.request, "request");
    payload.startDate = startDate;
    payload.endDate = endDate;
    if (args.dimensions !== void 0) {
      payload.dimensions = normalizeStringList2(args.dimensions, "dimensions");
    }
    const type = safeTrim2(args.type);
    if (type) {
      payload.type = type;
    } else if (!payload.type) {
      payload.type = "web";
    }
    if (args.dimensionFilterGroups !== void 0) {
      if (!Array.isArray(args.dimensionFilterGroups)) {
        throw new Error("dimensionFilterGroups must be an array");
      }
      payload.dimensionFilterGroups = args.dimensionFilterGroups;
    }
    const aggregationType = safeTrim2(args.aggregationType);
    if (aggregationType) {
      payload.aggregationType = aggregationType;
    }
    const dataState = safeTrim2(args.dataState);
    if (dataState) {
      payload.dataState = dataState;
    }
    if (args.rowLimit !== void 0) {
      payload.rowLimit = Number(args.rowLimit);
    } else if (payload.rowLimit === void 0) {
      payload.rowLimit = 100;
    }
    if (args.startRow !== void 0) {
      payload.startRow = Number(args.startRow);
    }
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to query Google Search Console analytics", response);
    }
    return response.json();
  }
  async submitSitemap(args, credentials) {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const feedpath = requiredFeedPath(args.feedpath);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps/${encodePathSegment(feedpath)}`,
      { method: "PUT" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to submit Google Search Console sitemap", response);
    }
    return {
      ok: true,
      siteUrl,
      feedpath,
      submitted: true
    };
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim2(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("google-search-console", new GoogleSearchConsoleHandler());

// integrations/google-drive.ts
var GOOGLE_DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3";
var GOOGLE_DRIVE_UPLOAD_BASE_URL = "https://www.googleapis.com/upload/drive/v3";
var GOOGLE_WORKSPACE_EXPORT_MIME_TYPES = {
  "application/vnd.google-apps.document": "text/markdown",
  "application/vnd.google-apps.spreadsheet": "text/csv",
  "application/vnd.google-apps.presentation": "application/pdf",
  "application/vnd.google-apps.drawing": "image/png",
  "application/vnd.google-apps.script": "application/vnd.google-apps.script+json"
};
function isRecordObject3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject3, "isRecordObject");
function safeTrim3(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim3, "safeTrim");
function getAccessToken4(credentials) {
  const token = safeTrim3(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Drive credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken4, "getAccessToken");
function requiredString(value, fieldName) {
  const normalized = safeTrim3(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}
__name(requiredString, "requiredString");
function optionalBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
__name(optionalBoolean, "optionalBoolean");
function optionalNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
}
__name(optionalNumber, "optionalNumber");
function normalizeStringList3(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    const normalized = safeTrim3(entry);
    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }
    return normalized;
  });
}
__name(normalizeStringList3, "normalizeStringList");
function optionalObject3(value, fieldName) {
  if (value === void 0 || value === null) {
    return {};
  }
  if (!isRecordObject3(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return { ...value };
}
__name(optionalObject3, "optionalObject");
function setIfDefined(payload, key, value) {
  if (value !== void 0) {
    payload[key] = value;
  }
}
__name(setIfDefined, "setIfDefined");
function inferDownloadFormat(body, contentType) {
  if (contentType?.includes("application/json")) {
    return "json";
  }
  if (contentType) {
    const textualPrefixes = ["text/", "application/xml", "application/javascript", "application/x-javascript"];
    if (textualPrefixes.some((prefix) => contentType.includes(prefix))) {
      return "text";
    }
  }
  if (/^[\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]*$/.test(body)) {
    return "text";
  }
  return "base64";
}
__name(inferDownloadFormat, "inferDownloadFormat");
var GoogleDriveHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleDriveHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "list_files", {
        description: "List recent Google Drive files",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: { type: "number", description: "Maximum files to return" },
            orderBy: { type: "string", description: "Drive orderBy expression such as modifiedTime desc" },
            corpora: { type: "string", description: "Drive corpora value such as user or drive" },
            driveId: { type: "string", description: "Shared drive id when applicable" }
          }
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "list"],
        safeDefaults: {
          pageSize: 25,
          orderBy: "modifiedTime desc"
        }
      }),
      defineTool(integrationSlug, "search_files", {
        description: "Search Google Drive files with text, mime type, and folder filters",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Free-text name/fullText query" },
            parentId: { type: "string", description: "Optional folder id to search within" },
            mimeType: { type: "string", description: "Optional mime type filter" },
            trashed: { type: "boolean", description: "Include trashed state in query, default false" },
            pageSize: { type: "number", description: "Maximum files to return" },
            orderBy: { type: "string", description: "Drive orderBy expression" },
            rawQuery: { type: "string", description: "Optional raw Drive q string to use directly" }
          }
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "search"],
        safeDefaults: {
          pageSize: 25,
          trashed: false,
          orderBy: "modifiedTime desc"
        }
      }),
      defineTool(integrationSlug, "get_file", {
        description: "Get Google Drive file metadata by file id",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            fields: { type: "string", description: "Optional Drive fields selector" }
          },
          required: ["fileId"]
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "lookup"]
      }),
      defineTool(integrationSlug, "list_children", {
        description: "List files inside a Google Drive folder",
        inputSchema: {
          type: "object",
          properties: {
            folderId: { type: "string", description: "Parent folder id" },
            pageSize: { type: "number", description: "Maximum children to return" },
            orderBy: { type: "string", description: "Drive orderBy expression" }
          },
          required: ["folderId"]
        },
        accessLevel: "read",
        tags: ["google-drive", "folders", "children"],
        safeDefaults: {
          pageSize: 50,
          orderBy: "folder,name"
        }
      }),
      defineTool(integrationSlug, "create_folder", {
        description: "Create a folder in Google Drive",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Folder name" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids" },
            description: { type: "string", description: "Optional folder description via appProperties hint or user metadata pattern" }
          },
          required: ["name"]
        },
        accessLevel: "write",
        tags: ["google-drive", "folders", "create"]
      }),
      defineTool(integrationSlug, "upload_file", {
        description: "Upload a text file to Google Drive",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "File name" },
            content: { type: "string", description: "Text content to upload" },
            mimeType: { type: "string", description: "Mime type, default text/plain" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids" },
            description: { type: "string", description: "Optional Drive file description" }
          },
          required: ["name", "content"]
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "upload"],
        askBefore: [
          "Use this text upload path for lightweight files first. Binary uploads can come in a later pass."
        ]
      }),
      defineTool(integrationSlug, "update_file", {
        description: "Update Google Drive file metadata or replace text content",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            name: { type: "string", description: "Updated file name" },
            description: { type: "string", description: "Updated file description" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional full parent set to add" },
            removeParentIds: { type: "array", items: { type: "string" }, description: "Optional parent ids to remove" },
            content: { type: "string", description: "Optional replacement text content" },
            mimeType: { type: "string", description: "Mime type to use when replacing content" }
          },
          required: ["fileId"]
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "update"]
      }),
      defineTool(integrationSlug, "download_file", {
        description: "Download raw Google Drive file content when supported",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            acknowledgeBinary: { type: "boolean", description: "Set true to allow binary/base64 responses" }
          },
          required: ["fileId"]
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "download"]
      }),
      defineTool(integrationSlug, "export_file", {
        description: "Export a Google Docs-format file to a chosen mime type",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            mimeType: { type: "string", description: "Target export mime type, e.g. text/markdown or application/pdf" },
            acknowledgeBinary: { type: "boolean", description: "Set true to allow binary/base64 responses" }
          },
          required: ["fileId"]
        },
        accessLevel: "read",
        tags: ["google-drive", "files", "export"]
      }),
      defineTool(integrationSlug, "copy_file", {
        description: "Copy a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Source Google Drive file id" },
            name: { type: "string", description: "Optional name for the copied file" },
            parentIds: { type: "array", items: { type: "string" }, description: "Optional parent folder ids for the copy" },
            description: { type: "string", description: "Optional description for the copied file" }
          },
          required: ["fileId"]
        },
        accessLevel: "write",
        tags: ["google-drive", "files", "copy"]
      }),
      defineTool(integrationSlug, "list_permissions", {
        description: "List sharing permissions on a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            pageSize: { type: "number", description: "Maximum permissions to return" }
          },
          required: ["fileId"]
        },
        accessLevel: "read",
        tags: ["google-drive", "permissions", "list"]
      }),
      defineTool(integrationSlug, "create_permission", {
        description: "Create a sharing permission on a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            type: { type: "string", description: "Permission type such as user, group, domain, or anyone" },
            role: { type: "string", description: "Permission role such as reader, commenter, or writer" },
            emailAddress: { type: "string", description: "Email for user/group permissions" },
            domain: { type: "string", description: "Domain for domain permissions" },
            allowFileDiscovery: { type: "boolean", description: "Whether the file is discoverable for domain/anyone permissions" },
            sendNotificationEmail: { type: "boolean", description: "Whether Drive should send a share email" }
          },
          required: ["fileId", "type", "role"]
        },
        accessLevel: "write",
        tags: ["google-drive", "permissions", "create"]
      }),
      defineTool(integrationSlug, "delete_permission", {
        description: "Delete a sharing permission from a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" },
            permissionId: { type: "string", description: "Permission id to delete" }
          },
          required: ["fileId", "permissionId"]
        },
        accessLevel: "destructive",
        tags: ["google-drive", "permissions", "delete"],
        askBefore: [
          "Confirm before removing an existing Google Drive share permission unless the user was already explicit."
        ]
      }),
      defineTool(integrationSlug, "delete_file", {
        description: "Delete a Google Drive file",
        inputSchema: {
          type: "object",
          properties: {
            fileId: { type: "string", description: "Google Drive file id" }
          },
          required: ["fileId"]
        },
        accessLevel: "destructive",
        tags: ["google-drive", "files", "delete"],
        askBefore: [
          "Confirm before deleting a Google Drive file unless the user was already explicit."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken4(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "list_files":
        return this.listFiles(args, credentials);
      case "search_files":
        return this.searchFiles(args, credentials);
      case "get_file":
        return this.getFile(args, credentials);
      case "list_children":
        return this.listChildren(args, credentials);
      case "create_folder":
        return this.createFolder(args, credentials);
      case "upload_file":
        return this.uploadFile(args, credentials);
      case "update_file":
        return this.updateFile(args, credentials);
      case "download_file":
        return this.downloadFile(args, credentials);
      case "export_file":
        return this.exportFile(args, credentials);
      case "copy_file":
        return this.copyFile(args, credentials);
      case "list_permissions":
        return this.listPermissions(args, credentials);
      case "create_permission":
        return this.createPermission(args, credentials);
      case "delete_permission":
        return this.deletePermission(args, credentials);
      case "delete_file":
        return this.deleteFile(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_DRIVE_BASE_URL}/files?pageSize=1&fields=files(id)`,
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async listFiles(args, credentials) {
    const query = new URLSearchParams({
      pageSize: String(optionalNumber(args.pageSize) ?? 25),
      orderBy: safeTrim3(args.orderBy) ?? "modifiedTime desc",
      fields: "nextPageToken, files(id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,driveId,owners(displayName,emailAddress))",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true"
    });
    const corpora = safeTrim3(args.corpora);
    if (corpora) {
      query.set("corpora", corpora);
    }
    const driveId = safeTrim3(args.driveId);
    if (driveId) {
      query.set("driveId", driveId);
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?${query.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Drive files", response);
    }
    return response.json();
  }
  async searchFiles(args, credentials) {
    const rawQuery = safeTrim3(args.rawQuery);
    const clauses = [];
    if (rawQuery) {
      clauses.push(rawQuery);
    } else {
      const query2 = safeTrim3(args.query);
      const escapedQuery = query2?.replace(/'/g, "\\'");
      if (escapedQuery) {
        clauses.push(`(name contains '${escapedQuery}' or fullText contains '${escapedQuery}')`);
      }
      const parentId = safeTrim3(args.parentId);
      if (parentId) {
        clauses.push(`'${parentId.replace(/'/g, "\\'")}' in parents`);
      }
      const mimeType = safeTrim3(args.mimeType);
      if (mimeType) {
        clauses.push(`mimeType = '${mimeType.replace(/'/g, "\\'")}'`);
      }
      const trashed = optionalBoolean(args.trashed) ?? false;
      clauses.push(`trashed = ${trashed ? "true" : "false"}`);
    }
    const q = clauses.join(" and ");
    const query = new URLSearchParams({
      pageSize: String(optionalNumber(args.pageSize) ?? 25),
      orderBy: safeTrim3(args.orderBy) ?? "modifiedTime desc",
      fields: "nextPageToken, files(id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,driveId)",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true"
    });
    if (q) {
      query.set("q", q);
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?${query.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to search Google Drive files", response);
    }
    return response.json();
  }
  async getFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const fields = safeTrim3(args.fields) ?? "id,name,mimeType,parents,description,webViewLink,webContentLink,createdTime,modifiedTime,size,trashed,owners(displayName,emailAddress),lastModifyingUser(displayName,emailAddress)";
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?${new URLSearchParams({ fields, supportsAllDrives: "true" }).toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Drive file", response);
    }
    return response.json();
  }
  async listChildren(args, credentials) {
    const folderId = requiredString(args.folderId, "folderId");
    return this.searchFiles(
      {
        rawQuery: `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false`,
        pageSize: optionalNumber(args.pageSize) ?? 50,
        orderBy: safeTrim3(args.orderBy) ?? "folder,name"
      },
      credentials
    );
  }
  async createFolder(args, credentials) {
    const payload = {
      name: requiredString(args.name, "name"),
      mimeType: "application/vnd.google-apps.folder"
    };
    const parentIds = normalizeStringList3(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }
    const description = safeTrim3(args.description);
    if (description) {
      payload.description = description;
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files?supportsAllDrives=true&fields=id,name,mimeType,parents,webViewLink,createdTime`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Drive folder", response);
    }
    return response.json();
  }
  async uploadFile(args, credentials) {
    const metadata = {
      name: requiredString(args.name, "name")
    };
    const parentIds = normalizeStringList3(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      metadata.parents = parentIds;
    }
    const description = safeTrim3(args.description);
    if (description) {
      metadata.description = description;
    }
    const mimeType = safeTrim3(args.mimeType) ?? "text/plain";
    const content = requiredString(args.content, "content");
    const boundary = `clawlink-${crypto.randomUUID()}`;
    const multipartBody = [
      `--${boundary}\r
Content-Type: application/json; charset=UTF-8\r
\r
${JSON.stringify(metadata)}\r
`,
      `--${boundary}\r
Content-Type: ${mimeType}\r
\r
${content}\r
`,
      `--${boundary}--`
    ].join("");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,parents,webViewLink,webContentLink,createdTime,modifiedTime,size`,
      {
        method: "POST",
        headers: {
          "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to upload Google Drive file", response);
    }
    return response.json();
  }
  async updateFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const name = safeTrim3(args.name);
    const description = safeTrim3(args.description);
    const parentIds = normalizeStringList3(args.parentIds, "parentIds");
    const removeParentIds = normalizeStringList3(args.removeParentIds, "removeParentIds");
    const content = safeTrim3(args.content);
    const mimeType = safeTrim3(args.mimeType) ?? "text/plain";
    if (!name && !description && parentIds.length === 0 && removeParentIds.length === 0 && content === null) {
      throw new Error("Provide at least one metadata field or content to update the Google Drive file");
    }
    if (content !== null) {
      const metadata = {};
      setIfDefined(metadata, "name", name ?? void 0);
      setIfDefined(metadata, "description", description ?? void 0);
      if (parentIds.length > 0) {
        metadata.parents = parentIds;
      }
      const boundary = `clawlink-${crypto.randomUUID()}`;
      const query2 = new URLSearchParams({
        uploadType: "multipart",
        supportsAllDrives: "true",
        fields: "id,name,mimeType,parents,description,webViewLink,modifiedTime,size"
      });
      if (removeParentIds.length > 0) {
        query2.set("removeParents", removeParentIds.join(","));
      }
      const multipartBody = [
        `--${boundary}\r
Content-Type: application/json; charset=UTF-8\r
\r
${JSON.stringify(metadata)}\r
`,
        `--${boundary}\r
Content-Type: ${mimeType}\r
\r
${content}\r
`,
        `--${boundary}--`
      ].join("");
      const response2 = await this.apiRequest(
        `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files/${encodeURIComponent(fileId)}?${query2.toString()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        },
        credentials
      );
      if (!response2.ok) {
        throw await this.createApiError("Failed to update Google Drive file", response2);
      }
      return response2.json();
    }
    const payload = optionalObject3({}, "payload");
    setIfDefined(payload, "name", name ?? void 0);
    setIfDefined(payload, "description", description ?? void 0);
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }
    const query = new URLSearchParams({
      supportsAllDrives: "true",
      fields: "id,name,mimeType,parents,description,webViewLink,modifiedTime,size"
    });
    if (removeParentIds.length > 0) {
      query.set("removeParents", removeParentIds.join(","));
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?${query.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Drive file", response);
    }
    return response.json();
  }
  async downloadFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to download Google Drive file", response);
    }
    const contentType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const utf8 = body.toString("utf8");
    const format = inferDownloadFormat(utf8, contentType);
    if (format === "base64" && optionalBoolean(args.acknowledgeBinary) !== true) {
      throw new Error("This file appears binary. Re-run with acknowledgeBinary=true to receive base64 content.");
    }
    return {
      ok: true,
      fileId,
      contentType,
      encoding: format === "base64" ? "base64" : "utf8",
      content: format === "base64" ? body.toString("base64") : format === "json" ? JSON.parse(utf8) : utf8
    };
  }
  async exportFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const metadata = await this.getFile({ fileId, fields: "id,name,mimeType" }, credentials);
    const sourceMimeType = safeTrim3(metadata.mimeType);
    const mimeType = safeTrim3(args.mimeType) ?? (sourceMimeType ? GOOGLE_WORKSPACE_EXPORT_MIME_TYPES[sourceMimeType] : null);
    if (!mimeType) {
      throw new Error("mimeType is required for export when the source Google Workspace file type has no default export mapping");
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/export?${new URLSearchParams({ mimeType }).toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to export Google Drive file", response);
    }
    const contentType = response.headers.get("content-type") ?? mimeType;
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const utf8 = body.toString("utf8");
    const format = inferDownloadFormat(utf8, contentType);
    if (format === "base64" && optionalBoolean(args.acknowledgeBinary) !== true) {
      throw new Error("This export appears binary. Re-run with acknowledgeBinary=true to receive base64 content.");
    }
    return {
      ok: true,
      fileId,
      sourceMimeType,
      exportMimeType: mimeType,
      contentType,
      encoding: format === "base64" ? "base64" : "utf8",
      content: format === "base64" ? body.toString("base64") : format === "json" ? JSON.parse(utf8) : utf8
    };
  }
  async copyFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const payload = {};
    setIfDefined(payload, "name", safeTrim3(args.name) ?? void 0);
    setIfDefined(payload, "description", safeTrim3(args.description) ?? void 0);
    const parentIds = normalizeStringList3(args.parentIds, "parentIds");
    if (parentIds.length > 0) {
      payload.parents = parentIds;
    }
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/copy?supportsAllDrives=true&fields=id,name,mimeType,parents,description,webViewLink,createdTime,modifiedTime`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to copy Google Drive file", response);
    }
    return response.json();
  }
  async listPermissions(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const query = new URLSearchParams({
      supportsAllDrives: "true",
      fields: "nextPageToken,permissions(id,type,role,emailAddress,domain,allowFileDiscovery,displayName,photoLink,deleted,pendingOwner)",
      pageSize: String(optionalNumber(args.pageSize) ?? 100)
    });
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions?${query.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Drive permissions", response);
    }
    return response.json();
  }
  async createPermission(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const type = requiredString(args.type, "type");
    const role = requiredString(args.role, "role");
    const payload = { type, role };
    const emailAddress = safeTrim3(args.emailAddress);
    if (emailAddress) {
      payload.emailAddress = emailAddress;
    }
    const domain = safeTrim3(args.domain);
    if (domain) {
      payload.domain = domain;
    }
    const allowFileDiscovery = optionalBoolean(args.allowFileDiscovery);
    if (allowFileDiscovery !== void 0) {
      payload.allowFileDiscovery = allowFileDiscovery;
    }
    const query = new URLSearchParams({
      supportsAllDrives: "true",
      sendNotificationEmail: String(optionalBoolean(args.sendNotificationEmail) ?? false),
      fields: "id,type,role,emailAddress,domain,allowFileDiscovery,pendingOwner"
    });
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions?${query.toString()}`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Drive permission", response);
    }
    return response.json();
  }
  async deletePermission(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const permissionId = requiredString(args.permissionId, "permissionId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}/permissions/${encodeURIComponent(permissionId)}?supportsAllDrives=true`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Drive permission", response);
    }
    return {
      ok: true,
      fileId,
      permissionId,
      deleted: true
    };
  }
  async deleteFile(args, credentials) {
    const fileId = requiredString(args.fileId, "fileId");
    const response = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL}/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Drive file", response);
    }
    return {
      ok: true,
      fileId,
      deleted: true
    };
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim3(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("google-drive", new GoogleDriveHandler());

// integrations/google-docs.ts
var GOOGLE_DOCS_BASE_URL = "https://docs.googleapis.com/v1/documents";
var GOOGLE_DRIVE_BASE_URL2 = "https://www.googleapis.com/drive/v3";
var GOOGLE_DOCS_MIME_TYPE = "application/vnd.google-apps.document";
function isRecordObject4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject4, "isRecordObject");
function safeTrim4(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim4, "safeTrim");
function getAccessToken5(credentials) {
  const token = safeTrim4(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Docs credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken5, "getAccessToken");
function requiredString2(value, fieldName) {
  const normalized = safeTrim4(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}
__name(requiredString2, "requiredString");
function optionalString(value) {
  return safeTrim4(value) ?? void 0;
}
__name(optionalString, "optionalString");
function optionalNumber2(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
}
__name(optionalNumber2, "optionalNumber");
function optionalObject4(value, fieldName) {
  if (value === void 0 || value === null) {
    return {};
  }
  if (!isRecordObject4(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return { ...value };
}
__name(optionalObject4, "optionalObject");
function extractTextFromStructuralElements(elements) {
  if (!Array.isArray(elements)) {
    return "";
  }
  let text = "";
  for (const element of elements) {
    if (!isRecordObject4(element)) {
      continue;
    }
    const textRun = isRecordObject4(element.textRun) ? element.textRun : null;
    const content = textRun ? optionalString(textRun.content) : void 0;
    if (content) {
      text += content;
    }
  }
  return text;
}
__name(extractTextFromStructuralElements, "extractTextFromStructuralElements");
function documentBodyToPlainText(document) {
  const body = isRecordObject4(document.body) ? document.body : null;
  const content = Array.isArray(body?.content) ? body.content : [];
  let text = "";
  for (const item of content) {
    if (!isRecordObject4(item)) {
      continue;
    }
    const paragraph = isRecordObject4(item.paragraph) ? item.paragraph : null;
    if (paragraph) {
      text += extractTextFromStructuralElements(paragraph.elements);
      continue;
    }
    const table = isRecordObject4(item.table) ? item.table : null;
    if (table && Array.isArray(table.tableRows)) {
      for (const row of table.tableRows) {
        if (!isRecordObject4(row) || !Array.isArray(row.tableCells)) {
          continue;
        }
        for (const cell of row.tableCells) {
          if (!isRecordObject4(cell) || !Array.isArray(cell.content)) {
            continue;
          }
          for (const block of cell.content) {
            if (!isRecordObject4(block)) {
              continue;
            }
            const cellParagraph = isRecordObject4(block.paragraph) ? block.paragraph : null;
            if (cellParagraph) {
              text += extractTextFromStructuralElements(cellParagraph.elements);
            }
          }
        }
      }
    }
  }
  return text;
}
__name(documentBodyToPlainText, "documentBodyToPlainText");
function getDocumentEndIndex(document) {
  const body = isRecordObject4(document.body) ? document.body : null;
  const content = Array.isArray(body?.content) ? body.content : [];
  for (let i = content.length - 1; i >= 0; i -= 1) {
    const item = content[i];
    if (isRecordObject4(item) && typeof item.endIndex === "number") {
      return item.endIndex;
    }
  }
  return 1;
}
__name(getDocumentEndIndex, "getDocumentEndIndex");
function summarizeDocument(document) {
  const documentId = optionalString(document.documentId) ?? null;
  const title = optionalString(document.title) ?? null;
  const revisionId = optionalString(document.revisionId) ?? null;
  const text = documentBodyToPlainText(document);
  return {
    documentId,
    title,
    revisionId,
    text,
    textLength: text.length,
    endIndex: getDocumentEndIndex(document)
  };
}
__name(summarizeDocument, "summarizeDocument");
var GoogleDocsHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleDocsHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "create_document", {
        description: "Create a new Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Document title" },
            content: { type: "string", description: "Optional initial plain text content to insert" },
            parentFolderId: { type: "string", description: "Optional Drive folder id to move the new document into" }
          },
          required: ["title"]
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "create"]
      }),
      defineTool(integrationSlug, "get_document", {
        description: "Get Google Docs document metadata and structure by document id",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" }
          },
          required: ["documentId"]
        },
        accessLevel: "read",
        tags: ["google-docs", "documents", "lookup"]
      }),
      defineTool(integrationSlug, "read_document", {
        description: "Read a Google Docs document as plain text with compact metadata",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" }
          },
          required: ["documentId"]
        },
        accessLevel: "read",
        tags: ["google-docs", "documents", "read", "text"]
      }),
      defineTool(integrationSlug, "replace_text", {
        description: "Replace matching text everywhere in a Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
            searchText: { type: "string", description: "Exact text to find" },
            replaceText: { type: "string", description: "Replacement text" }
          },
          required: ["documentId", "searchText", "replaceText"]
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "replace", "template"]
      }),
      defineTool(integrationSlug, "append_text", {
        description: "Append plain text to the end of a Google Docs document",
        inputSchema: {
          type: "object",
          properties: {
            documentId: { type: "string", description: "Google Docs document id" },
            text: { type: "string", description: "Plain text to append" },
            prependNewline: { type: "boolean", description: "Whether to prepend a newline before the appended text when the document already has content" }
          },
          required: ["documentId", "text"]
        },
        accessLevel: "write",
        tags: ["google-docs", "documents", "append", "write"]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken5(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "create_document":
        return this.createDocument(args, credentials);
      case "get_document":
        return this.getDocument(args, credentials);
      case "read_document":
        return this.readDocument(args, credentials);
      case "replace_text":
        return this.replaceText(args, credentials);
      case "append_text":
        return this.appendText(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_DRIVE_BASE_URL2}/files?pageSize=1&q=${encodeURIComponent(`mimeType='${GOOGLE_DOCS_MIME_TYPE}'`)}&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async createDocument(args, credentials) {
    const title = requiredString2(args.title, "title");
    const content = optionalString(args.content);
    const parentFolderId = optionalString(args.parentFolderId);
    const createResponse = await this.apiRequest(
      GOOGLE_DOCS_BASE_URL,
      {
        method: "POST",
        body: JSON.stringify({ title })
      },
      credentials
    );
    if (!createResponse.ok) {
      throw await this.createApiError("Failed to create Google Docs document", createResponse);
    }
    const created = await createResponse.json();
    const documentId = requiredString2(created.documentId, "documentId");
    if (content) {
      await this.batchUpdateDocument(
        documentId,
        {
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: content
              }
            }
          ]
        },
        credentials
      );
    }
    if (parentFolderId) {
      await this.moveFileToFolder(documentId, parentFolderId, credentials);
    }
    const fresh = await this.getDocument({ documentId }, credentials);
    return summarizeDocument(fresh);
  }
  async getDocument(args, credentials) {
    const documentId = requiredString2(args.documentId, "documentId");
    const response = await this.apiRequest(
      `${GOOGLE_DOCS_BASE_URL}/${encodeURIComponent(documentId)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Docs document", response);
    }
    return response.json();
  }
  async readDocument(args, credentials) {
    const document = await this.getDocument(args, credentials);
    return summarizeDocument(document);
  }
  async replaceText(args, credentials) {
    const documentId = requiredString2(args.documentId, "documentId");
    const searchText = requiredString2(args.searchText, "searchText");
    const replaceText = requiredString2(args.replaceText, "replaceText");
    const result = await this.batchUpdateDocument(
      documentId,
      {
        requests: [
          {
            replaceAllText: {
              containsText: {
                text: searchText,
                matchCase: true
              },
              replaceText
            }
          }
        ]
      },
      credentials
    );
    const body = optionalObject4(result, "batchUpdateResponse");
    const replies = Array.isArray(body.replies) ? body.replies : [];
    const firstReply = replies[0];
    const occurrencesChanged = isRecordObject4(firstReply) && isRecordObject4(firstReply.replaceAllText) ? optionalNumber2(firstReply.replaceAllText.occurrencesChanged) ?? 0 : 0;
    return {
      ok: true,
      documentId,
      searchText,
      replaceText,
      occurrencesChanged
    };
  }
  async appendText(args, credentials) {
    const documentId = requiredString2(args.documentId, "documentId");
    const text = requiredString2(args.text, "text");
    const document = await this.getDocument({ documentId }, credentials);
    const existingText = documentBodyToPlainText(document);
    const endIndex = Math.max(1, getDocumentEndIndex(document) - 1);
    const prependNewline = args.prependNewline === true && existingText.length > 0;
    const textToInsert = `${prependNewline ? "\n" : ""}${text}`;
    await this.batchUpdateDocument(
      documentId,
      {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: textToInsert
            }
          }
        ]
      },
      credentials
    );
    return {
      ok: true,
      documentId,
      appendedTextLength: text.length,
      insertedLength: textToInsert.length,
      usedEndIndexHint: endIndex
    };
  }
  async batchUpdateDocument(documentId, payload, credentials) {
    const response = await this.apiRequest(
      `${GOOGLE_DOCS_BASE_URL}/${encodeURIComponent(documentId)}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Docs document", response);
    }
    return response.json();
  }
  async moveFileToFolder(fileId, folderId, credentials) {
    const metadataResponse = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL2}/files/${encodeURIComponent(fileId)}?fields=parents&supportsAllDrives=true`,
      { method: "GET" },
      credentials
    );
    if (!metadataResponse.ok) {
      throw await this.createApiError("Failed to fetch Google Docs file parents", metadataResponse);
    }
    const metadata = await metadataResponse.json();
    const parents = Array.isArray(metadata.parents) ? metadata.parents.map((parent) => requiredString2(parent, "parentId")) : [];
    const query = new URLSearchParams({
      addParents: folderId,
      supportsAllDrives: "true",
      fields: "id,parents"
    });
    if (parents.length > 0) {
      query.set("removeParents", parents.join(","));
    }
    const moveResponse = await this.apiRequest(
      `${GOOGLE_DRIVE_BASE_URL2}/files/${encodeURIComponent(fileId)}?${query.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({})
      },
      credentials
    );
    if (!moveResponse.ok) {
      throw await this.createApiError("Failed to move Google Docs document into folder", moveResponse);
    }
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim4(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("google-docs", new GoogleDocsHandler());

// integrations/google-sheets.ts
var GOOGLE_SHEETS_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";
function isRecordObject5(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject5, "isRecordObject");
function safeTrim5(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim5, "safeTrim");
function getAccessToken6(credentials) {
  const token = safeTrim5(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Sheets credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken6, "getAccessToken");
function requiredString3(value, fieldName) {
  const normalized = safeTrim5(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}
__name(requiredString3, "requiredString");
function optionalString2(value) {
  return safeTrim5(value) ?? void 0;
}
__name(optionalString2, "optionalString");
function optionalNumber3(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
}
__name(optionalNumber3, "optionalNumber");
function normalizeRowArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of rows`);
  }
  return value.map((row, rowIndex) => {
    if (!Array.isArray(row)) {
      throw new Error(`${fieldName}[${rowIndex}] must be an array`);
    }
    return row.map((cell, cellIndex) => {
      if (cell === null || typeof cell === "string" || typeof cell === "number" || typeof cell === "boolean") {
        return cell;
      }
      throw new Error(`${fieldName}[${rowIndex}][${cellIndex}] must be a string, number, boolean, or null`);
    });
  });
}
__name(normalizeRowArray, "normalizeRowArray");
function summarizeSpreadsheet(spreadsheet) {
  const spreadsheetId = optionalString2(spreadsheet.spreadsheetId) ?? null;
  const spreadsheetUrl = optionalString2(spreadsheet.spreadsheetUrl) ?? null;
  const properties = isRecordObject5(spreadsheet.properties) ? spreadsheet.properties : null;
  const title = properties ? optionalString2(properties.title) ?? null : null;
  const sheets = Array.isArray(spreadsheet.sheets) ? spreadsheet.sheets.map((sheet) => {
    if (!isRecordObject5(sheet)) {
      return null;
    }
    const sheetProperties = isRecordObject5(sheet.properties) ? sheet.properties : null;
    if (!sheetProperties) {
      return null;
    }
    return {
      sheetId: optionalNumber3(sheetProperties.sheetId) ?? null,
      title: optionalString2(sheetProperties.title) ?? null,
      index: optionalNumber3(sheetProperties.index) ?? null,
      rowCount: isRecordObject5(sheetProperties.gridProperties) ? optionalNumber3(sheetProperties.gridProperties.rowCount) ?? null : null,
      columnCount: isRecordObject5(sheetProperties.gridProperties) ? optionalNumber3(sheetProperties.gridProperties.columnCount) ?? null : null
    };
  }).filter((sheet) => sheet !== null) : [];
  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    sheets
  };
}
__name(summarizeSpreadsheet, "summarizeSpreadsheet");
var GoogleSheetsHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleSheetsHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "create_spreadsheet", {
        description: "Create a new Google Sheets spreadsheet",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Spreadsheet title" },
            sheetTitle: { type: "string", description: "Optional first sheet title" },
            headers: {
              type: "array",
              items: { type: "string" },
              description: "Optional first row values to write as headers"
            }
          },
          required: ["title"]
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "create"]
      }),
      defineTool(integrationSlug, "get_spreadsheet", {
        description: "Get Google Sheets spreadsheet metadata and sheet list",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" }
          },
          required: ["spreadsheetId"]
        },
        accessLevel: "read",
        tags: ["google-sheets", "spreadsheets", "lookup"]
      }),
      defineTool(integrationSlug, "read_sheet", {
        description: "Read values from a Google Sheets range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "A1 notation range such as Sheet1!A1:D20" },
            majorDimension: { type: "string", enum: ["ROWS", "COLUMNS"], description: "How values are grouped" },
            valueRenderOption: {
              type: "string",
              enum: ["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"],
              description: "How returned values should be rendered"
            }
          },
          required: ["spreadsheetId", "range"]
        },
        accessLevel: "read",
        tags: ["google-sheets", "spreadsheets", "read", "values"]
      }),
      defineTool(integrationSlug, "append_rows", {
        description: "Append rows to a Google Sheets worksheet range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "Target A1 notation range such as Sheet1!A:C" },
            rows: {
              type: "array",
              items: {
                type: "array",
                items: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" }
                  ]
                }
              },
              description: "Rows to append"
            },
            valueInputOption: {
              type: "string",
              enum: ["RAW", "USER_ENTERED"],
              description: "How Google Sheets should interpret incoming values"
            },
            insertDataOption: {
              type: "string",
              enum: ["OVERWRITE", "INSERT_ROWS"],
              description: "How appended data should be inserted"
            }
          },
          required: ["spreadsheetId", "range", "rows"]
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "append", "rows"]
      }),
      defineTool(integrationSlug, "update_range", {
        description: "Write values into a Google Sheets range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "Target A1 notation range such as Sheet1!A1:C5" },
            rows: {
              type: "array",
              items: {
                type: "array",
                items: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" }
                  ]
                }
              },
              description: "2D array of values to write"
            },
            valueInputOption: {
              type: "string",
              enum: ["RAW", "USER_ENTERED"],
              description: "How Google Sheets should interpret incoming values"
            }
          },
          required: ["spreadsheetId", "range", "rows"]
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "update", "values"]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken6(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "create_spreadsheet":
        return this.createSpreadsheet(args, credentials);
      case "get_spreadsheet":
        return this.getSpreadsheet(args, credentials);
      case "read_sheet":
        return this.readSheet(args, credentials);
      case "append_rows":
        return this.appendRows(args, credentials);
      case "update_range":
        return this.updateRange(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_SHEETS_BASE_URL}?fields=spreadsheetId`,
        { method: "POST", body: JSON.stringify({ properties: { title: "ClawLink Sheets Auth Check" } }) },
        credentials
      );
      return response.ok || response.status === 400;
    } catch {
      return false;
    }
  }
  async createSpreadsheet(args, credentials) {
    const title = requiredString3(args.title, "title");
    const sheetTitle = optionalString2(args.sheetTitle);
    const headers = Array.isArray(args.headers) ? args.headers.map((value, index) => requiredString3(value, `headers[${index}]`)) : [];
    const createBody = {
      properties: { title }
    };
    if (sheetTitle) {
      createBody.sheets = [
        {
          properties: {
            title: sheetTitle
          }
        }
      ];
    }
    const response = await this.apiRequest(
      GOOGLE_SHEETS_BASE_URL,
      {
        method: "POST",
        body: JSON.stringify(createBody)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Sheets spreadsheet", response);
    }
    const spreadsheet = await response.json();
    const spreadsheetId = requiredString3(spreadsheet.spreadsheetId, "spreadsheetId");
    if (headers.length > 0) {
      const summary = summarizeSpreadsheet(spreadsheet);
      const firstSheetTitle = Array.isArray(summary.sheets) && summary.sheets.length > 0 && isRecordObject5(summary.sheets[0]) ? optionalString2(summary.sheets[0].title) ?? "Sheet1" : "Sheet1";
      await this.updateRange(
        {
          spreadsheetId,
          range: `${firstSheetTitle}!A1`,
          rows: [headers],
          valueInputOption: "RAW"
        },
        credentials
      );
    }
    return summarizeSpreadsheet(spreadsheet);
  }
  async getSpreadsheet(args, credentials) {
    const spreadsheetId = requiredString3(args.spreadsheetId, "spreadsheetId");
    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}?includeGridData=false`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Sheets spreadsheet", response);
    }
    return response.json();
  }
  async readSheet(args, credentials) {
    const spreadsheetId = requiredString3(args.spreadsheetId, "spreadsheetId");
    const range = requiredString3(args.range, "range");
    const majorDimension = optionalString2(args.majorDimension) ?? "ROWS";
    const valueRenderOption = optionalString2(args.valueRenderOption) ?? "FORMATTED_VALUE";
    const query = new URLSearchParams({
      majorDimension,
      valueRenderOption
    });
    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to read Google Sheets range", response);
    }
    const body = await response.json();
    const values = Array.isArray(body.values) ? body.values : [];
    return {
      spreadsheetId,
      range: optionalString2(body.range) ?? range,
      majorDimension: optionalString2(body.majorDimension) ?? majorDimension,
      rowCount: values.length,
      values
    };
  }
  async appendRows(args, credentials) {
    const spreadsheetId = requiredString3(args.spreadsheetId, "spreadsheetId");
    const range = requiredString3(args.range, "range");
    const rows = normalizeRowArray(args.rows, "rows");
    const valueInputOption = optionalString2(args.valueInputOption) ?? "USER_ENTERED";
    const insertDataOption = optionalString2(args.insertDataOption) ?? "INSERT_ROWS";
    const query = new URLSearchParams({
      valueInputOption,
      insertDataOption,
      includeValuesInResponse: "true"
    });
    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?${query.toString()}`,
      {
        method: "POST",
        body: JSON.stringify({
          majorDimension: "ROWS",
          values: rows
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to append rows to Google Sheets", response);
    }
    const body = await response.json();
    const updates = isRecordObject5(body.updates) ? body.updates : null;
    return {
      spreadsheetId,
      tableRange: optionalString2(body.tableRange) ?? null,
      updatedRange: updates ? optionalString2(updates.updatedRange) ?? null : null,
      updatedRows: updates ? optionalNumber3(updates.updatedRows) ?? rows.length : rows.length,
      updatedColumns: updates ? optionalNumber3(updates.updatedColumns) ?? null : null,
      updatedCells: updates ? optionalNumber3(updates.updatedCells) ?? null : null
    };
  }
  async updateRange(args, credentials) {
    const spreadsheetId = requiredString3(args.spreadsheetId, "spreadsheetId");
    const range = requiredString3(args.range, "range");
    const rows = normalizeRowArray(args.rows, "rows");
    const valueInputOption = optionalString2(args.valueInputOption) ?? "USER_ENTERED";
    const query = new URLSearchParams({
      valueInputOption,
      includeValuesInResponse: "true"
    });
    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query.toString()}`,
      {
        method: "PUT",
        body: JSON.stringify({
          majorDimension: "ROWS",
          range,
          values: rows
        })
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Sheets range", response);
    }
    const body = await response.json();
    return {
      spreadsheetId,
      updatedRange: optionalString2(body.updatedRange) ?? range,
      updatedRows: optionalNumber3(body.updatedRows) ?? rows.length,
      updatedColumns: optionalNumber3(body.updatedColumns) ?? null,
      updatedCells: optionalNumber3(body.updatedCells) ?? null
    };
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim5(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("google-sheets", new GoogleSheetsHandler());

// integrations/google-calendar.ts
var GOOGLE_CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3";
function isRecordObject6(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject6, "isRecordObject");
function safeTrim6(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim6, "safeTrim");
function getAccessToken7(credentials) {
  const token = safeTrim6(
    credentials.accessToken ?? credentials.access_token ?? credentials.token
  );
  if (!token) {
    throw new Error("Google Calendar credentials are missing an access token.");
  }
  return token;
}
__name(getAccessToken7, "getAccessToken");
function requiredString4(value, fieldName) {
  const normalized = safeTrim6(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}
__name(requiredString4, "requiredString");
function optionalString3(value) {
  return safeTrim6(value) ?? void 0;
}
__name(optionalString3, "optionalString");
function optionalBoolean2(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return void 0;
}
__name(optionalBoolean2, "optionalBoolean");
function optionalNumber4(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
}
__name(optionalNumber4, "optionalNumber");
function optionalStringList(value, fieldName) {
  if (value === void 0 || value === null) {
    return void 0;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of strings`);
  }
  return value.map((entry, index) => requiredString4(entry, `${fieldName}[${index}]`));
}
__name(optionalStringList, "optionalStringList");
function summarizeCalendar(calendar) {
  return {
    id: optionalString3(calendar.id) ?? null,
    summary: optionalString3(calendar.summary) ?? null,
    description: optionalString3(calendar.description) ?? null,
    timeZone: optionalString3(calendar.timeZone) ?? null,
    primary: typeof calendar.primary === "boolean" ? calendar.primary : null,
    accessRole: optionalString3(calendar.accessRole) ?? null,
    backgroundColor: optionalString3(calendar.backgroundColor) ?? null,
    foregroundColor: optionalString3(calendar.foregroundColor) ?? null
  };
}
__name(summarizeCalendar, "summarizeCalendar");
function summarizeEvent(event) {
  const start = isRecordObject6(event.start) ? event.start : null;
  const end = isRecordObject6(event.end) ? event.end : null;
  const creator = isRecordObject6(event.creator) ? event.creator : null;
  const organizer = isRecordObject6(event.organizer) ? event.organizer : null;
  const attendees = Array.isArray(event.attendees) ? event.attendees.map((attendee) => {
    if (!isRecordObject6(attendee)) {
      return null;
    }
    return {
      email: optionalString3(attendee.email) ?? null,
      displayName: optionalString3(attendee.displayName) ?? null,
      responseStatus: optionalString3(attendee.responseStatus) ?? null,
      optional: typeof attendee.optional === "boolean" ? attendee.optional : null
    };
  }).filter((attendee) => attendee !== null) : [];
  return {
    id: optionalString3(event.id) ?? null,
    status: optionalString3(event.status) ?? null,
    htmlLink: optionalString3(event.htmlLink) ?? null,
    summary: optionalString3(event.summary) ?? null,
    description: optionalString3(event.description) ?? null,
    location: optionalString3(event.location) ?? null,
    start: start ? {
      dateTime: optionalString3(start.dateTime) ?? null,
      date: optionalString3(start.date) ?? null,
      timeZone: optionalString3(start.timeZone) ?? null
    } : null,
    end: end ? {
      dateTime: optionalString3(end.dateTime) ?? null,
      date: optionalString3(end.date) ?? null,
      timeZone: optionalString3(end.timeZone) ?? null
    } : null,
    created: optionalString3(event.created) ?? null,
    updated: optionalString3(event.updated) ?? null,
    recurringEventId: optionalString3(event.recurringEventId) ?? null,
    creator: creator ? {
      email: optionalString3(creator.email) ?? null,
      displayName: optionalString3(creator.displayName) ?? null
    } : null,
    organizer: organizer ? {
      email: optionalString3(organizer.email) ?? null,
      displayName: optionalString3(organizer.displayName) ?? null
    } : null,
    attendees
  };
}
__name(summarizeEvent, "summarizeEvent");
function buildEventTime(args, prefix) {
  const dateTime = optionalString3(args[`${prefix}DateTime`]);
  const date = optionalString3(args[`${prefix}Date`]);
  const timeZone = optionalString3(args[`${prefix}TimeZone`]);
  if (!dateTime && !date) {
    throw new Error(`${prefix}DateTime or ${prefix}Date is required`);
  }
  if (dateTime && date) {
    throw new Error(`Provide either ${prefix}DateTime or ${prefix}Date, not both`);
  }
  const result = {};
  if (dateTime) {
    result.dateTime = dateTime;
  }
  if (date) {
    result.date = date;
  }
  if (timeZone) {
    result.timeZone = timeZone;
  }
  return result;
}
__name(buildEventTime, "buildEventTime");
function buildAttendees(value) {
  const emails = optionalStringList(value, "attendees");
  return emails?.map((email) => ({ email }));
}
__name(buildAttendees, "buildAttendees");
var GoogleCalendarHandler = class extends BaseIntegration {
  static {
    __name(this, "GoogleCalendarHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "list_calendars", {
        description: "List Google Calendars available to the connected account",
        inputSchema: {
          type: "object",
          properties: {}
        },
        accessLevel: "read",
        tags: ["google-calendar", "calendars", "list"]
      }),
      defineTool(integrationSlug, "get_calendar", {
        description: "Get Google Calendar metadata by calendar id",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" }
          },
          required: ["calendarId"]
        },
        accessLevel: "read",
        tags: ["google-calendar", "calendars", "lookup"]
      }),
      defineTool(integrationSlug, "list_events", {
        description: "List events from a Google Calendar within an optional time window",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            timeMin: { type: "string", description: "Optional ISO timestamp lower bound" },
            timeMax: { type: "string", description: "Optional ISO timestamp upper bound" },
            q: { type: "string", description: "Optional free-text search query" },
            maxResults: { type: "number", description: "Optional result limit" },
            singleEvents: { type: "boolean", description: "Whether to expand recurring events into instances" },
            orderBy: { type: "string", enum: ["startTime", "updated"], description: "Optional event ordering" }
          },
          required: ["calendarId"]
        },
        accessLevel: "read",
        tags: ["google-calendar", "events", "list"]
      }),
      defineTool(integrationSlug, "get_event", {
        description: "Get a Google Calendar event by event id",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" }
          },
          required: ["calendarId", "eventId"]
        },
        accessLevel: "read",
        tags: ["google-calendar", "events", "lookup"]
      }),
      defineTool(integrationSlug, "create_event", {
        description: "Create a Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            summary: { type: "string", description: "Event title" },
            description: { type: "string", description: "Optional event description" },
            location: { type: "string", description: "Optional event location" },
            startDateTime: { type: "string", description: "ISO datetime for timed events" },
            startDate: { type: "string", description: "All-day start date in YYYY-MM-DD format" },
            startTimeZone: { type: "string", description: "Optional timezone for the start value" },
            endDateTime: { type: "string", description: "ISO datetime for timed events" },
            endDate: { type: "string", description: "All-day end date in YYYY-MM-DD format" },
            endTimeZone: { type: "string", description: "Optional timezone for the end value" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Optional attendee email addresses"
            }
          },
          required: ["calendarId", "summary"]
        },
        accessLevel: "write",
        tags: ["google-calendar", "events", "create"]
      }),
      defineTool(integrationSlug, "update_event", {
        description: "Update fields on an existing Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" },
            summary: { type: "string", description: "Updated event title" },
            description: { type: "string", description: "Updated event description" },
            location: { type: "string", description: "Updated event location" },
            startDateTime: { type: "string", description: "Updated ISO datetime for timed events" },
            startDate: { type: "string", description: "Updated all-day start date in YYYY-MM-DD format" },
            startTimeZone: { type: "string", description: "Optional timezone for the start value" },
            endDateTime: { type: "string", description: "Updated ISO datetime for timed events" },
            endDate: { type: "string", description: "Updated all-day end date in YYYY-MM-DD format" },
            endTimeZone: { type: "string", description: "Optional timezone for the end value" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Optional full attendee email list to replace the current attendees"
            }
          },
          required: ["calendarId", "eventId"]
        },
        accessLevel: "write",
        tags: ["google-calendar", "events", "update"]
      }),
      defineTool(integrationSlug, "delete_event", {
        description: "Delete a Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" },
            sendUpdates: {
              type: "string",
              enum: ["all", "externalOnly", "none"],
              description: "Optional attendee notification behavior"
            }
          },
          required: ["calendarId", "eventId"]
        },
        accessLevel: "destructive",
        tags: ["google-calendar", "events", "delete"]
      })
    ];
  }
  getHeaders(credentials) {
    return {
      Authorization: `Bearer ${getAccessToken7(credentials)}`,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "list_calendars":
        return this.listCalendars(credentials);
      case "get_calendar":
        return this.getCalendar(args, credentials);
      case "list_events":
        return this.listEvents(args, credentials);
      case "get_event":
        return this.getEvent(args, credentials);
      case "create_event":
        return this.createEvent(args, credentials);
      case "update_event":
        return this.updateEvent(args, credentials);
      case "delete_event":
        return this.deleteEvent(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_CALENDAR_BASE_URL}/users/me/calendarList?maxResults=1`,
        { method: "GET" },
        credentials
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async listCalendars(credentials) {
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/users/me/calendarList`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Calendars", response);
    }
    const body = await response.json();
    const items = Array.isArray(body.items) ? body.items : [];
    return {
      count: items.length,
      calendars: items.filter(isRecordObject6).map((calendar) => summarizeCalendar(calendar))
    };
  }
  async getCalendar(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Calendar", response);
    }
    const body = await response.json();
    return summarizeCalendar(body);
  }
  async listEvents(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const query = new URLSearchParams();
    const timeMin = optionalString3(args.timeMin);
    const timeMax = optionalString3(args.timeMax);
    const q = optionalString3(args.q);
    const maxResults = optionalNumber4(args.maxResults);
    const singleEvents = optionalBoolean2(args.singleEvents);
    const orderBy = optionalString3(args.orderBy);
    if (timeMin) query.set("timeMin", timeMin);
    if (timeMax) query.set("timeMax", timeMax);
    if (q) query.set("q", q);
    if (maxResults !== void 0) query.set("maxResults", String(maxResults));
    if (singleEvents !== void 0) query.set("singleEvents", String(singleEvents));
    if (orderBy) query.set("orderBy", orderBy);
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events?${query.toString()}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Calendar events", response);
    }
    const body = await response.json();
    const items = Array.isArray(body.items) ? body.items : [];
    return {
      calendarId,
      count: items.length,
      nextPageToken: optionalString3(body.nextPageToken) ?? null,
      nextSyncToken: optionalString3(body.nextSyncToken) ?? null,
      events: items.filter(isRecordObject6).map((event) => summarizeEvent(event))
    };
  }
  async getEvent(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const eventId = requiredString4(args.eventId, "eventId");
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Calendar event", response);
    }
    const body = await response.json();
    return summarizeEvent(body);
  }
  async createEvent(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const summary = requiredString4(args.summary, "summary");
    const body = {
      summary,
      start: buildEventTime(args, "start"),
      end: buildEventTime(args, "end")
    };
    const description = optionalString3(args.description);
    const location = optionalString3(args.location);
    const attendees = buildAttendees(args.attendees);
    if (description) body.description = description;
    if (location) body.location = location;
    if (attendees) body.attendees = attendees;
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        body: JSON.stringify(body)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Calendar event", response);
    }
    const event = await response.json();
    return summarizeEvent(event);
  }
  async updateEvent(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const eventId = requiredString4(args.eventId, "eventId");
    const body = {};
    const summary = optionalString3(args.summary);
    const description = optionalString3(args.description);
    const location = optionalString3(args.location);
    const attendees = buildAttendees(args.attendees);
    if (summary) body.summary = summary;
    if (description) body.description = description;
    if (location) body.location = location;
    if (attendees) body.attendees = attendees;
    const hasStartInputs = [args.startDateTime, args.startDate, args.startTimeZone].some((value) => value !== void 0);
    const hasEndInputs = [args.endDateTime, args.endDate, args.endTimeZone].some((value) => value !== void 0);
    if (hasStartInputs) {
      body.start = buildEventTime(args, "start");
    }
    if (hasEndInputs) {
      body.end = buildEventTime(args, "end");
    }
    if (Object.keys(body).length === 0) {
      throw new Error("At least one updatable field is required");
    }
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Calendar event", response);
    }
    const event = await response.json();
    return summarizeEvent(event);
  }
  async deleteEvent(args, credentials) {
    const calendarId = requiredString4(args.calendarId, "calendarId");
    const eventId = requiredString4(args.eventId, "eventId");
    const sendUpdates = optionalString3(args.sendUpdates);
    const query = new URLSearchParams();
    if (sendUpdates) {
      query.set("sendUpdates", sendUpdates);
    }
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query.toString() ? `?${query.toString()}` : ""}`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Calendar event", response);
    }
    return {
      deleted: true,
      calendarId,
      eventId,
      sendUpdates: sendUpdates ?? null
    };
  }
  async createApiError(prefix, response) {
    const body = await response.json().catch(() => null);
    const status = safeTrim6(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== void 0 ? String(body.error.code) : void 0;
    const detail = status ? `${status}: ${message}` : message;
    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("google-calendar", new GoogleCalendarHandler());

// integrations/motion.ts
var MOTION_BASE_URL = "https://api.usemotion.com/v1";
function safeTrim7(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim7, "safeTrim");
function optionalBoolean3(value) {
  return typeof value === "boolean" ? value : void 0;
}
__name(optionalBoolean3, "optionalBoolean");
function optionalStringArray(value, fieldName) {
  if (value === void 0 || value === null) {
    return void 0;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of strings`);
  }
  const normalized = value.map((entry) => safeTrim7(entry)).filter((entry) => Boolean(entry));
  return normalized.length > 0 ? normalized : void 0;
}
__name(optionalStringArray, "optionalStringArray");
var MotionHandler = class extends BaseIntegration {
  static {
    __name(this, "MotionHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "get_me", {
        description: "List Motion users for a workspace or team so you can identify the current account and available assignees",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Optional Motion workspace id"
            },
            teamId: {
              type: "string",
              description: "Optional Motion team id"
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response"
            }
          }
        },
        accessLevel: "read",
        tags: ["motion", "users", "assignees"],
        whenToUse: [
          "User wants to know which Motion account members are available.",
          "You need a user id before assigning a task."
        ],
        examples: [
          {
            user: "show motion users in workspace ws_123",
            args: { workspaceId: "ws_123" }
          }
        ],
        followups: [
          "Offer to use one of the returned user ids for task assignment."
        ]
      }),
      defineTool(integrationSlug, "list_workspaces", {
        description: "List Motion workspaces available to the connected account",
        inputSchema: {
          type: "object",
          properties: {
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response"
            }
          }
        },
        accessLevel: "read",
        tags: ["motion", "workspaces", "projects"],
        whenToUse: [
          "User wants to see which Motion workspace(s) are available.",
          "You need a workspace id before listing projects or creating tasks."
        ],
        examples: [
          {
            user: "what motion workspaces can you access",
            args: {}
          }
        ],
        followups: [
          "Offer to list projects for a selected workspace."
        ]
      }),
      defineTool(integrationSlug, "list_projects", {
        description: "List Motion projects for a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id"
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response"
            }
          },
          required: ["workspaceId"]
        },
        accessLevel: "read",
        tags: ["motion", "projects", "workspace"],
        whenToUse: [
          "User wants to browse Motion projects.",
          "You need a project id before creating or filtering tasks."
        ],
        askBefore: [
          "Ask which workspace to use if there are multiple workspaces and none is specified."
        ],
        examples: [
          {
            user: "show motion projects in workspace abc123",
            args: { workspaceId: "abc123" }
          }
        ],
        followups: [
          "Offer to list tasks for one of the returned projects."
        ]
      }),
      defineTool(integrationSlug, "list_tasks", {
        description: "List Motion tasks with optional workspace, project, assignee, status, label, or name filters",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Optional Motion workspace id. If omitted, Motion returns tasks across accessible workspaces."
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id"
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id"
            },
            status: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of task statuses to include"
            },
            includeAllStatuses: {
              type: "boolean",
              description: "Include all statuses instead of filtering to active ones"
            },
            label: {
              type: "string",
              description: "Optional label filter"
            },
            name: {
              type: "string",
              description: "Optional case-insensitive text search against task names"
            },
            cursor: {
              type: "string",
              description: "Pagination cursor from a previous response"
            }
          }
        },
        accessLevel: "read",
        tags: ["motion", "tasks", "projects"],
        whenToUse: [
          "User wants to review Motion tasks.",
          "You need to identify a task before opening or updating it elsewhere."
        ],
        safeDefaults: {
          includeAllStatuses: false
        },
        examples: [
          {
            user: "show my motion tasks for project proj_123",
            args: { projectId: "proj_123" }
          }
        ],
        followups: [
          "Offer to fetch a specific task by id.",
          "Offer to create a new task in a project or workspace."
        ]
      }),
      defineTool(integrationSlug, "get_task", {
        description: "Get a single Motion task by id",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id"
            }
          },
          required: ["taskId"]
        },
        accessLevel: "read",
        tags: ["motion", "task", "lookup"],
        whenToUse: [
          "User wants the details of a specific Motion task.",
          "A prior list step returned a task id and the next step is to inspect it."
        ],
        askBefore: [
          "Ask which task they mean if multiple tasks could match."
        ],
        examples: [
          {
            user: "open that motion task",
            args: { taskId: "task_123" }
          }
        ],
        followups: [
          "Offer to summarize the task or create a related task."
        ]
      }),
      defineTool(integrationSlug, "update_task", {
        description: "Update a Motion task",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id"
            },
            workspaceId: {
              type: "string",
              description: "Motion workspace id"
            },
            name: {
              type: "string",
              description: "Optional updated task title"
            },
            description: {
              type: "string",
              description: "Optional updated markdown description"
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id"
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime"
            },
            duration: {
              type: "string",
              description: 'Optional duration in minutes as a string or values like "NONE" or "REMINDER"'
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion task priority"
            },
            status: {
              type: "string",
              description: "Optional Motion status name or id depending on workspace config"
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id"
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names"
            },
            startOn: {
              type: "string",
              description: "Optional YYYY-MM-DD date when the task should start"
            },
            deadlineType: {
              type: "string",
              enum: ["HARD", "SOFT", "NONE"],
              description: "Optional Motion deadline type"
            },
            autoScheduled: {
              type: ["object", "null"],
              description: "Optional Motion autoScheduled object, or null to disable auto scheduling"
            }
          },
          required: ["taskId", "workspaceId"]
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "update"],
        whenToUse: [
          "User explicitly asks to update a Motion task.",
          "User wants to rename, reschedule, reassign, or reprioritize a task."
        ],
        askBefore: [
          "Ask which task to update if there is any ambiguity."
        ],
        examples: [
          {
            user: "move that task to tomorrow and assign it to me",
            args: {
              taskId: "task_123",
              workspaceId: "ws_123",
              dueDate: "2026-04-21T17:00:00Z",
              assigneeId: "user_123"
            }
          }
        ]
      }),
      defineTool(integrationSlug, "move_task", {
        description: "Move a Motion task to another project or status",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id"
            },
            workspaceId: {
              type: "string",
              description: "Motion workspace id"
            },
            projectId: {
              type: "string",
              description: "Destination Motion project id"
            },
            status: {
              type: "string",
              description: "Destination Motion status name or id"
            }
          },
          required: ["taskId", "workspaceId"]
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "move"],
        whenToUse: [
          "User explicitly asks to move a task to another project or workflow status."
        ],
        askBefore: [
          "Ask for the destination project or status if neither is provided."
        ]
      }),
      defineTool(integrationSlug, "delete_task", {
        description: "Delete a Motion task by id",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Motion task id"
            }
          },
          required: ["taskId"]
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "delete"],
        whenToUse: [
          "User explicitly asks to delete a Motion task."
        ],
        askBefore: [
          "Confirm before deleting a task unless the user was already explicit."
        ]
      }),
      defineTool(integrationSlug, "get_project", {
        description: "Get a single Motion project by id",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "Motion project id"
            }
          },
          required: ["projectId"]
        },
        accessLevel: "read",
        tags: ["motion", "project", "lookup"]
      }),
      defineTool(integrationSlug, "create_project", {
        description: "Create a Motion project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id"
            },
            name: {
              type: "string",
              description: "Project name"
            },
            description: {
              type: "string",
              description: "Optional HTML or rich text description"
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime"
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion project priority"
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names"
            },
            projectDefinitionId: {
              type: "string",
              description: "Optional Motion project definition/template id"
            },
            stages: {
              type: "array",
              items: { type: "object" },
              description: "Optional raw Motion stages array; required if projectDefinitionId is provided"
            }
          },
          required: ["workspaceId", "name"]
        },
        accessLevel: "write",
        tags: ["motion", "projects", "create"]
      }),
      defineTool(integrationSlug, "create_task", {
        description: "Create a Motion task",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "Motion workspace id"
            },
            name: {
              type: "string",
              description: "Task title"
            },
            description: {
              type: "string",
              description: "Optional markdown description"
            },
            projectId: {
              type: "string",
              description: "Optional Motion project id"
            },
            dueDate: {
              type: "string",
              description: "Optional ISO 8601 due date or datetime"
            },
            duration: {
              type: "string",
              description: 'Optional duration in minutes as a string or values like "NONE" or "REMINDER"'
            },
            priority: {
              type: "string",
              enum: ["ASAP", "HIGH", "MEDIUM", "LOW"],
              description: "Optional Motion task priority"
            },
            status: {
              type: "string",
              description: "Optional Motion status name or id depending on workspace config"
            },
            assigneeId: {
              type: "string",
              description: "Optional Motion assignee user id"
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of label names"
            },
            startOn: {
              type: "string",
              description: "Optional YYYY-MM-DD date when the task should start"
            },
            deadlineType: {
              type: "string",
              enum: ["HARD", "SOFT", "NONE"],
              description: "Optional Motion deadline type"
            },
            autoScheduled: {
              type: "object",
              description: "Optional raw Motion autoScheduled object"
            }
          },
          required: ["workspaceId", "name"]
        },
        accessLevel: "write",
        tags: ["motion", "tasks", "create"],
        whenToUse: [
          "User explicitly asks to create a Motion task."
        ],
        askBefore: [
          "Ask for missing workspace or title before creating the task.",
          "Confirm due date or scheduling details if the request sounds ambiguous."
        ],
        examples: [
          {
            user: "create a motion task to review the api docs tomorrow",
            args: {
              workspaceId: "ws_123",
              name: "Review the API docs",
              dueDate: "2026-04-21T17:00:00Z",
              priority: "HIGH"
            }
          }
        ],
        followups: [
          "Offer to list tasks in the same project or workspace to confirm where it landed."
        ]
      })
    ];
  }
  getHeaders(credentials) {
    const apiKey = safeTrim7(credentials.apiKey);
    if (!apiKey) {
      throw new Error("Motion credentials are missing apiKey");
    }
    return {
      "X-API-Key": apiKey,
      "Content-Type": "application/json"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "get_me":
        return this.getMe(args, credentials);
      case "list_workspaces":
        return this.listWorkspaces(args, credentials);
      case "list_projects":
        return this.listProjects(args, credentials);
      case "list_tasks":
        return this.listTasks(args, credentials);
      case "get_task":
        return this.getTask(args, credentials);
      case "update_task":
        return this.updateTask(args, credentials);
      case "move_task":
        return this.moveTask(args, credentials);
      case "delete_task":
        return this.deleteTask(args, credentials);
      case "get_project":
        return this.getProject(args, credentials);
      case "create_project":
        return this.createProject(args, credentials);
      case "create_task":
        return this.createTask(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.apiRequest(`${MOTION_BASE_URL}/workspaces`, { method: "GET" }, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }
  async getMe(args, credentials) {
    const query = this.buildQueryString({
      workspaceId: safeTrim7(args.workspaceId),
      teamId: safeTrim7(args.teamId),
      cursor: safeTrim7(args.cursor)
    });
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/users${query ? `?${query}` : ""}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion users", response);
    }
    return response.json();
  }
  async listWorkspaces(args, credentials) {
    const query = this.buildQueryString({
      cursor: safeTrim7(args.cursor)
    });
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/workspaces${query ? `?${query}` : ""}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion workspaces", response);
    }
    return response.json();
  }
  async listProjects(args, credentials) {
    const workspaceId = safeTrim7(args.workspaceId);
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    const query = this.buildQueryString({
      workspaceId,
      cursor: safeTrim7(args.cursor)
    });
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects?${query}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion projects", response);
    }
    return response.json();
  }
  async listTasks(args, credentials) {
    const status = optionalStringArray(args.status, "status");
    const includeAllStatuses = optionalBoolean3(args.includeAllStatuses);
    if (status && includeAllStatuses) {
      throw new Error("Use either status or includeAllStatuses, not both");
    }
    const queryParams = new URLSearchParams();
    const maybeSet = /* @__PURE__ */ __name((key, value) => {
      if (value) {
        queryParams.set(key, value);
      }
    }, "maybeSet");
    maybeSet("workspaceId", safeTrim7(args.workspaceId));
    maybeSet("projectId", safeTrim7(args.projectId));
    maybeSet("assigneeId", safeTrim7(args.assigneeId));
    maybeSet("label", safeTrim7(args.label));
    maybeSet("name", safeTrim7(args.name));
    maybeSet("cursor", safeTrim7(args.cursor));
    if (status) {
      for (const entry of status) {
        queryParams.append("status", entry);
      }
    }
    if (includeAllStatuses !== void 0) {
      queryParams.set("includeAllStatuses", String(includeAllStatuses));
    }
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks${queryParams.size > 0 ? `?${queryParams.toString()}` : ""}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Motion tasks", response);
    }
    return response.json();
  }
  async getTask(args, credentials) {
    const taskId = safeTrim7(args.taskId);
    if (!taskId) {
      throw new Error("taskId is required");
    }
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Motion task", response);
    }
    return response.json();
  }
  async updateTask(args, credentials) {
    const taskId = safeTrim7(args.taskId);
    const workspaceId = safeTrim7(args.workspaceId);
    if (!taskId) {
      throw new Error("taskId is required");
    }
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    const payload = this.buildTaskPayload(args, { workspaceId, requireName: false });
    if (Object.keys(payload).length <= 1) {
      throw new Error("At least one task field must be provided to update");
    }
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Motion task", response);
    }
    return response.json();
  }
  async moveTask(args, credentials) {
    const taskId = safeTrim7(args.taskId);
    const workspaceId = safeTrim7(args.workspaceId);
    const projectId = safeTrim7(args.projectId);
    const status = safeTrim7(args.status);
    if (!taskId) {
      throw new Error("taskId is required");
    }
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    if (!projectId && !status) {
      throw new Error("Provide projectId or status to move the task");
    }
    const payload = { workspaceId };
    if (projectId) payload.projectId = projectId;
    if (status) payload.status = status;
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to move Motion task", response);
    }
    return response.json();
  }
  async deleteTask(args, credentials) {
    const taskId = safeTrim7(args.taskId);
    if (!taskId) {
      throw new Error("taskId is required");
    }
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks/${encodeURIComponent(taskId)}`,
      { method: "DELETE" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to delete Motion task", response);
    }
    return {
      success: true,
      deleted: true,
      taskId,
      status: response.status
    };
  }
  async getProject(args, credentials) {
    const projectId = safeTrim7(args.projectId);
    if (!projectId) {
      throw new Error("projectId is required");
    }
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects/${encodeURIComponent(projectId)}`,
      { method: "GET" },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Motion project", response);
    }
    return response.json();
  }
  async createProject(args, credentials) {
    const workspaceId = safeTrim7(args.workspaceId);
    const name = safeTrim7(args.name);
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    if (!name) {
      throw new Error("name is required");
    }
    const payload = { workspaceId, name };
    const description = safeTrim7(args.description);
    const dueDate = safeTrim7(args.dueDate);
    const priority = safeTrim7(args.priority);
    const projectDefinitionId = safeTrim7(args.projectDefinitionId);
    const labels = optionalStringArray(args.labels, "labels");
    if (description) payload.description = description;
    if (dueDate) payload.dueDate = dueDate;
    if (priority) payload.priority = priority;
    if (labels) payload.labels = labels;
    if (projectDefinitionId) payload.projectDefinitionId = projectDefinitionId;
    if (Array.isArray(args.stages)) payload.stages = args.stages;
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/projects`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Motion project", response);
    }
    return response.json();
  }
  async createTask(args, credentials) {
    const workspaceId = safeTrim7(args.workspaceId);
    const name = safeTrim7(args.name);
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    if (!name) {
      throw new Error("name is required");
    }
    const payload = this.buildTaskPayload(args, { workspaceId, requireName: true });
    const response = await this.apiRequest(
      `${MOTION_BASE_URL}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Motion task", response);
    }
    return response.json();
  }
  buildTaskPayload(args, options) {
    const payload = {
      workspaceId: options.workspaceId
    };
    const name = safeTrim7(args.name);
    if (options.requireName && !name) {
      throw new Error("name is required");
    }
    if (name) payload.name = name;
    const description = safeTrim7(args.description);
    const projectId = safeTrim7(args.projectId);
    const dueDate = safeTrim7(args.dueDate);
    const duration = safeTrim7(args.duration);
    const priority = safeTrim7(args.priority);
    const status = safeTrim7(args.status);
    const assigneeId = safeTrim7(args.assigneeId);
    const startOn = safeTrim7(args.startOn);
    const deadlineType = safeTrim7(args.deadlineType);
    const labels = optionalStringArray(args.labels, "labels");
    if (description) payload.description = description;
    if (projectId) payload.projectId = projectId;
    if (dueDate) payload.dueDate = dueDate;
    if (duration) payload.duration = /^\d+$/.test(duration) ? Number.parseInt(duration, 10) : duration;
    if (priority) payload.priority = priority;
    if (status) payload.status = status;
    if (assigneeId) payload.assigneeId = assigneeId;
    if (labels) payload.labels = labels;
    if (startOn) payload.startOn = startOn;
    if (deadlineType) payload.deadlineType = deadlineType;
    if (args.autoScheduled === null) {
      payload.autoScheduled = null;
    } else if (args.autoScheduled && typeof args.autoScheduled === "object" && !Array.isArray(args.autoScheduled)) {
      payload.autoScheduled = args.autoScheduled;
    }
    return payload;
  }
  async createApiError(prefix, response) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? payload?.error ?? response.statusText;
    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code: response.statusText
    });
  }
};
registerHandler("motion", new MotionHandler());

// integrations/twilio.ts
var TWILIO_BASE_URL = "https://api.twilio.com/2010-04-01";
function safeTrim8(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
__name(safeTrim8, "safeTrim");
function isRecordObject7(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject7, "isRecordObject");
function optionalBoolean4(value) {
  return typeof value === "boolean" ? value : void 0;
}
__name(optionalBoolean4, "optionalBoolean");
function optionalNumber5(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return void 0;
}
__name(optionalNumber5, "optionalNumber");
function requireString(value, fieldName) {
  const normalized = safeTrim8(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}
__name(requireString, "requireString");
function optionalStringArray2(value, fieldName) {
  if (value === void 0 || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((entry, index) => {
    const normalized = safeTrim8(entry);
    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }
    return normalized;
  });
}
__name(optionalStringArray2, "optionalStringArray");
function buildFormBody(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === void 0 || value === null) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== void 0 && item !== null) {
          searchParams.append(key, String(item));
        }
      }
      continue;
    }
    searchParams.set(key, String(value));
  }
  return searchParams.toString();
}
__name(buildFormBody, "buildFormBody");
function formFieldIfProvided(target, field, value) {
  if (value === void 0) {
    return;
  }
  if (typeof value === "string") {
    target[field] = value;
    return;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    target[field] = value;
  }
}
__name(formFieldIfProvided, "formFieldIfProvided");
function summarizeNumberBehavior(phoneNumber) {
  const voiceTarget = phoneNumber.voice_application_sid ? `TwiML app ${phoneNumber.voice_application_sid}` : phoneNumber.voice_url ? `voice webhook ${phoneNumber.voice_url}` : "no voice webhook or TwiML app configured";
  const smsTarget = phoneNumber.sms_application_sid ? `TwiML app ${phoneNumber.sms_application_sid}` : phoneNumber.sms_url ? `SMS webhook ${phoneNumber.sms_url}` : "no SMS webhook or TwiML app configured";
  return `${phoneNumber.phone_number ?? phoneNumber.sid ?? "Number"}: ${voiceTarget}; ${smsTarget}.`;
}
__name(summarizeNumberBehavior, "summarizeNumberBehavior");
var TwilioHandler = class extends BaseIntegration {
  static {
    __name(this, "TwilioHandler");
  }
  getTools(integrationSlug) {
    return [
      defineTool(integrationSlug, "get_account", {
        description: "Get Twilio account details and status",
        inputSchema: { type: "object", properties: {} },
        accessLevel: "read",
        tags: ["twilio", "account", "auth"],
        whenToUse: [
          "Validate that Twilio credentials work.",
          "Inspect the connected Twilio account status and metadata."
        ]
      }),
      defineTool(integrationSlug, "list_phone_numbers", {
        description: "List Twilio incoming phone numbers owned by the account",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Maximum phone numbers to return" },
            pageSize: { type: "number", description: "Twilio page size to request" },
            friendlyName: { type: "string", description: "Optional exact friendly name filter" },
            phoneNumber: { type: "string", description: "Optional exact phone number filter" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "inventory"],
        safeDefaults: {
          limit: 50,
          pageSize: 50
        }
      }),
      defineTool(integrationSlug, "get_phone_number", {
        description: "Get a single Twilio incoming phone number and its configuration",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string", description: "Twilio incoming phone number SID" },
            phoneNumber: { type: "string", description: "Exact E.164 phone number to resolve if SID is not known" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "lookup"]
      }),
      defineTool(integrationSlug, "update_phone_number", {
        description: "Update a Twilio incoming phone number configuration",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            friendlyName: { type: "string" },
            voiceUrl: { type: "string" },
            voiceMethod: { type: "string" },
            voiceFallbackUrl: { type: "string" },
            voiceFallbackMethod: { type: "string" },
            statusCallback: { type: "string" },
            statusCallbackMethod: { type: "string" },
            smsUrl: { type: "string" },
            smsMethod: { type: "string" },
            smsFallbackUrl: { type: "string" },
            smsFallbackMethod: { type: "string" },
            voiceApplicationSid: { type: "string" },
            smsApplicationSid: { type: "string" }
          }
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "routing", "update"],
        askBefore: [
          "Confirm before changing production routing on a live Twilio number unless the user was already explicit."
        ]
      }),
      defineTool(integrationSlug, "bulk_update_phone_numbers", {
        description: "Apply the same configuration changes to multiple Twilio phone numbers",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSids: { type: "array", items: { type: "string" } },
            phoneNumbers: { type: "array", items: { type: "string" } },
            changes: { type: "object", description: "Same writable fields supported by update_phone_number" },
            dryRun: { type: "boolean", description: "Preview matched numbers without applying updates" }
          }
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "bulk", "routing"],
        askBefore: [
          "Prefer a dry run before changing many Twilio numbers at once."
        ]
      }),
      defineTool(integrationSlug, "search_phone_numbers", {
        description: "Search Twilio phone numbers by number, name, capability, or webhook match",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Case-insensitive text match against phone number or friendly name" },
            capability: { type: "string", enum: ["voice", "sms", "mms", "fax"] },
            voiceUrlContains: { type: "string" },
            smsUrlContains: { type: "string" },
            twimlAppSid: { type: "string", description: "Match either voice or SMS TwiML application SID" },
            limit: { type: "number" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "search"],
        safeDefaults: {
          limit: 50
        }
      }),
      defineTool(integrationSlug, "set_voice_webhook", {
        description: "Set the incoming voice webhook for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            voiceUrl: { type: "string", description: "Voice webhook URL" },
            voiceMethod: { type: "string", description: "GET or POST" },
            voiceFallbackUrl: { type: "string" },
            voiceFallbackMethod: { type: "string" },
            statusCallback: { type: "string" },
            statusCallbackMethod: { type: "string" }
          },
          required: ["voiceUrl"]
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "voice", "webhook"]
      }),
      defineTool(integrationSlug, "set_sms_webhook", {
        description: "Set the incoming SMS webhook for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            smsUrl: { type: "string", description: "SMS webhook URL" },
            smsMethod: { type: "string", description: "GET or POST" },
            smsFallbackUrl: { type: "string" },
            smsFallbackMethod: { type: "string" }
          },
          required: ["smsUrl"]
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "sms", "webhook"]
      }),
      defineTool(integrationSlug, "assign_twiml_app", {
        description: "Assign a TwiML application to a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            voiceApplicationSid: { type: "string" },
            smsApplicationSid: { type: "string" }
          }
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "twiml", "routing"]
      }),
      defineTool(integrationSlug, "send_sms", {
        description: "Send an SMS through Twilio",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Twilio phone number to send from" },
            to: { type: "string", description: "Destination phone number" },
            body: { type: "string", description: "SMS body text" },
            mediaUrls: { type: "array", items: { type: "string" }, description: "Optional media URLs for MMS" },
            statusCallback: { type: "string" }
          },
          required: ["from", "to", "body"]
        },
        accessLevel: "write",
        tags: ["twilio", "messages", "sms"]
      }),
      defineTool(integrationSlug, "list_messages", {
        description: "List Twilio messages",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            status: { type: "string" },
            pageSize: { type: "number" },
            limit: { type: "number" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "messages", "sms"],
        safeDefaults: {
          limit: 50,
          pageSize: 50
        }
      }),
      defineTool(integrationSlug, "get_message", {
        description: "Get a specific Twilio message",
        inputSchema: {
          type: "object",
          properties: {
            messageSid: { type: "string", description: "Twilio message SID" }
          },
          required: ["messageSid"]
        },
        accessLevel: "read",
        tags: ["twilio", "messages", "lookup"]
      }),
      defineTool(integrationSlug, "make_call", {
        description: "Create an outbound Twilio call",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Twilio phone number to call from" },
            to: { type: "string", description: "Destination phone number" },
            url: { type: "string", description: "TwiML webhook URL" },
            twiml: { type: "string", description: "Inline TwiML to execute" },
            applicationSid: { type: "string", description: "Optional TwiML application SID" },
            statusCallback: { type: "string" },
            record: { type: "boolean" }
          },
          required: ["from", "to"]
        },
        accessLevel: "write",
        tags: ["twilio", "calls", "voice"],
        askBefore: [
          "Confirm before placing real outbound calls unless the user was already explicit."
        ]
      }),
      defineTool(integrationSlug, "list_calls", {
        description: "List Twilio calls",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            status: { type: "string" },
            pageSize: { type: "number" },
            limit: { type: "number" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "calls", "voice"],
        safeDefaults: {
          limit: 50,
          pageSize: 50
        }
      }),
      defineTool(integrationSlug, "get_call", {
        description: "Get a specific Twilio call",
        inputSchema: {
          type: "object",
          properties: {
            callSid: { type: "string", description: "Twilio call SID" }
          },
          required: ["callSid"]
        },
        accessLevel: "read",
        tags: ["twilio", "calls", "lookup"]
      }),
      defineTool(integrationSlug, "get_number_behavior", {
        description: "Summarize the effective voice and SMS behavior for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" }
          }
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "routing", "summary"]
      })
    ];
  }
  getHeaders() {
    return {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }
  async execute(action, args, credentials) {
    switch (action) {
      case "get_account":
        return this.getAccount(credentials);
      case "list_phone_numbers":
        return this.listPhoneNumbers(args, credentials);
      case "get_phone_number":
        return this.getPhoneNumber(args, credentials);
      case "update_phone_number":
        return this.updatePhoneNumber(args, credentials);
      case "bulk_update_phone_numbers":
        return this.bulkUpdatePhoneNumbers(args, credentials);
      case "search_phone_numbers":
        return this.searchPhoneNumbers(args, credentials);
      case "set_voice_webhook":
        return this.updatePhoneNumber(
          {
            ...args,
            voiceUrl: requireString(args.voiceUrl, "voiceUrl")
          },
          credentials
        );
      case "set_sms_webhook":
        return this.updatePhoneNumber(
          {
            ...args,
            smsUrl: requireString(args.smsUrl, "smsUrl")
          },
          credentials
        );
      case "assign_twiml_app":
        return this.updatePhoneNumber(args, credentials);
      case "send_sms":
        return this.sendSms(args, credentials);
      case "list_messages":
        return this.listMessages(args, credentials);
      case "get_message":
        return this.getMessage(args, credentials);
      case "make_call":
        return this.makeCall(args, credentials);
      case "list_calls":
        return this.listCalls(args, credentials);
      case "get_call":
        return this.getCall(args, credentials);
      case "get_number_behavior":
        return this.getNumberBehavior(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  async validateCredentials(credentials) {
    try {
      const response = await this.twilioRequest("GET", "/Accounts.json", void 0, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }
  getCredentials(credentials) {
    return {
      accountSid: requireString(credentials.accountSid, "accountSid"),
      authToken: requireString(credentials.authToken, "authToken")
    };
  }
  async twilioRequest(method, path, params, credentials) {
    const { accountSid, authToken } = this.getCredentials(credentials);
    const headers = new Headers(this.getHeaders());
    headers.set("Authorization", `Basic ${btoa(`${accountSid}:${authToken}`)}`);
    let url = `${TWILIO_BASE_URL}${path}`;
    const init = {
      method,
      headers
    };
    if (method === "GET") {
      const query = buildFormBody(params ?? {});
      if (query) {
        url += `?${query}`;
      }
    } else if (params) {
      init.body = buildFormBody(params);
    }
    return this.apiRequest(url, init, credentials);
  }
  async getAccount(credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest("GET", `/Accounts/${encodeURIComponent(accountSid)}.json`, void 0, credentials);
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio account", response);
    }
    return response.json();
  }
  async listPhoneNumbers(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers.json`,
      {
        PageSize: optionalNumber5(args.pageSize) ?? 50,
        FriendlyName: safeTrim8(args.friendlyName) ?? void 0,
        PhoneNumber: safeTrim8(args.phoneNumber) ?? void 0
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio phone numbers", response);
    }
    const payload = await response.json();
    const limit = optionalNumber5(args.limit) ?? 50;
    return {
      ...payload,
      incoming_phone_numbers: (payload.incoming_phone_numbers ?? []).slice(0, limit)
    };
  }
  async getPhoneNumber(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const sid = await this.resolvePhoneNumberSid(args, credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers/${encodeURIComponent(sid)}.json`,
      void 0,
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio phone number", response);
    }
    return await response.json();
  }
  async updatePhoneNumber(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const sid = await this.resolvePhoneNumberSid(args, credentials);
    const params = {};
    formFieldIfProvided(params, "FriendlyName", safeTrim8(args.friendlyName) ?? void 0);
    formFieldIfProvided(params, "VoiceUrl", safeTrim8(args.voiceUrl) ?? void 0);
    formFieldIfProvided(params, "VoiceMethod", safeTrim8(args.voiceMethod) ?? void 0);
    formFieldIfProvided(params, "VoiceFallbackUrl", safeTrim8(args.voiceFallbackUrl) ?? void 0);
    formFieldIfProvided(params, "VoiceFallbackMethod", safeTrim8(args.voiceFallbackMethod) ?? void 0);
    formFieldIfProvided(params, "StatusCallback", safeTrim8(args.statusCallback) ?? void 0);
    formFieldIfProvided(params, "StatusCallbackMethod", safeTrim8(args.statusCallbackMethod) ?? void 0);
    formFieldIfProvided(params, "SmsUrl", safeTrim8(args.smsUrl) ?? void 0);
    formFieldIfProvided(params, "SmsMethod", safeTrim8(args.smsMethod) ?? void 0);
    formFieldIfProvided(params, "SmsFallbackUrl", safeTrim8(args.smsFallbackUrl) ?? void 0);
    formFieldIfProvided(params, "SmsFallbackMethod", safeTrim8(args.smsFallbackMethod) ?? void 0);
    formFieldIfProvided(params, "VoiceApplicationSid", safeTrim8(args.voiceApplicationSid) ?? void 0);
    formFieldIfProvided(params, "SmsApplicationSid", safeTrim8(args.smsApplicationSid) ?? void 0);
    if (Object.keys(params).length === 0) {
      throw new Error("At least one Twilio phone number field must be provided to update");
    }
    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers/${encodeURIComponent(sid)}.json`,
      params,
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to update Twilio phone number", response);
    }
    return response.json();
  }
  async bulkUpdatePhoneNumbers(args, credentials) {
    const sidList = optionalStringArray2(args.phoneNumberSids, "phoneNumberSids");
    const phoneNumberList = optionalStringArray2(args.phoneNumbers, "phoneNumbers");
    const dryRun = optionalBoolean4(args.dryRun) ?? false;
    const changes = isRecordObject7(args.changes) ? { ...args.changes } : null;
    if (!changes) {
      throw new Error("changes must be an object");
    }
    const targets = /* @__PURE__ */ new Map();
    for (const sid of sidList) {
      targets.set(`sid:${sid}`, { sid });
    }
    for (const phoneNumber of phoneNumberList) {
      targets.set(`number:${phoneNumber}`, { phoneNumber });
    }
    if (targets.size === 0) {
      throw new Error("Provide at least one phoneNumberSid or phoneNumber");
    }
    const resolved = await Promise.all(
      Array.from(targets.values()).map(async (target) => {
        const sid = target.sid ?? await this.resolvePhoneNumberSid({ phoneNumber: target.phoneNumber }, credentials);
        const current = await this.getPhoneNumber({ phoneNumberSid: sid }, credentials);
        return {
          sid,
          phoneNumber: current.phone_number,
          current
        };
      })
    );
    if (dryRun) {
      return {
        dryRun: true,
        count: resolved.length,
        changes,
        targets: resolved
      };
    }
    const results = [];
    for (const entry of resolved) {
      const updated = await this.updatePhoneNumber(
        {
          phoneNumberSid: entry.sid,
          ...changes
        },
        credentials
      );
      results.push(updated);
    }
    return {
      dryRun: false,
      count: results.length,
      results
    };
  }
  async searchPhoneNumbers(args, credentials) {
    const payload = await this.listPhoneNumbers(
      {
        limit: optionalNumber5(args.limit) ?? 50,
        pageSize: optionalNumber5(args.limit) ?? 50
      },
      credentials
    );
    const query = safeTrim8(args.query)?.toLowerCase() ?? null;
    const capability = safeTrim8(args.capability);
    const voiceUrlContains = safeTrim8(args.voiceUrlContains)?.toLowerCase() ?? null;
    const smsUrlContains = safeTrim8(args.smsUrlContains)?.toLowerCase() ?? null;
    const twimlAppSid = safeTrim8(args.twimlAppSid);
    const filtered = (payload.incoming_phone_numbers ?? []).filter((entry) => {
      if (query) {
        const haystack = `${entry.phone_number ?? ""} ${entry.friendly_name ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      if (capability) {
        const capabilityValue = entry.capabilities?.[capability];
        if (!capabilityValue) {
          return false;
        }
      }
      if (voiceUrlContains && !(entry.voice_url ?? "").toLowerCase().includes(voiceUrlContains)) {
        return false;
      }
      if (smsUrlContains && !(entry.sms_url ?? "").toLowerCase().includes(smsUrlContains)) {
        return false;
      }
      if (twimlAppSid) {
        if (entry.voice_application_sid !== twimlAppSid && entry.sms_application_sid !== twimlAppSid) {
          return false;
        }
      }
      return true;
    });
    return {
      count: filtered.length,
      incoming_phone_numbers: filtered
    };
  }
  async sendSms(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const mediaUrls = optionalStringArray2(args.mediaUrls, "mediaUrls");
    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
      {
        From: requireString(args.from, "from"),
        To: requireString(args.to, "to"),
        Body: requireString(args.body, "body"),
        StatusCallback: safeTrim8(args.statusCallback) ?? void 0,
        MediaUrl: mediaUrls.length > 0 ? mediaUrls : void 0
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to send Twilio message", response);
    }
    return response.json();
  }
  async listMessages(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
      {
        From: safeTrim8(args.from) ?? void 0,
        To: safeTrim8(args.to) ?? void 0,
        Status: safeTrim8(args.status) ?? void 0,
        PageSize: optionalNumber5(args.pageSize) ?? 50
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio messages", response);
    }
    const payload = await response.json();
    const limit = optionalNumber5(args.limit) ?? 50;
    return {
      ...payload,
      messages: (payload.messages ?? []).slice(0, limit)
    };
  }
  async getMessage(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages/${encodeURIComponent(requireString(args.messageSid, "messageSid"))}.json`,
      void 0,
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio message", response);
    }
    return response.json();
  }
  async makeCall(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const url = safeTrim8(args.url);
    const twiml = safeTrim8(args.twiml);
    const applicationSid = safeTrim8(args.applicationSid);
    if (!url && !twiml && !applicationSid) {
      throw new Error("Provide one of url, twiml, or applicationSid to make a Twilio call");
    }
    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls.json`,
      {
        From: requireString(args.from, "from"),
        To: requireString(args.to, "to"),
        Url: url ?? void 0,
        Twiml: twiml ?? void 0,
        ApplicationSid: applicationSid ?? void 0,
        StatusCallback: safeTrim8(args.statusCallback) ?? void 0,
        Record: optionalBoolean4(args.record) ?? void 0
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to create Twilio call", response);
    }
    return response.json();
  }
  async listCalls(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls.json`,
      {
        From: safeTrim8(args.from) ?? void 0,
        To: safeTrim8(args.to) ?? void 0,
        Status: safeTrim8(args.status) ?? void 0,
        PageSize: optionalNumber5(args.pageSize) ?? 50
      },
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio calls", response);
    }
    const payload = await response.json();
    const limit = optionalNumber5(args.limit) ?? 50;
    return {
      ...payload,
      calls: (payload.calls ?? []).slice(0, limit)
    };
  }
  async getCall(args, credentials) {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls/${encodeURIComponent(requireString(args.callSid, "callSid"))}.json`,
      void 0,
      credentials
    );
    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio call", response);
    }
    const payload = await response.json();
    return {
      ...payload,
      summary: this.summarizeCall(payload)
    };
  }
  async getNumberBehavior(args, credentials) {
    const number = await this.getPhoneNumber(args, credentials);
    return {
      sid: number.sid,
      phoneNumber: number.phone_number,
      friendlyName: number.friendly_name,
      voice: {
        voiceUrl: number.voice_url,
        voiceMethod: number.voice_method,
        voiceFallbackUrl: number.voice_fallback_url,
        voiceFallbackMethod: number.voice_fallback_method,
        statusCallback: number.status_callback,
        statusCallbackMethod: number.status_callback_method,
        voiceApplicationSid: number.voice_application_sid
      },
      sms: {
        smsUrl: number.sms_url,
        smsMethod: number.sms_method,
        smsFallbackUrl: number.sms_fallback_url,
        smsFallbackMethod: number.sms_fallback_method,
        smsApplicationSid: number.sms_application_sid
      },
      capabilities: number.capabilities,
      summary: summarizeNumberBehavior(number)
    };
  }
  async resolvePhoneNumberSid(args, credentials) {
    const directSid = safeTrim8(args.phoneNumberSid);
    if (directSid) {
      return directSid;
    }
    const phoneNumber = safeTrim8(args.phoneNumber);
    if (!phoneNumber) {
      throw new Error("Provide phoneNumberSid or phoneNumber");
    }
    const payload = await this.listPhoneNumbers(
      {
        phoneNumber,
        pageSize: 20,
        limit: 20
      },
      credentials
    );
    const exact = (payload.incoming_phone_numbers ?? []).find(
      (entry) => entry.phone_number === phoneNumber
    );
    if (!exact?.sid) {
      throw new Error(`No Twilio incoming phone number found for ${phoneNumber}`);
    }
    return exact.sid;
  }
  summarizeCall(call) {
    const from = safeTrim8(call.from) ?? "unknown";
    const to = safeTrim8(call.to) ?? "unknown";
    const status = safeTrim8(call.status) ?? "unknown";
    const direction = safeTrim8(call.direction) ?? "unknown direction";
    const duration = safeTrim8(call.duration);
    return `${direction} call from ${from} to ${to} is ${status}${duration ? ` after ${duration} seconds` : ""}.`;
  }
  async createApiError(prefix, response) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? response.statusText;
    const code = payload?.code !== void 0 ? String(payload.code) : void 0;
    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code
    });
  }
};
registerHandler("twilio", new TwilioHandler());

// ../src/data/integrations.ts
var apiKeyField = /* @__PURE__ */ __name((key = "apiKey", label = "API Key", placeholder = "Paste your API key", description) => ({
  key,
  label,
  type: "password",
  placeholder,
  required: true,
  description
}), "apiKeyField");
var tokenField = /* @__PURE__ */ __name((key = "accessToken", label = "Access Token", placeholder = "Paste your access token", description) => ({
  key,
  label,
  type: "password",
  placeholder,
  required: true,
  description
}), "tokenField");
var textField = /* @__PURE__ */ __name((key, label, placeholder, description) => ({
  key,
  label,
  type: "text",
  placeholder,
  required: true,
  description
}), "textField");
var textareaField = /* @__PURE__ */ __name((key, label, placeholder, description) => ({
  key,
  label,
  type: "textarea",
  placeholder,
  required: true,
  description
}), "textareaField");
var baseIntegrations = [
  { name: "Gmail", slug: "gmail", description: "Send, read, and manage emails", category: "Communication", icon: "SiGmail", color: "#EA4335" },
  { name: "Discord", slug: "discord", description: "Send messages and manage servers", category: "Communication", icon: "SiDiscord", color: "#5865F2" },
  { name: "Microsoft Teams", slug: "microsoft-teams", description: "Chat, meetings, and team collaboration", category: "Communication", icon: "FaMicrosoft", color: "#6264A7" },
  { name: "Outlook", slug: "outlook", description: "Read mail, manage calendar, and browse contacts", category: "Communication", icon: "PiMicrosoftOutlookLogo", color: "#0078D4" },
  { name: "Telegram", slug: "telegram", description: "Send messages via Telegram Bot API", category: "Communication", icon: "SiTelegram", color: "#26A5E4" },
  { name: "WhatsApp Business", slug: "whatsapp-business", description: "Send messages via WhatsApp Business API", category: "Communication", icon: "SiWhatsapp", color: "#25D366" },
  { name: "Twilio", slug: "twilio", description: "Send SMS, make calls, and manage messaging", category: "Communication", icon: "SiTwilio", color: "#F22F46" },
  { name: "Resend", slug: "resend", description: "Send transactional and marketing emails", category: "Communication", icon: "SiResend", color: "#000000" },
  { name: "SendGrid", slug: "sendgrid", description: "Deliver transactional and marketing emails", category: "Communication", icon: "SiSendgrid", color: "#50B146" },
  { name: "Front", slug: "front", description: "Customer communication and collaboration", category: "Communication", icon: "SiFront", color: "#1E88E5" },
  { name: "Google Meet", slug: "google-meet", description: "Schedule and manage video meetings", category: "Communication", icon: "SiGooglemeet", color: "#00897B" },
  { name: "HubSpot", slug: "hubspot", description: "Manage contacts, deals, and pipelines", category: "CRM & Sales", icon: "SiHubspot", color: "#FF7A59" },
  { name: "Salesforce", slug: "salesforce", description: "Manage CRM data and workflows", category: "CRM & Sales", icon: "SiSalesforce", color: "#00A1E0" },
  { name: "Pipedrive", slug: "pipedrive", description: "Manage deals and sales pipelines", category: "CRM & Sales", icon: "SiPiped", color: "#1A1A1A" },
  { name: "Apollo", slug: "apollo", description: "Search leads and manage contacts", category: "CRM & Sales", icon: "SiApollographql", color: "#311C87" },
  { name: "Notion", slug: "notion", description: "Manage pages, databases, and blocks", category: "Productivity", icon: "SiNotion", color: "#000000" },
  { name: "Google Sheets", slug: "google-sheets", description: "Read and write spreadsheet data", category: "Productivity", icon: "SiGooglesheets", color: "#0F9D58" },
  { name: "Google Calendar", slug: "google-calendar", description: "Create and manage calendar events", category: "Productivity", icon: "SiGooglecalendar", color: "#4285F4" },
  { name: "Google Drive", slug: "google-drive", description: "Upload, search, and manage files", category: "Productivity", icon: "SiGoogledrive", color: "#4285F4" },
  { name: "Google Docs", slug: "google-docs", description: "Create and edit documents online", category: "Productivity", icon: "SiGoogledocs", color: "#4285F4" },
  { name: "Google Slides", slug: "google-slides", description: "Create and share presentations", category: "Productivity", icon: "SiGoogleslides", color: "#FBBC04" },
  { name: "Airtable", slug: "airtable", description: "Manage bases, tables, and records", category: "Productivity", icon: "SiAirtable", color: "#18BFFF" },
  { name: "Todoist", slug: "todoist", description: "Create and manage tasks and projects", category: "Productivity", icon: "SiTodoist", color: "#E44332" },
  { name: "Motion", slug: "motion", description: "Manage Motion workspaces, projects, and tasks", category: "Productivity", icon: "TbPlugConnected", color: "#111827" },
  { name: "Trello", slug: "trello", description: "Manage boards, lists, and cards", category: "Productivity", icon: "SiTrello", color: "#0079BF" },
  { name: "Asana", slug: "asana", description: "Track tasks, projects, and workflows", category: "Productivity", icon: "SiAsana", color: "#F06A6A" },
  { name: "ClickUp", slug: "clickup", description: "Manage tasks, docs, goals, and sprints", category: "Productivity", icon: "SiClickup", color: "#7B68EE" },
  { name: "Monday", slug: "monday", description: "Plan, track, and deliver team projects", category: "Productivity", icon: "SiMondaydotcom", color: "#FF3D57" },
  { name: "Confluence", slug: "confluence", description: "Create and organize team documentation", category: "Productivity", icon: "SiConfluence", color: "#0052CC" },
  { name: "Calendly", slug: "calendly", description: "Schedule meetings and manage bookings", category: "Productivity", icon: "SiCalendly", color: "#006BFF" },
  { name: "Cal.com", slug: "cal-com", description: "Open-source scheduling and booking", category: "Productivity", icon: "SiCaldotcom", color: "#292929" },
  { name: "Typeform", slug: "typeform", description: "Create interactive forms and surveys", category: "Productivity", icon: "SiTypeform", color: "#262627" },
  { name: "Coda", slug: "coda", description: "Collaborative docs, spreadsheets, and apps", category: "Productivity", icon: "SiCoda", color: "#F46B4E" },
  { name: "GitHub", slug: "github", description: "Manage repos, issues, and pull requests", category: "Developer Tools", icon: "SiGithub", color: "#181717" },
  { name: "GitLab", slug: "gitlab", description: "Manage repos and CI/CD pipelines", category: "Developer Tools", icon: "SiGitlab", color: "#FC6D26" },
  { name: "Jira", slug: "jira", description: "Create and manage issues and sprints", category: "Developer Tools", icon: "SiJira", color: "#0052CC" },
  { name: "Linear", slug: "linear", description: "Manage issues, projects, and cycles", category: "Developer Tools", icon: "SiLinear", color: "#5E6AD2" },
  { name: "Vercel", slug: "vercel", description: "Manage deployments and projects", category: "Developer Tools", icon: "SiVercel", color: "#000000" },
  { name: "Sentry", slug: "sentry", description: "Monitor errors and application performance", category: "Developer Tools", icon: "SiSentry", color: "#362D59" },
  { name: "Netlify", slug: "netlify", description: "Deploy and host web applications", category: "Developer Tools", icon: "SiNetlify", color: "#00C7B7" },
  { name: "Stripe", slug: "stripe", description: "Manage payments, customers, and invoices", category: "Payments & Finance", icon: "SiStripe", color: "#635BFF" },
  { name: "PayPal", slug: "paypal", description: "Process payments and manage transactions", category: "Payments & Finance", icon: "SiPaypal", color: "#003087" },
  { name: "QuickBooks", slug: "quickbooks", description: "Manage invoices and accounting", category: "Payments & Finance", icon: "SiQuickbooks", color: "#2CA01C" },
  { name: "Xero", slug: "xero", description: "Manage accounting, invoices, and expenses", category: "Payments & Finance", icon: "SiXero", color: "#13B5EA" },
  { name: "Square", slug: "square", description: "Process payments and manage POS", category: "Payments & Finance", icon: "SiSquare", color: "#3E4348" },
  { name: "Mailchimp", slug: "mailchimp", description: "Create email campaigns and manage audiences", category: "Marketing", icon: "SiMailchimp", color: "#FFE01B" },
  { name: "Klaviyo", slug: "klaviyo", description: "Email and SMS marketing automation", category: "Marketing", icon: "SiKlaviyo", color: "#F5C518" },
  { name: "Buffer", slug: "buffer", description: "Schedule and publish social media content", category: "Marketing", icon: "SiBuffer", color: "#232323" },
  { name: "Postiz", slug: "postiz", description: "Manage social channels and publish posts", category: "Social Media", icon: "TbPlugConnected", color: "#111827" },
  { name: "YouTube", slug: "youtube", description: "Upload videos and manage channels", category: "Social Media", icon: "SiYoutube", color: "#FF0000" },
  { name: "LinkedIn", slug: "linkedin", description: "Post updates and manage connections", category: "Social Media", icon: "FaLinkedin", color: "#0A66C2" },
  { name: "Instagram", slug: "instagram", description: "Publish posts and manage media", category: "Social Media", icon: "SiInstagram", color: "#E4405F" },
  { name: "Vimeo", slug: "vimeo", description: "Upload, manage, and share videos", category: "Social Media", icon: "SiVimeo", color: "#1AB7EA" },
  { name: "Shopify", slug: "shopify", description: "Manage products, orders, and customers", category: "E-commerce", icon: "SiShopify", color: "#7AB55C" },
  { name: "WooCommerce", slug: "woocommerce", description: "Manage store products and orders", category: "E-commerce", icon: "SiWoocommerce", color: "#96588A" },
  { name: "Dropbox", slug: "dropbox", description: "Store, sync, and share files", category: "Storage & Databases", icon: "SiDropbox", color: "#0061FF" },
  { name: "Supabase", slug: "supabase", description: "Query and manage Postgres databases", category: "Storage & Databases", icon: "SiSupabase", color: "#3FCF8E" },
  { name: "Firebase", slug: "firebase", description: "Manage Firestore, Auth, and storage", category: "Storage & Databases", icon: "SiFirebase", color: "#FFCA28" },
  { name: "OpenAI", slug: "openai", description: "Generate text, images, and embeddings", category: "AI & ML", icon: "SiOpenai", color: "#412991" },
  { name: "ElevenLabs", slug: "elevenlabs", description: "Generate speech and voice cloning", category: "AI & ML", icon: "SiElevenlabs", color: "#000000" },
  { name: "Google Analytics", slug: "google-analytics", description: "Connect Google Analytics properties through hosted Google OAuth", category: "Data & Analytics", icon: "SiGoogleanalytics", color: "#E8710A" },
  { name: "Google Search Console", slug: "google-search-console", description: "Inspect indexing, sitemaps, and search performance through hosted Google OAuth", category: "Data & Analytics", icon: "TbPlugConnected", color: "#34A853" },
  { name: "PostHog", slug: "posthog", description: "Track user behavior and feature flags", category: "Data & Analytics", icon: "SiPosthog", color: "#000000" }
];
var integrationMetadata = {
  gmail: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Connect Gmail through the hosted Nango flow to read recent messages, create drafts, and send email from your Google account.",
    credentialFields: [],
    tools: [
      { name: "send_email", description: "Send a Gmail message" },
      { name: "list_emails", description: "List recent inbox messages" },
      { name: "get_email", description: "Fetch a single message by ID" },
      { name: "create_draft", description: "Create a draft in Gmail" }
    ]
  },
  slack: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "live",
    setupGuide: "Create a Slack app, install it to your workspace, and paste the bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "xoxb-...", "Use the Bot User OAuth token from your Slack app.")
    ],
    tools: [
      { name: "send_message", description: "Post a message to a Slack channel" },
      { name: "list_channels", description: "List channels visible to the bot" }
    ]
  },
  discord: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Create a Discord bot, invite it to your server, and store the bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "Paste your Discord bot token")
    ],
    tools: []
  },
  "microsoft-teams": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Microsoft Teams requires Microsoft OAuth and tenant-aware setup, which is not wired yet.",
    credentialFields: [],
    tools: []
  },
  outlook: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Outlook through the hosted Nango flow to grant ClawLink access to your email, calendar, and contacts.",
    credentialFields: [],
    tools: [
      { name: "list_messages", description: "List recent Outlook messages" },
      { name: "get_message", description: "Fetch a single Outlook message by ID" },
      { name: "send_email", description: "Send an email from Outlook" },
      { name: "list_events", description: "List upcoming Outlook calendar events" },
      { name: "create_event", description: "Create an Outlook calendar event" },
      { name: "list_contacts", description: "List Outlook contacts" }
    ]
  },
  telegram: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Create a bot with BotFather and paste the Telegram bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "123456:ABCDEF...", "Telegram bot token from BotFather.")
    ],
    tools: []
  },
  "whatsapp-business": {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "WhatsApp Business requires the WhatsApp Business API and a verified phone number.",
    credentialFields: [],
    tools: []
  },
  twilio: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Paste your Twilio Account SID and Auth Token from the Twilio console so ClawLink can inspect numbers, update routing, send SMS, and inspect calls/messages directly through the Twilio REST API.",
    credentialFields: [
      textField("accountSid", "Account SID", "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "Your primary Twilio account SID."),
      tokenField("authToken", "Auth Token", "Paste your Twilio auth token", "Use the auth token from your Twilio console. Rotate it if it was shared elsewhere.")
    ],
    tools: [
      { name: "get_account", description: "Get Twilio account details and status" },
      { name: "list_phone_numbers", description: "List Twilio phone numbers owned by the account" },
      { name: "get_phone_number", description: "Get a single Twilio incoming phone number and its config" },
      { name: "update_phone_number", description: "Update a Twilio incoming phone number configuration" },
      { name: "bulk_update_phone_numbers", description: "Apply the same configuration changes to multiple Twilio phone numbers" },
      { name: "search_phone_numbers", description: "Search Twilio phone numbers by number, name, capability, or webhook match" },
      { name: "set_voice_webhook", description: "Set the incoming voice webhook for a Twilio phone number" },
      { name: "set_sms_webhook", description: "Set the incoming SMS webhook for a Twilio phone number" },
      { name: "assign_twiml_app", description: "Assign a TwiML application to a Twilio phone number" },
      { name: "send_sms", description: "Send an SMS through Twilio" },
      { name: "list_messages", description: "List Twilio messages" },
      { name: "get_message", description: "Get a specific Twilio message" },
      { name: "make_call", description: "Create an outbound Twilio call" },
      { name: "list_calls", description: "List Twilio calls" },
      { name: "get_call", description: "Get a specific Twilio call" },
      { name: "get_number_behavior", description: "Summarize the effective voice and SMS behavior for a Twilio number" }
    ]
  },
  resend: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Resend requires an API key from your Resend dashboard.",
    credentialFields: [],
    tools: []
  },
  sendgrid: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "SendGrid requires an API key from your SendGrid dashboard.",
    credentialFields: [],
    tools: []
  },
  front: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Front requires a personal API token from your Front settings.",
    credentialFields: [],
    tools: []
  },
  "google-meet": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Meet requires Google OAuth with calendar scopes.",
    credentialFields: [],
    tools: []
  },
  hubspot: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a HubSpot private app token to connect your portal.",
    credentialFields: [
      tokenField("privateAppToken", "Private App Token", "pat-...", "Create a private app in HubSpot and copy its access token.")
    ],
    tools: []
  },
  salesforce: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Salesforce will require OAuth plus instance discovery. This route is reserved for that flow.",
    credentialFields: [],
    tools: []
  },
  pipedrive: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Create a personal API token in Pipedrive and store it here.",
    credentialFields: [apiKeyField("apiToken", "API Token", "Paste your Pipedrive API token")],
    tools: []
  },
  apollo: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Apollo through the hosted Nango flow. ClawLink will use the connected Apollo account for prospecting, enrichment, and contact-management tools.",
    credentialFields: [],
    tools: [
      { name: "search_people", description: "Search net-new people in Apollo using prospecting filters" },
      { name: "search_organizations", description: "Search companies in Apollo's organization database" },
      { name: "enrich_person", description: "Enrich a single person's profile in Apollo" },
      { name: "enrich_organization", description: "Enrich a single organization in Apollo by domain" },
      { name: "search_contacts", description: "Search contacts already added to the team's Apollo account" },
      { name: "list_contact_stages", description: "List the contact stages available in Apollo" },
      { name: "create_contact", description: "Create a contact in the team's Apollo account" }
    ]
  },
  notion: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect your Notion workspace through the hosted Nango flow and approve the pages ClawLink can access.",
    credentialFields: [],
    tools: [
      { name: "notion_search", description: "Search pages and databases in Notion" },
      { name: "notion_get_page", description: "Get a page by ID" },
      { name: "notion_get_blocks", description: "Get the content blocks of a page" },
      { name: "notion_create_page", description: "Create a new page" },
      { name: "notion_query_database", description: "Query a database" },
      { name: "notion_create_database", description: "Create a new database" },
      { name: "notion_append_blocks", description: "Append blocks to a page" }
    ]
  },
  "google-sheets": {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Google Sheets through the hosted Google OAuth flow to create spreadsheets, inspect sheet tabs, read ranges, append rows, and update cells without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "create_spreadsheet", description: "Create a new Google Sheets spreadsheet" },
      { name: "get_spreadsheet", description: "Get Google Sheets spreadsheet metadata and sheet list" },
      { name: "read_sheet", description: "Read values from a Google Sheets range" },
      { name: "append_rows", description: "Append rows to a Google Sheets worksheet range" },
      { name: "update_range", description: "Write values into a Google Sheets range" }
    ]
  },
  "google-calendar": {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Google Calendar through the hosted Google OAuth flow to list calendars, inspect events, and create, update, or delete calendar events without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "list_calendars", description: "List Google Calendars available to the connected account" },
      { name: "get_calendar", description: "Get Google Calendar metadata by calendar id" },
      { name: "list_events", description: "List events from a Google Calendar within an optional time window" },
      { name: "get_event", description: "Get a Google Calendar event by event id" },
      { name: "create_event", description: "Create a Google Calendar event" },
      { name: "update_event", description: "Update fields on an existing Google Calendar event" },
      { name: "delete_event", description: "Delete a Google Calendar event" }
    ]
  },
  "google-drive": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Connect Google Drive through the hosted Google OAuth flow so ClawLink can search Drive, inspect files, create folders, upload files, and manage file metadata without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "list_files", description: "List recent Google Drive files" },
      { name: "search_files", description: "Search Google Drive files with text, mime type, and folder filters" },
      { name: "get_file", description: "Get Google Drive file metadata by file id" },
      { name: "list_children", description: "List files inside a Google Drive folder" },
      { name: "create_folder", description: "Create a folder in Google Drive" },
      { name: "upload_file", description: "Upload a text file to Google Drive" },
      { name: "update_file", description: "Update Google Drive file metadata or replace text content" },
      { name: "download_file", description: "Download raw Google Drive file content when supported" },
      { name: "export_file", description: "Export a Google Docs-format file to a chosen mime type" },
      { name: "copy_file", description: "Copy a Google Drive file" },
      { name: "list_permissions", description: "List sharing permissions on a Google Drive file" },
      { name: "create_permission", description: "Create a sharing permission on a Google Drive file" },
      { name: "delete_permission", description: "Delete a sharing permission from a Google Drive file" },
      { name: "delete_file", description: "Delete a Google Drive file" }
    ]
  },
  "google-analytics": {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Google Analytics through the hosted Nango flow so ClawLink can run GA4 reports and property updates without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "run_report", description: "Run a customized GA4 core report" },
      { name: "provision_account_ticket", description: "Request an account-provisioning ticket for Google Analytics Terms acceptance" },
      { name: "run_realtime_report", description: "Run a customized GA4 realtime report" },
      { name: "create_audience_export", description: "Create a GA4 audience export for later retrieval" },
      { name: "get_audience_export", description: "Get metadata and readiness state for a GA4 audience export" },
      { name: "query_audience_export", description: "Query a completed GA4 audience export with pagination" },
      { name: "check_compatibility", description: "Validate GA4 dimension and metric compatibility for a core report" },
      { name: "create_audience_list", description: "Create a GA4 audience list for later retrieval" },
      { name: "get_audience_list", description: "Get metadata and readiness state for a GA4 audience list" },
      { name: "query_audience_list", description: "Query a completed GA4 audience list with pagination" },
      { name: "run_pivot_report", description: "Run a customized GA4 pivot report" },
      { name: "create_report_task", description: "Create an asynchronous GA4 report task" },
      { name: "get_report_task", description: "Get metadata and processing state for a GA4 report task" },
      { name: "query_report_task", description: "Query a completed GA4 report task with pagination" },
      { name: "run_funnel_report", description: "Run a customized GA4 funnel report" },
      { name: "update_property", description: "Update an existing GA4 property" },
      { name: "validate_events", description: "Validate Measurement Protocol events before sending them to production" },
      { name: "send_events", description: "Send Measurement Protocol events to Google Analytics" }
    ]
  },
  "google-search-console": {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Google Search Console through the hosted Google OAuth flow to inspect properties, sitemaps, indexing status, and search performance without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "add_site", description: "Add a Search Console site property" },
      { name: "delete_site", description: "Delete a Search Console site property" },
      { name: "get_site", description: "Get a specific Search Console site property" },
      { name: "list_sites", description: "List Search Console site properties for the connected account" },
      { name: "get_sitemap", description: "Get metadata for a Search Console sitemap" },
      { name: "inspect_url", description: "Inspect a URL for Search Console indexing issues and status" },
      { name: "list_sitemaps", description: "List sitemaps for a Search Console property" },
      { name: "search_analytics_query", description: "Query Search Console search analytics data" },
      { name: "submit_sitemap", description: "Submit a sitemap to Search Console" }
    ]
  },
  "google-docs": {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Google Docs through the hosted Google OAuth flow to create documents, read document text, replace placeholders, and append content without manual credential setup.",
    credentialFields: [],
    tools: [
      { name: "create_document", description: "Create a new Google Docs document" },
      { name: "get_document", description: "Get Google Docs document metadata and structure" },
      { name: "read_document", description: "Read a Google Docs document as plain text" },
      { name: "replace_text", description: "Replace matching text everywhere in a Google Docs document" },
      { name: "append_text", description: "Append plain text to the end of a Google Docs document" }
    ]
  },
  "google-slides": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Slides uses Google OAuth. The dashboard flow is planned but not implemented.",
    credentialFields: [],
    tools: []
  },
  airtable: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a personal access token and the Airtable base you want the worker to operate on.",
    credentialFields: [
      tokenField("personalAccessToken", "Personal Access Token", "pat..."),
      textField("baseId", "Base ID", "appXXXXXXXXXXXXXX")
    ],
    tools: []
  },
  todoist: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Create a Todoist API token and store it here.",
    credentialFields: [tokenField("apiToken", "API Token", "Paste your Todoist API token")],
    tools: []
  },
  motion: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Create a Motion API key from your Motion settings, then paste it here to let ClawLink list workspaces, browse projects, inspect tasks, and create new tasks.",
    credentialFields: [
      apiKeyField(
        "apiKey",
        "API Key",
        "Paste your Motion API key",
        "Motion uses the X-API-Key header for authenticated API requests."
      )
    ],
    tools: [
      { name: "get_me", description: "List Motion users for a workspace or team" },
      { name: "list_workspaces", description: "List Motion workspaces available to the connected account" },
      { name: "list_tasks", description: "List Motion tasks with optional filters" },
      { name: "get_task", description: "Get a single Motion task by id" },
      { name: "create_task", description: "Create a Motion task" },
      { name: "update_task", description: "Update a Motion task" },
      { name: "delete_task", description: "Delete a Motion task by id" },
      { name: "move_task", description: "Move a Motion task to another project or status" },
      { name: "list_projects", description: "List Motion projects for a workspace" },
      { name: "get_project", description: "Get a single Motion project by id" },
      { name: "create_project", description: "Create a Motion project" }
    ]
  },
  trello: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Trello requires an API key and token from your Trello account settings.",
    credentialFields: [],
    tools: []
  },
  asana: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Asana requires a personal access token from your As account settings.",
    credentialFields: [],
    tools: []
  },
  clickup: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "ClickUp requires a personal API token from your ClickUp settings.",
    credentialFields: [],
    tools: []
  },
  monday: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Monday.com requires an API token from your account settings.",
    credentialFields: [],
    tools: []
  },
  confluence: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Confluence requires an API token and site URL from your Atlassian account.",
    credentialFields: [],
    tools: []
  },
  calendly: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Calendly requires a personal access token from your Calendly account.",
    credentialFields: [],
    tools: []
  },
  "cal-com": {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Cal.com requires an API key from your account settings.",
    credentialFields: [],
    tools: []
  },
  typeform: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Typeform requires a personal access token from your account settings.",
    credentialFields: [],
    tools: []
  },
  coda: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Coda requires an API token from your Coda account settings.",
    credentialFields: [],
    tools: []
  },
  github: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "GitHub support is reserved for a future release. The worker path exists internally, but the hosted product flow is not ready yet.",
    credentialFields: [],
    tools: []
  },
  gitlab: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a GitLab personal access token.",
    credentialFields: [tokenField("accessToken", "Personal Access Token", "glpat-...")],
    tools: []
  },
  jira: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a Jira API token together with your Atlassian email and site URL.",
    credentialFields: [
      textField("siteUrl", "Site URL", "https://your-org.atlassian.net"),
      textField("email", "Atlassian Email", "name@example.com"),
      tokenField("apiToken", "API Token", "Paste your Atlassian API token")
    ],
    tools: []
  },
  linear: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a Linear personal API key.",
    credentialFields: [apiKeyField("apiKey", "API Key", "lin_api_...")],
    tools: []
  },
  vercel: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a Vercel access token created from your account settings.",
    credentialFields: [tokenField("accessToken", "Access Token", "Paste your Vercel access token")],
    tools: []
  },
  sentry: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Sentry requires an auth token from your Sentry account settings.",
    credentialFields: [],
    tools: []
  },
  netlify: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Netlify requires a personal access token from your Netlify account.",
    credentialFields: [],
    tools: []
  },
  stripe: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use your Stripe secret key for server-side access.",
    credentialFields: [apiKeyField("secretKey", "Secret Key", "sk_live_...")],
    tools: []
  },
  paypal: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use a PayPal client ID and secret from your developer dashboard.",
    credentialFields: [
      textField("clientId", "Client ID", "Paste your PayPal client ID"),
      tokenField("clientSecret", "Client Secret", "Paste your PayPal client secret")
    ],
    tools: []
  },
  quickbooks: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "QuickBooks uses OAuth and company selection. That flow is planned but not built.",
    credentialFields: [],
    tools: []
  },
  xero: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Xero uses OAuth 2.0. The dashboard flow is planned but not built.",
    credentialFields: [],
    tools: []
  },
  square: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Square requires an access token from your Square Developer Dashboard.",
    credentialFields: [],
    tools: []
  },
  mailchimp: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Mailchimp requires an API key from your account settings.",
    credentialFields: [],
    tools: []
  },
  klaviyo: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Klaviyo requires a private API key from your account settings.",
    credentialFields: [],
    tools: []
  },
  buffer: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Buffer requires an access token from your Buffer account.",
    credentialFields: [],
    tools: []
  },
  postiz: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Postiz through the hosted Nango flow. ClawLink will use your Postiz account for listing channels, uploading media, and creating or managing posts.",
    credentialFields: [],
    tools: [
      { name: "list_integrations", description: "List connected Postiz channels/integrations" },
      { name: "schedule_post", description: "Publish now or schedule a Postiz post with a simpler agent-friendly input shape" },
      { name: "list_posts", description: "List posts in a date range" },
      { name: "delete_post", description: "Delete a Postiz post by ID" },
      { name: "upload_media", description: "Upload a media file to Postiz from a URL" },
      { name: "get_requirements", description: "Return the expected Postiz posting requirements and settings hints" }
    ]
  },
  youtube: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "YouTube actions require Google OAuth because the API scopes are tied to a Google account.",
    credentialFields: [],
    tools: []
  },
  linkedin: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "LinkedIn posting requires OAuth with user scopes. That dashboard flow is not ready yet.",
    credentialFields: [],
    tools: []
  },
  instagram: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Instagram uses Meta OAuth and page linkage, which is not wired into the dashboard yet.",
    credentialFields: [],
    tools: []
  },
  vimeo: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Vimeo requires OAuth 2.0 authentication.",
    credentialFields: [],
    tools: []
  },
  shopify: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use the shop domain and Admin API access token from your custom app.",
    credentialFields: [
      textField("storeDomain", "Store Domain", "your-store.myshopify.com"),
      tokenField("adminApiToken", "Admin API Token", "shpat_...")
    ],
    tools: []
  },
  woocommerce: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use your WooCommerce store URL plus consumer key and secret.",
    credentialFields: [
      textField("storeUrl", "Store URL", "https://shop.example.com"),
      textField("consumerKey", "Consumer Key", "ck_..."),
      tokenField("consumerSecret", "Consumer Secret", "cs_...")
    ],
    tools: []
  },
  dropbox: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Dropbox uses OAuth 2.0. The dashboard flow is planned but not built.",
    credentialFields: [],
    tools: []
  },
  supabase: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use your Supabase project URL and service role key for backend automation.",
    credentialFields: [
      textField("projectUrl", "Project URL", "https://xyzcompany.supabase.co"),
      apiKeyField("serviceRoleKey", "Service Role Key", "Paste your Supabase service role key")
    ],
    tools: []
  },
  firebase: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Paste the Firebase service account JSON so the worker can authenticate server-side.",
    credentialFields: [
      textareaField("serviceAccountJson", "Service Account JSON", "{ ... }", "Paste the full service account JSON payload.")
    ],
    tools: []
  },
  openai: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Store your OpenAI API key for future model and embeddings calls.",
    credentialFields: [apiKeyField("apiKey", "API Key", "sk-...")],
    tools: []
  },
  elevenlabs: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Use your ElevenLabs API key.",
    credentialFields: [apiKeyField("apiKey", "API Key", "Paste your ElevenLabs API key")],
    tools: []
  },
  posthog: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "PostHog requires a personal API key from your instance settings.",
    credentialFields: [],
    tools: []
  }
};
var defaultMetadata = {
  setupMode: "manual",
  dashboardStatus: "coming-soon",
  runtimeStatus: "planned",
  setupGuide: "Dashboard setup for this integration is not configured yet.",
  credentialFields: [],
  tools: []
};
var integrations = baseIntegrations.map((integration) => ({
  ...integration,
  ...integrationMetadata[integration.slug] ?? defaultMetadata
}));
var categories = [...new Set(integrations.map((integration) => integration.category))];

// auth.ts
async function verifyAuth(authHeader, env) {
  void env;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7);
  try {
    const payload = decodeJWT(token);
    if (payload && payload.sub) {
      return payload.sub;
    }
    return null;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}
__name(verifyAuth, "verifyAuth");
function decodeJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() / 1e3 > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
__name(decodeJWT, "decodeJWT");

// ../src/lib/oauth/providers.ts
var OAUTH_PROVIDER_DISPLAY_NAMES = {
  apollo: "Apollo",
  gmail: "Gmail",
  "google-analytics": "Google Analytics",
  notion: "Notion",
  outlook: "Outlook",
  postiz: "Postiz"
};
function getOAuthProviderDisplayName(slug) {
  return OAUTH_PROVIDER_DISPLAY_NAMES[slug] ?? slug;
}
__name(getOAuthProviderDisplayName, "getOAuthProviderDisplayName");
function safeTrim9(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
__name(safeTrim9, "safeTrim");

// ../src/lib/nango/credentials.ts
function safeTrim10(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
__name(safeTrim10, "safeTrim");
function isRecordObject8(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject8, "isRecordObject");
function pickString(...values) {
  for (const value of values) {
    const trimmed = safeTrim10(value);
    if (trimmed) {
      return trimmed;
    }
  }
  return void 0;
}
__name(pickString, "pickString");
function mapNangoConnectionToClawLinkCredentials(integrationSlug, connection) {
  const raw = isRecordObject8(connection.credentials.raw) ? connection.credentials.raw : {};
  const result = {};
  const accessToken = pickString(
    connection.credentials.access_token,
    connection.credentials.token,
    raw.access_token,
    raw.accessToken,
    raw.token
  );
  const refreshToken = pickString(
    connection.credentials.refresh_token,
    raw.refresh_token,
    raw.refreshToken
  );
  const expiresAt = pickString(
    connection.credentials.expires_at,
    raw.expires_at,
    raw.expiresAt
  );
  const tokenType = pickString(raw.token_type, raw.tokenType);
  const scope = pickString(raw.scope);
  const email = pickString(
    connection.end_user?.email,
    connection.tags?.end_user_email,
    connection.end_user?.tags?.end_user_email
  );
  const displayName = pickString(
    connection.end_user?.display_name,
    connection.tags?.end_user_display_name,
    connection.end_user?.tags?.end_user_display_name
  );
  if (accessToken) {
    result.accessToken = accessToken;
    result.access_token = accessToken;
  }
  if (refreshToken) {
    result.refreshToken = refreshToken;
  }
  if (expiresAt) {
    result.expiresAt = expiresAt;
  }
  if (tokenType) {
    result.tokenType = tokenType;
  }
  if (scope) {
    result.scope = scope;
  }
  if (displayName) {
    result.displayName = displayName;
  }
  if (integrationSlug === "gmail") {
    if (email) {
      result.primaryEmail = email;
      result.email = email;
    }
  } else if (integrationSlug === "outlook") {
    if (email) {
      result.primaryEmail = email;
      result.userPrincipalName = email;
      result.email = email;
    }
  } else if (integrationSlug === "notion") {
    const workspaceName = pickString(
      raw.workspace_name,
      raw.workspaceName,
      connection.end_user?.organization?.display_name,
      connection.provider_config_key
    );
    const workspaceId = pickString(raw.workspace_id, raw.workspaceId);
    const botId = pickString(raw.bot_id, raw.botId);
    if (workspaceName) {
      result.workspaceName = workspaceName;
    }
    if (workspaceId) {
      result.workspaceId = workspaceId;
    }
    if (botId) {
      result.botId = botId;
    }
    if (accessToken) {
      result.integrationToken = accessToken;
    }
  } else if (integrationSlug === "apollo") {
    const workspaceName = pickString(
      raw.organization_name,
      raw.organizationName,
      raw.account_name,
      raw.accountName,
      connection.end_user?.organization?.display_name
    );
    const workspaceId = pickString(
      raw.organization_id,
      raw.organizationId,
      raw.account_id,
      raw.accountId,
      connection.end_user?.organization?.id
    );
    if (workspaceName) {
      result.workspaceName = workspaceName;
    }
    if (workspaceId) {
      result.workspaceId = workspaceId;
    }
    if (email) {
      result.email = email;
    }
  } else if (integrationSlug === "google-analytics") {
    const workspaceName = pickString(
      raw.property_name,
      raw.propertyName,
      raw.account_name,
      raw.accountName,
      connection.end_user?.organization?.display_name
    );
    const workspaceId = pickString(
      raw.property_id,
      raw.propertyId,
      raw.account_id,
      raw.accountId,
      connection.end_user?.organization?.id
    );
    if (workspaceName) {
      result.workspaceName = workspaceName;
    }
    if (workspaceId) {
      result.workspaceId = workspaceId;
    }
    if (email) {
      result.email = email;
      result.primaryEmail = email;
    }
  }
  const accountId = pickString(
    raw.account_id,
    raw.accountId,
    raw.user_id,
    raw.userId,
    connection.end_user?.id
  );
  if (accountId) {
    result.accountId = accountId;
  }
  return result;
}
__name(mapNangoConnectionToClawLinkCredentials, "mapNangoConnectionToClawLinkCredentials");

// crypto.ts
function getEncryptionKey(providedKey) {
  const encryptionKey = providedKey ?? process.env.CREDENTIAL_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY is not configured");
  }
  return encryptionKey;
}
__name(getEncryptionKey, "getEncryptionKey");
async function encryptCredential(credentials, encryptionKeyOverride) {
  const encryptionKey = getEncryptionKey(encryptionKeyOverride);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(credentials));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}
__name(encryptCredential, "encryptCredential");
async function decryptCredential(encryptedData, encryptionKeyOverride) {
  const encryptionKey = getEncryptionKey(encryptionKeyOverride);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}
__name(decryptCredential, "decryptCredential");

// credentials.ts
function cacheKey(connectionId) {
  return `cred:${connectionId}`;
}
__name(cacheKey, "cacheKey");
function isRecordObject9(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecordObject9, "isRecordObject");
function getEnvString(env, key) {
  return safeTrim9(env[key]);
}
__name(getEnvString, "getEnvString");
function getNangoConfig(env) {
  const baseUrl = getEnvString(env, "NANGO_BASE_URL")?.replace(/\/+$/, "");
  const secretKey = getEnvString(env, "NANGO_SECRET_KEY");
  if (!baseUrl || !secretKey) {
    return null;
  }
  return { baseUrl, secretKey };
}
__name(getNangoConfig, "getNangoConfig");
function isOAuthIntegration(integration) {
  return integration === "apollo" || integration === "gmail" || integration === "google-analytics" || integration === "notion" || integration === "outlook" || integration === "postiz";
}
__name(isOAuthIntegration, "isOAuthIntegration");
function buildNeedsReauthMessage(integration, detail) {
  const providerName = getOAuthProviderDisplayName(integration);
  const reason = safeTrim9(detail);
  if (reason) {
    return `${providerName} needs to be reconnected. ${reason}`;
  }
  return `${providerName} needs to be reconnected in ClawLink before it can be used again.`;
}
__name(buildNeedsReauthMessage, "buildNeedsReauthMessage");
async function loadCachedCredentials(env, connectionId) {
  const raw = await env.CREDENTIALS?.get(cacheKey(connectionId));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return isRecordObject9(parsed) ? Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, String(value)])
    ) : null;
  } catch {
    return null;
  }
}
__name(loadCachedCredentials, "loadCachedCredentials");
async function cacheCredentials(env, connectionId, credentials) {
  if (!env.CREDENTIALS) {
    return;
  }
  await env.CREDENTIALS.put(cacheKey(connectionId), JSON.stringify(credentials), {
    expirationTtl: 60 * 30
  });
}
__name(cacheCredentials, "cacheCredentials");
async function clearCachedCredentials(env, connectionId) {
  await env.CREDENTIALS?.delete?.(cacheKey(connectionId));
}
__name(clearCachedCredentials, "clearCachedCredentials");
async function persistCredentials(env, connectionId, credentials) {
  const encrypted = await encryptCredential(credentials, env.CREDENTIAL_ENCRYPTION_KEY);
  await env.DB.prepare(
    `
        UPDATE user_integrations
        SET credentials_encrypted = ?,
            expires_at = ?,
            auth_state = 'active',
            auth_error = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `
  ).bind(encrypted, safeTrim9(credentials.expiresAt) ?? null, connectionId).run();
  await cacheCredentials(env, connectionId, credentials);
}
__name(persistCredentials, "persistCredentials");
async function markConnectionNeedsReauth(env, connectionId, authError) {
  await env.DB.prepare(
    `
        UPDATE user_integrations
        SET auth_state = 'needs_reauth',
            auth_error = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `
  ).bind(authError, connectionId).run();
  await clearCachedCredentials(env, connectionId);
}
__name(markConnectionNeedsReauth, "markConnectionNeedsReauth");
async function resolveInternalUserId(db, authSubject) {
  const trimmed = authSubject.trim();
  if (!trimmed) {
    return null;
  }
  const row = await db.prepare(
    `
        SELECT id
        FROM users
        WHERE clerk_id = ? OR id = ?
        LIMIT 1
      `
  ).bind(trimmed, trimmed).first();
  return row?.id ?? null;
}
__name(resolveInternalUserId, "resolveInternalUserId");
async function loadConnectionRecord(env, userId, integration, options) {
  if (options.connectionId) {
    return env.DB.prepare(
      `
          SELECT id, credentials_encrypted, auth_state, auth_error,
                 auth_provider, nango_connection_id, nango_provider_config_key
          FROM user_integrations
          WHERE id = ? AND user_id = ? AND integration = ?
          LIMIT 1
        `
    ).bind(options.connectionId, userId, integration).first();
  }
  return env.DB.prepare(
    `
        SELECT id, credentials_encrypted, auth_state, auth_error,
               auth_provider, nango_connection_id, nango_provider_config_key
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
        LIMIT 1
      `
  ).bind(userId, integration).first();
}
__name(loadConnectionRecord, "loadConnectionRecord");
function isNangoBackedConnection(record) {
  return Boolean(record.nango_connection_id && record.nango_provider_config_key);
}
__name(isNangoBackedConnection, "isNangoBackedConnection");
function buildNeedsReauthMessageFromNango(integration, detail) {
  const providerName = getOAuthProviderDisplayName(integration);
  const reason = safeTrim9(detail);
  if (reason) {
    return `${providerName} needs to be reconnected in Nango. ${reason}`;
  }
  return `${providerName} needs to be reconnected in Nango before it can be used again.`;
}
__name(buildNeedsReauthMessageFromNango, "buildNeedsReauthMessageFromNango");
async function markLegacyOAuthConnectionNeedsReauth(env, record, integration) {
  const message = `${getOAuthProviderDisplayName(integration)} must be reconnected through the Nango-managed flow.`;
  await markConnectionNeedsReauth(env, record.id, message);
  throw new Error(buildNeedsReauthMessageFromNango(integration, message));
}
__name(markLegacyOAuthConnectionNeedsReauth, "markLegacyOAuthConnectionNeedsReauth");
async function fetchNangoConnection(env, integration, record, options = {}) {
  const nangoConnectionId = safeTrim9(record.nango_connection_id);
  const providerConfigKey = safeTrim9(record.nango_provider_config_key);
  const config = getNangoConfig(env);
  if (!nangoConnectionId || !providerConfigKey || !config) {
    throw new Error(`Nango is not configured for ${integration}.`);
  }
  const params = new URLSearchParams({
    provider_config_key: providerConfigKey,
    refresh_token: "true"
  });
  if (options.forceRefresh) {
    params.set("force_refresh", "true");
  }
  const response = await fetch(
    `${config.baseUrl}/connection/${encodeURIComponent(nangoConnectionId)}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        Accept: "application/json"
      }
    }
  );
  const rawPayload = await response.json().catch(() => null);
  if (!response.ok) {
    const payloadRecord = isRecordObject9(rawPayload) ? rawPayload : null;
    const errorRecord = payloadRecord && isRecordObject9(payloadRecord.error) ? payloadRecord.error : null;
    const detail = typeof errorRecord?.message === "string" ? errorRecord.message : typeof payloadRecord?.message === "string" ? payloadRecord.message : `${response.status} ${response.statusText}`;
    if (response.status >= 400 && response.status < 500) {
      await markConnectionNeedsReauth(
        env,
        record.id,
        buildNeedsReauthMessageFromNango(integration, detail)
      );
      throw new Error(buildNeedsReauthMessageFromNango(integration, detail));
    }
    throw new Error(`Failed to fetch Nango connection for ${integration}. ${detail}`);
  }
  const connection = rawPayload;
  const credentials = mapNangoConnectionToClawLinkCredentials(integration, connection);
  if (!safeTrim9(credentials.accessToken) && !safeTrim9(credentials.access_token)) {
    throw new Error(`Nango did not return an access token for ${integration}.`);
  }
  await persistCredentials(env, record.id, credentials);
  return credentials;
}
__name(fetchNangoConnection, "fetchNangoConnection");
async function loadCredentialsForIntegration(env, userId, integration, options = {}) {
  const record = await loadConnectionRecord(env, userId, integration, options);
  if (!record) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }
  if (record.auth_state === "needs_reauth") {
    throw new Error(
      isOAuthIntegration(integration) ? buildNeedsReauthMessageFromNango(integration, record.auth_error) : buildNeedsReauthMessage(integration, record.auth_error)
    );
  }
  if (isOAuthIntegration(integration)) {
    if (!isNangoBackedConnection(record)) {
      await markLegacyOAuthConnectionNeedsReauth(env, record, integration);
    }
    return fetchNangoConnection(env, integration, record);
  }
  const cached = await loadCachedCredentials(env, record.id);
  if (cached) {
    return cached;
  }
  if (!record.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }
  const credentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY
  );
  await cacheCredentials(env, record.id, credentials);
  return credentials;
}
__name(loadCredentialsForIntegration, "loadCredentialsForIntegration");
async function refreshCredentialsForIntegration(env, userId, integration, options = {}) {
  const record = await loadConnectionRecord(env, userId, integration, options);
  if (!record) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }
  if (record.auth_state === "needs_reauth") {
    throw new Error(
      isOAuthIntegration(integration) ? buildNeedsReauthMessageFromNango(integration, record.auth_error) : buildNeedsReauthMessage(integration, record.auth_error)
    );
  }
  if (isOAuthIntegration(integration)) {
    if (!isNangoBackedConnection(record)) {
      await markLegacyOAuthConnectionNeedsReauth(env, record, integration);
    }
    const credentials = await fetchNangoConnection(env, integration, record, {
      forceRefresh: true
    });
    return {
      connectionId: record.id,
      credentials
    };
  }
  throw new Error(`${integration} does not support token refresh.`);
}
__name(refreshCredentialsForIntegration, "refreshCredentialsForIntegration");
async function markConnectionNeedsReauthForIntegration(env, userId, integration, reason, options = {}) {
  const record = await loadConnectionRecord(env, userId, integration, options);
  if (!record) {
    return;
  }
  await markConnectionNeedsReauth(env, record.id, reason);
}
__name(markConnectionNeedsReauthForIntegration, "markConnectionNeedsReauthForIntegration");

// logger.ts
async function logRequest(db, entry) {
  try {
    await db.prepare(`
      INSERT INTO request_logs (user_id, integration, action, success, latency_ms, error_message, request_body, response_body, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      entry.userId,
      entry.integration,
      entry.action,
      entry.success ? 1 : 0,
      entry.latencyMs,
      entry.errorMessage || null,
      entry.requestBody || null,
      entry.responseBody || null
    ).run();
  } catch (error) {
    console.error("Failed to log request:", error);
  }
}
__name(logRequest, "logRequest");

// index.ts
async function handleToolCall(env, authSubject, params) {
  const { name, arguments: rawArgs = {} } = params || {};
  if (!name) {
    throw new Error("Missing tool name");
  }
  const [integration, ...actionParts] = name.split("_");
  const action = actionParts.join("_");
  const internalUserId = await resolveInternalUserId(env.DB, authSubject);
  if (!internalUserId) {
    throw new Error("No ClawLink user found for the authenticated account.");
  }
  let credentials;
  const args = { ...rawArgs };
  const rawConnectionId = args.connectionId;
  const parsedConnectionId = typeof rawConnectionId === "number" ? rawConnectionId : typeof rawConnectionId === "string" ? Number.parseInt(rawConnectionId, 10) : NaN;
  const connectionId = Number.isFinite(parsedConnectionId) ? parsedConnectionId : void 0;
  if ("connectionId" in args) {
    delete args.connectionId;
  }
  const hasInlineCredentials = Boolean(params?.credentials);
  if (params?.credentials) {
    credentials = params.credentials;
  } else {
    credentials = await loadCredentialsForIntegration(env, internalUserId, integration, {
      connectionId
    });
  }
  const handler = getIntegrationHandler(integration);
  if (!handler) {
    throw new Error(`Unknown integration: ${integration}`);
  }
  const canRetryAfterAuthFailure = !hasInlineCredentials;
  let result;
  try {
    result = await handler.execute(action, args, credentials);
  } catch (error) {
    if (!canRetryAfterAuthFailure || !isAuthenticationFailure(error)) {
      throw error;
    }
    const refreshed = await refreshCredentialsForIntegration(env, internalUserId, integration, {
      connectionId
    });
    try {
      result = await handler.execute(action, args, refreshed.credentials);
    } catch (retryError) {
      if (isAuthenticationFailure(retryError)) {
        const detail = retryError instanceof Error ? retryError.message : `Authentication failed after refreshing ${integration} credentials.`;
        await markConnectionNeedsReauthForIntegration(
          env,
          internalUserId,
          integration,
          detail,
          { connectionId: refreshed.connectionId }
        );
      }
      throw retryError;
    }
  }
  await logRequest(env.DB, {
    userId: internalUserId,
    integration,
    action,
    success: true,
    latencyMs: 0
    // TODO: measure properly
  });
  return result;
}
__name(handleToolCall, "handleToolCall");
function handleListTools() {
  const tools = [];
  for (const integration of integrations) {
    const handler = getIntegrationHandler(integration.slug);
    if (handler?.getTools) {
      const integrationTools = handler.getTools(integration.slug);
      tools.push(...integrationTools);
    }
  }
  return tools;
}
__name(handleListTools, "handleListTools");
var index_default = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "https://claw-link.dev";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        error: { code: -32600, message: "Method not allowed" }
      }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      const authHeader = request.headers.get("Authorization");
      const userId = await verifyAuth(authHeader, env);
      if (!userId) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: 0,
          error: { code: -32001, message: "Unauthorized" }
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      const mcpRequest = await request.json();
      let result;
      switch (mcpRequest.method) {
        case "tools/list":
          result = { tools: handleListTools() };
          break;
        case "tools/call":
          result = await handleToolCall(
            env,
            userId,
            mcpRequest.params
          );
          break;
        default:
          throw new Error(`Unknown method: ${mcpRequest.method}`);
      }
      const response = {
        jsonrpc: "2.0",
        id: mcpRequest.id,
        result
      };
      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true"
        }
      });
    } catch (error) {
      console.error("Worker error:", error);
      const response = {
        jsonrpc: "2.0",
        id: 0,
        error: {
          code: -32e3,
          message: error instanceof Error ? error.message : "Internal error"
        }
      };
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true"
        }
      });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
