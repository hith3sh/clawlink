"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Inbox, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const integrationOptions = ["all", "gmail", "outlook", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actionOptions = ["all", "send_email", "send_message", "create_issue", "create_event", "list_events", "list_messages", "create_page", "list_contacts"];

interface LogEntry {
  id: string;
  integration: string;
  action: string;
  success: boolean;
  latencyMs: number;
  errorMessage: string | null;
  createdAt: string;
}

interface LogStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
}

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterIntegration !== "all") params.set("integration", filterIntegration);
      if (filterAction !== "all") params.set("action", filterAction);
      if (filterStatus !== "all") params.set("status", filterStatus);
      params.set("limit", "50");
      params.set("offset", "0");

      const response = await fetch(`/api/logs?${params.toString()}`);
      const data = (await response.json()) as {
        error?: string;
        logs?: LogEntry[];
        stats?: LogStats;
        total?: number;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch logs");
      }

      setLogs(data.logs ?? []);
      setStats(data.stats ?? null);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [search, filterIntegration, filterAction, filterStatus]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const successRate = useMemo(() => {
    if (!stats || stats.totalRequests === 0) return "-";
    return `${Math.round((stats.successfulRequests / stats.totalRequests) * 100)}%`;
  }, [stats]);

  const avgLatency = useMemo(() => {
    if (!stats || stats.totalRequests === 0) return "-";
    return `${stats.averageLatency}ms`;
  }, [stats]);

  function formatTimestamp(value: string): string {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function exportCsv() {
    const headers = ["Date", "Integration", "Action", "Status", "Latency (ms)", "Error"];
    const rows = logs.map((log) => [
      formatTimestamp(log.createdAt),
      log.integration,
      log.action,
      log.success ? "Success" : "Error",
      log.latencyMs.toString(),
      log.errorMessage ?? "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clawlink-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          View API request history for your workspace.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={logs.length === 0}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requests</p>
            {loading ? (
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-foreground">{stats?.totalRequests ?? 0}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Success rate</p>
            {loading ? (
              <div className="mt-2 h-8 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-foreground">{successRate}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Avg latency</p>
            {loading ? (
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-foreground">{avgLatency}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_140px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations, methods, or errors"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterIntegration} onValueChange={(value) => setFilterIntegration(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All integrations" />
          </SelectTrigger>
          <SelectContent>
            {integrationOptions.map((integration) => (
              <SelectItem key={integration} value={integration}>
                {integration === "all" ? "All integrations" : integration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterAction} onValueChange={(value) => setFilterAction(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            {actionOptions.map((action) => (
              <SelectItem key={action} value={action}>
                {action === "all" ? "All actions" : action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <Card>
          <CardContent className="flex min-h-32 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Loading logs...</p>
          </CardContent>
        </Card>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No usage events yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Connect an app and make your first request. Usage history will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Integration</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Latency</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground capitalize">
                        {log.integration}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {log.action}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            log.success
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {log.success ? "Success" : "Error"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{log.latencyMs}ms</td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground" title={log.errorMessage ?? undefined}>
                        {log.errorMessage ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 50 && (
              <div className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
                Showing 50 of {total} entries
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
