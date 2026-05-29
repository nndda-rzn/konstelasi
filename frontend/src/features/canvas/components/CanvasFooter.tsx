'use client';

interface Props {
  onCreate: () => void;
}

/**
 * Bottom-area UI for the canvas view: a floating hint and a FAB
 * that creates a new note at the viewport center. Provides an
 * accessible alternative to right-click for touch/keyboard users.
 */
export default function CanvasFooter({ onCreate }: Props) {
  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-[#FFB4A2]/15 text-[#5A3E4C]/50 text-sm rounded-full shadow-lg pointer-events-none tracking-wide font-light flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8FA3] shadow-[0_0_8px_rgba(255,143,163,0.6)] animate-pulse" />
        Right-click anywhere or press{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-[#FFB4A2]/15 text-[#5A3E4C]/70 text-xs font-mono">N</kbd>{' '}
        to create
      </div>

      <button
        type="button"
        onClick={onCreate}
        aria-label="Buat note baru"
        title="Buat note baru (N)"
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/60 focus:ring-offset-2 focus:ring-offset-[#FFFAF7] z-20"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>
    </>
  );
}
