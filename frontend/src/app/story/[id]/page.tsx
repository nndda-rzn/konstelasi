'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Settings, Lock, Globe, Users, Eye, LayoutGrid, Clock, BookOpen, Image, List, BarChart3, Download, PenTool, Heart } from 'lucide-react';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';
import { GET_STORY, UPDATE_STORY, ADD_NODE_TO_STORY } from '@/graphql/story';
import { CREATE_NOTE, CREATE_NOTE_LINK } from '@/graphql/mutations';
import { ThemeProvider } from '@/context/ThemeContext';
import StorySettingsPanel from '@/components/story/StorySettingsPanel';
import StoryNode from '@/components/story/StoryNode';
import StoryEdge from '@/components/story/StoryEdge';
import NodeTypeSelector from '@/components/story/NodeTypeSelector';
import StoryTimelineView from '@/components/story/StoryTimelineView';
import StoryReadingView from '@/components/story/StoryReadingView';
import StoryGalleryView from '@/components/story/StoryGalleryView';
import StoryOutlineView from '@/components/story/StoryOutlineView';
import StoryAnalyticsPanel from '@/components/story/StoryAnalyticsPanel';
import StoryExportPanel from '@/components/story/StoryExportPanel';
import StoryNodeEditor from '@/components/story/StoryNodeEditor';
import WritingStatsPanel from '@/components/story/WritingStatsPanel';
import EmotionalArcPanel from '@/components/story/EmotionalArcPanel';

const nodeTypes = { storyNode: StoryNode };
const edgeTypes = { storyEdge: StoryEdge };

function StoryCanvas({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storyId = params.id;
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'timeline' | 'reading' | 'gallery' | 'outline'>('canvas');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showWritingStats, setShowWritingStats] = useState(false);
  const [showEmotionalArc, setShowEmotionalArc] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const { data, loading, refetch } = useQuery<any>(GET_STORY, {
    variables: { id: storyId },
    fetchPolicy: 'cache-and-network',
  });

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [updateStory] = useMutation<any>(UPDATE_STORY);
  const [addNodeToStory] = useMutation<any>(ADD_NODE_TO_STORY);

  const story = data?.getStory;

  // Transform story nodes to React Flow nodes
  useEffect(() => {
    if (!story?.nodes) return;
    const flowNodes = story.nodes.map((note: any) => ({
      id: note.id,
      position: { x: note.positionX, y: note.positionY },
      data: {
        title: note.title,
        content: note.content,
        color: note.color,
        mood: note.mood,
        storyNodeType: note.storyNodeType,
        storyMetadata: note.storyMetadata,
        isLocked: note.isLocked,
        images: note.images || [],
        tags: note.tags || [],
      },
      type: 'storyNode',
    }));

    const flowEdges: any[] = [];
    story.nodes.forEach((note: any) => {
      note.outgoingEdges?.forEach((edge: any) => {
        flowEdges.push({
          id: edge.id,
          source: edge.source.id,
          target: edge.target.id,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          data: { label: edge.label, color: edge.color },
          type: 'storyEdge',
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [story, setNodes, setEdges]);

  const onConnect = useCallback(async (connection: any) => {
    try {
      await createNoteLink({
        variables: {
          input: {
            sourceId: connection.source,
            targetId: connection.target,
            sourceHandle: connection.sourceHandle || 'right',
            targetHandle: connection.targetHandle || 'left',
          },
        },
      });
      setEdges(eds => addEdge(connection, eds));
    } catch (err) {
      console.error('Failed to create connection:', err);
    }
  }, [createNoteLink, setEdges]);

  const handleAddNode = async (nodeType: string, title: string, emotion: string, metadata: any) => {
    const position = { x: Math.random() * 500 + 100, y: Math.random() * 400 + 100 };
    try {
      const { data: noteData } = await createNote({
        variables: {
          input: {
            title,
            positionX: position.x,
            positionY: position.y,
          },
        },
      });
      if (noteData?.createNote) {
        await addNodeToStory({
          variables: {
            storyId,
            noteId: noteData.createNote.id,
            nodeType,
            metadata: Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined,
          },
        });
        refetch();
      }
    } catch (err) {
      console.error('Failed to create node:', err);
    }
  };

  // Double-click to edit node
  const handleNodeDoubleClick = useCallback((_event: any, node: any) => {
    const noteData = story?.nodes?.find((n: any) => n.id === node.id);
    if (noteData) {
      setSelectedNote(noteData);
    }
  }, [story]);

  // Update cache when editing
  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string, newImages?: any[], color?: string, mood?: string) => {
    setNodes((nds: any) => nds.map((n: any) => {
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
    }));
  };

  const privacyIcon = story?.privacyLevel === 'private' ? Lock
    : story?.privacyLevel === 'friends_only' ? Users : Globe;
  const PrivIcon = privacyIcon;

  if (loading && !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-[#FF8FA3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10 bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/story')} className="p-2 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{story?.title || 'Loading...'}</h1>
            {story?.subtitle && <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{story.subtitle}</p>}
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <PrivIcon className="w-3 h-3 text-[#5A3E4C]/30" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${story?.status === 'draft' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {story?.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10">
            {[
              { mode: 'canvas', icon: LayoutGrid, label: 'Canvas' },
              { mode: 'timeline', icon: Clock, label: 'Timeline' },
              { mode: 'reading', icon: BookOpen, label: 'Reading' },
              { mode: 'gallery', icon: Image, label: 'Gallery' },
              { mode: 'outline', icon: List, label: 'Outline' },
            ].map(({ mode, icon: ModeIcon, label }) => (
              <button key={mode} onClick={() => setViewMode(mode as any)} title={label}
                className={`p-1.5 rounded-md transition-all ${viewMode === mode ? 'bg-white dark:bg-[#2a2438] shadow-sm text-[#FF8FA3]' : 'text-[#5A3E4C]/40 dark:text-[#e2d9f3]/40 hover:text-[#5A3E4C]/70'}`}>
                <ModeIcon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <button onClick={() => setShowNodeSelector(true)} className="px-3 py-1.5 rounded-xl bg-[#FF8FA3]/10 hover:bg-[#FF8FA3]/20 text-[#FF8FA3] text-xs font-medium transition-all">
            + Add Scene
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className={`p-2 rounded-lg transition-all ${showAnalytics ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <BarChart3 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowWritingStats(!showWritingStats)} className={`p-2 rounded-lg transition-all ${showWritingStats ? 'bg-[#7C83FD]/10 text-[#7C83FD]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <PenTool className="w-4 h-4" />
          </button>
          <button onClick={() => setShowEmotionalArc(!showEmotionalArc)} className={`p-2 rounded-lg transition-all ${showEmotionalArc ? 'bg-[#FF6B8B]/10 text-[#FF6B8B]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Heart className="w-4 h-4" />
          </button>
          <button onClick={() => setShowExport(!showExport)} className={`p-2 rounded-lg transition-all ${showExport ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {viewMode === 'canvas' && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-[#FFFAF7] dark:bg-[#1a1625]"
          >
            <Background color="#FFB4A2" gap={24} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        )}

        {viewMode === 'timeline' && (
          <StoryTimelineView nodes={story?.nodes || []} onNodeClick={(id) => setViewMode('canvas')} />
        )}

        {viewMode === 'reading' && (
          <StoryReadingView nodes={story?.nodes || []} storyTitle={story?.title || ''} storySubtitle={story?.subtitle} />
        )}

        {viewMode === 'gallery' && (
          <StoryGalleryView nodes={story?.nodes || []} />
        )}

        {viewMode === 'outline' && (
          <StoryOutlineView nodes={story?.nodes || []} onNodeClick={(id) => setViewMode('canvas')} />
        )}

        {/* Settings Panel */}
        {showSettings && story && (
          <StorySettingsPanel
            story={story}
            onClose={() => setShowSettings(false)}
            onUpdate={async (input: any) => {
              await updateStory({ variables: { input: { id: storyId, ...input } } });
              refetch();
            }}
            onDelete={() => router.push('/story')}
          />
        )}

        {/* Analytics Panel */}
        {showAnalytics && (
          <StoryAnalyticsPanel
            storyId={storyId}
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)}
            nodes={story?.nodes || []}
          />
        )}

        {/* Writing Stats Panel */}
        {showWritingStats && (
          <WritingStatsPanel
            storyId={storyId}
            isOpen={showWritingStats}
            onClose={() => setShowWritingStats(false)}
          />
        )}

        {/* Emotional Arc Panel */}
        {showEmotionalArc && (
          <EmotionalArcPanel
            storyId={storyId}
            isOpen={showEmotionalArc}
            onClose={() => setShowEmotionalArc(false)}
          />
        )}

        {/* Export Panel */}
        {showExport && story && (
          <StoryExportPanel
            story={story}
            nodes={story.nodes || []}
            isOpen={showExport}
            onClose={() => setShowExport(false)}
          />
        )}

        {/* Note Editor Sidebar */}
        {selectedNote && (
          <StoryNodeEditor
            note={selectedNote}
            onClose={() => { setSelectedNote(null); refetch(); }}
            onUpdateCache={handleUpdateCache}
            onDeleteSuccess={() => {
              const deletedId = selectedNote?.id;
              setSelectedNote(null);
              setNodes((nds: any) => nds.filter((n: any) => n.id !== deletedId));
              setEdges((eds: any) => eds.filter((e: any) => e.source !== deletedId && e.target !== deletedId));
              refetch();
            }}
          />
        )}
      </div>

      {/* Node Type Selector Modal */}
      <NodeTypeSelector
        isOpen={showNodeSelector}
        onClose={() => setShowNodeSelector(false)}
        onSelect={handleAddNode}
      />
    </div>
  );
}

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <ApolloWrapper>
      <Providers>
        <ThemeProvider>
          <StoryCanvas params={resolvedParams} />
        </ThemeProvider>
      </Providers>
    </ApolloWrapper>
  );
}
