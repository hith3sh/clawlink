"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";

import { categories, integrations } from "@/data/integrations";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  "outlook",
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${integrations.length} apps...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sort} onValueChange={(value) => setSort((value as SortMode) ?? "popular")}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort apps" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Popularity</SelectItem>
            <SelectItem value="connected">Connected first</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedCategory ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.slug}
              integration={integration}
              isConnected={connectedSet.has(integration.slug)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-foreground">No integrations found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clear the category filter or try a broader search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
