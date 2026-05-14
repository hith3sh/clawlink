import { NextResponse } from "next/server";

import { searchCanonicalCatalog } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

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

    const result = await searchCanonicalCatalog(actor.user, {
      query,
      connected_only: searchParams.get("connected_only") === "true",
      limit: parseLimit(searchParams.get("limit")),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/search] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search catalog" },
      { status: 500 },
    );
  }
}
