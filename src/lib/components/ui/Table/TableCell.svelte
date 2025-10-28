<script lang="ts">
  import type { HTMLTableCellAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'header' | 'data';
    align?: 'left' | 'center' | 'right';
    children?: any;
  } & HTMLTableCellAttributes;

  let { children, ...props }: Props = $props();

  let isHeader = $derived(props.variant === 'header');
  let alignmentClass = $derived({
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[props.align || 'left']);

  let classes = $derived(`
    px-6 py-4
    ${isHeader ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' : 'whitespace-nowrap'}
    ${alignmentClass}
    ${props.class || ''}
  `.trim());
</script>

{#if isHeader}
  <th class={classes} {...props}>
    {@render children()}
  </th>
{:else}
  <td class={classes} {...props}>
    {@render children()}
  </td>
{/if}