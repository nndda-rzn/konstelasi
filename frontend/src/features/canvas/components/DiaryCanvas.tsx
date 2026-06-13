'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  ConnectionMode,
  Edge,
  Node,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useCanvas } from '@/context/CanvasContext';
import { useTags } from '@/context/TagContext';
import {
  CREATE_NOTE,
  BATCH_UPDATE_NOTES,
  DELETE_NOTE,
} from '@/graphql/mutations';
import { useCanvasUIStore } from '../store/useCanvasUIStore';
import { useCanvasData } from '../hooks/useCanvasData';
import { useCanvasShortcuts } from '../hooks/useCanvasShortcuts';
import { useAutoLayout } from '../hooks/useAutoLayout';
import { useCanvasHistory } from '../hooks/useCanvasHistory';
import { useEdgeOperations } from '../hooks/useEdgeOperations';
import { useFocusRestore } from '../hooks/useFocusRestore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useNoteCreation } from '../hooks/useNoteCreation';
import { usePositionPersistence } from '../hooks/usePositionPersistence';
import type { Note, BatchUpdateNotesResponse, DeleteNoteResponse } from '../types';

import NoteNode from './NoteNode';
import SemanticEdge from './SemanticEdge';
import NoteEditorSidebar from './NoteEditorSidebar';
import { CanvasError } from './diaryCanvas/CanvasError';
import TimelineView from './TimelineView';
import ThreadView from './ThreadView';
import CanvasToolbar from './CanvasToolbar';
import CanvasFooter from './CanvasFooter';
import CanvasEmptyState from './CanvasEmptyState';
import CanvasSkeleton from './CanvasSkeleton';
import TagPanel from '../panels/TagPanel';
import SearchPanel from '../panels/SearchPanel';
import AdvancedAnalyticsPanel from '../panels/AdvancedAnalyticsPanel';
import ArchivePanel from '../panels/ArchivePanel';
import ExportPanel from '../panels/ExportPanel';
import CalendarPanel from '../panels/CalendarPanel';
import StreakWidget from './StreakWidget';
import ConfirmDialog from '@/components/ConfirmDialog';

const nodeTypes = {
  default: NoteNode,
};

const edgeTypes = {
  semanticEdge: SemanticEdge,
};

function DiaryCanvasInner() {
  const router = useRouter();
  const { selectedCanvasId } = useCanvas();
  const { selectedTagFilters } = useTags();
  const { screenToFlowPosition } = useReactFlow();

  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // UI state from store
  const viewMode = useCanvasUIStore((s) => s.viewMode);
  const setViewMode = useCanvasUIStore((s) => s.setViewMode);
  const activePanel = useCanvasUIStore((s) => s.activePanel);
  const togglePanel = useCanvasUIStore((s) => s.togglePanel);
  const closePanel = useCanvasUIStore((s) => s.closePanel);
  const openPanel = useCanvasUIStore((s) => s.openPanel);
  const searchQuery = useCanvasUIStore((s) => s.searchQuery);
  const setSearchQuery = useCanvasUIStore((s) => s.setSearchQuery);
  const selectedNote = useCanvasUIStore((s) => s.selectedNote);
  const setSelectedNote = useCanvasUIStore((s) => s.setSelectedNote);
  const pendingDelete = useCanvasUIStore((s) => s.pendingDelete);
  const setPendingDelete = useCanvasUIStore((s) => s.setPendingDelete);
  const clearPendingDelete = useCanvasUIStore((s) => s.clearPendingDelete);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigateRef = useRef<(id: string) => void>(() => {});
  const { saveFocus, restoreFocus } = useFocusRestore();

  // Toggle/close panel with focus restore
  const handleTogglePanel = useCallback(
    (panel: any) => {
      if (useCanvasUIStore.getState().activePanel !== panel) {
        saveFocus();
      } else {
        restoreFocus();
      }
      togglePanel(panel);
    },
    [saveFocus, restoreFocus, togglePanel]
  );

  // === Mutations ===
  const [createNote] = useMutation<{ createNote: Note }>(CREATE_NOTE);
  const [batchUpdateNotes] = useMutation<BatchUpdateNotesResponse>(
    BATCH_UPDATE_NOTES
  );
  const [deleteNote] = useMutation<DeleteNoteResponse>(DELETE_NOTE);

  // === Edge operations ===
  const { onConnect: onConnectBase, onEdgesDelete: onEdgesDeleteBase, handleEdgeLabelChange } =
    useEdgeOperations({
      setEdges,
      getSourceColor: useCallback(
        (sourceId: string) => {
          const sourceNode = nodes.find((n) => n.id === sourceId);
          return sourceNode?.data?.color;
        },
        [nodes]
      ),
    });

  // === Note creation (right-click + shortcut) ===
  const { createNoteFromEvent: handleCanvasContextMenu, createNoteAtCenter: handleCreateAtCenter } =
    useNoteCreation();

  // === Auto layout ===
  const { applyAutoLayout } = useAutoLayout({
    nodes: [],
    onApplied: () => {},
  });

  // === History (undo/redo) ===
  const { pushSnapshot, undo, redo, canUndo, canRedo } = useCanvasHistory();

  // === Position persistence ===
  const { queueChanges: queueLayoutChanges } = usePositionPersistence({
    batchUpdate: batchUpdateNotes,
  });

  // === Data + flow transformation ===
  const { data, loading, error, refetch } = useCanvasData({
    onNodeDoubleClick: (id) => setSelectedNote({ id, ...data?.getNotes?.find((n) => n.id === id) }),
    handleEdgeLabelChange,
    setNodes,
    setEdges,
  });

  // === Keyboard navigation between nodes ===
  useKeyboardNavigation(nodes, selectedNote?.id ?? null, navigateRef);

  // === Handlers ===
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      const note = data?.getNotes?.find((n: Note) => n.id === nodeId);
      if (note) setSelectedNote(note);
    },
    [data, setSelectedNote]
  );
  navigateRef.current = handleNodeDoubleClick;

  // Update local cache after editor change
  const handleUpdateCache = useCallback(
    (
      nodeId: string,
      newTitle?: string,
      newContent?: string,
      newImages?: Note['images'],
      color?: string,
      mood?: string
    ) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                title: newTitle ?? n.data.title,
                content: newContent ?? n.data.content,
                images: newImages ?? n.data.images,
                color: color ?? n.data.color,
                mood: mood ?? n.data.mood,
              },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  // Delete after confirmation
  const performNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      pushSnapshot(nodes, edges);
      nodesToDelete.forEach((node) => {
        deleteNote({ variables: { id: node.id } })
          .then(() => toast.success('Note deleted'))
          .catch((err) => {
            console.error(err);
            toast.error('Failed to delete note');
          });
      });
      setSelectedNote(null);
    },
    [deleteNote, pushSnapshot, nodes, edges, setSelectedNote]
  );

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      if (nodesToDelete.length > 1) {
        setPendingDelete(nodesToDelete);
        return;
      }
      performNodesDelete(nodesToDelete);
    },
    [performNodesDelete, setPendingDelete]
  );

  const handleDeleteSuccess = useCallback(
    (nodeId: string) => {
      setSelectedNote(null);
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges, setSelectedNote]
  );

  // Combine flow changes with persistence
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes);
      queueLayoutChanges(changes);
    },
    [onNodesChange, queueLayoutChanges]
  );

  // Connection with snapshot
  const handleConnect = useCallback(
    (connection: Connection) => {
      pushSnapshot(nodes, edges);
      onConnectBase(connection);
    },
    [pushSnapshot, nodes, edges, onConnectBase]
  );

  const handleEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      pushSnapshot(nodes, edges);
      onEdgesDeleteBase(edgesToDelete);
    },
    [pushSnapshot, nodes, edges, onEdgesDeleteBase]
  );

  // Export canvas as PNG
  const downloadImage = useCallback(() => {
    const canvasElement = document.querySelector(".react-flow") as HTMLElement;
    if (!canvasElement) return;

    toPng(canvasElement, {
      backgroundColor: "#F7F1EA",
      quality: 1,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.setAttribute(
          "download",
          `Constella_Export_${new Date().toISOString().split("T")[0]}.png`
        );
        a.setAttribute("href", dataUrl);
        a.click();
      })
      .catch((err) => {
        console.error("Failed to export canvas", err);
      });
  }, []);

  // === Keyboard shortcuts ===
  useCanvasShortcuts({
    searchInputRef,
    onCreateAtCenter: handleCreateAtCenter,
    onUndo: () => {
      const s = undo();
      if (s) {
        setNodes(s.nodes);
        setEdges(s.edges);
      }
    },
    onRedo: () => {
      const s = redo();
      if (s) {
        setNodes(s.nodes);
        setEdges(s.edges);
      }
    },
  });

  if (loading) return <CanvasSkeleton />;

  if (error)
    return <CanvasError message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="w-full h-screen relative bg-[#F7F1EA] overflow-hidden">
      {/* Subtle warm ambient glows (no pink) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(201,154,69,0.06),_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#C99A45]/8 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#B84A5A]/8 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />

      {/* Header / Toolbar */}
      <CanvasToolbar
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activePanel={activePanel}
        onTogglePanel={handleTogglePanel}
        onActivateSearchPanel={() => openPanel('search')}
        selectedTagFiltersCount={selectedTagFilters.length}
        onApplyAutoLayout={() => applyAutoLayout()}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => {
          const s = undo();
          if (s) {
            setNodes(s.nodes);
            setEdges(s.edges);
          }
        }}
        onRedo={() => {
          const s = redo();
          if (s) {
            setNodes(s.nodes);
            setEdges(s.edges);
          }
        }}
      />

      {/* Main view area */}
      <div
        className="w-full h-full pt-16 relative z-0"
        onContextMenu={handleCanvasContextMenu}
      >
        {viewMode === 'canvas' ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodesDelete={handleNodesDelete}
            onEdgesDelete={handleEdgesDelete}
            connectionMode={ConnectionMode.Loose}
            defaultEdgeOptions={{
              type: 'semanticEdge',
              animated: true,
            }}
            onNodeDoubleClick={(_, node) => handleNodeDoubleClick(node.id)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 2 }}
          >
            <Background color="rgba(47, 39, 48, 0.08)" gap={28} size={1.2} />
            <Controls className="!bg-[#FFFCF8]/85 !border-[rgba(47,39,48,0.08)] !backdrop-blur-xl !shadow-md !rounded-[12px] overflow-hidden" />
            <MiniMap
              className="!bg-[#FFFCF8]/85 !border-[rgba(47,39,48,0.08)] !backdrop-blur-xl !shadow-md !rounded-[14px] overflow-hidden !m-4"
              nodeColor={(n) =>
                n.id === selectedNote?.id ? '#B84A5A' : 'rgba(47, 39, 48, 0.25)'
              }
              maskColor="rgba(247, 241, 234, 0.6)"
            />
          </ReactFlow>
        ) : (
          <ThreadView
            nodes={nodes}
            selectedNoteId={selectedNote?.id}
            onNodeClick={handleNodeDoubleClick}
          />
        )}

        {viewMode === 'timeline' && data?.getNotes && (
          <TimelineView
            notes={data.getNotes}
            onNoteClick={(noteId) => handleNodeDoubleClick(noteId)}
            selectedNoteId={selectedNote?.id}
          />
        )}

        {viewMode === 'canvas' && (
          <CanvasFooter onCreate={handleCreateAtCenter} />
        )}

        {viewMode === 'canvas' && !loading && nodes.length === 0 && (
          <CanvasEmptyState onCreate={handleCreateAtCenter} />
        )}
      </div>

      {/* Note editor sidebar */}
      {selectedNote && (
        <NoteEditorSidebar
          note={selectedNote}
          allNotes={data?.getNotes || []}
          onClose={() => {
            setSelectedNote(null);
            restoreFocus();
          }}
          onUpdateCache={handleUpdateCache}
          onDeleteSuccess={handleDeleteSuccess}
          onNavigate={(id) => handleNodeDoubleClick(id)}
        />
      )}

      {/* Tag panel */}
      {activePanel === 'tag' && <TagPanel onClose={closePanel} />}

      {/* Search panel */}
      {activePanel === 'search' && data?.getNotes && (
        <SearchPanel
          notes={data.getNotes}
          onNoteClick={(noteId) => {
            handleNodeDoubleClick(noteId);
            closePanel();
          }}
          onClose={closePanel}
        />
      )}

      {/* Stats panel */}
      {activePanel === 'stats' && data?.getNotes && (
        <AdvancedAnalyticsPanel
          isOpen={true}
          notes={data.getNotes}
          onClose={closePanel}
        />
      )}

      {/* Archive panel */}
      <ArchivePanel
        isOpen={activePanel === 'archive'}
        onClose={closePanel}
        onRestoreSuccess={() => refetch()}
      />

      {/* Export panel */}
      {activePanel === 'export' && data?.getNotes && (
        <ExportPanel
          isOpen={true}
          onClose={closePanel}
          notes={data.getNotes}
        />
      )}

      {/* Calendar panel */}
      {activePanel === 'calendar' && data?.getNotes && (
        <CalendarPanel
          isOpen={true}
          onClose={closePanel}
          notes={data.getNotes}
          onNoteClick={(noteId) => {
            handleNodeDoubleClick(noteId);
            closePanel();
          }}
        />
      )}

      {/* Streak widget */}
      <StreakWidget />

      {/* Multi-delete confirmation */}
      <ConfirmDialog
        open={pendingDelete.length > 0}
        title={`Delete ${pendingDelete.length} note${pendingDelete.length > 1 ? 's' : ''}?`}
        description="This will delete all selected notes and their connections. This action cannot be undone."
        confirmLabel="Delete all"
        variant="danger"
        onCancel={clearPendingDelete}
        onConfirm={() => {
          performNodesDelete(pendingDelete);
          clearPendingDelete();
        }}
      />
    </div>
  );
}

export default function DiaryCanvas() {
  return (
    <ReactFlowProvider>
      <DiaryCanvasInner />
    </ReactFlowProvider>
  );
}
