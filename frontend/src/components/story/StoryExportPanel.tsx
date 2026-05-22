'use client';

import { useState } from 'react';
import { X, Download, FileText, FileJson, Book, Loader2 } from 'lucide-react';

interface StoryExportPanelProps {
  story: any;
  nodes: any[];
  isOpen: boolean;
  onClose: () => void;
}

function htmlToText(html: string): string {
  if (!html) return '';
  let text = html;
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n$1\n');
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
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

const NODE_TYPE_LABELS: Record<string, string> = {
  scene: 'Scene', memory: 'Memory', character: 'Character', dialogue: 'Dialogue',
  moment: 'Moment', feeling: 'Feeling', timeline_event: 'Event', media: 'Media',
  quote: 'Quote', reflection: 'Reflection',
};

export default function StoryExportPanel({ story, nodes, isOpen, onClose }: StoryExportPanelProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  if (!isOpen) return null;

  const sortedNodes = [...nodes].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const dateStr = new Date().toISOString().split('T')[0];
  const safeTitle = (story.title || 'Story').replace(/[^a-zA-Z0-9]/g, '_');

  const handleExportMarkdown = () => {
    setExporting('markdown');
    try {
      let md = `# ${story.title}\n\n`;
      if (story.subtitle) md += `*${story.subtitle}*\n\n`;
      if (story.description) md += `${story.description}\n\n`;
      md += `---\n\n`;

      sortedNodes.forEach((node: any, i: number) => {
        const typeLabel = NODE_TYPE_LABELS[node.storyNodeType] || 'Scene';
        md += `## ${i + 1}. ${node.title || 'Untitled'}\n\n`;
        md += `> **${typeLabel}**`;
        if (node.mood) md += ` | Mood: ${node.mood}`;
        md += `\n\n`;

        let metadata: any = {};
        try { if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata); } catch {}
        if (metadata.sceneLocation) md += `📍 ${metadata.sceneLocation}\n`;
        if (metadata.sceneTime) md += `🕐 ${metadata.sceneTime}\n`;
        if (metadata.sceneLocation || metadata.sceneTime) md += `\n`;

        md += htmlToText(node.content || '') + '\n\n';
        md += `---\n\n`;
      });

      md += `\n*Diekspor dari Konstelasi pada ${dateStr}*\n`;
      downloadFile(md, `${safeTitle}_${dateStr}.md`, 'text/markdown');
    } finally {
      setExporting(null);
    }
  };

  const handleExportJSON = () => {
    setExporting('json');
    try {
      const exportData = {
        story: {
          title: story.title,
          subtitle: story.subtitle,
          description: story.description,
          storyType: story.storyType,
          status: story.status,
          theme: story.theme,
          authorNote: story.authorNote,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
        },
        nodes: sortedNodes.map((node: any) => ({
          id: node.id,
          title: node.title,
          content: node.content,
          storyNodeType: node.storyNodeType,
          storyMetadata: node.storyMetadata,
          mood: node.mood,
          color: node.color,
          images: node.images?.map((img: any) => ({ url: img.imageUrl, caption: img.caption })),
          createdAt: node.createdAt,
        })),
        exportedAt: new Date().toISOString(),
        totalNodes: sortedNodes.length,
      };
      const json = JSON.stringify(exportData, null, 2);
      downloadFile(json, `${safeTitle}_${dateStr}.json`, 'application/json');
    } finally {
      setExporting(null);
    }
  };

  const handleExportHTML = () => {
    setExporting('html');
    try {
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
  <h1>${story.title}</h1>\n`;
      if (story.subtitle) html += `  <p class="subtitle">${story.subtitle}</p>\n`;
      if (story.description) html += `  <p class="description">${story.description}</p>\n`;
      html += `  <hr>\n`;

      sortedNodes.forEach((node: any, i: number) => {
        const typeLabel = NODE_TYPE_LABELS[node.storyNodeType] || 'Scene';
        let metadata: any = {};
        try { if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata); } catch {}

        html += `  <h2>${node.title || 'Untitled'}</h2>\n`;
        html += `  <span class="node-type">${typeLabel}</span>\n`;
        if (node.mood) html += `  <span class="mood"> ${node.mood}</span>\n`;
        if (metadata.sceneLocation) html += `  <p class="location">📍 ${metadata.sceneLocation}</p>\n`;
        if (metadata.sceneTime) html += `  <p class="location">🕐 ${metadata.sceneTime}</p>\n`;
        html += `  <div class="content">${node.content || ''}</div>\n`;
        if (node.images?.length > 0) {
          node.images.forEach((img: any) => { html += `  <img src="${img.imageUrl}" alt="${img.caption || ''}">\n`; });
        }
        html += `  <hr>\n`;
      });

      html += `  <p class="footer">Diekspor dari Konstelasi pada ${dateStr}</p>\n</body>\n</html>`;
      downloadFile(html, `${safeTitle}_${dateStr}.html`, 'text/html');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#E63946]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Export Story</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
          <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
        </button>
      </div>

      {/* Export Options */}
      <div className="flex-1 p-5 space-y-3">
        <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mb-4">{sortedNodes.length} nodes akan diekspor</p>

        <button onClick={handleExportMarkdown} disabled={exporting !== null}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:bg-[#FFB8C0]/5 dark:hover:bg-[#E63946]/5 transition-all">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500">
            {exporting === 'markdown' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">Markdown (.md)</p>
            <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Format teks dengan heading & formatting</p>
          </div>
        </button>

        <button onClick={handleExportHTML} disabled={exporting !== null}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:bg-[#FFB8C0]/5 dark:hover:bg-[#E63946]/5 transition-all">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500">
            {exporting === 'html' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Book className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">HTML (.html)</p>
            <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Halaman web cantik, bisa di-print ke PDF</p>
          </div>
        </button>

        <button onClick={handleExportJSON} disabled={exporting !== null}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:bg-[#FFB8C0]/5 dark:hover:bg-[#E63946]/5 transition-all">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
            {exporting === 'json' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileJson className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">JSON (.json)</p>
            <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Backup lengkap dengan metadata</p>
          </div>
        </button>
      </div>
    </div>
  );
}
