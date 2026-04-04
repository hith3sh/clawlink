import Link from "next/link";
import { createElement } from "react";
import { CheckCircle2, Plus } from "lucide-react";

import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  return (
    <Card className={cn("transition-colors hover:bg-card", className)}>
      <CardContent className="space-y-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `${integration.color}15`,
            boxShadow: `inset 0 0 0 1px ${integration.color}30`,
          }}
        >
          {createElement(getIntegrationIcon(integration.icon), {
            className: "h-6 w-6",
            style: { color: integration.color },
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-sm font-medium text-foreground">
            {integration.name}
          </h3>
          {isConnected ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connected
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
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
