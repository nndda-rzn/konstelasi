import type { Analytics } from "./useAnalytics";

interface OverviewStatsProps {
  analytics: Analytics;
}

/**
 * OverviewStats - 3-cell stat grid (notes count, total words, average).
 */
export function OverviewStats({ analytics }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="p-3 rounded-xl bg-[#FF8FA3]/5 dark:bg-[#FF8FA3]/10 text-center">
        <p className="text-lg font-bold text-[#FF8FA3]">{analytics.totalNotes}</p>
        <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Catatan</p>
      </div>
      <div className="p-3 rounded-xl bg-[#B5EAD7]/20 dark:bg-[#B5EAD7]/10 text-center">
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {analytics.totalWords.toLocaleString()}
        </p>
        <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Total Kata</p>
      </div>
      <div className="p-3 rounded-xl bg-[#C7CEEA]/20 dark:bg-[#C7CEEA]/10 text-center">
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {analytics.avgWords}
        </p>
        <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Rata-rata</p>
      </div>
    </div>
  );
}
