import "server-only";

import {
  getDatabase,
  listIntegrationConnectionsForUserId,
  type IntegrationConnectionRecord,
} from "@/lib/server/integration-store";
import {
  buildToolDescription,
  getToolDefinitionByName,
  hydrateToolSchemas,
  mapConnectionSummary,
  searchToolDefinitions,
  type ToolConnectionSummary,
} from "@/lib/server/tool-registry";
import { evaluateToolPolicy } from "@/lib/server/policy";
import type { IntegrationTool } from "../../../worker/integrations";

export interface RouteToolRequest {
  userId: string;
  toolName?: string;
  integration?: string;
  task?: string;
  args?: Record<string, unknown>;
  preferredConnectionId?: number;
  allowSearch?: boolean;
  confirmed?: boolean;
}

export type RouteDecision =
  | {
      kind: "execute_direct";
      tool: IntegrationTool;
      connectionId: number;
      connection: IntegrationConnectionRecord;
    }
  | { kind: "needs_connection"; integration: string }
  | { kind: "needs_reauth"; connectionId: number; tool: IntegrationTool }
  | { kind: "needs_scope_upgrade"; connectionId: number; tool: IntegrationTool; missingScopes: string[] }
  | { kind: "needs_confirmation"; connectionId: number; tool: IntegrationTool }
  | { kind: "ambiguous_connection"; integration: string; options: ToolConnectionSummary[]; tool: IntegrationTool }
  | { kind: "tool_not_found"; suggestions: string[] };

function selectConnection(
  connections: IntegrationConnectionRecord[],
  preferredConnectionId?: number,
): IntegrationConnectionRecord | null {
  if (preferredConnectionId) {
    return connections.find((connection) => connection.id === preferredConnectionId) ?? null;
  }

  const defaultActive =
    connections.find((connection) => connection.isDefault && connection.authState === "active") ?? null;

  if (defaultActive) {
    return defaultActive;
  }

  const latestHealthy =
    connections.find((connection) => connection.authState === "active") ?? null;

  if (latestHealthy) {
    return latestHealthy;
  }

  return connections.find((connection) => connection.isDefault) ?? connections[0] ?? null;
}

function filterConnectionsForTool(
  tool: IntegrationTool,
  connections: IntegrationConnectionRecord[],
): IntegrationConnectionRecord[] {
  if (tool.execution.kind !== "pipedream_action") {
    if (tool.execution.kind !== "composio_tool") {
      return connections;
    }

    return connections.filter(
      (connection) =>
        connection.authBackend === "composio" &&
        Boolean(connection.composioConnectedAccountId),
    );
  }

  return connections.filter(
    (connection) => connection.authBackend === "pipedream" && Boolean(connection.pipedreamAccountId),
  );
}

function findMissingScopes(
  tool: IntegrationTool,
  connection: IntegrationConnectionRecord,
): string[] {
  if (!tool.requiresScopes.length || !connection.scopeSnapshot?.length) {
    return [];
  }

  const available = new Set(connection.scopeSnapshot.map((scope) => scope.toLowerCase()));

  return tool.requiresScopes.filter((scope) => !available.has(scope.toLowerCase()));
}

export async function routeToolRequest(request: RouteToolRequest): Promise<RouteDecision> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  let tool =
    (request.toolName ? getToolDefinitionByName(request.toolName) : null) ??
    null;

  if (!tool && request.allowSearch) {
    const query = request.task ?? request.toolName ?? "";
    const matches = searchToolDefinitions(query, {
      integration: request.integration,
      limit: 5,
    });

    if (matches.length === 1) {
      tool = matches[0];
    } else {
      return {
        kind: "tool_not_found",
        suggestions: matches.map((match) => match.name),
      };
    }
  }

  if (!tool) {
    const suggestions = request.toolName
      ? searchToolDefinitions(request.toolName, {
          integration: request.integration,
          limit: 5,
        }).map((match) => match.name)
      : [];

    return {
      kind: "tool_not_found",
      suggestions,
    };
  }

  const connections = (await listIntegrationConnectionsForUserId(db, request.userId)).filter(
    (connection) => connection.integration === tool.integration,
  );

  if (connections.length === 0) {
    return {
      kind: "needs_connection",
      integration: tool.integration,
    };
  }

  const compatibleConnections = filterConnectionsForTool(tool, connections);

  if (compatibleConnections.length === 0) {
    return {
      kind: "needs_connection",
      integration: tool.integration,
    };
  }

  const selected = selectConnection(compatibleConnections, request.preferredConnectionId);

  if (!selected) {
    return {
      kind: "ambiguous_connection",
      integration: tool.integration,
      options: compatibleConnections.map(mapConnectionSummary),
      tool,
    };
  }

  if (!request.preferredConnectionId) {
    const activeWithoutDefault = compatibleConnections.filter(
      (connection) => connection.authState === "active",
    );
    const hasDefault = compatibleConnections.some((connection) => connection.isDefault);

    if (activeWithoutDefault.length > 1 && !hasDefault) {
      return {
        kind: "ambiguous_connection",
        integration: tool.integration,
        options: activeWithoutDefault.map(mapConnectionSummary),
        tool,
      };
    }
  }

  if (selected.authState !== "active") {
    return {
      kind: "needs_reauth",
      connectionId: selected.id,
      tool,
    };
  }

  const missingScopes = findMissingScopes(tool, selected);

  if (missingScopes.length > 0) {
    return {
      kind: "needs_scope_upgrade",
      connectionId: selected.id,
      tool,
      missingScopes,
    };
  }

  const policy = evaluateToolPolicy({
    tool,
    confirmed: request.confirmed,
  });

  if (!policy.allow && policy.requiresConfirmation) {
    return {
      kind: "needs_confirmation",
      connectionId: selected.id,
      tool,
    };
  }

  return {
    kind: "execute_direct",
    tool,
    connectionId: selected.id,
    connection: selected,
  };
}

export async function describeRoutedTool(
  userId: string,
  tool: IntegrationTool,
): Promise<ReturnType<typeof buildToolDescription>> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const connections = (await listIntegrationConnectionsForUserId(db, userId)).filter(
    (connection) => connection.integration === tool.integration,
  );
  await hydrateToolSchemas([tool]);

  return buildToolDescription(tool, filterConnectionsForTool(tool, connections));
}
