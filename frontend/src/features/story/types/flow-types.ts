/**
 * Story flow types - shape of GraphQL story nodes + the
 * derived React Flow node/edge shapes used by the story canvas.
 */

export interface StoryEdgeRef {
  id: string;
  source: { id: string };
  target: { id: string };
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  color?: string;
}

export interface StoryNode {
  id: string;
  title?: string;
  content?: string;
  color?: string;
  mood?: string;
  storyNodeType?: string;
  storyMetadata?: string;
  isLocked?: boolean;
  unlockDate?: string;
  isTimeLocked?: boolean;
  eventDate?: string;
  eventLocation?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  images?: unknown[];
  tags?: unknown[];
  outgoingEdges?: StoryEdgeRef[];
}

export interface FlowNode {
  id: string;
  position: { x: number; y: number };
  style?: React.CSSProperties;
  data: Record<string, unknown>;
  type: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: Record<string, unknown>;
  type: string;
}
