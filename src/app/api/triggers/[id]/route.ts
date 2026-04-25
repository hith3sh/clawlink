import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import {
  deleteTriggerForUser,
  getTriggerForUser,
  updateTriggerForUser,
} from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

interface UpdateTriggerRequestBody {
  integration?: string | null;
  targetFlowTemplate?: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
    const trigger = await getTriggerForUser(actor.user.id, decodeURIComponent(id));

    if (!trigger) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return NextResponse.json(trigger);
  } catch (error) {
    console.error("Error loading trigger:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load trigger" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as UpdateTriggerRequestBody;
    const targetFlowTemplate =
      typeof payload.targetFlowTemplate === "string"
        ? payload.targetFlowTemplate.trim()
        : undefined;

    if (payload.targetFlowTemplate !== undefined && !targetFlowTemplate) {
      return NextResponse.json(
        { error: "targetFlowTemplate must be a non-empty string when provided" },
        { status: 400 },
      );
    }

    const trigger = await updateTriggerForUser(actor.user.id, decodeURIComponent(id), {
      integration:
        payload.integration === null
          ? null
          : typeof payload.integration === "string" && payload.integration.trim().length > 0
            ? payload.integration.trim()
            : undefined,
      targetFlowTemplate,
      config: isRecord(payload.config) ? payload.config : undefined,
      enabled: typeof payload.enabled === "boolean" ? payload.enabled : undefined,
    });

    if (!trigger) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return NextResponse.json(trigger);
  } catch (error) {
    console.error("Error updating trigger:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update trigger" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteTriggerForUser(actor.user.id, decodeURIComponent(id));

    if (!deleted) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting trigger:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete trigger" },
      { status: 500 },
    );
  }
}
