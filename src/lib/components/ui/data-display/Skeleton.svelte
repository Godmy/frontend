<script lang="ts">
  type SkeletonVariant = 'text' | 'circular' | 'rectangular';
  
  type Props = {
    variant?: SkeletonVariant;
    width?: string;
    height?: string;
    class?: string;
  };

  let props: Props = $props();

  $: classes = `
    animate-pulse bg-gray-200
    ${props.variant === 'circular' ? 'rounded-full' : 
      props.variant === 'text' ? 'rounded' : 'rounded-md'}
    ${props.class || ''}
  `;
</script>

{#if props.variant === 'text'}
  <span
    class={classes}
    style="width: {props.width || '100%'}; height: {props.height || '1em'};"
    {...$$rest}
  ></span>
{:else}
  <div
    class={classes}
    style="width: {props.width}; height: {props.height};"
    {...$$rest}
  ></div>
{/if}