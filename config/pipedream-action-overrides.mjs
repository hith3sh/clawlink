/**
 * Import-time overrides for manifest generation.
 *
 * Use this to rename tools, hide poor-fit actions, tighten risk metadata,
 * and strip props that should not be exposed directly to OpenClaw.
 *
 * Validation notes:
 * - `hiddenProps` + `safeDefaults` are how we remove Pipedream-only props from
 *   the LLM contract while still satisfying the upstream component.
 * - `validationArgs` can be provided per action for runtime manifest audits.
 *   They must only contain exposed LLM-facing args, never hidden/internal props.
 */
const overrides = {
  integrations: {
    notion: {
      actionOverrides: {
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
  },
};

export default overrides;
