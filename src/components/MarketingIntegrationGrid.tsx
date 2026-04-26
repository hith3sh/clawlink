import Link from "next/link";
import { integrations } from "@/data/integrations";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";

const SHOWCASE_SLUGS = [
  "gmail",
  "slack",
  "discord",
  "github",
  "notion",
  "google-sheets",
  "google-calendar",
  "stripe",
  "shopify",
  "hubspot",
  "telegram",
  "linear",
  "vercel",
  "supabase",
  "youtube",
];

export function MarketingIntegrationGrid() {
  const showcase = SHOWCASE_SLUGS.map((slug) =>
    integrations.find((i) => i.slug === slug)
  ).filter(Boolean);

  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          40+ integrations ready to go
        </h2>
        <p className="mt-3 text-base text-gray-500">
          Connect the tools you already use — no setup headaches
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showcase.map((integration) => (
          <div
            key={integration!.slug}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${integration!.color}15` }}
              >
                {hasBrandLogo(integration!.slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getBrandLogoSrc(integration!.slug, "light")}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <span
                    className="text-sm font-bold"
                    style={{ color: integration!.color }}
                  >
                    {integration!.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="truncate text-sm font-medium text-gray-900">
                {integration!.name}
              </span>
            </div>

            <Link
              href="/sign-up"
              className="shrink-0 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)]"
            >
              Connect
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
