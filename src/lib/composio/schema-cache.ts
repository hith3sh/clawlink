/**
 * KV-backed cache for Composio tool inputSchema objects.
 *
 * Static manifests ship without inputSchema to keep the worker bundle small.
 * This module lazily fetches schemas from Composio's API per-toolkit and
 * caches them in Cloudflare KV (the shared CREDENTIALS namespace).
 *
 * Cache key format: `composio-schema:<integrationSlug>:<toolkitVersion>`
 * TTL: 24 hours (schemas rarely change between toolkit version bumps)
 */

import { fetchComposioToolSchemas, getComposioToolkitVersion } from "./backend-client";

const CACHE_TTL_SECONDS = 86_400; // 24 hours
const STALE_AFTER_SECONDS = 21_600; // 6 hours
const CACHE_KEY_PREFIX = "composio-schema:";

interface SchemaCacheEntry {
  fetchedAt: number;
  schemas: Map<string, Record<string, unknown>>;
}

interface SerializedSchemaCacheEntry {
  fetchedAt: number;
  schemas: Record<string, Record<string, unknown>>;
}

export interface KvNamespaceLike {
  get(key: string, type?: "text"): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

/** In-memory process cache so we don't hit KV repeatedly between nearby requests. */
const memoryCache = new Map<string, SchemaCacheEntry>();
const refreshInFlight = new Map<string, Promise<Map<string, Record<string, unknown>>>>();

function cacheKey(
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
): string {
  return `${CACHE_KEY_PREFIX}${integrationSlug}:${getComposioToolkitVersion(env, integrationSlug)}`;
}

function nowMs(): number {
  return Date.now();
}

function isStale(fetchedAt: number): boolean {
  return nowMs() - fetchedAt >= STALE_AFTER_SECONDS * 1000;
}

function serializeCacheEntry(entry: SchemaCacheEntry): string {
  return JSON.stringify({
    fetchedAt: entry.fetchedAt,
    schemas: Object.fromEntries(entry.schemas),
  } satisfies SerializedSchemaCacheEntry);
}

function parseCacheEntry(stored: string): SchemaCacheEntry {
  const parsed = JSON.parse(stored) as
    | SerializedSchemaCacheEntry
    | Record<string, Record<string, unknown>>;

  if (
    parsed &&
    typeof parsed === "object" &&
    "schemas" in parsed &&
    parsed.schemas &&
    typeof parsed.schemas === "object" &&
    typeof parsed.fetchedAt === "number"
  ) {
    return {
      fetchedAt: parsed.fetchedAt,
      schemas: new Map(
        Object.entries(parsed.schemas as Record<string, Record<string, unknown>>),
      ),
    };
  }

  // Backward compatibility for older raw-schema KV entries. Serve them immediately
  // and force a background refresh because they lack a fetch timestamp.
  return {
    fetchedAt: 0,
    schemas: new Map(Object.entries(parsed as Record<string, Record<string, unknown>>)),
  };
}

async function refreshSchemas(
  kv: KvNamespaceLike | null | undefined,
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
  key: string,
): Promise<Map<string, Record<string, unknown>>> {
  const existing = refreshInFlight.get(key);
  if (existing) {
    return existing;
  }

  const refreshPromise = (async () => {
    const schemas = await fetchComposioToolSchemas(env, integrationSlug);
    const entry: SchemaCacheEntry = {
      fetchedAt: nowMs(),
      schemas,
    };

    memoryCache.set(key, entry);

    if (kv) {
      await kv.put(key, serializeCacheEntry(entry), {
        expirationTtl: CACHE_TTL_SECONDS,
      });
    }

    return schemas;
  })();

  refreshInFlight.set(key, refreshPromise);

  try {
    return await refreshPromise;
  } finally {
    refreshInFlight.delete(key);
  }
}

function triggerBackgroundRefresh(
  kv: KvNamespaceLike | null | undefined,
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
  key: string,
): void {
  void refreshSchemas(kv, env, integrationSlug, key).catch(() => {
    // Best-effort refresh only; stale cache remains usable until TTL expiry.
  });
}

/**
 * Resolve input schemas for every tool in a Composio-backed integration.
 *
 * Returns a map of uppercase tool slug (e.g. "GMAIL_SEND_EMAIL") to JSON
 * Schema objects. The lookup order is:
 *
 *   1. In-memory per-request cache
 *   2. KV cache
 *   3. Composio API (result is written back to KV + memory)
 */
export async function resolveToolSchemas(
  kv: KvNamespaceLike | null | undefined,
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
): Promise<Map<string, Record<string, unknown>>> {
  const key = cacheKey(env, integrationSlug);

  // 1. Memory cache
  const memoryCached = memoryCache.get(key);
  if (memoryCached) {
    if (isStale(memoryCached.fetchedAt)) {
      triggerBackgroundRefresh(kv, env, integrationSlug, key);
    }

    return memoryCached.schemas;
  }

  // 2. KV cache
  if (kv) {
    try {
      const stored = await kv.get(key, "text");
      if (stored) {
        const entry = parseCacheEntry(stored);
        memoryCache.set(key, entry);

        if (isStale(entry.fetchedAt)) {
          triggerBackgroundRefresh(kv, env, integrationSlug, key);
        }

        return entry.schemas;
      }
    } catch {
      // KV read failed or JSON was corrupt — fall through to API fetch.
    }
  }

  // 3. Fetch from Composio API
  return refreshSchemas(kv, env, integrationSlug, key);
}

/**
 * Check whether a tool's inputSchema is the empty stub set by the manifest
 * generator. Composio manifest tools ship with `{ type: "object", properties: {} }`
 * and need runtime hydration.
 */
export function isStubSchema(schema: Record<string, unknown>): boolean {
  if (!schema || typeof schema !== "object") return true;

  const props = schema.properties;
  if (!props || typeof props !== "object") return true;

  return Object.keys(props).length === 0;
}

/**
 * Clear the in-memory cache. Useful in tests or after long-running workers
 * that may accumulate stale entries.
 */
export function clearSchemaMemoryCache(): void {
  memoryCache.clear();
  refreshInFlight.clear();
}
