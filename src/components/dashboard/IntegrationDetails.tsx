"use client";

import Link from "next/link";
import { createElement, useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";
import { useOAuthConnect } from "@/components/dashboard/useOAuthConnect";
import { useDashboardConnections } from "@/components/dashboard/DashboardConnectionsProvider";

interface ConnectionRecord {
  id: number;
  integration: string;
  accountLabel?: string | null;
  connectionLabel?: string | null;
  isDefault?: boolean;
  authState: "active" | "needs_reauth";
  authError: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ToolRecord {
  name: string;
  description: string;
  mode: "read" | "write" | "destructive";
  risk: "safe" | "confirm" | "high_impact";
  requiresConfirmation: boolean;
  policyReason?: string;
  previewAvailable: boolean;
}

interface Props {
  integration: Integration;
}

function formatTimestamp(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function IntegrationDetails({ integration }: Props) {
  const [connection, setConnection] = useState<ConnectionRecord | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [disconnecting, setDisconnecting] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const needsReauth = connection?.authState === "needs_reauth";
  const hostedConnectEnabled =
    integration.dashboardStatus === "available" &&
    (
      integration.setupMode === "oauth" ||
      integration.setupMode === "pipedream" ||
      integration.setupMode === "composio"
    );

  const { refetch: refetchDashboard } = useDashboardConnections();

  const loadIntegration = useCallback(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch(`/api/integrations/${integration.slug}`, { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          connection?: ConnectionRecord | null;
          connections?: ConnectionRecord[];
          connectionCount?: number;
          tools?: ToolRecord[];
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(data.error ?? "Failed to load integration");
          return;
        }

        setConnection(data.connection ?? null);
        setConnectionCount(data.connectionCount ?? data.connections?.length ?? (data.connection ? 1 : 0));
        setTools(data.tools ?? []);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load integration");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [integration.slug]);

  useEffect(() => loadIntegration(), [loadIntegration]);

  const { start: startReconnect, starting: reconnecting } = useOAuthConnect(
    integration,
    () => {
      setSuccess(`${integration.name} reconnected successfully.`);
      loadIntegration();
      void refetchDashboard();
    },
  );

  async function handleDisconnect() {
    setError(null);
    setSuccess(null);
    setDisconnecting(true);

    try {
      const response = await fetch(`/api/integrations/${integration.slug}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to disconnect integration");
      }

      setConnection(null);
      setConnectionCount(0);
      setSuccess(`${integration.name} has been disconnected.`);
      void refetchDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to disconnect integration");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/integrations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to connections
      </Link>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              {hasBrandLogo(integration.slug) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getBrandLogoSrc(integration.slug)}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 object-contain"
                />
              ) : (
                createElement(getIntegrationIcon(integration.icon), {
                  className: "h-10 w-10",
                  style: { color: integration.color },
                })
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground">{integration.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{integration.description}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{integration.setupGuide}</p>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-100 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-emerald-800 dark:text-emerald-100">{success}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Connection status</h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : connection ? (
              <div className="space-y-4">
                <div className={`flex items-center gap-2 text-sm ${needsReauth ? "text-red-600" : "text-emerald-400"}`}>
                  {needsReauth ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {needsReauth
                    ? "Reconnect required"
                    : connectionCount > 1
                      ? `${connectionCount} connections`
                      : "Connected"}
                </div>

                <dl className="space-y-2 text-sm">
                  {connection?.accountLabel ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Default account</dt>
                      <dd className="text-right text-foreground">{connection.accountLabel}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Connected</dt>
                    <dd className="text-foreground">{formatTimestamp(connection.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd className="text-foreground">{formatTimestamp(connection.updatedAt) ?? "Never"}</dd>
                  </div>
                  {connection.expiresAt ? (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Expires</dt>
                      <dd className="text-foreground">{formatTimestamp(connection.expiresAt)}</dd>
                    </div>
                  ) : null}
                </dl>

                {needsReauth ? (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                    {connection.authError ?? `Reconnect ${integration.name} to refresh its credentials.`}
                  </div>
                ) : null}

                {connectionCount > 1 ? (
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                    Multiple {integration.name} connections exist. Remove specific rows from the Connections page.
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                  >
                    {disconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Disconnect
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCcw className="h-4 w-4" />
                  Not connected
                </div>
                <p className="text-sm text-muted-foreground">
                  Start a hosted connection session and finish setup on any device.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Reconnect</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {needsReauth
                  ? `${integration.name} needs new credentials. Reconnect to restore access.`
                  : `Refresh or replace the ${integration.name} connection.`}
              </p>
            </div>

            {!hostedConnectEnabled ? (
              <p className="text-sm text-muted-foreground">
                Hosted provider auth is not available yet for {integration.name}.
              </p>
            ) : (
              <Button onClick={() => startReconnect()} disabled={reconnecting}>
                {reconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                Reconnect
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <button
            type="button"
            className="flex w-full items-center gap-2 text-left"
            onClick={() => setToolsVisible((v) => !v)}
          >
            {toolsVisible ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <h3 className="text-sm font-medium text-foreground">Available tools</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {integration.runtimeStatus === "live"
                  ? "These tools are active in the runtime. Writes now require explicit confirmation before execution."
                  : "These tools are planned for a future release."}
              </p>
            </div>
          </button>

          {toolsVisible && (
            tools.length > 0 ? (
              <div className="space-y-2">
                {tools.map((tool) => (
                  <div key={tool.name} className="rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-sm text-foreground">
                        {tool.name}
                      </p>
                      <Badge variant="outline">{tool.mode}</Badge>
                      <Badge variant={tool.risk === "high_impact" ? "destructive" : tool.risk === "confirm" ? "secondary" : "outline"}>
                        {tool.risk === "high_impact" ? "high impact" : tool.risk}
                      </Badge>
                      {tool.requiresConfirmation ? (
                        <Badge variant="secondary">confirmation required</Badge>
                      ) : null}
                      {tool.previewAvailable ? (
                        <Badge variant="outline">preview available</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    {tool.requiresConfirmation ? (
                      <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/8 p-3 text-sm text-amber-900 dark:text-amber-100">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                        <div className="space-y-1">
                          <p className="font-medium">Explicit confirmation required</p>
                          <p className="text-amber-800/80 dark:text-amber-100/80">
                            {tool.policyReason ?? "This tool writes data to an external service, so ClawLink will block direct execution until it is confirmed."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-3 text-sm text-emerald-900 dark:text-emerald-100">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <div>
                          <p className="font-medium">Runs without confirmation</p>
                          <p className="text-emerald-800/80 dark:text-emerald-100/80">
                            This tool is read-only or low-risk enough to execute directly.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : integration.tools.length > 0 ? (
              <div className="space-y-2">
                {integration.tools.map((tool) => (
                  <div key={tool.name} className="rounded-lg border border-border p-3">
                    <p className="font-mono text-sm text-foreground">
                      {tool.name.startsWith(`${integration.slug}_`)
                        ? tool.name
                        : `${integration.slug}_${tool.name}`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tools defined for this integration yet.
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
