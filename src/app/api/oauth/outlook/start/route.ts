import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Legacy Outlook OAuth start route has been removed. Start from /connect/outlook so ClawLink can launch the Nango-managed flow.",
    },
    { status: 410 },
  );
}
