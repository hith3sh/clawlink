"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

interface PipedreamClientConfig {
  enabled: boolean;
  app: string | null;
  projectEnvironment: "development" | "production";
}

interface PipedreamConnectStartResponse {
  error?: string;
  app?: string;
  token?: string;
  connectLinkUrl?: string;
  expiresAt?: string;
  externalUserId?: string;
  projectEnvironment?: "development" | "production";
}

interface PipedreamConnectCompleteResponse {
  error?: string;
  session?: {
    status?: SessionSummary["status"];
  };
}

interface Props {
  integration: Integration;
  session: SessionSummary;
  nango: NangoClientConfig;
  pipedream: PipedreamClientConfig;
}

export default function HostedConnectPage({
  integration,
  session,
  nango,
  pipedream,
}: Props) {
  const [startingOAuth, setStartingOAuth] = useState(false);
  const [startingPipedream, setStartingPipedream] = useState(false);
  const [status, setStatus] = useState(session.status);
  const [error, setError] = useState<string | null>(session.errorMessage);
  const [info, setInfo] = useState<string | null>(null);
  const [nangoClosed, setNangoClosed] = useState(false);
  const [pipedreamClosed, setPipedreamClosed] = useState(false);
  const connectUiRef = useRef<{ close: () => void } | null>(null);
  const autoOpenedRef = useRef(false);

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

  useEffect(() => {
    if (status !== "connected") return;
    const timer = window.setTimeout(() => {
      window.close();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [status]);

  const fetchPipedreamConnectStart = useCallback(async () => {
    const response = await fetch(`/api/connect/sessions/${session.token}/pipedream`, {
      method: "POST",
    });
    const data = (await response.json()) as PipedreamConnectStartResponse;

    if (
      !response.ok ||
      !data.app ||
      !data.token ||
      !data.expiresAt ||
      !data.externalUserId
    ) {
      throw new Error(data.error ?? "Failed to start the hosted Pipedream flow.");
    }

    return data as Required<
      Pick<
        PipedreamConnectStartResponse,
        "app" | "token" | "expiresAt" | "externalUserId"
      >
    > &
      Pick<PipedreamConnectStartResponse, "connectLinkUrl" | "projectEnvironment">;
  }, [session.token]);

  const handleStartOAuth = useCallback(async () => {
    setStartingOAuth(true);
    setError(null);
    setInfo(null);
    setNangoClosed(false);

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

          if (event.type === "close") {
            setNangoClosed(true);
          }

          if (event.type === "error") {
            setNangoClosed(true);
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
  }, [integration.name, session.token]);

  const handleStartPipedream = useCallback(async () => {
    setStartingPipedream(true);
    setError(null);
    setInfo(null);
    setPipedreamClosed(false);

    try {
      const initial = await fetchPipedreamConnectStart();
      const { createFrontendClient } = await import("@pipedream/sdk/browser");
      const client = createFrontendClient({
        externalUserId: initial.externalUserId,
        projectEnvironment: initial.projectEnvironment ?? pipedream.projectEnvironment,
        tokenCallback: async () => {
          const refreshed = await fetchPipedreamConnectStart();

          return {
            token: refreshed.token,
            connectLinkUrl: refreshed.connectLinkUrl ?? "",
            expiresAt: new Date(refreshed.expiresAt),
          };
        },
      });

      await client.connectAccount({
        token: initial.token,
        app: initial.app,
        onSuccess: (result) => {
          void (async () => {
            try {
              setError(null);
              setPipedreamClosed(false);
              setInfo(`Finishing ${integration.name} in ClawLink...`);

              const response = await fetch(
                `/api/connect/sessions/${session.token}/pipedream/complete`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accountId: result.id }),
                },
              );
              const data = (await response.json()) as PipedreamConnectCompleteResponse;

              if (!response.ok) {
                throw new Error(data.error ?? `Failed to finish connecting ${integration.name}.`);
              }

              setInfo(null);
              setStatus(data.session?.status ?? "connected");
            } catch (completionError) {
              setInfo(null);
              setPipedreamClosed(true);
              setError(
                completionError instanceof Error
                  ? completionError.message
                  : `Failed to finish connecting ${integration.name}.`,
              );
            }
          })();
        },
        onError: (connectError) => {
          setPipedreamClosed(true);
          setInfo(null);
          setError(connectError.message || `Failed to connect ${integration.name}.`);
        },
        onClose: (result) => {
          if (!result.successful) {
            setPipedreamClosed(true);
            setInfo(null);
          }
        },
      });

      setInfo(`Continue in the ${integration.name} dialog. This page will update automatically.`);
    } catch (requestError) {
      setPipedreamClosed(true);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to start the hosted Pipedream flow.",
      );
    } finally {
      setStartingPipedream(false);
    }
  }, [
    fetchPipedreamConnectStart,
    integration.name,
    pipedream.projectEnvironment,
    session.token,
  ]);

  const showPipedreamOAuth =
    integration.setupMode === "pipedream" &&
    integration.dashboardStatus === "available" &&
    pipedream.enabled &&
    Boolean(pipedream.app);
  const showNangoOAuth =
    integration.setupMode === "oauth" &&
    integration.dashboardStatus === "available" &&
    !showPipedreamOAuth &&
    nango.enabled &&
    Boolean(nango.baseUrl && nango.apiUrl && nango.providerConfigKey);

  useEffect(() => {
    if (showPipedreamOAuth) {
      if (status !== "awaiting_user_action") return;
      if (autoOpenedRef.current) return;
      autoOpenedRef.current = true;
      void handleStartPipedream();
      return;
    }

    if (!showNangoOAuth) return;
    if (status !== "awaiting_user_action") return;
    if (autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    void handleStartOAuth();
  }, [showNangoOAuth, showPipedreamOAuth, status, handleStartOAuth, handleStartPipedream]);

  const hideCardForNango =
    showNangoOAuth &&
    status === "awaiting_user_action" &&
    !nangoClosed &&
    !error;

  const hideCardForPipedream =
    showPipedreamOAuth &&
    status === "awaiting_user_action" &&
    !pipedreamClosed &&
    !error;

  if (hideCardForNango || hideCardForPipedream) {
    return <div className="min-h-screen bg-white" />;
  }

  const showUnavailableOAuth =
    integration.dashboardStatus === "available" &&
    (
      (integration.setupMode === "oauth" && !showNangoOAuth) ||
      (integration.setupMode === "pipedream" && !showPipedreamOAuth)
    );

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
        ) : showPipedreamOAuth ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-base leading-7">
                Opening {integration.name}. If nothing happens, reopen the dialog below.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => void handleStartPipedream()}
                disabled={startingPipedream}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startingPipedream ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {pipedreamClosed ? "Reopen dialog" : `Open ${integration.name}`}
              </button>
            </div>
          </div>
        ) : showNangoOAuth ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-base leading-7">
                Opening {integration.name}. If nothing happens, reopen the window below.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => void handleStartOAuth()}
                disabled={startingOAuth}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startingOAuth ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                Reopen {integration.name} window
              </button>
            </div>
          </div>
        ) : showUnavailableOAuth ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <p className="text-lg font-medium text-amber-900">
              Hosted OAuth is not configured for {integration.name}.
            </p>
            <p className="mt-2 text-base leading-7 text-amber-800">
              Add the provider config in ClawLink, then start a new connection.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <p className="text-lg font-medium text-gray-900">This connection is not ready yet.</p>
            <p className="mt-2 text-base leading-7 text-gray-600">
              {integration.name} no longer supports manual credential entry. Start again from OpenClaw once a hosted provider flow is available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
