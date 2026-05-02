"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface BillingSummary {
  planKey: "free" | "pro";
  planName: string;
}

export function DashboardPlanBadge() {
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBilling() {
      try {
        const response = await fetch("/api/billing", { cache: "no-store" });
        const data = (await response.json().catch(() => ({}))) as {
          billing?: BillingSummary;
        };

        if (!active) {
          return;
        }

        if (response.ok && data.billing) {
          setBilling(data.billing);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBilling();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-border/70 bg-background px-3 text-xs font-medium text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Plan
      </span>
    );
  }

  const planKey = billing?.planKey ?? "free";
  const planLabel = planKey === "pro" ? "Pro" : "Free";
  const chipClasses =
    planKey === "pro"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/15"
      : "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/15";

  return (
    <Link
      href="/dashboard/settings?tab=billing"
      className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors ${chipClasses}`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>{planLabel}</span>
      <Badge
        variant="outline"
        className="h-5 border-current/15 bg-white/10 px-1.5 text-[10px] uppercase tracking-[0.16em] text-current"
      >
        Plan
      </Badge>
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}
