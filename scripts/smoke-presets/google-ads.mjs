export default {
  slug: "google-ads",
  read: [
    { tool: "googleads_list_accessible_customers" },
    { tool: "googleads_get_customer_lists" },
    {
      tool: "googleads_get_campaign_by_name",
      args: (ctx) => ({
        customer_id: ctx.require("customerId", "Google Ads customer ID"),
        campaign_name: ctx.optional("campaignName") ?? "Test Campaign",
      }),
    },
  ],
  preview: [
    {
      tool: "googleads_create_customer_list",
      args: (ctx) => ({
        customer_id: ctx.require("customerId", "Google Ads customer ID"),
        name: "ClawLink Test List",
      }),
    },
  ],
  write: [],
};