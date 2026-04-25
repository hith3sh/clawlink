import "server-only";

import type { IntegrationTool } from "../../../worker/integrations";

export interface PolicyDecision {
  allow: boolean;
  requiresConfirmation: boolean;
  reason?: string;
  previewAvailable: boolean;
}

function isWriteLikeTool(tool: Pick<IntegrationTool, "mode" | "risk" | "askBefore">): boolean {
  return tool.mode !== "read" || tool.risk !== "safe" || tool.askBefore.length > 0;
}

export function evaluateToolPolicy(input: {
  tool: Pick<IntegrationTool, "name" | "mode" | "risk" | "askBefore">;
  confirmed?: boolean;
  executionMode?: "direct" | "preview" | "batch" | "flow_step";
}): PolicyDecision {
  const { tool, confirmed = false, executionMode = "direct" } = input;

  if (executionMode === "preview") {
    return {
      allow: true,
      requiresConfirmation: isWriteLikeTool(tool),
      reason: isWriteLikeTool(tool)
        ? "Preview only. A follow-up confirmed execution is required before any side effects happen."
        : undefined,
      previewAvailable: true,
    };
  }

  if (!isWriteLikeTool(tool)) {
    return {
      allow: true,
      requiresConfirmation: false,
      previewAvailable: true,
    };
  }

  const reason =
    tool.mode === "destructive" || tool.risk === "high_impact"
      ? "This tool can make high-impact or destructive changes."
      : "This tool writes data to an external service.";

  if (confirmed) {
    return {
      allow: true,
      requiresConfirmation: false,
      reason,
      previewAvailable: true,
    };
  }

  return {
    allow: false,
    requiresConfirmation: true,
    reason,
    previewAvailable: true,
  };
}

export function summarizeToolPolicy(
  tool: Pick<IntegrationTool, "name" | "mode" | "risk" | "askBefore">,
): Pick<PolicyDecision, "requiresConfirmation" | "reason" | "previewAvailable"> {
  const decision = evaluateToolPolicy({ tool });
  return {
    requiresConfirmation: decision.requiresConfirmation,
    reason: decision.reason,
    previewAvailable: decision.previewAvailable,
  };
}
