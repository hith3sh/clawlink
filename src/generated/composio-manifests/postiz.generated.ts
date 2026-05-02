import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "postiz",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "postiz_mcp",
      toolSlug: partial.toolSlug,
      version: "20260303_02",
    },
  };
}

export const postizComposioTools: IntegrationTool[] = [
  composioTool({
    name: "postiz_mcp_ask_postiz",
    description: "Ask agent 'postiz' a question. Agent description: Agent that helps manage and schedule social media posts for users",
    toolSlug: "POSTIZ_MCP_ASK_POSTIZ",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Ask postiz.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_generateimagetool",
    description: "Generate image to use in a post,\n                    in case the user specified a platform that requires attachment and attachment was not provided,\n                    ask if they want to generate a picture of a video.\n      ",
    toolSlug: "POSTIZ_MCP_GENERATEIMAGETOOL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Generateimagetool.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_generatevideooptions",
    description: "All the options to generate videos, some tools might require another call to generateVideoFunction",
    toolSlug: "POSTIZ_MCP_GENERATEVIDEOOPTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Generatevideooptions.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_generatevideotool",
    description: "Generate video to use in a post,\n                    in case the user specified a platform that requires attachment and attachment was not provided,\n                    ask if they want to generate a picture of a video.\n                    In many cases 'videoFunctionTool' will need to be called first, to get things like voice id\n                    Here are the type of video that can be generated:\n                    -Image Text Slides\n-Veo3 (Audio + Video)\n      ",
    toolSlug: "POSTIZ_MCP_GENERATEVIDEOTOOL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Generatevideotool.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationlist",
    description: "This tool list available integrations to schedule posts to",
    toolSlug: "POSTIZ_MCP_INTEGRATIONLIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Integrationlist.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationscheduleposttool",
    description: "\nThis tool allows you to schedule a post to a social media platform, based on integrationSchema tool.\nSo for example:\n\nIf the user want to post a post to LinkedIn with one comment\n- socialPost array length will be one\n- postsAndComments array length will be two (one for the post, one for the comment)\n\nIf the user want to post 20 posts for facebook each in individual days without comments\n- socialPost array length will be 20\n- postsAndComments array length will be one\n\nIf the tools return errors, you would need to rerun it with the right parameters, don't ask again, just run it\n",
    toolSlug: "POSTIZ_MCP_INTEGRATIONSCHEDULEPOSTTOOL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Integrationscheduleposttool.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationschema",
    description: "Everytime we want to schedule a social media post, we need to understand the schema of the integration.\n         This tool helps us get the schema of the integration.\n         Sometimes we might get a schema back the requires some id, for that, you can get information from 'tools'\n         And use the triggerTool function.\n        ",
    toolSlug: "POSTIZ_MCP_INTEGRATIONSCHEMA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Integrationschema.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_triggertool",
    description: "After using the integrationSchema, we sometimes miss details we can't ask from the user, like ids.\n      Sometimes this tool requires to user prompt for some settings, like a word to search for. methodName is required [input:callable-tools]",
    toolSlug: "POSTIZ_MCP_TRIGGERTOOL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Triggertool.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_videofunctiontool",
    description: "Sometimes when we want to generate videos we might need to get some additional information like voice_id, etc",
    toolSlug: "POSTIZ_MCP_VIDEOFUNCTIONTOOL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Videofunctiontool.",
    ],
  }),
];
