<script lang="ts">
  import Skeleton from './Skeleton.svelte';

  type Props = {
    rows?: number;
    columns?: number;
  };

  let { rows = 5, columns = 4 }: Props = $props();

  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const columnArray = Array.from({ length: columns }, (_, i) => i);
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        {#each columnArray as _}
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <Skeleton width="80px" height="1rem" />
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each rowArray as _}
        <tr>
          {#each columnArray as _}
            <td class="px-6 py-4 whitespace-nowrap">
              <Skeleton width="120px" height="1rem" />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
