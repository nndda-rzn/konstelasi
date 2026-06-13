"use client";

import { useState } from "react";
import {
  htmlToText,
  downloadFile,
  NODE_TYPE_LABELS,
} from "./exportHelpers";

type ExportFormat = "markdown" | "json" | null;

interface UseStoryExportParams {
  story: any;
  nodes: any[];
}

/**
 * useStoryExport - Story export orchestration (Markdown / JSON).
 * Returns handler functions + loading state.
 */
export const useStoryExport = ({ story, nodes }: UseStoryExportParams) => {
  const [exporting, setExporting] = useState<ExportFormat>(null);

  const sortedNodes = [...nodes].sort((a: any, b: any) => {
    const aTime = new Date(a.eventDate || a.createdAt).getTime();
    const bTime = new Date(b.eventDate || b.createdAt).getTime();
    return aTime - bTime;
  });

  const dateStr = new Date().toISOString().split("T")[0];
  const safeTitle = (story.title || "Story").replace(/[^a-zA-Z0-9]/g, "_");

  const buildMarkdown = (): string => {
    let md = `# ${story.title}\n\n`;
    if (story.subtitle) md += `*${story.subtitle}*\n\n`;
    if (story.description) md += `${story.description}\n\n`;
    md += `---\n\n`;

    sortedNodes.forEach((node: any, i: number) => {
      const typeLabel = NODE_TYPE_LABELS[node.storyNodeType] || "Scene";
      md += `## ${i + 1}. ${node.title || "Untitled"}\n\n`;
      md += `> **${typeLabel}**`;
      if (node.mood) md += ` | Mood: ${node.mood}`;
      md += `\n\n`;

      let metadata: any = {};
      try {
        if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata);
      } catch {}
      if (metadata.sceneLocation) md += `📍 ${metadata.sceneLocation}\n`;
      if (metadata.sceneTime) md += `🕐 ${metadata.sceneTime}\n`;
      if (metadata.sceneLocation || metadata.sceneTime) md += `\n`;

      md += htmlToText(node.content || "") + "\n\n";
      md += `---\n\n`;
    });

    md += `\n*Diekspor dari Konstelasi pada ${dateStr}*\n`;
    return md;
  };

  const buildJson = (): any => ({
    story: {
      title: story.title,
      subtitle: story.subtitle,
      description: story.description,
      storyType: story.storyType,
      status: story.status,
    },
    nodes: sortedNodes.map((n: any) => ({
      id: n.id,
      title: n.title,
      type: n.storyNodeType,
      mood: n.mood,
      content: n.content,
      contentText: htmlToText(n.content || ""),
      metadata: n.storyMetadata ? JSON.parse(n.storyMetadata) : {},
    })),
    exportedAt: new Date().toISOString(),
    exportedFrom: "Konstelasi",
  });

  const exportMarkdown = () => {
    setExporting("markdown");
    try {
      const md = buildMarkdown();
      downloadFile(md, `${safeTitle}_${dateStr}.md`, "text/markdown");
    } finally {
      setExporting(null);
    }
  };

  const exportJson = () => {
    setExporting("json");
    try {
      const data = JSON.stringify(buildJson(), null, 2);
      downloadFile(data, `${safeTitle}_${dateStr}.json`, "application/json");
    } finally {
      setExporting(null);
    }
  };

  return {
    exporting,
    exportMarkdown,
    exportJson,
  };
};
