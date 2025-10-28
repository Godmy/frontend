<script lang="ts">
  import type { HTMLTableSectionAttributes } from 'svelte/elements';

  type Props = {
    children?: any;
  } & HTMLTableSectionAttributes;

  let { children, ...props }: Props = $props();
</script>

<tbody {...props} class="bg-white divide-y divide-gray-200 {props.class || ''}">
  {@render children()}
</tbody>