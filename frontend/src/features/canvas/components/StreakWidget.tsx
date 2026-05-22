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
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 border border-[#FFB4A2]/15 backdrop-blur-md">
        <Flame className={`w-4 h-4 ${streak.currentStreak > 0 ? 'text-orange-500' : 'text-[#5A3E4C]/30'}`} />
        <span className={`text-sm font-semibold ${streak.currentStreak > 0 ? 'text-orange-600' : 'text-[#5A3E4C]/50'}`}>
          {streak.currentStreak}
        </span>
        <span className="text-xs text-[#5A3E4C]/40">hari</span>
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
      label: 'Streak Saat Ini',
      value: streak?.currentStreak || 0,
      suffix: 'hari',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Trophy,
      label: 'Streak Terpanjang',
      value: streak?.longestStreak || 0,
      suffix: 'hari',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Calendar,
      label: 'Total Hari Menulis',
      value: streak?.totalWriteDays || 0,
      suffix: 'hari',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Terakhir Menulis',
      value: streak?.lastWriteDate
        ? new Date(streak.lastWriteDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : '-',
      suffix: '',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {stats.map((stat, i) => (
        <div key={i} className={`flex flex-col items-center p-4 rounded-xl ${stat.bg} border border-white/50`}>
          <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
          <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          <span className="text-xs text-[#5A3E4C]/50 mt-0.5">{stat.suffix}</span>
          <span className="text-[10px] text-[#5A3E4C]/40 mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
