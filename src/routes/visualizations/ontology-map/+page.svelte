<script lang="ts">
  import OntologyMap from '$lib/components/visualizations/OntologyMap.svelte';

  // Sample test data
  const sampleConcepts = [
    { id: 1, path: 'Root', parentId: null, depth: 0 },
    { id: 2, path: 'Category A', parentId: 1, depth: 1 },
    { id: 3, path: 'Category B', parentId: 1, depth: 1 },
    { id: 4, path: 'Subcategory A1', parentId: 2, depth: 2 },
    { id: 5, path: 'Subcategory A2', parentId: 2, depth: 2 },
    { id: 6, path: 'Subcategory B1', parentId: 3, depth: 2 },
    { id: 7, path: 'Item A1a', parentId: 4, depth: 3 },
    { id: 8, path: 'Item A1b', parentId: 4, depth: 3 },
  ];
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/visualizations" class="text-blue-600 hover:text-blue-800">&larr; Back to gallery</a>
  </div>

  <h1 class="text-3xl font-bold mb-4">Ontology Map</h1>
  <p class="text-gray-600 mb-6">
    Interactive ontology map with depth filtering and export capabilities.
  </p>

  <OntologyMap concepts={sampleConcepts} />
</div>
