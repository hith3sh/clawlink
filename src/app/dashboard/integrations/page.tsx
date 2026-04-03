"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";

import { categories, integrations } from "@/data/integrations";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortMode = "popular" | "alphabetical" | "connected";

const FEATURED_SLUGS = [
  "gmail",
  "slack",
  "google-calendar",
  "google-drive",
  "notion",
  "github",
  "hubspot",
  "stripe",
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("popular");
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const { user, isLoaded } = useUser();

  const deferredSearch = useDeferredValue(search);

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
    const featuredOrder = new Map(FEATURED_SLUGS.map((slug, index) => [slug, index]));

    const matches = integrations.filter((integration) => {
      const matchesSearch =
        !query ||
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory || integration.category === selectedCategory;

      return matchesSearch && matchesCategory;
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

      const featuredDelta =
        (featuredOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
        (featuredOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER);

      if (featuredDelta !== 0) {
        return featuredDelta;
      }

      return left.name.localeCompare(right.name);
    });
  }, [connectedSet, deferredSearch, selectedCategory, sort]);

  return (
    <div className="space-y-6">
      <section className="dashboard-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              App directory
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Browse every connection ClawLink can expose.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Search by product, workflow, or category. The list stays focused on setup, so every
              tile leads directly into a connection route instead of another analytics screen.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="dashboard-panel-soft p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catalog</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{integrations.length}</p>
            </div>
            <div className="dashboard-panel-soft p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Connected</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{connectedIntegrations.length}</p>
            </div>
            <div className="dashboard-panel-soft p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hosted ready</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {integrations.filter((integration) => integration.dashboardStatus === "available").length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${integrations.length} apps, use cases, or categories`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 border-white/8 bg-white/[0.03] pl-11 pr-4"
            />
          </div>

          <Select value={sort} onValueChange={(value) => setSort((value as SortMode) ?? "popular")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort apps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularity</SelectItem>
              <SelectItem value="connected">Connected first</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={!selectedCategory ? "bg-white/[0.08] text-foreground" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-white/[0.08] text-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {filteredIntegrations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.slug}
              integration={integration}
              isConnected={connectedSet.has(integration.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-panel-soft flex min-h-60 flex-col items-center justify-center px-6 text-center">
          <p className="text-base font-medium text-foreground">No integrations found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear the category filter or try a broader search term.
          </p>
        </div>
      )}
    </div>
  );
}
