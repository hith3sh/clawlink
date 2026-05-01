import { NextRequest, NextResponse } from "next/server";

import {
  finalizeOpenClawPairingSession,
  getOpenClawPairingErrorStatus,
} from "@/lib/server/openclaw-pairing";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const payload = (await request.json().catch(() => ({}))) as {
      verifier?: string;
    };
    const verifier = payload.verifier?.trim();

    if (!verifier) {
      return NextResponse.json({ error: "verifier is required" }, { status: 400 });
    }

    const { token } = await context.params;
    const session = await finalizeOpenClawPairingSession(token, verifier);

    return NextResponse.json({
      session: {
        token: session.token,
        displayCode: session.displayCode,
        deviceLabel: session.deviceLabel,
        approvedUserHint: session.approvedUserHint,
        status: session.status,
        expiresAt: session.expiresAt,
        approvedAt: session.approvedAt,
        pairedAt: session.pairedAt,
      },
    });
  } catch (error) {
    console.error("Error finalizing OpenClaw pairing session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to finalize pairing session" },
      { status: getOpenClawPairingErrorStatus(error) },
    );
  }
}
