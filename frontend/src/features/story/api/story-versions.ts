"use client";

import { gql } from "@apollo/client";

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
