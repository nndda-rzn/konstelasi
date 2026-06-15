"use client";

import { LogOut, Sparkles } from "lucide-react";

interface DiaryListHeaderProps {
  onLogout: () => void;
}

/**
 * DiaryListHeader - Fixed top bar with brand mark and logout.
 */
export function DiaryListHeader({ onLogout }: DiaryListHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#FFFAF7]/80 backdrop-blur-2xl border-b border-[#FFB4A2]/15 z-10 flex items-center justify-between px-5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-lg shadow-pink-300/30">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] via-[#FFB4A2] to-[#FFD6A5] bg-clip-text text-transparent">
          Konstelasi
        </h1>
      </div>
      <button
        onClick={onLogout}
        className="text-[#5A3E4C]/30 hover:text-[#FF8FA3] transition-colors p-2 rounded-lg hover:bg-[#FFB4A2]/10"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
