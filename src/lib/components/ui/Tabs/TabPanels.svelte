<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: any;
  } & HTMLDivAttributes;
  
  let { children, ...props }: Props = $props();
</script>

<div {...props} class="mt-4 {props.class || ''}">
  {@render children()}
</div>