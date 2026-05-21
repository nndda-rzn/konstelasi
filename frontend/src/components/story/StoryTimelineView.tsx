'use client';

import { useMemo } from 'react';
import { MapPin, Clock, Star, Heart, MessageCircle, Lightbulb, Calendar, Image, Quote, PenTool } from 'lucide-react';

const NODE_ICONS: Record<string, any> = {
  scene: MapPin, memory: Star, character: Heart, dialogue: MessageCircle,
  moment: Lightbulb, feeling: Heart, timeline_event: Calendar, media: Image,
  quote: Quote, reflection: PenTool,
};

const NODE_COLORS: Record<string, string> = {
  scene: '#FF6B8B', memory: '#7C83FD', character: '#C074DF', dialogue: '#38D9A9',
  moment: '#FF922B', feeling: '#F03E3E', timeline_event: '#4DABF7', media: '#CC5DE8',
  quote: '#FCC419', reflection: '#3BC9DB',
};

interface StoryTimelineViewProps {
  nodes: any[];
  onNodeClick?: (nodeId: string) => void;
}

export default function StoryTimelineView({ nodes, onNodeClick }: StoryTimelineViewProps) {
  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [nodes]);

  if (sortedNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada node dalam story ini</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-2xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/20 to-transparent" />

        {sortedNodes.map((node: any, index: number) => {
          const nodeType = node.storyNodeType || 'scene';
          const Icon = NODE_ICONS[nodeType] || MapPin;
          const color = NODE_COLORS[nodeType] || '#FF8FA3';
          let metadata: any = {};
          try { if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata); } catch {}

          return (
            <div key={node.id} className="relative pl-16 pb-8 group">
              {/* Timeline dot */}
              <div className="absolute left-4 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#1a1625] shadow-sm flex items-center justify-center transition-transform group-hover:scale-125"
                style={{ backgroundColor: `${color}30` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              </div>

              {/* Card */}
              <button
                onClick={() => onNodeClick?.(node.id)}
                className="w-full text-left p-4 rounded-xl border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 bg-white/80 dark:bg-[#2a2438]/80 hover:shadow-lg hover:shadow-[#FF8FA3]/5 transition-all group-hover:border-[#FF8FA3]/30"
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded-md" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-3 h-3" style={{ color }} />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color }}>
                    {nodeType.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 ml-auto">
                    {new Date(node.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">
                  {node.title || 'Untitled'}
                </h3>

                {/* Content preview */}
                {node.content && (
                  <p className="text-xs text-[#5A3E4C]/60 dark:text-[#e2d9f3]/40 line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{ __html: node.content.replace(/<[^>]+>/g, '').slice(0, 120) }} />
                )}

                {/* Metadata */}
                <div className="flex items-center gap-3 flex-wrap">
                  {metadata.sceneLocation && (
                    <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                      <MapPin className="w-2.5 h-2.5" /> {metadata.sceneLocation}
                    </span>
                  )}
                  {metadata.sceneTime && (
                    <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                      <Clock className="w-2.5 h-2.5" /> {metadata.sceneTime}
                    </span>
                  )}
                  {node.mood && (
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium"
                      style={{ backgroundColor: `${color}15`, color }}>
                      {node.mood}
                    </span>
                  )}
                </div>

                {/* Image thumbnail */}
                {node.images?.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {node.images.slice(0, 3).map((img: any) => (
                      <div key={img.id} className="w-12 h-12 rounded-lg overflow-hidden">
                        <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {node.images.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-[#FFB4A2]/10 flex items-center justify-center">
                        <span className="text-[9px] text-[#5A3E4C]/40">+{node.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
