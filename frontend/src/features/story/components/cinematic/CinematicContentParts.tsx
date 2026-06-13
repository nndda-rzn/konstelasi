"use client";

interface CinematicContentHeaderProps {
  nodeType: string | null;
  nodeTypeLabel: string;
}

/**
 * CinematicContentHeader - Type badge at top of cinematic content.
 */
export function CinematicContentHeader({
  nodeType,
  nodeTypeLabel,
}: CinematicContentHeaderProps) {
  if (!nodeType) return null;
  return (
    <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-semibold text-white/60 mb-3">
      {nodeTypeLabel}
    </span>
  );
}

interface CinematicContentBodyProps {
  title: string;
  stripped: string;
  mood?: string | null;
}

/**
 * CinematicContentBody - Title + preview text + mood badge.
 */
export function CinematicContentBody({
  title,
  stripped,
  mood,
}: CinematicContentBodyProps) {
  return (
    <>
      <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        {title || "Untitled"}
      </h2>
      {stripped && (
        <p className="text-sm md:text-base text-white/85 leading-relaxed line-clamp-4 max-w-2xl">
          {stripped.length > 280 ? stripped.slice(0, 280) + "..." : stripped}
        </p>
      )}
      {mood && (
        <span className="inline-block mt-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-medium text-white/80 capitalize">
          {mood}
        </span>
      )}
    </>
  );
}
