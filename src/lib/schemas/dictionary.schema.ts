import { z } from 'zod';

/**
 * Dictionary validation schema
 */
export const dictionarySchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(100, 'Name must be less than 100 characters'),
	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.optional()
		.nullable(),
	languageId: z.number().int().positive('Language is required'),
	isPublic: z.boolean().optional().default(false)
});

export type DictionaryFormData = z.infer<typeof dictionarySchema>;
