"use client";

import { useState, useCallback } from "react";

export function CopyLinkButton() {
  const [label, setLabel] = useState("Copy link");

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setLabel("Copied!");
      setTimeout(() => setLabel("Copy link"), 2000);
    });
  }, []);

  return (
    <button
      type="button"
      className="blog-post-share-btn"
      onClick={copy}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      {label}
    </button>
  );
}