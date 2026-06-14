"use client";

import { ImagePlus, Loader2, X } from "lucide-react";

interface AttachmentsSectionProps {
  images: any[];
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (imageId: string) => void;
}

export function AttachmentsSection({
  images,
  uploading,
  onUpload,
  onRemove,
}: AttachmentsSectionProps) {
  return (
    <div className="border-t border-[rgba(47,39,48,0.08)] pt-6">
      <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-3">
        Attachments
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-[12px] overflow-hidden border border-[rgba(47,39,48,0.08)] bg-[#F7F1EA]/50"
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
                className="absolute top-1.5 right-1.5 bg-[#B84A5A] hover:bg-[#9D3F4C] text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center w-full p-4 border border-dashed border-[rgba(47,39,48,0.12)] rounded-[12px] hover:border-[#B84A5A]/40 hover:bg-[#B84A5A]/[0.03] cursor-pointer transition-colors text-[#9A8F95] hover:text-[#B84A5A] font-medium text-sm">
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <ImagePlus className="w-5 h-5 mr-2" /> Upload image
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
