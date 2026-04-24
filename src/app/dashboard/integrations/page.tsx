"use client";

import Link from "next/link";
import { createElement, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Check, Copy, Loader2, Plus, Search, Trash2 } from "lucide-react";

import { useOAuthConnect } from "@/components/dashboard/useOAuthConnect";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { integrations, type Integration } from "@/data/integrations";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";
import { getConnectionStatus, type ConnectionStatus } from "@/lib/connection-status";
import { getIntegrationIcon } from "@/lib/integration-icons";

interface ConnectionRecord {
  id: number;
  integration: string;
  connectionLabel: string | null;
  accountLabel: string | null;
  isDefault: boolean;
  authState: "active" | "needs_reauth";
  authError: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ConnectionRow {
  connection: ConnectionRecord;
  integration: Integration;
  accountLabel: string;
  methodLabel: string;
  status: ConnectionStatus;
  connectionCode: string;
}

function formatConnectionTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMethodLabel(integration: Integration): string {
  if (integration.setupMode === "oauth") {
    return "OAuth 2";
  }

  if (integration.credentialFields.some((field) => field.label.toLowerCase().includes("api key"))) {
    return "API Key";
  }

  if (integration.credentialFields.length > 1) {
    return "Basic";
  }

  if (integration.credentialFields.some((field) => field.label.toLowerCase().includes("token"))) {
    return "Token";
  }

  return "Manual";
}

function getStatusBadgeClasses(status: ConnectionStatus): string {
  if (status === "needs_reauth") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "expired") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "expiring") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getStatusLabel(status: ConnectionStatus): string {
  if (status === "needs_reauth") {
    return "Reconnect";
  }

  if (status === "expired") {
    return "Expired";
  }

  if (status === "expiring") {
    return "Expiring";
  }

  return "Active";
}

function OAuthConnectButton({
  integration,
  onConnected,
}: {
  integration: Integration;
  onConnected: () => void;
}) {
  const { start, starting } = useOAuthConnect(integration, onConnected);

  return (
    <Button
      variant="outline"
      className="rounded-full px-4"
      onClick={() => start()}
      disabled={starting}
    >
      {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Connect
    </Button>
  );
}

function IntegrationMark({ integration }: { integration: Integration }) {
  if (hasBrandLogo(integration.slug)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getBrandLogoSrc(integration.slug)}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 object-contain"
      />
    );
  }

  return createElement(getIntegrationIcon(integration.icon), {
    className: "h-5 w-5",
    style: { color: integration.color },
  });
}

export default function IntegrationsPage() {
  const { user, isLoaded } = useUser();
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [removingConnectionId, setRemovingConnectionId] = useState<number | null>(null);
  const [copiedConnectionId, setCopiedConnectionId] = useState<number | null>(null);

  const deferredAddSearch = useDeferredValue(addSearch);

  const loadConnections = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        integrations?: ConnectionRecord[];
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load connections");
      }

      setConnections(data.integrations ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load connections");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  const connectionRows = useMemo<ConnectionRow[]>(() => {
    return connections
      .map((connection) => {
        const integration = integrations.find((item) => item.slug === connection.integration);

        if (!integration) {
          return null;
        }

        return {
          connection,
          integration,
          accountLabel:
            connection.accountLabel ??
            connection.connectionLabel ??
            (integration.setupMode === "oauth" ? "Connected account" : "Manual credentials"),
          methodLabel: getMethodLabel(integration),
          status: getConnectionStatus(connection.authState, connection.expiresAt),
          connectionCode: `conn_${connection.id.toString().padStart(6, "0")}`,
        };
      })
      .filter((row): row is ConnectionRow => row !== null);
  }, [connections]);

  const filteredConnections = useMemo(() => {
    return connectionRows.filter((row) => {
      return statusFilter === "all" || row.status === statusFilter;
    });
  }, [connectionRows, statusFilter]);

  const connectionCountsBySlug = useMemo(() => {
    const counts = new Map<string, number>();

    for (const row of connectionRows) {
      counts.set(row.integration.slug, (counts.get(row.integration.slug) ?? 0) + 1);
    }

    return counts;
  }, [connectionRows]);

  const availableIntegrations = useMemo(() => {
    const query = deferredAddSearch.trim().toLowerCase();

    return integrations
      .filter((integration) => {
        if (!query) {
          return true;
        }

        return (
          integration.name.toLowerCase().includes(query) ||
          integration.description.toLowerCase().includes(query) ||
          integration.category.toLowerCase().includes(query)
        );
      })
      .sort((left, right) => {
        if (left.dashboardStatus !== right.dashboardStatus) {
          return left.dashboardStatus === "available" ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
      });
  }, [deferredAddSearch]);

  async function handleRemoveConnection(row: ConnectionRow) {
    const confirmed = window.confirm(`Remove the ${row.integration.name} connection?`);

    if (!confirmed) {
      return;
    }

    setRemovingConnectionId(row.connection.id);
    setError(null);

    try {
      const response = await fetch(`/api/connections/${row.connection.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to remove connection");
      }

      setConnections((current) =>
        current.filter((connection) => connection.id !== row.connection.id),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to remove connection");
    } finally {
      setRemovingConnectionId(null);
    }
  }

  async function handleCopyConnectionId(row: ConnectionRow) {
    await navigator.clipboard.writeText(row.connectionCode);
    setCopiedConnectionId(row.connection.id);
    window.setTimeout(() => setCopiedConnectionId(null), 1500);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Review active app connections and remove access when you no longer need it.
            </p>
          </div>

          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Add connection
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="needs_reauth">Needs reconnect</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        ) : null}

        <Card className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 px-6 py-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredConnections.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground">No connections found</h2>
                  <p className="text-sm text-muted-foreground">
                    {connectionRows.length === 0
                      ? "Connect your first app to start using ClawLink from OpenClaw."
                      : "Try a different filter or add another app connection."}
                  </p>
                </div>
                <Button onClick={() => setSheetOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add connection
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <table className="min-w-full table-fixed border-collapse">
                    <thead className="bg-black/[0.03] text-left text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4">App</th>
                        <th className="px-6 py-4">Account</th>
                        <th className="px-6 py-4">Connection ID</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="w-[88px] px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConnections.map((row) => (
                        <tr key={row.connection.id} className="border-t border-black/6">
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03]">
                                <IntegrationMark integration={row.integration} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{row.integration.name}</p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-xs text-muted-foreground">
                                    {row.integration.category}
                                  </p>
                                  {row.connection.isDefault ? (
                                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
                                      Default
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{row.accountLabel}</p>
                            {row.connection.authState === "needs_reauth" && row.connection.authError ? (
                              <p className="mt-1 text-xs text-red-600">{row.connection.authError}</p>
                            ) : null}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-foreground">{row.connectionCode}</span>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => void handleCopyConnectionId(row)}
                                title="Copy connection ID"
                              >
                                {copiedConnectionId === row.connection.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{row.methodLabel}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeClasses(row.status)}`}
                            >
                              <span className="h-2 w-2 rounded-full bg-current" />
                              {getStatusLabel(row.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatConnectionTimestamp(row.connection.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => void handleRemoveConnection(row)}
                              disabled={removingConnectionId === row.connection.id}
                              title={`Remove ${row.integration.name}`}
                            >
                              {removingConnectionId === row.connection.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 p-4 md:hidden">
                  {filteredConnections.map((row) => (
                    <div
                      key={row.connection.id}
                      className="rounded-3xl border border-black/8 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03]">
                            <IntegrationMark integration={row.integration} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{row.integration.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{row.accountLabel}</p>
                            {row.connection.authState === "needs_reauth" && row.connection.authError ? (
                              <p className="mt-1 text-xs text-red-600">{row.connection.authError}</p>
                            ) : null}
                            {row.connection.isDefault ? (
                              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
                                Default connection
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeClasses(row.status)}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {getStatusLabel(row.status)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Connection ID</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-xs text-foreground">{row.connectionCode}</span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => void handleCopyConnectionId(row)}
                              title="Copy connection ID"
                            >
                              {copiedConnectionId === row.connection.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Method</p>
                          <p className="mt-1 text-foreground">{row.methodLabel}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Created</p>
                          <p className="mt-1 text-foreground">
                            {formatConnectionTimestamp(row.connection.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void handleRemoveConnection(row)}
                          disabled={removingConnectionId === row.connection.id}
                        >
                          {removingConnectionId === row.connection.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-full border-l-black/10 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-black/8 px-6 py-5">
            <SheetTitle>Add connection</SheetTitle>
            <SheetDescription>
              Choose an app and start a new hosted or manual connection flow.
            </SheetDescription>
          </SheetHeader>

          <div className="flex h-full flex-col overflow-hidden px-6 pb-6">
            <div className="py-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={addSearch}
                  onChange={(event) => setAddSearch(event.target.value)}
                  placeholder={`Search ${integrations.length} apps...`}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-8">
              {availableIntegrations.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-black/10 bg-black/[0.02] px-5 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">No matching apps found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try a broader search term.</p>
                </div>
              ) : (
                availableIntegrations.map((integration) => (
                  <div
                    key={integration.slug}
                    className="flex items-center justify-between gap-4 rounded-[24px] border border-black/8 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/[0.03]">
                        <IntegrationMark integration={integration} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{integration.name}</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                        {(connectionCountsBySlug.get(integration.slug) ?? 0) > 0 ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {connectionCountsBySlug.get(integration.slug)} connected
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {integration.dashboardStatus === "coming-soon" ? (
                      <span className="shrink-0 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    ) : integration.setupMode === "oauth" ? (
                      <OAuthConnectButton
                        integration={integration}
                        onConnected={() => {
                          setSheetOpen(false);
                          void loadConnections();
                        }}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={`/dashboard/integrations/${integration.slug}`} />}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
