<script lang="ts">
  import { RadialTreeVisualization } from '$lib/components/visualization';
  
  // Sample hierarchical data for radial visualization
  let sampleData = {
    id: 'root',
    name: 'Root Concept',
    children: [
      {
        id: 'child1',
        name: 'Child A',
        children: [
          { id: 'sub1', name: 'Sub A1' },
          { id: 'sub2', name: 'Sub A2' }
        ]
      },
      {
        id: 'child2',
        name: 'Child B',
        children: [
          { id: 'sub3', name: 'Sub B1' },
          { id: 'sub4', name: 'Sub B2' }
        ]
      },
      {
        id: 'child3',
        name: 'Child C',
        children: [
          { id: 'sub5', name: 'Sub C1' },
          { id: 'sub6', name: 'Sub C2' }
        ]
      }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Radial Tree</h1>
    <p class="text-gray-600">Radial tree visualization for complex hierarchies</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex justify-center">
    <RadialTreeVisualization
      data={sampleData}
      width={800}
      height={800}
      title="Radial Hierarchy Tree"
      radius={300}
    />
  </div>
</div>