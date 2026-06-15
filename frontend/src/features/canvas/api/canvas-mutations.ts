import { gql } from "@apollo/client";

/**
 * Canvas tree mutations.
 */
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
