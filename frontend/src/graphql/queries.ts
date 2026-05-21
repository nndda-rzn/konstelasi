import { gql } from '@apollo/client/core';

export const GET_NOTES = gql`
  query GetNotes($canvasId: String, $tagIds: [String!]) {
    getNotes(canvasId: $canvasId, tagIds: $tagIds) {
      id
      title
      content
      type
      positionX
      positionY
      width
      height
      color
      mood
      isArchived
      createdAt
      canvas {
        id
        name
      }
      tags {
        id
        name
        color
      }
      images {
        id
        imageUrl
        caption
        order
      }
      outgoingEdges {
        id
        source { id }
        target { id }
        sourceHandle
        targetHandle
        type
        animated
        label
        color
      }
      incomingEdges {
        id
        source {
          id
          title
        }
      }
    }
  }
`;

export const GET_ARCHIVED_NOTES = gql`
  query GetArchivedNotes($canvasId: String) {
    getArchivedNotes(canvasId: $canvasId) {
      id
      title
      content
      type
      color
      mood
      isArchived
      archivedAt
      createdAt
      canvas {
        id
        name
      }
      tags {
        id
        name
        color
      }
      images {
        id
        imageUrl
        caption
        order
      }
    }
  }
`;

export const GET_WRITING_STREAK = gql`
  query GetWritingStreak {
    getWritingStreak {
      id
      currentStreak
      longestStreak
      totalWriteDays
      lastWriteDate
    }
  }
`;

export const GET_CHILD_CANVASES = gql`
  query ChildCanvases($parentId: String!) {
    childCanvases(parentId: $parentId) {
      id
      name
      description
      level
      order
      isArchived
      createdAt
    }
  }
`;

export const GET_ROOT_CANVASES = gql`
  query RootCanvases {
    rootCanvases {
      id
      name
      description
      level
      order
      isArchived
      createdAt
    }
  }
`;
