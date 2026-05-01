export default {
  slug: "gmail",
  read: [
    { tool: "gmail_get_profile" },
    { tool: "gmail_list_labels" },
    {
      tool: "gmail_fetch_emails",
      args: (ctx) => ({
        query: ctx.optional("query") ?? "in:inbox",
        maxResults: ctx.number("maxResults", 1),
      }),
    },
  ],
  preview: [
    {
      tool: "gmail_send_email",
      args: (ctx) => ({
        to: [ctx.require("to", "gmail preview recipient")],
        subject: ctx.optional("subject") ?? "ClawLink smoke preview",
        body: ctx.optional("body") ?? "Smoke preview only. Do not send.",
      }),
    },
  ],
  write: [],
};