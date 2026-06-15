import { gql } from "@apollo/client";

/**
 * Note link (edge) mutations.
 */
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
