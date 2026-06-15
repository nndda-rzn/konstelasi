import type { Analytics } from "./useAnalytics";

interface DayOfWeekChartProps {
  analytics: Analytics;
}

/**
 * DayOfWeekChart - Bar chart of note creation by day of week.
 */
export function DayOfWeekChart({ analytics }: DayOfWeekChartProps) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">
        Aktivitas per Hari
      </h4>
      <div className="flex items-end gap-2 h-16">
        {analytics.dayActivity.map((count, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md bg-[#FFB4A2] dark:bg-[#FF8FA3] transition-all"
              style={{
                height: `${
                  analytics.maxDayActivity > 0
                    ? Math.max((count / analytics.maxDayActivity) * 48, 2)
                    : 2
                }px`,
              }}
            />
            <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
              {analytics.dayNames[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
