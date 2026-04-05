// Slugs that have a colored brand SVG stored at /public/icons/{slug}.svg.
// Anything not in this set falls back to the monochromatic Simple Icons
// rendering defined in integration-icons.ts.
const BRAND_LOGO_SLUGS = new Set<string>([
  "gmail",
  "slack",
  "discord",
  "microsoft-teams",
  "telegram",
  "apollo",
  "salesforce",
  "wordpress",
  "webflow",
  "youtube",
  "twitter",
  "linkedin",
  "instagram",
  "google-sheets",
  "google-calendar",
  "google-drive",
  "notion",
  "todoist",
  "github",
  "gitlab",
  "linear",
  "vercel",
  "stripe",
  "paypal",
  "google-analytics",
  "aws-s3",
  "supabase",
  "firebase",
  "shopify",
  "openai",
  "replicate",
]);

// Brands whose logo is monochrome and therefore needs a theme-specific variant
// (a dark logo on light backgrounds, a light logo on dark backgrounds).
// Files for these live at /public/icons/{slug}-{theme}.svg.
const THEMED_BRAND_SLUGS = new Set<string>([
  "github",
  "vercel",
  "openai",
  "twitter",
  "aws-s3",
  "replicate",
]);

export type BrandLogoTheme = "light" | "dark";

export function hasBrandLogo(slug: string): boolean {
  return BRAND_LOGO_SLUGS.has(slug);
}

export function getBrandLogoSrc(
  slug: string,
  theme: BrandLogoTheme = "dark",
): string {
  if (THEMED_BRAND_SLUGS.has(slug)) {
    return `/icons/${slug}-${theme}.svg`;
  }
  return `/icons/${slug}.svg`;
}
