import { gql } from "@apollo/client";

/**
 * Note CRUD mutations (create, update, delete).
 */
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
      titleFont
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
