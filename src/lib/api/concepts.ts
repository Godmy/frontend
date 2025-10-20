// Type definitions for Concepts
// API functions have been migrated to Houdini GraphQL queries/mutations
// See: src/routes/concepts/+page.svelte for Houdini usage

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
