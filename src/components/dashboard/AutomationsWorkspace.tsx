"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Loader2,
  Play,
  RefreshCcw,
  Rocket,
  Siren,
  Trash2,
  Webhook,
  Workflow,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FlowStatus = "pending" | "running" | "waiting" | "completed" | "failed" | "cancelled";
type FlowTriggerType = "agent" | "manual" | "webhook" | "schedule";
type FlowStepStatus = "pending" | "running" | "waiting" | "completed" | "failed" | "skipped";
type TriggerType = "webhook" | "schedule" | "manual";
type TriggerLogStatus = "success" | "error";

interface FlowTemplateRecord {
  key: string;
  name: string;
  description: string;
}

interface FlowSummaryRecord {
  id: string;
  name: string;
  templateKey: string;
  status: FlowStatus;
  triggerType: FlowTriggerType;
  currentStep: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

interface FlowStepRecord {
  id: string;
  stepKey: string;
  stepType: string;
  status: FlowStepStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
  attemptCount: number;
  startedAt: string | null;
  completedAt: string | null;
}

interface FlowDetailRecord {
  flow: FlowSummaryRecord;
  steps: FlowStepRecord[];
}

interface TriggerRecord {
  id: string;
  integration: string | null;
  type: TriggerType;
  config: Record<string, unknown>;
  targetFlowTemplate: string;
  enabled: boolean;
  lastFiredAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TriggerLogRecord {
  id: string;
  status: TriggerLogStatus;
  message: string | null;
  payload: Record<string, unknown> | null;
  flowId: string | null;
  createdAt: string;
}

interface TriggerDetailRecord {
  trigger: TriggerRecord;
  logs: TriggerLogRecord[];
}

function formatTimestamp(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getFlowStatusTone(status: FlowStatus): "secondary" | "destructive" | "default" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "failed":
    case "cancelled":
      return "destructive";
    case "running":
      return "secondary";
    default:
      return "outline";
  }
}

function getTriggerTypeDefaults(type: TriggerType): string {
  if (type === "schedule") {
    return JSON.stringify({ everyMinutes: 15 }, null, 2);
  }

  if (type === "webhook") {
    return JSON.stringify({ defaultInput: {} }, null, 2);
  }

  return JSON.stringify({}, null, 2);
}

function parseJsonObject(raw: string, label: string): Record<string, unknown> {
  const trimmed = raw.trim();

  if (!trimmed) {
    return {};
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object`);
  }

  return parsed as Record<string, unknown>;
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-white/8 bg-black/20 p-3 text-xs text-muted-foreground">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}

export default function AutomationsWorkspace() {
  const [activeTab, setActiveTab] = useState("flows");
  const [flowTemplates, setFlowTemplates] = useState<FlowTemplateRecord[]>([]);
  const [flows, setFlows] = useState<FlowSummaryRecord[]>([]);
  const [flowDetail, setFlowDetail] = useState<FlowDetailRecord | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<TriggerRecord[]>([]);
  const [triggerDetail, setTriggerDetail] = useState<TriggerDetailRecord | null>(null);
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [loadingTriggers, setLoadingTriggers] = useState(true);
  const [loadingFlowDetail, setLoadingFlowDetail] = useState(false);
  const [loadingTriggerDetail, setLoadingTriggerDetail] = useState(false);
  const [startingFlow, setStartingFlow] = useState(false);
  const [creatingTrigger, setCreatingTrigger] = useState(false);
  const [workingFlowAction, setWorkingFlowAction] = useState(false);
  const [workingTriggerAction, setWorkingTriggerAction] = useState(false);
  const [flowTemplateKey, setFlowTemplateKey] = useState("");
  const [flowInputValue, setFlowInputValue] = useState("{\n  \"summaryStyle\": \"brief\"\n}");
  const [triggerType, setTriggerType] = useState<TriggerType>("schedule");
  const [triggerTemplateKey, setTriggerTemplateKey] = useState("");
  const [triggerIntegration, setTriggerIntegration] = useState("");
  const [triggerConfigValue, setTriggerConfigValue] = useState(getTriggerTypeDefaults("schedule"));
  const [origin, setOrigin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const loadFlows = useCallback(async (options?: { preserveSelection?: boolean }) => {
    setLoadingFlows(true);

    try {
      const [templatesResponse, flowsResponse] = await Promise.all([
        fetch("/api/flows/templates", { cache: "no-store" }),
        fetch("/api/flows?limit=40", { cache: "no-store" }),
      ]);

      const templatesData = (await templatesResponse.json()) as {
        error?: string;
        templates?: FlowTemplateRecord[];
      };
      const flowsData = (await flowsResponse.json()) as {
        error?: string;
        flows?: FlowSummaryRecord[];
      };

      if (!templatesResponse.ok) {
        throw new Error(templatesData.error ?? "Failed to load flow templates");
      }

      if (!flowsResponse.ok) {
        throw new Error(flowsData.error ?? "Failed to load flows");
      }

      const templates = templatesData.templates ?? [];
      const nextFlows = flowsData.flows ?? [];

      setFlowTemplates(templates);
      setFlows(nextFlows);
      setFlowTemplateKey((current) => current || templates[0]?.key || "");
      setTriggerTemplateKey((current) => current || templates[0]?.key || "");

      if (!options?.preserveSelection) {
        setSelectedFlowId((current) => current ?? nextFlows[0]?.id ?? null);
      } else {
        setSelectedFlowId((current) => {
          if (!current) {
            return nextFlows[0]?.id ?? null;
          }

          return nextFlows.some((flow) => flow.id === current) ? current : (nextFlows[0]?.id ?? null);
        });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load flows");
    } finally {
      setLoadingFlows(false);
    }
  }, []);

  const loadTriggers = useCallback(async (options?: { preserveSelection?: boolean }) => {
    setLoadingTriggers(true);

    try {
      const response = await fetch("/api/triggers", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        triggers?: TriggerRecord[];
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load triggers");
      }

      const nextTriggers = data.triggers ?? [];
      setTriggers(nextTriggers);

      if (!options?.preserveSelection) {
        setSelectedTriggerId((current) => current ?? nextTriggers[0]?.id ?? null);
      } else {
        setSelectedTriggerId((current) => {
          if (!current) {
            return nextTriggers[0]?.id ?? null;
          }

          return nextTriggers.some((trigger) => trigger.id === current)
            ? current
            : (nextTriggers[0]?.id ?? null);
        });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load triggers");
    } finally {
      setLoadingTriggers(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadFlows(), loadTriggers()]);
  }, [loadFlows, loadTriggers]);

  useEffect(() => {
    if (!selectedFlowId) {
      setFlowDetail(null);
      return;
    }

    let active = true;
    setLoadingFlowDetail(true);
    const flowId = selectedFlowId;

    async function loadFlowDetail() {
      try {
        const response = await fetch(`/api/flows/${encodeURIComponent(flowId)}`, { cache: "no-store" });
        const data = (await response.json()) as FlowDetailRecord & { error?: string };

        if (!active) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load flow");
        }

        setFlowDetail(data);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load flow");
        }
      } finally {
        if (active) {
          setLoadingFlowDetail(false);
        }
      }
    }

    void loadFlowDetail();

    return () => {
      active = false;
    };
  }, [selectedFlowId]);

  useEffect(() => {
    if (!selectedTriggerId) {
      setTriggerDetail(null);
      return;
    }

    let active = true;
    setLoadingTriggerDetail(true);
    const triggerId = selectedTriggerId;

    async function loadTriggerDetail() {
      try {
        const response = await fetch(`/api/triggers/${encodeURIComponent(triggerId)}/logs?limit=20`, {
          cache: "no-store",
        });
        const data = (await response.json()) as TriggerDetailRecord & { error?: string };

        if (!active) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load trigger");
        }

        setTriggerDetail(data);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load trigger");
        }
      } finally {
        if (active) {
          setLoadingTriggerDetail(false);
        }
      }
    }

    void loadTriggerDetail();

    return () => {
      active = false;
    };
  }, [selectedTriggerId]);

  const flowStats = useMemo(() => {
    return {
      total: flows.length,
      running: flows.filter((flow) => flow.status === "running").length,
      waiting: flows.filter((flow) => flow.status === "waiting").length,
    };
  }, [flows]);

  const triggerStats = useMemo(() => {
    return {
      total: triggers.length,
      enabled: triggers.filter((trigger) => trigger.enabled).length,
      scheduled: triggers.filter((trigger) => trigger.type === "schedule").length,
    };
  }, [triggers]);

  async function handleStartFlow() {
    setError(null);
    setSuccess(null);
    setStartingFlow(true);

    try {
      const input = parseJsonObject(flowInputValue, "Flow input");
      const response = await fetch("/api/flows/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowTemplate: flowTemplateKey,
          input,
          triggerType: "manual",
        }),
      });
      const data = (await response.json()) as { error?: string; flowId?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to start flow");
      }

      setSuccess("Flow started.");
      await loadFlows({ preserveSelection: true });

      if (data.flowId) {
        setSelectedFlowId(data.flowId);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to start flow");
    } finally {
      setStartingFlow(false);
    }
  }

  async function handleFlowAction(action: "resume" | "cancel" | "approve") {
    if (!selectedFlowId) {
      return;
    }

    setError(null);
    setSuccess(null);
    setWorkingFlowAction(true);

    try {
      const response = await fetch(`/api/flows/${encodeURIComponent(selectedFlowId)}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: action === "approve" ? JSON.stringify({}) : undefined,
      });
      const data = (await response.json()) as FlowDetailRecord & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? `Failed to ${action} flow`);
      }

      setFlowDetail(data);
      setSuccess(
        action === "approve"
          ? "Flow approval submitted."
          : action === "resume"
            ? "Flow resumed."
            : "Flow cancelled.",
      );
      await loadFlows({ preserveSelection: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Failed to ${action} flow`);
    } finally {
      setWorkingFlowAction(false);
    }
  }

  async function handleCreateTrigger() {
    setError(null);
    setSuccess(null);
    setCreatingTrigger(true);

    try {
      const config = parseJsonObject(triggerConfigValue, "Trigger config");
      const response = await fetch("/api/triggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: triggerType,
          targetFlowTemplate: triggerTemplateKey,
          integration: triggerIntegration.trim() || null,
          config,
          enabled: true,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        trigger?: TriggerRecord;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create trigger");
      }

      setSuccess("Trigger created.");
      await loadTriggers({ preserveSelection: true });

      if (data.trigger?.id) {
        setSelectedTriggerId(data.trigger.id);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create trigger");
    } finally {
      setCreatingTrigger(false);
    }
  }

  async function handleTriggerAction(action: "toggle" | "fire" | "delete") {
    if (!selectedTriggerId) {
      return;
    }

    setError(null);
    setSuccess(null);
    setWorkingTriggerAction(true);

    try {
      if (action === "delete") {
        const response = await fetch(`/api/triggers/${encodeURIComponent(selectedTriggerId)}`, {
          method: "DELETE",
        });
        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to delete trigger");
        }

        setSuccess("Trigger deleted.");
        setSelectedTriggerId(null);
        await loadTriggers();
        return;
      }

      if (action === "fire") {
        const response = await fetch(`/api/triggers/${encodeURIComponent(selectedTriggerId)}/fire`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fire trigger");
        }

        setSuccess("Trigger fired.");
        const logsResponse = await fetch(`/api/triggers/${encodeURIComponent(selectedTriggerId)}/logs?limit=20`, {
          cache: "no-store",
        });
        const logsData = (await logsResponse.json()) as TriggerDetailRecord & { error?: string };

        if (!logsResponse.ok) {
          throw new Error(logsData.error ?? "Failed to refresh trigger logs");
        }

        await Promise.all([
          loadTriggers({ preserveSelection: true }),
          loadFlows({ preserveSelection: true }),
        ]);
        setTriggerDetail(logsData);
        return;
      }

      const enabled = !(triggerDetail?.trigger.enabled ?? false);
      const response = await fetch(`/api/triggers/${encodeURIComponent(selectedTriggerId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = (await response.json()) as TriggerRecord & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update trigger");
      }

      setSuccess(enabled ? "Trigger enabled." : "Trigger paused.");
      await loadTriggers({ preserveSelection: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Failed to ${action} trigger`);
    } finally {
      setWorkingTriggerAction(false);
    }
  }

  const selectedFlowTemplate = flowTemplates.find((template) => template.key === flowTemplateKey) ?? null;
  const selectedTriggerTemplate = flowTemplates.find((template) => template.key === triggerTemplateKey) ?? null;
  const webhookSecret =
    triggerDetail?.trigger.type === "webhook" && typeof triggerDetail.trigger.config.webhookSecret === "string"
      ? triggerDetail.trigger.config.webhookSecret
      : null;
  const webhookUrl =
    origin && selectedTriggerId
      ? `${origin}/api/triggers/${encodeURIComponent(selectedTriggerId)}/webhook`
      : null;
  const waitingApprovalStep = flowDetail?.steps.find(
    (step) => step.stepType === "approval" && step.status === "waiting",
  );

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(179,102,43,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
        <CardContent className="relative space-y-5 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                <Workflow className="h-3.5 w-3.5" />
                Runtime control room
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Automations</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Start reusable flows, arm triggers, and inspect where autonomous work paused, ran, or failed.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Flows</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{flowStats.total}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Running</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{flowStats.running}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Armed triggers</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{triggerStats.enabled}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <Card className="border-white/8 bg-white/[0.025]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-[color:rgb(214,133,77)]" />
                  Start a flow
                </CardTitle>
                <CardDescription>
                  Launch a canned workflow with optional structured input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Template</div>
                  <Select value={flowTemplateKey} onValueChange={(value) => setFlowTemplateKey(value ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a flow template" />
                    </SelectTrigger>
                    <SelectContent>
                      {flowTemplates.map((template) => (
                        <SelectItem key={template.key} value={template.key}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFlowTemplate ? (
                    <p className="text-sm text-muted-foreground">{selectedFlowTemplate.description}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Input JSON</div>
                  <textarea
                    value={flowInputValue}
                    onChange={(event) => setFlowInputValue(event.target.value)}
                    rows={8}
                    className="flex min-h-[170px] w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    spellCheck={false}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <Button variant="outline" size="sm" onClick={() => void loadFlows()}>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={handleStartFlow} disabled={startingFlow || !flowTemplateKey}>
                  {startingFlow ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Start flow
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
              <Card className="border-white/8 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle>Recent flows</CardTitle>
                  <CardDescription>Latest runs across manual, webhook, and scheduled starts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loadingFlows ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 rounded-2xl" />
                    ))
                  ) : flows.length > 0 ? (
                    flows.map((flow) => (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => setSelectedFlowId(flow.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                          selectedFlowId === flow.id
                            ? "border-[rgba(214,133,77,0.45)] bg-[rgba(214,133,77,0.08)]"
                            : "border-white/8 bg-black/10 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">{flow.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{flow.templateKey}</div>
                          </div>
                          <Badge variant={getFlowStatusTone(flow.status)}>{flow.status}</Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{flow.triggerType}</span>
                          <span>{formatTimestamp(flow.updatedAt)}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
                      No flows yet. Start one from a template.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
                <CardHeader>
                  <CardTitle>Flow detail</CardTitle>
                  <CardDescription>
                    Inspect step-by-step execution, approvals, waits, and failures.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingFlowDetail ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 rounded-2xl" />
                      <Skeleton className="h-56 rounded-2xl" />
                    </div>
                  ) : flowDetail ? (
                    <>
                      <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="text-lg font-semibold text-foreground">{flowDetail.flow.name}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {flowDetail.flow.templateKey} • started {formatTimestamp(flowDetail.flow.createdAt)}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getFlowStatusTone(flowDetail.flow.status)}>
                              {flowDetail.flow.status}
                            </Badge>
                            <Badge variant="outline">{flowDetail.flow.triggerType}</Badge>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Current step</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {flowDetail.flow.currentStep ?? "Finished"}
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Updated</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {formatTimestamp(flowDetail.flow.updatedAt)}
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Completed</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {formatTimestamp(flowDetail.flow.completedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleFlowAction("resume")}
                          disabled={workingFlowAction}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Resume
                        </Button>
                        {waitingApprovalStep ? (
                          <Button
                            size="sm"
                            onClick={() => void handleFlowAction("approve")}
                            disabled={workingFlowAction}
                          >
                            <Siren className="h-4 w-4" />
                            Approve waiting step
                          </Button>
                        ) : null}
                        {flowDetail.flow.status !== "cancelled" && flowDetail.flow.status !== "completed" ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleFlowAction("cancel")}
                            disabled={workingFlowAction}
                          >
                            <Trash2 className="h-4 w-4" />
                            Cancel
                          </Button>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        {flowDetail.steps.map((step) => (
                          <div key={step.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="font-medium text-foreground">{step.stepKey}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                  {step.stepType}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={step.status === "failed" ? "destructive" : "outline"}>
                                  {step.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">attempt {step.attemptCount}</span>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-3 lg:grid-cols-2">
                              <div className="space-y-2">
                                <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                  Input
                                </div>
                                <JsonBlock value={step.input} />
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                  {step.error ? "Error" : "Output"}
                                </div>
                                <JsonBlock value={step.error ?? step.output ?? {}} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-sm text-muted-foreground">
                      Select a flow run to inspect its steps.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <Card className="border-white/8 bg-white/[0.025]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-[color:rgb(214,133,77)]" />
                  Arm a trigger
                </CardTitle>
                <CardDescription>
                  Connect a schedule, webhook, or manual trigger to a reusable flow template.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Type</div>
                    <Select
                      value={triggerType}
                      onValueChange={(value) => {
                        const nextType = value as TriggerType;
                        setTriggerType(nextType);
                        setTriggerConfigValue(getTriggerTypeDefaults(nextType));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="schedule">schedule</SelectItem>
                        <SelectItem value="webhook">webhook</SelectItem>
                        <SelectItem value="manual">manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Flow template</div>
                    <Select value={triggerTemplateKey} onValueChange={(value) => setTriggerTemplateKey(value ?? "")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a flow template" />
                      </SelectTrigger>
                      <SelectContent>
                        {flowTemplates.map((template) => (
                          <SelectItem key={template.key} value={template.key}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Integration slug</div>
                  <Input
                    value={triggerIntegration}
                    onChange={(event) => setTriggerIntegration(event.target.value)}
                    placeholder="Optional: gmail, github, notion..."
                  />
                  {selectedTriggerTemplate ? (
                    <p className="text-sm text-muted-foreground">{selectedTriggerTemplate.description}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Config JSON</div>
                  <textarea
                    value={triggerConfigValue}
                    onChange={(event) => setTriggerConfigValue(event.target.value)}
                    rows={10}
                    className="flex min-h-[210px] w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    spellCheck={false}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <Button variant="outline" size="sm" onClick={() => void loadTriggers()}>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={handleCreateTrigger} disabled={creatingTrigger || !triggerTemplateKey}>
                  {creatingTrigger ? <Loader2 className="h-4 w-4 animate-spin" /> : <Webhook className="h-4 w-4" />}
                  Create trigger
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
              <Card className="border-white/8 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle>Trigger registry</CardTitle>
                  <CardDescription>Enabled schedules, incoming webhooks, and manual launch points.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loadingTriggers ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 rounded-2xl" />
                    ))
                  ) : triggers.length > 0 ? (
                    triggers.map((trigger) => (
                      <button
                        key={trigger.id}
                        type="button"
                        onClick={() => setSelectedTriggerId(trigger.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                          selectedTriggerId === trigger.id
                            ? "border-[rgba(214,133,77,0.45)] bg-[rgba(214,133,77,0.08)]"
                            : "border-white/8 bg-black/10 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">{trigger.targetFlowTemplate}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {trigger.integration ?? "Any integration"}
                            </div>
                          </div>
                          <Badge variant={trigger.enabled ? "default" : "outline"}>
                            {trigger.enabled ? "armed" : "paused"}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{trigger.type}</span>
                          <span>{formatTimestamp(trigger.updatedAt)}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
                      No triggers yet. Create one on the left.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
                <CardHeader>
                  <CardTitle>Trigger detail</CardTitle>
                  <CardDescription>Inspect config, webhook credentials, next run time, and the latest trigger logs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingTriggerDetail ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 rounded-2xl" />
                      <Skeleton className="h-56 rounded-2xl" />
                    </div>
                  ) : triggerDetail ? (
                    <>
                      <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="text-lg font-semibold text-foreground">{triggerDetail.trigger.targetFlowTemplate}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {triggerDetail.trigger.integration ?? "Any integration"} • {triggerDetail.trigger.type}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={triggerDetail.trigger.enabled ? "default" : "outline"}>
                              {triggerDetail.trigger.enabled ? "enabled" : "paused"}
                            </Badge>
                            <Badge variant="outline">{triggerDetail.trigger.type}</Badge>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Last fired</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {formatTimestamp(triggerDetail.trigger.lastFiredAt)}
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Next run</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {formatTimestamp(triggerDetail.trigger.nextRunAt)}
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Created</div>
                            <div className="mt-2 text-sm font-medium text-foreground">
                              {formatTimestamp(triggerDetail.trigger.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleTriggerAction("toggle")}
                          disabled={workingTriggerAction}
                        >
                          <Activity className="h-4 w-4" />
                          {triggerDetail.trigger.enabled ? "Pause" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => void handleTriggerAction("fire")}
                          disabled={workingTriggerAction}
                        >
                          <Play className="h-4 w-4" />
                          Fire now
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void handleTriggerAction("delete")}
                          disabled={workingTriggerAction}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>

                      {webhookUrl && webhookSecret ? (
                        <div className="grid gap-3 lg:grid-cols-2">
                          <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                            <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                              Webhook URL
                            </div>
                            <div className="mt-2 break-all font-mono text-sm text-foreground">{webhookUrl}</div>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                            <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                              Trigger secret
                            </div>
                            <div className="mt-2 break-all font-mono text-sm text-foreground">{webhookSecret}</div>
                          </div>
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                          Config
                        </div>
                        <JsonBlock value={triggerDetail.trigger.config} />
                      </div>

                      <div className="space-y-3">
                        {triggerDetail.logs.length > 0 ? (
                          triggerDetail.logs.map((log) => (
                            <div key={log.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <div className="font-medium text-foreground">{log.message ?? "Trigger run"}</div>
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {formatTimestamp(log.createdAt)}
                                  </div>
                                </div>
                                <Badge variant={log.status === "error" ? "destructive" : "default"}>
                                  {log.status}
                                </Badge>
                              </div>
                              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                <div>
                                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                    Payload
                                  </div>
                                  <JsonBlock value={log.payload ?? {}} />
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                    Flow
                                  </div>
                                  <div className="mt-2 font-mono text-sm text-foreground">
                                    {log.flowId ?? "No flow started"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-muted-foreground">
                            No trigger logs yet.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-sm text-muted-foreground">
                      Select a trigger to inspect its config and logs.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
