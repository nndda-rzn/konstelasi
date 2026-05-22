'use client';

import { useQuery } from '@apollo/client/react';
import { X, TrendingUp, TrendingDown, Minus, Heart, Zap, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { GET_EMOTIONAL_ARC } from '../../graphql/queries';

const MOOD_COLORS: Record<string, string> = {
  happy: '#FF922B',
  excited: '#FF6B8B',
  peaceful: '#38D9A9',
  hopeful: '#3BC9DB',
  romantic: '#C074DF',
  nostalgic: '#CC5DE8',
  melancholic: '#4DABF7',
  sad: '#7C83FD',
  neutral: '#94a3b8',
};

const TREND_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  rising: { icon: TrendingUp, label: 'Naik', color: '#38D9A9' },
  falling: { icon: TrendingDown, label: 'Turun', color: '#F03E3E' },
  stable: { icon: Minus, label: 'Stabil', color: '#7C83FD' },
};

interface EmotionalArcPanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmotionalArcPanel({ storyId, isOpen, onClose }: EmotionalArcPanelProps) {
  const { data, loading } = useQuery<any>(GET_EMOTIONAL_ARC, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  if (!isOpen) return null;

  const arc = data?.getEmotionalArc;
  const trendInfo = TREND_CONFIG[arc?.trend] || TREND_CONFIG.stable;
  const TrendIcon = trendInfo.icon;

  const chartData = arc?.dataPoints?.map((dp: any) => ({
    name: dp.title?.slice(0, 12) || `#${dp.index + 1}`,
    score: dp.score,
    mood: dp.mood,
    fill: MOOD_COLORS[dp.mood] || '#94a3b8',
  })) || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-[#2a2438] border border-[#FFB8C0]/20 dark:border-[#E63946]/10 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{d.name}</p>
        <p className="text-[10px] capitalize" style={{ color: d.fill }}>{d.mood}</p>
        <p className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Score: {d.score}</p>
      </div>
    );
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[380px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#FF6B8B]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Emotional Arc</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#FF6B8B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !arc || arc.dataPoints.length === 0 ? (
          <div className="text-center py-10">
            <Heart className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Tambahkan mood ke nodes untuk melihat emotional arc</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-3">Emotional Journey</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="emotionalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B8B" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="#7C83FD" stopOpacity={0.05} />
                        <stop offset="95%" stopColor="#4DABF7" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#5A3E4C80' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[-1, 1]} tick={{ fontSize: 9, fill: '#5A3E4C80' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#5A3E4C20" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="score" stroke="#FF6B8B" fill="url(#emotionalGradient)" strokeWidth={2} dot={{ r: 3, fill: '#FF6B8B' }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 mt-1 px-1">
                <span>Awal cerita</span>
                <span>Akhir cerita</span>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FF6B8B]/5 text-center">
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Overall</p>
                <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] capitalize mt-0.5">{arc.overallMood}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#7C83FD]/5 text-center">
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Range</p>
                <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mt-0.5">{arc.emotionalRange}</p>
              </div>
              <div className="p-2.5 rounded-xl text-center" style={{ backgroundColor: `${trendInfo.color}10` }}>
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Trend</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <TrendIcon className="w-3 h-3" style={{ color: trendInfo.color }} />
                  <p className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{trendInfo.label}</p>
                </div>
              </div>
            </div>

            {/* Peaks */}
            {arc.peaks.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#FF922B]" /> Emotional Peaks
                </h4>
                <div className="space-y-1.5">
                  {arc.peaks.map((p: any) => (
                    <div key={p.nodeId} className="flex items-center gap-2 p-2 rounded-lg bg-[#FF922B]/5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MOOD_COLORS[p.mood] || '#94a3b8' }} />
                      <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] flex-1 truncate">{p.title}</span>
                      <span className="text-[9px] capitalize px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-white/10" style={{ color: MOOD_COLORS[p.mood] }}>{p.mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valleys */}
            {arc.valleys.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#4DABF7]" /> Emotional Valleys
                </h4>
                <div className="space-y-1.5">
                  {arc.valleys.map((v: any) => (
                    <div key={v.nodeId} className="flex items-center gap-2 p-2 rounded-lg bg-[#4DABF7]/5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MOOD_COLORS[v.mood] || '#94a3b8' }} />
                      <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] flex-1 truncate">{v.title}</span>
                      <span className="text-[9px] capitalize px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-white/10" style={{ color: MOOD_COLORS[v.mood] }}>{v.mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
