"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { AlertCircle, Clock, Loader2 } from "lucide-react";

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

type Step = 1 | 2 | 3;

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
      return "border-[var(--brand-border)]/60 bg-[var(--brand-tint)]/40 text-[var(--brand-dark)]";
  }
}

function activeStep(status: SessionState["status"]): Step {
  if (status === "awaiting_browser") return 1;
  if (status === "ready_for_device" || status === "awaiting_local_save") return 2;
  return 3;
}

function StepIndicator({ status }: { status: SessionState["status"] }) {
  const step = activeStep(status);
  const isTerminalNonSuccess = status === "expired" || status === "failed";

  const labels: Array<{ id: Step; label: string }> = [
    { id: 1, label: "Device" },
    { id: 2, label: "Browser" },
    { id: 3, label: "Paired" },
  ];

  const pillClass = (id: Step): string => {
    if (isTerminalNonSuccess) {
      return "bg-muted text-muted-foreground";
    }
    if (id < step) return "bg-[var(--brand-tint)] text-[var(--brand-dark)]";
    if (id === step) return "bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30";
    return "bg-muted text-muted-foreground";
  };

  const connectorClass = (id: Step): string => {
    if (isTerminalNonSuccess) return "bg-muted";
    return id < step ? "bg-[var(--brand)]" : "bg-muted";
  };

  return (
    <div className="mt-5 flex items-center justify-between gap-1.5">
      {labels.map((item, idx) => (
        <div key={item.id} className="flex flex-1 items-center gap-1.5">
          <span
            className={`flex h-7 flex-1 items-center justify-center rounded-full px-2 text-[11px] font-medium tracking-wide transition-colors ${pillClass(item.id)}`}
          >
            {item.label}
          </span>
          {idx < labels.length - 1 ? (
            <span
              className={`h-0.5 w-3 rounded-full transition-colors ${connectorClass(item.id)}`}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PairedCheck() {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className="text-emerald-500"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M12 20.5l5.5 5.5L28 14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1 },
        }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--brand-bg)] px-6 py-12 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[var(--brand-tint)] opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[360px] w-[360px] rounded-full bg-[var(--brand-hover-alt)]/30 blur-3xl"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-foreground/40"
        style={{ opacity: 0.08 }}
      >
        <defs>
          <pattern id="pair-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pair-dots)" />
      </svg>

      <div className="relative mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image
            src="/images/logo/link.png"
            alt="ClawLink"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="text-lg font-semibold tracking-[-0.02em]">ClawLink</span>
        </Link>

        <div className="relative overflow-hidden rounded-[28px] border border-[var(--brand-border)]/50 bg-white/90 p-6 shadow-[0_30px_60px_-30px_rgba(224,53,43,0.25)] backdrop-blur-sm sm:p-8">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-[var(--brand)]/10"
          >
            <rect
              x="14"
              y="34"
              width="42"
              height="22"
              rx="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              transform="rotate(-25 35 45)"
            />
            <rect
              x="44"
              y="44"
              width="42"
              height="22"
              rx="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              transform="rotate(-25 65 55)"
            />
          </svg>

          <div className="relative flex items-start justify-between gap-4">
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

          <StepIndicator status={session.status} />

          <div className="mt-6 rounded-xl border border-[var(--brand-border)]/40 bg-gradient-to-br from-[var(--brand-tint)]/40 to-white px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pairing code
            </p>
            {session.status === "awaiting_browser" ? (
              <motion.p
                className="mt-1.5 font-mono text-2xl font-semibold tracking-[0.2em] text-foreground"
                animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {session.displayCode}
              </motion.p>
            ) : (
              <p className="mt-1.5 font-mono text-2xl font-semibold tracking-[0.2em] text-foreground">
                {session.displayCode}
              </p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Expires in {expiresInText}</span>
            </p>
          </div>

          {error ? (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {session.status === "awaiting_browser" ? (
            <div className="mt-6">
              {isLoaded && isSignedIn ? (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/25 transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {approving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Approving…
                    </span>
                  ) : (
                    "Approve"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/25 transition hover:bg-[var(--brand-hover)]"
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
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[var(--brand)]" />
              <p>
                Approved{session.approvedUserHint ? ` by ${session.approvedUserHint}` : ""}. Return to OpenClaw and type &quot;Done&quot;
              </p>
            </div>
          ) : null}

          {session.status === "paired" ? (
            <div className="mt-6 flex items-start gap-3">
              <PairedCheck />
              <p className="pt-1 text-sm text-muted-foreground">
                Done. Return to OpenClaw, or open your{" "}
                <Link href="/dashboard" className="text-foreground underline underline-offset-4">
                  dashboard
                </Link>
                .
              </p>
            </div>
          ) : null}

          {session.status === "expired" ? (
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p>Link expired. Start a new pairing from OpenClaw.</p>
            </div>
          ) : null}

          {session.status === "failed" ? (
            <div className="mt-6 flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Pairing failed. Start a new pairing from OpenClaw.</p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
