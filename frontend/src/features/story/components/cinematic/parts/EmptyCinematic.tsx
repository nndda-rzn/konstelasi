"use client";

interface EmptyCinematicProps {
  onClose: () => void;
}

/**
 * EmptyCinematic - Fallback when there are no playable story nodes.
 */
export function EmptyCinematic({ onClose }: EmptyCinematicProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <div className="text-center text-white/70">
        <p className="text-sm">Belum ada node yang bisa diputar.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
