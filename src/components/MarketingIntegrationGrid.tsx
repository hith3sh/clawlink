import Link from "next/link";
import { integrations } from "@/data/integrations";
import type { Integration } from "@/data/integrations";
import { hasBrandLogo, getBrandLogoSrc } from "@/lib/brand-logos";

/* 24 available integrations with brand logos in /public/icons/ */
const PREFERRED_SHOWCASE_SLUGS = [
  "gmail",
  "notion",
  "google-calendar",
  "google-drive",
  "google-docs",
  "google-search-console",
  "google-ads",
  "hubspot",
  "salesforce",
  "instagram",
  "linkedin",
  "twitter",
  "airtable",
  "outlook",
  "facebook",
  "shopify",
  "supabase",
  "firebase",
  "motion",
  "postiz",
  "instantly",
  "activecampaign",
  "ahrefs",
  "dataforseo",
];

export function MarketingIntegrationGrid() {
  const showcase: Integration[] = PREFERRED_SHOWCASE_SLUGS
    .map((slug) => integrations.find((i) => i.slug === slug && i.dashboardStatus === "available"))
    .filter((i): i is Integration => i !== undefined);

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 md:grid-cols-8">
        {showcase.map((integration, index) => (
          <Link
            key={integration.slug}
            href="/sign-up"
            className={`group aspect-square items-center justify-center rounded-[14px] transition-all duration-200 ${
              index >= 20 ? "hidden sm:flex" : "flex"
            }`}
            style={{
              background: "var(--mk-tile)",
              border: "1px solid var(--mk-border-card)",
            }}
            title={integration.name}
          >
            {hasBrandLogo(integration.slug) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getBrandLogoSrc(integration.slug, "dark")}
                alt={integration.name}
                className="h-[50%] w-[50%] object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <span
                className="text-lg font-bold"
                style={{ color: integration.color }}
              >
                {integration.name.charAt(0)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
