import "server-only";

import { getAdminAllowlists } from "@/lib/server/admin";
import { getDatabase, type D1LikeDatabase } from "@/lib/server/integration-store";

const DAY_MS = 24 * 60 * 60 * 1000;

export type ActivationRangeKey = "7d" | "30d" | "90d" | "all";

export interface ActivationRangeOption {
  key: ActivationRangeKey;
  label: string;
}

export interface ActivationRange {
  key: ActivationRangeKey;
  label: string;
  startAt: string | null;
  endAt: string;
  startDay: string | null;
  endDay: string;
}

export interface ActivationSummary {
  pairingSessionsCreated: number;
  pairingSessionsApproved: number;
  pairingSessionsCompleted: number;
  usersNewlyConnected: number;
  usersWithFirstExecution: number;
  usersWithFirstSuccessfulExecution: number;
  expiredSessions: number;
  totalExecutions: number;
  totalSuccessfulExecutions: number;
  totalFailedExecutions: number;
  conversionRates: {
    pairingApprovedFromCreated: number | null;
    pairingCompletedFromCreated: number | null;
    pairedUsersWithAnyIntegration: number | null;
    newlyConnectedUsersWhoExecuted: number | null;
    newlyConnectedUsersWhoSucceeded: number | null;
  };
}

export interface ActivationDailyPoint {
  day: string;
  pairingsCreated: number;
  pairingsCompleted: number;
  newlyConnectedUsers: number;
  firstSuccessfulUsers: number;
}

export interface IntegrationPerformanceRow {
  integration: string;
  uniqueConnectedUsers: number;
  uniqueActiveUsers: number;
  successfulExecutions: number;
  failedExecutions: number;
  catalogErrors: number;
  requestErrors: number;
  runtimeErrors: number;
  successRate: number | null;
  lastActivity: string | null;
}

export type ActivationFailureCategory = "catalog" | "request" | "runtime";

export interface ActivationErrorBreakdownRow {
  integration: string;
  errorType: string;
  errorCode: string;
  category: ActivationFailureCategory;
  count: number;
  lastSeenAt: string;
}

export interface ActivationFailureCategoryRow {
  category: ActivationFailureCategory;
  label: string;
  description: string;
  count: number;
}

export interface ActivationDashboardData {
  range: ActivationRange;
  includeAdminTraffic: boolean;
  summary: ActivationSummary;
  dailySeries: ActivationDailyPoint[];
  integrationPerformance: IntegrationPerformanceRow[];
  failureCategories: ActivationFailureCategoryRow[];
  errorBreakdown: ActivationErrorBreakdownRow[];
}

export const ACTIVATION_RANGE_OPTIONS: readonly ActivationRangeOption[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "all", label: "All time" },
] as const;

interface CountRow {
  count: number | string | null;
}

interface DayCountRow {
  day: string;
  count: number | string | null;
}

interface IntegrationPerformanceSqlRow {
  integration: string;
  unique_connected_users: number | string | null;
  unique_active_users: number | string | null;
  successful_executions: number | string | null;
  failed_executions: number | string | null;
  catalog_errors: number | string | null;
  request_errors: number | string | null;
  runtime_errors: number | string | null;
  last_activity: string | null;
}

interface ErrorBreakdownSqlRow {
  integration: string;
  error_type: string | null;
  error_code: string | null;
  category: ActivationFailureCategory;
  count: number | string | null;
  last_seen_at: string;
}

interface FailureCategorySqlRow {
  category: ActivationFailureCategory;
  count: number | string | null;
}

interface ActivationMetricsOptions {
  includeAdminTraffic: boolean;
}

interface AdminTrafficFilter {
  userPredicateSql: string;
  pairingPredicateSql: string;
  params: string[];
}

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function addUtcDays(value: Date, days: number): Date {
  return new Date(value.getTime() + days * DAY_MS);
}

function formatSqlDateTime(value: Date): string {
  return value.toISOString().slice(0, 19).replace("T", " ");
}

function formatDay(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return Number(value);
  }

  return 0;
}

function toRatio(numerator: number, denominator: number): number | null {
  if (denominator <= 0) {
    return null;
  }

  return numerator / denominator;
}

function getFailureCategorySql(errorTypeColumn: string, errorCodeColumn: string): string {
  return `
    CASE
      WHEN ${errorCodeColumn} = 'tool_not_found' THEN 'catalog'
      WHEN ${errorCodeColumn} IN ('invalid_arguments', 'confirmation_required')
        OR ${errorTypeColumn} = 'validation' THEN 'request'
      ELSE 'runtime'
    END
  `;
}

function getFailureCategoryLabel(category: ActivationFailureCategory): string {
  switch (category) {
    case "catalog":
      return "Catalog mismatch";
    case "request":
      return "Bad request";
    case "runtime":
      return "Runtime/provider";
  }
}

function getFailureCategoryDescription(category: ActivationFailureCategory): string {
  switch (category) {
    case "catalog":
      return "Tool name could not be resolved from the live registry.";
    case "request":
      return "The request never became a valid provider call because arguments or confirmation state were wrong.";
    case "runtime":
      return "The request reached runtime and failed on auth, scope, provider, rate-limit, or network behavior.";
  }
}

function buildAdminTrafficFilter(includeAdminTraffic: boolean): AdminTrafficFilter {
  if (includeAdminTraffic) {
    return {
      userPredicateSql: "1 = 1",
      pairingPredicateSql: "1 = 1",
      params: [],
    };
  }

  const { emailAllowlist, clerkIdAllowlist } = getAdminAllowlists();

  if (emailAllowlist.length === 0 && clerkIdAllowlist.length === 0) {
    return {
      userPredicateSql: "1 = 1",
      pairingPredicateSql: "1 = 1",
      params: [],
    };
  }

  const userChecks: string[] = [];
  const params: string[] = [];

  if (emailAllowlist.length > 0) {
    userChecks.push(`LOWER(admin_users.email) IN (${emailAllowlist.map(() => "?").join(", ")})`);
    params.push(...emailAllowlist);
  }

  if (clerkIdAllowlist.length > 0) {
    userChecks.push(`LOWER(admin_users.clerk_id) IN (${clerkIdAllowlist.map(() => "?").join(", ")})`);
    params.push(...clerkIdAllowlist);
  }

  const adminMatchSql = userChecks.join(" OR ");

  return {
    userPredicateSql: `
      NOT EXISTS (
        SELECT 1
        FROM users admin_users
        WHERE admin_users.id = user_id
          AND (${adminMatchSql})
      )
    `,
    pairingPredicateSql: `
      (
        approved_user_id IS NULL OR NOT EXISTS (
          SELECT 1
          FROM users admin_users
          WHERE admin_users.id = approved_user_id
            AND (${adminMatchSql})
        )
      )
    `,
    params,
  };
}

function buildRangeClause(column: string, range: ActivationRange): {
  sql: string;
  params: string[];
} {
  const clauses = [`${column} IS NOT NULL`];
  const params: string[] = [];

  if (range.startAt) {
    clauses.push(`${column} >= ?`);
    params.push(range.startAt);
  }

  clauses.push(`${column} < ?`);
  params.push(range.endAt);

  return {
    sql: clauses.join(" AND "),
    params,
  };
}

async function readCount(
  db: D1LikeDatabase,
  sql: string,
  params: Array<string | number> = [],
): Promise<number> {
  const row = await db.prepare(sql).bind(...params).first<CountRow>();
  return toNumber(row?.count);
}

async function readGroupedCounts(
  db: D1LikeDatabase,
  sql: string,
  params: Array<string | number> = [],
): Promise<Map<string, number>> {
  const result = await db.prepare(sql).bind(...params).all<DayCountRow>();
  const rows = result.results ?? [];

  return new Map(rows.map((row) => [row.day, toNumber(row.count)]));
}

function resolveRangeKey(rawRange: string | undefined): ActivationRangeKey {
  if (rawRange === "30d" || rawRange === "90d" || rawRange === "all") {
    return rawRange;
  }

  return "7d";
}

export function resolveActivationRange(rawRange: string | undefined): ActivationRange {
  const key = resolveRangeKey(rawRange);
  const endBoundary = addUtcDays(startOfUtcDay(new Date()), 1);
  const endAt = formatSqlDateTime(endBoundary);
  const endDay = formatDay(addUtcDays(endBoundary, -1));

  if (key === "all") {
    return {
      key,
      label: ACTIVATION_RANGE_OPTIONS.find((option) => option.key === key)?.label ?? "All time",
      startAt: null,
      endAt,
      startDay: null,
      endDay,
    };
  }

  const days = key === "30d" ? 30 : key === "90d" ? 90 : 7;
  const actualStartBoundary = addUtcDays(endBoundary, -days);

  return {
    key,
    label: ACTIVATION_RANGE_OPTIONS.find((option) => option.key === key)?.label ?? "Last 7 days",
    startAt: formatSqlDateTime(actualStartBoundary),
    endAt,
    startDay: formatDay(actualStartBoundary),
    endDay,
  };
}

async function resolveDailySeriesBounds(
  db: D1LikeDatabase,
  range: ActivationRange,
): Promise<{ startDay: string; endDay: string }> {
  if (range.startDay) {
    return { startDay: range.startDay, endDay: range.endDay };
  }

  const row = await db
    .prepare(
      `
        SELECT MIN(day) AS first_day
        FROM (
          SELECT MIN(date(created_at)) AS day
          FROM openclaw_pairing_sessions

          UNION ALL

          SELECT MIN(date(paired_at)) AS day
          FROM openclaw_pairing_sessions
          WHERE paired_at IS NOT NULL

          UNION ALL

          SELECT MIN(date(first_connected_at)) AS day
          FROM (
            SELECT MIN(created_at) AS first_connected_at
            FROM user_integrations
            GROUP BY user_id
          )

          UNION ALL

          SELECT MIN(date(first_success_at)) AS day
          FROM (
            SELECT MIN(created_at) AS first_success_at
            FROM tool_executions
            WHERE status = 'success'
            GROUP BY user_id
          )
        )
        WHERE day IS NOT NULL
      `,
    )
    .bind()
    .first<{ first_day: string | null }>();

  return {
    startDay: row?.first_day ?? range.endDay,
    endDay: range.endDay,
  };
}

async function getActivationSummary(
  db: D1LikeDatabase,
  range: ActivationRange,
  options: ActivationMetricsOptions,
): Promise<ActivationSummary> {
  const createdRange = buildRangeClause("created_at", range);
  const approvedRange = buildRangeClause("approved_at", range);
  const pairedRange = buildRangeClause("paired_at", range);
  const expiredRange = buildRangeClause("updated_at", range);
  const firstConnectedRange = buildRangeClause("first_connected_at", range);
  const firstExecutedRange = buildRangeClause("first_executed_at", range);
  const firstSuccessfulRange = buildRangeClause("first_success_at", range);
  const executionRange = buildRangeClause("created_at", range);
  const adminTrafficFilter = buildAdminTrafficFilter(options.includeAdminTraffic);

  const [
    pairingSessionsCreated,
    pairingSessionsApproved,
    pairingSessionsCompleted,
    expiredSessions,
    usersNewlyConnected,
    usersWithFirstExecution,
    usersWithFirstSuccessfulExecution,
    pairedUsers,
    pairedUsersWithAnyIntegration,
    newlyConnectedUsersWhoExecuted,
    newlyConnectedUsersWhoSucceeded,
    totalExecutions,
    totalSuccessfulExecutions,
    totalFailedExecutions,
  ] = await Promise.all([
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE ${createdRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}`,
      [...createdRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE ${approvedRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}`,
      [...approvedRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE ${pairedRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}`,
      [...pairedRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE status = 'expired'
         AND ${expiredRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}`,
      [...expiredRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_connected_at
         FROM user_integrations
         WHERE ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       )
       WHERE ${firstConnectedRange.sql}`,
      [...adminTrafficFilter.params, ...firstConnectedRange.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_executed_at
         FROM tool_executions
         WHERE ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       )
       WHERE ${firstExecutedRange.sql}`,
      [...adminTrafficFilter.params, ...firstExecutedRange.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_success_at
         FROM tool_executions
         WHERE status = 'success'
           AND ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       )
       WHERE ${firstSuccessfulRange.sql}`,
      [...adminTrafficFilter.params, ...firstSuccessfulRange.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT DISTINCT approved_user_id
         FROM openclaw_pairing_sessions
         WHERE approved_user_id IS NOT NULL
           AND ${pairedRange.sql}
           AND ${adminTrafficFilter.pairingPredicateSql}
       )`,
      [...pairedRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT DISTINCT approved_user_id AS user_id
         FROM openclaw_pairing_sessions
         WHERE approved_user_id IS NOT NULL
           AND ${pairedRange.sql}
           AND ${adminTrafficFilter.pairingPredicateSql}
       ) paired_users
       WHERE EXISTS (
         SELECT 1
         FROM user_integrations
         WHERE user_integrations.user_id = paired_users.user_id
           AND user_integrations.created_at < ?
       )`,
      [...pairedRange.params, ...adminTrafficFilter.params, range.endAt],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_connected_at
         FROM user_integrations
         WHERE ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       ) first_connected
       WHERE ${firstConnectedRange.sql}
         AND EXISTS (
           SELECT 1
           FROM tool_executions
           WHERE tool_executions.user_id = first_connected.user_id
             AND tool_executions.created_at >= first_connected.first_connected_at
             AND tool_executions.created_at < ?
         )`,
      [...adminTrafficFilter.params, ...firstConnectedRange.params, range.endAt],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_connected_at
         FROM user_integrations
         WHERE ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       ) first_connected
       WHERE ${firstConnectedRange.sql}
         AND EXISTS (
           SELECT 1
           FROM tool_executions
           WHERE tool_executions.user_id = first_connected.user_id
            AND tool_executions.status = 'success'
             AND tool_executions.created_at >= first_connected.first_connected_at
             AND tool_executions.created_at < ?
         )`,
      [...adminTrafficFilter.params, ...firstConnectedRange.params, range.endAt],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM tool_executions
       WHERE ${executionRange.sql}
         AND ${adminTrafficFilter.userPredicateSql}`,
      [...executionRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM tool_executions
       WHERE status = 'success'
         AND ${executionRange.sql}
         AND ${adminTrafficFilter.userPredicateSql}`,
      [...executionRange.params, ...adminTrafficFilter.params],
    ),
    readCount(
      db,
      `SELECT COUNT(*) AS count
       FROM tool_executions
       WHERE status = 'error'
         AND ${executionRange.sql}
         AND ${adminTrafficFilter.userPredicateSql}`,
      [...executionRange.params, ...adminTrafficFilter.params],
    ),
  ]);

  return {
    pairingSessionsCreated,
    pairingSessionsApproved,
    pairingSessionsCompleted,
    usersNewlyConnected,
    usersWithFirstExecution,
    usersWithFirstSuccessfulExecution,
    expiredSessions,
    totalExecutions,
    totalSuccessfulExecutions,
    totalFailedExecutions,
    conversionRates: {
      pairingApprovedFromCreated: toRatio(pairingSessionsApproved, pairingSessionsCreated),
      pairingCompletedFromCreated: toRatio(pairingSessionsCompleted, pairingSessionsCreated),
      pairedUsersWithAnyIntegration: toRatio(pairedUsersWithAnyIntegration, pairedUsers),
      newlyConnectedUsersWhoExecuted: toRatio(newlyConnectedUsersWhoExecuted, usersNewlyConnected),
      newlyConnectedUsersWhoSucceeded: toRatio(newlyConnectedUsersWhoSucceeded, usersNewlyConnected),
    },
  };
}

async function getActivationDailySeries(
  db: D1LikeDatabase,
  range: ActivationRange,
  options: ActivationMetricsOptions,
): Promise<ActivationDailyPoint[]> {
  const bounds = await resolveDailySeriesBounds(db, range);
  const createdRange = buildRangeClause("created_at", range);
  const pairedRange = buildRangeClause("paired_at", range);
  const firstConnectedRange = buildRangeClause("first_connected_at", range);
  const firstSuccessfulRange = buildRangeClause("first_success_at", range);
  const adminTrafficFilter = buildAdminTrafficFilter(options.includeAdminTraffic);

  const [createdByDay, pairedByDay, connectedByDay, succeededByDay] = await Promise.all([
    readGroupedCounts(
      db,
      `SELECT date(created_at) AS day, COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE ${createdRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}
       GROUP BY date(created_at)`,
      [...createdRange.params, ...adminTrafficFilter.params],
    ),
    readGroupedCounts(
      db,
      `SELECT date(paired_at) AS day, COUNT(*) AS count
       FROM openclaw_pairing_sessions
       WHERE ${pairedRange.sql}
         AND ${adminTrafficFilter.pairingPredicateSql}
       GROUP BY date(paired_at)`,
      [...pairedRange.params, ...adminTrafficFilter.params],
    ),
    readGroupedCounts(
      db,
      `SELECT date(first_connected_at) AS day, COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_connected_at
         FROM user_integrations
         WHERE ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       )
       WHERE ${firstConnectedRange.sql}
       GROUP BY date(first_connected_at)`,
      [...adminTrafficFilter.params, ...firstConnectedRange.params],
    ),
    readGroupedCounts(
      db,
      `SELECT date(first_success_at) AS day, COUNT(*) AS count
       FROM (
         SELECT user_id, MIN(created_at) AS first_success_at
         FROM tool_executions
         WHERE status = 'success'
           AND ${adminTrafficFilter.userPredicateSql}
         GROUP BY user_id
       )
       WHERE ${firstSuccessfulRange.sql}
       GROUP BY date(first_success_at)`,
      [...adminTrafficFilter.params, ...firstSuccessfulRange.params],
    ),
  ]);

  const points: ActivationDailyPoint[] = [];
  const end = new Date(`${bounds.endDay}T00:00:00.000Z`);

  for (
    let cursor = new Date(`${bounds.startDay}T00:00:00.000Z`);
    cursor.getTime() <= end.getTime();
    cursor = addUtcDays(cursor, 1)
  ) {
    const day = formatDay(cursor);
    points.push({
      day,
      pairingsCreated: createdByDay.get(day) ?? 0,
      pairingsCompleted: pairedByDay.get(day) ?? 0,
      newlyConnectedUsers: connectedByDay.get(day) ?? 0,
      firstSuccessfulUsers: succeededByDay.get(day) ?? 0,
    });
  }

  return points;
}

async function getIntegrationPerformance(
  db: D1LikeDatabase,
  range: ActivationRange,
  options: ActivationMetricsOptions,
): Promise<IntegrationPerformanceRow[]> {
  const connectionRange = buildRangeClause("created_at", range);
  const executionRange = buildRangeClause("created_at", range);
  const adminTrafficFilter = buildAdminTrafficFilter(options.includeAdminTraffic);
  const failureCategorySql = getFailureCategorySql("error_type", "error_code");
  const result = await db
    .prepare(
      `
        WITH connections AS (
          SELECT
            integration,
            COUNT(DISTINCT user_id) AS unique_connected_users,
            MAX(created_at) AS last_connected_at
          FROM user_integrations
          WHERE ${connectionRange.sql}
            AND ${adminTrafficFilter.userPredicateSql}
          GROUP BY integration
        ),
        activity AS (
          SELECT
            integration,
            COUNT(DISTINCT user_id) AS unique_active_users,
            SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS successful_executions,
            SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) AS failed_executions,
            SUM(CASE WHEN status = 'error' AND ${failureCategorySql} = 'catalog' THEN 1 ELSE 0 END) AS catalog_errors,
            SUM(CASE WHEN status = 'error' AND ${failureCategorySql} = 'request' THEN 1 ELSE 0 END) AS request_errors,
            SUM(CASE WHEN status = 'error' AND ${failureCategorySql} = 'runtime' THEN 1 ELSE 0 END) AS runtime_errors,
            MAX(created_at) AS last_activity
          FROM tool_executions
          WHERE ${executionRange.sql}
            AND ${adminTrafficFilter.userPredicateSql}
          GROUP BY integration
        ),
        integration_keys AS (
          SELECT integration FROM connections
          UNION
          SELECT integration FROM activity
        )
        SELECT
          integration_keys.integration AS integration,
          COALESCE(connections.unique_connected_users, 0) AS unique_connected_users,
          COALESCE(activity.unique_active_users, 0) AS unique_active_users,
          COALESCE(activity.successful_executions, 0) AS successful_executions,
          COALESCE(activity.failed_executions, 0) AS failed_executions,
          COALESCE(activity.catalog_errors, 0) AS catalog_errors,
          COALESCE(activity.request_errors, 0) AS request_errors,
          COALESCE(activity.runtime_errors, 0) AS runtime_errors,
          COALESCE(activity.last_activity, connections.last_connected_at) AS last_activity
        FROM integration_keys
        LEFT JOIN connections ON connections.integration = integration_keys.integration
        LEFT JOIN activity ON activity.integration = integration_keys.integration
      `,
    )
    .bind(
      ...connectionRange.params,
      ...adminTrafficFilter.params,
      ...executionRange.params,
      ...adminTrafficFilter.params,
    )
    .all<IntegrationPerformanceSqlRow>();

  return (result.results ?? [])
    .map((row) => {
      const successfulExecutions = toNumber(row.successful_executions);
      const failedExecutions = toNumber(row.failed_executions);
      const totalExecutions = successfulExecutions + failedExecutions;

      return {
        integration: row.integration,
        uniqueConnectedUsers: toNumber(row.unique_connected_users),
        uniqueActiveUsers: toNumber(row.unique_active_users),
        successfulExecutions,
        failedExecutions,
        catalogErrors: toNumber(row.catalog_errors),
        requestErrors: toNumber(row.request_errors),
        runtimeErrors: toNumber(row.runtime_errors),
        successRate: totalExecutions > 0 ? successfulExecutions / totalExecutions : null,
        lastActivity: row.last_activity,
      };
    })
    .sort((left, right) => {
      const activeDelta = right.uniqueActiveUsers - left.uniqueActiveUsers;
      if (activeDelta !== 0) {
        return activeDelta;
      }

      const executionDelta =
        right.successfulExecutions +
        right.failedExecutions -
        (left.successfulExecutions + left.failedExecutions);
      if (executionDelta !== 0) {
        return executionDelta;
      }

      return left.integration.localeCompare(right.integration);
    });
}

async function getActivationErrorBreakdown(
  db: D1LikeDatabase,
  range: ActivationRange,
  options: ActivationMetricsOptions,
): Promise<ActivationErrorBreakdownRow[]> {
  const errorRange = buildRangeClause("created_at", range);
  const adminTrafficFilter = buildAdminTrafficFilter(options.includeAdminTraffic);
  const failureCategorySql = getFailureCategorySql("error_type", "error_code");
  const result = await db
    .prepare(
      `
        SELECT
          integration,
          error_type,
          error_code,
          ${failureCategorySql} AS category,
          COUNT(*) AS count,
          MAX(created_at) AS last_seen_at
        FROM tool_executions
        WHERE status = 'error'
          AND ${errorRange.sql}
          AND ${adminTrafficFilter.userPredicateSql}
        GROUP BY integration, error_type, error_code, category
        ORDER BY count DESC, last_seen_at DESC
        LIMIT 25
      `,
    )
    .bind(...errorRange.params, ...adminTrafficFilter.params)
    .all<ErrorBreakdownSqlRow>();

  return (result.results ?? []).map((row) => ({
    integration: row.integration,
    errorType: row.error_type ?? "unknown",
    errorCode: row.error_code ?? "unknown",
    category: row.category,
    count: toNumber(row.count),
    lastSeenAt: row.last_seen_at,
  }));
}

async function getFailureCategories(
  db: D1LikeDatabase,
  range: ActivationRange,
  options: ActivationMetricsOptions,
): Promise<ActivationFailureCategoryRow[]> {
  const errorRange = buildRangeClause("created_at", range);
  const adminTrafficFilter = buildAdminTrafficFilter(options.includeAdminTraffic);
  const failureCategorySql = getFailureCategorySql("error_type", "error_code");
  const result = await db
    .prepare(
      `
        SELECT
          ${failureCategorySql} AS category,
          COUNT(*) AS count
        FROM tool_executions
        WHERE status = 'error'
          AND ${errorRange.sql}
          AND ${adminTrafficFilter.userPredicateSql}
        GROUP BY category
      `,
    )
    .bind(...errorRange.params, ...adminTrafficFilter.params)
    .all<FailureCategorySqlRow>();

  const counts = new Map(
    (result.results ?? []).map((row) => [row.category, toNumber(row.count)]),
  );

  return (["catalog", "request", "runtime"] as const).map((category) => ({
    category,
    label: getFailureCategoryLabel(category),
    description: getFailureCategoryDescription(category),
    count: counts.get(category) ?? 0,
  }));
}

export async function getActivationDashboardData(
  rawRange: string | undefined,
  options: ActivationMetricsOptions,
): Promise<ActivationDashboardData> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const range = resolveActivationRange(rawRange);
  const [summary, dailySeries, integrationPerformance, failureCategories, errorBreakdown] =
    await Promise.all([
      getActivationSummary(db, range, options),
      getActivationDailySeries(db, range, options),
      getIntegrationPerformance(db, range, options),
      getFailureCategories(db, range, options),
      getActivationErrorBreakdown(db, range, options),
    ]);

  return {
    range,
    includeAdminTraffic: options.includeAdminTraffic,
    summary,
    dailySeries,
    integrationPerformance,
    failureCategories,
    errorBreakdown,
  };
}
