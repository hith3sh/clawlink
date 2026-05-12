"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const WORDS = ["Gmail", "Calendar", "Drive", "Notion", "Instagram", "LinkedIn", "Shopify", "Outlook"];
const CYCLE_MS = 2200;

export function AnimatedWords() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % WORDS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      {/* Text cycling — clipped so words slide in/out cleanly */}
      <span
        className="inline-grid overflow-hidden align-baseline"
        style={{
          gridTemplate: "1fr / max-content",
          verticalAlign: "baseline",
        }}
      >
        {/* Hidden width/height placeholder so the container never reflows */}
        <span
          aria-hidden
          className="pointer-events-none select-none"
          style={{ gridArea: "1 / 1", visibility: "hidden" }}
        >
          {WORDS.reduce((a, b) => (a.length > b.length ? a : b))}
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ y: "0.55em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-0.55em", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              gridArea: "1 / 1",
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            {WORDS[idx]}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Static underline — lives outside the overflow-hidden box */}
      <svg
        className="absolute -bottom-5 left-0 w-[110%] scale-75 md:scale-100"
        style={{ left: "-5%" }}
        viewBox="0 0 316 22"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.69629 10.8072C42.2956 6.45591 159.803 -0.941218 313.039 4.28028"
          stroke="#618DFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M64.0977 19.9226C92.9668 16.8146 178.634 11.5309 290.347 15.2606"
          stroke="#618DFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
