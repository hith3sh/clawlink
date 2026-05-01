import { NextResponse } from "next/server";

import {
  getOpenClawPairingErrorStatus,
  getOpenClawPairingSessionByToken,
} from "@/lib/server/openclaw-pairing";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const session = await getOpenClawPairingSessionByToken(token);

    if (!session) {
      return NextResponse.json({ error: "Pairing session not found" }, { status: 404 });
    }

    return NextResponse.json({
      session: {
        id: session.id,
        token: session.token,
        displayCode: session.displayCode,
        deviceLabel: session.deviceLabel,
        approvedUserHint: session.approvedUserHint,
        status: session.status,
        expiresAt: session.expiresAt,
        approvedAt: session.approvedAt,
        pairedAt: session.pairedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error loading OpenClaw pairing session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load pairing session" },
      { status: getOpenClawPairingErrorStatus(error) },
    );
  }
}
