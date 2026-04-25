import { NextResponse } from "next/server";

import { getAvailableFlowTemplates, getFlowForUser, startFlow } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

interface StartFlowRequestBody {
  flowTemplate?: string;
  input?: Record<string, unknown>;
  triggerType?: "agent" | "manual" | "webhook" | "schedule";
}

export async function POST(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as StartFlowRequestBody;
    const flowTemplate =
      typeof payload.flowTemplate === "string" && payload.flowTemplate.trim().length > 0
        ? payload.flowTemplate.trim()
        : "";

    if (!flowTemplate) {
      return NextResponse.json({ error: "flowTemplate is required" }, { status: 400 });
    }

    const result = await startFlow({
      userId: actor.user.id,
      flowTemplate,
      input: payload.input ?? {},
      triggerType: payload.triggerType ?? "manual",
    });
    const flow = await getFlowForUser(actor.user.id, result.flowId);

    return NextResponse.json({
      flowId: result.flowId,
      flow,
      templates: getAvailableFlowTemplates(),
    });
  } catch (error) {
    console.error("Error starting flow:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start flow" },
      { status: 500 },
    );
  }
}
