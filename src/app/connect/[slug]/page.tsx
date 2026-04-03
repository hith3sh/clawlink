import { notFound } from "next/navigation";

import HostedConnectPage from "@/components/connect/HostedConnectPage";
import { getIntegrationBySlug } from "@/data/integrations";
import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";

export const runtime = "edge";

export default async function ConnectIntegrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { slug } = await params;
  const { session: sessionToken } = await searchParams;
  const integration = getIntegrationBySlug(slug);

  if (!integration || !sessionToken) {
    notFound();
  }

  const session = await getConnectionSessionByToken(sessionToken);

  if (!session || session.integration !== integration.slug) {
    notFound();
  }

  return (
    <HostedConnectPage
      integration={integration}
      session={{
        token: session.token,
        displayCode: session.displayCode,
        status: session.status,
        expiresAt: session.expiresAt,
        errorMessage: session.errorMessage,
      }}
    />
  );
}
