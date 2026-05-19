const FIGMA_FILE_KEY_DESCRIPTION =
  "Required Figma file or branch key. Extract it from the Figma URL: it is the alphanumeric segment between `design/` or `file/` and the next slash, e.g. `https://www.figma.com/design/<FILE_KEY>/...` or `https://www.figma.com/file/<FILE_KEY>/...`. If you don't have the URL yet, ask the user for any Figma file URL before calling.";

const FIGMA_TEAM_ID_DESCRIPTION =
  "Required Figma team ID. Figma does not expose team IDs through any read API, so you cannot discover this — you must ask the user for their Figma team page URL (`https://www.figma.com/files/team/<TEAM_ID>/...`) and extract the segment after `team/`.";

const FIGMA_FILE_KEY_ASK_BEFORE = [
  "Ask the user for the Figma file URL if you don't already have one — the file_key is extracted from it (e.g. https://www.figma.com/design/<FILE_KEY>/...).",
];

const FIGMA_TEAM_ID_ASK_BEFORE = [
  "Ask the user for their Figma team page URL — Figma does not expose team IDs through any read API, so this cannot be discovered automatically.",
];

const FIGMA_FILE_KEY_TOOL_SLUGS = [
  "FIGMA_ADD_A_COMMENT_TO_A_FILE",
  "FIGMA_ADD_A_REACTION_TO_A_COMMENT",
  "FIGMA_DELETE_A_COMMENT",
  "FIGMA_DELETE_A_REACTION",
  "FIGMA_DETECT_BACKGROUND",
  "FIGMA_DOWNLOAD_FIGMA_IMAGES",
  "FIGMA_EXTRACT_DESIGN_TOKENS",
  "FIGMA_EXTRACT_PROTOTYPE_INTERACTIONS",
  "FIGMA_GET_COMMENTS_IN_A_FILE",
  "FIGMA_GET_FILE_COMPONENT_SETS",
  "FIGMA_GET_FILE_COMPONENTS",
  "FIGMA_GET_FILE_JSON",
  "FIGMA_GET_FILE_METADATA",
  "FIGMA_GET_FILE_NODES",
  "FIGMA_GET_FILE_STYLES",
  "FIGMA_GET_IMAGE_FILLS",
  "FIGMA_GET_REACTIONS_FOR_A_COMMENT",
  "FIGMA_GET_VERSIONS_OF_A_FILE",
  "FIGMA_RENDER_IMAGES_OF_FILE_NODES",
];

const FIGMA_TEAM_ID_TOOL_SLUGS = [
  "FIGMA_GET_PROJECTS_IN_A_TEAM",
  "FIGMA_GET_TEAM_COMPONENT_SETS",
  "FIGMA_GET_TEAM_COMPONENTS",
  "FIGMA_GET_TEAM_STYLES",
];

function buildFigmaFileKeyOverrides() {
  const entries = {};

  for (const slug of FIGMA_FILE_KEY_TOOL_SLUGS) {
    entries[slug] = {
      descriptionPrefix:
        "Requires `file_key`. Extract it from the user's Figma file URL (the segment after `design/` or `file/`); ask for the URL if you don't have one yet.",
      fieldDescriptions: {
        file_key: FIGMA_FILE_KEY_DESCRIPTION,
      },
      askBefore: FIGMA_FILE_KEY_ASK_BEFORE,
    };
  }

  return entries;
}

function buildFigmaTeamIdOverrides() {
  const entries = {};

  for (const slug of FIGMA_TEAM_ID_TOOL_SLUGS) {
    entries[slug] = {
      descriptionPrefix:
        "Requires `team_id`. Figma does not expose team IDs through any read API, so ask the user for their Figma team page URL (`https://www.figma.com/files/team/<TEAM_ID>/...`) and extract the segment after `team/`.",
      fieldDescriptions: {
        team_id: FIGMA_TEAM_ID_DESCRIPTION,
      },
      askBefore: FIGMA_TEAM_ID_ASK_BEFORE,
    };
  }

  return entries;
}

const GMAIL_USER_ID_DESCRIPTION =
  'Required by the Gmail API. ALWAYS pass the literal string `"me"` — it refers to the authenticated Gmail account. Do NOT pass an email address, a Gmail user id, or placeholders like `"self"`, `"user"`, or the user\'s own email; the Gmail API rejects every value other than `"me"` (or the authenticated user\'s own exact address) with a misleading `403 "Delegation denied"` error, because reading any other mailbox requires Google Workspace domain-wide delegation which is not configured here.';

const GMAIL_USER_ID_TRAP_PREFIX =
  'If this tool takes a `user_id` parameter, set it to the literal string `"me"`. Any other value (an email address, a Gmail user id, `"self"`) fails with a 403 "Delegation denied" error.';

const GMAIL_TOOL_SLUGS = [
  "GMAIL_ADD_LABEL_TO_EMAIL",
  "GMAIL_BATCH_DELETE_MESSAGES",
  "GMAIL_BATCH_MODIFY_MESSAGES",
  "GMAIL_CREATE_EMAIL_DRAFT",
  "GMAIL_CREATE_FILTER",
  "GMAIL_CREATE_LABEL",
  "GMAIL_CREATE_PROMPT_POST",
  "GMAIL_DELETE_DRAFT",
  "GMAIL_DELETE_FILTER",
  "GMAIL_DELETE_LABEL",
  "GMAIL_DELETE_MESSAGE",
  "GMAIL_DELETE_THREAD",
  "GMAIL_FETCH_EMAILS",
  "GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID",
  "GMAIL_FETCH_MESSAGE_BY_THREAD_ID",
  "GMAIL_FORWARD_MESSAGE",
  "GMAIL_GET_ATTACHMENT",
  "GMAIL_GET_AUTO_FORWARDING",
  "GMAIL_GET_CONTACTS",
  "GMAIL_GET_DRAFT",
  "GMAIL_GET_FILTER",
  "GMAIL_GET_LABEL",
  "GMAIL_GET_LANGUAGE_SETTINGS",
  "GMAIL_GET_PEOPLE",
  "GMAIL_GET_PROFILE",
  "GMAIL_GET_VACATION_SETTINGS",
  "GMAIL_IMPORT_MESSAGE",
  "GMAIL_INSERT_MESSAGE",
  "GMAIL_LIST_CSE_IDENTITIES",
  "GMAIL_LIST_CSE_KEYPAIRS",
  "GMAIL_LIST_DRAFTS",
  "GMAIL_LIST_FILTERS",
  "GMAIL_LIST_FORWARDING_ADDRESSES",
  "GMAIL_LIST_HISTORY",
  "GMAIL_LIST_LABELS",
  "GMAIL_LIST_SEND_AS",
  "GMAIL_LIST_SMIME_INFO",
  "GMAIL_LIST_THREADS",
  "GMAIL_MODIFY_THREAD_LABELS",
  "GMAIL_MOVE_THREAD_TO_TRASH",
  "GMAIL_MOVE_TO_TRASH",
  "GMAIL_PATCH_LABEL",
  "GMAIL_PATCH_SEND_AS",
  "GMAIL_REPLY_TO_THREAD",
  "GMAIL_SEARCH_PEOPLE",
  "GMAIL_SEND_DRAFT",
  "GMAIL_SEND_EMAIL",
  "GMAIL_SETTINGS_GET_IMAP",
  "GMAIL_SETTINGS_GET_POP",
  "GMAIL_SETTINGS_SEND_AS_GET",
  "GMAIL_STOP_WATCH",
  "GMAIL_UNTRASH_MESSAGE",
  "GMAIL_UNTRASH_THREAD",
  "GMAIL_UPDATE_DRAFT",
  "GMAIL_UPDATE_IMAP_SETTINGS",
  "GMAIL_UPDATE_LABEL",
  "GMAIL_UPDATE_LANGUAGE_SETTINGS",
  "GMAIL_UPDATE_POP_SETTINGS",
  "GMAIL_UPDATE_SEND_AS",
  "GMAIL_UPDATE_USER_ATTRIBUTES_VALUES",
  "GMAIL_UPDATE_VACATION_SETTINGS",
];

const GMAIL_MANUAL_OVERRIDES = {
  GMAIL_GET_PROFILE: {
    descriptionPrefix:
      "Use this first when you need to confirm which Gmail account is connected or seed later mailbox sync logic.",
    examples: [
      {
        label: "Inspect the connected Gmail account",
        args: {
          user_id: "me",
        },
      },
    ],
  },
  GMAIL_LIST_LABELS: {
    descriptionPrefix:
      "Use this discovery step before any label mutation or label-filtered mailbox query.",
    followups: [
      "Reuse the returned internal label IDs exactly as returned in later Gmail calls.",
    ],
    examples: [
      {
        label: "List labels for the connected mailbox",
        args: {
          user_id: "me",
        },
      },
    ],
  },
  GMAIL_FETCH_EMAILS: {
    descriptionPrefix:
      "Start broad, then narrow. Use this for mailbox search, list, and discovery before hydrating one message or one thread.",
    fieldDescriptions: {
      query:
        "Optional Gmail search query, for example `from:alice newer_than:7d` or `label:important has:attachment`.",
    },
    examples: [
      {
        label: "Search recent inbox mail from one sender",
        args: {
          user_id: "me",
          query: "from:alice@example.com newer_than:7d",
        },
      },
    ],
  },
  GMAIL_FETCH_MESSAGE_BY_THREAD_ID: {
    descriptionPrefix:
      "Use this after a mailbox search when you need the full contents of one conversation thread.",
    fieldDescriptions: {
      thread_id:
        "Required Gmail thread ID. Get this from `gmail_fetch_emails` or `gmail_list_threads` first.",
    },
    prerequisites: ["gmail_fetch_emails", "gmail_list_threads"],
  },
  GMAIL_GET_ATTACHMENT: {
    descriptionPrefix:
      "Use this only after identifying the exact message and attachment IDs from a prior Gmail message fetch.",
    fieldDescriptions: {
      message_id:
        "Required Gmail message ID that owns the attachment. Get this from `gmail_fetch_emails` or `gmail_fetch_message_by_thread_id` first.",
      attachment_id:
        "Required Gmail attachment ID from the selected message payload.",
    },
    prerequisites: ["gmail_fetch_emails", "gmail_fetch_message_by_thread_id"],
  },
  GMAIL_CREATE_EMAIL_DRAFT: {
    descriptionPrefix:
      "Use this when you want a reviewable draft before sending. A practical draft still needs recipients plus message content.",
    fieldDescriptions: {
      recipient_email:
        "Primary To recipient. Provide this, `cc`, or `bcc`; drafts without recipients are not useful for sending.",
      body:
        "Email body content. Set `is_html=true` if this contains HTML markup.",
      thread_id:
        "Optional Gmail thread ID when drafting a reply in an existing conversation. Leave subject empty to stay in that thread.",
    },
    examples: [
      {
        label: "Create a simple draft",
        args: {
          user_id: "me",
          recipient_email: "person@example.com",
          subject: "Quick update",
          body: "Here is the draft message body.",
        },
      },
    ],
  },
  GMAIL_SEND_DRAFT: {
    descriptionPrefix:
      "This sends an existing draft as-is. It does not add recipients or rewrite content at send time.",
    fieldDescriptions: {
      draft_id:
        "Required Gmail draft ID returned by `gmail_create_email_draft` or `gmail_list_drafts`.",
    },
    prerequisites: ["gmail_create_email_draft", "gmail_list_drafts", "gmail_get_draft"],
  },
  GMAIL_SEND_EMAIL: {
    descriptionPrefix:
      "Bias toward action: send directly when the user already knows the recipients and content. Use a draft first only when review or later send timing matters.",
    fieldDescriptions: {
      to: "Primary recipients. Provide at least one of `to`, `recipient_email`, `cc`, or `bcc`.",
      recipient_email:
        "Single-recipient convenience field. Equivalent to a simple To address.",
      body:
        "Email body content. Set `is_html=true` if the body contains HTML markup.",
    },
    examples: [
      {
        label: "Send a plain-text email",
        args: {
          user_id: "me",
          to: ["person@example.com"],
          subject: "Quick update",
          body: "Here is the message body.",
        },
      },
    ],
  },
  GMAIL_REPLY_TO_THREAD: {
    descriptionPrefix:
      "Use this only when you already know the Gmail thread ID and want to stay inside that conversation.",
    fieldDescriptions: {
      thread_id:
        "Required Gmail thread ID. Get it from `gmail_fetch_emails` or `gmail_list_threads` first.",
      body:
        "Reply body content. Do not provide a custom subject if you want the reply to remain in the same thread.",
    },
    prerequisites: ["gmail_fetch_emails", "gmail_list_threads"],
  },
};

const GMAIL_USER_ID_VALIDATOR = {
  allow: ["me"],
  message:
    'Gmail `user_id` must be the literal string "me" (refers to the authenticated account). Any other value — including the authenticated user\'s own email address — is rejected upstream with a misleading 403 "Delegation denied" error because Gmail requires Google Workspace domain-wide delegation to read other mailboxes.',
  hint: 'Retry with `user_id: "me"` to read the authenticated mailbox.',
};

const LINKEDIN_AUTHOR_FIELD_DESCRIPTION =
  "Required. The exact URN of the posting identity. Must be `urn:li:person:<id>` where `<id>` is the `id` value returned by `linkedin_get_my_info` (NOT `self`, NOT `me`, NOT any placeholder). Organization authors (`urn:li:organization:<id>`) are NOT accepted on this connection — Composio's managed LinkedIn OAuth client lacks `w_organization_social`/Community Management partner access; LinkedIn rejects org-author posts with `400 'Organization Or Events permissions must be used when using organization as author'`. Personal authors only.";

const LINKEDIN_AUTHOR_VALIDATOR = {
  denyPatterns: [
    /^urn:li:person:(self|me|user|current[_-]?user)$/i,
    /^urn:li:organization:/i,
  ],
  allowPatterns: [/^urn:li:person:[A-Za-z0-9_-]+$/],
  message:
    "LinkedIn `author` must be a concrete person URN like `urn:li:person:<id>`. Placeholder URNs (`self`, `me`, `user`) and organization URNs (`urn:li:organization:<id>`) are both rejected: placeholders are URN-format errors, and organization-author posting needs LinkedIn Community Management partner approval which Composio's managed OAuth client does not grant.",
  hint:
    "Call `linkedin_get_my_info` first; use its `id` field as `urn:li:person:<id>` (substitute the real id, never `self`/`me`). To post as an organization you would need a LinkedIn partner OAuth app with `w_organization_social` — not available on the current connection.",
};

const CANVA_DESIGN_TYPE_DESCRIPTION =
  "Required. A flat object using ONE of two variants (do NOT send both). PRESET variant: `{\"type\": \"preset\", \"name\": \"<name>\"}` where `<name>` is one of `doc`, `whiteboard`, `presentation`. CUSTOM variant: `{\"type\": \"custom\", \"width\": <int 40-8000>, \"height\": <int 40-8000>}`. NO `DesignTypeCustom`/`DesignTypePreset` envelope keys (those are JSON Schema variant titles, not data field names) and NO `units` field. Sending both variants in the same call causes Pydantic to fail every variant's required-field check and surface a confusing aggregated error.";

const CANVA_EXPORT_FORMAT_DESCRIPTION =
  "Required. A flat object using ONE of six variants (do NOT send envelope keys like `PngFormat`/`JpgFormat`; those are JSON Schema variant titles, not data field names). PDF: `{\"type\": \"pdf\"}` or `{\"type\": \"pdf\", \"size\": \"a4\"|\"a3\"|\"letter\"|\"legal\"}`. JPG (requires `quality`): `{\"type\": \"jpg\", \"quality\": <int 1-100>}`. PNG: `{\"type\": \"png\"}` (optionally with `lossless: false` for Pro/Enterprise lossy compression). GIF: `{\"type\": \"gif\"}`. PPTX: `{\"type\": \"pptx\"}`. MP4 (requires `quality`): `{\"type\": \"mp4\", \"quality\": \"horizontal_1080p\"}` (or `horizontal_480p|720p|4k`, `vertical_480p|720p|1080p|4k`). All variants accept optional `pages: [<int>, ...]` (1-indexed page numbers; omit for all pages). Not all formats are supported for all design types — call `canva_get_design_export_formats` first if unsure.";

function buildGmailOverrides() {
  const entries = {};

  for (const slug of GMAIL_TOOL_SLUGS) {
    const manual = GMAIL_MANUAL_OVERRIDES[slug] ?? {};
    const manualPrefix = manual.descriptionPrefix ?? "";
    const combinedPrefix = manualPrefix
      ? `${GMAIL_USER_ID_TRAP_PREFIX} ${manualPrefix}`
      : GMAIL_USER_ID_TRAP_PREFIX;

    entries[slug] = {
      ...manual,
      descriptionPrefix: combinedPrefix,
      fieldDescriptions: {
        user_id: GMAIL_USER_ID_DESCRIPTION,
        ...(manual.fieldDescriptions ?? {}),
      },
      fieldValidators: {
        user_id: GMAIL_USER_ID_VALIDATOR,
        ...(manual.fieldValidators ?? {}),
      },
    };
  }

  return entries;
}

const composioToolOverrides = {
  ...buildGmailOverrides(),

  CANVA_POST_DESIGNS: {
    descriptionPrefix:
      "Use this to create a new Canva design. The `design_type` argument is a FLAT object with one of two variants — pass exactly ONE variant, not both. PRESET: `{type: \"preset\", name: \"doc\"|\"whiteboard\"|\"presentation\"}`. CUSTOM: `{type: \"custom\", width: <int 40-8000>, height: <int 40-8000>}`. DO NOT wrap fields in `DesignTypeCustom`/`DesignTypePreset` envelopes (those are JSON Schema variant titles, not data field names) and DO NOT add a `units` field. Sending both variants in the same call causes Pydantic to fail every variant's required-field check and surface a confusing aggregated error.",
    fieldDescriptions: {
      design_type: CANVA_DESIGN_TYPE_DESCRIPTION,
      title: "Optional. Display title for the new design (1-255 chars).",
      asset_id:
        "Optional. Image asset id from a previously uploaded asset, inserted into the new design.",
    },
    examples: [
      {
        label: "Preset design — presentation",
        args: {
          title: "Q4 marketing update",
          design_type: { type: "preset", name: "presentation" },
        },
      },
      {
        label: "Preset design — doc",
        args: {
          title: "Meeting notes",
          design_type: { type: "preset", name: "doc" },
        },
      },
      {
        label: "Custom-sized design (LinkedIn banner)",
        args: {
          title: "LinkedIn banner",
          design_type: { type: "custom", width: 1200, height: 627 },
        },
      },
    ],
  },
  CANVA_POST_EXPORTS: {
    descriptionPrefix:
      "Use this to export an existing Canva design to PDF/JPG/PNG/GIF/PPTX/MP4. The `format` argument is a FLAT object with one of six variants. DO NOT wrap fields in `PngFormat`/`JpgFormat`/etc. envelope keys (those are JSON Schema variant titles, not data field names). Variants: `{type: \"pdf\"}` (optional `size`), `{type: \"jpg\", quality: <1-100>}` (quality REQUIRED), `{type: \"png\"}` (optional `lossless: false`), `{type: \"gif\"}`, `{type: \"pptx\"}`, `{type: \"mp4\", quality: \"horizontal_1080p\"}` (quality REQUIRED, enum). Not every format is supported for every design type — call `canva_get_design_export_formats` first if unsure.",
    fieldDescriptions: {
      design_id:
        "Required. The Canva design id to export. Obtain it from `canva_post_designs` (`design.id`) or by searching the user's designs.",
      format: CANVA_EXPORT_FORMAT_DESCRIPTION,
    },
    examples: [
      {
        label: "Export as PNG (minimal)",
        args: {
          design_id: "DAFxxxxxxxx",
          format: { type: "png" },
        },
      },
      {
        label: "Export as JPG with quality",
        args: {
          design_id: "DAFxxxxxxxx",
          format: { type: "jpg", quality: 80 },
        },
      },
      {
        label: "Export as A4 PDF",
        args: {
          design_id: "DAFxxxxxxxx",
          format: { type: "pdf", size: "a4" },
        },
      },
    ],
  },

  GOOGLEDRIVE_FIND_FILE: {
    descriptionPrefix:
      "Use this as the default Google Drive discovery tool before metadata reads, downloads, moves, sharing, or edits.",
    fieldDescriptions: {
      q:
        "Optional Drive search query, for example `name contains 'report'`, `mimeType = 'application/pdf'`, or `'FOLDER_ID' in parents`.",
      folderId:
        "Optional folder ID to scope the search to one parent folder when known.",
    },
    examples: [
      {
        label: "Find recent files with report in the name",
        args: {
          q: "name contains 'report'",
        },
      },
    ],
  },
  GOOGLEDRIVE_GET_FILE_METADATA: {
    descriptionPrefix:
      "Use this after discovery to confirm the exact Drive item type and state before downstream actions.",
    fieldDescriptions: {
      file_id:
        "Required Google Drive file ID. Get it from `googledrive_find_file`, `googledrive_find_folder`, or a previous create/upload response.",
    },
    prerequisites: ["googledrive_find_file", "googledrive_find_folder"],
  },
  GOOGLEDRIVE_CREATE_FILE_FROM_TEXT: {
    descriptionPrefix:
      "Bias toward action: provide `text_content` for the file body and `file_name` for the created file.",
    fieldDescriptions: {
      text_content:
        "Required. Raw text content to write into the new file. Pass the full file body here.",
      file_name:
        "Required. Name of the created file including extension when relevant, for example `notes.txt` or `draft.md`.",
      mime_type:
        "Optional. Defaults to `text/plain`. Use a Google Workspace MIME type such as `application/vnd.google-apps.document` to create a Google Doc.",
      parent_id:
        "Optional Google Drive folder ID for the destination parent. Omit to create the file in the root drive.",
    },
    examples: [
      {
        label: "Create a plain text file",
        args: {
          file_name: "greeting.txt",
          text_content: "Hello world",
        },
      },
    ],
  },
  GOOGLEDRIVE_CREATE_FILE: {
    descriptionPrefix:
      "Use this to create empty Drive-native files or folders by metadata. If you need initial textual content immediately, prefer `googledrive_create_file_from_text`.",
    fieldDescriptions: {
      parents:
        "Optional parent folder IDs. For shared-drive folder placement, pass the destination parent here rather than relying on root defaults.",
    },
    prerequisites: ["googledrive_find_folder"],
  },
  GOOGLEDRIVE_UPLOAD_FILE: {
    descriptionPrefix:
      "Use this for binary uploads that should create a brand-new Drive file. It does not update an existing file ID.",
    fieldDescriptions: {
      folder_id:
        "Optional destination folder ID. Get it from `googledrive_find_folder` first when the upload should not land in Drive root.",
    },
    prerequisites: ["googledrive_find_folder"],
  },
  GOOGLEDRIVE_DOWNLOAD_FILE: {
    descriptionPrefix:
      "Use this after discovery when you need the file bytes or an exported Google Workspace document.",
    fieldDescriptions: {
      file_id:
        "Required Drive file ID. Discover it with `googledrive_find_file` or a prior create/upload response.",
      mime_type:
        "Optional export MIME type for Google Workspace files, for example `text/plain`, `application/pdf`, or `text/csv`.",
    },
    prerequisites: ["googledrive_find_file", "googledrive_get_file_metadata"],
  },
  GOOGLEDRIVE_MOVE_FILE: {
    descriptionPrefix:
      "Treat this as a true move only when you provide both the destination and the parent to remove.",
    fieldDescriptions: {
      add_parents:
        "Destination folder ID to add. Find it with `googledrive_find_folder` first.",
      remove_parents:
        "Current parent folder ID to remove so the file does not remain in multiple folders.",
    },
    prerequisites: ["googledrive_find_file", "googledrive_find_folder", "googledrive_get_file_metadata"],
  },
  GOOGLEDRIVE_CREATE_PERMISSION: {
    descriptionPrefix:
      "Use this to share a file or folder after you have already identified the exact Drive item to expose.",
    fieldDescriptions: {
      file_id:
        "Required Drive file or folder ID to share. Discover it with `googledrive_find_file` or `googledrive_find_folder` first.",
    },
    prerequisites: ["googledrive_find_file", "googledrive_find_folder"],
  },

  GOOGLEDOCS_SEARCH_DOCUMENTS: {
    descriptionPrefix:
      "Use this as the discovery step before reading or mutating an existing Google Doc by ID.",
    examples: [
      {
        label: "Search docs by title keyword",
        args: {
          query: "project plan",
        },
      },
    ],
  },
  GOOGLEDOCS_CREATE_DOCUMENT: {
    descriptionPrefix:
      "Use this for a simple new document with a title and optional initial text.",
    fieldDescriptions: {
      title:
        "Document title shown in Google Drive and Docs.",
    },
    examples: [
      {
        label: "Create a titled document with starter text",
        args: {
          title: "Project Plan",
          text: "Initial outline goes here.",
        },
      },
    ],
  },
  GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN: {
    descriptionPrefix:
      "Use this when the source content already exists as Markdown and should become a Google Doc in one call.",
    fieldDescriptions: {
      title:
        "Optional document title. Set this explicitly when the doc should not use a default untitled name.",
      markdown:
        "Markdown body content for the new Google Doc.",
    },
    examples: [
      {
        label: "Create a Markdown-backed Google Doc",
        args: {
          title: "Weekly Notes",
          markdown: "# Weekly Notes\n\n- Item one\n- Item two",
        },
      },
    ],
  },
  GOOGLEDOCS_GET_DOCUMENT_BY_ID: {
    descriptionPrefix:
      "Use this when you already know the exact Google Doc ID and need the structured Docs API payload.",
    fieldDescriptions: {
      document_id:
        "Required Google Docs document ID. Get it from `googledocs_search_documents`, `googledocs_create_document`, or Drive metadata first.",
    },
    prerequisites: ["googledocs_search_documents", "googledrive_find_file"],
  },
  GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT: {
    descriptionPrefix:
      "Prefer this over the raw structured document call when the model only needs readable text content.",
    fieldDescriptions: {
      document_id:
        "Required Google Docs document ID. Get it from `googledocs_search_documents` or a previous create response.",
    },
    prerequisites: ["googledocs_search_documents", "googledrive_find_file"],
  },
  GOOGLEDOCS_INSERT_TEXT_ACTION: {
    descriptionPrefix:
      "For simple appends, prefer the append flag instead of raw insertion indices.",
    fieldDescriptions: {
      document_id:
        "Required Google Docs document ID to edit.",
      append_to_end:
        "Set this to true when the goal is to append new text without reasoning about Docs index boundaries.",
    },
    prerequisites: ["googledocs_search_documents", "googledocs_get_document_by_id"],
  },
  GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN: {
    descriptionPrefix:
      "This replaces the full document body with new Markdown content.",
    fieldDescriptions: {
      document_id:
        "Required Google Docs document ID to overwrite.",
      markdown:
        "Full replacement Markdown content for the document body.",
    },
    prerequisites: ["googledocs_search_documents", "googledocs_get_document_plaintext"],
  },
  GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT: {
    descriptionPrefix:
      "Use this only for targeted batchUpdate-style structural edits when the simpler markdown or insert-text tools are insufficient.",
    fieldDescriptions: {
      document_id:
        "Required Google Docs document ID to edit.",
    },
    prerequisites: ["googledocs_search_documents", "googledocs_get_document_by_id"],
  },

  GOOGLESHEETS_CREATE_GOOGLE_SHEET1: {
    descriptionPrefix:
      "Use this to create a new spreadsheet before populating tabs, ranges, or rows.",
    fieldDescriptions: {
      folder_id:
        "Optional Google Drive folder ID for the spreadsheet destination. Prefer this over folder_name when the folder is already known.",
      folder_name:
        "Optional fallback folder name when no folder ID is available. Folder IDs are safer when duplicates exist.",
    },
    examples: [
      {
        label: "Create a spreadsheet in Drive root",
        args: {
          title: "Pipeline Tracker",
        },
      },
    ],
  },
  GOOGLESHEETS_SEARCH_SPREADSHEETS: {
    descriptionPrefix:
      "Use this as the discovery step before reading or writing a spreadsheet by ID.",
    examples: [
      {
        label: "Search spreadsheets by name",
        args: {
          query: "sales tracker",
        },
      },
    ],
  },
  GOOGLESHEETS_GET_SPREADSHEET_INFO: {
    descriptionPrefix:
      "Use this to confirm sheet metadata and tab structure before targeting ranges or sheet-specific writes.",
    fieldDescriptions: {
      spreadsheet_id:
        "Required Google Sheets spreadsheet ID. Get it from `googlesheets_search_spreadsheets` or the create-sheet response first.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_create_google_sheet1"],
  },
  GOOGLESHEETS_VALUES_GET: {
    descriptionPrefix:
      "Use this for direct range reads when you already know the spreadsheet and A1 range.",
    fieldDescriptions: {
      spreadsheet_id:
        "Required spreadsheet ID. Discover it with `googlesheets_search_spreadsheets` first if unknown.",
      range:
        "Required A1 notation range, for example `Sheet1!A1:D20`.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_get_sheet_names"],
    examples: [
      {
        label: "Read a header row and first few records",
        args: {
          spreadsheet_id: "spreadsheet_id_here",
          range: "Sheet1!A1:D10",
        },
      },
    ],
  },
  GOOGLESHEETS_VALUES_UPDATE: {
    descriptionPrefix:
      "Use this to overwrite a known A1 range with new values.",
    fieldDescriptions: {
      spreadsheet_id:
        "Required spreadsheet ID for the target workbook.",
      range:
        "Required A1 notation range to overwrite, for example `Sheet1!B2:D2`.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_get_sheet_names"],
  },
  GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND: {
    descriptionPrefix:
      "Use this when new rows should be appended after the existing table rather than overwriting a fixed range.",
    fieldDescriptions: {
      spreadsheet_id:
        "Required spreadsheet ID for the target workbook.",
      range:
        "A1 notation anchor for the table to append into, for example `Sheet1!A:D`.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_get_sheet_names"],
  },
  GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW: {
    descriptionPrefix:
      "Use this when you need to resolve a single matching row before an update or follow-up read.",
    fieldDescriptions: {
      spreadsheet_id:
        "Required spreadsheet ID for the workbook to search.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_get_sheet_names"],
  },
  GOOGLESHEETS_UPSERT_ROWS: {
    descriptionPrefix:
      "Prefer this for keyed business records where duplicates are unacceptable and rows should be updated-or-created automatically.",
    fieldDescriptions: {
      keyColumn:
        "Header name used to match existing rows, for example `Email`, `Lead ID`, or `SKU`.",
      headers:
        "Column headers for the incoming data rows. Header names are used for mapping.",
      data:
        "Row values aligned to the `headers` array. Each inner array is one row.",
    },
    prerequisites: ["googlesheets_search_spreadsheets", "googlesheets_get_sheet_names"],
  },

  GOOGLECALENDAR_LIST_CALENDARS: {
    descriptionPrefix:
      "Use this discovery step before any calendar-specific event read or write when the calendar ID is not already known.",
  },
  GOOGLECALENDAR_EVENTS_LIST: {
    descriptionPrefix:
      "Use this to list or search existing events in one calendar across a time window before patching, updating, or deleting.",
    fieldDescriptions: {
      calendar_id:
        "Calendar ID to inspect. Get it from `googlecalendar_list_calendars` first when unknown.",
    },
    prerequisites: ["googlecalendar_list_calendars"],
  },
  GOOGLECALENDAR_FIND_EVENT: {
    descriptionPrefix:
      "Use this when you need to discover an event ID before a follow-up edit or delete.",
    prerequisites: ["googlecalendar_list_calendars"],
  },
  GOOGLECALENDAR_CREATE_EVENT: {
    descriptionPrefix:
      "Use this when the user already knows the meeting details and a direct create is appropriate.",
    fieldDescriptions: {
      start_datetime:
        "Required start timestamp for the event. Use an ISO datetime string.",
      timezone:
        "Timezone for interpreting `start_datetime` and duration fields, for example `America/New_York`.",
      attendees:
        "Optional attendee emails or attendee objects. Use only real email addresses here.",
    },
    examples: [
      {
        label: "Create a one-hour meeting",
        args: {
          start_datetime: "2026-05-09T13:00:00",
          timezone: "America/New_York",
          event_duration_hour: 1,
          summary: "Client sync",
          attendees: ["person@example.com"],
        },
      },
    ],
  },
  GOOGLECALENDAR_EVENTS_GET: {
    descriptionPrefix:
      "Use this only when you already know the exact calendar and event IDs.",
    fieldDescriptions: {
      event_id:
        "Required event ID returned by `googlecalendar_find_event` or `googlecalendar_events_list`.",
    },
    prerequisites: ["googlecalendar_find_event", "googlecalendar_events_list"],
  },
  GOOGLECALENDAR_PATCH_EVENT: {
    descriptionPrefix:
      "Prefer patch for partial edits to an existing event so unspecified fields are not cleared.",
    fieldDescriptions: {
      event_id:
        "Required event ID to edit. Get it from `googlecalendar_find_event` or `googlecalendar_events_list` first.",
    },
    prerequisites: ["googlecalendar_find_event", "googlecalendar_events_list"],
  },
  GOOGLECALENDAR_UPDATE_EVENT: {
    descriptionPrefix:
      "Use full update only when you intend to send the complete desired event state. Partial payloads can clear omitted fields.",
    fieldDescriptions: {
      event_id:
        "Required event ID to fully replace. Resolve it with `googlecalendar_find_event` or `googlecalendar_events_list` first.",
    },
    prerequisites: ["googlecalendar_find_event", "googlecalendar_events_list"],
  },
  GOOGLECALENDAR_FIND_FREE_SLOTS: {
    descriptionPrefix:
      "Use this before creating a meeting when availability matters more than existing event details.",
    prerequisites: ["googlecalendar_list_calendars"],
  },

  LINKEDIN_GET_MY_INFO: {
    descriptionPrefix:
      "Use this first to confirm the connected LinkedIn member identity before creating posts or inspecting profile-specific data.",
  },
  LINKEDIN_GET_COMPANY_INFO: {
    descriptionPrefix:
      "Use this discovery step before org-scoped analytics or post operations that need a company or organization identifier.",
  },
  LINKEDIN_REGISTER_IMAGE_UPLOAD: {
    descriptionPrefix:
      "Use this upload-init step before creating a LinkedIn post with an image asset.",
    followups: [
      "Upload the image bytes to the returned upload URL, then pass the resulting asset URN into the post creation tool.",
    ],
  },
  LINKEDIN_CREATE_LINKED_IN_POST: {
    descriptionPrefix:
      "Use this for a standard LinkedIn feed post. REQUIRED FIRST STEP: call `linkedin_get_my_info` and use its `id` field to build the `author` URN as `urn:li:person:<id>` using the actual id value. NEVER pass `urn:li:person:self`, `urn:li:person:me`, or any placeholder — LinkedIn rejects invalid author URNs with a misleading 403 'Forbidden. You don't have permission to create posts' that looks like a scope error but is actually a URN-format error. ORGANIZATION POSTING IS NOT SUPPORTED on this connection: posting as `urn:li:organization:<id>` requires LinkedIn's Community Management API partner approval (scope `w_organization_social`), which the default ClawLink/Composio OAuth client does not grant. Use a personal author URN only.",
    prerequisites: ["linkedin_get_my_info"],
    fieldDescriptions: {
      author: LINKEDIN_AUTHOR_FIELD_DESCRIPTION,
    },
    fieldValidators: {
      author: LINKEDIN_AUTHOR_VALIDATOR,
    },
  },
  LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE: {
    descriptionPrefix:
      "Use this when the user wants to share an external URL on LinkedIn rather than a plain text status update. REQUIRED FIRST STEP: call `linkedin_get_my_info` and use its `id` field to build the `author` URN as `urn:li:person:<id>`. NEVER pass `urn:li:person:self`, `urn:li:person:me`, or any placeholder — LinkedIn rejects invalid author URNs with a misleading 403 'Forbidden. You don't have permission to create posts'. ORGANIZATION POSTING IS NOT SUPPORTED on this connection: posting as `urn:li:organization:<id>` requires LinkedIn's Community Management API partner approval (scope `w_organization_social`), which the default ClawLink/Composio OAuth client does not grant. Use a personal author URN only.",
    prerequisites: ["linkedin_get_my_info"],
    fieldDescriptions: {
      author: LINKEDIN_AUTHOR_FIELD_DESCRIPTION,
    },
    fieldValidators: {
      author: LINKEDIN_AUTHOR_VALIDATOR,
    },
  },
  LINKEDIN_SEARCH_AD_TARGETING_ENTITIES: {
    descriptionPrefix:
      "Use this to look up LinkedIn ad-targeting entities by typeahead query (returns autocomplete matches). The underlying LinkedIn endpoint is hardcoded to the `typeahead` finder, which only supports a SPECIFIC subset of facets — not the full `LINKEDIN_GET_AD_TARGETING_FACETS` catalog. To find companies as ad-targeting entities, use `urn:li:adTargetingFacet:employers` (NOT `companies` — that facet is for account-list targeting under a different finder and returns 'Specified facet is not available for the finder being used' here). Typeahead-supported facets include `employers`, `locations`, `industries`, `titles`, `skills`, `degrees`, `fieldsOfStudy`, `schools`, `seniorities`, `staffCountRanges`, `interfaceLocales`.",
    fieldDescriptions: {
      facet:
        "Required. URN of an ad-targeting facet that the typeahead finder supports. Use `urn:li:adTargetingFacet:employers` to search for companies (NOT `urn:li:adTargetingFacet:companies` — that returns a 400 'facet is not available for the finder being used'). Other supported values: `locations`, `industries`, `titles`, `skills`, `degrees`, `fieldsOfStudy`, `schools`, `seniorities`, `staffCountRanges`, `interfaceLocales`.",
      query:
        "Required. Free-text autocomplete query, e.g. a company name fragment or a city name.",
    },
    fieldValidators: {
      facet: {
        deny: [
          "urn:li:adTargetingFacet:companies",
          "urn:li:adTargetingFacet:company",
        ],
        allowPatterns: [/^urn:li:adTargetingFacet:[A-Za-z][A-Za-z0-9]*$/],
        message:
          "LinkedIn's typeahead ad-targeting finder does not support `urn:li:adTargetingFacet:companies`. Use `urn:li:adTargetingFacet:employers` to search for companies, or one of: `locations`, `industries`, `titles`, `skills`, `degrees`, `fieldsOfStudy`, `schools`, `seniorities`, `staffCountRanges`, `interfaceLocales`.",
        hint:
          "Retry `linkedin_search_ad_targeting_entities` with `facet: \"urn:li:adTargetingFacet:employers\"` to search for companies as ad-targeting entities.",
      },
    },
  },
  LINKEDIN_CREATE_COMMENT_ON_POST: {
    descriptionPrefix:
      "Use this only after you have identified the exact LinkedIn post to comment on.",
    prerequisites: ["linkedin_get_post_content"],
  },
  LINKEDIN_GET_POST_CONTENT: {
    descriptionPrefix:
      "Use this to inspect a specific LinkedIn post before commenting, analyzing, or deleting related content.",
  },
  LINKEDIN_LIST_REACTIONS: {
    descriptionPrefix:
      "Use this after resolving the exact LinkedIn post or share you want to inspect.",
    prerequisites: ["linkedin_get_post_content"],
  },

  INSTAGRAM_GET_IG_USER_MEDIA: {
    descriptionPrefix:
      "This tool expects an Instagram Business or Creator account identifier, not a username.",
    fieldDescriptions: {
      ig_user_id:
        "Required. Instagram Business or Creator account ID. Use `me` for the authenticated account when supported, or fetch the numeric account id with `instagram_get_user_info` first.",
    },
    prerequisites: ["instagram_get_user_info"],
    examples: [
      {
        label: "Fetch media for the connected Instagram account",
        args: {
          ig_user_id: "me",
        },
      },
    ],
  },
  INSTAGRAM_GET_USER_INFO: {
    descriptionPrefix:
      "Use this as the discovery step for Instagram account identifiers before calling tools that require `ig_user_id`.",
    examples: [
      {
        label: "Inspect the authenticated Instagram account",
        args: {
          ig_user_id: "me",
        },
      },
    ],
  },
  INSTAGRAM_POST_IG_USER_MEDIA: {
    descriptionPrefix:
      "Use this to create the Instagram publish container first. Publishing is a separate follow-up step.",
    followups: [
      "Capture the returned creation/container ID and pass it to `instagram_post_ig_user_media_publish`.",
    ],
    prerequisites: ["instagram_get_user_info"],
  },
  INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH: {
    descriptionPrefix:
      "This is the second step of Instagram publishing. Do not call it until a media container has already been created.",
    fieldDescriptions: {
      creation_id:
        "Required Instagram media container ID returned by `instagram_post_ig_user_media`.",
    },
    prerequisites: ["instagram_post_ig_user_media"],
  },
  INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT: {
    descriptionPrefix:
      "Use this before scheduled or repeated publishing when quota risk matters.",
    fieldDescriptions: {
      ig_user_id:
        "Instagram Business or Creator account ID. Use `instagram_get_user_info` first if you do not already have it.",
    },
    prerequisites: ["instagram_get_user_info"],
  },
  INSTAGRAM_GET_IG_MEDIA: {
    descriptionPrefix:
      "Use this when you already know one published Instagram media ID and need details or metrics for that post.",
    prerequisites: ["instagram_get_ig_user_media"],
  },
  INSTAGRAM_GET_USER_INSIGHTS: {
    descriptionPrefix:
      "Use this for account-level analytics after confirming the connected Instagram Business or Creator account.",
    prerequisites: ["instagram_get_user_info"],
  },

  FACEBOOK_LIST_MANAGED_PAGES: {
    descriptionPrefix:
      "Use this discovery step first whenever a Facebook action needs a concrete Page ID.",
  },
  FACEBOOK_GET_PAGE_DETAILS: {
    descriptionPrefix:
      "Use this after listing managed pages to confirm the exact Page before posting, messaging, or changing settings.",
    fieldDescriptions: {
      page_id:
        "Required Facebook Page ID. Get it from `facebook_list_managed_pages` first when unknown.",
    },
    prerequisites: ["facebook_list_managed_pages"],
  },
  FACEBOOK_GET_PAGE_POSTS: {
    descriptionPrefix:
      "Use this to inspect recent Page posts or discover concrete post IDs before comment, insight, or update actions.",
    fieldDescriptions: {
      page_id:
        "Required Facebook Page ID. Discover it with `facebook_list_managed_pages` first.",
    },
    prerequisites: ["facebook_list_managed_pages"],
  },
  FACEBOOK_CREATE_POST: {
    descriptionPrefix:
      "Use this for Page text or link posts after you know the target Page ID. Use the photo or video tools for media posts instead.",
    fieldDescriptions: {
      page_id:
        "Required Facebook Page ID that owns the post. Get it from `facebook_list_managed_pages` first.",
    },
    prerequisites: ["facebook_list_managed_pages"],
  },
  FACEBOOK_GET_POST: {
    descriptionPrefix:
      "Use this when you already know the exact composite post ID and need full post details.",
    fieldDescriptions: {
      post_id:
        "Required Facebook post ID, often in `PageID_PostID` format from a prior create or list call.",
    },
    prerequisites: ["facebook_get_page_posts", "facebook_create_post"],
  },
  FACEBOOK_GET_PAGE_CONVERSATIONS: {
    descriptionPrefix:
      "Use this before reading specific messages or sending replies through Facebook Page messaging flows.",
    fieldDescriptions: {
      page_id:
        "Required Facebook Page ID for the messaging inbox. Discover it with `facebook_list_managed_pages` first.",
    },
    prerequisites: ["facebook_list_managed_pages"],
  },
  FACEBOOK_SEND_MESSAGE: {
    descriptionPrefix:
      "Use this only after resolving the specific Page conversation or recipient context for the connected Page.",
    prerequisites: ["facebook_get_page_conversations"],
  },
  FACEBOOK_GET_PAGE_INSIGHTS: {
    descriptionPrefix:
      "Use this for Page-level analytics after resolving the managed Page you want to inspect.",
    prerequisites: ["facebook_list_managed_pages"],
  },
  ...buildFigmaFileKeyOverrides(),
  ...buildFigmaTeamIdOverrides(),
};

export default composioToolOverrides;
