"use client";

import { ExternalLink, X } from "lucide-react";
import type { MediaItem } from "../hooks/useGallery";

interface LightboxInfoProps {
  image: MediaItem;
  onNavigate: (note: MediaItem["note"]) => void;
  onClose: () => void;
}

export function LightboxInfo({
  image,
  onNavigate,
  onClose,
}: LightboxInfoProps) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white/90">
          {image.note?.title || "Untitled"}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-white/50">
          {image.note?.story && <span>{image.note.story.title}</span>}
          {image.note?.canvas && <span>{image.note.canvas.name}</span>}
          <span>
            {new Date(image.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate(image.note)}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Go to note
        </button>
        <button
          onClick={onClose}
          className="rounded-xl bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
