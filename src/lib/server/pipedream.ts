import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PipedreamClient, type Pipedream } from "@pipedream/sdk";

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

function safeTrim(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeSlugKey(slug: string): string {
  return slug.replace(/[^a-z0-9]+/gi, "_").toUpperCase();
}

function parseList(value: string | undefined): Set<string> {
  return new Set(
    value
      ?.split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter(Boolean) ?? [],
  );
}

function parseMap(value: string | undefined): Map<string, string> {
  const entries = new Map<string, string>();

  for (const chunk of value?.split(/[,\n]/) ?? []) {
    const entry = chunk.trim();

    if (!entry) {
      continue;
    }

    const separatorIndex = entry.includes("=") ? entry.indexOf("=") : entry.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = entry.slice(0, separatorIndex).trim();
    const mappedValue = entry.slice(separatorIndex + 1).trim();

    if (key && mappedValue) {
      entries.set(key, mappedValue);
    }
  }

  return entries;
}

function getConfiguredAppForSlug(slug: string): string | null {
  const explicitMap = parseMap(
    getEnvValue("PIPEDREAM_APP_MAP") ?? getEnvValue("PIPEDREAM_CONNECT_APP_MAP"),
  );
  const mappedApp = explicitMap.get(slug);

  if (mappedApp) {
    return mappedApp;
  }

  const envSpecificApp = safeTrim(
    getEnvValue(`PIPEDREAM_APP_${normalizeSlugKey(slug)}`),
  );

  if (envSpecificApp) {
    return envSpecificApp;
  }

  const enabledSlugs = parseList(
    getEnvValue("PIPEDREAM_CONNECT_SLUGS") ?? getEnvValue("PIPEDREAM_INTEGRATIONS"),
  );

  if (enabledSlugs.has(slug)) {
    return slug;
  }

  return null;
}

function readIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function getRequiredConfig() {
  const clientId = safeTrim(getEnvValue("PIPEDREAM_CLIENT_ID"));
  const clientSecret = safeTrim(getEnvValue("PIPEDREAM_CLIENT_SECRET"));
  const projectId = safeTrim(getEnvValue("PIPEDREAM_PROJECT_ID"));
  const projectEnvironment =
    safeTrim(getEnvValue("PIPEDREAM_PROJECT_ENVIRONMENT")) ??
    safeTrim(getEnvValue("PIPEDREAM_ENVIRONMENT")) ??
    "production";

  if (!clientId || !clientSecret || !projectId) {
    throw new Error("Pipedream is not configured for this environment.");
  }

  return {
    clientId,
    clientSecret,
    projectId,
    projectEnvironment: projectEnvironment === "development" ? "development" : "production",
  } as const;
}

function getClient(): PipedreamClient {
  const config = getRequiredConfig();

  return new PipedreamClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    projectId: config.projectId,
    projectEnvironment: config.projectEnvironment,
  });
}

export interface PipedreamPublicClientConfig {
  enabled: boolean;
  app: string | null;
  projectEnvironment: "development" | "production";
}

export interface PipedreamConnectTokenResult {
  token: string;
  expiresAt: string | null;
  connectLinkUrl: string | null;
}

export interface PipedreamConnectionMetadata {
  connectionLabel: string | null;
  accountLabel: string | null;
  externalAccountId: string | null;
  expiresAt: string | null;
  scopes: string[] | null;
}

export function getPublicPipedreamClientConfig(slug?: string): PipedreamPublicClientConfig {
  const clientId = safeTrim(getEnvValue("PIPEDREAM_CLIENT_ID"));
  const clientSecret = safeTrim(getEnvValue("PIPEDREAM_CLIENT_SECRET"));
  const projectId = safeTrim(getEnvValue("PIPEDREAM_PROJECT_ID"));
  const projectEnvironment =
    safeTrim(getEnvValue("PIPEDREAM_PROJECT_ENVIRONMENT")) ??
    safeTrim(getEnvValue("PIPEDREAM_ENVIRONMENT")) ??
    "production";
  const app = slug ? getConfiguredAppForSlug(slug) : null;

  return {
    enabled: Boolean(clientId && clientSecret && projectId && (!slug || app)),
    app,
    projectEnvironment: projectEnvironment === "development" ? "development" : "production",
  };
}

export async function mintPipedreamConnectToken(params: {
  externalUserId: string;
  allowedOrigins?: string[];
  webhookUri?: string;
  successRedirectUri?: string;
  errorRedirectUri?: string;
  expiresIn?: number;
}): Promise<PipedreamConnectTokenResult> {
  const client = getClient();
  const response = await client.tokens.create({
    externalUserId: params.externalUserId,
    allowedOrigins: params.allowedOrigins,
    webhookUri: params.webhookUri,
    successRedirectUri: params.successRedirectUri,
    errorRedirectUri: params.errorRedirectUri,
    expiresIn: params.expiresIn,
  });

  return {
    token: response.token,
    expiresAt: readIsoDate(response.expiresAt),
    connectLinkUrl: response.connectLinkUrl ?? null,
  };
}

export function isPipedreamManagedIntegration(slug: string): boolean {
  return getPublicPipedreamClientConfig(slug).enabled;
}

export async function createPipedreamConnectToken(params: {
  integrationSlug: string;
  externalUserId: string;
  allowedOrigins?: string[];
  webhookUri?: string;
  successRedirectUri?: string;
  errorRedirectUri?: string;
  expiresIn?: number;
}): Promise<PipedreamConnectTokenResult & { app: string; projectEnvironment: "development" | "production" }> {
  const publicConfig = getPublicPipedreamClientConfig(params.integrationSlug);

  if (!publicConfig.app || !publicConfig.enabled) {
    throw new Error(`${params.integrationSlug} is not configured for Pipedream Connect.`);
  }

  const token = await mintPipedreamConnectToken({
    externalUserId: params.externalUserId,
    allowedOrigins: params.allowedOrigins,
    webhookUri: params.webhookUri,
    successRedirectUri: params.successRedirectUri,
    errorRedirectUri: params.errorRedirectUri,
    expiresIn: params.expiresIn,
  });

  return {
    ...token,
    app: publicConfig.app,
    projectEnvironment: publicConfig.projectEnvironment,
  };
}

export async function getPipedreamAccount(
  accountId: string,
): Promise<Pipedream.Account> {
  const client = getClient();
  return client.accounts.retrieve(accountId);
}

export async function deletePipedreamAccount(accountId: string): Promise<void> {
  if (!accountId.trim()) {
    return;
  }

  const client = getClient();
  await client.accounts.delete(accountId);
}

export function derivePipedreamConnectionMetadata(
  account: Pipedream.Account,
  fallbackLabel: string,
): PipedreamConnectionMetadata {
  const appName =
    typeof account.app?.name === "string" && account.app.name.trim()
      ? account.app.name.trim()
      : fallbackLabel;
  const accountName =
    typeof account.name === "string" && account.name.trim()
      ? account.name.trim()
      : null;
  const externalId =
    typeof account.externalId === "string" && account.externalId.trim()
      ? account.externalId.trim()
      : null;
  const primaryLabel = accountName ?? externalId ?? appName;

  return {
    connectionLabel: primaryLabel,
    accountLabel: primaryLabel,
    externalAccountId: externalId ?? account.id,
    expiresAt: readIsoDate(account.expiresAt),
    scopes:
      Array.isArray(account.authorizedScopes) && account.authorizedScopes.length > 0
        ? account.authorizedScopes
        : null,
  };
}
