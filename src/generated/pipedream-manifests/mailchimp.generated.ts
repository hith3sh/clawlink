import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const MailchimpPipedreamToolManifests = [
  {
    "integration": "mailchimp",
    "name": "mailchimp_add_note_to_subscriber",
    "description": "Adds a new note to an existing subscriber. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-notes/add-member-note/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        },
        "note": {
          "type": "string",
          "title": "Note",
          "description": "The content of the note. Note length is limited to 1,000 characters."
        }
      },
      "required": [
        "listId",
        "subscriberHash",
        "note"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-add-note-to-subscriber",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "note",
          "type": "string",
          "label": "Note",
          "description": "The content of the note. Note length is limited to 1,000 characters.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-add-note-to-subscriber",
      "componentName": "Add Note to Subscriber"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_add_or_update_subscriber",
    "description": "Adds a new subscriber to an audience or updates existing subscriber. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        },
        "emailAddress": {
          "type": "string",
          "title": "Email address",
          "description": "Email address for a subscriber."
        },
        "skipMergeValidation": {
          "type": "boolean",
          "title": "Skip merge validation",
          "description": "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to False."
        },
        "statusIfNew": {
          "type": "string",
          "title": "Status if new",
          "description": "Subscriber's status. This value is required only if the email address is not already present on the list."
        },
        "emailType": {
          "type": "string",
          "title": "Email type",
          "description": "Type of email this member asked to get ('html' or 'text')."
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "Subscriber's current status."
        },
        "mergeFields": {
          "type": "object",
          "title": "Merge fields",
          "description": "An individual merge var and value for a member."
        },
        "interests": {
          "type": "object",
          "title": "Interests",
          "description": "The key of this object's properties is the ID of the interest in question."
        },
        "language": {
          "type": "string",
          "title": "Language",
          "description": "If set/detected, the subscriber's language."
        },
        "vip": {
          "type": "boolean",
          "title": "Vip",
          "description": "VIP status for subscriber."
        },
        "latitude": {
          "type": "string",
          "title": "Latitude",
          "description": "The location latitude."
        },
        "longitude": {
          "type": "string",
          "title": "Longitude",
          "description": "The location longitude."
        },
        "marketingPermissionId": {
          "type": "string",
          "title": "Marketing permission ID",
          "description": "The ID for the marketing permission on the list."
        },
        "marketingPermissionsEnabled": {
          "type": "boolean",
          "title": "Marketing permissions enabled",
          "description": "If the subscriber has opted-in to the marketing permission."
        },
        "ipSignup": {
          "type": "string",
          "title": "IP signup",
          "description": "IP address the subscriber signed up from."
        },
        "timestampSignup": {
          "type": "string",
          "title": "Timestamp signup",
          "description": "The date and time the subscriber signed up for the list in ISO 8601 format."
        },
        "ipOpt": {
          "type": "string",
          "title": "IP opt in",
          "description": "The IP address the subscriber used to confirm their opt-in status."
        },
        "timestampOpt": {
          "type": "string",
          "title": "Timestamp opt in",
          "description": "The date and time the subscriber confirmed their opt-in status in ISO 8601 format."
        }
      },
      "required": [
        "listId",
        "subscriberHash",
        "emailAddress",
        "statusIfNew"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-add-or-update-subscriber",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email address",
          "description": "Email address for a subscriber.",
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
          "name": "skipMergeValidation",
          "type": "boolean",
          "label": "Skip merge validation",
          "description": "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to False.",
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
          "name": "statusIfNew",
          "type": "string",
          "label": "Status if new",
          "description": "Subscriber's status. This value is required only if the email address is not already present on the list.",
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
          "name": "emailType",
          "type": "string",
          "label": "Email type",
          "description": "Type of email this member asked to get ('html' or 'text').",
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
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "Subscriber's current status.",
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
          "name": "mergeFields",
          "type": "object",
          "label": "Merge fields",
          "description": "An individual merge var and value for a member.",
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
          "name": "interests",
          "type": "object",
          "label": "Interests",
          "description": "The key of this object's properties is the ID of the interest in question.",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "If set/detected, the subscriber's language.",
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
          "name": "vip",
          "type": "boolean",
          "label": "Vip",
          "description": "VIP status for subscriber.",
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
          "name": "latitude",
          "type": "string",
          "label": "Latitude",
          "description": "The location latitude.",
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
          "name": "longitude",
          "type": "string",
          "label": "Longitude",
          "description": "The location longitude.",
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
          "name": "marketingPermissionId",
          "type": "string",
          "label": "Marketing permission ID",
          "description": "The ID for the marketing permission on the list.",
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
          "name": "marketingPermissionsEnabled",
          "type": "boolean",
          "label": "Marketing permissions enabled",
          "description": "If the subscriber has opted-in to the marketing permission.",
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
          "name": "ipSignup",
          "type": "string",
          "label": "IP signup",
          "description": "IP address the subscriber signed up from.",
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
          "name": "timestampSignup",
          "type": "string",
          "label": "Timestamp signup",
          "description": "The date and time the subscriber signed up for the list in ISO 8601 format.",
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
          "name": "ipOpt",
          "type": "string",
          "label": "IP opt in",
          "description": "The IP address the subscriber used to confirm their opt-in status.",
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
          "name": "timestampOpt",
          "type": "string",
          "label": "Timestamp opt in",
          "description": "The date and time the subscriber confirmed their opt-in status in ISO 8601 format.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-add-or-update-subscriber",
      "componentName": "Add or Update Subscriber"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_add_remove_member_tags",
    "description": "Add or remove member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/add-or-remove-member-tags/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "Stringified object list of tags assigned to the list member.. name, or status (Possible status values: \"inactive\" or \"active\") properties allowed.\n        Example:\n        `{\n            \"name\":\"\",\n            \"status\":\"active\",\n        }`"
        }
      },
      "required": [
        "listId",
        "subscriberHash",
        "tags"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-add-remove-member-tags",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "Stringified object list of tags assigned to the list member.. name, or status (Possible status values: \"inactive\" or \"active\") properties allowed.\n        Example:\n        `{\n            \"name\":\"\",\n            \"status\":\"active\",\n        }`",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-add-remove-member-tags",
      "componentName": "Add Or Remove Members Tags"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_add_segment_member",
    "description": "Adds a new member to a static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/add-member-to-segment/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "segmentId": {
          "type": "string",
          "title": "Segment ID",
          "description": "The unique ID of the segment"
        },
        "emailAddress": {
          "type": "string",
          "title": "Email address",
          "description": "Email address for a subscriber."
        }
      },
      "required": [
        "listId",
        "segmentId",
        "emailAddress"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-add-segment-member",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "segmentId",
          "type": "string",
          "label": "Segment ID",
          "description": "The unique ID of the segment",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email address",
          "description": "Email address for a subscriber.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-add-segment-member",
      "componentName": "Add Member To Segment"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_add_subscriber_to_tag",
    "description": "Adds an email address to a tag within an audience. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/add-or-remove-member-tags/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "Stringified object list of fields to return. name, or status (Possible status values: \"inactive\" or \"active\") properties allowed.\n        Example:\n        `{\n            \"name\":\"college\",\n            \"status\":\"active\",\n        }`"
        }
      },
      "required": [
        "listId",
        "subscriberHash",
        "tags"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-add-subscriber-to-tag",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "Stringified object list of fields to return. name, or status (Possible status values: \"inactive\" or \"active\") properties allowed.\n        Example:\n        `{\n            \"name\":\"college\",\n            \"status\":\"active\",\n        }`",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-add-subscriber-to-tag",
      "componentName": "Add Subscriber To Tag"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_create_campaign",
    "description": "Creates a new campaign draft. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/add-campaign/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "title": "Type",
          "description": "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead."
        },
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "savedSegmentId": {
          "type": "number",
          "title": "Saved segment ID",
          "description": "The ID for an existing saved segment."
        },
        "prebuiltSegmentId": {
          "type": "string",
          "title": "Prebuilt segment ID",
          "description": "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign."
        },
        "segmentMatch": {
          "type": "string",
          "title": "Segment match",
          "description": "Segment match type."
        },
        "segmentConditions": {
          "type": "object",
          "title": "Segment conditions",
          "description": "Segment match conditions."
        },
        "subjectLine": {
          "type": "string",
          "title": "Subject line",
          "description": "The subject line for the campaign."
        },
        "previewText": {
          "type": "string",
          "title": "Preview text",
          "description": "The preview text for the campaign."
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "The title of the campaign."
        },
        "fromName": {
          "type": "string",
          "title": "From name",
          "description": "The 'from' name on the campaign (not an email address)."
        },
        "replyTo": {
          "type": "string",
          "title": "Reply to",
          "description": "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending."
        },
        "useConversation": {
          "type": "boolean",
          "title": "Use conversation",
          "description": "Use Mailchimp Conversation feature to manage out-of-office replies."
        },
        "toName": {
          "type": "string",
          "title": "To name",
          "description": "The campaign's custom to name."
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "If the campaign is listed in a folder, the ID for that folder."
        },
        "authenticate": {
          "type": "boolean",
          "title": "Authenticate",
          "description": "Whether Mailchimp authenticated the campaign. Defaults to true."
        },
        "autoFooter": {
          "type": "boolean",
          "title": "Auto footer",
          "description": "Automatically append Mailchimp's default footer to the campaign."
        },
        "inlineCss": {
          "type": "boolean",
          "title": "Inline css",
          "description": "Automatically inline the CSS included with the campaign content."
        },
        "autoTweet": {
          "type": "boolean",
          "title": "Auto tweet",
          "description": "Automatically tweet a link to the campaign archive page when the campaign is sent."
        },
        "autoFbPost": {
          "type": "object",
          "title": "Auto fb post",
          "description": "An array of Facebook page ID to auto-post to."
        },
        "fbComments": {
          "type": "boolean",
          "title": "FB comments",
          "description": "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true."
        },
        "templateId": {
          "type": "number",
          "title": "Template ID",
          "description": "The ID of the template to use."
        },
        "opens": {
          "type": "boolean",
          "title": "Opens",
          "description": "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "htmlClicks": {
          "type": "boolean",
          "title": "HTML clicks",
          "description": "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "textClicks": {
          "type": "boolean",
          "title": "Text clicks",
          "description": "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "goalTracking": {
          "type": "boolean",
          "title": "Goal tracking",
          "description": "Whether to enable Goal tracking."
        },
        "ecomm360": {
          "type": "boolean",
          "title": "E-commerce tracking",
          "description": "Whether to enable eCommerce360 tracking."
        },
        "googleAnalytics": {
          "type": "string",
          "title": "Google analytics",
          "description": "The custom slug for Google Analytics tracking (max of 50 bytes)."
        },
        "clicktale": {
          "type": "string",
          "title": "Clicktale",
          "description": "The custom slug for ClickTale tracking (max of 50 bytes)."
        },
        "salesforceCampaign": {
          "type": "boolean",
          "title": "Salesforce campaign",
          "description": "Create a campaign in a connected Salesforce account."
        },
        "salesforceNotes": {
          "type": "boolean",
          "title": "Salesforce notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses."
        },
        "capsuleNotes": {
          "type": "boolean",
          "title": "Capsule notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration."
        },
        "socialImageUrl": {
          "type": "string",
          "title": "Social image url",
          "description": "The url for the header image for the preview card."
        },
        "socialDescritpion": {
          "type": "string",
          "title": "Social description",
          "description": "A short summary of the campaign to display."
        },
        "socialTitle": {
          "type": "string",
          "title": "Social title",
          "description": "The title for the preview card. Typically the subject line of the campaign."
        }
      },
      "required": [
        "type",
        "listId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-create-campaign",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "type",
          "type": "string",
          "label": "Type",
          "description": "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead.",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "savedSegmentId",
          "type": "integer",
          "label": "Saved segment ID",
          "description": "The ID for an existing saved segment.",
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
          "name": "prebuiltSegmentId",
          "type": "string",
          "label": "Prebuilt segment ID",
          "description": "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign.",
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
          "name": "segmentMatch",
          "type": "string",
          "label": "Segment match",
          "description": "Segment match type.",
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
          "name": "segmentConditions",
          "type": "any",
          "label": "Segment conditions",
          "description": "Segment match conditions.",
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
          "name": "subjectLine",
          "type": "string",
          "label": "Subject line",
          "description": "The subject line for the campaign.",
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
          "name": "previewText",
          "type": "string",
          "label": "Preview text",
          "description": "The preview text for the campaign.",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "The title of the campaign.",
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
          "name": "fromName",
          "type": "string",
          "label": "From name",
          "description": "The 'from' name on the campaign (not an email address).",
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
          "name": "replyTo",
          "type": "string",
          "label": "Reply to",
          "description": "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending.",
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
          "name": "useConversation",
          "type": "boolean",
          "label": "Use conversation",
          "description": "Use Mailchimp Conversation feature to manage out-of-office replies.",
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
          "name": "toName",
          "type": "string",
          "label": "To name",
          "description": "The campaign's custom to name.",
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
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "If the campaign is listed in a folder, the ID for that folder.",
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
          "name": "authenticate",
          "type": "boolean",
          "label": "Authenticate",
          "description": "Whether Mailchimp authenticated the campaign. Defaults to true.",
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
          "name": "autoFooter",
          "type": "boolean",
          "label": "Auto footer",
          "description": "Automatically append Mailchimp's default footer to the campaign.",
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
          "name": "inlineCss",
          "type": "boolean",
          "label": "Inline css",
          "description": "Automatically inline the CSS included with the campaign content.",
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
          "name": "autoTweet",
          "type": "boolean",
          "label": "Auto tweet",
          "description": "Automatically tweet a link to the campaign archive page when the campaign is sent.",
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
          "name": "autoFbPost",
          "type": "any",
          "label": "Auto fb post",
          "description": "An array of Facebook page ID to auto-post to.",
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
          "name": "fbComments",
          "type": "boolean",
          "label": "FB comments",
          "description": "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true.",
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
          "name": "templateId",
          "type": "integer",
          "label": "Template ID",
          "description": "The ID of the template to use.",
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
          "name": "opens",
          "type": "boolean",
          "label": "Opens",
          "description": "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "htmlClicks",
          "type": "boolean",
          "label": "HTML clicks",
          "description": "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "textClicks",
          "type": "boolean",
          "label": "Text clicks",
          "description": "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "goalTracking",
          "type": "boolean",
          "label": "Goal tracking",
          "description": "Whether to enable Goal tracking.",
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
          "name": "ecomm360",
          "type": "boolean",
          "label": "E-commerce tracking",
          "description": "Whether to enable eCommerce360 tracking.",
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
          "name": "googleAnalytics",
          "type": "string",
          "label": "Google analytics",
          "description": "The custom slug for Google Analytics tracking (max of 50 bytes).",
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
          "name": "clicktale",
          "type": "string",
          "label": "Clicktale",
          "description": "The custom slug for ClickTale tracking (max of 50 bytes).",
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
          "name": "salesforceCampaign",
          "type": "boolean",
          "label": "Salesforce campaign",
          "description": "Create a campaign in a connected Salesforce account.",
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
          "name": "salesforceNotes",
          "type": "boolean",
          "label": "Salesforce notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses.",
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
          "name": "capsuleNotes",
          "type": "boolean",
          "label": "Capsule notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration.",
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
          "name": "socialImageUrl",
          "type": "string",
          "label": "Social image url",
          "description": "The url for the header image for the preview card.",
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
          "name": "socialDescritpion",
          "type": "string",
          "label": "Social description",
          "description": "A short summary of the campaign to display.",
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
          "name": "socialTitle",
          "type": "string",
          "label": "Social title",
          "description": "The title for the preview card. Typically the subject line of the campaign.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-create-campaign",
      "componentName": "Create Campaign"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_create_list",
    "description": "Creates a new list. [See docs here](https://mailchimp.com/developer/marketing/api/lists/add-list/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the list."
        },
        "contactCompany": {
          "type": "string",
          "title": "Contact company",
          "description": "The company name for the list."
        },
        "contactAddress1": {
          "type": "string",
          "title": "Contact address1",
          "description": "The street address for the list contact."
        },
        "contactCity": {
          "type": "string",
          "title": "Contact city",
          "description": "The city for the list contact."
        },
        "contactCountry": {
          "type": "string",
          "title": "Contact country",
          "description": "A two-character ISO3166 country code. Defaults to US if invalid."
        },
        "permissionReminder": {
          "type": "string",
          "title": "Permission reminder",
          "description": "The [permission reminder](https://mailchimp.com/help/edit-the-permission-reminder/) for the list. e.g You signed up for updates on our website"
        },
        "campaignDefaultsFromName": {
          "type": "string",
          "title": "From name",
          "description": "The default from name for campaigns sent to this list."
        },
        "campaignDefaultsFromEmail": {
          "type": "string",
          "title": "From email",
          "description": "The default from email for campaigns sent to this list."
        },
        "campaignDefaultsSubject": {
          "type": "string",
          "title": "Subject",
          "description": "The default subject line for campaigns sent to this list."
        },
        "campaignDefaultsLanguage": {
          "type": "string",
          "title": "Language",
          "description": "The default language for this lists's forms."
        }
      },
      "required": [
        "name",
        "contactCompany",
        "contactAddress1",
        "contactCity",
        "contactCountry",
        "permissionReminder",
        "campaignDefaultsFromName",
        "campaignDefaultsFromEmail",
        "campaignDefaultsSubject",
        "campaignDefaultsLanguage"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "emailTypeOption": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "mailchimp",
      "componentId": "mailchimp-create-list",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the list.",
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
          "name": "contactCompany",
          "type": "string",
          "label": "Contact company",
          "description": "The company name for the list.",
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
          "name": "contactAddress1",
          "type": "string",
          "label": "Contact address1",
          "description": "The street address for the list contact.",
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
          "name": "contactCity",
          "type": "string",
          "label": "Contact city",
          "description": "The city for the list contact.",
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
          "name": "contactCountry",
          "type": "string",
          "label": "Contact country",
          "description": "A two-character ISO3166 country code. Defaults to US if invalid.",
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
          "name": "permissionReminder",
          "type": "string",
          "label": "Permission reminder",
          "description": "The [permission reminder](https://mailchimp.com/help/edit-the-permission-reminder/) for the list. e.g You signed up for updates on our website",
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
          "name": "campaignDefaultsFromName",
          "type": "string",
          "label": "From name",
          "description": "The default from name for campaigns sent to this list.",
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
          "name": "campaignDefaultsFromEmail",
          "type": "string",
          "label": "From email",
          "description": "The default from email for campaigns sent to this list.",
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
          "name": "campaignDefaultsSubject",
          "type": "string",
          "label": "Subject",
          "description": "The default subject line for campaigns sent to this list.",
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
          "name": "campaignDefaultsLanguage",
          "type": "string",
          "label": "Language",
          "description": "The default language for this lists's forms.",
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
          "name": "emailTypeOption",
          "type": "boolean",
          "label": "Email type option",
          "description": "Whether the list supports [multiple formats for emails](https://mailchimp.com/help/change-audience-name-defaults/).\n        When set to true, subscribers can choose whether they want to receive HTML or plain-text emails. \n        When set to false, subscribers will receive HTML emails, with a plain-text alternative backup.",
          "required": true,
          "hidden": true,
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
      "app": "mailchimp",
      "componentKey": "mailchimp-create-list",
      "componentName": "Create List"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_delete_campaign",
    "description": "Delete a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/delete-campaign/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        }
      },
      "required": [
        "campaignId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-delete-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-delete-campaign",
      "componentName": "Delete Campaign"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_delete_list",
    "description": "Deletes an existing list. [See docs here](https://mailchimp.com/developer/marketing/api/lists)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        }
      },
      "required": [
        "listId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-delete-list",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-delete-list",
      "componentName": "Delete List"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_delete_list_member",
    "description": "Permanently deletes a member. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/delete-list-member/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        }
      },
      "required": [
        "listId",
        "subscriberHash"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-delete-list-member",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-delete-list-member",
      "componentName": "Delete List Member"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_edit_campaign_template_content",
    "description": "Edits a defined content area of a custom HTML template. [See docs here](https://mailchimp.com/developer/marketing/api/campaign-content/set-campaign-content/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        },
        "archiveType": {
          "type": "string",
          "title": "Archive type",
          "description": "The type of encoded file."
        },
        "templateSections": {
          "type": "object",
          "title": "Template sections",
          "description": "Content for the sections of the template. Each key should be the unique mc:edit area name from the template."
        },
        "plainText": {
          "type": "string",
          "title": "Plain text",
          "description": "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically."
        },
        "html": {
          "type": "string",
          "title": "Plain text",
          "description": "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically."
        },
        "url": {
          "type": "string",
          "title": "URL",
          "description": "When importing a campaign, the URL where the HTML lives."
        },
        "variateContents": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Variate contents",
          "description": "Stringified object list of content options for [Multivariate Campaigns](https://mailchimp.com/help/about-multivariate-campaigns/). \n      Allowed keys are archive, template, content_label, plain_text, html, and url.\n        Each content option must provide HTML content and may optionally provide plain text. \n        For campaigns not testing content, only one object should be provided."
        }
      },
      "required": [
        "campaignId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-edit-campaign-template-content",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [
        "templateSections"
      ],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "archiveType",
          "type": "string",
          "label": "Archive type",
          "description": "The type of encoded file.",
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
          "name": "templateSections",
          "type": "object",
          "label": "Template sections",
          "description": "Content for the sections of the template. Each key should be the unique mc:edit area name from the template.",
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
          "name": "plainText",
          "type": "string",
          "label": "Plain text",
          "description": "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically.",
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
          "name": "html",
          "type": "string",
          "label": "Plain text",
          "description": "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically.",
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
          "name": "url",
          "type": "string",
          "label": "URL",
          "description": "When importing a campaign, the URL where the HTML lives.",
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
          "name": "variateContents",
          "type": "string[]",
          "label": "Variate contents",
          "description": "Stringified object list of content options for [Multivariate Campaigns](https://mailchimp.com/help/about-multivariate-campaigns/). \n      Allowed keys are archive, template, content_label, plain_text, html, and url.\n        Each content option must provide HTML content and may optionally provide plain text. \n        For campaigns not testing content, only one object should be provided.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-edit-campaign-template-content",
      "componentName": "Edit A Campaign Template Content"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_campaign",
    "description": "Gets metadata of a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        }
      },
      "required": [
        "campaignId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-campaign",
      "componentName": "Get Campaign"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_campaign_report",
    "description": "Gets a campaign report. [See docs here](https://mailchimp.com/developer/marketing/api/campaign-advice/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        }
      },
      "required": [
        "campaignId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-campaign-report",
      "version": "0.0.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-campaign-report",
      "componentName": "Get A Campaign Report"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_list",
    "description": "Searches for lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        },
        "includeTotalContacts": {
          "type": "boolean",
          "title": "Include total contacts",
          "description": "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state."
        }
      },
      "required": [
        "listId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-list",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
          "name": "includeTotalContacts",
          "type": "boolean",
          "label": "Include total contacts",
          "description": "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-list",
      "componentName": "Get List"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_list_activities",
    "description": "Retrieves up to the previous 180 days of daily detailed aggregated activity stats for a list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "count": {
          "type": "number",
          "title": "Count",
          "description": "The number of records to return."
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        }
      },
      "required": [
        "listId",
        "count"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-list-activities",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "count",
          "type": "integer",
          "label": "Count",
          "description": "The number of records to return.",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-list-activities",
      "componentName": "Get List Activities"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_list_member_activity",
    "description": "Get the last 50 events of a member's activity on a specific list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/view-recent-activity-50/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber hash",
          "description": "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id."
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        },
        "action": {
          "type": "object",
          "title": "Action",
          "description": "A comma separated list of actions to return. Possible values: abuse, bounce, click, open, sent, unsub, or ecomm."
        }
      },
      "required": [
        "listId",
        "subscriberHash"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-list-member-activity",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber hash",
          "description": "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
          "name": "action",
          "type": "object",
          "label": "Action",
          "description": "A comma separated list of actions to return. Possible values: abuse, bounce, click, open, sent, unsub, or ecomm.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-list-member-activity",
      "componentName": "Get List Member Activities"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_get_list_member_tags",
    "description": "Retrieves a list of all member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        },
        "count": {
          "type": "number",
          "title": "Count",
          "description": "The number of records to return."
        }
      },
      "required": [
        "listId",
        "subscriberHash",
        "count"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-get-list-member-tags",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
          "type": "integer",
          "label": "Count",
          "description": "The number of records to return.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-get-list-member-tags",
      "componentName": "Get List Member Tags"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_list_segment_member",
    "description": "Retrieves a list of all segment members. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "segmentId": {
          "type": "string",
          "title": "Segment/Tag Id",
          "description": "The unique ID of the segment or tag you'd like to watch for new subscribers"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        },
        "count": {
          "type": "number",
          "title": "Count",
          "description": "The number of records to return."
        }
      },
      "required": [
        "listId",
        "segmentId",
        "count"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-list-segment-member",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "segmentId",
          "type": "string",
          "label": "Segment/Tag Id",
          "description": "The unique ID of the segment or tag you'd like to watch for new subscribers",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
          "type": "integer",
          "label": "Count",
          "description": "The number of records to return.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-list-segment-member",
      "componentName": "List Segment Members"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_remove_segment_member",
    "description": "Removes a member from the specified static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/remove-list-member-from-segment/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "segmentId": {
          "type": "string",
          "title": "Segment/Tag Id",
          "description": "The unique ID of the segment or tag you'd like to watch for new subscribers"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        }
      },
      "required": [
        "listId",
        "segmentId",
        "subscriberHash"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-remove-segment-member",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "segmentId",
          "type": "string",
          "label": "Segment/Tag Id",
          "description": "The unique ID of the segment or tag you'd like to watch for new subscribers",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-remove-segment-member",
      "componentName": "Remove Member From A Segment"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_search_campaign",
    "description": "Searches for the campaigns. [See docs here](https://mailchimp.com/developer/marketing/api/search-campaigns/search-campaigns/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "title": "Query text",
          "description": "Search query text used to filter results."
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        }
      },
      "required": [
        "query"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-search-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "query",
          "type": "string",
          "label": "Query text",
          "description": "Search query text used to filter results.",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-search-campaign",
      "componentName": "Search Campaigns"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_search_lists",
    "description": "Searches for lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "beforeDateCreated": {
          "type": "string",
          "title": "Before date created",
          "description": "Restrict response to lists created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00."
        },
        "sinceDateCreated": {
          "type": "string",
          "title": "Since date created",
          "description": "Restrict results to lists created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00."
        },
        "beforeCampaignLastSent": {
          "type": "string",
          "title": "Before campaign last sent",
          "description": "Restrict results to lists created before the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00."
        },
        "sinceCampaignLastSent": {
          "type": "string",
          "title": "Since campaign last sent",
          "description": "Restrict results to lists created after the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00."
        },
        "email": {
          "type": "string",
          "title": "Email",
          "description": "Restrict results to lists that include a specific subscriber's email address."
        },
        "sortField": {
          "type": "string",
          "title": "Sort field",
          "description": "Returns files sorted by the specified field. Possible value: \"date_created\""
        },
        "sortDir": {
          "type": "string",
          "title": "Sort direction",
          "description": "Determines the order direction for sorted results. Possible values: ASC or DESC."
        },
        "hasEcommerceStore": {
          "type": "boolean",
          "title": "Has ecommerce store?",
          "description": "The unique ID for the list"
        },
        "includeTotalContacts": {
          "type": "boolean",
          "title": "Include total contacts",
          "description": "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-search-lists",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "beforeDateCreated",
          "type": "string",
          "label": "Before date created",
          "description": "Restrict response to lists created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
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
          "name": "sinceDateCreated",
          "type": "string",
          "label": "Since date created",
          "description": "Restrict results to lists created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
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
          "name": "beforeCampaignLastSent",
          "type": "string",
          "label": "Before campaign last sent",
          "description": "Restrict results to lists created before the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
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
          "name": "sinceCampaignLastSent",
          "type": "string",
          "label": "Since campaign last sent",
          "description": "Restrict results to lists created after the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
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
          "name": "email",
          "type": "string",
          "label": "Email",
          "description": "Restrict results to lists that include a specific subscriber's email address.",
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
          "name": "sortField",
          "type": "string",
          "label": "Sort field",
          "description": "Returns files sorted by the specified field. Possible value: \"date_created\"",
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
          "name": "sortDir",
          "type": "string",
          "label": "Sort direction",
          "description": "Determines the order direction for sorted results. Possible values: ASC or DESC.",
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
          "name": "hasEcommerceStore",
          "type": "boolean",
          "label": "Has ecommerce store?",
          "description": "The unique ID for the list",
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
          "name": "includeTotalContacts",
          "type": "boolean",
          "label": "Include total contacts",
          "description": "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-search-lists",
      "componentName": "Search Lists"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_search_member",
    "description": "Searches for a subscriber. The search can be restricted to a specific list, or can be used to search across all lists in an account.\n   [See docs here](https://mailchimp.com/developer/marketing/api/search-members/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation."
        },
        "excludeFields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation."
        },
        "query": {
          "type": "string",
          "title": "Query",
          "description": "The search query used to filter results. Query should be a valid email, or a string representing a contact's first or last name."
        },
        "listId": {
          "type": "string",
          "title": "List ID",
          "description": "The unique ID for the list."
        }
      },
      "required": [
        "query"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-search-member",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
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
          "name": "excludeFields",
          "type": "string[]",
          "label": "Exclude Fields",
          "description": "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
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
          "name": "query",
          "type": "string",
          "label": "Query",
          "description": "The search query used to filter results. Query should be a valid email, or a string representing a contact's first or last name.",
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
          "name": "listId",
          "type": "string",
          "label": "List ID",
          "description": "The unique ID for the list.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-search-member",
      "componentName": "Search Members/Subscribers"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_send_campaign",
    "description": "Sends a campaign draft to the audience signed up for the campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/send-campaign/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        }
      },
      "required": [
        "campaignId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-send-campaign",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-send-campaign",
      "componentName": "Send a Campaign"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_unsubscribe_email",
    "description": "Unsubscribe an email address from an audience. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/archive-list-member/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "subscriberHash": {
          "type": "string",
          "title": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address."
        }
      },
      "required": [
        "listId",
        "subscriberHash"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-unsubscribe-email",
      "version": "0.2.4",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "subscriberHash",
          "type": "string",
          "label": "Subscriber",
          "description": "The MD5 hash of the lowercase version of the list member's email address.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "mailchimp",
      "componentKey": "mailchimp-unsubscribe-email",
      "componentName": "Unsubscribe Email"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_update_campaign",
    "description": "Update a campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/update-campaign-settings/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The unique ID of the campaign"
        },
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "savedSegmentId": {
          "type": "string",
          "title": "Saved segment ID",
          "description": "The ID for an existing saved segment."
        },
        "prebuiltSegmentId": {
          "type": "string",
          "title": "Prebuilt segment ID",
          "description": "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign."
        },
        "segmentMatch": {
          "type": "string",
          "title": "Segment match",
          "description": "Segment match type."
        },
        "segmentConditions": {
          "type": "object",
          "title": "Segment condition",
          "description": "Segment match conditions."
        },
        "subjectLine": {
          "type": "string",
          "title": "Subject line",
          "description": "The subject line for the campaign."
        },
        "previewText": {
          "type": "string",
          "title": "Preview text",
          "description": "The preview text for the campaign."
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "The title of the campaign."
        },
        "fromName": {
          "type": "string",
          "title": "From name",
          "description": "The 'from' name on the campaign (not an email address)."
        },
        "replyTo": {
          "type": "string",
          "title": "Reply to",
          "description": "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending."
        },
        "useConversation": {
          "type": "boolean",
          "title": "Use conversations",
          "description": "Use Mailchimp Conversation feature to manage out-of-office replies."
        },
        "toName": {
          "type": "string",
          "title": "To name",
          "description": "The campaign's custom 'To' name."
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "If the campaign is listed in a folder, the ID for that folder."
        },
        "authenticate": {
          "type": "boolean",
          "title": "Authenticate",
          "description": "Whether Mailchimp authenticated the campaign. Defaults to true."
        },
        "autoFooter": {
          "type": "boolean",
          "title": "Auto footer",
          "description": "Automatically append Mailchimp's default footer to the campaign."
        },
        "inlineCss": {
          "type": "boolean",
          "title": "Inline css",
          "description": "Automatically inline the CSS included with the campaign content."
        },
        "autoTweet": {
          "type": "boolean",
          "title": "Auto tweet",
          "description": "Automatically tweet a link to the campaign archive page when the campaign is sent."
        },
        "autoFbPost": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Auto facebook post",
          "description": "An array of Facebook page ID to auto-post to."
        },
        "fbComments": {
          "type": "boolean",
          "title": "Facebook comment",
          "description": "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true."
        },
        "templateId": {
          "type": "string",
          "title": "Template ID",
          "description": "The ID of the template to use."
        },
        "opens": {
          "type": "boolean",
          "title": "Opens",
          "description": "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "htmlClicks": {
          "type": "boolean",
          "title": "HTML clicks",
          "description": "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "textClicks": {
          "type": "boolean",
          "title": "Text clicks",
          "description": "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns."
        },
        "goalTracking": {
          "type": "boolean",
          "title": "Goal tracking",
          "description": "Whether to enable Goal tracking."
        },
        "ecomm360": {
          "type": "boolean",
          "title": "E-commerce tracking",
          "description": "Whether to enable eCommerce360 tracking."
        },
        "googleAnalytics": {
          "type": "string",
          "title": "Google analytics",
          "description": "The custom slug for Google Analytics tracking (max of 50 bytes)."
        },
        "clicktale": {
          "type": "string",
          "title": "Clicktale",
          "description": "The custom slug for ClickTale tracking (max of 50 bytes)."
        },
        "salesforceCampaign": {
          "type": "boolean",
          "title": "Salesforce campaign",
          "description": "Create a campaign in a connected Salesforce account."
        },
        "salesforceNotes": {
          "type": "boolean",
          "title": "Salesforce notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses."
        },
        "capsuleNotes": {
          "type": "boolean",
          "title": "Capsule notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration."
        },
        "socialImageUrl": {
          "type": "string",
          "title": "Social image url",
          "description": "The url for the header image for the preview card."
        },
        "socialDescritpion": {
          "type": "string",
          "title": "Social description",
          "description": "A short summary of the campaign to display."
        },
        "socialTitle": {
          "type": "string",
          "title": "Social title",
          "description": "The title for the preview card. Typically the subject line of the campaign."
        }
      },
      "required": [
        "campaignId",
        "listId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
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
      "app": "mailchimp",
      "componentId": "mailchimp-update-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The unique ID of the campaign",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "savedSegmentId",
          "type": "string",
          "label": "Saved segment ID",
          "description": "The ID for an existing saved segment.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "prebuiltSegmentId",
          "type": "string",
          "label": "Prebuilt segment ID",
          "description": "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign.",
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
          "name": "segmentMatch",
          "type": "string",
          "label": "Segment match",
          "description": "Segment match type.",
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
          "name": "segmentConditions",
          "type": "any",
          "label": "Segment condition",
          "description": "Segment match conditions.",
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
          "name": "subjectLine",
          "type": "string",
          "label": "Subject line",
          "description": "The subject line for the campaign.",
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
          "name": "previewText",
          "type": "string",
          "label": "Preview text",
          "description": "The preview text for the campaign.",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "The title of the campaign.",
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
          "name": "fromName",
          "type": "string",
          "label": "From name",
          "description": "The 'from' name on the campaign (not an email address).",
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
          "name": "replyTo",
          "type": "string",
          "label": "Reply to",
          "description": "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending.",
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
          "name": "useConversation",
          "type": "boolean",
          "label": "Use conversations",
          "description": "Use Mailchimp Conversation feature to manage out-of-office replies.",
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
          "name": "toName",
          "type": "string",
          "label": "To name",
          "description": "The campaign's custom 'To' name.",
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
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "If the campaign is listed in a folder, the ID for that folder.",
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
          "name": "authenticate",
          "type": "boolean",
          "label": "Authenticate",
          "description": "Whether Mailchimp authenticated the campaign. Defaults to true.",
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
          "name": "autoFooter",
          "type": "boolean",
          "label": "Auto footer",
          "description": "Automatically append Mailchimp's default footer to the campaign.",
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
          "name": "inlineCss",
          "type": "boolean",
          "label": "Inline css",
          "description": "Automatically inline the CSS included with the campaign content.",
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
          "name": "autoTweet",
          "type": "boolean",
          "label": "Auto tweet",
          "description": "Automatically tweet a link to the campaign archive page when the campaign is sent.",
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
          "name": "autoFbPost",
          "type": "string[]",
          "label": "Auto facebook post",
          "description": "An array of Facebook page ID to auto-post to.",
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
          "name": "fbComments",
          "type": "boolean",
          "label": "Facebook comment",
          "description": "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true.",
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
          "name": "templateId",
          "type": "string",
          "label": "Template ID",
          "description": "The ID of the template to use.",
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
          "name": "opens",
          "type": "boolean",
          "label": "Opens",
          "description": "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "htmlClicks",
          "type": "boolean",
          "label": "HTML clicks",
          "description": "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "textClicks",
          "type": "boolean",
          "label": "Text clicks",
          "description": "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
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
          "name": "goalTracking",
          "type": "boolean",
          "label": "Goal tracking",
          "description": "Whether to enable Goal tracking.",
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
          "name": "ecomm360",
          "type": "boolean",
          "label": "E-commerce tracking",
          "description": "Whether to enable eCommerce360 tracking.",
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
          "name": "googleAnalytics",
          "type": "string",
          "label": "Google analytics",
          "description": "The custom slug for Google Analytics tracking (max of 50 bytes).",
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
          "name": "clicktale",
          "type": "string",
          "label": "Clicktale",
          "description": "The custom slug for ClickTale tracking (max of 50 bytes).",
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
          "name": "salesforceCampaign",
          "type": "boolean",
          "label": "Salesforce campaign",
          "description": "Create a campaign in a connected Salesforce account.",
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
          "name": "salesforceNotes",
          "type": "boolean",
          "label": "Salesforce notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses.",
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
          "name": "capsuleNotes",
          "type": "boolean",
          "label": "Capsule notes",
          "description": "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration.",
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
          "name": "socialImageUrl",
          "type": "string",
          "label": "Social image url",
          "description": "The url for the header image for the preview card.",
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
          "name": "socialDescritpion",
          "type": "string",
          "label": "Social description",
          "description": "A short summary of the campaign to display.",
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
          "name": "socialTitle",
          "type": "string",
          "label": "Social title",
          "description": "The title for the preview card. Typically the subject line of the campaign.",
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
      "app": "mailchimp",
      "componentKey": "mailchimp-update-campaign",
      "componentName": "Update Campaign"
    }
  },
  {
    "integration": "mailchimp",
    "name": "mailchimp_update_list",
    "description": "Updates an existing list. [See docs here](https://mailchimp.com/developer/marketing/api/lists/update-lists/)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listId": {
          "type": "string",
          "title": "List Id",
          "description": "The unique ID of the list"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the list."
        },
        "contactCompany": {
          "type": "string",
          "title": "Contact company",
          "description": "The company name for the list."
        },
        "contactAddress1": {
          "type": "string",
          "title": "Contact address1",
          "description": "The street address for the list contact."
        },
        "contactCity": {
          "type": "string",
          "title": "Contact city",
          "description": "The city for the list contact."
        },
        "contactState": {
          "type": "string",
          "title": "Contact state",
          "description": "The state for the list contact."
        },
        "contactCountry": {
          "type": "string",
          "title": "Contact country",
          "description": "A two-character ISO3166 country code. Defaults to US if invalid."
        },
        "contactPhone": {
          "type": "string",
          "title": "Contact phone",
          "description": "The phone number for the list contact."
        },
        "contactZip": {
          "type": "string",
          "title": "Contact zip code",
          "description": "The postal or zip code for the list contact."
        },
        "permissionReminder": {
          "type": "string",
          "title": "Permission reminder",
          "description": "The [permission reminder](https://mailchimp.com/help/edit-the-permission-reminder/) for the list."
        },
        "campaignDefaultsFromName": {
          "type": "string",
          "title": "From name",
          "description": "The default from name for campaigns sent to this list."
        },
        "campaignDefaultsFromEmail": {
          "type": "string",
          "title": "From email",
          "description": "The default from email for campaigns sent to this list."
        },
        "campaignDefaultsSubject": {
          "type": "string",
          "title": "Subject",
          "description": "The default subject line for campaigns sent to this list."
        },
        "campaignDefaultsLanguage": {
          "type": "string",
          "title": "Language",
          "description": "The default language for this lists's forms."
        }
      },
      "required": [
        "listId",
        "name",
        "contactCompany",
        "contactAddress1",
        "contactCity",
        "contactState",
        "contactCountry",
        "permissionReminder",
        "campaignDefaultsFromName",
        "campaignDefaultsFromEmail",
        "campaignDefaultsSubject",
        "campaignDefaultsLanguage"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "mailchimp",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "emailTypeOption": false
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "mailchimp",
      "componentId": "mailchimp-update-list",
      "version": "0.0.3",
      "authPropNames": [
        "mailchimp"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "mailchimp",
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
          "name": "listId",
          "type": "string",
          "label": "List Id",
          "description": "The unique ID of the list",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the list.",
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
          "name": "contactCompany",
          "type": "string",
          "label": "Contact company",
          "description": "The company name for the list.",
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
          "name": "contactAddress1",
          "type": "string",
          "label": "Contact address1",
          "description": "The street address for the list contact.",
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
          "name": "contactCity",
          "type": "string",
          "label": "Contact city",
          "description": "The city for the list contact.",
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
          "name": "contactState",
          "type": "string",
          "label": "Contact state",
          "description": "The state for the list contact.",
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
          "name": "contactCountry",
          "type": "string",
          "label": "Contact country",
          "description": "A two-character ISO3166 country code. Defaults to US if invalid.",
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
          "name": "contactPhone",
          "type": "string",
          "label": "Contact phone",
          "description": "The phone number for the list contact.",
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
          "name": "contactZip",
          "type": "string",
          "label": "Contact zip code",
          "description": "The postal or zip code for the list contact.",
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
          "name": "permissionReminder",
          "type": "string",
          "label": "Permission reminder",
          "description": "The [permission reminder](https://mailchimp.com/help/edit-the-permission-reminder/) for the list.",
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
          "name": "campaignDefaultsFromName",
          "type": "string",
          "label": "From name",
          "description": "The default from name for campaigns sent to this list.",
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
          "name": "campaignDefaultsFromEmail",
          "type": "string",
          "label": "From email",
          "description": "The default from email for campaigns sent to this list.",
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
          "name": "campaignDefaultsSubject",
          "type": "string",
          "label": "Subject",
          "description": "The default subject line for campaigns sent to this list.",
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
          "name": "campaignDefaultsLanguage",
          "type": "string",
          "label": "Language",
          "description": "The default language for this lists's forms.",
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
          "name": "emailTypeOption",
          "type": "boolean",
          "label": "Email type option",
          "description": "Whether the list supports [multiple formats for emails](https://mailchimp.com/help/change-audience-name-defaults/).",
          "required": true,
          "hidden": true,
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
      "app": "mailchimp",
      "componentKey": "mailchimp-update-list",
      "componentName": "Update List"
    }
  }
] satisfies PipedreamActionToolManifest[];
