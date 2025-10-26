import type { Dictionary } from '$lib/api/dictionaries';

/**
 * Content map for O(1) access to dictionary entries by concept path
 * Key: concept.path (e.g., 'ui/nav/dashboard')
 * Value: Dictionary entry
 */
export type ContentMap = Map<string, Dictionary>;

/**
 * Build a content map from dictionary array for fast lookups
 *
 * @param dictionaries - Array of dictionary entries
 * @returns Map with concept.path as key and dictionary as value
 *
 * @example
 * const contentMap = buildContentMap(data.dictionaries);
 * const content = contentMap.get('ui/nav/dashboard');
 */
export function buildContentMap(dictionaries: Dictionary[]): ContentMap {
	return new Map(
		dictionaries
			.filter((d) => d.concept?.path) // Filter out entries without concept path
			.map((d) => [d.concept.path, d])
	);
}

/**
 * Get content by concept path with fallback
 *
 * @param contentMap - Map built by buildContentMap
 * @param conceptPath - Path to the concept (e.g., 'ui/nav/dashboard')
 * @param fallback - Optional fallback text if concept not found
 * @returns Content name or fallback
 *
 * @example
 * const text = getContent(contentMap, 'ui/nav/dashboard', 'Dashboard');
 */
export function getContent(
	contentMap: ContentMap,
	conceptPath: string,
	fallback?: string
): string {
	const dict = contentMap.get(conceptPath);
	return dict?.name || fallback || conceptPath;
}

/**
 * Get content description by concept path with fallback
 *
 * @param contentMap - Map built by buildContentMap
 * @param conceptPath - Path to the concept
 * @param fallback - Optional fallback text if description not found
 * @returns Content description or fallback
 */
export function getContentDescription(
	contentMap: ContentMap,
	conceptPath: string,
	fallback?: string
): string | null {
	const dict = contentMap.get(conceptPath);
	return dict?.description || fallback || null;
}

/**
 * Check if content exists for a given concept path
 *
 * @param contentMap - Map built by buildContentMap
 * @param conceptPath - Path to the concept
 * @returns True if content exists
 */
export function hasContent(contentMap: ContentMap, conceptPath: string): boolean {
	return contentMap.has(conceptPath);
}
