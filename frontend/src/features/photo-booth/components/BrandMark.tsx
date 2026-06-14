"use client";

/**
 * BrandMark - Small "Constella" signature used in the welcome
 * screen sample, the photo-strip sample, and the result footer.
 */
export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "text-[10px]"
      : size === "lg"
        ? "text-base"
        : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-[0.18em] uppercase text-[#5A3E4C] ${sizeClass} ${className}`}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-[#E63946]"
        aria-hidden
      />
      Constella
    </span>
  );
}
