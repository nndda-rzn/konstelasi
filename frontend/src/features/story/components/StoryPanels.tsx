"use client";

import StorySettingsPanel from "./StorySettingsPanel";
import InsightsDrawer from "./InsightsDrawer";
import StoryAnalyticsPanel from "./StoryAnalyticsPanel";
import WritingStatsPanel from "./WritingStatsPanel";
import EmotionalArcPanel from "./EmotionalArcPanel";
import MemoryTimelinePanel from "./MemoryTimelinePanel";
import VersionHistoryPanel from "./VersionHistoryPanel";
import CharacterProfilePanel from "./CharacterProfilePanel";
import StoryExportPanel from "./StoryExportPanel";
import StoryNodeEditor from "./StoryNodeEditor";

interface StoryPanelsProps {
  story: any;
  storyId: string;
  showSettings: boolean;
  showInsightsMenu: boolean;
  showExport: boolean;
  activeInsight: string | null;
  selectedNote: any;
  // Settings
  onCloseSettings: () => void;
  onUpdateStory: (input: any) => Promise<void>;
  onDeleteStory: () => void;
  // Insights
  onCloseInsights: () => void;
  onSelectInsightTab: (tab: string) => void;
  // Export
  onCloseExport: () => void;
  // Note editor
  onUpdateCache: (
    nodeId: string,
    newTitle?: string,
    newContent?: string,
    newImages?: any[],
    color?: string,
    mood?: string,
    extra?: any
  ) => void;
  onRequestRefresh: () => void;
  onDeleteSuccess: () => void;
  onCloseEditor: () => void;
  onRefetch: () => void;
}

/**
 * StoryPanels - Renders all overlay panels (settings, insights, export, editor).
 * Each panel only mounts when its visibility flag is true.
 */
export function StoryPanels({
  story,
  storyId,
  showSettings,
  showInsightsMenu,
  showExport,
  activeInsight,
  selectedNote,
  onCloseSettings,
  onUpdateStory,
  onDeleteStory,
  onCloseInsights,
  onSelectInsightTab,
  onCloseExport,
  onUpdateCache,
  onRequestRefresh,
  onDeleteSuccess,
  onCloseEditor,
  onRefetch,
}: StoryPanelsProps) {
  return (
    <>
      {/* Settings Panel */}
      {showSettings && story && (
        <StorySettingsPanel
          story={story}
          onClose={onCloseSettings}
          onUpdate={onUpdateStory}
          onDelete={onDeleteStory}
        />
      )}

      {/* Insights Dropdown Menu */}
      {showInsightsMenu && (
        <InsightsDrawer
          isOpen={showInsightsMenu}
          onClose={onCloseInsights}
          onSelectTab={onSelectInsightTab}
          activeTab={activeInsight}
        />
      )}

      {/* Insight Panels (one at a time) */}
      {activeInsight === "analytics" && (
        <StoryAnalyticsPanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("analytics")}
          nodes={story?.nodes || []}
        />
      )}
      {activeInsight === "stats" && (
        <WritingStatsPanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("stats")}
        />
      )}
      {activeInsight === "emotional" && (
        <EmotionalArcPanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("emotional")}
        />
      )}
      {activeInsight === "timeline" && (
        <MemoryTimelinePanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("timeline")}
        />
      )}
      {activeInsight === "versions" && (
        <VersionHistoryPanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("versions")}
          onRestore={onRefetch}
        />
      )}
      {activeInsight === "characters" && (
        <CharacterProfilePanel
          storyId={storyId}
          isOpen={true}
          onClose={() => onSelectInsightTab("characters")}
        />
      )}

      {/* Export Panel */}
      {showExport && story && (
        <StoryExportPanel
          story={story}
          nodes={story.nodes || []}
          isOpen={showExport}
          onClose={onCloseExport}
        />
      )}

      {/* Note Editor Sidebar */}
      {selectedNote && (
        <StoryNodeEditor
          note={selectedNote}
          onClose={onCloseEditor}
          onUpdateCache={onUpdateCache}
          onDeleteSuccess={onDeleteSuccess}
          onRequestRefresh={onRequestRefresh}
        />
      )}
    </>
  );
}
