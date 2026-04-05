"use client";

import { createElement, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";

interface ConnectionRecord {
  id: number;
  integration: string;
  connectionLabel?: string | null;
  accountLabel?: string | null;
  isDefault?: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface SessionRecord {
  id: string;
  token: string;
  displayCode: string;
  integration: string;
  connectionId?: number | null;
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
  onConnected?: () => void;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerIcon?: ReactNode;
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

export function OAuthConnectDialog({
  integration,
  onConnected,
  triggerClassName,
  triggerLabel = "Connect",
  triggerIcon,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [connection, setConnection] = useState<ConnectionRecord | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

  const popupUrl = useMemo(() => {
    if (!activeSession) {
      return null;
    }

    return `/api/oauth/${integration.slug}/start?session=${encodeURIComponent(activeSession.token)}`;
  }, [activeSession, integration.slug]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    async function loadState() {
      setLoading(true);
      setError(null);
      setUpgradeUrl(null);

      try {
        const response = await fetch(`/api/integrations/${integration.slug}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          error?: string;
          connection?: ConnectionRecord | null;
          connections?: ConnectionRecord[];
          connectionCount?: number;
          activeSession?: SessionRecord | null;
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load integration");
        }

        setConnection(data.connection ?? null);
        setConnectionCount(data.connectionCount ?? data.connections?.length ?? (data.connection ? 1 : 0));
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

    void loadState();

    return () => {
      active = false;
    };
  }, [integration.name, integration.slug, onConnected, open]);

  useEffect(() => {
    if (!open || !activeSession || activeSession.status !== "awaiting_user_action") {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/connect/sessions/${activeSession.token}`, {
        cache: "no-store",
      });

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
        setSuccess(`${integration.name} is connected.`);
        setError(null);
        setUpgradeUrl(null);
        setConnectionCount((current) => Math.max(1, current + 1));
        onConnected?.();
      }

      if (data.session.status === "failed") {
        setError(data.session.errorMessage ?? `Failed to connect ${integration.name}.`);
      }

      if (data.session.status === "expired") {
        setError("This connection session expired. Start a new one to continue.");
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeSession, integration.name, onConnected, open]);

  async function openOAuthPopup(session: SessionRecord) {
    const popup = window.open("", "clawlink-oauth", buildPopupFeatures());

    if (!popup) {
      throw new Error("Popup blocked. Allow popups for claw-link.dev and try again.");
    }

    popup.location.href = `${window.location.origin}/api/oauth/${integration.slug}/start?session=${encodeURIComponent(session.token)}`;
    popup.focus();
  }

  async function handleContinue() {
    setStarting(true);
    setError(null);
    setSuccess(null);
    setUpgradeUrl(null);

    try {
      let session = activeSession;

      if (!session || session.status === "failed" || session.status === "expired") {
        const response = await fetch("/api/connect/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ integration: integration.slug }),
        });

        const data = (await response.json()) as {
          error?: string;
          upgradeUrl?: string;
          sessionId?: string;
          sessionToken?: string;
          displayCode?: string;
          integration?: string;
          status?: SessionRecord["status"];
          expiresAt?: string;
        };

        if (response.status === 402 && data.upgradeUrl) {
          setUpgradeUrl(data.upgradeUrl);
          window.location.assign(data.upgradeUrl);
          return;
        }

        if (!response.ok) {
          setUpgradeUrl(data.upgradeUrl ?? null);
          throw new Error(data.error ?? "Failed to create connection session");
        }

        session = {
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
        };

        setActiveSession(session);
      }

      await openOAuthPopup(session);
      setSuccess(`Finish ${integration.name} in the popup. This window will update automatically.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to continue with OAuth");
    } finally {
      setStarting(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerIcon ?? <ExternalLink className="h-3.5 w-3.5" />}
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-3xl border-border/70 p-0" showCloseButton>
          <DialogHeader className="border-b border-border/60 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-muted/20">
                {hasBrandLogo(integration.slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getBrandLogoSrc(integration.slug)}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  createElement(getIntegrationIcon(integration.icon), {
                    className: "h-8 w-8",
                    style: { color: integration.color },
                  })
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <DialogTitle>Connect {integration.name}</DialogTitle>
                <DialogDescription>{integration.setupGuide}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p>{error}</p>
                    {upgradeUrl ? (
                      <a
                        href={upgradeUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                      >
                        Upgrade now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-100 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-100">{success}</AlertDescription>
              </Alert>
            ) : null}

            {loading ? (
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading {integration.name} connection state...
              </div>
            ) : (
              <>
                {connectionCount > 0 ? (
                  <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      {connectionCount === 1 ? "1 active connection" : `${connectionCount} active connections`}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {connection?.accountLabel ? <p>Current default: {connection.accountLabel}</p> : null}
                      <p>Adding another connection will make the new one the default for {integration.name}.</p>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
                  <p className="text-sm font-medium text-foreground">
                    Continue with {integration.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Clicking continue opens a popup for {integration.name} OAuth. After you approve access there,
                    this dialog will detect the result and update automatically.
                  </p>
                </div>

                {activeSession ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Session</p>
                      <p className="mt-2 font-mono text-sm text-foreground">{activeSession.displayCode}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Status</p>
                      <p className="mt-2 text-sm text-foreground">{activeSession.status.replaceAll("_", " ")}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Expires</p>
                      <p className="mt-2 text-sm text-foreground">{formatTimestamp(activeSession.expiresAt)}</p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => void handleContinue()} disabled={starting}>
                    {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                    {activeSession?.status === "awaiting_user_action"
                      ? `Reopen ${integration.name} popup`
                      : `Continue with ${integration.name}`}
                  </Button>
                  {popupUrl ? (
                    <a
                      href={popupUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Open in a full tab instead
                    </a>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
