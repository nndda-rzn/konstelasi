"use client";

import { Edit, Trash2 } from "lucide-react";

interface CanvasItemProps {
  canvas: { id: string; name: string; description?: string | null };
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CanvasItem({
  canvas,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: CanvasItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border border-[#FFB4A2]/10 hover:border-[#FFB4A2]/25 transition-all cursor-pointer group ${
        isSelected ? "bg-[#FFF5F0]/80 shadow-inner" : ""
      }`}
      onClick={onSelect}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF5F0] text-[#FF8FA3] font-medium">
        {canvas.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#4A2F3C] font-medium line-clamp-1">{canvas.name}</p>
        {canvas.description && (
          <p className="text-[#5A3E4C]/40 text-xs line-clamp-1">
            {canvas.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF8FA3] hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="Edit canvas"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-[#5A3E4C]/30 hover:text-[#FF6B9D] hover:bg-[#FF6B9D]/10 rounded-lg transition-all"
          title="Delete canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
