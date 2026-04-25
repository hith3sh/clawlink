/**
 * Type definitions for ClawLink
 */

export interface User {
  id: string;
  clerkId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserIntegration {
  id: number;
  userId: string;
  integration: string;
  connectionLabel: string | null;
  accountLabel: string | null;
  externalAccountId: string | null;
  credentialsEncrypted: string;
  isDefault: boolean;
  authState: "active" | "needs_reauth";
  authError: string | null;
  lastUsedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  scopeSnapshot: string[] | null;
  capabilities: string[] | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestLog {
  id: number;
  userId: string;
  integration: string;
  action: string;
  success: boolean;
  latencyMs: number;
  errorMessage: string | null;
  requestBody: string | null;
  responseBody: string | null;
  createdAt: string;
}

export interface ApiKey {
  id: number;
  userId: string;
  keyHash: string;
  name: string;
  lastUsedAt: string | null;
  createdAt: string;
}

// Integration configuration from src/data/integrations.ts
export interface IntegrationConfig {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  color: string;
}

// MCP Protocol types
export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    credentials?: Record<string, string>;
  };
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface MCPTool {
  integration: string;
  name: string;
  description: string;
  inputSchema: object;
  outputSchema?: object;
  accessLevel: "read" | "write" | "destructive";
  mode: "read" | "write" | "destructive";
  risk: "safe" | "confirm" | "high_impact";
  tags: string[];
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: Array<{ user: string; args: Record<string, unknown> }>;
  followups: string[];
  requiresScopes: string[];
  idempotent: boolean;
  supportsDryRun: boolean;
  supportsBatch: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
}

export interface MCPToolsListResponse {
  tools: MCPTool[];
}
