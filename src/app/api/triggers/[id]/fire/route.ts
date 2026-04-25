import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { fireTriggerForUser } from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

function normalizePayload(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  if (
    "payload" in value &&
    typeof value.payload === "object" &&
    value.payload !== null &&
    !Array.isArray(value.payload)
  ) {
    return value.payload as Record<string, unknown>;
  }

  return value as Record<string, unknown>;
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
    const payload = normalizePayload(await request.json().catch(() => undefined));
    const result = await fireTriggerForUser(actor.user.id, decodeURIComponent(id), payload);

    if (!result) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return NextResponse.json(result, {
      status: result.status === "success" ? 200 : 500,
    });
  } catch (error) {
    console.error("Error firing trigger:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fire trigger" },
      { status: 500 },
    );
  }
}
