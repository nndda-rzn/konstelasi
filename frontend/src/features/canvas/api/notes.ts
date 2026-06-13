"use client";

import { gql } from "@apollo/client";

// === Note queries ===
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
      titleFont
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
        source {
          id
        }
        target {
          id
        }
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

export const GET_NOTE_VERSIONS = gql`
  query GetNoteVersions($noteId: String!) {
    getNoteVersions(noteId: $noteId) {
      id
      title
      content
      color
      mood
      version
      createdAt
    }
  }
`;

// === Writing analytics ===
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
