"use client";

import { useState, useCallback, useRef } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const initialized = useRef(false);

  // Use a ref + callback to hydrate from localStorage on first render
  const containerRef = useCallback((node: HTMLButtonElement | null) => {
    if (node && !initialized.current) {
      initialized.current = true;
      const saved = localStorage.getItem("blog-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.setAttribute("data-blog-theme", saved);
      }
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("blog-theme", next);
    document.documentElement.setAttribute("data-blog-theme", next);
  }

  return (
    <button
      ref={containerRef}
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex items-center justify-center rounded-full p-2 transition-colors"
      style={{
        background: "var(--blog-surface)",
        color: "var(--blog-fg-muted)",
        border: "1px solid var(--blog-border)",
      }}
    >
      {theme === "dark" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
