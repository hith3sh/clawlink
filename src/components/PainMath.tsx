"use client";

import { OPENCLAW_PLUGIN_INSTALL_COMMAND } from "@/lib/openclaw-plugin";

const painItems = [
  { hours: "4 hrs", task: "Reading Gmail API docs" },
  { hours: "3 hrs", task: "Fighting OAuth token refresh" },
  { hours: "2 hrs", task: "Writing Slack webhook handlers" },
  { hours: "6 hrs", task: "Debugging WordPress REST API" },
  { hours: "∞ hrs", task: "Maintaining it all..." },
];

export default function PainMath() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Pain side */}
      <div>
        <h3 className="text-sm font-medium text-[var(--brand-hover)] uppercase tracking-wider mb-5">
          The hard way
        </h3>
        <div className="space-y-3.5">
          {painItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-mono text-[var(--brand)]/70 w-14 shrink-0 text-right">
                {item.hours}
              </span>
              <span className="text-gray-600">{item.task}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 flex items-center gap-4">
            <span className="text-sm font-mono text-[var(--brand-hover)] w-14 shrink-0 text-right font-bold">
              15+ hrs
            </span>
            <span className="text-gray-900 font-medium">per integration</span>
          </div>
        </div>
      </div>

      {/* Solution side */}
      <div className="rounded-2xl border border-[var(--brand-tint)]/60 bg-gradient-to-br from-[var(--brand-tint)]/30 to-white p-8 shadow-lg shadow-[var(--brand)]/5">
        <h3 className="text-sm font-medium text-[var(--brand-dark)] uppercase tracking-wider mb-5">
          The ClawLink way
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-tint)] text-[var(--brand-hover)] flex items-center justify-center text-sm font-bold">1</div>
            <code className="text-sm bg-white border border-[var(--brand-tint)] rounded-lg px-3 py-1.5 text-gray-800 font-mono">
              {OPENCLAW_PLUGIN_INSTALL_COMMAND}
            </code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-tint)] text-[var(--brand-hover)] flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-600">Pair ClawLink in the browser once</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-tint)] text-[var(--brand-hover)] flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-600">Connect an app in the dashboard and use it in chat</span>
          </div>
          <div className="border-t border-[var(--brand-tint)]/50 pt-4">
            <span className="text-[var(--brand-dark)] font-semibold text-lg">Install once. Connect from any device.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
