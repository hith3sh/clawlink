"use client";

import Image from "next/image";
import { getBrandLogoSrc } from "@/lib/brand-logos";

const iconSlugs = ["gmail", "slack", "stripe", "github", "notion", "shopify"];

export default function VisualEquation() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {/* OpenClaw */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-5 py-3.5 shadow-sm">
        <Image src="/openclaw-lobster.svg" alt="OpenClaw" width={24} height={24} />
        <span className="font-semibold text-gray-900">OpenClaw</span>
      </div>

      <span className="text-2xl font-light text-gray-300">+</span>

      {/* ClawLink */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-amber-200/60 bg-amber-50/50 backdrop-blur-sm px-5 py-3.5 shadow-sm">
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">CL</span>
        <span className="font-semibold text-gray-900">ClawLink</span>
      </div>

      <span className="text-2xl font-light text-gray-300">=</span>

      {/* Integration icons */}
      <div className="flex items-center gap-1">
        {iconSlugs.map((slug) => (
          <div
            key={slug}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getBrandLogoSrc(slug, "light")}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 object-contain"
            />
          </div>
        ))}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
          +40
        </div>
      </div>
    </div>
  );
}
