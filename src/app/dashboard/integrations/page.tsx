"use client";

import { createElement, useDeferredValue, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { useOAuthConnect } from "@/components/dashboard/useOAuthConnect";
import { useDashboardConnections } from "@/components/dashboard/DashboardConnectionsProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { getConnectionStatus } from "@/lib/connection-status";
import { getIntegrationIcon } from "@/lib/integration-icons";
import type { IntegrationConnectionSummary } from "@/lib/server/integration-store";

interface ConnectionRow {
  connection: IntegrationConnectionSummary;
  integration: Integration;
  needsReconnect: boolean;
}

function OAuthConnectButton({
  integration,
  onConnected,
  label = "Connect",
  icon,
}: {
  integration: Integration;
  onConnected: () => void;
  label?: string;
  icon?: React.ReactNode;
}) {
  const { start, starting } = useOAuthConnect(integration, onConnected);

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full px-4 text-sm font-medium shadow-none"
      onClick={() => start()}
      disabled={starting}
    >
      {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
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
  const { connections, connectionsBySlug, loading, refetch } = useDashboardConnections();
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [removingConnectionId, setRemovingConnectionId] = useState<number | null>(null);
  const [expandedConnectionId, setExpandedConnectionId] = useState<number | null>(null);
  const [toolsVisibleFor, setToolsVisibleFor] = useState<Set<number>>(new Set());

  const deferredAddSearch = useDeferredValue(addSearch);

  const connectionRows = useMemo<ConnectionRow[]>(() => {
    return connections
      .map((connection) => {
        const integration = integrations.find((item) => item.slug === connection.integration);

        if (!integration) {
          return null;
        }

        const status = getConnectionStatus(connection.authState, connection.expiresAt);

        return {
          connection,
          integration,
          needsReconnect: status === "needs_reauth" || status === "expired",
        };
      })
      .filter((row): row is ConnectionRow => row !== null);
  }, [connections]);

  const connectionCountsBySlug = useMemo(() => {
    const counts = new Map<string, number>();

    for (const [slug, conns] of connectionsBySlug) {
      counts.set(slug, conns.length);
    }

    return counts;
  }, [connectionsBySlug]);

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

      await refetch();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to remove connection");
    } finally {
      setRemovingConnectionId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Manage your connected apps. Reconnect any that need attention or remove the ones you no longer use.
            </p>
          </div>

          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Add connection
          </Button>
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
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : connectionRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground">No connections yet</h2>
                  <p className="text-sm text-muted-foreground">
                    Connect your first app to start using ClawLink from OpenClaw.
                  </p>
                </div>
                <Button onClick={() => setSheetOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add connection
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-black/6">
                {connectionRows.map((row) => {
                  const isExpanded = expandedConnectionId === row.connection.id;

                  return (
                    <div key={row.connection.id}>
                      <button
                        type="button"
                        className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-black/[0.015] sm:flex-nowrap"
                        onClick={() =>
                          setExpandedConnectionId(isExpanded ? null : row.connection.id)
                        }
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.03]">
                            <IntegrationMark integration={row.integration} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{row.integration.name}</p>
                            {row.connection.isDefault ? (
                              <p className="text-xs text-muted-foreground">Default</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {row.needsReconnect ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Needs reconnect
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Connected
                            </span>
                          )}

                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`flex flex-wrap items-center justify-end gap-2 px-6 pb-4 sm:flex-nowrap ${
                          isExpanded ? "" : "sr-only"
                        }`}
                      >
                        <OAuthConnectButton
                          integration={row.integration}
                          onConnected={() => void refetch()}
                          label="Reconnect"
                          icon={<RefreshCw className="h-3.5 w-3.5" />}
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleRemoveConnection(row);
                          }}
                          disabled={removingConnectionId === row.connection.id}
                          title={`Remove ${row.integration.name}`}
                        >
                          {removingConnectionId === row.connection.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          )}
                          Remove
                        </Button>
                      </div>

                      {isExpanded && row.integration.tools.length > 0 && (
                        <div className="border-t border-black/6">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-black/[0.015]"
                            onClick={() =>
                              setToolsVisibleFor((prev) => {
                                const next = new Set(prev);
                                if (next.has(row.connection.id)) {
                                  next.delete(row.connection.id);
                                } else {
                                  next.add(row.connection.id);
                                }
                                return next;
                              })
                            }
                          >
                            {toolsVisibleFor.has(row.connection.id) ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                            Available actions ({row.integration.tools.length})
                          </button>

                          {toolsVisibleFor.has(row.connection.id) && (
                            <div className="bg-black/[0.015] px-6 pb-4">
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {row.integration.tools.map((tool) => (
                                  <div
                                    key={tool.name}
                                    className="rounded-xl border border-black/6 bg-white px-3 py-2 text-sm text-foreground"
                                  >
                                    {tool.description}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-full border-l-black/10 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-black/8 px-6 py-5">
            <SheetTitle>Add connection</SheetTitle>
            <SheetDescription>
              Choose an app and start a new hosted connection flow.
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
                    ) : integration.setupMode === "oauth" || integration.setupMode === "pipedream" ? (
                      <OAuthConnectButton
                        integration={integration}
                        onConnected={() => {
                          setSheetOpen(false);
                          void refetch();
                        }}
                      />
                    ) : (
                      <span className="shrink-0 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        Hosted flow pending
                      </span>
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
