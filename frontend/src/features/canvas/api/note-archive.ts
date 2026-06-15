import { gql } from "@apollo/client";

/**
 * Archive + versioning mutations for notes and canvases.
 */
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
