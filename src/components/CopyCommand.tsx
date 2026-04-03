"use client";

import { useState } from "react";

const INSTALL_COMMAND = "openclaw plugins install clawlink";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm transition-all hover:border-gray-300 hover:bg-gray-100 cursor-pointer"
    >
      <span className="text-gray-300 select-none">$</span>
      <span className="text-gray-900">{INSTALL_COMMAND}</span>
      <span className="ml-auto text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
