import { z } from 'zod';

/**
 * Concept validation schema
 */
export const conceptSchema = z.object({
	path: z
		.string()
		.min(1, 'Path is required')
		.max(255, 'Path must be less than 255 characters')
		.regex(/^[a-zA-Z0-9._\-/]+$/, 'Path can only contain letters, numbers, dots, dashes, underscores, and slashes'),
	depth: z
		.number()
		.int('Depth must be an integer')
		.min(0, 'Depth cannot be negative')
		.max(10, 'Depth cannot exceed 10 levels'),
	parentId: z.number().int().positive().nullable().optional()
});

export type ConceptFormData = z.infer<typeof conceptSchema>;
