<script lang="ts">
  import type { HTMLTableSectionAttributes } from 'svelte/elements';

  type Props = HTMLTableSectionAttributes;

  let { class: className = '', ...restProps }: Props = $props();
</script>

<tbody {...restProps} class="bg-white divide-y divide-gray-200 {className}">
  <slot />
</tbody>