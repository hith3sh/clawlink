"use client";

import { useEffect, useMemo, useState } from "react";
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
      return "Waiting for approval";
    case "ready_for_device":
      return "Approved";
    case "awaiting_local_save":
      return "Finishing pairing";
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

  const expiresAtText = useMemo(
    () => new Date(session.expiresAt).toLocaleString(),
    [session.expiresAt],
  );

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f3f4f6,white_55%)] px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
            ClawLink for OpenClaw
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Pair this OpenClaw device
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600">
            Approve this device once, then OpenClaw can call your ClawLink integrations without
            asking you to paste an API key into chat.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Device</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{session.deviceLabel}</p>
              </div>
              <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700">
                {describeStatus(session.status)}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-500">Pairing code</p>
                <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.24em] text-gray-900">
                  {session.displayCode}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-500">Expires</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{expiresAtText}</p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {session.status === "awaiting_browser" ? (
            <div className="mt-8 space-y-4">
              {isLoaded && isSignedIn ? (
                <>
                  <p className="text-sm text-gray-600">
                    Signed in as <span className="font-medium text-gray-900">{user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "your ClawLink account"}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={approving}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {approving ? "Approving..." : "Approve this device"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Sign in to your ClawLink account first, then approve this device.
                  </p>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Sign in to ClawLink
                  </button>
                </>
              )}
            </div>
          ) : null}

          {session.status === "ready_for_device" || session.status === "awaiting_local_save" ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900">
              <p className="font-medium">
                Approved{session.approvedUserHint ? ` by ${session.approvedUserHint}` : ""}.
              </p>
              <p className="mt-1">
                Return to OpenClaw and let the ClawLink plugin finish the local pairing check. You
                can keep this tab open or close it after OpenClaw confirms pairing.
              </p>
            </div>
          ) : null}

          {session.status === "paired" ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900">
              <p className="font-medium">This OpenClaw device is paired.</p>
              <p className="mt-1">
                Return to OpenClaw and use your connected apps. You can also manage integrations in your{" "}
                <Link href="/dashboard" className="underline underline-offset-4">
                  ClawLink dashboard
                </Link>.
              </p>
            </div>
          ) : null}

          {session.status === "expired" ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
              This pairing link expired. Start a new pairing flow from OpenClaw.
            </div>
          ) : null}

          {session.status === "failed" ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
              Pairing failed. Start a new pairing flow from OpenClaw.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
