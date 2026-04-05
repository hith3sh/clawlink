import { NextResponse } from "next/server";

import { getBillingOverviewForCurrentUser } from "@/lib/server/billing";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const billing = await getBillingOverviewForCurrentUser();
    return NextResponse.json({ billing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load billing";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

