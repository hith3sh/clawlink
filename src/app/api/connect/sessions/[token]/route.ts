import { NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const session = await getConnectionSessionByToken(token);

    if (!session) {
      return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
    }

    const integration = getIntegrationBySlug(session.integration);

    return NextResponse.json({
      session: {
        id: session.id,
        token: session.token,
        displayCode: session.displayCode,
        integration: session.integration,
        connectionId: session.connectionId,
        status: session.status,
        flowType: session.flowType,
        errorMessage: session.errorMessage,
        expiresAt: session.expiresAt,
        completedAt: session.completedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      connection: session.connection,
      integrationMeta: integration
        ? {
            name: integration.name,
            slug: integration.slug,
            description: integration.description,
            setupMode: integration.setupMode,
            credentialFields: integration.credentialFields,
          }
        : null,
    });
  } catch (error) {
    console.error("Error loading connection session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load connection session" },
      { status: 500 },
    );
  }
}
