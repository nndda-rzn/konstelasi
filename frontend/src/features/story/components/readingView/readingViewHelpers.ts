/**
 * Reading view helpers - time lock check + date formatting.
 */

export function isNodeTimeLocked(node: any): boolean {
  return Boolean(
    node?.isTimeLocked ||
      (node?.unlockDate && new Date(node.unlockDate).getTime() > Date.now())
  );
}

export function formatUnlockDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseNodeMetadata(metadataStr?: string): any {
  if (!metadataStr) return {};
  try {
    return JSON.parse(metadataStr);
  } catch {
    return {};
  }
}
