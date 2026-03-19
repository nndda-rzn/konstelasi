import { gql } from '@apollo/client/core';

export const GET_NOTES = gql`
  query GetNotes {
    getNotes {
      id
      title
      content
      type
      positionX
      positionY
      width
      height
      color
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
