"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

export type MarketingTheme = "openclaw" | "hermes";

interface ThemePalette {
  "--brand": string;
  "--brand-hover": string;
  "--brand-hover-alt": string;
  "--brand-tint": string;
  "--brand-bg": string;
  "--brand-border": string;
  "--brand-dark": string;
  "--brand-darkest": string;
  "--brand-rgb": string;
  "--brand-soft": string;
  "--brand-link": string;
}

const OPENCLAW_PALETTE: ThemePalette = {
  "--brand": "#E0352B",
  "--brand-hover": "#FF4438",
  "--brand-hover-alt": "#FF7A4A",
  "--brand-tint": "#ffe4cc",
  "--brand-bg": "#fff4ec",
  "--brand-border": "#efc7ab",
  "--brand-dark": "#A8221A",
  "--brand-darkest": "#8d4c24",
  "--brand-rgb": "224 53 43",
  "--brand-soft": "#FFC8B6",
  "--brand-link": "#FF9A78",
};

const HERMES_PALETTE: ThemePalette = {
  "--brand": "#FFC001",
  "--brand-hover": "#FFD03A",
  "--brand-hover-alt": "#FFE066",
  "--brand-tint": "#fff4cc",
  "--brand-bg": "#fffbec",
  "--brand-border": "#e6c96b",
  "--brand-dark": "#B88A00",
  "--brand-darkest": "#8B6914",
  "--brand-rgb": "255 192 1",
  "--brand-soft": "#FFE8A0",
  "--brand-link": "#FFD54F",
};

export const PALETTES: Record<MarketingTheme, ThemePalette> = {
  openclaw: OPENCLAW_PALETTE,
  hermes: HERMES_PALETTE,
};

interface MarketingThemeContextValue {
  theme: MarketingTheme;
  setTheme: (t: MarketingTheme) => void;
  palette: ThemePalette;
}

const MarketingThemeContext = createContext<MarketingThemeContextValue>({
  theme: "openclaw",
  setTheme: () => {},
  palette: OPENCLAW_PALETTE,
});

export function useMarketingTheme() {
  return useContext(MarketingThemeContext);
}

export function MarketingThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<MarketingTheme>("openclaw");

  const setTheme = useCallback((t: MarketingTheme) => {
    setThemeState(t);
  }, []);

  const palette = PALETTES[theme];

  const value = useMemo(
    () => ({ theme, setTheme, palette }),
    [theme, setTheme, palette],
  );

  return (
    <MarketingThemeContext.Provider value={value}>
      <div style={palette as React.CSSProperties}>{children}</div>
    </MarketingThemeContext.Provider>
  );
}
