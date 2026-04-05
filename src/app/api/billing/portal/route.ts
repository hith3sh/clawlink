import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getPolarCheckoutConfig } from "@/lib/server/billing";
import { getUserForCurrentIdentity } from "@/lib/server/integration-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getUserForCurrentIdentity();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { accessToken, server } = getPolarCheckoutConfig();

  if (!accessToken) {
    return NextResponse.json(
      { error: "Polar portal is not configured. Set POLAR_ACCESS_TOKEN first." },
      { status: 500 },
    );
  }

  const portalHandler = CustomerPortal({
    accessToken,
    server,
    returnUrl: new URL("/dashboard/settings?tab=billing", request.nextUrl.origin).toString(),
    getExternalCustomerId: async () => user.id,
  });

  return portalHandler(request);
}
