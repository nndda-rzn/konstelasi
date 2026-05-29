'use client';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeChange,
  type Connection,
} from '@xyflow/react';
import StoryNode from '@/features/story/components/StoryNode';
import StoryEdge from '@/features/story/components/StoryEdge';
import StoryTimelineView from '@/features/story/components/StoryTimelineView';
import StoryReadingView from '@/features/story/components/StoryReadingView';
import StoryGalleryView from '@/features/story/components/StoryGalleryView';
import StoryOutlineView from '@/features/story/components/StoryOutlineView';
import CinematicView from '@/features/story/components/CinematicView';
import type { StoryViewMode } from '@/features/story/components/StoryHeader';

const nodeTypes = { storyNode: StoryNode };
const edgeTypes = { storyEdge: StoryEdge };

interface Props {
  viewMode: StoryViewMode;
  setViewMode: (mode: StoryViewMode) => void;
  story: any;
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  /** Edge reconnect handlers (drag existing edge endpoint to a new node). */
  onReconnectStart?: () => void;
  onReconnect?: (oldEdge: any, newConnection: Connection) => void;
  onReconnectEnd?: (event: any, edge: any) => void;
  onNodeDoubleClick: (event: any, node: any) => void;
  /**
   * Called when user clicks a node from a non-canvas view.
   * Opens the node editor without forcing a view switch.
   */
  onSelectNodeId?: (nodeId: string) => void;
  /** Search query forwarded from header. Filters nodes in non-canvas views. */
  searchQuery?: string;
  scrapbookCanvasClass: string;
  scrapbookGridColor: string;
  scrapbookFontClass: string;
}

/**
 * Routes between the story canvas (React Flow) and alternative views
 * (timeline, reading, gallery, outline, cinematic). Extracted from
 * StoryDetailPage to keep the page component focused on orchestration.
 */
export default function StoryContent({
  viewMode,
  setViewMode,
  story,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnectStart,
  onReconnect,
  onReconnectEnd,
  onNodeDoubleClick,
  onSelectNodeId,
  searchQuery = '',
  scrapbookCanvasClass,
  scrapbookGridColor,
  scrapbookFontClass,
}: Props) {
  const allStoryNodes = story?.nodes || [];

  // Filter nodes by search query for non-canvas views.
  // Canvas mode handles search via opacity dimming in flowNodes (parent).
  const query = searchQuery.trim().toLowerCase();
  const storyNodes = !query
    ? allStoryNodes
    : allStoryNodes.filter((n: any) => {
        const title = n.title?.toLowerCase() || '';
        const content = (n.content || '').replace(/<[^>]+>/g, '').toLowerCase();
        return title.includes(query) || content.includes(query);
      });

  // From a non-canvas view, clicking a node should open the editor
  // directly (no forced view switch).
  const handleAlternativeClick = (nodeId: string) => {
    if (onSelectNodeId) {
      onSelectNodeId(nodeId);
    } else {
      setViewMode('canvas');
    }
  };

  if (viewMode === 'canvas') {
    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnectStart={onReconnectStart}
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edgesReconnectable
        fitView
        className={scrapbookCanvasClass}
      >
        <Background color={scrapbookGridColor} gap={24} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    );
  }

  if (viewMode === 'timeline') {
    return <StoryTimelineView nodes={storyNodes} onNodeClick={handleAlternativeClick} />;
  }

  if (viewMode === 'reading') {
    return (
      <StoryReadingView
        nodes={storyNodes}
        storyTitle={story?.title || ''}
        storySubtitle={story?.subtitle}
        scrapbookFontClass={scrapbookFontClass}
        scrapbookBackgroundClass={scrapbookCanvasClass}
      />
    );
  }

  if (viewMode === 'gallery') {
    return <StoryGalleryView nodes={storyNodes} />;
  }

  if (viewMode === 'outline') {
    return <StoryOutlineView nodes={storyNodes} onNodeClick={handleAlternativeClick} />;
  }

  if (viewMode === 'cinematic') {
    return (
      <CinematicView
        nodes={storyNodes}
        storyTitle={story?.title || ''}
        onClose={() => setViewMode('canvas')}
      />
    );
  }

  return null;
}
