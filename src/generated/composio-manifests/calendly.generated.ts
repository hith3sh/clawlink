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
    integration: "calendly",
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
      toolkit: "calendly",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const calendlyComposioTools: IntegrationTool[] = [
  composioTool({
    name: "calendly_cancel_scheduled_event",
    description: "Tool to cancel a scheduled Calendly event by creating a cancellation record. Use when you need to permanently cancel an existing, active event. The cancellation will trigger notifications to all invitees.",
    toolSlug: "CALENDLY_CANCEL_SCHEDULED_EVENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        reason: {
          type: "string",
          description: "Optional text explanation for why the event is being canceled. This reason will be included in the cancellation notification sent to invitees.",
        },
        event_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the scheduled event to cancel. This can be extracted from the scheduled_events URI or event details.",
        },
      },
      required: [
        "event_uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "scheduled_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel scheduled event.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "calendly_create_event_type",
    description: "Tool to create a new one-on-one event type (kind: solo) in Calendly. Use when you need to programmatically create a new event type for scheduling meetings.",
    toolSlug: "CALENDLY_CREATE_EVENT_TYPE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The event type name that will be displayed to invitees",
        },
        color: {
          type: "string",
          description: "Hexadecimal color value for the scheduling page. Must match pattern ^#[a-f\\d]{6}$ (e.g., '#fff200')",
        },
        owner: {
          type: "string",
          description: "The owner URI for this event type (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA'). Must be a valid user URI.",
        },
        active: {
          type: "boolean",
          description: "Indicates if the event type is active and available for booking. Defaults to false if not provided.",
        },
        locale: {
          type: "string",
          description: "Locale for the event type's scheduling page language",
          enum: [
            "de",
            "en",
            "es",
            "fr",
            "it",
            "nl",
            "pt",
            "uk",
          ],
        },
        duration: {
          type: "integer",
          description: "Length of sessions in minutes. Must be between 1 and 720 minutes. Should be one of the duration_options if both are provided.",
        },
        locations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              kind: {
                type: "string",
                description: "Type of location for the event. Common values: 'zoom_conference', 'google_meet', 'microsoft_teams', 'physical', 'ask_invitee', 'outbound_call', 'inbound_call', 'custom'",
              },
              location: {
                type: "string",
                description: "Location address or details. Required when kind is 'physical' or 'custom'.",
              },
              phone_number: {
                type: "string",
                description: "Phone number for phone call locations (required when kind is 'outbound_call' or 'inbound_call')",
              },
              additional_info: {
                type: "string",
                description: "Additional location information or instructions for invitees",
              },
            },
            description: "Location configuration for the event type.",
          },
          description: "Configuration information for each possible location where the event can take place",
        },
        description: {
          type: "string",
          description: "The event type description that will be shown on the scheduling page",
        },
        duration_options: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Alternative duration choices for flexible meetings. Maximum 4 unique values allowed. Each must be between 1 and 720 minutes.",
        },
      },
      required: [
        "owner",
        "name",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "event_types",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Event Type.",
    ],
  }),
  composioTool({
    name: "calendly_create_one_off_event_type",
    description: "Creates a temporary Calendly one-off event type for unique meetings outside regular availability, requiring valid host/co-host URIs, a future date/range for `date_setting`, and a positive `duration`.",
    toolSlug: "CALENDLY_CREATE_ONE_OFF_EVENT_TYPE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        host: {
          type: "string",
          description: "The URI of the user who will be the host of the one-off event (e.g., 'https://api.calendly.com/users/xxx')",
        },
        name: {
          type: "string",
          description: "Name of the one-off event type",
        },
        duration: {
          type: "integer",
          description: "Duration of the event in minutes. Note: Pass this as 'duration', not 'duration_minutes'.",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            kind: {
              type: "string",
              description: "Type of location for the event. Determines how the meeting will be conducted.",
              enum: [
                "ask_invitee",
                "custom",
                "google_conference",
                "gotomeeting_conference",
                "inbound_call",
                "microsoft_teams_conference",
                "outbound_call",
                "physical",
                "webex_conference",
                "zoom_conference",
              ],
            },
            location: {
              type: "string",
              description: "Location string required when kind is 'custom'. Must be a non-empty string.",
            },
            connected: {
              type: "boolean",
              description: "Whether the location service is connected to the host's account. Required for conference-type locations like Zoom, Google Meet, etc.",
            },
          },
          description: "Location configuration for the event.",
        },
        timezone: {
          type: "string",
          description: "IANA timezone identifier for the event scheduling. Determines how times are interpreted and displayed to invitees.",
        },
        date_setting: {
          type: "string",
          description: "Date & time availability for this one-off event. Must be an object with a `type` key equal to ONE of: `'date_range'`, `'days_in_future'`, or `'spots'`.\n• `date_range` → include `start_date` & `end_date` (YYYY-MM-DD).\n• `days_in_future` → include `days` (int) and `only_weekdays` (bool).\n• `spots` → include `spots` – list of objects with `start_time` and `end_time` (ISO 8601 datetime strings).\nDo NOT use values like `'available_moving'` – that pertains to Shares, not one-off events.",
        },
      },
      required: [
        "name",
        "host",
        "duration",
        "date_setting",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "event_types",
    ],
    askBefore: [
      "Confirm the parameters before executing Create One-Off Event Type.",
    ],
  }),
  composioTool({
    name: "calendly_create_scheduling_link",
    description: "Create a single-use scheduling link. Creates a scheduling link that can be used to book an event. The link allows invitees to schedule up to the specified maximum number of events. Once the limit is reached, the link becomes inactive.",
    toolSlug: "CALENDLY_CREATE_SCHEDULING_LINK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        owner: {
          type: "string",
          description: "Event type URI (e.g., 'https://api.calendly.com/event_types/...')",
        },
        owner_type: {
          type: "string",
          description: "Type of owner, typically 'EventType'",
        },
        max_event_count: {
          type: "integer",
          description: "The max number of events that can be scheduled using this scheduling link. Must be exactly 1 for single-use scheduling links.",
        },
      },
      required: [
        "owner",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "scheduling_links",
    ],
    askBefore: [
      "Confirm the parameters before executing Create scheduling link.",
    ],
  }),
  composioTool({
    name: "calendly_create_share",
    description: "Creates a customizable, one-time share link for a Calendly event type, allowing specific overrides to its settings (e.g., duration, availability, location) without altering the original event type.",
    toolSlug: "CALENDLY_CREATE_SHARE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Custom name for the shared link; defaults to event type name if unspecified.",
        },
        duration: {
          type: "integer",
          description: "Custom event duration in minutes, overriding event type default.",
        },
        end_date: {
          type: "string",
          description: "End date (YYYY-MM-DD) for shared link availability; required if `period_type` is 'fixed'.",
        },
        event_type: {
          type: "string",
          description: "URI of the event type to base this share on.",
        },
        start_date: {
          type: "string",
          description: "Start date (YYYY-MM-DD) for shared link availability; required if `period_type` is 'fixed'.",
        },
        period_type: {
          type: "string",
          description: "Availability period type: 'available_moving' (shows actual available slots for `max_booking_time` days), 'moving' (available for `max_booking_time` days), 'fixed' (within `start_date`/`end_date`), 'unlimited'.",
          enum: [
            "available_moving",
            "moving",
            "fixed",
            "unlimited",
          ],
        },
        hide_location: {
          type: "boolean",
          description: "If true, hides event location until booking (only if event type has a single custom location).",
        },
        duration_options: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Alternative selectable durations in minutes, overriding event type options.",
        },
        max_booking_time: {
          type: "integer",
          description: "Max days in advance an invitee can book; required if `period_type` is 'moving' or 'available_moving'.",
        },
        location_configurations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              kind: {
                type: "string",
                description: "Type of location. Common values include 'physical', 'zoom_conference', 'google_conference', 'microsoft_teams_conference', 'custom', 'ask_invitee'.",
              },
              location: {
                type: "string",
                description: "Specific location details like address, phone number, or meeting room",
              },
              additional_info: {
                type: "string",
                description: "Additional information about the location, such as instructions or details",
              },
            },
            description: "Location override configuration for the shared event.",
          },
          description: "Custom location settings that override the event type's default locations. Each configuration specifies a location type and associated details.",
        },
        availability__rule__rules: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              type: {
                type: "string",
                description: "Rule type – must be the literal string `'wday'`",
              },
              wday: {
                type: "string",
                description: "Day of the week (field name **'wday'**, not 'weekday').",
                enum: [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ],
              },
              intervals: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "string",
                      description: "**Key must be exactly 'to'** – end time in 24-hour HH:MM format.",
                    },
                    from: {
                      type: "string",
                      description: "**Key must be exactly 'from'** – start time in 24-hour HH:MM format.",
                    },
                  },
                  description: "Time interval specification for availability windows.",
                },
                description: "List of time intervals when the host is available on this weekday. Empty list means unavailable all day.",
              },
            },
            description: "Custom availability rule for specific weekdays and time intervals.",
          },
          description: "List of custom availability rules that override the event type's default schedule. Provide an array of objects EACH containing: `type`=`'wday'`, `wday` (weekday), and `intervals` (list of `{from, to}` times). Field names are case-sensitive – use **`wday`, `from`, `to`** exactly. Must be combined with `availability_rule_timezone`.",
        },
        availability__rule__timezone: {
          type: "string",
          description: "IANA timezone (e.g., 'America/New_York') for custom availability rules. Required with `availability_rule_rules`.",
        },
      },
      required: [
        "event_type",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "shares",
    ],
    askBefore: [
      "Confirm the parameters before executing Create share.",
    ],
  }),
  composioTool({
    name: "calendly_create_single_use_scheduling_link",
    description: "Creates a one-time, single-use scheduling link for an active Calendly event type, expiring after one booking.",
    toolSlug: "CALENDLY_CREATE_SINGLE_USE_SCHEDULING_LINK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        owner: {
          type: "string",
          description: "The URI of the Calendly Event Type that will own this single-use scheduling link. This Event Type's settings (e.g., duration, availability) will apply to the scheduled meeting.",
        },
        owner_type: {
          type: "string",
          description: "Identifies the owner resource type, which is 'EventType'.",
          enum: [
            "EventType",
          ],
        },
        max_event_count: {
          type: "integer",
          description: "The maximum number of events that can be scheduled using this link. For a single-use link, this value must be 1.",
        },
      },
      required: [
        "max_event_count",
        "owner",
        "owner_type",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "scheduling_links",
    ],
    askBefore: [
      "Confirm the parameters before executing Create single use scheduling link.",
    ],
  }),
  composioTool({
    name: "calendly_create_webhooks",
    description: "Tool to create a webhook subscription for receiving Calendly event notifications. Use when you need to set up automated notifications for events like meeting bookings or cancellations. Organization scope triggers webhooks for all events organization-wide, while user/group scopes limit triggering to specific users or groups.",
    toolSlug: "CALENDLY_CREATE_WEBHOOKS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "The publicly accessible HTTPS callback URL where webhook events will be sent via POST requests. Must be active and able to receive POST requests.",
        },
        user: {
          type: "string",
          description: "URI reference to the user for user-scoped webhooks (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA'). Required when scope is 'user', otherwise omit.",
        },
        group: {
          type: "string",
          description: "URI reference to the group for group-scoped webhooks (e.g., 'https://api.calendly.com/groups/AAAAAAAAAAAAAAAA'). Required when scope is 'group', otherwise omit.",
        },
        scope: {
          type: "string",
          description: "Subscription scope determining which events trigger the webhook. 'organization' triggers for all events in the organization, 'user' triggers only for a specific user's events, 'group' triggers only for a specific group's events.",
          enum: [
            "organization",
            "user",
            "group",
          ],
        },
        events: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of event types to subscribe to. Valid values: 'invitee.created', 'invitee.canceled', 'invitee_no_show.created', 'invitee_no_show.deleted', 'routing_form_submission.created', 'event_type.created', 'event_type.deleted', 'event_type.updated'. At least one event must be specified.",
        },
        signing_key: {
          type: "string",
          description: "Optional secret key (6-24 characters) used to generate signatures for webhook security validation. Helps verify that webhook POST requests are genuinely from Calendly.",
        },
        organization: {
          type: "string",
          description: "URI reference to the organization that owns this webhook subscription (e.g., 'https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA'). Required for all webhook subscriptions.",
        },
      },
      required: [
        "url",
        "events",
        "organization",
        "scope",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create webhook subscription.",
    ],
  }),
  composioTool({
    name: "calendly_delete_invitee_data",
    description: "Permanently removes all invitee data associated with the provided emails from past organization events, for data privacy compliance (requires Enterprise subscription; deletion may take up to one week).",
    toolSlug: "CALENDLY_DELETE_INVITEE_DATA",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Invitee email addresses for whom all associated data will be permanently removed.",
        },
      },
      required: [
        "emails",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "data_compliance",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete invitee data.",
    ],
  }),
  composioTool({
    name: "calendly_delete_invitee_no_show",
    description: "Deletes an Invitee No-Show record by its `uuid` to reverse an invitee's 'no-show' status; the `uuid` must refer to an existing record.",
    toolSlug: "CALENDLY_DELETE_INVITEE_NO_SHOW",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the Invitee No-Show record to be removed.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "scheduled_events",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete invitee no show.",
    ],
  }),
  composioTool({
    name: "calendly_delete_organization_membership",
    description: "Tool to remove a user from a Calendly organization by membership UUID. Use when you need to revoke a user's access to an organization. Requires admin rights; organization owners cannot be removed.",
    toolSlug: "CALENDLY_DELETE_ORGANIZATION_MEMBERSHIP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier of the organization membership to be removed. This is the membership UUID, not the user UUID.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "organization_and_team",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete organization membership.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "calendly_delete_scheduled_event_data",
    description: "For Enterprise users, initiates deletion of an organization's scheduled event data between a `start_time` and `end_time` (inclusive, where `start_time` must be <= `end_time`); actual data deletion may take up to 7 days to complete.",
    toolSlug: "CALENDLY_DELETE_SCHEDULED_EVENT_DATA",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_time: {
          type: "string",
          description: "Defines the end of the data deletion period (UTC). Events ending at or before this time will be included. Must be within the past 24 months.",
        },
        start_time: {
          type: "string",
          description: "Defines the start of the data deletion period (UTC). Events starting at or after this time will be included. Must be within the past 24 months.",
        },
      },
      required: [
        "end_time",
        "start_time",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "data_compliance",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete scheduled event data.",
    ],
  }),
  composioTool({
    name: "calendly_delete_webhook_subscription",
    description: "Deletes an existing webhook subscription to stop Calendly sending event notifications to its registered callback URL; this operation is idempotent.",
    toolSlug: "CALENDLY_DELETE_WEBHOOK_SUBSCRIPTION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        webhook_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the webhook subscription to be deleted.",
        },
      },
      required: [
        "webhook_uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "webhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete webhook subscription.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "calendly_get_event",
    description: "Use to retrieve a specific Calendly scheduled event by its UUID, provided the event exists in the user's Calendly account.",
    toolSlug: "CALENDLY_GET_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the Calendly event.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "scheduled_events",
    ],
  }),
  composioTool({
    name: "calendly_get_event_invitee",
    description: "Retrieves detailed information about a specific invitee of a scheduled event, using their unique UUIDs.",
    toolSlug: "CALENDLY_GET_EVENT_INVITEE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        event_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the scheduled event.",
        },
        invitee_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the invitee for the specified event.",
        },
      },
      required: [
        "event_uuid",
        "invitee_uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "scheduled_events",
    ],
  }),
  composioTool({
    name: "calendly_get_event_type",
    description: "Retrieves details for a specific Calendly event type, identified by its UUID, which must be valid and correspond to an existing event type.",
    toolSlug: "CALENDLY_GET_EVENT_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) for the event type. This is a required path parameter - extract the UUID from the event type URI (e.g., for 'https://api.calendly.com/event_types/abc123', use 'abc123').",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "event_types",
    ],
  }),
  composioTool({
    name: "calendly_get_event_type_availability",
    description: "Tool to retrieve availability schedules configured for a specific Calendly event type. Use when you need to get the availability rules including day-of-week schedules and date-specific overrides.",
    toolSlug: "CALENDLY_GET_EVENT_TYPE_AVAILABILITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "URI of the user associated with the event type. Optional parameter to filter by user.",
        },
        event_type: {
          type: "string",
          description: "URI of the event type whose availability schedules are to be listed. Must be a valid Calendly event type URI. Retrieve this URI from CALENDLY_LIST_EVENT_TYPES; using a URI not owned by the authenticated user returns a 403 error.",
        },
      },
      required: [
        "event_type",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "event_types",
    ],
  }),
  composioTool({
    name: "calendly_get_group",
    description: "Retrieves all attributes of a specific Calendly group by its UUID; the group must exist.",
    toolSlug: "CALENDLY_GET_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the Calendly group.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "calendly_get_group_relationship",
    description: "Retrieves a specific Calendly group relationship by its valid and existing UUID, providing details on user-group associations and membership.",
    toolSlug: "CALENDLY_GET_GROUP_RELATIONSHIP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the group relationship to be retrieved.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "calendly_get_invitee_no_show",
    description: "Retrieves details for a specific Invitee No Show record by its UUID; an Invitee No Show is marked when an invitee does not attend a scheduled event.",
    toolSlug: "CALENDLY_GET_INVITEE_NO_SHOW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the Invitee No Show record to retrieve.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "scheduled_events",
    ],
  }),
  composioTool({
    name: "calendly_get_organization",
    description: "Tool to retrieve information about a specific Calendly organization. Use when you need to get organization details such as name, slug, or timestamps.",
    toolSlug: "CALENDLY_GET_ORGANIZATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the organization to retrieve. This is the alphanumeric string at the end of the organization URI.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organization_and_team",
    ],
  }),
  composioTool({
    name: "calendly_get_organization_invitation",
    description: "Retrieves a specific Calendly organization invitation using its UUID and the parent organization's UUID.",
    toolSlug: "CALENDLY_GET_ORGANIZATION_INVITATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the specific organization invitation to retrieve.",
        },
        org_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the Calendly organization to which the invitation belongs.",
        },
      },
      required: [
        "org_uuid",
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "calendly_get_organization_membership",
    description: "Retrieves a specific Calendly organization membership by its UUID, returning all its attributes.",
    toolSlug: "CALENDLY_GET_ORGANIZATION_MEMBERSHIP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the organization membership to retrieve.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "calendly_get_routing_form",
    description: "Retrieves a specific routing form by its UUID, providing its configuration details including questions and routing logic.",
    toolSlug: "CALENDLY_GET_ROUTING_FORM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the routing form to retrieve.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "routing_forms",
    ],
  }),
  composioTool({
    name: "calendly_get_routing_form_submission",
    description: "Tool to retrieve details about a specific routing form submission by its UUID. Use when you need submission details including questions, answers, and routing results.",
    toolSlug: "CALENDLY_GET_ROUTING_FORM_SUBMISSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the routing form submission to retrieve. Extract from submission URI or webhook payload.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "invitees_and_communications",
    ],
  }),
  composioTool({
    name: "calendly_get_sample_webhook_data",
    description: "Tool to retrieve sample webhook payload data for testing webhook subscriptions. Use when you need to verify webhook setup and understand the data structure before creating actual webhook subscriptions.",
    toolSlug: "CALENDLY_GET_SAMPLE_WEBHOOK_DATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "The URI of the user to retrieve sample webhook data for. Required when scope is 'user', optional when scope is 'organization'. Format: https://api.calendly.com/users/{user_uuid}",
        },
        event: {
          type: "string",
          description: "The webhook event type to retrieve sample data for. Valid values: 'invitee.created', 'invitee.canceled', 'routing_form_submission.created'",
          enum: [
            "invitee.created",
            "invitee.canceled",
            "routing_form_submission.created",
          ],
        },
        scope: {
          type: "string",
          description: "The scope level for the webhook data. Valid values: 'user' or 'organization'. Note: routing_form_submission.created events require 'organization' scope.",
          enum: [
            "user",
            "organization",
          ],
        },
        organization: {
          type: "string",
          description: "The URI of the organization to retrieve sample webhook data for. This parameter is always required. Format: https://api.calendly.com/organizations/{organization_uuid}",
        },
      },
      required: [
        "event",
        "scope",
        "organization",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "calendly_get_user",
    description: "Retrieves comprehensive details for an existing Calendly user.",
    toolSlug: "CALENDLY_GET_USER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the user. Alternatively, use the literal string \"me\" to refer to the currently authenticated user (the caller). Defaults to \"me\" (current user) if not specified.",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "users",
    ],
  }),
  composioTool({
    name: "calendly_get_user_availability_schedule",
    description: "Retrieves an existing user availability schedule by its UUID; this schedule defines the user's default hours of availability.",
    toolSlug: "CALENDLY_GET_USER_AVAILABILITY_SCHEDULE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the availability schedule.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "availability",
    ],
  }),
  composioTool({
    name: "calendly_get_webhook_subscription",
    description: "Retrieves the details of an existing webhook subscription, identified by its UUID, including its callback URL, subscribed events, scope, and state.",
    toolSlug: "CALENDLY_GET_WEBHOOK_SUBSCRIPTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        webhook_uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the webhook subscription to retrieve.",
        },
      },
      required: [
        "webhook_uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "calendly_invitee_no_show",
    description: "Tool to mark an invitee as a no-show for a scheduled event. Use when an invitee fails to attend their scheduled meeting and you need to record their absence in Calendly.",
    toolSlug: "CALENDLY_INVITEE_NO_SHOW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        invitee: {
          type: "string",
          description: "URI of the Invitee to be marked as a no-show. This must be a valid URI referencing an existing invitee from a scheduled event (e.g., 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA').",
        },
      },
      required: [
        "invitee",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "invitees_and_communications",
    ],
    askBefore: [
      "Confirm the parameters before executing Mark invitee as no-show.",
    ],
  }),
  composioTool({
    name: "calendly_list_activity_log_entries",
    description: "Retrieves a list of activity log entries for a specified Calendly organization (requires an active Enterprise subscription), supporting filtering, sorting, and pagination.",
    toolSlug: "CALENDLY_LIST_ACTIVITY_LOG_ENTRIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action:asc",
              "action:desc",
              "actor.display_name:asc",
              "actor.display_name:desc",
              "actor.uri:asc",
              "actor.uri:desc",
              "namespace:asc",
              "namespace:desc",
              "occurred_at:asc",
              "occurred_at:desc",
            ],
          },
          description: "Specifies the sort order for the results. Provide a list of sort criteria strings, each in the format 'field:direction' (e.g., 'occurred_at:asc'). Valid fields and directions are defined by SortEnm.",
        },
        actor: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filters activity log entries by the users who performed the actions. Provide a list of user URIs.",
        },
        count: {
          type: "integer",
          description: "The maximum number of activity log entries to return per page.",
        },
        action: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filters entries by the specific action performed (e.g., 'user.created', 'event_type.updated'). Provide a list of action strings.",
        },
        namespace: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filters entries by their category or domain (namespace). Provide a list of namespace strings. Common examples include 'user_management' or 'event_type_management'.",
        },
        page_token: {
          type: "string",
          description: "Token for pagination, used to fetch the next page of results if the collection spans multiple pages.",
        },
        search_term: {
          type: "string",
          description: "Filters entries based on the search term. Supported operators: `|` (OR, e.g., `user.created | group.created`), `+` (AND, e.g., `user.created + user.invited`), `\" \"` (exact phrase, e.g., `\"John Doe\"`), `-` (exclude term, e.g., `user.created -admin`), `()` (precedence, e.g., `(user.created | user.invited) + team1`), and `*` (prefix search, e.g., `user.email_address:*@example.com`).",
        },
        organization: {
          type: "string",
          description: "URI of the Calendly organization for which to retrieve activity log entries.",
        },
        max_occurred_at: {
          type: "string",
          description: "Timestamp in ISO 8601 UTC format (e.g., '2020-01-02T03:04:05.678Z'). Filters entries to include only those that occurred at or before this time.",
        },
        min_occurred_at: {
          type: "string",
          description: "Timestamp in ISO 8601 UTC format (e.g., '2020-01-02T03:04:05.678Z'). Filters entries to include only those that occurred at or after this time.",
        },
      },
      required: [
        "organization",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "activity_log",
    ],
  }),
  composioTool({
    name: "calendly_list_event_invitees",
    description: "Retrieves a list of invitees for a specified Calendly event UUID, with options to filter by status or email, and sort by creation time.",
    toolSlug: "CALENDLY_LIST_EVENT_INVITEES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Order results by the `created_at` field; use 'created_at:asc' for ascending or 'created_at:desc' for descending.",
        },
        uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the event for which to list invitees.",
        },
        count: {
          type: "integer",
          description: "The number of invitees to return per page. Default is 20.",
        },
        email: {
          type: "string",
          description: "Filter results by a specific invitee's email address.",
        },
        status: {
          type: "string",
          description: "Filter invitees by their status. Can be 'active' or 'canceled'.",
          enum: [
            "active",
            "canceled",
          ],
        },
        page_token: {
          type: "string",
          description: "A token to retrieve the next or previous page of results in a paginated collection.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "scheduled_events",
    ],
  }),
  composioTool({
    name: "calendly_list_event_type_available_times",
    description: "Fetches available time slots for a Calendly event type within a specified time range; results are not paginated.",
    toolSlug: "CALENDLY_LIST_EVENT_TYPE_AVAILABLE_TIMES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_time: {
          type: "string",
          description: "End datetime (exclusive) of the requested availability range, in UTC ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ'). The duration between start_time and end_time cannot exceed 7 days.",
        },
        event_type: {
          type: "string",
          description: "The URI of the event type for which to find available times. This can be obtained by listing event types or from an event type object.",
        },
        start_time: {
          type: "string",
          description: "Start datetime (inclusive) of the requested availability range, in UTC ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SSZ'). Must be in the future.",
        },
      },
      required: [
        "event_type",
        "start_time",
        "end_time",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "event_types",
    ],
  }),
  composioTool({
    name: "calendly_list_event_type_memberships",
    description: "Tool to retrieve a list of event type hosts (memberships) for a specific event type. Use when you need to see which users are configured as hosts for an event type.",
    toolSlug: "CALENDLY_LIST_EVENT_TYPE_MEMBERSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "Number of results to return per page. Must be a positive integer.",
        },
        event_type: {
          type: "string",
          description: "URI of the event type to retrieve memberships for. Format: 'https://api.calendly.com/event_types/{uuid}'. Pass the complete URI, not just the UUID.",
        },
        page_token: {
          type: "string",
          description: "Pagination token to retrieve a specific page of results. Use the 'next_page_token' from a previous response to get the next page.",
        },
      },
      required: [
        "event_type",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "event_types",
    ],
  }),
  composioTool({
    name: "calendly_list_event_types",
    description: "Tool to list all Event Types associated with a specified User or Organization. Use when you need to retrieve event types for a user or organization. Use scheduling_url from results directly; do not manually construct event type URLs.",
    toolSlug: "CALENDLY_LIST_EVENT_TYPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Order results by field(s) and direction. Accepts comma-separated list of field:direction values (e.g., 'name:asc,created_at:desc'). Default: name:asc",
        },
        user: {
          type: "string",
          description: "URI of the user whose event types to list. Exactly one of 'user' or 'organization' must be provided (mutually exclusive).",
        },
        count: {
          type: "integer",
          description: "Number of results per page.",
        },
        active: {
          type: "boolean",
          description: "Filter by active status. Return only active event types if true, only inactive if false, or all event types if omitted.",
        },
        page_token: {
          type: "string",
          description: "Pagination token for retrieving subsequent pages. Check pagination.next_page_token in the response; if non-null, pass it as page_token in the next call. Repeat until next_page_token is null.",
        },
        organization: {
          type: "string",
          description: "URI of the organization whose event types to list. Exactly one of 'organization' or 'user' must be provided (mutually exclusive).",
        },
        admin_managed: {
          type: "boolean",
          description: "Filter by admin management status. True for admin-managed only, false to exclude admin-managed, or omitted to include all.",
        },
        user_availability_schedule: {
          type: "string",
          description: "URI of the user's availability schedule. Used with 'user' parameter to filter event types by primary availability schedule.",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "event_types",
    ],
  }),
  composioTool({
    name: "calendly_list_group_relationships",
    description: "Retrieves a list of group relationships defining an owner's role (e.g., member, admin) within a group; an owner can have one membership per group but multiple admin roles across different groups.",
    toolSlug: "CALENDLY_LIST_GROUP_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "Number of records per page (max 100).",
        },
        group: {
          type: "string",
          description: "Filter results by group URI.",
        },
        owner: {
          type: "string",
          description: "Filter results by owner URI (Organization Membership or Invitation URI).",
        },
        page_token: {
          type: "string",
          description: "Token for retrieving a specific page of results, obtained from `next_page_token` or `previous_page_token` in a previous response.",
        },
        organization: {
          type: "string",
          description: "Filter results by organization URI.",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "calendly_list_groups",
    description: "Returns a list of groups for a specified Calendly organization URI, supporting pagination.",
    toolSlug: "CALENDLY_LIST_GROUPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The maximum number of groups to return per page. The value can range from 1 to 100.",
        },
        page_token: {
          type: "string",
          description: "A token to retrieve a specific page of results. Pass this value from a previous response's 'next_page_token' to fetch the next set of groups, or 'previous_page_token' for the previous set.",
        },
        organization: {
          type: "string",
          description: "The URI of the organization to filter groups by. For example, 'https://api.calendly.com/organizations/ORGANIZATION_UUID'.",
        },
      },
      required: [
        "organization",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "calendly_list_organization_invitations",
    description: "Retrieves a list of invitations for a specific organization, identified by its UUID.",
    toolSlug: "CALENDLY_LIST_ORGANIZATION_INVITATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Order of results by field(s) and direction (asc/desc); e.g., 'created_at:asc' or 'email:desc,status:asc'.",
        },
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the organization.",
        },
        count: {
          type: "integer",
          description: "Number of results to return per page.",
        },
        email: {
          type: "string",
          description: "Filter by the recipient's email address.",
        },
        status: {
          type: "string",
          description: "Filter by invitation status.",
          enum: [
            "pending",
            "accepted",
            "declined",
          ],
        },
        page_token: {
          type: "string",
          description: "Pagination token to access a specific page of results.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "calendly_list_organization_memberships",
    description: "Retrieves a list of organization memberships.",
    toolSlug: "CALENDLY_LIST_ORGANIZATION_MEMBERSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "Filter memberships by the URI of the user. At least one of 'organization' or 'user' is required.",
        },
        count: {
          type: "integer",
          description: "The number of membership records to return per page. Must be an integer between 1 and 100, inclusive.",
        },
        email: {
          type: "string",
          description: "Filter memberships by the email address of the user. Must be used with 'organization' or 'user'.",
        },
        page_token: {
          type: "string",
          description: "The token to retrieve the next or previous page of results in a paginated collection.",
        },
        organization: {
          type: "string",
          description: "Filter memberships by the URI of the organization. At least one of 'organization' or 'user' is required.",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organizations",
    ],
  }),
  composioTool({
    name: "calendly_list_outgoing_communications",
    description: "Retrieves a list of outgoing SMS communications for a specified organization; requires an Enterprise subscription and if filtering by creation date, both `min_created_at` and `max_created_at` must be provided to form a valid range.",
    toolSlug: "CALENDLY_LIST_OUTGOING_COMMUNICATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return per page. Must be between 1 and 100, inclusive.",
        },
        page_token: {
          type: "string",
          description: "The token to retrieve the next page of results. Provided in the `next_page_token` field of a previous response.",
        },
        organization: {
          type: "string",
          description: "The URI of the organization whose outgoing communications are to be retrieved.",
        },
        max_created_at: {
          type: "string",
          description: "Include outgoing communications that were created before this timestamp. Formatted as \"YYYY-MM-DDTHH:MM:SS.sssZ\" in UTC.",
        },
        min_created_at: {
          type: "string",
          description: "Include outgoing communications that were created after this timestamp. Formatted as \"YYYY-MM-DDTHH:MM:SS.sssZ\" in UTC.",
        },
      },
      required: [
        "organization",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "outgoing_communications",
    ],
  }),
  composioTool({
    name: "calendly_list_routing_forms",
    description: "Retrieves routing forms for a specified organization; routing forms are questionnaires used to direct invitees to appropriate booking pages or external URLs.",
    toolSlug: "CALENDLY_LIST_ROUTING_FORMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Specifies the order of results. Use a comma-separated list of `field:direction` pairs. Supported field: `created_at`. Supported directions: `asc` (ascending), `desc` (descending).",
        },
        count: {
          type: "integer",
          description: "The number of routing forms to return per page.",
        },
        page_token: {
          type: "string",
          description: "Token to retrieve a specific page of results, usually from a previous response's pagination details.",
        },
        organization: {
          type: "string",
          description: "The URI of the organization for which to retrieve routing forms.",
        },
      },
      required: [
        "organization",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "routing_forms",
    ],
  }),
  composioTool({
    name: "calendly_list_scheduled_events",
    description: "Tool to retrieve a list of scheduled Calendly events. Use when you need to view events for a specific user, organization, or group. Requires exactly one of user, organization, or group parameter to scope the query.",
    toolSlug: "CALENDLY_LIST_SCHEDULED_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Order results by the specified field and direction. Format: 'field:direction'. Supported field: 'start_time'. Supported directions: 'asc' (ascending), 'desc' (descending).",
        },
        user: {
          type: "string",
          description: "Full Calendly API URI of the user whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/users/{uuid}'. Shortcuts like 'me' are NOT supported - use CALENDLY_GET_CURRENT_USER to get the user URI first. Exactly ONE of `user`, `organization`, or `group` must be provided to scope the query.",
        },
        count: {
          type: "integer",
          description: "Number of events to return per page. Must be a positive integer.",
        },
        group: {
          type: "string",
          description: "Full Calendly API URI of the group (team) whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/groups/{uuid}'. Exactly ONE of `user`, `organization`, or `group` must be provided to scope the query.",
        },
        status: {
          type: "string",
          description: "Filter events by their status. Can be 'active' for active events or 'canceled' for canceled events.",
          enum: [
            "active",
            "canceled",
          ],
        },
        page_token: {
          type: "string",
          description: "Pagination token to retrieve a specific page of results. Use the 'next_page_token' from a previous response to get the next page.",
        },
        organization: {
          type: "string",
          description: "Full Calendly API URI of the organization whose events you want to list. MUST be a complete URI in the format 'https://api.calendly.com/organizations/{uuid}'. Exactly ONE of `user`, `organization`, or `group` is required. Admin privileges may be required.",
        },
        invitee_email: {
          type: "string",
          description: "Return events that are scheduled with the invitee associated with this email address. This is a filter parameter and must be used together with one of the scope parameters (user, organization, or group).",
        },
        max_start_time: {
          type: "string",
          description: "Include events with start times prior to this time. Must be in UTC format (ISO 8601).",
        },
        min_start_time: {
          type: "string",
          description: "Include events with start times after this time. Must be in UTC format (ISO 8601).",
        },
      },
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "scheduled_events",
    ],
  }),
  composioTool({
    name: "calendly_list_user_availability_schedules",
    description: "Retrieves all availability schedules for the specified Calendly user.",
    toolSlug: "CALENDLY_LIST_USER_AVAILABILITY_SCHEDULES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "URI of the user whose availability schedules are to be listed; must be a valid Calendly user URI.",
        },
      },
      required: [
        "user",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "availability",
    ],
  }),
  composioTool({
    name: "calendly_list_user_busy_times",
    description: "Fetches a user's busy time intervals (internal and external calendar events) in ascending order for a period up to 7 days; keyset pagination is not supported.",
    toolSlug: "CALENDLY_LIST_USER_BUSY_TIMES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "The URI of the user whose busy times are being queried. This is typically the user's Calendly API URI.",
        },
        end_time: {
          type: "string",
          description: "The end of the time range for which to fetch busy times, in RFC3339 format (e.g., '2023-10-26T11:00:00Z'). Must be after start_time.",
        },
        start_time: {
          type: "string",
          description: "The start of the time range for which to fetch busy times, in RFC3339 format (e.g., '2023-10-26T10:00:00Z').",
        },
      },
      required: [
        "user",
        "start_time",
        "end_time",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "availability",
    ],
  }),
  composioTool({
    name: "calendly_list_user_locations",
    description: "Tool to retrieve configured meeting location information for a given Calendly user. Use when you need to see all available location options configured by a user for their meetings.",
    toolSlug: "CALENDLY_LIST_USER_LOCATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "URI of the user whose locations to list. This should be the full Calendly user URI (e.g., 'https://api.calendly.com/users/AAAAAAAAAAAAAAAA').",
        },
      },
      required: [
        "user",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "organization_and_team",
    ],
  }),
  composioTool({
    name: "calendly_list_webhook_subscriptions",
    description: "Retrieves webhook subscriptions for a Calendly organization; `scope` determines if `user` or `group` URI is also required for filtering.",
    toolSlug: "CALENDLY_LIST_WEBHOOK_SUBSCRIPTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Sort order for results (e.g., 'created_at:asc'). Supported fields: `created_at`, `updated_at`. Supported directions: `asc`, `desc`.",
        },
        user: {
          type: "string",
          description: "URI of the Calendly user; required if `scope` is 'user'.",
        },
        count: {
          type: "integer",
          description: "Number of results per page (maximum 100).",
        },
        group: {
          type: "string",
          description: "URI of the Calendly group; required if `scope` is 'group'.",
        },
        scope: {
          type: "string",
          description: "Scope of the webhook subscriptions: 'organization', 'user', or 'group'.",
          enum: [
            "organization",
            "user",
            "group",
          ],
        },
        page_token: {
          type: "string",
          description: "Token for paginating to the next or previous page of results.",
        },
        organization: {
          type: "string",
          description: "URI of the Calendly organization for which to list webhook subscriptions.",
        },
      },
      required: [
        "organization",
        "scope",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "calendly_organization_invitation",
    description: "Tool to invite a user to a Calendly organization via email. Use when you need to send an organization invitation to a new user. Requires organization owner or admin privileges.",
    toolSlug: "CALENDLY_ORGANIZATION_INVITATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "The email address of the user to invite to the organization. An invitation email will be automatically sent to this address.",
        },
        org_uuid: {
          type: "string",
          description: "The unique identifier (UUID) of the organization to invite the user to. This is extracted from the organization URI.",
        },
      },
      required: [
        "org_uuid",
        "email",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "organization_and_team",
    ],
    askBefore: [
      "Confirm the parameters before executing Invite user to organization.",
    ],
  }),
  composioTool({
    name: "calendly_post_invitee",
    description: "Tool to create a new Event Invitee with standard notifications, calendar invites, reschedules, and workflows. Use when programmatically scheduling meetings via API. Requires paid Calendly plan (Standard+).",
    toolSlug: "CALENDLY_POST_INVITEE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        invitee: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Full name of the invitee. Required if first_name is not provided",
            },
            email: {
              type: "string",
              description: "Email address of the invitee",
            },
            timezone: {
              type: "string",
              description: "IANA timezone identifier for the invitee (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')",
            },
            last_name: {
              type: "string",
              description: "Last name of the invitee (optional)",
            },
            first_name: {
              type: "string",
              description: "First name of the invitee. Required if name is not provided",
            },
            text_reminder_number: {
              type: "string",
              description: "Phone number for SMS reminders in E.164 format (e.g., '+14155551234')",
            },
          },
          description: "Details of the invitee being scheduled",
        },
        location: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Type of location (e.g., 'physical', 'inbound_call', 'zoom_conference', 'google_meet')",
            },
            location: {
              type: "string",
              description: "Venue or location description (required for certain location types)",
            },
            phone_number: {
              type: "string",
              description: "Phone number for call-based locations",
            },
            additional_info: {
              type: "string",
              description: "Supplementary location details or instructions",
            },
          },
          description: "Meeting location configuration.",
        },
        tracking: {
          type: "object",
          additionalProperties: true,
          properties: {
            utm_term: {
              type: "string",
              description: "UTM term parameter",
            },
            utm_medium: {
              type: "string",
              description: "UTM medium parameter",
            },
            utm_source: {
              type: "string",
              description: "UTM source parameter",
            },
            utm_content: {
              type: "string",
              description: "UTM content parameter",
            },
            utm_campaign: {
              type: "string",
              description: "UTM campaign parameter",
            },
            salesforce_uuid: {
              type: "string",
              description: "Salesforce UUID for CRM integration",
            },
          },
          description: "UTM and tracking parameters for marketing attribution.",
        },
        event_type: {
          type: "string",
          description: "URI reference to the event type being scheduled (e.g., 'https://api.calendly.com/event_types/AAAAAAAAAAAAAAAA')",
        },
        start_time: {
          type: "string",
          description: "Start time of the scheduled event in ISO 8601 UTC format (e.g., '2025-12-16T10:00:00Z')",
        },
        event_guests: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses for additional invitee guests (max 10)",
        },
        questions_and_answers: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              answer: {
                type: "string",
                description: "The respondent's answer",
              },
              position: {
                type: "integer",
                description: "Question sequence order (0-indexed)",
              },
              question: {
                type: "string",
                description: "The survey question text",
              },
            },
            description: "Custom question and answer pair from the booking form.",
          },
          description: "Custom question responses from the booking form",
        },
      },
      required: [
        "invitee",
        "event_type",
        "start_time",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "invitees_and_communications",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Event Invitee.",
    ],
  }),
  composioTool({
    name: "calendly_remove_user_from_organization",
    description: "Removes a user (who is not an owner) from an organization by their membership UUID, requiring administrative privileges.",
    toolSlug: "CALENDLY_REMOVE_USER_FROM_ORGANIZATION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The UUID of the organization membership to remove. This is the unique identifier from the membership URI (e.g., from 'https://api.calendly.com/organization_memberships/UUID'). Get membership UUIDs by calling list_organization_memberships. Note: Cannot remove organization owners - use this for admin or user roles only.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "organizations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove user from organization.",
    ],
  }),
  composioTool({
    name: "calendly_revoke_user_s_organization_invitation",
    description: "Revokes a pending and revokable (not yet accepted or expired) organization invitation using its UUID and the organization's UUID, rendering the invitation link invalid.",
    toolSlug: "CALENDLY_REVOKE_USER_S_ORGANIZATION_INVITATION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        uuid: {
          type: "string",
          description: "The unique identifier of the organization invitation to be revoked.",
        },
        org_uuid: {
          type: "string",
          description: "The unique identifier of the organization.",
        },
      },
      required: [
        "org_uuid",
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "organizations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Revoke a user's organization invitation.",
    ],
  }),
  composioTool({
    name: "calendly_update_event_type",
    description: "Tool to update an existing one-on-one event type (kind: solo) in Calendly. Use when you need to modify event type settings such as name, duration, location, or description. NOTE: Currently only supports one-on-one event types.",
    toolSlug: "CALENDLY_UPDATE_EVENT_TYPE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The event type name that will be displayed to invitees",
        },
        uuid: {
          type: "string",
          description: "Unique identifier (UUID) of the event type to update. Can be provided as either the full event type URI (e.g., 'https://api.calendly.com/event_types/AAAAAAAAAAAAAAAA') or just the UUID portion (e.g., 'AAAAAAAAAAAAAAAA'). Supports both alphanumeric format (e.g., 'GBGBDCAADAEDCRZ2') and standard UUID format (e.g., 'cdeba4c3-5adb-477d-8972-7317836eb40d'). Use LIST_USER_S_EVENT_TYPES action to retrieve valid event type URIs.",
        },
        color: {
          type: "string",
          description: "Hexadecimal color value for the scheduling page. Must match pattern ^#[a-f\\d]{6}$ (e.g., '#fff200')",
        },
        active: {
          type: "boolean",
          description: "Indicates if the event type is active and available for booking",
        },
        locale: {
          type: "string",
          description: "Locale for the event type's scheduling page language",
          enum: [
            "de",
            "en",
            "es",
            "fr",
            "it",
            "nl",
            "pt",
            "uk",
          ],
        },
        duration: {
          type: "integer",
          description: "Length of sessions in minutes. Must be between 1 and 720 minutes. Should be one of the duration_options if both are provided.",
        },
        locations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              kind: {
                type: "string",
                description: "Type of location for the event. Common values: 'zoom_conference', 'google_meet', 'microsoft_teams', 'physical', 'ask_invitee', 'outbound_call', 'inbound_call', 'custom'",
              },
              location: {
                type: "string",
                description: "Location address or description (required when kind is 'physical' or 'custom')",
              },
              phone_number: {
                type: "string",
                description: "Phone number for phone call locations (required when kind is 'outbound_call' or 'inbound_call')",
              },
              additional_info: {
                type: "string",
                description: "Additional location information or instructions for invitees",
              },
            },
            description: "Location configuration for the event type.",
          },
          description: "Configuration information for each possible location where the event can take place",
        },
        description: {
          type: "string",
          description: "The event type description that will be shown on the scheduling page (plain text format)",
        },
        duration_options: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Alternative duration choices for flexible meetings. Maximum 4 unique values allowed. Each must be between 1 and 720 minutes.",
        },
      },
      required: [
        "uuid",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "event_types",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Event Type.",
    ],
  }),
  composioTool({
    name: "calendly_update_event_type_availability",
    description: "Tool to update an event type availability schedule in Calendly. Use when you need to change the timezone or availability rules for an event type. WARNING: Updating rules will overwrite all existing rules - retrieve existing rules first using GET /event_type_availability_schedules.",
    toolSlug: "CALENDLY_UPDATE_EVENT_TYPE_AVAILABILITY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user: {
          type: "string",
          description: "URI of the user associated with the event type. Required when an admin or org owner is updating a specific user's schedule.",
        },
        event_type: {
          type: "string",
          description: "URI of the event type whose availability schedule is to be updated. Must follow the pattern https://api.calendly.com/event_types/{uuid} and contain '/event_types/' in the path. Other Calendly URIs (e.g., user_availability_schedules, scheduling_links, users) are NOT valid for this field.",
        },
        availability_rule: {
          type: "object",
          additionalProperties: true,
          properties: {
            rules: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  date: {
                    type: "string",
                    description: "Specific date in ISO 8601 format (YYYY-MM-DD) when type is 'date'. Example: '2025-08-05'. Required when type is 'date'.",
                  },
                  type: {
                    type: "string",
                    description: "The type of availability rule: 'wday' for weekday-based rules or 'date' for specific date rules.",
                  },
                  wday: {
                    type: "string",
                    description: "Day of the week when type is 'wday'. Values: 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'. Required when type is 'wday'.",
                  },
                  intervals: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        to: {
                          type: "string",
                          description: "End time of the availability interval in 24-hour format (HH:MM), e.g., '17:00'.",
                        },
                        from: {
                          type: "string",
                          description: "Start time of the availability interval in 24-hour format (HH:MM), e.g., '09:00'.",
                        },
                      },
                      description: "Time interval defining when availability exists.",
                    },
                    description: "Array of time intervals defining when the event type is available during the specified day or date. Empty array means no availability for that day.",
                  },
                },
                description: "Rule defining availability for a specific day or date.",
              },
              description: "Array of availability rule objects that define when the event type is available. WARNING: This will overwrite all existing rules. To preserve existing rules, first retrieve them using GET /event_type_availability_schedules and then pass the modified rules.",
            },
            timezone: {
              type: "string",
              description: "IANA timezone identifier for the availability schedule (e.g., 'Europe/London', 'America/New_York', 'Asia/Calcutta').",
            },
          },
          description: "Availability rule configuration containing timezone and rules for when the event type is available. WARNING: Rules will overwrite all existing rules.",
        },
        availability_setting: {
          type: "string",
          description: "Indicates how availability is determined. Default: 'host'. Every host on the Event Type shares identical schedule.",
        },
      },
      required: [
        "event_type",
        "availability_rule",
      ],
    },
    tags: [
      "composio",
      "calendly",
      "write",
      "event_types",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Event Type Availability.",
    ],
  }),
];
