<script lang="ts">
  import { MatrixVisualization } from '$lib/components/visualization';
  
  // Sample data for matrix visualization (concept relationships)
  let sampleData = {
    nodes: ['Concept A', 'Concept B', 'Concept C', 'Concept D', 'Concept E'],
    matrix: [
      [5, 2, 0, 3, 1],  // Relationships for Concept A
      [2, 4, 1, 0, 2],  // Relationships for Concept B
      [0, 1, 3, 2, 0],  // Relationships for Concept C
      [3, 0, 2, 4, 1],  // Relationships for Concept D
      [1, 2, 0, 1, 3]   // Relationships for Concept E
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Matrix View</h1>
    <p class="text-gray-600">Matrix visualization for showing relationships between concepts</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <MatrixVisualization
      data={sampleData}
      width={800}
      height={800}
      title="Concept Relationship Matrix"
      cellSize={40}
    />
  </div>
</div>