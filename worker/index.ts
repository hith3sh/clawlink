/// <reference types="@cloudflare/workers-types" />

/**
 * ClawLink Worker - MCP Proxy Server
 * 
 * Handles MCP protocol requests from OpenClaw and proxies them
 * to third-party APIs (Gmail, Slack, Stripe, etc.)
 */

// Import integrations to register handlers
import "./integrations";

import { executeComposioTool } from "../src/lib/composio/tool-executor";
import { hydrateComposioToolSchemas } from "../src/lib/composio/manifest-registry";
import { executePipedreamActionTool } from "../src/lib/pipedream/action-executor";
import { verifyAuth } from "./auth";
import {
  loadConnectionCredentialsForIntegration,
  markConnectionNeedsReauthForIntegration,
  recordConnectionExecutionFailure,
  recordConnectionExecutionSuccess,
  refreshCredentialsForIntegration,
  resolveInternalUserId,
  updateConnectionExecutionMetadata,
} from "./credentials";
import { logRequest, logToolExecution } from "./logger";
import {
  getAllRegisteredTools,
  getIntegrationHandler,
  getRegisteredToolByName,
  type IntegrationTool,
} from "./integrations";
import { classifyIntegrationError, isAuthenticationFailure } from "./integrations/base";

export interface Env {
  DB: D1Database;
  CREDENTIALS: KVNamespace;
  CLAWLINK_APP_URL?: string;
  CREDENTIAL_ENCRYPTION_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_JWT_KEY?: string;
  NANGO_BASE_URL?: string;
  NANGO_SECRET_KEY?: string;
  NANGO_PROVIDER_CONFIG_KEYS?: string;
  PIPEDREAM_BASE_URL?: string;
  PIPEDREAM_CLIENT_ID?: string;
  PIPEDREAM_CLIENT_SECRET?: string;
  PIPEDREAM_PROJECT_ID?: string;
  PIPEDREAM_ENVIRONMENT?: string;
  COMPOSIO_API_KEY?: string;
  COMPOSIO_BASE_URL?: string;
  COMPOSIO_TOOLKIT_MAP?: string;
  COMPOSIO_AUTH_CONFIG_MAP?: string;
  COMPOSIO_TOOLKIT_VERSION_MAP?: string;
  TRIGGER_CRON_SECRET?: string;
  [key: string]: unknown;
}

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    credentials?: Record<string, string>;
  };
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "unserializable_payload" });
  }
}

function getClawLinkAppUrl(env: Env): string {
  const configured =
    typeof env.CLAWLINK_APP_URL === "string" && env.CLAWLINK_APP_URL.trim().length > 0
      ? env.CLAWLINK_APP_URL.trim()
      : "https://claw-link.dev";

  return configured.replace(/\/+$/, "");
}

interface WorkerConnectionRow {
  id: number;
  is_default: number;
  auth_state: string;
  auth_provider: string | null;
  pipedream_account_id: string | null;
  composio_connected_account_id: string | null;
  updated_at: string | null;
  created_at: string;
}

function isPipedreamBackedConnection(row: WorkerConnectionRow): boolean {
  return row.auth_provider === "pipedream" || Boolean(row.pipedream_account_id);
}

function isComposioBackedConnection(row: WorkerConnectionRow): boolean {
  return row.auth_provider === "composio" || Boolean(row.composio_connected_account_id);
}

async function resolvePreferredPipedreamConnectionId(
  env: Env,
  userId: string,
  integration: string,
  preferredConnectionId?: number,
): Promise<number | null> {
  if (preferredConnectionId) {
    const row = await env.DB
      .prepare(
        `
          SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
                 composio_connected_account_id, updated_at, created_at
          FROM user_integrations
          WHERE id = ? AND user_id = ? AND integration = ?
          LIMIT 1
        `,
      )
      .bind(preferredConnectionId, userId, integration)
      .first<WorkerConnectionRow>();

    if (!row) {
      return null;
    }

    return isPipedreamBackedConnection(row) ? row.id : null;
  }

  const result = await env.DB
    .prepare(
      `
        SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
               composio_connected_account_id, updated_at, created_at
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
      `,
    )
    .bind(userId, integration)
    .all<WorkerConnectionRow>();

  const rows = result.results ?? [];

  const activeDefault =
    rows.find((row) => row.is_default && row.auth_state === "active" && isPipedreamBackedConnection(row)) ??
    null;

  if (activeDefault) {
    return activeDefault.id;
  }

  const latestActive =
    rows.find((row) => row.auth_state === "active" && isPipedreamBackedConnection(row)) ??
    null;

  if (latestActive) {
    return latestActive.id;
  }

  const fallback =
    rows.find((row) => row.is_default && isPipedreamBackedConnection(row)) ??
    rows.find((row) => isPipedreamBackedConnection(row)) ??
    null;

  return fallback?.id ?? null;
}

async function resolvePreferredComposioConnectionId(
  env: Env,
  userId: string,
  integration: string,
  preferredConnectionId?: number,
): Promise<number | null> {
  if (preferredConnectionId) {
    const row = await env.DB
      .prepare(
        `
          SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
                 composio_connected_account_id, updated_at, created_at
          FROM user_integrations
          WHERE id = ? AND user_id = ? AND integration = ?
          LIMIT 1
        `,
      )
      .bind(preferredConnectionId, userId, integration)
      .first<WorkerConnectionRow>();

    if (!row) {
      return null;
    }

    return isComposioBackedConnection(row) ? row.id : null;
  }

  const result = await env.DB
    .prepare(
      `
        SELECT id, is_default, auth_state, auth_provider, pipedream_account_id,
               composio_connected_account_id, updated_at, created_at
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
      `,
    )
    .bind(userId, integration)
    .all<WorkerConnectionRow>();

  const rows = result.results ?? [];
  const activeDefault =
    rows.find((row) => row.is_default && row.auth_state === "active" && isComposioBackedConnection(row)) ??
    null;

  if (activeDefault) {
    return activeDefault.id;
  }

  const latestActive =
    rows.find((row) => row.auth_state === "active" && isComposioBackedConnection(row)) ??
    null;

  if (latestActive) {
    return latestActive.id;
  }

  const fallback =
    rows.find((row) => row.is_default && isComposioBackedConnection(row)) ??
    rows.find((row) => isComposioBackedConnection(row)) ??
    null;

  return fallback?.id ?? null;
}

async function runScheduledTriggerWork(env: Env): Promise<void> {
  const secret =
    typeof env.TRIGGER_CRON_SECRET === "string" ? env.TRIGGER_CRON_SECRET.trim() : "";

  if (!secret) {
    console.warn("Skipping scheduled trigger run because TRIGGER_CRON_SECRET is not configured.");
    return;
  }

  const response = await fetch(`${getClawLinkAppUrl(env)}/api/triggers/run-due`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "User-Agent": "clawlink-trigger-scheduler",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Trigger scheduler failed with ${response.status}: ${body.slice(0, 500)}`,
    );
  }
}

/**
 * Handle MCP tool call from OpenClaw
 */
async function handleToolCall(
  env: Env,
  authSubject: string,
  params?: MCPRequest["params"]
): Promise<unknown> {
  const { name, arguments: rawArgs = {} } = params || {};
  
  if (!name) {
    throw new Error("Missing tool name");
  }

  const internalUserId = await resolveInternalUserId(env.DB, authSubject);

  if (!internalUserId) {
    throw new Error("No ClawLink user found for the authenticated account.");
  }

  const tool = getRegisteredToolByName(name);

  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const integration = tool.integration;
  const action = tool.name.startsWith(`${integration}_`)
    ? tool.name.slice(integration.length + 1)
    : tool.name;

  // Get cached credentials or decrypt from request
  let credentials: Record<string, string>;
  const args = { ...rawArgs };
  const rawConnectionId = args.connectionId;
  const parsedConnectionId =
    typeof rawConnectionId === "number"
      ? rawConnectionId
      : typeof rawConnectionId === "string"
        ? Number.parseInt(rawConnectionId, 10)
        : NaN;
  const connectionId = Number.isFinite(parsedConnectionId) ? parsedConnectionId : undefined;

  if ("connectionId" in args) {
    delete args.connectionId;
  }
  const hasInlineCredentials = Boolean(params?.credentials);
  const handler =
    tool.execution.kind === "custom"
      ? getIntegrationHandler(integration)
      : null;

  if (tool.execution.kind === "custom" && !handler) {
    throw new Error(`Unknown integration: ${integration}`);
  }

  const canRetryAfterAuthFailure = !hasInlineCredentials;
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let resolvedConnectionId = connectionId ?? null;
  let providerRequestId: string | undefined;

  try {
    if (params?.credentials) {
      // Credentials passed in request (already encrypted per-session)
      credentials = params.credentials;
    } else {
      if (tool.execution.kind === "pipedream_action") {
        resolvedConnectionId = await resolvePreferredPipedreamConnectionId(
          env,
          internalUserId,
          integration,
          connectionId,
        );

        if (!resolvedConnectionId) {
          throw new Error(
            `No Pipedream-backed connection found for ${integration}. Please reconnect it through ClawLink.`,
          );
        }
      } else if (tool.execution.kind === "composio_tool") {
        resolvedConnectionId = await resolvePreferredComposioConnectionId(
          env,
          internalUserId,
          integration,
          connectionId,
        );

        if (!resolvedConnectionId) {
          throw new Error(
            `No Composio-backed connection found for ${integration}. Please reconnect it through ClawLink.`,
          );
        }
      }

      const loaded = await loadConnectionCredentialsForIntegration(env, internalUserId, integration, {
        connectionId: resolvedConnectionId ?? undefined,
      });
      credentials = loaded.credentials;
      resolvedConnectionId = loaded.connectionId;
    }
    let currentCredentials = credentials;

    const runTool = async (
      current: Record<string, string>,
    ): Promise<unknown> => {
      if (tool.execution.kind === "pipedream_action") {
        const execution = await executePipedreamActionTool(tool, args, {
          requestId,
          externalUserId: internalUserId,
          credentials: current,
          env: env as Record<string, unknown>,
        });
        providerRequestId = execution.providerRequestId;
        return execution.data;
      }

      if (tool.execution.kind === "composio_tool") {
        const execution = await executeComposioTool(tool, args, {
          requestId,
          externalUserId: internalUserId,
          credentials: current,
          env: env as Record<string, unknown>,
        });
        providerRequestId = execution.providerRequestId;
        return execution.data;
      }

      return handler!.execute(action, args, current, {
        requestId,
        connectionId: resolvedConnectionId ?? undefined,
        userId: internalUserId,
        env: env as Record<string, unknown>,
      });
    };

    try {
      const result = await runTool(currentCredentials);

      const latencyMs = Date.now() - startedAt;

      if (resolvedConnectionId) {
        await recordConnectionExecutionSuccess(env, resolvedConnectionId);

        if (handler && typeof handler.checkHealth === "function") {
          const health = await handler.checkHealth(currentCredentials);
          await updateConnectionExecutionMetadata(env, resolvedConnectionId, {
            scopes: health.scopes ?? null,
          });
        }
      }

      await logRequest(env.DB, {
        userId: internalUserId,
        integration,
        action,
        success: true,
        latencyMs,
        requestBody: safeJsonStringify(args),
        responseBody: safeJsonStringify(result),
      });

      await logToolExecution(env.DB, {
        id: requestId,
        userId: internalUserId,
        integration,
        toolName: name,
        connectionId: resolvedConnectionId,
        executionMode: "direct",
        status: "success",
        requestJson: safeJsonStringify({
          arguments: args,
          connectionId: resolvedConnectionId,
          inlineCredentials: hasInlineCredentials,
        }),
        responseJson: safeJsonStringify(result),
        latencyMs,
        providerRequestId,
      });

      return result;
    } catch (error) {
      if (!canRetryAfterAuthFailure || !isAuthenticationFailure(error)) {
        throw error;
      }

      const refreshed = await refreshCredentialsForIntegration(env, internalUserId, integration, {
        connectionId: resolvedConnectionId ?? undefined,
      });
      resolvedConnectionId = refreshed.connectionId;
      currentCredentials = refreshed.credentials;

      try {
        const result = await runTool(currentCredentials);

        const latencyMs = Date.now() - startedAt;

        if (resolvedConnectionId) {
          await recordConnectionExecutionSuccess(env, resolvedConnectionId);

          if (handler && typeof handler.checkHealth === "function") {
            const health = await handler.checkHealth(currentCredentials);
            await updateConnectionExecutionMetadata(env, resolvedConnectionId, {
              scopes: health.scopes ?? null,
            });
          }
        }

        await logRequest(env.DB, {
          userId: internalUserId,
          integration,
          action,
          success: true,
          latencyMs,
          requestBody: safeJsonStringify(args),
          responseBody: safeJsonStringify(result),
        });

        await logToolExecution(env.DB, {
          id: requestId,
          userId: internalUserId,
          integration,
          toolName: name,
          connectionId: resolvedConnectionId,
          executionMode: "direct",
          status: "success",
          requestJson: safeJsonStringify({
            arguments: args,
            connectionId: resolvedConnectionId,
            inlineCredentials: hasInlineCredentials,
          }),
          responseJson: safeJsonStringify(result),
          latencyMs,
          providerRequestId,
        });

        return result;
      } catch (retryError) {
        if (isAuthenticationFailure(retryError)) {
          const detail =
            retryError instanceof Error
              ? retryError.message
              : `Authentication failed after refreshing ${integration} credentials.`;
          await markConnectionNeedsReauthForIntegration(
            env,
            internalUserId,
            integration,
            detail,
            { connectionId: refreshed.connectionId },
          );
        }

        throw retryError;
      }
    }
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const classified = classifyIntegrationError(error);

    if (resolvedConnectionId) {
      await recordConnectionExecutionFailure(env, resolvedConnectionId, classified);
    }

    await logRequest(env.DB, {
      userId: internalUserId,
      integration,
      action,
      success: false,
      latencyMs,
      errorMessage: classified.message,
      requestBody: safeJsonStringify(args),
    });

    await logToolExecution(env.DB, {
      id: requestId,
      userId: internalUserId,
      integration,
      toolName: name,
      connectionId: resolvedConnectionId,
      executionMode: "direct",
      status: "error",
      error: classified,
      requestJson: safeJsonStringify({
        arguments: args,
        connectionId: resolvedConnectionId,
        inlineCredentials: hasInlineCredentials,
      }),
      latencyMs,
      providerRequestId,
    });

    throw error;
  }
}

/**
 * Handle MCP list_tools request.
 *
 * Composio tool manifests ship without inputSchema to keep the bundle small.
 * We hydrate schemas lazily from KV / Composio API only for integrations the
 * authenticated user has connected. Unconnected integrations keep the stub
 * schema — the user can't invoke those tools anyway.
 */
async function handleListTools(env: Env, userId: string): Promise<IntegrationTool[]> {
  const tools = getAllRegisteredTools();

  // Determine which integrations the user has Composio-backed connections for.
  const internalUserId = await resolveInternalUserId(env.DB, userId);

  if (internalUserId) {
    const connectedIntegrations = await env.DB
      .prepare(
        `SELECT DISTINCT integration FROM user_integrations
         WHERE user_id = ? AND (auth_provider = 'composio' OR composio_connected_account_id IS NOT NULL)`,
      )
      .bind(internalUserId)
      .all<{ integration: string }>();

    const connectedSlugs = new Set(
      (connectedIntegrations.results ?? []).map((row) => row.integration),
    );

    // Only hydrate schemas for tools that belong to connected integrations.
    const toolsToHydrate = connectedSlugs.size > 0
      ? tools.filter((tool) => tool.execution.kind === "composio_tool" && connectedSlugs.has(tool.integration))
      : [];

    if (toolsToHydrate.length > 0) {
      await hydrateComposioToolSchemas(toolsToHydrate, env.CREDENTIALS, env as unknown as Record<string, unknown>);
    }
  }

  return tools;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    const origin = request.headers.get("Origin") || "https://claw-link.dev";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept JSON-RPC POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        error: { code: -32600, message: "Method not allowed" }
      }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      // Verify authentication
      const authHeader = request.headers.get("Authorization");
      const userId = await verifyAuth(authHeader, env as { CLERK_PUBLISHABLE_KEY?: string; CLERK_JWT_KEY?: string });
      
      if (!userId) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: 0,
          error: { code: -32001, message: "Unauthorized" }
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Parse MCP request
      const mcpRequest: MCPRequest = await request.json();
      
      let result: unknown;
      
      switch (mcpRequest.method) {
        case "tools/list":
          result = { tools: await handleListTools(env, userId) };
          break;
          
        case "tools/call":
          result = await handleToolCall(
            env,
            userId,
            mcpRequest.params
          );
          break;
          
        default:
          throw new Error(`Unknown method: ${mcpRequest.method}`);
      }

      const response: MCPResponse = {
        jsonrpc: "2.0",
        id: mcpRequest.id,
        result
      };

      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
      });

    } catch (error) {
      console.error("Worker error:", error);
      
      const response: MCPResponse = {
        jsonrpc: "2.0",
        id: 0,
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : "Internal error"
        }
      };

      return new Response(JSON.stringify(response), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
      });
    }
  },
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      runScheduledTriggerWork(env).catch((error) => {
        console.error("Scheduled trigger run failed:", error);
      }),
    );
  },
} satisfies ExportedHandler<Env>;
