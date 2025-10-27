<script lang="ts">
  import { HierarchyTree } from '$lib/components/visualization';
  
  // Sample hierarchical data for demonstration
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
          { id: 'sub4', name: 'Sub B2' },
          { 
            id: 'sub5', 
            name: 'Sub B3',
            children: [
              { id: 'deep1', name: 'Deep 1' },
              { id: 'deep2', name: 'Deep 2' }
            ]
          }
        ]
      }
    ]
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Hierarchy Tree</h1>
    <p class="text-gray-600">Tree visualization for hierarchical concept structures</p>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <HierarchyTree
      data={sampleData}
      width={900}
      height={600}
      title="Interactive Hierarchy Tree"
      collapsible={true}
    />
  </div>
</div>