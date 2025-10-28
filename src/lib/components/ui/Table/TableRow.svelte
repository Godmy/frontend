<script lang="ts">
  import type { HTMLTableRowAttributes } from 'svelte/elements';

  type Props = {
    striped?: boolean;
    active?: boolean;
    children?: any;
  } & HTMLTableRowAttributes;

  let { children, ...props }: Props = $props();

  let classes = $derived(`
    ${props.striped ? 'odd:bg-white even:bg-gray-50' : 'bg-white'}
    ${props.active ? 'bg-blue-50' : ''}
    ${props.class || ''}
  `.trim());
</script>

<tr {...props} class={classes}>
  {@render children()}
</tr>