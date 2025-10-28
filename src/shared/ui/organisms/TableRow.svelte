<script lang="ts">
  import type { HTMLTableRowAttributes } from 'svelte/elements';

  type Props = {
    striped?: boolean;
    active?: boolean;
  } & HTMLTableRowAttributes;

  let { striped, active, class: className = '', ...restProps }: Props = $props();

  let classes = $derived(`
    ${striped ? 'odd:bg-white even:bg-gray-50' : 'bg-white'}
    ${active ? 'bg-blue-50' : ''}
    ${className}
  `.trim());
</script>

<tr {...restProps} class={classes}>
  <slot />
</tr>