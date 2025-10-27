<script lang="ts">
  import { onMount } from 'svelte';
  import { GraphVisualization } from '$lib/components/visualization';
  
  // Sample data for demonstration
  let sampleData = {
    nodes: [
      { id: '1', label: 'Root Concept', type: 'concept', color: '#4682b4' },
      { id: '2', label: 'Child A', type: 'entity', color: '#32cd32' },
      { id: '3', label: 'Child B', type: 'entity', color: '#32cd32' },
      { id: '4', label: 'Sub A1', type: 'relation', color: '#ff6347' },
      { id: '5', label: 'Sub A2', type: 'relation', color: '#ff6347' },
      { id: '6', label: 'Sub B1', type: 'attribute', color: '#9370db' }
    ],
    edges: [
      { id: 'e1', from: '1', to: '2', value: 1 },
      { id: 'e2', from: '1', to: '3', value: 1 },
      { id: 'e3', from: '2', to: '4', value: 1 },
      { id: 'e4', from: '2', to: '5', value: 1 },
      { id: 'e5', from: '3', to: '6', value: 1 }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Graph Visualization</h1>
    <p class="text-gray-600">Interactive force-directed graph showing relationships between concepts</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <GraphVisualization
      data={sampleData}
      visualizationType="force"
      width={800}
      height={600}
      title="Interactive Force Graph"
    />
  </div>
  
  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
    <button 
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      on:click={() => document.querySelector('.graph-visualization-container')?.scrollIntoView()}
    >
      Force Directed
    </button>
    <button 
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      on:click={() => document.querySelector('.graph-visualization-container')?.scrollIntoView()}
    >
      Network View
    </button>
    <button 
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      on:click={() => document.querySelector('.graph-visualization-container')?.scrollIntoView()}
    >
      Sankey Diagram
    </button>
  </div>
</div>