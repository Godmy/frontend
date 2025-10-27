<script lang="ts">
  import { ConceptFlow } from '$lib/components/visualization';
  
  // Sample data for Sankey diagram
  let sampleData = {
    nodes: [
      { id: '1', name: 'Source A' },
      { id: '2', name: 'Source B' },
      { id: '3', name: 'Middle X' },
      { id: '4', name: 'Middle Y' },
      { id: '5', name: 'Target 1' },
      { id: '6', name: 'Target 2' }
    ],
    links: [
      { source: '1', target: '3', value: 10 },
      { source: '1', target: '4', value: 5 },
      { source: '2', target: '3', value: 8 },
      { source: '2', target: '4', value: 12 },
      { source: '3', target: '5', value: 9 },
      { source: '3', target: '6', value: 9 },
      { source: '4', target: '5', value: 7 },
      { source: '4', target: '6', value: 10 }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Concept Flow</h1>
    <p class="text-gray-600">Sankey diagrams for showing data flows between concepts</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <ConceptFlow
      data={sampleData}
      width={900}
      height={600}
      title="Concept Flow Diagram"
    />
  </div>
</div>