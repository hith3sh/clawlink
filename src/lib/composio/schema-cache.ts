/**
 * KV-backed cache for Composio tool inputSchema objects.
 *
 * Static manifests ship without inputSchema to keep the worker bundle small.
 * This module lazily fetches schemas from Composio's API per-toolkit and
 * caches them in Cloudflare KV (the shared CREDENTIALS namespace).
 *
 * Cache key format: `composio-schema:<integrationSlug>`
 * TTL: 24 hours (schemas rarely change between toolkit version bumps)
 */

import { fetchComposioToolSchemas } from "./backend-client";

const CACHE_TTL_SECONDS = 86_400; // 24 hours
const CACHE_KEY_PREFIX = "composio-schema:";

export interface KvNamespaceLike {
  get(key: string, type?: "text"): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

/** In-memory per-request cache so we don't hit KV multiple times in one request. */
const memoryCache = new Map<string, Map<string, Record<string, unknown>>>();

function cacheKey(integrationSlug: string): string {
  return `${CACHE_KEY_PREFIX}${integrationSlug}`;
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
  // 1. Memory cache (avoids repeated KV reads within the same request)
  const memoryCached = memoryCache.get(integrationSlug);
  if (memoryCached) {
    return memoryCached;
  }

  // 2. KV cache
  if (kv) {
    try {
      const stored = await kv.get(cacheKey(integrationSlug), "text");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Record<string, unknown>>;
        const map = new Map(Object.entries(parsed));
        memoryCache.set(integrationSlug, map);
        return map;
      }
    } catch {
      // KV read failed or JSON was corrupt — fall through to API fetch.
    }
  }

  // 3. Fetch from Composio API
  const schemas = await fetchComposioToolSchemas(env, integrationSlug);

  // Write back to memory cache immediately.
  memoryCache.set(integrationSlug, schemas);

  // Write back to KV asynchronously (best-effort).
  if (kv) {
    const serialized = JSON.stringify(Object.fromEntries(schemas));
    // Fire-and-forget — we don't block the response on KV write.
    kv.put(cacheKey(integrationSlug), serialized, {
      expirationTtl: CACHE_TTL_SECONDS,
    }).catch(() => {
      // Swallow KV write errors silently.
    });
  }

  return schemas;
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
}
