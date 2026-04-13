import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getBillingAccessDecisionForUser } from "@/lib/server/billing";
import { createConnectionSession, getLatestActiveConnectionSessionForUser } from "@/lib/server/connection-sessions";
import { getDatabase, getIntegrationConnectionForUserId } from "@/lib/server/integration-store";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const actor = await resolveRequestActor(request.headers);

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

    const db = getDatabase();

    if (!db) {
      return NextResponse.json({ error: "DB binding is not configured" }, { status: 500 });
    }

    const billingAccess = await getBillingAccessDecisionForUser(db, actor.user, integration.slug);

    if (!billingAccess.allowed) {
      return NextResponse.json(
        {
          error: billingAccess.reason,
          upgradeUrl: `${request.nextUrl.origin}/dashboard/settings?tab=billing`,
        },
        { status: 402 },
      );
    }

    const existingSession = await getLatestActiveConnectionSessionForUser(actor.user, integration.slug);
    const defaultConnection = existingSession
      ? existingSession.connection
      : await getIntegrationConnectionForUserId(db, actor.user.id, integration.slug);
    const reconnectConnectionId =
      integration.setupMode === "oauth" &&
      defaultConnection?.authBackend === "nango" &&
      defaultConnection.authState === "needs_reauth" &&
      defaultConnection.nangoConnectionId &&
      defaultConnection.nangoProviderConfigKey
        ? defaultConnection.id
        : null;
    const session =
      existingSession ??
      (await createConnectionSession(actor.user, integration.slug, {
        connectionId: reconnectConnectionId,
      }));
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      sessionId: session.id,
      sessionToken: session.token,
      displayCode: session.displayCode,
      integration: session.integration,
      connectionId: session.connectionId,
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
