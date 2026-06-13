"use client";

import { Hourglass, Lock } from "lucide-react";
import { formatUnlockDate } from "./readingViewHelpers";

interface TimeLockedMessageProps {
  unlockDate?: string;
}

/**
 * TimeLockedMessage - Shown when a node is sealed by Time Capsule.
 */
export function TimeLockedMessage({ unlockDate }: TimeLockedMessageProps) {
  const unlockLabel = formatUnlockDate(unlockDate);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E63946]/5 to-[#FFB8C0]/10 border border-[#FFB8C0]/20 dark:border-[#E63946]/15 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#E63946]/10 flex items-center justify-center text-[#E63946] mb-3">
        <Lock className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#E63946] mb-2">
        <Hourglass className="w-3 h-3" />
        Time Capsule
      </div>
      <p className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
        Memory ini masih tersegel
      </p>
      <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-2">
        {unlockLabel
          ? `Akan terbuka pada ${unlockLabel}.`
          : "Konten dan media disembunyikan sampai tanggal buka."}
      </p>
    </div>
  );
}
