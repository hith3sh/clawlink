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
    integration: "whatsapp",
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
      toolkit: "whatsapp",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const whatsappComposioTools: IntegrationTool[] = [
  composioTool({
    name: "whatsapp_create_message_template",
    description: "Create a new message template for the WhatsApp Business Account. Templates must be approved by WhatsApp before they can be used. Templates are required for marketing messages and messages sent outside the 24-hour window.",
    toolSlug: "WHATSAPP_CREATE_MESSAGE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create message template.",
    ],
  }),
  composioTool({
    name: "whatsapp_delete_message_template",
    description: "Delete a message template from the WhatsApp Business Account by name. This permanently removes the template and it cannot be recovered. When you delete a template by name, all templates with that name across all languages will be deleted. Names of deleted templates cannot be reused for 30 days. Important: Only delete templates that are no longer needed, as this operation is irreversible.",
    toolSlug: "WHATSAPP_DELETE_MESSAGE_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete message template.",
    ],
  }),
  composioTool({
    name: "whatsapp_get_business_profile",
    description: "Get the business profile information for a WhatsApp Business phone number. This includes business details like description, address, website, and contact info.",
    toolSlug: "WHATSAPP_GET_BUSINESS_PROFILE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_get_media_info",
    description: "Get metadata and download URL for uploaded WhatsApp media. Returns media ID, download URL (valid for 5 minutes), MIME type, SHA256 hash, and file size. The download URL can be used to retrieve the actual media file.",
    toolSlug: "WHATSAPP_GET_MEDIA_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_get_message_templates",
    description: "Get all message templates for the WhatsApp Business Account. Templates are required for sending messages outside the 24-hour window and for marketing/utility messages.",
    toolSlug: "WHATSAPP_GET_MESSAGE_TEMPLATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_get_phone_number",
    description: "Retrieve detailed information about a specific WhatsApp Business phone number. Returns phone number details including verification status, quality rating, display number, verified business name, throughput limits, and webhook configuration. Use this to check phone number status, settings, and capabilities. To get available phone number IDs, first call WHATSAPP_GET_PHONE_NUMBERS.",
    toolSlug: "WHATSAPP_GET_PHONE_NUMBER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_get_phone_numbers",
    description: "Retrieve all phone numbers registered to your WhatsApp Business Account. Returns phone number IDs, display numbers, verification status, quality ratings, and messaging throughput limits. Use the phone number ID from the response to send WhatsApp messages via other API actions.",
    toolSlug: "WHATSAPP_GET_PHONE_NUMBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_get_template_status",
    description: "Get the status and details of a specific message template. This is useful for checking if a template has been approved, rejected, or is still pending review.",
    toolSlug: "WHATSAPP_GET_TEMPLATE_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "whatsapp",
      "read",
    ],
  }),
  composioTool({
    name: "whatsapp_send_contacts",
    description: "Send contacts WhatsApp number. Note: The message will be delivered to the recipient only if they have initiated a conversation first.",
    toolSlug: "WHATSAPP_SEND_CONTACTS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send contacts.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_interactive_buttons",
    description: "Send an interactive button message with up to 3 reply buttons to a WhatsApp user. Interactive button messages allow recipients to quickly respond by tapping predefined buttons. Perfect for yes/no questions, multiple choice selections, quick actions, or call-to-action scenarios. IMPORTANT REQUIREMENTS: - The recipient must be a registered WhatsApp user - The recipient must have messaged your business first within the last 24 hours (WhatsApp's customer service window) - You can include 1-3 buttons per message - Each button can have a title (max 20 chars) and unique ID (max 256 chars) Use cases: Customer service menus, appointment confirmations, feedback collection, product selections.",
    toolSlug: "WHATSAPP_SEND_INTERACTIVE_BUTTONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send interactive buttons.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_interactive_list",
    description: "Send an interactive list message to a WhatsApp number. List messages display a menu of options organized into sections. Users tap a button to view the list and select one option. Perfect for product catalogs, service menus, or guided workflows. Supports up to 10 sections with up to 10 items per section (100 total options). Note: Recipients must have messaged you first within the last 24 hours to receive this message.",
    toolSlug: "WHATSAPP_SEND_INTERACTIVE_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send interactive list.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_location",
    description: "Send a location message with coordinates, name, and address to a WhatsApp user. This action allows you to share location information through WhatsApp Business API. The location message includes latitude/longitude coordinates, a location name, and address. Important: The recipient must have an active WhatsApp account. Additionally, you can only send free-form messages (like location messages) within the 24-hour customer service window after the recipient has initiated contact with your business. Outside this window, you must use approved message templates. Common error codes: - 133010: Recipient's phone number doesn't have a WhatsApp account - 131026: Message undeliverable (recipient may have blocked your business number) - 131047: Re-engagement message (outside 24-hour window, need to use template)",
    toolSlug: "WHATSAPP_SEND_LOCATION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send location.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_media",
    description: "Send a media message to a WhatsApp number. Note: The media will be delivered to the recipient only if they have texted first.",
    toolSlug: "WHATSAPP_SEND_MEDIA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send media.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_media_by_id",
    description: "Send media using a media ID from previously uploaded media. This is more efficient than sending media by URL as the media is already on WhatsApp servers. Use upload_media action first to get the media ID. Note: The media will be delivered to the recipient only if they have texted first.",
    toolSlug: "WHATSAPP_SEND_MEDIA_BY_ID",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send media by.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_message",
    description: "Send a text message to a WhatsApp user. Important: The recipient phone number must be registered on WhatsApp and must have initiated a conversation with your business within the last 24 hours, OR you must use a template message (see WHATSAPP_SEND_TEMPLATE_MESSAGE) for the first message outside the 24-hour window. For test accounts, recipient numbers must be added to the test recipient list in Meta Business Suite before sending messages.",
    toolSlug: "WHATSAPP_SEND_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send message.",
    ],
  }),
  composioTool({
    name: "whatsapp_send_template_message",
    description: "Send a template message to a WhatsApp number.",
    toolSlug: "WHATSAPP_SEND_TEMPLATE_MESSAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Send template message.",
    ],
  }),
  composioTool({
    name: "whatsapp_upload_media",
    description: "Upload media files (images, videos, audio, documents, stickers) to WhatsApp servers. The uploaded media gets a media ID that can be used in send_media or other messaging actions. Supported formats: - Images: JPEG, PNG (max 5MB) - Videos: MP4, 3GPP (max 16MB) - Audio: AAC, M4A, AMR, MP3, OGG (max 16MB) - Documents: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (max 100MB) - Stickers: WebP (max 500KB, 512x512 pixels)",
    toolSlug: "WHATSAPP_UPLOAD_MEDIA",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "whatsapp",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload media.",
    ],
  }),
];
