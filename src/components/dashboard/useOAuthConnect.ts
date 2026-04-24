"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Integration } from "@/data/integrations";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";

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
      const origin = window.location.origin;
      const safeName = integration.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const accent = integration.color || "#111827";
      const appLogoHtml = hasBrandLogo(integration.slug)
        ? `<img src="${origin}${getBrandLogoSrc(integration.slug)}" alt="${safeName}" />`
        : `<span class="cl-initial">${integration.name.trim().charAt(0).toUpperCase() || "?"}</span>`;
      popup.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Connecting ${safeName}</title>
<style>
  @keyframes clPulse { 0%,80%,100% { opacity:.25; transform:scale(.8) } 40% { opacity:1; transform:scale(1) } }
  html, body { margin:0; padding:0; height:100%; background:#ffffff; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color:#0f172a; display:flex; flex-direction:column; min-height:100vh; }
  .cl-hero { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding:56px 24px 24px; background: radial-gradient(120% 80% at 50% 0%, #fff1f1 0%, #ffffff 60%); }
  .cl-tiles { display:flex; align-items:center; gap:14px; }
  .cl-tile { width:56px; height:56px; border-radius:14px; background:#ffffff; border:1px solid #e5e7eb; box-shadow:0 1px 2px rgba(15,23,42,.04); display:flex; align-items:center; justify-content:center; }
  .cl-tile img { width:32px; height:32px; }
  .cl-tile .cl-initial { font-size:22px; font-weight:700; letter-spacing:-.01em; color:${accent}; }
  .cl-connector { display:flex; align-items:center; gap:4px; }
  .cl-connector span { width:4px; height:4px; border-radius:999px; background:#cbd5e1; animation: clPulse 1.2s infinite ease-in-out; }
  .cl-connector span:nth-child(2) { animation-delay:.15s }
  .cl-connector span:nth-child(3) { animation-delay:.3s }
  .cl-title { margin-top:22px; font-size:18px; font-weight:700; text-align:center; letter-spacing:-.01em; line-height:1.35; }
  .cl-sub { margin-top:18px; padding-top:18px; border-top:1px solid #eef0f3; width:100%; max-width:360px; text-align:center; color:#64748b; font-size:14px; line-height:1.55; }
  .cl-footer { padding:14px 0 18px; text-align:center; color:#94a3b8; font-size:12px; border-top:1px solid #f1f5f9; display:flex; align-items:center; justify-content:center; gap:6px; }
  .cl-footer img { width:14px; height:14px; opacity:.8; }
</style>
</head>
<body>
  <div class="cl-hero">
    <div class="cl-tiles">
      <div class="cl-tile"><img src="${origin}/images/logo/clawlink.svg" alt="ClawLink" /></div>
      <div class="cl-connector"><span></span><span></span><span></span></div>
      <div class="cl-tile">${appLogoHtml}</div>
    </div>
    <div class="cl-title">ClawLink wants to connect<br/>to your ${safeName}</div>
    <div class="cl-sub">Taking you to ${safeName}.<br/>Please authenticate to continue.</div>
  </div>
  <div class="cl-footer">
    <img src="${origin}/images/logo/clawlink.svg" alt="" />
    <span>Secured by ClawLink</span>
  </div>
</body>
</html>`);
      popup.document.close();
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
