export default {
  slug: "google-drive",
  read: [
    { tool: "google-drive_get_current_user" },
    { tool: "google-drive_list_files" },
  ],
  preview: [
    {
      tool: "google-drive_move_file",
      args: (ctx) => ({
        fileId: ctx.require("fileId", "google drive file id for preview"),
        folderId: ctx.require("folderId", "google drive destination folder id for preview"),
      }),
    },
  ],
  write: [],
};
