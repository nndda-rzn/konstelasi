'use client';

/**
 * Loading skeleton shown while the canvas is fetching notes.
 * Mimics the shape of a few cards on the infinite canvas so the
 * page doesn't feel "empty" before data arrives.
 */
export default function CanvasSkeleton() {
  return (
    <div
      className="w-full h-screen relative bg-[#FFFAF7] overflow-hidden"
      role="status"
      aria-label="Memuat canvas"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,180,162,0.1),_transparent_60%)] pointer-events-none" />

      {/* Header skeleton */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#FFFAF7]/60 backdrop-blur-3xl border-b border-[#FFB4A2]/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFB4A2]/20 animate-pulse" />
          <div className="w-28 h-4 rounded bg-[#FFB4A2]/15 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-7 rounded-xl bg-[#FFB4A2]/15 animate-pulse" />
          <div className="w-16 h-7 rounded-xl bg-[#FFB4A2]/15 animate-pulse" />
          <div className="w-9 h-7 rounded-xl bg-[#FFB4A2]/15 animate-pulse" />
        </div>
      </div>

      {/* Floating note skeletons */}
      <div className="pt-24 px-12 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { w: 'w-full', h: 'h-40' },
          { w: 'w-5/6', h: 'h-32' },
          { w: 'w-full', h: 'h-48' },
          { w: 'w-4/5', h: 'h-36' },
          { w: 'w-full', h: 'h-44' },
          { w: 'w-5/6', h: 'h-40' },
        ].map((shape, i) => (
          <div
            key={i}
            className={`${shape.w} ${shape.h} rounded-3xl bg-white/80 border border-[#FFB4A2]/15 shadow-md animate-pulse`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="p-5 space-y-2.5">
              <div className="w-3/4 h-3 rounded bg-[#FFB4A2]/20" />
              <div className="w-1/2 h-2.5 rounded bg-[#FFB4A2]/15" />
              <div className="w-full h-2 rounded bg-[#FFB4A2]/15 mt-3" />
              <div className="w-5/6 h-2 rounded bg-[#FFB4A2]/15" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Memuat catatan...</span>
    </div>
  );
}
