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

function getApiKeyFromHeaders(headers: Headers): string | null {
  const explicitApiKey = headers.get("x-clawlink-api-key")?.trim();

  if (explicitApiKey) {
    return explicitApiKey;
  }

  return getBearerToken(headers.get("authorization"));
}

export async function resolveRequestActor(headers: Headers): Promise<RequestActor | null> {
  const apiKey = getApiKeyFromHeaders(headers);

  if (apiKey) {
    const apiKeyUser = await authenticateApiKey(apiKey);

    if (!apiKeyUser) {
      return null;
    }

    return { kind: "api_key", user: apiKeyUser };
  }

  const signedInIdentity = await getAuthenticatedIdentity();

  if (signedInIdentity) {
    const user = await getUserForCurrentIdentity();

    if (user) {
      return { kind: "user", user };
    }
  }

  return null;
}
