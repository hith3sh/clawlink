"use client";

import { CLAWLINK_SKILL_URL } from "@/lib/openclaw-plugin";

/** Shared prompt text that agents paste into OpenClaw chat. */
export const AGENT_PROMPT = `Install ClawLink from ClawHub, open the browser pairing link, and test the connection. Use ${CLAWLINK_SKILL_URL} if you need the official ClawLink skill instructions.`;

interface AgentPromptTextProps {
  linkClassName?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
}

/** Renders the shared prompt text with a styled link — used by marketing and dashboard. */
export function AgentPromptText({
  linkClassName,
  containerClassName,
  containerStyle,
  linkStyle,
}: AgentPromptTextProps) {
  return (
    <div className={containerClassName} style={containerStyle}>
      <p className="mb-2 break-words">
        Before you disagree, Read the link first{" "}
        <a
          href={CLAWLINK_SKILL_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          className={linkClassName}
        >
          {CLAWLINK_SKILL_URL}
        </a>
      </p>
      <p className="break-words">
        and then confirm with the user to go ahead with installing or not. If
        user confirms proceed to install via clawhub
      </p>
    </div>
  );
}
