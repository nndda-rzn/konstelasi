"use client";

import type { MediaItem } from "../hooks/useGallery";

interface CardOverlayProps {
  image: MediaItem;
}

export function CardOverlay({ image }: CardOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <p className="truncate text-xs font-semibold text-white/95">
        {image.note?.title || "Untitled"}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {image.note?.story && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
            {image.note.story.title}
          </span>
        )}
        {image.note?.canvas && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
            {image.note.canvas.name}
          </span>
        )}
      </div>
    </div>
  );
}
