export default {
  slug: "google-search-console",
  read: [
    { tool: "google_search_console_list_sites" },
    {
      tool: "google_search_console_search_analytics_query",
      args: (ctx) => ({
        site_url: ctx.require("siteUrl", "Google Search Console site URL"),
        start_date: ctx.optional("startDate") ?? "2026-04-01",
        end_date: ctx.optional("endDate") ?? "2026-04-28",
        row_limit: ctx.number("rowLimit", 10),
      }),
    },
    {
      tool: "google_search_console_inspect_url",
      args: (ctx) => ({
        inspection_url: ctx.require("url", "URL to inspect for indexing status"),
        site_url: ctx.require("siteUrl", "Google Search Console site URL"),
      }),
    },
  ],
  preview: [
    {
      tool: "google_search_console_submit_sitemap",
      args: (ctx) => ({
        site_url: ctx.require("siteUrl", "Google Search Console site URL"),
        feedpath: ctx.require("sitemapUrl", "Sitemap URL to submit"),
      }),
    },
  ],
  write: [],
};