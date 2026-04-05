import { notFound } from "next/navigation";

import { getIntegrationBySlug } from "@/data/integrations";
import IntegrationDetails from "@/components/dashboard/IntegrationDetails";

export const dynamic = "force-dynamic";

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    notFound();
  }

  return <IntegrationDetails integration={integration} />;
}
