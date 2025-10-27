<script lang="ts">
  import { OntologyMap } from '$lib/components/visualization';
  import { onMount } from 'svelte';
  
  // Sample data for ontology visualization
  let sampleData = {
    nodes: [
      { id: '1', label: 'Root Concept', type: 'concept', x: 0, y: 0 },
      { id: '2', label: 'Entity A', type: 'entity', x: 100, y: -50 },
      { id: '3', label: 'Entity B', type: 'entity', x: 100, y: 50 },
      { id: '4', label: 'Relation X', type: 'relation', x: 200, y: -75 },
      { id: '5', label: 'Relation Y', type: 'relation', x: 200, y: 0 },
      { id: '6', label: 'Attribute Z', type: 'attribute', x: 200, y: 75 }
    ],
    edges: [
      { id: 'e1', from: '1', to: '2' },
      { id: 'e2', from: '1', to: '3' },
      { id: 'e3', from: '2', to: '4' },
      { id: 'e4', from: '2', to: '5' },
      { id: 'e5', from: '3', to: '6' }
    ]
  };
  
  let visualizationType = 'force';
  
  function changeVisualizationType(type: string) {
    visualizationType = type;
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Ontology Map</h1>
    <p class="text-gray-600">Comprehensive ontology visualization with multiple view types</p>
  </div>
  
  <div class="mb-6 flex flex-wrap gap-2">
    <button 
      class={`px-4 py-2 rounded-md ${visualizationType === 'force' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-indigo-700 transition-colors`}
      on:click={() => changeVisualizationType('force')}
    >
      Force Layout
    </button>
    <button 
      class={`px-4 py-2 rounded-md ${visualizationType === 'sankey' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-indigo-700 transition-colors`}
      on:click={() => changeVisualizationType('sankey')}
    >
      Sankey Diagram
    </button>
    <button 
      class={`px-4 py-2 rounded-md ${visualizationType === 'hierarchy' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-indigo-700 transition-colors`}
      on:click={() => changeVisualizationType('hierarchy')}
    >
      Hierarchy View
    </button>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <OntologyMap
      data={sampleData}
      {visualizationType}
      width={900}
      height={600}
      title="Ontology Map Visualization"
    />
  </div>
</div>