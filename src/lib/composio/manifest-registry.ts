import type { IntegrationTool } from "../../../worker/integrations/base";
import { composioToolManifests } from "@/generated/composio-manifests";
import { resolveToolSchemas, isStubSchema } from "./schema-cache";

let cachedTools: IntegrationTool[] | null = null;
let cachedByName: Map<string, IntegrationTool> | null = null;

function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  const tools = composioToolManifests
    .map((tool) => tool)
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
  kv: KVNamespace | null | undefined,
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
  for (const tool of tools) {
    if (tool.execution.kind !== "composio_tool") continue;
    if (!isStubSchema(tool.inputSchema)) continue;

    const schemas = schemasByIntegration.get(tool.integration);
    if (!schemas) continue;

    const schema = schemas.get(tool.execution.toolSlug);
    if (schema) {
      tool.inputSchema = schema;
    }
  }
}
