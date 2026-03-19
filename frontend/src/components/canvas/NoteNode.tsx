import { Handle, Position } from '@xyflow/react';

const THEMES: Record<string, any> = {
  default: {
    borderBase: 'border-white/[0.07]', borderHover: 'hover:border-red-500/30', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(220,38,38,0.2)]', selectedBorder: 'border-red-500/50', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(220,38,38,0.35)]', selectedBg: 'bg-[#1a1a26]/95', bgHover: 'hover:bg-[#181824]/90', topLine: 'via-red-500', innerGlow: 'from-red-500/10', innerGlowUnselected: 'from-red-500/5'
  },
  red: {
    borderBase: 'border-red-500/20', borderHover: 'hover:border-red-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(239,68,68,0.2)]', selectedBorder: 'border-red-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(239,68,68,0.4)]', selectedBg: 'bg-red-950/50', bgHover: 'hover:bg-red-950/30', topLine: 'via-red-500', innerGlow: 'from-red-500/20', innerGlowUnselected: 'from-red-500/5'
  },
  amber: {
    borderBase: 'border-amber-500/20', borderHover: 'hover:border-amber-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.2)]', selectedBorder: 'border-amber-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.4)]', selectedBg: 'bg-amber-950/50', bgHover: 'hover:bg-amber-950/30', topLine: 'via-amber-500', innerGlow: 'from-amber-500/20', innerGlowUnselected: 'from-amber-500/5'
  },
  emerald: {
    borderBase: 'border-emerald-500/20', borderHover: 'hover:border-emerald-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(16,185,129,0.2)]', selectedBorder: 'border-emerald-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)]', selectedBg: 'bg-emerald-950/50', bgHover: 'hover:bg-emerald-950/30', topLine: 'via-emerald-500', innerGlow: 'from-emerald-500/20', innerGlowUnselected: 'from-emerald-500/5'
  },
  blue: {
    borderBase: 'border-blue-500/20', borderHover: 'hover:border-blue-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(59,130,246,0.2)]', selectedBorder: 'border-blue-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(59,130,246,0.4)]', selectedBg: 'bg-blue-950/50', bgHover: 'hover:bg-blue-950/30', topLine: 'via-blue-500', innerGlow: 'from-blue-500/20', innerGlowUnselected: 'from-blue-500/5'
  },
  indigo: {
    borderBase: 'border-indigo-500/20', borderHover: 'hover:border-indigo-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(99,102,241,0.2)]', selectedBorder: 'border-indigo-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]', selectedBg: 'bg-indigo-950/50', bgHover: 'hover:bg-indigo-950/30', topLine: 'via-indigo-500', innerGlow: 'from-indigo-500/20', innerGlowUnselected: 'from-indigo-500/5'
  },
  purple: {
    borderBase: 'border-purple-500/20', borderHover: 'hover:border-purple-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(168,85,247,0.2)]', selectedBorder: 'border-purple-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)]', selectedBg: 'bg-purple-950/50', bgHover: 'hover:bg-purple-950/30', topLine: 'via-purple-500', innerGlow: 'from-purple-500/20', innerGlowUnselected: 'from-purple-500/5'
  },
  pink: {
    borderBase: 'border-pink-500/20', borderHover: 'hover:border-pink-500/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(236,72,153,0.2)]', selectedBorder: 'border-pink-500/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(236,72,153,0.4)]', selectedBg: 'bg-pink-950/50', bgHover: 'hover:bg-pink-950/30', topLine: 'via-pink-500', innerGlow: 'from-pink-500/20', innerGlowUnselected: 'from-pink-500/5'
  }
};

export default function NoteNode({ data, isConnectable, selected }: any) {
  const { isSearching, isMatch, color = 'default' } = data;
  const theme = THEMES[color] || THEMES.default;
  
  // If searching and not a match, fade out
  const searchFade = isSearching && !isMatch ? 'opacity-25 scale-95 pointer-events-none grayscale' : 'opacity-100 scale-100';
  
  // If searching and IS a match, highlight
  const searchHighlight = isSearching && isMatch ? 'ring-2 ring-amber-300 shadow-[0_0_60px_-10px_rgba(252,211,77,0.5)] z-50' : '';

  const isSelectedStyle = selected && (!isSearching || isMatch);

  return (
    <div className={`
      relative min-w-[240px] max-w-[320px] min-h-[120px] rounded-[20px] backdrop-blur-3xl transition-all duration-500 group
      bg-[#13131c]/80
      ${searchFade} ${searchHighlight}
      ${isSelectedStyle
        ? `border ${theme.selectedBorder} ${theme.selectedShadow} ${theme.selectedBg}` 
        : `border ${theme.borderBase} ${theme.bgHover}`
      }
      ${theme.borderHover} ${theme.shadowHover}
    `}>
      {/* Top radiant accent line */}
      <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent ${theme.topLine}/${isSelectedStyle ? '80' : '30'} to-transparent opacity-80 group-hover:opacity-100 group-hover:w-5/6 transition-all duration-500`} />
      
      {/* Inner ambient glow */}
      <div className={`absolute inset-0 rounded-[20px] transition-opacity duration-500 pointer-events-none ${isSelectedStyle ? `bg-gradient-to-br ${theme.innerGlow} to-transparent opacity-100` : `bg-gradient-to-br ${theme.innerGlowUnselected} to-transparent opacity-0 group-hover:opacity-100`}`} />

      {/* One handle per side — each can be source AND target */}
      <Handle type="source" position={Position.Top} id="top" isConnectable={isConnectable} isConnectableEnd={true} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} isConnectableEnd={true} />
      
      <div 
        className="p-6 cursor-pointer relative z-10"
        onClick={() => data.onDoubleClick?.()}
        onDoubleClick={() => data.onDoubleClick?.()}
      >
        {data.images && data.images.length > 0 && (
          <div className="mb-4 w-full h-28 overflow-hidden rounded-xl border border-white/[0.04] shadow-inner">
            <img 
              src={data.images[0].imageUrl} 
              alt={data.images[0].caption || 'Note attachment'} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
            />
          </div>
        )}
        <h3 className={`font-semibold text-[16px] mb-1.5 truncate tracking-wide transition-colors duration-300 ${selected ? 'text-white' : 'text-white/85 group-hover:text-white'}`}>
          {data.title || 'Untitled Note'}
        </h3>
        <div className="text-white/40 text-[13px] line-clamp-3 leading-relaxed font-light">
          {data.content ? (
            <div dangerouslySetInnerHTML={{ __html: data.content }} className="prose prose-invert prose-p:my-0 prose-img:hidden" />
          ) : (
            <p className="italic text-white/20">Double click to start writing...</p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} isConnectableEnd={true} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} isConnectableEnd={true} />
    </div>
  );
}
