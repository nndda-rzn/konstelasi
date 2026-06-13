"use client";

import { ImagePlus, Loader2, Lock, X } from "lucide-react";

interface MediaItem {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface MediaGalleryProps {
  images: MediaItem[];
  uploading: boolean;
  isSealed: boolean;
  isTimeLocked: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

/**
 * MediaGallery - Image grid + upload trigger.
 * Shows lock notice when content is sealed.
 */
export function MediaGallery({
  images,
  uploading,
  isSealed,
  isTimeLocked,
  onUpload,
  onDelete,
}: MediaGalleryProps) {
  if (isSealed) {
    return (
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
          Media
        </label>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1625]/5 dark:bg-white/5 border border-[#FFB8C0]/15 dark:border-[#E63946]/10">
          <Lock className="w-4 h-4 text-[#E63946]/70" />
          <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">
            {isTimeLocked
              ? "Gambar ikut tersegel sampai Time Capsule dibuka."
              : "Media perlu dimuat ulang setelah Time Capsule dibuka."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
        Media
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || ""}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onDelete(img.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-[#FFB8C0]/30 hover:border-[#FF6B8B]/50 hover:bg-[#FF6B8B]/5 cursor-pointer transition-all">
        {uploading ? (
          <Loader2 className="w-4 h-4 text-[#FF6B8B] animate-spin" />
        ) : (
          <ImagePlus className="w-4 h-4 text-[#FF6B8B]/60" />
        )}
        <span className="text-[10px] text-[#5A3E4C]/40">
          {uploading ? "Mengunggah..." : "Tambah Gambar"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
