"use client";

import { PrivacyOption } from "./wizardTypes";

interface PrivacyGridProps {
  options: PrivacyOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function PrivacyGrid({
  options,
  selected,
  onSelect,
}: PrivacyGridProps) {
  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            aria-pressed={isSelected}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              isSelected
                ? "border-[#E63946] bg-[#E63946]/5"
                : "border-[#FFB8C0]/15 hover:border-[#E63946]/30"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isSelected ? "text-[#E63946]" : "text-[#5A3E4C]/40"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
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
  );
}
