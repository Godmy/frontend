/**
 * Language entity types
 * Business domain types for Language entity
 */

export type Language = {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  createdAt: string;
  updatedAt: string;
};

export type LanguageInput = {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
};
