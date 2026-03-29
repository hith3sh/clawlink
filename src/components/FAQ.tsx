"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is ClawLink?",
    a: "ClawLink is an open-source MCP server that lets you connect 40+ APIs to OpenClaw with a single command. No boilerplate, no config files.",
  },
  {
    q: "How does it work with OpenClaw?",
    a: "Run `npx clawlink@latest init`, pick your integrations, paste your API keys, and ClawLink sets up an MCP server that OpenClaw connects to automatically. Then just ask OpenClaw to \"send an email\" or \"create a Slack message\" — it handles the rest.",
  },
  {
    q: "Is my API key safe?",
    a: "Your API keys are stored locally on your machine in an encrypted config file. They never leave your device. ClawLink is fully open source — you can audit every line of code.",
  },
  {
    q: "Does it work with other AI tools?",
    a: "ClawLink is built for OpenClaw, but since it's a standard MCP server, it works with any MCP-compatible client like Claude Desktop, Cursor, and more.",
  },
  {
    q: "Can I add custom integrations?",
    a: "Yes! ClawLink has a plugin system. You can write your own integration in a single file and contribute it back to the community.",
  },
  {
    q: "Is it free?",
    a: "Yes, ClawLink is 100% free and open source under the MIT license.",
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
