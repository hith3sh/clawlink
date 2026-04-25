import { NextResponse } from "next/server";

import { cancelFlowForUser } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const flow = await cancelFlowForUser(actor.user.id, decodeURIComponent(id));

    if (!flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    return NextResponse.json(flow);
  } catch (error) {
    console.error("Error cancelling flow:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel flow" },
      { status: 500 },
    );
  }
}
