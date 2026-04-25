"use client";

import Link from "next/link";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Key,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";

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

interface SessionRecord {
  id: string;
  token: string;
  displayCode: string;
  integration: string;
  connectionId?: number | null;
  status: "awaiting_user_action" | "connected" | "failed" | "expired";
  flowType: string;
  errorMessage: string | null;
  expiresAt: string;
  completedAt: string | null;
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
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [disconnecting, setDisconnecting] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [copyingLink, setCopyingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const connectUrl = useMemo(() => {
    if (!activeSession || !origin) {
      return null;
    }

    return `${origin}/connect/${integration.slug}?session=${encodeURIComponent(activeSession.token)}`;
  }, [activeSession, integration.slug, origin]);
  const needsReauth = connection?.authState === "needs_reauth";

  useEffect(() => {
    let active = true;

    async function loadIntegration() {
      try {
        const response = await fetch(`/api/integrations/${integration.slug}`, { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          connection?: ConnectionRecord | null;
          connections?: ConnectionRecord[];
          connectionCount?: number;
          activeSession?: SessionRecord | null;
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
        setActiveSession(data.activeSession ?? null);
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
    }

    loadIntegration();

    return () => {
      active = false;
    };
  }, [integration.slug]);

  useEffect(() => {
    if (!activeSession || activeSession.status !== "awaiting_user_action") {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/connect/sessions/${activeSession.token}`, { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        session?: SessionRecord;
        connection?: ConnectionRecord | null;
      };

      if (!data.session) {
        return;
      }

      setActiveSession(data.session);

      if (data.connection) {
        setConnection(data.connection);
      }

      if (data.session.status === "connected") {
        setSuccess(`${integration.name} is connected and ready in OpenClaw.`);
        setConnectionCount((current) => Math.max(1, current + 1));
      }

      if (data.session.status === "expired") {
        setError("The current connection session expired. Start a new one when you are ready.");
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeSession, integration.name]);

  async function handleStartConnection() {
    setError(null);
    setSuccess(null);
    setStartingSession(true);

    try {
      const response = await fetch("/api/connect/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integration: integration.slug }),
      });

      const data = (await response.json()) as {
        error?: string;
        sessionId?: string;
        sessionToken?: string;
        displayCode?: string;
        integration?: string;
        status?: SessionRecord["status"];
        expiresAt?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create connection session");
      }

      setActiveSession({
        id: data.sessionId ?? crypto.randomUUID(),
        token: data.sessionToken ?? "",
        displayCode: data.displayCode ?? "",
        integration: data.integration ?? integration.slug,
        status: data.status ?? "awaiting_user_action",
        flowType: integration.setupMode,
        errorMessage: null,
        expiresAt: data.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSuccess(`Connection session created for ${integration.name}. Open the hosted link on any device.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create connection session");
    } finally {
      setStartingSession(false);
    }
  }

  async function handleCopyLink() {
    if (!connectUrl) {
      return;
    }

    await navigator.clipboard.writeText(connectUrl);
    setCopyingLink(true);
    window.setTimeout(() => setCopyingLink(false), 1500);
  }

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
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
              <h3 className="text-sm font-medium text-foreground">Hosted setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a short-lived link for this connection.
              </p>
            </div>

            {integration.dashboardStatus !== "available" ? (
              <p className="text-sm text-muted-foreground">
                Hosted setup is not implemented yet for {integration.name}.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleStartConnection} disabled={startingSession}>
                    {startingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    {needsReauth
                      ? "Create reconnect link"
                      : activeSession && activeSession.status === "awaiting_user_action"
                        ? "Refresh session"
                        : "Create setup link"}
                  </Button>

                  {connectUrl ? (
                    <>
                      <Button variant="outline" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                        {copyingLink ? "Copied" : "Copy link"}
                      </Button>
                      <a
                        href={connectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: "outline" })}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </a>
                    </>
                  ) : null}
                </div>

                {activeSession ? (
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Session code</p>
                        <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                          {activeSession.displayCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="mt-1 text-sm capitalize text-foreground">
                          {activeSession.status.replaceAll("_", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expires</p>
                        <p className="mt-1 text-sm text-foreground">
                          {formatTimestamp(activeSession.expiresAt)}
                        </p>
                      </div>
                    </div>

                    {connectUrl ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Setup URL</p>
                        <code className="mt-1 block overflow-x-auto whitespace-nowrap text-xs text-muted-foreground">
                          {connectUrl}
                        </code>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Available tools</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {integration.runtimeStatus === "live"
                ? "These tools are active in the runtime. Writes now require explicit confirmation before execution."
                : "These tools are planned for a future release."}
            </p>
          </div>

          {tools.length > 0 ? (
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
                    {integration.slug}_{tool.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tools defined for this integration yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
