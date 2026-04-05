import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { executeToolForUser, ToolInputValidationError } from "@/lib/server/tooling";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface ExecuteToolRequestBody {
  arguments?: Record<string, unknown>;
  connectionId?: number | string;
}

function normalizeArgs(payload: unknown): { args: Record<string, unknown>; connectionId?: number } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { args: {} };
  }

  const body = payload as ExecuteToolRequestBody & Record<string, unknown>;
  const rawConnectionId = body.connectionId;
  const parsedConnectionId =
    typeof rawConnectionId === "number"
      ? rawConnectionId
      : typeof rawConnectionId === "string"
        ? Number.parseInt(rawConnectionId, 10)
        : Number.NaN;
  const connectionId = Number.isFinite(parsedConnectionId) ? parsedConnectionId : undefined;

  if (body.arguments && typeof body.arguments === "object" && !Array.isArray(body.arguments)) {
    return {
      args: body.arguments,
      connectionId,
    };
  }

  const args = { ...body };
  delete args.connectionId;
  return {
    args,
    connectionId,
  };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ name: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await context.params;
    const payload = await request.json().catch(() => ({}));
    const { args, connectionId } = normalizeArgs(payload);
    const execution = await executeToolForUser(
      actor.user.id,
      decodeURIComponent(name),
      args,
      connectionId,
    );

    return NextResponse.json(execution);
  } catch (error) {
    if (error instanceof ToolInputValidationError) {
      return NextResponse.json(
        {
          error: "Invalid tool arguments",
          details: error.details,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Tool not found") {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    console.error("Error executing tool:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute tool" },
      { status: 500 },
    );
  }
}
