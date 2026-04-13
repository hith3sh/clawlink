import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Legacy Gmail OAuth callback route has been removed. Gmail connections now complete through the Nango-managed flow and webhook/session reconciliation.",
    },
    { status: 410 },
  );
}
