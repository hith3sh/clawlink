import "server-only";

export type FlowTemplateKey =
  | "summarize_unread_gmail"
  | "gmail_to_notion_task_sync";

export type FlowStepType = "tool_call" | "transform" | "wait" | "approval";

export interface FlowStepSeed {
  stepKey: string;
  stepType: FlowStepType;
  input: Record<string, unknown>;
}

export interface FlowTemplateDefinition {
  key: FlowTemplateKey;
  name: string;
  description: string;
  buildSteps(input: Record<string, unknown>): FlowStepSeed[];
}

function ref(path: string): { $ref: string } {
  return { $ref: path };
}

function readOptionalConnectionId(input: Record<string, unknown>, key: string): number | undefined {
  const raw = input[key];

  if (typeof raw === "number" && Number.isInteger(raw) && raw > 0) {
    return raw;
  }

  if (typeof raw === "string") {
    const parsed = Number.parseInt(raw, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  }

  return undefined;
}

function requireNonEmptyString(input: Record<string, unknown>, key: string, label: string): string {
  const value = input[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required`);
  }

  return value.trim();
}

const templates: Record<FlowTemplateKey, FlowTemplateDefinition> = {
  summarize_unread_gmail: {
    key: "summarize_unread_gmail",
    name: "Summarize unread Gmail",
    description: "Fetch unread Gmail messages and produce a compact summary.",
    buildSteps(input) {
      return [
        {
          stepKey: "fetch_unread",
          stepType: "tool_call",
          input: {
            toolName: "gmail_find_email",
            connectionId: readOptionalConnectionId(input, "gmailConnectionId"),
            args: {
              q:
                typeof input.query === "string" && input.query.trim().length > 0
                  ? input.query.trim()
                  : "is:unread",
              maxResults:
                typeof input.maxResults === "number" && Number.isFinite(input.maxResults)
                  ? Math.max(1, Math.min(20, Math.floor(input.maxResults)))
                  : 5,
              withTextPayload: true,
            },
          },
        },
        {
          stepKey: "summarize_messages",
          stepType: "transform",
          input: {
            operation: "summarize_gmail_messages",
            messagesRef: "steps.fetch_unread.output.data",
          },
        },
      ];
    },
  },
  gmail_to_notion_task_sync: {
    key: "gmail_to_notion_task_sync",
    name: "Gmail to Notion task sync",
    description: "Read unread Gmail messages, build task pages, pause for approval, then create Notion pages.",
    buildSteps(input) {
      const notionParent = requireNonEmptyString(input, "notionParent", "notionParent");

      return [
        {
          stepKey: "fetch_unread",
          stepType: "tool_call",
          input: {
            toolName: "gmail_find_email",
            connectionId: readOptionalConnectionId(input, "gmailConnectionId"),
            args: {
              q:
                typeof input.query === "string" && input.query.trim().length > 0
                  ? input.query.trim()
                  : "is:unread",
              maxResults:
                typeof input.maxResults === "number" && Number.isFinite(input.maxResults)
                  ? Math.max(1, Math.min(20, Math.floor(input.maxResults)))
                  : 5,
              withTextPayload: true,
            },
          },
        },
        {
          stepKey: "build_tasks",
          stepType: "transform",
          input: {
            operation: "gmail_messages_to_notion_tasks",
            messagesRef: "steps.fetch_unread.output.data",
          },
        },
        {
          stepKey: "approve_task_creation",
          stepType: "approval",
          input: {
            message: "Create Notion task pages from the unread Gmail messages?",
            approved: false,
          },
        },
        {
          stepKey: "create_notion_pages",
          stepType: "tool_call",
          input: {
            toolName: "notion_create_page",
            connectionId: readOptionalConnectionId(input, "notionConnectionId"),
            confirmed: true,
            iterateOver: "steps.build_tasks.output.tasks",
            itemName: "task",
            args: {
              parent: notionParent,
              title: ref("item.title"),
              content: ref("item.content"),
            },
          },
        },
      ];
    },
  },
};

export function listFlowTemplates(): FlowTemplateDefinition[] {
  return Object.values(templates);
}

export function getFlowTemplate(key: string): FlowTemplateDefinition | null {
  if (key in templates) {
    return templates[key as FlowTemplateKey];
  }

  return null;
}
