import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { getTriggerForUser, getTriggerLogsForUser } from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

function normalizeLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 50;
  }

  return Math.min(parsed, 200);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const triggerId = decodeURIComponent(id);
    const trigger = await getTriggerForUser(actor.user.id, triggerId);

    if (!trigger) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const logs = await getTriggerLogsForUser(
      actor.user.id,
      triggerId,
      normalizeLimit(searchParams.get("limit")),
    );

    return NextResponse.json({ trigger, logs });
  } catch (error) {
    console.error("Error loading trigger logs:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load trigger logs" },
      { status: 500 },
    );
  }
}
