export default {
  slug: "notion",
  read: [
    { tool: "notion_get_current_user" },
    { tool: "notion_list_all_users" },
  ],
  preview: [
    {
      tool: "notion_create_page",
      args: (ctx) => ({
        parentPageId: ctx.require("notionParentPageId", "Notion parent page id for preview"),
        title: ctx.optional("notionPageTitle") ?? "ClawLink smoke preview",
      }),
    },
  ],
  write: [],
};
