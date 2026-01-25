<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLTableSectionElement>;

  let { class: className = '', ...restProps }: Props = $props();
</script>

<tbody {...restProps} class="bg-white divide-y divide-gray-200 {className}">
  <slot />
</tbody>
