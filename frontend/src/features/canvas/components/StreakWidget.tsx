'use client';

import { Flame, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_WRITING_STREAK } from '@/graphql/queries';

export default function StreakWidget() {
  const { data, loading } = useQuery<any>(GET_WRITING_STREAK, {
    fetchPolicy: 'cache-and-network',
  });

  const streak = data?.getWritingStreak;

  if (loading || !streak) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Current Streak Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#FFFCF8]/70 border border-[rgba(47,39,48,0.06)] backdrop-blur-md">
        <Flame
          className={`w-4 h-4 ${
            streak.currentStreak > 0 ? "text-[#C99A45]" : "text-[#9A8F95]/50"
          }`}
          strokeWidth={1.6}
        />
        <span
          className={`text-[13px] font-semibold ${
            streak.currentStreak > 0 ? "text-[#2F2730]" : "text-[#9A8F95]"
          }`}
        >
          {streak.currentStreak}
        </span>
        <span className="text-[11px] text-[#9A8F95]">
          {streak.currentStreak === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}

export function StreakPanel({ onClose }: { onClose: () => void }) {
  const { data, loading } = useQuery<any>(GET_WRITING_STREAK, {
    fetchPolicy: 'cache-and-network',
  });

  const streak = data?.getWritingStreak;

  if (loading) return null;

  const stats = [
    {
      icon: Flame,
      label: "Current streak",
      value: streak?.currentStreak || 0,
      suffix: "days",
      color: "text-[#C99A45]",
      bg: "bg-[#FAF3E0]",
    },
    {
      icon: Trophy,
      label: "Longest streak",
      value: streak?.longestStreak || 0,
      suffix: "days",
      color: "text-[#9A8F95]",
      bg: "bg-[#F3ECE4]",
    },
    {
      icon: Calendar,
      label: "Total write days",
      value: streak?.totalWriteDays || 0,
      suffix: "days",
      color: "text-[#6F626A]",
      bg: "bg-[#F7F1EA]",
    },
    {
      icon: TrendingUp,
      label: "Last written",
      value: streak?.lastWriteDate
        ? new Date(streak.lastWriteDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })
        : "-",
      suffix: "",
      color: "text-[#B84A5A]",
      bg: "bg-[#FBEFEC]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex flex-col items-center p-4 rounded-[14px] ${stat.bg} border border-[rgba(47,39,48,0.06)]`}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} strokeWidth={1.6} />
          <span className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
          <span className="text-[11px] text-[#9A8F95] mt-0.5">{stat.suffix}</span>
          <span className="text-[10px] text-[#6F626A] mt-1 font-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
