export const SITE_NAME = "ClawLink";
export const SITE_URL = "https://claw-link.dev";
export const DOCS_URL = "https://docs.claw-link.dev";
export const SITE_DESCRIPTION =
  "Install ClawLink in OpenClaw once, then connect apps with one click. Provider credentials are managed by ClawLink, encrypted at rest, and activation is $2.99/month once access becomes inactive.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo/social-card.png`;
export const ORGANIZATION_LOGO = `${SITE_URL}/images/logo/clawlink-512.png`;

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function toAbsoluteImageUrl(image?: string | null) {
  if (!image) {
    return DEFAULT_OG_IMAGE;
  }

  try {
    return new URL(image).toString();
  } catch {
    return toAbsoluteUrl(image.startsWith("/") ? image : `/${image}`);
  }
}
