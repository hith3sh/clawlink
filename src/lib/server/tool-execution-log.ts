import "server-only";

import type { D1LikeDatabase } from "@/lib/server/integration-store";
import type { ExecutionMode, NormalizedToolError } from "@/lib/runtime/tool-runtime";

export interface ToolExecutionLogEntry {
  id: string;
  userId: string;
  flowId?: string | null;
  stepId?: string | null;
  integration: string;
  toolName: string;
  connectionId: number | null;
  executionMode: ExecutionMode;
  status: "success" | "error";
  error?: NormalizedToolError | null;
  requestJson: string;
  responseJson?: string | null;
  latencyMs: number;
  providerRequestId?: string | null;
}

export async function logToolExecution(
  db: D1LikeDatabase,
  entry: ToolExecutionLogEntry,
): Promise<void> {
  try {
    await db
      .prepare(
        `
          INSERT INTO tool_executions (
            id,
            user_id,
            flow_id,
            step_id,
            integration,
            tool_name,
            connection_id,
            execution_mode,
            status,
            error_type,
            error_code,
            request_json,
            response_json,
            latency_ms,
            provider_request_id,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `,
      )
      .bind(
        entry.id,
        entry.userId,
        entry.flowId ?? null,
        entry.stepId ?? null,
        entry.integration,
        entry.toolName,
        entry.connectionId,
        entry.executionMode,
        entry.status,
        entry.error?.type ?? null,
        entry.error?.code ?? null,
        entry.requestJson,
        entry.responseJson ?? null,
        entry.latencyMs,
        entry.providerRequestId ?? null,
      )
      .run();
  } catch (error) {
    console.error("Failed to log tool execution:", error);
  }
}
