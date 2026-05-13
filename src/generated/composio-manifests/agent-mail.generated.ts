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
    integration: "agent-mail",
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
      toolkit: "agent_mail",
      toolSlug: partial.toolSlug,
      version: "20260414_00",
    },
  };
}

export const agentMailComposioTools: IntegrationTool[] = [
  composioTool({
    name: "agent_mail_create_inbox",
    description: "Create a new AgentMail inbox via API. Returns the inbox_id and email address for sending/receiving messages. Use when provisioning new inboxes for agents or workflows.",
    toolSlug: "AGENT_MAIL_CREATE_INBOX",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "agent-mail",
      "write",
      "inbox",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Inbox.",
    ],
  }),
  composioTool({
    name: "agent_mail_get_message",
    description: "Retrieve the complete details of a specific email message from an AgentMail inbox. This action returns the full message content including sender, recipients, subject, body (both text and HTML), attachments, labels, and metadata. Use this to read individual messages after discovering them via LIST_MESSAGES or webhooks.",
    toolSlug: "AGENT_MAIL_GET_MESSAGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "agent-mail",
      "read",
      "email",
      "get",
      "message",
    ],
  }),
  composioTool({
    name: "agent_mail_list_inboxes",
    description: "List all inboxes available to the authenticated AgentMail account. Use this to discover valid inbox_id values for message operations.",
    toolSlug: "AGENT_MAIL_LIST_INBOXES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "agent-mail",
      "read",
      "inbox",
    ],
  }),
  composioTool({
    name: "agent_mail_list_messages",
    description: "List messages from an AgentMail inbox. Returns a `messages` array; each message uses `message_id` and `timestamp` fields (not `id`, `date`, or `items`).",
    toolSlug: "AGENT_MAIL_LIST_MESSAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "agent-mail",
      "read",
      "email",
      "list",
      "inbox",
    ],
  }),
  composioTool({
    name: "agent_mail_send_email",
    description: "Send an email using AgentMail API",
    toolSlug: "AGENT_MAIL_SEND_EMAIL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "agent-mail",
      "write",
      "email",
      "send",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Email.",
    ],
  }),
];
