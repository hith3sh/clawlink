"use client";

import { useState } from "react";
import { Bot, Check, Copy, User } from "lucide-react";
import {
  CLAWLINK_API_SETTINGS_URL,
  CLAWLINK_GITHUB_URL,
  CLAWLINK_NPM_URL,
  CLAWLINK_OPENCLAW_DOCS_URL,
  CLAWLINK_SKILL_URL,
  CLAWLINK_VERIFY_URL,
  OPENCLAW_PLUGIN_INSTALL_COMMAND,
  OPENCLAW_PLUGIN_PACKAGE,
  OPENCLAW_PLUGIN_SETUP_PROMPT,
} from "@/lib/openclaw-plugin";

type Audience = "human" | "agent";

const AGENT_PROMPT = `Read ${CLAWLINK_SKILL_URL} and follow the instructions to use ClawLink for third-party integrations.`;

export default function AudienceTabs() {
  const [audience, setAudience] = useState<Audience>("human");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-center gap-3">
        <TabButton
          active={audience === "human"}
          onClick={() => setAudience("human")}
          icon={<User className="h-4 w-4" aria-hidden />}
          label="Set up yourself"
        />
        <TabButton
          active={audience === "agent"}
          onClick={() => setAudience("agent")}
          icon={<Bot className="h-4 w-4" aria-hidden />}
          label="Let my AI set itself up"
        />
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
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgb(var(--brand-rgb)_/_0.3)] transition"
          : "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
      }
    >
      {icon}
      {label}
    </button>
  );
}

function HumanPanel() {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10">
      <div className="-mt-2 mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
          Setup for humans
        </p>
        <CopyButton text={OPENCLAW_PLUGIN_SETUP_PROMPT} />
      </div>
      <div className="space-y-5 text-[15px] leading-[1.9] text-gray-700">
        <p>
          ClawLink is a third-party plugin for OpenClaw. It is open source, verifiable, and safe to use.{" "}
          <a
            href={CLAWLINK_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline"
          >
            Verify it here
          </a>
          .
        </p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-semibold text-gray-900">Step 1 — Install the plugin</p>
          <p className="mt-1">Copy and paste this into your terminal or OpenClaw:</p>
          <code className="mt-2 block rounded-lg bg-white px-3 py-2 text-sm font-mono text-gray-900 border border-gray-200">
            {OPENCLAW_PLUGIN_INSTALL_COMMAND}
          </code>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-semibold text-gray-900">Step 2 — Get your personal access code</p>
          <p className="mt-1">
            Go to your{" "}
            <a
              href={CLAWLINK_API_SETTINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline"
            >
              ClawLink dashboard
            </a>{" "}
            and copy your API key.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-semibold text-gray-900">Step 3 — Log in</p>
          <p className="mt-1">Paste this into your OpenClaw chat as a standalone message:</p>
          <code className="mt-2 block rounded-lg bg-white px-3 py-2 text-sm font-mono text-gray-900 border border-gray-200">
            /clawlink login {"<your-api-key>"}
          </code>
          <p className="mt-2 text-sm text-gray-500">
            Your key is stored safely on your computer and never seen by the AI.
          </p>
        </div>
      </div>
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10">
      <div className="-mt-2 mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
          Send ClawLink to your agent
        </p>
        <CopyButton text={AGENT_PROMPT} />
      </div>

      <h3 className="text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-[28px]">
        Point your AI agent at ClawLink
      </h3>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6258]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbe2f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400">
            prompt
          </span>
        </div>
        <div className="px-5 py-6 text-[15px] leading-8 text-gray-800">
          <p className="break-words">
            Read{" "}
            <a
              href={CLAWLINK_SKILL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[var(--brand-hover)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
            >
              {CLAWLINK_SKILL_URL}
            </a>
            .
          </p>
          <p className="mt-1 break-words">
            Follow the instructions to use ClawLink for third-party integrations.
          </p>
        </div>
      </div>

      <ol className="mt-8 space-y-4 text-[15px] leading-7 text-gray-700">
        <Step num={1}>Send this prompt to your agent.</Step>
        <Step num={2}>
          The agent reads <span className="font-mono text-gray-900">skill.md</span> and discovers ClawLink&apos;s live tool catalog.
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
    <li className="flex items-start gap-3">
      <span className="shrink-0 text-base font-bold text-[var(--brand)]">{num}.</span>
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
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[var(--brand)]/40 hover:text-[var(--brand-hover)]"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}
