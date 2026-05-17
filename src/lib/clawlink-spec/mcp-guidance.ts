import type { ClawLinkMcpToolDefinition } from "@/lib/clawlink-spec/mcp-types";

interface ClawLinkMcpResource {
  uri: string;
  name: string;
  title: string;
  description: string;
  mimeType: "text/markdown";
  text: string;
}

interface ClawLinkMcpPromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

interface ClawLinkMcpPrompt {
  name: string;
  title: string;
  description: string;
  arguments?: ClawLinkMcpPromptArgument[];
}

type PromptMessage = {
  role: "user" | "assistant";
  content: {
    type: "text";
    text: string;
  };
};

export interface McpPromptResult {
  description: string;
  messages: PromptMessage[];
}

const EXTERNAL_APP_EXAMPLES =
  "LinkedIn, Instagram, Gmail, Google Drive, Google Calendar, Google Sheets, Google Docs, Slack, Outlook, Notion, CRMs, analytics tools, and other third-party SaaS apps";

export const CLAWLINK_MCP_RESOURCES: ClawLinkMcpResource[] = [
  {
    uri: "clawlink://guides/hermes-routing",
    name: "clawlink_hermes_routing_guide",
    title: "Route External App Requests Through ClawLink",
    description:
      "Guidance for Hermes sessions: treat ClawLink as the default path for third-party app requests before falling back to browser limitations.",
    mimeType: "text/markdown",
    text: `# ClawLink routing guide for Hermes

Use ClawLink first whenever the user asks to connect, authenticate, inspect, search, read from, or write to external apps such as ${EXTERNAL_APP_EXAMPLES}.

## Default workflow

1. If the user names an app, call \`clawlink.get_connection\` or \`clawlink.list_integrations\` before saying you cannot access it.
2. If the app is not connected, call \`clawlink.connect_app\`.
3. Tell the user to open the returned \`connect_url\`, approve the app, then come back when finished.
4. After the user returns, check \`clawlink.get_connection\` or \`clawlink.list_integrations\` again.
5. If the app is connected, call \`clawlink.list_actions\` or \`clawlink.search\` to find the right action.
6. Only fall back to generic browser limitations if the ClawLink catalog or connection state proves the app is unsupported or unavailable.

## Important rule

Do not answer "I can't access LinkedIn/Gmail/Drive/Calendar from here" without checking ClawLink first in the current session.
`,
  },
  {
    uri: "clawlink://guides/connection-flow",
    name: "clawlink_connection_flow_guide",
    title: "Connection Flow Guide",
    description:
      "Step-by-step guide for starting and completing a ClawLink app connection from an MCP client session.",
    mimeType: "text/markdown",
    text: `# ClawLink connection flow

When the user asks to connect a new app:

1. Call \`clawlink.connect_app\` with the integration slug.
2. If the result status is \`already_connected\`, stop and continue with action discovery.
3. If the result status is \`requires_user_action\`, show the user the returned \`connect_url\`.
4. Tell the user to finish the hosted approval flow in the browser and then return to chat.
5. After they return, verify connection health with \`clawlink.get_connection\`.

Recommended examples:

- "connect my linkedin" -> \`integration_id: "linkedin"\`
- "connect my gmail" -> \`integration_id: "gmail"\`
- "connect my google drive" -> \`integration_id: "google-drive"\`
- "connect my google calendar" -> \`integration_id: "google-calendar"\`
- "connect my instagram" -> \`integration_id: "instagram"\`
`,
  },
];

export const CLAWLINK_MCP_PROMPTS: ClawLinkMcpPrompt[] = [
  {
    name: "clawlink.route_external_app_request",
    title: "Route A Third-Party App Request",
    description:
      "Use this when the user asks to connect or use a third-party app and you want a ClawLink-first workflow.",
    arguments: [
      {
        name: "user_request",
        description: "The user's original request in plain language.",
        required: true,
      },
      {
        name: "integration_id",
        description: "Optional integration slug if you already know it, such as linkedin or gmail.",
      },
    ],
  },
  {
    name: "clawlink.connect_app_workflow",
    title: "Connect A Specific App Through ClawLink",
    description:
      "Use this when the user explicitly wants to connect a named app through ClawLink.",
    arguments: [
      {
        name: "integration_id",
        description: "Integration slug to connect, such as linkedin, gmail, google-drive, or instagram.",
        required: true,
      },
      {
        name: "user_request",
        description: "Optional original user wording for the request.",
      },
    ],
  },
];

function normalizePromptString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function toolNameSummary(toolNames: ClawLinkMcpToolDefinition["name"][]): string {
  return toolNames.map((name) => `\`${name}\``).join(", ");
}

export function listMcpResources() {
  return {
    resources: CLAWLINK_MCP_RESOURCES.map((resource) => ({
      uri: resource.uri,
      name: resource.name,
      title: resource.title,
      description: resource.description,
      mimeType: resource.mimeType,
    })),
  };
}

export function readMcpResource(uri: string) {
  const resource = CLAWLINK_MCP_RESOURCES.find((entry) => entry.uri === uri);

  if (!resource) {
    return null;
  }

  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: resource.mimeType,
        text: resource.text,
      },
    ],
  };
}

export function listMcpPrompts() {
  return {
    prompts: CLAWLINK_MCP_PROMPTS.map((prompt) => ({
      name: prompt.name,
      title: prompt.title,
      description: prompt.description,
      arguments: prompt.arguments ?? [],
    })),
  };
}

export function getMcpPrompt(
  name: string,
  args: Record<string, unknown> | undefined,
): McpPromptResult | null {
  const userRequest = normalizePromptString(args?.user_request) ?? "connect my app";
  const integrationId = normalizePromptString(args?.integration_id);

  switch (name) {
    case "clawlink.route_external_app_request":
      return {
        description:
          "ClawLink-first workflow for third-party app requests in Hermes sessions.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                "You have ClawLink MCP tools available in this session.",
                `Treat ClawLink as the default way to handle third-party app requests such as ${EXTERNAL_APP_EXAMPLES}.`,
                `User request: ${userRequest}`,
                integrationId ? `Known integration slug: ${integrationId}` : "If the integration slug is not known, infer it and verify with ClawLink.",
                `Before saying you cannot access the app, check ClawLink first with ${toolNameSummary([
                  "clawlink.list_integrations",
                  "clawlink.get_connection",
                  "clawlink.search",
                ])}.`,
                `If the app is not connected, start the hosted flow with ${toolNameSummary([
                  "clawlink.connect_app",
                  "clawlink.begin_connection",
                ])}.`,
                "Only fall back to generic browser limitations if ClawLink proves the app is unsupported or unavailable.",
              ].join("\n"),
            },
          },
        ],
      };
    case "clawlink.connect_app_workflow":
      return {
        description: "Step-by-step prompt for connecting one app through ClawLink.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                "You are connecting an app through ClawLink.",
                `User request: ${userRequest}`,
                `Integration slug: ${integrationId ?? "infer the correct slug before proceeding"}`,
                "Check whether the app is already connected.",
                "If it is not connected, call `clawlink.connect_app` and present the returned `connect_url` to the user.",
                "After the user finishes the browser flow and returns, verify the connection with `clawlink.get_connection` or `clawlink.list_integrations`.",
              ].join("\n"),
            },
          },
        ],
      };
    default:
      return null;
  }
}
