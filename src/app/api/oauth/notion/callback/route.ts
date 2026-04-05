import { NextRequest, NextResponse } from "next/server";

import {
  completeOAuthConnectionSession,
  failConnectionSession,
  getConnectionSessionByToken,
} from "@/lib/server/connection-sessions";
import {
  buildNotionConnectPath,
  buildNotionOAuthRedirectUri,
  exchangeNotionAuthorizationCode,
} from "@/lib/server/oauth/notion";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() ?? "";

  if (!state) {
    return NextResponse.json({ error: "Missing OAuth state" }, { status: 400 });
  }

  const session = await getConnectionSessionByToken(state);

  if (!session || session.integration !== "notion") {
    return NextResponse.json({ error: "Connection session not found" }, { status: 404 });
  }

  const returnUrl = new URL(buildNotionConnectPath(state), request.nextUrl.origin);
  const authorizationError = request.nextUrl.searchParams.get("error")?.trim();

  if (authorizationError) {
    await failConnectionSession(state, `Notion authorization failed: ${authorizationError}`);
    return NextResponse.redirect(returnUrl);
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();

  if (!code) {
    await failConnectionSession(state, "Notion did not return an authorization code.");
    return NextResponse.redirect(returnUrl);
  }

  try {
    const credentials = await exchangeNotionAuthorizationCode({
      code,
      redirectUri: buildNotionOAuthRedirectUri(request.nextUrl.origin),
    });

    await completeOAuthConnectionSession(state, credentials);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete Notion OAuth";

    await failConnectionSession(state, message);
  }

  return NextResponse.redirect(returnUrl);
}
