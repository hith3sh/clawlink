"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search integrations... (Gmail, Slack, Stripe, etc.)"
        className="w-full rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm py-4.5 pl-12 pr-14 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--brand-tint)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--brand)]/10 transition-all"
        autoFocus
      />
      {value && (
        <span className="absolute inset-y-0 right-5 flex items-center text-sm text-gray-400">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
