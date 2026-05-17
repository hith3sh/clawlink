"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import {
  CLAWLINK_VERIFY_URL,
} from "@/lib/openclaw-plugin";
import { AGENT_PROMPT, AgentPromptText } from "@/components/AgentPrompt";
import { useMarketingTheme } from "@/components/MarketingThemeProvider";

type SetupTarget = "openclaw" | "hermes";

const CLAWLINK_DASHBOARD_URL = "https://claw-link.dev/dashboard";
const HERMES_PROMPT = `Install ClawLink as a Hermes plugin and pair it with my account, then verify it works.

Run these two commands:

hermes plugins install claw-link/hermes-plugin --enable
hermes clawlink setup

When setup prints an approval link, send me that link here. Once I approve it, wait for setup to finish, then run \`hermes clawlink test\` and tell me whether ClawLink is ready.`;

export default function AudienceTabs() {
  const [setupTarget, setSetupTarget] = useState<SetupTarget>("openclaw");
  const { setTheme } = useMarketingTheme();

  const switchTab = (target: SetupTarget) => {
    setSetupTarget(target);
    setTheme(target);
  };

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
          aria-label="Choose your agent"
        >
          <TabButton
            active={setupTarget === "openclaw"}
            onClick={() => switchTab("openclaw")}
            icon={<Image src="/brand/bento/openclaw.png" alt="" width={16} height={16} className="rounded-full" />}
            label="OpenClaw"
          />
          <TabButton
            active={setupTarget === "hermes"}
            onClick={() => switchTab("hermes")}
            icon={<Image src="/brand/bento/hermes-agent-light.png" alt="" width={16} height={16} className="rounded-full" />}
            label="Hermes"
          />
        </div>
      </div>

      <div className={setupTarget === "openclaw" ? "block" : "hidden"}>
        <OpenClawPanel />
      </div>
      <div className={setupTarget === "hermes" ? "block" : "hidden"}>
        <HermesPanel />
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
            boxShadow: "0 8px 20px rgb(var(--brand-rgb) / 0.35)",
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

function OpenClawPanel() {
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
          linkStyle={{ color: "var(--brand-link)" }}
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

function HermesPanel() {
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
        Point your AI agent at Hermes
      </h2>

      <div
        className="flex items-start gap-4 rounded-2xl px-6 py-5"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          className="flex-1 whitespace-pre-wrap text-[13.5px] leading-[1.7]"
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          <p className="mb-2">Install ClawLink as a Hermes plugin and pair it with my account, then verify it works.</p>
          <p className="mb-2">Run these two commands:</p>
          <p className="mb-2">
            <span
              className="underline decoration-[var(--brand)]/40 underline-offset-4"
              style={{ color: "var(--brand-link)" }}
            >
              hermes plugins install claw-link/hermes-plugin --enable
            </span>
          </p>
          <p className="mb-2">
            <span
              className="underline decoration-[var(--brand)]/40 underline-offset-4"
              style={{ color: "var(--brand-link)" }}
            >
              hermes clawlink setup
            </span>
          </p>
          <p>When setup prints an approval link, send me that link here. Once I approve it, wait for setup to finish, then run <code>`hermes clawlink test`</code> and tell me whether ClawLink is ready.</p>
        </div>
        <CopyButton text={HERMES_PROMPT} />
      </div>

      <ol className="mt-6 space-y-3">
        <Step num={1}>Paste the prompt into your Hermes chat.</Step>
        <Step num={2}>Hermes installs the ClawLink plugin and sends you an approval link.</Step>
        <Step num={3}>Approve from browser, then Hermes tests the connection before it says setup is done.</Step>
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
