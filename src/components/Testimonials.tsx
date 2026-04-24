const testimonials = [
  {
    quote: "I connected Gmail, Slack, and Notion to OpenClaw in under 2 minutes. No docs, no config files. Just worked.",
    name: "Sarah Chen",
    role: "Indie Hacker",
    avatar: "SC",
  },
  {
    quote: "We were building custom API wrappers for every tool. ClawLink replaced weeks of work with one command.",
    name: "Marcus Johnson",
    role: "CTO, StartupXYZ",
    avatar: "MJ",
  },
  {
    quote: "Finally, someone made MCP integrations that don't require a PhD in OAuth. My non-technical team can set this up.",
    name: "Priya Patel",
    role: "Product Manager",
    avatar: "PP",
  },
];

export default function Testimonials() {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 tracking-tight">
        People love it
      </h2>
      <p className="text-center text-gray-500 mb-12 text-lg">
        Join hundreds of OpenClaw users who stopped fighting APIs
      </p>
      <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[var(--brand-tint)]/50 transition-all"
          >
            <p className="text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center text-white text-sm font-bold">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
