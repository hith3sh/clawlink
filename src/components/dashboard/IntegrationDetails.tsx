"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiChevronRight,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(integration.credentialFields.map((field) => [field.key, ""])),
  );

  useEffect(() => {
    let active = true;

    async function loadConnection() {
      try {
        const response = await fetch(`/api/integrations/${integration.slug}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          error?: string;
          connected?: boolean;
          connection?: ConnectionRecord | null;
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(data.error ?? "Failed to load integration");
          return;
        }

        setConnection(data.connection ?? null);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error ? requestError.message : "Failed to load integration",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadConnection();

    return () => {
      active = false;
    };
  }, [integration.slug]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch(`/api/integrations/${integration.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials: values }),
      });

      const data = (await response.json()) as {
        error?: string;
        connection?: ConnectionRecord | null;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save integration");
      }

      setConnection(data.connection ?? null);
      setSuccess(`${integration.name} is connected.`);
      setValues(Object.fromEntries(integration.credentialFields.map((field) => [field.key, ""])));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to save integration");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    setError(null);
    setSuccess(null);
    setDisconnecting(true);

    try {
      const response = await fetch(`/api/integrations/${integration.slug}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to disconnect integration");
      }

      setConnection(null);
      setSuccess(`${integration.name} has been disconnected.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Failed to disconnect integration",
      );
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 hover:text-gray-900 transition-colors"
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
                    {integration.dashboardStatus === "available"
                      ? "Dashboard connect"
                      : "Dashboard pending"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{integration.name}</h1>
                <p className="mt-2 max-w-2xl text-gray-500">{integration.description}</p>
              </div>
              <p className="max-w-2xl text-sm text-gray-600">{integration.setupGuide}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 lg:min-w-72">
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
                  {disconnecting ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiTrash2 className="h-4 w-4" />
                  )}
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
                  Save credentials here and ClawLink will store them encrypted at rest.
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
            <h2 className="text-xl font-semibold text-gray-900">Connection</h2>
            <p className="mt-1 text-sm text-gray-500">
              {integration.setupMode === "oauth"
                ? "OAuth-backed integrations need a provider handshake."
                : "Manual integrations accept provider credentials directly from the dashboard."}
            </p>
          </div>

          {integration.dashboardStatus !== "available" ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                {integration.setupMode === "oauth"
                  ? "OAuth setup is not implemented yet."
                  : "Dashboard setup is not implemented yet."}
              </p>
              <p className="mt-2">
                This page is wired so the integration can be managed here once the provider-specific
                handshake is ready.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSave}>
              {integration.credentialFields.map((field) => (
                <label key={field.key} className="block space-y-2">
                  <span className="block text-sm font-medium text-gray-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      rows={6}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={values[field.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  )}
                  {field.description ? (
                    <span className="block text-xs text-gray-500">{field.description}</span>
                  ) : null}
                </label>
              ))}

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                Secrets are encrypted before they are written to the database. Saving again replaces
                the stored credentials for this integration.
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiRefreshCw className="h-4 w-4" />}
                {connection ? "Update credentials" : "Save credentials"}
              </button>
            </form>
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
                    <p className="font-mono text-sm font-medium text-gray-900">{integration.slug}_{tool.name}</p>
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
            <h2 className="text-xl font-semibold text-gray-900">What this means today</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                Dashboard status:{" "}
                <span className="font-medium text-gray-900">
                  {integration.dashboardStatus === "available"
                    ? "you can store credentials here now"
                    : "the connect flow is reserved but not implemented"}
                </span>
              </p>
              <p>
                Worker status:{" "}
                <span className="font-medium text-gray-900">
                  {integration.runtimeStatus === "live"
                    ? "tool execution exists in the worker"
                    : "credentials can be collected before worker support lands"}
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
