/**
 * Base integration handler
 * 
 * All integration handlers implement this interface
 */

export type ToolAccessLevel = "read" | "write" | "destructive";

export interface IntegrationToolExample {
  user: string;
  args: Record<string, unknown>;
}

export interface IntegrationTool {
  integration: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  tags: string[];
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: IntegrationToolExample[];
  followups: string[];
}

export interface DefineIntegrationToolOptions {
  description: string;
  inputSchema: Record<string, unknown>;
  accessLevel: ToolAccessLevel;
  tags?: string[];
  whenToUse?: string[];
  askBefore?: string[];
  safeDefaults?: Record<string, unknown>;
  examples?: IntegrationToolExample[];
  followups?: string[];
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
    accessLevel: options.accessLevel,
    tags: options.tags ?? [],
    whenToUse: options.whenToUse ?? [],
    askBefore: options.askBefore ?? [],
    safeDefaults: options.safeDefaults ?? {},
    examples: options.examples ?? [],
    followups: options.followups ?? [],
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
  execute(action: string, args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown>;

  /**
   * Validate credentials for this integration
   */
  validateCredentials?(credentials: Record<string, string>): Promise<boolean>;

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

/**
 * Base class with common functionality
 */
export abstract class BaseIntegration implements IntegrationHandler {
  abstract getTools(integrationSlug: string): IntegrationTool[];
  abstract execute(action: string, args: Record<string, unknown>, credentials: Record<string, string>): Promise<unknown>;

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
          headers: {
            ...options.headers,
            ...this.getHeaders(credentials),
          },
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
