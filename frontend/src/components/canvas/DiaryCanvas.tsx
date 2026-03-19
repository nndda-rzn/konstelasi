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
import { CREATE_NOTE, UPDATE_NOTE_POSITION, CREATE_NOTE_LINK, DELETE_NOTE_LINK, UPDATE_NOTE_LINK, DELETE_NOTE } from '@/graphql/mutations';
import NoteNode from './NoteNode';
import SemanticEdge from './SemanticEdge';
import NoteEditorSidebar from './NoteEditorSidebar';
import { Loader2, LogOut, Sparkles, Search, Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';

const nodeTypes = {
  default: NoteNode,
};

const edgeTypes = {
  semanticEdge: SemanticEdge,
};

let debounceTimer: NodeJS.Timeout;

export default function DiaryCanvas() {
  const router = useRouter();
  const supabase = createClient();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, refetch } = useQuery<any>(GET_NOTES, {
    fetchPolicy: 'cache-and-network',
    ssr: false
  });
  
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [updateNotePosition] = useMutation<any>(UPDATE_NOTE_POSITION);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation<any>(DELETE_NOTE_LINK);
  const [updateNoteLink] = useMutation<any>(UPDATE_NOTE_LINK);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);

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
          incomingEdges: note.incomingEdges,
          isSearching: searchQuery !== '',
          isMatch: true,
          onDoubleClick: () => handleNodeDoubleClick(note.id)
        },
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
      if (!note) {
        const localNode = currentNodes.find((n: any) => n.id === nodeId);
        if (localNode) {
          note = {
            id: localNode.id,
            title: localNode.data.title,
            content: localNode.data.content,
            images: localNode.data.images || [],
            color: localNode.data.color || 'default',
            positionX: localNode.position.x,
            positionY: localNode.position.y,
          };
        }
      }
      
      if (note) {
        setTimeout(() => setSelectedNote(note), 0);
      }
      return currentNodes;
    });
  };

  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string, newImages?: any[], color?: string) => {
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
      
      const positionChanges = changes.filter(
        (c) => c.type === 'position' && c.dragging === false && c.position
      );

      if (positionChanges.length > 0) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          positionChanges.forEach((change: any) => {
            updateNotePosition({
              variables: {
                input: {
                  id: change.id,
                  positionX: change.position.x,
                  positionY: change.position.y,
                }
              }
            });
          });
        }, 500); 
      }
    },
    [onNodesChange, updateNotePosition]
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
                    { ...createNote, content: '', images: [], outgoingEdges: [], incomingEdges: [] }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0f0f14]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin w-12 h-12 text-red-400" />
        </div>
        <p className="text-white/40 text-sm font-medium tracking-wider uppercase">Loading your constellation...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f14] space-y-4">
      <div className="text-red-400 font-medium text-lg">Error loading canvas</div>
      <p className="text-white/40 text-sm">{error.message}</p>
      <button onClick={() => refetch()} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50">
        Retry
      </button>
    </div>
  );

  return (
    <div className="w-full h-screen relative bg-[#09090b] overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />

      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#09090b]/60 backdrop-blur-3xl border-b border-white/[0.04] z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-red-200 via-rose-300 to-amber-100 bg-clip-text text-transparent tracking-tight">
              Konstelasi
            </h1>
          </div>
          
          <div className="hidden md:flex items-center relative ml-4">
            <Search className="w-4 h-4 text-white/30 absolute left-3 z-10" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search thoughts (Ctrl+F)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white/[0.03] border border-white/[0.06] rounded-full pl-9 pr-4 py-1.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all hover:bg-white/[0.05]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={downloadImage}
            title="Export Canvas to PNG"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/20 text-white/70 hover:text-white transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Export</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-inner text-xs font-medium text-white/50 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
            Auto-saving
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-red-500/30 text-white/70 hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(220,38,38,0)] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Exit</span>
          </button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="w-full h-full pt-16 relative z-0" onContextMenu={handleCanvasContextMenu}>
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
          <Background color="rgba(255,255,255,0.03)" gap={24} size={1.5} />
          <Controls className="!bg-[#13131c]/80 !border-white/[0.06] !backdrop-blur-xl !shadow-2xl !rounded-xl overflow-hidden" />
          <MiniMap 
            className="!bg-[#13131c]/60 !border-white/[0.06] !backdrop-blur-xl !shadow-2xl !rounded-2xl overflow-hidden" 
            nodeColor={(n) => n.id === selectedNote?.id ? '#ef4444' : 'rgba(255,255,255,0.1)'}
            maskColor="rgba(0,0,0,0.4)"
          />
        </ReactFlow>

        {/* Floating Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/40 backdrop-blur-xl border border-white/[0.08] text-white/50 text-sm rounded-full shadow-2xl pointer-events-none tracking-wide font-light flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
          Right-click anywhere to create a new thought
        </div>
      </div>

      {/* ── Editor Sidebar ── */}
      {selectedNote && (
        <NoteEditorSidebar 
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdateCache={handleUpdateCache}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
