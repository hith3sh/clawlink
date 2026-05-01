import { NextResponse } from "next/server";

import { getAuthenticatedIdentity } from "@/lib/server/integration-store";
import {
  approveOpenClawPairingSession,
  getOpenClawPairingErrorStatus,
} from "@/lib/server/openclaw-pairing";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const identity = await getAuthenticatedIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await context.params;
    const session = await approveOpenClawPairingSession(token, identity);

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
    console.error("Error approving OpenClaw pairing session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve pairing session" },
      { status: getOpenClawPairingErrorStatus(error) },
    );
  }
}
