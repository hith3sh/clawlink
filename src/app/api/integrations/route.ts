import { NextResponse } from "next/server";

import { listCanonicalIntegrations } from "@/lib/clawlink-spec/api";
import { getDatabase, listIntegrationConnectionsForUserId, listIntegrationConnectionsSummaryForUserId } from "@/lib/server/integration-store";
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

    const { searchParams } = new URL(request.url);

    if (searchParams.get("summary") === "true") {
      const integrations = await listIntegrationConnectionsSummaryForUserId(db, actor.user.id);
      return NextResponse.json({ integrations });
    }

    if (searchParams.get("canonical") === "true") {
      const result = await listCanonicalIntegrations(actor.user, {
        query: searchParams.get("query")?.trim() || undefined,
        category: searchParams.get("category")?.trim() || undefined,
        connected_only: searchParams.get("connected_only") === "true",
        supports_action: searchParams.get("supports_action")?.trim() || undefined,
        page: searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string, 10) : undefined,
        page_size: searchParams.get("page_size") ? Number.parseInt(searchParams.get("page_size") as string, 10) : undefined,
      });
      return NextResponse.json(result);
    }

    const integrations = await listIntegrationConnectionsForUserId(db, actor.user.id);
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
