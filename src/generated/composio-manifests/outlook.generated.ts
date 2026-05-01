import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "outlook",
    name: partial.name,
    description: partial.description,
    inputSchema: partial.inputSchema,
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "outlook",
      toolSlug: partial.toolSlug,
      version: "20260430_00",
    },
  };
}

export const outlookComposioTools: IntegrationTool[] = [
  composioTool({
    name: "outlook_accept_event",
    description: "Accepts or tentatively accepts a calendar meeting invite on behalf of a user. Use this action when a user has received a meeting invitation and wants to indicate their attendance status (either confirmed or tentative). The organizer will receive a notification of the acceptance unless send_response is set to false.",
    toolSlug: "OUTLOOK_ACCEPT_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional text message to include with the response, sent to the organizer.",
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the calendar owner. If not provided, uses the authenticated user (/me).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to respond to.",
        },
        response_type: {
          type: "string",
          description: "Type of response: 'accept' to accept the invite, 'tentative' to tentatively accept.",
          enum: [
            "accept",
            "tentative",
          ],
        },
        send_response: {
          type: "boolean",
          description: "Whether to send the response to the organizer. Set to false to accept without notifying.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Accept calendar event invite.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_add_event_attachment",
    description: "Adds an attachment to a specific Outlook calendar event. Use when you need to attach a file or nested item to an existing event.",
    toolSlug: "OUTLOOK_ADD_EVENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload; required when '@odata.type' is itemAttachment.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique opaque identifier of the calendar event (NOT an email address). This is typically a long string starting with 'AAMkA' or 'AQMkA'. Obtain it from listing or searching calendar events.",
        },
        odata_type: {
          type: "string",
          description: "Attachment type: '#microsoft.graph.fileAttachment' requires 'contentBytes'; '#microsoft.graph.itemAttachment' requires 'item'.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
          ],
        },
        content_bytes: {
          type: "string",
          description: "MUST be base64-encoded file contents (not plain text); required when '@odata.type' is fileAttachment. Raw/plain text must be base64-encoded first.",
        },
      },
      required: [
        "event_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "rooms_and_calendars",
    ],
    askBefore: [
      "Confirm the parameters before executing Add event attachment.",
    ],
  }),
  composioTool({
    name: "outlook_add_mail_attachment",
    description: "Tool to add an attachment to an email message. Use when you have a message ID and need to attach a small (<3 MB) file or reference.",
    toolSlug: "OUTLOOK_ADD_MAIL_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "Embedded item (e.g., message, event) for itemAttachment; must include its own '@odata.type'.",
        },
        name: {
          type: "string",
          description: "Display name of the attachment (e.g., file name). Required when using content_bytes. When using the attachment field, the name is automatically inferred.",
        },
        user_id: {
          type: "string",
          description: "The user's principal name or 'me' for the authenticated user.",
        },
        isInline: {
          type: "boolean",
          description: "Set to true if the attachment should appear inline in the message body.",
        },
        contentId: {
          type: "string",
          description: "Content ID for inline attachments, used in HTML body references.",
        },
        attachment: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "File to attach to the email. Either provide this field OR use 'content_bytes'. Cannot be used together with 'content_bytes'.",
        },
        message_id: {
          type: "string",
          description: "Unique Microsoft Graph message ID (opaque string like 'AAMkAGI2TAAA='). NOT an email address - this is an internal identifier returned by Microsoft Graph API operations.",
        },
        odata_type: {
          type: "string",
          description: "The OData type of the attachment. Required by Microsoft Graph API. Use '#microsoft.graph.fileAttachment' for file attachments, '#microsoft.graph.itemAttachment' for embedded items (messages, events, contacts).",
        },
        contentType: {
          type: "string",
          description: "MIME type of the attachment (e.g., 'application/pdf'). Required when using content_bytes. When using the attachment field, the mimetype is automatically inferred.",
        },
        contentBytes: {
          type: "string",
          description: "Base64-encoded content of the file attachment (max size 3 MB). Either provide this field OR use the 'attachment' field (recommended). Cannot be used together with 'attachment'.",
        },
        contentLocation: {
          type: "string",
          description: "URL location or path for reference attachments.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Add mail attachment.",
    ],
  }),
  composioTool({
    name: "outlook_batch_move_messages",
    description: "Batch-move up to 20 Outlook messages to a destination folder in a single Microsoft Graph $batch call. Use when moving multiple messages to avoid per-message move API calls.",
    toolSlug: "OUTLOOK_BATCH_MOVE_MESSAGES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) of the user whose messages to move, or 'me' for the currently authenticated user.",
        },
        message_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of message IDs to move. Maximum 20 items per batch (Microsoft Graph API limit). Each ID must be complete and untruncated.",
        },
        destination_id: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). If using a folder ID, it must be complete and untruncated.",
        },
        response_detail: {
          type: "string",
          description: "Controls how much each move sub-request returns from Microsoft Graph. 'minimal' (default) sets `Prefer: return=minimal` on each sub-request, so Graph returns 204 No Content per move — the response stays small even for the maximum 20 HTML messages. In this mode `moved_message_id` in each result is null even on success. 'full' omits the Prefer header so Graph returns the full moved-message body per sub-request and `moved_message_id` is populated. Use 'full' if you need to chain follow-up calls on the new message ID; otherwise stick with 'minimal' to avoid multi-MB batch responses.",
          enum: [
            "minimal",
            "full",
          ],
        },
      },
      required: [
        "message_ids",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch move messages.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_batch_update_messages",
    description: "Batch-update up to 20 Outlook messages per call using Microsoft Graph JSON batching. Use when marking multiple messages read/unread or updating other properties to avoid per-message PATCH calls.",
    toolSlug: "OUTLOOK_BATCH_UPDATE_MESSAGES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        updates: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              patch: {
                type: "object",
                additionalProperties: true,
                properties: {
                  body: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      content: {
                        type: "string",
                        description: "The content of the item body.",
                      },
                      contentType: {
                        type: "string",
                        description: "The type of body content.",
                        enum: [
                          "text",
                          "html",
                        ],
                      },
                    },
                    description: "The body of the message.",
                  },
                  flag: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      flagStatus: {
                        type: "string",
                        description: "Status for follow-up for an item.",
                        enum: [
                          "notFlagged",
                          "flagged",
                          "complete",
                        ],
                      },
                      dueDateTime: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          dateTime: {
                            type: "string",
                            description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                          },
                          timeZone: {
                            type: "string",
                            description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                          },
                        },
                        description: "Describes the date, time, and time zone of a point in time.",
                      },
                      startDateTime: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          dateTime: {
                            type: "string",
                            description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                          },
                          timeZone: {
                            type: "string",
                            description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                          },
                        },
                        description: "Describes the date, time, and time zone of a point in time.",
                      },
                      completedDateTime: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          dateTime: {
                            type: "string",
                            description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                          },
                          timeZone: {
                            type: "string",
                            description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                          },
                        },
                        description: "Describes the date, time, and time zone of a point in time.",
                      },
                    },
                    description: "The flag value that indicates the status, start date, due date, or completion date for the message.",
                  },
                  from: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      emailAddress: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          name: {
                            type: "string",
                            description: "The display name of the person or entity.",
                          },
                          address: {
                            type: "string",
                            description: "The email address of the person or entity.",
                          },
                        },
                        description: "Email address of a contact or message recipient.",
                      },
                    },
                    description: "Represents information about a user in the sending or receiving end of a message.",
                  },
                  isRead: {
                    type: "boolean",
                    description: "Whether the message has been read.",
                  },
                  sender: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      emailAddress: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          name: {
                            type: "string",
                            description: "The display name of the person or entity.",
                          },
                          address: {
                            type: "string",
                            description: "The email address of the person or entity.",
                          },
                        },
                        description: "Email address of a contact or message recipient.",
                      },
                    },
                    description: "Represents information about a user in the sending or receiving end of a message.",
                  },
                  replyTo: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        emailAddress: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            name: {
                              type: "string",
                              description: "The display name of the person or entity.",
                            },
                            address: {
                              type: "string",
                              description: "The email address of the person or entity.",
                            },
                          },
                          description: "Email address of a contact or message recipient.",
                        },
                      },
                      description: "Represents information about a user in the sending or receiving end of a message.",
                    },
                    description: "The email addresses to use when replying. Only updatable if isDraft=true.",
                  },
                  subject: {
                    type: "string",
                    description: "The subject of the message. Only updatable if isDraft=true.",
                  },
                  categories: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "The categories associated with the message.",
                  },
                  importance: {
                    type: "string",
                    description: "Importance level of the message.",
                    enum: [
                      "low",
                      "normal",
                      "high",
                    ],
                  },
                  ccRecipients: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        emailAddress: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            name: {
                              type: "string",
                              description: "The display name of the person or entity.",
                            },
                            address: {
                              type: "string",
                              description: "The email address of the person or entity.",
                            },
                          },
                          description: "Email address of a contact or message recipient.",
                        },
                      },
                      description: "Represents information about a user in the sending or receiving end of a message.",
                    },
                    description: "The Cc recipients for the message.",
                  },
                  toRecipients: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        emailAddress: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            name: {
                              type: "string",
                              description: "The display name of the person or entity.",
                            },
                            address: {
                              type: "string",
                              description: "The email address of the person or entity.",
                            },
                          },
                          description: "Email address of a contact or message recipient.",
                        },
                      },
                      description: "Represents information about a user in the sending or receiving end of a message.",
                    },
                    description: "The To recipients for the message.",
                  },
                  bccRecipients: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        emailAddress: {
                          type: "object",
                          additionalProperties: true,
                          properties: {
                            name: {
                              type: "string",
                              description: "The display name of the person or entity.",
                            },
                            address: {
                              type: "string",
                              description: "The email address of the person or entity.",
                            },
                          },
                          description: "Email address of a contact or message recipient.",
                        },
                      },
                      description: "Represents information about a user in the sending or receiving end of a message.",
                    },
                    description: "The Bcc recipients for the message.",
                  },
                  internetMessageId: {
                    type: "string",
                    description: "The message ID in RFC2822 format. Only updatable if isDraft=true.",
                  },
                  isReadReceiptRequested: {
                    type: "boolean",
                    description: "Whether a read receipt is requested for the message.",
                  },
                  inferenceClassification: {
                    type: "string",
                    description: "Classification of the message based on inferred relevance or importance.",
                    enum: [
                      "focused",
                      "other",
                    ],
                  },
                  isDeliveryReceiptRequested: {
                    type: "boolean",
                    description: "Whether a delivery receipt is requested for the message.",
                  },
                },
                description: "Object containing the message properties to update. Include only fields you want to update.",
              },
              message_id: {
                type: "string",
                description: "The unique identifier of the message to update.",
              },
            },
            description: "Represents a single message update operation in the batch.",
          },
          description: "Array of message updates to perform. Maximum 20 items per batch (Microsoft Graph API limit). For larger workloads, chunk into multiple batch calls and retry any failures.",
        },
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) of the user whose messages to update, or 'me' for the currently authenticated user.",
        },
        response_detail: {
          type: "string",
          description: "Controls how much each PATCH sub-request returns from Microsoft Graph. 'minimal' (default) sets `Prefer: return=minimal` on each sub-request, so Graph returns 204 No Content per update — the response stays small even for the maximum 20 HTML messages. The action's response shape (BatchItemResult.status / .success / .error_message) is unchanged. 'full' omits the Prefer header so Graph returns the full updated-message body per sub-request (status 200) — useful only if you want to inspect the raw Graph response for debugging; otherwise stick with 'minimal' to avoid multi-MB batch responses.",
          enum: [
            "minimal",
            "full",
          ],
        },
      },
      required: [
        "updates",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch update messages.",
    ],
  }),
  composioTool({
    name: "outlook_calendar_create_event",
    description: "Creates a new Outlook calendar event, ensuring `start_datetime` is chronologically before `end_datetime`.",
    toolSlug: "OUTLOOK_CALENDAR_CREATE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "The body of the event. This can be in plain text or HTML format, as specified by the 'is_html' field. Optional - events can be created without a body.",
        },
        is_html: {
          type: "boolean",
          description: "Specifies whether the 'body' content is HTML. Set to true for HTML content; otherwise, it's treated as plain text.",
        },
        show_as: {
          type: "string",
          description: "The status to show on the calendar for the duration of the event. Valid values are: 'free', 'tentative', 'busy', 'oof' (out of office), 'workingElsewhere', 'unknown'.",
        },
        subject: {
          type: "string",
          description: "The subject of the calendar event.",
        },
        user_id: {
          type: "string",
          description: "The user identifier for the calendar owner. Must be either 'me' (for the authenticated user), a Microsoft 365 User Principal Name (e.g., user@contoso.com - must be a work/school account in the organization's verified domain), or an Azure AD object ID (GUID). Personal email addresses (Gmail, Yahoo, Outlook.com consumer accounts, etc.) are NOT valid and will result in a 404 error.",
        },
        location: {
          type: "string",
          description: "The physical location of the event.",
        },
        time_zone: {
          type: "string",
          description: "The time zone for the start and end times of the event. Uses Windows time zone names (e.g., 'Pacific Standard Time') or IANA time zone names (e.g., 'America/Los_Angeles'). UTC is also a valid input.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of category names to associate with the event. The API accepts any string values. For best compatibility with Outlook UI color-coding, use category names from the user's master category list. Category names are case-insensitive and duplicates will be automatically removed.",
        },
        importance: {
          type: "string",
          description: "The importance of the event. Valid values are 'low', 'normal', 'high'. Defaults to 'normal'.",
        },
        recurrence: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence range. The possible values are: endDate, noEnd, numbered.",
                },
                endDate: {
                  type: "string",
                  description: "The date to stop applying the recurrence pattern. Depending on the recurrence pattern of the event, the last occurrence of the meeting may not be this date. Required if type is endDate.",
                },
                startDate: {
                  type: "string",
                  description: "The date to start applying the recurrence pattern. The first occurrence of the meeting may be this date or later, depending on the recurrence pattern of the event. Must be the same value as the start property of the recurring event.",
                },
                recurrenceTimeZone: {
                  type: "string",
                  description: "Time zone for the startDate and endDate properties. Optional. If not specified, the time zone of the event is used.",
                },
                numberOfOccurrences: {
                  type: "integer",
                  description: "The number of times to repeat the event. Required and must be positive if type is numbered.",
                },
              },
              description: "The duration of a recurring event.",
            },
            pattern: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, relativeYearly.",
                },
                index: {
                  type: "string",
                  description: "Specifies on which instance of the allowed days specified in daysOfWeek the event occurs, counted from the first instance in the month. The possible values are: first, second, third, fourth, last. Default is first. Optional and used if type is relativeMonthly or relativeYearly.",
                },
                month: {
                  type: "integer",
                  description: "The month in which the event occurs. This is a number from 1 to 12.",
                },
                interval: {
                  type: "integer",
                  description: "The number of units between occurrences, where units can be in days, weeks, months, or years, depending on the type.",
                },
                dayOfMonth: {
                  type: "integer",
                  description: "The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.",
                },
                daysOfWeek: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A collection of the days of the week on which the event occurs. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday. If type is relativeMonthly or relativeYearly, and daysOfWeek specifies morethan one day, the event falls on the first day that satisfies the pattern. Required if type is weekly, relativeMonthly, or relativeYearly.",
                },
                firstDayOfWeek: {
                  type: "string",
                  description: "The first day of the week. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday. Default is sunday. Required if type is weekly.",
                },
              },
              description: "The frequency of a recurring event.",
            },
          },
          description: "The recurrence pattern and range for an event.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of a specific calendar to create the event in. Obtainable from the list calendars action. If omitted, the event is created on the user's default calendar.",
        },
        end_datetime: {
          type: "string",
          description: "The end date and time of the event in ISO 8601 format. Time zone is specified in 'time_zone'.",
        },
        attendees_info: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "A list of attendees for the event. Accepts multiple formats: (1) Simple email strings (e.g., ['user@example.com']), (2) Attendee objects with 'email' (required), 'name' (optional), and 'type' (optional: 'required', 'optional', 'resource', defaults to 'required'), (3) Microsoft Graph-style objects with nested 'emailAddress' containing 'address' and 'name' fields.",
        },
        start_datetime: {
          type: "string",
          description: "The start date and time of the event in ISO 8601 format. Time zone is specified in 'time_zone'.",
        },
        is_online_meeting: {
          type: "boolean",
          description: "Set to true to indicate that the event is an online meeting. This will automatically generate an online meeting link if 'online_meeting_provider' is set (e.g., a Microsoft Teams link).",
        },
        online_meeting_provider: {
          type: "string",
          description: "Specifies the online meeting provider. Currently, only 'teamsForBusiness' is supported. If 'is_online_meeting' is true and this is set, a meeting link for the provider will be created.",
        },
      },
      required: [
        "subject",
        "start_datetime",
        "end_datetime",
        "time_zone",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Calendar Event.",
    ],
  }),
  composioTool({
    name: "outlook_cancel_calendar_event",
    description: "Tool to cancel an event in a specific calendar for a specified user and send cancellation notifications to all attendees. Use when you need to cancel a meeting or event in a specific calendar on behalf of a user.",
    toolSlug: "OUTLOOK_CANCEL_CALENDAR_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Comment: {
          type: "string",
          description: "Optional text message sent to all attendees explaining the cancellation.",
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the calendar owner. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to cancel.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel user's calendar event.",
    ],
  }),
  composioTool({
    name: "outlook_cancel_calendar_group_calendar_event",
    description: "Tool to cancel an event in a user's calendar within a calendar group and send cancellation notifications to all attendees. Use when canceling a meeting or event for a specific user in a calendar that belongs to a calendar group.",
    toolSlug: "OUTLOOK_CANCEL_CALENDAR_GROUP_CALENDAR_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional text message sent to all attendees explaining the cancellation.",
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the calendar owner. Can be 'me' for the authenticated user or a specific user identifier.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to cancel.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group containing the target calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel user calendar group event.",
    ],
  }),
  composioTool({
    name: "outlook_cancel_event",
    description: "Tool to cancel a calendar event for a specified user and send cancellation notifications to all attendees. Use when you need to cancel a meeting or event on behalf of a specific user.",
    toolSlug: "OUTLOOK_CANCEL_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Comment: {
          type: "string",
          description: "Optional text message sent to all attendees explaining the cancellation.",
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the calendar owner. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to cancel.",
        },
      },
      required: [
        "user_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel user calendar event.",
    ],
  }),
  composioTool({
    name: "outlook_copy_mail_folder",
    description: "Tool to copy a user's mail folder and its contents to another folder. Use when you need to duplicate a folder structure for a specific user's mailbox.",
    toolSlug: "OUTLOOK_COPY_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Identifier of the user. Can be the user's ID, userPrincipalName (email address), or 'me' for the authenticated user.",
        },
        destination_id: {
          type: "string",
          description: "The folder ID or a well-known folder name where the folder should be copied to. The copied folder will be placed in this destination.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the mail folder to copy. Can be a folder ID or a well-known folder name (e.g., 'inbox', 'drafts', 'sentitems').",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy user's mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_copy_me_mail_folder",
    description: "Tool to copy a child mail folder to a destination folder. Use when you need to duplicate a folder structure.",
    toolSlug: "OUTLOOK_COPY_ME_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        destination_id: {
          type: "string",
          description: "The folder ID of the destination folder, or a well-known folder name. You can provide either the folder's Microsoft Graph ID (e.g., 'AAMkAGI0ZjExAAA=') or use a well-known name like 'inbox', 'drafts', 'sentitems', 'deleteditems', etc.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the parent mail folder containing the child folder to copy.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder to copy.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy child mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_copy_message",
    description: "Tool to copy an email message to another folder within the user's mailbox. Use when duplicating messages to multiple folders for organization.",
    toolSlug: "OUTLOOK_COPY_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to copy. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destination_id: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
      },
      required: [
        "message_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy message to folder.",
    ],
  }),
  composioTool({
    name: "outlook_copy_message_from_child_folder",
    description: "Tool to copy an email message from a child folder (nested folder) to another folder within the user's mailbox. Use when duplicating messages from nested folder structures.",
    toolSlug: "OUTLOOK_COPY_MESSAGE_FROM_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, user object ID, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to copy. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destinationId: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems', 'junkemail'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For folder IDs, obtain them from OUTLOOK_LIST_MAIL_FOLDERS. Folder IDs are base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=').",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the message. Obtain this from OUTLOOK_LIST_CHILD_MAIL_FOLDERS. Child folder IDs are base64-encoded strings (e.g., 'AAMkADAwATMwMAExAAA=').",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
        "destinationId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy message from child folder.",
    ],
  }),
  composioTool({
    name: "outlook_copy_message_from_mail_folder",
    description: "Tool to copy a message from a specific user's mail folder to another folder. Use when you need to duplicate a message from a known source folder to a destination folder for a specific user.",
    toolSlug: "OUTLOOK_COPY_MESSAGE_FROM_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to copy. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destinationId: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the source mail folder containing the message. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs. Can also use well-known folder names (e.g., 'inbox', 'drafts', 'sentitems').",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "destinationId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy user message from folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_attachment_upload_session",
    description: "Tool to create an upload session for large (>3 MB) message attachments. Use when you need to upload attachments in chunks.",
    toolSlug: "OUTLOOK_CREATE_ATTACHMENT_UPLOAD_SESSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or user principal name; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to attach to.",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment (e.g., 'report.pdf').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes; must be at least 3 MB (3,145,728 bytes).",
            },
            isInline: {
              type: "boolean",
              description: "Whether the attachment is inline in the message body.",
            },
            contentId: {
              type: "string",
              description: "Content-ID for inline attachments, referenced in HTML body if isInline is true.",
            },
            contentType: {
              type: "string",
              description: "MIME type of the attachment (e.g., 'application/pdf').",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; set to 'file' for file uploads.",
              enum: [
                "file",
                "item",
                "reference",
              ],
            },
          },
          description: "AttachmentItem object describing the attachment in the upload session.",
        },
      },
      required: [
        "message_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_attachment_upload_session_in_child_folder",
    description: "Tool to create an upload session for large (>3 MB) message attachments in child mail folders. Use when you need to upload attachments to messages in nested folder structures.",
    toolSlug: "OUTLOOK_CREATE_ATTACHMENT_UPLOAD_SESSION_IN_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or user principal name; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to attach to.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=').",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment (e.g., 'report.pdf').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes; must be at least 3 MB (3,145,728 bytes).",
            },
            isInline: {
              type: "boolean",
              description: "Whether the attachment is inline in the message body.",
            },
            contentId: {
              type: "string",
              description: "Content-ID for inline attachments, referenced in HTML body if isInline is true.",
            },
            contentType: {
              type: "string",
              description: "MIME type of the attachment (e.g., 'application/pdf').",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; set to 'file' for file uploads.",
              enum: [
                "file",
                "item",
                "reference",
              ],
            },
          },
          description: "AttachmentItem object describing the attachment in the upload session.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child mail folder. This is a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=').",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create attachment upload session in child folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_cal_group_event_attach_upload",
    description: "Tool to create an upload session for large calendar group event attachments. Use when attaching files larger than 3 MB to events in calendar groups.",
    toolSlug: "OUTLOOK_CREATE_CAL_GROUP_EVENT_ATTACH_UPLOAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or user principal name. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to attach the file to. Obtain from listing or searching calendar events.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group. Obtain from listing calendars in the group.",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment file (e.g., 'presentation.pdf', 'agenda.docx').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes. For large files (>3 MB), use upload sessions.",
            },
            isInline: {
              type: "boolean",
              description: "Set to true if the attachment should be inline (embedded in event body).",
            },
            contentId: {
              type: "string",
              description: "Content-ID (CID) for inline attachments, used to reference the attachment in HTML body.",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; must be 'file' for event attachment upload sessions.",
            },
          },
          description: "AttachmentItem object specifying the type, name, and size of the attachment to upload.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group. Obtain from listing calendar groups.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar group event attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar",
    description: "Tool to create a new calendar in the signed-in user's mailbox. Use when organizing events into a separate calendar.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The display name of the new calendar.",
        },
        color: {
          type: "string",
          description: "The theme color to assign to the calendar. Supported values: auto, lightBlue, lightGreen, lightOrange, lightGray, lightYellow, lightTeal, lightPink, lightBrown, lightPurple, lightRed.",
          enum: [
            "auto",
            "lightBlue",
            "lightGreen",
            "lightOrange",
            "lightGray",
            "lightYellow",
            "lightTeal",
            "lightPink",
            "lightBrown",
            "lightPurple",
            "lightRed",
          ],
        },
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or object ID of the user where the calendar will be created. Use 'me' for the signed-in user.",
        },
        hex_color: {
          type: "string",
          description: "An optional hexadecimal color code for the calendar in the format '#RRGGBB'.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "rooms_and_calendars",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_event_attachment",
    description: "Tool to create a new attachment for an event in a specific calendar. Use when you need to attach a file or item to an event within a particular calendar.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_EVENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload; required when '@odata.type' is itemAttachment.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        event_id: {
          type: "string",
          description: "The unique opaque identifier of the calendar event (NOT an email address). This is typically a long string starting with 'AAMkA' or 'AQMkA'. Obtain it from listing or searching calendar events.",
        },
        odata_type: {
          type: "string",
          description: "Attachment type: '#microsoft.graph.fileAttachment' requires 'contentBytes'; '#microsoft.graph.itemAttachment' requires 'item'.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
          ],
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar. This is typically a long string identifying the specific calendar.",
        },
        contentBytes: {
          type: "string",
          description: "MUST be base64-encoded file contents (not plain text); required when '@odata.type' is fileAttachment. Raw/plain text must be base64-encoded first.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar event attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_event_attachment_upload_session",
    description: "Tool to create an upload session for large calendar event attachments in a specific calendar. Use when attaching files larger than 3 MB to Outlook calendar events in a specific calendar.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_EVENT_ATTACHMENT_UPLOAD_SESSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID) or user principal name (email) whose calendar contains the event. Required for S2S (app-only) authentication. If not provided, uses the authenticated user context (/me endpoint).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to attach the file to. Obtain from listing or searching calendar events.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event. Obtain from listing calendars.",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment file (e.g., 'presentation.pdf', 'agenda.docx').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes. For large files (>3 MB), use upload sessions.",
            },
            isInline: {
              type: "boolean",
              description: "Set to true if the attachment should be inline (embedded in event body).",
            },
            contentId: {
              type: "string",
              description: "Content-ID (CID) for inline attachments, used to reference the attachment in HTML body.",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; must be 'file' for event attachment upload sessions.",
            },
          },
          description: "AttachmentItem object specifying the type, name, and size of the attachment to upload.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar event attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_event_in_calendar",
    description: "Tool to create a new event in a specific calendar for a user. Use when you need to create events in a specific calendar (e.g., shared or secondary calendars).",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_EVENT_IN_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-03-15T10:00:00).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses IANA time zone names (e.g., 'UTC', 'America/New_York') or Windows time zone names (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The end date, time, and time zone of the event.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body.",
            },
            contentType: {
              type: "string",
              description: "The format of the event body. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "The body content of an event.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-03-15T10:00:00).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses IANA time zone names (e.g., 'UTC', 'America/New_York') or Windows time zone names (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The start date, time, and time zone of the event.",
        },
        subject: {
          type: "string",
          description: "The subject/title of the event.",
        },
        user_id: {
          type: "string",
          description: "The user identifier for the calendar owner. Must be either 'me' (for the authenticated user), a Microsoft 365 User Principal Name (e.g., user@contoso.com), or an Azure AD object ID (GUID).",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            displayName: {
              type: "string",
              description: "The name of the location where the event will take place.",
            },
          },
          description: "Location information for an event.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The type of attendee. Valid values are 'required', 'optional', and 'resource'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the attendee.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the attendee.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
            description: "Event attendee information.",
          },
          description: "A list of attendees for the event. Optional - events can be created without attendees.",
        },
        recurrence: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence range. The possible values are: endDate, noEnd, numbered.",
                },
                endDate: {
                  type: "string",
                  description: "The date to stop applying the recurrence pattern. Required if type is endDate.",
                },
                startDate: {
                  type: "string",
                  description: "The date to start applying the recurrence pattern. Must be the same value as the start property of the recurring event.",
                },
                recurrenceTimeZone: {
                  type: "string",
                  description: "Time zone for the startDate and endDate properties. Optional. If not specified, the time zone of the event is used.",
                },
                numberOfOccurrences: {
                  type: "integer",
                  description: "The number of times to repeat the event. Required and must be positive if type is numbered.",
                },
              },
              description: "The duration of a recurring event.",
            },
            pattern: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, relativeYearly.",
                },
                index: {
                  type: "string",
                  description: "Specifies on which instance of the allowed days specified in daysOfWeek the event occurs. The possible values are: first, second, third, fourth, last.",
                },
                month: {
                  type: "integer",
                  description: "The month in which the event occurs. This is a number from 1 to 12.",
                },
                interval: {
                  type: "integer",
                  description: "The number of units between occurrences, where units can be in days, weeks, months, or years, depending on the type.",
                },
                dayOfMonth: {
                  type: "integer",
                  description: "The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.",
                },
                daysOfWeek: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A collection of the days of the week on which the event occurs. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday.",
                },
                firstDayOfWeek: {
                  type: "string",
                  description: "The first day of the week. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday. Default is sunday.",
                },
              },
              description: "The frequency of a recurring event.",
            },
          },
          description: "The recurrence pattern and range for an event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar where the event will be created. This allows creating events in specific calendars (e.g., shared calendars, secondary calendars).",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "True to indicate that the event is an online meeting. This will automatically generate an online meeting link if onlineMeetingProvider is set.",
        },
        allowNewTimeProposals: {
          type: "boolean",
          description: "True if the meeting organizer allows invitees to propose a new time when responding. Default is true.",
        },
        onlineMeetingProvider: {
          type: "string",
          description: "The online meeting provider. Currently, only 'teamsForBusiness' is supported.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "subject",
        "start",
        "end",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create event in specific calendar.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_group",
    description: "Tool to create a new calendar group for a user. Use when needing to organize calendars into groups.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the calendar group.",
        },
        user_id: {
          type: "string",
          description: "The user's principal name (UPN) or object ID. Must be an actual user ID (not 'me').",
        },
      },
      required: [
        "user_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar group.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_group_calendar_event_attachment",
    description: "Tool to create a new attachment for an event in a calendar within a calendar group for a specific user. Use when you need to attach a file or item to an event in a user's calendar group.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_GROUP_CALENDAR_EVENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload; required when '@odata.type' is itemAttachment.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as shortcut for authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique opaque identifier of the calendar event (NOT an email address). This is typically a long string starting with 'AAMkA' or 'AQMkA'. Obtain it from listing or searching calendar events.",
        },
        odata_type: {
          type: "string",
          description: "Attachment type: '#microsoft.graph.fileAttachment' requires 'contentBytes'; '#microsoft.graph.itemAttachment' requires 'item'.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
          ],
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        content_bytes: {
          type: "string",
          description: "MUST be base64-encoded file contents (not plain text); required when '@odata.type' is fileAttachment. Raw/plain text must be base64-encoded first.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the target calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar group event attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_group_calendar_event_extension",
    description: "Tool to create a new open extension on a calendar event within a specific calendar group and calendar. Use when you need to store custom data with an event.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_GROUP_CALENDAR_EVENT_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as shortcut for authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to add the extension to.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow the format 'Com.Company.ExtensionName' (e.g., Com.Contoso.EventTest).",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create event extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_calendar_permission",
    description: "Tool to create a calendar permission for a specific calendar in a calendar group. Use when granting access to a calendar for another user.",
    toolSlug: "OUTLOOK_CREATE_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission role to grant. Options: none (no access), freeBusyRead (view availability only), limitedRead (view availability and titles), read (view all event details), write (view and edit events), delegateWithoutPrivateEventAccess (delegate access excluding private events), delegateWithPrivateEventAccess (full delegate access including private events), custom (custom permissions).",
          enum: [
            "none",
            "freeBusyRead",
            "limitedRead",
            "read",
            "write",
            "delegateWithoutPrivateEventAccess",
            "delegateWithPrivateEventAccess",
            "custom",
          ],
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of the calendar to which the permission will be added.",
        },
        isRemovable: {
          type: "boolean",
          description: "True if the permission can be removed by the user, false otherwise. Optional.",
        },
        emailAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The display name of the person receiving the calendar permission.",
            },
            address: {
              type: "string",
              description: "The email address of the person receiving the calendar permission.",
            },
          },
          description: "Email address object containing the name and address of the person receiving the permission.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group containing the calendar.",
        },
        isInsideOrganization: {
          type: "boolean",
          description: "True if the user is inside the same organization as the calendar owner, false otherwise. Optional.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "emailAddress",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "rooms_and_calendars",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Calendar Permission.",
    ],
  }),
  composioTool({
    name: "outlook_create_contact",
    description: "Creates a new contact in a Microsoft Outlook user's contacts folder.",
    toolSlug: "OUTLOOK_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        notes: {
          type: "string",
          description: "Personal notes about the contact. These notes are stored as 'personalNotes' in the Outlook contact details.",
        },
        userId: {
          type: "string",
          description: "Identifier for the user whose contact list will be modified. Use 'me' for the authenticated user (recommended), or provide the user's object ID (GUID) or userPrincipalName (UPN). The UPN is typically in email format (e.g., 'user@contoso.com') and must match an existing user in your Azure AD tenant.",
        },
        surname: {
          type: "string",
          description: "The contact's surname (last name).",
        },
        birthday: {
          type: "string",
          description: "The contact's birthday in 'YYYY-MM-DD' format. The time component will be set to midnight UTC (e.g., '1990-01-01' becomes '1990-01-01T00:00:00Z' in the API request).",
        },
        jobTitle: {
          type: "string",
          description: "The contact's job title.",
        },
        givenName: {
          type: "string",
          description: "The contact's given (first) name.",
        },
        homePhone: {
          type: "string",
          description: "The contact's home phone number. If provided, this will be stored in Outlook as a list containing this single number.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of categories to assign to the contact.",
        },
        department: {
          type: "string",
          description: "The department the contact belongs to within their company.",
        },
        companyName: {
          type: "string",
          description: "The name of the company the contact is associated with.",
        },
        displayName: {
          type: "string",
          description: "The contact's display name, typically their full name.",
        },
        mobilePhone: {
          type: "string",
          description: "The contact's mobile phone number.",
        },
        businessPhones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of business phone numbers for the contact. Each number should be a string.",
        },
        emailAddresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name for the contact's email address.",
              },
              address: {
                type: "string",
                description: "The contact's email address.",
              },
            },
          },
          description: "A list of email addresses for the contact. Each item must be an object with an `address` field (string) and optionally a `name` field (e.g., `[{'address': 'jane@example.com', 'name': 'Jane Doe'}]`). Plain strings are not accepted.",
        },
        officeLocation: {
          type: "string",
          description: "The contact's office location.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact.",
    ],
  }),
  composioTool({
    name: "outlook_create_contact_folder",
    description: "Tool to create a new contact folder in the user's mailbox. Use when needing to organize contacts into custom folders.",
    toolSlug: "OUTLOOK_CREATE_CONTACT_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's principal name or object ID. Use 'me' for the authenticated user.",
        },
        display_name: {
          type: "string",
          description: "The display name of the new contact folder.",
        },
        parent_folder_id: {
          type: "string",
          description: "The ID of the parent contact folder. If omitted, created under the default contacts folder.",
        },
      },
      required: [
        "display_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_contact_folder_child_folder",
    description: "Tool to create a child contact folder within a parent contact folder for a specific user. Use when you need to organize contacts into nested folder hierarchies for a given user.",
    toolSlug: "OUTLOOK_CREATE_CONTACT_FOLDER_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as a shortcut for the authenticated user, or provide user ID or userPrincipalName.",
        },
        displayName: {
          type: "string",
          description: "The display name of the new child contact folder.",
        },
        contact_folder_id: {
          type: "string",
          description: "The ID of the parent contact folder under which to create the child folder.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "displayName",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user contact folder child folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_draft",
    description: "Creates a new Outlook email draft with subject, body, recipients, and an optional attachment. This action creates a standalone draft for new conversations. To create a draft reply to an existing conversation/message, use the OUTLOOK_CREATE_DRAFT_REPLY action instead.",
    toolSlug: "OUTLOOK_CREATE_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Content of the email draft; use `is_html` to specify if HTML or plain text.",
        },
        is_html: {
          type: "boolean",
          description: "Specifies if the `body` is HTML. If `False`, `body` is plain text. Set to `True` when `body` contains HTML markup; otherwise markup renders as literal text.",
        },
        subject: {
          type: "string",
          description: "Subject line for the email draft.",
        },
        user_id: {
          type: "string",
          description: "User ID (GUID) or user principal name (email) for S2S (app-only) authentication. Required when using application permissions. If not provided, defaults to '/me' endpoint for delegated authentication.",
        },
        attachment: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "Optional file to attach. If provided, must include the file's content, name, and mimetype. Required keys: `name` (filename string), `mimetype` (MIME type string), and either `contentBytes` (base64-encoded content) or `s3key` (key from ONE_DRIVE_DOWNLOAD_FILE). Omitting any required key causes the request to fail. Stale or malformed `s3key` values cause storage-level errors.",
        },
        cc_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of CC (carbon copy) recipient email addresses. Must be provided as an array of strings, e.g., [\"cc@example.com\"].",
        },
        to_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of primary 'To' recipient email addresses. Must be provided as an array of strings, e.g., [\"user@example.com\"] for a single recipient or [\"user1@example.com\", \"user2@example.com\"] for multiple recipients. Do not pass as a JSON-encoded string. Can be omitted when creating a draft to be completed later. To send the draft, at least one valid address must be present across `to_recipients`, `cc_recipients`, or `bcc_recipients`.",
        },
        bcc_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of BCC (blind carbon copy) recipient email addresses. Must be provided as an array of strings, e.g., [\"bcc@example.com\"].",
        },
      },
      required: [
        "subject",
        "body",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create email draft.",
    ],
  }),
  composioTool({
    name: "outlook_create_draft_reply",
    description: "Creates a draft reply in the specified user's Outlook mailbox to an existing message (identified by a valid `message_id`), optionally including a `comment` and CC/BCC recipients.",
    toolSlug: "OUTLOOK_CREATE_DRAFT_REPLY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Plain text comment to include in the body of the reply draft.",
        },
        user_id: {
          type: "string",
          description: "User's mailbox identifier (email or 'me') for the original message and new draft location.",
        },
        cc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to add as CC recipients to the draft reply.",
        },
        bcc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to add as BCC recipients to the draft reply.",
        },
        message_id: {
          type: "string",
          description: "Required. Unique ID of the message to reply to. Obtain this from actions like 'List Messages', 'Get Message', or 'Search Messages'.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a draft reply.",
    ],
  }),
  composioTool({
    name: "outlook_create_email_rule",
    description: "Create email rule filter with conditions and actions",
    toolSlug: "OUTLOOK_CREATE_EMAIL_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        actions: {
          type: "object",
          additionalProperties: true,
          properties: {
            delete: {
              type: "boolean",
              description: "Whether to delete matching messages.",
            },
            forwardTo: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of email addresses to forward matching messages to.",
            },
            markAsRead: {
              type: "boolean",
              description: "Whether to mark matching messages as read.",
            },
            copyToFolder: {
              type: "string",
              description: "Folder ID to copy matching messages to.",
            },
            moveToFolder: {
              type: "string",
              description: "Folder ID to move matching messages to.",
            },
            assignCategories: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of categories to assign to matching messages.",
            },
            stopProcessingRules: {
              type: "boolean",
              description: "If true, stops processing other rules after this rule's actions execute. Useful for priority rules where you want to prevent lower-priority rules from running. Example: High-priority sender rule that moves to VIP folder and stops other filing rules.",
            },
          },
          description: "Actions to take when the rule conditions are met.",
        },
        user_id: {
          type: "string",
          description: "User ID or principal name for app-only (S2S) authentication. Required for application permissions. Use the user's GUID or email address (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f' or 'user@domain.com').",
        },
        sequence: {
          type: "integer",
          description: "Order in which the rule is executed (lower numbers execute first, minimum value is 1).",
        },
        conditions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Conditions that must be met for the rule to apply.",
        },
        is_enabled: {
          type: "boolean",
          description: "Whether the rule is enabled.",
        },
        display_name: {
          type: "string",
          description: "Display name for the email rule.",
        },
      },
      required: [
        "display_name",
        "conditions",
        "actions",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
      "automation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Email Rule.",
    ],
  }),
  composioTool({
    name: "outlook_create_event_attachment",
    description: "Tool to create a new attachment for a user's calendar event. Use when you need to attach a file or item to an existing event in a specific user's calendar.",
    toolSlug: "OUTLOOK_CREATE_EVENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload; required when '@odata.type' is '#microsoft.graph.itemAttachment'.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or user ID. Use 'me' for the authenticated user or provide the user's email address.",
        },
        event_id: {
          type: "string",
          description: "The unique opaque identifier of the calendar event. This is typically a long string starting with 'AAMkA' or 'AQMkA'. Obtain it from listing or searching calendar events.",
        },
        odata_type: {
          type: "string",
          description: "Attachment type: '#microsoft.graph.fileAttachment' requires 'contentBytes'; '#microsoft.graph.itemAttachment' requires 'item'.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
          ],
        },
        contentBytes: {
          type: "string",
          description: "MUST be base64-encoded file contents (not plain text); required when '@odata.type' is '#microsoft.graph.fileAttachment'. Raw/plain text must be base64-encoded first.",
        },
      },
      required: [
        "user_id",
        "event_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar event attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_event_attachment_upload_session",
    description: "Tool to create an upload session for large calendar event attachments. Use when attaching files larger than 3 MB to Outlook calendar events.",
    toolSlug: "OUTLOOK_CREATE_EVENT_ATTACHMENT_UPLOAD_SESSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or user principal name; use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to attach the file to. Obtain from listing or searching calendar events.",
        },
        attachmentItem: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment file (e.g., 'presentation.pdf', 'agenda.docx').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes. For large files (>3 MB), use upload sessions.",
            },
            isInline: {
              type: "boolean",
              description: "Set to true if the attachment should be inline (embedded in event body).",
            },
            contentId: {
              type: "string",
              description: "Content-ID (CID) for inline attachments, used to reference the attachment in HTML body.",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; must be 'file' for event attachment upload sessions.",
            },
          },
          description: "AttachmentItem object specifying the type, name, and size of the attachment to upload.",
        },
      },
      required: [
        "event_id",
        "attachmentItem",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create event attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_forward_draft",
    description: "Tool to create a forward draft of an Outlook message for a specific user. Use when you need to prepare a forward email that can be edited before sending. The draft is created in the Drafts folder with the FW: prefix in the subject line.",
    toolSlug: "OUTLOOK_CREATE_FORWARD_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional comment to include in the body of the forward draft. This text appears before the original message content.",
        },
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user. Use 'me' to access your own mailbox or specify another user's email address.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to create a forward draft for. This is a base64-encoded string typically starting with 'AAMk' or 'AQMk'. Obtain this from list messages, get message, or search messages actions. Do NOT use email addresses or conversation IDs.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of email addresses to set as recipients for the forward draft. Recipients can be added or modified later by updating the draft before sending.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. Valid well-known names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For other folders, use the base64-encoded folder ID obtained from list mail folders actions.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user mail folder message forward draft.",
    ],
  }),
  composioTool({
    name: "outlook_create_mail_folder",
    description: "Tool to create a new mail folder. Use when you need to organize email into a new folder.",
    toolSlug: "OUTLOOK_CREATE_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Identifier for the user whose mailbox the folder will be created in. Use 'me' for the authenticated user or provide the user's principal name or ID.",
        },
        is_hidden: {
          type: "boolean",
          description: "Indicates whether the new folder is hidden. Default is false. Once set, this property cannot be updated.",
        },
        display_name: {
          type: "string",
          description: "The display name of the new mail folder.",
        },
        return_existing_if_exists: {
          type: "boolean",
          description: "If true and a folder with the same name already exists, return the existing folder instead of raising an error. This makes the operation idempotent.",
        },
      },
      required: [
        "display_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_mail_folder_message",
    description: "Tool to create a new message in a specific mail folder. Use when you need to create a draft message in a particular folder (e.g., drafts, custom folders).",
    toolSlug: "OUTLOOK_CREATE_MAIL_FOLDER_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The content of the message body.",
            },
            contentType: {
              type: "string",
              description: "The type of the content. Possible values: Text, HTML.",
            },
          },
          description: "Message body content with content type.",
        },
        subject: {
          type: "string",
          description: "The subject line of the message.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder where the message will be created. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
        ccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Email recipient wrapper containing an email address.",
          },
          description: "The Cc: recipients for the message.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Email recipient wrapper containing an email address.",
          },
          description: "The To: recipients for the message.",
        },
        bccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Email recipient wrapper containing an email address.",
          },
          description: "The Bcc: recipients for the message.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create message in mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_mail_folder_message_attachment",
    description: "Tool to add an attachment to a message in a specific mail folder. Use when you need to attach a file to a message located in a particular mail folder.",
    toolSlug: "OUTLOOK_CREATE_MAIL_FOLDER_MESSAGE_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "Embedded item (e.g., message, event) for itemAttachment; must include its own '@odata.type'.",
        },
        name: {
          type: "string",
          description: "Display name of the attachment (e.g., file name). Required when using content_bytes. When using the attachment field, the name is automatically inferred.",
        },
        user_id: {
          type: "string",
          description: "The user ID or user principal name (email) to access mailbox data for. Required for app-only (S2S) authentication. For delegated auth, uses /me endpoint. Can be a GUID (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f') or email (e.g., 'user@domain.com').",
        },
        isInline: {
          type: "boolean",
          description: "Set to true if the attachment should appear inline in the message body.",
        },
        contentId: {
          type: "string",
          description: "Content ID for inline attachments, used in HTML body references.",
        },
        attachment: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "File to attach to the email. Either provide this field OR use 'content_bytes'. Cannot be used together with 'content_bytes'.",
        },
        message_id: {
          type: "string",
          description: "Unique Microsoft Graph message ID (opaque string like 'AAMkAGI2TAAA='). NOT an email address - this is an internal identifier returned by Microsoft Graph API operations.",
        },
        odata_type: {
          type: "string",
          description: "The OData type of the attachment. Required by Microsoft Graph API. Use '#microsoft.graph.fileAttachment' for file attachments, '#microsoft.graph.itemAttachment' for embedded items (messages, events, contacts).",
        },
        contentType: {
          type: "string",
          description: "MIME type of the attachment (e.g., 'application/pdf'). Required when using content_bytes. When using the attachment field, the mimetype is automatically inferred.",
        },
        contentBytes: {
          type: "string",
          description: "Base64-encoded content of the file attachment (max size 3 MB). Either provide this field OR use the 'attachment' field (recommended). Cannot be used together with 'attachment'.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from list mail folders operations.",
        },
        contentLocation: {
          type: "string",
          description: "URL location or path for reference attachments.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create mail folder message attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_mail_folder_message_attachment_upload_session",
    description: "Tool to create an upload session for large (>3 MB) message attachments in a specific mail folder. Use when you need to upload attachments in chunks to a message located in a mail folder.",
    toolSlug: "OUTLOOK_CREATE_MAIL_FOLDER_MESSAGE_ATTACHMENT_UPLOAD_SESSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or user principal name; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to attach to.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message.",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment (e.g., 'report.pdf').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes; must be at least 3 MB (3,145,728 bytes).",
            },
            isInline: {
              type: "boolean",
              description: "Whether the attachment is inline in the message body.",
            },
            contentId: {
              type: "string",
              description: "Content-ID for inline attachments, referenced in HTML body if isInline is true.",
            },
            contentType: {
              type: "string",
              description: "MIME type of the attachment (e.g., 'application/pdf').",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; set to 'file' for file uploads.",
              enum: [
                "file",
                "item",
                "reference",
              ],
            },
          },
          description: "AttachmentItem object describing the attachment in the upload session.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create mail folder message attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_mail_folder_message_rule",
    description: "Tool to create a message rule in a user's mail folder. Use when automating message processing with filters and actions.",
    toolSlug: "OUTLOOK_CREATE_MAIL_FOLDER_MESSAGE_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        actions: {
          type: "object",
          additionalProperties: true,
          properties: {
            delete: {
              type: "boolean",
              description: "Whether to delete matching messages.",
            },
            forwardTo: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of email addresses to forward matching messages to.",
            },
            markAsRead: {
              type: "boolean",
              description: "Whether to mark matching messages as read.",
            },
            copyToFolder: {
              type: "string",
              description: "Folder ID to copy matching messages to.",
            },
            moveToFolder: {
              type: "string",
              description: "Folder ID to move matching messages to.",
            },
            assignCategories: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of categories to assign to matching messages.",
            },
            stopProcessingRules: {
              type: "boolean",
              description: "If true, stops processing other rules after this rule's actions execute. Useful for priority rules where you want to prevent lower-priority rules from running. Example: High-priority sender rule that moves to VIP folder and stops other filing rules.",
            },
          },
          description: "Actions to take when the rule conditions are met.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' shortcut for /me/ path or actual user ID for /users/{user_id}/ path.",
        },
        sequence: {
          type: "integer",
          description: "Order in which the rule is executed (lower numbers execute first, minimum value is 1).",
        },
        conditions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Conditions that trigger the rule actions.",
        },
        exceptions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Conditions that trigger the rule actions.",
        },
        is_enabled: {
          type: "boolean",
          description: "Whether the rule is enabled.",
        },
        display_name: {
          type: "string",
          description: "Display name for the message rule.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the mail folder where the message rule will be created.",
        },
      },
      required: [
        "mail_folder_id",
        "display_name",
        "sequence",
        "actions",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create User Mail Folder Message Rule.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_calendar_event_extension",
    description: "Tool to create a new open extension on a calendar event for a specific user. Use when you need to store custom data with an event.",
    toolSlug: "OUTLOOK_CREATE_ME_CALENDAR_EVENT_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user identifier for the calendar owner. Must be either 'me' (for the authenticated user), a Microsoft 365 User Principal Name (e.g., user@contoso.com), or an Azure AD object ID (GUID).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to add the extension to.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow the format 'Com.Company.ExtensionName' (e.g., Com.Contoso.TestExtension).",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar event extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_calendar_permission",
    description: "Tool to create a new calendar permission for a specific user's calendar. Use when you need to share another user's calendar with someone or grant access with specific permission levels.",
    toolSlug: "OUTLOOK_CREATE_ME_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission role to grant. freeBusyRead: view free/busy status only. limitedRead: view free/busy status, titles and locations. read: view all details except private events. write: view all details except private events and edit events.",
          enum: [
            "freeBusyRead",
            "limitedRead",
            "read",
            "write",
          ],
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user whose calendar permissions will be modified. Cannot use 'me' shortcut - must be actual user ID or userPrincipalName.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to which permissions will be added.",
        },
        isRemovable: {
          type: "boolean",
          description: "Whether the permission can be removed in the future. If set to true, the recipient can later be removed from the calendar permissions. Optional parameter.",
        },
        emailAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The display name of the person or entity to grant permission to.",
            },
            address: {
              type: "string",
              description: "The email address of the person or entity to grant permission to.",
            },
          },
          description: "Email address information (name and address) of the person or entity to grant calendar permission to.",
        },
        isInsideOrganization: {
          type: "boolean",
          description: "Whether the recipient is inside the same organization as the calendar owner. Optional parameter.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "emailAddress",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar permission.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_child_folder_message",
    description: "Tool to create a new draft message in a child folder within a user's mail folder. Use when creating messages in nested folder structures for a specific user's mailbox.",
    toolSlug: "OUTLOOK_CREATE_ME_CHILD_FOLDER_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The text or HTML content of the message body.",
            },
            contentType: {
              type: "string",
              description: "The type of the content. Possible values are 'Text' (plain text) or 'HTML' (HTML content).",
            },
          },
          description: "The body of the message.",
        },
        subject: {
          type: "string",
          description: "The subject of the message.",
        },
        user_id: {
          type: "string",
          description: "Identifier of the user. Can be the user's ID, userPrincipalName (email address), or 'me' for the authenticated user.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of categories to assign to the message.",
        },
        importance: {
          type: "string",
          description: "The importance of the message. Possible values are 'low', 'normal', or 'high'.",
        },
        ccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The Cc: recipients for the message.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The To: recipients for the message.",
        },
        bccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The Bcc: recipients for the message.",
        },
        mail_folder_id: {
          type: "string",
          description: "Identifier of the parent mail folder. Must be a valid mail folder ID.",
        },
        child_folder_id: {
          type: "string",
          description: "Identifier of the child folder where the message will be created. Must be a valid child folder ID within the specified parent mail folder.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create message in user's child folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_contact_folders_contacts",
    description: "Tool to create a new contact in a specific user's contact folder. Use when you need to add a contact to a particular folder for a specified user.",
    toolSlug: "OUTLOOK_CREATE_ME_CONTACT_FOLDERS_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        notes: {
          type: "string",
          description: "Personal notes about the contact. These notes are stored as 'personalNotes' in the Outlook contact details.",
        },
        userId: {
          type: "string",
          description: "The unique identifier of the user whose contact folder will be modified. Can be the user's object ID (GUID) or userPrincipalName (e.g., 'user@contoso.com').",
        },
        surname: {
          type: "string",
          description: "The contact's surname (last name).",
        },
        birthday: {
          type: "string",
          description: "The contact's birthday in 'YYYY-MM-DD' format. The time component will be set to midnight UTC (e.g., '1990-01-01' becomes '1990-01-01T00:00:00Z' in the API request).",
        },
        jobTitle: {
          type: "string",
          description: "The contact's job title.",
        },
        givenName: {
          type: "string",
          description: "The contact's given (first) name.",
        },
        homePhone: {
          type: "string",
          description: "The contact's home phone number. If provided, this will be stored in Outlook as a list containing this single number.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of categories to assign to the contact.",
        },
        department: {
          type: "string",
          description: "The department the contact belongs to within their company.",
        },
        companyName: {
          type: "string",
          description: "The name of the company the contact is associated with.",
        },
        displayName: {
          type: "string",
          description: "The contact's display name, typically their full name.",
        },
        mobilePhone: {
          type: "string",
          description: "The contact's mobile phone number.",
        },
        businessPhones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of business phone numbers for the contact. Each number should be a string.",
        },
        emailAddresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name for the contact's email address.",
              },
              address: {
                type: "string",
                description: "The contact's email address.",
              },
            },
          },
          description: "A list of email addresses for the contact.",
        },
        officeLocation: {
          type: "string",
          description: "The contact's office location.",
        },
        contactFolderId: {
          type: "string",
          description: "Identifier of the contact folder where the new contact will be created. Must be a valid contact folder ID obtained from 'Get Contact Folders' or 'List Contact Folders'.",
        },
      },
      required: [
        "userId",
        "contactFolderId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user contact in folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_contact_folders_contacts_extensions",
    description: "Tool to create a new open extension on a contact within a user's contact folder. Use when you need to store custom data with a contact.",
    toolSlug: "OUTLOOK_CREATE_ME_CONTACT_FOLDERS_CONTACTS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's object ID (GUID) or userPrincipalName (e.g., 'user@contoso.com').",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to add the extension to.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow reverse DNS format (e.g., com.contoso.extensionName).",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "contact_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user contact extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_contact_folders_extensions",
    description: "Tool to create a new open extension on a contact within a child folder. Use when you need to store custom data with a contact.",
    toolSlug: "OUTLOOK_CREATE_ME_CONTACT_FOLDERS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier or user principal name (UPN) of the user. Required for S2S (app-only) authentication. If not provided, uses /me/ endpoint for delegated authentication.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to add the extension to.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow reverse DNS format (e.g., com.contoso.extensionName).",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the contact folder.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_contact_in_child_folder",
    description: "Tool to create a new contact in a child folder within a contact folder. Use when you need to add a contact to a specific nested folder structure.",
    toolSlug: "OUTLOOK_CREATE_ME_CONTACT_IN_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        notes: {
          type: "string",
          description: "Personal notes about the contact. These notes are stored as 'personalNotes' in the Outlook contact details.",
        },
        surname: {
          type: "string",
          description: "The contact's surname (last name).",
        },
        user_id: {
          type: "string",
          description: "The user's principal name or object ID. Use 'me' for the authenticated user.",
        },
        birthday: {
          type: "string",
          description: "The contact's birthday in 'YYYY-MM-DD' format. The time component will be set to midnight UTC (e.g., '1990-01-01' becomes '1990-01-01T00:00:00Z' in the API request).",
        },
        jobTitle: {
          type: "string",
          description: "The contact's job title.",
        },
        givenName: {
          type: "string",
          description: "The contact's given (first) name.",
        },
        homePhone: {
          type: "string",
          description: "The contact's home phone number. If provided, this will be stored in Outlook as a list containing this single number.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of categories to assign to the contact.",
        },
        department: {
          type: "string",
          description: "The department the contact belongs to within their company.",
        },
        companyName: {
          type: "string",
          description: "The name of the company the contact is associated with.",
        },
        displayName: {
          type: "string",
          description: "The contact's display name, typically their full name.",
        },
        mobilePhone: {
          type: "string",
          description: "The contact's mobile phone number.",
        },
        businessPhones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of business phone numbers for the contact. Each number should be a string.",
        },
        emailAddresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name for the contact's email address.",
              },
              address: {
                type: "string",
                description: "The contact's email address.",
              },
            },
          },
          description: "A list of email addresses for the contact.",
        },
        officeLocation: {
          type: "string",
          description: "The contact's office location.",
        },
        child_folder_id: {
          type: "string",
          description: "Identifier of the child folder within the contact folder where the new contact will be created.",
        },
        contact_folder_id: {
          type: "string",
          description: "Identifier of the parent contact folder. Must be a valid contact folder ID.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact in child folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_event",
    description: "Tool to create a new calendar event for a specific user. Use when you need to create events in a user's calendar.",
    toolSlug: "OUTLOOK_CREATE_ME_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-03-15T10:00:00).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses IANA time zone names (e.g., 'UTC', 'America/New_York') or Windows time zone names (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The end date, time, and time zone of the event.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body.",
            },
            contentType: {
              type: "string",
              description: "The format of the event body. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "The body content of an event.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-03-15T10:00:00).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses IANA time zone names (e.g., 'UTC', 'America/New_York') or Windows time zone names (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The start date, time, and time zone of the event.",
        },
        subject: {
          type: "string",
          description: "The subject/title of the event.",
        },
        user_id: {
          type: "string",
          description: "The user identifier for the calendar owner. Must be either 'me' (for the authenticated user), a Microsoft 365 User Principal Name (e.g., user@contoso.com), or an Azure AD object ID (GUID).",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            displayName: {
              type: "string",
              description: "The name of the location where the event will take place.",
            },
          },
          description: "Location information for an event.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The type of attendee. Valid values are 'required', 'optional', and 'resource'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the attendee.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the attendee.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
            description: "Event attendee information.",
          },
          description: "A list of attendees for the event. Optional - events can be created without attendees.",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "True to indicate that the event is an online meeting. This will automatically generate an online meeting link if onlineMeetingProvider is set.",
        },
        allowNewTimeProposals: {
          type: "boolean",
          description: "True if the meeting organizer allows invitees to propose a new time when responding. Default is true.",
        },
        onlineMeetingProvider: {
          type: "string",
          description: "The online meeting provider. Currently, only 'teamsForBusiness' is supported.",
        },
      },
      required: [
        "subject",
        "start",
        "end",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar event for user.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_event_attachment_upload_session",
    description: "Tool to create an upload session for large event attachments. Use when attaching files larger than 3 MB to the authenticated user's Outlook events.",
    toolSlug: "OUTLOOK_CREATE_ME_EVENT_ATTACHMENT_UPLOAD_SESSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID) or user principal name (email) to create the upload session for. Required for S2S (app-only) authentication. If not provided, uses the authenticated user context (/me endpoint).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to attach the file to. Obtain from listing or searching events.",
        },
        attachment_item: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Display name of the attachment file (e.g., 'presentation.pdf', 'report.docx').",
            },
            size: {
              type: "integer",
              description: "Size of the attachment in bytes. For large files (>3 MB), use upload sessions.",
            },
            isInline: {
              type: "boolean",
              description: "Set to true if the attachment should be inline (embedded in event body).",
            },
            contentId: {
              type: "string",
              description: "Content-ID (CID) for inline attachments, used to reference the attachment in HTML body.",
            },
            attachmentType: {
              type: "string",
              description: "Type of the attachment; must be 'file' for event attachment upload sessions.",
            },
          },
          description: "AttachmentItem object specifying the type, name, and size of the attachment to upload.",
        },
      },
      required: [
        "event_id",
        "attachment_item",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create me event attachment upload session.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_forward_draft",
    description: "Tool to create a draft forward of an existing message. Use when you need to prepare a forward that can be edited before sending. The draft can be updated with recipients and additional content before being sent.",
    toolSlug: "OUTLOOK_CREATE_ME_FORWARD_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional comment to include in the body of the forward draft.",
        },
        user_id: {
          type: "string",
          description: "User's mailbox identifier (email or 'me') for the original message and new draft location.",
        },
        message_id: {
          type: "string",
          description: "Required. Unique ID of the message to forward. Obtain this from actions like 'List Messages', 'Get Message', or 'Search Messages'.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create forward draft.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_inference_classification_override",
    description: "Tool to create a Focused Inbox override for a sender identified by SMTP address for a specific user. Use when you need to configure messages from a specific sender to always be classified as focused or other for a particular user.",
    toolSlug: "OUTLOOK_CREATE_ME_INFERENCE_CLASSIFICATION_OVERRIDE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be user ID (GUID) or user principal name (UPN).",
        },
        classify_as: {
          type: "string",
          description: "How messages from the specified sender should always be classified. Must be either 'focused' or 'other'.",
          enum: [
            "focused",
            "other",
          ],
        },
        sender_email_address: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The display name of the sender.",
            },
            address: {
              type: "string",
              description: "The SMTP address of the sender.",
            },
          },
          description: "Email address information for the sender to create the override for.",
        },
      },
      required: [
        "user_id",
        "classify_as",
        "sender_email_address",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "inference_classification",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user Focused Inbox override.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_message_reply_all_draft",
    description: "Tool to create a draft reply-all to a user's message. Use when you need to create a draft reply to the sender and all recipients of an email message in a user's mailbox.",
    toolSlug: "OUTLOOK_CREATE_ME_MESSAGE_REPLY_ALL_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional plain text comment to include in the body of the reply-all draft.",
        },
        user_id: {
          type: "string",
          description: "User's email address, user principal name (UPN), or 'me' for the currently authenticated user. Use 'me' to access your own mailbox or specify another user's email address.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to create a reply-all draft for. This is a base64-encoded string typically starting with 'AAMk' or 'AQMk'. Obtain this from list messages, get message, or search messages actions. Do NOT use email addresses or conversation IDs.",
        },
      },
      required: [
        "user_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create reply-all draft for user message.",
    ],
  }),
  composioTool({
    name: "outlook_create_me_reply_all_draft",
    description: "Tool to create a draft reply-all to a message in a child folder. Use when you need to create a draft reply to the sender and all recipients of a message located in a subfolder within a mail folder.",
    toolSlug: "OUTLOOK_CREATE_ME_REPLY_ALL_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional plain text comment to include in the body of the reply-all draft.",
        },
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user. Use 'me' to access your own mailbox or specify another user's email address.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to create a reply-all draft for. This is a base64-encoded string typically starting with 'AAMk' or 'AQMk'. Obtain this from list messages, get message, or search messages actions. Do NOT use email addresses or conversation IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Valid well-known names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For other folders, use the base64-encoded folder ID obtained from list mail folders actions.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder (subfolder) within the parent mail folder. This is a base64-encoded folder ID obtained from list mail folders actions. Child folders are nested folders within a parent folder.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create reply-all draft for child folder message.",
    ],
  }),
  composioTool({
    name: "outlook_create_message_attachment",
    description: "Tool to create an attachment for a message. Use when you need to attach a file or item to an existing message. Supports file attachments, item attachments, and reference attachments.",
    toolSlug: "OUTLOOK_CREATE_MESSAGE_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          properties: {
            "@odata.type": {
              type: "string",
              description: "Type of the attached item (e.g., #microsoft.graph.message)",
            },
          },
          description: "Generic payload for item attachments. Accepts any additional fields.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the authenticated user. For S2S connections, pass the specific user ID.",
        },
        isInline: {
          type: "boolean",
          description: "Set to true if the attachment should appear inline in the message body.",
        },
        contentId: {
          type: "string",
          description: "Content ID for inline attachments, used in HTML body references.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to add the attachment to.",
        },
        odata_type: {
          type: "string",
          description: "Type of attachment to create. Use '#microsoft.graph.fileAttachment' for files, '#microsoft.graph.itemAttachment' for embedded items, or '#microsoft.graph.referenceAttachment' for references.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
            "#microsoft.graph.referenceAttachment",
          ],
        },
        contentType: {
          type: "string",
          description: "The MIME type of the attachment (e.g., 'text/plain', 'application/pdf').",
        },
        contentBytes: {
          type: "string",
          description: "Base64-encoded file contents. Required when '@odata.type' is fileAttachment. Must be valid base64.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', etc. For custom folders, use the actual folder ID. Optional - if not provided, the message will be accessed directly by ID.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child mail folder containing the message. This must be a base64-encoded folder ID. Only used when mail_folder_id is specified. Well-known names are NOT valid for child folders.",
        },
        contentLocation: {
          type: "string",
          description: "URL location or path for reference attachments.",
        },
      },
      required: [
        "message_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create message attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_reply_all_draft",
    description: "Tool to create a reply-all draft for a message in a mail folder. Use when you need to create a draft reply to all recipients of an email.",
    toolSlug: "OUTLOOK_CREATE_REPLY_ALL_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Plain text comment to include in the body of the reply-all draft.",
        },
        user_id: {
          type: "string",
          description: "User's mailbox identifier (email or 'me') for the original message and new draft location.",
        },
        message_id: {
          type: "string",
          description: "Required. Unique ID of the message to reply to. Obtain this from actions like 'List Messages', 'Get Message', or 'Search Messages'.",
        },
        mail_folder_id: {
          type: "string",
          description: "Required. The unique identifier of the mail folder containing the message to reply to. Obtain this from actions like 'List Mail Folders' or 'Get Mail Folder'.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create reply-all draft in folder.",
    ],
  }),
  composioTool({
    name: "outlook_create_task",
    description: "Tool to create a new task in Microsoft To Do within a specified task list. Use when adding tasks with title, due dates, reminders, importance levels, descriptions, categories, and linked resources.",
    toolSlug: "OUTLOOK_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The content of the task body.",
            },
            contentType: {
              type: "string",
              description: "The type of the content. Use 'text' for plain text or 'html' for HTML formatted content.",
            },
          },
          description: "Task body content with content type.",
        },
        title: {
          type: "string",
          description: "The title of the task. This is the main text displayed for the task.",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user (delegated auth) or a specific user ID for app-only (S2S) authentication.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of category labels to organize the task (e.g., tags for filtering or grouping tasks).",
        },
        importance: {
          type: "string",
          description: "The importance level of the task. Must be one of: 'low', 'normal', or 'high'. Defaults to 'normal' if not specified.",
        },
        dueDateTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-01-15T14:30:00). Do not include timezone offset in the string itself.",
            },
            timeZone: {
              type: "string",
              description: "Time zone designation. Use standard IANA time zone identifiers (e.g., 'America/New_York', 'Europe/London') or 'UTC' for Coordinated Universal Time.",
            },
          },
          description: "Date/time with timezone information for task due dates and reminders.",
        },
        linkedResources: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              webUrl: {
                type: "string",
                description: "URL pointing to the linked resource.",
              },
              displayName: {
                type: "string",
                description: "The display name of the linked resource.",
              },
              applicationName: {
                type: "string",
                description: "The application name of the source that created the linked resource.",
              },
            },
            description: "Resource linked to the task (e.g., document, email, or web link).",
          },
          description: "A list of resources (documents, links, emails) associated with the task. Each resource can have a webUrl, applicationName, and displayName.",
        },
        reminderDateTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format (e.g., 2024-01-15T14:30:00). Do not include timezone offset in the string itself.",
            },
            timeZone: {
              type: "string",
              description: "Time zone designation. Use standard IANA time zone identifiers (e.g., 'America/New_York', 'Europe/London') or 'UTC' for Coordinated Universal Time.",
            },
          },
          description: "Date/time with timezone information for task due dates and reminders.",
        },
        todo_task_list_id: {
          type: "string",
          description: "The unique identifier of the task list where the task will be created. Use the List To Do task lists action to retrieve available list IDs.",
        },
      },
      required: [
        "todo_task_list_id",
        "title",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "tasks_and_reminders",
    ],
    askBefore: [
      "Confirm the parameters before executing Create To Do task.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_calendar_event_attachment",
    description: "Tool to create a new attachment for an event in a specific user's calendar. Use when you need to attach a file or item to an event within a particular user's calendar.",
    toolSlug: "OUTLOOK_CREATE_USER_CALENDAR_EVENT_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload; required when '@odata.type' is itemAttachment.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment.",
        },
        user_id: {
          type: "string",
          description: "The user's ID or userPrincipalName (email address). This identifies the user whose calendar contains the event.",
        },
        event_id: {
          type: "string",
          description: "The unique opaque identifier of the calendar event (NOT an email address). This is typically a long string starting with 'AAMkA' or 'AQMkA'. Obtain it from listing or searching calendar events.",
        },
        odata_type: {
          type: "string",
          description: "Attachment type: '#microsoft.graph.fileAttachment' requires 'contentBytes'; '#microsoft.graph.itemAttachment' requires 'item'.",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
          ],
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event. This is typically a long opaque string identifying the specific calendar.",
        },
        contentBytes: {
          type: "string",
          description: "MUST be base64-encoded file contents (not plain text); required when '@odata.type' is fileAttachment. Raw/plain text must be base64-encoded first.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "event_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar event attachment.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_calendar_group_calendar",
    description: "Tool to create a new calendar in a calendar group for a specific user. Use when organizing events into a separate calendar within a specific calendar group for a user.",
    toolSlug: "OUTLOOK_CREATE_USER_CALENDAR_GROUP_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The display name of the new calendar.",
        },
        color: {
          type: "string",
          description: "The theme color to assign to the calendar. Supported values: auto, lightBlue, lightGreen, lightOrange, lightGray, lightYellow, lightTeal, lightPink, lightBrown, lightPurple, lightRed.",
          enum: [
            "auto",
            "lightBlue",
            "lightGreen",
            "lightOrange",
            "lightGray",
            "lightYellow",
            "lightTeal",
            "lightPink",
            "lightBrown",
            "lightPurple",
            "lightRed",
          ],
        },
        user_id: {
          type: "string",
          description: "The unique identifier for the user (can also be userPrincipalName). Use 'me' for the authenticated user.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier for the calendar group where the calendar will be created.",
        },
      },
      required: [
        "calendar_group_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar in user's calendar group.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_calendar_group_event",
    description: "Tool to create a new calendar event in a specific user's calendar within a calendar group. Use when creating events for a particular user in a calendar that belongs to a calendar group.",
    toolSlug: "OUTLOOK_CREATE_USER_CALENDAR_GROUP_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation ({date}T{time}). For example, 2025-02-01T10:00:00.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the datetime. Uses Windows time zone names (e.g., 'Pacific Standard Time') or IANA time zone names (e.g., 'America/Los_Angeles'). UTC is also valid.",
            },
          },
          description: "The end date, time, and time zone of the event.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body.",
            },
            contentType: {
              type: "string",
              description: "The format of the body content. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "The body content of the event.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation ({date}T{time}). For example, 2025-02-01T10:00:00.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the datetime. Uses Windows time zone names (e.g., 'Pacific Standard Time') or IANA time zone names (e.g., 'America/Los_Angeles'). UTC is also valid.",
            },
          },
          description: "The start date, time, and time zone of the event.",
        },
        showAs: {
          type: "string",
          description: "The status to show on the calendar. Valid values: 'free', 'tentative', 'busy', 'oof', 'workingElsewhere', 'unknown'.",
        },
        subject: {
          type: "string",
          description: "The subject/title of the event.",
        },
        user_id: {
          type: "string",
          description: "The user ID or user principal name (UPN) of the target user. Note: 'me' is not supported for this endpoint - you must provide an actual email address or user ID.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            displayName: {
              type: "string",
              description: "The name or description of the location.",
            },
          },
          description: "The location of an event.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The attendee type. Valid values: 'required', 'optional', 'resource'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
            description: "Information about an event attendee.",
          },
          description: "List of attendees for the event.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of category names to associate with the event.",
        },
        importance: {
          type: "string",
          description: "The importance of the event. Valid values: 'low', 'normal', 'high'.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of the calendar within the calendar group where the event will be created.",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "Set to true to indicate that the event is an online meeting.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group containing the target calendar.",
        },
        onlineMeetingProvider: {
          type: "string",
          description: "The online meeting provider. Currently only 'teamsForBusiness' is supported.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "subject",
        "start",
        "end",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user calendar group event.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_contacts_extensions",
    description: "Tool to create a new open extension on a specific user's contact. Use when you need to store custom data with a contact for a specific user.",
    toolSlug: "OUTLOOK_CREATE_USER_CONTACTS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's object ID (GUID) or userPrincipalName (e.g., 'user@contoso.com').",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to add the extension to.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow reverse DNS format (e.g., Com.Contoso.ExtensionName).",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "user_id",
        "contact_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user contact extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_event_calendar_permission",
    description: "Tool to create a calendar permission via an event's calendar. Use when granting calendar access through an event by specifying the event ID and user email address.",
    toolSlug: "OUTLOOK_CREATE_USER_EVENT_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission role to grant. Options: read (view all event details), write (view and edit events), freeBusyRead (view availability only), limitedRead (view availability and titles).",
          enum: [
            "read",
            "write",
            "freeBusyRead",
            "limitedRead",
          ],
        },
        user_id: {
          type: "string",
          description: "The user ID or principal name of the user. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event whose calendar will have the permission added.",
        },
        isRemovable: {
          type: "boolean",
          description: "True if the permission can be removed by the user, false otherwise. Optional.",
        },
        emailAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The display name of the person receiving the calendar permission.",
            },
            address: {
              type: "string",
              description: "The email address of the person receiving the calendar permission.",
            },
          },
          description: "Email address object containing the name and address of the person receiving the permission.",
        },
        isInsideOrganization: {
          type: "boolean",
          description: "True if the user is inside the same organization as the calendar owner, false otherwise. Optional.",
        },
      },
      required: [
        "event_id",
        "emailAddress",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create calendar permission via event.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_mail_child_folder_msg_ext",
    description: "Tool to create a new open extension on a message in a child mail folder for any user. Use when you need to store custom data with a message in a nested folder structure.",
    toolSlug: "OUTLOOK_CREATE_USER_MAIL_CHILD_FOLDER_MSG_EXT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to add the extension to.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow the format 'Com.Company.ExtensionName' (e.g., Com.Contoso.TestExtension).",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder containing the message.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user message extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_mail_folder_message_extension",
    description: "Tool to create a new open extension on a message in a user's mail folder. Use when you need to store custom data with a specific message in a user's mailbox.",
    toolSlug: "OUTLOOK_CREATE_USER_MAIL_FOLDER_MESSAGE_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's object ID (GUID) or userPrincipalName (e.g., 'user@contoso.com').",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to add the extension to.",
        },
        extension_name: {
          type: "string",
          description: "The unique name for the extension. Must follow the format 'Com.Company.ExtensionName' (e.g., Com.Contoso.Test).",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to store in the extension as key-value pairs. Each property can be a string, number, or boolean value.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user mail folder message extension.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_mail_folder_message_reply_draft",
    description: "Tool to create a reply draft for a message in a user's mail folder. Use when you need to prepare a reply without sending it immediately. The draft is created in the Drafts folder and includes the RE: prefix in the subject line.",
    toolSlug: "OUTLOOK_CREATE_USER_MAIL_FOLDER_MESSAGE_REPLY_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional plain text comment to include in the body of the reply draft.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use 'me' for the authenticated user, or provide a specific user principal name (email address) or user ID.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to reply to. This is a base64-encoded string typically starting with 'AAMk' or 'AQMk'. Obtain this from list messages, get message, or search messages actions. Do NOT use email addresses or conversation IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. Valid well-known names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For other folders, use the base64-encoded folder ID obtained from list mail folders actions.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create reply draft for user mail folder message.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_mail_folders_child_folders",
    description: "Tool to create a new child folder under a specified mail folder for a user. Use when organizing email into nested folder hierarchies within a specific user's mailbox.",
    toolSlug: "OUTLOOK_CREATE_USER_MAIL_FOLDERS_CHILD_FOLDERS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "User's ID or userPrincipalName. The unique identifier of the user whose mailbox will contain the new child folder.",
        },
        isHidden: {
          type: "boolean",
          description: "Indicates whether the new child folder should be hidden. Default is false. Once set during creation, this property cannot be updated later.",
        },
        displayName: {
          type: "string",
          description: "The display name of the new child folder. This is the name that will be visible to the user in their mail client.",
        },
        mailFolderId: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder under which to create the child folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For folder IDs, obtain them from listing mail folders - they are base64-encoded strings (e.g., 'AQMkADAwATMwMAExLTlmNjktOWVmYS0wMAItMDAKAC4AAAPLkCuWz0mbS4RvWyTvc1LKAQDGTYrvat2PSKIu8IS9hMqyAAACAQwAAAA=').",
        },
      },
      required: [
        "userId",
        "mailFolderId",
        "displayName",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user mail folders child folders.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_master_category",
    description: "Tool to create a new category in a user's master category list. Use when you need to add a category to organize email and calendar items for a specific user.",
    toolSlug: "OUTLOOK_CREATE_USER_MASTER_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        color: {
          type: "string",
          description: "A pre-set color constant for the category. Allowed values: preset0 through preset24.",
          enum: [
            "preset0",
            "preset1",
            "preset2",
            "preset3",
            "preset4",
            "preset5",
            "preset6",
            "preset7",
            "preset8",
            "preset9",
            "preset10",
            "preset11",
            "preset12",
            "preset13",
            "preset14",
            "preset15",
            "preset16",
            "preset17",
            "preset18",
            "preset19",
            "preset20",
            "preset21",
            "preset22",
            "preset23",
            "preset24",
          ],
        },
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        display_name: {
          type: "string",
          description: "Unique name that identifies the category in the user's mailbox.",
        },
      },
      required: [
        "display_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "categories_and_master_categories",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user master category.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_message",
    description: "Tool to create a new draft message in a user's mailbox. Use when creating draft messages for a specific user or the authenticated user.",
    toolSlug: "OUTLOOK_CREATE_USER_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The text or HTML content of the message body.",
            },
            contentType: {
              type: "string",
              description: "The type of the content. Possible values are 'Text' (plain text) or 'HTML' (HTML content).",
            },
          },
          description: "The body of the message.",
        },
        from: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "The recipient's email address.",
            },
          },
          description: "Represents a message recipient.",
        },
        sender: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "The recipient's email address.",
            },
          },
          description: "Represents a message recipient.",
        },
        subject: {
          type: "string",
          description: "The subject of the message.",
        },
        user_id: {
          type: "string",
          description: "The user's ID, userPrincipalName (email address), or 'me' to represent the authenticated user. Creates the message in the specified user's mailbox.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of categories to assign to the message.",
        },
        importance: {
          type: "string",
          description: "Message importance levels.",
          enum: [
            "low",
            "normal",
            "high",
          ],
        },
        ccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The Cc: recipients for the message.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The To: recipients for the message.",
        },
        bccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "The recipient's email address.",
              },
            },
            description: "Represents a message recipient.",
          },
          description: "The Bcc: recipients for the message.",
        },
        internetMessageHeaders: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The name of the custom header.",
              },
              value: {
                type: "string",
                description: "The value of the custom header.",
              },
            },
            description: "Represents a custom message header key-value pair.",
          },
          description: "Custom message headers to add to the message.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user message.",
    ],
  }),
  composioTool({
    name: "outlook_create_user_message_attachment",
    description: "Tool to create an attachment on a message in a user's mail folder. Use when you need to attach a file or item to an existing message in a specific user's mailbox.",
    toolSlug: "OUTLOOK_CREATE_USER_MESSAGE_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item: {
          type: "object",
          additionalProperties: true,
          description: "The nested item payload (message, event, or contact) with its own '@odata.type'. Required when '@odata.type' is '#microsoft.graph.itemAttachment'.",
        },
        name: {
          type: "string",
          description: "The display name of the attachment (e.g., file name like 'document.pdf' or 'image.png').",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's UPN (user principal name) or the user's object ID.",
        },
        isInline: {
          type: "boolean",
          description: "Set to true if the attachment should appear inline within the message body content.",
        },
        contentId: {
          type: "string",
          description: "Content ID for inline attachments, used to reference the attachment within the HTML message body.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to attach to. This is NOT an email address but an opaque string identifier returned by Microsoft Graph API operations.",
        },
        odata_type: {
          type: "string",
          description: "The OData type of the attachment. Use '#microsoft.graph.fileAttachment' for file attachments (requires 'contentBytes'), '#microsoft.graph.itemAttachment' for embedded items like messages or events (requires 'item'), or '#microsoft.graph.referenceAttachment' for reference attachments (requires link and permission details).",
          enum: [
            "#microsoft.graph.fileAttachment",
            "#microsoft.graph.itemAttachment",
            "#microsoft.graph.referenceAttachment",
          ],
        },
        contentType: {
          type: "string",
          description: "The MIME type of the attachment (e.g., 'text/plain', 'application/pdf'). Optional but recommended for file attachments.",
        },
        contentBytes: {
          type: "string",
          description: "Base64-encoded content of the file attachment. Required when '@odata.type' is '#microsoft.graph.fileAttachment'. Must be valid base64-encoded data.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message. This is typically a long opaque string identifying the specific folder.",
        },
        contentLocation: {
          type: "string",
          description: "URI indicating the content location of the attachment.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
        "odata_type",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user message attachment.",
    ],
  }),
  composioTool({
    name: "outlook_decline_event",
    description: "Tool to decline an invitation to a calendar event. Use when the user wants to decline a meeting or event invitation. The API returns 202 Accepted with no content on success.",
    toolSlug: "OUTLOOK_DECLINE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "Optional text message to include in the response to the event organizer explaining the decline.",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to decline.",
        },
        sendResponse: {
          type: "boolean",
          description: "If true, a decline response is sent to the organizer; if false, no response is sent. Default is true.",
        },
        proposedNewTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            end: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation (e.g., 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Time zone identifier (e.g., Pacific Standard Time, UTC).",
                },
              },
              description: "The date, time, and time zone that the proposed period ends.",
            },
            start: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation (e.g., 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Time zone identifier (e.g., Pacific Standard Time, UTC).",
                },
              },
              description: "The date, time, and time zone that the proposed period begins.",
            },
          },
          description: "A time period with start and end times.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Decline calendar event.",
    ],
  }),
  composioTool({
    name: "outlook_delete_calendar",
    description: "Tool to delete a calendar other than the default calendar from a user's mailbox. Use when removing calendars that are no longer needed.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        calendar_id: {
          type: "string",
          description: "Unique identifier of the calendar to delete. Cannot be the default calendar. This ID can be obtained from List Calendars action.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_event",
    description: "Tool to delete a calendar event from a user's Outlook calendar. Use when removing events that are no longer needed or were created in error.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to delete. This ID can be obtained from List Events or Get Event actions.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete calendar event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_event_attachment",
    description: "Delete user calendar event attachment",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_EVENT_ATTACHMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as shortcut for authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment to delete.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event. Can be obtained from listing calendars.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Can be obtained from listing event attachments.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user calendar event attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_event_from_specific_calendar",
    description: "Tool to delete an event from a specific calendar in Outlook. Use when removing events from secondary or shared calendars by providing both calendar ID and event ID.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_EVENT_FROM_SPECIFIC_CALENDAR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or email address to delete the event for. Required for S2S (Service-to-Service) authentication. If not provided, defaults to /me endpoint for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to delete from the specified calendar. This ID can be obtained from List Events or Get Event actions.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event. This ID can be obtained from List Calendars action.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete event from specific calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_from_group",
    description: "Tool to delete a calendar from a specific user's calendar group in Microsoft Outlook. Use when removing a calendar that belongs to a user's calendar group.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_FROM_GROUP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user whose calendar group calendar to delete. Can be the user's email address or user ID.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to delete. Note: Default calendars with isRemovable: false cannot be deleted.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar to delete.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user calendar group calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_group",
    description: "Tool to delete a calendar group other than the default calendar group. Use when removing unused calendar groups from the mailbox.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_GROUP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        calendar_group_id: {
          type: "string",
          description: "Unique identifier of the calendar group to delete. Cannot be used to delete the default calendar group. This ID can be obtained from List Calendar Groups action.",
        },
      },
      required: [
        "calendar_group_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete calendar group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_group_calendar_event",
    description: "Tool to delete a calendar event from a specific user's calendar within a calendar group. Use when removing events from calendars organized under calendar groups for a specific user.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_GROUP_CALENDAR_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Must be an actual user ID, not 'me' shortcut.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to delete. This ID can be obtained from List Events or Get Event actions.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the target calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user calendar group calendar event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_group_event_attachment",
    description: "Tool to delete an attachment from an event in a calendar within a calendar group. Use when you need to remove a file or item attachment from an event in a specific calendar group.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_GROUP_EVENT_ATTACHMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the authenticated user (delegated auth) or specify a user ID/email for S2S (app-only) authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment to delete.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Can be obtained from listing event attachments.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the target calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete calendar group event attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_group_event_permanently",
    description: "Tool to permanently delete a calendar event from a calendar within a calendar group. Use when you need to ensure an event cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_GROUP_EVENT_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier (GUID) or user principal name (email) of the user. Required for app-only (S2S) authentication. If not provided, defaults to /me endpoint for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to permanently delete. The event will be permanently deleted and cannot be recovered by the user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the target calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Calendar Group Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_permanently",
    description: "Permanently deletes a calendar from a user's mailbox. Unlike standard DELETE, this action makes the calendar permanently unrecoverable. Use when you need to ensure a calendar cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        calendar_id: {
          type: "string",
          description: "Unique identifier of the calendar to permanently delete. The calendar will be permanently deleted and cannot be recovered by the user.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_calendar_permission",
    description: "Tool to delete a calendar permission from a user's calendar within a calendar group. Use when revoking calendar sharing access for specific users.",
    toolSlug: "OUTLOOK_DELETE_CALENDAR_PERMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the group.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to delete. This ID can be obtained from listing calendar permissions.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete User Calendar Group Calendar Permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_child_contact_folder_permanently",
    description: "Permanently deletes a child contact folder. Unlike standard DELETE, this action makes the folder permanently unrecoverable. Use when you need to ensure a child contact folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CHILD_CONTACT_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        child_folder_id: {
          type: "string",
          description: "Unique identifier of the child contact folder to permanently delete. The folder will be permanently deleted and cannot be recovered by the user.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the parent contact folder containing the child folder to permanently delete.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Child Contact Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_child_folder_message",
    description: "Tool to delete a message from a child mail folder in Outlook. Use when removing messages from nested folder structures or cleaning up messages in subfolders.",
    toolSlug: "OUTLOOK_DELETE_CHILD_FOLDER_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to delete from the child folder. Typically a base64-encoded string obtained from list messages or search messages actions.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox'. For folder IDs, use base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=') obtained from list mail folders actions.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the message to delete. Must be a base64-encoded folder ID (e.g., 'AAMkADAwATMwMAExAAA=') obtained from list child folders actions.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Child Folder Message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact",
    description: "Permanently deletes an existing contact, using its `contact_id` (obtainable via 'List User Contacts' or 'Get Contact'), from the Outlook contacts of the user specified by `user_id`.",
    toolSlug: "OUTLOOK_DELETE_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        contact_id: {
          type: "string",
          description: "Identifier of the contact to be deleted, typically obtained from 'List User Contacts' or 'Get Contact'.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_folder",
    description: "Tool to delete a contact folder from the user's mailbox. Use when you need to remove an existing contact folder.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        contact_folder_id: {
          type: "string",
          description: "Identifier of the contact folder to be deleted. Must be a valid contact folder ID obtained from 'Get Contact Folders' or 'Create Contact Folder'.",
        },
      },
      required: [
        "contact_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete contact folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_folder_child_folder",
    description: "Tool to delete a child contact folder from a parent contact folder for a specific user. Use when removing nested contact folders from a user's mailbox.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FOLDER_CHILD_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child contact folder to delete. This ID can be obtained from Get Contact Folders action.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the parent contact folder. This ID can be obtained from Get Contact Folders action.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user contact folder child folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_folder_contact",
    description: "Tool to permanently delete a contact from a specific contact folder. Use when removing contacts from organized folders in Outlook.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FOLDER_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact to delete from the folder, typically obtained from 'List User Contacts' or 'Get Contact'.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the contact folder containing the contact to delete, typically obtained from 'Get Contact Folders'.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact from Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_folder_permanently",
    description: "Permanently deletes a contact folder. Unlike standard DELETE, this action makes the folder permanently unrecoverable. Use when you need to ensure a contact folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the contact folder to permanently delete. The folder will be permanently deleted and cannot be recovered by the user.",
        },
      },
      required: [
        "contact_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Contact Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_from_child_folder_permanently",
    description: "Tool to permanently delete a contact from a child folder for a specific user. Use when you need to ensure a contact cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FROM_CHILD_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's email address (UPN) or their Azure AD object ID.",
        },
        contact_id: {
          type: "string",
          description: "Identifier of the contact to be permanently deleted. The contact will be permanently deleted and cannot be recovered. Must be obtained from 'List Contacts' or 'Get Contact'.",
        },
        child_folder_id: {
          type: "string",
          description: "Identifier of the child folder within the parent contact folder containing the contact to permanently delete. Must be a valid child folder ID.",
        },
        contact_folder_id: {
          type: "string",
          description: "Identifier of the parent contact folder. Must be a valid contact folder ID obtained from 'Get Contact Folders' or 'List Contact Folders'.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete User Contact from Child Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_from_folder_permanently",
    description: "Permanently deletes a contact from a specific contact folder. Unlike standard DELETE, this action makes the contact permanently unrecoverable. Use when you need to ensure a contact in a folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_FROM_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact to permanently delete. The contact will be permanently deleted and cannot be recovered by the user.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the contact folder containing the contact to permanently delete. Must be a valid contact folder ID obtained from list or get contact folders actions.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Contact from Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contact_permanently",
    description: "Permanently deletes a contact. Unlike standard DELETE, this action makes the contact permanently unrecoverable. Use when you need to ensure a contact cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_CONTACT_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact to permanently delete. The contact will be permanently deleted and cannot be recovered by the user.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_contacts_extensions",
    description: "Tool to delete a navigation property extension from a contact within a child folder. Use when removing custom extension data from a contact.",
    toolSlug: "OUTLOOK_DELETE_CONTACTS_EXTENSIONS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's object ID (GUID) or userPrincipalName (e.g., 'user@contoso.com'). If not provided, uses the authenticated user context (/me endpoint).",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact that has the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the contact folder.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_email_rule",
    description: "Delete an email rule permanently; deletion is irreversible. Confirm rule details with the user before executing. Removing a rule may alter the firing order and stop-processing behavior of remaining rules.",
    toolSlug: "OUTLOOK_DELETE_EMAIL_RULE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rule_id: {
          type: "string",
          description: "ID of the email rule to delete.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' shortcut for /me/ path or actual user ID for /users/{user_id}/ path. Required for S2S (app-only) authentication.",
        },
      },
      required: [
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
      "automation",
      "rules",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Email Rule.",
    ],
  }),
  composioTool({
    name: "outlook_delete_event_attachment",
    description: "Tool to delete an attachment from an Outlook calendar event. Use when you need to remove a file or item attachment from an existing event.",
    toolSlug: "OUTLOOK_DELETE_EVENT_ATTACHMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment to delete.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Can be obtained from listing event attachments.",
        },
      },
      required: [
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete event attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_event_extension",
    description: "Tool to delete an open extension from a calendar event in a calendar group. Use when removing custom extension data that is no longer needed.",
    toolSlug: "OUTLOOK_DELETE_EVENT_EXTENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID) or user principal name (email) of the target user. Required for S2S (app-only) authentication. If not provided, defaults to '/me' for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension to delete.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete event extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_event_permanently",
    description: "Permanently deletes a calendar event. Unlike standard DELETE, this action makes the event permanently unrecoverable. Use when you need to ensure an event cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_EVENT_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        event_id: {
          type: "string",
          description: "Unique identifier of the calendar event to permanently delete. The event will be permanently deleted and cannot be recovered by the user.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_mail_folder",
    description: "Delete a mail folder from the user's mailbox. Use when you need to remove an existing mail folder.",
    toolSlug: "OUTLOOK_DELETE_MAIL_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Identifier for the user whose mailbox contains the folder to delete. Use 'me' for the authenticated user or provide the user's principal name or ID.",
        },
        folder_id: {
          type: "string",
          description: "The Microsoft Graph folder ID (a base64-encoded string like 'AAMkAGI0ZjExAAA=') of the custom mail folder to delete. IMPORTANT: You can ONLY delete custom folders you created. System folders (Inbox, Drafts, SentItems, DeletedItems, JunkEmail, Outbox, Archive, etc.) are 'distinguished folders' and CANNOT be deleted - attempting to do so will result in an error. Use the 'List mail folders' action to find the ID of a custom folder.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete mail folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_mail_folder_message",
    description: "Tool to delete a message from a specific mail folder in Outlook. Use when removing messages from a particular folder or cleaning up folder contents.",
    toolSlug: "OUTLOOK_DELETE_MAIL_FOLDER_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to delete from the mail folder. Typically a base64-encoded string obtained from list messages or search messages actions.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox'. For folder IDs, use base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=') obtained from list mail folders actions.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Mail Folder Message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_master_category",
    description: "Tool to delete a category from the user's master category list. Use when removing unused or obsolete categories from the mailbox.",
    toolSlug: "OUTLOOK_DELETE_MASTER_CATEGORY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        category_id: {
          type: "string",
          description: "Unique identifier of the Outlook category to delete. This ID can be obtained from Get Master Categories action.",
        },
      },
      required: [
        "category_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "categories_and_master_categories",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete master category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_calendar_permission",
    description: "Tool to delete a calendar permission from a specific user's calendar. Use when revoking access to a shared calendar.",
    toolSlug: "OUTLOOK_DELETE_ME_CALENDAR_PERMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar. This ID can be obtained from List Calendars action.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to delete. This ID can be obtained from listing calendar permissions.",
        },
      },
      required: [
        "calendar_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete User Calendars Calendar Permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_contact_extension",
    description: "Tool to delete an open extension from a contact. Use when removing custom data extensions that are no longer needed.",
    toolSlug: "OUTLOOK_DELETE_ME_CONTACT_EXTENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact from which to delete the extension.",
        },
        "extension-id": {
          type: "string",
          description: "The extension identifier. Can be the extension name or fully qualified name (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension').",
        },
      },
      required: [
        "contact_id",
        "extension-id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_contact_folder_contact_extension",
    description: "Tool to delete an extension from a contact in a user's contact folder. Use when removing custom extension data from a contact.",
    toolSlug: "OUTLOOK_DELETE_ME_CONTACT_FOLDER_CONTACT_EXTENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact that has the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.com.contoso.roamingSettings) or just the extension name (e.g., com.contoso.roamingSettings).",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user contact folder contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_event_extension",
    description: "Tool to delete an open extension from a user's calendar event. Use when removing custom extension data that is no longer needed.",
    toolSlug: "OUTLOOK_DELETE_ME_EVENT_EXTENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.Referral) or just the extension name (e.g., Com.Contoso.Referral).",
        },
      },
      required: [
        "event_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user event extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_events_attachments",
    description: "Tool to delete an attachment from a user's Outlook event. Use when you need to remove a file or item attachment from an existing event.",
    toolSlug: "OUTLOOK_DELETE_ME_EVENTS_ATTACHMENTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event containing the attachment to delete.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Can be obtained from listing event attachments.",
        },
      },
      required: [
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user event attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_inference_classification_override",
    description: "Tool to delete an inference classification override for a specific sender. Use when removing custom Focused Inbox rules that were previously set.",
    toolSlug: "OUTLOOK_DELETE_ME_INFERENCE_CLASSIFICATION_OVERRIDE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        override_id: {
          type: "string",
          description: "The unique identifier of the inference classification override to delete. This ID can be obtained from the List Inference Classification Overrides action.",
        },
      },
      required: [
        "override_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "inference_classification",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete inference classification override.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_mail_folder_child_folder",
    description: "Tool to delete a child mail folder from a parent mail folder. Use when removing nested mail folders from a user's mailbox.",
    toolSlug: "OUTLOOK_DELETE_ME_MAIL_FOLDER_CHILD_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder. This ID can be obtained from List Mail Folders action.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child mail folder to delete. This ID can be obtained from List Mail Folders action.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete mail folder child folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_mail_folder_child_folder_permanently",
    description: "Permanently deletes a child mail folder from a parent mail folder. Unlike standard DELETE, this action makes the folder permanently unrecoverable. Use when you need to ensure a child folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_ME_MAIL_FOLDER_CHILD_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use 'me' for the authenticated user, or provide the user's email address (UPN) or their Azure AD object ID.",
        },
        mail_folder_id: {
          type: "string",
          description: "Unique identifier of the parent mail folder. Must be a valid mail folder ID obtained from 'List Mail Folders' or 'List Child Mail Folders'.",
        },
        child_folder_id: {
          type: "string",
          description: "Unique identifier of the child folder to permanently delete. The folder will be permanently deleted and cannot be recovered by the user. Must be obtained from 'List Child Mail Folders'.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Child Mail Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_mail_folder_message_rule",
    description: "Tool to delete a message rule from a specific mail folder. Use when you need to remove an email automation rule from a folder.",
    toolSlug: "OUTLOOK_DELETE_ME_MAIL_FOLDER_MESSAGE_RULE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rule_id: {
          type: "string",
          description: "The unique identifier of the message rule to delete. Must be obtained from a list or get operation on message rules.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use 'me' as alias for the authenticated user, or provide a specific user ID or user principal name.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message rule. Can be a well-known folder name (e.g., 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail') or a folder ID.",
        },
      },
      required: [
        "mail_folder_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete mail folder message rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_mail_folders_child_folders_messages_extens",
    description: "Delete user message extension",
    toolSlug: "OUTLOOK_DELETE_ME_MAIL_FOLDERS_CHILD_FOLDERS_MESSAGES_EXTENS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message that has the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the child folder.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the mail folder.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user message extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_mail_folders_messages_extensions",
    description: "Tool to delete a navigation property extension from a message within a mail folder. Use when removing custom extension data from a message.",
    toolSlug: "OUTLOOK_DELETE_ME_MAIL_FOLDERS_MESSAGES_EXTENSIONS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or principal name. Required for app-only (S2S) authentication. If not provided, uses 'me' for delegated authentication.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message that has the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Composio.TestExtension) or just the extension name (e.g., Com.Composio.TestExtension).",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete message extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_me_messages_attachments",
    description: "Tool to delete an attachment from a message. Use when removing file or item attachments from messages in Outlook.",
    toolSlug: "OUTLOOK_DELETE_ME_MESSAGES_ATTACHMENTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier or user principal name (email) of the user. Required for S2S (app-only) authentication. Can be either a GUID (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f') or an email address (e.g., 'user@example.com'). If not provided, defaults to '/me' for delegated authentication.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the attachment. Must be a valid base64-encoded message ID obtained from listing messages or search operations.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Must be a valid attachment ID obtained from listing message attachments.",
        },
      },
      required: [
        "message_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Message Attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_message",
    description: "Tool to permanently delete an Outlook email message by its message_id. Use when removing unwanted messages, cleaning up drafts, or performing mailbox maintenance.",
    toolSlug: "OUTLOOK_DELETE_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "Unique identifier of the message to delete, typically obtained from 'List Emails' or 'Search Messages'.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_message_attachment",
    description: "Tool to delete an attachment from a message in a nested mail folder structure. Use when removing attachments from messages located in child folders within mail folders.",
    toolSlug: "OUTLOOK_DELETE_MESSAGE_ATTACHMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the attachment. Must be a valid message ID obtained from listing messages, not a folder ID.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to delete. Obtain this ID from listing message attachments.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder. Can be a well-known name ('inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox') or a folder ID obtained from listing mail folders.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the mail folder. If provided, targets the message inside mailFolders/{id}/childFolders/{id}. If omitted, targets the message directly inside mailFolders/{id}.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Message Attachment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_message_extension",
    description: "Tool to delete an open extension from an Outlook message. Use when removing custom extension data that is no longer needed from a message.",
    toolSlug: "OUTLOOK_DELETE_MESSAGE_EXTENSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) or ID of the user; use 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the extension to delete.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to delete. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
      },
      required: [
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete message extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_primary_calendar_permission",
    description: "Tool to delete a calendar permission from a specific user's calendar. Use when revoking calendar sharing access for a particular user.",
    toolSlug: "OUTLOOK_DELETE_PRIMARY_CALENDAR_PERMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or principal name of the user whose calendar permission to delete. Use 'me' for the authenticated user or provide a specific user ID/UPN.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to delete. This ID can be obtained from listing calendar permissions.",
        },
      },
      required: [
        "user_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete User Calendar Permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_user_calendar_event_permanently",
    description: "Tool to permanently delete a calendar event from a specific user's calendar. Use when you need to ensure an event cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_USER_CALENDAR_EVENT_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address, UPN, or 'me' for the currently authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to permanently delete. The event will be permanently deleted and cannot be recovered by the user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete User Calendar Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_user_child_folder_contact",
    description: "Tool to delete a contact from a child folder in a user's contact folder. Use when you need to remove a contact from a specific child folder within a contact folder.",
    toolSlug: "OUTLOOK_DELETE_USER_CHILD_FOLDER_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the contact folder owner. Use 'me' for the authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "Identifier of the contact to be deleted from the child folder. Must be obtained from 'List Contacts' or 'Get Contact'.",
        },
        child_folder_id: {
          type: "string",
          description: "Identifier of the child folder within the parent contact folder containing the contact to delete. Must be a valid child folder ID.",
        },
        contact_folder_id: {
          type: "string",
          description: "Identifier of the parent contact folder. Must be a valid contact folder ID obtained from 'Get Contact Folders' or 'List Contact Folders'.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact from User's Child Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_user_child_folder_message_permanently",
    description: "Tool to permanently delete a message from a user's child mail folder in Outlook. Unlike standard DELETE, this action makes the message unrecoverable by moving it to the Purges folder in the dumpster. Use when you need to ensure a message in a nested folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_USER_CHILD_FOLDER_MESSAGE_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to permanently delete from the child folder. The message will be moved to the Purges folder in the dumpster and cannot be recovered by the user. Typically a base64-encoded string obtained from list messages or search messages actions.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox'. For folder IDs, use base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=') obtained from list mail folders actions.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the message to permanently delete. Must be a base64-encoded folder ID (e.g., 'AAMkADAwATMwMAExAAA=') obtained from list child folders actions.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete User Child Folder Message Permanently.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_user_event_permanently",
    description: "Tool to permanently delete a calendar event for a specified user. Use when you need to ensure an event cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_USER_EVENT_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the calendar owner. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to permanently delete. The event will be permanently deleted and cannot be recovered by the user.",
        },
      },
      required: [
        "user_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete User Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_delete_user_mail_folder_permanently",
    description: "Permanently deletes a mail folder for a specific user. Unlike standard DELETE, this action makes the folder permanently unrecoverable. Use when you need to ensure a user's folder cannot be restored from deleted items.",
    toolSlug: "OUTLOOK_DELETE_USER_MAIL_FOLDER_PERMANENTLY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or user principal name (email address) of the user whose mail folder should be permanently deleted. This is required to identify which user's mailbox contains the folder.",
        },
        mail_folder_id: {
          type: "string",
          description: "Unique identifier of the mail folder to permanently delete. The folder will be permanently deleted and cannot be recovered by the user. Use 'List Mail Folders' action to obtain the folder ID.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete User Mail Folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_dismiss_calendar_event_reminder",
    description: "Tool to dismiss a reminder for a specific event in a user's calendar. Use when you need to turn off or remove a reminder alert for an event in a specific user's calendar.",
    toolSlug: "OUTLOOK_DISMISS_CALENDAR_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier or user principal name (UPN) of the user. Can be 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event whose reminder should be dismissed.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Dismiss user calendar event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_dismiss_event_reminder",
    description: "Tool to dismiss a reminder for a specific calendar event. Use when you need to turn off or remove a reminder alert for an event.",
    toolSlug: "OUTLOOK_DISMISS_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier or email of the user. Required for S2S authentication with app-only permissions.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event whose reminder should be dismissed.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Dismiss event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_dismiss_event_reminder_from_group",
    description: "Tool to dismiss a reminder for an event in a user's calendar within a calendar group. Use when you need to turn off a reminder for an event in a specific user's calendar group.",
    toolSlug: "OUTLOOK_DISMISS_EVENT_REMINDER_FROM_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user or userPrincipalName. Use 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event whose reminder should be dismissed.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Dismiss user calendar group event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_dismiss_user_event_reminder",
    description: "Tool to dismiss a reminder for a specific user's calendar event. Use when you need to turn off or remove a reminder alert for an event in a user's calendar.",
    toolSlug: "OUTLOOK_DISMISS_USER_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName (email address) of the calendar owner, identifying whose event reminder should be dismissed.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event whose reminder should be dismissed.",
        },
      },
      required: [
        "user_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Dismiss user event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_download_outlook_attachment",
    description: "Downloads a specific file attachment from an email message in a Microsoft Outlook mailbox; the attachment must contain 'contentBytes' (binary data) and not be a link or embedded item. The returned data.file.s3url is temporary — download the file immediately after calling this tool; call again to get a fresh URL if needed. High-volume parallel calls may trigger HTTP 429 responses; honor the Retry-After header and use exponential backoff.",
    toolSlug: "OUTLOOK_DOWNLOAD_OUTLOOK_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's UPN (User Principal Name) or 'me' for the authenticated user. This identifies the mailbox where the message is located.",
        },
        file_name: {
          type: "string",
          description: "The desired filename for the downloaded attachment. This name will be assigned to the.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message that contains the attachment to be downloaded. This ID is typically obtained when listing or retrieving messages.",
        },
        attachment_id: {
          type: "string",
          description: "The Microsoft Graph API attachment identifier (NOT the filename). This is a base64-encoded opaque string returned in the 'id' field when listing attachments via the LIST_OUTLOOK_ATTACHMENTS action. Must be the exact value from the API response, not the attachment's display name or filename. Always use the exact attachment_id/message_id pair returned together from LIST_OUTLOOK_ATTACHMENTS — an attachment_id is bound to its specific message_id and cannot be used with a different message_id.",
        },
      },
      required: [
        "message_id",
        "attachment_id",
        "file_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_find_meeting_times",
    description: "Suggests meeting times based on organizer and attendee availability, time constraints, and duration requirements. Use when you need to find optimal meeting slots across multiple participants' schedules.",
    toolSlug: "OUTLOOK_FIND_MEETING_TIMES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or User Principal Name. Use 'me' for the authenticated user.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "Type of attendee. Valid values: 'required', 'optional', 'resource'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Display name of the attendee.",
                  },
                  address: {
                    type: "string",
                    description: "Email address of the attendee.",
                  },
                },
                description: "Email address information for the attendee.",
              },
            },
            description: "Represents an attendee or resource for the meeting.",
          },
          description: "List of attendees or resources for the meeting. Empty list searches only organizer's availability.",
        },
        maxCandidates: {
          type: "integer",
          description: "Maximum number of meeting time suggestions to return.",
        },
        timeConstraint: {
          type: "object",
          additionalProperties: true,
          properties: {
            timeSlots: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  end: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      dateTime: {
                        type: "string",
                        description: "Date and time in ISO 8601 format (e.g., '2025-01-15T09:00:00').",
                      },
                      timeZone: {
                        type: "string",
                        description: "IANA timezone identifier (e.g., 'America/New_York', 'UTC') or Windows timezone name (e.g., 'Pacific Standard Time').",
                      },
                    },
                    description: "End date, time, and timezone for the time slot.",
                  },
                  start: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      dateTime: {
                        type: "string",
                        description: "Date and time in ISO 8601 format (e.g., '2025-01-15T09:00:00').",
                      },
                      timeZone: {
                        type: "string",
                        description: "IANA timezone identifier (e.g., 'America/New_York', 'UTC') or Windows timezone name (e.g., 'Pacific Standard Time').",
                      },
                    },
                    description: "Start date, time, and timezone for the time slot.",
                  },
                },
                description: "Represents a time slot constraint.",
              },
              description: "Specific time periods to search for meeting times.",
            },
            activityDomain: {
              type: "string",
              description: "Nature of activity. Valid values: 'work' (Mon-Fri 8am-5pm, default), 'personal' (Mon-Sun 8am-5pm), 'unrestricted' (24/7), 'unknown'.",
            },
          },
          description: "Time restrictions for the meeting.",
        },
        meetingDuration: {
          type: "string",
          description: "Meeting length in ISO 8601 duration format (e.g., 'PT1H' for 1 hour, 'PT30M' for 30 minutes). Default: 30 minutes.",
        },
        prefer_timezone: {
          type: "string",
          description: "Preferred timezone for the response (sets Prefer header with outlook.timezone). If not specified, defaults to UTC.",
        },
        locationConstraint: {
          type: "object",
          additionalProperties: true,
          properties: {
            locations: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  displayName: {
                    type: "string",
                    description: "Name of the location.",
                  },
                  resolveAvailability: {
                    type: "boolean",
                    description: "If true, check if the location is available.",
                  },
                },
                description: "Represents a location constraint item.",
              },
              description: "List of specific allowed locations.",
            },
            isRequired: {
              type: "boolean",
              description: "If true, a location is required for the meeting.",
            },
            suggestLocation: {
              type: "boolean",
              description: "If true, request location suggestions.",
            },
          },
          description: "Meeting location requirements.",
        },
        isOrganizerOptional: {
          type: "boolean",
          description: "If true, organizer doesn't need to attend. Default: false.",
        },
        returnSuggestionReasons: {
          type: "boolean",
          description: "If true, include reasons for each suggestion. Default: false.",
        },
        minimumAttendeePercentage: {
          type: "number",
          description: "Minimum confidence percentage (0-100) for suggestions. Default: 50.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_forward_message",
    description: "Tool to forward a message. Use when you need to send an existing email to new recipients.",
    toolSlug: "OUTLOOK_FORWARD_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "An optional comment to include with the forwarded message.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or alias 'me' to indicate the authenticated user. Specifies which mailbox to use.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to forward. Must be a valid Outlook message ID (Base64-encoded string, e.g., 'AAMkAGI2TAAA='). Obtain this from OUTLOOK_LIST_MESSAGES or OUTLOOK_GET_MESSAGE actions. Message IDs are mailbox-specific.",
        },
        to_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to forward the message to. Provide each address separately.",
        },
      },
      required: [
        "message_id",
        "to_recipients",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
    ],
    askBefore: [
      "Confirm the parameters before executing Forward message.",
    ],
  }),
  composioTool({
    name: "outlook_forward_user_calendar_event",
    description: "Tool to forward a calendar event from a specific user's calendar to new recipients. Use when you need to share an event from a particular calendar with additional people.",
    toolSlug: "OUTLOOK_FORWARD_USER_CALENDAR_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "An optional comment to include with the forwarded event invitation.",
        },
        user_id: {
          type: "string",
          description: "The user identifier. Use 'me' for the authenticated user, or provide a Microsoft 365 User Principal Name (e.g., user@contoso.com) or Azure AD object ID.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to forward. Must be a valid Outlook event ID obtained from list or get event actions.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event to forward. Obtain this from list calendars actions.",
        },
        to_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of recipients to forward the event to. Can provide email addresses as strings (e.g., 'alice@example.com') or as objects with 'address' and optional 'name' fields.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "to_recipients",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar",
    ],
    askBefore: [
      "Confirm the parameters before executing Forward user calendar event.",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_event",
    description: "Tool to retrieve a specific event from a specified calendar. Use when you need to get details of an event that belongs to a specific calendar in the user's mailbox.",
    toolSlug: "OUTLOOK_GET_CALENDAR_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID) or email address of the user. Required for app-only (S2S) authentication. If not provided, uses the authenticated user context (/me).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event within the calendar.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_event_attachment",
    description: "Tool to retrieve a specific attachment from an event within a calendar. Use when you need to access attachment content from a calendar event.",
    toolSlug: "OUTLOOK_GET_CALENDAR_EVENT_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or user principal name (email) to access calendars on behalf of. Required for S2S (app-only) authentication. If not provided, defaults to 'me' for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to retrieve.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_from_event",
    description: "Tool to retrieve the parent calendar that contains a specific event. Use when you need to get calendar details for a specific event in a calendar.",
    toolSlug: "OUTLOOK_GET_CALENDAR_FROM_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or user principal name (email address). Required for S2S (app-only) authentication. Use 'me' or omit for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event within the calendar.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_from_group",
    description: "Tool to retrieve a specific calendar from a calendar group in Microsoft Outlook. Use when you need to get details of a calendar that belongs to a specific calendar group.",
    toolSlug: "OUTLOOK_GET_CALENDAR_FROM_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName of the user whose calendar to retrieve.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_group",
    description: "Tool to retrieve the properties and relationships of a calendar group object. Use when you need to get details of a specific calendar group by its ID.",
    toolSlug: "OUTLOOK_GET_CALENDAR_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        expand: {
          type: "string",
          description: "Comma-separated list of related entities to expand in the response (OData $expand query parameter).",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response (OData $select query parameter).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group to retrieve.",
        },
      },
      required: [
        "calendar_group_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_group_calendar_event_extension",
    description: "Tool to retrieve an open extension from a calendar event within a specific calendar group and calendar. Use when you need to access custom data stored with an event.",
    toolSlug: "OUTLOOK_GET_CALENDAR_GROUP_CALENDAR_EVENT_EXTENSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user (required for S2S/application authentication). Can be user ID (GUID) or userPrincipalName (email).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to retrieve. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_group_schedule",
    description: "Tool to retrieve free/busy schedule information for a specific user's calendar within a calendar group. Use when you need availability data from a particular user's calendar that belongs to a calendar group.",
    toolSlug: "OUTLOOK_GET_CALENDAR_GROUP_SCHEDULE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        endTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point in time in combined date and time format (ISO 8601). Example: '2025-02-25T09:00:00'.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses standard time zone names like 'Pacific Standard Time' or 'UTC'.",
            },
          },
          description: "The date, time, and time zone that the period ends. The period can be up to 62 days.",
        },
        user_id: {
          type: "string",
          description: "The ID or userPrincipalName of the user. Use 'me' for the authenticated user or a user's email address.",
        },
        schedules: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A collection of SMTP addresses of users, distribution lists, or resources to get availability information for. Maximum of 20 addresses.",
        },
        startTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point in time in combined date and time format (ISO 8601). Example: '2025-02-25T09:00:00'.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the dateTime. Uses standard time zone names like 'Pacific Standard Time' or 'UTC'.",
            },
          },
          description: "The date, time, and time zone that the period starts.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group containing the calendar.",
        },
        availabilityViewInterval: {
          type: "integer",
          description: "Duration of a time slot in an availabilityView in minutes. Default is 30, minimum is 5, maximum is 1440.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "schedules",
        "startTime",
        "endTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_permission",
    description: "Tool to retrieve a specific calendar permission for a user's calendar. Use when you need to check who has access to a specific user's calendar and their permission level.",
    toolSlug: "OUTLOOK_GET_CALENDAR_PERMISSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName of the user whose calendar permission to retrieve.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to retrieve.",
        },
      },
      required: [
        "user_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_permission_from_calendar",
    description: "Tool to retrieve a specific calendar permission from a user's calendar. Use when you need to check who has access to a specific user's calendar and their permission level.",
    toolSlug: "OUTLOOK_GET_CALENDAR_PERMISSION_FROM_CALENDAR",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Cannot use 'me' shortcut - must be actual user ID or userPrincipalName.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to retrieve.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_schedule",
    description: "Tool to get free/busy schedule information for users, distribution lists, or resources. Use when you need to check availability for specific people or resources during a time period.",
    toolSlug: "OUTLOOK_GET_CALENDAR_SCHEDULE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        endTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "Date and time in ISO 8601 format (e.g., '2025-01-20T09:00:00').",
            },
            timeZone: {
              type: "string",
              description: "IANA timezone identifier (e.g., 'America/New_York', 'UTC') or Windows timezone name (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The end date, time, and time zone for the period to retrieve schedules. Period can be up to 62 days from start.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier (GUID) or email address of the user whose calendar to query. For delegated auth, omit this (or use None, not 'me') to query the authenticated user's calendar. For S2S (app-only) auth, this is required.",
        },
        schedules: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A collection of SMTP addresses of users, distribution lists, or resources to get availability information for. Maximum of 20 addresses.",
        },
        startTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "Date and time in ISO 8601 format (e.g., '2025-01-20T09:00:00').",
            },
            timeZone: {
              type: "string",
              description: "IANA timezone identifier (e.g., 'America/New_York', 'UTC') or Windows timezone name (e.g., 'Pacific Standard Time').",
            },
          },
          description: "The start date, time, and time zone for the period to retrieve schedules. Period can be up to 62 days.",
        },
        availabilityViewInterval: {
          type: "integer",
          description: "Duration of a time slot in minutes. Minimum: 5, Maximum: 1440. Default: 30.",
        },
      },
      required: [
        "schedules",
        "startTime",
        "endTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_calendar_view",
    description: "Get events ACTIVE during a time window (includes multi-day events). Use for \"what's on my calendar today/this week\" or availability checks. Returns events overlapping the time range. For keyword search or filters by category, use OUTLOOK_LIST_EVENTS instead.",
    toolSlug: "OUTLOOK_GET_CALENDAR_VIEW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to retrieve.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of event properties to return. Defaults to commonly-needed fields excluding the full HTML body. To include the full body content, explicitly add 'body' to this list.",
        },
        user_id: {
          type: "string",
          description: "Email address of the target user (or 'me' for authenticated user).",
        },
        timezone: {
          type: "string",
          description: "Timezone for event times in the response only; the input window is always interpreted from the offset in start_datetime/end_datetime. Must be an IANA timezone name (e.g., 'America/New_York', 'Europe/London', 'Asia/Kolkata') or Windows timezone identifier (e.g., 'Pacific Standard Time', 'India Standard Time'). UTC offsets like '+05:30' or 'GMT+5' are NOT supported. Defaults to UTC.",
        },
        calendar_id: {
          type: "string",
          description: "Optional ID of a specific calendar to query. Must be a calendar identifier (format like 'AAMkAGI2TG93AAA='), NOT an email address. If not provided, uses the primary calendar. Get calendar IDs using LIST_CALENDARS action.",
        },
        end_datetime: {
          type: "string",
          description: "The end date and time of the time range, represented in ISO 8601 format. For example, '2019-11-08T20:00:00-08:00' or '2024-12-31T23:59:59Z'.",
        },
        start_datetime: {
          type: "string",
          description: "The start date and time of the time range, represented in ISO 8601 format. For example, '2019-11-08T19:00:00-08:00' or '2024-01-01T00:00:00Z'.",
        },
      },
      required: [
        "start_datetime",
        "end_datetime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_child_folder_message",
    description: "Tool to retrieve a specific email message from a child mail folder. Use when you need to access a message in a nested folder hierarchy.",
    toolSlug: "OUTLOOK_GET_CHILD_FOLDER_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. OData $select parameter. Reduces data transfer and improves performance. Common fields: id, subject, from, toRecipients, ccRecipients, receivedDateTime, sentDateTime, body, bodyPreview, hasAttachments, webLink, internetMessageHeaders, isRead, importance, categories. Leave empty to return all fields.",
        },
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the message to retrieve. Must be obtained from OUTLOOK_LIST_MAIL_FOLDER_MESSAGES, OUTLOOK_QUERY_EMAILS, or OUTLOOK_SEARCH_MESSAGES (use hitId from search results). The message must exist in the specified child folder.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For custom folders, use the actual folder ID (a base64-encoded string like 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child mail folder containing the message. This must be a base64-encoded folder ID (e.g., 'AQMkADAwATMwMAExLTlmNjktOWVmYS0wMAItMDAKAC4=') obtained from OUTLOOK_LIST_CHILD_MAIL_FOLDERS. Well-known names are NOT valid for child folders.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_child_folder_message_content",
    description: "Tool to get the MIME content of a message from a child mail folder. Use when you need to download the raw MIME format of an email message for analysis or archival.",
    toolSlug: "OUTLOOK_GET_CHILD_FOLDER_MESSAGE_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user. Use 'me' for delegated authentication or provide a specific user ID/email for S2S (app-only) authentication.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message whose MIME content to retrieve. Must be obtained from message listing or query operations.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder. Must be obtained from 'List Mail Folders' or other mail folder operations.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child mail folder within the parent folder. Must be obtained from 'List Child Mail Folders' or other folder operations.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_child_mail_folder",
    description: "Tool to retrieve a specific child mail folder from a parent mail folder. Use when you need details about a specific subfolder within a folder hierarchy.",
    toolSlug: "OUTLOOK_GET_CHILD_MAIL_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "Comma-separated list of mailFolder properties to include in the response. Valid properties include: id, displayName, parentFolderId, childFolderCount, unreadItemCount, totalItemCount, sizeInBytes, isHidden. Example: 'id,displayName,childFolderCount'.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For folder IDs, obtain them from OUTLOOK_LIST_MAIL_FOLDERS or previous childFolders responses. Folder IDs are base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=') that are mailbox-specific and must come from the same user's mailbox.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique ID of the child folder to retrieve. Obtain child folder IDs from OUTLOOK_LIST_CHILD_MAIL_FOLDERS or previous API responses. Child folder IDs are base64-encoded strings that are mailbox-specific and must come from the same user's mailbox.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_contact_extension",
    description: "Tool to retrieve an open extension from a contact in Microsoft Graph. Use when you need to access custom data stored with a contact.",
    toolSlug: "OUTLOOK_GET_CONTACT_EXTENSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID) or user principal name (email) for S2S authentication. If not provided, uses '/me' endpoint for delegated authentication.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact that has the extension.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to retrieve. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_contact_folder",
    description: "Tool to retrieve a specific contact folder by ID. Use when you need details about a particular contact folder in the user's mailbox.",
    toolSlug: "OUTLOOK_GET_CONTACT_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "OData query parameter to select specific properties, e.g., 'id,displayName'.",
        },
        user_id: {
          type: "string",
          description: "The ID or userPrincipalName of the user. Required for app-only authentication (S2S). If not provided, uses '/me' endpoint for delegated authentication.",
        },
        contact_folder_id: {
          type: "string",
          description: "The ID of the contact folder to retrieve.",
        },
      },
      required: [
        "contact_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_contact_folders",
    description: "Tool to retrieve contact folders from a specific user's mailbox. Use when you need to list or browse contact folders for a given user.",
    toolSlug: "OUTLOOK_GET_CONTACT_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of contact folders to return. OData $top parameter.",
        },
        skip: {
          type: "integer",
          description: "Number of contact folders to skip for pagination. OData $skip parameter.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Related entities to expand inline. OData $expand parameter.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter the contact folders, e.g., startswith(displayName,'A').",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to include in the response. OData $select parameter.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to order results by. OData $orderby parameter.",
        },
        user_id: {
          type: "string",
          description: "User principal name or ID. Use 'me' for the authenticated user.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_contact_from_folder",
    description: "Tool to retrieve a specific contact from a contact folder by its ID. Use when you need to access contact details from a specific folder rather than the default contacts location.",
    toolSlug: "OUTLOOK_GET_CONTACT_FROM_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of relationships to expand and include in the response. Leave empty for default behavior.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific contact properties to include in the response, e.g., ['displayName', 'emailAddresses']. Leave empty to get all properties.",
        },
        user_id: {
          type: "string",
          description: "User's principal name (e.g., 'AdeleV@contoso.onmicrosoft.com') or 'me' for the authenticated user. Using 'me' is recommended for accessing one's own contacts.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier for the contact within the specified contact folder.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the contact folder containing the contact.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_drafts_mail_folder",
    description: "Tool to get the drafts mail folder. Use when you need to retrieve details about the drafts folder such as item counts and folder ID.",
    toolSlug: "OUTLOOK_GET_DRAFTS_MAIL_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Valid properties: id, displayName, parentFolderId, childFolderCount, unreadItemCount, totalItemCount, sizeInBytes, isHidden.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_event",
    description: "Retrieves the full details of a specific calendar event by its ID from a user's Outlook calendar, provided the event exists.",
    toolSlug: "OUTLOOK_GET_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to retrieve.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_event_attachment",
    description: "Tool to retrieve a specific attachment from an Outlook calendar event by attachment ID. Use when you need to download or access the content of a particular event attachment.",
    toolSlug: "OUTLOOK_GET_EVENT_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, UPN, or 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to retrieve.",
        },
      },
      required: [
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_event_calendar_from_group",
    description: "Tool to retrieve the calendar that contains a specific event within a calendar group. Use when you need to get calendar details for an event in a calendar group.",
    toolSlug: "OUTLOOK_GET_EVENT_CALENDAR_FROM_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID or email) for S2S authentication. If not provided, uses /me endpoint for delegated auth.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event within the calendar.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_inference_classification",
    description: "Tool to get inference classification settings for the authenticated user. Use when you need to retrieve the Focused Inbox configuration and sender-specific overrides that determine message classification.",
    toolSlug: "OUTLOOK_GET_INFERENCE_CLASSIFICATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The ID or email address of the user. Required for S2S (app-only) authentication. Use the user's GUID or email format (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f' or 'user@example.com').",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "inference_classification",
    ],
  }),
  composioTool({
    name: "outlook_get_mail_delta",
    description: "Retrieve incremental changes (delta) of messages in a mailbox. FIRST RUN: Returns ALL messages in folder (use top=50 to limit). Response has @odata.deltaLink. SUBSEQUENT: Pass stored deltaLink to get only NEW/UPDATED/DELETED messages since last sync. Properties available: id, subject, from, receivedDateTime, isRead, etc. NOT available: internetMessageHeaders, full body, attachment content (response size limits).",
    toolSlug: "OUTLOOK_GET_MAIL_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return per page. For first run without delta_token, use top=50 or top=100 to limit results. First delta call without token returns all messages in folder. Paginate through results using @odata.nextLink, then store @odata.deltaLink for next sync.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
            description: "Valid navigation properties that can be expanded in delta queries.\n\nOnly navigation properties (relationships) can be expanded. Regular properties\nlike body, from, toRecipients, etc. are NOT expandable and will cause API errors.\n\nNote: 'extensions' is technically a navigation property but requires complex OData\nfilter syntax (e.g., $expand=extensions($filter=id eq 'ExtensionId')) which is not\nsupported by this simple expand parameter.",
            enum: [
              "attachments",
              "multiValueExtendedProperties",
              "singleValueExtendedProperties",
            ],
          },
          description: "Navigation properties to expand inline. Supported values: 'attachments', 'multiValueExtendedProperties', 'singleValueExtendedProperties'. Regular properties (body, from, toRecipients, etc.) cannot be expanded and will cause errors.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include (e.g. ['subject','receivedDateTime']). Delta sync has property limitations due to response size constraints. Not available in delta: internetMessageHeaders, body (full), attachments (full content). Available: id, subject, from, toRecipients, ccRecipients, bccRecipients, receivedDateTime, sentDateTime, isRead, isDraft, importance, hasAttachments, categories, conversationId, flag, webLink, bodyPreview (first 255 chars).",
        },
        user_id: {
          type: "string",
          description: "User identifier: 'me' for the signed-in user or the user's email/UPN.",
        },
        folder_id: {
          type: "string",
          description: "Mail folder identifier (folder GUID) or well-known folder name. Well-known names (case-insensitive): 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'outbox', 'archive', 'clutter', 'conversationhistory'. For custom folders, use the folder ID GUID from LIST_MAIL_FOLDERS. Defaults to 'inbox' when omitted.",
        },
        skip_token: {
          type: "string",
          description: "Skip token for paging through large result sets during initial sync. Accepts either the full @odata.nextLink URL or just the bare token value. Keep paginating until you receive '@odata.deltaLink' instead of nextLink. Mutually exclusive with delta_token - only one should be provided per request.",
        },
        delta_token: {
          type: "string",
          description: "Delta token from a previous call to get only changes since that state. Accepts either the full @odata.deltaLink URL or just the bare token value. If omitted or invalid (placeholders like <token> are ignored), performs initial sync. Use top parameter on first run to limit results. Response includes @odata.deltaLink - store this for subsequent calls. Mutually exclusive with skip_token - only one should be provided per request.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_mail_folder",
    description: "Tool to retrieve a mail folder by ID or well-known name. Use when you need to get details about a specific folder such as item counts, size, and folder properties.",
    toolSlug: "OUTLOOK_GET_MAIL_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. Valid properties: id, displayName, parentFolderId, childFolderCount, unreadItemCount, totalItemCount, sizeInBytes, isHidden.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder to retrieve. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names (e.g., 'workjournal') are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_mail_folder_message",
    description: "Tool to retrieve a specific message from a mail folder by its ID. Use when you need to fetch full message details including subject, body, sender, recipients, timestamps, and other metadata from a specific mail folder.",
    toolSlug: "OUTLOOK_GET_MAIL_FOLDER_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Comma-separated list of message properties to include in the response. Valid properties include: id, subject, from, toRecipients, ccRecipients, bccRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId, flag, internetMessageHeaders, parentFolderId, replyTo, sender, webLink, isDraft, isReadReceiptRequested, isDeliveryReceiptRequested, changeKey, createdDateTime, lastModifiedDateTime, inferenceClassification. Leave empty to return all fields.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique ID of the message to retrieve. Accepts message IDs from: OUTLOOK_LIST_MESSAGES (message.id), OUTLOOK_QUERY_EMAILS (message.id), OUTLOOK_LIST_MAIL_FOLDER_MESSAGES (message.id), or OUTLOOK_SEARCH_MESSAGES (use hitId from search results). The message must exist in the specified mail folder; otherwise, a 404 error will occur.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names (e.g., 'workjournal') are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_mail_folder_message_rule",
    description: "Tool to retrieve a specific message rule from a user's mail folder. Use when you need details about an email rule in a particular user's folder.",
    toolSlug: "OUTLOOK_GET_MAIL_FOLDER_MESSAGE_RULE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rule_id: {
          type: "string",
          description: "The unique identifier of the message rule to retrieve. This can be obtained from list email rules actions.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be the user's email address, user principal name (UPN), or user ID. Use 'me' for the authenticated user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message rule. Well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive'. For other folders, use the folder ID obtained from list mail folders actions.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_mail_tips",
    description: "Tool to retrieve mail tips such as automatic replies and mailbox full status. Use when you need to check recipient status before sending mail.",
    toolSlug: "OUTLOOK_GET_MAIL_TIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User principal name (UPN) or 'me' for the signed-in user.",
        },
        EmailAddresses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Collection of SMTP addresses of recipients to get MailTips for.",
        },
        MailTipsOptions: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "automaticReplies",
              "customMailTip",
              "deliveryRestriction",
              "externalMemberCount",
              "mailboxFullStatus",
              "maxMessageSize",
              "moderationStatus",
              "recipientScope",
              "recipientSuggestions",
              "totalMemberCount",
            ],
          },
          description: "List of mail tip types to retrieve for each recipient.",
        },
      },
      required: [
        "EmailAddresses",
        "MailTipsOptions",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_mailbox_settings",
    description: "Tool to retrieve mailbox settings. Use when you need to view settings such as automatic replies, time zone, and working hours for the signed-in or specified user.",
    toolSlug: "OUTLOOK_GET_MAILBOX_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "OData $select query to specify mailbox settings properties to include. Valid properties: archiveFolder, automaticRepliesSetting, dateFormat, delegateMeetingMessageDeliveryOptions, language, timeFormat, timeZone, userPurpose, workingHours.",
        },
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "user_profile_and_settings",
    ],
  }),
  composioTool({
    name: "outlook_get_master_categories",
    description: "Tool to retrieve the user's master category list. Use when you need to get all categories defined for the user.",
    toolSlug: "OUTLOOK_GET_MASTER_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of master categories to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of master categories to skip for pagination (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter master categories.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "OData $select query to specify properties to include.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "OData $orderby query to order master categories by property values.",
        },
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "categories_and_master_categories",
    ],
  }),
  composioTool({
    name: "outlook_get_master_category",
    description: "Tool to retrieve properties of a specific category from the user's master category list. Use when you need details about a specific category.",
    toolSlug: "OUTLOOK_GET_MASTER_CATEGORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        category_id: {
          type: "string",
          description: "Unique identifier of the Outlook category to retrieve. This ID can be obtained from Get Master Categories action.",
        },
      },
      required: [
        "category_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "categories_and_master_categories",
    ],
  }),
  composioTool({
    name: "outlook_get_me_calendar",
    description: "Tool to get the properties and relationships of the signed-in user's default calendar. Use when you need to retrieve calendar details for the authenticated user.",
    toolSlug: "OUTLOOK_GET_ME_CALENDAR",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_me_contact_folders_child_folder",
    description: "Tool to retrieve a specific child contact folder for a user by ID. Use when you need details of a child folder nested within a parent contact folder for a specific user.",
    toolSlug: "OUTLOOK_GET_ME_CONTACT_FOLDERS_CHILD_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to include in the response. OData $select parameter. Valid properties: id, displayName, parentFolderId.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as a shortcut for the authenticated user, or provide user ID or userPrincipalName.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child contact folder to retrieve.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the parent contact folder.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_me_contact_from_child_folder",
    description: "Tool to retrieve a specific contact from a nested child folder within a contact folder. Use when you need contact details from a child folder.",
    toolSlug: "OUTLOOK_GET_ME_CONTACT_FROM_CHILD_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        expand: {
          type: "string",
          description: "Comma-separated list of relationships to expand and include in the response. OData $expand parameter.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. OData $select parameter.",
        },
        user_id: {
          type: "string",
          description: "User principal name or ID of the user. Use 'me' for the authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to retrieve.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the contact. For deeply nested folders, provide only the immediate parent folder ID.",
        },
        contact_folder_id: {
          type: "string",
          description: "The ID of the parent contact folder containing the child folder.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_me_contact_photo",
    description: "Tool to get the binary media content of a contact's profile photo. Use when you need to download or retrieve a contact's picture.",
    toolSlug: "OUTLOOK_GET_ME_CONTACT_PHOTO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or email address. Required for app-only (S2S) authentication. If not provided, uses '/me' endpoint for delegated auth.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact whose photo to retrieve. Must be obtained from 'List Contacts' or 'Get Contact'.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_me_contacts",
    description: "Retrieves a specific Outlook contact by its `contact_id` from the contacts of a specified `user_id` (defaults to 'me' for the authenticated user).",
    toolSlug: "OUTLOOK_GET_ME_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's principal name (e.g., 'AdeleV@contoso.onmicrosoft.com') or 'me' for the authenticated user. Using 'me' is recommended for accessing one's own contacts.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier for the contact within the specified user's Outlook address book.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_me_contacts_extensions",
    description: "Tool to retrieve a specific open extension from a user's contact. Use when you need to access custom data stored with a contact.",
    toolSlug: "OUTLOOK_GET_ME_CONTACTS_EXTENSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier or user principal name of the user. Use 'me' for the authenticated user.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact that has the extension.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to retrieve. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Composio.TestExtension) or just the extension name (e.g., Com.Composio.TestExtension).",
        },
      },
      required: [
        "user_id",
        "contact_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_get_me_event_attachment",
    description: "Tool to retrieve a specific attachment from a user's calendar event. Use when you need to access attachment details including content from a specific user's event.",
    toolSlug: "OUTLOOK_GET_ME_EVENT_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use the user's UPN (e.g., 'user@contoso.com') or user ID.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the attachment.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to retrieve.",
        },
      },
      required: [
        "user_id",
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_me_event_calendar",
    description: "Tool to retrieve the calendar that contains a specific event. Use when you need to get calendar details for an event.",
    toolSlug: "OUTLOOK_GET_ME_EVENT_CALENDAR",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event. This ID can be obtained from listing calendar events or other event operations.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_me_mail_folders_messages_extensions",
    description: "Tool to retrieve a specific extension from a message in a user's mailbox. Use when you need to read custom data stored in a message extension.",
    toolSlug: "OUTLOOK_GET_ME_MAIL_FOLDERS_MESSAGES_EXTENSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID, userPrincipalName, or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the extension.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension. Can be the extension name (e.g., 'Com.Contoso.Test') or the fully qualified name (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.Test').",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_me_message_mime_content",
    description: "Tool to get the MIME content of a message. Use when you need to download the raw MIME format of an email message for analysis or archival.",
    toolSlug: "OUTLOOK_GET_ME_MESSAGE_MIME_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or principal name (email) of the user whose message to retrieve. Required when using app-only (S2S) authentication. If not provided, defaults to '/me' endpoint for delegated authentication.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message whose MIME content to retrieve. Must be obtained from message listing or query operations.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_me_outlook",
    description: "Tool to retrieve the outlookUser object for a specified user. Use when you need to access the Outlook services entity for a user.",
    toolSlug: "OUTLOOK_GET_ME_OUTLOOK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "user_profile_and_settings",
    ],
  }),
  composioTool({
    name: "outlook_get_message",
    description: "Retrieves a specific email message by its ID from the specified user's Outlook mailbox. Use the 'select' parameter to include specific fields like 'internetMessageHeaders' for filtering automated emails.",
    toolSlug: "OUTLOOK_GET_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. Can be provided as an array of strings (e.g., ['subject', 'body']) or as a comma-separated string (e.g., 'subject,body'). Reduces data transfer and improves performance. Common fields: id, subject, from, toRecipients, ccRecipients, receivedDateTime, sentDateTime, body, bodyPreview, hasAttachments, webLink, internetMessageHeaders, isRead, importance, categories. Leave empty to return all fields.",
        },
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to retrieve. Accepts message IDs from: OUTLOOK_LIST_MESSAGES (message.id), OUTLOOK_QUERY_EMAILS (message.id), or OUTLOOK_SEARCH_MESSAGES (use hitId from search results, as the resource.id field is not populated by the Search API). The message must exist in the specified user's mailbox; otherwise, a 404 error will occur.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_message_extension",
    description: "Tool to retrieve a specific extension from a user's message. Use when you need to read custom data stored in a message extension.",
    toolSlug: "OUTLOOK_GET_MESSAGE_EXTENSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User ID, userPrincipalName, or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the extension.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension. Can be the extension name (e.g., 'Com.Contoso.Test') or the fully qualified name (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.Test').",
        },
      },
      required: [
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_nested_folder_message_attachment",
    description: "Tool to retrieve a specific attachment from a message located in a nested mail folder structure. Use when you need to get attachment details from messages in deeply nested folders.",
    toolSlug: "OUTLOOK_GET_NESTED_FOLDER_MESSAGE_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Must be an actual user ID (e.g., '6640adbb5cb743b0') or user principal name (UPN). Cannot use 'me' alias for this endpoint.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the attachment.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to retrieve.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the parent mail folder. Can be a well-known folder name (e.g., 'inbox', 'drafts', 'sentitems') or a folder ID obtained from listing mail folders.",
        },
        child_folder_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of child folder IDs representing the nested folder path. For a message in /folder1/subfolder1/subfolder2/, provide ['subfolder1_id', 'subfolder2_id']. Can be a single item for one level of nesting or multiple items for deeper nesting.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_ids",
        "message_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_profile",
    description: "Retrieves the Microsoft Outlook profile for a specified user.",
    toolSlug: "OUTLOOK_GET_PROFILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' to get the profile of the authenticated user.",
        },
        include_proxy_addresses: {
          type: "boolean",
          description: "Whether to include proxy addresses in the response. Proxy addresses are SMTP addresses prefixed with 'SMTP:' (primary) or 'smtp:' (secondary).",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_schedule",
    description: "Retrieves free/busy schedule information for specified email addresses within a defined time window. Read-only; does not reserve time or prevent conflicts — verify availability before creating events.",
    toolSlug: "OUTLOOK_GET_SCHEDULE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "The user ID or principal name of the user whose calendar to query. Required for S2S (application) authentication. Can be either the GUID user ID (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f') or the user principal name (e.g., 'user@domain.com'). If not provided, the endpoint will use '/me' which requires delegated authentication.",
        },
        endTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point in time, expressed in a combined date and time format (ISO 8601). Example: '2023-10-26T10:00:00'.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the 'dateTime'. Uses standard time zone names. Example: 'Pacific Standard Time'.",
            },
          },
          description: "The end date, time, and time zone for the period for which to retrieve schedules. The period can be up to 62 days. Object must include `dateTime` (ISO 8601) and `timeZone` (valid Windows or IANA identifier). Must use same timezone convention as `startTime`.",
        },
        schedules: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of SMTP email addresses for users, distribution lists, or resources whose schedules are to be retrieved. Maximum of 20 addresses. Include all relevant participants; omitted addresses may cause slots to appear falsely free. External or invalid addresses may silently return no data.",
        },
        startTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point in time, expressed in a combined date and time format (ISO 8601). Example: '2023-10-26T10:00:00'.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the 'dateTime'. Uses standard time zone names. Example: 'Pacific Standard Time'.",
            },
          },
          description: "The start date, time, and time zone for the period for which to retrieve schedules. Object must include `dateTime` (ISO 8601) and `timeZone` (valid Windows or IANA identifier, e.g., 'UTC', 'Eastern Standard Time'). Invalid or naive timezone values cause HTTP 400 or silent DST-shifted windows.",
        },
        availabilityViewInterval: {
          type: "string",
          description: "The duration of each time slot in the availability view, specified in minutes. Minimum: 5, Maximum: 1440. Default: 30.",
        },
      },
      required: [
        "schedules",
        "startTime",
        "endTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_supported_languages",
    description: "Tool to retrieve supported languages in the user's mailbox. Use when you need to display or select from available mailbox languages.",
    toolSlug: "OUTLOOK_GET_SUPPORTED_LANGUAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "languages_and_time_zones",
    ],
  }),
  composioTool({
    name: "outlook_get_supported_time_zones",
    description: "Tool to get the list of time zones supported for a user as configured on their mailbox server. Use when setting up an Outlook client or configuring user time zone preferences.",
    toolSlug: "OUTLOOK_GET_SUPPORTED_TIME_ZONES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        TimeZoneStandard: {
          type: "string",
          description: "Time zone format standard.",
          enum: [
            "Windows",
            "Iana",
          ],
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "languages_and_time_zones",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar",
    description: "Tool to get the properties and relationships of a specific calendar for a user. Use when you need to retrieve details for a particular calendar by its ID for any user.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include in the response (OData $select). Specify which calendar fields you want returned to keep the response concise.",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to retrieve.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar_allowed_sharing_roles",
    description: "Tool to retrieve allowed calendar sharing roles for a specific user on a given calendar. Use when you need to determine what permission levels can be granted to a user for sharing a specific calendar.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR_ALLOWED_SHARING_ROLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        User: {
          type: "string",
          description: "The email address or user principal name to check allowed calendar sharing roles for.",
        },
        user_id: {
          type: "string",
          description: "The user ID or User Principal Name of the calendar owner. Note: This endpoint does not support 'me' as a value; you must provide the explicit email address or user ID.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "User",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar_event",
    description: "Tool to retrieve a specific calendar event from a user's primary calendar. Use when you need detailed information about a particular event for a given user.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or user ID to identify the calendar owner whose event you want to retrieve.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to retrieve from the user's calendar.",
        },
      },
      required: [
        "user_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar_group_calendar_permission",
    description: "Tool to retrieve a specific calendar permission for a user's calendar within a calendar group. Use when you need to check access permissions for a specific calendar.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR_GROUP_CALENDAR_PERMISSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Cannot use 'me' shortcut - must be actual user ID or userPrincipalName.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to retrieve.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "permission_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar_group_event",
    description: "Tool to retrieve a specific event from a user's calendar within a calendar group. Use when you need details of an event in a specific calendar group.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR_GROUP_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to retrieve.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_calendar_group_event_attachment",
    description: "Tool to retrieve a specific attachment from an event within a calendar group for a user. Use when you need to access attachment content from a calendar event in a user's calendar group.",
    toolSlug: "OUTLOOK_GET_USER_CALENDAR_GROUP_EVENT_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as shortcut for authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment to retrieve.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_child_folder_message",
    description: "Tool to retrieve a specific message from a child folder within a user's mail folder hierarchy. Use when you need to access messages from nested folders where both parent and child folder IDs are known.",
    toolSlug: "OUTLOOK_GET_USER_CHILD_FOLDER_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. OData $select parameter. Valid properties include: id, subject, from, toRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId, internetMessageHeaders. Leave empty to return all fields.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Must be an actual user ID (e.g., '6640adbb5cb743b0') or user principal name (UPN). Cannot use 'me' alias for this endpoint.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to retrieve from the child folder. Must be a valid message ID obtained from list or search operations.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder. Must be a base64-encoded folder ID (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or similar endpoints.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the parent mail folder. Must be a base64-encoded folder ID obtained from OUTLOOK_LIST_CHILD_MAIL_FOLDERS or similar endpoints.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_get_user_event_extension",
    description: "Tool to retrieve a specific open type extension from a user's calendar event by its extension ID or name. Use when you need to access custom data stored in calendar event extensions.",
    toolSlug: "OUTLOOK_GET_USER_EVENT_EXTENSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event.",
        },
        extension_id: {
          type: "string",
          description: "The extension name or fully qualified name. Can be either the simple name (e.g., 'Com.Contoso.Referral') or fully qualified name (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.Referral').",
        },
      },
      required: [
        "event_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_get_user_messages_attachments",
    description: "Tool to retrieve a specific attachment from a message in a mail folder hierarchy. Use when you need to get attachment details including content from a specific folder path.",
    toolSlug: "OUTLOOK_GET_USER_MESSAGES_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address, userPrincipalName, or user ID. Use 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message. Obtain from OUTLOOK_LIST_MESSAGES, OUTLOOK_QUERY_EMAILS, or OUTLOOK_SEARCH_MESSAGES.",
        },
        attachment_id: {
          type: "string",
          description: "The unique identifier of the attachment. Obtain from LIST_OUTLOOK_ATTACHMENTS action (use the 'id' field, NOT the 'name' field).",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the parent mail folder. Can be a well-known folder name ('inbox', 'drafts', 'sentitems', 'deleteditems', etc.) or a folder ID (base64-encoded string obtained from OUTLOOK_LIST_MAIL_FOLDERS).",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder within the parent mail folder. If provided, targets the message inside mailFolders/{id}/childFolders/{id}. If omitted, targets the message directly inside mailFolders/{id}. Must be a base64-encoded folder ID obtained from OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
        "attachment_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_event_attachments",
    description: "Tool to list attachments for a calendar event within a specific calendar for a user. Use when you need to retrieve attachments from an event in a user's specific calendar.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_EVENT_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of attachments to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter string to filter the attachments (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attachment properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by clauses to sort the results (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Must be a valid user ID (GUID) or userPrincipalName (UPN/email). Note: 'me' is NOT supported for this endpoint.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_group_calendar_events",
    description: "Tool to list events from a specific calendar within a calendar group for a user. Use when you need to retrieve events from a user's calendar that belongs to a specific calendar group.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_GROUP_CALENDAR_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to retrieve per page for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of initial events to bypass, used for pagination.",
        },
        filter: {
          type: "string",
          description: "OData query string to filter calendar events. ONLY the following properties support filtering: 'start/dateTime', 'end/dateTime', 'subject', 'categories', 'importance', 'sensitivity', 'isAllDay', 'isCancelled', 'isReminderOn', 'type'. CRITICAL: Properties like 'body', 'bodyPreview', 'location', 'locations', 'organizer', 'attendees' do NOT support $filter and will cause errors. IMPORTANT: Use calendar event properties ONLY. Do NOT use mail/message properties like 'receivedDateTime'. For start/end filtering, you MUST use 'start/dateTime' and 'end/dateTime' ONLY. DO NOT use 'start/date' or 'end/date' - these properties do NOT exist and will cause errors. DateTime format: \"start/dateTime ge 'YYYY-MM-DDTHH:MM:SSZ'\" (requires single quotes and timezone suffix). Operators: ge (>=), le (<=), eq (=), gt (>), lt (<). DateTime values without quotes or timezone suffix will be automatically normalized.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific event property names to return. MUST be provided as a list. If omitted, a default set of properties is returned. Valid field names: id, subject, body, bodyPreview, start, end, isAllDay, organizer, attendees, location, locations, recurrence, importance, sensitivity, showAs, categories, hasAttachments, webLink, onlineMeeting, onlineMeetingProvider, onlineMeetingUrl, isOnlineMeeting, createdDateTime, lastModifiedDateTime, changeKey, iCalUId, type, seriesMasterId, isOrganizer, isReminderOn, reminderMinutesBeforeStart, responseRequested, responseStatus, allowNewTimeProposals, hideAttendees, isCancelled, isDraft, originalStart, originalStartTimeZone, originalEndTimeZone, transactionId, cancelledOccurrences. Note: 'creator' is NOT a valid field - use 'organizer' instead. Invalid field names will be automatically filtered out.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to sort results by. Each item is a string like 'start/dateTime desc' or 'subject asc'. MUST be provided as a list, even for single sort criteria. Use 'asc' (default) or 'desc' for order. IMPORTANT: Use calendar event properties ONLY. Do NOT use mail/message properties like 'receivedDateTime'. Valid sortable datetime fields: 'start/dateTime', 'end/dateTime', 'createdDateTime', 'lastModifiedDateTime'.",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or user ID to identify the calendar owner.",
        },
        timezone: {
          type: "string",
          description: "Preferred timezone for event start/end times. Accepts IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo') or Windows format (e.g., 'Eastern Standard Time', 'Pacific Standard Time'). Falls back to 'UTC' if the timezone cannot be resolved.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_group_calendars",
    description: "Tool to retrieve calendars belonging to a specific calendar group. Use when you need to list calendars within a calendar group with optional OData queries.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_GROUP_CALENDARS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of calendars to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of calendars to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter expression (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by expressions (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group to retrieve calendars from.",
        },
      },
      required: [
        "calendar_group_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_group_event_attachments",
    description: "Tool to list attachments for a calendar event within a specific calendar group for a user. Use when you need to retrieve attachments from an event in a calendar that belongs to a calendar group for a specific user.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_GROUP_EVENT_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of attachments to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter string to filter the attachments (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attachment properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by clauses to sort the results (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as shortcut for authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_groups",
    description: "Tool to list calendar groups in the signed-in user's mailbox. Use when you need to retrieve calendar groups with optional OData queries.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_GROUPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of calendar groups to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of calendar groups to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter expression (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by expressions (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_permissions",
    description: "Tool to list calendar permissions for a specific calendar within a calendar group. Use when you need to view sharing permissions for a calendar.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of permissions to return per page (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of items to skip for pagination (OData $skip).",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' for the authenticated user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendar_view_delta",
    description: "Tool to get calendar events that have been added, deleted, or updated in a calendar view. Use when you need to track changes to events within a specific time range.",
    toolSlug: "OUTLOOK_LIST_CALENDAR_VIEW_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID (GUID format like '43f0c14d-bca8-421f-b762-c3d8dd75be1f') or user principal name (email format like 'user@domain.com') of the mailbox to access. Required for app-only (S2S) authentication with application permissions. If not provided, uses '/me' endpoint which requires delegated permissions.",
        },
        skiptoken: {
          type: "string",
          description: "A state token returned in the @odata.nextLink URL of the previous delta function call. Accepts either the full @odata.nextLink URL or just the bare token value. Use this to page through large result sets during initial sync or updates. Keep paginating until you receive '@odata.deltaLink' instead of nextLink.",
        },
        deltatoken: {
          type: "string",
          description: "A state token returned in the @odata.deltaLink URL of the previous delta function call. Accepts either the full @odata.deltaLink URL or just the bare token value. Use this to get only changes since the last sync. On first call, omit this parameter to get all events in the time range. Store the @odata.deltaLink from the response for subsequent calls.",
        },
        end_datetime: {
          type: "string",
          description: "The end date and time of the time range, represented in ISO 8601 format. For example, '2015-11-08T20:00:00.0000000' or '2015-11-08T20:00:00Z'. This parameter is required for the first delta query to establish the time window.",
        },
        start_datetime: {
          type: "string",
          description: "The start date and time of the time range, represented in ISO 8601 format. For example, '2015-11-08T19:00:00.0000000' or '2015-11-08T19:00:00Z'. This parameter is required for the first delta query to establish the time window.",
        },
      },
      required: [
        "start_datetime",
        "end_datetime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_calendars",
    description: "Tool to list calendars in the signed-in user's mailbox. Use when you need to retrieve calendars with optional OData queries.",
    toolSlug: "OUTLOOK_LIST_CALENDARS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of calendars to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of calendars to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter expression (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by expressions (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "rooms_and_calendars",
    ],
  }),
  composioTool({
    name: "outlook_list_chat_messages",
    description: "Tool to list messages in a Teams chat. Use when you need message IDs to select a specific message for further actions.",
    toolSlug: "OUTLOOK_LIST_CHAT_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Number of messages per page (max 50).",
        },
        filter: {
          type: "string",
          description: "OData filter expression for date/time filtering; honored when matching orderby property.",
        },
        chat_id: {
          type: "string",
          description: "ID of the chat to retrieve messages from.",
        },
        orderby: {
          type: "string",
          description: "Order by property; supports 'lastModifiedDateTime desc' or 'createdDateTime desc'.",
        },
        skiptoken: {
          type: "string",
          description: "Pagination token from the @odata.nextLink of a previous response. Pass the $skiptoken value (not the full URL) to retrieve the next page of results.",
        },
      },
      required: [
        "chat_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_list_chats",
    description: "Tool to list Teams chats. Use when you need chat IDs and topics to select a chat for further actions.",
    toolSlug: "OUTLOOK_LIST_CHATS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Number of chat items per page (max 50).",
        },
        expand: {
          type: "string",
          description: "Related entities to expand: 'members' or 'lastMessagePreview'.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter chats, such as by topic.",
        },
        orderby: {
          type: "string",
          description: "Properties to order by; only 'lastMessagePreview/createdDateTime desc' is supported (ascending order not supported).",
        },
        user_id: {
          type: "string",
          description: "User ID (GUID or email) to list chats for. Required for S2S (app-only) authentication. If not provided, uses '/me' endpoint (requires delegated authentication).",
        },
        skiptoken: {
          type: "string",
          description: "Pagination token from the @odata.nextLink of a previous response. Pass the $skiptoken value (not the full URL) to retrieve the next page of results.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_list_child_folder_contacts",
    description: "Tool to retrieve contacts from a user's child contact folder. Use when you need to access contacts organized in nested folder structures for a specific user.",
    toolSlug: "OUTLOOK_LIST_CHILD_FOLDER_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of contacts to retrieve per page (1-999).",
        },
        skip: {
          type: "integer",
          description: "Number of contacts to skip from the beginning of the result set, for pagination. Use with 'top' to iterate through large contact lists.",
        },
        filter: {
          type: "string",
          description: "OData V4 filter expression for targeted retrieval.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific contact properties to retrieve. Valid Contact properties: displayName, givenName, surname, middleName, nickName, title, generation, emailAddresses, imAddresses, jobTitle, companyName, department, officeLocation, profession, businessHomePage, assistantName, manager, homePhones, mobilePhone, businessPhones, spouseName, personalNotes, children, homeAddress, businessAddress, otherAddress, categories, birthday, fileAs, initials, yomiGivenName, yomiSurname, yomiCompanyName, parentFolderId, changeKey, createdDateTime, lastModifiedDateTime.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to sort results by. Each item is a string like 'displayName asc' or 'createdDateTime desc'. MUST be provided as a list, even for single sort criteria. 'asc' is default.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user (email address or user ID). Use email format (e.g., 'user@example.com') or Azure AD user ID.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder to retrieve contacts from. Required.",
        },
        contact_folder_id: {
          type: "string",
          description: "The ID of the parent contact folder containing the child folder. Required.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_list_child_folder_messages",
    description: "Tool to list messages from a child folder within a parent mail folder. Use when you need to retrieve messages from a subfolder that exists within another folder.",
    toolSlug: "OUTLOOK_LIST_CHILD_FOLDER_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of messages to return per request (1-1000). Always check response['@odata.nextLink'] for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of messages to skip from the beginning of the result set, for pagination.",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter messages. Examples: 'isRead eq false', 'from/emailAddress/address eq 'sender@example.com'', 'receivedDateTime ge 2023-01-01T00:00:00Z', 'hasAttachments eq true'. Note: Combining complex filters (especially on nested properties like 'from/emailAddress/address') with the 'orderby' parameter may fail with an InefficientFilter error. In such cases, remove 'orderby' or apply sorting client-side.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. OData $select parameter. Valid properties include: id, subject, from, toRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId.",
        },
        orderby: {
          type: "string",
          description: "Property to sort results by with direction. OData $orderby parameter. Example: 'receivedDateTime desc' or 'subject asc'. Note: Using 'orderby' together with complex 'filter' queries (especially on nested properties like 'from/emailAddress/address') may fail with an InefficientFilter error. If this occurs, either remove 'orderby' or apply sorting client-side.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names (e.g., 'workjournal') are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder within the parent mail folder from which to retrieve messages. This must be a base64-encoded folder ID (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_CHILD_MAIL_FOLDERS. Well-known names are NOT valid for child folders.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_child_mail_folders",
    description: "Tool to list subfolders (childFolders) under a specified Outlook mail folder. Use when navigating nested folder hierarchies or checking if a folder has subfolders.",
    toolSlug: "OUTLOOK_LIST_CHILD_MAIL_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of child folders to return. OData $top parameter.",
        },
        skip: {
          type: "integer",
          description: "Number of child folders to skip from the beginning of the result set (OData $skip). Use with $top for pagination.",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter the child folders. Example: 'isHidden eq false'.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of mailFolder properties to include in the response. OData $select parameter. Valid properties include: id, displayName, parentFolderId, childFolderCount, unreadItemCount, totalItemCount, isHidden.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        parent_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For folder IDs, obtain them from OUTLOOK_LIST_MAIL_FOLDERS or previous childFolders responses. Folder IDs are base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=') that are mailbox-specific and must come from the same user's mailbox. No URL encoding needed - it's handled automatically.",
        },
        include_hidden_folders: {
          type: "boolean",
          description: "Include hidden mail folders (isHidden=true) when set to true.",
        },
      },
      required: [
        "parent_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_contact_folder_child_folders",
    description: "Tool to list child folders under a specified contact folder. Use when navigating nested contact folder hierarchies or organizing contacts into subfolder structures.",
    toolSlug: "OUTLOOK_LIST_CONTACT_FOLDER_CHILD_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of child folders to return. OData $top parameter.",
        },
        skip: {
          type: "integer",
          description: "Number of child folders to skip for pagination. OData $skip parameter.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Related entities to expand inline. OData $expand parameter. Example: ['contacts'].",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter the child folders. Example: startswith(displayName,'A').",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contactFolder properties to include in the response. OData $select parameter. Valid properties include: id, displayName, parentFolderId.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to order results by. OData $orderby parameter. Example: ['displayName asc'].",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        folder_id: {
          type: "string",
          description: "The ID of the parent contact folder. Obtain folder IDs from OUTLOOK_GET_CONTACT_FOLDERS or previous childFolders responses. Folder IDs are base64-encoded strings that are mailbox-specific and must come from the same user's mailbox.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_list_contact_folders_delta",
    description: "Tool to get contact folders that have been added, deleted, or updated. Use when tracking changes to contact folder structure without fetching all folders each time.",
    toolSlug: "OUTLOOK_LIST_CONTACT_FOLDERS_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response. The id property is always returned. Available properties: id, displayName, parentFolderId.",
        },
        user_id: {
          type: "string",
          description: "The ID (user principal name or GUID) of the user. Required for app-only (S2S) authentication. If not provided, uses '/me' endpoint (requires delegated authentication). Accepts both email format (user@domain.com) and GUID format.",
        },
        skiptoken: {
          type: "string",
          description: "A state token returned in the @odata.nextLink URL of the previous delta function call. Accepts either the full @odata.nextLink URL or just the bare token value. Use this to page through large result sets during initial sync or updates. Keep paginating until you receive '@odata.deltaLink' instead of nextLink.",
        },
        deltatoken: {
          type: "string",
          description: "A state token returned in the @odata.deltaLink URL of the previous delta function call. Accepts either the full @odata.deltaLink URL or just the bare token value. Use this to get only changes since the last sync. On first call, omit this parameter to get all contact folders. Store the @odata.deltaLink from the response for subsequent calls.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_list_contacts_delta",
    description: "Retrieve incremental changes (delta) of contacts in a specified folder. Use when syncing contacts without fetching the entire set each time. FIRST RUN: Returns ALL contacts in folder. Response has @odata.deltaLink. SUBSEQUENT: Pass stored deltaLink to get only NEW/UPDATED/DELETED contacts since last sync.",
    toolSlug: "OUTLOOK_LIST_CONTACTS_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contact properties to include (e.g. ['displayName','emailAddresses']). Available properties: id, displayName, givenName, surname, middleName, nickName, title, generation, emailAddresses, imAddresses, jobTitle, companyName, department, officeLocation, profession, businessHomePage, assistantName, manager, homePhones, mobilePhone, businessPhones, spouseName, personalNotes, children, homeAddress, businessAddress, otherAddress, categories, birthday, fileAs, initials, yomiGivenName, yomiSurname, yomiCompanyName, parentFolderId, changeKey, createdDateTime, lastModifiedDateTime.",
        },
        user_id: {
          type: "string",
          description: "User ID (GUID) or user principal name (email) for app-only (S2S) authentication. Required when using client credentials flow. If not provided, uses '/me' endpoint (delegated auth). Example: '43f0c14d-bca8-421f-b762-c3d8dd75be1f' or 'user@example.com'",
        },
        skip_token: {
          type: "string",
          description: "Skip token for paging through large result sets during initial sync. Accepts either the full @odata.nextLink URL or just the bare token value. Keep paginating until you receive '@odata.deltaLink' instead of nextLink. Mutually exclusive with delta_token - only one should be provided per request.",
        },
        delta_token: {
          type: "string",
          description: "Delta token from a previous call to get only changes since that state. Accepts either the full @odata.deltaLink URL or just the bare token value. If omitted or invalid (placeholders like <token> are ignored), performs initial sync. Response includes @odata.deltaLink - store this for subsequent calls. Mutually exclusive with skip_token - only one should be provided per request.",
        },
        contact_folder_id: {
          type: "string",
          description: "Contact folder identifier (folder GUID). Use GET_CONTACT_FOLDERS action to retrieve available folder IDs.",
        },
      },
      required: [
        "contact_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_list_email_rules",
    description: "List all email rules from inbox. No server-side filtering is supported; all rule narrowing must be done client-side after retrieval. Each rule includes a `sequence` field defining execution order and may include a `stopProcessingRules` flag affecting downstream rule execution.",
    toolSlug: "OUTLOOK_LIST_EMAIL_RULES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Number of rules to retrieve. Default is 100. Setting this too low may return an incomplete rule set; use 100 or higher to ensure all rules are retrieved.",
        },
        skip: {
          type: "integer",
          description: "Number of rules to skip before returning results. Use with 'top' for offset-based pagination.",
        },
        user_id: {
          type: "string",
          description: "The user ID or principal name (email) to list email rules for. Required for S2S (app-only) authentication. If not provided, uses the authenticated user context (/me).",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "email",
      "automation",
      "rules",
    ],
  }),
  composioTool({
    name: "outlook_list_event_attachments",
    description: "Tool to list attachments for a specific Outlook calendar event. Use when you have an event ID and need to view its attachments.",
    toolSlug: "OUTLOOK_LIST_EVENT_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of attachments to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter string to filter the attachments (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attachment properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by clauses to sort the results (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, UPN, or 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to retrieve attachments for.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_list_event_calendar_calendar_permissions",
    description: "Tool to list calendar permissions for the calendar containing a specific event. Use when you need to see who has access to a calendar that contains a particular event.",
    toolSlug: "OUTLOOK_LIST_EVENT_CALENDAR_CALENDAR_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of permissions to return (OData $top parameter).",
        },
        skip: {
          type: "integer",
          description: "Number of permissions to skip (OData $skip parameter).",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter permissions (OData $filter parameter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include in the response (OData $select parameter).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by expressions (OData $orderby parameter).",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_event_instances",
    description: "Tool to retrieve individual occurrences of a recurring calendar event within a specified time range. Use when you need to get specific instances of a recurring meeting or event series.",
    toolSlug: "OUTLOOK_LIST_EVENT_INSTANCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Show only the first n items",
        },
        skip: {
          type: "integer",
          description: "Skip the first n items",
        },
        count: {
          type: "boolean",
          description: "Include count of items",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Expand related entities",
        },
        filter: {
          type: "string",
          description: "Filter items by property values",
        },
        search: {
          type: "string",
          description: "Search items by search phrases",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Select properties to be returned",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order items by property values",
        },
        user_id: {
          type: "string",
          description: "Email address of the target user (or 'me' for authenticated user), identifying the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the recurring event (seriesMaster) for which to retrieve instances.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time of the time range in ISO 8601 format (e.g., 2026-04-30T23:59:59.0000000). Only instances that start within or overlap this range will be returned.",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time of the time range in ISO 8601 format (e.g., 2026-03-01T00:00:00.0000000). Only instances that start within or overlap this range will be returned.",
        },
      },
      required: [
        "event_id",
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_events",
    description: "Retrieves events from a user's Outlook calendar via Microsoft Graph API. Supports primary/secondary/shared calendars, pagination, filtering, property selection, sorting, and timezone specification. Use calendar_id to access non-primary calendars.",
    toolSlug: "OUTLOOK_LIST_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to retrieve per page for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of initial events to bypass, used for pagination.",
        },
        filter: {
          type: "string",
          description: "OData query string to filter calendar events. Filterable properties: 'start/dateTime', 'end/dateTime', 'subject', 'categories', 'importance', 'sensitivity', 'isAllDay', 'isCancelled', 'isReminderOn', 'type'. CRITICAL: Properties like 'body', 'bodyPreview', 'location', 'organizer', 'attendees' do NOT support $filter. Do NOT use mail properties like 'receivedDateTime' (emails only). For start/end filtering, use 'start/dateTime' and 'end/dateTime' ONLY - do NOT use 'start/date' or 'end/date' (these do not exist). Works for both all-day and timed events. Note: 'createdDateTime' and 'lastModifiedDateTime' only support $orderby/$select, NOT filtering. DateTime format: \"start/dateTime ge 'YYYY-MM-DDTHH:MM:SSZ'\" (requires single quotes and timezone suffix). Operators: ge (>=), le (<=), eq (=), gt (>), lt (<).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific event property names to return. MUST be provided as a list. If omitted, a default set of properties is returned. Valid field names: id, subject, body, bodyPreview, start, end, isAllDay, organizer, attendees, location, locations, recurrence, importance, sensitivity, showAs, categories, hasAttachments, webLink, onlineMeeting, onlineMeetingProvider, onlineMeetingUrl, isOnlineMeeting, createdDateTime, lastModifiedDateTime, changeKey, iCalUId, type, seriesMasterId, isOrganizer, isReminderOn, reminderMinutesBeforeStart, responseRequested, responseStatus, allowNewTimeProposals, hideAttendees, isCancelled, isDraft, originalStart, originalStartTimeZone, originalEndTimeZone, transactionId, cancelledOccurrences. Note: 'creator' is NOT a valid field - use 'organizer' instead to get the event creator/organizer. Invalid field names will be automatically filtered out.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to sort results by. Each item is a string like 'start/dateTime desc' or 'subject asc'. MUST be provided as a list, even for single sort criteria. Use 'asc' (default) or 'desc' for order. IMPORTANT: Use calendar event properties ONLY. Do NOT use mail/message properties like 'receivedDateTime' (which is for emails only). Valid sortable datetime fields: 'start/dateTime', 'end/dateTime', 'createdDateTime', 'lastModifiedDateTime'. Invalid mail properties will be auto-corrected to 'start/dateTime'.",
        },
        user_id: {
          type: "string",
          description: "Email address of the target user (or 'me' for authenticated user), identifying the calendar for event listing.",
        },
        timezone: {
          type: "string",
          description: "Preferred timezone for event start/end times. Accepts IANA format (e.g., 'America/New_York', 'Europe/London', 'Indian/Mauritius', 'Asia/Tokyo') or Windows format (e.g., 'Eastern Standard Time', 'Pacific Standard Time'). Placeholder patterns like '<REGION>/London' are auto-resolved to valid IANA timezones (e.g., 'Europe/London') where the city can be matched. Falls back to 'UTC' only if the timezone cannot be resolved.",
        },
        calendar_id: {
          type: "string",
          description: "Optional ID of a specific calendar to retrieve events from. If not provided, uses the default calendar. Get calendar IDs using LIST_CALENDARS action. IMPORTANT: Do NOT use 'primary' or 'default' as values - these are not valid calendar IDs in Microsoft Graph. Leave this field empty/null to access the default calendar. Useful for accessing secondary calendars, shared calendars, or team calendars.",
        },
        expand_recurring_events: {
          type: "boolean",
          description: "When true, automatically expands recurring events to show actual occurrences within the filtered date range instead of series masters. When false (default), returns series masters as before.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_list_inference_classification_overrides",
    description: "Tool to list inference classification overrides that control Focused Inbox sender rules. Use when you need to see which senders are configured to always appear in Focused or Other inbox.",
    toolSlug: "OUTLOOK_LIST_INFERENCE_CLASSIFICATION_OVERRIDES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of overrides to return per page (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of items to skip for pagination (OData $skip).",
        },
        user_id: {
          type: "string",
          description: "The user's unique identifier or 'me' for the authenticated user. Use 'me' to get overrides for your own mailbox, or specify a user ID/email for delegated access.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "inference_classification",
    ],
  }),
  composioTool({
    name: "outlook_list_mail_folder_message_attachments",
    description: "Tool to get attachments from a message in a specific mail folder. Use when you need to retrieve attachment metadata from a message located in a particular folder.",
    toolSlug: "OUTLOOK_LIST_MAIL_FOLDER_MESSAGE_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return per page (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of items to skip for pagination (OData $skip).",
        },
        user_id: {
          type: "string",
          description: "The user ID or principal name (email) of the user mailbox to access. Required for app-only (S2S) authentication. Use 'me' or omit for delegated authentication. Example: '43f0c14d-bca8-421f-b762-c3d8dd75be1f' or 'user@domain.com'",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message from which to retrieve attachments. Must be a message ID obtained from OUTLOOK_LIST_MESSAGES or OUTLOOK_SEARCH_EMAILS.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names (e.g., 'workjournal') are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
        response_detail: {
          type: "string",
          description: "Level of detail in the response. 'minimal' (default) returns only attachment metadata (id, name, size, contentType, etc.) for efficient listing. 'full' includes the base64-encoded file content (contentBytes) for downloading.",
          enum: [
            "minimal",
            "full",
          ],
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_mail_folder_message_rules",
    description: "Tool to list message rules for a specific mail folder. Use when you need to retrieve rules configured for a particular folder.",
    toolSlug: "OUTLOOK_LIST_MAIL_FOLDER_MESSAGE_RULES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of message rules to return. Default is all rules if not specified.",
        },
        skip: {
          type: "integer",
          description: "Number of rules to skip before returning results. Use with 'top' for offset-based pagination.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder from which to retrieve message rules. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_mail_folder_messages",
    description: "Tool to list messages from a specific mail folder including subfolders. Use when you need to retrieve messages from a particular folder or subfolder by its ID or well-known name.",
    toolSlug: "OUTLOOK_LIST_MAIL_FOLDER_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of messages to return per request (1-1000). Always check response['@odata.nextLink'] for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of messages to skip from the beginning of the result set, for pagination.",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter messages. Examples: 'isRead eq false', 'from/emailAddress/address eq 'sender@example.com'', 'receivedDateTime ge 2023-01-01T00:00:00Z', 'hasAttachments eq true'. Note: Combining complex filters (especially on nested properties like 'from/emailAddress/address') with the 'orderby' parameter may fail with an InefficientFilter error. In such cases, remove 'orderby' or apply sorting client-side.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. OData $select parameter. Valid properties include: id, subject, from, toRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId.",
        },
        orderby: {
          type: "string",
          description: "Property to sort results by with direction. OData $orderby parameter. Example: 'receivedDateTime desc' or 'subject asc'. Note: Using 'orderby' together with complex 'filter' queries (especially on nested properties like 'from/emailAddress/address') may fail with an InefficientFilter error. If this occurs, either remove 'orderby' or apply sorting client-side.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder from which to retrieve messages. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names (e.g., 'workjournal') are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_mail_folders",
    description: "Tool to list a user's top-level mail folders. Use when you need folders like Inbox, Drafts, Sent Items; set include_hidden_folders=True to include hidden folders.",
    toolSlug: "OUTLOOK_LIST_MAIL_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of items to return per page.",
        },
        skip: {
          type: "integer",
          description: "Number of items to skip before returning results.",
        },
        count: {
          type: "boolean",
          description: "Include total count of matching items in the response.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter mail folders. String values must be enclosed in single quotes (e.g., displayName eq 'Inbox'). WARNING: Microsoft Graph API does not officially document which mailFolder properties support filtering. Known unsupported properties: parentFolderId (causes ErrorInvalidProperty error). To filter by parent folder, use the child folders endpoint instead: GET /me/mailFolders/{parentFolderId}/childFolders. Properties like isHidden may work but are not guaranteed.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of properties to include in the response.",
        },
        orderby: {
          type: "string",
          description: "Property to sort by, optionally followed by 'asc' or 'desc'.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        include_hidden_folders: {
          type: "boolean",
          description: "Include hidden mail folders (isHidden=true) when set to true.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_mail_folders_delta",
    description: "Tool to get incremental changes to mail folders. Use when you need to track additions, deletions, or updates to mail folders without fetching the entire folder list each time.",
    toolSlug: "OUTLOOK_LIST_MAIL_FOLDERS_DELTA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        select: {
          type: "string",
          description: "OData query parameter to specify only the properties needed for best performance. Comma-separated list of properties (e.g., 'id,displayName,parentFolderId'). The 'id' property is always returned.",
        },
        user_id: {
          type: "string",
          description: "Identifier for the user whose mailbox changes to track. Use 'me' for the authenticated user or provide the user's principal name or ID.",
        },
        skiptoken: {
          type: "string",
          description: "A state token returned in the @odata.nextLink URL of the previous delta function call, indicating there are further changes to be tracked in the same round.",
        },
        deltatoken: {
          type: "string",
          description: "A state token returned in the @odata.deltaLink URL of the previous delta function call, indicating the completion of that round of change tracking. Include this to get changes since the last complete sync.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_me_calendar_permissions",
    description: "Tool to list calendar permissions for a specific user's calendar. Use when you need to see who has access to a user's calendar and their permission levels.",
    toolSlug: "OUTLOOK_LIST_ME_CALENDAR_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of permissions to return (OData $top parameter).",
        },
        skip: {
          type: "integer",
          description: "Number of permissions to skip (OData $skip parameter).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName of the user whose calendar permissions to list.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_message_attachments_from_child_folder",
    description: "Tool to list attachments from a message in a nested child mail folder. Use when you need to retrieve attachment metadata from a message located in a subfolder.",
    toolSlug: "OUTLOOK_LIST_MESSAGE_ATTACHMENTS_FROM_CHILD_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return per request. Check response['@odata.nextLink'] for pagination if more results exist.",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter attachments. Examples: 'size gt 1000000', 'isInline eq false', 'contentType eq \"application/pdf\"'.",
        },
        select: {
          type: "string",
          description: "Comma-separated list of attachment properties to include. Valid properties: id, name, contentType, size, isInline, lastModifiedDateTime. Example: 'id,name,size'.",
        },
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or 'me' for the signed-in user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message from which to retrieve attachments. Must be a message ID obtained from list or search operations, not a folder ID.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Valid well-known names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For custom folders, use the base64-encoded folder ID from OUTLOOK_LIST_MAIL_FOLDERS.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the message. Must be a valid folder ID (base64-encoded string) obtained from OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_messages",
    description: "Retrieves a list of email messages from a specified mail folder in an Outlook mailbox, with options for filtering (including by conversationId to get all messages in a thread), pagination, and sorting; ensure 'user_id' and 'folder' are valid, and all date/time strings are in ISO 8601 format.",
    toolSlug: "OUTLOOK_LIST_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of messages to return per request (1-1000). Always check response['@odata.nextLink'] for pagination. If present, make additional requests with that URL (includes $skiptoken). Repeat until '@odata.nextLink' is absent. For large mailboxes (1000+ messages), always paginate.",
        },
        skip: {
          type: "integer",
          description: "Number of messages to skip from the beginning of the result set, for pagination.",
        },
        folder: {
          type: "string",
          description: "ID or well-known name of the mail folder. Well-known names (case-insensitive): archive, clutter, conflicts, conversationhistory, deleteditems, drafts, inbox, junkemail, localfailures, msgfolderroot, outbox, recoverableitemsdeletions, scheduled, searchfolders, sentitems, serverfailures, syncissues. Use 'allfolders' to search across all mail folders (uses /messages endpoint without folder filter). Or use a valid folder ID (base64-like string, e.g., 'AAMkAGI0ZjExAAA='). Accepts both raw folder IDs and percent-encoded folder IDs (with %XX sequences).",
        },
        search: {
          type: "string",
          description: "Full-text search query using Microsoft Graph $search syntax. Searches across subject, body, and sender fields server-side. Cannot be combined with $filter or $orderby. Example: 'budget report' or 'from:john@example.com'",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Message properties to include. Accepts a list of strings or a comma-separated string (e.g., 'id,subject,from'). Valid properties: id, subject, from, toRecipients, ccRecipients, bccRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId, conversationIndex, flag, internetMessageHeaders, parentFolderId, replyTo, sender, webLink, isDraft, isReadReceiptRequested, isDeliveryReceiptRequested, changeKey, createdDateTime, lastModifiedDateTime, inferenceClassification, size, internetMessageId. Note: attachments is not selectable.",
        },
        is_read: {
          type: "boolean",
          description: "Filter by read status: 'true' for read, 'false' for unread. Unspecified means no filter by read status.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to sort results by, with direction. Accepts a list of strings or a comma-separated string. Each item should be like 'receivedDateTime desc' or 'subject asc'. Default is 'receivedDateTime desc'. Cannot be used with sentDateTime filters in Sent folder.",
        },
        subject: {
          type: "string",
          description: "Filter by exact match of the subject line. Special characters like apostrophes, brackets will be automatically escaped. For complex subject searches, consider using 'Search Messages' instead.",
        },
        user_id: {
          type: "string",
          description: "Target user's email or 'me' for authenticated user. For delegated access, use shared mailbox or delegated user's email.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by categories (case-sensitive); matches if tagged with any specified category.",
        },
        importance: {
          type: "string",
          description: "Filter by importance: 'low', 'normal', or 'high'.",
        },
        from_address: {
          type: "string",
          description: "Filter by the sender's exact email address. NOTE: This filter is applied client-side on the returned results, not server-side.",
        },
        conversation_id: {
          type: "string",
          description: "Filter messages by conversation ID to retrieve all messages in a specific email thread. NOTE: This filter is applied client-side on the returned results.",
        },
        has_attachments: {
          type: "boolean",
          description: "Filter by attachment presence: 'true' for messages with attachments, 'false' for those without. NOTE: This filter is applied client-side on the returned results.",
        },
        response_detail: {
          type: "string",
          description: "Level of detail in the response. 'minimal' (default) applies a default $select projection that excludes the heavy 'body', 'uniqueBody', and 'internetMessageHeaders' fields to keep responses small — typical for listing/search use cases. 'full' returns the complete message payload from Microsoft Graph, including the full HTML body. Note: an explicit `select` list always wins over `response_detail` — pass select=['body','subject',...] to control the fields directly.",
          enum: [
            "minimal",
            "full",
          ],
        },
        subject_contains: {
          type: "string",
          description: "Filter messages where the subject contains the specified case-insensitive substring. NOTE: This filter is applied client-side on the returned results. For better performance, use 'Search Messages' instead.",
        },
        subject_endswith: {
          type: "string",
          description: "Filter messages where the subject ends with the specified case-insensitive string. NOTE: This filter is applied client-side on the returned results. For better performance, use 'Search Messages' instead.",
        },
        sent_date_time_gt: {
          type: "string",
          description: "Filter messages sent after this ISO 8601 timestamp.",
        },
        sent_date_time_lt: {
          type: "string",
          description: "Filter messages sent before this ISO 8601 timestamp.",
        },
        subject_startswith: {
          type: "string",
          description: "Filter messages where the subject starts with the specified case-insensitive string.",
        },
        received_date_time_ge: {
          type: "string",
          description: "Filter messages received on or after this ISO 8601 timestamp.",
        },
        received_date_time_gt: {
          type: "string",
          description: "Filter messages received after this ISO 8601 timestamp (e.g., '2023-01-01T00:00:00Z').",
        },
        received_date_time_le: {
          type: "string",
          description: "Filter messages received on or before this ISO 8601 timestamp.",
        },
        received_date_time_lt: {
          type: "string",
          description: "Filter messages received before this ISO 8601 timestamp.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mcpignore",
    ],
  }),
  composioTool({
    name: "outlook_list_outlook_attachments",
    description: "Lists metadata (name, size, contentType, isInline — but not `contentBytes`) for all attachments of a specified Outlook email message. Returns fileAttachment, itemAttachment, and referenceAttachment types; only fileAttachment entries support download via OUTLOOK_DOWNLOAD_OUTLOOK_ATTACHMENT. Results include inline images and signatures — filter by `isInline == false` and check `contentType` to identify real document attachments. Results are nested under `data.response_data.value`.",
    toolSlug: "OUTLOOK_LIST_OUTLOOK_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use the user's UPN (e.g., 'AdeleV@contoso.onmicrosoft.com') or 'me' for the currently authenticated user. This specifies the mailbox to query.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message from which to retrieve attachments. Must be a message ID (obtained from OUTLOOK_LIST_MESSAGES or OUTLOOK_SEARCH_EMAILS), not a folder ID or calendar event ID. Folder IDs look similar but will cause an error. When sourcing from OUTLOOK_SEARCH_EMAILS, use `hitId` as the message identifier — not `resource.id`.",
        },
        response_detail: {
          type: "string",
          description: "Level of detail in the response. 'minimal' (default) returns only the attachment metadata that exists on the Graph attachment base type (id, name, size, contentType, isInline, lastModifiedDateTime) — the base64-encoded contentBytes and any fileAttachment-only fields (contentId, contentLocation) are excluded so the heavy file payload never leaves Microsoft Graph. 'full' returns the complete payload including contentBytes for downloading.",
          enum: [
            "minimal",
            "full",
          ],
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_list_places",
    description: "Retrieves a collection of place objects defined in a tenant by type. Places can include rooms, workspaces, buildings, floors, sections, desks, and room lists. When room_list_id is provided, returns only rooms or workspaces within that specific room list using the /places/{roomListId}/microsoft.graph.roomlist/rooms (or /workspaces) endpoint. Use this action when you need to discover available physical spaces or locations within an organization. Note: Before using this API, ensure that the Places settings are properly configured in the tenant.",
    toolSlug: "OUTLOOK_LIST_PLACES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of places to return per page. Default is 25. API defaults: 100 for rooms/workspaces/room lists, 1000 for buildings/floors/sections/desks.",
        },
        skip: {
          type: "integer",
          description: "Number of places to skip for pagination (OData $skip).",
        },
        count: {
          type: "boolean",
          description: "Include count of items (OData $count=true). Only supported for room, workspace, and room_list types.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to restrict returned places (OData $filter). Only supported for room, workspace, and room_list types. Example: capacity gt 50.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of place properties to include in the response (OData $select). Example: displayName, emailAddress, capacity.",
        },
        placeType: {
          type: "string",
          description: "The type of place to retrieve. Choose from: room, workspace, room_list, building, floor, section, or desk.",
          enum: [
            "microsoft.graph.room",
            "microsoft.graph.workspace",
            "microsoft.graph.roomlist",
            "microsoft.graph.building",
            "microsoft.graph.floor",
            "microsoft.graph.section",
            "microsoft.graph.desk",
          ],
        },
        roomListId: {
          type: "string",
          description: "The email address of a room list. When provided, scopes the results to rooms or workspaces within that specific room list using the MS Graph endpoint GET /places/{roomListId}/microsoft.graph.roomlist/rooms (or /workspaces). Must be the room list's email address (not its ID). Only valid when place_type is 'room' or 'workspace'.",
        },
      },
      required: [
        "placeType",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "rooms_and_calendars",
    ],
  }),
  composioTool({
    name: "outlook_list_primary_calendar_permissions",
    description: "Tool to list calendar permissions from a user's primary calendar. Use when you need to see who has access to the primary calendar and their permission levels.",
    toolSlug: "OUTLOOK_LIST_PRIMARY_CALENDAR_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of permissions to return (OData $top parameter).",
        },
        skip: {
          type: "integer",
          description: "Number of permissions to skip (OData $skip parameter).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_reminders",
    description: "Tool to retrieve reminders for events occurring within a specified time range. Use when you need to see upcoming reminders between two datetimes.",
    toolSlug: "OUTLOOK_LIST_REMINDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "User Principal Name or ID. Use 'me' to indicate the signed-in user.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time in ISO 8601 format defining the window for reminders. Example: '2023-10-26T20:00:00.0000000'.",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time in ISO 8601 format defining the window for reminders. Example: '2023-10-26T19:00:00.0000000'.",
        },
      },
      required: [
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "tasks_and_reminders",
    ],
  }),
  composioTool({
    name: "outlook_list_sent_items_messages",
    description: "Tool to list all messages in the SentItems mail folder of the signed-in user's mailbox. Use when you need to retrieve sent messages with optional filtering and sorting.",
    toolSlug: "OUTLOOK_LIST_SENT_ITEMS_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of messages to return per request (1-1000). Always check response['@odata.nextLink'] for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of messages to skip from the beginning of the result set, for pagination.",
        },
        filter: {
          type: "string",
          description: "OData $filter query to filter messages. Examples: 'isRead eq false', 'toRecipients/any(a:a/emailAddress/address eq \"recipient@example.com\")', 'sentDateTime ge 2023-01-01T00:00:00Z', 'hasAttachments eq true'. Note: Combining complex filters with the 'orderby' parameter may fail with an InefficientFilter error. In such cases, remove 'orderby' or apply sorting client-side.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response. OData $select parameter. Valid properties include: id, subject, from, toRecipients, receivedDateTime, sentDateTime, hasAttachments, importance, isRead, body, bodyPreview, categories, conversationId.",
        },
        orderby: {
          type: "string",
          description: "Property to sort results by with direction. OData $orderby parameter. Example: 'sentDateTime desc' or 'subject asc'. Note: Using 'orderby' together with complex 'filter' queries may fail with an InefficientFilter error. If this occurs, either remove 'orderby' or apply sorting client-side.",
        },
        user_id: {
          type: "string",
          description: "User ID (GUID) or user principal name (email) of the user whose sent items to list. Required for app-only (S2S) authentication. Not required for delegated authentication (uses signed-in user by default).",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "mail",
    ],
  }),
  composioTool({
    name: "outlook_list_to_do_lists",
    description: "Tool to list Microsoft To Do task lists for the signed-in user. Use when you need to discover available task lists before listing or creating tasks. Returns todoTaskList objects with id and displayName that can be used in downstream operations.",
    toolSlug: "OUTLOOK_LIST_TO_DO_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of task lists to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of task lists to skip from the beginning of the result set (OData $skip). Use with $top for pagination.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter task lists (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Properties to include in the response (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by expressions (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "User ID or userPrincipalName. Use 'me' for the signed-in user.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "outlook_list_todo_tasks",
    description: "Tool to list tasks within a specified Microsoft To Do task list, including status and due dates. Use when retrieving tasks from a specific To Do list.",
    toolSlug: "OUTLOOK_LIST_TODO_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of tasks to retrieve per page (OData $top parameter). Use for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of tasks to skip before returning results (OData $skip parameter). Use with 'top' for offset-based pagination.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to narrow down results (OData $filter parameter). Use for filtering by status, importance, dates, etc. Examples: \"status eq 'notStarted'\", \"importance eq 'high'\", \"dueDateTime/dateTime ge '2024-01-01T00:00:00Z'\"",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to sort results by (OData $orderby parameter). Each item is a string like 'dueDateTime/dateTime desc' or 'title asc'. Use 'asc' (default) or 'desc' for sort order.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier (GUID) or user principal name (email) of the user. Required for app-only (S2S) authentication. If not provided, defaults to '/me' endpoint (delegated authentication).",
        },
        todo_task_list_id: {
          type: "string",
          description: "The unique identifier of the To Do task list to retrieve tasks from.",
        },
      },
      required: [
        "todo_task_list_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendar_event_instances",
    description: "Tool to retrieve instances (occurrences) of a recurring event from a specific calendar within a date range. Use when you need event instances from a particular calendar.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDAR_EVENT_INSTANCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of event instances to return per page (OData $top). Controls page size for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of event instances to skip from the beginning of the result set (OData $skip). Use with $top for pagination.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user (can be user ID, userPrincipalName, or 'me' for authenticated user).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the recurring event (seriesMaster) for which to retrieve instances.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time of the time range in ISO 8601 format (e.g., '2026-04-30T23:59:59.0000000'). Only instances that start within or overlap this range will be returned.",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time of the time range in ISO 8601 format (e.g., '2026-03-01T00:00:00.0000000'). Only instances that start within or overlap this range will be returned.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "event_id",
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendar_events_attachments",
    description: "Tool to list attachments for a user's calendar event. Use when you need to retrieve all attachments from a specific event in a user's calendar.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDAR_EVENTS_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of attachments to return (OData $top).",
        },
        skip: {
          type: "integer",
          description: "Number of attachments to skip (OData $skip).",
        },
        filter: {
          type: "string",
          description: "OData filter string to filter the attachments (OData $filter).",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attachment properties to include (OData $select).",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Order by clauses to sort the results (OData $orderby).",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, UPN, or 'me' for the signed-in user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to retrieve attachments from.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendar_group_event_instances",
    description: "Tool to list instances (occurrences) of a recurring event within a specified date range from a user's calendar in a calendar group. Use when you need to retrieve specific occurrences of a recurring event.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDAR_GROUP_EVENT_INSTANCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of event instances to return per page (OData $top). Controls page size for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of event instances to skip from the beginning of the result set (OData $skip). Use with $top for pagination.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user (can be user ID or userPrincipalName).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time of the time range in ISO 8601 format (e.g., '2026-05-01T00:00:00.0000000').",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time of the time range in ISO 8601 format (e.g., '2026-03-01T00:00:00.0000000').",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendar_groups_calendar_view",
    description: "Tool to get calendar view from a specific calendar within a calendar group for a user. Use when retrieving events from a calendar that belongs to a calendar group.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDAR_GROUPS_CALENDAR_VIEW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to return per page (OData $top). Controls page size for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of events to skip from the beginning of the result set (OData $skip). Use with $top for pagination.",
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName. Examples: '6640adbb5cb743b0' or 'user@example.com'.",
        },
        calendar_id: {
          type: "string",
          description: "The calendar ID within the calendar group. This is the unique identifier of the specific calendar.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time of the time range in ISO 8601 format (e.g., '2025-01-31T23:59:59Z' or '2019-11-08T20:00:00-08:00').",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time of the time range in ISO 8601 format (e.g., '2025-01-01T00:00:00Z' or '2019-11-08T19:00:00-08:00').",
        },
        calendar_group_id: {
          type: "string",
          description: "The calendar group ID. This is the unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendar_view",
    description: "Tool to get calendar view from a specific user's calendar. Use when you need to retrieve events that occur or overlap with a specified time window from a user's specific calendar by calendar ID.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDAR_VIEW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to retrieve.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of event properties to return. Defaults to commonly-needed fields excluding the full HTML body. To include the full body content, explicitly add 'body' to this list.",
        },
        user_id: {
          type: "string",
          description: "The ID of the user or 'me' for the authenticated user. This can be the user's email address or their unique identifier.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to retrieve events from. Get calendar IDs using the LIST_CALENDARS action.",
        },
        endDateTime: {
          type: "string",
          description: "The end date and time of the time range in ISO 8601 format with timezone offset (e.g., '2024-12-31T23:59:59-08:00' or '2024-12-31T23:59:59+00:00' for UTC). Events active up to this time will be included.",
        },
        startDateTime: {
          type: "string",
          description: "The start date and time of the time range in ISO 8601 format with timezone offset (e.g., '2024-01-01T00:00:00-08:00' or '2024-01-01T00:00:00+00:00' for UTC). Events active during this window will be returned.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
        "startDateTime",
        "endDateTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendars_calendar_permissions",
    description: "Tool to list calendar permissions for a specific user's specific calendar. Use when you need to see who has access to a user's calendar and their permission levels.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDARS_CALENDAR_PERMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of permissions to return (OData $top parameter).",
        },
        skip: {
          type: "integer",
          description: "Number of permissions to skip (OData $skip parameter).",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Cannot use 'me' shortcut - must be actual user ID or userPrincipalName.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_calendars_events",
    description: "Tool to retrieve events from a specific calendar for a user. Use when you need to list calendar events for a specific user by user ID and calendar ID.",
    toolSlug: "OUTLOOK_LIST_USER_CALENDARS_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of events to retrieve per page for pagination.",
        },
        skip: {
          type: "integer",
          description: "Number of initial events to bypass, used for pagination.",
        },
        filter: {
          type: "string",
          description: "OData query string to filter calendar events. ONLY the following properties support filtering: 'start/dateTime', 'end/dateTime', 'subject', 'categories', 'importance', 'sensitivity', 'isAllDay', 'isCancelled', 'isReminderOn', 'type'. CRITICAL: Properties like 'body', 'bodyPreview', 'location', 'locations', 'organizer', 'attendees' do NOT support $filter and will cause errors. IMPORTANT: Use calendar event properties ONLY. Do NOT use mail/message properties like 'receivedDateTime'. For start/end filtering, you MUST use 'start/dateTime' and 'end/dateTime' ONLY. DO NOT use 'start/date' or 'end/date' - these properties do NOT exist and will cause errors. DateTime format: \"start/dateTime ge 'YYYY-MM-DDTHH:MM:SSZ'\" (requires single quotes and timezone suffix). Operators: ge (>=), le (<=), eq (=), gt (>), lt (<). DateTime values without quotes or timezone suffix will be automatically normalized.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific event property names to return. MUST be provided as a list. If omitted, a default set of properties is returned. Valid field names: id, subject, body, bodyPreview, start, end, isAllDay, organizer, attendees, location, locations, recurrence, importance, sensitivity, showAs, categories, hasAttachments, webLink, onlineMeeting, onlineMeetingProvider, onlineMeetingUrl, isOnlineMeeting, createdDateTime, lastModifiedDateTime, changeKey, iCalUId, type, seriesMasterId, isOrganizer, isReminderOn, reminderMinutesBeforeStart, responseRequested, responseStatus, allowNewTimeProposals, hideAttendees, isCancelled, isDraft, originalStart, originalStartTimeZone, originalEndTimeZone, transactionId, cancelledOccurrences. Note: 'creator' is NOT a valid field - use 'organizer' instead. Invalid field names will be automatically filtered out.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to sort results by. Each item is a string like 'start/dateTime desc' or 'subject asc'. MUST be provided as a list, even for single sort criteria. Use 'asc' (default) or 'desc' for order. IMPORTANT: Use calendar event properties ONLY. Do NOT use mail/message properties like 'receivedDateTime'. Valid sortable datetime fields: 'start/dateTime', 'end/dateTime', 'createdDateTime', 'lastModifiedDateTime'.",
        },
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or user ID to identify the calendar owner.",
        },
        timezone: {
          type: "string",
          description: "Preferred timezone for event start/end times. Accepts IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo') or Windows format (e.g., 'Eastern Standard Time', 'Pacific Standard Time'). Falls back to 'UTC' if the timezone cannot be resolved.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to retrieve events from.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "calendar_and_events",
    ],
  }),
  composioTool({
    name: "outlook_list_user_contacts",
    description: "Tool to retrieve contacts from a specific user's mailbox. Use when you need to list or browse contacts for a given user.",
    toolSlug: "OUTLOOK_LIST_USER_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of contacts to return. OData $top parameter.",
        },
        skip: {
          type: "integer",
          description: "Number of contacts to skip for pagination. OData $skip parameter.",
        },
        count: {
          type: "boolean",
          description: "If true, includes a count of the total number of items in the result. OData $count parameter.",
        },
        expand: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Related entities to expand inline. OData $expand parameter.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to filter contacts. Example: emailAddresses/any(a:a/address eq 'garth@contoso.com') or startswith(displayName,'A').",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to include in the response. OData $select parameter. Valid properties: displayName, givenName, surname, emailAddresses, mobilePhone, businessPhones, jobTitle, companyName, etc.",
        },
        orderby: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to order results by. OData $orderby parameter. Format: 'property asc' or 'property desc'.",
        },
        user_id: {
          type: "string",
          description: "User principal name or ID of the user. Use 'me' for the authenticated user.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "outlook_list_users",
    description: "Tool to list users in Microsoft Entra ID. Use when you need to retrieve a paginated list of users, optionally filtering or selecting specific properties. For single-user lookups, prefer a dedicated get-user tool — listing all users is significantly heavier and slower.",
    toolSlug: "OUTLOOK_LIST_USERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of users to return (OData $top). Default page size is 100, maximum is 999.",
        },
        skip: {
          type: "integer",
          description: "Number of users to skip (OData $skip) for pagination.",
        },
        filter: {
          type: "string",
          description: "OData filter expression to restrict returned users (OData $filter). For targeted lookups, use `userPrincipalName eq 'user@domain.com'` or `mail eq 'user@domain.com'` to avoid full-list pagination scans.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user properties to include in the response (OData $select).",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_move_mail_folder",
    description: "Tool to move a mail folder and its contents to another mail folder. Use when you need to reorganize the folder hierarchy.",
    toolSlug: "OUTLOOK_MOVE_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        folder_id: {
          type: "string",
          description: "Unique ID of the mail folder to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destination_id: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). The folder being moved will become a child of this destination folder. If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
      },
      required: [
        "folder_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Move mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_move_me_mail_folder",
    description: "Tool to move a child mail folder to a different parent folder. Use when you need to reorganize subfolders within the folder hierarchy.",
    toolSlug: "OUTLOOK_MOVE_ME_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        destination_id: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). The folder being moved will become a child of this destination folder. If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the parent mail folder that contains the child folder to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
      },
      required: [
        "mail_folder_id",
        "child_folder_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Move child mail folder.",
    ],
  }),
  composioTool({
    name: "outlook_move_message",
    description: "Move a message to another folder within the specified user's mailbox. Creates a new copy in the destination folder and removes the original. The message_id changes after a successful move; use the ID returned in the response for any subsequent operations on the moved message. High-volume parallel moves can trigger HTTP 429 (MailboxConcurrency) throttling; honor the Retry-After header.",
    toolSlug: "OUTLOOK_MOVE_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destination_id: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs. Prefer folder IDs over well-known names — some tenants reject well-known names like 'deleteditems'. Retrieve current folder IDs via OUTLOOK_LIST_MAIL_FOLDERS rather than hard-coding, as IDs can become stale. Display names are localized and non-unique; never use display names as the destination_id.",
        },
      },
      required: [
        "message_id",
        "destination_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Move message to folder.",
    ],
  }),
  composioTool({
    name: "outlook_move_message_from_child_folder",
    description: "Tool to move a message from a child folder to another destination folder. Use when you need to move a message that exists within a specific folder hierarchy (parent folder → child folder → message).",
    toolSlug: "OUTLOOK_MOVE_MESSAGE_FROM_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's id, userPrincipalName, or user object ID.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destinationId: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems', 'junkemail'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the parent mail folder. Common well-known names include: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. For folder IDs, obtain them from OUTLOOK_LIST_MAIL_FOLDERS. Folder IDs are base64-encoded strings (e.g., 'AAMkAGI0ZjExAAA=').",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder containing the message. Obtain this from OUTLOOK_LIST_CHILD_MAIL_FOLDERS. Child folder IDs are base64-encoded strings (e.g., 'AAMkADAwATMwMAExAAA=').",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
        "message_id",
        "destinationId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Move message from child folder.",
    ],
  }),
  composioTool({
    name: "outlook_move_message_from_folder",
    description: "Tool to move a message from a specific mail folder to another destination folder. Use when you need to move a message and know both the source folder ID and the message ID.",
    toolSlug: "OUTLOOK_MOVE_MESSAGE_FROM_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique ID of the Outlook email message to move. Must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        destinationId: {
          type: "string",
          description: "The destination folder ID, or a well-known folder name (e.g., 'inbox', 'deleteditems', 'drafts', 'sentitems'). If using a folder ID, it must be the complete, untruncated ID string - do not use shortened or ellipsis-containing IDs.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID or well-known name of the mail folder containing the message. ONLY these specific well-known names are valid as string names: 'inbox', 'drafts', 'sentitems', 'deleteditems', 'junkemail', 'archive', 'outbox', 'clutter', 'conflicts', 'conversationhistory', 'localfailures', 'msgfolderroot', 'recoverableitemsdeletions', 'scheduled', 'searchfolders', 'serverfailures', 'syncissues'. Arbitrary folder names are NOT valid. If the folder is not one of these well-known names, you MUST use the actual folder ID - a base64-encoded string (e.g., 'AAMkAGI0ZjExAAA=') obtained from OUTLOOK_LIST_MAIL_FOLDERS or OUTLOOK_LIST_CHILD_MAIL_FOLDERS.",
        },
      },
      required: [
        "mail_folder_id",
        "message_id",
        "destinationId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Move message from folder.",
    ],
  }),
  composioTool({
    name: "outlook_permanent_delete_message",
    description: "Permanently deletes an Outlook message by moving it to the Purges folder in the dumpster. Unlike standard DELETE, this action makes the message unrecoverable by the user. IMPORTANT: This is NOT the same as DELETE - permanentDelete is irreversible and availability differs by national cloud deployments (not available in US Government L4, L5 (DOD), or China (21Vianet)).",
    toolSlug: "OUTLOOK_PERMANENT_DELETE_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address, UPN, or 'me' for the currently authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Unique identifier of the Outlook email message to permanently delete. The message will be moved to the Purges folder in the dumpster and cannot be recovered by the user.",
        },
        mail_folder_id: {
          type: "string",
          description: "Optional mail folder ID. If provided, uses the folder-scoped endpoint: /users/{userId}/mailFolders/{mailFolderId}/messages/{messageId}/permanentDelete",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently Delete Message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_pin_message",
    description: "Tool to pin a message in an Outlook chat. Use when you want to mark an important message for quick access.",
    toolSlug: "OUTLOOK_PIN_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        chat_id: {
          type: "string",
          description: "ID of the chat where the message will be pinned.",
        },
        user_id: {
          type: "string",
          description: "User ID (GUID or email) to pin message for. Required for S2S (app-only) authentication. If not provided, uses '/chats' endpoint (requires delegated authentication).",
        },
        message_url: {
          type: "string",
          description: "Fully qualified Graph URL of the chat message to pin. Format: https://graph.microsoft.com/v1.0/chats/{chat-id}/messages/{message-id}",
        },
      },
      required: [
        "chat_id",
        "message_url",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Pin message.",
    ],
  }),
  composioTool({
    name: "outlook_query_emails",
    description: "Query Outlook emails within a SINGLE folder using OData filters. Build precise server-side filters for dates, read status, importance, subjects, attachments, and conversations. Best for structured queries on message metadata within a specific folder. Returns up to 100 messages per request with pagination support. • Searches SINGLE folder only (inbox, sentitems, etc.) - NOT across all folders • For cross-folder/mailbox-wide search: Use OUTLOOK_SEARCH_MESSAGES • Server-side filters: dates, importance, isRead, hasAttachments, subjects, conversationId • CRITICAL: Always check response['@odata.nextLink'] for pagination • Limitations: Recipient/body filtering requires OUTLOOK_SEARCH_MESSAGES",
    toolSlug: "OUTLOOK_QUERY_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        top: {
          type: "integer",
          description: "Maximum number of messages to return per request (1-1000). Default is 100. IMPORTANT: For large mailboxes, always check response['@odata.nextLink'] to fetch remaining messages. Pagination example: 1) Call with top=100, 2) Check if '@odata.nextLink' exists in response, 3) If present, make a new request to that full URL (includes $skiptoken), 4) Repeat until '@odata.nextLink' is absent.",
        },
        skip: {
          type: "integer",
          description: "Number of messages to skip for pagination. NOTE: For large result sets, prefer using '@odata.nextLink' from responses instead of manual skip.",
        },
        filter: {
          type: "string",
          description: "OData $filter query string to filter email messages. Syntax: 'field operator value' combined with 'and', 'or', 'not'.\n\n        **Operators:** eq, ne, lt, le, gt, ge, startswith(), contains(), any()\n\n        **String Functions:**\n        - subject: contains(), startswith()\n        - from/sender: startswith() and eq only. contains() is NOT supported on sender/from fields\n        - endswith() is NOT reliably supported by Microsoft Graph API for message filtering\n\n        **Filterable Fields:**\n        - `isRead` - Boolean: true/false\n        - `importance` - String: 'low', 'normal', 'high'\n        - `subject` - String (exact match or startswith)\n        - `hasAttachments` - Boolean: true/false\n        - `receivedDateTime`, `sentDateTime` - DateTime (ISO 8601: 2025-10-01T00:00:00Z, NOT enclosed in quotes)\n        - `conversationId` - String (exact match)\n        - `categories` - Array (use any() operator: `categories/any(a:a eq 'CategoryName')`)\n        - `isDraft`, `flag/flagStatus` - Boolean/String flags\n        - `from/emailAddress/address`, `sender/emailAddress/address` - Sender email (ONLY 'address' is filterable, NOT 'name')\n\n        **NOT filterable:** toRecipients, ccRecipients, bccRecipients, body/content, id — use OUTLOOK_SEARCH_MESSAGES for these.\n\n        **Categories Filtering:**\n        - Single: `categories/any(a:a eq 'CategoryName')`\n        - Multiple (OR): Use SEPARATE any() calls: `categories/any(a:a eq 'Cat1') or categories/any(b:b eq 'Cat2')`\n        - For category names containing single quotes, escape them by doubling: `categories/any(a:a eq 'Owner''s Category')`\n\n        **Date Filtering:**\n        - ISO 8601 format: 2025-10-01T00:00:00Z (no quotes around datetime values)\n        - Operators: ge, gt, le, lt\n",
        },
        folder: {
          type: "string",
          description: "SINGLE mail folder to search within (cannot search across all folders). Well-known names (case-insensitive): 'inbox', 'sentitems', 'drafts', 'deleteditems', 'outbox', 'junkemail', 'archive', 'clutter', 'recoverableitemsdeletions'. For custom folders (e.g., 'Billing', 'Projects'), you MUST provide the folder ID (a long base64-like string like 'AAMkAGU0NTRiNDA4...'). Use OUTLOOK_LIST_MAIL_FOLDERS to get folder IDs for custom folders. Do NOT pass folder URLs or display names. IMPORTANT: To search across ALL folders, use OUTLOOK_SEARCH_MESSAGES instead (searches entire mailbox without folder restriction). NOTE: This parameter also accepts 'folder_id' as an alias for backwards compatibility.",
        },
        select: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message properties to include in the response (accepts comma-separated string or list). Field names are automatically normalized to correct camelCase (e.g., 'bodypreview' -> 'bodyPreview', 'hasattachments' -> 'hasAttachments'). Valid fields: id, subject, from, sender, toRecipients, ccRecipients, bccRecipients, replyTo, receivedDateTime, sentDateTime, createdDateTime, lastModifiedDateTime, hasAttachments, importance, isRead, isDraft, body, bodyPreview, uniqueBody, categories, conversationId, conversationIndex, parentFolderId, changeKey, internetMessageId, internetMessageHeaders, webLink, flag, attachments, inferenceClassification, isReadReceiptRequested, isDeliveryReceiptRequested. NOTE: 'inReplyTo' is NOT a valid property for email messages in Microsoft Graph v1.0. When not specified, returns metadata without body. Include 'body' for full content. Pass [] for all fields.",
        },
        orderby: {
          type: "string",
          description: "Sort order as comma-separated string or list (accepts 'field asc/desc' format or JSON-serialized arrays). Input is automatically normalized to correct format. Common fields: receivedDateTime, sentDateTime, subject, importance, from. NOTE: Ordering may be automatically disabled by Microsoft Graph API when using certain filters (e.g., subject exact match, conversationId) to avoid 'InefficientFilter' errors. In those cases, results will be unsorted.",
        },
        user_id: {
          type: "string",
          description: "Target user's email or 'me' for authenticated user. IMPORTANT: 'me' uses the currently connected account. For cross-mailbox access, ensure you have Mail.Read or Mail.ReadWrite permissions on the target mailbox. 403 errors indicate insufficient delegated/application permissions.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
    ],
  }),
  composioTool({
    name: "outlook_reply_email",
    description: "Sends a plain text reply to an Outlook email message, identified by `message_id`, allowing optional CC and BCC recipients.",
    toolSlug: "OUTLOOK_REPLY_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        comment: {
          type: "string",
          description: "The plain text body of the reply email.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or 'me' to indicate the authenticated user. This specifies the mailbox from which the reply will be sent.",
        },
        cc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses for CC recipients.",
        },
        bcc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses for BCC recipients.",
        },
        message_id: {
          type: "string",
          description: "The Microsoft Graph message ID (NOT an email address). This is a Base64-encoded string typically starting with 'AAMk' (e.g., 'AAMkAGI2TAAA='). Do NOT pass email addresses like 'user@example.com'. Obtain this ID from the 'id' field returned by `OUTLOOK_LIST_MESSAGES`, `OUTLOOK_GET_MESSAGE`, or `OUTLOOK_SEARCH_MESSAGES` actions.",
        },
      },
      required: [
        "message_id",
        "comment",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Reply to Email.",
    ],
  }),
  composioTool({
    name: "outlook_search_messages",
    description: "Search Outlook messages using powerful KQL syntax. Supports sender (from:), recipient (to:, cc:), subject, date filters (received:, sent:), attachments, and boolean logic. Only works with Microsoft 365/Enterprise accounts (no @hotmail.com/@outlook.com). Examples: 'from:user@example.com AND received>=2025-10-01', 'to:info@jcdn.nl AND subject:invoice', 'received>today-30 AND hasattachment:yes'",
    toolSlug: "OUTLOOK_SEARCH_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        size: {
          type: "integer",
          description: "Number of search results to return per page (1-25). Note: For message entity, max size is 25. Also, from_index + size cannot exceed 1000 (API pagination window limit).",
        },
        query: {
          type: "string",
          description: "KQL (Keyword Query Language) search query string. Supports advanced syntax for precise searches.\n\n**Basic Syntax:**\n- Simple keywords: 'budget report'\n- Exact phrases: '\"quarterly review\"'\n- Boolean operators: 'urgent AND deadline' or 'invoice OR receipt'\n\n**Property Filters (prefix:value):**\n- from: Sender email - 'from:user@example.com' or 'from:example.com'\n- to: Recipient email - 'to:info@jcdn.nl'\n- cc: CC recipient - 'cc:manager@example.com'\n- subject: Subject line - 'subject:invoice'\n- received: Date received - 'received:2025-10-01' or 'received>=2025-10-01'\n- sent: Date sent - 'sent:2025-10-01' or 'sent>=2025-10-01'\n- hasattachment: Has files - 'hasattachment:yes' or 'hasattachment:no'\n\n**REQUIRED**: At least one search criterion must be provided - either this query parameter OR one of the legacy filters (fromEmail, subject, hasAttachments). Empty searches are not supported.",
        },
        region: {
          type: "string",
          description: "Geographic region for the search query. ONLY required when using application permissions (S2S authentication). DO NOT use with delegated permissions (user authentication) - the API will reject the request. Common values: 'US', 'EU', 'GB', 'JP', 'CN', 'IN', 'CA', 'AU', 'BR', 'RU'. Leave unset (None) for delegated permissions.",
        },
        subject: {
          type: "string",
          description: "Text to search for within the message subject line. Legacy parameter - prefer using 'subject:text' in the query parameter for more control. When combined with query, this filter is joined using AND. If query contains OR operators, the query is wrapped in parentheses to preserve precedence. Example: Instead of subject='invoice', use query='subject:invoice AND received>=2025-10-01'",
        },
        fromEmail: {
          type: "string",
          description: "Filter messages by sender email address or domain. Supports exact email ('user@example.com') or domain matching ('example.com'). Legacy parameter - prefer using 'from:email@example.com' in the query parameter for more flexibility. When combined with query, this filter is joined using AND. If query contains OR operators, the query is wrapped in parentheses to preserve precedence. Note: Only Microsoft 365/Enterprise accounts are supported (no @hotmail.com or @outlook.com).",
        },
        from_index: {
          type: "integer",
          description: "The 0-based starting index for pagination (max 999). Note: from_index + size cannot exceed 1000 (API pagination window limit). To paginate: check response['value'][0]['hitsContainers'][0]['moreResultsAvailable']. If true, call again with from_index += size (e.g., 0 → 25 → 50). Message ID is in hits[]['hitId'], not hits[]['resource']['id'].",
        },
        hasAttachments: {
          type: "boolean",
          description: "Filters messages based on the presence of attachments. Legacy parameter - prefer using 'hasattachment:yes' or 'hasattachment:no' in the query parameter. When combined with query, this filter is joined using AND. If query contains OR operators, the query is wrapped in parentheses to preserve precedence.",
        },
        enable_top_results: {
          type: "boolean",
          description: "If `true`, sorts results by relevance; otherwise, sorts by date in descending order (newest first).",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "read",
      "email",
      "search",
    ],
  }),
  composioTool({
    name: "outlook_send_draft",
    description: "Tool to send an existing draft message. Use after creating a draft when you want to deliver it to recipients immediately. Example: Send a draft message with ID 'AAMkAG…'.",
    toolSlug: "OUTLOOK_SEND_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or 'me' to represent the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the draft message to send.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Send draft.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_send_email",
    description: "Sends an email with subject, body, recipients, and an optional attachment via Microsoft Graph API. Supports comma-separated email addresses in the to_email field for multiple recipients. Attachments require a non-empty file with valid name and mimetype.",
    toolSlug: "OUTLOOK_SEND_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        to: {
          type: "string",
          description: "The primary recipient's email address(es). You can provide a single email or multiple emails separated by commas. Valid email addresses will be extracted from strings containing extra text. Format: name@domain.com",
        },
        body: {
          type: "string",
          description: "The content of the email body as a plain string (plain text or HTML based on `is_html`). Do not pass structured objects; provide only the raw text/HTML content.",
        },
        is_html: {
          type: "boolean",
          description: "Specifies if the email body is HTML; `True` for HTML, `False` for plain text.",
        },
        subject: {
          type: "string",
          description: "The subject line of the email.",
        },
        to_name: {
          type: "string",
          description: "The display name of the primary recipient.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or the alias 'me' to represent the authenticated user.",
        },
        cc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses for CC recipients. Each email should be a separate string in the array. Do NOT pass comma-separated values as a single string.",
        },
        attachment: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "Optional file to attach to the email.",
        },
        bcc_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses for BCC recipients. Each email should be a separate string in the array. Do NOT pass comma-separated values as a single string.",
        },
        from_address: {
          type: "string",
          description: "Optional From address to set on the message (send as/on behalf). Provide a single email address. Requires appropriate mailbox permissions.",
        },
        save_to_sent_items: {
          type: "boolean",
          description: "Indicates if the email should be saved in 'Sent Items'.",
        },
      },
      required: [
        "subject",
        "body",
        "to",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
    ],
    askBefore: [
      "Confirm the parameters before executing Send email.",
    ],
  }),
  composioTool({
    name: "outlook_snooze_calendar_group_event_reminder",
    description: "Tool to snooze a reminder for a user's calendar event within a calendar group to a new time. Use when you need to postpone an event reminder for a specific user's calendar that belongs to a calendar group.",
    toolSlug: "OUTLOOK_SNOOZE_CALENDAR_GROUP_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event whose reminder should be snoozed.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        newReminderTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation (e.g., 2026-02-24T10:00:00).",
            },
            timeZone: {
              type: "string",
              description: "Time zone identifier (e.g., Pacific Standard Time, UTC).",
            },
          },
          description: "The new date, time, and time zone when the reminder should trigger again.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "newReminderTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Snooze user calendar group event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_snooze_event_reminder",
    description: "Tool to postpone an event reminder until a new time. Use when you need to delay a reminder for a calendar event.",
    toolSlug: "OUTLOOK_SNOOZE_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier (GUID) or user principal name (email) of the user. Required for app-only (S2S) authentication. If not provided, uses '/me' endpoint.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event whose reminder should be snoozed.",
        },
        newReminderTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in ISO 8601 format: {date}T{time}. For example: '2026-03-15T13:00:00' or '2026-03-15T13:00:00.0000000'.",
            },
            timeZone: {
              type: "string",
              description: "Represents a time zone. Use IANA format (e.g., 'America/New_York', 'Europe/London', 'UTC') or Windows format (e.g., 'Pacific Standard Time', 'Eastern Standard Time').",
            },
          },
          description: "The new date and time when the reminder should fire.",
        },
      },
      required: [
        "event_id",
        "newReminderTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Snooze event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_snooze_user_calendar_event_reminder",
    description: "Tool to snooze a reminder for a calendar event in a specific user calendar to a new time. Use when you need to postpone an event reminder for a specific calendar.",
    toolSlug: "OUTLOOK_SNOOZE_USER_CALENDAR_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event whose reminder should be snoozed.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
        newReminderTime: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation (e.g., 2026-03-25T09:00:00).",
            },
            timeZone: {
              type: "string",
              description: "Time zone identifier (e.g., Pacific Standard Time, UTC).",
            },
          },
          description: "The new date, time, and time zone when the reminder should trigger again.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "newReminderTime",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Snooze user calendar event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_snooze_user_event_reminder",
    description: "Tool to snooze a reminder for a user's calendar event to a new time. Use when you need to postpone an event reminder for a specific user.",
    toolSlug: "OUTLOOK_SNOOZE_USER_EVENT_REMINDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's primary SMTP address, user principal name (UPN), or the alias 'me' (for the signed-in user) to identify the calendar owner.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event whose reminder should be snoozed.",
        },
        new_reminder_time: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation (e.g., 2026-03-25T09:00:00).",
            },
            timeZone: {
              type: "string",
              description: "Time zone identifier (e.g., Pacific Standard Time, UTC).",
            },
          },
          description: "The new date, time, and time zone when the reminder should trigger again.",
        },
      },
      required: [
        "event_id",
        "new_reminder_time",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Snooze user event reminder.",
    ],
  }),
  composioTool({
    name: "outlook_update_calendar_event",
    description: "Updates specified fields of an existing Outlook calendar event. Implementation note: To avoid unintentionally clearing properties, the action first fetches the existing event, merges only the provided fields, and then PATCHes the merged updates. Unspecified fields remain unchanged.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body, corresponding to the specified contentType.",
            },
            contentType: {
              type: "string",
              description: "The format of the event body. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "Event body with content type ('Text' or 'HTML') and the content. If omitted, the existing body remains unchanged.",
        },
        show_as: {
          type: "string",
          description: "Availability status for the event. Valid values: 'free', 'tentative', 'busy', 'oof'. If omitted, the existing status remains unchanged.",
        },
        subject: {
          type: "string",
          description: "New subject for the event. If provided as an empty string, the subject will be cleared. If omitted, the existing subject remains unchanged.",
        },
        user_id: {
          type: "string",
          description: "The identifier of the user whose calendar event is to be updated. Accepts the user's principal name, ID, or 'me' for the currently authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to be updated. This ID can be obtained from the OUTLOOK_LIST_EVENTS action.",
        },
        location: {
          type: "string",
          description: "Event location. Can be provided as a simple string (e.g., 'Conference Room A') which will be converted to displayName, or as a dictionary with fields like displayName, address, etc. If provided, replaces the existing primary location. Omit to leave unchanged.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The attendee's type. Valid values are 'required' or 'optional'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the attendee.",
                  },
                  address: {
                    type: "string",
                    description: "The complete email address of the attendee.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
          },
          description: "Attendee list for the event. If provided, replaces the existing attendees. If omitted, attendees remain unchanged.",
        },
        time_zone: {
          type: "string",
          description: "Time zone for the provided start_datetime and/or end_datetime (IANA or Windows time zone names). If omitted, the existing event's time zone is used.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Category names to associate with the event. If provided (even empty), replaces the existing categories. If omitted, categories remain unchanged. Duplicate entries (case-insensitive) are automatically removed.",
        },
        recurrence: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence range. Possible values: endDate, noEnd, or numbered.",
                },
                endDate: {
                  type: "string",
                  description: "The date to stop applying the recurrence pattern. Required when type is endDate.",
                },
                startDate: {
                  type: "string",
                  description: "The date to start applying the recurrence pattern.",
                },
                recurrenceTimeZone: {
                  type: "string",
                  description: "Time zone for the startDate and endDate properties.",
                },
                numberOfOccurrences: {
                  type: "integer",
                  description: "The number of times to repeat the event. Required and must be positive when type is numbered.",
                },
              },
              description: "Specifies the duration of a recurring event.",
            },
            pattern: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, or relativeYearly.",
                },
                index: {
                  type: "string",
                  description: "Specifies which instance (first, second, third, fourth, or last) of allowed days the event occurs.",
                },
                month: {
                  type: "integer",
                  description: "The month in which the event occurs. This is a number from 1 to 12.",
                },
                interval: {
                  type: "integer",
                  description: "The number of units between occurrences, where units can be in days, weeks, months, or years.",
                },
                dayOfMonth: {
                  type: "integer",
                  description: "The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.",
                },
                daysOfWeek: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A collection of the days of the week on which the event occurs. Possible values: sunday through saturday.",
                },
                firstDayOfWeek: {
                  type: "string",
                  description: "The first day of the week. Defaults to Sunday.",
                },
              },
              description: "Defines the frequency of a recurring event.",
            },
          },
          description: "The recurrence pattern for an event.",
        },
        end_datetime: {
          type: "string",
          description: "New end date and time for the event. Provide together with a time zone, or the current event's time zone will be used. Must be after start_datetime if both are provided. If omitted, the end time remains unchanged.",
        },
        start_datetime: {
          type: "string",
          description: "New start date and time for the event. Provide together with a time zone, or the current event's time zone will be used. If omitted, the start time remains unchanged.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update calendar event.",
    ],
  }),
  composioTool({
    name: "outlook_update_calendar_event_in_calendar",
    description: "Tool to update an event in a specific Outlook calendar. Use when you need to modify event details like subject, time, attendees, or location in a non-default calendar.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_EVENT_IN_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body, corresponding to the specified contentType.",
            },
            contentType: {
              type: "string",
              description: "The format of the event body. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "Event body with content type ('Text' or 'HTML') and the content. If omitted, the existing body remains unchanged.",
        },
        show_as: {
          type: "string",
          description: "Availability status for the event. Valid values: 'free', 'tentative', 'busy', 'oof'. If omitted, the existing status remains unchanged.",
        },
        subject: {
          type: "string",
          description: "New subject for the event. If provided as an empty string, the subject will be cleared. If omitted, the existing subject remains unchanged.",
        },
        user_id: {
          type: "string",
          description: "The user ID or principal name (email) of the user whose calendar event to update. Required for app-only (S2S) authentication. If not provided, uses the authenticated user context (/me endpoint) for delegated authentication.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event to be updated. This ID can be obtained from the OUTLOOK_LIST_EVENTS action.",
        },
        location: {
          type: "string",
          description: "Event location. Can be provided as a simple string (e.g., 'Conference Room A') which will be converted to displayName, or as a dictionary with fields like displayName, address, etc. If provided, replaces the existing primary location. Omit to leave unchanged.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The attendee's type. Valid values are 'required' or 'optional'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the attendee.",
                  },
                  address: {
                    type: "string",
                    description: "The complete email address of the attendee.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
          },
          description: "Attendee list for the event. If provided, replaces the existing attendees. If omitted, attendees remain unchanged.",
        },
        time_zone: {
          type: "string",
          description: "Time zone for the provided start_datetime and/or end_datetime (IANA or Windows time zone names). If omitted, the existing event's time zone is used.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Category names to associate with the event. If provided (even empty), replaces the existing categories. If omitted, categories remain unchanged. Duplicate entries (case-insensitive) are automatically removed.",
        },
        importance: {
          type: "string",
          description: "The importance of the event: low, normal, or high. If omitted, the existing value remains unchanged.",
        },
        is_all_day: {
          type: "boolean",
          description: "Set to true if the event lasts all day. If omitted, the existing value remains unchanged.",
        },
        recurrence: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence range. Possible values: endDate, noEnd, or numbered.",
                },
                endDate: {
                  type: "string",
                  description: "The date to stop applying the recurrence pattern. Required when type is endDate.",
                },
                startDate: {
                  type: "string",
                  description: "The date to start applying the recurrence pattern.",
                },
                recurrenceTimeZone: {
                  type: "string",
                  description: "Time zone for the startDate and endDate properties.",
                },
                numberOfOccurrences: {
                  type: "integer",
                  description: "The number of times to repeat the event. Required and must be positive when type is numbered.",
                },
              },
              description: "Specifies the duration of a recurring event.",
            },
            pattern: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, or relativeYearly.",
                },
                index: {
                  type: "string",
                  description: "Specifies which instance (first, second, third, fourth, or last) of allowed days the event occurs.",
                },
                month: {
                  type: "integer",
                  description: "The month in which the event occurs. This is a number from 1 to 12.",
                },
                interval: {
                  type: "integer",
                  description: "The number of units between occurrences, where units can be in days, weeks, months, or years.",
                },
                dayOfMonth: {
                  type: "integer",
                  description: "The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.",
                },
                daysOfWeek: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A collection of the days of the week on which the event occurs. Possible values: sunday through saturday.",
                },
                firstDayOfWeek: {
                  type: "string",
                  description: "The first day of the week. Defaults to Sunday.",
                },
              },
              description: "Defines the frequency of a recurring event.",
            },
          },
          description: "The recurrence pattern for an event.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event. This ID can be obtained from the OUTLOOK_LIST_CALENDARS action.",
        },
        sensitivity: {
          type: "string",
          description: "Sensitivity level: normal, personal, private, confidential. If omitted, the existing value remains unchanged.",
        },
        end_datetime: {
          type: "string",
          description: "New end date and time for the event. Provide together with a time zone, or the current event's time zone will be used. Must be after start_datetime if both are provided. If omitted, the end time remains unchanged.",
        },
        is_reminder_on: {
          type: "boolean",
          description: "Set to true if an alert is set to remind the user of the event. If omitted, the existing value remains unchanged.",
        },
        start_datetime: {
          type: "string",
          description: "New start date and time for the event. Provide together with a time zone, or the current event's time zone will be used. If omitted, the start time remains unchanged.",
        },
        is_online_meeting: {
          type: "boolean",
          description: "True if this event has online meeting information. If omitted, the existing value remains unchanged.",
        },
        reminder_minutes_before_start: {
          type: "integer",
          description: "The number of minutes before the event start time that the reminder alert occurs. If omitted, the existing value remains unchanged.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update event in specific calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_calendar_group",
    description: "Tool to update the properties of a calendar group object. Use when you need to rename a calendar group.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the calendar group.",
        },
        user_id: {
          type: "string",
          description: "The user's principal name (UPN) or object ID. Use 'me' for the authenticated user.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group to update. This ID can be obtained from the list calendar groups action.",
        },
      },
      required: [
        "calendar_group_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update calendar group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_calendar_group_calendar_permission",
    description: "Tool to update a calendar permission within a calendar group. Use when changing access levels for calendars in specific groups.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_GROUP_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission level to change to for the calendar share recipient. Options: freeBusyRead (view availability only), limitedRead (view availability and titles), read (view all event details), write (view and edit events).",
          enum: [
            "freeBusyRead",
            "limitedRead",
            "read",
            "write",
          ],
        },
        user_id: {
          type: "string",
          description: "The unique identifier or email address of the user. Required for S2S (app-only) authentication. If not provided, defaults to 'me' for delegated authentication.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the group.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to update.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "permission_id",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Calendar Group Calendar Permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_calendar_groups_calendars",
    description: "Tool to update a calendar within a calendar group in a user's mailbox. Use when modifying calendar properties like name, color, or default calendar status.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_GROUPS_CALENDARS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new display name for the calendar.",
        },
        color: {
          type: "string",
          description: "The color theme to assign to the calendar. Supported values: auto, lightBlue, lightGreen, lightOrange, lightGray, lightYellow, lightTeal, lightPink, lightBrown, lightPurple, lightRed.",
          enum: [
            "auto",
            "lightBlue",
            "lightGreen",
            "lightOrange",
            "lightGray",
            "lightYellow",
            "lightTeal",
            "lightPink",
            "lightBrown",
            "lightPurple",
            "lightRed",
          ],
        },
        user_id: {
          type: "string",
          description: "The user's identifier. Use 'me' for the signed-in user, or specify a user principal name (email) or user ID.",
        },
        hexColor: {
          type: "string",
          description: "An optional hexadecimal color code for the calendar in the format '#RRGGBB'.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to update.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar to update.",
        },
        isDefaultCalendar: {
          type: "boolean",
          description: "Whether this calendar should be set as the user's default calendar.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar in calendar group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_calendar_groups_calendars_events",
    description: "Tool to update an event in a calendar within a calendar group for a specific user. Use when modifying event details for a user's calendar.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_GROUPS_CALENDARS_EVENTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation ({date}T{time}). For example, 2025-02-01T10:00:00.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the datetime. Uses Windows time zone names (e.g., 'Pacific Standard Time') or IANA time zone names (e.g., 'America/Los_Angeles'). UTC is also valid.",
            },
          },
          description: "Represents a date, time, and time zone.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual content of the event body.",
            },
            contentType: {
              type: "string",
              description: "The format of the body content. Must be 'Text' for plain text or 'HTML' for HTML content.",
            },
          },
          description: "The body content of the event.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation ({date}T{time}). For example, 2025-02-01T10:00:00.",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the datetime. Uses Windows time zone names (e.g., 'Pacific Standard Time') or IANA time zone names (e.g., 'America/Los_Angeles'). UTC is also valid.",
            },
          },
          description: "Represents a date, time, and time zone.",
        },
        showAs: {
          type: "string",
          description: "The status to show on the calendar. Valid values: 'free', 'tentative', 'busy', 'oof', 'workingElsewhere', 'unknown'. If omitted, the existing status remains unchanged.",
        },
        subject: {
          type: "string",
          description: "The new subject/title of the event. If omitted, the existing subject remains unchanged.",
        },
        user_id: {
          type: "string",
          description: "The ID or principal name of the user whose calendar event to update. Use 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to update.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            displayName: {
              type: "string",
              description: "The name or description of the location.",
            },
          },
          description: "The location of an event.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The attendee type. Valid values: 'required', 'optional', 'resource'.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address.",
                  },
                },
                description: "The email address and optional name of the attendee.",
              },
            },
            description: "Information about an event attendee.",
          },
          description: "The new list of attendees for the event. If provided, replaces the existing attendees. If omitted, attendees remain unchanged.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of category names to associate with the event. If provided, replaces the existing categories. If omitted, categories remain unchanged. Duplicate entries (case-insensitive) are automatically removed.",
        },
        importance: {
          type: "string",
          description: "The importance of the event. Valid values: 'low', 'normal', 'high'. If omitted, the existing importance remains unchanged.",
        },
        calendar_id: {
          type: "string",
          description: "The ID of the calendar within the calendar group containing the event.",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "Set to true to indicate that the event is an online meeting. If omitted, the existing setting remains unchanged.",
        },
        calendar_group_id: {
          type: "string",
          description: "The ID of the calendar group containing the target calendar.",
        },
        onlineMeetingProvider: {
          type: "string",
          description: "The online meeting provider. Currently only 'teamsForBusiness' is supported. If omitted, the existing provider remains unchanged.",
        },
      },
      required: [
        "user_id",
        "calendar_group_id",
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar group event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_calendar_permission",
    description: "Tool to update calendar permission levels for share recipients or delegates. Use when you need to change the access level (role) for someone who has been granted access to a calendar.",
    toolSlug: "OUTLOOK_UPDATE_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission level to change to for the calendar share recipient or delegate. Possible values: freeBusyRead (view free/busy status only), limitedRead (view free/busy status, titles and locations), read (view all details except private events), write (view all details except private events and edit events).",
          enum: [
            "freeBusyRead",
            "limitedRead",
            "read",
            "write",
          ],
        },
        user_id: {
          type: "string",
          description: "User ID, userPrincipalName, or 'me' for the authenticated user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to update. This ID can be obtained from listing calendar permissions.",
        },
      },
      required: [
        "calendar_id",
        "permission_id",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update calendar permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_child_folder_contact",
    description: "Tool to update a contact in a child contact folder within a parent contact folder. Use when you need to modify contact properties such as name, email, phone numbers, or company details for contacts in nested folder structures.",
    toolSlug: "OUTLOOK_UPDATE_CHILD_FOLDER_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        title: {
          type: "string",
          description: "The contact's title (e.g., Mr., Ms., Dr.).",
        },
        manager: {
          type: "string",
          description: "The name of the contact's manager.",
        },
        surname: {
          type: "string",
          description: "The contact's surname (last name).",
        },
        user_id: {
          type: "string",
          description: "User's identifier; 'me' for the signed-in user, or user's principal name/ID.",
        },
        birthday: {
          type: "string",
          description: "The contact's birthday in ISO 8601 format (YYYY-MM-DD).",
        },
        children: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The names of the contact's children.",
        },
        jobTitle: {
          type: "string",
          description: "The contact's job title.",
        },
        nickName: {
          type: "string",
          description: "The contact's nickname.",
        },
        givenName: {
          type: "string",
          description: "The contact's given (first) name.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories for organizing the contact.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to update.",
        },
        department: {
          type: "string",
          description: "The contact's department.",
        },
        homePhones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The contact's home phone numbers.",
        },
        middleName: {
          type: "string",
          description: "The contact's middle name.",
        },
        profession: {
          type: "string",
          description: "The contact's profession.",
        },
        spouseName: {
          type: "string",
          description: "The name of the contact's spouse/partner.",
        },
        companyName: {
          type: "string",
          description: "The name of the contact's company.",
        },
        displayName: {
          type: "string",
          description: "The contact's full display name.",
        },
        homeAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state or province.",
            },
            street: {
              type: "string",
              description: "The street address.",
            },
            postalCode: {
              type: "string",
              description: "The postal or ZIP code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region name.",
            },
          },
          description: "Physical address information.",
        },
        mobilePhone: {
          type: "string",
          description: "The contact's mobile phone number.",
        },
        yomiSurname: {
          type: "string",
          description: "The phonetic Japanese surname (last name) of the contact.",
        },
        otherAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state or province.",
            },
            street: {
              type: "string",
              description: "The street address.",
            },
            postalCode: {
              type: "string",
              description: "The postal or ZIP code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region name.",
            },
          },
          description: "Physical address information.",
        },
        assistantName: {
          type: "string",
          description: "The name of the contact's assistant.",
        },
        personalNotes: {
          type: "string",
          description: "Personal notes about the contact.",
        },
        yomiGivenName: {
          type: "string",
          description: "The phonetic Japanese given name (first name) of the contact.",
        },
        businessPhones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The contact's business phone numbers.",
        },
        emailAddresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name associated with the email address.",
              },
              address: {
                type: "string",
                description: "The email address of the contact.",
              },
            },
            description: "Email address information for a contact.",
          },
          description: "The contact's email addresses.",
        },
        officeLocation: {
          type: "string",
          description: "The location of the contact's office.",
        },
        businessAddress: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state or province.",
            },
            street: {
              type: "string",
              description: "The street address.",
            },
            postalCode: {
              type: "string",
              description: "The postal or ZIP code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region name.",
            },
          },
          description: "Physical address information.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder containing the contact.",
        },
        yomiCompanyName: {
          type: "string",
          description: "The phonetic Japanese company name of the contact.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the parent contact folder.",
        },
      },
      required: [
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update child folder contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_contact",
    description: "Updates an existing Outlook contact, identified by `contact_id` for the specified `user_id`, requiring at least one other field to be modified.",
    toolSlug: "OUTLOOK_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        notes: {
          type: "string",
          description: "Personal notes about the contact (maps to 'personalNotes' in Microsoft Graph API).",
        },
        surname: {
          type: "string",
          description: "Contact's surname (last name).",
        },
        user_id: {
          type: "string",
          description: "User's identifier; 'me' for the signed-in user, or user's principal name/ID.",
        },
        birthday: {
          type: "string",
          description: "Contact's birthday (YYYY-MM-DD format).",
        },
        job_title: {
          type: "string",
          description: "Contact’s job title.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories for organizing the contact.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact to update.",
        },
        department: {
          type: "string",
          description: "Contact's department.",
        },
        given_name: {
          type: "string",
          description: "Contact’s given (first) name.",
        },
        home_phones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact’s home phone numbers.",
        },
        company_name: {
          type: "string",
          description: "Contact’s company name.",
        },
        display_name: {
          type: "string",
          description: "Contact’s full display name.",
        },
        mobile_phone: {
          type: "string",
          description: "Contact’s mobile phone number.",
        },
        business_phones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact’s business phone numbers.",
        },
        email_addresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name of the person or entity.",
              },
              address: {
                type: "string",
                description: "The email address of the person or entity.",
              },
            },
          },
          description: "Contact’s email addresses. Each entry requires `address` (string) and optionally `name` (string). Replaces all existing email addresses on save; include all intended addresses, not just new ones.",
        },
        office_location: {
          type: "string",
          description: "Contact's office location.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Contact.",
    ],
  }),
  composioTool({
    name: "outlook_update_contact_folder",
    description: "Tool to update the properties of a contact folder for a specific user. Use when you need to rename or move an existing contact folder.",
    toolSlug: "OUTLOOK_UPDATE_CONTACT_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User principal name or ID. Use 'me' for the authenticated user.",
        },
        displayName: {
          type: "string",
          description: "The updated display name for the contact folder.",
        },
        parentFolderId: {
          type: "string",
          description: "The ID of the folder's parent folder to move this contact folder under.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder to update.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user contact folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_contact_folder_child_folder",
    description: "Tool to update a child folder within a contact folder for a specific user. Use when you need to rename a child contact folder or move it to a different parent folder.",
    toolSlug: "OUTLOOK_UPDATE_CONTACT_FOLDER_CHILD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can use 'me' as a shortcut for the authenticated user, or provide user ID or userPrincipalName.",
        },
        display_name: {
          type: "string",
          description: "The updated display name for the child folder.",
        },
        child_folder_id: {
          type: "string",
          description: "The ID of the child folder to update.",
        },
        parent_folder_id: {
          type: "string",
          description: "The ID of the new parent folder to move this child folder under.",
        },
        contact_folder_id: {
          type: "string",
          description: "The ID of the parent contact folder that contains the child folder to update.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user contact folder child folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_contact_folders_contacts",
    description: "Tool to update a contact within a specific contact folder. Use when you need to modify contact details for a contact stored in a particular folder.",
    toolSlug: "OUTLOOK_UPDATE_CONTACT_FOLDERS_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        surname: {
          type: "string",
          description: "Contact's surname (last name).",
        },
        user_id: {
          type: "string",
          description: "User's identifier; 'me' for the signed-in user, or user's principal name/ID.",
        },
        birthday: {
          type: "string",
          description: "Contact's birthday (YYYY-MM-DD format).",
        },
        job_title: {
          type: "string",
          description: "Contact's job title.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories for organizing the contact.",
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact to update.",
        },
        department: {
          type: "string",
          description: "Contact's department.",
        },
        given_name: {
          type: "string",
          description: "Contact's given (first) name.",
        },
        home_phones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact's home phone numbers.",
        },
        company_name: {
          type: "string",
          description: "Contact's company name.",
        },
        display_name: {
          type: "string",
          description: "Contact's full display name.",
        },
        home_address: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state.",
            },
            street: {
              type: "string",
              description: "The street.",
            },
            postalCode: {
              type: "string",
              description: "The postal code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region. It's a free-format string value, for example, 'United States'.",
            },
          },
          description: "Contact's home address.",
        },
        mobile_phone: {
          type: "string",
          description: "Contact's mobile phone number.",
        },
        other_address: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state.",
            },
            street: {
              type: "string",
              description: "The street.",
            },
            postalCode: {
              type: "string",
              description: "The postal code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region. It's a free-format string value, for example, 'United States'.",
            },
          },
          description: "Other addresses for the contact.",
        },
        personal_notes: {
          type: "string",
          description: "Personal notes about the contact.",
        },
        business_phones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact's business phone numbers.",
        },
        email_addresses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The display name of the person or entity.",
              },
              address: {
                type: "string",
                description: "The email address of the person or entity.",
              },
            },
          },
          description: "Contact's email addresses.",
        },
        office_location: {
          type: "string",
          description: "Contact's office location.",
        },
        business_address: {
          type: "object",
          additionalProperties: true,
          properties: {
            city: {
              type: "string",
              description: "The city.",
            },
            state: {
              type: "string",
              description: "The state.",
            },
            street: {
              type: "string",
              description: "The street.",
            },
            postalCode: {
              type: "string",
              description: "The postal code.",
            },
            countryOrRegion: {
              type: "string",
              description: "The country or region. It's a free-format string value, for example, 'United States'.",
            },
          },
          description: "Contact's business address.",
        },
        contact_folder_id: {
          type: "string",
          description: "Unique identifier of the contact folder containing the contact.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact in folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_email",
    description: "Updates specified properties of an existing email message; `message_id` must identify a valid message within the specified `user_id`'s mailbox.",
    toolSlug: "OUTLOOK_UPDATE_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        From: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
                },
                address: {
                  type: "string",
                  description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
                },
              },
              description: "Email address details for the recipient.",
            },
          },
          description: "Recipient with email address for input requests.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The actual email body content, formatted according to the `contentType`. For example, if contentType is 'HTML', this would be HTML markup.",
            },
            contentType: {
              type: "string",
              description: "Specifies the format of the email body content. Must be either 'Text' (for plain text) or 'HTML' (for HTML markup).",
            },
          },
          description: "New body content (Text or HTML). If omitted, the existing message body remains unchanged. Must be a dict with both `contentType` ('Text' or 'HTML') and `content` keys set together; omitting `contentType` defaults to plain text and will not render HTML markup.",
        },
        flag: {
          type: "object",
          additionalProperties: true,
          properties: {
            flagStatus: {
              type: "string",
              description: "Flag status for the message. Possible values: 'notFlagged', 'flagged', 'complete'. When 'notFlagged', any date/time fields (startDateTime, dueDateTime, completedDateTime) are ignored.",
            },
            dueDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation ({date}T{time}; for example, 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Represents a time zone, for example, 'Pacific Standard Time' or 'UTC'.",
                },
              },
              description: "Represents a date and time with timezone information for input.",
            },
            startDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation ({date}T{time}; for example, 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Represents a time zone, for example, 'Pacific Standard Time' or 'UTC'.",
                },
              },
              description: "Represents a date and time with timezone information for input.",
            },
            completedDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation ({date}T{time}; for example, 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Represents a time zone, for example, 'Pacific Standard Time' or 'UTC'.",
                },
              },
              description: "Represents a date and time with timezone information for input.",
            },
          },
          description: "Represents the flag value for a message (input).",
        },
        sender: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
                },
                address: {
                  type: "string",
                  description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
                },
              },
              description: "Email address details for the recipient.",
            },
          },
          description: "Recipient with email address for input requests.",
        },
        is_read: {
          type: "boolean",
          description: "Mark message as read (True) or unread (False). If omitted, read status remains unchanged.",
        },
        subject: {
          type: "string",
          description: "New subject line. If omitted, the existing subject remains unchanged. Provide empty string to clear the subject.",
        },
        user_id: {
          type: "string",
          description: "The UPN (User Principal Name) of the user whose mailbox contains the message, or 'me' for the currently authenticated user. This determines whose message is updated.",
        },
        reply_to: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
                  },
                  address: {
                    type: "string",
                    description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
                  },
                },
                description: "Email address details for the recipient.",
              },
            },
            description: "Recipient with email address for input requests.",
          },
          description: "Email addresses to use when replying. Updatable only if isDraft = true.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories associated with the message. Provides a list of category labels (e.g., 'Follow Up', 'Customer').",
        },
        importance: {
          type: "string",
          description: "New importance level ('low', 'normal', 'high'). If omitted, the existing importance level remains unchanged.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the email message to be updated. This ID is typically obtained from listing messages or creating/sending a message. URL-encoded IDs are automatically decoded before use.",
        },
        cc_recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
              },
              address: {
                type: "string",
                description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
              },
            },
          },
          description: "List of CC recipients; replaces all existing CCs. Omitting this field preserves existing CC recipients. Provide an empty list to clear all CC recipients.",
        },
        to_recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
              },
              address: {
                type: "string",
                description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
              },
            },
          },
          description: "List of TO recipients; replaces all existing TOs. Omitting this field preserves existing TO recipients. Provide an empty list to clear all TO recipients.",
        },
        bcc_recipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Optional display name for the recipient (e.g., 'Katherine Hughes').",
              },
              address: {
                type: "string",
                description: "The SMTP email address of the recipient. For example, 'kat.hughes@example.com'.",
              },
            },
          },
          description: "List of BCC recipients; replaces all existing BCCs. Omitting this field preserves existing BCC recipients. Provide an empty list to clear all BCC recipients.",
        },
        internet_message_id: {
          type: "string",
          description: "The message ID in the format specified by RFC2822. Updatable only if isDraft = true.",
        },
        inference_classification: {
          type: "string",
          description: "Classification of the message for the user based on inferred relevance or importance. Possible values: 'focused' or 'other'.",
        },
        is_read_receipt_requested: {
          type: "boolean",
          description: "Indicates whether a read receipt is requested for the message.",
        },
        is_delivery_receipt_requested: {
          type: "boolean",
          description: "Indicates whether a delivery receipt is requested for the message.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update email message.",
    ],
  }),
  composioTool({
    name: "outlook_update_email_rule",
    description: "Update an existing email rule",
    toolSlug: "OUTLOOK_UPDATE_EMAIL_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ruleId: {
          type: "string",
          description: "ID of the email rule to update.",
        },
        actions: {
          type: "object",
          additionalProperties: true,
          properties: {
            delete: {
              type: "boolean",
              description: "Whether to delete matching messages.",
            },
            forwardTo: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of email addresses to forward matching messages to.",
            },
            markAsRead: {
              type: "boolean",
              description: "Whether to mark matching messages as read.",
            },
            copyToFolder: {
              type: "string",
              description: "Folder ID to copy matching messages to.",
            },
            moveToFolder: {
              type: "string",
              description: "Folder ID to move matching messages to.",
            },
            assignCategories: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of categories to assign to matching messages.",
            },
            stopProcessingRules: {
              type: "boolean",
              description: "If true, stops processing other rules after this rule's actions execute. Useful for priority rules where you want to prevent lower-priority rules from running. Example: High-priority sender rule that moves to VIP folder and stops other filing rules.",
            },
          },
          description: "Updated actions to take when the rule conditions are met.",
        },
        user_id: {
          type: "string",
          description: "User ID or principal name for app-only (S2S) authentication. Required for application permissions. Use the user's GUID or email address (e.g., '43f0c14d-bca8-421f-b762-c3d8dd75be1f' or 'user@domain.com').",
        },
        sequence: {
          type: "integer",
          description: "Updated order in which the rule is executed (lower numbers execute first). Changing this value shifts the relative order of all other rules; review existing rule sequences before updating.",
        },
        isEnabled: {
          type: "boolean",
          description: "Whether the rule should be enabled or disabled.",
        },
        conditions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Updated conditions that must be met for the rule to apply.",
        },
        displayName: {
          type: "string",
          description: "Updated display name for the email rule.",
        },
      },
      required: [
        "ruleId",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "email",
      "automation",
      "rules",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Email Rule.",
    ],
  }),
  composioTool({
    name: "outlook_update_event_extension",
    description: "Tool to update an open extension on a calendar event in Microsoft Graph. Use when you need to modify custom properties stored in an event extension.",
    toolSlug: "OUTLOOK_UPDATE_EVENT_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user identifier for the calendar owner. Must be either 'me' (for the authenticated user), a Microsoft 365 User Principal Name (e.g., user@contoso.com), or an Azure AD object ID (GUID).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension to update.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar containing the event.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update event extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_event_extension_in_calendar_group",
    description: "Tool to update an open extension on a calendar event within a calendar group. Use when modifying custom properties stored in an event extension for events in calendar groups.",
    toolSlug: "OUTLOOK_UPDATE_EVENT_EXTENSION_IN_CALENDAR_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier (GUID) or email address of the user whose calendar event extension to update. Required for app-only (S2S) authentication. If not provided, uses the authenticated user context (/me endpoint).",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension to update.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar within the calendar group.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        calendar_group_id: {
          type: "string",
          description: "The unique identifier of the calendar group containing the calendar.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "calendar_group_id",
        "calendar_id",
        "event_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update event extension in calendar group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_inference_classification",
    description: "Tool to update the inferenceClassification resource for a user. Use when needing to refresh or sync the Focused Inbox classification settings. Note: The inferenceClassification resource has no writable properties; actual message classification rules are managed through the overrides collection.",
    toolSlug: "OUTLOOK_UPDATE_INFERENCE_CLASSIFICATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's identifier. Use 'me' for the signed-in user, or provide the user's ID or principal name.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "inference_classification",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Inference Classification.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_mail_folder",
    description: "Tool to update the display name of a mail folder. Use when you need to rename an existing mail folder.",
    toolSlug: "OUTLOOK_UPDATE_MAIL_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Identifier for the user whose mailbox contains the folder. Use 'me' for the authenticated user or provide the user's principal name or ID.",
        },
        display_name: {
          type: "string",
          description: "The new display name for the mail folder.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder to update. This ID can be obtained from listing mail folders or creating a mail folder.",
        },
      },
      required: [
        "mail_folder_id",
        "display_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update mail folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_mailbox_settings",
    description: "Tool to update mailbox settings for the signed-in user. Use when you need to configure automatic replies, default time zone, language, or working hours. Example: schedule automatic replies for vacation.",
    toolSlug: "OUTLOOK_UPDATE_MAILBOX_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        language: {
          type: "object",
          additionalProperties: true,
          properties: {
            locale: {
              type: "string",
              description: "A locale representation for the user, which includes the user's preferred language and country/region. For example, 'en-us'. Language follows ISO 639-1 codes; country follows ISO 3166-1 alpha-2 codes.",
            },
            displayName: {
              type: "string",
              description: "A name representing the user's locale in natural language, for example, 'English (United States)'.",
            },
          },
          description: "Locale preferences for date/time formatting.",
        },
        timeZone: {
          type: "string",
          description: "Default mailbox time zone (e.g., 'Pacific Standard Time').",
        },
        workingHours: {
          type: "object",
          additionalProperties: true,
          properties: {
            endTime: {
              type: "string",
              description: "The time of the day that the user stops working.",
            },
            timeZone: {
              type: "object",
              additionalProperties: true,
              properties: {
                bias: {
                  type: "integer",
                  description: "UTC offset in minutes for custom time zone.",
                },
                name: {
                  type: "string",
                  description: "The name of a time zone. It can be a standard time zone name such as 'Hawaii-Aleutian Standard Time', or 'Customized Time Zone' for a custom time zone.",
                },
                daylightOffset: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    time: {
                      type: "string",
                      description: "Time of day when the offset starts in HH:mm:ss.",
                    },
                    year: {
                      type: "integer",
                      description: "Year for the offset rule.",
                    },
                    month: {
                      type: "integer",
                      description: "Month for the offset rule (1-12).",
                    },
                    dayOfWeek: {
                      type: "string",
                      description: "Day of the week for the offset rule.",
                      enum: [
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                      ],
                    },
                    dayOccurrence: {
                      type: "integer",
                      description: "Occurrence of the day of week within the month (1-5).",
                    },
                  },
                  description: "Daylight saving time offset rule for custom time zone.",
                },
                standardOffset: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    time: {
                      type: "string",
                      description: "Time of day when the offset starts in HH:mm:ss.",
                    },
                    year: {
                      type: "integer",
                      description: "Year for the offset rule.",
                    },
                    month: {
                      type: "integer",
                      description: "Month for the offset rule (1-12).",
                    },
                    dayOfWeek: {
                      type: "string",
                      description: "Day of the week for the offset rule.",
                      enum: [
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                      ],
                    },
                    dayOccurrence: {
                      type: "integer",
                      description: "Occurrence of the day of week within the month (1-5).",
                    },
                  },
                  description: "Standard time offset rule for custom time zone.",
                },
              },
              description: "The time zone to which the working hours apply.",
            },
            startTime: {
              type: "string",
              description: "The time of the day that the user starts working.",
            },
            daysOfWeek: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The days of the week on which the user works.",
            },
          },
          description: "Working hours configuration for the user.",
        },
        automaticRepliesSetting: {
          type: "object",
          additionalProperties: true,
          properties: {
            status: {
              type: "string",
              description: "Configurations status for automatic replies. Possible values: disabled, alwaysEnabled, scheduled.",
              enum: [
                "disabled",
                "alwaysEnabled",
                "scheduled",
              ],
            },
            externalAudience: {
              type: "string",
              description: "The set of audience external to the signed-in user's organization who will receive the ExternalReplyMessage. Possible values: none, contactsOnly, all.",
              enum: [
                "none",
                "contactsOnly",
                "all",
              ],
            },
            externalReplyMessage: {
              type: "string",
              description: "The automatic reply to send to the specified external audience, if Status is AlwaysEnabled or Scheduled.",
            },
            internalReplyMessage: {
              type: "string",
              description: "The automatic reply to send to the audience internal to the signed-in user's organization.",
            },
            scheduledEndDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation ({date}T{time}; for example, 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Represents a time zone, for example, 'Pacific Standard Time'.",
                },
              },
              description: "The date and time that automatic replies are set to end, if Status is set to Scheduled.",
            },
            scheduledStartDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in a combined date and time representation ({date}T{time}; for example, 2017-08-29T04:00:00.0000000).",
                },
                timeZone: {
                  type: "string",
                  description: "Represents a time zone, for example, 'Pacific Standard Time'.",
                },
              },
              description: "The date and time that automatic replies are set to begin, if Status is set to Scheduled.",
            },
          },
          description: "Configuration for automatic replies.",
        },
      },
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "user_profile_and_settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Update mailbox settings.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_master_category",
    description: "Tool to update the color of a category in the user's master category list. Use when you need to change the color of an existing category. Note that the display name cannot be modified after creation.",
    toolSlug: "OUTLOOK_UPDATE_MASTER_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        color: {
          type: "string",
          description: "A pre-set color constant for the category. This is the only writable property - displayName cannot be modified after creation. Allowed values: none, preset0 through preset24.",
          enum: [
            "none",
            "preset0",
            "preset1",
            "preset2",
            "preset3",
            "preset4",
            "preset5",
            "preset6",
            "preset7",
            "preset8",
            "preset9",
            "preset10",
            "preset11",
            "preset12",
            "preset13",
            "preset14",
            "preset15",
            "preset16",
            "preset17",
            "preset18",
            "preset19",
            "preset20",
            "preset21",
            "preset22",
            "preset23",
            "preset24",
          ],
        },
        user_id: {
          type: "string",
          description: "The user's unique identifier or principal name. Use 'me' for the signed-in user.",
        },
        category_id: {
          type: "string",
          description: "The unique identifier of the outlookCategory to update.",
        },
      },
      required: [
        "category_id",
        "color",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "categories_and_master_categories",
    ],
    askBefore: [
      "Confirm the parameters before executing Update master category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_me_contacts_extensions",
    description: "Tool to update an open extension on a contact in a contact folder. Use when you need to modify custom properties stored in a contact extension.",
    toolSlug: "OUTLOOK_UPDATE_ME_CONTACTS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's identifier; 'me' for the signed-in user, or user's principal name/ID.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to which the extension belongs.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.ContactData) or just the extension name (e.g., Com.Contoso.ContactData).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update or add to the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "contact_folder_id",
        "contact_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_calendar",
    description: "Tool to update the properties of a user's calendar. Use when you need to rename a calendar or change its color theme for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new display name for the calendar. Note: The default calendar cannot be renamed in some configurations.",
        },
        color: {
          type: "string",
          description: "Color theme options for calendars in Outlook.",
          enum: [
            "auto",
            "lightBlue",
            "lightGreen",
            "lightOrange",
            "lightGray",
            "lightYellow",
            "lightTeal",
            "lightPink",
            "lightBrown",
            "lightRed",
            "maxColor",
          ],
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the user whose calendar to update. Use 'me' for the authenticated user.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_calendar_event",
    description: "Tool to update an event in a specific user's calendar. Use when you need to modify calendar event properties for a user other than the signed-in user.",
    toolSlug: "OUTLOOK_UPDATE_USER_CALENDAR_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation. Example: 2017-08-29T04:00:00.0000000",
            },
            timeZone: {
              type: "string",
              description: "Time zone name such as Pacific Standard Time or America/New_York.",
            },
          },
          description: "Date, time, and timezone information.",
        },
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The content of the item.",
            },
            contentType: {
              type: "string",
              description: "The type of the content. Possible values are text and html.",
            },
          },
          description: "Message content associated with the event.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            dateTime: {
              type: "string",
              description: "A single point of time in a combined date and time representation. Example: 2017-08-29T04:00:00.0000000",
            },
            timeZone: {
              type: "string",
              description: "Time zone name such as Pacific Standard Time or America/New_York.",
            },
          },
          description: "Date, time, and timezone information.",
        },
        showAs: {
          type: "string",
          description: "Status to show: free, tentative, busy, oof, workingElsewhere, unknown.",
        },
        subject: {
          type: "string",
          description: "Subject/title of the event.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier or userPrincipalName of the user whose calendar event to update.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the event to update.",
        },
        isAllDay: {
          type: "boolean",
          description: "Set to true if the event lasts all day.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            displayName: {
              type: "string",
              description: "The name associated with the location.",
            },
          },
          description: "Location information for an event.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "The attendee type: required, optional, resource.",
              },
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address information.",
              },
            },
            description: "Attendee information for an event.",
          },
          description: "Array of attendee objects with email addresses and types.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Categories associated with the event.",
        },
        importance: {
          type: "string",
          description: "The importance of the event: low, normal, or high.",
        },
        recurrence: {
          type: "object",
          additionalProperties: true,
          properties: {
            range: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence range type. Possible values: endDate, noEnd, numbered.",
                },
                endDate: {
                  type: "string",
                  description: "The date to stop applying the recurrence pattern. Required when type is endDate.",
                },
                startDate: {
                  type: "string",
                  description: "The date to start applying the recurrence pattern.",
                },
                recurrenceTimeZone: {
                  type: "string",
                  description: "Time zone for the startDate and endDate properties.",
                },
                numberOfOccurrences: {
                  type: "integer",
                  description: "The number of times to repeat the event. Required and must be positive if type is numbered.",
                },
              },
              description: "The duration of an event.",
            },
            pattern: {
              type: "object",
              additionalProperties: true,
              properties: {
                type: {
                  type: "string",
                  description: "The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, relativeYearly.",
                },
                index: {
                  type: "string",
                  description: "Specifies which instance of allowed days the event occurs on. Possible values: first, second, third, fourth, last.",
                },
                month: {
                  type: "integer",
                  description: "The month in which the event occurs. This is a number from 1 to 12.",
                },
                interval: {
                  type: "integer",
                  description: "The number of units between occurrences, where units can be in days, weeks, months, or years.",
                },
                dayOfMonth: {
                  type: "integer",
                  description: "The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.",
                },
                daysOfWeek: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A collection of the days of the week on which the event occurs.",
                },
                firstDayOfWeek: {
                  type: "string",
                  description: "The first day of the week. Defaults to Sunday.",
                },
              },
              description: "The frequency of an event.",
            },
          },
          description: "Recurrence pattern for recurring events.",
        },
        sensitivity: {
          type: "string",
          description: "Sensitivity level: normal, personal, private, confidential.",
        },
        isReminderOn: {
          type: "boolean",
          description: "Set to true if an alert reminds the user of the event.",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "True if event has online meeting information.",
        },
        reminderMinutesBeforeStart: {
          type: "integer",
          description: "Minutes before event start when reminder alert occurs.",
        },
      },
      required: [
        "user_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_calendar_permission",
    description: "Tool to update calendar permission levels for a specific user's calendar. Use when you need to change the access level (role) for someone who has been granted access to a user's calendar.",
    toolSlug: "OUTLOOK_UPDATE_USER_CALENDAR_PERMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The permission level to change to for the calendar share recipient or delegate. Possible values: none (remove access), freeBusyRead (view free/busy status only), limitedRead (view free/busy status, titles and locations), read (view all details except private events), write (view all details except private events and edit events).",
          enum: [
            "none",
            "freeBusyRead",
            "limitedRead",
            "read",
            "write",
          ],
        },
        user_id: {
          type: "string",
          description: "The user ID or principal name of the user whose calendar permission to update. Use 'me' for the authenticated user or provide a specific user ID/UPN.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar. If not provided, defaults to the user's primary calendar.",
        },
        permission_id: {
          type: "string",
          description: "The unique identifier of the calendar permission to update. This ID can be obtained from listing calendar permissions.",
        },
      },
      required: [
        "user_id",
        "permission_id",
        "role",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar permission.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_calendars",
    description: "Tool to update properties of a specific calendar by ID for a specific user. Use when you need to rename a user's calendar, change its color theme, or set it as the default calendar.",
    toolSlug: "OUTLOOK_UPDATE_USER_CALENDARS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new display name for the calendar. Provide this to rename the calendar.",
        },
        color: {
          type: "string",
          description: "Color theme options for calendars in Outlook.",
          enum: [
            "auto",
            "lightBlue",
            "lightGreen",
            "lightOrange",
            "lightGray",
            "lightYellow",
            "lightTeal",
            "lightPink",
            "lightBrown",
            "lightRed",
            "maxColor",
          ],
        },
        user_id: {
          type: "string",
          description: "The user ID or userPrincipalName of the user whose calendar to update. Use 'me' for the authenticated user.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the calendar to update. This is the calendar ID returned when listing calendars.",
        },
        isDefaultCalendar: {
          type: "boolean",
          description: "Set to true to make this calendar the user's default calendar, false otherwise. The default calendar is where new events are created by default.",
        },
      },
      required: [
        "user_id",
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user calendar by ID.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_child_folder_message",
    description: "Tool to update a message in a child folder within a user's mailbox. Use when you need to modify message properties such as isRead status, importance, categories, or subject for messages in nested folder structures for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_CHILD_FOLDER_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The content of the item body.",
            },
            contentType: {
              type: "string",
              description: "The type of body content.",
              enum: [
                "text",
                "html",
              ],
            },
          },
          description: "The body of the message.",
        },
        flag: {
          type: "object",
          additionalProperties: true,
          properties: {
            flagStatus: {
              type: "string",
              description: "Status for follow-up for an item.",
              enum: [
                "notFlagged",
                "flagged",
                "complete",
              ],
            },
            dueDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
            startDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
            completedDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
          },
          description: "The flag value that indicates the status, start date, due date, or completion date for the message.",
        },
        from: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "Email address of a contact or message recipient.",
            },
          },
          description: "Represents information about a user in the sending or receiving end of a message.",
        },
        isRead: {
          type: "boolean",
          description: "Whether the message has been read.",
        },
        sender: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "Email address of a contact or message recipient.",
            },
          },
          description: "Represents information about a user in the sending or receiving end of a message.",
        },
        replyTo: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The email addresses to use when replying. Only updatable if isDraft=true.",
        },
        subject: {
          type: "string",
          description: "The subject of the message.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user whose mailbox contains the message.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The categories associated with the message.",
        },
        importance: {
          type: "string",
          description: "Importance level of the message.",
          enum: [
            "low",
            "normal",
            "high",
          ],
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to update.",
        },
        ccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The Cc recipients for the message.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The To recipients for the message.",
        },
        bccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The Bcc recipients for the message.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder containing the child folder.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder containing the message to update.",
        },
        internetMessageId: {
          type: "string",
          description: "The message ID in RFC2822 format. Only updatable if isDraft=true.",
        },
        isReadReceiptRequested: {
          type: "boolean",
          description: "Whether a read receipt is requested for the message.",
        },
        inferenceClassification: {
          type: "string",
          description: "Classification of the message based on inferred relevance or importance.",
          enum: [
            "focused",
            "other",
          ],
        },
        isDeliveryReceiptRequested: {
          type: "boolean",
          description: "Whether a delivery receipt is requested for the message.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user child folder message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_contact_extension",
    description: "Tool to update an open extension on a contact in a user's contact folder. Use when you need to modify custom properties stored in a contact extension for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_CONTACT_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be user ID or userPrincipalName.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension. Can be extension name (e.g., 'Com.Contoso.Referral') or fully qualified name (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.Referral').",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. For M365 resources like contacts, only specified properties are updated (unspecified ones remain unchanged). If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "contact_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_contacts_extensions",
    description: "Tool to update an open extension on a contact in a user's contact folder. Use when you need to modify custom properties stored in a contact extension for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_CONTACTS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be 'me' for the authenticated user, the user's email address, or the user's object ID.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to which the extension belongs.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.ContactData) or just the extension name (e.g., Com.Contoso.ContactData).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder within the contact folder.",
        },
        contact_folder_id: {
          type: "string",
          description: "The unique identifier of the contact folder containing the contact.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update or add to the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "user_id",
        "contact_folder_id",
        "child_folder_id",
        "contact_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user contact extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_contacts_extensions_direct",
    description: "Tool to update an open extension on a contact directly under a user's contacts collection. Use when you need to modify custom properties stored in a contact extension.",
    toolSlug: "OUTLOOK_UPDATE_USER_CONTACTS_EXTENSIONS_DIRECT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Can be 'me' for the authenticated user, the user's email address, or the user's object ID.",
        },
        contact_id: {
          type: "string",
          description: "The unique identifier of the contact to which the extension belongs.",
        },
        "extension-id": {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update or add to the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "contact_id",
        "extension-id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user contact extension (v3).",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_events_extensions",
    description: "Tool to update an open extension on a user's calendar event. Use when modifying custom properties stored in an event extension for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_EVENTS_EXTENSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user whose event extension should be updated. Can be the user's principal name (email address), object ID, or 'me' for the authenticated user.",
        },
        event_id: {
          type: "string",
          description: "The unique identifier of the calendar event containing the extension to update.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier of the extension to update. Can be the full extension ID (e.g., Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension) or just the extension name (e.g., Com.Contoso.TestExtension).",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. Must match the format: 'Com.Company.ExtensionName'.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name will be updated.",
        },
      },
      required: [
        "user_id",
        "event_id",
        "extension_id",
        "extension_name",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "calendar_and_events",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user events extensions.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_inference_classification_override",
    description: "Tool to update the classification of messages from a specific sender in a user's Focused Inbox. Use when you need to change whether messages from a sender go to Focused or Other inbox for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_INFERENCE_CLASSIFICATION_OVERRIDE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user ID or 'me' for the authenticated user",
        },
        classifyAs: {
          type: "string",
          description: "Specifies how incoming messages from a specific sender should always be classified. Use 'focused' to prioritize messages in the Focused inbox, or 'other' to send them to the Other inbox.",
          enum: [
            "focused",
            "other",
          ],
        },
        override_id: {
          type: "string",
          description: "The unique identifier of the inference classification override to update",
        },
      },
      required: [
        "user_id",
        "override_id",
        "classifyAs",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "inference_classification",
    ],
    askBefore: [
      "Confirm the parameters before executing Update User Inference Classification Override.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_mail_folder_message",
    description: "Tool to update properties of a message in a specific mail folder for a user. Use when you need to modify message attributes like categories, read status, importance, or other properties for a message within a particular user's folder.",
    toolSlug: "OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "object",
          additionalProperties: true,
          properties: {
            content: {
              type: "string",
              description: "The content of the item body.",
            },
            contentType: {
              type: "string",
              description: "The type of body content.",
              enum: [
                "text",
                "html",
              ],
            },
          },
          description: "The body of the message.",
        },
        flag: {
          type: "object",
          additionalProperties: true,
          properties: {
            flagStatus: {
              type: "string",
              description: "Status for follow-up for an item.",
              enum: [
                "notFlagged",
                "flagged",
                "complete",
              ],
            },
            dueDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
            startDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
            completedDateTime: {
              type: "object",
              additionalProperties: true,
              properties: {
                dateTime: {
                  type: "string",
                  description: "A single point of time in combined date and time format ({date}T{time}). Example: '2024-01-15T09:00:00.0000000'.",
                },
                timeZone: {
                  type: "string",
                  description: "The time zone. Example: 'Pacific Standard Time', 'UTC'.",
                },
              },
              description: "Describes the date, time, and time zone of a point in time.",
            },
          },
          description: "The flag value that indicates the status, start date, due date, or completion date for the message.",
        },
        from: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "Email address of a contact or message recipient.",
            },
          },
          description: "Represents information about a user in the sending or receiving end of a message.",
        },
        isRead: {
          type: "boolean",
          description: "Whether the message has been read.",
        },
        sender: {
          type: "object",
          additionalProperties: true,
          properties: {
            emailAddress: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: {
                  type: "string",
                  description: "The display name of the person or entity.",
                },
                address: {
                  type: "string",
                  description: "The email address of the person or entity.",
                },
              },
              description: "Email address of a contact or message recipient.",
            },
          },
          description: "Represents information about a user in the sending or receiving end of a message.",
        },
        replyTo: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The email addresses to use when replying. Only updatable if isDraft=true.",
        },
        subject: {
          type: "string",
          description: "The subject of the message. Only updatable if isDraft=true.",
        },
        user_id: {
          type: "string",
          description: "The unique identifier of the user whose mailbox contains the message. Use 'me' for the authenticated user or a specific user ID.",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The categories associated with the message. Use this to organize and filter messages.",
        },
        importance: {
          type: "string",
          description: "Importance level of the message.",
          enum: [
            "low",
            "normal",
            "high",
          ],
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message to update within the specified mail folder.",
        },
        ccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The Cc recipients for the message.",
        },
        toRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The To recipients for the message.",
        },
        bccRecipients: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              emailAddress: {
                type: "object",
                additionalProperties: true,
                properties: {
                  name: {
                    type: "string",
                    description: "The display name of the person or entity.",
                  },
                  address: {
                    type: "string",
                    description: "The email address of the person or entity.",
                  },
                },
                description: "Email address of a contact or message recipient.",
              },
            },
            description: "Represents information about a user in the sending or receiving end of a message.",
          },
          description: "The Bcc recipients for the message.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message. Use 'inbox', 'drafts', 'sentitems', or a custom folder ID.",
        },
        internetMessageId: {
          type: "string",
          description: "The message ID in RFC2822 format. Only updatable if isDraft=true.",
        },
        isReadReceiptRequested: {
          type: "boolean",
          description: "Whether a read receipt is requested for the message.",
        },
        inferenceClassification: {
          type: "string",
          description: "Classification of the message based on inferred relevance or importance.",
          enum: [
            "focused",
            "other",
          ],
        },
        isDeliveryReceiptRequested: {
          type: "boolean",
          description: "Whether a delivery receipt is requested for the message.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user mail folder message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_mail_folder_message_extension",
    description: "Tool to update an open extension on a message within a specific user's mail folder. Use when you need to modify custom properties stored in a message extension for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user or 'me' for the authenticated user. Can be a user principal name (UPN) or user ID.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the extension to update.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier or name of the extension to update. Can be the full extension ID (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension') or just the extension name (e.g., 'Com.Contoso.TestExtension').",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. If provided, it will update the extension name. Must follow the format 'Com.Company.ExtensionName'.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the mail folder containing the message. Can be a well-known folder name (e.g., 'inbox', 'drafts', 'sentitems') or a folder ID.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name (if specified) will be updated.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user message extension.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_mail_folder_message_rule",
    description: "Tool to update a message rule in a user's mail folder. Use when you need to modify an existing rule's properties, conditions, actions, or exceptions for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_MAIL_FOLDER_MESSAGE_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        actions: {
          type: "object",
          additionalProperties: true,
          properties: {
            delete: {
              type: "boolean",
              description: "Whether to delete matching messages.",
            },
            forwardTo: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of email addresses to forward matching messages to.",
            },
            markAsRead: {
              type: "boolean",
              description: "Whether to mark matching messages as read.",
            },
            copyToFolder: {
              type: "string",
              description: "Folder ID to copy matching messages to.",
            },
            moveToFolder: {
              type: "string",
              description: "Folder ID to move matching messages to.",
            },
            assignCategories: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of categories to assign to matching messages.",
            },
            stopProcessingRules: {
              type: "boolean",
              description: "If true, stops processing other rules after this rule's actions execute. Useful for priority rules where you want to prevent lower-priority rules from running. Example: High-priority sender rule that moves to VIP folder and stops other filing rules.",
            },
          },
          description: "Updated actions to take when the rule conditions are met.",
        },
        rule_id: {
          type: "string",
          description: "The ID of the message rule to update.",
        },
        user_id: {
          type: "string",
          description: "User's identifier; 'me' for the signed-in user, or user's principal name/ID.",
        },
        sequence: {
          type: "integer",
          description: "Updated order in which the rule is executed (lower numbers execute first).",
        },
        conditions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Updated conditions that must be met for the rule to apply.",
        },
        exceptions: {
          type: "object",
          additionalProperties: true,
          properties: {
            importance: {
              type: "string",
              description: "Message importance level to match (low, normal, high).",
            },
            bodyContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message body must contain.",
            },
            fromAddresses: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of exact sender email addresses to match (e.g., 'boss@company.com'). For partial/domain matching, use senderContains instead.",
            },
            hasAttachments: {
              type: "boolean",
              description: "Whether the message must have attachments.",
            },
            senderContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings for partial sender email matching. If sender email contains ANY of these strings, rule triggers. Useful for domain matching (e.g., '@openai.com') or pattern matching (e.g., 'noreply', 'no-reply', 'notifications'). More flexible than fromAddresses which requires exact matches.",
            },
            subjectContains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of strings that the message subject must contain.",
            },
          },
          description: "Updated exception conditions for the rule.",
        },
        is_enabled: {
          type: "boolean",
          description: "Whether the rule should be enabled or disabled.",
        },
        display_name: {
          type: "string",
          description: "Updated display name for the message rule.",
        },
        mail_folder_id: {
          type: "string",
          description: "The ID of the mail folder containing the message rule. Can be a well-known folder name (e.g., 'inbox', 'drafts', 'sentitems') or a folder ID.",
        },
      },
      required: [
        "mail_folder_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user mail folder message rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_mail_folders_child_folders",
    description: "Tool to update a child folder within a mail folder for a specific user. Use when you need to rename a child mail folder.",
    toolSlug: "OUTLOOK_UPDATE_USER_MAIL_FOLDERS_CHILD_FOLDERS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user. Use 'me' for the authenticated user or the user's ID/userPrincipalName.",
        },
        displayName: {
          type: "string",
          description: "The mailFolder's display name to update.",
        },
        mail_folder_id: {
          type: "string",
          description: "The unique identifier of the parent mail folder.",
        },
        child_folder_id: {
          type: "string",
          description: "The unique identifier of the child folder to update.",
        },
      },
      required: [
        "user_id",
        "mail_folder_id",
        "child_folder_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user mail folder child folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "outlook_update_user_message_extension",
    description: "Tool to update an open extension on a user's message. Use when you need to modify custom properties stored in a message extension for a specific user.",
    toolSlug: "OUTLOOK_UPDATE_USER_MESSAGE_EXTENSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The unique identifier of the user or 'me' for the authenticated user. Can be a user principal name (UPN) or user ID.",
        },
        message_id: {
          type: "string",
          description: "The unique identifier of the message containing the extension to update.",
        },
        extension_id: {
          type: "string",
          description: "The unique identifier or name of the extension to update. Can be the full extension ID (e.g., 'Microsoft.OutlookServices.OpenTypeExtension.Com.Contoso.TestExtension') or just the extension name (e.g., 'Com.Contoso.TestExtension').",
        },
        extension_name: {
          type: "string",
          description: "The name of the extension. If provided, it will update the extension name. Must follow the format 'Com.Company.ExtensionName'.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update in the extension. Each property can be a string, number, or boolean value. If not provided, only the extension name (if specified) will be updated.",
        },
      },
      required: [
        "user_id",
        "message_id",
        "extension_id",
      ],
    },
    tags: [
      "composio",
      "outlook",
      "write",
      "mail",
    ],
    askBefore: [
      "Confirm the parameters before executing Update user message extension.",
    ],
    idempotent: true,
  }),
];
