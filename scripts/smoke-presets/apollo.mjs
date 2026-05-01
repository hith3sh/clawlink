export default {
  slug: "apollo",
  read: [
    {
      tool: "apollo_get_auth_status",
      args: {},
      label: "Get Apollo auth status",
    },
    {
      tool: "apollo_search_contacts",
      args: (ctx) => ({
        q_keywords: ctx.optional("apolloQuery") ?? "test",
        per_page: ctx.number("apolloMaxResults", 1),
      }),
      label: "Search Apollo contacts",
    },
    {
      tool: "apollo_search_accounts",
      args: (ctx) => ({
        per_page: ctx.number("apolloMaxResults", 1),
      }),
      label: "Search Apollo accounts",
    },
  ],
  preview: [],
  write: [],
};
