<script lang="ts">
  type Props = {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    children: import('svelte').Snippet;
  };

  let { text, position = 'top', children }: Props = $props();
  let showTooltip = $state(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
</script>

<div class="relative inline-block">
  <div
    onmouseenter={() => (showTooltip = true)}
    onmouseleave={() => (showTooltip = false)}
    onfocus={() => (showTooltip = true)}
    onblur={() => (showTooltip = false)}
  >
    {@render children()}
  </div>

  {#if showTooltip}
    <div
      class="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap {positionClasses[position]}"
      role="tooltip"
    >
      {text}
      <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45"></div>
    </div>
  {/if}
</div>