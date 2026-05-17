"use client";

import { useMarketingTheme } from "@/components/MarketingThemeProvider";

export function HeroProductName() {
  const { theme } = useMarketingTheme();
  return <>{theme === "hermes" ? "Hermes" : "Openclaw"}</>;
}
