import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleCalendarPipedreamToolManifests = [
  {
    "integration": "google-calendar",
    "name": "google-calendar_add_attendees_to_event",
    "description": "Add attendees to an existing event. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "Select an event from Google Calendar."
        },
        "attendees": {
          "type": "string",
          "title": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees"
        },
        "sendUpdates": {
          "type": "string",
          "title": "Send Updates",
          "description": "Configure whether to send notifications about the event"
        }
      },
      "required": [
        "eventId",
        "attendees"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-add-attendees-to-event",
      "version": "0.0.7",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "Select an event from Google Calendar.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "attendees",
          "type": "string",
          "label": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sendUpdates",
          "type": "string",
          "label": "Send Updates",
          "description": "Configure whether to send notifications about the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-add-attendees-to-event",
      "componentName": "Add Attendees To Event"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_create_event",
    "description": "Create an event in a Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/insert)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "summary": {
          "type": "string",
          "title": "Event Title",
          "description": "Enter a title for the event, (e.g., `My event`)"
        },
        "eventStartDate": {
          "type": "string",
          "title": "Event Start Date",
          "description": "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T10:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "eventEndDate": {
          "type": "string",
          "title": "Event End Date",
          "description": "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T11:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "location": {
          "type": "string",
          "title": "Event Location",
          "description": "Specify the location of the event"
        },
        "description": {
          "type": "string",
          "title": "Event Description",
          "description": "Enter a description for the event"
        },
        "attendees": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Attendees",
          "description": "An array of email addresses (e.g., `[\"alice@example.com\", \"bob@example.com\"]`)"
        },
        "colorId": {
          "type": "string",
          "title": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar."
        },
        "sendUpdates": {
          "type": "string",
          "title": "Send Updates",
          "description": "Configure whether to send notifications about the event"
        },
        "createMeetRoom": {
          "type": "boolean",
          "title": "Create Meet Room",
          "description": "Whether to create a Google Meet room for this event."
        },
        "visibility": {
          "type": "string",
          "title": "Visibility",
          "description": "Visibility of the event"
        },
        "repeatFrequency": {
          "type": "string",
          "title": "Repeat Frequency",
          "description": "Select a frequency to make this event repeating"
        },
        "repeatInterval": {
          "type": "number",
          "title": "Repeat Interval",
          "description": "Enter 1 to \"repeat every day\", enter 2 to \"repeat every other day\", etc. Defaults to 1."
        },
        "repeatSpecificDays": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Repeat Specific Days",
          "description": "The event will repeat on these days of the week. Repeat Frequency must be `WEEKLY`."
        },
        "repeatUntil": {
          "type": "string",
          "title": "Repeat Until",
          "description": "The event will repeat only until this date, if set. Only one of `Repeat Until` or Repeat `How Many Times` may be entered."
        },
        "repeatTimes": {
          "type": "number",
          "title": "Repeat How Many Times?",
          "description": "Limit the number of times this event will occur. Only one of `Repeat Until` or Repeat `How Many Times` may be entered."
        }
      },
      "required": [
        "summary",
        "eventStartDate",
        "eventEndDate"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-create-event",
      "version": "1.0.2",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "summary",
          "type": "string",
          "label": "Event Title",
          "description": "Enter a title for the event, (e.g., `My event`)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventStartDate",
          "type": "string",
          "label": "Event Start Date",
          "description": "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T10:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventEndDate",
          "type": "string",
          "label": "Event End Date",
          "description": "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T11:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "location",
          "type": "string",
          "label": "Event Location",
          "description": "Specify the location of the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Event Description",
          "description": "Enter a description for the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "attendees",
          "type": "string[]",
          "label": "Attendees",
          "description": "An array of email addresses (e.g., `[\"alice@example.com\", \"bob@example.com\"]`)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "colorId",
          "type": "string",
          "label": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sendUpdates",
          "type": "string",
          "label": "Send Updates",
          "description": "Configure whether to send notifications about the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "createMeetRoom",
          "type": "boolean",
          "label": "Create Meet Room",
          "description": "Whether to create a Google Meet room for this event.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "visibility",
          "type": "string",
          "label": "Visibility",
          "description": "Visibility of the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "repeatFrequency",
          "type": "string",
          "label": "Repeat Frequency",
          "description": "Select a frequency to make this event repeating",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatInterval",
          "type": "integer",
          "label": "Repeat Interval",
          "description": "Enter 1 to \"repeat every day\", enter 2 to \"repeat every other day\", etc. Defaults to 1.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatSpecificDays",
          "type": "string[]",
          "label": "Repeat Specific Days",
          "description": "The event will repeat on these days of the week. Repeat Frequency must be `WEEKLY`.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "Sunday",
              "value": "SU"
            },
            {
              "label": "Monday",
              "value": "MO"
            },
            {
              "label": "Tuesday",
              "value": "TU"
            },
            {
              "label": "Wednesday",
              "value": "WE"
            },
            {
              "label": "Thursday",
              "value": "TH"
            },
            {
              "label": "Friday",
              "value": "FR"
            },
            {
              "label": "Saturday",
              "value": "SA"
            },
            {
              "label": "Weekdays",
              "value": "MO,TU,WE,TH,FR"
            }
          ]
        },
        {
          "name": "repeatUntil",
          "type": "string",
          "label": "Repeat Until",
          "description": "The event will repeat only until this date, if set. Only one of `Repeat Until` or Repeat `How Many Times` may be entered.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatTimes",
          "type": "integer",
          "label": "Repeat How Many Times?",
          "description": "Limit the number of times this event will occur. Only one of `Repeat Until` or Repeat `How Many Times` may be entered.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-create-event",
      "componentName": "Create Event"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_delete_event",
    "description": "Delete an event from a Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#delete)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "Select an event from Google Calendar."
        }
      },
      "required": [
        "eventId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-delete-event",
      "version": "0.1.10",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "Select an event from Google Calendar.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-delete-event",
      "componentName": "Delete an Event"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_get_calendar",
    "description": "Retrieve calendar details of a Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendars.html#get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-get-calendar",
      "version": "0.1.11",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-get-calendar",
      "componentName": "Retrieve Calendar Details"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_get_current_user",
    "description": "Retrieve information about the authenticated Google Calendar account, including the primary calendar (summary, timezone, ACL flags), a list of accessible calendars, user-level settings (timezone, locale, week start), and the color palette that controls events and calendars. Ideal for confirming which calendar account is in use, customizing downstream scheduling, or equipping LLMs with the user’s context (timezones, available calendars) prior to creating or updating events. [See the documentation](https://developers.google.com/calendar/api/v3/reference/calendars/get).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-get-current-user",
      "version": "0.0.3",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_get_date_time",
    "description": "Get current date and time for use in Google Calendar actions. Useful for agents that need datetime awareness and timezone context before calling other Google Calendar tools.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-get-date-time",
      "version": "0.0.2",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-get-date-time",
      "componentName": "Get Date Time"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_get_event",
    "description": "Retrieve event details from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "Select an event from Google Calendar."
        }
      },
      "required": [
        "eventId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-get-event",
      "version": "0.1.11",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "Select an event from Google Calendar.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-get-event",
      "componentName": "Retrieve Event Details"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_list_calendars",
    "description": "Retrieve a list of calendars from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendarlist.html#list)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-list-calendars",
      "version": "0.1.11",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-list-calendars",
      "componentName": "List Calendars"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_list_event_instances",
    "description": "Retrieve instances of a recurring event. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/instances)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "The recurring event identifier. Select an event from Google Calendar."
        },
        "maxAttendees": {
          "type": "number",
          "title": "Max Attendees",
          "description": "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional."
        },
        "showDeleted": {
          "type": "boolean",
          "title": "Show Deleted",
          "description": "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False."
        },
        "timeMax": {
          "type": "string",
          "title": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time."
        },
        "timeMin": {
          "type": "string",
          "title": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar."
        }
      },
      "required": [
        "eventId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-list-event-instances",
      "version": "0.0.3",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "The recurring event identifier. Select an event from Google Calendar.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "maxAttendees",
          "type": "integer",
          "label": "Max Attendees",
          "description": "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "showDeleted",
          "type": "boolean",
          "label": "Show Deleted",
          "description": "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMax",
          "type": "string",
          "label": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMin",
          "type": "string",
          "label": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-list-event-instances",
      "componentName": "List Event Instances"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_list_events",
    "description": "Retrieve a list of event from the Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "iCalUID": {
          "type": "string",
          "title": "iCal UID",
          "description": "Specifies event ID in the iCalendar format to be included in the response. Optional."
        },
        "maxAttendees": {
          "type": "number",
          "title": "Max Attendees",
          "description": "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional."
        },
        "orderBy": {
          "type": "string",
          "title": "Order By",
          "description": "The order of the events returned in the result. Optional. The default is an unspecified, stable order. Must set Single Events to `true` to order by `startTime`.",
          "enum": [
            "startTime",
            "updated"
          ]
        },
        "privateExtendedProperty": {
          "type": "string",
          "title": "Private extended property",
          "description": "Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints."
        },
        "q": {
          "type": "string",
          "title": "Query",
          "description": "Free text search terms to find events that match these terms in any field, except for extended properties. Optional."
        },
        "sharedExtendedProperty": {
          "type": "string",
          "title": "Shared Extended Property",
          "description": "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints."
        },
        "showDeleted": {
          "type": "boolean",
          "title": "Show Deleted",
          "description": "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False."
        },
        "showHiddenInvitations": {
          "type": "boolean",
          "title": "Show Hidden Invitations",
          "description": "Whether to include hidden invitations in the result. Optional. The default is False."
        },
        "singleEvents": {
          "type": "boolean",
          "title": "Single Events",
          "description": "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False."
        },
        "timeMax": {
          "type": "string",
          "title": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time."
        },
        "timeMin": {
          "type": "string",
          "title": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar."
        },
        "updatedMin": {
          "type": "string",
          "title": "Minimum Updated Time",
          "description": "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time."
        },
        "eventTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Event Types",
          "description": "Filter events by event type"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-list-events",
      "version": "0.0.14",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "iCalUID",
          "type": "string",
          "label": "iCal UID",
          "description": "Specifies event ID in the iCalendar format to be included in the response. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "maxAttendees",
          "type": "integer",
          "label": "Max Attendees",
          "description": "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "orderBy",
          "type": "string",
          "label": "Order By",
          "description": "The order of the events returned in the result. Optional. The default is an unspecified, stable order. Must set Single Events to `true` to order by `startTime`.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "startTime",
              "value": "startTime"
            },
            {
              "label": "updated",
              "value": "updated"
            }
          ]
        },
        {
          "name": "privateExtendedProperty",
          "type": "string",
          "label": "Private extended property",
          "description": "Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "q",
          "type": "string",
          "label": "Query",
          "description": "Free text search terms to find events that match these terms in any field, except for extended properties. Optional.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sharedExtendedProperty",
          "type": "string",
          "label": "Shared Extended Property",
          "description": "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "showDeleted",
          "type": "boolean",
          "label": "Show Deleted",
          "description": "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "showHiddenInvitations",
          "type": "boolean",
          "label": "Show Hidden Invitations",
          "description": "Whether to include hidden invitations in the result. Optional. The default is False.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "singleEvents",
          "type": "boolean",
          "label": "Single Events",
          "description": "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMax",
          "type": "string",
          "label": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMin",
          "type": "string",
          "label": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "updatedMin",
          "type": "string",
          "label": "Minimum Updated Time",
          "description": "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventTypes",
          "type": "string[]",
          "label": "Event Types",
          "description": "Filter events by event type",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-list-events",
      "componentName": "List Events"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_query_free_busy_calendars",
    "description": "Retrieve free/busy calendar details from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Freebusy.html#query)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Calendar ID",
          "description": "Select calendars to retrieve free/busy details"
        },
        "timeMin": {
          "type": "string",
          "title": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time."
        },
        "timeMax": {
          "type": "string",
          "title": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Specify the preferred time zone to be used on the response"
        }
      },
      "required": [
        "calendarId",
        "timeMin",
        "timeMax"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-query-free-busy-calendars",
      "version": "0.2.1",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string[]",
          "label": "Calendar ID",
          "description": "Select calendars to retrieve free/busy details",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMin",
          "type": "string",
          "label": "Min time",
          "description": "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeMax",
          "type": "string",
          "label": "Max Time",
          "description": "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Specify the preferred time zone to be used on the response",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-query-free-busy-calendars",
      "componentName": "Retrieve Free/Busy Calendar Details"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_quick_add_event",
    "description": "Create a quick event to the Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#quickAdd)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "text": {
          "type": "string",
          "title": "Describe Event",
          "description": "Write a plain text description of event, and Google will parse this string to create the event. eg. 'Meet with Michael 10am 7/22/2024' or 'Call Sarah at 1:30PM on Friday'"
        },
        "attendees": {
          "type": "string",
          "title": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees"
        }
      },
      "required": [
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-quick-add-event",
      "version": "0.1.12",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "text",
          "type": "string",
          "label": "Describe Event",
          "description": "Write a plain text description of event, and Google will parse this string to create the event. eg. 'Meet with Michael 10am 7/22/2024' or 'Call Sarah at 1:30PM on Friday'",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "attendees",
          "type": "string",
          "label": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-quick-add-event",
      "componentName": "Add Quick Event"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_update_event_instance",
    "description": "Update a specific instance of a recurring event. Changes apply only to the selected instance. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "recurringEventId": {
          "type": "string",
          "title": "Recurring Event ID",
          "description": "The ID of the recurring event"
        },
        "instanceId": {
          "type": "string",
          "title": "Event Instance ID",
          "description": "The ID of the specific instance to update. Use List Event Instances action to get instance IDs."
        },
        "summary": {
          "type": "string",
          "title": "Event Title",
          "description": "Enter a new title for this instance"
        },
        "eventStartDate": {
          "type": "string",
          "title": "Event Start Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "eventEndDate": {
          "type": "string",
          "title": "Event End Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "location": {
          "type": "string",
          "title": "Event Location",
          "description": "Specify a new location for this instance"
        },
        "description": {
          "type": "string",
          "title": "Event Description",
          "description": "Enter a new description for this instance"
        },
        "attendees": {
          "type": "string",
          "title": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees"
        },
        "colorId": {
          "type": "string",
          "title": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar."
        },
        "sendUpdates": {
          "type": "string",
          "title": "Send Updates",
          "description": "Configure whether to send notifications about the event"
        }
      },
      "required": [
        "recurringEventId",
        "instanceId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-update-event-instance",
      "version": "0.0.4",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "recurringEventId",
          "type": "string",
          "label": "Recurring Event ID",
          "description": "The ID of the recurring event",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "instanceId",
          "type": "string",
          "label": "Event Instance ID",
          "description": "The ID of the specific instance to update. Use List Event Instances action to get instance IDs.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "summary",
          "type": "string",
          "label": "Event Title",
          "description": "Enter a new title for this instance",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventStartDate",
          "type": "string",
          "label": "Event Start Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventEndDate",
          "type": "string",
          "label": "Event End Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "location",
          "type": "string",
          "label": "Event Location",
          "description": "Specify a new location for this instance",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Event Description",
          "description": "Enter a new description for this instance",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "attendees",
          "type": "string",
          "label": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "colorId",
          "type": "string",
          "label": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sendUpdates",
          "type": "string",
          "label": "Send Updates",
          "description": "Configure whether to send notifications about the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-update-event-instance",
      "componentName": "Update Event Instance"
    }
  },
  {
    "integration": "google-calendar",
    "name": "google-calendar_update_following_instances",
    "description": "Update all instances of a recurring event following a specific instance. This creates a new recurring event starting from the selected instance. [See the documentation](https://developers.google.com/calendar/api/guides/recurringevents#modifying_all_following_instances)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "calendarId": {
          "type": "string",
          "title": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user"
        },
        "recurringEventId": {
          "type": "string",
          "title": "Recurring Event ID",
          "description": "The ID of the recurring event"
        },
        "instanceId": {
          "type": "string",
          "title": "Event Instance ID",
          "description": "The instance where the split will occur. All instances from this point forward will be updated with your changes, while earlier instances remain unchanged. For example, selecting the 4th instance will keep instances 1-3 as-is and update instances 4 onwards."
        },
        "summary": {
          "type": "string",
          "title": "Event Title",
          "description": "Enter a new title for all following instances"
        },
        "eventStartDate": {
          "type": "string",
          "title": "Event Start Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "eventEndDate": {
          "type": "string",
          "title": "Event End Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone."
        },
        "location": {
          "type": "string",
          "title": "Event Location",
          "description": "Specify a new location for all following instances"
        },
        "description": {
          "type": "string",
          "title": "Event Description",
          "description": "Enter a new description for all following instances"
        },
        "attendees": {
          "type": "string",
          "title": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees"
        },
        "repeatFrequency": {
          "type": "string",
          "title": "New Repeat Frequency",
          "description": "Optionally change the repeat frequency for following instances"
        },
        "colorId": {
          "type": "string",
          "title": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar."
        },
        "sendUpdates": {
          "type": "string",
          "title": "Send Updates",
          "description": "Configure whether to send notifications about the event"
        }
      },
      "required": [
        "recurringEventId",
        "instanceId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-calendar",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_calendar",
      "componentId": "google_calendar-update-following-instances",
      "version": "0.0.5",
      "authPropNames": [
        "googleCalendar"
      ],
      "dynamicPropNames": [
        "repeatFrequency"
      ],
      "props": [
        {
          "name": "googleCalendar",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "calendarId",
          "type": "string",
          "label": "Calendar ID",
          "description": "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "recurringEventId",
          "type": "string",
          "label": "Recurring Event ID",
          "description": "The ID of the recurring event",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "instanceId",
          "type": "string",
          "label": "Event Instance ID",
          "description": "The instance where the split will occur. All instances from this point forward will be updated with your changes, while earlier instances remain unchanged. For example, selecting the 4th instance will keep instances 1-3 as-is and update instances 4 onwards.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "summary",
          "type": "string",
          "label": "Event Title",
          "description": "Enter a new title for all following instances",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventStartDate",
          "type": "string",
          "label": "Event Start Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "eventEndDate",
          "type": "string",
          "label": "Event End Date",
          "description": "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "location",
          "type": "string",
          "label": "Event Location",
          "description": "Specify a new location for all following instances",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Event Description",
          "description": "Enter a new description for all following instances",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "attendees",
          "type": "string",
          "label": "Attendees",
          "description": "Enter either an array or a comma separated list of email addresses of attendees",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatFrequency",
          "type": "string",
          "label": "New Repeat Frequency",
          "description": "Optionally change the repeat frequency for following instances",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatInterval",
          "type": "integer",
          "label": "Repeat Interval",
          "description": "Repeat interval (e.g., 1 for every day, 2 for every other day)",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatUntil",
          "type": "string",
          "label": "Repeat Until",
          "description": "The event will repeat only until this date (format: yyyy-mm-dd)",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "repeatTimes",
          "type": "integer",
          "label": "Number of Occurrences",
          "description": "Limit the number of times this event will occur",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "colorId",
          "type": "string",
          "label": "Color ID",
          "description": "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "Time zone used in the response. Optional. The default is the time zone of the calendar.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sendUpdates",
          "type": "string",
          "label": "Send Updates",
          "description": "Configure whether to send notifications about the event",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "google_calendar",
      "componentKey": "google_calendar-update-following-instances",
      "componentName": "Update Following Event Instances"
    }
  }
] satisfies PipedreamActionToolManifest[];
