export default {
  slug: "google-search-console",
  read: [
    {
      tool: "google-search-console_retrieve_site_performance_data",
      args: (ctx) => ({
        siteUrl: ctx.require("siteUrl", "google search console site url"),
        startDate: ctx.optional("startDate") ?? "2026-04-01",
        endDate: ctx.optional("endDate") ?? "2026-04-28",
        rowLimit: ctx.number("rowLimit", 10),
      }),
    },
  ],
  preview: [
    {
      tool: "google-search-console_submit_url_for_indexing",
      args: (ctx) => ({
        url: ctx.require("url", "url to submit for indexing preview"),
      }),
    },
  ],
  write: [],
};
