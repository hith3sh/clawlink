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
    integration: "replicate",
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
      toolkit: "replicate",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const replicateComposioTools: IntegrationTool[] = [
  composioTool({
    name: "replicate_account_get",
    description: "Tool to get authenticated account information. Use when you need to retrieve details about the account associated with the API token.",
    toolSlug: "REPLICATE_ACCOUNT_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "account_and_security",
    ],
  }),
  composioTool({
    name: "replicate_cancel_prediction",
    description: "Tool to cancel a prediction that is still running. Use when you need to stop an in-progress prediction to free up resources or halt execution.",
    toolSlug: "REPLICATE_CANCEL_PREDICTION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "replicate",
      "write",
      "predictions_and_inference",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel Prediction.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "replicate_collections_get",
    description: "Tool to get a specific collection of models by its slug. Use when you need detailed information about a collection and its models.",
    toolSlug: "REPLICATE_COLLECTIONS_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "discovery_and_collections",
    ],
  }),
  composioTool({
    name: "replicate_collections_list",
    description: "Tool to list all collections of models. Use when you need to retrieve available model collections. Collections are curated groupings of related models. Response includes only collection metadata (name, slug, description), not individual models within each collection; use REPLICATE_MODELS_GET for per-model details. Response may include a non-null `next` field indicating additional pages; follow it to enumerate all collections.",
    toolSlug: "REPLICATE_COLLECTIONS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_create_model",
    description: "Tool to create a new Replicate model with specified owner, name, visibility, and hardware. Use when you need to create a destination model before launching LoRA/fine-tune training.",
    toolSlug: "REPLICATE_CREATE_MODEL",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "models_and_versions",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Model.",
    ],
  }),
  composioTool({
    name: "replicate_create_prediction",
    description: "Tool to create a prediction for a Replicate Deployment. IMPORTANT: This action ONLY works with Replicate Deployments (persistent instances you create and manage), NOT public models. Deployments are created via REPLICATE_DEPLOYMENTS_CREATE. To run public models (e.g., 'meta/llama-2-70b-chat', 'stability-ai/sdxl'), use REPLICATE_MODELS_PREDICTIONS_CREATE instead. Use 'wait_for' to wait until the prediction completes.",
    toolSlug: "REPLICATE_CREATE_PREDICTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Prediction.",
    ],
  }),
  composioTool({
    name: "replicate_deployments_create",
    description: "Tool to create a new deployment with specified model, version, hardware, and scaling parameters. Use when you need to deploy a model for production use with auto-scaling.",
    toolSlug: "REPLICATE_DEPLOYMENTS_CREATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "deployments_and_infrastructure",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Deployment.",
    ],
  }),
  composioTool({
    name: "replicate_deployments_delete",
    description: "Tool to delete a deployment from your account. Use when you need to remove a deployment. Deployments must be offline and unused for at least 15 minutes before deletion.",
    toolSlug: "REPLICATE_DEPLOYMENTS_DELETE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "replicate",
      "write",
      "deployments_and_infrastructure",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Deployment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "replicate_deployments_get",
    description: "Tool to get deployment details by owner and name. Use when you need information about a specific deployment including its release configuration and hardware settings.",
    toolSlug: "REPLICATE_DEPLOYMENTS_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "deployments_and_infrastructure",
    ],
  }),
  composioTool({
    name: "replicate_deployments_list",
    description: "Tool to list all deployments associated with the account. Use when you need to retrieve deployment configurations and their latest releases.",
    toolSlug: "REPLICATE_DEPLOYMENTS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "deployments_and_infrastructure",
    ],
  }),
  composioTool({
    name: "replicate_files_create",
    description: "Tool to create or upload a file to Replicate. Use when you need to upload file content with optional metadata.",
    toolSlug: "REPLICATE_FILES_CREATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "files_and_assets",
    ],
    askBefore: [
      "Confirm the parameters before executing Create File.",
    ],
  }),
  composioTool({
    name: "replicate_files_delete",
    description: "Tool to delete a file by its ID. Use when you need to remove a file from storage. Returns 204 No Content on success.",
    toolSlug: "REPLICATE_FILES_DELETE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "replicate",
      "write",
      "files_and_assets",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete File.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "replicate_files_get",
    description: "Tool to get details of a file by its ID. Use when you need to inspect uploaded file information before further operations. Returned URLs may be short-lived; download or persist needed files promptly after retrieval.",
    toolSlug: "REPLICATE_FILES_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_files_list",
    description: "Tool to retrieve a paginated list of uploaded files. Use to view all files created by the authenticated user or organization. Files are sorted with most recent first. Pagination is cursor-based: follow the next cursor until empty to retrieve all files. Limit requests to 1–2/second to avoid 429 Too Many Requests errors. Use to validate current file_ids before passing to prediction tools, as stale file_ids cause runtime errors.",
    toolSlug: "REPLICATE_FILES_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_get_prediction",
    description: "Tool to get the status and output of a prediction by its ID. Use when you need to check on a running prediction or retrieve the results of a completed prediction.",
    toolSlug: "REPLICATE_GET_PREDICTION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "predictions_and_inference",
    ],
  }),
  composioTool({
    name: "replicate_hardware_list",
    description: "Tool to list available hardware SKUs for models and deployments. Use when you need to see what hardware options are available on the Replicate platform.",
    toolSlug: "REPLICATE_HARDWARE_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "deployments_and_infrastructure",
    ],
  }),
  composioTool({
    name: "replicate_models_examples_list",
    description: "Tool to list example predictions for a specific model. Use when you want to retrieve author-provided illustrative examples after identifying the model. Returned examples are minimal working payloads; cross-reference with REPLICATE_MODELS_README_GET before calling REPLICATE_CREATE_PREDICTION to satisfy strict input validation.",
    toolSlug: "REPLICATE_MODELS_EXAMPLES_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_models_get",
    description: "Tool to get details of a specific model by owner and name. Consult the returned input schema before constructing any prediction request — each model defines its own required/optional fields (e.g., `prompt`, `aspect_ratio`, `version`); missing or unknown keys cause validation errors. Model schemas and available versions may change over time; recheck before production use.",
    toolSlug: "REPLICATE_MODELS_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_models_list",
    description: "Tool to list public models with pagination and sorting. Use when you need to browse available models or find models sorted by creation date.",
    toolSlug: "REPLICATE_MODELS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "models_and_versions",
    ],
  }),
  composioTool({
    name: "replicate_models_predictions_create",
    description: "Tool to create a prediction using an official Replicate model. Use when you need to run inference with a specific model using its owner and name. Supports synchronous waiting (up to 60 seconds) and webhooks for async notifications.",
    toolSlug: "REPLICATE_MODELS_PREDICTIONS_CREATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "predictions_and_inference",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Model Prediction.",
    ],
  }),
  composioTool({
    name: "replicate_models_readme_get",
    description: "Tool to get the README content for a model in Markdown format. Consult alongside REPLICATE_MODELS_EXAMPLES_LIST before calling REPLICATE_CREATE_PREDICTION — Replicate enforces strict JSON schemas on model inputs and returns 422 errors for incorrect keys or types. Use after retrieving model details when you want to view its documentation.",
    toolSlug: "REPLICATE_MODELS_README_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
    ],
  }),
  composioTool({
    name: "replicate_models_versions_get",
    description: "Tool to get a specific version of a model. Use when you need details about a particular model version including its schema and metadata.",
    toolSlug: "REPLICATE_MODELS_VERSIONS_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "models_and_versions",
    ],
  }),
  composioTool({
    name: "replicate_models_versions_list",
    description: "Tool to list all versions of a specific model. Use when you need to see all available versions of a model, sorted by newest first.",
    toolSlug: "REPLICATE_MODELS_VERSIONS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "models_and_versions",
    ],
  }),
  composioTool({
    name: "replicate_predictions_create",
    description: "Tool to create a prediction to run a model by version ID. Use when you have a specific model version identifier and need to run inference with provided inputs. Supports synchronous waiting and webhook notifications.",
    toolSlug: "REPLICATE_PREDICTIONS_CREATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "predictions_and_inference",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Prediction.",
    ],
  }),
  composioTool({
    name: "replicate_predictions_list",
    description: "Tool to list all predictions for the authenticated user or organization with pagination. Use when you need to retrieve prediction history or filter predictions by creation date.",
    toolSlug: "REPLICATE_PREDICTIONS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "predictions_and_inference",
    ],
  }),
  composioTool({
    name: "replicate_search",
    description: "Tool to search for models, collections, and docs using text queries (beta). Use when you need to find relevant models or collections based on keywords or descriptions.",
    toolSlug: "REPLICATE_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "discovery_and_collections",
    ],
  }),
  composioTool({
    name: "replicate_trainings_cancel",
    description: "Tool to cancel an ongoing training operation in Replicate. Use when you need to stop a training job that is in progress.",
    toolSlug: "REPLICATE_TRAININGS_CANCEL",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "replicate",
      "write",
      "training_jobs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel Training.",
    ],
  }),
  composioTool({
    name: "replicate_trainings_create",
    description: "Tool to create a training job for a specific model version. Use when you need to fine-tune a model with custom training data. Supports webhook notifications for training status updates.",
    toolSlug: "REPLICATE_TRAININGS_CREATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "training_jobs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Training Job.",
    ],
  }),
  composioTool({
    name: "replicate_trainings_list",
    description: "Tool to list all training jobs for the authenticated user or organization with pagination. Use when you need to retrieve training history or check the status of training jobs.",
    toolSlug: "REPLICATE_TRAININGS_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "training_jobs",
    ],
  }),
  composioTool({
    name: "replicate_update_models",
    description: "Tool to update metadata for a model including description, URLs, and README. Use when you need to modify a model's visibility, documentation, or associated links.",
    toolSlug: "REPLICATE_UPDATE_MODELS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "replicate",
      "write",
      "models_and_versions",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Model Metadata.",
    ],
  }),
  composioTool({
    name: "replicate_webhooks_secret_get",
    description: "Tool to get the signing secret for the default webhook. Use when you need to retrieve the secret key used to verify webhook authenticity.",
    toolSlug: "REPLICATE_WEBHOOKS_SECRET_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "replicate",
      "read",
      "account_and_security",
    ],
  }),
];
