/**
 * Import-time overrides for manifest generation.
 *
 * Use this to rename tools, hide poor-fit actions, tighten risk metadata,
 * and strip props that should not be exposed directly to OpenClaw.
 *
 * Validation notes:
 * - `hiddenProps` + `safeDefaults` are how we remove Pipedream-only props from
 *   the LLM contract while still satisfying the upstream component.
 * - `propOverrides.<name>.expose = true` can force-expose a prop that
 *   Pipedream marks hidden when it is actually the real LLM-facing payload.
 * - `validationArgs` can be provided per action for runtime manifest audits.
 *   They must only contain exposed LLM-facing args, never hidden/internal props.
 */
const overrides = {
  integrations: {
    notion: {
      actionOverrides: {
        "notion-append-block": {
          description:
            "Append one or more markdown snippets as new blocks under the specified parent page or block. Each markdown entry becomes one or more Notion blocks.",
          hiddenProps: ["blockTypes", "blockIds", "imageUrls"],
          safeDefaults: {
            blockTypes: ["markdownContents"],
          },
          propOverrides: {
            markdownContents: {
              expose: true,
              label: "Markdown Blocks",
              description:
                "One or more markdown strings to append as new Notion blocks. Each entry is converted from Markdown into block content.",
            },
          },
        },
        "notion-query-database": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "notion-retrieve-file-upload": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "notion-send-file-upload": {
          enabled: false,
        },
      },
    },
    gmail: {
      actionOverrides: {
        "gmail-send-email": {
          mode: "write",
          risk: "confirm",
          // Hide props that depend on dynamic-prop runtime, remote options,
          // or local filesystem paths that we cannot satisfy from the LLM
          // side yet. The remaining surface is to/cc/bcc/replyTo + subject/
          // body/bodyType, which is what users actually need to send mail.
          hiddenProps: [
            "syncDir",
            "fromName",
            "fromEmail",
            "signature",
            "inReplyTo",
            "mimeType",
            "attachmentFilenames",
            "attachmentUrlsOrPaths",
          ],
        },
        "gmail-create-draft": {
          mode: "write",
          risk: "confirm",
          hiddenProps: [
            "syncDir",
            "fromName",
            "fromEmail",
            "signature",
            "inReplyTo",
            "mimeType",
            "attachmentFilenames",
            "attachmentUrlsOrPaths",
          ],
        },
        "gmail-download-attachment": {
          // Writes to /tmp and uses puppeteer/chromium for PDF conversion;
          // not viable in the current worker runtime.
          enabled: false,
        },
        "gmail-approve-workflow": {
          // Pipedream-specific workflow primitive (depends on $.flow.suspend),
          // not a Gmail capability worth exposing as a tool.
          enabled: false,
        },
        "gmail-update-org-signature": {
          // Requires a Google Cloud service account with domain-wide
          // delegation; not available through the hosted Pipedream auth.
          enabled: false,
        },
        "gmail-update-primary-signature": {
          mode: "write",
          risk: "confirm",
        },
        "gmail-archive-email": {
          mode: "write",
          risk: "confirm",
        },
        "gmail-add-label-to-email": {
          mode: "write",
          risk: "confirm",
        },
        "gmail-remove-label-from-email": {
          mode: "write",
          risk: "confirm",
        },
        "gmail-find-email": {
          // withTextPayload is a Pipedream display flag, not a Gmail concept.
          // Hide it from the LLM and force-fill it server-side.
          hiddenProps: ["withTextPayload"],
          safeDefaults: {
            withTextPayload: true,
          },
        },
      },
    },
    linkedin: {
      actionOverrides: {
        "linkedin-create-image-post-organization": {
          // Uses a `dir` (filesystem) prop to read the image; not viable
          // through the LLM-facing schema.
          enabled: false,
        },
        "linkedin-create-image-post-user": {
          enabled: false,
        },
        "linkedin-create-text-post-user": {
          mode: "write",
          risk: "confirm",
        },
        "linkedin-create-text-post-organization": {
          mode: "write",
          risk: "confirm",
        },
        "linkedin-create-comment": {
          // Pipedream marks comment-creation destructive; it's a normal write.
          mode: "write",
          risk: "confirm",
        },
        "linkedin-create-like-on-share": {
          mode: "write",
          risk: "confirm",
        },
        "linkedin-fetch-ad-account": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "linkedin-retrieve-comments-on-comments": {
          // Despite destructiveHint=true upstream, this is a read.
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "linkedin-retrieve-comments-shares": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
      },
    },
    outlook: {
      excludeActionIds: [
        // Pipedream workflow primitive (depends on $.flow.suspend),
        // not a real Outlook capability.
        "microsoft_outlook-approve-workflow",
        // Writes attachments to the local filesystem; not viable in
        // the worker runtime.
        "microsoft_outlook-download-attachment",
      ],
      actionOverrides: {
        // The integration slug "outlook" does not match the Pipedream app
        // slug "microsoft_outlook", so the importer cannot strip the
        // app prefix automatically. Rename every tool here.
        "microsoft_outlook-get-current-user": {
          toolName: "outlook_get_current_user",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-get-message": {
          toolName: "outlook_get_message",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-find-email": {
          toolName: "outlook_find_email",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-list-important-mail": {
          toolName: "outlook_list_important_mail",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-find-shared-folder-email": {
          toolName: "outlook_find_shared_folder_email",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-list-folders": {
          toolName: "outlook_list_folders",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-list-labels": {
          toolName: "outlook_list_labels",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-send-email": {
          toolName: "outlook_send_email",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-create-draft-email": {
          toolName: "outlook_create_draft_email",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-create-draft-reply": {
          toolName: "outlook_create_draft_reply",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-reply-to-email": {
          toolName: "outlook_reply_to_email",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-move-email-to-folder": {
          toolName: "outlook_move_email_to_folder",
          mode: "write",
          risk: "confirm",
        },
        // Pipedream marks label add/remove destructive; these are
        // metadata writes that don't affect the message itself.
        "microsoft_outlook-add-label-to-email": {
          toolName: "outlook_add_label_to_email",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-remove-label-from-email": {
          toolName: "outlook_remove_label_from_email",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-list-contacts": {
          toolName: "outlook_list_contacts",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-find-contacts": {
          toolName: "outlook_find_contacts",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_outlook-create-contact": {
          toolName: "outlook_create_contact",
          mode: "write",
          risk: "confirm",
        },
        "microsoft_outlook-update-contact": {
          toolName: "outlook_update_contact",
          mode: "write",
          risk: "confirm",
        },
      },
    },
    mailchimp: {
      actionOverrides: {
        // Pipedream marks these destructive because they can mutate existing
        // records, but they are upserts/updates, not deletes. Treat as writes
        // so OpenClaw doesn't surface them with a high_impact warning.
        "mailchimp-add-or-update-subscriber": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-add-remove-member-tags": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-add-subscriber-to-tag": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-edit-campaign-template-content": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-remove-segment-member": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-update-campaign": {
          mode: "write",
          risk: "confirm",
        },
        "mailchimp-update-list": {
          mode: "write",
          risk: "confirm",
          // emailTypeOption defaults to false in Mailchimp's API; LLMs have
          // no product context to choose HTML+plaintext vs plaintext-only.
          hiddenProps: ["emailTypeOption"],
          safeDefaults: {
            emailTypeOption: false,
          },
        },
        "mailchimp-create-list": {
          hiddenProps: ["emailTypeOption"],
          safeDefaults: {
            emailTypeOption: false,
          },
        },
      },
    },
    facebook: {
      excludeActionIds: [
        "facebook_pages-create-post",
        "facebook_pages-update-post",
        "facebook_pages-create-comment",
        "facebook_pages-update-comment",
      ],
      actionOverrides: {
        "facebook_pages-get-page": {
          toolName: "facebook_get_page",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "facebook_pages-list-posts": {
          toolName: "facebook_list_posts",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "facebook_pages-get-post": {
          toolName: "facebook_get_post",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "facebook_pages-list-comments": {
          toolName: "facebook_list_comments",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "facebook_pages-get-comment": {
          toolName: "facebook_get_comment",
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
      },
    },
    "google-drive": {
      excludeActionIds: [
        "google_drive-create-file-from-text",
        "google_drive-create-folder",
        "google_drive-delete-shared-drive",
        "google_drive-download-file",
        "google_drive-update-comment",
        "google_drive-update-file",
        "google_drive-update-shared-drive",
        "google_drive-upload-file",
      ],
      actionOverrides: {
        "google_drive-create-file-from-template": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["replaceValues"],
          safeDefaults: {
            replaceValues: "{}",
          },
        },
        "google_drive-get-file-by-id": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "google_drive-move-file": {
          mode: "write",
          risk: "confirm",
        },
        "google_drive-resolve-comment": {
          mode: "write",
          risk: "confirm",
        },
        "google_drive-delete-file": {
          mode: "destructive",
          risk: "high_impact",
        },
        "google_drive-move-file-to-trash": {
          mode: "destructive",
          risk: "high_impact",
        },
        "google_drive-remove-file-sharing-permission": {
          mode: "destructive",
          risk: "high_impact",
        },
      },
    },
    youtube: {
      excludeActionIds: [
        "youtube_data_api-add-playlist-items",
        "youtube_data_api-list-playlist-videos",
        "youtube_data_api-search-videos",
        "youtube_data_api-channel-statistics",
      ],
      actionOverrides: {
        "youtube_data_api-upload-video": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-update-video-details": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-update-channel": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-update-playlist": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-create-playlist": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-create-comment-thread": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-reply-to-comment": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-upload-thumbnail": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-upload-channel-banner": {
          mode: "write",
          risk: "confirm",
        },
        "youtube_data_api-delete-playlist": {
          mode: "destructive",
          risk: "high_impact",
        },
        "youtube_data_api-delete-playlist-items": {
          mode: "destructive",
          risk: "high_impact",
        },
      },
    },
    "google-analytics": {
      actionOverrides: {
        "google_analytics-run-report-in-ga4": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "google_analytics-create-ga4-property": {
          mode: "write",
          risk: "confirm",
        },
        "google_analytics-create-key-event": {
          mode: "write",
          risk: "confirm",
        },
      },
    },
    "google-search-console": {
      actionOverrides: {
        "google_search_console-retrieve-site-performance-data": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "google_search_console-submit-url-for-indexing": {
          mode: "write",
          risk: "confirm",
        },
      },
    },
    "google-calendar": {
      actionOverrides: {
        "google_calendar-add-attendees-to-event": {
          mode: "write",
          risk: "confirm",
        },
        "google_calendar-update-event": {
          enabled: false,
        },
        "google_calendar-update-event-instance": {
          mode: "write",
          risk: "confirm",
        },
        "google_calendar-update-following-instances": {
          mode: "write",
          risk: "confirm",
        },
        "google_calendar-delete-event": {
          mode: "destructive",
          risk: "high_impact",
        },
      },
    },
    "google-docs": {
      excludeActionIds: [
        "google_docs-find-document",
        "google_docs-create-document-from-template",
        "google_docs-create-document",
      ],
      actionOverrides: {
        "google_docs-replace-text": {
          mode: "write",
          risk: "confirm",
        },
        "google_docs-replace-image": {
          mode: "write",
          risk: "confirm",
        },
      },
    },
    xero: {
      actionOverrides: {
        "xero_accounting_api-download-invoice": {
          enabled: false,
        },
        "xero_accounting_api-upload-file": {
          enabled: false,
        },
        "xero_accounting_api-make-an-api-call": {
          enabled: false,
        },
        "xero_accounting_api-find-or-create-contact": {
          mode: "write",
          risk: "confirm",
          idempotent: false,
        },
        "xero_accounting_api-create-bank-transaction": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-create-bill": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-create-credit-note": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-create-payment": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-create-update-contact": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-email-an-invoice": {
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-xero-accounting-create-employee": {
          toolName: "xero_create_employee",
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-xero-accounting-create-or-update-contact": {
          toolName: "xero_create_or_update_contact",
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-xero-accounting-update-contact": {
          toolName: "xero_update_contact",
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-xero-create-purchase-bill": {
          toolName: "xero_create_purchase_bill",
          mode: "write",
          risk: "confirm",
        },
        "xero_accounting_api-xero-create-sales-invoice": {
          toolName: "xero_create_sales_invoice",
          mode: "write",
          risk: "confirm",
        },
      },
    },
    clickup: {
      excludeActionIds: [
        "clickup-create-task-from-template",
      ],
      actionOverrides: {
        "clickup-create-chat-view-comment": {
          enabled: false,
        },
        "clickup-create-view-comment": {
          enabled: false,
        },
        "clickup-create-threaded-comment": {
          enabled: false,
        },
        "clickup-update-checklist": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-checklist-item": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-comment": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-folder": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-list": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-space": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-task": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-update-task-custom-field": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-stop-time-entry": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-remove-task-custom-field": {
          mode: "write",
          risk: "confirm",
        },
        "clickup-create-task": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["markdownDescription"],
        },
        "clickup-create-folder": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["hidden"],
          safeDefaults: {
            hidden: false,
          },
        },
        "clickup-create-space": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["_private"],
          safeDefaults: {
            _private: false,
          },
        },
        "clickup-update-folder": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["hidden"],
          safeDefaults: {
            hidden: false,
          },
        },
        "clickup-update-space": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["_private"],
          safeDefaults: {
            _private: false,
          },
        },
        "clickup-get-custom-fields": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-folder": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-folder-views": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-folders": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-list": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-list-comments": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-list-views": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-lists": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-space": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-space-views": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-spaces": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-task": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-task-comments": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-task-templates": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-tasks": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-team-views": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-view": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-view-comments": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "clickup-get-view-tasks": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
      },
    },
    airtable: {
      hiddenProps: ["warningAlert", "accountTierAlert"],
      excludeActionIds: [],
      actionOverrides: {
        "airtable_oauth-list-bases": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "airtable_oauth-list-tables": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "airtable_oauth-list-records": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "airtable_oauth-list-records-in-view": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "airtable_oauth-get-record": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "airtable_oauth-create-comment": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-update-comment": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-create-field": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-update-field": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-create-table": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-update-table": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-delete-record": {
          mode: "destructive",
          risk: "high_impact",
        },
        "airtable_oauth-create-multiple-records": {
          mode: "write",
          risk: "confirm",
        },
        "airtable_oauth-create-single-record": {
          enabled: false,
        },
        "airtable_oauth-update-record": {
          enabled: false,
        },
        "airtable_oauth-create-or-update-record": {
          enabled: false,
        },
        "airtable_oauth-get-record-or-create": {
          enabled: false,
        },
        "airtable_oauth-search-records": {
          enabled: false,
        },
      },
    },
    salesforce: {
      hiddenProps: ["info", "infoBox", "docsInfo"],
      excludeActionIds: [],
      actionOverrides: {
        "salesforce_rest_api-list-objects": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-describe-object": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-list-object-fields": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-find-records": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-record-by-id": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-related-records": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-case": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-current-user": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-user": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-user-info": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-list-case-comments": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-list-email-messages": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-list-email-templates": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-list-knowledge-articles": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-knowledge-articles": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-get-knowledge-data-category-groups": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-search-string": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-text-search": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-soql-query": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-soql-search": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-sosl-search": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-convert-soap-xml-to-json": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "salesforce_rest_api-add-contact-to-campaign": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-add-lead-to-campaign": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-create-crm-record": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-update-crm-record": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-delete-crm-record": {
          mode: "destructive",
          risk: "high_impact",
        },
        "salesforce_rest_api-send-email": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-post-feed-to-chatter": {
          mode: "write",
          risk: "confirm",
        },
        "salesforce_rest_api-delete-note": {
          mode: "destructive",
          risk: "high_impact",
        },
        "salesforce_rest_api-delete-opportunity": {
          mode: "destructive",
          risk: "high_impact",
        },
        "salesforce_rest_api-delete-record": {
          mode: "destructive",
          risk: "high_impact",
        },
        "salesforce_rest_api-create-account": {
          enabled: false,
        },
        "salesforce_rest_api-create-accounts-batch": {
          enabled: false,
        },
        "salesforce_rest_api-create-attachment": {
          enabled: false,
        },
        "salesforce_rest_api-create-campaign": {
          enabled: false,
        },
        "salesforce_rest_api-create-case": {
          enabled: false,
        },
        "salesforce_rest_api-create-casecomment": {
          enabled: false,
        },
        "salesforce_rest_api-create-contact": {
          enabled: false,
        },
        "salesforce_rest_api-create-content-note": {
          enabled: false,
        },
        "salesforce_rest_api-create-event": {
          enabled: false,
        },
        "salesforce_rest_api-create-lead": {
          enabled: false,
        },
        "salesforce_rest_api-create-note": {
          enabled: false,
        },
        "salesforce_rest_api-create-opportunities-batch": {
          enabled: false,
        },
        "salesforce_rest_api-create-opportunity": {
          enabled: false,
        },
        "salesforce_rest_api-create-record": {
          enabled: false,
        },
        "salesforce_rest_api-create-task": {
          enabled: false,
        },
        "salesforce_rest_api-create-user": {
          enabled: false,
        },
        "salesforce_rest_api-insert-blob-data": {
          enabled: false,
        },
        "salesforce_rest_api-update-account": {
          enabled: false,
        },
        "salesforce_rest_api-update-accounts-batch": {
          enabled: false,
        },
        "salesforce_rest_api-update-contact": {
          enabled: false,
        },
        "salesforce_rest_api-update-content-note": {
          enabled: false,
        },
        "salesforce_rest_api-update-email-template": {
          enabled: false,
        },
        "salesforce_rest_api-update-note": {
          enabled: false,
        },
        "salesforce_rest_api-update-opportunities-batch": {
          enabled: false,
        },
        "salesforce_rest_api-update-opportunity": {
          enabled: false,
        },
        "salesforce_rest_api-update-record": {
          enabled: false,
        },
        "salesforce_rest_api-upsert-record": {
          enabled: false,
        },
      },
    },
    calendly: {
      excludeActionIds: [],
      hiddenProps: [],
      actionOverrides: {
        "calendly_v2-get-event": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "calendly_v2-list-event-invitees": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "calendly_v2-list-events": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "calendly_v2-list-user-availability-schedules": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "calendly_v2-list-webhook-subscriptions": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "calendly_v2-create-scheduling-link": {
          mode: "write",
          risk: "confirm",
        },
        "calendly_v2-create-invitee-no-show": {
          mode: "write",
          risk: "confirm",
        },
      },
    },
    onedrive: {
      excludeActionIds: [],
      hiddenProps: [],
      actionOverrides: {
        "microsoft_onedrive-create-folder": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["parentFolderId", "sharedFolderReference"],
        },
        "microsoft_onedrive-create-link": {
          mode: "write",
          risk: "confirm",
        },
        "microsoft_onedrive-download-file": {
          mode: "read",
          risk: "safe",
          idempotent: true,
          hiddenProps: ["syncDir"],
        },
        "microsoft_onedrive-find-file-by-name": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_onedrive-get-excel-table": {
          mode: "read",
          risk: "safe",
          idempotent: true,
          hiddenProps: ["alert"],
        },
        "microsoft_onedrive-get-file-by-id": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_onedrive-list-files-in-folder": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_onedrive-list-my-drives": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_onedrive-search-files": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "microsoft_onedrive-upload-file": {
          mode: "write",
          risk: "confirm",
          hiddenProps: ["syncDir"],
        },
      },
    },
    hubspot: {
      excludeActionIds: [
        "hubspot-retrieve-migrated-workflow-mappings",
      ],
      actionOverrides: {
        "hubspot-create-or-update-contact": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-batch-create-or-update-contact": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-batch-update-companies": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-batch-upsert-companies": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-blog-post": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-blog-post-draft": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-company": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-contact": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-custom-object": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-deal": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-fields-on-the-form": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-landing-page": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-lead": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-update-page": {
          mode: "write",
          risk: "confirm",
        },
        "hubspot-get-associated-emails": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-associated-meetings": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-blog-post-draft": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-channel": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-company": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-contact": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-crm-objects": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-deal": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-file-public-url": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-inbox": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-meeting": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-owner": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-properties": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-subscription-preferences": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-get-user-details": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-associated-engagements": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-association-labels": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-blog-posts": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-campaigns": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-channels": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-crm-associations": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-forms": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-inboxes": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-marketing-emails": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-marketing-events": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-messages": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-owners": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-pages": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-pipelines-and-stages": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-templates": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-list-threads": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-retrieve-quotes": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-retrieve-workflow-details": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-retrieve-workflow-emails": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-retrieve-workflows": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-search-crm": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-search-crm-objects": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
        "hubspot-search-properties": {
          mode: "read",
          risk: "safe",
          idempotent: true,
        },
      },
    },
  },
};

export default overrides;
