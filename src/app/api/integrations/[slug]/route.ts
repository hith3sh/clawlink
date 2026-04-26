import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getLatestActiveConnectionSessionForUser } from "@/lib/server/connection-sessions";
import {
  deleteIntegrationConnection,
  getAuthenticatedIdentity,
  getDatabase,
  getIntegrationConnection,
  getUserForCurrentIdentity,
  listIntegrationConnectionsForSlug,
} from "@/lib/server/integration-store";
import { listToolDescriptionsForIntegration } from "@/lib/server/tooling";

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
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    return unauthorizedResponse();
  }

  const { slug } = await context.params;
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 });
  }

  try {
    const [connection, connections, user] = await Promise.all([
      getIntegrationConnection(slug),
      listIntegrationConnectionsForSlug(slug),
      getUserForCurrentIdentity(),
    ]);

    const activeSession = user
      ? await getLatestActiveConnectionSessionForUser(user, slug)
      : null;
    const tools = user
      ? await listToolDescriptionsForIntegration(user.id, slug)
      : [];

    return NextResponse.json({
      integration: slug,
      connected: connections.length > 0,
      connection,
      connections,
      connectionCount: connections.length,
      activeSession,
      tools,
    });
  } catch (error) {
    console.error(`Error fetching integration ${slug}:`, error);
    return NextResponse.json({ error: "Failed to fetch integration" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  void request;
  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    return unauthorizedResponse();
  }

  if (!getDatabase()) {
    return missingDatabaseResponse();
  }

  const { slug } = await context.params;
  const integration = getIntegrationBySlug(slug);

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
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    return unauthorizedResponse();
  }

  if (!getDatabase()) {
    return missingDatabaseResponse();
  }

  const { slug } = await context.params;
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 });
  }

  const rawConnectionId = request.nextUrl.searchParams.get("connectionId");
  const parsedConnectionId = rawConnectionId ? Number.parseInt(rawConnectionId, 10) : NaN;
  const connectionId = Number.isFinite(parsedConnectionId) ? parsedConnectionId : undefined;

  try {
    if (!connectionId) {
      const connections = await listIntegrationConnectionsForSlug(slug);

      if (connections.length > 1) {
        return NextResponse.json(
          {
            error: `Multiple ${integration.name} connections exist. Remove a specific connection from the Connections page.`,
          },
          { status: 409 },
        );
      }
    }

    await deleteIntegrationConnection(slug, connectionId);

    return NextResponse.json({
      integration: slug,
      connected: false,
    });
  } catch (error) {
    console.error(`Error deleting integration ${slug}:`, error);
    return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 });
  }
}
