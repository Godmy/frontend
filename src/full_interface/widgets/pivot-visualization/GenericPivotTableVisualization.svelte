<script lang="ts">
    import { PivotTableUI } from 'svelte-pivottable/PivotTableUI';
    import type { PivotTableUIProps } from 'svelte-pivottable/types';
    
    // Props
    export let data: any[] = [];
    export let onChange: ((props: PivotTableUIProps) => void) | undefined = undefined;
    export let rendererName: string = 'Table';
    export let aggregatorName: string = 'Count';
    export let initialRows: string[] = [];
    export let initialCols: string[] = [];
    export let initialVals: string[] = [];
    export let initialSorters: Record<string, (a: string, b: string) => number> = {};
    export let initialValueFilter: Record<string, Record<string, boolean>> = {};
    export let maxDataSize: number = 10000; // Limit for performance
    export let showPerformanceWarning: boolean = true;
    export let hiddenFromAggregators: string[] = [];

    // Local state to store the current pivot table configuration
    let pivotState = $state({
        rows: initialRows,
        cols: initialCols,
        vals: initialVals,
        aggregatorName: aggregatorName,
        rendererName: rendererName,
        sorters: initialSorters,
        valueFilter: initialValueFilter
    });

    // Track performance metrics
    let dataSizeWarning = $state(false);

    // Function to limit data for performance
    const transformData = (inputData: any[]): any[] => {
        if (!inputData || inputData.length === 0) return [];

        // Apply performance limit
        const limitedData = inputData.length > maxDataSize 
            ? inputData.slice(0, maxDataSize) 
            : inputData;
        
        if (showPerformanceWarning && inputData.length > maxDataSize) {
            dataSizeWarning = true;
        }

        return limitedData;
    };

    // Track transformed data
    const processedData = $derived(transformData(data));
    const originalDataSize = $derived(data.length);
    const displayedDataSize = $derived(processedData.length);

    // Handle pivot table changes
    const handlePivotChange = (newProps: PivotTableUIProps) => {
        // Update local state
        pivotState = {
            rows: newProps.rows || pivotState.rows,
            cols: newProps.cols || pivotState.cols,
            vals: newProps.vals || pivotState.vals,
            aggregatorName: newProps.aggregatorName || pivotState.aggregatorName,
            rendererName: newProps.rendererName || pivotState.rendererName,
            sorters: newProps.sorters || pivotState.sorters,
            valueFilter: newProps.valueFilter || pivotState.valueFilter
        };

        // Call the external onChange handler if provided
        if (onChange) {
            onChange(newProps);
        }
    };

    // Function to reset filters
    const resetFilters = () => {
        pivotState.valueFilter = {};
        dataSizeWarning = false;
    };
</script>

<div class="pivot-visualization">
    {#if data && data.length > 0}
        <div class="controls mb-4 flex flex-wrap justify-between items-center gap-4">
            <div>
                <h3 class="text-lg font-medium">Data Pivot Analysis</h3>
                <p class="text-sm text-gray-600">
                    Displaying {displayedDataSize} of {originalDataSize} records
                    {#if dataSizeWarning}
                    <span class="ml-2 text-orange-600 font-medium">(Performance limited)</span>
                    {/if}
                </p>
            </div>
            <div class="flex gap-2">
                <button 
                    class="reset-filters-btn px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    on:click={resetFilters}
                >
                    Reset Filters
                </button>
                
                {#if originalDataSize > 1000}
                <select 
                    class="data-limit-select px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
                    bind:value={maxDataSize}
                    on:change={() => dataSizeWarning = data.length > maxDataSize}
                >
                    <option value={500}>Show 500 records</option>
                    <option value={1000}>Show 1,000 records</option>
                    <option value={5000}>Show 5,000 records</option>
                    <option value={10000}>Show 10,000 records</option>
                    <option value={50000}>Show all records</option>
                </select>
                {/if}
            </div>
        </div>
        
        <PivotTableUI
            data={processedData}
            rendererName={rendererName}
            aggregatorName={aggregatorName}
            rows={pivotState.rows}
            cols={pivotState.cols}
            vals={pivotState.vals}
            sorters={pivotState.sorters}
            valueFilter={pivotState.valueFilter}
            onChange={handlePivotChange}
            menuLimit={500}
            compactRows={true}
            hiddenFromAggregators={hiddenFromAggregators}
        />
    {:else}
        <div class="empty-state">
            <p>No data available for visualization.</p>
        </div>
    {/if}
</div>

<style>
    .pivot-visualization {
        width: 100%;
        overflow-x: auto;
        padding: 1rem;
        background-color: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
    }

    .controls {
        width: 100%;
    }

    .reset-filters-btn, .data-limit-select {
        font-size: 0.875rem;
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        color: #6b7280;
    }

    :global(.pvtUi) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        font-family: system-ui, -apple-system, sans-serif;
    }

    :global(.pvtRenderers) {
        margin-bottom: 0.5rem;
    }

    :global(.pvtRows), :global(.pvtCols), :global(.pvtVals), :global(.pvtUnused) {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        border-radius: 0.375rem;
        min-height: 60px;
        background-color: white;
    }

    :global(.pvtTable) {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        font-size: 0.875rem;
        background-color: white;
    }

    :global(.pvtTable th),
    :global(.pvtTable td) {
        border: 1px solid #e5e7eb;
        padding: 0.5rem;
        text-align: left;
        white-space: nowrap;
    }

    :global(.pvtTable th) {
        background-color: #f9fafb;
        font-weight: 500;
    }

    :global(.pvtTable tr:nth-child(even)) {
        background-color: #f9fafb;
    }

    :global(.pvtAxisContainer) {
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        background-color: #f8fafc;
    }

    :global(.pvtDropdown) {
        padding: 0.375rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background-color: white;
        font-size: 0.875rem;
    }

    :global(.pvtFilterBox) {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.5rem;
        background-color: white;
        z-index: 10;
    }
</style>
