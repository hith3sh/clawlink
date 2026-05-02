import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { listToolsForUser } from "@/lib/server/tooling";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const integration = searchParams.get("integration")?.trim().toLowerCase() || undefined;
    const tools = await listToolsForUser(actor.user.id, { integration });

    return NextResponse.json({
      tools,
      count: tools.length,
      integration: integration ?? null,
    });
  } catch (error) {
    console.error("Error listing tools:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list tools" },
      { status: 500 },
    );
  }
}
