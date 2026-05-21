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
import { ArrowLeft, Settings, Lock, Globe, Users, Eye } from 'lucide-react';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';
import { GET_STORY, UPDATE_STORY } from '@/graphql/story';
import { CREATE_NOTE, CREATE_NOTE_LINK } from '@/graphql/mutations';
import { ThemeProvider } from '@/context/ThemeContext';
import StorySettingsPanel from '@/components/story/StorySettingsPanel';

function StoryCanvas({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storyId = params.id;
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [showSettings, setShowSettings] = useState(false);

  const { data, loading, refetch } = useQuery<any>(GET_STORY, {
    variables: { id: storyId },
    fetchPolicy: 'cache-and-network',
  });

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [updateStory] = useMutation<any>(UPDATE_STORY);

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
      type: 'default',
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

  const handleAddNode = async () => {
    const position = { x: Math.random() * 500 + 100, y: Math.random() * 400 + 100 };
    try {
      const { data: noteData } = await createNote({
        variables: {
          input: {
            title: 'New Scene',
            content: '',
            positionX: position.x,
            positionY: position.y,
            canvasId: null,
          },
        },
      });
      if (noteData?.createNote) {
        refetch();
      }
    } catch (err) {
      console.error('Failed to create node:', err);
    }
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
          <button onClick={handleAddNode} className="px-3 py-1.5 rounded-xl bg-[#FF8FA3]/10 hover:bg-[#FF8FA3]/20 text-[#FF8FA3] text-xs font-medium transition-all">
            + Add Scene
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'}`}>
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-[#FFFAF7] dark:bg-[#1a1625]"
        >
          <Background color="#FFB4A2" gap={24} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Settings Panel */}
        {showSettings && story && (
          <StorySettingsPanel
            story={story}
            onClose={() => setShowSettings(false)}
            onUpdate={async (input: any) => {
              await updateStory({ variables: { input: { id: storyId, ...input } } });
              refetch();
            }}
          />
        )}
      </div>
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
