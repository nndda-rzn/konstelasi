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
 * PhotoPreview - Renders the processed final photo with draggable sticker overlay.
 */
export function PhotoPreview({ previewRef, onStickerDragEnd }: PhotoPreviewProps) {
  const finalPhoto = usePhotoboothStore((s) => s.finalPhoto);
  const processing = usePhotoboothStore((s) => s.processing);
  const stickers = usePhotoboothStore((s) => s.stickers);

  return (
    <div
      ref={previewRef}
      className="relative mx-auto w-full max-w-sm overflow-auto rounded-2xl shadow-[0_16px_48px_rgba(84,45,55,0.12)]"
      style={{ maxHeight: "72vh" }}
    >
      {finalPhoto && !processing ? (
        <img
          src={finalPhoto}
          alt="result"
          loading="lazy"
          decoding="async"
          className="w-full"
        />
      ) : (
        <div className="flex aspect-[3/4] items-center justify-center bg-[#FFF5F7]">
          <Loader2 className="h-8 w-8 animate-spin text-[#E63946]/50" />
        </div>
      )}

      {/* Sticker overlay */}
      {stickers.map((s: StickerItem) => (
        <motion.div
          key={s.id}
          drag
          dragMomentum={false}
          dragConstraints={previewRef}
          className="absolute cursor-grab active:cursor-grabbing text-3xl select-none"
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
  );
}
