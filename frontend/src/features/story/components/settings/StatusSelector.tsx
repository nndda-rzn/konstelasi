"use client";

import { STATUS_OPTIONS } from "./settingsConstants";

interface StatusSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * StatusSelector - Pill buttons for story status (Draft/Published/Archived).
 */
export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">
        Status
      </label>
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === opt.value
                ? "bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/30"
                : "border border-[#FFB8C0]/15 text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 hover:border-[#E63946]/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
