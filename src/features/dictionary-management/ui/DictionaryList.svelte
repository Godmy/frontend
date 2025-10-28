<script lang="ts">
  import type { Dictionary } from '$entities/dictionary';

  type Props = {
    dictionaries: Dictionary[];
    onEdit: (dictionary: Dictionary) => void;
    onDelete: (id: number) => void;
  };

  let { dictionaries, onEdit, onDelete }: Props = $props();
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <ul class="divide-y divide-gray-200">
    {#if dictionaries && dictionaries.length > 0}
      {#each dictionaries as dictionary}
        <li class="px-6 py-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{dictionary.name}</h3>
              {#if dictionary.description}
                <p class="mt-1 text-sm text-gray-500">{dictionary.description}</p>
              {/if}
            </div>
            <div class="flex space-x-2">
              <button
                onclick={() => onEdit(dictionary)}
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button
                onclick={() => onDelete(dictionary.id)}
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
        No dictionaries found. Click "Add Dictionary" to create one.
      </li>
    {/if}
  </ul>
</div>
