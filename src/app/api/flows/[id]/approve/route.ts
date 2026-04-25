import { NextResponse } from "next/server";

import { approveFlowStepForUser } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

interface ApproveFlowRequestBody {
  stepKey?: string;
}

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
    const payload = (await request.json().catch(() => ({}))) as ApproveFlowRequestBody;
    const flow = await approveFlowStepForUser({
      userId: actor.user.id,
      flowId: decodeURIComponent(id),
      stepKey:
        typeof payload.stepKey === "string" && payload.stepKey.trim().length > 0
          ? payload.stepKey.trim()
          : undefined,
    });

    if (!flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    return NextResponse.json(flow);
  } catch (error) {
    console.error("Error approving flow step:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve flow step" },
      { status: 500 },
    );
  }
}
