export default {
  slug: "xero",
  read: [
    { tool: "xero_get_tenant_connections" },
  ],
  preview: [
    {
      tool: "xero_create_tracking_category",
      args: (ctx) => ({
        tenantId: ctx.require("xeroTenantId", "Xero tenant id for preview"),
        name: ctx.optional("xeroTrackingCategoryName") ?? "ClawLink smoke preview",
        options: [],
      }),
    },
  ],
  write: [],
};
