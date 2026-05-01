import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getIntegrationBySlug } from "@/data/integrations";
import { createComposioConnectLink } from "@/lib/composio/backend-client";
import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";

export const dynamic = "force-dynamic";

function getRequestEnv(): Record<string, unknown> {
  try {
    const context = getCloudflareContext({ async: false }) as unknown as {
      env?: Record<string, unknown>;
    };
    return context.env ?? process.env;
  } catch {
    return process.env;
  }
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

    const integration = getIntegrationBySlug(session.integration);

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    if (integration.setupMode !== "composio") {
      return NextResponse.json(
        { error: `${integration.name} does not use the hosted Composio flow.` },
        { status: 409 },
      );
    }

    const callbackUrl = new URL(
      `/api/connect/sessions/${encodeURIComponent(token)}/composio/complete`,
      request.nextUrl.origin,
    );
    const connectLink = await createComposioConnectLink({
      env: getRequestEnv(),
      integrationSlug: integration.slug,
      userId: session.userId,
      callbackUrl: callbackUrl.toString(),
      alias: `clawlink-${integration.slug}-${session.displayCode.toLowerCase()}-${Date.now().toString(36)}`,
    });

    return NextResponse.json({
      redirectUrl: connectLink.redirectUrl,
      connectedAccountId: connectLink.connectedAccountId,
      expiresAt: connectLink.expiresAt ?? session.expiresAt,
    });
  } catch (error) {
    console.error("Error starting Composio connect session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Composio connect session",
      },
      { status: 500 },
    );
  }
}
