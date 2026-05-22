'use client';

import { useMemo } from 'react';
import { X, BarChart3, TrendingUp, Hash, Link2, Flame } from 'lucide-react';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notes: any[];
}

export default function AdvancedAnalyticsPanel({ isOpen, onClose, notes }: AnalyticsPanelProps) {
  const analytics = useMemo(() => {
    if (!notes || notes.length === 0) return null;

    // Word count stats
    const wordCounts = notes.map((n: any) => {
      const text = (n.content || '').replace(/<[^>]+>/g, '');
      return text.split(/\s+/).filter((w: string) => w.length > 0).length;
    });
    const totalWords = wordCounts.reduce((a: number, b: number) => a + b, 0);
    const avgWords = Math.round(totalWords / notes.length);
    const maxWords = Math.max(...wordCounts);

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      if (n.mood) moodCounts[n.mood] = (moodCounts[n.mood] || 0) + 1;
    });
    const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    // Tag distribution
    const tagCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      n.tags?.forEach((t: any) => {
        tagCounts[t.name] = (tagCounts[t.name] || 0) + 1;
      });
    });
    const tagEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Most connected notes
    const connectionCounts = notes.map((n: any) => ({
      id: n.id,
      title: n.title || 'Untitled',
      connections: (n.outgoingEdges?.length || 0) + (n.incomingEdges?.length || 0),
    })).sort((a: any, b: any) => b.connections - a.connections).slice(0, 5);

    // Activity by day of week
    const dayActivity: number[] = [0, 0, 0, 0, 0, 0, 0];
    notes.forEach((n: any) => {
      const day = new Date(n.createdAt).getDay();
      dayActivity[day]++;
    });
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const maxDayActivity = Math.max(...dayActivity);

    // Activity last 30 days
    const last30: number[] = new Array(30).fill(0);
    const now = new Date();
    notes.forEach((n: any) => {
      const diff = Math.floor((now.getTime() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 30) last30[29 - diff]++;
    });
    const maxLast30 = Math.max(...last30, 1);

    // Color distribution
    const colorCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      const c = n.color || 'default';
      colorCounts[c] = (colorCounts[c] || 0) + 1;
    });

    return {
      totalNotes: notes.length,
      totalWords,
      avgWords,
      maxWords,
      moodEntries,
      tagEntries,
      connectionCounts,
      dayActivity,
      dayNames,
      maxDayActivity,
      last30,
      maxLast30,
      colorCounts,
    };
  }, [notes]);

  if (!isOpen || !analytics) return null;

  const moodColors: Record<string, string> = {
    memory: '#C7CEEA', hope: '#B5EAD7', secret: '#E0BBE4',
    dream: '#FFD6A5', ordinary: '#D4D4D4', important: '#FF8FA3',
  };

  return (
    <div className="absolute top-4 right-4 w-[400px] max-h-[85vh] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#FF8FA3]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Analytics</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#FF8FA3]/5 dark:bg-[#FF8FA3]/10 text-center">
            <p className="text-lg font-bold text-[#FF8FA3]">{analytics.totalNotes}</p>
            <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Catatan</p>
          </div>
          <div className="p-3 rounded-xl bg-[#B5EAD7]/20 dark:bg-[#B5EAD7]/10 text-center">
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{analytics.totalWords.toLocaleString()}</p>
            <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Total Kata</p>
          </div>
          <div className="p-3 rounded-xl bg-[#C7CEEA]/20 dark:bg-[#C7CEEA]/10 text-center">
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{analytics.avgWords}</p>
            <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Rata-rata</p>
          </div>
        </div>

        {/* Last 30 Days Activity */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Aktivitas 30 Hari Terakhir</h4>
          <div className="flex items-end gap-[2px] h-12">
            {analytics.last30.map((count: number, i: number) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[#FF8FA3] transition-all"
                style={{ height: `${Math.max((count / analytics.maxLast30) * 100, 4)}%`, opacity: count > 0 ? 0.3 + (count / analytics.maxLast30) * 0.7 : 0.1 }}
                title={`${count} catatan`}
              />
            ))}
          </div>
        </div>

        {/* Day of Week Activity */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Aktivitas per Hari</h4>
          <div className="flex items-end gap-2 h-16">
            {analytics.dayActivity.map((count: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-md bg-[#FFB4A2] dark:bg-[#FF8FA3] transition-all"
                  style={{ height: `${analytics.maxDayActivity > 0 ? Math.max((count / analytics.maxDayActivity) * 48, 2) : 2}px` }}
                />
                <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{analytics.dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Distribution */}
        {analytics.moodEntries.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Distribusi Mood</h4>
            <div className="space-y-1.5">
              {analytics.moodEntries.map(([mood, count]: [string, number]) => (
                <div key={mood} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: moodColors[mood] || '#D4D4D4' }} />
                  <span className="text-xs text-[#4A2F3C] dark:text-[#e2d9f3] capitalize flex-1">{mood}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / notes.length) * 100}%`, backgroundColor: moodColors[mood] || '#D4D4D4' }} />
                  </div>
                  <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Tags */}
        {analytics.tagEntries.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Top Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {analytics.tagEntries.map(([name, count]: [string, number]) => (
                <span key={name} className="px-2 py-1 rounded-full bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10 text-[10px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
                  {name} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Most Connected Notes */}
        {analytics.connectionCounts.filter((n: any) => n.connections > 0).length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Catatan Paling Terhubung</h4>
            <div className="space-y-1.5">
              {analytics.connectionCounts.filter((n: any) => n.connections > 0).map((n: any) => (
                <div key={n.id} className="flex items-center gap-2 text-xs">
                  <Link2 className="w-3 h-3 text-[#FF8FA3]" />
                  <span className="text-[#4A2F3C] dark:text-[#e2d9f3] truncate flex-1">{n.title}</span>
                  <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{n.connections} koneksi</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
