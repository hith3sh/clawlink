import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { UserRow } from "@/lib/server/integration-store";
import { getEnvBinding } from "@/lib/server/integration-store";
import type { NangoConnectionResponse } from "@/lib/nango/credentials";

interface NangoConnectSessionResponse {
  data?: {
    token?: string;
    expires_at?: string;
    connect_link?: string;
  };
  error?: {
    message?: string;
  };
}

interface NangoWebhookPayload {
  type?: string;
  operation?: string;
  success?: boolean;
  connectionId?: string;
  providerConfigKey?: string;
  provider?: string;
  tags?: Record<string, string>;
  error?: {
    type?: string;
    description?: string;
  };
}

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  return value?.replace(/\/+$/, "");
}

function getNangoBaseUrl(): string | undefined {
  return normalizeBaseUrl(getEnvBinding<string>("NANGO_BASE_URL"));
}

function getNangoSecretKey(): string | undefined {
  return safeTrim(getEnvBinding<string>("NANGO_SECRET_KEY"));
}

function getNangoWebhookSecret(): string | undefined {
  return safeTrim(getEnvBinding<string>("NANGO_WEBHOOK_SECRET")) ?? getNangoSecretKey();
}

function toProviderKeySuffix(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function buildErrorMessage(response: Response, payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return `${fallback}: ${payload.trim()}`;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message =
      safeTrim(record.message) ??
      safeTrim((record.error as Record<string, unknown> | undefined)?.message);

    if (message) {
      return `${fallback}: ${message}`;
    }
  }

  return `${fallback}: ${response.status} ${response.statusText}`;
}

async function nangoFetch<T>(
  path: string,
  init: RequestInit,
  fallbackError: string,
): Promise<T> {
  const baseUrl = getNangoBaseUrl();
  const secretKey = getNangoSecretKey();

  if (!baseUrl || !secretKey) {
    throw new Error("Nango is not configured. Set NANGO_BASE_URL and NANGO_SECRET_KEY.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  const rawText = await response.text();
  const payload = rawText
    ? (() => {
        try {
          return JSON.parse(rawText) as unknown;
        } catch {
          return rawText;
        }
      })()
    : null;

  if (!response.ok) {
    throw new Error(buildErrorMessage(response, payload, fallbackError));
  }

  return payload as T;
}

export function isNangoConfiguredForIntegration(slug: string): boolean {
  return Boolean(getNangoBaseUrl() && getNangoSecretKey() && getNangoProviderConfigKey(slug));
}

export function getNangoProviderConfigKey(slug: string): string {
  const override = safeTrim(
    getEnvBinding<string>(`NANGO_PROVIDER_CONFIG_KEY_${toProviderKeySuffix(slug)}`),
  );

  return override ?? slug;
}

export async function createNangoConnectSession(params: {
  integrationSlug: string;
  sessionToken: string;
  user: UserRow;
}): Promise<{ token: string; expiresAt: string | null; connectLink: string; providerConfigKey: string }> {
  const providerConfigKey = getNangoProviderConfigKey(params.integrationSlug);
  const payload = await nangoFetch<NangoConnectSessionResponse>(
    "/connect/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: {
          clawlink_session_token: params.sessionToken,
          clawlink_integration_slug: params.integrationSlug,
          end_user_id: params.user.id,
          end_user_email: params.user.email ?? "",
        },
        allowed_integrations: [providerConfigKey],
      }),
    },
    "Failed to create Nango connect session",
  );

  const token = safeTrim(payload.data?.token);
  const connectLink = safeTrim(payload.data?.connect_link);

  if (!token || !connectLink) {
    throw new Error("Nango created a connect session but did not return a token and connect link.");
  }

  return {
    token,
    expiresAt: safeTrim(payload.data?.expires_at) ?? null,
    connectLink,
    providerConfigKey,
  };
}

export async function getNangoConnection(
  connectionId: string,
  providerConfigKey: string,
  options: { forceRefresh?: boolean; includeRefreshToken?: boolean } = {},
): Promise<NangoConnectionResponse> {
  const params = new URLSearchParams({
    provider_config_key: providerConfigKey,
  });

  if (options.forceRefresh) {
    params.set("force_refresh", "true");
  }

  if (options.includeRefreshToken) {
    params.set("refresh_token", "true");
  }

  return nangoFetch<NangoConnectionResponse>(
    `/connections/${encodeURIComponent(connectionId)}?${params.toString()}`,
    {
      method: "GET",
    },
    "Failed to fetch Nango connection",
  );
}

export function verifyNangoWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = getNangoWebhookSecret();
  const signature = safeTrim(signatureHeader);

  if (!secret || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function parseNangoWebhookPayload(rawBody: string): NangoWebhookPayload {
  return JSON.parse(rawBody) as NangoWebhookPayload;
}
