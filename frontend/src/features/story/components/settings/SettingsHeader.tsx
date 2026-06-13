"use client";

interface SettingsHeaderProps {
  onClose: () => void;
}

/**
 * SettingsHeader - Top bar with title and close button.
 */
export function SettingsHeader({ onClose }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
        Story Settings
      </h3>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
