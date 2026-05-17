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
    integration: "lmnt",
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
      toolkit: "lmnt",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const lmntComposioTools: IntegrationTool[] = [
  composioTool({
    name: "lmnt_create_voice",
    description: "Creates a custom voice in LMNT by training on uploaded audio samples. The voice can then be used for text-to-speech synthesis. Returns the voice ID and metadata upon successful creation. The voice may be in 'training' state initially before becoming 'ready'.",
    toolSlug: "LMNT_CREATE_VOICE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "lmnt",
      "write",
      "voices",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Voice.",
    ],
  }),
  composioTool({
    name: "lmnt_delete_voice_info",
    description: "Deletes a voice from your LMNT account. This operation permanently removes the voice and cancels any pending operations on it. This action cannot be undone. Only voices owned by you (owner='me') can be deleted; system voices cannot be deleted. Use case: Remove custom voices that are no longer needed to manage your voice library.",
    toolSlug: "LMNT_DELETE_VOICE_INFO",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "lmnt",
      "write",
      "voices",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Voice Info.",
    ],
  }),
  composioTool({
    name: "lmnt_generate_speech_with_metadata",
    description: "Generates speech from text and returns JSON with base64-encoded audio and optional word-level timing metadata. Use when you need the synthesis seed or word timestamps for subtitle synchronization. For lower latency without metadata, use the Synthesize Speech action instead.",
    toolSlug: "LMNT_GENERATE_SPEECH_WITH_METADATA",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "lmnt",
      "read",
      "speech",
    ],
  }),
  composioTool({
    name: "lmnt_get_account",
    description: "Retrieves account information including subscription plan details and current usage statistics.",
    toolSlug: "LMNT_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "lmnt",
      "read",
      "account",
    ],
  }),
  composioTool({
    name: "lmnt_get_voice_info",
    description: "Gets metadata for a specific LMNT voice, including active status, supported languages, and plan availability. Useful for validating a voice ID before using it in synthesis requests.",
    toolSlug: "LMNT_GET_VOICE_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "lmnt",
      "read",
      "voices",
    ],
  }),
  composioTool({
    name: "lmnt_get_voices_list",
    description: "Retrieves a list of available voices from LMNT. Returns both system-provided preset voices and any custom voices you have created. Use filters to narrow results by ownership (system vs custom) or starred status. Each voice includes details like ID, name, description, gender, state, and preview URL.",
    toolSlug: "LMNT_GET_VOICES_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "lmnt",
      "read",
      "voices",
    ],
  }),
  composioTool({
    name: "lmnt_synthesize_speech",
    description: "Synthesizes speech from text using LMNT's AI voices. Converts text (up to 5000 characters) into natural-sounding speech audio using a specified voice. Returns base64-encoded audio at `data.response_data.audio` — decode before saving or passing to other tools. Supports multiple audio formats and quality settings for different use cases.",
    toolSlug: "LMNT_SYNTHESIZE_SPEECH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "lmnt",
      "read",
      "speech",
    ],
  }),
  composioTool({
    name: "lmnt_update_voice",
    description: "Updates information about a specific voice in LMNT. You can update the name, description, gender, starred status, and unfreeze state of a voice. Note: Only user-owned voices (owner='me') can have their name, description, and gender updated. System voices can only be starred/unstarred.",
    toolSlug: "LMNT_UPDATE_VOICE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "lmnt",
      "write",
      "voices",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Voice Info.",
    ],
  }),
];
