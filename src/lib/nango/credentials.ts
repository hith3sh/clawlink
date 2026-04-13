export interface NangoConnectionResponse {
  connection_id: string;
  provider_config_key: string;
  provider: string;
  tags?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  last_fetched_at?: string | null;
  credentials: Record<string, unknown>;
  end_user?: {
    id?: string | null;
    email?: string | null;
    display_name?: string | null;
    tags?: Record<string, string>;
    organization?: {
      id?: string | null;
      display_name?: string | null;
    } | null;
  } | null;
}

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const trimmed = safeTrim(value);

    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

export function mapNangoConnectionToClawLinkCredentials(
  integrationSlug: string,
  connection: NangoConnectionResponse,
): Record<string, string> {
  const raw = isRecordObject(connection.credentials.raw) ? connection.credentials.raw : {};
  const result: Record<string, string> = {};

  const accessToken = pickString(
    connection.credentials.access_token,
    connection.credentials.token,
    raw.access_token,
    raw.accessToken,
    raw.token,
  );
  const refreshToken = pickString(
    connection.credentials.refresh_token,
    raw.refresh_token,
    raw.refreshToken,
  );
  const expiresAt = pickString(
    connection.credentials.expires_at,
    raw.expires_at,
    raw.expiresAt,
  );
  const tokenType = pickString(raw.token_type, raw.tokenType);
  const scope = pickString(raw.scope);
  const email = pickString(
    connection.end_user?.email,
    connection.tags?.end_user_email,
    connection.end_user?.tags?.end_user_email,
  );
  const displayName = pickString(
    connection.end_user?.display_name,
    connection.tags?.end_user_display_name,
    connection.end_user?.tags?.end_user_display_name,
  );

  if (accessToken) {
    result.accessToken = accessToken;
    result.access_token = accessToken;
  }

  if (refreshToken) {
    result.refreshToken = refreshToken;
  }

  if (expiresAt) {
    result.expiresAt = expiresAt;
  }

  if (tokenType) {
    result.tokenType = tokenType;
  }

  if (scope) {
    result.scope = scope;
  }

  if (displayName) {
    result.displayName = displayName;
  }

  if (integrationSlug === "gmail") {
    if (email) {
      result.primaryEmail = email;
      result.email = email;
    }
  } else if (integrationSlug === "outlook") {
    if (email) {
      result.primaryEmail = email;
      result.userPrincipalName = email;
      result.email = email;
    }
  } else if (integrationSlug === "notion") {
    const workspaceName = pickString(
      raw.workspace_name,
      raw.workspaceName,
      connection.end_user?.organization?.display_name,
      connection.provider_config_key,
    );
    const workspaceId = pickString(raw.workspace_id, raw.workspaceId);
    const botId = pickString(raw.bot_id, raw.botId);

    if (workspaceName) {
      result.workspaceName = workspaceName;
    }

    if (workspaceId) {
      result.workspaceId = workspaceId;
    }

    if (botId) {
      result.botId = botId;
    }
  }

  const accountId = pickString(
    raw.account_id,
    raw.accountId,
    raw.user_id,
    raw.userId,
    connection.end_user?.id,
  );

  if (accountId) {
    result.accountId = accountId;
  }

  return result;
}
