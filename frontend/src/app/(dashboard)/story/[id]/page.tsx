"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import {
  ArrowLeft,
  Settings,
  Lock,
  Globe,
  Users,
  Eye,
  LayoutGrid,
  Clock,
  BookOpen,
  Image,
  List,
  BarChart3,
  Download,
  PenTool,
  Heart,
  Hourglass,
  GitBranch,
  User,
  Sparkles,
  Film,
  Search,
} from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GET_STORY, UPDATE_STORY, ADD_NODE_TO_STORY } from "@/graphql/story";
import {
  CREATE_NOTE,
  CREATE_NOTE_LINK,
  DELETE_NOTE_LINK,
  BATCH_UPDATE_NOTES,
} from "@/graphql/mutations";
import { ThemeProvider } from "@/context/ThemeContext";
import StorySettingsPanel from "@/features/story/components/StorySettingsPanel";
import NodeTypeSelector from "@/features/story/components/NodeTypeSelector";
import StoryAnalyticsPanel from "@/features/story/components/StoryAnalyticsPanel";
import StoryExportPanel from "@/features/story/components/StoryExportPanel";
import StoryNodeEditor from "@/features/story/components/StoryNodeEditor";
import WritingStatsPanel from "@/features/story/components/WritingStatsPanel";
import EmotionalArcPanel from "@/features/story/components/EmotionalArcPanel";
import MemoryTimelinePanel from "@/features/story/components/MemoryTimelinePanel";
import VersionHistoryPanel from "@/features/story/components/VersionHistoryPanel";
import CharacterProfilePanel from "@/features/story/components/CharacterProfilePanel";
import InsightsDrawer from "@/features/story/components/InsightsDrawer";
import CinematicView from "@/features/story/components/CinematicView";
import { usePositionPersistence } from "@/features/canvas/hooks/usePositionPersistence";
import { resolveScrapbookTheme } from "@/features/story/utils/scrapbookTheme";
import StoryHeader from "@/features/story/components/StoryHeader";
import StoryContent from "@/features/story/components/StoryContent";

function StoryCanvas({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storyId = params.id;
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [viewMode, setViewMode] = useState<
    "canvas" | "timeline" | "reading" | "gallery" | "outline" | "cinematic"
  >("canvas");
  const [showExport, setShowExport] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [showInsightsMenu, setShowInsightsMenu] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { screenToFlowPosition } = useReactFlow();

  const { data, loading, refetch } = useQuery<any>(GET_STORY, {
    variables: { id: storyId },
    fetchPolicy: "cache-and-network",
  });

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation<any>(DELETE_NOTE_LINK);
  const edgeReconnectSuccessful = useRef(true);
  // Track when user is actively dragging a node so we don't clobber
  // their position via refetch race conditions.
  const isDraggingRef = useRef(false);
  const [batchUpdateNotes] = useMutation<any>(BATCH_UPDATE_NOTES);
  const [updateStory] = useMutation<any>(UPDATE_STORY);
  const [addNodeToStory] = useMutation<any>(ADD_NODE_TO_STORY);

  const story = data?.getStory;
  const scrapbookTheme = resolveScrapbookTheme(story?.scrapbookTheme);
  const scrapbookPageClass = scrapbookTheme.pageClass;
  const scrapbookCanvasClass = scrapbookTheme.canvasClass;
  const scrapbookGridColor = scrapbookTheme.gridColor;
  const scrapbookFontClass = scrapbookTheme.fontClass;

  // Transform story nodes to React Flow nodes
  useEffect(() => {
    if (!story?.nodes) return;
    // Race condition guard: skip rebuild while user is actively dragging
    // a node to avoid clobbering their in-flight position with stale server data.
    if (isDraggingRef.current) return;
    const query = searchQuery.trim().toLowerCase();
    const flowNodes = story.nodes.map((note: any) => {
      const titleMatch = note.title?.toLowerCase().includes(query);
      const contentMatch = note.content
        ?.replace(/<[^>]+>/g, "")
        .toLowerCase()
        .includes(query);
      const isMatch = !query || titleMatch || contentMatch;
      return {
        id: note.id,
        // Coerce to numbers - React Flow requires valid numbers, not null/undefined,
        // otherwise the node is treated as "uninitialized" and dragging fails (#015).
        position: {
          x: typeof note.positionX === "number" ? note.positionX : 0,
          y: typeof note.positionY === "number" ? note.positionY : 0,
        },
        style: {
          width: note.width || undefined,
          height: note.height || undefined,
          opacity: query && !isMatch ? 0.25 : 1,
          filter: query && !isMatch ? "grayscale(0.6)" : "none",
          transition: "opacity 0.3s ease, filter 0.3s ease",
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
        type: "storyNode",
      };
    });

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
          type: "storyEdge",
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [story, setNodes, setEdges]);

  const onConnect = useCallback(
    async (connection: any) => {
      try {
        await createNoteLink({
          variables: {
            input: {
              sourceId: connection.source,
              targetId: connection.target,
              sourceHandle: connection.sourceHandle || "right",
              targetHandle: connection.targetHandle || "left",
            },
          },
        });
        setEdges((eds) => addEdge(connection, eds));
      } catch (err) {
        console.error("Failed to create connection:", err);
        toast.error("Gagal menghubungkan scene");
      }
    },
    [createNoteLink, setEdges],
  );

  // Edge reconnection: drag an existing edge endpoint to a new node.
  // Pattern: delete old link + create new link on the backend.
  // If user drops outside any handle, the edge is removed.
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    async (oldEdge: any, newConnection: any) => {
      edgeReconnectSuccessful.current = true;
      try {
        // Optimistic UI update first.
        setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
        // Replace link in backend: delete old, create new.
        if (!oldEdge.id.startsWith("temp-")) {
          await deleteNoteLink({ variables: { id: oldEdge.id } });
        }
        await createNoteLink({
          variables: {
            input: {
              sourceId: newConnection.source,
              targetId: newConnection.target,
              sourceHandle: newConnection.sourceHandle || "right",
              targetHandle: newConnection.targetHandle || "left",
            },
          },
        });
      } catch (err) {
        console.error("Failed to reconnect edge:", err);
        toast.error("Gagal memindah koneksi");
      }
    },
    [createNoteLink, deleteNoteLink, setEdges],
  );

  const onReconnectEnd = useCallback(
    (_event: any, edge: any) => {
      // Drop happened outside a handle: remove the edge entirely.
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        if (!edge.id.startsWith("temp-")) {
          deleteNoteLink({ variables: { id: edge.id } }).catch(() => {});
        }
      }
      edgeReconnectSuccessful.current = true;
    },
    [deleteNoteLink, setEdges],
  );

  const { queueChanges: queueLayoutChanges } = usePositionPersistence({
    batchUpdate: batchUpdateNotes,
  });

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      onNodesChange(changes);
      queueLayoutChanges(changes);
    },
    [onNodesChange, queueLayoutChanges],
  );

  // Drag lifecycle handlers - flag prevents refetch from clobbering
  // local positions during an active drag (race condition guard).
  const handleNodeDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleNodeDragStop = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleAddNode = async (
    nodeType: string,
    title: string,
    emotion: string,
    metadata: any,
  ) => {
    // Smart positioning (branch-aware):
    // 1. No nodes yet -> center of viewport
    // 2. A node is currently selected -> place beside it (enables branching)
    // 3. Otherwise -> place to the right of the rightmost node
    const computeSmartPosition = () => {
      if (nodes.length === 0) {
        return screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }
      const NODE_WIDTH = 220;
      const NODE_HEIGHT = 180;
      const GAP = 40;

      // Anchor on selected node when available - lets user grow story by
      // branching off any node, not just the rightmost.
      if (selectedNote?.id) {
        const anchor = nodes.find((n: any) => n.id === selectedNote.id);
        if (anchor) {
          // Find existing children to the right of anchor and offset
          // vertically so new branch nodes don't overlap.
          const siblings = nodes.filter(
            (n: any) =>
              n.position.x >= anchor.position.x + NODE_WIDTH &&
              n.position.x < anchor.position.x + NODE_WIDTH * 2 + GAP &&
              Math.abs(n.position.y - anchor.position.y) < NODE_HEIGHT * 3,
          );
          const verticalOffset =
            siblings.length === 0
              ? 0
              : (siblings.length % 2 === 0 ? 1 : -1) *
                Math.ceil(siblings.length / 2) *
                (NODE_HEIGHT + GAP);
          return {
            x: anchor.position.x + NODE_WIDTH + GAP,
            y: anchor.position.y + verticalOffset,
          };
        }
      }

      // Fallback: rightmost + offset
      const rightmost = nodes.reduce(
        (acc: any, n: any) => (!acc || n.position.x > acc.position.x ? n : acc),
        null,
      );
      return {
        x: rightmost.position.x + NODE_WIDTH + GAP,
        y: rightmost.position.y + (Math.random() * 60 - 30),
      };
    };

    const position = computeSmartPosition();
    try {
      const { data: noteData } = await createNote({
        variables: {
          input: {
            title,
            positionX: position.x,
            positionY: position.y,
            // Persist emotion as mood so it shows up in editor + analytics
            // (previously dropped silently on create).
            mood: emotion || undefined,
          },
        },
      });
      if (noteData?.createNote) {
        await addNodeToStory({
          variables: {
            storyId,
            noteId: noteData.createNote.id,
            nodeType,
            metadata:
              Object.keys(metadata).length > 0
                ? JSON.stringify(metadata)
                : undefined,
          },
        });
        refetch();
        toast.success(`${title} ditambahkan`);
      }
    } catch (err) {
      console.error("Failed to create node:", err);
      toast.error("Gagal menambahkan scene");
    }
  };

  // Double-click to edit node
  const handleNodeDoubleClick = useCallback(
    (_event: any, node: any) => {
      const noteData = story?.nodes?.find((n: any) => n.id === node.id);
      if (noteData) {
        setSelectedNote(noteData);
      }
    },
    [story],
  );

  // Update cache when editing
  const handleUpdateCache = (
    nodeId: string,
    newTitle?: string,
    newContent?: string,
    newImages?: any[],
    color?: string,
    mood?: string,
    extra?: any,
  ) => {
    setNodes((nds: any) =>
      nds.map((n: any) => {
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
      }),
    );
  };

  if (loading && !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${scrapbookPageClass}`}>
      <StoryHeader
        story={story}
        scrapbookFontClass={scrapbookFontClass}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleStatus={async (nextStatus) => {
          try {
            await updateStory({
              variables: { input: { id: storyId, status: nextStatus } },
            });
            toast.success(
              nextStatus === 'PUBLISHED' ? 'Story dipublish!' : 'Kembali ke draft',
            );
            refetch();
          } catch (err) {
            console.error('Failed to toggle status:', err);
            toast.error('Gagal mengubah status');
          }
        }}
        scrapbookTheme={story?.scrapbookTheme}
        onScrapbookThemeChange={async (nextJson) => {
          try {
            await updateStory({
              variables: { input: { id: storyId, scrapbookTheme: nextJson } },
            });
            refetch();
          } catch (err) {
            console.error('Failed to update theme:', err);
            toast.error('Gagal mengubah tema');
          }
        }}
        showInsightsMenu={showInsightsMenu}
        onToggleInsights={() => setShowInsightsMenu(!showInsightsMenu)}
        activeInsight={activeInsight}
        showExport={showExport}
        onToggleExport={() => setShowExport(!showExport)}
        onAddScene={() => setShowNodeSelector(true)}
        onBack={() => router.push("/story")}
      />

      {/* Content Area */}
      <div className="flex-1 relative">
        <StoryContent
          viewMode={viewMode}
          setViewMode={setViewMode}
          story={story}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          onSelectNodeId={(nodeId) => {
            const noteData = story?.nodes?.find((n: any) => n.id === nodeId);
            if (noteData) setSelectedNote(noteData);
          }}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
          searchQuery={searchQuery}
          scrapbookCanvasClass={scrapbookCanvasClass}
          scrapbookGridColor={scrapbookGridColor}
          scrapbookFontClass={scrapbookFontClass}
        />

        {/* Settings Panel */}
        {showSettings && story && (
          <StorySettingsPanel
            story={story}
            onClose={() => setShowSettings(false)}
            onUpdate={async (input: any) => {
              await updateStory({
                variables: { input: { id: storyId, ...input } },
              });
              refetch();
            }}
            onDelete={() => router.push("/story")}
          />
        )}

        {/* Insights Dropdown Menu */}
        {showInsightsMenu && (
          <InsightsDrawer
            isOpen={showInsightsMenu}
            onClose={() => setShowInsightsMenu(false)}
            onSelectTab={(tab) =>
              setActiveInsight(activeInsight === tab ? null : tab)
            }
            activeTab={activeInsight}
          />
        )}

        {/* Insight Panels (one at a time) */}
        {activeInsight === "analytics" && (
          <StoryAnalyticsPanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
            nodes={story?.nodes || []}
          />
        )}
        {activeInsight === "stats" && (
          <WritingStatsPanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
          />
        )}
        {activeInsight === "emotional" && (
          <EmotionalArcPanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
          />
        )}
        {activeInsight === "timeline" && (
          <MemoryTimelinePanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
          />
        )}
        {activeInsight === "versions" && (
          <VersionHistoryPanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
            onRestore={() => refetch()}
          />
        )}
        {activeInsight === "characters" && (
          <CharacterProfilePanel
            storyId={storyId}
            isOpen={true}
            onClose={() => setActiveInsight(null)}
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
            onClose={() => {
              setSelectedNote(null);
              refetch();
            }}
            onUpdateCache={handleUpdateCache}
            onRequestRefresh={() => refetch()}
            onDeleteSuccess={() => {
              const deletedId = selectedNote?.id;
              setSelectedNote(null);
              setNodes((nds: any) =>
                nds.filter((n: any) => n.id !== deletedId),
              );
              setEdges((eds: any) =>
                eds.filter(
                  (e: any) => e.source !== deletedId && e.target !== deletedId,
                ),
              );
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

export default function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <ApolloWrapper>
      <Providers>
        <ThemeProvider>
          <ReactFlowProvider>
            <ErrorBoundary label="StoryCanvas">
              <StoryCanvas params={resolvedParams} />
            </ErrorBoundary>
          </ReactFlowProvider>
        </ThemeProvider>
      </Providers>
    </ApolloWrapper>
  );
}
