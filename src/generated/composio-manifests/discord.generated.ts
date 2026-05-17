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
    integration: "discord",
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
      toolkit: "discord",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const discordComposioTools: IntegrationTool[] = [
  composioTool({
    name: "discord_consume_entitlement",
    description: "Marks a one-time purchase consumable entitlement as consumed for a given application. Only applicable to entitlements backed by one-time purchase consumable SKUs.",
    toolSlug: "DISCORD_CONSUME_ENTITLEMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Consume Entitlement.",
    ],
  }),
  composioTool({
    name: "discord_delete_test_entitlement",
    description: "Deletes a currently active test entitlement for a given application. Use this to clean up test entitlements that are no longer needed.",
    toolSlug: "DISCORD_DELETE_TEST_ENTITLEMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Test Entitlement.",
    ],
  }),
  composioTool({
    name: "discord_delete_user_application_role_connection",
    description: "Deletes the current user's application role connection for the specified application. Removes the platform metadata and linked role connection.",
    toolSlug: "DISCORD_DELETE_USER_APPLICATION_ROLE_CONNECTION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete User Application Role Connection.",
    ],
  }),
  composioTool({
    name: "discord_edit_application_command_permissions",
    description: "Edits the permissions for a specific application command in a guild. Requires OAuth2 Bearer token (bot tokens will error). The authorizing user must have MANAGE_GUILD and MANAGE_ROLES permissions in the target guild.",
    toolSlug: "DISCORD_EDIT_APPLICATION_COMMAND_PERMISSIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Edit Application Command Permissions.",
    ],
  }),
  composioTool({
    name: "discord_get_application_command_permissions",
    description: "Retrieves the permissions for a specific application command in a guild. Requires OAuth2 Bearer token (bot tokens will error). The authorizing user must have MANAGE_GUILD and MANAGE_ROLES permissions in the target guild.",
    toolSlug: "DISCORD_GET_APPLICATION_COMMAND_PERMISSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_batch_application_command_permissions",
    description: "Retrieves permissions for all commands of an application in a guild. Returns a list of permission objects for each command. Requires OAuth2 Bearer token (Bot tokens will error).",
    toolSlug: "DISCORD_GET_BATCH_APPLICATION_COMMAND_PERMISSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_current_user_application_entitlements",
    description: "Tool to retrieve entitlements for the current user for a given application. Use when you need to check what premium offerings or subscriptions the authenticated user has access to.",
    toolSlug: "DISCORD_GET_CURRENT_USER_APPLICATION_ENTITLEMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "commerce_and_entitlements",
    ],
  }),
  composioTool({
    name: "discord_get_gateway",
    description: "Tool to retrieve a valid WebSocket (wss) URL for establishing a Gateway connection to Discord. Use when you need to connect to the Discord Gateway for real-time events.",
    toolSlug: "DISCORD_GET_GATEWAY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "gateway",
    ],
  }),
  composioTool({
    name: "discord_get_guild_template",
    description: "Tool to retrieve information about a Discord guild template using its unique template code. Use when you need to get details about a guild template for creating new servers.",
    toolSlug: "DISCORD_GET_GUILD_TEMPLATE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "guilds_and_widgets",
    ],
  }),
  composioTool({
    name: "discord_get_guild_widget",
    description: "Tool to retrieve the guild widget in JSON format. Use when you need to get public information about a Discord guild's widget that can be displayed on external websites. The widget must be enabled in the guild's server settings.",
    toolSlug: "DISCORD_GET_GUILD_WIDGET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "guilds_and_widgets",
    ],
  }),
  composioTool({
    name: "discord_get_guild_widget_png",
    description: "Tool to retrieve a PNG image widget for a Discord guild. Use when you need a visual representation of the guild widget that can be displayed on external websites. The widget must be enabled in the guild's server settings.",
    toolSlug: "DISCORD_GET_GUILD_WIDGET_PNG",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "guilds_and_widgets",
    ],
  }),
  composioTool({
    name: "discord_get_my_guild_member",
    description: "Retrieves the guild member object for the currently authenticated user within a specified guild, including roles, nickname, join date, and permissions.",
    toolSlug: "DISCORD_GET_MY_GUILD_MEMBER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_my_oauth2_authorization",
    description: "Retrieves current OAuth2 authorization details for the application, including app info, scopes, token expiration, and user data (contingent on scopes like 'identify').",
    toolSlug: "DISCORD_GET_MY_OAUTH2_AUTHORIZATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_my_user",
    description: "Fetches comprehensive profile information for the currently authenticated Discord user, including email if the 'email' scope is granted.",
    toolSlug: "DISCORD_GET_MY_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_openid_connect_userinfo",
    description: "Retrieve OpenID Connect compliant user information for the authenticated user. Returns standardized OIDC user claims (sub, email, nickname, picture, locale, etc.) following the OpenID Connect specification. Requires OAuth2 access token with 'openid' scope; additional fields require 'identify' and 'email' scopes.",
    toolSlug: "DISCORD_GET_OPENID_CONNECT_USERINFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "users_and_identity",
    ],
  }),
  composioTool({
    name: "discord_get_public_keys",
    description: "Tool to retrieve Discord OAuth2 public keys. Use when you need to verify OAuth2 tokens or access public keys for cryptographic operations.",
    toolSlug: "DISCORD_GET_PUBLIC_KEYS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "security_and_keys",
    ],
  }),
  composioTool({
    name: "discord_get_sku_subscription",
    description: "Retrieves a specific subscription by ID for a given SKU. Use to check details of a single user subscription.",
    toolSlug: "DISCORD_GET_SKU_SUBSCRIPTION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_get_user",
    description: "Retrieve information about a Discord user. With OAuth Bearer token authentication, this returns the authenticated user's information (use '@me'). With Bot token authentication, you can query any user by their ID. Use this when you need user details like username, avatar, email (if email scope is granted), locale, premium status, or other profile information.",
    toolSlug: "DISCORD_GET_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "users_and_identity",
    ],
  }),
  composioTool({
    name: "discord_get_user_application_role_connection",
    description: "Retrieves the application role connection for the currently authenticated user for a specified application. Requires the role_connections.write OAuth2 scope.",
    toolSlug: "DISCORD_GET_USER_APPLICATION_ROLE_CONNECTION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_invite_resolve",
    description: "Tool to resolve and retrieve information about a Discord invite code. Use when you need to get details about a guild, channel, or event associated with an invite code.",
    toolSlug: "DISCORD_INVITE_RESOLVE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "invites",
    ],
  }),
  composioTool({
    name: "discord_leave_guild",
    description: "Leaves a Discord guild (server) on behalf of the currently authenticated user.",
    toolSlug: "DISCORD_LEAVE_GUILD",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Leave Guild.",
    ],
  }),
  composioTool({
    name: "discord_list_my_connections",
    description: "Retrieves a list of the authenticated user's connected third-party accounts on Discord.",
    toolSlug: "DISCORD_LIST_MY_CONNECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_list_my_guilds",
    description: "Lists the current user's guilds, returning partial data for each; primarily used for displaying server lists or verifying memberships.",
    toolSlug: "DISCORD_LIST_MY_GUILDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_list_sku_subscriptions",
    description: "Lists all subscriptions for a given SKU. When using a Bot token, the user_id query parameter is required. Returns paginated subscription objects.",
    toolSlug: "DISCORD_LIST_SKU_SUBSCRIPTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
    ],
  }),
  composioTool({
    name: "discord_list_sticker_packs",
    description: "Tool to retrieve all available Discord Nitro sticker packs. Use when you need to list or browse official Discord sticker packs.",
    toolSlug: "DISCORD_LIST_STICKER_PACKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "discord",
      "read",
      "stickers",
    ],
  }),
  composioTool({
    name: "discord_modify_current_user",
    description: "Modifies the currently authenticated Discord user's profile. Can update username (limited to 2 changes per hour) and avatar.",
    toolSlug: "DISCORD_MODIFY_CURRENT_USER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Modify Current User.",
    ],
  }),
  composioTool({
    name: "discord_update_user_application_role_connection",
    description: "Updates the application role connection for the currently authenticated user for a specified application. Requires the role_connections.write OAuth2 scope.",
    toolSlug: "DISCORD_UPDATE_USER_APPLICATION_ROLE_CONNECTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "discord",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update User Application Role Connection.",
    ],
  }),
];
