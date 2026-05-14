import { NextResponse } from "next/server";

import { createCanonicalExecution } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      integration_id?: string;
      action_id?: string;
      input?: Record<string, unknown>;
      idempotency_key?: string;
      confirm?: boolean;
    };

    if (!body.integration_id || !body.action_id || !body.input || typeof body.input !== "object" || Array.isArray(body.input)) {
      return NextResponse.json(
        { error: "integration_id, action_id, and object input are required" },
        { status: 400 },
      );
    }

    const result = await createCanonicalExecution(actor.user, {
      integration_id: body.integration_id,
      action_id: body.action_id,
      input: body.input,
      idempotency_key: body.idempotency_key,
      confirm: body.confirm,
    });

    return NextResponse.json(result, {
      status: result.status === "succeeded" ? 200 : result.status === "blocked" ? 409 : 500,
    });
  } catch (error) {
    console.error("[api/executions] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute action" },
      { status: 500 },
    );
  }
}
