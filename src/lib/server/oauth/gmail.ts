import "server-only";

import { getEnvBinding } from "@/lib/server/integration-store";
import {
  getOAuthErrorMessage,
  getOAuthProviderConfig,
  safeTrim,
} from "@/lib/oauth/providers";

const GMAIL_PROFILE_URL = "https://gmail.googleapis.com/gmail/v1/users/me/profile";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
];

interface GmailOAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface GmailTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface GmailProfileResponse {
  emailAddress?: string;
  messagesTotal?: number;
  threadsTotal?: number;
  historyId?: string;
}

function getGmailOAuthConfig(): GmailOAuthConfig {
  const clientId = getEnvBinding<string>("GMAIL_CLIENT_ID")?.trim();
  const clientSecret = getEnvBinding<string>("GMAIL_CLIENT_SECRET")?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Gmail OAuth is not configured yet.");
  }

  return { clientId, clientSecret };
}

export function buildGmailConnectPath(sessionToken: string): string {
  return `/connect/gmail?session=${encodeURIComponent(sessionToken)}`;
}

export function buildGmailOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/api/oauth/gmail/callback`;
}

export function buildGmailAuthorizationUrl(params: { origin: string; state: string }): string {
  const { clientId } = getGmailOAuthConfig();
  const provider = getOAuthProviderConfig("gmail");
  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: buildGmailOAuthRedirectUri(params.origin),
    response_type: "code",
    scope: GMAIL_SCOPES.join(" "),
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent select_account",
    state: params.state,
  });

  return `${
    provider?.authorizationUrl ?? "https://accounts.google.com/o/oauth2/v2/auth"
  }?${query.toString()}`;
}

async function fetchGmailProfile(accessToken: string): Promise<GmailProfileResponse | null> {
  const response = await fetch(GMAIL_PROFILE_URL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json().catch(() => null)) as GmailProfileResponse | null;
}

export async function exchangeGmailAuthorizationCode(params: {
  code: string;
  redirectUri: string;
}): Promise<Record<string, string>> {
  const { clientId, clientSecret } = getGmailOAuthConfig();
  const provider = getOAuthProviderConfig("gmail");
  const refreshConfig = provider?.refresh;
  const response = await fetch(refreshConfig?.tokenEndpoint ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirectUri,
    }).toString(),
  });

  const payload = (await response.json().catch(() => null)) as GmailTokenResponse | null;

  if (!response.ok) {
    throw new Error(
      getOAuthErrorMessage("Gmail", refreshConfig!, payload as Record<string, unknown> | null, response),
    );
  }

  const accessToken = safeTrim(payload?.access_token);
  const refreshToken = safeTrim(payload?.refresh_token);

  if (!accessToken || !refreshToken) {
    throw new Error("Gmail OAuth succeeded but did not return both an access token and refresh token.");
  }

  const expiresIn = typeof payload?.expires_in === "number" ? payload.expires_in : 3600;
  const profile = await fetchGmailProfile(accessToken);
  const primaryEmail = safeTrim(profile?.emailAddress);

  return {
    accessToken,
    refreshToken,
    tokenType: safeTrim(payload?.token_type) ?? "Bearer",
    scope: safeTrim(payload?.scope) ?? GMAIL_SCOPES.join(" "),
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    ...(primaryEmail ? { primaryEmail } : {}),
  };
}
