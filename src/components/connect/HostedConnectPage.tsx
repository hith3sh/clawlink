"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

import type { Integration } from "@/data/integrations";

interface SessionSummary {
  token: string;
  displayCode: string;
  status: "awaiting_user_action" | "connected" | "failed" | "expired";
  expiresAt: string;
  errorMessage: string | null;
}

interface NangoClientConfig {
  enabled: boolean;
  baseUrl: string | null;
  apiUrl: string | null;
  publicKey: string | null;
  providerConfigKey: string | null;
}

interface Props {
  integration: Integration;
  session: SessionSummary;
  nango: NangoClientConfig;
}

export default function HostedConnectPage({
  integration,
  session,
  nango,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(integration.credentialFields.map((field) => [field.key, ""])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [startingOAuth, setStartingOAuth] = useState(false);
  const [status, setStatus] = useState(session.status);
  const [error, setError] = useState<string | null>(session.errorMessage);
  const [info, setInfo] = useState<string | null>(null);
  const connectUiRef = useRef<{ close: () => void } | null>(null);

  useEffect(() => {
    if (status !== "awaiting_user_action") {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/connect/sessions/${session.token}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        session?: {
          status?: SessionSummary["status"];
          errorMessage?: string | null;
        };
      };

      if (!data.session) {
        return;
      }

      const nextStatus: SessionSummary["status"] =
        data.session.status ?? "awaiting_user_action";
      setStatus(nextStatus);

      if (nextStatus === "connected") {
        connectUiRef.current?.close();
        connectUiRef.current = null;
        setError(null);
        setInfo(null);
      } else if (nextStatus === "failed") {
        setError(data.session.errorMessage ?? `Failed to connect ${integration.name}.`);
      } else if (nextStatus === "expired") {
        connectUiRef.current?.close();
        connectUiRef.current = null;
        setError("This link expired. Start a new connection from OpenClaw and try again.");
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [integration.name, session.token, status]);

  useEffect(() => {
    return () => {
      connectUiRef.current?.close();
      connectUiRef.current = null;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      const response = await fetch(`/api/connect/sessions/${session.token}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials: values }),
      });

      const data = (await response.json()) as {
        error?: string;
        session?: { status?: SessionSummary["status"] };
      };

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

  async function handleStartOAuth() {
    setStartingOAuth(true);
    setError(null);
    setInfo(null);

    try {
      const response = await fetch(`/api/connect/sessions/${session.token}/nango`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        error?: string;
        sessionToken?: string;
        baseUrl?: string | null;
        apiUrl?: string | null;
      };

      if (!response.ok || !data.sessionToken || !data.baseUrl || !data.apiUrl) {
        throw new Error(data.error ?? "Failed to start the hosted OAuth flow.");
      }

      const { ConnectUI } = await import("@nangohq/frontend");
      connectUiRef.current?.close();

      const connectUi = new ConnectUI({
        sessionToken: data.sessionToken,
        baseURL: data.baseUrl,
        apiURL: data.apiUrl,
        detectClosedAuthWindow: true,
        onEvent: async (event) => {
          if (event.type === "connect") {
            setInfo(`Waiting for ${integration.name} to finish connecting...`);

            await fetch(`/api/connect/sessions/${session.token}`, {
              cache: "no-store",
            }).catch(() => null);
          }

          if (event.type === "error") {
            setError(event.payload.errorMessage);
          }
        },
      });

      connectUi.open();
      connectUiRef.current = connectUi;
      setInfo(`Continue in the ${integration.name} window. This page will update automatically.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to start OAuth");
    } finally {
      setStartingOAuth(false);
    }
  }

  const showNangoOAuth =
    integration.setupMode === "oauth" &&
    integration.dashboardStatus === "available" &&
    nango.enabled &&
    Boolean(nango.baseUrl && nango.apiUrl && nango.providerConfigKey);
  const showUnavailableOAuth =
    integration.setupMode === "oauth" &&
    integration.dashboardStatus === "available" &&
    !showNangoOAuth;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8">
          <div>
            <div className="mb-1 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/clawlink.svg" alt="ClawLink" className="h-6 w-auto" />
              <span className="text-sm font-semibold text-gray-900">ClawLink</span>
            </div>
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

        {info ? (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            <span>{info}</span>
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
        ) : showNangoOAuth ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <p className="text-xl font-semibold text-gray-900">Continue with {integration.name}</p>
            <p className="mt-2 text-base leading-7 text-gray-600">
              This opens the hosted approval flow so you can connect {integration.name} and come right back here.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleStartOAuth()}
                disabled={startingOAuth}
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startingOAuth ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                Continue with {integration.name}
              </button>
            </div>
          </div>
        ) : showUnavailableOAuth ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <p className="text-lg font-medium text-amber-900">Nango is not configured for {integration.name}.</p>
            <p className="mt-2 text-base leading-7 text-amber-800">
              This OAuth connection now depends on Nango. Add the provider config in ClawLink, then start a new connection.
            </p>
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
