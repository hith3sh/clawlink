export default {
  slug: "klaviyo",
  read: [
    {
      tool: "klaviyo_get_lists",
      args: (ctx) => ({
        maxResults: ctx.number("klaviyoMaxResults", 1),
      }),
    },
  ],
  preview: [
    {
      tool: "klaviyo_create_new_list",
      args: (ctx) => ({
        name: ctx.optional("klaviyoListName") ?? "ClawLink smoke preview",
      }),
    },
  ],
  write: [],
};
