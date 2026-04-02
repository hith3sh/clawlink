/**
 * Request logging to D1 database
 */

export interface LogEntry {
  userId: string;
  integration: string;
  action: string;
  success: boolean;
  latencyMs: number;
  errorMessage?: string;
  requestBody?: string;
  responseBody?: string;
}

/**
 * Log an API request to D1
 */
export async function logRequest(
  db: D1Database,
  entry: LogEntry
): Promise<void> {
  try {
    await db.prepare(`
      INSERT INTO request_logs (user_id, integration, action, success, latency_ms, error_message, request_body, response_body, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      entry.userId,
      entry.integration,
      entry.action,
      entry.success ? 1 : 0,
      entry.latencyMs,
      entry.errorMessage || null,
      entry.requestBody || null,
      entry.responseBody || null
    ).run();
  } catch (error) {
    console.error("Failed to log request:", error);
    // Don't throw - logging should never break the main flow
  }
}

/**
 * Get request logs for a user
 */
export async function getUserLogs(
  db: D1Database,
  userId: string,
  limit = 50,
  offset = 0
): Promise<LogEntry[]> {
  const result = await db.prepare(`
    SELECT user_id as userId, integration, action, success, latency_ms as latencyMs, 
           error_message as errorMessage, created_at
    FROM request_logs
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).bind(userId, limit, offset).all();

  return (result.results || []) as unknown as LogEntry[];
}

/**
 * Get logs for a specific integration
 */
export async function getIntegrationLogs(
  db: D1Database,
  userId: string,
  integration: string,
  limit = 50
): Promise<LogEntry[]> {
  const result = await db.prepare(`
    SELECT user_id as userId, integration, action, success, latency_ms as latencyMs, 
           error_message as errorMessage, created_at
    FROM request_logs
    WHERE user_id = ? AND integration = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(userId, integration, limit).all();

  return (result.results || []) as unknown as LogEntry[];
}

/**
 * Get usage stats for a user
 */
export async function getUserStats(
  db: D1Database,
  userId: string
): Promise<{
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  byIntegration: Record<string, number>;
}> {
  const totalResult = await db.prepare(`
    SELECT COUNT(*) as count FROM request_logs WHERE user_id = ?
  `).bind(userId).first<{ count: number }>();

  const successResult = await db.prepare(`
    SELECT COUNT(*) as count FROM request_logs WHERE user_id = ? AND success = 1
  `).bind(userId).first<{ count: number }>();

  const latencyResult = await db.prepare(`
    SELECT AVG(latency_ms) as avg FROM request_logs WHERE user_id = ?
  `).bind(userId).first<{ avg: number }>();

  const byIntegrationResult = await db.prepare(`
    SELECT integration, COUNT(*) as count 
    FROM request_logs 
    WHERE user_id = ? 
    GROUP BY integration
  `).bind(userId).all();

  const byIntegration: Record<string, number> = {};
  for (const row of byIntegrationResult.results as Array<{ integration: string; count: number }>) {
    byIntegration[row.integration] = row.count;
  }

  return {
    totalRequests: totalResult?.count || 0,
    successfulRequests: successResult?.count || 0,
    failedRequests: (totalResult?.count || 0) - (successResult?.count || 0),
    averageLatency: latencyResult?.avg || 0,
    byIntegration
  };
}