'use client';

import { memo, useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

const EDGE_COLORS: Record<string, string> = {
  narrative: '#FF6B8B',
  causal: '#FF922B',
  character: '#C074DF',
  thematic: '#7C83FD',
  emotional: '#F03E3E',
  temporal: '#4DABF7',
  default: '#FF6B8B',
};

function StoryEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || '');

  const edgeColor = EDGE_COLORS[data?.color || 'default'] || EDGE_COLORS.default;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
    curvature: 0.35,
  });

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    if (data?.onLabelChange) data.onLabelChange(id, newLabel);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: selected ? 3 : 2,
          filter: selected ? `drop-shadow(0 0 6px ${edgeColor}80)` : `drop-shadow(0 0 2px ${edgeColor}40)`,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto nodrag nopan"
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
        >
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              onBlur={() => { setIsEditing(false); handleLabelChange(label); }}
              onKeyDown={e => { if (e.key === 'Enter') { setIsEditing(false); handleLabelChange(label); } }}
              autoFocus
              className="px-2 py-0.5 text-[9px] rounded-md border border-[#FF8FA3]/30 bg-white dark:bg-[#2a2438] text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/50 w-20"
            />
          ) : (
            <button
              onDoubleClick={() => setIsEditing(true)}
              className={`px-2 py-0.5 rounded-full text-[8px] font-medium transition-all ${label ? 'bg-white/90 dark:bg-[#2a2438]/90 border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 text-[#4A2F3C] dark:text-[#e2d9f3] shadow-sm' : 'bg-transparent'}`}
              style={label ? { borderColor: `${edgeColor}40` } : {}}
            >
              {label || ''}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(StoryEdge);
