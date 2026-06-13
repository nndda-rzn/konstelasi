"use client";

import { Image as ImageIcon } from "lucide-react";

export function GalleryLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E63946] border-t-transparent" />
    </div>
  );
}

export function GalleryEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6B8A2]/15">
        <ImageIcon className="h-7 w-7 text-[#9D0208]/40" />
      </div>
      <p className="text-sm font-semibold text-[#3F2A35]/60">Belum ada media</p>
      <p className="mt-1 text-xs text-[#5A3E4C]/40">
        Upload gambar ke note atau story untuk melihatnya di sini.
      </p>
    </div>
  );
}
