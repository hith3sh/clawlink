/// <reference types="@cloudflare/workers-types" />

/**
 * ClawLink Worker - MCP Proxy Server
 * 
 * Handles MCP protocol requests from OpenClaw and proxies them
 * to third-party APIs (Gmail, Slack, Stripe, etc.)
 */

// Import integrations to register handlers
import "./integrations";

import { integrations } from "../src/data/integrations";
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
import { getIntegrationHandler, type IntegrationTool } from "./integrations";
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

  // Parse tool name: "gmail_send_email" -> integration: gmail, action: send_email
  const [integration, ...actionParts] = name.split("_");
  const action = actionParts.join("_");
  const internalUserId = await resolveInternalUserId(env.DB, authSubject);

  if (!internalUserId) {
    throw new Error("No ClawLink user found for the authenticated account.");
  }

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

  // Get the integration handler
  const handler = getIntegrationHandler(integration);
  if (!handler) {
    throw new Error(`Unknown integration: ${integration}`);
  }

  const canRetryAfterAuthFailure = !hasInlineCredentials;
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let resolvedConnectionId = connectionId ?? null;

  try {
    if (params?.credentials) {
      // Credentials passed in request (already encrypted per-session)
      credentials = params.credentials;
    } else {
      const loaded = await loadConnectionCredentialsForIntegration(env, internalUserId, integration, {
        connectionId,
      });
      credentials = loaded.credentials;
      resolvedConnectionId = loaded.connectionId;
    }
    let currentCredentials = credentials;

    let result: unknown;

    try {
      result = await handler.execute(action, args, currentCredentials, {
        requestId,
        connectionId: resolvedConnectionId ?? undefined,
        userId: internalUserId,
        env: env as Record<string, unknown>,
      });
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
        result = await handler.execute(action, args, currentCredentials, {
          requestId,
          connectionId: resolvedConnectionId,
          userId: internalUserId,
          env: env as Record<string, unknown>,
        });
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

    const latencyMs = Date.now() - startedAt;

    if (resolvedConnectionId) {
      await recordConnectionExecutionSuccess(env, resolvedConnectionId);

      if (typeof handler.checkHealth === "function") {
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
    });

    return result;
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
    });

    throw error;
  }
}

/**
 * Handle MCP list_tools request
 */
function handleListTools(): IntegrationTool[] {
  const tools: IntegrationTool[] = [];
  
  for (const integration of integrations) {
    const handler = getIntegrationHandler(integration.slug);
    if (handler?.getTools) {
      const integrationTools = handler.getTools(integration.slug);
      tools.push(...integrationTools);
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
          result = { tools: handleListTools() };
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
