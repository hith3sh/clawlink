import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import { searchToolsForUser } from "@/lib/server/tooling";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const integration = searchParams.get("integration")?.trim().toLowerCase() || undefined;
    const limit = parseLimit(searchParams.get("limit"));
    const tools = await searchToolsForUser(actor.user.id, query, {
      integration,
      limit,
    });

    return NextResponse.json({
      tools,
      count: tools.length,
      query,
      integration: integration ?? null,
    });
  } catch (error) {
    console.error("Error searching tools:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search tools" },
      { status: 500 },
    );
  }
}
