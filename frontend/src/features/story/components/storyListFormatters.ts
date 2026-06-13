"use client";

/**
 * Date helpers for the story list page.
 */

export function stripHtml(value?: string | null): string {
  return value?.replace(/<[^>]+>/g, "").trim() || "";
}

export function formatMemoryDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });
}
