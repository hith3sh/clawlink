import {
  PipedreamClient,
  PipedreamError,
  ProjectEnvironment,
  TooManyRequestsError,
} from "@pipedream/sdk";

export type PipedreamProxyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface PipedreamProxyConfig {
  clientId: string;
  clientSecret: string;
  projectId: string;
  baseUrl?: string;
  projectEnvironment?: ProjectEnvironment;
}

export interface PipedreamProxyRequestOptions {
  accountId: string;
  externalUserId: string;
  env?: Record<string, unknown>;
  url?: string;
  path?: string;
  baseUrl?: string;
  method?: PipedreamProxyMethod;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  timeoutInSeconds?: number;
}

let cachedClientKey: string | null = null;
let cachedClient: PipedreamClient | null = null;

type RawResponseLike = {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
};

type ProxyResultLike = {
  data?: unknown;
  rawResponse: RawResponseLike;
};

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

function readConfig(env?: Record<string, unknown>): PipedreamProxyConfig {
  const clientId = readEnvValue(env, "PIPEDREAM_CLIENT_ID");
  const clientSecret = readEnvValue(env, "PIPEDREAM_CLIENT_SECRET");
  const projectId = readEnvValue(env, "PIPEDREAM_PROJECT_ID");
  const baseUrl = readEnvValue(env, "PIPEDREAM_BASE_URL");

  if (!clientId || !clientSecret || !projectId) {
    throw new Error(
      "Pipedream proxy is not configured. Expected PIPEDREAM_CLIENT_ID, PIPEDREAM_CLIENT_SECRET, and PIPEDREAM_PROJECT_ID.",
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

function getClient(env?: Record<string, unknown>): PipedreamClient {
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

function resolveTargetUrl(options: PipedreamProxyRequestOptions): string {
  const directUrl = safeTrim(options.url);
  if (directUrl) {
    return directUrl;
  }

  const relativePath = safeTrim(options.path);
  if (!relativePath) {
    throw new Error("Pipedream proxy requests require either a full url or a relative path.");
  }

  const baseUrl = safeTrim(options.baseUrl);
  if (!baseUrl) {
    throw new Error("Pipedream proxy requests with a relative path require a baseUrl.");
  }

  return new URL(relativePath, ensureTrailingSlash(baseUrl)).toString();
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeParams(
  params: Record<string, unknown> | undefined,
): Record<string, string | string[] | object | object[] | null> | undefined {
  if (!params) {
    return undefined;
  }

  const normalized: Record<string, string | string[] | object | object[] | null> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    if (value === null) {
      normalized[key] = null;
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = value.map((item) =>
        item !== null && typeof item === "object" ? item : String(item),
      );
      continue;
    }

    normalized[key] =
      typeof value === "object"
        ? (value as object)
        : String(value);
  }

  return normalized;
}

function toResponseBody(data: unknown, headers: Headers): BodyInit | null {
  if (data == null) {
    return null;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    const copy = new Uint8Array(data.byteLength);
    copy.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    return copy.buffer;
  }

  if (typeof Blob !== "undefined" && data instanceof Blob) {
    return data;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  return JSON.stringify(data);
}

function responseFromResult(result: ProxyResultLike): Response {
  const headers = new Headers(result.rawResponse.headers);
  const body = toResponseBody(result.data, headers);

  return new Response(body, {
    status: result.rawResponse.status ?? 200,
    statusText: result.rawResponse.statusText,
    headers,
  });
}

function responseFromError(error: PipedreamError): Response {
  const headers = new Headers(error.rawResponse?.headers);
  const body = toResponseBody(error.body ?? error.message, headers);

  return new Response(body, {
    status: error.statusCode ?? error.rawResponse?.status ?? 502,
    statusText: error.rawResponse?.statusText,
    headers,
  });
}

function requireJsonObjectBody(body: Record<string, unknown> | undefined): Record<string, unknown> {
  return body ?? {};
}

export async function pipedreamProxyRequest(
  options: PipedreamProxyRequestOptions,
): Promise<Response> {
  const accountId = safeTrim(options.accountId);
  const externalUserId = safeTrim(options.externalUserId);

  if (!accountId) {
    throw new Error("Pipedream proxy requests require an accountId.");
  }

  if (!externalUserId) {
    throw new Error("Pipedream proxy requests require an externalUserId.");
  }

  const client = getClient(options.env);
  const method = options.method ?? "GET";
  const request = {
    url: resolveTargetUrl(options),
    accountId,
    externalUserId,
    params: normalizeParams(options.params),
    headers: options.headers,
  };
  const requestOptions = {
    timeoutInSeconds: options.timeoutInSeconds,
  };

  try {
    switch (method) {
      case "GET":
        return responseFromResult(await client.proxy.get(request, requestOptions) as ProxyResultLike);
      case "DELETE":
        return responseFromResult(await client.proxy.delete(request, requestOptions) as ProxyResultLike);
      case "POST":
        return responseFromResult(
          await client.proxy.post(
            { ...request, body: requireJsonObjectBody(options.body) },
            requestOptions,
          ) as ProxyResultLike,
        );
      case "PUT":
        return responseFromResult(
          await client.proxy.put(
            { ...request, body: requireJsonObjectBody(options.body) },
            requestOptions,
          ) as ProxyResultLike,
        );
      case "PATCH":
        return responseFromResult(
          await client.proxy.patch(
            { ...request, body: requireJsonObjectBody(options.body) },
            requestOptions,
          ) as ProxyResultLike,
        );
      default:
        throw new Error(`Unsupported Pipedream proxy method: ${method}`);
    }
  } catch (error) {
    if (error instanceof TooManyRequestsError || error instanceof PipedreamError) {
      return responseFromError(error);
    }

    throw error;
  }
}
