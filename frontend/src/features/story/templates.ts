/**
 * Story templates: pre-built node structures for each story type.
 * Solves the "blank canvas problem" by giving new users a starting
 * structure they can customize.
 */

export interface StoryTemplateNode {
  /** Friendly title shown on the node. */
  title: string;
  /** Story node type (scene, memory, character, etc.). */
  nodeType: string;
  /** Position offset relative to canvas center. */
  position: { x: number; y: number };
  /** Optional default emotion/mood. */
  mood?: string;
  /** Whether this node should connect to the previous one (chronological flow). */
  connectFromPrevious?: boolean;
}

export interface StoryTemplate {
  storyType: string;
  label: string;
  description: string;
  nodes: StoryTemplateNode[];
}

/** Horizontal step between nodes when laid out left-to-right. */
const STEP = 280;

/**
 * Built-in templates per story type. Each template provides a
 * connected sequence of nodes that the user can edit or extend.
 */
export const STORY_TEMPLATES: Record<string, StoryTemplate> = {
  love_story: {
    storyType: 'love_story',
    label: 'Love Story',
    description: 'Pertemuan, mendekat, momen penting',
    nodes: [
      {
        title: 'Pertama Bertemu',
        nodeType: 'scene',
        position: { x: 0, y: 0 },
        mood: 'excited',
      },
      {
        title: 'Semakin Dekat',
        nodeType: 'memory',
        position: { x: STEP, y: 0 },
        mood: 'happy',
        connectFromPrevious: true,
      },
      {
        title: 'Momen Tak Terlupakan',
        nodeType: 'moment',
        position: { x: STEP * 2, y: 0 },
        mood: 'romantic',
        connectFromPrevious: true,
      },
      {
        title: 'Refleksi',
        nodeType: 'reflection',
        position: { x: STEP * 3, y: 0 },
        mood: 'peaceful',
        connectFromPrevious: true,
      },
    ],
  },

  biography: {
    storyType: 'biography',
    label: 'Biography',
    description: 'Awal hidup, titik balik, pencapaian',
    nodes: [
      {
        title: 'Awal Hidup',
        nodeType: 'timeline_event',
        position: { x: 0, y: 0 },
      },
      {
        title: 'Masa Tumbuh',
        nodeType: 'memory',
        position: { x: STEP, y: 0 },
        connectFromPrevious: true,
      },
      {
        title: 'Titik Balik',
        nodeType: 'moment',
        position: { x: STEP * 2, y: 0 },
        mood: 'hopeful',
        connectFromPrevious: true,
      },
      {
        title: 'Pencapaian',
        nodeType: 'timeline_event',
        position: { x: STEP * 3, y: 0 },
        mood: 'happy',
        connectFromPrevious: true,
      },
    ],
  },

  memory_collection: {
    storyType: 'memory_collection',
    label: 'Memories',
    description: 'Beberapa kenangan terhubung',
    nodes: [
      {
        title: 'Kenangan #1',
        nodeType: 'memory',
        position: { x: 0, y: 0 },
        mood: 'nostalgic',
      },
      {
        title: 'Kenangan #2',
        nodeType: 'memory',
        position: { x: STEP, y: -120 },
        mood: 'happy',
      },
      {
        title: 'Kenangan #3',
        nodeType: 'memory',
        position: { x: STEP, y: 120 },
        mood: 'melancholic',
      },
      {
        title: 'Refleksi',
        nodeType: 'reflection',
        position: { x: STEP * 2, y: 0 },
        mood: 'peaceful',
      },
    ],
  },

  adventure: {
    storyType: 'adventure',
    label: 'Adventure',
    description: 'Persiapan, perjalanan, pulang',
    nodes: [
      {
        title: 'Persiapan',
        nodeType: 'scene',
        position: { x: 0, y: 0 },
        mood: 'excited',
      },
      {
        title: 'Berangkat',
        nodeType: 'timeline_event',
        position: { x: STEP, y: 0 },
        connectFromPrevious: true,
      },
      {
        title: 'Petualangan',
        nodeType: 'moment',
        position: { x: STEP * 2, y: 0 },
        mood: 'excited',
        connectFromPrevious: true,
      },
      {
        title: 'Pulang & Refleksi',
        nodeType: 'reflection',
        position: { x: STEP * 3, y: 0 },
        mood: 'peaceful',
        connectFromPrevious: true,
      },
    ],
  },

  character_study: {
    storyType: 'character_study',
    label: 'Character Study',
    description: 'Mengenal seseorang lebih dalam',
    nodes: [
      {
        title: 'Sosoknya',
        nodeType: 'character',
        position: { x: 0, y: 0 },
      },
      {
        title: 'Kebiasaan',
        nodeType: 'reflection',
        position: { x: STEP, y: -120 },
      },
      {
        title: 'Kutipan Favorit',
        nodeType: 'quote',
        position: { x: STEP, y: 120 },
      },
      {
        title: 'Mengapa Berkesan',
        nodeType: 'feeling',
        position: { x: STEP * 2, y: 0 },
        mood: 'nostalgic',
      },
    ],
  },
};

/** Get template for a given story type, or null if no template exists. */
export function getTemplateFor(storyType: string): StoryTemplate | null {
  return STORY_TEMPLATES[storyType.toLowerCase()] || null;
}
