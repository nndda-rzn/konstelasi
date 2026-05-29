import { gql } from "@apollo/client/core";

export const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
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
      isLocked
      unlockDate
      isTimeLocked
      storyNodeType
      storyMetadata
      eventDate
      eventLocation
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
      }
    }
  }
`;

export const UPDATE_NOTE_POSITION = gql`
  mutation UpdateNotePosition($input: UpdateNotePositionInput!) {
    updateNotePosition(input: $input) {
      id
      positionX
      positionY
    }
  }
`;

export const UPDATE_NOTE_SIZE = gql`
  mutation UpdateNoteSize($input: UpdateNoteSizeInput!) {
    updateNoteSize(input: $input) {
      id
      width
      height
    }
  }
`;

export const BATCH_UPDATE_NOTES = gql`
  mutation BatchUpdateNotes($inputs: [BatchUpdateNoteInput!]!) {
    batchUpdateNotes(inputs: $inputs) {
      id
      positionX
      positionY
      width
      height
    }
  }
`;

export const CREATE_NOTE_LINK = gql`
  mutation CreateNoteLink($input: CreateNoteLinkInput!) {
    createNoteLink(input: $input) {
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
  }
`;

export const DELETE_NOTE_LINK = gql`
  mutation DeleteNoteLink($id: String!) {
    deleteNoteLink(id: $id)
  }
`;

export const UPDATE_NOTE_LINK = gql`
  mutation UpdateNoteLink($input: UpdateNoteLinkInput!) {
    updateNoteLink(input: $input) {
      id
      label
      color
    }
  }
`;

export const UPDATE_NOTE_CONTENT = gql`
  mutation UpdateNoteContent($input: UpdateNoteContentInput!) {
    updateNoteContent(input: $input) {
      id
      title
      content
      color
      mood
      titleFont
      type
      isArchived
      isLocked
      unlockDate
      isTimeLocked
      eventDate
      eventLocation
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
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;

export const ADD_NOTE_IMAGE = gql`
  mutation AddNoteImage($input: AddNoteImageInput!) {
    addNoteImage(input: $input) {
      id
      imageUrl
      caption
      order
    }
  }
`;

export const DELETE_NOTE_IMAGE = gql`
  mutation DeleteNoteImage($id: String!) {
    deleteNoteImage(id: $id)
  }
`;

// Archive Feature
export const ARCHIVE_NOTE = gql`
  mutation ArchiveNote($id: String!) {
    archiveNote(id: $id) {
      id
      isArchived
      archivedAt
    }
  }
`;

export const UNARCHIVE_NOTE = gql`
  mutation UnarchiveNote($id: String!) {
    unarchiveNote(id: $id) {
      id
      isArchived
      archivedAt
    }
  }
`;

export const ARCHIVE_CANVAS = gql`
  mutation ArchiveCanvas($id: String!) {
    archiveCanvas(id: $id) {
      id
      isArchived
      archivedAt
    }
  }
`;

export const UNARCHIVE_CANVAS = gql`
  mutation UnarchiveCanvas($id: String!) {
    unarchiveCanvas(id: $id) {
      id
      isArchived
      archivedAt
    }
  }
`;

// Nested Canvases
export const MOVE_CANVAS = gql`
  mutation MoveCanvas($id: String!, $parentId: String) {
    moveCanvas(id: $id, parentId: $parentId) {
      id
      level
      parent {
        id
        name
      }
    }
  }
`;

// Note Versioning
export const RESTORE_NOTE_VERSION = gql`
  mutation RestoreNoteVersion($versionId: String!) {
    restoreNoteVersion(versionId: $versionId) {
      id
      title
      content
      color
      mood
    }
  }
`;

export const CREATE_STORY_VERSION = gql`
  mutation CreateStoryVersion(
    $storyId: String!
    $label: String
    $notes: String
  ) {
    createStoryVersion(storyId: $storyId, label: $label, notes: $notes) {
      id
      version
      label
      notes
      nodeCount
      wordCount
      createdAt
    }
  }
`;

export const RESTORE_STORY_VERSION = gql`
  mutation RestoreStoryVersion($versionId: String!) {
    restoreStoryVersion(versionId: $versionId)
  }
`;

export const DELETE_STORY_VERSION = gql`
  mutation DeleteStoryVersion($versionId: String!) {
    deleteStoryVersion(versionId: $versionId)
  }
`;
