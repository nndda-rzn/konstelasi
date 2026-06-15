import type { Analytics } from "./useAnalytics";

interface TopTagsProps {
  analytics: Analytics;
}

/**
 * TopTags - Pill cloud of the 5 most-used tags.
 */
export function TopTags({ analytics }: TopTagsProps) {
  if (analytics.tagEntries.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">
        Top Tags
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {analytics.tagEntries.map(([name, count]) => (
          <span
            key={name}
            className="px-2 py-1 rounded-full bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10 text-[10px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3]"
          >
            {name} ({count})
          </span>
        ))}
      </div>
    </div>
  );
}
