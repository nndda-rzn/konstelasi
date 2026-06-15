"use client";

import { TREND_CONFIG } from "./moodTheme";

interface EmotionalArcOverviewProps {
  arc: any;
}

/**
 * EmotionalArcOverview - 3-cell overview: overall mood,
 * emotional range, trend.
 */
export function EmotionalArcOverview({ arc }: EmotionalArcOverviewProps) {
  const trendInfo = TREND_CONFIG[arc?.trend] || TREND_CONFIG.stable;
  const TrendIcon = trendInfo.icon;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2.5 rounded-xl bg-[#FF6B8B]/5 text-center">
        <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Overall</p>
        <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] capitalize mt-0.5">
          {arc.overallMood}
        </p>
      </div>
      <div className="p-2.5 rounded-xl bg-[#7C83FD]/5 text-center">
        <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Range</p>
        <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mt-0.5">
          {arc.emotionalRange}
        </p>
      </div>
      <div
        className="p-2.5 rounded-xl text-center"
        style={{ backgroundColor: `${trendInfo.color}10` }}
      >
        <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Trend</p>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <TrendIcon className="w-3 h-3" style={{ color: trendInfo.color }} />
          <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">
            {trendInfo.label}
          </p>
        </div>
      </div>
    </div>
  );
}
