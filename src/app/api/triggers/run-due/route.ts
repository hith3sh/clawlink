import { NextRequest, NextResponse } from "next/server";

import { getTriggerCronSecret, runDueTriggerWork } from "@/lib/server/trigger-runtime";

export const dynamic = "force-dynamic";

function getBearerToken(headerValue: string | null): string | null {
  if (!headerValue?.startsWith("Bearer ")) {
    return null;
  }

  const token = headerValue.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

function getRunnerSecret(request: NextRequest): string | null {
  const headerSecret = request.headers.get("x-clawlink-trigger-secret")?.trim();

  if (headerSecret) {
    return headerSecret;
  }

  return getBearerToken(request.headers.get("authorization"));
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = getTriggerCronSecret();

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "TRIGGER_CRON_SECRET is not configured" },
        { status: 500 },
      );
    }

    const providedSecret = getRunnerSecret(request);

    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runDueTriggerWork();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running due trigger work:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run due trigger work" },
      { status: 500 },
    );
  }
}
