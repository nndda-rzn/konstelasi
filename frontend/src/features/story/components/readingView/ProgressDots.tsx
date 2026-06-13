"use client";

interface ProgressDotsProps {
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

/**
 * ProgressDots - Clickable dots for jumping to specific node in reading view.
 */
export function ProgressDots({
  total,
  currentIndex,
  onSelect,
}: ProgressDotsProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-1.5 h-1.5 rounded-full transition-all ${
            i === currentIndex
              ? "bg-[#E63946] w-4"
              : "bg-[#FFB8C0]/30 hover:bg-[#FFB8C0]/50"
          }`}
        />
      ))}
    </div>
  );
}
