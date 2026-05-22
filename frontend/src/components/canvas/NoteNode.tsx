import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const THEMES: Record<string, any> = {
  default: {
    borderBase: 'border-[#FFB4A2]/20', borderHover: 'hover:border-[#FF8FA3]/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(255,180,162,0.15),0_0_30px_rgba(255,143,163,0.1)]', selectedBorder: 'border-[#FF8FA3]/50', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(255,143,163,0.25)]', selectedBg: 'bg-white/95', bgHover: 'hover:bg-white/90', topLine: 'via-[#FF8FA3]', innerGlow: 'from-[#FFB4A2]/10', innerGlowUnselected: 'from-[#FFB4A2]/5'
  },
  red: {
    borderBase: 'border-[#FF8FA3]/25', borderHover: 'hover:border-[#FF8FA3]/50', shadowHover: 'hover:shadow-[0_8px_40px_rgba(255,143,163,0.15),0_0_30px_rgba(255,143,163,0.1)]', selectedBorder: 'border-[#FF8FA3]/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(255,143,163,0.3)]', selectedBg: 'bg-pink-50/90', bgHover: 'hover:bg-pink-50/60', topLine: 'via-[#FF8FA3]', innerGlow: 'from-[#FF8FA3]/15', innerGlowUnselected: 'from-[#FF8FA3]/5'
  },
  amber: {
    borderBase: 'border-amber-400/20', borderHover: 'hover:border-amber-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(251,191,36,0.15),0_0_30px_rgba(251,191,36,0.1)]', selectedBorder: 'border-amber-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(251,191,36,0.3)]', selectedBg: 'bg-amber-50/90', bgHover: 'hover:bg-amber-50/60', topLine: 'via-amber-400', innerGlow: 'from-amber-400/15', innerGlowUnselected: 'from-amber-400/5'
  },
  emerald: {
    borderBase: 'border-emerald-400/20', borderHover: 'hover:border-emerald-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(52,211,153,0.15),0_0_30px_rgba(52,211,153,0.1)]', selectedBorder: 'border-emerald-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(52,211,153,0.3)]', selectedBg: 'bg-emerald-50/90', bgHover: 'hover:bg-emerald-50/60', topLine: 'via-emerald-400', innerGlow: 'from-emerald-400/15', innerGlowUnselected: 'from-emerald-400/5'
  },
  blue: {
    borderBase: 'border-blue-400/20', borderHover: 'hover:border-blue-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(96,165,250,0.15),0_0_30px_rgba(96,165,250,0.1)]', selectedBorder: 'border-blue-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(96,165,250,0.3)]', selectedBg: 'bg-blue-50/90', bgHover: 'hover:bg-blue-50/60', topLine: 'via-blue-400', innerGlow: 'from-blue-400/15', innerGlowUnselected: 'from-blue-400/5'
  },
  indigo: {
    borderBase: 'border-indigo-400/20', borderHover: 'hover:border-indigo-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(129,140,248,0.15),0_0_30px_rgba(129,140,248,0.1)]', selectedBorder: 'border-indigo-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(129,140,248,0.3)]', selectedBg: 'bg-indigo-50/90', bgHover: 'hover:bg-indigo-50/60', topLine: 'via-indigo-400', innerGlow: 'from-indigo-400/15', innerGlowUnselected: 'from-indigo-400/5'
  },
  purple: {
    borderBase: 'border-purple-400/20', borderHover: 'hover:border-purple-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(192,132,252,0.15),0_0_30px_rgba(192,132,252,0.1)]', selectedBorder: 'border-purple-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(192,132,252,0.3)]', selectedBg: 'bg-purple-50/90', bgHover: 'hover:bg-purple-50/60', topLine: 'via-purple-400', innerGlow: 'from-purple-400/15', innerGlowUnselected: 'from-purple-400/5'
  },
  pink: {
    borderBase: 'border-pink-400/20', borderHover: 'hover:border-pink-400/40', shadowHover: 'hover:shadow-[0_8px_40px_rgba(244,114,182,0.15),0_0_30px_rgba(244,114,182,0.1)]', selectedBorder: 'border-pink-400/60', selectedShadow: 'shadow-[0_0_50px_-10px_rgba(244,114,182,0.3)]', selectedBg: 'bg-pink-50/90', bgHover: 'hover:bg-pink-50/60', topLine: 'via-pink-400', innerGlow: 'from-pink-400/15', innerGlowUnselected: 'from-pink-400/5'
  }
};

export default memo(function NoteNode({ data, isConnectable, selected, viewMode = 'canvas', id }: any) {
  const { isSearching, isMatch, color = 'default', _threadAlign = 'right', type = 'text', mood = '' } = data;
  const theme = THEMES[color] || THEMES.default;
  
  // If searching and not a match, fade out
  const searchFade = isSearching && !isMatch ? 'opacity-25 scale-95 pointer-events-none grayscale' : 'opacity-100 scale-100';
  
  // If searching and IS a match, highlight
  const searchHighlight = isSearching && isMatch ? 'ring-2 ring-amber-300 shadow-[0_0_60px_-10px_rgba(252,211,77,0.3)] z-50' : '';

  const isSelectedStyle = selected && (!isSearching || isMatch);

  // Determine chat bubble tail styling based on viewMode and _threadAlign
  let bubbleRadiusClass = 'rounded-3xl rounded-br-md'; // default canvas style
  if (viewMode === 'thread') {
    bubbleRadiusClass = _threadAlign === 'left' ? 'rounded-3xl rounded-tl-sm' : 'rounded-3xl rounded-tr-sm';
  }

  return (
    <>
      {viewMode === 'canvas' && (
        <NodeResizer 
          color={theme.topLine.split('-')[1] ? `#${theme.topLine.split('-')[1]}` : '#FF8FA3'} 
          isVisible={selected} 
          minWidth={200} 
          minHeight={120}
          maxWidth={1200}
          handleClassName="h-3 w-3 bg-white border-2 border-[#FFF5F0] rounded-full"
          lineClassName="border-[#FFB4A2]/30"
        />
      )}
      <div 
        className={`
          relative w-full h-full min-w-[200px] min-h-[120px] ${bubbleRadiusClass} backdrop-blur-3xl transition-all duration-500 group
          bg-white/85
          ${searchFade} ${searchHighlight}
          ${isSelectedStyle
            ? `border ${theme.selectedBorder} ${theme.selectedShadow} ${theme.selectedBg}` 
            : `border ${theme.borderBase} ${theme.bgHover}`
          }
          ${theme.borderHover} ${theme.shadowHover}
        `}
        style={{
          maxWidth: '1200px',
        }}
      >
      {/* Top radiant accent line */}
      <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent ${theme.topLine}/${isSelectedStyle ? '80' : '30'} to-transparent opacity-80 group-hover:opacity-100 group-hover:w-5/6 transition-all duration-500`} />
      
      {/* Mood badge */}
      {mood && (
        <div 
          className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full shadow-md border border-white/80 z-20 text-xs font-semibold whitespace-nowrap"
          style={{ 
            backgroundColor: mood === 'memory' ? '#C7CEEA' : mood === 'hope' ? '#B5EAD7' : mood === 'secret' ? '#E0BBE4' : mood === 'dream' ? '#FFD6A5' : mood === 'ordinary' ? '#D4D4D4' : mood === 'important' ? '#FF8FA3' : '#D4D4D4',
            color: mood === 'memory' || mood === 'secret' ? '#4A2F3C' : mood === 'ordinary' ? '#4A2F3C' : '#FFFFFF'
          }}
        >
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
      )}
      
      {/* Inner ambient glow */}
      <div className={`absolute inset-0 ${bubbleRadiusClass} transition-opacity duration-500 pointer-events-none ${isSelectedStyle ? `bg-gradient-to-br ${theme.innerGlow} to-transparent opacity-100` : `bg-gradient-to-br ${theme.innerGlowUnselected} to-transparent opacity-0 group-hover:opacity-100`}`} />

      {/* One handle per side — each can be source AND target */}
      {viewMode === 'canvas' && <Handle type="source" position={Position.Top} id="top" isConnectable={isConnectable} isConnectableEnd={true} />}
      {viewMode === 'canvas' && <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} isConnectableEnd={true} />}
      
      <div 
        className="p-6 cursor-pointer relative z-10 w-full h-full flex flex-col min-h-0"
        onClick={() => data.onDoubleClick?.()}
        onDoubleClick={() => data.onDoubleClick?.()}
      >
        {data.images && data.images.length > 0 && (
          <div className="mb-4 w-full shrink-0 overflow-hidden rounded-xl border border-[#FFB4A2]/10 shadow-inner relative group/image flex justify-center bg-[#FFF5F0]/50" style={{ minHeight: '60px', maxHeight: '180px' }}>
            <img 
              src={data.images[0].imageUrl} 
              alt={data.images[0].caption || 'Note attachment'} 
              className="w-full h-full object-cover opacity-90 group-hover/image:opacity-100 transition-all duration-700" 
            />
          </div>
        )}

        {data.type === 'quote' ? (
          <>
            <div className="flex-1 flex items-center justify-center px-2">
              <blockquote className="text-[18px] italic text-[#4A2F3C]/80 leading-relaxed text-center font-light border-l-0">
                <span className="text-[#FF8FA3] text-3xl leading-none font-serif">&ldquo;</span>
                {data.content ? (
                  <span dangerouslySetInnerHTML={{ __html: data.content.replace(/<[^>]*>/g, '') }} />
                ) : (
                  <span className="text-[#5A3E4C]/30">Tulis kutipan...</span>
                )}
                <span className="text-[#FF8FA3] text-3xl leading-none font-serif">&rdquo;</span>
              </blockquote>
            </div>
            {data.title && data.title !== 'Untitled Note' && (
              <p className="text-xs text-[#5A3E4C]/40 text-center mt-2 font-medium">— {data.title}</p>
            )}
          </>
        ) : (
          <>
            <h3 className={`font-semibold text-[16px] mb-1.5 shrink-0 tracking-wide transition-colors duration-300 w-full ${selected ? 'text-[#4A2F3C]' : 'text-[#4A2F3C]/85 group-hover:text-[#4A2F3C]'}`}>
              {data.title || 'Untitled Note'}
            </h3>
            <div className="text-[#5A3E4C]/50 text-[13px] leading-relaxed font-light overflow-y-auto custom-scrollbar flex-1 pr-1 w-full">
              {data.content ? (
                <div dangerouslySetInnerHTML={{ __html: data.content }} className="prose prose-p:my-0 prose-img:hidden max-w-none break-words w-full" />
              ) : (
                <p className="italic text-[#5A3E4C]/30">Double click to start writing...</p>
              )}
            </div>
          </>
        )}
      </div>

      {viewMode === 'canvas' && <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} isConnectableEnd={true} />}
      {viewMode === 'canvas' && <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} isConnectableEnd={true} />}
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.selected !== nextProps.selected) return false;
  if (prevProps.viewMode !== nextProps.viewMode) return false;
  if (prevProps.width !== nextProps.width) return false;
  if (prevProps.height !== nextProps.height) return false;

  const prevData = prevProps.data || {};
  const nextData = nextProps.data || {};
  
  if (prevData.title !== nextData.title) return false;
  if (prevData.content !== nextData.content) return false;
  if (prevData.color !== nextData.color) return false;
  if (prevData.mood !== nextData.mood) return false;
  if (prevData.isSearching !== nextData.isSearching) return false;
  if (prevData.isMatch !== nextData.isMatch) return false;
  if (prevData.images?.length !== nextData.images?.length) return false;
  if (prevData.images?.[0]?.id !== nextData.images?.[0]?.id) return false;
  
  return true;
});
