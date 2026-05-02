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
        <h2 className="text-lg font-semibold text-gray-900">Compare plans</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upgrade when you&apos;re ready for the full set of integrations.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <PricingCard
            eyebrow="Starter"
            title="Free"
            price="0"
            tagline="Try your first integration"
            features={["1 integration included", "Hosted OAuth connect flow", "Community support"]}
            footnote="No card required."
            ctaLabel="Start free"
            ctaHref="/dashboard/integrations"
          />
          <PricingCard
            eyebrow="Most popular"
            title="Pro"
            price="4.99"
            tagline="All 100+ integrations unlocked"
            features={[
              "Every integration, unlimited",
              "Priority email support",
              "New integrations as they ship",
            ]}
            footnote="Cancel anytime."
            ctaLabel="Get Pro"
            ctaHref={billing?.checkoutUrl || "#"}
            ctaAsAnchor
            highlighted
          />
        </div>
      </div>
    </div>
  );
}
