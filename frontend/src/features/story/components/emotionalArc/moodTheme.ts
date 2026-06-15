import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/** Color per mood used for chart dots, pills, and chips. */
export const MOOD_COLORS: Record<string, string> = {
  happy: "#FF922B",
  excited: "#FF6B8B",
  peaceful: "#38D9A9",
  hopeful: "#3BC9DB",
  romantic: "#C074DF",
  nostalgic: "#CC5DE8",
  melancholic: "#4DABF7",
  sad: "#7C83FD",
  neutral: "#94a3b8",
};

export const TREND_CONFIG: Record<
  string,
  { icon: any; label: string; color: string }
> = {
  rising: { icon: TrendingUp, label: "Naik", color: "#38D9A9" },
  falling: { icon: TrendingDown, label: "Turun", color: "#F03E3E" },
  stable: { icon: Minus, label: "Stabil", color: "#7C83FD" },
};
