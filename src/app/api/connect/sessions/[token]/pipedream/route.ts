import { NextRequest, NextResponse } from "next/server";

import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";
import { createPipedreamConnectToken, isPipedreamManagedIntegration } from "@/lib/server/pipedream";

export const dynamic = "force-dynamic";

function getTokenTtlSeconds(expiresAt: string): number {
  const ttlMs = new Date(expiresAt).getTime() - Date.now();

  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return 60;
  }

  return Math.max(60, Math.min(60 * 60 * 4, Math.floor(ttlMs / 1000)));
}

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

    if (!isPipedreamManagedIntegration(session.integration)) {
      return NextResponse.json(
        { error: `${session.integration} is not configured for Pipedream.` },
        { status: 409 },
      );
    }

    const connectPageUrl = `${request.nextUrl.origin}/connect/${session.integration}?session=${encodeURIComponent(session.token)}`;
    const connectToken = await createPipedreamConnectToken({
      integrationSlug: session.integration,
      externalUserId: session.userId,
      allowedOrigins: [request.nextUrl.origin],
      successRedirectUri: connectPageUrl,
      errorRedirectUri: connectPageUrl,
      expiresIn: getTokenTtlSeconds(session.expiresAt),
    });

    return NextResponse.json({
      app: connectToken.app,
      token: connectToken.token,
      connectLinkUrl: connectToken.connectLinkUrl,
      expiresAt: connectToken.expiresAt ?? session.expiresAt,
      externalUserId: session.userId,
      projectEnvironment: connectToken.projectEnvironment,
    });
  } catch (error) {
    console.error("Error starting Pipedream connect session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Pipedream connect session",
      },
      { status: 500 },
    );
  }
}
