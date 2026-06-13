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
        className={`p-1.5 rounded-lg transition-all ${
          canUndo
            ? "text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:bg-[#FFB4A2]/15"
            : "text-[#5A3E4C]/15 cursor-not-allowed"
        }`}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
        className={`p-1.5 rounded-lg transition-all ${
          canRedo
            ? "text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:bg-[#FFB4A2]/15"
            : "text-[#5A3E4C]/15 cursor-not-allowed"
        }`}
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
