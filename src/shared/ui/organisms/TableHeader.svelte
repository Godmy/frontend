<script lang="ts">
  import type { HTMLTableSectionAttributes } from 'svelte/elements';

  type Props = HTMLTableSectionAttributes;

  let { class: className = '', ...restProps }: Props = $props();
</script>

<thead {...restProps} class="bg-gray-50 {className}">
  <slot />
</thead>