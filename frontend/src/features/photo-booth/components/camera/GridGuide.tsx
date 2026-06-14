"use client";

/**
 * GridGuide - 3x3 grid overlay for camera composition.
 */
export function GridGuide() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border-[0.5px] border-white/[0.035]" />
      ))}
    </div>
  );
}
