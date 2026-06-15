'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFocusRestore } from '../hooks/useFocusRestore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useNoteCreation } from '../hooks/useNoteCreation';
import { useCanvasData } from '../hooks/useCanvasData';
import { useCanvasShortcuts } from '../hooks/useCanvasShortcuts';
import { useCanvasUI } from '../hooks/use-canvas-ui';
import { useCanvasMutations } from '../hooks/use-canvas-mutations';
import { useCanvasHandlers } from '../hooks/use-canvas-handlers';
import {
  CanvasActionsProvider,
  type CanvasActions,
} from '../context/CanvasActionsContext';
import { CanvasDataProvider } from '../context/CanvasDataContext';

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
import { CanvasPanelRenderer } from './CanvasPanelRenderer';
import { CanvasAmbientGlow } from './CanvasAmbientGlow';
import { CanvasErrorBoundary } from '../boundaries/CanvasErrorBoundary';
import ConfirmDialog from '@/components/ConfirmDialog';

const nodeTypes = { default: NoteNode };
const edgeTypes = { semanticEdge: SemanticEdge };

function DiaryCanvasInner() {
  const { saveFocus, restoreFocus } = useFocusRestore();
  const { setViewMode, setSearchQuery, viewMode, searchQuery, activePanel, closePanel, openPanel, selectedNote, setSelectedNote, pendingDelete, clearPendingDelete } = useCanvasUI();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { screenToFlowPosition } = useReactFlow();

  const { batchUpdateNotes } = useCanvasMutations();
  const { createNoteFromEvent: handleCanvasContextMenu, createNoteAtCenter: handleCreateAtCenter } = useNoteCreation();

  // Edge operations need handleEdgeLabelChange for useCanvasData
  // but useCanvasHandlers doesn't need it (label is set via the panel).
  // We wire a no-op for now (preserves prior behavior).
  const handleEdgeLabelChange = useCallback(() => {}, []);

  const { data, loading, error, refetch } = useCanvasData({
    onNodeDoubleClick: () => {},
    handleEdgeLabelChange,
    setNodes,
    setEdges,
  });

  const actions: CanvasActions = useCanvasHandlers({
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    data,
    batchUpdateNotes,
  });

  // Hooks that need to fire effects after actions are wired
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigateRef = useRef<(id: string) => void>(() => {});
  useKeyboardNavigation(nodes, selectedNote?.id ?? null, navigateRef);
  navigateRef.current = actions.handleNodeDoubleClick;

  useCanvasShortcuts({
    searchInputRef,
    onCreateAtCenter: handleCreateAtCenter,
    onUndo: actions.applyUndo,
    onRedo: actions.applyRedo,
  });

  if (loading) return <CanvasSkeleton />;
  if (error) return <CanvasError message={error.message} onRetry={() => refetch()} />;

  return (
    <CanvasErrorBoundary>
      <CanvasActionsProvider value={actions}>
        <CanvasDataProvider value={{ notes: data?.getNotes ?? [], refetch }}>
          <div className="h-screen flex flex-col bg-[#F7F1EA] overflow-hidden">
            <CanvasToolbar
              searchInputRef={searchInputRef}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activePanel={activePanel}
              onTogglePanel={(panel) => {
                if (useCanvasUIStore.getState().activePanel !== panel) saveFocus();
                else restoreFocus();
                useCanvasUIStore.getState().togglePanel(panel);
              }}
              onActivateSearchPanel={() => openPanel('search')}
              selectedTagFiltersCount={0}
              onApplyAutoLayout={() => {}}
              canUndo={false}
              canRedo={false}
              onUndo={actions.applyUndo}
              onRedo={actions.applyRedo}
            />

            <div className="flex-1 flex min-h-0">
              <div
                className="flex-1 min-w-0 relative bg-[#F7F1EA]"
                onContextMenu={handleCanvasContextMenu}
              >
                <CanvasAmbientGlow />

                {viewMode === 'canvas' ? (
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={actions.handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={actions.handleConnect}
                    onNodesDelete={actions.handleNodesDelete}
                    onEdgesDelete={actions.handleEdgesDelete}
                    connectionMode={ConnectionMode.Loose}
                    defaultEdgeOptions={{ type: 'semanticEdge', animated: true }}
                    onNodeDoubleClick={(_, node) => actions.handleNodeDoubleClick(node.id)}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 2 }}
                  >
                    <Background color="rgba(47, 39, 48, 0.08)" gap={28} size={1.2} />
                    <Controls className="!bg-[#FFFCF8]/85 !border-[rgba(47,39,48,0.08)] !backdrop-blur-xl !shadow-md !rounded-[12px] overflow-hidden" />
                  </ReactFlow>
                ) : (
                  <ThreadView
                    nodes={nodes}
                    selectedNoteId={selectedNote?.id}
                    onNodeClick={actions.handleNodeDoubleClick}
                  />
                )}

                {viewMode === 'timeline' && data?.getNotes && (
                  <TimelineView
                    notes={data.getNotes}
                    onNoteClick={actions.handleNodeDoubleClick}
                    selectedNoteId={selectedNote?.id}
                  />
                )}

                {viewMode === 'canvas' && <CanvasFooter onCreate={handleCreateAtCenter} />}
                {viewMode === 'canvas' && !loading && nodes.length === 0 && (
                  <CanvasEmptyState onCreate={handleCreateAtCenter} />
                )}

                <CanvasPanelRenderer />
              </div>

              {selectedNote && (
                <NoteEditorSidebar
                  note={selectedNote}
                  allNotes={data?.getNotes || []}
                  onClose={() => { setSelectedNote(null); restoreFocus(); }}
                  onUpdateCache={actions.handleUpdateCache}
                  onDeleteSuccess={actions.handleDeleteSuccess}
                  onNavigate={actions.handleNodeDoubleClick}
                />
              )}
            </div>

            <ConfirmDialog
              open={pendingDelete.length > 0}
              title={`Delete ${pendingDelete.length} note${pendingDelete.length > 1 ? 's' : ''}?`}
              description="This will delete all selected notes and their connections. This action cannot be undone."
              confirmLabel="Delete all"
              variant="danger"
              onCancel={clearPendingDelete}
              onConfirm={() => {
                // performNodesDelete is internal; trigger via the store action path.
                // For multi-delete we call performNodesDelete on the pending list.
                actions.handleNodesDelete(pendingDelete);
                clearPendingDelete();
              }}
            />
          </div>
        </CanvasDataProvider>
      </CanvasActionsProvider>
    </CanvasErrorBoundary>
  );
}

export default function DiaryCanvas() {
  return (
    <ReactFlowProvider>
      <DiaryCanvasInner />
    </ReactFlowProvider>
  );
}

// Re-export for inline use above
import { useCanvasUIStore } from '../store/useCanvasUIStore';
