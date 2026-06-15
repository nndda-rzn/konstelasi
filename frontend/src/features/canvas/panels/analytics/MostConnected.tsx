import { Link2 } from "lucide-react";
import type { Analytics } from "./useAnalytics";

interface MostConnectedProps {
  analytics: Analytics;
}

/**
 * MostConnected - Top 5 notes with the most edges (in + out).
 */
export function MostConnected({ analytics }: MostConnectedProps) {
  const connected = analytics.connectionCounts.filter((n) => n.connections > 0);
  if (connected.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">
        Catatan Paling Terhubung
      </h4>
      <div className="space-y-1.5">
        {connected.map((n) => (
          <div key={n.id} className="flex items-center gap-2 text-xs">
            <Link2 className="w-3 h-3 text-[#FF8FA3]" />
            <span className="text-[#4A2F3C] dark:text-[#e2d9f3] truncate flex-1">
              {n.title}
            </span>
            <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
              {n.connections} koneksi
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
