/**
 * Story export utilities - text conversion + file download.
 */

export function htmlToText(html: string): string {
  if (!html) return "";
  let text = html;
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n$1\n");
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n");
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<[^>]+>/g, "");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const NODE_TYPE_LABELS: Record<string, string> = {
  scene: "Scene",
  memory: "Memory",
  character: "Character",
  dialogue: "Dialogue",
  moment: "Moment",
  feeling: "Feeling",
  timeline_event: "Event",
  media: "Media",
  quote: "Quote",
  reflection: "Reflection",
};
