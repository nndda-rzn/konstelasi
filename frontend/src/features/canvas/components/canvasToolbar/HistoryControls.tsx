"use client";

import { Redo2, Undo2 } from "lucide-react";

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * HistoryControls - Undo/Redo button pair.
 */
export function HistoryControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HistoryControlsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
        className={`p-1.5 rounded-[8px] transition-colors ${
          canUndo
            ? "text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#F3ECE4]"
            : "text-[#9A8F95]/30 cursor-not-allowed"
        }`}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
        className={`p-1.5 rounded-[8px] transition-colors ${
          canRedo
            ? "text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#F3ECE4]"
            : "text-[#9A8F95]/30 cursor-not-allowed"
        }`}
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
