import { NextRequest, NextResponse } from "next/server";

import {
  createOpenClawPairingSession,
  getOpenClawPairingErrorStatus,
  OPENCLAW_PAIRING_POLL_INTERVAL_MS,
} from "@/lib/server/openclaw-pairing";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as {
      deviceLabel?: string;
    };
    const started = await createOpenClawPairingSession(payload.deviceLabel);
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      sessionToken: started.session.token,
      displayCode: started.session.displayCode,
      deviceLabel: started.session.deviceLabel,
      status: started.session.status,
      expiresAt: started.session.expiresAt,
      pollIntervalMs: OPENCLAW_PAIRING_POLL_INTERVAL_MS,
      pairUrl: `${origin}/openclaw/pair/${encodeURIComponent(started.session.token)}`,
      verifier: started.verifier,
    });
  } catch (error) {
    console.error("Error starting OpenClaw pairing session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start pairing session" },
      { status: getOpenClawPairingErrorStatus(error) },
    );
  }
}
