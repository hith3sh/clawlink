import { NextResponse } from "next/server";

import { listIntegrationConnections } from "@/lib/server/integration-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const integrations = await listIntegrationConnections();
    return NextResponse.json({ integrations });
  } catch (error) {
    console.error("Error fetching integrations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch integrations",
        integrations: [],
      },
      { status: 500 },
    );
  }
}
