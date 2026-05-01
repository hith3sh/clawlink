import type { ToolMode, ToolRisk } from "../runtime/tool-runtime";

export interface PipedreamToolPropOption {
  label: string;
  value: unknown;
}

export interface PipedreamToolProp {
  name: string;
  type: string;
  label?: string;
  description?: string;
  required: boolean;
  hidden: boolean;
  disabled: boolean;
  readOnly: boolean;
  remoteOptions: boolean;
  useQuery: boolean;
  reloadProps: boolean;
  withLabel: boolean;
  appAuth: boolean;
  options?: PipedreamToolPropOption[];
}

export interface CustomToolExecutionSpec {
  kind: "custom";
}

export interface PipedreamActionExecutionSpec {
  kind: "pipedream_action";
  app: string;
  componentId: string;
  version?: string;
  authPropNames: string[];
  dynamicPropNames: string[];
  props: PipedreamToolProp[];
}

export interface ComposioToolExecutionSpec {
  kind: "composio_tool";
  toolkit: string;
  toolSlug: string;
  version?: string;
}

export type ToolExecutionSpec =
  | CustomToolExecutionSpec
  | PipedreamActionExecutionSpec
  | ComposioToolExecutionSpec;

export interface PipedreamToolExample {
  user: string;
  args: Record<string, unknown>;
}

export interface PipedreamActionToolManifest {
  integration: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  accessLevel: ToolMode;
  mode: ToolMode;
  risk: ToolRisk;
  tags: string[];
  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: PipedreamToolExample[];
  followups: string[];
  requiresScopes: string[];
  idempotent: boolean;
  supportsDryRun: boolean;
  supportsBatch: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
  execution: PipedreamActionExecutionSpec;
  source: {
    app: string;
    componentKey: string;
    componentName: string;
  };
}
