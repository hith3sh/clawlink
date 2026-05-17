"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, PlayCircle } from "lucide-react";

import type { Integration } from "@/data/integrations";

interface SessionSummary {
  token: string;
  displayCode: string;
  status: "awaiting_user_action" | "connected" | "failed" | "expired";
  expiresAt: string;
  errorMessage: string | null;
}

interface ComposioConnectStartResponse {
  error?: string;
  redirectUrl?: string;
  connectedAccountId?: string;
  expiresAt?: string;
}

interface Props {
  integration: Integration;
  session: SessionSummary;
}

export default function HostedConnectPage({
  integration,
  session,
}: Props) {
  const [status, setStatus] = useState(session.status);
  const [error, setError] = useState<string | null>(session.errorMessage);
  const [info, setInfo] = useState<string | null>(null);
  const [composioClosed, setComposioClosed] = useState(false);
  const [startingComposio, setStartingComposio] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const autoOpenedRef = useRef(false);
  const notifiedOpenerRef = useRef(false);
  const composioPopupRef = useRef<Window | null>(null);

  const showComposioHosted =
    integration.setupMode === "composio" &&
    integration.dashboardStatus === "available";
  const useVideoFlow =
    showComposioHosted &&
    integration.authScheme === "api_key" &&
    Boolean(integration.setupVideoUrl);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const narrow = window.matchMedia("(max-width: 1023px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCompactViewport(narrow.matches || coarse.matches);
    update();
    narrow.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

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
        setError(null);
        setInfo(null);
      } else if (nextStatus === "failed") {
        setError(data.session.errorMessage ?? `Failed to connect ${integration.name}.`);
      } else if (nextStatus === "expired") {
        setError("This link expired. Start a new connection and try again.");
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [integration.name, session.token, status]);

  useEffect(() => {
    if (status !== "connected") return;

    try {
      composioPopupRef.current?.close();
    } catch {
      // popup may already be closed or cross-origin — safe to ignore
    }
    composioPopupRef.current = null;
    queueMicrotask(() => setPopupActive(false));

    if (!notifiedOpenerRef.current) {
      notifiedOpenerRef.current = true;
      window.opener?.postMessage(
        {
          type: "clawlink:connection-connected",
          integration: integration.slug,
          sessionToken: session.token,
        },
        window.location.origin,
      );
    }

    const timer = window.setTimeout(() => {
      window.close();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [integration.slug, session.token, status]);

  const openComposioPopup = useCallback((redirectUrl: string): boolean => {
    const width = 540;
    const height = 720;
    const parentLeft = typeof window.screenX === "number" ? window.screenX : 0;
    const parentTop = typeof window.screenY === "number" ? window.screenY : 0;
    const parentWidth = window.outerWidth || width;
    let left = parentLeft + parentWidth + 8;
    if (typeof window.screen?.width === "number" && left + width > window.screen.width) {
      left = Math.max(0, window.screen.width - width);
    }
    const top = Math.max(0, parentTop);

    const features = [
      "popup=yes",
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      "resizable=yes",
      "scrollbars=yes",
    ].join(",");

    const popup = window.open(redirectUrl, "clawlink-composio-setup", features);
    if (!popup) {
      return false;
    }
    composioPopupRef.current = popup;
    setPopupActive(true);
    popup.focus();
    return true;
  }, []);

  const handleStartComposio = useCallback(async () => {
    setStartingComposio(true);
    setError(null);
    setInfo(`Opening ${integration.name} setup...`);
    setComposioClosed(false);

    try {
      const response = await fetch(`/api/connect/sessions/${session.token}/composio`, {
        method: "POST",
      });
      const data = (await response.json()) as ComposioConnectStartResponse;

      if (!response.ok || !data.redirectUrl) {
        throw new Error(data.error ?? `Failed to open ${integration.name} setup.`);
      }

      if (useVideoFlow && !isCompactViewport) {
        const opened = openComposioPopup(data.redirectUrl);
        if (!opened) {
          setComposioClosed(true);
          setInfo(null);
          setError(
            "Popup was blocked. Allow popups for this site and click Open setup again.",
          );
          return;
        }
        setInfo(null);
      } else {
        window.location.assign(data.redirectUrl);
      }
    } catch (requestError) {
      setComposioClosed(true);
      setInfo(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : `Failed to open ${integration.name} setup.`,
      );
    } finally {
      setStartingComposio(false);
    }
  }, [integration.name, session.token, useVideoFlow, isCompactViewport, openComposioPopup]);

  useEffect(() => {
    if (!showComposioHosted) return;
    if (status !== "awaiting_user_action") return;
    if (autoOpenedRef.current) return;
    if (useVideoFlow) return;
    autoOpenedRef.current = true;
    queueMicrotask(() => handleStartComposio());
  }, [showComposioHosted, status, handleStartComposio, useVideoFlow]);

  useEffect(() => {
    if (!popupActive) return;
    const interval = window.setInterval(() => {
      const popup = composioPopupRef.current;
      if (popup && popup.closed) {
        composioPopupRef.current = null;
        setPopupActive(false);
      }
    }, 800);
    return () => window.clearInterval(interval);
  }, [popupActive]);

  const hideCardForComposio =
    showComposioHosted &&
    status === "awaiting_user_action" &&
    !composioClosed &&
    !error &&
    !useVideoFlow;

  if (hideCardForComposio) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8">
          <div>
            <div className="mb-1 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/link.png" alt="ClawLink" className="h-6 w-auto" />
              <span className="text-sm font-semibold text-gray-900">ClawLink</span>
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              Connect {integration.name}
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-gray-500">
              Finish this once. ClawLink will update automatically.
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
              {integration.name} is ready. You can close this tab and continue.
            </p>
          </div>
        ) : status === "expired" ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 text-base leading-7 text-amber-900">
            This link expired. Start a new connection and try again.
          </div>
        ) : useVideoFlow ? (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
              <div className="relative aspect-video w-full">
                <iframe
                  src={integration.setupVideoUrl}
                  title={`How to get your ${integration.name} API key`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-base font-medium text-gray-900">
                {isCompactViewport
                  ? "Watch the short video, then tap below to paste your API key."
                  : "Watch the short video, then open the setup window to paste your API key."}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {isCompactViewport
                  ? "The setup page opens in this window. You'll come back here automatically once you're connected."
                  : "The setup window opens next to this one so you can keep the video visible while you paste."}
              </p>
              <button
                type="button"
                onClick={() => void handleStartComposio()}
                disabled={startingComposio}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startingComposio ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : popupActive ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {popupActive ? `Reopen ${integration.name} setup` : `Open ${integration.name} setup`}
              </button>
              {popupActive && !isCompactViewport ? (
                <p className="mt-3 text-xs leading-5 text-gray-500">
                  Setup window is open. Paste your API key there — this page will update automatically once you&apos;re connected.
                </p>
              ) : null}
            </div>
          </div>
        ) : showComposioHosted ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-base leading-7">
                Opening {integration.name} setup. If nothing happens, reopen it below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleStartComposio()}
              disabled={startingComposio}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingComposio ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Reopen {integration.name} setup
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
            <p className="text-lg font-medium text-gray-900">This connection is not ready yet.</p>
            <p className="mt-2 text-base leading-7 text-gray-600">
              {integration.name} no longer supports manual credential entry. Start again once a hosted provider flow is available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
