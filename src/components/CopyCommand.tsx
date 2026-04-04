"use client";

import { useState } from "react";
import { OPENCLAW_PLUGIN_INSTALL_COMMAND } from "@/lib/openclaw-plugin";
import { Check, Copy } from "lucide-react";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(OPENCLAW_PLUGIN_INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex flex-1 items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-5 py-3.5 font-mono text-sm transition-all hover:border-amber-300/50 hover:bg-amber-50/50 hover:shadow-md hover:shadow-amber-500/10 cursor-pointer"
    >
      <span className="text-amber-500/60 select-none">$</span>
      <span className="text-gray-700">{OPENCLAW_PLUGIN_INSTALL_COMMAND}</span>
      <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-amber-600 transition-colors">
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
