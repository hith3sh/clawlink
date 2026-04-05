import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { describeToolForUser } from "@/lib/server/tooling";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await context.params;
    const tool = await describeToolForUser(actor.user.id, decodeURIComponent(name));

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error("Error describing tool:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to describe tool" },
      { status: 500 },
    );
  }
}
