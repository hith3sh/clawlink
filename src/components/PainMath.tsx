"use client";

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
        <h3 className="text-sm font-medium text-red-500 uppercase tracking-wider mb-4">
          The hard way
        </h3>
        <div className="space-y-3">
          {painItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-mono text-red-400 w-14 shrink-0 text-right">
                {item.hours}
              </span>
              <span className="text-gray-600">{item.task}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex items-center gap-3">
            <span className="text-sm font-mono text-red-500 w-14 shrink-0 text-right font-bold">
              15+ hrs
            </span>
            <span className="text-gray-900 font-medium">per integration</span>
          </div>
        </div>
      </div>

      {/* Solution side */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
        <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider mb-4">
          The ClawLink way
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">1</div>
            <code className="text-sm bg-white border border-green-200 rounded-lg px-3 py-1.5 text-gray-800">
              openclaw plugins install clawlink
            </code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-600">Create a ClawLink API key once</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-600">Say “connect my app” and finish auth in one click</span>
          </div>
          <div className="border-t border-green-200 pt-3">
            <span className="text-green-700 font-semibold text-lg">Install once. Connect from any device.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
