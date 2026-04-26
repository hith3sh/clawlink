/**
 * Base integration handler
 * 
 * All integration handlers implement this interface
 */

import {
  inferToolRisk,
  type NormalizedToolError,
  type ToolMode,
  type ToolRisk,
} from "../../src/lib/runtime/tool-runtime";
import type { ToolExecutionSpec } from "../../src/lib/pipedream/manifest-types";

export type ToolAccessLevel = ToolMode;

export interface IntegrationToolExample {
  user: string;
  args: Record<string, unknown>;
}

export interface IntegrationTool {
  integration: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  mode: ToolMode;
  risk: ToolRisk;
  tags: string[];
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: IntegrationToolExample[];
  followups: string[];
  requiresScopes: string[];
  idempotent: boolean;
  supportsDryRun: boolean;
  supportsBatch: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
  execution: ToolExecutionSpec;
}

export interface DefineIntegrationToolOptions {
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  risk?: ToolRisk;
  tags?: string[];
  whenToUse?: string[];
  askBefore?: string[];
  safeDefaults?: Record<string, unknown>;
  examples?: IntegrationToolExample[];
  followups?: string[];
  requiresScopes?: string[];
  idempotent?: boolean;
  supportsDryRun?: boolean;
  supportsBatch?: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
}

export function defineTool(
  integration: string,
  action: string,
  options: DefineIntegrationToolOptions,
): IntegrationTool {
  return {
    integration,
    name: `${integration}_${action}`,
    description: options.description,
    inputSchema: options.inputSchema,
    outputSchema: options.outputSchema,
    accessLevel: options.accessLevel,
    mode: options.accessLevel,
    risk: options.risk ?? inferToolRisk(options.accessLevel),
    tags: options.tags ?? [],
    whenToUse: options.whenToUse ?? [],
    askBefore: options.askBefore ?? [],
    safeDefaults: options.safeDefaults ?? {},
    examples: options.examples ?? [],
    followups: options.followups ?? [],
    requiresScopes: options.requiresScopes ?? [],
    idempotent: options.idempotent ?? options.accessLevel === "read",
    supportsDryRun: options.supportsDryRun ?? false,
    supportsBatch: options.supportsBatch ?? false,
    maxBatchSize: options.maxBatchSize,
    recommendedTimeoutMs: options.recommendedTimeoutMs,
    execution: { kind: "custom" },
  };
}

export interface IntegrationHandler {
  /**
   * Get list of tools this integration provides
   */
  getTools(integrationSlug: string): IntegrationTool[];

  /**
   * Execute an action
   */
  execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: {
      requestId: string;
      dryRun?: boolean;
      timeoutMs?: number;
      connectionId?: number;
      userId?: string;
      env?: Record<string, unknown>;
    },
  ): Promise<unknown>;

  /**
   * Validate credentials for this integration
   */
  validateCredentials?(credentials: Record<string, string>): Promise<boolean>;

  checkHealth?(
    credentials: Record<string, string>,
  ): Promise<{
    ok: boolean;
    scopes?: string[];
    account?: { id?: string; label?: string };
    expiresAt?: string | null;
  }>;

}

export class IntegrationRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, options: { status: number; code?: string }) {
    super(message);
    this.name = "IntegrationRequestError";
    this.status = options.status;
    this.code = options.code;
  }
}

export function isAuthenticationFailure(error: unknown): boolean {
  if (error instanceof IntegrationRequestError) {
    return error.status === 401;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return /\b401\b|unauthorized|invalid[_\s-]?token|token expired|invalid[_\s-]?auth/i.test(
    error.message,
  );
}

function isMissingScopeFailure(error: unknown): boolean {
  if (error instanceof IntegrationRequestError) {
    return error.status === 403 && /\bscope|permission|forbidden|insufficient/i.test(error.message);
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return /\binsufficient[_\s-]?scope|missing[_\s-]?scope|permission denied|forbidden\b/i.test(
    error.message,
  );
}

function isRateLimitFailure(error: unknown): boolean {
  if (error instanceof IntegrationRequestError) {
    return error.status === 429;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return /\b429\b|rate limit|too many requests/i.test(error.message);
}

function isNetworkFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /\b(fetch failed|network|timed out|timeout|socket hang up|econnreset|etimedout|enotfound)\b/i.test(
    error.message,
  );
}

export function classifyIntegrationError(error: unknown): NormalizedToolError {
  if (error instanceof IntegrationRequestError) {
    if (error.status === 401) {
      return {
        type: "reauth_required",
        code: error.code,
        message: error.message,
        retryable: false,
      };
    }

    if (error.status === 429) {
      return {
        type: "rate_limit",
        code: error.code,
        message: error.message,
        retryable: true,
      };
    }

    if (error.status === 403 && isMissingScopeFailure(error)) {
      return {
        type: "missing_scopes",
        code: error.code,
        message: error.message,
        retryable: false,
      };
    }

    return {
      type: "provider",
      code: error.code,
      message: error.message,
      retryable: error.status >= 500,
    };
  }

  if (isAuthenticationFailure(error)) {
    return {
      type: "reauth_required",
      message: error instanceof Error ? error.message : "Authentication failed",
      retryable: false,
    };
  }

  if (isMissingScopeFailure(error)) {
    return {
      type: "missing_scopes",
      message: error instanceof Error ? error.message : "Missing required scopes",
      retryable: false,
    };
  }

  if (isRateLimitFailure(error)) {
    return {
      type: "rate_limit",
      message: error instanceof Error ? error.message : "Provider rate limit reached",
      retryable: true,
    };
  }

  if (isNetworkFailure(error)) {
    return {
      type: "network",
      message: error instanceof Error ? error.message : "Network request failed",
      retryable: true,
    };
  }

  return {
    type: "unknown",
    message: error instanceof Error ? error.message : "Unknown tool execution error",
    retryable: false,
  };
}

/**
 * Base class with common functionality
 */
export abstract class BaseIntegration implements IntegrationHandler {
  abstract getTools(integrationSlug: string): IntegrationTool[];
  abstract execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: {
      requestId: string;
      dryRun?: boolean;
      timeoutMs?: number;
      connectionId?: number;
      userId?: string;
    },
  ): Promise<unknown>;

  private buildRequestHeaders(
    baseHeaders: RequestInit["headers"],
    integrationHeaders: Record<string, string>,
  ): Headers {
    const headers = new Headers(baseHeaders);

    for (const [key, value] of Object.entries(integrationHeaders)) {
      headers.set(key, value);
    }

    return headers;
  }

  /**
   * Make an API request with retry logic
   */
  protected async apiRequest(
    url: string,
    options: RequestInit,
    credentials: Record<string, string>,
    retries = 3
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: this.buildRequestHeaders(
            options.headers,
            this.getHeaders(credentials),
          ),
        });

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return response;
        }

        // Retry on server errors (5xx) or rate limits (429)
        if (response.status >= 500 || response.status === 429) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          lastError = new Error(`Server error: ${response.status}`);
          continue;
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (i < retries - 1) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }

  /**
   * Get headers for API requests (override per integration)
   */
  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    void credentials;

    return {
      "Content-Type": "application/json",
    };
  }

  /**
   * Build query string from params
   */
  protected buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    return searchParams.toString();
  }
}

/**
 * Registry of all integration handlers
 */
const handlers = new Map<string, IntegrationHandler>();

export function registerHandler(slug: string, handler: IntegrationHandler): void {
  handlers.set(slug, handler);
}

export function getIntegrationHandler(slug: string): IntegrationHandler | undefined {
  return handlers.get(slug);
}

export function getAllHandlers(): Map<string, IntegrationHandler> {
  return handlers;
}
