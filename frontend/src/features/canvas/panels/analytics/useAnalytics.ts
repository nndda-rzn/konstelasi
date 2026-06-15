import { useMemo } from "react";

export interface Analytics {
  totalNotes: number;
  totalWords: number;
  avgWords: number;
  maxWords: number;
  moodEntries: Array<[string, number]>;
  tagEntries: Array<[string, number]>;
  connectionCounts: Array<{ id: string; title: string; connections: number }>;
  dayActivity: number[];
  dayNames: string[];
  maxDayActivity: number;
  last30: number[];
  maxLast30: number;
  colorCounts: Record<string, number>;
}

/**
 * useAnalytics - Pure computation of canvas analytics from notes.
 * Returns null when there are no notes.
 */
export function useAnalytics(notes: any[]): Analytics | null {
  return useMemo(() => {
    if (!notes || notes.length === 0) return null;

    const wordCounts = notes.map((n: any) => {
      const text = (n.content || "").replace(/<[^>]+>/g, "");
      return text.split(/\s+/).filter((w: string) => w.length > 0).length;
    });
    const totalWords = wordCounts.reduce((a: number, b: number) => a + b, 0);
    const avgWords = Math.round(totalWords / notes.length);
    const maxWords = Math.max(...wordCounts);

    const moodCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      if (n.mood) moodCounts[n.mood] = (moodCounts[n.mood] || 0) + 1;
    });
    const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    const tagCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      n.tags?.forEach((t: any) => {
        tagCounts[t.name] = (tagCounts[t.name] || 0) + 1;
      });
    });
    const tagEntries = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const connectionCounts = notes
      .map((n: any) => ({
        id: n.id,
        title: n.title || "Untitled",
        connections:
          (n.outgoingEdges?.length || 0) + (n.incomingEdges?.length || 0),
      }))
      .sort((a: any, b: any) => b.connections - a.connections)
      .slice(0, 5);

    const dayActivity: number[] = [0, 0, 0, 0, 0, 0, 0];
    notes.forEach((n: any) => {
      const day = new Date(n.createdAt).getDay();
      dayActivity[day]++;
    });
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const maxDayActivity = Math.max(...dayActivity);

    const last30: number[] = new Array(30).fill(0);
    const now = new Date();
    notes.forEach((n: any) => {
      const diff = Math.floor(
        (now.getTime() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff >= 0 && diff < 30) last30[29 - diff]++;
    });
    const maxLast30 = Math.max(...last30, 1);

    const colorCounts: Record<string, number> = {};
    notes.forEach((n: any) => {
      const c = n.color || "default";
      colorCounts[c] = (colorCounts[c] || 0) + 1;
    });

    return {
      totalNotes: notes.length,
      totalWords,
      avgWords,
      maxWords,
      moodEntries,
      tagEntries,
      connectionCounts,
      dayActivity,
      dayNames,
      maxDayActivity,
      last30,
      maxLast30,
      colorCounts,
    };
  }, [notes]);
}

export const MOOD_COLORS: Record<string, string> = {
  memory: "#C7CEEA",
  hope: "#B5EAD7",
  secret: "#E0BBE4",
  dream: "#FFD6A5",
  ordinary: "#D4D4D4",
  important: "#FF8FA3",
};
