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
    integration: "google-slides",
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
      toolkit: "googleslides",
      toolSlug: partial.toolSlug,
      version: "20260501_00",
    },
  };
}

export const googleSlidesComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googleslides_create_presentation",
    description: "Tool to create a blank Google Slides presentation. Use when you need to initialize a new presentation with a specific title, locale, or page size.",
    toolSlug: "GOOGLESLIDES_CREATE_PRESENTATION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-slides",
      "write",
      "presentations",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Google Slides Presentation.",
    ],
  }),
  composioTool({
    name: "googleslides_create_slides_markdown",
    description: "Creates a new Google Slides presentation from Markdown text. Automatically splits content into slides using '---' separators and applies appropriate templates based on content structure.",
    toolSlug: "GOOGLESLIDES_CREATE_SLIDES_MARKDOWN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-slides",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Slides from Markdown.",
    ],
  }),
  composioTool({
    name: "googleslides_get_page_thumbnail2",
    description: "Tool to generate a thumbnail of the latest version of a specified page. Use when you need a preview image URL for a slide page. This request counts as an expensive read request for quota purposes.",
    toolSlug: "GOOGLESLIDES_GET_PAGE_THUMBNAIL2",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-slides",
      "read",
      "thumbnails",
    ],
  }),
  composioTool({
    name: "googleslides_presentations_batch_update",
    description: "Update Google Slides presentations using markdown content or raw API text. Supports professional themes, auto-formatting, and multiple slide types (title, bullet, table, quote, image, two-column).",
    toolSlug: "GOOGLESLIDES_PRESENTATIONS_BATCH_UPDATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-slides",
      "write",
      "batch_operations",
      "markdown",
      "themes",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Presentation (Batch/Markdown).",
    ],
  }),
  composioTool({
    name: "googleslides_presentations_copy_from_template",
    description: "Tool to create a new Google Slides presentation by duplicating an existing template deck via Drive file copy. Use when you need to preserve themes, masters, and layouts exactly as they appear in the template. After copying, use GOOGLESLIDES_PRESENTATIONS_BATCH_UPDATE to replace placeholder text or images.",
    toolSlug: "GOOGLESLIDES_PRESENTATIONS_COPY_FROM_TEMPLATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-slides",
      "write",
      "presentations",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy Google Slides from Template.",
    ],
  }),
  composioTool({
    name: "googleslides_presentations_get",
    description: "Tool to retrieve the latest version of a presentation. Use after obtaining the presentation ID.",
    toolSlug: "GOOGLESLIDES_PRESENTATIONS_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-slides",
      "read",
      "presentations",
    ],
  }),
  composioTool({
    name: "googleslides_presentations_pages_get",
    description: "Tool to get the latest version of a specific page in a presentation. Use when you need to inspect slide, layout, master, or notes page details.",
    toolSlug: "GOOGLESLIDES_PRESENTATIONS_PAGES_GET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-slides",
      "read",
      "pages",
    ],
  }),
];
