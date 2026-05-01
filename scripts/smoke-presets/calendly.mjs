export default {
  slug: "calendly",
  read: [
    {
      tool: "calendly_list_events",
      args: (ctx) => ({
        scope: ctx.optional("calendlyScope") ?? "user",
        status: ctx.optional("calendlyStatus") ?? "active",
        paginate: false,
        maxResults: ctx.number("calendlyMaxResults", 1),
      }),
    },
  ],
  preview: [
    {
      tool: "calendly_create_scheduling_link",
      args: (ctx) => ({
        owner: ctx.require("calendlyOwner", "Calendly owner URI for preview"),
        maxEventCount: ctx.number("calendlyMaxEventCount", 1),
      }),
    },
  ],
  write: [],
};
