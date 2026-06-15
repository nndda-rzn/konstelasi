"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MOOD_COLORS } from "./moodTheme";

interface EmotionalArcChartProps {
  chartData: any[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-[#2a2438] border border-[#FFB8C0]/20 dark:border-[#E63946]/10 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
        {d.name}
      </p>
      <p className="text-[10px] capitalize" style={{ color: d.fill }}>
        {d.mood}
      </p>
      <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
        Score: {d.score}
      </p>
    </div>
  );
}

/**
 * EmotionalArcChart - Recharts area chart of the emotional
 * journey from -1 (low) to +1 (high).
 */
export function EmotionalArcChart({ chartData }: EmotionalArcChartProps) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-3">
        Emotional Journey
      </h4>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
          >
            <defs>
              <linearGradient
                id="emotionalGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#FF6B8B" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#7C83FD" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#4DABF7" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#5A3E4C80" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[-1, 1]}
              tick={{ fontSize: 9, fill: "#5A3E4C80" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#5A3E4C20" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#FF6B8B"
              fill="url(#emotionalGradient)"
              strokeWidth={2}
              dot={{ r: 3, fill: "#FF6B8B" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 mt-1 px-1">
        <span>Awal cerita</span>
        <span>Akhir cerita</span>
      </div>
    </div>
  );
}

export function buildChartData(arc: any) {
  return (
    arc?.dataPoints?.map((dp: any) => ({
      name: dp.title?.slice(0, 12) || `#${dp.index + 1}`,
      score: dp.score,
      mood: dp.mood,
      fill: MOOD_COLORS[dp.mood] || "#94a3b8",
    })) ?? []
  );
}
