"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, Check, Loader2, PlugZap, ShieldCheck, Workflow, X } from "lucide-react";

import type {
  HermesBootstrapSessionRecord,
  HermesBootstrapSessionStatus,
} from "@/lib/server/hermes-bootstrap";

interface Props {
  initialSession: HermesBootstrapSessionRecord;
}

type SessionState = Pick<
  HermesBootstrapSessionRecord,
  | "id"
  | "status"
  | "clientLabel"
  | "platform"
  | "expiresAt"
  | "approvedAt"
  | "consumedAt"
>;

function statusLabel(status: HermesBootstrapSessionStatus): string {
  switch (status) {
    case "pending_approval":
      return "Waiting";
    case "approved":
      return "Approved";
    case "rejected":
      return "Canceled";
    case "expired":
      return "Expired";
    case "consumed":
      return "Installed";
    case "error":
      return "Error";
    default:
      return status;
  }
}

function isTerminal(status: HermesBootstrapSessionStatus): boolean {
  return status === "approved" || status === "consumed" || status === "rejected" || status === "expired";
}

export default function HermesApprovalPage({ initialSession }: Props) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [session, setSession] = useState<SessionState>({
    id: initialSession.id,
    status: initialSession.status,
    clientLabel: initialSession.clientLabel,
    platform: initialSession.platform,
    expiresAt: initialSession.expiresAt,
    approvedAt: initialSession.approvedAt,
    consumedAt: initialSession.consumedAt,
  });
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const expiresInText = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const ms = new Date(session.expiresAt).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const minutes = Math.round(ms / 60000);
    if (minutes < 1) return "<1 min";
    return `${minutes} min`;
  }, [session.expiresAt]);

  async function submit(action: "approve" | "reject") {
    setSubmitting(action);
    setError(null);

    try {
      const response = await fetch(
        `/api/hermes/bootstrap-sessions/${encodeURIComponent(session.id)}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action }),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        session?: SessionState;
      };

      if (!response.ok || !data.session) {
        throw new Error(data.error ?? "Could not update this approval.");
      }

      setSession(data.session);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Could not update this approval.",
      );
    } finally {
      setSubmitting(null);
    }
  }

  function signIn() {
    window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
  }

  const userLabel = user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "Signed in";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--brand-bg)] px-4 py-8 text-foreground">
      <section className="w-full max-w-[440px] rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-[0_24px_70px_-45px_rgba(30,20,18,0.5)] sm:p-6">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <Image
            src="/images/logo/link.png"
            alt="ClawLink"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="font-semibold">ClawLink</span>
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
              Hermes setup
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Approve ClawLink for Hermes
            </h1>
          </div>
          <span className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-tint)] px-2.5 py-1 text-xs font-medium text-[var(--brand-dark)]">
            {statusLabel(session.status)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Allow Hermes on this device to access your ClawLink integrations. After approval,
          return to Hermes and send a message saying &quot;done&quot; so it can finish setup.
        </p>

        <div className="mt-5 divide-y divide-[var(--brand-border)] rounded-lg border border-[var(--brand-border)]">
          <Capability
            icon={<Workflow className="h-4 w-4" />}
            text="Browse supported integrations"
          />
          <Capability
            icon={<ShieldCheck className="h-4 w-4" />}
            text="Check connection health"
          />
          <Capability
            icon={<PlugZap className="h-4 w-4" />}
            text="Execute actions you approve"
          />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Info label="Device" value={session.clientLabel} />
          <Info label="Platform" value={session.platform ?? "Hermes"} />
          {!isTerminal(session.status) ? <Info label="Expires" value={expiresInText} /> : null}
          {isLoaded && isSignedIn ? <Info label="Account" value={userLabel} /> : null}
        </dl>

        {error ? (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {session.status === "pending_approval" ? (
          <div className="mt-6">
            {isLoaded && isSignedIn ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => submit("reject")}
                  disabled={submitting !== null}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => submit("approve")}
                  disabled={submitting !== null}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Approve
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signIn}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)]"
              >
                Sign in to approve
              </button>
            )}
          </div>
        ) : null}

        {session.status === "approved" || session.status === "consumed" ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            Return to Hermes and send a message saying &quot;done&quot; so it can finish setup.
          </div>
        ) : null}

        {session.status === "rejected" ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Approval canceled. Run the installer again when you are ready.
          </div>
        ) : null}

        {session.status === "expired" ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            This approval link expired. Ask Hermes to install ClawLink again.
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Capability({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--brand-tint)] text-[var(--brand)]">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-muted px-3 py-2">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-foreground">{value}</dd>
    </div>
  );
}
