import { PipedreamClient, ProjectEnvironment } from "@pipedream/sdk";

interface PipedreamBackendConfig {
  clientId: string;
  clientSecret: string;
  projectId: string;
  baseUrl?: string;
  projectEnvironment?: ProjectEnvironment;
}

let cachedClientKey: string | null = null;
let cachedClient: PipedreamClient | null = null;

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readEnvValue(
  env: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const envValue = safeTrim(env?.[key]);

  if (envValue) {
    return envValue;
  }

  if (typeof process !== "undefined") {
    return safeTrim(process.env[key]) ?? undefined;
  }

  return undefined;
}

function readProjectEnvironment(env?: Record<string, unknown>): ProjectEnvironment | undefined {
  const raw =
    readEnvValue(env, "PIPEDREAM_PROJECT_ENVIRONMENT") ??
    readEnvValue(env, "PIPEDREAM_ENVIRONMENT");

  if (!raw) {
    return undefined;
  }

  if (raw.toLowerCase() === ProjectEnvironment.Development) {
    return ProjectEnvironment.Development;
  }

  return ProjectEnvironment.Production;
}

function readConfig(env?: Record<string, unknown>): PipedreamBackendConfig {
  const clientId = readEnvValue(env, "PIPEDREAM_CLIENT_ID");
  const clientSecret = readEnvValue(env, "PIPEDREAM_CLIENT_SECRET");
  const projectId = readEnvValue(env, "PIPEDREAM_PROJECT_ID");
  const baseUrl = readEnvValue(env, "PIPEDREAM_BASE_URL");

  if (!clientId || !clientSecret || !projectId) {
    throw new Error(
      "Pipedream is not configured. Expected PIPEDREAM_CLIENT_ID, PIPEDREAM_CLIENT_SECRET, and PIPEDREAM_PROJECT_ID.",
    );
  }

  return {
    clientId,
    clientSecret,
    projectId,
    baseUrl,
    projectEnvironment: readProjectEnvironment(env),
  };
}

export function getPipedreamBackendClient(env?: Record<string, unknown>): PipedreamClient {
  const config = readConfig(env);
  const cacheKey = JSON.stringify(config);

  if (cachedClient && cachedClientKey === cacheKey) {
    return cachedClient;
  }

  cachedClientKey = cacheKey;
  cachedClient = new PipedreamClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    projectId: config.projectId,
    baseUrl: config.baseUrl,
    projectEnvironment: config.projectEnvironment,
  });

  return cachedClient;
}
