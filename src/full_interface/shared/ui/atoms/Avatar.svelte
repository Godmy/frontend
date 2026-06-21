<script lang="ts">
  type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

  type Props = {
    src?: string;
    alt?: string;
    size?: AvatarSize;
    class?: string;
  };

  let {
    src,
    alt,
    size = 'md',
    class: className = '',
    ...restProps
  }: Props = $props();

  let sizeClasses = $derived({
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }[size]);

  let classes = $derived(`inline-flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-700 ${sizeClasses} ${className}`);
</script>

{#if src}
  <img
    src={src}
    alt={alt || ''}
    class={classes}
    {...restProps}
  />
{:else}
  <div class={classes} {...restProps}>
    {alt ? alt.charAt(0).toUpperCase() : '?'}
  </div>
{/if}