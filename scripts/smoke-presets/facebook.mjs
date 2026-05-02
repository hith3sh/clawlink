export default {
  slug: "facebook",
  read: [
    { tool: "facebook_list_managed_pages" },
    { tool: "facebook_get_page_details" },
    {
      tool: "facebook_get_page_posts",
      args: (ctx) => ({
        page_id: ctx.require("pageId", "Facebook Page ID"),
      }),
    },
    { tool: "facebook_get_page_insights" },
  ],
  preview: [
    {
      tool: "facebook_create_post",
      args: (ctx) => ({
        page_id: ctx.require("pageId", "Facebook Page ID"),
        message: ctx.optional("message") ?? "ClawLink smoke test. Do not publish.",
      }),
    },
  ],
  write: [],
};