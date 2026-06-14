"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * StickyBottomBar - Minimal classy continuation bar.
 * Thinner, lighter, with elegant selected summary.
 */
export function StickyBottomBar({
  onBack,
  backLabel,
  nextLabel,
  onNext,
  nextDisabled,
  hint,
  summary,
}: {
  onBack: () => void;
  backLabel: string;
  nextLabel: string;
  onNext: () => void;
  nextDisabled: boolean;
  hint?: string;
  summary?: React.ReactNode;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 md:pl-[260px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 245, 247, 0) 0%, rgba(255, 245, 247, 0.8) 30%, rgba(255, 245, 247, 0.95) 100%)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-5 py-3.5 sm:px-7">
        {/* Back link - very subtle */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 text-[11.5px] font-normal tracking-wide text-[#8C7783] transition-colors hover:text-[#3F2A35]"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </button>

        {/* Selected summary (middle) */}
        {summary && (
          <div className="ml-4 hidden items-center gap-2.5 sm:flex">
            <svg
              width="6"
              height="6"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
              className="opacity-60"
            >
              <path
                d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                fill="#D4A574"
              />
            </svg>
            {summary}
          </div>
        )}

        <div className="ml-auto flex items-center gap-4">
          {hint && (
            <span className="hidden text-[11px] italic text-[#9D7B8A] sm:inline">
              {hint}
            </span>
          )}
          <motion.button
            onClick={onNext}
            disabled={nextDisabled}
            whileHover={!nextDisabled ? { y: -1 } : undefined}
            whileTap={!nextDisabled ? { y: 0, scale: 0.98 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 text-[12px] font-medium tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              background: nextDisabled
                ? "rgba(212, 165, 116, 0.2)"
                : "linear-gradient(135deg, #E63946 0%, #C52836 100%)",
              color: nextDisabled ? "#B89A8A" : "white",
              boxShadow: nextDisabled
                ? "none"
                : "0 4px 18px rgba(230, 57, 70, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {nextLabel}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            {!nextDisabled && (
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                }}
                aria-hidden
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
