"use client";

import { useEffect, useState } from "react";
import { BillingSettingsPanel, type BillingState } from "@/components/dashboard/BillingSettingsPanel";
import { PricingCard } from "@/components/PricingCard";
import { useUser } from "@clerk/nextjs";

export default function BillingPage() {
  const { user, isLoaded } = useUser();
  const [billing, setBilling] = useState<BillingState | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let active = true;

    async function loadBilling() {
      try {
        const response = await fetch("/api/billing", { cache: "no-store" });
        const data = (await response.json()) as { billing?: BillingState; error?: string };
        if (!active) return;
        if (response.ok && data.billing) {
          setBilling(data.billing);
        }
      } catch {
        // ignore
      }
    }

    void loadBilling();
    return () => {
      active = false;
    };
  }, [isLoaded, user]);

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <BillingSettingsPanel isLoaded={isLoaded} hasUser={Boolean(user)} />

      <div>
        <h2 className="text-lg font-semibold text-foreground">Activation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          If access is inactive, activate ClawLink to keep using integrations.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-1">
          <PricingCard
            eyebrow="ClawLink"
            title="Activate"
            price="2.99"
            tagline="Full integration access"
            features={[
              "Every integration, unlimited",
              "Managed OAuth connect flow",
              "New integrations as they ship",
            ]}
            footnote="$2.99/month. Cancel anytime."
            ctaLabel={billing?.accessActive ? "Manage billing" : "Activate ClawLink"}
            ctaHref={billing?.subscribed ? (billing?.portalUrl || "#") : (billing?.checkoutUrl || "#")}
            ctaAsAnchor
            highlighted
          />
        </div>
      </div>
    </div>
  );
}
