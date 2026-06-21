<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
  } & HTMLDivAttributes;

  let props: Props = $props();
</script>

<div {...props} class="mt-4 {props.class || ''}">
  <slot />
</div>
