export default {
  slug: "onedrive",
  read: [
    { tool: "one_drive_list_drives", args: {}, label: "List drives" },
    { tool: "one_drive_get_drive", args: {}, label: "Get default drive" },
    { tool: "one_drive_list_folder_children", args: {}, label: "List root folder children" },
  ],
  preview: [
    {
      tool: "one_drive_onedrive_create_folder",
      args: (ctx) => ({
        folderName: ctx.optional("onedriveFolderName") ?? "ClawLink smoke preview",
      }),
      label: "Preview create folder",
    },
  ],
  write: [],
};
