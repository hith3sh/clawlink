import { NextRequest, NextResponse } from "next/server";

import {
  completeOAuthConnectionSession,
  failConnectionSession,
  getConnectionSessionByToken,
} from "@/lib/server/connection-sessions";
import {
  buildOutlookConnectPath,
  buildOutlookOAuthRedirectUri,
  exchangeOutlookAuthorizationCode,
} from "@/lib/server/oauth/outlook";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() ?? "";

  if (!state) {
    return NextResponse.json({ error: "Missing OAuth state" }, { status: 400 });
  }

  const session = await getConnectionSessionByToken(state);

  if (!session || session.integration !== "outlook") {
    return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
  }

  const returnUrl = new URL(buildOutlookConnectPath(state), request.nextUrl.origin);
  const authorizationError = request.nextUrl.searchParams.get("error")?.trim();
  const authorizationErrorDescription =
    request.nextUrl.searchParams.get("error_description")?.trim() ?? null;

  if (authorizationError) {
    const message = authorizationErrorDescription
      ? `Outlook authorization failed: ${authorizationError} (${authorizationErrorDescription})`
      : `Outlook authorization failed: ${authorizationError}`;
    await failConnectionSession(state, message);
    return NextResponse.redirect(returnUrl);
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();

  if (!code) {
    await failConnectionSession(state, "Outlook did not return an authorization code.");
    return NextResponse.redirect(returnUrl);
  }

  try {
    const credentials = await exchangeOutlookAuthorizationCode({
      code,
      redirectUri: buildOutlookOAuthRedirectUri(request.nextUrl.origin),
    });

    await completeOAuthConnectionSession(state, credentials);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete Outlook OAuth";

    await failConnectionSession(state, message);
  }

  return NextResponse.redirect(returnUrl);
}
