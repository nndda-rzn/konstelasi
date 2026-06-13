"use client";

import { ImagePlus, Loader2, X } from "lucide-react";

interface AttachmentsSectionProps {
  images: any[];
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (imageId: string) => void;
}

/**
 * AttachmentsSection - Image grid + upload trigger.
 */
export function AttachmentsSection({
  images,
  uploading,
  onUpload,
  onRemove,
}: AttachmentsSectionProps) {
  return (
    <div className="border-t border-[#FFB4A2]/15 pt-6">
      <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">
        Attachments
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-[#FFB4A2]/15 bg-[#FFF5F0]/50"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Note attachment"}
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-24 opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <button
                onClick={() => onRemove(img.id)}
                className="absolute top-1.5 right-1.5 bg-[#FF6B9D]/80 hover:bg-[#FF6B9D] text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center w-full p-4 border border-dashed border-[#FFB4A2]/20 rounded-xl hover:border-[#FF8FA3]/40 hover:bg-[#FF8FA3]/[0.04] cursor-pointer transition-all text-[#5A3E4C]/30 hover:text-[#FF8FA3] font-medium text-sm">
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <ImagePlus className="w-5 h-5 mr-2" /> Upload Image
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
