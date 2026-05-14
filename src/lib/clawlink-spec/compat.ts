import "server-only";

import type {
  ClawLinkActionSummary,
  ClawLinkConnectionState,
  ClawLinkExecutionSummary,
} from "@/lib/clawlink-spec/mcp-types";
import type { ToolExecutionPayload } from "@/lib/server/executor";
import type {
  ToolCatalogItem,
  ToolConnectionSummary,
  ToolDescription,
  ToolListItem,
} from "@/lib/server/tool-registry";

function toConnectionState(
  connection:
    | Pick<ToolConnectionSummary, "authState" | "authError" | "expiresAt">
    | null
    | undefined,
): ClawLinkConnectionState {
  if (!connection) {
    return "not_connected";
  }

  switch (connection.authState) {
    case "active":
      return connection.authError ? "degraded" : "healthy";
    case "needs_reauth":
      return "stale_auth";
    default:
      return "degraded";
  }
}

function inferActionId(name: string, integration: string): string {
  return name.startsWith(`${integration}_`) ? name.slice(integration.length + 1) : name;
}

function inferSideEffectLevel(tool: Pick<ToolListItem | ToolCatalogItem, "mode" | "risk" | "name">): ClawLinkActionSummary["side_effect_level"] {
  const loweredName = tool.name.toLowerCase();

  if (
    tool.mode === "destructive" ||
    (tool.risk === "high_impact" &&
      (loweredName.includes("delete") || loweredName.includes("remove") || loweredName.includes("archive")))
  ) {
    return "delete";
  }

  if (tool.risk === "high_impact" && loweredName.includes("admin")) {
    return "admin";
  }

  if (tool.mode === "write") {
    return "write";
  }

  return "read";
}

export function toCanonicalActionSummary(
  tool: ToolListItem | ToolCatalogItem | ToolDescription,
): ClawLinkActionSummary {
  const required =
    typeof tool.inputSchema?.required === "object" && Array.isArray(tool.inputSchema.required)
      ? tool.inputSchema.required.filter((item): item is string => typeof item === "string")
      : undefined;

  const properties =
    tool.inputSchema && typeof tool.inputSchema.properties === "object" && tool.inputSchema.properties
      ? Object.keys(tool.inputSchema.properties as Record<string, unknown>)
      : [];

  return {
    action_id: inferActionId(tool.name, tool.integration),
    title: tool.name,
    description: tool.description,
    side_effect_level: inferSideEffectLevel(tool),
    requires_confirmation: tool.requiresConfirmation,
    idempotent: "idempotent" in tool ? Boolean(tool.idempotent) : false,
    supports_async: false,
    input_summary: {
      required,
      optional: properties.filter((property) => !required?.includes(property)),
    },
    input_schema: tool.inputSchema,
    output_schema: "outputSchema" in tool ? tool.outputSchema : undefined,
    examples: "examples" in tool ? tool.examples : undefined,
    tags: "tags" in tool ? tool.tags : undefined,
  };
}

export function toCompatibilityTool(tool: ToolListItem | ToolCatalogItem | ToolDescription) {
  return {
    ...tool,
    canonical: {
      integration_id: tool.integration,
      action: toCanonicalActionSummary(tool),
      default_connection_state: toConnectionState(
        "connections" in tool
          ? tool.connections.find((connection) => connection.isDefault) ?? tool.connections[0] ?? null
          : tool.defaultConnectionId
            ? { authState: "active", authError: null, expiresAt: null }
            : null,
      ),
    },
  };
}

function mapExecutionErrorCode(payload: ToolExecutionPayload): ClawLinkExecutionSummary["error_code"] {
  switch (payload.error?.code) {
    case "needs_connection":
      return "integration_not_connected";
    case "needs_reauth":
      return "reauth_required";
    case "confirmation_required":
    case "ambiguous_connection":
      return "policy_blocked";
    case "tool_not_found":
    case "not_found":
      return "action_not_found";
    case "provider_unavailable":
      return "unsupported_operation";
    default:
      break;
  }

  switch (payload.error?.type) {
    case "validation":
      return "validation_error";
    case "auth":
    case "reauth_required":
      return "unauthorized";
    case "missing_scopes":
      return "forbidden";
    case "rate_limit":
      return "rate_limited";
    case "network":
    case "provider":
    case "unknown":
      return "execution_failed";
    default:
      return undefined;
  }
}

export function toCanonicalExecutionSummary(payload: ToolExecutionPayload): ClawLinkExecutionSummary {
  if (!payload.ok) {
    const blockedCodes = new Set([
      "needs_connection",
      "needs_reauth",
      "needs_scope_upgrade",
      "confirmation_required",
      "ambiguous_connection",
    ]);
    const blocked = blockedCodes.has(payload.error?.code ?? "");

    return {
      execution_id: blocked ? null : payload.meta.requestId,
      status: blocked ? "blocked" : "failed",
      integration_id: payload.integration,
      action_id: inferActionId(payload.toolName, payload.integration),
      started_at: payload.meta.startedAt,
      finished_at: payload.meta.endedAt,
      display: {
        title: blocked ? "Execution blocked" : "Execution failed",
        summary: payload.error?.message ?? "Tool execution failed.",
      },
      error_code: mapExecutionErrorCode(payload),
      message: payload.error?.message,
      recommended_next_action:
        payload.error?.code === "needs_connection"
          ? {
              tool: "clawlink.begin_connection",
              input: { integration_id: payload.integration },
            }
          : undefined,
    };
  }

  return {
    execution_id: payload.meta.requestId,
    status: "succeeded",
    integration_id: payload.integration,
    action_id: inferActionId(payload.toolName, payload.integration),
    started_at: payload.meta.startedAt,
    finished_at: payload.meta.endedAt,
    output: payload.data ?? payload.result,
    display: {
      title: `${payload.toolName} succeeded`,
      summary: `Executed ${payload.toolName} successfully.`,
    },
  };
}
