<script lang="ts">
  import { NetworkExplorer } from '$lib/components/visualization';
  
  // Sample data for demonstration
  let sampleData = {
    nodes: [
      { id: '1', label: 'Root Concept', type: 'concept', color: '#4682b4' },
      { id: '2', label: 'Entity A', type: 'entity', color: '#32cd32' },
      { id: '3', label: 'Entity B', type: 'entity', color: '#32cd32' },
      { id: '4', label: 'Relation X', type: 'relation', color: '#ff6347' },
      { id: '5', label: 'Relation Y', type: 'relation', color: '#ff6347' },
      { id: '6', label: 'Attribute Z', type: 'attribute', color: '#9370db' }
    ],
    edges: [
      { id: 'e1', from: '1', to: '2' },
      { id: 'e2', from: '1', to: '3' },
      { id: 'e3', from: '2', to: '4' },
      { id: 'e4', from: '2', to: '5' },
      { id: 'e5', from: '3', to: '6' }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Network Explorer</h1>
    <p class="text-gray-600">Interactive network graphs with search and filtering capabilities</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <NetworkExplorer
      data={sampleData}
      width="100%"
      height="600px"
      title="Interactive Network Graph"
      enableSearch={true}
      enableFilter={true}
    />
  </div>
</div>