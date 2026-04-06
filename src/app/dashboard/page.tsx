"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { integrations } from "@/data/integrations";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortMode = "popular" | "connected" | "alphabetical";

function isLiveDashboardIntegration(
  integration: (typeof integrations)[number],
): boolean {
  return (
    integration.runtimeStatus === "live" &&
    integration.dashboardStatus === "available"
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const [showAllApps, setShowAllApps] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    async function fetchConnectedIntegrations() {
      if (!isLoaded || !user) {
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    }

    fetchConnectedIntegrations();
  }, [isLoaded, user]);

  const connectedSet = useMemo(
    () => new Set(connectedIntegrations),
    [connectedIntegrations],
  );

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
          Number(connectedSet.has(right.slug)) - Number(connectedSet.has(left.slug));

        if (connectionDelta !== 0) {
          return connectionDelta;
        }
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
  }, [connectedSet, deferredSearch, sort]);

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
      <Card>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-base font-medium text-foreground">API keys</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a ClawLink API key once, then copy the generated `/clawlink login ...` command into OpenClaw.
              Keys are only shown once when created.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-mono text-sm text-foreground">cllk_live_...</p>
              <p className="text-sm text-muted-foreground">
                Manage keys in Settings. Revoke and recreate a key if you need a fresh value.
              </p>
            </div>
            <Link href="/dashboard/settings?tab=api" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Manage API keys
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

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
        <Select value={sort} onValueChange={(value) => setSort((value as SortMode) ?? "popular")}>
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

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredIntegrations.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.slug}
                integration={integration}
                isConnected={connectedSet.has(integration.slug)}
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
