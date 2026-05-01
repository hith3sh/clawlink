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
    integration: "google-calendar",
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
      toolkit: "googlecalendar",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleCalendarComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googlecalendar_acl_delete",
    description: "Deletes an access control rule from a Google Calendar. Use when you need to remove sharing permissions for a user, group, or domain.",
    toolSlug: "GOOGLECALENDAR_ACL_DELETE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rule_id: {
          type: "string",
          description: "ACL rule identifier.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
      },
      required: [
        "calendar_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "access_control",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete ACL Rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_acl_get",
    description: "Retrieves a specific access control rule for a calendar. Use when you need to check permissions for a specific user, group, or domain.",
    toolSlug: "GOOGLECALENDAR_ACL_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        rule_id: {
          type: "string",
          description: "ACL rule identifier. Format: 'scope_type:scope_value' or 'default'. Valid scope types: 'user' (email), 'group' (group email), 'domain' (domain name), 'default' (public access). Examples: 'user:john@example.com', 'group:team@example.com', 'domain:example.com', 'default'. Note: 'me' is NOT valid; use actual email/domain. The rule must exist - use GOOGLECALENDAR_LIST_ACL_RULES to find valid IDs.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
      },
      required: [
        "calendar_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "access_control",
    ],
  }),
  composioTool({
    name: "googlecalendar_acl_insert",
    description: "Creates an access control rule for a calendar. Use when you need to grant sharing permissions to a user, group, or domain.",
    toolSlug: "GOOGLECALENDAR_ACL_INSERT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The role assigned to the scope. Possible values: \"none\" - Provides no access; \"freeBusyReader\" - Provides read access to free/busy information; \"reader\" - Provides read access to the calendar; \"writer\" - Provides read and write access to the calendar; \"owner\" - Provides ownership of the calendar.",
          enum: [
            "none",
            "freeBusyReader",
            "reader",
            "writer",
            "owner",
          ],
        },
        scope: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "The type of the scope. Possible values: \"default\" - The public scope (any user); \"user\" - Limits the scope to a single user; \"group\" - Limits the scope to a group; \"domain\" - Limits the scope to a domain.",
              enum: [
                "default",
                "user",
                "group",
                "domain",
              ],
            },
            value: {
              type: "string",
              description: "The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type 'default'. For type 'user' or 'group', must be a valid email address (e.g., 'user@example.com'). For type 'domain', must be a domain name (e.g., 'example.com'). The value 'me' is NOT a valid email - use the actual email address of the user.",
            },
          },
          description: "The extent to which calendar access is granted by this ACL rule. Specifies who gets the access (user, group, domain, or default).",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        send_notifications: {
          type: "boolean",
          description: "Whether to send notifications about the calendar sharing change. Optional. The default is true.",
        },
      },
      required: [
        "calendar_id",
        "role",
        "scope",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "access_control",
    ],
    askBefore: [
      "Confirm the parameters before executing Create ACL Rule.",
    ],
  }),
  composioTool({
    name: "googlecalendar_acl_list",
    description: "Retrieves the list of access control rules (ACLs) for a specified calendar, providing the necessary 'rule_id' values required for updating specific ACL rules.",
    toolSlug: "GOOGLECALENDAR_ACL_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        pageToken: {
          type: "string",
          description: "Token specifying which result page to return. Optional.",
        },
        syncToken: {
          type: "string",
          description: "Token obtained from the nextSyncToken field returned on the last page of a previous list operation. It makes the result of this list operation contain only entries that have changed since then. Optional. The default is to retrieve all entries.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of entries returned on one result page. Optional. The default is 100.",
        },
        showDeleted: {
          type: "boolean",
          description: "Whether to include deleted ACLs in the result. Optional. The default is False.",
        },
      },
      required: [
        "calendarId",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "access_control",
    ],
  }),
  composioTool({
    name: "googlecalendar_acl_patch",
    description: "Updates an existing access control rule for a calendar using patch semantics (partial update). This allows modifying specific fields without affecting other properties. IMPORTANT: The ACL rule must already exist on the calendar. This action cannot create new rules. If you receive a 404 Not Found error, the rule does not exist - use ACL insert to create it first, or use ACL list to verify available rules. Each patch request consumes three quota units. For domain-type ACL rules, if PATCH fails with 500 error, this action will automatically fallback to UPDATE method.",
    toolSlug: "GOOGLECALENDAR_ACL_PATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The role assigned to the scope. Possible values are: \"none\" - Provides no access; \"freeBusyReader\" - Provides read access to free/busy information; \"reader\" - Provides read access to the calendar (private events appear but details are hidden); \"writer\" - Provides read and write access to the calendar (private events and details are visible); \"owner\" - Provides ownership of the calendar (all permissions of writer plus ability to see and manipulate ACLs).",
        },
        scope: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "The type of the scope. Possible values are: \"default\" - The public scope; \"user\" - Limits the scope to a single user; \"group\" - Limits the scope to a group; \"domain\" - Limits the scope to a domain.",
            },
            value: {
              type: "string",
              description: "The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type 'default'.",
            },
          },
          description: "The extent to which calendar access is granted by this ACL rule. Optional for patch operations. Must include `type` (one of: 'user', 'group', 'domain', 'default') and `value` (email address or domain name) for all types except 'default'.",
        },
        rule_id: {
          type: "string",
          description: "ACL rule identifier of an existing rule. IMPORTANT: The rule must already exist on the calendar - this action cannot create new rules, only modify existing ones. Use the ACL list action to find existing rule IDs, or use the ACL insert action to create a new rule first. Format: 'type:value', such as 'user:email@example.com' or 'group:group@example.com'.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        send_notifications: {
          type: "boolean",
          description: "Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True.",
        },
      },
      required: [
        "calendar_id",
        "rule_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "access_control",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch ACL Rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_acl_update",
    description: "Updates an access control rule for the specified calendar.",
    toolSlug: "GOOGLECALENDAR_ACL_UPDATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The role assigned to the scope. Possible values are: \n- \"none\" - Provides no access. \n- \"freeBusyReader\" - Provides read access to free/busy information. \n- \"reader\" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. \n- \"writer\" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. \n- \"owner\" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.",
        },
        rule_id: {
          type: "string",
          description: "ACL rule identifier.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        send_notifications: {
          type: "boolean",
          description: "Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True.",
        },
      },
      required: [
        "calendar_id",
        "rule_id",
        "role",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "access_control",
    ],
    askBefore: [
      "Confirm the parameters before executing Update ACL Rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_acl_watch",
    description: "Tool to watch for changes to ACL resources. Use when you need to set up real-time notifications for access control list modifications on a calendar.",
    toolSlug: "GOOGLECALENDAR_ACL_WATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A UUID or similar unique string that identifies this channel.",
        },
        type: {
          type: "string",
          description: "The type of delivery mechanism used for this channel. Valid values are \"web_hook\" or \"webhook\".",
        },
        token: {
          type: "string",
          description: "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
        },
        params: {
          type: "object",
          additionalProperties: true,
          properties: {
            ttl: {
              type: "string",
              description: "Time-to-live in seconds for the notification channel. Default is 604800 seconds (one week).",
            },
          },
          description: "Additional parameters controlling delivery channel behavior. Optional.",
        },
        address: {
          type: "string",
          description: "The address where notifications are delivered for this channel.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
      },
      required: [
        "calendarId",
        "id",
        "address",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "notifications_and_channels",
    ],
    askBefore: [
      "Confirm the parameters before executing Watch ACL Changes.",
    ],
  }),
  composioTool({
    name: "googlecalendar_batch_events",
    description: "Execute up to 1000 event mutations (create/patch/delete) in one Google Calendar HTTP batch request with per-item status/results. Use this to materially reduce round-trips for bulk operations like migrations, cleanup, or large-scale updates.",
    toolSlug: "GOOGLECALENDAR_BATCH_EVENTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fail_fast: {
          type: "boolean",
          description: "If true, stop processing after the first batch containing any 4xx error (except 404 on DELETE). Default is false.",
        },
        operations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              body: {
                type: "object",
                additionalProperties: true,
                description: "Request body containing event resource data. Required for POST and PATCH, omitted for DELETE.",
              },
              op_id: {
                type: "string",
                description: "Client-chosen identifier for this operation, used to correlate request with response.",
              },
              method: {
                type: "string",
                description: "HTTP method for this operation: POST (create event), PATCH (update event), or DELETE (remove event).",
                enum: [
                  "POST",
                  "PATCH",
                  "DELETE",
                ],
              },
              event_id: {
                type: "string",
                description: "Event identifier. Required for PATCH and DELETE operations, omitted for POST (create).",
              },
              calendar_id: {
                type: "string",
                description: "Calendar identifier (email address or 'primary' for main calendar).",
              },
              query_params: {
                type: "object",
                additionalProperties: true,
                description: "Query parameters for the operation (e.g., sendUpdates, conferenceDataVersion, maxAttendees).",
              },
            },
            description: "Single operation in a batch request.",
          },
          description: "List of batch operations to execute. Maximum 1000 operations per request.",
        },
      },
      required: [
        "operations",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch Events.",
    ],
  }),
  composioTool({
    name: "googlecalendar_calendar_list_delete",
    description: "Tool to remove a calendar from the user's calendar list. Use when you need to unsubscribe from or hide a calendar from the user's list.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_DELETE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the 'primary' keyword.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendar_list",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Calendar from List.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_calendar_list_get",
    description: "Retrieves metadata for a SINGLE specific calendar from the user's calendar list by its calendar ID. This action requires a calendarId parameter and returns details about that one calendar only. NOTE: This does NOT list all calendars. To list all calendars in the user's calendar list, use GOOGLECALENDAR_CALENDAR_LIST_LIST instead.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        calendarId: {
          type: "string",
          description: "Required. The calendar identifier for the single calendar to retrieve. Use 'primary' for the primary calendar of the authenticated user, or provide a specific calendar ID (e.g., an email address or group calendar ID). To find calendar IDs, first use GOOGLECALENDAR_CALENDAR_LIST_LIST to list all calendars.",
        },
      },
      required: [
        "calendarId",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "calendar_list",
    ],
  }),
  composioTool({
    name: "googlecalendar_calendar_list_insert",
    description: "Inserts an existing calendar into the user's calendar list, making it visible in the UI. Calendars (e.g., newly created ones) won't appear in the list or UI until explicitly inserted.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_INSERT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The identifier of the calendar to insert. Must be a valid calendar ID in email format (e.g., ‘user@example.com’ for a user’s calendar or ‘calendarid@group.calendar.google.com’ for a shared calendar). Note: The ‘primary’ keyword is not supported for this operation - use the actual email address of the primary calendar instead. The calendar must exist and you must have appropriate access permissions.",
        },
        hidden: {
          type: "boolean",
          description: "Whether the calendar has been hidden from the list. Accepts only boolean values: true or false. If not specified, the API defaults to false.",
        },
        colorId: {
          type: "string",
          description: "The color of the calendar. This is an ID referring to an entry in the calendarCore color palette.",
        },
        selected: {
          type: "boolean",
          description: "Whether the calendar is selected and visible in the calendar list. Accepts only boolean values: true or false. If not specified, the API defaults to false.",
        },
        backgroundColor: {
          type: "string",
          description: "The background color of the calendar in the Web UI. (Hexadecimal color code)",
        },
        foregroundColor: {
          type: "string",
          description: "The foreground color of the calendar in the Web UI. (Hexadecimal color code)",
        },
        summaryOverride: {
          type: "string",
          description: "The summary that the authenticated user has set for this calendar.",
        },
        color_rgb_format: {
          type: "boolean",
          description: "Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False.",
        },
        defaultReminders: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              method: {
                type: "string",
                description: "The method used by this reminder (e.g., 'email', 'popup').",
              },
              minutes: {
                type: "integer",
                description: "Number of minutes before the start of the event when the reminder should trigger.",
              },
            },
          },
          description: "The default reminders that the authenticated user has for this calendar.",
        },
        notificationSettings: {
          type: "object",
          additionalProperties: true,
          properties: {
            notifications: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  type: {
                    type: "string",
                    description: "The type of notification (e.g., 'eventCreation', 'eventChange').",
                  },
                  method: {
                    type: "string",
                    description: "The method used by this notification (e.g., 'email').",
                  },
                },
              },
              description: "The list of notifications.",
            },
          },
          description: "The notifications that the authenticated user is receiving for this calendar.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Calendar into List.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_calendar_list_patch",
    description: "Updates an existing calendar on the user's calendar list using patch semantics. This method allows partial updates, modifying only the specified fields.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_PATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        hidden: {
          type: "boolean",
          description: "Whether calendar is hidden.",
        },
        colorId: {
          type: "string",
          description: "ID for calendar color from colors endpoint.",
        },
        selected: {
          type: "boolean",
          description: "Whether calendar content shows in UI.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. Use \"primary\" keyword for the currently logged in user's primary calendar.",
        },
        colorRgbFormat: {
          type: "boolean",
          description: "Whether to use RGB for foreground/background colors.",
        },
        backgroundColor: {
          type: "string",
          description: "Hex color for calendar background.",
        },
        foregroundColor: {
          type: "string",
          description: "Hex color for calendar foreground.",
        },
        summaryOverride: {
          type: "string",
          description: "User-set summary for the calendar.",
        },
        defaultReminders: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              method: {
                type: "string",
                description: "Method for the reminder (e.g., email, popup).",
              },
              minutes: {
                type: "integer",
                description: "Minutes before event for reminder.",
              },
            },
          },
          description: "List of default reminders.",
        },
        notificationSettings: {
          type: "object",
          additionalProperties: true,
          properties: {
            notifications: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  type: {
                    type: "string",
                    description: "Type of notification (e.g., eventCreation).",
                  },
                  method: {
                    type: "string",
                    description: "Method for the notification (e.g., email).",
                  },
                },
              },
              description: "List of notifications.",
            },
          },
          description: "Notification settings for the calendar.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendar_list",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Calendar List Entry.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_calendar_list_update",
    description: "Updates a calendar list entry's display/subscription settings (color, visibility, reminders, selection) for the authenticated user — does not modify the underlying calendar resource (title, timezone, etc.). To modify the calendar itself, use GOOGLECALENDAR_CALENDARS_UPDATE.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_UPDATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        hidden: {
          type: "boolean",
          description: "Whether calendar is hidden.",
        },
        colorId: {
          type: "string",
          description: "ID for calendar color from colors endpoint.",
        },
        selected: {
          type: "boolean",
          description: "Whether calendar content shows in UI.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. Must be an actual calendar ID (e.g., \"examplecalendar@group.calendar.google.com\" or \"c_abc123...@group.calendar.google.com\"). To retrieve valid calendar IDs, use the GOOGLECALENDAR_LIST_CALENDARS action first. The \"primary\" alias is not valid for calendarList.update.",
        },
        colorRgbFormat: {
          type: "boolean",
          description: "Whether to use RGB for foreground/background colors.",
        },
        backgroundColor: {
          type: "string",
          description: "Hex color for calendar background.",
        },
        foregroundColor: {
          type: "string",
          description: "Hex color for calendar foreground.",
        },
        summaryOverride: {
          type: "string",
          description: "User-set summary for the calendar.",
        },
        defaultReminders: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              method: {
                type: "string",
                description: "Method for the reminder (e.g., email, popup).",
              },
              minutes: {
                type: "integer",
                description: "Minutes before event for reminder.",
              },
            },
          },
          description: "List of default reminders.",
        },
        notificationSettings: {
          type: "object",
          additionalProperties: true,
          properties: {
            notifications: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  type: {
                    type: "string",
                    description: "Type of notification (e.g., eventCreation).",
                  },
                  method: {
                    type: "string",
                    description: "Method for the notification (e.g., email).",
                  },
                },
              },
              description: "List of notifications.",
            },
          },
          description: "Notification settings for the calendar.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendarlist",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Calendar List Entry.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_calendar_list_watch",
    description: "Watch for changes to CalendarList resources using push notifications. Use this to receive real-time updates when calendar list entries are modified.",
    toolSlug: "GOOGLECALENDAR_CALENDAR_LIST_WATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A UUID or similar unique string that identifies this channel. Maximum 64 characters.",
        },
        type: {
          type: "string",
          description: "The type of delivery mechanism used for this channel. Must be \"web_hook\" or \"webhook\".",
        },
        token: {
          type: "string",
          description: "An arbitrary string delivered to the target address with each notification. Maximum 256 characters. Used for channel verification and message routing.",
        },
        params: {
          type: "object",
          additionalProperties: true,
          properties: {
            ttl: {
              type: "string",
              description: "Time-to-live in seconds for the notification channel. Default is 604800 seconds (7 days).",
            },
          },
          description: "Additional parameters controlling delivery channel behavior.",
        },
        address: {
          type: "string",
          description: "The HTTPS URL where notifications are delivered for this channel. Must have a valid SSL certificate.",
        },
        expiration: {
          type: "integer",
          description: "Unix timestamp in milliseconds indicating when the API should stop sending notifications.",
        },
      },
      required: [
        "id",
        "type",
        "address",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "notifications_and_channels",
    ],
    askBefore: [
      "Confirm the parameters before executing Watch Calendar List.",
    ],
  }),
  composioTool({
    name: "googlecalendar_calendars_delete",
    description: "Deletes a secondary calendar that you own or have delete permissions on. Deletion is permanent and irreversible — verify the correct calendar_id before calling. You cannot delete your primary calendar or calendars you only have read/write access to. Use calendarList.list to find calendars with owner accessRole. For primary calendars, use calendars.clear instead. Parallel calls may trigger userRateLimitExceeded; sequence bulk deletions.",
    toolSlug: "GOOGLECALENDAR_CALENDARS_DELETE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        calendar_id: {
          type: "string",
          description: "Calendar identifier for a secondary calendar you own or have delete permissions on. Use calendarList.list to find deletable calendar IDs (look for accessRole \"owner\"). Primary calendars cannot be deleted; use the Clear Calendar action instead.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_calendars_update",
    description: "Full PUT-style update that overwrites all calendar metadata fields; unspecified optional fields are cleared. Use GOOGLECALENDAR_PATCH_CALENDAR to update only a subset of fields. Mutates the underlying calendar resource (title, description, timeZone, etc.); use GOOGLECALENDAR_CALENDAR_LIST_UPDATE to change per-user display properties like color.",
    toolSlug: "GOOGLECALENDAR_CALENDARS_UPDATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        summary: {
          type: "string",
          description: "Title of the calendar. Must be a non-empty string; passing an empty string clears the calendar title.",
        },
        location: {
          type: "string",
          description: "Geographic location of the calendar as free-form text. Optional.",
        },
        timeZone: {
          type: "string",
          description: "The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. \"Europe/Zurich\".) Optional.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. Use 'primary' to update the primary calendar of the currently logged in user, or provide a specific calendar ID (typically in email format like 'abc123@group.calendar.google.com'). To retrieve calendar IDs call the calendarList.list method. IMPORTANT: This is NOT the calendar's display name/title. NOTE: For better performance, prefer providing the actual calendar ID instead of 'primary', as the 'primary' alias requires an additional API call to resolve.",
        },
        description: {
          type: "string",
          description: "Description of the calendar. Optional.",
        },
      },
      required: [
        "calendarId",
        "summary",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_channels_stop",
    description: "Tool to stop watching resources through a notification channel. Use when you need to discontinue push notifications for a specific channel subscription.",
    toolSlug: "GOOGLECALENDAR_CHANNELS_STOP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A UUID or similar unique string that identifies this channel.",
        },
        token: {
          type: "string",
          description: "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
        },
        resourceId: {
          type: "string",
          description: "An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.",
        },
      },
      required: [
        "id",
        "resourceId",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "notifications_and_channels",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Stop Channel.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_clear_calendar",
    description: "Clears a primary calendar by deleting all events from it. The calendar itself is preserved; only its events are removed. Primary calendars cannot be deleted entirely.",
    toolSlug: "GOOGLECALENDAR_CLEAR_CALENDAR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        calendar_id: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the `calendarList.list` method. If you want to access the primary calendar of the currently logged in user, use the \"`primary`\" keyword.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Clear Calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_colors_get",
    description: "Returns the color definitions for calendars and events. Use when you need to retrieve the available color palette for styling calendars or events.",
    toolSlug: "GOOGLECALENDAR_COLORS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "googlecalendar_create_event",
    description: "Create a Google Calendar event using start_datetime plus duration fields. The organizer is added as an attendee unless exclude_organizer is True. By default adds Google Meet link (works for Workspace, gracefully falls back for personal Gmail). Attendees can be email strings (required) or objects with email and optional fields. No conflict checking is performed; use GOOGLECALENDAR_FREE_BUSY_QUERY to detect overlaps before creating. Returns event id and htmlLink nested under data.response_data. Example: { \"start_datetime\": \"2025-01-16T13:00:00\", \"timezone\": \"America/New_York\", \"event_duration_hour\": 1, \"event_duration_minutes\": 30, \"summary\": \"Client sync\", \"attendees\": [\"required@example.com\", {\"email\": \"optional@example.com\", \"optional\": true}] }",
    toolSlug: "GOOGLECALENDAR_CREATE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        summary: {
          type: "string",
          description: "Summary (title) of the event.",
        },
        location: {
          type: "string",
          description: "Geographic location of the event as free-form text.",
        },
        timezone: {
          type: "string",
          description: "IANA timezone name from the timezone database (e.g., 'America/New_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names.",
        },
        attendees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attendees. Each attendee can be either: (1) A string email address (e.g., 'user@example.com'), or (2) An object with 'email' (required), 'optional' (boolean, default false), 'displayName' (string), 'comment' (string), 'additionalGuests' (integer), and 'resource' (boolean). To mark an attendee as optional (not required), use object format: {'email': 'user@example.com', 'optional': true}. IMPORTANT: Only valid email addresses are accepted. Plain names cannot be used.",
        },
        eventType: {
          type: "string",
          description: "Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API.",
          enum: [
            "birthday",
            "default",
            "focusTime",
            "outOfOffice",
            "workingLocation",
          ],
        },
        recurrence: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring.",
        },
        visibility: {
          type: "string",
          description: "Event visibility: 'default', 'public', 'private', or 'confidential'.",
          enum: [
            "default",
            "public",
            "private",
            "confidential",
          ],
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. Use 'primary' (recommended) for the user's main calendar. Alternatively, use a calendar ID from the user's accessible calendar list. Calendar IDs look like email addresses (e.g., 'xyz@group.calendar.google.com' for shared calendars). Important: Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list with appropriate access permissions. Use GOOGLECALENDAR_LIST_CALENDARS to retrieve valid calendar IDs.",
        },
        description: {
          type: "string",
          description: "Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type.",
        },
        end_datetime: {
          type: "string",
          description: "Event end time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. When provided, this parameter takes precedence over event_duration_hour and event_duration_minutes. If not provided, the end time is calculated using start_datetime + duration. Must be after start_datetime. Fractional seconds and timezone info will be automatically stripped if provided. Examples: '2025-01-16T14:30:00', '2025-01-16T14:30'.",
        },
        send_updates: {
          type: "string",
          description: "Options for who should receive notifications about event changes.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
        transparency: {
          type: "string",
          description: "'opaque' (busy) or 'transparent' (available).",
          enum: [
            "opaque",
            "transparent",
          ],
        },
        start_datetime: {
          type: "string",
          description: "REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'.",
        },
        guestsCanModify: {
          type: "boolean",
          description: "If True, guests can modify the event.",
        },
        exclude_organizer: {
          type: "boolean",
          description: "If True, the organizer will NOT be added as an attendee. Default is False (organizer is included).",
        },
        birthdayProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of birthday event: 'birthday', 'anniversary', or 'other'. Defaults to 'birthday'.",
              enum: [
                "birthday",
                "anniversary",
                "other",
              ],
            },
            contact: {
              type: "string",
              description: "Contact ID in format 'people/c12345' from Google People API. REQUIRED when type is 'anniversary' or 'other'. MUST BE OMITTED when type is 'birthday' (the API forbids contact field for type='birthday').",
            },
            customTypeName: {
              type: "string",
              description: "Custom type name when type is 'other'. Requires valid contact field.",
            },
          },
          description: "Properties for birthday events.",
        },
        create_meeting_room: {
          type: "boolean",
          description: "Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations.",
        },
        event_duration_hour: {
          type: "integer",
          description: "Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event_duration_minutes instead. Ignored if end_datetime is provided.",
        },
        extended_properties: {
          type: "object",
          additionalProperties: true,
          description: "Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}}",
        },
        focusTimeProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            chatStatus: {
              type: "string",
              description: "Chat status during focus time: 'active' or 'doNotDisturb'.",
              enum: [
                "active",
                "doNotDisturb",
              ],
            },
            declineMessage: {
              type: "string",
              description: "Message to include in declined meeting invitations. Only used when autoDeclineMode is set.",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto decline mode: 'declineNone' (no invitations declined), 'declineAllConflictingInvitations' (all conflicting invitations declined), or 'declineOnlyNewConflictingInvitations' (only new conflicting invitations declined).",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled.",
        },
        guestsCanInviteOthers: {
          type: "boolean",
          description: "Whether attendees other than the organizer can invite others to the event.",
        },
        outOfOfficeProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            declineMessage: {
              type: "string",
              description: "Message to include in declined meeting invitations. Only used when autoDeclineMode is set.",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto decline mode: 'declineNone' (no invitations declined), 'declineAllConflictingInvitations' (all conflicting invitations declined), or 'declineOnlyNewConflictingInvitations' (only new conflicting invitations declined). RECURRING EVENT RESTRICTION: For recurring out-of-office events, ONLY 'declineOnlyNewConflictingInvitations' is allowed. Cannot use 'declineAllConflictingInvitations' for recurring OOO (Google Calendar prevents retroactively declining existing meetings). REQUIRES Google Workspace (paid business subscription, e.g., Business Starter at $6/user/month). Personal Gmail accounts cannot use this feature.",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Properties for outOfOffice events.",
        },
        event_duration_minutes: {
          type: "integer",
          description: "Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event_duration_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. Ignored if end_datetime is provided.",
        },
        guestsCanSeeOtherGuests: {
          type: "boolean",
          description: "Whether attendees other than the organizer can see who the event's attendees are.",
        },
        workingLocationProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of working location ('homeOffice' | 'officeLocation' | 'customLocation').",
              enum: [
                "homeOffice",
                "officeLocation",
                "customLocation",
              ],
            },
            homeOffice: {
              type: "object",
              additionalProperties: true,
              properties: {},
              description: "Empty object marker for home office working location.\n\nThis is used to indicate the user is working from home.\nGoogle Calendar API accepts an empty object for this field.",
            },
            customLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Label for a custom working location (e.g., 'Client site').",
                },
              },
              description: "Custom working location with a display label.",
            },
            officeLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Office name displayed in Calendar clients (e.g., building name).",
                },
                deskId: {
                  type: "string",
                  description: "Optional desk identifier.",
                },
                floorId: {
                  type: "string",
                  description: "Optional floor identifier.",
                },
                buildingId: {
                  type: "string",
                  description: "Optional building identifier from org Resources.",
                },
                floorSectionId: {
                  type: "string",
                  description: "Optional floor section identifier.",
                },
              },
              description: "Office-based working location details.",
            },
          },
          description: "Properties for workingLocation events. REQUIRES Google Workspace Enterprise.\n\nConstraints discovered from testing:\n- Must set transparency='transparent' and visibility='public'\n- Description must be omitted\n- Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation'",
        },
      },
      required: [
        "start_datetime",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Event.",
    ],
  }),
  composioTool({
    name: "googlecalendar_delete_event",
    description: "Deletes a specified event by `event_id` from a Google Calendar (`calendar_id`); idempotent — a 404 for an already-deleted event is a no-op. Bulk deletions may trigger `rateLimitExceeded` or `userRateLimitExceeded`; cap concurrency to 5–10 requests and apply exponential backoff.",
    toolSlug: "GOOGLECALENDAR_DELETE_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        event_id: {
          type: "string",
          description: "Unique identifier of the event to delete. For standalone events, use the base event ID (e.g., 'abc123def456'). For recurring event instances, use the instance ID format 'baseEventId_YYYYMMDDTHHMMSSZ' (e.g., 'abc123def456_20260522T093000Z') where the timestamp suffix represents the instance's original start time in UTC. Instance IDs can be obtained from the EVENTS_INSTANCES action. To delete ALL occurrences of a recurring event, use the base event ID without the timestamp suffix. Must be the internal API identifier from a prior API response — UI-visible identifiers, URL-encoded variants, or shortened IDs are invalid and cause 404/validation errors.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which the event will be deleted. Read-only or subscribed calendars (calendars not owned by the authenticated user) return 403 on deletion attempts.",
        },
        send_updates: {
          type: "string",
          description: "Options for who should receive notifications about event changes.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
        send_notifications: {
          type: "boolean",
          description: "Deprecated. Whether to send notifications about the deletion of the event. Note that some emails might still be sent.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_duplicate_calendar",
    description: "Creates a new, empty Google Calendar with the specified title (summary). Newly created calendars default to UTC timezone; use GOOGLECALENDAR_PATCH_CALENDAR afterward to set the desired timeZone if needed.",
    toolSlug: "GOOGLECALENDAR_DUPLICATE_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        summary: {
          type: "string",
          description: "Title for the new Google Calendar to be created. Required and must be a non-empty string.",
        },
      },
      required: [
        "summary",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a calendar.",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_get",
    description: "Retrieves a SINGLE event by its unique event_id (REQUIRED). This action does NOT list or search events - it fetches ONE specific event when you already know its ID. If you want to list events within a time range, search for events, or filter by criteria like time_min/time_max, use GOOGLECALENDAR_EVENTS_LIST instead.",
    toolSlug: "GOOGLECALENDAR_EVENTS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        event_id: {
          type: "string",
          description: "REQUIRED. The unique identifier of the specific event to retrieve. You must already know this ID (e.g., from a previous EVENTS_LIST call or event creation response). This action fetches ONE event by ID - it cannot list or search events. To find events by time range or search criteria, use GOOGLECALENDAR_EVENTS_LIST instead.",
        },
        time_zone: {
          type: "string",
          description: "Time zone used in the response. If not specified, the calendar's time zone is used.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which to retrieve the event.",
        },
        max_attendees: {
          type: "integer",
          description: "Maximum number of attendees to include in the response. If there are more than the specified number, only the participant is returned.",
        },
      },
      required: [
        "event_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_import",
    description: "Tool to import an event as a private copy to a calendar. Use when you need to add an existing event to a calendar using its iCalUID. Only events with eventType='default' can be imported.",
    toolSlug: "GOOGLECALENDAR_EVENTS_IMPORT",
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
            date: {
              type: "string",
              description: "The date, in 'yyyy-mm-dd' format, for all-day events.",
            },
            dateTime: {
              type: "string",
              description: "The start/end time as a combined date-time value (RFC3339).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the start/end time.",
            },
          },
          description: "The (exclusive) end time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields.",
        },
        start: {
          type: "object",
          additionalProperties: true,
          properties: {
            date: {
              type: "string",
              description: "The date, in 'yyyy-mm-dd' format, for all-day events.",
            },
            dateTime: {
              type: "string",
              description: "The start/end time as a combined date-time value (RFC3339).",
            },
            timeZone: {
              type: "string",
              description: "The time zone for the start/end time.",
            },
          },
          description: "The (inclusive) start time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields. `dateTime` must be ISO 8601 format (e.g., `'2024-01-15T10:00:00'`); `timeZone` should match the calendar's timezone to avoid shifted times.",
        },
        source: {
          type: "object",
          additionalProperties: true,
          properties: {
            url: {
              type: "string",
              description: "URL of the event source. Must be absolute.",
            },
            title: {
              type: "string",
              description: "Title of the event source.",
            },
          },
          description: "Source from which the event was created.",
        },
        status: {
          type: "string",
          description: "Status of the event. Possible values: 'confirmed', 'tentative', 'cancelled'.",
        },
        colorId: {
          type: "string",
          description: "The color of the event. This is an ID referring to an entry in the event colors definition.",
        },
        iCalUID: {
          type: "string",
          description: "Event unique identifier as defined in RFC5545. This is required to identify the event being imported.",
        },
        summary: {
          type: "string",
          description: "Title of the event.",
        },
        location: {
          type: "string",
          description: "Geographic location of the event as free-form text.",
        },
        sequence: {
          type: "integer",
          description: "Sequence number as per iCalendar.",
        },
        attendees: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The attendee's Profile ID, if available.",
              },
              self: {
                type: "boolean",
                description: "Whether this entry represents the calendar where the event appears.",
              },
              email: {
                type: "string",
                description: "The attendee's email address.",
              },
              comment: {
                type: "string",
                description: "The attendee's response comment.",
              },
              optional: {
                type: "boolean",
                description: "Whether the attendee is optional.",
              },
              resource: {
                type: "boolean",
                description: "Whether the attendee is a resource (for example, a room). Can only be set when adding the attendee initially.",
              },
              organizer: {
                type: "boolean",
                description: "Whether the attendee is the organizer. Read-only.",
              },
              displayName: {
                type: "string",
                description: "The attendee's name, if available.",
              },
              responseStatus: {
                type: "string",
                description: "The attendee's response status.",
              },
              additionalGuests: {
                type: "integer",
                description: "Number of additional guests the attendee is bringing.",
              },
            },
          },
          description: "The attendees of the event.",
        },
        reminders: {
          type: "object",
          additionalProperties: true,
          properties: {
            overrides: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  method: {
                    type: "string",
                    description: "The method used by the reminder (e.g., 'email', 'popup').",
                  },
                  minutes: {
                    type: "integer",
                    description: "Number of minutes before the start of the event when the reminder should trigger.",
                  },
                },
              },
              description: "If 'useDefault' is false, the list of reminders that override the default.",
            },
            useDefault: {
              type: "boolean",
              description: "Whether the default reminders of the calendar apply to the event.",
            },
          },
          description: "Information about the event's reminders for the authenticated user.",
        },
        recurrence: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. Each string must include the full prefix (e.g., `'RRULE:FREQ=WEEKLY;BYDAY=MO'`); omitting the prefix causes a 400 error.",
        },
        visibility: {
          type: "string",
          description: "Visibility of the event. Possible values: 'default', 'public', 'private', 'confidential'. Default: 'default'.",
        },
        attachments: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              title: {
                type: "string",
                description: "Title of the attachment.",
              },
              fileId: {
                type: "string",
                description: "ID of the attached file. For Google Drive files, the Drive file ID. Read-only.",
              },
              fileUrl: {
                type: "string",
                description: "URL link to the attachment.",
              },
              iconLink: {
                type: "string",
                description: "URL link to the attachment's icon.",
              },
              mimeType: {
                type: "string",
                description: "MIME type of the attachment.",
              },
            },
          },
          description: "File attachments for the event.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier. Use 'primary' for the logged-in user's primary calendar or the calendar's email address.",
        },
        description: {
          type: "string",
          description: "Description of the event. Can contain HTML.",
        },
        transparency: {
          type: "string",
          description: "Whether the event blocks time on the calendar. Possible values: 'opaque' (blocks time), 'transparent' (does not block time). Default: 'opaque'.",
        },
        guestsCanModify: {
          type: "boolean",
          description: "Whether attendees other than the organizer can modify the event. Default: False.",
        },
        extendedProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            shared: {
              type: "object",
              additionalProperties: true,
              description: "Properties shared between copies of the event on other attendees' calendars. A map of string keys to string values.",
            },
            private: {
              type: "object",
              additionalProperties: true,
              description: "Properties private to the copy of the event on this calendar. A map of string keys to string values.",
            },
          },
          description: "Extended properties of the event.",
        },
        supportsAttachments: {
          type: "boolean",
          description: "Whether API client performing operation supports event attachments. Default: False.",
        },
        conferenceDataVersion: {
          type: "integer",
          description: "Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. Default: 0.",
        },
        guestsCanInviteOthers: {
          type: "boolean",
          description: "Whether attendees other than the organizer can invite others to the event. Default: True.",
        },
        guestsCanSeeOtherGuests: {
          type: "boolean",
          description: "Whether attendees other than the organizer can see who the event's attendees are. Default: True.",
        },
      },
      required: [
        "iCalUID",
        "start",
        "end",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Import Event.",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_instances",
    description: "Returns instances of the specified recurring event. Use timeMin/timeMax to constrain the window; omitting bounds can return large result sets and is quota-heavy. On high-volume calls, 403 rateLimitExceeded or 429 too_many_requests may occur; apply exponential backoff (1s, 2s, 4s) before retrying.",
    toolSlug: "GOOGLECALENDAR_EVENTS_INSTANCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        eventId: {
          type: "string",
          description: "REQUIRED. The ID of the recurring event whose instances you want to retrieve. You must first use GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to find recurring events and get their IDs. This action only works with recurring events that have a recurrence rule.",
        },
        timeMax: {
          type: "string",
          description: "Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset.",
        },
        timeMin: {
          type: "string",
          description: "Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset.",
        },
        timeZone: {
          type: "string",
          description: "Time zone used in the response. Optional. The default is the time zone of the calendar.",
        },
        pageToken: {
          type: "string",
          description: "Token specifying which result page to return. Optional.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the `calendarList.list` method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
        },
        showDeleted: {
          type: "boolean",
          description: "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events will still be included if `singleEvents` is False. Optional. The default is False.",
        },
        maxAttendees: {
          type: "integer",
          description: "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
        },
        originalStart: {
          type: "string",
          description: "The original start time of the instance in the result. Optional.",
        },
      },
      required: [
        "calendarId",
        "eventId",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "instances_and_queries",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_list",
    description: "Returns events on the specified calendar. TIMEZONE WARNING: When using timeMin/timeMax with UTC timestamps (ending in 'Z'), the time window is interpreted in UTC regardless of the calendar's timezone. For example, querying '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' on a calendar in America/Los_Angeles (UTC-8) covers 2026-01-18 4pm to 2026-01-19 4pm local time, potentially missing events on the intended local date. To query for a specific local date, use timestamps with the appropriate timezone offset in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00' for PST).",
    toolSlug: "GOOGLECALENDAR_EVENTS_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "Free text search terms to find events that match these terms in various fields. Optional.",
        },
        iCalUID: {
          type: "string",
          description: "Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID.",
        },
        orderBy: {
          type: "string",
          description: "The order of the events returned in the result. Optional. The default is an unspecified, stable order. Acceptable values are: \"startTime\", \"updated\". When set to \"startTime\", singleEvents must be true. The action automatically sets singleEvents=true when orderBy='startTime'.",
        },
        timeMax: {
          type: "string",
          description: "Upper bound (exclusive) for an event's start time to filter by. Optional. If unset, no start-time upper bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate local timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported.",
        },
        timeMin: {
          type: "string",
          description: "Lower bound (exclusive) for an event's end time to filter by. Optional. If unset, no end-time lower bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate local timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported.",
        },
        timeZone: {
          type: "string",
          description: "Time zone used in the response for formatting event times. Optional. Use an IANA time zone identifier (e.g., America/Los_Angeles). Defaults to the user's primary time zone. Offsets (e.g., '-03:00', 'UTC+0') and abbreviations (e.g., 'IST', 'PST') are invalid. NOTE: This parameter only affects how event times are displayed in the response. It does NOT change how timeMin/timeMax filtering is interpreted. To query a specific local date, use timestamps with the appropriate timezone offset directly in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00').",
        },
        pageToken: {
          type: "string",
          description: "Opaque pagination token from a previous response's nextPageToken field. Must be the exact string returned by the API - do not use placeholder values like 'NEXT', 'next', '1', '2', etc. Omit this parameter entirely for the first page of results. Optional.",
        },
        syncToken: {
          type: "string",
          description: "Token from nextSyncToken to return only entries changed since the last list. Cannot be combined with iCalUID, orderBy, privateExtendedProperty, q, sharedExtendedProperty, timeMin, timeMax, or updatedMin. Deletions since the previous list are always included; showDeleted cannot be false in this mode. The action automatically removes conflicting parameters when syncToken is provided.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. Use \"primary\" for the user's main calendar, or a calendar ID from the user's accessible calendar list. Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list. Use GOOGLECALENDAR_LIST_CALENDARS to retrieve valid calendar IDs. Defaults to \"primary\". Empty strings will be treated as \"primary\". Do NOT use Composio internal IDs like connectedAccountId (which start with \"ca_\") - these will be automatically replaced with \"primary\".",
        },
        eventTypes: {
          type: "string",
          description: "Event types to return. Optional. Pass a single value only. If unset, returns all event types. Acceptable values are: \"birthday\", \"default\", \"focusTime\", \"fromGmail\", \"outOfOffice\", \"workingLocation\".",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. Must be >= 1 if provided.",
        },
        updatedMin: {
          type: "string",
          description: "Lower bound for an event's last modification time (RFC3339). When specified, entries deleted since this time are always included regardless of showDeleted. Optional.",
        },
        showDeleted: {
          type: "boolean",
          description: "Include cancelled events (status=\"cancelled\"). Optional; default is false. This surfaces cancelled (soft-deleted) events, not items in the Trash. When syncToken or updatedMin is used, deletions since those markers are included regardless of showDeleted. Recurring interaction: if singleEvents=false and showDeleted=false, cancelled instances of a recurring series may still be included; if showDeleted=true and singleEvents=true, only single deleted instances (not parent series) are returned.",
        },
        maxAttendees: {
          type: "integer",
          description: "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. Must be >= 1 if provided.",
        },
        singleEvents: {
          type: "boolean",
          description: "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is False.",
        },
        alwaysIncludeEmail: {
          type: "boolean",
          description: "Deprecated and ignored.",
        },
        showHiddenInvitations: {
          type: "boolean",
          description: "Whether to include hidden invitations in the result. Optional. The default is False. Hidden invitations are events where your attendee entry has responseStatus='needsAction' and attendees[].self==true. When true, such invitations are included.",
        },
        sharedExtendedProperty: {
          type: "string",
          description: "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.",
        },
        privateExtendedProperty: {
          type: "string",
          description: "Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.",
        },
        composio_replaced_calendar_id: {
          type: "string",
          description: "Internal field to track if calendarId was replaced",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "events_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_list_all_calendars",
    description: "Return a unified event list across all calendars in the user's calendar list for a given time range. Use when you need a single view of all events across multiple calendars. An inverted or incorrect time range silently returns empty results rather than an error. An empty `items` list means no events matched the filters—adjust `time_min`, `time_max`, or `q` before concluding no events exist.",
    toolSlug: "GOOGLECALENDAR_EVENTS_LIST_ALL_CALENDARS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "Free text search terms to find events that match these terms in any field, except for extended properties. Optional.",
        },
        time_max: {
          type: "string",
          description: "Upper bound (exclusive) for an event's start time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required.",
        },
        time_min: {
          type: "string",
          description: "Lower bound (inclusive) for an event's end time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required.",
        },
        event_types: {
          type: "array",
          items: {
            type: "string",
            description: "Valid event types for Google Calendar API.",
            enum: [
              "birthday",
              "default",
              "focusTime",
              "fromGmail",
              "outOfOffice",
              "workingLocation",
            ],
          },
          description: "Event types to return. Optional.",
        },
        calendar_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of specific calendar IDs to query. If not provided, all calendars from the user's calendar list will be queried.",
        },
        show_deleted: {
          type: "boolean",
          description: "Whether to include deleted events (with status equals 'cancelled') in the result. Optional. The default is False.",
        },
        single_events: {
          type: "boolean",
          description: "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is True.",
        },
        response_detail: {
          type: "string",
          description: "Level of detail in the response. 'minimal' (default) returns only the compact summary_view, omitting the large events array to reduce token usage. 'full' returns both summary_view and the full detailed events array.",
          enum: [
            "minimal",
            "full",
          ],
        },
        max_results_per_calendar: {
          type: "integer",
          description: "Maximum number of events returned per calendar. Optional. If not provided, defaults to the API's default (250). Results may be paginated; follow `nextPageToken` in the response until absent to retrieve the complete event list.",
        },
      },
      required: [
        "time_min",
        "time_max",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "events_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_events_move",
    description: "Moves an event to another calendar, i.e., changes an event's organizer.",
    toolSlug: "GOOGLECALENDAR_EVENTS_MOVE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        event_id: {
          type: "string",
          description: "Event identifier. To retrieve event identifiers call the events.list method.",
        },
        calendar_id: {
          type: "string",
          description: "Calendar identifier of the source calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        destination: {
          type: "string",
          description: "Calendar identifier of the destination calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
        send_updates: {
          type: "string",
          description: "Options for who should receive notifications about event changes.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
      },
      required: [
        "calendar_id",
        "event_id",
        "destination",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_events_watch",
    description: "Watch for changes to Events resources. Watch channels expire; persist the channel `id` per `calendarId` to re-establish watches after expiration or restarts.",
    toolSlug: "GOOGLECALENDAR_EVENTS_WATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A UUID or similar unique string that identifies this channel.",
        },
        type: {
          type: "string",
          description: "The type of delivery mechanism used for this channel.",
        },
        token: {
          type: "string",
          description: "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
        },
        params: {
          type: "object",
          additionalProperties: true,
          properties: {
            ttl: {
              type: "string",
              description: "Time To Live for the notification channel.",
            },
          },
          description: "Additional parameters controlling delivery channel behavior. Optional.",
        },
        address: {
          type: "string",
          description: "The address where notifications are delivered for this channel. Must be a publicly accessible HTTPS URL; http:// or localhost URLs will not receive notifications.",
        },
        payload: {
          type: "boolean",
          description: "A Boolean value to indicate whether payload is wanted. Optional.",
        },
        calendarId: {
          type: "string",
          description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
        },
      },
      required: [
        "calendarId",
        "id",
        "address",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "notifications_and_watching",
    ],
    askBefore: [
      "Confirm the parameters before executing Watch Events.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_find_event",
    description: "Finds events in a specified Google Calendar using text query, time ranges (event start/end, last modification), and event types. Ensure `timeMin` is not chronologically after `timeMax` if both are provided. Results may span multiple pages; always follow `nextPageToken` until absent to avoid silently missing events. Validate the correct match from results by checking summary, start.dateTime, and organizer.email before using event_id for mutations. An empty `items` array means no events matched — widen filters rather than treating it as an error.",
    toolSlug: "GOOGLECALENDAR_FIND_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Free-text search terms to find events. This query is matched against various event fields including summary, description, location, attendees' details (displayName, email), and organizer's details. Cannot search by event_id. Performs full-text match (not exact); broad terms may return unrelated events. For person-based matching, prefer attendees[].email over display names. If results appear incomplete, use GOOGLECALENDAR_EVENTS_LIST with client-side filtering.",
        },
        order_by: {
          type: "string",
          description: "Order of events: 'startTime' (ascending by start time) or 'updated' (ascending by last modification time). Note: 'startTime' requires single_events=true. Use 'updated' if you need to include recurring masters (e.g., cancelled series).",
        },
        time_max: {
          type: "string",
          description: "Upper bound (exclusive) for an event's start time to filter by. Only events starting before this time are included. Accepts multiple formats:\n1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z')\n2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00')\n3. Simple datetime string (e.g., '2024-12-06 13:00:00') Set to the first instant after the desired period to avoid missing boundary events, especially all-day events (date-only fields). Overly wide ranges expand many recurring instances, causing large payloads and high latency — constrain to the minimum required window.",
        },
        time_min: {
          type: "string",
          description: "Lower bound (exclusive) for an event's end time to filter by. Only events ending after this time are included. Accepts multiple formats:\n1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z')\n2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00')\n3. Simple datetime string (e.g., '2024-12-06 13:00:00') RFC3339 timestamps must include explicit timezone offsets; missing or mismatched offsets can silently exclude matching events. To align with the calendar's timezone, retrieve it via GOOGLECALENDAR_GET_CALENDAR.",
        },
        page_token: {
          type: "string",
          description: "Token from a previous response's `nextPageToken` to fetch the subsequent page of results. Always follow every `nextPageToken` until absent; skipping pagination silently omits events on busy calendars.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar to query. IMPORTANT: This must be a valid calendar identifier, NOT a calendar name/title. Valid formats are: 'primary' (the authenticated user's primary calendar), an email address (e.g., 'user@example.com'), or a calendar ID (e.g., 'abc123xyz@group.calendar.google.com'). To find the calendar ID for a named calendar, first use the List Calendars action (GOOGLECALENDAR_LIST_CALENDARS) to retrieve all available calendars with their IDs. 'primary' searches only the authenticated user's primary calendar; to search all calendars, retrieve each ID via GOOGLECALENDAR_LIST_CALENDARS and query separately.",
        },
        event_types: {
          type: "array",
          items: {
            type: "string",
            description: "Event type constraints:\n- 'birthday': Requires transparency='transparent', description must be omitted\n- 'outOfOffice': Requires calendar_id='primary', Workspace/enterprise calendar,\n  transparency='opaque', location and attendees must be omitted,\n  create_meeting_room must be false\n- 'focusTime': Requires Google Workspace Enterprise account with Focus Time feature enabled\n- 'workingLocation': Requires Google Workspace Enterprise account",
            enum: [
              "birthday",
              "default",
              "focusTime",
              "outOfOffice",
              "workingLocation",
            ],
          },
          description: "Event types to include. Supported values: 'birthday', 'default', 'focusTime', 'outOfOffice', 'workingLocation'.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of events per page (1-2500).",
        },
        updated_min: {
          type: "string",
          description: "Lower bound (exclusive) for an event's last modification time to filter by. Only events updated after this time are included. When specified, events deleted since this time are also included, regardless of the `show_deleted` parameter. Accepts multiple formats:\n1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z')\n2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00')\n3. Simple datetime string (e.g., '2024-12-06 13:00:00')",
        },
        show_deleted: {
          type: "boolean",
          description: "Include events whose status is 'cancelled'. This surfaces cancelled/deleted events, not a separate 'trash' view. Behavior with recurring events: when single_events=true, only individual cancelled instances are returned (the recurring master is omitted); to include cancelled recurring masters, set single_events=false. If updated_min is provided, events deleted since that time are included regardless of this flag.",
        },
        single_events: {
          type: "boolean",
          description: "When true, recurring event series are expanded into their individual instances. When false, only the recurring master events are returned. Note: Ordering by 'startTime' requires singleEvents=true. For large calendars, it is strongly recommended to specify both timeMin and timeMax to limit the expansion window and improve performance.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "events_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_find_free_slots",
    description: "Finds both free and busy time slots in Google Calendars for specified calendars within a defined time range. If `time_min` is not provided, defaults to the current timestamp in the specified timezone. If `time_max` is not provided, defaults to 23:59:59 of the day specified in `time_min` (if provided), otherwise defaults to 23:59:59 of the current day in the specified timezone. Returns busy intervals and calculates free slots by finding gaps between busy periods; `time_min` must precede `time_max` if both are provided. This action retrieves free and busy time slots for the specified calendars over a given time period. It analyzes the busy intervals from the calendars and provides calculated free slots based on the gaps in the busy periods. Returned free slots are unfiltered by duration; callers must filter intervals to those fully containing the required meeting length. No event metadata (titles, descriptions, links) is returned; use GOOGLECALENDAR_EVENTS_LIST for event details.",
    toolSlug: "GOOGLECALENDAR_FIND_FREE_SLOTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        items: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of calendar identifiers to query for free/busy information. Pass as a simple list of strings, e.g., ['primary'] or ['primary', 'user@example.com']. Valid values include: 'primary' (authenticated user's main calendar), calendar IDs from the user's calendar list (typically ending in @group.calendar.google.com), or email addresses of users whose free/busy information you want to query. The FreeBusy API will return error information for any calendars that are not accessible or invalid in the response under the 'errors' key for each calendar. Calendars omitted from `items` or inaccessible are treated as free (not unknown), which can silently produce incorrect availability results.",
        },
        time_max: {
          type: "string",
          description: "End datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified `timezone`. If not provided, defaults to 23:59:59 of the day specified in `time_min` (if provided), otherwise defaults to 23:59:59 of the current day in the specified `timezone`. Maximum span between time_min and time_max is approximately 90 days per Google Calendar freeBusy API limit. `time_max` is exclusive; to cover a full day, set `time_max` to 00:00:00 of the following day in the target timezone rather than 23:59:59.",
        },
        time_min: {
          type: "string",
          description: "Start datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified `timezone`. If not provided, defaults to the current timestamp in the specified `timezone` to ensure only future/bookable slots are returned. Maximum span between time_min and time_max is approximately 90 days per Google Calendar freeBusy API limit.",
        },
        timezone: {
          type: "string",
          description: "IANA timezone identifier (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo'). Determines how naive `time_min`/`time_max` are interpreted and the timezone used in the response for `timeMin`, `timeMax`, busy periods, and calculated free slots. Note: 'local' is not supported; use a specific IANA timezone name.",
        },
        group_expansion_max: {
          type: "integer",
          description: "Maximum calendar identifiers to return for a single group. Must be between 1 and 100 (inclusive). Values exceeding 100 will be rejected.",
        },
        calendar_expansion_max: {
          type: "integer",
          description: "Maximum calendars for which FreeBusy information is provided. Must be between 1 and 50 (inclusive). Values exceeding 50 will be rejected.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "instances_and_queries",
    ],
  }),
  composioTool({
    name: "googlecalendar_get_calendar",
    description: "Retrieves a specific Google Calendar, identified by `calendar_id`, to which the authenticated user has access. Response includes `timeZone` (IANA format, e.g., 'America/Los_Angeles') — use it directly when constructing `timeMin`/`timeMax` in other tools to avoid DST errors. An empty `defaultReminders` list is valid (no defaults configured). Insufficient `accessRole` may omit fields like `defaultReminders` and `colorId`.",
    toolSlug: "GOOGLECALENDAR_GET_CALENDAR",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar to retrieve. Must be 'primary' (the default) for the user's main calendar, or an email-like identifier (e.g., 'user@example.com' or 'en.usa#holiday@group.v.calendar.google.com'). IMPORTANT: Calendar display names/titles (e.g., 'Work', 'Vacation') are NOT valid identifiers and will result in errors. To find a calendar's ID, use the LIST_CALENDARS action which returns the 'id' field for each calendar.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "calendars_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_get_current_date_time",
    description: "Gets the current date and time, allowing for a specific timezone offset. Call this tool first before computing relative dates (e.g., 'tomorrow', 'next Monday') to avoid off-by-one-day errors across timezones.",
    toolSlug: "GOOGLECALENDAR_GET_CURRENT_DATE_TIME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        timezone: {
          type: "string",
          description: "Timezone specification. Accepts: (1) IANA timezone identifier (e.g., 'America/New_York', 'Asia/Kolkata', 'Europe/London') - RECOMMENDED, (2) Common timezone abbreviations (e.g., 'PST', 'EST', 'CST', 'GMT', 'UTC') - will be auto-converted to IANA, or (3) Numeric UTC offset in hours (e.g., -5, 5.5). Use positive values for east of UTC, negative for west. Default 0 is UTC.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "time_and_date_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_list_buildings",
    description: "Lists all buildings for a Google Workspace customer account with full details including addresses, coordinates, and floor names. Use this action when you need to retrieve the complete list of physical building locations configured in Google Workspace Calendar resources. This is useful for workspace administrators managing conference room and resource scheduling across multiple office buildings. Requires Google Workspace administrator privileges with Directory API access.",
    toolSlug: "GOOGLECALENDAR_LIST_BUILDINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        customer: {
          type: "string",
          description: "The unique ID for the customer's Google Workspace account. Use 'my_customer' alias to represent your account's customer ID. As an account administrator, this alias represents your account's customer ID.",
        },
        pageToken: {
          type: "string",
          description: "Token to specify the next page in the list. Obtained from nextPageToken in a previous response. Omit for the first page.",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of buildings to return per page. Defaults to 25 for optimal performance.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "googlecalendar_list_calendar_resources",
    description: "Retrieves calendar resources (such as conference rooms) from a Google Workspace domain using the Admin SDK Directory API. Use this action when you need to list available meeting rooms, conference spaces, or other bookable calendar resources in an organization. The action supports filtering by resource category, capacity, building location, and other criteria. IMPORTANT: This requires Admin SDK Directory API access and appropriate admin permissions - it is NOT available for personal Gmail accounts, only Google Workspace domains.",
    toolSlug: "GOOGLECALENDAR_LIST_CALENDAR_RESOURCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Search query to filter calendar resources. Each clause is 'field operator value'. Supported operators: '=' (exact match), '!=' (mismatch), ':' (prefix/HAS match — for prefix match, follow the value with '*'). Supported logical operators: AND, NOT (in that order of precedence). IMPORTANT: Numeric comparison operators (>, <, >=, <=) are NOT supported by the Google Admin Directory API for this endpoint and will cause a 400 Bad Request — 'capacity' can only be filtered by exact equality (e.g., 'capacity=10'). Supported fields: generatedResourceName, name, buildingId, floor_name, capacity, featureInstances.feature.name, resourceEmail, resourceCategory.",
        },
        orderBy: {
          type: "string",
          description: "Specifies sorting order for results. Use field names like 'resourceId', 'resourceName', 'capacity', 'buildingId', 'floorName' optionally followed by ' desc' for descending order. Multiple fields can be separated by commas (e.g., 'buildingId, capacity desc').",
        },
        customer: {
          type: "string",
          description: "The unique ID for the customer's Google Workspace account. Use 'my_customer' as an alias for the account's customer ID.",
        },
        pageToken: {
          type: "string",
          description: "Token for retrieving subsequent pages in paginated results. Use the nextPageToken from a previous response.",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of results to return per page.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "calendars_management",
    ],
  }),
  composioTool({
    name: "googlecalendar_list_calendars",
    description: "Retrieves calendars from the user's Google Calendar list, with options for pagination and filtering. Loop through all pages using nextPageToken until absent to avoid missing calendars. Use the primary flag and accessRole field from the response to identify calendars — display names are not valid calendar_id values. Read access (listing) does not imply write OAuth scopes.",
    toolSlug: "GOOGLECALENDAR_LIST_CALENDARS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_token: {
          type: "string",
          description: "Token for the page of results to return, from a previous response.",
        },
        sync_token: {
          type: "string",
          description: "Sync token from a previous list request to get only changed entries; showDeleted, showHidden, and pageToken are ignored if provided. Also ignores minAccessRole. An HTTP 410 Gone response means the token has expired; perform a full resync by omitting sync_token.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of calendars to return per page. Max 250.",
        },
        show_hidden: {
          type: "boolean",
          description: "Include calendars not typically shown in the UI.",
        },
        show_deleted: {
          type: "boolean",
          description: "Include deleted calendars in the result.",
        },
        min_access_role: {
          type: "string",
          description: "Minimum access role for calendars returned. Valid values are 'freeBusyReader', 'owner', 'reader', 'writer'. freeBusyReader calendars expose only free/busy slots — no event details and writes fail with 403. Omit this filter to include read-only calendars.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
    ],
  }),
  composioTool({
    name: "googlecalendar_patch_calendar",
    description: "Partially updates (PATCHes) an existing Google Calendar, modifying only the fields provided. At least one of summary, description, location, or timezone must be provided. Empty strings for `description` or `location` clear them.",
    toolSlug: "GOOGLECALENDAR_PATCH_CALENDAR",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        summary: {
          type: "string",
          description: "New title for the calendar; cannot be an empty string when provided. At least one of summary, description, location, or timezone must be provided.",
        },
        location: {
          type: "string",
          description: "New geographic location of the calendar (e.g., 'Paris, France').",
        },
        timezone: {
          type: "string",
          description: "New IANA Time Zone Database name for the calendar (e.g., 'Europe/Zurich', 'America/New_York'). Calendars duplicated via GOOGLECALENDAR_DUPLICATE_CALENDAR may default to UTC; set the correct timezone explicitly after duplication.",
        },
        calendar_id: {
          type: "string",
          description: "The unique identifier of the Google Calendar to update. Use 'primary' for the main calendar, or a calendar's unique ID (typically in email format like 'abc123@group.calendar.google.com'). IMPORTANT: This is NOT the calendar's display name/title - use GOOGLECALENDAR_LIST_CALENDARS to find the 'id' field for a calendar.",
        },
        description: {
          type: "string",
          description: "New description for the calendar.",
        },
      },
      required: [
        "calendar_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "calendars_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Calendar.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_patch_event",
    description: "Update specified fields of an existing event in a Google Calendar using patch semantics (array fields like `attendees` are fully replaced if provided); ensure the `calendar_id` and `event_id` are valid and the user has write access to the calendar.",
    toolSlug: "GOOGLECALENDAR_PATCH_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        source: {
          type: "object",
          additionalProperties: true,
          properties: {
            url: {
              type: "string",
              description: "Source URL",
            },
            title: {
              type: "string",
              description: "Source title",
            },
          },
          description: "Input model for event source.",
        },
        status: {
          type: "string",
          description: "Status of the event.",
          enum: [
            "confirmed",
            "tentative",
            "cancelled",
          ],
        },
        summary: {
          type: "string",
          description: "New title for the event.",
        },
        color_id: {
          type: "string",
          description: "Color ID for the event (1-11). Use GOOGLECALENDAR_COLORS_GET to retrieve available colors.",
        },
        end_time: {
          type: "string",
          description: "New end time (RFC3339 timestamp, e.g., '2024-07-01T11:00:00-07:00'). Uses `timezone` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format (exclusive end date). Optional when updating start_time - the original event duration will be preserved if end_time is not specified. Must be strictly after `start_time`; mismatched or mixed formats cause HTTP 400 `timeRangeEmpty`.",
        },
        event_id: {
          type: "string",
          description: "The unique technical identifier of the event to update. IMPORTANT: This is NOT the event title/name. Event IDs are opaque strings typically base32hex encoded (5-1024 characters using lowercase a-v and digits 0-9). For recurring event instances, the ID format is 'baseEventId_YYYYMMDDTHHMMSSZ' with an underscore separator (e.g., 'abc123def456_20260115T100000Z'). To get an event ID, first use GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to search for events and retrieve their IDs. Use master event ID to update the entire recurring series; use instance ID to update only that occurrence — confirm scope before patching.",
        },
        location: {
          type: "string",
          description: "New geographic location (physical address or virtual meeting link).",
        },
        sequence: {
          type: "integer",
          description: "Sequence number as per iCalendar specification. Incremented on each event update.",
        },
        timezone: {
          type: "string",
          description: "IANA Time Zone Database name for start/end times (e.g., 'America/Los_Angeles'). Used if `start_time` and `end_time` are provided and not all-day dates; defaults to UTC if unset. Mismatched or missing timezone with offset timestamps silently shifts event to unintended wall-clock time.",
        },
        attendees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of valid email addresses for attendees (e.g., 'user@example.com'). Replaces existing attendees. Provide an empty list to remove all.",
        },
        reminders: {
          type: "object",
          additionalProperties: true,
          properties: {
            overrides: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  method: {
                    type: "string",
                    description: "Reminder method",
                    enum: [
                      "email",
                      "popup",
                    ],
                  },
                  minutes: {
                    type: "integer",
                    description: "Minutes before start to trigger",
                  },
                },
                description: "Input model for reminder override.",
              },
              description: "Override reminders (max 5)",
            },
            useDefault: {
              type: "boolean",
              description: "Whether to use default calendar reminders",
            },
          },
          description: "Input model for reminders.",
        },
        recurrence: {
          type: "array",
          items: {
            type: "string",
          },
          description: "RRULE, EXRULE, RDATE and EXDATE lines per RFC5545 for recurring events. Replaces existing recurrence rules if provided.",
        },
        start_time: {
          type: "string",
          description: "New start time (RFC3339 timestamp, e.g., '2024-07-01T10:00:00-07:00'). Uses `timezone` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format. When only start_time is provided without end_time, the event's original duration is preserved automatically.",
        },
        visibility: {
          type: "string",
          description: "Visibility of the event.",
          enum: [
            "default",
            "public",
            "private",
            "confidential",
          ],
        },
        attachments: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              title: {
                type: "string",
                description: "Title of the attachment",
              },
              fileUrl: {
                type: "string",
                description: "URL of the file attachment",
              },
              mimeType: {
                type: "string",
                description: "MIME type of the attachment",
              },
            },
            description: "Input model for event attachments.",
          },
          description: "File attachments (max 25). Each with 'fileUrl' (required) and optional 'title', 'mimeType'. Requires supportsAttachments=true.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the calendar. Use 'primary' for the primary calendar of the logged-in user. To find other calendar IDs, use the `calendarList.list` method. Must be provided in snake_case format.",
        },
        description: {
          type: "string",
          description: "New description for the event; can include HTML.",
        },
        send_updates: {
          type: "string",
          description: "Whether to send update notifications to attendees. Uses default user behavior if unspecified. Set explicitly to avoid unintended notifications when removing attendees or making bulk updates.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
        transparency: {
          type: "string",
          description: "Whether the event blocks time on the calendar. 'opaque' (default) blocks time, 'transparent' does not.",
          enum: [
            "opaque",
            "transparent",
          ],
        },
        max_attendees: {
          type: "integer",
          description: "Maximum attendees in response; does not affect invited count. If more, response includes organizer only. Must be positive.",
        },
        rsvp_response: {
          type: "string",
          description: "RSVP response status for the authenticated user. Updates only the current user's response status without affecting other attendees. Note: RSVP is only supported for regular calendar events (eventType='default'); attempting to RSVP to focusTime, outOfOffice, birthday, or workingLocation events will result in an error.",
          enum: [
            "needsAction",
            "declined",
            "tentative",
            "accepted",
          ],
        },
        conference_data: {
          type: "object",
          additionalProperties: true,
          properties: {
            createRequest: {
              type: "object",
              additionalProperties: true,
              properties: {
                requestId: {
                  type: "string",
                  description: "Unique client-generated request ID",
                },
                conferenceSolutionKey: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    type: {
                      type: "string",
                      description: "Conference solution type (e.g., hangoutsMeet)",
                    },
                  },
                  description: "Input model for conference solution key.",
                },
              },
              description: "Input model for conference create request.",
            },
          },
          description: "Input model for conference data.",
        },
        attendees_omitted: {
          type: "boolean",
          description: "Whether attendees may have been omitted from the event's representation.",
        },
        guests_can_modify: {
          type: "boolean",
          description: "Whether attendees other than the organizer can modify the event (default: false).",
        },
        anyone_can_add_self: {
          type: "boolean",
          description: "Whether anyone can invite themselves to the event (default: false).",
        },
        extended_properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            shared: {
              type: "object",
              additionalProperties: true,
              description: "Shared key-value properties",
            },
            private: {
              type: "object",
              additionalProperties: true,
              description: "Private key-value properties",
            },
          },
          description: "Input model for extended properties.",
        },
        supports_attachments: {
          type: "boolean",
          description: "Client application supports event attachments. Set to `True` if so.",
        },
        focus_time_properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            chatStatus: {
              type: "string",
              description: "Chat status during focus time",
              enum: [
                "available",
                "doNotDisturb",
              ],
            },
            declineMessage: {
              type: "string",
              description: "Message for declined invitations",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto-decline mode for conflicting invitations",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Input model for focus time properties.",
        },
        conference_data_version: {
          type: "integer",
          description: "API client's conference data support version. Set to 1 to manage conference details (e.g., Google Meet links); 0 (default) ignores conference data. Setting to 1 enables reading/preserving conference data but does not generate a new Meet link — use GOOGLECALENDAR_UPDATE_EVENT with `create_meeting_room=true` to create one.",
        },
        guests_can_invite_others: {
          type: "boolean",
          description: "Whether attendees other than the organizer can invite others (default: true).",
        },
        out_of_office_properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            declineMessage: {
              type: "string",
              description: "Message for declined invitations",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto-decline mode for conflicting invitations",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Input model for out-of-office properties.",
        },
        guests_can_see_other_guests: {
          type: "boolean",
          description: "Whether attendees can see who the event's attendees are (default: true).",
        },
        working_location_properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of working location",
              enum: [
                "homeOffice",
                "officeLocation",
                "customLocation",
              ],
            },
            homeOffice: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Label for the location",
                },
              },
              description: "Input model for home office location.",
            },
            customLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Label for the location",
                },
              },
              description: "Input model for custom location.",
            },
            officeLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Label for the location",
                },
                deskId: {
                  type: "string",
                  description: "Desk ID",
                },
                floorId: {
                  type: "string",
                  description: "Floor ID",
                },
                buildingId: {
                  type: "string",
                  description: "Building ID",
                },
                floorSectionId: {
                  type: "string",
                  description: "Floor section ID",
                },
              },
              description: "Input model for office location.",
            },
          },
          description: "Input model for working location properties.",
        },
      },
      required: [
        "calendar_id",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_quick_add",
    description: "Parses natural language text to quickly create a basic Google Calendar event with its title, date, and time, suitable for simple scheduling; does not support direct attendee addition or recurring events, and `calendar_id` must be valid if not 'primary'.",
    toolSlug: "GOOGLECALENDAR_QUICK_ADD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        text: {
          type: "string",
          description: "Natural language input describing the event; Google Calendar parses this for event details like title, date, and time.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the calendar for the event. Use 'primary' for the main calendar, or provide a specific calendar ID (e.g., email address).",
        },
        send_updates: {
          type: "string",
          description: "Controls whether email notifications about the event creation are sent to attendees.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "quick_operations",
      "mcpignore",
    ],
    askBefore: [
      "Confirm the parameters before executing Quick Add Event.",
    ],
  }),
  composioTool({
    name: "googlecalendar_remove_attendee",
    description: "Removes an attendee from a specified event in a Google Calendar; the calendar and event must exist. Concurrent calls on the same event can overwrite attendee lists — apply changes sequentially per event.",
    toolSlug: "GOOGLECALENDAR_REMOVE_ATTENDEE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        event_id: {
          type: "string",
          description: "Unique identifier of the event. For recurring events, target the master series ID or a specific instance ID; removing an attendee from one instance does not affect other instances in the series.",
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar to which the event belongs; 'primary' signifies the user's main calendar.",
        },
        attendee_email: {
          type: "string",
          description: "Email address of the attendee to remove. Must match an attendee email present on the event. If no match is found, the attendee was already removed or was never on the event.",
        },
      },
      required: [
        "event_id",
        "attendee_email",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove attendee from event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_settings_get",
    description: "Tool to return a single user setting for the authenticated user. Use when you need to retrieve a specific calendar setting value.",
    toolSlug: "GOOGLECALENDAR_SETTINGS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        setting: {
          type: "string",
          description: "The identifier of the user setting to retrieve. Valid values include: autoAddHangouts, dateFieldOrder, defaultEventLength, format24HourTime, hideInvitations, hideWeekends, locale, remindOnRespondedEventsOnly, showDeclinedEvents, timezone, useKeyboardShortcuts, weekStart",
        },
      },
      required: [
        "setting",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "configuration",
    ],
  }),
  composioTool({
    name: "googlecalendar_settings_list",
    description: "Returns all user settings for the authenticated user. Results include multiple settings keyed by id (e.g., `timeZone`); locate a specific setting by its `id` field. `timeZone` values are IANA identifiers (e.g., `America/New_York`) — use directly in datetime and event logic; align with `timeZone` from GOOGLECALENDAR_GET_CALENDAR for consistent notification times.",
    toolSlug: "GOOGLECALENDAR_SETTINGS_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        pageToken: {
          type: "string",
          description: "Token specifying which result page to return.",
        },
        syncToken: {
          type: "string",
          description: "Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken.",
        },
        maxResults: {
          type: "integer",
          description: "Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries.",
        },
      },
    },
    tags: [
      "composio",
      "google-calendar",
      "read",
      "settings_and_configuration",
    ],
  }),
  composioTool({
    name: "googlecalendar_settings_watch",
    description: "Watch for changes to Settings resources.",
    toolSlug: "GOOGLECALENDAR_SETTINGS_WATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A UUID or similar unique string that identifies this channel.",
        },
        type: {
          type: "string",
          description: "The type of delivery mechanism used for this channel. Must be \"web_hook\".",
        },
        token: {
          type: "string",
          description: "An arbitrary string delivered to the target address with each notification delivered over this channel.",
        },
        params: {
          type: "object",
          additionalProperties: true,
          properties: {
            ttl: {
              type: "string",
              description: "The time-to-live in seconds for the notification channel. Default is 604800 seconds.",
            },
          },
          description: "Additional parameters controlling delivery channel behavior.",
        },
        address: {
          type: "string",
          description: "The address where notifications are delivered for this channel.",
        },
        expiration: {
          type: "integer",
          description: "Unix timestamp in milliseconds specifying when the API should stop sending notifications for this channel.",
        },
      },
      required: [
        "id",
        "type",
        "address",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "notifications_and_watching",
    ],
    askBefore: [
      "Confirm the parameters before executing Watch Settings.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecalendar_update_event",
    description: "Updates an existing event in Google Calendar. REQUIRES event_id - you MUST first search for the event using GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to obtain the event_id. This is a full PUT replacement: omitted fields (including attendees, reminders, recurrence, conferencing) are cleared. Always provide the complete desired event state. Use GOOGLECALENDAR_PATCH_EVENT instead for partial edits.",
    toolSlug: "GOOGLECALENDAR_UPDATE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        summary: {
          type: "string",
          description: "Summary (title) of the event.",
        },
        event_id: {
          type: "string",
          description: "REQUIRED. The unique identifier of the event to update. This parameter is MANDATORY - events cannot be updated by title, date, or other criteria. You MUST first retrieve the event_id by using GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to search for the event, then use the returned 'id' field here.",
        },
        location: {
          type: "string",
          description: "Geographic location of the event as free-form text.",
        },
        timezone: {
          type: "string",
          description: "IANA timezone name from the timezone database (e.g., 'America/New_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names.",
        },
        attendees: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of attendees. Each attendee can be either: (1) A string email address (e.g., 'user@example.com'), or (2) An object with 'email' (required), 'optional' (boolean, default false), 'displayName' (string), 'comment' (string), 'additionalGuests' (integer), and 'resource' (boolean). To mark an attendee as optional (not required), use object format: {'email': 'user@example.com', 'optional': true}. IMPORTANT: Only valid email addresses are accepted. Plain names cannot be used.",
        },
        eventType: {
          type: "string",
          description: "Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API.",
          enum: [
            "birthday",
            "default",
            "focusTime",
            "outOfOffice",
            "workingLocation",
          ],
        },
        recurrence: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring.",
        },
        visibility: {
          type: "string",
          description: "Event visibility: 'default', 'public', 'private', or 'confidential'.",
          enum: [
            "default",
            "public",
            "private",
            "confidential",
          ],
        },
        calendar_id: {
          type: "string",
          description: "Identifier of the Google Calendar where the event resides. The value 'primary' targets the user's primary calendar.",
        },
        description: {
          type: "string",
          description: "Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type.",
        },
        end_datetime: {
          type: "string",
          description: "Event end time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. When provided, this parameter takes precedence over event_duration_hour and event_duration_minutes. If not provided, the end time is calculated using start_datetime + duration. Must be after start_datetime. Fractional seconds and timezone info will be automatically stripped if provided. Examples: '2025-01-16T14:30:00', '2025-01-16T14:30'.",
        },
        send_updates: {
          type: "string",
          description: "Options for who should receive notifications about event changes.",
          enum: [
            "all",
            "externalOnly",
            "none",
          ],
        },
        transparency: {
          type: "string",
          description: "'opaque' (busy) or 'transparent' (available).",
          enum: [
            "opaque",
            "transparent",
          ],
        },
        start_datetime: {
          type: "string",
          description: "REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'.",
        },
        guestsCanModify: {
          type: "boolean",
          description: "If True, guests can modify the event.",
        },
        birthdayProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of birthday event: 'birthday', 'anniversary', or 'other'. Defaults to 'birthday'.",
              enum: [
                "birthday",
                "anniversary",
                "other",
              ],
            },
            contact: {
              type: "string",
              description: "Contact ID in format 'people/c12345' from Google People API. REQUIRED when type is 'anniversary' or 'other'. MUST BE OMITTED when type is 'birthday' (the API forbids contact field for type='birthday').",
            },
            customTypeName: {
              type: "string",
              description: "Custom type name when type is 'other'. Requires valid contact field.",
            },
          },
          description: "Properties for birthday events.",
        },
        create_meeting_room: {
          type: "boolean",
          description: "Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations.",
        },
        event_duration_hour: {
          type: "integer",
          description: "Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event_duration_minutes instead. Ignored if end_datetime is provided.",
        },
        extended_properties: {
          type: "object",
          additionalProperties: true,
          description: "Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}}",
        },
        focusTimeProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            chatStatus: {
              type: "string",
              description: "Chat status during focus time: 'active' or 'doNotDisturb'.",
              enum: [
                "active",
                "doNotDisturb",
              ],
            },
            declineMessage: {
              type: "string",
              description: "Message to include in declined meeting invitations. Only used when autoDeclineMode is set.",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto decline mode: 'declineNone' (no invitations declined), 'declineAllConflictingInvitations' (all conflicting invitations declined), or 'declineOnlyNewConflictingInvitations' (only new conflicting invitations declined).",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled.",
        },
        guestsCanInviteOthers: {
          type: "boolean",
          description: "Whether attendees other than the organizer can invite others to the event.",
        },
        outOfOfficeProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            declineMessage: {
              type: "string",
              description: "Message to include in declined meeting invitations. Only used when autoDeclineMode is set.",
            },
            autoDeclineMode: {
              type: "string",
              description: "Auto decline mode: 'declineNone' (no invitations declined), 'declineAllConflictingInvitations' (all conflicting invitations declined), or 'declineOnlyNewConflictingInvitations' (only new conflicting invitations declined). RECURRING EVENT RESTRICTION: For recurring out-of-office events, ONLY 'declineOnlyNewConflictingInvitations' is allowed. Cannot use 'declineAllConflictingInvitations' for recurring OOO (Google Calendar prevents retroactively declining existing meetings). REQUIRES Google Workspace (paid business subscription, e.g., Business Starter at $6/user/month). Personal Gmail accounts cannot use this feature.",
              enum: [
                "declineNone",
                "declineAllConflictingInvitations",
                "declineOnlyNewConflictingInvitations",
              ],
            },
          },
          description: "Properties for outOfOffice events.",
        },
        event_duration_minutes: {
          type: "integer",
          description: "Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event_duration_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. Ignored if end_datetime is provided.",
        },
        guestsCanSeeOtherGuests: {
          type: "boolean",
          description: "Whether attendees other than the organizer can see who the event's attendees are.",
        },
        workingLocationProperties: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of working location ('homeOffice' | 'officeLocation' | 'customLocation').",
              enum: [
                "homeOffice",
                "officeLocation",
                "customLocation",
              ],
            },
            homeOffice: {
              type: "object",
              additionalProperties: true,
              properties: {},
              description: "Empty object marker for home office working location.\n\nThis is used to indicate the user is working from home.\nGoogle Calendar API accepts an empty object for this field.",
            },
            customLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Label for a custom working location (e.g., 'Client site').",
                },
              },
              description: "Custom working location with a display label.",
            },
            officeLocation: {
              type: "object",
              additionalProperties: true,
              properties: {
                label: {
                  type: "string",
                  description: "Office name displayed in Calendar clients (e.g., building name).",
                },
                deskId: {
                  type: "string",
                  description: "Optional desk identifier.",
                },
                floorId: {
                  type: "string",
                  description: "Optional floor identifier.",
                },
                buildingId: {
                  type: "string",
                  description: "Optional building identifier from org Resources.",
                },
                floorSectionId: {
                  type: "string",
                  description: "Optional floor section identifier.",
                },
              },
              description: "Office-based working location details.",
            },
          },
          description: "Properties for workingLocation events. REQUIRES Google Workspace Enterprise.\n\nConstraints discovered from testing:\n- Must set transparency='transparent' and visibility='public'\n- Description must be omitted\n- Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation'",
        },
      },
      required: [
        "start_datetime",
        "event_id",
      ],
    },
    tags: [
      "composio",
      "google-calendar",
      "write",
      "events_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Google event.",
    ],
    idempotent: true,
  }),
];
