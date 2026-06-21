<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
  } & HTMLDivAttributes;

  let props: Props = $props();
</script>

<div
  {...props}
  role="tablist"
  aria-orientation="horizontal"
  class="flex border-b border-gray-200 {props.class || ''}"
>
  <slot />
</div>
