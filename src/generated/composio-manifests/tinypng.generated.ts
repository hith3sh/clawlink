import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "tinypng",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "tinypng",
      toolSlug: partial.toolSlug,
      version: "20260414_00",
    },
  };
}

export const tinypngComposioTools: IntegrationTool[] = [
  composioTool({
    name: "tinypng_get_compression_count",
    description: "Tool to retrieve the number of compressions made this month. Use when you need to monitor your TinyPNG API usage.",
    toolSlug: "TINYPNG_GET_COMPRESSION_COUNT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tinypng",
      "read",
      "count",
    ],
  }),
  composioTool({
    name: "tinypng_shrink_and_get_image_id",
    description: "Tool to shrink an image and return its TinyPNG image ID. Use when you need only the compressed image identifier from the API response Location header.",
    toolSlug: "TINYPNG_SHRINK_AND_GET_IMAGE_ID",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tinypng",
      "write",
      "compression",
    ],
    askBefore: [
      "Confirm the parameters before executing Shrink and get image ID.",
    ],
  }),
  composioTool({
    name: "tinypng_tinify_compress_and_store_in_azure",
    description: "Compress an image using the Tinify API and upload the optimized result directly to Azure Blob Storage in a single operation. The image is first compressed by Tinify, then uploaded to the specified Azure Blob URL using the provided SAS token. Use this when you need to optimize images and store them in Azure without intermediate steps. Supports JPEG, PNG, and WebP image formats.",
    toolSlug: "TINYPNG_TINIFY_COMPRESS_AND_STORE_IN_AZURE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tinypng",
      "write",
      "compression",
      "storage",
    ],
    askBefore: [
      "Confirm the parameters before executing Compress and Store Image in Azure.",
    ],
  }),
  composioTool({
    name: "tinypng_tinify_output",
    description: "Tool to retrieve a compressed image by its image ID. Use after compressing an image to download the result.",
    toolSlug: "TINYPNG_TINIFY_OUTPUT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tinypng",
      "read",
    ],
  }),
  composioTool({
    name: "tinypng_transform_image",
    description: "Tool to transform a compressed image by resizing, converting format, preserving metadata, or storing to cloud storage. Use when you have an image ID from a previous compression and need to apply transformations.",
    toolSlug: "TINYPNG_TRANSFORM_IMAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "tinypng",
      "write",
      "transformation",
    ],
    askBefore: [
      "Confirm the parameters before executing Transform Compressed Image.",
    ],
  }),
];
