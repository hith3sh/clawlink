import { NextResponse } from "next/server";

import { listFlowsForUser } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

function normalizeLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 30;
  }

  return Math.min(parsed, 100);
}

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const flows = await listFlowsForUser(actor.user.id, normalizeLimit(searchParams.get("limit")));

    return NextResponse.json({ flows });
  } catch (error) {
    console.error("Error listing flows:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list flows" },
      { status: 500 },
    );
  }
}
