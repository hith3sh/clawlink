import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import {
  createConnectionSession,
  getConnectionSessionById,
  getLatestActiveConnectionSessionForUser,
} from "@/lib/server/connection-sessions";
import { toCanonicalActionSummary, toCanonicalExecutionSummary } from "@/lib/clawlink-spec/compat";
import {
  executeToolForUser,
} from "@/lib/server/executor";
import {
  getDatabase,
  getIntegrationConnectionForUserId,
  listIntegrationConnectionsForUserId,
  type D1LikeDatabase,
  type IntegrationConnectionRecord,
  type UserRow,
} from "@/lib/server/integration-store";
import {
  describeToolForUser,
  listToolDescriptionsForIntegration,
  listToolsForUser,
  searchToolsForUser,
  type ToolDescription,
  type ToolListItem,
} from "@/lib/server/tool-registry";
import type {
  ClawLinkActionSummary,
  ClawLinkConnectionState,
  ClawLinkConnectionSummary,
  ClawLinkExecutionSummary,
  ClawLinkGetActionInput,
  ClawLinkGetConnectionInput,
  ClawLinkGetExecutionInput,
  ClawLinkGetIntegrationInput,
  ClawLinkIntegrationSummary,
  ClawLinkListActionsInput,
  ClawLinkListIntegrationsInput,
  ClawLinkSearchInput,
  ClawLinkWhoAmIResponse,
} from "@/lib/clawlink-spec/mcp-types";

interface CanonicalPagedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

interface CanonicalSearchItem {
  kind: "integration" | "action";
  integration_id: string;
  action_id?: string;
  title: string;
  summary: string;
  score?: number;
  connected: boolean;
  connection_state: ClawLinkConnectionState;
}

interface CanonicalIntegrationDetail extends ClawLinkIntegrationSummary {
  description: string;
  auth: {
    required: boolean;
    type: "oauth2" | "api_key" | "managed" | "unknown";
  };
  connection: {
    supported: boolean;
    state: ClawLinkConnectionState;
  };
  actions: Pick<ClawLinkActionSummary, "action_id" | "title" | "side_effect_level">[];
  limits: {
    rate_limited: boolean;
  };
}

interface CanonicalActionDetail extends ClawLinkActionSummary {
  integration_id: string;
  examples: Array<{ input: unknown }>;
  preconditions: string[];
}

interface CanonicalBeginConnectionResult {
  integration_id: string;
  status: "requires_user_action" | "already_connected";
  connection_session_id: string | null;
  connect_url?: string;
  expires_at?: string;
  instructions?: string[];
  connection?: {
    id: number;
    isDefault: boolean;
    authState: string;
    connectionLabel: string | null;
    accountLabel: string | null;
    expiresAt: string | null;
  };
}

function clampPage(value?: number): number {
  if (!value || !Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function clampPageSize(value?: number, fallback = 25, max = 100): number {
  if (!value || !Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.min(Math.floor(value), max);
}

function paginateItems<T>(items: T[], page?: number, pageSize?: number): CanonicalPagedResponse<T> {
  const normalizedPage = clampPage(page);
  const normalizedPageSize = clampPageSize(pageSize);
  const start = (normalizedPage - 1) * normalizedPageSize;

  return {
    items: items.slice(start, start + normalizedPageSize),
    page: normalizedPage,
    page_size: normalizedPageSize,
    total: items.length,
  };
}

function toConnectionState(connection: IntegrationConnectionRecord | null | undefined): ClawLinkConnectionState {
  if (!connection) {
    return "not_connected";
  }

  switch (connection.authState) {
    case "active":
      return "healthy";
    case "needs_reauth":
      return "stale_auth";
    default:
      return "degraded";
  }
}


function toIntegrationSummary(
  integrationSlug: string,
  connections: IntegrationConnectionRecord[],
  actions: ToolListItem[],
): ClawLinkIntegrationSummary {
  const meta = getIntegrationBySlug(integrationSlug);
  const defaultConnection = connections.find((connection) => connection.isDefault) ?? connections[0] ?? null;

  return {
    integration_id: integrationSlug,
    name: meta?.name ?? integrationSlug,
    slug: integrationSlug,
    category: meta?.category,
    summary: meta?.description,
    connected: connections.length > 0,
    connection_state: toConnectionState(defaultConnection),
    capabilities: actions.map((action) =>
      action.name.startsWith(`${integrationSlug}_`) ? action.name.slice(integrationSlug.length + 1) : action.name,
    ),
  };
}

export async function getCanonicalWhoAmI(user: UserRow): Promise<ClawLinkWhoAmIResponse> {
  return {
    user_id: user.id,
    workspace_id: user.id,
    workspace_name: user.email ?? user.id,
    environment: process.env.ENV ?? process.env.NODE_ENV ?? "development",
    region: "global",
    capabilities: {
      can_execute: true,
      can_begin_connection: true,
    },
  };
}

export async function listCanonicalIntegrations(
  user: UserRow,
  input: ClawLinkListIntegrationsInput,
): Promise<CanonicalPagedResponse<ClawLinkIntegrationSummary>> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const [connections, tools] = await Promise.all([
    listIntegrationConnectionsForUserId(db, user.id),
    listToolsForUser(user.id),
  ]);

  const query = input.query?.trim().toLowerCase();
  const category = input.category?.trim().toLowerCase();
  const supportsAction = input.supports_action?.trim().toLowerCase();
  const connectedOnly = input.connected_only === true;

  const connectionMap = new Map<string, IntegrationConnectionRecord[]>();
  for (const connection of connections) {
    const existing = connectionMap.get(connection.integration) ?? [];
    existing.push(connection);
    connectionMap.set(connection.integration, existing);
  }

  const toolMap = new Map<string, ToolListItem[]>();
  for (const tool of tools) {
    const existing = toolMap.get(tool.integration) ?? [];
    existing.push(tool);
    toolMap.set(tool.integration, existing);
  }

  const integrationSlugs = new Set<string>([
    ...connectionMap.keys(),
    ...toolMap.keys(),
  ]);

  const items = Array.from(integrationSlugs)
    .map((slug) => toIntegrationSummary(slug, connectionMap.get(slug) ?? [], toolMap.get(slug) ?? []))
    .filter((item) => {
      if (connectedOnly && !item.connected) {
        return false;
      }

      if (category) {
        const itemCategory = item.category?.toLowerCase() ?? "";
        if (itemCategory !== category) {
          return false;
        }
      }

      if (supportsAction && !item.capabilities.some((capability) => capability.toLowerCase() === supportsAction)) {
        return false;
      }

      if (query) {
        const haystack = [item.integration_id, item.name, item.summary ?? "", item.category ?? ""].join(" ").toLowerCase();
        return haystack.includes(query);
      }

      return true;
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  return paginateItems(items, input.page, input.page_size);
}

export async function getCanonicalIntegration(
  user: UserRow,
  input: ClawLinkGetIntegrationInput,
): Promise<CanonicalIntegrationDetail | null> {
  const integration = getIntegrationBySlug(input.integration_id);

  if (!integration) {
    return null;
  }

  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const [connections, actions] = await Promise.all([
    listIntegrationConnectionsForUserId(db, user.id).then((rows) => rows.filter((row) => row.integration === integration.slug)),
    listToolDescriptionsForIntegration(user.id, integration.slug),
  ]);

  const defaultConnection = connections.find((connection) => connection.isDefault) ?? connections[0] ?? null;

  return {
    ...toIntegrationSummary(integration.slug, connections, actions),
    description: integration.description,
    auth: {
      required: true,
      type:
        integration.setupMode === "composio"
          ? "managed"
          : integration.setupMode === "oauth"
            ? "oauth2"
            : integration.credentialFields.length > 0
              ? "api_key"
              : "unknown",
    },
    connection: {
      supported: integration.dashboardStatus === "available",
      state: toConnectionState(defaultConnection),
    },
    actions: actions.map((action) => {
      const summary = toCanonicalActionSummary(action);
      return {
        action_id: summary.action_id,
        title: summary.title,
        side_effect_level: summary.side_effect_level,
      };
    }),
    limits: {
      rate_limited: true,
    },
  };
}

export async function listCanonicalActions(
  user: UserRow,
  input: ClawLinkListActionsInput,
): Promise<{ integration_id: string; items: ClawLinkActionSummary[] } | null> {
  const integration = getIntegrationBySlug(input.integration_id);

  if (!integration) {
    return null;
  }

  const tools = input.intent?.trim()
    ? await searchToolsForUser(user.id, input.intent, { integration: integration.slug, limit: 50 })
    : await listToolsForUser(user.id, { integration: integration.slug });

  return {
    integration_id: integration.slug,
    items: tools.map(toCanonicalActionSummary),
  };
}

export async function getCanonicalAction(
  user: UserRow,
  input: ClawLinkGetActionInput,
): Promise<CanonicalActionDetail | null> {
  const toolName = `${input.integration_id}_${input.action_id}`;
  const tool =
    (await describeToolForUser(user.id, toolName)) ??
    (await describeToolForUser(user.id, input.action_id));

  if (!tool || tool.integration !== input.integration_id) {
    return null;
  }

  const summary = toCanonicalActionSummary(tool);

  return {
    ...summary,
    integration_id: input.integration_id,
    examples: (tool.examples ?? []).map((example) => ({ input: example.args })),
    preconditions: tool.prerequisites ?? [],
  };
}

export async function getCanonicalConnection(
  user: UserRow,
  input: ClawLinkGetConnectionInput,
): Promise<ClawLinkConnectionSummary | null> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const connection = await getIntegrationConnectionForUserId(db, user.id, input.integration_id);

  if (!connection) {
    return {
      integration_id: input.integration_id,
      connected: false,
      state: "not_connected",
      account_label: null,
      last_checked_at: new Date().toISOString(),
      can_execute: false,
      needs_reauth: false,
      health_reason: null,
    };
  }

  return {
    integration_id: input.integration_id,
    connected: true,
    state: toConnectionState(connection),
    account_label: connection.accountLabel,
    last_checked_at: new Date().toISOString(),
    can_execute: connection.authState === "active",
    needs_reauth: connection.authState === "needs_reauth",
    health_reason: connection.authError,
  };
}

export async function beginCanonicalConnection(
  user: UserRow,
  input: { integration_id: string; redirect_url?: string; channel?: string; origin: string; reuse_if_connected?: boolean },
): Promise<CanonicalBeginConnectionResult | null> {
  const integration = getIntegrationBySlug(input.integration_id);

  if (!integration) {
    return null;
  }

  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const existingSession = await getLatestActiveConnectionSessionForUser(user, integration.slug);
  const defaultConnection = existingSession?.connection ?? (await getIntegrationConnectionForUserId(db, user.id, integration.slug));

  if (input.reuse_if_connected && defaultConnection && defaultConnection.authState === "active") {
    return {
      integration_id: integration.slug,
      status: "already_connected",
      connection_session_id: null,
      connection: {
        id: defaultConnection.id,
        isDefault: defaultConnection.isDefault,
        authState: defaultConnection.authState,
        connectionLabel: defaultConnection.connectionLabel,
        accountLabel: defaultConnection.accountLabel,
        expiresAt: defaultConnection.expiresAt,
      },
    };
  }

  const session = existingSession ?? (await createConnectionSession(user, integration.slug));

  return {
    integration_id: integration.slug,
    status: "requires_user_action",
    connection_session_id: session.id,
    connect_url: `${input.origin}/connect/${integration.slug}?session=${encodeURIComponent(session.token)}`,
    expires_at: session.expiresAt,
    instructions: [
      `Open the hosted ${integration.name} connection page`,
      `Authorize ${integration.name}`,
      "Return to the agent after the connection completes",
    ],
  };
}


export async function createCanonicalExecution(
  user: UserRow,
  input: {
    integration_id: string;
    action_id: string;
    input: Record<string, unknown>;
    idempotency_key?: string;
    confirm?: boolean;
  },
): Promise<ClawLinkExecutionSummary> {
  const toolName = `${input.integration_id}_${input.action_id}`;
  const payload = await executeToolForUser({
    userId: user.id,
    toolName,
    args: input.input,
    confirmed: input.confirm === true,
  });

  return toCanonicalExecutionSummary(payload);
}

async function loadExecutionRow(db: D1LikeDatabase, userId: string, executionId: string) {
  return db
    .prepare(
      `SELECT id, integration, tool_name, status, error_code, response_json, created_at
       FROM tool_executions
       WHERE user_id = ? AND id = ?
       LIMIT 1`,
    )
    .bind(userId, executionId)
    .first<{
      id: string;
      integration: string;
      tool_name: string;
      status: "success" | "error";
      error_code: string | null;
      response_json: string | null;
      created_at: string;
    }>();
}

function safeJsonParse(value: string | null): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function getCanonicalExecution(
  user: UserRow,
  input: ClawLinkGetExecutionInput,
): Promise<ClawLinkExecutionSummary | null> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const row = await loadExecutionRow(db, user.id, input.execution_id);
  if (!row) {
    return null;
  }

  return {
    execution_id: row.id,
    status: row.status === "success" ? "succeeded" : "failed",
    integration_id: row.integration,
    action_id: row.tool_name.startsWith(`${row.integration}_`)
      ? row.tool_name.slice(row.integration.length + 1)
      : row.tool_name,
    started_at: row.created_at,
    finished_at: row.created_at,
    output: safeJsonParse(row.response_json),
    display: {
      title: row.status === "success" ? "Execution complete" : "Execution failed",
      summary:
        row.status === "success"
          ? `Execution ${row.id} finished successfully.`
          : `Execution ${row.id} failed${row.error_code ? ` with ${row.error_code}` : ""}.`,
    },
    error_code: row.error_code as ClawLinkExecutionSummary["error_code"],
  };
}

export async function searchCanonicalCatalog(
  user: UserRow,
  input: ClawLinkSearchInput,
): Promise<{ items: CanonicalSearchItem[] }> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const [toolMatches, connections] = await Promise.all([
    searchToolsForUser(user.id, input.query, { limit: input.limit ?? 10 }),
    listIntegrationConnectionsForUserId(db, user.id),
  ]);

  const connectionMap = new Map<string, IntegrationConnectionRecord[]>();
  for (const connection of connections) {
    const existing = connectionMap.get(connection.integration) ?? [];
    existing.push(connection);
    connectionMap.set(connection.integration, existing);
  }

  const items = toolMatches
    .map<CanonicalSearchItem | null>((tool) => {
      const integrationConnections = connectionMap.get(tool.integration) ?? [];
      const defaultConnection = integrationConnections.find((connection) => connection.isDefault) ?? integrationConnections[0] ?? null;
      const connected = integrationConnections.length > 0;

      if (input.connected_only && !connected) {
        return null;
      }

      return {
        kind: "action",
        integration_id: tool.integration,
        action_id: tool.name.startsWith(`${tool.integration}_`)
          ? tool.name.slice(tool.integration.length + 1)
          : tool.name,
        title: tool.name,
        summary: tool.description,
        connected,
        connection_state: toConnectionState(defaultConnection),
      };
    })
    .filter((item): item is CanonicalSearchItem => item !== null);

  return { items };
}

export async function getCanonicalConnectionSession(
  sessionId: string,
): Promise<Awaited<ReturnType<typeof getConnectionSessionById>>> {
  return getConnectionSessionById(sessionId);
}
