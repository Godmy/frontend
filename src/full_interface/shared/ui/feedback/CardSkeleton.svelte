<script lang="ts">
  import Skeleton from './Skeleton.svelte';

  type Props = {
    count?: number;
    showAvatar?: boolean;
  };

  let { count = 3, showAvatar = false }: Props = $props();

  const cards = Array.from({ length: count }, (_, i) => i);
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each cards as _}
    <div class="bg-white overflow-hidden shadow rounded-lg p-6">
      <div class="flex items-center space-x-4">
        {#if showAvatar}
          <Skeleton variant="circular" width="48px" height="48px" />
        {/if}
        <div class="flex-1 space-y-2">
          <Skeleton width="80%" height="1.25rem" />
          <Skeleton width="60%" height="1rem" />
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="90%" height="1rem" />
        <Skeleton width="70%" height="1rem" />
      </div>
    </div>
  {/each}
</div>
