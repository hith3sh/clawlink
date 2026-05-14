import { NextResponse } from "next/server";

import { getCanonicalExecution } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ executionId: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { executionId } = await context.params;
    const result = await getCanonicalExecution(actor.user, {
      execution_id: decodeURIComponent(executionId),
    });

    if (!result) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/executions/:executionId] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load execution" },
      { status: 500 },
    );
  }
}
