'use client';

import { use, useState, useCallback, useEffect, useRef } from 'react';
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
import { ArrowLeft, Settings, Lock, Globe, Users, Eye, LayoutGrid, Clock, BookOpen, Image, List, BarChart3, Download, PenTool, Heart, Hourglass, GitBranch, User, Sparkles, Film } from 'lucide-react';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';
import { GET_STORY, UPDATE_STORY, ADD_NODE_TO_STORY } from '@/graphql/story';
import { CREATE_NOTE, CREATE_NOTE_LINK, BATCH_UPDATE_NOTES } from '@/graphql/mutations';
import { ThemeProvider } from '@/context/ThemeContext';
import StorySettingsPanel from '@/features/story/components/StorySettingsPanel';
import StoryNode from '@/features/story/components/StoryNode';
import StoryEdge from '@/features/story/components/StoryEdge';
import NodeTypeSelector from '@/features/story/components/NodeTypeSelector';
import StoryTimelineView from '@/features/story/components/StoryTimelineView';
import StoryReadingView from '@/features/story/components/StoryReadingView';
import StoryGalleryView from '@/features/story/components/StoryGalleryView';
import StoryOutlineView from '@/features/story/components/StoryOutlineView';
import StoryAnalyticsPanel from '@/components/story/StoryAnalyticsPanel';
import StoryExportPanel from '@/features/story/components/StoryExportPanel';
import StoryNodeEditor from '@/features/story/components/StoryNodeEditor';
import WritingStatsPanel from '@/components/story/WritingStatsPanel';
import EmotionalArcPanel from '@/components/story/EmotionalArcPanel';
import MemoryTimelinePanel from '@/components/story/MemoryTimelinePanel';
import VersionHistoryPanel from '@/components/story/VersionHistoryPanel';
import CharacterProfilePanel from '@/components/story/CharacterProfilePanel';
import InsightsDrawer from '@/features/story/components/InsightsDrawer';
import CinematicView from '@/features/story/components/CinematicView';

const nodeTypes = { storyNode: StoryNode };
const edgeTypes = { storyEdge: StoryEdge };

const DEFAULT_SCRAPBOOK_THEME = {
  background: 'red_candy',
  font: 'default',
};

const SCRAPBOOK_PAGE_CLASSES: Record<string, string> = {
  red_candy: 'bg-[var(--background)]',
  warm_paper: 'bg-[#FFF8EA] dark:bg-[#1c1710]',
  rose_album: 'bg-[#FFF0F3] dark:bg-[#24161b]',
  night_letter: 'bg-[#F7F2FF] dark:bg-[#15111f]',
};

const SCRAPBOOK_CANVAS_CLASSES: Record<string, string> = {
  red_candy: 'bg-[#FFFAF7] dark:bg-[#1a1625]',
  warm_paper: 'bg-[#FFF8EA] dark:bg-[#1c1710]',
  rose_album: 'bg-[#FFF0F3] dark:bg-[#24161b]',
  night_letter: 'bg-[#F7F2FF] dark:bg-[#15111f]',
};

const SCRAPBOOK_GRID_COLORS: Record<string, string> = {
  red_candy: '#FFB8C0',
  warm_paper: '#D9B979',
  rose_album: '#FF9FB0',
  night_letter: '#6D5F8F',
};

function parseScrapbookTheme(value?: string) {
  try {
    return { ...DEFAULT_SCRAPBOOK_THEME, ...(value ? JSON.parse(value) : {}) };
  } catch {
    return DEFAULT_SCRAPBOOK_THEME;
  }
}

function getScrapbookFontClass(font?: string) {
  if (font === 'handwriting') return 'font-scrapbook-handwriting';
  if (font === 'serif') return 'font-scrapbook-serif';
  return '';
}

function StoryCanvas({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storyId = params.id;
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'timeline' | 'reading' | 'gallery' | 'outline' | 'cinematic'>('canvas');
  const [showExport, setShowExport] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [showInsightsMenu, setShowInsightsMenu] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const saveNodeChangesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, loading, refetch } = useQuery<any>(GET_STORY, {
    variables: { id: storyId },
    fetchPolicy: 'cache-and-network',
  });

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [batchUpdateNotes] = useMutation<any>(BATCH_UPDATE_NOTES);
  const [updateStory] = useMutation<any>(UPDATE_STORY);
  const [addNodeToStory] = useMutation<any>(ADD_NODE_TO_STORY);

  const story = data?.getStory;
  const scrapbookTheme = parseScrapbookTheme(story?.scrapbookTheme);
  const scrapbookPageClass = SCRAPBOOK_PAGE_CLASSES[scrapbookTheme.background] || SCRAPBOOK_PAGE_CLASSES.red_candy;
  const scrapbookCanvasClass = SCRAPBOOK_CANVAS_CLASSES[scrapbookTheme.background] || SCRAPBOOK_CANVAS_CLASSES.red_candy;
  const scrapbookGridColor = SCRAPBOOK_GRID_COLORS[scrapbookTheme.background] || SCRAPBOOK_GRID_COLORS.red_candy;
  const scrapbookFontClass = getScrapbookFontClass(scrapbookTheme.font);

  // Transform story nodes to React Flow nodes
  useEffect(() => {
    if (!story?.nodes) return;
    const flowNodes = story.nodes.map((note: any) => ({
      id: note.id,
      position: { x: note.positionX, y: note.positionY },
      style: {
        width: note.width || undefined,
        height: note.height || undefined,
      },
      data: {
        title: note.title,
        content: note.content,
        color: note.color,
        mood: note.mood,
        storyNodeType: note.storyNodeType,
        storyMetadata: note.storyMetadata,
        isLocked: note.isLocked,
        unlockDate: note.unlockDate,
        isTimeLocked: note.isTimeLocked,
        eventDate: note.eventDate,
        eventLocation: note.eventLocation,
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

  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);

    const savedChanges = changes.filter(change => (
      (change.type === 'position' && change.dragging === false && change.position)
      || (change.type === 'dimensions' && change.resizing === false && change.dimensions)
    ));

    if (savedChanges.length === 0) return;
    if (saveNodeChangesTimer.current) clearTimeout(saveNodeChangesTimer.current);

    saveNodeChangesTimer.current = setTimeout(() => {
      const inputs = new Map<string, any>();

      savedChanges.forEach(change => {
        if (!inputs.has(change.id)) inputs.set(change.id, { id: change.id });
        const input = inputs.get(change.id);

        if (change.type === 'position') {
          input.positionX = change.position.x;
          input.positionY = change.position.y;
        }

        if (change.type === 'dimensions') {
          input.width = change.dimensions.width;
          input.height = change.dimensions.height;
        }
      });

      batchUpdateNotes({ variables: { inputs: Array.from(inputs.values()) } }).catch(err => {
        console.error('Failed to save story node size/position:', err);
      });
    }, 500);
  }, [onNodesChange, batchUpdateNotes]);

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
  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string, newImages?: any[], color?: string, mood?: string, extra?: any) => {
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
            ...extra,
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
        <div className="w-6 h-6 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${scrapbookPageClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/story')} className="p-2 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
          </button>
          <div>
            <h1 className={`text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3] ${scrapbookFontClass}`}>{story?.title || 'Loading...'}</h1>
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
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#FFB8C0]/10 dark:bg-[#E63946]/10">
            {[
              { mode: 'canvas', icon: LayoutGrid, label: 'Canvas' },
              { mode: 'timeline', icon: Clock, label: 'Timeline' },
              { mode: 'reading', icon: BookOpen, label: 'Reading' },
              { mode: 'gallery', icon: Image, label: 'Gallery' },
              { mode: 'outline', icon: List, label: 'Outline' },
            ].map(({ mode, icon: ModeIcon, label }) => (
              <button key={mode} onClick={() => setViewMode(mode as any)} title={label}
                className={`p-1.5 rounded-md transition-all ${viewMode === mode ? 'bg-white dark:bg-[#2a2438] shadow-sm text-[#E63946]' : 'text-[#5A3E4C]/40 dark:text-[#e2d9f3]/40 hover:text-[#5A3E4C]/70'}`}>
                <ModeIcon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <button onClick={() => setShowNodeSelector(true)} className="px-3 py-1.5 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 text-[#E63946] text-xs font-medium transition-all">
            + Add Scene
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-[#E63946]/10 text-[#E63946]' : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={() => setShowInsightsMenu(!showInsightsMenu)} className={`p-2 rounded-lg transition-all relative ${activeInsight ? 'bg-[#7C83FD]/10 text-[#7C83FD]' : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Sparkles className="w-4 h-4" />
            {activeInsight && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#7C83FD]" />}
          </button>
          <button onClick={() => setShowExport(!showExport)} className={`p-2 rounded-lg transition-all ${showExport ? 'bg-[#E63946]/10 text-[#E63946]' : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
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
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className={scrapbookCanvasClass}
          >
            <Background color={scrapbookGridColor} gap={24} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        )}

        {viewMode === 'timeline' && (
          <StoryTimelineView nodes={story?.nodes || []} onNodeClick={(id) => setViewMode('canvas')} />
        )}

        {viewMode === 'reading' && (
          <StoryReadingView nodes={story?.nodes || []} storyTitle={story?.title || ''} storySubtitle={story?.subtitle} scrapbookFontClass={scrapbookFontClass} scrapbookBackgroundClass={scrapbookCanvasClass} />
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

        {/* Insights Dropdown Menu */}
        {showInsightsMenu && (
          <InsightsDrawer
            isOpen={showInsightsMenu}
            onClose={() => setShowInsightsMenu(false)}
            onSelectTab={(tab) => setActiveInsight(activeInsight === tab ? null : tab)}
            activeTab={activeInsight}
          />
        )}

        {/* Insight Panels (one at a time) */}
        {activeInsight === 'analytics' && (
          <StoryAnalyticsPanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} nodes={story?.nodes || []} />
        )}
        {activeInsight === 'stats' && (
          <WritingStatsPanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} />
        )}
        {activeInsight === 'emotional' && (
          <EmotionalArcPanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} />
        )}
        {activeInsight === 'timeline' && (
          <MemoryTimelinePanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} />
        )}
        {activeInsight === 'versions' && (
          <VersionHistoryPanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} onRestore={() => refetch()} />
        )}
        {activeInsight === 'characters' && (
          <CharacterProfilePanel storyId={storyId} isOpen={true} onClose={() => setActiveInsight(null)} />
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
