import { NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getCanonicalConnection } from "@/lib/clawlink-spec/api";
import { resolveRequestActor } from "@/lib/server/request-auth";
import {
  deleteIntegrationConnectionById,
  getAuthenticatedIdentity,
  getDatabase,
  getIntegrationConnectionById,
} from "@/lib/server/integration-store";

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

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const result = await getCanonicalConnection(actor.user, {
      integration_id: decodeURIComponent(id),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/connections/:id] GET failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load connection" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  void request;

  const actor = await resolveRequestActor(request.headers);

  if (!actor) {
    return unauthorizedResponse();
  }

  if (!getDatabase()) {
    return missingDatabaseResponse();
  }

  const { id } = await context.params;
  const integration = getIntegrationBySlug(decodeURIComponent(id));

  if (!integration) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      error: `${integration.name} no longer supports direct manual credential setup. Start a hosted connection when provider-managed auth is available.`,
    },
    { status: 410 },
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
