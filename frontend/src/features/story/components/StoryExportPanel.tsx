"use client";

import { useState, useRef } from "react";
import { Book, Download, FileJson, FileText, Loader2, X } from "lucide-react";
import { useStoryExport } from "./export/useStoryExport";
import { htmlToText, downloadFile, NODE_TYPE_LABELS } from "./export/exportHelpers";

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
  const exportingRef = useRef<string | null>(null);

  if (!isOpen) return null;

  // HTML export (kept inline due to one-off template complexity)
  const handleExportHtml = () => {
    exportingRef.current = "html";
    try {
      const sortedNodes = [...nodes].sort((a: any, b: any) => {
        const aTime = new Date(a.eventDate || a.createdAt).getTime();
        const bTime = new Date(b.eventDate || b.createdAt).getTime();
        return aTime - bTime;
      });
      const dateStr = new Date().toISOString().split("T")[0];
      const safeTitle = (story.title || "Story").replace(/[^a-zA-Z0-9]/g, "_");

      let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${story.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #FFFAF7; color: #4A2F3C; max-width: 700px; margin: 0 auto; padding: 40px 20px; line-height: 1.8; }
    h1 { font-size: 2em; margin-bottom: 8px; color: #4A2F3C; }
    h2 { font-size: 1.3em; margin: 40px 0 12px; color: #E63946; border-bottom: 1px solid #FFB8C0; padding-bottom: 8px; }
    .subtitle { font-style: italic; color: #5A3E4C; margin-bottom: 16px; }
    .description { color: #5A3E4C; margin-bottom: 24px; }
    .meta { font-size: 0.8em; color: #9B8A91; margin-bottom: 8px; }
    .content { margin-bottom: 32px; }
    .node-type { display: inline-block; font-size: 0.7em; padding: 2px 8px; border-radius: 12px; background: #E63946; color: white; margin-bottom: 8px; }
    .mood { font-size: 0.75em; color: #E63946; font-style: italic; }
    .location { font-size: 0.8em; color: #5A3E4C; margin-bottom: 8px; }
    hr { border: none; border-top: 1px solid #FFB8C0; margin: 32px 0; opacity: 0.3; }
    img { max-width: 100%; border-radius: 12px; margin: 12px 0; }
    .footer { text-align: center; font-size: 0.75em; color: #9B8A91; margin-top: 60px; }
  </style>
</head>
<body>
  <h1>${story.title}</h1>
`;
      if (story.subtitle) html += `  <p class="subtitle">${story.subtitle}</p>\n`;
      if (story.description) html += `  <p class="description">${story.description}</p>\n`;
      html += `  <hr>\n`;

      sortedNodes.forEach((node: any) => {
        const typeLabel = NODE_TYPE_LABELS[node.storyNodeType] || "Scene";
        let metadata: any = {};
        try {
          if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata);
        } catch {}
        html += `  <h2>${node.title || "Untitled"}</h2>\n`;
        html += `  <span class="node-type">${typeLabel}</span>\n`;
        if (node.mood) html += `  <span class="mood"> ${node.mood}</span>\n`;
        if (metadata.sceneLocation) html += `  <p class="location">📍 ${metadata.sceneLocation}</p>\n`;
        if (metadata.sceneTime) html += `  <p class="location">🕐 ${metadata.sceneTime}</p>\n`;
        html += `  <div class="content">${node.content || ""}</div>\n`;
        if (node.images?.length > 0) {
          node.images.forEach((img: any) => {
            html += `  <img src="${img.imageUrl}" alt="${img.caption || ""}">\n`;
          });
        }
        html += `  <hr>\n`;
      });

      html += `  <p class="footer">Diekspor dari Konstelasi pada ${dateStr}</p>\n</body>\n</html>`;
      downloadFile(html, `${safeTitle}_${dateStr}.html`, "text/html");
    } finally {
      exportingRef.current = null;
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
          format="markdown"
          isLoading={exporting === "markdown"}
          icon="markdown"
          title="Markdown (.md)"
          description="Format teks dengan heading & formatting"
          onClick={exportMarkdown}
          disabled={!!exporting}
        />

        <ExportOption
          format="html"
          isLoading={exportingRef.current === "html"}
          icon="html"
          title="HTML (.html)"
          description="Halaman web cantik, bisa di-print ke PDF"
          onClick={handleExportHtml}
          disabled={!!exporting || exportingRef.current === "html"}
        />

        <ExportOption
          format="json"
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

function ExportHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-[#E63946]" />
        <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
          Export Story
        </h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors"
      >
        <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
      </button>
    </div>
  );
}

interface ExportOptionProps {
  format: string;
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

function ExportOption({
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
