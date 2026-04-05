"use client";

import Link from "next/link";
import { createElement, useEffect, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OAuthConnectDialog } from "@/components/dashboard/OAuthConnectDialog";

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

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <Card className={cn("transition-colors hover:bg-card", className)}>
      <CardContent className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center">
          {hasBrandLogo(integration.slug) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getBrandLogoSrc(integration.slug)}
              alt=""
              aria-hidden="true"
              className="h-10 w-10 object-contain"
            />
          ) : (
            createElement(getIntegrationIcon(integration.icon), {
              className: "h-8 w-8",
              style: { color: integration.color },
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-sm font-medium text-foreground">
            {integration.name}
          </h3>
          {connected ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connected
            </span>
          ) : integration.setupMode === "oauth" && integration.dashboardStatus === "available" ? (
            <OAuthConnectDialog integration={integration} onConnected={() => setConnected(true)} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/dashboard/integrations/${integration.slug}`} />}
            >
              <Plus className="h-3.5 w-3.5" />
              Connect
            </Button>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {integration.description}
        </p>
      </CardContent>
    </Card>
  );
}
