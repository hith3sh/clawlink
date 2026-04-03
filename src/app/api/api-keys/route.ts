import { NextRequest, NextResponse } from "next/server";

import { createApiKey, listApiKeys } from "@/lib/server/api-keys";

export const runtime = "edge";

export async function GET() {
  try {
    const keys = await listApiKeys();
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Error listing API keys:", error);
    return NextResponse.json({ error: "Failed to list API keys" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as { name?: string };
    const name = payload.name?.trim() || "OpenClaw";
    const created = await createApiKey(name);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create API key" },
      { status: 500 },
    );
  }
}
