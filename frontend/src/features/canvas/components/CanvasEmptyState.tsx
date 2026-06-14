"use client";

import { BrandMark } from "@/features/auth/components/BrandMark";

interface Props {
  onCreate: () => void;
}

/**
 * Editorial empty state for the canvas. Shown when there are no notes.
 * Anchored by a small Constella mark instead of a generic icon.
 */
export default function CanvasEmptyState({ onCreate }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="flex flex-col items-center gap-5 px-6 text-center pointer-events-auto max-w-[420px]">
        <div className="text-[#9A8F95]/70">
          <BrandMark size={44} bare />
        </div>

        <div className="space-y-2">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#2F2730]">
            Begin with one quiet note.
          </h2>
          <p className="text-[14px] text-[#6F626A] leading-[1.65]">
            Every constellation starts with a single thought. Add your first
            note and let the story grow.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="mt-1 px-5 py-2.5 rounded-[14px] bg-[#B84A5A] hover:bg-[#A94352] text-white text-[13px] font-semibold tracking-[-0.005em] shadow-[0_2px_12px_rgba(184,74,90,0.18)] transition-all hover:-translate-y-px active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#B84A5A]/30 focus:ring-offset-2 focus:ring-offset-[#F7F1EA]"
        >
          Write first note
        </button>

        <p className="text-[12px] text-[#9A8F95] flex items-center gap-1.5">
          <span>or press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#F3ECE4] border border-[rgba(47,39,48,0.08)] text-[#6F626A] text-[11px] font-mono">
            N
          </kbd>
          <span>to add a note</span>
        </p>
      </div>
    </div>
  );
}
