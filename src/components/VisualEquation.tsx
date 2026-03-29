"use client";

import {
  SiGmail, SiSlack, SiStripe, SiGithub, SiNotion, SiShopify,
} from "react-icons/si";
import Image from "next/image";

const icons = [
  { Icon: SiGmail, color: "#EA4335" },
  { Icon: SiSlack, color: "#4A154B" },
  { Icon: SiStripe, color: "#635BFF" },
  { Icon: SiGithub, color: "#181717" },
  { Icon: SiNotion, color: "#000000" },
  { Icon: SiShopify, color: "#7AB55C" },
];

export default function VisualEquation() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {/* OpenClaw */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <Image src="/openclaw-lobster.svg" alt="OpenClaw" width={24} height={24} />
        <span className="font-semibold text-gray-900">OpenClaw</span>
      </div>

      <span className="text-2xl font-light text-gray-300">+</span>

      {/* ClawLink */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">CL</span>
        <span className="font-semibold text-gray-900">ClawLink</span>
      </div>

      <span className="text-2xl font-light text-gray-300">=</span>

      {/* Integration icons */}
      <div className="flex items-center gap-1">
        {icons.map(({ Icon, color }, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-100 bg-white shadow-sm"
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        ))}
        <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 text-xs font-medium text-gray-400">
          +40
        </div>
      </div>
    </div>
  );
}
