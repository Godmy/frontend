<script lang="ts">
  import type { HTMLTableCellAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'header' | 'data';
    align?: 'left' | 'center' | 'right';
  } & HTMLTableCellAttributes;

  let { variant = 'data', align = 'left', class: className = '', ...restProps }: Props = $props();

  let isHeader = $derived(variant === 'header');
  let alignmentClass = $derived({
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]);

  let classes = $derived(`
    px-6 py-4
    ${isHeader ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' : 'whitespace-nowrap'}
    ${alignmentClass}
    ${className}
  `.trim());
</script>

{#if isHeader}
  <th class={classes} {...restProps}>
    <slot />
  </th>
{:else}
  <td class={classes} {...restProps}>
    <slot />
  </td>
{/if}