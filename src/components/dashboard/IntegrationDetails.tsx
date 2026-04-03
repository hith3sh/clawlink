"use client";

import Link from "next/link";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiExternalLink,
  FiKey,
  FiLoader,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

import { Button, buttonVariants } from "@/components/ui/button";
import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";

interface ConnectionRecord {
  integration: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface SessionRecord {
  id: string;
  token: string;
  displayCode: string;
  integration: string;
  status: "awaiting_user_action" | "connected" | "failed" | "expired";
  flowType: string;
  errorMessage: string | null;
  expiresAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
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
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let active = true;

    async function loadIntegration() {
      try {
        const response = await fetch(`/api/integrations/${integration.slug}`, { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          connection?: ConnectionRecord | null;
          activeSession?: SessionRecord | null;
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(data.error ?? "Failed to load integration");
          return;
        }

        setConnection(data.connection ?? null);
        setActiveSession(data.activeSession ?? null);
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
      setSuccess(`${integration.name} has been disconnected.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to disconnect integration");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to connections
        </Link>
      </div>

      <section className="dashboard-panel p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-white/8 bg-black/10"
              style={{ boxShadow: `inset 0 0 0 1px ${integration.color}25` }}
            >
              {createElement(getIntegrationIcon(integration.icon), {
                className: "h-6 w-6",
                style: { color: integration.color },
              })}
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="dashboard-pill px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {integration.category}
                  </span>
                  <span className="dashboard-pill px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {integration.runtimeStatus === "live" ? "Worker live" : "Worker planned"}
                  </span>
                  <span className="dashboard-pill px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {integration.dashboardStatus === "available" ? "Hosted connect ready" : "Dashboard flow pending"}
                  </span>
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  {integration.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {integration.description}
                </p>
              </div>

              <div className="dashboard-panel-soft p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {integration.setupGuide}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-panel-soft p-5">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FiLoader className="h-4 w-4 animate-spin" />
                Checking connection status
              </div>
            ) : connection ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <FiCheckCircle className="h-4 w-4" />
                  Connected
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Connected</dt>
                    <dd className="text-foreground">{formatTimestamp(connection.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd className="text-foreground">{formatTimestamp(connection.updatedAt) ?? "Never"}</dd>
                  </div>
                  {connection.expiresAt ? (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Expires</dt>
                      <dd className="text-foreground">{formatTimestamp(connection.expiresAt)}</dd>
                    </div>
                  ) : null}
                </dl>

                <Button
                  variant="destructive"
                  className="w-full justify-center"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  {disconnecting ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FiRefreshCw className="h-4 w-4 text-muted-foreground" />
                  Not connected
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Start a hosted connection session and finish setup on any device.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[22px] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-red-100">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      ) : null}

      {success ? (
        <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.75fr)]">
        <section className="dashboard-panel p-6">
          <div className="mb-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Hosted setup
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Create a short-lived link for this connection.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The flow is designed for local installs and headless agents: OpenClaw can print the
              link, the user opens it anywhere, and ClawLink polls for completion.
            </p>
          </div>

          {integration.dashboardStatus !== "available" ? (
            <div className="dashboard-panel-soft p-5 text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">Hosted setup is not implemented yet.</p>
              <p className="mt-2">
                The session model is ready, but {integration.name} still needs its provider-specific
                connect flow.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleStartConnection} disabled={startingSession}>
                  {startingSession ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiKey className="h-4 w-4" />}
                  {activeSession && activeSession.status === "awaiting_user_action"
                    ? "Refresh session link"
                    : "Create hosted setup link"}
                </Button>

                {connectUrl ? (
                  <>
                    <Button variant="outline" onClick={handleCopyLink}>
                      <FiCopy className="h-4 w-4" />
                      {copyingLink ? "Copied" : "Copy link"}
                    </Button>
                    <a
                      href={connectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <FiExternalLink className="h-4 w-4" />
                      Open hosted page
                    </a>
                  </>
                ) : null}
              </div>

              {activeSession ? (
                <div className="dashboard-panel-soft p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Session code
                      </p>
                      <p className="mt-2 font-mono text-xl font-semibold text-foreground">
                        {activeSession.displayCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Status
                      </p>
                      <p className="mt-2 text-sm font-medium capitalize text-foreground">
                        {activeSession.status.replaceAll("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Expires
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {formatTimestamp(activeSession.expiresAt)}
                      </p>
                    </div>
                  </div>

                  {connectUrl ? (
                    <div className="dashboard-code mt-5 p-4">
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <FiExternalLink className="h-4 w-4" />
                        Open this URL on any device
                      </p>
                      <code className="block overflow-x-auto whitespace-nowrap text-xs text-muted-foreground">
                        {connectUrl}
                      </code>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="dashboard-panel p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Exposed tools
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Worker-facing commands for this integration
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {integration.runtimeStatus === "live"
                ? "These tool names are already wired in the worker."
                : "These tool names are placeholders for the worker implementation."}
            </p>

            {integration.tools.length > 0 ? (
              <div className="mt-5 space-y-3">
                {integration.tools.map((tool) => (
                  <div key={tool.name} className="dashboard-panel-soft p-4">
                    <p className="font-mono text-sm font-medium text-foreground">
                      {integration.slug}_{tool.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-panel-soft mt-5 p-4 text-sm text-muted-foreground">
                No worker tools are defined for this integration yet.
              </div>
            )}
          </div>

          <div className="dashboard-panel p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              OpenClaw flow
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>1. OpenClaw asks ClawLink to start a connection session.</p>
              <p>2. ClawLink returns a hosted URL plus a short-lived session code.</p>
              <p>3. The user finishes auth on any device.</p>
              <p>4. OpenClaw polls until the session changes to connected.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
