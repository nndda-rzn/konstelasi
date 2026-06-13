"use client";

import { Download, Loader2, RotateCcw, Save } from "lucide-react";
import { usePhotoboothStore } from "../../store/usePhotoboothStore";

interface EditorActionsProps {
  onSave: () => void;
  onDownload: () => void;
  onRetake: () => void;
}

/**
 * EditorActions - Save/Download/Retake button cluster.
 */
export function EditorActions({
  onSave,
  onDownload,
  onRetake,
}: EditorActionsProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const processing = usePhotoboothStore((s) => s.processing);

  return (
    <div className="mt-auto flex flex-col gap-2">
      <button
        onClick={onSave}
        disabled={stage === "saving" || processing}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.22)] disabled:opacity-60"
      >
        {stage === "saving" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {stage === "saving" ? "Menyimpan..." : "Simpan ke Kanvas"}
      </button>
      <div className="flex gap-2">
        <button
          onClick={onDownload}
          disabled={processing}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Unduh
        </button>
        <button
          onClick={onRetake}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80"
        >
          <RotateCcw className="h-4 w-4" />
          Ulangi
        </button>
      </div>
    </div>
  );
}
