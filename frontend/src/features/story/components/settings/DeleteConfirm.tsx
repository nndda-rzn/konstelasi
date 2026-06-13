"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * DeleteConfirm - Inline confirmation for story deletion.
 */
export function DeleteConfirm({
  isVisible,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  if (!isVisible) {
    return (
      <button
        onClick={onCancel}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
      >
        <Trash2 className="w-4 h-4" />
        Hapus Story
      </button>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
          Yakin hapus story ini?
        </span>
      </div>
      <p className="text-[10px] text-red-500/70 mb-3">
        Semua data story akan dihapus permanen dan tidak bisa dikembalikan.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs text-[#5A3E4C]/60 hover:bg-white dark:hover:bg-[#2a2438] transition-all"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
