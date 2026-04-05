import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import {
  getDatabase,
  getEnvBinding,
  listIntegrationConnectionsForUserId,
  type IntegrationConnectionRecord,
} from "@/lib/server/integration-store";
import {
  getAllHandlers,
  type IntegrationTool,
  type IntegrationToolExample,
  type ToolAccessLevel,
} from "../../../worker/integrations";
import {
  loadCredentialsForIntegration,
  type CredentialBridgeEnv,
} from "../../../worker/credentials";

interface ToolSchema {
  type?: string;
  properties?: Record<string, ToolSchema>;
  required?: string[];
  items?: ToolSchema;
  enum?: unknown[];
}

export interface ToolConnectionSummary {
  id: number;
  connectionLabel: string | null;
  accountLabel: string | null;
  isDefault: boolean;
  expiresAt: string | null;
}

export interface ToolCatalogItem {
  integration: string;
  integrationName: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  tags: string[];
  guidanceAvailable: boolean;
  defaultConnectionId: number | null;
  connectionCount: number;
  connections: ToolConnectionSummary[];
}

export interface ToolDescription extends ToolCatalogItem {
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: IntegrationToolExample[];
  followups: string[];
}

export interface ToolExecutionPayload {
  tool: ToolDescription;
  connectionId: number | null;
  args: Record<string, unknown>;
  result: unknown;
}

export class ToolInputValidationError extends Error {
  readonly details: string[];

  constructor(details: string[]) {
    super(details[0] ?? "Invalid tool arguments");
    this.name = "ToolInputValidationError";
    this.details = details;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapConnectionSummary(connection: IntegrationConnectionRecord): ToolConnectionSummary {
  return {
    id: connection.id,
    connectionLabel: connection.connectionLabel,
    accountLabel: connection.accountLabel,
    isDefault: connection.isDefault,
    expiresAt: connection.expiresAt,
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

function buildCatalogItem(
  tool: IntegrationTool,
  connections: IntegrationConnectionRecord[],
): ToolCatalogItem {
  const integrationMeta = getIntegrationBySlug(tool.integration);

  return {
    integration: tool.integration,
    integrationName: integrationMeta?.name ?? tool.integration,
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    accessLevel: tool.accessLevel,
    tags: tool.tags,
    guidanceAvailable: hasGuidance(tool),
    defaultConnectionId: connections.find((connection) => connection.isDefault)?.id ?? null,
    connectionCount: connections.length,
    connections: connections.map(mapConnectionSummary),
  };
}

function buildToolDescription(
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

function getCredentialBridgeEnv(): CredentialBridgeEnv | null {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  return {
    DB: db,
    CREDENTIALS: getEnvBinding("CREDENTIALS") as CredentialBridgeEnv["CREDENTIALS"],
    CREDENTIAL_ENCRYPTION_KEY: getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY"),
    OUTLOOK_CLIENT_ID: getEnvBinding<string>("OUTLOOK_CLIENT_ID"),
    OUTLOOK_CLIENT_SECRET: getEnvBinding<string>("OUTLOOK_CLIENT_SECRET"),
  };
}

function mergeWithDefaults(
  defaults: Record<string, unknown>,
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...defaults };

  for (const [key, value] of Object.entries(input)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeWithDefaults(
        result[key] as Record<string, unknown>,
        value,
      );
      continue;
    }

    result[key] = value;
  }

  return result;
}

function validateValue(
  value: unknown,
  schema: ToolSchema | undefined,
  path: string,
  errors: string[],
): void {
  if (!schema) {
    return;
  }

  if (schema.enum && !schema.enum.some((option) => option === value)) {
    errors.push(`${path} must be one of: ${schema.enum.join(", ")}`);
    return;
  }

  switch (schema.type) {
    case "string":
      if (typeof value !== "string") {
        errors.push(`${path} must be a string`);
      }
      return;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        errors.push(`${path} must be a finite number`);
      }
      return;
    case "boolean":
      if (typeof value !== "boolean") {
        errors.push(`${path} must be a boolean`);
      }
      return;
    case "array":
      if (!Array.isArray(value)) {
        errors.push(`${path} must be an array`);
        return;
      }

      value.forEach((item, index) => validateValue(item, schema.items, `${path}[${index}]`, errors));
      return;
    case "object": {
      if (!isPlainObject(value)) {
        errors.push(`${path} must be an object`);
        return;
      }

      const properties = schema.properties ?? {};
      const required = schema.required ?? [];

      for (const requiredKey of required) {
        if (value[requiredKey] === undefined) {
          errors.push(`${path}.${requiredKey} is required`);
        }
      }

      for (const [property, propertySchema] of Object.entries(properties)) {
        if (value[property] !== undefined) {
          validateValue(value[property], propertySchema, `${path}.${property}`, errors);
        }
      }

      return;
    }
    default:
      return;
  }
}

function validateToolArguments(
  schema: Record<string, unknown>,
  args: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  validateValue(args, schema as ToolSchema, "arguments", errors);
  return errors;
}

async function listConnectedTools(
  userId: string,
): Promise<Array<{ tool: IntegrationTool; connections: IntegrationConnectionRecord[] }>> {
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

  const entries: Array<{ tool: IntegrationTool; connections: IntegrationConnectionRecord[] }> = [];

  for (const [integration, integrationConnections] of connectionsByIntegration.entries()) {
    const handler = getAllHandlers().get(integration);

    if (!handler?.getTools) {
      continue;
    }

    for (const tool of handler.getTools(integration)) {
      entries.push({ tool, connections: integrationConnections });
    }
  }

  return entries.sort((left, right) => left.tool.name.localeCompare(right.tool.name));
}

export async function listToolsForUser(userId: string): Promise<ToolCatalogItem[]> {
  const entries = await listConnectedTools(userId);
  return entries.map(({ tool, connections }) => buildCatalogItem(tool, connections));
}

export async function describeToolForUser(
  userId: string,
  toolName: string,
): Promise<ToolDescription | null> {
  const entries = await listConnectedTools(userId);
  const match = entries.find(({ tool }) => tool.name === toolName);

  if (!match) {
    return null;
  }

  return buildToolDescription(match.tool, match.connections);
}

export async function executeToolForUser(
  userId: string,
  toolName: string,
  args: Record<string, unknown>,
  connectionId?: number,
): Promise<ToolExecutionPayload> {
  const entries = await listConnectedTools(userId);
  const match = entries.find(({ tool }) => tool.name === toolName);

  if (!match) {
    throw new Error("Tool not found");
  }

  const withDefaults = mergeWithDefaults(match.tool.safeDefaults, args);
  const validationErrors = validateToolArguments(match.tool.inputSchema, withDefaults);

  if (validationErrors.length > 0) {
    throw new ToolInputValidationError(validationErrors);
  }

  const env = getCredentialBridgeEnv();

  if (!env) {
    throw new Error("DB binding is not configured");
  }

  const selectedConnectionId =
    connectionId ??
    match.connections.find((connection) => connection.isDefault)?.id ??
    match.connections[0]?.id ??
    null;

  const credentials = await loadCredentialsForIntegration(env, userId, match.tool.integration, {
    connectionId: selectedConnectionId ?? undefined,
  });

  const handler = getAllHandlers().get(match.tool.integration);

  if (!handler) {
    throw new Error(`No handler registered for ${match.tool.integration}`);
  }

  const action = match.tool.name.startsWith(`${match.tool.integration}_`)
    ? match.tool.name.slice(match.tool.integration.length + 1)
    : match.tool.name;

  const result = await handler.execute(action, withDefaults, credentials);

  return {
    tool: buildToolDescription(match.tool, match.connections),
    connectionId: selectedConnectionId,
    args: withDefaults,
    result,
  };
}
