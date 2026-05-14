import { NextResponse } from "next/server";

import { listCanonicalActions } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integration_id")?.trim();

    if (!integrationId) {
      return NextResponse.json({ error: "integration_id is required" }, { status: 400 });
    }

    const result = await listCanonicalActions(actor.user, {
      integration_id: integrationId,
      intent: searchParams.get("intent")?.trim() || undefined,
    });

    if (!result) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/actions] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list actions" },
      { status: 500 },
    );
  }
}
