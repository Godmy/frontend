/**
 * Concept entity types
 * Business domain types for Concept entity
 */

export type Concept = {
  id: number;
  path: string;
  depth: number;
  parentId: number | null;
};

export type ConceptInput = {
  path: string;
  depth: number;
  parentId: number | null;
};

// Extended type for tree structure
export type TreeConcept = Concept & {
  children?: Concept[];
};
