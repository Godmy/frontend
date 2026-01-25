<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLTableSectionElement>;

  let { class: className = '', ...restProps }: Props = $props();
</script>

<thead {...restProps} class="bg-gray-50 {className}">
  <slot />
</thead>
