"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BillingState {
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
}

function formatTimestamp(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BillingSettingsPanel({ isLoaded, hasUser, checkoutId }: Props) {
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!hasUser) {
      setBilling(null);
      setLoading(false);
      return;
    }

    let active = true;

    async function loadBilling(isRefresh = false) {
      if (!active) {
        return;
      }

      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
          setRefreshing(false);
        }
      }
    }

    void loadBilling();

    return () => {
      active = false;
    };
  }, [hasUser, isLoaded, checkoutId]);

  async function handleRefresh() {
    if (!hasUser) {
      return;
    }

    setRefreshing(true);

    try {
      const response = await fetch("/api/billing", { cache: "no-store" });
      const data = (await response.json()) as { billing?: BillingState; error?: string };

      if (!response.ok || !data.billing) {
        throw new Error(data.error ?? "Failed to refresh billing");
      }

      setBilling(data.billing);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to refresh billing");
    } finally {
      setRefreshing(false);
    }
  }

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
            Polar redirected back after checkout. If your plan still says Free, the webhook may still be syncing. Use refresh in a few seconds.
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
                    : `Your first connected app is free. Upgrade to ClawLink Pro for ${billing.priceLabel} when you want more.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleRefresh()}
                  disabled={refreshing}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                {billing.subscribed && billing.portalConfigured ? (
                  <a href={billing.portalUrl} className={buttonVariants({ variant: "outline" })}>
                    <CreditCard className="h-4 w-4" />
                    Manage subscription
                  </a>
                ) : (
                  <a
                    href={billing.checkoutUrl}
                    className={buttonVariants({ variant: "default" })}
                    aria-disabled={!billing.checkoutConfigured}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Upgrade to Pro
                  </a>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Connected apps</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{billing.distinctIntegrationCount}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {billing.subscribed
                    ? "Paid plan active. Connect as many integrations as you need."
                    : `${billing.freeIntegrationLimit} app included on Free.`}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Next action</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {billing.canAddMoreIntegrations ? "You can keep connecting apps" : "Upgrade required"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {billing.needsUpgrade
                    ? "A second integration is blocked until the paid plan is active."
                    : "No billing gate is currently blocking your next connection."}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Renewal</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {formatTimestamp(billing.currentPeriodEnd) ?? "Not scheduled"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {billing.cancelAtPeriodEnd
                    ? "This subscription will end after the current billing period."
                    : "Billing status updates here after Polar webhooks sync."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/10 p-5">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground">How billing works</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ClawLink keeps the first integration free. The $5/month plan unlocks additional connected apps and gives you a Polar customer portal for card and subscription management.
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Free: connect one app and validate the hosted setup flow before paying.</p>
              <p>Pro: connect additional apps after Polar marks the subscription active.</p>
              <p>Portal: use Polar to update payment details, view receipts, or cancel later.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
