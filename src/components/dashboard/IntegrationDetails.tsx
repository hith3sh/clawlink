"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiChevronRight,
  FiCopy,
  FiExternalLink,
  FiKey,
  FiLoader,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

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
  const Icon = getIntegrationIcon(integration.icon);
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
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 transition-colors hover:text-gray-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to integrations
        </Link>
        <FiChevronRight className="w-4 h-4" />
        <span>{integration.name}</span>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${integration.color}18` }}
            >
              <Icon className="h-7 w-7" style={{ color: integration.color }} />
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {integration.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      integration.runtimeStatus === "live"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {integration.runtimeStatus === "live" ? "Worker live" : "Worker planned"}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      integration.dashboardStatus === "available"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {integration.dashboardStatus === "available" ? "Hosted connect" : "Dashboard pending"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{integration.name}</h1>
                <p className="mt-2 max-w-2xl text-gray-500">{integration.description}</p>
              </div>
              <p className="max-w-2xl text-sm text-gray-600">{integration.setupGuide}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 lg:min-w-80">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiLoader className="h-4 w-4 animate-spin" />
                Checking connection
              </div>
            ) : connection ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <FiCheckCircle className="h-4 w-4" />
                  Connected
                </div>
                <dl className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Connected</dt>
                    <dd>{formatTimestamp(connection.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Updated</dt>
                    <dd>{formatTimestamp(connection.updatedAt) ?? "Never"}</dd>
                  </div>
                  {connection.expiresAt ? (
                    <div className="flex items-center justify-between gap-4">
                      <dt>Expires</dt>
                      <dd>{formatTimestamp(connection.expiresAt)}</dd>
                    </div>
                  ) : null}
                </dl>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {disconnecting ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiRefreshCw className="h-4 w-4" />
                  Not connected
                </div>
                <p className="text-sm text-gray-500">
                  Start a hosted connection session and finish setup on any device.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <FiCheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Hosted setup</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a short-lived connection session, then complete setup in a browser on the same
              machine or a different device.
            </p>
          </div>

          {integration.dashboardStatus !== "available" ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              <p className="font-medium text-gray-900">Hosted setup is not implemented yet.</p>
              <p className="mt-2">
                The session model is ready, but {integration.name} still needs its provider-specific
                connect flow.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900">Headless-friendly flow</p>
                <p className="mt-2">
                  This is built for local laptops and VPS installs. OpenClaw can print the link, you open
                  it anywhere, and ClawLink polls for completion.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartConnection}
                  disabled={startingSession}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {startingSession ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiKey className="h-4 w-4" />}
                  {activeSession && activeSession.status === "awaiting_user_action"
                    ? "Refresh session link"
                    : "Create hosted setup link"}
                </button>

                {connectUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FiCopy className="h-4 w-4" />
                      {copyingLink ? "Copied" : "Copy link"}
                    </button>
                    <a
                      href={connectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FiExternalLink className="h-4 w-4" />
                      Open hosted page
                    </a>
                  </>
                ) : null}
              </div>

              {activeSession ? (
                <div className="rounded-2xl border border-gray-200 p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Session code</p>
                      <p className="mt-2 font-mono text-lg font-semibold text-gray-900">
                        {activeSession.displayCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {activeSession.status.replaceAll("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Expires</p>
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {formatTimestamp(activeSession.expiresAt)}
                      </p>
                    </div>
                  </div>

                  {connectUrl ? (
                    <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                        <FiExternalLink className="h-4 w-4" />
                        Open this URL on any device
                      </p>
                      <code className="block overflow-x-auto whitespace-nowrap text-xs text-gray-600">
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Exposed tools</h2>
            <p className="mt-1 text-sm text-gray-500">
              {integration.runtimeStatus === "live"
                ? "These tool names are currently wired in the worker."
                : "These tools are placeholders for the worker implementation."}
            </p>
            {integration.tools.length > 0 ? (
              <div className="mt-5 space-y-3">
                {integration.tools.map((tool) => (
                  <div key={tool.name} className="rounded-xl border border-gray-100 p-4">
                    <p className="font-mono text-sm font-medium text-gray-900">
                      {integration.slug}_{tool.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                No worker tools are defined for this integration yet.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">OpenClaw flow</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>1. OpenClaw calls ClawLink to start a connection session.</p>
              <p>2. ClawLink returns a hosted URL plus a short-lived session code.</p>
              <p>3. The user finishes auth on any device.</p>
              <p>4. OpenClaw polls session status until it becomes connected.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
