'use client';

import { useQuery } from '@apollo/client/react';
import { X, Calendar, MapPin, Clock, Hourglass, Star } from 'lucide-react';
import { GET_MEMORY_TIMELINE } from '../../graphql/queries';

const NODE_COLORS: Record<string, string> = {
  scene: '#FF6B8B', memory: '#7C83FD', character: '#C074DF', dialogue: '#38D9A9',
  moment: '#FF922B', feeling: '#F03E3E', timeline_event: '#4DABF7', media: '#CC5DE8',
  quote: '#FCC419', reflection: '#3BC9DB',
};

interface MemoryTimelinePanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryTimelinePanel({ storyId, isOpen, onClose }: MemoryTimelinePanelProps) {
  const { data, loading } = useQuery<any>(GET_MEMORY_TIMELINE, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  if (!isOpen) return null;

  const timeline = data?.getMemoryTimeline;

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDaysAgo = (days: number | null) => {
    if (days === null) return '';
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 30) return `${days} hari lalu`;
    if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
    return `${Math.floor(days / 365)} tahun lalu`;
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[360px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-[#CC5DE8]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Memory Timeline</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#CC5DE8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !timeline || timeline.timelineItems.length === 0 ? (
          <div className="text-center py-10">
            <Hourglass className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Tambahkan event date ke nodes untuk melihat memory timeline</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#CC5DE8]/5 text-center">
                  <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{timeline.totalWithEventDate}</p>
                  <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Dengan tanggal</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#4DABF7]/5 text-center">
                  <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{formatDaysAgo(timeline.avgDaysSinceEvent)}</p>
                  <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Rata-rata usia memori</p>
                </div>
              </div>
            </div>

            {/* Oldest & Newest Memory */}
            {(timeline.oldestMemory || timeline.newestMemory) && (
              <div className="space-y-2">
                {timeline.oldestMemory && (
                  <div className="p-3 rounded-xl border border-[#CC5DE8]/15 bg-[#CC5DE8]/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-3 h-3 text-[#CC5DE8]" />
                      <span className="text-[9px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold">Memori Tertua</span>
                    </div>
                    <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{timeline.oldestMemory.title}</p>
                    <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">{formatDate(timeline.oldestMemory.eventDate)} ({formatDaysAgo(timeline.oldestMemory.daysSince)})</p>
                  </div>
                )}
                {timeline.newestMemory && (
                  <div className="p-3 rounded-xl border border-[#38D9A9]/15 bg-[#38D9A9]/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-3 h-3 text-[#38D9A9]" />
                      <span className="text-[9px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold">Memori Terbaru</span>
                    </div>
                    <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{timeline.newestMemory.title}</p>
                    <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">{formatDate(timeline.newestMemory.eventDate)} ({formatDaysAgo(timeline.newestMemory.daysSince)})</p>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Distribution */}
            {timeline.monthlyDistribution?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Distribusi Bulanan</h4>
                <div className="space-y-1.5">
                  {timeline.monthlyDistribution.map((item: any) => {
                    const maxCount = Math.max(...timeline.monthlyDistribution.map((b: any) => b.count));
                    return (
                      <div key={item.month} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] w-20 truncate">{item.month}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#CC5DE8]/10 overflow-hidden">
                          <div className="h-full rounded-full bg-[#CC5DE8] transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-5 text-right">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline Items */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-3">Timeline</h4>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[#CC5DE8]/30 via-[#7C83FD]/20 to-transparent" />
                <div className="space-y-3">
                  {timeline.timelineItems.map((item: any) => (
                    <div key={item.nodeId} className="relative pl-8">
                      <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full border-2 border-white dark:border-[#2a2438]" style={{ backgroundColor: NODE_COLORS[item.nodeType] || '#94a3b8' }} />
                      <div className="p-2.5 rounded-lg bg-white/50 dark:bg-white/5 border border-[#FFB4A2]/10 dark:border-[#FF8FA3]/5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] capitalize px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${NODE_COLORS[item.nodeType]}15`, color: NODE_COLORS[item.nodeType] }}>{item.nodeType.replace('_', ' ')}</span>
                          {item.mood && <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 capitalize">{item.mood}</span>}
                        </div>
                        <p className="text-[11px] font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{item.title}</p>
                        {item.content && <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 line-clamp-1 mt-0.5">{item.content}</p>}
                        <div className="flex items-center gap-3 mt-1.5">
                          {item.eventDate && (
                            <span className="flex items-center gap-0.5 text-[9px] text-[#CC5DE8]">
                              <Calendar className="w-2.5 h-2.5" /> {formatDate(item.eventDate)}
                            </span>
                          )}
                          {item.eventLocation && (
                            <span className="flex items-center gap-0.5 text-[9px] text-[#38D9A9]">
                              <MapPin className="w-2.5 h-2.5" /> {item.eventLocation}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5 text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">
                            <Clock className="w-2.5 h-2.5" /> Ditulis {formatDate(item.writeDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
