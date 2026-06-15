"use client";

import { useCallback, useRef } from "react";
import {
  addEdge,
  reconnectEdge,
  type Edge,
  type Connection,
} from "@xyflow/react";
import { useMutation } from "@apollo/client/react";
import { CREATE_NOTE_LINK, DELETE_NOTE_LINK } from "@/graphql/mutations";

type SetEdges = React.Dispatch<React.SetStateAction<Edge[]>>;

/**
 * useEdgeConnection - Wires onConnect, onReconnect, and onReconnectEnd
 * for the story canvas. Uses a single ref to track whether a
 * reconnect was successful.
 */
export function useEdgeConnection(setEdges: SetEdges) {
  const [createNoteLink] = useMutation(CREATE_NOTE_LINK);
  const [deleteNoteLink] = useMutation(DELETE_NOTE_LINK);
  const edgeReconnectSuccessful = useRef(true);

  const onConnect = useCallback(
    async (connection: Connection) => {
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
        throw err;
      }
    },
    [createNoteLink, setEdges]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    async (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      try {
        setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
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
        throw err;
      }
    },
    [createNoteLink, deleteNoteLink, setEdges]
  );

  const onReconnectEnd = useCallback(
    (_event: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        if (!edge.id.startsWith("temp-")) {
          deleteNoteLink({ variables: { id: edge.id } }).catch(() => {});
        }
      }
      edgeReconnectSuccessful.current = true;
    },
    [deleteNoteLink, setEdges]
  );

  return { onConnect, onReconnectStart, onReconnect, onReconnectEnd };
}
