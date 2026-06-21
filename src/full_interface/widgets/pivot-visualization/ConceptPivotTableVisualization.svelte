<script lang="ts">
    import GenericPivotTableVisualization from './GenericPivotTableVisualization.svelte';
    import type { Concept } from '$lib/api/concepts';
    import type { PivotTableUIProps } from 'svelte-pivottable/types';
    
    // Props
    export let concepts: Concept[] = [];
    export let onChange: ((props: PivotTableUIProps) => void) | undefined = undefined;
    export let rendererName: string = 'Table';
    export let aggregatorName: string = 'Count';
    export let initialRows: string[] = ['depth'];
    export let initialCols: string[] = [];
    export let initialVals: string[] = [];
    export let initialSorters: Record<string, (a: string, b: string) => number> = {};
    export let initialValueFilter: Record<string, Record<string, boolean>> = {};
    export let maxDataSize: number = 10000; // Limit for performance
    export let showPerformanceWarning: boolean = true;

    // Transform concepts to the format expected by pivot table
    const transformConceptsToPivotData = (concepts: Concept[]): any[] => {
        if (!concepts || concepts.length === 0) return [];

        // Apply performance limit
        const limitedConcepts = concepts.length > maxDataSize 
            ? concepts.slice(0, maxDataSize) 
            : concepts;

        // Transform the concepts into an array of objects format suitable for pivot table
        return limitedConcepts.map(concept => ({
            id: concept.id,
            path: concept.path,
            depth: concept.depth,
            parentId: concept.parentId === null ? 'ROOT' : concept.parentId,
            pathDepth: `${concept.path} [Depth: ${concept.depth}]`, // Combined attribute for analysis
            hasChildren: concept.parentId === null ? 'Parent' : 'Child', // Categorical attribute
            level: concept.depth === 0 ? 'Root' : 
                   concept.depth === 1 ? 'Category' : 
                   concept.depth === 2 ? 'Subcategory' : 'Item' // Additional categorical attribute
        }));
    };

    // Transform the concepts to pivot table format
    const pivotData = $derived(transformConceptsToPivotData(concepts));
    
    // Define fields that should be hidden from aggregators
    const hiddenFromAggregators = ['id', 'path', 'parentId'];
</script>

<GenericPivotTableVisualization
    data={pivotData}
    onChange={onChange}
    rendererName={rendererName}
    aggregatorName={aggregatorName}
    initialRows={initialRows}
    initialCols={initialCols}
    initialVals={initialVals}
    initialSorters={initialSorters}
    initialValueFilter={initialValueFilter}
    maxDataSize={maxDataSize}
    showPerformanceWarning={showPerformanceWarning}
    hiddenFromAggregators={hiddenFromAggregators}
/>
