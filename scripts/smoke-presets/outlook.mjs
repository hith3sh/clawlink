export default {
  slug: "outlook",
  read: [
    { tool: "outlook_get_profile", args: {}, label: "Get Outlook profile" },
    {
      tool: "outlook_list_messages",
      args: { top: 1 },
      label: "List recent messages",
    },
    {
      tool: "outlook_list_calendars",
      args: {},
      label: "List calendars",
    },
    {
      tool: "outlook_list_events",
      args: { top: 1 },
      label: "List recent events",
    },
    {
      tool: "outlook_list_user_contacts",
      args: { top: 1 },
      label: "List contacts",
    },
    {
      tool: "outlook_list_todo_tasks",
      args: { top: 1 },
      label: "List tasks",
    },
  ],
  preview: [
    {
      tool: "outlook_create_draft",
      args: (ctx) => ({
        toRecipients: [
          { emailAddress: { address: ctx.require("to", "Outlook preview recipient") } },
        ],
        subject: ctx.optional("subject") ?? "ClawLink smoke preview",
        body: { contentType: "Text", content: ctx.optional("body") ?? "Smoke preview only. Do not send." },
      }),
      label: "Preview create draft",
    },
  ],
  write: [],
};
