// Type definitions for Dictionaries
// API functions have been migrated to Houdini GraphQL queries/mutations
// See: src/routes/dictionaries/+page.svelte for Houdini usage

import type { Language } from './languages';
import type { Concept } from './concepts';

export type Dictionary = {
	id: number;
	name: string;
	description: string | null;
	image: string | null;
	languageId: number;
	conceptId: number;
};

export type DictionaryInput = {
	name: string;
	description: string | null;
	image: string | null;
	languageId: number;
	conceptId: number;
};

export type DictionariesData = {
	dictionaries: Dictionary[];
	languages: Language[];
	concepts: Concept[];
};
