export type SortDirection = 'asc' | 'desc' | null;

export interface SortState<T = string> {
	field: T | null;
	direction: SortDirection;
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(current: SortDirection): SortDirection {
	if (current === null) return 'asc';
	if (current === 'asc') return 'desc';
	return null;
}

/**
 * Sort array by field and direction
 */
export function sortBy<T extends Record<string, any>>(
	array: T[],
	field: keyof T,
	direction: SortDirection
): T[] {
	if (direction === null) return array;

	return [...array].sort((a, b) => {
		const aVal = a[field];
		const bVal = b[field];

		// Handle null/undefined
		if (aVal == null && bVal == null) return 0;
		if (aVal == null) return direction === 'asc' ? 1 : -1;
		if (bVal == null) return direction === 'asc' ? -1 : 1;

		// Compare values
		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return direction === 'asc'
				? aVal.localeCompare(bVal)
				: bVal.localeCompare(aVal);
		}

		if (typeof aVal === 'number' && typeof bVal === 'number') {
			return direction === 'asc' ? aVal - bVal : bVal - aVal;
		}

		// For dates or other comparable values
		if (aVal < bVal) return direction === 'asc' ? -1 : 1;
		if (aVal > bVal) return direction === 'asc' ? 1 : -1;
		return 0;
	});
}

/**
 * Create a sortable table state
 */
export function createSortState<T extends string>(initialField: T | null = null) {
	let field = $state<T | null>(initialField);
	let direction = $state<SortDirection>(null);

	function toggleSort(newField: T) {
		if (field === newField) {
			direction = toggleSortDirection(direction);
			if (direction === null) {
				field = null;
			}
		} else {
			field = newField;
			direction = 'asc';
		}
	}

	function reset() {
		field = null;
		direction = null;
	}

	return {
		get field() {
			return field;
		},
		get direction() {
			return direction;
		},
		toggleSort,
		reset
	};
}
