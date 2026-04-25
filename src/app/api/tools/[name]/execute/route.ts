import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { executeToolForUser } from "@/lib/server/tooling";

export const dynamic = "force-dynamic";

interface ExecuteToolRequestBody {
  arguments?: Record<string, unknown>;
  connectionId?: number | string;
  confirmed?: boolean;
}

function normalizeArgs(payload: unknown): {
  args: Record<string, unknown>;
  connectionId?: number;
  confirmed?: boolean;
} {
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
      confirmed: body.confirmed === true,
    };
  }

  const args = { ...body };
  delete args.connectionId;
  delete args.confirmed;
  return {
    args,
    connectionId,
    confirmed: body.confirmed === true,
  };
}

function getStatusCode(payload: Awaited<ReturnType<typeof executeToolForUser>>): number {
  if (payload.ok) {
    return 200;
  }

  switch (payload.error?.code) {
    case "tool_not_found":
      return 404;
    case "ambiguous_connection":
      return 409;
    case "confirmation_required":
      return 412;
    case "needs_connection":
      return 409;
    default:
      break;
  }

  switch (payload.error?.type) {
    case "validation":
      return 400;
    case "reauth_required":
    case "auth":
      return 401;
    case "missing_scopes":
      return 403;
    case "rate_limit":
      return 429;
    default:
      break;
  }

  return 500;
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
    const { args, connectionId, confirmed } = normalizeArgs(payload);
    const execution = await executeToolForUser(
      {
        userId: actor.user.id,
        toolName: decodeURIComponent(name),
        args,
        connectionId,
        confirmed,
      },
    );

    return NextResponse.json(execution, {
      status: getStatusCode(execution),
    });
  } catch (error) {
    console.error("Error executing tool:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute tool" },
      { status: 500 },
    );
  }
}
