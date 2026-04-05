import "server-only";

import { getEnvBinding } from "@/lib/server/integration-store";

const MICROSOFT_AUTHORIZE_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MICROSOFT_GRAPH_ME_URL =
  "https://graph.microsoft.com/v1.0/me?$select=id,displayName,userPrincipalName,mail";

const OUTLOOK_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "https://graph.microsoft.com/User.Read",
  "https://graph.microsoft.com/Mail.ReadWrite",
  "https://graph.microsoft.com/Mail.Send",
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "https://graph.microsoft.com/Contacts.Read",
];

interface OutlookOAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface OutlookTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface OutlookProfileResponse {
  id?: string;
  displayName?: string;
  userPrincipalName?: string;
  mail?: string | null;
}

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getOutlookOAuthConfig(): OutlookOAuthConfig {
  const clientId = getEnvBinding<string>("OUTLOOK_CLIENT_ID")?.trim();
  const clientSecret = getEnvBinding<string>("OUTLOOK_CLIENT_SECRET")?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Outlook OAuth is not configured yet.");
  }

  return { clientId, clientSecret };
}

export function buildOutlookConnectPath(sessionToken: string): string {
  return `/connect/outlook?session=${encodeURIComponent(sessionToken)}`;
}

export function buildOutlookOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/api/oauth/outlook/callback`;
}

export function buildOutlookAuthorizationUrl(params: { origin: string; state: string }): string {
  const { clientId } = getOutlookOAuthConfig();
  const query = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: buildOutlookOAuthRedirectUri(params.origin),
    response_mode: "query",
    scope: OUTLOOK_SCOPES.join(" "),
    state: params.state,
    prompt: "select_account",
  });

  return `${MICROSOFT_AUTHORIZE_URL}?${query.toString()}`;
}

function getOAuthErrorMessage(payload: OutlookTokenResponse | null, response: Response): string {
  const error = safeTrim(payload?.error);
  const description = safeTrim(payload?.error_description);

  if (error && description) {
    return `Outlook OAuth failed: ${error} (${description})`;
  }

  if (error) {
    return `Outlook OAuth failed: ${error}`;
  }

  if (description) {
    return `Outlook OAuth failed: ${description}`;
  }

  return `Outlook OAuth failed with status ${response.status}`;
}

async function fetchOutlookProfile(accessToken: string): Promise<OutlookProfileResponse | null> {
  const response = await fetch(MICROSOFT_GRAPH_ME_URL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json().catch(() => null)) as OutlookProfileResponse | null;
}

export async function exchangeOutlookAuthorizationCode(params: {
  code: string;
  redirectUri: string;
}): Promise<Record<string, string>> {
  const { clientId, clientSecret } = getOutlookOAuthConfig();
  const response = await fetch(MICROSOFT_TOKEN_URL, {
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

  const payload = (await response.json().catch(() => null)) as OutlookTokenResponse | null;

  if (!response.ok) {
    throw new Error(getOAuthErrorMessage(payload, response));
  }

  const accessToken = safeTrim(payload?.access_token);
  const refreshToken = safeTrim(payload?.refresh_token);

  if (!accessToken || !refreshToken) {
    throw new Error("Outlook OAuth succeeded but returned an incomplete token payload.");
  }

  const expiresIn = typeof payload?.expires_in === "number" ? payload.expires_in : 3600;
  const profile = await fetchOutlookProfile(accessToken);
  const primaryEmail = safeTrim(profile?.mail) ?? safeTrim(profile?.userPrincipalName);

  return {
    accessToken,
    refreshToken,
    tokenType: safeTrim(payload?.token_type) ?? "Bearer",
    scope: safeTrim(payload?.scope) ?? OUTLOOK_SCOPES.join(" "),
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    ...(safeTrim(profile?.id) ? { graphUserId: safeTrim(profile?.id)! } : {}),
    ...(safeTrim(profile?.displayName) ? { displayName: safeTrim(profile?.displayName)! } : {}),
    ...(safeTrim(profile?.userPrincipalName)
      ? { userPrincipalName: safeTrim(profile?.userPrincipalName)! }
      : {}),
    ...(primaryEmail ? { primaryEmail } : {}),
  };
}
