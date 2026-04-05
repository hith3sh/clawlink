import { Webhooks } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getPolarWebhookSecret, syncBillingFromPolarWebhook } from "@/lib/server/billing";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const webhookSecret = getPolarWebhookSecret();

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Polar webhooks are not configured. Set POLAR_WEBHOOK_SECRET first." },
      { status: 500 },
    );
  }

  const webhookHandler = Webhooks({
    webhookSecret,
    onPayload: async (payload) => {
      await syncBillingFromPolarWebhook(payload);
    },
  });

  return webhookHandler(request);
}
