import { NextRequest, NextResponse } from "next/server";

import {
  failConnectionSession,
  getConnectionSessionByToken,
  getConnectionSessionUserByToken,
} from "@/lib/server/connection-sessions";
import { createNangoConnectSession, isNangoConfiguredForIntegration } from "@/lib/server/nango";
import { buildOutlookAuthorizationUrl, buildOutlookConnectPath } from "@/lib/server/oauth/outlook";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionToken = request.nextUrl.searchParams.get("session")?.trim() ?? "";

  if (!sessionToken) {
    return NextResponse.json({ error: "Session token is required" }, { status: 400 });
  }

  const session = await getConnectionSessionByToken(sessionToken);

  if (!session || session.integration !== "outlook") {
    return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
  }

  const returnUrl = new URL(buildOutlookConnectPath(sessionToken), request.nextUrl.origin);

  if (session.status !== "awaiting_user_action") {
    return NextResponse.redirect(returnUrl);
  }

  try {
    if (isNangoConfiguredForIntegration("outlook")) {
      const user = await getConnectionSessionUserByToken(sessionToken);

      if (!user) {
        throw new Error("Connection session owner not found");
      }

      const nangoSession = await createNangoConnectSession({
        integrationSlug: "outlook",
        sessionToken,
        user,
      });

      return NextResponse.redirect(nangoSession.connectLink);
    }

    const authorizationUrl = buildOutlookAuthorizationUrl({
      origin: request.nextUrl.origin,
      state: sessionToken,
    });

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start Outlook OAuth";

    await failConnectionSession(sessionToken, message);

    return NextResponse.redirect(returnUrl);
  }
}
