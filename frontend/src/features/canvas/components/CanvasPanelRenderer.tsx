"use client";

import { useCanvasActions } from "../context/CanvasActionsContext";
import { useCanvasData2 } from "../context/CanvasDataContext";
import { useCanvasUI } from "../hooks/use-canvas-ui";
import TagPanel from "../panels/TagPanel";
import SearchPanel from "../panels/SearchPanel";
import AdvancedAnalyticsPanel from "../panels/AdvancedAnalyticsPanel";
import ArchivePanel from "../panels/ArchivePanel";
import ExportPanel from "../panels/ExportPanel";
import CalendarPanel from "../panels/CalendarPanel";

/**
 * CanvasPanelRenderer - Mounts the active side panel based on
 * the UI store's activePanel. Replaces 6 inline conditionals in
 * DiaryCanvas.
 */
export function CanvasPanelRenderer() {
  const ui = useCanvasUI();
  const { notes, refetch } = useCanvasData2();
  const actions = useCanvasActions();

  switch (ui.activePanel) {
    case "tag":
      return <TagPanel onClose={ui.closePanel} />;
    case "search":
      return notes.length > 0 || ui.searchQuery ? (
        <SearchPanel
          notes={notes}
          onNoteClick={(id) => {
            actions.handleNodeDoubleClick(id);
            ui.closePanel();
          }}
          onClose={ui.closePanel}
        />
      ) : null;
    case "stats":
      return (
        <AdvancedAnalyticsPanel isOpen notes={notes} onClose={ui.closePanel} />
      );
    case "archive":
      return (
        <ArchivePanel
          isOpen
          onClose={ui.closePanel}
          onRestoreSuccess={() => refetch()}
        />
      );
    case "export":
      return <ExportPanel isOpen onClose={ui.closePanel} notes={notes} />;
    case "calendar":
      return (
        <CalendarPanel
          isOpen
          onClose={ui.closePanel}
          notes={notes}
          onNoteClick={(id) => {
            actions.handleNodeDoubleClick(id);
            ui.closePanel();
          }}
        />
      );
    default:
      return null;
  }
}
