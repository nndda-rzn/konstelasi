"use client";

import { Lock, Maximize2, Minimize2, Trash2, Unlock, X } from "lucide-react";
import { NODE_TYPE_OPTIONS } from "./editorConstants";

interface EditorHeaderProps {
  nodeType: string;
  isLocked: boolean;
  isTimeLocked: boolean;
  focusMode: boolean;
  onToggleLock: () => void;
  onDelete: () => void;
  onToggleFocus: () => void;
  onClose: () => void;
}

/**
 * EditorHeader - Top bar of the story node editor.
 * Shows node type badge + action buttons (lock, focus, delete, close).
 */
export function EditorHeader({
  nodeType,
  isLocked,
  isTimeLocked,
  focusMode,
  onToggleLock,
  onDelete,
  onToggleFocus,
  onClose,
}: EditorHeaderProps) {
  const nodeColor =
    NODE_TYPE_OPTIONS.find((t) => t.value === nodeType)?.color || "#E63946";

  return (
    <div className="flex items-center justify-between px-5 py-4 mt-1 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: nodeColor }}
        />
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: nodeColor }}
        >
          {nodeType.replace("_", " ")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleFocus}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#7C83FD] hover:bg-[#7C83FD]/10 rounded-lg transition-all"
          title={focusMode ? "Exit Focus" : "Focus Mode"}
        >
          {focusMode ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onToggleLock}
          className={`p-2 rounded-lg transition-all ${
            isLocked
              ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
              : "text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB8C0]/10"
          }`}
          title={isLocked ? "Unlock" : "Lock"}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-[#5A3E4C]/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB8C0]/10 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
