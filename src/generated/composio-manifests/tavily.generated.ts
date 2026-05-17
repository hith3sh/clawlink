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
    integration: "tavily",
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
      toolkit: "tavily",
      toolSlug: partial.toolSlug,
      version: "20260407_00",
    },
  };
}

export const tavilyComposioTools: IntegrationTool[] = [
  composioTool({
    name: "tavily_crawl",
    description: "Tool to perform intelligent graph-based website crawling with parallel path exploration and content extraction. Use when you need to traverse and extract content from multiple pages of a website following specific patterns or instructions. Supports depth/breadth controls, domain filtering, and natural language instructions for guided crawling.",
    toolSlug: "TAVILY_CRAWL",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tavily",
      "read",
    ],
  }),
  composioTool({
    name: "tavily_extract",
    description: "Tool to extract and parse web page content from specified URLs using Tavily's extract endpoint. Use when you need to retrieve clean, structured content from web pages with optional image extraction and content reranking based on query relevance.",
    toolSlug: "TAVILY_EXTRACT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tavily",
      "read",
      "content_extraction",
    ],
  }),
  composioTool({
    name: "tavily_get_usage",
    description: "Tool to retrieve API key and account usage statistics from Tavily. Use when you need to check credit consumption, limits, and per-endpoint usage for search, extract, crawl, map, and research operations.",
    toolSlug: "TAVILY_GET_USAGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tavily",
      "read",
      "usage",
    ],
  }),
  composioTool({
    name: "tavily_map",
    description: "Tool to map a website and discover its pages. Use when you need to scan a website and get a structured list of URLs/pages it contains without extracting full content.",
    toolSlug: "TAVILY_MAP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tavily",
      "read",
    ],
  }),
  composioTool({
    name: "tavily_search",
    description: "Use this to perform a web search via the Tavily API; offers controls for search depth, content types, result count, and domain filtering. Requires an active Tavily connection (401 = auth failure). Rate limit: ~2 req/s; apply exponential backoff on HTTP 429. Results are nested under response_data.results (not a flat list). Subject to HTTP 429 on rapid bursts.",
    toolSlug: "TAVILY_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "tavily",
      "read",
    ],
  }),
];
