"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const STORAGE_KEY = "clawlink-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Apply the dark class to the DOM root -- pure side-effect, no React state. */
function applyClassToDom(t: Theme) {
  const el = document.getElementById("dashboard-theme-root");
  if (!el) return;
  if (t === "dark") {
    el.classList.add("dark");
  } else {
    el.classList.remove("dark");
  }
}

function readThemeFromStorage(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "dark";
}

/** Subscribe to storage events so cross-tab changes are picked up. */
function subscribeToStorage(callback: () => void) {
  function handler(e: StorageEvent) {
    if (e.key === STORAGE_KEY) callback();
  }
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

/** Server snapshot is always "dark" to match the inline <script> default. */
function getServerSnapshot(): Theme {
  return "dark";
}

export function DashboardThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Read the theme from localStorage as an external store.
  // On the server this returns "dark", matching the inline script.
  // On the client it reads the real stored value -- no effect needed.
  const theme = useSyncExternalStore(
    subscribeToStorage,
    readThemeFromStorage,
    getServerSnapshot,
  );

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
    applyClassToDom(t);
    // Dispatch a storage event on the current window so
    // useSyncExternalStore re-reads the value.
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: t }),
    );
  }, []);

  const toggle = useCallback(() => {
    const next = readThemeFromStorage() === "dark" ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDashboardTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return ctx;
}
