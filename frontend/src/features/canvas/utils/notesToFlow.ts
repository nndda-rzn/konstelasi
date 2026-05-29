import type { Edge } from '@xyflow/react';

interface ApolloNote {
  id: string;
  title?: string;
  content?: string | null;
  positionX: number;
  positionY: number;
  width?: number | null;
  height?: number | null;
  color?: string | null;
  type?: string | null;
  mood?: string | null;
  titleFont?: string | null;
  images?: any[];
  tags?: any[];
  incomingEdges?: any[];
  outgoingEdges?: any[];
  createdAt?: string;
}

interface TransformOptions {
  /** Current search query (used to mark `isSearching` flag). */
  searchQuery: string;
  /** Callback fired when a node is double-clicked (passed to NoteNode data). */
  onNodeDoubleClick: (noteId: string) => void;
  /** Edge label change handler (passed into edge data for SemanticEdge). */
  onEdgeLabelChange: (edgeId: string, newLabel: string) => void;
}

interface TransformResult {
  nodes: any[];
  edges: Edge[];
}

/**
 * Transforms an array of Apollo Notes into the React Flow nodes and edges
 * structure consumed by the canvas. Pure function (no side effects).
 */
export function notesToFlow(
  notes: ApolloNote[],
  { searchQuery, onNodeDoubleClick, onEdgeLabelChange }: TransformOptions
): TransformResult {
  const nodes = notes.map((note) => ({
    id: note.id,
    type: 'default',
    // Coerce to numbers - React Flow requires valid numbers, not null/undefined,
    // otherwise the node is treated as "uninitialized" and dragging fails (#015).
    position: {
      x: typeof note.positionX === 'number' ? note.positionX : 0,
      y: typeof note.positionY === 'number' ? note.positionY : 0,
    },
    data: {
      title: note.title,
      content: note.content,
      images: note.images,
      color: note.color || 'default',
      type: note.type || 'default',
      mood: note.mood || '',
      titleFont: note.titleFont || null,
      incomingEdges: note.incomingEdges,
      outgoingEdges: note.outgoingEdges,
      tags: note.tags || [],
      createdAt: note.createdAt || new Date().toISOString(),
      isSearching: searchQuery !== '',
      isMatch: true,
      onDoubleClick: () => onNodeDoubleClick(note.id),
    },
    style: {
      width: note.width || undefined,
      height: note.height || undefined,
    },
  }));

  const edges: Edge[] = [];
  notes.forEach((note) => {
    note.outgoingEdges?.forEach((edge: any) => {
      edges.push({
        id: edge.id,
        type: 'semanticEdge',
        source: edge.source.id,
        target: edge.target.id,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        data: {
          label: edge.label || '',
          color: note.color || 'default',
          onLabelChange: onEdgeLabelChange,
        },
      });
    });
  });

  return { nodes, edges };
}
