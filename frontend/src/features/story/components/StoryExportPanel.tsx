"use client";

import { useRef } from "react";
import { useStoryExport } from "./export/useStoryExport";
import { buildHtmlExport } from "./export/buildHtmlExport";
import { ExportHeader } from "./export/ExportHeader";
import { ExportOption } from "./export/ExportOption";

interface StoryExportPanelProps {
  story: any;
  nodes: any[];
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryExportPanel({
  story,
  nodes,
  isOpen,
  onClose,
}: StoryExportPanelProps) {
  const { exporting, exportMarkdown, exportJson } = useStoryExport({ story, nodes });
  const exportingHtmlRef = useRef(false);

  if (!isOpen) return null;

  const handleExportHtml = () => {
    exportingHtmlRef.current = true;
    try {
      buildHtmlExport(story, nodes);
    } finally {
      exportingHtmlRef.current = false;
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      <ExportHeader onClose={onClose} />

      <div className="flex-1 p-5 space-y-3">
        <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mb-4">
          {nodes.length} nodes akan diekspor
        </p>

        <ExportOption
          isLoading={exporting === "markdown"}
          icon="markdown"
          title="Markdown (.md)"
          description="Format teks dengan heading & formatting"
          onClick={exportMarkdown}
          disabled={!!exporting}
        />

        <ExportOption
          isLoading={exportingHtmlRef.current}
          icon="html"
          title="HTML (.html)"
          description="Halaman web cantik, bisa di-print ke PDF"
          onClick={handleExportHtml}
          disabled={!!exporting || exportingHtmlRef.current}
        />

        <ExportOption
          isLoading={exporting === "json"}
          icon="json"
          title="JSON (.json)"
          description="Backup lengkap dengan metadata"
          onClick={exportJson}
          disabled={!!exporting}
        />
      </div>
    </div>
  );
}
