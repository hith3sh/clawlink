export default {
  slug: "gmail",
  read: [
    { tool: "gmail_get_current_user" },
    {
      tool: "gmail_find_email",
      args: (ctx) => ({
        q: ctx.optional("query") ?? "in:inbox",
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
