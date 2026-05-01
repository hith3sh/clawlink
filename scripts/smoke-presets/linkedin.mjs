export default {
  slug: "linkedin",
  read: [
    { tool: "linkedin_get_current_member_profile" },
  ],
  preview: [
    {
      tool: "linkedin_create_text_post_user",
      args: (ctx) => ({
        text: ctx.optional("linkedinPostText") ?? "ClawLink smoke preview. Do not publish.",
      }),
    },
  ],
  write: [],
};
