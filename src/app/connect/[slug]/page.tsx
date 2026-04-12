import { notFound } from "next/navigation";

import HostedConnectPage from "@/components/connect/HostedConnectPage";
import { getIntegrationBySlug } from "@/data/integrations";
import { getConnectionSessionByToken } from "@/lib/server/connection-sessions";
import { getPublicNangoClientConfig } from "@/lib/server/nango";

export const dynamic = "force-dynamic";

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
      nango={getPublicNangoClientConfig(integration.slug)}
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
