"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import type { StickerItem } from "../constants";

interface PhotoPreviewProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onStickerDragEnd: (id: string, info: { point: { x: number; y: number } }) => void;
}

/**
 * PhotoPreview - The hero of the output page.
 * Paper-like cream container, sized to be the largest element on screen.
 * Sticker drag overlay aligns to the same % system used in the canvas render.
 */
export function PhotoPreview({ previewRef, onStickerDragEnd }: PhotoPreviewProps) {
  const finalPhoto = usePhotoboothStore((s) => s.finalPhoto);
  const processing = usePhotoboothStore((s) => s.processing);
  const stickers = usePhotoboothStore((s) => s.stickers);

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
          {finalPhoto && !processing ? (
            <img
              src={finalPhoto}
              alt="Hasil foto"
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="flex aspect-[3/4] w-full max-w-[420px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#E63946]/50" />
            </div>
          )}

          {/* Sticker overlay — position is % of preview container */}
          {stickers.map((s: StickerItem) => (
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
              {s. emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
