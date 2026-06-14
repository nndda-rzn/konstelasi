"use client";

import { Camera, ShieldAlert } from "lucide-react";

interface CameraEmptyStateProps {
  permissionDenied: boolean;
  onRequestPermission: () => void;
}

/**
 * CameraEmptyState - Placeholder shown when the camera is not yet active.
 * Sits inside the camera viewport so the layout stays stable.
 */
export function CameraEmptyState({
  permissionDenied,
  onRequestPermission,
}: CameraEmptyStateProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#0f0b14] p-6 text-center">
      {permissionDenied ? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 text-white/60">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-[13px] font-semibold text-white">
              Akses kamera ditolak
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              Izinkan akses kamera di pengaturan browser untuk mulai sesi foto.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 text-white/45">
            <Camera className="h-5 w-5" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-[13px] font-semibold text-white">
              Pratinjau kamera akan tampil di sini
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              Izinkan akses kamera untuk mulai sesi foto.
            </p>
          </div>
          <button
            onClick={onRequestPermission}
            className="mt-1 rounded-md border border-white/15 bg-white/8 px-3.5 py-1.5 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/14 hover:text-white"
          >
            Aktifkan Kamera
          </button>
        </>
      )}
    </div>
  );
}
