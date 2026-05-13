export type ClawLinkSideEffectLevel = "read" | "write" | "delete" | "admin";

export type ClawLinkConnectionState =
  | "not_connected"
  | "setup_started"
  | "healthy"
  | "stale_auth"
  | "permission_denied"
  | "degraded"
  | "error";

export type ClawLinkExecutionStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "blocked"
  | "cancelled";

export type ClawLinkErrorCode =
  | "unauthorized"
  | "forbidden"
  | "integration_not_found"
  | "action_not_found"
  | "integration_not_connected"
  | "reauth_required"
  | "validation_error"
  | "rate_limited"
  | "execution_failed"
  | "timeout"
  | "unsupported_operation"
  | "policy_blocked";

export interface ClawLinkDisplay {
  title: string;
  summary: string;
}

export interface ClawLinkIntegrationSummary {
  integration_id: string;
  name: string;
  slug: string;
  category?: string;
  summary?: string;
  connected: boolean;
  connection_state: ClawLinkConnectionState;
  capabilities: string[];
}

export interface ClawLinkActionSummary {
  action_id: string;
  title: string;
  description?: string;
  side_effect_level: ClawLinkSideEffectLevel;
  requires_confirmation?: boolean;
  idempotent?: boolean;
  supports_async?: boolean;
  input_summary?: {
    required?: string[];
    optional?: string[];
  };
  input_schema?: Record<string, unknown>;
  output_schema?: Record<string, unknown>;
  examples?: unknown[];
  tags?: string[];
}

export interface ClawLinkConnectionSummary {
  integration_id: string;
  connected: boolean;
  state: ClawLinkConnectionState;
  account_label?: string | null;
  last_checked_at?: string | null;
  can_execute?: boolean;
  needs_reauth?: boolean;
  health_reason?: string | null;
}

export interface ClawLinkExecutionSummary {
  execution_id: string | null;
  status: ClawLinkExecutionStatus;
  integration_id?: string;
  action_id?: string;
  started_at?: string;
  finished_at?: string;
  poll_after_ms?: number;
  output?: unknown;
  display?: ClawLinkDisplay;
  error_code?: ClawLinkErrorCode;
  message?: string;
  recommended_next_action?: {
    tool: string;
    input?: Record<string, unknown>;
  };
}

export interface ClawLinkErrorShape {
  status: "failed";
  error: {
    code: ClawLinkErrorCode;
    message: string;
    retryable: boolean;
    details?: Record<string, unknown>;
  };
}

export interface ClawLinkWhoAmIResponse {
  user_id: string;
  workspace_id: string;
  workspace_name: string;
  environment: string;
  region?: string;
  capabilities: {
    can_execute: boolean;
    can_begin_connection: boolean;
  };
}

export interface ClawLinkSearchInput {
  query: string;
  connected_only?: boolean;
  limit?: number;
}

export interface ClawLinkListIntegrationsInput {
  query?: string;
  category?: string;
  connected_only?: boolean;
  supports_action?: string;
  page?: number;
  page_size?: number;
}

export interface ClawLinkGetIntegrationInput {
  integration_id: string;
}

export interface ClawLinkListActionsInput {
  integration_id: string;
  intent?: string;
}

export interface ClawLinkGetActionInput {
  integration_id: string;
  action_id: string;
}

export interface ClawLinkGetConnectionInput {
  integration_id: string;
}

export interface ClawLinkBeginConnectionInput {
  integration_id: string;
  redirect_url?: string;
  channel?: string;
}

export interface ClawLinkExecuteInput {
  integration_id: string;
  action_id: string;
  input: Record<string, unknown>;
  idempotency_key?: string;
  confirm?: boolean;
}

export interface ClawLinkGetExecutionInput {
  execution_id: string;
}

export interface ClawLinkMcpToolDefinition<Input = unknown> {
  name:
    | "clawlink.whoami"
    | "clawlink.search"
    | "clawlink.list_integrations"
    | "clawlink.get_integration"
    | "clawlink.list_actions"
    | "clawlink.get_action"
    | "clawlink.get_connection"
    | "clawlink.begin_connection"
    | "clawlink.execute"
    | "clawlink.get_execution";
  description: string;
  input: Input;
}

export const CLAWLINK_MCP_V1_TOOLS: ClawLinkMcpToolDefinition[] = [
  {
    name: "clawlink.whoami",
    description: "Identify the current ClawLink user and workspace context.",
    input: {},
  },
  {
    name: "clawlink.search",
    description: "Search integrations and actions by intent or keyword.",
    input: { query: "salesforce create lead" },
  },
  {
    name: "clawlink.list_integrations",
    description: "List available integrations with optional filters.",
    input: { connected_only: false },
  },
  {
    name: "clawlink.get_integration",
    description: "Fetch metadata for one integration.",
    input: { integration_id: "salesforce" },
  },
  {
    name: "clawlink.list_actions",
    description: "List normalized actions for an integration.",
    input: { integration_id: "salesforce", intent: "create a new lead" },
  },
  {
    name: "clawlink.get_action",
    description: "Fetch full schema and guidance for one action.",
    input: { integration_id: "salesforce", action_id: "create_record" },
  },
  {
    name: "clawlink.get_connection",
    description: "Inspect connection health and readiness for an integration.",
    input: { integration_id: "salesforce" },
  },
  {
    name: "clawlink.begin_connection",
    description: "Start a user-mediated connection flow for an integration.",
    input: { integration_id: "salesforce" },
  },
  {
    name: "clawlink.execute",
    description: "Execute a normalized integration action.",
    input: {
      integration_id: "salesforce",
      action_id: "create_record",
      input: {
        object_type: "Lead",
        fields: {
          LastName: "Perera",
          Company: "Acme",
        },
      },
      confirm: true,
    },
  },
  {
    name: "clawlink.get_execution",
    description: "Fetch a previous or async execution result.",
    input: { execution_id: "exe_123" },
  },
];
