import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import PivotTableVisualization from './PivotTableVisualization.svelte';
import type { Concept } from '$lib/api/concepts';

// Mock svelte-pivottable since it might not work in test environment
vi.mock('svelte-pivottable/PivotTableUI', () => ({
  default: ({ children }: { children: any }) => `<div data-testid="pivot-table-ui">${children}</div>`
}));

vi.mock('svelte-pivottable/TableRenderers', () => ({
  default: { Table: () => {} }
}));

vi.mock('svelte-pivottable/PlotlyRenderers', () => ({
  default: vi.fn(() => ({}))
}));

vi.mock('svelte-pivottable/Utilities', () => ({
  aggregators: {
    Count: vi.fn(() => () => ({
      count: 0,
      push: vi.fn(),
      value: vi.fn(),
      format: vi.fn()
    }))
  }
}));

describe('PivotTableVisualization Component', () => {
  const mockConcepts: Concept[] = [
    { id: 1, path: '/ontology/root', depth: 0, parentId: null },
    { id: 2, path: '/ontology/root/category1', depth: 1, parentId: 1 },
    { id: 3, path: '/ontology/root/category2', depth: 1, parentId: 1 }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders correctly with concepts', async () => {
    const { getByText } = render(PivotTableVisualization, {
      concepts: mockConcepts
    });

    // Should show the header
    expect(getByText('Ontology Pivot Analysis')).toBeInTheDocument();
    
    // Should show the record count
    expect(getByText('Displaying 3 of 3 records')).toBeInTheDocument();
  });

  it('shows empty state when no concepts provided', () => {
    const { getByText } = render(PivotTableVisualization, {
      concepts: []
    });

    expect(getByText('No concept data available for visualization.')).toBeInTheDocument();
  });

  it('limits data correctly when maxDataSize is exceeded', () => {
    const largeConcepts = Array.from({ length: 15000 }, (_, i) => ({
      id: i + 1,
      path: `/ontology/item${i}`,
      depth: i % 5,
      parentId: i > 0 ? i : null
    }));

    const { getByText } = render(PivotTableVisualization, {
      concepts: largeConcepts,
      maxDataSize: 10000
    });

    // Should show performance warning
    expect(getByText('(Performance limited)')).toBeInTheDocument();
    
    // Should show limited record count
    expect(getByText('Displaying 10000 of 15000 records')).toBeInTheDocument();
  });

  it('applies filters correctly', async () => {
    const mockOnChange = vi.fn();
    const { getByText } = render(PivotTableVisualization, {
      concepts: mockConcepts,
      onChange: mockOnChange
    });

    // Since we're mocking the actual pivot component, we'll check that the
    // reset filters button exists and works
    const resetButton = getByText('Reset Filters');
    expect(resetButton).toBeInTheDocument();
    
    await fireEvent.click(resetButton);
    
    // The onChange function should be called when configuration changes
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders data limit selector when dataset is large', () => {
    const largeConcepts = Array.from({ length: 2000 }, (_, i) => ({
      id: i + 1,
      path: `/ontology/item${i}`,
      depth: i % 5,
      parentId: i > 0 ? i : null
    }));

    const { container } = render(PivotTableVisualization, {
      concepts: largeConcepts
    });

    const selectElement = container.querySelector('select');
    expect(selectElement).toBeInTheDocument();
  });
});