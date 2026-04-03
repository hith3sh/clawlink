import "server-only";

import { authenticateApiKey } from "@/lib/server/api-keys";
import { getAuthenticatedIdentity, getUserForCurrentIdentity, type UserRow } from "@/lib/server/integration-store";

export type RequestActor =
  | { kind: "user"; user: UserRow }
  | { kind: "api_key"; user: UserRow };

function getBearerToken(headerValue: string | null): string | null {
  if (!headerValue?.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice("Bearer ".length).trim();
}

export async function resolveRequestActor(authorizationHeader: string | null): Promise<RequestActor | null> {
  const signedInIdentity = await getAuthenticatedIdentity();

  if (signedInIdentity) {
    const user = await getUserForCurrentIdentity();

    if (user) {
      return { kind: "user", user };
    }
  }

  const bearerToken = getBearerToken(authorizationHeader);

  if (!bearerToken) {
    return null;
  }

  const apiKeyUser = await authenticateApiKey(bearerToken);

  if (!apiKeyUser) {
    return null;
  }

  return { kind: "api_key", user: apiKeyUser };
}
