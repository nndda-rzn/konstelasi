"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * StickyBottomBar - Lightweight classy CTA bar for layout/format steps.
 * Thinner, more refined, with selected summary.
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
          "linear-gradient(180deg, rgba(255, 245, 247, 0) 0%, rgba(255, 245, 247, 0.85) 35%, rgba(255, 245, 247, 0.95) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-5 py-4 sm:px-7">
        {/* Back link */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 text-[11.5px] font-medium tracking-wide text-[#8C7783] transition-colors hover:text-[#3F2A35]"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </button>

        {/* Selected summary (middle) */}
        {summary && (
          <div className="ml-4 hidden items-center gap-2 sm:flex">
            <div
              className="h-3 w-px"
              style={{ background: "rgba(212, 165, 116, 0.3)" }}
            />
            {summary}
          </div>
        )}

        <div className="ml-auto flex items-center gap-4">
          {hint && (
            <span className="hidden text-[11px] text-[#8C7783] sm:inline">
              {hint}
            </span>
          )}
          <motion.button
            onClick={onNext}
            disabled={nextDisabled}
            whileHover={!nextDisabled ? { y: -1 } : undefined}
            whileTap={!nextDisabled ? { y: 0, scale: 0.98 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 text-[12.5px] font-semibold tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: nextDisabled
                ? "rgba(212, 165, 116, 0.25)"
                : "linear-gradient(135deg, #E63946 0%, #C52836 100%)",
              color: nextDisabled ? "#B89A8A" : "white",
              boxShadow: nextDisabled
                ? "none"
                : "0 4px 16px rgba(230, 57, 70, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
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
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
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
