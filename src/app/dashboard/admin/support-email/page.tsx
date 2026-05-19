import { requireAdminAccess } from "@/lib/server/admin";

import { SupportEmailComposer } from "./SupportEmailComposer";

export const dynamic = "force-dynamic";

export default async function AdminSupportEmailPage() {
  await requireAdminAccess();

  return <SupportEmailComposer />;
}
