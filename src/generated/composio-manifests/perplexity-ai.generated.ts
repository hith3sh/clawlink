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
    integration: "perplexity-ai",
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
      toolkit: "perplexityai",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const perplexityAiComposioTools: IntegrationTool[] = [
  composioTool({
    name: "perplexityai_create_async_chat_completion",
    description: "Create Async Chat Completion (POST /v1/async/sonar). Submits an asynchronous chat completion request for long-running tasks. Returns immediately with a request ID that can be polled using the Get Async Chat Completion action. Only the 'sonar-deep-research' model is supported for async processing. Async jobs have a 7-day TTL. Deep research generates very long responses (10K-100K+ words) with exhaustive multi-source analysis. Use the idempotency_key to prevent duplicate submissions. Poll with Get Async Chat Completion using the returned request ID to retrieve results when status is COMPLETED.",
    toolSlug: "PERPLEXITYAI_CREATE_ASYNC_CHAT_COMPLETION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "perplexity-ai",
      "write",
      "chat",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Async Chat Completion.",
    ],
  }),
  composioTool({
    name: "perplexityai_create_chat_completion",
    description: "Perplexity Sonar Chat Completions (POST /v1/sonar). Generates web-grounded conversational AI responses with citations. Supports multiple Sonar models optimized for different use cases: - sonar: Fast, cost-effective for simple queries - sonar-pro: Enhanced quality for complex questions - sonar-reasoning-pro: Chain-of-thought reasoning with <think> blocks - sonar-deep-research: Exhaustive multi-source research (generates very long responses, 10K+ words; prefer the async endpoint for this model) Features: web search grounding, citations, images, structured JSON output, search filtering by domain/date/language/recency, and streaming. Important constraints: - search_recency_filter and date filters (search_after_date_filter, search_before_date_filter, etc.) are mutually exclusive. Use one or the other, not both. - Messages with the 'tool' role must alternate with 'assistant' messages. A valid pattern is: system -> user -> assistant -> tool -> user. - The 'stop' parameter is not currently supported by the API.",
    toolSlug: "PERPLEXITYAI_CREATE_CHAT_COMPLETION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "perplexityai_create_contextualized_embeddings",
    description: "Create Contextualized Embeddings (POST /v1/contextualizedembeddings). Generates document-aware embeddings where chunks from the same document share context. Unlike standard embeddings, these recognize sequential relationships within documents, improving retrieval quality. Models: pplx-embed-context-v1-0.6b (1024 dims) and pplx-embed-context-v1-4b (2560 dims). Both support Matryoshka dimension reduction and INT8/binary quantization.",
    toolSlug: "PERPLEXITYAI_CREATE_CONTEXTUALIZED_EMBEDDINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "embeddings",
    ],
  }),
  composioTool({
    name: "perplexityai_create_embeddings",
    description: "Generate vector embeddings for independent texts (queries, sentences, documents). This action takes one or more input texts and generates vector embeddings using Perplexity AI's embedding models. Embeddings are useful for semantic search, similarity matching, and machine learning downstream tasks. Supported models: - pplx-embed-v1-0.6b: Smaller, faster model (1024 dimensions) - pplx-embed-v1-4b: Larger, more accurate model (2560 dimensions) The output embeddings are base64-encoded for efficient transmission. Use the dimensions parameter to reduce embedding size for faster processing when full precision is not required (Matryoshka representation).",
    toolSlug: "PERPLEXITYAI_CREATE_EMBEDDINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "embeddings",
    ],
  }),
  composioTool({
    name: "perplexityai_execute_agent",
    description: "Create Agent Response (POST /v1/agent). Orchestrates multi-step agentic workflows with built-in tools (web search, URL fetching, function calling), reasoning, and multi-model support. Streaming is not supported by this action. At least one of 'model', 'models', or 'preset' must be provided. Available presets: 'fast-search', 'pro-search', 'deep-research'. The 'deep-research' preset generates very long responses (10K-100K+ words) with exhaustive multi-source analysis. Available models include Perplexity Sonar, OpenAI, Anthropic, Google, xAI, and NVIDIA models at direct provider rates. Use the List Models action to see available model identifiers.",
    toolSlug: "PERPLEXITYAI_EXECUTE_AGENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "perplexity-ai",
      "write",
      "agents",
    ],
    askBefore: [
      "Confirm the parameters before executing Execute Agent.",
    ],
  }),
  composioTool({
    name: "perplexityai_get_async_chat_completion",
    description: "Get Async Chat Completion (GET /v1/async/sonar/{id}). Retrieves the result of an asynchronous chat completion request by its ID. Use this to poll for the result after creating an async job. The response includes the status and, when completed, the full completion.",
    toolSlug: "PERPLEXITYAI_GET_ASYNC_CHAT_COMPLETION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "perplexityai_list_async_chat_completions",
    description: "List Async Chat Completions (GET /v1/async/sonar). Retrieves a list of all asynchronous chat completion requests for the authenticated user. Use this to see the status of all your pending, completed, and failed async jobs.",
    toolSlug: "PERPLEXITYAI_LIST_ASYNC_CHAT_COMPLETIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "chat",
    ],
  }),
  composioTool({
    name: "perplexityai_list_models",
    description: "List Models (GET /v1/models). Lists models available for the Agent API. Returns model identifiers that can be used with the Agent endpoint. The response follows the OpenAI List Models format for compatibility. This is a public endpoint that does not require authentication.",
    toolSlug: "PERPLEXITYAI_LIST_MODELS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "models",
    ],
  }),
  composioTool({
    name: "perplexityai_search",
    description: "Search the Web (POST /search). Returns raw, ranked web search results directly from Perplexity's index without LLM processing. Faster and cheaper than chat completions when you need raw results. Supports filtering by domain, date, language, country, and recency. Max 20 results per request. Important: search_recency_filter and date filters (search_after_date_filter, search_before_date_filter, last_updated_after_filter, last_updated_before_filter) are mutually exclusive. Use one or the other, not both.",
    toolSlug: "PERPLEXITYAI_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "perplexity-ai",
      "read",
      "search",
    ],
  }),
];
