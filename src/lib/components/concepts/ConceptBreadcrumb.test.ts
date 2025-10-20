import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ConceptBreadcrumb from './ConceptBreadcrumb.svelte';
import type { Concept } from '$lib/api/concepts';

describe('ConceptBreadcrumb', () => {
	const mockConcepts: Concept[] = [
		{ id: 1, path: 'Root', depth: 0, parentId: null },
		{ id: 2, path: 'Level 1', depth: 1, parentId: 1 },
		{ id: 3, path: 'Level 2', depth: 2, parentId: 2 },
		{ id: 4, path: 'Level 3', depth: 3, parentId: 3 }
	];

	const mockOnNavigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should not render when no currentConceptId is provided', () => {
			const { container } = render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					onNavigate: mockOnNavigate
				}
			});

			expect(container.querySelector('.breadcrumb')).not.toBeInTheDocument();
		});

		it('should render breadcrumb path for single level', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 1,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Root')).toBeInTheDocument();
		});

		it('should render full breadcrumb path from root to current', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 3,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Root')).toBeInTheDocument();
			expect(screen.getByText('Level 1')).toBeInTheDocument();
			expect(screen.getByText('Level 2')).toBeInTheDocument();
		});

		it('should render home button', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const homeButton = screen.getByRole('button', { name: '' });
			expect(homeButton).toBeInTheDocument();
		});

		it('should render separators between items', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 3,
					onNavigate: mockOnNavigate
				}
			});

			const separators = screen.getAllByText('/');
			// Separator between home and Root, Root and Level 1, Level 1 and Level 2
			expect(separators.length).toBe(3);
		});
	});

	describe('Navigation', () => {
		it('should call onNavigate with null when home button is clicked', async () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const homeButton = screen.getByRole('button', { name: '' });
			await fireEvent.click(homeButton);

			expect(mockOnNavigate).toHaveBeenCalledWith(null);
		});

		it('should call onNavigate with concept ID when intermediate item is clicked', async () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 3,
					onNavigate: mockOnNavigate
				}
			});

			const rootButton = screen.getByText('Root');
			await fireEvent.click(rootButton);

			expect(mockOnNavigate).toHaveBeenCalledWith(1);
		});

		it('should not have click handler on current item', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 3,
					onNavigate: mockOnNavigate
				}
			});

			const currentItem = screen.getByText('Level 2');
			expect(currentItem.tagName).toBe('SPAN');
			expect(currentItem).toHaveAttribute('aria-current', 'page');
		});
	});

	describe('Path Building', () => {
		it('should build correct path for deeply nested concept', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 4,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Root')).toBeInTheDocument();
			expect(screen.getByText('Level 1')).toBeInTheDocument();
			expect(screen.getByText('Level 2')).toBeInTheDocument();
			expect(screen.getByText('Level 3')).toBeInTheDocument();
		});

		it('should handle root concept correctly', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 1,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Root')).toBeInTheDocument();
			expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
		});

		it('should handle missing parent gracefully', () => {
			const conceptsWithMissingParent: Concept[] = [
				{ id: 1, path: 'Root', depth: 0, parentId: null },
				{ id: 2, path: 'Orphan', depth: 1, parentId: 999 }
			];

			render(ConceptBreadcrumb, {
				props: {
					concepts: conceptsWithMissingParent,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Orphan')).toBeInTheDocument();
			expect(screen.queryByText('Root')).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have breadcrumb navigation role', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
			expect(nav).toBeInTheDocument();
		});

		it('should mark current item with aria-current', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const currentItem = screen.getByText('Level 1');
			expect(currentItem).toHaveAttribute('aria-current', 'page');
		});

		it('should hide separator icons from screen readers', () => {
			const { container } = render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const separators = container.querySelectorAll('[aria-hidden="true"]');
			expect(separators.length).toBeGreaterThan(0);
		});
	});

	describe('Styling', () => {
		it('should apply different styles for clickable vs current items', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const clickableItem = screen.getByText('Root');
			const currentItem = screen.getByText('Level 1');

			expect(clickableItem.tagName).toBe('BUTTON');
			expect(currentItem.tagName).toBe('SPAN');
		});

		it('should have hover styles for clickable items', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2,
					onNavigate: mockOnNavigate
				}
			});

			const clickableItem = screen.getByText('Root');
			expect(clickableItem).toHaveClass(/hover:text-/);
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty concepts array', () => {
			const { container } = render(ConceptBreadcrumb, {
				props: {
					concepts: [],
					currentConceptId: 1,
					onNavigate: mockOnNavigate
				}
			});

			expect(container.querySelector('.breadcrumb')).not.toBeInTheDocument();
		});

		it('should handle concept not found in array', () => {
			const { container } = render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 999,
					onNavigate: mockOnNavigate
				}
			});

			expect(container.querySelector('.breadcrumb')).not.toBeInTheDocument();
		});

		it('should work without onNavigate handler', () => {
			render(ConceptBreadcrumb, {
				props: {
					concepts: mockConcepts,
					currentConceptId: 2
				}
			});

			expect(screen.getByText('Level 1')).toBeInTheDocument();
		});
	});

	describe('Long Paths', () => {
		it('should handle very long breadcrumb paths', () => {
			const longPath: Concept[] = Array.from({ length: 10 }, (_, i) => ({
				id: i + 1,
				path: `Level ${i}`,
				depth: i,
				parentId: i === 0 ? null : i
			}));

			render(ConceptBreadcrumb, {
				props: {
					concepts: longPath,
					currentConceptId: 10,
					onNavigate: mockOnNavigate
				}
			});

			expect(screen.getByText('Level 0')).toBeInTheDocument();
			expect(screen.getByText('Level 9')).toBeInTheDocument();
		});
	});
});
