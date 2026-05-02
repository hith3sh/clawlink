"use client";

import Link from "next/link";
import { createElement, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus } from "lucide-react";

import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOAuthConnect } from "@/components/dashboard/useOAuthConnect";
import { useDashboardConnections } from "@/components/dashboard/DashboardConnectionsProvider";

interface IntegrationCardProps {
  integration: Integration;
  isConnected: boolean;
  className?: string;
}

export function IntegrationCard({
  integration,
  isConnected,
  className,
}: IntegrationCardProps) {
  const [connected, setConnected] = useState(isConnected);
  const { refetch } = useDashboardConnections();
  const { start, starting } = useOAuthConnect(integration, () => {
    setConnected(true);
    void refetch();
  });
  const hostedConnectEnabled =
    integration.dashboardStatus === "available" &&
    (
      integration.setupMode === "oauth" ||
      integration.setupMode === "pipedream" ||
      integration.setupMode === "composio"
    );

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  const card = (
    <Card
      className={cn(
        "flex h-full min-h-[200px] flex-col rounded-[22px] border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)]",
        connected && "cursor-pointer",
        integration.dashboardStatus === "coming-soon" && "opacity-60 grayscale-[0.6] hover:opacity-80 hover:grayscale-[0.3]",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col px-6 py-6">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex h-8 w-8 items-center justify-center">
            {hasBrandLogo(integration.slug) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getBrandLogoSrc(integration.slug, "light")}
                alt=""
                aria-hidden="true"
                className="h-7 w-7 object-contain"
              />
            ) : (
              createElement(getIntegrationIcon(integration.icon), {
                className: "h-6 w-6",
                style: { color: integration.color },
              })
            )}
          </div>

          {connected ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connected
            </span>
          ) : integration.dashboardStatus === "coming-soon" ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Coming soon
            </span>
          ) : hostedConnectEnabled ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 cursor-pointer rounded-full border-border bg-card px-4 text-sm font-medium text-foreground shadow-none hover:bg-accent"
              onClick={(e) => {
                e.preventDefault();
                start();
              }}
              disabled={starting}
            >
              {starting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Connect
            </Button>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Hosted flow pending
            </span>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="line-clamp-1 text-[1.1rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {integration.name}
          </h3>

          <p className="line-clamp-3 max-w-[28ch] text-[0.98rem] leading-7 text-muted-foreground">
            {integration.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (connected) {
    return (
      <Link href={`/dashboard/integrations/${integration.slug}`} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
