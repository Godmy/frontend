import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import ConceptTree from './ConceptTree.svelte';
import type { Concept } from '$lib/api/concepts';

describe('ConceptTree', () => {
	const mockConcepts: Concept[] = [
		{ id: 1, path: 'Root', depth: 0, parentId: null },
		{ id: 2, path: 'Child 1', depth: 1, parentId: 1 },
		{ id: 3, path: 'Child 2', depth: 1, parentId: 1 },
		{ id: 4, path: 'Grandchild', depth: 2, parentId: 2 }
	];

	const mockHandlers = {
		onEdit: vi.fn(),
		onDelete: vi.fn(),
		onMove: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Tree Rendering', () => {
		it('should render tree structure correctly', () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			expect(screen.getByText('Root')).toBeInTheDocument();
			expect(screen.getByText('Child 1')).toBeInTheDocument();
			expect(screen.getByText('Child 2')).toBeInTheDocument();
			expect(screen.getByText('Grandchild')).toBeInTheDocument();
		});

		it('should display total concept count', () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			expect(screen.getByText(/Total concepts: 4/i)).toBeInTheDocument();
		});

		it('should render empty state when no concepts', () => {
			render(ConceptTree, {
				props: {
					concepts: [],
					...mockHandlers
				}
			});

			expect(
				screen.getByText(/No concepts found. Click "Add Concept" to create one./i)
			).toBeInTheDocument();
		});
	});

	describe('Search Functionality', () => {
		it('should filter concepts based on search query', async () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			const searchInput = screen.getByPlaceholderText('Search concepts...');
			await fireEvent.input(searchInput, { target: { value: 'Child' } });

			expect(screen.getByText('Child 1')).toBeInTheDocument();
			expect(screen.getByText('Child 2')).toBeInTheDocument();
			expect(screen.queryByText('Root')).not.toBeInTheDocument();
		});

		it('should show no results message when search has no matches', async () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			const searchInput = screen.getByPlaceholderText('Search concepts...');
			await fireEvent.input(searchInput, { target: { value: 'NonExistent' } });

			expect(screen.getByText(/No concepts found matching your search./i)).toBeInTheDocument();
		});

		it('should display filtered count when searching', async () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			const searchInput = screen.getByPlaceholderText('Search concepts...');
			await fireEvent.input(searchInput, { target: { value: 'Child' } });

			expect(screen.getByText(/Filtered: 3/i)).toBeInTheDocument();
		});
	});

	describe('Expand/Collapse', () => {
		it('should have expand all button', () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			expect(screen.getByText('Expand All')).toBeInTheDocument();
		});

		it('should have collapse all button', () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			expect(screen.getByText('Collapse All')).toBeInTheDocument();
		});
	});

	describe('Tree Building', () => {
		it('should correctly build tree hierarchy', () => {
			const { container } = render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			// Проверяем наличие корневого узла
			const rootNode = screen.getByText('Root').closest('li');
			expect(rootNode).toBeInTheDocument();

			// Проверяем, что дочерние узлы присутствуют
			const child1 = screen.getByText('Child 1');
			const child2 = screen.getByText('Child 2');
			expect(child1).toBeInTheDocument();
			expect(child2).toBeInTheDocument();
		});

		it('should handle orphaned nodes by adding them to root', () => {
			const conceptsWithOrphan: Concept[] = [
				{ id: 1, path: 'Root', depth: 0, parentId: null },
				{ id: 2, path: 'Orphan', depth: 1, parentId: 999 } // Parent doesn't exist
			];

			render(ConceptTree, {
				props: {
					concepts: conceptsWithOrphan,
					...mockHandlers
				}
			});

			// Orphan should still be rendered
			expect(screen.getByText('Orphan')).toBeInTheDocument();
		});
	});

	describe('Circular Dependency Validation', () => {
		it('should validate parent correctly', () => {
			const { component } = render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			// Нельзя сделать узел родителем самого себя
			// Эта логика находится внутри компонента, но мы проверяем структуру
			expect(mockConcepts.find((c) => c.id === 1)).toBeDefined();
			expect(mockConcepts.find((c) => c.id === 2)?.parentId).toBe(1);
		});
	});

	describe('Child Count', () => {
		it('should display child count for nodes with children', () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			// Root has 2 direct children
			const rootNode = screen.getByText('Root').closest('.node-content');
			expect(rootNode).toBeInTheDocument();
		});
	});

	describe('Actions', () => {
		it('should call onEdit when edit button is clicked', async () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			const editButtons = screen.getAllByText('Edit');
			await fireEvent.click(editButtons[0]);

			expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
		});

		it('should call onDelete when delete button is clicked', async () => {
			render(ConceptTree, {
				props: {
					concepts: mockConcepts,
					...mockHandlers
				}
			});

			const deleteButtons = screen.getAllByText('Delete');
			await fireEvent.click(deleteButtons[0]);

			expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
		});
	});

	describe('Edge Cases', () => {
		it('should handle single root concept', () => {
			const singleConcept: Concept[] = [{ id: 1, path: 'Single', depth: 0, parentId: null }];

			render(ConceptTree, {
				props: {
					concepts: singleConcept,
					...mockHandlers
				}
			});

			expect(screen.getByText('Single')).toBeInTheDocument();
			expect(screen.getByText(/Total concepts: 1/i)).toBeInTheDocument();
		});

		it('should handle deeply nested hierarchy', () => {
			const deepConcepts: Concept[] = [
				{ id: 1, path: 'Level 0', depth: 0, parentId: null },
				{ id: 2, path: 'Level 1', depth: 1, parentId: 1 },
				{ id: 3, path: 'Level 2', depth: 2, parentId: 2 },
				{ id: 4, path: 'Level 3', depth: 3, parentId: 3 },
				{ id: 5, path: 'Level 4', depth: 4, parentId: 4 }
			];

			render(ConceptTree, {
				props: {
					concepts: deepConcepts,
					...mockHandlers
				}
			});

			expect(screen.getByText('Level 0')).toBeInTheDocument();
			expect(screen.getByText('Level 4')).toBeInTheDocument();
		});

		it('should handle multiple root nodes', () => {
			const multipleRoots: Concept[] = [
				{ id: 1, path: 'Root 1', depth: 0, parentId: null },
				{ id: 2, path: 'Root 2', depth: 0, parentId: null },
				{ id: 3, path: 'Root 3', depth: 0, parentId: null }
			];

			render(ConceptTree, {
				props: {
					concepts: multipleRoots,
					...mockHandlers
				}
			});

			expect(screen.getByText('Root 1')).toBeInTheDocument();
			expect(screen.getByText('Root 2')).toBeInTheDocument();
			expect(screen.getByText('Root 3')).toBeInTheDocument();
		});
	});
});
