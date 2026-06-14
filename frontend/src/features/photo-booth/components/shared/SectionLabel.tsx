"use client";

/**
 * SectionLabel - Uppercase section heading used in settings panels.
 */
export function SectionLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7783]">
        {label}
      </p>
      {children}
    </div>
  );
}
