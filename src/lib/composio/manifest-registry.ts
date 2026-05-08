import type { IntegrationTool } from "../../../worker/integrations/base";
import { composioToolManifests } from "@/generated/composio-manifests";
import {
  applyComposioToolFieldDescriptionOverrides,
  applyComposioToolMetadataOverrides,
} from "./backend-client";
import {
  type KvNamespaceLike,
  resolveToolSchemas,
  isStubSchema,
} from "./schema-cache";

let cachedTools: IntegrationTool[] | null = null;
let cachedByName: Map<string, IntegrationTool> | null = null;

function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  const tools = composioToolManifests
    .map((tool) => {
      if (tool.execution.kind === "composio_tool") {
        applyComposioToolMetadataOverrides(tool);
      }

      return tool;
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    tools,
    byName: new Map(tools.map((tool) => [tool.name, tool])),
  };
}

function ensureCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  if (cachedTools && cachedByName) {
    return {
      tools: cachedTools,
      byName: cachedByName,
    };
  }

  const built = buildCache();
  cachedTools = built.tools;
  cachedByName = built.byName;
  return built;
}

export function getAllComposioManifestTools(): IntegrationTool[] {
  return ensureCache().tools;
}

export function getComposioManifestToolByName(toolName: string): IntegrationTool | null {
  return ensureCache().byName.get(toolName) ?? null;
}

export function listComposioManifestToolsForIntegration(
  integration: string,
): IntegrationTool[] {
  return getAllComposioManifestTools().filter((tool) => tool.integration === integration);
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function normalizeDiscoveryToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getDiscoveryCandidate(
  tool: IntegrationTool,
  integrationTools: IntegrationTool[],
  fieldName: string,
): string | null {
  const rawTokens = fieldName
    .replace(/_(id|ids|uuid|uuids|slug|slugs)$/i, "")
    .split("_")
    .filter(Boolean)
    .map(normalizeDiscoveryToken)
    .filter(
      (token) => token && !["id", "ids", "uuid", "uuids", "slug", "slugs"].includes(token),
    );

  if (rawTokens.length === 0) {
    return null;
  }

  let bestMatch: { name: string; score: number } | null = null;

  for (const candidate of integrationTools) {
    if (candidate.name === tool.name) {
      continue;
    }

    const actionName = candidate.name.slice(`${candidate.integration}_`.length);
    if (!/(^|_)(list|get|search|find)(_|$)/.test(actionName)) {
      continue;
    }

    const candidateTokens = new Set(
      actionName
        .split("_")
        .map(normalizeDiscoveryToken)
        .filter(Boolean),
    );

    let score = 0;
    for (const token of rawTokens) {
      if (candidateTokens.has(token)) {
        score += 2;
      } else if (
        [...candidateTokens].some(
          (candidateToken) =>
            candidateToken.includes(token) || token.includes(candidateToken),
        )
      ) {
        score += 1;
      }
    }

    if (score <= 0) {
      continue;
    }

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { name: candidate.name, score };
    }
  }

  return bestMatch?.name ?? null;
}

function applyDiscoveryHints(tool: IntegrationTool, integrationTools: IntegrationTool[]): void {
  const properties = tool.inputSchema.properties;
  const required = Array.isArray(tool.inputSchema.required)
    ? tool.inputSchema.required.filter((value): value is string => typeof value === "string")
    : [];

  if (!properties || typeof properties !== "object" || required.length === 0) {
    return;
  }

  const discoveredPrerequisites = [...(tool.prerequisites ?? [])];

  for (const fieldName of required) {
    if (!/_(id|uuid|slug)$/i.test(fieldName)) {
      continue;
    }

    const property = (properties as Record<string, Record<string, unknown>>)[fieldName];
    if (!property || typeof property !== "object") {
      continue;
    }

    const candidate = getDiscoveryCandidate(tool, integrationTools, fieldName);
    if (!candidate) {
      continue;
    }

    const currentDescription =
      typeof property.description === "string" ? property.description : "";
    const hint = `Try \`${candidate}\` first to obtain this value.`;

    if (!currentDescription.includes(hint)) {
      property.description = currentDescription ? `${currentDescription} ${hint}` : hint;
    }

    discoveredPrerequisites.push(candidate);
  }

  tool.prerequisites = uniqueStrings(discoveredPrerequisites);
}

/**
 * Hydrate inputSchema for a list of Composio-backed tools.
 *
 * Tools whose inputSchema is still the empty stub from the static manifest
 * will have their schema fetched from KV / Composio API and patched in-place.
 * Tools that already have a non-stub schema are left untouched.
 *
 * @param tools     The tools to hydrate (mutated in place)
 * @param kv        Cloudflare KV namespace (CREDENTIALS binding)
 * @param env       Worker env bindings (for COMPOSIO_API_KEY, etc.)
 */
export async function hydrateComposioToolSchemas(
  tools: IntegrationTool[],
  kv: KvNamespaceLike | null | undefined,
  env: Record<string, unknown> | undefined,
): Promise<void> {
  // Collect the set of integration slugs that need hydration.
  const integrationSlugs = new Set<string>();

  for (const tool of tools) {
    if (tool.execution.kind !== "composio_tool") continue;
    if (!isStubSchema(tool.inputSchema)) continue;
    integrationSlugs.add(tool.integration);
  }

  if (integrationSlugs.size === 0) return;

  // Fetch schemas for all needed integrations in parallel.
  const schemasByIntegration = new Map<string, Map<string, Record<string, unknown>>>();
  const fetches = [...integrationSlugs].map(async (slug) => {
    try {
      const schemas = await resolveToolSchemas(kv, env, slug);
      schemasByIntegration.set(slug, schemas);
    } catch (error) {
      // Log but don't fail — tools will just keep the stub schema.
      console.warn(
        `Failed to fetch Composio schemas for ${slug}:`,
        error instanceof Error ? error.message : error,
      );
    }
  });

  await Promise.all(fetches);

  // Patch tools in-place.
  const toolsByIntegration = new Map<string, IntegrationTool[]>();
  for (const tool of tools) {
    const integrationTools = toolsByIntegration.get(tool.integration) ?? [];
    integrationTools.push(tool);
    toolsByIntegration.set(tool.integration, integrationTools);
  }

  for (const tool of tools) {
    if (tool.execution.kind !== "composio_tool") continue;
    if (!isStubSchema(tool.inputSchema)) continue;

    const schemas = schemasByIntegration.get(tool.integration);
    if (!schemas) continue;

    const schema = schemas.get(tool.execution.toolSlug);
    if (schema) {
      tool.inputSchema = schema;
      applyComposioToolFieldDescriptionOverrides(tool);
      applyDiscoveryHints(tool, toolsByIntegration.get(tool.integration) ?? []);
    }
  }
}
