import "server-only";

import {
  beginCanonicalConnection,
  createCanonicalExecution,
  getCanonicalAction,
  getCanonicalConnection,
  getCanonicalExecution,
  getCanonicalIntegration,
  getCanonicalWhoAmI,
  listCanonicalActions,
  listCanonicalIntegrations,
  searchCanonicalCatalog,
} from "@/lib/clawlink-spec/api";
import {
  CLAWLINK_MCP_V1_TOOLS,
} from "@/lib/clawlink-spec/mcp-types";
import type {
  ClawLinkBeginConnectionInput,
  ClawLinkExecuteInput,
  ClawLinkGetActionInput,
  ClawLinkGetConnectionInput,
  ClawLinkGetExecutionInput,
  ClawLinkGetIntegrationInput,
  ClawLinkListActionsInput,
  ClawLinkListIntegrationsInput,
  ClawLinkMcpToolDefinition,
  ClawLinkSearchInput,
  ClawLinkWhoAmIResponse,
} from "@/lib/clawlink-spec/mcp-types";
import type { UserRow } from "@/lib/server/integration-store";

const JSON_RPC_VERSION = "2.0";
const MCP_PROTOCOL_VERSION = "2025-03-26";
const MCP_SERVER_NAME = "clawlink";
const MCP_SERVER_VERSION = "0.1.0";

type JsonObject = Record<string, unknown>;

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
}

interface McpToolListResponse {
  tools: Array<{
    name: ClawLinkMcpToolDefinition["name"];
    title: string;
    description: string;
    inputSchema: JsonObject;
  }>;
}

interface McpCallToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  structuredContent?: unknown;
  isError?: boolean;
}

class McpProtocolError extends Error {
  readonly code: number;
  readonly data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = "McpProtocolError";
    this.code = code;
    this.data = data;
  }
}

function asObject(value: unknown): JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function stringifyContent(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function success(id: JsonRpcId, result: unknown) {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    result,
  };
}

function failure(id: JsonRpcId, error: McpProtocolError | Error) {
  if (error instanceof McpProtocolError) {
    return {
      jsonrpc: JSON_RPC_VERSION,
      id,
      error: {
        code: error.code,
        message: error.message,
        data: error.data,
      },
    };
  }

  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    error: {
      code: -32603,
      message: error.message || "Internal error",
    },
  };
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new McpProtocolError(`Missing or invalid string field: ${field}`, -32602, { field });
  }

  return value.trim();
}

function requireObject(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new McpProtocolError(`Missing or invalid object field: ${field}`, -32602, { field });
  }

  return value as Record<string, unknown>;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function makeToolResult(payload: unknown, isError = false): McpCallToolResult {
  return {
    content: [
      {
        type: "text",
        text: stringifyContent(payload),
      },
    ],
    structuredContent: payload,
    ...(isError ? { isError: true } : {}),
  };
}

function toolInputSchema(name: ClawLinkMcpToolDefinition["name"]): JsonObject {
  switch (name) {
    case "clawlink.whoami":
      return { type: "object", additionalProperties: false, properties: {} };
    case "clawlink.search":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string", minLength: 1 },
          connected_only: { type: "boolean" },
          limit: { type: "number", minimum: 1, maximum: 100 },
        },
        required: ["query"],
      };
    case "clawlink.list_integrations":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string" },
          category: { type: "string" },
          connected_only: { type: "boolean" },
          supports_action: { type: "string" },
          page: { type: "number", minimum: 1 },
          page_size: { type: "number", minimum: 1, maximum: 100 },
        },
      };
    case "clawlink.get_integration":
      return {
        type: "object",
        additionalProperties: false,
        properties: { integration_id: { type: "string", minLength: 1 } },
        required: ["integration_id"],
      };
    case "clawlink.list_actions":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          integration_id: { type: "string", minLength: 1 },
          intent: { type: "string" },
        },
        required: ["integration_id"],
      };
    case "clawlink.get_action":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          integration_id: { type: "string", minLength: 1 },
          action_id: { type: "string", minLength: 1 },
        },
        required: ["integration_id", "action_id"],
      };
    case "clawlink.get_connection":
    case "clawlink.begin_connection":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          integration_id: { type: "string", minLength: 1 },
          redirect_url: { type: "string" },
          channel: { type: "string" },
        },
        required: ["integration_id"],
      };
    case "clawlink.execute":
      return {
        type: "object",
        additionalProperties: false,
        properties: {
          integration_id: { type: "string", minLength: 1 },
          action_id: { type: "string", minLength: 1 },
          input: { type: "object", additionalProperties: true },
          idempotency_key: { type: "string" },
          confirm: { type: "boolean" },
        },
        required: ["integration_id", "action_id", "input"],
      };
    case "clawlink.get_execution":
      return {
        type: "object",
        additionalProperties: false,
        properties: { execution_id: { type: "string", minLength: 1 } },
        required: ["execution_id"],
      };
    default:
      return { type: "object", additionalProperties: true };
  }
}

export function listMcpTools(): McpToolListResponse {
  return {
    tools: CLAWLINK_MCP_V1_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.name,
      description: tool.description,
      inputSchema: toolInputSchema(tool.name),
    })),
  };
}

async function callWhoAmI(user: UserRow): Promise<ClawLinkWhoAmIResponse> {
  return getCanonicalWhoAmI(user);
}

async function callSearch(user: UserRow, args: JsonObject) {
  const input: ClawLinkSearchInput = {
    query: requireString(args.query, "query"),
    connected_only: optionalBoolean(args.connected_only),
    limit: optionalNumber(args.limit),
  };

  return searchCanonicalCatalog(user, input);
}

async function callListIntegrations(user: UserRow, args: JsonObject) {
  const input: ClawLinkListIntegrationsInput = {
    query: typeof args.query === "string" ? args.query.trim() || undefined : undefined,
    category: typeof args.category === "string" ? args.category.trim() || undefined : undefined,
    connected_only: optionalBoolean(args.connected_only),
    supports_action: typeof args.supports_action === "string" ? args.supports_action.trim() || undefined : undefined,
    page: optionalNumber(args.page),
    page_size: optionalNumber(args.page_size),
  };

  return listCanonicalIntegrations(user, input);
}

async function callGetIntegration(user: UserRow, args: JsonObject) {
  const input: ClawLinkGetIntegrationInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
  };

  const result = await getCanonicalIntegration(user, input);
  if (!result) {
    throw new McpProtocolError("Integration not found", -32004, {
      code: "integration_not_found",
      integration_id: input.integration_id,
    });
  }

  return result;
}

async function callListActions(user: UserRow, args: JsonObject) {
  const input: ClawLinkListActionsInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
    intent: typeof args.intent === "string" ? args.intent.trim() || undefined : undefined,
  };

  const result = await listCanonicalActions(user, input);
  if (!result) {
    throw new McpProtocolError("Integration not found", -32004, {
      code: "integration_not_found",
      integration_id: input.integration_id,
    });
  }

  return result;
}

async function callGetAction(user: UserRow, args: JsonObject) {
  const input: ClawLinkGetActionInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
    action_id: requireString(args.action_id, "action_id"),
  };

  const result = await getCanonicalAction(user, input);
  if (!result) {
    throw new McpProtocolError("Action not found", -32004, {
      code: "action_not_found",
      integration_id: input.integration_id,
      action_id: input.action_id,
    });
  }

  return result;
}

async function callGetConnection(user: UserRow, args: JsonObject) {
  const input: ClawLinkGetConnectionInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
  };

  return getCanonicalConnection(user, input);
}

async function callBeginConnection(user: UserRow, args: JsonObject, request: Request) {
  const input: ClawLinkBeginConnectionInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
    redirect_url: typeof args.redirect_url === "string" ? args.redirect_url.trim() || undefined : undefined,
    channel: typeof args.channel === "string" ? args.channel.trim() || undefined : undefined,
  };

  const result = await beginCanonicalConnection(user, {
    ...input,
    origin: new URL(request.url).origin,
    reuse_if_connected: true,
  });

  if (!result) {
    throw new McpProtocolError("Integration not found", -32004, {
      code: "integration_not_found",
      integration_id: input.integration_id,
    });
  }

  return result;
}

async function callExecute(user: UserRow, args: JsonObject) {
  const input: ClawLinkExecuteInput = {
    integration_id: requireString(args.integration_id, "integration_id"),
    action_id: requireString(args.action_id, "action_id"),
    input: requireObject(args.input, "input"),
    idempotency_key: typeof args.idempotency_key === "string" ? args.idempotency_key.trim() || undefined : undefined,
    confirm: optionalBoolean(args.confirm),
  };

  return createCanonicalExecution(user, input);
}

async function callGetExecution(user: UserRow, args: JsonObject) {
  const input: ClawLinkGetExecutionInput = {
    execution_id: requireString(args.execution_id, "execution_id"),
  };

  const result = await getCanonicalExecution(user, input);
  if (!result) {
    throw new McpProtocolError("Execution not found", -32004, {
      code: "execution_not_found",
      execution_id: input.execution_id,
    });
  }

  return result;
}

export async function dispatchMcpToolCall(user: UserRow, request: Request, name: string, argumentsValue: unknown) {
  const args = asObject(argumentsValue);

  switch (name) {
    case "clawlink.whoami":
      return callWhoAmI(user);
    case "clawlink.search":
      return callSearch(user, args);
    case "clawlink.list_integrations":
      return callListIntegrations(user, args);
    case "clawlink.get_integration":
      return callGetIntegration(user, args);
    case "clawlink.list_actions":
      return callListActions(user, args);
    case "clawlink.get_action":
      return callGetAction(user, args);
    case "clawlink.get_connection":
      return callGetConnection(user, args);
    case "clawlink.begin_connection":
      return callBeginConnection(user, args, request);
    case "clawlink.execute":
      return callExecute(user, args);
    case "clawlink.get_execution":
      return callGetExecution(user, args);
    default:
      throw new McpProtocolError(`Unknown tool: ${name}`, -32601, { name });
  }
}

export async function handleMcpRequest(request: Request, user: UserRow, body: unknown) {
  const rpc = body as JsonRpcRequest;
  const id = rpc?.id ?? null;

  try {
    if (!rpc || rpc.jsonrpc !== JSON_RPC_VERSION || typeof rpc.method !== "string") {
      throw new McpProtocolError("Invalid JSON-RPC request", -32600);
    }

    switch (rpc.method) {
      case "initialize":
        return success(id, {
          protocolVersion: MCP_PROTOCOL_VERSION,
          serverInfo: {
            name: MCP_SERVER_NAME,
            version: MCP_SERVER_VERSION,
          },
          capabilities: {
            tools: {},
          },
        });
      case "notifications/initialized":
        return success(id, {});
      case "ping":
        return success(id, {});
      case "tools/list":
        return success(id, listMcpTools());
      case "tools/call": {
        const params = asObject(rpc.params);
        const toolName = requireString(params.name, "name") as ClawLinkMcpToolDefinition["name"];
        const result = await dispatchMcpToolCall(user, request, toolName, params.arguments);
        return success(id, makeToolResult(result));
      }
      default:
        throw new McpProtocolError(`Method not found: ${rpc.method}`, -32601);
    }
  } catch (error) {
    if (rpc?.method === "tools/call" && error instanceof McpProtocolError) {
      return success(id, makeToolResult({
        status: "failed",
        error: {
          code: (error.data as { code?: string } | undefined)?.code ?? "execution_failed",
          message: error.message,
          retryable: false,
          details: asObject(error.data),
        },
      }, true));
    }

    return failure(id, error as Error);
  }
}
