export default {
  slug: "clickup",
  read: [
    { tool: "clickup_get_team_views" },
  ],
  preview: [
    {
      tool: "clickup_create_task",
      args: (ctx) => ({
        listId: ctx.require("clickupListId", "ClickUp list id for preview"),
        name: ctx.optional("clickupTaskName") ?? "ClawLink smoke preview",
      }),
    },
  ],
  write: [],
};
