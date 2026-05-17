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
    integration: "telegram",
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
      toolkit: "telegram",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const telegramComposioTools: IntegrationTool[] = [
  composioTool({
    name: "telegram_answer_callback_query",
    description: "Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert.",
    toolSlug: "TELEGRAM_ANSWER_CALLBACK_QUERY",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "callback",
      "inline",
      "keyboard",
      "buttons",
    ],
    askBefore: [
      "Confirm the parameters before executing Answer Callback Query.",
    ],
  }),
  composioTool({
    name: "telegram_create_chat_invite_link",
    description: "Generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights.",
    toolSlug: "TELEGRAM_CREATE_CHAT_INVITE_LINK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "telegram",
      "write",
      "chat",
      "invite",
      "link",
      "management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Export Chat Invite Link.",
    ],
  }),
  composioTool({
    name: "telegram_delete_message",
    description: "Delete a message, including service messages. Limitations: cannot delete messages older than 48 hours in groups, forwarded messages, or content in protected chats (returns 400 'message can’t be deleted'). Bot must have delete/manage rights in the target chat; works reliably only on bot-authored messages in groups. Verify permissions via TELEGRAM_GET_CHAT or TELEGRAM_GET_CHAT_ADMINISTRATORS before calling. On flood control, Telegram returns HTTP 429 with a retry_after field; honor that backoff value.",
    toolSlug: "TELEGRAM_DELETE_MESSAGE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "deletion",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Message.",
    ],
  }),
  composioTool({
    name: "telegram_edit_message",
    description: "Edit text messages sent by the bot. Only bot-authored messages can be edited; editing messages from other users will fail. In groups, the bot must have edit permissions.",
    toolSlug: "TELEGRAM_EDIT_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "editing",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit Message.",
    ],
  }),
  composioTool({
    name: "telegram_forward_message",
    description: "Forward messages of any kind. Service messages can't be forwarded.",
    toolSlug: "TELEGRAM_FORWARD_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "forward",
      "share",
    ],
    askBefore: [
      "Confirm the parameters before executing Forward Message.",
    ],
  }),
  composioTool({
    name: "telegram_get_chat",
    description: "Get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). The bot must be a member of or have access to the target chat; calls fail if the bot was never added, was removed, or is blocked.",
    toolSlug: "TELEGRAM_GET_CHAT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "chat",
      "info",
    ],
  }),
  composioTool({
    name: "telegram_get_chat_administrators",
    description: "Get a list of administrators in a chat. On success, returns an Array of ChatMember objects containing information about all chat administrators except other bots. Only meaningful for supergroups and channels; private chats yield no useful data. The bot must be a member of the chat; if the bot has admin rights, its own entry will appear in the result, useful for verifying its permissions before moderation actions.",
    toolSlug: "TELEGRAM_GET_CHAT_ADMINISTRATORS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "chat",
      "administrators",
      "management",
    ],
  }),
  composioTool({
    name: "telegram_get_chat_history",
    description: "Get chat history messages via the getUpdates polling method, filtered by chat_id. Returns only updates from the specified chat. Bot can only retrieve messages sent after it joined the chat; missing older messages is expected. Requires no active webhook — a webhook causes HTTP 409 conflict; delete it before using this tool. Empty result arrays (ok=true) indicate no accessible messages, not a failure. Returned message dates are Unix timestamps in UTC seconds.",
    toolSlug: "TELEGRAM_GET_CHAT_HISTORY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "chat",
      "history",
      "messages",
    ],
  }),
  composioTool({
    name: "telegram_get_chat_member",
    description: "Get a chat member's status/role (including the bot itself) to preflight permissions and troubleshoot 403/empty-history issues. Use before sending messages to verify bot membership and permissions.",
    toolSlug: "TELEGRAM_GET_CHAT_MEMBER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "member",
    ],
  }),
  composioTool({
    name: "telegram_get_chat_members_count",
    description: "Get the number of members in a chat. The bot must be an administrator in the chat for this to work. Insufficient admin permissions surface as authorization errors, not as a zero or empty count.",
    toolSlug: "TELEGRAM_GET_CHAT_MEMBERS_COUNT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "chat",
      "members",
      "analytics",
    ],
  }),
  composioTool({
    name: "telegram_get_me",
    description: "Get basic information about the bot using the Bot API getMe method. Returns fields like id, username, first_name, and capabilities. If the response returns ok=false, the bot token is invalid or revoked and must be replaced before any other API calls. Bot name, bio, and profile description are read-only via the Bot API; modify them via BotFather.",
    toolSlug: "TELEGRAM_GET_ME",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "bot",
      "info",
    ],
  }),
  composioTool({
    name: "telegram_get_updates",
    description: "Use this method to receive incoming updates using long polling. An Array of Update objects is returned. IMPORTANT: This method will not work if an outgoing webhook is set up. Webhooks and getUpdates are mutually exclusive — call deleteWebhook first to switch modes (409 Conflict otherwise). Notes: - Only one method (webhook or polling) can be active at a time - Updates available for up to 24 hours if unclaimed - Recalculate offset after each response to avoid duplicates - Empty result array (ok=true) is valid, meaning no new updates - On HTTP 429, honor the retry_after value; keep polling to ~1 request/second - Only chats with updates since the bot joined or last offset appear in results - Update objects vary by type; always check update.message and update.message.text exist before accessing",
    toolSlug: "TELEGRAM_GET_UPDATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "telegram",
      "read",
      "updates",
      "polling",
    ],
  }),
  composioTool({
    name: "telegram_send_document",
    description: "Send general files (documents) to a Telegram chat using the Bot API. Prefer over TELEGRAM_SEND_PHOTO when original file format or image resolution must be preserved. Rapid sends trigger flood control (HTTP 429 with `retry_after` seconds); limit to ~1 message/second per chat and wait the specified `retry_after` duration before retrying.",
    toolSlug: "TELEGRAM_SEND_DOCUMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "media",
      "document",
      "file",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Document.",
    ],
  }),
  composioTool({
    name: "telegram_send_location",
    description: "Send point on the map location to a Telegram chat using the Bot API.",
    toolSlug: "TELEGRAM_SEND_LOCATION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "location",
      "maps",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Location.",
    ],
  }),
  composioTool({
    name: "telegram_send_message",
    description: "Send a text message to a Telegram chat using the Bot API. Bots must be members of target groups/channels with post rights. Rate limit: ~1 msg/sec per chat, ~30 msg/sec globally; exceeding returns 429 with retry_after seconds that must be honored.",
    toolSlug: "TELEGRAM_SEND_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Message.",
    ],
  }),
  composioTool({
    name: "telegram_send_photo",
    description: "Send photos to a Telegram chat using the Bot API. Telegram compresses and re-encodes images; use TELEGRAM_SEND_DOCUMENT to preserve original resolution/format. Each call produces a separate post; no media-group/album support. Returns HTTP 429 with `retry_after` seconds when sending too rapidly.",
    toolSlug: "TELEGRAM_SEND_PHOTO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "media",
      "photo",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Photo.",
    ],
  }),
  composioTool({
    name: "telegram_send_poll",
    description: "Send a native poll to a Telegram chat using the Bot API.",
    toolSlug: "TELEGRAM_SEND_POLL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "messaging",
      "poll",
      "survey",
      "quiz",
    ],
    askBefore: [
      "Confirm the parameters before executing Send Poll.",
    ],
  }),
  composioTool({
    name: "telegram_set_my_commands",
    description: "Use this method to change the list of the bot's commands. See https://core.telegram.org/bots#commands for more details about bot commands.",
    toolSlug: "TELEGRAM_SET_MY_COMMANDS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "telegram",
      "write",
      "bot",
      "commands",
      "menu",
      "setup",
    ],
    askBefore: [
      "Confirm the parameters before executing Set Bot Commands.",
    ],
  }),
];
