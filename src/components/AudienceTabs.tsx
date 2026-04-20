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
  const [audience, setAudience] = useState<Audience>("agent");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-center gap-3">
        <TabButton
          active={audience === "human"}
          onClick={() => setAudience("human")}
          icon={<User className="h-4 w-4" aria-hidden />}
          label="I'm a Human"
        />
        <TabButton
          active={audience === "agent"}
          onClick={() => setAudience("agent")}
          icon={<Bot className="h-4 w-4" aria-hidden />}
          label="I'm an Agent"
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
          ? "inline-flex items-center gap-2 rounded-full bg-[#e8915a] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(232,145,90,0.3)] transition"
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
      <div className="space-y-4 text-[15px] leading-[1.9] text-gray-700">
        <p>
          ClawLink setup for OpenClaw — third-party plugin, not affiliated with OpenClaw. Verify the package at{" "}
          <a
            href={CLAWLINK_NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-gray-900 underline"
          >
            {OPENCLAW_PLUGIN_PACKAGE}
          </a>{" "}
          or{" "}
          <a
            href={CLAWLINK_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline"
          >
            github.com/hith3sh/clawlink
          </a>
          . Releases are published with an npm provenance attestation in the public Sigstore transparency log — see{" "}
          <a
            href={CLAWLINK_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline"
          >
            claw-link.dev/verify
          </a>
          .
        </p>
        <p>
          <span className="font-semibold text-gray-900">Step 1</span> — install the plugin:{" "}
          <span className="font-mono text-gray-900">{OPENCLAW_PLUGIN_INSTALL_COMMAND}</span>.
        </p>
        <p>
          <span className="font-semibold text-gray-900">Step 2</span> — create an API key at{" "}
          <a
            href={CLAWLINK_API_SETTINGS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-gray-900 underline"
          >
            claw-link.dev/dashboard/settings?tab=api
          </a>
          .
        </p>
        <p>
          <span className="font-semibold text-gray-900">Step 3</span> — paste the{" "}
          <span className="font-mono text-gray-900">/clawlink login &lt;key&gt;</span> command from the dashboard into your OpenClaw chat as a standalone message. OpenClaw&apos;s gateway routes slash commands directly to the ClawLink plugin handler (fast path bypasses the model), so the AI never sees the key. It&apos;s stored locally in{" "}
          <span className="font-mono text-gray-900">~/.openclaw/openclaw.json</span> and only sent to{" "}
          <span className="font-mono text-gray-900">claw-link.dev</span>. Docs:{" "}
          <a
            href={CLAWLINK_OPENCLAW_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline"
          >
            docs.claw-link.dev/openclaw
          </a>
          .
        </p>
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
        <pre className="overflow-x-auto px-5 py-6 text-[15px] leading-8 text-gray-800">
          <code>
            Read{" "}
            <a
              href={CLAWLINK_SKILL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#d4764a] underline decoration-[#e8915a]/40 underline-offset-4 hover:decoration-[#e8915a]"
            >
              {CLAWLINK_SKILL_URL}
            </a>{" "}
            and follow the instructions to use ClawLink for third-party integrations.
          </code>
        </pre>
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
      <span className="shrink-0 text-base font-bold text-[#e8915a]">{num}.</span>
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
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[#e8915a]/40 hover:text-[#d4764a]"
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
