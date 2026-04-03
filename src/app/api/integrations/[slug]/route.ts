import { NextRequest, NextResponse } from "next/server";

import { getIntegrationBySlug } from "@/data/integrations";
import { getLatestActiveConnectionSessionForUser } from "@/lib/server/connection-sessions";
import {
  deleteIntegrationConnection,
  getAuthenticatedIdentity,
  getIntegrationConnection,
  getDatabase,
  getUserForCurrentIdentity,
  saveIntegrationConnection,
} from "@/lib/server/integration-store";

export const runtime = "edge";

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
    const connection = await getIntegrationConnection(slug);
    const user = await getUserForCurrentIdentity();
    const activeSession = user
      ? await getLatestActiveConnectionSessionForUser(user, slug)
      : null;

    return NextResponse.json({
      integration: slug,
      connected: Boolean(connection),
      connection,
      activeSession,
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

  if (integration.dashboardStatus !== "available") {
    return NextResponse.json(
      { error: `${integration.name} cannot be connected from the dashboard yet` },
      { status: 409 },
    );
  }

  try {
    const payload = (await request.json()) as { credentials?: Record<string, unknown> };
    const incomingCredentials = payload.credentials ?? {};

    const missingFields = integration.credentialFields.filter((field) => {
      const value = incomingCredentials[field.key];
      return field.required && (typeof value !== "string" || value.trim().length === 0);
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.map((field) => field.label).join(", ")}`,
        },
        { status: 400 },
      );
    }

    const credentials = Object.fromEntries(
      integration.credentialFields.map((field) => [
        field.key,
        String(incomingCredentials[field.key] ?? "").trim(),
      ]),
    );

    const connection = await saveIntegrationConnection(slug, credentials);

    return NextResponse.json({
      integration: slug,
      connected: true,
      connection,
    });
  } catch (error) {
    console.error(`Error saving integration ${slug}:`, error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save integration",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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

  try {
    await deleteIntegrationConnection(slug);

    return NextResponse.json({
      integration: slug,
      connected: false,
    });
  } catch (error) {
    console.error(`Error deleting integration ${slug}:`, error);
    return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 });
  }
}
