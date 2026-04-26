import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const OutlookPipedreamToolManifests = [
  {
    "integration": "outlook",
    "name": "outlook_add_label_to_email",
    "description": "Adds a label/category to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The identifier of the message to update"
        },
        "label": {
          "type": "string",
          "title": "Label",
          "description": "The name of the label/category to add"
        }
      },
      "required": [
        "messageId",
        "label"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-add-label-to-email",
      "version": "0.0.22",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The identifier of the message to update",
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
          "name": "label",
          "type": "string",
          "label": "Label",
          "description": "The name of the label/category to add",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-add-label-to-email",
      "componentName": "Add Label to Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_create_contact",
    "description": "Add a contact to the root Contacts folder, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "givenName": {
          "type": "string",
          "title": "Given name",
          "description": "Given name of the contact"
        },
        "surname": {
          "type": "string",
          "title": "Surname",
          "description": "Surname of the contact"
        },
        "emailAddresses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Email addresses",
          "description": "Email addresses"
        },
        "businessPhones": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of phone numbers"
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional contact details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/contact)"
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-create-contact",
      "version": "0.0.29",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "givenName",
          "type": "string",
          "label": "Given name",
          "description": "Given name of the contact",
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
          "name": "surname",
          "type": "string",
          "label": "Surname",
          "description": "Surname of the contact",
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
          "name": "emailAddresses",
          "type": "string[]",
          "label": "Email addresses",
          "description": "Email addresses",
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
          "name": "businessPhones",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of phone numbers",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional contact details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/contact)",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-create-contact",
      "componentName": "Create Contact"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_create_draft_email",
    "description": "Create a draft email, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "recipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of email addresses"
        },
        "ccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "CC Recipients",
          "description": "Array of email addresses"
        },
        "bccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "BCC Recipients",
          "description": "Array of email addresses"
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Subject of the email"
        },
        "contentType": {
          "type": "string",
          "title": "Content Type",
          "description": "Content type (default `text`)"
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "Content of the email in text or html format"
        },
        "files": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)"
        },
        "syncDir": {
          "type": "string"
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-create-draft-email",
      "version": "0.0.30",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "recipients",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of email addresses",
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
          "name": "ccRecipients",
          "type": "string[]",
          "label": "CC Recipients",
          "description": "Array of email addresses",
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
          "name": "bccRecipients",
          "type": "string[]",
          "label": "BCC Recipients",
          "description": "Array of email addresses",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "Subject of the email",
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
          "name": "contentType",
          "type": "string",
          "label": "Content Type",
          "description": "Content type (default `text`)",
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
          "name": "content",
          "type": "string",
          "label": "Content",
          "description": "Content of the email in text or html format",
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
          "name": "files",
          "type": "string[]",
          "label": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
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
          "name": "syncDir",
          "type": "dir",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-create-draft-email",
      "componentName": "Create Draft Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_create_draft_reply",
    "description": "Create a draft reply to an email. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-createreply)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The identifier of the message to update"
        },
        "recipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of email addresses"
        },
        "ccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "CC Recipients",
          "description": "Array of email addresses"
        },
        "bccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "BCC Recipients",
          "description": "Array of email addresses"
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Subject of the email"
        },
        "comment": {
          "type": "string",
          "title": "Content",
          "description": "Content of the reply in text format"
        },
        "files": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)"
        },
        "syncDir": {
          "type": "string"
        }
      },
      "required": [
        "messageId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-create-draft-reply",
      "version": "0.0.7",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The identifier of the message to update",
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
          "name": "recipients",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of email addresses",
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
          "name": "ccRecipients",
          "type": "string[]",
          "label": "CC Recipients",
          "description": "Array of email addresses",
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
          "name": "bccRecipients",
          "type": "string[]",
          "label": "BCC Recipients",
          "description": "Array of email addresses",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "Subject of the email",
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
          "name": "comment",
          "type": "string",
          "label": "Content",
          "description": "Content of the reply in text format",
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
          "name": "files",
          "type": "string[]",
          "label": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
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
          "name": "syncDir",
          "type": "dir",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-create-draft-reply",
      "componentName": "Create Draft Reply"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_find_contacts",
    "description": "Finds contacts with the given search string. [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "searchString": {
          "type": "string",
          "title": "Search string",
          "description": "Provide email address, given name, surname or display name (case sensitive)"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": [
        "searchString"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-find-contacts",
      "version": "0.0.29",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "searchString",
          "type": "string",
          "label": "Search string",
          "description": "Provide email address, given name, surname or display name (case sensitive)",
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
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "The maximum number of results to return",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-find-contacts",
      "componentName": "Find Contacts"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_find_email",
    "description": "Search for an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "search": {
          "type": "string",
          "title": "Search",
          "description": "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`. Not for use with `$filter` or `$orderby`."
        },
        "filter": {
          "type": "string",
          "title": "Filter",
          "description": "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations. Not for use with `$search`."
        },
        "orderBy": {
          "type": "string",
          "title": "Order By",
          "description": "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order. Not for use with `$search`."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        },
        "includeAttachments": {
          "type": "boolean",
          "title": "Include Attachments",
          "description": "If true, returns additional info for message attachments."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-find-email",
      "version": "0.1.4",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "info",
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
          "name": "search",
          "type": "string",
          "label": "Search",
          "description": "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`. Not for use with `$filter` or `$orderby`.",
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
          "name": "filter",
          "type": "string",
          "label": "Filter",
          "description": "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations. Not for use with `$search`.",
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
          "description": "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order. Not for use with `$search`.",
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
          "description": "The maximum number of results to return",
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
          "name": "includeAttachments",
          "type": "boolean",
          "label": "Include Attachments",
          "description": "If true, returns additional info for message attachments.",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-find-email",
      "componentName": "Find Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_find_shared_folder_email",
    "description": "Search for an email in a shared folder in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The ID of the user to get messages for"
        },
        "sharedFolderId": {
          "type": "string",
          "title": "Shared Folder ID",
          "description": "The ID of the shared folder to get messages for"
        },
        "search": {
          "type": "string",
          "title": "Search",
          "description": "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`. Not for use with `$filter` or `$orderby`."
        },
        "filter": {
          "type": "string",
          "title": "Filter",
          "description": "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations. Not for use with `$search`."
        },
        "orderBy": {
          "type": "string",
          "title": "Order By",
          "description": "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order. Not for use with `$search`."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": [
        "userId",
        "sharedFolderId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-find-shared-folder-email",
      "version": "0.0.14",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The ID of the user to get messages for",
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
          "name": "sharedFolderId",
          "type": "string",
          "label": "Shared Folder ID",
          "description": "The ID of the shared folder to get messages for",
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
          "name": "info",
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
          "name": "search",
          "type": "string",
          "label": "Search",
          "description": "Search for an email in Microsoft Outlook. Can search for specific message properties such as `\"to:example@example.com\"` or `\"subject:example\"`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `\"pizza\"` will search for messages with the word `pizza` in the subject, body, or from address, but `\"to:example@example.com\"` will only search for messages to `example@example.com`. Not for use with `$filter` or `$orderby`.",
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
          "name": "filter",
          "type": "string",
          "label": "Filter",
          "description": "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations. Not for use with `$search`.",
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
          "description": "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order. Not for use with `$search`.",
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
          "description": "The maximum number of results to return",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-find-shared-folder-email",
      "componentName": "Find Shared Folder Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_get_current_user",
    "description": "Returns the authenticated Microsoft user's ID, display name, email, and principal name via Microsoft Graph. Call this first when the user says 'my emails', 'my inbox', or needs identity context. Use the returned `id` to scope queries in **Find Email** or identify the sender in email results. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-get-current-user",
      "version": "0.0.1",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_get_message",
    "description": "Retrieve a single email message by its Microsoft Graph message ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get-message)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The Microsoft Graph message ID."
        },
        "includeAttachments": {
          "type": "boolean",
          "title": "Include Attachments",
          "description": "If true, returns additional info for message attachments."
        }
      },
      "required": [
        "messageId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-get-message",
      "version": "0.0.1",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The Microsoft Graph message ID.",
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
          "name": "includeAttachments",
          "type": "boolean",
          "label": "Include Attachments",
          "description": "If true, returns additional info for message attachments.",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-get-message",
      "componentName": "Get Message"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_list_contacts",
    "description": "Get a contact collection from the default contacts folder, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "filterAddress": {
          "type": "string",
          "title": "Email Address",
          "description": "If this is given, only contacts with the given address will be retrieved."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-list-contacts",
      "version": "0.0.29",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "filterAddress",
          "type": "string",
          "label": "Email Address",
          "description": "If this is given, only contacts with the given address will be retrieved.",
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
          "description": "The maximum number of results to return",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-list-contacts",
      "componentName": "List Contacts"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_list_folders",
    "description": "Retrieves a list of all folders in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        },
        "includeSubfolders": {
          "type": "boolean",
          "title": "Include Subfolders",
          "description": "If `true`, the list of folders will include subfolders"
        },
        "includeHiddenFolders": {
          "type": "boolean",
          "title": "Include Hidden Folders",
          "description": "If `true`, the list of folders will include hidden folders"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-list-folders",
      "version": "0.0.20",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "The maximum number of results to return",
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
          "name": "includeSubfolders",
          "type": "boolean",
          "label": "Include Subfolders",
          "description": "If `true`, the list of folders will include subfolders",
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
          "name": "includeHiddenFolders",
          "type": "boolean",
          "label": "Include Hidden Folders",
          "description": "If `true`, the list of folders will include hidden folders",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-list-folders",
      "componentName": "List Folders"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_list_important_mail",
    "description": "Get the most important mail from the user's Inbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of messages to return."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-list-important-mail",
      "version": "0.0.2",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "The maximum number of messages to return.",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-list-important-mail",
      "componentName": "List Important Mail"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_list_labels",
    "description": "Get all the labels/categories that have been defined for a user. [See the documentation](https://learn.microsoft.com/en-us/graph/api/outlookuser-list-mastercategories)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-list-labels",
      "version": "0.0.22",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-list-labels",
      "componentName": "List Labels"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_move_email_to_folder",
    "description": "Moves an email to the specified folder in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-move)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The identifier of the message to update"
        },
        "folderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The identifier of the folder to move the selected message to"
        }
      },
      "required": [
        "messageId",
        "folderId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-move-email-to-folder",
      "version": "0.0.20",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The identifier of the message to update",
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
          "name": "folderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The identifier of the folder to move the selected message to",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-move-email-to-folder",
      "componentName": "Move Email to Folder"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_remove_label_from_email",
    "description": "Removes a label/category from an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The identifier of the message to update"
        },
        "label": {
          "type": "string",
          "title": "Label",
          "description": "The name of the label/category to remove"
        }
      },
      "required": [
        "messageId",
        "label"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-remove-label-from-email",
      "version": "0.0.22",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The identifier of the message to update",
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
          "name": "label",
          "type": "string",
          "label": "Label",
          "description": "The name of the label/category to remove",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-remove-label-from-email",
      "componentName": "Remove Label from Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_reply_to_email",
    "description": "Reply to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-reply)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The identifier of the message to reply to"
        },
        "recipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of email addresses"
        },
        "ccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "CC Recipients",
          "description": "Array of email addresses"
        },
        "bccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "BCC Recipients",
          "description": "Array of email addresses"
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Subject of the email"
        },
        "comment": {
          "type": "string",
          "title": "Content",
          "description": "Content of the reply in text format"
        },
        "files": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)"
        },
        "syncDir": {
          "type": "string"
        }
      },
      "required": [
        "messageId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-reply-to-email",
      "version": "0.0.20",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The identifier of the message to reply to",
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
          "name": "recipients",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of email addresses",
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
          "name": "ccRecipients",
          "type": "string[]",
          "label": "CC Recipients",
          "description": "Array of email addresses",
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
          "name": "bccRecipients",
          "type": "string[]",
          "label": "BCC Recipients",
          "description": "Array of email addresses",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "Subject of the email",
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
          "name": "comment",
          "type": "string",
          "label": "Content",
          "description": "Content of the reply in text format",
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
          "name": "files",
          "type": "string[]",
          "label": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
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
          "name": "syncDir",
          "type": "dir",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-reply-to-email",
      "componentName": "Reply to Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_send_email",
    "description": "Send an email to one or multiple recipients, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-sendmail)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox."
        },
        "recipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of email addresses"
        },
        "ccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "CC Recipients",
          "description": "Array of email addresses"
        },
        "bccRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "BCC Recipients",
          "description": "Array of email addresses"
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Subject of the email"
        },
        "contentType": {
          "type": "string",
          "title": "Content Type",
          "description": "Content type (default `text`)"
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "Content of the email in text or html format"
        },
        "files": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)"
        },
        "syncDir": {
          "type": "string"
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-send-email",
      "version": "0.0.31",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
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
          "name": "recipients",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of email addresses",
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
          "name": "ccRecipients",
          "type": "string[]",
          "label": "CC Recipients",
          "description": "Array of email addresses",
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
          "name": "bccRecipients",
          "type": "string[]",
          "label": "BCC Recipients",
          "description": "Array of email addresses",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "Subject of the email",
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
          "name": "contentType",
          "type": "string",
          "label": "Content Type",
          "description": "Content type (default `text`)",
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
          "name": "content",
          "type": "string",
          "label": "Content",
          "description": "Content of the email in text or html format",
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
          "name": "files",
          "type": "string[]",
          "label": "File Paths or URLs",
          "description": "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
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
          "name": "syncDir",
          "type": "dir",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-send-email",
      "componentName": "Send Email"
    }
  },
  {
    "integration": "outlook",
    "name": "outlook_update_contact",
    "description": "Update an existing contact, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contact": {
          "type": "string",
          "title": "Contact",
          "description": "The contact to be updated"
        },
        "givenName": {
          "type": "string",
          "title": "Given name",
          "description": "Given name of the contact"
        },
        "surname": {
          "type": "string",
          "title": "Surname",
          "description": "Surname of the contact"
        },
        "emailAddresses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Email addresses",
          "description": "Email addresses"
        },
        "businessPhones": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Recipients",
          "description": "Array of phone numbers"
        },
        "expand": {
          "type": "object",
          "title": "Expand",
          "description": "Additional contact details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/contact)"
        }
      },
      "required": [
        "contact"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "outlook",
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
      "app": "outlook",
      "componentId": "microsoft_outlook-update-contact",
      "version": "0.0.29",
      "authPropNames": [
        "microsoftOutlook"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "microsoftOutlook",
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
          "name": "contact",
          "type": "string",
          "label": "Contact",
          "description": "The contact to be updated",
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
          "name": "givenName",
          "type": "string",
          "label": "Given name",
          "description": "Given name of the contact",
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
          "name": "surname",
          "type": "string",
          "label": "Surname",
          "description": "Surname of the contact",
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
          "name": "emailAddresses",
          "type": "string[]",
          "label": "Email addresses",
          "description": "Email addresses",
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
          "name": "businessPhones",
          "type": "string[]",
          "label": "Recipients",
          "description": "Array of phone numbers",
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
          "name": "expand",
          "type": "object",
          "label": "Expand",
          "description": "Additional contact details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/contact)",
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
      "app": "outlook",
      "componentKey": "microsoft_outlook-update-contact",
      "componentName": "Update Contact"
    }
  }
] satisfies PipedreamActionToolManifest[];
