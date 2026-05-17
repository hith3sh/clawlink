import { NextRequest, NextResponse } from "next/server";

import {
  createHermesBootstrapSession,
  getHermesBootstrapErrorStatus,
  HERMES_BOOTSTRAP_POLL_INTERVAL_MS,
} from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

function getRequestIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return request.headers.get("cf-connecting-ip")?.trim() ?? forwardedFor ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const session = await createHermesBootstrapSession(payload, getRequestIp(request));
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      session_id: session.id,
      status: session.status,
      approval_url: `${origin}/hermes/approve/${encodeURIComponent(session.id)}`,
      poll_url: `${origin}/api/hermes/bootstrap-sessions/${encodeURIComponent(session.id)}`,
      expires_at: session.expiresAt,
      poll_interval_ms: HERMES_BOOTSTRAP_POLL_INTERVAL_MS,
      display: {
        title: "Approve ClawLink for Hermes",
        summary: "Open this link to connect your ClawLink account.",
      },
    });
  } catch (error) {
    console.error("Error creating Hermes bootstrap session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Hermes bootstrap session" },
      { status: getHermesBootstrapErrorStatus(error) },
    );
  }
}
