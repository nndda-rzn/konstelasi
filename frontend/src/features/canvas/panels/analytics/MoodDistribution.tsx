import type { Analytics } from "./useAnalytics";
import { MOOD_COLORS } from "./useAnalytics";

interface MoodDistributionProps {
  analytics: Analytics;
  totalNotes: number;
}

/**
 * MoodDistribution - Stacked bar list of mood frequencies.
 */
export function MoodDistribution({ analytics, totalNotes }: MoodDistributionProps) {
  if (analytics.moodEntries.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">
        Distribusi Mood
      </h4>
      <div className="space-y-1.5">
        {analytics.moodEntries.map(([mood, count]) => (
          <div key={mood} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: MOOD_COLORS[mood] || "#D4D4D4" }}
            />
            <span className="text-xs text-[#4A2F3C] dark:text-[#e2d9f3] capitalize flex-1">
              {mood}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(count / totalNotes) * 100}%`,
                  backgroundColor: MOOD_COLORS[mood] || "#D4D4D4",
                }}
              />
            </div>
            <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-6 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
