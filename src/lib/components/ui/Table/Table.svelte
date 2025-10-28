<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';

  type Props = {
    caption?: string;
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
    children?: any;
  } & HTMLTableAttributes;

  let { children, ...props }: Props = $props();

  let classes = $derived(`min-w-full divide-y divide-gray-200 ${props.class || ''}`);
</script>

<table {...props} class={classes}>
  {#if props.caption}
    <caption class="py-3 px-6 text-left text-sm font-medium text-gray-900 bg-gray-50">
      {props.caption}
    </caption>
  {/if}
  {@render children()}
</table>