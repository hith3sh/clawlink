import { NextResponse } from "next/server";

import { getDatabase, getUserForCurrentIdentity } from "@/lib/server/integration-store";

export const dynamic = "force-dynamic";

interface ToolExecutionRow {
  id: string;
  integration: string;
  tool_name: string;
  status: "success" | "error";
  error_type: string | null;
  error_code: string | null;
  latency_ms: number;
  created_at: string;
}

export async function GET(request: Request) {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const integration = url.searchParams.get("integration") || undefined;
  const action = url.searchParams.get("action") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  const whereClauses = ["user_id = ?"];
  const params: (string | number)[] = [user.id];

  if (integration && integration !== "all") {
    whereClauses.push("integration = ?");
    params.push(integration);
  }

  if (action && action !== "all") {
    whereClauses.push("tool_name = ?");
    params.push(action);
  }

  if (status === "success") {
    whereClauses.push("status = 'success'");
  } else if (status === "error") {
    whereClauses.push("status = 'error'");
  }

  if (search) {
    whereClauses.push("(integration LIKE ? OR tool_name LIKE ? OR error_type LIKE ? OR error_code LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = whereClauses.join(" AND ");

  try {
    const [logsResult, countResult] = await Promise.all([
      db
        .prepare(
          `SELECT id, integration, tool_name, status, error_type, error_code, latency_ms, created_at
           FROM tool_executions
           WHERE ${where}
           ORDER BY created_at DESC
           LIMIT ? OFFSET ?`,
        )
        .bind(...params, limit, offset)
        .all<ToolExecutionRow>(),
      db
        .prepare(
          `SELECT COUNT(*) as count FROM tool_executions WHERE ${where}`,
        )
        .bind(...params)
        .first<{ count: number }>(),
    ]);

    const statsResult = await db
      .prepare(
        `SELECT
           COUNT(*) as totalRequests,
           SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successfulRequests,
           AVG(latency_ms) as averageLatency
         FROM tool_executions
         WHERE user_id = ?`,
      )
      .bind(user.id)
      .first<{ totalRequests: number; successfulRequests: number; averageLatency: number }>();

    return NextResponse.json({
      logs: (logsResult.results || []).map((row) => ({
        id: row.id,
        integration: row.integration,
        action: row.tool_name,
        success: row.status === "success",
        latencyMs: row.latency_ms,
        errorMessage: row.error_code ?? row.error_type ?? null,
        createdAt: row.created_at,
      })),
      total: countResult?.count || 0,
      stats: {
        totalRequests: statsResult?.totalRequests || 0,
        successfulRequests: statsResult?.successfulRequests || 0,
        failedRequests: (statsResult?.totalRequests || 0) - (statsResult?.successfulRequests || 0),
        averageLatency: Math.round(statsResult?.averageLatency || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
