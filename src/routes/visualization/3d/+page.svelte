<script lang="ts">
  import { ThreeDVisualization } from '$lib/components/visualization';
  
  // Sample 3D data
  let sampleData = {
    nodes: [
      { 
        id: '1', 
        name: 'Root Concept', 
        position: { x: 0, y: 0, z: 0 },
        color: '#4682b4',
        size: 0.2
      },
      { 
        id: '2', 
        name: 'Entity A', 
        position: { x: 2, y: 1, z: 1 },
        color: '#32cd32',
        size: 0.15
      },
      { 
        id: '3', 
        name: 'Entity B', 
        position: { x: -2, y: -1, z: -1 },
        color: '#32cd32',
        size: 0.15
      },
      { 
        id: '4', 
        name: 'Relation X', 
        position: { x: 1, y: 2, z: -1 },
        color: '#ff6347',
        size: 0.12
      },
      { 
        id: '5', 
        name: 'Relation Y', 
        position: { x: -1, y: -2, z: 1 },
        color: '#ff6347',
        size: 0.12
      },
      { 
        id: '6', 
        name: 'Attribute Z', 
        position: { x: 0, y: -2, z: 2 },
        color: '#9370db',
        size: 0.1
      }
    ],
    edges: [
      { id: 'e1', from: '1', to: '2', color: '#999999' },
      { id: 'e2', from: '1', to: '3', color: '#999999' },
      { id: 'e3', from: '2', to: '4', color: '#999999' },
      { id: 'e4', from: '3', to: '5', color: '#999999' },
      { id: 'e5', from: '1', to: '6', color: '#999999' }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">3D Visualization</h1>
    <p class="text-gray-600">Three-dimensional visualization of complex structures</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <ThreeDVisualization
      data={sampleData}
      width={900}
      height={700}
      title="3D Ontology Visualization"
    />
  </div>
</div>