"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import type { OpenClawPairingSessionRecord } from "@/lib/server/openclaw-pairing";

interface Props {
  initialSession: OpenClawPairingSessionRecord;
}

type SessionState = Pick<
  OpenClawPairingSessionRecord,
  | "token"
  | "displayCode"
  | "deviceLabel"
  | "approvedUserHint"
  | "status"
  | "expiresAt"
  | "approvedAt"
  | "pairedAt"
>;

function describeStatus(status: SessionState["status"]): string {
  switch (status) {
    case "awaiting_browser":
      return "Waiting";
    case "ready_for_device":
      return "Approved";
    case "awaiting_local_save":
      return "Finishing";
    case "paired":
      return "Paired";
    case "expired":
      return "Expired";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function statusBadgeClass(status: SessionState["status"]): string {
  switch (status) {
    case "paired":
    case "ready_for_device":
    case "awaiting_local_save":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "expired":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export default function OpenClawPairingPage({ initialSession }: Props) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [session, setSession] = useState<SessionState>({
    token: initialSession.token,
    displayCode: initialSession.displayCode,
    deviceLabel: initialSession.deviceLabel,
    approvedUserHint: initialSession.approvedUserHint,
    status: initialSession.status,
    expiresAt: initialSession.expiresAt,
    approvedAt: initialSession.approvedAt,
    pairedAt: initialSession.pairedAt,
  });
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.status === "paired" || session.status === "expired" || session.status === "failed") {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/openclaw/pair/sessions/${session.token}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        session?: SessionState;
      };

      if (data.session) {
        setSession(data.session);
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [session.status, session.token]);

  const expiresInText = useMemo(() => {
    const ms = new Date(session.expiresAt).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const minutes = Math.round(ms / 60000);
    if (minutes < 1) return "<1 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.round(minutes / 60);
    return `${hours} hr`;
  }, [session.expiresAt]);

  async function handleApprove() {
    setApproving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/openclaw/pair/sessions/${session.token}/approve`,
        { method: "POST" },
      );
      const data = (await response.json()) as {
        error?: string;
        session?: SessionState;
      };

      if (!response.ok || !data.session) {
        throw new Error(data.error ?? "Failed to approve pairing.");
      }

      setSession(data.session);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Failed to approve pairing.",
      );
    } finally {
      setApproving(false);
    }
  }

  function handleSignIn() {
    const redirectUrl = window.location.href;
    window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image
            src="/images/logo/clawlink.svg"
            alt="ClawLink"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="text-lg font-semibold tracking-[-0.02em]">ClawLink</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Pair device</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {session.deviceLabel}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadgeClass(session.status)}`}
            >
              {describeStatus(session.status)}
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pairing code
            </p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tracking-[0.2em] text-foreground">
              {session.displayCode}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Expires in {expiresInText}
            </p>
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {session.status === "awaiting_browser" ? (
            <div className="mt-6">
              {isLoaded && isSignedIn ? (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {approving ? "Approving…" : "Approve"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Sign in to approve
                </button>
              )}
              {isLoaded && isSignedIn ? (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "Signed in"}
                </p>
              ) : null}
            </div>
          ) : null}

          {session.status === "ready_for_device" || session.status === "awaiting_local_save" ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Approved{session.approvedUserHint ? ` by ${session.approvedUserHint}` : ""}. Return to OpenClaw.
            </p>
          ) : null}

          {session.status === "paired" ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Done. Return to OpenClaw, or open your{" "}
              <Link href="/dashboard" className="text-foreground underline underline-offset-4">
                dashboard
              </Link>
              .
            </p>
          ) : null}

          {session.status === "expired" ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Link expired. Start a new pairing from OpenClaw.
            </p>
          ) : null}

          {session.status === "failed" ? (
            <p className="mt-6 text-sm text-red-700">
              Pairing failed. Start a new pairing from OpenClaw.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
