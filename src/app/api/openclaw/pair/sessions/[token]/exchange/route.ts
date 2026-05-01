import { NextRequest, NextResponse } from "next/server";

import {
  getOpenClawPairingErrorStatus,
  issueOpenClawPairingCredential,
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
    const issued = await issueOpenClawPairingCredential(token, verifier);

    return NextResponse.json({
      session: {
        token: issued.session.token,
        displayCode: issued.session.displayCode,
        deviceLabel: issued.session.deviceLabel,
        status: issued.session.status,
        expiresAt: issued.session.expiresAt,
        approvedAt: issued.session.approvedAt,
        pairedAt: issued.session.pairedAt,
      },
      apiKey: issued.rawKey,
      apiKeyId: issued.keyId,
    });
  } catch (error) {
    console.error("Error exchanging OpenClaw pairing session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to exchange pairing session" },
      { status: getOpenClawPairingErrorStatus(error) },
    );
  }
}
