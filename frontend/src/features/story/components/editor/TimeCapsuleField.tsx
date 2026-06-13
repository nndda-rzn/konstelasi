"use client";

import { Hourglass } from "lucide-react";
import { formatUnlockDate } from "./dateHelpers";

interface TimeCapsuleFieldProps {
  unlockDate: string;
  isTimeLocked: boolean;
  onChange: (value: string) => void;
}

/**
 * TimeCapsuleField - Unlock-date input with "open now" action.
 * Shows sealed indicator when locked in the future.
 */
export function TimeCapsuleField({
  unlockDate,
  isTimeLocked,
  onChange,
}: TimeCapsuleFieldProps) {
  const unlockLabel = unlockDate ? formatUnlockDate(unlockDate) : "";

  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-[#E63946]/5 to-[#FFB8C0]/10 border border-[#FFB8C0]/20 dark:border-[#E63946]/15">
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isTimeLocked
              ? "bg-[#E63946]/10 text-[#E63946]"
              : "bg-[#FFB8C0]/15 text-[#5A3E4C]/40"
          }`}
        >
          <Hourglass className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-1.5">
            Time Capsule
          </label>
          <input
            type="datetime-local"
            value={unlockDate}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-[#1a1625]/50 border border-[#FFB8C0]/20 dark:border-[#E63946]/15 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] outline-none focus:border-[#E63946]/40"
          />
          <div className="flex items-center justify-between gap-2 mt-2">
            <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">
              {isTimeLocked
                ? `Disegel sampai ${unlockLabel}`
                : "Kosongkan tanggal untuk membuat memory tetap terbuka."}
            </p>
            {unlockDate && (
              <button
                onClick={() => onChange("")}
                className="text-[10px] font-medium text-[#E63946]/70 hover:text-[#E63946] transition-colors"
              >
                Buka sekarang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
