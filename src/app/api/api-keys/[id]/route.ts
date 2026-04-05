import { NextResponse } from "next/server";

import { deleteApiKey } from "@/lib/server/api-keys";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid key id" }, { status: 400 });
    }

    await deleteApiKey(numericId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete API key" },
      { status: 500 },
    );
  }
}
