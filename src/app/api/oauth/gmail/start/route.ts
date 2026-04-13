import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Legacy Gmail OAuth start route has been removed. Start from /connect/gmail so ClawLink can launch the Nango-managed flow.",
    },
    { status: 410 },
  );
}
