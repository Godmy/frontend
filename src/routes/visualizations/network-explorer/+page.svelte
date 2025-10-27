<script lang="ts">
  import NetworkExplorer from '$lib/components/visualizations/NetworkExplorer.svelte';
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/visualizations" class="text-blue-600 hover:text-blue-800">&larr; Back to gallery</a>
  </div>

  <h1 class="text-3xl font-bold mb-4">Network Explorer</h1>
  <p class="text-gray-600 mb-6">
    Interactive network visualization using vis-network with search functionality.
  </p>

  <NetworkExplorer />
</div>
