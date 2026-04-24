"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { OPENCLAW_PLUGIN_SETUP_PROMPT } from "@/lib/openclaw-plugin";

export default function CopyPromptButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(OPENCLAW_PLUGIN_SETUP_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy OpenClaw setup prompt to clipboard"
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[var(--brand)]/40 hover:text-[var(--brand-hover)]"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}
