import { NextResponse } from "next/server";

import { getBillingOverviewForCurrentUser } from "@/lib/server/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const billing = await getBillingOverviewForCurrentUser();
    console.log("[api/billing] returning billing overview", {
      planKey: billing.planKey,
      subscribed: billing.subscribed,
      distinctIntegrationCount: billing.distinctIntegrationCount,
    });
    return NextResponse.json({ billing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load billing";
    const status = message === "Unauthorized" ? 401 : 500;

    console.error("[api/billing] failed", {
      message,
      status,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: message }, { status });
  }
}
