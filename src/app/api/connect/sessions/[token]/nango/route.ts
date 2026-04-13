import { NextResponse } from "next/server";

import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";
import { createNangoConnectSession, getPublicNangoClientConfig, isNangoManagedIntegration } from "@/lib/server/nango";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
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

    if (!isNangoManagedIntegration(session.integration)) {
      return NextResponse.json(
        { error: `${session.integration} is not configured for Nango.` },
        { status: 409 },
      );
    }

    const publicConfig = getPublicNangoClientConfig(session.integration);

    if (!publicConfig.baseUrl || !publicConfig.apiUrl || !publicConfig.providerConfigKey) {
      return NextResponse.json(
        { error: "Nango Connect UI is not configured for this environment." },
        { status: 503 },
      );
    }

    const connectSession = await createNangoConnectSession({
      sessionId: session.id,
      userId: session.userId,
      integrationSlug: session.integration,
      reconnectConnection:
        session.connectionId &&
        session.connection?.authBackend === "nango" &&
        session.connection.nangoConnectionId &&
        session.connection.nangoProviderConfigKey
          ? {
              nangoConnectionId: session.connection.nangoConnectionId,
              nangoProviderConfigKey:
                session.connection.nangoProviderConfigKey,
            }
          : null,
    });

    return NextResponse.json({
      sessionToken: connectSession.sessionToken,
      connectLink: connectSession.connectLink,
      expiresAt: connectSession.expiresAt,
      baseUrl: publicConfig.baseUrl,
      apiUrl: publicConfig.apiUrl,
      providerConfigKey: publicConfig.providerConfigKey,
      publicKey: publicConfig.publicKey,
    });
  } catch (error) {
    console.error("Error starting Nango connect session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Nango connect session",
      },
      { status: 500 },
    );
  }
}
