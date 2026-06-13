"use client";

import { gql } from "@apollo/client";

export const GET_ALL_MEDIA = gql`
  query GetAllMedia($canvasId: String, $storyId: String) {
    getAllMedia(canvasId: $canvasId, storyId: $storyId) {
      id
      imageUrl
      caption
      order
      createdAt
      note {
        id
        title
        mood
        storyNodeType
        canvas {
          id
          name
        }
        story {
          id
          title
        }
      }
    }
  }
`;
