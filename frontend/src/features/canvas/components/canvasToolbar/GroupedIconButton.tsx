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
      className={`relative p-1.5 rounded-[8px] transition-colors ${
        active
          ? "bg-[#FFFCF8] text-[#B84A5A]"
          : "text-[#9A8F95] hover:text-[#2F2730] hover:bg-[#FFFCF8]/70"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#B84A5A] text-white text-[9px] flex items-center justify-center font-semibold ring-2 ring-[#FFFCF8]">
          {badge}
        </span>
      )}
    </button>
  );
}
