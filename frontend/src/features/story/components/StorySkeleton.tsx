'use client';

/**
 * Loading skeleton for the story dashboard grid.
 * Mimics the story card layout while data is loading.
 */
export default function StorySkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-label="Memuat daftar story"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#2a2438]/80 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFB8C0]/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FFB8C0]/15" />
              <div className="w-12 h-3 rounded-full bg-[#FFB8C0]/15" />
            </div>
          </div>
          <div className="w-3/4 h-3.5 rounded bg-[#FFB8C0]/20 mb-2" />
          <div className="w-1/2 h-2.5 rounded bg-[#FFB8C0]/15 mb-3" />
          <div className="w-1/3 h-2 rounded bg-[#FFB8C0]/15" />
        </div>
      ))}
      <span className="sr-only">Memuat story...</span>
    </div>
  );
}
