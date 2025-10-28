/**
 * Dictionary entity types
 * Business domain types for Dictionary entity
 */

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
