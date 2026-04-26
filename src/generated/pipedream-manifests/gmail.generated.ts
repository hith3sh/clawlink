import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GmailPipedreamToolManifests = [
  {
    "integration": "gmail",
    "name": "gmail_add_label_to_email",
    "description": "Add label(s) to an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "title": "Message",
          "description": "The identifier of a message"
        },
        "addLabelIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Labels",
          "description": "Labels are used to categorize messages and threads within the user's mailbox"
        }
      },
      "required": [
        "message",
        "addLabelIds"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-add-label-to-email",
      "version": "0.0.16",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "message",
          "type": "string",
          "label": "Message",
          "description": "The identifier of a message",
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
          "name": "addLabelIds",
          "type": "string[]",
          "label": "Labels",
          "description": "Labels are used to categorize messages and threads within the user's mailbox",
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
      "app": "gmail",
      "componentKey": "gmail-add-label-to-email",
      "componentName": "Add Label to Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_archive_email",
    "description": "Archive an email message. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "title": "Message",
          "description": "The identifier of a message"
        }
      },
      "required": [
        "message"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-archive-email",
      "version": "0.0.11",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "message",
          "type": "string",
          "label": "Message",
          "description": "The identifier of a message",
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
      "app": "gmail",
      "componentKey": "gmail-archive-email",
      "componentName": "Archive Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_bulk_archive_emails",
    "description": "Archive multiple emails at once. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "messages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Messages",
          "description": "The IDs of the emails to archive. Maximum 1000 messages per request."
        }
      },
      "required": [
        "messages"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-bulk-archive-emails",
      "version": "0.0.1",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "messages",
          "type": "string[]",
          "label": "Messages",
          "description": "The IDs of the emails to archive. Maximum 1000 messages per request.",
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
      "app": "gmail",
      "componentKey": "gmail-bulk-archive-emails",
      "componentName": "Bulk Archive Emails"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_create_draft",
    "description": "Create a draft from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "to": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "To",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "cc": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Cc",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "bcc": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Bcc",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Specify a subject for the email."
        },
        "body": {
          "type": "string",
          "title": "Email Body",
          "description": "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`."
        },
        "bodyType": {
          "type": "string",
          "title": "Body Type",
          "description": "Choose to send as plain text or HTML. Defaults to `plaintext`."
        }
      },
      "required": [
        "to",
        "subject",
        "body"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-create-draft",
      "version": "0.1.12",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "to",
          "type": "string[]",
          "label": "To",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "name": "cc",
          "type": "string[]",
          "label": "Cc",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "name": "bcc",
          "type": "string[]",
          "label": "Bcc",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "description": "Specify a subject for the email.",
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
          "name": "body",
          "type": "string",
          "label": "Email Body",
          "description": "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`.",
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
          "name": "bodyType",
          "type": "string",
          "label": "Body Type",
          "description": "Choose to send as plain text or HTML. Defaults to `plaintext`.",
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
          "name": "attachmentFilenames",
          "type": "string[]",
          "label": "Attachment Filenames",
          "description": "Array of the names of the files to attach. Must contain the file extension (e.g. `.jpeg`, `.txt`). Use in conjuction with `Attachment URLs or Paths`.",
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
          "name": "attachmentUrlsOrPaths",
          "type": "string[]",
          "label": "Attachment URLs or Paths",
          "description": "Array of the URLs of the download links for the files, or the local paths (e.g. `/tmp/my-file.txt`). Use in conjuction with `Attachment Filenames`.",
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
          "name": "inReplyTo",
          "type": "string",
          "label": "In Reply To",
          "description": "Specify the `message-id` this email is replying to.",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "mimeType",
          "type": "string",
          "label": "Mime Type",
          "description": "Mime Type of attachments. Setting the mime-type will override using the filename extension to determine attachment's content type.",
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
          "name": "fromEmail",
          "type": "string",
          "label": "From Email",
          "description": "Specify the email address that will be displayed in the \"From\" section of the email.",
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
          "name": "signature",
          "type": "string",
          "label": "Signature",
          "description": "An HTML signature composed in the Gmail Web UI that will be included in the message. Only works with the `HTML` body type.",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
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
      "app": "gmail",
      "componentKey": "gmail-create-draft",
      "componentName": "Create Draft"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_create_label",
    "description": "Create a new label in the connected account. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The display name of the label"
        },
        "textColor": {
          "type": "string",
          "title": "Text Color",
          "description": "The text color of the label"
        },
        "backgroundColor": {
          "type": "string",
          "title": "Background Color",
          "description": "The background color of the label"
        },
        "messageListVisibility": {
          "type": "string",
          "title": "Message List Visibility",
          "description": "The visibility of messages with this label in the message list in the Gmail web interface"
        },
        "labelListVisibility": {
          "type": "string",
          "title": "Label List Visibility",
          "description": "The visibility of the label in the label list in the Gmail web interface"
        }
      },
      "required": [
        "name",
        "textColor",
        "backgroundColor"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-create-label",
      "version": "0.0.5",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "description": "The display name of the label",
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
          "name": "textColor",
          "type": "string",
          "label": "Text Color",
          "description": "The text color of the label",
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
          "name": "backgroundColor",
          "type": "string",
          "label": "Background Color",
          "description": "The background color of the label",
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
          "name": "messageListVisibility",
          "type": "string",
          "label": "Message List Visibility",
          "description": "The visibility of messages with this label in the message list in the Gmail web interface",
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
          "name": "labelListVisibility",
          "type": "string",
          "label": "Label List Visibility",
          "description": "The visibility of the label in the label list in the Gmail web interface",
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
      "app": "gmail",
      "componentKey": "gmail-create-label",
      "componentName": "Create Label"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_delete_email",
    "description": "Moves the specified message to the trash. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "messageId": {
          "type": "string",
          "title": "Message ID",
          "description": "The ID of the message to delete"
        }
      },
      "required": [
        "messageId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-delete-email",
      "version": "0.0.5",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "messageId",
          "type": "string",
          "label": "Message ID",
          "description": "The ID of the message to delete",
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
      "app": "gmail",
      "componentKey": "gmail-delete-email",
      "componentName": "Delete Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_find_email",
    "description": "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "q": {
          "type": "string",
          "title": "Search Query",
          "description": "Apply a search filter using Gmail's [standard search operators](https://support.google.com/mail/answer/7190)"
        },
        "metadataOnly": {
          "type": "boolean",
          "title": "Metadata Only",
          "description": "Only return metadata for the messages. This reduces the size of the payload and makes it easier for LLMs work with."
        },
        "labels": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Labels",
          "description": "Only return messages with labels that match all of the specified labels."
        },
        "includeSpamTrash": {
          "type": "boolean",
          "title": "Include Spam and Trash?",
          "description": "Include messages from `SPAM` and `TRASH` in the results. Defaults to `false`."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "Maximum number of messages to return. Defaults to `20`."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "withTextPayload": true
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "gmail",
      "componentId": "gmail-find-email",
      "version": "0.1.10",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "q",
          "type": "string",
          "label": "Search Query",
          "description": "Apply a search filter using Gmail's [standard search operators](https://support.google.com/mail/answer/7190)",
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
          "name": "withTextPayload",
          "type": "boolean",
          "label": "Return payload as plaintext",
          "description": "Convert the payload response into a single text field. **This reduces the size of the payload and makes it easier for LLMs work with.**",
          "required": true,
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
          "name": "metadataOnly",
          "type": "boolean",
          "label": "Metadata Only",
          "description": "Only return metadata for the messages. This reduces the size of the payload and makes it easier for LLMs work with.",
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
          "name": "labels",
          "type": "string[]",
          "label": "Labels",
          "description": "Only return messages with labels that match all of the specified labels.",
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
          "name": "includeSpamTrash",
          "type": "boolean",
          "label": "Include Spam and Trash?",
          "description": "Include messages from `SPAM` and `TRASH` in the results. Defaults to `false`.",
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
          "description": "Maximum number of messages to return. Defaults to `20`.",
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
      "app": "gmail",
      "componentKey": "gmail-find-email",
      "componentName": "Find Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_get_current_user",
    "description": "Returns the authenticated Gmail user's name, email address, and mailbox stats (total messages and threads). Call this first when the user says 'my emails', 'my inbox', or needs identity context. Use the returned `emailAddress` to identify the user's own messages in **Find Email** results. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users/getProfile).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-get-current-user",
      "version": "0.0.1",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
      "app": "gmail",
      "componentKey": "gmail-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_get_send_as_alias",
    "description": "Get a send as alias for the authenticated user. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs/get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sendAsEmail": {
          "type": "string",
          "title": "Send As Email",
          "description": "The email address of the send as alias to get"
        }
      },
      "required": [
        "sendAsEmail"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-get-send-as-alias",
      "version": "0.0.5",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "sendAsEmail",
          "type": "string",
          "label": "Send As Email",
          "description": "The email address of the send as alias to get",
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
      "app": "gmail",
      "componentKey": "gmail-get-send-as-alias",
      "componentName": "Get Send As Alias"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_list_labels",
    "description": "List all the existing labels in the connected account. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.labels/list)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-list-labels",
      "version": "0.0.12",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
      "app": "gmail",
      "componentKey": "gmail-list-labels",
      "componentName": "List Labels"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_list_send_as_aliases",
    "description": "List all send as aliases for the authenticated user. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs/list)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-list-send-as-aliases",
      "version": "0.0.5",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
      "app": "gmail",
      "componentKey": "gmail-list-send-as-aliases",
      "componentName": "List Send As Aliases"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_list_thread_messages",
    "description": "List messages in a thread. [See the docs](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "threadId": {
          "type": "string",
          "title": "Thread ID",
          "description": "Identifier of the thread to list messages from"
        }
      },
      "required": [
        "threadId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-list-thread-messages",
      "version": "0.0.2",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "threadId",
          "type": "string",
          "label": "Thread ID",
          "description": "Identifier of the thread to list messages from",
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
      "app": "gmail",
      "componentKey": "gmail-list-thread-messages",
      "componentName": "List Thread Messages"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_remove_label_from_email",
    "description": "Remove label(s) from an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "title": "Message",
          "description": "The identifier of a message"
        },
        "removeLabelIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Labels",
          "description": "The labels to remove from the email"
        }
      },
      "required": [
        "message",
        "removeLabelIds"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-remove-label-from-email",
      "version": "0.0.14",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "message",
          "type": "string",
          "label": "Message",
          "description": "The identifier of a message",
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
          "name": "removeLabelIds",
          "type": "string[]",
          "label": "Labels",
          "description": "The labels to remove from the email",
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
      "app": "gmail",
      "componentKey": "gmail-remove-label-from-email",
      "componentName": "Remove Label from Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_send_email",
    "description": "Send an email from your Google Workspace email account. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "to": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "To",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "cc": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Cc",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "bcc": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Bcc",
          "description": "Enter a single recipient's email or multiple emails as items in an array."
        },
        "replyTo": {
          "type": "string",
          "title": "Reply To",
          "description": "Specify the email address that will appear on the \"Reply-To\" field, if different than the sender's email."
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "Specify a subject for the email."
        },
        "body": {
          "type": "string",
          "title": "Email Body",
          "description": "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`."
        },
        "bodyType": {
          "type": "string",
          "title": "Body Type",
          "description": "Choose to send as plain text or HTML. Defaults to `plaintext`."
        }
      },
      "required": [
        "to",
        "subject",
        "body"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-send-email",
      "version": "0.2.4",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [
        "inReplyTo"
      ],
      "props": [
        {
          "name": "gmail",
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
          "name": "to",
          "type": "string[]",
          "label": "To",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "name": "cc",
          "type": "string[]",
          "label": "Cc",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "name": "bcc",
          "type": "string[]",
          "label": "Bcc",
          "description": "Enter a single recipient's email or multiple emails as items in an array.",
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
          "label": "From Name",
          "description": "Specify the name that will be displayed in the \"From\" section of the email.",
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
          "name": "fromEmail",
          "type": "string",
          "label": "From Email",
          "description": "Specify the email address that will be displayed in the \"From\" section of the email.",
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
          "name": "replyTo",
          "type": "string",
          "label": "Reply To",
          "description": "Specify the email address that will appear on the \"Reply-To\" field, if different than the sender's email.",
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
          "description": "Specify a subject for the email.",
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
          "name": "body",
          "type": "string",
          "label": "Email Body",
          "description": "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`.",
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
          "name": "bodyType",
          "type": "string",
          "label": "Body Type",
          "description": "Choose to send as plain text or HTML. Defaults to `plaintext`.",
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
          "name": "attachmentFilenames",
          "type": "string[]",
          "label": "Attachment Filenames",
          "description": "Array of the names of the files to attach. Must contain the file extension (e.g. `.jpeg`, `.txt`). Use in conjuction with `Attachment URLs or Paths`.",
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
          "name": "attachmentUrlsOrPaths",
          "type": "string[]",
          "label": "Attachment URLs or Paths",
          "description": "Array of the URLs of the download links for the files, or the local paths (e.g. `/tmp/my-file.txt`). Use in conjuction with `Attachment Filenames`.",
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
          "name": "inReplyTo",
          "type": "string",
          "label": "In Reply To",
          "description": "Specify the `message-id` this email is replying to",
          "required": false,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "mimeType",
          "type": "string",
          "label": "Mime Type",
          "description": "Mime Type of attachments. Setting the mime-type will override using the filename extension to determine attachment's content type.",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
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
      "app": "gmail",
      "componentKey": "gmail-send-email",
      "componentName": "Send Email"
    }
  },
  {
    "integration": "gmail",
    "name": "gmail_update_primary_signature",
    "description": "Update the signature for the primary email address. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/update)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "signature": {
          "type": "string",
          "title": "Signature",
          "description": "The new signature."
        }
      },
      "required": [
        "signature"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "gmail",
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
      "app": "gmail",
      "componentId": "gmail-update-primary-signature",
      "version": "0.0.15",
      "authPropNames": [
        "gmail"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "gmail",
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
          "name": "signature",
          "type": "string",
          "label": "Signature",
          "description": "The new signature.",
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
      "app": "gmail",
      "componentKey": "gmail-update-primary-signature",
      "componentName": "Update Signature for Primary Email Address"
    }
  }
] satisfies PipedreamActionToolManifest[];
