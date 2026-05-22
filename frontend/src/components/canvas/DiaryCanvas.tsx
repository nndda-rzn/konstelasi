'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Edge,
  Node,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_NOTES } from '@/graphql/queries';
import { CREATE_NOTE, BATCH_UPDATE_NOTES, CREATE_NOTE_LINK, DELETE_NOTE_LINK, UPDATE_NOTE_LINK, DELETE_NOTE } from '@/graphql/mutations';
import NoteNode from './NoteNode';
import SemanticEdge from './SemanticEdge';
import NoteEditorSidebar from './NoteEditorSidebar';
import TimelineView from './TimelineView';
import { Loader2, Sparkles, Search, Download, LayoutTemplate, List, Tag as TagIcon, Clock, BarChart3, Archive, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useCanvas } from '@/context/CanvasContext';
import { useTags } from '@/context/TagContext';
import TagPanel from '@/features/canvas/panels/TagPanel';
import SearchPanel from '@/features/canvas/panels/SearchPanel';
import StatsPanel from '@/features/canvas/panels/StatsPanel';
import ArchivePanel from '@/features/canvas/panels/ArchivePanel';
import StreakWidget from './StreakWidget';
import ExportPanel from '@/features/canvas/panels/ExportPanel';
import CalendarPanel from '@/features/canvas/panels/CalendarPanel';
import AdvancedAnalyticsPanel from '@/features/canvas/panels/AdvancedAnalyticsPanel';
import { useAutoLayout } from '@/features/canvas/hooks/useAutoLayout';

const nodeTypes = {
  default: NoteNode,
};

const edgeTypes = {
  semanticEdge: SemanticEdge,
};

export default function DiaryCanvas() {
  const router = useRouter();
  const { selectedCanvasId } = useCanvas();
  const { selectedTagFilters } = useTags();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'canvas' | 'thread' | 'timeline'>('canvas');
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showArchivePanel, setShowArchivePanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pendingNodeLayoutChanges = useRef<Map<string, any>>(new Map());
  const saveNodeLayoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, loading, error, refetch } = useQuery<any>(GET_NOTES, {
    variables: { 
      canvasId: selectedCanvasId || undefined,
      tagIds: selectedTagFilters.length > 0 ? selectedTagFilters : undefined,
    },
    fetchPolicy: 'cache-and-network',
    ssr: false
  });
  
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [batchUpdateNotes] = useMutation<any>(BATCH_UPDATE_NOTES);
  const { applyAutoLayout } = useAutoLayout({
    nodes: data?.getNotes || [],
    onApplied: () => { refetch(); },
  });
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation<any>(DELETE_NOTE_LINK);
  const [updateNoteLink] = useMutation<any>(UPDATE_NOTE_LINK);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);

  const flushPendingNodeLayoutChanges = useCallback(() => {
    const inputsArray = Array.from(pendingNodeLayoutChanges.current.values());
    pendingNodeLayoutChanges.current.clear();
    saveNodeLayoutTimer.current = null;

    if (inputsArray.length === 0) return;

    batchUpdateNotes({
      variables: { inputs: inputsArray }
    }).catch((err) => {
      console.error('Failed to save note layout changes:', err);
    });
  }, [batchUpdateNotes]);

  useEffect(() => {
    return () => {
      if (saveNodeLayoutTimer.current) clearTimeout(saveNodeLayoutTimer.current);
      flushPendingNodeLayoutChanges();
    };
  }, [flushPendingNodeLayoutChanges]);

  useEffect(() => {
    if (data && data.getNotes) {
      const initialNodes = data.getNotes.map((note: any) => ({
        id: note.id,
        type: 'default',
        position: { x: note.positionX, y: note.positionY },
        data: { 
          title: note.title, 
          content: note.content,
          images: note.images,
          color: note.color || 'default',
          type: note.type || 'default',
          mood: note.mood || '',
          incomingEdges: note.incomingEdges,
          outgoingEdges: note.outgoingEdges,
          tags: note.tags || [],
          createdAt: note.createdAt || new Date().toISOString(),
          isSearching: searchQuery !== '',
          isMatch: true,
          onDoubleClick: () => handleNodeDoubleClick(note.id)
        },
        style: {
          width: note.width || undefined,
          height: note.height || undefined,
        }
      }));

      const initialEdges: Edge[] = [];
      data.getNotes.forEach((note: any) => {
        note.outgoingEdges.forEach((edge: any) => {
          initialEdges.push({
            id: edge.id,
            type: 'semanticEdge',
            source: edge.source.id,
            target: edge.target.id,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            data: {
              label: edge.label || '',
              color: note.color || 'default',
              onLabelChange: handleEdgeLabelChange
            }
          });
        });
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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F for Global Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault(); // Prevent browser default search
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNodeDoubleClick = (nodeId: string) => {
    let note = data?.getNotes?.find((n: any) => n.id === nodeId);
    
    setNodes((currentNodes) => {
      const localNode = currentNodes.find((n: any) => n.id === nodeId);
      
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
        setTimeout(() => setSelectedNote(note), 0);
      }
      return currentNodes;
    });
  };

  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string, newImages?: any[], color?: string, mood?: string) => {
    setNodes((nds: any[]) => nds.map(n => {
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

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach(node => {
        deleteNote({ variables: { id: node.id } }).catch(console.error);
      });
      setSelectedNote(null);
    },
    [deleteNote]
  );

  const handleEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach(edge => {
        deleteNoteLink({ variables: { id: edge.id } }).catch(console.error);
      });
    },
    [deleteNoteLink]
  );

  const handleDeleteSuccess = (nodeId: string) => {
    setSelectedNote(null);
    setNodes((nds: any[]) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds: any[]) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
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

  const handleEdgeLabelChange = async (edgeId: string, newLabel: string) => {
    setEdges((eds) => eds.map((e) => {
      if (e.id === edgeId) {
        return { ...e, data: { ...e.data, label: newLabel } };
      }
      return e;
    }));

    try {
      await updateNoteLink({
        variables: {
          input: { id: edgeId, label: newLabel }
        }
      });
    } catch (err) {
      console.error("Failed to update edge label", err);
    }
  };

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes);

      changes.forEach((change: any) => {
        const isFinalPosition = change.type === 'position' && change.dragging === false && change.position;
        const isFinalDimensions = change.type === 'dimensions' && change.resizing === false && change.dimensions;
        if (!isFinalPosition && !isFinalDimensions) return;

        const pending = pendingNodeLayoutChanges.current;
        const input = pending.get(change.id) || { id: change.id };

        if (isFinalPosition) {
          input.positionX = change.position.x;
          input.positionY = change.position.y;
        }

        if (isFinalDimensions) {
          input.width = change.dimensions.width;
          input.height = change.dimensions.height;
        }

        pending.set(change.id, input);
      });

      if (pendingNodeLayoutChanges.current.size === 0) return;
      if (saveNodeLayoutTimer.current) clearTimeout(saveNodeLayoutTimer.current);
      saveNodeLayoutTimer.current = setTimeout(flushPendingNodeLayoutChanges, 500);
    },
    [onNodesChange, flushPendingNodeLayoutChanges]
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      const sourceNode = nodes.find((n: any) => n.id === params.source);
      
      const newEdge = { 
        ...params, 
        id: `temp-${Date.now()}`,
        type: 'semanticEdge',
        data: {
          label: '',
          color: sourceNode?.data?.color || 'default',
          onLabelChange: handleEdgeLabelChange
        },
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      try {
        const { data } = await createNoteLink({
          variables: {
            input: {
              sourceId: params.source,
              targetId: params.target,
              sourceHandle: params.sourceHandle,
              targetHandle: params.targetHandle
            }
          },
          update(cache, { data: { createNoteLink } }) {
            try {
              const existingData: any = cache.readQuery({ query: GET_NOTES });
              if (existingData && existingData.getNotes) {
                const newData = {
                  getNotes: existingData.getNotes.map((note: any) => {
                    if (note.id === params.source) {
                      // Filter out the edge if it already exists (handling both fully resolved objects and Apollo __ref pointers)
                      const cleanedEdges = note.outgoingEdges.filter((e: any) => {
                        if (e.id && e.id === createNoteLink.id) return false;
                        if (e.__ref && typeof e.__ref === 'string' && e.__ref.includes(createNoteLink.id)) return false;
                        return true;
                      });
                      
                      return {
                        ...note,
                        outgoingEdges: [...cleanedEdges, createNoteLink]
                      };
                    }
                    return note;
                  })
                };
                cache.writeQuery({ query: GET_NOTES, data: newData });
              }
            } catch (e) {
              console.error("Cache update failed", e);
            }
          }
        });
        
        if (data?.createNoteLink) {
          setEdges((eds) => {
            const edgeExists = eds.some(e => e.id === data.createNoteLink.id && e.id !== newEdge.id);
            if (edgeExists) {
              // Edge already existed! Remove the temp edge and visually update the existing one.
              return eds
                .filter(e => e.id !== newEdge.id)
                .map(e => e.id === data.createNoteLink.id 
                  ? { ...e, sourceHandle: params.sourceHandle, targetHandle: params.targetHandle } 
                  : e
                );
            }
            // It's a new edge, rename the temp ID to the real database ID
            return eds.map(e => e.id === newEdge.id ? { ...e, id: data.createNoteLink.id } : e);
          });
        }
      } catch (err) {
        console.error("Failed to create link", err);
        setEdges((eds) => eds.filter(e => e.id !== newEdge.id));
      }
    },
    [setEdges, createNoteLink]
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        if (!edge.id.startsWith('temp-')) {
          deleteNoteLink({ variables: { id: edge.id } });
        }
      });
    },
    [deleteNoteLink]
  );

  const handleCanvasContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    try {
      const { data } = await createNote({
        variables: {
          input: {
            title: "New Note",
            positionX: x,
            positionY: y
          }
        },
        update(cache, { data: { createNote } }) {
          try {
            const existingData: any = cache.readQuery({ query: GET_NOTES });
            if (existingData && existingData.getNotes) {
              cache.writeQuery({
                query: GET_NOTES,
                data: {
                  getNotes: [
                    ...existingData.getNotes,
                    { ...createNote, content: '', images: [], outgoingEdges: [], incomingEdges: [], tags: [], createdAt: new Date().toISOString() }
                  ]
                }
              });
            }
          } catch (e) {
            console.error("Cache update failed", e);
          }
        }
      });

    } catch (err) {
      console.error("Failed to create node", err);
    }
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFFAF7]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FFB4A2]/20 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin w-12 h-12 text-[#FF8FA3]" />
        </div>
        <p className="text-[#5A3E4C]/40 text-sm font-medium tracking-wider uppercase">Loading your constellation...</p>
      </div>
    </div>
  );

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
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#FFFAF7]/60 backdrop-blur-3xl border-b border-[#FFB4A2]/10 z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-lg shadow-pink-300/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] via-[#FFB4A2] to-[#FFD6A5] bg-clip-text text-transparent tracking-tight">
              Konstelasi
            </h1>
          </div>
          
          <div className="hidden md:flex items-center relative ml-4">
            <Search className="w-4 h-4 text-[#5A3E4C]/30 absolute left-3 z-10" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search thoughts (Ctrl+F)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchPanel(true)}
              className="w-64 bg-white/60 border border-[#FFB4A2]/15 rounded-full pl-9 pr-4 py-1.5 text-sm text-[#5A3E4C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40 focus:border-[#FF8FA3]/40 transition-all hover:bg-white/80"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/60 border border-[#FFB4A2]/15 rounded-xl p-1">
            <button
              onClick={() => setViewMode('canvas')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'canvas' ? 'bg-white text-[#5A3E4C] shadow-sm' : 'text-[#5A3E4C]/40 hover:text-[#5A3E4C]/70'}`}
              title="Canvas View"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('thread')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'thread' ? 'bg-white text-[#5A3E4C] shadow-sm' : 'text-[#5A3E4C]/40 hover:text-[#5A3E4C]/70'}`}
              title="Thread View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'timeline' ? 'bg-white text-[#5A3E4C] shadow-sm' : 'text-[#5A3E4C]/40 hover:text-[#5A3E4C]/70'}`}
              title="Timeline View"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setShowExportPanel(!showExportPanel)}
            title="Export"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${showExportPanel ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#5A3E4C]'}`}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Export</span>
          </button>

          <button 
            onClick={() => setShowTagPanel(!showTagPanel)}
            title="Tags"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${showTagPanel ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#5A3E4C]'}`}
          >
            <TagIcon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Tags</span>
            {selectedTagFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF8FA3] text-white text-[10px] flex items-center justify-center font-bold">{selectedTagFilters.length}</span>
            )}
          </button>

          <button 
            onClick={() => setShowStatsPanel(!showStatsPanel)}
            title="Statistik"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${showStatsPanel ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#5A3E4C]'}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setShowCalendarPanel(!showCalendarPanel)}
            title="Kalender"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${showCalendarPanel ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#5A3E4C]'}`}
          >
            <Clock className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setShowArchivePanel(!showArchivePanel)}
            title="Arsip"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${showArchivePanel ? 'bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]' : 'bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#5A3E4C]'}`}
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => applyAutoLayout()}
            title="Auto-Organize: rapikan node otomatis"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 bg-white/60 hover:bg-white/80 border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 text-[#5A3E4C]/70 hover:text-[#FF8FA3]"
          >
            <Wand2 className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Auto Layout</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-[#FFB4A2]/15 shadow-inner text-xs font-medium text-[#5A3E4C]/50 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF8FA3] shadow-[0_0_8px_rgba(255,143,163,0.6)] animate-pulse" />
            Auto-saving
          </div>

          <StreakWidget />
        </div>
      </div>

      {/* ── Canvas or Thread View ── */}
      <div className="w-full h-full pt-16 relative z-0" onContextMenu={handleCanvasContextMenu}>
        {viewMode === 'canvas' ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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
          <div className="w-full h-full overflow-y-auto pb-32">
            <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col gap-8">
              {nodes
                .filter((node: any) => node.data.isMatch)
                .sort((a: any, b: any) => {
                  const dateA = new Date(a.data.createdAt || 0).getTime();
                  const dateB = new Date(b.data.createdAt || 0).getTime();
                  return dateA - dateB;
                })
                .map((node: any) => {
                  // Determine alignment based on tags
                  // Assuming tags like "crush", "dia", "him", "her", or specific quotes mean the other person
                  const tags = node.data.tags || [];
                  const isOtherPerson = tags.some((t: any) => 
                    ['crush', 'dia', 'him', 'her', 'quote', 'kutipan'].includes(t.name.toLowerCase())
                  );
                  const alignClass = isOtherPerson ? 'justify-start' : 'justify-end';
                  const radiusClass = isOtherPerson ? 'rounded-tl-sm' : 'rounded-tr-sm';

                  return (
                    <div 
                      key={node.id} 
                      className={`flex ${alignClass} animate-in fade-in slide-in-from-bottom-4 duration-500 w-full`}
                    >
                      <div className="flex flex-col max-w-[85%]">
                        {/* Optionally show incoming relations in thread view */}
                        {node.data.incomingEdges && node.data.incomingEdges.length > 0 && (
                          <div className={`text-xs text-[#5A3E4C]/30 mb-1 px-2 flex flex-col gap-0.5 ${isOtherPerson ? 'items-start' : 'items-end'}`}>
                            {node.data.incomingEdges.map((edge: any, i: number) => (
                              <span key={i} className="flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                Reply to: {edge.source?.title || 'a thought'}
                              </span>
                            ))}
                          </div>
                        )}

                        <div 
                          className={`cursor-pointer transition-transform hover:scale-[1.02]`}
                          onClick={() => handleNodeDoubleClick(node.id)}
                        >
                          <NoteNode data={{...node.data, _threadAlign: isOtherPerson ? 'left' : 'right'}} isConnectable={false} selected={selectedNote?.id === node.id} viewMode={viewMode} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {nodes.filter((node: any) => node.data.isMatch).length === 0 && (
                  <div className="text-center text-[#5A3E4C]/30 py-20">
                    No thoughts match your search.
                  </div>
                )}
            </div>
          </div>
        )}

        {viewMode === 'timeline' && data?.getNotes && (
          <TimelineView
            notes={data.getNotes}
            onNoteClick={(noteId) => handleNodeDoubleClick(noteId)}
            selectedNoteId={selectedNote?.id}
          />
        )}

        {/* Floating Hint */}
        {viewMode === 'canvas' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-[#FFB4A2]/15 text-[#5A3E4C]/50 text-sm rounded-full shadow-lg pointer-events-none tracking-wide font-light flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8FA3] shadow-[0_0_8px_rgba(255,143,163,0.6)] animate-pulse" />
            Right-click anywhere to create a new thought
          </div>
        )}
      </div>

      {/* ── Editor Sidebar ── */}
      {selectedNote && (
        <NoteEditorSidebar 
          note={selectedNote}
          allNotes={data?.getNotes || []}
          onClose={() => setSelectedNote(null)}
          onUpdateCache={handleUpdateCache}
          onDeleteSuccess={handleDeleteSuccess}
          onNavigate={(id) => handleNodeDoubleClick(id)}
        />
      )}

      {/* ── Tag Panel ── */}
      {showTagPanel && (
        <TagPanel onClose={() => setShowTagPanel(false)} />
      )}

      {/* ── Search Panel ── */}
      {showSearchPanel && data?.getNotes && (
        <SearchPanel
          notes={data.getNotes}
          onNoteClick={(noteId) => { handleNodeDoubleClick(noteId); setShowSearchPanel(false); }}
          onClose={() => setShowSearchPanel(false)}
        />
      )}

      {/* ── Stats Panel ── */}
      {showStatsPanel && data?.getNotes && (
        <AdvancedAnalyticsPanel
          isOpen={showStatsPanel}
          notes={data.getNotes}
          onClose={() => setShowStatsPanel(false)}
        />
      )}

      {/* ── Archive Panel ── */}
      <ArchivePanel
        isOpen={showArchivePanel}
        onClose={() => setShowArchivePanel(false)}
        onRestoreSuccess={() => refetch()}
      />

      {/* ── Export Panel ── */}
      {showExportPanel && data?.getNotes && (
        <ExportPanel
          isOpen={showExportPanel}
          onClose={() => setShowExportPanel(false)}
          notes={data.getNotes}
        />
      )}

      {/* ── Calendar Panel ── */}
      {showCalendarPanel && data?.getNotes && (
        <CalendarPanel
          isOpen={showCalendarPanel}
          onClose={() => setShowCalendarPanel(false)}
          notes={data.getNotes}
          onNoteClick={(noteId) => { handleNodeDoubleClick(noteId); setShowCalendarPanel(false); }}
        />
      )}
    </div>
  );
}
