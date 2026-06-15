import type { StoryTemplate } from "./types";
import { LOVE_STORY } from "./love";
import { BIOGRAPHY } from "./biography";
import { MEMORY_COLLECTION } from "./memory";
import { ADVENTURE } from "./adventure";
import { CHARACTER_STUDY } from "./character";

/**
 * Built-in templates per story type. Each template provides a
 * connected sequence of nodes that the user can edit or extend.
 */
export const STORY_TEMPLATES: Record<string, StoryTemplate> = {
  love_story: LOVE_STORY,
  biography: BIOGRAPHY,
  memory_collection: MEMORY_COLLECTION,
  adventure: ADVENTURE,
  character_study: CHARACTER_STUDY,
};

/** Get template for a given story type, or null if no template exists. */
export function getTemplateFor(storyType: string): StoryTemplate | null {
  return STORY_TEMPLATES[storyType.toLowerCase()] || null;
}

export type { StoryTemplate, StoryTemplateNode } from "./types";
