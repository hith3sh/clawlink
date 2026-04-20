"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const TOOLS = [
  { name: "Notion", icon: "/icons/notion.svg" },
  { name: "Outlook", icon: "/icons/outlook.svg" },
  { name: "Google Calendar", icon: "/icons/google-calendar.svg" },
  { name: "Gmail", icon: "/icons/gmail.svg" },
  { name: "Slack", icon: "/icons/slack.svg" },
];

const VIEWBOX = { w: 900, h: 500 };

const OPENCLAW = { x: 110, y: 250, size: 90, rx: 18 };
const CLAWLINK = { x: 360, y: 250, size: 80, rx: 16 };
const TOOL = { size: 70, rx: 14 };

const toolYPositions = [65, 155, 250, 345, 435];
const toolX = 720;

function arrowPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
) {
  const dx = toX - fromX;
  const cp1x = fromX + dx * 0.4;
  const cp2x = fromX + dx * 0.65;
  return `M ${fromX} ${fromY} C ${cp1x} ${fromY}, ${cp2x} ${toY}, ${toX} ${toY}`;
}

const openClawToClawLink = arrowPath(
  OPENCLAW.x + OPENCLAW.size / 2 + 4,
  OPENCLAW.y,
  CLAWLINK.x - CLAWLINK.size / 2 - 4,
  CLAWLINK.y,
);

const clawlinkToTools = TOOLS.map((_, i) =>
  arrowPath(
    CLAWLINK.x + CLAWLINK.size / 2 + 4,
    CLAWLINK.y + (i - 2) * 5,
    toolX - TOOL.size / 2 - 4,
    toolYPositions[i],
  ),
);

const allArrows = [openClawToClawLink, ...clawlinkToTools];

function GlowArrow({
  d,
  index,
  isInView,
}: {
  d: string;
  index: number;
  isInView: boolean;
}) {
  const cycleDuration = 1.4;
  const stagger = 0.45;
  const pauseAfterCycle = allArrows.length * stagger + 1.5;

  return (
    <>
      {/* Base path — always visible */}
      <path d={d} stroke="#E5E7EB" strokeWidth={1.5} fill="none" />
      {/* Glow path — animated */}
      <motion.path
        d={d}
        stroke="url(#glowGradient)"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        filter="url(#arrowGlow)"
        initial={{ opacity: 0 }}
        animate={
          isInView
            ? {
                opacity: [0, 0.9, 0.9, 0],
              }
            : { opacity: 0 }
        }
        transition={
          isInView
            ? {
                duration: cycleDuration,
                delay: index * stagger,
                repeat: Infinity,
                repeatDelay: pauseAfterCycle,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              }
            : {}
        }
      />
    </>
  );
}

export default function FlowDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <div ref={ref} className="mx-auto w-full max-w-[900px]">
      <svg
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8453C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <filter id="arrowGlow" filterUnits="userSpaceOnUse" x="0" y="0" width="900" height="500">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Arrows */}
        {allArrows.map((d, i) => (
          <GlowArrow key={i} d={d} index={i} isInView={isInView} />
        ))}

        {/* Arrowheads */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#D1D5DB" />
          </marker>
        </defs>
        {/* Base arrow paths get arrowheads */}
        {allArrows.map((d, i) => (
          <path
            key={`head-${i}`}
            d={d}
            stroke="transparent"
            strokeWidth={1.5}
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        ))}

        {/* OpenClaw node */}
        <g>
          <rect
            x={OPENCLAW.x - OPENCLAW.size / 2}
            y={OPENCLAW.y - OPENCLAW.size / 2}
            width={OPENCLAW.size}
            height={OPENCLAW.size}
            rx={OPENCLAW.rx}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth={1.5}
          />
          <image
            href="/brand/bento/openclaw.png"
            x={OPENCLAW.x - OPENCLAW.size / 2 + 10}
            y={OPENCLAW.y - OPENCLAW.size / 2 + 10}
            width={OPENCLAW.size - 20}
            height={OPENCLAW.size - 20}
          />
          <text
            x={OPENCLAW.x}
            y={OPENCLAW.y + OPENCLAW.size / 2 + 18}
            textAnchor="middle"
            fill="#6B7280"
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            OpenClaw
          </text>
        </g>

        {/* ClawLink node */}
        <g>
          <rect
            x={CLAWLINK.x - CLAWLINK.size / 2}
            y={CLAWLINK.y - CLAWLINK.size / 2}
            width={CLAWLINK.size}
            height={CLAWLINK.size}
            rx={CLAWLINK.rx}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth={1.5}
          />
          <image
            href="/brand/bento/clawlink-square-v2.png"
            x={CLAWLINK.x - CLAWLINK.size / 2 + 8}
            y={CLAWLINK.y - CLAWLINK.size / 2 + 8}
            width={CLAWLINK.size - 16}
            height={CLAWLINK.size - 16}
          />
          <text
            x={CLAWLINK.x}
            y={CLAWLINK.y + CLAWLINK.size / 2 + 18}
            textAnchor="middle"
            fill="#6B7280"
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            ClawLink
          </text>
        </g>

        {/* Tool nodes */}
        {TOOLS.map((tool, i) => (
          <g key={tool.name}>
            <rect
              x={toolX - TOOL.size / 2}
              y={toolYPositions[i] - TOOL.size / 2}
              width={TOOL.size}
              height={TOOL.size}
              rx={TOOL.rx}
              fill="white"
              stroke="#E5E7EB"
              strokeWidth={1.5}
            />
            <image
              href={tool.icon}
              x={toolX - TOOL.size / 2 + 12}
              y={toolYPositions[i] - TOOL.size / 2 + 12}
              width={TOOL.size - 24}
              height={TOOL.size - 24}
            />
            <text
              x={toolX}
              y={toolYPositions[i] + TOOL.size / 2 + 16}
              textAnchor="middle"
              fill="#6B7280"
              fontSize={11}
              fontFamily="system-ui, sans-serif"
            >
              {tool.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
