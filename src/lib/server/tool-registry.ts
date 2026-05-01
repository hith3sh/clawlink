import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import {
  getDatabase,
  listIntegrationConnectionsForUserId,
  type IntegrationConnectionRecord,
} from "@/lib/server/integration-store";
import {
  getAllRegisteredTools,
  listComposioToolsForIntegration,
  listHandlerToolsForIntegration,
  listPipedreamToolsForIntegration,
  type IntegrationTool,
  type IntegrationToolExample,
  type ToolAccessLevel,
} from "../../../worker/integrations";
import { summarizeToolPolicy } from "@/lib/server/policy";
import type { ToolMode, ToolRisk } from "@/lib/runtime/tool-runtime";

export interface ToolConnectionSummary {
  id: number;
  connectionLabel: string | null;
  accountLabel: string | null;
  isDefault: boolean;
  authState: IntegrationConnectionRecord["authState"];
  authError: string | null;
  expiresAt: string | null;
  lastUsedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  scopeSnapshot: string[] | null;
  capabilities: string[] | null;
}

export interface ToolCatalogItem {
  integration: string;
  integrationName: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  mode: ToolMode;
  risk: ToolRisk;
  tags: string[];
  guidanceAvailable: boolean;
  requiresConfirmation: boolean;
  policyReason?: string;
  previewAvailable: boolean;
  defaultConnectionId: number | null;
  connectionCount: number;
  connections: ToolConnectionSummary[];
  requiresScopes: string[];
  idempotent: boolean;
  supportsDryRun: boolean;
  supportsBatch: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
}

export interface ToolDescription extends ToolCatalogItem {
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: IntegrationToolExample[];
  followups: string[];
}

export interface ToolRegistryEntry {
  tool: IntegrationTool;
  connections: IntegrationConnectionRecord[];
}

export function mapConnectionSummary(connection: IntegrationConnectionRecord): ToolConnectionSummary {
  return {
    id: connection.id,
    connectionLabel: connection.connectionLabel,
    accountLabel: connection.accountLabel,
    isDefault: connection.isDefault,
    authState: connection.authState,
    authError: connection.authError,
    expiresAt: connection.expiresAt,
    lastUsedAt: connection.lastUsedAt,
    lastSuccessAt: connection.lastSuccessAt,
    lastErrorAt: connection.lastErrorAt,
    lastErrorCode: connection.lastErrorCode,
    lastErrorMessage: connection.lastErrorMessage,
    scopeSnapshot: connection.scopeSnapshot,
    capabilities: connection.capabilities,
  };
}

function hasGuidance(tool: IntegrationTool): boolean {
  return (
    tool.whenToUse.length > 0 ||
    tool.askBefore.length > 0 ||
    tool.examples.length > 0 ||
    tool.followups.length > 0 ||
    Object.keys(tool.safeDefaults).length > 0
  );
}

function isPipedreamBackedConnection(connection: IntegrationConnectionRecord): boolean {
  return connection.authBackend === "pipedream" && Boolean(connection.pipedreamAccountId);
}

function isComposioBackedConnection(connection: IntegrationConnectionRecord): boolean {
  return connection.authBackend === "composio" && Boolean(connection.composioConnectedAccountId);
}

export function buildCatalogItem(
  tool: IntegrationTool,
  connections: IntegrationConnectionRecord[],
): ToolCatalogItem {
  const integrationMeta = getIntegrationBySlug(tool.integration);
  const policy = summarizeToolPolicy(tool);

  return {
    integration: tool.integration,
    integrationName: integrationMeta?.name ?? tool.integration,
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    outputSchema: tool.outputSchema,
    accessLevel: tool.accessLevel,
    mode: tool.mode,
    risk: tool.risk,
    tags: tool.tags,
    guidanceAvailable: hasGuidance(tool),
    requiresConfirmation: policy.requiresConfirmation,
    policyReason: policy.reason,
    previewAvailable: policy.previewAvailable,
    defaultConnectionId: connections.find((connection) => connection.isDefault)?.id ?? null,
    connectionCount: connections.length,
    connections: connections.map(mapConnectionSummary),
    requiresScopes: tool.requiresScopes,
    idempotent: tool.idempotent,
    supportsDryRun: tool.supportsDryRun,
    supportsBatch: tool.supportsBatch,
    maxBatchSize: tool.maxBatchSize,
    recommendedTimeoutMs: tool.recommendedTimeoutMs,
  };
}

export function buildToolDescription(
  tool: IntegrationTool,
  connections: IntegrationConnectionRecord[],
): ToolDescription {
  return {
    ...buildCatalogItem(tool, connections),
    whenToUse: tool.whenToUse,
    askBefore: tool.askBefore,
    safeDefaults: tool.safeDefaults,
    examples: tool.examples,
    followups: tool.followups,
  };
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

function getAllRegisteredToolEntries(): ToolRegistryEntry[] {
  return getAllRegisteredTools()
    .map((tool) => ({ tool, connections: [] }))
    .sort((left, right) => left.tool.name.localeCompare(right.tool.name));
}

function scoreTool(tool: IntegrationTool, query: string, integration?: string): number {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const searchable = [
    tool.name,
    tool.integration,
    tool.description,
    ...tool.tags,
    ...tool.whenToUse,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  if (tool.name.toLowerCase() === normalizedQuery) {
    score += 100;
  } else if (tool.name.toLowerCase().includes(normalizedQuery)) {
    score += 60;
  }

  if (searchable.includes(normalizedQuery)) {
    score += 20;
  }

  if (integration && tool.integration === integration) {
    score += 15;
  }

  for (const token of normalizedQuery.split(/\s+/)) {
    if (token.length < 2) {
      continue;
    }

    if (tool.name.toLowerCase().includes(token)) {
      score += 8;
    }

    if (tool.tags.some((tag) => tag.toLowerCase().includes(token))) {
      score += 4;
    }

    if (tool.description.toLowerCase().includes(token)) {
      score += 2;
    }
  }

  return score;
}

export function listAllRegisteredTools(): IntegrationTool[] {
  return getAllRegisteredToolEntries().map((entry) => entry.tool);
}

export function listToolDefinitionsForIntegration(
  integration: string,
  options: {
    includePipedreamManifestTools?: boolean;
    includeComposioManifestTools?: boolean;
  } = {},
): IntegrationTool[] {
  const handlerTools = listHandlerToolsForIntegration(integration);

  if (!options.includePipedreamManifestTools && !options.includeComposioManifestTools) {
    return handlerTools;
  }

  const manifestTools = [
    ...(options.includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
    ...(options.includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
  ];
  const tools = new Map<string, IntegrationTool>();

  for (const tool of handlerTools) {
    tools.set(tool.name, tool);
  }

  for (const tool of manifestTools) {
    if (!tools.has(tool.name)) {
      tools.set(tool.name, tool);
    }
  }

  return Array.from(tools.values()).sort((left, right) => left.name.localeCompare(right.name));
}

export function getToolDefinitionByName(toolName: string): IntegrationTool | null {
  const normalized = normalizeSearchText(toolName);

  if (!normalized) {
    return null;
  }

  for (const { tool } of getAllRegisteredToolEntries()) {
    if (tool.name.toLowerCase() === normalized) {
      return tool;
    }
  }

  return null;
}

export function searchToolDefinitions(
  query: string,
  options: { integration?: string; limit?: number } = {},
): IntegrationTool[] {
  const limit = options.limit ?? 5;

  return getAllRegisteredToolEntries()
    .map(({ tool }) => ({
      tool,
      score: scoreTool(tool, query, options.integration),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
    .slice(0, limit)
    .map((entry) => entry.tool);
}

export async function listConnectedToolEntries(userId: string): Promise<ToolRegistryEntry[]> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const connections = await listIntegrationConnectionsForUserId(db, userId);
  const connectionsByIntegration = new Map<string, IntegrationConnectionRecord[]>();

  for (const connection of connections) {
    const existing = connectionsByIntegration.get(connection.integration) ?? [];
    existing.push(connection);
    connectionsByIntegration.set(connection.integration, existing);
  }

  const entries: ToolRegistryEntry[] = [];

  for (const [integration, integrationConnections] of connectionsByIntegration.entries()) {
    const handlerTools = listHandlerToolsForIntegration(integration);

    for (const tool of handlerTools) {
      entries.push({ tool, connections: integrationConnections });
    }

    const handlerToolNames = new Set(handlerTools.map((tool) => tool.name));

    const pipedreamConnections = integrationConnections.filter(isPipedreamBackedConnection);

    for (const tool of listPipedreamToolsForIntegration(integration)) {
      if (handlerToolNames.has(tool.name)) {
        continue;
      }

      if (pipedreamConnections.length > 0) {
        entries.push({ tool, connections: pipedreamConnections });
      }
    }

    const composioConnections = integrationConnections.filter(isComposioBackedConnection);

    for (const tool of listComposioToolsForIntegration(integration)) {
      if (handlerToolNames.has(tool.name)) {
        continue;
      }

      if (composioConnections.length > 0) {
        entries.push({ tool, connections: composioConnections });
      }
    }
  }

  return entries.sort((left, right) => left.tool.name.localeCompare(right.tool.name));
}

export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {
  const entries = await listConnectedToolEntries(userId);
  return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));
}

export async function describeToolForUser(
  userId: string,
  toolName: string,
): Promise<ToolDescription | null> {
  const entries = await listConnectedToolEntries(userId);
  const match = entries.find(({ tool }) => tool.name === toolName);

  if (!match) {
    return null;
  }

  return buildToolDescription(match.tool, match.connections);
}

export async function listToolDescriptionsForIntegration(
  userId: string,
  integration: string,
): Promise<ToolDescription[]> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const connections = (await listIntegrationConnectionsForUserId(db, userId)).filter(
    (connection) => connection.integration === integration,
  );
  const includePipedreamManifestTools = connections.some(isPipedreamBackedConnection);
  const includeComposioManifestTools = connections.some(isComposioBackedConnection);
  const pipedreamConnections = connections.filter(isPipedreamBackedConnection);
  const composioConnections = connections.filter(isComposioBackedConnection);

  const definitions = [
    ...listHandlerToolsForIntegration(integration),
    ...(includePipedreamManifestTools ? listPipedreamToolsForIntegration(integration) : []),
    ...(includeComposioManifestTools ? listComposioToolsForIntegration(integration) : []),
  ];

  const uniqueDefinitions = new Map<string, IntegrationTool>();
  for (const tool of definitions) {
    if (!uniqueDefinitions.has(tool.name)) {
      uniqueDefinitions.set(tool.name, tool);
    }
  }

  return Array.from(uniqueDefinitions.values())
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((tool) =>
      buildToolDescription(
        tool,
        tool.execution.kind === "pipedream_action"
          ? pipedreamConnections
          : tool.execution.kind === "composio_tool"
            ? composioConnections
            : connections,
      ),
    );
}
