import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export function GET() {
  redirect("https://docs.claw-link.dev");
}
