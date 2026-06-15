import type { Analytics } from "./useAnalytics";

interface Last30DaysChartProps {
  analytics: Analytics;
}

/**
 * Last30DaysChart - Vertical bar chart of note creation over the
 * last 30 days.
 */
export function Last30DaysChart({ analytics }: Last30DaysChartProps) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">
        Aktivitas 30 Hari Terakhir
      </h4>
      <div className="flex items-end gap-[2px] h-12">
        {analytics.last30.map((count, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-[#FF8FA3] transition-all"
            style={{
              height: `${Math.max((count / analytics.maxLast30) * 100, 4)}%`,
              opacity: count > 0 ? 0.3 + (count / analytics.maxLast30) * 0.7 : 0.1,
            }}
            title={`${count} catatan`}
          />
        ))}
      </div>
    </div>
  );
}
