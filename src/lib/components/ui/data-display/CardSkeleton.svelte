<script lang="ts">
  type Props = {
    count?: number;
    showAvatar?: boolean;
    class?: string;
  };

  let props: Props = $props();

  const items = Array.from({ length: props.count || 3 }, (_, i) => i);
</script>

<div class="space-y-4 {props.class || ''}">
  {#each items as _}
    <div class="border rounded-lg p-4 animate-pulse">
      {#if props.showAvatar}
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-gray-200 h-10 w-10"></div>
          <div class="ml-4">
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      {/if}
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  {/each}
</div>