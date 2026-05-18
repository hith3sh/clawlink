"use client";

import { useState, useCallback } from "react";

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [label, setLabel] = useState("Copy for LLMs");

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(markdown).then(() => {
      setLabel("Copied!");
      setTimeout(() => setLabel("Copy for LLMs"), 2000);
    });
  }, [markdown]);

  return (
    <button
      type="button"
      className="blog-post-share-btn"
      onClick={copy}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      {label}
    </button>
  );
}