"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bot, User, Check, Copy } from "lucide-react";
import {
  CLAWLINK_VERIFY_URL,
} from "@/lib/openclaw-plugin";
import { AGENT_PROMPT, AgentPromptText } from "@/components/AgentPrompt";

type Audience = "human" | "agent";

const CLAWHUB_PLUGIN_INSTALL_COMMAND = "openclaw plugins install clawhub:clawlink-plugin";
const CLAWLINK_DASHBOARD_URL = "https://claw-link.dev/dashboard";

export default function AudienceTabs() {
  const [audience, setAudience] = useState<Audience>("agent");

  return (
    <div className="mx-auto max-w-3xl">
      {/* Tab row — pill switcher */}
      <div className="mb-7 flex justify-center">
        <div
          className="inline-flex items-center gap-2 rounded-full p-1.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--mk-border)",
          }}
          role="tablist"
          aria-label="How would you like to set up?"
        >
          <TabButton
            active={audience === "agent"}
            onClick={() => setAudience("agent")}
            icon={<Bot className="h-3.5 w-3.5" />}
            label="Let my AI set itself up"
          />
          <TabButton
            active={audience === "human"}
            onClick={() => setAudience("human")}
            icon={<User className="h-3.5 w-3.5" />}
            label="Set up yourself"
          />
        </div>
      </div>

      <div className={audience === "agent" ? "block" : "hidden"}>
        <AgentPanel />
      </div>
      <div className={audience === "human" ? "block" : "hidden"}>
        <HumanPanel />
      </div>
    </div>
  );
}

/* ─── Tab button ─── */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="relative inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--brand)",
            boxShadow: "0 8px 20px rgba(224,53,43,0.35)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
          }}
        />
      )}
      <span
        className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300"
        style={{
          color: active ? "#fff" : "rgba(255,255,255,0.72)",
        }}
      >
        {icon}
        {label}
      </span>
    </button>
  );
}

function HumanPanel() {
  return (
    <div className="rounded-3xl p-5 text-left sm:p-8">
      <h2
        className="mb-5 text-center text-2xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
        }}
      >
        Pair once, then connect apps from the dashboard
      </h2>

      {/* Three setup cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SetupCard
          num="01"
          title="Install the plugin"
          desc="Install ClawLink from ClawHub in OpenClaw."
          codeSnippet={CLAWHUB_PLUGIN_INSTALL_COMMAND}
        />
        <SetupCard
          num="02"
          title="Start browser pairing"
          desc="Ask OpenClaw to pair ClawLink for this device."
        />
        <SetupCard
          num="03"
          title="Connect apps"
          desc="Open the dashboard, click Connect, and complete OAuth."
        />
      </div>

      <ol className="mt-5 space-y-2.5">
        <Step num={1}>
          Approve the browser pairing page after OpenClaw opens it.
        </Step>
        <Step num={2}>
          Click <strong className="text-white">Connect</strong> on any dashboard integration. We handle OAuth.
        </Step>
        <Step num={3}>
          Send your agent a request. No API key copy-paste is needed for normal setup.
        </Step>
      </ol>

      <p className="mt-8 text-center text-xs" style={{ color: "var(--mk-fg-faint)" }}>
        <a
          href={CLAWLINK_VERIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          Verify our plugin
        </a>
        {" · "}
        <a
          href={CLAWLINK_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          Open dashboard
        </a>
      </p>
    </div>
  );
}

function SetupCard({
  num,
  title,
  desc,
  codeSnippet,
}: {
  num: string;
  title: string;
  desc: string;
  codeSnippet?: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-[14px] p-4"
      style={{
        background: "var(--mk-tile)",
        border: "1px solid var(--mk-border)",
      }}
    >
      <span
        className="text-[13px] font-bold"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--brand)",
        }}
      >
        {num}
      </span>
      <h4
        className="text-base font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
        }}
      >
        {title}
      </h4>
      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--mk-fg-muted)" }}>
        {desc}
      </p>
      {codeSnippet && (
        <code
          className="mt-auto block truncate rounded-lg px-2.5 py-1.5 text-[11.5px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--mk-border)",
            color: "#FF9A78",
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          }}
        >
          {codeSnippet}
        </code>
      )}
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="rounded-3xl p-5 text-left sm:p-8">
      <h2
        className="mb-5 text-center text-2xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
          letterSpacing: "-0.02em",
        }}
      >
        Point your AI agent at ClawLink
      </h2>

      {/* Code card */}
      <div
        className="flex items-start gap-4 rounded-2xl px-6 py-5"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <AgentPromptText
          containerClassName="flex-1 text-[13.5px] leading-[1.7]"
          containerStyle={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            color: "rgba(255,255,255,0.88)",
          }}
          linkClassName="underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
          linkStyle={{ color: "#FF9A78" }}
        />
        <CopyButton text={AGENT_PROMPT} />
      </div>

      <ol className="mt-6 space-y-3">
        <Step num={1}>Send this prompt to your agent.</Step>
        <Step num={2}>
          The agent reads <code className="mk-code">skill.md</code> and discovers ClawLink&apos;s live tool catalog.
        </Step>
        <Step num={3}>
          It calls your connected integrations through ClawLink — no per-app API keys needed.
        </Step>
      </ol>
    </div>
  );
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <li
      className="grid gap-3 text-[14.5px] leading-relaxed"
      style={{
        gridTemplateColumns: "28px 1fr",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <span
        className="text-base font-bold"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--brand)",
        }}
      >
        {num}.
      </span>
      <span>{children}</span>
    </li>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy prompt to clipboard"
      className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-white/10"
      style={{
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
