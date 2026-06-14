'use client';

interface Props {
  onCreate: () => void;
}

/**
 * Bottom-area UI: subtle hint pill + new-note FAB.
 * Muted deep-rose palette consistent with the editorial redesign.
 */
export default function CanvasFooter({ onCreate }: Props) {
  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#FFFCF8]/80 backdrop-blur-xl border border-[rgba(47,39,48,0.08)] text-[#6F626A] text-[12px] rounded-full shadow-[0_2px_10px_rgba(47,39,48,0.04)] pointer-events-none font-medium flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C99A45]" />
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[#F3ECE4] border border-[rgba(47,39,48,0.08)] text-[#2F2730] text-[10.5px] font-mono">
          N
        </kbd>
        <span>to add a note</span>
      </div>

      <button
        type="button"
        onClick={onCreate}
        aria-label="New note"
        title="New note (N)"
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#B84A5A] hover:bg-[#A94352] text-white shadow-[0_4px_16px_rgba(184,74,90,0.22)] transition-all hover:-translate-y-px active:translate-y-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#B84A5A]/30 focus:ring-offset-2 focus:ring-offset-[#F7F1EA] z-20"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
