import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
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
    inputSchema: partial.inputSchema,
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
    description: "Ask the Postiz agent a question about managing or scheduling social media posts",
    toolSlug: "POSTIZ_MCP_ASK_POSTIZ",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        message: {
          type: "string",
          description: "The question or input for the agent.",
        },
      },
      required: [
        "message",
      ],
    },
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
    description: "Generate an image to use in a social media post. Use when a platform requires an image attachment and none was provided.",
    toolSlug: "POSTIZ_MCP_GENERATEIMAGETOOL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        prompt: {
          type: "string",
        },
      },
      required: [
        "prompt",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm before generating an image for a social media post.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_generatevideooptions",
    description: "Get available options for generating videos in Postiz. Returns the list of video generation types and their configurable parameters.",
    toolSlug: "POSTIZ_MCP_GENERATEVIDEOOPTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "postiz",
      "read",
    ],
  }),
  composioTool({
    name: "postiz_mcp_generatevideotool",
    description: "Generate a video to use in a social media post. Supports Image Text Slides and Veo3 (Audio + Video) formats. Call videoFunctionTool first if you need options like voice ID.",
    toolSlug: "POSTIZ_MCP_GENERATEVIDEOTOOL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        output: {
          type: "string",
          enum: [
            "vertical",
            "horizontal",
          ],
        },
        identifier: {
          type: "string",
        },
        customParams: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              key: {
                type: "string",
                description: "Name of the settings key to pass",
              },
              value: {
                type: "string",
                description: "Value of the key",
              },
            },
          },
        },
      },
      required: [
        "identifier",
        "output",
        "customParams",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm before generating a video for a social media post.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationlist",
    description: "List available integrations connected in Postiz that you can schedule posts to",
    toolSlug: "POSTIZ_MCP_INTEGRATIONLIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "postiz",
      "read",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationscheduleposttool",
    description: "Schedule or publish a social media post through Postiz. Supports drafting, scheduling, and immediate posting across connected platforms.",
    toolSlug: "POSTIZ_MCP_INTEGRATIONSCHEDULEPOSTTOOL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        socialPost: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              date: {
                type: "string",
                description: "The date of the post in UTC time",
              },
              type: {
                type: "string",
                description: "The type of the post, if we pass now, we should pass the current date also",
                enum: [
                  "draft",
                  "schedule",
                  "now",
                ],
              },
              settings: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    key: {
                      type: "string",
                      description: "Name of the settings key to pass",
                    },
                    value: {
                      type: "string",
                      description: "Value of the key, always prefer the id then label if possible",
                    },
                  },
                },
                description: "This relies on the integrationSchema tool to get the settings [input:settings]",
              },
              isPremium: {
                type: "boolean",
                description: "If the integration is X, return if it's premium or not",
              },
              shortLink: {
                type: "boolean",
                description: "If the post has a link inside, we can ask the user if they want to add a short link",
              },
              integrationId: {
                type: "string",
                description: "The id of the integration (not internal id)",
              },
              postsAndComments: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    content: {
                      type: "string",
                      description: "The content of the post, HTML, Each line must be wrapped in <p> here is the possible tags: h1, h2, h3, u, strong, li, ul, p (you can't have u and strong together)",
                    },
                    attachments: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "The image of the post (URLS)",
                    },
                  },
                },
                description: "first item is the post, every other item is the comments",
              },
            },
          },
          description: "Individual post",
        },
      },
      required: [
        "socialPost",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before scheduling a social media post.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_integrationschema",
    description: "Get the posting schema and requirements for a social media platform in Postiz. Call this before scheduling posts to understand available settings and required fields for each platform.",
    toolSlug: "POSTIZ_MCP_INTEGRATIONSCHEMA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        platform: {
          type: "string",
          description: "Platform identifier (x, linkedin, linkedin-page, reddit, instagram, instagram-standalone, facebook, threads, youtube, gmb, tiktok, pinterest, dribbble, discord, slack, kick, twitch, mastodon, bluesky, lemmy, wrapcast, telegram, nostr, vk, medium, devto, hashnode, wordpress, listmonk, moltbook, whop, skool)",
        },
        isPremium: {
          type: "boolean",
          description: "Whether the user has a premium Postiz account. Set to false if unsure.",
        },
      },
      required: [
        "isPremium",
        "platform",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "read",
    ],
  }),
  composioTool({
    name: "postiz_mcp_triggertool",
    description: "Fetch additional details needed for scheduling posts, such as resolving IDs that integrationSchema requires. Call this after integrationSchema when specific lookups are needed.",
    toolSlug: "POSTIZ_MCP_TRIGGERTOOL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dataSchema: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              key: {
                type: "string",
                description: "Name of the settings key to pass",
              },
              value: {
                type: "string",
                description: "Value of the key",
              },
            },
          },
        },
        methodName: {
          type: "string",
          description: "The methodName from the `integrationSchema` functions in the tools array, required",
        },
        integrationId: {
          type: "string",
          description: "The id of the integration",
        },
      },
      required: [
        "integrationId",
        "methodName",
        "dataSchema",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "write",
    ],
    askBefore: [
      "Confirm before triggering a Postiz lookup action.",
    ],
  }),
  composioTool({
    name: "postiz_mcp_videofunctiontool",
    description: "Retrieve additional video generation details from Postiz, such as available voice IDs for video creation. Call this before generating videos when specific options are needed.",
    toolSlug: "POSTIZ_MCP_VIDEOFUNCTIONTOOL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        identifier: {
          type: "string",
        },
        functionName: {
          type: "string",
        },
      },
      required: [
        "identifier",
        "functionName",
      ],
    },
    tags: [
      "composio",
      "postiz",
      "read",
    ],
  }),
];
