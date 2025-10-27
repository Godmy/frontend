<script lang="ts">
  const visualizations = [
    {
      name: 'Network Explorer',
      path: '/visualizations/network-explorer',
      description: 'Interactive network visualization with search'
    },
    {
      name: 'Concept Flow',
      path: '/visualizations/concept-flow',
      description: 'Sankey diagram showing data flow'
    },
    {
      name: 'Radial Hierarchy',
      path: '/visualizations/radial-hierarchy',
      description: 'Radial tree visualization'
    },
    {
      name: 'Adjacency Matrix',
      path: '/visualizations/adjacency-matrix',
      description: 'Matrix representation of connections'
    },
    {
      name: '3D Graph',
      path: '/visualizations/3d-graph',
      description: 'Three.js 3D visualization'
    },
    {
      name: 'Ontology Map',
      path: '/visualizations/ontology-map',
      description: 'Interactive ontology map with filters and export'
    }
  ];
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Visualizations Gallery</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each visualizations as viz}
      <a
        href={viz.path}
        class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition-colors"
      >
        <h2 class="text-xl font-semibold mb-2">{viz.name}</h2>
        <p class="text-gray-600">{viz.description}</p>
      </a>
    {/each}
  </div>

  <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p class="text-sm text-blue-800">
      This is the <strong>visualizations</strong> folder with alternative visualization components.
      For the main visualizations, visit <a href="/visualization" class="underline hover:text-blue-600">/visualization</a>.
    </p>
  </div>
</div>
