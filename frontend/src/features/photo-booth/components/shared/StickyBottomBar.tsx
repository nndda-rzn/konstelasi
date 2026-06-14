"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * StickyBottomBar - Shared sticky CTA bar for layout/format steps.
 */
export function StickyBottomBar({
  onBack,
  backLabel,
  nextLabel,
  onNext,
  nextDisabled,
  hint,
}: {
  onBack: () => void;
  backLabel: string;
  nextLabel: string;
  onNext: () => void;
  nextDisabled: boolean;
  hint?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.06] bg-white/85 backdrop-blur-md md:pl-[260px]">
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </button>
        <div className="ml-auto flex items-center gap-3">
          {hint && (
            <span className="hidden text-[11px] text-[#8C7783] sm:inline">
              {hint}
            </span>
          )}
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E63946] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
