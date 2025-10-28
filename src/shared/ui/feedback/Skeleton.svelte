<script lang="ts">
  type Props = {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string;
    height?: string;
    class?: string;
  };

  let {
    variant = 'text',
    width = '100%',
    height,
    class: className = ''
  }: Props = $props();

  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const defaultHeights = {
    text: '1rem',
    circular: '2rem',
    rectangular: '4rem'
  };

  const computedHeight = height || defaultHeights[variant];
  const computedWidth = variant === 'circular' ? computedHeight : width;
</script>

<div
  class="{baseClasses} {variantClasses[variant]} {className}"
  style="width: {computedWidth}; height: {computedHeight};"
  aria-busy="true"
  aria-live="polite"
></div>
