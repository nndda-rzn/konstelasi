import { gql } from "@apollo/client";

/**
 * Note positioning mutations (single + batched).
 */
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
