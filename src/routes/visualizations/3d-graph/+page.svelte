<script lang="ts">
  import ThreeDeeGraph from '$lib/components/visualizations/ThreeDeeGraph.svelte';
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/visualizations" class="text-blue-600 hover:text-blue-800">&larr; Back to gallery</a>
  </div>

  <h1 class="text-3xl font-bold mb-4">3D Graph</h1>
  <p class="text-gray-600 mb-6">
    Three-dimensional graph visualization using THREE.js.
  </p>

  <ThreeDeeGraph />
</div>
