import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-auth";
import {
  createAppRequest,
  listAppRequests,
} from "@/lib/server/app-requests";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await listAppRequests(actor.user.id);

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[api/app-requests] GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list requests" },
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

    const body = (await request.json().catch(() => ({}))) as {
      toolkitName?: string;
      useCase?: string;
      email?: string;
    };

    const toolkitName = body.toolkitName?.trim();
    const useCase = body.useCase?.trim();
    const email = body.email?.trim() || actor.user.email || "";

    if (!toolkitName || toolkitName.length === 0) {
      return NextResponse.json(
        { error: "Toolkit name is required" },
        { status: 400 },
      );
    }

    if (!useCase || useCase.length === 0) {
      return NextResponse.json(
        { error: "Use case is required" },
        { status: 400 },
      );
    }

    const appRequest = await createAppRequest({
      userId: actor.user.id,
      email,
      toolkitName,
      useCase,
    });

    return NextResponse.json({ request: appRequest }, { status: 201 });
  } catch (error) {
    console.error("[api/app-requests] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create request" },
      { status: 500 },
    );
  }
}
