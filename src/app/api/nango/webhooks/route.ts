import { NextRequest, NextResponse } from "next/server";

import {
  completeOAuthConnectionSession,
  failConnectionSession,
} from "@/lib/server/connection-sessions";
import {
  getDatabase,
  markIntegrationConnectionNeedsReauthByNangoConnectionId,
} from "@/lib/server/integration-store";
import { mapNangoConnectionToClawLinkCredentials } from "@/lib/nango/credentials";
import {
  getNangoConnection,
  parseNangoWebhookPayload,
  verifyNangoWebhookSignature,
} from "@/lib/server/nango";

export const dynamic = "force-dynamic";

function getWebhookErrorMessage(payload: {
  error?: {
    type?: string;
    description?: string;
  };
}): string {
  const description = payload.error?.description?.trim();
  const type = payload.error?.type?.trim();

  if (description && type) {
    return `${type}: ${description}`;
  }

  if (description) {
    return description;
  }

  if (type) {
    return type;
  }

  return "Nango reported that the connection needs to be re-authorized.";
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-nango-hmac-sha256");

  if (!verifyNangoWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid Nango webhook signature" }, { status: 401 });
  }

  const payload = parseNangoWebhookPayload(rawBody);

  if (payload.type !== "auth") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const sessionToken = payload.tags?.clawlink_session_token?.trim();
  const integrationSlug = payload.tags?.clawlink_integration_slug?.trim();
  const nangoConnectionId = payload.connectionId?.trim();
  const providerConfigKey = payload.providerConfigKey?.trim();

  if (payload.success && (payload.operation === "creation" || payload.operation === "override")) {
    if (!sessionToken || !integrationSlug || !nangoConnectionId || !providerConfigKey) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const nangoConnection = await getNangoConnection(nangoConnectionId, providerConfigKey, {
      includeRefreshToken: true,
    });
    const credentials = mapNangoConnectionToClawLinkCredentials(integrationSlug, nangoConnection);

    await completeOAuthConnectionSession(sessionToken, credentials, {
      authProvider: "nango",
      nangoConnectionId,
      nangoProviderConfigKey: providerConfigKey,
    });

    return NextResponse.json({ ok: true });
  }

  if (!payload.success && sessionToken) {
    await failConnectionSession(sessionToken, getWebhookErrorMessage(payload));
  }

  if (payload.operation === "refresh" && !payload.success && nangoConnectionId) {
    const db = getDatabase();

    if (db) {
      await markIntegrationConnectionNeedsReauthByNangoConnectionId(
        db,
        nangoConnectionId,
        getWebhookErrorMessage(payload),
      );
    }
  }

  return NextResponse.json({ ok: true });
}
