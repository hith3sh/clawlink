export type ToolMode = "read" | "write" | "destructive";
export type ToolRisk = "safe" | "confirm" | "high_impact";
export type ExecutionMode = "direct" | "preview" | "batch" | "flow_step";
export type ToolExecutionErrorType =
  | "validation"
  | "auth"
  | "reauth_required"
  | "missing_scopes"
  | "rate_limit"
  | "provider"
  | "network"
  | "unknown";

export interface NormalizedToolError {
  type: ToolExecutionErrorType;
  code?: string;
  message: string;
  retryable: boolean;
}

export interface ToolExecutionMeta {
  startedAt: string;
  endedAt: string;
  durationMs: number;
  requestId: string;
  providerRequestId?: string;
}

export interface ToolExecutionResult<T = unknown> {
  ok: boolean;
  toolName: string;
  integration: string;
  connectionId: number | null;
  mode: ExecutionMode;
  data?: T;
  error?: NormalizedToolError;
  meta: ToolExecutionMeta;
}

export function inferToolRisk(mode: ToolMode): ToolRisk {
  switch (mode) {
    case "read":
      return "safe";
    case "write":
      return "confirm";
    case "destructive":
      return "high_impact";
    default:
      return "confirm";
  }
}

export function requiresToolConfirmation(tool: {
  mode: ToolMode;
  risk?: ToolRisk;
}): boolean {
  const risk = tool.risk ?? inferToolRisk(tool.mode);
  return tool.mode === "destructive" || risk === "high_impact";
}
