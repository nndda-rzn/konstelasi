"use client";

import { use, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/context/ThemeContext";
import { GET_STORY } from "@/graphql/story";
import StoryHeader from "@/features/story/components/StoryHeader";
import StoryContent from "@/features/story/components/StoryContent";
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
import { resolveScrapbookTheme } from "@/features/story/utils/scrapbookTheme";
import { useStoryStore, type InsightKey } from "@/features/story/store/useStoryStore";
import { useStoryFlow } from "@/features/story/hooks/useStoryFlow";
import { useStoryActions } from "@/features/story/hooks/useStoryActions";
import { usePositionPersistence } from "@/features/canvas/hooks/usePositionPersistence";
import { StoryPanels } from "@/features/story/components/StoryPanels";

function StoryCanvas({ params }: { params: { id: string } }) {
  const storyId = params.id;

  // Fetch story data
  const { data, loading, refetch } = useQuery<any>(GET_STORY, {
    variables: { id: storyId },
    fetchPolicy: "cache-and-network",
  });

  // Theme data
  const story = data?.getStory;
  const scrapbookTheme = useMemo(
    () => resolveScrapbookTheme(story?.scrapbookTheme),
    [story?.scrapbookTheme]
  );
  const scrapbookPageClass = scrapbookTheme.pageClass;
  const scrapbookCanvasClass = scrapbookTheme.canvasClass;
  const scrapbookGridColor = scrapbookTheme.gridColor;
  const scrapbookFontClass = scrapbookTheme.fontClass;

  // UI state from store
  const viewMode = useStoryStore((s) => s.viewMode);
  const setViewMode = useStoryStore((s) => s.setViewMode);
  const showSettings = useStoryStore((s) => s.showSettings);
  const showNodeSelector = useStoryStore((s) => s.showNodeSelector);
  const showExport = useStoryStore((s) => s.showExport);
  const showInsightsMenu = useStoryStore((s) => s.showInsightsMenu);
  const activeInsight = useStoryStore((s) => s.activeInsight);
  const selectedNoteId = useStoryStore((s) => s.selectedNoteId);
  const searchQuery = useStoryStore((s) => s.searchQuery);
  const setSearchQuery = useStoryStore((s) => s.setSearchQuery);

  // Flow orchestration
  const flow = useStoryFlow({
    story,
    batchUpdateMutation: null, // injected below
  });

  // Actions
  const actions = useStoryActions({
    storyId,
    refetch,
    screenToFlowPosition: flow.screenToFlowPosition,
    nodes: flow.nodes,
    removeNodeFromFlow: flow.removeNodeFromFlow,
  });

  // Position persistence (debounced batch update)
  const { queueChanges: queueLayoutChanges } = usePositionPersistence({
    batchUpdate: actions.batchUpdateMutation,
  });

  // Combined handler that triggers both flow state and persistence
  const handleNodesChange = (changes: any[]) => {
    flow.handleNodesChange(changes);
    queueLayoutChanges(changes);
  };

  // Get the full selected note for the editor
  const selectedNote = useMemo(
    () => story?.nodes?.find((n: any) => n.id === selectedNoteId) ?? null,
    [story, selectedNoteId]
  );

  // Keep flow's selected id in sync with computed note
  useEffect(() => {
    if (selectedNoteId && !selectedNote) {
      useStoryStore.getState().setSelectedNoteId(null);
    }
  }, [selectedNoteId, selectedNote]);

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
        onToggleSettings={useStoryStore.getState().toggleSettings}
        onToggleStatus={actions.handleToggleStatus}
        scrapbookTheme={story?.scrapbookTheme}
        onScrapbookThemeChange={actions.handleScrapbookThemeChange}
        showInsightsMenu={showInsightsMenu}
        onToggleInsights={useStoryStore.getState().toggleInsightsMenu}
        activeInsight={activeInsight}
        showExport={showExport}
        onToggleExport={useStoryStore.getState().toggleExport}
        onAddScene={useStoryStore.getState().openNodeSelector}
        onBack={() => useStoryStore.getState().setSelectedNoteId(null)}
      />

      {/* Content Area */}
      <div className="flex-1 relative">
        <StoryContent
          viewMode={viewMode}
          setViewMode={setViewMode}
          story={story}
          nodes={flow.nodes}
          edges={flow.edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={flow.onEdgesChange}
          onConnect={flow.onConnect}
          onNodeDoubleClick={flow.handleNodeDoubleClick}
          onSelectNodeId={flow.handleSelectNodeId}
          onNodeDragStart={flow.handleNodeDragStart}
          onNodeDragStop={flow.handleNodeDragStop}
          searchQuery={searchQuery}
          scrapbookCanvasClass={scrapbookCanvasClass}
          scrapbookGridColor={scrapbookGridColor}
          scrapbookFontClass={scrapbookFontClass}
        />

        {/* Panels (settings, insights, export, note editor) */}
        <StoryPanels
          story={story}
          storyId={storyId}
          showSettings={showSettings}
          showInsightsMenu={showInsightsMenu}
          showExport={showExport}
          activeInsight={activeInsight}
          selectedNote={selectedNote}
          onCloseSettings={useStoryStore.getState().closeSettings}
          onUpdateStory={actions.handleUpdateStory}
          onDeleteStory={actions.handleDeleteStory}
          onCloseInsights={useStoryStore.getState().closeInsightsMenu}
          onSelectInsightTab={(tab: string) => {
            const current = useStoryStore.getState().activeInsight;
            useStoryStore.getState().setActiveInsight(
              current === (tab as InsightKey) ? null : (tab as InsightKey)
            );
          }}
          onCloseExport={useStoryStore.getState().closeExport}
          onUpdateCache={flow.updateNodeCache}
          onRequestRefresh={() => refetch()}
          onDeleteSuccess={() => {
            if (selectedNoteId) {
              actions.handleDeleteNode(selectedNoteId);
            }
          }}
          onCloseEditor={() => useStoryStore.getState().setSelectedNoteId(null)}
          onRefetch={() => refetch()}
        />

        {/* Node Type Selector Modal */}
        <NodeTypeSelector
          isOpen={showNodeSelector}
          onClose={useStoryStore.getState().closeNodeSelector}
          onSelect={async (
            nodeType: string,
            title: string,
            emotion: string,
            metadata: any
          ) => {
            await actions.handleAddNode(nodeType, title, emotion, metadata);
            useStoryStore.getState().closeNodeSelector();
          }}
        />
      </div>
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
