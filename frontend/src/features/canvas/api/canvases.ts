"use client";

import { gql } from "@apollo/client";

// === Queries ===
export const CANVASES_QUERY = gql`
  query GetUserCanvases {
    canvases {
      id
      name
      description
      level
      order
      parent {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// === Mutations ===
export const CREATE_CANVAS_MUTATION = gql`
  mutation CreateCanvas(
    $name: String!
    $description: String
    $parentId: String
  ) {
    createCanvas(name: $name, description: $description, parentId: $parentId) {
      id
      name
      description
      level
      parent {
        id
        name
      }
    }
  }
`;

export const UPDATE_CANVAS_MUTATION = gql`
  mutation UpdateCanvas($id: String!, $name: String, $description: String) {
    updateCanvas(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_CANVAS_MUTATION = gql`
  mutation DeleteCanvas($id: String!) {
    deleteCanvas(id: $id)
  }
`;

// === Types ===
export interface Canvas {
  id: string;
  name: string;
  description?: string | null;
  level?: number;
  order?: number;
  parent?: { id: string; name: string } | null;
}

export interface CanvasesData {
  canvases: Canvas[];
}

export interface CreateCanvasInput {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCanvasInput {
  id: string;
  name?: string;
  description?: string;
}
