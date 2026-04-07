import "server-only";

import { getEnvBinding } from "@/lib/server/integration-store";
import {
  encodeBasicAuthValue,
  getOAuthErrorMessage,
  getOAuthProviderConfig,
  safeTrim,
} from "@/lib/oauth/providers";

interface NotionOAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface NotionOAuthTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  bot_id?: string;
  duplicated_template_id?: string | null;
  workspace_id?: string;
  workspace_name?: string | null;
  workspace_icon?: string | null;
  owner?: unknown;
  error?: string;
  message?: string;
}

function getNotionOAuthConfig(): NotionOAuthConfig {
  const clientId = getEnvBinding<string>("NOTION_CLIENT_ID")?.trim();
  const clientSecret = getEnvBinding<string>("NOTION_CLIENT_SECRET")?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Notion OAuth is not configured yet.");
  }

  return { clientId, clientSecret };
}

export function buildNotionConnectPath(sessionToken: string): string {
  return `/connect/notion?session=${encodeURIComponent(sessionToken)}`;
}

export function buildNotionOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/api/oauth/notion/callback`;
}

export function buildNotionAuthorizationUrl(params: { origin: string; state: string }): string {
  const { clientId } = getNotionOAuthConfig();
  const provider = getOAuthProviderConfig("notion");
  const query = new URLSearchParams({
    owner: "user",
    client_id: clientId,
    redirect_uri: buildNotionOAuthRedirectUri(params.origin),
    response_type: "code",
    state: params.state,
  });

  return `${provider?.authorizationUrl ?? "https://api.notion.com/v1/oauth/authorize"}?${query.toString()}`;
}

export async function exchangeNotionAuthorizationCode(params: {
  code: string;
  redirectUri: string;
}): Promise<Record<string, string>> {
  const { clientId, clientSecret } = getNotionOAuthConfig();
  const provider = getOAuthProviderConfig("notion");
  const refreshConfig = provider?.refresh;
  const response = await fetch(refreshConfig?.tokenEndpoint ?? "https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(refreshConfig?.additionalHeaders ?? {}),
      Authorization: `Basic ${encodeBasicAuthValue(clientId, clientSecret)}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirectUri,
    }),
  });

  const payload = (await response.json().catch(() => null)) as NotionOAuthTokenResponse | null;

  if (!response.ok) {
    throw new Error(
      getOAuthErrorMessage("Notion", refreshConfig!, payload as Record<string, unknown> | null, response),
    );
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
    ...(typeof payload?.expires_in === "number" && payload.expires_in > 0
      ? { expiresAt: new Date(Date.now() + payload.expires_in * 1000).toISOString() }
      : {}),
    ...(safeTrim(payload?.token_type) ? { tokenType: safeTrim(payload?.token_type)! } : {}),
    ...(safeTrim(payload?.workspace_id) ? { workspaceId: safeTrim(payload?.workspace_id)! } : {}),
    ...(safeTrim(payload?.workspace_name) ? { workspaceName: safeTrim(payload?.workspace_name)! } : {}),
    ...(safeTrim(payload?.workspace_icon) ? { workspaceIcon: safeTrim(payload?.workspace_icon)! } : {}),
    ...(safeTrim(payload?.duplicated_template_id)
      ? { duplicatedTemplateId: safeTrim(payload?.duplicated_template_id)! }
      : {}),
    ...(payload?.owner !== undefined ? { ownerJson: JSON.stringify(payload.owner) } : {}),
  };
}
