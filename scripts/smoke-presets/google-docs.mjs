export default {
  slug: "google-docs",
  read: [
    {
      tool: "google-docs_get_document",
      args: (ctx) => ({
        documentId:
          ctx.optional("documentId") ??
          ctx.optional("docId") ??
          ctx.require("documentId", "google docs document id"),
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
