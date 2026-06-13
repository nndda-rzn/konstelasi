"use client";

import { EMOTIONS } from "./editorConstants";

interface EmotionPickerProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * EmotionPicker - Color-coded emotion selector.
 * Tapping the current emotion deselects it.
 */
export function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
        Emosi
      </label>
      <div className="flex flex-wrap gap-1.5">
        {EMOTIONS.map((em) => {
          const isSelected = value === em.value;
          return (
            <button
              key={em.value}
              onClick={() => onChange(isSelected ? "" : em.value)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                isSelected
                  ? "ring-1 ring-offset-1 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: `${em.color}25`,
                color: em.color,
              }}
            >
              {em.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
