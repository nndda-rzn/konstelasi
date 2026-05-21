'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client/core';

export const CANVASES_QUERY = gql`
  query GetUserCanvases {
    canvases {
      id
      name
      description
      level
      order
      parent { id name }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CANVAS_MUTATION = gql`
  mutation CreateCanvas($name: String!, $description: String, $parentId: String) {
    createCanvas(name: $name, description: $description, parentId: $parentId) {
      id
      name
      description
      level
      parent { id name }
    }
  }
`;

export const UPDATE_CANVAS_MUTATION = gql`
  mutation UpdateCanvas($id: String!, $name: String, $description: String) {
    updateCanvas(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_CANVAS_MUTATION = gql`
  mutation DeleteCanvas($id: String!) {
    deleteCanvas(id: $id)
  }
`;

import { useRouter } from 'next/navigation';

interface Canvas {
  id: string;
  name: string;
  description?: string | null;
  level?: number;
  order?: number;
  parent?: { id: string; name: string } | null;
}

interface CanvasContextType {
  canvases: Canvas[];
  selectedCanvasId: string | null;
  loading: boolean;
  setSelectedCanvasId: (id: string | null) => void;
  createCanvas: (name: string, description?: string, parentId?: string) => Promise<void>;
  updateCanvas: (id: string, name: string, description?: string) => Promise<void>;
  deleteCanvas: (id: string) => Promise<void>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data, loading: queryLoading, error, refetch } = useQuery<any>(CANVASES_QUERY, {
    fetchPolicy: 'cache-and-network',
    ssr: false,
  });

  useEffect(() => {
    if (data && !queryLoading) {
      setLoading(false);
      if (!selectedCanvasId && data.canvases?.length > 0) {
        setSelectedCanvasId(data.canvases[0].id);
      }
    }
  }, [data, queryLoading, selectedCanvasId]);

  const [createCanvas] = useMutation<any>(CREATE_CANVAS_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to create canvas:', error);
    },
  });

  const [updateCanvas] = useMutation<any>(UPDATE_CANVAS_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to update canvas:', error);
    },
  });

  const [deleteCanvas] = useMutation<any>(DELETE_CANVAS_MUTATION, {
    onCompleted: () => {
      refetch();
      // If the deleted canvas was the selected one, select the first available canvas
      if (selectedCanvasId) {
        const remainingCanvases = data?.canvases?.filter((c: Canvas) => c.id !== selectedCanvasId) || [];
        if (remainingCanvases.length > 0) {
          setSelectedCanvasId(remainingCanvases[0].id);
        } else {
          setSelectedCanvasId(null);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to delete canvas:', error);
    },
  });

  const canvases = data?.canvases || [];

  const handleCreateCanvas = useCallback(async (name: string, description?: string, parentId?: string) => {
    await createCanvas({
      variables: {
        name,
        description,
        parentId,
      },
    });
  }, [createCanvas]);

  const handleUpdateCanvas = useCallback(async (id: string, name: string, description?: string) => {
    await updateCanvas({
      variables: {
        id,
        name,
        description,
      },
    });
  }, [updateCanvas]);

  const handleDeleteCanvas = useCallback(async (id: string) => {
    await deleteCanvas({
      variables: {
        id,
      },
    });
  }, [deleteCanvas]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching canvases:', error);
    }
  }, [error]);

  const value = {
    canvases,
    selectedCanvasId,
    loading: queryLoading || loading,
    setSelectedCanvasId,
    createCanvas: handleCreateCanvas,
    updateCanvas: handleUpdateCanvas,
    deleteCanvas: handleDeleteCanvas,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};