import { NextResponse } from "next/server";

import { getCanonicalAction } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ integrationId: string; actionId: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { integrationId, actionId } = await context.params;
    const result = await getCanonicalAction(actor.user, {
      integration_id: decodeURIComponent(integrationId),
      action_id: decodeURIComponent(actionId),
    });

    if (!result) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/actions/:integrationId/:actionId] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load action" },
      { status: 500 },
    );
  }
}
