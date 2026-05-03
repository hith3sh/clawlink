"use client";

import { useState } from "react";
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
      className="inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
      style={
        active
          ? {
              background: "var(--brand)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(224,53,43,0.35)",
            }
          : {
              background: "transparent",
              color: "rgba(255,255,255,0.72)",
              border: "1px solid transparent",
            }
      }
    >
      {icon}
      {label}
    </button>
  );
}

function HumanPanel() {
  return (
    <div
      className="rounded-3xl p-5 text-left sm:p-8"
      style={{
        background: "var(--mk-elev)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
      }}
    >
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

      <p className="mt-4 text-center text-xs" style={{ color: "var(--mk-fg-faint)" }}>
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
    <div
      className="rounded-3xl p-5 text-left sm:p-8"
      style={{
        background: "var(--mk-elev)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
      }}
    >
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
        className="overflow-hidden rounded-2xl"
        style={{
          background: "var(--mk-tile)",
          border: "1px solid var(--mk-border)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-3.5 py-3"
          style={{ borderBottom: "1px solid var(--mk-border-card)" }}
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ED6A5E" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#F4BE4F" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#61C554" }} />
          </div>
          <span
            className="ml-1 text-[11px] font-medium uppercase tracking-[0.10em]"
            style={{ color: "var(--mk-fg-faint)" }}
          >
            prompt
          </span>
          <div className="ml-auto">
            <CopyButton text={AGENT_PROMPT} />
          </div>
        </div>
        <AgentPromptText
          containerClassName="px-5 py-5 text-[13px] leading-[1.65]"
          containerStyle={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            color: "rgba(255,255,255,0.92)",
          }}
          linkClassName="underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
          linkStyle={{ color: "#FF9A78" }}
        />
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
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}
