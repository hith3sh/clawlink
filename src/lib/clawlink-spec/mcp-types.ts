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
    | "clawlink.connect_app"
    | "clawlink.begin_connection"
    | "clawlink.execute"
    | "clawlink.get_execution";
  title: string;
  description: string;
  input: Input;
}

export const CLAWLINK_MCP_V1_TOOLS: ClawLinkMcpToolDefinition[] = [
  {
    name: "clawlink.whoami",
    title: "Identify ClawLink Workspace",
    description: "Identify the current ClawLink user and workspace context before acting on third-party apps.",
    input: {},
  },
  {
    name: "clawlink.search",
    title: "Search ClawLink Apps And Actions",
    description:
      "Search integrations and actions by intent or keyword. Use this early for vague requests involving third-party apps like LinkedIn, Instagram, Gmail, Google Drive, or Google Calendar instead of defaulting to browser limitations.",
    input: { query: "connect my linkedin" },
  },
  {
    name: "clawlink.list_integrations",
    title: "List Connected And Available Integrations",
    description:
      "List available integrations with optional filters. At the start of a new session, use this to check whether the user already has a relevant app connected before saying you cannot access it.",
    input: { connected_only: false },
  },
  {
    name: "clawlink.get_integration",
    title: "Get Integration Metadata",
    description:
      "Fetch metadata for one integration, including what the app is for and whether ClawLink supports it.",
    input: { integration_id: "linkedin" },
  },
  {
    name: "clawlink.list_actions",
    title: "List Actions For One Integration",
    description:
      "List normalized actions for one integration after you know the user has it connected or available. Use this after checking connection state for apps like LinkedIn, Gmail, Drive, or Calendar.",
    input: { integration_id: "linkedin", intent: "read my profile" },
  },
  {
    name: "clawlink.get_action",
    title: "Describe One Action",
    description:
      "Fetch full schema and guidance for one action before execution, especially for writes or unfamiliar tools.",
    input: { integration_id: "linkedin", action_id: "get_my_info" },
  },
  {
    name: "clawlink.get_connection",
    title: "Check Connection Health",
    description:
      "Inspect connection health and readiness for an integration. If the user says 'connect my LinkedIn' or asks about Gmail, Drive, Calendar, or Instagram, use this to check whether the app is already connected before claiming it is unavailable.",
    input: { integration_id: "linkedin" },
  },
  {
    name: "clawlink.connect_app",
    title: "Connect An App Through ClawLink",
    description:
      "Start a user-mediated connection flow for an integration. Prefer this when the user says things like 'connect my LinkedIn', 'connect my Gmail', 'connect my Google Drive', 'connect my Google Calendar', or 'connect my Instagram'. This is the ClawLink-first way to connect third-party apps from chat.",
    input: { integration_id: "linkedin" },
  },
  {
    name: "clawlink.begin_connection",
    title: "Begin Connection Flow",
    description:
      "Alias of clawlink.connect_app. Start a user-mediated connection flow for an integration. Prefer clawlink.connect_app for fresh sessions and vague 'connect my X' requests because the name is more explicit.",
    input: { integration_id: "linkedin" },
  },
  {
    name: "clawlink.execute",
    title: "Execute Integration Action",
    description:
      "Execute a normalized integration action after you have confirmed the right integration, action, and connection state through ClawLink.",
    input: {
      integration_id: "linkedin",
      action_id: "get_my_info",
      input: {
        linked_in_identifier: "self",
      },
    },
  },
  {
    name: "clawlink.get_execution",
    title: "Get Execution Result",
    description: "Fetch a previous or async execution result.",
    input: { execution_id: "exe_123" },
  },
];
