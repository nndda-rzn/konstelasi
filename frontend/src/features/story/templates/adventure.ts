import type { StoryTemplate } from "./types";
import { STEP } from "./types";

export const ADVENTURE: StoryTemplate = {
  storyType: "adventure",
  label: "Adventure",
  description: "Persiapan, perjalanan, pulang",
  nodes: [
    {
      title: "Persiapan",
      nodeType: "scene",
      position: { x: 0, y: 0 },
      mood: "excited",
    },
    {
      title: "Berangkat",
      nodeType: "timeline_event",
      position: { x: STEP, y: 0 },
      connectFromPrevious: true,
    },
    {
      title: "Petualangan",
      nodeType: "moment",
      position: { x: STEP * 2, y: 0 },
      mood: "excited",
      connectFromPrevious: true,
    },
    {
      title: "Pulang & Refleksi",
      nodeType: "reflection",
      position: { x: STEP * 3, y: 0 },
      mood: "peaceful",
      connectFromPrevious: true,
    },
  ],
};
