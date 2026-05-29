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
  onNodeDoubleClick: (event: any, node: any) => void;
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
  onNodeDoubleClick,
  scrapbookCanvasClass,
  scrapbookGridColor,
  scrapbookFontClass,
}: Props) {
  const storyNodes = story?.nodes || [];

  if (viewMode === 'canvas') {
    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
    return <StoryTimelineView nodes={storyNodes} onNodeClick={() => setViewMode('canvas')} />;
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
    return <StoryOutlineView nodes={storyNodes} onNodeClick={() => setViewMode('canvas')} />;
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
