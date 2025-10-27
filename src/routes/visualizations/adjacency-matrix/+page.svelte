<script lang="ts">
  import AdjacencyMatrix from '$lib/components/visualizations/AdjacencyMatrix.svelte';
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/visualizations" class="text-blue-600 hover:text-blue-800">&larr; Back to gallery</a>
  </div>

  <h1 class="text-3xl font-bold mb-4">Adjacency Matrix</h1>
  <p class="text-gray-600 mb-6">
    Matrix representation showing connections between nodes.
  </p>

  <AdjacencyMatrix />
</div>
