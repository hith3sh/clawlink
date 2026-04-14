"use client";

import { useState } from "react";
import { OPENCLAW_PLUGIN_SETUP_PROMPT } from "@/lib/openclaw-plugin";
import { Check, Copy } from "lucide-react";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(OPENCLAW_PLUGIN_SETUP_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex w-full items-start gap-3 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-5 py-4 text-left text-sm transition-all hover:border-[#ffe4cc]/50 hover:bg-[#ffe4cc]/20 hover:shadow-md hover:shadow-[#e8915a]/10 cursor-pointer"
    >
      <span className="mt-0.5 text-[#e8915a]/60 select-none">✦</span>
      <span className="min-w-0 flex-1 whitespace-pre-line font-mono text-gray-700">
        {OPENCLAW_PLUGIN_SETUP_PROMPT}
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-[#d4764a] transition-colors">
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span className="font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </span>
    </button>
  );
}
