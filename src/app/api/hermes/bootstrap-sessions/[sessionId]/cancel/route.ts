import { NextResponse } from "next/server";

import { getAuthenticatedIdentity } from "@/lib/server/integration-store";
import {
  getHermesBootstrapErrorStatus,
  rejectHermesBootstrapSession,
} from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const identity = await getAuthenticatedIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await context.params;
    const session = await rejectHermesBootstrapSession(sessionId, identity);

    return NextResponse.json({
      session_id: session.id,
      status: session.status,
    });
  } catch (error) {
    console.error("Error canceling Hermes bootstrap session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel Hermes bootstrap session" },
      { status: getHermesBootstrapErrorStatus(error) },
    );
  }
}
