"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Search,
} from "lucide-react";

import { integrations } from "@/data/integrations";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardConnections } from "@/components/dashboard/DashboardConnectionsProvider";
import { AGENT_PROMPT, AgentPromptText } from "@/components/AgentPrompt";

type SortMode = "popular" | "connected" | "alphabetical";

function isLiveDashboardIntegration(
  integration: (typeof integrations)[number],
): boolean {
  return (
    integration.runtimeStatus === "live" &&
    integration.dashboardStatus === "available"
  );
}

function PromptCopyButton() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyPrompt}
      aria-label="Copy ClawLink agent prompt"
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-muted px-3 text-sm font-medium text-foreground transition hover:bg-accent"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}

function OpenClawPromptPanel() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-card px-5 py-6 text-card-foreground shadow-sm sm:px-8 sm:py-8">
      {/* <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-border bg-muted p-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#df473d] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(223,71,61,0.35)] sm:px-5">
            Let my AI set itself up
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-center text-2xl font-semibold text-card-foreground sm:text-3xl">
        Point your AI agent at <span className="bg-[#df473d] px-1 text-white">ClawLink</span>
      </h2> */}

      <div className="overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex gap-2" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#ed6a5e]" />
            <span className="h-3 w-3 rounded-full bg-[#f4be4f]" />
            <span className="h-3 w-3 rounded-full bg-[#61c554]" />
          </div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Prompt
          </span>
          <div className="ml-auto">
            <PromptCopyButton />
          </div>
        </div>

        <AgentPromptText
          containerClassName="space-y-3 px-4 py-5 font-mono text-sm leading-7 text-foreground sm:px-6 sm:text-base"
          linkClassName="text-[#df473d] underline decoration-[#df473d]/50 underline-offset-4 transition hover:decoration-[#df473d] dark:text-[#ff9a78]"
        />
      </div>

      <ol className="mt-6 space-y-3 text-base leading-7 text-muted-foreground">
        <li className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="font-mono text-lg font-semibold text-[#df473d]">1.</span>
          <span>Send this prompt to your agent.</span>
        </li>
        <li className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="font-mono text-lg font-semibold text-[#df473d]">2.</span>
          <span>
            The agent reads{" "}
            <code className="rounded-md border border-[#df473d]/20 bg-[#df473d]/10 px-1.5 py-0.5 font-mono text-sm text-[#df473d] dark:text-[#ffd1c6]">
              skill.md
            </code>{" "}
            and discovers ClawLink&apos;s live tool catalog.
          </span>
        </li>
        <li className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="font-mono text-lg font-semibold text-[#df473d]">3.</span>
          <span>It calls your connected integrations through ClawLink, no per-app API keys needed.</span>
        </li>
      </ol>
    </section>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const explicitAdd =
      searchParams.get("add") ??
      searchParams.get("search") ??
      searchParams.get("integration") ??
      searchParams.get("app");

    const flagParam = integrations.find((i) => searchParams.has(i.slug));

    if (explicitAdd?.trim() || flagParam) {
      const params = new URLSearchParams();
      if (explicitAdd?.trim()) {
        params.set("add", explicitAdd.trim());
      } else if (flagParam) {
        params.set("add", flagParam.slug);
      }
      router.replace(`/dashboard/integrations?${params.toString()}`);
    }
  }, [searchParams, router]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("connected");
  const [showAllApps, setShowAllApps] = useState(false);
  const { connectedSlugs, loading } = useDashboardConnections();

  const deferredSearch = useDeferredValue(search);

  const isSearchActive = deferredSearch.trim().length > 0;

  const filteredIntegrations = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    const matches = integrations.filter((integration) => {
      if (!query) {
        return true;
      }

      return (
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query)
      );
    });

    return [...matches].sort((left, right) => {
      if (sort === "connected") {
        const connectionDelta =
          Number(connectedSlugs.has(right.slug)) - Number(connectedSlugs.has(left.slug));

        if (connectionDelta !== 0) {
          return connectionDelta;
        }

        const liveDelta =
          Number(isLiveDashboardIntegration(right)) -
          Number(isLiveDashboardIntegration(left));

        if (liveDelta !== 0) {
          return liveDelta;
        }

        return left.name.localeCompare(right.name);
      }

      if (sort === "alphabetical") {
        return left.name.localeCompare(right.name);
      }

      const liveDelta =
        Number(isLiveDashboardIntegration(right)) -
        Number(isLiveDashboardIntegration(left));

      if (liveDelta !== 0) {
        return liveDelta;
      }

      return left.name.localeCompare(right.name);
    });
  }, [connectedSlugs, deferredSearch, sort]);

  const liveDashboardIntegrations = useMemo(
    () =>
      filteredIntegrations.filter((integration) =>
        isLiveDashboardIntegration(integration),
      ),
    [filteredIntegrations],
  );

  const visibleIntegrations = useMemo(() => {
    if (isSearchActive || showAllApps) {
      return filteredIntegrations;
    }

    return liveDashboardIntegrations;
  }, [filteredIntegrations, isSearchActive, liveDashboardIntegrations, showAllApps]);

  const hiddenIntegrationCount = Math.max(
    0,
    filteredIntegrations.length - liveDashboardIntegrations.length,
  );

  return (
    <div className="space-y-6">
      <OpenClawPromptPanel />

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${integrations.length} apps...`}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(value) => setSort((value as SortMode) ?? "connected")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Live first</SelectItem>
            <SelectItem value="connected">Connected first</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredIntegrations.length > 0 ? (
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-xs text-muted-foreground animate-pulse">
              Checking connected accounts...
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.slug}
                integration={integration}
                isConnected={connectedSlugs.has(integration.slug)}
              />
            ))}
          </div>

          {!isSearchActive && hiddenIntegrationCount > 0 ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-5"
                onClick={() => setShowAllApps((current) => !current)}
              >
                {showAllApps ? "Show fewer apps" : `Show ${hiddenIntegrationCount} more apps`}
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-foreground">No apps match that search.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a category like communication, finance, or analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
