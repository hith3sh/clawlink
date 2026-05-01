export default {
  slug: "google-analytics",
  read: [
    { tool: "google_analytics_list_account_summaries" },
    {
      tool: "google_analytics_run_report",
      args: (ctx) => ({
        property: ctx.require("property", "Google Analytics property id"),
        start_date: ctx.optional("startDate") ?? "2026-04-01",
        end_date: ctx.optional("endDate") ?? "2026-04-28",
        metrics: ctx.csv("metrics").length > 0 ? ctx.csv("metrics") : ["activeUsers"],
      }),
    },
    {
      tool: "google_analytics_get_metadata",
      args: (ctx) => ({
        name: ctx.require("property", "Google Analytics property id"),
      }),
    },
  ],
  preview: [],
  write: [],
};