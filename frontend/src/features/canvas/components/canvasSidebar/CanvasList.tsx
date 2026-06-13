"use client";

import { CanvasItem } from "./CanvasItem";

interface CanvasListProps {
  canvases: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (canvas: any) => void;
  onDelete: (id: string, name: string) => void;
  onCreateFirst: () => void;
}

export function CanvasList({
  canvases,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onCreateFirst,
}: CanvasListProps) {
  if (canvases.length === 0) {
    return (
      <div className="text-center py-8 text-[#5A3E4C]/40">
        <p>No canvases yet</p>
        <button
          onClick={onCreateFirst}
          className="mt-3 px-4 py-2 bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-lg hover:bg-[#FFB4A2]/10 transition-all text-sm font-medium"
        >
          Create Your First Canvas
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {canvases.map((canvas) => (
        <CanvasItem
          key={canvas.id}
          canvas={canvas}
          isSelected={selectedId === canvas.id}
          onSelect={() => onSelect(canvas.id)}
          onEdit={() => onEdit(canvas)}
          onDelete={() => onDelete(canvas.id, canvas.name)}
        />
      ))}
    </div>
  );
}
