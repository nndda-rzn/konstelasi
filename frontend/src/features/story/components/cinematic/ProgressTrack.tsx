"use client";

interface ProgressBarProps {
  progress: number;
}

/**
 * ProgressBar - Single horizontal progress indicator.
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
  );
}

interface ProgressTrackProps {
  total: number;
  currentIndex: number;
  progress: number;
}

/**
 * ProgressTrack - Row of progress bars (one per scene).
 */
export function ProgressTrack({
  total,
  currentIndex,
  progress,
}: ProgressTrackProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const fillPercent =
          i < currentIndex ? 100 : i === currentIndex ? progress : 0;
        return (
          <div
            key={i}
            className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden"
          >
            <ProgressBar progress={fillPercent} />
          </div>
        );
      })}
    </div>
  );
}
