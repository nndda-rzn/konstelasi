"use client";

import { gql } from "@apollo/client";

// === Queries ===
export const TAGS_QUERY = gql`
  query GetUserTags {
    tags {
      id
      name
      color
      description
    }
  }
`;

// === Mutations ===
export const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($name: String!, $color: String, $description: String) {
    createTag(name: $name, color: $color, description: $description) {
      id
      name
      color
      description
    }
  }
`;

export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag(
    $id: String!
    $name: String
    $color: String
    $description: String
  ) {
    updateTag(id: $id, name: $name, color: $color, description: $description) {
      id
      name
      color
      description
    }
  }
`;

export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id)
  }
`;

export const ASSIGN_TAGS_TO_NOTE_MUTATION = gql`
  mutation AssignTagsToNote($noteId: String!, $tagIds: [String!]!) {
    assignTagsToNote(noteId: $noteId, tagIds: $tagIds)
  }
`;

export const REMOVE_TAG_FROM_NOTE_MUTATION = gql`
  mutation RemoveTagFromNote($noteId: String!, $tagId: String!) {
    removeTagFromNote(noteId: $noteId, tagId: $tagId)
  }
`;

// === Types ===
export interface Tag {
  id: string;
  name: string;
  color?: string | null;
  description?: string | null;
}

export interface CreateTagInput {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateTagInput {
  id: string;
  name?: string;
  color?: string;
  description?: string;
}
