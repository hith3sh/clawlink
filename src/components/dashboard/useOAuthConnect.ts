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

function buildPopupFeatures() {
  const width = 540;
  const height = 720;
  const left = Math.max(0, Math.round((window.screen.width - width) / 2));
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

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    if (!sessionToken) {
      return;
    }

    let cancelled = false;

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
          setSessionToken(null);
          onConnectedRef.current?.();
        } else if (status === "failed" || status === "expired") {
          setSessionToken(null);
        }
      } catch {
        // Silent — the next tick will retry.
      }
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sessionToken]);

  const start = useCallback(() => {
    if (starting) {
      return;
    }

    const popup = window.open("about:blank", "clawlink-oauth", buildPopupFeatures());

    if (!popup) {
      window.alert("Popup blocked. Allow popups for claw-link.dev and try again.");
      return;
    }

    try {
      popup.document.write(
        `<!doctype html><title>Connecting ${integration.name}</title><body style="font-family:system-ui;padding:24px;color:#475569">Opening ${integration.name} connection…</body>`,
      );
    } catch {
      // about:blank write can fail in some browsers — safe to ignore.
    }

    setStarting(true);

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
  }, [integration.name, integration.slug, starting]);

  return { start, starting };
}
