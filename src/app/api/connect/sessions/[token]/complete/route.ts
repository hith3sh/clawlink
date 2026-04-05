import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { completeManualConnectionSession, getConnectionSessionByToken } from "@/lib/server/connection-sessions";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const currentSession = await getConnectionSessionByToken(token);

    if (!currentSession) {
      return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
    }

    const integration = getIntegrationBySlug(currentSession.integration);

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    const payload = (await request.json().catch(() => ({}))) as { credentials?: Record<string, unknown> };
    const incomingCredentials = payload.credentials ?? {};

    const missingFields = integration.credentialFields.filter((field) => {
      const value = incomingCredentials[field.key];
      return field.required && (typeof value !== "string" || value.trim().length === 0);
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.map((field) => field.label).join(", ")}`,
        },
        { status: 400 },
      );
    }

    const credentials = Object.fromEntries(
      integration.credentialFields.map((field) => [
        field.key,
        String(incomingCredentials[field.key] ?? "").trim(),
      ]),
    );

    const session = await completeManualConnectionSession(token, credentials);

    return NextResponse.json({
      session,
      connection: session.connection,
    });
  } catch (error) {
    console.error("Error completing connection session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete connection session" },
      { status: 500 },
    );
  }
}
