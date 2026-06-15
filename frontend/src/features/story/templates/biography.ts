import type { StoryTemplate } from "./types";
import { STEP } from "./types";

export const BIOGRAPHY: StoryTemplate = {
  storyType: "biography",
  label: "Biography",
  description: "Awal hidup, titik balik, pencapaian",
  nodes: [
    {
      title: "Awal Hidup",
      nodeType: "timeline_event",
      position: { x: 0, y: 0 },
    },
    {
      title: "Masa Tumbuh",
      nodeType: "memory",
      position: { x: STEP, y: 0 },
      connectFromPrevious: true,
    },
    {
      title: "Titik Balik",
      nodeType: "moment",
      position: { x: STEP * 2, y: 0 },
      mood: "hopeful",
      connectFromPrevious: true,
    },
    {
      title: "Pencapaian",
      nodeType: "timeline_event",
      position: { x: STEP * 3, y: 0 },
      mood: "happy",
      connectFromPrevious: true,
    },
  ],
};
