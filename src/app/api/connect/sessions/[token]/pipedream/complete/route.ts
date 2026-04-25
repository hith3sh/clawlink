import { NextRequest, NextResponse } from "next/server";

import {
  completePipedreamConnectionSession,
  getConnectionSessionByToken,
} from "@/lib/server/connection-sessions";
import {
  derivePipedreamConnectionMetadata,
  getPipedreamAccount,
} from "@/lib/server/pipedream";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const session = await getConnectionSessionByToken(token);

    if (!session) {
      return NextResponse.json(
        { error: "Connection session not found" },
        { status: 404 },
      );
    }

    if (session.status !== "awaiting_user_action") {
      return NextResponse.json(
        { error: "This connection session is no longer active." },
        { status: 409 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as {
      accountId?: string;
    };
    const accountId = payload.accountId?.trim();

    if (!accountId) {
      return NextResponse.json(
        { error: "Pipedream accountId is required." },
        { status: 400 },
      );
    }

    const account = await getPipedreamAccount(accountId);
    const completedSession = await completePipedreamConnectionSession(token, {
      pipedreamAccountId: account.id,
      metadata: derivePipedreamConnectionMetadata(account, session.integration),
    });

    return NextResponse.json({
      session: completedSession,
      connection: completedSession.connection,
    });
  } catch (error) {
    console.error("Error completing Pipedream connection session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete Pipedream connection session",
      },
      { status: 500 },
    );
  }
}
