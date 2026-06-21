<script lang="ts">
  import type { Concept } from '$entities/concept';

  type Props = {
    concepts: Concept[];
    currentConceptId?: number;
    onNavigate?: (conceptId: number | null) => void;
  };

  let { concepts, currentConceptId, onNavigate }: Props = $props();

  // Построить цепочку от корня до текущей концепции
  let breadcrumbPath = $derived.by(() => {
    if (!currentConceptId) return [];

    const path: Concept[] = [];
    let current = concepts.find((c) => c.id === currentConceptId);

    while (current) {
      path.unshift(current);
      current = current.parentId ? concepts.find((c) => c.id === current!.parentId) : undefined;
    }

    return path;
  });
</script>

{#if breadcrumbPath.length > 0}
  <nav class="breadcrumb flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
    <!-- Home -->
    <button
      onclick={() => onNavigate?.(null)}
      class="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
    >
      <svg
        class="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
        />
      </svg>
    </button>

    <!-- Breadcrumb items -->
    {#each breadcrumbPath as concept, index}
      <span class="text-gray-400" aria-hidden="true">/</span>
      {#if index === breadcrumbPath.length - 1}
        <!-- Current item -->
        <span class="text-gray-900 font-medium" aria-current="page">
          {concept.path}
        </span>
      {:else}
        <!-- Clickable item -->
        <button
          onclick={() => onNavigate?.(concept.id)}
          class="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline"
        >
          {concept.path}
        </button>
      {/if}
    {/each}
  </nav>
{/if}

<style>
  .breadcrumb {
    overflow-x: auto;
    white-space: nowrap;
  }
</style>
