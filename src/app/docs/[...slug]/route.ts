import { NextResponse } from "next/server";
import { DOCS_URL } from "@/lib/site";

interface RouteProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const pathname = slug.join("/");
  const targetUrl = new URL(`${DOCS_URL}/${pathname}`);
  targetUrl.search = new URL(request.url).search;

  return NextResponse.redirect(targetUrl, 308);
}
