"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, Loader2 } from "lucide-react";

import type { Integration } from "@/data/integrations";

interface SessionSummary {
  token: string;
  displayCode: string;
  status: "awaiting_user_action" | "connected" | "failed" | "expired";
  expiresAt: string;
  errorMessage: string | null;
}

interface Props {
  integration: Integration;
  session: SessionSummary;
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function HostedConnectPage({ integration, session }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(integration.credentialFields.map((field) => [field.key, ""])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(session.status);
  const [error, setError] = useState<string | null>(session.errorMessage);
  const [copied, setCopied] = useState(false);

  const expiresLabel = useMemo(() => formatTimestamp(session.expiresAt), [session.expiresAt]);
  const oauthStartUrl =
    integration.setupMode === "oauth" && integration.dashboardStatus === "available"
      ? `/api/oauth/${integration.slug}/start?session=${encodeURIComponent(session.token)}`
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/connect/sessions/${session.token}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials: values }),
      });

      const data = (await response.json()) as { error?: string; session?: { status?: typeof status } };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to complete connection");
      }

      setStatus(data.session?.status ?? "connected");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to complete connection");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-500">ClawLink hosted connection</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Connect {integration.name}</h1>
            <p className="mt-3 max-w-2xl text-gray-500">
              Complete setup on this device, then return to OpenClaw. The waiting session will detect
              the result automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied link" : "Copy link"}
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Session code</p>
            <p className="mt-2 font-mono text-lg font-semibold text-gray-900">{session.displayCode}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Expires</p>
            <p className="mt-2 text-sm font-medium text-gray-900">{expiresLabel}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
            <p className="mt-2 text-sm font-medium text-gray-900">{status.replaceAll("_", " ")}</p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {status === "connected" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">Connection completed</p>
            </div>
            <p className="mt-3 text-sm text-emerald-800">
              {integration.name} is now connected. Return to OpenClaw and continue; the waiting session
              should pick this up automatically.
            </p>
          </div>
        ) : status === "expired" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            This session has expired. Start a new connection from OpenClaw or the ClawLink dashboard.
          </div>
        ) : oauthStartUrl ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="font-medium text-gray-900">Continue with {integration.name}</p>
            <p className="mt-2 text-sm text-gray-600">
              You will be redirected to {integration.name} to authorize ClawLink, then returned here
              automatically so OpenClaw can pick up the completed session.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={oauthStartUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Continue with {integration.name}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://docs.claw-link.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Open docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : integration.setupMode === "oauth" || integration.credentialFields.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="font-medium text-gray-900">OAuth setup is reserved here.</p>
            <p className="mt-2 text-sm text-gray-600">
              The hosted callback/polling flow is in place, but the provider-specific OAuth handshake
              for {integration.name} is not implemented yet.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {integration.credentialFields.map((field) => (
              <label key={field.key} className="block space-y-2">
                <span className="block text-sm font-medium text-gray-700">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    rows={6}
                    value={values[field.key] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    placeholder={field.placeholder}
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

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              This page can be opened on a different device than the machine running OpenClaw. ClawLink
              stores the credentials securely and the waiting session polls for completion.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Save and connect
              </button>
              <a
                href="https://docs.claw-link.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Open docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
