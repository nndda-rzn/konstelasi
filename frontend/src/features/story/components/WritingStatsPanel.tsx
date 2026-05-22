'use client';

import { useQuery } from '@apollo/client/react';
import { X, PenTool, BookOpen, Clock, Calendar, Flame, FileText, Heart, BarChart3 } from 'lucide-react';
import { GET_WRITING_STATISTICS } from '@/graphql/queries';

interface WritingStatsPanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WritingStatsPanel({ storyId, isOpen, onClose }: WritingStatsPanelProps) {
  const { data, loading, error } = useQuery<any>(GET_WRITING_STATISTICS, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  if (!isOpen) return null;

  const stats = data?.getWritingStatistics;

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[340px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#FF8FA3]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#7C83FD]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Writing Statistics</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#7C83FD] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !stats ? (
          <div className="text-center py-10">
            <PenTool className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada data statistik</p>
          </div>
        ) : (
          <>
            {/* Overview Grid */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Overview</h4>
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard icon={<FileText className="w-3.5 h-3.5 text-[#FF6B8B]" />} label="Total Nodes" value={stats.totalNodes} color="bg-[#FF6B8B]/5" />
                <StatCard icon={<PenTool className="w-3.5 h-3.5 text-[#7C83FD]" />} label="Total Kata" value={stats.totalWords.toLocaleString()} color="bg-[#7C83FD]/5" />
                <StatCard icon={<BookOpen className="w-3.5 h-3.5 text-[#38D9A9]" />} label="Avg Kata/Node" value={stats.avgWordsPerNode} color="bg-[#38D9A9]/5" />
                <StatCard icon={<Clock className="w-3.5 h-3.5 text-[#FF922B]" />} label="Waktu Baca" value={`${stats.readingTimeMinutes} min`} color="bg-[#FF922B]/5" />
              </div>
            </div>

            {/* Writing Activity */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Writing Activity</h4>
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard icon={<Calendar className="w-3.5 h-3.5 text-[#C074DF]" />} label="Hari Menulis" value={stats.writingDays} color="bg-[#C074DF]/5" />
                <StatCard icon={<Flame className="w-3.5 h-3.5 text-[#F03E3E]" />} label="Max Streak" value={`${stats.maxWritingStreak} hari`} color="bg-[#F03E3E]/5" />
              </div>
              <div className="mt-2.5 p-3 rounded-xl bg-[#4DABF7]/5 dark:bg-[#4DABF7]/10">
                <div className="flex justify-between text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
                  <span>Pertama ditulis</span>
                  <span className="font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">{formatDate(stats.firstWriteDate)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-1.5">
                  <span>Terakhir ditulis</span>
                  <span className="font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">{formatDate(stats.lastWriteDate)}</span>
                </div>
              </div>
            </div>

            {/* Node Type Breakdown */}
            {stats.nodeTypeBreakdown?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Node Types</h4>
                <div className="space-y-1.5">
                  {stats.nodeTypeBreakdown.map((item: any) => {
                    const maxCount = Math.max(...stats.nodeTypeBreakdown.map((b: any) => b.count));
                    return (
                      <div key={item.type} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] w-24 truncate capitalize">{item.type.replace('_', ' ')}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#7C83FD]/10 dark:bg-[#7C83FD]/10 overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C83FD] transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-5 text-right">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mood Breakdown */}
            {stats.moodBreakdown?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Mood Distribution</h4>
                <div className="flex flex-wrap gap-1.5">
                  {stats.moodBreakdown.map((item: any) => (
                    <span key={item.mood} className="px-2.5 py-1 rounded-full bg-[#C074DF]/10 text-[10px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3] capitalize">
                      {item.mood} ({item.count})
                    </span>
                  ))}
                </div>
                {stats.mostCommonMood && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-[#FF6B8B]" />
                    <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
                      Mood dominan: <span className="font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] capitalize">{stats.mostCommonMood}</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Longest Node */}
            {stats.longestNode?.wordCount > 0 && (
              <div className="p-3 rounded-xl border border-[#FFB8C0]/15 dark:border-[#FF8FA3]/10 bg-[#FF922B]/5">
                <p className="text-[9px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-1">Node Terpanjang</p>
                <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{stats.longestNode.title}</p>
                <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-0.5">{stats.longestNode.wordCount.toLocaleString()} kata</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className={`p-3 rounded-xl ${color} dark:${color.replace('/5', '/10')}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{label}</span>
      </div>
      <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{value}</p>
    </div>
  );
}
