import Link from "next/link";
import { createElement } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

import type { Integration } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { buttonVariants } from "@/components/ui/button";
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
    <div
      className={cn(
        "group/dashboard-card flex h-full flex-col justify-between rounded-[24px] border border-white/8 bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all duration-200 hover:border-white/14 hover:bg-white/[0.04] hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/6 bg-black/10"
            style={{ boxShadow: `inset 0 0 0 1px ${integration.color}20` }}
          >
            {createElement(getIntegrationIcon(integration.icon), {
              className: "h-5 w-5",
              style: { color: integration.color },
            })}
          </div>
          <span className="dashboard-pill px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {integration.category}
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="text-base font-medium text-foreground">{integration.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {integration.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {integration.dashboardStatus === "available"
            ? "Hosted connect ready"
            : "Flow reserved for a future release"}
        </p>

        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Connected
          </span>
        ) : (
          <Link
            href={`/dashboard/integrations/${integration.slug}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-3.5")}
          >
            Connect
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
