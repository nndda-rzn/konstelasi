"use client";

interface CinematicHeaderTitleProps {
  storyTitle: string;
  currentIndex: number;
  total: number;
}

/**
 * CinematicHeaderTitle - Story title + progress counter (left side of header).
 */
export function CinematicHeaderTitle({
  storyTitle,
  currentIndex,
  total,
}: CinematicHeaderTitleProps) {
  return (
    <div className="text-white/80">
      <p className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-70">
        {storyTitle}
      </p>
      <p className="text-[11px] mt-1 font-medium">
        {currentIndex + 1} / {total}
      </p>
    </div>
  );
}

interface CinematicHeaderActionsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onClose: () => void;
}

/**
 * CinematicHeaderActions - Pause + close buttons (right side of header).
 */
export function CinematicHeaderActions({
  isPaused,
  onTogglePause,
  onClose,
}: CinematicHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onTogglePause}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors backdrop-blur-md"
        title={isPaused ? "Lanjutkan (P)" : "Jeda (P)"}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
      <button
        onClick={onClose}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors backdrop-blur-md"
        title="Tutup (Esc)"
      >
        <XIcon />
      </button>
    </div>
  );
}

// Inline icon mini-components to avoid extra imports
function PlayIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
