import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Legacy Notion OAuth start route has been removed. Start from /connect/notion so ClawLink can launch the Nango-managed flow.",
    },
    { status: 410 },
  );
}
