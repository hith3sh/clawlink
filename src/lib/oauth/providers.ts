export type OAuthClientAuthentication = "basic" | "body";
export type OAuthTokenRequestEncoding = "form" | "json";

interface OAuthCredentialKeys {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
  tokenType?: string;
  scope?: string;
}

interface OAuthResponseFields {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: string;
  tokenType?: string;
  scope?: string;
  error?: string;
  errorDescription?: string;
}

export interface OAuthRefreshConfig {
  displayName: string;
  usesRefreshTokens: boolean;
  tokenEndpoint: string;
  clientIdEnvKey: string;
  clientSecretEnvKey: string;
  requestEncoding: OAuthTokenRequestEncoding;
  clientAuthentication: OAuthClientAuthentication;
  credentialKeys: OAuthCredentialKeys;
  responseFields: OAuthResponseFields;
  additionalHeaders?: Record<string, string>;
  additionalRefreshParams?: Record<string, string>;
  additionalResponseCredentialMappings?: Record<string, string>;
  refreshSkewMs?: number;
  refreshWithoutExpiry?: boolean;
  defaultExpiresInSeconds?: number | null;
  terminalErrorCodes?: string[];
}

export interface OAuthProviderConfig {
  slug: string;
  authorizationUrl: string;
  refresh?: OAuthRefreshConfig;
}

const MICROSOFT_AUTHORIZE_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const NOTION_AUTHORIZE_URL = "https://api.notion.com/v1/oauth/authorize";
const NOTION_TOKEN_URL = "https://api.notion.com/v1/oauth/token";
const GOOGLE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export const OAUTH_PROVIDER_CONFIGS: Record<string, OAuthProviderConfig> = {
  gmail: {
    slug: "gmail",
    authorizationUrl: GOOGLE_AUTHORIZE_URL,
    refresh: {
      displayName: "Gmail",
      usesRefreshTokens: true,
      tokenEndpoint: GOOGLE_TOKEN_URL,
      clientIdEnvKey: "GMAIL_CLIENT_ID",
      clientSecretEnvKey: "GMAIL_CLIENT_SECRET",
      requestEncoding: "form",
      clientAuthentication: "body",
      credentialKeys: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        expiresAt: "expiresAt",
        tokenType: "tokenType",
        scope: "scope",
      },
      responseFields: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        expiresIn: "expires_in",
        tokenType: "token_type",
        scope: "scope",
        error: "error",
        errorDescription: "error_description",
      },
      refreshSkewMs: 5 * 60 * 1000,
      refreshWithoutExpiry: true,
      defaultExpiresInSeconds: 3600,
      terminalErrorCodes: ["invalid_grant"],
    },
  },
  notion: {
    slug: "notion",
    authorizationUrl: NOTION_AUTHORIZE_URL,
    refresh: {
      displayName: "Notion",
      usesRefreshTokens: true,
      tokenEndpoint: NOTION_TOKEN_URL,
      clientIdEnvKey: "NOTION_CLIENT_ID",
      clientSecretEnvKey: "NOTION_CLIENT_SECRET",
      requestEncoding: "json",
      clientAuthentication: "basic",
      credentialKeys: {
        accessToken: "integrationToken",
        refreshToken: "refreshToken",
        expiresAt: "expiresAt",
        tokenType: "tokenType",
      },
      responseFields: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        expiresIn: "expires_in",
        tokenType: "token_type",
        error: "error",
        errorDescription: "message",
      },
      additionalResponseCredentialMappings: {
        bot_id: "botId",
        workspace_icon: "workspaceIcon",
        workspace_name: "workspaceName",
        workspace_id: "workspaceId",
        duplicated_template_id: "duplicatedTemplateId",
      },
      refreshSkewMs: 5 * 60 * 1000,
      refreshWithoutExpiry: false,
      terminalErrorCodes: ["invalid_grant"],
    },
  },
  outlook: {
    slug: "outlook",
    authorizationUrl: MICROSOFT_AUTHORIZE_URL,
    refresh: {
      displayName: "Outlook",
      usesRefreshTokens: true,
      tokenEndpoint: MICROSOFT_TOKEN_URL,
      clientIdEnvKey: "OUTLOOK_CLIENT_ID",
      clientSecretEnvKey: "OUTLOOK_CLIENT_SECRET",
      requestEncoding: "form",
      clientAuthentication: "body",
      credentialKeys: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        expiresAt: "expiresAt",
        tokenType: "tokenType",
        scope: "scope",
      },
      responseFields: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        expiresIn: "expires_in",
        tokenType: "token_type",
        scope: "scope",
        error: "error",
        errorDescription: "error_description",
      },
      refreshSkewMs: 5 * 60 * 1000,
      refreshWithoutExpiry: true,
      defaultExpiresInSeconds: 3600,
      terminalErrorCodes: ["invalid_grant"],
    },
  },
};

export function getOAuthProviderConfig(slug: string): OAuthProviderConfig | undefined {
  return OAUTH_PROVIDER_CONFIGS[slug];
}

export function getOAuthRefreshConfig(slug: string): OAuthRefreshConfig | undefined {
  return OAUTH_PROVIDER_CONFIGS[slug]?.refresh;
}

export function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function encodeBasicAuthValue(username: string, password: string): string {
  const value = `${username}:${password}`;

  if (typeof btoa === "function") {
    return btoa(value);
  }

  return Buffer.from(value).toString("base64");
}

export function getOAuthPayloadString(
  payload: Record<string, unknown> | null | undefined,
  fieldName: string | undefined,
): string | undefined {
  if (!payload || !fieldName) {
    return undefined;
  }

  return safeTrim(payload[fieldName]);
}

export function getOAuthErrorMessage(
  provider: string,
  refreshConfig: OAuthRefreshConfig,
  payload: Record<string, unknown> | null | undefined,
  response: Response,
): string {
  const error = getOAuthPayloadString(payload, refreshConfig.responseFields.error);
  const description = getOAuthPayloadString(payload, refreshConfig.responseFields.errorDescription);

  if (error && description) {
    return `${provider} OAuth failed: ${error} (${description})`;
  }

  if (error) {
    return `${provider} OAuth failed: ${error}`;
  }

  if (description) {
    return `${provider} OAuth failed: ${description}`;
  }

  return `${provider} OAuth failed with status ${response.status}`;
}
