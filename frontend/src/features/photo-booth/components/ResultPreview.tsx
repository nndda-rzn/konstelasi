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
 *
 * Displays the SINGLE composed canvas image (the exact same image that
 * will be downloaded and saved). The image is shown in full using
 * `object-contain` so no additional CSS crop happens here.
 *
 * The container's aspect-ratio is driven by the composed image's natural
 * dimensions, NOT a hardcoded ratio, so the image always appears at its
 * true proportions.
 */
export function ResultPreview({ previewRef, onStickerDragEnd }: ResultPreviewProps) {
  const composed = usePhotoBoothStore((s) => s.composed);
  const processing = usePhotoBoothStore((s) => s.processing);
  const stickers = usePhotoBoothStore((s) => s.stickers);

  // Use the composed image's natural aspect ratio for the container.
  // This ensures the image is shown without any extra crop.
  const aspectRatio =
    composed && composed.width && composed.height
      ? composed.width / composed.height
      : 1; // 1:1 fallback while loading

  return (
    <div
      className="relative mx-auto flex w-full max-w-[760px] items-center justify-center"
      data-result-preview
    >
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#FAF8F5] p-3 shadow-[0_4px_24px_rgba(60,30,40,0.06)]"
      >
        <div
          ref={previewRef}
          className="relative flex w-full items-center justify-center"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          {composed?.dataUrl && !processing ? (
            <img
              src={composed.dataUrl}
              alt="Hasil foto"
              className="h-full w-full object-contain"
              draggable={false}
            />
          ) : (
            <div
              className="flex w-full items-center justify-center"
              style={{ aspectRatio: `${aspectRatio}` }}
            >
              <span className="text-[11px] text-[#8C7783]">Menyiapkan hasil…</span>
            </div>
          )}

          {/* Sticker overlay aligned to the same % system as the composer */}
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
