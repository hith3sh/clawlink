import { NextResponse } from "next/server";

import { getAvailableFlowTemplates } from "@/lib/server/flow-runtime";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      templates: getAvailableFlowTemplates(),
    });
  } catch (error) {
    console.error("Error listing flow templates:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list flow templates" },
      { status: 500 },
    );
  }
}
