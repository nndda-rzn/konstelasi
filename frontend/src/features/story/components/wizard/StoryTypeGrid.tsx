"use client";

import { StoryTypeOption } from "./wizardTypes";
import { Layers } from "lucide-react";
import { getTemplateFor } from "@/features/story/templates";

interface StoryTypeGridProps {
  types: StoryTypeOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function StoryTypeGrid({
  types,
  selected,
  onSelect,
}: StoryTypeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.value;
        const template = getTemplateFor(type.value);
        return (
          <button
            key={type.value}
            onClick={() => onSelect(type.value)}
            aria-pressed={isSelected}
            className={`relative p-3.5 rounded-xl border text-left transition-all ${
              isSelected
                ? "border-[#E63946] bg-[#E63946]/5 shadow-sm"
                : "border-[#FFB8C0]/15 hover:border-[#E63946]/30"
            }`}
          >
            <Icon
              className="w-5 h-5 mb-2"
              style={{ color: type.color }}
            />
            <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
              {type.label}
            </p>
            <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mt-0.5">
              {type.desc}
            </p>
            {template && (
              <span
                className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#E63946]/10 text-[#E63946] text-[9px] font-semibold tabular-nums"
                title={`Auto-generate ${template.nodes.length} starter scenes`}
              >
                <Layers className="w-2.5 h-2.5" />+{template.nodes.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
