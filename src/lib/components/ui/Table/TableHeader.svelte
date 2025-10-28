<script lang="ts">
  import type { HTMLTableSectionAttributes } from 'svelte/elements';

  type Props = {
    children?: any;
  } & HTMLTableSectionAttributes;

  let { children, ...props }: Props = $props();
</script>

<thead {...props} class="bg-gray-50 {props.class || ''}">
  {@render children()}
</thead>