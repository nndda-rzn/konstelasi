'use client';

import { useQuery } from '@apollo/client/react';
import { X, Eye, Users, Clock, Bookmark, Award } from 'lucide-react';
import { GET_STORY_ANALYTICS } from '@/graphql/story';

const BADGE_LABELS: Record<string, { label: string; color: string }> = {
  moved: { label: 'Moved', color: '#FF6B8B' },
  favorite: { label: 'Favorite', color: '#FF922B' },
  bookmarked: { label: 'Bookmarked', color: '#7C83FD' },
  thought_provoking: { label: 'Thought-provoking', color: '#38D9A9' },
  memorable: { label: 'Memorable', color: '#C074DF' },
};

interface StoryAnalyticsPanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
  nodes?: any[];
}

export default function StoryAnalyticsPanel({ storyId, isOpen, onClose, nodes = [] }: StoryAnalyticsPanelProps) {
  const { data, loading, error } = useQuery<any>(GET_STORY_ANALYTICS, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  if (!isOpen) return null;

  const analytics = data?.getStoryAnalytics;

  // Story-level stats from nodes (always available)
  const totalNodes = nodes.length;
  const totalWords = nodes.reduce((sum: number, n: any) => {
    const text = (n.content || '').replace(/<[^>]+>/g, '');
    return sum + text.split(/\s+/).filter((w: string) => w.length > 0).length;
  }, 0);
  const nodeTypes: Record<string, number> = {};
  nodes.forEach((n: any) => {
    const t = n.storyNodeType || 'scene';
    nodeTypes[t] = (nodeTypes[t] || 0) + 1;
  });

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#E63946]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Analytics</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Story Stats (always shown) */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Story Stats</h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FF6B8B]/5 dark:bg-[#FF6B8B]/10">
              <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{totalNodes}</p>
              <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Total Nodes</p>
            </div>
            <div className="p-3 rounded-xl bg-[#7C83FD]/5 dark:bg-[#7C83FD]/10">
              <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{totalWords.toLocaleString()}</p>
              <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Total Kata</p>
            </div>
          </div>
        </div>

        {/* Node Type Breakdown (always shown) */}
        {Object.keys(nodeTypes).length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Node Types</h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(nodeTypes).map(([type, count]) => (
                <span key={type} className="px-2 py-1 rounded-full bg-[#FF6B8B]/10 text-[10px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
                  {type.replace('_', ' ')} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Stats (when available) */}
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-[#FF6B8B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : analytics ? (
          <>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Engagement</h4>
              <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#E63946]/5 dark:bg-[#E63946]/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye className="w-3 h-3 text-[#E63946]" />
                  <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Views</span>
                </div>
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{analytics.totalViews}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#B5EAD7]/10 dark:bg-[#B5EAD7]/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Visitors</span>
                </div>
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{analytics.uniqueViewers}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#C7CEEA]/10 dark:bg-[#C7CEEA]/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Time Spent</span>
                </div>
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{formatTime(analytics.totalTimeSpent)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFD6A5]/10 dark:bg-[#FFD6A5]/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Bookmark className="w-3 h-3 text-amber-500" />
                  <span className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Bookmarks</span>
                </div>
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{analytics.totalBookmarks}</p>
              </div>
              </div>
            </div>

            {/* Badge Breakdown */}
            {analytics.badgeBreakdown?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-3">Badge Distribution</h4>
                <div className="space-y-2">
                  {analytics.badgeBreakdown.map((badge: any) => {
                    const info = BADGE_LABELS[badge.type] || { label: badge.type, color: '#FFB8C0' };
                    const maxCount = Math.max(...analytics.badgeBreakdown.map((b: any) => b.count));
                    return (
                      <div key={badge.type} className="flex items-center gap-2">
                        <span className="text-xs text-[#4A2F3C] dark:text-[#e2d9f3] w-28 truncate">{info.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#FFB8C0]/10 dark:bg-[#E63946]/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${(badge.count / maxCount) * 100}%`, backgroundColor: info.color }} />
                        </div>
                        <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-6 text-right">{badge.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total Badges */}
            <div className="p-4 rounded-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 bg-[#E63946]/5 dark:bg-[#E63946]/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50">Total Badges</span>
                <span className="text-sm font-bold text-[#E63946]">{analytics.totalBadges}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
