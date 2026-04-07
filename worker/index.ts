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
import { getOAuthRefreshConfig } from "../src/lib/oauth/providers";
import { verifyAuth } from "./auth";
import {
  loadCredentialsForIntegration,
  markConnectionNeedsReauthForIntegration,
  refreshCredentialsForIntegration,
  resolveInternalUserId,
} from "./credentials";
import { logRequest } from "./logger";
import { getIntegrationHandler, type IntegrationTool } from "./integrations";
import { isAuthenticationFailure } from "./integrations/base";

export interface Env {
  DB: D1Database;
  CREDENTIALS: KVNamespace;
  CREDENTIAL_ENCRYPTION_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_JWT_KEY?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  NOTION_CLIENT_ID?: string;
  NOTION_CLIENT_SECRET?: string;
  OUTLOOK_CLIENT_ID?: string;
  OUTLOOK_CLIENT_SECRET?: string;
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

  if (params?.credentials) {
    // Credentials passed in request (already encrypted per-session)
    credentials = params.credentials;
  } else {
    credentials = await loadCredentialsForIntegration(env, internalUserId, integration, {
      connectionId,
    });
  }

  // Get the integration handler
  const handler = getIntegrationHandler(integration);
  if (!handler) {
    throw new Error(`Unknown integration: ${integration}`);
  }

  const canRetryAfterAuthFailure =
    !hasInlineCredentials && Boolean(getOAuthRefreshConfig(integration));
  let result: unknown;

  try {
    result = await handler.execute(action, args, credentials);
  } catch (error) {
    if (!canRetryAfterAuthFailure || !isAuthenticationFailure(error)) {
      throw error;
    }

    const refreshed = await refreshCredentialsForIntegration(env, internalUserId, integration, {
      connectionId,
    });

    try {
      result = await handler.execute(action, args, refreshed.credentials);
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

  // Log the request
  await logRequest(env.DB, {
    userId: internalUserId,
    integration,
    action,
    success: true,
    latencyMs: 0, // TODO: measure properly
  });

  return result;
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
} satisfies ExportedHandler<Env>;
