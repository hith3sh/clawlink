export default {
  slug: "dropbox",
  read: [
    { tool: "dropbox_get_about_me", args: {}, label: "Get current user info" },
    { tool: "dropbox_get_space_usage", args: {}, label: "Get space usage" },
    { tool: "dropbox_list_folder_continue", args: { path: "" }, label: "List root folder contents" },
  ],
  preview: [
    {
      tool: "dropbox_create_folder",
      args: (ctx) => ({
        path: ctx.optional("dropboxFolderPath") ?? "/ClawLink smoke preview",
      }),
      label: "Preview create folder",
    },
  ],
  write: [],
};