export default {
  slug: "mailchimp",
  read: [
    { tool: "mailchimp_search_lists" },
  ],
  preview: [
    {
      tool: "mailchimp_create_campaign",
      args: (ctx) => ({
        type: "regular",
        recipientsListId: ctx.require("mailchimpListId", "Mailchimp list id for preview"),
        settingsSubjectLine: ctx.optional("mailchimpSubject") ?? "ClawLink smoke preview",
        settingsTitle: ctx.optional("mailchimpTitle") ?? "ClawLink smoke preview",
        settingsFromName: ctx.optional("mailchimpFromName") ?? "ClawLink",
        settingsReplyTo: ctx.require("mailchimpReplyTo", "Mailchimp reply-to email for preview"),
      }),
    },
  ],
  write: [],
};
