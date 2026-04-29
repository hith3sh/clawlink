export default {
  slug: "google-docs",
  read: [
    {
      tool: "google-docs_get_document",
      args: (ctx) => ({
        docId: ctx.require("docId", "google docs document id"),
      }),
    },
  ],
  preview: [
    {
      tool: "google-docs_create_document",
      args: (ctx) => ({
        title: ctx.optional("title") ?? "ClawLink smoke preview",
      }),
    },
  ],
  write: [],
};
