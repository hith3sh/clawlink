import { NextResponse } from "next/server";
import { DOCS_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const targetUrl = new URL(DOCS_URL);
  targetUrl.search = new URL(request.url).search;

  return NextResponse.redirect(targetUrl, 308);
}
