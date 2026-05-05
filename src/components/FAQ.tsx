"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is ClawLink?",
    a: "ClawLink is a hosted connection layer for OpenClaw. Install ClawLink once, then connect apps like Notion, Slack, GitHub, and Gmail without manually wiring provider auth every time.",
  },
  {
    q: "How does it work with OpenClaw?",
    a: "Install the ClawLink plugin in OpenClaw, ask it to pair ClawLink once, approve the browser prompt, then connect apps in the ClawLink dashboard. After that, OpenClaw can use those connected tools directly.",
  },
  {
    q: "Is my API key safe?",
    a: "ClawLink stores provider OAuth tokens and API keys on ClawLink servers after you approve access, encrypts them before storage, and uses them only for requests you trigger or token refresh needed to maintain the connection. Browser pairing stores only a ClawLink device credential locally, so most users never paste an API key into chat.",
  },
  {
    q: "Does it work with other AI tools?",
    a: "ClawLink is built around the OpenClaw workflow first. The current product direction is install once in OpenClaw, then connect and manage apps through hosted sessions.",
  },
  {
    q: "Can I add custom integrations?",
    a: "Yes! ClawLink has a plugin system. You can write your own integration in a single file and contribute it back to the community.",
  },
  {
    q: "How billing works",
    a: "ClawLink may ask you to activate access if your integrations are inactive. Once activated, you can use the full integration catalog for $4.99/month.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-3 tracking-tight">
        Frequently asked questions
      </h2>
      <p className="text-center text-gray-500 mb-12 text-lg">
        Everything you need to know about ClawLink
      </p>
      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        {faqs.map((faq, i) => (
          <div key={i} className="first:rounded-t-2xl last:rounded-b-2xl">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <p className="pb-5 px-6 text-gray-500 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
