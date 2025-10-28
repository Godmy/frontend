<script lang="ts">
  import type { SortDirection } from '$lib/utils/sort';

  type Props = {
    field: string;
    label: string;
    currentField: string | null;
    currentDirection: SortDirection;
    onSort: (field: string) => void;
    class?: string;
  };

  let {
    field,
    label,
    currentField,
    currentDirection,
    onSort,
    class: className = ''
  }: Props = $props();

  const isActive = $derived(currentField === field);
</script>

<th
  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider {className}"
>
  <button
    type="button"
    class="group inline-flex items-center space-x-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
    on:click={() => onSort(field)}
    aria-label="Sort by {label}"
  >
    <span>{label}</span>
    <span class="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-700">
      {#if isActive && currentDirection === 'asc'}
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
        </svg>
      {:else if isActive && currentDirection === 'desc'}
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158v10.638A.75.75 0 0110 17z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg class="h-5 w-5 opacity-0 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" />
        </svg>
      {/if}
    </span>
  </button>
</th>