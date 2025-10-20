import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import TreeNode from './TreeNode.svelte';
import type { Concept } from '$lib/api/concepts';

describe('TreeNode', () => {
	const mockConcept: Concept & { children?: Concept[] } = {
		id: 1,
		path: 'Test Concept',
		depth: 0,
		parentId: null,
		children: []
	};

	const mockConceptWithChildren: Concept & { children?: Concept[] } = {
		id: 1,
		path: 'Parent Concept',
		depth: 0,
		parentId: null,
		children: [
			{ id: 2, path: 'Child Concept', depth: 1, parentId: 1 }
		]
	};

	const mockExpandedNodes = writable<Set<number>>(new Set());

	const mockHandlers = {
		onEdit: vi.fn(),
		onDelete: vi.fn(),
		onMove: vi.fn(),
		toggleNode: vi.fn(),
		getChildCount: vi.fn(() => 0),
		validateParent: vi.fn(() => true)
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockExpandedNodes.set(new Set());
	});

	describe('Rendering', () => {
		it('should render concept path', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText('Test Concept')).toBeInTheDocument();
		});

		it('should display depth information', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText(/Depth: 0/i)).toBeInTheDocument();
		});

		it('should display parent ID when present', () => {
			const conceptWithParent = { ...mockConcept, parentId: 5 };

			render(TreeNode, {
				props: {
					concept: conceptWithParent,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText(/Parent: 5/i)).toBeInTheDocument();
		});

		it('should display child count badge when has children', () => {
			mockHandlers.getChildCount.mockReturnValue(3);

			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText(/3 children/i)).toBeInTheDocument();
		});

		it('should display singular "child" when only one child', () => {
			mockHandlers.getChildCount.mockReturnValue(1);

			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText(/1 child/i)).toBeInTheDocument();
		});
	});

	describe('Expand/Collapse', () => {
		it('should show expand button when has children', () => {
			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const expandButton = screen.getByLabelText('Expand');
			expect(expandButton).toBeInTheDocument();
		});

		it('should not show expand button when has no children', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.queryByLabelText('Expand')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Collapse')).not.toBeInTheDocument();
		});

		it('should call toggleNode when expand button is clicked', async () => {
			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const expandButton = screen.getByLabelText('Expand');
			await fireEvent.click(expandButton);

			expect(mockHandlers.toggleNode).toHaveBeenCalledWith(1);
		});

		it('should change button label to Collapse when expanded', () => {
			mockExpandedNodes.set(new Set([1]));

			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByLabelText('Collapse')).toBeInTheDocument();
		});
	});

	describe('Actions', () => {
		it('should render edit button', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByLabelText('Edit concept')).toBeInTheDocument();
		});

		it('should call onEdit when edit button is clicked', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const editButton = screen.getByLabelText('Edit concept');
			await fireEvent.click(editButton);

			expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockConcept);
		});

		it('should render delete button', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByLabelText('Delete concept')).toBeInTheDocument();
		});

		it('should call onDelete when delete button is clicked', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const deleteButton = screen.getByLabelText('Delete concept');
			await fireEvent.click(deleteButton);

			expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
		});
	});

	describe('Keyboard Navigation', () => {
		it('should expand on ArrowRight when collapsed and has children', async () => {
			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			await fireEvent.keyDown(nodeContent, { key: 'ArrowRight' });

			expect(mockHandlers.toggleNode).toHaveBeenCalledWith(1);
		});

		it('should collapse on ArrowLeft when expanded', async () => {
			mockExpandedNodes.set(new Set([1]));

			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			await fireEvent.keyDown(nodeContent, { key: 'ArrowLeft' });

			expect(mockHandlers.toggleNode).toHaveBeenCalledWith(1);
		});

		it('should call onEdit on Enter key', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			await fireEvent.keyDown(nodeContent, { key: 'Enter' });

			expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockConcept);
		});

		it('should call onDelete on Shift+Delete', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			await fireEvent.keyDown(nodeContent, { key: 'Delete', shiftKey: true });

			expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
		});
	});

	describe('Drag and Drop', () => {
		it('should be draggable', () => {
			const { container } = render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const draggableElement = container.querySelector('[draggable="true"]');
			expect(draggableElement).toBeInTheDocument();
		});

		it('should set concept ID in dataTransfer on drag start', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			const dataTransfer = {
				effectAllowed: '',
				setData: vi.fn(),
				getData: vi.fn()
			};

			await fireEvent.dragStart(nodeContent, { dataTransfer });

			expect(dataTransfer.setData).toHaveBeenCalledWith('conceptId', '1');
		});
	});

	describe('Accessibility', () => {
		it('should have treeitem role', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByRole('treeitem')).toBeInTheDocument();
		});

		it('should have aria-expanded when has children', () => {
			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const treeItem = screen.getByRole('treeitem');
			expect(treeItem).toHaveAttribute('aria-expanded');
		});

		it('should have aria-level based on level prop', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					level: 2,
					...mockHandlers
				}
			});

			const treeItem = screen.getByRole('treeitem');
			expect(treeItem).toHaveAttribute('aria-level', '3');
		});

		it('should be keyboard focusable', () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const treeItem = screen.getByRole('treeitem');
			expect(treeItem).toHaveAttribute('tabindex', '0');
		});
	});

	describe('Visual Styling', () => {
		it('should apply depth color based on level', () => {
			const { container } = render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					level: 1,
					...mockHandlers
				}
			});

			const nodeContent = container.querySelector('.node-content');
			expect(nodeContent).toHaveClass(/border-l-/);
		});

		it('should apply correct padding based on level', () => {
			const { container } = render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					level: 3,
					...mockHandlers
				}
			});

			const nodeContent = container.querySelector('.node-content');
			expect(nodeContent).toHaveStyle({ paddingLeft: '96px' }); // 3 * 24 + 24 = 96
		});
	});

	describe('Context Menu', () => {
		it('should show context menu on right click', async () => {
			render(TreeNode, {
				props: {
					concept: mockConcept,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			const nodeContent = screen.getByRole('treeitem');
			await fireEvent.contextMenu(nodeContent, { clientX: 100, clientY: 200 });

			// Context menu should appear with Edit and Delete options
			const editButtons = screen.getAllByText('Edit');
			expect(editButtons.length).toBeGreaterThan(1); // One in actions, one in context menu
		});
	});

	describe('Children Rendering', () => {
		it('should render children when expanded', () => {
			mockExpandedNodes.set(new Set([1]));

			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.getByText('Child Concept')).toBeInTheDocument();
		});

		it('should not render children when collapsed', () => {
			render(TreeNode, {
				props: {
					concept: mockConceptWithChildren,
					expandedNodes: mockExpandedNodes,
					...mockHandlers
				}
			});

			expect(screen.queryByText('Child Concept')).not.toBeInTheDocument();
		});
	});
});
