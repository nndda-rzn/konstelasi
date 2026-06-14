'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, FolderPlus, Folder, FolderOpen } from 'lucide-react';
import { useCanvas } from '@/context/CanvasContext';

interface CanvasTreeItemProps {
  canvas: any;
  allCanvases: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateSub: (parentId: string) => void;
  depth?: number;
}

function CanvasTreeItem({ canvas, allCanvases, selectedId, onSelect, onCreateSub, depth = 0 }: CanvasTreeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const children = allCanvases.filter((c: any) => c.parent?.id === canvas.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === canvas.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-[8px] cursor-pointer transition-colors group ${
          isSelected
            ? 'bg-[#F3ECE4] text-[#2F2730] border border-[#C99A45]/30'
            : 'hover:bg-[#F3ECE4]/60 text-[#6F626A] border border-transparent'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(canvas.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="p-0.5 rounded hover:bg-[#C99A45]/15"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {isSelected ? (
          <FolderOpen className="w-3.5 h-3.5 shrink-0 text-[#B84A5A]" />
        ) : (
          <Folder className="w-3.5 h-3.5 shrink-0" />
        )}

        <span className={`text-xs truncate flex-1 ${isSelected ? 'font-semibold' : 'font-medium'}`}>
          {canvas.name}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onCreateSub(canvas.id); }}
          className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#C99A45]/15 transition-opacity text-[#6F626A]"
          title="Create sub-canvas"
        >
          <FolderPlus className="w-3 h-3" />
        </button>
      </div>

      {expanded && hasChildren && (
        <div>
          {children.map((child: any) => (
            <CanvasTreeItem
              key={child.id}
              canvas={child}
              allCanvases={allCanvases}
              selectedId={selectedId}
              onSelect={onSelect}
              onCreateSub={onCreateSub}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CanvasHierarchy() {
  const { canvases, selectedCanvasId, setSelectedCanvasId, createCanvas } = useCanvas();
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [parentIdForNew, setParentIdForNew] = useState<string | undefined>(undefined);

  const rootCanvases = canvases.filter((c: any) => !c.parent);

  const handleCreateSub = (parentId: string) => {
    setParentIdForNew(parentId);
    setShowNewInput(true);
    setNewCanvasName('');
  };

  const handleCreateRoot = () => {
    setParentIdForNew(undefined);
    setShowNewInput(true);
    setNewCanvasName('');
  };

  const handleSubmitNew = async () => {
    if (!newCanvasName.trim()) return;
    await createCanvas(newCanvasName.trim(), undefined, parentIdForNew);
    setShowNewInput(false);
    setNewCanvasName('');
    setParentIdForNew(undefined);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[10px] uppercase tracking-wider text-[#9A8F95] font-semibold">
          Canvases
        </span>
        <button
          onClick={handleCreateRoot}
          className="p-1 rounded hover:bg-[#C99A45]/15 text-[#9A8F95] hover:text-[#2F2730] transition-colors"
          title="Create new canvas"
        >
          <FolderPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {rootCanvases.map((canvas: any) => (
        <CanvasTreeItem
          key={canvas.id}
          canvas={canvas}
          allCanvases={canvases}
          selectedId={selectedCanvasId}
          onSelect={setSelectedCanvasId}
          onCreateSub={handleCreateSub}
        />
      ))}

      {showNewInput && (
        <div className="px-2 mt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6F626A] mb-1">
            <Folder className="w-3 h-3" />
            <span>
              {parentIdForNew
                ? `Sub-canvas of ${canvases.find((c: any) => c.id === parentIdForNew)?.name}`
                : 'New canvas'}
            </span>
          </div>
          <input
            type="text"
            value={newCanvasName}
            onChange={(e) => setNewCanvasName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitNew();
              if (e.key === 'Escape') setShowNewInput(false);
            }}
            placeholder="Canvas name..."
            className="w-full px-2.5 py-1.5 text-xs rounded-[8px] border border-[rgba(47,39,48,0.08)] bg-[#FFFCF8] focus:outline-none focus:ring-1 focus:ring-[#C99A45]/40 focus:border-[#C99A45]/50"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
