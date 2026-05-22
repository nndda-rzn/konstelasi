import React, { useState, useRef, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';

const EDGE_THEMES: Record<string, { stroke: string, glow: string, labelHoverText: string, labelHoverBorder: string }> = {
  default: { stroke: 'rgba(255,180,162,0.5)', glow: 'rgba(255,180,162,0.3)', labelHoverText: 'group-hover:text-[#5A3E4C]', labelHoverBorder: 'group-hover:border-[#FFB4A2]/50' },
  red: { stroke: 'rgba(255,143,163,0.7)', glow: 'rgba(255,143,163,0.4)', labelHoverText: 'group-hover:text-[#FF8FA3]', labelHoverBorder: 'group-hover:border-[#FF8FA3]/50' },
  amber: { stroke: 'rgba(251,191,36,0.7)', glow: 'rgba(251,191,36,0.4)', labelHoverText: 'group-hover:text-amber-600', labelHoverBorder: 'group-hover:border-amber-400/50' },
  emerald: { stroke: 'rgba(52,211,153,0.7)', glow: 'rgba(52,211,153,0.4)', labelHoverText: 'group-hover:text-emerald-600', labelHoverBorder: 'group-hover:border-emerald-400/50' },
  blue: { stroke: 'rgba(96,165,250,0.7)', glow: 'rgba(96,165,250,0.4)', labelHoverText: 'group-hover:text-blue-600', labelHoverBorder: 'group-hover:border-blue-400/50' },
  indigo: { stroke: 'rgba(129,140,248,0.7)', glow: 'rgba(129,140,248,0.4)', labelHoverText: 'group-hover:text-indigo-600', labelHoverBorder: 'group-hover:border-indigo-400/50' },
  purple: { stroke: 'rgba(192,132,252,0.7)', glow: 'rgba(192,132,252,0.4)', labelHoverText: 'group-hover:text-purple-600', labelHoverBorder: 'group-hover:border-purple-400/50' },
  pink: { stroke: 'rgba(244,114,182,0.7)', glow: 'rgba(244,114,182,0.4)', labelHoverText: 'group-hover:text-pink-600', labelHoverBorder: 'group-hover:border-pink-400/50' },
};

export default function SemanticEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: any) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 24,
  });

  const { label = '', color = 'default', onLabelChange } = data || {};
  const theme = EDGE_THEMES[color] || EDGE_THEMES.default;
  const edgeStyle = { ...style, stroke: theme.stroke, strokeWidth: 3, filter: `drop-shadow(0 0 12px ${theme.glow})` };

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(label);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    if (editValue !== label && onLabelChange) {
      onLabelChange(id, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(label);
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center justify-center z-50 group"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="bg-white/95 border border-[#FF8FA3]/50 text-[#4A2F3C] text-[11px] px-2.5 py-1 rounded-lg shadow-2xl focus:outline-none w-32 text-center"
              placeholder="Edge label..."
            />
          ) : (
            <div 
              className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all cursor-pointer backdrop-blur-md border ${
                label 
                ? `bg-white/90 text-[#5A3E4C] border-[#FFB4A2]/20 shadow-[0_4px_12px_rgba(255,180,162,0.2)] group-hover:bg-white ${theme.labelHoverBorder} ${theme.labelHoverText}` 
                : 'bg-transparent text-transparent border-transparent group-hover:bg-white/70 group-hover:text-[#5A3E4C]/40 group-hover:border-[#FFB4A2]/20'
              }`}
            >
              {label || 'Label Edge'}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
