import React, { useState, useRef, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

const EDGE_THEMES: Record<string, { stroke: string, glow: string, labelHoverText: string, labelHoverBorder: string }> = {
  default: { stroke: 'rgba(255,255,255,0.3)', glow: 'rgba(255,255,255,0.2)', labelHoverText: 'group-hover:text-white', labelHoverBorder: 'group-hover:border-white/30' },
  red: { stroke: 'rgba(239,68,68,0.7)', glow: 'rgba(239,68,68,0.4)', labelHoverText: 'group-hover:text-red-300', labelHoverBorder: 'group-hover:border-red-500/50' },
  amber: { stroke: 'rgba(245,158,11,0.7)', glow: 'rgba(245,158,11,0.4)', labelHoverText: 'group-hover:text-amber-300', labelHoverBorder: 'group-hover:border-amber-500/50' },
  emerald: { stroke: 'rgba(16,185,129,0.7)', glow: 'rgba(16,185,129,0.4)', labelHoverText: 'group-hover:text-emerald-300', labelHoverBorder: 'group-hover:border-emerald-500/50' },
  blue: { stroke: 'rgba(59,130,246,0.7)', glow: 'rgba(59,130,246,0.4)', labelHoverText: 'group-hover:text-blue-300', labelHoverBorder: 'group-hover:border-blue-500/50' },
  indigo: { stroke: 'rgba(99,102,241,0.7)', glow: 'rgba(99,102,241,0.4)', labelHoverText: 'group-hover:text-indigo-300', labelHoverBorder: 'group-hover:border-indigo-500/50' },
  purple: { stroke: 'rgba(168,85,247,0.7)', glow: 'rgba(168,85,247,0.4)', labelHoverText: 'group-hover:text-purple-300', labelHoverBorder: 'group-hover:border-purple-500/50' },
  pink: { stroke: 'rgba(236,72,153,0.7)', glow: 'rgba(236,72,153,0.4)', labelHoverText: 'group-hover:text-pink-300', labelHoverBorder: 'group-hover:border-pink-500/50' },
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
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
              className="bg-[#13131c]/90 border border-red-500/50 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-2xl focus:outline-none w-32 text-center"
              placeholder="Edge label..."
            />
          ) : (
            <div 
              className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all cursor-pointer backdrop-blur-md border ${
                label 
                ? `bg-[#181824]/90 text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:bg-[#1a1a26] ${theme.labelHoverBorder} ${theme.labelHoverText}` 
                : 'bg-transparent text-transparent border-transparent group-hover:bg-[#13131c]/70 group-hover:text-white/40 group-hover:border-white/10'
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
