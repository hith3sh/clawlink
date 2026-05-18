"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
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
