import "server-only";

import { notFound } from "next/navigation";

import { getAuthenticatedIdentity, getRuntimeEnv, type Identity } from "@/lib/server/integration-store";

function parseAllowlist(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[\s,]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

export interface AdminAllowlists {
  emailAllowlist: string[];
  clerkIdAllowlist: string[];
}

export function getAdminAllowlists(): AdminAllowlists {
  const env = getRuntimeEnv();

  return {
    emailAllowlist: parseAllowlist(env.ADMIN_EMAIL_ALLOWLIST),
    clerkIdAllowlist: parseAllowlist(env.ADMIN_CLERK_ID_ALLOWLIST),
  };
}

export function isAdminIdentity(identity: Identity): boolean {
  const { emailAllowlist, clerkIdAllowlist } = getAdminAllowlists();

  if (emailAllowlist.length === 0 && clerkIdAllowlist.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  return (
    clerkIdAllowlist.includes(identity.clerkId.toLowerCase()) ||
    emailAllowlist.includes(identity.email.toLowerCase())
  );
}

export async function requireAdminAccess(): Promise<Identity> {
  const identity = await getAuthenticatedIdentity();

  if (!identity || !isAdminIdentity(identity)) {
    notFound();
  }

  return identity;
}
