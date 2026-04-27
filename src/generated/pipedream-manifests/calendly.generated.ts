import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const CalendlyPipedreamToolManifests = [
  {
    "integration": "calendly",
    "name": "calendly_create_invitee_no_show",
    "description": "Marks an Invitee as a No Show in Calendly. [See the documentation](https://calendly.stoplight.io/docs/api-docs/cebd8c3170790-create-invitee-no-show).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "An event UUID"
        },
        "inviteeUri": {
          "type": "string",
          "title": "Invitee URI",
          "description": "The invitee to mark as a no show"
        }
      },
      "required": [
        "eventId",
        "inviteeUri"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-create-invitee-no-show",
      "version": "0.0.5",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly",
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
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "An event UUID",
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
          "name": "inviteeUri",
          "type": "string",
          "label": "Invitee URI",
          "description": "The invitee to mark as a no show",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-create-invitee-no-show",
      "componentName": "Create Invitee No Show"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_create_scheduling_link",
    "description": "Creates a single-use scheduling link. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6MzQyNTM0OQ-create-single-use-scheduling-link)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string",
          "title": "Owner",
          "description": "An event type UUID"
        },
        "maxEventCount": {
          "type": "number",
          "title": "Max Event Count",
          "description": "The max number of events that can be scheduled using this scheduling link"
        }
      },
      "required": [
        "owner",
        "maxEventCount"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-create-scheduling-link",
      "version": "0.0.8",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly",
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
          "name": "owner",
          "type": "string",
          "label": "Owner",
          "description": "An event type UUID",
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
          "name": "maxEventCount",
          "type": "integer",
          "label": "Max Event Count",
          "description": "The max number of events that can be scheduled using this scheduling link",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-create-scheduling-link",
      "componentName": "Create a Scheduling Link"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_get_event",
    "description": "Gets information about an Event associated with a URI. [See the documentation](https://developer.calendly.com/api-docs/e2f95ebd44914-get-event).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "An event UUID"
        },
        "eventUrl": {
          "type": "string",
          "title": "Event URL",
          "description": "The URL of the event to retrieve information about. If you are using a Calendly Source in the same workflow, you would use ``{{steps.trigger.event.payload.event}}``."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-get-event",
      "version": "0.1.7",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly",
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
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "An event UUID",
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
          "name": "eventUrl",
          "type": "string",
          "label": "Event URL",
          "description": "The URL of the event to retrieve information about. If you are using a Calendly Source in the same workflow, you would use ``{{steps.trigger.event.payload.event}}``.",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-get-event",
      "componentName": "Get Event"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_list_event_invitees",
    "description": "List invitees for an event. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEx-list-event-invitees)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "eventId": {
          "type": "string",
          "title": "Event ID",
          "description": "An event UUID"
        },
        "email": {
          "type": "string",
          "title": "Inviteee Email",
          "description": "Indicates if the results should be filtered by email address"
        },
        "status": {
          "type": "string",
          "title": "Event Status",
          "description": "Indicates if the invitee `canceled` or still `active`"
        },
        "paginate": {
          "type": "boolean",
          "title": "Paginate",
          "description": "Whether to paginate or not"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The number of rows to return"
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
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-list-event-invitees",
      "version": "0.0.7",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly",
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
          "name": "eventId",
          "type": "string",
          "label": "Event ID",
          "description": "An event UUID",
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
          "name": "email",
          "type": "string",
          "label": "Inviteee Email",
          "description": "Indicates if the results should be filtered by email address",
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
          "name": "status",
          "type": "string",
          "label": "Event Status",
          "description": "Indicates if the invitee `canceled` or still `active`",
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
          "name": "paginate",
          "type": "boolean",
          "label": "Paginate",
          "description": "Whether to paginate or not",
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
          "description": "The number of rows to return",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-list-event-invitees",
      "componentName": "List Event Invitees"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_list_events",
    "description": "List events for an user. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEy-list-events)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "scope": {
          "type": "string",
          "title": "Scope",
          "description": "The scope to fetch events for"
        },
        "inviteeEmail": {
          "type": "string",
          "title": "Inviteee Email",
          "description": "Return events that are scheduled with the invitee associated with this email address"
        },
        "status": {
          "type": "string",
          "title": "Event Status",
          "description": "Whether the scheduled event is `active` or `canceled`"
        },
        "paginate": {
          "type": "boolean",
          "title": "Paginate",
          "description": "Whether to paginate or not"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The number of rows to return"
        }
      },
      "required": [
        "scope"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-list-events",
      "version": "0.0.7",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [
        "scope"
      ],
      "props": [
        {
          "name": "calendly",
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
          "name": "alert",
          "type": "alert",
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
          "name": "scope",
          "type": "string",
          "label": "Scope",
          "description": "The scope to fetch events for",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "organization",
          "type": "string",
          "label": "Organization UUID",
          "description": "An organization UUID",
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
          "name": "user",
          "type": "string",
          "label": "User UUID",
          "description": "Returns events for a specified user",
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
          "name": "group",
          "type": "string",
          "label": "Group ID",
          "description": "Returns events for a specified group",
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
          "name": "inviteeEmail",
          "type": "string",
          "label": "Inviteee Email",
          "description": "Return events that are scheduled with the invitee associated with this email address",
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
          "name": "status",
          "type": "string",
          "label": "Event Status",
          "description": "Whether the scheduled event is `active` or `canceled`",
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
          "name": "paginate",
          "type": "boolean",
          "label": "Paginate",
          "description": "Whether to paginate or not",
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
          "description": "The number of rows to return",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-list-events",
      "componentName": "List Events"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_list_user_availability_schedules",
    "description": "List the availability schedules of the given user. [See the documentation](https://developer.calendly.com/api-docs/8098de44af94c-list-user-availability-schedules)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "organization": {
          "type": "string",
          "title": "Organization UUID",
          "description": "An organization UUID"
        },
        "user": {
          "type": "string",
          "title": "User UUID",
          "description": "The ID of the user for whom you want to retrieve availability schedules."
        }
      },
      "required": [
        "organization",
        "user"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-list-user-availability-schedules",
      "version": "0.0.3",
      "authPropNames": [
        "calendly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly",
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
          "name": "organization",
          "type": "string",
          "label": "Organization UUID",
          "description": "An organization UUID",
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
          "name": "user",
          "type": "string",
          "label": "User UUID",
          "description": "The ID of the user for whom you want to retrieve availability schedules.",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-list-user-availability-schedules",
      "componentName": "List User Availability Schedules"
    }
  },
  {
    "integration": "calendly",
    "name": "calendly_list_webhook_subscriptions",
    "description": "Get a list of Webhook Subscriptions for an Organization or User with a UUID.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "scope": {
          "type": "string",
          "description": "Filter the list by organization or user."
        },
        "organization_uri": {
          "type": "string",
          "description": "Indicates if the results should be filtered by organization, by entering an organization 's URI, such as `https://api.calendly.com/organizations/012345678901234567890`."
        },
        "user_uri": {
          "type": "string",
          "description": "Indicates if the results should be filtered by user, by entering a user's URI, such as `https://api.calendly.com/users/CAFHCZWDQLKQ73HX`. You can use the [Get User](https://developer.calendly.com/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1users~1me/get) endpoint to find a user's URI."
        },
        "count": {
          "type": "string",
          "description": "The number of rows to return."
        },
        "page_token": {
          "type": "string",
          "description": "The token to pass to get the next portion of the collection."
        },
        "sort": {
          "type": "string",
          "description": "Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values. Supported fields are: created_at. Sort direction is specified as: asc, desc."
        }
      },
      "required": [
        "scope",
        "organization_uri"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "calendly",
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
      "app": "calendly_v2",
      "componentId": "calendly_v2-list-webhook-subscriptions",
      "version": "0.1.6",
      "authPropNames": [
        "calendly_v2"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "calendly_v2",
          "type": "app",
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
          "name": "scope",
          "type": "string",
          "description": "Filter the list by organization or user.",
          "required": true,
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
          "name": "organization_uri",
          "type": "string",
          "description": "Indicates if the results should be filtered by organization, by entering an organization 's URI, such as `https://api.calendly.com/organizations/012345678901234567890`.",
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
          "name": "user_uri",
          "type": "string",
          "description": "Indicates if the results should be filtered by user, by entering a user's URI, such as `https://api.calendly.com/users/CAFHCZWDQLKQ73HX`. You can use the [Get User](https://developer.calendly.com/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1users~1me/get) endpoint to find a user's URI.",
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
          "name": "count",
          "type": "string",
          "description": "The number of rows to return.",
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
          "name": "page_token",
          "type": "string",
          "description": "The token to pass to get the next portion of the collection.",
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
          "name": "sort",
          "type": "string",
          "description": "Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values. Supported fields are: created_at. Sort direction is specified as: asc, desc.",
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
      "app": "calendly_v2",
      "componentKey": "calendly_v2-list-webhook-subscriptions",
      "componentName": "List Webhook Subscriptions"
    }
  }
] satisfies PipedreamActionToolManifest[];
