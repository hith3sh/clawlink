import Link from "next/link";
import { CircleCheck, Link2, PlugZap, RefreshCw, ShieldAlert, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACTIVATION_RANGE_OPTIONS,
  getActivationDashboardData,
  type ActivationDailyPoint,
  type ActivationErrorBreakdownRow,
  type ActivationFailureCategoryRow,
  type ActivationRangeKey,
  type IntegrationPerformanceRow,
} from "@/lib/server/admin-activation-metrics";
import { requireAdminAccess } from "@/lib/server/admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SortDirection = "asc" | "desc";
type IntegrationSortKey =
  | "integration"
  | "connected"
  | "active"
  | "success"
  | "failed"
  | "rate"
  | "recent";
type ErrorSortKey = "integration" | "type" | "code" | "count" | "recent";
type AudienceFilter = "external" | "all";

function readSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function readSortDirection(value: string | undefined, fallback: SortDirection): SortDirection {
  return value === "asc" || value === "desc" ? value : fallback;
}

function readAudienceFilter(value: string | undefined): AudienceFilter {
  return value === "all" ? "all" : "external";
}

function readIntegrationSortKey(value: string | undefined): IntegrationSortKey {
  switch (value) {
    case "integration":
    case "connected":
    case "active":
    case "success":
    case "failed":
    case "rate":
    case "recent":
      return value;
    default:
      return "active";
  }
}

function readErrorSortKey(value: string | undefined): ErrorSortKey {
  switch (value) {
    case "integration":
    case "type":
    case "code":
    case "recent":
      return value;
    default:
      return "count";
  }
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "Not enough data";
  }

  return `${Math.round(value * 100)}%`;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "No activity";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDayLabel(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function getAudienceLabel(value: AudienceFilter): string {
  return value === "all" ? "All traffic" : "Customer traffic";
}

function createDashboardHref(
  currentParams: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(currentParams)) {
    const single = readSingleParam(value);
    if (single) {
      search.set(key, single);
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (!value) {
      search.delete(key);
      continue;
    }
    search.set(key, value);
  }

  const query = search.toString();
  return query ? `/dashboard/admin?${query}` : "/dashboard/admin";
}

function sortIntegrationRows(
  rows: IntegrationPerformanceRow[],
  key: IntegrationSortKey,
  direction: SortDirection,
): IntegrationPerformanceRow[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...rows].sort((left, right) => {
    let comparison = 0;

    switch (key) {
      case "integration":
        comparison = left.integration.localeCompare(right.integration);
        break;
      case "connected":
        comparison = left.uniqueConnectedUsers - right.uniqueConnectedUsers;
        break;
      case "active":
        comparison = left.uniqueActiveUsers - right.uniqueActiveUsers;
        break;
      case "success":
        comparison = left.successfulExecutions - right.successfulExecutions;
        break;
      case "failed":
        comparison = left.failedExecutions - right.failedExecutions;
        break;
      case "rate":
        comparison = (left.successRate ?? -1) - (right.successRate ?? -1);
        break;
      case "recent":
        comparison =
          new Date(left.lastActivity ?? 0).getTime() -
          new Date(right.lastActivity ?? 0).getTime();
        break;
    }

    if (comparison !== 0) {
      return comparison * multiplier;
    }

    return left.integration.localeCompare(right.integration);
  });
}

function sortErrorRows(
  rows: ActivationErrorBreakdownRow[],
  key: ErrorSortKey,
  direction: SortDirection,
): ActivationErrorBreakdownRow[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...rows].sort((left, right) => {
    let comparison = 0;

    switch (key) {
      case "integration":
        comparison = left.integration.localeCompare(right.integration);
        break;
      case "type":
        comparison = left.errorType.localeCompare(right.errorType);
        break;
      case "code":
        comparison = left.errorCode.localeCompare(right.errorCode);
        break;
      case "recent":
        comparison = new Date(left.lastSeenAt).getTime() - new Date(right.lastSeenAt).getTime();
        break;
      case "count":
        comparison = left.count - right.count;
        break;
    }

    if (comparison !== 0) {
      return comparison * multiplier;
    }

    return left.integration.localeCompare(right.integration);
  });
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof Link2;
}) {
  return (
    <Card className="border border-border/60 bg-card/90">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{label}</CardDescription>
          <div className="rounded-full border border-border/60 bg-muted/40 p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <CardTitle className="text-3xl">{formatCount(value)}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ConversionTile({
  label,
  value,
  description,
}: {
  label: string;
  value: number | null;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{formatPercent(value)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ActivationTrendChart({ points }: { points: ActivationDailyPoint[] }) {
  if (points.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/50 text-sm text-muted-foreground">
        No daily data in this range yet.
      </div>
    );
  }

  const width = 860;
  const height = 260;
  const paddingX = 24;
  const paddingTop = 18;
  const paddingBottom = 34;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingTop - paddingBottom;

  const series = [
    { key: "pairingsCreated", label: "Pairings created", color: "#7dd3fc" },
    { key: "pairingsCompleted", label: "Pairings completed", color: "#86efac" },
    { key: "newlyConnectedUsers", label: "Users newly connected", color: "#f9a8d4" },
    { key: "firstSuccessfulUsers", label: "Users with first success", color: "#fcd34d" },
  ] as const;

  const maxValue = Math.max(
    1,
    ...points.flatMap((point) =>
      series.map((entry) => point[entry.key]),
    ),
  );

  function buildPath(values: number[]): string {
    if (values.length === 1) {
      const x = width / 2;
      const y = paddingTop + usableHeight - (values[0] / maxValue) * usableHeight;
      return `M ${x} ${y} L ${x} ${y}`;
    }

    return values
      .map((value, index) => {
        const x = paddingX + (index / (values.length - 1)) * usableWidth;
        const y = paddingTop + usableHeight - (value / maxValue) * usableHeight;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }

  const tickIndexes = Array.from(
    new Set([0, Math.floor(points.length / 3), Math.floor((points.length * 2) / 3), points.length - 1]),
  ).filter((value) => value >= 0 && value < points.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {series.map((entry) => (
          <div key={entry.key} className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-background/40 p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[260px] min-w-[720px] w-full"
          role="img"
          aria-label="Daily activation trend chart"
        >
          <line
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingTop + usableHeight}
            y2={paddingTop + usableHeight}
            stroke="currentColor"
            strokeOpacity="0.18"
          />

          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + usableHeight - usableHeight * ratio;
            return (
              <line
                key={ratio}
                x1={paddingX}
                x2={width - paddingX}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
              />
            );
          })}

          {tickIndexes.map((index) => {
            const x =
              points.length === 1
                ? width / 2
                : paddingX + (index / (points.length - 1)) * usableWidth;
            return (
              <g key={`${points[index].day}-${index}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={paddingTop + usableHeight}
                  y2={paddingTop + usableHeight + 6}
                  stroke="currentColor"
                  strokeOpacity="0.18"
                />
                <text
                  x={x}
                  y={height - 6}
                  fill="currentColor"
                  opacity="0.72"
                  textAnchor="middle"
                  fontSize="11"
                >
                  {formatDayLabel(points[index].day)}
                </text>
              </g>
            );
          })}

          <text
            x={width - paddingX}
            y={paddingTop - 4}
            textAnchor="end"
            fill="currentColor"
            opacity="0.72"
            fontSize="11"
          >
            Peak day: {formatCount(maxValue)}
          </text>

          {series.map((entry) => (
            <path
              key={entry.key}
              d={buildPath(points.map((point) => point[entry.key]))}
              fill="none"
              stroke={entry.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  href,
  active,
  direction,
  align = "left",
}: {
  label: string;
  href: string;
  active: boolean;
  direction: SortDirection;
  align?: "left" | "right";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 transition hover:text-foreground",
        align === "right" ? "justify-end" : "justify-start",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-75">{active ? (direction === "asc" ? "▲" : "▼") : "↕"}</span>
    </Link>
  );
}

function IntegrationPerformanceTableView({
  rows,
  currentParams,
  sortKey,
  sortDirection,
}: {
  rows: IntegrationPerformanceRow[];
  currentParams: Record<string, string | string[] | undefined>;
  sortKey: IntegrationSortKey;
  sortDirection: SortDirection;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/50 px-6 text-center text-sm text-muted-foreground">
        No connections or tool activity landed in this range yet.
      </div>
    );
  }

  function hrefFor(nextKey: IntegrationSortKey): string {
    const nextDirection =
      nextKey === sortKey ? (sortDirection === "desc" ? "asc" : "desc") : "desc";

    return createDashboardHref(currentParams, {
      integrationSort: nextKey,
      integrationOrder: nextDirection,
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className="px-4 py-3 text-left font-medium">
              <SortableHeader
                label="Integration"
                href={hrefFor("integration")}
                active={sortKey === "integration"}
                direction={sortDirection}
              />
            </th>
            <th className="px-4 py-3 text-right font-medium">
              <SortableHeader
                label="Connected users"
                href={hrefFor("connected")}
                active={sortKey === "connected"}
                direction={sortDirection}
                align="right"
              />
            </th>
            <th className="px-4 py-3 text-right font-medium">
              <SortableHeader
                label="Active users"
                href={hrefFor("active")}
                active={sortKey === "active"}
                direction={sortDirection}
                align="right"
              />
            </th>
            <th className="px-4 py-3 text-right font-medium">
              <SortableHeader
                label="Success"
                href={hrefFor("success")}
                active={sortKey === "success"}
                direction={sortDirection}
                align="right"
              />
            </th>
            <th className="px-4 py-3 text-right font-medium">
              <SortableHeader
                label="Failed"
                href={hrefFor("failed")}
                active={sortKey === "failed"}
                direction={sortDirection}
                align="right"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Failure mix</th>
            <th className="px-4 py-3 text-right font-medium">
              <SortableHeader
                label="Success rate"
                href={hrefFor("rate")}
                active={sortKey === "rate"}
                direction={sortDirection}
                align="right"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium">
              <SortableHeader
                label="Last activity"
                href={hrefFor("recent")}
                active={sortKey === "recent"}
                direction={sortDirection}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.integration} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">{row.integration}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{formatCount(row.uniqueConnectedUsers)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{formatCount(row.uniqueActiveUsers)}</td>
              <td className="px-4 py-3 text-right text-emerald-400">{formatCount(row.successfulExecutions)}</td>
              <td className="px-4 py-3 text-right text-red-400">{formatCount(row.failedExecutions)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="rounded-full border-border/60 bg-background/50 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    catalog {formatCount(row.catalogErrors)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-border/60 bg-background/50 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    request {formatCount(row.requestErrors)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-border/60 bg-background/50 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    runtime {formatCount(row.runtimeErrors)}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground">{formatPercent(row.successRate)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(row.lastActivity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorBreakdownList({
  rows,
  currentParams,
  sortKey,
  sortDirection,
}: {
  rows: ActivationErrorBreakdownRow[];
  currentParams: Record<string, string | string[] | undefined>;
  sortKey: ErrorSortKey;
  sortDirection: SortDirection;
}) {
  function hrefFor(nextKey: ErrorSortKey): string {
    const nextDirection =
      nextKey === sortKey ? (sortDirection === "desc" ? "asc" : "desc") : "desc";

    return createDashboardHref(currentParams, {
      errorSort: nextKey,
      errorOrder: nextDirection,
    });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SortableHeader
          label="Count"
          href={hrefFor("count")}
          active={sortKey === "count"}
          direction={sortDirection}
        />
        <SortableHeader
          label="Recent"
          href={hrefFor("recent")}
          active={sortKey === "recent"}
          direction={sortDirection}
        />
        <SortableHeader
          label="Integration"
          href={hrefFor("integration")}
          active={sortKey === "integration"}
          direction={sortDirection}
        />
        <SortableHeader
          label="Type"
          href={hrefFor("type")}
          active={sortKey === "type"}
          direction={sortDirection}
        />
        <SortableHeader
          label="Code"
          href={hrefFor("code")}
          active={sortKey === "code"}
          direction={sortDirection}
        />
      </div>

      {rows.map((row) => (
        <div
          key={`${row.integration}:${row.errorType}:${row.errorCode}`}
          className="rounded-2xl border border-border/60 bg-background/40 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">{row.integration}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {row.errorType}
                </p>
                <Badge variant="outline" className="rounded-full border-border/60 bg-background/50 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {row.category}
                </Badge>
              </div>
            </div>
            <Badge variant="outline" className="rounded-full border-red-500/30 bg-red-500/8 text-red-300">
              {formatCount(row.count)}
            </Badge>
          </div>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p className="font-mono text-xs text-foreground/90">{row.errorCode}</p>
            <p>Last seen {formatDate(row.lastSeenAt)}</p>
          </div>
        </div>
      ))}
    </>
  );
}

function FailureCategoryTiles({ rows }: { rows: ActivationFailureCategoryRow[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.category} className="rounded-2xl border border-border/60 bg-background/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {row.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{formatCount(row.count)}</p>
            </div>
            <Badge variant="outline" className="rounded-full border-border/60 bg-background/60 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {row.category}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.description}</p>
        </div>
      ))}
    </div>
  );
}

export default async function ActivationAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminAccess();

  const params = await searchParams;
  const selectedRange = readSingleParam(params.range);
  const audienceFilter = readAudienceFilter(readSingleParam(params.audience));
  const integrationSortKey = readIntegrationSortKey(readSingleParam(params.integrationSort));
  const integrationSortDirection = readSortDirection(
    readSingleParam(params.integrationOrder),
    "desc",
  );
  const errorSortKey = readErrorSortKey(readSingleParam(params.errorSort));
  const errorSortDirection = readSortDirection(readSingleParam(params.errorOrder), "desc");
  const data = await getActivationDashboardData(selectedRange, {
    includeAdminTraffic: audienceFilter === "all",
  });
  const sortedIntegrationRows = sortIntegrationRows(
    data.integrationPerformance,
    integrationSortKey,
    integrationSortDirection,
  );
  const sortedErrorRows = sortErrorRows(
    data.errorBreakdown,
    errorSortKey,
    errorSortDirection,
  );

  const summaryCards = [
    {
      label: "Pairing sessions created",
      value: data.summary.pairingSessionsCreated,
      detail: `${formatCount(data.summary.expiredSessions)} expired in this range.`,
      icon: Link2,
    },
    {
      label: "Pairing sessions approved",
      value: data.summary.pairingSessionsApproved,
      detail: "Browser-side approval happened before local credential exchange.",
      icon: CircleCheck,
    },
    {
      label: "Pairing sessions completed",
      value: data.summary.pairingSessionsCompleted,
      detail: "Local device finished the pairing and stored a usable credential.",
      icon: PlugZap,
    },
    {
      label: "Users newly connected",
      value: data.summary.usersNewlyConnected,
      detail: "First-ever integration connection landed inside this selected period.",
      icon: RefreshCw,
    },
    {
      label: "Users with first execution",
      value: data.summary.usersWithFirstExecution,
      detail: "First tool execution happened in this selected period.",
      icon: TrendingUp,
    },
    {
      label: "Users with first successful execution",
      value: data.summary.usersWithFirstSuccessfulExecution,
      detail: "First successful tool run happened in this selected period.",
      icon: CircleCheck,
    },
  ] as const;

  const rangeHref = (key: ActivationRangeKey) =>
    createDashboardHref(params, { range: key });
  const audienceHref = (value: AudienceFilter) =>
    createDashboardHref(params, { audience: value });

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border/60 bg-card/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="rounded-full border-border/70 bg-background/50">
              Internal dashboard
            </Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                Activation funnel
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                This view uses only ClawLink&apos;s reliable first-party signals:
                pairing sessions, integration connections, and tool execution logs.
                It intentionally avoids ClawHub download attribution.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ACTIVATION_RANGE_OPTIONS.map((option) => (
              <Link
                key={option.key}
                href={rangeHref(option.key)}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-[min(var(--radius-md),12px)] border px-3 text-[0.8rem] font-medium transition-all",
                  data.range.key === option.key
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-background/70 text-foreground hover:bg-muted/90",
                )}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Counting rule
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pairing cards count session events inside the selected range.
              Connection, execution, and success cards count the first time a user reached that stage inside the range.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Conversion rule
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pairing conversion uses session counts. Post-pairing conversion uses user cohorts to avoid inflated percentages:
              paired users with any integration by period end, then newly connected users who executed or succeeded by period end.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Audience filter
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Customer traffic excludes admin-allowlisted users by default so internal probes do not distort activation metrics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["external", "all"] as const).map((value) => (
              <Link
                key={value}
                href={audienceHref(value)}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-[min(var(--radius-md),12px)] border px-3 text-[0.8rem] font-medium transition-all",
                  audienceFilter === value
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-background/70 text-foreground hover:bg-muted/90",
                )}
              >
                {getAudienceLabel(value)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            icon={card.icon}
          />
        ))}
      </section>

      <Card className="border border-border/60 bg-card/90">
        <CardHeader className="border-b border-border/50">
          <CardTitle>Derived conversion rates</CardTitle>
          <CardDescription>
            These ratios keep the funnel readable without pretending to solve download attribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-0 md:grid-cols-2 xl:grid-cols-5">
          <ConversionTile
            label="Created -> approved"
            value={data.summary.conversionRates.pairingApprovedFromCreated}
            description="Share of pairing sessions that reached browser approval."
          />
          <ConversionTile
            label="Created -> paired"
            value={data.summary.conversionRates.pairingCompletedFromCreated}
            description="Share of pairing sessions that completed the full device flow."
          />
          <ConversionTile
            label="Paired users -> connected"
            value={data.summary.conversionRates.pairedUsersWithAnyIntegration}
            description="Distinct paired users who had at least one integration by the end of the period."
          />
          <ConversionTile
            label="Newly connected -> executed"
            value={data.summary.conversionRates.newlyConnectedUsersWhoExecuted}
            description="Newly connected users who executed any tool by the end of the period."
          />
          <ConversionTile
            label="Newly connected -> succeeded"
            value={data.summary.conversionRates.newlyConnectedUsersWhoSucceeded}
            description="Newly connected users who reached a first successful execution by the end of the period."
          />
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card/90">
        <CardHeader className="border-b border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
              <CardTitle>Daily stage reach</CardTitle>
              <CardDescription>
                Daily time series for pairing starts, pairing completions, newly connected users, and first successful executions.
              </CardDescription>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
              <div>Audience: {getAudienceLabel(audienceFilter)}</div>
              <div>Total executions: {formatCount(data.summary.totalExecutions)}</div>
              <div>Successes: {formatCount(data.summary.totalSuccessfulExecutions)}</div>
              <div>Failures: {formatCount(data.summary.totalFailedExecutions)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ActivationTrendChart points={data.dailySeries} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <Card className="border border-border/60 bg-card/90">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Integration performance</CardTitle>
            <CardDescription>
              Compare new connection volume against actual tool usage and split failures into catalog, request, and runtime buckets.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <IntegrationPerformanceTableView
              rows={sortedIntegrationRows}
              currentParams={params}
              sortKey={integrationSortKey}
              sortDirection={integrationSortDirection}
            />
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/90">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Failure categories</CardTitle>
            <CardDescription>
              Separate stale-tool/catalog misses and bad-request noise from runtime/provider failures.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <FailureCategoryTiles rows={data.failureCategories} />
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/90">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Error breakdown</CardTitle>
            <CardDescription>
              Top recurring failures from `tool_executions` in this selected range, tagged by failure category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {data.errorBreakdown.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/50 px-6 text-center text-sm text-muted-foreground">
                No tool errors landed in this range.
              </div>
            ) : (
              <ErrorBreakdownList
                rows={sortedErrorRows}
                currentParams={params}
                sortKey={errorSortKey}
                sortDirection={errorSortDirection}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-amber-500/25 bg-amber-500/6">
        <CardContent className="flex gap-3 pt-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-sm leading-6 text-amber-50/90">
            This page is intentionally narrow. It answers where users drop off after pairing starts,
            but it does not infer unique plugin installs, ClawHub listing conversion, or marketing attribution.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
