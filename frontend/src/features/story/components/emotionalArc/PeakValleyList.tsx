"use client";

import { Sun, Zap } from "lucide-react";
import { MOOD_COLORS } from "./moodTheme";

interface PeakValleyListProps {
  items: any[];
  variant: "peak" | "valley";
}

/**
 * PeakValleyList - The list of emotional peaks (high) or
 * valleys (low) for a given story's arc.
 */
export function PeakValleyList({ items, variant }: PeakValleyListProps) {
  if (items.length === 0) return null;
  const isPeak = variant === "peak";
  const Icon = isPeak ? Sun : Zap;
  const accent = isPeak ? "#FF922B" : "#4DABF7";
  const bgClass = isPeak ? "bg-[#FF922B]/5" : "bg-[#4DABF7]/5";
  const label = isPeak ? "Emotional Peaks" : "Emotional Valleys";

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2 flex items-center gap-1">
        <Icon className="w-3 h-3" style={{ color: accent }} /> {label}
      </h4>
      <div className="space-y-1.5">
        {items.map((p) => (
          <div
            key={p.nodeId}
            className={`flex items-center gap-2 p-2 rounded-lg ${bgClass}`}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: MOOD_COLORS[p.mood] || "#94a3b8" }}
            />
            <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] flex-1 truncate">
              {p.title}
            </span>
            <span
              className="text-[9px] capitalize px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-white/10"
              style={{ color: MOOD_COLORS[p.mood] }}
            >
              {p.mood}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
