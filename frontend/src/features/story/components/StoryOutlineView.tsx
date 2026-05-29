'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, ChevronDown, MapPin, Star, Heart, MessageCircle, Lightbulb, Calendar, Image, Quote, PenTool, Lock } from 'lucide-react';

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

function isNodeTimeLocked(node: any) {
  return Boolean(node?.isTimeLocked || (node?.unlockDate && new Date(node.unlockDate).getTime() > Date.now()));
}

interface StoryOutlineViewProps {
  nodes: any[];
  onNodeClick?: (nodeId: string) => void;
}

export default function StoryOutlineView({ nodes, onNodeClick }: StoryOutlineViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const groupedNodes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    nodes.forEach((node: any) => {
      const type = node.storyNodeType || 'scene';
      if (!groups[type]) groups[type] = [];
      groups[type].push(node);
    });
    // Sort each group by date
    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        const aTime = new Date(a.eventDate || a.createdAt).getTime();
        const bTime = new Date(b.eventDate || b.createdAt).getTime();
        return aTime - bTime;
      });
    });
    return groups;
  }, [nodes]);

  const toggleGroup = (type: string) => {
    const next = new Set(expandedNodes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setExpandedNodes(next);
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada node dalam story ini</p>
      </div>
    );
  }

  const typeOrder = ['scene', 'memory', 'character', 'dialogue', 'moment', 'feeling', 'timeline_event', 'media', 'quote', 'reflection'];
  const sortedTypes = Object.keys(groupedNodes).sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-2">
        {/* Summary */}
        <div className="mb-6 p-4 rounded-xl bg-[#E63946]/5 dark:bg-[#E63946]/10 border border-[#FFB4A2]/15 dark:border-[#E63946]/10">
          <h3 className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-2">Story Outline</h3>
          <div className="flex flex-wrap gap-3">
            {sortedTypes.map(type => (
              <span key={type} className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
                <span className="font-semibold" style={{ color: NODE_COLORS[type] }}>{groupedNodes[type].length}</span> {type.replace('_', ' ')}
              </span>
            ))}
            <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
              <span className="font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{nodes.length}</span> total
            </span>
          </div>
        </div>

        {/* Groups */}
        {sortedTypes.map(type => {
          const Icon = NODE_ICONS[type] || MapPin;
          const color = NODE_COLORS[type] || '#E63946';
          const isExpanded = expandedNodes.has(type);
          const items = groupedNodes[type];

          return (
            <div key={type} className="rounded-xl border border-[#FFB4A2]/15 dark:border-[#E63946]/10 overflow-hidden">
              <button onClick={() => toggleGroup(type)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFB4A2]/5 dark:hover:bg-[#E63946]/5 transition-all">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#5A3E4C]/40" /> : <ChevronRight className="w-3.5 h-3.5 text-[#5A3E4C]/40" />}
                <div className="p-1 rounded-md" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] capitalize">{type.replace('_', ' ')}</span>
                <span className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 ml-auto">{items.length}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-[#FFB4A2]/10 dark:border-[#E63946]/5">
                  {items.map((node: any, i: number) => (
                    <button key={node.id} onClick={() => onNodeClick?.(node.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#FFB4A2]/5 dark:hover:bg-[#E63946]/5 transition-all ${i < items.length - 1 ? 'border-b border-[#FFB4A2]/5 dark:border-[#E63946]/5' : ''}`}>
                      <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{node.title || 'Untitled'}</p>
                          {isNodeTimeLocked(node) && <Lock className="w-3 h-3 shrink-0 text-[#E63946]/60" />}
                        </div>
                        {isNodeTimeLocked(node) ? (
                          <p className="text-[9px] text-[#E63946]/55 truncate mt-0.5">Time Capsule tersegel</p>
                        ) : node.content && (
                          <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/25 truncate mt-0.5"
                            dangerouslySetInnerHTML={{ __html: node.content.replace(/<[^>]+>/g, '').slice(0, 60) }} />
                        )}
                      </div>
                      <span className="text-[8px] text-[#5A3E4C]/25 dark:text-[#e2d9f3]/15">
                        {new Date(node.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
