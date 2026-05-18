"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Integration } from "@/data/integrations";

interface StartResponse {
  error?: string;
  upgradeUrl?: string;
  sessionToken?: string;
}

interface SessionStatusResponse {
  session?: {
    status: "awaiting_user_action" | "connected" | "failed" | "expired";
    errorMessage: string | null;
  };
}

function buildPopupFeatures(integration: Integration) {
  const hasVideo =
    integration.authScheme === "api_key" && Boolean(integration.setupVideoUrl);
  const width = hasVideo ? 760 : 540;
  const height = 720;
  const screenWidth = window.screen.width;
  const childPopupWidth = 540;
  const gap = 8;
  let left: number;
  if (hasVideo && screenWidth >= width + childPopupWidth + gap) {
    left = Math.max(0, Math.round((screenWidth - (width + childPopupWidth + gap)) / 2));
  } else {
    left = Math.max(0, Math.round((screenWidth - width) / 2));
  }
  const top = Math.max(0, Math.round((window.screen.height - height) / 2));

  return [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
}

export function useOAuthConnect(integration: Integration, onConnected?: () => void) {
  const [starting, setStarting] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const onConnectedRef = useRef(onConnected);
  const connectedNotifiedRef = useRef(false);

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    if (!sessionToken) {
      return;
    }

    let cancelled = false;

    const handleConnected = () => {
      if (cancelled || connectedNotifiedRef.current) {
        return;
      }

      connectedNotifiedRef.current = true;
      setSessionToken(null);
      onConnectedRef.current?.();
    };

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/connect/sessions/${encodeURIComponent(sessionToken)}`, {
          cache: "no-store",
        });

        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as SessionStatusResponse;
        const status = data.session?.status;

        if (!status || cancelled) {
          return;
        }

        if (status === "connected") {
          handleConnected();
        } else if (status === "failed" || status === "expired") {
          setSessionToken(null);
        }
      } catch {
        // Silent — the next tick will retry.
      }
    }, 3000);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        !event.data ||
        typeof event.data !== "object" ||
        event.data.type !== "clawlink:connection-connected" ||
        event.data.integration !== integration.slug ||
        event.data.sessionToken !== sessionToken
      ) {
        return;
      }

      handleConnected();
    };

    window.addEventListener("message", handleMessage);

    return () => {
      cancelled = true;
      window.removeEventListener("message", handleMessage);
      window.clearInterval(interval);
    };
  }, [integration.slug, sessionToken]);

  const start = useCallback(() => {
    if (starting) {
      return;
    }

    const popup = window.open("about:blank", "clawlink-oauth", buildPopupFeatures(integration));

    if (!popup) {
      window.alert("Popup blocked. Allow popups for claw-link.dev and try again.");
      return;
    }

    try {
      const integrationName = integration.name.replace(/[<>&"']/g, "");
      popup.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Connecting…</title>
<style>
  html, body { margin:0; padding:0; height:100%; background:#ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  body { display:flex; align-items:center; justify-content:center; padding: 24px; }
  .cl-stack { display:flex; flex-direction:column; align-items:center; gap:16px; max-width:320px; text-align:center; }
  .cl-spinner { width:28px; height:28px; border-radius:999px; border:2.5px solid #e5e7eb; border-top-color:#0f172a; animation: clSpin .8s linear infinite; }
  @keyframes clSpin { to { transform: rotate(360deg) } }
  .cl-title { color:#0f172a; font-size:15px; font-weight:600; line-height:1.4; }
  .cl-sub { color:#6b7280; font-size:13px; line-height:1.5; }
</style>
</head>
<body>
  <div class="cl-stack">
    <div class="cl-spinner"></div>
    <div class="cl-title">Getting ${integrationName} ready…</div>
    <div class="cl-sub">This takes a couple of seconds. Please don't close this window.</div>
  </div>
</body>
</html>`);
      popup.document.close();
    } catch {
      // about:blank write can fail in some browsers — safe to ignore.
    }

    setStarting(true);
    connectedNotifiedRef.current = false;

    void (async () => {
      try {
        const response = await fetch("/api/connect/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ integration: integration.slug }),
        });

        const data = (await response.json()) as StartResponse;

        if (response.status === 402 && data.upgradeUrl) {
          popup.close();
          window.location.assign(data.upgradeUrl);
          return;
        }

        if (!response.ok || !data.sessionToken) {
          popup.close();
          window.alert(data.error ?? "Failed to start connection");
          return;
        }

        popup.location.href = `${window.location.origin}/connect/${integration.slug}?session=${encodeURIComponent(data.sessionToken)}`;
        popup.focus();
        setSessionToken(data.sessionToken);
      } catch (requestError) {
        popup.close();
        window.alert(
          requestError instanceof Error ? requestError.message : "Failed to start connection",
        );
      } finally {
        setStarting(false);
      }
    })();
  }, [integration, starting]);

  return { start, starting };
}
