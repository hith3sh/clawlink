import "server-only";

import type { D1LikeDatabase, UserRow } from "@/lib/server/integration-store";
import { getDatabase, getUserForCurrentIdentity } from "@/lib/server/integration-store";

export type BillingPlanKey = "free" | "pro";

type PolarServer = "sandbox" | "production";

interface StoredBillingAccountRow {
  user_id: string;
  polar_customer_id: string | null;
  polar_external_customer_id: string;
  polar_checkout_id: string | null;
  polar_subscription_id: string | null;
  subscription_status: string;
  product_id: string | null;
  product_name: string | null;
  current_period_end: string | null;
  cancel_at_period_end: number;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingAccountRecord {
  userId: string;
  polarCustomerId: string | null;
  polarExternalCustomerId: string;
  polarCheckoutId: string | null;
  polarSubscriptionId: string | null;
  subscriptionStatus: string;
  productId: string | null;
  productName: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillingOverview {
  planKey: BillingPlanKey;
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

interface BillingAccessDecision {
  allowed: boolean;
  reason: string | null;
}

interface PolarSubscriptionDataLike {
  id?: string | null;
  status?: string | null;
  checkoutId?: string | null;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean | null;
  canceledAt?: Date | string | null;
  customerId?: string | null;
  externalCustomerId?: string | null;
  customer?: {
    id?: string | null;
    externalId?: string | null;
  } | null;
  productId?: string | null;
  product?: {
    id?: string | null;
    name?: string | null;
  } | null;
}

interface PolarCheckoutDataLike {
  id?: string | null;
  customerId?: string | null;
  externalCustomerId?: string | null;
  productId?: string | null;
  product?: {
    id?: string | null;
    name?: string | null;
  } | null;
}

type PolarPayloadLike =
  | {
      type?: string | null;
      data?: PolarSubscriptionDataLike | PolarCheckoutDataLike | null;
    }
  | null
  | undefined;

const FREE_INTEGRATION_LIMIT = 1;
const PRO_MONTHLY_PRICE_LABEL = "$4.99/month";
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing", "past_due"]);

function mapBillingAccount(row: StoredBillingAccountRow): BillingAccountRecord {
  return {
    userId: row.user_id,
    polarCustomerId: row.polar_customer_id,
    polarExternalCustomerId: row.polar_external_customer_id,
    polarCheckoutId: row.polar_checkout_id,
    polarSubscriptionId: row.polar_subscription_id,
    subscriptionStatus: row.subscription_status,
    productId: row.product_id,
    productName: row.product_name,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    canceledAt: row.canceled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeSubscriptionStatus(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase();
  return normalized || "free";
}

function isPaidSubscriptionStatus(status: string | null | undefined): boolean {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(normalizeSubscriptionStatus(status));
}

function formatPolarDateTime(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getStatusLabel(status: string | null | undefined): string {
  const normalized = normalizeSubscriptionStatus(status);

  if (normalized === "free") {
    return "Free tier";
  }

  return normalized
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPolarServer(): PolarServer {
  return process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production";
}

export function getPolarCheckoutConfig() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  const productId = process.env.POLAR_PRODUCT_ID?.trim();

  return {
    accessToken,
    productId,
    server: getPolarServer(),
    isConfigured: Boolean(accessToken && productId),
  };
}

export function getPolarWebhookSecret(): string | null {
  return process.env.POLAR_WEBHOOK_SECRET?.trim() || null;
}

async function getBillingAccountForUserId(
  db: D1LikeDatabase,
  userId: string,
): Promise<BillingAccountRecord | null> {
  const row = await db
    .prepare(
      `
        SELECT user_id, polar_customer_id, polar_external_customer_id, polar_checkout_id,
               polar_subscription_id, subscription_status, product_id, product_name,
               current_period_end, cancel_at_period_end, canceled_at, created_at, updated_at
        FROM billing_accounts
        WHERE user_id = ?
        LIMIT 1
      `,
    )
    .bind(userId)
    .first<StoredBillingAccountRow>();

  return row ? mapBillingAccount(row) : null;
}

async function countDistinctIntegrationsForUserId(
  db: D1LikeDatabase,
  userId: string,
): Promise<number> {
  const result = await db
    .prepare(
      `
        SELECT COUNT(*) AS count
        FROM (
          SELECT DISTINCT integration
          FROM user_integrations
          WHERE user_id = ?
        )
      `,
    )
    .bind(userId)
    .first<{ count: number | string }>();

  return Number(result?.count ?? 0);
}

async function hasConnectedIntegrationForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `
        SELECT id
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        LIMIT 1
      `,
    )
    .bind(userId, slug)
    .first<{ id: number }>();

  return Boolean(row?.id);
}

export async function getBillingOverviewForCurrentUser(): Promise<BillingOverview> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return getBillingOverviewForUser(db, user);
}

export async function getBillingOverviewForUser(
  db: D1LikeDatabase,
  user: UserRow,
): Promise<BillingOverview> {
  const account = await getBillingAccountForUserId(db, user.id);
  const distinctIntegrationCount = await countDistinctIntegrationsForUserId(db, user.id);
  const subscribed = isPaidSubscriptionStatus(account?.subscriptionStatus);
  const needsUpgrade = !subscribed && distinctIntegrationCount >= FREE_INTEGRATION_LIMIT;

  return {
    planKey: subscribed ? "pro" : "free",
    planName: subscribed ? "ClawLink Pro" : "Free",
    priceLabel: subscribed ? PRO_MONTHLY_PRICE_LABEL : "$0",
    statusLabel: getStatusLabel(account?.subscriptionStatus),
    subscribed,
    distinctIntegrationCount,
    freeIntegrationLimit: FREE_INTEGRATION_LIMIT,
    canAddMoreIntegrations: subscribed || distinctIntegrationCount < FREE_INTEGRATION_LIMIT,
    needsUpgrade,
    currentPeriodEnd: account?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: account?.cancelAtPeriodEnd ?? false,
    productName: account?.productName ?? "ClawLink Pro",
    checkoutConfigured: getPolarCheckoutConfig().isConfigured,
    portalConfigured: Boolean(process.env.POLAR_ACCESS_TOKEN?.trim()),
    subscriptionStatus: account?.subscriptionStatus ?? null,
    checkoutUrl: "/api/billing/checkout",
    portalUrl: "/api/billing/portal",
  };
}

export async function getBillingAccessDecisionForUser(
  db: D1LikeDatabase,
  user: UserRow,
  integrationSlug: string,
): Promise<BillingAccessDecision> {
  const account = await getBillingAccountForUserId(db, user.id);
  const subscribed = isPaidSubscriptionStatus(account?.subscriptionStatus);

  if (subscribed) {
    return { allowed: true, reason: null };
  }

  const alreadyConnected = await hasConnectedIntegrationForUserId(db, user.id, integrationSlug);

  if (alreadyConnected) {
    return { allowed: true, reason: null };
  }

  const distinctIntegrationCount = await countDistinctIntegrationsForUserId(db, user.id);

  if (distinctIntegrationCount < FREE_INTEGRATION_LIMIT) {
    return { allowed: true, reason: null };
  }

  return {
    allowed: false,
    reason: "Your free plan includes one connected app. Upgrade to ClawLink Pro for $4.99/month to add more integrations.",
  };
}

async function upsertBillingAccount(
  db: D1LikeDatabase,
  userId: string,
  values: {
    polarCustomerId?: string | null;
    polarCheckoutId?: string | null;
    polarSubscriptionId?: string | null;
    subscriptionStatus?: string | null;
    productId?: string | null;
    productName?: string | null;
    currentPeriodEnd?: string | null;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: string | null;
  },
): Promise<void> {
  const normalizedStatus = values.subscriptionStatus === undefined
    ? null
    : normalizeSubscriptionStatus(values.subscriptionStatus);

  await db
    .prepare(
      `
        INSERT INTO billing_accounts (
          user_id,
          polar_customer_id,
          polar_external_customer_id,
          polar_checkout_id,
          polar_subscription_id,
          subscription_status,
          product_id,
          product_name,
          current_period_end,
          cancel_at_period_end,
          canceled_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET
          polar_customer_id = COALESCE(excluded.polar_customer_id, billing_accounts.polar_customer_id),
          polar_external_customer_id = excluded.polar_external_customer_id,
          polar_checkout_id = COALESCE(excluded.polar_checkout_id, billing_accounts.polar_checkout_id),
          polar_subscription_id = COALESCE(excluded.polar_subscription_id, billing_accounts.polar_subscription_id),
          subscription_status = COALESCE(excluded.subscription_status, billing_accounts.subscription_status),
          product_id = COALESCE(excluded.product_id, billing_accounts.product_id),
          product_name = COALESCE(excluded.product_name, billing_accounts.product_name),
          current_period_end = excluded.current_period_end,
          cancel_at_period_end = excluded.cancel_at_period_end,
          canceled_at = excluded.canceled_at,
          updated_at = datetime('now')
      `,
    )
    .bind(
      userId,
      values.polarCustomerId ?? null,
      userId,
      values.polarCheckoutId ?? null,
      values.polarSubscriptionId ?? null,
      normalizedStatus,
      values.productId ?? null,
      values.productName ?? null,
      values.currentPeriodEnd ?? null,
      values.cancelAtPeriodEnd ? 1 : 0,
      values.canceledAt ?? null,
    )
    .run();
}

function getExternalCustomerId(data: PolarSubscriptionDataLike | PolarCheckoutDataLike | null | undefined): string | null {
  if (!data) {
    return null;
  }

  if ("customer" in data && data.customer?.externalId) {
    return data.customer.externalId;
  }

  return data.externalCustomerId ?? null;
}

export async function syncBillingFromPolarWebhook(payload: PolarPayloadLike): Promise<void> {
  const db = getDatabase();

  if (!db || !payload?.type || !payload.data) {
    return;
  }

  const externalCustomerId = getExternalCustomerId(payload.data);

  if (!externalCustomerId) {
    return;
  }

  if (payload.type.startsWith("subscription.")) {
    const data = payload.data as PolarSubscriptionDataLike;

    await upsertBillingAccount(db, externalCustomerId, {
      polarCustomerId: data.customerId ?? data.customer?.id ?? null,
      polarCheckoutId: data.checkoutId ?? null,
      polarSubscriptionId: data.id ?? null,
      subscriptionStatus: data.status ?? payload.type.replace("subscription.", ""),
      productId: data.productId ?? data.product?.id ?? null,
      productName: data.product?.name ?? null,
      currentPeriodEnd: formatPolarDateTime(data.currentPeriodEnd),
      cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
      canceledAt: formatPolarDateTime(data.canceledAt),
    });

    return;
  }

  if (payload.type.startsWith("checkout.")) {
    const data = payload.data as PolarCheckoutDataLike;

    await upsertBillingAccount(db, externalCustomerId, {
      polarCustomerId: data.customerId ?? null,
      polarCheckoutId: data.id ?? null,
      productId: data.productId ?? data.product?.id ?? null,
      productName: data.product?.name ?? null,
    });
  }
}
