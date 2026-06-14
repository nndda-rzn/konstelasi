"use client";

import { Download, Loader2, RotateCcw, Save } from "lucide-react";
import { usePhotoboothStore } from "../../store/usePhotoboothStore";

interface EditorActionsProps {
  onSave: () => void;
  onDownload: () => void;
  onRetake: () => void;
}

/**
 * EditorActions - Primary save + secondary download/retake.
 * Proportional sizing, no oversized primary.
 */
export function EditorActions({
  onSave,
  onDownload,
  onRetake,
}: EditorActionsProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const processing = usePhotoboothStore((s) => s.processing);

  const isSaving = stage === "saving";

  return (
    <div className="space-y-2">
      <button
        onClick={onSave}
        disabled={isSaving || processing}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded bg-[#E63946] text-[13px] font-semibold text-white transition-colors hover:bg-[#D62828] disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? "Menyimpan..." : "Simpan ke Kanvas"}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onDownload}
          disabled={processing}
          className="flex h-9 items-center justify-center gap-1.5 rounded border border-black/10 bg-white text-[12px] font-medium text-[#3F2A35] transition-colors hover:bg-[#FAFAFA] disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Unduh
        </button>
        <button
          onClick={onRetake}
          className="flex h-9 items-center justify-center gap-1.5 rounded border border-black/10 bg-white text-[12px] font-medium text-[#3F2A35] transition-colors hover:bg-[#FAFAFA]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Ulangi
        </button>
      </div>
    </div>
  );
}
