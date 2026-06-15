"use client";

import { PhotoBoothMark } from "./PhotoBoothMark";
import { SIDEBAR_GUTTER } from "../constants";

/**
 * SessionShell - Header + main wrapper for in-progress studio steps
 * (LayoutGallery, FormatPicker).
 */
export function SessionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FFF5F7]">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-4 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <div className="flex items-center gap-2.5">
            <PhotoBoothMark size={26} />
            <div className="flex items-baseline gap-1.5">
              <h1 className="text-[14px] font-semibold tracking-tight text-[#3F2A35]">
                Photo Booth
              </h1>
              <span className="text-[9px] font-semibold tracking-[0.22em] text-[#9D7B8A] uppercase">
                · Studio
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className={`mx-auto max-w-[1320px] pr-5 ${SIDEBAR_GUTTER}`}>{children}</main>
    </div>
  );
}
