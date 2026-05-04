"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

export interface BillingState {
  planKey: "free" | "pro";
  planName: string;
  priceLabel: string;
  statusLabel: string;
  subscribed: boolean;
  distinctIntegrationCount: number;
  freeIntegrationLimit: number;
  canAddMoreIntegrations: boolean;
  needsUpgrade: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  productName: string | null;
  checkoutConfigured: boolean;
  portalConfigured: boolean;
  subscriptionStatus: string | null;
  checkoutUrl: string;
  portalUrl: string;
}

interface Props {
  isLoaded: boolean;
  hasUser: boolean;
  checkoutId?: string | null;
  initialBilling?: BillingState | null;
  initialLoading?: boolean;
  initialError?: string | null;
}

export function BillingSettingsPanel({ isLoaded, hasUser, checkoutId, initialBilling, initialLoading, initialError }: Props) {
  const [billing, setBilling] = useState<BillingState | null>(initialBilling ?? null);
  const [loading, setLoading] = useState(initialBilling != null ? false : (initialLoading ?? true));
  const [error, setError] = useState<string | null>(initialError ?? null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!hasUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBilling(null);
      setLoading(false);
      return;
    }

    if (initialBilling != null) {
      return;
    }

    let active = true;

    async function loadBilling() {
      if (!active) {
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const response = await fetch("/api/billing", { cache: "no-store" });
        const data = (await response.json()) as { billing?: BillingState; error?: string };

        if (!active) {
          return;
        }

        if (!response.ok || !data.billing) {
          throw new Error(data.error ?? "Failed to load billing");
        }

        setBilling(data.billing);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load billing");
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
  }, [hasUser, isLoaded, checkoutId, initialBilling]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading billing...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {checkoutId ? (
        <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-100 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-emerald-800 dark:text-emerald-100">
            Polar redirected back after checkout. If your plan still says Free, the webhook may still be syncing — check back in a minute.
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {!billing ? null : (
        <>
          {!billing.checkoutConfigured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Polar is missing required config. Add `POLAR_ACCESS_TOKEN` and `POLAR_PRODUCT_ID` before users can upgrade.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="rounded-2xl border border-border/70 bg-muted/10 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-lg font-semibold text-foreground">{billing.planName}</p>
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {billing.statusLabel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {billing.planKey === "pro"
                    ? `${billing.productName ?? "ClawLink Pro"} is active for ${billing.priceLabel}.`
                    : `Your first connected app is free. Upgrade to ClawLink Pro for $4.99/month when you want more.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {billing.subscribed && billing.portalConfigured ? (
                  <a href={billing.portalUrl} className={buttonVariants({ variant: "outline", size: "lg" })}>
                    <CreditCard className="h-5 w-5" />
                    Manage subscription
                  </a>
                ) : (
                  <a
                    href={billing.checkoutUrl}
                    className={buttonVariants({ variant: "default", size: "lg" })}
                    aria-disabled={!billing.checkoutConfigured}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                    Upgrade to Pro — $4.99/mo
                  </a>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
