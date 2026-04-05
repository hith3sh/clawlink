import "server-only";

import { getEnvBinding } from "@/lib/server/integration-store";

const NOTION_AUTHORIZE_URL = "https://api.notion.com/v1/oauth/authorize";
const NOTION_TOKEN_URL = "https://api.notion.com/v1/oauth/token";

interface NotionOAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface NotionOAuthTokenResponse {
  access_token?: string;
  refresh_token?: string;
  bot_id?: string;
  duplicated_template_id?: string | null;
  workspace_id?: string;
  workspace_name?: string | null;
  workspace_icon?: string | null;
  owner?: unknown;
  error?: string;
  message?: string;
}

function encodeBase64(value: string): string {
  if (typeof btoa === "function") {
    return btoa(value);
  }

  return Buffer.from(value).toString("base64");
}

function getNotionOAuthConfig(): NotionOAuthConfig {
  const clientId = getEnvBinding<string>("NOTION_CLIENT_ID")?.trim();
  const clientSecret = getEnvBinding<string>("NOTION_CLIENT_SECRET")?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Notion OAuth is not configured yet.");
  }

  return { clientId, clientSecret };
}

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function buildNotionConnectPath(sessionToken: string): string {
  return `/connect/notion?session=${encodeURIComponent(sessionToken)}`;
}

export function buildNotionOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/api/oauth/notion/callback`;
}

export function buildNotionAuthorizationUrl(params: { origin: string; state: string }): string {
  const { clientId } = getNotionOAuthConfig();
  const query = new URLSearchParams({
    owner: "user",
    client_id: clientId,
    redirect_uri: buildNotionOAuthRedirectUri(params.origin),
    response_type: "code",
    state: params.state,
  });

  return `${NOTION_AUTHORIZE_URL}?${query.toString()}`;
}

function getOAuthErrorMessage(payload: NotionOAuthTokenResponse | null, response: Response): string {
  const code = safeTrim(payload?.error);
  const message = safeTrim(payload?.message);

  if (code && message) {
    return `Notion OAuth failed: ${code} (${message})`;
  }

  if (code) {
    return `Notion OAuth failed: ${code}`;
  }

  if (message) {
    return `Notion OAuth failed: ${message}`;
  }

  return `Notion OAuth failed with status ${response.status}`;
}

export async function exchangeNotionAuthorizationCode(params: {
  code: string;
  redirectUri: string;
}): Promise<Record<string, string>> {
  const { clientId, clientSecret } = getNotionOAuthConfig();
  const response = await fetch(NOTION_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encodeBase64(`${clientId}:${clientSecret}`)}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirectUri,
    }),
  });

  const payload = (await response.json().catch(() => null)) as NotionOAuthTokenResponse | null;

  if (!response.ok) {
    throw new Error(getOAuthErrorMessage(payload, response));
  }

  const integrationToken = safeTrim(payload?.access_token);
  const refreshToken = safeTrim(payload?.refresh_token);
  const botId = safeTrim(payload?.bot_id);

  if (!integrationToken || !refreshToken || !botId) {
    throw new Error("Notion OAuth succeeded but returned an incomplete token payload.");
  }

  return {
    integrationToken,
    refreshToken,
    botId,
    ...(safeTrim(payload?.workspace_id) ? { workspaceId: safeTrim(payload?.workspace_id)! } : {}),
    ...(safeTrim(payload?.workspace_name) ? { workspaceName: safeTrim(payload?.workspace_name)! } : {}),
    ...(safeTrim(payload?.workspace_icon) ? { workspaceIcon: safeTrim(payload?.workspace_icon)! } : {}),
    ...(safeTrim(payload?.duplicated_template_id)
      ? { duplicatedTemplateId: safeTrim(payload?.duplicated_template_id)! }
      : {}),
    ...(payload?.owner !== undefined ? { ownerJson: JSON.stringify(payload.owner) } : {}),
  };
}
