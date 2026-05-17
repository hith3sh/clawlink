import { NextResponse } from "next/server";

import {
  getHermesBootstrapErrorStatus,
  getHermesBootstrapInstall,
} from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await context.params;
    const result = await getHermesBootstrapInstall(sessionId);
    const base = {
      session_id: result.session.id,
      status: result.session.status,
      expires_at: result.session.expiresAt,
    };

    if (result.install) {
      return NextResponse.json({
        ...base,
        status: "approved",
        install: result.install,
        display: {
          title: "ClawLink approved",
          summary: "Finish local Hermes setup now.",
        },
      });
    }

    return NextResponse.json(base);
  } catch (error) {
    console.error("Error loading Hermes bootstrap session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load Hermes bootstrap session" },
      { status: getHermesBootstrapErrorStatus(error) },
    );
  }
}
