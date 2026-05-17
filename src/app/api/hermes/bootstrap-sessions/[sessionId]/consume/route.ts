import { NextResponse } from "next/server";

import {
  consumeHermesBootstrapSession,
  getHermesBootstrapErrorStatus,
} from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await context.params;
    const session = await consumeHermesBootstrapSession(sessionId);

    return NextResponse.json({
      session_id: session.id,
      status: session.status,
      consumed_at: session.consumedAt,
    });
  } catch (error) {
    console.error("Error consuming Hermes bootstrap session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to consume Hermes bootstrap session" },
      { status: getHermesBootstrapErrorStatus(error) },
    );
  }
}
