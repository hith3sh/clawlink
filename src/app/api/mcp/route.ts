import { NextResponse } from "next/server";

import { handleMcpRequest, listMcpTools } from "@/lib/clawlink-spec/mcp-server";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      transport: "jsonrpc",
      endpoint: new URL(request.url).pathname,
      tools: listMcpTools().tools,
    });
  } catch (error) {
    console.error("[api/mcp] GET failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to describe MCP surface" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32001,
            message: "Unauthorized",
          },
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const response = await handleMcpRequest(request, actor.user, body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/mcp] POST failed", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
        },
      },
      { status: 500 },
    );
  }
}
