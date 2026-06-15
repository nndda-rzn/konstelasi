import type { StoryTemplate } from "./types";
import { STEP } from "./types";

export const CHARACTER_STUDY: StoryTemplate = {
  storyType: "character_study",
  label: "Character Study",
  description: "Mengenal seseorang lebih dalam",
  nodes: [
    {
      title: "Sosoknya",
      nodeType: "character",
      position: { x: 0, y: 0 },
    },
    {
      title: "Kebiasaan",
      nodeType: "reflection",
      position: { x: STEP, y: -120 },
    },
    {
      title: "Kutipan Favorit",
      nodeType: "quote",
      position: { x: STEP, y: 120 },
    },
    {
      title: "Mengapa Berkesan",
      nodeType: "feeling",
      position: { x: STEP * 2, y: 0 },
      mood: "nostalgic",
    },
  ],
};
