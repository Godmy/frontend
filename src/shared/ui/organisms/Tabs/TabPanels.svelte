<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let props: Props = $props();
</script>

<div {...props} class="mt-4 {props.class || ''}">
  <slot />
</div>

