import type { StoryTemplate } from "./types";
import { STEP } from "./types";

export const LOVE_STORY: StoryTemplate = {
  storyType: "love_story",
  label: "Love Story",
  description: "Pertemuan, mendekat, momen penting",
  nodes: [
    {
      title: "Pertama Bertemu",
      nodeType: "scene",
      position: { x: 0, y: 0 },
      mood: "excited",
    },
    {
      title: "Semakin Dekat",
      nodeType: "memory",
      position: { x: STEP, y: 0 },
      mood: "happy",
      connectFromPrevious: true,
    },
    {
      title: "Momen Tak Terlupakan",
      nodeType: "moment",
      position: { x: STEP * 2, y: 0 },
      mood: "romantic",
      connectFromPrevious: true,
    },
    {
      title: "Refleksi",
      nodeType: "reflection",
      position: { x: STEP * 3, y: 0 },
      mood: "peaceful",
      connectFromPrevious: true,
    },
  ],
};
