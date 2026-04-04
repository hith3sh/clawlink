"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { integrations } from "@/data/integrations";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Button } from "@/components/ui/button";
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

const FEATURED_SLUGS = [
  "gmail",
  "google-calendar",
  "google-docs",
  "google-drive",
  "notion",
  "google-sheets",
  "slack",
  "google-search-console",
  "outlook",
  "airtable",
  "hubspot",
  "youtube",
];

type SortMode = "popular" | "connected" | "alphabetical";

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const deferredSearch = useDeferredValue(search);
  const apiKey = "sk_live_xxxxxxxxxxxxxxxxxxxx";

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

  function copyApiKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3">
          <div>
            <h2 className="text-base font-medium text-foreground">API Key</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your API key for using ClawLink services. Use this key with the{" "}
              <span className="text-foreground underline underline-offset-2">API Gateway</span>{" "}
              OpenClaw skill.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-10 flex-1 items-center rounded-lg border border-border bg-muted/50 px-3 font-mono text-sm text-foreground">
              {showKey ? apiKey : "sk_live_•••• ... ••••"}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowKey((v) => !v)}>
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={copyApiKey}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
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
            <SelectItem value="popular">Popularity</SelectItem>
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
