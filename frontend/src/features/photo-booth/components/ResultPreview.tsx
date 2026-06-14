"use client";

import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { Sticker } from "../photoBooth.types";

interface ResultPreviewProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onStickerDragEnd: (id: string, info: { point: { x: number; y: number } }) => void;
}

/**
 * ResultPreview - The hero of the result/result page.
 * Displays the composed canvas image (the same image that will be
 * downloaded and saved). Renders sticker overlay aligned to the
 * same % system used by the composer.
 */
export function ResultPreview({ previewRef, onStickerDragEnd }: ResultPreviewProps) {
  const composed = usePhotoBoothStore((s) => s.composed);
  const processing = usePhotoBoothStore((s) => s.processing);
  const stickers = usePhotoBoothStore((s) => s.stickers);

  return (
    <div className="relative mx-auto flex w-full max-w-[760px] items-center justify-center">
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#FAF8F5] p-3 shadow-[0_4px_24px_rgba(60,30,40,0.06)]"
        style={{ maxHeight: "calc(100vh - 200px)", minHeight: "380px" }}
      >
        <div
          ref={previewRef}
          className="relative flex h-full min-h-[360px] w-full items-center justify-center"
        >
          {composed?.dataUrl && !processing ? (
            <img
              src={composed.dataUrl}
              alt="Hasil foto"
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="flex aspect-[3/4] w-full max-w-[420px] items-center justify-center">
              <span className="text-[11px] text-[#8C7783]">Menyiapkan hasil…</span>
            </div>
          )}

          {/* Sticker overlay */}
          {stickers.map((s: Sticker) => (
            <motion.div
              key={s.id}
              drag
              dragMomentum={false}
              dragConstraints={previewRef}
              className="absolute cursor-grab active:cursor-grabbing text-3xl select-none touch-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: "translate(-50%,-50%)",
              }}
              onDragEnd={(_, info) => onStickerDragEnd(s.id, info)}
            >
              {s.emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
