import { NextRequest, NextResponse } from "next/server";

import {
  completeOAuthConnectionSession,
  failConnectionSession,
  getConnectionSessionByToken,
} from "@/lib/server/connection-sessions";
import {
  buildGmailConnectPath,
  buildGmailOAuthRedirectUri,
  exchangeGmailAuthorizationCode,
} from "@/lib/server/oauth/gmail";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() ?? "";

  if (!state) {
    return NextResponse.json({ error: "Missing OAuth state" }, { status: 400 });
  }

  const session = await getConnectionSessionByToken(state);

  if (!session || session.integration !== "gmail") {
    return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
  }

  const returnUrl = new URL(buildGmailConnectPath(state), request.nextUrl.origin);
  const authorizationError = request.nextUrl.searchParams.get("error")?.trim();
  const authorizationErrorDescription =
    request.nextUrl.searchParams.get("error_description")?.trim() ?? null;

  if (authorizationError) {
    const message = authorizationErrorDescription
      ? `Gmail authorization failed: ${authorizationError} (${authorizationErrorDescription})`
      : `Gmail authorization failed: ${authorizationError}`;
    await failConnectionSession(state, message);
    return NextResponse.redirect(returnUrl);
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();

  if (!code) {
    await failConnectionSession(state, "Gmail did not return an authorization code.");
    return NextResponse.redirect(returnUrl);
  }

  try {
    const credentials = await exchangeGmailAuthorizationCode({
      code,
      redirectUri: buildGmailOAuthRedirectUri(request.nextUrl.origin),
    });

    await completeOAuthConnectionSession(state, credentials);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete Gmail OAuth";

    await failConnectionSession(state, message);
  }

  return NextResponse.redirect(returnUrl);
}
