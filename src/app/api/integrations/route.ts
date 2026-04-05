import { NextResponse } from "next/server";

import { getDatabase, listIntegrationConnectionsForUserId } from "@/lib/server/integration-store";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized", integrations: [] }, { status: 401 });
    }

    const db = getDatabase();

    if (!db) {
      return NextResponse.json({ error: "DB binding is not configured", integrations: [] }, { status: 500 });
    }

    const integrations = await listIntegrationConnectionsForUserId(db, actor.user.id);
    return NextResponse.json({ integrations });
  } catch (error) {
    console.error("Error fetching integrations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch integrations",
        integrations: [],
      },
      { status: 500 },
    );
  }
}
