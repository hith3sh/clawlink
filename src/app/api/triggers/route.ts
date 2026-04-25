import { NextResponse } from "next/server";

import { getAvailableFlowTemplates } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";
import {
  createTriggerForUser,
  listTriggersForUser,
  type TriggerType,
} from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

interface CreateTriggerRequestBody {
  integration?: string | null;
  type?: TriggerType;
  targetFlowTemplate?: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

const VALID_TRIGGER_TYPES = new Set<TriggerType>(["webhook", "schedule", "manual"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const triggers = await listTriggersForUser(actor.user.id);

    return NextResponse.json({
      triggers,
      templates: getAvailableFlowTemplates(),
    });
  } catch (error) {
    console.error("Error listing triggers:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list triggers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as CreateTriggerRequestBody;
    const type = payload.type;
    const targetFlowTemplate =
      typeof payload.targetFlowTemplate === "string" ? payload.targetFlowTemplate.trim() : "";

    if (!type || !VALID_TRIGGER_TYPES.has(type)) {
      return NextResponse.json(
        { error: "type must be one of webhook, schedule, or manual" },
        { status: 400 },
      );
    }

    if (!targetFlowTemplate) {
      return NextResponse.json({ error: "targetFlowTemplate is required" }, { status: 400 });
    }

    const trigger = await createTriggerForUser({
      userId: actor.user.id,
      integration:
        payload.integration === null
          ? null
          : typeof payload.integration === "string" && payload.integration.trim().length > 0
            ? payload.integration.trim()
            : undefined,
      type,
      targetFlowTemplate,
      config: isRecord(payload.config) ? payload.config : undefined,
      enabled: payload.enabled,
    });

    return NextResponse.json(
      {
        trigger,
        templates: getAvailableFlowTemplates(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating trigger:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create trigger" },
      { status: 500 },
    );
  }
}
