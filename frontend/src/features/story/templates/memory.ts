import type { StoryTemplate } from "./types";
import { STEP } from "./types";

export const MEMORY_COLLECTION: StoryTemplate = {
  storyType: "memory_collection",
  label: "Memories",
  description: "Beberapa kenangan terhubung",
  nodes: [
    {
      title: "Kenangan #1",
      nodeType: "memory",
      position: { x: 0, y: 0 },
      mood: "nostalgic",
    },
    {
      title: "Kenangan #2",
      nodeType: "memory",
      position: { x: STEP, y: -120 },
      mood: "happy",
    },
    {
      title: "Kenangan #3",
      nodeType: "memory",
      position: { x: STEP, y: 120 },
      mood: "melancholic",
    },
    {
      title: "Refleksi",
      nodeType: "reflection",
      position: { x: STEP * 2, y: 0 },
      mood: "peaceful",
    },
  ],
};
