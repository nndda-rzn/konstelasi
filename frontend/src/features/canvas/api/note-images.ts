import { gql } from "@apollo/client";

/**
 * Note image mutations.
 */
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
