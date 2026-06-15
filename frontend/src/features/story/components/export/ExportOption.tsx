"use client";

import { Book, FileJson, FileText, Loader2 } from "lucide-react";

interface ExportOptionProps {
  isLoading: boolean;
  icon: "markdown" | "html" | "json";
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

const ICON_BG: Record<ExportOptionProps["icon"], string> = {
  markdown: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500",
  html: "bg-purple-50 dark:bg-purple-900/30 text-purple-500",
  json: "bg-blue-50 dark:bg-blue-900/30 text-blue-500",
};

/**
 * ExportOption - A single export format button.
 */
export function ExportOption({
  isLoading,
  icon,
  title,
  description,
  onClick,
  disabled,
}: ExportOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:bg-[#FFB8C0]/5 dark:hover:bg-[#E63946]/5 transition-all disabled:opacity-50"
    >
      <div className={`p-2 rounded-lg ${ICON_BG[icon]}`}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : icon === "markdown" ? (
          <FileText className="w-5 h-5" />
        ) : icon === "html" ? (
          <Book className="w-5 h-5" />
        ) : (
          <FileJson className="w-5 h-5" />
        )}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
          {title}
        </p>
        <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          {description}
        </p>
      </div>
    </button>
  );
}
