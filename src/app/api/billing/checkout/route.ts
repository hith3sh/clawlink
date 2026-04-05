import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getPolarCheckoutConfig } from "@/lib/server/billing";
import { getUserForCurrentIdentity } from "@/lib/server/integration-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getUserForCurrentIdentity();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { accessToken, productId, server, isConfigured } = getPolarCheckoutConfig();

  if (!isConfigured || !accessToken || !productId) {
    return NextResponse.json(
      { error: "Polar checkout is not configured. Set POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID first." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);

  url.searchParams.set("products", productId);
  url.searchParams.set("customerExternalId", user.id);

  if (user.email) {
    url.searchParams.set("customerEmail", user.email);
  }

  const checkoutHandler = Checkout({
    accessToken,
    successUrl: new URL("/dashboard/settings?tab=billing", request.nextUrl.origin).toString(),
    returnUrl: new URL("/dashboard/settings?tab=billing", request.nextUrl.origin).toString(),
    server,
  });

  return checkoutHandler(new NextRequest(url, request));
}
