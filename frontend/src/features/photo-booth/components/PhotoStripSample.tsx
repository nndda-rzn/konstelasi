"use client";

/**
 * PhotoStripSample - Decorative sample photo strip shown on the
 * welcome screen. Three rounded rects in a soft cream frame.
 */
export function PhotoStripSample({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative inline-block rounded-2xl border border-black/[0.08] bg-[#FAF8F5] p-2 shadow-[0_8px_24px_rgba(60,30,40,0.06)] ${className}`}
    >
      <div className="flex w-32 flex-col gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-20 w-28 rounded-md bg-gradient-to-br from-[#FFE5E8] via-[#FFD8DC] to-[#FFC4C9]"
            style={{
              background:
                i === 0
                  ? "linear-gradient(135deg,#FFE5E8 0%,#FFB8C0 60%,#FF9AAB 100%)"
                  : i === 1
                    ? "linear-gradient(135deg,#F5ECD7 0%,#E8D4B0 50%,#D9B98A 100%)"
                    : "linear-gradient(135deg,#EDE7F6 0%,#D6C8E8 50%,#B9A6D6 100%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
