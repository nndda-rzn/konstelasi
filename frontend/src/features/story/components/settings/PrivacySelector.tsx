"use client";

import { PRIVACY_OPTIONS } from "./settingsConstants";

interface PrivacySelectorProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * PrivacySelector - Visual selector for story privacy level.
 */
export function PrivacySelector({ value, onChange }: PrivacySelectorProps) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">
        Privasi
      </label>
      <div className="space-y-2">
        {PRIVACY_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                value === opt.value
                  ? "border-[#E63946] bg-[#E63946]/5"
                  : "border-[#FFB8C0]/15 hover:border-[#E63946]/20"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  value === opt.value ? "text-[#E63946]" : "text-[#5A3E4C]/30"
                }`}
              />
              <div>
                <p className="text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
                  {opt.label}
                </p>
                <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
