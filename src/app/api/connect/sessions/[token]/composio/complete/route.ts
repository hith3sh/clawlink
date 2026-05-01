import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getIntegrationBySlug } from "@/data/integrations";
import { waitForComposioConnectedAccountActive } from "@/lib/composio/backend-client";
import {
  completeComposioConnectionSession,
  failConnectionSession,
  getConnectionSessionByToken,
} from "@/lib/server/connection-sessions";

export const dynamic = "force-dynamic";

function getRequestEnv(): Record<string, unknown> {
  try {
    const context = getCloudflareContext({ async: false }) as unknown as {
      env?: Record<string, unknown>;
    };
    return context.env ?? process.env;
  } catch {
    return process.env;
  }
}

function readParam(searchParams: URLSearchParams, names: string[]): string | null {
  for (const name of names) {
    const value = searchParams.get(name);

    if (value && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function isFailureStatus(value: string | null): boolean {
  if (!value) {
    return false;
  }

  return ["cancelled", "canceled", "error", "expired", "failed", "false"].includes(
    value.toLowerCase(),
  );
}

function getConnectPageUrl(request: NextRequest, integrationSlug: string, token: string): URL {
  const url = new URL(`/connect/${integrationSlug}`, request.nextUrl.origin);
  url.searchParams.set("session", token);
  return url;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  let redirectUrl = new URL("/dashboard", request.nextUrl.origin);

  try {
    const session = await getConnectionSessionByToken(token);

    if (!session) {
      redirectUrl.searchParams.set("connection", "missing");
      return NextResponse.redirect(redirectUrl);
    }

    redirectUrl = getConnectPageUrl(request, session.integration, token);

    if (session.status !== "awaiting_user_action") {
      return NextResponse.redirect(redirectUrl);
    }

    const integration = getIntegrationBySlug(session.integration);

    if (!integration) {
      await failConnectionSession(token, "Integration not found.");
      return NextResponse.redirect(redirectUrl);
    }

    if (integration.setupMode !== "composio") {
      await failConnectionSession(
        token,
        `${integration.name} does not use the hosted Composio flow.`,
      );
      return NextResponse.redirect(redirectUrl);
    }

    const searchParams = request.nextUrl.searchParams;
    const callbackStatus = readParam(searchParams, [
      "status",
      "connectionStatus",
      "connection_status",
    ]);
    const callbackError = readParam(searchParams, [
      "error_description",
      "error",
      "message",
    ]);

    if (callbackError || isFailureStatus(callbackStatus)) {
      await failConnectionSession(
        token,
        callbackError ?? `Failed to connect ${integration.name}.`,
      );
      return NextResponse.redirect(redirectUrl);
    }

    const connectedAccountId = readParam(searchParams, [
      "connected_account_id",
      "connectedAccountId",
      "connected_account",
      "connectedAccount",
      "id",
      "nanoid",
    ]);

    if (!connectedAccountId) {
      await failConnectionSession(
        token,
        "Composio did not return a connected account id.",
      );
      return NextResponse.redirect(redirectUrl);
    }

    const metadata = await waitForComposioConnectedAccountActive({
      env: getRequestEnv(),
      integrationSlug: integration.slug,
      connectedAccountId,
      expectedUserId: session.userId,
    });

    await completeComposioConnectionSession(token, { metadata });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error completing Composio connection session:", error);
    await failConnectionSession(
      token,
      error instanceof Error
        ? error.message
        : "Failed to complete Composio connection session",
    );
    return NextResponse.redirect(redirectUrl);
  }
}
