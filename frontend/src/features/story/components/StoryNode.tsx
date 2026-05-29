'use client';

import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { MapPin, Clock, Heart, MessageCircle, Star, Lightbulb, Calendar, Image, Quote, PenTool, Lock, Hourglass } from 'lucide-react';

const NODE_TYPE_CONFIG: Record<string, { icon: any; label: string; color: string; bgGradient: string }> = {
  scene: { icon: MapPin, label: 'Scene', color: '#FF6B8B', bgGradient: 'from-[#FF6B8B]/15 to-[#FF922B]/5' },
  memory: { icon: Star, label: 'Memory', color: '#7C83FD', bgGradient: 'from-[#7C83FD]/15 to-[#4DABF7]/5' },
  character: { icon: Heart, label: 'Character', color: '#C074DF', bgGradient: 'from-[#C074DF]/15 to-[#7C83FD]/5' },
  dialogue: { icon: MessageCircle, label: 'Dialogue', color: '#38D9A9', bgGradient: 'from-[#38D9A9]/15 to-[#3BC9DB]/5' },
  moment: { icon: Lightbulb, label: 'Moment', color: '#FF922B', bgGradient: 'from-[#FF922B]/15 to-[#FCC419]/5' },
  feeling: { icon: Heart, label: 'Feeling', color: '#F03E3E', bgGradient: 'from-[#F03E3E]/15 to-[#FF6B8B]/5' },
  timeline_event: { icon: Calendar, label: 'Event', color: '#4DABF7', bgGradient: 'from-[#4DABF7]/15 to-[#3BC9DB]/5' },
  media: { icon: Image, label: 'Media', color: '#CC5DE8', bgGradient: 'from-[#CC5DE8]/15 to-[#C074DF]/5' },
  quote: { icon: Quote, label: 'Quote', color: '#FCC419', bgGradient: 'from-[#FCC419]/15 to-[#FF922B]/5' },
  reflection: { icon: PenTool, label: 'Reflection', color: '#3BC9DB', bgGradient: 'from-[#3BC9DB]/15 to-[#38D9A9]/5' },
};

const EMOTION_COLORS: Record<string, string> = {
  happy: '#FF922B',
  sad: '#7C83FD',
  excited: '#FF6B8B',
  peaceful: '#38D9A9',
  romantic: '#C074DF',
  melancholic: '#4DABF7',
  nostalgic: '#CC5DE8',
  hopeful: '#3BC9DB',
};

function getUnlockLabel(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StoryNode({ data, selected }: any) {
  const nodeType = data.storyNodeType || 'scene';
  const config = NODE_TYPE_CONFIG[nodeType] || NODE_TYPE_CONFIG.scene;
  const Icon = config.icon;
  const emotion = data.mood || '';
  const emotionColor = EMOTION_COLORS[emotion] || config.color;
  const isTimeLocked = Boolean(data.isTimeLocked || (data.unlockDate && new Date(data.unlockDate).getTime() > Date.now()));
  const isLocked = data.isLocked || isTimeLocked;
  const unlockLabel = getUnlockLabel(data.unlockDate);

  // Parse metadata
  let metadata: any = {};
  try {
    if (data.storyMetadata) metadata = JSON.parse(data.storyMetadata);
  } catch {}

  return (
    <div className={`relative group transition-all duration-300 w-full h-full ${selected ? 'scale-[1.02]' : ''}`}>
      <NodeResizer
        minWidth={160}
        minHeight={80}
        isVisible={selected}
        lineClassName="!border-[#FF6B8B]/40"
        handleClassName="!w-2.5 !h-2.5 !bg-[#FF6B8B] !border-white !rounded-full"
      />

      {/* Ambient Glow */}
      <div
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-candy-glow"
      />

      {/* Main Card */}
      <div className={`relative w-full h-full bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm border border-white/60 dark:border-[#E63946]/10 rounded-xl shadow-lg shadow-black/5 overflow-hidden ${selected ? 'ring-candy' : ''}`}>
        {/* Top accent line - gradient */}
        <div className="h-[3px] w-full bg-candy-accent-line" />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
          <div className="p-1 rounded-md" style={{ backgroundColor: `${config.color}20` }}>
            <Icon className="w-3 h-3" style={{ color: config.color }} />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
          {isLocked && <Lock className="w-2.5 h-2.5 text-[#5A3E4C]/30 ml-auto" />}
        </div>

        {/* Title */}
        <div className="px-3 pb-1">
          <h3 className="text-xs font-bold text-[#4A2F3C] dark:text-[#e2d9f3] leading-tight truncate">
            {data.title || 'Untitled'}
          </h3>
        </div>

        {/* Content Preview */}
        {isTimeLocked ? (
          <div className="mx-3 mb-2 px-2.5 py-2 rounded-lg bg-white/70 dark:bg-[#1a1625]/45 border border-[#E63946]/10">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#E63946]">
              <Hourglass className="w-3 h-3" />
              Time Capsule
            </div>
            <p className="mt-0.5 text-[9px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">
              {unlockLabel ? `Terbuka ${unlockLabel}` : 'Konten tersegel'}
            </p>
          </div>
        ) : data.content && (
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#5A3E4C]/70 dark:text-[#e2d9f3]/50 line-clamp-3 leading-relaxed whitespace-pre-line">
              {data.content
                .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, '\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/\n{2,}/g, '\n')
                .replace(/[ \t]+/g, ' ')
                .trim()
                .slice(0, 120)}
            </p>
          </div>
        )}

        {/* Metadata (Scene: location/time, Character: name, etc.) */}
        {metadata.sceneLocation && (
          <div className="px-3 pb-2 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-[#E63946]/60" />
            <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">{metadata.sceneLocation}</span>
          </div>
        )}
        {metadata.sceneTime && (
          <div className="px-3 pb-2 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-[#87CEEB]/60" />
            <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">{metadata.sceneTime}</span>
          </div>
        )}

        {/* Image thumbnail */}
        {!isTimeLocked && data.images?.length > 0 && (
          <div className="px-3 pb-2">
            <div className="w-full h-16 rounded-lg overflow-hidden">
              <img src={data.images[0].imageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Emotion badge */}
        {emotion && (
          <div className="px-3 pb-2.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
              style={{ backgroundColor: `${emotionColor}20`, color: emotionColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: emotionColor }} />
              {emotion}
            </span>
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#E63946]/50 !border-white !rounded-full" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-[#E63946]/50 !border-white !rounded-full" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#E63946]/50 !border-white !rounded-full" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-[#E63946]/50 !border-white !rounded-full" />
    </div>
  );
}

export default memo(StoryNode);
