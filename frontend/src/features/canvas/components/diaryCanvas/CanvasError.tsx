"use client";

interface CanvasErrorProps {
  message: string;
  onRetry: () => void;
}

/**
 * CanvasError - Error state shown when initial query fails.
 * Pure presentational: extracted from DiaryCanvas to reduce line count.
 */
export function CanvasError({ message, onRetry }: CanvasErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FFFAF7] space-y-4">
      <div className="text-[#FF6B9D] font-medium text-lg">
        Error loading canvas
      </div>
      <p className="text-[#5A3E4C]/50 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50"
      >
        Retry
      </button>
    </div>
  );
}
