'use client';

import { useQuery } from '@apollo/client/react';
import { X, Heart } from 'lucide-react';
import { GET_EMOTIONAL_ARC } from '@/graphql/queries';
import { EmotionalArcChart, buildChartData } from './emotionalArc/EmotionalArcChart';
import { EmotionalArcOverview } from './emotionalArc/EmotionalArcOverview';
import { PeakValleyList } from './emotionalArc/PeakValleyList';
import { ArcState } from './emotionalArc/ArcState';

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
  const chartData = buildChartData(arc);

  return (
    <div className="absolute top-0 right-0 h-full w-[380px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#FF6B8B]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Emotional Arc</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        <ArcState loading={loading} arc={arc} />
        {arc && arc.dataPoints.length > 0 && (
          <>
            <EmotionalArcChart chartData={chartData} />
            <EmotionalArcOverview arc={arc} />
            <PeakValleyList items={arc.peaks} variant="peak" />
            <PeakValleyList items={arc.valleys} variant="valley" />
          </>
        )}
      </div>
    </div>
  );
}
