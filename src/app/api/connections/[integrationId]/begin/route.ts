import { NextRequest, NextResponse } from "next/server";

import { beginCanonicalConnection } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ integrationId: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      redirect_url?: string;
      channel?: string;
      reuse_if_connected?: boolean;
    };
    const { integrationId } = await context.params;
    const result = await beginCanonicalConnection(actor.user, {
      integration_id: decodeURIComponent(integrationId),
      redirect_url: body.redirect_url,
      channel: body.channel,
      reuse_if_connected: body.reuse_if_connected,
      origin: request.nextUrl.origin,
    });

    if (!result) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/connections/:integrationId/begin] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to begin connection" },
      { status: 500 },
    );
  }
}
