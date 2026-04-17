import { NextResponse } from "next/server";

import { getDatabase, listIntegrationConnectionsForUserId } from "@/lib/server/integration-store";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      console.warn("[api/integrations] unauthorized request");
      return NextResponse.json({ error: "Unauthorized", integrations: [] }, { status: 401 });
    }

    const db = getDatabase();

    if (!db) {
      console.error("[api/integrations] DB binding is not configured");
      return NextResponse.json({ error: "DB binding is not configured", integrations: [] }, { status: 500 });
    }

    console.log("[api/integrations] resolved actor", {
      actorKind: actor.kind,
      userId: actor.user.id,
      clerkId: actor.user.clerk_id,
      email: actor.user.email,
    });

    const integrations = await listIntegrationConnectionsForUserId(db, actor.user.id);
    console.log("[api/integrations] returning integrations", {
      userId: actor.user.id,
      count: integrations.length,
    });
    return NextResponse.json({ integrations });
  } catch (error) {
    console.error("[api/integrations] failed", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch integrations",
        integrations: [],
      },
      { status: 500 },
    );
  }
}
