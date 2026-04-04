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
        <h3 className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-5">
          The hard way
        </h3>
        <div className="space-y-3.5">
          {painItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-mono text-amber-500/70 w-14 shrink-0 text-right">
                {item.hours}
              </span>
              <span className="text-gray-600">{item.task}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 flex items-center gap-4">
            <span className="text-sm font-mono text-amber-600 w-14 shrink-0 text-right font-bold">
              15+ hrs
            </span>
            <span className="text-gray-900 font-medium">per integration</span>
          </div>
        </div>
      </div>

      {/* Solution side */}
      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-8 shadow-lg shadow-amber-500/5">
        <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wider mb-5">
          The ClawLink way
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">1</div>
            <code className="text-sm bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-gray-800 font-mono">
              {OPENCLAW_PLUGIN_INSTALL_COMMAND}
            </code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-600">Paste `/clawlink login &lt;apiKey&gt;` in OpenClaw</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-600">Say &ldquo;connect my app&rdquo; and finish auth in one click</span>
          </div>
          <div className="border-t border-amber-200/50 pt-4">
            <span className="text-amber-700 font-semibold text-lg">Install once. Connect from any device.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
