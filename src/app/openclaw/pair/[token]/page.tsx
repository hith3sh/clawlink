import { notFound } from "next/navigation";

import OpenClawPairingPage from "@/components/openclaw/OpenClawPairingPage";
import { getOpenClawPairingSessionByToken } from "@/lib/server/openclaw-pairing";

export const dynamic = "force-dynamic";

export default async function OpenClawPairingRoute({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getOpenClawPairingSessionByToken(token);

  if (!session) {
    notFound();
  }

  return <OpenClawPairingPage initialSession={session} />;
}
