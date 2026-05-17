import { NextResponse } from "next/server";

import { getAuthenticatedIdentity } from "@/lib/server/integration-store";
import {
  approveHermesBootstrapSession,
  getHermesBootstrapErrorStatus,
  rejectHermesBootstrapSession,
} from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const identity = await getAuthenticatedIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as {
      action?: string;
    };
    const { sessionId } = await context.params;
    const session =
      payload.action === "reject"
        ? await rejectHermesBootstrapSession(sessionId, identity)
        : await approveHermesBootstrapSession(sessionId, identity);

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        clientLabel: session.clientLabel,
        platform: session.platform,
        expiresAt: session.expiresAt,
        approvedAt: session.approvedAt,
        consumedAt: session.consumedAt,
      },
    });
  } catch (error) {
    console.error("Error approving Hermes bootstrap session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve Hermes bootstrap session" },
      { status: getHermesBootstrapErrorStatus(error) },
    );
  }
}
