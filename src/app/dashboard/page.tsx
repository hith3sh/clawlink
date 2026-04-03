"use client";

import Link from "next/link";
import { createElement, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { integrations } from "@/data/integrations";
import { OPENCLAW_PLUGIN_INSTALL_COMMAND } from "@/lib/openclaw-plugin";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FEATURED_SLUGS = [
  "gmail",
  "slack",
  "github",
  "notion",
  "google-drive",
  "google-calendar",
  "google-sheets",
  "hubspot",
  "youtube",
];

const recentRequests = [
  { integration: "gmail", action: "send_email", time: "2 min ago", latency: "145ms", status: "success" },
  { integration: "slack", action: "send_message", time: "5 min ago", latency: "89ms", status: "success" },
  { integration: "github", action: "create_issue", time: "12 min ago", latency: "234ms", status: "success" },
  { integration: "stripe", action: "list_customers", time: "1 hour ago", latency: "0ms", status: "error" },
];

type SortMode = "popular" | "connected" | "alphabetical";

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const { user, isLoaded } = useUser();

  const deferredSearch = useDeferredValue(search);
  const apiKey = "sk_live_xxxxxxxxxxxxxxxxxxxx";

  useEffect(() => {
    async function fetchConnectedIntegrations() {
      if (!isLoaded || !user) {
        return;
      }

      try {
        const response = await fetch("/api/integrations");
        const data = (await response.json()) as {
          integrations?: Array<{ integration: string }>;
        };

        if (data.integrations) {
          setConnectedIntegrations(data.integrations.map((item) => item.integration));
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
      }
    }

    fetchConnectedIntegrations();
  }, [isLoaded, user]);

  const connectedSet = useMemo(
    () => new Set(connectedIntegrations),
    [connectedIntegrations],
  );

  const filteredIntegrations = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    const matches = integrations.filter((integration) => {
      if (!query) {
        return FEATURED_SLUGS.includes(integration.slug);
      }

      return (
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query)
      );
    });

    const featuredOrder = new Map(FEATURED_SLUGS.map((slug, index) => [slug, index]));

    return [...matches].sort((left, right) => {
      if (sort === "connected") {
        const connectionDelta =
          Number(connectedSet.has(right.slug)) - Number(connectedSet.has(left.slug));

        if (connectionDelta !== 0) {
          return connectionDelta;
        }
      }

      if (sort === "alphabetical") {
        return left.name.localeCompare(right.name);
      }

      const featuredDelta =
        (featuredOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
        (featuredOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER);

      if (featuredDelta !== 0) {
        return featuredDelta;
      }

      return left.name.localeCompare(right.name);
    });
  }, [connectedSet, deferredSearch, sort]);

  const statusCards = [
    {
      label: "Apps ready",
      value: integrations.filter((item) => item.dashboardStatus === "available").length,
      helper: "Hosted connect surfaces already wired in dashboard",
    },
    {
      label: "Connected now",
      value: connectedIntegrations.length,
      helper: connectedIntegrations.length > 0 ? "Apps currently available to OpenClaw" : "No apps connected yet",
    },
    {
      label: "Worker live",
      value: integrations.filter((item) => item.runtimeStatus === "live").length,
      helper: "Integrations with active worker support today",
    },
  ];

  const connectedPreview = integrations
    .filter((integration) => connectedSet.has(integration.slug))
    .slice(0, 4);

  function copyApiKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      <section className="dashboard-panel p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <div className="space-y-5">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                API gateway
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                One key unlocks your hosted connection flows.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Keep the setup path obvious: create the key once, install the OpenClaw plugin,
                and launch app-specific hosted setup pages whenever a user wants to connect
                something new.
              </p>
            </div>

            <div className="dashboard-code flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Live API key
                </p>
                <code className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm text-foreground">
                  {showKey ? apiKey : "sk_live_••••••••••••••••••"}
                </code>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="icon-sm" onClick={() => setShowKey((value) => !value)}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={copyApiKey}>
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="dashboard-panel-soft p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                OpenClaw install command
              </p>
              <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-sm text-primary">
                {OPENCLAW_PLUGIN_INSTALL_COMMAND}
              </code>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/dashboard/settings" className={buttonVariants({ size: "sm" })}>
                  Manage keys
                </Link>
                <Link
                  href="/dashboard/integrations"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Browse apps
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {statusCards.map((card) => (
              <div key={card.label} className="dashboard-panel-soft p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.helper}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                Connection directory
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Find the next app to connect.
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Search the catalog from Home so you do not have to bounce between pages just to
                start a new connection.
              </p>
            </div>

            <Select value={sort} onValueChange={(value) => setSort((value as SortMode) ?? "popular")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort apps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="connected">Connected first</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="dashboard-panel p-4 sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${integrations.length} apps, categories, or capabilities`}
                className="h-12 border-white/8 bg-white/[0.03] pl-11 pr-4"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>
                Showing {filteredIntegrations.length} {deferredSearch.trim() ? "matching" : "featured"} apps
              </span>
              {!deferredSearch.trim() ? (
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Curated for your first setup
                </span>
              ) : null}
            </div>

            {filteredIntegrations.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.slug}
                    integration={integration}
                    isConnected={connectedSet.has(integration.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-panel-soft mt-5 flex min-h-48 flex-col items-center justify-center px-6 text-center">
                <p className="text-base font-medium text-foreground">No apps match that search yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a category like communication, finance, or analytics instead.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="dashboard-panel p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Connected apps
            </p>
            <div className="mt-4 space-y-3">
              {connectedPreview.length > 0 ? (
                connectedPreview.map((integration) => {
                  return (
                    <div
                      key={integration.slug}
                      className="dashboard-panel-soft flex items-center gap-3 p-3"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/10"
                        style={{ boxShadow: `inset 0 0 0 1px ${integration.color}20` }}
                      >
                        {createElement(getIntegrationIcon(integration.icon), {
                          className: "h-4.5 w-4.5",
                          style: { color: integration.color },
                        })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {integration.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Ready inside OpenClaw</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  );
                })
              ) : (
                <div className="dashboard-panel-soft p-4">
                  <p className="text-sm text-muted-foreground">
                    No connections yet. Start with Gmail, Slack, or Notion.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-panel p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Recent requests
            </p>
            <div className="mt-4 space-y-3">
              {recentRequests.map((request) => (
                <div key={`${request.integration}-${request.action}-${request.time}`} className="dashboard-panel-soft p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {request.integration}/{request.action}
                    </p>
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        request.status === "success" ? "bg-emerald-400" : "bg-destructive",
                      )}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{request.time}</span>
                    <span>{request.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/logs"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 w-full")}
            >
              Open usage log
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
