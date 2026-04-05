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
  name: string;
  description: string;
  inputSchema: object;
}

export interface MCPToolsListResponse {
  tools: MCPTool[];
}
