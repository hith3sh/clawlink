"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is ClawLink?",
    a: "ClawLink is a hosted connection layer for OpenClaw. Install ClawLink once, then connect apps like Notion, Slack, GitHub, and Gmail without manually wiring provider auth every time.",
  },
  {
    q: "How does it work with OpenClaw?",
    a: "Install the ClawLink plugin in OpenClaw, create a ClawLink API key once, then say something like \"connect my Notion.\" ClawLink creates a hosted setup link, you approve access in the browser, and OpenClaw polls until the integration is ready.",
  },
  {
    q: "Is my API key safe?",
    a: "Provider credentials are encrypted before they are stored, and ClawLink API keys are only shown once when created. The hosted setup flow means OpenClaw does not need to own every provider token directly.",
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
    q: "Is it free?",
    a: "The install and core product are being positioned around easy hosted connections for OpenClaw. Pricing can sit on top of that convenience layer, while the codebase remains open to inspect.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
        Frequently asked questions
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Everything you need to know about ClawLink
      </p>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 shrink-0 ml-4 transition-transform ${
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
              <p className="pb-5 text-gray-500 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
