export default {
  slug: "google-docs",
  read: [
    {
      tool: "googledocs_search_documents",
      args: (ctx) => ({
        query: ctx.optional("googleDocsQuery") ?? "test",
      }),
      label: "Search Google Docs documents",
    },
    {
      tool: "googledocs_get_document_plaintext",
      args: {},
      label: "Get document plaintext (requires docId)",
    },
  ],
  preview: [],
  write: [],
};
