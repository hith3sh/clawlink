import { NextRequest, NextResponse } from "next/server";

import { processWebhookTrigger } from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

function getBearerToken(headerValue: string | null): string | null {
  if (!headerValue?.startsWith("Bearer ")) {
    return null;
  }

  const token = headerValue.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

function getWebhookSecret(request: NextRequest): string | null {
  const headerSecret = request.headers.get("x-clawlink-trigger-secret")?.trim();

  if (headerSecret) {
    return headerSecret;
  }

  const bearer = getBearerToken(request.headers.get("authorization"));

  if (bearer) {
    return bearer;
  }

  const querySecret = request.nextUrl.searchParams.get("secret")?.trim();
  return querySecret && querySecret.length > 0 ? querySecret : null;
}

function normalizePayload(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const secret = getWebhookSecret(request);

    if (!secret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 401 });
    }

    const { id } = await context.params;
    const payload = normalizePayload(await request.json().catch(() => undefined));
    const result = await processWebhookTrigger({
      triggerId: decodeURIComponent(id),
      secret,
      payload,
    });

    if (!result) {
      return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return NextResponse.json(result, {
      status: result.status === "success" ? 200 : 500,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process trigger webhook";
    const status = message === "Invalid webhook secret" ? 401 : 500;
    console.error("Error processing trigger webhook:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
