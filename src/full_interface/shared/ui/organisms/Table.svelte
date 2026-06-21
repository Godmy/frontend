<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';

  type Props = {
    caption?: string;
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
  } & HTMLTableAttributes;

  let { caption, striped, bordered, hoverable, class: className = '', ...restProps }: Props = $props();

  let classes = $derived(`min-w-full divide-y divide-gray-200 ${className}`);
</script>

<table {...restProps} class={classes}>
  {#if caption}
    <caption class="py-3 px-6 text-left text-sm font-medium text-gray-900 bg-gray-50">
      {caption}
    </caption>
  {/if}
  <slot />
</table>