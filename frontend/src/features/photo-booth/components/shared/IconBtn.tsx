"use client";

/**
 * IconBtn - Small square icon button used in camera controls and editor.
 */
export function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6D5561] transition-colors hover:border-[#E63946]/40 hover:text-[#E63946]"
    >
      {children}
    </button>
  );
}
