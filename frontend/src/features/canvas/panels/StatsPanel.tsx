'use client';

import { useMemo } from 'react';
import { X, BarChart3, Heart, Calendar, FileText, Quote } from 'lucide-react';

interface StatsPanelProps {
  notes: any[];
  onClose: () => void;
}

const MOOD_EMOJI: Record<string, string> = {
  memory: 'Memory', hope: 'Hope', secret: 'Secret',
  dream: 'Dream', ordinary: 'Ordinary', important: 'Important',
};

const MOOD_COLORS: Record<string, string> = {
  memory: '#C7CEEA', hope: '#B5EAD7', secret: '#E0BBE4',
  dream: '#FFD6A5', ordinary: '#D4D4D4', important: '#FF8FA3',
};

export default function StatsPanel({ notes, onClose }: StatsPanelProps) {
  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const totalQuotes = notes.filter(n => n.type === 'quote').length;
    const totalImages = notes.reduce((acc, n) => acc + (n.images?.length || 0), 0);
    
    // Mood distribution
    const moodCounts: Record<string, number> = {};
    notes.forEach(n => {
      if (n.mood) {
        moodCounts[n.mood] = (moodCounts[n.mood] || 0) + 1;
      }
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    // Tag distribution
    const tagCounts: Record<string, { name: string; color: string; count: number }> = {};
    notes.forEach(n => {
      n.tags?.forEach((t: any) => {
        if (!tagCounts[t.id]) tagCounts[t.id] = { name: t.name, color: t.color || '#FF8FA3', count: 0 };
        tagCounts[t.id].count++;
      });
    });
    const topTags = Object.values(tagCounts).sort((a, b) => b.count - a.count).slice(0, 5);

    // Activity by day of week
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayCounts = new Array(7).fill(0);
    notes.forEach(n => {
      const day = new Date(n.createdAt || Date.now()).getDay();
      dayCounts[day]++;
    });
    const maxDayCount = Math.max(...dayCounts, 1);
    const mostActiveDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))];

    // Recent activity (last 7 days)
    const now = Date.now();
    const last7Days = notes.filter(n => now - new Date(n.createdAt || 0).getTime() < 7 * 24 * 60 * 60 * 1000).length;

    return { totalNotes, totalQuotes, totalImages, moodCounts, topMood, topTags, dayCounts, dayNames, maxDayCount, mostActiveDay, last7Days };
  }, [notes]);

  return (
    <div className="fixed top-0 right-0 h-full w-[340px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#FF8FA3]" />
          <h2 className="text-lg font-bold text-[#4A2F3C]">Statistik</h2>
        </div>
        <button onClick={onClose} className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#FFF5F0]/80 border border-[#FFB4A2]/10">
            <FileText className="w-4 h-4 text-[#FF8FA3] mb-1" />
            <p className="text-xl font-bold text-[#4A2F3C]">{stats.totalNotes}</p>
            <p className="text-[10px] text-[#5A3E4C]/40 uppercase font-medium">Total Catatan</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF5F0]/80 border border-[#FFB4A2]/10">
            <Quote className="w-4 h-4 text-[#FF8FA3] mb-1" />
            <p className="text-xl font-bold text-[#4A2F3C]">{stats.totalQuotes}</p>
            <p className="text-[10px] text-[#5A3E4C]/40 uppercase font-medium">Kutipan</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF5F0]/80 border border-[#FFB4A2]/10">
            <Calendar className="w-4 h-4 text-[#FF8FA3] mb-1" />
            <p className="text-xl font-bold text-[#4A2F3C]">{stats.last7Days}</p>
            <p className="text-[10px] text-[#5A3E4C]/40 uppercase font-medium">7 Hari Terakhir</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF5F0]/80 border border-[#FFB4A2]/10">
            <Heart className="w-4 h-4 text-[#FF8FA3] mb-1" />
            <p className="text-xl font-bold text-[#4A2F3C]">{stats.topMood ? <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: MOOD_COLORS[stats.topMood[0]] || '#D4D4D4' }} /> : '—'}</p>
            <p className="text-[10px] text-[#5A3E4C]/40 uppercase font-medium">Top Moment</p>
          </div>
        </div>

        {/* Activity by Day */}
        <div>
          <h3 className="text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Aktivitas per Hari</h3>
          <div className="flex items-end gap-1.5 h-20">
            {stats.dayCounts.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#FF8FA3] to-[#FFB4A2] transition-all"
                  style={{ height: `${(count / stats.maxDayCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                />
                <span className="text-[9px] text-[#5A3E4C]/40">{stats.dayNames[i].slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#5A3E4C]/40 mt-2">Paling aktif di hari <span className="font-medium text-[#FF8FA3]">{stats.mostActiveDay}</span></p>
        </div>

        {/* Mood Distribution */}
        {Object.keys(stats.moodCounts).length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Moment Types</h3>
            <div className="space-y-2">
              {Object.entries(stats.moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: MOOD_COLORS[mood] || '#D4D4D4' }} />
                  <span className="text-xs text-[#5A3E4C]/60 capitalize w-16">{MOOD_EMOJI[mood] || mood}</span>
                  <div className="flex-1 h-2 bg-[#FFF5F0] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-full" style={{ width: `${(count / stats.totalNotes) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[#5A3E4C]/30 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Tags */}
        {stats.topTags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">Tag Populer</h3>
            <div className="space-y-2">
              {stats.topTags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                  <span className="text-xs text-[#5A3E4C]/70 flex-1">{tag.name}</span>
                  <span className="text-[10px] text-[#5A3E4C]/30">{tag.count} catatan</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
