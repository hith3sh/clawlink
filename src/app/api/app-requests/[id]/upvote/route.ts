import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { toggleAppRequestUpvote } from "@/lib/server/app-requests";

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
    const requestId = Number.parseInt(id, 10);

    if (!Number.isFinite(requestId)) {
      return NextResponse.json(
        { error: "Invalid request id" },
        { status: 400 },
      );
    }

    const result = await toggleAppRequestUpvote({
      requestId,
      userId: actor.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/app-requests/upvote] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to toggle upvote" },
      { status: 500 },
    );
  }
}
