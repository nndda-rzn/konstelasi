"use client";

interface GroupedIconButtonProps {
  active: boolean;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

/**
 * GroupedIconButton - Icon-only button inside a grouped container.
 * Active state uses pink tint; optional badge for counters.
 */
export function GroupedIconButton({
  active,
  onClick,
  title,
  ariaLabel,
  children,
  badge,
  disabled,
}: GroupedIconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      className={`relative p-1.5 rounded-lg transition-all ${
        active
          ? "bg-white text-[#FF8FA3] shadow-sm"
          : "text-[#5A3E4C]/50 hover:text-[#5A3E4C] hover:bg-white/60"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FF8FA3] text-white text-[9px] flex items-center justify-center font-bold ring-2 ring-[#FFFAF7]">
          {badge}
        </span>
      )}
    </button>
  );
}
