import { NextResponse } from "next/server";

import { getCanonicalConnection } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ integrationId: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { integrationId } = await context.params;
    const result = await getCanonicalConnection(actor.user, {
      integration_id: decodeURIComponent(integrationId),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/connections/:integrationId] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load connection" },
      { status: 500 },
    );
  }
}
