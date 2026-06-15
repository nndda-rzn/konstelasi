"use client";

import { ArrowLeft } from "lucide-react";
import {
  KonvaResultPreview,
  type KonvaResultPreviewHandle,
} from "./KonvaResultPreview";
import { ResultEditorPanel } from "./ResultEditorPanel";
import { AuthPromptModal } from "./AuthPromptModal";
import { SIDEBAR_GUTTER } from "../constants";

export interface ResultScreenProps {
  /**
   * Ref to the KonvaResultPreview. The Result/Edit screen only
   * mounts the Konva stage; the Konva stage itself owns sticker
   * positions (now drawn IN the stage, not as DOM overlay).
   */
  previewRef: React.RefObject<KonvaResultPreviewHandle | null>;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  onLogin: () => void;
}

/**
 * ResultScreen - Post-capture edit view. Two-column layout:
 * Konva preview on the left, ResultEditorPanel on the right.
 */
export function ResultScreen({
  previewRef,
  onRetake,
  onDownload,
  onSave,
  isAuthPromptOpen,
  setAuthPromptOpen,
  onLogin,
}: ResultScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-3 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <button
            onClick={onRetake}
            className="group inline-flex items-center gap-1.5 text-[11.5px] font-normal tracking-wide text-[#8C7783] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Foto ulang
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-[0.18em] uppercase"
              style={{
                background: "rgba(212, 165, 116, 0.15)",
                color: "#9D7B3F",
                border: "1px solid rgba(212, 165, 116, 0.3)",
              }}
            >
              Mode Edit
            </span>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto max-w-[1320px] py-6 pr-5 sm:px-7 ${SIDEBAR_GUTTER}`}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          <div className="flex items-start justify-center">
            <KonvaResultPreview ref={previewRef} displayWidth={720} />
          </div>
          <ResultEditorPanel />
        </div>
      </main>

      <AuthPromptModal
        open={isAuthPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        onLogin={onLogin}
      />
    </div>
  );
}
