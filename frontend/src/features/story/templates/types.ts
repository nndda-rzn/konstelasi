/**
 * Story template types and shared layout constants.
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
export const STEP = 280;
