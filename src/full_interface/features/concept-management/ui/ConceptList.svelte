<script lang="ts">
  import type { Concept } from '$entities/concept';

  type Props = {
    concepts: Concept[];
    onEdit: (concept: Concept) => void;
    onDelete: (id: number) => void;
  };

  let { concepts, onEdit, onDelete }: Props = $props();
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <ul class="divide-y divide-gray-200">
    {#if concepts && concepts.length > 0}
      {#each concepts as concept}
        <li class="px-6 py-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{concept.path}</h3>
              <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>Depth: {concept.depth}</span>
                {#if concept.parentId}
                  <span>Parent ID: {concept.parentId}</span>
                {/if}
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                onclick={() => onEdit(concept)}
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button
                onclick={() => onDelete(concept.id)}
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      {/each}
    {:else}
      <li class="px-6 py-12 text-center text-gray-500">
        No concepts found. Click "Add Concept" to create one.
      </li>
    {/if}
  </ul>
</div>
