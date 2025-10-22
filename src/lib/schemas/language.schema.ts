import { z } from 'zod';

/**
 * Language validation schema
 */
export const languageSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(100, 'Name must be less than 100 characters')
		.regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
	code: z
		.string()
		.min(2, 'Code must be at least 2 characters')
		.max(10, 'Code must be less than 10 characters')
		.regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Code must be in format: "en", "en-US", etc.')
});

export type LanguageFormData = z.infer<typeof languageSchema>;
