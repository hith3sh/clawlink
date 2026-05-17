import { notFound } from "next/navigation";

import HermesApprovalPage from "@/components/hermes/HermesApprovalPage";
import { getHermesBootstrapSession } from "@/lib/server/hermes-bootstrap";

export const dynamic = "force-dynamic";

export default async function HermesApprovalRoute({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getHermesBootstrapSession(sessionId);

  if (!session) {
    notFound();
  }

  return <HermesApprovalPage initialSession={session} />;
}
