import { NextResponse } from "next/server";

import {
  deleteIntegrationConnectionById,
  getAuthenticatedIdentity,
  getDatabase,
  getIntegrationConnectionById,
} from "@/lib/server/integration-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function missingDatabaseResponse() {
  return NextResponse.json(
    { error: "DB binding is not configured for this environment" },
    { status: 503 },
  );
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    return unauthorizedResponse();
  }

  if (!getDatabase()) {
    return missingDatabaseResponse();
  }

  const { id } = await context.params;
  const connectionId = Number.parseInt(id, 10);

  if (!Number.isFinite(connectionId)) {
    return NextResponse.json({ error: "Invalid connection id" }, { status: 400 });
  }

  try {
    const connection = await getIntegrationConnectionById(connectionId);

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    await deleteIntegrationConnectionById(connectionId);

    return NextResponse.json({
      deleted: true,
      connectionId,
      integration: connection.integration,
    });
  } catch (error) {
    console.error(`Error deleting connection ${connectionId}:`, error);
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 });
  }
}
