import { NODE_TYPE_LABELS, downloadFile } from "./exportHelpers";

const HTML_STYLES = `
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
`;

function sortNodesByTime(nodes: any[]): any[] {
  return [...nodes].sort((a, b) => {
    const aTime = new Date(a.eventDate || a.createdAt).getTime();
    const bTime = new Date(b.eventDate || b.createdAt).getTime();
    return aTime - bTime;
  });
}

function safeFilename(title: string): string {
  return (title || "Story").replace(/[^a-zA-Z0-9]/g, "_");
}

function renderNode(node: any): string {
  const typeLabel = NODE_TYPE_LABELS[node.storyNodeType] || "Scene";
  let metadata: Record<string, unknown> = {};
  try {
    if (node.storyMetadata) metadata = JSON.parse(node.storyMetadata);
  } catch {
    // ignore malformed metadata
  }
  let html = `  <h2>${node.title || "Untitled"}</h2>\n`;
  html += `  <span class="node-type">${typeLabel}</span>\n`;
  if (node.mood) html += `  <span class="mood"> ${node.mood}</span>\n`;
  if (metadata.sceneLocation)
    html += `  <p class="location">📍 ${metadata.sceneLocation}</p>\n`;
  if (metadata.sceneTime)
    html += `  <p class="location">🕐 ${metadata.sceneTime}</p>\n`;
  html += `  <div class="content">${node.content || ""}</div>\n`;
  if (node.images?.length > 0) {
    node.images.forEach((img: any) => {
      html += `  <img src="${img.imageUrl}" alt="${img.caption || ""}">\n`;
    });
  }
  html += `  <hr>\n`;
  return html;
}

/**
 * buildHtmlExport - Generate a self-contained HTML string for
 * the story and trigger a download. Returns the filename used.
 */
export function buildHtmlExport(story: any, nodes: any[]): string {
  const sortedNodes = sortNodesByTime(nodes);
  const dateStr = new Date().toISOString().split("T")[0];
  const safeTitle = safeFilename(story.title);

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${story.title}</title>
  <style>${HTML_STYLES}</style>
</head>
<body>
  <h1>${story.title}</h1>
`;
  if (story.subtitle) html += `  <p class="subtitle">${story.subtitle}</p>\n`;
  if (story.description) html += `  <p class="description">${story.description}</p>\n`;
  html += `  <hr>\n`;

  sortedNodes.forEach((node) => {
    html += renderNode(node);
  });

  html += `  <p class="footer">Diekspor dari Konstelasi pada ${dateStr}</p>\n</body>\n</html>`;
  const filename = `${safeTitle}_${dateStr}.html`;
  downloadFile(html, filename, "text/html");
  return filename;
}
