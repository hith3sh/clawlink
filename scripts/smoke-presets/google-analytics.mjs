export default {
  slug: "google-analytics",
  read: [
    {
      tool: "google-analytics_run_report_in_ga4",
      args: (ctx) => ({
        property: ctx.require("property", "google analytics property id"),
        startDate: ctx.optional("startDate") ?? "2026-04-01",
        endDate: ctx.optional("endDate") ?? "2026-04-28",
        metrics: ctx.csv("metrics").length > 0 ? ctx.csv("metrics") : ["activeUsers"],
      }),
    },
  ],
  preview: [],
  write: [],
};
