import { NextResponse } from "next/server";

import { getCanonicalWhoAmI } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whoami = await getCanonicalWhoAmI(actor.user);
    return NextResponse.json(whoami);
  } catch (error) {
    console.error("[api/agent/whoami] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load identity" },
      { status: 500 },
    );
  }
}
