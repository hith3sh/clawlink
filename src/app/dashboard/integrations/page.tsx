"use client";

import { useState, useEffect } from "react";
import { integrations, categories } from "@/data/integrations";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Search, Check, Plus } from "lucide-react";
import {
  SiGmail, SiSlack, SiDiscord, SiTelegram, SiApollographql, SiHubspot,
  SiSalesforce, SiPiped, SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, SiInstagram, SiGooglesheets, SiGooglecalendar,
  SiGoogledrive, SiNotion, SiAirtable, SiTodoist, SiGithub, SiGitlab, SiJira,
  SiLinear, SiVercel, SiStripe, SiPaypal, SiQuickbooks, SiGoogleanalytics,
  SiMixpanel, SiSupabase, SiFirebase, SiShopify, SiWoocommerce, SiOpenai,
  SiReplicate, SiElevenlabs
} from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGmail, SiSlack, SiDiscord, SiTelegram, SiApollographql, SiHubspot,
  SiSalesforce, SiPiped, SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, SiInstagram, SiGooglesheets, SiGooglecalendar,
  SiGoogledrive, SiNotion, SiAirtable, SiTodoist, SiGithub, SiGitlab, SiJira,
  SiLinear, SiVercel, SiStripe, SiPaypal, SiQuickbooks, SiGoogleanalytics,
  SiMixpanel, SiSupabase, SiFirebase, SiShopify, SiWoocommerce,
  SiOpenai, SiReplicate, SiElevenlabs
};

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function fetchConnectedIntegrations() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/integrations");
        const data = await res.json() as { integrations?: Array<{ integration: string }> };

        if (data.integrations) {
          const connected = data.integrations.map((i) => i.integration);
          setConnectedIntegrations(connected);
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConnectedIntegrations();
  }, [user, isLoaded]);

  const filtered = integrations.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
                          i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-muted-foreground">Browse and connect API integrations</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${integrations.length} integrations...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => {
          const Icon = iconMap[integration.icon] || Check;
          const isConnected = connectedIntegrations.includes(integration.slug);

          return (
            <Card key={integration.slug} className="group transition-colors hover:border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${integration.color}20` }}
                    >
                      <span style={{ color: integration.color }}>
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium leading-tight">{integration.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Badge variant="secondary" className="shrink-0 text-green-400">
                      <Check className="mr-1 h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Link
                      href={`/dashboard/integrations/${integration.slug}`}
                      className={buttonVariants({ variant: "outline", size: "sm" }) + " shrink-0"}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Connect
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No integrations found matching your search</p>
        </div>
      )}
    </div>
  );
}
