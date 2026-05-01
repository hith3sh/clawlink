export default {
  slug: "postiz",
  read: [
    { tool: "postiz_mcp_integrationlist" },
    { tool: "postiz_mcp_integrationschema", args: { platform: "linkedin", isPremium: false } },
    { tool: "postiz_mcp_generatevideooptions" },
  ],
  preview: [
    {
      tool: "postiz_mcp_ask_postiz",
      args: { message: "What platforms can I post to?" },
    },
  ],
  write: [],
};