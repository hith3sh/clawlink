import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { createConnectionSession, getLatestActiveConnectionSessionForUser } from "@/lib/server/connection-sessions";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const actor = await resolveRequestActor(request.headers.get("authorization"));

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as { integration?: string };
    const integrationSlug = payload.integration?.trim();

    if (!integrationSlug) {
      return NextResponse.json({ error: "Integration is required" }, { status: 400 });
    }

    const integration = getIntegrationBySlug(integrationSlug);

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    if (integration.dashboardStatus !== "available") {
      return NextResponse.json(
        { error: `${integration.name} cannot be connected from ClawLink yet` },
        { status: 409 },
      );
    }

    const existingSession = await getLatestActiveConnectionSessionForUser(actor.user, integration.slug);
    const session = existingSession ?? (await createConnectionSession(actor.user, integration.slug));
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      sessionId: session.id,
      sessionToken: session.token,
      displayCode: session.displayCode,
      integration: session.integration,
      status: session.status,
      expiresAt: session.expiresAt,
      pollIntervalMs: 3000,
      connectUrl: `${origin}/connect/${integration.slug}?session=${encodeURIComponent(session.token)}`,
      statusUrl: `${origin}/api/connect/sessions/${encodeURIComponent(session.token)}`,
    });
  } catch (error) {
    console.error("Error starting connection session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start connection session" },
      { status: 500 },
    );
  }
}
