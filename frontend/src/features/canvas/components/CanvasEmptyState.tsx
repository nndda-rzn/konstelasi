"use client";

import { Sparkles } from "lucide-react";

interface Props {
  onCreate: () => void;
}

/**
 * Friendly empty state shown when the canvas has no notes yet.
 * Encourages the user to create their first note via FAB or shortcut.
 */
export default function CanvasEmptyState({ onCreate }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="flex flex-col items-center gap-5 px-6 text-center pointer-events-auto max-w-md">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FFB4A2]/20 blur-2xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-lg shadow-pink-300/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#4A2F3C]">
            Mulai konstelasi pertamamu
          </h2>
          <p className="text-sm text-[#5A3E4C]/60 leading-relaxed">
            Tulis pikiran, kenangan, atau ide. Hubungkan satu sama lain untuk
            membentuk jaringan cerita pribadimu.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white text-sm font-medium shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/60 focus:ring-offset-2 focus:ring-offset-[#FFFAF7]"
        >
          Buat catatan pertama
        </button>

        <p className="text-xs text-[#5A3E4C]/40">
          atau tekan{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-[#FFB4A2]/15 text-[#5A3E4C]/70 font-mono">
            N
          </kbd>{" "}
          untuk membuat dengan keyboard
        </p>
      </div>
    </div>
  );
}
