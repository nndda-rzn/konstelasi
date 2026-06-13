"use client";

import { Sparkles } from "lucide-react";

/**
 * CanvasToolbarBrand - Logo + name (left section).
 */
export function CanvasToolbarBrand() {
  return (
    <div className="flex items-center gap-2 pr-3 border-r border-[#FFB4A2]/20">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-md shadow-pink-300/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <h1 className="text-base font-bold bg-gradient-to-r from-[#FF8FA3] via-[#FFB4A2] to-[#FFD6A5] bg-clip-text text-transparent tracking-tight hidden sm:block">
        Konstelasi
      </h1>
    </div>
  );
}
