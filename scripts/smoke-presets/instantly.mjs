export default {
  slug: "instantly",
  read: [
    // Workspace
    { tool: "instantly_get_current_workspace" },
    { tool: "instantly_get_workspace_billing_plan_details" },

    // Campaigns
    { tool: "instantly_list_campaigns", args: { limit: 2 } },
    { tool: "instantly_count_launched_campaigns" },

    // Leads
    { tool: "instantly_list_leads", args: { limit: 2 } },

    // Lead lists
    { tool: "instantly_list_lead_lists", args: { limit: 2 } },

    // Accounts
    { tool: "instantly_list_accounts", args: { limit: 2 } },

    // Emails
    { tool: "instantly_list_emails", args: { limit: 2 } },
    { tool: "instantly_count_unread_emails" },

    // Tags
    { tool: "instantly_list_custom_tags", args: { limit: 2 } },

    // Block list
    { tool: "instantly_list_block_list_entries", args: { limit: 2 } },

    // Webhooks
    { tool: "instantly_list_webhooks", args: { limit: 2 } },
    { tool: "instantly_get_webhook_event_types" },
  ],
  preview: [
    {
      tool: "instantly_create_lead",
      args: {
        email: "clawlink-preview@example.com",
        first_name: "ClawLink",
        last_name: "Preview",
      },
    },
    {
      tool: "instantly_create_lead_list",
      args: { name: "ClawLink Smoke Test List" },
    },
    {
      tool: "instantly_create_custom_tag",
      args: { label: "clawlink-smoke-test" },
    },
  ],
  write: [],
};
