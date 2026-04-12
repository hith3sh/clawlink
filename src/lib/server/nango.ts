import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIntegrationBySlug } from "@/data/integrations";
import { getNangoBaseUrl, getNangoProviderConfigKey, getNangoPublicBaseUrl, getNangoPublicKey, getNangoSecretKey } from "@/lib/nango/config";
import type { IntegrationConnectionRecord } from "@/lib/server/integration-store";

interface NangoConnectSessionResponse {
  data?: {
    token?: string;
    connect_link?: string;
    expires_at?: string;
  };
}

interface NangoListConnectionsResponse {
  connections?: Array<{
    connection_id?: string;
    provider_config_key?: string;
    created?: string;
  }>;
}

interface NangoConnectionResponse {
  connection_id?: string;
  provider_config_key?: string;
  metadata?: Record<string, unknown> | null;
  end_user?: {
    id?: string;
    email?: string;
    display_name?: string;
  } | null;
  credentials?: Record<string, unknown>;
}

export interface NangoPublicClientConfig {
  enabled: boolean;
  baseUrl: string | null;
  apiUrl: string | null;
  publicKey: string | null;
  providerConfigKey: string | null;
}

export interface NangoConnectSessionResult {
  sessionToken: string;
  connectLink: string | null;
  expiresAt: string | null;
}

export interface NangoSessionConnectionSummary {
  connectionId: string;
  providerConfigKey: string;
  createdAt: string | null;
}

export interface NangoConnectionDetails {
  connectionId: string;
  providerConfigKey: string;
  metadata: Record<string, unknown> | null;
  endUser: {
    id: string | null;
    email: string | null;
    displayName: string | null;
  } | null;
  credentials: Record<string, unknown>;
}

function getEnvValue(key: string): string | undefined {
  try {
    const context = getCloudflareContext({ async: false }) as unknown as
      | { env?: Record<string, unknown> }
      | undefined;
    const contextValue = context?.env?.[key];

    if (typeof contextValue === "string") {
      return contextValue;
    }
  } catch {
    // Fall through to process.env below.
  }

  const processValue = (process.env as Record<string, unknown>)[key];
  return typeof processValue === "string" ? processValue : undefined;
}

function getRequiredServerConfig() {
  const baseUrl = getNangoBaseUrl(getEnvValue);
  const secretKey = getNangoSecretKey(getEnvValue);

  if (!baseUrl || !secretKey) {
    throw new Error("Nango is not configured for this environment.");
  }

  return { baseUrl, secretKey };
}

function getOptionalProviderConfigKey(slug: string): string | null {
  return getNangoProviderConfigKey(slug, getEnvValue);
}

function getRequiredProviderConfigKey(slug: string): string {
  const providerConfigKey = getOptionalProviderConfigKey(slug);

  if (!providerConfigKey) {
    const integration = getIntegrationBySlug(slug);
    const name = integration?.name ?? slug;
    throw new Error(`${name} is not configured in Nango yet.`);
  }

  return providerConfigKey;
}

async function nangoRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { baseUrl, secretKey } = getRequiredServerConfig();
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${secretKey}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const rawPayload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!response.ok) {
    const message =
      (typeof rawPayload?.message === "string" && rawPayload.message) ||
      (typeof rawPayload?.error === "string" && rawPayload.error) ||
      `Nango request failed with status ${response.status}`;
    throw new Error(message);
  }

  return rawPayload as T;
}

export function getPublicNangoClientConfig(
  slug: string,
): NangoPublicClientConfig {
  const providerConfigKey = getOptionalProviderConfigKey(slug);
  const baseUrl = getNangoPublicBaseUrl(getEnvValue);
  const apiUrl = getNangoBaseUrl(getEnvValue);

  return {
    enabled: Boolean(baseUrl && apiUrl && providerConfigKey),
    baseUrl,
    apiUrl,
    publicKey: getNangoPublicKey(getEnvValue),
    providerConfigKey,
  };
}

export function isNangoManagedIntegration(slug: string): boolean {
  return Boolean(getNangoPublicBaseUrl(getEnvValue) && getOptionalProviderConfigKey(slug));
}

export async function createNangoConnectSession(params: {
  sessionId: string;
  userId: string;
  integrationSlug: string;
  reconnectConnection?: Pick<
    IntegrationConnectionRecord,
    "nangoConnectionId" | "nangoProviderConfigKey"
  > | null;
}): Promise<NangoConnectSessionResult> {
  const providerConfigKey = getRequiredProviderConfigKey(params.integrationSlug);

  const payload =
    params.reconnectConnection?.nangoConnectionId &&
    params.reconnectConnection.nangoProviderConfigKey
      ? {
          connection_id: params.reconnectConnection.nangoConnectionId,
          integration_id: params.reconnectConnection.nangoProviderConfigKey,
          end_user: {
            id: params.userId,
          },
          tags: {
            clawlink_session_id: params.sessionId,
            clawlink_user_id: params.userId,
            clawlink_integration: params.integrationSlug,
          },
        }
      : {
          allowed_integrations: [providerConfigKey],
          end_user: {
            id: params.userId,
          },
          tags: {
            clawlink_session_id: params.sessionId,
            clawlink_user_id: params.userId,
            clawlink_integration: params.integrationSlug,
          },
        };

  const response = await nangoRequest<NangoConnectSessionResponse>(
    params.reconnectConnection?.nangoConnectionId &&
      params.reconnectConnection.nangoProviderConfigKey
      ? "/connect/sessions/reconnect"
      : "/connect/sessions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const sessionToken = response.data?.token?.trim();

  if (!sessionToken) {
    throw new Error("Nango did not return a connect session token.");
  }

  return {
    sessionToken,
    connectLink: response.data?.connect_link?.trim() ?? null,
    expiresAt: response.data?.expires_at?.trim() ?? null,
  };
}

export async function listNangoConnectionsForSession(params: {
  sessionId: string;
  userId: string;
  integrationSlug: string;
}): Promise<NangoSessionConnectionSummary[]> {
  const providerConfigKey = getRequiredProviderConfigKey(params.integrationSlug);
  const query = new URLSearchParams({
    integrationId: providerConfigKey,
    endUserId: params.userId,
    limit: "10",
    "tags[clawlink_session_id]": params.sessionId,
  });

  const response = await nangoRequest<NangoListConnectionsResponse>(
    `/connections?${query.toString()}`,
  );

  return (response.connections ?? [])
    .map((connection) => ({
      connectionId: connection.connection_id?.trim() ?? "",
      providerConfigKey:
        connection.provider_config_key?.trim() ?? providerConfigKey,
      createdAt: connection.created?.trim() ?? null,
    }))
    .filter(
      (connection) =>
        connection.connectionId.length > 0 &&
        connection.providerConfigKey.length > 0,
    )
    .sort((left, right) => {
      const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0;
      const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0;
      return rightTime - leftTime;
    });
}

export async function getNangoConnection(
  providerConfigKey: string,
  connectionId: string,
  options: { forceRefresh?: boolean; includeRefreshToken?: boolean } = {},
): Promise<NangoConnectionDetails> {
  const query = new URLSearchParams({
    provider_config_key: providerConfigKey,
    ...(options.forceRefresh ? { force_refresh: "true" } : {}),
    ...(options.includeRefreshToken ? { refresh_token: "true" } : {}),
  });

  const response = await nangoRequest<NangoConnectionResponse>(
    `/connection/${encodeURIComponent(connectionId)}?${query.toString()}`,
  );

  const resolvedConnectionId = response.connection_id?.trim() ?? connectionId;
  const resolvedProviderConfigKey =
    response.provider_config_key?.trim() ?? providerConfigKey;

  return {
    connectionId: resolvedConnectionId,
    providerConfigKey: resolvedProviderConfigKey,
    metadata:
      response.metadata && typeof response.metadata === "object"
        ? response.metadata
        : null,
    endUser: response.end_user
      ? {
          id: response.end_user.id?.trim() ?? null,
          email: response.end_user.email?.trim() ?? null,
          displayName: response.end_user.display_name?.trim() ?? null,
        }
      : null,
    credentials:
      response.credentials && typeof response.credentials === "object"
        ? response.credentials
        : {},
  };
}

export async function deleteNangoConnection(
  providerConfigKey: string,
  connectionId: string,
): Promise<void> {
  await nangoRequest<{ success?: boolean }>(
    `/connection/${encodeURIComponent(connectionId)}?provider_config_key=${encodeURIComponent(providerConfigKey)}`,
    {
      method: "DELETE",
    },
  );
}
