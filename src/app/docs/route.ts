import { redirect } from "next/navigation";

export const runtime = 'edge';

export function GET() {
  redirect("https://docs.claw-link.dev");
}
