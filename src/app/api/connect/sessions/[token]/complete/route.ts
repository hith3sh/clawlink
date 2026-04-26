import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  void request;
  try {
    const { token } = await context.params;
    const currentSession = await getConnectionSessionByToken(token);

    if (!currentSession) {
      return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
    }

    const integration = getIntegrationBySlug(currentSession.integration);

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: `${integration.name} no longer supports manual credential completion. Start a hosted provider flow when one is available.`,
      },
      { status: 410 },
    );
  } catch (error) {
    console.error("Error completing connection session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete connection session" },
      { status: 500 },
    );
  }
}
