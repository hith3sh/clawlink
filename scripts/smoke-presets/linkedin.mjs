export default {
  slug: "linkedin",
  read: [
    { tool: "linkedin_get_my_info", args: {}, label: "Get my profile" },
    { tool: "linkedin_get_network_size", args: {}, label: "Get network size" },
  ],
  preview: [
    {
      tool: "linkedin_create_linked_in_post",
      args: (ctx) => ({
        text: ctx.optional("linkedinPostText") ?? "ClawLink smoke preview. Do not publish.",
      }),
      label: "Preview create post",
    },
  ],
  write: [],
};
