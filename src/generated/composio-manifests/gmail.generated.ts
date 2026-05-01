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
    integration: "gmail",
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
      toolkit: "gmail",
      toolSlug: partial.toolSlug,
      version: "20260430_00",
    },
  };
}

export const gmailComposioTools: IntegrationTool[] = [
  composioTool({
    name: "gmail_add_label_to_email",
    description: "Adds and/or removes specified Gmail labels for a message; ensure `message_id` and all `label_ids` are valid (use 'listLabels' for custom label IDs).",
    toolSlug: "GMAIL_ADD_LABEL_TO_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Immutable ID of the message to modify. Gmail message IDs are 15-16 character hexadecimal strings (e.g., '1a2b3c4d5e6f7890'). IMPORTANT: Do NOT use UUIDs (32-character strings like '093ca4662b214d5eba8f4ceeaad63433'), thread IDs, or internal system IDs - these will cause 'Invalid id value' errors. Obtain valid message IDs from: (1) 'GMAIL_FETCH_EMAILS' response 'messageId' field, (2) 'GMAIL_FETCH_MESSAGE_BY_THREAD_ID' response, or (3) 'GMAIL_LIST_THREADS' and then fetching thread messages.",
        },
        add_label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Label IDs to add (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY_PERSONAL, CATEGORY_SOCIAL, CATEGORY_PROMOTIONS, CATEGORY_UPDATES, CATEGORY_FORUMS. Use full CATEGORY_ prefix (e.g., 'CATEGORY_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label_<number>'). Do NOT use the label display name; the API requires the ID. SENT, DRAFT, CHAT are immutable and cannot be added or removed. A label cannot appear in both add_label_ids and remove_label_ids.",
        },
        remove_label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Label IDs to remove (IDs, not display names). System labels: INBOX, SPAM, TRASH, UNREAD, STARRED, IMPORTANT, CATEGORY_PERSONAL, CATEGORY_SOCIAL, CATEGORY_PROMOTIONS, CATEGORY_UPDATES, CATEGORY_FORUMS. Use full CATEGORY_ prefix (e.g., 'CATEGORY_UPDATES' not 'UPDATES'). Custom labels: call 'listLabels' first to get the ID (format: 'Label_<number>'). SENT, DRAFT, CHAT are immutable and cannot be removed. Common operations: to mark as read, remove 'UNREAD'; to archive, remove 'INBOX'. A label cannot appear in both add_label_ids and remove_label_ids.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Modify email labels.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "gmail_batch_delete_messages",
    description: "Tool to permanently delete multiple Gmail messages in bulk, bypassing Trash with no recovery possible. Use when you need to efficiently remove large numbers of emails (e.g., retention enforcement, mailbox hygiene). Use GMAIL_MOVE_TO_TRASH instead when reversibility may be needed. Always obtain explicit user confirmation and verify a sample of message IDs before executing. High-volume calls may trigger 429 rateLimitExceeded or 403 userRateLimitExceeded errors; apply exponential backoff.",
    toolSlug: "GMAIL_BATCH_DELETE_MESSAGES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        messageIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of Gmail message IDs to delete. Each ID must be a 15-16 character hexadecimal string (e.g., '18c5f5d1a2b3c4d5'). Obtain IDs from actions like GMAIL_FETCH_EMAILS or GMAIL_LIST_THREADS - do not use human-readable descriptions.",
        },
      },
      required: [
        "messageIds",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "batch",
      "messages",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch delete Gmail messages.",
    ],
  }),
  composioTool({
    name: "gmail_batch_modify_messages",
    description: "Modify labels on multiple Gmail messages in one efficient API call. Supports up to 1,000 messages per request for bulk operations like archiving, marking as read/unread, or applying custom labels. High-volume calls may return 429 rateLimitExceeded or 403 userRateLimitExceeded; apply exponential backoff.",
    toolSlug: "GMAIL_BATCH_MODIFY_MESSAGES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        messageIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of message IDs to modify. Maximum 1,000 message IDs per request. Get message IDs from GMAIL_FETCH_EMAILS or GMAIL_LIST_THREADS actions. Accepts 'messageIds', 'ids', or 'message_ids' as the parameter name.",
        },
        addLabelIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of label IDs to add to the messages. IMPORTANT: Use label IDs, NOT label display names. System labels use their name as ID: INBOX, STARRED, IMPORTANT, SENT, DRAFT, SPAM, TRASH, UNREAD, CATEGORY_PERSONAL, CATEGORY_SOCIAL, CATEGORY_PROMOTIONS, CATEGORY_UPDATES, CATEGORY_FORUMS. Custom labels MUST use their ID (format: 'Label_XXX', e.g., 'Label_1', 'Label_25'), NOT the display name (e.g., do NOT use 'Work' or 'Projects'). Call GMAIL_LIST_LABELS first to get the 'id' field for custom labels. At least one of add_label_ids or remove_label_ids must be provided. CONSTRAINT: Label IDs must NOT overlap with remove_label_ids - cannot add and remove the same label.",
        },
        removeLabelIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of label IDs to remove from the messages. IMPORTANT: Use label IDs, NOT label display names. System labels use their name as ID: INBOX, STARRED, IMPORTANT, SENT, SPAM, TRASH, UNREAD. Custom labels MUST use their ID (format: 'Label_XXX', e.g., 'Label_1', 'Label_25'), NOT the display name (e.g., do NOT use 'Work' or 'Projects'). Call GMAIL_LIST_LABELS first to get the 'id' field for custom labels. Common use cases: Remove 'UNREAD' to mark as read, remove 'INBOX' to archive. Note: 'DRAFT' cannot be removed - use GMAIL_DELETE_DRAFT instead. At least one of add_label_ids or remove_label_ids must be provided. CONSTRAINT: Label IDs must NOT overlap with add_label_ids - cannot add and remove the same label.",
        },
      },
      required: [
        "messageIds",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "batch",
      "labels",
      "inbox",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch modify Gmail messages.",
    ],
  }),
  composioTool({
    name: "gmail_create_email_draft",
    description: "Creates a Gmail email draft. While all fields are optional per the Gmail API, practical validation requires at least one of recipient_email, cc, or bcc and at least one of subject or body. Supports To/Cc/Bcc recipients, subject, plain/HTML body (ensure `is_html=True` for HTML), attachments, and threading. Returns a draft_id that must be used as-is with GMAIL_SEND_DRAFT — synthetic or stale IDs will fail. When creating a draft reply to an existing thread (thread_id provided), leave subject empty to stay in the same thread; setting a subject will create a NEW thread instead. HTTP 429 may occur on rapid creation/send sequences; apply exponential backoff.",
    toolSlug: "GMAIL_CREATE_EMAIL_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Carbon Copy (CC) recipients' email addresses. Each must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe <user@example.com>'). Plain names without email addresses are NOT valid. Optional for drafts (recipients can be added later before sending).",
        },
        bcc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Blind Carbon Copy (BCC) recipients' email addresses. Each must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'Bob Jones <user@example.com>'). Plain names without email addresses are NOT valid. Optional for drafts (recipients can be added later before sending).",
        },
        body: {
          type: "string",
          description: "Email body content (plain text or HTML); `is_html` must be True if HTML. Optional - drafts can be created without a body and edited later before sending. Can also be provided as 'message_body'.",
        },
        is_html: {
          type: "boolean",
          description: "Set to True if `body` is already formatted HTML. When False, plain text newlines are auto-converted to <br/> tags. Both modes result in HTML email; this flag controls whether the body content is treated as raw HTML or plain text that gets HTML formatting applied.",
        },
        subject: {
          type: "string",
          description: "Email subject line. Optional - drafts can be created without a subject and edited later before sending. When creating a draft reply to an existing thread (thread_id provided), leave this empty to stay in the same thread. Setting a subject will create a NEW thread instead.",
        },
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        thread_id: {
          type: "string",
          description: "ID of an existing Gmail thread to reply to; omit for new thread. If the thread ID is invalid or inaccessible, the draft will be created as a new thread instead of failing.",
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
          description: "File to attach to the email. Must be a dict with fields: name (filename), mimetype (e.g., 'application/pdf'), and s3key (obtained from a prior upload/download response — local paths or guessed keys will fail). Total message size including base64-encoded attachments must be under 25 MB; use shareable links (e.g., Google Drive) for larger files.",
        },
        recipient_email: {
          type: "string",
          description: "Primary recipient's email address. Must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe <user@example.com>'). A plain name without an email address (e.g., 'John Doe') is NOT valid - the '@' symbol and domain are required. Optional for drafts (recipients can be added later before sending). Use extra_recipients if you want to send to multiple recipients.",
        },
        extra_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional 'To' recipients' email addresses (not Cc or Bcc). Each must be a valid email address (e.g., 'user@example.com'), display name format (e.g., 'Jane Doe <user@example.com>'), or 'me' for the authenticated user. Plain names without email addresses are NOT valid. Should only be used if recipient_email is also provided.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create email draft.",
    ],
  }),
  composioTool({
    name: "gmail_create_filter",
    description: "Tool to create a new Gmail filter with specified criteria and actions. Use when the user wants to automatically organize incoming messages based on sender, subject, size, or other criteria. Note: you can only create a maximum of 1,000 filters per account.",
    toolSlug: "GMAIL_CREATE_FILTER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        action: {
          type: "object",
          additionalProperties: true,
          properties: {
            forward: {
              type: "string",
              description: "Email address that the message should be forwarded to.",
            },
            addLabelIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of label IDs to add to the message.",
            },
            removeLabelIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of label IDs to remove from the message.",
            },
          },
          description: "REQUIRED. Action that the filter will perform on messages matching the criteria. At least one action field must be specified.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user for whom the filter will be created.",
        },
        criteria: {
          type: "object",
          additionalProperties: true,
          properties: {
            to: {
              type: "string",
              description: "The recipient's display name or email address. Includes recipients in the 'to', 'cc', and 'bcc' header fields. You can use simply the local part of the email address. For example, 'example' and 'example@' both match 'example@gmail.com'. This field is case-insensitive.",
            },
            from: {
              type: "string",
              description: "The sender's display name or email address.",
            },
            size: {
              type: "integer",
              description: "The size of the entire RFC822 message in bytes, including all headers and attachments.",
            },
            query: {
              type: "string",
              description: "Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, 'from:someuser@example.com rfc822msgid: is:unread'.",
            },
            subject: {
              type: "string",
              description: "Case-insensitive phrase found in the message's subject. Trailing and leading whitespace are trimmed and adjacent spaces are collapsed.",
            },
            excludeChats: {
              type: "boolean",
              description: "Whether the response should exclude chats.",
            },
            negatedQuery: {
              type: "string",
              description: "Only return messages not matching the specified query. Supports the same query format as the Gmail search box.",
            },
            hasAttachment: {
              type: "boolean",
              description: "Whether the message has any attachment.",
            },
            sizeComparison: {
              type: "string",
              description: "How the message size should be compared to the size field.",
              enum: [
                "unspecified",
                "smaller",
                "larger",
              ],
            },
          },
          description: "REQUIRED. Message matching criteria that determines which messages the filter will apply to. At least one criteria field must be specified.",
        },
      },
      required: [
        "criteria",
        "action",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "filters",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Gmail filter.",
    ],
  }),
  composioTool({
    name: "gmail_create_label",
    description: "Creates a new label with a unique name in the specified user's Gmail account. Returns a labelId (e.g., 'Label_123') required for downstream tools like GMAIL_ADD_LABEL_TO_EMAIL, GMAIL_BATCH_MODIFY_MESSAGES, and GMAIL_MODIFY_THREAD_LABELS — those tools do not accept display names.",
    toolSlug: "GMAIL_CREATE_LABEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the user in whose account the label will be created.",
        },
        label_name: {
          type: "string",
          description: "REQUIRED. The name for the new label. Must be unique within the account, non-blank, maximum length 225 characters, cannot contain commas (','), not only whitespace, and must not be a reserved system label. Reserved English system labels include: Inbox, Starred, Important, Sent, Draft, Drafts, Spam, Trash, etc. Forward slashes ('/') are allowed and used to create hierarchical nested labels (e.g., 'Work/Projects', 'Personal/Finance'). When creating nested labels, any missing parent labels will be automatically created (similar to 'mkdir -p'). Periods ('.') are allowed and commonly used for numbering schemes (e.g., '1. Action Items', '2. Projects'). Note: 'name' is also accepted as an alias for this field. If a label with this name already exists, returns a 409 conflict; use GMAIL_LIST_LABELS to check existing labels and reuse the existing labelId, or use GMAIL_PATCH_LABEL to update it.",
        },
        text_color: {
          type: "string",
          description: "Text color for the label. Gmail only accepts colors from a predefined palette of 102 specific hex values. Common color names like 'YELLOW', 'RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'PINK' are automatically mapped to the closest Gmail palette color. Provide either a common color name, a Gmail palette color name (e.g., 'BLACK', 'ROYAL_BLUE'), or exact hex value (e.g., '#000000', '#4a86e8'). If only text_color is provided without background_color, a complementary background color (white or black) will be auto-selected for optimal contrast. Full palette: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels#Color Must be supplied together with background_color — providing only one will cause a 400 error. The auto-selected complementary color behavior does not apply; both colors are required.",
          enum: [
            "#000000",
            "#434343",
            "#666666",
            "#999999",
            "#cccccc",
            "#efefef",
            "#f3f3f3",
            "#ffffff",
            "#fb4c2f",
            "#ffad47",
            "#fad165",
            "#16a766",
            "#43d692",
            "#4a86e8",
            "#a479e2",
            "#f691b3",
            "#f6c5be",
            "#ffe6c7",
            "#fef1d1",
            "#b9e4d0",
            "#c6f3de",
            "#c9daf8",
            "#e4d7f5",
            "#fcdee8",
            "#efa093",
            "#ffd6a2",
            "#fce8b3",
            "#89d3b2",
            "#a0eac9",
            "#a4c2f4",
            "#d0bcf1",
            "#fbc8d9",
            "#e66550",
            "#ffbc6b",
            "#fcda83",
            "#44b984",
            "#68dfa9",
            "#6d9eeb",
            "#b694e8",
            "#f7a7c0",
            "#cc3a21",
            "#eaa041",
            "#f2c960",
            "#149e60",
            "#3dc789",
            "#3c78d8",
            "#8e63ce",
            "#e07798",
            "#ac2b16",
            "#cf8933",
            "#d5ae49",
            "#0b804b",
            "#2a9c68",
            "#285bac",
            "#653e9b",
            "#b65775",
            "#464646",
            "#e7e7e7",
            "#0d3472",
            "#b6cff5",
            "#0d3b44",
            "#98d7e4",
            "#3d188e",
            "#e3d7ff",
            "#711a36",
            "#fbd3e0",
            "#8a1c0a",
            "#f2b2a8",
            "#7a2e0b",
            "#ffc8af",
            "#7a4706",
            "#ffdeb5",
            "#594c05",
            "#fbe983",
            "#684e07",
            "#fdedc1",
            "#0b4f30",
            "#b3efd3",
            "#04502e",
            "#a2dcc1",
            "#c2c2c2",
            "#4986e7",
            "#2da2bb",
            "#b99aff",
            "#994a64",
            "#f691b2",
            "#ff7537",
            "#ffad46",
            "#662e37",
            "#cca6ac",
            "#094228",
            "#42d692",
            "#076239",
            "#16a765",
            "#1a764d",
            "#1c4587",
            "#41236d",
            "#822111",
            "#83334c",
            "#a46a21",
            "#aa8831",
            "#ebdbde",
          ],
        },
        background_color: {
          type: "string",
          description: "Background color for the label. Gmail only accepts colors from a predefined palette of 102 specific hex values. Common color names like 'YELLOW', 'RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'PINK' are automatically mapped to the closest Gmail palette color. Provide either a common color name, a Gmail palette color name (e.g., 'ROYAL_BLUE', 'CARIBBEAN_GREEN'), or exact hex value (e.g., '#4a86e8', '#43d692'). If only background_color is provided without text_color, a complementary text color (white or black) will be auto-selected for optimal contrast. Full palette: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels#Color Must be supplied together with text_color — providing only one will cause a 400 error. The auto-selected complementary color behavior does not apply; both colors are required.",
          enum: [
            "#000000",
            "#434343",
            "#666666",
            "#999999",
            "#cccccc",
            "#efefef",
            "#f3f3f3",
            "#ffffff",
            "#fb4c2f",
            "#ffad47",
            "#fad165",
            "#16a766",
            "#43d692",
            "#4a86e8",
            "#a479e2",
            "#f691b3",
            "#f6c5be",
            "#ffe6c7",
            "#fef1d1",
            "#b9e4d0",
            "#c6f3de",
            "#c9daf8",
            "#e4d7f5",
            "#fcdee8",
            "#efa093",
            "#ffd6a2",
            "#fce8b3",
            "#89d3b2",
            "#a0eac9",
            "#a4c2f4",
            "#d0bcf1",
            "#fbc8d9",
            "#e66550",
            "#ffbc6b",
            "#fcda83",
            "#44b984",
            "#68dfa9",
            "#6d9eeb",
            "#b694e8",
            "#f7a7c0",
            "#cc3a21",
            "#eaa041",
            "#f2c960",
            "#149e60",
            "#3dc789",
            "#3c78d8",
            "#8e63ce",
            "#e07798",
            "#ac2b16",
            "#cf8933",
            "#d5ae49",
            "#0b804b",
            "#2a9c68",
            "#285bac",
            "#653e9b",
            "#b65775",
            "#464646",
            "#e7e7e7",
            "#0d3472",
            "#b6cff5",
            "#0d3b44",
            "#98d7e4",
            "#3d188e",
            "#e3d7ff",
            "#711a36",
            "#fbd3e0",
            "#8a1c0a",
            "#f2b2a8",
            "#7a2e0b",
            "#ffc8af",
            "#7a4706",
            "#ffdeb5",
            "#594c05",
            "#fbe983",
            "#684e07",
            "#fdedc1",
            "#0b4f30",
            "#b3efd3",
            "#04502e",
            "#a2dcc1",
            "#c2c2c2",
            "#4986e7",
            "#2da2bb",
            "#b99aff",
            "#994a64",
            "#f691b2",
            "#ff7537",
            "#ffad46",
            "#662e37",
            "#cca6ac",
            "#094228",
            "#42d692",
            "#076239",
            "#16a765",
            "#1a764d",
            "#1c4587",
            "#41236d",
            "#822111",
            "#83334c",
            "#a46a21",
            "#aa8831",
            "#ebdbde",
          ],
        },
        label_list_visibility: {
          type: "string",
          description: "Controls how the label is displayed in the label list in the Gmail sidebar. Valid values: 'labelShow' (always show), 'labelShowIfUnread' (show only if unread messages), 'labelHide' (hide from list).",
          enum: [
            "labelShow",
            "labelShowIfUnread",
            "labelHide",
          ],
        },
        message_list_visibility: {
          type: "string",
          description: "Controls how messages with this label are displayed in the message list. Valid values: 'show' or 'hide'. Note: These values are different from label_list_visibility - do NOT use 'labelShow' or 'labelHide' here.",
          enum: [
            "show",
            "hide",
          ],
        },
      },
      required: [
        "label_name",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create label.",
    ],
  }),
  composioTool({
    name: "gmail_create_prompt_post",
    description: "Send a one-shot prompt to the Sanity Content Agent. Stateless one-shot prompt endpoint. No thread management or message persistence. Ideal for simple, single-turn interactions. Use when you need to send a single prompt and receive a response without maintaining conversation context.",
    toolSlug: "GMAIL_CREATE_PROMPT_POST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        config: {
          type: "object",
          additionalProperties: true,
          description: "Agent configuration. Controls behavior, capabilities, and document access.",
        },
        format: {
          type: "string",
          description: "Controls how directives in the response are formatted.",
          enum: [
            "markdown",
            "directives",
          ],
        },
        message: {
          type: "string",
          description: "The prompt message to send to the agent",
        },
        instructions: {
          type: "string",
          description: "Custom instructions for the agent",
        },
        organizationId: {
          type: "string",
          description: "Your Sanity organization ID",
        },
      },
      required: [
        "organizationId",
        "message",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "agent",
      "content",
    ],
  }),
  composioTool({
    name: "gmail_delete_draft",
    description: "Permanently deletes a specific Gmail draft using its ID with no recovery possible; verify the correct `draft_id` and obtain explicit user confirmation before calling. Ensure the draft exists and the user has necessary permissions for the given `user_id`.",
    toolSlug: "GMAIL_DELETE_DRAFT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user; 'me' is recommended.",
        },
        draft_id: {
          type: "string",
          description: "Immutable ID of the draft to delete. Must be obtained from GMAIL_LIST_DRAFTS or GMAIL_CREATE_EMAIL_DRAFT actions. Draft IDs typically have an 'r' prefix (e.g., 'r-1234567890' or 'r1234567890'). Draft IDs differ from message IDs used in GMAIL_BATCH_DELETE_MESSAGES — do not interchange. When multiple similar drafts exist, confirm the exact ID via GMAIL_LIST_DRAFTS before deleting.",
        },
      },
      required: [
        "draft_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Draft.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "gmail_delete_filter",
    description: "Tool to permanently delete a Gmail filter by its ID. Use when you need to remove an existing email filtering rule.",
    toolSlug: "GMAIL_DELETE_FILTER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        filter_id: {
          type: "string",
          description: "The ID of the filter to be deleted. Filter IDs can be obtained from GMAIL_LIST_FILTERS action.",
        },
      },
      required: [
        "filter_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "filters",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Gmail filter.",
    ],
  }),
  composioTool({
    name: "gmail_delete_label",
    description: "Permanently DELETES a user-created Gmail label from the account (not from a message). WARNING: This action DELETES the label definition itself, removing it from all messages. System labels (INBOX, SENT, UNREAD, etc.) cannot be deleted. To add/remove labels from specific messages, use GMAIL_ADD_LABEL_TO_EMAIL action instead.",
    toolSlug: "GMAIL_DELETE_LABEL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        label_id: {
          type: "string",
          description: "ID of the user-created label to be permanently DELETED from the account. Must be a custom label ID (format: 'Label_<id>' e.g., 'Label_1', 'Label_42'). System labels (INBOX, SENT, DRAFT, UNREAD, STARRED, IMPORTANT, SPAM, TRASH, CATEGORY_*, etc.) cannot be deleted. WARNING: This action permanently DELETES the label definition from your account - it does NOT remove a label from a message. To add/remove labels from messages, use GMAIL_ADD_LABEL_TO_EMAIL instead.",
        },
      },
      required: [
        "label_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete label from account (permanent).",
    ],
  }),
  composioTool({
    name: "gmail_delete_message",
    description: "Permanently deletes a specific email message by its ID from a Gmail mailbox; for `user_id`, use 'me' for the authenticated user or an email address to which the authenticated user has delegated access.",
    toolSlug: "GMAIL_DELETE_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address. The special value 'me' refers to the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Identifier of the email message to delete.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "mcpignore",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete message.",
    ],
  }),
  composioTool({
    name: "gmail_delete_thread",
    description: "Tool to immediately and permanently delete a specified thread and all its messages. This operation cannot be undone. Use threads.trash instead for reversible deletion.",
    toolSlug: "GMAIL_DELETE_THREAD",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "ID of the Thread to delete.",
        },
        user_id: {
          type: "string",
          description: "User's email address. The special value 'me' refers to the authenticated user.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete thread.",
    ],
  }),
  composioTool({
    name: "gmail_fetch_emails",
    description: "Fetches a list of email messages from a Gmail account, supporting filtering, pagination, and optional full content retrieval. Results are NOT sorted by recency; sort by internalDate client-side. The messages field may be absent or empty (valid no-results state); always null-check before accessing messageId or threadId. Null-check subject and header fields before string operations. For large result sets, prefer ids_only=true or metadata-only listing, then hydrate via GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID.",
    toolSlug: "GMAIL_FETCH_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Gmail advanced search query (e.g., 'from:user subject:meeting'). Supported operators: 'from:', 'to:', 'subject:', 'label:', 'has:', 'is:', 'in:', 'category:', 'after:YYYY/MM/DD', 'before:YYYY/MM/DD', AND/OR/NOT. IMPORTANT - 'is:' vs 'label:' usage: Use 'is:' for special mail states: is:snoozed, is:unread, is:read, is:starred, is:important. Use 'label:' ONLY for user-created labels (e.g., 'label:work', 'label:projects'). Note: 'muted' may work with both 'is:muted' and 'label:muted' based on community reports. Common mistake: 'label:snoozed' is WRONG - use 'is:snoozed' instead. Use quotes for exact phrases. Omit for no query filter. after:/before: evaluate whole calendar days in UTC; before: is exclusive — adjust for local timezone to avoid off-by-one-day gaps.",
        },
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user. Non-'me' addresses require domain-level delegation; without it, authentication or not-found errors result.",
        },
        verbose: {
          type: "boolean",
          description: "If false, uses optimized concurrent metadata fetching for faster performance (~75% improvement). If true, uses standard detailed message fetching. When false, only essential fields (subject, sender, recipient, time, labels) are guaranteed. Body content and attachment details require verbose=true even when include_payload=true.",
        },
        ids_only: {
          type: "boolean",
          description: "If true, only returns message IDs from the list API without fetching individual message details. Fastest option for getting just message IDs and thread IDs.",
        },
        label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by label IDs; only messages with all specified labels are returned (AND logic). Optional - omit or use empty list to fetch all messages without label filtering. System label IDs: 'INBOX', 'SPAM', 'TRASH', 'UNREAD', 'STARRED', 'IMPORTANT', 'CATEGORY_PRIMARY' (alias 'CATEGORY_PERSONAL'), 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', 'CATEGORY_FORUMS'. For custom/user-created labels, you MUST use the label ID (e.g., 'Label_123456'), NOT the display name. Use the 'listLabels' action to find label IDs for custom labels. Combining label_ids with label: in query applies AND logic across both, which can silently over-restrict results; use one strategy consistently.",
        },
        page_token: {
          type: "string",
          description: "Token for retrieving a specific page, obtained from a previous response's `nextPageToken`. Must be a valid opaque token string from a previous API response. Do not pass arbitrary values. Omit for the first page. Loop calls using nextPageToken until it is absent to avoid silently missing messages. resultSizeEstimate is approximate — do not use as a stopping condition.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of messages to retrieve per page. Default of 1 retrieves only a single message; set higher for practical use. Hard cap is 500 per page.",
        },
        include_payload: {
          type: "boolean",
          description: "Set to true to include full message payload (headers, body, attachments); false for metadata only. payload may still be null even when true; use GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID for guaranteed complete content. When payload is present, bodies are base64url-encoded in payload.parts; replace '-'→'+' and '_'→'/' and fix padding before decoding, and check both text/plain and text/html parts.",
        },
        include_spam_trash: {
          type: "boolean",
          description: "Set to true to include messages from 'SPAM' and 'TRASH'.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_fetch_message_by_message_id",
    description: "Fetches a specific email message by its ID, provided the `message_id` exists and is accessible to the authenticated `user_id`. Spam/trash messages are excluded unless upstream list/search calls used `include_spam_trash=true`. Use `internalDate` (milliseconds since epoch) rather than header `Date` for recency checks.",
    toolSlug: "GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        format: {
          type: "string",
          description: "Format for message content. 'minimal': lightest (ID, thread ID, labels only). 'metadata': headers and message metadata without body content - ideal for summarization, analysis, or when you only need subject/sender/timestamp (recommended for most use cases). 'full': complete MIME structure with 50+ headers, nested parts, and base64url-encoded body data - heavy payload, only use when you need the complete raw MIME structure for parsing attachments or body content. 'raw': entire RFC 2822 formatted message as base64url string.",
        },
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "The Gmail API message ID (hexadecimal string, typically 15-16 characters like '19b11732c1b578fd'). Must be obtained from Gmail API responses (e.g., List Messages, Search Messages). Do NOT use email subjects, dates, sender names, or custom identifiers. Do NOT use `threadId` (use GMAIL_FETCH_MESSAGE_BY_THREAD_ID for threads), the Message-ID email header, or any fabricated value — only IDs from Gmail API list/search responses.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_fetch_message_by_thread_id",
    description: "Retrieves messages from a Gmail thread using its `thread_id`, where the thread must be accessible by the specified `user_id`. Returns a `messages` array; `thread_id` is not echoed in the response. Message order is not guaranteed — sort by `internalDate` to find oldest/newest. Check `labelIds` per message to filter drafts. Concurrent bulk calls may trigger 403 `userRateLimitExceeded` or 429; cap concurrency ~10 and use exponential backoff.",
    toolSlug: "GMAIL_FETCH_MESSAGE_BY_THREAD_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the user.",
        },
        thread_id: {
          type: "string",
          description: "Hexadecimal thread ID from Gmail API (e.g., '19bf77729bcb3a44'). Obtain from GMAIL_LIST_THREADS or GMAIL_FETCH_EMAILS. Prefixes like 'msg-f:' or 'thread-f:' are auto-stripped. Legacy Gmail web UI IDs (e.g., 'FMfcgzQfBZdVqKZcSVBhqwWLKWCtDdWQ') are NOT supported - use the API thread ID instead. Deduplicate thread_ids before calling when multiple listed messages share the same threadId to avoid redundant calls.",
        },
        page_token: {
          type: "string",
          description: "Opaque page token for fetching a specific page of messages if results are paginated. Iterate calls by passing the returned `nextPageToken` until it is absent; stopping early will miss messages in long threads.",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_forward_message",
    description: "Forward an existing Gmail message to specified recipients, preserving original body and attachments. Verify recipients and content before forwarding to avoid unintended exposure. Bulk forwarding may trigger 429/5xx rate limits; keep concurrency to 5–10 and apply backoff. Messages near Gmail's size limits may fail; reconstruct a smaller draft if needed.",
    toolSlug: "GMAIL_FORWARD_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to CC.",
        },
        bcc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to BCC.",
        },
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Gmail message ID (hexadecimal string, e.g., '17f45ec49a9c3f1b'). Must contain only hex characters [0-9a-fA-F]. Obtain this from actions like 'List Messages' or 'Fetch Emails'.",
        },
        recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to forward the message to.",
        },
        additional_text: {
          type: "string",
          description: "Optional additional text to include before the forwarded content.",
        },
      },
      required: [
        "message_id",
        "recipients",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Forward email message.",
    ],
  }),
  composioTool({
    name: "gmail_get_attachment",
    description: "Retrieves a specific attachment by ID from a message in a user's Gmail mailbox, requiring valid message and attachment IDs. Returns base64url-encoded binary data (up to ~25 MB); the downloaded file location is at data.file.s3url (also exposes mimetype and name; no s3key). Attachments exceeding ~25 MB may be exposed as Google Drive links — use GOOGLEDRIVE_DOWNLOAD_FILE when a Drive file_id is present instead.",
    toolSlug: "GMAIL_GET_ATTACHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address ('me' for authenticated user).",
        },
        file_name: {
          type: "string",
          description: "Desired filename for the downloaded attachment. This is a required string field - do not pass null.",
        },
        message_id: {
          type: "string",
          description: "Immutable ID of the message containing the attachment. This is a required string field - do not pass null. Obtain the message_id from Gmail API responses (e.g., fetchEmails, listThreads).",
        },
        attachment_id: {
          type: "string",
          description: "The internal Gmail attachment ID (NOT the filename). This is a system-generated token string like 'ANGjdJ8s...'. Obtain this ID from the 'attachmentId' field in the 'attachmentList' array returned by fetchEmails or fetchMessageByMessageId actions. Do NOT pass the filename (e.g., 'report.pdf'). Requires a fully hydrated message payload: call GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID with format='full' to obtain valid attachment IDs — lightweight fetch modes may omit attachmentList entirely.",
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
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_get_auto_forwarding",
    description: "Tool to get the auto-forwarding setting for the specified account. Use when you need to retrieve the current auto-forwarding configuration including enabled status, forwarding email address, and message disposition.",
    toolSlug: "GMAIL_GET_AUTO_FORWARDING",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "mailbox_automation",
    ],
  }),
  composioTool({
    name: "gmail_get_contacts",
    description: "Fetches contacts (connections) for the authenticated Google account, allowing selection of specific data fields and pagination. Only covers saved contacts and 'Other Contacts'; email-header-only senders are out of scope. Contact records may have sparse data — handle missing fields gracefully. People API shares a per-user QPS quota; HTTP 429 requires exponential backoff (1s, 2s, 4s).",
    toolSlug: "GMAIL_GET_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_token: {
          type: "string",
          description: "Token to retrieve a specific page of results, obtained from 'nextPageToken' in a previous response. Repeat calls with each successive `nextPageToken` until it is absent — stopping early silently omits contacts.",
        },
        person_fields: {
          type: "string",
          description: "Comma-separated person fields to retrieve for each contact (e.g., 'names,emailAddresses').",
        },
        resource_name: {
          type: "string",
          description: "Identifier for the person resource whose connections are listed; use 'people/me' for the authenticated user.",
        },
        include_other_contacts: {
          type: "boolean",
          description: "Include 'Other Contacts' (interacted with but not explicitly saved) in addition to regular contacts. WARNING: 'Other Contacts' often have incomplete data - they may lack names, phone numbers, and other fields even when requested. These auto-generated contacts are created from email interactions and typically only have email addresses. Set to False if you need contacts with complete name information. When True, each contact will have a 'contactSource' field indicating its origin. When True, `person_fields` is restricted to `emailAddresses`, `names`, `phoneNumbers`, and `metadata` only — requesting other fields (e.g., `organizations`, `birthdays`) causes validation errors or silent omissions.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_get_draft",
    description: "Retrieves a single Gmail draft by its ID. Use this to fetch and inspect draft content before sending via GMAIL_SEND_DRAFT. The format parameter controls the level of detail returned.",
    toolSlug: "GMAIL_GET_DRAFT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        format: {
          type: "string",
          description: "Format for the draft message: 'minimal' (ID/labels only), 'full' (complete data with parsed payload), 'raw' (base64url-encoded RFC 2822 format), 'metadata' (ID/labels/headers only).",
        },
        user_id: {
          type: "string",
          description: "The user's email address. The special value `me` can be used to indicate the authenticated user.",
        },
        draft_id: {
          type: "string",
          description: "The ID of the draft to retrieve. Draft IDs are typically alphanumeric strings (e.g., 'r99885592323229922'). Use GMAIL_LIST_DRAFTS to retrieve valid draft IDs.",
        },
      },
      required: [
        "draft_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_get_filter",
    description: "Tool to retrieve a specific Gmail filter by its ID. Use when you need to inspect the criteria and actions of an existing filter.",
    toolSlug: "GMAIL_GET_FILTER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the filter to be fetched.",
        },
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "filters",
    ],
  }),
  composioTool({
    name: "gmail_get_label",
    description: "Gets details for a specified Gmail label. Use this to retrieve label information including name, type, visibility settings, message/thread counts, and color.",
    toolSlug: "GMAIL_GET_LABEL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the label to retrieve. Can be a system label (e.g., INBOX, SENT, DRAFT, UNREAD, STARRED, SPAM, TRASH) or a user-created label ID (e.g., Label_1, Label_42).",
        },
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "labels",
    ],
  }),
  composioTool({
    name: "gmail_get_language_settings",
    description: "Tool to retrieve the language settings for a Gmail user. Use when you need to determine the display language preference for the authenticated user or a specific Gmail account.",
    toolSlug: "GMAIL_GET_LANGUAGE_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose language settings are to be retrieved, or the special value 'me' to indicate the currently authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "mailbox_automation",
    ],
  }),
  composioTool({
    name: "gmail_get_people",
    description: "Retrieves either a specific person's details (using `resource_name`) or lists 'Other Contacts' (if `other_contacts` is true), with `person_fields` specifying the data to return. Scope is limited to the authenticated user's own contacts and 'Other Contacts' history only.",
    toolSlug: "GMAIL_GET_PEOPLE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sources: {
          type: "array",
          items: {
            type: "string",
            description: "Source types for reading other contacts.",
            enum: [
              "READ_SOURCE_TYPE_CONTACT",
              "READ_SOURCE_TYPE_PROFILE",
            ],
          },
          description: "Source types to include when retrieving other contacts. READ_SOURCE_TYPE_CONTACT supports basic fields (emailAddresses, metadata, names, phoneNumbers, photos). READ_SOURCE_TYPE_PROFILE supports extended fields (birthdays, genders, organizations, etc.) but requires READ_SOURCE_TYPE_CONTACT to also be included. Applicable only when `other_contacts` is true.",
        },
        page_size: {
          type: "integer",
          description: "The number of 'Other Contacts' to return per page. Applicable only when `other_contacts` is true.",
        },
        page_token: {
          type: "string",
          description: "An opaque token from a previous response to retrieve the next page of 'Other Contacts' results. Applicable only when `other_contacts` is true and paginating.",
        },
        sync_token: {
          type: "string",
          description: "A token from a previous 'Other Contacts' list call to retrieve only changes since the last sync; leave empty for an initial full sync. Applicable only when `other_contacts` is true.",
        },
        person_fields: {
          type: "string",
          description: "A comma-separated field mask to restrict which fields on the person (or persons) are returned. Consult the Google People API documentation for a comprehensive list of valid fields. Omitted fields are silently absent from the response — no error is raised. When `other_contacts` is true, only a restricted subset is valid (`emailAddresses`, `names`, `phoneNumbers`, `metadata`); extended fields like `organizations` or `birthdays` may cause validation errors or silent omissions in that mode.",
        },
        resource_name: {
          type: "string",
          description: "Resource name identifying the person for whom to retrieve information (like the authenticated user or a specific contact). Used only when `other_contacts` is false. Deleted or stale resource_names may return partial records with missing `emailAddresses`, `names`, or other fields.",
        },
        other_contacts: {
          type: "boolean",
          description: "If true, retrieves 'Other Contacts' (people interacted with but not explicitly saved), ignoring `resource_name` and enabling pagination/sync. If false, retrieves information for the single person specified by `resource_name`.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_get_profile",
    description: "Retrieves Gmail profile information (email address, aggregate messagesTotal/threadsTotal, historyId) for a user. messagesTotal counts individual emails; threadsTotal counts conversations; neither is per-label — use GMAIL_FETCH_EMAILS with label filters for label-specific counts. The returned historyId seeds incremental sync via GMAIL_LIST_HISTORY; if historyIdTooOld is returned, rescan with GMAIL_FETCH_EMAILS before resuming. Response may be wrapped under a top-level data field; unwrap before reading fields. A successful call confirms mailbox connectivity but not full mailbox access if granted scopes are narrow. Use the returned email address to dynamically identify the authenticated account rather than hard-coding it.",
    toolSlug: "GMAIL_GET_PROFILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose profile is to be retrieved, or the special value 'me' to indicate the currently authenticated user. Prefer 'me' unless explicitly targeting another account; passing a raw email address that does not match the connected account may fail or access the wrong mailbox.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_get_vacation_settings",
    description: "Tool to retrieve vacation responder settings for a Gmail user. Use when you need to check if out-of-office auto-replies are configured and view their content.",
    toolSlug: "GMAIL_GET_VACATION_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose vacation settings are to be retrieved, or the special value 'me' to indicate the currently authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "mailbox_automation",
    ],
  }),
  composioTool({
    name: "gmail_import_message",
    description: "Tool to import a message into the user's mailbox with standard email delivery scanning and classification. Use when you need to add an existing email to a Gmail account without sending it through SMTP. This method doesn't perform SPF checks, so it might not work for some spam messages.",
    toolSlug: "GMAIL_IMPORT_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        raw: {
          type: "string",
          description: "The entire email message in RFC 2822 format, base64url-encoded. This is the raw email message to import into the mailbox.",
        },
        deleted: {
          type: "boolean",
          description: "Mark the email as permanently deleted (not TRASH) and only visible in Google Vault to a Vault administrator. Only used for Google Workspace accounts.",
        },
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        never_mark_spam: {
          type: "boolean",
          description: "Ignore the Gmail spam classifier decision and never mark this email as SPAM in the mailbox.",
        },
        internal_date_source: {
          type: "string",
          description: "Source for Gmail's internal date of the message.",
          enum: [
            "receivedTime",
            "dateHeader",
          ],
        },
        process_for_calendar: {
          type: "boolean",
          description: "Process calendar invites in the email and add any extracted meetings to the Google Calendar for this user.",
        },
      },
      required: [
        "raw",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Import message.",
    ],
  }),
  composioTool({
    name: "gmail_insert_message",
    description: "Tool to insert a message into the user's mailbox similar to IMAP APPEND. Use when you need to add an email directly to a mailbox bypassing most scanning and classification. This does not send a message.",
    toolSlug: "GMAIL_INSERT_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        raw: {
          type: "string",
          description: "The entire email message in RFC 2822 formatted and base64url encoded string. This is the raw message content that will be inserted into the mailbox.",
        },
        deleted: {
          type: "boolean",
          description: "Mark the email as permanently deleted (not TRASH) and only visible in Google Vault to a Vault administrator. Only used for Google Workspace accounts.",
        },
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        internalDateSource: {
          type: "string",
          description: "Source for Gmail's internal date of the message.",
          enum: [
            "receivedTime",
            "dateHeader",
          ],
        },
      },
      required: [
        "raw",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert message into mailbox.",
    ],
  }),
  composioTool({
    name: "gmail_list_cse_identities",
    description: "Tool to list client-side encrypted identities for an authenticated user. Use when you need to retrieve CSE identity configurations including key pair associations.",
    toolSlug: "GMAIL_LIST_CSE_IDENTITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The requester's primary email address. Use 'me' to indicate the authenticated user.",
        },
        page_size: {
          type: "integer",
          description: "The number of identities to return. If not provided, the page size will default to 20 entries.",
        },
        page_token: {
          type: "string",
          description: "Pagination token indicating which page of identities to return.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "security_encryption",
    ],
  }),
  composioTool({
    name: "gmail_list_cse_keypairs",
    description: "Tool to list client-side encryption key pairs for an authenticated user. Use when you need to retrieve CSE keypair configurations including public keys and enablement states. Supports pagination for large result sets.",
    toolSlug: "GMAIL_LIST_CSE_KEYPAIRS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The requester's primary email address. Use 'me' to indicate the authenticated user.",
        },
        page_size: {
          type: "integer",
          description: "The number of key pairs to return per page. If not provided, the page size will default to 20 entries.",
        },
        page_token: {
          type: "string",
          description: "Pagination token indicating which page of key pairs to return. Omit to return the first page.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "security_encryption",
    ],
  }),
  composioTool({
    name: "gmail_list_drafts",
    description: "Retrieves a paginated list of email drafts from a user's Gmail account. Use verbose=true to get full draft details including subject, body, sender, and timestamp. Draft ordering is non-guaranteed; iterate using page_token until it is absent to retrieve all drafts. Newly created drafts may not appear immediately. Rapid calls may trigger 403 userRateLimitExceeded or 429 errors; apply exponential backoff (1s, 2s, 4s) before retrying.",
    toolSlug: "GMAIL_LIST_DRAFTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's mailbox ID; use 'me' for the authenticated user.",
        },
        verbose: {
          type: "boolean",
          description: "If true, fetches full draft details including subject, sender, recipient, body, and timestamp. If false, returns only draft IDs (faster). Increases response payload size; tune max_results accordingly. Use verbose=true before destructive operations to confirm draft identity by subject, recipient, and timestamp.",
        },
        page_token: {
          type: "string",
          description: "Token from a previous response to retrieve a specific page of drafts. Ordering is non-guaranteed; continue paginating until page_token is absent in the response to retrieve all drafts.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of drafts to return per page.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_list_filters",
    description: "Tool to list all Gmail filters (rules) in the mailbox. Use for security audits to detect malicious filter rules or before creating new filters to avoid duplicates.",
    toolSlug: "GMAIL_LIST_FILTERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user whose filters will be retrieved.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "filters",
    ],
  }),
  composioTool({
    name: "gmail_list_forwarding_addresses",
    description: "Tool to list all forwarding addresses for the specified Gmail account. Use when you need to retrieve the email addresses that are allowed to be used for forwarding messages.",
    toolSlug: "GMAIL_LIST_FORWARDING_ADDRESSES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user whose forwarding addresses will be retrieved.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "forwarding",
    ],
  }),
  composioTool({
    name: "gmail_list_history",
    description: "Tool to list Gmail mailbox change history since a known startHistoryId. Use for incremental mailbox syncs. Persist the latest historyId as a checkpoint across sessions; without it, incremental sync is unreliable. An empty history list in the response is valid and means no new changes occurred.",
    toolSlug: "GMAIL_LIST_HISTORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. Use 'me' to specify the authenticated user.",
        },
        label_id: {
          type: "string",
          description: "Only return history records involving messages with this label ID.",
        },
        page_token: {
          type: "string",
          description: "Token to retrieve a specific page of results. If the response includes nextPageToken, loop requests using this parameter until no nextPageToken is returned; failing to paginate will silently miss changes.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of history records to return. Default is 100; max is 500.",
        },
        history_types: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "messageAdded",
              "messageDeleted",
              "labelAdded",
              "labelRemoved",
            ],
          },
          description: "Filter by specific history types. Allowed values: messageAdded, messageDeleted, labelAdded, labelRemoved.",
        },
        start_history_id: {
          type: "string",
          description: "Required. Returns history records after this ID. If the ID is invalid or too old, the API returns 404. Perform a full sync in that case. Should be a numeric string. On 404 (historyIdTooOld) or 400 (invalidArgument), recover by fetching a fresh historyId via GMAIL_GET_PROFILE, then perform a one-time full sync via GMAIL_FETCH_EMAILS before resuming incremental calls.",
        },
      },
      required: [
        "start_history_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_list_labels",
    description: "Retrieves all system and user-created labels for a Gmail account in a single unpaginated response. Primary use: obtain internal label IDs (e.g., 'Label_123') required by other Gmail tools — display names cannot be used as label identifiers and cause silent failures or errors. System labels (INBOX, UNREAD, SPAM, TRASH, etc.) are case-sensitive and must be used exactly as returned; INBOX, SPAM, and TRASH are read-only and cannot be added/removed via label modification tools. The Gmail search 'label:' operator accepts display names, but label_ids parameters in tools like GMAIL_FETCH_EMAILS require internal IDs from this tool — mixing conventions yields zero results silently. Do not hardcode label IDs across sessions; refresh via this tool on conflict errors.",
    toolSlug: "GMAIL_LIST_LABELS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Identifies the Gmail account (owner's email or 'me' for authenticated user) for which labels will be listed.",
        },
        include_details: {
          type: "boolean",
          description: "If true, fetches detailed info for each label including message/thread counts (messagesTotal, messagesUnread, threadsTotal, threadsUnread). This requires additional API calls and may be slower for accounts with many labels. If false (default), returns basic label info (id, name, type) which is faster. Counts are eventually consistent and may lag real-time mailbox state by a few seconds.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_list_send_as",
    description: "Lists the send-as aliases for a Gmail account, including the primary address and custom 'from' aliases. Use when you need to retrieve available sending addresses for composing emails.",
    toolSlug: "GMAIL_LIST_SEND_AS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user whose send-as aliases will be retrieved.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "send_as_aliases",
    ],
  }),
  composioTool({
    name: "gmail_list_smime_info",
    description: "Lists S/MIME configs for the specified send-as alias. Use when you need to retrieve all S/MIME certificate configurations associated with a specific send-as email address.",
    toolSlug: "GMAIL_LIST_SMIME_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        send_as_email: {
          type: "string",
          description: "The email address that appears in the 'From:' header for mail sent using this alias.",
        },
      },
      required: [
        "send_as_email",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "security_encryption",
    ],
  }),
  composioTool({
    name: "gmail_list_threads",
    description: "Retrieves a list of email threads from a Gmail account, identified by `user_id` (email address or 'me'), supporting filtering and pagination. Spam and trash are excluded by default unless explicitly targeted via `label:spam` or `label:trash` in the query.",
    toolSlug: "GMAIL_LIST_THREADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Filter for threads, using Gmail search query syntax (e.g., 'from:user@example.com is:unread'). Supported operators include `from:`, `to:`, `subject:`, `label:`, `is:unread`, `has:attachment`, `after:`, `before:`. Dates must use `YYYY/MM/DD` format; date operators are UTC-based. Exact subject phrases require quotes (e.g., `subject:'meeting notes'`).",
        },
        user_id: {
          type: "string",
          description: "The user's email address or 'me' to specify the authenticated Gmail account.",
        },
        verbose: {
          type: "boolean",
          description: "If false, returns threads with basic fields (id, snippet, historyId). If true, returns threads with complete message details including headers, body, attachments, and metadata for each message in the thread. Combining `verbose=true` with large `max_results` produces very large responses; keep `max_results` modest when verbose is enabled.",
        },
        page_token: {
          type: "string",
          description: "Token from a previous response to retrieve a specific page of results; omit for the first page.",
        },
        max_results: {
          type: "integer",
          description: "Maximum number of threads to return. Hard cap is ~500 per call. For full mailbox coverage, loop using `nextPageToken` via `page_token` until absent.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_modify_thread_labels",
    description: "Adds or removes specified existing label IDs from a Gmail thread, affecting all its messages; ensure the thread ID is valid. To modify a single message only, use a message-level tool instead.",
    toolSlug: "GMAIL_MODIFY_THREAD_LABELS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        thread_id: {
          type: "string",
          description: "Immutable ID of the thread to modify.",
        },
        add_label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of label IDs to add to the thread. Must be valid label IDs that exist in the user's account. System labels use uppercase names (e.g., 'INBOX', 'STARRED', 'IMPORTANT', 'UNREAD', 'SPAM', 'TRASH', 'SENT', 'DRAFT', 'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', 'CATEGORY_FORUMS'). Custom labels use the format 'Label_N' (e.g., 'Label_1', 'Label_42'). Use GMAIL_LIST_LABELS to discover available label IDs. Accepts either a list or a JSON-encoded string. Note: If a label appears in both add_label_ids and remove_label_ids, the add operation takes priority. Use GMAIL_CREATE_LABEL first if the label does not yet exist, then supply its returned ID here.",
        },
        remove_label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of label IDs to remove from the thread. Must be valid label IDs that exist in the user's account. System labels use uppercase names (e.g., 'INBOX', 'STARRED', 'IMPORTANT', 'UNREAD', 'SPAM', 'TRASH', 'SENT', 'DRAFT', 'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', 'CATEGORY_FORUMS'). Custom labels use the format 'Label_N' (e.g., 'Label_1', 'Label_42'). Use GMAIL_LIST_LABELS to discover available label IDs. Accepts either a list or a JSON-encoded string. Note: Labels that appear in both add_label_ids and remove_label_ids will be automatically removed from this list (add takes priority).",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Modify thread labels.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "gmail_move_thread_to_trash",
    description: "Moves the specified thread to the trash. Any messages that belong to the thread are also moved to the trash.",
    toolSlug: "GMAIL_MOVE_THREAD_TO_TRASH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        thread_id: {
          type: "string",
          description: "Required. The ID of the thread to trash. This moves all messages in the thread to trash.",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Trash thread.",
    ],
  }),
  composioTool({
    name: "gmail_move_to_trash",
    description: "Moves an existing, non-deleted email message to the trash for the specified user. Trashed messages are recoverable and still count toward storage quota until purged. Prefer this over GMAIL_BATCH_DELETE_MESSAGES when recovery may be needed. For bulk operations, use GMAIL_BATCH_MODIFY_MESSAGES or GMAIL_BATCH_DELETE_MESSAGES instead of repeated calls to this tool.",
    toolSlug: "GMAIL_MOVE_TO_TRASH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Required. The unique identifier of the email message to move to trash. This is a hexadecimal string that can be obtained from listing or fetching emails. Verify the correct message via subject/snippet before trashing to avoid affecting unrelated conversations.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Move to Trash.",
    ],
  }),
  composioTool({
    name: "gmail_patch_label",
    description: "Patches the specified user-created label. System labels (e.g., INBOX, SENT, SPAM) cannot be modified and will be rejected.",
    toolSlug: "GMAIL_PATCH_LABEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the label to update.",
        },
        name: {
          type: "string",
          description: "The display name of the label. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. Must be non-empty, unique among user labels, and must not contain `,`, `/`, or `.`.",
        },
        color: {
          type: "object",
          additionalProperties: true,
          properties: {
            textColor: {
              type: "string",
              description: "The text color of the label, represented as a hex string. Must be one of Gmail's predefined colors from the color palette. See: https://developers.google.com/workspace/gmail/api/guides/labels#color_palette",
            },
            backgroundColor: {
              type: "string",
              description: "The background color of the label, represented as a hex string. Must be one of Gmail's predefined colors from the color palette. See: https://developers.google.com/workspace/gmail/api/guides/labels#color_palette",
            },
          },
          description: "The color to assign to the label. Color is only available for labels that have their `type` set to `user`. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided. Must include both `backgroundColor` and `textColor` subfields; both values must come from Gmail's predefined color palette — arbitrary hex values or omitting either field causes a 400 error.",
        },
        userId: {
          type: "string",
          description: "The user's email address. The special value `me` can be used to indicate the authenticated user.",
        },
        labelListVisibility: {
          type: "string",
          description: "The visibility of the label in the label list in the Gmail web interface. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided.",
          enum: [
            "labelShow",
            "labelShowIfUnread",
            "labelHide",
          ],
        },
        messageListVisibility: {
          type: "string",
          description: "The visibility of messages with this label in the message list in the Gmail web interface. At least one of 'name', 'messageListVisibility', 'labelListVisibility', or 'color' must be provided.",
          enum: [
            "show",
            "hide",
          ],
        },
      },
      required: [
        "userId",
        "id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "labels",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Label.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "gmail_patch_send_as",
    description: "Tool to patch the specified send-as alias for a Gmail user. Use when you need to update properties of an existing send-as email address such as display name, reply-to address, signature, default status, or SMTP configuration.",
    toolSlug: "GMAIL_PATCH_SEND_AS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user.",
        },
        smtp_msa: {
          type: "object",
          additionalProperties: true,
          properties: {
            host: {
              type: "string",
              description: "The hostname of the SMTP service. Required when configuring SMTP.",
            },
            port: {
              type: "integer",
              description: "The port of the SMTP service. Required when configuring SMTP.",
            },
            password: {
              type: "string",
              description: "The password for SMTP authentication. This is write-only and never appears in responses.",
            },
            username: {
              type: "string",
              description: "The username for SMTP authentication. This is write-only and never appears in responses.",
            },
            securityMode: {
              type: "string",
              description: "The protocol that will be used to secure communication with the SMTP service. Required when configuring SMTP.",
              enum: [
                "securityModeUnspecified",
                "none",
                "ssl",
                "starttls",
              ],
            },
          },
          description: "Configuration for SMTP relay service.",
        },
        signature: {
          type: "string",
          description: "An optional HTML signature that is included in messages composed with this alias in the Gmail web UI. This signature is added to new emails only.",
        },
        is_default: {
          type: "boolean",
          description: "Whether this address is selected as the default 'From:' address in situations such as composing a new message or sending a vacation auto-reply. Setting this to true will make other send-as addresses non-default. Only true can be written to this field.",
        },
        display_name: {
          type: "string",
          description: "A name that appears in the 'From:' header for mail sent using this alias. For custom 'from' addresses, when empty, Gmail will populate the 'From:' header with the name used for the primary address. If the admin has disabled name updates, requests to update this field for the primary login will silently fail.",
        },
        send_as_email: {
          type: "string",
          description: "The send-as alias email address to update. This is the email address that appears in the 'From:' header.",
        },
        treat_as_alias: {
          type: "boolean",
          description: "Whether Gmail should treat this address as an alias for the user's primary email address. This setting only applies to custom 'from' aliases.",
        },
        reply_to_address: {
          type: "string",
          description: "An optional email address that is included in a 'Reply-To:' header for mail sent using this alias. If empty, Gmail will not generate a 'Reply-To:' header.",
        },
      },
      required: [
        "send_as_email",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "send_as_aliases",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch send-as alias.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "gmail_reply_to_thread",
    description: "Sends a reply within a specific Gmail thread using the original thread's subject; do not provide a custom subject as it will start a new conversation instead of replying in-thread. Requires a valid `thread_id` and at least one of `recipient_email`, `cc`, or `bcc`. Supports attachments via the `attachment` parameter with `name`, `mimetype`, and `s3key` fields.",
    toolSlug: "GMAIL_REPLY_TO_THREAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Carbon Copy (CC) recipients' email addresses in format 'user@domain.com'. Each address must include both username and domain separated by '@'. At least one of cc, bcc, or recipient_email must be provided.",
        },
        bcc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Blind Carbon Copy (BCC) recipients' email addresses in format 'user@domain.com'. Each address must include both username and domain separated by '@'. At least one of cc, bcc, or recipient_email must be provided.",
        },
        is_html: {
          type: "boolean",
          description: "Indicates if `message_body` is HTML; if True, body must be valid HTML, if False, body should not contain HTML tags. Mismatch causes recipients to see raw HTML tags as plain text.",
        },
        user_id: {
          type: "string",
          description: "Identifier for the user sending the reply; 'me' refers to the authenticated user.",
        },
        thread_id: {
          type: "string",
          description: "Identifier of the Gmail thread for the reply. Must be a valid hexadecimal string, typically 15-16 characters long (e.g., '169eefc8138e68ca'). Prefixes like 'msg-f:' or 'thread-f:' are automatically stripped. Note: Format validation only checks the ID structure; the thread must also exist and be accessible in your Gmail account. Use GMAIL_LIST_THREADS or GMAIL_FETCH_EMAILS to retrieve valid thread IDs. Must be a threadId, not a messageId; passing a messageId can cause the reply to fail or start an unintended new thread.",
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
          description: "File to attach to the reply. Just Provide file path here Requires `name`, `mimetype`, and `s3key` fields; `s3key` must come from a prior upload/download response. Total message size including attachments must stay under 25 MB (400 badRequest if exceeded); use Drive links for large files.",
        },
        message_body: {
          type: "string",
          description: "Content of the reply message, either plain text or HTML.",
        },
        recipient_email: {
          type: "string",
          description: "Primary recipient's email address in format 'user@domain.com'. Must include both username and domain separated by '@'. Required if cc and bcc is not provided, else can be optional. Use extra_recipients if you want to send to multiple recipients.",
        },
        extra_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional 'To' recipients' email addresses in format 'user@domain.com' (not Cc or Bcc). Each address must include both username and domain separated by '@'. Should only be used if recipient_email is also provided.",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Reply to email thread.",
    ],
  }),
  composioTool({
    name: "gmail_search_people",
    description: "Searches contacts by matching the query against names, nicknames, emails, phone numbers, and organizations, optionally including 'Other Contacts'. Only searches the authenticated user's contact directory — people existing solely in message headers won't appear; use GMAIL_FETCH_EMAILS for those. Results may be zero or multiple; never auto-select from ambiguous results. Results paginate via next_page_token; follow until empty and deduplicate by email. Many records lack emailAddresses or names even when requested — handle missing keys. Directory/organization policies may suppress entries.",
    toolSlug: "GMAIL_SEARCH_PEOPLE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "Matches contact names, nicknames, email addresses, phone numbers, and organization fields.",
        },
        page_size: {
          type: "integer",
          description: "Maximum results to return; values >30 are capped to 30 by the API.",
        },
        person_fields: {
          type: "string",
          description: "Comma-separated fields to return (e.g., 'names,emailAddresses'). When 'other_contacts' is true, only 'emailAddresses', 'metadata', 'names', 'phoneNumbers' are allowed. For full field access including 'organizations', set 'other_contacts' to false.",
        },
        other_contacts: {
          type: "boolean",
          description: "When True, searches both saved contacts and 'Other Contacts' (people you've interacted with but not explicitly saved). Note: This restricts person_fields to only 'emailAddresses', 'metadata', 'names', 'phoneNumbers'. When False, searches only saved contacts but allows all person_fields including 'organizations', 'addresses', etc.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
    ],
  }),
  composioTool({
    name: "gmail_send_draft",
    description: "Sends an existing draft email AS-IS to recipients already defined within the draft. IMPORTANT: This action does NOT accept recipient parameters (to, cc, bcc). The Gmail API's drafts/send endpoint sends drafts to whatever recipients are already set in the draft's To, Cc, and Bcc headers - it cannot add or override recipients. If the draft has no recipients, you must either: 1. Create a new draft with recipients using GMAIL_CREATE_EMAIL_DRAFT, then send it 2. Use GMAIL_SEND_EMAIL to send a new email directly with recipients. Send is immediate and irreversible — confirm recipients and content before calling. No scheduling support; trigger at the desired UTC time externally. Gmail enforces ~25 MB message size limit and daily send caps (~500 recipients/day personal, ~2,000/day Workspace).",
    toolSlug: "GMAIL_SEND_DRAFT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value `me` can be used to indicate the authenticated user.",
        },
        draft_id: {
          type: "string",
          description: "The ID of the draft to send. Draft IDs are typically alphanumeric strings (e.g., 'r99885592323229922'). Important: Do not confuse draft_id with message_id - they are different identifiers. Use GMAIL_LIST_DRAFTS to retrieve valid draft IDs, or GMAIL_CREATE_EMAIL_DRAFT to create a new draft and get its ID. IMPORTANT: The draft MUST already have recipients (To, Cc, or Bcc) set - this action cannot add or override recipients. If the draft has no recipients, first create a new draft with recipients using GMAIL_CREATE_EMAIL_DRAFT, or use GMAIL_SEND_EMAIL to send a new email directly.",
        },
      },
      required: [
        "draft_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Send Draft.",
    ],
  }),
  composioTool({
    name: "gmail_send_email",
    description: "Sends an email via Gmail API using the authenticated user's Google profile display name. Sends immediately and is irreversible — confirm recipients, subject, body, and attachments before calling. At least one of 'to' (or 'recipient_email'), 'cc', or 'bcc' must be provided. At least one of subject or body must be provided. Requires `is_html=True` if the body contains HTML. All common file types including PNG, JPG, PDF, MP4, etc. are supported as attachments. Gmail API limits total message size to ~25 MB after base64 encoding. To reply in an existing thread, use GMAIL_REPLY_TO_THREAD instead. No scheduled send support; enforce timing externally.",
    toolSlug: "GMAIL_SEND_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Carbon Copy (CC) recipients' email addresses. At least one of 'to'/'recipient_email', 'cc', or 'bcc' must be provided.",
        },
        bcc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Blind Carbon Copy (BCC) recipients' email addresses. At least one of 'to'/'recipient_email', 'cc', or 'bcc' must be provided.",
        },
        body: {
          type: "string",
          description: "Email content (plain text or HTML). Either subject or body must be provided for the email to be sent. If HTML, `is_html` must be `True`.",
        },
        is_html: {
          type: "boolean",
          description: "Set to `True` if the email body contains HTML tags.",
        },
        subject: {
          type: "string",
          description: "Subject line of the email. Either subject or body must be provided for the email to be sent.",
        },
        user_id: {
          type: "string",
          description: "User's email address; the literal 'me' refers to the authenticated user.",
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
          description: "File to attach. IMPORTANT: mimetype MUST contain a '/' separator - single words like 'pdf' or 'new' are invalid. Gmail API limits: total message size must not exceed ~25 MB after base64 encoding. Omit or set to null for no attachment. Empty attachment objects (with all fields empty/whitespace) are treated as no attachment. Must include valid name, mimetype (e.g., 'application/pdf'), and s3key obtained from a prior upload/download response — local paths or guessed keys cause 404 HeadObject errors.",
        },
        from_email: {
          type: "string",
          description: "Sender email address for the 'From' header. Use this to send from a verified alias configured in Gmail's 'Send mail as' settings. When not provided, the authenticated user's primary email address is used. The alias must be verified in Gmail settings before use.",
        },
        recipient_email: {
          type: "string",
          description: "Primary recipient's email address. You can also use 'to' as an alias for this parameter. At least one of 'to'/'recipient_email', 'cc', or 'bcc' must be provided. Use extra_recipients if you want to send to multiple recipients. Use the special value 'me' to send to your own authenticated email address. Must be a full user@domain address; 'me' is not valid here and will fail.",
        },
        extra_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional 'To' recipients' email addresses (not Cc or Bcc). Should only be used if recipient_email is also provided.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Email.",
    ],
  }),
  composioTool({
    name: "gmail_settings_get_imap",
    description: "Retrieves the IMAP settings for a Gmail user account, including whether IMAP is enabled, auto-expunge behavior, expunge behavior, and maximum folder size.",
    toolSlug: "GMAIL_SETTINGS_GET_IMAP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address or the special value 'me' to indicate the authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "mail_protocols",
    ],
  }),
  composioTool({
    name: "gmail_settings_get_pop",
    description: "Tool to retrieve POP settings for a Gmail account. Use when you need to check the current POP configuration including access window and message disposition.",
    toolSlug: "GMAIL_SETTINGS_GET_POP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "mail_protocols",
    ],
  }),
  composioTool({
    name: "gmail_settings_send_as_get",
    description: "Tool to retrieve a specific send-as alias configuration for a Gmail user. Use when you need to get details about a send-as email address including display name, signature, SMTP settings, and verification status. Fails with HTTP 404 if the specified address is not a member of the send-as collection.",
    toolSlug: "GMAIL_SETTINGS_SEND_AS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose send-as alias to retrieve, or the special value 'me' to indicate the authenticated user.",
        },
        send_as_email: {
          type: "string",
          description: "The send-as alias email address to retrieve. This is the email address that appears in the 'From:' header.",
        },
      },
      required: [
        "send_as_email",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "read",
      "send_as_aliases",
    ],
  }),
  composioTool({
    name: "gmail_stop_watch",
    description: "Tool to stop receiving push notifications for a Gmail mailbox. Use when you need to disable watch notifications previously set up via the watch endpoint.",
    toolSlug: "GMAIL_STOP_WATCH",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "watch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Stop watch notifications.",
    ],
  }),
  composioTool({
    name: "gmail_untrash_message",
    description: "Tool to remove a message from trash in Gmail. Use when you need to restore a previously trashed email message.",
    toolSlug: "GMAIL_UNTRASH_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        message_id: {
          type: "string",
          description: "Required. The unique identifier of the email message to remove from trash. This is a hexadecimal string that can be obtained from listing or fetching emails.",
        },
      },
      required: [
        "message_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Untrash Message.",
    ],
  }),
  composioTool({
    name: "gmail_untrash_thread",
    description: "Tool to remove a thread from trash in Gmail. Use when you need to restore a deleted thread and its messages.",
    toolSlug: "GMAIL_UNTRASH_THREAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        thread_id: {
          type: "string",
          description: "The ID of the thread to remove from trash.",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Untrash thread.",
    ],
  }),
  composioTool({
    name: "gmail_update_draft",
    description: "Updates (replaces) an existing Gmail draft's content in-place by draft ID. This action replaces the entire draft content with the new message - it does not patch individual fields. All fields are optional; if not provided, you should provide complete draft content to avoid data loss.",
    toolSlug: "GMAIL_UPDATE_DRAFT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Carbon Copy (CC) recipients' email addresses. Each must be a valid email address or display name format.",
        },
        bcc: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Blind Carbon Copy (BCC) recipients' email addresses. Each must be a valid email address or display name format.",
        },
        body: {
          type: "string",
          description: "Email body content (plain text or HTML); is_html must be True if HTML. If not provided, previous body is preserved. Can also be provided as 'message_body'.",
        },
        is_html: {
          type: "boolean",
          description: "Set to True if body is already formatted HTML. When False, plain text newlines are auto-converted to <br/> tags.",
        },
        subject: {
          type: "string",
          description: "Email subject line. If not provided, previous subject is preserved.",
        },
        user_id: {
          type: "string",
          description: "User's email address or 'me' for the authenticated user.",
        },
        draft_id: {
          type: "string",
          description: "The ID of the draft to update. Must be a valid draft ID from GMAIL_LIST_DRAFTS or GMAIL_CREATE_EMAIL_DRAFT.",
        },
        thread_id: {
          type: "string",
          description: "ID of an existing Gmail thread. If provided, the draft will be part of this thread.",
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
          description: "File to attach to the draft. Replaces any existing attachments.",
        },
        recipient_email: {
          type: "string",
          description: "Primary recipient's email address. Must be a valid email address (e.g., 'user@example.com') or display name format (e.g., 'John Doe <user@example.com>'). Optional - if not provided, previous recipients are preserved.",
        },
        extra_recipients: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional 'To' recipients' email addresses. Each must be a valid email address or display name format. Should only be used if recipient_email is also provided.",
        },
      },
      required: [
        "draft_id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "messages",
    ],
    askBefore: [
      "Confirm the parameters before executing Update draft.",
    ],
  }),
  composioTool({
    name: "gmail_update_imap_settings",
    description: "Tool to update IMAP settings for a Gmail account. Use when you need to modify IMAP configuration such as enabling/disabling IMAP, setting auto-expunge behavior, or configuring folder size limits.",
    toolSlug: "GMAIL_UPDATE_IMAP_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        enabled: {
          type: "boolean",
          description: "Whether IMAP is enabled for the account.",
        },
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        autoExpunge: {
          type: "boolean",
          description: "If this value is true, Gmail will immediately expunge a message when it is marked as deleted in IMAP. Otherwise, Gmail will wait for an update from the client before expunging messages marked as deleted.",
        },
        maxFolderSize: {
          type: "integer",
          description: "An optional limit on the number of messages that an IMAP folder may contain. Legal values are 0, 1000, 2000, 5000 or 10000. A value of zero is interpreted to mean that there is no limit.",
        },
        expungeBehavior: {
          type: "string",
          description: "The action that will be executed on a message when it is marked as deleted and expunged from the last visible IMAP folder. Possible values: 'expungeBehaviorUnspecified' (Unspecified behavior), 'archive' (Archive messages marked as deleted), 'trash' (Move messages marked as deleted to the trash), 'deleteForever' (Immediately and permanently delete messages marked as deleted).",
          enum: [
            "expungeBehaviorUnspecified",
            "archive",
            "trash",
            "deleteForever",
          ],
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "mail_protocols",
    ],
    askBefore: [
      "Confirm the parameters before executing Update IMAP settings.",
    ],
  }),
  composioTool({
    name: "gmail_update_label",
    description: "Tool to update the properties of an existing Gmail label. Use when you need to modify label name, visibility settings, or color.",
    toolSlug: "GMAIL_UPDATE_LABEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the label to update.",
        },
        name: {
          type: "string",
          description: "The display name of the label.",
        },
        color: {
          type: "object",
          additionalProperties: true,
          properties: {
            textColor: {
              type: "string",
              description: "The text color of the label, represented as hex string. This field is required in order to set the color of a label. Only predefined Gmail color values are allowed. See: https://developers.google.com/workspace/gmail/api/guides/labels#color_palette",
            },
            backgroundColor: {
              type: "string",
              description: "The background color represented as hex string #RRGGBB (ex #000000). This field is required in order to set the color of a label. Only predefined Gmail color values are allowed. See: https://developers.google.com/workspace/gmail/api/guides/labels#color_palette",
            },
          },
          description: "Color settings for the label. Both backgroundColor and textColor must be provided together.",
        },
        userId: {
          type: "string",
          description: "The user's email address. The special value `me` can be used to indicate the authenticated user.",
        },
        labelListVisibility: {
          type: "string",
          description: "Visibility of the label in the label list (Gmail sidebar).",
          enum: [
            "labelShow",
            "labelShowIfUnread",
            "labelHide",
          ],
        },
        messageListVisibility: {
          type: "string",
          description: "Visibility of messages with this label in the message list.",
          enum: [
            "show",
            "hide",
          ],
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "labels",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Label.",
    ],
  }),
  composioTool({
    name: "gmail_update_language_settings",
    description: "Tool to update the language settings for a Gmail user. Use when you need to change the display language preference for the authenticated user or a specific Gmail account. The returned displayLanguage may differ from the requested value if Gmail selects a close variant.",
    toolSlug: "GMAIL_UPDATE_LANGUAGE_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose language settings are to be updated, or the special value 'me' to indicate the currently authenticated user.",
        },
        display_language: {
          type: "string",
          description: "The language to display Gmail in, formatted as an RFC 3066 Language Tag (e.g., 'en-GB' for British English, 'fr' for French, 'ja' for Japanese, 'es' for Spanish, 'de' for German, 'en' for English). The set of languages supported by Gmail evolves over time. Note: Gmail may save a close variant if the requested language is not directly supported. For example, if you request a regional variant that's not available, Gmail may save the base language instead.",
        },
      },
      required: [
        "display_language",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Language Settings.",
    ],
  }),
  composioTool({
    name: "gmail_update_pop_settings",
    description: "Tool to update POP settings for a Gmail account. Use when you need to configure POP access window or message disposition behavior.",
    toolSlug: "GMAIL_UPDATE_POP_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        disposition: {
          type: "string",
          description: "The action that will be executed on a message after it has been fetched via POP.",
          enum: [
            "dispositionUnspecified",
            "leaveInInbox",
            "archive",
            "trash",
            "markRead",
          ],
        },
        access_window: {
          type: "string",
          description: "The range of messages which are accessible via POP.",
          enum: [
            "accessWindowUnspecified",
            "disabled",
            "fromNowOn",
            "allMail",
          ],
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "mail_protocols",
    ],
    askBefore: [
      "Confirm the parameters before executing Update POP settings.",
    ],
  }),
  composioTool({
    name: "gmail_update_send_as",
    description: "Tool to update a send-as alias for a Gmail user. Use when you need to modify display name, signature, reply-to address, or SMTP settings for a send-as email address. Gmail sanitizes HTML signatures before saving. Addresses other than the primary can only be updated by service accounts with domain-wide authority.",
    toolSlug: "GMAIL_UPDATE_SEND_AS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The email address of the Gmail user whose send-as alias to update, or the special value 'me' to indicate the authenticated user.",
        },
        smtp_msa: {
          type: "object",
          additionalProperties: true,
          properties: {
            host: {
              type: "string",
              description: "The hostname of the SMTP service. Required when configuring SMTP.",
            },
            port: {
              type: "integer",
              description: "The port of the SMTP service. Required when configuring SMTP.",
            },
            password: {
              type: "string",
              description: "SMTP authentication password. Write-only field, never appears in responses.",
            },
            username: {
              type: "string",
              description: "SMTP authentication username. Write-only field, never appears in responses.",
            },
            securityMode: {
              type: "string",
              description: "Protocol for securing SMTP communication. Required when configuring SMTP.",
              enum: [
                "securityModeUnspecified",
                "none",
                "ssl",
                "starttls",
              ],
            },
          },
          description: "SMTP relay configuration for the send-as alias.",
        },
        signature: {
          type: "string",
          description: "Optional HTML signature for messages composed with this alias in Gmail web UI. Gmail sanitizes HTML before saving. Only added to new emails.",
        },
        is_default: {
          type: "boolean",
          description: "Set to true to make this the default 'From:' address for composing messages and vacation auto-replies. Setting true makes the previous default false. Only legal writable value is true.",
        },
        display_name: {
          type: "string",
          description: "Name to appear in 'From:' header. For custom from addresses, Gmail populates with primary account name if empty. Admin restrictions may silently fail updates to primary login name.",
        },
        send_as_email: {
          type: "string",
          description: "The send-as alias email address to update. This is the email address that appears in the 'From:' header.",
        },
        treat_as_alias: {
          type: "boolean",
          description: "Whether Gmail treats this address as an alias for the user's primary email. Only applies to custom from aliases.",
        },
        reply_to_address: {
          type: "string",
          description: "Optional email address for 'Reply-To:' header. Gmail omits header if empty.",
        },
      },
      required: [
        "send_as_email",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "send_as_aliases",
    ],
    askBefore: [
      "Confirm the parameters before executing Update send-as alias.",
    ],
  }),
  composioTool({
    name: "gmail_update_user_attributes_values",
    description: "Update user attribute values for a resource. Use this action to set or update custom attributes for a user within an organization or project. When setting a value for an attribute key that also exists in SAML, the Sanity value will take precedence and shadow the SAML value.",
    toolSlug: "GMAIL_UPDATE_USER_ATTRIBUTES_VALUES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "The unique identifier of the user whose attributes to update.",
        },
        attributes: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of attribute key-value pairs to set for the user. Values can be strings, numbers, booleans, arrays, or nested objects. These will shadow any SAML values for the same keys.",
        },
        resourceId: {
          type: "string",
          description: "The unique identifier of the resource. For organizations, this is the organization ID.",
        },
        resourceType: {
          type: "string",
          description: "The type of resource that scopes the user attributes (e.g., 'organization' or 'project').",
          enum: [
            "organization",
            "project",
          ],
        },
      },
      required: [
        "resourceType",
        "resourceId",
        "userId",
        "attributes",
      ],
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "user_attributes",
    ],
    askBefore: [
      "Confirm the parameters before executing Update User Attributes Values.",
    ],
  }),
  composioTool({
    name: "gmail_update_vacation_settings",
    description: "Tool to update vacation responder settings for a Gmail user. Use when you need to configure out-of-office auto-replies.",
    toolSlug: "GMAIL_UPDATE_VACATION_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        userId: {
          type: "string",
          description: "The user's email address. The special value 'me' can be used to indicate the authenticated user.",
        },
        endTime: {
          type: "string",
          description: "An optional end time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives before the end time. If both startTime and endTime are specified, startTime must precede endTime.",
        },
        startTime: {
          type: "string",
          description: "An optional start time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives after the start time. If both startTime and endTime are specified, startTime must precede endTime.",
        },
        enableAutoReply: {
          type: "boolean",
          description: "Flag that controls whether Gmail automatically replies to messages.",
        },
        responseSubject: {
          type: "string",
          description: "Optional text to prepend to the subject line in vacation responses. In order to enable auto-replies, either the response subject or the response body must be nonempty.",
        },
        responseBodyHtml: {
          type: "string",
          description: "Response body in HTML format. Gmail will sanitize the HTML before storing it. If both response_body_plain_text and response_body_html are specified, response_body_html will be used.",
        },
        restrictToDomain: {
          type: "boolean",
          description: "Flag that determines whether responses are sent to recipients who are outside of the user's domain. This feature is only available for Google Workspace users.",
        },
        restrictToContacts: {
          type: "boolean",
          description: "Flag that determines whether responses are sent to recipients who are not in the user's list of contacts.",
        },
        responseBodyPlainText: {
          type: "string",
          description: "Response body in plain text format. If both response_body_plain_text and response_body_html are specified, response_body_html will be used.",
        },
      },
    },
    tags: [
      "composio",
      "gmail",
      "write",
      "mailbox_automation",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Vacation Settings.",
    ],
  }),
];
