'use client';

import { useState } from 'react';
import { X, Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { useCanvas } from '@/context/CanvasContext';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notes: any[];
}

function htmlToMarkdown(html: string): string {
  if (!html) return '';
  let md = html;
  // Headers
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  // Bold, Italic, Strike
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  // Lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?[uo]l[^>]*>/gi, '\n');
  // Blockquote
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  // Paragraphs & breaks
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<hr\s*\/?>/gi, '---\n');
  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');
  // Decode entities
  md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  // Clean up extra newlines
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPanel({ isOpen, onClose, notes }: ExportPanelProps) {
  const { canvases, selectedCanvasId } = useCanvas();
  const [exporting, setExporting] = useState<string | null>(null);

  if (!isOpen) return null;

  const canvasName = canvases.find((c: any) => c.id === selectedCanvasId)?.name || 'Konstelasi';
  const dateStr = new Date().toISOString().split('T')[0];

  const handleExportMarkdown = () => {
    setExporting('markdown');
    try {
      let md = `# ${canvasName}\n\nDiekspor pada: ${dateStr}\n\n---\n\n`;
      notes.forEach((note: any) => {
        md += `## ${note.title || 'Untitled Note'}\n\n`;
        if (note.mood) md += `> Mood: ${note.mood}\n\n`;
        if (note.tags?.length) {
          md += `Tags: ${note.tags.map((t: any) => t.name).join(', ')}\n\n`;
        }
        md += htmlToMarkdown(note.content || '') + '\n\n';
        md += `---\n\n`;
      });
      downloadFile(md, `${canvasName}_${dateStr}.md`, 'text/markdown');
    } finally {
      setExporting(null);
    }
  };

  const handleExportJSON = () => {
    setExporting('json');
    try {
      const exportData = {
        canvas: canvasName,
        exportedAt: new Date().toISOString(),
        totalNotes: notes.length,
        notes: notes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          type: note.type,
          color: note.color,
          mood: note.mood,
          tags: note.tags?.map((t: any) => ({ name: t.name, color: t.color })),
          createdAt: note.createdAt,
        })),
      };
      const json = JSON.stringify(exportData, null, 2);
      downloadFile(json, `${canvasName}_${dateStr}.json`, 'application/json');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="absolute top-4 right-4 w-[320px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#FF8FA3]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Ekspor Catatan</h3>
          <span className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 bg-[#FFB4A2]/10 px-2 py-0.5 rounded-full">
            {notes.length} catatan
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Export Options */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleExportMarkdown}
          disabled={exporting !== null}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 hover:bg-[#FFB4A2]/5 dark:hover:bg-[#FF8FA3]/5 transition-all group"
        >
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500">
            {exporting === 'markdown' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">Markdown (.md)</p>
            <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Format teks dengan heading, list, dan formatting</p>
          </div>
        </button>

        <button
          onClick={handleExportJSON}
          disabled={exporting !== null}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 hover:bg-[#FFB4A2]/5 dark:hover:bg-[#FF8FA3]/5 transition-all group"
        >
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
            {exporting === 'json' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileJson className="w-5 h-5" />}
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">JSON (.json)</p>
            <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Data lengkap termasuk metadata & tags</p>
          </div>
        </button>
      </div>
    </div>
  );
}
