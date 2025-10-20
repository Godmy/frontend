// Type definitions for Languages
// API functions have been migrated to Houdini GraphQL queries/mutations
// See: src/routes/languages/+page.svelte for Houdini usage

export type Language = {
	id: number;
	name: string;
	code: string;
};

export type LanguageInput = {
	name: string;
	code: string;
};
