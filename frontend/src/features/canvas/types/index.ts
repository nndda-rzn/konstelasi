/**
 * Shared TypeScript types for the canvas feature.
 *
 * These types mirror the GraphQL schema returned from the backend
 * (see backend/src/entities/note.entity.ts) and are intentionally
 * kept lightweight so they can be reused across components,
 * hooks, and panels without forcing tight coupling.
 */

export type NoteColor =
  | 'default'
  | 'red'
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

export type NoteType = 'default' | 'text' | 'quote';

export type NoteMood =
  | ''
  | 'memory'
  | 'hope'
  | 'secret'
  | 'dream'
  | 'ordinary'
  | 'important';

export interface NoteImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

export interface NoteTag {
  id: string;
  name: string;
  color?: string | null;
}

export interface NoteEdgeRef {
  id: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string | null;
  source: { id: string; title?: string | null };
  target: { id: string; title?: string | null };
}

/**
 * The shape of a note as returned from the GraphQL `getNotes` query.
 * Most fields are optional or nullable to mirror server behavior.
 */
export interface Note {
  id: string;
  title: string;
  content?: string | null;
  positionX: number;
  positionY: number;
  width?: number | null;
  height?: number | null;
  color?: NoteColor | null;
  mood?: NoteMood | null;
  titleFont?: string | null;
  type?: NoteType | null;
  images?: NoteImage[];
  tags?: NoteTag[];
  outgoingEdges?: NoteEdgeRef[];
  incomingEdges?: NoteEdgeRef[];
  createdAt?: string;
  updatedAt?: string | null;
  isArchived?: boolean;
  archivedAt?: string | null;
}

/**
 * The `data` payload attached to a React Flow node when rendered as a NoteNode.
 * This is what the NoteNode component receives.
 */
export interface NoteNodeData {
  title: string;
  content: string;
  images: NoteImage[];
  color: NoteColor;
  type: NoteType;
  mood: NoteMood;
  tags: NoteTag[];
  incomingEdges: NoteEdgeRef[];
  outgoingEdges: NoteEdgeRef[];
  createdAt: string;
  /** CSS font-family value applied to the title (null/undefined = default). */
  titleFont?: string | null;
  /** Whether the canvas-level search is currently filtering. */
  isSearching: boolean;
  /** Whether this node matches the current search query. */
  isMatch: boolean;
  /** Optional callback to open the editor for this note. */
  onDoubleClick?: () => void;
  /** Internal: thread view alignment hint. */
  _threadAlign?: 'left' | 'right';
}

/**
 * The `data` payload attached to a React Flow edge for SemanticEdge.
 */
export interface NoteEdgeData {
  label: string;
  color: NoteColor;
  onLabelChange?: (edgeId: string, newLabel: string) => void;
}

/** Canvas-level UI state types. */
export type CanvasViewMode = 'canvas' | 'thread' | 'timeline';
export type CanvasActivePanel =
  | 'tag'
  | 'search'
  | 'stats'
  | 'archive'
  | 'export'
  | 'calendar'
  | null;

/** Inputs accepted by the BATCH_UPDATE_NOTES mutation. */
export interface NoteLayoutInput {
  id: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
}

/** Shape of the GET_NOTES query response. */
export interface GetNotesData {
  getNotes: Note[];
}

/** Shape of the CREATE_NOTE mutation response. */
export interface CreateNoteResponse {
  createNote: Note;
}

/** Shape of the DELETE_NOTE mutation response. */
export interface DeleteNoteResponse {
  deleteNote: { id: string };
}

/** Shape of the BATCH_UPDATE_NOTES mutation response. */
export interface BatchUpdateNotesResponse {
  batchUpdateNotes: Note[];
}
