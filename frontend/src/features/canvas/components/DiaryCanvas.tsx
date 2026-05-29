'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Connection,
  ConnectionMode,
  Edge,
  Node,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_NOTES } from '@/graphql/queries';
import { CREATE_NOTE, BATCH_UPDATE_NOTES, CREATE_NOTE_LINK, DELETE_NOTE_LINK, UPDATE_NOTE_LINK, DELETE_NOTE } from '@/graphql/mutations';
import NoteNode from '@/features/canvas/components/NoteNode';
import SemanticEdge from '@/features/canvas/components/SemanticEdge';
import NoteEditorSidebar from './NoteEditorSidebar';
import TimelineView from '@/features/canvas/components/TimelineView';
import ThreadView from '@/features/canvas/components/ThreadView';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useCanvas } from '@/context/CanvasContext';
import { useTags } from '@/context/TagContext';
import TagPanel from '@/features/canvas/panels/TagPanel';
import SearchPanel from '@/features/canvas/panels/SearchPanel';
import StatsPanel from '@/features/canvas/panels/StatsPanel';
import ArchivePanel from '@/features/canvas/panels/ArchivePanel';
import StreakWidget from '@/features/canvas/components/StreakWidget';
import ExportPanel from '@/features/canvas/panels/ExportPanel';
import CalendarPanel from '@/features/canvas/panels/CalendarPanel';
import AdvancedAnalyticsPanel from '@/features/canvas/panels/AdvancedAnalyticsPanel';
import { useAutoLayout } from '@/features/canvas/hooks/useAutoLayout';
import { usePositionPersistence } from '@/features/canvas/hooks/usePositionPersistence';
import { useEdgeOperations } from '@/features/canvas/hooks/useEdgeOperations';
import { useFocusRestore } from '@/features/canvas/hooks/useFocusRestore';
import { useCanvasHistory } from '@/features/canvas/hooks/useCanvasHistory';
import { useKeyboardNavigation } from '@/features/canvas/hooks/useKeyboardNavigation';
import { useNoteCreation } from '@/features/canvas/hooks/useNoteCreation';
import type { Note, GetNotesData, CreateNoteResponse, DeleteNoteResponse, BatchUpdateNotesResponse } from '@/features/canvas/types';
import { notesToFlow } from '@/features/canvas/utils/notesToFlow';
import CanvasToolbar from '@/features/canvas/components/CanvasToolbar';
import CanvasFooter from '@/features/canvas/components/CanvasFooter';
import CanvasEmptyState from '@/features/canvas/components/CanvasEmptyState';
import CanvasSkeleton from '@/features/canvas/components/CanvasSkeleton';
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
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'canvas' | 'thread' | 'timeline'>('canvas');
  type ActivePanel = 'tag' | 'search' | 'stats' | 'archive' | 'export' | 'calendar' | null;
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [pendingDelete, setPendingDelete] = useState<Node[]>([]);
  const { saveFocus, restoreFocus } = useFocusRestore();
  const togglePanel = useCallback((panel: Exclude<ActivePanel, null>) => {
    saveFocus();
    setActivePanel((current) => (current === panel ? null : panel));
  }, [saveFocus]);
  const closePanel = useCallback(() => {
    setActivePanel(null);
    restoreFocus();
  }, [restoreFocus]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, refetch } = useQuery<GetNotesData>(GET_NOTES, {
    variables: { 
      canvasId: selectedCanvasId || undefined,
      tagIds: selectedTagFilters.length > 0 ? selectedTagFilters : undefined,
    },
    fetchPolicy: 'cache-and-network',
    ssr: false
  });
  
  const [createNote] = useMutation<CreateNoteResponse>(CREATE_NOTE);
  const [batchUpdateNotes] = useMutation<BatchUpdateNotesResponse>(BATCH_UPDATE_NOTES);
  const { applyAutoLayout } = useAutoLayout({
    nodes: data?.getNotes || [],
    // No refetch needed - BATCH_UPDATE_NOTES returns updated notes,
    // and Apollo's cache normalization auto-merges position changes
    // by __typename:id.
    onApplied: () => {},
  });
  const [deleteNote] = useMutation<DeleteNoteResponse>(DELETE_NOTE);

  const { pushSnapshot, undo, redo, canUndo, canRedo } = useCanvasHistory();
  const navigateRef = useRef<(id: string) => void>(() => {});
  useKeyboardNavigation(nodes, selectedNote?.id ?? null, navigateRef);

  const { onConnect: onConnectBase, onEdgesDelete: onEdgesDeleteBase, handleEdgeLabelChange } = useEdgeOperations({
    setEdges,
    getSourceColor: useCallback(
      (sourceId: string) => {
        const sourceNode = nodes.find((n) => n.id === sourceId);
        return sourceNode?.data?.color;
      },
      [nodes]
    ),
  });

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

  const { queueChanges: queueLayoutChanges } = usePositionPersistence({
    batchUpdate: batchUpdateNotes,
  });

  useEffect(() => {
    if (data && data.getNotes) {
      const { nodes: initialNodes, edges: initialEdges } = notesToFlow(data.getNotes, {
        searchQuery,
        onNodeDoubleClick: handleNodeDoubleClick,
        onEdgeLabelChange: handleEdgeLabelChange,
      });
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [data]);

  // Apply search filtering without resetting positions
  useEffect(() => {
    setNodes(nds => nds.map(n => {
      const titleMatch = n.data.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = n.data.content?.toLowerCase().includes(searchQuery.toLowerCase());
      const isMatch = searchQuery === '' || titleMatch || contentMatch;
      
      return {
        ...n,
        data: {
          ...n.data,
          isSearching: searchQuery !== '',
          isMatch
        }
      };
    }));
  }, [searchQuery, setNodes]);

  // Global keyboard shortcut: Ctrl/Cmd+F to focus search.
  // Note: 'N' shortcut is registered later, after handleCreateAtCenter is defined.
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNodeDoubleClick = (nodeId: string) => {
    let note = data?.getNotes?.find((n: Note) => n.id === nodeId);
    
    setNodes((currentNodes) => {
      const localNode = currentNodes.find((n) => n.id === nodeId);
      
      if (!note && localNode) {
        note = {
          id: localNode.id,
          title: localNode.data.title,
          content: localNode.data.content,
          images: localNode.data.images || [],
          color: localNode.data.color || 'default',
          mood: localNode.data.mood || '',
          type: localNode.data.type || 'text',
          tags: localNode.data.tags || [],
          positionX: localNode.position.x,
          positionY: localNode.position.y,
          incomingEdges: localNode.data.incomingEdges || [],
          outgoingEdges: localNode.data.outgoingEdges || [],
        };
      } else if (note && localNode) {
        // Merge: gunakan local node images karena lebih up-to-date
        note = {
          ...note,
          images: localNode.data.images || note.images || [],
          title: localNode.data.title || note.title,
          content: localNode.data.content || note.content,
          color: localNode.data.color || note.color,
          mood: localNode.data.mood || note.mood,
        };
      }
      
      if (note) {
        const finalNote = note;
        setTimeout(() => setSelectedNote(finalNote), 0);
      }
      return currentNodes;
    });
  };
  navigateRef.current = handleNodeDoubleClick;

  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string, newImages?: Note['images'], color?: string, mood?: string) => {
    setNodes((nds) => nds.map(n => {
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
          }
        };
      }
      return n;
    }));
  };

  const performNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      pushSnapshot(nodes, edges);
      nodesToDelete.forEach(node => {
        deleteNote({ variables: { id: node.id } })
          .then(() => toast.success('Note dihapus'))
          .catch((err) => {
            console.error(err);
            toast.error('Gagal menghapus note');
          });
      });
      setSelectedNote(null);
    },
    [deleteNote, pushSnapshot, nodes, edges]
  );

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      // Multi-delete: ask for confirmation to avoid accidental data loss.
      if (nodesToDelete.length > 1) {
        setPendingDelete(nodesToDelete);
        return;
      }
      performNodesDelete(nodesToDelete);
    },
    [performNodesDelete]
  );


  const handleDeleteSuccess = (nodeId: string) => {
    setSelectedNote(null);
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
  };

  const downloadImage = () => {
    const canvasElement = document.querySelector('.react-flow') as HTMLElement;
    if (!canvasElement) return;

    toPng(canvasElement, {
      backgroundColor: '#09090b',
      quality: 1,
      pixelRatio: 2,
    }).then((dataUrl) => {
      const a = document.createElement('a');
      a.setAttribute('download', `Konstelasi_Export_${new Date().toISOString().split('T')[0]}.png`);
      a.setAttribute('href', dataUrl);
      a.click();
    }).catch((err) => {
      console.error('Failed to export canvas', err);
    });
  };

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes);
      queueLayoutChanges(changes);
    },
    [onNodesChange, queueLayoutChanges]
  );

  const { createNoteFromEvent: handleCanvasContextMenu, createNoteAtCenter: handleCreateAtCenter } =
    useNoteCreation();

  // Keyboard shortcut: 'N' to create new note (only when not typing).
  useEffect(() => {
    const handleN = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
      if (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateAtCenter();
      }
    };

    window.addEventListener('keydown', handleN);
    return () => window.removeEventListener('keydown', handleN);
  }, [handleCreateAtCenter]);

  // Undo/Redo keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z
  useEffect(() => {
    const handleUndoRedo = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
      if (isTyping) return;
      e.preventDefault();
      if (e.shiftKey) {
        const snapshot = redo();
        if (snapshot) { setNodes(snapshot.nodes); setEdges(snapshot.edges); }
      } else {
        const snapshot = undo();
        if (snapshot) { setNodes(snapshot.nodes); setEdges(snapshot.edges); }
      }
    };

    window.addEventListener('keydown', handleUndoRedo);
    return () => window.removeEventListener('keydown', handleUndoRedo);
  }, [undo, redo, setNodes, setEdges]);

  if (loading) return <CanvasSkeleton />;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FFFAF7] space-y-4">
      <div className="text-[#FF6B9D] font-medium text-lg">Error loading canvas</div>
      <p className="text-[#5A3E4C]/50 text-sm">{error.message}</p>
      <button onClick={() => refetch()} className="px-6 py-2.5 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50">
        Retry
      </button>
    </div>
  );

  return (
    <div className="w-full h-screen relative bg-[#FFFAF7] overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,180,162,0.1),_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#FFCAD4]/15 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#FFB4A2]/15 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />

      {/* ── Header ── */}
      <CanvasToolbar
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activePanel={activePanel}
        onTogglePanel={togglePanel}
        onActivateSearchPanel={() => setActivePanel('search')}
        selectedTagFiltersCount={selectedTagFilters.length}
        onApplyAutoLayout={() => applyAutoLayout()}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => { const s = undo(); if (s) { setNodes(s.nodes); setEdges(s.edges); } }}
        onRedo={() => { const s = redo(); if (s) { setNodes(s.nodes); setEdges(s.edges); } }}
      />

      {/* ── Canvas or Thread View ── */}
      <div className="w-full h-full pt-16 relative z-0" onContextMenu={handleCanvasContextMenu}>
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
            <Background color="rgba(255,180,162,0.06)" gap={24} size={1.5} />
            <Controls className="!bg-white/80 !border-[#FFB4A2]/15 !backdrop-blur-xl !shadow-lg !rounded-xl overflow-hidden" />
            <MiniMap 
              className="!bg-white/80 !border-[#FFB4A2]/15 !backdrop-blur-xl !shadow-lg !rounded-2xl overflow-hidden" 
              nodeColor={(n) => n.id === selectedNote?.id ? '#FF8FA3' : 'rgba(255,180,162,0.3)'}
              maskColor="rgba(255,250,247,0.4)"
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

        {/* Footer: hint + FAB */}
        {viewMode === 'canvas' && <CanvasFooter onCreate={handleCreateAtCenter} />}

        {/* Empty state overlay (only when canvas has no notes) */}
        {viewMode === 'canvas' && !loading && nodes.length === 0 && (
          <CanvasEmptyState onCreate={handleCreateAtCenter} />
        )}
      </div>

      {/* ── Editor Sidebar ── */}
      {selectedNote && (
        <NoteEditorSidebar 
          note={selectedNote}
          allNotes={data?.getNotes || []}
          onClose={() => { setSelectedNote(null); restoreFocus(); }}
          onUpdateCache={handleUpdateCache}
          onDeleteSuccess={handleDeleteSuccess}
          onNavigate={(id) => handleNodeDoubleClick(id)}
        />
      )}

      {/* ── Tag Panel ── */}
      {activePanel === 'tag' && (
        <TagPanel onClose={closePanel} />
      )}

      {/* ── Search Panel ── */}
      {activePanel === 'search' && data?.getNotes && (
        <SearchPanel
          notes={data.getNotes}
          onNoteClick={(noteId) => { handleNodeDoubleClick(noteId); closePanel(); }}
          onClose={closePanel}
        />
      )}

      {/* ── Stats Panel ── */}
      {activePanel === 'stats' && data?.getNotes && (
        <AdvancedAnalyticsPanel
          isOpen={true}
          notes={data.getNotes}
          onClose={closePanel}
        />
      )}

      {/* ── Archive Panel ── */}
      <ArchivePanel
        isOpen={activePanel === 'archive'}
        onClose={closePanel}
        onRestoreSuccess={() => refetch()}
      />

      {/* ── Export Panel ── */}
      {activePanel === 'export' && data?.getNotes && (
        <ExportPanel
          isOpen={true}
          onClose={closePanel}
          notes={data.getNotes}
        />
      )}

      {/* ── Calendar Panel ── */}
      {activePanel === 'calendar' && data?.getNotes && (
        <CalendarPanel
          isOpen={true}
          onClose={closePanel}
          notes={data.getNotes}
          onNoteClick={(noteId) => { handleNodeDoubleClick(noteId); closePanel(); }}
        />
      )}

      <ConfirmDialog
        open={pendingDelete.length > 0}
        title={`Hapus ${pendingDelete.length} catatan?`}
        description="Aksi ini akan menghapus semua catatan terpilih beserta koneksinya. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus semua"
        variant="danger"
        onCancel={() => setPendingDelete([])}
        onConfirm={() => {
          performNodesDelete(pendingDelete);
          setPendingDelete([]);
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
