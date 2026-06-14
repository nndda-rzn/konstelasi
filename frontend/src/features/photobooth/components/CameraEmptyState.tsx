"use client";

import { Camera, ShieldAlert } from "lucide-react";

interface CameraEmptyStateProps {
  permissionDenied: boolean;
  onRequestPermission: () => void;
}

/**
 * CameraEmptyState - Elegant placeholder shown while the camera is not yet
 * active (pre-permission, denied, or no device). Sits inside the camera
 * viewport so the layout stays stable.
 */
export function CameraEmptyState({
  permissionDenied,
  onRequestPermission,
}: CameraEmptyStateProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#1a1625] p-6 text-center">
      <div className="absolute -inset-8 rounded-full bg-[#FFB8C0]/10 blur-2xl pointer-events-none" />

      {permissionDenied ? (
        <>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E63946]/10 text-[#E63946]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="relative max-w-xs">
            <h3 className="text-sm font-bold text-white">Akses kamera ditolak</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
              Izinkan akses kamera di pengaturan browser untuk mulai sesi foto.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40">
            <Camera className="h-6 w-6" />
          </div>
          <div className="relative max-w-xs">
            <h3 className="text-sm font-bold text-white">
              Pratinjau kamera akan tampil di sini
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
              Izinkan akses kamera untuk mulai sesi foto.
            </p>
          </div>
          <button
            onClick={onRequestPermission}
            className="relative mt-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md transition-colors hover:bg-white/12 hover:text-white"
          >
            Aktifkan Kamera
          </button>
        </>
      )}
    </div>
  );
}
