"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

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

export default function HostedConnectPage({ integration, session }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(integration.credentialFields.map((field) => [field.key, ""])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(session.status);
  const [error, setError] = useState<string | null>(session.errorMessage);
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

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8">
          <div>
            <p className="text-sm font-medium text-red-500">ClawLink</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              Connect {integration.name}
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-gray-500">
              Finish this once, then go back to OpenClaw. We will pick it up automatically.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {status === "connected" ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">Connected</p>
            </div>
            <p className="mt-3 text-base leading-7 text-emerald-900">
              {integration.name} is ready. Go back to OpenClaw and continue.
            </p>
          </div>
        ) : status === "expired" ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 text-base leading-7 text-amber-900">
            This link expired. Start a new connection from OpenClaw and try again.
          </div>
        ) : oauthStartUrl ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <p className="text-xl font-semibold text-gray-900">Continue with {integration.name}</p>
            <p className="mt-2 text-base leading-7 text-gray-600">
              This opens {integration.name} so you can approve access.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={oauthStartUrl}
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800"
              >
                Continue with {integration.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : integration.setupMode === "oauth" || integration.credentialFields.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <p className="text-lg font-medium text-gray-900">This connection is not ready yet.</p>
            <p className="mt-2 text-base leading-7 text-gray-600">
              Start again from OpenClaw after {integration.name} is available.
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

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-sm leading-7 text-gray-600">
              Save your details once, then go back to OpenClaw.
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Save and connect
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
